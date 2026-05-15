---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: "SHIPPED to https://opten.space — deploy `dpl_HAzfr2h8sADbiHHBt4yi4Wkf6ncg` (commit `80b16be`). All 6 prerendered routes serve distinct titles/descriptions/canonicals/OG; 3 SPA-fallback routes (`/account`, `/success`, `/dashboard/download-skill`) keep working without hydration mismatch. Playwright sweep: 0 console errors on all 9 routes. Phase 1 invariants preserved (2 JSON-LD blocks + Paddle sync script on every emitted HTML, security headers intact). `dist/sitemap.xml` has 6 per-route `<lastmod>` entries. Outstanding: visual OG card unfurl test in Telegram/Slack + Paddle modal click test on `/pay` + ~7-14 day AI-crawler refresh window for `/geo audit` rescore."
stopped_at: Phase 2 SHIPPED to production after rollback + hotfix cycle. Deploy `dpl_HAzfr2h8sADbiHHBt4yi4Wkf6ncg` (commit `80b16be`) is live on opten.space; playwright sweep clean.
last_updated: "2026-05-15T18:17:55.259Z"
last_activity: 2026-05-15
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 9
  completed_plans: 8
  percent: 89
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-14)

**Core value:** Sell, service, and onboard extension users without breaking the shipped integration contract with the Opten Chrome extension.
**Current focus:** Phase 2 — Per-route prerender + per-route metadata (COMPLETE + hotfix shipped)
**Active milestone:** GEO Optimization (12/100 → ~30/100 in Phase 1, higher across Phases 2-5)

## Current Position

Phase: 2 (Per-route prerender + per-route metadata) — COMPLETE
Plan: 8 of 8 deployed + 1 hotfix commit (`80b16be`)
Status: SHIPPED to https://opten.space — deploy `dpl_HAzfr2h8sADbiHHBt4yi4Wkf6ncg` (commit `80b16be`). All 6 prerendered routes serve distinct titles/descriptions/canonicals/OG; 3 SPA-fallback routes (`/account`, `/success`, `/dashboard/download-skill`) keep working without hydration mismatch. Playwright sweep: 0 console errors on all 9 routes. Phase 1 invariants preserved (2 JSON-LD blocks + Paddle sync script on every emitted HTML, security headers intact). `dist/sitemap.xml` has 6 per-route `<lastmod>` entries. Outstanding: visual OG card unfurl test in Telegram/Slack + Paddle modal click test on `/pay` + ~7-14 day AI-crawler refresh window for `/geo audit` rescore.
Last activity: 2026-05-15

Progress: [██████████] 100% shipped

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

## Accumulated Context

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Hydration speedup + perceived-load optimization (code-split, modulepreload, img dims, PNG->WebP/AVIF) (URGENT)

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

- **Phase 2 prerequisite (RESOLVED 2026-05-15)**: cross-route head-management strategy — decided build-time prerender via `scripts/prerender.mjs`. `react-helmet-async` rejected.
- **Phase 2 post-deploy verification (CLOSED 2026-05-15)**: deploy `dpl_HAzfr2h8sADbiHHBt4yi4Wkf6ncg` (commit `80b16be`, hotfix included) shipped to opten.space; Sections A-D verified via curl, Section E playwright sweep on all 9 routes returned 0 console errors. Outstanding visual checks (OG card unfurl, Paddle modal click) listed under "Pending Todos" below.
- **Phase 2 hotfix landed 2026-05-15**: see commit `80b16be` — `fix(seo): match prerender path to client route + eager-import hero animation`. Two regressions fixed: (a) hydration mismatch on SPA-fallback routes via `window.__PRERENDER_PATH` marker + path-check in `main.tsx`, (b) Suspense SSR failure on `/` via eager-import of `OptenHeroAnimation`. Initial Phase 2 deploy (`b241989`) was rolled back via `vercel rollback` before hotfix was promoted — extension users were never exposed to the broken state for longer than ~30 minutes.
- **Phase 3 prerequisite (open question)**: per-language URL strategy — `/ru/*` `/en/*` vs `?lang=` vs subdomain. Must be resolved before Phase 3 detailed planning.
- **Locked-route constraint (permanent)**: `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` must keep responding at root paths — applies to every phase, especially Phase 3 bilingual work (`/ru/*` `/en/*` are **additions**, not replacements).

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Security | CSP header in `vercel.json` | Separate ticket | 2026-05-14 (Phase 1 scope cut) |
| Hygiene | Audit and dedupe overlapping UI libs (Radix + MUI + Lucide + react-slick + embla) inherited from Figma Make origin | Not scheduled | 2026-05-14 (not a GEO concern) |

## Session Continuity

Last session: 2026-05-15T00:00:00.000Z
Stopped at: Phase 2 SHIPPED to production after rollback + hotfix cycle. Deploy `dpl_HAzfr2h8sADbiHHBt4yi4Wkf6ncg` (commit `80b16be`) is live on opten.space; playwright sweep clean.
Next action: (1) visual OG unfurl test on Telegram/Slack + Paddle modal browser test on /pay; (2) ~7-14 days from 2026-05-15 → `/geo audit https://opten.space` for Phase 2 score uplift measurement; (3) resolve Phase 3 prerequisite (per-language URL strategy — `/ru/*` `/en/*` vs `?lang=` vs subdomain) before `/gsd-plan-phase 3`; (4) extract Phase 2 hotfix as anti-pattern for future prerender phases (SPA-fallback hydration mismatch + Suspense SSR boundary failure).
Resume file: None
