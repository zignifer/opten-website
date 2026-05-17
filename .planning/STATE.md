---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: v1.0 MILESTONE CLOSED — 7 phases shipped + 2 closed-as-deferred-to-v2 (Phase 5 off-site, Phase 6 needs content strategy upstream). Ready for milestone archive.
stopped_at: "v1.0 milestone closed on 2026-05-17. Phase 4.2 deployed (commit b02b258 + 18 prior commits pushed to origin/main). Phase 5 (brand authority off-site) and Phase 6 (scale-ready architecture refactor) closed as deferred to v2 milestone per user direction — both are not code-trackable in v1 (off-site marketing + content-strategy prerequisite, respectively). 5 post-deploy / human-only checks tracked in 04.2-VERIFICATION.md (X-Robots materialization, visual h1 smoke, Bing token replacement, IndexNow acceptance 24-72h, GEO rescore 7-14d) — not blocking closure."
last_updated: "2026-05-17T19:30:00.000Z"
last_activity: 2026-05-17
progress:
  total_phases: 9
  completed_phases: 9
  total_plans: 58
  completed_plans: 51
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-14)

**Core value:** Sell, service, and onboard extension users without breaking the shipped integration contract with the Opten Chrome extension.
**Current focus:** Phase 04 — content-surface
**Active milestone:** GEO Optimization (12/100 → ~30/100 in Phase 1, higher across Phases 2-5)

## Current Position

Phase: v1.0 MILESTONE CLOSED
Plan: All in-scope phases shipped; Phase 5 + 6 closed as deferred-to-v2.
Plans: 1 → 8/8, 2 → 8/8, 2.1 → 7/7, 2.2 → inline, 3 → 8/8 + 2 post-release fixes, 4 → 6/7 + UAT 6/6 PASS, 4.1 → 13/13, 4.2 → 7/7 + 1 code-review fix. Phase 5 — closed as deferred to v2 (off-site work). Phase 6 — closed as deferred to v2 (needs content strategy upstream).
Status: v1.0 MILESTONE CLOSED. Ready for archive.
Last activity: 2026-05-17
Next:
  1. **Post-deploy manual checks** (after Vercel finishes the b02b258 deploy on opten.space): curl X-Robots-Tag on /account; visual h1 smoke on /pay + /welcome RU+EN; Bing token replacement in index.html; IndexNow acceptance (24-72h); GEO rescore (7-14d, target 72.6 → ~80+).
  2. **v2 milestone planning** (when ready): start with `/gsd-new-milestone` — Phase 5 (brand authority off-site) and Phase 6 (scale-ready architecture refactor) scopes preserved in v1.0 ROADMAP archive as picking material.
  3. **Archive v1.0**: `/gsd-complete-milestone v1.0` moves ROADMAP/STATE into `.planning/milestones/v1.0-*` and resets STATE for v2.

Milestone phases: 9 of 9 closed (7 shipped + 2 deferred-to-v2 with rationale).
Progress: [██████████] 100% — v1.0 closed.

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
| Phase 04.2 P02 | 90s | 2 tasks | 2 files |

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
- [Phase ?]: Phase 4.2 Plan 02: Delete public/sitemap.xml entirely (no stub/comment replacement) — scripts/sitemap.mjs single-sources dist/sitemap.xml
- [Phase ?]: Phase 4.2 Plan 02: Block /api/ at robots.txt level via Disallow /api/ + /en/api/ in all 16 blocks; X-Robots-Tag header layer deferred to Wave 7 (approval-gated)

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
| 260517-t5i | seo-geo-audit-batch | 2026-05-17 | 11 | Post 2026-05-17 GEO audit P0+P1+часть P2. 10 атомарных коммитов: Person name fix (CR-1), YouTube sameAs (CR-2/3), Article+WebPage speakable schemas, robots.txt 8 AI bots, PT Root UI font-display optional (CR-4 mobile CLS), hero definitional абзац + partners disclaimer (CR-5), visible guide dates, founder email, llms.txt /en/about, per-route sitemap lastmod, per-route meta author. Expected GEO score 63 → 75-78. Build ✓, 16 routes prerendered, FAQ parity gate OK. |

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Security | CSP header in `vercel.json` | Separate ticket | 2026-05-14 (Phase 1 scope cut) |
| Hygiene | Audit and dedupe overlapping UI libs (Radix + MUI + Lucide + react-slick + embla) inherited from Figma Make origin | Not scheduled | 2026-05-14 (not a GEO concern) |
| Phase 4 perf | Mobile LCP ≤ 2.5 s (V-18/V-19) — Unbounded font subsetting; new regression floor 3.5 s (was 3.3 s per 04-LCP-AUDIT, refreshed by 2026-05-17 PSI run) | Separate ticket | 2026-05-17 (Option 1 defer locked in 04-LCP-AUDIT) |

## Session Continuity

Last session: 2026-05-17T17:35:36.175Z
Stopped at: Phase 4.1 closed; dual Codex CLI SEO/GEO review completed (with + without GEO frame); synthesis written; Phase 4.2 inserted with 5 P0 + 7 P1 + 3 decisions captured. Ready to run `/gsd-autonomous` on Phase 4.2.
Next action (in order):

  1. **`/gsd-spec-phase 4.2`** — formalize SPEC from the synthesis seed (`.planning/research/SEO-REVIEW-SYNTHESIS-2026-05-17.md`). Likely auto-classifies the 5 P0 + 7 P1 + 3 decisions into ambiguity scoring.
  2. **`/gsd-discuss-phase 4.2`** — resolve the 3 conflicts (D-1 definitional paragraph hero vs footer; D-2 canonical model count `43+` vs `60+`; D-3 hreflang `ru`/`en` vs `ru-RU`/`en-US`) + clarify CSP scope (P1-2) + Bing Webmaster account ownership (P1-4).
  3. **`/gsd-plan-phase 4.2`** — wave structure with approval gates around P0-3 (h1 on /pay + /welcome), P0-4 (X-Robots header), and P1-2 (CSP) since they touch extension-coupled surface.
  4. **`/gsd-execute-phase 4.2`** — atomic commits; non-extension-coupled work auto-commits per `feedback_commit_policy.md`; extension-coupled waves stop for approval per `feedback_autonomy_and_caution.md`.
  5. **GEO rescore window** — pre-4.2 baseline = 72.6/100 (Codex GEO 2026-05-17). 7-14 days after Phase 4.2 deploys, re-run `/geo audit https://opten.space` — target 78-82/100. Capture both `/` and `/en/`.
  6. **Phase 5 + Phase 6 remain backlog** — Phase 5 off-site (Product Hunt, Wikipedia, Reddit); Phase 6 architectural refactor (route inventory unification, archetype builders) — surface when content strategy is decided.

Resume file: None
