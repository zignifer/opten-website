<!-- refreshed: 2026-05-18 -->
# Architecture — opten.space

**Analysis Date:** 2026-05-18

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
│       │                 └─ <Routes>   18 declarations               │
│       │                      ├─ 9 RU (incl. SPA-only /success,     │
│       │                      │        /account, /dashboard/*)       │
│       │                      ├─ 9 EN siblings under /en/*           │
│       │                      └─ catch-all <Route path="*">          │
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
  2. `vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache` — SSR bundle (app mount only).
  3. `vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta` — route manifest (RU + EN entries).
  4. `node scripts/prerender.mjs` — emits per-route `dist/{route}/index.html` for every manifest entry whose `prerender: "full"` or `"head"`.
  5. `node scripts/sitemap.mjs` — sitemap regeneration; throws if fewer than 18 routes are found (9 RU + 9 EN floor, Phase 5).
  6. `node scripts/llms.mjs` — AI crawler index (llms.txt + llms-full.txt).
  7. `node scripts/verify-faq-mainentity.mjs` — build gate: visible FAQ DOM must match FAQPage schema.
  8. `node scripts/indexnow.mjs` — Bing IndexNow ping (non-fatal).
- **18 emitted HTML shells** = 9 RU (`/`, `/pay`, `/welcome`, `/about`, `/blog`, `/blog/<slug>`, `/privacy`, `/terms`, `/refund`) + 9 EN siblings (`/en/` + same paths).
- Prerender tiers (`scripts/seo-routes.ts`):
  - `full` — both `<head>` and `<body>` prerendered. RU: `/`, `/welcome`, `/about`, `/blog`, `/blog/<slug>`, `/privacy`, `/terms`, `/refund`. EN: `/en/` + same.
  - `head` — meta-only; body stays empty `#root`. RU: `/pay`. EN: `/en/pay`.
  - SPA-only (not in manifest, no shell emitted) — `/success`, `/account`, `/dashboard/download-skill`. Vercel SPA-fallback serves `dist/index.html` (prerendered for `/`) and hydration guard discards the stale tree.
- `scripts/entry-server.tsx` mounts the full-prerender routes only (9 RU + 9 EN). Importing SuccessPage/AccountPage/DownloadSkillPage would crash SSR.
- `LangProvider` lives **inside** both `<BrowserRouter>` (client) and `<StaticRouter>` (SSR) so its `useLocation()` call has a router context.
- Hydration guard in `src/main.tsx:88-96`: hydrate only when `#root` has children AND `window.__PRERENDER_PATH === location.pathname`; otherwise wipe + `createRoot`. The marker is injected per-route by `scripts/prerender.mjs`.
- Vercel SPA fallback rewrite: `vercel.json:3` — `/((?!api/).*) → /index.html`. Affects SPA-only routes and catch-all 404.

## Route Table (post-v1.0)

| Path | Component file | Purpose | Prerender tier | Locked? |
|------|----------------|---------|---------------|---------|
| `/` | `src/app/App.tsx` | Landing (RU) | full | no |
| `/pay` | `src/app/pages/PayPage.tsx` (lazy) | Pricing + Paddle/YooKassa | head | **yes** — extension popup CTA |
| `/success` | `src/app/pages/SuccessPage.tsx` (lazy) | Post-payment thank-you | none (SPA only) | **yes** — YooKassa `return_url` |
| `/welcome` | `src/app/pages/WelcomePage.tsx` | Post-install onboarding (RU) | full | **yes** — extension on-install navigate |
| `/about` | `src/app/pages/AboutPage.tsx` | E-E-A-T founder page (RU) | full | no (Phase 4.1 B-03) |
| `/blog` | `src/app/pages/BlogListPage.tsx` | Blog hub — search + filter + cards | full | no (Phase 5 B-04) |
| `/blog/:slug` | `src/app/pages/BlogPostPage.tsx` | Blog post (RU + EN; slug neutral) | full (per-slug) | no (Phase 5 B-05/B-07) |
| `/account` | `src/app/pages/AccountPage.tsx` (lazy) | Subscription mgmt | none (SPA only) | no |
| `/privacy` | `src/app/pages/PrivacyPage.tsx` | Legal (RU) | full | no |
| `/terms` | `src/app/pages/TermsPage.tsx` | Legal (RU) | full | no |
| `/refund` | `src/app/pages/RefundPage.tsx` | Legal (RU) | full | no |
| `/dashboard/download-skill` | `src/app/pages/DownloadSkillPage.tsx` (lazy) | Pro-gated ZIP download | none (SPA only) | no |
| `/en/*` | (EN siblings) | Bilingual mirrors, same RU components | full/head | no |
| `*` | `src/app/pages/NotFound.tsx` | Catch-all 404 (runtime noindex) | none (SPA only) | no (Phase 4.2) |

**18 prerendered Routes** in `src/main.tsx` (9 RU + 9 EN). Same React components serve both languages — `LangProvider` flips content. Lazy-loaded routes (PayPage, SuccessPage, AccountPage, DownloadSkillPage) never enter SSR.

**3 SPA-only RU routes** (`/success`, `/account`, `/dashboard/download-skill`) intentionally have **no EN siblings** — language flip via storage rather than URL navigation. `LangSwitcher` detects this and skips navigate.

**Catch-all route** (`<Route path="*">`):
- Renders `<NotFound>` component.
- Injects `<meta name="robots" content="noindex,nofollow">` at runtime.
- Locale-aware fallback text via `useT()`.
- HTTP status stays 200 (Vercel SPA rewrite unchanged; 404 response deferred to Phase 6).

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `main.tsx` | Entry, router, hydration decision, 18 Route declarations + catch-all | `src/main.tsx` |
| `entry-server.tsx` | SSR entry — `renderRoute(path)` for full-prerender routes only | `scripts/entry-server.tsx` |
| `seo-routes.ts` | Per-route SEO meta manifest (RU + EN, 18 entries + catch-all) | `scripts/seo-routes.ts` (47.8 KB) |
| `prerender.mjs` | Postbuild splicer — per-route HTML emission, hreflang, lang, og:locale, marker | `scripts/prerender.mjs` |
| `sitemap.mjs` | Postbuild sitemap generator (18-route floor, Phase 5) | `scripts/sitemap.mjs` |
| `llms.mjs` | AI-crawler index (llms.txt + llms-full.txt) | `scripts/llms.mjs` |
| `verify-faq-mainentity.mjs` | Build gate — FAQ parity check | `scripts/verify-faq-mainentity.mjs` |
| `LangProvider` | URL-prefix → storage → navigator detection; lazy EN dict; t() lookup | `src/i18n/LangContext.tsx` |
| `paths.ts` | EN_SIBLINGS allow-list + `toEnTarget`/`toRuTarget`/`localizeHref` | `src/i18n/paths.ts` |
| `LangSwitcher` | Storage write + conditional navigate (no-op on non-sibling routes) | `src/app/components/LangSwitcher.tsx` |
| `LocalizedLink` | Drop-in `<Link>` that rewrites hrefs to /en/ on /en/* paths | `src/app/components/LocalizedLink.tsx` |
| `SiteHeader` | Unified hamburger nav (variant: "landing" for App.tsx, "page" for all others) | `src/app/components/SiteHeader.tsx` (Phase 5 B-03) |
| `SiteFooter` | Shared CTA + nav footer | `src/app/components/SiteFooter.tsx` (Phase 5 B-03) |
| `App` (landing) | Hero, features, partners, CTAs, landing FAQ | `src/app/App.tsx` |
| `PayPage` | Currency selector, Paddle SDK init, YooKassa fetch, sub fetch, ext detect | `src/app/pages/PayPage.tsx` |
| `AccountPage` | Subscription summary, cancel/update card, ext detect | `src/app/pages/AccountPage.tsx` |
| `AboutPage` | Founder E-E-A-T page with Person schema | `src/app/pages/AboutPage.tsx` (Phase 4.1 B-03) |
| `BlogListPage` | Blog hub — CollectionPage + client filter/search | `src/app/pages/BlogListPage.tsx` (Phase 5 B-04) |
| `BlogPostPage` | Blog post — BlogPosting + HowTo + FAQ + WebPage speakable | `src/app/pages/BlogPostPage.tsx` (Phase 5 B-05) |
| `NotFound` | Catch-all 404 — locale-aware, injects runtime noindex | `src/app/pages/NotFound.tsx` (Phase 4.2) |
| `DownloadSkillPage` | Pro-gated ZIP fetch from `/api/download-skill` | `src/app/pages/DownloadSkillPage.tsx` |
| `SuccessPage` | Static thank-you, logs Paddle txn from `?_ptxn=` | `src/app/pages/SuccessPage.tsx` |
| `BlogPostCard` | Blog grid card with cover, title, excerpt, tags, reading time | `src/app/components/BlogPostCard.tsx` (Phase 5) |
| `FaqBlock` | Semantic `<dl>` FAQ — source-of-truth for FAQPage schema | `src/app/components/FaqBlock.tsx` |
| `ensurePaddle()` | Idempotent Paddle SDK loader + Initialize() | `src/lib/paddle.ts` |
| `OptenHeroAnimation` | Landing hero animation | `src/app/components/OptenHeroAnimation.tsx` |
| `Picture` | `<picture>` wrapper for `vite-imagetools` `?as=picture` imports | `src/app/components/Picture.tsx` |
| `RouteLoading` | Suspense fallback for lazy routes | `src/app/components/RouteLoading.tsx` |
| `LegalLayout` | Shared chrome for /privacy, /terms, /refund | `src/app/components/layout/LegalLayout.tsx` |
| `download-skill` handler | JWT verify → Supabase sub check → stream opten.zip | `api/download-skill.ts` |

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

- **URL prefix wins.** `LangProvider` runs `detectLangFromPath(location.pathname)` on every location change. `/en/*` → en, anything else → fall through to storage/navigator.
- **Storage key was bumped.** Phase 3 switched from `opten_lang` to `opten_lang_v3` to discard stale `"ru"` values. Legacy `opten_lang` read once — honored only when value is exactly `"en"`.
- **SSR safety.** `enFallback` (statically imported `en.json`) is populated synchronously on server so `/en/*` SSR renders EN dict on first paint; clients still hit lazy `loadEnDict()`.
- **LocalizedLink.** Every internal `<Link>` in prerendered shell goes through `LocalizedLink`, which calls `useOnEnPath()` and routes through `localizeHref(href, onEnPath)`. On `/en/*`, sibling targets are rewritten to `/en/...`.
- **LangSwitcher is two-mode.** Always writes `setLang()` (storage + state), then computes a target via `toEnTarget`/`toRuTarget`. If target is `null` (locked SPA-only route) or equals current pathname, skips `navigate()` — user stays, content re-renders in new language.

## Hreflang & SEO Triplet

`scripts/prerender.mjs` bakes three artifacts into every emitted shell:

1. **`<html lang>`** — `applyHtmlLang` replaces source `<html lang="ru">` with `meta.htmlLang` (`"ru"` or `"en"`). Phase 3 D-06: never mutated at runtime.
2. **Hreflang alternates** — `applyHreflang` injects three `<link rel="alternate">` tags (ru, en, x-default) after canonical. All from `meta.hreflangAlternates` in `seo-routes.ts`.
3. **og:locale + og:locale:alternate** — `applyOgLocale` swaps `og:locale` to `en_US`/`ru_RU` to match `<html lang>` and injects alternate locale tag.

Sitemap (`scripts/sitemap.mjs`) re-emits triplet as `xhtml:link` entries per `<url>` so search engines see consistent reciprocity.

x-default canonical is always the RU sibling (D-02). Manifest fails fast if `index.html` structure changes — every `applyX` helper asserts its anchor matched.

## Data Flows

### A. Site ↔ Extension (chrome.runtime.sendMessage)

1. Page mounts (PayPage / AccountPage / DownloadSkillPage).
2. Iterate `EXTENSION_IDS = ["iphkppgbobpilmphloffcalicmejacfl" (CWS), "kcmcaeenfmfnpiaihicecnfnagejpcog" (dev)]`.
3. `chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, cb)` — uses extension's `externally_connectable` manifest (opten.space only).
4. Response: `{ token, email }` or `chrome.runtime.lastError` → status transitions.
5. Token is Supabase JWT; used for all subsequent REST + function calls.
6. Site never persists token — auth lives in extension `chrome.storage.local` (`ps_*` keys).

### B. Site → Supabase

- Direct `fetch` (no `@supabase/supabase-js`).
- Base URL: `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"`.
- Anon key: `SUPABASE_ANON_KEY` (public JWT).
- Endpoints: `get-subscription`, `create-payment`, `create-payment-paddle`, `cancel-subscription`, `cancel-subscription-paddle`, `/auth/v1/user`.
- Edge Functions live in **extension repo** (`C:\Projects\promptscore`), not here.

### C. Site → Paddle

1. On `/pay` and `/en/pay`, prerendered head includes sync `<script src="cdn.paddle.com/paddle/v2/paddle.js">` (injected by `prerender.mjs:applyPaddleScript`).
2. On SPA navigation, `ensurePaddle()` (`src/lib/paddle.ts`) injects async.
3. After load: `Paddle.Environment.set("sandbox")` (only in sandbox mode), then `Paddle.Initialize({ token: VITE_PADDLE_CLIENT_TOKEN })`.
4. CTA opens `Paddle.Checkout.open({...})` overlay; on success Paddle redirects to `/success?_ptxn=txn_…`.

### D. Browser → /api/download-skill (Vercel serverless)

1. `DownloadSkillPage` obtains JWT via flow A.
2. `GET /api/download-skill` with `Authorization: Bearer <jwt>`.
3. Serverless validates JWT against `${SUPABASE_URL}/auth/v1/user`.
4. Queries `subscriptions` table via REST: `plan='pro' AND status IN ('active','cancelled')`.
5. On success: streams `api/_assets/opten.zip` (6.5KB, bundled via `vercel.json:includeFiles`); CORS limited to `https://opten.space`.

## Blog Content Pipeline (Phase 5)

```
src/content/blog/<slug>.ts
  ├─ export const post: BlogPost = { ru, en }
  │  └─ ru/en: { slug, title, excerpt, description, category, tags,
  │            cover: {src, width, height, alt}, readingTimeMin,
  │            publishedAt, updatedAt,
  │            body: { intro, sections?, steps?, faq? }, related?: [...] }
  │
  ├─ src/content/blog/index.ts (barrel)
  │  └─ blogPostsBySlug + allBlogPosts (sorted newest-first by publishedAt)
  │
  ├─ BlogListPage (UI: filter/search/grid)
  │  └─ Renders CollectionPage schema + ItemList schema
  │
  ├─ BlogPostPage (UI: cover, intro, sections/steps, FAQ, related posts)
  │  └─ Renders BlogPosting + WebPage(speakable) + HowTo + FAQPage + BreadcrumbList
  │
  ├─ scripts/seo-routes.ts
  │  └─ Reads blogPostsBySlug
  │  └─ Generates 2 RouteMeta entries per post (RU + EN)
  │  └─ Embeds blogPostingBlock(image ≥1200px for Rich Results)
  │  └─ Embeds webPageBlock(speakable: [".blog-intro", "h2"])
  │  └─ Embeds howToBlock if body.steps present
  │  └─ Embeds faqPageBlock if body.faq present
  │
  └─ Prerender + sitemap + llms + verify-faq gates
     └─ dist/blog/<slug>/index.html emitted
     └─ sitemap.xml + llms.txt auto-include blog routes
     └─ FAQ parity enforced by verify-faq-mainentity.mjs
```

Cover image: `public/blog/<slug>/cover.jpg` (≥1600×900, no in-image text — one asset for RU + EN + OG).

SEO DOM mirrors JSON-LD: `.blog-intro` matches `WebPage.speakable.cssSelector`; `<h2>` are table-of-contents anchors in HowTo; FAQ `<dt>/<dd>` match FAQPage mainEntity items.

## Billing Flow

```
Lang detection (LangProvider) ──► default currency
                                  (ru → RUB, en → USD)
                                  override stored in localStorage.opten_pay_currency
        │
        ▼
PayPage currency toggle  (works on /pay and /en/pay)
        │
        ├─ RUB path ─► fetch Supabase /functions/v1/create-payment
        │              ─► returns confirmation_url
        │              ─► window.location.assign(confirmation_url)
        │              ─► YooKassa hosted page ─► webhook syncs subscriptions
        │              ─► YooKassa return_url = /success
        │
        └─ USD path ─► ensurePaddle() ─► Paddle.Checkout.open({
                                              items, customer, custom
                                          })
                       ─► overlay closes ─► Paddle webhook syncs subscriptions
                       ─► page.success or close
```

Locked URLs: `/pay`, `/success` (extension hardlinks). `/en/pay` is not locked — added Phase 4 for SEO.

## State Summary

| Concern | Where it lives | Notes |
|---------|----------------|-------|
| Current language | `localStorage.opten_lang_v3` (or URL prefix) | URL wins; storage records explicit choice; navigator is fallback. Default RU on SSR. |
| i18n dict | Bundled RU + lazy-loaded EN (client) / static EN fallback (SSR) | 68 KB RU, ~41 KB EN (gzip). |
| Pay-page currency | `useState` + `localStorage.opten_pay_currency` | Manual override survives one mount, resets on real lang change. |
| Auth token (JWT) | Per-page `useState` only | Fetched on mount via `chrome.runtime.sendMessage()`. Never persisted by site. |
| Subscription | Per-page `useState` | Fetched on demand from Supabase Edge Function. |
| Theme | Hardcoded dark | No next-themes. |
| **Source of truth** | **Extension's `chrome.storage.local`** under `ps_*` keys | Site reads via sendMessage only. |

**The site has no persistent server-side state of its own.** All persistence is browser-local or in Supabase (extension-owned).

## Entry Points

- `index.html` — SPA shell, meta, JSON-LD. Paddle preconnect/script NOT here; injected per-route by prerender.mjs.
- `src/main.tsx` — Boots React, hydrate-vs-render decision, 18 Routes + catch-all.
- `scripts/entry-server.tsx` — SSR entry, `renderRoute(path)`.
- `scripts/seo-routes.ts` — 18 RouteMeta + catch-all entry, consumed by prerender + sitemap.
- `api/download-skill.ts` — Only serverless function.

## Architectural Constraints

- **No SSR at request time.** Everything prerendered + client-mounted. Vercel only runs `/api/download-skill`.
- **SPA fallback is destructive.** Vercel rewrites unknown paths to `/index.html`. Hydration guard mandatory.
- **Lazy routes must stay lazy.** Eager import breaks SSR build.
- **LangProvider inside Router.** Both client + SSR contexts.
- **EN_SIBLINGS = single source of truth.** All path rewrites go through `src/i18n/paths.ts`.
- **EN_SIBLINGS ↔ seo-routes.ts parity.** Must stay in sync; sitemap floor check catches drift.
- **Hardcoded coupling.** `EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` duplicated across PayPage/AccountPage/DownloadSkillPage/api — any change updates all four.
- **Locked routes.** `/welcome`, `/pay`, `/success` (extension hardlinks); `/account`, `/dashboard/*` (extension-coupled SPA-only).
- **No `/en/` siblings for SPA-only routes.** By design (Phase 3 D-03) — preserve auth state via storage.
- **No tests, no ESLint, no `typecheck` script.** TS errors surface during `vite build`.

---

*Architecture analysis: 2026-05-18 — post-v1.0 (GEO Optimization milestone, 2026-05-14..17) + blog migration hotfix. Covers prerender pipeline, hydration, i18n routing, blog content, extension coupling, billing, and build-time gates.*
