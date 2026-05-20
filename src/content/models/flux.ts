// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for flux.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для FLUX: структура, ошибки, примеры",
    description:
      "Как писать промпты для FLUX от Black Forest Labs: связные описания, фото-терминология камеры, многослойные сцены, типичные ошибки и примеры до/после.",
    h1: "FLUX: как писать промпты, которые модель понимает",
    intro:
      "FLUX — семейство image-моделей от Black Forest Labs (schnell, dev, pro, 1.1 pro Ultra, FLUX.2, Kontext). Двойной энкодер CLIP + T5-XXL понимает длинные связные описания лучше большинства конкурентов. Оптимальная длина промпта — 50–200 слов на английском, структура — субъект, сцена, освещение, стиль, параметры камеры.",
    sections: [
      {
        heading: "Что умеет FLUX",
        body:
          "Главная сила FLUX — понимание естественного описательного языка. Модель обучена на длинных подписях и интерпретирует связный текст значительно точнее, чем модели на одном CLIP. Это даёт преимущество в портретах, пейзажах с многослойной композицией и продуктовой съёмке.\n\nFLUX отлично работает с фото-терминологией: объективы, диафрагма, глубина резкости, типы освещения. Поддерживает текст в изображениях через кавычки, разные арт-стили (от photorealism до акварели и concept art), и многослойные сцены с описанием переднего, среднего и заднего плана.",
        bullets: [
          "Двойной энкодер CLIP + T5-XXL — понимает длинные описания",
          "До ~2000 токенов промпта, оптимально 50–200 слов",
          "Несколько вариантов: schnell (быстрая), dev (опенсорс), pro (макс. качество)",
          "Текст в изображениях через кавычки",
          "Photo-grade лексика: 85mm, f/2.8, shallow DOF, golden hour",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Субъект] + [Детали внешности] + [Сцена/Фон] + [Освещение] + [Стиль/Настроение] + [Камера/Техника] + [Цветовая палитра].\n\nПиши связные предложения, а не список ключевых слов. «A close-up portrait of a middle-aged man with a thick dark beard, wearing a leather jacket, standing in front of an urban graffiti wall, soft sunlight casting shadows on his face, documentary photography, shot on 85mm lens, warm muted tones» работает значительно лучше, чем «man, beard, leather jacket, graffiti, warm tones».\n\nИспользуй многослойное описание сцены — передний план, средний, задний. Это даёт модели чёткую пространственную структуру.",
      },
      {
        heading: "Освещение и камера",
        body:
          "FLUX отлично понимает фото-терминологию. Указывай конкретное освещение: «golden hour with warm tones», «soft morning light casting long shadows», «studio three-point lighting», «neon glow with cyberpunk palette». Общие фразы вроде «good lighting» дают слабый результат.\n\nДля фотореализма используй параметры камеры: «shot with a 50mm lens at f/2.8, shallow depth of field, blurred background», «wide-angle 24mm, deep focus», «macro photography, extreme close-up». Конкретные технические термины работают в разы лучше, чем общие «8K, ultra HD, hyperrealistic».",
      },
      {
        heading: "Стилизация и художественные ссылки",
        body:
          "Конкретные стилевые ссылки бьют абстрактные. «In the style of 1980s cyberpunk» лучше, чем «futuristic». «Inspired by the surrealism of Salvador Dali», «impressionist painting with visible brushstrokes», «editorial fashion photography» — модель распознаёт жанры, эпохи и техники.\n\nFLUX поддерживает широкий стилевой диапазон: photorealism, oil painting, watercolor, concept art, anime, vector illustration. Не смешивай конфликтующие стили в одном промпте — «cyberpunk and medieval» или «photorealistic watercolor» дают непредсказуемый результат. Если нужна стилистическая смесь, опиши её явно.",
      },
      {
        heading: "Что НЕ работает в FLUX",
        body:
          "FLUX не поддерживает синтаксис Stable Diffusion. Веса вида `(word:1.5)` или `word++` не работают и попадают в промпт как мусор. Регулируй важность через порядок слов — главное в начало.\n\nКачественные бустеры «masterpiece, best quality, ultra HD, 8K» подряд тоже почти не помогают (в отличие от SD). Лучше использовать конкретные стилевые и камерные термины. В FLUX.1 [dev] фраза «white background» вызывает размытые изображения — описывай фон конкретнее: «soft grey studio backdrop». Негативные формулировки вида «no ugly faces, no bad anatomy» менее эффективны, чем позитивное описание желаемого качества.",
      },
    ],
    examples: [
      {
        before: "красивая девушка на пляже",
        after:
          "A young woman with sun-streaked auburn hair in a flowing white linen dress, standing on a Pacific Northwest beach at golden hour. Wind catches her hair, soft warm light skims her shoulders. Shallow depth of field, shot on 85mm lens at f/1.8, blurred ocean in background, muted coastal palette, editorial fashion photography.",
        note:
          "Главное отличие: связное предложение вместо списка ключевиков, конкретный субъект, многослойная сцена (передний/задний план), фото-терминология камеры, конкретное освещение.",
      },
      {
        before: "fantasy landscape, mountains, dragon, epic, 8k, masterpiece",
        after:
          "A wide-angle view of jagged snow-capped peaks at dawn, mist swirling over the icy ridges. In the foreground, a lone red dragon perches on a stone outcrop looking toward the horizon. Vibrant orange-pink sky behind the range, dramatic warm rim light, cinematic concept art style inspired by Frank Frazetta, deep focus.",
        note:
          "Список ключевых слов через запятую FLUX обрабатывает хуже связного описания. Quality-бустеры заменены на конкретный стиль и художественную ссылку, добавлена многослойная композиция.",
      },
      {
        before: "vintage diner sign",
        after:
          "A weathered neon sign on a brick wall above a roadside diner at twilight. The sign reads \"JOE'S DINER\" in bold red script letters with cyan accents, some bulbs flickering. Wet asphalt below reflects the neon glow. 35mm film photography, shallow DOF, moody desaturated palette, Edward Hopper atmosphere.",
        note:
          "Текст в кавычках — обязательно для рендеринга надписи. Конкретный шрифт, цвет, эпоха и атмосфера дают модели полный визуальный контекст.",
      },
    ],
    mistakes: [
      {
        title: "Список ключевых слов вместо связного описания",
        explain:
          "FLUX обучена на длинных подписях и обрабатывает связный английский лучше любых списков через запятую. «dragon, fire, sky, sunset, mountains, epic» проигрывает «A red dragon breathes fire into a sunset sky over distant mountains, dramatic backlit silhouette». Пиши предложениями.",
      },
      {
        title: "Использование синтаксиса Stable Diffusion",
        explain:
          "Веса вида `(keyword:1.5)`, `word++`, embeddings или LoRA-ссылки в FLUX не работают и попадают в промпт как литеральный текст. Регулируй приоритеты порядком слов — важное в начало, второстепенное в конец. Для усиления — «with emphasis on» или «with a focus on».",
      },
      {
        title: "Quality-бустеры без конкретики",
        explain:
          "«masterpiece, best quality, 8K, ultra HD, hyperrealistic» подряд — типичный SD-паттерн, который в FLUX почти не влияет на результат. Конкретные камерные термины («85mm at f/1.8», «shallow DOF», «golden hour») и стилевые ссылки («editorial fashion photography») работают в разы лучше.",
      },
      {
        title: "Конфликтующие стили в одном промпте",
        explain:
          "«cyberpunk and medieval», «photorealistic watercolor», «minimalist detailed» — взаимоисключающие указания сбивают модель и дают непредсказуемый результат. Если нужна стилистическая смесь, опиши её явно: «realistic photography with subtle painterly post-processing».",
      },
      {
        title: "«White background» в FLUX.1 [dev]",
        explain:
          "Специфическая проблема dev-варианта: фраза «white background» вызывает размытые, нечёткие изображения. Используй конкретное описание фона — «a soft grey studio backdrop», «seamless paper background, soft diffused light», «neutral cream-colored backdrop». В pro и schnell проблема менее выражена, но конкретика всё равно полезна.",
      },
    ],
    faq: [
      {
        q: "В чём разница между schnell, dev, pro и 1.1 pro Ultra?",
        a: "[schnell] — быстрая 4-шаговая модель под Apache 2.0, подходит для прототипирования и быстрых тестов. [dev] — опенсорс с 20+ шагами, хорошее качество для разработки и некоммерческого использования. [pro] — лучшее качество через API с коммерческой лицензией. [1.1 pro] Ultra поддерживает разрешение до 2752×2752 и Raw mode для крупной печати и детализированных изображений.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Технически да, но качество заметно хуже. FLUX оптимизирована под английский — двойной энкодер CLIP + T5-XXL обучен преимущественно на англоязычных данных. Для production-задач используй английский. Для экспериментов на русском результат будет рабочим, но менее точным в деталях, стилях и интерпретации сцены.",
      },
      {
        q: "Как FLUX рендерит текст в изображениях?",
        a: "Очень хорошо — FLUX.1 [pro] и [max] одни из лучших моделей в этой категории. Используй кавычки для точного текста: «A neon sign reading \"OPEN 24/7\" on a dark brick wall». Указывай шрифт, размер, цвет и расположение. Для брендов и редких слов модель работает чище, чем большинство конкурентов, но длинный текст без кавычек может быть искажён.",
      },
      {
        q: "Какая оптимальная длина промпта?",
        a: "50–200 слов — золотая середина. Меньше 10 слов — модель додумывает слишком много, результат непредсказуем. Больше 200 слов — теряются приоритеты, мелкие детали проигрывают композиции. Технический лимит около 2000 токенов T5-XXL, но качество начинает падать задолго до него. Лучше плотное описание из 100 слов, чем растянутое из 300.",
      },
      {
        q: "Поддерживает ли FLUX негативные промпты?",
        a: "Частично. Можно указать что исключить — «no text, no watermarks, no blur» или «without people, no human figures» в конце промпта. Но негативные формулировки без позитивной альтернативы менее эффективны, чем явное описание желаемого. «Clean composition without distractions» работает лучше, чем «no clutter, no extra objects, no mess».",
      },
      {
        q: "Чем FLUX отличается от Stable Diffusion и Midjourney?",
        a: "В отличие от SD, FLUX использует двойной энкодер (CLIP + T5-XXL) и понимает длинные связные описания, а не теги через запятую. В отличие от Midjourney, FLUX не имеет параметров типа `--ar 16:9` и `--stylize` — соотношение сторон задаётся параметрами платформы. По качеству FLUX [pro] и [1.1 pro] Ultra сравнимы с топами рынка, особенно в photorealism и тексте.",
      },
      {
        q: "Поддерживается ли Opten для FLUX?",
        a: "Да, расширение Opten автоматически распознаёт FLUX в поддерживаемых платформах и оценивает промпты по структуре, описанной выше: проверяет наличие связного описания вместо ключевых слов, конкретного освещения, камерных терминов для photorealism, отсутствия SD-синтаксиса. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "FLUX Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Black Forest Labs FLUX: coherent descriptions, camera vocabulary, layered scenes, common mistakes, and before/after examples.",
    h1: "FLUX: how to write prompts the model actually understands",
    intro:
      "FLUX is a family of image models from Black Forest Labs (schnell, dev, pro, 1.1 pro Ultra, FLUX.2, Kontext). Its dual CLIP + T5-XXL text encoder understands long coherent descriptions better than most competitors. Optimal prompt length is 50–200 English words, structured as subject, scene, lighting, style, and camera parameters.",
    sections: [
      {
        heading: "What FLUX does well",
        body:
          "FLUX's core strength is natural descriptive language. The model was trained on long captions and interprets coherent prose noticeably better than single-CLIP models. This pays off in portraits, layered landscape composition, and product photography.\n\nThe model handles photo vocabulary cleanly: lenses, aperture, depth of field, lighting types. It supports in-image text via quotes, a wide stylistic range (from photorealism to watercolor and concept art), and multi-layered scenes describing foreground, midground, and background.",
        bullets: [
          "Dual CLIP + T5-XXL encoder — understands long descriptions",
          "Up to ~2000 prompt tokens, optimal 50–200 words",
          "Multiple variants: schnell (fast), dev (open-source), pro (max quality)",
          "In-image text via quotes",
          "Photo-grade vocabulary: 85mm, f/2.8, shallow DOF, golden hour",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject] + [Appearance details] + [Scene/Background] + [Lighting] + [Style/Mood] + [Camera/Technique] + [Color palette].\n\nWrite coherent sentences, not keyword lists. «A close-up portrait of a middle-aged man with a thick dark beard, wearing a leather jacket, standing in front of an urban graffiti wall, soft sunlight casting shadows on his face, documentary photography, shot on 85mm lens, warm muted tones» beats «man, beard, leather jacket, graffiti, warm tones» significantly.\n\nUse layered scene descriptions — foreground, midground, background. This gives the model a clear spatial structure to work with.",
      },
      {
        heading: "Lighting and camera",
        body:
          "FLUX handles photo terminology well. Specify concrete lighting: «golden hour with warm tones», «soft morning light casting long shadows», «studio three-point lighting», «neon glow with cyberpunk palette». Generic phrases like «good lighting» yield weak results.\n\nFor photorealism use camera parameters: «shot with a 50mm lens at f/2.8, shallow depth of field, blurred background», «wide-angle 24mm, deep focus», «macro photography, extreme close-up». Concrete technical terms work far better than generic «8K, ultra HD, hyperrealistic».",
      },
      {
        heading: "Style and artistic references",
        body:
          "Concrete style references beat abstract ones. «In the style of 1980s cyberpunk» outperforms «futuristic». «Inspired by the surrealism of Salvador Dali», «impressionist painting with visible brushstrokes», «editorial fashion photography» — the model recognizes genres, eras, and techniques.\n\nFLUX supports a wide stylistic range: photorealism, oil painting, watercolor, concept art, anime, vector illustration. Don't mix conflicting styles in one prompt — «cyberpunk and medieval» or «photorealistic watercolor» produce unpredictable output. If a stylistic blend is needed, describe it explicitly.",
      },
      {
        heading: "What does NOT work in FLUX",
        body:
          "FLUX doesn't support Stable Diffusion syntax. Weights like `(word:1.5)` or `word++` don't work and end up as literal noise in the prompt. Regulate emphasis through word order — important content first.\n\nQuality boosters «masterpiece, best quality, ultra HD, 8K» strung together barely move the result either (unlike in SD). Concrete style and camera terms work better. In FLUX.1 [dev], the phrase «white background» causes blurry, low-quality images — describe the background concretely: «a soft grey studio backdrop». Negative formulations like «no ugly faces, no bad anatomy» are less effective than positive descriptions of desired quality.",
      },
    ],
    examples: [
      {
        before: "beautiful girl on the beach",
        after:
          "A young woman with sun-streaked auburn hair in a flowing white linen dress, standing on a Pacific Northwest beach at golden hour. Wind catches her hair, soft warm light skims her shoulders. Shallow depth of field, shot on 85mm lens at f/1.8, blurred ocean in background, muted coastal palette, editorial fashion photography.",
        note:
          "Key change: coherent sentence instead of a keyword list, concrete subject, layered scene (foreground/background), camera vocabulary, specific lighting.",
      },
      {
        before: "fantasy landscape, mountains, dragon, epic, 8k, masterpiece",
        after:
          "A wide-angle view of jagged snow-capped peaks at dawn, mist swirling over the icy ridges. In the foreground, a lone red dragon perches on a stone outcrop looking toward the horizon. Vibrant orange-pink sky behind the range, dramatic warm rim light, cinematic concept art style inspired by Frank Frazetta, deep focus.",
        note:
          "Comma-separated keywords work worse than coherent description. Quality boosters replaced with a concrete style and an artistic reference, plus a layered composition.",
      },
      {
        before: "vintage diner sign",
        after:
          "A weathered neon sign on a brick wall above a roadside diner at twilight. The sign reads \"JOE'S DINER\" in bold red script letters with cyan accents, some bulbs flickering. Wet asphalt below reflects the neon glow. 35mm film photography, shallow DOF, moody desaturated palette, Edward Hopper atmosphere.",
        note:
          "Text in quotes is required for legible rendering. Concrete font, color, era, and atmosphere give the model the full visual context.",
      },
    ],
    mistakes: [
      {
        title: "Keyword list instead of coherent description",
        explain:
          "FLUX is trained on long captions and processes coherent English better than any comma-separated lists. «dragon, fire, sky, sunset, mountains, epic» loses to «A red dragon breathes fire into a sunset sky over distant mountains, dramatic backlit silhouette». Write sentences.",
      },
      {
        title: "Using Stable Diffusion syntax",
        explain:
          "Weights like `(keyword:1.5)`, `word++`, embeddings, or LoRA references don't work in FLUX and land in the prompt as literal text. Regulate priorities by word order — important content first, secondary at the end. For emphasis, use «with emphasis on» or «with a focus on».",
      },
      {
        title: "Quality boosters without specifics",
        explain:
          "«masterpiece, best quality, 8K, ultra HD, hyperrealistic» strung together is a typical SD pattern that barely influences FLUX output. Concrete camera terms («85mm at f/1.8», «shallow DOF», «golden hour») and style references («editorial fashion photography») work many times better.",
      },
      {
        title: "Conflicting styles in one prompt",
        explain:
          "«cyberpunk and medieval», «photorealistic watercolor», «minimalist detailed» — mutually exclusive directions confuse the model and produce unpredictable output. If a stylistic blend is needed, describe it explicitly: «realistic photography with subtle painterly post-processing».",
      },
      {
        title: "«White background» in FLUX.1 [dev]",
        explain:
          "A dev-specific issue: the phrase «white background» causes blurry, unclear images. Use a concrete background description — «a soft grey studio backdrop», «seamless paper background, soft diffused light», «neutral cream-colored backdrop». Less pronounced in pro and schnell, but specificity still helps.",
      },
    ],
    faq: [
      {
        q: "What is the difference between schnell, dev, pro, and 1.1 pro Ultra?",
        a: "[schnell] is the fast 4-step model under Apache 2.0, ideal for prototyping and quick tests. [dev] is open source with 20+ steps, good quality for development and non-commercial use. [pro] is the highest quality via API with a commercial license. [1.1 pro] Ultra supports up to 2752×2752 resolution and Raw mode for large print and highly detailed images.",
      },
      {
        q: "Can prompts be written in languages other than English?",
        a: "Technically yes, but quality drops noticeably. FLUX is optimized for English — the dual CLIP + T5-XXL encoder was trained predominantly on English data. Use English for production tasks. For experiments in other languages output will work, but be less accurate in details, styles, and scene interpretation.",
      },
      {
        q: "How does FLUX render in-image text?",
        a: "Very well — FLUX.1 [pro] and [max] are among the best in this category. Use quotes for exact text: «A neon sign reading \"OPEN 24/7\" on a dark brick wall». Specify font, size, color, and placement. For brands and rare words the model handles letters cleaner than most competitors, though long unquoted text can be mangled.",
      },
      {
        q: "What is the optimal prompt length?",
        a: "50–200 words is the sweet spot. Under 10 words means the model invents too much and output becomes unpredictable. Over 200 words and priorities are lost — small details lose out to composition. The technical T5-XXL limit is roughly 2000 tokens, but quality degrades well before that. A dense 100-word prompt beats a sprawling 300-word one.",
      },
      {
        q: "Does FLUX support negative prompts?",
        a: "Partially. Exclusions can be appended — «no text, no watermarks, no blur» or «without people, no human figures» at the end of the prompt. But negative formulations without a positive alternative are less effective than describing what you want explicitly. «Clean composition without distractions» beats «no clutter, no extra objects, no mess».",
      },
      {
        q: "How is FLUX different from Stable Diffusion and Midjourney?",
        a: "Unlike SD, FLUX uses a dual encoder (CLIP + T5-XXL) and understands long coherent descriptions rather than comma-separated tags. Unlike Midjourney, FLUX has no `--ar 16:9` or `--stylize` parameters — aspect ratio is set via platform parameters. Quality-wise FLUX [pro] and [1.1 pro] Ultra are comparable to top-tier competitors, especially in photorealism and text rendering.",
      },
      {
        q: "Does Opten support FLUX?",
        a: "Yes, the Opten extension auto-detects FLUX on supported platforms and scores prompts against the structure outlined above: it checks for coherent descriptions instead of keyword lists, concrete lighting, camera terms for photorealism, and absence of SD syntax. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
