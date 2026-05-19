---
tags:
  - gsd
  - phase
  - spec
kind: phase-spec
milestone: v2.0
phase: 2
phase_name: Models Content Generation + Publication
status: blocked-by-phase-1
defined: 2026-05-19
---

# Phase 2 — Models Content: SPEC

## Goal

62 модели заполнены качественным контентом через 7 параллельных Claude Code агентов, 126 prerendered HTML в `dist/`, IndexNow пингован, в Google индексе через 7-14 дней.

## Context

Phase 1 подготовила инфраструктуру: `ModelPage.tsx` шаблон, `_registry.ts` с 62 `ModelMeta`, эталонный `gpt-image-2.ts` написанный вручную. Сейчас не хватает 61 контент-файла (62 - 1 эталонный).

**Подход:** запустить 7 параллельных general-purpose Claude Code агентов через Agent tool. Каждый получает 8-9 скилл-MD + types + эталон + критерии. Каждый пишет 8-9 `<slug>.ts` файлов. Main session верифицирует, корректирует, коммитит атомарно.

**Стоимость:** $0 (внутри Claude Code подписки, без внешнего API).
**Время:** ~15-20 минут на 62 файла в параллели.

## Approach

### Промпт-шаблон для агента

Каждому из 7 spawned агентов передаётся:

**Inputs:**
- Список 8-9 путей `src/content/models/_skills/<slug>.md`
- Эталон `src/content/models/gpt-image-2.ts`
- TS-схема `src/content/models/types.ts`
- `src/content/models/_registry.ts` (meta для каждой модели агента)

**Output spec:** `src/content/models/<slug>.ts` с экспортами `meta` и `content`.

**Критерии качества:**
- `intro`: 40-60 слов на каждом языке, начинается с определения модели (например: «Kling 2.6 Pro — модель генерации видео из текста и изображений от Kuaishou...»)
- `sections`: 4-5 блоков, 100-200 слов каждый, факты ТОЛЬКО из MD-скилла
- `examples`: 3 примера «до/после» в формате `{ before, after, note? }`
- `mistakes`: 5 типичных ошибок в формате `{ title, explain }`
- `faq`: ≥6 Q-A пар, ответ ≥30 слов
- `title` ≤60 chars, `description` 150-160 chars
- EN — нативный английский, не калька. Бренды не переводятся («Midjourney 7» так и остаётся).

**Hard constraints:**
- Запрет на галлюцинации (только факты из MD-скилла).
- Не выдумывать параметры модели.
- Если данных нет — пропустить, не сочинять.
- meta-объект использует данные из `_registry.ts` (агент не пересчитывает meta — только пишет content).

### Разделение работы (62 / 7)

Sorted alphabetically в `_registry.ts`:

| Agent | Models (slugs) | Count |
|---|---|---|
| #1 | 1-9 | 9 |
| #2 | 10-18 | 9 |
| #3 | 19-27 | 9 |
| #4 | 28-36 | 9 |
| #5 | 37-45 | 9 |
| #6 | 46-54 | 9 |
| #7 | 55-62 | 8 |

Точный список slug'ов для каждого агента будет в `2-PLAN.md`.

### Main-session-верификация

После завершения 7 агентов:

1. `git status` → 61 новый `.ts` файл (62 - 1 эталонный уже есть).
2. Main session читает **5 случайных + 2 фиксированных** (`midjourney-7` как сложная image-модель, `kling-3` как сложная video-модель).
3. Чеки на каждом файле (программный):
   - `meta.slug` совпадает с filename
   - intro слов 40-60
   - `faq.length >= 6`
   - `examples.length === 3`
   - `mistakes.length === 5`
   - RU/EN parity (одинаковое число sections/examples/faq)
   - EN не содержит русских символов: `/[а-яА-Я]/.test(en_locale_concatenated)` → false
   - title ≤60, description 150-160
4. Если ≥2 систематические ошибки в выборке — корректировка промпта + регенерация только проблемных через 1 нового агента.

### Финальная последовательность

1. **Финальный билд:** снять фильтр `if (m.content)` в `seo-routes.ts` loop. Поднять floor в sitemap.mjs/llms.mjs до 144.
2. **Build verification:** `npm run build` → 126 HTML в `dist/models/` + `dist/en/models/`.
3. **Smoke:** open 5 случайных модельных HTML в браузере.
4. **Atomic commits:** 7 batch-коммитов (по 8-9 файлов), не монолит.
5. **Push:** Vercel auto-deploys.
6. **IndexNow:** `node scripts/indexnow.mjs` пингует все 126 URL.
7. **GSC:** sitemap submitted (если ещё не).

## Locked design decisions

- **D-10: Без внешнего API.** Никаких Claude Haiku через proxy, никаких ключей. Только Claude Code Agent tool.
- **D-11: meta уже зафиксирован в `_registry.ts`.** Агенты не переписывают `meta` — только `content`. Это предотвращает drift между парсером и агентами.
- **D-12: Атомарные batch-коммиты, не monolith.** Code review на 62 файла в одном diff нечитаем. 7 коммитов по 8-9 моделей с зелёным build после каждого.
- **D-13: Запрет на регенерацию при ≥1 ошибке.** Регенерация запускается ТОЛЬКО при ≥2 систематических ошибках. Точечные правки — main session вручную в 1 файле.

## Hard constraints

1. **Integration contract сохранён** (без изменений с Phase 1).
2. **`<FaqBlock>` parity сохранён** — агенты пишут только `faq[]` данные, верстку не трогают.
3. **Build green перед push** — нет broken commits в `main`.

## Success criteria (acceptance)

1. `npm run build` зелёный, 126 HTML в `dist/models/` + `dist/en/models/` (62 RU + 62 EN + 2 хаба).
2. `dist/sitemap.xml` ≥144 URL.
3. `dist/llms.txt` секция Models содержит все 62 модельные страницы + 2 хаба.
4. Rich Results Test на 5 случайных моделях — без ошибок.
5. IndexNow принят (`api.indexnow.org` 200/202).
6. Через 7-14 дней: ≥60% URL в GSC «Indexed».

## Out of scope

- **Ручная правка контента топ-15** — Stage 2 (v2.1).
- **`/compare/*`, SEO-полировка, /use-cases/*** — следующие milestone-ы.
