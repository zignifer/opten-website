import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAdmin } from "../_shared/adminAuth.js";
import { jsonResponse, setJsonCors } from "../_shared/optenServerAuth.js";

// Owner authorization must not depend on the retired Telegram service.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setJsonCors(res, "GET, OPTIONS");
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  if (req.method !== "GET") return jsonResponse(res, 405, { error: "method_not_allowed" });
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  return jsonResponse(res, 200, { ok: true });
}
