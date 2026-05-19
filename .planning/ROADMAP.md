---
tags:
  - gsd
  - roadmap
kind: roadmap
milestone: "v2.0"
aliases:
  - Roadmap
---

# Roadmap: opten-website

## Shipped milestones

- **v1.0 — GEO Optimization** *(2026-05-14 → 2026-05-17, closed 2026-05-17)* — Static GEO foundations + per-route prerender + bilingual routing + content surface + SEO/GEO polish. 7 phases shipped, 2 closed as deferred-to-v2 (brand authority off-site, scale-ready architecture). GEO Score 12 → ~72.6 (target ~80+ after deploy bakes in). Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) · [v1.0-REQUIREMENTS.md](milestones/v1.0-REQUIREMENTS.md).

## Post-v1.0 hotfix series (2026-05-17 → 2026-05-18, not a formal milestone)

Shipped in-place between milestones. See [STATE.md](STATE.md) §"Post-v1.0 hotfix series" for the full log.

- Blog migration: retired `/guides/*`, added `/blog` + `/blog/:slug` with BlogPosting + WebPage(speakable) + HowTo + FAQPage + BreadcrumbList. EN_SIBLINGS grew to 9. Vercel 301 redirects in place.
- Unified `<SiteHeader>` + `<SiteFooter>` across landing, blog, content pages.
- Hero / mobile filter polish; AccountPage email pill restore.
- Docs sync (2026-05-18): new `docs/CONTENT-AUTHORING.md` GEO+SEO playbook; CLAUDE.md / AGENTS.md / docs/ARCHITECTURE.md / docs/TECH.md refreshed for the 18-route post-blog state.

## Active milestone — v2.0 Programmatic SEO — Model Pages

**Defined:** 2026-05-19
**Source:** `~/Desktop/Opten_Programmatic_SEO_Plan.md` (стратегия Влада, зафиксирована 2026-05-18)
**Goal:** Превратить 62 markdown-скилла из `C:\Projects\promptscore-proxy\skills\` в 126 публичных URL на opten.space (62 модели × RU/EN + 2 хаба `/models` / `/en/models`). Каждая модельная страница — самостоятельная статья: Quick-Facts таблица, структура промпта, типичные ошибки, примеры до/после, FAQ, три CTA в Chrome Web Store.
**Success metric:** ≥60% URL в Google Search Console «Indexed» через 7-14 дней после деплоя Phase 2; первые impressions в GSC по long-tail-запросам уровня «kling 2.6 промпт».

Detailed requirements: [REQUIREMENTS.md](REQUIREMENTS.md).

### Phases

**Phase Numbering (v2.0):** fresh-restart counter — Phase 1 + Phase 2. Не путать с v1.0 фазами в `.planning/milestones/v1.0-ROADMAP.md` (закрытыми).

- [ ] **Phase 1: Models Infrastructure** — TS-типы (`ModelMeta`/`ModelLocale`/`ModelContent`), парсер скиллов (`build-models-registry.mjs`), реестр `_registry.ts` (62 модели), React-компоненты (`ModelPage`, `ModelsHubPage`, `ModelQuickFacts`, `InlineOptenCallout`, `ModelInstallCta`, `RelatedModels`), расширение `seo-routes.ts` (`softwareApplicationModelBlock` + `buildModelRoute`), обновление `paths.ts`/`main.tsx`/`entry-server.tsx`/`sitemap.mjs`/`llms.mjs`/`SiteHeader`/`SiteFooter`/`App.tsx`. К концу фазы — 1 эталонная страница `/models/gpt-image-2` (вручную) + хаб с одной карточкой. Build зелёный.
- [ ] **Phase 2: Models Content Generation + Publication** — Spawn 7 параллельных general-purpose Claude Code агентов, каждый получает 8-9 скилл-MD + эталон + types + критерии. Каждый пишет 8-9 `<slug>.ts` файлов. Main session верифицирует 5 случайных + 2 фиксированных моделей. Build → 126 HTML. IndexNow пинг.

### Phase Details

#### Phase 1: Models Infrastructure
**Goal:** К концу фазы `npm run build` зелёный, эталонная страница `/models/gpt-image-2` рендерится с полным контентом (вручную), хаб открывается с одной карточкой.
**Status:** Ready to execute (design approved 2026-05-19).
**Depends on:** Nothing (v1.0 foundation в проде).
**Requirements:** MODELS-A-1..13
**Risks closed:** R2 (циркулярный импорт paths.ts ↔ content/models) — митигация: `MODEL_SLUGS` экспортируется отдельно от `allModels` (light import без React).
**Success Criteria:**
  1. `npm run build` зелёный.
  2. `dist/models/index.html`, `dist/en/models/index.html`, `dist/models/gpt-image-2/index.html`, `dist/en/models/gpt-image-2/index.html` существуют.
  3. `dist/sitemap.xml` ≥22 URL.
  4. `dist/llms.txt` содержит секцию `## Models` с 4 entry.
  5. Rich Results Test на `/models/gpt-image-2`: SoftwareApplication + Article + FAQPage + BreadcrumbList — без ошибок.
  6. `verify-faq-mainentity.mjs` зелёный.
  7. Visual smoke в браузере: header/footer/landing → modal ссылки работают, LangSwitcher `/models` ↔ `/en/models` работает.
**Plans:** см. [1-PLAN.md](phases/01-models-infrastructure/1-PLAN.md).

#### Phase 2: Models Content Generation + Publication
**Goal:** 62 модели заполнены качественным контентом, 126 prerendered HTML, IndexNow пингован.
**Status:** Blocked by Phase 1.
**Depends on:** Phase 1.
**Requirements:** MODELS-B-1..6
**Success Criteria:**
  1. 62 новых `.ts` файла в `src/content/models/` через 7 параллельных агентов.
  2. Main-session-верификация на 5 случайных + 2 фиксированных проходит.
  3. `npm run build` зелёный, 126 HTML в `dist/models/` + `dist/en/models/` (62 RU + 62 EN + 2 хаба).
  4. `sitemap.xml` ≥144 URL.
  5. `llms.txt` секция Models содержит все 62 модельные страницы + 2 хаба.
  6. IndexNow принят (`api.indexnow.org` 200/202).
  7. Через 7-14 дней: ≥60% URL в GSC «Indexed».
**Plans:** см. [2-PLAN.md](phases/02-models-content/2-PLAN.md).

## Out of scope for v2.0 (later milestones)

Из плана Влада — Stages 2-5, не блокируют MVP:

1. **Stage 2** — Уникальные cover-картинки для топ-15 (по данным GSC через 2-3 недели после Phase 2), ручные правки контента, внутренние ссылки из блог-постов на модели.
2. **Stage 3** — `/compare/<a>-vs-<b>` страницы (~30 пар × 2 языка = 60 новых URL).
3. **Stage 4** — SEO-полировка (Image sitemap, AVIF, Speakable, Wikipedia mentions, priceValidUntil, HTML sitemap, RSS, реальный HTTP 404, Bing-токен, h1-check).
4. **Stage 5** — `/use-cases/*`, `/troubleshoot/*`, `/skills/*` (с email-захватом).

Brand authority и scale-ready architecture (из v1.0 deferred-to-v2) остаются picking-material для v3.

---

*Roadmap created: 2026-05-14*
*v1.0 closed: 2026-05-17*
*v2.0 defined: 2026-05-19*
