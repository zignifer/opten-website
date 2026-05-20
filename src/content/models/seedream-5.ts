// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedream-5.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedream 5 Lite: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedream 5 Lite от ByteDance: улучшенный текст, анатомия рук, длинные промпты до 120 слов, расширенные стили и примеры.",
    h1: "Seedream 5 Lite: как писать промпты, которые модель понимает",
    intro:
      "Seedream 5 Lite — самая свежая версия image-модели ByteDance. Делает text-to-image, image-to-image, multi-image blending, inpainting и outpainting до 4K+. Оптимальная длина промпта 30–120 слов. Доступна через fal.ai, syntx.ai. Принесла улучшенный рендеринг текста, заметно лучшую анатомию рук и расширенный диапазон стилей по сравнению с 4.5.",
    sections: [
      {
        heading: "Чем 5 Lite отличается от 4.5",
        body:
          "5 Lite — это апгрейд по семи направлениям. Более точная генерация текста на изображениях (длинные строки и мелкий кегль работают надёжно). Лучшая работа с анатомией человека — руки, пальцы, позы выходят с меньшим количеством артефактов.\n\nУлучшенная обработка сложных многоэлементных сцен — где 4.5 иногда теряет один объект из пяти, 5 Lite удерживает все. Расширен диапазон поддерживаемых стилей — добавлены 3D-рендеры (Unreal Engine, Octane, ray tracing), новые арт-направления (gouache, charcoal), фото-жанры (underwater).\n\nЛучшее пространственное понимание (точные расстояния и пропорции между объектами). Поддержка длинных промптов до 120 слов без потери фокуса. Полный editing endpoint с inpainting, outpainting и точным image-to-image.",
        bullets: [
          "Text-to-Image, Image-to-Image, Multi-Image Blending, Inpainting, Outpainting",
          "Разрешение до 4K+",
          "Оптимальная длина промпта 30–120 слов",
          "Заметно улучшенная анатомия рук и пальцев",
          "Расширенный диапазон 3D-рендеров и арт-направлений",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Каноническая формула: `[Субъект] + [Стиль] + [Композиция] + [Освещение/Атмосфера] + [Технические параметры] + [Дополнительные детали]`. Иерархия приоритизации общая для всей линейки — субъект всегда первый.\n\n5 Lite позволяет добавить шестой блок «Дополнительные детали» без потери фокуса. Это могут быть текстуры («fine skin texture detail»), материалы («brushed brass, oiled walnut»), микро-настроение («contemplative expression»). На 4.5 такая детализация могла размыть приоритеты; на 5 Lite модель удерживает всё.\n\nПример: «A middle-aged man with salt-and-pepper beard, photorealistic portrait, 105mm lens, Rembrandt lighting, dark moody background, contemplative expression, shallow depth of field, fine skin texture detail.» — 25 слов с расширенной детализацией. Это рабочий уровень для 5 Lite.",
      },
      {
        heading: "Расширенный рендеринг текста",
        body:
          "Главный апгрейд 5 Lite после анатомии — текст в изображении. То, что в 4.5 было «хорошо», в 5 Lite становится «отлично»: длинные строки, мелкий кегль, сложная типографика, кириллица и CJK.\n\nПравила: текст в кавычках (`text \"YOUR TEXT HERE\"`), стиль шрифта («bold sans-serif», «elegant serif», «handwritten», «metallic typography»), расположение («centered at top», «bottom left corner», «in the upper third»). Для длинных текстов — разбивать на отдельные элементы.\n\nЧто работает на 5 Lite, но не на 4.5: длинные слоганы из 5+ слов в одной строке, мелкие подписи к инфографике, упаковка с боковым текстом, многоязычная типографика на одном постере. По сути, это уровень GPT Image 2 — рендеринг текста перестал быть лотереей.",
      },
      {
        heading: "Анатомия и многоэлементные сцены",
        body:
          "Руки и пальцы — слабая зона почти всех image-моделей до 2024 года. В 5 Lite это исправлено: руки, держащие предметы, переплетённые пальцы, жесты — всё это рендерится с заметно меньшим количеством артефактов.\n\nЭто открывает сценарии, недоступные в 4.5: фотографии с детальной работой рук (мастер за работой, музыкант с инструментом, повар с ингредиентами), портреты со сложными позами рук (молитва, аплодисменты, объятия), fashion со взаимодействием с одеждой (поправляет рукав, держит сумку).\n\nМногоэлементные сцены — 4.5 иногда «теряет» один из 4–5 объектов или путает их расположение. 5 Lite удерживает все: «A father, mother, and two children sitting around a dinner table, with a dog under the table and a cat on the windowsill» — все шесть субъектов на месте.",
      },
      {
        heading: "Расширенный диапазон стилей",
        body:
          "В 5 Lite добавлены целые категории стилей, которых не было в 4.5. 3D-рендеры — «3D render», «CGI», «Unreal Engine», «Octane render», «ray tracing», «isometric». Эти ярлыки 5 Lite понимает буквально и даёт результат уровня профессионального 3D-софта.\n\nНовые арт-направления — «gouache» (гуашь), «charcoal» (уголь), «ink wash» (тушь). Новые фото-жанры — «underwater photography» (подводная съёмка).\n\nТекстуры как отдельный уровень — «smooth», «rough», «grainy», «glossy», «matte», «translucent», «iridescent». На 5 Lite текстуры — это полноценный модификатор, а не «приятный бонус». «Iridescent silk fabric with matte metallic threads» рендерится точно.\n\nКинематограф расширен: «Wes Anderson style», «Kubrick», «blockbuster aesthetic» — модель знает эти конкретные референсы.",
      },
    ],
    examples: [
      {
        before: "повар готовит блюдо",
        after:
          "A chef in a crisp white jacket carefully plating a dish, both hands visible holding a small spoon and a microherb stem, photorealistic portrait, 50mm lens, soft directional light from the kitchen window on the left, warm tungsten accent from above, focused intent expression, shallow depth of field with sharp focus on the plate, fine skin texture and detailed hand anatomy, --ar 4:5.",
        note:
          "Сцена с детальной работой рук — основная зона 5 Lite. Указано «both hands visible», конкретные предметы в руках, «detailed hand anatomy». Это то, что на 4.5 ещё ломалось, а на 5 Lite выходит чисто.",
      },
      {
        before: "обложка книги про путешествия",
        after:
          "Book cover for a travel memoir, title text \"BEYOND THE HORIZON\" in elegant serif typography centered at the top third, subtitle \"a journey across three continents\" in smaller sans-serif below the title, author name \"ELENA MORI\" at the bottom in small caps, vintage photograph of a winding mountain road at golden hour as the background, warm earthy color palette, subtle film grain, --ar 2:3.",
        note:
          "Длинный текст в трёх отдельных элементах с разными шрифтами и расположением. На 4.5 это работало частично; на 5 Lite — production-ready. Все три блока читаются и расположены точно.",
      },
      {
        before: "сюрреалистическая сцена с летающими предметами",
        after:
          "A vintage typewriter floating above a wooden desk, brass keys mid-press as if pressed by an invisible hand, sheets of paper drifting upward around it, photorealistic with surreal touches, 3D render in Octane with ray tracing, dramatic side light from the right casting long shadows, deep blue-grey background, ultra-detailed brass texture, iridescent paper edges catching the light, --ar 16:9.",
        note:
          "Расширенный диапазон стилей — 3D render in Octane with ray tracing — работает на 5 Lite буквально. Текстуры «ultra-detailed brass» и «iridescent paper edges» — точные модификаторы, которые 5 Lite понимает.",
      },
    ],
    mistakes: [
      {
        title: "Промпт слишком короткий для 5 Lite",
        explain:
          "5 Lite справляется с 30–120 словами. Если давать ему 10–15 слов как 4.0, теряется его преимущество — модель будет додумывать вместо того, чтобы рендерить ровно то, что в промпте. Используй расширенный шестой блок «Дополнительные детали» (текстуры, материалы, микро-настроение) — это рабочая зона 5 Lite.",
      },
      {
        title: "Промпт длиннее 200 слов",
        explain:
          "Даже у 5 Lite есть предел. 30–120 — оптимум, до 150 — рабочая зона, выше 200 — модель теряет фокус. Если хочется впихнуть всё, лучше разбить на итерации: базовый промпт → генерация → image-to-image с уточнениями на следующем шаге. 5 Lite поддерживает полный editing endpoint, не нужно собирать всё в один промпт.",
      },
      {
        title: "Использование 5 Lite как 4.0",
        explain:
          "Если приходишь на 5 Lite с промптами уровня 4.0 («simple subject, simple style») — теряется потенциал модели. Используй расширенные стили (3D-рендеры, новые арт-направления), детальную анатомию рук в сценах с людьми, длинные тексты в постерах, многоэлементные сцены. Иначе зачем переходить с 4.0.",
      },
      {
        title: "Негативы в основном тексте",
        explain:
          "Как и на 4.0 и 4.5, на 5 Lite негативные промпты пишутся в отдельное поле platform negative_prompt. «No watermark, no text» в основном промпте 5 Lite может воспринять буквально — добавит водяной знак. Используй отдельное поле; на платформах вроде fal.ai это явный параметр negative_prompt.",
      },
      {
        title: "Текст без кавычек",
        explain:
          "Даже на 5 Lite текст для рендеринга — всегда в кавычках. «Add the words Beyond the Horizon» без кавычек модель может исказить или вставить слова в неправильном порядке. Правильно: «text \"BEYOND THE HORIZON\"». Указывай стиль шрифта и расположение — это критично для длинных строк.",
      },
    ],
    faq: [
      {
        q: "Чем 5 Lite отличается от 4.5?",
        a: "Семь ключевых апгрейдов: более точная генерация текста (длинные строки, мелкий кегль, сложная типографика), заметно улучшенная анатомия рук, лучшее удержание многоэлементных сцен, расширенный диапазон стилей (3D-рендеры, gouache, charcoal, underwater), точное пространственное понимание, поддержка длинных промптов до 120 слов, полный editing endpoint (inpainting + outpainting).",
      },
      {
        q: "Чем 5 Lite отличается от полной версии 5?",
        a: "5 Lite — облегчённая публичная версия, доступная через fal.ai и syntx.ai. Полная версия Seedream 5 пока имеет ограниченную доступность. Lite сохраняет все ключевые апгрейды (текст, руки, стили, длина промпта) и стабильна для production-задач. Для большинства реальных задач 5 Lite — это и есть «Seedream 5» на практике.",
      },
      {
        q: "Какая оптимальная длина промпта для 5 Lite?",
        a: "30–120 слов. Это шире, чем у 4.5 (30–100) и заметно шире, чем у 4.0 (20–80). Модель удерживает фокус на длинных детализированных промптах с расширенным шестым блоком «Дополнительные детали» (текстуры, материалы, микро-настроение). Выше 150 слов — модель начинает терять фокус; выше 200 — приоритеты смещаются.",
      },
      {
        q: "Как использовать улучшенную анатомию рук?",
        a: "Прописывай руки конкретно в промпте: «both hands visible», «holding a [предмет]», «fingers interlaced», «hand gesture indicating [что-то]». Чем явнее ты описываешь, что должны делать руки, тем меньше артефактов. Дополнительно — «detailed hand anatomy», «fine finger detail» как технические якоря в конце промпта. На 4.5 это не работало; на 5 Lite — рабочий приём.",
      },
      {
        q: "Поддерживается ли inpainting и outpainting?",
        a: "Да, 5 Lite — единственная версия линейки с полным editing endpoint, включая inpainting (точное редактирование области) и outpainting (расширение изображения за пределы оригинала). На fal.ai и syntx.ai эти возможности доступны как отдельные UI-режимы. В 4.5 был только базовый inpainting; в 4.0 — только image-to-image.",
      },
      {
        q: "Какие новые стили появились в 5 Lite?",
        a: "Три категории. 3D-рендеры — «3D render», «CGI», «Unreal Engine», «Octane render», «ray tracing», «isometric». Новые арт-направления — «gouache», «charcoal», «ink wash». Новые фото-жанры — «underwater photography». Также расширены кинематографические референсы — «Wes Anderson style», «Kubrick», «blockbuster aesthetic». Текстуры стали полноценным модификатором — «iridescent», «translucent», «glossy», «matte».",
      },
      {
        q: "Поддерживается ли Opten для Seedream 5 Lite?",
        a: "Да, расширение Opten распознаёт Seedream 5 Lite внутри fal.ai и syntx.ai. Оценивает промпт по структуре самой свежей версии: проверяет длину (30–120 слов оптимум), субъект в начале, использование расширенного шестого блока с деталями, корректность многоэлементных сцен, кавычки вокруг длинных текстов, корректное использование 3D-стилей. Одним кликом получишь rewrite, использующий все преимущества 5 Lite.",
      },
    ],
  },
  en: {
    title: "Seedream 5 Lite Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedream 5 Lite: improved text rendering, hand anatomy, long prompts up to 120 words, extended styles, and examples.",
    h1: "Seedream 5 Lite: how to write prompts the model actually understands",
    intro:
      "Seedream 5 Lite is the latest version of ByteDance's image model. Text-to-image, image-to-image, multi-image blending, inpainting, and outpainting up to 4K+. Optimal prompt length 30–120 words. Available via fal.ai and syntx.ai. It brought improved text rendering, noticeably better hand anatomy, and an extended style range compared to 4.5.",
    sections: [
      {
        heading: "How 5 Lite differs from 4.5",
        body:
          "5 Lite is an upgrade across seven dimensions. More precise in-image text generation (long strings and small type work reliably). Better human anatomy — hands, fingers, and poses come out with noticeably fewer artifacts.\n\nImproved handling of complex multi-element scenes — where 4.5 occasionally loses one object out of five, 5 Lite holds all of them. Style range is extended: 3D renders (Unreal Engine, Octane, ray tracing), new art directions (gouache, charcoal), photo genres (underwater).\n\nBetter spatial understanding (precise distances and proportions between objects). Support for long prompts up to 120 words without losing focus. Full editing endpoint with inpainting, outpainting, and precise image-to-image.",
        bullets: [
          "Text-to-Image, Image-to-Image, Multi-Image Blending, Inpainting, Outpainting",
          "Resolution up to 4K+",
          "Optimal prompt length 30–120 words",
          "Noticeably improved hand and finger anatomy",
          "Extended range of 3D renders and art directions",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Canonical formula: `[Subject] + [Style] + [Composition] + [Lighting/Atmosphere] + [Technical parameters] + [Additional details]`. The prioritization hierarchy is shared across the line — subject always first.\n\n5 Lite allows a sixth block «Additional details» without losing focus. These can be textures («fine skin texture detail»), materials («brushed brass, oiled walnut»), micro-mood («contemplative expression»). On 4.5 this much detail could dilute priorities; on 5 Lite the model holds it all.\n\nExample: «A middle-aged man with salt-and-pepper beard, photorealistic portrait, 105mm lens, Rembrandt lighting, dark moody background, contemplative expression, shallow depth of field, fine skin texture detail.» — 25 words with extended detail. That is a working level for 5 Lite.",
      },
      {
        heading: "Extended text rendering",
        body:
          "After hand anatomy, the next major 5 Lite upgrade is in-image text. What was «good» in 4.5 becomes «excellent» in 5 Lite: long strings, small type, complex typography, Cyrillic and CJK.\n\nRules: text in quotes (`text \"YOUR TEXT HERE\"`), font style («bold sans-serif», «elegant serif», «handwritten», «metallic typography»), placement («centered at top», «bottom left corner», «in the upper third»). For long text — split into separate elements.\n\nWhat works on 5 Lite but not on 4.5: long taglines of 5+ words in a single string, fine infographic labels, packaging with side text, multilingual typography on one poster. Effectively, this is GPT Image 2 territory — text rendering stopped being a lottery.",
      },
      {
        heading: "Anatomy and multi-element scenes",
        body:
          "Hands and fingers were a weak zone for almost every image model before 2024. In 5 Lite this is fixed: hands holding objects, intertwined fingers, gestures — all render with noticeably fewer artifacts.\n\nThis unlocks scenarios unavailable in 4.5: photos with detailed hand work (craftsman at work, musician with an instrument, chef with ingredients), portraits with complex hand poses (prayer, applause, embrace), fashion with garment interaction (adjusting a sleeve, holding a bag).\n\nMulti-element scenes — 4.5 sometimes «loses» one of 4–5 objects or scrambles their positions. 5 Lite holds them all: «A father, mother, and two children sitting around a dinner table, with a dog under the table and a cat on the windowsill» — all six subjects are in place.",
      },
      {
        heading: "Extended style range",
        body:
          "5 Lite adds entire style categories that weren't in 4.5. 3D renders — «3D render», «CGI», «Unreal Engine», «Octane render», «ray tracing», «isometric». These labels are understood literally and yield results at the level of professional 3D software.\n\nNew art directions — «gouache», «charcoal», «ink wash». New photo genres — «underwater photography».\n\nTextures as a separate layer — «smooth», «rough», «grainy», «glossy», «matte», «translucent», «iridescent». On 5 Lite textures are a full-fledged modifier, not just a «nice bonus». «Iridescent silk fabric with matte metallic threads» renders accurately.\n\nCinematic range expanded: «Wes Anderson style», «Kubrick», «blockbuster aesthetic» — the model knows these specific references.",
      },
    ],
    examples: [
      {
        before: "chef cooking a dish",
        after:
          "A chef in a crisp white jacket carefully plating a dish, both hands visible holding a small spoon and a microherb stem, photorealistic portrait, 50mm lens, soft directional light from the kitchen window on the left, warm tungsten accent from above, focused intent expression, shallow depth of field with sharp focus on the plate, fine skin texture and detailed hand anatomy, --ar 4:5.",
        note:
          "A scene with detailed hand work — the main 5 Lite zone. «Both hands visible» is explicit, specific objects in hands, «detailed hand anatomy». This used to break on 4.5; on 5 Lite it comes out clean.",
      },
      {
        before: "travel memoir book cover",
        after:
          "Book cover for a travel memoir, title text \"BEYOND THE HORIZON\" in elegant serif typography centered at the top third, subtitle \"a journey across three continents\" in smaller sans-serif below the title, author name \"ELENA MORI\" at the bottom in small caps, vintage photograph of a winding mountain road at golden hour as the background, warm earthy color palette, subtle film grain, --ar 2:3.",
        note:
          "Long text in three separate elements with different fonts and placements. On 4.5 this worked partially; on 5 Lite it is production-ready. All three blocks are readable and positioned accurately.",
      },
      {
        before: "surreal scene with floating objects",
        after:
          "A vintage typewriter floating above a wooden desk, brass keys mid-press as if pressed by an invisible hand, sheets of paper drifting upward around it, photorealistic with surreal touches, 3D render in Octane with ray tracing, dramatic side light from the right casting long shadows, deep blue-grey background, ultra-detailed brass texture, iridescent paper edges catching the light, --ar 16:9.",
        note:
          "Extended style range — «3D render in Octane with ray tracing» — works literally on 5 Lite. Textures like «ultra-detailed brass» and «iridescent paper edges» are precise modifiers that 5 Lite understands.",
      },
    ],
    mistakes: [
      {
        title: "Prompt too short for 5 Lite",
        explain:
          "5 Lite handles 30–120 words. Giving it 10–15 words like 4.0 wastes its advantage — the model will fill in instead of rendering exactly what is in the prompt. Use the extended sixth block «Additional details» (textures, materials, micro-mood) — that is a 5 Lite sweet spot.",
      },
      {
        title: "Prompt longer than 200 words",
        explain:
          "Even 5 Lite has a ceiling. 30–120 is the sweet spot, up to 150 still works, past 200 the model loses focus. If you want to pack everything in, split into iterations: base prompt → generation → image-to-image with refinements on the next step. 5 Lite supports the full editing endpoint — there's no need to cram everything into one prompt.",
      },
      {
        title: "Using 5 Lite as 4.0",
        explain:
          "If you bring 4.0-level prompts to 5 Lite («simple subject, simple style»), the model's potential is wasted. Use extended styles (3D renders, new art directions), detailed hand anatomy in scenes with people, long texts on posters, multi-element scenes. Otherwise, why upgrade from 4.0.",
      },
      {
        title: "Negatives in the main text",
        explain:
          "As on 4.0 and 4.5, on 5 Lite negative prompts go into the platform's separate negative_prompt field. «No watermark, no text» in the main prompt can be read literally — the model may add a watermark. Use the dedicated field; on platforms like fal.ai it is an explicit negative_prompt parameter.",
      },
      {
        title: "Text without quotes",
        explain:
          "Even on 5 Lite, text for rendering always goes in quotes. «Add the words Beyond the Horizon» without quotes can get mangled or printed out of order. Correct: «text \"BEYOND THE HORIZON\"». Specify font style and placement — critical for long strings.",
      },
    ],
    faq: [
      {
        q: "How is 5 Lite different from 4.5?",
        a: "Seven key upgrades: more precise text generation (long strings, small type, complex typography), noticeably improved hand anatomy, better retention of multi-element scenes, extended style range (3D renders, gouache, charcoal, underwater), precise spatial understanding, support for long prompts up to 120 words, and the full editing endpoint (inpainting + outpainting).",
      },
      {
        q: "How is 5 Lite different from the full Seedream 5?",
        a: "5 Lite is the lighter public version available via fal.ai and syntx.ai. The full Seedream 5 has limited availability for now. Lite keeps all the key upgrades (text, hands, styles, prompt length) and is stable for production. For most real-world tasks 5 Lite effectively is «Seedream 5» in practice.",
      },
      {
        q: "What is the optimal prompt length for 5 Lite?",
        a: "30–120 words. That is wider than 4.5 (30–100) and noticeably wider than 4.0 (20–80). The model holds focus on long detailed prompts with the extended sixth block «Additional details» (textures, materials, micro-mood). Past 150 words the model starts losing focus; past 200 priorities drift.",
      },
      {
        q: "How do I leverage the improved hand anatomy?",
        a: "Describe hands concretely in the prompt: «both hands visible», «holding a [object]», «fingers interlaced», «hand gesture indicating [something]». The more explicit you are about what hands should do, the fewer artifacts. Optionally add «detailed hand anatomy», «fine finger detail» as technical anchors at the end of the prompt. This did not work on 4.5; on 5 Lite it is a reliable technique.",
      },
      {
        q: "Are inpainting and outpainting supported?",
        a: "Yes, 5 Lite is the only version in the line with the full editing endpoint, including inpainting (precise area editing) and outpainting (extending an image beyond the original frame). On fal.ai and syntx.ai these are available as separate UI modes. In 4.5 only basic inpainting was available; in 4.0 only image-to-image.",
      },
      {
        q: "Which new styles arrived in 5 Lite?",
        a: "Three categories. 3D renders — «3D render», «CGI», «Unreal Engine», «Octane render», «ray tracing», «isometric». New art directions — «gouache», «charcoal», «ink wash». New photo genres — «underwater photography». Cinematic references are also expanded — «Wes Anderson style», «Kubrick», «blockbuster aesthetic». Textures became a full-fledged modifier — «iridescent», «translucent», «glossy», «matte».",
      },
      {
        q: "Does Opten support Seedream 5 Lite?",
        a: "Yes, the Opten extension detects Seedream 5 Lite inside fal.ai and syntx.ai. It scores prompts against the freshest-version structure: checks length (30–120 words sweet spot), subject at the start, use of the extended sixth detail block, correctness of multi-element scenes, quotes around long texts, correct use of 3D styles. One click gives you a rewrite that takes full advantage of 5 Lite.",
      },
    ],
  },
};
