# Testing Patterns

**Analysis Date:** 2026-05-18

## Test Framework

**None in-repo.**

- No Vitest, Jest, Mocha, or Node test runner configured. No `vitest.config.*`, `jest.config.*`, or `playwright.config.*` in the repo (only inside `node_modules/`).
- No `*.test.*` or `*.spec.*` files under `src/`, `api/`, or `scripts/`.
- No test-related `devDependencies` in `package.json` (no `vitest`, `jest`, `@testing-library/*`, `playwright`, `cypress`, `msw`).
- No `test` script in `package.json` — only `dev` and `build`.

There is no unit, integration, or in-repo E2E test framework. Quality gates are enforced by `npm run build` and manual UAT patterns documented in `.planning/phases/*/HUMAN-UAT.md`.

## Test File Organization

Not applicable — no first-party tests in the repo. Manual UAT scripts live in `.planning/phases/<phase>/<phase>-HUMAN-UAT.md` and are written + executed by the orchestrator, not committed as runnable code.

## Mocking

Not applicable to test code (none exists). One related helper for manual QA: `scripts/mock-vercel-server.mjs` — a Node HTTP server that emulates Vercel's static-file-precedence-over-rewrite behavior. Serves `dist/` so that `dist/en/welcome/index.html` (etc.) wins over SPA fallback to `dist/index.html`, mirroring production. Used only for local Playwright/PageSpeed runs — not part of the build pipeline.

## Coverage

None measured. No coverage tool installed.

## Build-Time Quality Gates

The single in-repo automated quality check is `npm run build` (defined in `package.json`), which chains:

```bash
vite build                                                              # Client bundle
vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache         # SSR bundle
vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta             # Manifest
node scripts/prerender.mjs                                             # Static HTML per route
node scripts/sitemap.mjs                                               # Sitemap + floor checks
node scripts/llms.mjs                                                  # llms.txt + floor checks
node scripts/verify-faq-mainentity.mjs                                 # FAQ ↔ FAQPage parity
node scripts/indexnow.mjs                                              # Bing IndexNow ping
```

**TypeScript errors surface here** via `@vitejs/plugin-react` and the two `vite build --ssr` steps. There is **no `typecheck` script** and **no root `tsconfig.json`** — TS checking is best-effort and lossy: a file with broken types may still compile if the construct is stripped by SWC.

**No ESLint config** (`.eslintrc*` absent at root). **No formatter** (`.prettierrc*` absent).

### Fail-Fast Guards in Build Scripts

Build scripts implement defensive `throw` calls that act as lightweight correctness gates:

**prerender.mjs:**
- Every `apply*` helper (e.g., `applyHtmlLang`, `applyHreflang`, `applyOgLocale`) throws `if (html === before)` when its regex anchor doesn't match
- Pattern: `if (html === before) throw new Error('prerender(${meta.path}): no anchor matched...')`
- Surfaces SEO/structure drift loudly at build time instead of silently emitting broken `<head>` markup (Phase 2 D-08)
- Example from line 43: `if (!htmlLangRe.test(html)) throw new Error(...)`

**verify-faq-mainentity.mjs** (Phase 4.1 WR-09):
- Enforces V-10 (FaqBlock visible Q/A set == FAQPage mainEntity set)
- Fails the build if routes with `FAQPage` schema have diverged Q/A between visible DOM and JSON-LD
- Floor check: expects ≥4 FAQPage routes (landing RU + EN, blog post RU + EN per Phase 4 D-08)
- Pattern: `if (faqRoutes.length < 4) throw new Error(...)`

**sitemap.mjs:**
- Floor check: `if (sitemapRoutes.length < N) throw new Error(...)`
- Catches a mis-loaded manifest or forgotten route registration

**llms.mjs:**
- Floor check: `if (prerenderedRoutes.length < N) throw new Error(...)`
- Verifies llms.txt and llms-full.txt are generated with expected route count

**productBlock validation** (in scripts/seo-routes.ts):
- Price strings must be `Number()`-strict in `productBlock`
- Throws at build if a price is non-numeric

When adding a new build-time HTML mutator or manifest entry, follow the same `if (before === after) throw` pattern.

## Smoke Testing

**smoke-blog.mjs** (Phase 5 final verification):

```bash
npx playwright install chromium              # One-time setup
node scripts/smoke-blog.mjs                  # Ad-hoc invocation (not part of npm run build)
```

This script is **not part of `npm run build`** — invoked ad-hoc before blog-impacting commits.

**What it does:**
1. Spawns a Python HTTP server against `dist/` on port 8765
2. Launches Chromium via `playwright-core` (headless)
3. Navigates to blog routes and asserts JSON-LD shape + DOM structure

**Test surface:**

- `/blog/` (listing page):
  - Asserts `CollectionPage`, `ItemList`, `BreadcrumbList` JSON-LD types present
  - Checks canonical URL, hreflang triplets (≥3 tags)
  - Verifies H1 text, `.blog-intro` selector for speakable schema
  - Confirms ≥1 post card rendered

- `/blog/<slug>` (post page):
  - Asserts `BlogPosting`, `FAQPage`, `HowTo`, `BreadcrumbList` JSON-LD types present
  - Checks canonical URL, og:image points at cover.jpg
  - Verifies `.blog-intro` selector, `<time datetime>` ISO format
  - Confirms hamburger button presence

- `/en/blog/<slug>` (EN sibling):
  - Checks `BlogPosting` JSON-LD present
  - Verifies `<html lang="en">` attribute

- Landing `/`:
  - Confirms hamburger button, can click to reveal blog link
  - Tests no inline nav (menu-only)

- Legacy `/guides/<slug>` redirect check:
  - Asserts 404 locally (Vercel will 301 → `/blog/<slug>` in production per vercel.json)

**Output:** pass/fail count to stdout, exits with code 0 (all pass) or 1 (any fail).

## Manual QA Surfaces (Beyond Scripts)

**Local dev:**
```bash
npm run dev  # Runs on http://localhost:5173 with Vite HMR
```
Standard Vite HMR. Use Chrome DevTools. Note: dev mode runs without prerender, so SSR-vs-CSR differences (especially `<html lang>`) only show up against `vite preview` or Vercel.

**vite preview:**
```bash
npm run build
npx vite preview --host 127.0.0.1 --port 4180
```
Serves `dist/` as a static server with SPA fallback. Quirks (documented post-Phase-3):
- Trailing slashes: `/pay/` leaves `location.pathname === "/pay/"` (not in `EN_SIBLINGS`, so `LangSwitcher` falls back to `/en/`). Production-safe: Vercel normalizes via cleanUrls.
- Fallback precedence: `vite preview` falls back to `dist/index.html` for unmatched paths, masking the prerender-vs-fallback discriminator. Use `node scripts/mock-vercel-server.mjs` for accurate Vercel behavior simulation locally.

**Vercel previews:**
- Every push to a non-`main` branch builds a preview URL via Vercel
- `main` deploys to production (`opten.space`) — no staging environment

**Extension coupling (site-side only):**
- To exercise `/pay`, `/account`, `/welcome`, `/dashboard/download-skill` end-to-end you need the Opten Chrome extension installed and listed in `EXTENSION_IDS` (`src/app/pages/PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, `api/download-skill.ts`)
- Site-side QA without extension can only test `extStatus === "not_installed"` UI branch

**Paddle sandbox:**
- Set Vercel env `VITE_PADDLE_ENV=sandbox` + sandbox `VITE_PADDLE_CLIENT_TOKEN` on a preview deployment to test USD checkout without charging real cards
- Production uses regular project settings

**YooKassa:**
- Sandbox flow is server-side, owned by extension repo's Supabase Edge Functions
- Site cannot drive YooKassa QA in isolation

## Manual UAT Pattern

Phase verification includes a **HUMAN-UAT.md** file per phase (e.g., `.planning/phases/04-content-surface/04-HUMAN-UAT.md`) with scripted test scenarios:

**Example from Phase 4 UAT (2026-05-17):**

| Test | Expected | Result |
|------|----------|--------|
| Google Rich Results on all routes | 0 errors (Organization, SoftwareApplication, WebSite, Person, HowTo, FAQPage, Product, BreadcrumbList) | PASS — human-verified |
| Paddle/YooKassa modal E2E on /pay | With extension + logged in, CTA rail appears, checkout opens | PASS — both USD + RUB paths tested |
| Mobile LCP post-deploy | Baseline 3.3s (no regression vs Phase 3.3s baseline) | PASS — 3.5s within measurement variance (±0.2s) |
| X-Frame-Options edge header | `curl -sI https://opten.space/` returns `X-Frame-Options: SAMEORIGIN` | PASS — Vercel edge header applied |
| Content-Signal in robots.txt | `curl -s https://opten.space/robots.txt` includes `Content-Signal: ...` | PASS — present in live file |
| llms.txt content-type | `curl -sI https://opten.space/llms.txt` returns `Content-Type: text/plain` | PASS — both llms.txt and llms-full.txt match |

**Outputs:** Results written to phase's `<phase>-HUMAN-UAT.md` or `<phase>-VERIFICATION.md`. Nothing survives the phase as runnable code — only markdown records.

## MCP-Driven Verification Workflow

Phase verification runs through two MCP servers from the orchestrator's host (not CI):

### Playwright MCP — functional/UAT sweeps

Used as the de-facto E2E framework. The orchestrator scripts a short Playwright run against **prerendered `dist/`** served by `vite preview` after `npm run build`. 

**Steps:**
1. `npm run build`
2. `npx vite preview --host 127.0.0.1 --port 4180` in background
3. Playwright navigates direct-hit URLs (`/`, `/en/`, `/welcome`, `/en/welcome`, `/pay`, `/en/pay`, `/privacy`, `/en/privacy`, `/account`)
4. Per-page assertions: `<html lang>` attribute, body content language, `window.Paddle` presence on `/pay` + `/en/pay`, zero React hydration errors (#418/#423), zero generic console errors

**Outputs:** sweep table in phase SUMMARY file. Nothing committed as runnable code — results in markdown only.

**What it verifies:**
- `<html lang>` baked at build
- Prerendered body content per language
- `__PRERENDER_PATH` marker matches `location.pathname`
- Hydration is clean
- `LocalizedLink` rewrites preserve `/en/` prefix
- `LangSwitcher` produces right `navigate()` target (or correctly skips on no-sibling routes)
- Paddle CDN script present + `window.Paddle` is real object after load
- `chrome.runtime.sendMessage` branch falls through cleanly when extension absent

**What it cannot verify:**
- Full payment flow against Paddle sandbox (would charge real card)
- YooKassa flow (server-side, extension repo's Supabase)
- Real extension-installed scenarios (`EXTENSION_IDS` deep links, message-passing)

### PageSpeed Insights MCP — performance/Lighthouse

Used during Phase 2.x perf work and Phase 3+ post-release verification. Pulls Lighthouse metrics for mobile and desktop against deployed Vercel URL. Results quoted in phase SUMMARY/POST-RELEASE files (e.g., `03-POST-RELEASE.md` "PageSpeed `/en/` mobile LCP 3.5 s"). NOT committed as CI gate; no in-repo budget file.

## Test Types

| Type | Status | Notes |
|------|--------|-------|
| Unit tests (Vitest/Jest) | None | No framework installed |
| Component tests (Testing Library) | None | No framework installed |
| Integration tests | None | No framework installed |
| In-repo E2E (Playwright in `tests/`) | None | Smoke script in `scripts/` only |
| Orchestrator Playwright sweeps | Used per-phase | Results in `.planning/phases/<phase>/*-SUMMARY.md` |
| Visual regression | None | Design drift caught by human UAT + PageSpeed audit |
| Lighthouse/perf in CI | None | PageSpeed Insights MCP used ad-hoc |
| Build-time structural checks | Yes | `verify-faq-mainentity.mjs`, sitemap/llms floor checks |
| Static dist/ checks | Ad-hoc Node scripts | Commit hreflang counts, `<xhtml:link>` reciprocity, Paddle script tags |

## What Verification Looks Like — Canonical Example

From `04-VERIFICATION.md` (Phase 4 — content surface):

1. **`npm run build`** — confirms compile + prerender. Required to pass.

2. **Static `dist/` checks** via one-off Node scripts:
   - Count `<link rel="alternate" hreflang>` tags per HTML file
   - Confirm reciprocity between cluster pairs (RU ↔ EN ↔ x-default)
   - grep `<script src="https://cdn.paddle.com/paddle/v2/paddle.js">` on `dist/pay/index.html` and `dist/en/pay/index.html`
   - Verify `window.__PRERENDER_PATH = "/blog/gpt-image-2"` markers

3. **Playwright sweep via MCP** against `vite preview`:
   - Behaviors needing real browser (`LangSwitcher` clicks, hydration, `window.Paddle`, `LocalizedLink` rewriting)

4. **Human UAT** (6-item checklist in `04-HUMAN-UAT.md`):
   - Google Rich Results Tool audit
   - Paddle/YooKassa E2E with extension
   - Mobile LCP post-deploy
   - Edge headers (`X-Frame-Options`, etc.)
   - Content-Signal directive
   - llms.txt content-type

Neither Playwright nor UAT code survives the phase — runs documented in markdown only.

## Risk: Extension Integration Unverified

The site's most critical contract — boundary with Opten Chrome extension — has **zero automated coverage**:

- `chrome.runtime.sendMessage` shapes (`type: "GET_USER"`, etc.) in `docs/INTEGRATION-CONTRACT.md` §2 — no test asserts payload
- `EXTENSION_IDS` duplicated across `PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, `api/download-skill.ts` — no test catches drift
- Locked routes `/welcome`, `/pay`, `/success` — no test verifies they exist
- Supabase Function URLs + JWT hardcoded — no test catches typos
- `EN_SIBLINGS` ↔ `scripts/seo-routes.ts` SYNC contract relies on hand-written comments — drift breaks SPA navigation

**Implication:** every change touching billing, auth, integration contract, locked routes, or EN-sibling set must be **manually validated against extension + real browser before merge**. The two repos rely on **manual coordination + `docs/INTEGRATION-CONTRACT.md` as binding spec** rather than executable tests.

## Common Test Patterns

Not applicable — no test code exists in the repo. Patterns that DO exist are conventions for build-time guards (captured above) and MCP-driven sweeps (documented above).

---

*Testing analysis: 2026-05-18 — covers v1.0 (GEO Optimization) + Phase 5 (blog migration). Includes smoke-blog.mjs Playwright smoke pattern and build-time verification gates.*
