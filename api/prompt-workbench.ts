// Pro-only landing Prompt Workbench.
// Mirrors the extension popup's POPUP_REWRITE_PROMPT quick-Improve transport.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { PROMPT_WORKBENCH_MODELS, type PromptWorkbenchType } from "../src/content/promptWorkbenchModels";
import {
  bearerTokenFromHeader,
  hasLiveProSubscription,
  verifySupabaseUser,
} from "./_shared/optenServerAuth";

const PROXY_URL = "https://promptscore-proxy.vercel.app";
const MIN_PROMPT_CHARS = 20;
const MAX_PROMPT_CHARS = 6_000;
const MAX_BODY_BYTES = 2_000_000;
const MAX_REFERENCE_COUNT = 8;
const MAX_REFERENCE_BASE64_CHARS = 400_000;
const PROXY_TIMEOUT_MS = 30_000;
const PROXY_RETRIES = 2;

interface WorkbenchRequest {
  action?: unknown;
  prompt?: unknown;
  model?: unknown;
  images?: unknown;
}

interface ReferenceImage {
  data: string;
  mediaType: "image/jpeg";
}

type ProAccess =
  | { status: "ready"; token: string }
  | { status: "authentication_required" }
  | { status: "pro_required" }
  | { status: "entitlement_unavailable" };

type ProxyPayload = {
  content?: Array<{ type?: string; text?: string }>;
  remaining?: number;
  limit?: number;
  plan?: string;
};

function json(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function setSecurityHeaders(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

async function readJsonBody(req: IncomingMessage): Promise<WorkbenchRequest> {
  const preParsed = (req as IncomingMessage & { body?: unknown }).body;
  if (preParsed && typeof preParsed === "object" && !Buffer.isBuffer(preParsed)) {
    if (Buffer.byteLength(JSON.stringify(preParsed), "utf8") > MAX_BODY_BYTES) throw new Error("body_too_large");
    return preParsed as WorkbenchRequest;
  }
  if (typeof preParsed === "string" && preParsed.trim()) {
    if (Buffer.byteLength(preParsed, "utf8") > MAX_BODY_BYTES) throw new Error("body_too_large");
    return JSON.parse(preParsed) as WorkbenchRequest;
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("body_too_large");
    chunks.push(buffer);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as WorkbenchRequest;
}

function normalizeReferences(value: unknown): ReferenceImage[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_REFERENCE_COUNT) throw new Error("invalid_references");

  return value.map((item) => {
    if (!item || typeof item !== "object") throw new Error("invalid_references");
    const candidate = item as { data?: unknown; mediaType?: unknown };
    if (
      typeof candidate.data !== "string"
      || candidate.data.length === 0
      || candidate.data.length > MAX_REFERENCE_BASE64_CHARS
      || !/^[A-Za-z0-9+/]+={0,2}$/.test(candidate.data)
      || candidate.mediaType !== "image/jpeg"
    ) {
      throw new Error("invalid_references");
    }
    return { data: candidate.data, mediaType: "image/jpeg" };
  });
}

function getModelType(slug: string): PromptWorkbenchType | null {
  if (PROMPT_WORKBENCH_MODELS.image.some((model) => model.slug === slug)) return "image";
  if (PROMPT_WORKBENCH_MODELS.video.some((model) => model.slug === slug)) return "video";
  return null;
}

function buildMultimodalContent(textContent: string, images: ReferenceImage[]) {
  if (images.length === 0) return textContent;
  return [
    ...images.flatMap((image, index) => [
      { type: "text", text: `Reference image ${index + 1}:` },
      {
        type: "image",
        source: { type: "base64", media_type: image.mediaType, data: image.data },
      },
    ]),
    { type: "text", text: textContent },
  ];
}

function buildRewriterReminder(lang: "ru" | "en") {
  if (lang === "ru") {
    return `

---
НАПОМИНАНИЕ:
1. Весь ответ ДОЛЖЕН быть на русском языке — каждое слово, каждый заголовок, каждая метка/label, каждый параметр. Не оставляй ни одного английского слова.
2. Если в оригинальном промпте выше есть английские фрагменты (например, «Preserve: ...», «Constraints: ...», «Negative: ...», «Style: ...» или другие английские заголовки/инструкции) — ПЕРЕВЕДИ их на русский в своём ответе. Например: «Preserve» → «Сохранить», «Constraints» → «Ограничения», «Negative» → «Исключить», «Style» → «Стиль». Перевод значений тоже обязателен. «Сохранить смысл» означает сохранить намерение пользователя, НЕ дословное английское написание.
3. Верни ТОЛЬКО улучшенный текст промпта. Никаких заголовков (например, «Улучшенный промпт для X:»), никаких преамбул, никаких пояснений, никаких markdown-блоков, никаких кавычек. Первый символ ответа = первый символ улучшенного промпта.`;
  }
  return `

---
REMINDER:
1. The entire response MUST be in English — every word, every header, every label, every parameter. Do not leave any non-English text.
2. If the original prompt above contains fragments in another language (e.g. Russian labels like «Сохранить: ...», «Ограничения: ...», «Стиль: ...» or any other foreign-language headers/instructions) — TRANSLATE them into English in your response. For example: «Сохранить» → «Preserve», «Ограничения» → «Constraints», «Стиль» → «Style». Translate the values too. "Preserve intent" means preserving the user's semantic intent, NOT preserving the verbatim wording in a foreign language.
3. Return ONLY the improved prompt text. No headers (e.g., "Improved prompt for X:"), no preamble, no explanations, no markdown, no quotes. The first character of your response is the first character of the improved prompt.`;
}

function cleanRewrittenText(value: unknown): string {
  if (typeof value !== "string") throw new Error("empty_model_response");
  const withoutFences = value
    .trim()
    .replace(/^```(?:[a-z]+)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const preamble = /^\s*(?:улучшенный\s+промпт[^\n]*?:|улучшенная\s+версия[^\n]*?:|вот\s+улучшенный[^\n]*?:|improved\s+prompt[^\n]*?:|enhanced\s+prompt[^\n]*?:|rewritten\s+prompt[^\n]*?:|here(?:'s|\s+is)\s+(?:the\s+)?(?:improved|rewritten|enhanced)[^\n]*?:)\s*\n+/i;
  const result = withoutFences.replace(preamble, "").trim();
  if (!result) throw new Error("empty_model_response");
  return result;
}

function readServerAsset(...segments: string[]) {
  return readFileSync(join(process.cwd(), ...segments), "utf8");
}

async function resolveProAccess(req: IncomingMessage): Promise<ProAccess> {
  const token = bearerTokenFromHeader(req.headers.authorization);
  if (!token) return { status: "authentication_required" };

  let userId: string;
  try {
    const user = await verifySupabaseUser(token);
    userId = user.userId;
  } catch (error) {
    return { status: "authentication_required" };
  }

  try {
    return await hasLiveProSubscription(token, userId)
      ? { status: "ready", token }
      : { status: "pro_required" };
  } catch {
    return { status: "entitlement_unavailable" };
  }
}

async function callQuickImproveProxy(
  token: string,
  prompt: string,
  modelSlug: string,
  modelType: PromptWorkbenchType,
  images: ReferenceImage[],
): Promise<{ prompt: string; usage: Pick<ProxyPayload, "remaining" | "limit" | "plan"> }> {
  const lang: "ru" | "en" = /[а-яё]/i.test(prompt) ? "ru" : "en";
  const systemPrompt = readServerAsset("api", "_assets", "prompt-workbench", "rewriter.md");
  const userMessage = `RESPOND_IN: ${lang}\n\nORIGINAL PROMPT:\n${prompt}${buildRewriterReminder(lang)}`;
  const userContent = buildMultimodalContent(userMessage, images);
  const requestBody = JSON.stringify({
    prompt: userMessage,
    messages: [{ role: "user", content: userContent }],
    model_name: modelSlug,
    is_video: modelType === "video",
    system_prompt: systemPrompt,
    max_tokens: 1_200,
    count_usage: true,
    source: "popup",
  });

  let lastError: unknown = new Error("pro_provider_unavailable");
  for (let attempt = 0; attempt <= PROXY_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
    try {
      const response = await fetch(`${PROXY_URL}/api/rewrite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
        signal: controller.signal,
      });

      if ((response.status === 502 || response.status === 503 || response.status === 504) && attempt < PROXY_RETRIES) {
        continue;
      }

      const payload = await response.json().catch(() => ({})) as ProxyPayload;
      if (response.status === 401) throw new Error("authentication_required");
      if (response.status === 403) throw new Error("pro_required");
      if (response.status === 429) throw new Error("pro_limit_reached");
      if (!response.ok) throw new Error("pro_provider_unavailable");

      const text = payload.content?.find((item) => item?.type === "text" && typeof item.text === "string")?.text;
      return {
        prompt: cleanRewrittenText(text).slice(0, 12_000),
        usage: { remaining: payload.remaining, limit: payload.limit, plan: payload.plan },
      };
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      if (code === "authentication_required" || code === "pro_required" || code === "pro_limit_reached") throw error;
      lastError = error;
      if (attempt >= PROXY_RETRIES) throw error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setSecurityHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });

  let body: WorkbenchRequest;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    return json(res, error instanceof Error && error.message === "body_too_large" ? 413 : 400, { error: "invalid_body" });
  }

  if (body.action !== "improve") return json(res, 400, { error: "invalid_action" });
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (prompt.length < MIN_PROMPT_CHARS) return json(res, 422, { error: "prompt_too_short", min_chars: MIN_PROMPT_CHARS });
  if (prompt.length > MAX_PROMPT_CHARS) return json(res, 413, { error: "prompt_too_long", max_chars: MAX_PROMPT_CHARS });

  const modelSlug = typeof body.model === "string" ? body.model : "";
  const modelType = getModelType(modelSlug);
  if (!modelType) return json(res, 400, { error: "invalid_model" });

  let images: ReferenceImage[];
  try {
    images = normalizeReferences(body.images);
  } catch {
    return json(res, 400, { error: "invalid_references" });
  }

  const access = await resolveProAccess(req);
  if (access.status === "authentication_required") return json(res, 401, { error: access.status });
  if (access.status === "pro_required") return json(res, 403, { error: access.status });
  if (access.status === "entitlement_unavailable") return json(res, 503, { error: access.status });

  try {
    const result = await callQuickImproveProxy(access.token, prompt, modelSlug, modelType, images);
    return json(res, 200, {
      action: "improve",
      result: { prompt: result.prompt },
      provider_model: "Opten Pro",
      tier: "pro",
      ...result.usage,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "pro_provider_unavailable";
    const isTimeout = error instanceof Error && error.name === "AbortError";
    if (code === "authentication_required") return json(res, 401, { error: code });
    if (code === "pro_required") return json(res, 403, { error: code });
    if (code === "pro_limit_reached") return json(res, 429, { error: code });
    return json(res, isTimeout ? 504 : 502, { error: isTimeout ? "provider_timeout" : "provider_unavailable" });
  }
}
