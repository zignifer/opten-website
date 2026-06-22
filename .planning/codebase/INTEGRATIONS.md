# External Integrations

**Analysis Date:** 2026-05-21

**Refreshed:** 2026-06-22 for website auth, public Learn, hidden Kinescope
course, and additional Vercel site APIs. The authoritative contract is
`docs/INTEGRATION-CONTRACT.md`; this planning file is a compact integration
snapshot.

## APIs & External Services

**Supabase (Auth + Subscriptions + Course Entitlements):**
- Project (production): `https://supabase.opten.space` — **self-hosted** on Beget RU VPS (PG17, Caddy v2.11.3 front) since the Phase 88 cutover (2026-05-25, extension v2.8 milestone). The cloud project `https://vuywydhwkqmihfztpkgl.supabase.co` is now a frozen cold backup, not an active backend. The same Supabase backend serves both the extension and this site (auth/billing/skill-download).
- Access: Plain `fetch` with `Authorization: Bearer <jwt>` + `apikey: <anon>` headers (no `@supabase/supabase-js` SDK)
- JWT verification: site serverless functions verify JWTs locally with `jose`
  against the Supabase issuer allowlist and `SUPABASE_JWT_SECRET`.
  `/auth/v1/user` is no longer called from site API functions for access gates.
- Endpoints:
  - `/rest/v1/subscriptions` — query user's subscription plan/status (RLS enforced, user reads own row only)
  - `/functions/v1/create-payment` — initiate RUB Pro subscription (site calls from `PayPage.tsx`)
  - `/functions/v1/create-payment-paddle` — initiate USD Pro subscription (site calls from `PayPage.tsx`)
  - `/functions/v1/account-summary` — website-first account/credits/subscription summary
  - `/functions/v1/create-course-payment` — standalone hidden course checkout by email; RUB YooKassa or USD Paddle one-time price; optional uppercase promo code; optional `quote_only: true` promo price preview
  - `/functions/v1/course-access-summary` — claim/read course entitlement for website JWT email/user id
  - `/functions/v1/cancel-subscription-*` — cancel Pro subscription (triggered by extension fallback or site AccountPage)
- Hardcoded constants (must be kept in sync across all usage sites):
  - `SUPABASE_URL = "https://supabase.opten.space"` — appears in `src/lib/optenAuth.ts`, `src/lib/promptLibraryApi.ts`, `src/app/pages/PayPage.tsx`, `src/app/pages/AccountPage.tsx`, `api/download-skill.ts`, and `api/_shared/optenServerAuth.ts`
  - `SUPABASE_ANON_KEY = "eyJhbGc..."` — **unchanged** across the cutover. Self-hosted GoTrue reuses the same `JWT_SECRET` as the cloud project, so the issuer `ref: vuywydhwkqmihfztpkgl` baked into the JWT payload is still accepted by self-hosted Kong. Used for read-only authenticated access + JWT validation.
  - Also appears in extension repo's `config/api.js` — must be kept in sync

**Paddle.js v2 (Payment Processing — USD):**
- SDK: `https://cdn.paddle.com/paddle/v2/paddle.js` (CDN, synchronously loaded on `/pay` prerendered HTML only; lazy-loaded for SPA navigation)
- Initialization: `src/lib/paddle.ts` via `ensurePaddle()` helper function
- Environment: `VITE_PADDLE_ENV` (sandbox or production) set in Vercel project settings
- Public token: `VITE_PADDLE_CLIENT_TOKEN` set in Vercel project settings
- Usage: `PayPage.tsx` calls `window.Paddle.Checkout.open(...)` to open payment modal
- CORS: allowed only from `https://opten.space`
- Flow: Pro subscription uses `/create-payment-paddle` (returns `priceId`, customer email/user id data), then opens Paddle Checkout. Standalone course USD checkout uses `/create-course-payment`, which returns a course-specific one-time `price_id` and optional Paddle `discountCode`/`discountId` for percentage promos.

**YooKassa (Payment Processing — RUB):**
- Accessed indirectly via Supabase Edge Function `/create-payment` for Pro subscriptions and `/create-course-payment` for standalone course purchases (extension repo owns the webhook secrets)
- Webhook URL: hardcoded in extension repo's Edge Function environment, points back to Supabase
- Return URL: `https://opten.space/success` (locked route, not prefixed with `/en/*`; site handles currency redirect via `success_url` param)
- Payment flow: site calls the relevant Edge Function, function creates YooKassa payment, returns checkout URL, site redirects user to YooKassa.
- Webhook: YooKassa pings Supabase Edge Function on payment success. Subscription payments update `subscriptions`; course payments grant `course_entitlements` and must not alter Pro state.

## Data Storage

**Databases:**
- Supabase PostgreSQL (production, owned by extension repo)
  - Tables: `users`, `subscriptions`, `course_orders`, `course_entitlements`,
    `course_promo_codes` (RLS row-level security enforced)
  - Connection: via public REST API (`/rest/v1/`) + JWT auth headers
  - Client: plain `fetch()` (no ORM)
  - Analytics replica: `opten-seo` project (read-only from this repo)

**Course promo code rules:**
- `course_promo_codes` rows are validated only by Edge Functions with
  service-role access; there are no anon/authenticated public policies.
- Codes normalize to uppercase `A-Z0-9`, 1-32 chars.
- `discount_kind` is `percentage` or `fixed_price`; activity is gated by
  `enabled`, `usage_limit`, `times_used`, `starts_at`, and `expires_at`.
- `quote_only: true` previews an effective price without creating an order or
  incrementing `times_used`.
- Provider webhooks increment `times_used` only once, after a successful course
  payment and only if the order was not already `succeeded`.

**File Storage:**
- Local filesystem only — no cloud storage integration
- Assets: `public/` directory (static, served by Vercel CDN)
- Skill bundle: `api/_assets/opten.zip` (bundled into Vercel serverless function via `vercel.json` `includeFiles`)
- Hidden course downloadable skill archive:
  `public/assets/space/courses/ai-content-marketing-2026/opten-skill.zip`

**Caching:**
- Browser caching via HTTP headers (cache-control, etag)
- No server-side caching layer (Vercel handles edge caching via CDN)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (JWT-based)
  - Website auth is canonical for site surfaces: `/login` sends Email OTP and
    stores `localStorage.opten_space_session_v1`.
  - The extension still owns its own Chrome-side session; site and extension
    sessions are independent and may point to different `auth.users.id` values.
  - `/pay` and `/account` prefer website JWTs and fall back to extension
    `GET_AUTH_TOKEN` for compatibility.
  - `/dashboard/download-skill` and `/prompt-library` still require the
    extension to provide `GET_AUTH_TOKEN`.

**Implementation:**
- Website session helpers live in `src/lib/optenAuth.ts`.
- Extension auth fallback uses `chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, callback)`.
- Response: `{ token: string, email: string }` | `{ token: null, reason: "not_logged_in" | "error" }`.
- Course access uses website JWT + `course-access-summary`, not the extension session.

## Monitoring & Observability

**Error Tracking:**
- None detected — no Sentry, Rollbar, or similar

**Logs:**
- Browser console (default `console.log`, `console.warn`, `console.error`)
- Vercel serverless function logs (visible in Vercel dashboard)
- Supabase Edge Function logs (visible in Supabase dashboard)

## CI/CD & Deployment

**Hosting:**
- Vercel — static hosting for `dist/` + site serverless functions in `api/`
- Auto-deploy on push to `main` branch (GitHub integration via Vercel)
- Preview URLs: `https://<branch>-<project>.vercel.app` or custom domain preview (e.g., `https://preview.opten.space`)

**CI Pipeline:**
- GitHub Actions (if configured) — not found in repo; Vercel handles build/deploy automatically
- Local build gate: `npm run build` must pass (validates routes, fonts, FAQ schema, URLs)

**Build Artifacts:**
- `dist/` — static HTML (202 prerendered SEO routes) + CSS + JS + assets
- `.ssr-cache/` — temporary SSR build output (deleted after prerender)
- `.ssr-meta/` — temporary metadata build output (deleted after prerender)
- All committed post-build outputs are removed before commit

## Environment Configuration

**Required env vars (set in Vercel project settings, not in repo):**
- `VITE_PADDLE_ENV` — `'sandbox'` or `'production'` (affects Paddle SDK initialization)
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token (for USD payments)
- `SUPABASE_JWT_SECRET` — server-side JWT verification for site API functions
- `KINESCOPE_AUTH_JWT_SECRET` — signs/verifies Kinescope `drmauthtoken` playback tokens
- `KINESCOPE_DRM_AUTH_USERNAME` / `KINESCOPE_DRM_AUTH_PASSWORD` — optional Basic Auth for Kinescope callback

**Secrets (NOT in this repo):**
- Supabase service role key — in extension repo's Supabase Edge Function secrets
- Paddle private API key — in extension repo's Supabase Edge Function secrets
- YooKassa shop ID, secret key — in extension repo's Supabase Edge Function secrets
- Kinescope operational API key — local-only in `.secrets/kinescope.env`

**Secrets location:**
- Extension repo (`C:\Projects\promptscore`) owns all API secrets via Supabase Edge Function environment
- Site has no `SUPABASE_SERVICE_ROLE_KEY` or any sensitive keys
- Only public constants (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `EXTENSION_IDS`) are in source code (must stay in sync across repos)

## Webhooks & Callbacks

**Incoming (Vercel serverless handles):**
- `GET /api/download-skill` — extension calls with JWT in `Authorization` header. Verifies JWT + Pro subscription, streams `opten.zip` or returns 403/401 error.
- `POST /api/course-prompt` — website course lesson calls with website JWT. Verifies course entitlement, returns a whitelisted prompt body.
- `POST /api/kinescope-course-token` — website course lesson calls with website JWT. Verifies course entitlement, returns short-lived Kinescope embed URL.
- `POST /api/kinescope-course-auth` — Kinescope server-to-server callback. Verifies playback token and returns 200/403.

**Outgoing:**
- Site calls Supabase Edge Functions for Pro payment/account management and standalone course checkout/access.
- Supabase Edge Functions receive YooKassa/Paddle webhooks for both Pro subscription and course purchase branches.
- Site calls Kinescope only through browser embeds and Kinescope's callback flow; operational Kinescope admin API use is local/manual.

**URL callbacks (hardcoded, locked):**
- YooKassa `return_url`: `https://opten.space/success` (site-side success page, shows confirmation)
- Extension navigates to:
  - `https://opten.space/welcome` on first install
  - `https://opten.space/pay` on upgrade CTA click
  - `https://opten.space/account` for account management (extension-gated SPA-only route)
  - `https://opten.space/dashboard/download-skill` for skill bundle download (extension-gated SPA-only route)
- Hidden course direct links live under `https://opten.space/learn/courses/ai-content-marketing-2026/*`; extension does not open them.

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
