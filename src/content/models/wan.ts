// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for wan.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Wan: структура, ошибки, примеры",
    description:
      "Как писать промпты для Wan от Alibaba: естественный язык с конкретикой, освещение и камера, режим Image-to-Image, частые ошибки и подробные примеры до и после.",
    h1: "Wan: как писать промпты, которые модель понимает",
    intro:
      "Wan — открытая T2I-модель от Alibaba, доступная через fal.ai, Replicate и для локального запуска. Принимает промпты на естественном языке с конкретными деталями субъекта, среды, освещения и камеры. Английский даёт самые стабильные результаты, китайский тоже поддерживается. Рекомендуемая длина промпта — 30-100 токенов.",
    sections: [
      {
        heading: "Что умеет Wan",
        body:
          "Wan генерирует изображения в двух режимах: Text-to-Image (T2I) и Image-to-Image (I2I). Текущие версии — Wan 2.5 и Wan 2.6. Максимальное разрешение зависит от платформы, типично до 1024×1024. Модель открытая (open-source) — её можно запускать локально на consumer GPU при наличии достаточного VRAM, либо использовать через API-платформы fal.ai и Replicate.\n\nИз-за открытой природы модели нет специализированных параметров Midjourney-style (`--ar`, `--s`, `::weight`) — всё управляется текстом промпта плюс настройками платформы (разрешение, seed, steps, guidance scale, strength для I2I). Лимит промпта около 500 токенов, но оптимальный диапазон для стабильного результата — 30-100 токенов. Длиннее — детали начинают конфликтовать, модель теряет фокус.",
        bullets: [
          "Text-to-Image и Image-to-Image режимы",
          "Версии Wan 2.5 и Wan 2.6, открытая модель",
          "Платформы: fal.ai, Replicate, локальный запуск",
          "Оптимальный промпт: 30-100 токенов, лимит ~500",
          "Параметры — через настройки платформы, не через флаги",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Субъект] + [Детали субъекта] + [Контекст/Среда] + [Стиль/Настроение] + [Освещение] + [Композиция/Камера].\n\nКлючевой принцип — естественный язык с конкретными деталями. Wan хорошо понимает связные описательные промпты, хуже — хаотичные списки тегов через запятую. Главное: субъект всегда в начале. «A young woman in a flowing white dress standing on a rocky cliff» — модель сначала строит фигуру, потом дополняет среду. «Beautiful cinematic photo of...» — модель сначала ловит «cinematic photo» как стиль, и субъект уходит на второй план.\n\nПример сильного промпта: «A young woman in a flowing white dress standing on a rocky cliff overlooking the ocean at sunset, wind blowing her hair, warm golden light, cinematic composition, photorealistic, 85mm lens, shallow depth of field». Здесь субъект → среда → освещение → стиль → оптика — каждый блок добавляет информации, не конфликтуя с другими.",
      },
      {
        heading: "Освещение, камера, стиль",
        body:
          "Освещение задавай через тип света и направление, не через яркость:\n• Естественное: golden hour, natural sunlight, soft daylight, overcast.\n• Студийное: studio lighting, softbox, Rembrandt lighting.\n• Драматичное: dramatic lighting, rim light, backlight, chiaroscuro.\n• Атмосферное: volumetric light, fog, god rays, haze.\n• Неоновое: neon glow, neon reflections, cyberpunk lighting.\n\nКамера и оптика — Wan понимает фотографические термины:\n• Объективы: 85mm, 35mm lens, wide-angle, macro, telephoto.\n• Ракурс: bird's eye view, low angle, Dutch angle, eye level, worm's eye.\n• Крупность: extreme close-up, close-up, medium shot, wide shot, full body.\n• Глубина: shallow depth of field, bokeh, tilt-shift, deep focus.\n\nХудожественные стили — photorealistic, hyperrealistic, editorial photography, RAW photo, oil painting, watercolor, impressionist, digital painting, vector art, flat design, minimalist, pixel art, 3D render, CGI, unreal engine, octane render, cinematic, film still, anime style, manga, cel shading.",
      },
      {
        heading: "Image-to-Image: контроль через strength",
        body:
          "В I2I-режиме модель использует входное изображение как старт, а промпт описывает желаемый результат. Главный параметр — strength (или denoising strength) — контролирует, насколько сильно промпт влияет относительно исходного изображения. Низкий strength (0.2-0.4) — минимальные правки, сохраняется композиция и большая часть деталей. Средний (0.5-0.7) — заметные изменения стиля, освещения, цвета при сохранении структуры. Высокий (0.8+) — почти полная переинтерпретация, промпт становится главным источником.\n\nКлючевое правило: промпт описывает ЖЕЛАЕМЫЙ РЕЗУЛЬТАТ, не исходное изображение. «A painted portrait in oil painting style, dramatic side lighting, warm tones» — модель применит эти трансформации к исходному фото. Если в промпте описывать то, что и так на фото, эффекта не будет. Для радикальных изменений увеличивай strength, для деликатной коррекции — уменьшай.",
      },
      {
        heading: "Что НЕ работает в Wan",
        body:
          "Wan не понимает синтаксис Midjourney или Stable Diffusion с параметрами. Флаги вида `--ar 16:9`, `--style raw`, веса `(keyword:1.2)`, негативные через `::-1` — попадают в промпт как буквальный текст и засоряют описание. Размер задавай в настройках платформы, веса регулируй порядком слов (важное — в начало), стили — обычными прилагательными.\n\nСпам качества — «beautiful, stunning, 8k, detailed, masterpiece, best quality, ultra HD» — засоряет промпт без реальной пользы. Эти слова статистически бессмысленны для Wan и часто конфликтуют между собой. Заменяй конкретикой: вместо «8k detailed masterpiece» — «sharp focus, fine detail visible, natural texture».\n\nНегативные формулировки в основном промпте («no watermark, no text, no people») работают плохо — модель часто включает то, что просили исключить. Используй negative prompt в настройках платформы, если она поддерживает. В основном промпте — только позитивные описания того, что должно быть.",
      },
    ],
    examples: [
      {
        before: "a beautiful landscape",
        after:
          "A majestic snow-covered mountain peak under a sky of swirling aurora borealis, deep purple and emerald green light bands above. Foreground: a solitary pine tree on a frozen lake reflecting the colors. Wide-angle landscape composition, low angle looking up. Cinematic lighting, hyperrealistic, sharp focus, fine detail visible in the ice and snow texture. 24mm lens, deep focus.",
        note:
          "Конкретный субъект, явный передний план, описание цветов вместо «beautiful», камера и оптика, стиль через «hyperrealistic» вместо «8k masterpiece».",
      },
      {
        before: "elderly man portrait",
        after:
          "An elderly fisherman with deeply weathered skin, a thick white beard, and piercing blue eyes, wearing a worn navy wool sweater. He sits on a wooden bench, hands folded in his lap. Soft window light from screen-left creating Rembrandt lighting on his face, warm golden tones. Background: out-of-focus harbor with fishing boats. Editorial portrait photography, 85mm lens, shallow depth of field, photorealistic.",
        note:
          "Конкретные детали внешности, явный сетап освещения с направлением (Rembrandt lighting), оптика, стилистический референс «editorial portrait photography».",
      },
      {
        before: "futuristic city at night",
        after:
          "A neon-soaked cyberpunk Tokyo street at midnight, rain-soaked asphalt reflecting magenta and cyan signs, holographic advertisements floating above traffic. Crowds of people in dark clothing crossing under giant LED screens. Wide-angle low-angle shot looking up between skyscrapers. Cyberpunk lighting with strong neon glow, deep shadows, volumetric haze. Cinematic, film still, sharp focus on the foreground signs, soft bokeh on background lights. 35mm lens, dramatic perspective.",
        note:
          "Конкретный сеттинг и время, цветовые якоря через названия цветов, объёмная атмосфера, явное освещение и оптика. «Cyberpunk» работает как стиль без спама качества.",
      },
    ],
    mistakes: [
      {
        title: "Спам словами качества",
        explain:
          "«Beautiful, stunning, 8k, detailed, masterpiece, best quality, ultra HD, award winning» — засоряет промпт без реальной пользы. Эти слова статистически бессмысленны для Wan и конфликтуют между собой. Заменяй конкретикой: «sharp focus, fine detail visible, natural texture, hyperrealistic, editorial photography». Конкретные параметры работают.",
      },
      {
        title: "Стиль или прилагательные в начале вместо субъекта",
        explain:
          "«Beautiful cinematic photo of a woman» — модель сначала ловит «beautiful cinematic photo» как стиль, и субъект становится вторичным. Правильно: «A young woman with auburn hair... beautiful cinematic photo style». Самое важное — субъект с деталями — должно быть в первом предложении промпта.",
      },
      {
        title: "Хаотичный список тегов через запятую",
        explain:
          "«woman, red dress, sunset, beach, ocean, sand, beautiful, photo, cinematic, 4k, detail» — Wan хуже понимает несвязные списки, чем естественные описательные предложения. Заменяй на связный текст: «A woman in a red dress walking along a sandy beach at sunset, ocean waves behind her. Cinematic photography, warm tones.».",
      },
      {
        title: "Противоречивые инструкции",
        explain:
          "«Dark and moody, bright and cheerful, cool blue tones, warm golden light» — модель не может выполнить противоречие и либо игнорирует часть, либо выдаёт смешанный результат с провалами. Выбирай одно направление настроения и придерживайся его. Если нужны разные настроения, генерируй разные изображения.",
      },
      {
        title: "Синтаксис Midjourney или SD",
        explain:
          "Параметры вида `--ar 16:9`, `--style raw`, веса `(beautiful:1.5)`, `::weight` — не работают в Wan и попадают в промпт как буквальный текст. Размер задавай в настройках платформы, веса регулируй порядком слов (важное — в начало), стили — нормальными прилагательными в естественном языке.",
      },
    ],
    faq: [
      {
        q: "Какие версии Wan существуют?",
        a: "Текущие версии — Wan 2.5 и Wan 2.6 от команды Wan-AI / Alibaba. Это открытые (open-source) модели, доступные через API-платформы fal.ai и Replicate, а также для локального запуска. На уровне промптинга подходы между версиями совпадают: естественный язык, субъект в начале, конкретика вместо абстракций. Детали и качество улучшаются от версии к версии.",
      },
      {
        q: "Какой оптимальный размер промпта для Wan?",
        a: "Рекомендуемый диапазон — 30-100 токенов (примерно 25-80 слов). Это даёт пространство для описания субъекта, среды, освещения и стиля без перегрузки. Лимит модели — около 500 токенов, но промпты длиннее 100 токенов начинают терять фокус: детали конфликтуют, модель смешивает приоритеты. Для очень детальных задач лучше брать другую модель.",
      },
      {
        q: "Можно ли писать промпты на русском или китайском?",
        a: "Английский даёт наиболее стабильные результаты, особенно для фотографических и стилистических терминов. Китайский тоже поддерживается нативно — Wan тренировался на bilingual датасетах. Русский технически работает, но качество ниже: некоторые описательные конструкции и термины модель интерпретирует менее точно. Для production-задач рекомендуется английский.",
      },
      {
        q: "Как использовать Image-to-Image режим?",
        a: "Загружаешь исходное изображение и пишешь промпт, описывающий ЖЕЛАЕМЫЙ РЕЗУЛЬТАТ. Главный параметр — strength (denoising strength): низкий (0.2-0.4) — минимальные правки, средний (0.5-0.7) — изменения стиля и цвета, высокий (0.8+) — почти полная переинтерпретация. Промпт НЕ должен описывать содержимое исходного фото — фокус на трансформации.",
      },
      {
        q: "Поддерживает ли Wan негативные промпты?",
        a: "Да, через настройки платформы (fal.ai, Replicate, локальный запуск) — большинство интерфейсов поддерживают отдельное поле negative prompt. Туда указывай то, что НЕ должно быть в изображении: «watermark, text, blurry, low quality, deformed». В основном промпте не используй негативных формулировок — они работают хуже, чем отдельное поле.",
      },
      {
        q: "Почему результаты выглядят менее качественно, чем у Midjourney?",
        a: "Wan — открытая модель с меньшей тренировочной базой и без специализированных post-training optimizations, которые делают Midjourney «красивым из коробки». Wan даёт больше контроля и гибкости (можно запускать локально, fine-tunить под LoRA, использовать ControlNet), но требует более точных промптов. Не стилизуй абстрактно «beautiful» — описывай конкретные параметры света, оптики и палитры.",
      },
      {
        q: "Поддерживается ли Opten для Wan?",
        a: "Да, расширение Opten распознаёт Wan на платформах fal.ai и Replicate и оценивает промпты по структуре, описанной выше: проверяет наличие конкретного субъекта в начале, естественную языковую структуру вместо тегов, конкретное освещение и оптику, отсутствие спама качества и Midjourney-синтаксиса. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Wan Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Alibaba's Wan: natural language with specifics, lighting, camera, Image-to-Image, common mistakes, and before/after examples.",
    h1: "Wan: how to write prompts the model actually understands",
    intro:
      "Wan is Alibaba's open-source T2I model, available via fal.ai, Replicate, and for local execution. It accepts natural language prompts with concrete subject, environment, lighting, and camera details. English gives the most stable results, Chinese is also supported. Recommended prompt length is 30-100 tokens.",
    sections: [
      {
        heading: "What Wan does",
        body:
          "Wan generates images in two modes: Text-to-Image (T2I) and Image-to-Image (I2I). Current versions are Wan 2.5 and Wan 2.6. Maximum resolution depends on the platform, typically up to 1024×1024. The model is open-source — you can run it locally on consumer GPUs with sufficient VRAM, or use it through API platforms like fal.ai and Replicate.\n\nBecause of the open nature there are no Midjourney-style proprietary parameters (`--ar`, `--s`, `::weight`) — everything is controlled by prompt text plus platform settings (resolution, seed, steps, guidance scale, strength for I2I). The model's prompt limit is around 500 tokens, but the sweet spot for stable results is 30-100 tokens. Beyond that, details start to conflict and the model loses focus.",
        bullets: [
          "Text-to-Image and Image-to-Image modes",
          "Wan 2.5 and Wan 2.6 versions, open-source model",
          "Platforms: fal.ai, Replicate, local execution",
          "Optimal prompt: 30-100 tokens, limit ~500",
          "Parameters via platform settings, not flags",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject] + [Subject details] + [Context/Environment] + [Style/Mood] + [Lighting] + [Composition/Camera].\n\nThe key principle is natural language with concrete details. Wan understands coherent descriptive prompts well; it handles chaotic comma-separated tag lists less well. The crucial point: the subject always comes first. «A young woman in a flowing white dress standing on a rocky cliff» — the model builds the figure first, then layers the environment. «Beautiful cinematic photo of...» — the model latches onto «cinematic photo» as the style first, and the subject becomes secondary.\n\nExample of a strong prompt: «A young woman in a flowing white dress standing on a rocky cliff overlooking the ocean at sunset, wind blowing her hair, warm golden light, cinematic composition, photorealistic, 85mm lens, shallow depth of field». Subject → environment → lighting → style → optics — each block adds information without conflicting with the others.",
      },
      {
        heading: "Lighting, camera, style",
        body:
          "Set lighting through type and direction, not brightness:\n• Natural: golden hour, natural sunlight, soft daylight, overcast.\n• Studio: studio lighting, softbox, Rembrandt lighting.\n• Dramatic: dramatic lighting, rim light, backlight, chiaroscuro.\n• Atmospheric: volumetric light, fog, god rays, haze.\n• Neon: neon glow, neon reflections, cyberpunk lighting.\n\nCamera and optics — Wan understands photographic terms:\n• Lenses: 85mm, 35mm lens, wide-angle, macro, telephoto.\n• Angle: bird's eye view, low angle, Dutch angle, eye level, worm's eye.\n• Shot size: extreme close-up, close-up, medium shot, wide shot, full body.\n• Depth: shallow depth of field, bokeh, tilt-shift, deep focus.\n\nArt styles — photorealistic, hyperrealistic, editorial photography, RAW photo, oil painting, watercolor, impressionist, digital painting, vector art, flat design, minimalist, pixel art, 3D render, CGI, unreal engine, octane render, cinematic, film still, anime style, manga, cel shading.",
      },
      {
        heading: "Image-to-Image: control via strength",
        body:
          "In I2I mode the model uses the input image as a starting point, and the prompt describes the desired result. The main parameter is strength (or denoising strength) — it controls how much the prompt influences the output versus the source. Low strength (0.2-0.4) — minimal edits, composition and most details are preserved. Medium (0.5-0.7) — noticeable changes to style, lighting, color while keeping the structure. High (0.8+) — near-complete reinterpretation, the prompt becomes the primary source.\n\nKey rule: the prompt describes the DESIRED RESULT, not the input image. «A painted portrait in oil painting style, dramatic side lighting, warm tones» — the model applies those transformations to the input photo. Describing what is already in the photo has no effect. For radical changes raise strength, for subtle correction lower it.",
      },
      {
        heading: "What does NOT work in Wan",
        body:
          "Wan does not understand Midjourney or Stable Diffusion proprietary syntax. Flags like `--ar 16:9`, `--style raw`, weights like `(keyword:1.2)`, negatives via `::-1` — end up in the prompt as literal text and clutter the description. Set size in the platform settings, weight words by order (important first), set styles via normal adjectives.\n\nQuality spam — «beautiful, stunning, 8k, detailed, masterpiece, best quality, ultra HD» — clutters the prompt without real benefit. These words are statistically meaningless to Wan and often conflict with each other. Replace them with specifics: instead of «8k detailed masterpiece» — «sharp focus, fine detail visible, natural texture».\n\nNegative phrasing in the main prompt («no watermark, no text, no people») works poorly — the model often includes what you asked to exclude. Use the negative prompt field in platform settings if available. In the main prompt, only positive descriptions of what should be present.",
      },
    ],
    examples: [
      {
        before: "a beautiful landscape",
        after:
          "A majestic snow-covered mountain peak under a sky of swirling aurora borealis, deep purple and emerald green light bands above. Foreground: a solitary pine tree on a frozen lake reflecting the colors. Wide-angle landscape composition, low angle looking up. Cinematic lighting, hyperrealistic, sharp focus, fine detail visible in the ice and snow texture. 24mm lens, deep focus.",
        note:
          "Concrete subject, explicit foreground, color description instead of «beautiful», camera and optics, style via «hyperrealistic» rather than «8k masterpiece».",
      },
      {
        before: "elderly man portrait",
        after:
          "An elderly fisherman with deeply weathered skin, a thick white beard, and piercing blue eyes, wearing a worn navy wool sweater. He sits on a wooden bench, hands folded in his lap. Soft window light from screen-left creating Rembrandt lighting on his face, warm golden tones. Background: out-of-focus harbor with fishing boats. Editorial portrait photography, 85mm lens, shallow depth of field, photorealistic.",
        note:
          "Concrete appearance details, explicit lighting setup with direction (Rembrandt lighting), optics, stylistic reference «editorial portrait photography».",
      },
      {
        before: "futuristic city at night",
        after:
          "A neon-soaked cyberpunk Tokyo street at midnight, rain-soaked asphalt reflecting magenta and cyan signs, holographic advertisements floating above traffic. Crowds of people in dark clothing crossing under giant LED screens. Wide-angle low-angle shot looking up between skyscrapers. Cyberpunk lighting with strong neon glow, deep shadows, volumetric haze. Cinematic, film still, sharp focus on the foreground signs, soft bokeh on background lights. 35mm lens, dramatic perspective.",
        note:
          "Specific setting and time, color anchors via color names, layered atmosphere, explicit lighting and optics. «Cyberpunk» works as a style without quality spam.",
      },
    ],
    mistakes: [
      {
        title: "Spamming quality keywords",
        explain:
          "«Beautiful, stunning, 8k, detailed, masterpiece, best quality, ultra HD, award winning» — clutters the prompt without real benefit. These words are statistically meaningless to Wan and conflict with each other. Replace with specifics: «sharp focus, fine detail visible, natural texture, hyperrealistic, editorial photography». Concrete parameters work.",
      },
      {
        title: "Style or adjectives at the start instead of subject",
        explain:
          "«Beautiful cinematic photo of a woman» — the model latches onto «beautiful cinematic photo» as the style first, and the subject becomes secondary. The right pattern: «A young woman with auburn hair... beautiful cinematic photo style». The most important thing — subject with details — should appear in the first sentence of the prompt.",
      },
      {
        title: "Chaotic comma-separated tag lists",
        explain:
          "«woman, red dress, sunset, beach, ocean, sand, beautiful, photo, cinematic, 4k, detail» — Wan handles incoherent lists worse than natural descriptive sentences. Replace with coherent text: «A woman in a red dress walking along a sandy beach at sunset, ocean waves behind her. Cinematic photography, warm tones.».",
      },
      {
        title: "Conflicting instructions",
        explain:
          "«Dark and moody, bright and cheerful, cool blue tones, warm golden light» — the model cannot honor a contradiction and either ignores part of it or produces a mixed result with breakdowns. Pick one mood direction and stick with it. If you need different moods, generate separate images.",
      },
      {
        title: "Midjourney or SD syntax",
        explain:
          "Parameters like `--ar 16:9`, `--style raw`, weights `(beautiful:1.5)`, `::weight` — do not work in Wan and end up in the prompt as literal text. Set size in platform settings, weight words by order (important first), set styles via normal adjectives in natural language.",
      },
    ],
    faq: [
      {
        q: "Which Wan versions exist?",
        a: "Current versions are Wan 2.5 and Wan 2.6 from the Wan-AI / Alibaba team. These are open-source models available through fal.ai and Replicate API platforms, and for local execution. At the prompting level the approach is consistent across versions: natural language, subject first, specifics over abstractions. Quality and detail improve from version to version.",
      },
      {
        q: "What is the optimal prompt size for Wan?",
        a: "The recommended range is 30-100 tokens (roughly 25-80 words). That gives room for subject, environment, lighting, and style without overloading. The model's hard limit is around 500 tokens, but prompts beyond 100 start losing focus: details conflict and the model mixes priorities. For very detailed work consider a different model.",
      },
      {
        q: "Can I write prompts in Russian or Chinese?",
        a: "English gives the most stable results, especially for photographic and stylistic terminology. Chinese is also natively supported — Wan was trained on bilingual datasets. Russian technically works, but quality is lower: some descriptive constructions and terms are interpreted less precisely. For production work English is recommended.",
      },
      {
        q: "How do I use Image-to-Image mode?",
        a: "Upload a source image and write a prompt that describes the DESIRED RESULT. The main parameter is strength (denoising strength): low (0.2-0.4) — minimal edits, medium (0.5-0.7) — changes to style and color, high (0.8+) — near-complete reinterpretation. The prompt should NOT describe the contents of the source photo — focus on the transformation.",
      },
      {
        q: "Does Wan support negative prompts?",
        a: "Yes, through platform settings (fal.ai, Replicate, local execution) — most interfaces expose a separate negative prompt field. Put there what should NOT appear in the image: «watermark, text, blurry, low quality, deformed». Do not use negative phrasing inside the main prompt — it works worse than a dedicated field.",
      },
      {
        q: "Why do results look less polished than Midjourney?",
        a: "Wan is an open model with a smaller training base and without the specialized post-training optimizations that make Midjourney «pretty by default». Wan gives you more control and flexibility (local execution, LoRA fine-tuning, ControlNet), but demands more precise prompts. Do not lean on abstract «beautiful» — describe concrete light, optics, and palette parameters.",
      },
      {
        q: "Does Opten support Wan?",
        a: "Yes, the Opten extension detects Wan on fal.ai and Replicate and scores prompts against the structure outlined above: it checks for a concrete subject up front, natural language instead of tag lists, concrete lighting and optics, and the absence of quality spam and Midjourney syntax. One click gives you a rewrite in the right structure.",
      },
    ],
  },
};
