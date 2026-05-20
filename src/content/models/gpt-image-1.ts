// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for gpt-image-1.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для GPT Image 1: структура, ошибки, примеры",
    description:
      "Как писать промпты для GPT Image 1 от OpenAI: слоистая структура, точный текст в кавычках, камерные термины, типичные ошибки и примеры до/после.",
    h1: "GPT Image 1: как писать промпты, которые модель понимает",
    intro:
      "GPT Image 1 — image-модель от OpenAI с естественным языковым промптингом и сильным рендерингом текста в кадре. Работает через ChatGPT и API, поддерживает разрешения до 1536×1024, прозрачный фон, три уровня качества и image-to-image редактирование. Промпт длиной ~500 слов оптимален.",
    sections: [
      {
        heading: "Что умеет GPT Image 1",
        body:
          "Главные сильные стороны — точный читаемый текст в кадре (вывески, меню, лейблы, UI-мокапы), высокая верность промпту, фотореализм через камерные термины и встроенная поддержка прозрачного фона (идеально для стикеров и ассетов).\n\nВ ChatGPT модель учитывает мультитурновый контекст — можно итеративно дорабатывать изображение в одном диалоге. В API каждый запрос автономный. Поддерживается image-to-image редактирование через отдельный endpoint.",
        bullets: [
          "Разрешения 1024×1024, 1536×1024, 1024×1536",
          "Форматы PNG, JPEG, WebP, отдельный параметр прозрачности",
          "Качество high / medium / low",
          "Image-to-image редактирование через API",
          "Длина промпта до ~4000 токенов, оптимально до 500 слов",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Слоистая формула: [Визуальный медиум/Стиль] + [Субъект] + [Окружение/Сцена] + [Освещение/Настроение] + [Композиция/Ракурс] + [Детали и текстуры] + [Ограничения/Исключения].\n\nМодель понимает естественный язык — никаких тегов и специального синтаксиса. Описывай как рассказ, но с конкретными визуальными деталями.\n\nКонкретика — главное правило. «Туманная горная долина на рассвете, золотой свет пробивается сквозь сосны, отражаясь в зеркально гладком озере» работает в десятки раз лучше, чем «красивый пейзаж». Минимум 2-3 описательных детали на сцену: цвет, текстура, материал, форма.",
      },
      {
        heading: "Камера и фотореализм",
        body:
          "Камерные термины работают значительно лучше, чем общие «8K, ultra-detailed».\n\nКрупность: close-up, medium shot, wide angle, aerial view. Линзы: 50mm, 35mm, macro, fisheye. Фокус: shallow depth of field, bokeh, sharp focus throughout. Ракурс: low angle, bird's eye view, eye level, Dutch angle.\n\nДля освещения избегай общих слов «good lighting». Используй конкретику: «dramatic side lighting creating strong shadows», «soft box lighting eliminating harsh shadows», «golden hour», «fluorescent overhead», «neon glow», «candlelight». Чем точнее описание света — тем точнее настроение.",
      },
      {
        heading: "Текст в изображении и итеративная работа",
        body:
          "GPT Image 1 — топ-класс по тексту в кадре. Точный текст всегда в кавычках или CAPS: `\"OPEN 24/7\"`, `\"CAFE LUNA\"`. Указывай стиль шрифта («elegant handwriting», «bold sans-serif», «neon sign lettering»), размер, цвет, расположение. Для сложных слов (бренды, редкие написания) прописывай побуквенно: `C-A-F-E L-U-N-A`.\n\nВ ChatGPT используй итеративный подход. Начни с базового промпта, затем уточняй маленькими шагами: «Same scene, but make the lighting warmer», «Add a person sitting on the bench on the left», «Remove the tree in the background». Лучше серия точных правок, чем перегруженный один промпт.",
      },
      {
        heading: "Контент-политика и ограничения",
        body:
          "GPT Image 1 работает под строгим модератором OpenAI. Запрещён NSFW, реальные знаменитости, насилие, узнаваемые IP-лица. Модератор семантический — комбинации невинных слов в подозрительном контексте также блокируются.\n\nЕсли получаешь refusal, не пытайся обмануть фильтр эвфемизмами — он работает на уровне смысла, не ключевых слов. Переформулируй: убери triggering combo, замени контекст на editorial/fashion, используй вымышленных персонажей вместо реальных. Контент-политика — главное практическое ограничение модели по сравнению с FLUX и SD.",
      },
    ],
    examples: [
      {
        before: "красивый портрет",
        after:
          "Editorial portrait of a woman in her thirties with freckles and short auburn hair, wearing a cream-colored cashmere sweater. Soft natural light from a north-facing window, calm contemplative expression, shallow depth of field. Shot on 85mm lens at f/1.8, subtle film grain, muted warm palette, fashion editorial style.",
        note:
          "Конкретный субъект, описание внешности, конкретное освещение, камерные термины, стилевая ссылка. «Красивый» — пустое слово.",
      },
      {
        before: "вывеска кофейни на старой кирпичной стене",
        after:
          "A weathered metal café sign mounted on a red brick wall in a 1920s Brooklyn neighborhood. The sign reads \"BREW & BEAN\" in bold cream-colored sans-serif lettering with a small coffee cup icon. Warm afternoon light catches the metal, soft shadows on the brick. Documentary photography, shallow depth of field, muted warm palette.",
        note:
          "Точный текст в кавычках, конкретный шрифт и цвет, эпоха, материал поверхности, тип освещения. Без этого модель додумывает все детали сама.",
      },
      {
        before:
          "(masterpiece:1.5), (best quality:1.3), 1girl, blue dress, beautiful, garden, photorealistic, 8k",
        after:
          "A young woman in her twenties wearing a flowing pale blue linen dress, walking through a sunlit cottage garden in early summer. Soft natural light, golden hour warmth, shallow depth of field. Shot on 85mm lens at f/1.8, candid documentary style, subtle film grain.",
        note:
          "Веса через скобки `(word:1.5)` и теги через запятую — синтаксис Stable Diffusion. GPT Image 1 их не поддерживает. Связное описание с камерными терминами даёт целевой результат.",
      },
    ],
    mistakes: [
      {
        title: "Синтаксис Stable Diffusion",
        explain:
          "Веса вида `(word:1.5)`, `(masterpiece:1.3)`, теги через запятую `1girl, masterpiece, best quality`, embeddings, LoRA-ссылки — GPT Image 1 работает с естественным языком, не с тегами. Эти конструкции попадают в промпт как литеральный мусор или ухудшают результат.",
      },
      {
        title: "Quality-бустеры «8K, ultra HD, masterpiece»",
        explain:
          "Общие восхваления качества почти не влияют на GPT Image 1. Конкретные камерные термины («85mm at f/1.8», «shallow DOF», «golden hour»), стилевые ссылки и описания освещения работают в разы лучше любых quality-стэков.",
      },
      {
        title: "Отсутствие окружения",
        explain:
          "«Красная спортивная машина» и «красная спортивная машина на пустом шоссе в пустыне с горами на горизонте» — кардинально разные результаты. Без контекста модель решает сама, и результат непредсказуемый. Минимальное описание фона значительно улучшает кадр.",
      },
      {
        title: "Противоречивые стили в одном промпте",
        explain:
          "«Photorealistic cartoon», «minimalist detailed», «realistic stylized» — конфликт без объяснения, как стили должны сочетаться. Модель не знает что приоритезировать. Если нужна стилевая смесь, опиши её явно: «realistic photography with subtle painterly post-processing».",
      },
      {
        title: "Негативы без позитивной альтернативы",
        explain:
          "«Don't draw background», «no people, no text, no clutter» — менее эффективны, чем позитивное описание желаемого. «Transparent background» работает лучше, чем «no background». «Clean composition» бьёт «no clutter». Описывай ЧТО хочешь, а не чего не хочешь.",
      },
    ],
    faq: [
      {
        q: "Чем GPT Image 1 отличается от GPT Image 1.5 и 2?",
        a: "GPT Image 1 — базовая модель с хорошим рендерингом текста и фотореализмом. GPT Image 1.5 принёс улучшенный фотореализм, сохранение лиц при редактировании, multi-image вход, параметр input_fidelity. GPT Image 2 добавил SOTA-рендеринг текста (CJK, кириллица, арабский), thinking mode с web search и до 16 референсов. Для большинства новых задач 1.5 и 2 — лучший выбор.",
      },
      {
        q: "Какая оптимальная длина промпта?",
        a: "До 500 слов — золотая середина. Технический лимит около 4000 токенов, но качество начинает падать после ~500. Слишком короткий промпт (<5 слов) даёт непредсказуемый результат — модель додумывает слишком много. Слишком длинный — перегружает модель, и часть деталей игнорируется. Плотное описание из 100-200 слов работает лучше.",
      },
      {
        q: "Как добиться photorealism без AI-look?",
        a: "Используй фото-терминологию: «35mm film», «50mm lens», «shallow DOF», «natural color balance», «subtle film grain». Описывай реальные текстуры — «visible pores», «weathered skin», «fabric wear». Избегай слов «polished», «staged», «beautiful lighting» — они активируют студийный глянец. Явное «photorealistic» в начале промпта помогает.",
      },
      {
        q: "Поддерживает ли модель прозрачный фон?",
        a: "Да, прозрачность — встроенная функция через отдельный параметр API/UI. Идеально для стикеров, иконок, персонажей, ассетов. В промпте дополнительно можно указать «transparent background», но именно параметр гарантирует чистую альфа-маску. Для стикеров типичная формула: «cute cartoon knight sticker, thick lines, white outline, transparent background».",
      },
      {
        q: "Можно ли редактировать существующее изображение?",
        a: "Да, через image-to-image endpoint. Передай исходник плюс промпт с инструкцией изменения. Указывай ЧТО менять и ЧТО сохранять: «Change only the background to a beach, keep the person, pose, and lighting unchanged». Без явного preserve-блока модель может изменить больше, чем требуется. Это особенно важно для итеративных правок.",
      },
      {
        q: "Почему модель отказывается генерировать?",
        a: "У OpenAI один из самых строгих модераторов. Триггерится не только на явный NSFW, но и на комбинации невинных слов в подозрительном контексте. Реальные celebrities и узнаваемые IP-лица заблокированы политикой. Если получаешь refusal — переформулируй: убери triggering combo, замени контекст на editorial/fashion, используй вымышленных персонажей.",
      },
      {
        q: "Поддерживается ли Opten для GPT Image 1?",
        a: "Да, расширение Opten автоматически распознаёт GPT Image 1 внутри ChatGPT и API-платформ. Оно оценивает промпты по структуре, описанной выше: проверяет наличие визуального медиума, конкретики, камерных терминов, кавычек для текста, отсутствие SD-синтаксиса и quality-бустеров. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "GPT Image 1 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for OpenAI's GPT Image 1: layered structure, exact text in quotes, camera terms, common mistakes, and before/after examples.",
    h1: "GPT Image 1: how to write prompts the model actually understands",
    intro:
      "GPT Image 1 is an OpenAI image model with natural-language prompting and strong in-image text rendering. It runs in ChatGPT and via API, supports resolutions up to 1536×1024, transparent background, three quality tiers, and image-to-image editing. Prompts of ~500 words are optimal.",
    sections: [
      {
        heading: "What GPT Image 1 does well",
        body:
          "The main strengths are accurate readable in-image text (signs, menus, labels, UI mockups), high prompt adherence, photorealism through camera terms, and built-in transparent background support (ideal for stickers and assets).\n\nIn ChatGPT the model uses multi-turn context — images can be refined iteratively in a single conversation. In the API every request is autonomous. Image-to-image editing is supported via a dedicated endpoint.",
        bullets: [
          "Resolutions 1024×1024, 1536×1024, 1024×1536",
          "Formats PNG, JPEG, WebP, dedicated transparency parameter",
          "Quality high / medium / low",
          "Image-to-image editing via API",
          "Prompt length up to ~4000 tokens, optimal up to 500 words",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Layered formula: [Visual medium/Style] + [Subject] + [Environment/Scene] + [Lighting/Mood] + [Composition/Angle] + [Details and textures] + [Constraints/Exclusions].\n\nThe model understands natural language — no tags or special syntax. Describe like a story, but with concrete visual details.\n\nSpecificity is the main rule. «A foggy mountain valley at dawn, golden light filtering through pine trees, reflected in a mirror-still lake» works tenfold better than «a beautiful landscape». Minimum 2-3 descriptive details per scene: color, texture, material, shape.",
      },
      {
        heading: "Camera and photorealism",
        body:
          "Camera terms work significantly better than generic «8K, ultra-detailed».\n\nShot size: close-up, medium shot, wide angle, aerial view. Lenses: 50mm, 35mm, macro, fisheye. Focus: shallow depth of field, bokeh, sharp focus throughout. Angle: low angle, bird's eye view, eye level, Dutch angle.\n\nFor lighting avoid generic «good lighting». Use specifics: «dramatic side lighting creating strong shadows», «soft box lighting eliminating harsh shadows», «golden hour», «fluorescent overhead», «neon glow», «candlelight». The more precise the light, the more precise the mood.",
      },
      {
        heading: "In-image text and iterative work",
        body:
          "GPT Image 1 is top-tier for in-image text. Exact text always in quotes or CAPS: `\"OPEN 24/7\"`, `\"CAFE LUNA\"`. Specify font style («elegant handwriting», «bold sans-serif», «neon sign lettering»), size, color, placement. For complex words (brands, rare spellings) spell letter by letter: `C-A-F-E L-U-N-A`.\n\nIn ChatGPT use an iterative approach. Start with a base prompt, then refine in small steps: «Same scene, but make the lighting warmer», «Add a person sitting on the bench on the left», «Remove the tree in the background». A series of precise edits beats one overloaded prompt.",
      },
      {
        heading: "Content policy and limits",
        body:
          "GPT Image 1 operates under OpenAI's strict moderator. NSFW, real celebrities, violence, and recognizable IP faces are banned. The moderator is semantic — innocent word combinations in suspicious context can also be blocked.\n\nIf refused, don't try euphemisms — the filter works on meaning, not keywords. Reformulate: drop the triggering combo, swap context to editorial/fashion, use fictional characters instead of real ones. Content policy is the main practical limitation compared to FLUX and SD.",
      },
    ],
    examples: [
      {
        before: "beautiful portrait",
        after:
          "Editorial portrait of a woman in her thirties with freckles and short auburn hair, wearing a cream-colored cashmere sweater. Soft natural light from a north-facing window, calm contemplative expression, shallow depth of field. Shot on 85mm lens at f/1.8, subtle film grain, muted warm palette, fashion editorial style.",
        note:
          "Concrete subject, appearance details, specific lighting, camera terms, style reference. «Beautiful» is an empty word.",
      },
      {
        before: "café sign on an old brick wall",
        after:
          "A weathered metal café sign mounted on a red brick wall in a 1920s Brooklyn neighborhood. The sign reads \"BREW & BEAN\" in bold cream-colored sans-serif lettering with a small coffee cup icon. Warm afternoon light catches the metal, soft shadows on the brick. Documentary photography, shallow depth of field, muted warm palette.",
        note:
          "Exact text in quotes, specific font and color, era, surface material, lighting type. Without this the model invents all details.",
      },
      {
        before:
          "(masterpiece:1.5), (best quality:1.3), 1girl, blue dress, beautiful, garden, photorealistic, 8k",
        after:
          "A young woman in her twenties wearing a flowing pale blue linen dress, walking through a sunlit cottage garden in early summer. Soft natural light, golden hour warmth, shallow depth of field. Shot on 85mm lens at f/1.8, candid documentary style, subtle film grain.",
        note:
          "Parenthetical weights `(word:1.5)` and comma-separated tags are Stable Diffusion syntax. GPT Image 1 doesn't support them. A coherent description with camera terms hits the target.",
      },
    ],
    mistakes: [
      {
        title: "Stable Diffusion syntax",
        explain:
          "Weights like `(word:1.5)`, `(masterpiece:1.3)`, comma-separated tags `1girl, masterpiece, best quality`, embeddings, LoRA references — GPT Image 1 works with natural language, not tags. These constructions land in the prompt as literal noise or degrade output.",
      },
      {
        title: "Quality boosters «8K, ultra HD, masterpiece»",
        explain:
          "Generic quality praise barely affects GPT Image 1. Concrete camera terms («85mm at f/1.8», «shallow DOF», «golden hour»), style references, and lighting descriptions work many times better than any quality stack.",
      },
      {
        title: "Missing environment",
        explain:
          "«A red sports car» versus «a red sports car on an empty desert highway with mountains on the horizon» — dramatically different results. Without context the model decides on its own, and output is unpredictable. Even minimal background description significantly improves the frame.",
      },
      {
        title: "Conflicting styles in one prompt",
        explain:
          "«Photorealistic cartoon», «minimalist detailed», «realistic stylized» — conflict without explanation of how styles should combine. The model can't decide what to prioritize. If a stylistic blend is needed, describe it explicitly: «realistic photography with subtle painterly post-processing».",
      },
      {
        title: "Negatives without a positive alternative",
        explain:
          "«Don't draw background», «no people, no text, no clutter» are less effective than positive descriptions. «Transparent background» beats «no background». «Clean composition» beats «no clutter». Describe what you want, not what you don't.",
      },
    ],
    faq: [
      {
        q: "How is GPT Image 1 different from GPT Image 1.5 and 2?",
        a: "GPT Image 1 is the base model with good text rendering and photorealism. GPT Image 1.5 added improved photorealism, face preservation in editing, multi-image input, and an input_fidelity parameter. GPT Image 2 brings SOTA text rendering (CJK, Cyrillic, Arabic), thinking mode with web search, and up to 16 references. For most new tasks, 1.5 and 2 are the better choice.",
      },
      {
        q: "What is the optimal prompt length?",
        a: "Up to 500 words is the sweet spot. The technical limit is roughly 4000 tokens, but quality starts to drop after ~500. A too-short prompt (<5 words) yields unpredictable results — the model invents too much. Too long overloads the model and details get ignored. A dense 100-200 word prompt works best.",
      },
      {
        q: "How do you get photorealism without the AI look?",
        a: "Use photo terminology: «35mm film», «50mm lens», «shallow DOF», «natural color balance», «subtle film grain». Describe real textures — «visible pores», «weathered skin», «fabric wear». Avoid words like «polished», «staged», «beautiful lighting» — they activate studio gloss. An explicit «photorealistic» at the start helps.",
      },
      {
        q: "Does the model support transparent background?",
        a: "Yes, transparency is a built-in feature via a dedicated API/UI parameter. Ideal for stickers, icons, characters, assets. The prompt can additionally state «transparent background», but the parameter is what guarantees a clean alpha mask. Typical sticker formula: «cute cartoon knight sticker, thick lines, white outline, transparent background».",
      },
      {
        q: "Can existing images be edited?",
        a: "Yes, via the image-to-image endpoint. Pass the source plus a prompt with a change instruction. Specify WHAT to change and WHAT to preserve: «Change only the background to a beach, keep the person, pose, and lighting unchanged». Without an explicit preserve block the model may change more than needed. Especially important for iterative edits.",
      },
      {
        q: "Why does the model refuse to generate?",
        a: "OpenAI has one of the strictest moderators. It triggers not only on explicit NSFW but on combinations of innocent words in suspicious context. Real celebrities and recognizable IP faces are blocked by policy. If refused — reformulate: drop the triggering combo, swap context to editorial/fashion, use fictional characters.",
      },
      {
        q: "Does Opten support GPT Image 1?",
        a: "Yes, the Opten extension auto-detects GPT Image 1 inside ChatGPT and API platforms. It scores prompts against the structure outlined above: presence of a visual medium, specificity, camera terms, quotes for text, absence of SD syntax and quality boosters. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
