import type { ServerResponse } from "node:http";
import { jwtVerify } from "jose";

const JWT_ISSUERS = [
  "https://vuywydhwkqmihfztpkgl.supabase.co/auth/v1",
  "https://supabase.opten.space/auth/v1",
];

const SUPABASE_URL = "https://supabase.opten.space";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAyODUsImV4cCI6MjA5MTAzNjI4NX0.A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg";

export const CORS_ORIGIN = "https://opten.space";

export type VerifiedSupabaseUser = {
  userId: string;
  email: string | null;
};

export function setJsonCors(res: ServerResponse, methods = "POST, OPTIONS") {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

export function jsonResponse(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export async function verifySupabaseJwt(token: string): Promise<VerifiedSupabaseUser> {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) throw new Error("missing_supabase_jwt_secret");

  const secret = new TextEncoder().encode(jwtSecret);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
    audience: "authenticated",
    issuer: JWT_ISSUERS,
    clockTolerance: "5s",
    requiredClaims: ["sub", "exp"],
  });

  return {
    userId: String(payload.sub),
    email: typeof payload.email === "string" ? payload.email : null,
  };
}

export async function hasLiveProSubscription(token: string, userId: string): Promise<boolean> {
  const subRes = await fetch(
    `${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(userId)}&plan=eq.pro&status=in.(active,cancelled)&select=plan,status,expires_at&order=created_at.desc&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
        Accept: "application/json",
      },
    },
  );

  if (!subRes.ok) {
    throw new Error(`sub_query_failed:${subRes.status}`);
  }

  const rows = (await subRes.json()) as Array<{ plan: string; status: string; expires_at: string | null }>;
  return Array.isArray(rows) && rows.some((row) => isSubscriptionPeriodLive(row.expires_at));
}

export async function hasCourseAccess(token: string, courseSlug: string): Promise<boolean> {
  const accessRes = await fetch(`${SUPABASE_URL}/functions/v1/course-access-summary`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ course_slug: courseSlug }),
  });

  if (!accessRes.ok) {
    throw new Error(`course_access_failed:${accessRes.status}`);
  }

  const body = (await accessRes.json()) as { has_access?: boolean };
  return body.has_access === true;
}

export function isSubscriptionPeriodLive(expiresAt: string | null): boolean {
  if (!expiresAt) return true;
  const expiresMs = Date.parse(expiresAt);
  return Number.isNaN(expiresMs) || expiresMs > Date.now();
}

export function bearerTokenFromHeader(header: string | undefined): string {
  return (header || "").replace(/^Bearer\s+/i, "").trim();
}
