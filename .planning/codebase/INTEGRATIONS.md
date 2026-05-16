# External Integrations

**Analysis Date:** 2026-05-17

## Chrome Extension (Opten / promptscore)

**Mechanism:** Chrome `externally_connectable` — the extension manifest whitelists `opten.space`; the site calls `chrome.runtime.sendMessage(extensionId, message, callback)`.

**Two extension IDs tried sequentially** (first responder wins):
- `iphkppgbobpilmphloffcalicmejacfl` — Chrome Web Store
- `kcmcaeenfmfnpiaihicecnfnagejpcog` — Local dev

**Call sites:**
- `src/app/pages/PayPage.tsx:189` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)`
- `src/app/pages/AccountPage.tsx:103` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)`
- `src/app/pages/AccountPage.tsx:156` — `sendMessage(id, { type: "CANCEL_SUBSCRIPTION" }, cb)`
- `src/app/pages/DownloadSkillPage.tsx:43` — `sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)`

**Message shapes (consumed):**
- Request: `{ type: "GET_AUTH_TOKEN" }` → Response: `{ token?: string, email?: string }` (truthy `token` = ready)
- Request: `{ type: "CANCEL_SUBSCRIPTION" }` → Response: `{ success?: boolean, error?: string }`

**Fallback path:** Pages also accept `#token=...` URL hash (`PayPage.tsx:154`, `AccountPage.tsx:79`) for direct deep-links from the extension.

**Detection states:** `"detecting" | "not_installed" | "not_logged_in" | "ready"` — `PayPage.tsx:23`, `AccountPage.tsx:14`, `DownloadSkillPage.tsx:10-18`.

## Supabase

**Project (production, owned by extension repo):**
- URL: `https://vuywydhwkqmihfztpkgl.supabase.co`
- No `@supabase/supabase-js` — pure `fetch` with `Authorization: Bearer <jwt>` + `apikey: <anon>` headers.

**Edge Functions called from site:**
| Function | Caller | Auth | Method | Body |
|---|---|---|---|---|
| `/functions/v1/get-subscription` | `PayPage.tsx:214`, `AccountPage.tsx:129` | Bearer JWT + apikey | GET | — |
| `/functions/v1/create-payment` (YooKassa) | `PayPage.tsx:239` (RUB path) | Bearer JWT + apikey | POST | `{ recurring: boolean }` → returns `{ confirmation_url }` |
| `/functions/v1/create-payment-paddle` (Paddle) | `PayPage.tsx:293` (USD path) | Bearer JWT + apikey | POST | `{ recurring: boolean }` → returns `{ priceId, customerEmail, userId }` |

**Supabase REST/Auth from serverless function (`api/download-skill.ts`):**
- `GET ${SUPABASE_URL}/auth/v1/user` (`api/download-skill.ts:59`) — JWT validation
- `GET ${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.<id>&plan=eq.pro&status=in.(active,cancelled)&select=plan,status&limit=1` (`api/download-skill.ts:85`) — Pro gate
- Cancel-subscription Edge Function is NOT called by site directly; site dispatches `CANCEL_SUBSCRIPTION` to the extension, which calls the appropriate function (`cancel-subscription` or `cancel-subscription-paddle`) based on its own `ps_sub_provider`.

**Separate Supabase project — opten-seo:**
- URL: `https://hxqhlsjqrxalyteyqhfd.supabase.co` (`.env.example:11`)
- Server-side / script-only (no `VITE_` prefix). Not consumed by client bundle. Linked via `npx supabase` (local devDependency `supabase` 2.98.2).

## Paddle.js v2

**CDN inclusion:**
- NOT loaded site-wide. `index.html:88` has only `<link rel="preconnect" href="https://cdn.paddle.com" />`.
- Sync `<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>` is injected by `scripts/prerender.mjs` (`applyPaddleScript`, `prerender.mjs:175-180`) into BOTH `dist/pay/index.html` AND `dist/en/pay/index.html` — gated on `meta.path === "/pay" || meta.path === "/en/pay"` at `prerender.mjs:192`. Symmetric `/en/pay` extension landed in commit `5276b51` (Phase 3 D-03b). INTEGRATION-CONTRACT §6 documents the symmetry.
- SPA-navigation to either `/pay` or `/en/pay` (from landing) loads SDK on demand via `src/lib/paddle.ts` (`ensurePaddle()`).

**Loader (`src/lib/paddle.ts`):**
- Memoized promise `paddleReady` (`paddle.ts:11`)
- `Environment.set("sandbox")` only when `VITE_PADDLE_ENV === "sandbox"` (production path skipped — BG-67-01, `paddle.ts:24-26`)
- `Paddle.Initialize({ token: VITE_PADDLE_CLIENT_TOKEN })` (`paddle.ts:27`)

**Call sites:**
- `ensurePaddle()` preload on mount: `PayPage.tsx:172`
- `ensurePaddle()` before checkout: `PayPage.tsx:281`
- `window.Paddle.Checkout.open({...})`: `PayPage.tsx:314`
  - `items: [{ priceId, quantity: 1 }]`
  - `customer: { email }`
  - `customData: { user_id }`
  - `settings: { theme: "dark", locale: "en", successUrl: window.location.origin + "/success", displayMode: "overlay" }`
  - `eventCallback` handles `event.name === "checkout.closed"` (`PayPage.tsx:327`)

**Types:** `src/types/paddle.d.ts` augments `window.Paddle` with `Environment.set`, `Initialize`, `Checkout.open`.

**Post-checkout signal on `/success`:**
- `SuccessPage.tsx:11` reads `?_ptxn=txn_...` query param (Paddle appends on overlay success). Logged only; no UI difference vs YooKassa redirect.

## YooKassa

**RUB checkout flow:**
- Site calls `create-payment` Edge Function (`PayPage.tsx:239`); function returns `{ confirmation_url }`; site redirects via `window.location.href = data.confirmation_url` (`PayPage.tsx:255`).
- `return_url` is set inside the Edge Function (extension repo, `create-payment/index.ts`), hardcoded to `https://opten.space/success`. The `/success` route is the binding contract endpoint.

**SuccessPage behavior:** YooKassa returns without query params; same `SuccessPage.tsx` renders for both providers.

**No direct YooKassa JS SDK on site.**

## Vercel Platform

**Hosting:** auto-deploy on push to `main`. Project name `opten-website2` per recent commits.

**`vercel.json`:**
- Rewrites (`vercel.json:2-4`): SPA fallback `/((?!api/).*) → /index.html` — anything except `/api/*` falls through to SPA shell.
- Headers (`vercel.json:6-13`): applied to `/(.*)`:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.paddle.com")`
- Functions (`vercel.json:15-19`): `api/download-skill.ts` includes `api/_assets/**` (the `opten.zip` skill bundle).

**Serverless functions:** one — `api/download-skill.ts`.
- Auth: Bearer JWT validated against Supabase `/auth/v1/user`.
- Authorization: Supabase REST query on `subscriptions` (Pro, active|cancelled).
- Streams `api/_assets/opten.zip` (~6.5KB). CORS hardcoded `Access-Control-Allow-Origin: https://opten.space` (`api/download-skill.ts:22-27`).
- Uses Node `(req, res)` signature (not Web Standard `Request/Response`) for runtime compatibility (`api/download-skill.ts:6-8`).
- Returns `403 { error: "not_pro", upgrade_url: "/account?upgrade=skill" }` on non-Pro.

**Prerender pipeline (build-time):** see STACK.md "Build/Dev". Emits 12 HTML files (`dist/index.html`, `dist/pay/`, `dist/welcome/`, `dist/privacy/`, `dist/terms/`, `dist/refund/`, `dist/en/index.html`, `dist/en/pay/`, `dist/en/welcome/`, `dist/en/privacy/`, `dist/en/terms/`, `dist/en/refund/`) plus `dist/sitemap.xml` with 12 `<url>` entries each annotated with `xhtml:link` hreflang ru/en/x-default (`scripts/sitemap.mjs:30,41-43`).

## Auth / Storage

**Site-owned `localStorage` keys (prefix `opten_`):**
- `opten_lang_v3` — `"ru" | "en"`. Set/read in `src/i18n/LangContext.tsx:20,26,124`. Bumped from `opten_lang` in post-Phase-3 hotfix `c789dee` because the previous key was contaminated by older auto-detect writes that pinned EN-browser visitors to RU forever.
- `opten_lang` (LEGACY, read-only) — `LangContext.tsx:21,30-31`. Read once for one-shot migration; only honored when value is `"en"` (RU is the default detect result so it is not safe to treat as explicit). Never written.
- `opten_pay_currency` — `"RUB" | "USD"`. Set/read in `src/app/pages/PayPage.tsx:19,122,133,137`.

**Extension-owned `chrome.storage.local` keys (`ps_*` prefix):**
- Site does NOT read these directly. All access is mediated by `chrome.runtime.sendMessage` (see Chrome Extension section).
- Documented in `docs/INTEGRATION-CONTRACT.md` §5: `ps_sub_provider` (`'yookassa' | 'paddle'`), `ps_user_token`, etc.

**No cookies, no service worker, no IndexedDB.**

## External CDNs

| CDN | Purpose | Where |
|---|---|---|
| `cdn.paddle.com` | Paddle.js v2 SDK | `scripts/prerender.mjs:175-180,192` (injected into `/pay` AND `/en/pay`); `src/lib/paddle.ts:13` (lazy fallback) |
| `chromewebstore.google.com` | Install CTAs | `PayPage.tsx:12`, `AccountPage.tsx:8`, `DownloadSkillPage.tsx:117`, `index.html:65,78` |
| `t.me/v_voronezhtsev` | Contact link | `PayPage.tsx:618`, `AccountPage.tsx:400`, `index.html:79` |

## Hardcoded Duplicated Constants

**`EXTENSION_IDS` — declared in 3 files, must stay in sync:**
- `src/app/pages/PayPage.tsx:13-16`
- `src/app/pages/AccountPage.tsx:9-12`
- `src/app/pages/DownloadSkillPage.tsx:5-8`

```ts
const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",  // Chrome Web Store
  "kcmcaeenfmfnpiaihicecnfnagejpcog",  // Local dev
];
```

**`SUPABASE_URL` — declared in 4 locations, must rotate together:**
- `src/app/pages/PayPage.tsx:10` — as `SUPABASE_FUNCTIONS_URL = "https://vuywydhwkqmihfztpkgl.supabase.co/functions/v1"`
- `src/app/pages/AccountPage.tsx:6` — same `SUPABASE_FUNCTIONS_URL`
- `api/download-skill.ts:14` — as `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"` (no `/functions/v1` suffix; serverless also hits `/auth/v1` and `/rest/v1`)
- Extension repo's `config/api.js` (out-of-tree — see CLAUDE.md §"Hardcoded constants")

**`SUPABASE_ANON_KEY` — declared in 4 locations, mirrors `SUPABASE_URL`:**
- `src/app/pages/PayPage.tsx:11`
- `src/app/pages/AccountPage.tsx:7`
- `api/download-skill.ts:15-16`
- Extension repo's `config/api.js` (out-of-tree)

Note: `DownloadSkillPage.tsx` does NOT carry `SUPABASE_URL` / `SUPABASE_ANON_KEY` — it talks only to the site's own `/api/download-skill` endpoint (which carries them).

**`CHROME_STORE_URL` — declared in 2 page files plus 2x in `index.html`:**
- `src/app/pages/PayPage.tsx:12`
- `src/app/pages/AccountPage.tsx:8`
- Hardcoded inline (no constant) in `src/app/pages/DownloadSkillPage.tsx:117`
- Hardcoded inline in `index.html:65,78` (Schema.org JSON-LD)

**`EN_SIBLINGS` — single source of truth + manifest mirror (Phase 3):**
- `src/i18n/paths.ts:9-16` — runtime `Set<string>` consumed by `LocalizedLink` / `LangSwitcher`.
- `scripts/seo-routes.ts:33-247` — must contain a matching entry for each EN sibling (the file-level SYNC comment at `paths.ts:2-3` calls this out explicitly). `sitemap.mjs` enforces a runtime floor (`>= 12 routes`, `sitemap.mjs:29-31`).

## Routes (12 prerendered + SPA-only)

**Prerendered (`prerender: "full"` or `"head"` in `scripts/seo-routes.ts`):**

| RU | EN sibling | Tier | Mounted in entry-server? |
|---|---|---|---|
| `/` | `/en/` | full | yes |
| `/welcome` | `/en/welcome` | full | yes |
| `/privacy` | `/en/privacy` | full | yes |
| `/terms` | `/en/terms` | full | yes |
| `/refund` | `/en/refund` | full | yes |
| `/pay` | `/en/pay` | head | no (head-only — SPA mounts the body) |

**SPA-only (no EN sibling, no prerender):**
- `/success`, `/account`, `/dashboard/download-skill` — extension-coupled or post-auth; intentionally never prefixed (LangSwitcher stays in place via storage flip, see `paths.ts:34-40` returning `null`).

## Environment Variables

**Bundled into client (`VITE_*` — public by definition):**
- `VITE_PADDLE_ENV` — `"sandbox" | "production"`. Read at `src/lib/paddle.ts:17`. Listed in `.env.example:4`.
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token. Read at `src/lib/paddle.ts:18`. Listed in `.env.example:5`.

**Server-side / script-only (NOT bundled into client):**
- `SUPABASE_SEO_URL` — `.env.example:11` (`https://hxqhlsjqrxalyteyqhfd.supabase.co`, opten-seo project)
- `SUPABASE_SEO_PUBLISHABLE_KEY` — `.env.example:12`
- `SUPABASE_SEO_SECRET_KEY` — `.env.example:13`

**Set in Vercel project settings (not in repo):** `VITE_PADDLE_ENV`, `VITE_PADDLE_CLIENT_TOKEN`.

**Real secrets** (Supabase service role, Paddle private API key, YooKassa secrets) live in the extension repo's Supabase Edge Function secrets — never in this repo.

## Webhooks & Callbacks

**Incoming to site:** none. The site does not host any webhook receiver.

**Outgoing from site:**
- All YooKassa/Paddle webhooks land on extension-owned Supabase Edge Functions (`/webhook`, `/webhook-paddle`), not on this site.
- Site's only return-style endpoint is `/success` (YooKassa `return_url` + Paddle `successUrl`).

## Monitoring & Observability

**Error tracking:** None — no Sentry / Rollbar / Datadog SDK present.

**Logging:** Only `console.log` / `console.warn` (e.g. `SuccessPage.tsx:13` logs Paddle txn id; `paddle.ts:20` warns on missing token). No structured logging.

**Analytics:** None in client bundle (no GA, GTM, Plausible, Yandex.Metrica detected).

---

*Integration audit: 2026-05-17*
