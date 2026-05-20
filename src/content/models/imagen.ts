// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for imagen.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Google Imagen: структура, ошибки, примеры",
    description:
      "Как писать промпты для Google Imagen: фреймворк SCULPT, естественный язык вместо тегов, рендер текста на изображении, типичные ошибки и примеры до и после.",
    h1: "Google Imagen: как писать промпты, которые модель понимает",
    intro:
      "Google Imagen — семейство image-моделей от Google, доступное через ImageFX, Vertex AI и Freepik. Понимает естественный язык лучше, чем списки тегов через запятую, оптимизировано под английский и поддерживает читаемый текст на изображениях. Негативный промпт не поддерживается — описывай, что нужно, а не то, чего быть не должно.",
    sections: [
      {
        heading: "Что умеет Google Imagen",
        body:
          "Imagen — это text-to-image модель: рендерит фотореалистичные кадры, иллюстрации, графический дизайн и кинематографические сцены до 1024×1024 в популярных соотношениях (1:1, 4:3, 3:4, 9:16, 16:9). В отличие от Stable Diffusion, модель построена на естественном языке — связные предложения работают лучше, чем теги через запятую.\n\nГлавное прикладное преимущество — рендер текста прямо в изображении: вывески, постеры, заголовки, упаковка. Точный текст указывается в кавычках, дополнительно прописывается шрифт и расположение. Контент-фильтры Google блокируют реалистичные лица публичных персон, NSFW и насилие.",
        bullets: [
          "Естественный язык вместо тегов через запятую",
          "Рендер читаемого текста на изображениях",
          "Соотношения 1:1, 4:3, 3:4, 9:16, 16:9",
          "Широкий стилевой диапазон: фотореализм, иллюстрация, концепт-арт",
          "Негативные промпты не поддерживаются — только позитивные формулировки",
        ],
      },
      {
        heading: "Структура промпта и фреймворк SCULPT",
        body:
          "Оптимальный порядок: [Тип изображения/стиль] + [Субъект] + [Действие/поза] + [Окружение/сцена] + [Освещение] + [Композиция/ракурс] + [Детали материалов/текстур] + [Настроение/атмосфера].\n\nДля построения промпта удобен фреймворк SCULPT: Subject (кто/что), Context (где), Unique details (текстуры и материалы), Lighting (тип света — golden hour, rim light, chiaroscuro), Perspective (ракурс — close-up, low angle, aerial), Tone/Theme (cinematic, noir, dreamy, editorial). Не обязательно использовать все шесть элементов — но чем конкретнее описание, тем точнее результат. Минимум 10 слов, рекомендованный диапазон — 50–300 слов.",
      },
      {
        heading: "Рендер текста на изображениях",
        body:
          "Imagen умеет генерировать читаемый текст внутри изображения — вывески, плакаты, заголовки, обложки. Чтобы попасть в кадр без искажений, нужны три вещи:\n\nТочный текст в кавычках («reads \"OPEN\"», «sign that says \"Coffee Bar\"»). Стиль шрифта прописывается отдельно: «bold sans-serif», «handwritten script», «neon lettering», «hand-painted lettering». Расположение указывается явно: «at the top», «on the banner», «above the entrance», «on the sign».\n\nДля коротких надписей результат стабильный. Длинный текст без кавычек модель часто искажает — добавляет лишние буквы или меняет порядок. Запросы на лица публичных персон блокируются content-фильтром.",
      },
      {
        heading: "Кинематографический язык и текстуры",
        body:
          "Imagen хорошо реагирует на профессиональную фото- и кино-лексику. Камера и объектив: «shot on Arri Alexa», «Leica M10, 50mm Summilux lens», «anamorphic lens». Плёнка: «Cinestill 50D», «Kodak Vision3 500T», «Kodak Portra», «35mm film grain». Пост-обработка: «color grading», «LUT», «digital intermediate».\n\nДля материалов работают физические описания: «porcelain carapace with intricate blue paintings», «worn leather with visible stitching», «gleaming golden armor with Byzantine mosaics», «moss-covered stone with subtle signs of age». Стилевые отсылки тоже допустимы — «in the style of Studio Ghibli», «Akira Kurosawa cinematography», «Frostpunk aesthetic» — но для фотореализма имена из фикшена лучше заменять описанием характеристик.",
      },
    ],
    examples: [
      {
        before: "красивая девушка в платье на улице",
        after:
          "Editorial fashion photograph of a young woman with copper-red hair wearing a flowing emerald silk dress, walking through a sunlit Parisian street, golden hour rim light, shallow depth of field, shot on 35mm film, Kodak Portra 400, warm cinematic color grading, layered composition with soft bokeh in background.",
        note:
          "Главные изменения: конкретные детали внешности и одежды, явное окружение, профессиональная фото-лексика (плёнка, объектив, глубина резкости), указание ракурса и освещения.",
      },
      {
        before: "плакат с надписью кафе",
        after:
          "Vintage café poster, large bold serif typography at the top reading \"BROOKLYN COFFEE\", subtitle in handwritten script reading \"since 1982\", warm cream background, hand-painted lettering style, subtle paper texture, muted earth tones, editorial layout, centered composition.",
        note:
          "Точный текст в кавычках, отдельные указания шрифта для заголовка и подзаголовка, расположение, фон и стиль — собирает почти production-ready макет.",
      },
      {
        before: "эпический дракон в горах",
        after:
          "Cinematic concept art of a massive ancient dragon with iridescent emerald scales perched on a moss-covered mountain peak, volumetric god rays piercing through morning mist, low angle wide shot, dramatic chiaroscuro lighting, Peter Jackson epic style, rich earthy tones with golden highlights, particle effects of floating ash, high-resolution digital painting.",
        note:
          "SCULPT в работе: субъект, контекст, уникальные детали (iridescent scales, moss), освещение (god rays, chiaroscuro), перспектива (low angle wide), тон (Peter Jackson epic style).",
      },
    ],
    mistakes: [
      {
        title: "Список тегов через запятую вместо естественных предложений",
        explain:
          "Imagen построен на natural language — связное описание работает значительно лучше, чем «girl, red dress, street, sunset, bokeh, cinematic». Пиши промпт как краткий бриф для фотографа: связные предложения, конкретные детали, осмысленный порядок.",
      },
      {
        title: "Негативные формулировки в основном промпте",
        explain:
          "Imagen не поддерживает negative prompt. Фразы вроде «without people», «no clouds», «not blurry» либо игнорируются, либо наоборот добавляют упомянутые элементы. Описывай только то, что нужно видеть на изображении — позитивные формулировки.",
      },
      {
        title: "Собственные имена из фикшена для фотореализма",
        explain:
          "Запрос «photorealistic image of Valyria» или «realistic photo of Gandalf» модель ассоциирует с книжными иллюстрациями и concept art из обучающих данных. Для фотореалистичного стиля описывай характеристики: «glorious titanic city with Greco-Roman architecture» вместо имени.",
      },
      {
        title: "Слишком короткий или перегруженный промпт",
        explain:
          "Промпт меньше 10 слов оставляет модели слишком много свободы — она «додумывает» сцену по-своему. Промпт больше 500 слов без чёткой иерархии создаёт конфликты между элементами. Оптимально 50–300 слов с главным субъектом в начале.",
      },
      {
        title: "Конфликтующие стили в одном промпте",
        explain:
          "«Photorealistic anime watercolor oil painting» — модель не знает, какой стиль выбрать, и выдаёт неконтролируемый микс. Определись с одним основным стилем (фотореализм, иллюстрация, концепт-арт) и используй вспомогательные стилистические маркеры внутри него.",
      },
    ],
    faq: [
      {
        q: "Поддерживает ли Imagen негативные промпты?",
        a: "Нет, в отличие от Stable Diffusion и Kling, Google Imagen не поддерживает negative prompt как отдельное поле. Все попытки описать «чего не должно быть» внутри основного промпта либо игнорируются, либо наоборот добавляют упомянутые объекты в кадр. Описывай позитивно: вместо «no clouds» используй «clear blue sky», вместо «not blurry» — «sharp focus».",
      },
      {
        q: "Какое оптимальное соотношение сторон выбрать?",
        a: "Imagen поддерживает пять стандартных соотношений: 1:1 для социальных сетей и аватаров, 4:3 и 3:4 для презентаций и карточек товаров, 16:9 для обложек YouTube и баннеров, 9:16 для Stories, Reels и TikTok. Выбирай исходя из конечной площадки, а не «универсального» 1:1 — модель оптимизирует композицию под целевое соотношение.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Можно, но не рекомендуется. Imagen оптимизирован под английский, и качество на русском заметно снижается — модель чаще ошибается с деталями, теряет стилистические нюансы и хуже понимает кинематографическую лексику. Для production-задач переводи промпт на английский, для экспериментов и быстрых черновиков русский допустим.",
      },
      {
        q: "Как добиться чёткого текста на изображении?",
        a: "Три обязательных условия: точный текст в кавычках («reads \"Coffee\"»), явное указание стиля шрифта («bold sans-serif», «handwritten script»), и расположение в кадре («at the top», «on the banner»). Для коротких надписей до 3–5 слов результат стабильный. Длинный текст модель часто искажает — разбивай на несколько коротких блоков с явным расположением каждого.",
      },
      {
        q: "Почему Imagen отказывается генерировать?",
        a: "Контент-фильтры Google блокируют четыре основные категории: реалистичные лица публичных персон (политики, актёры, музыканты), NSFW-контент, сцены насилия, материалы с защищённым копирайтом. Фильтр семантический — обходить эвфемизмами не получится. Если получаешь отказ, замени конкретное имя на описание характеристик или переформулируй сцену в editorial/concept-art стиль.",
      },
      {
        q: "Чем Imagen отличается от Midjourney и DALL-E?",
        a: "Главные отличия: Imagen построен на естественном языке (Midjourney тоже, но с параметрами вроде --ar, которые в Imagen не работают), сильнее в рендере текста на изображениях, оптимизирован под фотореализм и кинематографические сцены. Параметры синтаксиса Midjourney (`--ar 16:9`, `--stylize`) и DALL-E попадают в текст промпта как мусор — используй естественные описания.",
      },
      {
        q: "Поддерживается ли Opten для Google Imagen?",
        a: "Да, расширение Opten автоматически распознаёт Google Imagen внутри ImageFX и других платформ Google AI, оценивает промпты по описанной выше структуре: проверяет естественный язык, наличие субъекта в начале, точный текст в кавычках для типографики, фотографическую лексику. Одним кликом можно получить rewrite в правильной структуре SCULPT.",
      },
    ],
  },
  en: {
    title: "Google Imagen Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Google Imagen: the SCULPT framework, natural language over tags, in-image text rendering, common mistakes, and before/after examples.",
    h1: "Google Imagen: how to write prompts the model actually understands",
    intro:
      "Google Imagen is Google's family of image models available through ImageFX, Vertex AI, and Freepik. It understands natural language better than comma-separated tag lists, is optimized for English, and supports legible in-image text. Negative prompts are not supported — describe what should be there, not what shouldn't.",
    sections: [
      {
        heading: "What Google Imagen does well",
        body:
          "Imagen is a text-to-image model: it renders photorealistic shots, illustrations, graphic design, and cinematic scenes up to 1024×1024 in standard aspect ratios (1:1, 4:3, 3:4, 9:16, 16:9). Unlike Stable Diffusion, the model is built around natural language — coherent sentences work better than tag lists.\n\nThe key practical advantage is in-image text rendering: signs, posters, headlines, packaging. Exact text goes in quotes; font style and placement are specified separately. Google's content filters block realistic faces of public figures, NSFW content, and violence.",
        bullets: [
          "Natural language instead of comma-separated tags",
          "Legible in-image text rendering",
          "Aspect ratios 1:1, 4:3, 3:4, 9:16, 16:9",
          "Wide stylistic range: photorealism, illustration, concept art",
          "Negative prompts not supported — positive phrasing only",
        ],
      },
      {
        heading: "Prompt structure and the SCULPT framework",
        body:
          "Optimal order: [Image type/style] + [Subject] + [Action/pose] + [Setting/scene] + [Lighting] + [Composition/angle] + [Material/texture details] + [Mood/atmosphere].\n\nThe SCULPT framework is a handy checklist: Subject (who/what), Context (where), Unique details (textures, materials), Lighting (type of light — golden hour, rim light, chiaroscuro), Perspective (angle — close-up, low angle, aerial), Tone/Theme (cinematic, noir, dreamy, editorial). You don't have to use all six — but the more concrete the description, the more accurate the result. Minimum 10 words, recommended range 50–300 words.",
      },
      {
        heading: "In-image text rendering",
        body:
          "Imagen can render legible text inside an image — signs, posters, headlines, covers. To land in the frame without distortion, three things are required:\n\nExact text in quotes («reads \"OPEN\"», «sign that says \"Coffee Bar\"»). Font style stated separately: «bold sans-serif», «handwritten script», «neon lettering», «hand-painted lettering». Placement specified explicitly: «at the top», «on the banner», «above the entrance», «on the sign».\n\nFor short labels the result is stable. Long text without quotes is often mangled — the model adds extra letters or scrambles the order. Requests for the faces of public figures are blocked by the content filter.",
      },
      {
        heading: "Cinematic vocabulary and textures",
        body:
          "Imagen responds well to professional photo and film vocabulary. Camera and lens: «shot on Arri Alexa», «Leica M10, 50mm Summilux lens», «anamorphic lens». Film: «Cinestill 50D», «Kodak Vision3 500T», «Kodak Portra», «35mm film grain». Post-processing: «color grading», «LUT», «digital intermediate».\n\nFor materials, physical descriptions work: «porcelain carapace with intricate blue paintings», «worn leather with visible stitching», «gleaming golden armor with Byzantine mosaics», «moss-covered stone with subtle signs of age». Style references are also fine — «in the style of Studio Ghibli», «Akira Kurosawa cinematography», «Frostpunk aesthetic» — but for photorealism, replace fictional names with descriptions of characteristics.",
      },
    ],
    examples: [
      {
        before: "beautiful girl in a dress on the street",
        after:
          "Editorial fashion photograph of a young woman with copper-red hair wearing a flowing emerald silk dress, walking through a sunlit Parisian street, golden hour rim light, shallow depth of field, shot on 35mm film, Kodak Portra 400, warm cinematic color grading, layered composition with soft bokeh in background.",
        note:
          "Key changes: concrete details of appearance and clothing, explicit setting, professional photo vocabulary (film stock, lens, depth of field), specified angle and lighting.",
      },
      {
        before: "poster with a café sign",
        after:
          "Vintage café poster, large bold serif typography at the top reading \"BROOKLYN COFFEE\", subtitle in handwritten script reading \"since 1982\", warm cream background, hand-painted lettering style, subtle paper texture, muted earth tones, editorial layout, centered composition.",
        note:
          "Exact text in quotes, separate font directives for headline and subtitle, placement, background, and style — produces a nearly production-ready layout.",
      },
      {
        before: "epic dragon in the mountains",
        after:
          "Cinematic concept art of a massive ancient dragon with iridescent emerald scales perched on a moss-covered mountain peak, volumetric god rays piercing through morning mist, low angle wide shot, dramatic chiaroscuro lighting, Peter Jackson epic style, rich earthy tones with golden highlights, particle effects of floating ash, high-resolution digital painting.",
        note:
          "SCULPT in action: subject, context, unique details (iridescent scales, moss), lighting (god rays, chiaroscuro), perspective (low angle wide), tone (Peter Jackson epic style).",
      },
    ],
    mistakes: [
      {
        title: "Comma-separated tag list instead of natural sentences",
        explain:
          "Imagen is built on natural language — coherent description works significantly better than «girl, red dress, street, sunset, bokeh, cinematic». Write the prompt as a short brief for a photographer: connected sentences, concrete details, meaningful order.",
      },
      {
        title: "Negative phrasing in the main prompt",
        explain:
          "Imagen doesn't support a negative prompt. Phrases like «without people», «no clouds», «not blurry» are either ignored or, paradoxically, add the mentioned elements. Describe only what should be in the image — positive phrasing only.",
      },
      {
        title: "Proper names from fiction for photorealistic shots",
        explain:
          "Requests like «photorealistic image of Valyria» or «realistic photo of Gandalf» trigger the model to associate them with book illustrations and concept art from training data. For a photorealistic style, describe characteristics: «glorious titanic city with Greco-Roman architecture» instead of the name.",
      },
      {
        title: "Prompts that are too short or overloaded",
        explain:
          "A prompt under 10 words gives the model too much freedom — it «fills in» the scene on its own. A prompt over 500 words without clear hierarchy creates conflicts between elements. The sweet spot is 50–300 words with the main subject up front.",
      },
      {
        title: "Conflicting styles in a single prompt",
        explain:
          "«Photorealistic anime watercolor oil painting» — the model can't pick a style and outputs an uncontrolled mix. Commit to one primary style (photorealism, illustration, concept art) and use supporting stylistic markers within it.",
      },
    ],
    faq: [
      {
        q: "Does Imagen support negative prompts?",
        a: "No. Unlike Stable Diffusion and Kling, Google Imagen does not support a negative prompt as a separate field. All attempts to describe «what shouldn't be there» inside the main prompt are either ignored or, paradoxically, add the mentioned objects to the frame. Phrase positively: instead of «no clouds» use «clear blue sky»; instead of «not blurry» use «sharp focus».",
      },
      {
        q: "Which aspect ratio should I choose?",
        a: "Imagen supports five standard ratios: 1:1 for social media and avatars, 4:3 and 3:4 for presentations and product cards, 16:9 for YouTube covers and banners, 9:16 for Stories, Reels, and TikTok. Pick based on the final destination, not a «universal» 1:1 — the model optimizes composition for the target aspect.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "You can, but it's not recommended. Imagen is optimized for English, and quality in other languages drops noticeably — the model misses details more often, loses stylistic nuance, and struggles with cinematic vocabulary. For production tasks, translate the prompt into English; for experiments and quick drafts other languages are acceptable.",
      },
      {
        q: "How do I get clean in-image text?",
        a: "Three required conditions: exact text in quotes («reads \"Coffee\"»), explicit font style («bold sans-serif», «handwritten script»), and placement in the frame («at the top», «on the banner»). For short labels up to 3–5 words the result is stable. Long text is often mangled — split it into several short blocks with explicit placement for each.",
      },
      {
        q: "Why does Imagen refuse to generate?",
        a: "Google's content filters block four main categories: realistic faces of public figures (politicians, actors, musicians), NSFW content, scenes of violence, and material under copyright. The filter is semantic — euphemisms won't get around it. If you get a refusal, swap the specific name for a description of characteristics, or reframe the scene in an editorial / concept-art style.",
      },
      {
        q: "How is Imagen different from Midjourney and DALL-E?",
        a: "Main differences: Imagen is built on natural language (Midjourney is too, but uses parameters like --ar that don't work in Imagen), is stronger at in-image text rendering, and is optimized for photorealism and cinematic scenes. Midjourney and DALL-E syntax (`--ar 16:9`, `--stylize`) ends up as literal noise in the prompt — use natural descriptions instead.",
      },
      {
        q: "Does Opten support Google Imagen?",
        a: "Yes, the Opten extension auto-detects Google Imagen inside ImageFX and other Google AI surfaces, scoring prompts against the structure outlined above: it checks for natural language, the subject up front, exact text in quotes for typography, and photography vocabulary. One click gives you a rewrite in the correct SCULPT structure.",
      },
    ],
  },
};
