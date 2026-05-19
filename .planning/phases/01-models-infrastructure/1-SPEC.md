---
tags:
  - gsd
  - phase
  - spec
kind: phase-spec
milestone: v2.0
phase: 1
phase_name: Models Infrastructure
status: in-progress
defined: 2026-05-19
---

# Phase 1 — Models Infrastructure: SPEC

## Goal

К концу фазы `npm run build` зелёный, эталонная страница `/models/gpt-image-2` и `/en/models/gpt-image-2` рендерится с полным контентом (написанным вручную как образец для агентов Phase 2). `/models` и `/en/models` открываются с одной карточкой. Sitemap.xml + llms.txt содержат 4 новых URL.

## Context

Стратегия — `~/Desktop/Opten_Programmatic_SEO_Plan.md` (план Влада, 2026-05-18).

В `C:\Projects\promptscore-proxy\skills\` лежат **64 markdown-файла**: 62 модели (24 image + 38 video) + 2 fallback (`_default-image.md`, `_default-video.md` — исключаем). Скиллы — экспертные базы знаний под каждую AI-модель (Midjourney, Sora, Kling, Veo, Flux и т.д.), компилированы из официальных гайдов fal.ai, OpenAI Cookbook, veed.io.

Цель v2.0 — превратить их в **126 публичных URL** (62 × RU/EN + 2 хаба). Phase 1 готовит инфраструктуру, Phase 2 заполняет контент.

## Approach

**Generator pattern:** один шаблон React-страницы (`ModelPage.tsx`) + один источник данных (`_registry.ts`, генерируется из MD-шапок) → автоматическая генерация 126 prerendered HTML на build-time. Никаких runtime fetch, БД, или generators во время билда — всё статика.

**Visual heritage:** `ModelPage.tsx` наследует визуальный язык от `BlogPostPage.tsx` (одна семья), но это отдельный компонент — семантика разная (`TechArticle` + `SoftwareApplication`, не `BlogPosting`).

**Content storage:** `src/content/models/*.ts` — TS-файлы с `{ ru, en }` экспортом, паттерн от `src/content/blog/`. В Phase 1 — только эталонный `gpt-image-2.ts` (вручную). В Phase 2 — все 62 файла через агентов.

## Locked design decisions (D-N)

- **D-01: Slug locale-neutral.** `/models/kling-2.6` и `/en/models/kling-2.6` имеют одинаковый slug (правило CLAUDE.md §Content & SEO #7).
- **D-02: Версионные варианты — отдельные страницы.** `kling`, `kling-2.6`, `kling-3` — три разных URL. Каждый таргетит свой long-tail-запрос.
- **D-03: 62 модели, не 63.** План Влада говорит 63 (старая цифра); реально в `promptscore-proxy/skills/` 64 файла - 2 fallback = 62. Зафиксировано.
- **D-04: `_skills/` под git.** Vercel-build не имеет доступа к локальному proxy-репо. Коммитим 62 MD-файла как source of truth.
- **D-05: Phase 1 фильтр `if (m.content)`.** В Phase 1 в `routes`-массив попадает только модель с реальным контентом (= 1 модель: `gpt-image-2`). Это даёт 4 новых URL в Phase 1 (хаб RU/EN + 1 модель RU/EN), не 126. Phase 2 снимает фильтр.
- **D-06: Floor counts инкрементальный.** Sitemap и llms floor 18→22 в Phase 1, 22→144 в Phase 2. Защита от регрессий по мере роста.
- **D-07: `MODEL_SLUGS` отдельный от `allModels`.** `content/models/index.ts` экспортирует `MODEL_SLUGS: string[]` (light, без React-импортов) для `paths.ts`, и `allModels` (heavy) для `seo-routes.ts`. Предотвращает циркулярные импорты.
- **D-08: Без email-захвата / PDF / skill-отдачи на MVP.** Три CTA — все прямые ссылки на Chrome Web Store. План Влада §13.
- **D-09: Без уникальных cover-картинок на MVP.** Используем `DEFAULT_OG_IMAGE` / `DEFAULT_OG_IMAGE_EN`. Уникальные — Stage 2.

## Hard constraints

1. **Integration contract сохранён.** Локированные routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`), `EXTENSION_IDS`, `SUPABASE_URL`/`SUPABASE_ANON_KEY` — не трогаем (docs/INTEGRATION-CONTRACT.md).
2. **Не меняем prerender/sitemap/llms/indexnow/faq-verify pipeline.** Только параметры (floor counts) и `PATH_TO_SOURCE`.
3. **Build green после каждого атомарного коммита.** Атомарность через wave-grouping (W1..W5).
4. **`<FaqBlock>` реюзаем без изменений.** Гарантирует FAQ-mainentity DOM ↔ schema parity для всех 62 моделей.

## Success criteria (acceptance)

1. `npm run build` зелёный.
2. `dist/models/index.html`, `dist/en/models/index.html`, `dist/models/gpt-image-2/index.html`, `dist/en/models/gpt-image-2/index.html` существуют.
3. `dist/sitemap.xml` содержит ≥22 URL.
4. `dist/llms.txt` содержит секцию `## Models` с 4 entry.
5. Rich Results Test на `/models/gpt-image-2`: SoftwareApplication + Article + FAQPage + BreadcrumbList валидируются.
6. `verify-faq-mainentity.mjs` зелёный.
7. Visual smoke: header/footer/landing → /models/gpt-image-2 ссылки работают, LangSwitcher `/models` ↔ `/en/models` работает.

## Out of scope

- **62 контент-файла** — Phase 2.
- **Уникальные cover-картинки** — Stage 2 (v2.1).
- **`/compare/<a>-vs-<b>`** — Stage 3 (v2.1).
- **SEO-полировка** — Stage 4 (v2.2).
- **Email-захват, PDF, skill-файлы** — заблокировано.
