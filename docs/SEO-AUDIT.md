# SEO Audit — opten.space

> Baseline audit at planning init (2026-05-14). Use as input for any future
> SEO/marketing milestone. **This is a "what exists / what's missing"
> snapshot** — not a roadmap. Prioritization happens when a milestone opens.

## TL;DR

The site has **basic OG/Twitter tags and favicons**, and that is essentially
all the SEO it has. There is **no sitemap, no robots.txt, no JSON-LD, no
hreflang, no per-page meta, no analytics, and no canonical URL strategy**.
For a product marketed bilingually, the lack of `hreflang` and per-language
URLs is the most expensive single gap.

## What exists today

### `index.html` static tags ([`index.html`](../../index.html))

| Tag | Value | Adequate? |
|-----|-------|-----------|
| `<title>` | "Opten — AI-оценка и улучшение промптов для генерации изображений" | RU only, applied to every route |
| `<meta name="description">` | RU description ~167 chars | RU only |
| `<meta name="keywords">` | "Opten, промпты, AI, нейросети, Midjourney, DALL-E, Stable Diffusion, Flux, генерация изображений, Chrome расширение" | Ignored by Google since 2009 — harmless but unused |
| `<meta name="author">` | "Opten" | Fine |
| `<meta name="theme-color">` | `#000000` | Fine |
| `<meta property="og:*">` | Set: url, title, description, image (`favicon-310x310.png`), locale (`ru_RU`), site_name | Image is just a 310×310 favicon, not a proper OG card (1200×630 recommended). Locale is hardcoded RU. |
| `<meta name="twitter:*">` | card=summary_large_image, title, description, image | Same image limitation |
| `<link rel="icon">` etc. | 14 favicon sizes | More than needed, but no real issue |
| `<html lang="ru">` | Hardcoded RU | EN users get RU `lang` on first paint, then JS flips it. Bad for SEO of EN audience. |
| Paddle.js script | Synchronous `<script src="cdn.paddle.com/...">` | Functional necessity (see INTEGRATION-CONTRACT §6). Has perf cost — blocks parser. Mitigation: `preconnect` to `cdn.paddle.com`. |

### `vercel.json` ([`vercel.json`](../../vercel.json))

- SPA rewrite present.
- No cache headers, no security headers, no `cleanUrls`, no `trailingSlash`. **Default Vercel behavior applies** (e.g. no `Cache-Control` for HTML).

### Runtime

- `<html lang>` is updated client-side by `LangContext` (`document.documentElement.lang`).
- `<title>` and `<meta>` are **not** updated per route or per language.

## What's missing

### Critical gaps (every SEO milestone should address)

1. **No `sitemap.xml`.** Google has no map of the 8 routes. Easy win.
2. **No `robots.txt`.** Crawlers infer "all allowed," which is fine but you can't disallow `/dashboard/*` or `/api/*` cleanly. Worth adding.
3. **No `<link rel="canonical">`.** Without it, query-string variants (`?utm_source=...`, `?upgrade=skill`) can be indexed as duplicates.
4. **No `<link rel="alternate" hreflang>`.** RU and EN serve from the same URL — Google cannot route users to the right language. This is the biggest single SEO loss for the EN funnel.
5. **No per-route `<title>` / `<meta description>`.** `/pay`, `/account`, `/privacy` etc. all inherit the landing's RU title. Either implement per-route head management (e.g. `react-helmet-async`) or generate static prerenders.
6. **No JSON-LD structured data.**
   - `SoftwareApplication` schema for the product (with `aggregateRating`, `offers`, `applicationCategory: BrowserExtension`)
   - `Organization` schema for Opten
   - `BreadcrumbList` for nested routes
   - `FAQPage` for any FAQ block on the landing
   - `Product` + `Offer` for Pro pricing
7. **No per-language URL strategy.** Options: `/ru/` `/en/` path prefixes (cleanest), `?lang=` (worst), or subdomain (`ru.opten.space` — adds DNS+SSL overhead). Path prefix is recommended.
8. **OG image is a 310×310 favicon.** Replace with a 1200×630 card (one per language ideally).

### Performance / Core Web Vitals (matters for SEO)

9. **Paddle script blocks the parser.** Synchronous `<script>` in `<head>`. Required for `window.Paddle` availability (see INTEGRATION-CONTRACT §6) — cannot be `async`. **Mitigation:** `<link rel="preconnect" href="https://cdn.paddle.com">` and consider deferring its `Initialize` call.
10. **No image optimization strategy.** `public/assets/` has multi-MB PNGs (`welcome-*-N.png`). No WebP fallback strategy, no `<img loading="lazy">` audit.
11. **No font-loading strategy documented.** Check `src/styles/fonts.css` — does it use `font-display: swap`? Custom fonts can cause CLS.
12. **No bundle analysis.** Heavy UI surface (Radix + MUI + Lucide + react-slick + embla) likely produces a large JS payload. `vite-bundle-visualizer` would tell.

### Monitoring / measurement

13. **No analytics.** No GA4, no Plausible, no PostHog, no Vercel Analytics. Conversion funnel from landing → install → pay is invisible.
14. **No Search Console verification.** No `<meta name="google-site-verification">` in `index.html`. Likely no SC property at all.
15. **No error monitoring.** No Sentry / Bugsnag / LogRocket. Issues like Paddle failing to load are only visible in the user's console.

### Content / metadata gaps

16. **Single description, both languages.** `meta description` is RU-only.
17. **No structured pricing for international.** `/pay` displays RUB or USD client-side based on lang detection — but the rendered HTML at SSR is always RU. EN visitors land on RU markup, see flash-of-Russian, then re-render.
18. **No `<meta name="robots">` per route.** Legal pages (`/privacy`, `/terms`, `/refund`) should be indexed; transactional pages (`/account`, `/dashboard/*`, `/pay`, `/success`) probably should NOT be (or at least not crawled).
19. **404 page absent or unconfigured.** Vercel's rewrite sends everything to `index.html`, which renders React's lack-of-match (probably a blank landing or a router fallback). A real 404 page with sensible content is missing.

### Privacy / compliance touch-points (interact with SEO)

20. **No cookie banner.** Likely fine right now (no analytics cookies set) but blocks adding GA without redoing this.
21. **No referrer policy** (`<meta name="referrer">`).
22. **No CSP headers.** Not strictly SEO, but security headers are a ranking signal Google has stated they consider.

## Likely fix shape (preview only — for a future milestone)

When a SEO milestone is opened, a reasonable phase split:

- **Phase A — SEO foundation (static):** sitemap.xml, robots.txt, per-language URL paths (`/ru/`, `/en/`), per-route titles/descriptions, hreflang, canonical, OG card images. Pure infrastructure, no design risk.
- **Phase B — Structured data:** SoftwareApplication / Organization / Product JSON-LD. Pure additive HTML.
- **Phase C — Performance:** Paddle preconnect, image optimization, font-display audit, bundle analysis, Lighthouse pass.
- **Phase D — Measurement:** Vercel Analytics or Plausible (privacy-friendly, no banner needed), Search Console verification, optional Sentry.

The hard prerequisite for phases A–B is deciding the **per-language URL strategy**. That decision lives in the [INTEGRATION-CONTRACT.md](../INTEGRATION-CONTRACT.md) territory only if it affects the `/welcome`, `/pay`, `/success` routes the extension navigates to — those routes must keep responding at their existing paths regardless of new lang-prefixed paths (e.g. `/pay` continues to work; `/ru/pay` and `/en/pay` are additions, not replacements).

## Files where SEO logic will land

When implemented, expect changes in:

- [`index.html`](../../index.html) — base meta, OG, preconnect, canonical (or removal of static OG in favor of per-route)
- [`src/main.tsx`](../../src/main.tsx) — possibly add a `<HelmetProvider>` or equivalent
- New: `public/sitemap.xml`, `public/robots.txt`
- New: `src/components/SEO.tsx` (or similar) — per-route head management
- [`vercel.json`](../../vercel.json) — headers (caching, security), possibly redirects for legacy URLs
- New per-language route components or a shared layout — TBD by URL strategy decision

## Files that should NOT be touched

- Routes `/welcome`, `/pay`, `/success` — locked per INTEGRATION-CONTRACT §3. Add `/ru/welcome` etc. **alongside**, don't rename.
- `EXTENSION_IDS` arrays in PayPage/AccountPage/DownloadSkillPage — see INTEGRATION-CONTRACT §2.2.
- Hardcoded `SUPABASE_URL` / `SUPABASE_ANON_KEY` — see INTEGRATION-CONTRACT §4.
