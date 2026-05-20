// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for nano-banana.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Nano Banana: структура, ошибки, примеры",
    description:
      "Как писать промпты для Nano Banana от Google: структура полных предложений, диалоговое редактирование, Identity Locking, типичные ошибки и примеры до/после.",
    h1: "Nano Banana: как писать промпты, которые модель понимает",
    intro:
      "Nano Banana — общее имя семейства image-моделей Google в Gemini API. Модель понимает естественный язык и полные описательные предложения, поддерживает диалоговое редактирование, Google Search grounding и референсные изображения. Английский — основной язык; tag soup критически снижает качество. Пиши как креативный директор, а не как набор тегов.",
    sections: [
      {
        heading: "Что умеет семейство Nano Banana",
        body:
          "Главное отличие от Midjourney и Stable Diffusion — Nano Banana «думает». Модель не просто сопоставляет ключевые слова, а понимает намерение, физику и композицию. Поддерживает рендеринг текста, инфографику, реставрацию, колоризацию, перевод 2D-планов в 3D-визуализации и структурный контроль по скетчам и вайрфреймам.\n\nЕсть Google Search grounding — модель может использовать актуальные данные из поиска для визуализации трендов, реальных людей и событий. Знакомая Google-эстетика: тёплая палитра, насыщенные цвета, чистая композиция. Базовые версии — до 1K, Pro — до 4K.",
        bullets: [
          "Естественный язык, полные предложения, бриф вместо тегов",
          "Диалоговое редактирование — правки в рамках сессии",
          "Identity Locking через референсные изображения",
          "Рендеринг текста, инфографика, реставрация, колоризация",
          "Google Search grounding для актуальных данных",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Субъект] + [Сцена/Окружение] + [Освещение/Настроение] + [Стиль/Камера] + [Детали материалов/текстур] + [Контекст назначения].\n\nКонкретизируй субъект: вместо «женщина» — «элегантная пожилая женщина в винтажном костюме Chanel, седые волосы, спокойное выражение лица, прямая осанка». Указывай контекст — для чего изображение (обложка журнала, кулинарная книга, рекламный баннер). Это позволяет модели принимать стилистические решения автоматически: для кулинарной книги она сама выберет малую глубину резкости и тёплое естественное освещение.",
      },
      {
        heading: "Редактируй, а не перегенерируй",
        body:
          "Главное золотое правило Google — диалоговое редактирование. Если изображение готово на 80%, не пиши промпт заново. Скажи: «отлично, но смени освещение на закатное и сделай текст неоново-синим». Модель помнит контекст сессии и применит правку именно к одному параметру.\n\nЭто принципиально иначе, чем в Midjourney или SDXL, где каждый seed — это новое изображение. Для NB-моделей перегенерация ради мелкой правки — антипаттерн. Особенно для портретов с консистентностью персонажа: попроси «измени эмоцию на удивлённую», а не «нарисуй того же человека удивлённым».",
      },
      {
        heading: "Identity Locking для серий",
        body:
          "При работе с референсами явно указывай сохранение идентичности: «Keep the person's facial features exactly the same as Image 1. 100% identical facial features, bone structure, skin tone». Без этой команды модель часто «улучшает» лицо — меняет черты, разглаживает кожу, делает облик собирательным.\n\nДля групповых сцен указывай идентичность КАЖДОГО персонажа отдельно, и фиксируй что одежда/внешность стабильны через сцены. Для вирусных тамбнейлов формула работает за один проход: «персонаж с Изображения 1 + жёлтая стрелка + текст в обводке + жирная графика».",
      },
      {
        heading: "Текстуры и материалы",
        body:
          "Описание материалов критически влияет на качество. Для портретов: «видимые поры кожи, отдельные пряди волос, natural skin texture — not airbrushed look». Для продукта: «matte ceramic surface, brushed steel, soft velvet, worn leather». Для фона: «rough concrete wall, peeling paint, rusted metal railing».\n\nБез текстур изображение получится «гладким» и AI-узнаваемым. С текстурами — тактильным и убедительным. Для коммерческой съёмки текстуры важнее объектива; для портрета — важнее освещения. Это особенность семейства Nano Banana — Google специально оптимизировала под детализированные поверхности.",
      },
    ],
    examples: [
      {
        before:
          "крутая машина в городе",
        after:
          "Cinematic wide shot of a futuristic sports car speeding down a rain-soaked Tokyo street at night. Neon signs reflect on the wet asphalt and the car's polished black metallic body. Long-exposure motion streaks suggest speed. Shot on 35mm with anamorphic lens, shallow depth of field, moody cyberpunk color grade — deep blues and magentas. Style: editorial automotive photography for a luxury brand campaign.",
        note:
          "Tag soup «крутая машина, неон, город, ночь, 8k» заменён на бриф для фотографа: композиция, освещение, объектив, цветокор и назначение (luxury brand campaign).",
      },
      {
        before:
          "удали туристов с фото",
        after:
          "In this photo, remove all background tourists. Fill the empty space with logical environmental textures: matching cobblestone pavement, the same shopfronts continuing seamlessly, consistent shadow direction from the sun. Preserve: the main subject (the woman in red coat in the foreground), the building architecture, the camera angle, the time-of-day lighting. No watermark, no extra figures.",
        note:
          "Семантическое редактирование без маски — фишка Nano Banana. Преserve-блок и явное «fill with logical textures» дают чистый результат без артефактов inpainting.",
      },
      {
        before:
          "обложка кулинарной книги с сэндвичем",
        after:
          "Premium cover image for a Brazilian gourmet cookbook. Hero shot of a freshly grilled chicken sandwich with melted cheese, crisp lettuce, and a brioche bun, sliced in half and slightly tilted to show the layers. Soft natural window light from the left, shallow depth of field, warm rustic wooden surface, faint herb garnish in the background blur. Editorial food photography style, professional plating, appetizing color grade.",
        note:
          "Контекст назначения («premium cookbook cover») активирует у модели нужный режим — она сама выберет глубину резкости, plating и теплоту света. Это особенность Google-семейства.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup вместо предложений",
        explain:
          "«dog, park, 4k, realistic» — это синтаксис старых diffusion-моделей. Nano Banana обучена на описательных текстах и при tag soup даёт обобщённый, неточный результат. Используй полные предложения с правильной грамматикой и описательными прилагательными — это удваивает качество на тех же словах.",
      },
      {
        title: "Перегенерация вместо редактирования",
        explain:
          "Если изображение готово на 80% и нужна мелкая правка, не пиши промпт заново. Скажи в диалоге «отлично, теперь смени освещение на закатное». Перегенерация ради смены одного параметра — антипаттерн для NB. Это особенно критично при работе с консистентностью персонажа: новый seed = новое лицо.",
      },
      {
        title: "Отсутствие Identity Locking при референсах",
        explain:
          "Без явной команды «keep facial features exactly the same as Image 1» модель часто «улучшает» лицо: меняет черты, разглаживает кожу, делает облик собирательным. Для серий и многократного использования одного персонажа Identity Locking — обязательный блок, а не опция.",
      },
      {
        title: "Игнорирование текстур и материалов",
        explain:
          "Без описания текстур изображение получится «гладким» и AI-узнаваемым. Указывай конкретные поверхности: «visible pores», «matte ceramic», «brushed steel», «rough concrete». Для портрета текстура важнее объектива; для продукта — важнее освещения. Это особенность Google-семейства, она оптимизирована под детализированные поверхности.",
      },
      {
        title: "Копирование синтаксиса Midjourney/DALL-E",
        explain:
          "Параметры `::weight`, `--ar 16:9`, `(keyword:1.2)`, BREAK не работают и попадают в текст промпта как мусор. Формат задавай словами («16:9», «portrait», «square»), вес идей — порядком (важное в начало), стили — нормальными прилагательными. Семейство Nano Banana — отдельная вселенная синтаксиса.",
      },
    ],
    faq: [
      {
        q: "Чем Nano Banana отличается от Midjourney и Stable Diffusion?",
        a: "Главное архитектурное отличие — Nano Banana «думает». Это thinking-модель: она не сопоставляет ключевые слова, а понимает намерение, физику, композицию и контекст назначения. Отсюда — натуральный язык вместо тегов, диалоговое редактирование вместо перегенерации, Google Search grounding для актуальных данных и Identity Locking для консистентности. Промпты других моделей сюда не портируются.",
      },
      {
        q: "Какие версии входят в семейство Nano Banana?",
        a: "Базовая Nano Banana (общая, до 1K), Nano Banana 2 (новая, до 2K, до 6 референсов, базовый thinking) и Nano Banana Pro (флагман, до 4K, до 14 референсов, полный thinking, SOTA-рендер текста). Pro — для hero-кампаний и сложных сцен с инфографикой; NB2 — для портретов и итераций; базовая — fallback для совместимости.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Технически да, но Google оптимизировала модели под английский — это родной язык обучения. На сложных промптах с русским будут менее предсказуемые результаты. Рекомендация: основная масса промпта на английском; текст внутри изображения можно просить на любом языке. Кириллица в кадре поддерживается, но в Pro работает лучше всего.",
      },
      {
        q: "Что такое диалоговое редактирование и когда его использовать?",
        a: "Это режим, в котором ты ведёшь беседу с моделью внутри одной сессии: первая реплика — генерация, последующие — правки. Модель помнит контекст и применяет правку к одному параметру, не перерисовывая остальное. Используй для любой мелкой правки — смены освещения, цвета одежды, фона, выражения лица. Это быстрее и сохраняет идентичность персонажа.",
      },
      {
        q: "Поддерживается ли рендеринг текста на изображении?",
        a: "Да, все версии поддерживают, но качество варьируется. Базовая Nano Banana и NB2 справляются с короткими надписями (1-3 слова). Nano Banana Pro — SOTA-уровень: читаемый стилизованный текст, плотная инфографика, диаграммы, многоязычная типографика (кириллица, CJK, арабский). Для постеров и упаковки — только Pro, базовые версии исказят буквы на длинных надписях.",
      },
      {
        q: "Как сохранить лицо персонажа через несколько изображений?",
        a: "Используй Identity Locking: «Keep the person's facial features exactly the same as Image 1. 100% identical facial features, bone structure, skin tone». Pro поддерживает до 14 референсов (6 high fidelity), NB2 — до 6. Для серий — повторяй команду в каждом промпте, иначе модель «улучшит» лицо и сделает облик собирательным. Это известная склонность семейства.",
      },
      {
        q: "Поддерживается ли Opten для Nano Banana?",
        a: "Да, расширение Opten автоматически распознаёт все версии Nano Banana (базовая, 2, Pro) в Google AI Studio и Gemini и оценивает промпты по структуре выше: проверяет конкретность субъекта, естественный язык вместо tag soup, Identity Locking при референсах, описание текстур, контекст назначения. Одним кликом получаешь rewrite в правильной структуре под конкретную версию семейства.",
      },
    ],
  },
  en: {
    title: "Nano Banana Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Google's Nano Banana family: full-sentence brief, conversational editing, Identity Locking, common mistakes, and before/after examples.",
    h1: "Nano Banana: how to write prompts the model actually understands",
    intro:
      "Nano Banana is the umbrella name for Google's image model family in the Gemini API. The model understands natural language and full descriptive sentences, supports conversational editing, Google Search grounding, and reference images. English is the primary language; tag soup critically degrades quality. Write like a creative director, not a tag list.",
    sections: [
      {
        heading: "What the Nano Banana family does",
        body:
          "The headline difference from Midjourney and Stable Diffusion — Nano Banana thinks. The model doesn't just match keywords, it understands intent, physics, and composition. It supports text rendering, infographics, restoration, colorization, translation of 2D plans to 3D visuals, and structural control via sketches and wireframes.\n\nGoogle Search grounding lets the model pull current data from search to visualize trends, real people, and events. The Google aesthetic is consistent: warm palette, saturated colors, clean composition. Base versions go up to 1K, Pro up to 4K.",
        bullets: [
          "Natural language, full sentences, brief instead of tags",
          "Conversational editing — in-session tweaks",
          "Identity Locking via reference images",
          "Text rendering, infographics, restoration, colorization",
          "Google Search grounding for current data",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject] + [Scene/Setting] + [Lighting/Mood] + [Style/Camera] + [Material/texture details] + [Purpose context].\n\nMake the subject concrete: instead of «a woman» — «an elegant elderly woman in a vintage Chanel suit, silver hair, calm expression, upright posture.» State the purpose — what the image is for (magazine cover, cookbook, ad banner). This lets the model make style decisions automatically: for a cookbook it'll pick shallow depth of field and warm natural light on its own.",
      },
      {
        heading: "Edit, don't regenerate",
        body:
          "Google's headline golden rule — conversational editing. If the image is 80% there, don't rewrite the prompt. Say: «great, but change the lighting to sunset and make the text neon blue.» The model remembers session context and applies the tweak to exactly one parameter.\n\nThis is fundamentally different from Midjourney or SDXL, where every seed is a new image. For NB models, regenerating for a small tweak is an anti-pattern. Especially for portraits with character consistency: ask «change the expression to surprised», not «draw the same person surprised.»",
      },
      {
        heading: "Identity Locking for series",
        body:
          "When working with references, explicitly lock identity: «Keep the person's facial features exactly the same as Image 1. 100% identical facial features, bone structure, skin tone.» Without this command the model often «improves» the face — changes features, smooths skin, makes the look composite.\n\nFor group scenes specify the identity of EACH character separately and lock that their clothing/appearance stays stable across shots. For viral thumbnails the formula works in one pass: «character from Image 1 + yellow arrow + outlined text + bold graphics.»",
      },
      {
        heading: "Textures and materials",
        body:
          "Material description critically affects quality. For portraits: «visible skin pores, individual strands of hair, natural skin texture — not airbrushed look.» For products: «matte ceramic surface, brushed steel, soft velvet, worn leather.» For backgrounds: «rough concrete wall, peeling paint, rusted metal railing.»\n\nWithout textures the image comes out «smooth» and AI-recognizable. With textures — tactile and convincing. For commercial photography textures matter more than the lens; for portraits — more than the lighting. This is a Nano Banana family trait — Google specifically tuned it for detailed surfaces.",
      },
    ],
    examples: [
      {
        before: "cool car in the city",
        after:
          "Cinematic wide shot of a futuristic sports car speeding down a rain-soaked Tokyo street at night. Neon signs reflect on the wet asphalt and the car's polished black metallic body. Long-exposure motion streaks suggest speed. Shot on 35mm with anamorphic lens, shallow depth of field, moody cyberpunk color grade — deep blues and magentas. Style: editorial automotive photography for a luxury brand campaign.",
        note:
          "Tag soup «cool car, neon, city, night, 8k» replaced by a photographer brief: composition, lighting, lens, color grade, and purpose (luxury brand campaign).",
      },
      {
        before: "remove tourists from the photo",
        after:
          "In this photo, remove all background tourists. Fill the empty space with logical environmental textures: matching cobblestone pavement, the same shopfronts continuing seamlessly, consistent shadow direction from the sun. Preserve: the main subject (the woman in red coat in the foreground), the building architecture, the camera angle, the time-of-day lighting. No watermark, no extra figures.",
        note:
          "Mask-free semantic editing is a Nano Banana feature. The preserve block plus an explicit «fill with logical textures» gives a clean result with no inpainting artifacts.",
      },
      {
        before: "cookbook cover with a sandwich",
        after:
          "Premium cover image for a Brazilian gourmet cookbook. Hero shot of a freshly grilled chicken sandwich with melted cheese, crisp lettuce, and a brioche bun, sliced in half and slightly tilted to show the layers. Soft natural window light from the left, shallow depth of field, warm rustic wooden surface, faint herb garnish in the background blur. Editorial food photography style, professional plating, appetizing color grade.",
        note:
          "Purpose («premium cookbook cover») activates the right mode — the model picks depth of field, plating, and warmth of light on its own. This is a Google-family trait.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup instead of sentences",
        explain:
          "«dog, park, 4k, realistic» is legacy diffusion syntax. Nano Banana was trained on descriptive text and produces generic, unfocused results from tag soup. Use full sentences with proper grammar and descriptive adjectives — this alone doubles quality on the same set of words.",
      },
      {
        title: "Regenerating instead of editing",
        explain:
          "If the image is 80% there and you need a small fix, don't rewrite the prompt. Say in the dialog «great, now change the lighting to sunset.» Regenerating to flip one parameter is an anti-pattern for NB. Especially critical for character consistency: a new seed = a new face.",
      },
      {
        title: "No Identity Locking with references",
        explain:
          "Without an explicit «keep facial features exactly the same as Image 1» the model often «improves» the face: changes features, smooths skin, makes the look composite. For series and repeated use of one character, Identity Locking is a required block, not an option.",
      },
      {
        title: "Ignoring textures and materials",
        explain:
          "Without texture description the image comes out «smooth» and AI-recognizable. Name specific surfaces: «visible pores», «matte ceramic», «brushed steel», «rough concrete.» For portraits texture matters more than the lens; for products — more than the lighting. The Google family is specifically tuned for detailed surfaces.",
      },
      {
        title: "Copying Midjourney or DALL-E syntax",
        explain:
          "Parameters like `::weight`, `--ar 16:9`, `(keyword:1.2)`, BREAK don't work and end up as literal noise in the prompt. Set format with words («16:9», «portrait», «square»), weight ideas by order (important first), styles via normal adjectives. The Nano Banana family is its own syntax universe.",
      },
    ],
    faq: [
      {
        q: "How is Nano Banana different from Midjourney and Stable Diffusion?",
        a: "The core architectural difference — Nano Banana thinks. It's a thinking model: it doesn't match keywords, it understands intent, physics, composition, and purpose context. That's where natural language instead of tags comes from, conversational editing instead of regeneration, Google Search grounding for live data, and Identity Locking for consistency. Prompts from other models don't port over here.",
      },
      {
        q: "Which versions are in the Nano Banana family?",
        a: "Base Nano Banana (general, up to 1K), Nano Banana 2 (new, up to 2K, up to 6 references, basic thinking), and Nano Banana Pro (flagship, up to 4K, up to 14 references, full thinking, SOTA text rendering). Pro is for hero campaigns and complex scenes with infographics; NB2 is for portraits and iteration; the base is a compatibility fallback.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "Technically yes, but Google tuned the models for English — that's the primary training language. Complex prompts in Russian or other languages get less predictable results. Recommendation: keep the bulk of the prompt in English; in-image text can be requested in any language. Cyrillic in frame is supported but works best in Pro.",
      },
      {
        q: "What is conversational editing and when do I use it?",
        a: "It's a mode where you carry a dialog with the model inside one session: the first message generates, subsequent ones edit. The model remembers context and applies the tweak to one parameter without redrawing the rest. Use it for any small fix — lighting, clothing color, background, expression. Faster and preserves character identity.",
      },
      {
        q: "Is in-image text rendering supported?",
        a: "Yes, all versions support it, but quality varies. Base Nano Banana and NB2 handle short labels (1-3 words). Nano Banana Pro is SOTA: readable stylized text, dense infographics, diagrams, multilingual typography (Cyrillic, CJK, Arabic). For posters and packaging — only Pro; the base versions will mangle letters on long copy.",
      },
      {
        q: "How do I keep a character's face consistent across multiple images?",
        a: "Use Identity Locking: «Keep the person's facial features exactly the same as Image 1. 100% identical facial features, bone structure, skin tone.» Pro supports up to 14 references (6 high fidelity), NB2 up to 6. For series — repeat the command in every prompt, or the model will «improve» the face and make the look composite. This is a known family tendency.",
      },
      {
        q: "Does Opten support Nano Banana?",
        a: "Yes, the Opten extension auto-detects all Nano Banana versions (base, 2, Pro) inside Google AI Studio and Gemini and scores prompts against the structure above: it checks for subject specificity, natural language instead of tag soup, Identity Locking on references, texture description, purpose context. One click gives you a rewrite in the correct structure for the specific family version.",
      },
    ],
  },
};
