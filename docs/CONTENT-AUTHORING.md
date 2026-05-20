# Content Authoring Guide — opten.space

> Lock-in for everything that v1.0 (GEO Optimization, 12 → ~72.6 → ~80+ score) +
> the post-v1.0 blog migration taught us. **Read this before adding any new page,
> blog post, image, or section.** Skipping it loses score in measurable ways
> (canonical, hreflang, schema graph, citability, mobile perf — all caught by
> `geo-seo-claude` audit and the build-time gates in [scripts/](../scripts/)).

> The site is small enough that nothing here is auto-generated. Every new
> route/post touches **6 files in sync** (see §1) and **adds one entry to two
> schema graphs**. If you skip a file, the build either fails (`verify-faq-mainentity.mjs`,
> sitemap floor count) or ships silently broken (hreflang/canonical drift).

---

## TL;DR — non-negotiables

When adding ANY new page or post:

1. **One canonical URL.** RU bare path (e.g. `/blog/foo`), EN sibling at `/en/blog/foo`. Both prerender; both carry reciprocal `hreflang` + `<html lang>` baked at build time. **Never** create a route that exists only at runtime — AI crawlers don't execute JS.
2. **First 40-60 words = definitional answer block.** GEO citability lives or dies here. Lead with what/why, not marketing fluff. AI Overviews extract this verbatim.
3. **Locale parity.** RU and EN MUST exist together. If you don't have the EN translation, don't ship the RU yet. Half-translated content tanks hreflang quality and gets demoted by Google.
4. **JSON-LD must mirror the visible DOM.** If schema says `datePublished: 2026-05-18`, the page MUST display that date in a `<time>` element. Schema-vs-body conflicts are an audit auto-fail (root-cause class CR-1).
5. **Images: `/blog/<slug>/cover.jpg` ≥ 1600×900, no in-image text.** No-text means one asset works for RU + EN + OG + visible `<img>` — keeps everything in sync.
6. **Mobile perf is part of SEO.** Every image gets explicit `width`/`height` (no CLS), every `<img>` after the hero gets `loading="lazy"`, every font is `font-display: optional` (see Phase 2.2 / commit `6141a0d`).
7. **Run `npm run build` before commit.** It runs prerender + sitemap + llms.txt + FaqBlock parity check + IndexNow ping. A failing build means a broken contract — fix, don't bypass.

If anything below contradicts these, the rules above win.

---

## 1. The "6 files in sync" rule

The route inventory is hand-listed across 6 files. Phase 6 (scale-ready architecture)
will collapse this into one data model — until then, **every new route updates
all 6 or the build silently drifts**:

| # | File | What you add |
|---|------|--------------|
| 1 | [src/main.tsx](../src/main.tsx) | `<Route path="..." element={<Page />} />` for both RU + EN siblings. EN siblings live after the RU block. Catch-all `<Route path="*" element={<NotFound />} />` MUST stay last. |
| 2 | [scripts/seo-routes.ts](../scripts/seo-routes.ts) | One `RouteMeta` entry per locale. Include `path`, `htmlLang`, `hreflangAlternates` (reciprocal triplet — RU+EN+xDefault), `title`, `description`, `canonical`, `ogTitle`, `ogDescription`, `ogImage` (EN routes set `DEFAULT_OG_IMAGE_EN`; RU leaves undefined to inherit `DEFAULT_OG_IMAGE`), `author` (set `FOUNDER_NAME` on pages with a human byline), `prerender: "full"`, `changefreq`, `priority`, and `schema: SchemaBlock[]` (see §4). |
| 3 | [src/i18n/paths.ts](../src/i18n/paths.ts) | Append the RU canonical path to `EN_SIBLINGS`. This is what `<LocalizedLink>` + `LangSwitcher` use to decide "do I navigate to /en/<path> or flip language in place?" Forgetting this means the LangSwitcher dumps users back on the EN landing. |
| 4 | [scripts/sitemap.mjs](../scripts/sitemap.mjs) | Add both locale entries to `PATH_TO_SOURCE` so `<lastmod>` can be derived from `git log -1 --format=%cI -- <source-file>`. Bump the `if (sitemapRoutes.length < N)` floor at the top by 2 (RU + EN). |
| 5 | [scripts/llms.mjs](../scripts/llms.mjs) | If the path doesn't match an existing `SECTIONS` rule (Marketing / Pricing / Welcome / About / Blog / Legal), add a new section with `match: (p) => …`. Bump the floor check `if (prerenderedRoutes.length < N)` by 2. |
| 6 | [src/i18n/ru.json](../src/i18n/ru.json) + [src/i18n/en.json](../src/i18n/en.json) | Add the dict keys the page uses. Dot-namespaced (`nav.blog`, `about.bio.p1`). RU + EN keys MUST match 1:1 — missing keys fall back to RU then to the key string itself, which is a visible bug. |

If you're adding a **blog post**, also:

| File | What you add |
|------|--------------|
| [src/content/blog/<slug>.ts](../src/content/blog) | `export const post: BlogPost = { ru, en }` per [types.ts](../src/content/blog/types.ts). See §5. |
| [src/content/blog/index.ts](../src/content/blog/index.ts) | Import the post and add it to `blogPostsBySlug`. The barrel sorts newest-first by `ru.publishedAt`. |
| [public/blog/<slug>/cover.jpg](../public/blog) | The cover image, ≥1600×900, no in-image text. |

That's the full list. The build catches several mistakes (sitemap floor, FAQ parity), but it cannot catch a missing EN entry in `EN_SIBLINGS` or a forgotten dict key — those ship silently broken.

### Model pages are the exception (Phase v2.0 — generated, not hand-listed)

The "6 files in sync" rule above is for **marketing + blog pages**. The 62 `/models/<slug>` pages are **generated** and do NOT touch `main.tsx` per-slug, the dict, or `EN_SIBLINGS` manually:

- **Routes:** `src/main.tsx` declares `/models/:slug` and `/en/models/:slug` once (param routes). `scripts/seo-routes.ts` expands every model with content into `RouteMeta` via `buildModelRoute` / `buildModelsHubRoute` — no per-model entry to maintain.
- **EN siblings:** `src/content/models/slugs.ts` (`MODEL_SLUGS_WITH_CONTENT`) feeds `EN_SIBLINGS` automatically. Add a slug here when its `<slug>.ts` content file lands.
- **Content:** one `src/content/models/<slug>.ts` (`ModelContent = { ru, en }`). The Quick-Facts meta comes from the AUTO-GEN `_registry.ts` (parsed from RU `_skills/*.md` by `build-models-registry.mjs`).
- **EN meta:** the registry's free-text meta (name/platform/duration/resolution) is **Russian** — supply English in `src/content/models/metaEn.ts` (resolved by `metaField(meta, field, lang)`). **No build gate enforces this** — run `node scripts/verify-models-content.mjs` to catch Cyrillic leaking onto `/en/*` (it also checks intro length, FAQ count, RU/EN parity).
- **Hub visibility:** general/umbrella models (bare-brand name with versioned siblings) go in `HUB_HIDDEN_SLUGS` (`index.ts`) — hidden from the `/models` grid + ItemList schema, but kept live + sitemap'd.
- **Floors:** `sitemap.mjs` + `llms.mjs` floor is 144 (18 baseline + 2 hubs + 124 model pages). Adding/removing models shifts this.

Full pipeline diagram: [ARCHITECTURE.md](ARCHITECTURE.md) §"Models content pipeline".

---

## 2. Naming and URL design

**URL shape:**
- Lowercase, kebab-case, no trailing slash except `/` and `/en/`.
- RU canonical is unprefixed: `/blog/foo`. EN sibling adds `/en/` prefix: `/en/blog/foo`.
- Slugs are language-neutral. `/blog/gpt-image-2` is the same slug in RU and EN — only the body translates. **Don't translate slugs** — it doubles the URL surface for no SEO benefit and breaks the `<LocalizedLink>` 1:1 mapping.
- Locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/*`) get NO new content layered onto them without an [INTEGRATION-CONTRACT.md](INTEGRATION-CONTRACT.md) check first. The extension binary deep-links here.

**Page-name hierarchy:**
- `<title>` is the search-result line. Keep under 60 chars (gets truncated by Google around 580 pixels). Lead with the primary keyword, end with the brand: `"How to prompt GPT Image 2 — Opten"`.
- `<h1>` is the on-page line. Can be longer, more editorial. It is NOT the title duplicated — that signals thin SEO. Title is for SERP, H1 is for humans.
- `description` is 150-160 chars. Treat it as the answer-block teaser. Google rewrites ~70% of descriptions, but the rewrite is seeded from this text.

---

## 3. The first 40-60 words — the definitional answer block

This is the single biggest GEO lever the site has. AI Overviews / Perplexity / ChatGPT search extract the first 40-60 words verbatim as the "definitional" snippet for the page's primary entity.

**Rules:**
- Lead with **what the thing is**, not why it matters. "GPT Image 2 is OpenAI's thinking image model. It processes the prompt sequentially: what comes first gets the most visual weight." — good. "We're excited to share our 5-step framework…" — bad.
- Mention the **primary entity by canonical name** in the first sentence (e.g. "GPT Image 2", not "OpenAI's latest image model"). AI systems use this string to resolve the page to a knowledge-graph entity.
- Include **the differentiator** in sentence 2-3 (vs Midjourney / Stable Diffusion / etc.). Comparative phrasing gets cited more.
- Keep it **prose**, not a bullet list. Bullets fragment for AI extraction.

The block also doubles as the `<meta name="description">` source. If you write the intro well, you've written the description.

---

## 4. JSON-LD schema graph — what to add where

Every prerendered route emits ≥1 schema block via `route.schema: SchemaBlock[]`.
The graph is built around **`@id` references** (Phase 4 D-10): one canonical
entity per `@id`, other blocks point at it via `*_REF` consts. **Never inline a
duplicate** — Google rejects entity graphs with conflicting properties on the
same `@id`.

**Always include `ORG_BLOCK`** in every route's schema array. It anchors the
entity graph.

**By page type, add:**

| Page type | Required schema blocks | Notes |
|-----------|------------------------|-------|
| Landing (`/`, `/en/`) | `ORG_BLOCK`, `SOFTWARE_APP_BLOCK`, `WEBSITE_BLOCK`, `webPageBlock(speakable: ["h1", ".faq-question", ".faq-answer"])`, `faqPageBlock(landingFaq[lang])` | FAQ items MUST match the visible `<FaqBlock>` 1:1 — enforced by [scripts/verify-faq-mainentity.mjs](../scripts/verify-faq-mainentity.mjs). |
| About-style page (`/about`) | `ORG_BLOCK`, `PERSON_FOUNDER_BLOCK`, `articleBlock({ type: "Article", ... })`, `breadcrumbBlock` | `PERSON_FOUNDER_BLOCK.name` MUST match the visible byline (the audit CR-1 root-cause class — Виктор/Влад conflict). |
| Pricing (`/pay`) | `ORG_BLOCK`, `productBlock([...plans])`, `breadcrumbBlock` | Prices in `productBlock` MUST match the visible cards. `Number()`-strict — non-finite throws at build. |
| Blog hub (`/blog`) | `ORG_BLOCK`, `WEBSITE_BLOCK`, `collectionPageBlock`, `itemListBlock(posts)`, `webPageBlock`, `breadcrumbBlock` | `itemListBlock` points at the **canonical** post URLs only (not legacy `/guides/*`). |
| Blog post (`/blog/:slug`) | `ORG_BLOCK`, `blogPostingBlock`, `webPageBlock(speakable: ["h1", ".blog-intro", "h2"])`, `howToBlock(steps)` if steps present, `faqPageBlock(faq)` if FAQ present, `breadcrumbBlock` | `blogPostingBlock.image` MUST be ≥1200px wide for Rich Results carousel — use the same URL as the visible `<img>` cover. **Do not** inline `articleBody` — Google explicitly does not use it and it inflates payload. |
| Legal | `ORG_BLOCK`, `breadcrumbBlock` | Keep minimal — `noindex`-able if needed. |

**Builders live in [scripts/seo-routes.ts](../scripts/seo-routes.ts):** `faqPageBlock`, `howToBlock`, `productBlock`, `articleBlock`, `webPageBlock`, `breadcrumbBlock`, `collectionPageBlock`, `itemListBlock`, `blogPostingBlock`. Prefer these over inlining raw schema — they enforce `@id` scoping.

**Hreflang vs `inLanguage` policy** (Phase 4.2 P1-3 — don't unify these):
- `hreflang` annotations (in `<head>` + sitemap) use language-only codes: `ru`, `en`, `x-default`.
- Schema-level `inLanguage` uses region-specific: `ru-RU`, `en-US`.
- The mix is intentional. Language-only hreflang targets the broadest audience; region-specific `inLanguage` gives AI systems a precise origin signal.

---

## 5. Blog post anatomy

Every blog post is a single TS file in [src/content/blog/](../src/content/blog/) implementing `BlogPost = { ru, en }` from [types.ts](../src/content/blog/types.ts).

**Required fields per locale:**

| Field | Constraint | Why |
|-------|-----------|-----|
| `slug` | Same string in RU and EN | URL uniformity (§2) |
| `title` | ≤ 60 chars ideal, ≤ 70 hard cap | SERP truncation |
| `excerpt` | 140-180 chars | Card UI + meta description |
| `description` | 150-160 chars | `<meta name="description">` |
| `category` | `"guide" \| "deep-dive" \| "comparison" \| "news"` | Filtering + `articleSection` schema field |
| `tags` | 2-4 from the `BlogTag` union | Filter chips + `keywords` schema field |
| `cover` | `{ src, width, height, alt }` — width ≥1200, ideally 1600×900 | Rich Results carousel + OG |
| `readingTimeMin` | int, calibrated to ~250 RU words/min or ~270 EN | Byline accuracy |
| `publishedAt` + `updatedAt` | ISO `yyyy-mm-dd` | Schema dates — RU/EN MUST be the same date per locale-parity policy |
| `body.intro` | The 40-60-word definitional block (§3) | GEO citability |
| `body.sections?` / `body.steps?` / `body.faq?` | Whichever match the post shape | `steps` → HowTo schema; `faq` → FAQPage schema (mainEntity parity enforced) |

**Body authoring rules:**
- Write **prose, not lists**. The single biggest content trap is writing every step as a 3-bullet list. AI extractors weight prose ~2× over bullets for definitional answers. If you write 5 steps, each step's `body` is a paragraph, not 5 sub-bullets.
- Each `step.title` is the H2 / table-of-contents anchor — make it scannable. The `step.body` is the explanation.
- `before`/`after` strings (when present) are code-fence quoted in the rendered DOM. Use them for prompts, queries, or diff-style comparisons.
- **FAQ items match the FAQPage schema 1:1.** The build runs [verify-faq-mainentity.mjs](../scripts/verify-faq-mainentity.mjs) — if the visible Q/A list and `faqPageBlock.mainEntity` array disagree, the build fails. Edit FAQ in **one place** (the post file); schema rebuilds automatically.
- No more than ~5 FAQ items per page. Google caps FAQ rich result rendering around 5; adding more dilutes the snippet without lifting the SERP feature.

**Locale-parity in practice:**
- RU dates and EN dates are the same (`PUBLISHED` constant shared, see [gpt-image-2.ts:9](../src/content/blog/gpt-image-2.ts)).
- RU `readingTimeMin` and EN `readingTimeMin` are independent — Russian prose runs ~5-10% longer than English for the same content.
- Tags are shared (the `BlogTag` union is locale-agnostic). Categories are shared.

---

## 6. Images

**Where to put them:**
- Per-post asset: `public/blog/<slug>/cover.jpg` + any inline images at `public/blog/<slug>/<name>.<ext>`.
- Site-wide assets: `public/assets/` (existing — Welcome carousel, partner logos, etc.).
- Open Graph default cards: `public/og-card-ru.png` + `public/og-card-en.png` (1200×630). Don't replace these without coordinating with [scripts/seo-routes.ts](../scripts/seo-routes.ts) `DEFAULT_OG_IMAGE` constants.

**Format and size:**
- **Cover images** = JPEG (`/blog/<slug>/cover.jpg`), ≥ 1600×900 (16:9), ≤ 300 KB. JPEG over WebP for covers because Google's Rich Results validator prefers raster for `BlogPosting.image` and `Person.image`.
- **In-body images** that benefit from compression = WebP (`<Picture>` component handles `srcset` + JPEG fallback automatically — see [src/app/components/Picture.tsx](../src/app/components/Picture.tsx)).
- **No in-image text on covers.** One asset must work for RU + EN + OG + visible `<img>`. In-image text forces two assets and breaks locale parity.
- **Founder/Person images** use the 400×400 raster + WebP @1x/@2x pattern. The schema `image` field points at the JPEG; the visible `<picture>` serves WebP variants. See [src/content/about.tsx](../src/content/about.tsx) and the `PERSON_FOUNDER_BLOCK.image` line in [scripts/seo-routes.ts](../scripts/seo-routes.ts).

**Alt text:**
- Every `<img>` and every `BlogImage.alt` is non-empty and describes the *content*, not the file. "Обложка гайда про структурированные промпты для GPT Image 2" — good. "cover image" — bad.
- RU alt and EN alt are independent strings — translate the alt, don't copy it.

**Performance:**
- Every `<img>` carries explicit `width` and `height` attributes — no CLS. `BlogImage.width`/`height` propagate automatically through the renderer. Welcome carousel sizes live in [scripts/img-dims.json](../scripts/img-dims.json).
- Below-the-fold images get `loading="lazy"`. Hero/cover stays eager. See `0f1138f` (Phase 4.2 W4) for the carousel pattern.
- If a new image type appears repeatedly (e.g. screenshots of a generator UI), add it to `<Picture>` not as a one-off `<img>`.

---

## 7. i18n + EN parity

The dict files are the only place strings live. **No literal RU or EN copy inside `.tsx`** — it breaks the LangSwitcher and produces hydration mismatches.

**Dict key rules:**
- Dot-namespaced: `nav.blog`, `blog.empty.title`, `about.bio.p1`.
- Group by surface: keys for `<SiteHeader>` start with `nav.`, footer with `footer.`, hero with `hero.`, FAQ with `faq.`, blog with `blog.`.
- Both dicts MUST have the same set of keys. There's no formal check (yet — Phase 6 candidate); the failure mode is the EN dict silently falling back to RU.

**Components that route language:**
- `useT()` returns the lookup function: `t("nav.blog")`. Use this everywhere.
- `useLang()` returns `{ lang, setLang }`. Use `lang` for branching that the dict can't express (`{lang === 'ru' ? <Foo /> : <Bar />}`) sparingly — most logic should be dict-driven.
- `<LocalizedLink to="/blog">` is the canonical internal link. It preserves the `/en/` prefix when the user is on an EN URL. Bare `<Link>` drops the prefix and was the source of a Phase-3 bug.

**EN-prefixed URL rules:**
- A new page that has an EN sibling MUST appear in `EN_SIBLINGS` (`src/i18n/paths.ts`). Add the **RU canonical path**, not the EN one.
- Locked routes (`/account`, `/success`, `/dashboard/*`) deliberately stay RU-only. On those URLs, the LangSwitcher flips language in storage without navigating — keeps the extension contract intact.

---

## 8. Header / Footer

There is **one header** (`<SiteHeader variant="landing" | "page">`) and **one footer** (`<SiteFooter>`) used on every content surface. They are not optional — the unified hamburger nav is the only place blog/about/FAQ/pricing links surface from non-landing pages.

**When adding a new content page:**

```tsx
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function MyPage() {
  return (
    <>
      <SiteHeader variant="page" />
      <main className="...">{/* content */}</main>
      <SiteFooter />
    </>
  );
}
```

`variant="landing"` is reserved for `App.tsx` — anchors render as `#features` (same-page scroll). `variant="page"` makes anchors render as `/#features` (full-page nav back to landing, then scroll).

**To add a new global nav item** (rare), edit `<SiteHeader>` directly. Don't fork the component. Then add the dict keys (`nav.<key>`) to both ru.json and en.json.

---

## 9. Build-time gates

Running `npm run build` invokes (in order):

1. `vite build` — the SPA bundle.
2. `vite build --ssr scripts/entry-server.tsx` — the SSR bundle.
3. `vite build --ssr scripts/seo-routes.ts` — the route manifest.
4. `node scripts/prerender.mjs` — produces ≥18 prerendered `dist/<route>/index.html` files with per-route `<head>`, JSON-LD, hreflang, `<html lang>`.
5. `node scripts/sitemap.mjs` — emits `dist/sitemap.xml` with per-route `<lastmod>` from git mtime. **Floor check** (`sitemapRoutes.length < 18`) will fail if you forgot to register a route.
6. `node scripts/llms.mjs` — emits `dist/llms.txt` + `dist/llms-full.txt`. Also has a floor check.
7. `node scripts/verify-faq-mainentity.mjs` — asserts visible FAQ DOM ≡ FAQPage `mainEntity` for every route emitting one. Fails the build on drift.
8. `node scripts/indexnow.mjs` — pings Bing IndexNow with the updated URL set. Non-fatal on network failure.

**If the build fails:** read the error. The most common culprit is the sitemap floor count (added a route but forgot a `PATH_TO_SOURCE` entry or the EN sibling). Second-most-common: FAQ items in `landingFaq.ts` diverged from the visible `<FaqBlock>` in `App.tsx`. Third: a new Edge case in `productBlock` (non-finite price string).

**Smoke testing the blog:** `node scripts/smoke-blog.mjs` (requires `npx playwright install chromium` once). Spins up a `python -m http.server` against `dist/` and drives a headless browser through the blog flows asserting JSON-LD types + DOM hooks. Not part of `npm run build` — invoke before any blog-impacting commit.

---

## 10. Things that ARE NOT optimization wins, despite looking like them

Tempting moves that have already been tried and rejected:

- **Lazy-loading the blog list page.** The lazy block in `main.tsx` only covers SuccessPage/AccountPage/DownloadSkillPage — pages that never enter the SSR/hydrate path. Adding `BlogListPage` to that block kills prerender (renderToString can't resolve `React.lazy()`). Phase 2 hotfix `80b16be` is the precedent.
- **Translating slugs** (`/blog/foo` RU, `/blog/foo-en` EN). Doubles URL surface, breaks `EN_SIBLINGS` 1:1 mapping, no SEO upside.
- **Mutating `<html lang>` at runtime.** Phase 3 D-06 — caused hydration mismatch. `<html lang>` is baked per output file at prerender time. Period.
- **Calling `Paddle.Environment.set('production')`.** Throws in Paddle v2 SDK. Only `sandbox` is valid. See INTEGRATION-CONTRACT §6.
- **Re-introducing the `<script src="paddle.js">` tag into root `index.html`.** Re-attaches to every route, undoes the Phase 2.2 perf win. Sync injection only into `dist/pay/index.html` + `dist/en/pay/index.html` via `prerender.mjs#applyPaddleScript`.
- **Adding `aggregateRating` to `SoftwareApplication` or `Product` schema.** Removed Phase 4.2 P0-5 / CONTEXT D-4 — the hardcoded 5.0/2 stars didn't match the live Chrome Web Store. Restore only when ≥10 honest reviews accumulate (a v2 deferred item).
- **Inlining `articleBody` in `BlogPosting` schema.** Google explicitly does not use it. Inflates payload pointlessly.
- **Mass-translating with auto-translate.** EN dict is hand-translated to keep the voice consistent. Auto-translate of marketing copy is detectable by AI Overviews (model self-recognition penalty) and reduces extraction quality.
- **Adding a route that exists only in client-side React.** AI crawlers don't execute JS. Phase 4.2 catch-all `<Route path="*" element={<NotFound />} />` injects `noindex,nofollow` at runtime as a fallback, but the right answer is: prerender or don't ship.

---

## 11. When in doubt, read the precedents

- **[gpt-image-2.ts](../src/content/blog/gpt-image-2.ts)** — the canonical blog post implementation. Copy its shape for new posts.
- **[seo-routes.ts](../scripts/seo-routes.ts)** lines 660-775 — the blog hub + post route entries. Copy these stanzas when registering a new post.
- **[App.tsx](../src/app/App.tsx)** — how the landing wires `<SiteHeader variant="landing">`, `FaqBlock`, and `landingFaq`.
- **[BlogPostPage.tsx](../src/app/pages/BlogPostPage.tsx)** — how a content page consumes a `BlogPost` and renders `body.intro` + sections + steps + FAQ. The `.blog-intro` CSS hook on the intro is what `WebPage.speakable` selects.

When the precedent and this guide disagree, **the precedent wins** — this guide is documentation, the code is the contract. Fix this guide if you find drift.

---

## 12. Quick checklist for new content

For a new blog post (most common):

- [ ] Slug picked (kebab-case, language-neutral).
- [ ] `src/content/blog/<slug>.ts` with RU + EN locales, definitional intro, ≤ 5 FAQ items.
- [ ] `public/blog/<slug>/cover.jpg` ≥ 1600×900, no in-image text, ≤ 300 KB.
- [ ] Slug imported and added to `blogPostsBySlug` in [src/content/blog/index.ts](../src/content/blog/index.ts).
- [ ] Both RU + EN route entries added to [scripts/seo-routes.ts](../scripts/seo-routes.ts) `routes` array — including `blogPostingBlock` with cover dims, `webPageBlock` with speakable selectors, `howToBlock` if `body.steps` is present, `faqPageBlock` if `body.faq` is present, `breadcrumbBlock`.
- [ ] `/blog/<slug>` added to `EN_SIBLINGS` in [src/i18n/paths.ts](../src/i18n/paths.ts).
- [ ] Both `/blog/<slug>` + `/en/blog/<slug>` added to `PATH_TO_SOURCE` in [scripts/sitemap.mjs](../scripts/sitemap.mjs) (pointing at `src/content/blog/<slug>.ts`).
- [ ] Sitemap floor bumped by 2.
- [ ] llms.mjs floor bumped by 2 (or section already matches).
- [ ] Dict keys added if the post intro/UI surfaces any new strings (uncommon for posts — they consume `data.body.*`).
- [ ] `npm run build` passes locally.
- [ ] `node scripts/smoke-blog.mjs` passes (requires Playwright chromium).
- [ ] Commit with `feat(blog): ...` prefix; reference the phase or audit finding if it traces back to one.

For a new top-level page (rare — landing-style addition):

- [ ] Route + component scaffolded with `<SiteHeader variant="page">` + `<SiteFooter>`.
- [ ] All six §1 files updated.
- [ ] Page-type-appropriate schema graph (§4).
- [ ] Definitional first 40-60 words.
- [ ] Both `/path` and `/en/path` ship together.
- [ ] `npm run build` passes.

---

*Last updated: 2026-05-18 — covers v1.0 (GEO Optimization) + post-v1.0 blog migration. Update this file whenever a new content surface introduces a pattern not covered above; that is itself a coupling point worth documenting.*
