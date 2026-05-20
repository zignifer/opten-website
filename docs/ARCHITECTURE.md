# Architecture — opten.space

> Routes, flows, and where state lives. Read this with
> [INTEGRATION-CONTRACT.md](../INTEGRATION-CONTRACT.md) — the contract is
> the source of truth for anything that crosses the site↔extension boundary.

## High-level

```
┌────────────────────────── opten.space (this repo) ──────────────────────────┐
│                                                                              │
│   index.html  ──sync──>  Paddle.js v2 CDN  (only on /pay surfaces)           │
│       │                                                                      │
│       └─> main.tsx → <BrowserRouter> → <LangProvider> → <Routes>             │
│                                                                              │
│   Routes (~22 patterns + catch-all 404; 144 prerendered HTML files):         │
│     RU (9 prerendered, 3 SPA-only):                                          │
│       /                   App.tsx              landing                       │
│       /pay                PayPage.tsx          RU YooKassa | EN Paddle       │
│       /welcome            WelcomePage.tsx      first install                 │
│       /about              AboutPage.tsx        E-E-A-T founder page          │
│       /blog               BlogListPage.tsx     blog hub (filter/search)      │
│       /blog/:slug         BlogPostPage.tsx     bilingual post page           │
│       /privacy /terms /refund                  legal                         │
│       /success            SuccessPage.tsx      SPA-only (no prerender)       │
│       /account            AccountPage.tsx      SPA-only (extension-coupled)  │
│       /dashboard/         DownloadSkillPage    SPA-only (Pro-gated)          │
│         download-skill                                                       │
│     Models (Phase v2.0): /models hub + /models/:slug (62) + /en/* mirrors    │
│     EN siblings (9 marketing + 63 models prerendered):                       │
│       /en/, /en/pay, /en/welcome, /en/about, /en/blog, /en/blog/:slug,       │
│       /en/privacy, /en/terms, /en/refund, /en/models(/:slug)                 │
│     Catch-all: <Route path="*" element={<NotFound />}> — runtime noindex     │
│                                                                              │
│   Postbuild prerender produces 144 dist/<route>/index.html files with        │
│   per-route head, JSON-LD graph, hreflang triplet, baked <html lang>.        │
│                                                                              │
│   API (Vercel serverless):                                                   │
│     GET /api/download-skill   →  validates JWT + Pro, streams opten.zip      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │                              │                          │
         │ chrome.runtime.sendMessage   │ fetch                    │ fetch
         │ (externally_connectable)     │                          │
         ▼                              ▼                          ▼
   ┌──────────────┐         ┌─────────────────────┐      ┌───────────────────┐
   │  Extension   │         │ Supabase Functions  │      │  Paddle Checkout  │
   │  (Chrome)    │         │ create-payment*     │      │  (overlay SDK)    │
   │              │         │ get-subscription    │      │                   │
   └──────────────┘         │ cancel-*  webhook*  │      └───────────────────┘
                            └─────────────────────┘
```

## Route map (`src/main.tsx`)

All routes are SPA at runtime. Vercel rewrites everything non-`/api/` to
`index.html` (see [`vercel.json`](../../vercel.json)) — but the postbuild
prerenderer (`scripts/prerender.mjs`) writes per-route HTML files so direct
hits get a populated `<head>` + body before React mounts.

| Path | Component | Prerender | Purpose | Talks to extension? | Talks to Supabase? |
|------|-----------|-----------|---------|---------------------|--------------------|
| `/` | [`App.tsx`](../../src/app/App.tsx) | full | Landing page, scroll-reveal | No | No |
| `/pay` | [`PayPage.tsx`](../../src/app/pages/PayPage.tsx) | full | Checkout — YooKassa for RU/RUB, Paddle for EN/USD | `GET_AUTH_TOKEN` to know who's paying | `create-payment` or `create-payment-paddle` |
| `/welcome` | [`WelcomePage.tsx`](../../src/app/pages/WelcomePage.tsx) | full | First-install onboarding (opened by extension on install) | No (extension navigates *to* this) | No |
| `/about` | [`AboutPage.tsx`](../../src/app/pages/AboutPage.tsx) | full | E-E-A-T founder page (Person schema + Article) | No | No |
| `/blog` | [`BlogListPage.tsx`](../../src/app/pages/BlogListPage.tsx) | full | Blog hub — CollectionPage + ItemList; search + tag filter (client) | No | No |
| `/blog/:slug` | [`BlogPostPage.tsx`](../../src/app/pages/BlogPostPage.tsx) | full (per prerendered slug) | Blog post — BlogPosting + WebPage(speakable) + HowTo + FAQPage | No | No |
| `/models` | [`ModelsHubPage.tsx`](../../src/app/pages/ModelsHubPage.tsx) | full | Models hub (Phase v2.0) — CollectionPage + ItemList; type filter + search (client) | No | No |
| `/models/:slug` | [`ModelPage.tsx`](../../src/app/pages/ModelPage.tsx) | full (per model, 62) | Model page — TechArticle + SoftwareApplication + FAQPage + BreadcrumbList | No | No |
| `/privacy` | [`PrivacyPage.tsx`](../../src/app/pages/PrivacyPage.tsx) | full | Legal | No | No |
| `/terms` | [`TermsPage.tsx`](../../src/app/pages/TermsPage.tsx) | full | Legal | No | No |
| `/refund` | [`RefundPage.tsx`](../../src/app/pages/RefundPage.tsx) | full | Legal | No | No |
| `/success` | [`SuccessPage.tsx`](../../src/app/pages/SuccessPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Post-YooKassa-redirect confirmation | No | No |
| `/account` | [`AccountPage.tsx`](../../src/app/pages/AccountPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | View plan, cancel subscription | `GET_AUTH_TOKEN`, `GET_SUBSCRIPTION`, `CANCEL_SUBSCRIPTION` | Indirectly via extension |
| `/dashboard/download-skill` | [`DownloadSkillPage.tsx`](../../src/app/pages/DownloadSkillPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Pro-only skill ZIP download | `GET_AUTH_TOKEN` (Bearer for `/api/download-skill`) | `/api/download-skill` (this site's own serverless) |
| `*` (catch-all) | [`NotFound.tsx`](../../src/app/pages/NotFound.tsx) | n/a — runtime `<meta robots=noindex>` injection | Locale-aware 404 fallback for typo'd URLs | No | No |

**EN siblings** (identical components — language flips via `LangProvider`): the 9 marketing routes above plus `/en/models` and every `/en/models/<slug>` (Phase v2.0).
Source of truth: [`EN_SIBLINGS`](../../src/i18n/paths.ts) in `src/i18n/paths.ts` — 9 static entries + the model slugs from `src/content/models/slugs.ts`; must mirror the EN entries in [`scripts/seo-routes.ts`](../../scripts/seo-routes.ts).

**Legacy redirects** (Vercel `redirects[]`, permanent 301):
`/guides`, `/en/guides`, `/guides/gpt-image-2`, `/en/guides/gpt-image-2` → `/blog`, `/en/blog`, `/blog/gpt-image-2`, `/en/blog/gpt-image-2` (Phase 5 B-07 — the `/guides/*` URL space was retired in favor of `/blog/*`).

## Page structure

```
src/
├── main.tsx                       — entry, routes, hydrate-vs-mount discriminator
├── app/
│   ├── App.tsx                    — landing
│   ├── components/                — shared UI
│   │   ├── SiteHeader.tsx         — unified hamburger header (variant: "landing" | "page")
│   │   ├── SiteFooter.tsx         — shared CTA + nav footer
│   │   ├── LocalizedLink.tsx      — drop-in <Link> that preserves /en/* prefix
│   │   ├── LangSwitcher.tsx       — language toggle
│   │   ├── FaqBlock.tsx           — semantic <dl><dt><dd>; visible source for FAQPage schema
│   │   ├── BlogPostCard.tsx       — blog grid card
│   │   ├── Picture.tsx            — WebP/JPEG <picture> w/ srcset + explicit dims
│   │   ├── InstallButton.tsx, RouteLoading.tsx, OptenHeroAnimation.tsx
│   │   ├── layout/LegalLayout.tsx — legal-page wrapper
│   │   ├── figma/                 — Figma fallback adapters
│   │   └── ui/                    — Radix-derived primitives
│   ├── components/ (cont.)        — ModelQuickFacts, RelatedModels, ModelInstallCta,
│   │                                InlineOptenCallout (model-page building blocks)
│   └── pages/                     — one file per route
│       ├── PayPage.tsx, AccountPage.tsx, DownloadSkillPage.tsx
│       ├── WelcomePage.tsx, SuccessPage.tsx, AboutPage.tsx
│       ├── BlogListPage.tsx, BlogPostPage.tsx
│       ├── ModelsHubPage.tsx, ModelPage.tsx      — Phase v2.0 model surfaces
│       ├── PrivacyPage.tsx, TermsPage.tsx, RefundPage.tsx
│       └── NotFound.tsx           — catch-all, locale-aware, injects runtime noindex
├── content/                       — humans edit here; consumed by pages + SEO manifest
│   ├── about.tsx                  — AboutPage body data structure
│   ├── landingFaq.ts              — landing FAQ source (mirrored 1:1 into FAQPage schema)
│   ├── blog/
│   │   ├── types.ts               — BlogPost, BlogPostLocale, BlogStep, BlogFaqItem
│   │   ├── index.ts               — blogPostsBySlug barrel (sorted newest-first)
│   │   └── <slug>.ts              — one file per post (RU + EN locales)
│   └── models/                    — Phase v2.0 programmatic SEO
│       ├── types.ts               — ModelMeta, ModelLocale, ModelContent
│       ├── _registry.ts           — AUTO-GEN by build-models-registry.mjs (62 ModelMeta)
│       ├── _skills/<slug>.md       — RU source skills (synced from promptscore-proxy)
│       ├── metaEn.ts              — EN overrides for free-text meta + metaField() helper
│       ├── index.ts               — allModels barrel + HUB_HIDDEN_SLUGS
│       ├── slugs.ts               — MODEL_SLUGS_WITH_CONTENT (light import for paths.ts)
│       └── <slug>.ts              — one file per model (ModelContent = { ru, en })
├── i18n/
│   ├── LangContext.tsx            — React context, useT, useLang; URL-prefix-aware
│   ├── paths.ts                   — EN_SIBLINGS allow-list; toEnTarget/toRuTarget/localizeHref
│   ├── ru.json                    — ~68KB dict (RU canonical)
│   └── en.json                    — ~41KB dict (lazy-loaded)
├── imports/                       — Figma-Make-generated SVG paths (auto-generated; brittle)
├── lib/
│   └── paddle.ts                  — ensurePaddle() lazy loader (Phase 2.2)
├── styles/                        — index.css, tailwind.css, theme.css, fonts.css
└── types/                         — TS type defs (e.g. for window.Paddle)
```

**Authoring content:** read [CONTENT-AUTHORING.md](CONTENT-AUTHORING.md) first.
It documents the 6-file-sync rule (routes, manifest, EN siblings, sitemap, llms.txt,
dicts) and the GEO/SEO patterns locked-in during v1.0.

## i18n flow (post-Phase-3)

1. [`LangContext`](../../src/i18n/LangContext.tsx) initializes language with this precedence (D-05 / D-07):
   1. **URL prefix** — `/en/` or `/en/*` → "en" (synchronous via `useLocation()`).
   2. **`localStorage.opten_lang_v3`** — explicit user choice (written only by LangSwitcher).
   3. **Legacy `localStorage.opten_lang`** — read only when value is `"en"` (one-shot migration; RU values intentionally ignored, see post-release fix `c789dee`).
   4. **`navigator.language`** — `startsWith('ru') ? 'ru' : 'en'` fallback.
2. `setLang(l)` writes `opten_lang_v3` synchronously and re-renders. EN dict is lazy-loaded (Phase 2.2) — `loadEnDict()` runs before flipping state to avoid a flash of RU keys.
3. `t(key)` looks up the dict for current lang, then falls back to `ru`, then to the key string itself.
4. `document.documentElement.lang` is **NOT** mutated at runtime (Phase 3 D-06 — runtime DOM mutation caused hydration mismatch). It is baked per page at prerender time.

**Bilingual URLs (post-v2.0 state):**
- **144 prerendered HTML files**: 18 baseline (9 RU marketing + 9 EN siblings) + 2 model hubs + 124 model pages (62 RU + 62 EN).
- Each prerendered `<head>` carries a `<link rel="alternate" hreflang>` triplet (`ru`, `en`, `x-default → unprefixed RU`) reciprocal between siblings.
- `<html lang>` baked per route at build time by `scripts/prerender.mjs` (`ru` for unprefixed, `en` for `/en/*`).
- **Hreflang locale code policy:** hreflang annotations use language-only codes (`ru`, `en`, `x-default`) in both `scripts/prerender.mjs#applyHreflang` and `scripts/sitemap.mjs` xhtml:link entries, while schema-level `inLanguage` stays region-specific (`ru-RU`, `en-US`) in `scripts/seo-routes.ts`. Both are valid per Google's documentation; the mix is intentional — language-only hreflang targets the broadest audience (RU readers globally, not just RU-from-Russia), while schema-level region tags give AI systems a precise origin signal for the content. Do not "unify" these — the asymmetry is the policy.
- Locked routes without EN siblings (`/success`, `/account`, `/dashboard/download-skill`) stay RU-only by design — they are `Disallow`'d in `robots.txt`, carry `X-Robots-Tag: noindex,nofollow` headers via `vercel.json`, and are extension-coupled (D-03).
- `<LocalizedLink>` (drop-in replacement for `<Link>`) preserves the `/en/` prefix when navigating internally between EN siblings; on locked no-sibling routes the LangSwitcher flips language in place via storage.

See [SEO-AUDIT.md](SEO-AUDIT.md) for the audit baseline and the v1.0 archive in `.planning/milestones/v1.0-ROADMAP.md` for the trajectory (GEO score 12 → ~72.6, target ~80+ after Phase 4.2 deploy bakes in).

## Header / Footer

Every content surface uses two shared shells:

- **[`<SiteHeader>`](../../src/app/components/SiteHeader.tsx)** — unified hamburger nav on every viewport. `variant="landing"` (anchors render as `#features` for in-page scroll) is reserved for `App.tsx`; `variant="page"` (anchors render as `/#features` for full-page nav back to landing) is the default for everything else. A `rightSlot` prop swaps the Account button for page-specific affordances (e.g. signed-in email pill on `/account`).
- **[`<SiteFooter>`](../../src/app/components/SiteFooter.tsx)** — shared CTA + nav (`/about`, `/blog`, `/privacy`, `/terms`, `/refund`, Telegram). The CTA gradient and `<InstallButton>` are consistent across landing, blog, and content pages.

New content pages MUST wrap with `<SiteHeader variant="page">` + `<SiteFooter>`. There is no legacy `<Navbar>` to fork — it was retired in Phase 5 B-03.

## Blog content pipeline

Blog content is **hand-curated, file-based** — no CMS. Adding a post is a code change with build-time gates.

```
src/content/blog/<slug>.ts                       ← author here (BlogPost = { ru, en })
  ↓
src/content/blog/index.ts                        ← register in blogPostsBySlug barrel
  ↓                                              ↓
BlogListPage (UI: filter/search/cards)           scripts/seo-routes.ts
                                                  ↑ adds blogPostingBlock + howToBlock +
                                                    faqPageBlock + webPageBlock + breadcrumbs
                                                    for both /blog/<slug> and /en/blog/<slug>
                                                  ↓
                                                 prerender.mjs writes dist/blog/<slug>/index.html
                                                 sitemap.mjs adds <url> entries
                                                 llms.mjs adds to llms.txt + llms-full.txt
                                                 verify-faq-mainentity.mjs enforces FAQ parity
```

Cover image lives at `public/blog/<slug>/cover.jpg` (≥1600×900, no in-image text — one asset works for RU + EN + OG + visible `<img>`). See [CONTENT-AUTHORING.md](CONTENT-AUTHORING.md) for the full rule set.

## Models content pipeline (Phase v2.0)

Model pages are **generated**, not hand-curated. The chain:

```
C:/Projects/promptscore-proxy/skills/*.md        ← RU source of truth (extension's skill files)
  ↓  scripts/sync-skills.mjs (manual)
src/content/models/_skills/<slug>.md
  ↓  scripts/build-models-registry.mjs (manual)
src/content/models/_registry.ts                  ← AUTO-GEN, 62 ModelMeta (do not hand-edit alone)
  ↓                                               ↓
src/content/models/<slug>.ts                     src/content/models/metaEn.ts
  (ModelContent = { ru, en }, written/generated)   (hand EN overrides for name/platform/
  ↓                                                  duration/resolution + metaField helper)
src/content/models/index.ts (allModels barrel + HUB_HIDDEN_SLUGS) + slugs.ts (→ EN_SIBLINGS)
  ↓                                              ↓
ModelsHubPage / ModelPage (UI)                   scripts/seo-routes.ts
                                                  ↑ buildModelRoute + buildModelsHubRoute add
                                                    TechArticle + SoftwareApplication + FAQPage +
                                                    BreadcrumbList (+ CollectionPage/ItemList on hub)
                                                  ↓
                                                 prerender.mjs writes dist/(en/)models/<slug>/index.html
                                                 sitemap.mjs + llms.mjs (floor 144)
```

Key points:
- **`_registry.ts` is AUTO-GEN** from RU skills, so the free-text meta fields (`name`, `platform`, `duration`, `resolution`) are Russian. English comes from `metaEn.ts` overrides resolved by `metaField(meta, field, lang)` — there is no build gate for this, so run `node scripts/verify-models-content.mjs` to catch Cyrillic leaking onto `/en/*`.
- **`HUB_HIDDEN_SLUGS`** (in `index.ts`) hides 11 general/umbrella models (flux, gpt-image, imagen, kling, luma-ray, midjourney, nano-banana, seedance, seedream, sora, veo) from the hub grid + ItemList schema, but their pages stay live + in the sitemap (generic-query SEO, not orphaned — still linked from related-models).
- **Hub + blog use a `hydrated` gate**: the prerendered hub/blog list the full unfiltered set; URL-derived filters (`?type`/`?tag`/`?q`/`?page`) only apply after mount so the first client render matches SSR (avoids React hydration mismatch on direct-loads of filtered URLs).

## Billing flow — RU (YooKassa)

```
User on /pay (lang=ru, currency=RUB)
  └─> Detect extension via sendMessage(EXTENSION_IDS[0..1], GET_AUTH_TOKEN)
        └─> response.token   → user is signed in
  └─> User clicks "Оформить подписку"
        └─> POST  https://<supabase>.co/functions/v1/create-payment
              Authorization: Bearer <token>
              Body: { recurring: true }
        └─> Response: { confirmation_url }
        └─> window.location.href = confirmation_url   (YooKassa-hosted page)
              ↓
            User pays on YooKassa
              ↓
            YooKassa redirects to https://opten.space/success
              ↓
            (Meanwhile, YooKassa webhook → Supabase /webhook → subscriptions row, ps_sub_provider='yookassa')
```

## Billing flow — EN (Paddle)

```
User on /pay (lang=en, currency=USD)
  └─> Same extension detection.
  └─> User clicks "Subscribe"
        └─> POST  /functions/v1/create-payment-paddle
              Authorization: Bearer <token>
        └─> Response: { priceId, customerEmail, userId }
        └─> window.Paddle.Checkout.open({
              items: [{ priceId }],
              customer: { email: customerEmail },
              custom: { userId },
            })
              ↓
            Paddle overlay handles the checkout entirely
              ↓
            On success: Paddle webhook → Supabase /webhook-paddle (HMAC-SHA256)
              ↓
            subscriptions row written with provider='paddle'
```

**Why no `/success` redirect for Paddle:** Paddle's overlay SDK closes itself
and surfaces the success state inline; no full-page redirect needed.

## Account / cancellation flow

```
User on /account
  └─> sendMessage(extId, GET_AUTH_TOKEN) → check logged in
  └─> sendMessage(extId, GET_SUBSCRIPTION) → render plan + card info
  └─> User clicks "Cancel"
        └─> sendMessage(extId, CANCEL_SUBSCRIPTION)
              └─> Extension reads ps_sub_provider
                    └─> 'yookassa' → /functions/v1/cancel-subscription
                    └─> 'paddle'   → /functions/v1/cancel-subscription-paddle
              └─> Response: { success, expires_at }   (status flips to 'cancelled', plan stays 'pro' until expires_at)
```

## Skill ZIP download flow (`/dashboard/download-skill`)

```
User opens /dashboard/download-skill (linked from extension popup)
  └─> Page tries EXTENSION_IDS sequentially, calls GET_AUTH_TOKEN
        └─> If none respond: state = 'no_extension', render install CTA
        └─> If token returned but plan != pro: render upgrade CTA
        └─> If token + Pro: enable download button
  └─> Download button → GET /api/download-skill
        Authorization: Bearer <token from extension>
        └─> api/download-skill.ts:
              1. Validate JWT against Supabase auth/v1/user
              2. Query subscriptions WHERE plan=pro AND status IN (active, cancelled)
              3. If Pro: stream api/_assets/opten.zip with Content-Type: application/zip
              4. If not Pro: 403 { error: 'not_pro', upgrade_url: '/account?upgrade=skill' }
```

The auth check is defense-in-depth — the extension popup also gates the link.

## State summary

| State | Lives in | Who writes | Who reads |
|-------|----------|------------|-----------|
| Current language | `localStorage.opten_lang_v3` (legacy `opten_lang` read for one-shot EN migration) | LangSwitcher (only writer) | LangContext (`<html lang>` is baked at prerender, NOT mutated) |
| Payment currency | `localStorage.opten_pay_currency` | PayPage | PayPage |
| Auth token | Extension's `chrome.storage.local.ps_auth_token` | Extension OAuth | Extension (mirrored to site via `GET_AUTH_TOKEN`) |
| Subscription | Supabase `subscriptions` table | Webhooks (YooKassa, Paddle) | Edge Functions, extension, site (via extension) |
| Plan / quota | Extension `chrome.storage.local.ps_*` | Extension (synced from Supabase) | Site via `GET_SUBSCRIPTION` |

**The site has no persistent server-side state of its own.** All persistence
is either in the user's browser (localStorage, extension storage) or in
Supabase (owned by the extension repo).

## Build/asset notes

- [`api/_assets/opten.zip`](../../api/_assets/) — the Pro skill bundle. Bundled with the serverless function via `vercel.json` `includeFiles`. Update via `chore: refresh opten.zip` commits (see `12b3f17`).
- [`public/favicon-*.png`](../../public/) — 14 favicon sizes. Excessive — modern browsers need only a handful. Cleanup candidate.
- [`public/assets/welcome-{ru,en}-*.png`](../../public/assets/) — onboarding screenshots, one set per language.
- [`src/imports/`](../../src/imports/) — Figma-Make-generated SVG path dumps. Auto-generated; manual edits there get clobbered if the page is re-imported from Figma.
