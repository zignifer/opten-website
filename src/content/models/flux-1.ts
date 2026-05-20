// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for flux-1.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для FLUX.1: структура, ошибки, примеры",
    description:
      "Как писать промпты для FLUX.1 Pro и 1.1 Pro Ultra: связные описания, фото-терминология, многослойные сцены, типичные ошибки и примеры до/после.",
    h1: "FLUX.1: как писать промпты, которые модель понимает",
    intro:
      "FLUX.1 — флагманская image-модель от Black Forest Labs (schnell, dev, pro, 1.1 pro Ultra). Двойной энкодер CLIP + T5-XXL интерпретирует длинные связные описания значительно точнее моделей на одном CLIP, рендерит текст в кадре на уровне лидеров рынка, поддерживает разрешения до 2752×2752 в Ultra-варианте.",
    sections: [
      {
        heading: "Что умеет FLUX.1",
        body:
          "FLUX.1 — одна из сильнейших моделей в нише photorealism, портретов и пейзажей. Двойной энкодер позволяет модели понимать связные подписи в стиле кинематографических брифов: длинные предложения с многослойной композицией обрабатываются лучше, чем у моделей на одном CLIP.\n\nРендеринг текста в изображениях — топ в классе, особенно у [pro] и [max]. Поддерживается вся фото-терминология (объективы 35/50/85mm, диафрагма, глубина резкости), широкий стилевой диапазон от documentary до oil painting, и разрешения до 2752×2752 в 1.1 pro Ultra с режимом Raw.",
        bullets: [
          "Двойной энкодер CLIP + T5-XXL — лучшая интерпретация длинных описаний",
          "Разрешение до 2752×2752 в 1.1 pro Ultra, до 1440×1440 в pro",
          "Топ-класс по рендерингу текста в кадре",
          "Несколько вариантов: schnell, dev, pro, 1.1 pro Ultra",
          "Промпт ~2000 токенов, оптимально 50–200 слов",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Субъект] + [Детали внешности] + [Сцена/Окружение] + [Освещение] + [Стиль/Арт-направление] + [Камера/Техника] + [Настроение/Цвет].\n\nПример: «A wide-angle view of a snow-capped mountain range at dawn, mist swirling over the icy peaks, with a vibrant orange-pink sky in the background and a lone wolf in the foreground looking into the horizon, cinematic photography, shot on RED camera, dramatic warm light».\n\nГлавный принцип — связное описательное предложение, а не теги. T5-XXL обучен на длинных подписях и читает контекст лучше при полноценных конструкциях.",
      },
      {
        heading: "Многослойное описание и камера",
        body:
          "Описывай сцену от переднего плана к заднему: «In the foreground, a large oak tree with golden autumn leaves. Behind it, a flowing river, and in the background, a mist-covered mountain range». Такая структура даёт модели чёткую пространственную глубину.\n\nДля фотореализма используй фото-терминологию: «Shot with a 50mm lens at f/2.8, shallow depth of field, blurred background», «Wide-angle 24mm lens, deep focus, everything sharp», «Macro photography, extreme close-up, water droplets on a leaf». Параметры камеры работают значительно надёжнее, чем общие quality-фразы.",
      },
      {
        heading: "Текст в изображении и арт-стили",
        body:
          "FLUX.1 — одна из лучших моделей для текста. Используй кавычки: «A neon sign reading \"OPEN 24/7\" on a dark brick wall», «A handwritten note saying \"I love you\" on vintage paper». Указывай шрифт, размер, цвет и расположение для контроля.\n\nКонкретные арт-стили работают лучше абстрактных: «Impressionist painting with visible brushstrokes», «Art Nouveau poster style», «1980s cyberpunk neon aesthetic», «Bauhaus minimalism». Не смешивай конфликтующие стили в одном промпте — это даёт непредсказуемый результат.",
      },
      {
        heading: "Различия между вариантами",
        body:
          "[schnell] — 4 шага, быстро, Apache 2.0. Прототипирование, быстрые итерации, тесты композиции.\n\n[dev] — 20+ шагов, опенсорс. Хорошее качество для разработки и некоммерческих проектов. Внимание: фраза «white background» в [dev] вызывает размытые изображения — описывай фон конкретнее.\n\n[pro] — лучшее качество через API, коммерческая лицензия. Финальная продукция, реклама, продуктовая съёмка.\n\n[1.1 pro] Ultra — до 2752×2752, Raw mode без характерного AI-look. Используй для крупной печати, билбордов, детализированных композиций где важна каждая текстура.",
      },
    ],
    examples: [
      {
        before: "горный пейзаж на рассвете",
        after:
          "A wide-angle view of jagged snow-capped peaks at dawn, mist swirling over the icy ridges. In the foreground, dark pine silhouettes; in the midground, a frozen lake reflecting the sky; in the background, vibrant orange-pink clouds illuminated by first light. Cinematic landscape photography, shot on 24mm lens, deep focus, dramatic warm rim light, restrained cool palette.",
        note:
          "Многослойная композиция (foreground/midground/background) даёт модели полную пространственную структуру. Конкретный объектив и освещение заменяют расплывчатое «epic».",
      },
      {
        before: "vintage bookstore sign with old typography",
        after:
          "A weathered wooden shop sign hanging above a cobblestone street in 1920s Paris. The sign reads \"LIBRAIRIE ANCIENNE\" in elegant gold serif lettering with a curled border. Soft afternoon light catches the gilded letters. 35mm film photography, shallow depth of field, warm sepia palette, Atget-inspired documentary style.",
        note:
          "Кавычки фиксируют точный текст. Конкретная эпоха, шрифт, цвет и фото-стиль дают модели полный визуальный контекст вместо общих понятий «vintage».",
      },
      {
        before:
          "photorealistic masterpiece, best quality, 8K, ultra HD, hyperrealistic portrait, beautiful woman",
        after:
          "Editorial portrait of a woman in her thirties with freckles and short dark hair, wearing a cream-colored cashmere sweater. Soft natural light from a north-facing window, shallow depth of field, shot on 85mm lens at f/1.8. Calm contemplative expression, subtle film grain, muted warm palette, fashion editorial style.",
        note:
          "Quality-бустеры в FLUX почти не работают. Конкретные камерные термины, тип освещения и стилевая ссылка дают результат в разы лучше, чем стэк прилагательных.",
      },
    ],
    mistakes: [
      {
        title: "Список ключевых слов вместо связного описания",
        explain:
          "FLUX.1 обучена на длинных подписях. Связное предложение даёт значительно лучший результат, чем «mountain, snow, sky, blue, epic, detailed». T5-XXL читает контекст и связи между словами — это его главное преимущество.",
      },
      {
        title: "Prompt weights и SD-синтаксис",
        explain:
          "FLUX.1 НЕ поддерживает `(word:1.5)`, `word++`, embeddings или LoRA-ссылки — всё это попадает в промпт как литеральный мусор. Используй «with emphasis on» или «with a focus on» для усиления, и регулируй приоритет порядком слов.",
      },
      {
        title: "Quality-бустеры «masterpiece, best quality, 8K»",
        explain:
          "В отличие от Stable Diffusion, у FLUX.1 эти фразы почти не влияют на результат. Конкретные камерные термины («85mm at f/1.8», «shallow DOF», «golden hour») и стилевые ссылки («editorial fashion photography», «Frank Frazetta concept art») работают значительно лучше.",
      },
      {
        title: "«White background» в FLUX.1 [dev]",
        explain:
          "Известная проблема dev-варианта: фраза «white background» вызывает размытые/нечёткие изображения. Описывай фон конкретнее — «a soft grey studio backdrop», «seamless paper background with soft diffused light», «neutral cream-colored backdrop». В pro и schnell проблема не выражена.",
      },
      {
        title: "Конфликтующие стили в одном промпте",
        explain:
          "«cyberpunk and medieval», «photorealistic watercolor painting», «minimalist detailed» — взаимоисключающие указания сбивают модель. Если нужна стилистическая смесь, опиши её явно: «realistic photography with subtle painterly post-processing», а не как два равновесных стиля.",
      },
    ],
    faq: [
      {
        q: "В чём разница между schnell, dev, pro и 1.1 pro Ultra?",
        a: "[schnell] — 4-шаговая модель под Apache 2.0 для прототипирования и быстрых тестов. [dev] — опенсорс с 20+ шагами для разработки и некоммерческих задач. [pro] — лучшее качество через API с коммерческой лицензией. [1.1 pro] Ultra поддерживает разрешение до 2752×2752 и Raw mode — для крупной печати и максимально детализированных изображений.",
      },
      {
        q: "Какая оптимальная длина промпта?",
        a: "50–200 слов на английском — золотая середина. Короче 10 слов модель додумывает слишком много, длиннее 200 — теряет приоритеты и мелкие детали. Технический лимит T5-XXL около 2000 токенов, но качество начинает падать намного раньше. Плотное описание из 100 слов работает лучше, чем растянутое из 300.",
      },
      {
        q: "Как FLUX.1 рендерит текст?",
        a: "FLUX.1 — одна из лучших моделей по тексту в кадре, особенно [pro] и [max]. Используй кавычки для точного текста: «A neon sign reading \"OPEN 24/7\"». Указывай шрифт («elegant serif», «bold sans-serif»), размер, цвет и расположение. Для брендов и редких слов модель рендерит чище большинства конкурентов.",
      },
      {
        q: "На каком языке писать промпты?",
        a: "Только английский для production-задач. Двойной энкодер CLIP + T5-XXL обучен преимущественно на английских данных, и качество на других языках заметно падает — теряются стилевые ссылки, фото-терминология и тонкости композиции. Для экспериментов на русском результат будет рабочим, но менее точным.",
      },
      {
        q: "Когда использовать Raw mode в 1.1 pro Ultra?",
        a: "Raw mode даёт более «настоящий» photorealism без характерного AI-look — слегка десатурированную палитру, естественную экспозицию, видимые мелкие несовершенства. Используй для документальных портретов, candid-фотографии, journalistic стиля. Для рекламной и студийной съёмки стандартный режим даёт более «отполированный» результат.",
      },
      {
        q: "Поддерживает ли FLUX.1 негативные промпты?",
        a: "Частично. Можно добавить «no text, no watermarks, no blur» или «without people, no human figures» в конце промпта. Но негативные формулировки без позитивной альтернативы менее эффективны — «clean composition without distractions» работает лучше, чем «no clutter, no extra objects». Главное правило: описывай желаемое, а не нежелательное.",
      },
      {
        q: "Поддерживается ли Opten для FLUX.1?",
        a: "Да, расширение Opten автоматически распознаёт FLUX.1 в поддерживаемых платформах и оценивает промпты по структуре, описанной выше: проверяет связность описания, многослойность сцены, наличие камерных терминов, отсутствие SD-синтаксиса и quality-стэка. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "FLUX.1 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for FLUX.1 Pro and 1.1 Pro Ultra: coherent descriptions, photo vocabulary, layered scenes, common mistakes, and before/after examples.",
    h1: "FLUX.1: how to write prompts the model actually understands",
    intro:
      "FLUX.1 is Black Forest Labs' flagship image model (schnell, dev, pro, 1.1 pro Ultra). Its dual CLIP + T5-XXL encoder interprets long coherent descriptions significantly better than single-CLIP models, renders in-image text at top-tier level, and supports up to 2752×2752 in the Ultra variant.",
    sections: [
      {
        heading: "What FLUX.1 does well",
        body:
          "FLUX.1 is one of the strongest models for photorealism, portraits, and landscapes. The dual encoder lets the model parse coherent captions written like cinematographic briefs: long sentences with layered composition are handled much better than by single-CLIP models.\n\nIn-image text rendering is top in class, especially on [pro] and [max]. Full photo vocabulary is supported (35/50/85mm lenses, aperture, depth of field), a wide stylistic range from documentary to oil painting, and resolutions up to 2752×2752 in 1.1 pro Ultra with Raw mode.",
        bullets: [
          "Dual CLIP + T5-XXL encoder — best-in-class for long descriptions",
          "Up to 2752×2752 in 1.1 pro Ultra, up to 1440×1440 in pro",
          "Top-tier in-image text rendering",
          "Variants: schnell, dev, pro, 1.1 pro Ultra",
          "Prompt up to ~2000 tokens, optimal 50–200 words",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject] + [Appearance details] + [Scene/Environment] + [Lighting] + [Style/Art direction] + [Camera/Technique] + [Mood/Color].\n\nExample: «A wide-angle view of a snow-capped mountain range at dawn, mist swirling over the icy peaks, with a vibrant orange-pink sky in the background and a lone wolf in the foreground looking into the horizon, cinematic photography, shot on RED camera, dramatic warm light».\n\nThe core principle — coherent descriptive sentences, not tags. T5-XXL was trained on long captions and reads context better when given full prose constructions.",
      },
      {
        heading: "Layered description and camera",
        body:
          "Describe the scene from foreground to background: «In the foreground, a large oak tree with golden autumn leaves. Behind it, a flowing river, and in the background, a mist-covered mountain range». This structure gives the model clear spatial depth.\n\nFor photorealism use photo vocabulary: «Shot with a 50mm lens at f/2.8, shallow depth of field, blurred background», «Wide-angle 24mm lens, deep focus, everything sharp», «Macro photography, extreme close-up, water droplets on a leaf». Camera parameters work far more reliably than generic quality phrases.",
      },
      {
        heading: "In-image text and art styles",
        body:
          "FLUX.1 is one of the best models for text. Use quotes: «A neon sign reading \"OPEN 24/7\" on a dark brick wall», «A handwritten note saying \"I love you\" on vintage paper». Specify font, size, color, and placement for control.\n\nConcrete art styles outperform abstract ones: «Impressionist painting with visible brushstrokes», «Art Nouveau poster style», «1980s cyberpunk neon aesthetic», «Bauhaus minimalism». Don't mix conflicting styles in one prompt — it produces unpredictable output.",
      },
      {
        heading: "Variant differences",
        body:
          "[schnell] — 4 steps, fast, Apache 2.0. Prototyping, quick iterations, composition tests.\n\n[dev] — 20+ steps, open source. Good quality for development and non-commercial work. Note: the phrase «white background» in [dev] causes blurry images — describe backgrounds concretely.\n\n[pro] — best quality via API, commercial license. Final production, advertising, product photography.\n\n[1.1 pro] Ultra — up to 2752×2752, Raw mode without the characteristic AI look. Use for large prints, billboards, detailed compositions where every texture matters.",
      },
    ],
    examples: [
      {
        before: "mountain landscape at dawn",
        after:
          "A wide-angle view of jagged snow-capped peaks at dawn, mist swirling over the icy ridges. In the foreground, dark pine silhouettes; in the midground, a frozen lake reflecting the sky; in the background, vibrant orange-pink clouds illuminated by first light. Cinematic landscape photography, shot on 24mm lens, deep focus, dramatic warm rim light, restrained cool palette.",
        note:
          "A layered composition (foreground/midground/background) gives the model full spatial structure. Concrete lens and lighting replace the vague «epic».",
      },
      {
        before: "vintage bookstore sign with old typography",
        after:
          "A weathered wooden shop sign hanging above a cobblestone street in 1920s Paris. The sign reads \"LIBRAIRIE ANCIENNE\" in elegant gold serif lettering with a curled border. Soft afternoon light catches the gilded letters. 35mm film photography, shallow depth of field, warm sepia palette, Atget-inspired documentary style.",
        note:
          "Quotes lock the exact text. A concrete era, font, color, and photo style give the model full visual context instead of the generic «vintage».",
      },
      {
        before:
          "photorealistic masterpiece, best quality, 8K, ultra HD, hyperrealistic portrait, beautiful woman",
        after:
          "Editorial portrait of a woman in her thirties with freckles and short dark hair, wearing a cream-colored cashmere sweater. Soft natural light from a north-facing window, shallow depth of field, shot on 85mm lens at f/1.8. Calm contemplative expression, subtle film grain, muted warm palette, fashion editorial style.",
        note:
          "Quality boosters barely affect FLUX. Concrete camera terms, a specific lighting type, and a style reference yield far better results than an adjective stack.",
      },
    ],
    mistakes: [
      {
        title: "Keyword list instead of coherent description",
        explain:
          "FLUX.1 is trained on long captions. A coherent sentence yields significantly better results than «mountain, snow, sky, blue, epic, detailed». T5-XXL reads context and word relationships — that's its main advantage.",
      },
      {
        title: "Prompt weights and SD syntax",
        explain:
          "FLUX.1 does NOT support `(word:1.5)`, `word++`, embeddings, or LoRA references — all of it lands in the prompt as literal noise. Use «with emphasis on» or «with a focus on» for emphasis, and regulate priority via word order.",
      },
      {
        title: "Quality boosters «masterpiece, best quality, 8K»",
        explain:
          "Unlike Stable Diffusion, these phrases barely affect FLUX.1 output. Concrete camera terms («85mm at f/1.8», «shallow DOF», «golden hour») and style references («editorial fashion photography», «Frank Frazetta concept art») work significantly better.",
      },
      {
        title: "«White background» in FLUX.1 [dev]",
        explain:
          "A known dev-variant issue: the phrase «white background» produces blurry, unclear images. Describe backgrounds concretely — «a soft grey studio backdrop», «seamless paper background with soft diffused light», «neutral cream-colored backdrop». The issue is not pronounced in pro and schnell.",
      },
      {
        title: "Conflicting styles in one prompt",
        explain:
          "«cyberpunk and medieval», «photorealistic watercolor painting», «minimalist detailed» — mutually exclusive directions confuse the model. If a stylistic blend is needed, describe it explicitly: «realistic photography with subtle painterly post-processing», not as two equal-weight styles.",
      },
    ],
    faq: [
      {
        q: "What is the difference between schnell, dev, pro, and 1.1 pro Ultra?",
        a: "[schnell] is a 4-step model under Apache 2.0 for prototyping and quick tests. [dev] is open source with 20+ steps for development and non-commercial work. [pro] delivers best quality via API with a commercial license. [1.1 pro] Ultra supports up to 2752×2752 and Raw mode — for large print and maximally detailed images.",
      },
      {
        q: "What is the optimal prompt length?",
        a: "50–200 English words is the sweet spot. Under 10 words the model invents too much; over 200 words priorities are lost and small details suffer. The T5-XXL technical limit is roughly 2000 tokens, but quality drops well before that. A dense 100-word prompt outperforms a sprawling 300-word one.",
      },
      {
        q: "How does FLUX.1 render text?",
        a: "FLUX.1 is one of the best models for in-frame text, especially [pro] and [max]. Use quotes for exact text: «A neon sign reading \"OPEN 24/7\"». Specify font («elegant serif», «bold sans-serif»), size, color, and placement. For brands and rare words the model renders letters cleaner than most competitors.",
      },
      {
        q: "What language should prompts be written in?",
        a: "English only for production tasks. The dual CLIP + T5-XXL encoder was trained predominantly on English data, and quality on other languages drops noticeably — style references, photo terminology, and compositional nuance all degrade. For experiments in other languages output works but is less precise.",
      },
      {
        q: "When should Raw mode be used in 1.1 pro Ultra?",
        a: "Raw mode delivers more «real» photorealism without the characteristic AI look — slightly desaturated palette, natural exposure, visible minor imperfections. Use it for documentary portraits, candid photography, journalistic style. For advertising and studio work the standard mode delivers a more «polished» result.",
      },
      {
        q: "Does FLUX.1 support negative prompts?",
        a: "Partially. Append «no text, no watermarks, no blur» or «without people, no human figures» at the end of the prompt. But negative formulations without a positive alternative are less effective — «clean composition without distractions» beats «no clutter, no extra objects». Main rule: describe what you want, not what you don't.",
      },
      {
        q: "Does Opten support FLUX.1?",
        a: "Yes, the Opten extension auto-detects FLUX.1 on supported platforms and scores prompts against the structure outlined above: it checks for description coherence, scene layering, camera terminology presence, and the absence of SD syntax and quality-booster stacks. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
