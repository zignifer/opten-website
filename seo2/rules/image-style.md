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
встроенный в саму генерацию.

## Cover

- `public/blog/<slug>/cover.jpg`
- 1600x900 или больше 16:9.
- Без текста.
- Один файл для RU и EN.

Prompt base:

```text
Minimal dark hero illustration, deep teal-black background (#011417), a single
soft lime-green (#9cfb51) radial glow, [topic object], clean modern tech
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
- Text: 1-4 large words or one short line, rendered by the image model into the
  final raster.
- Visual-first: strong object/result first, small interface accent second.

Prompt pattern:

```text
Cinematic dark SaaS editorial image, deep teal-black background (#011417),
lime-green (#9cfb51) graphic accents, [topic object/result], short crisp
in-image text: "[RU or EN text]", text is part of the generated image, clean
modern tech aesthetic, 16:9.
```

Avoid:

- dense UI tables;
- paragraphs of text inside images;
- adding text after generation with an editor, Canvas, HTML/CSS, Sharp, or any
  other overlay/post-processing step;
- Opten UI / score / PromptScore / extension sales panels;
- real logos unless required by the article and legally safe.

