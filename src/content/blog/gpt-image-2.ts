// Phase 5 B-01: migrated from src/content/guides/gpt-image-2.ts (Phase 4 D-04/D-05).
// Content body identical to the Phase 4 anchor guide — HUMAN-CURATED, sourced from the author's
// promptscore-proxy/skills/gpt-image-2.md (which itself digests OpenAI Cookbook + fal.ai docs)
// and approved verbatim by user 2026-05-17 per D-07. Only the wrapping shape changed
// (intro/steps/faq are now under `body: { ... }`, with added cover/tags/category/excerpt).

import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-05-17";

// Cover: site-wide OG card placeholder until a proper post-specific illustration ships.
// Both og-card-ru.png and og-card-en.png exist in public/ (Phase 1 GEO-A-4) and clear the
// Rich Results carousel ≥1200px bar. A bespoke cover should be a hand-crafted illustration
// (Midjourney / GPT Image / a designer) rather than a programmatic SVG blob.
const COVER_RU = {
  src: "/og-card-ru.png",
  width: 1200,
  height: 630,
  alt: "Гайд: как писать промпты для GPT Image 2",
};
const COVER_EN = {
  src: "/og-card-en.png",
  width: 1200,
  height: 630,
  alt: "Guide: how to write prompts for GPT Image 2",
};

const ru: BlogPostLocale = {
  slug: "gpt-image-2",
  title: "Как писать промпты для GPT Image 2: 5 шагов от случайной генерации к точному результату",
  excerpt:
    "Структурированный бриф вместо тег-soup, шаблон Change/Preserve/Constraints и итерация по одной оси — 5 шагов от случайной генерации к предсказуемому результату.",
  description:
    "5 шагов и 5 FAQ-ответов от автора Opten: структура промпта, точный текст в кавычках, шаблон редактирования и работа с разрешением в GPT Image 2.",
  category: "guide",
  tags: ["ai-image-gen", "prompt-engineering", "model-deep-dive"],
  cover: COVER_RU,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  body: {
    intro:
      "GPT Image 2 — «думающая» модель OpenAI. Она обрабатывает промпт последовательно: то что написано в начале, имеет наибольший визуальный вес. В отличие от Midjourney, которая хорошо понимает тег-soup, и Nano Banana, у которой яркая «бабблгам»-экспозиция по умолчанию, GPT Image 2 ждёт структурированный бриф с указанием назначения и спокойную нейтральную палитру. Если писать ей промпты как Midjourney — половина кредитов уходит в шум. Эти 5 шагов превращают случайную генерацию в предсказуемый результат на любом запросе: от рекламного баннера до infographic-слайда с плотным многоязычным текстом.",
    steps: [
      {
        title: "Структура важнее тегов",
        body:
          "GPT Image 2 читает промпт сверху вниз и присваивает первому абзацу максимальный вес. Если главный субъект «похоронен» в конце абзаца — модель его не выделит и кадр получится про что-то другое. Рабочий порядок: [Фон/Сцена] → [Субъект] → [Ключевые детали] → [Стиль/Медиум] → [Освещение/Композиция] → [Текст в кавычках] → [Constraints — что сохранить, чего избежать]. Формат блоков может быть любым — естественный язык, JSON-подобная структура, инструкции по пунктам — это всё работает. Главное: намерение и ограничения должны быть в первых 30-40 словах. Тег-soup в стиле Stable Diffusion (`girl, redhair, summer, masterpiece, 8k, octane render`) для GPT Image 2 не работает: модель попытается их использовать, но без понимания иерархии результат будет случайным.",
        before:
          "summer, girl, red hair, beach, golden hour, cinematic, 35mm, photorealistic, masterpiece",
        after:
          "Candid photograph: a young woman with red hair walking along an empty beach at golden hour. Subject centered, looking away from camera. Photorealistic, 35mm film, shallow depth of field, warm natural light, subtle film grain.",
      },
      {
        title: "Пишите как бриф для дизайнера",
        body:
          "Главный лайфхак: указывайте назначение кадра. Не «красивая картинка с продуктом», а «премиальный кампания-кадр для streetwear-бренда Thread». Не «UI экран», а «iPhone mockup для onboarding-флоу финтех-приложения». Назначение активирует у модели правильный набор шаблонов: реклама подразумевает чёткую композицию и место под таглайн; pitch-deck слайд — сетку и читаемые цифры; product shot — нейтральный фон и точное освещение материала. Если назначение не объявлено — модель угадывает, и каждый раз по-разному. Это самая частая причина того, что один и тот же промпт даёт три разных результата подряд. Дополнительно: укажите аудиторию или контекст использования («для презентации инвесторам», «для соцсетей подростковой аудитории») — модель адаптирует тон визуально.",
        before:
          "красивое рекламное изображение нового смартфона",
        after:
          'Premium product campaign image for "Aurora" smartphone (mid-range, target audience: 25-35 urban professionals). Hero shot on a neutral grey gradient background, soft three-point studio lighting, phone tilted 15° to show edge profile, subtle shadow. Tagline area on left third (reserve empty space). Render once, integrated lifestyle cue: faint coffee cup blur in background.',
      },
      {
        title: "Точный текст всегда в кавычках",
        body:
          'GPT Image 2 — SOTA по рендерингу текста внутри изображений (это её главный прорыв vs Midjourney и Stable Diffusion). Но если не заключить точный текст в кавычки, модель воспринимает слова как описание сцены и часто искажает буквы, добавляет лишние символы или путает регистр. Правило: всё что должно появиться на картинке буквально — пишется в `"..."` или ALL CAPS. Указывайте шрифт (`bold sans-serif, Inter`), кегль (`large headline`), цвет и расположение (`centered top third`). Для редких слов, брендов или иностранных написаний — прописывайте по буквам в скобках. Для мелкого или плотного текста (легенды графиков, юридический мелочный шрифт) обязательно ставьте `quality="high"` — на `medium` и `low` микрошрифт будет с артефактами. Многоязычная поддержка: текст можно просить на кириллице, китайском, японском, корейском, хинди, бенгали, арабском — все рендерятся чисто.',
        before:
          "billboard with text Fresh and Clean about a cleaning product, modern design",
        after:
          'Outdoor billboard for a cleaning product brand. Billboard text (EXACT, verbatim, no extra characters, no logo drift): "Fresh and Clean". Typography: bold sans-serif, Inter, white on deep teal background, centered, large size. Below the tagline (smaller, 30% of headline size): "Available nationwide". Quality: high.',
      },
      {
        title: "Шаблон Change / Preserve / Constraints для редактирования",
        body:
          "Когда нужно поменять одно, сохранив остальное — без эксплицитного preserve-блока модель «дрейфует»: меняет лицо вместе с одеждой, освещение вместе с фоном, ракурс вместе с погодой. Шаблон для surgical edits: `Change: [что меняется]` / `Preserve: [лицо, поза, освещение, ракурс, фон, геометрия, текст, layout]` / `Constraints: [no extra objects, no redesign, no logo drift, no watermark]`. Преимущество шаблона — он явно блокирует drift. Особенно критично для virtual try-on (замена одежды на человеке), интерьерной замены (один предмет мебели на другой), смены погоды и сезона. На каждой итерации повторяйте preserve-список — иначе при 3-4 проходе модель забывает что нужно было сохранить идентичность, и постепенно «перерисовывает» персонажа.",
        before:
          "make her hair red",
        after:
          "Change: hair color from brown to natural red (auburn).\nPreserve: face, facial features, skin tone, eye color, expression, pose, lighting direction, background, clothing, all other identity markers.\nConstraints: no extra objects, no redesign of any element except hair, no watermark, no logo drift.",
      },
      {
        title: "Итерация вместо overload",
        body:
          'Часто хочется впихнуть все требования в один промпт: и стиль, и свет, и текст, и constraints, и aspect ratio, и сохранение identity. Так делать нельзя — модель не может одновременно держать в голове 15 ортогональных требований, и одно из них «провисает» (обычно — текст или identity). Правильный workflow: чистый базовый промпт → оценка результата → точечная правка одной осью. Примеры одношаговых правок: `make lighting warmer`, `remove the extra tree on the left`, `replace the typography with Inter bold`, `restore the original background`. Это идёт намного быстрее чем переписывать промпт с нуля. Параметр `quality="high"` включайте только когда оно реально нужно (плотный текст, портреты крупным планом, identity-sensitive editing) — `medium` подходит для 80% задач и работает в 2-3 раза быстрее. И последнее: GPT Image 2 не понимает синтаксис Midjourney (`--ar 16:9`, `::`, `(keyword:1.2)`) — нужное соотношение сторон указывайте явным размером в пикселях, веса — естественным языком («emphasize the cat», «de-emphasize the background»).',
      },
    ],
    faq: [
      {
        q: "Почему один и тот же промпт даёт разный результат в Midjourney и GPT Image 2?",
        a: 'Это разные движки с разными «привычками». Midjourney натренирована на эстетических данных и хорошо понимает тег-soup в духе `cinematic, 8k, octane render, masterpiece` — она интерпретирует это стилистически. GPT Image 2 — «думающая» модель: она ожидает структурированный бриф с указанием назначения и обрабатывает текст последовательно (важное в начало). Дополнительно, GPT Image 2 имеет нейтральную, спокойную экспозицию по умолчанию, а Midjourney тянет в яркое и насыщенное. Для одного и того же запроса в Midjourney хватит «moody coffee shop interior», а GPT Image 2 нужно: «Atmospheric coffee shop interior at dusk. Subject: empty wooden bar table in foreground. Style: documentary realism, desaturated palette, no warming filters. Lighting: ambient indoor, single warm pendant light overhead. Camera: 35mm, eye-level, medium shot.»',
      },
      {
        q: "Можно ли просить GPT Image 2 нарисовать конкретного актёра или политика?",
        a: 'Нет — это политика OpenAI, а не баг. Модель блокирует генерацию узнаваемых лиц публичных персон (актёры, политики, исторические личности после определённой эпохи). Также строгий модератор триггерится на комбинации в целом невинных слов: `real person` + `young woman` + `bathroom` + `suggestive` почти гарантированно даст refusal, даже если каждое слово по отдельности безопасно. Что делать: для узнаваемых лиц используйте Midjourney или Nano Banana (они частично фильтруют, но мягче). Для editorial / fashion с описанием типажа — переформулируйте без real-person attachment («editorial portrait of a woman in her 30s with red hair»). Не пытайтесь обмануть фильтр эвфемизмами — он семантический, а не keyword-based, и эвфемизмы только снижают доверие модели к запросу.',
      },
      {
        q: "Зачем указывать назначение («это реклама», «это UI-мокап»), если я просто хочу красивую картинку?",
        a: 'Назначение активирует у модели правильный «режим» обработки. Реклама подразумевает чёткую композицию, место под таглайн и одну фокусную точку. Pitch-deck слайд — структурированную сетку и читаемые подписи. Product shot — нейтральный фон и точное освещение материала. Documentary realism — desaturated палитру без auto-warming. Без объявленного назначения модель смешивает все эти режимы наугад, и результат сильно гуляет от прохода к проходу. Один и тот же промпт «красивый интерьер кофейни» может выдать то рекламный кадр, то стоковую фотографию, то иллюстрацию. Назначение даёт модели якорь — и кадр становится предсказуемым.',
      },
      {
        q: "Какое максимальное разрешение поддерживает GPT Image 2?",
        a: 'Технически — до 4K (3840×2160), но стабильно работает до 2K (2560×1440). Выше 2K — экспериментальная зона: могут появляться артефакты, и время генерации сильно растёт. Минимальное разрешение: 655 360 пикселей (например, 1024×1024). Обе стороны должны быть кратны 16. Максимальное соотношение длинной к короткой стороне: 3:1 (то есть нельзя сгенерировать узкую панораму 1×10). Популярные стабильные размеры: 1024×1024 (квадрат), 1024×1536 (портрет), 1536×1024 (ландшафт), 2560×1440 (широкоформатный для презентаций). Для 4K и плотного текста обязательно ставьте `quality="high"` — на `medium` и `low` детали будут «плыть».',
      },
      {
        q: "Как заставить модель не менять лицо человека при editing?",
        a: 'Используйте эксплицитный preserve-блок и повторяйте его на каждой итерации. Шаблон: `Change: [только то, что меняется]` / `Preserve: face, facial features, skin tone, eye color, body shape, pose, identity in any way` / `Constraints: replace only the [clothing / background / lighting], no other changes`. Для virtual try-on (примерка одежды) дополнительно блокируйте позу, волосы, ракурс. На каждой следующей итерации повторяйте preserve-блок целиком — иначе при 3-4 проходе модель забывает первоначальные ограничения и постепенно «перерисовывает» персонажа. Это самая частая ошибка в editing-флоу: «я же сказал не менять лицо в первом промпте» — но модель видит только текущий промпт, не всю историю.',
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "gpt-image-2",
  title: "How to write prompts for GPT Image 2: 5 steps from random output to precise result",
  excerpt:
    "Structured brief instead of tag soup, a Change/Preserve/Constraints template, and single-axis iteration — 5 steps from random output to predictable results.",
  description:
    "5 steps and 5 FAQ answers from the author of Opten: prompt structure, exact text in quotes, the editing template, and resolution limits in GPT Image 2.",
  category: "guide",
  tags: ["ai-image-gen", "prompt-engineering", "model-deep-dive"],
  cover: COVER_EN,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  body: {
    intro:
      'GPT Image 2 is OpenAI\'s "thinking" image model. It processes the prompt sequentially: what comes first gets the most visual weight. Unlike Midjourney, which is happy with a tag soup, and Nano Banana, which defaults to a bright bubblegum exposure, GPT Image 2 expects a structured brief with declared purpose and a calm, neutral palette. Write Midjourney-style prompts for it and half your credits go to noise. These 5 steps turn random output into predictable results for everything from ad billboards to dense-text infographic slides.',
    steps: [
      {
        title: "Structure beats tag soup",
        body:
          "GPT Image 2 reads the prompt top-to-bottom and assigns the largest weight to the first paragraph. Bury the main subject at the end and the model won't surface it — your shot ends up being about something else. The working order: [Background/Scene] → [Subject] → [Key details] → [Style/Medium] → [Lighting/Composition] → [Text in quotes] → [Constraints: what to keep, what to avoid]. The block format itself can be anything — natural language, JSON-ish structure, an instruction list — all work. What matters: intent and constraints must live in the first 30-40 words. Stable-Diffusion-style tag soup (`girl, redhair, summer, masterpiece, 8k, octane render`) doesn't work for GPT Image 2: the model tries to use the tags but has no hierarchy, so output is random.",
        before:
          "summer, girl, red hair, beach, golden hour, cinematic, 35mm, photorealistic, masterpiece",
        after:
          "Candid photograph: a young woman with red hair walking along an empty beach at golden hour. Subject centered, looking away from camera. Photorealistic, 35mm film, shallow depth of field, warm natural light, subtle film grain.",
      },
      {
        title: "Write a brief, not a description",
        body:
          'Top lifehack: declare the purpose. Not "a nice product image" but "premium campaign image for streetwear brand Thread." Not "a UI screen" but "iPhone mockup for the onboarding flow of a fintech app." The purpose triggers the right template stack in the model: ads imply tight composition and tagline space; pitch-deck slides imply a grid and readable numbers; product shots imply a neutral backdrop and precise material lighting. With no declared purpose, the model guesses — differently each time. This is the single most common reason the same prompt gives three different outputs in a row. Bonus: state the audience or use context ("for an investor deck", "for teen-audience social media") — the model adapts tone visually.',
        before:
          "beautiful advertising image of a new smartphone",
        after:
          'Premium product campaign image for "Aurora" smartphone (mid-range, target audience: 25-35 urban professionals). Hero shot on a neutral grey gradient background, soft three-point studio lighting, phone tilted 15° to show edge profile, subtle shadow. Tagline area on left third (reserve empty space). Render once, integrated lifestyle cue: faint coffee cup blur in background.',
      },
      {
        title: "Exact text always in quotes",
        body:
          'GPT Image 2 is SOTA at rendering text inside images — its main win over Midjourney and Stable Diffusion. But if you don\'t wrap exact text in quotes, the model treats words as scene description and routinely warps letters, adds extra characters, or drops case. The rule: anything that must appear literally goes inside `"..."` or ALL CAPS. Specify the typeface (`bold sans-serif, Inter`), the size (`large headline`), the color and placement (`centered top third`). For rare words, brand names, or non-English spellings — spell them in brackets. For dense or small text (chart legends, fine-print) always set `quality="high"` — on `medium` and `low` micro-text comes back with artifacts. Multilingual support: text can be in Cyrillic, Chinese, Japanese, Korean, Hindi, Bengali, Arabic — all render cleanly.',
        before:
          "billboard with text Fresh and Clean about a cleaning product, modern design",
        after:
          'Outdoor billboard for a cleaning product brand. Billboard text (EXACT, verbatim, no extra characters, no logo drift): "Fresh and Clean". Typography: bold sans-serif, Inter, white on deep teal background, centered, large size. Below the tagline (smaller, 30% of headline size): "Available nationwide". Quality: high.',
      },
      {
        title: "Change / Preserve / Constraints template for editing",
        body:
          'When you need to change one thing and keep everything else — without an explicit preserve block the model drifts: it shifts the face along with the outfit, the lighting along with the background, the camera angle along with the weather. Surgical edits template: `Change: [what changes]` / `Preserve: [face, pose, lighting, angle, background, geometry, text, layout]` / `Constraints: [no extra objects, no redesign, no logo drift, no watermark]`. The advantage: the template explicitly blocks drift. Especially critical for virtual try-on (swapping clothing on a person), interior swaps (one piece of furniture for another), weather/season changes. Repeat the preserve list on every iteration — otherwise by the 3rd or 4th pass the model forgets the original identity constraints and gradually "redraws" the character.',
        before:
          "make her hair red",
        after:
          "Change: hair color from brown to natural red (auburn).\nPreserve: face, facial features, skin tone, eye color, expression, pose, lighting direction, background, clothing, all other identity markers.\nConstraints: no extra objects, no redesign of any element except hair, no watermark, no logo drift.",
      },
      {
        title: "Iterate, don't overload",
        body:
          'It\'s tempting to cram every requirement into one prompt: style, lighting, text, constraints, aspect ratio, identity preservation. Don\'t — the model can\'t hold 15 orthogonal requirements simultaneously, and one of them collapses (usually text or identity). The right workflow: clean base prompt → evaluate the output → targeted single-axis edit. Examples of one-shot edits: `make lighting warmer`, `remove the extra tree on the left`, `replace the typography with Inter bold`, `restore the original background`. This is far faster than rewriting from scratch. Use `quality="high"` only when you actually need it (dense text, close-up portraits, identity-sensitive editing) — `medium` works for 80% of jobs and is 2-3× faster. Last note: GPT Image 2 does NOT understand Midjourney syntax (`--ar 16:9`, `::`, `(keyword:1.2)`) — specify aspect ratio as explicit pixel size, weight things in natural language ("emphasize the cat", "de-emphasize the background").',
      },
    ],
    faq: [
      {
        q: "Why does the same prompt give different results in Midjourney and GPT Image 2?",
        a: 'Different engines, different habits. Midjourney was trained on aesthetic data and reads tag soup like `cinematic, 8k, octane render, masterpiece` stylistically. GPT Image 2 is a "thinking" model: it expects a structured brief with declared purpose and processes text sequentially (important stuff first). Additionally, GPT Image 2 has a neutral, calm default exposure, while Midjourney pulls toward bright and saturated. The same idea: in Midjourney "moody coffee shop interior" is enough; GPT Image 2 wants "Atmospheric coffee shop interior at dusk. Subject: empty wooden bar table in foreground. Style: documentary realism, desaturated palette, no warming filters. Lighting: ambient indoor, single warm pendant light overhead. Camera: 35mm, eye-level, medium shot."',
      },
      {
        q: "Can I ask GPT Image 2 to draw a specific actor or politician?",
        a: 'No — this is OpenAI policy, not a bug. The model blocks generation of recognizable public figures (actors, politicians, historical personalities past a certain era). The strict moderator also triggers on combinations of innocent words: `real person` + `young woman` + `bathroom` + `suggestive` almost guarantees a refusal, even though each word is fine alone. Workarounds: use Midjourney or Nano Banana for recognizable faces (they filter too, but less aggressively). For editorial / fashion with a type description, reword without real-person attachment ("editorial portrait of a woman in her 30s with red hair"). Don\'t try to euphemism your way past the filter — it\'s semantic, not keyword-based, and euphemisms just lower the model\'s trust in your request.',
      },
      {
        q: 'Why declare the purpose ("this is an ad", "this is a UI mockup") if I just want a nice picture?',
        a: 'The purpose activates the right processing mode in the model. Ads imply tight composition, tagline space, and a single focal point. Pitch-deck slides imply a structured grid and readable labels. Product shots imply a neutral background and precise material lighting. Documentary realism implies a desaturated palette with no auto-warming. Without a declared purpose, the model mixes all those modes at random — and the output drifts wildly between passes. "Beautiful coffee shop interior" can come back as ad photography one time, stock photo the next, illustration after that. The purpose gives the model an anchor and the shot becomes predictable.',
      },
      {
        q: "What's the max resolution GPT Image 2 supports?",
        a: 'Technically up to 4K (3840×2160), but reliably up to 2K (2560×1440). Above 2K is experimental: artifacts can creep in and render times grow significantly. Minimum: 655,360 pixels (e.g. 1024×1024). Both sides must be multiples of 16. Maximum long-to-short side ratio: 3:1 (no skinny 1×10 panoramas). Reliable common sizes: 1024×1024 (square), 1024×1536 (portrait), 1536×1024 (landscape), 2560×1440 (presentation-wide). For 4K and dense text always set `quality="high"` — on `medium` and `low` details "float."',
      },
      {
        q: "How do I keep the face unchanged when editing a person?",
        a: 'Use an explicit preserve block and repeat it on every iteration. Template: `Change: [only what changes]` / `Preserve: face, facial features, skin tone, eye color, body shape, pose, identity in any way` / `Constraints: replace only the [clothing / background / lighting], no other changes`. For virtual try-on (swapping clothing) additionally block pose, hair, camera angle. On every next iteration repeat the full preserve block — by pass 3 or 4 the model forgets the original constraints and starts to "redraw" the character. This is the single most common editing-flow mistake: "I already said don\'t change the face in the first prompt" — but the model only sees the current prompt, not the conversation history.',
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
