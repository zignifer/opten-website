---
tags:
  - gsd
  - roadmap
  - milestone
kind: roadmap
milestone: "geo-optimization"
aliases:
  - Roadmap
---
# Roadmap: opten-website — GEO Optimization milestone

## Overview

One milestone: **GEO Optimization**. The opten.space site currently scores 12/100 on AI-citability (`geo-seo-claude` audit). The root cause is structural — Vite SPA with no SSR, byte-identical empty `index.html` on every route, zero structured data, no static crawler signals. This roadmap addresses the problem in five sequenced phases. Phase 1 is in-flight (static foundations, no React or build-pipeline changes); Phases 2–5 are backlog placeholders scoped to specific findings in `.planning/research/GEO-AUDIT.md`, to be planned in detail later.

Every phase respects the locked routes and the 8 ADR-locked decisions from `docs/INTEGRATION-CONTRACT.md` (binding interface with the Opten Chrome extension at `C:\Projects\promptscore`).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5): Planned milestone work
- Decimal phases: inserted urgent work (Phase 2.1 added 2026-05-15 to address Phase 2 side effects)

- [x] **Phase 1: Static GEO foundations** — robots/sitemap/llms.txt + inline JSON-LD + OG hero cards + Paddle preconnect + Vercel security headers (8 atomic commits, no React changes) (completed 2026-05-14)
- [x] **Phase 2: Per-route prerender + metadata** — resolve head-management strategy; per-route titles/descriptions/canonical/OG (closes audit C-1, C-4) (completed 2026-05-14; verified `.planning/phases/02-per-route-prerender-per-route-metadata/02-VERIFICATION.md`)
- [x] **Phase 2.1: Hydration speedup & perceived-load optimization** *(INSERTED 2026-05-15)* — fix the hydration gap exposed by Phase 2: route-level code-split, JS preload, explicit `<img>` dimensions, PNG→WebP/AVIF (completed 2026-05-16; verified `.planning/phases/02.1-hydration-and-perf/02.1-VERIFICATION.md`)
- [x] **Phase 2.2: Mobile-perf + Safari fixes** *(INSERTED 2026-05-16, shipped inline)* — user reported residual sluggishness on mobile Safari after 2.1 shipped. Conditional Paddle SDK loading (only on `/pay`), vendor chunk split (main bundle 328 → 107 KB), self-hosted WOFF2 fonts (eliminated Google Fonts 3-RTT cascade on Safari), `<link rel=preload as=script>` Safari fallback for `modulepreload` (Safari <iOS 17 ignores it), `touch-action: manipulation` to kill the 300 ms tap delay, lazy-loaded EN i18n dict (-40 KB raw / -13 KB gzip on RU visits), mobile-resolution `srcset` for feature cards + steps. Commits `0a73069`..`81284d4`. No `.planning/phases/02.2-*/` directory created — reactive work, tracked via commit history + retroactive note in `02.1-VERIFICATION.md`.
- [x] **Phase 3: Bilingual routing** — resolve per-language URL strategy; `/ru/*` `/en/*` siblings + hreflang + dynamic `<html lang>` (closes audit C-5) (completed 2026-05-16)
- [x] **Phase 4: Content surface** — `/about` E-E-A-T page + `/guides/*` HowTo content + FAQ schema (closes audit M-3, M-4, H-3) (completed 2026-05-17; post-deploy UAT 6/6 PASS — see `phases/04-content-surface/04-HUMAN-UAT.md`)
- [x] **Phase 4.1: Content surface cleanup** *(INSERTED 2026-05-17, completed 2026-05-17)* — closed the 9 warnings + 6 info findings from `04-REVIEW.md` (WR-01..09 + IN-01..06) plus 3 user-reported bugs (B-01 free-tier copy purge, B-02 Magnific mentions, B-03 EN /about sibling). 13 atomic wave commits + 1 review-driven fix commit + 1 user-decided copy reword. /pay post-revert baseline preserved (Paddle CDN, 199₽+299₽ visible, Chrome Store SSR CTA, EXTENSION_IDS/SUPABASE_* unchanged). New `/en/about` route shipped with reciprocal hreflang. Verification 8/8 PASS at code/build level — post-deploy curl checks deferred to manual UAT (same pattern as Phase 4). See `phases/04.1-content-surface-cleanup/04.1-VERIFICATION.md`.
- [ ] **Phase 4.2: SEO/GEO polish (post-synthesis)** *(INSERTED 2026-05-17)* — close the P0 + P1 actionable findings from the dual Codex CLI review (with + without GEO frame) layered on top of the morning's internal GEO audit. 5 P0 (≤1 day each) + 7 P1 (1-3 days each) + 3 user decisions (D-1 definitional paragraph hero vs footer, D-2 canonical model count `43+` vs `60+`, D-3 hreflang locale policy). Architectural refactor (route inventory unification, archetype builders, citability gates) deferred to Phase 6.
- [ ] **Phase 5: Brand authority** — Product Hunt + Wikipedia + Reddit + YouTube + expanded `sameAs` schema (closes audit H-4, M-5)
- [ ] **Phase 6: Scale-ready content architecture** *(BACKLOG — added 2026-05-17)* — refactor route inventory, schema templating, and build-time gates so adding 100+ keyword-targeted pages becomes data-driven. Prerequisite for any programmatic SEO rollout.

## Phase Details

### Phase 1: Static GEO foundations
**Goal**: Raise opten.space GEO score from 12/100 → ~30/100 by adding the static foundations AI crawlers and link-preview clients expect, without touching React or the build pipeline.
**Status**: Ready to execute (design approved, plan ready, in-flight).
**Depends on**: Nothing.
**Requirements**: GEO-A-1, GEO-A-2, GEO-A-3, GEO-A-4, GEO-A-5, GEO-A-6, GEO-A-7, GEO-A-8
**Audit findings closed**: C-2, C-3, H-1, H-2, H-5
**Success Criteria** (what must be TRUE):
  1. `curl` against the preview deploy returns real files (not SPA HTML fallback) at `/robots.txt` (text/plain), `/sitemap.xml` (application/xml), `/llms.txt` (text/plain), and `/og-card-{ru,en}.png` (1200×630 PNGs).
  2. The live root HTML contains exactly two `<script type="application/ld+json">` blocks — one `SoftwareApplication`, one `Organization` — and both parse as valid JSON; `~/.claude/skills/geo/scripts/fetch_page.py` reports `structured_data` count = 2.
  3. Telegram/Slack link unfurl on the preview URL renders a 1200×630 hero card (not the favicon); `<meta property="og:image">` points to `https://opten.space/og-card-ru.png`; no remaining `favicon-310x310` references in `index.html`.
  4. `curl -sI /` on the Vercel preview returns `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.paddle.com")`.
  5. After 7–14 days on production, `/geo audit https://opten.space` reports score uplift from 12 → ~30.
**Plans**: 8 plans (one per atomic commit — Tasks 1-8 from the GEO Phase A plan; Task 8 / vercel.json executed last as highest-risk)

Plans:
- [x] 01-01: Add `public/robots.txt` (GEO-A-1)
- [x] 01-02: Add `public/sitemap.xml` (GEO-A-2)
- [x] 01-03: Add `public/llms.txt` (GEO-A-3)
- [x] 01-04: Copy OG hero card PNGs into `public/` (GEO-A-4)
- [x] 01-05: Inline SoftwareApplication + Organization JSON-LD in `index.html` (GEO-A-5)
- [x] 01-06: Replace OG image meta block in `index.html` (GEO-A-6)
- [x] 01-07: Add Paddle `preconnect` link in `index.html` (GEO-A-7)
- [x] 01-08: Add security headers to `vercel.json` (GEO-A-8) — last; rollback = `git revert`

### Phase 2: Per-route prerender + per-route metadata
**Status**: Implementation complete (2026-05-15). Awaiting post-deploy Vercel verification (push to main, then run Sections A-G from 02-08-SUMMARY.md).
**Goal**: Make each route return its own `<title>`, `<meta>`, canonical, and OG tags pre-hydration so AI crawlers and search engines see distinct documents.
**Depends on**: Phase 1.
**Requirements**: GEO-B-1, GEO-B-2, GEO-B-3
**Audit findings closed**: C-1 (no SSR), C-4 (one shared title/meta across 7 routes)
**Resolved open question**: build-time prerender (D-01 in 02-CONTEXT.md) — hand-rolled postbuild `scripts/prerender.mjs` invoked from `npm run build` after `vite build` and `vite build --ssr`. `react-helmet-async` rejected (runtime-only, doesn't reach non-JS crawlers).
**Success Criteria** (refined during planning):
  1. Each route returns distinct `<title>` and `<meta description>` in the pre-hydration HTML (full-tier routes get body content; `/pay` is head-only).
  2. `<link rel="canonical">` correctly identifies each route.
  3. Sitemap.xml now carries per-route `lastmod` derived from build-time ISO date (D-04 uniform date).
**Plans**: 8 plans (one per atomic commit — interface-first ordering, highest-risk `src/main.tsx` hydration switch shipped last)

Plans:
**Wave 1**
- [x] 02-01: Create `scripts/seo-routes.ts` — per-route metadata manifest (GEO-B-1)
- [x] 02-02: Create `scripts/entry-server.tsx` — SSR React tree entry, 5 full-tier routes (GEO-B-2)
- [x] 02-03: Patch `src/i18n/LangContext.tsx` for SSR safety — move `detectLang()` into `useEffect` (GEO-B-2 pre-req)

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 02-04: Create `scripts/prerender.mjs` — postbuild Node script emitting per-route HTML (GEO-B-1 + GEO-B-2)
- [x] 02-05: Create `scripts/sitemap.mjs` — postbuild script emitting `dist/sitemap.xml` with build-time lastmod (GEO-B-3)

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 02-06: Modify `package.json` `build` script to chain SPA + SSR builds + postbuild scripts (GEO-B-1, GEO-B-2, GEO-B-3)

**Wave 4** *(blocked on Wave 3 completion)*
- [x] 02-07: Modify `src/main.tsx` — branch render call on `hasChildNodes()` for `hydrateRoot` vs `createRoot` (GEO-B-2) — HIGHEST RISK; rollback = `git revert`
- [x] 02-08: Add `.ssr-cache` to `.gitignore` + post-deploy acceptance verification (GEO-B-1, GEO-B-2, GEO-B-3)

### Phase 2.1: Hydration speedup & perceived-load optimization *(INSERTED)*
**Status**: Backlog. Inserted 2026-05-15 to address side effects of Phase 2's prerender + hydrateRoot shipping. Detailed planning deferred to `/gsd-plan-phase 2.1`.
**Goal**: Close the hydration gap that Phase 2 exposed — the page now paints fully dark + content-complete from first paint, but `<button onClick>` handlers are dead for 1-3s on mobile while the JS bundle downloads, parses, and hydrates. Also kill the secondary FOUC/CLS as 37 unoptimized PNG `<img>` tags pop in over time.
**Depends on**: Phase 2 (uses the prerender + hydrate split as the basis for measurement; landing must stay prerendered).
**Trigger**: User report 2026-05-15 — "верхние кнопки не нажимаются до прокрутки, либо с огромной задержкой" on iPhone Safari. Root-cause analysis in conversation: 362 KB JS bundle + zero code-split means landing pays for PayPage/AccountPage/Paddle integration code it never runs.
**Hard constraints**:
  - Touches NO extension-coupled constants (`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`).
  - Touches NO locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`).
  - Must not regress Phase 2 prerender invariants — `dist/index.html` and `dist/{route}/index.html` keep their per-route titles/meta/canonical/OG; SPA-fallback (`/account` etc.) keeps its `__PRERENDER_PATH` discriminator and `createRoot` path.
**Scope (four sub-areas)**:
  1. **Route-level code-split** — `React.lazy()` + `<Suspense>` for `PayPage`, `AccountPage`, `SuccessPage`, `DownloadSkillPage`, `PrivacyPage`, `TermsPage`, `RefundPage`, `WelcomePage`. Landing-only bundle target: 362 KB → ≤ 220 KB (~40% reduction).
  2. **`<link rel="modulepreload">` for main bundle** in `index.html`'s `<head>` so the JS chunk for `/` starts downloading in parallel with HTML parse, not after.
  3. **Explicit `width`/`height` (or `aspect-ratio`)** on every `<img>` in `src/app/` (37 tags total — partner logos, feature cards, step illustrations, hero highlight, OptenHeroAnimation inner SVGs). Eliminates CLS as images stream in.
  4. **PNG → WebP/AVIF conversion** for partner logos (`/assets/partners/*.png`) and feature card images (`/assets/landing-design/feature-*.png`) via `vite-imagetools` or a build-time `sharp` postbuild step. SVG icons untouched.
**Success Criteria** (refined during planning):
  1. `npm run build` produces a route chunks map showing `/` does NOT pull in `Paddle.js`-using or `chrome.runtime`-using code (verify via `vite build --report` or `rollup-plugin-visualizer`).
  2. Lighthouse Mobile Performance score for `/` on production ≥ 90 (was: unmeasured baseline, likely 50-70 given current bundle + no image opt).
  3. Initial JS transferred for `/` reduced by ≥ 40% from current 362 KB / 105 KB gzipped baseline.
  4. Cumulative Layout Shift = 0 on `/` per Lighthouse.
  5. Smoke test on Chrome DevTools "Slow 4G" + 4× CPU throttling: tap on navbar `Menu` hamburger within 500 ms of first-contentful-paint registers `setOpen` state change (verified via React DevTools event log).
  6. No regression: all 9 routes still respond, prerendered routes still have distinct titles/meta/canonical, Paddle modal still opens on `/pay` button click.
**Plans**: 7 plans (planned 2026-05-16 by /gsd-plan-phase 2.1).

Plans:
- [x] 02.1-01-PLAN.md — Register vite-imagetools plugin + TS declaration (Wave 1)
- [x] 02.1-02-PLAN.md — Add Picture.tsx component wrapping vite-imagetools <picture> output (Wave 1)
- [x] 02.1-03-PLAN.md — Add RouteLoading.tsx Suspense fallback component (Wave 1)
- [x] 02.1-04-PLAN.md — Set explicit width/height/loading attrs on every <img> for CLS=0 (Wave 2)
- [x] 02.1-05-PLAN.md — Wrap PNG <img> tags with vite-imagetools <Picture> for WebP delivery (Wave 3)
- [x] 02.1-06-PLAN.md — Inject <link rel=modulepreload> into prerendered HTML via prerender.mjs (Wave 3)
- [x] 02.1-07-PLAN.md — Lazy-load SPA-fallback routes via React.lazy + Suspense (Wave 4, highest risk, last)

### Phase 3: Bilingual routing
**Status**: Planned 2026-05-16. 8 plans across 4 waves (Plan 01 hydration fix isolated in Wave 1; Plans 02 + 06 in Wave 2; Plans 03/05/07 parallel in Wave 3; Plans 04/08 in Wave 4). Ready for /gsd-execute-phase 3.
**Goal**: Make EN audience discoverable via real URLs that search engines and AI crawlers understand — without breaking shipped extension binaries that deep-link to locked routes.
**Depends on**: Phase 2 (per-route metadata is a prerequisite for hreflang to mean anything).
**Requirements**: GEO-C-1, GEO-C-2, GEO-C-3, GEO-C-4
**Audit findings closed**: C-5 (no language signaling for EN audience)
**Resolved open question**: per-language URL strategy — path-prefix `/en/*` chosen (CONTEXT D-01). `/ru/*` stays virtual (hreflang `ru` points at unprefixed canonical, D-02).
**Hard constraint**: locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) must continue to respond at their existing paths; any new `/en/*` URLs are **additions, not replacements** (per CON-locked-routes-keep-existing-paths and DEC-integration-contract-locked-routes).
**Success Criteria** (refined during planning):
  1. EN user can land on an `/en/*` URL and see English content with `<html lang="en">` baked at build time (no runtime DOM mutation).
  2. `hreflang` triplet (`ru`, `en`, `x-default`) on every prerendered `<head>`, reciprocal between cluster pairs (Pitfall 5 mitigation by manifest construction).
  3. Shipped extension binaries continue to navigate to `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` without breakage; `/en/pay` carries the same synchronous Paddle CDN `<script>` tag as `/pay` (D-03b, INTEGRATION-CONTRACT §6 updated symmetrically).
  4. Header LangSwitcher writes URL via `useNavigate` (URL = source of truth, D-05/D-07b); on routes without an EN sibling routes to `/en/`.
  5. Residual hydration mismatch on `/` (carry-over from Phase 02.2) is resolved before bilingual surface ships (Plan 01 isolated, Wave 1).
**Plans**: 8 plans

Plans:
**Wave 1**
- [x] 03-01-fix-hydration-mismatch-on-root-PLAN.md — Delete LangContext.tsx:84-86 document.documentElement.lang useEffect (carry-over from Phase 02.2; isolation per CONTEXT D-06)

**Wave 2** *(blocked on Wave 1)*
- [x] 03-02-seo-routes-add-en-entries-PLAN.md — Extend RouteMeta (htmlLang + hreflangAlternates) + 6 EN entries in scripts/seo-routes.ts (GEO-C-1, GEO-C-4)
- [x] 03-06-langcontext-url-prefix-detection-PLAN.md — LangProvider URL-driven via useLocation + SSR-eager en.json gate (GEO-C-4)

**Wave 3** *(blocked on Wave 2)*
- [x] 03-03-prerender-apply-htmlLang-hreflang-oglocale-PLAN.md — 3 new apply* helpers in scripts/prerender.mjs (GEO-C-3, GEO-C-4)
- [x] 03-05-sitemap-xhtml-link-annotations-PLAN.md — sitemap.mjs Option A xhtml:link annotations + 12+ entries (GEO-C-2, GEO-C-3)
- [x] 03-07-register-en-routes-in-routers-PLAN.md — /en/* Route declarations in entry-server.tsx (5) + main.tsx (6) (GEO-C-1, GEO-C-2)

**Wave 4** *(blocked on Wave 3)*
- [x] 03-04-paddle-symmetric-en-pay-and-contract-PLAN.md — Widen Paddle injection to /en/pay + INTEGRATION-CONTRACT §6 + robots.txt defense-in-depth (GEO-C-2)
- [x] 03-08-langswitcher-extract-and-wire-PLAN.md — Extract src/app/components/LangSwitcher.tsx + wire 4 consumer sites (GEO-C-1, GEO-C-4)

### Phase 4: Content surface
**Status**: Planned 2026-05-17. 7 plans across 6 waves (Wave 1 parallel sidecars + LCP audit; Waves 2-6 strictly sequential due to scripts/seo-routes.ts + routers file ownership). Ready for /gsd-execute-phase 4.
**Goal**: Establish E-E-A-T signals and indexable answer content so AI assistants have material to cite when answering prompt-engineering questions.
**Depends on**: Phase 3 (bilingual routing — content surface ships RU + EN where D-02 allows).
**Requirements**: GEO-D-1, GEO-D-2, GEO-D-3
**Audit findings closed**: M-3 (no FAQ schema), M-4 (no HowTo content), H-3 (no `/about` E-E-A-T surface)
**Success Criteria** (refined during planning):
  1. `/about` page exists with founder bio, Telegram contact, credentials, and Person schema linked to Organization graph via @id (D-01, D-03; V-01..V-04).
  2. One anchor `/guides/SLUG` HowTo article exists bilingual (RU + EN), structured per schema.org HowTo with 5-7 steps (D-04..D-06; V-05..V-07).
  3. Landing pages carry FAQPage JSON-LD; Q/A pairs sourced from Telegram + Chrome Web Store reviews (D-08; V-08..V-10).
  4. Full schema bundle ships (Organization, SoftwareApplication, WebSite, Product, FAQPage, HowTo, BreadcrumbList, Person) all connected via @id (D-09, D-10; V-11, V-12).
  5. `/pay` and `/en/pay` promoted to full prerender with pricing facts in initial HTML (D-12; V-15, V-16, V-17). Paddle invariant preserved.
  6. `llms.txt` + `llms-full.txt` generated at build time (D-11; V-13, V-14).
  7. Hero preload + X-Frame-Options + Content-Signal land as low-risk sidecars (D-13, D-14; V-18..V-22).
**Plans**: 7 plans

Plans:
**Wave 1**
- [x] 04-01-PLAN.md — Sidecar headers: vercel.json X-Frame-Options + robots.txt Content-Signal (D-14)
- [ ] 04-02-PLAN.md — LCP element identification via PageSpeed MCP (Wave-0 prerequisite for D-13)

**Wave 2** *(blocked on Wave 1)*
- [x] 04-03-PLAN.md — Schema entity-graph infrastructure + applyJsonLd + applyHeroPreload (D-09, D-10, D-13)

**Wave 3** *(blocked on Wave 2)*
- [x] 04-04-PLAN.md — PayPage D-12 promotion: extract PricingStaticBlock + flip to full prerender + Product schema

**Wave 4** *(blocked on Wave 3)*
- [x] 04-05-PLAN.md — /about page + Person schema + RU-only nav gate (D-01..D-03, D-16)

**Wave 5** *(blocked on Wave 4)*
- [x] 04-06-PLAN.md — Anchor guide bilingual + FaqBlock + landing FAQ + HowTo/FAQPage schemas + EN_SIBLINGS sync (D-04..D-08)

**Wave 6** *(blocked on Wave 5)*
- [x] 04-07-PLAN.md — llms.txt + llms-full.txt postbuild script (D-11)

### Phase 4.1: Content surface cleanup *(INSERTED 2026-05-17)*
**Status**: Scope captured 2026-05-17 in `phases/04.1-content-surface-cleanup/04.1-CAPTURED-DECISIONS.md` (18 findings + 3 user-confirmed decisions). Canonical GSD pipeline (spec → discuss → plan → execute) pending. Ad-hoc plan was scrapped via `d3b24c2`; this row exists so `roadmap analyze` discovers the phase.
**Goal**: Close the 9 warnings + 6 info findings from `04-REVIEW.md` (WR-01..09 + IN-01..06) AND fix 3 user-reported bugs (B-01 free-tier copy purge, B-02 Magnific mentions in supported-sites copy, B-03 EN `/about` sibling) without regressing the post-revert `/pay` baseline locked in commit `f9dfdb1`.
**Depends on**: Phase 4 (cleans up its review hangover); Phase 3 (uses `/en/*` routing for B-03).
**Hard constraints**:
  - No changes to `EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (INTEGRATION-CONTRACT locked).
  - No changes to locked routes; `/pay` + `/en/pay` keep synchronous Paddle CDN script and `prerender: "full"` tier.
  - No regressions to Phase 4 build-time gates — all 14 prerendered routes keep their titles/meta/canonical/hreflang/JSON-LD.
  - Wave 9 (PayPage.tsx — payment surface) + Wave 12b (new `/en/about` product surface) **REQUIRE EXPLICIT APPROVAL** before commit per autonomy memory (extension-coupled / new product surface).
  - Preserve the `f9dfdb1` post-revert pricing-card baseline: runtime-conditional CTA pattern (SSR Chrome Store anchor → hydration swap to Pay button); do NOT recreate `PricingStaticBlock` or the runtime CTA rail.
**Success Criteria** (refined during planning):
  1. All 9 warnings (WR-01..09) and 6 info findings (IN-01..06) from `04-REVIEW.md` are remediated or formally deferred with rationale.
  2. Free-tier copy is purged from rendered HTML (`grep -ri "10 проверок\|10 generations\|free tier\|бесплатн.* проверк" dist/` returns 0 hits); install/registration "free" copy stays (factually true).
  3. Magnific is mentioned alongside Freepik in supported-sites copy across FAQ + About + welcome i18n (text only — no partner logo); `grep -ic "magnific"` ≥1 on landing + about + welcome RU/EN.
  4. `/en/about` exists as a full prerendered route with EN body content, `<html lang="en">`, reciprocal hreflang triplets, LangSwitcher round-trips RU `/about` ↔ EN `/en/about`, sitemap includes both with `xhtml:link` annotations.
  5. New build-time gate (`scripts/verify-faq-mainentity.mjs`) enforces V-10 (visible FAQ Q/A == JSON-LD mainEntity parity) as a hard fail.
  6. Path-traversal guard + broader HTML entity decoder land in `scripts/llms.mjs`; new build-time SSR-body-length assert lands in `scripts/prerender.mjs`.
  7. `npm run build` clean; bundle sizes within ±5% of pre-4.1 baseline.
  8. Post-4.1 `dist/pay/index.html` still has both pricing cards with `199₽` and `299₽` visible, Paddle synchronous `<script>`, Chrome Store SSR-CTA anchor, and `productBlock(...)` schema with at least one paid Offer (no Free tier entry).
**Plans**: 13 atomic commits sketched in `04.1-CAPTURED-DECISIONS.md` (9 review-driven waves W1-W9 + 3 user-bug waves W10-W12b + 1 refactor split W12a). Wave grouping is a starting hypothesis — `gsd-plan-phase` may regroup. Wave 9 + Wave 12b carry hard approval gates.

Plans:
- [ ] *(to be generated by `/gsd-plan-phase 4.1` — captured-decisions seed provides 13-wave hypothesis as input)*

### Phase 4.2: SEO/GEO polish (post-synthesis) *(INSERTED 2026-05-17)*
**Status**: Scope captured 2026-05-17 in `.planning/research/SEO-REVIEW-SYNTHESIS-2026-05-17.md` (5 P0 + 7 P1 actionable items + 3 user decisions). Canonical GSD pipeline (spec → discuss → plan → execute) pending.
**Goal**: Close the actionable SEO/GEO gaps identified by the dual Codex CLI review (with + without GEO frame) layered on top of the morning's internal GEO audit — without touching extension-coupled invariants and without preempting the strategic architecture refactor reserved for Phase 6.
**Depends on**: Phase 4.1 (cleanup foundation), morning GEO-batch quick-task `260517-t5i` (10 atomic fixes already shipped).
**Source artifacts**:
  - `.planning/research/SEO-REVIEW-SYNTHESIS-2026-05-17.md` — primary scope (P0/P1/P2/decisions/external)
  - `.planning/research/CODEX-SEO-REVIEW-2026-05-17.md` — classical SEO lens (Codex CLI without GEO frame)
  - `.planning/research/CODEX-GEO-REVIEW-2026-05-17.md` — GEO lens (Codex CLI with GEO frame, composite 72.6/100)
  - `.planning/research/GEO-AUDIT-2026-05-17.md` — internal baseline (composite 63/100 before morning fixes)
**Hard constraints**:
  - No changes to `EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
  - No renames of locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`).
  - All `/pay`, `/welcome`, `/account`, `/dashboard/*` touches **REQUIRE EXPLICIT APPROVAL** before commit (extension-coupled surface — per `feedback_autonomy_and_caution.md`).
  - CSP header change (P1-2) **REQUIRES EXPLICIT APPROVAL** — must not break Paddle, Supabase REST/Functions, or `externally_connectable` extension messaging.
  - Preserve the 10 morning-shipped fixes — do NOT re-recommend or revert them.
  - Locked routes keep their semantics: `/pay` synchronous Paddle CDN script, `/success` YooKassa return_url shape, `/welcome` extension first-install nav target.
**Success Criteria** (refined during planning):
  1. **P0-1**: Single canonical model count consistent across `scripts/seo-routes.ts` (Organization, SoftwareApplication, Product, landing/EN landing meta), `src/content/about.tsx`, `src/content/landingFaq.ts`, `src/i18n/{ru,en}.json` (8 known drift points — no more `43+` vs `60+`).
  2. **P0-2**: `public/sitemap.xml` fallback either removed (so Vite skips it and `scripts/sitemap.mjs` is the only emitter) or regenerated to cover all 16 prerendered routes with reciprocal `xhtml:link` hreflang annotations.
  3. **P0-3**: Visible `<h1>` on `/pay`, `/welcome`, `/en/pay`, `/en/welcome` — routes stay locked; only page markup changes.
  4. **P0-4**: `Disallow: /api/` added to all 15 AI-crawler blocks in `public/robots.txt` + `X-Robots-Tag: noindex, nofollow` header in `vercel.json` for `/account*`, `/success*`, `/dashboard/*`, `/api/*` (and `/en/*` analogues where applicable).
  5. **P0-5**: `aggregateRating` in `SoftwareApplication` (`scripts/seo-routes.ts:125,128`) and `Product` (`scripts/seo-routes.ts:230,233`) schema verified against live Chrome Web Store listing — values updated to match OR `aggregateRating` removed until honest review count accumulates.
  6. **P1-1**: Catch-all `<Route path="*" element={<NotFound/>}/>` in `src/main.tsx` with proper 404 UX and `<meta name="robots" content="noindex">`; Vercel rewrite preserved.
  7. **P1-2 (APPROVAL-GATED)**: `Content-Security-Policy` header in `vercel.json` permissive enough for Paddle (`*.paddle.com`), Supabase (`*.supabase.co`), self-hosted fonts, inline JSON-LD; tested against `/pay` Paddle modal, `/account` extension auth round-trip, and `/dashboard/download-skill`.
  8. **P1-3**: Hreflang locale code policy decided (D-3) and applied uniformly across `scripts/prerender.mjs` (`applyHreflang`), `scripts/seo-routes.ts` (RouteMeta.hreflangAlternates), and `scripts/sitemap.mjs` (`xhtml:link` annotations).
  9. **P1-4**: Bing Webmaster verification meta tag in `index.html` + IndexNow ping integrated into `scripts/sitemap.mjs` (or as a postbuild step) emitting POST to `api.indexnow.org` with current URL list.
  10. **P1-5**: Welcome carousel — unique descriptive `alt` per active slide + `loading="lazy"` for non-active slides (`src/app/pages/WelcomePage.tsx:56-63`).
  11. **P1-6**: Founder image asset (WebP, 400×400, ≤50KB) committed under `public/` + `Person.image` field populated in `scripts/seo-routes.ts:164` + visible `<img>` replaces initials placeholder in `src/app/pages/AboutPage.tsx:35,39`.
  12. **P1-7**: Stale documentation swept — CLAUDE.md (route counts), docs/ARCHITECTURE.md (12 prerendered → 16), src/i18n/paths.ts header comment (6 → 8 EN siblings).
  13. **Decisions** D-1 (definitional paragraph placement), D-2 (canonical model count), D-3 (hreflang locale policy) resolved during `gsd-discuss-phase 4.2` and recorded in `04.2-CONTEXT.md` or `04.2-DECISIONS.md`.
  14. `npm run build` clean; FAQ-parity gate (`scripts/verify-faq-mainentity.mjs`) green; all 16 routes still prerender with correct meta/canonical/hreflang/JSON-LD; no regression to Phase 4/4.1 invariants.
**Plans**: TBD (`/gsd-plan-phase 4.2` generates wave structure from this scope; expected 10-13 atomic commits across ~4-5 waves with approval gates around P0-3, P0-4, P1-2).

### Phase 5: Brand authority
**Status**: Backlog. Scope set; detailed planning deferred.
**Goal**: Disambiguate "Opten" from the Hungarian legal DB and Australian company that currently dominate search results for the brand name, and accumulate citable third-party signals.
**Depends on**: Phase 4 (need real content to point at from authority sites).
**Requirements**: GEO-E-1, GEO-E-2, GEO-E-3, GEO-E-4
**Audit findings closed**: H-4 (brand collision), M-5 (no Wikipedia/Reddit/YouTube presence)
**Success Criteria** (sketch, refined during planning):
  1. Product Hunt launch live with referral traffic measurable.
  2. Wikipedia entry or disambiguation page exists referencing opten.space.
  3. At least one Reddit thread + at least one YouTube video link back to opten.space and are referenced in `sameAs`.
  4. `Organization` JSON-LD `sameAs` array expanded to include all newly-acquired authority URLs.
**Plans**: TBD

### Phase 6: Scale-ready content architecture *(BACKLOG — added 2026-05-17)*
**Status**: Backlog. Scope sketched in `.planning/research/SEO-REVIEW-SYNTHESIS-2026-05-17.md` §"Готовность к масштабу — 100+ keyword-таргетированных страниц" + §"P2 — стратегические". Detailed planning deferred until content strategy (which page archetypes, how many, in what locales) is decided.
**Goal**: Refactor route inventory, schema templating, and build-time gates so adding 100+ keyword-targeted pages becomes data-driven (1 content file per page) instead of touching 6 source files per route.
**Depends on**: Phase 4.2 (polish foundation). Independent of Phase 5 (brand authority can ship in parallel).
**Rationale**: Both Codex prongs of the 2026-05-17 review independently flagged the current route inventory (split across `scripts/seo-routes.ts`, `src/main.tsx`, `scripts/entry-server.tsx`, `src/i18n/paths.ts`, `scripts/sitemap.mjs` PATH_TO_SOURCE, `scripts/llms.mjs`) as the primary blocker for programmatic SEO at scale. Composite GEO Score 72.6/100 (post-morning-fixes) holds steady on Technical (88) but Schema templating gaps (84) + missing /guides hub + llms-full.txt 50KB cap will degrade as page count grows.
**Scope sketch** (NOT yet planned):
  1. **RouteRecord type** — `{ slug, localeGroupId, archetype, sourceFile, primaryKeyword, schemaInputs }` + generated `scripts/seo-routes.generated.ts` (single source of truth replacing 6).
  2. **Schema archetype builders** — `LandingPage`, `PricingPage`, `AboutPage`, `LegalPage`, `GuideArticle`, `GuideHub` (`CollectionPage`+`ItemList`), `ComparisonPage`, `ChangelogPage`; optional `VideoObject` attachment per page.
  3. **/guides hub route** (RU + EN) with `CollectionPage`/`ItemList` schema — prerequisite before publishing 2nd guide; restores 3-level breadcrumbs.
  4. **Build-time gates** — duplicate `primaryKeyword`, `wordCount ≥ 300`, missing reciprocal locale pair, citability check (H1 present, answer block 40-80 words in first section, byline/date parity when Article schema used, `speakable.cssSelector` matches existing DOM).
  5. **Sitemap index + sharded sitemaps** — `/sitemap.xml` index → `/sitemap-marketing.xml`, `/sitemap-guides.xml`, `/sitemap-legal.xml` (operational not protocol limit-driven). Sharded llms: `/llms.txt` index + `/llms/<archetype>.txt` bodies (replaces 50KB cap that drops legal pages).
  6. **Generated `RelatedLinks` component** for internal linking based on RouteRecord graph (archetype + tags + localeGroupId).
**Success Criteria** (sketch, refined during planning):
  1. Adding a new keyword-targeted page requires editing ONE content file, not six source files (current state).
  2. Build-time gate rejects new pages that fail citability OR duplicate-keyword check; CI fails fast.
  3. 100+ routes can ship without sitemap or llms-full.txt running into operational/size limits.
  4. No regression to Phase 4/4.1/4.2 invariants — extension contract paths, hreflang reciprocity, FAQ-parity, JSON-LD validity all preserved.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5. Phases 1 and 2 are planned in detail; Phases 3–5 require their open questions resolved before planning begins.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Static GEO foundations | 8/8 | Shipped 2026-05-14 | 2026-05-14 |
| 2. Per-route prerender + metadata | 8/8 | Complete   | 2026-05-16 |
| 2.1. Hydration speedup & perceived-load opt | 7/7 | Complete (PageSpeed Mobile 91 / CLS 0 / TBT 0 ms) | 2026-05-16 |
| 2.2. Mobile-perf + Safari fixes | inline (~5 commits, no per-task plans) | Complete (shipped inline; retroactive note in `02.1-VERIFICATION.md`) | 2026-05-16 |
| 3. Bilingual routing | 8/8 | Complete   | 2026-05-16 |
| 4. Content surface | 6/7 (04-02 replaced by 04-LCP-AUDIT Option-1 defer) + UAT 6/6 | Complete | 2026-05-17 |
| 4.1. Content surface cleanup | 13/13 + review fixes | Complete (8/8 ROADMAP criteria PASS code/build; post-deploy UAT deferred) | 2026-05-17 |
| 4.2. SEO/GEO polish (post-synthesis) | 0/TBD | Scope captured — ready for `/gsd-spec-phase 4.2` | - |
| 5. Brand authority | 0/TBD | Backlog (off-site, not auto-executable) | - |
| 6. Scale-ready content architecture | 0/TBD | Backlog (deferred until content strategy decided) | - |

---
*Roadmap defined: 2026-05-14*
*Last updated: 2026-05-17 — Phase 4.2 inserted as post-synthesis SEO/GEO polish (5 P0 + 7 P1 + 3 decisions from `.planning/research/SEO-REVIEW-SYNTHESIS-2026-05-17.md`); Phase 6 backlog placeholder added for scale-ready architecture refactor (prerequisite for 100+ keyword pages). Phase 5 (brand authority) remains backlog — off-site work user stopped autonomous on 2026-05-17. Composite GEO Score trajectory: 63 (baseline 2026-05-17 morning) → ~72.6 (after 10 atomic morning fixes, dual Codex review) → target ~80+ after Phase 4.2 ships.*
*Earlier note (2026-05-15): Phase 2 lesson-learned — SPA-fallback routes (`/account`, `/success`, `/dashboard/*`) need a path-marker check in `main.tsx` to avoid React #418/#423 hydration mismatch — the initial Phase 2 deploy (`b241989`) was rolled back via `vercel rollback` after playwright surfaced this regression in production. Future prerender phases must include a playwright sweep across ALL routes (not just prerendered ones) as an acceptance gate.*
