---
tags:
  - gsd
  - roadmap
kind: roadmap
milestone: "between-milestones"
aliases:
  - Roadmap
---

# Roadmap: opten-website

## Shipped milestones

- **v1.0 — GEO Optimization** *(2026-05-14 → 2026-05-17)* — Static GEO foundations + per-route prerender + bilingual routing + content surface + SEO/GEO polish. 7 phases shipped. GEO Score 12 → ~72.6. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) · [v1.0-REQUIREMENTS.md](milestones/v1.0-REQUIREMENTS.md).
- **v2.0 — Programmatic SEO — Model Pages** *(2026-05-19 → 2026-05-20)* — 62 model pages × RU/EN + 2 hubs = 144 prerendered routes (126 model HTML). 62 content files via 7 parallel agents, verified 62/62, IndexNow pinged. Plus a hotfix series: EN meta + head-meta localization, hub redesign to blog parity, blog/models hydration fix, seedance dedupe, 11 umbrella cards hidden (kept live). Archive: [v2.0-ROADMAP.md](milestones/v2.0-ROADMAP.md) · [v2.0-REQUIREMENTS.md](milestones/v2.0-REQUIREMENTS.md). **Carried forward:** MODELS-B-6 — ≥60% URL Indexed in GSC, monitoring window ~2026-05-27..06-03.

## Post-v1.0 hotfix series (2026-05-17 → 2026-05-18, not a formal milestone)

Shipped in-place between milestones. See [STATE.md](STATE.md) §"Post-v1.0 hotfix series" for the full log.

- Blog migration: retired `/guides/*`, added `/blog` + `/blog/:slug` (BlogPosting + WebPage(speakable) + HowTo + FAQPage + BreadcrumbList). EN_SIBLINGS grew to 9. Vercel 301 redirects in place.
- Unified `<SiteHeader>` + `<SiteFooter>` across landing, blog, content pages.
- Hero / mobile filter polish; AccountPage email pill restore.
- Docs sync (2026-05-18): new `docs/CONTENT-AUTHORING.md` GEO+SEO playbook; CLAUDE.md / AGENTS.md / docs/ARCHITECTURE.md / docs/TECH.md refreshed.

## Active milestone

**None — idle between milestones (v2.0 closed 2026-05-20).**

Next milestone: `/gsd-new-milestone`. Fresh `REQUIREMENTS.md` is created per milestone (the v2.0 one was archived).

## Future milestone candidates (after v2.0)

Из плана Влада (Stages 2-5) + остатков v1.0:

1. **v2.1 — Programmatic SEO Stage 2-3** — уникальные cover-картинки для топ-15 моделей (по данным GSC) + `/compare/<a>-vs-<b>` страницы (~60 новых URL).
2. **v2.2 — SEO Polish** — Image sitemap, AVIF pipeline, Speakable schema, Wikipedia mentions, priceValidUntil, HTML sitemap, RSS, реальный HTTP 404, Bing-токен, build-time h1-check.
3. **v3.0 — Brand authority** — Product Hunt launch, Wikipedia/Wikidata entry, Reddit + Habr + YouTube seeding, expanded `sameAs` schema.
4. **Scale-ready content architecture** — refactor route inventory из hand-listed файлов в единую RouteRecord data model. Откладывается до момента когда программатика покажет необходимость абстракции.

Brand authority и scale-ready architecture (из v1.0 deferred-to-v2) остаются picking-material для v3.

## Backlog

- **Codex MEDIUM** — вшить `scripts/verify-models-content.mjs` в build-цепочку (нужен Node ≥22.18 на Vercel).
- **Codex LOW** — расширить verify-скрипт на проверку вложенных обязательных полей.
- `/models/seedance` content `<title>`/`<h1>` всё ещё «Seedance 2.0» (скрытая страница, low priority).
- v1.0 Phase 4.2 post-deploy GEO rescore (target ~80+) — окно открыто.
- Bing token replacement (`msvalidate.01` TODO).

---

*Roadmap created: 2026-05-14*
*v1.0 closed: 2026-05-17 · v2.0 closed: 2026-05-20*
