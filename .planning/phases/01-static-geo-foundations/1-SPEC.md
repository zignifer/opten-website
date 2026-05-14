---
tags:
  - gsd
  - spec
  - phase
  - geo
kind: phase-spec
phase: 1
milestone: geo-optimization
status: approved
date: 2026-05-14
related:
  - "[[.planning/research/GEO-AUDIT]]"
  - "[[docs/SEO-AUDIT]]"
  - "[[docs/INTEGRATION-CONTRACT]]"
  - "[[.planning/phases/01-static-geo-foundations/1-PLAN|1-PLAN]]"
---

# GEO Phase A — Static GEO Foundations (Design)

**Date:** 2026-05-14
**Status:** Approved for planning
**Source audit:** [[.planning/research/GEO-AUDIT|GEO-AUDIT]]
**Upstream context:** [[docs/SEO-AUDIT|SEO-AUDIT]], [[docs/INTEGRATION-CONTRACT|INTEGRATION-CONTRACT]]
**Next step:** invoke `superpowers:writing-plans` to produce an implementation plan

---

## Goal

Raise opten.space's GEO (Generative Engine Optimization) score from **12/100 → ~30/100** by adding the missing static foundations that AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) and link-preview clients (Telegram, WhatsApp, ChatGPT, Slack) expect — **without touching React or the build pipeline**.

This phase closes 5 of the 5 critical / high-priority audit findings that do not require server-side rendering:

- C-2: missing `robots.txt` / `sitemap.xml` / `llms.txt` (SPA fallback served HTML)
- C-3: zero structured data
- H-1: no `llms.txt`
- H-2: OG image is a 310×310 favicon instead of a 1200×630 hero
- H-5: missing security headers beyond HSTS

Out of scope for this phase: per-route prerender (Phase B), bilingual URLs (Phase C), content surface (Phase D), brand authority work (Phase E).

## Scope decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Scope of this spec | Phase A only | Decoupled from Phase B-E; ships in 1–2 days with zero React risk |
| OG card | Use existing `banner-ru.png` + `banner-eng.png` from `opten-design/Landing/` | Already produced, on-brand, exactly 1200×630 |
| robots.txt strictness | Disallow `/account`, `/success`, `/dashboard/` | Block transactional/private routes only; keep `/pay` open (it is a marketing/pricing surface) |
| llms.txt language | English only | AI-assistant queries are predominantly English; this file's audience is 100% LLMs |
| CSP header | Defer | Conflicts with Paddle inline script; handled as a separate ticket |

## Architecture

Seven discrete changes, all localised. No build-pipeline modifications, no new dependencies, no React changes.

| # | Component | File(s) touched | Type |
|---|---|---|---|
| 1 | robots.txt | `public/robots.txt` (new) | New static |
| 2 | sitemap.xml | `public/sitemap.xml` (new) | New static |
| 3 | llms.txt | `public/llms.txt` (new) | New static |
| 4 | Structured data | `index.html` (edit `<head>`) | Edit |
| 5 | OG hero card | `public/og-card-ru.png` (new, copy of `opten-design/Landing/banner-ru.png`), `public/og-card-en.png` (new, copy of `opten-design/Landing/banner-eng.png`), `index.html` (replace `og:image` + `twitter:image` meta) | New static + edit |
| 6 | Security headers | `vercel.json` (add `headers` block) | Edit |
| 7 | Paddle preconnect | `index.html` (one `<link>` before existing Paddle `<script>`) | Edit |

Vite handles `public/*` by copying verbatim into `dist/`. Vercel serves those files at the matching root paths, which **wins over the SPA-fallback rewrite** because the rewrite is `/((?!api/).*)` — but a real file at `dist/robots.txt` is served as a static asset before the rewrite triggers. This is the core mechanism that fixes C-2.

## Components

### 1. `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: GPTBot
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: ClaudeBot
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: PerplexityBot
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: Google-Extended
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://opten.space/sitemap.xml
```

Rationale for explicit per-bot blocks: redundancy. Some CDN/WAF rules block specific AI bots by default; an explicit `Allow:` block reduces the chance of an upstream filter dropping legitimate AI crawlers.

### 2. `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://opten.space/</loc>        <changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://opten.space/pay</loc>     <changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://opten.space/welcome</loc> <changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://opten.space/privacy</loc> <changefreq>yearly</changefreq> <priority>0.3</priority></url>
  <url><loc>https://opten.space/terms</loc>   <changefreq>yearly</changefreq> <priority>0.3</priority></url>
  <url><loc>https://opten.space/refund</loc>  <changefreq>yearly</changefreq> <priority>0.3</priority></url>
</urlset>
```

Six marketing routes. `/account`, `/success`, `/dashboard/*` deliberately omitted — they are also `Disallow`'d in robots.txt. `lastmod` intentionally omitted in Phase A (would require manual maintenance with no automation yet); can be added in Phase B when prerender produces per-route build metadata.

### 3. `public/llms.txt`

```markdown
# Opten

> Opten is a Chrome extension that scores and improves AI image-generation
> prompts for 43+ models (Midjourney, DALL-E, Stable Diffusion, Flux, etc.)
> directly inside the generator's interface — so users don't waste credits
> on bad prompts.

## How it works

Opten detects which AI image model the user is targeting, scores the
current prompt against that model's optimal patterns, and offers one-click
rewrites. Works inline in 43+ web-based image generators.

## Product

- [Install on Chrome Web Store](https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl)
- [Pricing](https://opten.space/pay) — Free tier + Pro at $2.99/month (199₽)
- [Privacy](https://opten.space/privacy)
- [Terms](https://opten.space/terms)
- [Refund policy](https://opten.space/refund)
```

Follows the [llmstxt.org](https://llmstxt.org) standard: H1 = product name, blockquote summary, plain-markdown sections with link lists.

### 4. Inline JSON-LD in `index.html`

Two `<script type="application/ld+json">` blocks added immediately before `</head>` (after the existing `<meta>` and `<link>` tags, before the Paddle `<script>` tag).

**SoftwareApplication block:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Opten — AI Prompt Scorer",
  "url": "https://opten.space/",
  "applicationCategory": "BrowserApplication",
  "operatingSystem": "Chrome",
  "description": "Chrome extension that scores and improves AI image-generation prompts for 43+ models (Midjourney, DALL-E, Stable Diffusion, Flux, etc.) directly inside the generator's interface.",
  "offers": [
    { "@type": "Offer", "price": "0",    "priceCurrency": "USD", "name": "Free tier" },
    { "@type": "Offer", "price": "2.99", "priceCurrency": "USD", "name": "Pro (monthly)" },
    { "@type": "Offer", "price": "199",  "priceCurrency": "RUB", "name": "Pro (monthly, RU)" }
  ],
  "installUrl": "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl"
}
</script>
```

**Organization block:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Opten",
  "url": "https://opten.space/",
  "logo": "https://opten.space/favicon-192x192.png",
  "sameAs": [
    "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl",
    "https://t.me/v_voronezhtsev"
  ]
}
</script>
```

Pricing values (`199₽`, `$2.99`, `$4.99`, `299₽`) come from [src/i18n/ru.json](../../../src/i18n/ru.json) and must stay in sync if pricing changes. The recurring Pro tier (`pricing.pro.*`) is what the schema represents; the one-time skill download (`pricing.onetime.*`) is intentionally not in the SoftwareApplication offers (it is a separate product surface for Pro users, not the app itself).

If a public LinkedIn / X / GitHub profile for the product exists later, add it to `Organization.sameAs`.

### 5. OG hero card

**File operations:**

- Copy `opten-design/Landing/banner-ru.png` → `public/og-card-ru.png`
- Copy `opten-design/Landing/banner-eng.png` → `public/og-card-en.png`

**`index.html` edits — replace the existing `og:image` and `twitter:image` lines with:**

```html
<meta property="og:image"        content="https://opten.space/og-card-ru.png" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"    content="Opten — улучшай промпты перед генерацией" />
<meta name="twitter:image"       content="https://opten.space/og-card-ru.png" />
```

RU is the static default because `<html lang="ru">` is hardcoded and the dominant audience is RU today. The EN card sits in `public/` ready for Phase B per-route meta to point at it.

### 6. `vercel.json` — security headers

Replace current file:

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy",        "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy",     "value": "camera=(), microphone=(), geolocation=(), payment=(self \"https://*.paddle.com\")" }
      ]
    }
  ],
  "functions": {
    "api/download-skill.ts": {
      "includeFiles": "api/_assets/**"
    }
  }
}
```

`Permissions-Policy` explicitly grants `payment` to `self` + Paddle subdomains because the Paddle overlay checkout requires the Payment Request API. The other features (camera, microphone, geolocation) are unused and disabled.

HSTS is already enforced by Vercel at the domain level; no need to set it in `vercel.json`.

CSP omitted in this phase — it interacts with Paddle's inline script and requires per-source nonce coordination; tracked as a separate ticket.

### 7. Paddle preconnect

In `index.html`, immediately before the existing line:

```html
<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
```

add:

```html
<link rel="preconnect" href="https://cdn.paddle.com" />
```

Saves ~150–300 ms on Paddle's TCP+TLS handshake. Pure performance win, no behaviour change. Note: `crossorigin` deliberately omitted to match the Paddle `<script>`'s CORS posture — adding `crossorigin` would open a separate CORS connection that the script tag's no-cors fetch wouldn't reuse.

## Verification

After each component lands locally, verify before pushing:

1. **`npm run build`** completes without warnings. The new `public/*.txt`, `public/*.xml`, `public/og-card-*.png` files appear in `dist/`.
2. **`npm run preview`** serves the build. Manually fetch:
   - `http://localhost:4173/robots.txt` → returns the plain-text robots file with `Content-Type: text/plain`
   - `http://localhost:4173/sitemap.xml` → returns the XML with `Content-Type: application/xml`
   - `http://localhost:4173/llms.txt` → returns the markdown with `Content-Type: text/plain`
   - `http://localhost:4173/og-card-ru.png` → returns the 1200×630 PNG
3. **View source** of `http://localhost:4173/` — both JSON-LD blocks are present in `<head>`, `og:image` points to `og-card-ru.png`, Paddle preconnect link is before the Paddle `<script>`.
4. **Validate JSON-LD** via [validator.schema.org](https://validator.schema.org/) — paste the rendered HTML, both schemas should parse with no errors.
5. **After Vercel preview deploy:**
   - `curl -I https://<preview-url>/` — confirm the three new headers are present
   - `curl https://<preview-url>/robots.txt` — confirm plain-text response, not the SPA HTML
   - Re-run `~/.claude/skills/geo/scripts/fetch_page.py https://<preview-url>` — `structured_data` should contain two items, `errors` should not include the "client-side only rendering" warning's robots-related sibling.
6. **After production deploy:** re-run `/geo audit https://opten.space`. Expected score uplift from 12 → ~30.

## Risks and mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `vercel.json` JSON syntax error breaks deploy | Low | High (site down) | Test on a Vercel preview deploy before merging |
| OG image URL encoding (em-dash in Chrome Store URL inside JSON-LD) | Low | Low (one schema field) | Use the Schema validator step in Verification |
| Sitemap pointing to a route the SPA can't render | None | n/a | All six listed routes already render today |
| Paddle preconnect benefit lost due to CORS posture mismatch | None | n/a | Spec already omits `crossorigin` to match the script's no-cors mode |

## Open questions (deferred, not blocking)

- **Public social profiles for `Organization.sameAs`** — if a LinkedIn company page / X account / GitHub org exists, add it. Today only Chrome Web Store and the founder's Telegram are confirmed. Not a Phase A blocker.
- **`SoftwareApplication.aggregateRating`** — would require pulling Chrome Web Store rating data. Deferred until the Chrome Store has enough reviews to be useful as a citation signal.
- **`og:image:type`** — `image/png` is the implied default; omitting it is fine.

## Expected impact

Before: GEO score 12/100, AI crawlers see SPA-fallback HTML for robots/sitemap/llms; zero structured data; OG renders as a tiny favicon.

After: GEO score ~30/100. The site has the static foundations that **every** modern AI crawler and link-preview client expects to find. This unlocks the per-route prerender work in Phase B by ensuring crawlers can actually find and traverse the site map.

Re-measure 7–14 days post-deploy (typical crawler refresh interval) via:
- `~/.claude/skills/geo/scripts/fetch_page.py https://opten.space`
- `/geo audit https://opten.space`
- Manual link-share test in Telegram and Slack (visual OG card validation)
