// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for nano-banana-pro.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Nano Banana Pro: структура, ошибки, примеры",
    description:
      "Как писать промпты для Nano Banana Pro (Gemini 3 Pro Image): бриф, JSON-промпты, Identity Locking, brightness bias, ошибки и примеры до/после для постеров.",
    h1: "Nano Banana Pro: как писать промпты, которые модель понимает",
    intro:
      "Nano Banana Pro — флагман Google в Gemini 3 Pro Image: 4K, до 14 референсов (6 high fidelity), полный thinking mode и SOTA-рендер текста. Думающая модель: понимает намерение, физику и композицию, читает промпт как бриф креативного директора. Английский — основной язык; JSON-структуры работают отлично.",
    sections: [
      {
        heading: "Что умеет Nano Banana Pro",
        body:
          "Pro — это 10 ключевых возможностей сразу: SOTA-рендер текста с инфографикой и многоязычной типографикой, Identity Locking через 14 референсов (6 high fidelity), grounding через Google Search, мощное редактирование без масок, перевод 2D→3D, нативная генерация до 4K, thinking с промежуточными изображениями, сториборды на 9-10 кадров, структурный контроль по скетчам и вайрфреймам, актуальные данные через поиск.\n\nЭто отдельный класс модели для hero brand assets, постеров, упаковки, сложных сцен с 4+ персонажами и production-ready инфографики. Сюда идут задачи, где нужен максимальный контроль и высокое разрешение, а не быстрая итерация.",
        bullets: [
          "До 4K, до 14 референсов (6 high fidelity)",
          "SOTA-рендер текста: постеры, упаковка, инфографика, многоязычная типографика",
          "Полный thinking mode с промежуточными «мыслительными» изображениями",
          "Google Search grounding для актуальных данных",
          "Структурный контроль: скетчи, вайрфреймы, сетки как входные изображения",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Субъект с деталями] + [Сцена/Окружение] + [Освещение] + [Камера/Объектив] + [Текстуры/Материалы] + [Стиль/Настроение] + [Контекст назначения] + [Формат].\n\nЗолотое правило — Creative Director, а не Tag Soup. Pro — думающая модель, она понимает намерение. Промпт должен звучать как бриф для художника. Конкретные параметры камеры значительно влияют на результат: «Shot on Sony A7III with 85mm f/1.4 lens, classic three-point lighting setup, natural skin texture with visible pores, catchlights in eyes». Для сложных сцен можно использовать JSON-структуру — Pro отлично её парсит.",
      },
      {
        heading: "Brightness bias и как с ним бороться",
        body:
          "Pro имеет встроенный bias в сторону яркого, насыщенного, «полированного» изображения. Модель «чинит» overcast, добавляет saturation, тянет в тёплый glow. Симптомы: просили пасмурную атмосферу — получили утренний свет; просили desaturated noir — получили насыщенный editorial; просили реалистичный candid — получили polished commercial.\n\nКонтр-приёмы (стакать 2-3 одновременно): эксплицитно «overcast, muted desaturated palette, cool color temperature, no auto-brightening»; анти-glamour «no polished glamour, no commercial polish, raw documentary aesthetic»; цветокор «dim ambient lighting, low contrast, faded vintage color grade, neutral exposure»; жанровый якорь «the look of news photojournalism» или «the look of a real police evidence photo».",
      },
      {
        heading: "Многореференсный режим (10+ изображений)",
        body:
          "Когда загружено 8+ референсов, обычные правила перестают работать — промпт превращается в перегруженный список, и модель теряется. Работают другие правила.\n\nСсылайся на референс, не переописывай его: вместо «куртка цвета хаки с кожаным воротником и четырьмя карманами» — «куртка с @ref2». Назначь каждой картинке роль: «камера в правой руке (@ref3), сумка через плечо (@ref4), компас на поясе (@ref5)». Каждый референс = место в сцене. Выбрасывай рефы без чёткого размещения — лучше 4 точно размещённых, чем 14 размытых. На 12+ референсов ожидай отказа части деталей — заранее выбери 2-3 самых важных.",
      },
      {
        heading: "Identity Locking и серии",
        body:
          "Pro — лучший выбор для серий с консистентностью персонажа: до 14 референсов держат идентичность через 9-10 кадров. Формула: «Keep the person's facial features exactly the same as Image 1. 100% identical facial features, bone structure, skin tone» + описание новой позы/эмоции/сцены.\n\nДля вирусных тамбнейлов работает за один проход: «персонаж с Изображения 1 слева, удивлённое выражение, указывает на продукт справа, жёлтая стрелка, крупный текст «WOW!» с обводкой, жирная графика». Для групповых сцен указывай идентичность КАЖДОГО персонажа и что одежда/внешность стабильны через кадры.",
      },
    ],
    examples: [
      {
        before:
          "вирусный тамбнейл для ютуба",
        after:
          "Viral YouTube thumbnail, 16:9 landscape. Left side: the man from Image 1 (keep facial features 100% identical to reference), surprised expression, mouth open, pointing dramatically at the right side of the frame. Right side: a sleek black gaming laptop on a glossy desk. Center-bottom: bold yellow outlined text «MIND BLOWN», sans-serif heavy weight, slight 3D depth. Color palette: high-contrast yellow, magenta, deep black background with subtle radial glow behind the laptop. Style: high click-through-rate YouTube thumbnail aesthetic.",
        note:
          "Identity Locking, явное назначение (viral thumbnail), точный текст в кавычках с указанием шрифта, цветовая палитра, формат. Pro собирает почти production-ready тамбнейл за один проход.",
      },
      {
        before:
          "пасмурный документальный кадр",
        after:
          "A weathered fisherman repairing a torn net on a wooden pier, late autumn morning. Overcast, muted desaturated palette, cool color temperature, dim ambient lighting, low contrast, faded vintage color grade, neutral exposure. No polished glamour, no commercial polish, raw documentary aesthetic. The look of news photojournalism — visible skin texture, weathered hands, worn jacket, no airbrushing. Shot on 35mm with mild film grain, slight desaturation.",
        note:
          "Анти-brightness-bias стек: цветокор + анти-glamour + жанровый якорь. Без него Pro «починит» пасмурную атмосферу и сделает теплое утро вместо документального серого.",
      },
      {
        before:
          "инфографика финансовый отчёт",
        after:
          "Pitch-deck slide titled \"Annual Revenue Growth 2026\". Visualize a 4-quarter bar chart with values: \"Q1 $2.4M\", \"Q2 $3.1M\", \"Q3 $4.2M\", \"Q4 $5.8M\". Use Inter bold sans-serif for labels, brand color #1A73E8 for bars, subtle gridlines, clean white background. Subtitle below chart in smaller weight: \"45% YoY growth\". Bottom-right: brand logo placeholder labeled \"COMPANY\". Style: modern editorial infographic, crisp 4K rendering, no decorative noise.",
        note:
          "Pro — единственная в семействе с production-ready рендером плотного текста и цифр. Указан шрифт, hex-цвет, layout — модель собирает почти готовый слайд.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup на думающей модели",
        explain:
          "«woman, paris, cafe, golden, 4k, realistic» теряет 60% потенциала Pro. Модель обучена на полных предложениях, её thinking-механизм считывает связные описания, а не теги. Пиши как креативный директор, диктующий бриф фотографу — длинные описательные предложения с грамматикой удваивают качество на тех же словах.",
      },
      {
        title: "Игнорирование brightness bias",
        explain:
          "Pro по умолчанию тянет в яркое, насыщенное, polished. Для noir, документалки, candid, horror — это критическая проблема. Без стека анти-glamour лексики («overcast, muted, no polished glamour, raw documentary») модель сделает «красиво», даже если просили «правдиво». Стакай 2-3 контр-приёма одновременно.",
      },
      {
        title: "Переописание каждого референса на 10+ загруженных",
        explain:
          "На 8+ референсах подробные описания перестают работать — промпт превращается в перегруженный список. Правильно: «куртка с @ref2», «камера в правой руке (@ref3)». Назначь каждой картинке роль в сцене. Без чёткого размещения референс будет проигнорирован или испортит композицию.",
      },
      {
        title: "Identity Locking забыт при сериях",
        explain:
          "Без явной команды «keep facial features 100% identical to Image 1» модель меняет черты лица от кадра к кадру — даже на одной модели. Для сториборда на 9-10 кадров Identity Locking повторяется в каждом промпте, и обязательна стабилизация одежды («clothing and appearance remain stable across all frames»).",
      },
      {
        title: "Перегенерация вместо диалогового редактирования",
        explain:
          "Pro помнит контекст сессии и поддерживает правки в диалоге. Если изображение готово на 80%, не пиши промпт заново ради смены освещения или цвета. Скажи: «отлично, теперь смени свет на закатный, остальное оставь». Это сохраняет идентичность персонажа и быстрее, чем новый seed.",
      },
    ],
    faq: [
      {
        q: "Когда Pro, а когда Nano Banana 2?",
        a: "Pro — для 4+ персонажей в кадре, hero brand assets, плотного текста на постерах/упаковке, инфографики, ray-traced освещения, сторибордов на 9-10 кадров, 10+ референсов, структурного контроля по скетчам. NB2 — для одиночных портретных close-up'ов (меньше uncanny valley), макро-кожи, селфи, candid-документалки, экстремальных пропорций, массовой итерации (10 вариантов перед финалом). Не «выше = лучше», это разные инструменты.",
      },
      {
        q: "Что такое thinking mode и как он влияет на результат?",
        a: "Pro по умолчанию «думает» — генерирует промежуточные «мыслительные» изображения для уточнения композиции перед финальным рендером. Это позволяет решать визуальные уравнения, делать «до/после» рассуждения, использовать Google Search и проверять собственный результат. Время генерации дольше, но качество первого прохода значительно выше — особенно на сложных сценах с инфографикой и многими элементами.",
      },
      {
        q: "Работают ли JSON-промпты?",
        a: "Да, Pro отлично понимает JSON-структуры — это один из рекомендуемых способов для сложных сцен с множеством деталей. Структура: subject (description, expression, clothing), photography (camera_style, lighting, lens), background (setting, elements, atmosphere). Эта техника даёт максимальный контроль и удобна для шаблонизации в production-пайплайнах.",
      },
      {
        q: "Как добиться плёночного реализма без glossy AI-look?",
        a: "Стакай контр-приёмы против brightness bias: «overcast, muted desaturated palette, cool color temperature, dim ambient lighting, low contrast, faded vintage color grade, neutral exposure» + «no polished glamour, no commercial polish, raw documentary aesthetic» + жанровый якорь «the look of news photojournalism». Описывай реальные несовершенства: «visible pores, weathered skin, fabric wear, subtle film grain». 2-3 контр-приёма обязательны.",
      },
      {
        q: "Сколько референсов имеет смысл загружать?",
        a: "Pro держит до 14 (6 high fidelity), но на 12+ ожидай отказа части деталей — модель не уместит всё. Оптимально 4-8 точно размещённых референсов с явной ролью каждого («куртка с @ref2», «фон с @ref7»). 14 размытых рефов хуже 4 точных. Заранее выбери 2-3 самых важных и убедись, что они описаны однозначно — остальные станут bonus, не базой.",
      },
      {
        q: "Поддерживается ли многоязычный текст в изображении?",
        a: "Да, Pro — SOTA в семействе по рендерингу текста: латиница, кириллица, CJK (китайский, японский, корейский), арабский, хинди, бенгали. Точный текст всегда в кавычках с указанием шрифта, кегля, цвета и расположения. Для длинного текста добавляй «EXACT» или «verbatim»: «label text (EXACT): \"Fresh and clean\"». Для постеров и упаковки в семействе только Pro даёт production-ready результат.",
      },
      {
        q: "Поддерживается ли Opten для Nano Banana Pro?",
        a: "Да, расширение Opten автоматически распознаёт Nano Banana Pro в Google AI Studio и Gemini 3 Pro и оценивает промпты по структуре выше: проверяет brief-style вместо tag soup, наличие Identity Locking при референсах, анти-brightness-bias стек для документалки и noir, точный текст в кавычках, роли при многореференсных промптах. Одним кликом получаешь rewrite, который не уйдёт в коммерческий глянец.",
      },
    ],
  },
  en: {
    title: "Nano Banana Pro Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Nano Banana Pro (Gemini 3 Pro Image): brief structure, JSON prompts, Identity Locking, brightness bias, mistakes, and examples.",
    h1: "Nano Banana Pro: how to write prompts the model actually understands",
    intro:
      "Nano Banana Pro is Google's flagship in Gemini 3 Pro Image: 4K, up to 14 references (6 high fidelity), full thinking mode, and SOTA text rendering. A thinking model — it understands intent, physics, and composition, reading prompts as a creative-director brief. English is the primary language; JSON structures work great.",
    sections: [
      {
        heading: "What Nano Banana Pro does",
        body:
          "Pro packs 10 headline capabilities at once: SOTA text rendering with infographics and multilingual typography, Identity Locking through 14 references (6 high fidelity), Google Search grounding, powerful mask-free editing, 2D→3D translation, native 4K generation, thinking with intermediate images, 9-10 frame storyboards, structural control via sketches and wireframes, and live data through search.\n\nThis is a separate class of model — for hero brand assets, posters, packaging, complex scenes with 4+ characters, and production-ready infographics. It's where tasks land when you need maximum control and high resolution, not fast iteration.",
        bullets: [
          "Up to 4K, up to 14 references (6 high fidelity)",
          "SOTA text rendering: posters, packaging, infographics, multilingual typography",
          "Full thinking mode with intermediate «reasoning» images",
          "Google Search grounding for live data",
          "Structural control: sketches, wireframes, grids as input images",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject with details] + [Scene/Setting] + [Lighting] + [Camera/Lens] + [Textures/Materials] + [Style/Mood] + [Purpose context] + [Format].\n\nGolden rule — Creative Director, not Tag Soup. Pro is a thinking model, it understands intent. The prompt should sound like a brief for an artist. Concrete camera parameters significantly affect output: «Shot on Sony A7III with 85mm f/1.4 lens, classic three-point lighting setup, natural skin texture with visible pores, catchlights in eyes.» For complex scenes you can use JSON structure — Pro parses it well.",
      },
      {
        heading: "Brightness bias and how to fight it",
        body:
          "Pro has a built-in bias toward bright, saturated, «polished» imagery. The model «fixes» overcast, adds saturation, pulls toward warm glow. Symptoms: you asked for an overcast mood and got morning light; asked for desaturated noir and got saturated editorial; asked for realistic candid and got polished commercial.\n\nCounter-stack 2-3 simultaneously: explicit «overcast, muted desaturated palette, cool color temperature, no auto-brightening»; anti-glamour «no polished glamour, no commercial polish, raw documentary aesthetic»; color grade «dim ambient lighting, low contrast, faded vintage color grade, neutral exposure»; genre anchor «the look of news photojournalism» or «the look of a real police evidence photo.»",
      },
      {
        heading: "Multi-reference mode (10+ images)",
        body:
          "With 8+ references loaded, the usual rules stop working — the prompt turns into an overloaded list and the model gets lost. Different rules apply.\n\nReference, don't redescribe: instead of «khaki jacket with leather collar and four pockets» — «jacket from @ref2.» Assign each image a role: «camera in the right hand (@ref3), bag over the shoulder (@ref4), compass on the belt (@ref5).» Each reference = a place in the scene. Drop refs without clear placement — 4 precisely placed references beat 14 vague ones. At 12+ references expect some details to be dropped — pre-select your 2-3 most important.",
      },
      {
        heading: "Identity Locking and series",
        body:
          "Pro is the best choice for series with character consistency: 14 references hold identity across 9-10 frames. Formula: «Keep the person's facial features exactly the same as Image 1. 100% identical facial features, bone structure, skin tone» + a description of the new pose/emotion/scene.\n\nFor viral thumbnails it works in one pass: «character from Image 1 on the left, surprised expression, pointing at product on the right, yellow arrow, big outlined «WOW!» text, bold graphics.» For group scenes specify the identity of EACH character and lock that their clothing/appearance is stable across frames.",
      },
    ],
    examples: [
      {
        before: "viral youtube thumbnail",
        after:
          "Viral YouTube thumbnail, 16:9 landscape. Left side: the man from Image 1 (keep facial features 100% identical to reference), surprised expression, mouth open, pointing dramatically at the right side of the frame. Right side: a sleek black gaming laptop on a glossy desk. Center-bottom: bold yellow outlined text «MIND BLOWN», sans-serif heavy weight, slight 3D depth. Color palette: high-contrast yellow, magenta, deep black background with subtle radial glow behind the laptop. Style: high click-through-rate YouTube thumbnail aesthetic.",
        note:
          "Identity Locking, explicit purpose (viral thumbnail), exact text in quotes with font called out, color palette, format. Pro assembles a near-production-ready thumbnail in one pass.",
      },
      {
        before: "overcast documentary shot",
        after:
          "A weathered fisherman repairing a torn net on a wooden pier, late autumn morning. Overcast, muted desaturated palette, cool color temperature, dim ambient lighting, low contrast, faded vintage color grade, neutral exposure. No polished glamour, no commercial polish, raw documentary aesthetic. The look of news photojournalism — visible skin texture, weathered hands, worn jacket, no airbrushing. Shot on 35mm with mild film grain, slight desaturation.",
        note:
          "Anti-brightness-bias stack: color grade + anti-glamour + genre anchor. Without it Pro will «fix» the overcast mood and serve warm morning instead of documentary grey.",
      },
      {
        before: "financial report infographic",
        after:
          "Pitch-deck slide titled \"Annual Revenue Growth 2026\". Visualize a 4-quarter bar chart with values: \"Q1 $2.4M\", \"Q2 $3.1M\", \"Q3 $4.2M\", \"Q4 $5.8M\". Use Inter bold sans-serif for labels, brand color #1A73E8 for bars, subtle gridlines, clean white background. Subtitle below chart in smaller weight: \"45% YoY growth\". Bottom-right: brand logo placeholder labeled \"COMPANY\". Style: modern editorial infographic, crisp 4K rendering, no decorative noise.",
        note:
          "Pro is the only one in the family with production-ready dense text and number rendering. Font, hex color, and layout are explicit — the model assembles a near-final slide.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup on a thinking model",
        explain:
          "«woman, paris, cafe, golden, 4k, realistic» wastes 60% of Pro's potential. The model is trained on full sentences and its thinking mechanism reads connected descriptions, not tags. Write like a creative director briefing a photographer — long descriptive sentences with grammar double quality on the same set of words.",
      },
      {
        title: "Ignoring brightness bias",
        explain:
          "Pro defaults to bright, saturated, polished. For noir, documentary, candid, or horror this is a critical problem. Without an anti-glamour stack («overcast, muted, no polished glamour, raw documentary») the model will deliver «pretty» even when you asked for «truthful.» Stack 2-3 counter-moves at once.",
      },
      {
        title: "Re-describing every reference with 10+ loaded",
        explain:
          "At 8+ references, detailed descriptions stop working — the prompt turns into an overloaded list. The right move: «jacket from @ref2», «camera in the right hand (@ref3).» Assign each image a role in the scene. Without clear placement a reference gets ignored or wrecks the composition.",
      },
      {
        title: "Identity Locking forgotten on series",
        explain:
          "Without an explicit «keep facial features 100% identical to Image 1» the model changes face features frame to frame — even on the same model. For a 9-10 frame storyboard, Identity Locking repeats in every prompt, and clothing stabilization is mandatory («clothing and appearance remain stable across all frames»).",
      },
      {
        title: "Regenerating instead of conversational editing",
        explain:
          "Pro remembers session context and supports in-dialog edits. If the image is 80% there, don't rewrite the prompt to change lighting or color. Say: «great, now change the light to sunset, keep the rest.» This preserves character identity and is faster than a new seed.",
      },
    ],
    faq: [
      {
        q: "When Pro, when Nano Banana 2?",
        a: "Pro — 4+ characters in frame, hero brand assets, dense text on posters/packaging, infographics, ray-traced lighting, 9-10 frame storyboards, 10+ references, structural sketch control. NB2 — single portrait close-ups (less uncanny valley), macro skin, selfies, candid documentary, extreme aspect ratios, mass iteration (10 variants before finalizing). It's not «higher = better» — they're different tools.",
      },
      {
        q: "What is thinking mode and how does it affect output?",
        a: "Pro «thinks» by default — generating intermediate «reasoning» images to refine composition before the final render. This lets it solve visual problems, do «before/after» reasoning, use Google Search, and self-check. Generation takes longer, but first-pass quality is significantly higher — especially on complex scenes with infographics and many elements.",
      },
      {
        q: "Do JSON prompts work?",
        a: "Yes, Pro parses JSON structures well — it's one of the recommended approaches for complex scenes with many details. Structure: subject (description, expression, clothing), photography (camera_style, lighting, lens), background (setting, elements, atmosphere). This technique gives maximum control and is convenient for templating in production pipelines.",
      },
      {
        q: "How do I get film realism without the glossy AI look?",
        a: "Stack counter-moves against brightness bias: «overcast, muted desaturated palette, cool color temperature, dim ambient lighting, low contrast, faded vintage color grade, neutral exposure» + «no polished glamour, no commercial polish, raw documentary aesthetic» + a genre anchor «the look of news photojournalism.» Describe real imperfections: «visible pores, weathered skin, fabric wear, subtle film grain.» 2-3 counter-moves are required.",
      },
      {
        q: "How many references actually make sense to load?",
        a: "Pro holds up to 14 (6 high fidelity), but at 12+ expect some details to be dropped — the model can't fit it all. Optimal is 4-8 precisely placed references with an explicit role each («jacket from @ref2», «background from @ref7»). 14 vague refs are worse than 4 precise. Pre-select 2-3 most important and make sure they're described unambiguously — the rest become bonus, not base.",
      },
      {
        q: "Is multilingual in-image text supported?",
        a: "Yes, Pro is SOTA in the family for text rendering: Latin, Cyrillic, CJK (Chinese, Japanese, Korean), Arabic, Hindi, Bengali. Exact text always in quotes with font, size, color, and placement called out. For long copy add «EXACT» or «verbatim»: «label text (EXACT): \"Fresh and clean\".» For posters and packaging, only Pro in the family delivers a production-ready result.",
      },
      {
        q: "Does Opten support Nano Banana Pro?",
        a: "Yes, the Opten extension auto-detects Nano Banana Pro inside Google AI Studio and Gemini 3 Pro and scores prompts against the structure above: it checks for brief style instead of tag soup, Identity Locking on references, the anti-brightness-bias stack for documentary and noir, exact text in quotes, and role assignment on multi-reference prompts. One click gives you a rewrite that won't drift into commercial gloss.",
      },
    ],
  },
};
