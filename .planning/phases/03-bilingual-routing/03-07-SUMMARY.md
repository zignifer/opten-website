---
phase: 03-bilingual-routing
plan: 07
subsystem: routing
tags: [react-router, ssr, prerender, bilingual, en, i18n]

# Dependency graph
requires:
  - phase: 03-bilingual-routing plan 06
    provides: LangProvider URL-prefix-driven; SSR-eager en.json gate for /en/* parity
  - phase: 03-bilingual-routing plan 02
    provides: 13-entry prerender manifest with EN route metadata + __PRERENDER_PATH applyMarker for /en/* paths
  - phase: 03-bilingual-routing plan 03
    provides: prerender bakes <html lang>, hreflang triplet, og:locale per file
provides:
  - scripts/entry-server.tsx registers 5 EN full-prerender routes (/en/, /en/welcome, /en/privacy, /en/terms, /en/refund)
  - src/main.tsx registers 6 EN client routes including /en/pay for SPA navigation + head-tier hydration
  - All 12 dist files emit with correct __PRERENDER_PATH markers and non-empty EN body content
  - dist/en/welcome/index.html has EN body content (10631 bytes) with <html lang="en"> baked
affects:
  - 03-bilingual-routing plan 08 (LangSwitcher — unblocked by this plan completing route surface area)
  - 03-bilingual-routing plan 04 (Paddle widen — Wave 4, depends_on this plan)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Phase 2 D-06 mirror invariant: entry-server.tsx and src/main.tsx modified in same commit to keep SSR/client route tables in sync"
    - "Tier discipline D-02: /en/pay is head-only — mounted in src/main.tsx only (client SPA nav + head-tier hydration), NOT in entry-server.tsx"
    - "Per-page Route declarations (no wildcard) — __PRERENDER_PATH discriminator requires exact-path match"
    - "Existing lazy PayPage chunk reused for /en/pay — single chunk serves both /pay and /en/pay"

key-files:
  created: []
  modified:
    - scripts/entry-server.tsx
    - src/main.tsx

key-decisions:
  - "5 EN routes in entry-server.tsx (no /en/pay — head-only per D-02+D-03b)"
  - "6 EN routes in src/main.tsx (includes /en/pay for SPA navigation; reuses existing lazy PayPage)"
  - "Both files modified in single atomic commit (Phase 2 D-06 mirror invariant)"
  - "Per-page Route declarations only — no wildcard /en/* to preserve __PRERENDER_PATH discriminator logic"

patterns-established:
  - "Mirror invariant: whenever SSR entry-server adds EN routes, client main.tsx adds them too (same commit)"
  - "/en/pay excluded from SSR tier but included in client router — matches /pay treatment"

requirements-completed:
  - GEO-C-1
  - GEO-C-2

# Metrics
duration: 15min
completed: 2026-05-16
---

# Phase 03 Plan 07: Register /en/* Routes in Both Routers — Summary

**Both client (BrowserRouter) and SSR (StaticRouter) route tables extended with 6 EN siblings; all 12 dist files emit with correct `__PRERENDER_PATH` markers and non-empty EN prerendered body content**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-16T22:20:00Z
- **Completed:** 2026-05-16T22:35:00Z
- **Tasks:** 3 auto + 1 checkpoint (human-verify)
- **Files modified:** 2

## Accomplishments
- `scripts/entry-server.tsx` extended with 5 EN full-prerender routes (`/en/`, `/en/welcome`, `/en/privacy`, `/en/terms`, `/en/refund`); `/en/pay` intentionally absent (head-only per D-02+D-03b); NOTE comment updated to include `/en/pay` in the exclusion clause
- `src/main.tsx` extended with 6 EN client routes including `/en/pay` (reuses existing lazy `PayPage` chunk); banner comment added above new block
- `npm run build` exits 0; prerender.mjs emits all 12 routes with correct `__PRERENDER_PATH` markers
- `dist/en/welcome/index.html` = 10631 bytes with `<html lang="en">` and EN body content ("Welcome to Opten", "extension", "Open"); `dist/welcome/index.html` = 10576 bytes with `<html lang="ru">` — no RU→EN regression

## Task Commits

1. **Tasks 1+2: Register EN routes in both routers** - `62f78c0` (feat) — both files in one atomic commit per D-06 mirror invariant
2. **Task 3: Build verification** — no new commit needed; build artifacts verified inline

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `scripts/entry-server.tsx` — +5 EN full-prerender Route declarations + updated NOTE comment (1 deletion, 6 insertions)
- `src/main.tsx` — +6 EN Route declarations + banner comment (7 insertions)

## Decisions Made
- Tasks 1 and 2 committed atomically in a single `feat(03-07)` commit to enforce Phase 2 D-06 mirror invariant — splitting would leave SSR/client desynced
- `/en/pay` excluded from `entry-server.tsx` (matches `/pay` treatment — head-tier routes don't SSR body), included in `src/main.tsx` (SPA navigation + head-tier hydration need the client mount)
- Existing lazy `PayPage` chunk reused for `/en/pay` — no new `lazy()` call; single network fetch serves both routes

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. Build passed on first attempt. `webpsave_buffer: no property named 'smart_deblock'` warnings in Vite output are pre-existing platform warnings (Windows + libvips quirk), not related to this plan.

## Build Verification Results

```
✓ / → dist/index.html (full)
✓ /pay → dist/pay/index.html (head)
✓ /welcome → dist/welcome/index.html (full)
✓ /privacy → dist/privacy/index.html (full)
✓ /terms → dist/terms/index.html (full)
✓ /refund → dist/refund/index.html (full)
✓ /en/ → dist/en/index.html (full)
✓ /en/pay → dist/en/pay/index.html (head)
✓ /en/welcome → dist/en/welcome/index.html (full)
✓ /en/privacy → dist/en/privacy/index.html (full)
✓ /en/terms → dist/en/terms/index.html (full)
✓ /en/refund → dist/en/refund/index.html (full)
✓ prerender complete: 12 routes emitted
```

All 12 `__PRERENDER_PATH` markers verified correct. `dist/en/welcome/index.html` = 10631 bytes with English content. `dist/welcome/index.html` = 10576 bytes with Russian content.

## Checkpoint: Task 4 — Preview Smoke (VERIFIED via Playwright)

**Status:** APPROVED

Orchestrator ran the verification via `@playwright/mcp` against `npx vite preview --host 127.0.0.1 --port 4180` after `npm run build`. Notes:

- Vite preview does not auto-resolve `/en/welcome` to `dist/en/welcome/index.html` (it falls back to root `index.html`). The verification used the trailing-slash form `/en/welcome/` which vite resolves correctly. Production Vercel resolves both bare and trailing-slash paths via filesystem-first routing, so this is preview-only quirk.
- Dev-mode React warnings would normally be needed to surface hydration mismatch text — none were required because production minified bundle returned zero React errors on all scenarios.

### Results

| # | Scenario | htmlLang | Content | Console |
|---|---|---|---|---|
| 1 | `/en/welcome/` direct | `en` ✓ | EN welcome copy ("Pin the extension", "Sign in to your account") ✓ | 0 errors |
| 2 | `/en/` direct | `en` ✓ | EN landing ("Stop Wasting Credits On Bad Prompts") ✓ | 0 errors |
| 3 | `/welcome/` locked route | `ru` ✓ | RU title preserved ✓ | 0 errors |
| 4 | `/en/pay/` direct | `en` ✓ | EN pricing title ("Opten pricing — Pro subscription for prompt improvement") ✓ | 0 errors; `window.Paddle` ready |
| 5 | SPA nav `/en/` → `/en/welcome/` | `en` ✓ | path updated, lang preserved ✓ | 0 errors |
| 6 | SPA nav `/welcome/` → `/en/welcome/` | `ru` (baked at SSR; client doesn't mutate `<html lang>`) | path updated to `/en/welcome/` | 0 errors |

Hreflang triplet at `/en/welcome/` resolved correctly: `ru → /welcome`, `en → /en/welcome`, `x-default → /welcome`.

### Edge note (not a regression)

Scenario 6 — `<html lang>` stays at SSR-baked value during the session because the LangContext (post Plan 01 escalation fix) intentionally does NOT mutate `document.documentElement.lang` at runtime. This was the root cause of the residual hydration mismatch. The URL change DOES drive content (Plan 06's `useLocation()`-bound `useEffect`) and per-route SSR HTML carries the correct `<html lang>` on direct loads — this is the documented D-07 behavior. No follow-up needed.

### Resolution

Wave 4 (Plans 04 + 08) UNBLOCKED — proceeding.

## Known Stubs

None — all new routes mount existing complete components (App, WelcomePage, PrivacyPage, TermsPage, RefundPage, PayPage). No placeholder content.

## Threat Flags

None — no new network endpoints, auth paths, or trust-boundary changes introduced. Only React Router route table additions.

## Next Phase Readiness
- Route surface area complete: all 6 EN siblings registered in both routers
- Plan 08 (LangSwitcher) unblocked at routing layer
- Plan 04 (Paddle widen + robots.txt) unblocked — Wave 4 starts now
- Manual checkpoint (Task 4) resolved via orchestrator Playwright sweep (see above)

## Self-Check

**Files exist:**
- `scripts/entry-server.tsx` — modified (verified in git status)
- `src/main.tsx` — modified (verified in git status)

**Commits exist:**
- `62f78c0` — feat(03-07): register /en/* routes in both client + SSR routers

**Build:** `npm run build` exit 0, 12 routes emitted

## Self-Check: PASSED

---
*Phase: 03-bilingual-routing*
*Completed: 2026-05-16*
