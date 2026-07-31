import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAdmin } from "../_shared/adminAuth.js";
import { jsonResponse, setJsonCors } from "../_shared/optenServerAuth.js";
import { CONTENT_MACHINE_SNAPSHOT } from "./_contentMachineSnapshot.js";

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

  res.setHeader("Cache-Control", "private, no-store");
  return jsonResponse(res, 200, CONTENT_MACHINE_SNAPSHOT);
}
