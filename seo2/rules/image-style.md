---
tags: [opten, blog, images, seo2]
kind: image-style
---

# Blog Image Style

Эти правила применяются к обложке и внутристатейным изображениям.

Ключевое правило для внутристатейных картинок: генерируй финальную фотографию
сразу с нужной надписью внутри изображения. Не создавай чистый фон/фото без
текста и не добавляй текст потом отдельным слоем, редактором, Canvas,
HTML/CSS, Sharp или другой постобработкой.

## Visual north star

Предпочтительное направление — **Opten cinematic optical editorial**. Это
темная постановочная сцена или студийная диорама с выраженной глубиной,
скульптурным главным объектом, черным металлом/стеклом, контролируемыми
отражениями, оптическим светом и встроенным редакционным слоем. Она может
выглядеть как дорогая предметная съемка, polished CGI или их гибрид; требование
`real practical set` не должно сводить изображение к буквальному столу,
бумажкам и рукам.

Внутренний quality north star — серия
`public/blog/ai-video-for-work/ru/step-*.jpg`. Она работает не из-за пленки,
камер, линз или конкретного motion ribbon, а из-за устойчивой визуальной
грамматики:

- каждый кадр выглядит как реальная low-key editorial-съемка практического
  сета, а не как 3D-инфографика или интерфейс;
- в кадре есть один доминирующий герой, действие или визуальный результат;
- графика плоская, тонкая и подчинена сцене: она показывает путь, контраст,
  последовательность или решение, но не заменяет сам визуал;
- серия держится на одном color grade, свете, материалах, зерне, толщине линий
  и повторяющемся мотиве;
- композиции заметно разные: diptych, hero shot, sequence, decision point —
  без повторения одной доски, сетки или набора карточек.

Прошлый запрет прикладывать эту серию оказался слишком слабой фиксацией:
словесное описание допускает generic editorial flat lay. Поэтому для **первого
RU style-anchor кадра каждой новой статьи** обязательно выбери 1-2 изображения
из `public/blog/ai-video-for-work/ru/step-*.jpg` и передай их генератору только
как `style/quality reference`. В промпте прямо напиши:

```text
Use the attached image(s) only for cinematic depth, black-metal and smoked-glass
material language, optical lighting, controlled reflections, lime signal
integration, typography scale, contrast and color grading. Do not copy their
subject, film/camera objects, layout, camera angle or composition.
```

Не прикладывай north-star JPG ко всем остальным кадрам: после утверждения
первого RU кадра он сам становится style anchor серии. Так стиль фиксируется,
но композиция и предметный мир не размножаются.

Не переноси в новую статью пленку, объективы, камеры, оптические рамки, красную
лампу или конкретную волну движения, если тема сама их не требует. Переноси
глубину, материалы, свет, контраст, типографический масштаб и способ интеграции
сигнала.

`seo2/Reference/ai-headshot-step-*.jpg` и
`seo2/Reference/ai-ugc-step-*.jpg` остаются банком композиционных решений и
примером читаемой смысловой плотности, но не обязательным стилевым входом.
В генератор каждого кадра обязательно прикладывается
`seo2/Reference/bebas-neue-font-reference.png`; к первому RU style anchor
добавляется 1-2 north-star JPG по правилу выше.

Отрицательный пример — `public/blog/ai-freelance-services/ru/step-*.jpg`.
Это чистая и аккуратная серия, но **не нужное направление**: editorial
scrapbook/desk flat lay, бумажные документы и руки стали главным визуальным
языком, глубина почти исчезла, лайм работает как печатная плашка/стрелка, а
крупный текст оказался на физических листах. Если новый style anchor визуально
похож на эту серию, его нужно отклонить и перегенерировать до создания EN-пары.

Лаймовый акцент должен быть ровно `#9CFB51`; не используй более желтый, более
темный или примерный green/lime оттенок.

## Locked visual grammar

- Базовый medium: cinematic optical editorial scene / sculptural studio
  diorama / polished product-film still. Допустим фотореалистичный CGI-гибрид,
  если он дает больше глубины, света и визуальной режиссуры, чем буквальная
  съемка рабочего стола.
- Выбирай материалы из темы статьи: продукт, человек, среда, инструмент,
  фактура, метафорический механизм или реальный рабочий артефакт. Смысл нужно
  переводить в сцену и визуальную метафору, а не буквально раскладывать brief,
  invoice, карточки и результаты на столе.
- Строй минимум три плана: foreground, hero midground, atmospheric background.
  Используй three-quarter, eye-level, low-angle, portal, tunnel, curved sequence
  или deep-stage camera. Top-down/high-oblique desk view допустим максимум в
  одном кадре серии.
- Держи low-key свет, глубокий teal-black фон `#011417`, черный металл, smoked
  glass, узкие specular highlights, контролируемые отражения, объемную дымку или
  light spill и легкое кинематографичное зерно.
- `#9CFB51` должен жить в пространстве как optical signal: световая траектория,
  ribbon, луч, contour path или энергетическая связь с мягким spill на соседних
  материалах. Плоская стрелка или зеленая бумажная плашка сама по себе не дает
  нужного стиля.
- Плоская графика занимает вторичную роль. Она может уточнить траекторию,
  контраст или решение, но главный смысл несут сцена, объект, свет и действие.
- Используй один повторяющийся мотив на серию и, при необходимости, один
  сдержанный функциональный цвет кроме `#9CFB51` — например красный только для
  брака, ошибки или записи.
- Большой Bebas Neue обычно ставь в чистое темное negative space или на
  прозрачную/дымчатую оптическую плоскость. Не печатай hero label на листе,
  карточке, бирке, папке или конверте больше чем в одном кадре серии.
- Большой заголовок сохраняет общую айдентику, но supporting labels не являются
  квотой. Допустимо 0-4 коротких подписи. Если физическая сцена уже доказывает
  мысль, лучше оставить headline-only, чем заполнять кадр карточками.
- Если старый или активный article brief механически требует `3-4 supporting
  labels` и запрещает любой `title-only` кадр, трактуй это как устаревшую
  шаблонную формулировку. Текущее правило этого файла имеет приоритет:
  supporting labels — максимум, а не квота; headline-only разрешен при сильном
  visual proof.
- Разные кадры одной статьи должны менять камеру, масштаб, пространственную
  конструкцию и composition archetype, сохраняя medium, свет, цвет, типографику
  и line language.

## Hard release gate

Серия блокируется и перегенерируется до EN-локализации, если выполняется хотя
бы одно условие:

- два и более RU-кадра являются desk flat lay / scrapbook / papers-on-table;
- документы, листы, карточки, папки или руки — главный герой более чем одного
  кадра;
- три и более кадра сняты сверху или с одинакового высокого oblique-ракурса;
- в трех и более кадрах нет отчетливых foreground / midground / background;
- лайм существует только как плоский текст, стрелка, билет или бумажная плашка,
  без optical glow/path и взаимодействия со сценой;
- hero label напечатан на физическом документе/карточке в двух и более кадрах;
- все кадры можно описать как «предметы разложены на одном темном столе»;
- серия ближе к negative example
  `public/blog/ai-freelance-services/ru/step-*.jpg`, чем к north star
  `public/blog/ai-video-for-work/ru/step-*.jpg`.

## Cover

- `public/blog/<slug>/cover.jpg`
- 1600x900 или больше 16:9.
- Без текста.
- Один файл для RU и EN.

Prompt base:

```text
Opten cinematic optical editorial scene, sculptural studio diorama or polished
product-film still, deep teal-black background (#011417), strong foreground /
hero midground / atmospheric background, one dominant [topic
object/action/result], black metal and smoked glass, exact #9CFB51 optical
signal path with light spill, low-key directional light, controlled
reflections, subtle film grain, crop-safe composition, no text, no logos,
no dashboard, not a desk flat lay, 16:9.
```

## In-Article Images

- 4-5 RU images and 4-5 EN images.
- `public/blog/<slug>/ru/*.jpg`
- `public/blog/<slug>/en/*.jpg`
- RU/EN pairs share composition and meaning; only text language changes.
- Generate the RU image first with the exact Russian text in the prompt, then
  generate the EN sibling with the exact English text while preserving the same
  composition, camera, lighting, object, and color palette.
- Text: one large hero label plus only the information layer needed by this
  scene: 0-4 short labels, a contrast pair, a causal sequence, path marker,
  before/after marker, or decision cue. All text must be rendered by the image
  model into the final raster.
- Photo-first: strong subject, action or result first; explanatory graphics
  second. The frame must remain convincing if the text is mentally removed.
- The image must teach one concrete decision from the article even without the
  neighboring paragraph.

Prompt pattern:

```text
Opten cinematic optical editorial scene on deep teal-black #011417, designed as
a sculptural studio diorama or polished product-film still, not a desk flat
lay. Use foreground, hero midground and atmospheric background. One dominant
[topic subject/action/result or visual metaphor] carries the meaning through
black metal, smoked glass, depth, texture, controlled reflections and low-key
directional light. Exact #9CFB51 appears as an optical signal
path/ribbon/beam/contour with subtle light spill into the scene, not only as a
flat arrow or paper label. Integrate hero text "[RU or EN text]" in large flat
Bebas Neue inside dark negative space or on a transparent optical plane. Add
only labels required for [contrast/sequence/decision]. No dashboard, no generic
card grid, no scrapbook, no papers-on-table composition, subtle film grain,
16:9.
```

Color lock: the lime accent is exactly `#9CFB51`. Repeat that hex in every
image prompt and avoid vague alternatives like `neon green`, `yellow-green`,
`acid green`, or generic `lime` unless the hex is also present.

Avoid:

- dense UI tables;
- a title-only image when the physical visual does not prove the idea;
- decorative icons without readable explanatory labels;
- paragraphs of text inside images;
- prompts led by `infographic`, `dashboard`, `SaaS UI` or `card grid` as the
  primary medium;
- `freelance desk`, `creative desk`, `editorial workbench`, `documents spread
  on table`, `hands sorting papers`, scrapbook, stationery flat lay or portfolio
  collage as the scene family;
- paper maquettes, acrylic interface modules, hanging cards, conveyor rigs and
  schematic boards used as a default visual language for unrelated topics;
- a frame where labels, cards or a diagram are visually stronger than the
  subject, action or result;
- copying the lenses, cameras, film strips, red recording light, subjects,
  camera angles or object layouts from `ai-video-for-work`; an abstract optical
  lime signal/path is part of the style grammar, but its shape and job must be
  article-specific;
- adding text after generation with an editor, Canvas, HTML/CSS, Sharp, or any
  other overlay/post-processing step;
- Opten UI / score / PromptScore / extension sales panels;
- real logos unless required by the article and legally safe.

