# Architecture — opten.space

> Routes, flows, and where state lives. Read this with
> [INTEGRATION-CONTRACT.md](INTEGRATION-CONTRACT.md) — the contract is
> the source of truth for anything that crosses the site↔extension boundary.

## High-level

```
┌────────────────────────── opten.space (this repo) ──────────────────────────┐
│                                                                              │
│   index.html  ──sync──>  Paddle.js v2 CDN  (only on /pay surfaces)           │
│       │                                                                      │
│       └─> main.tsx → <BrowserRouter> → <LangProvider> → <Routes>             │
│                                                                              │
│   Routes (~39 patterns + catch-all 404; 204 prerendered SEO routes):         │
│     RU (9 marketing prerendered, plus SEO content; SPA-only app/account):    │
│       /                   App.tsx              landing                       │
│       /login              AppLoginPage.tsx     website auth (SPA-only)       │
│       /auth/callback      AppAuthCallback      website auth callback         │
│       /pay                PayPage.tsx          website-first checkout        │
│       /welcome            WelcomePage.tsx      first install                 │
│       /about              AboutPage.tsx        E-E-A-T founder page          │
│       /blog               BlogListPage.tsx     blog hub (filter/search)      │
│       /blog/:slug         BlogPostPage.tsx     bilingual post page           │
│       /privacy /terms /refund                  legal                         │
│       /success            SuccessPage.tsx      SPA-only (no prerender)       │
│       /account            AccountPage.tsx      SPA-only account/subscription │
│       /dashboard/         DownloadSkillPage    SPA-only (Pro-gated)          │
│         download-skill                                                       │
│       /prompt-library     PromptLibraryPage    SPA-only private library      │
│       /p/:slug            PublicPromptLibrary  SPA-only public snapshot      │
│       /admin              AdminDashboardPage   SPA-only owner admin          │
│       /learn              LearnOverviewPage    public RU video hub           │
│       /learn/:lessonSlug  LessonDetailPage     public RU lesson              │
│       /learn/finds/:slug  LearnFindDetailPage  public RU curated find        │
│       /learn/courses/*    PrivateCoursePage    launched paid course, SPA     │
│       /app/*              Opten Space Beta     SPA-only / redirects          │
│     Models (Phase v2.0): /models hub + /models/:slug (62) + /en/* mirrors    │
│     EN siblings (marketing/blog/models/Learn/Learn Finds):                   │
│       /en/, /en/pay, /en/welcome, /en/about, /en/blog, /en/blog/:slug,       │
│       /en/privacy, /en/terms, /en/refund, /en/models(/:slug),                │
│       /en/learn(/:lessonSlug), /en/learn/finds/:slug                         │
│     Catch-all: <Route path="*" element={<NotFound />}> — runtime noindex     │
│                                                                              │
│   Postbuild prerender produces 202 dist/<route>/index.html files with        │
│   per-route head, JSON-LD graph, hreflang triplet, baked <html lang>.        │
│                                                                              │
│   API (Vercel serverless):                                                   │
│     GET /api/download-skill   →  validates JWT + Pro, streams opten.zip      │
│     POST /api/prompt-workbench → authenticated popup-parity quick Improve    │
│     POST /api/course-prompt   →  course access gate + prompt body            │
│     POST /api/kinescope-course-token → course access gate + drmauthtoken     │
│     POST /api/kinescope-course-auth  → Kinescope playback callback           │
│     GET  /api/admin/telegram-stats   → owner-gated Telegram stats proxy      │
│     POST /api/admin/telegram-broadcast → owner-gated broadcast proxy         │
│     GET/POST /api/admin/telegram-broadcasts → history/delete proxy           │
│     POST /api/admin/telegram-upload-photo → owner-gated image upload proxy   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │                              │                          │
         │ chrome.runtime.sendMessage   │ fetch                    │ fetch
         │ (externally_connectable)     │                          │
         ▼                              ▼                          ▼
   ┌──────────────┐         ┌─────────────────────┐      ┌───────────────────┐
   │  Extension   │         │ Supabase Functions  │      │  Paddle Checkout  │
   │  (Chrome)    │         │ create-payment*     │      │  (overlay SDK)    │
   │              │         │ account-summary     │      └───────────────────┘
   └──────────────┘         │ course-access       │                 │
                            │ webhooks / cancel   │                 ▼
                            └─────────────────────┘       ┌──────────────────┐
                                                           │ Kinescope Player │
                                                           │ DRM auth callback│
                                                           └──────────────────┘
```

## Route map (`src/main.tsx`)

All routes are SPA at runtime. Vercel rewrites everything non-`/api/` to
`index.html` (see [`vercel.json`](../../vercel.json)) — but the postbuild
prerenderer (`scripts/prerender.mjs`) writes per-route HTML files so direct
hits get a populated `<head>` + body before React mounts.

| Path | Component | Prerender | Purpose | Talks to extension? | Talks to Supabase? |
|------|-----------|-----------|---------|---------------------|--------------------|
| `/` | [`App.tsx`](../../src/app/App.tsx) | full | Landing page, scroll-reveal | No | No |
| `/login` | `AppLoginPage.tsx` | none (SPA-only, `X-Robots-Tag: noindex`) | Canonical website login for billing, account, and app surfaces. | No | Supabase Auth public endpoints |
| `/auth/callback` | `AppAuthCallbackPage.tsx` | none (SPA-only, `X-Robots-Tag: noindex`) | Receives Supabase Auth hash tokens, stores website session, returns to safe `next`. | No | No |
| `/pay` | [`PayPage.tsx`](../../src/app/pages/PayPage.tsx) | full | Website-first checkout — YooKassa for RUB, Paddle for USD via the global header currency switcher | Fallback `GET_AUTH_TOKEN` only when no website session exists | `account-summary`, `create-payment` or `create-payment-paddle` |
| `/welcome` | [`WelcomePage.tsx`](../../src/app/pages/WelcomePage.tsx) | full | First-install onboarding (opened by extension on install) | No (extension navigates *to* this) | No |
| `/about` | [`AboutPage.tsx`](../../src/app/pages/AboutPage.tsx) | full | E-E-A-T founder page (Person schema + Article) | No | No |
| `/blog` | [`BlogListPage.tsx`](../../src/app/pages/BlogListPage.tsx) | full | Blog hub — CollectionPage + ItemList; search + tag filter (client) | No | No |
| `/blog/:slug` | [`BlogPostPage.tsx`](../../src/app/pages/BlogPostPage.tsx) | full (per prerendered slug) | Blog post — BlogPosting + WebPage(speakable) + HowTo + FAQPage | No | No |
| `/models` | [`ModelsHubPage.tsx`](../../src/app/pages/ModelsHubPage.tsx) | full | Models hub (Phase v2.0) — CollectionPage + ItemList; type filter + search (client) | No | No |
| `/models/:slug` | [`ModelPage.tsx`](../../src/app/pages/ModelPage.tsx) | full (per model, 62) | Model page — TechArticle + SoftwareApplication + FAQPage + BreadcrumbList | No | No |
| `/learn` | [`LearnOverviewPage.tsx`](../../src/app/pages/space/LearnOverviewPage.tsx) | full | Public Learn hub for Opten lessons and curated Learn Finds. | No | No |
| `/learn/:lessonSlug` | [`LessonDetailPage.tsx`](../../src/app/pages/space/LessonDetailPage.tsx) | full (per public lesson) | Public Opten video lesson with timestamps, lesson materials, and prompts. | No | No |
| `/learn/finds/:findSlug` | [`LearnFindDetailPage.tsx`](../../src/app/pages/space/LearnFindDetailPage.tsx) | full (per find) | Curated third-party YouTube expert video enriched with Opten summary, timestamps, commands, prompts, resources, and risks. | No | No |
| `/learn/templates/:templateKind(/:templateLessonSlug)` | [`LearnTemplatePage.tsx`](../../src/app/pages/space/LearnTemplatePage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Design/dev template routes for future course states; never indexed. | No | No |
| `/learn/courses/:courseSlug(/:lessonSlug)` | [`PrivateCoursePage.tsx`](../../src/app/pages/space/PrivateCoursePage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Officially launched standalone paid Kinescope course, publicly promoted from Learn, blog CTAs, Telegram, and other marketing surfaces. | No | `create-course-payment`, `course-access-summary`, `/api/kinescope-course-token`, `/api/course-prompt` |
| `/privacy` | [`PrivacyPage.tsx`](../../src/app/pages/PrivacyPage.tsx) | full | Legal | No | No |
| `/terms` | [`TermsPage.tsx`](../../src/app/pages/TermsPage.tsx) | full | Legal | No | No |
| `/refund` | [`RefundPage.tsx`](../../src/app/pages/RefundPage.tsx) | full | Legal | No | No |
| `/success` | [`SuccessPage.tsx`](../../src/app/pages/SuccessPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Post-YooKassa-redirect confirmation | No | No |
| `/account` | [`AccountPage.tsx`](../../src/app/pages/AccountPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | View credits/plan, cancel subscription, sign out of website account | Fallback `GET_AUTH_TOKEN` / `CANCEL_SUBSCRIPTION` only when no website session exists | `account-summary`, `cancel-subscription`, `cancel-subscription-paddle` |
| `/dashboard/download-skill` | [`DownloadSkillPage.tsx`](../../src/app/pages/DownloadSkillPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Pro-only skill ZIP download | `GET_AUTH_TOKEN` (Bearer for `/api/download-skill`) | `/api/download-skill` (this site's own serverless) |
| `/prompt-library` | [`PromptLibraryPage.tsx`](../../src/app/pages/PromptLibraryPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Private Prompt Library CRUD/search; owner publish/refresh/unpublish controls for public snapshots. | `GET_AUTH_TOKEN` + `REFRESH_PROMPT_LIBRARY_CACHE` | `prompt_library`, `prompt_library_mark_used`, public snapshot RPCs |
| `/p/:slug` | [`PublicPromptLibraryPage.tsx`](../../src/app/pages/PublicPromptLibraryPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Read-only random-link Prompt Library snapshot; viewers save individual prompts into their own library. | No | `prompt_library_get_public_snapshot`; save uses website JWT + `prompt_library_save_public_prompt` |
| `/admin` | [`AdminDashboardPage.tsx`](../../src/app/pages/admin/AdminDashboardPage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | Owner admin shell. Shows Telegram course-preview funnel stats, guarded broadcast controls, image upload, and stored broadcast deletion. | No | Website JWT to `/api/admin/telegram-stats`, `/api/admin/telegram-broadcast`, `/api/admin/telegram-broadcasts`, and `/api/admin/telegram-upload-photo`; serverless proxies call extension-owned Edge Functions with `TELEGRAM_ADMIN_SECRET` |
| `/internal/prompt-library-demo` | `PromptLibraryDemoPage.tsx` | none (SPA-only, `X-Robots-Tag: noindex`) | Internal demo surface. | No | No |
| `/app` | `AppIndexPage.tsx` | none (SPA-only, `X-Robots-Tag: noindex`) | Opten Space Beta entry; redirects to the current canonical app surface. | No | No |
| `/app/login` | `Navigate` | none (SPA-only, `X-Robots-Tag: noindex`) | Compatibility redirect to `/login?next=/learn`. | No | No |
| `/app/auth/callback` | `AppAuthCallbackPage.tsx` | none (SPA-only, `X-Robots-Tag: noindex`) | Compatibility auth callback; canonical callback is `/auth/callback`. | No | No |
| `/app/learn`, `/app/learn-v2` | `Navigate` | none (SPA-only, `X-Robots-Tag: noindex`) | Legacy compatibility redirects to public `/learn`. | No | No |
| `/app/learn/:lessonSlug`, `/space/learn/:lessonSlug` | `LegacyLearnLessonRedirect` | none (SPA-only, `X-Robots-Tag: noindex`) | Legacy lesson redirects to `/learn/:lessonSlug`. | No | No |
| `/space/learn` | `Navigate` | none (SPA-only, `X-Robots-Tag: noindex`) | Legacy compatibility redirect to `/learn`. | No | No |
| `/en/learn/templates/:templateKind(/:templateLessonSlug)` | [`LearnTemplatePage.tsx`](../../src/app/pages/space/LearnTemplatePage.tsx) | none (SPA-only, `X-Robots-Tag: noindex`) | English template-only future course states; no sitemap/hreflang. | No | No |
| `*` (catch-all) | [`NotFound.tsx`](../../src/app/pages/NotFound.tsx) | n/a — runtime `<meta robots=noindex>` injection | Locale-aware 404 fallback for typo'd URLs | No | No |

**EN siblings** (identical components — language flips via `LangProvider`): the 9 marketing routes above, `/en/models` + every `/en/models/<slug>`, `/en/learn` + public lessons, and `/en/learn/finds/:findSlug`.
Source of truth: [`EN_SIBLINGS`](../../src/i18n/paths.ts) in `src/i18n/paths.ts` — static routes plus model slugs from `src/content/models/slugs.ts`, public Learn lesson slugs from `src/content/space/learnSlugs.ts`, and Learn Find slugs from `src/content/space/learnFinds.ts`; must mirror the EN entries in [`scripts/seo-routes.ts`](../../scripts/seo-routes.ts).

**Opten Space `/app/*` language policy:** app routes are authenticated/noindex
and deliberately do not get `/en/app/*` siblings, sitemap entries, JSON-LD, or
hreflang annotations. The app language switch writes `opten_lang_v3` and flips
the React content in-place. Public Learn content now lives at `/learn` +
`/en/learn`; `/app/learn*` and `/space/learn*` remain redirects only.

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
│   ├── components/space/          — Space shell + Learn lesson/player components
│   └── pages/                     — one file per route
│       ├── PayPage.tsx, AccountPage.tsx, DownloadSkillPage.tsx
│       ├── WelcomePage.tsx, SuccessPage.tsx, AboutPage.tsx
│       ├── BlogListPage.tsx, BlogPostPage.tsx
│       ├── ModelsHubPage.tsx, ModelPage.tsx      — Phase v2.0 model surfaces
│       ├── space/LearnOverviewPage.tsx, LessonDetailPage.tsx,
│       │   LearnFindDetailPage.tsx, LearnTemplatePage.tsx,
│       │   PrivateCoursePage.tsx                 — public Learn + paid course
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
│   └── space/                     — Learn content and paid course data
│       ├── learn.ts               — public lessons, template collections, overview sections
│       ├── learnSlugs.ts          — lightweight public lesson slugs for routes/i18n
│       ├── learnFinds.generated.json — generated curated third-party video data
│       ├── learnFinds.ts          — typed helpers/routes for Learn Finds
│       ├── privateCourse.ts       — hidden 16-lesson Kinescope course content
│       └── privateCourseExtras.ts — lesson materials, prompts, downloadable skill link
├── i18n/
│   ├── LangContext.tsx            — React context, useT, useLang; URL-prefix-aware
│   ├── paths.ts                   — EN_SIBLINGS allow-list; toEnTarget/toRuTarget/localizeHref
│   ├── ru.json                    — ~68KB dict (RU canonical)
│   └── en.json                    — ~41KB dict (eager on client since 2026-05-21)
├── imports/                       — Figma-Make-generated SVG paths (auto-generated; brittle)
├── lib/
│   └── paddle.ts                  — ensurePaddle() lazy loader (Phase 2.2)
│   └── optenAuth.ts               — `/app/*` Supabase Auth REST helpers + account-summary fetch
│   └── promptLibraryApi.ts         — Prompt Library PostgREST/RPC helpers
├── styles/                        — index.css, tailwind.css, theme.css, fonts.css
└── types/                         — TS type defs (e.g. for window.Paddle)

api/
├── download-skill.ts              — Pro-gated opten.zip stream
├── prompt-workbench.ts            — authenticated landing quick Improve;
│                                     website JWT → proxy Haiku + shared ledger
├── course-prompt.ts               — course-entitlement-gated prompt body fetch
├── kinescope-course-token.ts      — course-entitlement-gated Kinescope embed URL
├── kinescope-course-auth.ts       — Kinescope server-to-server playback callback
└── _shared/
    ├── optenServerAuth.ts         — server-only Supabase JWT/course access helpers
    ├── kinescopeCourse.ts         — Kinescope video whitelist + embed URL builder
    └── coursePromptBodies.ts      — private course prompt body whitelist
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
2. `setLang(l)` writes `opten_lang_v3` synchronously and re-renders. Both dicts are now eagerly available on the client (2026-05-21 fix `3f4cc80`): `dicts.en` is initialized at module load, so on `/en/*` the first client render emits EN and matches the prerendered EN HTML — without this, `t()` fell back to RU and triggered a React #418 hydration mismatch (the cause of unresponsive buttons for a beat on iOS Safari). `loadEnDict()` survives as a no-op fast-return for the SPA language-switch path.
3. `t(key)` looks up the dict for current lang, then falls back to `ru`, then to the key string itself.
4. `document.documentElement.lang` is **NOT** mutated at runtime (Phase 3 D-06 — runtime DOM mutation caused hydration mismatch). It is baked per page at prerender time.

**Bilingual URLs (current state):**
- **204 prerendered SEO HTML files**: 126 model routes (2 hubs + 124 model pages), 40 blog routes, 24 public Learn routes (2 hubs + 12 lessons + 10 Learn Finds), and 14 marketing/legal/pricing/welcome routes.
- Each prerendered `<head>` carries a `<link rel="alternate" hreflang>` triplet (`ru`, `en`, `x-default → unprefixed RU`) reciprocal between siblings.
- `<html lang>` baked per route at build time by `scripts/prerender.mjs` (`ru` for unprefixed, `en` for `/en/*`).
- **Hreflang locale code policy:** hreflang annotations use language-only codes (`ru`, `en`, `x-default`) in both `scripts/prerender.mjs#applyHreflang` and `scripts/sitemap.mjs` xhtml:link entries, while schema-level `inLanguage` stays region-specific (`ru-RU`, `en-US`) in `scripts/seo-routes.ts`. Both are valid per Google's documentation; the mix is intentional — language-only hreflang targets the broadest audience (RU readers globally, not just RU-from-Russia), while schema-level region tags give AI systems a precise origin signal for the content. Do not "unify" these — the asymmetry is the policy.
- Locked/auth/noindex routes without EN siblings (`/success`, `/login`, `/auth/*`, `/account`, `/dashboard/download-skill`, `/prompt-library`, `/p/*`, `/learn/courses/*`, `/app/*`) stay RU-only by design — they are `Disallow`'d/noindex app, account, paid-course, or random-link snapshot surfaces, not content/SEO pages (D-03). The paid course is nevertheless launched and publicly promoted; `noindex` is a routing policy, not a launch-status marker.
- `<LocalizedLink>` (drop-in replacement for `<Link>`) preserves the `/en/` prefix when navigating internally between EN siblings; on locked no-sibling routes the LangSwitcher flips language in place via storage.

Use [seo/SEO-GROWTH-PLAN.md](seo/SEO-GROWTH-PLAN.md) for current SEO/GEO priorities. The historical pre-v1.0 baseline is archived at [seo/research/2026-05-14-seo-baseline.md](seo/research/2026-05-14-seo-baseline.md); the historical GEO trajectory was 12 → ~72.6.

## Header / Footer

Every content surface uses two shared shells:

- **[`<SiteHeader>`](../../src/app/components/SiteHeader.tsx)** — compact website account header. It intentionally omits marketing navigation because those links live in the footer; the header focuses on logo, language, credits, and profile/login. It reads `SpaceAuthProvider`, links signed-in users to `/account`, and links signed-out users to `/login?next=<current path>`.
- **[`<SpaceHeader>`](../../src/app/components/space/SpaceHeader.tsx)** — Opten Space Beta app shell header for `/app/*`. It reads account/credit state from `SpaceAuthProvider`, must not depend on the extension being installed, and temporarily hides Learn/Courses from visible nav until the product is ready. Signed-in profile navigates to `/account`; sign-out lives only in `/account`.
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

## Learn content pipeline

Public Learn has two indexable content types plus a launched paid-course surface:

```
src/content/space/learn.ts                    ← public Opten lessons + template fixtures
src/content/space/learnSlugs.ts               ← lightweight public lesson slugs
src/content/space/learnFinds.generated.json   ← generated curated third-party videos
src/content/space/learnFinds.ts               ← typed helpers/routes for Learn Finds
  ↓                                           ↓
LearnOverviewPage / LessonDetailPage          scripts/seo-routes.ts
LearnFindDetailPage                             ↑ lesson/find metadata + schema +
                                                breadcrumbs for RU + EN siblings
                                                ↓
                                               prerender.mjs writes /learn*, /en/learn*
                                               sitemap.mjs + llms.mjs include public Learn
                                               verify-space-learn.mjs guards static rules
```

Paid Kinescope lesson data stays out of the public SEO catalog even though the
course itself is publicly promoted:

```
src/content/space/privateCourse.ts             ← 16-lesson course content
src/content/space/privateCourseExtras.ts       ← materials, prompt cards, ZIP link
api/_shared/kinescopeCourse.ts                 ← server whitelist for course/video IDs
api/_shared/coursePromptBodies.ts              ← server whitelist for full prompt text
public/assets/space/courses/ai-content-marketing-2026/opten-skill.zip
  ↓
PrivateCoursePage + LessonDetailLayout
  ↓
POST /functions/v1/create-course-payment       ← guest checkout, standalone course
POST /functions/v1/course-access-summary       ← entitlement claim/read
POST /api/kinescope-course-token               ← short-lived Kinescope embed URL
POST /api/course-prompt                        ← locked prompt body fetch
POST /api/kinescope-course-auth                ← Kinescope playback authorization
```

`/learn/courses/*` and `/learn/templates/*` are SPA-only/noindex rewrites in
`vercel.json`. Course links and previews may appear in public Learn and marketing
content intentionally; the routes remain out of sitemap, llms.txt, and
`EN_SIBLINGS` under the current routing policy. Run `npm run verify:space-learn`
after public Learn changes and `npm run verify:kinescope-course` after any paid course/Kinescope
ID/materials/prompt change.

Telegram course preview is a separate free lead magnet for the same course. The
extension-owned bot backend stores started users in
`telegram_hidden_intro_leads`, writes funnel events to
`telegram_hidden_intro_events`, verifies channel subscription through Telegram
`getChatMember`, and issues/reuses a random 24h `course_discount_claims` token
for the lesson-1 course route. Future `/start` updates send the public course
intro video first and a separate HTML text with subscription buttons second;
this handler never broadcasts to historical leads. Opening a claim-bearing
course URL stores `localStorage.opten_course_preview_claim_v1` and reports the
initial open through the legacy-named `telegram-hidden-intro-opened`. Guests can
request Kinescope tokens only for regular lessons 1–3 after that endpoint
validates the claim server-to-server; the signed playback JWT uses
`access_mode="telegram-course-preview"`. Private lesson prompts and the separate
`Генераторы промптов Opten` section remain buyer-only. The removed lesson 0 is
absent from `privateCourseCollection.lessons` and the Kinescope whitelist; its
legacy `/hidden-intro` URL only redirects to lesson 1 while preserving the claim
query and remains outside sitemap, llms.txt, public Learn route lists, and EN
sibling maps.

Telegram service tooling currently lives in extension-owned Edge Functions:
`telegram-hidden-intro-stats`, `telegram-hidden-intro-broadcast`,
`telegram-hidden-intro-broadcasts`, `telegram-hidden-intro-assets`, and
`telegram-hidden-intro-reminders`. Mutating endpoints require
`X-Opten-Admin-Secret` and service-role access, so the website `/admin` shell
proxies them through this repo's serverless `/api/admin/*` endpoints after
verifying a website Supabase JWT and a server-side owner allowlist. Broadcasts
go through `/api/admin/telegram-broadcast`: the browser first requests a dry-run
recipient preview, then a final send with the confirmed recipient count. The
serverless proxy repeats the dry-run before sending and rejects stale counts.
Non-dry-run sends are stored by the extension backend in `telegram_broadcasts`
and `telegram_broadcast_recipients` with Telegram `message_id` values; the
admin history/delete UI calls `/api/admin/telegram-broadcasts`, which proxies to
the extension delete endpoint. Broadcasts sent before `message_id` persistence
cannot be reliably deleted afterward.
Image upload goes through `/api/admin/telegram-upload-photo`; the browser
compresses large files, the serverless proxy forwards base64 image data to
`telegram-hidden-intro-assets`, and the returned random public HTTPS URL is used
as `photo_url` for Telegram `sendPhoto`.
Browser code must never receive `TELEGRAM_ADMIN_SECRET`, the bot token, or a
Supabase service-role key.

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
                                                 sitemap.mjs + llms.mjs (model sub-count + total route floor)
```

Key points:
- **`_registry.ts` is AUTO-GEN** from RU skills, so the free-text meta fields (`name`, `platform`, `duration`, `resolution`) are Russian. English comes from `metaEn.ts` overrides resolved by `metaField(meta, field, lang)` — there is no build gate for this, so run `node scripts/verify-models-content.mjs` to catch Cyrillic leaking onto `/en/*`.
- **`HUB_HIDDEN_SLUGS`** (in `index.ts`) hides 11 general/umbrella models (flux, gpt-image, imagen, kling, luma-ray, midjourney, nano-banana, seedance, seedream, sora, veo) from the hub grid + ItemList schema, but their pages stay live + in the sitemap (generic-query SEO, not orphaned — still linked from related-models).
- **Hub + blog use a `hydrated` gate**: the prerendered hub/blog list the full unfiltered set; URL-derived filters (`?type`/`?tag`/`?q`/`?page`) only apply after mount so the first client render matches SSR (avoids React hydration mismatch on direct-loads of filtered URLs).

## Billing flow — RU (YooKassa)

```
User on /pay (lang=ru, currency=RUB)
  └─> Prefer website session from localStorage.opten_space_session_v1
        └─> account-summary renders current plan/credits
      Else fallback to extension GET_AUTH_TOKEN for shipped extension flows
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
  └─> Same website-first auth, extension fallback only when no website session exists.
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
  └─> Prefer website session from localStorage.opten_space_session_v1
        └─> POST /functions/v1/account-summary → render credits, plan, card info
  └─> User clicks "Cancel"
        └─> Website session:
              └─> provider='paddle'   → POST /functions/v1/cancel-subscription-paddle
              └─> otherwise           → POST /functions/v1/cancel-subscription
              └─> Response: { success, expires_at }   (status flips to 'cancelled', plan stays 'pro' until expires_at)
      Else fallback:
        └─> sendMessage(extId, GET_AUTH_TOKEN / CANCEL_SUBSCRIPTION)
              └─> Extension reads ps_sub_provider and dispatches to the same cancel functions

Website logout on /account clears only localStorage.opten_space_session_v1 and
calls public Supabase logout for that website JWT. It does not mutate extension
chrome.storage.local ps_* keys; extension logout remains extension-owned.
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
              1. Verify JWT locally with jose against the Supabase issuer allowlist
              2. Query subscriptions WHERE plan=pro AND status IN (active, cancelled)
              3. Treat cancelled as Pro only while expires_at is absent or in the future
              4. If Pro: stream api/_assets/opten.zip with Content-Type: application/zip
              5. If not Pro: 403 { error: 'not_pro', upgrade_url: '/account?upgrade=skill' }
```

The auth check is defense-in-depth — the extension popup also gates the link.

## Hidden Kinescope course flow

```
Guest opens /learn/courses/ai-content-marketing-2026/:lessonSlug
  └─> Optional promo apply
        └─> POST /functions/v1/create-course-payment
              Body: { course_slug, currency, promo_code, quote_only: true }
              └─> validates course_promo_codes and returns effective price
              └─> does not create course_orders or increment times_used
  └─> Enters email + currency/promo
        └─> POST /functions/v1/create-course-payment
              ├─> RUB: YooKassa confirmation_url
              └─> USD: Paddle one-time price_id + optional discountCode
              ↓
            Provider webhook marks order paid, records promo redemption,
            grants course_entitlements for that email
              ↓
            Buyer signs in through website Email OTP / direct auth link
              ↓
Authenticated lesson page
  └─> POST /functions/v1/course-access-summary
        └─> claims entitlement by email and binds it to auth.users.id
  └─> Kinescope player needs protected playback:
        └─> POST /api/kinescope-course-token
              Authorization: Bearer <website JWT>
              Body: { courseSlug, lessonSlug }
              └─> verifies JWT locally, confirms course access, signs drmauthtoken
              └─> returns { provider: "kinescope", embedUrl, expiresAt }
        └─> Client embeds Kinescope iframe and uses the iframe API for timestamp seek
        └─> Kinescope calls POST /api/kinescope-course-auth during playback
              └─> verifies drmauthtoken and returns 200/403
  └─> Locked prompt cards:
        └─> POST /api/course-prompt
              Authorization: Bearer <website JWT>
              Body: { courseSlug, lessonSlug, promptId }
              └─> verifies course access and returns only the requested prompt body
```

Course access is separate from Pro subscription state. The paid course writes
`course_orders` / `course_entitlements` in the extension-owned Supabase backend;
it must not update `subscriptions`, `users.plan`, or extension credit usage.

## State summary

| State | Lives in | Who writes | Who reads |
|-------|----------|------------|-----------|
| Current language | `localStorage.opten_lang_v3` (legacy `opten_lang` read for one-shot EN migration) | LangSwitcher (only writer) | LangContext (`<html lang>` is baked at prerender, NOT mutated) |
| Payment currency | `localStorage.opten_pay_currency` | PayPage | PayPage |
| Auth token | Extension's `chrome.storage.local.ps_auth_token` | Extension OAuth | Extension (mirrored to site via `GET_AUTH_TOKEN`) |
| Subscription | Supabase `subscriptions` table | Webhooks (YooKassa, Paddle) | Edge Functions, extension, site (`account-summary` / fallback via extension) |
| Plan / quota | Extension `chrome.storage.local.ps_*` | Extension (synced from Supabase) | Site via `GET_SUBSCRIPTION` |
| Website Supabase session | `localStorage.opten_space_session_v1` | `/login` and `/auth/callback` (`/app/*` compatibility callback supported) | `/pay`, `/account`, `/app/*`, `SiteHeader`, `SpaceHeader` |
| Website account summary | Supabase `users`, `subscriptions`, `usage_logs` via `account-summary` | Supabase Auth/webhooks/proxy usage logging | `/pay`, `/account`, `/app/*`, headers via Bearer JWT |
| Course orders / entitlements | Supabase `course_orders`, `course_entitlements` | `create-course-payment` + YooKassa/Paddle course webhooks | Paid course page through `course-access-summary`; website API gates through `hasCourseAccess()` |
| Course promo codes | Supabase `course_promo_codes` | Operators/marketing through service-role SQL or admin tooling; webhooks increment `times_used` after successful course payment | `create-course-payment` service-role validation and quote preview; paid course UI receives only the effective quote |
| Telegram course preview leads | Supabase `telegram_hidden_intro_leads` (legacy table name) | Telegram webhook, reminders, broadcasts, course webhooks | Extension-owned Edge Functions; website `/admin` reads aggregates and triggers broadcast service calls only through server-side owner proxy |
| Telegram course preview events | Supabase `telegram_hidden_intro_events` (legacy table name) | Telegram webhook, opened endpoint, checkout/payment hooks, broadcasts/reminders | Aggregated stats only in browser; broadcast send/fail rows are written by service Edge Functions |
| Telegram 24h discount claims | Supabase `course_discount_claims` | Telegram webhook issues claims; `create-course-payment` reserves/quotes; provider webhooks mark used | Paid course UI sends claim token to `create-course-payment`; website `/admin` sees aggregated state and broadcast segments only through service proxy |
| Learn manual progress | `localStorage.opten_space_learn_progress_v1` | Public/private lesson completion button | Learn lesson UI, course progress widgets |
| Kinescope playback token | Short-lived HS256 JWT in Kinescope embed URL | `/api/kinescope-course-token` using `KINESCOPE_AUTH_JWT_SECRET` | Kinescope player + `/api/kinescope-course-auth` |
| Course prompt bodies | `api/_shared/coursePromptBodies.ts` server bundle | Code/content commits | `/api/course-prompt` after course access check |
| Prompt Library private rows | Supabase `prompt_library` | Extension/site PostgREST with owner JWT | `/prompt-library`, extension context menus |
| Prompt Library public snapshots | Supabase `prompt_library_publications`, `prompt_library_publication_items` | `/prompt-library` owner publish RPC | `/p/:slug` public read RPC; per-prompt save copies into viewer `prompt_library` |

**The site owns no primary application database.** Persistence is either in the
user's browser (localStorage, extension storage) or in Supabase owned by the
extension repo. Website auth stores a client session locally, while
subscription, credits, course entitlements, Telegram funnel data, and discount
claims remain in Supabase and extension-owned Edge Functions. Site serverless
APIs are allowed to act as protected server-side proxies for owner/admin
tooling, but client code must not bypass them or call private Supabase tables
directly. Website and extension sessions may represent different `auth.users.id`
values; this is expected, and entitlements do not cross accounts unless the user
signs into both surfaces as the same account.

## Build/asset notes

- [`api/_assets/opten.zip`](../../api/_assets/) — the Pro skill bundle. Bundled with the serverless function via `vercel.json` `includeFiles`. Update via `chore: refresh opten.zip` commits (see `12b3f17`).
- [`public/assets/space/courses/ai-content-marketing-2026/opten-skill.zip`](../../public/assets/space/courses/ai-content-marketing-2026/) — downloadable Claude skill archive used by the paid course lesson materials.
- [`public/favicon-*.png`](../../public/) — 14 favicon sizes. Excessive — modern browsers need only a handful. Cleanup candidate.
- [`public/assets/welcome-{ru,en}-*.png`](../../public/assets/) — onboarding screenshots, one set per language.
- [`src/imports/`](../../src/imports/) — Figma-Make-generated SVG path dumps. Auto-generated; manual edits there get clobbered if the page is re-imported from Figma.
- [`.secrets/kinescope.env`](../../.secrets/) — local-only operational Kinescope API key for dashboard/API checks. It is gitignored and must never be copied into client code or `VITE_*` variables.
