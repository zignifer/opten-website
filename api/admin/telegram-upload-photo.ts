import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAdmin } from "../_shared/adminAuth.js";
import { jsonResponse, setJsonCors } from "../_shared/optenServerAuth.js";

const SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1";
const MAX_BASE64_CHARS = 2_097_152;
const VALID_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadBody = {
  file_name?: unknown;
  content_type?: unknown;
  data_base64?: unknown;
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

  const body = rawBody as UploadBody;
  const contentType = typeof body.content_type === "string" ? body.content_type.trim().toLowerCase() : "";
  const dataBase64 = typeof body.data_base64 === "string" ? body.data_base64.trim() : "";
  const fileName = typeof body.file_name === "string" ? body.file_name.trim().slice(0, 160) : "";

  if (!VALID_CONTENT_TYPES.has(contentType)) return jsonResponse(res, 400, { error: "invalid_content_type" });
  if (!dataBase64 || dataBase64.length > MAX_BASE64_CHARS || !/^[A-Za-z0-9+/]+={0,2}$/.test(dataBase64)) {
    return jsonResponse(res, 400, { error: "invalid_image_data" });
  }

  try {
    const upstream = await fetch(`${SUPABASE_FUNCTIONS_URL}/telegram-hidden-intro-assets`, {
      method: "POST",
      headers: {
        "X-Opten-Admin-Secret": adminSecret,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        file_name: fileName || undefined,
        content_type: contentType,
        data_base64: dataBase64,
      }),
    });

    const payload = await upstream.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return jsonResponse(res, 502, { error: "telegram_upload_failed", upstream_status: upstream.status });
    }

    if (!upstream.ok) {
      return jsonResponse(res, 502, {
        error: "telegram_upload_failed",
        upstream_status: upstream.status,
        upstream_error: typeof (payload as { error?: unknown }).error === "string"
          ? (payload as { error: string }).error
          : "unknown",
      });
    }

    return jsonResponse(res, 200, payload as Record<string, unknown>);
  } catch {
    return jsonResponse(res, 502, { error: "telegram_upload_unavailable" });
  }
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 2_300_000) req.destroy();
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
