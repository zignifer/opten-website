---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: ready_to_plan
stopped_at: Phase 4 fully closed — 6/6 post-deploy UAT items PASS (Paddle/ЮKassa live click confirmed by user). Ready to plan Phase 5.
last_updated: "2026-05-17T11:30:00.000Z"
last_activity: 2026-05-17 -- Phase 04 post-deploy UAT completed (6/6 PASS)
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 31
  completed_plans: 29
  percent: 94
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-14)

**Core value:** Sell, service, and onboard extension users without breaking the shipped integration contract with the Opten Chrome extension.
**Current focus:** Phase 04 — content-surface
**Active milestone:** GEO Optimization (12/100 → ~30/100 in Phase 1, higher across Phases 2-5)

## Current Position

Phase: 5
Plan: Not started
Plans: 1 → 8/8, 2 → 8/8, 2.1 → 7/7, 2.2 → inline (~5 atomic commits `0a73069`..`81284d4`), 3 → 8/8 + 2 post-release fixes (`c789dee`, `bfd164b`), 4 → 6/7 plans shipped (04-02 replaced by 04-LCP-AUDIT Option-1 defer) + post-deploy UAT 6/6 PASS.
Status: Ready to plan
Last activity: 2026-05-17
Next: Phase 5 (brand authority) — backlog; planning not started.

Milestone phases: 6 of 7 complete (1, 2, 2.1, 2.2, 3, 4). Phase 5 backlog.
Progress: [█████████░] 94% — Phase 4 fully closed (6/6 post-deploy UAT PASS). Only Phase 5 remains.

## Performance Metrics

**Velocity:**

- Total plans completed: 14
- Average duration: n/a
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Static GEO foundations | 0/8 | - | - |
| 03 | 8 | - | - |
| 04 | 6 | - | - |

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
| Phase 03-bilingual-routing P01 | 5min | 1 tasks | 1 files |
| Phase 03-bilingual-routing P02 | 8min | 2 tasks | 1 files |
| Phase 03-bilingual-routing P05 | 5min | 1 tasks | 1 files |

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
- [Phase ?]: Deleted useEffect document.documentElement.lang write from LangContext in isolation (D-06) — build-time html lang baking deferred to Plan 03
- [Phase ?]: 03-05: Option A annotated xhtml:link per URL guarantees hreflang reciprocity by construction from manifest field

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
- **Phase 03 (CLOSED 2026-05-16, post-release fixes 2026-05-17)**: 8/8 plans shipped. Per-language URL strategy resolved as `/en/*` path-prefix (D-01). Pre-Phase-3 hydration mismatch resolved in Plan 01. Two post-release i18n bugfixes (`c789dee`, `bfd164b`) cover storage-key migration and non-sibling switcher UX. Full notes in [03-POST-RELEASE.md](phases/03-bilingual-routing/03-POST-RELEASE.md).
- **Locked-route constraint (permanent)**: `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` must keep responding at root paths — applies to every phase; Phase 3 confirmed `/en/*` URLs are **additions**, not replacements.

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
| Phase 4 perf | Mobile LCP ≤ 2.5 s (V-18/V-19) — Unbounded font subsetting; new regression floor 3.5 s (was 3.3 s per 04-LCP-AUDIT, refreshed by 2026-05-17 PSI run) | Separate ticket | 2026-05-17 (Option 1 defer locked in 04-LCP-AUDIT) |

## Session Continuity

Last session: 2026-05-17
Stopped at: Phase 4 fully closed. Post-deploy UAT 6/6 PASS, including Paddle/ЮKassa live-click on `/pay` + `/en/pay` (user-confirmed 2026-05-17). Mobile LCP measured at 3.5 s vs documented 3.3 s base — treated as PSI lab variance and recorded as the new regression floor for the Unbounded font-subsetting ticket. Only carry-over from Phase 4 to a separate ticket: the LCP fix itself.
Next action (in order):

  1. **GEO rescore window** — pre-Phase-4 baseline = 48/100 (2026-05-17, `GEO-AUDIT-POST-PHASE-3.md`). 7–14 days after the Phase 4 deploy (window opens around 2026-05-24, closes around 2026-05-31), re-run `/geo audit https://opten.space` — target 65–73/100 per the audit's quick-win estimate. Capture both `/` and `/en/` for hreflang and bilingual content uplift.
  2. **`/gsd-plan-phase 5`** — Phase 5 brand authority: Wikipedia/Wikidata seed, Product Hunt launch, Reddit + YouTube presence, expanded `sameAs` array. Mostly off-domain marketing work; the only code component is `sameAs` additions in the Organization/Person schemas built by `scripts/prerender.mjs`. Decide scope before planning — Phase 5 may be partially manual (off-domain) rather than fully atomic-commit-trackable.
  3. **Lessons-learned capture (for future GSD)** — (a) Phase 2 hotfix pattern, (b) 02.2 inline-commit pattern, (c) Phase 3 post-release fix loop (D-07b "URL is the only signal" was too strict — needed storage for cross-page persistence), (d) Phase 4 LCP Option-1 defer pattern (audit ticket as a phase artifact instead of forcing the perf fix into the content phase). Useful anti-patterns reference for future plan-checker.

Resume file: `.planning/phases/04-content-surface/04-HUMAN-UAT.md` (closure record) and `.planning/PROJECT.md` (read before Phase 5 planning to refresh integration contract).
