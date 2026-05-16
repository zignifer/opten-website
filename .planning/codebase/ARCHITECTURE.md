<!-- refreshed: 2026-05-16 -->
# Architecture

**Analysis Date:** 2026-05-16

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│  Browser (SPA + prerendered HTML shells)                            │
│                                                                     │
│  index.html  ──preload──>  /fonts/*.woff2                           │
│       │       ──preconnect─> cdn.paddle.com                         │
│       ▼                                                             │
│  src/main.tsx  ── createRoot | hydrateRoot ──>  <App>               │
│       │                                                             │
│       ├─ <LangProvider>  (src/i18n/LangContext.tsx)                 │
│       └─ <BrowserRouter> + lazy routes (pay/success/account/dl)     │
└──────┬─────────────────────┬────────────────────────┬───────────────┘
       │ chrome.runtime.     │ fetch                  │ window.Paddle
       │   sendMessage       │                        │   .Checkout
       ▼                     ▼                        ▼
┌────────────────┐  ┌──────────────────────┐  ┌────────────────────┐
│ Opten Chrome   │  │ Supabase             │  │ Paddle.js v2 CDN   │
│ extension      │  │  - /functions/v1/*   │  │  + Paddle backend  │
│ (externally_   │  │  - /rest/v1/*        │  │                    │
│  connectable)  │  │  - /auth/v1/user     │  └────────────────────┘
└────────────────┘  └──────────────────────┘
                              ▲
                              │ JWT validation, subscriptions lookup
                              │
                    ┌──────────────────────────────┐
                    │ /api/download-skill          │
                    │ (Vercel serverless,          │
                    │  api/download-skill.ts)      │
                    └──────────────────────────────┘
```

## Rendering Model

- **SPA with build-time prerender shells.** Not SSR at request time.
- Build chain in `package.json:7`:
  1. `vite build` — client SPA bundle → `dist/`.
  2. `vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache` — SSR bundle.
  3. `vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta` — route manifest.
  4. `node scripts/prerender.mjs` — emits per-route `dist/{route}/index.html` with prerendered `<head>` + body.
  5. `node scripts/sitemap.mjs` — sitemap regeneration.
- Prerender tiers (`scripts/seo-routes.ts`):
  - `full` → `/`, `/welcome`, `/privacy`, `/terms`, `/refund` (HTML body prerendered).
  - `head` → `/pay` (meta tags only; body remains empty `#root`).
  - SPA-only (not in manifest) → `/success`, `/account`, `/dashboard/download-skill`.
- `scripts/entry-server.tsx` mounts ONLY full-prerender routes; importing other pages (PayPage, etc.) would crash SSR because of `localStorage`, `window.Paddle`, `chrome.runtime` use at module level.
- Hydration guard in `src/main.tsx:64-72`: hydrate only when `#root` has children AND `window.__PRERENDER_PATH === location.pathname`; otherwise wipe + `createRoot` (Vercel SPA-rewrite fallback serves `/` shell at unknown paths — would otherwise trigger React #418/#423).
- Vercel SPA fallback rewrite: `vercel.json:3` — `/((?!api/).*) → /index.html`.

## Route Table

| Path | Component file | Purpose | Prerender tier | Locked? |
|------|----------------|---------|---------------|---------|
| `/` | `src/app/App.tsx` | Landing (marketing) | full | no |
| `/pay` | `src/app/pages/PayPage.tsx` (lazy) | Pricing + Paddle/YooKassa checkout | head | **yes** — extension popup CTA |
| `/success` | `src/app/pages/SuccessPage.tsx` (lazy) | Post-payment thank-you | none | **yes** — YooKassa `return_url` |
| `/welcome` | `src/app/pages/WelcomePage.tsx` | Post-install onboarding | full | **yes** — extension on-install navigate |
| `/account` | `src/app/pages/AccountPage.tsx` (lazy) | Subscription mgmt, cancel, card | none | no |
| `/privacy` | `src/app/pages/PrivacyPage.tsx` | Legal | full | no |
| `/terms` | `src/app/pages/TermsPage.tsx` | Legal | full | no |
| `/refund` | `src/app/pages/RefundPage.tsx` | Legal | full | no |
| `/dashboard/download-skill` | `src/app/pages/DownloadSkillPage.tsx` (lazy) | Pro-gated skill ZIP download | none | no |

Routes registered in `src/main.tsx:48-58`. Lazy-loaded routes are the four that touch user-state / payment surfaces — they must never enter the `hydrateRoot` path (see comment at `src/main.tsx:14-17`).

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `main.tsx` | Entry, router, hydration decision, font + Paddle preconnect | `src/main.tsx` |
| `LangProvider` | i18n state, RU/EN, localStorage persistence | `src/i18n/LangContext.tsx` |
| `App` (landing) | Hero, features, partners, CTAs | `src/app/App.tsx` |
| `PayPage` | Currency selector, Paddle SDK init, YooKassa fetch, sub fetch, ext detection | `src/app/pages/PayPage.tsx` |
| `AccountPage` | Subscription summary, cancel/update card, ext detection | `src/app/pages/AccountPage.tsx` |
| `DownloadSkillPage` | Pro-gated ZIP fetch from `/api/download-skill` | `src/app/pages/DownloadSkillPage.tsx` |
| `SuccessPage` | Static thank-you, logs Paddle txn from `?_ptxn=` | `src/app/pages/SuccessPage.tsx` |
| `ensurePaddle()` | Idempotent Paddle SDK loader + Initialize() | `src/lib/paddle.ts` |
| `OptenHeroAnimation` | Landing hero animation | `src/app/components/OptenHeroAnimation.tsx` |
| `Picture` | `<picture>` wrapper for `vite-imagetools` `?as=picture` imports | `src/app/components/Picture.tsx` |
| `RouteLoading` | Suspense fallback for lazy routes | `src/app/components/RouteLoading.tsx` |
| `LegalLayout` | Shared chrome for privacy/terms/refund | `src/app/components/layout/LegalLayout.tsx` |
| `ImageWithFallback` | `<img>` with fallback (Figma-generated helper) | `src/app/components/figma/ImageWithFallback.tsx` |
| `download-skill` handler | JWT verify → Supabase sub check → stream `opten.zip` | `api/download-skill.ts` |

## Data Flows

### A. Site ↔ Extension (chrome.runtime.sendMessage)

1. Page mounts (PayPage / AccountPage / DownloadSkillPage).
2. Iterate `EXTENSION_IDS = ["iphkppgbobpilmphloffcalicmejacfl" (CWS), "kcmcaeenfmfnpiaihicecnfnagejpcog" (dev)]`.
3. `chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)` — uses extension's `externally_connectable` manifest entry (opten.space only).
4. Response: `{ token, email }` or `chrome.runtime.lastError` → status transitions through `detecting → not_installed | not_logged_in | ready`.
5. Token is the user's Supabase JWT; used for all subsequent REST + function calls.
6. Site never persists this token — auth state lives in extension `chrome.storage.local` (`ps_*` keys).

Reference: `src/app/pages/PayPage.tsx:179-205`, parallel logic in `AccountPage.tsx`, `DownloadSkillPage.tsx`.

### B. Site → Supabase

- Direct `fetch` (no `@supabase/supabase-js` dependency).
- Base URL hardcoded in three pages: `SUPABASE_FUNCTIONS_URL = "https://vuywydhwkqmihfztpkgl.supabase.co/functions/v1"`.
- Anon key hardcoded as constant `SUPABASE_ANON_KEY` (public JWT, safe in client).
- Endpoints consumed by the site: `get-subscription`, `create-yookassa-payment`, `cancel-subscription`, `update-card`, `/auth/v1/user` (validation only, in serverless).
- Edge Functions live in the **extension repo** (`C:\Projects\promptscore`), not here.

### C. Site → Paddle

1. On `/pay`, prerendered `dist/pay/index.html` includes a sync `<script src="cdn.paddle.com/paddle/v2/paddle.js">` tag (injected by `scripts/prerender.mjs`).
2. On SPA navigation to `/pay`, `ensurePaddle()` (`src/lib/paddle.ts:30`) injects the script async.
3. After load: `Paddle.Environment.set("sandbox")` (only when `VITE_PADDLE_ENV === "sandbox"` — BG-67-01 says production throws), then `Paddle.Initialize({ token: VITE_PADDLE_CLIENT_TOKEN })`.
4. CTA opens `Paddle.Checkout.open({...})` overlay; on success Paddle redirects to `/success?_ptxn=txn_…`.

### D. Browser → /api/download-skill (Vercel serverless)

1. `DownloadSkillPage` obtains JWT via flow A.
2. `GET /api/download-skill` with `Authorization: Bearer <jwt>`.
3. Serverless validates JWT against `${SUPABASE_URL}/auth/v1/user` (`api/download-skill.ts:59`).
4. Queries `subscriptions` table via Supabase REST: `plan='pro' AND status IN ('active','cancelled')`.
5. On success: streams `api/_assets/opten.zip` (bundled via `vercel.json:17` `includeFiles`); CORS limited to `https://opten.space`.

## Billing Flow at a Glance

```
Lang detection (LangProvider) ──► default currency
                                  (ru → RUB, en → USD)
                                  override stored in localStorage.opten_pay_currency
        │
        ▼
PayPage currency toggle
        │
        ├─ RUB path ─► fetch Supabase function create-yookassa-payment
        │              ─► returns confirmation_url
        │              ─► window.location.assign(confirmation_url)
        │              ─► YooKassa hosted page ─► return_url = /success
        │
        └─ USD path ─► ensurePaddle() ─► Paddle.Checkout.open({
                                              items, customer, successUrl: /success
                                          })
                       ─► overlay closes ─► redirect /success?_ptxn=txn_…
```

Locked URLs in this flow: `/pay`, `/success` (see top of file).

## State Model

| Concern | Where it lives | Notes |
|---------|----------------|-------|
| i18n language | React Context (`LangProvider`) + `localStorage.opten_lang` | Detect on mount; default RU (SSR-safe) |
| Pay-page currency | `useState` + `localStorage.opten_pay_currency` | Manual override survives lang change for one mount, then resets on real lang change (`PayPage.tsx:126-135`) |
| Auth token (JWT) | Per-page `useState` only; fetched on mount from extension or URL hash | Never persisted by site |
| Subscription | Per-page `useState` (PayPage, AccountPage) | Fetched on demand from `get-subscription` function |
| Theme / dark mode | Hardcoded dark | No `next-themes` usage despite dep |
| All user/auth/sub source of truth | **Extension's `chrome.storage.local`** under `ps_*` keys | Site reads via `chrome.runtime.sendMessage` only — see INTEGRATION-CONTRACT §5 |

No global store (no Redux, Zustand, React Query). Only React Context is `LangContext`.

## Entry Points

- `index.html` — loads `/src/main.tsx`, preloads fonts, preconnects to Paddle CDN, embeds Schema.org JSON-LD.
- `src/main.tsx` — boots React, decides hydrate vs render, registers all routes.
- `scripts/entry-server.tsx` — SSR entry for prerender (`renderRoute(path)`).
- `scripts/seo-routes.ts` — manifest consumed by `prerender.mjs` + `sitemap.mjs`.
- `api/download-skill.ts` — only serverless function.

## Architectural Constraints

- **No SSR at request time.** Everything is static + client-rendered. Vercel only runs `/api/download-skill`.
- **SPA fallback is destructive.** Vercel rewrites unknown paths to `/index.html` (prerendered for `/`). The hydration guard in `main.tsx` is mandatory; removing it re-introduces React hydration mismatches on `/account`, `/success`, `/dashboard/*`.
- **Lazy routes must stay lazy.** Eager-importing `PayPage`/`AccountPage`/`SuccessPage`/`DownloadSkillPage` into `main.tsx` breaks SSR build (`localStorage`/`window` at module load). Comment at `src/main.tsx:14-17` documents the precedent.
- **Hardcoded coupling constants.** `EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` are duplicated across `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, `api/download-skill.ts`. Any change must update all four — see CLAUDE.md and `docs/INTEGRATION-CONTRACT.md`.
- **`src/imports/`** is Figma-Make generated SVG/asset code (auto-generated, brittle — see STRUCTURE.md).
- **Globals at runtime:** `window.Paddle` (injected by SDK), `window.__PRERENDER_PATH` (injected by `prerender.mjs`).
- **No tests, no ESLint, no `typecheck` script.** TS errors only surface during `vite build`.

## Anti-Patterns

### Adding new pages with user state to `main.tsx` as eager imports

**What happens:** Importing PayPage/AccountPage/etc. eagerly causes `vite build --ssr` to evaluate `localStorage` and `window.Paddle` at module load.
**Why it's wrong:** SSR build crashes; even if you skip mount in `entry-server.tsx`, module-level side effects still execute.
**Do this instead:** `lazy(() => import("./app/pages/Foo.tsx"))` and wrap with `<Suspense>` like `src/main.tsx:18-21`.

### Reading auth/sub state from `localStorage`

**What happens:** Tempting to cache extension JWT in site storage.
**Why it's wrong:** Source of truth is extension's `chrome.storage.local` (`ps_*` keys). Caching creates staleness when user logs out from popup. Per INTEGRATION-CONTRACT §5.
**Do this instead:** Re-fetch token via `chrome.runtime.sendMessage({ type: "GET_AUTH_TOKEN" })` on every mount — see `PayPage.tsx:179-205`.

### Renaming `/welcome`, `/pay`, `/success`

**What happens:** Already-shipped extension binaries open these literal URLs.
**Why it's wrong:** Shipped extensions in Chrome Web Store cannot be hotfixed faster than the site; renaming breaks installed users.
**Do this instead:** Keep paths; add new alias routes if needed and only retire after the extension has been at the new path long enough.

### Adding `@supabase/supabase-js`

**What happens:** Larger bundle, duplicate logic.
**Why it's wrong:** Project intentionally uses raw `fetch` to `/rest/v1/*` and `/functions/v1/*`. The anon key is a public JWT — no client lib needed.
**Do this instead:** Stick with `fetch`. See existing call sites in `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`.

## Error Handling

- Per-page `try/catch` around `fetch`; surfaced via `useState<string | null>(error)`.
- Extension detection uses `chrome.runtime.lastError` + tried-counter pattern (PayPage.tsx:186-205).
- No global error boundary, no Sentry/observability wired in.
- Serverless `api/download-skill.ts` returns typed JSON errors (`missing_token`, `invalid_token`, `auth_failed`, `not_pro`, …).

## Cross-Cutting Concerns

- **Logging:** `console.*` only. No structured logging.
- **Validation:** None at site layer beyond `react-hook-form` (not actively used in the 8 routes).
- **Authentication:** All delegated to extension + Supabase JWT.
- **i18n:** RU/EN strings in `src/i18n/{ru,en}.json`; `t(key)` lookup, falls back through `en → key`. SEO route manifest duplicates RU titles/descriptions (`scripts/seo-routes.ts` header comment).
- **Performance:** Phase 2.2 work — Paddle SDK no longer site-wide; manualChunks split for `vendor-router`, `vendor-react`, `vendor-lucide` (`vite.config.ts:34-44`); fonts self-hosted WOFF2 + preloaded; `vite-imagetools` for `?as=picture` responsive images.

---

*Architecture analysis: 2026-05-16*
