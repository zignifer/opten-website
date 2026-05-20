// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for recraft-v4.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Recraft V4: структура, ошибки, примеры",
    description:
      "Как писать промпты для Recraft V4 / V4 Pro: SVG-вектор, точный текст, два режима (interpretive/architectural), 100+ стилей, типичные ошибки и примеры до/после.",
    h1: "Recraft V4: как писать промпты, которые модель понимает",
    intro:
      "Recraft V4 — единственная на рынке AI-модель, генерирующая настоящий редактируемый SVG со структурированными слоями. Точный рендеринг текста, дизайнерский вкус и два режима промптинга: interpretive из 3–6 слов и architectural с полной структурой. Доступно 100+ пресетных стилей через параметр, поддержка негативных промптов, I2I и Figma-плагин.",
    sections: [
      {
        heading: "Что умеет Recraft V4",
        body:
          "Главная фича V4 — настоящий редактируемый SVG со структурированными слоями, не растровая имитация. Это единственная AI-модель на рынке с таким выходом, что делает её незаменимой для логотипов, иконок, упаковки и любого брендинга, где нужен векторный исходник.\n\nДве версии: V4 Standard (1024×1024, ~10с/изобр, 60 кредитов) и V4 Pro (2048×2048, ~28–30с/изобр, 175 кредитов). SVG-генерация — 15с на Standard, 45с на Pro с заметно более высоким качеством. Recraft #1 на Hugging Face Text-to-Image Arena, есть Figma plugin и MCP интеграция. Форматы выхода: SVG, PNG, JPG, PDF, TIFF, WebP, Lottie.",
        bullets: [
          "Настоящий редактируемый SVG со слоями (уникальная фича)",
          "Точный текст с правильным кернингом",
          "100+ пресетных стилей через `style`/`style_id` параметр",
          "Inpainting, outpainting, vectorization, background removal, upscaling",
          "Exploration mode — 8 вариаций из одного промпта",
        ],
      },
      {
        heading: "Два режима промптинга",
        body:
          "Recraft V4 поддерживает два принципиально разных подхода. Interpretive (3–6 слов) — модель сама принимает дизайнерские решения по композиции, цвету, тону: «Retro space station», «Minimalist coffee logo». Хорошо для исследования идей и exploration mode.\n\nArchitectural (длинный, структурированный) — полный контроль. Структура от глобального к локальному: A [image style] of [main content]. [Detailed description]. [Background]. [Style description]. Порядок: Core concept → Background → Subject framing → Physical attributes → Secondary subjects → Lighting → Camera/depth → Mood.\n\nЭлементы, упомянутые раньше в промпте, получают более высокий приоритет. Это важно: главный субъект всегда в первой строке.",
      },
      {
        heading: "Рендеринг текста",
        body:
          "Recraft V4 — одна из топовых моделей по точности текста. Правило одно: точный текст всегда в кавычках внутри промпта. «A storefront sign reading \"OPEN 24/7\" in neon letters» даст ровно тот текст, который указан, с правильным кернингом.\n\nДля брендинга, упаковки, вывесок, постеров это критично — каждое слово должно быть в кавычках. Если нужен билингвальный текст или нестандартные шрифты, указывай шрифт явно («serif headline», «display font», «handwritten script»). Размер и расположение тоже через текст: «small caption bottom-right», «bold headline centered top».",
      },
      {
        heading: "Style controls и базовые классы",
        body:
          "Recraft использует параметр `style` или `style_id` вместо описания стиля в тексте. Четыре базовых класса: `realistic_image`, `digital_illustration`, `vector_illustration`, `icon`. Плюс 100+ пресетных стилей внутри каждого класса, плюс custom styles через upload референсного изображения.\n\nЕсли пишешь «in flat vector style» в тексте, это работает заметно хуже, чем выбор `vector_illustration` через параметр. Стиль — отдельная сущность от содержимого, держи их раздельно. Для брендинга обычно нужны `vector_illustration` или `icon`; для маркетинговых баннеров — `realistic_image` или `digital_illustration`.\n\nЦвета задаются массивом preferred RGB colors + optional background color. Для брендовых проектов это даёт точный hex-контроль, недоступный в большинстве других моделей.",
      },
      {
        heading: "Негативные промпты и I2I",
        body:
          "Негативные промпты в V4 поддерживаются — это отдельное поле или API-параметр. Главное правило: писать что ИСКЛЮЧИТЬ без двойного отрицания. «blurry, text, watermark» работает; «no apples» в negative prompt — нет (двойное отрицание), писать просто «apples».\n\nImage-to-image работает с параметром strength: 0.1–0.3 — небольшая модификация, 0.5–0.7 — заметные изменения, 0.8+ — почти полная перегенерация. Ограничения I2I: макс 5MB, макс 16MP, макс 4096px, мин 256px.\n\nExploration mode даёт 8 вариаций из одного промпта — отличный способ исследовать стилевое пространство. Inpainting и outpainting тоже доступны, но не поддерживают style creation, prompt-based editing и image sets (это пока вне V4).",
      },
    ],
    examples: [
      {
        before:
          "красивый минималистичный логотип кофейни",
        after:
          "A minimalist logo for a specialty coffee shop. Central icon: a single coffee bean integrated with a wavy steam line above. Below the icon, brand name (EXACT): \"BREW & CO\" in geometric sans-serif. Tagline below in smaller letters (EXACT): \"Slow roasted since 2018\". Earth tone palette: warm brown #6B4423, cream #F5E8D3, deep black for text. style: vector_illustration. Clean geometry, structured layers, balanced negative space.",
        note: "Architectural режим с полной структурой: иконка → бренднейм → тагнейм, цвета указаны в hex, стиль через параметр vector_illustration. Точный текст в кавычках с EXACT. Это даёт production-ready SVG-логотип за одну итерацию.",
      },
      {
        before:
          "иконка приложения для медитации",
        after:
          "Meditation app icon, flat vector style. Central element: a stylized lotus flower with 5 petals, symmetric, soft purple to deep blue gradient on petals (#A78BFA → #4338CA). White background with subtle radial glow. style: icon. App store ready, rounded square format, balanced negative space, no text.",
        note: "Конкретные hex-цвета для градиента, стиль icon через параметр, балансировка композиции описана явно. «No text» в основном промпте не как negative — это позитивная инструкция оставить пустой фон.",
      },
      {
        before:
          "три кота на подоконнике в стиле акварели",
        after:
          "A digital illustration of three cats sitting on a wooden windowsill. From left to right: a black cat with green eyes, a ginger tabby looking sideways, a white cat with blue eyes. Window behind them shows soft afternoon light, blurred garden in background. style: digital_illustration. Watercolor texture, soft pastel palette, painterly brush strokes. Detailed but not photorealistic.",
        note: "Указано конкретное число котов (three, не «cats» — plural ambiguity). Каждый кот с описанием для предсказуемости. Стиль через параметр + watercolor texture в тексте для специфики техники.",
      },
    ],
    mistakes: [
      {
        title: "Стили в тексте вместо параметра",
        explain:
          "«In flat vector style» или «as a digital illustration» в тексте промпта работает заметно хуже, чем выбор соответствующего параметра `style`/`style_id` (`vector_illustration`, `digital_illustration`, `realistic_image`, `icon`). Стиль — отдельная сущность от содержимого. Используй параметр для стиля, текст — для описания сцены.",
      },
      {
        title: "Двойное отрицание в негативном промпте",
        explain:
          "В negative prompt пиши то, что ИСКЛЮЧИТЬ, без «no». «blurry, text, watermark» работает; «no apples» в negative prompt — это двойное отрицание, модель не поймёт. Если хочешь убрать яблоки — пиши просто «apples» в негативном поле, без отрицательной частицы.",
      },
      {
        title: "Plural ambiguity",
        explain:
          "«Cats sitting on a windowsill» неоднозначно — модель может сгенерировать одного, двух, пятерых. Указывай число явно: «three cats sitting on a windowsill». Это особенно важно для дизайнерских задач, где композиция должна быть предсказуемой. Для иконок и логотипов конкретное число элементов критично.",
      },
      {
        title: "Texture-язык для векторов",
        explain:
          "Для vector_illustration или icon описывать «brushstrokes», «paper texture», «soft fabric» бесполезно — векторная графика строится из геометрических примитивов, не из текстур. Используй геометрический и структурный язык: «clean lines», «structured layers», «balanced composition», «negative space», «modular grid». Для текстур переключайся на digital_illustration или realistic_image.",
      },
      {
        title: "Драматические оценочные прилагательные",
        explain:
          "«Stunning masterpiece», «breathtaking», «award-winning» — для Recraft это шум. Модель ценит точность выше преувеличения. Замени оценки на конкретные описательные элементы: вместо «stunning logo» — «logo with central monogram, serif type, deep navy palette». Точность всегда работает лучше пафоса.",
      },
    ],
    faq: [
      {
        q: "Чем V4 Standard отличается от V4 Pro?",
        a: "Standard — 1024×1024, ~10 секунд на изображение, 60 кредитов, SVG-генерация за 15 секунд. Pro — 2048×2048, 28–30 секунд, 175 кредитов, SVG 45 секунд с заметно более высоким качеством. Pro даёт лучшую детализацию и SVG-структуру, что важно для production-логотипов и сложной иллюстрации. Standard достаточно для прототипирования, иконок и быстрого исследования идей.",
      },
      {
        q: "Какие форматы выхода поддерживаются?",
        a: "SVG, PNG, JPG, PDF, TIFF, WebP, Lottie. SVG — главная фича: настоящий редактируемый вектор со слоями, не растровая имитация. Lottie — для анимированных JSON-иконок (актуально для веба и мобильных приложений). PDF — для печатных материалов. Большинство форматов доступны без дополнительных кредитов после основной генерации.",
      },
      {
        q: "Когда использовать interpretive, а когда architectural режим?",
        a: "Interpretive (3–6 слов) — для исследования идей и exploration mode, когда хочешь чтобы модель сама приняла дизайнерские решения. «Retro space station», «Minimalist coffee logo» — модель сама выберет цвета, композицию, тон. Architectural — когда нужен полный контроль: точный текст, конкретные цвета, заданная композиция, фиксированный стиль. Обычно начинают с interpretive для поиска направления, затем переходят на architectural для финального рендера.",
      },
      {
        q: "Как работать с фирменными цветами?",
        a: "Recraft поддерживает массив preferred RGB colors + optional background color как отдельный параметр. Это даёт точный hex-контроль над палитрой — критично для брендинга. Указывай hex-цвета прямо в тексте промпта тоже (например, «warm brown #6B4423») для дополнительной фиксации. Custom styles через upload референсного изображения позволяют закрепить визуальный язык бренда на серию генераций.",
      },
      {
        q: "Можно ли получить редактируемый SVG?",
        a: "Да, это главная фича Recraft V4 — настоящий SVG со структурированными слоями, открывается в Figma, Illustrator, Inkscape для дальнейшего редактирования. Каждый элемент — отдельный path, можно менять цвета, перемещать, удалять. Это уникально на рынке: большинство AI-моделей либо не умеют в SVG, либо отдают «трассированный» SVG-как-растр без структуры.",
      },
      {
        q: "Что не поддерживается в V4?",
        a: "Style creation (создание собственного стиля из нуля), prompt-based editing (правки текстовым промптом по существующему изображению — это GPT Image 2 территория), image sets (генерация серии изображений с единой композицией), artistic level control. Для этих задач либо ждать V5, либо использовать другие модели в пайплайне. Inpainting и outpainting в V4 есть, но это не то же самое, что prompt-based editing.",
      },
      {
        q: "Поддерживается ли Opten для Recraft V4?",
        a: "Да, расширение Opten распознаёт Recraft внутри recraft.ai и оценивает промпты по структуре, специфичной для модели: проверяет точный текст в кавычках, использование style параметра вместо стилей в тексте, отсутствие двойного отрицания в negative prompt, конкретность числа объектов, корректность texture-языка для выбранного класса. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Recraft V4 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Recraft V4 / V4 Pro: SVG vectors, exact text, interpretive vs architectural modes, 100+ preset styles, common mistakes and examples.",
    h1: "Recraft V4: how to write prompts the model actually understands",
    intro:
      "Recraft V4 is the only AI model that produces true editable SVG with structured layers. Accurate text rendering, real design taste, two prompt modes (interpretive 3–6 words and architectural with full structure), 100+ preset styles via parameter, plus negative prompts and I2I support.",
    sections: [
      {
        heading: "What Recraft V4 does well",
        body:
          "The flagship feature is true editable SVG with structured layers, not a rasterized fake. It's the only AI model on the market that delivers this, which makes it indispensable for logos, icons, packaging, and any branding work that needs a vector source.\n\nTwo tiers: V4 Standard (1024×1024, ~10s/image, 60 credits) and V4 Pro (2048×2048, ~28–30s/image, 175 credits). SVG generation runs 15s on Standard and 45s on Pro with noticeably higher quality. Recraft is #1 on Hugging Face Text-to-Image Arena, with a Figma plugin and MCP integration. Output formats: SVG, PNG, JPG, PDF, TIFF, WebP, Lottie.",
        bullets: [
          "True editable SVG with layers (unique feature)",
          "Accurate text with proper kerning",
          "100+ preset styles via the `style`/`style_id` parameter",
          "Inpainting, outpainting, vectorization, background removal, upscaling",
          "Exploration mode — 8 variations from one prompt",
        ],
      },
      {
        heading: "Two prompting modes",
        body:
          "Recraft V4 supports two fundamentally different approaches. Interpretive (3–6 words) — the model makes its own decisions about composition, color, and tone: «Retro space station», «Minimalist coffee logo». Good for idea exploration and exploration mode.\n\nArchitectural (long, structured) — full control. Structure from global to local: A [image style] of [main content]. [Detailed description]. [Background]. [Style description]. Order: Core concept → Background → Subject framing → Physical attributes → Secondary subjects → Lighting → Camera/depth → Mood.\n\nElements mentioned earlier in the prompt get higher priority. That matters: the main subject always goes in the first line.",
      },
      {
        heading: "Text rendering",
        body:
          "Recraft V4 is one of the top models for text accuracy. One rule: exact text always in quotes inside the prompt. «A storefront sign reading \"OPEN 24/7\" in neon letters» yields exactly that text with proper kerning.\n\nFor branding, packaging, signage, and posters this is critical — every word should be in quotes. For bilingual text or non-standard fonts, specify the font explicitly («serif headline», «display font», «handwritten script»). Size and placement also via text: «small caption bottom-right», «bold headline centered top».",
      },
      {
        heading: "Style controls and base classes",
        body:
          "Recraft uses a `style` or `style_id` parameter instead of describing style in the text. Four base classes: `realistic_image`, `digital_illustration`, `vector_illustration`, `icon`. Plus 100+ preset styles inside each class, plus custom styles via uploading a reference image.\n\nWriting «in flat vector style» in the text works noticeably worse than picking `vector_illustration` via the parameter. Style is a separate entity from content; keep them separate. For branding you typically want `vector_illustration` or `icon`; for marketing banners — `realistic_image` or `digital_illustration`.\n\nColors are set via an array of preferred RGB colors + optional background color. For brand projects this gives exact hex control unavailable in most other models.",
      },
      {
        heading: "Negative prompts and I2I",
        body:
          "Negative prompts are supported in V4 — it's a separate field or API parameter. The main rule: write what to EXCLUDE without double negatives. «blurry, text, watermark» works; «no apples» in a negative prompt does not (double negative) — just write «apples».\n\nImage-to-image works with a strength parameter: 0.1–0.3 — light modification, 0.5–0.7 — noticeable changes, 0.8+ — near-complete regeneration. I2I limits: max 5MB, max 16MP, max 4096px, min 256px.\n\nExploration mode produces 8 variations from one prompt — a great way to explore the style space. Inpainting and outpainting are also available, but style creation, prompt-based editing, and image sets are not yet in V4.",
      },
    ],
    examples: [
      {
        before: "a beautiful minimalist coffee shop logo",
        after:
          "A minimalist logo for a specialty coffee shop. Central icon: a single coffee bean integrated with a wavy steam line above. Below the icon, brand name (EXACT): \"BREW & CO\" in geometric sans-serif. Tagline below in smaller letters (EXACT): \"Slow roasted since 2018\". Earth tone palette: warm brown #6B4423, cream #F5E8D3, deep black for text. style: vector_illustration. Clean geometry, structured layers, balanced negative space.",
        note: "Architectural mode with full structure: icon → brand name → tagline, hex colors specified, style set via the vector_illustration parameter. Exact text in quotes with EXACT marker. Yields a production-ready SVG logo in one iteration.",
      },
      {
        before: "meditation app icon",
        after:
          "Meditation app icon, flat vector style. Central element: a stylized lotus flower with 5 petals, symmetric, soft purple to deep blue gradient on petals (#A78BFA → #4338CA). White background with subtle radial glow. style: icon. App store ready, rounded square format, balanced negative space, no text.",
        note: "Concrete hex colors for the gradient, icon style via parameter, composition balance described explicitly. «No text» in the main prompt is not a negative — it's a positive instruction to leave the background empty.",
      },
      {
        before: "three cats on a windowsill in watercolor style",
        after:
          "A digital illustration of three cats sitting on a wooden windowsill. From left to right: a black cat with green eyes, a ginger tabby looking sideways, a white cat with blue eyes. Window behind them shows soft afternoon light, blurred garden in background. style: digital_illustration. Watercolor texture, soft pastel palette, painterly brush strokes. Detailed but not photorealistic.",
        note: "Number of cats specified (three, not «cats» — plural ambiguity). Each cat described for predictability. Style set via parameter + watercolor texture in text for technique specifics.",
      },
    ],
    mistakes: [
      {
        title: "Styles in the prompt text instead of the parameter",
        explain:
          "«In flat vector style» or «as a digital illustration» in the prompt text works noticeably worse than picking the matching `style`/`style_id` parameter (`vector_illustration`, `digital_illustration`, `realistic_image`, `icon`). Style is a separate entity from content. Use the parameter for style, text for scene description.",
      },
      {
        title: "Double negatives in negative prompts",
        explain:
          "In negative prompts write what to EXCLUDE without «no». «blurry, text, watermark» works; «no apples» in a negative prompt is a double negative — the model misreads it. If you want to remove apples, just write «apples» in the negative field without a negation particle.",
      },
      {
        title: "Plural ambiguity",
        explain:
          "«Cats sitting on a windowsill» is ambiguous — the model can produce one, two, or five. Specify the number explicitly: «three cats sitting on a windowsill». This matters especially for design tasks where composition must be predictable. For icons and logos a concrete element count is critical.",
      },
      {
        title: "Texture language for vectors",
        explain:
          "For vector_illustration or icon, describing «brushstrokes», «paper texture», «soft fabric» is useless — vector graphics are built from geometric primitives, not textures. Use geometric and structural language: «clean lines», «structured layers», «balanced composition», «negative space», «modular grid». For textures, switch to digital_illustration or realistic_image.",
      },
      {
        title: "Dramatic evaluative adjectives",
        explain:
          "«Stunning masterpiece», «breathtaking», «award-winning» — for Recraft this is noise. The model values precision over hyperbole. Swap evaluative words for concrete descriptive elements: instead of «stunning logo» — «logo with central monogram, serif type, deep navy palette». Precision always beats pathos.",
      },
    ],
    faq: [
      {
        q: "How does V4 Standard differ from V4 Pro?",
        a: "Standard — 1024×1024, ~10 seconds per image, 60 credits, SVG generation in 15 seconds. Pro — 2048×2048, 28–30 seconds, 175 credits, SVG in 45 seconds with noticeably higher quality. Pro delivers better detail and SVG structure, which matters for production logos and complex illustration. Standard is enough for prototyping, icons, and quick idea exploration.",
      },
      {
        q: "Which output formats are supported?",
        a: "SVG, PNG, JPG, PDF, TIFF, WebP, Lottie. SVG is the headline feature: true editable vector with layers, not a rasterized fake. Lottie is for animated JSON icons (relevant for web and mobile). PDF for print materials. Most formats are available without extra credits after the initial generation.",
      },
      {
        q: "When should I use interpretive versus architectural mode?",
        a: "Interpretive (3–6 words) — for idea exploration and exploration mode, when you want the model to make design decisions. «Retro space station», «Minimalist coffee logo» — the model picks colors, composition, tone. Architectural — when you need full control: exact text, specific colors, defined composition, fixed style. Common workflow: start interpretive to find direction, then switch to architectural for the final render.",
      },
      {
        q: "How do I work with brand colors?",
        a: "Recraft supports an array of preferred RGB colors + optional background color as a separate parameter. This gives exact hex control over the palette — critical for branding. Specify hex colors in the prompt text too (e.g., «warm brown #6B4423») for extra anchoring. Custom styles via reference image upload let you lock a brand's visual language across a series of generations.",
      },
      {
        q: "Can I get an editable SVG?",
        a: "Yes, this is the headline V4 feature — true SVG with structured layers that opens in Figma, Illustrator, Inkscape for further editing. Every element is a separate path; you can change colors, move, delete. This is unique on the market: most AI models either can't do SVG or hand you «traced» SVG-as-raster with no structure.",
      },
      {
        q: "What's not supported in V4?",
        a: "Style creation (building a new style from scratch), prompt-based editing (text-prompt edits on an existing image — that's GPT Image 2 territory), image sets (generating a series with unified composition), artistic level control. For these tasks either wait for V5 or chain other models in the pipeline. Inpainting and outpainting are in V4 but are not the same as prompt-based editing.",
      },
      {
        q: "Does Opten support Recraft V4?",
        a: "Yes, the Opten extension recognizes Recraft inside recraft.ai and scores prompts against the model-specific structure: it checks for exact text in quotes, style set via parameter instead of in text, absence of double negatives in negative prompts, explicit object count, and texture language matching the chosen class. One click yields a rewrite in the right structure.",
      },
    ],
  },
};
