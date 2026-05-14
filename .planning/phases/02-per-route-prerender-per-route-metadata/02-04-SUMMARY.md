---
phase: 02-per-route-prerender-per-route-metadata
plan: "04"
subsystem: seo/prerender
tags: [prerender, seo, geo-b-1, geo-b-2, node-script, ssr]
dependency_graph:
  requires:
    - 02-01 (seo-routes.ts manifest)
    - 02-02 (entry-server.tsx SSR bundle)
    - 02-03 (SSR-safe LangContext)
  provides:
    - scripts/prerender.mjs (Node postbuild HTML emitter)
    - dist/{route}/index.html for 6 routes (full build run)
  affects:
    - dist/index.html (overwritten with per-route head + React body)
    - dist/pay/index.html (head-only)
    - dist/welcome, privacy, terms, refund (full body + head)
tech_stack:
  added: []
  patterns:
    - Node ESM top-level await (.mjs)
    - pathToFileURL for Windows-compatible dynamic import
    - Two-outDir Vite SSR builds to prevent inter-build erasure (Vite 6 behavior)
    - applyMeta/applyBody assert-on-no-match safety nets
key_files:
  created:
    - scripts/prerender.mjs
  modified:
    - .gitignore (added .ssr-cache, .ssr-meta)
decisions:
  - "Use pathToFileURL() for dynamic import() of SSR bundles — Windows ESM loader rejects bare C:\\ absolute paths"
  - "Two separate outDirs (.ssr-cache for entry-server, .ssr-meta for seo-routes) — Vite 6 empties outDir on every SSR build even without --emptyOutDir when both builds target the same dir"
  - "MANIFEST_BUNDLE points to .ssr-meta/seo-routes.js, not .ssr-cache/seo-routes.js as the plan's interface spec stated — deviation from plan spec, required by Vite 6 behavior"
  - "Sitemap emission is NOT in this script — owned by Plan 02-05 (scripts/sitemap.mjs)"
metrics:
  duration: "~45 minutes"
  completed: "2026-05-15"
---

# Phase 2 Plan 04: Postbuild Prerender Script Summary

## One-liner

Node ESM postbuild script that reads `dist/index.html` as a template, calls `renderRoute()` from the Vite SSR bundle, and emits per-route HTML files with 7 head overrides + canonical injection + React-rendered body for 5 full-tier routes, head-only for `/pay`, and skips 3 locked SPA routes.

## What Was Done

Created `scripts/prerender.mjs` — the Node postbuild HTML emitter that is the core artifact of Phase 2.

### Script structure

- ESM `.mjs`, Node 20+ top-level await
- `__dirname` recovered via `dirname(fileURLToPath(import.meta.url))`
- `pathToFileURL()` wrapping for Windows-compatible dynamic `import()`
- Constants: `ROOT`, `DIST`, `SSR_BUNDLE` (`.ssr-cache/entry-server.js`), `MANIFEST_BUNDLE` (`.ssr-meta/seo-routes.js`)
- Dynamic imports of SSR bundle and manifest at script start
- `escapeAttr()` and `escapeHtml()` helpers applied to all user-supplied strings
- `applyMeta(html, meta)`: 7 anchored regex `.replace()` calls + canonical injection + assert-on-no-match
- `applyBody(html, rendered)`: splice rendered HTML into `<div id="root"></div>` + assert-on-no-match
- Main loop: iterates `routes[]`, skips `prerender === "none"`, applies meta + optionally body, writes file

### Routes emitted

| Route | Tier | Output path | Body content |
|-------|------|-------------|--------------|
| `/` | full | `dist/index.html` (overwrite) | React tree via renderRoute |
| `/pay` | head | `dist/pay/index.html` | `<div id="root"></div>` (empty) |
| `/welcome` | full | `dist/welcome/index.html` | React tree via renderRoute |
| `/privacy` | full | `dist/privacy/index.html` | React tree via renderRoute |
| `/terms` | full | `dist/terms/index.html` | React tree via renderRoute |
| `/refund` | full | `dist/refund/index.html` | React tree via renderRoute |
| `/account` | none | (skipped) | SPA fallback |
| `/success` | none | (skipped) | SPA fallback |
| `/dashboard/download-skill` | none | (skipped) | SPA fallback |

### Manual invocation chain (for Plan 02-06 wiring reference)

```sh
npx vite build
npx vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir
npx vite build --ssr scripts/seo-routes.ts    --outDir .ssr-meta
node scripts/prerender.mjs
```

### Phase 1 invariants preserved in every emitted file (grep-verified)

| Invariant | Verification | Result |
|-----------|-------------|--------|
| 2 `<script type="application/ld+json">` blocks | `grep -c` per file | 2 in each |
| Sync Paddle CDN script (`cdn.paddle.com/paddle/v2/paddle.js`) | `grep -c` per file | 1 in each |
| Paddle preconnect link | implicit (head not modified) | preserved |
| `og-card-ru.png` (og:image + twitter:image) | `grep -c` per file | 2 in each |
| `<html lang="ru">` | `grep -c` per file | 1 in each |
| No `async`/`defer` on Paddle script | negative grep | 0 matches |
| JSON-LD blocks byte-identical to source | `diff` of extracted blocks | zero diff |

### NOT emitted by this script

`dist/sitemap.xml` — that is the responsibility of `scripts/sitemap.mjs` (Plan 02-05). After running this script, `dist/sitemap.xml` is still the static Phase 1 file copied from `public/sitemap.xml`, which has zero `<lastmod>` entries.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Windows ESM dynamic import rejects bare `C:\` absolute paths**
- **Found during:** Task 1 — first execution of `node scripts/prerender.mjs`
- **Issue:** Node's ESM loader on Windows throws `ERR_UNSUPPORTED_ESM_URL_SCHEME` for bare absolute paths passed to `import()`. Plan's interface spec used `await import(SSR_BUNDLE)` directly.
- **Fix:** Wrapped dynamic imports with `pathToFileURL(path).href`: `await import(pathToFileURL(SSR_BUNDLE).href)`. Added `pathToFileURL` to the `node:url` import.
- **Files modified:** `scripts/prerender.mjs`
- **Commit:** 93b0a51

**2. [Rule 3 - Blocking] Vite 6 empties outDir on every SSR build, destroying the first bundle when the second build runs**
- **Found during:** Task 1 — second `vite build --ssr` invocation wiped `entry-server.js` even without `--emptyOutDir`
- **Issue:** Vite 6.3.5 defaults `emptyOutDir: true` for SSR builds targeting `.ssr-cache/`. The plan's interface spec assumed both SSR bundles could coexist in `.ssr-cache/` by omitting `--emptyOutDir` on the second build — this does not hold in Vite 6.
- **Fix:** Split into two outDirs: `.ssr-cache/` for `entry-server.tsx`, `.ssr-meta/` for `seo-routes.ts`. Updated `MANIFEST_BUNDLE` constant in the script to point to `.ssr-meta/seo-routes.js`. Added both directories to `.gitignore`.
- **Files modified:** `scripts/prerender.mjs`, `.gitignore`
- **Commit:** 93b0a51

### Impact on Plan 02-06

Plan 02-06 (wiring the build chain into `package.json`) needs to use the two-outDir invocation:
```sh
vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir
vite build --ssr scripts/seo-routes.ts    --outDir .ssr-meta
```
Not the single `.ssr-cache` approach described in the plan's `<interfaces>` section.

## Verification Results

All 16 automated verification steps passed:

| Step | Check | Result |
|------|-------|--------|
| 1 | `node --check scripts/prerender.mjs` exits 0 | PASS |
| 2 | `npm run build` exits 0 (no regression) | PASS |
| 3 | Manual chain exits 0, 7 progress lines | PASS |
| 4 | All 6 emitted files exist | PASS |
| 5 | No SPA-only files emitted | PASS |
| 6 | 6 distinct titles, 1 per file | PASS (6 unique) |
| 7 | Canonical on every emitted file | PASS (1 per file) |
| 8 | Phase 1 invariants: 2 JSON-LD, 1 Paddle, og-card, lang | PASS (all 6 files) |
| 9 | No async/defer on Paddle script | PASS |
| 10 | Full-tier body content > 50 chars | PASS (welcome=357, privacy=22307, terms=20863, refund=12813, root=3742) |
| 11 | /pay has empty `<div id="root"></div>` | PASS (count=1) |
| 12 | No integration constants in emitted HTML | PASS |
| 13 | No forbidden constants in script source | PASS |
| 14 | Script source doesn't target protected tags | PASS |
| 15 | JSON-LD blocks byte-identical to source | PASS (diff=0) |
| 16 | sitemap.xml has 0 `<lastmod>` entries | PASS |

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1: Create scripts/prerender.mjs | 93b0a51 | feat(seo): add postbuild prerender script emitting per-route HTML (GEO-B-1, GEO-B-2) |

## Self-Check: PASSED

- `scripts/prerender.mjs` exists at `C:\Projects\opten-website\scripts\prerender.mjs`
- `.gitignore` contains `.ssr-cache` and `.ssr-meta`
- Commit `93b0a51` exists in git log
- `npm run build` exits 0
- Full manual build chain produces 6 emitted HTML files with all invariants preserved
