export const SUPABASE_URL = "https://supabase.opten.space";
export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAyODUsImV4cCI6MjA5MTAzNjI4NX0.A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg";

export const SPACE_SESSION_STORAGE_KEY = "opten_space_session_v1";

export type OptenUser = {
  id: string;
  email: string | null;
};

export type OptenSession = {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  expires_at: number;
  user: OptenUser;
};

export type AccountSummary = {
  id: string;
  email: string | null;
  provisioned: boolean;
  plan: "free" | "pro";
  status: "active" | "cancelled" | "past_due" | null;
  limit: number;
  used: number;
  remaining: number;
  expires_at: string | null;
  auto_renew: boolean;
  card_last4: string | null;
  card_type: string | null;
  has_card: boolean;
  provider: string | null;
  currency: string | null;
};

type SupabaseTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
  error?: string;
  error_description?: string;
};

export function getAppAuthCallbackUrl(): string {
  if (typeof window === "undefined") return "https://opten.space/app/auth/callback";
  return `${window.location.origin}/app/auth/callback`;
}

export function startGoogleLogin(redirectTo = getAppAuthCallbackUrl()): void {
  const url = new URL(`${SUPABASE_URL}/auth/v1/authorize`);
  url.searchParams.set("provider", "google");
  url.searchParams.set("redirect_to", redirectTo);
  window.location.href = url.toString();
}

export async function sendMagicLink(email: string, redirectTo = getAppAuthCallbackUrl()): Promise<void> {
  const url = new URL(`${SUPABASE_URL}/auth/v1/otp`);
  url.searchParams.set("redirect_to", redirectTo);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      type: "magiclink",
      options: { email_redirect_to: redirectTo },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.msg || body?.error_description || body?.error || "magic_link_failed");
  }
}

export function readSession(): OptenSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SPACE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OptenSession;
    if (!parsed.access_token || !parsed.user?.id) return null;
    return parsed;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") localStorage.removeItem(SPACE_SESSION_STORAGE_KEY);
}

export function storeSessionFromUrl(url = typeof window !== "undefined" ? window.location.href : ""): OptenSession {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.hash.startsWith("#") ? parsedUrl.hash.slice(1) : parsedUrl.search);
  const error = params.get("error") || params.get("error_code");
  if (error) throw new Error(params.get("error_description") || error);

  const session = sessionFromTokenResponse({
    access_token: params.get("access_token") || undefined,
    refresh_token: params.get("refresh_token") || undefined,
    token_type: params.get("token_type") || undefined,
    expires_in: numberParam(params.get("expires_in")),
    expires_at: numberParam(params.get("expires_at")),
  });
  writeSession(session);
  return session;
}

export async function refreshSessionIfNeeded(session = readSession()): Promise<OptenSession | null> {
  if (!session) return null;
  const refreshWindowSeconds = 90;
  if (session.expires_at - Math.floor(Date.now() / 1000) > refreshWindowSeconds) return session;
  if (!session.refresh_token) {
    clearSession();
    return null;
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  if (!res.ok) {
    clearSession();
    return null;
  }

  const body = (await res.json()) as SupabaseTokenResponse;
  const next = sessionFromTokenResponse(body);
  writeSession(next);
  return next;
}

export async function signOut(accessToken?: string): Promise<void> {
  clearSession();
  if (!accessToken) return;
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch(() => undefined);
}

export async function fetchAccountSummary(accessToken: string): Promise<AccountSummary> {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/account-summary`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || "account_summary_failed");
  return body as AccountSummary;
}

function writeSession(session: OptenSession): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SPACE_SESSION_STORAGE_KEY, JSON.stringify(session));
  }
}

function sessionFromTokenResponse(body: SupabaseTokenResponse): OptenSession {
  if (!body.access_token) throw new Error(body.error_description || body.error || "missing_access_token");
  const payload = decodeJwtPayload(body.access_token);
  return {
    access_token: body.access_token,
    refresh_token: body.refresh_token || null,
    token_type: body.token_type || "bearer",
    expires_at: body.expires_at || Math.floor(Date.now() / 1000) + (body.expires_in || 3600),
    user: {
      id: payload.sub || "",
      email: payload.email || null,
    },
  };
}

function decodeJwtPayload(token: string): { sub?: string; email?: string } {
  const [, payload] = token.split(".");
  if (!payload) return {};
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return JSON.parse(atob(padded));
}

function numberParam(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
