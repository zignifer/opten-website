import type { IncomingMessage, ServerResponse } from "node:http";
import { SignJWT } from "jose";
import {
  KINESCOPE_PLAYBACK_AUDIENCE,
  KINESCOPE_PLAYBACK_ISSUER,
  KINESCOPE_PLAYBACK_TTL_SECONDS,
  buildKinescopeEmbedUrl,
  findKinescopeCourseLesson,
} from "./_shared/kinescopeCourse.js";
import {
  bearerTokenFromHeader,
  hasLiveProSubscription,
  jsonResponse,
  setJsonCors,
  verifySupabaseJwt,
} from "./_shared/optenServerAuth.js";

type TokenRequestBody = {
  courseSlug?: string;
  lessonSlug?: string;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setJsonCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return jsonResponse(res, 405, { error: "method_not_allowed" });
  }

  let body: TokenRequestBody;
  try {
    body = (await readJsonBody(req)) as TokenRequestBody;
  } catch {
    return jsonResponse(res, 400, { error: "invalid_json" });
  }

  const lesson = findKinescopeCourseLesson(body.courseSlug, body.lessonSlug);
  if (!lesson) {
    return jsonResponse(res, 404, { error: "lesson_not_found" });
  }

  const authToken = bearerTokenFromHeader(req.headers.authorization as string | undefined);
  if (!authToken) {
    return jsonResponse(res, 401, { error: "missing_token" });
  }

  let userId: string;
  try {
    const verified = await verifySupabaseJwt(authToken);
    userId = verified.userId;
  } catch {
    return jsonResponse(res, 401, { error: "invalid_token" });
  }

  try {
    const isPro = await hasLiveProSubscription(authToken, userId);
    if (!isPro) {
      return jsonResponse(res, 403, { error: "not_pro", upgrade_url: "/pay" });
    }
  } catch {
    return jsonResponse(res, 502, { error: "sub_query_failed" });
  }

  const playbackSecret = process.env.KINESCOPE_AUTH_JWT_SECRET;
  if (!playbackSecret) {
    return jsonResponse(res, 500, { error: "missing_kinescope_secret" });
  }

  const expiresAtSeconds = Math.floor(Date.now() / 1000) + KINESCOPE_PLAYBACK_TTL_SECONDS;
  const drmAuthToken = await new SignJWT({
    course_slug: lesson.courseSlug,
    lesson_slug: lesson.lessonSlug,
    video_id: lesson.videoId,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuer(KINESCOPE_PLAYBACK_ISSUER)
    .setAudience(KINESCOPE_PLAYBACK_AUDIENCE)
    .setExpirationTime(expiresAtSeconds)
    .setIssuedAt()
    .sign(new TextEncoder().encode(playbackSecret));

  return jsonResponse(res, 200, {
    provider: "kinescope",
    embedUrl: buildKinescopeEmbedUrl(lesson.videoId, drmAuthToken),
    expiresAt: expiresAtSeconds,
  });
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}
