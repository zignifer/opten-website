---
phase: 02-per-route-prerender-per-route-metadata
plan: "02"
subsystem: scripts/ssr
tags:
  - ssr
  - prerender
  - react-router
  - seo
  - geo-b-2
dependency_graph:
  requires:
    - 02-01 (scripts/seo-routes.ts — route manifest providing route list)
  provides:
    - scripts/entry-server.tsx (renderRoute export for prerender script)
  affects:
    - scripts/prerender.mjs (plan 02-05 — will import .ssr-cache/entry-server.mjs)
    - package.json (plan 02-06 — wires vite build --ssr of this file)
tech_stack:
  added: []
  patterns:
    - StaticRouter from "react-router" (v7 unified)
    - renderToString from "react-dom/server"
    - Named export function (not default) for build-time SSR entry
key_files:
  created:
    - scripts/entry-server.tsx
  modified: []
decisions:
  - "Only 5 full-prerender routes mounted per D-02: /, /welcome, /privacy, /terms, /refund"
  - "PayPage/SuccessPage/AccountPage/DownloadSkillPage deliberately excluded — integration contract guard (EXTENSION_IDS / SUPABASE_URL / VITE_PADDLE_ENV must not enter SSR bundle)"
  - "LangProvider import included; SSR crash from localStorage is expected until plan 02-03 fixes LangContext"
  - "StaticRouter imported from 'react-router' (NOT react-router-dom — v7 unified package)"
  - "CSS import retained so vite build --ssr does not warn (CSS is a no-op at SSR runtime)"
metrics:
  duration: "~10 minutes"
  completed: "2026-05-15"
  tasks_completed: 1
  files_created: 1
  files_modified: 0
---

# Phase 2 Plan 02: SSR Entry (entry-server.tsx) Summary

**One-liner:** `renderToString` + `StaticRouter` SSR entry mounting exactly 5 marketing routes, decoupled from the Paddle-bootstrapping `src/main.tsx`.

## What Was Built

Created `scripts/entry-server.tsx` — the build-time SSR React tree entry that exports a single named function `renderRoute(path: string): string`. The file:

- Uses `renderToString` from `react-dom/server` to produce an HTML body string.
- Wraps the route tree in `<LangProvider><StaticRouter location={path}><Routes>...</Routes></StaticRouter></LangProvider>`.
- Mounts exactly **5 full-prerender routes** per D-02:
  - `/` → `<App />`
  - `/welcome` → `<WelcomePage />`
  - `/privacy` → `<PrivacyPage />`
  - `/terms` → `<TermsPage />`
  - `/refund` → `<RefundPage />`

The file is currently **unimported** by the SPA build tree, so `npm run build` (Vite SPA build) exits 0 unaffected. The SSR Vite compilation (`vite build --ssr scripts/entry-server.tsx`) is wired by plan 02-06.

## Commits

| Hash | Message |
|------|---------|
| e8125e0 | feat(seo): add SSR entry scripts/entry-server.tsx for 5 marketing routes (GEO-B-2) |

## Verification Results

All plan-specified checks passed:

| Check | Result |
|-------|--------|
| File exists at scripts/entry-server.tsx | PASS |
| npm run build exits 0 | PASS |
| `export function renderRoute` count = 1 | PASS |
| `from "react-router"` present | PASS |
| `react-router-dom` absent | PASS |
| `from "react-dom/server"` present | PASS |
| Excluded pages not imported (PayPage, SuccessPage, AccountPage, DownloadSkillPage) | PASS |
| Locked constants absent (EXTENSION_IDS, SUPABASE_URL, SUPABASE_ANON_KEY, VITE_PADDLE) | PASS |
| `<Route path=` count = 5 | PASS |
| No createRoot/hydrateRoot/getElementById in executable code | PASS |
| No import of src/main.tsx | PASS |

## Integration-Contract Guard

The following pages were deliberately **NOT** imported into this file:
- `PayPage` — reads `import.meta.env.VITE_PADDLE_ENV`, `EXTENSION_IDS`, `SUPABASE_URL`
- `SuccessPage` — SPA-only tier, no SSR value, reads `EXTENSION_IDS`
- `AccountPage` — reads `EXTENSION_IDS` + `SUPABASE_URL` (extension-coupled)
- `DownloadSkillPage` — reads `EXTENSION_IDS` + `SUPABASE_URL`, Pro-gated (extension-coupled)

This exclusion ensures none of Paddle's env vars, `EXTENSION_IDS`, or Supabase constants enter the SSR bundle — conforming to RESEARCH.md Pitfall 5 and the integration contract in `docs/INTEGRATION-CONTRACT.md §4`.

## Known Dependency: Plan 02-03 Required Before SSR Compilation

Attempting `vite build --ssr scripts/entry-server.tsx` right now will fail with:

```
ReferenceError: localStorage is not defined
```

This is **expected** — `src/i18n/LangContext.tsx` line 30 calls `detectLang()` as the `useState` initializer, which immediately calls `localStorage.getItem(...)`. That call site is SSR-unsafe. Plan 02-03 patches LangContext to use `useState("ru")` with a post-hydration `useEffect` to defer the `detectLang()` call to the client. Until 02-03 lands, the SSR entry source file is correct but non-compilable.

The gate: **Plan 02-04 or 02-06** runs the SSR compile command; those plans depend on 02-03 completing first.

## Deviations from Plan

None — plan executed exactly as written.

## Threat Flags

No new security-relevant surface introduced. This file is a build-time-only script; it does not create network endpoints, auth paths, or file access patterns in the deployed application.

## Self-Check: PASSED

- `scripts/entry-server.tsx` exists: confirmed
- Commit e8125e0 exists: confirmed
- 5 routes mounted: confirmed (grep returns 5)
- No excluded pages, locked constants, or client render APIs in executable code: confirmed
- `npm run build` exits 0: confirmed
