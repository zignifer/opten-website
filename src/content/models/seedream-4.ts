// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedream-4.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedream 4.0: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedream 4.0 от ByteDance: простая прямолинейная структура, иерархия приоритизации, ограничения версии 4.0 и примеры до/после.",
    h1: "Seedream 4.0: как писать промпты, которые модель понимает",
    intro:
      "Seedream 4.0 — базовая версия image-модели ByteDance первого поколения семейства. Делает text-to-image до 2K, оптимальная длина промпта 20–80 слов. Доступна через fal.ai, flux-ai.io. Хорошо справляется с простыми сценами и стандартными жанрами, но слабее версий 4.5 и 5 на сложных многоэлементных сценах и пространственных отношениях.",
    sections: [
      {
        heading: "Где 4.0 в линейке Seedream",
        body:
          "Seedream 4.0 — это «надёжный базовый солдат» семейства. Стабильная генерация, предсказуемые результаты на простых промптах, поддержка стандартных стилей и базовое понимание композиции. Это самая дешёвая и быстрая версия линейки.\n\nЧего НЕ умеет 4.0 по сравнению с 4.5 и 5: слабее точное следование сложным инструкциям, хуже пространственное понимание (пропорции, размещение объектов), менее детализированный рендеринг текста на изображениях, меньшая консистентность в сценах с несколькими объектами.\n\nКлючевой совет: для 4.0 используй короткие простые промпты вместо длинных сложных. Где 5 Lite справится с 120-словным многослойным промптом, 4.0 даст лучший результат на 30-словном прямолинейном.",
        bullets: [
          "Text-to-Image, до 2K",
          "Оптимальная длина промпта 20–80 слов",
          "Стандартные соотношения сторон через --ar",
          "Базовое image-to-image (ограниченно)",
          "Слабый рендеринг сложного текста на изображениях",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Базовая формула: `[Субъект] + [Стиль] + [Композиция] + [Освещение] + [Детали]`. Как и в других версиях Seedream, субъект всегда идёт первым — иерархическая приоритизация общая для всего семейства.\n\nДля 4.0 рекомендуется более простая структура, чем для 4.5/5. Меньше прилагательных, более прямолинейные формулировки, чёткое разделение на уровни. Перегрузка деталями работает хуже, чем в более поздних версиях.\n\nПример: «A young woman with curly hair, portrait photography, soft studio lighting, neutral background, 85mm lens.» — пять компонентов, ничего лишнего. Это рабочий минимум для 4.0.",
      },
      {
        heading: "Что 4.0 умеет хорошо",
        body:
          "Портретная фотография — Subject + appearance + portrait photography + lighting + background. На стандартных портретах 4.0 даёт почти такое же качество, как 4.5.\n\nПейзажи и сцены — Location + landscape photography + lighting + mood. Природные пейзажи с golden hour, mountain lakes, forests — сильная сторона 4.0.\n\nПродуктовая фотография — product + material + clean background + product photography + studio lighting. Простые продуктовые шоты на белом фоне выходят чисто.\n\nИллюстрации и арт — subject + style (watercolor, oil painting) + colors + mood. Стилизованные иллюстрации в одном чётком стиле — рабочая зона 4.0.\n\nКинематографические кадры — scene + character + cinematic + dramatic lighting + lens. Базовые cinematic-кадры доступны, но без сложной хореографии нескольких объектов.",
      },
      {
        heading: "Что 4.0 умеет плохо",
        body:
          "Сложный текст на изображениях — это слабая зона 4.0. На постерах с длинными заголовками модель искажает буквы, путает шрифты, добавляет лишние символы. Если нужен качественный рендеринг текста — выбирай 4.5 или 5.\n\nПространственные отношения между объектами — 4.0 плохо понимает «a cat on the left, a dog on the right, a window between them». Сложные многоэлементные сцены с явным размещением — антипаттерн.\n\nДлинные многослойные промпты — больше 100 слов, и модель теряет фокус. Лучше 80 слов с конкретикой, чем 150 со всем подряд.\n\nИтеративная работа с одной композицией — 4.0 хуже сохраняет одну и ту же сцену между генерациями. Версия больше «лотерейная»: каждая генерация чуть другая.",
      },
      {
        heading: "Освещение и стиль",
        body:
          "Освещение в 4.0 — рабочая зона, но проще, чем в 4.5/5. Классические схемы работают: «golden hour», «studio lighting», «soft diffused light», «dramatic shadows». Сложные («Rembrandt lighting», «butterfly lighting») тоже распознаются, но результат менее точный.\n\nСтили: photorealistic, watercolor, oil painting, digital art, cinematic, concept art, anime — стандартный набор работает надёжно. Конфликтующие стили («photorealistic cartoon») для 4.0 особенно вредны — модель ломается быстрее.\n\nЦветовая гамма — «warm tones», «cool tones», «muted», «vibrant», «pastel», «monochrome». Эти ярлыки 4.0 хорошо понимает и применяет.\n\nНастроение — «dramatic», «serene», «mysterious», «moody», «peaceful». Базовые эмоциональные ярлыки работают.",
      },
    ],
    examples: [
      {
        before: "женщина в офисе",
        after:
          "A young woman with curly brown hair in a beige blazer, working at a wooden desk in a modern office, portrait photography style, soft natural window light from the left, neutral background, 85mm lens, shallow depth of field, --ar 4:5.",
        note:
          "Главное отличие: конкретный субъект (волосы, одежда), указан стиль фото, явное освещение и объектив. Это типичный «80-словный» промпт, оптимальный для 4.0 — не перегружен, но содержит все ключевые элементы.",
      },
      {
        before: "горный пейзаж на закате",
        after:
          "Mountain lake at sunrise, landscape photography, golden hour lighting, snow-capped peaks reflected in calm water, serene atmosphere, wide-angle composition, subtle morning mist, --ar 16:9.",
        note:
          "Природный пейзаж с golden hour — сильная сторона 4.0. Промпт намеренно простой и прямолинейный (около 25 слов), без сложных пространственных инструкций.",
      },
      {
        before: "матовая чёрная кружка на белом фоне",
        after:
          "Matte black ceramic coffee mug on a white background, product photography, soft studio lighting, sharp focus on the mug, clean minimal composition, subtle shadow, --ar 1:1.",
        note:
          "Простой e-commerce шот — основная зона 4.0. Один объект, чистый фон, явный стиль, явное освещение. Никаких сложных деталей и нескольких объектов — модель работает быстро и стабильно.",
      },
    ],
    mistakes: [
      {
        title: "Длинный многослойный промпт",
        explain:
          "Больше 100 слов в 4.0 — антипаттерн. Модель теряет фокус и приоритеты смещаются. Если в 5 Lite можно расписать длинный детализированный промпт, в 4.0 лучше держать 20–80 слов. Конкретика короткими блоками работает лучше, чем длинное описание.",
      },
      {
        title: "Сложный текст на изображениях",
        explain:
          "Постеры с длинными заголовками, инфографика с множеством надписей, UI-мокапы с интерфейсом — слабая зона 4.0. Модель искажает буквы, путает шрифты. Если нужен качественный текст в изображении — переключайся на 4.5 или 5 Lite. В 4.0 ограничься короткими словами в кавычках.",
      },
      {
        title: "Сложные пространственные инструкции",
        explain:
          "«A cat sitting on a chair to the left of a window, with a dog lying on the floor in front of the chair» — 4.0 такие связи не держит. Получишь сцену с этими объектами, но в случайном расположении. Для точной композиции нужна 4.5 или 5.",
      },
      {
        title: "Конфликтующие стили",
        explain:
          "«Photorealistic cartoon sketch» или «watercolor 3D render» — 4.0 ломается на конфликтах быстрее, чем 4.5/5. Выбирай один доминирующий стиль и максимум один совместимый модификатор. «Photorealistic with film grain» — ок. «Realistic anime» — нет.",
      },
      {
        title: "Негативы в основном тексте",
        explain:
          "«No watermark, no text, no extra limbs» в основном промпте 4.0 воспримет буквально — может добавить водяной знак. Все запреты идут в отдельное поле negative_prompt платформы. Если оно недоступно — формулируй позитивно: «no cluttered» → «clean background».",
      },
    ],
    faq: [
      {
        q: "Стоит ли использовать 4.0 вместо 4.5 или 5?",
        a: "Стоит, если задача простая: один субъект, чистый фон, стандартный стиль, никакого сложного текста и многоэлементной композиции. 4.0 быстрее и дешевле на стандартных портретах, пейзажах и e-commerce шотах. Для сложных сцен, рендеринга текста, пространственных отношений и итеративной работы — берите 4.5 или 5 Lite.",
      },
      {
        q: "Какая оптимальная длина промпта для 4.0?",
        a: "20–80 слов. Это уже, чем в других версиях линейки (где 30–100). Меньше 5 слов — модель слишком много додумывает. Больше 100 — теряет фокус. Лучший подход — 30–50 слов конкретики, без воды и лишних прилагательных. Каждое слово должно нести смысл: что в кадре, какой стиль, какое освещение, какой объектив.",
      },
      {
        q: "Может ли 4.0 рендерить текст в изображении?",
        a: "Базово — да, но качество существенно ниже 4.5 и особенно 5 Lite. Короткие слова в кавычках («text \"OPEN\"») работают на постерах. Длинные строки, мелкий кегль и сложные шрифты искажаются. Если рендеринг текста критичен — переключайтесь на 5 Lite, в 4.0 это известная слабая зона.",
      },
      {
        q: "Поддерживаются ли негативные промпты?",
        a: "Да, но через отдельное поле platform negative_prompt, не через основной текст. На fal.ai и flux-ai.io это отдельный параметр. Несколько простых запретов работают надёжно: «no watermark», «no text», «no extra limbs», «no cluttered background». Сложные негативные конструкции лучше формулировать позитивно в основном промпте.",
      },
      {
        q: "Можно ли использовать image-to-image в 4.0?",
        a: "Поддержка ограниченная — базовое image-to-image на некоторых платформах. Это не полный editing endpoint как в 4.5, а скорее «возьми это изображение как стартовую точку». Для серьёзного редактирования (inpainting, точные модификации) нужна 4.5 или 5 Lite. В 4.0 image-to-image работает как general style transfer без точного контроля.",
      },
      {
        q: "Как лучше итерироваться в 4.0?",
        a: "Менять один параметр за раз — это золотое правило для всей линейки Seedream, но в 4.0 особенно важно. Если поменять одновременно свет, объектив и стиль, непонятно, что повлияло на результат. Шаги: 1) базовый промпт; 2) генерация; 3) меняешь только освещение; 4) генерация; 5) меняешь только объектив; и так далее. Так быстрее придёшь к нужной картинке.",
      },
      {
        q: "Поддерживается ли Opten для Seedream 4.0?",
        a: "Да, расширение Opten распознаёт Seedream 4.0 внутри fal.ai и flux-ai.io. Оценивает промпт с учётом ограничений именно версии 4.0: проверяет длину (20–80 слов оптимум), субъект в начале, простоту структуры, отсутствие сложного текста и многоэлементных пространственных инструкций. Если промпт слишком сложный для 4.0 — Opten предложит упростить или порекомендует переключиться на 4.5/5 Lite.",
      },
    ],
  },
  en: {
    title: "Seedream 4.0 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedream 4.0: simple straightforward structure, prioritization hierarchy, version 4.0 limits, and before/after examples.",
    h1: "Seedream 4.0: how to write prompts the model actually understands",
    intro:
      "Seedream 4.0 is the baseline image model from ByteDance and the first generation of the family. Text-to-image up to 2K, optimal prompt length 20–80 words. Available via fal.ai and flux-ai.io. Handles simple scenes and standard genres well, but weaker than 4.5 and 5 on complex multi-element scenes and spatial relationships.",
    sections: [
      {
        heading: "Where 4.0 sits in the Seedream line",
        body:
          "Seedream 4.0 is the «reliable baseline soldier» of the family. Stable generation, predictable results on simple prompts, support for standard styles, and basic composition understanding. It is the cheapest and fastest version of the line.\n\nWhat 4.0 cannot do versus 4.5 and 5: weaker on complex-instruction adherence, weaker spatial understanding (proportions, object placement), less detailed in-image text rendering, lower consistency in multi-object scenes.\n\nKey advice: for 4.0, use short simple prompts rather than long complex ones. Where 5 Lite handles a 120-word multi-layered prompt, 4.0 delivers a better result on a 30-word straightforward one.",
        bullets: [
          "Text-to-Image, up to 2K",
          "Optimal prompt length 20–80 words",
          "Standard aspect ratios via --ar",
          "Basic image-to-image (limited)",
          "Weak rendering of complex in-image text",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Base formula: `[Subject] + [Style] + [Composition] + [Lighting] + [Details]`. As in other Seedream versions, the subject always goes first — hierarchical prioritization is shared across the family.\n\nFor 4.0 a simpler structure is recommended than for 4.5/5. Fewer adjectives, more straightforward phrasing, clean separation of levels. Detail overload performs worse than in later versions.\n\nExample: «A young woman with curly hair, portrait photography, soft studio lighting, neutral background, 85mm lens.» — five components, nothing extra. That is the working minimum for 4.0.",
      },
      {
        heading: "What 4.0 does well",
        body:
          "Portrait photography — Subject + appearance + portrait photography + lighting + background. On standard portraits 4.0 delivers almost the same quality as 4.5.\n\nLandscapes and scenes — location + landscape photography + lighting + mood. Natural landscapes with golden hour, mountain lakes, forests are a 4.0 strength.\n\nProduct photography — product + material + clean background + product photography + studio lighting. Simple white-background product shots come out clean.\n\nIllustration and art — subject + style (watercolor, oil painting) + colors + mood. Stylized illustrations in a single clear style are a 4.0 sweet spot.\n\nCinematic shots — scene + character + cinematic + dramatic lighting + lens. Basic cinematic frames are accessible, but without complex choreography across multiple objects.",
      },
      {
        heading: "What 4.0 does poorly",
        body:
          "Complex in-image text is a 4.0 weak zone. On posters with long titles the model mangles letters, mixes fonts, adds stray characters. If you need quality text rendering, pick 4.5 or 5.\n\nSpatial relationships between objects — 4.0 cannot reliably hold «a cat on the left, a dog on the right, a window between them». Complex multi-element scenes with explicit placement are an anti-pattern.\n\nLong multi-layered prompts — past 100 words and the model loses focus. 80 words of specifics beats 150 of mixed content.\n\nIterative work on a single composition — 4.0 holds the same scene between generations less consistently. The version is more «lottery-like»: each generation comes out slightly different.",
      },
      {
        heading: "Lighting and style",
        body:
          "Lighting in 4.0 is a working zone, but simpler than in 4.5/5. Classic schemes work: «golden hour», «studio lighting», «soft diffused light», «dramatic shadows». Complex ones («Rembrandt lighting», «butterfly lighting») are recognized too, but the result is less precise.\n\nStyles: photorealistic, watercolor, oil painting, digital art, cinematic, concept art, anime — the standard set is reliable. Conflicting styles («photorealistic cartoon») hurt 4.0 more than 4.5/5 — the model breaks faster.\n\nColor palette — «warm tones», «cool tones», «muted», «vibrant», «pastel», «monochrome». 4.0 understands and applies these labels well.\n\nMood — «dramatic», «serene», «mysterious», «moody», «peaceful». Basic emotional labels work.",
      },
    ],
    examples: [
      {
        before: "woman in an office",
        after:
          "A young woman with curly brown hair in a beige blazer, working at a wooden desk in a modern office, portrait photography style, soft natural window light from the left, neutral background, 85mm lens, shallow depth of field, --ar 4:5.",
        note:
          "Key change: concrete subject (hair, clothing), explicit photo style, explicit lighting and lens. This is a textbook «80-word» prompt that is optimal for 4.0 — not overloaded but containing every key element.",
      },
      {
        before: "mountain landscape at sunset",
        after:
          "Mountain lake at sunrise, landscape photography, golden hour lighting, snow-capped peaks reflected in calm water, serene atmosphere, wide-angle composition, subtle morning mist, --ar 16:9.",
        note:
          "A natural landscape with golden hour is a 4.0 strength. The prompt is deliberately simple and straightforward (about 25 words), with no complex spatial instructions.",
      },
      {
        before: "matte black mug on a white background",
        after:
          "Matte black ceramic coffee mug on a white background, product photography, soft studio lighting, sharp focus on the mug, clean minimal composition, subtle shadow, --ar 1:1.",
        note:
          "A simple e-commerce shot — 4.0's main lane. One object, clean background, explicit style, explicit lighting. No complex details and no multiple objects — the model works fast and stable.",
      },
    ],
    mistakes: [
      {
        title: "Long multi-layered prompt",
        explain:
          "Over 100 words in 4.0 is an anti-pattern. The model loses focus and priorities drift. Where 5 Lite tolerates a long detailed prompt, 4.0 prefers 20–80 words. Specifics in short blocks work better than a long description.",
      },
      {
        title: "Complex in-image text",
        explain:
          "Posters with long titles, infographics with many labels, UI mockups with interface text — a 4.0 weak zone. The model mangles letters and mixes fonts. If you need quality in-image text, switch to 4.5 or 5 Lite. In 4.0 stick to short words in quotes.",
      },
      {
        title: "Complex spatial instructions",
        explain:
          "«A cat sitting on a chair to the left of a window, with a dog lying on the floor in front of the chair» — 4.0 won't hold those relationships. You'll get a scene with these objects but in random placement. For precise composition, you need 4.5 or 5.",
      },
      {
        title: "Conflicting styles",
        explain:
          "«Photorealistic cartoon sketch» or «watercolor 3D render» — 4.0 breaks on conflicts faster than 4.5/5. Pick one dominant style and at most one compatible modifier. «Photorealistic with film grain» is fine. «Realistic anime» is not.",
      },
      {
        title: "Negatives in the main text",
        explain:
          "«No watermark, no text, no extra limbs» in the main 4.0 prompt is read literally — possibly adding a watermark. All bans go into the platform's separate negative_prompt field. When that isn't available, phrase positively: «no cluttered» → «clean background».",
      },
    ],
    faq: [
      {
        q: "Should I use 4.0 instead of 4.5 or 5?",
        a: "Yes if the task is simple: one subject, clean background, standard style, no complex text and no multi-element composition. 4.0 is faster and cheaper on standard portraits, landscapes, and e-commerce shots. For complex scenes, text rendering, spatial relationships, and iterative work — take 4.5 or 5 Lite.",
      },
      {
        q: "What is the optimal prompt length for 4.0?",
        a: "20–80 words. That's tighter than the rest of the line (30–100). Under 5 words — the model fills in too much. Over 100 — it loses focus. The best approach is 30–50 words of specifics, no filler and no stray adjectives. Every word must carry meaning: what is in frame, which style, which lighting, which lens.",
      },
      {
        q: "Can 4.0 render in-image text?",
        a: "Basically — yes, but quality is substantially lower than 4.5 and especially 5 Lite. Short words in quotes («text \"OPEN\"») work on posters. Long strings, small type, and complex fonts get mangled. If text rendering is critical, switch to 5 Lite; in 4.0 it is a known weak spot.",
      },
      {
        q: "Are negative prompts supported?",
        a: "Yes, but via the platform's separate negative_prompt field, not the main text. On fal.ai and flux-ai.io it is a distinct parameter. A handful of simple bans work reliably: «no watermark», «no text», «no extra limbs», «no cluttered background». Complex negative constructions are better phrased positively in the main prompt.",
      },
      {
        q: "Can I use image-to-image in 4.0?",
        a: "Support is limited — basic image-to-image on some platforms. It is not the full editing endpoint of 4.5, more like «take this image as a starting point». For serious editing (inpainting, precise modifications), you need 4.5 or 5 Lite. In 4.0 image-to-image behaves like general style transfer without fine control.",
      },
      {
        q: "What is the best way to iterate in 4.0?",
        a: "Change one parameter at a time — the golden rule for the whole Seedream line, but especially important for 4.0. If you change lighting, lens, and style at once, you can't tell what caused the result. Steps: 1) base prompt; 2) generate; 3) change lighting only; 4) generate; 5) change lens only; and so on. You'll reach the desired image faster.",
      },
      {
        q: "Does Opten support Seedream 4.0?",
        a: "Yes, the Opten extension detects Seedream 4.0 inside fal.ai and flux-ai.io. It scores prompts with the 4.0 constraints in mind: checks length (20–80 words sweet spot), subject at the start, structural simplicity, absence of complex text and multi-element spatial instructions. If a prompt is too complex for 4.0, Opten will suggest simplifying or recommend switching to 4.5 / 5 Lite.",
      },
    ],
  },
};
