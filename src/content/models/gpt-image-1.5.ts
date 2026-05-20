// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for gpt-image-1.5.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для GPT Image 1.5: структура, ошибки, примеры",
    description:
      "Как писать промпты для GPT Image 1.5 от OpenAI: bg → subject → details порядок, input_fidelity, multi-image, типичные ошибки и примеры до/после.",
    h1: "GPT Image 1.5: как писать промпты, которые модель понимает",
    intro:
      "GPT Image 1.5 — image-модель OpenAI с улучшенным фотореализмом, сохранением идентичности при редактировании и multi-image входом. Поддерживает разрешения до 1536×1024, прозрачный фон, три уровня качества, параметр input_fidelity (high/low) и до 4 изображений за запрос. Промпт оптимальной длины — до 500 слов.",
    sections: [
      {
        heading: "Что нового в GPT Image 1.5",
        body:
          "Версия 1.5 принесла десять конкретных апгрейдов: улучшенный фотореализм с естественным освещением и точными материалами, гибкий баланс качества и скорости (low quality уже превосходит визуальное качество GPT Image 1), сохранение лиц и идентичности при редактировании, надёжный рендеринг текста, поддержку сложных структурированных визуалов (инфографики, диаграммы), точный контроль стиля через минимальный промпт.\n\nДополнительно: сильные знания о реальном мире, улучшенная сохранность композиции при редактировании, более точная точность освещения, более высокая детализация мелких элементов.",
        bullets: [
          "Параметр input_fidelity (high/low) для контроля редактирования",
          "Multi-image вход — до 4 изображений за запрос",
          "Сохранение лиц и идентичности при редактировании",
          "Background: transparent / opaque / auto",
          "Длина промпта до ~4000 токенов, оптимально до 500 слов",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Рекомендуемый порядок от OpenAI: [Фон/Сцена] → [Субъект] → [Ключевые детали] → [Ограничения/Исключения]. Это отличается от подхода GPT Image 1, где субъект шёл первым.\n\nПлюс указание цели использования — «Product shot for an e-commerce listing», «Infographic for a student audience», «UI mockup showing a mobile app screen». Это задаёт «режим» и уровень полировки.\n\nДля сложных запросов используй короткие маркированные сегменты или переносы строк вместо одного длинного абзаца. Слоистая структура (субъект, окружение, освещение, стиль, технические параметры) даёт чистый и предсказуемый результат.",
      },
      {
        heading: "Multi-image вход и редактирование",
        body:
          "Multi-image — одна из ключевых фич 1.5. Ссылайся на каждое изображение по индексу: «Image 1: product photo with the watch on a white surface. Image 2: style reference, dark moody studio lighting. Apply Image 2's style to Image 1». При композитинге: «put the bird from Image 1 on the elephant in Image 2».\n\nДля редактирования используй edit endpoint с input_fidelity. High fidelity сохраняет композицию и идентичность (используй для face-preserving edits), low даёт творческую свободу (для style transfer и переосмысления). Указывай явно: «Change only X» + «keep everything else the same». При итерациях повторяй preserve-список — иначе модель «дрейфует».",
      },
      {
        heading: "Текст и структурированные визуалы",
        body:
          "Точный текст — в кавычках или CAPS: `\"SUMMER SALE 50% OFF\"`. Указывай типографику: стиль шрифта, размер, цвет, расположение. Для брендов и редких слов — побуквенно: `S-T-A-R-B-U-C-K-S`. Для инфографик с большим количеством текста — `quality=\"high\"`.\n\nGPT Image 1.5 особенно силён в структурированных визуалах: инфографики, диаграммы, многопанельные композиции, объяснительные иллюстрации. Указывай аудиторию («for students», «for executives») и тип («timeline», «labeled diagram», «funnel chart») — модель выбирает уровень детализации и плотность текста под задачу.",
      },
      {
        heading: "Итеративный подход и параметры API",
        body:
          "Начинай с чистого базового промпта. Уточняй маленькими шагами: «make lighting warmer», «remove the extra tree», «add motion blur to the background». Используй ссылки на предыдущее состояние: «same style as before», «the subject». Повторяй критические детали, если они начинают «дрейфовать».\n\nПараметры API влияют не меньше, чем текст промпта. `quality` — high для плотного текста и детализации, medium для дефолта, low для превью. `background` — transparent / opaque / auto. `input_fidelity` — high для сохранения композиции, low для творческой свободы. `num_images` — 1–4 за запрос. Игнорировать параметры — терять контроль над результатом.",
      },
    ],
    examples: [
      {
        before: "красивая фотография продукта",
        after:
          "Product shot for an e-commerce listing. A premium minimalist wireless headphone, matte black with brushed steel accents, placed on a minimalist white surface. Soft gradient lighting from the upper left, soft shadows beneath, slight reflection on the smooth surface. Professional studio photography, sharp focus, neutral cool color balance, quality=\"high\".",
        note:
          "Указание цели использования («e-commerce listing»), порядок bg → subject → details, конкретное освещение и поверхность, явный `quality=\"high\"`.",
      },
      {
        before: "infographic about the water cycle",
        after:
          "Educational infographic for students explaining the water cycle. Clean white background with five labeled stages: \"Evaporation\", \"Condensation\", \"Precipitation\", \"Collection\", \"Transpiration\". Use bold sans-serif font for stage labels, soft blue color palette for water, warm yellow for sun. Connecting arrows between stages. Top title (centered): \"The Water Cycle\". quality=\"high\".",
        note:
          "Цель («for students»), точные текстовые лейблы в кавычках, конкретная типографика и палитра, `quality=\"high\"` для мелкого текста.",
      },
      {
        before:
          "Change her hair color and the background and add glasses and make it cinematic",
        after:
          "Image 1: portrait photo. Change only the hair color to deep auburn. Keep the same facial features, expression, pose, glasses or lack thereof, and clothing unchanged. Maintain identical lighting and background. input_fidelity=\"high\".",
        note:
          "Несколько изменений за один промпт — модель путается. Один точный edit с явным preserve-списком и `input_fidelity=\"high\"` сохраняет идентичность.",
      },
    ],
    mistakes: [
      {
        title: "Игнорирование параметров API",
        explain:
          "`quality`, `background`, `input_fidelity` и `num_images` влияют на результат не меньше, чем текст промпта. Запросить high-quality инфографику с мелким текстом на `quality=\"medium\"` — гарантия размытых лейблов. Запросить стикер без `background: transparent` — получишь белый фон.",
      },
      {
        title: "Синтаксис Stable Diffusion",
        explain:
          "Веса вида `(word:1.5)`, теги через запятую `1girl, masterpiece, best quality`, embeddings, LoRA-ссылки — GPT Image 1.5 работает с естественным языком, не с тегами. Эти конструкции игнорируются или ухудшают результат. Пиши связными предложениями.",
      },
      {
        title: "Перегрузка при итерациях",
        explain:
          "«Change hair, background, clothing, add glasses, make it cinematic» — модель пытается сделать всё сразу и теряет идентичность. Лучше менять по одному элементу за раз, повторяя preserve-список на каждом шаге. GPT Image 1.5 особенно хорош в итеративной работе именно благодаря face-preservation.",
      },
      {
        title: "Отсутствие цели использования",
        explain:
          "«Сделай инфографику» — модель не знает уровень полировки и плотности. «Educational infographic for students explaining...» или «Pitch-deck slide for executives showing...» — задаёт режим. Цель влияет на стилистику, размер шрифта, иллюстративность не меньше, чем основной субъект.",
      },
      {
        title: "Quality-бустеры «8K, ultra HD, masterpiece»",
        explain:
          "Общие восхваления качества — почти бесполезны. Конкретные термины (lens, lighting direction, depth of field) работают значительно лучше. Плюс параметры API (`quality=\"high\"`) дают реальный контроль над финальной чёткостью, в отличие от слов в промпте.",
      },
    ],
    faq: [
      {
        q: "Чем GPT Image 1.5 отличается от 1 и 2?",
        a: "От GPT Image 1 — улучшенный фотореализм, сохранение лиц при редактировании, multi-image вход (до 4 изображений), параметр input_fidelity, надёжный рендеринг текста. От GPT Image 2 отстаёт по SOTA-рендерингу текста (CJK, кириллица, арабский), thinking mode и количеству референсов (1.5 поддерживает до 4, 2 — до 16). Для большинства задач 1.5 — стабильный middle-ground.",
      },
      {
        q: "Когда использовать input_fidelity=\"high\" vs \"low\"?",
        a: "High — для сохранения композиции и идентичности при редактировании. Используй для face-preserving edits, точных правок фона, замены одежды без изменения позы. Low — для творческой свободы, переосмысления, style transfer, генерации вариаций. По умолчанию выбирай high; low — когда хочешь радикальные изменения.",
      },
      {
        q: "Как работает multi-image вход?",
        a: "Передавай до 4 изображений и ссылайся на каждое по индексу: «Image 1: ...», «Image 2: ...». Описывай взаимодействие: «apply Image 2's style to Image 1», «put the bird from Image 1 on the elephant in Image 2». Это позволяет style transfer, композитинг, и сложные правки через сравнение. Главное — явные ссылки, без них модель не знает что с чем делать.",
      },
      {
        q: "Какой порядок элементов промпта рекомендует OpenAI?",
        a: "Для GPT Image 1.5 рекомендуемый порядок: [Фон/Сцена] → [Субъект] → [Ключевые детали] → [Ограничения]. Плюс цель использования в начале («Product shot for...», «Infographic for...»). Это отличается от GPT Image 1, где субъект шёл первым. Для сложных промптов лучше короткие маркированные сегменты, чем один длинный абзац.",
      },
      {
        q: "Как делать инфографики и диаграммы?",
        a: "Указывай аудиторию («for students», «for executives») и тип («timeline», «labeled diagram», «funnel chart»). Точные текстовые лейблы — в кавычках. Конкретный шрифт, цветовая палитра, макет. Обязательно `quality=\"high\"` — на medium мелкий текст ломается. GPT Image 1.5 — один из лучших в классе для структурированных визуалов.",
      },
      {
        q: "Поддерживает ли модель прозрачный фон?",
        a: "Да, через параметр `background: transparent / opaque / auto`. Для стикеров, иконок и ассетов используй transparent. В промпте можно дополнительно указать «transparent background», но именно параметр гарантирует чистую альфа-маску. Типичный паттерн: «cute cartoon knight sticker, thick lines, white outline» + `background=\"transparent\"`.",
      },
      {
        q: "Поддерживается ли Opten для GPT Image 1.5?",
        a: "Да, расширение Opten автоматически распознаёт GPT Image 1.5 и оценивает промпты по структуре, описанной выше: проверяет рекомендуемый порядок (bg → subject → details), наличие цели использования, конкретных камерных терминов, кавычек для текста, отсутствие SD-синтаксиса. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "GPT Image 1.5 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for OpenAI's GPT Image 1.5: bg → subject → details order, input_fidelity, multi-image, common mistakes, and before/after examples.",
    h1: "GPT Image 1.5: how to write prompts the model actually understands",
    intro:
      "GPT Image 1.5 is OpenAI's image model with improved photorealism, identity preservation during editing, and multi-image input. It supports resolutions up to 1536×1024, transparent background, three quality tiers, an input_fidelity parameter (high/low), and up to 4 images per request. Optimal prompt length is up to 500 words.",
    sections: [
      {
        heading: "What's new in GPT Image 1.5",
        body:
          "Version 1.5 brought ten concrete upgrades: improved photorealism with natural lighting and accurate materials, a flexible quality/speed balance (low quality already beats GPT Image 1's visual quality), face and identity preservation during editing, reliable text rendering, support for complex structured visuals (infographics, diagrams), and precise style control via minimal prompting.\n\nAdditional gains: strong real-world knowledge, improved composition preservation during edits, more accurate lighting, and higher detail on fine elements.",
        bullets: [
          "input_fidelity parameter (high/low) for edit control",
          "Multi-image input — up to 4 images per request",
          "Face and identity preservation during editing",
          "Background: transparent / opaque / auto",
          "Prompt up to ~4000 tokens, optimal up to 500 words",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "OpenAI's recommended order: [Background/Scene] → [Subject] → [Key details] → [Constraints/Exclusions]. This differs from GPT Image 1, where the subject came first.\n\nAlso include the use case — «Product shot for an e-commerce listing», «Infographic for a student audience», «UI mockup showing a mobile app screen». This sets the mode and polish level.\n\nFor complex requests use short bulleted segments or line breaks instead of one long paragraph. A layered structure (subject, environment, lighting, style, technical parameters) yields clean and predictable output.",
      },
      {
        heading: "Multi-image input and editing",
        body:
          "Multi-image is one of 1.5's key features. Reference each image by index: «Image 1: product photo with the watch on a white surface. Image 2: style reference, dark moody studio lighting. Apply Image 2's style to Image 1». For compositing: «put the bird from Image 1 on the elephant in Image 2».\n\nFor editing use the edit endpoint with input_fidelity. High fidelity preserves composition and identity (use for face-preserving edits); low allows creative freedom (style transfer, reimagining). State explicitly: «Change only X» + «keep everything else the same». On iterations repeat the preserve list — otherwise the model drifts.",
      },
      {
        heading: "Text and structured visuals",
        body:
          "Exact text in quotes or CAPS: `\"SUMMER SALE 50% OFF\"`. Specify typography: font style, size, color, placement. For brands and rare words — letter by letter: `S-T-A-R-B-U-C-K-S`. For infographics with lots of text — `quality=\"high\"`.\n\nGPT Image 1.5 is especially strong on structured visuals: infographics, diagrams, multi-panel compositions, explanatory illustrations. Specify audience («for students», «for executives») and type («timeline», «labeled diagram», «funnel chart») — the model picks detail level and text density accordingly.",
      },
      {
        heading: "Iterative approach and API parameters",
        body:
          "Start with a clean base prompt. Refine in small steps: «make lighting warmer», «remove the extra tree», «add motion blur to the background». Reference the previous state: «same style as before», «the subject». Repeat critical details if they start drifting.\n\nAPI parameters matter as much as prompt text. `quality` — high for dense text and detail, medium default, low for previews. `background` — transparent / opaque / auto. `input_fidelity` — high to preserve composition, low for creative freedom. `num_images` — 1–4 per request. Ignoring parameters means losing control over the result.",
      },
    ],
    examples: [
      {
        before: "beautiful product photo",
        after:
          "Product shot for an e-commerce listing. A premium minimalist wireless headphone, matte black with brushed steel accents, placed on a minimalist white surface. Soft gradient lighting from the upper left, soft shadows beneath, slight reflection on the smooth surface. Professional studio photography, sharp focus, neutral cool color balance, quality=\"high\".",
        note:
          "Use case stated («e-commerce listing»), bg → subject → details order, concrete lighting and surface, explicit `quality=\"high\"`.",
      },
      {
        before: "infographic about the water cycle",
        after:
          "Educational infographic for students explaining the water cycle. Clean white background with five labeled stages: \"Evaporation\", \"Condensation\", \"Precipitation\", \"Collection\", \"Transpiration\". Use bold sans-serif font for stage labels, soft blue color palette for water, warm yellow for sun. Connecting arrows between stages. Top title (centered): \"The Water Cycle\". quality=\"high\".",
        note:
          "Audience («for students»), exact text labels in quotes, concrete typography and palette, `quality=\"high\"` for small text.",
      },
      {
        before:
          "Change her hair color and the background and add glasses and make it cinematic",
        after:
          "Image 1: portrait photo. Change only the hair color to deep auburn. Keep the same facial features, expression, pose, glasses or lack thereof, and clothing unchanged. Maintain identical lighting and background. input_fidelity=\"high\".",
        note:
          "Multiple edits in one prompt confuse the model. One precise edit with an explicit preserve list and `input_fidelity=\"high\"` preserves identity.",
      },
    ],
    mistakes: [
      {
        title: "Ignoring API parameters",
        explain:
          "`quality`, `background`, `input_fidelity`, and `num_images` affect output as much as the prompt text. Requesting a high-quality infographic with small text at `quality=\"medium\"` guarantees blurry labels. Requesting a sticker without `background: transparent` gives a white background.",
      },
      {
        title: "Stable Diffusion syntax",
        explain:
          "Weights like `(word:1.5)`, comma-separated tags `1girl, masterpiece, best quality`, embeddings, LoRA references — GPT Image 1.5 works with natural language, not tags. These constructions are ignored or degrade output. Write coherent sentences.",
      },
      {
        title: "Overloading iterations",
        explain:
          "«Change hair, background, clothing, add glasses, make it cinematic» — the model tries to do everything at once and loses identity. Change one element at a time, repeating the preserve list at each step. GPT Image 1.5 is especially good at iterative work precisely because of face preservation.",
      },
      {
        title: "Missing use case",
        explain:
          "«Make an infographic» — the model doesn't know the polish level or density. «Educational infographic for students explaining...» or «Pitch-deck slide for executives showing...» sets the mode. Use case influences style, font size, illustration density as much as the main subject.",
      },
      {
        title: "Quality boosters «8K, ultra HD, masterpiece»",
        explain:
          "Generic quality praise is nearly useless. Concrete terms (lens, lighting direction, depth of field) work significantly better. Plus API parameters (`quality=\"high\"`) give real control over final sharpness, unlike words in the prompt.",
      },
    ],
    faq: [
      {
        q: "How is GPT Image 1.5 different from 1 and 2?",
        a: "Vs GPT Image 1 — improved photorealism, face preservation during editing, multi-image input (up to 4 images), input_fidelity parameter, reliable text rendering. Vs GPT Image 2 it lags on SOTA text rendering (CJK, Cyrillic, Arabic), thinking mode, and reference count (1.5 supports up to 4, 2 supports up to 16). For most tasks 1.5 is a stable middle ground.",
      },
      {
        q: "When should input_fidelity=\"high\" vs \"low\" be used?",
        a: "High — for preserving composition and identity during editing. Use it for face-preserving edits, precise background swaps, clothing changes without altering pose. Low — for creative freedom, reimagining, style transfer, variation generation. Default to high; use low when radical changes are desired.",
      },
      {
        q: "How does multi-image input work?",
        a: "Pass up to 4 images and reference each by index: «Image 1: ...», «Image 2: ...». Describe the interaction: «apply Image 2's style to Image 1», «put the bird from Image 1 on the elephant in Image 2». This enables style transfer, compositing, and complex edits through comparison. The key is explicit references — without them the model doesn't know what to do with what.",
      },
      {
        q: "What prompt element order does OpenAI recommend?",
        a: "For GPT Image 1.5 the recommended order is: [Background/Scene] → [Subject] → [Key details] → [Constraints]. Plus a use case up front («Product shot for...», «Infographic for...»). This differs from GPT Image 1 where the subject came first. For complex prompts, short bulleted segments work better than one long paragraph.",
      },
      {
        q: "How do you make infographics and diagrams?",
        a: "Specify audience («for students», «for executives») and type («timeline», «labeled diagram», «funnel chart»). Exact text labels in quotes. Concrete font, color palette, layout. Always `quality=\"high\"` — small text breaks on medium. GPT Image 1.5 is one of the best in class for structured visuals.",
      },
      {
        q: "Does the model support transparent background?",
        a: "Yes, via the `background: transparent / opaque / auto` parameter. For stickers, icons, and assets use transparent. The prompt can additionally state «transparent background», but the parameter is what guarantees a clean alpha mask. Typical pattern: «cute cartoon knight sticker, thick lines, white outline» + `background=\"transparent\"`.",
      },
      {
        q: "Does Opten support GPT Image 1.5?",
        a: "Yes, the Opten extension auto-detects GPT Image 1.5 and scores prompts against the structure outlined above: it checks for the recommended order (bg → subject → details), a stated use case, concrete camera terms, quotes for text, and absence of SD syntax. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
