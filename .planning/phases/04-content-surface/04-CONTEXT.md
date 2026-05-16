---
tags:
  - gsd
  - context
  - phase
phase: 4
milestone: "geo-optimization"
kind: phase-context
---
# Phase 4: Content surface — Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the indexable content layer + structured-data graph that AI assistants (ChatGPT, Claude, Perplexity, Gemini, Bing Copilot, Google AI Overviews) need in order to cite Opten when answering prompt-engineering questions. Closes audit findings **M-3** (no FAQ schema), **M-4** (no HowTo content), **H-3** (no `/about` E-E-A-T surface), plus the Schema (8/100) + AI Citability (68/100) gaps surfaced by the 2026-05-17 GEO rescore.

**Explicitly in this phase:**

1. **`/about` page (RU only)** — founder-solo positioning around В. Воронежцев. ~1000+ words. Adds E-E-A-T signals (Experience, Expertise, Trust). NOT bilingual in Phase 4 — `/en/about` deferred to Phase 4.1. `/about` is NOT added to `EN_SIBLINGS` in `src/i18n/paths.ts`.
2. **`/guides/*` — one anchor guide, bilingual (RU + EN)** — hybrid format: HowTo structure (5–7 steps, schema.org `HowTo`) WITH before/after prompt blocks that illustrate the "30–50% credit savings" claim and tie back to Opten. ~1000–1500 words. RU + EN siblings both ship: `/guides/<slug>` + `/en/guides/<slug>`, both added to `EN_SIBLINGS`.
3. **FAQ block** — 5–6 question/answer pairs, mounted on:
   - the landing (`/` and `/en/`),
   - the anchor guide (`/guides/<slug>` and `/en/guides/<slug>`).
   Same (or near-same) Q/A set in both places. `FAQPage` JSON-LD per page.
4. **Full JSON-LD schema bundle, injected via `scripts/prerender.mjs`:**
   - `Organization` — every page (`@id: https://opten.space/#org`), `founder: Person`, `sameAs` to Chrome Web Store at minimum.
   - `SoftwareApplication` — `/` and `/en/`, with `offers` array (RUB + USD prices).
   - `WebSite` — root pages, `inLanguage: ["ru-RU", "en-US"]`, `publisher: @id`.
   - `Product` + `Offer` — `/pay` and `/en/pay` (requires §5 below — Product schema needs visible body content per Google policy).
   - `FAQPage` — landing + anchor guide.
   - `HowTo` — anchor guide.
   - `BreadcrumbList` — `/pay`, `/welcome`, legal pages, `/about`, guide pages.
   - `Person` — `/about` (founder node, linked from Organization).
   All blocks use `@id` cross-references to form one connected entity graph.
5. **`/pay` + `/en/pay` promoted from head-only to full-prerender tier** — pricing facts (plan names, prices, currencies, feature bullets) baked into static HTML. Required for the `Product` schema to satisfy Google's "schema must reflect visible content" rule. Touches a billing surface — treat as a separate plan task with extra Playwright + Paddle modal verification.
6. **`/llms.txt` + `/llms-full.txt`** — generated at build time. `/llms.txt` is the table-of-contents (~30 lines, sourced from `scripts/seo-routes.ts`); `/llms-full.txt` concatenates the prerendered text of all 12 marketing routes plus the new `/about` and guide. Hooked into `scripts/sitemap.mjs`-adjacent step.
7. **Hero `fetchpriority="high"` + `<link rel="preload" as="image">` for the hero image** — injected by `scripts/prerender.mjs` into the prerendered `<head>`. Targets the mobile LCP drop from 3.3 s → ~2.5 s (Google "good" threshold).
8. **`X-Frame-Options: SAMEORIGIN` + `Content-Signal:` directive** — `vercel.json` headers + `robots.txt` line. NO `CSP` in this phase (PROJECT.md flags CSP as out-of-scope for the GEO milestone due to Paddle inline-script conflict; that decision is preserved).

**Explicitly NOT in this phase:**

- **CSP header** — milestone-level "out of scope" per PROJECT.md "Constraints" + "Out of Scope" sections; conflicts with Paddle inline script and needs nonce coordination. Separate ticket. Do NOT silently add inside the `vercel.json` edit of §8.
- **`/en/about`** — deferred to Phase 4.1 per user decision. `/about` will only have `hreflang="ru"` and no `<link rel="alternate" hreflang="en">` — i.e. it does NOT participate in the bilingual cluster.
- **Additional guides beyond the one anchor** — Phase 4.1 will add 3–5 more after the anchor proves the format. Backlog list in `<deferred>`.
- **Brand-authority work** (Wikipedia, Wikidata, Reddit, YouTube, Product Hunt) — that is Phase 5 scope.
- **Customer testimonials / Chrome Web Store rating embed** — out of scope; revisit in Phase 5.
- **Author bylines on landing** — only `/about` ships founder presence; landing copy stays as is.
- **`speakable` schema property** — defer; not commonly cited and adds complexity.
- **`/en/about` stub with placeholder text** — explicitly rejected (stubs hurt SEO; better to have RU-only than thin EN).
- **Landing copy rewrite** — out of scope; the hero stays as-is. Schema additions are the lift.

</domain>

<decisions>
## Implementation Decisions

### /about content & framing
- **D-01:** Founder-solo positioning around В. Воронежцев (ИП). Page reads as a personal "why I built this" story plus credentials and Telegram contact. NOT a dual-operator legal page (the dual-operator legal disclosure stays in `/privacy`).
- **D-02:** ~1000+ words, RU only. EN sibling deferred to Phase 4.1. `/about` is NOT added to `EN_SIBLINGS` in `src/i18n/paths.ts`. The page carries `<html lang="ru">`, hreflang `ru` self-canonical only (no `en` alternate, no `x-default`).
- **D-03:** Founder photo included — supports `Person` schema with an `image` property and adds visual E-E-A-T.

### /guides structure & format
- **D-04:** One anchor guide in Phase 4. Slug + topic chosen during planning; default candidate: "How to write prompts for Midjourney v7" (proven AI-Overviews target query).
- **D-05:** Hybrid HowTo + before/after format. ~1000–1500 words. 5–7 steps. Each step carries a screenshot or before/after prompt pair. Schema.org `HowTo` markup AND `FAQPage` markup co-exist (each documents a different aspect).
- **D-06:** Bilingual from day one — `/guides/<slug>` + `/en/guides/<slug>`. Both added to `EN_SIBLINGS` in `src/i18n/paths.ts` AND to `scripts/seo-routes.ts` EN entries (the SYNC contract). hreflang triplet shipped reciprocal between siblings.
- **D-07:** Guide content is **human-written original** (no LLM-generated copy that will trigger AI-content detection). Per CONCERNS.md, AI-generated content on guide pages would damage the E-E-A-T position that `/about` is trying to establish.

### FAQ + JSON-LD bundle
- **D-08:** FAQ block carries 5–6 Q/A pairs, mounted on both the landing and the anchor guide. Same set or near-same — duplication is acceptable for AI extraction. Questions sourced from a real-source pool (Telegram chat + Chrome Web Store reviews + obvious top-of-funnel questions) — NOT invented.
- **D-09:** Full schema bundle ships in one phase (not split): `Organization`, `SoftwareApplication`, `WebSite`, `Product`, `FAQPage`, `HowTo`, `BreadcrumbList`, `Person`. All blocks share `@id` cross-references (`https://opten.space/#org`, `#website`, `#person-founder`, etc.) to form one connected graph. Concrete snippet skeletons are in `.planning/research/GEO-AUDIT-POST-PHASE-3.md` §"Phase 4 Schema Plan" — planner reuses them.
- **D-10:** Schema injection goes through `scripts/prerender.mjs` (not React hooks). AI crawlers do NOT execute JS — schema MUST land in initial HTML. The `seo-routes.ts` manifest gets a new `schema: SchemaBlock[]` field per route, evaluated at prerender time.

### Sidecar fixes (all four)
- **D-11:** `/llms.txt` (table-of-contents) + `/llms-full.txt` (concatenated prerendered body) ship in this phase. Generated by a new postbuild script step adjacent to `sitemap.mjs`. Static files in `dist/`; no runtime.
- **D-12:** `/pay` and `/en/pay` promoted from head-only to full-prerender tier. Pricing strings move from the React layer into a static block consumed by `scripts/entry-server.tsx`. Touches the billing surface — separate plan task, extra Playwright + Paddle modal verification mandatory. Phase 3 D-03b (Paddle sync `<script>` on `/pay` + `/en/pay`) MUST be preserved unchanged.
- **D-13:** Hero `fetchpriority="high"` + `<link rel="preload" as="image">` injected by `scripts/prerender.mjs` into the prerendered `<head>` of routes that render a hero (currently `/` and `/en/` only). Target: mobile LCP 3.3 s → ~2.5 s.
- **D-14:** `X-Frame-Options: SAMEORIGIN` added to `vercel.json` headers. `Content-Signal: search=yes, ai-train=yes, ai-retrieval=yes` added to `public/robots.txt`. **CSP stays out of scope** (PROJECT.md milestone constraint preserved).

### Phase shape
- **D-15:** Single Phase 4 — not split into 4.0 / 4.1. Phase 4.1 reserved for "EN versions of /about + extra guides" once the anchor proves the format.
- **D-16:** Bilingual asymmetry between `/about` (RU only) and `/guides/<slug>` (RU + EN) is a known tension. Mitigation during planning: the `/about` link in the EN navbar is suppressed (or routes to a "Coming soon in English" stub on `/en/`). Planner picks the cleaner of the two options.

### Claude's Discretion
- **Anchor guide topic** — default suggestion "How to write prompts for Midjourney v7". Planner picks final based on Telegram-chat / Chrome-Web-Store-review topic frequency. If a different model (Flux, SD 3.5) shows higher demand at planning time, pick that.
- **FAQ question selection** — planner samples Telegram chat + Chrome Web Store reviews, picks the 5–6 highest-frequency questions. If those sources are thin, fall back to the obvious top-of-funnel set ("What is Opten?", "Which models?", "How much does it cost?", "Where is data stored?", "How to install?", "Refund policy?").
- **`/llms-full.txt` size cap** — if concatenated body exceeds ~50 KB, truncate to most-important sections (root + guide + about + pricing) per heuristic in the GEO audit; full set otherwise.
- **Page hierarchy URL** — `/guides/<slug>` vs `/guides/category/<slug>`. Default: flat `/guides/<slug>` (one anchor, no categorization needed yet). Categorization deferred.
- **About-link visibility on EN pages** — hide entirely vs render with "Coming soon in EN" stub. Planner picks per UX feel.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit findings (closure targets for Phase 4)
- `.planning/REQUIREMENTS.md` §Phase 4 — REQ-GEO-D-1, GEO-D-2, GEO-D-3 verbatim
- `.planning/research/GEO-AUDIT-POST-PHASE-3.md` (full audit, 2026-05-17, score 48/100)
- `.planning/research/GEO-AUDIT-POST-PHASE-3.md` §"Phase 4 Schema Plan" — concrete JSON-LD snippet skeletons for all 8 schema types (Organization, SoftwareApplication, WebSite, Product, FAQPage, HowTo, BreadcrumbList, Person)
- `.planning/research/GEO-AUDIT-POST-PHASE-3.md` §"Quick Wins" — the 5 quick-win sequencing recommendation (JSON-LD pack first, then llms.txt, then hero fetchpriority, then headers)

### Roadmap & locked requirements
- `.planning/ROADMAP.md` §Phase 4 (lines 154–164) — phase boundary, depends-on, success criteria sketch
- `.planning/REQUIREMENTS.md` Phase 4 section (lines 59–66) — GEO-D-1, GEO-D-2, GEO-D-3
- `.planning/PROJECT.md` §Constraints — CSP out-of-scope confirmation, locked-route preservation
- `.planning/PROJECT.md` §Out of Scope — CSP rationale, locked-route rule that bounds §8 vercel.json edit

### Integration contract (MANDATORY before touching anything route- or build-coupled)
- `docs/INTEGRATION-CONTRACT.md` §3 (URL contract) — locked routes; new routes (`/about`, `/guides/*`) are **additions**, not replacements
- `docs/INTEGRATION-CONTRACT.md` §6 (Paddle SDK init) — `/pay` + `/en/pay` MUST keep the synchronous `<script>` tag through any prerender refactor (D-12 risk)

### Phase 3 artifacts (what shipped, what to preserve)
- `.planning/phases/03-bilingual-routing/03-CONTEXT.md` — D-01..D-07 bilingual contract, hreflang policy, locked-route exclusions (D-03)
- `.planning/phases/03-bilingual-routing/03-POST-RELEASE.md` — bug breakdown for the 3 i18n post-release fixes; explains why LangSwitcher writes storage + LocalizedLink rewrites hrefs
- `src/i18n/paths.ts` — `EN_SIBLINGS` constant; new bilingual routes MUST be added here
- `scripts/seo-routes.ts` — EN entries MUST mirror `EN_SIBLINGS` (4-file sync chain documented in `.planning/codebase/CONVENTIONS.md` §SYNC)
- `scripts/prerender.mjs` — pipeline that injects `<html lang>`, hreflang triplets, Paddle script; will be extended with JSON-LD injection + hero preload (D-10, D-13)
- `scripts/sitemap.mjs` — will gain new routes (`/about`, guide siblings) and the `/llms.txt` generation step

### Codebase intel (freshly regenerated 2026-05-17)
- `.planning/codebase/ARCHITECTURE.md` — 12 prerendered routes baseline + LangProvider cascade
- `.planning/codebase/STRUCTURE.md` — file layout (added `scripts/` + `src/i18n/paths.ts`)
- `.planning/codebase/INTEGRATIONS.md` — Paddle injection gate at `prerender.mjs:192`; symmetric `/pay` + `/en/pay`
- `.planning/codebase/CONVENTIONS.md` — `LocalizedLink` as canonical internal-nav primitive; `EN_SIBLINGS` SYNC contract
- `.planning/codebase/CONCERNS.md` §3 — bilingual i18n drift surfaces (3.1 EN_SIBLINGS sync; 3.4 LocalizedLink convention not enforcement)
- `.planning/codebase/TESTING.md` — MCP-driven Playwright + PageSpeed test workflow (no unit tests, no ESLint)

### Tech baseline
- `CLAUDE.md` "Tech stack" — Vite 6, React 18.3, React Router 7, Tailwind 4, no tests/lint/typecheck

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`scripts/seo-routes.ts`** — already the canonical place for per-route metadata. Extending it (vs creating a parallel manifest) keeps single-source-of-truth. The file already declares pricing-string duplication policy ("SYNC: title/description strings duplicated from src/i18n/ru.json"). Phase 4 adds: `schema: SchemaBlock[]` field per route (or a parallel `schemaByRoute` table).
- **`scripts/prerender.mjs`** — existing pipeline already applies `applyHtmlLang`, `applyHreflang`, `applyOgLocale`, `applyPaddleScript`. Phase 4 adds: `applyJsonLd` (per-route), `applyHeroPreload` (root only), `applyContentSignal` (no-op — Content-Signal goes in `robots.txt`, not HTML).
- **`scripts/sitemap.mjs`** — postbuild script. Phase 4 adds new routes (`/about`, `/en/guides/*`) and a sibling `llms.mjs` (or inline step) that generates `/public/llms.txt` + `/public/llms-full.txt` at the same point in the pipeline.
- **`src/i18n/paths.ts` `EN_SIBLINGS` constant** — adds entries for `/guides/<slug>` (both languages) but NOT for `/about` (per D-02). The 4-file SYNC chain (paths.ts ↔ seo-routes.ts ↔ sitemap.mjs ↔ prerender output) is documented in `.planning/codebase/CONVENTIONS.md`.
- **`src/app/components/LocalizedLink.tsx`** — used for the new `<Link to="/about">`, `<Link to="/guides/<slug>">` in navbar/footer. About link is non-sibling, guide link is sibling — both handled correctly by `localizeHref` automatically.
- **`docs/SEO-AUDIT.md`** — original baseline audit. Phase 4 closes the "no FAQ schema", "no HowTo", "no /about E-E-A-T" findings listed there.

### Established Patterns

- **Build-time JSON-LD, not runtime** — Phase 1 established the pattern by inlining `SoftwareApplication` + `Organization` into `index.html`. Phase 4 generalizes: schema blocks live in `scripts/seo-routes.ts`, get injected per route by `prerender.mjs`. NO React component renders schema.
- **Static-file shadowing** — Vercel's SPA rewrite is a fallback. `dist/about/index.html`, `dist/guides/<slug>/index.html`, etc. will be real files that shadow the rewrite (Phase 2 D-01 pattern).
- **Atomic-commit-per-requirement** — each new page, each schema block, each sidecar fix should be its own commit. Mirrors Phase 1 + Phase 2 + Phase 3 pattern.
- **No-trailing-slash canonical** — `/about`, `/guides/<slug>` (no trailing slash). EN equivalents `/en/guides/<slug>`. EN landings keep their slash (`/en/`).
- **AI-content avoidance for E-E-A-T pages** — guides + `/about` are E-E-A-T anchors. Generating them with an LLM defeats the purpose. Human-written, human-edited.

### Integration Points

- **`scripts/seo-routes.ts`** route declarations — extended with `/about`, `/guides/<slug>`, `/en/guides/<slug>` entries. SYNC-bound to `src/i18n/paths.ts EN_SIBLINGS`.
- **`scripts/prerender.mjs`** — main loop gains JSON-LD injection step; emits new HTML files at the new paths.
- **`scripts/entry-server.tsx`** — mounts new routes for SSR (the new `AboutPage`, `GuidePage` components must be eagerly imported, NOT `React.lazy` — see `.planning/codebase/CONVENTIONS.md` §"SSR / Prerender Constraints").
- **`src/main.tsx`** — registers `<Route path="/about">`, `<Route path="/guides/:slug">`, `<Route path="/en/guides/:slug">` declarations. Mirror `entry-server.tsx`.
- **`src/i18n/{ru,en}.json`** — new keys for navbar/footer "About" and "Guides" labels. RU guide and About copy lives in `src/app/pages/`, NOT in i18n dict (page-specific content, not interpolated strings).
- **`public/robots.txt`** — append `Content-Signal:` directive.
- **`vercel.json`** — append `X-Frame-Options: SAMEORIGIN` header for all routes. Do NOT add CSP.
- **`src/app/pages/PayPage.tsx`** — refactor to move pricing facts (plan names, prices, feature bullets) into a static block consumable by `entry-server.tsx`. High-risk surface — separate plan task, extra Playwright + Paddle modal verification.

</code_context>

<specifics>
## Specific Ideas

- **Anchor guide topic candidate:** "How to write prompts for Midjourney v7" — proven AI-Overviews query, large existing search volume. Planner confirms after sampling Telegram chat / CWS reviews for highest-demand topic.
- **FAQ source mining** — sample real questions from Telegram chat `@v_voronezhtsev` and Chrome Web Store review text. Don't invent. If the pool is thin, fall back to top-of-funnel ("What is Opten?", "Which models?", "Pricing?", "Where is data stored?", "How to install?", "Refund?").
- **Schema graph cross-referencing** — every block uses `@id` URIs (`https://opten.space/#org`, `#website`, `#person-founder`, `#software-app`) so the graph is *connected*, not 8 isolated blocks. This is the single highest-leverage detail for AI entity recognition.
- **/about founder photo** — adds `image` to Person schema and visual E-E-A-T. Source from user during planning if not already available.
- **Schema snippet skeletons are ready** — `.planning/research/GEO-AUDIT-POST-PHASE-3.md` §"Phase 4 Schema Plan" has compact JSON-LD templates for all 8 types. Planner reuses them as starting point instead of generating from scratch.
- **Sequencing intuition** — JSON-LD pack first (lifts Schema 8→55 alone), then `/pay` prerender (unlocks Product schema legality), then `/about` + guide writing (sequential because of copy-write effort), then `/llms.txt` (last because depends on final route set), then hero fetchpriority + headers (parallel quick wins).
- **Mobile LCP target** — 3.3 s → ≤2.5 s. Verify post-deploy via PageSpeed MCP on both `/` and `/en/` after hero preload lands.

</specifics>

<deferred>
## Deferred Ideas

Captured during discussion; belong in other phases.

- **`/en/about`** — EN sibling of `/about`. Deferred to Phase 4.1 (sequencing: ship RU first, write EN translation second). Will require adding `/about` to `EN_SIBLINGS` at that time.
- **Additional guides beyond the anchor** — Midjourney v7 + Flux + Stable Diffusion + DALL-E + general principles cluster. Phase 4.1 (or 4.2) after anchor proves the format. Each new guide = same shape (HowTo + before/after, bilingual, FAQ block).
- **CSP header** — milestone-level out-of-scope per PROJECT.md; do NOT add in §8 vercel.json edit. Separate ticket after Paddle nonce coordination.
- **Wikipedia/Wikidata + Reddit + YouTube + Product Hunt** — Phase 5 (brand authority). Not Phase 4.
- **Customer testimonials / Chrome Web Store rating embed** — out of scope; revisit in Phase 5.
- **`speakable` schema property** — defer; rare AI citation lever, complex.
- **Landing copy rewrite** — out of scope. Schema bundle does the lift; hero text stays.
- **`/about` page in EN with stub copy** — explicitly rejected. Thin EN content damages SEO.
- **Categorized guides URL hierarchy (`/guides/category/<slug>`)** — defer. Flat `/guides/<slug>` until volume justifies it.
- **`/faq` standalone page** — rejected. FAQ block embeds in landing + anchor guide instead, per D-08.

</deferred>

---

*Phase: 4 — Content surface*
*Context gathered: 2026-05-17*
