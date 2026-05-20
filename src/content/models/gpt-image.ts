// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for gpt-image.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для GPT Image: структура, ошибки, примеры",
    description:
      "Как писать промпты для GPT Image от OpenAI: визуальный медиум, конкретика, камерные термины, текст в кадре, типичные ошибки и примеры до/после.",
    h1: "GPT Image: как писать промпты, которые модель понимает",
    intro:
      "GPT Image — семейство image-моделей OpenAI (1, 1.5, 2). Понимает естественный язык, обрабатывает промпт как рассказ с визуальной конкретикой, поддерживает разрешения 1024×1024, 1536×1024 и 1024×1536, прозрачный фон и три уровня качества. Сильная сторона — рендеринг читаемого текста в кадре.",
    sections: [
      {
        heading: "Что умеет GPT Image",
        body:
          "Главная сила семейства — точный текст внутри изображения: вывески, меню, лейблы, UI-мокапы, плакаты. Модель понимает шрифт, размер, цвет, расположение и многоязычную типографику.\n\nGPT Image работает с естественным языком, а не с тегами. Поддерживает прозрачный фон (отдельный параметр), три уровня качества (high/medium/low), широкий стилевой диапазон от photorealism до акварели и concept art. Контент-политика OpenAI одна из самых строгих — NSFW, реальные знаменитости и насилие заблокированы.",
        bullets: [
          "Разрешения 1024×1024, 1536×1024, 1024×1536",
          "Форматы вывода PNG, JPEG, WebP",
          "Прозрачность через отдельный параметр",
          "Три уровня качества: high / medium / low",
          "Топ-класс по рендерингу текста в кадре",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Общая формула: [Визуальный медиум] + [Субъект] + [Окружение/Сцена] + [Освещение/Настроение] + [Композиция] + [Детали] + [Ограничения].\n\nКлючевой принцип: описывай как рассказ, но с визуальной конкретикой. «Туманная горная долина на рассвете, золотой свет пробивается сквозь сосны, отражаясь в зеркально гладком озере» бьёт «красивый пейзаж» в десятки раз.\n\nНачинай с визуального медиума: «photograph», «watercolor painting», «3D render», «technical illustration», «vintage poster». Это задаёт модели общий «режим» генерации.",
      },
      {
        heading: "Камера и освещение для photorealism",
        body:
          "Камерные термины работают значительно лучше, чем общие фразы о качестве вроде «8K, ultra HD».\n\nЛинзы: 35mm, 50mm, 85mm, macro. Глубина: shallow depth of field, bokeh, sharp focus. Ракурс: low angle, bird's eye view, eye level, Dutch angle. Тип съёмки: candid, portrait, product shot, aerial.\n\nДля освещения избегай общих слов «good lighting». Используй конкретику: «dramatic side lighting creating strong shadows», «soft box lighting eliminating harsh shadows», «golden hour», «fluorescent overhead», «neon glow», «candlelight». Чем точнее описание света, тем точнее настроение и атмосфера в кадре.",
      },
      {
        heading: "Текст в изображении",
        body:
          "GPT Image — одна из лучших моделей для текста в картинках. Правила:\n\nТочный текст — всегда в кавычках: `\"CAFE LUNA\"`, `\"OPEN 24/7\"`. Указывай стиль шрифта: «elegant handwriting», «bold sans-serif», «neon sign lettering». Расположение: «centered at the top», «on the wooden sign above the door». Для сложных или редких слов прописывай по буквам: `C-A-F-E L-U-N-A`.\n\nДля плотного текста (меню, инфографика) ставь `quality=\"high\"`. На low/medium мелкий шрифт может ломаться. Указывай typeface, размер, цвет — модель использует это для рендеринга.",
      },
      {
        heading: "Что НЕ работает",
        body:
          "GPT Image работает с естественным языком, не с тегами. Синтаксис Stable Diffusion — веса вида `(word:1.5)`, теги через запятую `masterpiece, best quality, 1girl`, embeddings, LoRA-ссылки — будут проигнорированы или ухудшат результат.\n\nQuality-бустеры «8K, ultra HD, masterpiece, best quality, hyper-realistic» подряд почти не влияют. Конкретные камерные/стилевые термины работают в разы лучше. Противоречивые стили вроде «photorealistic cartoon» или «minimalist detailed» сбивают модель. Негативные формулировки без позитивной альтернативы менее эффективны — «don't draw background» проигрывает «transparent background» или «soft grey studio backdrop».",
      },
    ],
    examples: [
      {
        before: "красивый рыжий кот",
        after:
          "A close-up portrait of a ginger tabby cat sitting on an old wooden windowsill, warm afternoon light filtering through lace curtains. Soft autumn garden visible through the window in soft bokeh. Shot on 50mm lens, shallow depth of field, photorealistic, muted warm palette.",
        note:
          "Главное отличие: визуальная конкретика вместо общего прилагательного. Конкретное окружение, камерные термины, освещение, медиум.",
      },
      {
        before: "кофейня с меню",
        after:
          "A chalkboard café menu mounted on an exposed brick wall, listing \"Espresso $3\", \"Flat White $4.50\", and \"Lavender Latte $5\" in elegant white chalk handwriting. Warm pendant lighting from above, shallow depth of field, blurred coffee shop interior in the background. Editorial café photography, quality=\"high\".",
        note:
          "Точный текст в кавычках, конкретный шрифт, расположение, освещение. `quality=\"high\"` для чёткого мелкого текста — обязательно.",
      },
      {
        before:
          "masterpiece, best quality, 8K, ultra HD, hyper-realistic, 1girl, beautiful, dress, garden",
        after:
          "A young woman in her twenties wearing a flowing pale yellow linen dress, walking through a sunlit cottage garden in early summer. Soft natural light, golden hour warmth, shallow depth of field. Shot on 85mm lens at f/1.8, candid documentary style, subtle film grain, muted earthy palette.",
        note:
          "Stable Diffusion-стиль (теги через запятую, quality-бустеры, `1girl`) GPT Image игнорирует или обрабатывает плохо. Связное описание с камерными терминами даёт целевой результат.",
      },
    ],
    mistakes: [
      {
        title: "Только абстрактные прилагательные",
        explain:
          "«Beautiful, amazing, stunning, gorgeous» не дают модели визуальной информации — нет цвета, текстуры, материала, формы. Заменяй на конкретику: «weathered brick wall, warm afternoon light, shallow depth of field». Минимум 2-3 описательных детали на сцену.",
      },
      {
        title: "Синтаксис Stable Diffusion",
        explain:
          "Веса вида `(word:1.5)`, теги через запятую, `1girl, masterpiece, best quality`, embeddings, LoRA-ссылки — GPT Image работает с естественным языком, не с тегами. Эти конструкции будут проигнорированы или ухудшат результат. Пиши предложениями.",
      },
      {
        title: "Quality-бустеры «8K, ultra HD, masterpiece»",
        explain:
          "Общие восхваления качества почти не влияют на GPT Image. Конкретные камерные термины («85mm, shallow DOF, golden hour»), стилевые ссылки («editorial photography», «watercolor illustration») и описания освещения работают в разы лучше любых quality-стэков.",
      },
      {
        title: "Отсутствие визуального медиума",
        explain:
          "Не указав фотография это, иллюстрация или 3D, ты оставляешь решение модели — результат непредсказуемый. Начинай промпт с медиума: «photograph», «watercolor painting», «3D render», «technical illustration», «vintage poster», «sticker design». Это задаёт общий режим генерации.",
      },
      {
        title: "Противоречивые стили в одном промпте",
        explain:
          "«Photorealistic cartoon», «minimalist detailed», «realistic stylized» — конфликт без объяснения. Модель не знает как совместить взаимоисключающие указания. Если нужна стилевая смесь, опиши её явно: «realistic rendering with subtle anime-inspired proportions».",
      },
    ],
    faq: [
      {
        q: "Чем отличаются версии GPT Image (1, 1.5, 2)?",
        a: "GPT Image 1 — базовая модель с хорошим рендерингом текста и фотореализмом. GPT Image 1.5 — улучшенный фотореализм, сохранение лиц при редактировании, более надёжный текст, multi-image вход, параметр input_fidelity. GPT Image 2 — SOTA-рендеринг текста (CJK, кириллица, арабский), thinking mode с web search, photorealism без AI-глянца, до 16 референсов. Для production задач 2 — однозначный апгрейд.",
      },
      {
        q: "Как добиться photorealism без AI-look?",
        a: "Используй фото-терминологию: «35mm film», «50mm lens», «shallow DOF», «natural color balance», «subtle film grain». Описывай реальные текстуры — «visible pores», «weathered skin», «fabric wear». Избегай слов «polished», «staged», «beautiful lighting» — они активируют студийный глянец. Явное «photorealistic» в начале промпта помогает.",
      },
      {
        q: "На каком языке писать промпты?",
        a: "Английский даёт самый стабильный результат — модели обучены преимущественно на нём. Но GPT Image многоязычная и понимает естественный язык на русском, китайском, корейском. Для production-промптов рекомендуется английский; для экспериментов и личных задач русский работает. Текст в самом изображении можно просить на любом языке.",
      },
      {
        q: "Как сделать прозрачный фон?",
        a: "Используй явный параметр прозрачности в API/UI — отдельный flag «background: transparent» или эквивалент в выбранной платформе. В промпте можно дополнительно указать «transparent background», но именно параметр гарантирует чистую альфа-маску. Идеально для стикеров, иконок и ассетов без фона.",
      },
      {
        q: "Когда использовать quality=\"high\"?",
        a: "Для плотного текста, мелких надписей в инфографике, портретов крупным планом, identity-sensitive редактирования и любых сцен где важна тонкая деталь (текстура кожи, шрифт, мелкий узор). `medium` — дефолт для большинства задач, разница в скорости заметна. `low` — для превью, mass generation и A/B-тестов.",
      },
      {
        q: "Почему GPT Image отказывается генерировать?",
        a: "У OpenAI один из самых строгих модераторов. Триггерится не только на явный NSFW, но и на комбинации невинных слов в подозрительном контексте. Реальные celebrities и узнаваемые IP-лица заблокированы политикой. Если получаешь refusal — переформулируй: убери triggering combo, замени контекст на editorial/fashion, не пытайся обмануть фильтр эвфемизмами (он семантический, не keyword-based).",
      },
      {
        q: "Поддерживается ли Opten для GPT Image?",
        a: "Да, расширение Opten автоматически распознаёт все версии GPT Image (1, 1.5, 2) внутри ChatGPT и поддерживаемых платформ. Оно оценивает промпты по структуре, описанной выше: проверяет наличие визуального медиума, конкретики, камерных терминов для photorealism, кавычек для текста, отсутствие SD-синтаксиса. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "GPT Image Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for OpenAI's GPT Image: visual medium, specificity, camera terms, in-image text, common mistakes, and before/after examples.",
    h1: "GPT Image: how to write prompts the model actually understands",
    intro:
      "GPT Image is OpenAI's image model family (1, 1.5, 2). It understands natural language, treats prompts as stories with visual specifics, supports 1024×1024, 1536×1024, and 1024×1536 resolutions, transparent background, and three quality tiers. The standout feature is rendering readable in-image text.",
    sections: [
      {
        heading: "What GPT Image does well",
        body:
          "The family's main strength is accurate in-image text: signs, menus, labels, UI mockups, posters. The model handles font, size, color, placement, and multilingual typography.\n\nGPT Image works with natural language, not tags. It supports transparent background (a dedicated parameter), three quality tiers (high/medium/low), and a wide stylistic range from photorealism to watercolor and concept art. OpenAI's content policy is one of the strictest — NSFW, real celebrities, and violence are blocked.",
        bullets: [
          "Resolutions 1024×1024, 1536×1024, 1024×1536",
          "Output formats PNG, JPEG, WebP",
          "Transparency via dedicated parameter",
          "Three quality tiers: high / medium / low",
          "Top-tier in-image text rendering",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "General formula: [Visual medium] + [Subject] + [Environment/Scene] + [Lighting/Mood] + [Composition] + [Details] + [Constraints].\n\nThe core principle: describe like a story, but with visual specificity. «A foggy mountain valley at dawn, golden light filtering through pine trees, reflected in a mirror-still lake» beats «a beautiful landscape» tenfold.\n\nStart with the visual medium: «photograph», «watercolor painting», «3D render», «technical illustration», «vintage poster». This sets the generation mode for the model.",
      },
      {
        heading: "Camera and lighting for photorealism",
        body:
          "Camera terms work significantly better than generic quality phrases like «8K, ultra HD».\n\nLenses: 35mm, 50mm, 85mm, macro. Depth: shallow depth of field, bokeh, sharp focus. Angle: low angle, bird's eye view, eye level, Dutch angle. Shot type: candid, portrait, product shot, aerial.\n\nFor lighting avoid generic «good lighting». Use specifics: «dramatic side lighting creating strong shadows», «soft box lighting eliminating harsh shadows», «golden hour», «fluorescent overhead», «neon glow», «candlelight». The more precise the light, the more precise the mood and atmosphere on screen.",
      },
      {
        heading: "In-image text",
        body:
          "GPT Image is one of the best models for in-image text. Rules:\n\nExact text always in quotes: `\"CAFE LUNA\"`, `\"OPEN 24/7\"`. Specify font style: «elegant handwriting», «bold sans-serif», «neon sign lettering». Placement: «centered at the top», «on the wooden sign above the door». For complex or rare words spell them letter by letter: `C-A-F-E L-U-N-A`.\n\nFor dense text (menus, infographics) set `quality=\"high\"`. At low/medium small type can break. Specify typeface, size, color — the model uses these for rendering.",
      },
      {
        heading: "What does NOT work",
        body:
          "GPT Image works with natural language, not tags. Stable Diffusion syntax — weights like `(word:1.5)`, comma-separated tags like `masterpiece, best quality, 1girl`, embeddings, LoRA references — will be ignored or degrade the result.\n\nQuality boosters «8K, ultra HD, masterpiece, best quality, hyper-realistic» strung together barely affect output. Concrete camera/style terms work many times better. Conflicting styles like «photorealistic cartoon» or «minimalist detailed» confuse the model. Negative formulations without a positive alternative are less effective — «don't draw background» loses to «transparent background» or «soft grey studio backdrop».",
      },
    ],
    examples: [
      {
        before: "beautiful ginger cat",
        after:
          "A close-up portrait of a ginger tabby cat sitting on an old wooden windowsill, warm afternoon light filtering through lace curtains. Soft autumn garden visible through the window in soft bokeh. Shot on 50mm lens, shallow depth of field, photorealistic, muted warm palette.",
        note:
          "Key change: visual specificity instead of a generic adjective. Concrete environment, camera terms, lighting, medium.",
      },
      {
        before: "café with a menu",
        after:
          "A chalkboard café menu mounted on an exposed brick wall, listing \"Espresso $3\", \"Flat White $4.50\", and \"Lavender Latte $5\" in elegant white chalk handwriting. Warm pendant lighting from above, shallow depth of field, blurred coffee shop interior in the background. Editorial café photography, quality=\"high\".",
        note:
          "Exact text in quotes, specific font, placement, lighting. `quality=\"high\"` for clean small text — mandatory.",
      },
      {
        before:
          "masterpiece, best quality, 8K, ultra HD, hyper-realistic, 1girl, beautiful, dress, garden",
        after:
          "A young woman in her twenties wearing a flowing pale yellow linen dress, walking through a sunlit cottage garden in early summer. Soft natural light, golden hour warmth, shallow depth of field. Shot on 85mm lens at f/1.8, candid documentary style, subtle film grain, muted earthy palette.",
        note:
          "Stable Diffusion style (comma-separated tags, quality boosters, `1girl`) is ignored or handled poorly by GPT Image. A coherent description with camera terms hits the target.",
      },
    ],
    mistakes: [
      {
        title: "Abstract adjectives only",
        explain:
          "«Beautiful, amazing, stunning, gorgeous» give the model no visual information — no color, texture, material, or shape. Replace with specifics: «weathered brick wall, warm afternoon light, shallow depth of field». Minimum 2-3 descriptive details per scene.",
      },
      {
        title: "Stable Diffusion syntax",
        explain:
          "Weights like `(word:1.5)`, comma-separated tags, `1girl, masterpiece, best quality`, embeddings, LoRA references — GPT Image works with natural language, not tags. These constructions are ignored or degrade output. Write sentences.",
      },
      {
        title: "Quality boosters «8K, ultra HD, masterpiece»",
        explain:
          "Generic quality praise barely affects GPT Image. Concrete camera terms («85mm, shallow DOF, golden hour»), style references («editorial photography», «watercolor illustration»), and lighting descriptions work many times better than any quality stack.",
      },
      {
        title: "Missing visual medium",
        explain:
          "Without saying whether it's a photograph, illustration, or 3D, the decision is left to the model — output becomes unpredictable. Start the prompt with a medium: «photograph», «watercolor painting», «3D render», «technical illustration», «vintage poster», «sticker design». This sets the generation mode.",
      },
      {
        title: "Conflicting styles in one prompt",
        explain:
          "«Photorealistic cartoon», «minimalist detailed», «realistic stylized» — conflict without explanation. The model can't reconcile mutually exclusive instructions. If a stylistic blend is needed, describe it explicitly: «realistic rendering with subtle anime-inspired proportions».",
      },
    ],
    faq: [
      {
        q: "How do GPT Image versions (1, 1.5, 2) differ?",
        a: "GPT Image 1 is the base model with good text rendering and photorealism. GPT Image 1.5 brings improved photorealism, face preservation in editing, more reliable text, multi-image input, and an input_fidelity parameter. GPT Image 2 adds SOTA text rendering (CJK, Cyrillic, Arabic), thinking mode with web search, photorealism without AI gloss, and up to 16 references. For production work, version 2 is a clear upgrade.",
      },
      {
        q: "How do you get photorealism without the AI look?",
        a: "Use photo terminology: «35mm film», «50mm lens», «shallow DOF», «natural color balance», «subtle film grain». Describe real textures — «visible pores», «weathered skin», «fabric wear». Avoid words like «polished», «staged», «beautiful lighting» — they activate studio gloss. An explicit «photorealistic» at the start helps.",
      },
      {
        q: "What language should prompts be written in?",
        a: "English gives the most stable results — the models are trained predominantly on English. But GPT Image is multilingual and understands natural language in Russian, Chinese, Korean. For production prompts, English is recommended; for experiments and personal tasks Russian works. In-image text can be requested in any language.",
      },
      {
        q: "How do you make a transparent background?",
        a: "Use the explicit transparency parameter in the API or UI — a dedicated «background: transparent» flag or equivalent in the chosen platform. The prompt can additionally state «transparent background», but the parameter is what guarantees a clean alpha mask. Ideal for stickers, icons, and asset work without a background.",
      },
      {
        q: "When should quality=\"high\" be used?",
        a: "For dense text, small infographic labels, close-up portraits, identity-sensitive editing, and any scene where fine detail matters (skin texture, font, fine pattern). `medium` is the default for most tasks — the speed difference is noticeable. `low` is for previews, mass generation, and A/B tests.",
      },
      {
        q: "Why does GPT Image refuse to generate?",
        a: "OpenAI has one of the strictest moderators. It triggers not only on explicit NSFW, but on combinations of innocent words in suspicious context. Real celebrities and recognizable IP faces are blocked by policy. If you get a refusal — reformulate: drop the triggering combo, swap context to editorial/fashion, don't try euphemisms to trick the filter (it's semantic, not keyword-based).",
      },
      {
        q: "Does Opten support GPT Image?",
        a: "Yes, the Opten extension auto-detects all GPT Image versions (1, 1.5, 2) inside ChatGPT and supported platforms. It scores prompts against the structure outlined above: presence of a visual medium, specificity, camera terms for photorealism, quotes for text, absence of SD syntax. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
