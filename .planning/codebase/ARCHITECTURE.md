<!-- refreshed: 2026-05-21 -->
# Architecture

**Analysis Date:** 2026-05-21

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                      Index HTML + Vite Bundle                            │
│              (main.tsx: Router + LangProvider + Routes)                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────┐  ┌──────────────────────┐  ┌────────────────┐  │
│  │  Prerendered Pages  │  │   SPA-Only Routes    │  │  Dynamic Model │  │
│  │  (Marketing/Billing)│  │  (Account/Success)   │  │  Content Pages │  │
│  │ `src/app/pages/`    │  │ `src/app/pages/`     │  │ `/models/:slug`│  │
│  └─────────────────────┘  └──────────────────────┘  └────────────────┘  │
│                                                                            │
└──────────────┬───────────────────────────────┬──────────────────────────┘
               │                               │
               ▼                               ▼
    ┌──────────────────────────┐    ┌──────────────────────────┐
    │    Entry (Hydrate)       │    │   Lazy Components        │
    │  entry-server.tsx (SSR)  │    │  (Suspense boundaries)   │
    │  .ssr-cache/             │    │  - SuccessPage           │
    │  renderRoute(path)       │    │  - AccountPage           │
    │                          │    │  - DownloadSkillPage     │
    └──────────────────────────┘    └──────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────────────────────┐
    │         I18n Layer (LangContext + localStorage)          │
    │  Detects: URL prefix (/en/*) > localStorage > navigator   │
    │  Source: ru.json / en.json (eager)                        │
    │  Router wrapper: StaticRouter (SSR) / BrowserRouter (CSR) │
    └──────────────────────────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────────────────────┐
    │  Content & Components                                     │
    │  Shared: SiteHeader, SiteFooter, LocalizedLink, FaqBlock │
    │  Marketing: Landing sections, Pricing, Privacy          │
    │  Blog: BlogListPage, BlogPostPage                        │
    │  Models: ModelsHubPage (62 cards), ModelPage (detail)    │
    │  Build-injected: data-island scripts (#opten-model)      │
    └──────────────────────────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────────────────────┐
    │   Build-Time Output (scripts/ pipeline)                  │
    │  - 144 prerendered HTML (18 base + 2 hubs + 124 models)  │
    │  - SEO routes manifest (seo-routes.ts)                   │
    │  - Sitemap.xml + llms.txt + IndexNow ping                │
    │  - FAQBlock ↔ FAQPage parity verification                │
    │  - Model data-islands (#opten-model) per route           │
    └──────────────────────────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────────────────────┐
    │    External Integration Points                            │
    │  - Supabase: /functions/v1/* + /rest/v1/* (fetch)        │
    │  - Paddle.js: window.Paddle.Checkout (CDN synced on /pay)│
    │  - Chrome Runtime: chrome.runtime.sendMessage (ext auth)  │
    │  - Vercel: /api/download-skill (serverless)              │
    └──────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| BrowserRouter | Client-side SPA routing | `src/main.tsx` |
| StaticRouter | Build-time SSR routing | `scripts/entry-server.tsx` |
| LangProvider | i18n detection & context (URL prefix > localStorage > navigator) | `src/i18n/LangContext.tsx` |
| App | Landing page entry point; 7 sections (Hero, Partners, Steps, Features, Privacy, Pricing, FAQ) | `src/app/App.tsx` |
| SiteHeader | Unified hamburger header with LangSwitcher; shared across all pages | `src/app/components/SiteHeader.tsx` |
| SiteFooter | Shared footer with InstallButton CTA | `src/app/components/SiteFooter.tsx` |
| LocalizedLink | <Link> drop-in that preserves /en/ prefix when on EN routes | `src/app/components/LocalizedLink.tsx` |
| FaqBlock | Semantic <dl> block; source-of-truth for FAQ schema (mirrored to FAQPage JSON-LD) | `src/app/components/FaqBlock.tsx` |
| BlogListPage | Listing hub for /blog; card grid, tags, pagination | `src/app/pages/BlogListPage.tsx` |
| BlogPostPage | Single blog post page; integrates cover, body, schema | `src/app/pages/BlogPostPage.tsx` |
| ModelsHubPage | Programmatic model hub; 62 cards with type/platform filters + HUB_HIDDEN_SLUGS logic | `src/app/pages/ModelsHubPage.tsx` |
| ModelPage | Single model page; quick facts + content sections + FAQ + related models | `src/app/pages/ModelPage.tsx` |
| PayPage | Billing surface; YooKassa RUB + Paddle USD; Extension Integration Contract §6 (sync Paddle on /pay/index.html only) | `src/app/pages/PayPage.tsx` |
| AccountPage | Pro account page (SPA-only, extension-coupled); lazy-loaded | `src/app/pages/AccountPage.tsx` |
| SuccessPage | YooKassa return_url landing (SPA-only); lazy-loaded | `src/app/pages/SuccessPage.tsx` |
| DownloadSkillPage | Pro-only opten.zip download; JWT + extension-coupled; serverless backend | `src/app/pages/DownloadSkillPage.tsx` |
| NotFound | Catch-all 404; injects noindex at runtime | `src/app/pages/NotFound.tsx` |

## Pattern Overview

**Overall:** Prerender-hydrate hybrid with SSR-synchronized i18n and data-islands for programmatic content.

**Key Characteristics:**
- **Dual-entry SSR:** `entry-server.tsx` (renderRoute for prerender) + `main.tsx` (hydrate/mount discriminator)
- **Hydration safety:** `__PRERENDER_PATH` marker in emitted HTML prevents React #418/#423 when extension deep-links to SPA-only routes
- **i18n first-class:** URL prefix (/en/*) wins over storage/browser language; <html lang> baked at prerender
- **Programmatic SEO:** 62 model pages × 2 languages (124 routes) + 2 hubs generated from `_registry.ts` + content modules
- **Data-islands:** Model content injected as `<script type="application/json" id="opten-model">` to avoid eager 62-file glob in entry chunk
- **Extension coupling:** Locked routes (/welcome, /pay, /success, /account, /dashboard/download-skill) and duplicated constants (EXTENSION_IDS, SUPABASE_URL) tied to extension binaries via Integration Contract

## Layers

**Client Bundle (Vite):**
- Purpose: React SPA with routing, i18n, UI components, and lazy-loaded content
- Location: `src/main.tsx` entry; `src/app/` components & pages; `src/i18n/` context; `src/lib/paddle.ts` lazy-loader
- Contains: Router, LangProvider, 22 route patterns, Suspense boundaries, Tailwind styling
- Depends on: React Router 7, React 18.3, Radix UI, i18n dicts (ru.json, en.json)
- Used by: Browser (hydration on prerendered HTML, SPA for non-prerendered routes)

**SSR Bundle (.ssr-cache):**
- Purpose: Build-time pre-rendering of 144 routes to static HTML
- Location: `scripts/entry-server.tsx` (renderRoute export)
- Contains: React components rendered to strings; no browser APIs
- Depends on: React Router (StaticRouter), LangProvider, same component tree as client
- Used by: `scripts/prerender.mjs` (emits dist/<route>/index.html)

**Metadata Bundle (.ssr-meta):**
- Purpose: Route manifest with per-route metadata (title, description, schema, lang, hreflang)
- Location: `scripts/seo-routes.ts` (routes export + schema blocks)
- Contains: 144 RouteMeta entries (9 marketing RU + 9 EN + 2 hubs + 62 models RU + 62 EN), JSON-LD schema blocks
- Depends on: `src/content/models` (model registry + content); `src/content/landingFaq`
- Used by: `prerender.mjs` (applies meta to each emitted HTML), sitemap.mjs, llms.mjs

**Content Layer:**
- Purpose: Human-authored content modules consumed at build-time
- Location: `src/content/blog/<slug>.ts`, `src/content/models/<slug>.ts`, `src/content/models/_registry.ts`
- Contains: Blog posts (RU + EN), model content (RU + EN), model metadata registry
- Depends on: Content types (`types.ts`), i18n metadata (`metaEn.ts`)
- Used by: seo-routes.ts (schema generation), pages (page rendering)

**Build Pipeline:**
- Purpose: Orchestrate SSR, prerendering, SEO verification, and asset optimization
- Location: `scripts/{entry-server,prerender,seo-routes,sitemap,llms,verify-*}.mjs`
- Contains: SSR renderers, HTML splicing, schema validation, sitemap generation, JSON-LD parity checks
- Depends on: Vite build outputs (.ssr-cache, .ssr-meta, dist/), file system operations
- Used by: `npm run build` (invoked by Vercel on deployment)

## Data Flow

### Primary Request Path (Prerendered Route / `/` → `dist/index.html`)

1. **Static HTML loaded** (`dist/index.html`) — emitted by prerender.mjs with:
   - `<html lang="ru">` (baked at prerender)
   - `<meta name="description">` + og:* tags (from seo-routes.ts)
   - `<link rel="canonical">` + hreflang triplet (ru/en/x-default)
   - Prerendered body (from renderRoute)
   - `<script type="application/json" id="opten-model">` (model data-island, if /models/:slug)
   - `window.__PRERENDER_PATH = "/"` marker

2. **Client bundle hydration** (`src/main.tsx`):
   - Checks: `root.hasChildNodes() && (__PRERENDER_PATH === location.pathname)`
   - If match → `hydrateRoot()` (preserves server tree)
   - Else → `createRoot()` (wipes stale HTML, mounts client tree)

3. **LangProvider initializes**:
   - URL prefix wins: `pathname.startsWith("/en/")` → lang = "en"
   - Else: localStorage "opten_lang_v3" (if set explicitly via LangSwitcher)
   - Else: `navigator.language.startsWith("ru")` → "ru" | "en"
   - Result: context value emitted matches prerendered <html lang>

4. **Route match & page render**:
   - React Router resolves `/` → `<App />`
   - Component tree renders with i18n context active
   - FaqBlock content pulls from landingFaq[lang]

5. **Interaction:**
   - LangSwitcher click: navigate to `/en/` (LocalizedLink preserves /en prefix)
   - Install button: window.open(STORE_URL)
   - Pricing CTA: navigate to `/pay` (PayPage lazy-loads Paddle.js if needed)

### SPA Navigation Path (Landing → Blog Post / `/blog/foo`)

1. **Click <LocalizedLink to="/blog/foo">**
2. **localizeHref check:** onEnPath=true, target has EN sibling → rewrite to "/en/blog/foo"
3. **React Router navigates** (client-side, no full page load)
4. **BlogPostPage component mounts**:
   - useParams extracts slug="foo"
   - Imports blog content module (eager for prerendered slugs, lazy for SPA nav to new posts)
   - Renders cover, intro, sections, FAQ block
   - FaqBlock schema mirrors JSON-LD in seo-routes.ts (parity via verify-faq-mainentity.mjs)

### Extension Deep-Link Path (Ext → `/account` or `/success`)

1. **chrome.runtime.sendMessage** from extension (externally_connectable: ["opten.space"])
2. **Extension navigates window to `/account`** (deep-link via `chrome.tabs.update`)
3. **Vercel SPA rewrite:** /((?!api/).*) → /index.html (serves dist/index.html)
4. **HTML lands in browser:**
   - `__PRERENDER_PATH = "/"` (index.html prerendered for `/`)
   - Current `location.pathname = "/account"` (no match)
5. **Hydration discriminator triggers:**
   - `root.hasChildNodes() && __PRERENDER_PATH !== location.pathname` → false
   - Creates fresh tree: `createRoot().render(tree)`
6. **React Router matches** `<Route path="/account" element={<AccountPage />}>`
7. **AccountPage.lazy() loads** (SuccessPage, AccountPage, DownloadSkillPage are lazy)
8. **LangProvider detects:**
   - No /en/ prefix, no localStorage (first load)
   - Default to RU (D-07 Pitfall)
   - LangSwitcher on AccountPage flips in-place (navigate = null, setLang only)

### Model Page Content Loading (Speed/Phase B)

**SSR + Initial Hydration (`/models/gpt-4o`):**
1. prerender.mjs emits HTML for /models/gpt-4o with prerendered body
2. seo-routes.ts buildModelRoute() sets modelIsland = { slug, meta, content }
3. prerender.mjs injects: `<script type="application/json" id="opten-model">{modelIsland}</script>`
4. ModelPage mounts, useModelEntry calls getModelBySlug("gpt-4o")
5. index.client.ts loadModelBySlug() reads #opten-model data-island synchronously → entry present before render → hydration match

**Client SPA Nav to Uncached Model (Landing → `/models/unknownmodel`):**
1. ModelPage mounts, slug="unknownmodel"
2. getModelBySlug() returns undefined (not in island)
3. useModelEntry falls back to loadModelBySlug(slug)
4. index.client.ts lazy-loads from per-model chunk (e.g., `./unknownmodel.client.js`)
5. Loading state shown briefly, entry resolves, content renders

**State Management:**
- i18n: LangContext + localStorage "opten_lang_v3" (explicit user choice only)
- Extension state: chrome.storage.local (ps_* keys, read via sendMessage)
- Model content: data-island cache + lazy per-model chunks (index.client.ts)
- Payment state: Paddle.Checkout listeners + Supabase REST to verify order

## Key Abstractions

**LocalizedLink:**
- Purpose: <Link> drop-in that rewrites internal hrefs to /en/* when on EN routes
- Examples: `src/app/components/LocalizedLink.tsx`
- Pattern: useOnEnPath() + localizeHref() check against EN_SIBLINGS set

**Data Island:**
- Purpose: Inject model content inline as JSON script to avoid eager glob in entry chunk
- Examples: ModelIslandData interface in seo-routes.ts, #opten-model element in prerendered HTML, index.client.ts readIsland()
- Pattern: prerender.mjs writes script tag, ModelPage reads #opten-model textContent and JSON.parse

**Hydration Discriminator:**
- Purpose: Detect SSR-prerendered HTML vs. SPA-fallback HTML to prevent React #418/#423
- Examples: `src/main.tsx` lines 96-104
- Pattern: window.__PRERENDER_PATH === location.pathname check

**Lazy Component + Suspense:**
- Purpose: Keep SuccessPage, AccountPage, DownloadSkillPage out of SSR (prevent renderToString crashes on browser APIs)
- Examples: `src/main.tsx` lines 28-30
- Pattern: React.lazy() + <Suspense fallback={<RouteLoading />}>

**Dynamic Route Expansion:**
- Purpose: Generate 62 model pages from registry + content modules
- Examples: seo-routes.ts MODELS_REGISTRY loop, src/content/models/index.ts contentModules glob
- Pattern: Build-time config + import.meta.glob() eager resolution

## Entry Points

**Browser (SPA):**
- Location: `src/main.tsx`
- Triggers: Page load (HTML), SPA navigation (React Router)
- Responsibilities: Hydration detection, Router setup, LangProvider wrapping, Suspense boundary

**Build (Prerender):**
- Location: `scripts/prerender.mjs`
- Triggers: `npm run build` (vite build → vite build --ssr → prerender.mjs)
- Responsibilities: Loop routes from seo-routes.ts, SSR each path, splice meta, inject markers, write dist/<route>/index.html

**API (Extension Download):**
- Location: `api/download-skill.ts` (Vercel serverless)
- Triggers: GET /api/download-skill?token=JWT (from extension)
- Responsibilities: Verify JWT, check Pro tier, stream opten.zip from promptscore-proxy skills

## Architectural Constraints

- **Hydration timing:** __PRERENDER_PATH marker must be written BEFORE hydrateRoot() check; SSR tree structure must exactly match client tree (comments count)
- **i18n synchronization:** <html lang> baked at prerender; runtime lang mutations are forbidden (Phase 3 D-06); dicts.en must be eagerly available on /en/* routes to prevent hydration mismatch
- **Global state:** localStorage only (opten_lang_v3, opten_pay_currency); no module-level singletons except paddleReady promise (idempotent) and dicts (immutable after boot)
- **Circular imports:** None detected; content/models/index.ts deliberately does NOT import from index.client.ts (vite alias + build-time swapping handles it)
- **Route duplication:** 22 client patterns in main.tsx MUST match entry-server.tsx routes exactly (Rule 1 rule: both define RU + EN variants)
- **Extension coupling:** EXTENSION_IDS, SUPABASE_URL, SUPABASE_ANON_KEY hardcoded in 3 pages + api/download-skill.ts; changes here are breaking changes to shipped extension binaries
- **Data-island injection:** prerender.mjs must run AFTER all SSR outputs; order matters (entry-server.js + seo-routes.js must be ready before splicing)

## Anti-Patterns

### Bare <Link> on /en/* Routes

**What happens:** Developer writes `<Link to="/pay">` inside a /en/welcome component
**Why it's wrong:** React Router's Link doesn't know about URL localization; on /en/* the navigation resets to /pay (RU), breaking the language prefix and causing the page to re-render as RU even if the user is reading EN
**Do this instead:** Use `<LocalizedLink to="/pay">` — it calls localizeHref(to, onEnPath) internally and rewrites to "/en/pay" when needed (`src/app/components/LocalizedLink.tsx`)

### Storing Localized Strings in localStorage

**What happens:** Caching `"опten"` vs `"Opten"` in localStorage during initial render leads to hardcoded language mismatches
**Why it's wrong:** i18n dicts are the single source of truth; storing derived strings creates drift and breaks SPA language switches
**Do this instead:** Store only the lang selection: `localStorage.setItem("opten_lang_v3", lang)` where lang is "ru" | "en". Always look up strings via `useT()` (`src/i18n/LangContext.tsx` lines 112–124)

### Mutating document.documentElement.lang at Runtime

**What happens:** Some SSR frameworks runtime-mutate the HTML lang tag; React does NOT re-render the <html> tag, so the mutation is invisible to crawlers (Phase 3 D-06)
**Why it's wrong:** Crawlers see the prerendered <html lang> only; baking it per-route at prerender time is the only way to signal language correctly
**Do this instead:** Never mutate <html lang> at runtime. Prerender.mjs writes lang per-route via applyHtmlLang() (`scripts/prerender.mjs` lines 38–47)

### Importing Full Content Barrel into Routes without Data-Island

**What happens:** ModelPage imports `src/content/models` (eager glob of 62 .ts files); the eager glob ships the entire registry in the entry chunk (~200 KB)
**Why it's wrong:** Slows down every page load, wastes bandwidth for users who never visit model pages
**Do this instead:** Use data-islands for prerendered routes, lazy per-model chunks for SPA nav. Vite alias swaps `@/content/models` to `index.client.ts` for the browser build (vite.config.ts lines 29–34), while SSR keeps the eager barrel for renderRoute

### Forgetting EN_SIBLINGS Sync

**What happens:** Developer adds a new route (e.g., `/guides/new-post`) in main.tsx and seo-routes.ts but forgets to add "/guides/new-post" to EN_SIBLINGS in paths.ts
**Why it's wrong:** <LocalizedLink to="/guides/new-post"> on /en/* routes doesn't rewrite the href, link resolves to "/guides/new-post" instead of "/en/guides/new-post"
**Do this instead:** Update three files in sync: (1) main.tsx (RU + EN route patterns), (2) seo-routes.ts (manifest entry), (3) paths.ts (EN_SIBLINGS set). See `src/i18n/paths.ts` comments lines 1–4

## Error Handling

**Strategy:** Graceful degradation with runtime context injection.

**Patterns:**
- **Hydration mismatch (React #418/#423):** Discriminator falls back to createRoot + full client re-render (no hard crash)
- **Missing model content:** ModelPage shows QuickFacts + InstallCta only; content loads async or shows "loading" state
- **Paddle SDK load failure:** ensurePaddle() rejects with error; PayPage logs warning but doesn't crash
- **404 routes:** NotFound catches all via `<Route path="*">`, injects noindex, offers home link (doesn't throw)
- **Supabase fetch errors:** Callers (AccountPage, PayPage) handle fetch rejection; no global error boundary (yet)

## Cross-Cutting Concerns

**Logging:** console.warn for missing env vars (VITE_PADDLE_CLIENT_TOKEN); console.error for SDK load failures (Paddle, model lazy-load). No structured logger (minimal overhead)

**Validation:** TypeScript compiler catches most errors at build time. Runtime: React Router validates route match, LangProvider validates detectLangFromPath result, verify-faq-mainentity.mjs asserts FAQ DOM ↔ schema parity

**Authentication:** Extension owns auth. Site reads user state via chrome.runtime.sendMessage (extension origin isolation). Pro tier gated in PayPage + DownloadSkillPage via JWT verification (api/download-skill.ts)

---

*Architecture analysis: 2026-05-21*
