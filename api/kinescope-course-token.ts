import type { IncomingMessage, ServerResponse } from "node:http";
import { SignJWT } from "jose";
import {
  KINESCOPE_PLAYBACK_AUDIENCE,
  KINESCOPE_PLAYBACK_ISSUER,
  KINESCOPE_PLAYBACK_TTL_SECONDS,
  KINESCOPE_HIDDEN_INTRO_LESSON_SLUG,
  buildKinescopeEmbedUrl,
  findKinescopeCourseLesson,
} from "./_shared/kinescopeCourse.js";
import {
  bearerTokenFromHeader,
  hasCourseAccess,
  jsonResponse,
  setJsonCors,
  verifySupabaseJwt,
} from "./_shared/optenServerAuth.js";

type TokenRequestBody = {
  courseSlug?: string;
  lessonSlug?: string;
  hiddenIntroUnlocked?: boolean;
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

  const hiddenIntroBrowserUnlock =
    lesson.lessonSlug === KINESCOPE_HIDDEN_INTRO_LESSON_SLUG && body.hiddenIntroUnlocked === true;
  const authToken = bearerTokenFromHeader(req.headers.authorization as string | undefined);
  let userId = "";
  let accessMode: "course-entitlement" | "telegram-hidden-intro" | null = null;

  if (authToken) {
    try {
      const verified = await verifySupabaseJwt(authToken);
      try {
        const allowed = await hasCourseAccess(authToken, lesson.courseSlug);
        if (allowed) {
          userId = verified.userId;
          accessMode = "course-entitlement";
        }
      } catch {
        if (!hiddenIntroBrowserUnlock) {
          return jsonResponse(res, 502, { error: "course_access_query_failed" });
        }
      }
    } catch {
      if (!hiddenIntroBrowserUnlock) {
        return jsonResponse(res, 401, { error: "invalid_token" });
      }
    }
  }

  if (!accessMode) {
    if (hiddenIntroBrowserUnlock) {
      userId = `telegram-hidden-intro:${lesson.courseSlug}`;
      accessMode = "telegram-hidden-intro";
    } else if (!authToken) {
      return jsonResponse(res, 401, { error: "missing_token" });
    } else {
      return jsonResponse(res, 403, {
        error: "course_access_required",
        purchase_url: `/learn/courses/${lesson.courseSlug}/${lesson.lessonSlug}`,
      });
    }
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
    access_mode: accessMode,
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
