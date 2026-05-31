---
tags: [opten, blog, images, seo2]
kind: image-style
---

# Blog Image Style

Эти правила применяются к обложке и внутристатейным изображениям.

## Reference

Смотри `seo2/Reference/`. Это эталон: красивый кинематографичный визуал,
темный SaaS-фон, лаймовые линии/оверлеи, крупный короткий текст.

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
- Text: 1-4 large words or one short line.
- Visual-first: strong object/result first, UI overlay second.

Avoid:

- dense UI tables;
- paragraphs of text inside images;
- Opten UI / score / PromptScore / extension sales panels;
- real logos unless required by the article and legally safe.

