---
tags:
  - gsd
  - requirements
kind: requirements
milestone: v2.0
milestone_name: Programmatic SEO — Model Pages
aliases:
  - v2.0 Requirements
---

# Requirements: opten-website (v2.0 — Programmatic SEO — Model Pages)

**Defined:** 2026-05-19
**Core Value:** Sell, service, and onboard extension users without breaking the shipped integration contract.
**Milestone:** Programmatic SEO — Model Pages — превратить 62 markdown-скилла из `C:\Projects\promptscore-proxy\skills\` в 126 публичных URL на opten.space (62 × RU/EN + 2 хаба).
**Phase 1 success metric:** `npm run build` зелёный + 4 новых HTML (`/models`, `/en/models`, `/models/gpt-image-2`, `/en/models/gpt-image-2`) с полной schema-разметкой.
**Phase 2 success metric:** 126 prerendered HTML, sitemap ≥144 URL, IndexNow ping принят, ≥60% URL в Google Search Console «Indexed» через 7-14 дней после деплоя.

**Source:** `~/Desktop/Opten_Programmatic_SEO_Plan.md` (стратегия зафиксирована 2026-05-18).

---

## Phase 1 — Models Infrastructure

Готовим инфраструктуру + 1 эталонную страницу (`gpt-image-2`) вручную. Build зелёный после каждого атомарного коммита.

### Sources

- Design: `.planning/phases/01-models-infrastructure/1-SPEC.md`
- Plan: `.planning/phases/01-models-infrastructure/1-PLAN.md`
- Stratregy doc: `~/Desktop/Opten_Programmatic_SEO_Plan.md`

### Models Infrastructure Requirements

- [ ] **MODELS-A-1**: Создать `src/content/models/types.ts` с TS-типами `ModelMeta`, `ModelLocale`, `ModelContent`. Schema mirror plan §6.3. Verified by импорт в Phase 1 эталонную страницу — TS компилируется.
- [ ] **MODELS-A-2**: Создать `scripts/sync-skills.mjs` — копирует MD-файлы из `C:/Projects/promptscore-proxy/skills/*.md` в `src/content/models/_skills/`, исключая `_default-*.md`. Идемпотентен. Verified by ручной прогон → 62 .md файла в директории.
- [ ] **MODELS-A-3**: Создать `scripts/build-models-registry.mjs` — парсит шапку "## Идентификация" и таблицу "## Ограничения платформы" → пишет `_registry.ts` с 62 `ModelMeta` объектами. Verified by `_registry.ts` валиден TS + длина массива = 62.
- [ ] **MODELS-A-4**: Создать `src/content/models/index.ts` — barrel экспорт `MODEL_SLUGS: string[]` (light-import без React) + `allModels: { slug, meta, content? }[]` (heavy import, для seo-routes). Verified by `paths.ts` импортирует только `MODEL_SLUGS` без циркулярных зависимостей.
- [ ] **MODELS-A-5**: Создать React компоненты: `ModelPage.tsx`, `ModelsHubPage.tsx`, `ModelQuickFacts.tsx`, `InlineOptenCallout.tsx`, `ModelInstallCta.tsx`, `RelatedModels.tsx`. Visual heritage от `BlogPostPage.tsx`. Verified by smoke-тест в браузере на `/models/gpt-image-2`.
- [ ] **MODELS-A-6**: Расширить `scripts/seo-routes.ts` — новый export `softwareApplicationModelBlock(opts)` + `buildModelRoute(meta, lang)`. В Phase 1 цикл фильтрует `if (m.content)`. Verified by `dist/models/gpt-image-2/index.html` содержит SoftwareApplication + Article + FAQPage JSON-LD.
- [ ] **MODELS-A-7**: Обновить `src/i18n/paths.ts` — `EN_SIBLINGS` динамически генерируется из `MODEL_SLUGS` + `/models` хаб. Verified by `applyHreflang` ставит корректный `/en/models/gpt-image-2` ↔ `/models/gpt-image-2`.
- [ ] **MODELS-A-8**: Добавить 4 Route в `src/main.tsx` и `scripts/entry-server.tsx` — `/models`, `/models/:slug`, `/en/models`, `/en/models/:slug`. **highest-risk, последний коммит wave 5.** Verified by SSR-render не падает + клиент монтируется без re-render.
- [ ] **MODELS-A-9**: Обновить `scripts/sitemap.mjs` — floor 18→22, `PATH_TO_SOURCE` как функция (`if (route.path.startsWith('/models/')) return 'src/content/models/'+slug+'.ts'`). Verified by `dist/sitemap.xml` ≥22 URL.
- [ ] **MODELS-A-10**: Обновить `scripts/llms.mjs` — floor 18→22, новая `SECTIONS` запись `Models`. Verified by `dist/llms.txt` содержит секцию `## Models` с 4 entry.
- [ ] **MODELS-A-11**: Обновить навигацию — `SiteHeader.tsx` (пункт «Модели»), `SiteFooter.tsx` (колонка «Модели» с топ-5), `App.tsx` (логотипы партнёров → LocalizedLink на `/models/<slug>`). Verified by smoke-тест: header/footer ссылки работают, лендинг → модель работает.
- [ ] **MODELS-A-12**: Написать вручную эталонный `src/content/models/gpt-image-2.ts` с полным `ModelContent { ru, en }` по структуре `types.ts`. Это образец для агентов Phase 2. Verified by рендер `/models/gpt-image-2` показывает полную статью, не stub.
- [ ] **MODELS-A-13**: `npm run build` зелёный. `verify-faq-mainentity.mjs` зелёный. Rich Results Test на `/models/gpt-image-2` валидирует все schema-блоки. Visual smoke в браузере. **Highest-risk финальная проверка — после всех 12 предыдущих.**

---

## Phase 2 — Models Content Generation + Publication

Spawn 7 параллельных Claude Code агентов → 62 контент-файла → 126 prerendered HTML → IndexNow.

### Sources

- Design: `.planning/phases/02-models-content/2-SPEC.md`
- Plan: `.planning/phases/02-models-content/2-PLAN.md`

### Content Requirements

- [ ] **MODELS-B-1**: 7 spawned агентов написали 62 `<slug>.ts` файла в `src/content/models/`. Каждый файл экспортирует `meta: ModelMeta` + `content: ModelContent`. Verified by `git status` показывает 62 новых файла.
- [ ] **MODELS-B-2**: Качество — каждый файл проходит main-session-верификацию: intro 40-60 слов, faq.length≥6, examples.length===3, RU/EN parity, EN без русских символов, title ≤60, description 150-160. Verified by автоматический скрипт-чекер на 5 случайных + 2 фиксированных моделях.
- [ ] **MODELS-B-3**: Снять фильтр `if (m.content)` в `seo-routes.ts` loop. Обновить floor в sitemap.mjs/llms.mjs до 144. Verified by `npm run build` → 126 HTML в `dist/models/` + `dist/en/models/`.
- [ ] **MODELS-B-4**: Атомарный коммит-батч 62 контент-файлов (по 9 файлов = 7 коммитов, не монолит). Push в `main`. Verified by Vercel автодеплой зелёный, prod URL `/models/<slug>` отдаёт 200 на 5 случайных моделях.
- [ ] **MODELS-B-5**: IndexNow ping всех 126 URL через `scripts/indexnow.mjs`. Verified by `api.indexnow.org` returns 200/202.
- [ ] **MODELS-B-6**: Через 7-14 дней — ≥60% URL в Google Search Console «Indexed» по запросу `site:opten.space/models/`. Verified by GSC «Coverage» отчёт.

---

## Out of scope (deferred to v2.1 or later)

- **Уникальные cover-картинки для топ-15** — Stage 2 из плана Влада. На MVP — общий `DEFAULT_OG_IMAGE`.
- **`/compare/<a>-vs-<b>` страницы** — Stage 3 (~60 новых URL).
- **SEO-полировка** — Image sitemap, AVIF pipeline, Speakable schema, Wikipedia mentions, priceValidUntil, HTML sitemap, RSS, реальный HTTP 404, Bing-токен, build-time h1-check (Stage 4).
- **`/use-cases/*`, `/troubleshoot/*`, `/skills/*`** — Stage 5, требуют новой стратегии (с email-захватом для skills).
- **Email-формы, PDF-генерация, отдача skill-файлов, demo-блоки, sticky CTA, exit-intent, UTM** — заблокировано в плане Влада §13.
- **Ручной контент на 62 модели** — генерируем через агентов на MVP, ручные правки только для топ-15 в Stage 2 по данным GSC.

---

## Traceability

| ID | Phase | Status |
|---|---|---|
| MODELS-A-1 | Phase 1 | Pending |
| MODELS-A-2 | Phase 1 | Pending |
| MODELS-A-3 | Phase 1 | Pending |
| MODELS-A-4 | Phase 1 | Pending |
| MODELS-A-5 | Phase 1 | Pending |
| MODELS-A-6 | Phase 1 | Pending |
| MODELS-A-7 | Phase 1 | Pending |
| MODELS-A-8 | Phase 1 | Pending |
| MODELS-A-9 | Phase 1 | Pending |
| MODELS-A-10 | Phase 1 | Pending |
| MODELS-A-11 | Phase 1 | Pending |
| MODELS-A-12 | Phase 1 | Pending |
| MODELS-A-13 | Phase 1 | Pending |
| MODELS-B-1 | Phase 2 | Pending |
| MODELS-B-2 | Phase 2 | Pending |
| MODELS-B-3 | Phase 2 | Pending |
| MODELS-B-4 | Phase 2 | Pending |
| MODELS-B-5 | Phase 2 | Pending |
| MODELS-B-6 | Phase 2 | Pending |
