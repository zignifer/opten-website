# External Integrations

**Analysis Date:** 2026-05-21

## APIs & External Services

**Supabase (Auth + Subscriptions):**
- Project (production): `https://vuywydhwkqmihfztpkgl.supabase.co` (owned by extension repo `C:\Projects\promptscore`)
- Access: Plain `fetch` with `Authorization: Bearer <jwt>` + `apikey: <anon>` headers (no `@supabase/supabase-js` SDK)
- Endpoints:
  - `/auth/v1/user` — validate JWT, get user ID
  - `/rest/v1/subscriptions` — query user's subscription plan/status (RLS enforced, user reads own row only)
  - `/functions/v1/create-payment-paddle` — initiate USD payment (site calls from `PayPage.tsx`)
  - `/functions/v1/create-payment-yookassa` — initiate RUB payment (site calls from `PayPage.tsx`)
  - `/functions/v1/get-subscription` — fetch full subscription record with card details (AccountPage calls)
  - `/functions/v1/cancel-subscription-*` — cancel subscription (triggered by extension or site AccountPage)
- Hardcoded constants (must be kept in sync across all usage sites):
  - `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"` — appears in `src/app/pages/PayPage.tsx:11`, `src/app/pages/AccountPage.tsx:7`, `api/download-skill.ts:14`
  - `SUPABASE_ANON_KEY = "eyJhbGc..."` — same three files, used for read-only authenticated access + JWT validation
  - Also appears in extension repo's `config/api.js` — must be kept in sync

**Paddle.js v2 (Payment Processing — USD):**
- SDK: `https://cdn.paddle.com/paddle/v2/paddle.js` (CDN, synchronously loaded on `/pay` prerendered HTML only; lazy-loaded for SPA navigation)
- Initialization: `src/lib/paddle.ts` via `ensurePaddle()` helper function
- Environment: `VITE_PADDLE_ENV` (sandbox or production) set in Vercel project settings
- Public token: `VITE_PADDLE_CLIENT_TOKEN` set in Vercel project settings
- Usage: `PayPage.tsx` calls `window.Paddle.Checkout.open(...)` to open payment modal
- CORS: allowed only from `https://opten.space`
- Flow: site creates payment via Supabase Edge Function `/create-payment-paddle` (returns `checkout_id`), then opens Paddle checkout modal. Paddle calls YooKassa backend (for RUB) or Paddle backend (for USD) based on `currency`.

**YooKassa (Payment Processing — RUB):**
- Accessed indirectly via Supabase Edge Function `/create-payment-yookassa` (extension repo owns the webhook secrets)
- Webhook URL: hardcoded in extension repo's Edge Function environment, points back to Supabase
- Return URL: `https://opten.space/success` (locked route, not prefixed with `/en/*`; site handles currency redirect via `success_url` param)
- Payment flow: site calls Edge Function with plan/currency/lang, Edge Function creates YooKassa payment ID, returns checkout URL, site redirects user to YooKassa
- Webhook: YooKassa pings Supabase Edge Function on payment success; Edge Function updates `subscriptions` table + generates JWT for new user/subscriber

## Data Storage

**Databases:**
- Supabase PostgreSQL (production, owned by extension repo)
  - Tables: `users`, `subscriptions` (RLS row-level security enforced)
  - Connection: via public REST API (`/rest/v1/`) + JWT auth headers
  - Client: plain `fetch()` (no ORM)
  - Analytics replica: `opten-seo` project (read-only from this repo)

**File Storage:**
- Local filesystem only — no cloud storage integration
- Assets: `public/` directory (static, served by Vercel CDN)
- Skill bundle: `api/_assets/opten.zip` (bundled into Vercel serverless function via `vercel.json` `includeFiles`)

**Caching:**
- Browser caching via HTTP headers (cache-control, etag)
- No server-side caching layer (Vercel handles edge caching via CDN)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (JWT-based)
  - Extension owns the user account creation flow (on extension first-run)
  - Site validates JWTs from extension via `/auth/v1/user` endpoint
  - JWTs refreshed by extension via `chrome.runtime.sendMessage(...)` (site never refreshes directly)
  - No email/password auth on site — delegation to extension

**Implementation:**
- Site reads auth state from extension via `chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, callback)`
- Response: `{ token: string, email: string }` | `{ token: null, reason: "not_logged_in" | "error" }`
- Pages: `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx` all iterate `EXTENSION_IDS` and accept first responder

## Monitoring & Observability

**Error Tracking:**
- None detected — no Sentry, Rollbar, or similar

**Logs:**
- Browser console (default `console.log`, `console.warn`, `console.error`)
- Vercel serverless function logs (visible in Vercel dashboard)
- Supabase Edge Function logs (visible in Supabase dashboard)

## CI/CD & Deployment

**Hosting:**
- Vercel — static hosting for `dist/` + one serverless function `api/download-skill.ts`
- Auto-deploy on push to `main` branch (GitHub integration via Vercel)
- Preview URLs: `https://<branch>-<project>.vercel.app` or custom domain preview (e.g., `https://preview.opten.space`)

**CI Pipeline:**
- GitHub Actions (if configured) — not found in repo; Vercel handles build/deploy automatically
- Local build gate: `npm run build` must pass (validates routes, fonts, FAQ schema, URLs)

**Build Artifacts:**
- `dist/` — static HTML (144 prerendered routes) + CSS + JS + assets
- `.ssr-cache/` — temporary SSR build output (deleted after prerender)
- `.ssr-meta/` — temporary metadata build output (deleted after prerender)
- All committed post-build outputs are removed before commit

## Environment Configuration

**Required env vars (set in Vercel project settings, not in repo):**
- `VITE_PADDLE_ENV` — `'sandbox'` or `'production'` (affects Paddle SDK initialization)
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token (for USD payments)

**Secrets (NOT in this repo):**
- Supabase service role key — in extension repo's Supabase Edge Function secrets
- Paddle private API key — in extension repo's Supabase Edge Function secrets
- YooKasha shop ID, secret key — in extension repo's Supabase Edge Function secrets

**Secrets location:**
- Extension repo (`C:\Projects\promptscore`) owns all API secrets via Supabase Edge Function environment
- Site has no `SUPABASE_SERVICE_ROLE_KEY` or any sensitive keys
- Only public constants (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `EXTENSION_IDS`) are in source code (must stay in sync across repos)

## Webhooks & Callbacks

**Incoming (Vercel serverless handles):**
- `GET /api/download-skill` — extension calls with JWT in `Authorization` header. Verifies JWT + Pro subscription, streams `opten.zip` or returns 403/401 error.

**Outgoing:**
- None directly from this site
- Extension calls Supabase Edge Functions for payment creation, subscription cancellation, etc.
- Supabase Edge Functions receive webhooks from YooKassa on payment success
- Paddle webhooks sent to Paddle backend (payment processing handled server-side by Paddle, not by this site)

**URL callbacks (hardcoded, locked):**
- YooKassa `return_url`: `https://opten.space/success` (site-side success page, shows confirmation)
- Extension navigates to:
  - `https://opten.space/welcome` on first install
  - `https://opten.space/pay` on upgrade CTA click
  - `https://opten.space/account` for account management (extension-gated SPA-only route)
  - `https://opten.space/dashboard/download-skill` for skill bundle download (extension-gated SPA-only route)

## Chrome Extension Integration (Opten / promptscore)

**Binding Contract:** See `docs/INTEGRATION-CONTRACT.md` (authoritative, locked). Any change is a breaking change for shipped extension binaries.

**Mechanism:** Chrome `externally_connectable` message API — extension manifest whitelists `https://opten.space/*`; site calls `chrome.runtime.sendMessage(extensionId, message, callback)`.

**Extension IDs (hardcoded, must be kept in sync across all three pages):**
- `iphkppgbobpilmphloffcalicmejacfl` — Chrome Web Store
- `kcmcaeenfmfnpiaihicecnfnagejpcog` — Local dev (unpacked)

**Call sites:**
- `src/app/pages/PayPage.tsx:189+` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)` for extension detection + JWT
- `src/app/pages/AccountPage.tsx:103+` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)` + `sendMessage(id, { type: "GET_SUBSCRIPTION" }, cb)`
- `src/app/pages/AccountPage.tsx:156+` — `sendMessage(id, { type: "CANCEL_SUBSCRIPTION" }, cb)` to cancel Pro subscription
- `src/app/pages/DownloadSkillPage.tsx:43+` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)` for skill bundle access gating

**Message Types (from extension repo `background/background.js:1002-1084`):**

| Type | Direction | Request | Response | Purpose |
|------|-----------|---------|----------|---------|
| `GET_AUTH_TOKEN` | Site ← → Extension | `{}` | `{ token: string, email: string }` or `{ token: null, reason: "not_logged_in" \| "error" }` | Detect extension, retrieve JWT for API calls, auth flow |
| `GET_SUBSCRIPTION` | Site ← → Extension | `{}` | `{ plan: "pro" \| "free" \| "cancelled", status: "active" \| "cancelled" \| null, expires_at: ISO8601 \| null, auto_renew: boolean, card_last4: string \| null, card_type: string \| null, has_card: boolean }` | Display subscription state, access gating for Pro features |
| `CANCEL_SUBSCRIPTION` | Site ← → Extension | `{ force?: boolean }` | `{ success: true, expires_at: ISO8601 }` or `{ error: string, message: string }` | Cancel Pro subscription (extension dispatches to Supabase Edge Function) |
| `WARMUP` | Site → Extension | `{}` | (ignored) | Fire-and-forget heartbeat (unused; listed in contract) |

**Detection flow:**
- Pages iterate `EXTENSION_IDS`, send `GET_AUTH_TOKEN` to each, accept first valid response
- States: `"detecting"` → `"not_installed"` (timeout) or `"not_logged_in"` (token null) or `"ready"` (token present)
- Fallback: accept `#token=...` URL hash for deep-links from extension (e.g., PayPage.tsx:154)

---

*Integration audit: 2026-05-21*
