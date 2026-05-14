---
phase: 02-per-route-prerender-per-route-metadata
plan: "06"
subsystem: seo/build-pipeline
tags: [build, seo, geo-b-1, geo-b-2, geo-b-3, pipeline]
dependency_graph:
  requires:
    - 02-04 (scripts/prerender.mjs + two-outDir layout)
    - 02-05 (scripts/sitemap.mjs + .ssr-meta layout)
  provides:
    - package.json (build script chains full Phase 2 pipeline)
  affects:
    - npm run build output (now includes all Phase 2 artifacts)
tech_stack:
  added: []
  patterns:
    - "Shell && chain in npm scripts (cross-platform: PowerShell, bash, cmd)"
    - "Two separate Vite SSR outDirs to prevent inter-build erasure (Vite 6 behavior)"
key_files:
  created: []
  modified:
    - package.json (line 7 only — build script value)
decisions:
  - "Use two separate --outDir values (.ssr-cache for entry-server, .ssr-meta for seo-routes) — absorbed from 02-04 deviation; Vite 6 empties outDir on every SSR build even without --emptyOutDir"
  - "--emptyOutDir appears exactly once, on the entry-server SSR build — protects .ssr-cache/entry-server.js from being deleted when seo-routes SSR build runs"
  - "No --emptyOutDir on the .ssr-meta build — Vite 6 still cleans it on each invocation because the second SSR build targets a fresh dir, but the critical invariant is entry-server.js survival"
metrics:
  duration: "~10 minutes"
  completed: "2026-05-15"
---

# Phase 2 Plan 06: Build Pipeline Wiring Summary

## One-liner

Extended `package.json` build script to chain all five Phase 2 steps (SPA build, two SSR Vite builds into separate outDirs, prerender script, sitemap script) so a single `npm run build` produces all Phase 2 artifacts.

## What Was Done

Changed exactly one line in `package.json` (line 7, the `"build"` script value). All other 89 lines remain byte-identical.

### Build chain wired

```sh
vite build \
  && vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir \
  && vite build --ssr scripts/seo-routes.ts    --outDir .ssr-meta \
  && node scripts/prerender.mjs \
  && node scripts/sitemap.mjs
```

### Chain step rationale

| Step | Command | Output | Why |
|------|---------|--------|-----|
| 1 | `vite build` | `dist/index.html` + all SPA assets | Template for prerender; Vite copies `public/sitemap.xml` → `dist/` |
| 2 | `vite build --ssr entry-server.tsx --outDir .ssr-cache --emptyOutDir` | `.ssr-cache/entry-server.js` | React SSR renderer; `--emptyOutDir` cleans dir once at start of SSR phase |
| 3 | `vite build --ssr seo-routes.ts --outDir .ssr-meta` | `.ssr-meta/seo-routes.js` | Route manifest (titles, descriptions, priorities, changefreqs); separate outDir prevents step 2 erasure |
| 4 | `node scripts/prerender.mjs` | `dist/{route}/index.html` for 6 routes | Reads both SSR bundles; emits per-route HTML with injected head + body |
| 5 | `node scripts/sitemap.mjs` | `dist/sitemap.xml` (overwrites Vite copy) | Reads `.ssr-meta/seo-routes.js`; emits XML with 6 `<lastmod>` entries |

### --emptyOutDir placement

`--emptyOutDir` is on the **first** SSR build only (step 2, `entry-server.tsx`). This ensures:
- `.ssr-cache/` is cleaned before the entry-server bundle is written (no stale bundles from prior runs)
- The second SSR build (step 3) targets `.ssr-meta/` entirely — a separate dir — so it never touches `.ssr-cache/entry-server.js`

Omitting `--emptyOutDir` from step 3 means `.ssr-meta/` retains stale files across builds if the manifest shrinks, but for this phase (6 routes, stable manifest) that is not a concern.

### Post-build artifact inventory

| Artifact | Source | Verification |
|----------|--------|-------------|
| `dist/index.html` | prerender.mjs (overwrite with full-tier content) | `test -f dist/index.html` |
| `dist/pay/index.html` | prerender.mjs (head-tier, empty body) | `test -f dist/pay/index.html` |
| `dist/welcome/index.html` | prerender.mjs (full-tier) | `test -f dist/welcome/index.html` |
| `dist/privacy/index.html` | prerender.mjs (full-tier) | `test -f dist/privacy/index.html` |
| `dist/terms/index.html` | prerender.mjs (full-tier) | `test -f dist/terms/index.html` |
| `dist/refund/index.html` | prerender.mjs (full-tier) | `test -f dist/refund/index.html` |
| `dist/sitemap.xml` | sitemap.mjs (lastmod-enabled, 6 routes) | `grep -c '<lastmod>' → 6` |
| `.ssr-cache/entry-server.js` | Vite SSR step 2 | `test -f .ssr-cache/entry-server.js` |
| `.ssr-meta/seo-routes.js` | Vite SSR step 3 | `test -f .ssr-meta/seo-routes.js` |

SPA-only routes confirmed absent: `dist/account/`, `dist/success/`, `dist/dashboard/download-skill/`

## Deviations from Plan

### Absorbed from Prior Plans

**1. [Rule 3 - Blocking, absorbed from 02-04] Two separate outDirs instead of single .ssr-cache**
- **Plan 02-06 spec said:** Both SSR builds target `.ssr-cache/`; first uses `--emptyOutDir`, second does not
- **Reality discovered in 02-04:** Vite 6.3.5 empties outDir on every SSR build regardless of `--emptyOutDir` flag when the second build targets the same directory. The second build erases `.ssr-cache/entry-server.js` before `prerender.mjs` can import it.
- **Fix applied:** Two separate outDirs: `.ssr-cache/` for entry-server (step 2), `.ssr-meta/` for seo-routes (step 3). This matches what `scripts/prerender.mjs` and `scripts/sitemap.mjs` already expect (both scripts were updated in 02-04/02-05 to reference the correct paths).
- **Correct chain (this plan):** `... --outDir .ssr-cache --emptyOutDir && vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta && ...`
- **Stale chain (plan spec):** `... --outDir .ssr-cache --emptyOutDir && vite build --ssr scripts/seo-routes.ts --outDir .ssr-cache && ...`

This deviation was fully anticipated — the objective for this plan explicitly documented the corrected chain.

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| Surgical edit (1 line added, 1 removed) | `git diff --numstat package.json` | `1 1 package.json` PASS |
| JSON valid | `node -e "JSON.parse(...)"` | PASS |
| Chain contains all 5 commands | node assertion | PASS |
| `--emptyOutDir` count = 1, on entry-server build | node assertion | PASS |
| No forbidden scripts (test/lint/typecheck) | node assertion | PASS |
| `type=module` preserved | node assertion | PASS |
| `dev=vite` preserved | node assertion | PASS |
| Full build exits 0 | `npm run build` | PASS |
| All 6 per-route HTML + sitemap exist | `test -f` series | PASS |
| SSR cache dirs exist with bundles | `test -d/.ssr-cache/.ssr-meta` | PASS |
| Sitemap has 6 lastmod entries | `grep -c '<lastmod>'` | 6 PASS |
| Phase 1 invariants: 2 JSON-LD, 1 Paddle script | `grep -c` on welcome/index.html | PASS |
| No SPA routes leaked (account, success, dashboard) | `test !` series | PASS |

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1: Extend package.json build script | 9ac726a | build(seo): chain SSR builds + prerender + sitemap into npm run build (GEO-B-1, GEO-B-2, GEO-B-3) |

## Known Stubs

None — plan 02-06 modifies only build infrastructure; no UI or data source wiring involved.

## Threat Flags

None — this plan modifies only the build script in `package.json`. No new network endpoints, auth paths, file access patterns, or schema changes introduced.

## Self-Check: PASSED

- `package.json` modified at `C:\Projects\opten-website\package.json` (line 7)
- Commit `9ac726a` exists in git log
- `npm run build` exits 0
- All Phase 2 artifacts produced: 6 per-route HTML files, `dist/sitemap.xml` with 6 lastmod entries, `.ssr-cache/entry-server.js`, `.ssr-meta/seo-routes.js`
- Phase 1 invariants preserved (2 JSON-LD, 1 Paddle CDN script) in every emitted HTML
- No SPA-only routes emitted (account, success, dashboard/download-skill)
