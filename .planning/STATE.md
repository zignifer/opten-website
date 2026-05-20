---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: "Programmatic SEO — Model Pages"
status: Phase 2 SHIPPED (2026-05-20) — 62 model content files generated, verified 62/62, wired into 144 routes, 126 prerendered HTML, pushed to main (a9b3a5c). Vercel deploying. Only remaining item is the 7-14 day post-deploy GSC monitoring window (2-07).
stopped_at: ""
last_updated: "2026-05-20T04:30:00.000Z"
last_activity: 2026-05-20
progress:
  total_phases: 2
  completed_phases: 2
  total_plans: 20
  completed_plans: 19
  percent: 95
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-17 with v1.0 shipped state)

**Core value:** Sell, service, and onboard extension users without breaking the shipped integration contract with the Opten Chrome extension.
**Current focus:** v2.0 Phase 2 shipped 2026-05-20 — 62 programmatic model pages live. Post-deploy GSC monitoring window open.
**Active milestone:** v2.0 — Programmatic SEO — Model Pages (Phase 1 + Phase 2 shipped; monitoring window remains).

## Current Position

Milestone: **v2.0 — Programmatic SEO — Model Pages**
Phase: **Phase 2 — Models Content Generation + Publication** (✅ shipped 2026-05-20)
Plan: см. `.planning/phases/02-models-content/2-PLAN.md`
Status: Phase 2 закрыта. 62 контент-файла (RU+EN) сгенерированы 7 параллельными агентами, verify-models-content 62/62 зелёный, все 62 модели в routes (144 prerendered routes), 126 model HTML в dist/models + dist/en/models, sitemap 144 URL, llms.txt 144, FAQ-parity gate зелёный. Запушено в main (`a9b3a5c`), Vercel автодеплоит → IndexNow пингует 144 URL при сборке.
Last activity: 2026-05-20 — Phase 2 shipped (8 коммитов: 7 контент-батчей + 1 инфра-wire), build green, Playwright + Codex review passed, push authorized by user.

Post-Phase-2 hotfixes (2026-05-20, pushed 6dbc26a):
  - **EN meta localization (`c867910`)** — `meta.name/platform/duration/resolution` приходят из `_registry.ts` (парсятся дословно из RU скилл-MD), поэтому 58/62 модели показывали русский на /en/* (Quick Facts, related-карточки, хаб, breadcrumb, SoftwareApplication schema). Добавлен ручной `src/content/models/metaEn.ts` (EN-оверрайды по slug) + хелпер `metaField` (выбирает EN на EN, чистит stray `**`). Прокинут во все рендер-сайты + seo-routes. Генератор regen-safe (metaEn.ts не трогает). verify-models-content теперь падает, если в EN-meta осталась кириллица.
  - **EN head meta localization (`6dbc26a`)** — `index.html` отдаёт `keywords`, `og:image:alt`, author-byline по-русски; prerender локализовал per-route теги, но не эти. `applyMeta` теперь меняет keywords + og:image:alt на английские и транслитерирует автора (Влад Воронежцев → Vlad Voronezhtsev) при `htmlLang === "en"`. RU не тронут.
  - Codex LOW (неполнота verify) частично закрыта EN-meta-cyrillic гейтом. Codex MEDIUM (вшить verify-models-content в build) всё ещё deferred — нужен Vercel Node ≥22.18.

Next:
  1. **Post-deploy v2.0 window** (7-14 дней, ~2026-05-27..06-03): мониторинг GSC «Coverage» по `site:opten.space/models/`. Цель ≥60% URL Indexed (plan 2-07 / MODELS-B-6). Если меньше — diagnostic анализ (тонкий контент, дубликаты, robots.txt) + план корректировок.
  2. **Stage 2 (v2.1)** — ручная правка контента топ-15 моделей (out of scope для Phase 2).

Deferred follow-ups (из Codex review Phase 2, 2026-05-20 — non-blocking, защита от будущих регрессий, контент уже корректен 62/62):
  - **[MEDIUM] Встроить `scripts/verify-models-content.mjs` в build-цепочку** (рядом с verify-faq-mainentity.mjs в package.json). Caveat: скрипт делает raw-`.ts` dynamic import → нужен Node ≥22.18 на Vercel. Сначала подтвердить версию Node на Vercel (доступно через Vercel MCP / dashboard), потом вшивать. Пользователь отложил 2026-05-20.
  - **[LOW] Расширить verify-скрипт** на проверку вложенных обязательных полей (section.heading/body, example.before/after, mistake.title/explain, faq.q, h1). Сейчас частично подстраховано типами при `vite build`.

Параллельные открытые задачи (отложены):
  - v1.0 Phase 4.2 post-deploy GEO rescore (target ~80+) — окно открыто
  - Bing token replacement — операционная задача, не блокирует
  - **SPA client-nav `<title>` не обновляется** на per-route (пред-существующее, не Phase 2). Prerendered HTML title корректен → SEO не затронут. Косметика для UX вкладки браузера.

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
