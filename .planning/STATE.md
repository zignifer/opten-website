---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: "Programmatic SEO — Model Pages"
status: Phase 1 in progress — models infrastructure setup (TS types, registry parser, React components, SEO routes). Reference page gpt-image-2 будет вручную, потом Phase 2 spawn 7 параллельных агентов для 62 моделей.
stopped_at: ""
last_updated: "2026-05-19T00:00:00.000Z"
last_activity: 2026-05-19
progress:
  total_phases: 2
  completed_phases: 0
  total_plans: 13
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-17 with v1.0 shipped state)

**Core value:** Sell, service, and onboard extension users without breaking the shipped integration contract with the Opten Chrome extension.
**Current focus:** Idle — between milestones.
**Active milestone:** None. v1.0 (GEO Optimization) closed 2026-05-17. Archive: `.planning/milestones/v1.0-{ROADMAP,REQUIREMENTS}.md`.

## Current Position

Milestone: **v2.0 — Programmatic SEO — Model Pages**
Phase: **Phase 1 — Models Infrastructure** (in progress)
Plan: см. `.planning/phases/01-models-infrastructure/1-PLAN.md`
Status: Phase 1 запущена 2026-05-19. На этой стадии настройка TS-типов, парсера скиллов, React-компонентов, расширение seo-routes.ts. Эталонная страница `gpt-image-2` пишется вручную как образец для Phase 2.
Last activity: 2026-05-19 — milestone v2.0 set up, Phase 1 в работе.

Next:
  1. **Phase 1 completion** — 13 атомарных плана (MODELS-A-1..13). Финальный build green + Rich Results Test на /models/gpt-image-2.
  2. **Phase 2** — spawn 7 параллельных Claude Code агентов для генерации 62 контент-файлов. Main-session верификация. Build → 126 HTML. IndexNow ping.
  3. **Post-deploy v2.0 window** (7-14 дней после Phase 2 деплоя): мониторинг GSC «Coverage» отчёта, ожидаем ≥60% URL Indexed.

Параллельные открытые задачи (отложены):
  - v1.0 Phase 4.2 post-deploy GEO rescore (target ~80+) — окно открыто, но фокус на v2.0
  - Bing token replacement — операционная задача, не блокирует

## Post-v1.0 hotfix series (2026-05-17..18)

Shipped between v1.0 close and v2 open. Tracked here for context; not a formal GSD phase.

- **Blog migration (commits 6ffb65d..47d6a2b, "C1..C8 + codex review fix").** Retired the `/guides/*` URL space in favor of `/blog`. Relocated `src/content/guides/` to `src/content/blog/` with a new `BlogPost = { ru, en }` shape (intro / sections / steps / faq). Added `/blog` hub (`BlogListPage`, CollectionPage + ItemList) and `/blog/:slug` post page (BlogPosting + WebPage(speakable) + HowTo + FAQPage + BreadcrumbList). Legacy `/guides/*` URLs return Vercel 301 redirects. Generated per-post cover images at `public/blog/<slug>/cover.jpg`. EN_SIBLINGS grew to 9 entries; sitemap + llms floor checks bumped to 18. Codex review fixes: debounced search race in BlogListPage, ItemList canonical URLs pointing at /blog not legacy /guides.
- **Unified SiteHeader + SiteFooter (commits 4a3c58e, 05248f4, 4088f48).** Replaced bespoke landing `Navbar()` and per-page footers with a single `<SiteHeader variant="landing" | "page">` and shared `<SiteFooter>`. Hamburger menu on every viewport; LangSwitcher repositioned left; AccountPage header now uses the shared shell.
- **Hero / blog visual polish (commits cf5e3a9, be6d5b6, 1883a93).** Blog hero gradient mirrors landing (no harsh crop line); mask gradient removes horizontal seam below hero; mobile filter is now a full-width select instead of a chip row.
- **Account fix (commit fd35b28).** Restored signed-in email pill in header + fixed empty Account button after the SiteHeader unification.
- **Local dev hygiene (commit 4000be7).** Gitignored `.codex/` (local MCP server config).
- **Docs (this session, 2026-05-18).** New [docs/CONTENT-AUTHORING.md](../docs/CONTENT-AUTHORING.md) — GEO+SEO playbook for new pages/posts/images. Refreshed CLAUDE.md, AGENTS.md, docs/ARCHITECTURE.md, docs/TECH.md to reflect blog routes, unified header/footer, 18-route inventory.

Net: site now has a working blog surface (1 post: `gpt-image-2`), unified UI shell, and a written authoring contract that next agents can follow without re-deriving the patterns. GEO rescore window for v1.0 + this series opens ~2026-05-24..31.

## v1.0 final stats

- **Phases shipped:** 7 (1, 2, 2.1, 2.2, 3, 4, 4.1, 4.2)
- **Phases deferred to v2:** 2 (5 brand authority, 6 scale-ready architecture)
- **Atomic plans shipped:** 51 (8 + 8 + 7 + ~5 inline + 8 + 6 + 13 + 7 + 1 review fix)
- **Quick tasks shipped:** 2 (260516-pmk mobile spacing, 260517-t5i GEO audit batch)
- **Git tag:** `v1.0` (2026-05-17)
- **GEO Score trajectory:** 12 → ~30 (Phase 1) → 48 (post-Phase 3) → 63 (2026-05-17 morning) → ~72.6 (post-Phase 4.2) → target ~80+ after deploy bakes in

## Accumulated Context

### Key Decisions (carried forward into v2)

All 8 ADR-locked decisions from `docs/INTEGRATION-CONTRACT.md` (binding interface with the Opten Chrome extension at `C:\Projects\promptscore`) — unchanged. These persist across milestones.

Milestone-level v1.0 decisions are preserved in `.planning/milestones/v1.0-ROADMAP.md`.

### Blockers/Concerns

(none — milestone idle)

### Pending Todos

[From .planning/todos/pending/ — ideas captured during sessions]

(none active — v1.0 Phase 4.2 verification artifacts in `.planning/phases/04.2-seo-geo-polish-post-synthesis/04.2-VERIFICATION.md` list the post-deploy manual checks above as next-action items)

## Session Continuity

Last session: 2026-05-17T20:00:00.000Z
Stopped at: v1.0 milestone closed and archived. PROJECT.md updated. ROADMAP.md collapsed. REQUIREMENTS.md deleted (fresh per next milestone). Phase artifacts in `.planning/phases/` will be cleaned up after archive verification.
Resume file: `.planning/milestones/v1.0-ROADMAP.md` (for historical reference) or `/gsd-new-milestone` (for next milestone start).
