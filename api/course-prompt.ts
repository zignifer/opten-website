import type { IncomingMessage, ServerResponse } from "node:http";
import { findCoursePromptBody } from "./_shared/coursePromptBodies.js";
import {
  bearerTokenFromHeader,
  hasCourseAccess,
  jsonResponse,
  setJsonCors,
  verifySupabaseJwt,
} from "./_shared/optenServerAuth.js";

type CoursePromptRequestBody = {
  courseSlug?: string;
  lessonSlug?: string;
  promptId?: string;
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

  let body: CoursePromptRequestBody;
  try {
    body = (await readJsonBody(req)) as CoursePromptRequestBody;
  } catch {
    return jsonResponse(res, 400, { error: "invalid_json" });
  }

  const prompt = findCoursePromptBody(body.courseSlug, body.lessonSlug, body.promptId);
  if (!prompt) {
    return jsonResponse(res, 404, { error: "prompt_not_found" });
  }

  const authToken = bearerTokenFromHeader(req.headers.authorization as string | undefined);
  if (!authToken) {
    return jsonResponse(res, 401, { error: "missing_token" });
  }

  try {
    await verifySupabaseJwt(authToken);
  } catch {
    return jsonResponse(res, 401, { error: "invalid_token" });
  }

  try {
    const allowed = await hasCourseAccess(authToken, prompt.courseSlug);
    if (!allowed) {
      return jsonResponse(res, 403, { error: "course_access_required" });
    }
  } catch {
    return jsonResponse(res, 502, { error: "course_access_query_failed" });
  }

  return jsonResponse(res, 200, {
    prompt: {
      id: prompt.id,
      body: prompt.body,
      sourceLabel: prompt.sourceLabel ?? null,
      language: prompt.language,
    },
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
