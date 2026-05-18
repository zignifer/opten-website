# External Integrations

**Analysis Date:** 2026-05-18

## Chrome Extension (Opten / promptscore)

**Mechanism:** Chrome `externally_connectable` message API — extension manifest (`C:\Projects\promptscore\manifest.json`) whitelists `https://opten.space/*`; site calls `chrome.runtime.sendMessage(extensionId, message, callback)`.

**Extension IDs (hardcoded, duplicated in 3 files):**
- `iphkppgbobpilmphloffcalicmejacfl` — Chrome Web Store
- `kcmcaeenfmfnpiaihicecnfnagejpcog` — Local dev (unpacked)

First responder wins; site iterates the list in `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`.

**Call sites:**
- `src/app/pages/PayPage.tsx:189` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)`
- `src/app/pages/AccountPage.tsx:103` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)`
- `src/app/pages/AccountPage.tsx:156` — `sendMessage(id, { type: "CANCEL_SUBSCRIPTION" }, cb)`
- `src/app/pages/DownloadSkillPage.tsx:43` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)`

**Message types (from extension repo `background/background.js:1002-1084`):**

| Type | Direction | Request | Response | Purpose |
|------|-----------|---------|----------|---------|
| `GET_AUTH_TOKEN` | Site → Extension | `{}` | `{ token: string, email: string } \| { token: null, reason: string }` | Detect extension, auth flow, JWT for Edge Functions |
| `GET_SUBSCRIPTION` | Site → Extension | `{}` | `{ plan: 'pro'\|'free'\|'cancelled', status: 'active'\|'cancelled'\|null, ... }` | Display subscription state, access gating |
| `CANCEL_SUBSCRIPTION` | Site → Extension | `{}` | `{ success: true, expires_at: ISO8601 } \| { error: string, message: string }` | Cancel subscription (Extension dispatches to Supabase Edge Function) |
| `WARMUP` | Site → Extension | `{}` | (ignored) | Fire-and-forget, warm Vercel cold start (unused) |

**Fallback path:** Pages accept `#token=...` URL hash (e.g., `PayPage.tsx:154`) for direct deep-links from extension.

**Detection states:** `"detecting" | "not_installed" | "not_logged_in" | "ready"` (PayPage.tsx:23, AccountPage.tsx:14, DownloadSkillPage.tsx:10-18).

**CRITICAL:** See `docs/INTEGRATION-CONTRACT.md` for the binding interface. Any change to message shapes, extension IDs, or route names is a breaking change for already-shipped extension binaries.

## Supabase (Edge Functions)

**Project (production, owned by extension repo):**
- URL: `https://vuywydhwkqmihfztpkgl.supabase.co`
- Access: plain `fetch` with `Authorization: Bearer <jwt>` + `apikey: <anon>` headers (no `@supabase/supabase-js` SDK)

**Hardcoded credentials (duplicated in 3 site files + extension repo's `config/api.js`):**
- `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"`
- `SUPABASE_ANON_KEY = "eyJ...A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg"` (public-by-design, anon role)

**Locations:**
- `src/app/pages/PayPage.tsx:10-11` — SUPABASE_FUNCTIONS_URL, SUPABASE_ANON_KEY
- `src/app/pages/AccountPage.tsx:6-7` — same
- `api/download-skill.ts:14-16` — SUPABASE_URL (includes `/auth/v1`, `/rest/v1` access)

**Edge Functions called from site:**

| Endpoint | Caller | Auth | Method | Body → Response |
|----------|--------|------|--------|-----------------|
| `/functions/v1/create-payment` | `PayPage.tsx:239` (RUB path) | Bearer JWT | POST | `{ recurring: bool }` → `{ confirmation_url }` (YooKassa) |
| `/functions/v1/create-payment-paddle` | `PayPage.tsx:293` (USD path) | Bearer JWT | POST | `{ recurring: bool }` → `{ priceId, customerEmail, userId }` (Paddle) |
| `/functions/v1/get-subscription` | `PayPage.tsx:214`, `AccountPage.tsx:129` | Bearer JWT | GET | — → `{ plan, status, expires_at, ... }` |
| `/functions/v1/cancel-subscription` | Extension (via `CANCEL_SUBSCRIPTION` message) | Bearer JWT | POST | Called by extension, not site |
| `/functions/v1/cancel-subscription-paddle` | Extension | Bearer JWT | POST | Called by extension, not site |

**REST API called from serverless (`api/download-skill.ts`):**
- `GET ${SUPABASE_URL}/auth/v1/user` (line 59) — JWT validation
- `GET ${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.<id>&plan=eq.pro&status=in.(active,cancelled)...` (line 85) — Pro gate (plan='pro' AND status IN ('active','cancelled'))

**Server-side metadata project (`opten-seo`):**
- URL: `https://hxqhlsjqrxalyteyqhfd.supabase.co` (`.env.example:11`)
- Access: via `npx supabase` CLI (devDependency `supabase 2.98.2`)
- Not consumed by client bundle (no `VITE_` prefix)

## Paddle.js v2

**CDN integration:**
- Not loaded site-wide; `index.html` has preconnect only
- Synchronously injected by `scripts/prerender.mjs` into `/pay/index.html` AND `/en/pay/index.html` prerendered files (Phase 2.2 + Phase 3 D-03b)
- Lazily loaded on SPA-navigation via `src/lib/paddle.ts:ensurePaddle()` (other routes)

**Injection detail (Phase 3 D-03b symmetry):**
- `scripts/prerender.mjs:175-180` — defines `applyPaddleScript()`
- `scripts/prerender.mjs:192` — gate: `meta.path === "/pay" || meta.path === "/en/pay"`
- Direct hits on `/pay` or `/en/pay` have `window.Paddle` ready before React mounts (Phase 2.2 perf optimization)

**Loader (`src/lib/paddle.ts`):**
- CDN: `https://cdn.paddle.com/paddle/v2/paddle.js`
- Memoized promise `paddleReady` (idempotent)
- Init: `Paddle.Environment.set("sandbox")` only when `VITE_PADDLE_ENV === "sandbox"` (Phase 67 fix: no `set("production")`)
- Init: `Paddle.Initialize({ token: VITE_PADDLE_CLIENT_TOKEN })`

**Call site (`PayPage.tsx`):**
- Mount preload: `ensurePaddle()` (line 172)
- Pre-checkout: `ensurePaddle()` (line 281)
- Checkout: `window.Paddle.Checkout.open({ items: [{ priceId, quantity: 1 }], customer: { email }, customData: { user_id }, settings: { theme: "dark", locale: "en", successUrl: window.location.origin + "/success", displayMode: "overlay" }, eventCallback: (event) => { if (event.name === "checkout.closed") {...} } })` (line 314)

**Post-checkout signal (`SuccessPage.tsx:11`):**
- Reads `?_ptxn=txn_...` query param (Paddle appends on overlay success); logged only

**Environment variables (Vercel):**
- `VITE_PADDLE_ENV` — `"sandbox"` | `"production"`
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token

## YooKassa

**RUB checkout flow:**
- Site calls `POST /functions/v1/create-payment` Edge Function (`PayPage.tsx:239`)
- Edge Function (in extension repo) returns `{ confirmation_url }`
- Site redirects via `window.location.href = data.confirmation_url` (`PayPage.tsx:255`)
- `return_url` hardcoded in Edge Function to `https://opten.space/success` (binding contract)

**SuccessPage behavior:**
- YooKassa returns user to `/success` without query params
- Site shows success state (confetti, CTA to install/sign in)

**No YooKassa JavaScript SDK** — payment link is external redirect only.

## Vercel Platform

**Hosting:**
- Project: `opten-website2` (per recent commits)
- Auto-deploy on push to `main`
- Custom domain: `opten.space` (HTTPS)

**vercel.json configuration:**
- Rewrites: `/((?!api/).*) → /index.html` (SPA fallback for all non-API routes)
- Redirects: `/guides/*` → `/blog/*` (Phase 5 B-07 content migration)
- Headers (global):
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.paddle.com")`
  - `X-Frame-Options: SAMEORIGIN`
- Headers (path-specific `X-Robots-Tag: noindex, nofollow`):
  - `/account` → no prerender, SPA-only
  - `/success` → post-payment, no crawl
  - `/dashboard/*` → auth-gated, no crawl
  - `/api/*` → no crawl
- Functions: `api/download-skill.ts` with `includeFiles: "api/_assets/**"`

**Serverless function (`api/download-skill.ts`):**
- Auth: Bearer JWT validated against `${SUPABASE_URL}/auth/v1/user`
- Authorization: Supabase REST query for Pro subscription (plan='pro' AND status IN ('active','cancelled'))
- Output: ZIP file stream from `api/_assets/opten.zip` (~6.5 KB)
- CORS: locked to `https://opten.space`
- Error responses: `401` (invalid/missing JWT), `403` (not Pro), `405` (wrong method), `502` (backend error)

## Authentication & State

**Site-owned `localStorage` (prefix `opten_`):**
- `opten_lang_v3` — `"ru" | "en"` (set/read by LangSwitcher only)
- `opten_lang` (legacy, read-only) — one-shot EN migration; `LangContext.tsx:30-31` reads only if value is exactly `"en"`
- `opten_pay_currency` — `"RUB" | "USD"` (set/read in PayPage.tsx)

**Extension-owned `chrome.storage.local` (`ps_*` prefix):**
- Site does NOT read directly; all access via `chrome.runtime.sendMessage` (see Chrome Extension section)
- Keys documented in `docs/INTEGRATION-CONTRACT.md` §5: `ps_auth_token`, `ps_user_email`, `ps_plan`, `ps_sub_status`, `ps_sub_expires`, `ps_sub_provider`, etc.

**No cookies, no service worker, no IndexedDB.**

## Content & SEO Generation

**Per-route metadata source:**
- `scripts/seo-routes.ts` — single source of truth for title, description, canonical, ogImage, hreflangAlternates, schema (JSON-LD)
- Typed schema helpers: `faqPageBlock`, `howToBlock`, `productBlock`, `articleBlock`, `webPageBlock`, `breadcrumbBlock`, `collectionPageBlock`, `itemListBlock`, `blogPostingBlock`
- Reusable schema consts: `ORG_BLOCK`, `WEBSITE_BLOCK`, `SOFTWARE_APP_BLOCK`, `PERSON_FOUNDER_BLOCK` (cross-linked via `@id`)

**Blog content:**
- `src/content/blog/` — one file per post implementing `BlogPost = { ru, en }`
- Cover images: `public/blog/<slug>/`
- Routes: `/blog/:slug` (RU) + `/en/blog/:slug` (EN), dynamically prerendered

**OG cards:**
- `public/og-card-ru.png`, `public/og-card-en.png` (1200×630)
- Per-post covers override the defaults

**Build-time outputs:**
- `dist/sitemap.xml` — 18 `<url>` entries with `xhtml:link` hreflang triplets (ru/en/x-default); per-route `<lastmod>` from git mtime
- `dist/llms.txt`, `dist/llms-full.txt` — AI-crawler opt-in; generated by `scripts/llms.mjs`
- `dist/robots.txt` — explicit blocks for 16 user-agents; `Content-Signal: search=yes, ai-train=yes, ai-input=yes`

**Prerendered routes (18 total: 9 RU + 9 EN):**
- Full prerender: `/`, `/welcome`, `/about`, `/blog`, `/privacy`, `/terms`, `/refund` (RU) + EN siblings
- Head-only: `/pay`, `/en/pay` (Paddle SDK injected, body loaded by React)
- Blog posts: `/blog/:slug`, `/en/blog/:slug` (dynamically prerendered per `src/content/blog/`)
- SPA-only (no prerender, `X-Robots-Tag: noindex`): `/account`, `/success`, `/dashboard/download-skill`
- Fallback 404: `<Route path="*" element={<NotFound />}>` (injects `<meta robots=noindex>` at runtime)

**Hreflang configuration:**
- Every prerendered file includes triplet: `<link rel="alternate" hreflang="ru" href="..." />`, `hreflang="en"`, `hreflang="x-default"`
- Sitemap also includes `xhtml:link` annotations per URL

## External CDNs & Services

| Service | Purpose | Where |
|---------|---------|-------|
| `cdn.paddle.com` | Paddle.js v2 SDK | `/pay`, `/en/pay` prerendered HTML; lazy fallback via `src/lib/paddle.ts` |
| `chromewebstore.google.com` | Extension install link | `PayPage.tsx:12`, `AccountPage.tsx:8`, `DownloadSkillPage.tsx:117`, `index.html:65,78` |
| `t.me/v_voronezhtsev` | Telegram contact link | `PayPage.tsx:618`, `AccountPage.tsx:400`, `index.html:79` |

## Hardcoded Duplicated Constants

**`EXTENSION_IDS` — 3 files, must stay in sync:**
- `src/app/pages/PayPage.tsx:13-16`
- `src/app/pages/AccountPage.tsx:9-12`
- `src/app/pages/DownloadSkillPage.tsx:5-8`

```ts
const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",  // Chrome Web Store
  "kcmcaeenfmfnpiaihicecnfnagejpcog",  // Local dev
];
```

**`SUPABASE_URL` — 4 files (3 site + 1 extension), must rotate together:**
- `src/app/pages/PayPage.tsx:10` — as `SUPABASE_FUNCTIONS_URL = "https://vuywydhwkqmihfztpkgl.supabase.co/functions/v1"`
- `src/app/pages/AccountPage.tsx:6` — same
- `api/download-skill.ts:14` — as `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"` (no suffix; also hits `/auth/v1`, `/rest/v1`)
- Extension repo's `config/api.js` (out-of-tree)

**`SUPABASE_ANON_KEY` — 4 files (3 site + 1 extension), mirrors SUPABASE_URL:**
- `src/app/pages/PayPage.tsx:11`
- `src/app/pages/AccountPage.tsx:7`
- `api/download-skill.ts:15-16`
- Extension repo's `config/api.js`

**`EN_SIBLINGS` — runtime + build-time manifest:**
- `src/i18n/paths.ts:9-16` — runtime `Set<string>` consumed by LocalizedLink / LangSwitcher (6 routes: `/`, `/welcome`, `/pay`, `/privacy`, `/terms`, `/refund`)
- `scripts/seo-routes.ts` — must contain matching entry for each EN sibling (Phase 3 D-01/D-03b). Build floor check at `sitemap.mjs:29-31` requires >= 18 routes (9 RU + 9 EN post-blog migration).

## Webhooks & Callbacks

**Incoming to site:**
- `/success` — YooKassa `return_url` + Paddle `successUrl` (not a webhook, user-facing redirect)
- No webhook receiver endpoints on this site

**Outgoing from site:**
- All YooKassa/Paddle webhooks land on extension-owned Supabase Edge Functions (`/webhook`, `/webhook-paddle`), not here
- Site initiates payment via Edge Functions, which in turn invoke payment providers

## Monitoring & Observability

**Error tracking:** None (no Sentry, Rollbar, Datadog SDK)

**Logging:** Browser console only (`console.log`, `console.warn`). Example: `SuccessPage.tsx:13` logs Paddle txn ID; `paddle.ts:20` warns on missing token.

**Analytics:** None detected in client bundle (no GA, GTM, Plausible, Yandex.Metrica).

---

*Integration audit: 2026-05-18*
