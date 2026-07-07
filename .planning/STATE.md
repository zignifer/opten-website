---
gsd_state_version: 1.0
milestone: none
milestone_name: "Between formal milestones"
status: no_active_milestone; Telegram hidden intro + 24h discount claim shipped across website and extension backend. Current planned work: protected general owner admin dashboard for acquisition channels, first module Telegram stats/broadcasts.
stopped_at: ""
last_updated: "2026-07-07T00:00:00.000Z"
last_activity: 2026-07-07
progress:
  total_phases: 2
  completed_phases: 2
  total_plans: 20
  completed_plans: 19
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-17 with v1.0 shipped state)

**Core value:** Sell, service, and onboard extension users without breaking the shipped integration contract with the Opten Chrome extension.
**Current focus:** Protected general owner admin dashboard for acquisition channels. First slice: Telegram hidden intro stats and safe broadcasts.
**Active milestone:** None. This is ad-hoc cross-repo product work unless promoted into a formal GSD milestone.

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
  - **Models hub redesign + fixes (`7e55350`, `4d8c899`, `3e93d56`)** — `/models` переоформлен под блог (чипы-фильтры в стиле блога + поиск справа, отступ intro→табы уменьшен вдвое 28→14px), добавлен клиентский поиск по имени/вендору/intro (`?q`, debounce). Починен пред-существующий **hydration mismatch** на `/models` И `/blog` (прямая загрузка фильтрованного URL → React #418/#425): URL-фильтры теперь применяются после монтирования (`hydrated` gate), первый клиентский рендер = SSR. Переименована общая модель `seedance` «Seedance 2.0» → «Seedance (общий)» / «Seedance (general)» (был дубль имени с `seedance-2.0`); фикс в skill MD + registry + metaEn (regen-safe).
  - **Hub + blog UI polish (`31cd086`, `dd35ee3`, `c543a6c`)** — хаб `/models` получил центрированный градиентный hero как у блога (видимые хлебные крошки убраны, BreadcrumbList-схема осталась — как на хабе блога); заголовок «Поддерживаемые AI-модели» → «AI-модели» / «AI models»; отступ hero→фильтры на блоге уменьшен (убран `md:min-h-[520px]`, теперь как на хабе). Скрыты **11 общих/umbrella моделей** (flux, gpt-image, imagen, kling, luma-ray, midjourney, nano-banana, seedance, seedream, sora, veo) с сетки хаба + счётчиков + ItemList-схемы через `HUB_HIDDEN_SLUGS` (`src/content/models/index.ts`) — карточки выглядели странно рядом с конкретными версиями. Страницы **остались живыми**: prerendered, в sitemap (144 routes без изменений), линкуются из related-models (не осиротели). Хаб показывает 51 (24 image / 27 video).

Next:
  1. Refresh durable project context for the Telegram hidden intro / 24h claim flow across `AGENTS.md`, docs, and `.planning` in both `opten-website` and `promptscore`.
  2. Brainstorm and approve the protected `/admin/*` design: website auth, server-side owner allowlist, no client secrets, aggregated stats, Telegram broadcast module, and future acquisition-channel extensibility.
  3. Implement in phases after design approval: security hardening, read-only admin dashboard, then broadcast composer/queue.

Deferred follow-ups (из Codex review Phase 2, 2026-05-20 — non-blocking, защита от будущих регрессий, контент уже корректен 62/62):
  - **[MEDIUM] Встроить `scripts/verify-models-content.mjs` в build-цепочку** (рядом с verify-faq-mainentity.mjs в package.json). Caveat: скрипт делает raw-`.ts` dynamic import → нужен Node ≥22.18 на Vercel. Сначала подтвердить версию Node на Vercel (доступно через Vercel MCP / dashboard), потом вшивать. Пользователь отложил 2026-05-20.
  - **[LOW] Расширить verify-скрипт** на проверку вложенных обязательных полей (section.heading/body, example.before/after, mistake.title/explain, faq.q, h1). Сейчас частично подстраховано типами при `vite build`.

Параллельные открытые задачи (отложены):
  - v1.0 Phase 4.2 post-deploy GEO rescore (target ~80+) — окно открыто
  - Bing token replacement — операционная задача, не блокирует
  - **SPA client-nav `<title>` не обновляется** на per-route (пред-существующее, не Phase 2). Prerendered HTML title корректен → SEO не затронут. Косметика для UX вкладки браузера.
  - **`/models/seedance` `<title>`/`<h1>` всё ещё «Seedance 2.0»** (из content-файла, не из meta.name). Страница скрыта с хаба, низкий приоритет; контент-заголовок стоит поправить на «Seedance (общий)» при следующем касании content/models/seedance.ts.

## Post-v2.0 hotfix series (2026-05-21)

Ad-hoc performance + iOS-Safari interactivity hotfixes, shipped while idle between milestones. Not a formal GSD phase; recorded here for continuity. Full diagnosis: [[SAFARI-MOBILE-INTERACTIVITY]] + [[SPEED-AUDIT-MOBILE]].

- **Speed: subset fonts + model-content data-island (`dfdd68d`).** Subset Unbounded (259→81 KB) + PT Root UI (93→65 KB); split all 62 model-content files out of the entry chunk via `index.client.ts` + a vite `isSsrBuild` alias + a per-page JSON data-island. Entry chunk **2.1 MB → 449 KB raw**. Mobile PageSpeed **LCP 5.7s → 2.7s, Performance 66 → 91**.
- **iOS-Safari "slow + dead buttons" — decisive fix (`fdc5786`).** Root cause: heavy `filter: blur` (hero gradient, 285/150px) + `backdrop-filter` (fixed header) — cheap on Chrome but they saturate WebKit's main thread during load + every scroll frame → 2-3s before buttons respond + scroll jank. Lighthouse (Chromium) never reproduced it. Fix: drop `backdrop-filter` on mobile, cut blur radius (285→140 / 150→75), drop `will-change`. Confirmed on device; **Speed Index 4.2s → 2.4s, TBT 70ms → 0ms**. Lesson recorded: a green Lighthouse score ≠ healthy on Safari.
- **Secondary fixes (correct, kept, not decisive):** eager-EN dict on the client to kill an `/en/*` React #418 hydration mismatch (`3f4cc80`); `overflow-x: hidden → clip` on root scrollers as WebKit hardening (`acb98a3`).
- **Deferred as NOT needed:** route-level code-splitting (FIX-06). Codex confirmed the bottleneck was paint, not JS weight; high effort + touches the fragile hydration path (`__PRERENDER_PATH` discriminator the extension relies on) for a modest win. Revisit only if real-device traces show JS parse/eval dominating.
- **Docs synced:** codebase map fully refreshed (`96b278c`); `docs/TECH.md` + `docs/ARCHITECTURE.md` updated (eager-EN, subset fonts, data-island, current build chain).

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

## Deferred Items

Acknowledged and deferred at v2.0 close (2026-05-20). Pre-close artifact audit (`gsd-sdk query audit-open`) flagged 7 open items — all stale v1.0 leftovers, not v2.0 blockers:

| Category | Item | Status |
|----------|------|--------|
| quick_task | 260516-pmk-normalize-mobile-landing-section-spacing | missing (v1.0, shipped; artifact file absent) |
| uat_gap | phase 03 (03-HUMAN-UAT.md) | resolved (0 open scenarios) |
| verification_gap | phase 02 (02-VERIFICATION.md, v1.0 per-route-prerender) ×5 | stale v1.0 phase artifacts, not cleaned up |

These belong to the v1.0 phase directories still living in `.planning/phases/` (never archived). Run `/gsd-cleanup` to retroactively archive v1.0 + v2.0 phase dirs.

## Session Continuity

Last session: 2026-05-20 (v2.0 close)
Stopped at: v2.0 milestone closed and archived. ROADMAP.md collapsed, REQUIREMENTS.md archived → `milestones/v2.0-REQUIREMENTS.md` and removed, PROJECT.md updated, Phase 2 SUMMARY written, git tag `v2.0` created. Idle between milestones.
Resume: `.planning/milestones/v2.0-ROADMAP.md` (historical) or `/gsd-new-milestone` (next milestone). Phase directories (v1.0 + v2.0) still in `.planning/phases/` — `/gsd-cleanup` to archive.
