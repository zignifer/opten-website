// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedream-4.5.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedream 4.5: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedream 4.5 от ByteDance: рендеринг текста в изображениях, пространственное понимание сцен, multi-image blending и примеры до/после.",
    h1: "Seedream 4.5: как писать промпты, которые модель понимает",
    intro:
      "Seedream 4.5 — мейнстрим-версия image-модели ByteDance. Делает text-to-image, image-to-image и multi-image blending до 4K. Оптимальная длина промпта 30–100 слов. Доступна через fal.ai, YouMind, flux-ai.io. Принесла читаемый рендеринг текста, пространственное понимание сцен и точное следование сложным инструкциям — главный production-выбор линейки.",
    sections: [
      {
        heading: "Что нового в 4.5 по сравнению с 4.0",
        body:
          "4.5 — это поколенческий скачок над 4.0 по всем направлениям. Превосходная эстетика с проработанным светом и тенями, высокая консистентность сложных сцен, точное следование сложным промптам с визуальным контролем.\n\nКлючевые апгрейды: пространственное понимание (реалистичные пропорции, размещение объектов, компоновка), богатые мировые знания (научное и техническое обоснование), читаемый рендеринг текста на изображениях (постеры, вывески, инфографика), и multi-image blending — смешивание нескольких референсных изображений в один результат.\n\nРазрешение поднято до 4K (в 4.0 — до 2K). Поддержка editing endpoint — inpainting и модификации существующих изображений работают точно, а не «возьми как стартовую точку».",
        bullets: [
          "Text-to-Image, Image-to-Image, Multi-Image Blending",
          "Разрешение до 4K (vs 2K в 4.0)",
          "Оптимальная длина промпта 30–100 слов",
          "Точный рендеринг читаемого текста",
          "Editing endpoint (inpainting, точные модификации)",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Каноническая формула: `[Субъект] + [Стиль] + [Композиция] + [Освещение/Атмосфера] + [Технические параметры]`. Иерархия приоритизации та же, что в 4.0 — субъект всегда первый.\n\nНо 4.5 справляется с куда более детализированными промптами без потери фокуса. Можно безопасно писать 60–100 слов с конкретикой по каждому уровню — модель удерживает все элементы.\n\nПример: «A young woman in soft natural light, photorealistic portrait style, 85mm lens, shallow depth of field, subtle expression, smooth bokeh background, clean composition, --ar 4:5.» — это 28 слов, заполнены все пять уровней иерархии. На такой промпт 4.5 даёт стабильно production-качество.",
      },
      {
        heading: "Рендеринг текста",
        body:
          "Главный апгрейд 4.5 — читаемый текст в изображении. Постеры с заголовками, вывески, инфографика, упаковка — всё что было слабой зоной 4.0, теперь работает.\n\nПравила те же, что в других моделях с in-image text: точный текст в кавычках («text \"BEYOND THE STARS\"»), указан стиль шрифта («bold metallic sans-serif»), указано расположение («centered at top», «bottom left corner»), указан формат («--ar 2:3» для постера).\n\nДля длинных строк — разбивай на отдельные элементы. «Movie poster, text \"BEYOND THE STARS\" centered at top, subtitle \"a journey beyond imagination\" at bottom» работает лучше, чем одна длинная строка. Латиница даёт самые стабильные результаты; кириллица читаемая, но менее точная.",
      },
      {
        heading: "Multi-Image Blending",
        body:
          "Уникальная для 4.5 возможность — смешивание двух референсных изображений в один результат. Шаги: 1) подготовить базовые изображения; 2) загрузить два изображения для смешивания; 3) написать описание желаемого результата; 4) указать, какие стилевые элементы сохранить из каждого источника.\n\nТипичный сценарий: персонаж с одного фото + сеттинг с другого. «Take the character from image 1 and place them in the environment from image 2. Preserve the character's exact facial features and wardrobe from image 1. Use the lighting and atmosphere from image 2.»\n\nДругой сценарий: смешение двух стилей. «Blend the colour palette of image 1 with the composition style of image 2.» — модель синтезирует промежуточный визуал. Это сильнее, чем style transfer — модель действительно понимает, что взять из каждого референса.",
      },
      {
        heading: "Пространственное понимание",
        body:
          "В 4.5 заметно улучшено пространственное понимание — модель держит «cat on the left, dog on the right, window between them» без перепутывания позиций.\n\nКлючевые слова для композиции: «to the left of», «to the right of», «in front of», «behind», «between», «above», «below», «in the foreground», «in the background». Эти связи 4.5 понимает буквально.\n\nПравила композиции: «symmetrical composition», «rule of thirds», «golden ratio», «leading lines», «foreground detail with blurred background» — всё это работает. Расстояния — «close-up», «medium shot», «full-body shot», «wide shot». Ракурсы — «overhead perspective», «low angle», «Dutch angle», «centered in frame».\n\nДля сложных сцен с 3+ объектами всё ещё рекомендуется итеративный подход — менять по одному параметру, чтобы видеть, как модель распределяет приоритеты.",
      },
    ],
    examples: [
      {
        before: "красивая фотография еды для меню ресторана",
        after:
          "Bowl of artisan ramen with soft-boiled egg, sliced pork belly, and fresh green onions on a dark stone surface, food photography, soft overhead lighting from the upper-left, steam rising from the bowl, shallow depth of field with sharp focus on the egg yolk, warm earthy color palette, close-up overhead angle, --ar 1:1.",
        note:
          "Конкретный субъект (что именно в кадре), food photography стиль, явное освещение с направлением, композиция overhead, depth of field. 50 слов — рабочая длина для 4.5. На таком уровне детализации 4.5 даёт почти production-ready результат.",
      },
      {
        before: "постер фильма с заголовком и атмосферой ужаса",
        after:
          "Horror movie poster with text \"THE LAST NIGHT\" in bold weathered sans-serif typography centered at the upper third, dark abandoned hallway receding into shadow, single bare bulb hanging from the ceiling, dramatic low-key lighting with hard shadows, cold blue-grey color palette with one accent of red light at the far end, subtle film grain, cinematic 35mm aesthetic, --ar 2:3.",
        note:
          "Текст в кавычках, явный стиль шрифта, явное расположение в кадре. Сцена с пространственным пониманием (коридор, лампа, дальний красный акцент). Это то, что в 4.0 ломается, а в 4.5 работает.",
      },
      {
        before: "смешай моё фото с пейзажем как фон",
        after:
          "Take the person from image 1 and place them in the mountain landscape from image 2. Preserve the person's exact facial features, wardrobe, and pose from image 1. Use the lighting, atmosphere, and golden hour color palette from image 2. Match the scale so the person stands naturally in the mid-ground, with the mountain peaks rising behind them. Cinematic style, shallow depth of field, --ar 16:9.",
        note:
          "Multi-Image Blending промпт: явно сказано, что взять из image 1 (внешность, одежда, поза), что взять из image 2 (свет, атмосфера, палитра), плюс инструкция по масштабу и расположению. Без явного preserve-списка модель может «улучшить» лицо или изменить одежду.",
      },
    ],
    mistakes: [
      {
        title: "Использование 4.5 как «быстрого» 5",
        explain:
          "5 Lite лучше во всём, но 4.5 — production-стандарт линейки на момент релиза. Не пытайся писать промпт по правилам 5 (120 слов, расширенные стили, улучшенная анатомия) на 4.5 — модель потеряет фокус. Оптимум для 4.5 — 30–100 слов, и придерживайся стандартного набора стилей.",
      },
      {
        title: "Multi-Image Blending без явного preserve-списка",
        explain:
          "При смешивании двух изображений нужно явно указать, что брать из каждого. «Возьми персонажа из image 1 и помести в сцену из image 2» — слишком абстрактно. Правильно: «Preserve the person's exact facial features, wardrobe, and pose from image 1. Use the lighting and color palette from image 2.»",
      },
      {
        title: "Длинный текст в одной строке",
        explain:
          "Постер с одной длинной строкой («text \"BEYOND THE STARS A JOURNEY BEYOND IMAGINATION\"») 4.5 рендерит хуже, чем разбитый на части. Лучше: «text \"BEYOND THE STARS\" centered at top, subtitle \"a journey beyond imagination\" at bottom». Длинные строки модель может исказить даже на 4.5.",
      },
      {
        title: "Негативы в основном тексте",
        explain:
          "Как и в 4.0, на 4.5 негативные промпты пишутся в отдельное поле platform negative_prompt, не в основной текст. «No watermark, no text» в основном промпте — антипаттерн, модель может добавить водяной знак. Используй отдельное поле или переформулируй позитивно.",
      },
      {
        title: "Конфликтующие стили",
        explain:
          "«Photorealistic oil painting cartoon» работает на 4.5 чуть лучше, чем на 4.0, но всё равно даёт непредсказуемый результат. Выбирай один доминирующий стиль и максимум один совместимый модификатор. «Cinematic with film grain», «photorealistic with subtle painterly touches» — ок. «Realistic anime» — нет.",
      },
    ],
    faq: [
      {
        q: "Чем 4.5 отличается от 4.0?",
        a: "Шесть ключевых апгрейдов: превосходная эстетика с детальным светом и тенями, читаемый рендеринг текста в изображениях, пространственное понимание сцен с несколькими объектами, точное следование сложным промптам, разрешение до 4K (vs 2K в 4.0), и multi-image blending. Для production-задач 4.5 — однозначный выбор; 4.0 остаётся для быстрых дешёвых базовых шотов.",
      },
      {
        q: "Чем 4.5 отличается от 5 Lite?",
        a: "5 Lite дальше расширил возможности 4.5: ещё более точный текст, улучшенная анатомия рук, более широкий диапазон стилей, поддержка длинных промптов до 120 слов, лучшее пространственное понимание. Но 4.5 — стабильный production-стандарт линейки, и для большинства задач разница между 4.5 и 5 Lite минимальна. Используй ту, что доступна на платформе.",
      },
      {
        q: "Как использовать multi-image blending правильно?",
        a: "Три ключевых элемента: 1) явно сказать, что взять из каждого референса (внешность, поза, свет, палитра); 2) указать, как объединить (соблюсти масштаб, поместить в передний/задний план, сохранить пропорции); 3) описать желаемый результат стилистически. Без явного preserve-списка модель может «улучшить» лицо или изменить одежду — критичная зона для портретов.",
      },
      {
        q: "Какой максимальный размер изображения?",
        a: "До 4K. Это шаг вперёд от 4.0 (до 2K). Соотношение сторон — стандартные 1:1, 2:3, 3:4, 4:3, 3:2, 16:9, 9:16 плюс произвольные через --ar. Для постеров — --ar 2:3 (вертикальный) или --ar 3:2 (горизонтальный). Для портретной фотографии в соцсетях — --ar 4:5. Для пейзажей и кинематографа — --ar 16:9.",
      },
      {
        q: "Как использовать editing endpoint в 4.5?",
        a: "Editing endpoint — это inpainting и точные модификации существующих изображений. Шаги: 1) загрузить базовое изображение; 2) указать маску области для редактирования (на платформе типа fal.ai это отдельный UI-элемент); 3) написать промпт того, что должно появиться в маске. В отличие от 4.0, где «возьми как стартовую точку» — здесь точная замена области с сохранением остального.",
      },
      {
        q: "Какие стили работают лучше всего на 4.5?",
        a: "Стабильно сильные зоны: photorealistic portrait и cinematic photography (отличное лицо и освещение), fashion editorial (контроль ткани и драпировки), commercial product photography (чёткие материалы), concept art / digital painting (эпический масштаб с volumetric light), architectural visualization (точные пропорции). Слабые зоны (для них лучше 5 Lite) — комиксы и manga со сложной анатомией рук.",
      },
      {
        q: "Поддерживается ли Opten для Seedream 4.5?",
        a: "Да, расширение Opten распознаёт Seedream 4.5 внутри fal.ai, YouMind и flux-ai.io. Оценивает промпт по структуре production-версии: проверяет субъект в начале, наличие явного стиля, корректность освещения, разделение позитива и негатива, кавычки вокруг текста, корректную структуру multi-image blending. Одним кликом получишь rewrite, использующий все возможности 4.5.",
      },
    ],
  },
  en: {
    title: "Seedream 4.5 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedream 4.5: in-image text rendering, spatial scene understanding, multi-image blending, and before/after examples.",
    h1: "Seedream 4.5: how to write prompts the model actually understands",
    intro:
      "Seedream 4.5 is the mainstream version of ByteDance's image model. Text-to-image, image-to-image, and multi-image blending up to 4K. Optimal prompt length is 30–100 words. Available via fal.ai, YouMind, and flux-ai.io. It brought readable in-image text rendering, scene spatial understanding, and precise adherence to complex instructions — the line's main production choice.",
    sections: [
      {
        heading: "What is new in 4.5 versus 4.0",
        body:
          "4.5 is a generational jump over 4.0 across the board. Superior aesthetics with worked-out light and shadows, high consistency on complex scenes, precise adherence to complex prompts with visual control.\n\nKey upgrades: spatial understanding (realistic proportions, object placement, scene layout), rich world knowledge (scientific and technical grounding), readable in-image text rendering (posters, signs, infographics), and multi-image blending — combining several reference images into one result.\n\nResolution is raised to 4K (vs 2K in 4.0). Editing endpoint support — inpainting and modifications of existing images work precisely, not as «take this as a starting point».",
        bullets: [
          "Text-to-Image, Image-to-Image, Multi-Image Blending",
          "Resolution up to 4K (vs 2K in 4.0)",
          "Optimal prompt length 30–100 words",
          "Precise rendering of readable text",
          "Editing endpoint (inpainting, precise modifications)",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Canonical formula: `[Subject] + [Style] + [Composition] + [Lighting/Atmosphere] + [Technical parameters]`. Prioritization hierarchy is the same as in 4.0 — subject always first.\n\nBut 4.5 handles much more detailed prompts without losing focus. You can safely write 60–100 words of specifics across every level — the model holds all elements.\n\nExample: «A young woman in soft natural light, photorealistic portrait style, 85mm lens, shallow depth of field, subtle expression, smooth bokeh background, clean composition, --ar 4:5.» — 28 words, all five hierarchy levels filled. On a prompt like this 4.5 reliably delivers production quality.",
      },
      {
        heading: "Text rendering",
        body:
          "The main 4.5 upgrade is readable in-image text. Posters with titles, signs, infographics, packaging — everything that was a 4.0 weak spot now works.\n\nRules are the same as in other models with in-image text: exact text in quotes («text \"BEYOND THE STARS\"»), explicit font style («bold metallic sans-serif»), explicit placement («centered at top», «bottom left corner»), explicit format («--ar 2:3» for a poster).\n\nFor long strings — split into separate elements. «Movie poster, text \"BEYOND THE STARS\" centered at top, subtitle \"a journey beyond imagination\" at bottom» works better than one long string. Latin script yields the most stable results; Cyrillic is readable but less precise.",
      },
      {
        heading: "Multi-Image Blending",
        body:
          "Uniquely available in 4.5 — blending two reference images into one result. Steps: 1) prepare the base images; 2) upload two images for blending; 3) write a description of the desired result; 4) state which stylistic elements to preserve from each source.\n\nTypical scenario: character from one photo + setting from another. «Take the character from image 1 and place them in the environment from image 2. Preserve the character's exact facial features and wardrobe from image 1. Use the lighting and atmosphere from image 2.»\n\nAnother scenario: style blend. «Blend the colour palette of image 1 with the composition style of image 2.» — the model synthesizes an intermediate visual. This is stronger than style transfer — the model actually understands what to take from each reference.",
      },
      {
        heading: "Spatial understanding",
        body:
          "Spatial understanding is noticeably improved in 4.5 — the model holds «cat on the left, dog on the right, window between them» without scrambling positions.\n\nKey words for composition: «to the left of», «to the right of», «in front of», «behind», «between», «above», «below», «in the foreground», «in the background». 4.5 reads these relationships literally.\n\nComposition rules: «symmetrical composition», «rule of thirds», «golden ratio», «leading lines», «foreground detail with blurred background» — all work. Distance — «close-up», «medium shot», «full-body shot», «wide shot». Angles — «overhead perspective», «low angle», «Dutch angle», «centered in frame».\n\nFor complex scenes with 3+ objects an iterative approach is still recommended — change one parameter at a time to see how the model assigns priorities.",
      },
    ],
    examples: [
      {
        before: "nice food photo for a restaurant menu",
        after:
          "Bowl of artisan ramen with soft-boiled egg, sliced pork belly, and fresh green onions on a dark stone surface, food photography, soft overhead lighting from the upper-left, steam rising from the bowl, shallow depth of field with sharp focus on the egg yolk, warm earthy color palette, close-up overhead angle, --ar 1:1.",
        note:
          "Concrete subject (what is actually in frame), food photography style, explicit lighting with direction, overhead composition, depth of field. 50 words — a working length for 4.5. At this level of detail 4.5 delivers a nearly production-ready result.",
      },
      {
        before: "horror movie poster with a title and creepy atmosphere",
        after:
          "Horror movie poster with text \"THE LAST NIGHT\" in bold weathered sans-serif typography centered at the upper third, dark abandoned hallway receding into shadow, single bare bulb hanging from the ceiling, dramatic low-key lighting with hard shadows, cold blue-grey color palette with one accent of red light at the far end, subtle film grain, cinematic 35mm aesthetic, --ar 2:3.",
        note:
          "Text in quotes, explicit font style, explicit placement in frame. A spatially understood scene (hallway, bulb, far red accent). This is what breaks in 4.0 and works in 4.5.",
      },
      {
        before: "blend my photo with a landscape as background",
        after:
          "Take the person from image 1 and place them in the mountain landscape from image 2. Preserve the person's exact facial features, wardrobe, and pose from image 1. Use the lighting, atmosphere, and golden hour color palette from image 2. Match the scale so the person stands naturally in the mid-ground, with the mountain peaks rising behind them. Cinematic style, shallow depth of field, --ar 16:9.",
        note:
          "A Multi-Image Blending prompt: explicit on what to take from image 1 (appearance, wardrobe, pose) and from image 2 (light, atmosphere, palette), plus instructions on scale and placement. Without an explicit preserve list, the model may «improve» the face or change the wardrobe.",
      },
    ],
    mistakes: [
      {
        title: "Using 4.5 as «fast» 5",
        explain:
          "5 Lite is better at everything, but 4.5 is the line's production standard as of release. Don't try to write a prompt by 5's rules (120 words, extended styles, improved anatomy) on 4.5 — the model loses focus. Sweet spot for 4.5 is 30–100 words; stick to the standard style set.",
      },
      {
        title: "Multi-Image Blending without an explicit preserve list",
        explain:
          "Blending two images requires explicit guidance on what to take from each. «Take the character from image 1 and place in the scene from image 2» is too abstract. Correct: «Preserve the person's exact facial features, wardrobe, and pose from image 1. Use the lighting and color palette from image 2.»",
      },
      {
        title: "Long text in a single string",
        explain:
          "A poster with one long string («text \"BEYOND THE STARS A JOURNEY BEYOND IMAGINATION\"») renders worse in 4.5 than the same content split into parts. Better: «text \"BEYOND THE STARS\" centered at top, subtitle \"a journey beyond imagination\" at bottom». Long strings can get mangled even on 4.5.",
      },
      {
        title: "Negatives in the main text",
        explain:
          "As in 4.0, on 4.5 negative prompts go in the platform's separate negative_prompt field, not in the main text. «No watermark, no text» in the main prompt is an anti-pattern — the model may add a watermark. Use the separate field or phrase positively.",
      },
      {
        title: "Conflicting styles",
        explain:
          "«Photorealistic oil painting cartoon» works a bit better on 4.5 than on 4.0, but still produces an unpredictable result. Pick one dominant style and at most one compatible modifier. «Cinematic with film grain», «photorealistic with subtle painterly touches» — fine. «Realistic anime» — no.",
      },
    ],
    faq: [
      {
        q: "How is 4.5 different from 4.0?",
        a: "Six key upgrades: superior aesthetics with detailed light and shadows, readable in-image text rendering, spatial understanding of multi-object scenes, precise adherence to complex prompts, resolution up to 4K (vs 2K in 4.0), and multi-image blending. For production work 4.5 is the clear choice; 4.0 remains for fast cheap baseline shots.",
      },
      {
        q: "How is 4.5 different from 5 Lite?",
        a: "5 Lite extends 4.5's capabilities further: even more precise text, improved hand anatomy, wider style range, support for long prompts up to 120 words, better spatial understanding. But 4.5 is the line's stable production standard, and for most tasks the gap between 4.5 and 5 Lite is minimal. Use whichever is available on the platform.",
      },
      {
        q: "How do I use multi-image blending correctly?",
        a: "Three key elements: 1) explicitly state what to take from each reference (appearance, pose, light, palette); 2) state how to combine (preserve scale, place in foreground/background, keep proportions); 3) describe the desired result stylistically. Without an explicit preserve list, the model may «improve» the face or change the wardrobe — a critical zone for portraits.",
      },
      {
        q: "What is the maximum image size?",
        a: "Up to 4K. That is a step up from 4.0 (up to 2K). Aspect ratios — standard 1:1, 2:3, 3:4, 4:3, 3:2, 16:9, 9:16 plus arbitrary via --ar. For posters — --ar 2:3 (vertical) or --ar 3:2 (horizontal). For social portrait photography — --ar 4:5. For landscapes and cinematic shots — --ar 16:9.",
      },
      {
        q: "How do I use the editing endpoint in 4.5?",
        a: "The editing endpoint is inpainting and precise modifications of existing images. Steps: 1) upload a base image; 2) specify the mask area for editing (on platforms like fal.ai that is a separate UI control); 3) write a prompt for what should appear inside the mask. Unlike 4.0 where it was «take as a starting point», here it is a precise area replacement with the rest preserved.",
      },
      {
        q: "Which styles perform best on 4.5?",
        a: "Stable strong zones: photorealistic portrait and cinematic photography (excellent face and lighting), fashion editorial (fabric and drape control), commercial product photography (precise materials), concept art / digital painting (epic scale with volumetric light), architectural visualization (precise proportions). Weak zones (5 Lite is better) — comics and manga with complex hand anatomy.",
      },
      {
        q: "Does Opten support Seedream 4.5?",
        a: "Yes, the Opten extension detects Seedream 4.5 inside fal.ai, YouMind, and flux-ai.io. It scores prompts against the production-version structure: checks for subject at the start, presence of explicit style, lighting correctness, separation of positive and negative, quotes around text, correct multi-image blending structure. One click gives you a rewrite that uses every 4.5 capability.",
      },
    ],
  },
};
