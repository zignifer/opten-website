// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for mystic.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Mystic 2.5: структура, ошибки, примеры",
    description:
      "Как писать промпты для Mystic 2.5 от Freepik Pikaso: структура полных предложений, освещение и текстуры, типичные ошибки и подробные примеры до/после.",
    h1: "Mystic 2.5: как писать промпты, которые модель понимает",
    intro:
      "Mystic 2.5 — проприетарная image-модель Freepik на платформе Pikaso. Текст → изображение до 2K, поддержка референсов типа Style и Character через интерфейс Pikaso. Модель обучена понимать описательные предложения на естественном языке, а не списки тегов. Английский — основной язык; пиши как для фотографа, не как для поисковика.",
    sections: [
      {
        heading: "Что умеет Mystic 2.5",
        body:
          "Mystic 2.5 — собственная разработка Freepik для генерации в Pikaso. Не Stable Diffusion и не FLUX в чистом виде — проприетарная модель с собственной оптимизацией под коммерческую съёмку, портреты, editorial-фото и иллюстрацию.\n\nДоступна в Freepik Pikaso через веб-интерфейс с пресетами соотношений сторон (1:1, 4:3, 3:4, 16:9, 9:16), референсами типа Style (стиль) и Character (персонаж), и редактором композиции. Разрешение до 2K. Особенность — широкая поддержка визуальных стилей в одной модели: от photorealism до oil painting и concept art без необходимости переключать LoRA или модель.",
        bullets: [
          "Проприетарная модель Freepik в Pikaso",
          "До 2K разрешения",
          "Референсы: Style (стиль), Character (персонаж)",
          "Пресеты соотношений: 1:1, 4:3, 3:4, 16:9, 9:16",
          "Естественный язык, полные предложения, не tag soup",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Формула: [Субъект] + [Сцена/Окружение] + [Стиль/Художественное направление] + [Освещение/Настроение] + [Детали/Текстуры].\n\nПример: «An elderly woman in a vintage Chanel suit sitting at a sunlit Parisian café terrace, sipping espresso. Editorial photography style, soft golden hour light, shallow depth of field, warm muted tones, fine fabric texture visible.»\n\nКонкретизируй каждый блок. Расплывчатый «человек в кафе» даёт расплывчатый результат. «Пожилая женщина с серебристыми волосами в винтажном твидовом костюме Chanel, спокойное выражение лица, прямая осанка» — даёт точно то, что просили. Mystic 2.5 обучена на описательных текстах и хорошо реагирует на детализацию.",
      },
      {
        heading: "Естественный язык, не tag soup",
        body:
          "Главный антипаттерн на Mystic 2.5 — список тегов через запятую («woman, paris, cafe, golden, 4k, realistic»). Модель обучена понимать связные предложения как бриф для фотографа, не как набор ключевых слов для поисковика.\n\nПлохо: «woman paris cafe golden 4k realistic». Хорошо: «An elderly woman in a vintage Chanel suit sitting at a sunlit Parisian café.»\n\nЭто фундаментальный сдвиг для тех, кто пришёл с Midjourney или старых diffusion-моделей: на Mystic 2.5 длинное описательное предложение почти всегда побеждает короткий tag soup на ту же тему. Связные предложения дают модели контекст, который она интерпретирует целостно, а не пытается соединить разрозненные теги.",
      },
      {
        heading: "Освещение и художественный стиль",
        body:
          "Освещение формирует 50% атмосферы изображения. Конкретные термины дают контролируемый результат: golden hour, studio three-point lighting, dramatic side shadows, soft diffused natural light, neon glow, rim light, backlight. Без указания освещения модель выбирает сама — часто это нейтральный средний свет, который ни на что не работает.\n\nХудожественный стиль укажи явно. Mystic 2.5 поддерживает широкий диапазон: photorealism, illustration, cinematic, editorial, oil painting, concept art, anime, watercolor, documentary. Без явного указания модель выберет стиль по контексту — но контроль теряется. Для production-промптов всегда фиксируй стиль одной фразой: «Editorial photography style», «Concept art illustration», «Oil painting in the style of Old Masters».",
      },
      {
        heading: "Текстуры и детали материалов",
        body:
          "Текстуры делают изображение убедительным и «тактильным» — особенно критично для портретов и продуктовой съёмки. Без текстур результат получится «гладким» и AI-узнаваемым.\n\nДля портретов: «fine fabric texture visible», «natural skin pores», «soft wool weave», «leather strap with visible grain». Для продукта: «matte ceramic surface», «brushed steel», «soft velvet», «worn leather», «translucent silk». Для фона: «rough concrete», «peeling paint», «moss-covered stone», «wet asphalt with reflections».\n\nMystic 2.5 особенно силён в textile и fashion-съёмке — описание ткани в одной фразе даёт результат, близкий к коммерческой студийной съёмке.",
      },
    ],
    examples: [
      {
        before:
          "женщина в кафе",
        after:
          "An elderly woman with silver hair in a vintage Chanel tweed suit, sitting upright at a sunlit Parisian café terrace, calm expression, sipping espresso from a porcelain cup. Editorial photography style, soft golden hour light from the left, shallow depth of field, warm muted color palette, fine wool texture and porcelain glaze visible.",
        note:
          "Расплывчатый субъект заменён на конкретный (Chanel tweed, silver hair, calm expression). Локация уточнена (Parisian café terrace). Указан стиль (editorial), освещение (golden hour from the left), текстуры (wool, porcelain glaze).",
      },
      {
        before:
          "красивый продукт",
        after:
          "A premium matte black ceramic perfume bottle with a brushed gold cap, standing on a polished marble surface against a soft beige gradient background. Commercial product photography style, three-point studio lighting with a strong rim light on the right edge, shallow depth of field, fine matte ceramic surface texture, subtle reflection on the marble.",
        note:
          "Конкретные материалы (matte ceramic, brushed gold, polished marble), фон (beige gradient), студийное освещение (three-point, rim light справа), текстуры (matte surface, subtle reflection). Mystic 2.5 силён в продуктовой съёмке.",
      },
      {
        before:
          "концепт-арт для игры",
        after:
          "A lone armored knight standing at the edge of a misty cliff overlooking a vast medieval kingdom at dawn, intricate plate armor with weathered detail, longsword resting on his shoulder. Concept art illustration style for fantasy game, painterly brushwork, dramatic backlight from rising sun, muted desaturated palette with golden accents, atmospheric perspective.",
        note:
          "Явно указан стиль (concept art illustration for fantasy game), brushwork (painterly), освещение (dramatic backlight), цветокор (muted desaturated + golden). Без этого Mystic 2.5 мог бы дать фотореализм вместо концепт-арта.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup вместо предложений",
        explain:
          "«woman, paris, cafe, golden, 4k, realistic» — Mystic 2.5 обучена на описательных текстах, не на тегах. Список ключевых слов даёт обобщённый результат с потерей контекста. Пиши связные предложения как бриф для фотографа: «An elderly woman in a vintage Chanel suit sitting at a sunlit Parisian café terrace.»",
      },
      {
        title: "Расплывчатый субъект",
        explain:
          "«a person», «a thing», «a woman» — модель будет додумывать всё остальное по статистическому среднему. Получишь обобщённую блондинку или общий объект. Конкретизируй: внешность, одежда, поза, выражение лица. «An elderly woman with silver hair in a vintage tweed suit, calm expression, upright posture.»",
      },
      {
        title: "Отсутствие явного художественного стиля",
        explain:
          "Без указания стиля Mystic 2.5 выберет по контексту, и часто это будет нейтральный средний результат. Для production-промптов всегда фиксируй стиль одной фразой: «Editorial photography style», «Concept art illustration», «Oil painting style», «Cinematic documentary». Контроль над стилем удваивает контроль над результатом.",
      },
      {
        title: "Слишком короткий промпт (<10 слов)",
        explain:
          "Менее 10 слов дают обобщённый, неточный результат — модель додумает слишком много. Минимально рабочий промпт = субъект + сцена + стиль + освещение. Это ~25-40 слов как стартовая точка. Если описание не помещается — фокусируйся на главном, не на спам качества.",
      },
      {
        title: "Только негативные указания без описания желаемого",
        explain:
          "«No blur, no text, no watermark, no extra hands» без описания того, что НУЖНО — модель не получает достаточно сигнала о позитивной цели. Описывай желаемое содержание, негативные указания добавляй опционально в конец, не как основной метод. «Editorial portrait of an elderly woman, soft natural light, no watermark» — правильно.",
      },
    ],
    faq: [
      {
        q: "Чем Mystic 2.5 отличается от Stable Diffusion и FLUX?",
        a: "Mystic 2.5 — проприетарная модель Freepik, не Stable Diffusion и не FLUX в чистом виде. Она оптимизирована под коммерческую съёмку, портреты и editorial-фото с акцентом на текстуры и освещение. Доступна только в Freepik Pikaso через веб-интерфейс с пресетами и редактором композиции. Промпты Stable Diffusion (с весами, BREAK, LoRA-tags) сюда не портируются — нужны связные описательные предложения.",
      },
      {
        q: "Что такое референсы Style и Character в Pikaso?",
        a: "Это типы референсных изображений, доступные через интерфейс Pikaso. Style — модель копирует визуальный стиль (цветокор, освещение, эстетику) референса, но не композицию или субъект. Character — модель сохраняет внешность персонажа с референса в новой сцене или позе. Это аналоги IP-Adapter и ControlNet в более user-friendly обёртке.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Технически можно, но Freepik оптимизировала Mystic 2.5 под английский — это основной язык обучения. На сложных промптах с русским будут менее предсказуемые результаты, особенно в плане специфической терминологии (photography, cinematography, fashion). Рекомендация: основная масса промпта на английском, имена собственные и бренды можно оставлять как есть.",
      },
      {
        q: "Какая длина промпта оптимальна?",
        a: "25-80 слов в зависимости от сложности сцены. Минимум для рабочего промпта — субъект + сцена + стиль + освещение (~25-40 слов). Для сложных сцен с несколькими планами, реквизитом, специфическими текстурами — до 80 слов. Меньше 10 слов почти всегда даст обобщённый результат; больше 100 слов начинает терять фокус.",
      },
      {
        q: "Как добиться качества коммерческой студийной съёмки?",
        a: "Стек: «Commercial product photography style» (или «Editorial portrait style»), «three-point studio lighting» (или «soft natural window light»), конкретные текстуры (matte ceramic, brushed steel, fine wool), shallow depth of field, контрастный или нейтральный фон. Mystic 2.5 особенно силён именно в этом домене — продуктовая съёмка и портреты с явным брифом дают результат, близкий к настоящей студии.",
      },
      {
        q: "Какие соотношения сторон поддерживаются?",
        a: "В Pikaso есть пресеты: 1:1 (квадрат для соцсетей, аватаров), 4:3 и 3:4 (классические landscape/portrait), 16:9 (широкоформатный landscape для обложек и баннеров), 9:16 (вертикальный для Stories, Reels, TikTok). Соотношение задаётся в интерфейсе перед генерацией, не в тексте промпта. Это отличает Mystic 2.5 от моделей с `--ar` параметром.",
      },
      {
        q: "Поддерживается ли Opten для Mystic 2.5?",
        a: "Да, расширение Opten автоматически распознаёт Mystic 2.5 в Freepik Pikaso и оценивает промпты по структуре выше: проверяет связность предложений (не tag soup), конкретность субъекта, наличие явного художественного стиля, описание освещения и текстур, оптимальную длину 25-80 слов. Одним кликом получаешь rewrite в формате брифа для фотографа.",
      },
    ],
  },
  en: {
    title: "Mystic 2.5 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Freepik Pikaso's Mystic 2.5: full-sentence structure, lighting and textures, common mistakes, and detailed before/after examples.",
    h1: "Mystic 2.5: how to write prompts the model actually understands",
    intro:
      "Mystic 2.5 is Freepik's proprietary image model in the Pikaso platform. Text-to-image up to 2K, with Style and Character reference types via the Pikaso interface. The model is trained to understand descriptive sentences in natural language, not tag lists. English is the primary language; write for a photographer, not for a search engine.",
    sections: [
      {
        heading: "What Mystic 2.5 does",
        body:
          "Mystic 2.5 is Freepik's in-house model for generation in Pikaso. Not Stable Diffusion and not vanilla FLUX — a proprietary model with its own tuning toward commercial photography, portraits, editorial, and illustration.\n\nAvailable in Freepik Pikaso through a web interface with aspect-ratio presets (1:1, 4:3, 3:4, 16:9, 9:16), reference types Style and Character, and a composition editor. Resolution up to 2K. A notable trait — broad visual-style coverage in one model: from photorealism to oil painting and concept art without swapping LoRAs or models.",
        bullets: [
          "Freepik's proprietary model inside Pikaso",
          "Up to 2K resolution",
          "References: Style (visual style), Character (subject)",
          "Aspect ratio presets: 1:1, 4:3, 3:4, 16:9, 9:16",
          "Natural language, full sentences, no tag soup",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Formula: [Subject] + [Scene/Setting] + [Style/Artistic direction] + [Lighting/Mood] + [Details/Textures].\n\nExample: «An elderly woman in a vintage Chanel suit sitting at a sunlit Parisian café terrace, sipping espresso. Editorial photography style, soft golden hour light, shallow depth of field, warm muted tones, fine fabric texture visible.»\n\nConcretize every block. A vague «person in a café» yields a vague result. «An elderly woman with silver hair in a vintage tweed Chanel suit, calm expression, upright posture» gives exactly what was asked. Mystic 2.5 was trained on descriptive text and responds well to specificity.",
      },
      {
        heading: "Natural language, not tag soup",
        body:
          "The headline anti-pattern on Mystic 2.5 — a comma-separated tag list («woman, paris, cafe, golden, 4k, realistic»). The model was trained to understand connected sentences as a photographer's brief, not as a search-engine keyword set.\n\nBad: «woman paris cafe golden 4k realistic.» Good: «An elderly woman in a vintage Chanel suit sitting at a sunlit Parisian café.»\n\nThis is a fundamental shift for anyone coming from Midjourney or older diffusion models: on Mystic 2.5 a long descriptive sentence almost always beats a short tag soup on the same topic. Connected sentences give the model context it interprets holistically, instead of stitching disconnected tags.",
      },
      {
        heading: "Lighting and artistic style",
        body:
          "Lighting drives 50% of atmosphere. Specific terms give controllable results: golden hour, studio three-point lighting, dramatic side shadows, soft diffused natural light, neon glow, rim light, backlight. Without a lighting call the model picks for you — often neutral middle light that doesn't work for anything.\n\nState the artistic style explicitly. Mystic 2.5 supports a wide range: photorealism, illustration, cinematic, editorial, oil painting, concept art, anime, watercolor, documentary. Without an explicit call the model picks by context — but control is lost. For production prompts always lock the style in one phrase: «Editorial photography style», «Concept art illustration», «Oil painting in the style of Old Masters.»",
      },
      {
        heading: "Textures and material details",
        body:
          "Textures make an image convincing and «tactile» — especially critical for portraits and product photography. Without textures the result comes out «smooth» and AI-recognizable.\n\nFor portraits: «fine fabric texture visible», «natural skin pores», «soft wool weave», «leather strap with visible grain.» For products: «matte ceramic surface», «brushed steel», «soft velvet», «worn leather», «translucent silk.» For backgrounds: «rough concrete», «peeling paint», «moss-covered stone», «wet asphalt with reflections.»\n\nMystic 2.5 is especially strong in textile and fashion photography — a single fabric phrase gets you close to a commercial studio result.",
      },
    ],
    examples: [
      {
        before: "woman in a café",
        after:
          "An elderly woman with silver hair in a vintage Chanel tweed suit, sitting upright at a sunlit Parisian café terrace, calm expression, sipping espresso from a porcelain cup. Editorial photography style, soft golden hour light from the left, shallow depth of field, warm muted color palette, fine wool texture and porcelain glaze visible.",
        note:
          "The vague subject is replaced with a concrete one (Chanel tweed, silver hair, calm expression). The location is specified (Parisian café terrace). Style (editorial), lighting (golden hour from the left), and textures (wool, porcelain glaze) are all explicit.",
      },
      {
        before: "beautiful product",
        after:
          "A premium matte black ceramic perfume bottle with a brushed gold cap, standing on a polished marble surface against a soft beige gradient background. Commercial product photography style, three-point studio lighting with a strong rim light on the right edge, shallow depth of field, fine matte ceramic surface texture, subtle reflection on the marble.",
        note:
          "Concrete materials (matte ceramic, brushed gold, polished marble), background (beige gradient), studio lighting (three-point, rim light on the right), textures (matte surface, subtle reflection). Mystic 2.5 shines in product photography.",
      },
      {
        before: "concept art for a game",
        after:
          "A lone armored knight standing at the edge of a misty cliff overlooking a vast medieval kingdom at dawn, intricate plate armor with weathered detail, longsword resting on his shoulder. Concept art illustration style for fantasy game, painterly brushwork, dramatic backlight from rising sun, muted desaturated palette with golden accents, atmospheric perspective.",
        note:
          "Style is explicit (concept art illustration for fantasy game), brushwork (painterly), lighting (dramatic backlight), color grade (muted desaturated + golden). Without this Mystic 2.5 could drift into photorealism instead of concept art.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup instead of sentences",
        explain:
          "«woman, paris, cafe, golden, 4k, realistic» — Mystic 2.5 was trained on descriptive text, not on tags. A keyword list yields generic results with lost context. Write connected sentences as a photographer's brief: «An elderly woman in a vintage Chanel suit sitting at a sunlit Parisian café terrace.»",
      },
      {
        title: "Vague subject",
        explain:
          "«A person», «a thing», «a woman» — the model fills in everything else from the statistical mean. You get a generic blonde or a generic object. Be specific: appearance, clothing, pose, expression. «An elderly woman with silver hair in a vintage tweed suit, calm expression, upright posture.»",
      },
      {
        title: "No explicit artistic style",
        explain:
          "Without a style call Mystic 2.5 picks by context, and often that's a neutral middle-of-the-road result. For production prompts always lock the style in one phrase: «Editorial photography style», «Concept art illustration», «Oil painting style», «Cinematic documentary.» Control over style doubles control over output.",
      },
      {
        title: "Prompt too short (<10 words)",
        explain:
          "Under 10 words yields generic, unfocused results — the model fills in too much. A minimum viable prompt = subject + scene + style + lighting. That's ~25-40 words as a starting point. If your description won't fit — focus on the essentials, not quality spam.",
      },
      {
        title: "Only negative instructions without describing what you want",
        explain:
          "«No blur, no text, no watermark, no extra hands» without describing what IS wanted — the model lacks enough signal about the positive goal. Describe the desired content; add negative instructions optionally at the end, not as the primary method. «Editorial portrait of an elderly woman, soft natural light, no watermark» — correct.",
      },
    ],
    faq: [
      {
        q: "How is Mystic 2.5 different from Stable Diffusion and FLUX?",
        a: "Mystic 2.5 is Freepik's proprietary model, not Stable Diffusion and not vanilla FLUX. It's tuned for commercial photography, portraits, and editorial work, with emphasis on textures and lighting. Available only in Freepik Pikaso via a web interface with presets and a composition editor. Stable Diffusion prompts (weights, BREAK, LoRA tags) don't port here — you need connected descriptive sentences.",
      },
      {
        q: "What are Style and Character references in Pikaso?",
        a: "These are reference-image types available through the Pikaso interface. Style — the model copies the visual style of the reference (color grade, lighting, aesthetics) but not the composition or subject. Character — the model preserves the appearance of a character from the reference in a new scene or pose. These are user-friendly wrappers around IP-Adapter and ControlNet concepts.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "Technically yes, but Freepik tuned Mystic 2.5 for English — that's the primary training language. Complex prompts in other languages get less predictable results, especially around specialized terminology (photography, cinematography, fashion). Recommendation: keep the bulk of the prompt in English; proper nouns and brand names can stay as-is.",
      },
      {
        q: "What's the optimal prompt length?",
        a: "25-80 words depending on scene complexity. The minimum viable prompt is subject + scene + style + lighting (~25-40 words). For complex scenes with multiple planes, props, and specific textures — up to 80 words. Under 10 words almost always gives a generic result; over 100 words starts losing focus.",
      },
      {
        q: "How do I achieve commercial studio-photo quality?",
        a: "Stack: «Commercial product photography style» (or «Editorial portrait style»), «three-point studio lighting» (or «soft natural window light»), concrete textures (matte ceramic, brushed steel, fine wool), shallow depth of field, contrasting or neutral background. Mystic 2.5 is especially strong in this domain — product photos and portraits with an explicit brief get close to a real studio result.",
      },
      {
        q: "Which aspect ratios are supported?",
        a: "Pikaso has presets: 1:1 (square for social feeds, avatars), 4:3 and 3:4 (classic landscape/portrait), 16:9 (widescreen landscape for covers and banners), 9:16 (vertical for Stories, Reels, TikTok). Aspect ratio is set in the interface before generation, not in the prompt text. This distinguishes Mystic 2.5 from models with an `--ar` parameter.",
      },
      {
        q: "Does Opten support Mystic 2.5?",
        a: "Yes, the Opten extension auto-detects Mystic 2.5 inside Freepik Pikaso and scores prompts against the structure above: it checks sentence connectivity (no tag soup), subject specificity, presence of an explicit artistic style, lighting and texture description, and optimal 25-80 word length. One click gives you a rewrite in a photographer's-brief format.",
      },
    ],
  },
};
