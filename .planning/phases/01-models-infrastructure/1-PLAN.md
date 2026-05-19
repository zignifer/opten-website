---
tags:
  - gsd
  - phase
  - plan
kind: phase-plan
milestone: v2.0
phase: 1
phase_name: Models Infrastructure
status: in-progress
defined: 2026-05-19
---

# Phase 1 — Models Infrastructure: PLAN

13 атомарных плана (MODELS-A-1..13), сгруппированных в 5 wave-ов. Build green после каждого wave.

## Wave 1 — Schema & data layer (4 plans)

- [ ] **1-01 (MODELS-A-1):** Создать `src/content/models/types.ts`. TS-интерфейсы `ModelMeta`, `ModelLocale`, `ModelContent` по §6.3 плана Влада. Acceptance: TS компилируется при импорте из dummy-файла.
- [ ] **1-02 (MODELS-A-2):** Создать `scripts/sync-skills.mjs`. Идемпотентный копир MD-файлов из `C:/Projects/promptscore-proxy/skills/*.md` → `src/content/models/_skills/`, фильтр `_default-*.md`. Запуск ручной (не через `prebuild`). Acceptance: после прогона в `_skills/` 62 файла.
- [ ] **1-03 (MODELS-A-3):** Создать `scripts/build-models-registry.mjs`. Парсит `## Идентификация` и `## Ограничения платформы` из каждого `_skills/*.md` → пишет `src/content/models/_registry.ts`. Эвристики на нестабильные ключи таблицы (нормализация: `длина_промпта`, `длительность`, `разрешение`, `negative_prompt`). Acceptance: `_registry.ts` валиден TS, экспортирует `MODELS_REGISTRY: ModelMeta[]` длиной 62.
- [ ] **1-04 (MODELS-A-4):** Создать `src/content/models/index.ts` — barrel. Light-export `MODEL_SLUGS: string[]` (для `paths.ts`, без React/heavy импортов) и `allModels: { slug, meta, content? }[]` (для `seo-routes.ts`). Импорты контент-файлов через `import.meta.glob` (опционально + content-undefined для Phase 1). Acceptance: TS компилируется, `MODEL_SLUGS.length === 62`.

## Wave 2 — React components (6 plans, no routes yet)

- [ ] **1-05 (MODELS-A-5a):** Создать `src/app/components/ModelQuickFacts.tsx`. Таблица §4.1 плана; скрывает строку при `null`. Принимает `ModelMeta`. i18n-aware (вытягивает заголовки из `t('models.quickFacts.*')`).
- [ ] **1-06 (MODELS-A-5b):** Создать `src/app/components/InlineOptenCallout.tsx`. Variant prop `"after-features" | "after-mistakes"`, copy из i18n с параметризацией `{modelName}` и `{platform}`.
- [ ] **1-07 (MODELS-A-5c):** Создать `src/app/components/ModelInstallCta.tsx`. Финальный CTA-блок §5 плана. 3 буллета + цены ($2.99 USD / 199 ₽) + кнопка → Chrome Web Store. `LocalizedLink` для языка.
- [ ] **1-08 (MODELS-A-5d):** Создать `src/app/components/RelatedModels.tsx`. 3 карточки соседних моделей того же типа (image/video), алгоритм §12.4 плана (первые 3 не считая текущей, обратная алфавитная сортировка). Принимает `currentSlug` + `type`.
- [ ] **1-09 (MODELS-A-5e):** Создать `src/app/pages/ModelsHubPage.tsx`. Сетка карточек 62 моделей, фильтр Image/Video через query `?type=video`. Hreflang учитывается через `useLang()`.
- [ ] **1-10 (MODELS-A-5f):** Создать `src/app/pages/ModelPage.tsx`. Главный шаблон страницы. Визуал от `BlogPostPage.tsx`. Использует существующий `<FaqBlock>` (id="model-faq"). Graceful degradation если `content === undefined` (показывает только Quick-Facts + CTA, без основного контента). `useParams<{ slug }>` + `useLang()`.

## Wave 3 — Reference content (1 plan)

- [ ] **1-11 (MODELS-A-12):** Создать `src/content/models/gpt-image-2.ts`. Полный `ModelContent { ru, en }` по схеме `types.ts`. Это эталон для агентов Phase 2. Заимствует факты из `_skills/gpt-image-2.md` (если уже синкан), переводит на RU+EN. Должен пройти все критерии качества (intro 40-60 слов, faq≥6, examples=3, mistakes=5). Acceptance: TS компилируется + рендер `/models/gpt-image-2` в dev-сервере показывает полную статью.

## Wave 4 — SEO route plumbing (3 plans)

- [ ] **1-12 (MODELS-A-6):** Расширить `scripts/seo-routes.ts`. Добавить **(a)** новый export `softwareApplicationModelBlock(opts)` (см. SPEC §SoftwareApplication builder). **(b)** Функция `buildModelRoute(meta, lang)` собирает `RouteMeta` с JSON-LD-графом: ORG_BLOCK + WEBSITE_BLOCK + articleBlock (TechArticle) + softwareApplicationModelBlock + SOFTWARE_APP_BLOCK + faqPageBlock + breadcrumbBlock. **(c)** В `routes`-массив добавить 2 хаба (`/models`, `/en/models` через `collectionPageBlock`) + цикл `for (const m of allModels) if (m.content) routes.push(buildModelRoute(m, "ru"), buildModelRoute(m, "en"))`. Phase 1 фильтр пропускает только `gpt-image-2`. Acceptance: TS компилируется, `routes.length === 22` (18 baseline + 4 новых).
- [ ] **1-13 (MODELS-A-7):** Обновить `src/i18n/paths.ts`. Импорт `MODEL_SLUGS` из `content/models`. Динамически генерировать модельные пути в `EN_SIBLINGS`. В Phase 1 — только те slug'и, у которых `content !== undefined` (фильтр через `import { allModels }` или через локальный `HAS_CONTENT_SET`). Acceptance: `EN_SIBLINGS.has('/models/gpt-image-2') === true`, для остальных моделей — false.
- [ ] **1-14 (MODELS-A-9, MODELS-A-10):** Обновить `scripts/sitemap.mjs` и `scripts/llms.mjs`. Sitemap: floor 18→22, `PATH_TO_SOURCE` рефактор в функцию. Llms: floor 18→22, новая `SECTIONS`-запись Models с матчером `/^\/(en\/)?models(\/|$)/`. Acceptance: `npm run build` → `dist/sitemap.xml` содержит ≥22 URL, `dist/llms.txt` содержит секцию Models.

## Wave 5 — Navigation + routing (HIGH RISK, last) (3 plans)

- [ ] **1-15 (MODELS-A-11):** Обновить навигацию. **SiteHeader.tsx** — добавить пункт «Модели» в гамбургер. **SiteFooter.tsx** — колонка «Модели» с топ-5 (выбираем по приоритету: Midjourney 7, Sora 2, Kling 2.6, Flux Kontext, Veo 3) + кнопка «Все 62+ модели →». **App.tsx** — логотипы партнёров → `<LocalizedLink>` на `/models/<slug>` (где есть соответствие). Кнопка «Все 62+ модели →» под секцией. **ru.json, en.json** — добавить UI-копи для `models.hub.*`, `models.installCta.*`, `models.callout.*`, `models.quickFacts.*`, `header.models`, `footer.models.*`. Acceptance: smoke в браузере — header / footer ссылки работают, лендинг logo → `/models/<slug>`.
- [ ] **1-16 (MODELS-A-8):** Добавить 4 Route в `src/main.tsx` и `scripts/entry-server.tsx`. Симметрия RU/EN. **Highest-risk коммит** — трогает корень роутера. Rollback = `git revert <sha>`. Acceptance: dev-server рендерит `/models/gpt-image-2` + SSR-prerender не падает на `npm run build`.
- [ ] **1-17 (MODELS-A-13):** Финальная верификация. `npm run build` зелёный. Smoke на 4 prerendered HTML (хаб RU/EN + page RU/EN). Rich Results Test на `/models/gpt-image-2` — все 4 schema-блока валидируются. `verify-faq-mainentity.mjs` зелёный. Visual в браузере. **Этот коммит закрывает Phase 1.**

## Risks & mitigations (carried from milestone-level plan)

| # | Risk | Митигация в Phase 1 |
|---|---|---|
| R2 | Циркулярный импорт `paths.ts ↔ content/models` | D-07 — `MODEL_SLUGS` отдельный light-экспорт без React-зависимостей. Wave 1 commit 1-04 проверяет этим |
| R3 | Vercel build не найдёт `_skills/` | D-04 — коммитим `_skills/` под git. Wave 1 commit 1-02 |
| R5 | Регрессии FAQ-mainentity parity | ModelPage.tsx использует существующий `<FaqBlock>` — гарантирует DOM ↔ schema parity. Wave 2 commit 1-10 |

## Commit order summary

```
Wave 1 (Schema):        1-01 → 1-02 → 1-03 → 1-04
Wave 2 (Components):    1-05 → 1-06 → 1-07 → 1-08 → 1-09 → 1-10
Wave 3 (Reference):     1-11
Wave 4 (Routes plumbing): 1-12 → 1-13 → 1-14
Wave 5 (Navigation, HIGH RISK): 1-15 → 1-16 → 1-17
```

Build green после каждого wave.
