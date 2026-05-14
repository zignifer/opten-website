---
phase: 02-per-route-prerender-per-route-metadata
verified: 2026-05-15T12:00:00Z
status: human_needed
score: 3/3
overrides_applied: 0
human_verification:
  - test: "Deploy to Vercel (git push origin main) and run Sections A-G from 02-08-SUMMARY.md"
    expected: "All 6 routes serve prerendered HTML with distinct titles/canonicals from Vercel CDN; /account /success /dashboard/* return SPA fallback; sitemap.xml served as application/xml with 6 lastmod entries; Paddle modal opens on /pay; no hydration warnings in browser console"
    why_human: "Vercel serves files from dist/ via CDN with a SPA rewrite fallback. Local dist/ checks confirm the emitted HTML is correct, but the actual live routing (static file vs SPA rewrite precedence) can only be confirmed against a live Vercel deploy. Additionally, Paddle modal behavior and browser hydration warnings require a real browser session."
---

# Phase 2: Per-route prerender + per-route metadata — Verification Report

**Phase Goal:** Make each route return its own `<title>`, `<meta>`, canonical, and OG tags pre-hydration so AI crawlers and search engines see distinct documents.
**Verified:** 2026-05-15
**Status:** human_needed — all automated checks PASS; post-deploy Vercel acceptance (Sections A-G) is the remaining gate
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Each route returns distinct `<title>` and `<meta description>` in pre-hydration HTML | VERIFIED | All 6 emitted HTML files have unique, non-empty titles and descriptions (6/6 distinct values confirmed by grep) |
| 2 | `<link rel="canonical">` correctly identifies each route | VERIFIED | All 6 files have `<link rel="canonical" href="https://opten.space{path}">` with bare paths (no trailing slash on subroutes, `/` on root) |
| 3 | Sitemap.xml carries per-route `lastmod` derived from build-time ISO date | VERIFIED | `dist/sitemap.xml` contains exactly 6 `<url>` entries each with `<lastmod>2026-05-14</lastmod>` (uniform build-date per D-04) |

**Score:** 3/3 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `scripts/seo-routes.ts` | Per-route metadata manifest | VERIFIED | 6 routes with title, description, canonical, ogTitle, ogDescription, ogImage, prerender tier, changefreq, priority |
| `scripts/entry-server.tsx` | SSR React tree entry exporting `renderRoute(path)` | VERIFIED | Exports `renderRoute`, uses `StaticRouter` + `LangProvider`, mounts 5 full-tier routes only |
| `scripts/prerender.mjs` | Postbuild Node script emitting per-route HTML | VERIFIED | Reads dist/index.html template, applies head overrides + body injection, writes 6 files |
| `scripts/sitemap.mjs` | Postbuild sitemap emitter with build-time lastmod | VERIFIED | Reads manifest, writes `dist/sitemap.xml` with uniform `BUILD_DATE` |
| `dist/index.html` | Root route — full-body prerendered | VERIFIED | 1245 chars of SSR content in `<div id="root">`, 394 total words |
| `dist/welcome/index.html` | `/welcome` — full-body prerendered | VERIFIED | 1303 chars of SSR content, 131 total words |
| `dist/pay/index.html` | `/pay` — head-only, empty root div | VERIFIED | `<div id="root"></div>` confirmed empty (0 inner chars), per-route head present |
| `dist/privacy/index.html` | `/privacy` — full-body prerendered | VERIFIED | 665 chars SSR in root div, 1262 total words |
| `dist/terms/index.html` | `/terms` — full-body prerendered | VERIFIED | 665 chars SSR in root div, 1207 total words |
| `dist/refund/index.html` | `/refund` — full-body prerendered | VERIFIED | 665 chars SSR in root div, 777 total words |
| `dist/sitemap.xml` | 6 URL entries with lastmod | VERIFIED | 6 `<url>` blocks, 6 `<lastmod>` entries, 1 unique date |
| `dist/account/index.html` | Must NOT exist (SPA-only) | VERIFIED | File absent — Vercel SPA rewrite handles this route |
| `dist/success/index.html` | Must NOT exist (SPA-only) | VERIFIED | File absent |
| `dist/dashboard/download-skill/index.html` | Must NOT exist (SPA-only) | VERIFIED | File absent |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `scripts/prerender.mjs` | `dist/sitemap.xml` | Imports `.ssr-meta/seo-routes.js` at runtime | WIRED | `sitemap.mjs` reads manifest bundle and writes `dist/sitemap.xml` — confirmed by build output: `sitemap.xml → 6 routes (lastmod 2026-05-14)` |
| `scripts/prerender.mjs` | `.ssr-cache/entry-server.js` | `import(pathToFileURL(SSR_BUNDLE))` | WIRED | Dynamic import confirmed; build emitted `entry-server.js` (145.40 kB) in `.ssr-cache/` |
| `scripts/prerender.mjs` | `dist/{route}/index.html` | `applyMeta()` + `applyBody()` | WIRED | 6 files emitted with per-route head overrides and (for full routes) React-rendered body |
| `src/main.tsx` | `hydrateRoot` / `createRoot` | `root.hasChildNodes()` branch | WIRED | `if (root.hasChildNodes()) { hydrateRoot(root, tree); } else { createRoot(root).render(tree); }` — both imports present |
| `LangContext` | SSR-safe initial state | `useState<Lang>("ru")` | WIRED | Detection deferred to `useEffect(() => { setLangState(detectLang()); }, [])` |
| `package.json build` | Full chain | `vite build && ... && node scripts/prerender.mjs && node scripts/sitemap.mjs` | WIRED | Build exits 0; all 6 files emitted + sitemap confirmed |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `dist/index.html` | React-rendered body in `<div id="root">` | `renderRoute("/")` in `entry-server.tsx` via `renderToString` | Yes — 1245 chars of actual React component output | FLOWING |
| `dist/welcome/index.html` | React-rendered body | `renderRoute("/welcome")` | Yes — 1303 chars | FLOWING |
| `dist/privacy/index.html` | React-rendered body | `renderRoute("/privacy")` | Yes — 665 chars SSR root div, 1262 full-page words | FLOWING |
| `dist/terms/index.html` | React-rendered body | `renderRoute("/terms")` | Yes — 665 chars SSR root div, 1207 full-page words | FLOWING |
| `dist/refund/index.html` | React-rendered body | `renderRoute("/refund")` | Yes — 665 chars SSR root div, 777 full-page words | FLOWING |
| `dist/pay/index.html` | head-only (empty root div by D-02 design) | `applyMeta()` only, no `renderRoute` | N/A — intentionally empty body | CORRECT (head-only by design) |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build chain exits 0 | `npm run build` | exit 0; "prerender complete: 6 routes emitted"; "sitemap.xml → 6 routes" | PASS |
| All 6 HTML files emitted | `ls dist/{index,welcome,pay,privacy,terms,refund}/index.html dist/sitemap.xml` | All 7 files present | PASS |
| SPA-only files absent | `ls dist/{account,success}/index.html dist/dashboard/download-skill/index.html` | All 3 absent | PASS |
| 6 distinct titles | grep title across 6 files | 6 unique values | PASS |
| 6 distinct descriptions | grep meta description across 6 files | 6 unique values | PASS |
| 6 per-route canonicals | grep canonical across 6 files | All match expected `https://opten.space{path}` | PASS |
| /pay has empty root div | node content check | inner length: 0 | PASS |
| Full-body routes have SSR content | node inner-content check | 665–1303 chars per route | PASS |
| JSON-LD blocks valid JSON | node JSON.parse check | 2 valid blocks in dist/index.html and dist/pay/index.html | PASS |

### Probe Execution

No `scripts/*/tests/probe-*.sh` files exist for this phase. Build-chain integrity verified via behavioral spot-checks above.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| GEO-B-1 | 02-04 | Head-management strategy resolved: build-time prerender via `scripts/prerender.mjs` | SATISFIED | `scripts/prerender.mjs` exists, runs in build chain, emits per-route HTML |
| GEO-B-2 | 02-01 through 02-07 | Per-route `<title>`, `<meta description>`, canonical, OG across 6 routes | SATISFIED | All 6 emitted HTML files verified with distinct per-route head tags |
| GEO-B-3 | 02-05 | Sitemap.xml with per-route `lastmod` derived from build-time ISO date | SATISFIED | `dist/sitemap.xml`: 6 entries, each with `<lastmod>2026-05-14</lastmod>` |

### Phase 1 Invariants Preserved

| Invariant | Check | Status |
|-----------|-------|--------|
| Paddle preconnect present (no `crossorigin`) | All 6 files: `rel="preconnect" href="https://cdn.paddle.com" />` | PASS |
| Paddle sync script present | All 6 files: `grep -c cdn.paddle.com/paddle/v2/paddle.js` = 1 each | PASS |
| Paddle script has no `async`/`defer` | All 6 files: `paddle.js">` (no extra attributes) | PASS |
| 2 JSON-LD blocks per file | All 6 files: `grep -c type="application/ld+json"` = 2 each; both parse as valid JSON | PASS |
| `og:image` = `og-card-ru.png` site-wide | All 6 files: `content="https://opten.space/og-card-ru.png"` | PASS |
| `<html lang="ru">` preserved | All 6 files: `<html lang="ru"` | PASS |
| Favicon hierarchy preserved | All standard favicon sizes present in `dist/index.html` | PASS |
| `favicon-310x310` absent | `grep -c favicon-310x310 dist/index.html` = 0 | PASS |
| `public/robots.txt` untouched | File present (607 bytes, modified 2026-05-14) | PASS |
| `public/sitemap.xml` untouched (fallback) | File present (763 bytes, same 6-route set) | PASS |
| `public/llms.txt` untouched | File present (827 bytes, modified 2026-05-14) | PASS |
| Phase 1 security headers in `vercel.json` | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` all present | PASS |

### Integration Contract Preserved

| Item | Check | Status |
|------|-------|--------|
| `PayPage.tsx` unchanged | `git diff HEAD~8 src/app/pages/PayPage.tsx` = empty | PASS |
| `AccountPage.tsx` unchanged | `git diff HEAD~8 src/app/pages/AccountPage.tsx` = empty | PASS |
| `DownloadSkillPage.tsx` unchanged | `git diff HEAD~8 src/app/pages/DownloadSkillPage.tsx` = empty | PASS |
| `api/download-skill.ts` unchanged | `git diff HEAD~8 api/download-skill.ts` = empty | PASS |
| `EXTENSION_IDS` constants intact | Present and unmodified in 3 page files | PASS |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` intact | Present in PayPage + api/download-skill.ts | PASS |
| No new runtime dependencies in `package.json` | Diff shows only `build` script value changed; `dependencies` block unchanged | PASS |
| No new test/lint/typecheck scripts | Only `build` and `dev` scripts present | PASS |
| All 9 routes still mounted in `main.tsx` | `/`, `/pay`, `/success`, `/privacy`, `/terms`, `/refund`, `/account`, `/welcome`, `/dashboard/download-skill` | PASS |
| Paddle bootstrap block inside `if (window.Paddle)` unchanged | git diff shows only comments and outer structure added; the `if (window.Paddle) { ... }` block body is byte-identical | PASS |

### Hydration Entry Correctness

| Check | Evidence | Status |
|-------|----------|--------|
| `createRoot` AND `hydrateRoot` both imported | `import { createRoot, hydrateRoot } from "react-dom/client"` | PASS |
| Runtime branch on `hasChildNodes()` | `if (root.hasChildNodes()) { hydrateRoot(root, tree); } else { createRoot(root).render(tree); }` | PASS |
| Paddle bootstrap runs BEFORE hydration call | `if (window.Paddle) {...}` block precedes `const root = ...` | PASS |

### LangContext SSR Safety

| Check | Evidence | Status |
|-------|----------|--------|
| `useState<Lang>("ru")` on initial state | `useState<Lang>("ru")` (not `useState<Lang>(detectLang)`) | PASS |
| `detectLang()` moved into `useEffect` with empty deps | `useEffect(() => { setLangState(detectLang()); }, [])` | PASS |
| `useLang` public hook unchanged | Exports `useLang(): { lang, setLang }` and `useT(): t` | PASS |

### Anti-Patterns Found

No `TBD`, `FIXME`, or `XXX` markers found in any Phase 2 modified file. No stub patterns detected.

### Human Verification Required

#### 1. Post-deploy Vercel acceptance (Sections A-G from 02-08-SUMMARY.md)

**Test:** Push `git push origin main` to trigger Vercel auto-deploy, then run the acceptance checklist from 02-08-SUMMARY.md Sections A-G against the preview/production URL.

**Expected:**
- Section A: All 6 routes serve per-route distinct titles + canonicals from Vercel CDN (not the SPA rewrite fallback)
- Section B: Phase 1 invariants (JSON-LD, Paddle sync script, preconnect, og-card-ru.png) preserved in all 6 served files
- Section C: Locked SPA routes (`/account`, `/success`, `/dashboard/download-skill`) respond 200 via SPA fallback; no Supabase URL leakage in served HTML; Phase 1 security headers present on live responses
- Section D: `curl /sitemap.xml` returns 6 `<lastmod>` entries with 1 uniform date, served as `application/xml`
- Section E: `fetch_page.py` reports `has_ssr_content: true`, `word_count > 100`, `structured_data = 2` on 5 full-body routes; `/pay` reports `has_ssr_content: false`
- Section F: OG unfurl in Telegram/Slack shows route-specific og:title + og-card-ru.png 1200x630
- Section G: Paddle modal opens on `/pay` with no console errors or hydration warnings

**Why human:** Vercel CDN routing (static file vs SPA rewrite precedence) can only be confirmed against a live deploy. Paddle modal, OG unfurl, and browser hydration warnings require a live browser session.

### Gaps Summary

No automated gaps found. All 3 roadmap success criteria are fully implemented and verified in `dist/` output. The only remaining gate is the post-deploy Vercel acceptance (Sections A-G) which was explicitly deferred in Plan 02-08 pending `git push origin main`.

**Per the 02-08 closure gate:** "Phase 2 is NOT formally closed until all Sections A-G are marked PASS."

---

## VERIFICATION COMPLETE

All automated checks PASS. Phase 2 goal is implemented and observable in the local `dist/` build. Post-deploy Vercel acceptance (Sections A-G) is the remaining gate before formal Phase 2 closure.

_Verified: 2026-05-15_
_Verifier: Claude (gsd-verifier)_
