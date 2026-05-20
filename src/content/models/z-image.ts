// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for z-image.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Z-Image: структура, ошибки, примеры",
    description:
      "Как писать промпты для Z-Image от Alibaba: описательные промпты, билингвальный текст EN+CN, негативные промпты в Base, частые ошибки и примеры до/после.",
    h1: "Z-Image: как писать промпты, которые модель понимает",
    intro:
      "Z-Image — компактная 6B image-модель от Alibaba Tongyi-MAI с открытыми весами под Apache 2.0. Главные фичи — билингвальный рендеринг текста (английский плюс китайский) и встроенный Prompt Enhancer. Доступна в вариантах Base (50 шагов, есть negative prompt) и Turbo (8 шагов, sub-second inference на H800). Запускается на consumer GPU от RTX 3060.",
    sections: [
      {
        heading: "Что умеет Z-Image",
        body:
          "Z-Image — это 6 миллиардов параметров на архитектуре S3-DiT (Scalable Single-Stream Diffusion Transformer). Версия Turbo — distilled до 8 шагов, даёт sub-second генерацию на H800 GPU и заняла первое место среди open-source моделей в рейтинге Artificial Analysis. Версия Base — полные 50 шагов, поддерживает negative prompt, тренируется LoRA, работает с ControlNet (canny, depth) и режимом Z-Image-Edit.\n\nКлючевые цифры: разрешение flexible до примерно 4 мегапикселей, hardware-требования — RTX 3060 с 16 ГБ VRAM. Лицензия Apache 2.0 разрешает коммерческое использование. Запускается через HuggingFace (локально), fal.ai (API) или собирается в свой стек. И английский, и китайский поддерживаются нативно — для промптов и для рендеринга текста внутри изображения.",
        bullets: [
          "6B параметров на S3-DiT — компактнее конкурентов",
          "Билингвальный текст: EN + CN в изображениях",
          "Turbo — sub-second на H800, Base — negative prompt + LoRA",
          "ControlNet (canny, depth) + Z-Image-Edit",
          "Open-source под Apache 2.0, RTX 3060+ (16 ГБ VRAM)",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Подробные описательные промпты работают лучше всего:\n\n[Subject with details] + [Style keyword] + [Lighting] + [Composition] + [Quality modifiers]\n\nСтилевые ключевые слова, на которые Z-Image хорошо реагирует: «oil painting», «3D render», «anime style», «photorealistic», «watercolor», «pencil sketch». Освещение — «natural light», «studio lighting», «golden hour», «dramatic shadow», «neon glow». Композиция — «close-up», «wide shot», «bird's eye», «centered», «rule of thirds». Quality modifiers — «ultra-detailed», «high-resolution», «crisp», «sharp» — у Z-Image они реально работают, в отличие от многих open-source моделей.\n\nДля рендеринга текста в изображении указывай его явно в кавычках: «A vintage poster with the title \"Spring Festival\" in red bold letters». Z-Image рендерит и латиницу, и иероглифы — это её ключевая фича по сравнению с конкурентами схожего размера.",
      },
      {
        heading: "Prompt Enhancer и неоднозначные промпты",
        body:
          "Z-Image содержит встроенный Prompt Enhancer (PE) — компонент, который инжектирует reasoning и common sense в момент обработки промпта. Это позволяет выводить осмысленный результат даже из неоднозначных коротких описаний: модель «додумывает» недостающее с правдоподобными деталями.\n\nЭто полезно для быстрого прототипирования и творческих экспериментов, но не заменяет хороший промпт. Если важна предсказуемость — пиши подробно: PE помогает закрыть пропуски, не интерпретирует за тебя ключевые решения. На практике: «cat in a garden» → PE додумает породу, время суток, тип сада. «A british shorthair cat sitting in a Japanese moss garden at dawn» → результат предсказуемее и ближе к замыслу.\n\nКомбинация PE плюс описательный промпт — лучший паттерн использования Z-Image. PE компенсирует мелкие пропуски, а основное описание задаёт направление.",
      },
      {
        heading: "Билингвальный текст в изображениях",
        body:
          "Главное преимущество Z-Image перед моделями схожего размера — точный рендеринг и английского, и китайского текста внутри изображений. Это удобно для билингвальных баннеров, плакатов на двух языках, рекламы для китайского рынка, мемов с английским текстом, инфографики с китайскими подписями.\n\nДля точного рендеринга указывай текст явно в кавычках в промпте:\n• «A coffee shop sign that reads \"Morning Brew\" in elegant gold script»\n• «A poster with the Chinese title \"春节快乐\" (Happy Spring Festival) in red calligraphy»\n• «A book cover with the English title \"The Silent Mountain\" and subtitle \"A Journey Through Tibet\"»\n\nЗ-Image — это не Qwen Image (другая модель той же Alibaba). Для качественного рендеринга добавляй детали: шрифт (calligraphy, bold, sans-serif), цвет, расположение в кадре. Чем точнее указан текст и его параметры, тем выше шанс безошибочного рендера.",
      },
      {
        heading: "Base vs Turbo: когда какую использовать",
        body:
          "Z-Image Turbo — 8 шагов, sub-second inference на H800 GPU. Лучший выбор для массовой генерации, прототипирования, A/B-тестов креативов, любых сценариев где скорость важнее тонкого контроля. Negative prompt в Turbo официально не задокументирован, поэтому управление идёт через основной промпт и его уточнения.\n\nZ-Image Base — 50 шагов, стандартная скорость, поддерживает negative prompt и тренировку LoRA. Базовая версия для продакшна, где важно качество одного финального изображения, для fine-tuning под конкретный стиль или продукт, для пайплайнов с ControlNet (canny edge, depth map) и для inpainting через Z-Image-Edit. Если задача требует исключения нежелательных элементов (watermark, deformed hands, text artifacts) — используй Base с negative prompt.\n\nТипичный workflow: прототипировать в Turbo, затем переходить в Base с уточнённым промптом и negative prompt для финальной генерации.",
      },
    ],
    examples: [
      {
        before: "a cafe sign",
        after:
          "A vintage coffee shop sign hanging from a brass chain, with the text \"Morning Brew\" written in elegant cursive gold script on a deep navy background. Worn wooden frame around the sign, slight weathering on the edges. Mounted on a brick wall, soft afternoon sunlight from the left creating warm shadows. Photorealistic, ultra-detailed, sharp focus, editorial photography style, 50mm lens, shallow depth of field.",
        note:
          "Текст явно в кавычках с указанием шрифта и цвета. Конкретный материал и среда. Освещение с направлением. Quality modifiers «ultra-detailed, sharp focus» работают в Z-Image.",
      },
      {
        before: "billboard with chinese text",
        after:
          "A modern billboard in a busy Shanghai street at twilight, featuring the bold Chinese title \"新春快乐\" (Happy New Year) in red calligraphy on a yellow background. Below the title, smaller English subtitle \"Spring Festival 2026\" in clean white sans-serif. Neon city lights reflected on wet pavement below. Wide-angle low-angle shot. Cinematic, photorealistic, ultra-detailed, sharp focus on the text.",
        note:
          "Билингвальный рендер: китайский и английский текст оба в кавычках с указанием шрифта, цвета, размера. Z-Image — одна из немногих моделей, которая надёжно вытягивает оба языка одновременно.",
      },
      {
        before: "anime character illustration",
        after:
          "A young woman with long pink hair tied in twin braids, wearing a white school uniform with a navy blue tie, standing in a cherry blossom park at golden hour. Soft warm sunlight filtering through the petals creating bokeh in the background. Detailed eyes with reflective highlights, hand-drawn linework. Anime style, ultra-detailed, sharp focus, vibrant colors, cinematic composition, rule of thirds.",
        note:
          "Стилевое ключевое слово «anime style» в начале блока стиля. Конкретные детали персонажа, среды и освещения. Quality modifiers сложены последовательно.",
      },
    ],
    mistakes: [
      {
        title: "Слишком минимальный промпт",
        explain:
          "«A cat» — Prompt Enhancer попытается додумать, но без направления выдаст generic результат. PE помогает заполнить пропуски, не заменяет описание. Минимум для стабильности: конкретный субъект с 2-3 деталями («a british shorthair cat with green eyes»), стиль (photorealistic / anime / oil painting), освещение и хотя бы одна композиционная деталь.",
      },
      {
        title: "Текст без явных кавычек",
        explain:
          "«Make a poster about spring festival» — Z-Image не знает, какой именно текст рендерить, и часто выдаст искажённые символы или поставит свой. Точный текст всегда в кавычках с указанием шрифта и цвета: «with the title \"Spring Festival\" in red bold calligraphy». Это критично для билингвального рендера — главной фичи модели.",
      },
      {
        title: "Negative prompt в Turbo вместо Base",
        explain:
          "Поддержка negative prompt официально задокументирована только для Base-версии. В Turbo (8 шагов, distilled) negative prompt либо игнорируется, либо влияет непредсказуемо. Если задача требует исключения watermark, артефактов рук или текстовых ошибок — используй Z-Image Base с явным negative prompt в настройках платформы.",
      },
      {
        title: "Ожидание возможностей видео или vision",
        explain:
          "Z-Image — генератор изображений, не видеомодель и не анализатор. Промпты типа «animate this scene» или «describe what's in this photo» не работают. Для видео нужны Sora 2, Veo 3.1, Kling, Wan-video. Для анализа изображений — модели семейства Qwen-VL или GPT-4V. Z-Image закрывает только T2I и I2I.",
      },
      {
        title: "Путаница с Qwen Image",
        explain:
          "Z-Image и Qwen Image — разные модели от разных команд Alibaba: Z-Image сделана командой Tongyi-MAI, Qwen Image — командой Qwen. Архитектура, тренировочные данные и сильные стороны разные. Промпт под Qwen может не работать оптимально в Z-Image и наоборот. Проверяй, под какую конкретно модель пишется промпт, особенно при экспорте между платформами.",
      },
    ],
    faq: [
      {
        q: "Чем Z-Image отличается от других open-source image моделей?",
        a: "Тремя вещами. Первое: компактная 6B архитектура S3-DiT — конкуренты обычно 20B-80B, Z-Image выдаёт сопоставимое качество при меньшем размере. Второе: точный билингвальный рендер текста — английский и китайский одновременно работают надёжно. Третье: встроенный Prompt Enhancer, который заполняет пропуски в коротких промптах. Лицензия Apache 2.0 — полностью коммерческая.",
      },
      {
        q: "Какая разница между Z-Image Base и Z-Image Turbo?",
        a: "Base — 50 шагов, стандартная скорость, поддерживает negative prompt, тренировку LoRA, работу с ControlNet и Z-Image-Edit. Turbo — 8 шагов distilled, sub-second inference на H800 GPU, лучший выбор для скорости и массовой генерации. Negative prompt в Turbo не задокументирован. Прототипируй в Turbo, финальные кадры — в Base.",
      },
      {
        q: "Какое железо нужно для локального запуска?",
        a: "Минимум — RTX 3060 с 16 ГБ VRAM. Это даёт работоспособный запуск на consumer hardware, что является важным преимуществом Z-Image: большинство моделей сравнимого качества требует профессиональные GPU класса H100. Веса доступны на HuggingFace, есть готовые ComfyUI workflows. Для облака — fal.ai даёт API с оплатой по использованию.",
      },
      {
        q: "Как добиться точного рендера текста в изображении?",
        a: "Указывай текст явно в кавычках, добавляй параметры шрифта (calligraphy, bold, sans-serif, cursive), цвет, расположение в кадре. Пример: «with the title \"Morning Brew\" in elegant gold cursive script, centered at top». Для билингвального рендера указывай оба текста с переводом в скобках: «Chinese title \"春节快乐\" (Happy Spring Festival)». Z-Image — одна из немногих open-source моделей с надёжным рендером CJK.",
      },
      {
        q: "Что такое Prompt Enhancer и нужно ли его настраивать?",
        a: "Prompt Enhancer — встроенный компонент Z-Image, который инжектирует reasoning и common sense в момент обработки промпта. Он включается автоматически и не требует настройки. PE помогает «додумать» недостающее в коротких промптах: например, «cat in garden» получит правдоподобную породу, время суток и тип сада. Не заменяет хороший промпт — для предсказуемости лучше писать подробно.",
      },
      {
        q: "Поддерживает ли Z-Image fine-tuning через LoRA?",
        a: "Да, но только Base-версия — Turbo distilled-модель и стандартный LoRA-стек поверх неё работает нестабильно. Для тренировки LoRA под конкретный стиль, бренд или продукт используй Z-Image Base: на HuggingFace доступны веса, есть готовые скрипты обучения. Также Base поддерживает ControlNet (canny, depth) и режим Z-Image-Edit для inpainting.",
      },
      {
        q: "Поддерживается ли Opten для Z-Image?",
        a: "Да, расширение Opten распознаёт Z-Image на платформах fal.ai и HuggingFace Spaces и оценивает промпты по структуре, описанной выше: проверяет описательность вместо минимализма, наличие явного текста в кавычках при текстовых задачах, корректный выбор Base/Turbo, отсутствие путаницы с Qwen Image. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Z-Image Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Alibaba's Z-Image: descriptive prompts, bilingual EN+CN text, negative prompts in Base, common mistakes, and before/after examples.",
    h1: "Z-Image: how to write prompts the model actually understands",
    intro:
      "Z-Image is Alibaba Tongyi-MAI's compact 6B image model with open Apache 2.0 weights. Its key features are bilingual text rendering (English plus Chinese) and a built-in Prompt Enhancer. Available in Base (50 steps, negative prompt) and Turbo (8 steps, sub-second inference on H800) variants. Runs on consumer GPUs from RTX 3060 upward.",
    sections: [
      {
        heading: "What Z-Image does",
        body:
          "Z-Image is 6 billion parameters on the S3-DiT (Scalable Single-Stream Diffusion Transformer) architecture. The Turbo variant is distilled to 8 steps, gives sub-second generation on H800 GPUs, and took first place among open-source models in the Artificial Analysis ranking. The Base variant runs the full 50 steps, supports negative prompts, trains LoRA, works with ControlNet (canny, depth), and supports the Z-Image-Edit mode.\n\nKey numbers: flexible resolution up to roughly 4 megapixels, hardware target — RTX 3060 with 16 GB VRAM. The Apache 2.0 license permits commercial use. Run it via HuggingFace (locally), fal.ai (API), or integrate into your own stack. Both English and Chinese are natively supported — for the prompt itself and for in-image text rendering.",
        bullets: [
          "6B parameters on S3-DiT — more compact than competitors",
          "Bilingual text: EN + CN inside images",
          "Turbo — sub-second on H800, Base — negative prompt + LoRA",
          "ControlNet (canny, depth) + Z-Image-Edit",
          "Open-source under Apache 2.0, RTX 3060+ (16 GB VRAM)",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Detailed descriptive prompts work best:\n\n[Subject with details] + [Style keyword] + [Lighting] + [Composition] + [Quality modifiers]\n\nStyle keywords Z-Image responds well to: «oil painting», «3D render», «anime style», «photorealistic», «watercolor», «pencil sketch». Lighting — «natural light», «studio lighting», «golden hour», «dramatic shadow», «neon glow». Composition — «close-up», «wide shot», «bird's eye», «centered», «rule of thirds». Quality modifiers — «ultra-detailed», «high-resolution», «crisp», «sharp» — in Z-Image these actually move the needle, unlike many open-source models.\n\nFor in-image text rendering specify it explicitly in quotes: «A vintage poster with the title \"Spring Festival\" in red bold letters». Z-Image renders both Latin script and Chinese characters — its key feature versus competitors of similar size.",
      },
      {
        heading: "Prompt Enhancer and ambiguous prompts",
        body:
          "Z-Image ships with a built-in Prompt Enhancer (PE) — a component that injects reasoning and common sense at the moment the prompt is processed. This lets it produce sensible output even from short ambiguous descriptions: the model fills in the missing pieces with plausible detail.\n\nUseful for rapid prototyping and creative experiments, but it does not replace a good prompt. If predictability matters, write it out: PE patches gaps, it does not interpret key decisions on your behalf. In practice: «cat in a garden» → PE invents the breed, time of day, garden type. «A british shorthair cat sitting in a Japanese moss garden at dawn» → the result is more predictable and closer to intent.\n\nPE plus a descriptive prompt is the best usage pattern for Z-Image. PE covers small gaps while the main description locks in direction.",
      },
      {
        heading: "Bilingual text inside images",
        body:
          "Z-Image's main advantage over similarly sized models is accurate rendering of both English and Chinese text inside images. This is convenient for bilingual banners, two-language posters, ads aimed at the Chinese market, memes with English text, and infographics with Chinese captions.\n\nFor precise rendering specify text explicitly in quotes inside the prompt:\n• «A coffee shop sign that reads \"Morning Brew\" in elegant gold script»\n• «A poster with the Chinese title \"春节快乐\" (Happy Spring Festival) in red calligraphy»\n• «A book cover with the English title \"The Silent Mountain\" and subtitle \"A Journey Through Tibet\"»\n\nZ-Image is not Qwen Image (a different model by another Alibaba team). For solid rendering add details: font (calligraphy, bold, sans-serif), color, placement in the frame. The more precise the text and its parameters, the higher the chance of an error-free render.",
      },
      {
        heading: "Base vs Turbo: when to use which",
        body:
          "Z-Image Turbo — 8 steps, sub-second inference on H800 GPUs. Best choice for mass generation, prototyping, A/B testing creatives, any scenario where speed matters more than fine control. Negative prompt support in Turbo is not officially documented, so control flows through the main prompt and its refinements.\n\nZ-Image Base — 50 steps, standard speed, supports negative prompts and LoRA training. The base for production work where the quality of a single final image matters, for fine-tuning to a specific style or product, for pipelines with ControlNet (canny edge, depth map), and for inpainting via Z-Image-Edit. If the task requires excluding unwanted elements (watermark, deformed hands, text artifacts), use Base with a negative prompt.\n\nTypical workflow: prototype in Turbo, then move to Base with a refined prompt and negative prompt for the final generation.",
      },
    ],
    examples: [
      {
        before: "a cafe sign",
        after:
          "A vintage coffee shop sign hanging from a brass chain, with the text \"Morning Brew\" written in elegant cursive gold script on a deep navy background. Worn wooden frame around the sign, slight weathering on the edges. Mounted on a brick wall, soft afternoon sunlight from the left creating warm shadows. Photorealistic, ultra-detailed, sharp focus, editorial photography style, 50mm lens, shallow depth of field.",
        note:
          "Text explicitly in quotes with font and color specified. Concrete material and environment. Lighting with direction. Quality modifiers «ultra-detailed, sharp focus» actually work in Z-Image.",
      },
      {
        before: "billboard with chinese text",
        after:
          "A modern billboard in a busy Shanghai street at twilight, featuring the bold Chinese title \"新春快乐\" (Happy New Year) in red calligraphy on a yellow background. Below the title, smaller English subtitle \"Spring Festival 2026\" in clean white sans-serif. Neon city lights reflected on wet pavement below. Wide-angle low-angle shot. Cinematic, photorealistic, ultra-detailed, sharp focus on the text.",
        note:
          "Bilingual render: Chinese and English text both in quotes with font, color, size specified. Z-Image is one of the few models that reliably pulls both languages at once.",
      },
      {
        before: "anime character illustration",
        after:
          "A young woman with long pink hair tied in twin braids, wearing a white school uniform with a navy blue tie, standing in a cherry blossom park at golden hour. Soft warm sunlight filtering through the petals creating bokeh in the background. Detailed eyes with reflective highlights, hand-drawn linework. Anime style, ultra-detailed, sharp focus, vibrant colors, cinematic composition, rule of thirds.",
        note:
          "Style keyword «anime style» at the start of the style block. Concrete character, environment, and lighting details. Quality modifiers stacked in sequence.",
      },
    ],
    mistakes: [
      {
        title: "Too minimal a prompt",
        explain:
          "«A cat» — Prompt Enhancer will try to fill in, but without direction the result is generic. PE patches gaps, it does not replace a description. Minimum for stability: a concrete subject with 2-3 details («a british shorthair cat with green eyes»), a style (photorealistic / anime / oil painting), lighting, and at least one composition cue.",
      },
      {
        title: "Text without explicit quotes",
        explain:
          "«Make a poster about spring festival» — Z-Image does not know what text to render and will often produce mangled glyphs or substitute its own. Exact text always in quotes with font and color specified: «with the title \"Spring Festival\" in red bold calligraphy». Critical for bilingual rendering — the model's signature feature.",
      },
      {
        title: "Negative prompt in Turbo instead of Base",
        explain:
          "Negative prompt support is officially documented only for the Base variant. In Turbo (8 steps, distilled) the negative prompt is either ignored or affects output unpredictably. If the task requires excluding watermarks, hand artifacts, or text errors, use Z-Image Base with an explicit negative prompt in platform settings.",
      },
      {
        title: "Expecting video or vision capabilities",
        explain:
          "Z-Image is an image generator, not a video model and not an analyzer. Prompts like «animate this scene» or «describe what's in this photo» do not work. For video reach for Sora 2, Veo 3.1, Kling, Wan-video. For image analysis use the Qwen-VL family or GPT-4V. Z-Image covers only T2I and I2I.",
      },
      {
        title: "Confusing it with Qwen Image",
        explain:
          "Z-Image and Qwen Image are different models from different Alibaba teams: Z-Image is built by Tongyi-MAI, Qwen Image by the Qwen team. Architecture, training data, and strengths differ. A Qwen prompt may not work optimally in Z-Image and vice versa. Check which specific model the prompt is written for, especially when exporting between platforms.",
      },
    ],
    faq: [
      {
        q: "How is Z-Image different from other open-source image models?",
        a: "Three things. First: a compact 6B S3-DiT architecture — competitors are usually 20B-80B, while Z-Image delivers comparable quality at a smaller footprint. Second: accurate bilingual text rendering — English and Chinese both work reliably at the same time. Third: a built-in Prompt Enhancer that fills gaps in short prompts. The Apache 2.0 license is fully commercial.",
      },
      {
        q: "What is the difference between Z-Image Base and Z-Image Turbo?",
        a: "Base — 50 steps, standard speed, supports negative prompts, LoRA training, ControlNet, and Z-Image-Edit. Turbo — 8 steps distilled, sub-second inference on H800 GPUs, best choice for speed and mass generation. Negative prompt in Turbo is not documented. Prototype in Turbo, do final shots in Base.",
      },
      {
        q: "What hardware is needed to run it locally?",
        a: "Minimum — RTX 3060 with 16 GB VRAM. That delivers workable local execution on consumer hardware, which is a meaningful Z-Image advantage: most models of comparable quality demand professional H100-class GPUs. Weights are on HuggingFace, and ready-made ComfyUI workflows exist. For cloud, fal.ai exposes a pay-as-you-go API.",
      },
      {
        q: "How do I get precise text rendering inside an image?",
        a: "Specify the text explicitly in quotes, add font parameters (calligraphy, bold, sans-serif, cursive), color, and placement in the frame. Example: «with the title \"Morning Brew\" in elegant gold cursive script, centered at top». For bilingual rendering specify both texts with a translation in parentheses: «Chinese title \"春节快乐\" (Happy Spring Festival)». Z-Image is one of the few open-source models with reliable CJK rendering.",
      },
      {
        q: "What is the Prompt Enhancer and do I need to configure it?",
        a: "The Prompt Enhancer is a built-in Z-Image component that injects reasoning and common sense at prompt processing time. It is enabled automatically and requires no configuration. PE helps fill in what is missing in short prompts: for example, «cat in garden» will get a plausible breed, time of day, and garden type. It does not replace a good prompt — for predictability write it out in detail.",
      },
      {
        q: "Does Z-Image support fine-tuning via LoRA?",
        a: "Yes, but only the Base variant — Turbo is a distilled model and the standard LoRA stack on top of it is unstable. For LoRA training to a specific style, brand, or product, use Z-Image Base: weights are on HuggingFace, training scripts are available. Base also supports ControlNet (canny, depth) and the Z-Image-Edit mode for inpainting.",
      },
      {
        q: "Does Opten support Z-Image?",
        a: "Yes, the Opten extension detects Z-Image on fal.ai and HuggingFace Spaces and scores prompts against the structure outlined above: it checks for descriptive depth instead of minimalism, explicit text in quotes for text tasks, the correct Base/Turbo choice, and the absence of Qwen Image confusion. One click gives you a rewrite in the right structure.",
      },
    ],
  },
};
