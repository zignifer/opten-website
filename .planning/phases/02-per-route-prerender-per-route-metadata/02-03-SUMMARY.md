---
phase: 02-per-route-prerender-per-route-metadata
plan: "03"
subsystem: i18n
tags: [ssr, lang-context, hydration, geo-b-2]
dependency_graph:
  requires: []
  provides: [ssr-safe-lang-provider]
  affects: [scripts/entry-server.tsx, all routes wrapping LangProvider]
tech_stack:
  added: []
  patterns: [useEffect-deferred-init]
key_files:
  created: []
  modified:
    - src/i18n/LangContext.tsx
decisions:
  - "Default useState to string literal \"ru\" (not detectLang function ref) to avoid localStorage/navigator access during renderToString"
  - "detectLang() deferred to useEffect with empty dep array — runs once on client mount, no typeof window guard needed"
metrics:
  duration: "< 5 minutes"
  completed: "2026-05-15"
---

# Phase 2 Plan 03: SSR-safe LangContext Summary

## One-liner

Deferred `detectLang()` from `useState` initializer to `useEffect` so `LangProvider` is safe under `renderToString` — default render always emits RU, client re-syncs on mount.

## What Was Done

Single surgical edit to `src/i18n/LangContext.tsx` (line 30 + 4-line insertion):

**Line 30 before:**
```ts
const [lang, setLangState] = useState<Lang>(detectLang);
```

**Line 30 after:**
```ts
const [lang, setLangState] = useState<Lang>("ru"); // Phase 2 D-05: SSR-safe RU default; detection runs in useEffect below.
```

**Inserted block (lines 32-35):**
```ts
useEffect(() => {
  // detectLang() reads localStorage + navigator — defer to client mount (RESEARCH.md Pitfall 1).
  setLangState(detectLang());
}, []);
```

Lines 1-29 and 36-63 (post-insertion numbering) are byte-identical to the original.

## Why This Was Needed

`detectLang()` calls `localStorage.getItem()` and reads `navigator.language` — both undefined in Node.js. When `react-dom/server.renderToString` executes `LangProvider`, the synchronous `useState(detectLang)` call threw `ReferenceError: localStorage is not defined`. This blocked all SSR work in Plans 02-04 through 02-08.

Fix: use a string literal as the `useState` default (`"ru"` matches `<html lang="ru">` hardcode in `index.html` — zero hydration mismatch). Re-run detection inside `useEffect` which only fires in the browser.

## Verification Results

All 9 automated checks passed:

| Check | Result |
|-------|--------|
| `npm run build` exits 0 | PASS |
| `useState<Lang>("ru")` count = 1 | PASS |
| `useState<Lang>(detectLang)` count = 0 | PASS |
| `setLangState(detectLang())` count = 1 | PASS |
| `localStorage.getItem(STORAGE_KEY)` count = 1 | PASS |
| `navigator.language.startsWith("ru")` count = 1 | PASS |
| `typeof window` not present | PASS |
| `useEffect` count >= 3 (import + 2 hooks = 4) | PASS (4) |
| `document.documentElement.lang = lang` count = 1 | PASS |
| 5 public exports present | PASS |

## Behavioral Contract

| Scenario | Before | After |
|----------|--------|-------|
| SSR / `renderToString` | ReferenceError (crash) | Renders with `lang="ru"` cleanly |
| RU-locale client (stored pref or navigator RU) | `lang="ru"` immediately | `lang="ru"` immediately (no change) |
| EN-locale client (stored "en" or navigator EN) | `lang="en"` immediately | `lang="ru"` for ~1 paint tick, then `lang="en"` |
| `setLang("en")` persists to localStorage | Works | Works (unchanged) |

The one-tick RU flash on EN-locale clients is acceptable (CONTEXT.md D-05, D-06 — Phase 2 prerenders RU only; client hydration carries user preference).

## Deviations from Plan

None — plan executed exactly as written.

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1: Patch LangContext.tsx | 5bb80d1 | fix(i18n): defer detectLang() to useEffect for SSR safety |

## Self-Check: PASSED

- `src/i18n/LangContext.tsx` exists and contains `useState<Lang>("ru")` exactly once
- Commit `5bb80d1` exists in `git log`
- `npm run build` exits 0
