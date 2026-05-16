---
tags:
  - gsd
  - geo
  - audit
audit_date: 2026-05-17
url: https://opten.space
business_type: SaaS (browser extension, freemium, bilingual)
pages_analyzed: 12 (6 RU + 6 EN prerendered)
baseline_pre_phase_1: 12/100
baseline_post_phase_1: ~30/100
score: 48/100
rating: Poor → Fair boundary
---

# GEO Audit Report — opten.space (Post-Phase-3)

**Audit date:** 2026-05-17
**URL:** https://opten.space
**Business type:** SaaS — Chrome extension (Opten / AI prompt scorer), freemium with RUB + USD billing surfaces
**Pages analyzed:** 12 (6 RU + 6 EN prerendered)
**Baseline pre-Phase-1:** 12/100 → **Post-Phase-3: 48/100** (+36, +300% relative)

---

## Executive Summary

**Overall GEO Score: 48/100 (Poor → Fair boundary)**

Three phases of work (`Phase 1` static GEO foundations, `Phase 2` per-route prerender + perf, `Phase 3` bilingual routing) moved the score from **12 → 48** — material progress on the technical foundation, but two anchors are dragging the composite down:

- **Brand Authority: 8/100.** Zero Wikipedia/Wikidata entity, zero Reddit/YouTube discussion, no third-party review surface, no listicle inclusion. AI models cannot link "Opten" to any external signal.
- **Schema: 8/100.** No JSON-LD shipped anywhere — no Organization, no SoftwareApplication, no FAQPage. Site has substantive content but presents itself to AI crawlers as a flat document.

Strengths: prerender + robots.txt + sitemap + hreflang baseline is genuinely solid (Technical 82, Citability 68). The site is **technically discoverable**, just **entity-invisible** off-domain and **structurally opaque** on-domain.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 68/100 | 25% | 17.0 |
| Brand Authority | 8/100 | 20% | 1.6 |
| Content E-E-A-T | 58/100 | 20% | 11.6 |
| Technical GEO | 82/100 | 15% | 12.3 |
| Schema & Structured Data | 8/100 | 10% | 0.8 |
| Platform Optimization | 42/100 | 10% | 4.2 |
| **Overall GEO Score** | | | **48/100** |

### Trajectory

| Snapshot | Score | Δ | Trigger |
|---|---|---|---|
| Pre-launch (audit-1) | 12 | — | initial audit |
| Post-Phase-1 (2026-05-14) | ~30 | +18 | static foundations (robots.txt, sitemap.xml, OG cards, canonical) |
| Post-Phase-2 (2026-05-15) | ~38–40 | +8–10 | per-route prerender + metadata (estimated, not re-measured) |
| **Post-Phase-3 (2026-05-17)** | **48** | **+8–10** | bilingual routing (12 prerendered routes, hreflang triplets, per-route lang) |

Phase 4 (content surface + FAQ schema + JSON-LD bundle) is the next major lift; conservative estimate **+15–25 points → ~65–73**.

---

## Critical Issues (Fix Immediately)

1. **No JSON-LD on any page.** Inject `Organization` + `SoftwareApplication` + `WebSite` schema into prerendered HTML for `/` and `/en/` (lifts AI Overviews, ChatGPT, Gemini, Bing in one PR). Snippet skeletons in §Schema below.
2. **Brand has zero off-domain signal.** Wikipedia/Wikidata, Reddit, YouTube, Product Hunt, listicles — all empty. Authority work is the single biggest unlock.

## High Priority

3. **No FAQ schema or Q&A blocks.** Phase 4 plans this; ship 5–8 Q&A pairs + `FAQPage` JSON-LD on `/` and `/en/`. Primary AI Overviews + Perplexity extraction lever.
4. **`/pay` and `/en/pay` ship near-empty SSR.** Title + canonical + hreflang, then SPA shell. Prerender plan names, prices, currencies, and feature bullets as static HTML — both for AI extraction AND for the broken hero/copy that currently relies on JS.
5. **No `llms.txt` / `llms-full.txt`.** Create `/llms.txt` at domain root (H1, blockquote summary, sections for Product / Pricing / Onboarding / Legal, links to 12 sitemap URLs).
6. **No bylined author / founder presence.** Add a short founder section with link to operator's LinkedIn/Telegram — adds Experience + Expertise dimensions simultaneously.
7. **LCP 3.3 s on mobile** (above Google's 2.5 s "good" threshold despite 91–92 perf score). Add `fetchpriority="high"` + `<link rel="preload" as="image">` for the hero image; confirm WebP delivered at intrinsic mobile width.
8. **CSP header missing on billing site.** Add via `vercel.json` with explicit Paddle + Supabase allowances.

## Medium Priority

9. **"Save 30–50% on credits" claim is unsourced.** Publish a one-page methodology with before/after prompt examples and token math — converts marketing claim into citable data.
10. **No Chrome Web Store rating embed.** Surface CWS stars + review count + 2–3 quoted reviews on `/` and `/en/`. Cheapest authoritativeness lift.
11. **Hero is slogan-style not answer-block style.** Add one-paragraph definition under H1 ("Opten is a Chrome extension that…") for AI extraction.
12. **No content hub (blog / guides / model-specific pages).** Ship 5–10 evergreen pages for topical authority.
13. **Homepage CLS 0.057 on mobile RU** (EN is 0). Audit RU hero block for missing dimensions or webfont reflow.
14. **No `X-Frame-Options` / CSP `frame-ancestors`** on `/pay` / `/account` (clickjacking surface).

## Low Priority

15. **No `Content-Signal:` directive** in robots.txt (IETF draft) — declares AI consent explicitly.
16. **No explicit `meta robots`** on prerendered pages (default behavior fine, but explicit `index,follow,max-image-preview:large` helps AI Overview thumbnails).
17. **Cache-Control: must-revalidate** on prerendered HTML — could safely `s-maxage=300` on Vercel CDN.

---

## Category Deep Dives

### AI Citability (68/100)

Solid content density and hierarchy. Privacy policy is the citability champion (12 H2 sections, named sub-processors, exact JWT/TLS detail — non-template). Hero copy is the weakest passage (slogan, not answer-shaped). `/pay` and `/en/pay` are nearly empty for SSR-only crawlers.

Top citation-ready passages:
1. Privacy "we do not store prompts / transmitted through secure API" — ~82
2. Pricing facts "$2.99/mo, 199₽, 300 generations/month" — ~78
3. "43 models supported (Midjourney, DALL·E, Flux, Stable Diffusion)" — ~76
4. Welcome 4-step onboarding (numbered, self-contained) — ~72
5. "Users save 30–50% on generation credits" — ~70 (but unsourced — see Medium #9)

### Brand Authority (8/100) — **dominant drag**

| Signal | Status |
|---|---|
| Wikipedia article | None (`/wiki/Opten` → 404) |
| Wikidata Q-item | None |
| Reddit threads | None (`site:reddit.com "Opten"` → 0) |
| YouTube reviews | None |
| Listicle inclusions (SpacePrompts, rightclickprompt, sushilprompt) | None |
| Product Hunt launch | None |
| G2 / Capterra / Trustpilot | None |
| Chrome Web Store reviews surfaced | Unknown / not surfaced |
| LinkedIn company page | Not detected |

This is the single highest-leverage area for improvement and the most expensive — it requires sustained off-domain work, not code.

### Content E-E-A-T (58/100)

| Dim | Score |
|---|---|
| Experience | 13/25 — walkthroughs exist; "30–50% savings" is unsourced |
| Expertise | 12/25 — strong product depth (43 models), no author bios |
| Authoritativeness | 14/25 — partner-logo association strong; no press/reviews |
| Trustworthiness | 19/25 — **strong** legal disclosure (dual-operator, named sub-processors, FZ-152 + GDPR) |

Content is genuinely human-written (Russian idiom, named amounts, specific competitors). Bilingual parity strong, copy localized (not machine-translated).

### Technical GEO (82/100) — **best category**

Prerender + robots.txt + sitemap + hreflang reciprocity all clean. Mobile baseline 91 RU / 92 EN, CLS 0 on EN. The 18-point gap is split between LCP (3.3 s mobile), missing CSP/X-Frame-Options on billing surface, and the borderline RU homepage CLS (0.057).

### Schema & Structured Data (8/100)

Zero JSON-LD shipped. Functional OG/Twitter metadata is the only structural signal — that's the 8 points. Six priority schema additions detailed in §Phase 4 Schema Plan below.

### Platform Optimization (42/100)

| Platform | Score | Status |
|---|---|---|
| Google AI Overviews | 38/100 | Poor (no FAQ schema, no answer paragraphs) |
| ChatGPT Web Search | 48/100 | Fair (GPTBot allowed, no entity graph) |
| Perplexity AI | 35/100 | Poor (no Reddit/forum surface) |
| Google Gemini | 40/100 | Poor (no Knowledge Graph entity) |
| Bing Copilot | 50/100 | Fair (open robots, freemium fits Copilot bias) |

Cross-platform unlock: JSON-LD bundle lifts AIO+ChatGPT+Gemini+Bing in one PR. Real `/llms.txt` lifts ChatGPT+Perplexity+Claude. Product Hunt + Reddit launch is the single highest-leverage external action.

---

## Phase 4 Schema Plan (concrete snippets)

Inject these JSON-LD blocks into the prerender pipeline (`scripts/prerender.mjs`) so they land in initial HTML, not via React after hydration. AI crawlers do NOT execute JS.

**1. Organization (every page, `<head>`)**

```json
{"@context":"https://schema.org","@type":"Organization","@id":"https://opten.space/#org",
"name":"Opten","legalName":"ИП Воронежцев В.П.","url":"https://opten.space/",
"logo":"https://opten.space/favicon-512x512.png",
"description":"AI prompt scoring and improvement for 43+ image generation models.",
"founder":{"@type":"Person","name":"Воронежцев В.П."},
"sameAs":["https://chromewebstore.google.com/detail/iphkppgbobpilmphloffcalicmejacfl"]}
```

**2. SoftwareApplication (`/` and `/en/`)**

```json
{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Opten",
"applicationCategory":"BrowserApplication","operatingSystem":"Chrome",
"url":"https://opten.space/",
"downloadUrl":"https://chromewebstore.google.com/detail/iphkppgbobpilmphloffcalicmejacfl",
"publisher":{"@id":"https://opten.space/#org"},
"offers":[
 {"@type":"Offer","price":"0","priceCurrency":"USD","category":"Free"},
 {"@type":"Offer","price":"2.99","priceCurrency":"USD","category":"subscription","name":"Pro Monthly"},
 {"@type":"Offer","price":"199","priceCurrency":"RUB","category":"subscription","name":"Pro Monthly (RU)"}]}
```

**3. WebSite + inLanguage (root)**

```json
{"@context":"https://schema.org","@type":"WebSite","@id":"https://opten.space/#website",
"url":"https://opten.space/","name":"Opten","inLanguage":["ru-RU","en-US"],
"publisher":{"@id":"https://opten.space/#org"}}
```

**4. Product + Offer (`/pay` — currently empty SSR)**

```json
{"@context":"https://schema.org","@type":"Product","name":"Opten Pro",
"description":"300 prompt checks/month, one-click improvement for 43+ AI image models.",
"brand":{"@id":"https://opten.space/#org"},
"offers":[
 {"@type":"Offer","price":"199","priceCurrency":"RUB","url":"https://opten.space/pay",
  "availability":"https://schema.org/InStock"},
 {"@type":"Offer","price":"2.99","priceCurrency":"USD","url":"https://opten.space/pay",
  "availability":"https://schema.org/InStock"}]}
```

**5. FAQPage (`/` and `/en/`)** — see Phase 4 plan for the full 5–8 Q&A set.

**6. BreadcrumbList (`/pay`, `/welcome`, legal pages)** — cheap GEO win.

Use `@id` cross-references so blocks form a connected graph rather than isolated islands. Validate at `validator.schema.org` and `search.google.com/test/rich-results` after shipping.

---

## Quick Wins (This Week, code-only)

1. **Inject 3 JSON-LD blocks** (`Organization` + `SoftwareApplication` + `WebSite`) into `scripts/prerender.mjs`. Lifts Schema 8 → ~55, Platform 42 → ~55. **Estimated +9 points to composite.**
2. **Create `/public/llms.txt`** (static file, 30 lines). Lifts AI Visibility component, helps ChatGPT/Perplexity. **+2 points.**
3. **Add `fetchpriority="high"` + preload for hero image** in prerender. Lifts Technical (LCP fix). **+1 point.**
4. **CSP + X-Frame-Options headers** in `vercel.json`. Lifts Technical security. **+1 point.**
5. **Add `meta robots` + `Content-Signal:` directive.** Cosmetic; **+0.5 point.**

**Total quick-win estimate: 48 → 60 (+12)** in one development session.

---

## 30-Day Action Plan

### Week 1 — Schema + llms.txt (code, no design)
- [ ] Add JSON-LD prerender helper to `scripts/prerender.mjs` (Organization + SoftwareApplication + WebSite)
- [ ] Create `/public/llms.txt` static file
- [ ] Generate `/llms-full.txt` from prerendered HTML at build time
- [ ] CSP + X-Frame-Options + Content-Signal in `vercel.json`
- [ ] Hero `fetchpriority="high"` + preload tag

### Week 2 — `/pay` content + FAQ
- [ ] Prerender plan names / prices / feature bullets on `/pay` and `/en/pay`
- [ ] Add 5–8 Q&A pairs to `/` and `/en/` with `FAQPage` JSON-LD
- [ ] Add 1-paragraph definition block under H1 ("Opten is a Chrome extension that…")
- [ ] Add `BreadcrumbList` schema to non-root pages
- [ ] Surface Chrome Web Store rating + review count on `/` and `/en/`

### Week 3 — Brand surface (off-domain)
- [ ] Submit Wikidata Q-item for "Opten (browser extension)"
- [ ] Product Hunt launch
- [ ] Reddit launch: r/ChatGPTPro, r/midjourney, r/StableDiffusion (1 authentic "build-in-public" post each)
- [ ] LinkedIn company page + 3 weekly posts
- [ ] Outreach to 3 listicle authors (SpacePrompts, rightclickprompt, sushilprompt)
- [ ] Founder section on `/` linking to LinkedIn/Telegram

### Week 4 — Content depth + measurement
- [ ] 2-3 short demo videos (60–90s) on YouTube — Syntx, Higgsfield, Freepik flows
- [ ] One-page "How we measure 30–50% savings" methodology
- [ ] First evergreen guide ("How to write prompts for Midjourney v7")
- [ ] Re-run GEO audit → target ≥65/100

---

## Appendix: Pages Analyzed

| URL | Title | GEO posture |
|---|---|---|
| `/` | Opten — AI-оценка и улучшение промптов для генерации изображений | RU canonical, hreflang triplet, no JSON-LD, hero is slogan-shaped |
| `/en/` | Opten — AI Prompt Scorer | EN, hreflang reciprocal, parity with RU |
| `/pay` | (pricing) | Near-empty SSR (head-only prerender tier), no JSON-LD |
| `/en/pay` | (pricing) | Symmetric to /pay, head-only |
| `/welcome` | Welcome to Opten — get started with the extension (RU equivalent) | Onboarding, 4-step numbered, screenshots |
| `/en/welcome` | Welcome to Opten — get started with the extension | EN parity |
| `/privacy` | Политика конфиденциальности — Opten | Citability champion — 12 H2 sections, named sub-processors |
| `/en/privacy` | Privacy Policy — Opten | EN parity |
| `/terms` | Условия использования — Opten | Standard legal |
| `/en/terms` | Terms of Service — Opten | EN parity |
| `/refund` | Политика возврата — Opten | Standard legal |
| `/en/refund` | Refund Policy — Opten | EN parity |

SPA-only routes (`/account`, `/success`, `/dashboard/download-skill`) correctly `Disallow`'d in `robots.txt` — not crawled.

---

_Audit conducted via parallel subagent delegation (`geo-ai-visibility`, `geo-platform-analysis`, `geo-technical`, `geo-content`, `geo-schema`). Aggregation weights per `~/.claude/skills/geo-audit/SKILL.md`._
