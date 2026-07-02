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

## Reference

Смотри `seo2/Reference/`. Это эталон: красивый кинематографичный визуал,
темный SaaS-фон, лаймовые линии/графические акценты, крупный короткий текст,
встроенный в саму генерацию. Лаймовый акцент должен быть ровно `#9CFB51`;
не используй более желтый, более темный или примерный green/lime оттенок.

Главные референсы для внутристатейных SEO2-картинок:

- `seo2/Reference/ai-headshot-step-*.jpg`
- `seo2/Reference/ai-ugc-step-*.jpg`

Смотри не только на стиль, но и на смысловую плотность: в этих кадрах есть
большой заголовок, 3-4 подписи/чек-пункта, иконки, линии, карточки и понятная
структура. Картинка должна объяснять шаг сама по себе, а не просто быть
атмосферной иллюстрацией к заголовку.

## Cover

- `public/blog/<slug>/cover.jpg`
- 1600x900 или больше 16:9.
- Без текста.
- Один файл для RU и EN.

Prompt base:

```text
Minimal dark hero illustration, deep teal-black background (#011417), a single
soft lime-green (#9CFB51) radial glow, [topic object], clean modern tech
aesthetic, cinematic, no text, 16:9.
```

## In-Article Images

- 4-5 RU images and 4-5 EN images.
- `public/blog/<slug>/ru/*.jpg`
- `public/blog/<slug>/en/*.jpg`
- RU/EN pairs share composition and meaning; only text language changes.
- Generate the RU image first with the exact Russian text in the prompt, then
  generate the EN sibling with the exact English text while preserving the same
  composition, camera, lighting, object, and color palette.
- Text: one large hero label plus an information layer: 3-4 short supporting
  labels, checklist rows, micro-cards, score chips, before/after markers, flow
  nodes, or anatomy callouts. All text must be rendered by the image model into
  the final raster.
- Visual-first: strong object/result first, explanatory labels second. The image
  must teach one concrete decision from the article even without the paragraph.

Prompt pattern:

```text
Cinematic dark SaaS editorial image, deep teal-black background (#011417),
lime-green (#9CFB51) graphic accents, [topic object/result], short crisp
in-image hero text: "[RU or EN text]", information layer with 3-4 generated
supporting labels/cards/checkpoints tied to the article step, text is part of
the generated image, clean modern tech aesthetic, 16:9.
```

Color lock: the lime accent is exactly `#9CFB51`. Repeat that hex in every
image prompt and avoid vague alternatives like `neon green`, `yellow-green`,
`acid green`, or generic `lime` unless the hex is also present.

Avoid:

- dense UI tables;
- title-only images where the only meaningful text is one big word or headline;
- decorative icons without readable explanatory labels;
- paragraphs of text inside images;
- adding text after generation with an editor, Canvas, HTML/CSS, Sharp, or any
  other overlay/post-processing step;
- Opten UI / score / PromptScore / extension sales panels;
- real logos unless required by the article and legally safe.

