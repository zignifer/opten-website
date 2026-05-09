// Phase 73 DIST-01: Auth-gated skill bundle download endpoint.
// Validates user's Supabase JWT, checks active Pro subscription, streams opten.zip.
// Free / non-Pro users get 403. Defense-in-depth — extension already prevents Free users
// from reaching this URL via Pro-gated UI in popup (Plan 03), but serverless validates again.
//
// Uses Vercel's canonical Node.js handler signature (req, res) for maximum runtime
// compatibility. Web Standard Request/Response signature was causing FUNCTION_INVOCATION_FAILED
// on this project's Vercel runtime — the (req, res) variant is the well-trodden path.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

const SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAyODUsImV4cCI6MjA5MTAzNjI4NX0.A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg";

// Vercel bundles `api/_assets/**` alongside the function via vercel.json includeFiles.
// process.cwd() in Vercel serverless = function root, so `api/_assets/opten.zip` resolves correctly.
const ZIP_PATH = join(process.cwd(), "api", "_assets", "opten.zip");

const CORS_ORIGIN = "https://opten.space";

function setCors(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

function jsonError(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    return jsonError(res, 405, { error: "method_not_allowed" });
  }

  // 1. Extract JWT from Authorization header
  const authHeader = (req.headers["authorization"] as string | undefined) || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return jsonError(res, 401, { error: "missing_token" });
  }

  // 2. Validate JWT against Supabase auth
  let userId: string;
  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });
    if (!userRes.ok) {
      return jsonError(res, 401, { error: "invalid_token" });
    }
    const user = (await userRes.json()) as { id?: string };
    if (!user.id) {
      return jsonError(res, 401, { error: "no_user" });
    }
    userId = user.id;
  } catch {
    return jsonError(res, 502, { error: "auth_failed" });
  }

  // 3. Query subscriptions table — RLS allows user to read their own row.
  // Filter: plan='pro' AND status='active'. Covers both YooKassa and Paddle providers.
  let isPro = false;
  try {
    const subRes = await fetch(
      `${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&plan=eq.pro&status=eq.active&select=plan,status&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: SUPABASE_ANON_KEY,
          Accept: "application/json",
        },
      }
    );
    if (!subRes.ok) {
      return jsonError(res, 502, { error: "sub_query_failed", code: subRes.status });
    }
    const rows = (await subRes.json()) as Array<{ plan: string; status: string }>;
    isPro = Array.isArray(rows) && rows.length > 0;
  } catch {
    return jsonError(res, 502, { error: "sub_query_error" });
  }

  if (!isPro) {
    return jsonError(res, 403, { error: "not_pro", upgrade_url: "/account?upgrade=skill" });
  }

  // 4. Stream the ZIP. Read once into memory — bundle is ~6.5KB, way below the 4.5MB Vercel response limit.
  let zipBuf: Buffer;
  try {
    zipBuf = readFileSync(ZIP_PATH);
  } catch {
    return jsonError(res, 500, { error: "asset_missing", path: ZIP_PATH });
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="opten.zip"');
  res.setHeader("Content-Length", String(zipBuf.length));
  res.setHeader("Cache-Control", "no-store");
  res.end(zipBuf);
}
