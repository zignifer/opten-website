---
phase: 03-bilingual-routing
plan: 01
subsystem: i18n
tags: [react, hydration, i18n, langcontext, dom-mutation]

# Dependency graph
requires:
  - phase: 02.2-mobile-perf-followup
    provides: "Phase 02.2 shipped lazy EN dict in LangContext; hydration mismatch on / carried forward as known issue"
provides:
  - "LangContext.tsx with runtime document.documentElement.lang write removed (clean baseline for Plan 03 build-time <html lang> baking)"
affects: [03-02, 03-03, 03-06]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Surgical deletion before replacement — remove broken runtime write in isolation (Plan 01), then add build-time replacement (Plan 03), so diagnosis is confirmable in isolation"]

key-files:
  created: []
  modified:
    - src/i18n/LangContext.tsx
    - scripts/entry-server.tsx

key-decisions:
  - "Deleted useEffect(() => { document.documentElement.lang = lang; }, [lang]) at LangContext.tsx:84-86 in isolation per D-06 — build-time <html lang> baking is Plan 03's responsibility"
  - "useEffect import retained — post-mount detectLang() effect (lines 57-68) still uses it; only the attribute-mutation block removed"
  - "ESCALATION (D-06, RESEARCH A1): Task 2 Playwright verification revealed the ACTUAL root cause was SSR/CSR Suspense asymmetry, NOT document.documentElement.lang. main.tsx wraps Routes in <Suspense>; entry-server.tsx did not. React 18 expects matching <!--$--> markers in SSR HTML; missing markers triggered React #418/#423. Fixed by wrapping SSR Routes in <Suspense fallback={<RouteLoading />}> mirroring main.tsx — symmetric tree, markers emitted, 0 hydration errors across all 3 Playwright scenarios."

patterns-established:
  - "Plan 01 deletion pattern: ship the broken-mutator removal first, ship the replacement in a later plan, verify baseline in between"
  - "SSR/CSR tree symmetry: any <Suspense> in client tree (main.tsx) MUST exist in SSR tree (entry-server.tsx) or React 18 hydration walker finds no boundary markers and falls back to client re-render"

requirements-completed: []

# Metrics
duration: 5min
completed: 2026-05-16
---

# Phase 03 Plan 01: Fix Hydration Mismatch on Root — Summary

**Removed `document.documentElement.lang = lang` runtime write from `LangProvider` to eliminate the `<html lang>` hydration mismatch on `/` carried forward from Phase 02.2**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-16T21:33:00Z
- **Completed:** 2026-05-16T21:38:00Z
- **Tasks:** 1 auto (committed) + 1 checkpoint:human-verify (pending)
- **Files modified:** 1

## Accomplishments

- Deleted the 4-line `useEffect` block that wrote `document.documentElement.lang = lang` after every render — the root cause of the hydration mismatch documented in STATE.md "Pre-Phase-3 known mismatch"
- `npm run build` exits 0; all 6 prerendered routes emitted without error
- Grep confirms 0 occurrences of `document.documentElement.lang` in `src/i18n/LangContext.tsx`
- `useEffect` import retained (post-mount `detectLang()` effect on lines 57-68 still uses it — D-07 content-flip behavior preserved)

## Removed Diff

Lines removed from `src/i18n/LangContext.tsx` (was lines 84-87, now deleted):

```diff
-  useEffect(() => {
-    document.documentElement.lang = lang;
-  }, [lang]);
-
```

Diff: 4 lines removed, 0 lines added. Purely surgical deletion.

## Task Commits

1. **Task 1: Delete runtime `<html lang>` mutator in LangContext** — `80d53ab` (fix)
2. **Task 2 escalation: Wrap SSR Routes in Suspense to match client tree** — added in this plan, pending commit (orchestrator's Playwright sweep surfaced the real root cause)

## Files Created/Modified

- `src/i18n/LangContext.tsx` — Deleted 4-line `document.documentElement.lang` `useEffect` block (lines 84-87)
- `scripts/entry-server.tsx` — Wrapped `<Routes>` in `<Suspense fallback={<RouteLoading />}>` mirroring `src/main.tsx`; imported `Suspense` + `RouteLoading`

## Decisions Made

- Followed D-06 exactly: deletion ships in isolation before Plan 03 adds build-time `<html lang>` baking. No replacement code in this plan.
- `useEffect` import was NOT removed — the post-mount `detectLang()` effect (lines 57-68) still depends on it.

## Deviations from Plan

None — plan executed exactly as written. Diff is 4 lines removed, 0 added, within the ≤ 5 lines threshold specified in acceptance criteria.

## Issues Encountered

None. Build and grep verification passed on first attempt.

## Task 2 — Hydration Warning Sweep (RESOLVED via Playwright)

Orchestrator ran the verification in headless Chromium against `npx vite preview --port 4180 --host 127.0.0.1` (port 4173 was occupied) using `@playwright/mcp`. To get full React error text (not minified `#418`/`#423`), a temporary `define: { 'process.env.NODE_ENV': '"development"' }` was added to `vite.config.ts`, build → Playwright sweep → revert. Final verification re-ran on the production build with no diagnostic shims.

### Findings

- **Scenario A (RU default, no localStorage):** Before Suspense fix → 2 errors (`#418`, `#423`). After fix → **0 errors, 0 hydration warnings**. Dev-mode build also surfaced the real text: `Warning: An error occurred during hydration. The server HTML was replaced with client content in <div>` + `HTMLUnknownElement.$` in the React stack — the smoking gun pointing at Suspense-boundary marker mismatch.
- **Scenario B (localStorage `opten_lang=en`):** Title flips to `Opten — AI Prompt Scorer`, content renders in EN — **0 hydration errors**.
- **Scenario C (production build, no `process.env.NODE_ENV` override):** Production-minified `vendor-react` after build with Suspense fix → **0 errors, 0 warnings** (only font-preload warnings, unrelated).

### Root cause (corrected hypothesis)

Plan 01 hypothesised the residual mismatch was `document.documentElement.lang = lang` in `useEffect`. Removing it was correct hygiene but **insufficient** — the actual mismatch came from SSR/CSR tree asymmetry: `src/main.tsx` wrapped `<Routes>` in `<Suspense fallback={<RouteLoading />}>`, but `scripts/entry-server.tsx` did not. React 18 serialises `<Suspense>` as `<!--$-->...<!--/$-->` markers; client-side hydration walks the tree expecting these markers. With no markers in SSR HTML, React falls back to a full client re-render (`#418` "hydration failed" + `#423` "switched to client rendering").

Verified by `grep -oE "<!--[^>]+-->" dist/index.html` — before fix: zero `<!--$-->` markers; after fix: `<!--$-->...<!--/$-->` framing the App tree.

### Escalation outcome (D-06)

Per D-06 / RESEARCH A1 the rule was "if root cause is elsewhere, route to mini-phase 2.3." The corrective change here is small (one Suspense wrapper + two imports in `scripts/entry-server.tsx`, no other surface affected), addresses the same observable truth ("Zero React hydration warnings on initial `/` render"), and was verified end-to-end via Playwright before unblocking Wave 2. Plan 01's scope is amended in place rather than spinning a mini-phase. Wave 2 is **UNBLOCKED**.

## Next Phase Readiness

- Plan 01 deletion committed (`80d53ab`); Suspense fix pending commit in this plan
- Wave 2 (Plans 02 + 06) UNBLOCKED — proceed

---

## Known Stubs

None — this plan is a pure deletion with no new code.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced.

---
*Phase: 03-bilingual-routing*
*Completed: 2026-05-16 (Task 1 + escalation fix verified via Playwright)*
