# CODEX GEO Review — opten.space

Date: 2026-05-17
Scope: `C:\Projects\opten-website`
Baseline read first: `.planning/research/GEO-AUDIT-2026-05-17.md`
Constraint followed: source code not edited; this report is the only file written.

## Composite GEO Score

Formula: `GEO = Citability*0.25 + Brand*0.20 + EEAT*0.20 + Technical*0.15 + Schema*0.10 + Platform*0.10`

| Dimension | Score | Weight | Weighted |
|---|---:|---:|---:|
| AI Citability | 80 / 100 | 0.25 | 20.0 |
| Brand Authority | 35 / 100 | 0.20 | 7.0 |
| E-E-A-T | 82 / 100 | 0.20 | 16.4 |
| Technical GEO | 88 / 100 | 0.15 | 13.2 |
| Schema | 84 / 100 | 0.10 | 8.4 |
| Platform Optimization | 76 / 100 | 0.10 | 7.6 |
| **Composite GEO** |  |  | **72.6 / 100** |

Diagnostic-only dimension, not part of the formula: Localization & route coverage = 86 / 100.

## Baseline Fixes Already Shipped, Excluded From Recommendations

These were baseline audit findings and are now present in source, so they are not repeated in the action plan:

| Baseline item | Current evidence |
|---|---|
| Founder schema name fixed to Vlad Voronezhtsev | `scripts/seo-routes.ts:49`, `scripts/seo-routes.ts:142`, `scripts/seo-routes.ts:150` |
| Founder YouTube wired into sameAs | `scripts/seo-routes.ts:60`, `scripts/seo-routes.ts:92`, `scripts/seo-routes.ts:163` |
| Organization description/contact/sameAs expanded | `scripts/seo-routes.ts:82`, `scripts/seo-routes.ts:84`, `scripts/seo-routes.ts:92` |
| SoftwareApplication and Product enriched with image/rating/version | `scripts/seo-routes.ts:117`, `scripts/seo-routes.ts:121`, `scripts/seo-routes.ts:125`, `scripts/seo-routes.ts:223`, `scripts/seo-routes.ts:230` |
| Article/TechArticle and speakable WebPage helpers added | `scripts/seo-routes.ts:281`, `scripts/seo-routes.ts:311`, `scripts/seo-routes.ts:328` |
| Guide visible publication date added | `src/app/pages/GuidePage.tsx:71`, `src/app/pages/GuidePage.tsx:72`, `src/app/pages/GuidePage.tsx:77` |
| `/about` EN sibling added | `scripts/seo-routes.ts:820`, `src/i18n/paths.ts:16` |
| Partner logo disclaimer added | `src/app/App.tsx:230`, `src/i18n/ru.json:34`, `src/i18n/en.json:34` |
| Explicit AI crawler robots rules added | `public/robots.txt:16`, `public/robots.txt:26`, `public/robots.txt:36`, `public/robots.txt:66`, `public/robots.txt:96`, `public/robots.txt:146`, `public/robots.txt:156`, `public/robots.txt:168` |
| LCP font preload scope changed and PT Root optionalized | `index.html:62`, `index.html:67`, `src/styles/fonts.css:18`, `src/styles/fonts.css:29` |
| llms About grouping and sitemap per-source lastmod added | `scripts/llms.mjs:35`, `scripts/llms.mjs:37`, `scripts/sitemap.mjs:42`, `scripts/sitemap.mjs:78` |

## 1. AI Citability — 80 / 100

Evidence:

- Landing metadata has concise problem/solution phrasing for RU and EN, but still says `43+ models`: `scripts/seo-routes.ts:360`, `scripts/seo-routes.ts:643`.
- The visible definitional snippet exists but is placed near the footer, after the final CTA: `src/app/App.tsx:509`; text source at `src/i18n/ru.json:32`, `src/i18n/en.json:32`.
- Landing FAQ is visible and schema-backed: `src/app/App.tsx:560`; schema source `scripts/seo-routes.ts:373`.
- The GPT Image 2 guide has a long intro, step list, before/after prompt examples, and FAQ: `src/app/pages/GuidePage.tsx:81`, `src/app/pages/GuidePage.tsx:85`, `src/app/pages/GuidePage.tsx:103`, `src/app/pages/GuidePage.tsx:109`, `src/app/pages/GuidePage.tsx:130`.
- Guide content has concrete, extractable claims and examples: `src/content/guides/gpt-image-2.ts:35`, `src/content/guides/gpt-image-2.ts:58`, `src/content/guides/gpt-image-2.ts:76`, `src/content/guides/gpt-image-2.ts:94`.

Residual risks:

- Model-count inconsistency weakens citation confidence: `60+` in Organization/Software/About/definitional copy (`scripts/seo-routes.ts:82`, `scripts/seo-routes.ts:117`, `src/content/about.tsx:64`, `src/i18n/ru.json:32`) versus `43+` in route meta/Product (`scripts/seo-routes.ts:223`, `scripts/seo-routes.ts:360`, `scripts/seo-routes.ts:643`).
- The strongest answer block is below the page's main conversion content, not adjacent to the H1/subtitle (`src/app/App.tsx:179`, `src/app/App.tsx:185`, `src/app/App.tsx:509`).
- The guide cites official-source provenance only in a code comment, not in visible content: `src/content/guides/gpt-image-2.ts:3`.

Needs live-web verification:

- Confirm actual generated `dist/llms.txt` and `dist/llms-full.txt` content after the next production build.
- Run live ChatGPT/Perplexity/Gemini queries for "What is Opten?", "Who founded Opten?", and "How does Opten work with GPT Image 2?" to measure citation pickup.

## 2. Brand Authority — 35 / 100

Evidence:

- Brand entity now has Organization schema, legalName, description, founder, contactPoint, and sameAs: `scripts/seo-routes.ts:72`, `scripts/seo-routes.ts:82`, `scripts/seo-routes.ts:84`, `scripts/seo-routes.ts:92`.
- Founder entity has name, alternate legal name, jobTitle, description, knowsAbout, worksFor, and sameAs: `scripts/seo-routes.ts:142`, `scripts/seo-routes.ts:150`, `scripts/seo-routes.ts:153`, `scripts/seo-routes.ts:154`, `scripts/seo-routes.ts:163`.
- About page makes founder visible in H1 and exposes Telegram/email contact paths: `src/app/pages/AboutPage.tsx:43`, `src/app/pages/AboutPage.tsx:56`, `src/app/pages/AboutPage.tsx:61`.
- About content contains a founder narrative and legal details: `src/content/about.tsx:32`, `src/content/about.tsx:123`, `src/content/about.tsx:124`.

Residual risks:

- External authority is still mostly self-declared. The repo links Chrome Web Store, Telegram, and founder YouTube, but no LinkedIn, Wikidata, Product Hunt, Habr/vc.ru, Reddit, or AI-directory corroboration is present in schema.
- Founder metrics are strong but external claims: `4 500+ subscribers`, `54 videos`, `7 млн views` at `src/content/about.tsx:34`; EN mirror at `src/content/about.tsx:150`.
- Software/Product aggregateRating is schema-visible but must match a live public source: `scripts/seo-routes.ts:125`, `scripts/seo-routes.ts:128`, `scripts/seo-routes.ts:230`, `scripts/seo-routes.ts:233`.

Needs live-web verification:

- Verify Chrome Web Store rating/review count equals `ratingValue: "5"` and `reviewCount: "2"`.
- Verify YouTube subscriber/video/view counts before relying on them in outreach or schema-linked authority.
- Search web index for `Opten Chrome extension`, `opten.space`, `Влад Воронежцев Opten`, and collision with unrelated `Opten` entities.

## 3. E-E-A-T — 82 / 100

Evidence:

- About page is human-authored/founder-forward, with content extracted into a maintained content file: `src/app/pages/AboutPage.tsx:73`, `src/app/pages/AboutPage.tsx:74`, `src/content/about.tsx:32`.
- The About page includes visible email and Telegram: `src/app/pages/AboutPage.tsx:56`, `src/app/pages/AboutPage.tsx:61`.
- Legal identity and payment setup are visible in content: `src/content/about.tsx:123`, `src/content/about.tsx:124`, `src/content/about.tsx:239`, `src/content/about.tsx:240`.
- The guide states a human-curated provenance in source comments and has authored metadata in schema: `src/content/guides/gpt-image-2.ts:3`, `src/content/guides/gpt-image-2.ts:4`, `scripts/seo-routes.ts:589`, `scripts/seo-routes.ts:597`.
- Guide page renders visible dates: `src/app/pages/GuidePage.tsx:71`, `src/app/pages/GuidePage.tsx:72`, `src/app/pages/GuidePage.tsx:77`.

Residual risks:

- Founder image is still deferred: `scripts/seo-routes.ts:164`; the page uses an initials placeholder: `src/app/pages/AboutPage.tsx:35`, `src/app/pages/AboutPage.tsx:39`.
- Official documentation sources for guide claims are not shown to users, only mentioned in a comment: `src/content/guides/gpt-image-2.ts:3`.
- Several high-trust facts are external claims and should be monitored: YouTube reach (`src/content/about.tsx:34`), Claude Haiku proxy (`src/content/about.tsx:95`, `src/content/about.tsx:211`), pricing/PromptPerfect comparison (`src/content/about.tsx:101`, `src/content/about.tsx:217`).

Needs live-web verification:

- Verify public official docs support GPT Image 2 claims before adding visible source links.
- Verify legal/payment claims against deployed privacy/terms/refund pages and live Paddle/YooKassa copy.

## 4. Technical GEO — 88 / 100

Evidence:

- Build pipeline runs Vite SPA build, SSR entry build, metadata build, prerender, sitemap, llms, and FAQ verification: `package.json:7`.
- Prerender injects per-route canonical, hreflang, locale, JSON-LD, route marker, and body: `scripts/prerender.mjs:109`, `scripts/prerender.mjs:276`, `scripts/prerender.mjs:277`, `scripts/prerender.mjs:280`, `scripts/prerender.mjs:297`.
- Full prerender has a body-length guard: `scripts/prerender.mjs:294`.
- Route count guards exist for sitemap and llms: `scripts/sitemap.mjs:31`, `scripts/llms.mjs:21`.
- Font performance fix is source-visible: `index.html:62`, `index.html:67`, `src/styles/fonts.css:29`, `scripts/prerender.mjs:261`.

Residual risks:

- No Content-Security-Policy is configured in Vercel headers. Existing security headers are limited to `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options`: `vercel.json:7`, `vercel.json:9`, `vercel.json:10`, `vercel.json:11`, `vercel.json:12`.
- SPA rewrite sends every non-API path to `index.html`: `vercel.json:2`; prerender output must be validated on Vercel to ensure static files win before the rewrite.
- No live CWV data was collected in this pass; the prior LCP/CLS issue appears addressed in source but needs production confirmation.

Needs live-web verification:

- Run PageSpeed/CrUX for `https://opten.space/`, `/en/`, `/guides/gpt-image-2`, `/en/guides/gpt-image-2`, `/pay`, `/en/pay`.
- Fetch deployed route HTML and verify canonical, hreflang, JSON-LD, and SSR body are present from the network, not only in source.

## 5. Schema — 84 / 100

Evidence:

- Core graph has Organization, WebSite, SoftwareApplication, Product, Person, BreadcrumbList, FAQPage, HowTo, Article, TechArticle, and WebPage/Speakable helpers: `scripts/seo-routes.ts:72`, `scripts/seo-routes.ts:99`, `scripts/seo-routes.ts:109`, `scripts/seo-routes.ts:203`, `scripts/seo-routes.ts:142`, `scripts/seo-routes.ts:337`, `scripts/seo-routes.ts:169`, `scripts/seo-routes.ts:184`, `scripts/seo-routes.ts:281`, `scripts/seo-routes.ts:311`.
- Landing pages include Org + SoftwareApp + Website + WebPage + FAQ: `scripts/seo-routes.ts:370`, `scripts/seo-routes.ts:371`, `scripts/seo-routes.ts:372`, `scripts/seo-routes.ts:373`.
- Guide pages include TechArticle + WebPage + HowTo + FAQ + Breadcrumb: `scripts/seo-routes.ts:597`, `scripts/seo-routes.ts:607`, `scripts/seo-routes.ts:613`, `scripts/seo-routes.ts:619`, `scripts/seo-routes.ts:622`; EN mirror at `scripts/seo-routes.ts:881`, `scripts/seo-routes.ts:891`, `scripts/seo-routes.ts:897`, `scripts/seo-routes.ts:903`.
- Pricing pages include Product schema with offers: `scripts/seo-routes.ts:404`, `scripts/seo-routes.ts:688`.

Residual risks:

- `aggregateRating` values are hardcoded in both SoftwareApplication and Product and require live public-source parity: `scripts/seo-routes.ts:125`, `scripts/seo-routes.ts:128`, `scripts/seo-routes.ts:230`, `scripts/seo-routes.ts:233`.
- No `/guides` hub exists; breadcrumbs intentionally skip the nonexistent index: `scripts/seo-routes.ts:621`, `scripts/seo-routes.ts:905`.
- There is no schema archetype registry for future page classes; every route hand-assembles schema in one manifest.
- No VideoObject is attached despite founder YouTube being part of authority: `scripts/seo-routes.ts:60`, `src/content/about.tsx:119`, `src/content/about.tsx:235`.

Needs live-web verification:

- Run Google Rich Results Test and Schema.org validator on deployed landing, pricing, about, and guide routes.
- Verify hardcoded rating/review values against Chrome Web Store before production reliance.

## 6. Platform Optimization — 76 / 100

Evidence:

- `robots.txt` explicitly allows major AI/search crawlers while blocking account/success/dashboard surfaces: `public/robots.txt:16`, `public/robots.txt:26`, `public/robots.txt:36`, `public/robots.txt:46`, `public/robots.txt:66`, `public/robots.txt:76`, `public/robots.txt:86`, `public/robots.txt:96`, `public/robots.txt:126`, `public/robots.txt:146`, `public/robots.txt:156`.
- Sitemap is advertised and AI preferences are declared: `public/robots.txt:165`, `public/robots.txt:168`.
- llms generation covers every prerendered route and groups marketing/pricing/welcome/about/guides/legal: `scripts/llms.mjs:18`, `scripts/llms.mjs:31`, `scripts/llms.mjs:37`, `scripts/llms.mjs:38`, `scripts/llms.mjs:40`.
- `llms-full.txt` strips scripts/styles and avoids leaking JSON-LD: `scripts/llms.mjs:68`, `scripts/llms.mjs:69`.

Residual risks:

- No Bing Webmaster verification or IndexNow submission path is present in `index.html`, `public/`, or `scripts/sitemap.mjs`; sitemap only writes XML: `scripts/sitemap.mjs:99`.
- `llms-full.txt` uses a 50 KB cap and drops legal pages when exceeded: `scripts/llms.mjs:145`, `scripts/llms.mjs:147`, `scripts/llms.mjs:157`; this will not scale cleanly to 100+ pages.
- `Content-Signal` is useful as an AI preference declaration but not a substitute for crawler-specific validation: `public/robots.txt:168`.

Needs live-web verification:

- Verify that `https://opten.space/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt` are live and cache-fresh.
- Confirm Bing Webmaster ownership and IndexNow status outside the repo.

## 7. Localization & Route Coverage — 86 / 100

Evidence:

- RU/EN route pairs are present for landing, pay, welcome, privacy, terms, refund, about, and the GPT Image 2 guide: `scripts/seo-routes.ts:352`, `scripts/seo-routes.ts:385`, `scripts/seo-routes.ts:421`, `scripts/seo-routes.ts:449`, `scripts/seo-routes.ts:476`, `scripts/seo-routes.ts:503`, `scripts/seo-routes.ts:533`, `scripts/seo-routes.ts:577`, `scripts/seo-routes.ts:635`, `scripts/seo-routes.ts:669`, `scripts/seo-routes.ts:705`, `scripts/seo-routes.ts:733`, `scripts/seo-routes.ts:761`, `scripts/seo-routes.ts:789`, `scripts/seo-routes.ts:820`, `scripts/seo-routes.ts:862`.
- `EN_SIBLINGS` includes `/about` and `/guides/gpt-image-2`: `src/i18n/paths.ts:9`, `src/i18n/paths.ts:16`, `src/i18n/paths.ts:17`.
- About EN content is populated and founder-approved: `src/content/about.tsx:136`, `src/content/about.tsx:148`.

Residual risks:

- `src/i18n/paths.ts` comment still says EN_SIBLINGS must match "the 6 EN entries", while current source has 8 EN sibling paths: `src/i18n/paths.ts:2`, `src/i18n/paths.ts:9`, `src/i18n/paths.ts:16`, `src/i18n/paths.ts:17`.
- `EN_SIBLINGS` and `scripts/seo-routes.ts` are manually synchronized; no guard checks that all EN siblings in the manifest are represented in path rewriting.
- Locked non-EN routes are intentional, but live crawlers must not index `/en/account`, `/en/success`, or `/en/dashboard` soft fallbacks.

Needs live-web verification:

- Fetch every RU/EN pair and verify reciprocal hreflang triplets on production.
- Verify robots disallow prevents `/en/account`, `/en/success`, and `/en/dashboard/*` from appearing in indexes.

## Scale Readiness For 100+ Pages

### Programmatic citability linting

Current state: one FAQ parity build gate exists (`package.json:7`), but there is no general lint for citation surfaces.

Needed for 100+ pages:

- Add a build-time citability linter that fails routes missing exactly one H1, a 40-80 word answer block, visible `author` when `articleBlock` is present, visible `<time>` when `datePublished` exists, and at least one extractable FAQ or steps/list section for guide pages.
- Add a manifest diff check: every `routes[]` entry with `schema` should be validated against rendered HTML selectors used by `speakable.cssSelector` (`scripts/seo-routes.ts:328`, `scripts/seo-routes.ts:374`, `scripts/seo-routes.ts:608`, `scripts/seo-routes.ts:892`).
- Add a copy consistency rule for core facts: supported model count, prices, founder name, founder links, Chrome Store URL.

### Schema archetype gaps

Current state: schema is hand-assembled per route in `scripts/seo-routes.ts`.

Needed for 100+ pages:

- Define archetypes: `LandingPage`, `PricingPage`, `AboutPage`, `LegalPage`, `GuideArticle`, `GuideHub`, `ComparisonPage`, `ChangelogPage`.
- Each archetype should declare required schema blocks, required visible selectors, required metadata fields, and validation rules.
- Add `CollectionPage`/`ItemList` for `/guides` before publishing a cluster beyond the single GPT Image 2 guide.
- Add `VideoObject` only when a specific embedded or linked video is visible on the page; do not attach the founder channel globally as if every page has a video.

### Duplicate-content risk

Current state: EN translations mirror RU structure closely, which is fine for hreflang but risky for programmatic pages if future templates differ only by model name.

Needed for 100+ pages:

- Require each model guide to include model-specific constraints, official-source citations, examples, and FAQs; reject pages where only the model name changes.
- Keep RU and EN as translation equivalents, but avoid duplicating multiple route aliases for the same language.
- Add canonical/hreflang snapshot tests after prerender so route-pair drift is caught before deploy.

### llms.txt scaling

Current state: all prerendered page bodies are concatenated into one `llms-full.txt` until 50 KB, then legal pages are omitted: `scripts/llms.mjs:145`, `scripts/llms.mjs:147`, `scripts/llms.mjs:157`.

Needed for 100+ pages:

- Keep `llms.txt` as an index only.
- Split full content into section files: `/llms/marketing.txt`, `/llms/guides.txt`, `/llms/legal.txt`, and eventually `/llms/guides/<slug>.txt`.
- Add per-page frontmatter fields: canonical URL, title, language, dateModified, author, schema archetype, summary.
- Add route inclusion/exclusion rules so account/success/dashboard never leak into LLM files.

## Prioritized Action Plan

### P0

| Action | Evidence | Est. GEO lift |
|---|---|---:|
| Normalize supported model count across metadata, Product schema, landing copy, and About content. Pick one canonical number or use "40+" for pricing and "60 skill files" only where that is literally true. | `scripts/seo-routes.ts:82`, `scripts/seo-routes.ts:117`, `scripts/seo-routes.ts:223`, `scripts/seo-routes.ts:360`, `scripts/seo-routes.ts:643`, `src/content/about.tsx:64`, `src/i18n/ru.json:32`, `src/i18n/en.json:32` | +2.5 |
| Verify live Chrome Web Store rating/review count; if not exactly `5` and `2`, update or remove aggregateRating to avoid schema trust loss. | `scripts/seo-routes.ts:125`, `scripts/seo-routes.ts:128`, `scripts/seo-routes.ts:230`, `scripts/seo-routes.ts:233` | +2.0 |
| Add CSP header compatible with Paddle, Supabase, JSON-LD, fonts/images, and extension flows. | `vercel.json:7`, `vercel.json:9`, `vercel.json:10`, `vercel.json:11`, `vercel.json:12` | +1.5 |
| Verify production prerender output after deploy: no SPA-empty body, correct hreflang/canonical/schema on all 16 public routes. | `scripts/prerender.mjs:276`, `scripts/prerender.mjs:277`, `scripts/prerender.mjs:280`, `scripts/prerender.mjs:294`, `scripts/prerender.mjs:297` | +1.0 |

### P1

| Action | Evidence | Est. GEO lift |
|---|---|---:|
| Add a citability build gate for H1, answer block, byline/date parity, visible FAQ/steps, and `speakable` selector existence. | `package.json:7`, `scripts/seo-routes.ts:328`, `src/app/pages/GuidePage.tsx:71`, `src/app/pages/GuidePage.tsx:81`, `src/app/App.tsx:509` | +3.0 |
| Add `/guides` hub with CollectionPage/ItemList before publishing the second guide; restore 3-level breadcrumbs only after the hub exists. | `scripts/seo-routes.ts:621`, `scripts/seo-routes.ts:905`, `scripts/seo-routes.ts:577`, `scripts/seo-routes.ts:862` | +3.0 |
| Split schema creation into archetype builders so 100+ routes cannot drift block-by-block. | `scripts/seo-routes.ts:352`, `scripts/seo-routes.ts:385`, `scripts/seo-routes.ts:533`, `scripts/seo-routes.ts:577`, `scripts/seo-routes.ts:862` | +2.5 |
| Add visible official-source links to guide pages where claims derive from OpenAI Cookbook/fal.ai or other official docs. | `src/content/guides/gpt-image-2.ts:3`, `src/app/pages/GuidePage.tsx:81`, `src/app/pages/GuidePage.tsx:85` | +2.0 |
| Add Bing Webmaster verification and optional IndexNow submission after sitemap generation. | `scripts/sitemap.mjs:99`, `index.html:52` | +2.0 |
| Replace `llms-full.txt` single-file cap with sectioned LLM exports before content exceeds 50 KB. | `scripts/llms.mjs:145`, `scripts/llms.mjs:147`, `scripts/llms.mjs:157`, `scripts/llms.mjs:162`, `scripts/llms.mjs:163` | +2.0 |

### P2

| Action | Evidence | Est. GEO lift |
|---|---|---:|
| Add founder photo asset and Person.image after the image is available and optimized. | `scripts/seo-routes.ts:164`, `src/app/pages/AboutPage.tsx:35`, `src/app/pages/AboutPage.tsx:39` | +1.5 |
| Add VideoObject only on pages with a visible embedded or linked relevant video. | `scripts/seo-routes.ts:60`, `src/content/about.tsx:119`, `src/content/about.tsx:235` | +1.5 |
| Add a route-manifest/path sync check so `EN_SIBLINGS` comments and values cannot drift from `scripts/seo-routes.ts`. | `src/i18n/paths.ts:2`, `src/i18n/paths.ts:9`, `src/i18n/paths.ts:16`, `src/i18n/paths.ts:17`, `scripts/seo-routes.ts:820`, `scripts/seo-routes.ts:862` | +1.0 |
| Add comparison content as a dedicated `/compare/*` or guide archetype rather than burying PromptPerfect comparison inside About. | `src/content/about.tsx:101`, `src/content/about.tsx:217` | +2.0 |

## Brand Authority External Workstream

These are external claims or off-site work items; they cannot be validated from the repo and should be treated as live-web tasks.

| Work item | Purpose | Verification target | Est. GEO lift |
|---|---|---|---:|
| Create Wikidata item for "Opten (Chrome extension)" after there are enough independent sources | Entity disambiguation from unrelated "Opten" brands | Wikidata Q-item with official site, developer, software category, Chrome platform | +6 to +10 |
| Publish 2-3 independent long-form posts from founder on Habr/vc.ru/Medium-style surfaces | External corroboration for founder expertise and product purpose | Indexed pages mentioning Opten, founder, Chrome extension, supported AI generators | +5 to +8 |
| Launch Product Hunt / AI directory listings | SaaS/product discovery and third-party entity anchors | Product Hunt, There Is An AI For That, Futurepedia, Toolify or equivalent live pages | +4 to +7 |
| Add LinkedIn company/founder profile links when real profiles exist | sameAs expansion with business graph signals | LinkedIn URL added to Organization.sameAs / Person.sameAs only after profile is live | +2 to +4 |
| Community seeding with non-promotional examples | Perplexity/ChatGPT citation support from discussions | Reddit/HN/forum posts with practical prompt examples and clear disclosure | +3 to +6 |
| Verify and stabilize Chrome Web Store social proof | Rating/review schema trust | Live CWS rating/review count matching schema values | +2 to +4 |

## External Claims Flagged

| Claim | Source line | Verification required |
|---|---|---|
| Founder YouTube has 4,500+ subscribers, 54 videos, around 7M views/year | `src/content/about.tsx:34`, `src/content/about.tsx:150` | YouTube channel live stats |
| Chrome Web Store rating/review count is 5.0 / 2 | `scripts/seo-routes.ts:125`, `scripts/seo-routes.ts:128`, `scripts/seo-routes.ts:230`, `scripts/seo-routes.ts:233` | Chrome Web Store listing |
| Opten supports 60+ models / 60 skill files | `scripts/seo-routes.ts:82`, `scripts/seo-routes.ts:117`, `src/content/about.tsx:64`, `src/i18n/ru.json:32`, `src/i18n/en.json:32` | Extension repo skill inventory and shipped extension UI |
| Opten works through Claude Haiku 4.5 behind a private Vercel proxy | `src/content/about.tsx:95`, `src/content/about.tsx:211` | Extension/proxy production configuration |
| PromptPerfect comparison and pricing | `src/content/about.tsx:101`, `src/content/about.tsx:217` | Live PromptPerfect pricing |
| GPT Image 2 technical behavior and limits | `src/content/guides/gpt-image-2.ts:35`, `src/content/guides/gpt-image-2.ts:58`, `src/content/guides/gpt-image-2.ts:94`, `src/content/guides/gpt-image-2.ts:168` | Official OpenAI/fal.ai docs or other primary sources |

