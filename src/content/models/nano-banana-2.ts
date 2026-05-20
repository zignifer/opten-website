// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for nano-banana-2.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Nano Banana 2: структура, ошибки, примеры",
    description:
      "Как писать промпты для Nano Banana 2 от Google: структура полных предложений, рендеринг текста, диалоговое редактирование, типичные ошибки и примеры до/после.",
    h1: "Nano Banana 2: как писать промпты, которые модель понимает",
    intro:
      "Nano Banana 2 — image-модель Google в Gemini API второго поколения, до 2K с базовым thinking mode и поддержкой до 6 референсов. Модель понимает естественный язык и полные описательные предложения как бриф художника, а не «tag soup». Английский — основной язык; диалоговое редактирование поддерживается.",
    sections: [
      {
        heading: "Что умеет Nano Banana 2",
        body:
          "Модель оптимизирована под коммерчески яркую эстетику Google: тёплая палитра, насыщенные цвета, чистая композиция. Сильна на портретных close-up'ах — заметно меньше uncanny valley, чем у Pro, и более естественная текстура кожи с порами и микро-несовершенствами. Хорошо отрабатывает плёночные стили (Kodak Portra 400, 35mm), ретро-эпохи 1990s/2000s, селфи и social media-контент.\n\nДля простого редактирования есть диалоговый режим — правки в рамках сессии нормальны. Базовый рендеринг текста работает для коротких надписей (1-3 слова); плотный текст и инфографику лучше отдавать Pro или GPT Image 2.",
        bullets: [
          "До 2K, до 6 референсных изображений за запрос",
          "Естественный язык, полные предложения, бриф вместо тегов",
          "Базовый thinking mode + базовый Google Search grounding",
          "Сильные стороны: портреты, селфи, плёночный реализм, candid",
          "3-5x быстрее и ~25% от стоимости Pro — модель для итераций",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Субъект с деталями] + [Сцена/Окружение] + [Освещение/Настроение] + [Стиль] + [Камера (опционально)] + [Формат].\n\nГлавное правило — конкретность субъекта. Вместо «девушка на улице» — «молодая женщина с короткими рыжими волосами в джинсовой куртке стоит на перекрёстке токийской улицы вечером, уличные фонари создают тёплые блики на мокром асфальте». Промпт меньше 10 слов модель додумает по-своему, и результат будет генерик.\n\nКонтекст назначения (для чего изображение — обложка альбома, аватар, рекламный баннер) помогает модели принимать стилистические решения автоматически. Это особенность Google-семейства — она «думает» о цели, а не только о визуале.",
      },
      {
        heading: "Естественный язык, не tag soup",
        body:
          "Tag soup в стиле Midjourney («woman, paris, cafe, golden, 4k, realistic») критически снижает качество. Nano Banana 2 обучена на описательных текстах и ожидает связные предложения. Это та же логика, что и у gpt-image-2 и Pro-версии — пиши как креативный директор, диктующий бриф фотографу.\n\nПараметры вида `--ar 16:9`, `::weight`, `(keyword:1.2)`, BREAK не работают и попадают в текст промпта как мусор. Формат задавай словами («16:9», «portrait», «square»), вес идей — порядком (важное в начало), стили — нормальными прилагательными.",
      },
      {
        heading: "Редактирование и over-edit",
        body:
          "Диалоговое редактирование — основной режим для правок. Если изображение готово на 80%, не генерируй заново: «отлично, теперь смени фон на закатный и сделай куртку тёмно-синей». Модель помнит контекст сессии.\n\nИзвестная слабость — over-edit при загруженных референсах: NB2 склонна «улучшать» рефренс, даже когда просили сохранить как есть. Лекарство — эксплицитный preserve-блок: «keep identity 100% — do not stylize, no enhancement, do not airbrush skin». Для портретов с реальной кожей это критично — без блока модель сгладит поры и сделает «глянцевое» лицо.",
      },
      {
        heading: "Когда NB2, а когда Pro",
        body:
          "NB2 — не «урезанная Pro», это другой инструмент. Бери NB2 для: одиночных портретных close-up'ов (меньше uncanny valley), макро-кожи и реалистичных глаз, селфи, candid-фотографии, real-time web grounding в Flash-режиме, экстремальных пропорций (4:1, 8:1), массовой итерации (10 вариантов перед финалом).\n\nПереключайся на Pro для: 4+ персонажей в кадре, hero brand assets, плотного текста на постерах/упаковке/инфографике, ray-traced освещения и сложных отражений, серий с consistency на 9-10 кадров, 10+ референсов и структурного контроля по скетчам.",
      },
    ],
    examples: [
      {
        before:
          "красивая девушка в кафе",
        after:
          "A young woman in her late twenties with short auburn hair and freckles, wearing a worn olive-green linen shirt, sitting at a small marble café table in Lisbon, sipping espresso. Soft afternoon light spills through the window, warm muted tones, shallow depth of field. Shot on 35mm film, Kodak Portra 400, natural grain, visible pores, no airbrush look. Editorial documentary style.",
        note:
          "Конкретный субъект, конкретная локация, конкретное освещение и плёночный стек. Указание «no airbrush» — анти-glamour стоп-команда, без неё NB2 сгладит кожу.",
      },
      {
        before:
          "сделай фон темнее",
        after:
          "Keep the subject and pose exactly as is. Change only the background: from the bright café window to a moody, dim interior with warm tungsten lamp light in the far corner. Preserve: face, identity, skin texture, hair, clothing, camera angle, framing. No re-styling of the person, no airbrushing, no over-saturation.",
        note:
          "Диалоговая правка с явным preserve-блоком. Без него NB2 «улучшит» заодно и лицо, заглаживая текстуру кожи — это её хрестоматийный over-edit.",
      },
      {
        before:
          "стильный аватар для соцсетей",
        after:
          "Square 1:1 social media avatar for an indie illustrator. Mid-shot of a young man with curly black hair and round tortoise-shell glasses, wearing a mustard knit sweater, faint smile, natural relaxed posture. Soft north-window light, neutral grey background, warm color grade. Style: editorial portrait with subtle 2000s digital camera feel, natural skin texture with visible pores, no glamour retouch.",
        note:
          "Назначение («social media avatar for an indie illustrator») активирует у NB2 нужный режим. Указан формат, эпоха камеры и явный отказ от ретуши.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup вместо предложений",
        explain:
          "«woman, paris, cafe, golden, 4k, realistic» — устаревший синтаксис Midjourney/SD. Nano Banana 2 обучена на описательных текстах и при tag soup даёт обобщённый, неточный результат. Пиши связные предложения как бриф для фотографа — это удваивает качество на тех же словах.",
      },
      {
        title: "Слишком короткий промпт (<10 слов)",
        explain:
          "«Девушка в кафе» — модель додумает всё остальное по статистике обучающей выборки. Получишь обобщённую блондинку в обобщённом Старбаксе с обобщённым латте. Минимальный рабочий промпт — субъект с деталями + сцена + стиль. Это ~25-40 слов как стартовая точка.",
      },
      {
        title: "Описание содержимого при I2I редактировании",
        explain:
          "При диалоговой правке не пересказывай картинку. Модель её видит. Промпт «на фото девушка в кафе, поменяй фон» бесполезен — пиши только «change only the background to...». Описание содержимого тратит токены и иногда конфликтует с тем, что модель уже считала с изображения.",
      },
      {
        title: "Отсутствие preserve-блока при правках",
        explain:
          "NB2 склонна к over-edit на референсах — «улучшает» сверх просьбы. «Поменяй фон» без «preserve: face, identity, skin texture» в большинстве случаев меняет ещё и кожу, заглаживая поры до глянца. Каждая правка должна заканчиваться явным preserve-списком — это известная слабость модели.",
      },
      {
        title: "Использование NB2 для плотного текста и сложных сцен",
        explain:
          "Постеры с длинным текстом, инфографика, упаковка, 4+ персонажа в кадре — это домен Pro или GPT Image 2. NB2 справляется с короткими надписями (1-3 слова) и одиночными портретами. На сложных задачах модель путает идентичности и ломает плотный текст — это не баг промпта, а архитектурный потолок версии.",
      },
    ],
    faq: [
      {
        q: "Чем Nano Banana 2 отличается от Nano Banana Pro?",
        a: "NB2 — это 2K, до 6 референсов, базовый thinking mode и базовый рендер текста. Pro — это 4K, до 14 референсов (6 high fidelity), полный thinking с промежуточными изображениями и SOTA-рендер текста. Но NB2 не «урезанная Pro»: на портретных close-up'ах, селфи, макро-коже и candid-фото NB2 объективно даёт более естественный результат — меньше uncanny valley и AI-глянца.",
      },
      {
        q: "Почему NB2 заглаживает кожу даже когда я не прошу?",
        a: "Это её главная слабость — over-edit при загруженных референсах. Модель «помогает» сверх просьбы: разглаживает поры, убирает несовершенства, добавляет глянец. Лекарство — эксплицитный preserve-блок: «keep identity 100% — do not stylize, no enhancement, do not airbrush skin, preserve natural pores and texture». Это стек, который надо повторять на каждой итерации редактирования.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Технически да, NB2 поддерживает мультиязычность, но Google оптимизировала модель под английский — это её родной язык обучения. На сложных промптах с русским будут менее предсказуемые результаты. Рекомендация: основная масса промпта на английском, текст внутри изображения можно просить на любом языке (кириллица, CJK поддерживаются, но в Pro лучше).",
      },
      {
        q: "Когда выбрать NB2, а когда Pro?",
        a: "NB2 — для одиночных портретов, селфи, макро-кожи, candid-документалки, экстремальных пропорций (4:1, 8:1), массовой итерации (10 вариантов перед финалом). Pro — для 4+ персонажей в кадре, hero-кампаний, плотного текста на постерах/упаковке, инфографики, ray-traced освещения, сториборда на 9-10 кадров и структурного контроля по скетчам. Не «выше = лучше», это разные инструменты.",
      },
      {
        q: "Поддерживается ли диалоговое редактирование?",
        a: "Да, и это рекомендуемый способ для мелких правок. Не пиши промпт заново ради смены освещения — попроси: «отлично, теперь смени свет на закатный и сделай куртку тёмно-синей, остальное оставь как есть». Модель помнит контекст сессии. Главное — всегда добавлять preserve-блок при правках, иначе NB2 «улучшит» лицо.",
      },
      {
        q: "Как добиться плёночного реализма без AI-глянца?",
        a: "Стек: «35mm film, Kodak Portra 400, natural grain, warm muted tones, shallow depth of field, golden hour» + анти-glamour лексика «no airbrush look, visible pores, weathered skin texture, no glamour retouch». Описывай реальные несовершенства — это контрвес коммерческому глянцу, в который NB2 уходит по дефолту. Указание эпохи камеры (1990s, 2000s) тоже помогает.",
      },
      {
        q: "Поддерживается ли Opten для Nano Banana 2?",
        a: "Да, расширение Opten автоматически распознаёт Nano Banana 2 в Google AI Studio и Gemini и оценивает промпты по структуре выше: проверяет конкретность субъекта, естественный язык вместо tag soup, наличие preserve-блока при редактировании, анти-glamour лексику для портретов. Одним кликом получаешь rewrite, который не уйдёт в коммерческий глянец и сохранит текстуру кожи.",
      },
    ],
  },
  en: {
    title: "Nano Banana 2 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Google's Nano Banana 2: full-sentence structure, text rendering, conversational editing, common mistakes, and before/after examples.",
    h1: "Nano Banana 2: how to write prompts the model actually understands",
    intro:
      "Nano Banana 2 is Google's second-generation image model in the Gemini API, with up to 2K resolution, basic thinking mode, and support for up to 6 reference images. It reads prompts as a designer brief in natural language — not tag soup. English is the primary language; conversational editing is supported.",
    sections: [
      {
        heading: "What Nano Banana 2 does well",
        body:
          "The model is tuned toward Google's commercially bright aesthetic: warm palette, saturated colors, clean composition. It excels at portrait close-ups — noticeably less uncanny valley than Pro and more natural skin texture with pores and micro-imperfections. Film stocks (Kodak Portra 400, 35mm), retro eras (1990s, 2000s), selfies, and social-media content are all sweet spots.\n\nFor light editing there's a conversational mode — in-session tweaks are normal. Basic text rendering works for short labels (1-3 words); dense text and infographics are better handed off to Pro or GPT Image 2.",
        bullets: [
          "Up to 2K, up to 6 reference images per request",
          "Natural language, full sentences, brief instead of tags",
          "Basic thinking mode + basic Google Search grounding",
          "Strengths: portraits, selfies, film realism, candid documentary",
          "3-5x faster and ~25% the cost of Pro — the iteration model",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject with details] + [Scene/Setting] + [Lighting/Mood] + [Style] + [Camera (optional)] + [Format].\n\nThe main rule is subject specificity. Instead of «a girl on the street» — «a young woman with short red hair in a denim jacket stands at a Tokyo intersection in the evening, street lamps casting warm reflections on wet asphalt.» A prompt under 10 words gets filled in by the model's statistical mean, and the result is generic.\n\nPurpose context (what this image is for — album cover, avatar, ad banner) helps the model make style decisions automatically. This is a Google-family trait — it thinks about the goal, not just the visuals.",
      },
      {
        heading: "Natural language, not tag soup",
        body:
          "Tag soup in the Midjourney style («woman, paris, cafe, golden, 4k, realistic») critically degrades output. Nano Banana 2 was trained on descriptive text and expects connected sentences. Same logic as gpt-image-2 and the Pro version — write like a creative director briefing a photographer.\n\nParameters like `--ar 16:9`, `::weight`, `(keyword:1.2)`, BREAK don't work and end up as literal noise in the prompt. Set format with words («16:9», «portrait», «square»), weight ideas by order (important first), styles via normal adjectives.",
      },
      {
        heading: "Editing and over-edit",
        body:
          "Conversational editing is the primary mode for tweaks. If an image is 80% there, don't regenerate: «great, now switch the background to sunset and make the jacket dark blue.» The model remembers session context.\n\nKnown weakness — over-edit with loaded references: NB2 tends to «improve» the reference even when asked to keep it as-is. The fix is an explicit preserve block: «keep identity 100% — do not stylize, no enhancement, do not airbrush skin.» For portraits with real skin this is critical — without the block the model smooths pores into a glossy face.",
      },
      {
        heading: "When NB2, when Pro",
        body:
          "NB2 isn't a «stripped-down Pro» — it's a different tool. Reach for NB2 for: single portrait close-ups (less uncanny valley), macro skin and realistic eyes, selfies, candid photography, real-time web grounding in Flash mode, extreme aspect ratios (4:1, 8:1), mass iteration (10 variants before finalizing).\n\nSwitch to Pro for: 4+ characters in frame, hero brand assets, dense text on posters/packaging/infographics, ray-traced lighting and complex reflections, 9-10 frame storyboards with consistency, 10+ references, and structural control from sketches.",
      },
    ],
    examples: [
      {
        before: "pretty girl in a café",
        after:
          "A young woman in her late twenties with short auburn hair and freckles, wearing a worn olive-green linen shirt, sitting at a small marble café table in Lisbon, sipping espresso. Soft afternoon light spills through the window, warm muted tones, shallow depth of field. Shot on 35mm film, Kodak Portra 400, natural grain, visible pores, no airbrush look. Editorial documentary style.",
        note:
          "Concrete subject, concrete location, concrete lighting and a film stack. The «no airbrush» line is an anti-glamour stop signal — without it NB2 will smooth the skin.",
      },
      {
        before: "make the background darker",
        after:
          "Keep the subject and pose exactly as is. Change only the background: from the bright café window to a moody, dim interior with warm tungsten lamp light in the far corner. Preserve: face, identity, skin texture, hair, clothing, camera angle, framing. No re-styling of the person, no airbrushing, no over-saturation.",
        note:
          "A conversational edit with an explicit preserve block. Without it NB2 «improves» the face too, smoothing skin texture — that's its textbook over-edit.",
      },
      {
        before: "stylish social media avatar",
        after:
          "Square 1:1 social media avatar for an indie illustrator. Mid-shot of a young man with curly black hair and round tortoise-shell glasses, wearing a mustard knit sweater, faint smile, natural relaxed posture. Soft north-window light, neutral grey background, warm color grade. Style: editorial portrait with subtle 2000s digital camera feel, natural skin texture with visible pores, no glamour retouch.",
        note:
          "Purpose («social media avatar for an indie illustrator») activates the right mode in NB2. Format, camera era, and an explicit refusal of retouching are all specified.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup instead of sentences",
        explain:
          "«woman, paris, cafe, golden, 4k, realistic» is legacy Midjourney/SD syntax. Nano Banana 2 was trained on descriptive text and produces generic, unfocused results from tag soup. Write connected sentences as a brief for a photographer — that alone doubles quality on the same set of words.",
      },
      {
        title: "Prompt that's too short (<10 words)",
        explain:
          "«Girl in a café» — the model fills in everything else by the statistical average of training data. You'll get a generic blonde in a generic Starbucks with a generic latte. A minimum working prompt is subject with details + scene + style. That's ~25-40 words as a starting point.",
      },
      {
        title: "Describing the image during I2I editing",
        explain:
          "In conversational edits, don't restate what's in the picture. The model already sees it. A prompt like «in the photo there's a girl in a café, change the background» wastes tokens — just say «change only the background to...» Restating content sometimes conflicts with what the model has already parsed from the reference.",
      },
      {
        title: "No preserve block on edits",
        explain:
          "NB2 over-edits references — it «improves» beyond the request. «Change the background» without «preserve: face, identity, skin texture» usually changes the skin too, smoothing pores into gloss. Every edit should end with an explicit preserve list — this is a known model weakness, not a prompt failure.",
      },
      {
        title: "Using NB2 for dense text and complex scenes",
        explain:
          "Posters with long copy, infographics, packaging, 4+ characters in frame — that's Pro or GPT Image 2 territory. NB2 handles short labels (1-3 words) and single portraits. On heavy scenes it confuses identities and breaks dense text — that's an architectural ceiling of the version, not a prompt fix.",
      },
    ],
    faq: [
      {
        q: "How is Nano Banana 2 different from Nano Banana Pro?",
        a: "NB2 is 2K, up to 6 references, basic thinking mode, and basic text rendering. Pro is 4K, up to 14 references (6 high fidelity), full thinking with intermediate images, and SOTA text rendering. But NB2 isn't a «stripped-down Pro»: on portrait close-ups, selfies, macro skin, and candid photos, NB2 objectively delivers a more natural result — less uncanny valley and less AI gloss.",
      },
      {
        q: "Why does NB2 smooth the skin even when I don't ask?",
        a: "That's its core weakness — over-edit on loaded references. The model «helps» beyond the request: smooths pores, removes imperfections, adds gloss. The cure is an explicit preserve block: «keep identity 100% — do not stylize, no enhancement, do not airbrush skin, preserve natural pores and texture.» It's a stack to repeat on every editing turn.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "Technically yes, NB2 is multilingual, but Google trained the model with English as the primary language. Complex prompts in Russian or other languages get less predictable results. Recommendation: keep the bulk of the prompt in English; in-image text can be in any language (Cyrillic, CJK are supported, though Pro handles them better).",
      },
      {
        q: "When to pick NB2 vs Pro?",
        a: "NB2 — single portraits, selfies, macro skin, candid documentary, extreme aspect ratios (4:1, 8:1), mass iteration (10 variants before finalizing). Pro — 4+ characters in frame, hero campaigns, dense text on posters/packaging, infographics, ray-traced lighting, 9-10 frame storyboards, structural sketch control. It's not «higher = better» — they're different tools.",
      },
      {
        q: "Is conversational editing supported?",
        a: "Yes, and it's the recommended way to make small tweaks. Don't rewrite the prompt to change lighting — just say: «great, now switch to sunset light and make the jacket dark blue, keep everything else as-is.» The model remembers session context. The key rule — always add a preserve block on edits, or NB2 will «improve» the face.",
      },
      {
        q: "How do I get film realism without the AI gloss?",
        a: "Stack: «35mm film, Kodak Portra 400, natural grain, warm muted tones, shallow depth of field, golden hour» + anti-glamour vocabulary: «no airbrush look, visible pores, weathered skin texture, no glamour retouch.» Describe real imperfections — that's the counterweight to the commercial gloss NB2 drifts into by default. Stating a camera era (1990s, 2000s) also helps.",
      },
      {
        q: "Does Opten support Nano Banana 2?",
        a: "Yes, the Opten extension auto-detects Nano Banana 2 inside Google AI Studio and Gemini and scores prompts against the structure above: it checks for subject specificity, natural language instead of tag soup, a preserve block on edits, and anti-glamour vocabulary on portraits. One click gives you a rewrite that won't drift into commercial gloss and will keep real skin texture.",
      },
    ],
  },
};
