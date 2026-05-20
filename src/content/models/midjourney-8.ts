// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for midjourney-8.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Midjourney 8: структура, ошибки, примеры",
    description:
      "Как писать промпты для Midjourney V8 Alpha: буквальная интерпретация, нативное 2K через --hd, явное освещение, --no, текст в кавычках, примеры до/после.",
    h1: "Midjourney 8: как писать промпты, которые модель понимает",
    intro:
      "Midjourney V8 Alpha — новая модель, доступная с 17 марта 2026 только на alpha.midjourney.com (Discord не поддерживается). V8 — это не улучшенная V7, а другая модель с буквальной интерпретацией, нативным 2K через `--hd`, скоростью в 5 раз выше V7 и центральной ролью персонализации. Главное правило: указывай освещение явно, иначе результат будет плоским.",
    sections: [
      {
        heading: "Что изменилось в V8",
        body:
          "V8 — это сдвиг от художественной интерпретации к буквальному исполнению промпта. V7 додумывала то, что не указано: добавляла приятный свет, тёплый glow, художественную обработку. V8 даёт ровно то, что описано — не больше. Промпт «woman in a forest» в V7 даст красивый кадр с тёплым светом, в V8 — технически точное, но скучное изображение.\n\nПрактические последствия: нужно эксплицитно указывать освещение, настроение, композицию, стиль. Спецификация важнее интерпретации. Это не недостаток — это инструмент для тех, кто знает, что хочет.",
        bullets: [
          "Буквальная интерпретация — что описано, то и получаешь",
          "Нативное 2K (2048x2048) через --hd",
          "Скорость ~5x выше V7",
          "Нейтральный фотографический результат по умолчанию",
          "Надёжный --no для негативного промпта",
        ],
      },
      {
        heading: "Структура промпта для V8",
        body:
          "Шаблон: [Субъект с деталями] + [Среда/контекст] + [Конкретное освещение] + [Камера/оптика] + [Стиль/настроение] --ar X:Y --s N --v 8.\n\nГлавные правила: 1) Освещение указывай явно — V8 не подставит красивый свет за тебя. Вместо «dramatic portrait, studio lighting» пиши «Portrait lit from a single softbox positioned 45 degrees to the left, creating a strong shadow across the right side of the face». 2) Пиши связными описаниями, не списками тегов. 3) Добавляй фотографические опоры — V8 отлично реагирует на «85mm f/1.8», «medium format», «overcast natural light». 4) Фиксируй --ar в начале — смена соотношения сторон = генерация с нуля.",
      },
      {
        heading: "Параметры и режимы",
        body:
          "Базовый набор: `--v 8` (версия), `--ar` (соотношение сторон), `--s` (0–1000, дефолт 100), `--c` (0–100, chaos), `--no` (негативный промпт — работает значительно лучше V7), `--style raw` (убирает дефолтный полированный стиль), `--p` (персонализация), `--sref [URL]` (style reference, стоимость 4x в alpha), `--exp` (экспериментальная детализация).\n\nV8-эксклюзив: `--hd` — нативное 2K (2048x2048), каждый пиксель генерируется с нуля, стоимость 4x. `--q 4` — усиленная когерентность, стоимость 4x. Комбинация `--hd + --q 4` работает только в Fast режиме, не в Relax. Используй их только для финальных рендеров.\n\nРабочий диапазон `--s` в V8: 0–50 для продуктовых фото, 50–150 для фотореализма (рекомендуется), 200–400 для editorial, 500–800 для свободной интерпретации, 1000 — максимум.",
      },
      {
        heading: "Текст в изображении",
        body:
          "V8 значительно лучше V7 рендерит текст внутри кадра — вывески, упаковку, надписи длиной 1–3 слова. Главное правило: оборачивай текст в кавычки.\n\nХорошо работает: «A vintage neon sign reading \"HOTEL PACIFIC\" on a rain-soaked street at night». Модель надёжно отрисует точно это слово. Без кавычек длинный текст модель может исказить — добавит лишние буквы, перепутает символы.\n\nДля более сложного текста (инфографика, длинные слоганы) V8 всё ещё слабее GPT Image 2 и Nano Banana Pro. Если задача — UI-мокап или плотная инфографика, рассмотри переключение на специализированную модель.",
      },
      {
        heading: "Персонализация и Style Creator",
        body:
          "В V8 персонализация — не опция, а основной рабочий процесс. Style Creator: открой инструмент в веб-интерфейсе, выбери из сгенерированных вариаций те, что соответствуют целевому стилю, получи многоразовый код. Применяй через `--style [код]` ко всем промптам проекта.\n\nПерсонализация (--p) строится на рейтингах изображений — качество важнее количества. Усиливается высоким `--s` (300 + --p = сильный личный стиль), ослабляется низким (`--s 100 --p` = мягкая коррекция). Можно делиться кодами: `--p abc123`.\n\nStyle Reference (--sref) в V8 — переносит палитру, текстуру, освещение, композицию. Стоимость в alpha 4x. Калибровка: тестируй при `--sw 50, 100, 200`. Комбинация `--sref + --p` работает — стилевой референс плюс твой персональный профиль.",
      },
    ],
    examples: [
      {
        before:
          "dramatic portrait, beautiful lighting, 8k, masterpiece",
        after:
          "A middle-aged man with weathered skin and kind eyes, wearing a worn denim jacket, standing in a doorway of an old bookshop, soft afternoon light from a nearby window casting warm shadows across his face, shot on 85mm f/1.8, shallow depth of field, editorial photography --ar 4:5 --s 100 --v 8",
        note:
          "V7-стиль с «dramatic, beautiful, 8k» в V8 даёт плоский результат, потому что модель не добавляет красивый свет автоматически. Эксплицитное описание окна, направления света и тени радикально меняет качество.",
      },
      {
        before:
          "neon sign on rainy street",
        after:
          "A vintage neon sign reading \"HOTEL PACIFIC\" on a rain-soaked street at night, reflections on wet asphalt, warm amber glow, cinematic photography --ar 16:9 --v 8",
        note:
          "Текст в изображении — сильная сторона V8. Точное слово в кавычках, описание окружения, тип света. V7 такой кадр сделал бы хуже — V8 отрисовывает 1–3 слова надёжно.",
      },
      {
        before:
          "product photo of perfume bottle",
        after:
          "Product photograph of a glass perfume bottle on white marble, single overhead softbox light, clean shadow, commercial photography --ar 1:1 --s 50 --style raw --v 8",
        note:
          "Для продуктовых фото в V8 комбинация `--s 50 --style raw` — лучший baseline. Это отключает и художественную интерпретацию (--s), и дефолтную полированную обработку (--style raw). Идеально для коммерческих кадров.",
      },
    ],
    mistakes: [
      {
        title: "Отсутствие явного освещения",
        explain:
          "Самая частая ошибка в V8. «Woman in a forest» даст технически точное, но плоское изображение. V7 добавляла красивый свет автоматически, V8 этого не делает. Всегда указывай источник света, направление, характер: «soft morning light from the left», «harsh midday sun from above», «warm backlight creating rim lighting».",
      },
      {
        title: "Промпт в стиле V7 (теги через запятую)",
        explain:
          "«mountain, fog, sunrise, epic» в V8 даёт буквально гору, туман и восход без художественности. V8 ожидает связные описания: «A snow-capped mountain emerging from fog at sunrise, dramatic warm light on the peaks, wide-angle composition».",
      },
      {
        title: "Спам quality-словами",
        explain:
          "«beautiful, stunning, 8k, masterpiece, best quality» V8 полностью игнорирует — эти слова не влияют на результат и занимают позиционный вес в начале промпта. Замени на конкретные опоры: объектив, тип света, настроение.",
      },
      {
        title: "Использование --hd + --q 4 для итерации",
        explain:
          "Полноценные рендеры V8 с --hd стоят 4x, с --q 4 ещё 4x, вместе работают только в Fast. Это финальные параметры, не для поиска направления. Итерируй в Draft mode на стандартном качестве, переключайся на --hd только для финальных кадров.",
      },
      {
        title: "Персонализация без рейтинга",
        explain:
          "`--p` бесполезен, если в интерфейсе Midjourney оценено мало изображений. Модель строит профиль на основе твоих thumbs up/down — без данных персонализация ничего не даёт. Перед использованием --p оцени хотя бы 100–200 кадров осознанно (не подряд, а с разбором).",
      },
    ],
    faq: [
      {
        q: "Чем V8 отличается от V7?",
        a: "V8 — это не улучшенная V7, а другая модель. Главные отличия: буквальная интерпретация (без художественного «додумывания»), нативное 2K через --hd, скорость ~5x, надёжный --no для негативного промпта, нейтральный фотографический результат по умолчанию, центральная роль персонализации и Style Creator. Доступна только на alpha.midjourney.com, через Discord не работает.",
      },
      {
        q: "Когда использовать --hd и --q 4?",
        a: "`--hd` даёт нативное 2K (2048x2048), стоимость 4x — используй для финальных рендеров, не для итерации. `--q 4` усиливает когерентность, тоже стоимость 4x. Комбинация `--hd + --q 4` работает только в Fast режиме. Стратегия: итерируй в стандартном качестве, переключайся на --hd только когда промпт стабильно даёт нужный результат.",
      },
      {
        q: "Что такое --style raw в V8?",
        a: "`--style raw` убирает дефолтную полированную обработку V8 — повышенный контраст, тёплую color grade, художественный glow. Делает результат более нейтральным и буквальным. Используй для продуктовых фото, технических иллюстраций, документального стиля. Не используй для editorial-фотографии и иллюстраций — там полированный дефолтный стиль уместен.",
      },
      {
        q: "Как лучше всего рендерить текст в V8?",
        a: "V8 надёжно отрисовывает 1–3 слова — оборачивай их в кавычки: «sign reading \"OPEN\"». Указывай шрифт, цвет, расположение если важно. Для длинного текста, инфографики, плотных надписей V8 всё ещё слабее GPT Image 2 и Nano Banana Pro — для таких задач рекомендуется специализированная модель.",
      },
      {
        q: "Работает ли --no в V8?",
        a: "Да, и значительно лучше, чем в V7. `--no clutter, watermark, text, blur` — модель надёжно исключает указанное. Это одно из главных улучшений V8. Используй для очистки фона, исключения нежелательных элементов, контроля композиции. Можно перечислять через запятую несколько концепций.",
      },
      {
        q: "Что делать, если V8 даёт «Minecraft-эффект» или искусственные текстуры?",
        a: "Известная нестабильность Alpha — 3 из 4 результатов могут быть отличными, а 1 — с блочными текстурами или возрастным дрейфом. Решение: перегенерация, изменение формулировок, добавление текстурных опор («skin pores», «fabric weave», «film grain»). Для борьбы с гиперполированностью используй `--style raw`. Для возрастного дрейфа указывай возраст явно плюс «youthful features» или «weathered features».",
      },
      {
        q: "Поддерживает ли Opten Midjourney 8?",
        a: "Да, расширение Opten автоматически распознаёт V8 и оценивает промпты по специфике этой версии. Проверяет наличие явного освещения (главный фактор для V8), связное описание вместо тегов, корректное использование --hd и --q 4 (только финал), осмысленный --no, текст в кавычках. Одним кликом получаешь rewrite с акцентом на явное освещение и фотографические опоры.",
      },
    ],
  },
  en: {
    title: "Midjourney 8 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Midjourney V8 Alpha: literal interpretation, native 2K via --hd, explicit lighting, --no, text in quotes, and before/after examples.",
    h1: "Midjourney 8: how to write prompts the model actually understands",
    intro:
      "Midjourney V8 Alpha is the new model, available since March 17, 2026 only on alpha.midjourney.com (Discord is not supported). V8 is not an improved V7 — it's a different model with literal interpretation, native 2K via `--hd`, 5x faster generation, and personalization at the center. The headline rule: state lighting explicitly, otherwise the result will be flat.",
    sections: [
      {
        heading: "What changed in V8",
        body:
          "V8 is the shift from artistic interpretation to literal prompt execution. V7 filled in what you didn't specify — added pleasing light, warm glow, artistic treatment. V8 gives you exactly what you describe, nothing more. The prompt «woman in a forest» yields a beautiful frame with warm light in V7; in V8 it produces a technically accurate but flat image.\n\nPractical consequence: state lighting, mood, composition, and style explicitly. Specification beats interpretation. This is not a flaw — it's a tool for users who know what they want.",
        bullets: [
          "Literal interpretation — what's described is what you get",
          "Native 2K (2048x2048) via --hd",
          "~5x faster than V7",
          "Neutral photographic default output",
          "Reliable --no for negative prompts",
        ],
      },
      {
        heading: "V8 prompt structure",
        body:
          "Template: [Subject with details] + [Setting/context] + [Specific lighting] + [Camera/lens] + [Style/mood] --ar X:Y --s N --v 8.\n\nKey rules: 1) State lighting explicitly — V8 won't add nice light for you. Instead of «dramatic portrait, studio lighting» write «Portrait lit from a single softbox positioned 45 degrees to the left, creating a strong shadow across the right side of the face». 2) Write coherent descriptions, not tag lists. 3) Add photographic anchors — V8 responds strongly to «85mm f/1.8», «medium format», «overcast natural light». 4) Lock --ar at the start — changing aspect ratio mid-way equals starting over.",
      },
      {
        heading: "Parameters and modes",
        body:
          "Base set: `--v 8` (version), `--ar` (aspect ratio), `--s` (0–1000, default 100), `--c` (0–100, chaos), `--no` (negative prompt — works significantly better than V7), `--style raw` (removes the default polished house style), `--p` (personalization), `--sref [URL]` (style reference, 4x cost in alpha), `--exp` (experimental detail).\n\nV8-exclusive: `--hd` — native 2K (2048x2048), every pixel generated from scratch, 4x cost. `--q 4` — boosted coherence, 4x cost. The `--hd + --q 4` combination works only in Fast mode, not Relax. Use them only for finals.\n\nWorking `--s` range in V8: 0–50 for product shots, 50–150 for photorealism (recommended), 200–400 for editorial, 500–800 for free interpretation, 1000 for maximum.",
      },
      {
        heading: "In-image text",
        body:
          "V8 renders in-image text significantly better than V7 — signs, packaging, short text (1–3 words). The headline rule: wrap text in quotes.\n\nThis works: «A vintage neon sign reading \"HOTEL PACIFIC\" on a rain-soaked street at night». The model reliably renders that exact word. Without quotes, long text gets mangled — extra letters, scrambled characters.\n\nFor more complex text (infographics, long taglines) V8 is still weaker than GPT Image 2 and Nano Banana Pro. If the task is a UI mockup or dense infographic, consider switching to a specialized model.",
      },
      {
        heading: "Personalization and Style Creator",
        body:
          "In V8 personalization is not optional — it's the core workflow. Style Creator: open the tool in the web interface, pick variations matching your target style, get a reusable code. Apply via `--style [code]` to every prompt in the project.\n\nPersonalization (--p) is built from image ratings — quality beats quantity. It amplifies with high `--s` (300 + --p = strong personal style) and softens with low (`--s 100 --p` = gentle correction). Codes can be shared: `--p abc123`.\n\nStyle Reference (--sref) in V8 transfers palette, texture, lighting, composition. 4x cost in alpha. Calibration: test at `--sw 50, 100, 200`. The `--sref + --p` combination works — style reference plus your personal profile.",
      },
    ],
    examples: [
      {
        before:
          "dramatic portrait, beautiful lighting, 8k, masterpiece",
        after:
          "A middle-aged man with weathered skin and kind eyes, wearing a worn denim jacket, standing in a doorway of an old bookshop, soft afternoon light from a nearby window casting warm shadows across his face, shot on 85mm f/1.8, shallow depth of field, editorial photography --ar 4:5 --s 100 --v 8",
        note:
          "The V7-style «dramatic, beautiful, 8k» yields a flat result in V8 because the model doesn't add nice light automatically. Explicit description of the window, light direction, and shadow radically changes quality.",
      },
      {
        before:
          "neon sign on rainy street",
        after:
          "A vintage neon sign reading \"HOTEL PACIFIC\" on a rain-soaked street at night, reflections on wet asphalt, warm amber glow, cinematic photography --ar 16:9 --v 8",
        note:
          "In-image text is one of V8's strengths. Exact word in quotes, setting description, light type. V7 would do this frame worse — V8 renders 1–3 words reliably.",
      },
      {
        before:
          "product photo of perfume bottle",
        after:
          "Product photograph of a glass perfume bottle on white marble, single overhead softbox light, clean shadow, commercial photography --ar 1:1 --s 50 --style raw --v 8",
        note:
          "For product photography in V8 the `--s 50 --style raw` combo is the best baseline. It disables both artistic interpretation (--s) and the default polished treatment (--style raw). Ideal for commercial shots.",
      },
    ],
    mistakes: [
      {
        title: "No explicit lighting",
        explain:
          "The single most common V8 mistake. «Woman in a forest» yields a technically accurate but flat image. V7 added nice light automatically; V8 doesn't. Always state the light source, direction, and character: «soft morning light from the left», «harsh midday sun from above», «warm backlight creating rim lighting».",
      },
      {
        title: "V7-style prompts (comma-separated tags)",
        explain:
          "«mountain, fog, sunrise, epic» yields a literally accurate mountain, fog, and sunrise with no artistry. V8 expects coherent descriptions: «A snow-capped mountain emerging from fog at sunrise, dramatic warm light on the peaks, wide-angle composition».",
      },
      {
        title: "Quality-word spam",
        explain:
          "«beautiful, stunning, 8k, masterpiece, best quality» — V8 ignores these entirely. They don't affect output and burn positional weight at the front of the prompt. Replace with concrete anchors: lens, light type, mood.",
      },
      {
        title: "Using --hd + --q 4 for iteration",
        explain:
          "Full V8 renders with --hd cost 4x, with --q 4 another 4x, and the combo works only in Fast. These are final-render parameters, not for direction-finding. Iterate in Draft mode at standard quality, switch to --hd only for finals.",
      },
      {
        title: "Personalization without ratings",
        explain:
          "`--p` is useless if you've rated few images in the Midjourney UI. The model builds the profile from your thumbs up/down — without data, personalization does nothing. Before using --p, rate at least 100–200 frames deliberately (not in a row, with thought).",
      },
    ],
    faq: [
      {
        q: "How is V8 different from V7?",
        a: "V8 is not an improved V7 — it's a different model. Key differences: literal interpretation (no artistic «filling in»), native 2K via --hd, ~5x faster generation, reliable --no for negatives, neutral photographic default output, central role of personalization and Style Creator. Available only on alpha.midjourney.com — Discord doesn't work.",
      },
      {
        q: "When to use --hd and --q 4?",
        a: "`--hd` gives native 2K (2048x2048), 4x cost — use for finals, not iteration. `--q 4` boosts coherence, also 4x cost. The `--hd + --q 4` combination works only in Fast mode. Strategy: iterate at standard quality, switch to --hd only once the prompt reliably produces what you want.",
      },
      {
        q: "What does --style raw do in V8?",
        a: "`--style raw` removes V8's default polished treatment — boosted contrast, warm color grade, artistic glow. The result becomes more neutral and literal. Use for product shots, technical illustrations, documentary style. Avoid for editorial photography and illustration — there the polished default style is appropriate.",
      },
      {
        q: "How do I render text in V8 reliably?",
        a: "V8 reliably renders 1–3 words — wrap them in quotes: «sign reading \"OPEN\"». Specify font, color, placement if needed. For long text, infographics, or dense type V8 is still weaker than GPT Image 2 and Nano Banana Pro — for those tasks a specialized model is recommended.",
      },
      {
        q: "Does --no work in V8?",
        a: "Yes, and significantly better than in V7. `--no clutter, watermark, text, blur` reliably excludes the listed concepts. This is one of V8's headline upgrades. Use it to clean backgrounds, drop unwanted elements, and control composition. Multiple concepts can be listed comma-separated.",
      },
      {
        q: "What if V8 gives a «Minecraft effect» or artificial textures?",
        a: "A known Alpha instability — 3 of 4 results may be excellent while 1 shows blocky textures or age drift. Solutions: regenerate, rephrase, add texture anchors («skin pores», «fabric weave», «film grain»). To fight the gloss use `--style raw`. For age drift state age explicitly plus «youthful features» or «weathered features».",
      },
      {
        q: "Does Opten support Midjourney 8?",
        a: "Yes, the Opten extension auto-detects V8 and scores prompts against this version's specifics. It checks for explicit lighting (the main V8 factor), coherent description instead of tags, correct use of --hd and --q 4 (finals only), meaningful --no, text in quotes. One click gives you a rewrite emphasizing explicit lighting and photographic anchors.",
      },
    ],
  },
};
