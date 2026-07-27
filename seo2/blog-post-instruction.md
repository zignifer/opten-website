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
- Русская версия пишется по-русски. В обычном тексте используй `запрос`,
  `промпт`, `техническое задание`, `рабочий процесс`, `черновик`, `проверка`,
  а не латинские `prompt`, `brief`, `workflow`, `draft`, `review`, `deck`,
  `preflight`, `visual brief` или `production prompt`. Английское написание
  оставляй только в официальных названиях брендов, моделей, режимов, команд,
  синтаксиса и дословных примерах, которые действительно нельзя перевести.
  Если термин режима нужен для поиска, сначала объясни его по-русски:
  `image-to-video — видео из изображения`.
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

Главное стилевое правило — `Opten cinematic optical editorial`: low-key
постановочная сцена, скульптурная studio diorama или polished product-film
still с foreground / hero midground / atmospheric background. Один сильный
объект, действие или визуальная метафора несет смысл; крупный текст и
`#9CFB51` optical signal помогают прочитать сцену. Это может быть
фотореалистичный CGI-гибрид. Не своди `practical set` к буквальному столу,
бумагам и рукам.

Quality north star подробно зафиксирован в `seo2/rules/image-style.md`. Для
первого RU style-anchor кадра обязательно выбери 1-2 изображения из
`public/blog/ai-video-for-work/ru/step-*.jpg` и передай их как **style/quality
reference only** вместе с font reference. Запрети копировать subject, камеры,
пленку, линзы, layout, angle и composition. После утверждения первого кадра
используй уже его как style anchor остальных кадров; north-star JPG повторно не
прикладывай.

Negative reference — `public/blog/ai-freelance-services/ru/step-*.jpg`. Это
нормальная серия, но не нужный стиль: literal freelance desk, scrapbook,
papers-on-table, руки и печатные плашки заменили сценическую глубину и
оптический сигнал. Новая серия, похожая на нее, не проходит release gate.

Лаймовый акцент фиксированный: `#9CFB51`. В промптах для обложки и
внутристатейных картинок указывать именно этот hex и не заменять его примерным
`lime`, желтовато-зеленым или более темным зеленым оттенком.

Старые блоговые серии можно открыть вручную только как **банк
композиционных идей**: split-screen, moodboard, timeline, крупный объект,
before/after, одна сцена с callout, последовательность кадров. Не прикладывай
старые JPG к генератору как style/font reference: в них устаревшая типографика,
которая начинает протекать в новые изображения. Для шрифта прикладывай только
`seo2/Reference/bebas-neue-font-reference.png`.

### Сначала система статьи, потом отдельные кадры

До первой генерации создай `seo2/visual-plans/<slug>.md`. Это production sheet,
а не новый article brief. Для новой активной темы добавь во frontmatter
`visual_style_gate: cinematic-optical-v2`. В art-direction блоке используй
следующие точные машинно-проверяемые строки:

- `North-star style input: public/blog/ai-video-for-work/ru/step-N.jpg` — можно
  перечислить максимум два файла;
- `Flat-lay frames: 0` или `1`;
- `Document-dominant frames: 0` или `1`;
- `Hand-dominant frames: 0` или `1`;
- `Strong-depth frames: 3` или больше;
- `Optical-signal frames: 3` или больше;
- `Hero-label-on-document frames: 0` или `1`;
- `Negative-reference check: ...` — чем серия отличается от
  `public/blog/ai-freelance-services/ru/step-*.jpg`.

Кроме этих gate-полей зафиксируй:

- одну art direction на всю статью: medium/materials, фон, свет, grain,
  палитру, плоскую обработку текста, толщину линий и повторяющийся motif;
- article-native practical set: какой физический мир, герой, действие и
  фактура выражают именно эту тему без универсальных бумажных макетов,
  подвесных карточек, acrylic UI modules или conveyor rigs;
- style-only north-star input: какие 1-2 `ai-video-for-work/ru/step-*.jpg`
  будут приложены только к первому RU кадру и какая композиция им прямо
  запрещена к копированию;
- photo-first hierarchy: как каждый кадр остается убедительной
  кинематографичной сценой до чтения текста и почему графика остается
  вторичной;
- depth staging: foreground / hero midground / atmospheric background каждого
  кадра;
- flat-lay budget: максимум один top-down/high-oblique desk frame на серию;
- document/hand budget: документы или руки могут быть главным героем максимум
  одного кадра;
- lime signal: как `#9CFB51` живет в пространстве каждого кадра как optical
  path/ribbon/beam/contour с light spill, а не просто плоская стрелка или бирка;
- отдельный story beat и visual proof для каждого кадра;
- text mode каждого кадра;
- минимум три разных composition archetype на четыре inline-кадра;
- не более одного кадра в форме grid/checklist/card matrix;
- style continuity: какие признаки должны остаться одинаковыми при смене
  композиции.

Первый RU inline-кадр — style anchor серии. Генерируй его с 1-2 north-star
style-only references и Bebas Neue reference. Сравни его с north star и
negative reference: если он похож на editorial desk/scrapbook, не продолжай.
После утверждения передавай его следующим кадрам только как reference для
medium, color grading, optical signal, типографики, материалов и света. Прямо
запрещай копировать его layout, камеру и объектную композицию. EN-пару делай
localization-edit утвержденного RU-кадра.

Единый стиль не означает один шаблон. В одной статье нельзя четыре раза
повторять «большой заголовок + ряд карточек» или менять визуальный язык между
кадрами: например, плоский текст в одном и объемные 3D-буквы в другом.
Типографика должна иметь одну и ту же физику во всей серии. По умолчанию текст
плоский, напечатанный/интегрированный в кадр; extruded, embossed и отдельные
3D-буквы запрещены.

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

- story beat: какую мысль шага читатель должен понять;
- visual proof: какой объект, контраст, действие или результат показывает эту
  мысль без текста;
- cinematic proof: почему кадр выглядит как снятая practical-set сцена с
  объемом, светом и фактурой, а не как 3D-инфографика или презентационный
  слайд;
- depth staging: что находится в foreground, hero midground и atmospheric
  background;
- optical signal: как `#9CFB51` проходит через пространство и дает light spill;
- composition archetype: split-screen, sequence, hero visual, before/after,
  moodboard, anatomy, timeline, decision point и так далее;
- text mode:
  - `headline-only` — один короткий заголовок, если визуал сам доказывает мысль;
  - `contrast-pair` — две связанные фразы вроде «общие слова / одна ситуация»;
  - `sequence` — 2-4 подписи, которые образуют причинную цепочку;
  - `annotated-explainer` — только если подписи действительно раскрывают
    разные части одного объекта;
- style continuity: что наследуется от style anchor;
- semantic job: почему этот кадр нельзя заменить декоративным фоном.

Supporting labels не являются квотой. Допустимо 0-4 коротких подписи. Нельзя
добавлять существительные только ради заполнения карточек. Каждая подпись должна
быть связана с соседней через контраст, причинность, последовательность или
части одного конкретного объекта. Кадр с одним заголовком допустим и
предпочтителен, если сильная фотографическая сцена уже объясняет мысль.

Во многих уже подготовленных briefs осталась шаблонная строка `3-4 supporting
labels` и общий запрет на `title-only`. Она не должна возвращать серию к
карточкам и инфографике. Для production plan и генерации применяй актуальное
правило `seo2/rules/image-style.md`: 0-4 подписей по смыслу, headline-only
разрешен при сильном visual proof.

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
- `seo2/visual-plans/<slug>.md`
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
7. Открой все RU inline-кадры рядом и проверь серию:
   - одна art direction, один способ рендеринга Bebas Neue, одинаковые palette,
     line language, light/grain;
   - cinematic scene first: один сильный герой, действие или результат
     читается раньше графического слоя;
   - кадры выглядят как Opten cinematic optical editorial, а не как editorial
     desk, scrapbook, papers-on-table, dashboard или презентационный слайд;
   - линии, стрелки и подписи помогают прочитать сцену, но не становятся
     визуально сильнее объекта;
   - предметный мир относится к теме статьи и не повторяет без причины бумажные
     макеты, acrylic UI modules, подвесные карточки, conveyor rigs или конкретные
     мотивы `ai-video-for-work`;
   - минимум три кадра имеют foreground / hero midground / atmospheric
     background и не сняты сверху;
   - максимум один кадр является desk flat lay или делает документы/руки главным
     визуальным языком;
   - минимум три кадра используют `#9CFB51` как optical path/ribbon/beam/contour
     с light spill, а не только как плоский текст, стрелку, билет или плашку;
   - hero label напечатан на физическом листе/карточке/папке максимум в одном
     кадре;
   - серия визуально ближе к `ai-video-for-work`, чем к negative reference
     `ai-freelance-services`;
   - минимум три разных composition archetype;
   - не больше одного grid/checklist/card-matrix кадра;
   - нет disconnected noun labels «слова ради слов»;
   - каждый visual proof объясняет конкретный тезис соседнего шага;
   - плоская типографика не превращается в 3D/embossed буквы от кадра к кадру.
   Затем открой все EN-пары и проверь, что меняется только язык, а не идея,
   камера или композиция.
   Если любой пункт hard release gate из `seo2/rules/image-style.md` нарушен,
   не запускай build и не коммить: перегенерируй RU-кадры, затем их EN-пары.
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
   `src/content/blog/<slug>.ts`, `seo2/visual-plans/<slug>.md`, связанные
   registry/config файлы, sitemap/llms изменения, `public/blog/<slug>/**` и
   `_batch.md` недели, где обновлен status.
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
