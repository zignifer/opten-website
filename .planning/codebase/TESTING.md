# Testing Patterns

**Analysis Date:** 2026-05-21

## Test Framework

**NONE in-repo.** This is a deliberately test-free codebase.

- No Vitest, Jest, Mocha, or Node test runner configured
- No `.vitest.config.*`, `jest.config.*`, or `playwright.config.*` in repo root
- No `*.test.*` or `*.spec.*` files under `src/`, `api/`, or `scripts/`
- No test-related devDependencies: no `vitest`, `jest`, `@testing-library/*`, `playwright`, `cypress`
- No `test` script in `package.json` (only `dev` and `build`)

**Quality gates:** enforced by `npm run build` (build-time guards) and manual UAT via `.planning/phases/*/HUMAN-UAT.md` executed by orchestrator.

## Test File Organization

Not applicable — no unit/integration tests. Manual UAT scripts live in `.planning/phases/<phase>/<phase>-HUMAN-UAT.md` and are documented/executed as markdown tables, not runnable code.

## Test Structure

Not applicable — no test framework means no test structure conventions.

## Mocking

Not applicable to test code (none exists). One related helper for manual QA:

**scripts/mock-vercel-server.mjs** — Node HTTP server that emulates Vercel's static-file-precedence-over-SPA-fallback behavior. Serves `dist/` so that `dist/en/welcome/index.html` (etc.) wins over fallback to `dist/index.html`, mirroring production. Used for local Playwright/PageSpeed runs — NOT part of build pipeline.

## Coverage

None measured. No coverage tool installed.

## Build-Time Quality Gates

The single in-repo automated quality check: `npm run build` chains 8 sequential steps:

```bash
vite build                                          # Client SPA bundle
vite build --ssr scripts/entry-server.tsx          # SSR tree for prerender
vite build --ssr scripts/seo-routes.ts             # Manifest (routes + schema)
node scripts/prerender.mjs                          # Static HTML per route (144 files)
node scripts/sitemap.mjs                            # sitemap.xml + floor checks
node scripts/llms.mjs                               # llms.txt + llms-full.txt + floor checks
node scripts/verify-faq-mainentity.mjs              # FAQ ↔ FAQPage parity (V-10)
node scripts/verify-fonts.mjs                       # Font size bounds + WOFF2 magic
node scripts/indexnow.mjs                           # Bing IndexNow ping
node scripts/generate-summaries.mjs                 # (optional AI summaries for models)
```

**TypeScript errors surface here** via `@vitejs/plugin-react` and the two `vite build --ssr` invocations. No `typecheck` script exists — TS checking is best-effort and lossy.

### Fail-Fast Guards (Build-Time Assertions)

Every build-time mutator follows defensive pattern: **if regex anchor doesn't match, throw**. This prevents silent SEO/structure regressions in production.

**prerender.mjs:**
```javascript
// Every apply* helper throws if anchor not found
function applyHtmlLang(html, lang) {
  const before = html;
  html = html.replace(/<html\s+[^>]*>/, `<html lang="${lang}">`);
  if (html === before) throw new Error(`prerender: could not apply lang to HTML — structure changed?`);
  return html;
}
```

**verify-faq-mainentity.mjs (Phase 4.1 WR-09):**
- Enforces V-10: visible FaqBlock Q/A set == FAQPage schema mainEntity set
- Floor check: `if (faqRoutes.length < 4) throw new Error(...)`
- Reads prerendered HTML, extracts JSON-LD, compares questions between DOM and schema

**verify-fonts.mjs (Phase 2):**
- Font file existence: must be present
- Font size bounds: minKB < actual < maxKB (prevents truncation or accidental un-subsetting)
- WOFF2 magic header validation: `if (header !== "wOF2") throw`
- @font-face declarations: must have subset weight ranges

**sitemap.mjs / llms.mjs:**
- Floor checks: `if (sitemapRoutes.length < N) throw` catches mis-loaded manifest
- llms.txt content-type must be text/plain

When adding a build-time HTML mutator, follow the same `if (before === after) throw` pattern.

## Smoke Testing

**smoke-blog.mjs** (Phase 5 final verification):

```bash
npx playwright install chromium              # One-time setup
node scripts/smoke-blog.mjs                  # Ad-hoc invocation (NOT part of npm run build)
```

NOT part of build pipeline — invoked ad-hoc before blog-impacting commits.

**What it does:**
1. Spawns Python HTTP server against `dist/` on port 8765
2. Launches Chromium via `playwright-core` (headless)
3. Navigates to blog routes and asserts JSON-LD + DOM structure

**Test surface — `/blog/` (listing):**
- Asserts `CollectionPage`, `ItemList`, `BreadcrumbList` JSON-LD types present
- Canonical URL matches expected path
- hreflang triplets ≥3 tags present
- H1 text contains "Блог" (or EN equivalent)
- `.blog-intro` selector for speakable schema (exactly 1)
- ≥1 `BlogPostCard` rendered (H3 count)

**Test surface — `/blog/<slug>` (post):**
- Asserts `BlogPosting`, `FAQPage`, `HowTo`, `BreadcrumbList` present
- Canonical URL correct
- og:image points at `/blog/<slug>/cover.jpg`
- `.blog-intro` selector present (exactly 1)
- `<time datetime=ISO>` in ISO 8601 format
- Hamburger button rendered

**Test surface — `/en/blog/<slug>` (EN sibling):**
- `BlogPosting` JSON-LD present
- `<html lang="en">` attribute set

**Test surface — `/` (landing):**
- Hamburger button present
- Can click to reveal blog link in menu
- No inline navbar (menu-only)

**Output:** pass/fail count per assertion to stdout. Exit code 0 (all pass) or 1 (any fail).

## Unit Testing

Not done. No unit test framework configured.

## Integration Testing

Not done. No in-repo integration test suite.

## E2E Testing

**Smoke script only** (ad-hoc Playwright against prerendered `dist/`). NO CI/CD-gated E2E framework.

**Cannot verify via script:**
- Full Paddle/YooKassa payment flow (would charge real cards)
- Extension integration (`chrome.runtime.sendMessage` with real extension installed)
- Real user auth/subscription state flows

## Manual QA Surfaces

**npm run dev:**
```bash
npm run dev  # Runs on http://localhost:5173 with Vite HMR
```
Standard Vite dev server with hot reload. Use Chrome DevTools for debugging. Note: dev mode skips prerender — SSR vs CSR differences (especially `<html lang>` baking) only visible in production/vite preview.

**vite preview (post-build):**
```bash
npm run build
npx vite preview --host 127.0.0.1 --port 4180
```
Serves `dist/` as static with SPA fallback. Known quirk: vite preview falls back to `dist/index.html` for unmatched paths, masking the prerender-vs-fallback discriminator. Use `node scripts/mock-vercel-server.mjs` for accurate Vercel behavior simulation locally.

**Vercel previews:**
- Every push to non-`main` branch builds a preview URL
- `main` deploys to production (`opten.space`) — no staging environment

**Extension coupling (QA):**
- To exercise `/pay`, `/account`, `/welcome`, `/dashboard/download-skill` end-to-end, extension must be installed and ID must be in `EXTENSION_IDS` (`src/app/pages/PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, `api/download-skill.ts`)
- Site-only QA without extension can only test `extStatus === "not_installed"` UI branch

**Paddle sandbox:**
- Set Vercel env `VITE_PADDLE_ENV=sandbox` + sandbox `VITE_PADDLE_CLIENT_TOKEN` on preview deployment to test USD checkout without charges
- Production uses regular project settings

**YooKassa:**
- Sandbox flow is server-side, owned by extension repo's Supabase Edge Functions
- Site cannot drive YooKassa QA in isolation

## Manual UAT Pattern

Phase completion includes **HUMAN-UAT.md** per phase with scripted test scenarios:

**Example structure (6-item checklist):**

| Test | Expected | Result |
|------|----------|--------|
| Google Rich Results on all routes | 0 errors (Organization, SoftwareApplication, WebSite, Person, HowTo, FAQPage, Product, BreadcrumbList) | PASS — human-verified |
| Paddle/YooKassa modal E2E on /pay | With extension + logged in, CTA rail appears, checkout opens | PASS — both USD + RUB tested |
| Mobile LCP post-deploy | Baseline 3.3s (no regression vs Phase 3.3s) | PASS — 3.5s within variance |
| X-Frame-Options edge header | `curl -sI https://opten.space/` includes `X-Frame-Options: SAMEORIGIN` | PASS — Vercel edge header applied |
| Content-Signal in robots.txt | `curl -s https://opten.space/robots.txt` includes Content-Signal directive | PASS — present in live file |
| llms.txt content-type | `curl -sI https://opten.space/llms.txt` returns `Content-Type: text/plain` | PASS — both llms.txt and llms-full.txt match |

**Output:** results written to phase's `.md` file. Nothing survives as runnable code — markdown records only.

## MCP-Driven Verification Workflow

Phase verification runs through two MCP servers from orchestrator's host (not CI):

### Playwright MCP — functional/UAT sweeps

De-facto E2E framework. Orchestrator scripts Playwright run against prerendered `dist/` served by `vite preview` after `npm run build`.

**Steps:**
1. `npm run build`
2. `npx vite preview --host 127.0.0.1 --port 4180` in background
3. Playwright navigates direct-hit URLs: `/`, `/en/`, `/welcome`, `/en/welcome`, `/pay`, `/en/pay`, `/privacy`, `/en/privacy`, `/account`
4. Per-page assertions: `<html lang>` attribute, body content language, `window.Paddle` presence on `/pay` + `/en/pay`, zero React hydration errors, zero console errors

**Verifies:**
- `<html lang>` baked at build time
- Prerendered body content per language
- `__PRERENDER_PATH` marker matches `location.pathname`
- Hydration clean (no React #418/#423 mismatch)
- `LocalizedLink` rewrites preserve `/en/` prefix
- `LangSwitcher` produces correct `navigate()` target (or skips on no-sibling routes)
- Paddle CDN script present + `window.Paddle` real object after load
- `chrome.runtime.sendMessage` branch falls cleanly when extension absent

**Cannot verify:**
- Full payment flow against Paddle sandbox (would charge real card)
- YooKassa flow (server-side, extension repo's Supabase)
- Real extension-installed scenarios

### PageSpeed Insights MCP — Lighthouse

Used during perf work. Pulls Lighthouse metrics for mobile/desktop against deployed Vercel URL. Results quoted in phase SUMMARY files (e.g., `03-POST-RELEASE.md` "LCP 3.5 s"). NOT committed as CI gate — advisory only.

## Test Types Summary

| Type | Status | Notes |
|------|--------|-------|
| Unit tests (Vitest/Jest) | None | No framework |
| Component tests (Testing Library) | None | No framework |
| Integration tests | None | No framework |
| In-repo E2E (Playwright in `tests/`) | None | smoke-blog.mjs only |
| Orchestrator Playwright sweeps | Per-phase | Results in `.planning/phases/<phase>/*-SUMMARY.md` |
| Visual regression | None | Human UAT + PageSpeed audit |
| Lighthouse/perf | Ad-hoc | PageSpeed Insights MCP |
| Build-time checks | Yes | verify-faq-mainentity.mjs, sitemap/llms floors, fonts |
| Static `dist/` checks | Ad-hoc Node | hreflang counts, `<xhtml:link>` reciprocity, Paddle tags |

## Canonical Verification Example

From Phase 4 (content surface):

1. **`npm run build`** — compile + prerender must pass (required)

2. **Static `dist/` checks via Node scripts:**
   - Count `<link rel="alternate" hreflang>` tags per HTML
   - Confirm reciprocity between RU ↔ EN ↔ x-default pairs
   - grep `<script src="https://cdn.paddle.com/paddle/v2/paddle.js">` on `dist/pay/index.html` and `dist/en/pay/index.html`
   - Verify `window.__PRERENDER_PATH = "/blog/gpt-image-2"` markers

3. **Playwright sweep via MCP** against `vite preview`:
   - Test browser-dependent behaviors: `LangSwitcher` clicks, hydration clean, `window.Paddle`, `LocalizedLink` rewriting

4. **Human UAT** (6-item checklist):
   - Google Rich Results audit
   - Paddle/YooKassa E2E with extension
   - Mobile LCP post-deploy
   - Edge headers
   - Content-Signal directive
   - llms.txt content-type

Neither Playwright code nor UAT documentation survives the phase — results in markdown only.

## Critical Integration Gaps (No Test Coverage)

The site's most critical contract — boundary with Opten Chrome extension — has **ZERO automated verification**:

- `chrome.runtime.sendMessage` shapes (`type: "GET_AUTH_TOKEN"`, etc.) in `docs/INTEGRATION-CONTRACT.md` §2 — no test asserts payload
- `EXTENSION_IDS` duplicated across 4 files — no test catches drift
- Locked routes `/welcome`, `/pay`, `/success` — no test verifies they exist
- Supabase Function URLs + JWT hardcoded — no test verifies syntax
- `EN_SIBLINGS` ↔ `seo-routes.ts` SYNC contract relies on comments — drift breaks SPA nav

**Implication:** every change touching billing, auth, integration contract, locked routes, or EN-sibling set must be **manually validated against real extension + browser before merge**. Repos rely on **manual coordination + `docs/INTEGRATION-CONTRACT.md` as binding spec** rather than executable tests.

---

*Testing analysis: 2026-05-21 — covers v1.0 (GEO) + v2.0 (models) + Phase 5 (blog). Includes smoke-blog.mjs Playwright smoke pattern and build-time verification gates.*
