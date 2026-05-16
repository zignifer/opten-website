---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: awaiting-phase-3-discuss
stopped_at: Phases 02 + 02.1 + 02.2 closed; mobile section spacing normalized via quick task; blocked on Phase 3 URL-strategy decision
last_updated: "2026-05-16T18:50:00Z"
last_activity: 2026-05-16
progress:
  total_phases: 7
  completed_phases: 4
  total_plans: 23
  completed_plans: 23
  percent: 57
  percent_note: "4 of 7 phases complete (1, 2, 2.1, 2.2). Phase 2.2 shipped inline (~5 atomic commits, no per-task plan artifacts — see 02.1-VERIFICATION.md retroactive note + ROADMAP.md Phase 2.2 section). Phases 3-5 have no plans authored yet."
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-14)

**Core value:** Sell, service, and onboard extension users without breaking the shipped integration contract with the Opten Chrome extension.
**Current focus:** Awaiting Phase 3 — bilingual routing (blocked on per-language URL strategy decision)
**Active milestone:** GEO Optimization (12/100 → ~30/100 in Phase 1, higher across Phases 2-5)

## Current Position

Phase: 02.2 (mobile-perf-followup) — CLOSED 2026-05-16 (shipped inline; retroactive note in `.planning/phases/02.1-hydration-and-perf/02.1-VERIFICATION.md`)
Plans: 1 → 8/8, 2 → 8/8, 2.1 → 7/7, 2.2 → inline (no per-task plans, ~5 atomic commits `0a73069`..`81284d4`)
Status: Phases 02, 02.1, 02.2 all in production. Quick task 260516-pmk (mobile section spacing normalization) shipped 2026-05-16 (commit `c4a96ba`).
Last activity: 2026-05-16
Next: Phase 3 (bilingual routing) — discuss in progress (separate context), blocks on per-language URL strategy (`/ru/*` `/en/*` vs `?lang=` vs subdomain).

Milestone phases: 4 of 7 complete (1, 2, 2.1, 2.2). Phases 3-5 backlog.
Progress: [██████░░░░] 57%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: n/a
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Static GEO foundations | 0/8 | - | - |

**Recent Trend:**

- Last 5 plans: n/a (none completed)
- Trend: n/a

*Updated after each plan completion*
| Phase 02-per-route-prerender-per-route-metadata P01 | 15 | 1 tasks | 1 files |
| Phase 02-per-route-prerender-per-route-metadata P04 | 45 | 1 tasks | 2 files |
| Phase 02-per-route-prerender-per-route-metadata P05 | 15m | 1 tasks | 1 files |
| Phase 02-per-route-prerender-per-route-metadata P06 | 10m | 1 tasks | 1 files |
| Phase 02-per-route-prerender-per-route-metadata P08 | 15 | 2 tasks | 0 files |
| Phase 02.1-hydration-and-perf P01 | 3m | 2 tasks | 2 files |
| Phase 02.1-hydration-and-perf P02 | 3 minutes | 1 tasks | 1 files |
| Phase 02.1-hydration-and-perf P05 | 30 | 2 tasks | 3 files |

## Accumulated Context

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2 (2026-05-15): Hydration speedup + perceived-load optimization (code-split, modulepreload, img dims, PNG->WebP/AVIF) (URGENT)
- Phase 2.2 inserted after Phase 2.1 (2026-05-16): Mobile-perf + Safari fixes — Paddle SDK lazy on `/pay`, vendor chunk split, self-hosted WOFF2 + adjusted-fallback metrics, Safari `<link rel=preload as=script>` fallback, `touch-action: manipulation`, lazy EN i18n dict, mobile srcset for feature cards + steps. Shipped inline as ~5 atomic commits (`0a73069`, `451af5b`, `3556fe4`, `39d2f4d`, `c353e5e`, `e9b24c6`, `15eb5c3`, `09341be`, `81284d4`). No `.planning/phases/02.2-*/` directory created — reactive work, tracked via commit history + retroactive note in `02.1-VERIFICATION.md`.

### Decisions

Full log in PROJECT.md Key Decisions table — 8 ADR-locked decisions from `docs/INTEGRATION-CONTRACT.md` + 6 milestone-level decisions. Recent decisions affecting current work:

- Phase 1: confined to `public/` + `index.html` + `vercel.json` — no React or build-pipeline changes.
- Phase 1: Task 8 (vercel.json) executed last as highest-risk; rollback = `git revert <sha>`.
- Phase 1: CSP header deferred (conflicts with Paddle inline script — separate ticket).
- Phase 1: OG `og:image` points to RU card (hardcoded `<html lang="ru">`); EN card ready for Phase 2.
- Phase 1: `/pay` stays crawlable in robots.txt (diverges from SEO-AUDIT.md broader recommendation; SPEC wins).
- [Phase ?]: Phase 2 Plan 01
- [Phase ?]: Two-outDir SSR builds (.ssr-cache + .ssr-meta) — Vite 6 empties outDir on every SSR build even without --emptyOutDir; splitting dirs prevents inter-build erasure
- [Phase ?]: pathToFileURL() for dynamic import on Windows — bare C:\ absolute paths rejected by Node ESM loader

### Pending Todos

[From .planning/todos/pending/ — ideas captured during sessions]

- **Phase 2 post-deploy visual checks** — visual OG card unfurl test in Telegram + Slack against https://opten.space/{,welcome,privacy,terms,refund,pay}; Paddle modal click test on `/pay` in real browser (confirm modal opens, no console errors).
- **Phase 2 GEO rescore** — after ~7-14 days on production (2026-05-22 – 2026-05-29 window), run `~/.claude/skills/geo/scripts/fetch_page.py` against the 5 fully-prerendered routes (confirm `has_ssr_content: true`, `word_count > 100`); then run `/geo audit https://opten.space` for Phase 2 score uplift measurement.
- **Phase 2 lessons-learned** — for future GSD planning loops: (a) playwright sweep across ALL routes (including SPA-fallback ones) should be an acceptance gate in plan-checker, not just in human-verify; (b) `dist/index.html` overwrite has wide blast radius via Vercel's SPA rewrite — prerender of `/` must coexist with empty SPA-fallback semantics for other routes. Both should feed the "Anti-Patterns" reference for future prerender phases.

### Blockers/Concerns

- **Phase 02.1 (CLOSED 2026-05-16)**: 7/7 plans shipped. Verified via PageSpeed Insights Mobile against `https://opten.space` — score 91 / CLS 0 / TBT 0 ms. See [02.1-VERIFICATION.md](phases/02.1-hydration-and-perf/02.1-VERIFICATION.md).
- **Phase 02.2 (CLOSED 2026-05-16)**: shipped inline as ~5 atomic commits (no per-task plan artifacts). Integration Contract §6 preserved on `/pay`. Retroactive note in `02.1-VERIFICATION.md`; ROADMAP.md Phase 2.2 section enumerates the scope.
- **Phase 2 prerequisite (RESOLVED 2026-05-15)**: cross-route head-management strategy — decided build-time prerender via `scripts/prerender.mjs`. `react-helmet-async` rejected.
- **Phase 2 post-deploy verification (CLOSED 2026-05-15)**: deploy `dpl_HAzfr2h8sADbiHHBt4yi4Wkf6ncg` (commit `80b16be`, hotfix included) shipped to opten.space; Sections A-D verified via curl, Section E playwright sweep on all 9 routes returned 0 console errors. Outstanding visual checks (OG card unfurl, Paddle modal click) listed under "Pending Todos" below.
- **Phase 2 hotfix landed 2026-05-15**: see commit `80b16be` — `fix(seo): match prerender path to client route + eager-import hero animation`. Two regressions fixed: (a) hydration mismatch on SPA-fallback routes via `window.__PRERENDER_PATH` marker + path-check in `main.tsx`, (b) Suspense SSR failure on `/` via eager-import of `OptenHeroAnimation`. Initial Phase 2 deploy (`b241989`) was rolled back via `vercel rollback` before hotfix was promoted — extension users were never exposed to the broken state for longer than ~30 minutes.
- **Phase 3 prerequisite (OPEN — blocks `/gsd-plan-phase 3`)**: per-language URL strategy — `/ru/*` `/en/*` vs `?lang=` vs subdomain. Discuss currently in progress (separate context); resolve before `/gsd-plan-phase 3`.
- **Pre-Phase-3 known mismatch (carried from Phase 02.2)**: landing (`/`) retains a pre-existing hydration mismatch identified by Plan 02.2-02 Playwright sweep. Predates Phase 02.2 (verified via `git stash`); React recovers via client re-render. Should be addressed before Phase 3 bilingual work so it doesn't compound with dynamic `<html lang>` changes.
- **Locked-route constraint (permanent)**: `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` must keep responding at root paths — applies to every phase, especially Phase 3 bilingual work (`/ru/*` `/en/*` are **additions**, not replacements).

## Quick Tasks Completed

| ID | Slug | Date | Files | Notes |
|----|------|------|-------|-------|
| 260516-pmk | normalize-mobile-landing-section-spacing | 2026-05-16 | 1 | Mobile-only: section gaps→140, heading→content→60, hero top −19. Build ✓, Playwright-замеры подтвердили все 9 целевых гэпов. |

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Security | CSP header in `vercel.json` | Separate ticket | 2026-05-14 (Phase 1 scope cut) |
| Hygiene | Audit and dedupe overlapping UI libs (Radix + MUI + Lucide + react-slick + embla) inherited from Figma Make origin | Not scheduled | 2026-05-14 (not a GEO concern) |

## Session Continuity

Last session: 2026-05-16T18:50:00Z
Stopped at: Phases 02, 02.1, 02.2 all closed in production; quick task 260516-pmk (mobile section spacing) shipped (commit `c4a96ba`); STATE.md + ROADMAP.md reconciled. Phase 3 discuss already running in a separate context.
Next action (in order):
  1. **Finish Phase 3 discuss** (in progress in separate context) — resolve per-language URL strategy decision, then `/gsd-plan-phase 3`.
  2. **Pre-Phase-3 hygiene** — investigate the residual landing-page hydration mismatch flagged by Plan 02.2-02 Playwright sweep, so it doesn't compound with dynamic `<html lang>` work in Phase 3.
  3. **Phase 2 follow-up todos (independent of Phase 3)** — visual OG unfurl test on Telegram/Slack + Paddle modal browser test on `/pay`; GEO rescore window opens 2026-05-22 → `/geo audit https://opten.space`.
  4. **Lessons-learned capture** — Phase 2 hotfix + Phase 02.2 ad-hoc-then-retroactive pattern → future anti-patterns reference.
Resume file: None
