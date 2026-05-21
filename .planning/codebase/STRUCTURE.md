# Codebase Structure

**Analysis Date:** 2026-05-21

## Directory Layout

```
opten-website/
├── api/                    # Vercel serverless functions
│   └── download-skill.ts   # GET /api/download-skill — Pro-gated ZIP download (JWT verification)
├── public/                 # Static assets served as-is
│   ├── favicon-*.png       # Favicons
│   ├── logo.svg            # Opten logo
│   ├── og-card-ru.png      # OG image (RU default)
│   ├── og-card-en.png      # OG image (EN variant)
│   ├── assets/
│   │   ├── landing-design/ # Hero, features, steps images (srcset via vite-imagetools)
│   │   └── partners/       # Partner logos (Syntx, Freepik, Higgsfield, Canva)
│   └── blog/<slug>/        # Per-post cover images
├── scripts/                # Build pipeline (Node.js, not committed to dist)
│   ├── entry-server.tsx    # SSR entry: renderRoute(path) → HTML string
│   ├── seo-routes.ts       # Route manifest: 144 RouteMeta + JSON-LD schema blocks
│   ├── prerender.mjs       # Main postbuild: splices meta, injects markers, writes 144 HTML files
│   ├── sitemap.mjs         # Emits sitemap.xml (144 URLs with hreflang)
│   ├── llms.mjs            # Emits llms.txt + llms-full.txt (LLM prompting)
│   ├── verify-faq-mainentity.mjs  # Gate: FAQ DOM ↔ FAQPage schema parity
│   ├── verify-fonts.mjs    # Gate: all fonts loaded via @font-face
│   ├── sync-skills.mjs     # Imports promptscore-proxy/skills/*.md → src/content/models/_skills/
│   ├── build-models-registry.mjs  # Parses _skills/*.md → _registry.ts (AUTO-GEN)
│   ├── generate-summaries.mjs  # AI-powered summaries for model content (pre-Phase 2)
│   ├── verify-models-content.mjs  # Manual gate: model content Cyrillic check (EN-meta-only)
│   ├── smoke-blog.mjs      # Ad-hoc Playwright smoke test for /blog
│   └── mock-vercel-server.mjs  # Local dev: simulates Vercel SPA rewrite
├── src/
│   ├── main.tsx            # **Entry point**: BrowserRouter + LangProvider + 22 route patterns + hydration discriminator
│   ├── app/
│   │   ├── App.tsx         # Landing page: Hero, Partners, Steps, Features, Privacy, Pricing, FAQ
│   │   ├── components/
│   │   │   ├── SiteHeader.tsx      # Hamburger nav + LangSwitcher (shared)
│   │   │   ├── SiteFooter.tsx      # Footer + InstallButton (shared)
│   │   │   ├── LocalizedLink.tsx   # <Link> wrapper preserving /en/ prefix
│   │   │   ├── LangSwitcher.tsx    # EN↔RU toggle (navigate OR in-place flip)
│   │   │   ├── FaqBlock.tsx        # Semantic <dl>; source-of-truth for FAQ schema
│   │   │   ├── InstallButton.tsx   # Chrome Web Store CTA
│   │   │   ├── InlineOptenCallout.tsx  # Card callout (landing use)
│   │   │   ├── BlogPostCard.tsx    # Blog listing card
│   │   │   ├── Picture.tsx         # <picture> wrapper for srcset (vite-imagetools)
│   │   │   ├── RouteLoading.tsx    # Fallback for Suspense boundaries
│   │   │   ├── OptenHeroAnimation.tsx  # Animated SVG path sequence
│   │   │   ├── ModelQuickFacts.tsx     # Model page: facts table (platform, resolution, etc.)
│   │   │   ├── ModelInstallCta.tsx     # Model page: install CTA + Pro badge
│   │   │   ├── RelatedModels.tsx       # Model page: "See also" carousel
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx  # Image placeholder (Figma imports)
│   │   │   ├── layout/
│   │   │   │   └── LegalLayout.tsx  # Wrapper for /privacy, /terms, /refund (shared styling)
│   │   │   └── ui/                  # 40+ Radix UI primitives (auto-generated)
│   │   │       ├── accordion.tsx, alert.tsx, avatar.tsx, button.tsx, etc.
│   │   │       └── sonner.tsx       # Toast notifications
│   │   └── pages/
│   │       ├── App.tsx (above)
│   │       ├── BlogListPage.tsx     # /blog hub (RU + /en/blog)
│   │       ├── BlogPostPage.tsx     # /blog/:slug (RU + /en/blog/:slug)
│   │       ├── ModelsHubPage.tsx    # /models hub (2 routes: RU + /en/models)
│   │       ├── ModelPage.tsx        # /models/:slug (124 routes: 62 RU + 62 /en/models/:slug)
│   │       ├── PayPage.tsx          # /pay (RU + /en/pay) — YooKassa + Paddle; SSR-prerendered
│   │       ├── AboutPage.tsx        # /about (RU + /en/about) — Phase 4.1 B-03
│   │       ├── WelcomePage.tsx      # /welcome (extension first-install) + /en/welcome
│   │       ├── PrivacyPage.tsx      # /privacy + /en/privacy (legal)
│   │       ├── TermsPage.tsx        # /terms + /en/terms (legal)
│   │       ├── RefundPage.tsx       # /refund + /en/refund (legal)
│   │       ├── AccountPage.tsx      # /account (SPA-only, extension-coupled) — lazy-loaded
│   │       ├── SuccessPage.tsx      # /success (YooKassa return_url) — lazy-loaded, SPA-only
│   │       ├── DownloadSkillPage.tsx # /dashboard/download-skill (Pro-only, extension-coupled) — lazy-loaded
│   │       └── NotFound.tsx         # Catch-all 404 (*) — injects noindex at runtime
│   ├── content/
│   │   ├── about.tsx               # AboutPage body data (shared for both langs)
│   │   ├── landingFaq.ts           # FAQ items for landing FaqBlock (separate RU/EN)
│   │   ├── blog/
│   │   │   ├── types.ts            # BlogPost, BlogPostLocale, BlogPostBody interfaces
│   │   │   ├── <slug>.ts           # One file per blog post (gpt-image-2, etc.); export post: BlogPost
│   │   │   └── index.ts            # Barrel: allBlogPosts (eager), postBySlug lookup
│   │   └── models/
│   │       ├── types.ts            # ModelMeta, ModelContent, ModelEntry, ModelIslandData
│   │       ├── _registry.ts        # AUTO-GEN: 62 ModelMeta (hand-do-not-edit)
│   │       ├── _skills/            # AUTO-GEN: synced promptscore-proxy/skills/*.md (62 RU source files)
│   │       │   └── <slug>.md       # One per model (kling-2.6.md, etc.) — parsed by build-models-registry.mjs
│   │       ├── metaEn.ts           # EN-only meta overrides (name, platform, duration, resolution)
│   │       ├── slugs.ts            # Light import: MODEL_SLUGS_WITH_CONTENT, HUB_HIDDEN_SLUGS
│   │       ├── <slug>.ts           # One content file per model with content (gpt-4o.ts, etc.)
│   │       │                        # export const content: ModelContent
│   │       ├── index.ts            # Eager barrel: allModels, modelsBySlug (build-time, SSR)
│   │       ├── index.client.ts     # Lazy barrel: loadModelBySlug via per-model chunks (browser only)
│   │       └── index.client.ts     # Vite alias swaps index.ts → index.client.ts for browser build
│   ├── i18n/
│   │   ├── LangContext.tsx         # React Context: lang detection (URL > localStorage > navigator), t() lookup
│   │   ├── ru.json                 # RU dictionary (~3 KB, eagerly imported)
│   │   ├── en.json                 # EN dictionary (~3 KB, eagerly imported as fallback for /en/* hydration)
│   │   └── paths.ts                # EN_SIBLINGS set + localizeHref/toEnTarget/toRuTarget helpers
│   ├── lib/
│   │   └── paddle.ts               # ensurePaddle() lazy-loader (memoized promise)
│   ├── styles/
│   │   ├── index.css               # @tailwind directives + global resets
│   │   ├── theme.css               # Custom CSS variables (colors, fonts)
│   │   ├── fonts.css               # @font-face declarations (Unbounded, PT Root UI)
│   │   └── tailwind.css            # (Generated by Tailwind 4)
│   ├── types/
│   │   └── [global types shared across components]
│   └── imports/
│       ├── Frame2/, Frame51/, LandingPage/  # Figma-Make-generated SVG path components (brittle)
│       └── [Do not hand-edit — auto-generated from Figma]
├── .planning/              # GSD workflow artifacts (read-only after bootstrap)
│   ├── codebase/
│   │   ├── ARCHITECTURE.md (this file — refreshed per focus)
│   │   ├── STRUCTURE.md (this file)
│   │   ├── STACK.md, INTEGRATIONS.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
│   ├── phases/XX-name/     # Per-phase: SPEC, PLAN, CONTEXT
│   ├── PROJECT.md          # Mirrors INTEGRATION-CONTRACT.md (locked decisions)
│   ├── ROADMAP.md          # Milestone → phases breakdown
│   ├── REQUIREMENTS.md     # Falsifiable reqs per milestone
│   └── STATE.md            # Current phase / progress / blockers
├── docs/                   # Reference documentation
│   ├── INTEGRATION-CONTRACT.md  # **Binding interface with extension** (locked routes, hardcoded constants)
│   ├── CONTENT-AUTHORING.md     # **Checklist for adding pages, posts, models** (6-file sync, schema rules)
│   ├── TECH.md             # Stack snapshot
│   ├── ARCHITECTURE.md     # Routes, flows, state (narrative)
│   └── SEO-AUDIT.md        # v1.0 baseline + GEO gaps
├── index.html              # SPA shell + sync Paddle.js script (only on /pay/ variants after prerender)
├── package.json            # Vite 6 + React 18.3 + React Router 7 + Tailwind 4 + Radix UI
├── vite.config.ts          # Vite plugins: react, tailwindcss, vite-imagetools
│                            # Model alias: @/content/models → index.client.ts (browser) | index.ts (SSR)
├── tsconfig.json           # TypeScript config + @ path alias
├── .prettierrc              # (none configured — Prettier not used)
└── vercel.json             # Deployment config: SPA fallback /((?!api/).*) → /index.html
```

## Directory Purposes

**api/**
- Vercel serverless functions (one per file)
- `download-skill.ts`: JWT-protected, Pro-tier-gated, streams opten.zip (sourced from promptscore-proxy)
- No other functions today (all other API calls go through Supabase REST or Edge Functions)

**public/**
- Static assets served at root (`/favicon.ico`, `/logo.svg`)
- Subdirs: `assets/landing-design/` (images with srcset), `assets/partners/` (logos), `blog/<slug>/` (per-post covers)
- Never modify during build (excluded from .gitignore cache)

**scripts/**
- Node.js postbuild scripts (not shipped to dist, excluded from .gitignore)
- **entry-server.tsx:** SSR entry; exported renderRoute(path) called by prerender.mjs
- **seo-routes.ts:** Route manifest (144 entries) + JSON-LD schema blocks (reusable ORG_BLOCK, PERSON_FOUNDER_BLOCK, etc.)
- **prerender.mjs:** Main orchestrator; splices HTML, injects markers, writes 144 files to dist/
- **sitemap.mjs / llms.mjs:** SEO artifacts (generated at build, submitted to Bing/Google)
- **verify-*.mjs:** Build gates (FAQ parity, font load, model content checks)
- **sync-skills.mjs / build-models-registry.mjs:** Model content pipeline (promptscore-proxy → _registry.ts)

**src/main.tsx**
- **Single SPA entry point**; defines all 22 route patterns + catch-all
- Hydration discriminator (lines 96–104): checks __PRERENDER_PATH vs location.pathname
- BrowserRouter wrapper → LangProvider → Suspense → Routes tree
- React.lazy on SuccessPage, AccountPage, DownloadSkillPage (prevent renderToString crashes)

**src/app/App.tsx**
- Landing page: 7 sections (Hero, Partners, Steps, FeatureCards, Privacy, Pricing, FAQ)
- Shared header/footer via SiteHeader/SiteFooter
- useT() + useLang() for i18n lookup
- Styled with Tailwind utility classes (no custom CSS)

**src/app/pages/**
- 14 page components (one file per route)
- SSR-prerendered: App, BlogListPage, BlogPostPage, ModelsHubPage, ModelPage, PayPage, AboutPage, WelcomePage, PrivacyPage, TermsPage, RefundPage, NotFound
- SPA-only (lazy): SuccessPage, AccountPage, DownloadSkillPage
- Route definition in main.tsx and entry-server.tsx mirrors each page here

**src/app/components/**
- Shared across pages (Header, Footer, LocalizedLink, LangSwitcher, FaqBlock)
- Page-specific: BlogPostCard, ModelQuickFacts, ModelInstallCta, RelatedModels
- Radix UI wrappers in `ui/` subdir (40+ primitives, auto-generated)

**src/content/blog/**
- Human-authored blog post modules
- Each `<slug>.ts` exports `post: BlogPost` (RU + EN locales)
- Consumed by BlogListPage (allBlogPosts barrel), BlogPostPage (getPostBySlug)

**src/content/models/**
- **_registry.ts:** AUTO-GEN by build-models-registry.mjs; do NOT hand-edit
- **_skills/<slug>.md:** AUTO-GEN by sync-skills.mjs from promptscore-proxy; do NOT edit (delete & re-sync if stale)
- **<slug>.ts:** Hand-authored content module per model (RU + EN locales)
- **metaEn.ts:** EN-only meta overrides (platform name, resolution, etc. — RU comes from _registry.ts)
- **index.ts:** Eager barrel (build-time + SSR); used by seo-routes.ts + ModelsHubPage
- **index.client.ts:** Lazy barrel (browser only); swapped in via Vite alias for /models/:slug routes not pre-rendered

**src/i18n/**
- **LangContext.tsx:** Single context provider; controls lang state + t() lookup function
- **ru.json / en.json:** i18n dictionaries (eagerly imported; en.json included as fallback for /en/* hydration parity)
- **paths.ts:** EN_SIBLINGS set + URL rewrite helpers (localizeHref, toEnTarget, toRuTarget)

**src/lib/paddle.ts**
- ensurePaddle(): memoized promise-based lazy-loader for Paddle.js CDN
- Only called by PayPage.tsx; other routes skip the SDK entirely
- BG-67-01: Paddle v2 env quirk (Environment.set only works for sandbox)

**src/styles/**
- index.css: @tailwind directives + global resets
- theme.css: CSS custom properties (colors, spacing, shadows)
- fonts.css: @font-face rules (Unbounded, PT Root UI)

**docs/**
- **INTEGRATION-CONTRACT.md:** Locked decisions; do NOT edit without coordination with extension
- **CONTENT-AUTHORING.md:** 6-file sync checklist for new pages; schema parity rules
- Other docs: reference narratives (TECH.md, ARCHITECTURE.md, SEO-AUDIT.md)

**.planning/**
- GSD workflow artifacts (read-only after bootstrap)
- codebase/ subdir: auto-generated by `/gsd-map-codebase` (ARCHITECTURE.md, STRUCTURE.md, etc.)
- phases/ subdir: per-phase artifacts (SPEC, PLAN, CONTEXT) created by `/gsd-plan-phase`

## Key File Locations

**Entry Points:**
- `src/main.tsx`: Client-side React tree + hydration discriminator
- `scripts/entry-server.tsx`: Build-time SSR entry (renderRoute)
- `api/download-skill.ts`: Vercel serverless (GET /api/download-skill)

**Configuration:**
- `vite.config.ts`: Vite plugins, aliases, build options
- `tsconfig.json`: TypeScript + @ path alias
- `package.json`: Dependencies + build/dev scripts
- `vercel.json`: SPA fallback routing

**Core Logic:**
- `src/i18n/LangContext.tsx`: i18n detection + context
- `src/lib/paddle.ts`: Paddle.js lazy-loader
- `src/app/components/LocalizedLink.tsx`: URL localization for links
- `src/app/components/FaqBlock.tsx`: FAQ schema source-of-truth

**SEO & Build:**
- `scripts/seo-routes.ts`: 144 RouteMeta + JSON-LD schema blocks
- `scripts/prerender.mjs`: Main postbuild orchestrator
- `scripts/verify-faq-mainentity.mjs`: FAQ ↔ FAQPage parity gate

**Testing:**
- No test files in repo (TDD not currently in use)
- Playwright smoke test available: `scripts/smoke-blog.mjs` (ad-hoc, not in CI)

## Naming Conventions

**Files:**
- Pages: `<PascalCase>Page.tsx` (App.tsx, BlogListPage.tsx, ModelPage.tsx)
- Components: `<PascalCase>.tsx` (SiteHeader.tsx, FaqBlock.tsx, LocalizedLink.tsx)
- Utilities: `<camelCase>.ts` (paddle.ts, paths.ts)
- Content modules: `<slug>.ts` (gpt-image-2.ts, kling-2.6.ts)
- Build scripts: `<kebab-case>.mjs` (prerender.mjs, sitemap.mjs)

**Directories:**
- `app/pages/`: One file per route
- `app/components/`: UI components (shared or page-specific)
- `app/components/ui/`: Radix UI primitives (auto-generated)
- `content/blog/`: Blog post modules
- `content/models/`: Model content + registry
- `styles/`: CSS (index, theme, fonts)
- `i18n/`: Language context + dicts
- `lib/`: Utilities (paddle, etc.)

**Constants:**
- Module-level: `UPPER_SNAKE_CASE` (SUPABASE_URL, EXTENSION_IDS, STORE_URL, SITE_ORIGIN)
- i18n keys: `dot.namespaced` (e.g., "hero.title", "models.quickFacts.platform")
- localStorage keys: `opten_` prefix (opten_lang_v3, opten_pay_currency)
- Extension storage keys (read-only): `ps_*` prefix (ps_account, ps_tier, etc.)

## Where to Add New Code

**New Marketing/Blog Page:**
1. Create page component: `src/app/pages/<Name>Page.tsx`
2. Register routes in `src/main.tsx` (RU + /en/* variant)
3. Register routes in `scripts/entry-server.tsx` (RU + /en/* variant)
4. Add RouteMeta to `scripts/seo-routes.ts` (title, description, schema, hreflang)
5. Add EN sibling to `src/i18n/paths.ts` (EN_SIBLINGS set)
6. If content: create `src/content/<domain>/<slug>.ts` module

**New Model Page (62 slots):**
1. Skill MD must exist in `src/content/models/_skills/<slug>.md` (synced from promptscore-proxy)
2. Add slug to `src/content/models/slugs.ts` → MODEL_SLUGS_WITH_CONTENT
3. Create content module: `src/content/models/<slug>.ts` (export const content: ModelContent)
4. **Do NOT edit _registry.ts** (auto-generated by build-models-registry.mjs)
5. Run `npm run build` locally; verify sitemap.xml includes route

**New Blog Post:**
1. Create `src/content/blog/<slug>.ts` (export const post: BlogPost with RU + EN)
2. Create cover image at `public/blog/<slug>/cover.jpg` (≥1200px width, ≥1600×900 ideally)
3. Register in `scripts/seo-routes.ts` (RouteMeta for buildBlogRoute)
4. Run build; verify cover loads, schema validates

**New Shared Component:**
1. Create `src/app/components/<Name>.tsx`
2. If Radix-based: keep styling minimal, use Tailwind classes
3. If reusable i18n: import useT() from LangContext
4. If internal nav: use LocalizedLink, never bare Link

**New Utility:**
1. Create `src/lib/<name>.ts`
2. Export functions/types at module level
3. No React hooks (lib is shared with build scripts)

**New API Endpoint:**
1. Create `api/<name>.ts` (Vercel serverless)
2. Export default async handler: `async (req, res) => { ... }`
3. Verify env vars available (VITE_* public only; secrets via extension's Edge Functions)

## Special Directories

**node_modules/**
- Committed: No (in .gitignore)
- Generated: Yes (`npm install` / `pnpm install`)

**.ssr-cache/ & .ssr-meta/**
- Committed: No (in .gitignore)
- Generated: Yes (vite build --ssr emits here)
- Purpose: Temporary build artifacts (deleted at end of build script)

**dist/**
- Committed: No (in .gitignore)
- Generated: Yes (vite build + scripts postbuild)
- Contents: 144 prerendered HTML + CSS + JS bundles + sitemap.xml + llms.txt
- Deployed: Yes (Vercel syncs dist to CDN)

**.planning/phases/**
- Committed: Yes (GSD state)
- Generated: Yes (by `/gsd-plan-phase` command)
- Purpose: Organize phase specs, plans, and context

---

*Structure analysis: 2026-05-21*
