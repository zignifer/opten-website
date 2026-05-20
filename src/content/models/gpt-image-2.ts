// Phase v2.0 MODELS-A-12: reference content for GPT Image 2.
// MANUALLY WRITTEN — this file is the gold-standard template that Phase 2
// agents (general-purpose subagents) use as a pattern when generating the
// remaining 61 model content files. Keep it high-quality. Source skill:
// src/content/models/_skills/gpt-image-2.md.

import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для GPT Image 2: структура, ошибки, примеры",
    description:
      "Как писать промпты для GPT Image 2 от OpenAI: структура брифа, точный текст в кавычках, edit-шаблон, работа с референсами, типичные ошибки и примеры до/после.",
    h1: "GPT Image 2: как писать промпты, которые модель понимает",
    intro:
      "GPT Image 2 — image-модель от OpenAI с SOTA-рендерингом текста и thinking mode. Понимает промпт как бриф для дизайнера, обрабатывает слова последовательно (первые слова весят больше) и поддерживает до 16 референсов и 8 связанных изображений за один запрос. Лучше всего работает с английским, но многоязычная поддержка стабильная.",
    sections: [
      {
        heading: "Что умеет GPT Image 2",
        body:
          "Главный прорыв модели — точный, читаемый текст внутри изображения: рекламные слоганы, инфографика, UI-мокапы, QR-коды, многоязычная типографика (кириллица, CJK, арабский). Photorealism у GPT Image 2 «нейтральный» — без характерного AI-глянца, что даёт преимущество в moody, overcast и desaturated жанрах.\n\nМодель работает как «думающая»: на сложных промптах она автоматически переключается в thinking mode, может рассуждать, использовать web search и проверять собственный результат. Для простых задач включается Instant mode — быстрая генерация без рассуждений.",
        bullets: [
          "Точный текст в кавычках, многоязычная типографика",
          "Photorealism без AI-глянца (нейтральная экспозиция)",
          "До 16 референсных изображений + до 8 связанных кадров за запрос",
          "Surgical edits через Change / Preserve / Constraints",
          "Knowledge cutoff декабрь 2025 + web search в thinking mode",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Фон/Сцена] + [Субъект] + [Ключевые детали] + [Стиль/Медиум] + [Освещение/Композиция] + [Текст в кавычках] + [Constraints].\n\nГлавное правило — главный субъект всегда в начале. Модель обрабатывает токены последовательно, и слова в первых строках получают максимальный визуальный вес. Если зарыть тему в конец абзаца, она потеряет приоритет.\n\nПромпт лучше писать как бриф для дизайнера, а не как набор тегов. Указывай назначение (ad, UI-мокап, инфографика, product shot) — это активирует у модели нужный режим. Формат может быть любым: естественный язык, JSON-структура, инструкция в стиле «делай так».",
      },
      {
        heading: "Edit-шаблон: Change / Preserve / Constraints",
        body:
          "Для точечных правок GPT Image 2 даёт surgical editing — когда нужно поменять одно, сохранив всё остальное. Используй фиксированный шаблон:\n\nChange: [что именно меняется]\nPreserve: [face, identity, pose, lighting, framing, background, geometry, text, layout]\nConstraints: [no extra objects, no redesign, no logo drift, no watermark]\n\nДля итеративного редактирования повторяй preserve-список на каждой итерации — иначе модель «дрейфует» и начинает менять то, что не просили. Это особенно критично для virtual try-on, замены интерьерных объектов и компоновки из нескольких референсов.",
      },
      {
        heading: "Текст в изображении",
        body:
          "GPT Image 2 — лучшая на рынке модель для рендеринга текста в кадре. Правила:\n\nТочный текст всегда в кавычках или ALL CAPS — «Billboard text (EXACT, verbatim): \"Fresh and clean\"». Для сложных слов (бренды, редкие написания) прописывай по буквам. Указывай шрифт, кегль, цвет, расположение.\n\nДля плотного текста, инфографики и мелкого кегля ставь `quality=\"high\"` — на `medium`/`low` микрошрифт ломается. Работает с латиницей, кириллицей, CJK, хинди, бенгали, арабским. Длинный текст без кавычек модель может исказить или добавить лишние буквы — это известная слабость.",
      },
      {
        heading: "Quality, разрешения, форматы",
        body:
          "Три уровня качества — `low` для превью и A/B-тестов, `medium` дефолт для большинства задач, `high` для плотного текста, портретов крупным планом и identity-sensitive редактирования.\n\nПопулярные разрешения: 1024×1024 (universal), 1024×1536 (portrait), 1536×1024 (landscape), 2560×1440 (2K, стабильный максимум), 3840×2160 (4K, экспериментально). Стороны должны быть кратны 16, соотношение длинной к короткой — не более 3:1.\n\nПараметр `input_fidelity` для gpt-image-2 не используется — модель по умолчанию high fidelity.",
      },
    ],
    examples: [
      {
        before:
          "красивый рекламный баннер бренда одежды с молодыми людьми",
        after:
          "Premium campaign image for youth streetwear brand Thread. Group of friends hanging out on a Brooklyn rooftop at golden hour, street fashion photography cues, clean composition, strong color direction, natural poses. Tagline (exact, in white sans-serif at bottom center): \"Yours to Create\". photorealistic, 35mm film, shallow DOF, natural color balance. quality=\"high\".",
        note:
          "Главное отличие: «бриф для дизайнера» вместо описания. Назначение, конкретные детали сцены, точный текст в кавычках, фотографическая лексика, параметр качества.",
      },
      {
        before:
          "замени стулья на деревянные",
        after:
          "In this room photo, Change: replace ONLY the white chairs with chairs made of natural oak wood with visible grain. Preserve: camera angle, room lighting, floor shadows, table position, wall colors, and all surrounding objects. Constraints: no extra furniture, no redesign of the room, no watermark.",
        note:
          "Edit-промпт без preserve-блока модель почти всегда трактует как redesign — меняет не только стулья, но и освещение, угол съёмки, окружающие объекты. Явный preserve-список фиксирует контракт.",
      },
      {
        before:
          "инфографика про воронку продаж",
        after:
          "Pitch-deck slide titled \"Sales Funnel Q4 2026\". Show a 5-stage funnel: \"Leads (12,400)\", \"Qualified (3,200)\", \"Demo (980)\", \"Proposal (310)\", \"Closed Won (87)\". Use Inter bold sans-serif for stage labels, brand color #9CFB51 for highlights on Closed Won, white background, clean grid alignment. Bottom-right corner: brand logo placeholder labeled \"OPTEN\". quality=\"high\".",
        note:
          "Цифры прямо в промпте + явный шрифт + цветовая палитра + макет = модель собирает почти production-ready слайд. Без указания шрифта и `quality=\"high\"` мелкие лейблы расплываются.",
      },
    ],
    mistakes: [
      {
        title: "Главный субъект зарыт в конце промпта",
        explain:
          "Модель обрабатывает токены последовательно — первые слова весят максимум, последние почти не влияют на композицию. Если тема статьи в третьем предложении, ракурс и сцена возьмут на себя приоритет. Выноси главный субъект в первое предложение.",
      },
      {
        title: "Длинный текст без кавычек",
        explain:
          "Если попросить «надпись Fresh and clean на этикетке», модель часто исказит буквы или добавит лишние символы. Точный текст всегда в кавычках или ALL CAPS, с пометкой «EXACT» или «verbatim»: «label text (EXACT): \"Fresh and clean\"». Это критично для брендинга.",
      },
      {
        title: "Edit-промпт без preserve-блока",
        explain:
          "«Поменяй фон» без явного «preserve: face, identity, pose» в 7 из 10 случаев меняет ещё и черты лица, позу или освещение. Каждый edit-промпт должен заканчиваться структурированным preserve-списком. Для итеративного редактирования повторяй его на каждой итерации.",
      },
      {
        title: "Студийно-глянцевая лексика для фотореализма",
        explain:
          "Слова «polished», «staged», «beautiful lighting», «professional shoot» включают характерный AI-глянец. Для candid-фотореализма нужна противоположная лексика: «35mm film», «natural light», «visible pores», «weathered texture», «subtle film grain». GPT Image 2 особенно силён в moody жанрах — не глуши это студийной лексикой.",
      },
      {
        title: "Копирование синтаксиса Midjourney или Stable Diffusion",
        explain:
          "Параметры вида `--ar 16:9`, `::weight`, `(keyword:1.2)` не работают в GPT Image 2 и попадают в текст промпта как мусор. Размеры задавай явно («1024×1536», «portrait»), вес слов регулируй порядком (важное — в начало), стили — нормальными прилагательными.",
      },
    ],
    faq: [
      {
        q: "Чем GPT Image 2 отличается от GPT Image 1?",
        a: "GPT Image 2 принёс четыре главных апгрейда: SOTA-рендеринг текста (включая CJK, кириллицу, арабский), thinking mode с web search и self-checking, фотореализм без AI-глянца с нейтральной экспозицией, и поддержку до 16 референсов с консистентностью персонажей. Для большинства задач — это однозначный апгрейд, кроме случаев когда нужна максимальная скорость на простых промптах.",
      },
      {
        q: "Когда использовать quality=\"high\", а когда \"medium\"?",
        a: "`high` нужен для плотного текста, мелких надписей в инфографике, портретов крупным планом, identity-sensitive редактирования и любых сцен где важна тонкая деталь (текстура кожи, шрифт, мелкий узор). `medium` — дефолт для большинства задач, разница в скорости заметна. `low` — для превью, mass generation и A/B-тестов.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Да, GPT Image 2 многоязычная — промпт можно писать на русском, китайском, корейском и других языках. Но английский даёт чуть более стабильные результаты в сложных сценах. Для production-промптов рекомендуется английский, для экспериментов и личных задач — русский ок. Текст в самом изображении можно просить на любом языке.",
      },
      {
        q: "Как добиться photorealism без AI-look?",
        a: "Используй фотографическую лексику: «35mm film», «50mm lens», «shallow DOF», «natural color balance», «subtle film grain». Описывай реальные текстуры — «visible pores», «weathered skin», «fabric wear». Избегай слов «polished», «staged», «beautiful lighting» — они активируют студийный глянец. Эксплицитное «photorealistic» в начале промпта помогает.",
      },
      {
        q: "Что такое thinking mode и нужно ли его включать вручную?",
        a: "Thinking mode — режим, в котором модель «думает» перед генерацией: разбирает промпт, может использовать web search, проверяет свои варианты. Активируется автоматически на сложных промптах — вручную включать не надо. На простых задачах включится Instant mode (быстрый, без рассуждений). Время генерации в thinking mode дольше, но качество первого прохода выше.",
      },
      {
        q: "Почему GPT Image 2 отказывается генерировать?",
        a: "У модели один из самых строгих модераторов. Триггерится не только на явный NSFW, но и на комбинации невинных слов: «real person + young + bathroom + suggestive» почти гарантированно даст refusal. Реальные celebrities и узнаваемые IP-лица заблокированы политикой OpenAI. Если получаешь отказ — переформулируй: убери triggering combo, замени контекст на editorial/fashion, не пытайся обмануть фильтр эвфемизмами (он семантический, а не keyword-based).",
      },
      {
        q: "Поддерживается ли Opten для GPT Image 2?",
        a: "Да, расширение Opten автоматически распознаёт GPT Image 2 внутри ChatGPT и оценивает промпты по структуре, описанной выше: проверяет наличие главного субъекта в начале, точного текста в кавычках, edit-шаблона при редактировании, фотографической лексики для photorealism. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "GPT Image 2 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for OpenAI's GPT Image 2: brief structure, exact text in quotes, edit template, common mistakes, and before/after examples.",
    h1: "GPT Image 2: how to write prompts the model actually understands",
    intro:
      "GPT Image 2 is OpenAI's image model with SOTA in-image text rendering and a thinking mode. It treats prompts as design briefs, processes tokens sequentially (first words carry the most weight), and supports up to 16 reference images plus 8 linked outputs per request. English works best, but multilingual support is solid.",
    sections: [
      {
        heading: "What GPT Image 2 does well",
        body:
          "The breakthrough feature is accurate, readable in-image text: ad taglines, infographics, UI mockups, QR codes, multilingual typography (Cyrillic, CJK, Arabic). The photorealism in GPT Image 2 has a neutral exposure — no characteristic AI gloss — which gives it an edge in moody, overcast, and desaturated genres.\n\nThe model behaves like a thinking system: on complex prompts it automatically switches to thinking mode, can reason, use web search, and self-check its output. For simple tasks, Instant mode kicks in — fast generation without deliberation.",
        bullets: [
          "Exact text in quotes, multilingual typography",
          "Photorealism without AI gloss (neutral exposure)",
          "Up to 16 reference images + up to 8 linked frames per request",
          "Surgical edits via Change / Preserve / Constraints",
          "Knowledge cutoff December 2025 + web search in thinking mode",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Background/Scene] + [Subject] + [Key details] + [Style/Medium] + [Lighting/Composition] + [Text in quotes] + [Constraints].\n\nThe main rule — the primary subject always goes first. The model processes tokens sequentially, and words in the opening lines get maximum visual weight. Bury the topic at the end of a paragraph and it loses priority.\n\nWrite the prompt as a designer brief, not as a tag list. State the purpose (ad, UI mockup, infographic, product shot) — this activates the right model mode. Format is flexible: natural language, JSON-like structure, instruction-style directives all work.",
      },
      {
        heading: "Edit template: Change / Preserve / Constraints",
        body:
          "For surgical edits, GPT Image 2 supports a fixed three-part template — change one thing while keeping everything else intact:\n\nChange: [exactly what changes]\nPreserve: [face, identity, pose, lighting, framing, background, geometry, text, layout]\nConstraints: [no extra objects, no redesign, no logo drift, no watermark]\n\nFor iterative editing, repeat the preserve list on every turn — otherwise the model drifts and starts changing things you didn't ask for. This is especially critical for virtual try-on, interior object swaps, and multi-reference composites.",
      },
      {
        heading: "In-image text",
        body:
          "GPT Image 2 is the best-in-class model for rendering text inside frames. Rules:\n\nExact text always in quotes or ALL CAPS — \"Billboard text (EXACT, verbatim): 'Fresh and clean'\". For tricky words (brands, rare spellings) spell them out letter by letter. Specify font, size, color, placement.\n\nFor dense text, infographics, and small type, set `quality=\"high\"` — `medium`/`low` will break micro-text. Works with Latin, Cyrillic, CJK, Hindi, Bengali, Arabic. Long text without quotes can be mangled or padded with stray characters — a known weakness.",
      },
      {
        heading: "Quality, resolutions, formats",
        body:
          "Three quality tiers — `low` for previews and A/B tests, `medium` default for most tasks, `high` for dense text, close-up portraits, and identity-sensitive editing.\n\nPopular resolutions: 1024×1024 (universal), 1024×1536 (portrait), 1536×1024 (landscape), 2560×1440 (2K, stable ceiling), 3840×2160 (4K, experimental). Both sides must be multiples of 16, aspect ratio long-to-short no more than 3:1.\n\nThe `input_fidelity` parameter is not used for gpt-image-2 — the model is high-fidelity by default.",
      },
    ],
    examples: [
      {
        before: "beautiful clothing brand ad banner with young people",
        after:
          "Premium campaign image for youth streetwear brand Thread. Group of friends hanging out on a Brooklyn rooftop at golden hour, street fashion photography cues, clean composition, strong color direction, natural poses. Tagline (exact, in white sans-serif at bottom center): \"Yours to Create\". photorealistic, 35mm film, shallow DOF, natural color balance. quality=\"high\".",
        note:
          "Key change: a designer brief instead of a description. Purpose, concrete scene details, exact text in quotes, photography vocabulary, quality parameter.",
      },
      {
        before: "replace the chairs with wooden ones",
        after:
          "In this room photo, Change: replace ONLY the white chairs with chairs made of natural oak wood with visible grain. Preserve: camera angle, room lighting, floor shadows, table position, wall colors, and all surrounding objects. Constraints: no extra furniture, no redesign of the room, no watermark.",
        note:
          "An edit prompt without a preserve block is almost always interpreted as a redesign — the model changes chairs plus lighting, angle, and surrounding objects. An explicit preserve list locks the contract.",
      },
      {
        before: "infographic about a sales funnel",
        after:
          "Pitch-deck slide titled \"Sales Funnel Q4 2026\". Show a 5-stage funnel: \"Leads (12,400)\", \"Qualified (3,200)\", \"Demo (980)\", \"Proposal (310)\", \"Closed Won (87)\". Use Inter bold sans-serif for stage labels, brand color #9CFB51 for highlights on Closed Won, white background, clean grid alignment. Bottom-right corner: brand logo placeholder labeled \"OPTEN\". quality=\"high\".",
        note:
          "Numbers in the prompt + explicit font + color palette + layout = the model assembles a nearly production-ready slide. Without font and `quality=\"high\"`, small labels blur.",
      },
    ],
    mistakes: [
      {
        title: "Primary subject buried at the end of the prompt",
        explain:
          "The model processes tokens sequentially — first words carry maximum weight, last ones barely influence composition. If your topic is in the third sentence, the camera angle and scene will dominate. Move the main subject to the first sentence.",
      },
      {
        title: "Long text without quotes",
        explain:
          "Ask for «the words Fresh and clean on a label» and the model will often mangle the letters or add extras. Exact text always in quotes or ALL CAPS, with «EXACT» or «verbatim»: «label text (EXACT): \"Fresh and clean\"». Critical for branding.",
      },
      {
        title: "Edit prompt without a preserve block",
        explain:
          "«Change the background» without an explicit «preserve: face, identity, pose» changes face features, pose, or lighting in 7 out of 10 cases. Every edit prompt should end with a structured preserve list. For iterative editing, repeat it on every turn.",
      },
      {
        title: "Studio-gloss vocabulary for photorealism",
        explain:
          "Words like «polished», «staged», «beautiful lighting», «professional shoot» trigger the characteristic AI gloss. For candid photorealism you need the opposite: «35mm film», «natural light», «visible pores», «weathered texture», «subtle film grain». GPT Image 2 is especially strong at moody genres — don't kill that with studio language.",
      },
      {
        title: "Copying Midjourney or Stable Diffusion syntax",
        explain:
          "Parameters like `--ar 16:9`, `::weight`, `(keyword:1.2)` don't work in GPT Image 2 and end up as literal noise in the prompt. Set dimensions explicitly (\"1024×1536\", \"portrait\"), weight words by order (important first), styles via normal adjectives.",
      },
    ],
    faq: [
      {
        q: "How is GPT Image 2 different from GPT Image 1?",
        a: "GPT Image 2 brings four major upgrades: SOTA in-image text rendering (including CJK, Cyrillic, Arabic), thinking mode with web search and self-checking, photorealism without AI gloss and with neutral exposure, and support for up to 16 references with character consistency. For most tasks this is a straight upgrade, except when you need maximum speed on simple prompts.",
      },
      {
        q: "When should I use quality=\"high\" vs \"medium\"?",
        a: "Use `high` for dense text, small infographic labels, close-up portraits, identity-sensitive editing, and any scene where fine detail matters (skin texture, font, fine pattern). `medium` is the default for most tasks — the speed difference is noticeable. `low` is for previews, mass generation, and A/B tests.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "Yes, GPT Image 2 is multilingual — you can write prompts in Russian, Chinese, Korean, and other languages. But English yields slightly more stable results in complex scenes. For production prompts we recommend English; for experiments and personal tasks Russian works fine. In-image text can be requested in any language.",
      },
      {
        q: "How do I get photorealism without the AI look?",
        a: "Use photography vocabulary: «35mm film», «50mm lens», «shallow DOF», «natural color balance», «subtle film grain». Describe real textures — «visible pores», «weathered skin», «fabric wear». Avoid words like «polished», «staged», «beautiful lighting» — they activate studio gloss. An explicit «photorealistic» at the start helps.",
      },
      {
        q: "What is thinking mode and do I need to turn it on manually?",
        a: "Thinking mode is the regime where the model «thinks» before generating: parses the prompt, can use web search, checks its variants. It activates automatically on complex prompts — no manual switch needed. On simple tasks Instant mode kicks in (fast, no reasoning). Generation in thinking mode takes longer, but first-pass quality is higher.",
      },
      {
        q: "Why does GPT Image 2 refuse to generate?",
        a: "The model has one of the strictest moderators. It triggers not only on explicit NSFW, but on combinations of innocent words: «real person + young + bathroom + suggestive» almost guarantees a refusal. Real celebrities and recognizable IP faces are blocked by OpenAI policy. If you get refused — reformulate: drop the triggering combo, swap context to editorial/fashion, don't try to trick the filter with euphemisms (it's semantic, not keyword-based).",
      },
      {
        q: "Does Opten support GPT Image 2?",
        a: "Yes, the Opten extension auto-detects GPT Image 2 inside ChatGPT and scores prompts against the structure outlined above: it checks for the main subject up front, exact text in quotes, an edit template when editing, photography vocabulary for photorealism. One click gives you a rewrite in the correct structure.",
      },
    ],
  },
};
