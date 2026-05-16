# Testing Patterns

**Analysis Date:** 2026-05-17

## Test Framework

**None in-repo.**

- No Vitest, Jest, Mocha, or Node test runner configured. No `vitest.config.*`, `jest.config.*`, or `playwright.config.*` in the repo (verified via Glob — only matches are inside `node_modules/`).
- No `*.test.*` or `*.spec.*` files under `src/`, `api/`, or `scripts/`.
- No test-related `devDependencies` in `package.json` (no `vitest`, `jest`, `@testing-library/*`, `playwright`, `cypress`, `msw`).
- No `test` script in `package.json` — only `dev` and `build`.

There is no unit, integration, or in-repo E2E test framework. There is, however, a **manual testing workflow built around MCP servers and `vite preview`** that the GSD orchestrator drives during phase verification. See "MCP-Driven Manual Test Workflow" below.

## Test File Organization

Not applicable. There are no first-party tests in the repo. Manual UAT scripts live in `.planning/phases/<phase>/<phase>-HUMAN-UAT.md` and are written + executed by the orchestrator, not committed as runnable code.

## Mocking

Not applicable to test code (none exists). One related helper does exist for manual QA: `scripts/mock-vercel-server.mjs` — a small Node HTTP server that emulates Vercel's static-file-precedence-over-rewrite behavior. It serves the `dist/` output so that `dist/en/welcome/index.html` (etc.) wins over the SPA fallback to `dist/index.html`, mirroring production. Used only for local Playwright/PageSpeed runs — not part of the build pipeline, not committed wired into any script.

## Coverage

None measured. No coverage tool installed.

## The Only Automated Quality Gate: `npm run build`

The single in-repo automated check is the Vite build:

```bash
npm run build
```

Defined in `package.json` — chains:

1. `vite build` (client bundle)
2. `vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir` (SSR bundle for prerender)
3. `vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta` (SEO metadata bundle)
4. `node scripts/prerender.mjs` (static HTML for each route)
5. `node scripts/sitemap.mjs`

TypeScript errors surface here via `@vitejs/plugin-react` — there is **no `typecheck` script** and **no root `tsconfig.json`** (verified). TS checking is best-effort and lossy: a file with broken types may still compile if the offending construct happens to be stripped by the SWC transform.

There is no ESLint config in the repo (`.eslintrc*` absent at root). No formatter (`.prettierrc*` absent).

**Build-side fail-fast guards.** Even without tests, the build steps include defensive `throw` calls that act as light correctness gates:

- Every `apply*` helper in `scripts/prerender.mjs` throws `if (html === before)` when its regex anchor doesn't match — surfaces SEO/structure drift loudly at build time instead of silently emitting broken `<head>` markup (Phase 2 D-08).
- `scripts/sitemap.mjs` throws if the prerender-filtered route count is 0 — catches a mis-loaded manifest.

Treat these as the existing "test" surface: when adding a new build-time HTML mutator or manifest, follow the same `if (before === after) throw` pattern.

## MCP-Driven Manual Test Workflow

Phase verification on this repo runs through two MCP servers from the orchestrator's host, not from CI:

### Playwright MCP — functional / UAT sweeps

Used as the de-facto E2E framework. The orchestrator scripts a short Playwright run against the **prerendered `dist/`** served by `npx vite preview --host 127.0.0.1 --port 4180` after `npm run build`. Steps (see `03-08-SUMMARY.md` Checkpoint and `03-VERIFICATION.md` Behavioral Spot-Checks for the canonical example):

1. `npm run build`
2. `npx vite preview --host 127.0.0.1 --port 4180` in the background
3. Playwright navigates direct-hit URLs (`/`, `/en/`, `/welcome`, `/en/welcome`, `/pay`, `/en/pay`, `/privacy`, `/en/privacy`, `/account`) and clicks `LangSwitcher`, internal `LocalizedLink`s, and `/pay` checkout button.
4. Per-page assertions: `<html lang>` attribute, body content language, `window.Paddle` presence on `/pay` + `/en/pay`, zero React hydration errors in console (#418 / #423 are the historical regressions), zero generic console errors.

**Outputs:** a sweep table written into the phase's plan SUMMARY file (e.g. `03-08-SUMMARY.md` "Checkpoint (Task 5)" section). Nothing is committed as runnable Playwright code — the run lives only in the chat transcript and the markdown record.

**What this surface can verify:** `<html lang>` baked at build, prerendered body content per language, `__PRERENDER_PATH` marker matches `location.pathname`, hydration is clean, `LocalizedLink` rewrites preserve the `/en/` prefix, `LangSwitcher` produces the right `navigate()` target (or correctly skips navigation on no-sibling routes), Paddle CDN script tag is present and `window.Paddle` is a real object after page load, `chrome.runtime.sendMessage` branch falls through cleanly when the extension is not installed.

**What it cannot verify:** full payment flow against Paddle sandbox (would charge a real test card), YooKassa flow (server-side, owned by the extension repo's Supabase Edge Functions), real extension-installed scenarios (`EXTENSION_IDS` deep links, message-passing responses).

### PageSpeed Insights MCP — performance / Lighthouse

Used during Phase 2.x perf work and Phase 3 post-release verification. Pulls Lighthouse metrics (performance, accessibility, best-practices, SEO) for both mobile and desktop against a deployed Vercel preview or production URL. Results are quoted in phase SUMMARY / POST-RELEASE files (e.g. `03-POST-RELEASE.md` "PageSpeed `/en/` mobile baseline before fixes = 92"); they are NOT committed as a CI gate, and there is no in-repo budget file.

## Manual QA Surfaces (Beyond MCP Sweeps)

- **Local dev:** `npm run dev` → `http://localhost:5173`. Standard Vite HMR. Use Chrome DevTools for everything. Note: dev mode runs without prerender, so SSR-vs-CSR differences (most importantly `<html lang>`-from-prerender vs `<html lang="ru">`-from-index.html) only show up against `vite preview` or Vercel.
- **`vite preview` quirks** (documented post-release):
  - Trailing-slash URLs (`/pay/`) leave `location.pathname === "/pay/"`. That string is NOT in `EN_SIBLINGS`, so `LangSwitcher` falls back to `/en/` instead of `/en/pay`. **Production-safe**: Vercel normalizes trailing slashes via filesystem-first routing (cleanUrls) and serves the real `dist/en/welcome/index.html` etc., so the rewrite never sees a trailing slash. `paths.ts` includes `stripTrailingSlash()` for the navigation-target rewriters; the LangSwitcher Set lookup itself relies on Vercel normalization.
  - `vite preview` falls back to `dist/index.html` (SPA fallback) for any unmatched path, including `/en/welcome` if the prerendered HTML is missing. This masks the prerender-vs-fallback discriminator (`__PRERENDER_PATH`) that's exercised in production. To test the real Vercel behavior locally use `node scripts/mock-vercel-server.mjs` (static-file-precedence-over-rewrite emulation).
- **Vercel previews:** every push to a non-`main` branch builds a preview URL via Vercel. Push to `main` deploys to production (`opten.space`) — there is no staging environment between them. This is the realistic perf/SEO test environment.
- **Extension coupling:** to exercise `/pay`, `/account`, `/welcome`, or `/dashboard/download-skill` end-to-end you need the Opten Chrome extension installed and listed in `EXTENSION_IDS`. Site-side QA without the extension can only smoke-test the `extStatus === "not_installed"` UI branch.
- **Paddle sandbox:** set Vercel env `VITE_PADDLE_ENV=sandbox` + a sandbox `VITE_PADDLE_CLIENT_TOKEN` on a preview deployment to test USD checkout without taking real cards. Production envs are set per the regular Vercel project settings.
- **YooKassa:** sandbox flow is server-side, owned by the extension repo's Supabase Edge Functions. The site cannot drive YooKassa QA in isolation.

## Test Types

| Type | Status |
|------|--------|
| Unit tests (Vitest/Jest) | None. |
| Component tests (Testing Library) | None. |
| Integration tests | None. |
| In-repo E2E (Playwright in `tests/`) | None. |
| Orchestrator Playwright sweeps via MCP | Used per-phase; results in `.planning/phases/<phase>/*-SUMMARY.md`. |
| Visual regression | None. |
| Lighthouse / perf in CI | None. PageSpeed Insights MCP used ad-hoc during Phase 2.x and Phase 3 post-release. |
| Static structural checks | Hand-written Node verification scripts invoked during phase verification (see `03-VERIFICATION.md` "node verification script" rows — count hreflang triplets in `dist/`, count `<xhtml:link>` in `sitemap.xml`, etc.). Not committed. |

## What Verification Actually Looks Like Per Phase

Concrete pattern, drawn from `03-VERIFICATION.md` (Phase 3 — bilingual routing):

1. **Run `npm run build`.** Confirms compile + prerender output. Required to pass.
2. **Static `dist/` checks** via one-off Node scripts written in the verifier session: count `<link rel="alternate" hreflang>` tags per HTML file, confirm reciprocity between cluster pairs, grep `<script src="https://cdn.paddle.com/paddle/v2/paddle.js">` on `dist/pay/index.html` and `dist/en/pay/index.html`, verify `window.__PRERENDER_PATH = "/en/welcome"` markers.
3. **Playwright sweep via MCP** against `vite preview` for behaviors that need a real browser (`LangSwitcher` clicks, hydration error count, `window.Paddle` after load, `LocalizedLink` URL rewriting).
4. **Human UAT** (Russian-language test plan) in `<phase>-HUMAN-UAT.md` — short scripted scenarios the user runs against the deployed Vercel preview to confirm Playwright didn't paper over a UX issue.

The Playwright sweep is treated as the closest thing to "integration tests"; the human UAT is the closest thing to acceptance tests. **Neither survives the phase** — runs are not committed as code, only as markdown summaries.

## Risk: Extension Integration Is Unverified by Tests

The site's most critical contract — the boundary with the Opten Chrome extension — has **zero automated coverage in this repo**:

- `chrome.runtime.sendMessage` shapes (`type: "GET_USER"`, `"GET_SUBSCRIPTION"`, etc.) defined in `docs/INTEGRATION-CONTRACT.md` §2 — no test asserts payload structure.
- `EXTENSION_IDS` constant is duplicated across `src/app/pages/PayPage.tsx`, `AccountPage.tsx`, `DownloadSkillPage.tsx`, and `api/download-skill.ts` — no test catches drift between them.
- Locked routes `/welcome`, `/pay`, `/success` — no automated test verifies they exist or render. The build does enforce that the prerender manifest matches the mounted routers (because a missing route prerenders nothing and the manifest's `path` becomes a `dist/<path>/index.html` write target), but a SPA-only locked route like `/account` would silently disappear.
- Supabase Function URLs and the anon JWT are hardcoded as string literals — no test catches typos.
- The `EN_SIBLINGS` ↔ `scripts/seo-routes.ts` EN entries SYNC contract relies on a hand-written comment. Drift here breaks SPA navigation: `LocalizedLink` would skip rewriting `to="/newpath"` and the user would lose the `/en/` prefix on click.

**Implication:** every change that touches billing, auth, the integration contract, the locked routes, or the EN-sibling set must be manually validated against the extension and against a real browser before merging. The extension repo (`C:\Projects\promptscore`) has its own test surface, but it covers the extension side of the wire, not the site side. The two repos rely on **manual coordination + `docs/INTEGRATION-CONTRACT.md` as a binding spec** rather than executable tests.

## Common Patterns

Not applicable — no test code exists to demonstrate patterns. The patterns that DO exist are conventions for the build-time guards and the MCP-driven sweeps, captured above.

---

*Testing analysis: 2026-05-17*
