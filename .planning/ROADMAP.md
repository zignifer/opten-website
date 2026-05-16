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
- [ ] **Phase 4: Content surface** — `/about` E-E-A-T page + `/guides/*` HowTo content + FAQ schema (closes audit M-3, M-4, H-3)
- [ ] **Phase 5: Brand authority** — Product Hunt + Wikipedia + Reddit + YouTube + expanded `sameAs` schema (closes audit H-4, M-5)

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
**Status**: Backlog. Scope set; detailed planning deferred.
**Goal**: Establish E-E-A-T signals and indexable answer content so AI assistants have material to cite when answering prompt-engineering questions.
**Depends on**: Phase 3 (content surface should ship bilingual or with the chosen language strategy applied).
**Requirements**: GEO-D-1, GEO-D-2, GEO-D-3
**Audit findings closed**: M-3 (no FAQ schema), M-4 (no HowTo content), H-3 (no `/about` E-E-A-T surface)
**Success Criteria** (sketch, refined during planning):
  1. `/about` page exists with founder bio, Telegram contact, and credentials sufficient to satisfy E-E-A-T audit.
  2. At least one `/guides/*` HowTo article exists, structured per schema.org HowTo, with at least three steps.
  3. Landing page carries `FAQPage` JSON-LD; question/answer pairs sourced from real user questions.
**Plans**: TBD

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
| 4. Content surface | 0/TBD | Backlog | - |
| 5. Brand authority | 0/TBD | Backlog | - |

---
*Roadmap defined: 2026-05-14*
*Last updated: 2026-05-16 — Phases 02, 02.1, 02.2 all in production. Phase 02.1 verified via PageSpeed Mobile (score 91 / CLS 0 / TBT 0 ms). Phase 02.2 shipped inline as ~5 atomic commits (`0a73069` → `81284d4`) without per-task plan artifacts; retroactive note in `02.1-VERIFICATION.md`. Next: Phase 3 discuss (in progress in a separate context) — resolves per-language URL strategy.*
*Earlier note (2026-05-15): Phase 2 lesson-learned — SPA-fallback routes (`/account`, `/success`, `/dashboard/*`) need a path-marker check in `main.tsx` to avoid React #418/#423 hydration mismatch — the initial Phase 2 deploy (`b241989`) was rolled back via `vercel rollback` after playwright surfaced this regression in production. Future prerender phases must include a playwright sweep across ALL routes (not just prerendered ones) as an acceptance gate.*
