---
phase: "03-bilingual-routing"
plan: "06"
subsystem: "i18n / LangContext"
tags:
  - langcontext
  - url-prefix-detection
  - ssr
  - hydration
  - bilingual
dependency_graph:
  requires:
    - "03-01: LangContext cleanup (deleted document.documentElement.lang write)"
    - "03-02: seo-routes EN entries (htmlLang field)"
  provides:
    - "URL-prefix-aware LangProvider for Plans 07, 08"
    - "SSR-safe lang detection for Plan 05 /en/* routes"
  affects:
    - "src/i18n/LangContext.tsx"
    - "scripts/entry-server.tsx (LangProvider now inside StaticRouter)"
    - "src/main.tsx (LangProvider now inside BrowserRouter)"
tech_stack:
  added:
    - "useLocation() from react-router (runtime URL-prefix detection)"
  patterns:
    - "URL-prefix-driven i18n (D-05/D-07)"
    - "SSR-safe lang detection via useLocation in StaticRouter"
    - "Static import fallback for SSR-eager en.json gate"
key_files:
  created: []
  modified:
    - "src/i18n/LangContext.tsx"
    - "scripts/entry-server.tsx"
    - "src/main.tsx"
decisions:
  - "top-level-await fallback: static enFallback import chosen over top-level await (chrome87 target rejects top-level await in client bundle)"
  - "LangProvider moved inside Router: useLocation() requires Router context; both entry-server.tsx and main.tsx updated"
metrics:
  duration: "~15min"
  completed_date: "2026-05-16"
  tasks_completed: 3
  files_changed: 3
---

# Phase 03 Plan 06: LangContext URL-prefix detection Summary

**One-liner:** URL-prefix-driven `LangProvider` reads `useLocation().pathname` synchronously — `/en/*` routes get `lang="en"` on first render in both SSR (`StaticRouter`) and client (`BrowserRouter`) with zero RU→EN flash.

## What Was Built

### Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Add `detectLangFromPath` helper + rename to `detectLangFromStorage` with SSR guard | 75fd6d4 | `src/i18n/LangContext.tsx` |
| 2 | Refactor `LangProvider` — URL-driven `useState`, `location.pathname`-keyed `useEffect`, SSR-eager `en.json` gate | 75fd6d4 | `src/i18n/LangContext.tsx` |
| 3 | Build verification — `npm run build` exits 0; RU SSR unchanged; Plan 01 invariants preserved | 5406ec3 | `scripts/entry-server.tsx`, `src/main.tsx` |

### Key Changes to `src/i18n/LangContext.tsx`

1. **`detectLangFromPath(pathname)`** — pure helper: returns `"en"` for `/en/*` or `/en`, `null` otherwise (D-05 URL-prefix precedence).
2. **`detectLangFromStorage()`** — renamed from `detectLang()`. First line: `if (typeof window === "undefined") return "ru"` (SSR-safe guard).
3. **`useLocation()` in `LangProvider`** — called synchronously at top of function body. `useState<Lang>(pathLang ?? "ru")` initializer is URL-driven.
4. **`useEffect([location.pathname])`** — replaces the old `useEffect([], [])`. Re-runs on every URL change: prefixed paths → URL wins; unprefixed → storage/navigator fallback (D-07 preserved).
5. **SSR-eager `en.json` gate** — static `import enFallback from "./en.json"` at module top; `if (typeof window === "undefined") { dicts.en = enFallback as Dict; }` populates `dicts.en` synchronously for SSR render of `/en/*` routes.
6. **No `document.documentElement.lang` write** — Plan 01 deletion preserved (invariant).

### Deviation: LangProvider moved inside Router context

During Task 3 build verification, `prerender.mjs` crashed with:
> `useLocation() may be used only in the context of a <Router> component`

**Root cause:** `LangProvider` was previously outside `<StaticRouter>` in `entry-server.tsx` and outside `<BrowserRouter>` in `main.tsx`. Adding `useLocation()` to `LangProvider` required Router context.

**Fix (Rule 3 — auto-fix blocking issue):**
- `scripts/entry-server.tsx`: `<StaticRouter>` now wraps `<LangProvider>` (previously reversed)
- `src/main.tsx`: `<BrowserRouter>` now wraps `<LangProvider>` (previously reversed)
- Commit: 5406ec3

### Deviation: top-level await fallback to static import

**Attempted:** `if (typeof window === "undefined") { const enModule = await import("./en.json"); ... }` (top-level await per plan's primary recommendation).

**Rejected by build:**
> `Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)`

**Fallback chosen (per RESEARCH.md OQ-4 recommendation b):** Static `import enFallback from "./en.json"` + `if (typeof window === "undefined") { dicts.en = enFallback as Dict; }`.

**Impact:** `en.json` content is now bundled into the main client chunk. Vite emits a warning: "en.json is dynamically imported by LangContext.tsx but also statically imported by LangContext.tsx, dynamic import will not move module into another chunk." The main bundle size remains 148.22 KB / 40.39 KB gzip — identical to the pre-Plan-06 baseline (en.json was already being bundled by Vite's chunking strategy).

## Build Verification

```
npm run build — exit 0
✓ 12 routes emitted: 6 RU + 6 EN
✓ dist/index.html has <!--$-->...<!--/$--> Suspense markers (Plan 01 invariant preserved)
✓ dist/welcome/index.html has Suspense markers + RU content (10258 bytes body)
✓ dist/en/welcome/index.html has Suspense markers (body empty — /en/* SSR routes added in Plan 05)
```

**Note:** `dist/en/welcome/index.html` body is currently empty because `entry-server.tsx` does not yet declare `/en/*` routes (Plan 05's job). The `LangContext` URL-prefix detection mechanism is in place and will produce English bodies once Plan 05 registers the EN routes.

## Suspense Markers Check (Plan 01 invariant)

- `dist/index.html`: `<!--$-->...<!--/$-->` present ✓
- `dist/welcome/index.html`: `<!--$-->...<!--/$-->` present ✓
- `dist/en/welcome/index.html`: `<!--$-->...<!--/$-->` present ✓

## Client Bundle Size

| Metric | Before Plan 06 | After Plan 06 | Delta |
|--------|---------------|---------------|-------|
| `index-*.js` raw | 148.22 KB | 148.22 KB | 0 KB |
| `index-*.js` gzip | 40.39 KB | 40.39 KB | 0 KB |

No regression — en.json was already inlined by Vite's bundler pre-Plan-06.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] LangProvider outside Router context**
- **Found during:** Task 3 build (prerender.mjs crash)
- **Issue:** `useLocation()` called in `LangProvider` which was outside `<StaticRouter>` / `<BrowserRouter>`
- **Fix:** Moved `<LangProvider>` inside Router in both `entry-server.tsx` and `main.tsx`
- **Files modified:** `scripts/entry-server.tsx`, `src/main.tsx`
- **Commit:** 5406ec3

**2. [Rule 1 - Bug] top-level await rejected by esbuild chrome87 target**
- **Found during:** Task 3 first build attempt
- **Issue:** Plan's primary SSR gate mechanism (top-level await) rejected by Vite esbuild transpiler targeting chrome87
- **Fix:** Applied plan's documented fallback — static import + `typeof window` conditional at module evaluation time
- **Files modified:** `src/i18n/LangContext.tsx`
- **Commit:** 75fd6d4

## Threat Flags

No new security surface introduced. Changes are confined to i18n detection logic and Router nesting order. `detectLangFromPath` is a pure prefix check with no data leak risk (T-03-15 accepted per plan threat model). No new network endpoints, auth paths, or schema changes.

## Known Stubs

None — no placeholder text, empty values, or unconnected props introduced.

## Self-Check: PASSED

- `src/i18n/LangContext.tsx`: FOUND ✓
- `scripts/entry-server.tsx`: FOUND ✓ (LangProvider inside StaticRouter)
- `src/main.tsx`: FOUND ✓ (LangProvider inside BrowserRouter)
- `.planning/phases/03-bilingual-routing/03-06-SUMMARY.md`: FOUND ✓
- Commit `75fd6d4`: FOUND ✓
- Commit `5406ec3`: FOUND ✓
