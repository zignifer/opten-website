import type { IncomingMessage, ServerResponse } from "node:http";
import { SignJWT } from "jose";
import {
  KINESCOPE_PLAYBACK_AUDIENCE,
  KINESCOPE_PLAYBACK_ISSUER,
  KINESCOPE_PLAYBACK_TTL_SECONDS,
  buildKinescopeEmbedUrl,
  findKinescopeCourseLesson,
  isKinescopeTelegramPreviewLesson,
} from "./_shared/kinescopeCourse.js";
import {
  bearerTokenFromHeader,
  hasCourseAccess,
  hasTelegramCoursePreviewAccess,
  jsonResponse,
  setJsonCors,
  verifySupabaseJwt,
} from "./_shared/optenServerAuth.js";

type TokenRequestBody = {
  courseSlug?: string;
  lessonSlug?: string;
  telegramPreviewClaim?: string;
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

  const telegramPreviewClaim = typeof body.telegramPreviewClaim === "string" ? body.telegramPreviewClaim.trim() : "";
  const canTryTelegramPreview = isKinescopeTelegramPreviewLesson(lesson) && /^[A-Za-z0-9_-]{32,160}$/.test(telegramPreviewClaim);
  const authToken = bearerTokenFromHeader(req.headers.authorization as string | undefined);
  let userId = "";
  let accessMode: "course-entitlement" | "telegram-course-preview" | null = null;
  let authError: "invalid_token" | "course_access_query_failed" | null = null;

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
        authError = "course_access_query_failed";
      }
    } catch {
      authError = "invalid_token";
    }
  }

  if (!accessMode && canTryTelegramPreview) {
    try {
      if (await hasTelegramCoursePreviewAccess(telegramPreviewClaim)) {
        userId = `telegram-course-preview:${lesson.courseSlug}`;
        accessMode = "telegram-course-preview";
      }
    } catch {
      return jsonResponse(res, 502, { error: "telegram_preview_access_query_failed" });
    }
  }

  if (!accessMode && authError === "course_access_query_failed") {
    return jsonResponse(res, 502, { error: authError });
  }
  if (!accessMode && authError === "invalid_token") {
    return jsonResponse(res, 401, { error: authError });
  }
  if (!accessMode && !authToken) {
    return jsonResponse(res, canTryTelegramPreview ? 403 : 401, {
      error: canTryTelegramPreview ? "telegram_preview_access_required" : "missing_token",
    });
  }
  if (!accessMode) {
    return jsonResponse(res, 403, {
      error: "course_access_required",
      purchase_url: `/learn/courses/${lesson.courseSlug}/${lesson.lessonSlug}`,
    });
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
