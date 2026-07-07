import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAdmin } from "../_shared/adminAuth.js";
import { jsonResponse, setJsonCors } from "../_shared/optenServerAuth.js";

const SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setJsonCors(res, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    return jsonResponse(res, 405, { error: "method_not_allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const adminSecret = process.env.TELEGRAM_ADMIN_SECRET?.trim();
  if (!adminSecret) {
    return jsonResponse(res, 500, { error: "missing_telegram_admin_secret" });
  }

  try {
    const upstream = await fetch(`${SUPABASE_FUNCTIONS_URL}/telegram-hidden-intro-stats`, {
      method: "GET",
      headers: {
        "X-Opten-Admin-Secret": adminSecret,
        Accept: "application/json",
      },
    });

    const body = await upstream.json().catch(() => null);
    if (!upstream.ok || !body || typeof body !== "object") {
      return jsonResponse(res, 502, {
        error: "telegram_stats_failed",
        upstream_status: upstream.status,
      });
    }

    return jsonResponse(res, 200, body as Record<string, unknown>);
  } catch {
    return jsonResponse(res, 502, { error: "telegram_stats_unavailable" });
  }
}
