---
tags: [opten, blog, seo2, automation, instruction]
kind: blog-post-instruction
mode: manual-self-publish
---

# Blog Post Instruction

Веди блог opten.space вручную из основного checkout `opten-website`.
Один запуск = один пост.

Пользовательская команда `напиши SEO-статью` означает: сначала запусти
`npm run start:seo`. Legacy-алиасы `start SEO`, `start seo` и `старт SEO`
запускают тот же поток. Если команда вернула `start-seo: no-topics`,
остановись и скажи, что темы закончились и нужен новый weekly batch из
`opten-seo`. Если команда вернула `start-seo: next-topic`, работай только с
указанным `slug` и `brief`.

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
9. Перед генерацией текста или изображений запусти `npm run verify:seo2-briefs`.
   Если выбранный активный бриф не содержит `## Visual Production Brief` или
   всё ещё содержит `## Image Suggestions`, остановись. Не сочиняй визуал из
   общих hints и не редактируй article brief в рамках поста; сначала нужен
   отдельный фикс брифа/очереди.
10. Если во всех неделях все темы уже опубликованы, остановись и скажи
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
- Keyword lock — это semantic coverage, а не дословная вставка кривой поисковой
  строки. В видимом тексте, title, description, intro, FAQ и before/after нельзя
  писать raw query вроде `бизнес портрет нейросеть`, `деловой портрет нейросеть`,
  `апскейл фото нейросеть`. Склоняй и перестраивай естественно:
  `бизнес-портрет через нейросеть`, `деловой портрет в нейросети`,
  `апскейл фото через нейросеть`. Точная raw-строка допустима только в кавычках,
  если текст явно обсуждает сам поисковый запрос.
- Формулировки из брифа — suggested phrasing, не финальный текст. Можно
  humanize, но нельзя выкинуть semantic coverage.
- `body.intro`: 40-60 слов, прямой answer-block.
- FAQ: 3-5 Q&A.
- `steps`: 4-6 или `sections`: 3-6.
- `related`: можно указать 2-3 slug'а, но UI внизу статьи показывает только
  первые 2 похожие статьи.
- Минимум один named practical case: конкретная модель, первая ошибка, точное
  исправление prompt, результат.
- Видимая рубрика поста — это `category`, и она должна быть ровно одной из
  двух: `guide` или `news`. По-русски это только «Гайды» или «Новости».
  `deep-dive`, `comparison`, `release-notes` и другие значения из старых
  брифов нельзя ставить в `category`; если brief предлагает такое значение,
  нормализуй его в `guide`, кроме настоящих новостей продукта/релиза.
- `tags` остаются техническими SEO-keywords из enum в
  `src/content/blog/types.ts`; они не должны использоваться как видимые
  рубрики или фильтры.
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
темный SaaS, cinematic visual-first кадр, лаймовые линии/графические акценты,
крупный короткий текст только на внутристатейных картинках. Лаймовый акцент
фиксированный: `#9CFB51`. В промптах для обложки и внутристатейных картинок
указывать именно этот hex и не заменять его примерным `lime`, желтовато-зеленым
или более темным зеленым оттенком.

Главный visual reference для смысловой плотности: `ai-headshot-generator` и
`ai-ugc-for-brands`, сохраненные в `seo2/Reference/ai-headshot-step-*.jpg` и
`seo2/Reference/ai-ugc-step-*.jpg`. Бери оттуда не тему, а паттерн: большой
hero label + 3-4 короткие подписи/чек-пункта/карточки + иконки/линии/объекты.
Внутристатейная картинка не может быть просто фоном с одним заголовком.

Главное правило: внутристатейные картинки генерируются сразу финальными, с
текстом внутри изображения. Не делай сначала фон/фото без текста и не
накладывай текст потом через редактор, Canvas, HTML/CSS, Sharp или любой другой
постпроцессинг. Для каждой смысловой картинки сначала сгенерируй RU-версию с
русской надписью, затем EN-версию с английской надписью, сохраняя композицию,
камеру, свет, объект и цветовую схему.

Типографика: для всего видимого текста на SEO2-изображениях используй только
**Bebas Neue**. В генерации обязательно прикладывай/используй
`seo2/Reference/bebas-neue-font-reference.png` как референс шрифта и прямо
прописывай, что надпись должна быть набрана в Bebas Neue: condensed uppercase
display sans-serif, tall narrow letters, clean poster typography. Не используй
другие шрифты и не имитируй Bebas Neue постобработкой.

Нужно:

- `public/blog/<slug>/cover.jpg` — 1600x900, без текста, общий RU/EN.
- `public/blog/<slug>/ru/*.jpg` — 4-5 изображений с RU-текстом.
- `public/blog/<slug>/en/*.jpg` — 4-5 изображений с EN-текстом.
- RU/EN пары должны иметь одинаковую композицию и смысл; меняется только язык.
- Текст в RU/EN парах должен быть частью сгенерированного растра, а не слоем
  поверх него.
- Постобработка разрешена только для resize/compress/format, без добавления,
  замены или дорисовки текста.
- Не показывай Opten UI, score-индикаторы, PromptScore, sales panel или
  продающий интерфейс расширения. Opten продается в тексте, не на картинках.
- Если текст на изображении сломан, перегенерируй с более короткой надписью.

Перед генерацией каждого inline-кадра запиши себе prompt sheet:

- hero label: 1-4 слова из `Inline Frames`;
- supporting labels: 3-4 короткие подписи, до 4 слов каждая;
- visual structure: checklist, scorecard, timeline, before/after, matrix, flow,
  anatomy или decision tree;
- semantic job: какую конкретную мысль статьи картинка объясняет без абзаца.

Если в брифе есть только один крупный label без supporting labels, сначала
расширь visual prompt по этому правилу. Title-only картинки запрещены.

Исключение: рекламные course CTA banners внутри блога. Это не SEO2 inline
explainer image, а reusable баннер для курса. Делай широкий низкий растр
`public/blog/_banners/*.jpg`: слева чистая темная зона под HTML-заголовок,
описание и кнопку, справа сгенерированный Opten-style визуал. CTA-текст не
вшивать в изображение; его рендерит сайт. По умолчанию такие баннеры ведут на
`/learn/courses/ai-content-marketing-2026`, а не продают Chrome extension,
если статья не про установку/использование расширения.

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

1. Запусти `npm run verify:seo2-briefs`.
2. Запусти `npm run verify:seo2-blog -- <slug>`.
3. Запусти `npm run build`.
4. После build запусти `npm run verify:blog-seo -- <slug>`.
5. Проверь, что изображения имеют реальные размеры 1600x900.
6. Проверь, что RU/EN внутристатейные изображения уже содержат нужный текст в
   самом растре и не требуют отдельного текстового слоя.
7. Открой минимум `ru/step-1.jpg`, `ru/step-2.jpg`, `en/step-1.jpg` и
   `en/step-2.jpg` как изображения и сравни с
   `seo2/Reference/ai-headshot-step-*.jpg` / `ai-ugc-step-*.jpg`. Если кадр
   выглядит как один большой заголовок с декоративными иконками, перегенерируй:
   нужен hero label + 3-4 supporting labels/micro-cards/checkpoints.
8. Проверь, что prerendered RU/EN HTML содержит:
   - correct `lang`;
   - canonical;
   - reciprocal hreflang;
   - BlogPosting;
   - FAQPage;
   - HowTo, если используются `steps`;
   - рабочие image refs.
8. Запусти `git status --short` и отдели свои изменения от уже существующих
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
