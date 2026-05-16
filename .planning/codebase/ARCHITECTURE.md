<!-- refreshed: 2026-05-17 -->
# Architecture

**Analysis Date:** 2026-05-17

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│  Browser (SPA + prerendered RU + EN HTML shells)                    │
│                                                                     │
│  index.html  ──preload──>  /fonts/*.woff2                           │
│       │       ──preconnect─> cdn.paddle.com   (only on /pay,/en/pay) │
│       ▼                                                             │
│  src/main.tsx  ── createRoot | hydrateRoot ──>  <App>               │
│       │                                                             │
│       ├─ <BrowserRouter>                                            │
│       │     └─ <LangProvider>   (URL-prefix → localStorage → nav)   │
│       │           └─ <Suspense fallback={RouteLoading}>             │
│       │                 └─ <Routes>   15 declarations               │
│       │                      ├─ 9 RU (incl. SPA-only /success,     │
│       │                      │        /account, /dashboard/*)       │
│       │                      └─ 6 EN siblings under /en/*           │
│       └─ hydration guard: window.__PRERENDER_PATH === pathname      │
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
  3. `vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta` — route manifest (RU + EN entries).
  4. `node scripts/prerender.mjs` — emits per-route `dist/{route}/index.html` for every manifest entry whose `prerender !== "none"`.
  5. `node scripts/sitemap.mjs` — sitemap regeneration; throws if fewer than 12 routes are found (6 RU + 6 EN floor).
- **12 emitted HTML shells** = 6 RU (`/`, `/pay` head-only, `/welcome`, `/privacy`, `/terms`, `/refund`) + 6 EN (`/en/`, `/en/pay` head-only, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund`).
- Prerender tiers (`scripts/seo-routes.ts`):
  - `full` — both `<head>` and `<body>` prerendered. RU: `/`, `/welcome`, `/privacy`, `/terms`, `/refund`. EN: `/en/`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund`.
  - `head` — meta-only; body stays empty `#root`. RU: `/pay`. EN: `/en/pay`.
  - SPA-only (not in manifest, no shell emitted) — `/success`, `/account`, `/dashboard/download-skill`. Vercel SPA-fallback serves `dist/index.html` and hydration guard discards the stale tree.
- `scripts/entry-server.tsx` mounts ONLY the 10 full-prerender routes (5 RU + 5 EN). Importing PayPage/SuccessPage/AccountPage/DownloadSkillPage would crash SSR because of `localStorage`, `window.Paddle`, `chrome.runtime` use at module level.
- `LangProvider` lives **inside** both `<BrowserRouter>` (client) and `<StaticRouter>` (SSR) so its `useLocation()` call has a router context. This was changed in Phase 3 — relocating it outside breaks both render paths.
- Hydration guard in `src/main.tsx:73-81`: hydrate only when `#root` has children AND `window.__PRERENDER_PATH === location.pathname`; otherwise wipe + `createRoot`. The marker is injected per-route by `scripts/prerender.mjs:118-124` (`applyMarker`) so a Vercel SPA-fallback hit at `/account` is correctly detected as a path mismatch against the prerendered-for-`/` shell.
- Vercel SPA fallback rewrite: `vercel.json:3` — `/((?!api/).*) → /index.html`. Affects every route that doesn't have its own `dist/{route}/index.html` (i.e. the 3 SPA-only routes and any 404).

## Route Table

| Path | Component file | Purpose | Prerender tier | Locked? |
|------|----------------|---------|---------------|---------|
| `/` | `src/app/App.tsx` | Landing (RU) | full | no |
| `/pay` | `src/app/pages/PayPage.tsx` (lazy) | Pricing + Paddle/YooKassa | head | **yes** — extension popup CTA |
| `/success` | `src/app/pages/SuccessPage.tsx` (lazy) | Post-payment thank-you | none (SPA only) | **yes** — YooKassa `return_url` |
| `/welcome` | `src/app/pages/WelcomePage.tsx` | Post-install onboarding (RU) | full | **yes** — extension on-install navigate |
| `/account` | `src/app/pages/AccountPage.tsx` (lazy) | Subscription mgmt | none (SPA only) | no |
| `/privacy` | `src/app/pages/PrivacyPage.tsx` | Legal (RU) | full | no |
| `/terms` | `src/app/pages/TermsPage.tsx` | Legal (RU) | full | no |
| `/refund` | `src/app/pages/RefundPage.tsx` | Legal (RU) | full | no |
| `/dashboard/download-skill` | `src/app/pages/DownloadSkillPage.tsx` (lazy) | Pro-gated ZIP download | none (SPA only) | no |
| `/en/` | `src/app/App.tsx` | Landing (EN) | full | no |
| `/en/pay` | `src/app/pages/PayPage.tsx` (lazy) | Pricing (EN) | head | no |
| `/en/welcome` | `src/app/pages/WelcomePage.tsx` | Onboarding (EN) | full | no |
| `/en/privacy` | `src/app/pages/PrivacyPage.tsx` | Legal (EN) | full | no |
| `/en/terms` | `src/app/pages/TermsPage.tsx` | Legal (EN) | full | no |
| `/en/refund` | `src/app/pages/RefundPage.tsx` | Legal (EN) | full | no |

**15 Route declarations** in `src/main.tsx:50-67` (9 RU + 6 EN). Same React components serve both languages — `LangProvider` flips content based on the URL prefix. Lazy-loaded routes (PayPage, SuccessPage, AccountPage, DownloadSkillPage) are the four that touch user-state / payment surfaces — they must never enter the `hydrateRoot` path (see comment at `src/main.tsx:14-17`).

The three SPA-only RU routes (`/success`, `/account`, `/dashboard/download-skill`) intentionally have **no EN siblings**: they are post-flow / locked / authenticated surfaces where language is preserved via storage + `LangProvider` state rather than a URL prefix change. `LangSwitcher` detects this case (`toEnTarget` returns null) and skips the navigate call.

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `main.tsx` | Entry, router, hydration decision, 15 Route declarations | `src/main.tsx` |
| `entry-server.tsx` | SSR entry — `renderRoute(path)` for the 10 full-prerender routes | `scripts/entry-server.tsx` |
| `prerender.mjs` | Postbuild splicer — per-route HTML emission, hreflang, `<html lang>`, og:locale, marker | `scripts/prerender.mjs` |
| `sitemap.mjs` | Postbuild sitemap generator (12-route floor) | `scripts/sitemap.mjs` |
| `seo-routes.ts` | Per-route SEO meta manifest (RU + EN, 12 entries) | `scripts/seo-routes.ts` |
| `LangProvider` | URL-prefix → storage → navigator detection; lazy EN dict; t() lookup | `src/i18n/LangContext.tsx` |
| `useOnEnPath()` | Hook — true iff current URL starts `/en/` (or is `/en`) | `src/i18n/LangContext.tsx:164-167` |
| `paths.ts` | EN_SIBLINGS allow-list + `toEnTarget` / `toRuTarget` / `localizeHref` rewriters | `src/i18n/paths.ts` |
| `LangSwitcher` | Storage write + conditional navigate (no-op on non-sibling routes) | `src/app/components/LangSwitcher.tsx` |
| `LocalizedLink` | Drop-in `<Link>` that rewrites internal hrefs to /en/ siblings on /en/* paths | `src/app/components/LocalizedLink.tsx` |
| `App` (landing) | Hero, features, partners, CTAs | `src/app/App.tsx` |
| `PayPage` | Currency selector, Paddle SDK init, YooKassa fetch, sub fetch, ext detection | `src/app/pages/PayPage.tsx` |
| `AccountPage` | Subscription summary, cancel/update card, ext detection | `src/app/pages/AccountPage.tsx` |
| `DownloadSkillPage` | Pro-gated ZIP fetch from `/api/download-skill` | `src/app/pages/DownloadSkillPage.tsx` |
| `SuccessPage` | Static thank-you, logs Paddle txn from `?_ptxn=` | `src/app/pages/SuccessPage.tsx` |
| `ensurePaddle()` | Idempotent Paddle SDK loader + Initialize() | `src/lib/paddle.ts` |
| `OptenHeroAnimation` | Landing hero animation | `src/app/components/OptenHeroAnimation.tsx` |
| `Picture` | `<picture>` wrapper for `vite-imagetools` `?as=picture` imports | `src/app/components/Picture.tsx` |
| `RouteLoading` | Suspense fallback for lazy routes | `src/app/components/RouteLoading.tsx` |
| `LegalLayout` | Shared chrome for privacy/terms/refund — wires LangSwitcher + LocalizedLink | `src/app/components/layout/LegalLayout.tsx` |
| `ImageWithFallback` | `<img>` with fallback (Figma-generated helper) | `src/app/components/figma/ImageWithFallback.tsx` |
| `download-skill` handler | JWT verify → Supabase sub check → stream `opten.zip` | `api/download-skill.ts` |

## i18n Flow (URL + storage + navigator)

```
                                ┌────────────────────────────────────┐
                                │  LangProvider mounted under Router │
                                └────────────────────────────────────┘
                                              │
                                              ▼ useLocation().pathname
                                  ┌──────────────────────────────┐
                                  │  detectLangFromPath(pathname)│
                                  └──────────────────────────────┘
                                              │
            ┌─────────────────────────────────┼─────────────────────────────────┐
            ▼ startsWith("/en/")              ▼ no match                         │
       lang = "en"                    detectLangFromStorage():                   │
       (loadEnDict on demand,         1. localStorage.opten_lang_v3              │
        flash of RU keys ~ms,         2. legacy localStorage.opten_lang === "en" │
        SSR uses static enFallback)      (one-shot migration; "ru" ignored)      │
                                       3. navigator.language startsWith "ru"    │
                                              │                                  │
                                              ▼                                  │
                                          "ru" or "en" (default RU when SSR)     │
```

- **URL prefix wins.** `LangProvider` runs `detectLangFromPath(location.pathname)` on every location change (`LangContext.tsx:99-121`). `/en/*` → en, anything else → fall through to storage/navigator.
- **Storage key was bumped.** Phase 3 follow-up switched from `opten_lang` to `opten_lang_v3` (`LangContext.tsx:20-21`) to discard stale `"ru"` values written by earlier auto-detect builds. The legacy `opten_lang` key is still read once and honored only when its value is exactly `"en"` (explicit choice migration); a legacy `"ru"` is treated as no signal so navigator.language can win.
- **SSR safety.** `LangContext.tsx:25` and `:62-64` short-circuit when `typeof window === "undefined"` — `enFallback` (statically imported `en.json`) is populated synchronously on the server so `/en/*` SSR renders the EN dict on first paint, while clients still hit the lazy `loadEnDict()` path.
- **`LocalizedLink`.** Every internal `<Link>` in the prerendered shell tree (currently `LegalLayout.tsx`) goes through `LocalizedLink`, which calls `useOnEnPath()` and routes through `localizeHref(href, onEnPath)` (`src/i18n/paths.ts:57-68`). On `/en/*`, sibling targets (`/pay`, `/privacy`, etc.) are rewritten to `/en/...`; non-siblings (`/account`) pass through unchanged.
- **`LangSwitcher` is two-mode.** `LangSwitcher.tsx:35-53` always writes `setLang()` (storage + state), then computes a target via `toEnTarget` / `toRuTarget`. If the target is `null` (locked / SPA-only route with no EN sibling) or equal to the current pathname, it skips `navigate()` — the user stays on the page and the content layer re-renders in the new language. This is the fix for the Phase-3 follow-up bug where switching language on `/account` dumped users back at `/en/`.

## Hreflang & SEO Triplet

`scripts/prerender.mjs` bakes three lang-related artifacts into every emitted shell:

1. **`<html lang>`** — `applyHtmlLang` (line 35) replaces the source `<html lang="ru">` with `meta.htmlLang` (`"ru"` or `"en"`).
2. **Hreflang alternates** — `applyHreflang` (line 48) injects three `<link rel="alternate">` tags (ru, en, x-default) immediately after the canonical link. All three URLs come from `meta.hreflangAlternates` in `seo-routes.ts` — reciprocity is enforced by the manifest, never hand-typed in HTML.
3. **og:locale + og:locale:alternate** — `applyOgLocale` (line 65) swaps `og:locale` to `en_US`/`ru_RU` to match `<html lang>` and injects the alternate locale tag.

Sitemap (`scripts/sitemap.mjs`) re-emits the same triplet as `xhtml:link rel="alternate"` entries per `<url>` so search engines see consistent reciprocity from both the page-level and sitemap-level signals.

x-default canonical is always the RU sibling (D-02). The manifest fails fast if the structure of `index.html` ever changes — every `applyX` helper asserts its anchor matched before continuing.

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

1. On `/pay` and `/en/pay`, the prerendered head includes a sync `<script src="cdn.paddle.com/paddle/v2/paddle.js">` tag (injected by `scripts/prerender.mjs:175-180` `applyPaddleScript`; the gate at line 192 fires for both paths).
2. On SPA navigation to either path, `ensurePaddle()` (`src/lib/paddle.ts:30`) injects the script async.
3. After load: `Paddle.Environment.set("sandbox")` (only when `VITE_PADDLE_ENV === "sandbox"`), then `Paddle.Initialize({ token: VITE_PADDLE_CLIENT_TOKEN })`.
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
PayPage currency toggle  (works identically on /pay and /en/pay)
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

Locked URLs in this flow: `/pay`, `/success` (see top of file). `/en/pay` is non-locked — added in Phase 3 for SEO; the extension still opens `/pay`.

## State Model

| Concern | Where it lives | Notes |
|---------|----------------|-------|
| i18n language | React Context (`LangProvider`) — URL prefix > localStorage > navigator | URL is primary, storage records explicit user choice, navigator is the cold-start fallback. Default RU on SSR. |
| Lang storage key | `localStorage.opten_lang_v3` (current) + `opten_lang` (legacy, one-shot read of `"en"` only) | Phase 3 bumped the key — earlier auto-write contaminated `opten_lang` with `"ru"` for everyone. |
| Pay-page currency | `useState` + `localStorage.opten_pay_currency` | Manual override survives lang change for one mount, then resets on real lang change (`PayPage.tsx:126-135`) |
| Auth token (JWT) | Per-page `useState` only; fetched on mount from extension or URL hash | Never persisted by site |
| Subscription | Per-page `useState` (PayPage, AccountPage) | Fetched on demand from `get-subscription` function |
| Theme / dark mode | Hardcoded dark | No `next-themes` usage despite dep |
| All user/auth/sub source of truth | **Extension's `chrome.storage.local`** under `ps_*` keys | Site reads via `chrome.runtime.sendMessage` only — see INTEGRATION-CONTRACT §5 |

No global store (no Redux, Zustand, React Query). Only React Context is `LangContext`.

## Entry Points

- `index.html` — loads `/src/main.tsx`, preloads fonts, embeds Schema.org JSON-LD. The Paddle preconnect/script is **not** in the source template; `prerender.mjs` injects it only into `/pay` and `/en/pay`.
- `src/main.tsx` — boots React, decides hydrate vs render, registers all 15 routes (9 RU + 6 EN).
- `scripts/entry-server.tsx` — SSR entry, `renderRoute(path)` for full-prerender routes (5 RU + 5 EN).
- `scripts/seo-routes.ts` — manifest (12 entries) consumed by `prerender.mjs` + `sitemap.mjs`.
- `api/download-skill.ts` — only serverless function.

## Architectural Constraints

- **No SSR at request time.** Everything is static + client-rendered. Vercel only runs `/api/download-skill`.
- **SPA fallback is destructive.** Vercel rewrites unknown paths to `/index.html` (prerendered for `/`). The hydration guard in `main.tsx` is mandatory; removing it re-introduces React hydration mismatches on `/account`, `/success`, `/dashboard/*`.
- **Lazy routes must stay lazy.** Eager-importing `PayPage`/`AccountPage`/`SuccessPage`/`DownloadSkillPage` into `main.tsx` breaks SSR build (`localStorage`/`window` at module load). Comment at `src/main.tsx:14-17` documents the precedent.
- **`LangProvider` must be inside the Router.** Both `BrowserRouter` (`main.tsx:47-70`) and `StaticRouter` (`entry-server.tsx:25-44`) wrap `LangProvider`. The provider calls `useLocation()` synchronously during render; placing it outside throws.
- **EN_SIBLINGS allow-list is the only source of truth for path rewrites.** `LangSwitcher`, `LocalizedLink`, and any future "what's my EN counterpart?" logic must go through `src/i18n/paths.ts`. Hand-rolled `"/en" + path` concatenation in components is forbidden — it breaks the open-redirect mitigation and bypasses the SPA-only route carve-out.
- **EN_SIBLINGS must stay in sync with `scripts/seo-routes.ts`.** The 6 entries in `paths.ts` must match the 6 EN entries in the manifest. Sitemap throws if fewer than 12 routes are present.
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
**Do this instead:** Keep paths; add new alias routes if needed and only retire after the extension has been at the new path long enough. The `/en/` siblings of these paths are NOT locked — only the unprefixed forms are.

### Hand-rolling `/en/` prefix concatenation in components

**What happens:** Calling `to={` ``/en${path}`` `}` in a `<Link>` or `navigate("/en" + somewhere)` in a handler.
**Why it's wrong:** Sends users to `/en/account`, `/en/success`, `/en/dashboard/*` — routes that don't exist as prerender shells, have no extension contract, and skip the allow-list check that prevents open-redirect.
**Do this instead:** Use `<LocalizedLink>` for internal navigation and `toEnTarget`/`toRuTarget`/`localizeHref` from `src/i18n/paths.ts` for any imperative routing decision.

### Forgetting to update both `EN_SIBLINGS` and `seo-routes.ts`

**What happens:** New EN sibling added to `seo-routes.ts` but not to `paths.ts` (or vice versa).
**Why it's wrong:** Manifest entry without `EN_SIBLINGS` entry → `LocalizedLink` skips the rewrite and footer links dump users back to RU. Allow-list entry without manifest entry → `LangSwitcher` navigates to a path that has no prerendered shell and SPA-fallback paints `/`.
**Do this instead:** Add EN routes in three places at once — `src/i18n/paths.ts:9-16`, `scripts/seo-routes.ts` (RU `hreflangAlternates.en` + new EN entry), `src/main.tsx` Routes block.

### Adding `@supabase/supabase-js`

**What happens:** Larger bundle, duplicate logic.
**Why it's wrong:** Project intentionally uses raw `fetch` to `/rest/v1/*` and `/functions/v1/*`. The anon key is a public JWT — no client lib needed.
**Do this instead:** Stick with `fetch`. See existing call sites in `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`.

## Error Handling

- Per-page `try/catch` around `fetch`; surfaced via `useState<string | null>(error)`.
- Extension detection uses `chrome.runtime.lastError` + tried-counter pattern (`PayPage.tsx:186-205`).
- No global error boundary, no Sentry/observability wired in.
- Serverless `api/download-skill.ts` returns typed JSON errors (`missing_token`, `invalid_token`, `auth_failed`, `not_pro`, …).
- Prerender pipeline fails fast: every `applyX` helper in `scripts/prerender.mjs` asserts its anchor matched; sitemap throws if fewer than 12 routes are emitted. Both make schema drift in `index.html` impossible to silently swallow.

## Cross-Cutting Concerns

- **Logging:** `console.*` only. No structured logging.
- **Validation:** None at site layer beyond `react-hook-form` (not actively used in the 8 routes).
- **Authentication:** All delegated to extension + Supabase JWT.
- **i18n:** RU/EN strings in `src/i18n/{ru,en}.json`. `t(key)` falls back through `current → ru → key`. SEO route manifest duplicates titles/descriptions per locale (`scripts/seo-routes.ts` SYNC header). EN is lazy-loaded on the client (`loadEnDict()`) and synchronously available on the SSR path via static `enFallback` import (`LangContext.tsx:9, 62-64`).
- **Performance:** Phase 2.2 work — Paddle SDK no longer site-wide; manualChunks split for `vendor-router`, `vendor-react`, `vendor-lucide` (`vite.config.ts:34-44`); fonts self-hosted WOFF2 + preloaded; `vite-imagetools` for `?as=picture` responsive images; EN dict lazy-loaded (~13 KB gzip saved on RU visits).

---

*Architecture analysis: 2026-05-17*
