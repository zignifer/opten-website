// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for grok-imagine.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Grok Imagine: структура, ошибки, примеры",
    description:
      "Как писать промпты для Grok Imagine (Aurora) от xAI: режиссёрский язык, связные описания, что НЕ работает (negatives, веса), типичные ошибки и примеры до/после.",
    h1: "Grok Imagine: как писать промпты, которые модель понимает",
    intro:
      "Grok Imagine (Aurora) — image-модель xAI с авторегрессивной MoE Transformer архитектурой, не diffusion. Сильна в фотореалистичных портретах и точном рендеринге текста. Поддерживает разрешение до 2K, промпты до 10000 символов, 14+ соотношений сторон и до 10 изображений за запрос. Негативные промпты не работают.",
    sections: [
      {
        heading: "Что умеет Grok Imagine",
        body:
          "Grok Imagine — авторегрессивная модель, не diffusion. Это даёт высокую верность промпту и стабильный рендеринг текста в кадре — одно из ключевых отличий от конкурентов.\n\nСильные стороны: фотореалистичные человеческие портреты, точный текст в изображениях (логотипы, вывески, баннеры), стилевая гибкость в одной модели (photorealism, аниме, акварель, масло, поп-арт). Multi-turn editing через POST /v1/images/edits — цепочка итеративных правок. Multi-image compositing — до 5 входных изображений в одной генерации. Меньше ограничений на рендеринг реальных объектов, чем у конкурентов.",
        bullets: [
          "Разрешение 1K (default), 2K (параметр resolution)",
          "До 10000 символов в промпте",
          "14+ соотношений сторон, до 10 изображений за запрос",
          "Edit mode через /v1/images/edits — до 5 входных изображений",
          "Pro вариант — выше качество, лучше текст",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Формула: [Subject] + [Style/Mood] + [Lighting] + [Camera Angle] + [Finishing Details].\n\nGrok Imagine принимает естественный язык — описательные предложения, НЕ теги. Используй режиссёрский язык: позиция камеры, тип объектива, направление света, время суток.\n\nКонкретная атмосфера бьёт общую: «nostalgic», «melancholic», «electric» вместо «happy», «cool», «nice». Описывай одну чёткую сцену за генерацию — мульти-сценовые промпты с противоречивыми элементами модель путают.\n\nAPI возвращает поле `revised_prompt` — модель может внутренне уточнить промпт перед генерацией. Это часть архитектуры, не сбой.",
      },
      {
        heading: "Что НЕ работает",
        body:
          "Главное ограничение: негативные промпты не поддерживаются. «No X», «don't include Y», «without Z» — модель полностью игнорирует. Описывай ТОЛЬКО то, что нужно. Это критический антипаттерн, ломающий результат.\n\nКроме того, не работают: специальный синтаксис (никаких весов `(word:1.2)`, токенов, LoRA-ссылок), keyword stacking («masterpiece, best quality, 8k, ultra detailed» — контрпродуктивно для авторегрессивной архитектуры), общие прилагательные («nice», «cool», «good» — пустые слова).\n\nНе ожидай pixel-level контроля в Edit mode — редактирование prompt-driven и холистическое. При итерации меняй одну переменную за раз, иначе модель меняет всё сразу.",
      },
      {
        heading: "Edit mode — редактирование изображений",
        body:
          "Grok Imagine Edit — тот же модельный бэкенд, не отдельная модель. Доступ через POST /v1/images/edits. Принимает 1–5 входных изображений плюс промпт.\n\nКлючевое правило: при редактировании одного изображения aspect ratio берётся из источника. Промпт описывает только ЧТО ИЗМЕНИТЬ, не всю сцену. «Change the sky to sunset» работает лучше, чем переописание всего кадра.\n\nИтерируй по одной переменной за раз. Не противоречь входному изображению — если на нём дневной свет, не проси «полночь» одним промптом, лучше «evening light». Multi-image compositing — описывай как именно объединить: «place the person from Image 1 into the scene from Image 2».",
      },
      {
        heading: "Сильные стороны: текст, портреты, стили",
        body:
          "Точный рендеринг текста — ключевое отличие Grok Imagine от большинства конкурентов. Используй прямое описание: «A neon sign reading \"OPEN 24/7\" in pink and cyan, mounted above a bar entrance». Pro-вариант рендерит текст ещё чище — для брендинга и типографики выбирай его.\n\nДля портретов модель особенно сильна — детализация кожи, освещение, выражения. Используй фото-терминологию: 50mm, 85mm f/1.4, golden hour, rim light, studio softbox.\n\nСтилевая гибкость в одной модели: photorealistic, oil painting, watercolor, anime, pop art, pencil sketch, comic book. Указывай конкретный стиль/эпоху, не «artistic». Конкретные атмосферные слова («nostalgic», «melancholic», «electric») сдвигают результат заметно.",
      },
    ],
    examples: [
      {
        before: "красивый портрет девушки, beautiful, high quality, no blur, no watermark",
        after:
          "A close-up portrait of a young woman with freckles and short auburn hair, wearing a black wool turtleneck. Golden hour rim light from behind, warm amber tones, melancholic mood. Shot on 85mm f/1.4, shallow depth of field, subtle film grain. Editorial photography.",
        note:
          "Негативы «no blur, no watermark» — Grok Imagine их игнорирует. «Beautiful, high quality» — пустые слова. Конкретный субъект, освещение, объектив и атмосферное прилагательное дают целевой результат.",
      },
      {
        before: "vintage shop sign",
        after:
          "A weathered metal sign mounted above a 1950s diner entrance. The sign reads \"JOE'S DINER\" in bold red script with cyan accents and small star icons. Twilight neon glow, wet asphalt below reflecting the lights, nostalgic mood. 35mm film photography, shallow depth of field.",
        note:
          "Точный текст в кавычках, конкретный шрифт и цвет, эпоха, атмосферное прилагательное «nostalgic». Grok Imagine — топ по тексту, используй это.",
      },
      {
        before:
          "masterpiece, best quality, 8k, ultra detailed, photorealistic, woman, dress, garden, no blur",
        after:
          "A young woman in her twenties wearing a flowing pale yellow linen dress, standing in a sunlit cottage garden in early summer. Soft golden hour light catches her hair, electric atmospheric mood, shallow depth of field. Shot on 85mm at f/1.8, candid documentary style.",
        note:
          "Keyword stacking («masterpiece, best quality, 8k, ultra detailed») — контрпродуктивно для авторегрессивной архитектуры. Связное описание с режиссёрским языком работает в разы лучше.",
      },
    ],
    mistakes: [
      {
        title: "Негативные промпты",
        explain:
          "«No X», «don't include Y», «without Z» — Grok Imagine полностью игнорирует негативы. Это ключевое архитектурное ограничение. Описывай ТОЛЬКО то, что нужно. Если хочется «без людей» — не упоминай людей вообще, а опиши пустую сцену.",
      },
      {
        title: "Keyword stacking «masterpiece, best quality, 8k»",
        explain:
          "Стэк общих квалитативных тегов («masterpiece, best quality, 8k, ultra detailed, hyperrealistic») контрпродуктивен для авторегрессивной модели. Конкретные термины (lens, lighting, mood adjective) работают значительно лучше любого quality-стэка.",
      },
      {
        title: "SD-синтаксис: веса, LoRA, embeddings",
        explain:
          "Веса вида `(word:1.5)`, LoRA-ссылки, embeddings, специальные токены — Grok Imagine их не поддерживает. Они попадают в промпт как литеральный мусор или игнорируются. Регулируй приоритеты порядком слов и связными описаниями.",
      },
      {
        title: "Общие прилагательные вместо атмосферных",
        explain:
          "«Nice», «cool», «good», «beautiful» — не дают модели направления. Используй специфические атмосферные слова: «nostalgic», «melancholic», «electric», «dramatic», «serene», «ominous», «ethereal». Они сдвигают результат заметно сильнее общих прилагательных.",
      },
      {
        title: "Сложные мульти-сценовые промпты",
        explain:
          "Одна чёткая сцена за генерацию. Промпт с несколькими сценами, противоречивыми элементами или попыткой описать историю — модель путает. Для сторителлинга делай несколько генераций. Для редактирования меняй одну переменную за раз в Edit mode.",
      },
    ],
    faq: [
      {
        q: "Чем Grok Imagine отличается от Midjourney и DALL-E?",
        a: "Grok Imagine построен на авторегрессивной MoE Transformer архитектуре, не на diffusion. Это даёт высокую верность промпту и точный рендеринг текста — одно из главных отличий. По стилевой гибкости и фотореализму сравним с топами, но меньше ограничений на реальные объекты. Поддерживает до 10000 символов промпта и Edit mode с multi-image compositing.",
      },
      {
        q: "В чём разница между Standard и Pro?",
        a: "Standard — быстрый вариант (до 300 запросов/мин), хорошее качество для большинства задач. Pro — выше качество, лучший рендеринг текста, более чистая детализация. Для брендинга, типографики, продуктовой съёмки и финальной продукции выбирай Pro. Для прототипирования и быстрых итераций — Standard.",
      },
      {
        q: "Какое разрешение поддерживается?",
        a: "1K — по умолчанию. 2K — через параметр `resolution`. Соотношения сторон: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 2:1, 1:2, 19.5:9, 9:19.5, 20:9, 9:20, auto. До 10 изображений за один запрос. Aspect ratio auto в Edit mode берёт из входного изображения.",
      },
      {
        q: "Как работает Edit mode?",
        a: "Через POST /v1/images/edits. Передаёшь 1–5 входных изображений плюс промпт с описанием изменения. Промпт описывает только ЧТО ИЗМЕНИТЬ, не всю сцену — модель видит исходник. При редактировании одного изображения aspect ratio берётся из него. Multi-image compositing — описываешь как объединить: «place the person from Image 1 into the scene from Image 2».",
      },
      {
        q: "Что такое revised_prompt в ответе API?",
        a: "Поле `revised_prompt` в ответе показывает уточнённую версию твоего промпта — модель может внутренне доработать формулировку перед генерацией. Это часть архитектуры авторегрессивной MoE Transformer, не сбой. Используй его для понимания, как модель интерпретировала запрос, и для дебага неожиданных результатов.",
      },
      {
        q: "На каком языке писать промпты?",
        a: "Английский — наиболее надёжный язык. Модель обучена преимущественно на англоязычных данных, и качество на других языках заметно ниже. Для production-задач — только английский. Для экспериментов на русском результат рабочий, но менее точный в стилях, атмосферных нюансах и фото-терминологии.",
      },
      {
        q: "Поддерживается ли Opten для Grok Imagine?",
        a: "Да, расширение Opten автоматически распознаёт Grok Imagine и оценивает промпты по структуре, описанной выше: проверяет наличие связного описания, конкретного освещения и камерного ракурса, атмосферных прилагательных, отсутствие негативных промптов и keyword stacking. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Grok Imagine Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for xAI's Grok Imagine (Aurora): cinematic language, coherent descriptions, what does NOT work (negatives, weights), common mistakes, and examples.",
    h1: "Grok Imagine: how to write prompts the model actually understands",
    intro:
      "Grok Imagine (Aurora) is xAI's image model with an autoregressive MoE Transformer architecture, not diffusion. It excels at photorealistic portraits and accurate in-image text rendering. It supports up to 2K resolution, prompts up to 10,000 characters, 14+ aspect ratios, and up to 10 images per request. Negative prompts do not work.",
    sections: [
      {
        heading: "What Grok Imagine does well",
        body:
          "Grok Imagine is autoregressive, not diffusion. This delivers high prompt fidelity and stable in-image text rendering — one of the key differentiators from competitors.\n\nStrengths: photorealistic human portraits, accurate in-image text (logos, signs, banners), stylistic flexibility within one model (photorealism, anime, watercolor, oil, pop art). Multi-turn editing via POST /v1/images/edits — an iterative edit chain. Multi-image compositing — up to 5 input images per generation. Fewer restrictions on real objects than most competitors.",
        bullets: [
          "Resolution 1K (default), 2K (via resolution parameter)",
          "Up to 10,000 characters per prompt",
          "14+ aspect ratios, up to 10 images per request",
          "Edit mode via /v1/images/edits — up to 5 input images",
          "Pro variant — higher quality, better text",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Formula: [Subject] + [Style/Mood] + [Lighting] + [Camera Angle] + [Finishing Details].\n\nGrok Imagine accepts natural language — descriptive sentences, NOT tags. Use cinematic language: camera position, lens type, light direction, time of day.\n\nSpecific atmosphere beats generic: «nostalgic», «melancholic», «electric» instead of «happy», «cool», «nice». Describe one clear scene per generation — multi-scene prompts with conflicting elements confuse the model.\n\nThe API returns a `revised_prompt` field — the model can internally refine the prompt before generation. This is part of the architecture, not a bug.",
      },
      {
        heading: "What does NOT work",
        body:
          "Main limitation: negative prompts are not supported. «No X», «don't include Y», «without Z» — the model completely ignores them. Describe ONLY what you want. This is a critical antipattern that breaks output.\n\nAlso non-functional: special syntax (no weights `(word:1.2)`, tokens, LoRA references), keyword stacking («masterpiece, best quality, 8k, ultra detailed» — counterproductive for autoregressive architecture), generic adjectives («nice», «cool», «good» — empty words).\n\nDon't expect pixel-level control in Edit mode — editing is prompt-driven and holistic. When iterating, change one variable at a time — otherwise the model changes everything at once.",
      },
      {
        heading: "Edit mode — image editing",
        body:
          "Grok Imagine Edit is the same model backend, not a separate model. Access via POST /v1/images/edits. Accepts 1–5 input images plus a prompt.\n\nKey rule: when editing a single image, aspect ratio is taken from the source. The prompt describes only WHAT TO CHANGE, not the whole scene. «Change the sky to sunset» works better than redescribing the entire frame.\n\nIterate one variable at a time. Don't contradict the input image — if it's daylight, don't ask for «midnight» in one prompt, prefer «evening light». Multi-image compositing — describe exactly how to combine: «place the person from Image 1 into the scene from Image 2».",
      },
      {
        heading: "Strengths: text, portraits, styles",
        body:
          "Accurate text rendering — Grok Imagine's key differentiator from most competitors. Use direct description: «A neon sign reading \"OPEN 24/7\" in pink and cyan, mounted above a bar entrance». The Pro variant renders text even cleaner — pick it for branding and typography.\n\nFor portraits the model is especially strong — skin detail, lighting, expressions. Use photo terminology: 50mm, 85mm f/1.4, golden hour, rim light, studio softbox.\n\nStylistic flexibility in one model: photorealistic, oil painting, watercolor, anime, pop art, pencil sketch, comic book. Specify a concrete style/era, not «artistic». Concrete atmospheric words («nostalgic», «melancholic», «electric») shift output noticeably.",
      },
    ],
    examples: [
      {
        before: "beautiful portrait of a woman, beautiful, high quality, no blur, no watermark",
        after:
          "A close-up portrait of a young woman with freckles and short auburn hair, wearing a black wool turtleneck. Golden hour rim light from behind, warm amber tones, melancholic mood. Shot on 85mm f/1.4, shallow depth of field, subtle film grain. Editorial photography.",
        note:
          "Negatives «no blur, no watermark» — Grok Imagine ignores them. «Beautiful, high quality» are empty words. A concrete subject, lighting, lens, and atmospheric adjective hit the target.",
      },
      {
        before: "vintage shop sign",
        after:
          "A weathered metal sign mounted above a 1950s diner entrance. The sign reads \"JOE'S DINER\" in bold red script with cyan accents and small star icons. Twilight neon glow, wet asphalt below reflecting the lights, nostalgic mood. 35mm film photography, shallow depth of field.",
        note:
          "Exact text in quotes, specific font and color, era, atmospheric «nostalgic». Grok Imagine is top-tier for text — use that.",
      },
      {
        before:
          "masterpiece, best quality, 8k, ultra detailed, photorealistic, woman, dress, garden, no blur",
        after:
          "A young woman in her twenties wearing a flowing pale yellow linen dress, standing in a sunlit cottage garden in early summer. Soft golden hour light catches her hair, electric atmospheric mood, shallow depth of field. Shot on 85mm at f/1.8, candid documentary style.",
        note:
          "Keyword stacking («masterpiece, best quality, 8k, ultra detailed») is counterproductive for autoregressive architecture. A coherent description with cinematic language works many times better.",
      },
    ],
    mistakes: [
      {
        title: "Negative prompts",
        explain:
          "«No X», «don't include Y», «without Z» — Grok Imagine completely ignores negatives. This is a core architectural limitation. Describe ONLY what you want. To get «no people», don't mention people at all and describe the empty scene.",
      },
      {
        title: "Keyword stacking «masterpiece, best quality, 8k»",
        explain:
          "A stack of generic quality tags («masterpiece, best quality, 8k, ultra detailed, hyperrealistic») is counterproductive for autoregressive models. Concrete terms (lens, lighting, mood adjective) work significantly better than any quality stack.",
      },
      {
        title: "SD syntax: weights, LoRA, embeddings",
        explain:
          "Weights like `(word:1.5)`, LoRA references, embeddings, special tokens — Grok Imagine doesn't support them. They land in the prompt as literal noise or get ignored. Regulate priorities via word order and coherent descriptions.",
      },
      {
        title: "Generic adjectives instead of atmospheric ones",
        explain:
          "«Nice», «cool», «good», «beautiful» give the model no direction. Use specific atmospheric words: «nostalgic», «melancholic», «electric», «dramatic», «serene», «ominous», «ethereal». They shift output noticeably more than generic adjectives.",
      },
      {
        title: "Complex multi-scene prompts",
        explain:
          "One clear scene per generation. A prompt with multiple scenes, conflicting elements, or attempts to describe a story confuses the model. For storytelling do multiple generations. For editing change one variable at a time in Edit mode.",
      },
    ],
    faq: [
      {
        q: "How is Grok Imagine different from Midjourney and DALL-E?",
        a: "Grok Imagine is built on autoregressive MoE Transformer architecture, not diffusion. This delivers high prompt fidelity and accurate text rendering — one of the main differences. Comparable to top-tier models on stylistic flexibility and photorealism, but with fewer restrictions on real objects. Supports up to 10,000 characters per prompt and an Edit mode with multi-image compositing.",
      },
      {
        q: "What is the difference between Standard and Pro?",
        a: "Standard — fast variant (up to 300 requests/min), good quality for most tasks. Pro — higher quality, better text rendering, cleaner detail. For branding, typography, product photography, and final production, choose Pro. For prototyping and quick iteration — Standard.",
      },
      {
        q: "What resolutions are supported?",
        a: "1K — default. 2K — via the `resolution` parameter. Aspect ratios: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 2:1, 1:2, 19.5:9, 9:19.5, 20:9, 9:20, auto. Up to 10 images per request. Aspect ratio auto in Edit mode takes the source image's ratio.",
      },
      {
        q: "How does Edit mode work?",
        a: "Via POST /v1/images/edits. Pass 1–5 input images plus a prompt describing the change. The prompt describes only WHAT TO CHANGE, not the whole scene — the model sees the source. When editing a single image, aspect ratio comes from it. Multi-image compositing — describe how to combine: «place the person from Image 1 into the scene from Image 2».",
      },
      {
        q: "What is revised_prompt in the API response?",
        a: "The `revised_prompt` field shows a refined version of your prompt — the model may internally tweak the wording before generation. This is part of the autoregressive MoE Transformer architecture, not a bug. Use it to understand how the model interpreted the request and to debug unexpected results.",
      },
      {
        q: "What language should prompts be written in?",
        a: "English is the most reliable. The model is trained predominantly on English data, and quality on other languages drops noticeably. For production tasks — English only. For experiments in other languages output works but is less precise in styles, atmospheric nuance, and photo terminology.",
      },
      {
        q: "Does Opten support Grok Imagine?",
        a: "Yes, the Opten extension auto-detects Grok Imagine and scores prompts against the structure outlined above: coherent description, concrete lighting and camera angle, atmospheric adjectives, absence of negative prompts and keyword stacking. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
