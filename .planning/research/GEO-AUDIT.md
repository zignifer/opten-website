---
tags:
  - gsd
  - research
  - audit
  - geo
kind: audit-report
tool: geo-seo-claude
milestone: geo-optimization
status: complete
date: 2026-05-14
score_before: 12
score_target: 30
related:
  - "[[docs/SEO-AUDIT]]"
  - "[[.planning/phases/01-static-geo-foundations/1-SPEC|1-SPEC]]"
  - "[[.planning/phases/01-static-geo-foundations/1-PLAN|1-PLAN]]"
---

# GEO Audit Report: opten.space

**Audit Date:** 2026-05-14
**URL:** https://opten.space
**Business Type:** SaaS (Chrome extension as product) — bilingual RU/EN
**Pages Analyzed:** 7 (homepage + 6 routes: `/pay`, `/welcome`, `/privacy`, `/terms`, `/refund`, `/account`)
**Tool:** geo-seo-claude skill (5 parallel dimensions, manually orchestrated on Windows)

---

## Executive Summary

**Overall GEO Score: 12/100 (Critical)**

opten.space is a Vite SPA with **no server-side rendering**. Every public route (`/`, `/pay`, `/welcome`, `/privacy`, `/terms`, `/refund`, `/account`) returns the byte-identical `index.html` with **9 words of text content, 0 `<h1>` tags, 0 JSON-LD blocks, 0 internal links**, and an empty `<div id="root">`. To AI crawlers the entire site is one page about "Opten — AI оценка и улучшение промптов для генерации изображений" plus a Paddle script tag. There is nothing to cite, nothing to compare, and nothing to recommend. On top of that, `robots.txt`, `sitemap.xml`, and `llms.txt` do not exist — Vercel's SPA rewrite swallows those paths and serves HTML instead, which is worse than a 404 because crawlers parse the response as an invalid robots file.

The strengths: clean OG/Twitter metadata, HSTS header, Chrome Web Store listing presumably exists. Everything else is a greenfield rebuild.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 5/100 | 25% | 1.25 |
| Brand Authority | 20/100 | 20% | 4.00 |
| Content E-E-A-T | 8/100 | 20% | 1.60 |
| Technical GEO | 12/100 | 15% | 1.80 |
| Schema & Structured Data | 0/100 | 10% | 0.00 |
| Platform Optimization | 25/100 | 10% | 2.50 |
| **Overall GEO Score** | | | **~12 / 100** |

---

## Critical Issues (Fix Immediately)

### C-1. No server-rendered content — entire site is one empty SPA shell

Every route returns the same `<div id="root">` with ~9 words in `<title>` / `<meta>` and nothing in body. `has_ssr_content: false`, `word_count: 9`, `h1_tags: []`, `structured_data: []` confirmed by the geo `fetch_page.py` script on all 7 routes.

**Impact:** GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended do not execute JavaScript reliably. They get the index shell. There is no content to quote.

**Fix:** Static prerender at build time (Vite SSG via `vite-plugin-ssr`, `vite-plugin-pages-strict`, or Vike) — or migrate the marketing surface only (`/`, `/welcome`, `/privacy`, `/terms`, `/refund`) to prerendered HTML. The billing routes (`/pay`, `/account`, `/success`) can stay SPA — they're not for AI citation. Coordinate with the extension contract: prerendered HTML must keep the same DOM identifiers React hydrates against.

### C-2. `robots.txt`, `sitemap.xml`, `llms.txt` all return 200 + the SPA's `index.html`

Confirmed via `curl https://opten.space/robots.txt` → HTML. This is worse than 404: AI crawlers attempt to parse the response as robots/sitemap/llms and get garbage. Some clients may treat the site as "broken robots → don't crawl."

**Fix in [vercel.json](vercel.json):** the rewrite `/((?!api/).*)` swallows these paths. Add explicit static files in `public/` (Vite copies them to dist):

- `public/robots.txt` — allow all major AI crawlers, point to sitemap
- `public/sitemap.xml` — list canonical URLs of the 8 routes
- `public/llms.txt` — high-signal product summary for AI assistants

Vite's static asset handling makes these win over the SPA rewrite once they exist.

### C-3. Zero structured data — no JSON-LD anywhere

`structured_data: []` on every route. No `Organization`, no `SoftwareApplication`, no `Product`, no `FAQPage`, no `BreadcrumbList`.

**Impact:** Google AI Overviews and Perplexity favor entities with rich schema. Without `SoftwareApplication.aggregateRating` + `Offer`, the product is invisible to "best Chrome extensions for AI prompts" style queries.

**Fix:** Inline JSON-LD in `index.html` head (works pre-hydration):

- `SoftwareApplication` (applicationCategory: `BrowserApplication`, operatingSystem: `Chrome`, offers with RUB + USD)
- `Organization` (Opten, sameAs: Chrome Web Store URL + any social)
- `FAQPage` if the landing has FAQ block
- `Product` + `Offer` for Pro tier

### C-4. All 7 routes share one `<title>` / `<meta description>` (RU only)

`/pay`, `/privacy`, `/terms` etc. all inherit `"Opten — AI-оценка и улучшение промптов для генерации изображений"`. AI systems cannot disambiguate the routes; for them this is a single document.

**Fix:** Per-route head management. Two options:
- Runtime: `react-helmet-async` — but doesn't help non-JS crawlers
- **Build-time (preferred):** prerender per route with route-specific `<title>`, description, canonical, OG. Works hand-in-hand with C-1.

### C-5. No language signaling for the EN audience

`<html lang="ru">` hardcoded; `LangContext` flips it post-mount. Crawlers see RU-only markup. No `<link rel="alternate" hreflang>`. The EN funnel is invisible.

**Fix:** Path-prefix strategy `/ru/*` `/en/*` (cleanest), with `/` redirecting based on `navigator.language` only for human visitors. Each prerendered route emits `hreflang` siblings. Keep `/pay`, `/welcome`, `/success` reachable at root for the extension's deep-links — they redirect to the language version after hydration. This is the single highest-leverage SEO+GEO fix.

---

## High Priority Issues

### H-1. No `llms.txt` — emerging standard for AI assistants

The `llms.txt` standard ([llmstxt.org](https://llmstxt.org)) lets a site present a curated summary to AI clients. Once C-2 is fixed, generate one. Suggested structure:

```
# Opten

> Opten is a Chrome extension that scores and improves AI image-generation
> prompts for 43+ models (Midjourney, DALL-E, Stable Diffusion, Flux, etc.)
> directly inside the generator's interface.

## Product
- [Install on Chrome Web Store](https://chromewebstore.google.com/...)
- [Pricing](https://opten.space/pay) — Free + Pro (RUB/USD)
- [Privacy policy](https://opten.space/privacy)

## How it works
- Detects which AI image model the user is targeting
- Scores the current prompt against that model's optimal patterns
- Suggests one-click rewrites
```

### H-2. No OG card — only a 310×310 favicon

`og:image: https://opten.space/favicon-310x310.png`. AI clients that render OG previews (ChatGPT browse, Perplexity card view) get a tiny logo. Replace with a 1200×630 hero card per language.

### H-3. No author / team / "About" page surface for E-E-A-T

The site has zero attributed content. No author bio, no founder name, no team page in HTML output. Even if those exist as React routes, they don't reach the crawler.

**Fix:** Add a prerendered `/about` route with founder name, role, the "why we built this" narrative, and links to LinkedIn / X. This is the biggest E-E-A-T win for a single-person/small-team SaaS.

### H-4. Brand entity confusion — "Opten" collides with two other entities

Disambiguation problem: "Opten" is the name of a Hungarian legal-information database (Opten Kft., established 1991) and an Australian engineering company. AI models trained pre-2026 know those two. Yours is the third with no Wikipedia article and limited public mentions.

**Fix:**
- Use the full name "Opten — AI prompt assistant" consistently in marketing
- Get a Wikipedia stub once notability thresholds are met (Product Hunt launch, press coverage)
- Build Reddit (`r/midjourney`, `r/StableDiffusion`) and YouTube tutorial presence
- Add `Organization.sameAs` schema pointing to all owned profiles

### H-5. No security headers beyond HSTS

`Content-Security-Policy: None`, `X-Frame-Options: None`, `X-Content-Type-Options: None`, `Referrer-Policy: None`, `Permissions-Policy: None`. Google and Perplexity do consider security signals a trust factor.

**Fix:** Add via `vercel.json` headers config:

```json
"headers": [{
  "source": "/(.*)",
  "headers": [
    {"key": "X-Content-Type-Options", "value": "nosniff"},
    {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
    {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"}
  ]
}]
```

CSP is harder because of the Paddle inline script — defer.

---

## Medium Priority Issues

### M-1. No `<link rel="canonical">` — query-string variants will duplicate

`?utm_source=...` and the extension's `?upgrade=skill` parameter will be seen as separate pages. Add canonical per prerendered route.

### M-2. No `<meta name="robots">` per route

Legal pages should be `index, follow`. Transactional (`/pay`, `/account`, `/success`, `/dashboard/*`) should be `noindex, follow` or `noindex, nofollow`. Currently everything is implicitly indexable.

### M-3. No FAQ schema even though landing likely has a FAQ block

Once prerendering exists and a FAQ section is on the landing, add `FAQPage` JSON-LD. This is the single highest-yield schema for AI Overviews ("People also ask" type answers).

### M-4. No HowTo / Tutorial content surface

The product has an obvious teaching surface ("how to write a Midjourney prompt", "how to rescue a bad Stable Diffusion prompt"). A `/guides/*` section of prerendered content with `HowTo` schema is the fastest way to become a cited source for AI image-prompt advice — directly aligned with the product's expertise.

### M-5. No Wikipedia / Reddit / YouTube presence detected

The `brand_scanner.py` script's correlation table:

| Platform | Weight | Status |
|---|---|---|
| YouTube | 25% | No channel detected |
| Reddit | 25% | No active subreddit presence |
| Wikipedia | 20% | No article (likely below notability) |
| LinkedIn | 15% | Unverified |

(The scanner only returns search URLs — manual verification needed.)

---

## Low Priority Issues

- **L-1.** Some favicons are 14 different sizes; modern browsers use 2-3. Trim to reduce HTML weight (~1 KB).
- **L-2.** No `<link rel="preconnect" href="https://cdn.paddle.com">` — Paddle's synchronous script blocks the parser. Preconnect saves ~150-300 ms.
- **L-3.** No `application/manifest+json` Web App Manifest pointing at icons.
- **L-4.** `og:locale: ru_RU` is hardcoded — once EN exists, alternate locales needed.
- **L-5.** No analytics — can't measure GEO improvements after fixes ship. Add Vercel Analytics or Plausible (cookieless, no banner).

---

## Category Deep Dives

### AI Citability (5/100)

What AI quotes is mid-length factual passages (the geo skill cites 134–167 words as the sweet spot, with clear claim + evidence + attribution). opten.space's HTML body is empty until JS runs. Even the `<noscript>` fallback (if any) is not present. Score is non-zero only because `<title>` + `<meta description>` together provide a ~25-word product blurb a model can quote.

**Specific rewrites the geo-citability skill would suggest after prerender lands:**

- Move the H1 / hero copy and the value-prop bullet list from React JSX into prerendered HTML
- Each landing section (problem, solution, models supported, pricing) becomes a quotable 100–200-word block with a clear claim in the first sentence
- Include explicit numbers ("43+ models", "supports Midjourney v6, Flux Pro, DALL-E 3, ...") — AI models prefer factual specifics over adjectives

### Brand Authority (20/100)

Score floor of 20 reflects: (a) the product exists on Chrome Web Store (the canonical authority for "Opten" as a Chrome extension), (b) the domain itself (opten.space) is a clean entity anchor. Floor capped because the brand collides with two pre-existing "Opten" entities (Hungarian legal DB, Australian company) and has no Wikipedia / no detected Reddit threads / no detected YouTube reviews. AI models default to the older more-cited entity when a name is shared.

**Action sequence:**
1. Product Hunt launch — generates first wave of third-party links
2. Reddit AMAs in `r/midjourney`, `r/StableDiffusion`, `r/PromptDesign`
3. 3–5 YouTube tutorial videos with the extension name in title + description
4. Once any of the above hits the bar, push for a Wikipedia stub
5. `Organization.sameAs` schema citing all of the above

### Content E-E-A-T (8/100)

There is no content to evaluate. Author = unknown, Expertise = un-demonstrated, Authority = un-cited, Trust = HSTS only. Privacy and Terms pages exist as routes but return the same blank shell.

**Fix order:**
1. Prerender legal pages (privacy, terms, refund) — Trust signal
2. Add `/about` with founder name, story, contact — Experience + Expertise
3. Add `/guides/*` content surface — Authority over time

### Technical GEO (12/100)

The good: HTTPS with HSTS, 200 responses on all routes, OG/Twitter metadata present, viewport meta, theme-color.

The bad: SPA with no SSR, no robots.txt, no llms.txt, no sitemap.xml, no canonical, hardcoded `lang="ru"`, no security headers beyond HSTS. The SPA-fallback bug (C-2) is the highest-impact item here because it actively confuses crawlers.

**AI crawler access:** Without robots.txt, modern AI crawlers default to "allowed." This is actually neutral for opten.space's case — you want them to crawl. But you also have no way to disallow `/account` or future `/dashboard/*` paths, which you probably should.

Suggested `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://opten.space/sitemap.xml
```

### Schema & Structured Data (0/100)

Zero JSON-LD detected on any of 7 routes. Highest-leverage additions, in order:

1. `SoftwareApplication` on `/` — most direct match for the product
2. `Organization` on every route (in shared head)
3. `Offer` (RUB and USD) on `/pay`
4. `FAQPage` once a landing FAQ exists
5. `BreadcrumbList` once `/guides/*` and per-language URLs exist
6. `HowTo` on each guide

### Platform Optimization (25/100)

The product naturally appears on **one** AI-favored platform: the Chrome Web Store, which Google AI Overviews and Perplexity both cite. Floor is non-zero for that. Beyond that — no YouTube channel, no Reddit thread density, no Wikipedia, no Product Hunt page detected.

Per-platform fit notes:

- **Google AI Overviews:** Will surface the Chrome Web Store listing before opten.space until schema + content arrive. Priority: SoftwareApplication schema + a `/guides/*` content section.
- **ChatGPT Browse / Search:** Cites Reddit-heavy. r/midjourney and r/StableDiffusion AMAs are highest leverage.
- **Perplexity:** Cites docs-style content. A clean `/docs` or `/guides` surface with examples is ideal.
- **Bing Copilot:** Mirrors Bing's index — same fixes as Google.
- **Gemini:** YouTube-leaning. Tutorial videos move this dial faster than written content.

---

## Quick Wins (Implement This Week)

1. **Add `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`** — pure-static, ~30 minutes, removes the SPA-fallback confusion (C-2). Biggest lift-to-effort ratio in the entire audit.
2. **Add JSON-LD `SoftwareApplication` + `Organization` inline in `index.html` head** — visible to crawlers pre-hydration, no React changes. ~1 hour.
3. **Add a proper 1200×630 OG card image** — replace the favicon. ~1 hour for design, drop in `public/og-card.png`, update `index.html`.
4. **Add `<link rel="preconnect" href="https://cdn.paddle.com">`** — shaves Paddle load latency, free.
5. **Add 4 security headers to `vercel.json`** (X-Content-Type-Options, Referrer-Policy, Permissions-Policy, plus HSTS if not already) — ~15 minutes.

These five together would move the score from ~12 to ~30 without touching React.

---

## 30-Day Action Plan

### Week 1: Static GEO foundations (no React changes)

- [ ] Create `public/robots.txt` with explicit AI-crawler allows (resolves C-2)
- [ ] Create `public/sitemap.xml` listing 8 canonical routes (resolves C-2)
- [ ] Create `public/llms.txt` with product summary (resolves H-1)
- [ ] Inline `SoftwareApplication` + `Organization` JSON-LD in `index.html` head (resolves C-3, partial)
- [ ] Replace OG image with 1200×630 card (resolves H-2)
- [ ] Add security headers to `vercel.json` (resolves H-5)
- [ ] Decide per-language URL strategy: `/ru/*` `/en/*` vs subdomain (prerequisite for Week 2)

### Week 2: Per-route metadata + prerender spike

- [ ] Spike: prerender the 5 marketing routes (`/`, `/welcome`, `/privacy`, `/terms`, `/refund`) via `vite-plugin-ssr` or Vike. Keep `/pay`, `/account`, `/success` as SPA.
- [ ] Per-route `<title>` and `<meta description>` (resolves C-4)
- [ ] Per-route `<link rel="canonical">` (resolves M-1)
- [ ] Per-route `<meta name="robots">` — `noindex` on `/pay`, `/account`, `/success`, `/dashboard/*` (resolves M-2)

### Week 3: Bilingual + E-E-A-T

- [ ] Generate `/ru/*` and `/en/*` prerendered variants (resolves C-5)
- [ ] Add `hreflang` siblings on every route
- [ ] Prerendered `/about` page with founder, story, contact (resolves H-3)
- [ ] FAQ section on landing + `FAQPage` JSON-LD (resolves M-3)

### Week 4: Content surface + measurement

- [ ] Spike: `/guides/*` content section — 3 starter posts ("How to write a Midjourney v6 prompt", "Stable Diffusion XL prompt patterns", "DALL-E 3 vs Flux: when to use which") with `HowTo` schema (resolves M-4)
- [ ] Add Vercel Analytics or Plausible (resolves L-5)
- [ ] Search Console + Bing Webmaster verification
- [ ] Product Hunt launch prep (resolves H-4, partial)

---

## Appendix: Pages Analyzed

All 7 routes return the same `index.html` shell. The "issues" column is identical because the SPA-fallback means there are no per-route differences to audit.

| URL | Status | Word Count | SSR | H1 | Schema | Issues |
|---|---|---|---|---|---|---|
| https://opten.space/ | 200 | 9 | false | 0 | 0 | C-1, C-2, C-3, C-4, C-5 |
| https://opten.space/pay | 200 | 9 | false | 0 | 0 | C-1, C-3, C-4, M-2 |
| https://opten.space/welcome | 200 | 9 | false | 0 | 0 | C-1, C-3, C-4 |
| https://opten.space/privacy | 200 | 9 | false | 0 | 0 | C-1, C-3, C-4 |
| https://opten.space/terms | 200 | 9 | false | 0 | 0 | C-1, C-3, C-4 |
| https://opten.space/refund | 200 | 9 | false | 0 | 0 | C-1, C-3, C-4 |
| https://opten.space/account | 200 | 9 | false | 0 | 0 | C-1, C-3, C-4, M-2 |

Also probed (all returned 200 + index.html instead of expected payload):

| Path | Expected | Actual |
|---|---|---|
| /robots.txt | text/plain | text/html (SPA fallback) — C-2 |
| /llms.txt | text/plain | text/html (SPA fallback) — C-2 |
| /sitemap.xml | application/xml | text/html (SPA fallback) — C-2 |
| /sitemap_index.xml | application/xml | text/html (SPA fallback) — C-2 |

---

## Cross-reference

This GEO audit complements the existing [[docs/SEO-AUDIT|SEO-AUDIT]] — the SEO audit covers Google ranking factors, this one covers AI citation. The high-leverage items overlap substantially:

| Issue | SEO-AUDIT.md ref | GEO-AUDIT-REPORT.md ref |
|---|---|---|
| No sitemap.xml / robots.txt | §"Critical gaps" #1, #2 | C-2 |
| No JSON-LD | §"Critical gaps" #6 | C-3 |
| No per-route title/desc | §"Critical gaps" #5 | C-4 |
| No hreflang | §"Critical gaps" #4 | C-5 |
| OG image is favicon | §"Critical gaps" #8 | H-2 |

The GEO audit adds: SSR/prerender priority (C-1), llms.txt (H-1), brand entity disambiguation (H-4), platform-by-platform tactics, and AI-crawler-specific robots.txt blocks.
