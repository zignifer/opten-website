import type { IncomingMessage, ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { jwtVerify } from "jose";
import {
  KINESCOPE_PLAYBACK_AUDIENCE,
  KINESCOPE_PLAYBACK_ISSUER,
  findKinescopeCourseLesson,
  findKinescopeLessonByVideoId,
} from "./_shared/kinescopeCourse.js";

type KinescopeAuthRequest = {
  id?: string;
  token?: string;
  type?: string;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  if (!hasValidBasicAuth(req.headers.authorization as string | undefined)) {
    res.statusCode = 401;
    res.end();
    return;
  }

  let body: KinescopeAuthRequest;
  try {
    body = (await readJsonBody(req)) as KinescopeAuthRequest;
  } catch {
    res.statusCode = 400;
    res.end();
    return;
  }

  const knownVideo = findKinescopeLessonByVideoId(body.id);
  if (!knownVideo || !body.token) {
    res.statusCode = 403;
    res.end();
    return;
  }

  const playbackSecret = process.env.KINESCOPE_AUTH_JWT_SECRET;
  if (!playbackSecret) {
    res.statusCode = 503;
    res.end();
    return;
  }

  try {
    const { payload } = await jwtVerify(body.token, new TextEncoder().encode(playbackSecret), {
      algorithms: ["HS256"],
      audience: KINESCOPE_PLAYBACK_AUDIENCE,
      issuer: KINESCOPE_PLAYBACK_ISSUER,
      clockTolerance: "5s",
      requiredClaims: ["sub", "exp"],
    });

    const lesson = findKinescopeCourseLesson(String(payload.course_slug || ""), String(payload.lesson_slug || ""));
    if (!lesson || lesson.videoId !== body.id || payload.video_id !== body.id) {
      res.statusCode = 403;
      res.end();
      return;
    }
  } catch {
    res.statusCode = 403;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.end();
}

function hasValidBasicAuth(header: string | undefined): boolean {
  const expectedUser = process.env.KINESCOPE_DRM_AUTH_USERNAME;
  const expectedPassword = process.env.KINESCOPE_DRM_AUTH_PASSWORD;
  if (!expectedUser && !expectedPassword) return true;
  if (!expectedUser || !expectedPassword || !header?.startsWith("Basic ")) return false;

  const expected = Buffer.from(`${expectedUser}:${expectedPassword}`, "utf8");
  const actual = Buffer.from(header.slice("Basic ".length), "base64");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}
