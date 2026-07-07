import type { IncomingMessage, ServerResponse } from "node:http";
import {
  bearerTokenFromHeader,
  jsonResponse,
  verifySupabaseJwt,
  type VerifiedSupabaseUser,
} from "./optenServerAuth.js";

const BOOTSTRAP_ADMIN_EMAILS = ["zignifer@gmail.com"];

export type AdminAuthResult = {
  user: VerifiedSupabaseUser;
  matchedBy: "user_id" | "email";
};

export async function requireAdmin(req: IncomingMessage, res: ServerResponse): Promise<AdminAuthResult | null> {
  const token = bearerTokenFromHeader(req.headers.authorization as string | undefined);
  if (!token) {
    jsonResponse(res, 401, { error: "missing_token" });
    return null;
  }

  let user: VerifiedSupabaseUser;
  try {
    user = await verifySupabaseJwt(token);
  } catch {
    jsonResponse(res, 401, { error: "invalid_token" });
    return null;
  }

  const matchedBy = matchAdminAllowlist(user);
  if (!matchedBy) {
    jsonResponse(res, 403, { error: "admin_forbidden" });
    return null;
  }

  return { user, matchedBy };
}

function matchAdminAllowlist(user: VerifiedSupabaseUser): "user_id" | "email" | null {
  const allowedUserIds = csvSet(process.env.OPTEN_ADMIN_USER_IDS);
  if (allowedUserIds.has(user.userId)) return "user_id";

  const email = normalizeEmail(user.email);
  if (!email) return null;

  const allowedEmails = new Set([
    ...BOOTSTRAP_ADMIN_EMAILS,
    ...Array.from(csvSet(process.env.OPTEN_ADMIN_EMAILS)).map((value) => value.toLowerCase()),
  ]);
  return allowedEmails.has(email) ? "email" : null;
}

function csvSet(value: string | undefined): Set<string> {
  return new Set(
    (value || "")
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function normalizeEmail(value: string | null): string | null {
  const normalized = value?.trim().toLowerCase() || "";
  return normalized.includes("@") ? normalized : null;
}
