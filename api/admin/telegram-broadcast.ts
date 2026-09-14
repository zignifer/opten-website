import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAdmin } from "../_shared/adminAuth.js";
import { jsonResponse, setJsonCors } from "../_shared/optenServerAuth.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setJsonCors(res, "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") return jsonResponse(res, 405, { error: "method_not_allowed" });
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  return jsonResponse(res, 410, { error: "telegram_bot_paused", paused: true, recipients: 0, sent: 0 });
}
