---
phase: 03-bilingual-routing
plan: "03"
subsystem: prerender-pipeline
tags:
  - geo
  - hreflang
  - og-locale
  - html-lang
  - prerender
dependency_graph:
  requires:
    - 03-02  # seo-routes manifest with htmlLang + hreflangAlternates
  provides:
    - build-time html lang baking (GEO-C-4)
    - hreflang triplet in <head> (GEO-C-3)
    - og:locale + og:locale:alternate per emitted file (Pitfall 4 fix)
  affects:
    - dist/*.html (all 12 prerendered files)
    - 03-04  # Paddle widen — next edit to prerender.mjs
tech_stack:
  added: []
  patterns:
    - regex.test() for fail-fast anchor check (Rule 1 fix over html===before)
    - escapeAttr() applied defensively on all attribute values
key_files:
  modified:
    - scripts/prerender.mjs
decisions:
  - "Use regex.test() for anchor existence check instead of html===before — the latter gives false positives when the replacement value equals the existing value (e.g. applyHtmlLang on RU routes replaces lang=ru with lang=ru leaving html unchanged)"
  - "applyHreflang runs AFTER applyMeta because canonical link (the injection anchor) does not exist in the source template — applyMeta creates it at build time"
  - "og:locale:alternate injection is idempotent (second replace after first replace always finds the anchor)"
metrics:
  duration: "12 min"
  completed: "2026-05-16"
  tasks_completed: 3
  files_changed: 1
---

# Phase 3 Plan 03: prerender — applyHtmlLang / applyHreflang / applyOgLocale Summary

**One-liner:** Three new `apply*` helpers bake `<html lang>`, hreflang triplet, and `og:locale` into all 12 prerendered HTML files at build time using manifest-driven values from `seo-routes.ts`.

## What Was Built

Added three sibling helper functions to `scripts/prerender.mjs` mirroring the existing `applyMeta` / `applyModulePreload` / `applyPaddleScript` pattern:

| Helper | What it does | Anchor |
|--------|-------------|--------|
| `applyHtmlLang` | Replaces `<html lang="ru">` with the per-route `meta.htmlLang` | `/<html\s+lang="[^"]*"([^>]*)/` |
| `applyHreflang` | Injects 3-tag triplet (ru / en / x-default) after canonical link | `/<link rel="canonical"[^>]*\/>` |
| `applyOgLocale` | Swaps `og:locale` content + appends `og:locale:alternate` | `/<meta property="og:locale".../>` |

Main loop wiring order (between `applyMeta` and `applyModulePreload`):
```
applyMeta → applyHtmlLang → applyHreflang → applyOgLocale → applyModulePreload → applySafariPreloadFallback → [Paddle on /pay] → applyMarker
```

### Diff stats

- Lines added to `scripts/prerender.mjs`: +61 (3 new functions + 3 loop call lines + inline comments)
- Lines modified in `scripts/prerender.mjs`: ~3 (loop wiring)
- Total diff: ~64 lines changed

## Verification Results

```
PASS: all 12 files have correct <html lang>, hreflang triplet, og:locale + alternate
```

Sample grep output:
- `dist/en/welcome/index.html` — `<html lang="en">` ✓, 3 hreflang tags ✓, `og:locale=en_US` ✓, `og:locale:alternate=ru_RU` ✓
- `dist/welcome/index.html`   — `<html lang="ru">` ✓, 3 hreflang tags ✓, `og:locale=ru_RU` ✓, `og:locale:alternate=en_US` ✓
- `dist/index.html`           — `<!--$-->` Suspense marker preserved ✓

All success criteria green:
- [x] `dist/en/welcome/index.html` contains `<html lang="en">`
- [x] `dist/welcome/index.html` contains `<html lang="ru">`
- [x] `dist/welcome/index.html` contains `hreflang="x-default"`
- [x] `dist/index.html` contains `og:locale` with `ru_RU`
- [x] `dist/index.html` Suspense marker `<!--$-->` preserved
- [x] `npm run build` exits 0, 12 routes emitted

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] fail-fast guard fires incorrectly when replacement value matches existing value**

- **Found during:** Task 3 (full build run)
- **Issue:** `applyHtmlLang` and `applyOgLocale` used `if (html === before) throw` as the anchor-existence guard. For RU routes, `applyHtmlLang` replaces `lang="ru"` with `lang="ru"` — identical strings — so `html === before` is `true` and the error fires even though the anchor exists perfectly.  
  Same pattern in `applyOgLocale`: replacing `og:locale=ru_RU` with `og:locale=ru_RU` on RU routes.
- **Fix:** Changed both helpers to use `regex.test(html)` as the existence check before performing the replace. The `html===before` check was only meaningful when the replacement value always differs from the source — not guaranteed here.
- **Files modified:** `scripts/prerender.mjs`
- **Commits:** `f0e71b6`

## Note for Plan 04

`scripts/prerender.mjs` has one remaining change for Phase 3: Plan 04 widens the Paddle injection condition from `if (meta.path === "/pay")` to also include `/en/pay`. The current Paddle condition is untouched as planned.

## Self-Check: PASSED

- `scripts/prerender.mjs` exists and contains all 3 new functions ✓
- Commits `2c65135`, `d9261d8`, `f0e71b6` present in git log ✓
- All 12 `dist/*/index.html` files exist ✓
- Full verification node script returned PASS ✓
