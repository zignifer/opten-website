# Codex SEO Review (no-GEO frame) — opten.space — 2026-05-17

## TL;DR
- The post-GEO fixes are visible in source: 16 prerendered SEO routes exist in `scripts/seo-routes.ts`, with shared schema factories for FAQ, HowTo, Product, Article, WebPage/speakable, and breadcrumbs (`scripts/seo-routes.ts:171`, `scripts/seo-routes.ts:184`, `scripts/seo-routes.ts:203`, `scripts/seo-routes.ts:281`, `scripts/seo-routes.ts:311`, `scripts/seo-routes.ts:335`).
- The generated sitemap path is now correct in `scripts/sitemap.mjs`, including 16-route floor checks, per-route git-derived `lastmod`, and hreflang links (`scripts/sitemap.mjs:31`, `scripts/sitemap.mjs:42`, `scripts/sitemap.mjs:84`). The checked-in `public/sitemap.xml` is still a stale 6-URL fallback (`public/sitemap.xml:3`).
- `robots.txt` now explicitly addresses 15 crawler families and blocks `/account`, `/success`, and `/dashboard/` for each (`public/robots.txt:15`, `public/robots.txt:165`). The remaining gap is that `/api/` is not disallowed, even though `/api/download-skill` is an auth-gated download endpoint (`api/download-skill.ts:36`).
- The largest technical SEO risk is SPA fallback behavior for non-prerendered service routes: `/success`, `/account`, and `/dashboard/download-skill` are client-only routes (`src/main.tsx:22`, `src/main.tsx:64`) served by a global rewrite (`vercel.json:2`). Non-JS crawlers that ignore robots can receive the prerendered root shell until hydration runs.
- On-page structure is good on the landing, about, guide, and legal layouts, but `/pay` and `/welcome` are indexable/prerendered and do not render a visible `<h1>` in their page components (`src/app/pages/PayPage.tsx:417`, `src/app/pages/WelcomePage.tsx:53`).
- Metadata still has a product-scope drift: route descriptions and Product schema say `43+` models while Organization, SoftwareApplication, FAQ, and about copy say `60+` (`scripts/seo-routes.ts:360`, `scripts/seo-routes.ts:223`, `scripts/seo-routes.ts:82`, `src/content/landingFaq.ts:27`).
- Scale readiness is medium: the project has reusable schema builders and a dynamic guide route, but URL inventory is still hand-maintained across `seo-routes.ts`, `main.tsx`, `EN_SIBLINGS`, and `PATH_TO_SOURCE` (`scripts/seo-routes.ts:349`, `src/main.tsx:54`, `src/i18n/paths.ts:9`, `scripts/sitemap.mjs:42`).

## 1. Indexability & technical SEO

**robots.txt: gaps, contradictions, missing directives**

- Current crawler policy is explicit and consistent for the intended private/service paths: wildcard blocks `/account`, `/success`, `/dashboard/`, and their `/en/*` equivalents (`public/robots.txt:1`, `public/robots.txt:3`). The same block is repeated for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Bingbot, YandexBot, Applebot-Extended, cohere-ai, Meta-ExternalAgent, Amazonbot, CCBot, and Bytespider (`public/robots.txt:15`, `public/robots.txt:155`).
- Missing directive: `/api/` is not disallowed in robots. The only API endpoint is a private ZIP download handler (`api/download-skill.ts:1`, `api/download-skill.ts:36`) and it returns authenticated content with `no-store` (`api/download-skill.ts:115`, `api/download-skill.ts:119`). Add `Disallow: /api/` to reduce crawler noise; do not rely on auth alone for crawl hygiene.
- `Content-Signal` is present and permissive for search, training, and input (`public/robots.txt:167`). That is a deliberate AI-crawler policy, not a blocking issue.

**sitemap.xml: completeness vs current route set, lastmod correctness, structure**

- Current source of truth has 16 prerendered routes: 8 RU and 8 EN (`scripts/seo-routes.ts:349`, `scripts/seo-routes.ts:635`, `scripts/seo-routes.ts:862`). The live build script enforces at least 16 sitemap routes (`scripts/sitemap.mjs:31`) and emits all non-`none` routes (`scripts/sitemap.mjs:29`).
- `public/sitemap.xml` is stale and incomplete: it contains only 6 unprefixed URLs and no `lastmod` or hreflang entries (`public/sitemap.xml:2`, `public/sitemap.xml:3`). `scripts/sitemap.mjs` writes the actual generated file to `dist/sitemap.xml` after prerender (`scripts/sitemap.mjs:99`), so production should be correct when the full build script runs (`package.json:7`). The fallback file is still a maintenance trap.
- `lastmod` is now route-specific by source mapping (`scripts/sitemap.mjs:42`) and falls back to build date only when the route has no source mapping or git lookup fails (`scripts/sitemap.mjs:78`). The gap is that `PATH_TO_SOURCE` is another route inventory that must be updated when adding pages (`scripts/sitemap.mjs:42`).
- Single-file sitemap is fine for 16 URLs. For 100+ pages, split by route family or locale before the protocol limits become urgent, because guides/comparisons/categories will have different update cadence. Current code emits one `urlset` only (`scripts/sitemap.mjs:84`).

**canonical URLs: correctness, trailing slash, www/non-www, http→https**

- Canonicals are absolute `https://opten.space` URLs and route paths are bare except `/` (`scripts/seo-routes.ts:27`, `scripts/seo-routes.ts:51`, `scripts/seo-routes.ts:361`, `scripts/seo-routes.ts:394`). `applyMeta` injects the canonical into every prerendered file (`scripts/prerender.mjs:127`).
- No repo-level redirect policy is defined for trailing slashes, `www`, or HTTP. `vercel.json` only has a catch-all SPA rewrite and headers (`vercel.json:2`, `vercel.json:5`). Canonical tags reduce duplicate clustering, but redirects are the cleaner signal for `/pay/`, `www.opten.space`, and any non-HTTPS variants.
- Locked routes must remain as-is because `/welcome`, `/pay`, and `/success` are extension contract paths (`docs/INTEGRATION-CONTRACT.md:153`, `docs/INTEGRATION-CONTRACT.md:166`). Redirects must be additive and must not rename those paths.

**hreflang: reciprocal triplets, x-default, locale codes**

- The manifest defines reciprocal RU/EN/x-default triplets per pair (`scripts/seo-routes.ts:354`, `scripts/seo-routes.ts:387`, `scripts/seo-routes.ts:579`, `scripts/seo-routes.ts:864`), and prerender injects the same three alternates after canonical (`scripts/prerender.mjs:52`, `scripts/prerender.mjs:60`).
- The sitemap repeats these alternates for every route (`scripts/sitemap.mjs:92`). This is correct for current 1:1 RU/EN siblings.
- Locale tags are language-only in `hreflang` (`ru`, `en`) while schema uses regional language codes (`ru-RU`, `en-US`) (`scripts/prerender.mjs:55`, `scripts/seo-routes.ts:105`, `scripts/seo-routes.ts:377`, `scripts/seo-routes.ts:661`). This is valid, but decide whether search targeting should be broad language (`ru`/`en`) or region-specific (`ru-RU`/`en-US`) and keep it consistent in all generators.
- `src/i18n/paths.ts` is currently correct with 8 EN siblings (`src/i18n/paths.ts:9`), but its comments still say "6 routes" (`src/i18n/paths.ts:2`). `CLAUDE.md` and `docs/ARCHITECTURE.md` have the same stale route-count language (`CLAUDE.md:65`, `docs/ARCHITECTURE.md:101`). This is documentation drift, not runtime breakage.

**meta robots / noindex**

- No source-level route robots field exists in `RouteMeta` (`scripts/seo-routes.ts:26`), the base template has no `<meta name="robots">` (`index.html:7`), and `applyMeta` does not inject one (`scripts/prerender.mjs:109`). This means `/success`, `/account`, `/dashboard/download-skill`, and `/api/download-skill` rely on `robots.txt`, not `noindex` headers.
- `/pay` and `/en/pay` are intentionally indexable pricing pages: they are full-prerendered and have Product schema (`scripts/seo-routes.ts:385`, `scripts/seo-routes.ts:397`, `scripts/seo-routes.ts:402`). I would not noindex them unless paid search or support policy changes.
- Legal pages should remain indexable for trust; they are full-prerendered with low priority and yearly changefreq (`scripts/seo-routes.ts:449`, `scripts/seo-routes.ts:476`, `scripts/seo-routes.ts:503`).

**JS-rendering risk on non-prerendered routes**

- `/success`, `/account`, and `/dashboard/download-skill` are present only in the client router (`src/main.tsx:56`, `src/main.tsx:60`, `src/main.tsx:64`) and are intentionally absent from the SSR entry (`scripts/entry-server.tsx:40`).
- Vercel rewrites every non-API path to `/index.html` (`vercel.json:2`). The prerendered root HTML carries a route marker (`scripts/prerender.mjs:150`), and the client wipes mismatched root content only after JavaScript runs (`src/main.tsx:80`, `src/main.tsx:86`).
- Result: a no-JS crawler or link unfurler that fetches `/success` despite robots can see root metadata/content until hydration. This is acceptable for blocked service pages, but add `X-Robots-Tag: noindex, nofollow` headers for these routes to make the intent explicit.

## 2. On-page SEO quality

**title/description: length distribution, uniqueness, keyword targeting**

- All 16 route titles are unique in the manifest (`scripts/seo-routes.ts:359`, `scripts/seo-routes.ts:392`, `scripts/seo-routes.ts:540`, `scripts/seo-routes.ts:642`, `scripts/seo-routes.ts:827`, `scripts/seo-routes.ts:869`). I did not find duplicate title intent in the current route set.
- Descriptions are route-specific and mostly concrete (`scripts/seo-routes.ts:360`, `scripts/seo-routes.ts:393`, `scripts/seo-routes.ts:585`, `scripts/seo-routes.ts:677`, `scripts/seo-routes.ts:870`).
- Fix the `43+` vs `60+` drift before adding pages. Landing metadata says `43+` (`scripts/seo-routes.ts:360`, `scripts/seo-routes.ts:363`, `scripts/seo-routes.ts:643`), Product schema says `43+` (`scripts/seo-routes.ts:223`), while Organization/SoftwareApplication/FAQ/about say 60 or 60+ (`scripts/seo-routes.ts:82`, `scripts/seo-routes.ts:117`, `src/content/landingFaq.ts:27`, `src/content/about.tsx:64`). Pick one public claim and use it everywhere.
- The base `<meta name="keywords">` is static and still lists older model names (`index.html:9`). Search engines mostly ignore it, but it is stale relative to the supported-model copy. Either remove it or generate it from the same source as route metadata.

**heading structure**

- Landing has a single visible `<h1>` in Hero (`src/app/App.tsx:179`) and section headings via `SectionTitle` (`src/app/App.tsx:525`). Nested cards use `<h3>` for steps/features/pricing cards (`src/app/App.tsx:332`, `src/app/App.tsx:380`, `src/app/App.tsx:458`), which is acceptable after section-level `<h2>` headings.
- About, guide, and legal layouts each have a clear `<h1>` and lower-level headings (`src/app/pages/AboutPage.tsx:43`, `src/app/pages/GuidePage.tsx:65`, `src/app/components/layout/LegalLayout.tsx:31`, `src/app/pages/GuidePage.tsx:92`).
- `/pay` is full-prerendered and indexable (`scripts/seo-routes.ts:385`, `scripts/seo-routes.ts:397`), but its visible pricing page uses `<p>` and `<span>` for the main pricing labels rather than a page `<h1>` (`src/app/pages/PayPage.tsx:417`, `src/app/pages/PayPage.tsx:466`, `src/app/pages/PayPage.tsx:512`).
- `/welcome` is also full-prerendered and indexable (`scripts/seo-routes.ts:421`, `scripts/seo-routes.ts:433`), but the body is a carousel plus step copy with no `<h1>` (`src/app/pages/WelcomePage.tsx:53`, `src/app/pages/WelcomePage.tsx:77`). Add a concise first-install heading without changing the locked path.

**image alt text coverage**

- Decorative landing assets correctly use empty alt text in several places (`src/app/App.tsx:183`, `src/app/App.tsx:308`, `src/app/App.tsx:353`).
- Partner logos expose brand-name alt text via `PartnerLogo` (`src/app/App.tsx:266`), and browser icons have explicit alt text (`src/app/App.tsx:80`).
- Product UI screenshots in feature cards currently use empty alt text (`src/app/App.tsx:378`, `src/app/App.tsx:383`). They are partly decorative, but they also show how the extension works; add short descriptive alt text to the most informative screenshots.
- Welcome screenshots all use the same generic `alt="Opten extension"` (`src/app/pages/WelcomePage.tsx:56`, `src/app/pages/WelcomePage.tsx:60`). Give each slide a distinct alt or mark non-active duplicate slides decorative, because four repeated identical alts add noise.

**internal anchor text quality**

- Internal navigation mostly uses `LocalizedLink`, which preserves `/en/*` for sibling routes (`src/app/components/LocalizedLink.tsx:18`, `src/i18n/paths.ts:59`). Landing nav, footer, guide footer, and about/legal links are descriptive enough for the current site size (`src/app/App.tsx:130`, `src/app/App.tsx:513`, `src/app/pages/GuidePage.tsx:137`, `src/app/components/layout/LegalLayout.tsx:46`).
- One deliberate exception is PayPage FAQ, which builds a locale-aware hash URL manually (`src/app/pages/PayPage.tsx:118`, `src/app/pages/PayPage.tsx:394`). This is fine because it targets a page fragment, not a sibling route.

**structured content blocks**

- FAQ coverage is good for the landing and guide because visible FAQ data and JSON-LD share the same source (`src/content/landingFaq.ts:1`, `src/app/components/FaqBlock.tsx:19`, `scripts/seo-routes.ts:381`, `scripts/seo-routes.ts:619`).
- Breadcrumb schema covers pay, welcome, legal, about, and guide routes (`scripts/seo-routes.ts:411`, `scripts/seo-routes.ts:439`, `scripts/seo-routes.ts:565`, `scripts/seo-routes.ts:623`, `scripts/seo-routes.ts:695`).
- Article/TechArticle exists for about and guide pages (`scripts/seo-routes.ts:555`, `scripts/seo-routes.ts:597`, `scripts/seo-routes.ts:840`, `scripts/seo-routes.ts:881`). Legal pages still have visible "updated" text via `LegalLayout` (`src/app/components/layout/LegalLayout.tsx:34`) but only Breadcrumb schema (`scripts/seo-routes.ts:464`, `scripts/seo-routes.ts:491`, `scripts/seo-routes.ts:518`).

## 3. Performance signals for SEO

**LCP candidates**

- The likely landing LCP is text-based: hero `<h1>` uses Unbounded (`src/app/App.tsx:179`), and only Unbounded is preloaded now (`index.html:62`, `index.html:67`). This matches the post-GEO font fix and avoids re-recommending the old PT Root UI preload issue.
- Paddle is no longer loaded site-wide. The template documents route-scoped loading (`index.html:56`), `prerender.mjs` injects the synchronous script only for `/pay` and `/en/pay` (`scripts/prerender.mjs:207`, `scripts/prerender.mjs:284`), and SPA navigation loads it asynchronously through `ensurePaddle` (`src/lib/paddle.ts:49`, `src/lib/paddle.ts:51`). Do not remove the sync script from direct `/pay` hits; it is part of the integration contract (`docs/INTEGRATION-CONTRACT.md:246`).
- `/welcome` loads all four carousel screenshots eagerly (`src/app/pages/WelcomePage.tsx:56`, `src/app/pages/WelcomePage.tsx:63`). Those PNGs are large in the current built asset set, so this route is a likely LCP/network outlier even though it is mostly onboarding.

**CLS sources**

- Font CLS mitigation is in place: PT Root UI uses `font-display: optional` (`src/styles/fonts.css:23`, `src/styles/fonts.css:29`), and the PT Root UI preload was removed from the template (`index.html:62`).
- Most image slots have width/height attributes or fixed layout boxes (`src/app/App.tsx:67`, `src/app/App.tsx:308`, `src/app/pages/WelcomePage.tsx:61`). I did not find an obvious remaining image-dimension CLS issue in the files reviewed.

**INP risks**

- The landing page has modest event handling: menu toggle and hover/links; no large synchronous interaction handlers are visible (`src/app/App.tsx:120`, `src/app/App.tsx:546`).
- PayPage does more work on mount: extension detection, subscription fetch, scroll listener, and Paddle warmup (`src/app/pages/PayPage.tsx:166`, `src/app/pages/PayPage.tsx:181`, `src/app/pages/PayPage.tsx:188`). This is acceptable for a transactional page, but avoid adding more third-party widgets here.
- The Paddle overlay path is guarded and awaited before opening checkout (`src/app/pages/PayPage.tsx:298`, `src/app/pages/PayPage.tsx:303`, `src/app/pages/PayPage.tsx:336`), which avoids interaction-time crashes from a missing SDK.

**bundle size / code-splitting state**

- Client chunking exists: Vite splits React, router, and lucide into manual vendor chunks (`vite.config.ts:33`, `vite.config.ts:36`, `vite.config.ts:38`). Prerender also adds modulepreload and Safari preload fallbacks (`scripts/prerender.mjs:166`, `scripts/prerender.mjs:190`).
- Only the SPA-only service pages are lazy-loaded (`src/main.tsx:22`, `src/main.tsx:23`, `src/main.tsx:24`). Marketing/content routes such as landing, pay, about, and guide are eager imports in `main.tsx` (`src/main.tsx:5`, `src/main.tsx:10`, `src/main.tsx:11`, `src/main.tsx:12`).
- `package.json` still contains a large UI dependency surface (`package.json:10`, `package.json:65`). This is not automatically a shipped-bundle problem because tree-shaking and manual chunks exist, but it warrants a bundle report before adding 100+ pages. I did not run a build per instruction.

## 4. Scale-readiness for 100+ keyword-targeted pages

**a) Programmatic route generation**

Today, route inventory is manually spread across:
- SEO manifest entries (`scripts/seo-routes.ts:349`).
- Client routes (`src/main.tsx:54`, `src/main.tsx:73`).
- SSR routes (`scripts/entry-server.tsx:31`, `scripts/entry-server.tsx:48`).
- EN sibling allow-list (`src/i18n/paths.ts:9`).
- Sitemap source mapping (`scripts/sitemap.mjs:42`).
- llms route grouping (`scripts/llms.mjs:30`).

Smallest viable refactor:
- Keep the current `RouteMeta` shape (`scripts/seo-routes.ts:26`) but move page families into data modules, e.g. `src/content/guides/*.ts`, `src/content/comparisons/*.ts`, `src/content/categories/*.ts`.
- Add `scripts/seo-routes.generated.ts` or a loader that maps content records to `RouteMeta[]`.
- Keep React Router dynamic route params for page families; the guide route is already dynamic (`src/main.tsx:63`, `scripts/entry-server.tsx:39`).
- Prerender should iterate generated records, not hand-written route entries (`scripts/prerender.mjs:274`).
- Replace `PATH_TO_SOURCE` with a `sourceFile` field on each generated route to avoid another manual table (`scripts/sitemap.mjs:42`).

**b) Content + JSON-LD templates**

Existing reusable schema builders are a strong base: `faqPageBlock`, `howToBlock`, `productBlock`, `articleBlock`, `webPageBlock`, and `breadcrumbBlock` (`scripts/seo-routes.ts:171`, `scripts/seo-routes.ts:184`, `scripts/seo-routes.ts:203`, `scripts/seo-routes.ts:281`, `scripts/seo-routes.ts:311`, `scripts/seo-routes.ts:335`).

They are reusable for guides and pricing/comparison pages with small extensions:
- Comparison pages need `ItemList` or a table-backed `WebPage`/`Article` pattern; no current factory emits `ItemList` or `CollectionPage`.
- A `/guides` hub needs `CollectionPage` or `ItemList`; current comments intentionally avoid a non-existent `/guides` index (`scripts/seo-routes.ts:620`, `scripts/seo-routes.ts:904`).
- Video-led pages need `VideoObject`; no current factory emits it.
- `SoftwareApplication.aggregateRating` and `Product.aggregateRating` now exist (`scripts/seo-routes.ts:125`, `scripts/seo-routes.ts:230`), but future rating changes need a real source-of-truth, not hand-edited numbers.
- HowTo is not missing; it already exists and is used on the GPT Image 2 guide (`scripts/seo-routes.ts:184`, `scripts/seo-routes.ts:614`, `scripts/seo-routes.ts:898`).

**c) Duplicate / cannibalization risk**

At 100+ pages, the current architecture would break first in route inventory and intent discipline, not rendering:
- Nothing in `RouteMeta` records target keyword, search intent, canonical cluster, or parent topic (`scripts/seo-routes.ts:26`).
- Titles/descriptions are free text, so overlap is not checked (`scripts/seo-routes.ts:359`, `scripts/seo-routes.ts:642`).
- Guide content has a clear slug and body model (`src/content/guides/gpt-image-2.ts:19`), but no global index of intents or canonical clusters.

Guardrails needed:
- Add `intentId`, `primaryKeyword`, `localeGroupId`, `canonicalPath`, and `sourceFile` fields to generated route records.
- Add a build-time duplicate gate: exact duplicate title/description, same `primaryKeyword` across more than one canonical page, and missing reciprocal locale pair.
- For overlapping intents, canonicalize weaker pages to the stronger hub or comparison page. The current canonical field already supports absolute URL output (`scripts/seo-routes.ts:36`), but it is hand-authored per route.

**d) Internal linking + hreflang at scale**

- Current hreflang is constant-size per route because each route has one RU and one EN sibling (`scripts/seo-routes.ts:29`, `scripts/prerender.mjs:54`). It is not O(n^2) today.
- At scale, do not hand-type alternates. Generate them from `localeGroupId` so each page only emits alternates inside its own locale group.
- Current sitemap emits every route into one file (`scripts/sitemap.mjs:84`) and includes alternates inline (`scripts/sitemap.mjs:92`). For 100-1000 routes, shard by section or locale for operational clarity; for larger growth, use a sitemap index before reaching protocol limits.
- Internal links should come from data too: category hubs, related guides, and comparison pages should render from shared route records instead of hard-coded footer/nav links (`src/app/App.tsx:511`, `src/app/pages/GuidePage.tsx:133`).

## 5. Prioritized action plan

**P0 (<=1 day)**

- Add route-level noindex/X-Robots handling for `/success`, `/account`, `/dashboard/`, and `/api/`. Evidence: these are SPA/service routes (`src/main.tsx:56`, `src/main.tsx:60`, `src/main.tsx:64`), globally rewritten (`vercel.json:2`), and no meta robots is injected (`scripts/prerender.mjs:109`). Effort: 1-2 hours.
- Update or remove stale `public/sitemap.xml` fallback. Evidence: fallback has 6 URLs only (`public/sitemap.xml:3`), while current source/generator expects 16 (`scripts/sitemap.mjs:31`). Effort: 30-60 minutes.
- Add a visible `<h1>` to `/pay` and `/welcome` without changing route names. Evidence: both are full-prerendered (`scripts/seo-routes.ts:397`, `scripts/seo-routes.ts:433`), but page markup starts with section/card/step structures instead of a page heading (`src/app/pages/PayPage.tsx:417`, `src/app/pages/WelcomePage.tsx:53`). Effort: 1-2 hours.
- Reconcile `43+` vs `60+` model claims in route metadata, Product schema, SoftwareApplication, FAQ, and about copy. Evidence: `43+` in metadata/schema (`scripts/seo-routes.ts:360`, `scripts/seo-routes.ts:223`) vs `60+` in entity/content copy (`scripts/seo-routes.ts:82`, `src/content/landingFaq.ts:27`). Effort: 30-60 minutes.
- Add `Disallow: /api/` to every robots block or at least wildcard. Evidence: robots omits `/api/` (`public/robots.txt:1`) and the only API is a gated ZIP endpoint (`api/download-skill.ts:36`). Effort: 20 minutes.

**P1 (1-3 days)**

- Add a route inventory assertion that compares `seo-routes.ts`, `main.tsx`, `entry-server.tsx`, `EN_SIBLINGS`, and sitemap source mapping. Evidence: these inventories are separate today (`scripts/seo-routes.ts:349`, `src/main.tsx:54`, `scripts/entry-server.tsx:31`, `src/i18n/paths.ts:9`, `scripts/sitemap.mjs:42`). Effort: 1 day.
- Decide and document hreflang locale policy: keep `ru`/`en` or switch to `ru-RU`/`en-US`. Evidence: hreflang currently uses short codes (`scripts/prerender.mjs:55`) while schema uses regional codes (`scripts/seo-routes.ts:377`, `scripts/seo-routes.ts:661`). Effort: 2-3 hours.
- Add descriptive alt text for the most useful product screenshots and distinct alt/decorative handling for welcome carousel slides. Evidence: feature screenshots use empty alt (`src/app/App.tsx:378`, `src/app/App.tsx:383`), welcome slides repeat one generic alt (`src/app/pages/WelcomePage.tsx:60`). Effort: 2-4 hours.
- Add Article/WebPage schema with `dateModified` for legal pages, or explicitly decide that Breadcrumb-only legal schema is enough. Evidence: legal pages show update text (`src/app/components/layout/LegalLayout.tsx:34`) but SEO manifest adds only Organization/Breadcrumb blocks (`scripts/seo-routes.ts:464`, `scripts/seo-routes.ts:491`, `scripts/seo-routes.ts:518`). Effort: 0.5-1 day.
- Add repo-level redirect rules for trailing slash and `www` if Vercel project settings do not already enforce them. Evidence: current `vercel.json` has rewrites and headers only (`vercel.json:2`, `vercel.json:5`). Effort: 0.5 day plus deploy verification.
- Add a real 404/NotFound route for unknown URLs instead of relying on unmatched SPA output. Evidence: `Routes` has no catch-all route (`src/main.tsx:53`, `src/main.tsx:74`) and Vercel rewrites all non-API paths to the app (`vercel.json:2`). Effort: 0.5-1 day.

**P2 (strategic / scale-readiness)**

- Move keyword pages to data-driven generation with route records containing slug, locale group, source file, target intent, canonical strategy, and schema inputs. Evidence: current SEO manifest is a hand-written `routes` array (`scripts/seo-routes.ts:349`). Effort: 3-5 days for the first page family.
- Build a `/guides` hub before adding multiple guides. Evidence: current breadcrumbs intentionally avoid `/guides` because it does not exist (`scripts/seo-routes.ts:620`, `scripts/seo-routes.ts:904`). Effort: 1-2 days.
- Add duplicate-intent checks to the build pipeline. Evidence: build already runs route/schema verification scripts (`package.json:7`), so adding a metadata validator fits the existing postbuild pattern. Effort: 1-2 days.
- Create sitemap index/sharded sitemap emitters once page families exist. Evidence: sitemap emitter currently writes one `urlset` (`scripts/sitemap.mjs:84`). Effort: 1-2 days.
- Add content templates for comparison, category, guide, and video-led pages with matching schema factories (`CollectionPage`, `ItemList`, `VideoObject`, and reusable Article variants). Evidence: current factories cover FAQ/HowTo/Product/Article/WebPage/Breadcrumb but not collection or video entities (`scripts/seo-routes.ts:171`, `scripts/seo-routes.ts:335`). Effort: 3-5 days.

## Notes / caveats

- I did not run `npm run build` or any build command, per instruction. I inspected existing `dist/` outputs where useful, but claims in this report are grounded in source files unless explicitly called stale/fallback.
- `public/sitemap.xml` is stale by design relative to the generated `dist/sitemap.xml`: `scripts/sitemap.mjs` overwrites the Vite-copied fallback during the full build (`scripts/sitemap.mjs:3`, `scripts/sitemap.mjs:99`). The risk is only if someone deploys without the full build pipeline.
- I did not verify live Vercel redirects for HTTP, `www`, or trailing slashes. The repo does not declare them in `vercel.json` (`vercel.json:2`).
- Several docs are stale after the Phase 4.1 route expansion: `CLAUDE.md` still describes 14 client routes and 6 EN siblings (`CLAUDE.md:65`), and `docs/ARCHITECTURE.md` still describes 12 prerendered bilingual URLs (`docs/ARCHITECTURE.md:101`). I did not treat docs drift as a technical SEO blocker, but it will mislead future route work.
- I intentionally did not re-recommend shipped GEO items such as founder name correction, YouTube `sameAs`, explicit AI crawler blocks, Product/SoftwareApplication aggregate ratings, Article wrappers for about/guide, WebPage speakable, llms grouping, or the PT Root UI font-display/preload fix. Those are present in source (`scripts/seo-routes.ts:146`, `scripts/seo-routes.ts:163`, `public/robots.txt:15`, `scripts/seo-routes.ts:125`, `scripts/seo-routes.ts:555`, `scripts/seo-routes.ts:607`, `scripts/llms.mjs:35`, `src/styles/fonts.css:29`).
