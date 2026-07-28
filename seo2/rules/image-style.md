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

Предпочтительное направление — **cinematic scene first**: дорогая
кинематографичная предметная или сюжетная фотография, в которую аккуратно
встроен плоский редакционный графический слой. Фотографическая сцена, главный
объект, действие или результат несут смысл первыми; текст, линия и стрелка лишь
помогают прочитать этот смысл.

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

Это **калибровка качества, а не набор постоянных генераторных референсов**.
Не прикладывай JPG из `ai-video-for-work` к генератору и не переноси в новую
статью пленку, объективы, камеры, оптические рамки, красную лампу или волну
движения, если тема сама их не требует. Для каждой статьи придумывай свой
предметный мир, материалы, главный объект и повторяющийся мотив.

`seo2/Reference/ai-headshot-step-*.jpg` и
`seo2/Reference/ai-ugc-step-*.jpg` остаются банком композиционных решений и
примером читаемой смысловой плотности, но не обязательным стилевым входом.
В генератор обязательно прикладывается только
`seo2/Reference/bebas-neue-font-reference.png`.

Лаймовый акцент должен быть ровно `#9CFB51`; не используй более желтый, более
темный или примерный green/lime оттенок.

## Locked visual grammar

- Базовый medium: cinematic editorial photograph of a real practical set.
  Даже если сет миниатюрный или сконструированный, он должен ощущаться
  физическим, освещенным и снятым камерой, а не отрендеренной схемой.
- Выбирай материалы из темы статьи: продукт, человек, среда, инструмент,
  фактура или реальный рабочий артефакт. Не используй бумагу, акрил, подвесные
  карточки, конвейер или макет интерфейса как универсальный ответ на любую тему.
- Держи low-key свет, глубокий teal-black фон `#011417`, контролируемые блики,
  объем, фактуру и легкое кинематографичное зерно.
- Плоская графика занимает вторичную роль. Она может связать объекты, отметить
  движение, выделить выбор или показать причинность, но не должна превращать
  кадр в dashboard, схему или презентационный слайд.
- Используй один повторяющийся мотив на серию и, при необходимости, один
  сдержанный функциональный цвет кроме `#9CFB51` — например красный только для
  брака, ошибки или записи.
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

## Cover

- `public/blog/<slug>/cover.jpg`
- 1600x900 или больше 16:9.
- Без текста.
- Один файл для RU и EN.

Prompt base:

```text
Cinematic editorial photograph of a real practical set, deep teal-black
background (#011417), one dominant [topic object/action/result], exact #9CFB51
as a restrained accent, low-key directional light, tactile materials,
controlled reflections, subtle film grain, crop-safe composition, no text,
no logos, no dashboard, 16:9.
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
Cinematic editorial photograph of a real practical set on a deep teal-black
background (#011417). One dominant [topic subject/action/result] carries the
meaning through physical objects, depth, texture and low-key directional light.
Use exact #9CFB51 only as a restrained flat editorial path/marker/accent.
Integrate short in-image hero text "[RU or EN text]" in flat Bebas Neue.
Add only the labels required to explain [contrast/sequence/decision]; graphics
remain subordinate to the photographic scene. Controlled reflections, subtle
film grain, no dashboard, no generic card grid, 16:9.
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
- paper maquettes, acrylic interface modules, hanging cards, conveyor rigs and
  schematic boards used as a default visual language for unrelated topics;
- a frame where labels, cards or a diagram are visually stronger than the
  subject, action or result;
- copying the lenses, cameras, film strips, motion ribbon, red recording light
  or object layouts from `ai-video-for-work`;
- adding text after generation with an editor, Canvas, HTML/CSS, Sharp, or any
  other overlay/post-processing step;
- Opten UI / score / PromptScore / extension sales panels;
- real logos unless required by the article and legally safe.

