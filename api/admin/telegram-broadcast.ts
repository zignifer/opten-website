import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAdmin } from "../_shared/adminAuth.js";
import { jsonResponse, setJsonCors } from "../_shared/optenServerAuth.js";

const SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1";
const VALID_SEGMENTS = new Set(["all", "subscribed", "access_granted", "access_granted_not_paid"]);

type BroadcastBody = {
  text?: unknown;
  photo_url?: unknown;
  button_text?: unknown;
  button_url?: unknown;
  segment?: unknown;
  limit?: unknown;
  dry_run?: unknown;
  confirm?: unknown;
  confirm_recipients?: unknown;
};

type BroadcastPayload = {
  text: string;
  photo_url?: string;
  button_text?: string;
  button_url?: string;
  segment: string;
  limit: number;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setJsonCors(res, "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return jsonResponse(res, 405, { error: "method_not_allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const adminSecret = process.env.TELEGRAM_ADMIN_SECRET?.trim();
  if (!adminSecret) {
    return jsonResponse(res, 500, { error: "missing_telegram_admin_secret" });
  }

  const rawBody = await readJsonBody(req);
  if (!rawBody || typeof rawBody !== "object") {
    return jsonResponse(res, 400, { error: "invalid_json" });
  }

  const body = rawBody as BroadcastBody;
  const payload = normalizeBroadcastPayload(body);
  const validationError = validateBroadcastPayload(payload);
  if (validationError) return jsonResponse(res, 400, validationError);

  const isDryRun = body.dry_run === true;
  if (isDryRun) {
    return proxyTelegramBroadcast(adminSecret, { ...payload, dry_run: true }, res);
  }

  if (body.confirm !== true || typeof body.confirm_recipients !== "number") {
    return jsonResponse(res, 400, { error: "confirmation_required" });
  }

  const preview = await callTelegramBroadcast(adminSecret, { ...payload, dry_run: true });
  if (!preview.ok) return jsonResponse(res, preview.status, preview.body);

  const currentRecipients = typeof preview.body?.recipients === "number" ? preview.body.recipients : null;
  if (currentRecipients === null) {
    return jsonResponse(res, 502, { error: "telegram_broadcast_preview_failed" });
  }
  if (currentRecipients <= 0) {
    return jsonResponse(res, 409, { error: "empty_recipients", recipients: currentRecipients });
  }
  if (currentRecipients !== body.confirm_recipients) {
    return jsonResponse(res, 409, { error: "recipient_count_changed", recipients: currentRecipients });
  }

  return proxyTelegramBroadcast(adminSecret, { ...payload, dry_run: false }, res);
}

function normalizeBroadcastPayload(body: BroadcastBody): BroadcastPayload {
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const photoUrl = typeof body.photo_url === "string" ? body.photo_url.trim() : "";
  const buttonText = typeof body.button_text === "string" ? body.button_text.trim() : "";
  const buttonUrl = typeof body.button_url === "string" ? body.button_url.trim() : "";
  const segment = typeof body.segment === "string" && VALID_SEGMENTS.has(body.segment) ? body.segment : "all";
  const limit = typeof body.limit === "number" && Number.isFinite(body.limit) && body.limit > 0
    ? Math.min(Math.floor(body.limit), 5000)
    : 5000;

  return {
    text,
    ...(photoUrl ? { photo_url: photoUrl } : {}),
    ...(buttonText ? { button_text: buttonText } : {}),
    ...(buttonUrl ? { button_url: buttonUrl } : {}),
    segment,
    limit,
  };
}

function validateBroadcastPayload(payload: BroadcastPayload): Record<string, unknown> | null {
  if (!payload.text && !payload.photo_url) return { error: "empty_message" };
  if ((payload.button_text && !payload.button_url) || (!payload.button_text && payload.button_url)) {
    return { error: "invalid_button" };
  }
  if (payload.photo_url && !isSafeHttpsUrl(payload.photo_url)) return { error: "invalid_photo_url" };
  if (payload.button_url && !isSafeHttpUrl(payload.button_url)) return { error: "invalid_button_url" };
  if (payload.photo_url && [...payload.text].length > 1024) return { error: "caption_too_long", limit: 1024 };
  if (!payload.photo_url && [...payload.text].length > 4096) return { error: "message_too_long", limit: 4096 };
  return null;
}

function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const pathname = url.pathname.toLowerCase();
    return url.protocol === "https:" && !pathname.endsWith(".svg") && !pathname.endsWith(".html") && !pathname.endsWith(".htm");
  } catch {
    return false;
  }
}

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function proxyTelegramBroadcast(
  adminSecret: string,
  body: BroadcastPayload & { dry_run: boolean },
  res: ServerResponse,
) {
  const upstream = await callTelegramBroadcast(adminSecret, body);
  return jsonResponse(res, upstream.status, upstream.body);
}

async function callTelegramBroadcast(
  adminSecret: string,
  body: BroadcastPayload & { dry_run: boolean },
): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
  try {
    const upstream = await fetch(`${SUPABASE_FUNCTIONS_URL}/telegram-hidden-intro-broadcast`, {
      method: "POST",
      headers: {
        "X-Opten-Admin-Secret": adminSecret,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await upstream.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return { ok: false, status: 502, body: { error: "telegram_broadcast_failed", upstream_status: upstream.status } };
    }

    if (!upstream.ok) {
      return {
        ok: false,
        status: 502,
        body: {
          error: "telegram_broadcast_failed",
          upstream_status: upstream.status,
          upstream_error: typeof (payload as { error?: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "unknown",
        },
      };
    }

    return { ok: true, status: 200, body: payload as Record<string, unknown> };
  } catch {
    return { ok: false, status: 502, body: { error: "telegram_broadcast_unavailable" } };
  }
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 24_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}
