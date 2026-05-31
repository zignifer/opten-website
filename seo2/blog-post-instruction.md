---
tags: [opten, blog, seo2, automation, instruction]
kind: blog-post-instruction
mode: manual-self-publish
---

# Blog Post Instruction

Веди блог opten.space вручную из основного checkout `opten-website`.
Один запуск = один пост.

Это новая ручная версия прежней Daily Opten blog post automation. Здесь нет
cron, publisher, mark-ready и workspace-копий. Работай прямо в этом
репозитории. После успешной проверки сам сделай scoped git add/commit/push.

## Важно

- Git разрешен только в конце успешного запуска: `git status`, scoped
  `git add`, `git commit`, `git push`.
- Не запускай `git pull`, `git fetch`, `gh`, не создавай PR.
- Не создавай ветки и PR.
- Не трогай старую папку `seo/`.
- Не заходи в `opten-seo` во время написания поста: все нужное лежит в `seo2/`.
- Один пост за запуск.
- Если пользователь попросил только подготовить/настроить автоматизацию, не
  создавай пост.

## Где лежат входные данные

- Очереди недель: `seo2/briefs/YYYY-Www/_batch.md`
- Отдельные брифы: `seo2/briefs/YYYY-Www/NN-slug.md`
- SEO/GEO правила: `seo2/rules/blog-post-seo-rules.md`
- Humanizer RU: `seo2/rules/humanizer-ru.md`
- Humanizer EN: `seo2/rules/humanizer-en.md`
- Референсы изображений: `seo2/Reference/`
- Эталон формы поста: `src/content/blog/gpt-image-2.ts`
- Опубликованные slug'и: `src/content/blog/index.ts`

## 1. Выбор темы

1. Найди все недельные папки `seo2/briefs/YYYY-Www/`, где есть `_batch.md`.
2. Отсортируй недели по имени от старой к новой: `2026-W23`, `2026-W24`,
   `2026-W25` и так далее.
3. Проверь `src/content/blog/index.ts`.
4. Иди по неделям в этом порядке. Внутри первой недели, где есть открытые темы,
   бери первый `pending` slug из `_batch.md`, которого еще нет в
   `blogPostsBySlug`.
5. Если в этой неделе нет `pending`, но есть `deferred`, бери первый
   `deferred` slug, которого еще нет в `blogPostsBySlug`.
6. `published` темы пропускай.
7. Не перепрыгивай на новую неделю, пока в более старой неделе есть `pending`
   или `deferred` slug, которого еще нет в `blogPostsBySlug`.
8. Открой соответствующий `seo2/briefs/YYYY-Www/NN-slug.md` и работай строго по
   нему.
9. Если во всех неделях все темы уже опубликованы, остановись и скажи
   `no-topics`.

Не выбирай тему из старого `seo/blog-automation.md`. Новый источник тем — только
`seo2/briefs/**`.

Если пользователь вручную не запускал публикации несколько дней или недель,
старые `pending` темы остаются в очереди. Их нельзя считать пропущенными только
потому, что появилась новая недельная папка.

Если пользователь прямо просит не брать конкретную тему сейчас, можно заменить
ее статус с `pending` на `deferred` и выбрать следующую `pending` тему той же
недели. `deferred` — это не пропуск навсегда: такие темы добираются до перехода
на следующую неделю.

## 2. Контент

Прочитай перед написанием:

1. выбранный article brief;
2. `seo2/rules/blog-post-seo-rules.md`;
3. `seo2/rules/humanizer-ru.md`;
4. `seo2/rules/humanizer-en.md`;
5. `src/content/blog/types.ts`;
6. один живой пост-референс, обычно `src/content/blog/gpt-image-2.ts`.

Требования:

- Пост двуязычный: `{ ru, en }`, один общий `slug`.
- RU и EN пишутся отдельно, не машинным переводом.
- Сохрани keyword lock из брифа:
  - primary keyword в title/H1-zone и intro;
  - primary + 1 secondary в excerpt/description;
  - secondary phrases в H2/body/FAQ/image alt;
  - query-like FAQ остаются вопросами.
- Формулировки из брифа — suggested phrasing, не финальный текст. Можно
  humanize, но нельзя выкинуть semantic coverage.
- `body.intro`: 40-60 слов, прямой answer-block.
- FAQ: 3-5 Q&A.
- `steps`: 4-6 или `sections`: 3-6.
- Минимум один named practical case: конкретная модель, первая ошибка, точное
  исправление prompt, результат.
- Категории и теги только из enum в `src/content/blog/types.ts`.
- Актуальные модели сверяй read-only с `src/content/models/slugs.ts`,
  `_registry.ts`, `_summaries.ts`.
- Не редактируй model-файлы (`src/content/models/**`) для блог-поста.

## 3. Humanizer

После черновика сделай отдельный редакторский проход:

- RU по `seo2/rules/humanizer-ru.md`
- EN по `seo2/rules/humanizer-en.md`

Humanizer не должен вырезать ключи. Он убирает ИИ-ритм, штампы и стерильность,
но сохраняет keyword lock из брифа.

## 4. Изображения

Движок — встроенный генератор изображений Codex.

Референсы: `seo2/Reference/`. Новые изображения должны быть в этом духе:
темный SaaS, cinematic visual-first кадр, лаймовые линии/оверлеи, крупный
короткий текст только на внутристатейных картинках.

Нужно:

- `public/blog/<slug>/cover.jpg` — 1600x900, без текста, общий RU/EN.
- `public/blog/<slug>/ru/*.jpg` — 4-5 изображений с RU-текстом.
- `public/blog/<slug>/en/*.jpg` — 4-5 изображений с EN-текстом.
- RU/EN пары должны иметь одинаковую композицию и смысл; меняется только язык.
- Не показывай Opten UI, score-индикаторы, PromptScore, sales panel или
  продающий интерфейс расширения. Opten продается в тексте, не на картинках.
- Если текст на изображении сломан, перегенерируй с более короткой надписью.

## 5. Интеграция поста

Один пост обычно трогает:

- `src/content/blog/<slug>.ts`
- `src/content/blog/index.ts`
- `scripts/seo-routes.ts`
- `src/i18n/paths.ts`
- `scripts/sitemap.mjs`
- `scripts/llms.mjs`
- `public/blog/<slug>/cover.jpg`
- `public/blog/<slug>/ru/*.jpg`
- `public/blog/<slug>/en/*.jpg`

Проверь, что `scripts/seo-routes.ts` добавляет:

- `/blog/<slug>`
- `/en/blog/<slug>`
- itemListBlock обоих хабов `/blog` и `/en/blog`

## 6. Проверка

Перед коммитом:

1. Запусти `npm run build`.
2. Проверь, что build прошел.
3. Проверь, что изображения имеют реальные размеры 1600x900.
4. Проверь, что prerendered RU/EN HTML содержит:
   - correct `lang`;
   - canonical;
   - reciprocal hreflang;
   - BlogPosting;
   - FAQPage;
   - HowTo, если используются `steps`;
   - рабочие image refs.
5. Запусти `git status --short` и отдели свои изменения от уже существующих
   пользовательских изменений.

## 7. Git publish

Если build и проверки прошли:

1. Обнови строку опубликованной темы в ее `_batch.md`: замени `pending` или
   `deferred` на `published` в колонке `status`.
2. Добавь только файлы, созданные или измененные в рамках текущего поста:
   `src/content/blog/<slug>.ts`, связанные registry/config файлы, sitemap/llms
   изменения, `public/blog/<slug>/**` и `_batch.md` недели, где обновлен status.
3. Не добавляй чужие pending changes вроде `.mcp.json`, `.DS_Store`, старые
   папки `seo-new/` или любые файлы, которые не относятся к текущему посту.
4. Сделай коммит:
   `git commit -m "Add blog post: <slug>"`
5. Сделай push текущей ветки:
   `git push`
6. В финальном ответе покажи commit hash, pushed branch, URL/slug поста и
   короткий список измененных файлов.

Если build или SEO-проверка не прошли, не коммить и не пушь. Исправь проблему
и повтори проверку.

## 8. Чего НЕ делать

- Не запускать publisher.
- Не создавать workspace в `.codex/automations`.
- Не редактировать отдельные article briefs в `seo2/briefs/**/NN-slug.md` как
  часть поста. Разрешено менять только `status` выбранной темы в `_batch.md`
  после успешной проверки.
- Не редактировать старую папку `seo/`.
- Не публиковать два поста за один запуск.
