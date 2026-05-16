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

key-decisions:
  - "Deleted useEffect(() => { document.documentElement.lang = lang; }, [lang]) at LangContext.tsx:84-86 in isolation per D-06 — build-time <html lang> baking is Plan 03's responsibility"
  - "useEffect import retained — post-mount detectLang() effect (lines 57-68) still uses it; only the attribute-mutation block removed"

patterns-established:
  - "Plan 01 deletion pattern: ship the broken-mutator removal first, ship the replacement in a later plan, verify baseline in between"

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

**Plan metadata commit:** pending (will be added after checkpoint resolution)

## Files Created/Modified

- `src/i18n/LangContext.tsx` — Deleted 4-line `document.documentElement.lang` `useEffect` block (lines 84-87)

## Decisions Made

- Followed D-06 exactly: deletion ships in isolation before Plan 03 adds build-time `<html lang>` baking. No replacement code in this plan.
- `useEffect` import was NOT removed — the post-mount `detectLang()` effect (lines 57-68) still depends on it.

## Deviations from Plan

None — plan executed exactly as written. Diff is 4 lines removed, 0 added, within the ≤ 5 lines threshold specified in acceptance criteria.

## Issues Encountered

None. Build and grep verification passed on first attempt.

## Checkpoint: Task 2 — Manual Hydration Warning Sweep (PENDING)

Task 2 is `type="checkpoint:human-verify"`. The automated portion (Task 1) is committed. Manual verification required:

**Steps:**
1. `npm run build && npm run preview` — preview at `http://localhost:4173/`
2. Open Chrome with DevTools Console BEFORE navigating to `http://localhost:4173/`
3. **Scenario A (default RU):** Zero console entries matching `Hydration failed`, `did not match`, `Text content did not match`, `Prop \`lang\` did not match`
4. **Scenario B (navigator.language=en):** DevTools → Sensors → Locale `en-US` → Hard-refresh. Still zero hydration warnings. Visual content-flip RU→EN is acceptable (D-07 status quo).
5. **Scenario C (localStorage en):** `localStorage.setItem('opten_lang','en')` in Console → hard-refresh. Still zero hydration warnings.
6. **If warnings persist:** Per D-06 escalation rule — do NOT proceed to Plan 02. Surface full warning text and propose mini-phase 2.3.
7. **If warnings gone:** Type `approved` to unblock Wave 2 (Plan 02 + Plan 06).

## Next Phase Readiness

- Plan 01 deletion committed (`80d53ab`) — baseline hygiene fix for Phase 3
- Plan 02 and all subsequent Wave 1/2 plans remain **blocked** until Task 2 checkpoint is approved
- If D-06 escalation triggers (warnings persist), Plan 02 is suspended and a mini-phase 2.3 is scoped

---

## Known Stubs

None — this plan is a pure deletion with no new code.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced.

---
*Phase: 03-bilingual-routing*
*Completed (Task 1): 2026-05-16*
*Task 2 checkpoint: PENDING human verification*
