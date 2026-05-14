---
tags:
  - gsd
  - requirements
  - milestone
kind: requirements
milestone: "geo-optimization"
aliases:
  - Requirements
---
# Requirements: opten-website (GEO Optimization milestone)

**Defined:** 2026-05-14
**Core Value:** Sell, service, and onboard extension users without breaking the shipped integration contract.
**Milestone:** GEO Optimization — raise GEO score from 12/100 toward higher across 5 phases.
**Phase 1 success metric:** GEO score 12 → ~30 within 14 days of deploy (measured by `geo-seo-claude` audit tool).

## v1 Requirements (Phase 1 — Static GEO foundations)

Phase 1 is **the in-flight phase**. Each requirement = one atomic commit. All confined to `public/`, `index.html`, and `vercel.json`. No React or build-pipeline changes.

Sources:
- Design: `.planning/phases/01-static-geo-foundations/1-SPEC.md`
- Plan: `.planning/phases/01-static-geo-foundations/1-PLAN.md`
- Audit findings closed: C-2, C-3, H-1, H-2, H-5 (per `.planning/research/GEO-AUDIT.md`)

### GEO Static Foundations

- [ ] **GEO-A-1**: `public/robots.txt` exists with explicit per-bot blocks for `*`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`, `anthropic-ai`. `Disallow: /account`, `/success`, `/dashboard/` on the first five. `Sitemap: https://opten.space/sitemap.xml` at the end. Verified by `curl /robots.txt` → 200 + `Content-Type: text/plain`.
- [ ] **GEO-A-2**: `public/sitemap.xml` lists exactly six marketing routes: `/`, `/pay`, `/welcome`, `/privacy`, `/terms`, `/refund`. Priorities 1.0/0.8/0.6/0.3/0.3/0.3. `lastmod` intentionally omitted in Phase 1. Verified by `curl /sitemap.xml` → 200 + `application/xml`, XML parses.
- [ ] **GEO-A-3**: `public/llms.txt` exists, English only, llmstxt.org structure: H1 "Opten", blockquote summary, "How it works" section, "Product" section with five links (CWS, /pay, /privacy, /terms, /refund). Verified by `curl /llms.txt` → 200 + `Content-Type: text/plain` + first line `# Opten`.
- [ ] **GEO-A-4**: OG hero cards copied into `public/` — `opten-design/Landing/banner-ru.png` → `public/og-card-ru.png`; `opten-design/Landing/banner-eng.png` → `public/og-card-en.png`. PIL reports both files are exactly (1200, 630). Both appear in `dist/`.
- [ ] **GEO-A-5**: Two `<script type="application/ld+json">` blocks inserted before `</head>` and above the Paddle script in `index.html` — one `SoftwareApplication` (name "Opten — AI Prompt Scorer", `applicationCategory: BrowserApplication`, `operatingSystem: Chrome`, three offers: USD $0 Free + USD $2.99 Pro + RUB ₽199 Pro RU, `installUrl` to CWS), one `Organization` (name "Opten", logo `favicon-192x192.png`, `sameAs` = [CWS URL, `https://t.me/v_voronezhtsev`]). Both parse as JSON. Pricing values sourced from `src/i18n/ru.json` and must stay in sync.
- [ ] **GEO-A-6**: Replace single `<meta property="og:image" content=".../favicon-310x310.png">` in `index.html` with four-line block (image + `og:image:width = 1200` + `og:image:height = 630` + `og:image:alt = "Opten — улучшай промпты перед генерацией"`); replace `<meta name="twitter:image">` content to `og-card-ru.png`. Verified by `grep 'favicon-310x310' index.html` returning zero matches.
- [ ] **GEO-A-7**: `<link rel="preconnect" href="https://cdn.paddle.com" />` inserted immediately above the existing Paddle `<script>` tag in `index.html`. `crossorigin` attribute MUST be omitted to match the Paddle script's no-cors fetch posture. Verified in `dist/index.html`.
- [ ] **GEO-A-8**: `vercel.json` extended with `headers` block. Three headers on `/(.*)`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.paddle.com")`. CSP deferred. HSTS already enforced by Vercel at the domain level. Verified by `curl -sI /` on the Vercel preview returning all three header lines, AND `npm run build` succeeding. **Highest-risk task — executed last; rollback = `git revert <sha>`.**

## v2 Requirements (Phases 2–5 — deferred)

Tracked but not in current detailed plan. Each refers back to specific audit findings in `.planning/research/GEO-AUDIT.md`.

### Phase 2 — Per-route prerender + metadata

Closes: **C-1** (no SSR — entire site is one empty SPA shell), **C-4** (all 7 routes share one `<title>`/`<meta>`, RU only).

- **GEO-B-1**: Resolve open question — head-management strategy: `react-helmet-async` (runtime) vs build-time prerender (Vite SSG / vite-plugin-ssr / Vike). Build-time preferred per audit.
- **GEO-B-2**: Implement chosen strategy across all 8 routes — per-route `<title>`, `<meta description>`, canonical, `og:title`, `og:description`, `og:image` (route-appropriate).
- **GEO-B-3**: Sitemap.xml grows `lastmod` field per route once prerender produces per-route build metadata.

### Phase 3 — Bilingual routing

Closes: **C-5** (no language signaling for EN audience; `<html lang="ru">` hardcoded, no `hreflang`).

- **GEO-C-1**: Resolve open question — per-language URL strategy: `/ru/*` `/en/*` (recommended), `?lang=`, or `ru.opten.space` subdomain.
- **GEO-C-2**: Add `/ru/*` and `/en/*` path siblings for marketing routes **alongside** locked routes (locked roots `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` keep responding at their existing paths — see CON-locked-routes-keep-existing-paths).
- **GEO-C-3**: Add `hreflang` annotations across all bilingual pages.
- **GEO-C-4**: Dynamic `<html lang="...">` per route instead of hardcoded `lang="ru"`.

### Phase 4 — Content surface

Closes: **M-3** (no FAQ schema), **M-4** (no HowTo content), **H-3** (no `/about` E-E-A-T surface).

- **GEO-D-1**: Create `/about` page — author/company E-E-A-T, founder bio, Telegram link, credentials.
- **GEO-D-2**: Create `/guides/*` content surface — HowTo-shaped articles for AI image-prompt workflows.
- **GEO-D-3**: Add FAQ schema (JSON-LD `FAQPage`) to landing and guide pages.

### Phase 5 — Brand authority

Closes: **H-4** ("Opten" brand collides with Hungarian legal DB + Australian company), **L-5** (no analytics), various M-5 (no Wikipedia/Reddit/YouTube presence).

- **GEO-E-1**: Product Hunt launch.
- **GEO-E-2**: Wikipedia presence (or disambiguation).
- **GEO-E-3**: Reddit + YouTube footprint.
- **GEO-E-4**: Expand `sameAs` array in `Organization` JSON-LD to include all authority URLs once acquired.

## Out of Scope (this milestone)

| Feature | Reason |
|---------|--------|
| CSP header in Phase 1 vercel.json | Interacts with Paddle's inline script; requires per-source nonce coordination. Separate ticket — must not be silently added inside Phase 1 changes. |
| Switching to `@supabase/supabase-js` SDK | Site uses plain `fetch`; no driver to swap. Not a GEO concern. |
| Tests / ESLint / typecheck script | Codebase has none; not adding inside a GEO milestone. Verification gate stays `npm run build` + `npm run preview` + manual curl. |
| Renaming locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) | Breaks already-shipped extension binaries deep-linking to those paths. Replacement requires redirect from old path. |
| One-time skill download in SoftwareApplication offers JSON-LD | Separate product surface; intentionally excluded. |
| Setting `Paddle.Environment.set('production')` | Paddle v2 SDK throws on this. |
| Adding `crossorigin` to Paddle preconnect | Opens a separate CORS connection the Paddle `<script>` won't reuse. |
| `lastmod` field in Phase 1 sitemap.xml | Deferred to Phase 2 when prerender produces per-route build metadata. |
| Per-route prerender / SSR in Phase 1 | Phase 2 scope. Phase 1 MUST NOT touch React or build pipeline. |
| `noindex` on `/pay` (suggested in SEO-AUDIT.md) | Diverges from SPEC; `/pay` is a marketing/pricing surface, kept crawlable. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| GEO-A-1 | Phase 1 | Pending |
| GEO-A-2 | Phase 1 | Pending |
| GEO-A-3 | Phase 1 | Pending |
| GEO-A-4 | Phase 1 | Pending |
| GEO-A-5 | Phase 1 | Pending |
| GEO-A-6 | Phase 1 | Pending |
| GEO-A-7 | Phase 1 | Pending |
| GEO-A-8 | Phase 1 | Pending |
| GEO-B-* | Phase 2 | Backlog |
| GEO-C-* | Phase 3 | Backlog |
| GEO-D-* | Phase 4 | Backlog |
| GEO-E-* | Phase 5 | Backlog |

**Coverage:**
- v1 requirements (Phase 1): 8 total
- Mapped to Phase 1: 8
- Unmapped: 0 ✓
- v2 requirements (Phases 2-5): backlog placeholders, scope set, detailed planning deferred

---
*Requirements defined: 2026-05-14*
*Last updated: 2026-05-14 after bootstrap from `.planning/intel/requirements.md`*
