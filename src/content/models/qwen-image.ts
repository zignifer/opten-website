// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for qwen-image.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Qwen Image: структура, ошибки, примеры",
    description:
      "Как писать промпты для Qwen Image V1/V2.0 от Alibaba: рендеринг текста коммерческого уровня, билингвальный EN+CN, инфографика, типичные ошибки, примеры.",
    h1: "Qwen Image: как писать промпты, которые модель понимает",
    intro:
      "Qwen Image — image-модель от команды Alibaba Qwen с лидирующим рендерингом текста: коммерческий уровень на английском и китайском, multi-line layouts, параграфы. V2.0 — 7B параметров, нативные 2048×2048, до 1 000 токенов промпта, прямая генерация инфографики, PPT-слайдов, постеров и комиксов с текстовыми пузырями.",
    sections: [
      {
        heading: "Что умеет Qwen Image",
        body:
          "Главная фича — коммерческий рендеринг текста на EN и CN: multi-line, абзацы, заголовки, мелкие подписи. На AI Arena Qwen Image удерживает #1 в категориях T2I и image editing (V2.0). На 9 публичных бенчмарках (GenEval, DPG, OneIG-Bench, GEdit и др.) тоже первый.\n\nV2.0 — основной рабочий вариант: 7B параметров (легче V1 с 20B), значительно меньше VRAM, нативные 2048×2048 без апскейла, и unified generation+editing (одна модель для T2I и редактирования). V1 остаётся для тяжёлых production-пайплайнов с 40–58GB VRAM. Лицензия Apache 2.0 — полные коммерческие права.",
        bullets: [
          "Коммерческий уровень рендеринга текста (EN + CN)",
          "V2.0: нативные 2048×2048, до 1 000 токенов, 7B параметров",
          "Прямая генерация инфографики, PPT, постеров, комиксов",
          "ControlNet (canny, depth, pose, lineart, softedge, normal, openpose)",
          "Unified generation + editing в одной модели",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Подробные описательные промпты с композицией сцены работают лучше всего. Базовая формула: [Main subject] + [Scene composition] + [Style] + [Text content to render] + [Layout details].\n\nДля документов с текстом ВСЕГДА указывай текст явно в промпте — модель не «угадает», что должно быть в заголовке слайда. Для V2.0 можно использовать до 1 000 токенов, и для инфографики/комиксов это не «слишком много», а оптимально: модель умеет работать с плотной композицией.\n\nДля editing промпт — это инструкция, не полное описание. «Change the text to \"Q4 2026\"» работает; «A poster with text saying...» в editing-режиме — нет.",
      },
      {
        heading: "Рендеринг текста в изображении",
        body:
          "Qwen Image — лидер на рынке по точности текста, наравне с GPT Image 2. Multi-line layouts, paragraph-level text, инфографика с графиками и текстовыми блоками, PPT-слайды, комиксы с текстовыми пузырями, постеры с заголовками — всё это V2.0 генерирует прямой генерацией, без отдельного typography engine.\n\nПравила: писать точный текст в кавычках, указывать тип шрифта и кегль («bold serif headline», «small sans-serif caption»), задавать layout («centered», «left-aligned», «two-column grid»). Для билингвальных макетов (EN + CN на одном изображении) указывать оба языка явно — это сильная сторона именно Qwen Image.",
      },
      {
        heading: "Билингвальный EN + CN режим",
        body:
          "Qwen Image — единственная топовая модель, для которой китайский — нативный язык (команда Alibaba). Можно писать промпт на китайском, можно на английском, можно смешивать. Текст в изображении тоже может быть на любом из двух языков или билингвальным.\n\nКонкретные сценарии: маркетинговые материалы для китайского рынка с китайскими заголовками и английскими брендами, инфографика на двух языках для международных команд, комиксы с CJK-текстовыми пузырями, упаковка товаров для китайского e-commerce. Это область, где Qwen Image объективно лучше любой западной модели.",
      },
      {
        heading: "Не путать с другими моделями Qwen",
        body:
          "Это распространённая ошибка: Qwen Image ≠ Qwen2.5-VL ≠ Z-Image. Qwen Image (эта модель) — генератор изображений от Qwen team. Qwen2.5-VL — vision-модель, анализирует изображения, не генерирует их (другая команда, другая задача). Z-Image — отдельная модель от другой команды Alibaba, не из линейки Qwen.\n\nЕсли в инструкции к API или туториале написано «Qwen2.5-VL» — это про vision, не про генерацию. Для генерации точно нужен Qwen Image V1 или V2.0. На HuggingFace они лежат под разными repo, не перепутай.",
      },
    ],
    examples: [
      {
        before:
          "красивый постер с текстом про распродажу",
        after:
          "A retail sale poster, photorealistic background with shopping bags and gift boxes. Bold serif headline (EXACT): \"BLACK FRIDAY\" in red, centered top. Subheadline below in white sans-serif: \"Up to 70% off — November 28–30\". Bottom-right corner: small caption \"Free shipping over $50\". Two-column grid layout, vertical orientation. Commercial-grade typography.",
        note: "Точный текст в кавычках с пометкой EXACT, явные шрифты (serif headline + sans-serif sub), цвета и layout. Без этих указаний модель сама придумает текст и расположение — обычно не то, что нужно.",
      },
      {
        before:
          "инфографика про продажи компании",
        after:
          "Corporate infographic, white background, clean grid layout. Title (EXACT, centered top, bold sans-serif): \"Q4 Revenue Breakdown\". Four metric cards in a 2×2 grid, each with a number and label: \"$2.4M Total\", \"+18% YoY\", \"3 New Markets\", \"86% Retention\". Use Inter sans-serif for all numbers, brand color #1E40AF for highlights, light grey rules between cards. Print-ready commercial typography.",
        note: "Сложная композиция (2×2 grid) с конкретными цифрами и метками в кавычках. Указан шрифт (Inter), цвет (#1E40AF), пометка print-ready. V2.0 с 1 000 токенов умеет работать с такой плотностью.",
      },
      {
        before:
          "комикс с диалогом двух персонажей на китайском и английском",
        after:
          "Two-panel manga-style comic. Panel 1: A young woman in business attire holds a coffee cup, looking out a window. Speech bubble (Chinese): \"明天的会议准备好了吗？\". Panel 2: Close-up of her phone screen showing a message in English: \"Meeting moved to Friday\". Clean line art, black ink with light grey shading, white background. Comic-style typography, speech bubbles with thin black borders.",
        note: "Билингвальный текст (CN в первой панели, EN во второй), оба явно в кавычках. Указан стиль (manga, line art, ink), типографика (comic-style). Это сценарий, в котором Qwen Image обходит большинство западных моделей.",
      },
    ],
    mistakes: [
      {
        title: "Промпт без явного текста для документов",
        explain:
          "Если генерируешь инфографику, постер или PPT-слайд и не указал точный текст в кавычках — модель сама придумает заголовок и подписи, обычно не то, что нужно. Каждое текстовое поле должно быть в кавычках с пометкой EXACT. Для билингвальных макетов указывай оба языка отдельными блоками.",
      },
      {
        title: "Путаница Qwen Image и Qwen2.5-VL",
        explain:
          "Qwen Image — генератор изображений. Qwen2.5-VL — vision-модель для анализа изображений. Это две разные модели от разных команд Alibaba. Если в туториале или API сказано «Qwen2.5-VL», это НЕ про генерацию. Для генерации нужен именно Qwen Image V1 или V2.0 — проверь имя репозитория перед запуском.",
      },
      {
        title: "V1 на слабом GPU",
        explain:
          "Qwen Image V1 требует 40–58GB VRAM — это уровень A100/H100. На потребительских GPU (24GB и ниже) V1 не запустится либо будет работать с серьёзным offloading и низкой скоростью. Для локального запуска и большинства облачных пайплайнов бери V2.0 — 7B параметров, значительно меньше VRAM.",
      },
      {
        title: "Слишком короткий промпт для сложной композиции",
        explain:
          "V2.0 поддерживает до 1 000 токенов специально для сложных композиций — инфографики, PPT, комиксов. Если просишь 4-панельный комикс одним предложением, модель додумает контент случайным образом. Используй всю длину промпта для перечисления панелей, точного текста, layout, шрифтов, цветов.",
      },
      {
        title: "Полное описание сцены в editing-режиме",
        explain:
          "В V2.0 unified generation+editing — для editing промпт должен быть инструкцией, а не полным описанием. «Change the title text to \"Q4 2026\"» работает; «A poster with a Q4 2026 title and modern design» в editing-режиме модель попытается перерисовать целиком. Если хочется новый постер — переключайся на T2I-режим.",
      },
    ],
    faq: [
      {
        q: "Чем Qwen Image V2.0 отличается от V1?",
        a: "V2.0 — 7B параметров против 20B у V1, нативные 2048×2048 без апскейла, значительно меньше VRAM, поддержка до 1 000 токенов промпта и unified generation+editing в одной модели. V1 остаётся для тяжёлых production-пайплайнов с топовыми GPU, но для большинства задач V2.0 — однозначный выбор: быстрее, дешевле, при этом #1 на AI Arena.",
      },
      {
        q: "Можно ли писать промпт на китайском?",
        a: "Да, китайский — нативный язык для Qwen Image. Можно писать промпт целиком на CN, целиком на EN, или смешивать. Текст в изображении тоже может быть на любом из двух языков или билингвальным. Для маркетинговых материалов китайского рынка это сильное преимущество над западными моделями — там CN-рендеринг обычно хуже.",
      },
      {
        q: "Какое разрешение поддерживается?",
        a: "V2.0 — нативные 2048×2048 (2K) без апскейла, что критично для печатных материалов и инфографики. V1 — стандартные разрешения 1024×1024 + апскейлинг. Соотношения сторон гибкие, для документов лучше использовать стандартные форматы (A4 portrait, US Letter, 16:9 для PPT-слайдов).",
      },
      {
        q: "Работает ли ControlNet?",
        a: "Да, поддерживается 7 типов структурного контроля: canny (edges), depth, pose, lineart, softedge, normal, openpose. Это критично для дизайнерских сценариев — например, можно зафиксировать pose персонажа через openpose или геометрию помещения через depth, а варьировать стиль и текст. Не все ComfyUI/diffusers стеки поддерживают ControlNet для Qwen Image из коробки — проверь документацию.",
      },
      {
        q: "Какая лицензия у Qwen Image?",
        a: "Apache 2.0 на обе версии (V1 и V2.0). Это означает полные коммерческие права на использование модели и output: можно встраивать в продукты, продавать сгенерированный контент, использовать в платных сервисах. Это редкость для топовых image-моделей — большинство либо проприетарные, либо с ограничениями на коммерческое использование.",
      },
      {
        q: "Где запускать Qwen Image?",
        a: "Официально — Alibaba Cloud (DashScope API) и HuggingFace (веса доступны). На HuggingFace ищи репозитории Qwen team — Qwen-Image и Qwen-Image-2.0. Локально V2.0 запускается на потребительских GPU 16–24GB, V1 требует 40–58GB. Для облачного inference есть Replicate, fal.ai и собственный API Alibaba.",
      },
      {
        q: "Поддерживается ли Opten для Qwen Image?",
        a: "Да, расширение Opten распознаёт Qwen Image и оценивает промпты по структуре, специфичной для модели: проверяет наличие явного текста в кавычках для документов, корректное указание билингвальных блоков, отсутствие путаницы с Qwen2.5-VL, использование длины промпта для сложных композиций. Одним кликом можно получить rewrite с правильной структурой.",
      },
    ],
  },
  en: {
    title: "Qwen Image Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Alibaba's Qwen Image V1/V2.0: commercial-grade text rendering, bilingual EN+CN, infographics, posters, common mistakes and examples.",
    h1: "Qwen Image: how to write prompts the model actually understands",
    intro:
      "Qwen Image is the Alibaba Qwen team's image model with leading text rendering: commercial-grade English and Chinese, multi-line layouts, paragraphs. V2.0 is 7B parameters, native 2048×2048, prompt budget up to 1,000 tokens, and direct generation of infographics, PPT slides, posters, and comics with speech bubbles.",
    sections: [
      {
        heading: "What Qwen Image does well",
        body:
          "The headline feature is commercial-grade text rendering in EN and CN: multi-line, paragraphs, headlines, fine captions. On AI Arena, Qwen Image holds #1 in both T2I and image editing (V2.0). It also leads 9 public benchmarks (GenEval, DPG, OneIG-Bench, GEdit, and more).\n\nV2.0 is the workhorse: 7B parameters (lighter than V1's 20B), much lower VRAM, native 2048×2048 without upscaling, and unified generation + editing in one model. V1 remains for heavy production pipelines with 40–58GB VRAM. Apache 2.0 license — full commercial rights.",
        bullets: [
          "Commercial-grade text rendering (EN + CN)",
          "V2.0: native 2048×2048, up to 1,000 tokens, 7B parameters",
          "Direct generation of infographics, PPT, posters, comics",
          "ControlNet (canny, depth, pose, lineart, softedge, normal, openpose)",
          "Unified generation + editing in one model",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Detailed descriptive prompts with scene composition work best. Base formula: [Main subject] + [Scene composition] + [Style] + [Text content to render] + [Layout details].\n\nFor documents with text, ALWAYS specify the exact text in the prompt — the model won't «guess» what should be in a slide headline. For V2.0 you can use up to 1,000 tokens, and for infographics or comics that's not «too much» — it's optimal: the model handles dense composition well.\n\nFor editing the prompt is an instruction, not a full description. «Change the text to \"Q4 2026\"» works; «A poster with text saying...» in edit mode does not.",
      },
      {
        heading: "Rendering text in the image",
        body:
          "Qwen Image leads the market on text accuracy, alongside GPT Image 2. Multi-line layouts, paragraph-level text, infographics with charts and text blocks, PPT slides, comics with speech bubbles, posters with headlines — V2.0 generates all of this directly, without a separate typography engine.\n\nRules: write exact text in quotes, specify font and size («bold serif headline», «small sans-serif caption»), set layout («centered», «left-aligned», «two-column grid»). For bilingual layouts (EN + CN in the same image) declare both languages as separate blocks — this is a Qwen Image strength.",
      },
      {
        heading: "Bilingual EN + CN workflow",
        body:
          "Qwen Image is the only top model where Chinese is a native language (Alibaba team). You can write the prompt in Chinese, in English, or mix them. The in-image text can be in either language or bilingual.\n\nConcrete scenarios: marketing materials for the Chinese market with Chinese headlines and English brand names, bilingual infographics for international teams, comics with CJK speech bubbles, product packaging for Chinese e-commerce. This is an area where Qwen Image is objectively stronger than any Western model.",
      },
      {
        heading: "Don't confuse with other Qwen models",
        body:
          "Common mistake: Qwen Image ≠ Qwen2.5-VL ≠ Z-Image. Qwen Image (this model) is the image generator from the Qwen team. Qwen2.5-VL is a vision model — it analyzes images, doesn't generate them (different team, different task). Z-Image is a separate model from a different Alibaba team, not part of the Qwen line.\n\nIf an API tutorial mentions «Qwen2.5-VL», that's about vision, not generation. For generation you specifically need Qwen Image V1 or V2.0. On HuggingFace they live in different repos — don't mix them up.",
      },
    ],
    examples: [
      {
        before: "a beautiful poster with sale text",
        after:
          "A retail sale poster, photorealistic background with shopping bags and gift boxes. Bold serif headline (EXACT): \"BLACK FRIDAY\" in red, centered top. Subheadline below in white sans-serif: \"Up to 70% off — November 28–30\". Bottom-right corner: small caption \"Free shipping over $50\". Two-column grid layout, vertical orientation. Commercial-grade typography.",
        note: "Exact text in quotes with EXACT marker, explicit fonts (serif headline + sans-serif sub), colors and layout. Without these the model invents text and placement — usually not what you want.",
      },
      {
        before: "infographic about company sales",
        after:
          "Corporate infographic, white background, clean grid layout. Title (EXACT, centered top, bold sans-serif): \"Q4 Revenue Breakdown\". Four metric cards in a 2×2 grid, each with a number and label: \"$2.4M Total\", \"+18% YoY\", \"3 New Markets\", \"86% Retention\". Use Inter sans-serif for all numbers, brand color #1E40AF for highlights, light grey rules between cards. Print-ready commercial typography.",
        note: "Complex composition (2×2 grid) with concrete numbers and labels in quotes. Font (Inter), color (#1E40AF), and print-ready marker specified. V2.0's 1,000-token budget handles this density.",
      },
      {
        before: "comic with dialogue between two characters in Chinese and English",
        after:
          "Two-panel manga-style comic. Panel 1: A young woman in business attire holds a coffee cup, looking out a window. Speech bubble (Chinese): \"明天的会议准备好了吗？\". Panel 2: Close-up of her phone screen showing a message in English: \"Meeting moved to Friday\". Clean line art, black ink with light grey shading, white background. Comic-style typography, speech bubbles with thin black borders.",
        note: "Bilingual text (CN in panel 1, EN in panel 2), both explicitly in quotes. Style (manga, line art, ink) and typography (comic-style) specified. This is a scenario where Qwen Image beats most Western models.",
      },
    ],
    mistakes: [
      {
        title: "No explicit text for document prompts",
        explain:
          "If you're generating an infographic, poster, or PPT slide and don't specify exact text in quotes, the model will invent the headline and captions — usually not what you want. Every text field should be in quotes with an EXACT marker. For bilingual layouts, declare both languages as separate blocks.",
      },
      {
        title: "Confusing Qwen Image with Qwen2.5-VL",
        explain:
          "Qwen Image is an image generator. Qwen2.5-VL is a vision model for image analysis. These are two different models from different Alibaba teams. If a tutorial or API mentions «Qwen2.5-VL», it's NOT about generation. For generation you need Qwen Image V1 or V2.0 specifically — check the repo name before launching.",
      },
      {
        title: "V1 on a weak GPU",
        explain:
          "Qwen Image V1 requires 40–58GB VRAM — A100/H100 territory. On consumer GPUs (24GB and below) V1 won't run, or will work with severe offloading and low speed. For local execution and most cloud pipelines, use V2.0 — 7B parameters, much lower VRAM.",
      },
      {
        title: "Prompt too short for complex composition",
        explain:
          "V2.0 supports up to 1,000 tokens specifically for complex compositions — infographics, PPT, comics. If you ask for a 4-panel comic in one sentence, the model invents the contents at random. Use the full prompt budget to enumerate panels, exact text, layout, fonts, and colors.",
      },
      {
        title: "Full scene description in edit mode",
        explain:
          "In V2.0 unified generation+editing, edit-mode prompts should be instructions, not full descriptions. «Change the title text to \"Q4 2026\"» works; «A poster with a Q4 2026 title and modern design» in edit mode pushes the model to redraw everything. If you want a new poster, switch to T2I mode.",
      },
    ],
    faq: [
      {
        q: "How does Qwen Image V2.0 differ from V1?",
        a: "V2.0 is 7B parameters versus V1's 20B, native 2048×2048 without upscale, much lower VRAM, support for prompts up to 1,000 tokens, and unified generation+editing in a single model. V1 stays relevant for heavy production pipelines with top-tier GPUs, but for most tasks V2.0 is the clear pick: faster, cheaper, and still #1 on AI Arena.",
      },
      {
        q: "Can I write the prompt in Chinese?",
        a: "Yes, Chinese is a native language for Qwen Image. You can write the prompt entirely in CN, entirely in EN, or mix them. In-image text can also be in either language or bilingual. For Chinese-market marketing materials this is a strong advantage over Western models, where CN rendering is usually weaker.",
      },
      {
        q: "What resolution is supported?",
        a: "V2.0 — native 2048×2048 (2K) without upscaling, which matters for print materials and infographics. V1 — standard resolutions like 1024×1024 plus upscalers. Aspect ratios are flexible; for documents prefer standard formats (A4 portrait, US Letter, 16:9 for PPT slides).",
      },
      {
        q: "Does ControlNet work?",
        a: "Yes, 7 types of structural control are supported: canny (edges), depth, pose, lineart, softedge, normal, openpose. This matters for design scenarios — for example, you can lock a character's pose via openpose or a room's geometry via depth, while varying style and text. Not every ComfyUI/diffusers stack supports ControlNet for Qwen Image out of the box — check the docs.",
      },
      {
        q: "What's the license?",
        a: "Apache 2.0 for both versions (V1 and V2.0). That means full commercial rights to the model and its output: embed in products, sell generated content, use in paid services. This is rare for top-tier image models — most are either proprietary or restrict commercial use.",
      },
      {
        q: "Where can I run Qwen Image?",
        a: "Officially — Alibaba Cloud (DashScope API) and HuggingFace (weights available). On HuggingFace look for Qwen team repos — Qwen-Image and Qwen-Image-2.0. Locally V2.0 runs on consumer GPUs in the 16–24GB range; V1 needs 40–58GB. For cloud inference there's Replicate, fal.ai, and Alibaba's own API.",
      },
      {
        q: "Does Opten support Qwen Image?",
        a: "Yes, the Opten extension recognizes Qwen Image and scores prompts against the model-specific structure: it checks for explicit quoted text in document prompts, correct bilingual block markup, absence of confusion with Qwen2.5-VL, and effective use of the prompt budget for complex compositions. One click yields a rewrite in the proper structure.",
      },
    ],
  },
};
