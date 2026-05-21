# Codebase Concerns

**Analysis Date:** 2026-05-21

## Tech Debt

### Duplicated Hardcoded Constants — High-Risk Sync Issue

**Issue:** `EXTENSION_IDS`, `SUPABASE_ANON_KEY`, and `SUPABASE_URL` are hardcoded in three site files plus the Vercel serverless function. Any rotation/update requires coordinated edits across all copies.

**Files:**
- `src/app/pages/PayPage.tsx` (lines 11-17)
- `src/app/pages/AccountPage.tsx` (lines 7-13)
- `src/app/pages/DownloadSkillPage.tsx` (lines 5-8)
- `api/download-skill.ts` (lines 14-16)

**Impact:** 
- Misses on even one file break extension-site communication or fail payment/auth flows silently.
- Change requires grep-and-replace across 4 files; easy to miss one under time pressure.
- **Breaking change risk:** If `EXTENSION_IDS` changes (extension re-uploaded to Chrome Web Store as new listing), users on old extension versions will get "not installed" false negatives until they update.

**Fix approach:** Extract constants to a single shared module (`src/lib/constants.ts`) that both client pages and the serverless function import from. This:
- Eliminates duplication
- Makes updates atomic (one change = all four locations fixed)
- Provides a single audit point for INTEGRATION-CONTRACT changes
- Requires updating the serverless import path once (ongoing cost: zero)

### No Automated Tests — Fragile Refactoring Risk

**Issue:** No test framework, no linting, no `typecheck` script. Correctness relies entirely on `vite build` catching TypeScript errors and post-build verification scripts (FAQ parity, fonts gate, model registry validation).

**Files:** Project-wide. Evidence: `package.json` has no `jest`, `vitest`, or `test` script.

**Impact:**
- Refactoring core logic (`LangProvider`, hydration discriminator `__PRERENDER_PATH`, `LocalizedLink` path rewriting) carries high risk of silent failures.
- Build gates catch SEO schema drift but not business logic bugs (e.g., subscription status being inverted in `AccountPage`).
- No regression coverage for past issues (e.g., React #418 hydration mismatch, Safari blur-induced unresponsiveness).

**Safe modification:** Before changing any of these modules, run `npm run build` locally and test on a real device (especially mobile Safari):
- `src/main.tsx` — hydration discriminator
- `src/i18n/LangContext.tsx` — language detection and SSR safety
- `src/app/components/LocalizedLink.tsx` — path rewriting for EN siblings
- `api/download-skill.ts` — auth + Pro check logic

**Priority:** Medium. The prerender + build-gate pipeline catches obvious breakage (missing routes, schema corruption), but missing edge-case logic bugs.

---

## Known Bugs

### React Hydration Mismatch — History of Recurrence (Fixed 2026-05-21)

**Symptoms:** Buttons unresponsive for 1-3 seconds after page load on iOS Safari. Occasional "full client re-render" events in the console.

**Root cause:** Multiple overlapping issues, last resolved in commit `fdc5786`:
1. Heavy `filter: blur(285px)` on hero gradient + `backdrop-filter` on header exhausted iOS WebKit's main thread during paint.
2. `/en/*` routes had LangContext dicts.en eager-loaded only on SSR, not on the client, causing a hydration mismatch on first client render.
3. Minor: `fetchPriority` JSX camelCase attribute (React 18.3 doesn't normalize) → mismatch with SSR lowercased output.

**Files:**
- `src/styles/theme.css` (hero blur)
- `src/app/components/SiteHeader.tsx` (backdrop-filter)
- `src/i18n/LangContext.tsx` (dicts.en initialization)
- `src/app/App.tsx` (fetchPriority comment, lines 72-76)
- Resolution history: `.planning/research/SAFARI-MOBILE-INTERACTIVITY.md`

**Current status:** **RESOLVED**. All three causes were fixed and tested on a real iPhone. The issue demonstrated that Lighthouse/PageSpeed (Chromium-based) cannot detect WebKit-specific paint/composite bugs — green lab scores can coexist with a broken real-device experience.

**Lesson learned:** For any future "slow on Safari" complaint, profile with Safari DevTools on a real device, not lab tools.

---

### React #418 / #423 — Hydration Mismatch Family

**What happens:** React throws `Warning: Did not expect server HTML to contain a <div> in <div>` when the client tree diverges from the prerendered server output. Fallback: React does a full client-side re-render, wiping the hydrated state and re-attaching event listeners — causes 1-3 s button-unresponsiveness on mobile.

**Documented instances and fixes:**

| Issue | Files | Root Cause | Fix |
|-------|-------|-----------|-----|
| Hydration discriminator missing `__PRERENDER_PATH` check | `main.tsx` lines 38-51 | SPA rewrite at uncovered routes serves stale prerendered HTML from `/` | Check `window.__PRERENDER_PATH === window.location.pathname` before hydrating |
| EN dict absent on client during `/en/*` hydration | `LangContext.tsx` lines 43-49 | dicts.en was SSR-only; first client render on /en/* fell back to RU | Eagerly import `en.json` on the client (`enFallback`) |
| JSX whitespace between expressions | `App.tsx` lines 210-214 | SSR emits `<!-- -->` delimiters between text and expressions; client reconciliation fails | Fold whitespace into the preceding expression so no adjacent text nodes exist |
| `fetchPriority="high"` camelCase attribute | `App.tsx` lines 72-76 | React 18.3 doesn't normalize camelCase JSX → SSR outputs lowercase, client sees uppercase mismatch | Use `fetchpriority` (lowercase) directly or defer to React 19 |

**Why it matters:** Each mismatch is a silent correctness bug that only shows up on real devices and only under specific browser/SSR conditions. Lab tools (Lighthouse) don't reproduce it.

---

## Security Considerations

### Supabase Anon Key Hardcoding — Acceptable Risk with Caveats

**Risk:** `SUPABASE_ANON_KEY` is bundled into the client (`vite build` copies it into `src/**/*.tsx` imports). An attacker can extract it from the network or JS bundle.

**Current mitigation:**
- The key has `role="anon"` — restricted to unauthenticated Supabase operations only.
- Real secrets (service role, Paddle/YooKassa private keys) live in the extension repo's Edge Function secrets, not the site.
- The site never handles payment secrets directly — it only calls `create-payment`/`create-payment-paddle` Edge Functions and reads the public `subscriptions` table via RLS.
- RLS (Row-Level Security) on the subscriptions table ensures users can only read their own rows.

**Files:** `src/app/pages/PayPage.tsx:12`, `src/app/pages/AccountPage.tsx:8`, `api/download-skill.ts:15`

**Recommendations:**
- Consider wrapping Supabase REST calls through the site's own serverless function (`api/download-skill.ts` pattern) instead of direct client REST API access. This would let the backend rotate keys without redeploying the frontend.
- For now, the current setup is acceptable because:
  - `SUPABASE_ANON_KEY` has only `anon` role (limited to public/RLS-protected operations).
  - User data is protected by RLS, not by secret key strength.
  - The real secrets live on the extension side (Edge Function secrets).

---

### Extension-Coupled Routes — Breaking-Change Risk

**Risk:** Three routes are locked in the extension's manifest (`externally_connectable`) and already shipping to users:
- `/welcome` — extension navigates here on first install
- `/pay` — extension opens this from popup upgrade CTA
- `/success` — YooKassa redirects here after payment

**Files:** `src/main.tsx` (route definitions), locked by `docs/INTEGRATION-CONTRACT.md` §3

**Current mitigation:** The routes are documented as locked in `docs/INTEGRATION-CONTRACT.md`. The build process (`scripts/prerender.mjs`) includes them explicitly.

**Recommendation:** If a route ever needs to be renamed:
1. Keep the old route and emit a 301/302 redirect to the new one.
2. Update `docs/INTEGRATION-CONTRACT.md` with the redirect rule.
3. Ship the site change first, then update the extension in a follow-up release.
4. After the extension reaches broad deployment, the old redirect can be removed (months later).

---

### Pro-Gating Defense in Depth — Redundant but Correct

**Setup:** The `/api/download-skill` endpoint checks both:
1. JWT validity (line 59-74)
2. `plan='pro'` AND `status IN ('active','cancelled')` subscription check (line 84-101)

**Why redundant checks matter:** The extension also prevents Pro-gated UI from appearing to Free users, but defense-in-depth ensures a Free user cannot directly call `/api/download-skill` and bypass the extension check.

**Files:** `api/download-skill.ts` (lines 56-105)

**Recommendation:** Keep both checks. The redundancy is intentional and correct.

---

## Performance Bottlenecks

### 62 Model Content Files in Entry Chunk — FIXED

**What was:** All 62 model pages' content (`src/content/models/<slug>.ts`) were imported into the entry chunk, bloating it by ~93 KB.

**Resolution:** Fixed in commit `dfdd68d` (Phase v2.0 post-launch) by:
- Splitting model content into a separate chunk loaded only when visiting `/models/:slug`.
- Lazy-loading model metadata via `src/content/models/index.client.ts` (asynchronous fallback).
- Entry chunk reduced from ~120 KB to ~27 KB (gzipped).

**Files:** `src/main.tsx`, `src/content/models/index.client.ts`, `src/app/pages/ModelPage.tsx`

**Current status:** Resolved. No action needed.

---

### Hero Gradient Blur — FIXED

**What was:** `filter: blur(285px)` on `src/styles/theme.css` `.opten-figma-gradient::before` saturated iOS Safari's paint pipeline during load and on every scroll frame.

**Resolution:** Fixed in commit `fdc5786`:
- Reduced blur from `285px` to `140px` on desktop, `150px` to `75px` on mobile.
- Dropped `will-change: transform` which was pinning a huge compositor layer.
- Dropped `backdrop-filter` on mobile (header is now opaque on small screens, frosted only on desktop).

**Impact:** Speed Index **4.2 s → 2.4 s**, TBT **70 ms → 0 ms** (measured on Lighthouse mobile lab).

**Files:** `src/styles/theme.css`, `src/app/components/SiteHeader.tsx`

**Current status:** Resolved. No action needed.

---

## Fragile Areas

### Prerender + Hydration Path — Load-Bearing for Extension Deep-Links

**Files:**
- `src/main.tsx` (lines 38-51, hydration discriminator)
- `src/i18n/LangContext.tsx` (lines 43-49, dicts.en initialization)
- `scripts/entry-server.tsx` (SSR entry point)
- `scripts/prerender.mjs` (HTML generation + `__PRERENDER_PATH` marker)

**Why fragile:**
1. The `window.__PRERENDER_PATH` discriminator is the **only** signal distinguishing "extension deep-link to /account (SPA fallback)" from "user hit the landing page directly." If this discriminator breaks, SPA-only routes receive stale prerendered HTML from `/` and React hydration fails → buttons unresponsive.
2. The `__PRERENDER_PATH` value is written by `prerender.mjs` and must match `location.pathname` exactly. Any mismatch = full client re-render.
3. React lazy-loading is **unsafe** on any route that goes through `renderToString` + `hydrateRoot`. Only `/success`, `/account`, `/dashboard/*` (SPA-only) can use `React.lazy()`.

**Safe modification:**
- Before changing the hydration check (main.tsx lines 96-104), test `/account`, `/success`, `/dashboard/download-skill` on a real device (especially iOS Safari).
- Before adding a new SSR-prerendered route, ensure its React tree does NOT use `React.lazy()`.
- Before modifying `__PRERENDER_PATH` generation, verify all 144 prerendered routes emit the marker correctly.

**Verification commands:**
```bash
npm run build                    # Prerender + verify gates
# Manual: inspect dist/account/index.html — should NOT contain window.__PRERENDER_PATH
# Manual: inspect dist/pay/index.html — should contain window.__PRERENDER_PATH="/pay"
# Real device: navigate from landing to /account, verify buttons respond immediately
```

---

### Model Registry Auto-Generation — Content Freshness Risk

**Files:**
- `scripts/build-models-registry.mjs` (parses `_skills/*.md` → emits `_registry.ts`)
- `scripts/sync-skills.mjs` (syncs skill MDs from promptscore-proxy)
- `src/content/models/_registry.ts` (AUTO-GENERATED, do not hand-edit)
- `src/content/models/metaEn.ts` (hand-maintained EN overrides)

**Why fragile:**
1. The registry is auto-generated from RU skill MD files. If a skill is added/removed/renamed upstream (in `promptscore-proxy`), the site's registry drifts unless `sync-skills.mjs` is run.
2. The generation normalizes RU-language metadata (name, platform, duration, resolution) verbatim into `_registry.ts`. EN translations come from hand-maintained `metaEn.ts` overrides. If a new model lands, EN-side `metaEn.ts` must be populated before the route can ship — otherwise EN pages display Cyrillic text (caught by `verify-models-content.mjs` build gate).
3. The 62 model slugs are derived from the skill file names. If a slug changes, `src/content/models/slugs.ts` is auto-populated but the hand-written content files (`src/content/models/<slug>.ts`) must be renamed/created separately.

**Safe modification:**
- After `sync-skills.mjs` pulls new skills from upstream, always run `npm run build` to regenerate `_registry.ts` and validate the build gates.
- Before committing a new model:
  1. Ensure its `_skills/<slug>.md` was synced.
  2. Run `scripts/build-models-registry.mjs` to update `_registry.ts`.
  3. Create `src/content/models/<slug>.ts` with `ModelContent = { ru, en }`.
  4. Add EN metadata to `src/content/models/metaEn.ts` for any Cyrillic-containing fields (platform, duration, resolution).
  5. Run `npm run build` and verify no Cyrillic leaks into EN pages (build gate: `verify-models-content.mjs`).
  6. Verify the model appears in `/models` hub and `/models/<slug>` page prerender.

---

### i18n Path Rewriting — Sync Points with seo-routes.ts

**Files:**
- `src/i18n/paths.ts` (defines `EN_SIBLINGS`, used by `<LocalizedLink>`)
- `scripts/seo-routes.ts` (defines the canonical list of EN prerendered routes)

**Why fragile:**
- `EN_SIBLINGS` in `paths.ts` must be kept in sync with the EN entries in `seo-routes.ts`.
- When a new route is added (e.g., a blog post), the developer must:
  1. Add it to the RU route list in `seo-routes.ts`.
  2. Add the EN sibling to `seo-routes.ts` (immediately after the RU entry).
  3. Add the EN path to `STATIC_EN_SIBLINGS` in `paths.ts` (if it's static) OR ensure it's derived from `MODEL_SLUGS_WITH_CONTENT` (if it's a model page).
  4. Run `npm run build` to verify `EN_SIBLINGS` is populated and prerender completes.
- Missing even one of these steps breaks language switching on the new route (LangSwitcher tries to navigate to a non-existent `/en/...` URL, falls back to in-place language flip).

**Safe modification:**
- Always grep for "EN_SIBLINGS" and "seo-routes.ts" when adding a new page.
- The full checklist is in `docs/CONTENT-AUTHORING.md` (6-file coordination).

---

## Scaling Limits

### Prerender Build Time — Linear with Route Count

**Current load:** 144 routes (9 static RU + 9 static EN + 62 RU model pages + 62 EN model pages + catch-all 404).

**Scaling:** The prerender script (`scripts/prerender.mjs`) is single-threaded and sequential:
- For each route: load template → render SSR → splice head/body → write file.
- Current build: ~10-15 s on a modern machine (dominated by Vite build, not prerender).
- Bottleneck: Node.js file I/O (writeFile per route) is not parallelized.

**Expansion plan:**
- Adding 50 more models would add ~100 more routes (RU + EN pairs).
- Build time would scale roughly linearly: ~20-25 s total (still acceptable for deploy pipeline).
- If the site ever reaches 500+ routes, parallelizing prerender (e.g., `piscina` worker pool) would be needed.

**Current status:** No action needed. The build completes in <30 s.

---

### Model Content — Slug-Driven Routing

**Current load:** 62 models × (RU content + EN metadata) = manageable within Vite's bundler.

**Risk:** If the extension proxy ever expands to 200+ models, the prerender time and bundle size could become bottlenecks. At that point:
- Consider lazy-loading model content (already supported by `ModelPage.tsx` via `loadModelContent()`).
- Consider moving model metadata to a lightweight JSON manifest instead of TS imports.

**Current status:** No action needed. 62 models is a comfortable range.

---

## Dependencies at Risk

### Paddle.js v2 SDK — Env-Var Flip Risk

**Risk:** `VITE_PADDLE_ENV` can be set to `'sandbox'` or `'production'` in Vercel. Switching environments requires updating the Paddle priceIds in the extension's `create-payment-paddle` Edge Function **in the same deploy**.

**Files:**
- `src/lib/paddle.ts` (initializes SDK with `VITE_PADDLE_ENV`)
- `src/app/pages/PayPage.tsx` (calls Paddle checkout)
- Extension's `create-payment-paddle` Edge Function (returns priceIds matching the env)

**Impact:** If the site is on sandbox prices but the extension returns production priceIds (or vice versa), users trying to upgrade will either:
- Get charged real money while testing on sandbox (bad).
- Get "price not recognized" errors while trying to upgrade (broken UX).

**Current mitigation:** The integration contract (`docs/INTEGRATION-CONTRACT.md` §6) explicitly states this risk and requires coordinated deploys.

**Recommendation:** If `VITE_PADDLE_ENV` ever needs to flip:
1. Coordinate with the extension repo owner.
2. Update the extension's `create-payment-paddle` Edge Function to match the new env.
3. Deploy the extension first (so users get correct priceIds).
4. Deploy the site within 1 hour (to start using the new env).

---

## Test Coverage Gaps

### Business Logic — Uncovered

**What's not tested:**
- Subscription state handling in `AccountPage` (cancellation flow, rendering of different plan states).
- Currency selection and storage persistence in `PayPage` (RUB vs USD).
- Extension message API error handling (`GET_AUTH_TOKEN` failures, `CANCEL_SUBSCRIPTION` timeouts).
- i18n language detection and persistence logic (`LangContext` state transitions).
- The `__PRERENDER_PATH` discriminator under various edge cases (direct link to `/account`, SPA navigation, browser back-button).

**Files:**
- `src/app/pages/AccountPage.tsx` (130+ lines, no tests)
- `src/app/pages/PayPage.tsx` (400+ lines, no tests)
- `src/i18n/LangContext.tsx` (150+ lines, no tests)
- `src/main.tsx` (lines 96-104, hydration discriminator)

**Risk:** Medium to High.
- The prerender + build gates catch missing routes and schema drift (good).
- But they don't catch inverted logic, off-by-one errors in plan checks, or state machine bugs in multi-step flows.

**Safe modification:** Before shipping any changes to these files, manually test the affected flow end-to-end on a real device:
- **PayPage:** Install the extension, navigate to /pay (direct + SPA nav), switch currencies, complete a fake checkout.
- **AccountPage:** Test with a Pro subscription and a Free account, verify cancel buttons enable/disable correctly.
- **LangContext:** Navigate between /en/*, unprefixed routes, use LangSwitcher, refresh page, verify storage persists.

---

### SEO Schema & Prerender Gates — Partially Covered

**What is tested:**
- FAQ parity: `verify-faq-mainentity.mjs` asserts visible FAQ block == FAQPage schema (4-route floor check).
- Font subsetting: `verify-fonts.mjs` asserts all used glyphs are in the subset.
- Model registry: `verify-models-content.mjs` asserts no Cyrillic leaks into EN meta fields.
- Route manifest: `scripts/prerender.mjs` throws if SSR bundle fails to render a route.

**What is NOT tested:**
- JSON-LD schema graph correctness beyond FAQ (e.g., missing required fields, invalid type hierarchies).
- Open Graph image / og:locale correctness per-route.
- hreflang link reciprocity (e.g., if RU route links to EN, EN route must link back to RU).
- Sitemap.xml compliance (schema, URL order, lastmod freshness).

**Impact:** Low.
- Search engine crawlers are forgiving of minor schema errors (they skip unknown fields).
- The gates that DO run catch the highest-impact issues (missing routes, broken FAQ, Cyrillic leaks).

---

## Missing Critical Features

### HTTP 404 Status Code — Deferred

**What's missing:** The `/404` (catch-all NotFound route) currently returns HTTP 200, not 404. This confuses some bots and monitoring tools that expect 404 status for non-existent pages.

**Workaround:** The `<meta name="robots" content="noindex,nofollow">` tag is injected at runtime on NotFound pages, telling crawlers not to index typo'd URLs as duplicates.

**Files:** `src/app/pages/NotFound.tsx`, `docs/CONTENT-AUTHORING.md` (phase notes)

**Why deferred:** Vercel's SPA rewrite (configured in `vercel.json`) routes all uncovered paths to `/index.html`. Returning a 404 status code from the SPA shell requires a Vercel Edge Function or a custom error page — more complex than the current runtime noindex approach.

**Fix approach (Phase 6):** Add a Vercel Edge Middleware that intercepts 404 responses from the SPA and changes the status code, or ship a `404.html` (Vercel custom error page feature).

**Priority:** Low. The noindex meta tag is sufficient for now. Revisit when crawl budget becomes a concern (probably not for a small site).

---

## Summary Table

| Category | Issue | Severity | Status |
|----------|-------|----------|--------|
| Tech Debt | Duplicated constants (EXTENSION_IDS, SUPABASE_ANON_KEY) | High | Unresolved; extract to `src/lib/constants.ts` |
| Tech Debt | No automated tests | Medium | Unresolved; add test framework + suite |
| Known Bug | React hydration mismatch (Safari unresponsive buttons) | High | **RESOLVED 2026-05-21** |
| Known Bug | Hero blur + backdrop-filter perf | High | **RESOLVED 2026-05-21** |
| Security | Supabase anon key hardcoding | Low | Acceptable with RLS + limited role |
| Security | Extension-coupled locked routes | Medium | Documented in INTEGRATION-CONTRACT.md |
| Perf | Model content in entry chunk | High | **RESOLVED (commit dfdd68d)** |
| Fragile Area | Prerender + hydration discriminator | High | Working; test carefully on each change |
| Fragile Area | Model registry auto-generation | Medium | Working; verify build gates on each change |
| Fragile Area | i18n path rewriting sync points | Medium | Working; follow 6-file checklist per CONTENT-AUTHORING.md |
| Scaling | Prerender build time | Low | Acceptable at 144 routes; parallelize if >500 routes |
| Scaling | Model count expansion | Low | Manageable to ~200 models; lazy-load after |
| Dependency | Paddle.js env-var flip | Medium | Documented; requires coordinated deploy with extension |
| Coverage Gap | Business logic (subscriptions, auth, i18n) | Medium | No tests; manual end-to-end required before deploy |
| Coverage Gap | SEO schema + prerender | Low | Partial gates (FAQ, fonts, Cyrillic); main risks covered |
| Missing Feature | HTTP 404 status code | Low | Deferred to Phase 6; noindex meta is sufficient for now |

---

*Concerns audit: 2026-05-21*
