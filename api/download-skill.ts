// Phase 73 DIST-01: Auth-gated skill bundle download endpoint.
// Validates user's Supabase JWT, checks active Pro subscription, streams opten.zip.
// Free / non-Pro users get 403. Defense-in-depth — extension already prevents Free users
// from reaching this URL via Pro-gated UI in popup (Plan 03), but serverless validates again.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAyODUsImV4cCI6MjA5MTAzNjI4NX0.A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg";

// Vercel resolves the function dir relative to the deployed bundle. process.cwd() inside a Vercel
// serverless function points at the function's working dir; the _assets file is bundled alongside
// the function via Vercel's includeFiles mechanism (declared in vercel.json).
const ZIP_PATH = join(process.cwd(), "api", "_assets", "opten.zip");

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "https://opten.space",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export default async function handler(req: Request): Promise<Response> {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Extract JWT from Authorization header
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return new Response(JSON.stringify({ error: "missing_token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
      return new Response(JSON.stringify({ error: "invalid_token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = (await userRes.json()) as { id?: string };
    if (!user.id) {
      return new Response(JSON.stringify({ error: "no_user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    userId = user.id;
  } catch (e) {
    return new Response(JSON.stringify({ error: "auth_failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
      return new Response(JSON.stringify({ error: "sub_query_failed", code: subRes.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const rows = (await subRes.json()) as Array<{ plan: string; status: string }>;
    isPro = Array.isArray(rows) && rows.length > 0;
  } catch {
    return new Response(JSON.stringify({ error: "sub_query_error" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!isPro) {
    return new Response(JSON.stringify({ error: "not_pro", upgrade_url: "/account?upgrade=skill" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 4. Stream the ZIP. Read once into memory — bundle is ~6.5KB, way below the 4.5MB Vercel response limit.
  let zipBuf: Buffer;
  try {
    zipBuf = readFileSync(ZIP_PATH);
  } catch (e) {
    return new Response(JSON.stringify({ error: "asset_missing", path: ZIP_PATH }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(zipBuf, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="opten.zip"',
      "Content-Length": String(zipBuf.length),
      "Cache-Control": "no-store",
    },
  });
}
