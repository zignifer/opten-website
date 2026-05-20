// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for imagen-4.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Imagen 4: структура, ошибки, примеры",
    description:
      "Как писать промпты для Google Imagen 4: фреймворк SCULPT, продвинутый рендер текста с правильным кернингом, кинематографический язык, ошибки и примеры.",
    h1: "Imagen 4: как писать промпты, которые модель понимает",
    intro:
      "Imagen 4 — image-модель Google нового поколения с улучшенной типографикой и ультра-фотореализмом. Работает на естественном языке, оптимизирована под английский, поддерживает чёткий рендер текста с правильным кернингом. Идёт в трёх версиях — Fast, стандарт и Ultra; все используют единую структуру промптов и до 10× быстрее Imagen 3.",
    sections: [
      {
        heading: "Что умеет Imagen 4",
        body:
          "Imagen 4 — один из лидеров по фотореалистичной генерации: волосы, кожа, текстуры тканей рендерятся на уровне студийной съёмки; капли воды, отражения и преломление света физически правдоподобны. Поддерживаются соотношения 1:1, 4:3, 3:4, 9:16, 16:9, разрешение до 1024×1024 (зависит от платформы).\n\nГлавный прорыв перед конкурентами — продвинутый рендер текста: чёткий, читаемый, с правильным кернингом. Подходит для постеров, упаковки, вывесок и брендированных макетов. Контент-фильтры Google блокируют реалистичные лица публичных персон, NSFW, насилие и копирайт. Negative prompt не поддерживается.",
        bullets: [
          "Три версии: Fast (черновики), стандарт (баланс), Ultra (premium)",
          "Продвинутая типографика с правильным кернингом",
          "Ультра-фотореализм: кожа, ткани, отражения",
          "До 10× быстрее Imagen 3 (Fast)",
          "Соотношения 1:1, 4:3, 3:4, 9:16, 16:9",
        ],
      },
      {
        heading: "Структура промпта и фреймворк SCULPT",
        body:
          "Оптимальный порядок: [Тип изображения/стиль] + [Субъект с деталями] + [Действие/поза] + [Окружение/сцена] + [Освещение] + [Ракурс/композиция] + [Материалы/текстуры] + [Настроение/атмосфера].\n\nФреймворк SCULPT даёт удобный чек-лист: Subject («battle-hardened samurai in white porcelain armor»), Context («misty bamboo grove at dawn»), Unique details («armor adorned with intricate blue paintings»), Lighting («soft dappled light filtering through the canopy»), Perspective («dramatic close-up, low angle, shallow depth of field»), Tone/Theme («Akira Kurosawa style, high-contrast black and white»). Рекомендованная длина — 50–300 слов на естественном английском.",
      },
      {
        heading: "Рендер текста: главное преимущество Imagen 4",
        body:
          "Imagen 4 — модель уровня state-of-the-art по типографике. Чёткий текст на вывесках, постерах, упаковке с корректным кернингом и межбуквенными интервалами. Чтобы попасть в кадр без искажений, нужны три обязательных условия:\n\nТочный текст в кавычках («reads \"Tasty Burger\"»). Описание стиля шрифта — «large, bold, groovy white bubble typography», «handwritten script», «vintage serif». Явное расположение — «at the top», «on the banner», «above the entrance». Чем конкретнее описан шрифт и его положение, тем точнее результат — особенно для брендинга и маркетинговых макетов.",
      },
      {
        heading: "Кинематографический стек и текстуры",
        body:
          "Imagen 4 отлично реагирует на профессиональную фото/кино-терминологию. Камера и объектив: «Leica M10», «50mm Summilux», «ARRI Alexa», «anamorphic lens». Плёнка: «Cinestill 50D», «Kodak Vision3 500T», «Kodak Portra 400», «35mm film grain». Диафрагма «shot at f/2.0» контролирует глубину резкости. Пост-обработка: «color grading», «LUT», «digital intermediate», «film emulation».\n\nДля материалов используй физические описания: «porcelain carapace with intricate blue paintings», «worn leather with visible stitching and patina», «iridescent feathers with subtle hues of lavender and rose gold». Для сложных сцен описывай слои — «In the foreground… In the middle ground… The background shows…» — это даёт модели понятную композиционную иерархию.",
      },
      {
        heading: "Версии Imagen 4: Fast, стандарт, Ultra",
        body:
          "Три версии используют одинаковую структуру промптов, но рассчитаны на разные задачи. Imagen 4 Fast — самая быстрая, для черновиков, итераций и тестирования идей; качество хорошее, скорость до 10× выше Imagen 3.\n\nImagen 4 (стандарт) — баланс качества и скорости, дефолт для маркетинга, контента и большинства production-задач. Imagen 4 Ultra — максимальная детализация и верность промпту: микро-текстуры (поры, нити, швы), сложные многофигурные сцены, лучший рендер текста в семействе. Ultra медленнее, но раскрывается на длинных детальных промптах (100–400 слов).",
      },
    ],
    examples: [
      {
        before: "самурай в красивых доспехах",
        after:
          "A battle-hardened samurai in white porcelain armor adorned with intricate blue paintings, standing in a misty bamboo grove at dawn, soft dappled light filtering through the canopy, dramatic close-up at low angle, shallow depth of field, cinematic tension, Akira Kurosawa style, high-contrast color palette with earthy neutrals and splashes of deep crimson, shot on 35mm film with subtle grain.",
        note:
          "Полный SCULPT в одном промпте: субъект с уникальными деталями (porcelain armor, blue paintings), контекст (misty bamboo grove), освещение (dappled light), перспектива (close-up, low angle, f/2.0), тон (Kurosawa style).",
      },
      {
        before: "постер с надписью бургер",
        after:
          "Vintage burger restaurant poster, large bold groovy white bubble typography at the top reads \"Tasty Burger\", subtitle in handwritten red script below reads \"since 1972\", warm orange background with subtle paper texture, hand-painted lettering style with playful tilt, centered composition, editorial layout, muted earth tones, photorealistic print quality.",
        note:
          "Имя бренда и подпись в кавычках с разными шрифтами, явное расположение, цветовая палитра, материал фона — Imagen 4 собирает почти production-ready макет.",
      },
      {
        before: "девушка с рыжими волосами в городе",
        after:
          "Editorial fashion photograph of a young woman with vibrant copper-red hair styled in loose waves, wearing a tailored cream wool coat over a black turtleneck, walking through a rain-slicked Tokyo street at blue hour, neon reflections in puddles, shot on Leica M10 with 50mm Summilux lens at f/2.0, shallow depth of field with creamy bokeh, Cinestill 50D film stock, cinematic color grading with cool blue and amber highlights, layered composition with soft background blur.",
        note:
          "Кинематографический стек целиком: камера, объектив, диафрагма, плёнка, цветокоррекция. Детализация одежды и волос задействует сильные стороны Imagen 4 в фотореализме.",
      },
    ],
    mistakes: [
      {
        title: "Теги через запятую вместо связных предложений",
        explain:
          "Imagen 4 оптимизирован под natural language. «Girl, red coat, Tokyo, neon, bokeh, cinematic» работает хуже, чем связное описание. Пиши промпт как бриф для фотографа: цельные предложения с осмысленным порядком, конкретными деталями и логичными связками между элементами.",
      },
      {
        title: "Собственные имена из фикшена для фотореализма",
        explain:
          "Запрос «photorealistic image of Valyria» модель ассоциирует с фэнтези-иллюстрациями и concept art. Для фотореалистичного стиля описывай характеристики: «glorious titanic city with Greco-Roman architecture» вместо «Valyria», «epic warrior in golden plate armor» вместо «Achilles».",
      },
      {
        title: "Негативные формулировки",
        explain:
          "Imagen не поддерживает negative prompt. «No trees, no clouds, without shadows» либо игнорируется, либо наоборот добавляет упомянутые объекты. Описывай позитивно: «clear blue sky», «empty street», «bright noon lighting» вместо «no clouds», «no people», «no shadows».",
      },
      {
        title: "Запрос на лица публичных персон",
        explain:
          "Контент-фильтр Google блокирует реалистичные изображения известных людей — политиков, актёров, музыкантов. Замени конкретное имя на описание характеристик («a man in his 50s with grey hair and a sharp suit») или переключи стиль в editorial/concept-art, где использование имени не требуется.",
      },
      {
        title: "Конфликтующие стили или перегруженный промпт",
        explain:
          "«Photorealistic anime watercolor oil painting» создаёт неконтролируемый микс. Промпт больше 500 слов без чёткой иерархии важности приводит к конфликту инструкций. Выбирай один основной стиль и держи длину в диапазоне 50–300 слов с главным субъектом в начале.",
      },
    ],
    faq: [
      {
        q: "Чем Imagen 4 отличается от Imagen 3?",
        a: "Imagen 4 принёс четыре главных апгрейда: продвинутый рендер текста (читаемая типографика с правильным кернингом), ультра-фотореализм (волосы, кожа, ткани на уровне студийной фотографии), скорость до 10× быстрее в версии Fast, и улучшенное следование промпту в сложных сценах. Структура промпта остаётся той же — естественный язык, фреймворк SCULPT, кинематографическая лексика.",
      },
      {
        q: "Когда использовать Fast, стандарт и Ultra?",
        a: "Fast — для черновиков, A/B-тестов и быстрых итераций, когда нужно проверить идею. Стандарт — дефолт для маркетинга, контента и большинства production-задач, оптимальный баланс качества и скорости. Ultra — для финальных изображений, печати, premium-контента, сложных многофигурных сцен и длинных детальных промптов 100–400 слов. Все три используют одинаковую структуру промпта.",
      },
      {
        q: "Поддерживает ли Imagen 4 негативные промпты?",
        a: "Нет, negative prompt в Imagen 4 не поддерживается — это принципиальное отличие от Stable Diffusion и Kling. Все формулировки «no», «without», «not» либо игнорируются, либо приводят к обратному эффекту. Описывай только то, что нужно увидеть: вместо «no clouds» — «clear blue sky», вместо «no people» — «empty street», вместо «not blurry» — «sharp focus, high detail».",
      },
      {
        q: "Как добиться чёткого текста в кадре?",
        a: "Три обязательных условия: точный текст всегда в кавычках («reads \"Coffee Shop\"»), явное описание стиля шрифта («bold sans-serif», «handwritten script», «vintage serif»), и явное расположение в кадре («at the top», «on the banner», «above the entrance»). Imagen 4 — лучшая на рынке модель для типографики, но требует конкретики. Длинный текст лучше разбивать на несколько коротких блоков.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Можно, но качество заметно ниже. Imagen 4 оптимизирован под английский, и на других языках модель чаще ошибается с деталями, теряет стилистические нюансы и хуже понимает кинематографическую лексику («ARRI Alexa», «Cinestill 50D»). Для production-задач переводи промпт на английский. Для экспериментов и быстрых черновиков русский допустим, но не оптимален.",
      },
      {
        q: "Какая оптимальная длина промпта?",
        a: "Для стандартной версии — 50–300 слов на естественном английском. Для Ultra — 100–400 слов, модель раскрывается на длинных детальных описаниях. Меньше 10 слов — модель додумает слишком много самостоятельно. Больше 500 слов без чёткой иерархии создаёт конфликты между инструкциями. Главный субъект всегда в первом предложении — модель приоритизирует начало промпта.",
      },
      {
        q: "Поддерживается ли Opten для Imagen 4?",
        a: "Да, расширение Opten автоматически распознаёт Imagen 4 внутри ImageFX, Vertex AI, Google AI Studio и Freepik. Оценивает промпты по фреймворку SCULPT: проверяет наличие субъекта в начале, контекст, освещение, перспективу и тон. Точку с типографикой Opten проверяет отдельно — точный текст в кавычках, описание шрифта, расположение. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Imagen 4 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Google Imagen 4: SCULPT framework, advanced in-image text rendering, cinematic vocabulary, mistakes, and before/after examples.",
    h1: "Imagen 4: how to write prompts the model actually understands",
    intro:
      "Imagen 4 is Google's next-generation image model with upgraded typography and ultra-photorealism. It works on natural language, is optimized for English, and supports crisp in-image text with proper kerning. It ships in three versions — Fast, standard, and Ultra; all share the same prompt structure and Fast is up to 10x quicker than Imagen 3.",
    sections: [
      {
        heading: "What Imagen 4 does well",
        body:
          "Imagen 4 is among the leaders in photorealistic generation: hair, skin, and fabric textures render at studio-photography quality; water droplets, reflections, and light refraction are physically plausible. It supports 1:1, 4:3, 3:4, 9:16, 16:9 aspect ratios up to 1024×1024 (platform-dependent).\n\nThe headline advantage over competitors is advanced text rendering: clear, legible type with correct kerning. It works for posters, packaging, signage, and branded layouts. Google's content filters block realistic faces of public figures, NSFW content, violence, and copyrighted material. Negative prompts are not supported.",
        bullets: [
          "Three versions: Fast (drafts), standard (balanced), Ultra (premium)",
          "Advanced typography with proper kerning",
          "Ultra-photorealism: skin, fabrics, reflections",
          "Up to 10x faster than Imagen 3 (Fast)",
          "Aspect ratios 1:1, 4:3, 3:4, 9:16, 16:9",
        ],
      },
      {
        heading: "Prompt structure and the SCULPT framework",
        body:
          "Optimal order: [Image type/style] + [Subject with details] + [Action/pose] + [Setting/scene] + [Lighting] + [Angle/composition] + [Materials/textures] + [Mood/atmosphere].\n\nThe SCULPT framework gives a convenient checklist: Subject («battle-hardened samurai in white porcelain armor»), Context («misty bamboo grove at dawn»), Unique details («armor adorned with intricate blue paintings»), Lighting («soft dappled light filtering through the canopy»), Perspective («dramatic close-up, low angle, shallow depth of field»), Tone/Theme («Akira Kurosawa style, high-contrast black and white»). Recommended length: 50–300 words in natural English.",
      },
      {
        heading: "Text rendering: the Imagen 4 superpower",
        body:
          "Imagen 4 is a state-of-the-art typography model. Crisp text on signs, posters, and packaging, with correct kerning and letter spacing. To land it cleanly in frame, three things are required:\n\nExact text in quotes («reads \"Tasty Burger\"»). Font style described — «large, bold, groovy white bubble typography», «handwritten script», «vintage serif». Explicit placement — «at the top», «on the banner», «above the entrance». The more concrete the font and its placement, the more accurate the result — especially for branding and marketing layouts.",
      },
      {
        heading: "Cinematic stack and textures",
        body:
          "Imagen 4 responds beautifully to professional photo/film vocabulary. Camera and lens: «Leica M10», «50mm Summilux», «ARRI Alexa», «anamorphic lens». Film: «Cinestill 50D», «Kodak Vision3 500T», «Kodak Portra 400», «35mm film grain». Aperture «shot at f/2.0» controls depth of field. Post-processing: «color grading», «LUT», «digital intermediate», «film emulation».\n\nFor materials, use physical descriptions: «porcelain carapace with intricate blue paintings», «worn leather with visible stitching and patina», «iridescent feathers with subtle hues of lavender and rose gold». For complex scenes describe layers — «In the foreground… In the middle ground… The background shows…» — giving the model a clear compositional hierarchy.",
      },
      {
        heading: "Versions: Fast, standard, Ultra",
        body:
          "All three versions share the same prompt structure but target different tasks. Imagen 4 Fast — the quickest, for drafts, iterations, and idea testing; quality is good and it's up to 10x faster than Imagen 3.\n\nImagen 4 (standard) — balanced quality and speed, the default for marketing, content, and most production work. Imagen 4 Ultra — maximum detail and prompt fidelity: micro-textures (pores, threads, stitches), complex multi-figure scenes, the best text rendering in the family. Ultra is slower but rewards long, detailed prompts (100–400 words).",
      },
    ],
    examples: [
      {
        before: "samurai in beautiful armor",
        after:
          "A battle-hardened samurai in white porcelain armor adorned with intricate blue paintings, standing in a misty bamboo grove at dawn, soft dappled light filtering through the canopy, dramatic close-up at low angle, shallow depth of field, cinematic tension, Akira Kurosawa style, high-contrast color palette with earthy neutrals and splashes of deep crimson, shot on 35mm film with subtle grain.",
        note:
          "Full SCULPT in one prompt: subject with unique details (porcelain armor, blue paintings), context (misty bamboo grove), lighting (dappled light), perspective (close-up, low angle, f/2.0), tone (Kurosawa style).",
      },
      {
        before: "burger poster with text",
        after:
          "Vintage burger restaurant poster, large bold groovy white bubble typography at the top reads \"Tasty Burger\", subtitle in handwritten red script below reads \"since 1972\", warm orange background with subtle paper texture, hand-painted lettering style with playful tilt, centered composition, editorial layout, muted earth tones, photorealistic print quality.",
        note:
          "Brand name and caption in quotes with distinct fonts, explicit placement, color palette, background material — Imagen 4 assembles a near production-ready layout.",
      },
      {
        before: "red-haired girl in a city",
        after:
          "Editorial fashion photograph of a young woman with vibrant copper-red hair styled in loose waves, wearing a tailored cream wool coat over a black turtleneck, walking through a rain-slicked Tokyo street at blue hour, neon reflections in puddles, shot on Leica M10 with 50mm Summilux lens at f/2.0, shallow depth of field with creamy bokeh, Cinestill 50D film stock, cinematic color grading with cool blue and amber highlights, layered composition with soft background blur.",
        note:
          "The full cinematic stack: camera, lens, aperture, film, color grading. Detailed clothing and hair description leverages Imagen 4's photorealism strengths.",
      },
    ],
    mistakes: [
      {
        title: "Comma-separated tags instead of coherent sentences",
        explain:
          "Imagen 4 is optimized for natural language. «Girl, red coat, Tokyo, neon, bokeh, cinematic» performs worse than a connected description. Write the prompt as a brief for a photographer: complete sentences with meaningful order, concrete details, and logical links between elements.",
      },
      {
        title: "Fictional proper names for photorealism",
        explain:
          "A prompt like «photorealistic image of Valyria» triggers the model to associate it with fantasy illustrations and concept art. For a photorealistic style, describe characteristics: «glorious titanic city with Greco-Roman architecture» instead of «Valyria»; «epic warrior in golden plate armor» instead of «Achilles».",
      },
      {
        title: "Negative phrasing",
        explain:
          "Imagen doesn't support a negative prompt. «No trees, no clouds, without shadows» is either ignored or, paradoxically, adds the mentioned objects. Phrase positively: «clear blue sky», «empty street», «bright noon lighting» instead of «no clouds», «no people», «no shadows».",
      },
      {
        title: "Requests for public figures' faces",
        explain:
          "Google's content filter blocks realistic images of famous people — politicians, actors, musicians. Swap the specific name for a description of characteristics («a man in his 50s with grey hair and a sharp suit») or switch the style to editorial/concept art where naming isn't required.",
      },
      {
        title: "Conflicting styles or an overloaded prompt",
        explain:
          "«Photorealistic anime watercolor oil painting» creates an uncontrolled mix. A prompt over 500 words without a clear hierarchy of importance leads to conflicting instructions. Pick one primary style and keep the length between 50–300 words with the main subject in the opening sentence.",
      },
    ],
    faq: [
      {
        q: "How is Imagen 4 different from Imagen 3?",
        a: "Imagen 4 brings four major upgrades: advanced text rendering (legible typography with proper kerning), ultra-photorealism (hair, skin, fabric at studio-photography quality), up to 10x speed in the Fast version, and improved prompt following in complex scenes. The prompt structure stays the same — natural language, the SCULPT framework, cinematic vocabulary.",
      },
      {
        q: "When should I use Fast, standard, or Ultra?",
        a: "Use Fast for drafts, A/B tests, and quick iterations when you're validating an idea. Standard is the default for marketing, content, and most production tasks — the best balance of quality and speed. Use Ultra for final images, print, premium content, complex multi-figure scenes, and long detailed prompts of 100–400 words. All three use the same prompt structure.",
      },
      {
        q: "Does Imagen 4 support negative prompts?",
        a: "No, negative prompts are not supported in Imagen 4 — a fundamental difference from Stable Diffusion and Kling. Phrasings with «no», «without», «not» are either ignored or trigger the opposite effect. Describe only what should appear: instead of «no clouds» use «clear blue sky»; instead of «no people» use «empty street»; instead of «not blurry» use «sharp focus, high detail».",
      },
      {
        q: "How do I get clean in-frame text?",
        a: "Three required conditions: exact text always in quotes («reads \"Coffee Shop\"»), explicit font style («bold sans-serif», «handwritten script», «vintage serif»), and explicit placement in the frame («at the top», «on the banner», «above the entrance»). Imagen 4 is the best-in-class typography model, but it needs specifics. Split long text into several short blocks for cleaner results.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "You can, but quality drops noticeably. Imagen 4 is optimized for English, and in other languages the model misses details more often, loses stylistic nuance, and struggles with cinematic vocabulary («ARRI Alexa», «Cinestill 50D»). For production work, translate the prompt to English. For experiments and quick drafts other languages are acceptable but suboptimal.",
      },
      {
        q: "What's the optimal prompt length?",
        a: "For the standard version, 50–300 words of natural English. For Ultra, 100–400 words — the model rewards long detailed descriptions. Under 10 words the model fills in too much on its own. Over 500 words without a clear hierarchy creates conflicting instructions. The main subject always goes in the first sentence — the model prioritizes the opening of the prompt.",
      },
      {
        q: "Does Opten support Imagen 4?",
        a: "Yes, the Opten extension auto-detects Imagen 4 inside ImageFX, Vertex AI, Google AI Studio, and Freepik. It scores prompts against the SCULPT framework: checking for the subject up front, context, lighting, perspective, and tone. Typography is scored separately — exact text in quotes, font description, placement. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
