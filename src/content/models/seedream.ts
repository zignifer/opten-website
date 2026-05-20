// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedream.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedream: структура, ошибки, примеры",
    description:
      "Как писать промпты для семейства Seedream от ByteDance: общая структура, иерархия понимания, освещение, негативные промпты и примеры до/после.",
    h1: "Seedream: как писать промпты, которые модель понимает",
    intro:
      "Seedream — семейство image-моделей ByteDance: версии 4.0, 4.5, 5 Lite и будущие. Доступны через fal.ai, syntx.ai, YouMind, flux-ai.io. Все версии используют общую архитектуру приоритизации — элементы в начале промпта получают больший вес. Оптимизированы под английский, оптимальная длина — 30–100 слов. Поддерживают негативные промпты на уровне платформы.",
    sections: [
      {
        heading: "Что общего у всех Seedream",
        body:
          "Линейка Seedream использует одну архитектурную идею — иерархическую приоритизацию. Модель читает промпт сверху вниз и присваивает максимальный вес тому, что упомянуто первым. Главный субъект всегда идёт в начале. Зарытый в конец абзаца субъект теряет приоритет, и фокус кадра смещается на сцену или освещение.\n\nЭта иерархия — пять уровней: Subject → Style → Composition → Lighting & Atmosphere → Technical details. Каждая последующая версия (4.0 → 4.5 → 5 Lite) расширяет диапазон стилей, улучшает рендеринг текста и работу со сложными сценами, но базовая иерархия остаётся неизменной.\n\nВсе версии работают на английском лучше, чем на любом другом языке. На 4.5 и 5 китайский тоже поддерживается, но английский остаётся стабильным эталоном для production-промптов.",
        bullets: [
          "Иерархия 5 уровней: Subject → Style → Composition → Lighting → Technical",
          "Главный субъект — всегда в начале промпта",
          "Оптимальная длина 30–100 слов",
          "Английский даёт самые стабильные результаты",
          "Соотношение сторон через --ar",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Каноническая формула: `[Субъект] + [Стиль] + [Композиция] + [Освещение/Атмосфера] + [Технические параметры]`.\n\nSubject — конкретный, не абстрактный. «A fluffy orange tabby cat sitting on a windowsill» вместо «a cat». Style — фотографический («portrait photography», «product photography»), кинематографический («cinematic», «film noir») или арт-стиль («oil painting», «watercolor»).\n\nComposition — ракурс, крупность, расположение в кадре («close-up», «rule of thirds», «overhead perspective»). Lighting — конкретный тип света («golden hour», «studio lighting», «Rembrandt lighting»). Technical — объектив, глубина резкости, формат («85mm lens», «shallow depth of field», «--ar 16:9»).\n\nНе обязательно использовать все пять уровней. Минимум — Subject + Style + 2–3 дескриптора. Максимум — 30–100 слов, после чего модель начинает терять фокус.",
      },
      {
        heading: "Шесть базовых типов промптов",
        body:
          "Портретная фотография — Subject + appearance + portrait photography + 85mm lens + lighting + background. Реализм лица и кожи — одна из сильнейших сторон Seedream.\n\nПродуктовая фотография — product + material + clean background + commercial style + studio lighting + ultra-sharp. Главное — чистота фона и точность света.\n\nКинематографические сцены — scene + character + cinematic + 35mm lens + dramatic lighting + atmosphere. Лучше всего работают холодные палитры, контровой свет, дождь, неон.\n\nКонцепт-арт и иллюстрации — subject/world + concept art / digital painting + epic scale + volumetric light + intricate details. Используй слова «epic», «volumetric», «intricate» — Seedream на них реагирует усиленно.\n\nСтилизованные изображения — subject + конкретный стиль (watercolor, oil painting, anime) + цветовая палитра + настроение. Постеры и типографика — poster/banner + text «...» в кавычках + стиль шрифта + формат.",
      },
      {
        heading: "Освещение и атмосфера",
        body:
          "Lighting — самая чувствительная зона Seedream. Конкретное название схемы света даёт радикально лучший результат, чем общее «good lighting».\n\nКлассические схемы: «Rembrandt lighting» (треугольник света под глазом), «butterfly lighting» (тень-бабочка под носом), «split lighting» (половина лица в тени), «loop lighting» (мягкая петля от носа). Эти термины пришли из фотографии — модель их знает.\n\nВремя суток: «golden hour» (тёплый закат), «blue hour» (холодное послезакатное небо), «overcast» (рассеянный пасмурный), «noon» (жёсткий полуденный). Источник: «studio lighting», «natural light», «candlelight», «neon glow», «moonlight».\n\nХарактер: «soft diffused light», «dramatic side lighting», «high-key» (светлый, рекламный), «low-key» (тёмный, нуар), «volumetric light» (видимые лучи).",
      },
      {
        heading: "Negative prompts и итерации",
        body:
          "Все версии Seedream поддерживают negative prompts, но **в отдельном поле** платформы, не в основном тексте. На fal.ai/syntx.ai это отдельный параметр negative_prompt; если написать запреты в основном тексте, модель воспримет их как описание сцены.\n\nПолезные негативы: «no extra limbs», «no blurry details», «no cluttered background», «no watermark», «no text» (если текст не нужен). Несколько простых запретов работают надёжнее, чем сложные конструкции.\n\nИтеративный подход — главный навык работы с Seedream: 1) начать с базового промпта (субъект + стиль); 2) сгенерировать первый кадр; 3) добавить или изменить **один** параметр; 4) повторить. Менять сразу свет, объектив и стиль — антипаттерн: непонятно, что именно повлияло на результат.",
      },
    ],
    examples: [
      {
        before: "красивая девушка с цветами",
        after:
          "A young woman holding a bouquet of pale pink peonies, photorealistic portrait style, 85mm lens, shallow depth of field, soft natural window light from the left, neutral linen background, gentle expression, subtle warm tones, --ar 4:5.",
        note:
          "Главное отличие: субъект в начале и конкретен («holding a bouquet of pale pink peonies», не «with flowers»), указан фотографический стиль («photorealistic portrait»), объектив и глубина резкости. Соотношение сторон через --ar.",
      },
      {
        before: "продукт фото",
        after:
          "A matte black ceramic coffee mug on a white seamless background, commercial product photography, soft three-point studio lighting, ultra-sharp details, slight overhead angle, clean composition, subtle shadow on the right, --ar 1:1.",
        note:
          "Subject + material + background + style + lighting + composition + format — все пять уровней иерархии заполнены. «Ultra-sharp details» — типичный e-commerce якорь, который Seedream понимает буквально.",
      },
      {
        before: "постер к фильму про космос с заголовком beyond the stars",
        after:
          "Movie poster for a sci-fi epic, text \"BEYOND THE STARS\" in bold metallic sans-serif typography centered at top, dark deep-space background with a single illuminated planet on the right, dramatic cinematic composition, cold blue and white color palette, subtle film grain, --ar 2:3.",
        note:
          "Текст в изображении — всегда в кавычках. Указан тип шрифта, расположение, цветовая палитра, формат. Без кавычек и стиля шрифта Seedream может исказить буквы или подобрать случайный шрифт.",
      },
    ],
    mistakes: [
      {
        title: "Субъект не в начале промпта",
        explain:
          "Иерархическая приоритизация присваивает максимальный вес тому, что упомянуто первым. Если промпт начинается с «Beautiful golden hour lighting in a forest with a cat», главным субъектом станет лес или освещение, а не кот. Правильно — «A cat in a forest with golden hour lighting».",
      },
      {
        title: "Негативы в основном тексте",
        explain:
          "«No watermark, no text» в основном промпте Seedream воспримет как описание сцены — возможно, добавит водяной знак. Все запреты должны идти в отдельное поле platform negative_prompt. Если оно недоступно — формулируй позитивно: «no cluttered» → «clean background».",
      },
      {
        title: "Конфликтующие стили",
        explain:
          "«Photorealistic oil painting watercolor cartoon» — модель не знает, во что играть. Выбирай один доминирующий стиль и максимум один дополнительный модификатор. «Photorealistic with subtle film grain» работает; «realistic cartoon sketch» — нет.",
      },
      {
        title: "Перегрузка прилагательными",
        explain:
          "20 слабых дескрипторов («beautiful, nice, gorgeous, stunning, amazing, breathtaking») работают хуже, чем 3–5 мощных конкретных («Rembrandt lighting, 85mm lens, shallow depth of field, golden hour, weathered leather»). Конкретика всегда побеждает общие восхищённые слова.",
      },
      {
        title: "Отсутствие указания стиля",
        explain:
          "Без явного стиля Seedream выбирает случайный: один раз получишь фотореализм, другой — иллюстрацию, третий — 3D-рендер. Стиль — обязательный элемент. Минимум: «photorealistic», «cinematic», «watercolor», «oil painting» — что-то одно из этого должно быть в каждом промпте.",
      },
    ],
    faq: [
      {
        q: "Какая версия Seedream лучше для production?",
        a: "Для production-задач — Seedream 4.5 или 5 Lite. Версия 4.0 — стабильная базовая модель, но слабее в тексте на изображениях и пространственных отношениях. Версия 4.5 значительно сильнее в многоэлементных сценах и рендеринге текста. Версия 5 Lite — самая свежая, с улучшенной анатомией рук и поддержкой более длинных промптов.",
      },
      {
        q: "Можно ли писать промпты на русском или китайском?",
        a: "Все версии Seedream оптимизированы под английский — там стабильный эталон. Версии 5 Lite и 4.5 также поддерживают китайский. Русский принимается, но результаты менее предсказуемы. Для production-промптов рекомендуется английский; для экспериментов любой язык подойдёт. Соотношение сторон --ar работает универсально.",
      },
      {
        q: "Какая оптимальная длина промпта?",
        a: "30–100 слов для всех версий. Меньше 5 слов — модель слишком много додумывает, результат непредсказуем. Больше 150 слов — модель теряет фокус и приоритеты смещаются. Версия 5 Lite справляется с длинными промптами до 120 слов, но и для неё 30–100 — оптимум. Лучше 5 точных дескрипторов, чем 20 общих.",
      },
      {
        q: "Как контролировать освещение?",
        a: "Используй конкретные термины из фотографии: «Rembrandt lighting», «butterfly lighting», «split lighting», «loop lighting». Эти схемы модель знает. Время суток — «golden hour», «blue hour», «overcast», «noon». Характер — «soft diffused», «dramatic side lighting», «high-key», «low-key», «volumetric light». Общее «good lighting» работает хуже, чем любая конкретная схема.",
      },
      {
        q: "Поддерживает ли Seedream рендеринг текста?",
        a: "Поддерживает, но качество растёт от версии к версии. В 4.0 — базовая, короткие слова и простые шрифты. В 4.5 — хорошая, читаемые постеры и вывески. В 5 Lite — отличная, длинные строки и сложная типографика. Правила: текст в кавычках («text \"YOUR TEXT\"»), указан стиль шрифта («bold sans-serif»), указано расположение («centered at top»). Без кавычек модель может исказить буквы.",
      },
      {
        q: "Как использовать соотношение сторон --ar?",
        a: "Параметр --ar пишется в конце промпта: «--ar 16:9» для пейзажа, «--ar 9:16» для мобильного, «--ar 1:1» для квадрата, «--ar 2:3» для постера, «--ar 4:5» для портретной фотографии в соцсетях. Платформы могут принимать --ar по-разному (fal.ai парсит, syntx.ai тоже); если не сработало — переключись на штатный параметр aspect_ratio в UI.",
      },
      {
        q: "Поддерживается ли Opten для семейства Seedream?",
        a: "Да, расширение Opten распознаёт все версии Seedream внутри fal.ai, syntx.ai, YouMind и flux-ai.io. Оценивает промпт по общей структуре линейки: проверяет субъект в начале, наличие стиля, корректность освещения, разделение позитива и негатива, кавычки вокруг текста для рендеринга. Одним кликом получишь rewrite, адаптированный под конкретную версию Seedream, которая открыта в данный момент.",
      },
    ],
  },
  en: {
    title: "Seedream Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedream family: shared structure, comprehension hierarchy, lighting, negative prompts, and before/after examples.",
    h1: "Seedream: how to write prompts the model actually understands",
    intro:
      "Seedream is ByteDance's image model family: versions 4.0, 4.5, 5 Lite, and future releases. Available via fal.ai, syntx.ai, YouMind, and flux-ai.io. Every version uses the same prioritization architecture — elements at the start of the prompt carry more weight. Optimized for English, optimal length is 30–100 words. Negative prompts are supported at the platform level.",
    sections: [
      {
        heading: "What every Seedream version shares",
        body:
          "The Seedream line shares one architectural idea — hierarchical prioritization. The model reads the prompt top to bottom and assigns the highest weight to whatever is mentioned first. The main subject always goes first. A subject buried at the end of a paragraph loses priority, and the framing shifts to the scene or lighting instead.\n\nThis hierarchy has five levels: Subject → Style → Composition → Lighting & Atmosphere → Technical details. Each successive version (4.0 → 4.5 → 5 Lite) expands the style range, improves in-image text rendering and handling of complex scenes, but the underlying hierarchy stays the same.\n\nAll versions perform better in English than in any other language. On 4.5 and 5 Chinese is also supported, but English remains the stable reference for production prompts.",
        bullets: [
          "5-level hierarchy: Subject → Style → Composition → Lighting → Technical",
          "Main subject always goes at the start of the prompt",
          "Optimal length 30–100 words",
          "English yields the most stable results",
          "Aspect ratio via --ar",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Canonical formula: `[Subject] + [Style] + [Composition] + [Lighting/Atmosphere] + [Technical parameters]`.\n\nSubject — concrete, not abstract. «A fluffy orange tabby cat sitting on a windowsill» instead of «a cat». Style — photographic («portrait photography», «product photography»), cinematic («cinematic», «film noir»), or art style («oil painting», «watercolor»).\n\nComposition — angle, framing, layout («close-up», «rule of thirds», «overhead perspective»). Lighting — a specific scheme («golden hour», «studio lighting», «Rembrandt lighting»). Technical — lens, depth of field, format («85mm lens», «shallow depth of field», «--ar 16:9»).\n\nNot every level needs to be filled. Minimum — Subject + Style + 2–3 descriptors. Maximum — 30–100 words; past that the model starts losing focus.",
      },
      {
        heading: "Six base prompt types",
        body:
          "Portrait photography — Subject + appearance + portrait photography + 85mm lens + lighting + background. Realistic skin and face rendering is one of Seedream's strengths.\n\nProduct photography — product + material + clean background + commercial style + studio lighting + ultra-sharp. The key is clean background and precise light.\n\nCinematic scenes — scene + character + cinematic + 35mm lens + dramatic lighting + atmosphere. Cool palettes, rim light, rain, and neon work best.\n\nConcept art and illustration — subject/world + concept art / digital painting + epic scale + volumetric light + intricate details. Use the words «epic», «volumetric», «intricate» — Seedream reacts to them strongly.\n\nStylized images — subject + a specific style (watercolor, oil painting, anime) + color palette + mood. Posters and typography — poster/banner + text «...» in quotes + font style + format.",
      },
      {
        heading: "Lighting and atmosphere",
        body:
          "Lighting is the most sensitive zone in Seedream. A specific light-scheme name yields a radically better result than a generic «good lighting».\n\nClassic schemes: «Rembrandt lighting» (triangular highlight under the eye), «butterfly lighting» (butterfly shadow under the nose), «split lighting» (half the face in shadow), «loop lighting» (soft nose loop). These are photography terms — the model knows them.\n\nTime of day: «golden hour» (warm sunset), «blue hour» (cool post-sunset sky), «overcast» (diffused cloudy), «noon» (hard midday). Source: «studio lighting», «natural light», «candlelight», «neon glow», «moonlight».\n\nQuality: «soft diffused light», «dramatic side lighting», «high-key» (bright, commercial), «low-key» (dark, noir), «volumetric light» (visible beams).",
      },
      {
        heading: "Negative prompts and iteration",
        body:
          "All Seedream versions support negative prompts, but **in the platform's separate field**, not in the main text. On fal.ai/syntx.ai it's a distinct negative_prompt parameter; if you place bans in the main text the model will read them as scene description.\n\nUseful negatives: «no extra limbs», «no blurry details», «no cluttered background», «no watermark», «no text» (when text isn't needed). A handful of simple bans is more reliable than complex constructions.\n\nIterative work is the core Seedream skill: 1) start with a base prompt (subject + style); 2) generate the first image; 3) add or change **one** parameter; 4) repeat. Changing lighting, lens, and style at once is an anti-pattern — you won't know what caused the result.",
      },
    ],
    examples: [
      {
        before: "beautiful girl with flowers",
        after:
          "A young woman holding a bouquet of pale pink peonies, photorealistic portrait style, 85mm lens, shallow depth of field, soft natural window light from the left, neutral linen background, gentle expression, subtle warm tones, --ar 4:5.",
        note:
          "Key change: subject up front and concrete («holding a bouquet of pale pink peonies», not «with flowers»), explicit photographic style («photorealistic portrait»), lens and depth of field specified. Aspect ratio via --ar.",
      },
      {
        before: "product photo",
        after:
          "A matte black ceramic coffee mug on a white seamless background, commercial product photography, soft three-point studio lighting, ultra-sharp details, slight overhead angle, clean composition, subtle shadow on the right, --ar 1:1.",
        note:
          "Subject + material + background + style + lighting + composition + format — all five hierarchy levels filled. «Ultra-sharp details» is a canonical e-commerce anchor that Seedream takes literally.",
      },
      {
        before: "movie poster about space with title beyond the stars",
        after:
          "Movie poster for a sci-fi epic, text \"BEYOND THE STARS\" in bold metallic sans-serif typography centered at top, dark deep-space background with a single illuminated planet on the right, dramatic cinematic composition, cold blue and white color palette, subtle film grain, --ar 2:3.",
        note:
          "In-image text always in quotes. Font style, placement, color palette, and format are explicit. Without quotes and a font style Seedream may mangle the letters or pick a random typeface.",
      },
    ],
    mistakes: [
      {
        title: "Subject not at the start of the prompt",
        explain:
          "Hierarchical prioritization assigns the highest weight to whatever is mentioned first. A prompt that begins with «Beautiful golden hour lighting in a forest with a cat» makes the forest or the lighting the main subject, not the cat. The correct form is «A cat in a forest with golden hour lighting».",
      },
      {
        title: "Negatives in the main text",
        explain:
          "«No watermark, no text» in the main prompt is read by Seedream as scene description — possibly even adding a watermark. All bans go into the platform's separate negative_prompt field. When that field isn't available, phrase positively: «no cluttered» → «clean background».",
      },
      {
        title: "Conflicting styles",
        explain:
          "«Photorealistic oil painting watercolor cartoon» — the model has no idea which game to play. Pick one dominant style plus at most one secondary modifier. «Photorealistic with subtle film grain» works; «realistic cartoon sketch» does not.",
      },
      {
        title: "Adjective overload",
        explain:
          "Twenty weak descriptors («beautiful, nice, gorgeous, stunning, amazing, breathtaking») work worse than 3–5 strong concrete ones («Rembrandt lighting, 85mm lens, shallow depth of field, golden hour, weathered leather»). Specifics always beat generic admiration words.",
      },
      {
        title: "No style specified",
        explain:
          "Without an explicit style Seedream picks at random: photorealism one time, illustration the next, 3D render after that. Style is a required element. Minimum: «photorealistic», «cinematic», «watercolor», «oil painting» — one of these has to be in every prompt.",
      },
    ],
    faq: [
      {
        q: "Which Seedream version is best for production?",
        a: "For production work — Seedream 4.5 or 5 Lite. Version 4.0 is a stable baseline but weaker on in-image text and spatial relationships. Version 4.5 is significantly stronger on multi-element scenes and text rendering. Version 5 Lite is the freshest, with improved hand anatomy and support for longer prompts.",
      },
      {
        q: "Can I write prompts in Russian or Chinese?",
        a: "All Seedream versions are optimized for English — that is the stable reference. Versions 5 Lite and 4.5 also support Chinese. Russian is accepted but less predictable. For production prompts we recommend English; for experiments any language works. The --ar aspect ratio parameter works universally.",
      },
      {
        q: "What is the optimal prompt length?",
        a: "30–100 words for all versions. Under 5 words — the model fills in too much and the result is unpredictable. Over 150 words — the model loses focus and priorities drift. Version 5 Lite handles long prompts up to 120 words, but even for it 30–100 is the sweet spot. Five precise descriptors beat twenty generic ones.",
      },
      {
        q: "How do I control lighting?",
        a: "Use concrete photography terms: «Rembrandt lighting», «butterfly lighting», «split lighting», «loop lighting». The model knows these schemes. Time of day — «golden hour», «blue hour», «overcast», «noon». Quality — «soft diffused», «dramatic side lighting», «high-key», «low-key», «volumetric light». A generic «good lighting» performs worse than any concrete scheme.",
      },
      {
        q: "Does Seedream support text rendering?",
        a: "It does, but quality scales by version. In 4.0 — basic, short words and simple fonts. In 4.5 — good, readable posters and signs. In 5 Lite — excellent, long strings and complex typography. Rules: text in quotes («text \"YOUR TEXT\"»), explicit font style («bold sans-serif»), explicit placement («centered at top»). Without quotes the model may mangle letters.",
      },
      {
        q: "How do I use the --ar aspect ratio?",
        a: "The --ar parameter goes at the end of the prompt: «--ar 16:9» for landscape, «--ar 9:16» for mobile, «--ar 1:1» for square, «--ar 2:3» for posters, «--ar 4:5» for social portrait. Platforms vary in how they handle --ar (fal.ai parses it, syntx.ai too); if it doesn't work, switch to the platform's native aspect_ratio control in the UI.",
      },
      {
        q: "Does Opten support the Seedream family?",
        a: "Yes, the Opten extension detects every Seedream version inside fal.ai, syntx.ai, YouMind, and flux-ai.io. It scores prompts against the shared family structure: checks for subject at the start, presence of style, lighting correctness, separation of positive and negative, quotes around text for rendering. One click gives you a rewrite tailored to whichever specific Seedream version is currently open.",
      },
    ],
  },
};
