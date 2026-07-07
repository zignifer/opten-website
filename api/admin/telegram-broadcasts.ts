import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAdmin } from "../_shared/adminAuth.js";
import { jsonResponse, setJsonCors } from "../_shared/optenServerAuth.js";

const SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1";
const BROADCAST_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type BroadcastsBody = {
  action?: unknown;
  broadcast_id?: unknown;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setJsonCors(res, "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return jsonResponse(res, 405, { error: "method_not_allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const adminSecret = process.env.TELEGRAM_ADMIN_SECRET?.trim();
  if (!adminSecret) {
    return jsonResponse(res, 500, { error: "missing_telegram_admin_secret" });
  }

  if (req.method === "GET") {
    const limit = normalizeLimit(new URL(req.url || "/api/admin/telegram-broadcasts", "https://opten.space").searchParams.get("limit"));
    return proxyTelegramBroadcasts(adminSecret, "GET", `?limit=${limit}`, undefined, res);
  }

  const rawBody = await readJsonBody(req);
  if (!rawBody || typeof rawBody !== "object") {
    return jsonResponse(res, 400, { error: "invalid_json" });
  }

  const body = rawBody as BroadcastsBody;
  if (body.action !== "delete") return jsonResponse(res, 400, { error: "invalid_action" });
  if (typeof body.broadcast_id !== "string" || !BROADCAST_ID_RE.test(body.broadcast_id)) {
    return jsonResponse(res, 400, { error: "invalid_broadcast_id" });
  }

  return proxyTelegramBroadcasts(
    adminSecret,
    "POST",
    "",
    { action: "delete", broadcast_id: body.broadcast_id },
    res,
  );
}

async function proxyTelegramBroadcasts(
  adminSecret: string,
  method: "GET" | "POST",
  query: string,
  body: Record<string, unknown> | undefined,
  res: ServerResponse,
) {
  try {
    const upstream = await fetch(`${SUPABASE_FUNCTIONS_URL}/telegram-hidden-intro-broadcasts${query}`, {
      method,
      headers: {
        "X-Opten-Admin-Secret": adminSecret,
        ...(body ? { "Content-Type": "application/json" } : {}),
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await upstream.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return jsonResponse(res, 502, { error: "telegram_broadcasts_failed", upstream_status: upstream.status });
    }

    if (!upstream.ok) {
      const upstreamError = typeof (payload as { error?: unknown }).error === "string"
        ? (payload as { error: string }).error
        : "unknown";
      return jsonResponse(res, upstream.status === 404 ? 404 : 502, {
        error: upstreamError === "broadcast_not_found" ? "broadcast_not_found" : "telegram_broadcasts_failed",
        upstream_status: upstream.status,
        upstream_error: upstreamError,
      });
    }

    return jsonResponse(res, 200, payload as Record<string, unknown>);
  } catch {
    return jsonResponse(res, 502, { error: "telegram_broadcasts_unavailable" });
  }
}

function normalizeLimit(value: string | null): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(Math.floor(parsed), 50) : 20;
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 4_000) req.destroy();
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
