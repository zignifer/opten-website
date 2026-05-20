// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for midjourney-7.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Midjourney 7: структура, ошибки, примеры",
    description:
      "Как писать промпты для Midjourney V7: естественный язык, параметры --ar/--s/--sref, фотореализм, режим Draft, антипаттерны и подробные примеры до и после.",
    h1: "Midjourney 7: как писать промпты, которые модель понимает",
    intro:
      "Midjourney V7 — флагманская image-модель Midjourney с релиза 3 апреля 2025. V7 фундаментально изменила работу с промптами: теперь модель понимает естественный английский язык, а старый подход «keywords через запятую» активно ухудшает результат. Слова в начале промпта весят больше, лучший фотореализм в семействе, персонализация включена по умолчанию.",
    sections: [
      {
        heading: "Что умеет Midjourney 7",
        body:
          "V7 — это шаг от tag-soup к описаниям в стиле кинооператора. Модель драматически улучшила анатомию людей (руки, тела, позы, пространственные отношения), рендеринг текста на вывесках и упаковке, и понимание полных предложений.\n\nКлючевые сильные стороны: лучший фотореализм среди всех версий Midjourney, отличная реакция на фотографические термины (объективы, диафрагма, типы плёнки), новый параметр --oref (Omni Reference) для универсального переноса содержимого и стиля, и продвинутый --sref с весом --sw для переноса визуального стиля. Параметр --cref из V6 в V7 удалён.",
        bullets: [
          "Естественный язык вместо списков ключевых слов",
          "Драматически улучшенная анатомия и пространственные отношения",
          "Лучший в семействе фотореализм + рендеринг текста",
          "Персонализация (--p) включена по умолчанию",
          "Omni Reference (--oref) — новый универсальный референс",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальная иерархия: [Субъект] + [Детали субъекта] + [Контекст/среда] + [Стиль/настроение] + [Камера/освещение] + [Параметры].\n\nГлавный субъект всегда первым. V7 обрабатывает токены последовательно — слова в начале получают максимальный вес. «Beautiful cinematic photo of a woman» работает хуже, чем «An elderly fisherman with a weathered face, standing on a wooden dock at dawn, documentary photography style».\n\nПиши связными предложениями, не запятыми между тегами. Модель понимает грамматику и контекст: «A man walking through rain-soaked streets, his reflection shimmering in puddles» даёт лучший результат, чем «man, rain, street, wet, reflections».",
      },
      {
        heading: "Параметры V7",
        body:
          "Базовый набор: `--ar` (соотношение сторон, дефолт 1:1), `--s` или `--stylize` (0–1000, дефолт 100 — сила художественной интерпретации), `--c` или `--chaos` (0–100, разнообразие 4 вариаций), `--w` или `--weird` (0–3000, экспериментальность).\n\nСтиль и референсы: `--style raw` убирает дефолтную художественную обработку, `--sref [URL]` переносит визуальный стиль из изображения, `--sw` (0–1000) контролирует силу, `--oref` — Omni Reference нового поколения, `--iw` (0–3) — вес image-референса, `--p` — персонализация по профилю пользователя.\n\nРежимы: Draft (0.5x стоимость, быстро) для итерации, Fast (1x) для рабочего процесса, Turbo (2x) для срочных финалов, Relax (бесплатно) для экспериментов.",
      },
      {
        heading: "Фотореализм и освещение",
        body:
          "Освещение — самый мощный фактор качества в V7. Конкретное описание света радикально меняет результат: «golden hour light casting long shadows across weathered stone», «Rembrandt lighting with soft fill from camera left», «bioluminescent glow illuminating the fog» работают лучше, чем «nice lighting» или «dramatic light».\n\nДля фотореалистичных портретов используй язык фотографии: «shot on 85mm f/1.8, shallow depth of field», «medium format look, high dynamic range», «35mm film grain, Kodak Portra 400 palette». Это даёт модели технические опоры, на которые она реагирует.\n\nДля продуктовых фото комбинируй `--s 25–75` + `--style raw` — это минимизирует художественную интерпретацию и даёт буквальный результат. Для концепт-арта и иллюстраций поднимай `--s` до 300–600.",
      },
      {
        heading: "Draft mode и итерация",
        body:
          "Draft mode — недооценённый инструмент V7. Генерирует в 10 раз быстрее за 0.5x стоимости, идеален для поиска направления. Стратегия: тестируй формулировки в Draft, переходи на Fast/Turbo только когда промпт стабильно даёт нужный результат.\n\nПерсонализация (--p) строится на твоих рейтингах изображений в интерфейсе Midjourney. Усиливается высоким `--s` (300 + --p = сильный личный стиль), ослабляется низким (`--s 100 --p` — мягкая коррекция). Качество рейтинга важнее количества — оценивай осознанно. Можно делиться кодами: `--p abc123`.",
      },
    ],
    examples: [
      {
        before:
          "beautiful cinematic photo of a fisherman, ultra detailed, 8k, masterpiece",
        after:
          "An elderly fisherman with a weathered face and silver beard, standing on a wooden dock at dawn, documentary photography style, contemplative mood, shot on Leica M11 with natural morning light, soft mist rising from the water --ar 3:2 --s 100 --v 7",
        note:
          "Старый промпт зарывает субъект под стиль и спамит quality-словами. V7 ожидает, что субъект идёт первым, а конкретные фотографические опоры (Leica M11, natural morning light) заменяют «8k, masterpiece».",
      },
      {
        before:
          "mountain, fog, sunrise, epic, cinematic, dramatic, beautiful",
        after:
          "Ancient redwood forest in morning mist, shafts of golden light filtering through canopy, ferns covering the forest floor, wide-angle composition, national geographic photography --ar 16:9 --s 150 --v 7",
        note:
          "Список тегов через запятую — антипаттерн V7. Связное описание с конкретным светом, композицией и жанровой опорой («national geographic photography») даёт стабильно лучший результат.",
      },
      {
        before:
          "product photo of a coffee mug",
        after:
          "Minimalist product shot of a ceramic coffee mug on a light oak table, soft natural window light from the left, clean composition, editorial style --ar 1:1 --s 25 --style raw --v 7",
        note:
          "Продуктовая фотография — сценарий, где низкий `--s` + `--style raw` обязательны. Без них модель добавляет художественную интерпретацию, которая мешает коммерческому использованию.",
      },
    ],
    mistakes: [
      {
        title: "Списки ключевых слов через запятую",
        explain:
          "Главный антипаттерн V7. «mountain, fog, sunrise, epic, cinematic» даёт хаотичный результат, потому что модель ожидает связное описание. Пиши предложениями: субъект, что он делает, где, как освещён.",
      },
      {
        title: "Спам quality-словами",
        explain:
          "«beautiful, stunning, 8k, detailed, masterpiece, best quality» — бесполезный мусор для V7. Эти слова занимают ценный позиционный вес в начале промпта и не улучшают результат. Замени их на конкретные фотографические опоры (объектив, тип плёнки, источник света).",
      },
      {
        title: "Субъект не в начале промпта",
        explain:
          "«Beautiful cinematic photo of a woman» — субъект на третьем месте, стиль перетянул вес на себя. V7 обрабатывает токены последовательно, и слова в первых строках получают максимальный вес. Выноси «кто или что» в первое предложение.",
      },
      {
        title: "Использование --cref в V7",
        explain:
          "Параметр --cref (Character Reference) удалён в V7. Если копируешь промпт из V6 и оставляешь --cref — он не работает. Используй --oref (Omni Reference) для универсального переноса или --sref для стиля.",
      },
      {
        title: "Конфликт --s и --style raw",
        explain:
          "Высокий `--s 500` плюс `--style raw` тянут модель в противоположных направлениях: один говорит «больше художественной интерпретации», другой «меньше обработки». Для фотореализма комбинация — это `--s 25–100 + --style raw`, для иллюстраций — высокий `--s` без `raw`.",
      },
    ],
    faq: [
      {
        q: "Чем Midjourney 7 отличается от V6?",
        a: "V7 — это переход к естественному языку: модель ожидает связные описания вместо списков тегов. Главные апгрейды: драматически улучшенная анатомия (руки, тела, позы), лучший фотореализм, рендеринг текста на вывесках и упаковке, новый параметр --oref (Omni Reference), персонализация включена по умолчанию. Параметр --cref из V6 удалён.",
      },
      {
        q: "Какие параметры рекомендуются для фотореализма?",
        a: "Для photorealism базовая комбинация — `--s 50–100 --style raw --v 7`. Это минимизирует художественную интерпретацию и даёт буквальный фотографический результат. Дополнительно используй конкретные опоры в промпте: «shot on 85mm f/1.8», «medium format», «35mm film grain», «Kodak Portra 400» — V7 отлично реагирует на терминологию фотографии.",
      },
      {
        q: "Стоит ли писать промпты на русском?",
        a: "Нет, V7 оптимизирована под английский. Промпты на других языках работают значительно хуже — модель теряет нюансы и опоры. Если задача важная, переведи промпт на английский: качество вырастет заметно. Для коротких экспериментов русский ок, но не жди от него того же уровня детализации.",
      },
      {
        q: "Что такое --oref и чем он отличается от --sref?",
        a: "--sref (Style Reference) переносит только визуальный стиль из изображения — палитру, текстуру, освещение, композицию. --oref (Omni Reference) — новый универсальный референс V7, который переносит и содержимое, и стиль. Используй --sref когда нужен только стиль, --oref когда нужно перенести персонажа или конкретный объект из референса.",
      },
      {
        q: "Когда использовать Draft mode?",
        a: "Draft mode — для итерации и поиска направления. Стоимость 0.5x, скорость 10x — идеально для тестирования формулировок промпта. Стратегия: гоняй варианты промпта в Draft, переходи на Fast или Turbo только когда промпт стабильно даёт нужный результат. Не используй Draft для финальных рендеров — качество ниже.",
      },
      {
        q: "Можно ли смешивать --p с --sref в одном промпте?",
        a: "Да, и это рабочая комбинация. --p применяет твой персональный профиль предпочтений, --sref добавляет стилевой референс из конкретного изображения. Усиление: высокий `--s 300 --p --sref [URL]` даёт сильный личный стиль с привязкой к референсу. Только не перегружай — больше трёх стилевых модификаторов одновременно приводят к хаосу.",
      },
      {
        q: "Поддерживает ли Opten Midjourney 7?",
        a: "Да, расширение Opten автоматически распознаёт Midjourney 7 и оценивает промпты по структуре V7: проверяет наличие субъекта в начале, связное описание вместо тегов, отсутствие quality-спама, корректное использование параметров (--ar, --s, --style raw, --sref). Одним кликом получаешь rewrite в естественном языке V7 и подсказки по освещению и камере.",
      },
    ],
  },
  en: {
    title: "Midjourney 7 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Midjourney V7: natural language, --ar/--s/--sref parameters, photorealism, Draft mode, anti-patterns, and before/after examples.",
    h1: "Midjourney 7: how to write prompts the model actually understands",
    intro:
      "Midjourney V7 is Midjourney's flagship image model released on April 3, 2025. V7 fundamentally changed prompt writing — the model now understands natural English, and the old «keywords with commas» approach actively hurts results. Opening words carry more weight, photorealism is the best in the family, and personalization is enabled by default.",
    sections: [
      {
        heading: "What Midjourney 7 does well",
        body:
          "V7 is the shift from tag-soup to descriptions in a cinematographer's voice. The model dramatically improved human anatomy (hands, bodies, poses, spatial relationships), rendering of text on signs and packaging, and comprehension of full sentences.\n\nKey strengths: best photorealism across the Midjourney family, strong response to photography vocabulary (lenses, apertures, film stocks), a new --oref (Omni Reference) parameter for universal content + style transfer, and advanced --sref with --sw weight for visual style transfer. The --cref parameter from V6 is removed in V7.",
        bullets: [
          "Natural language instead of keyword lists",
          "Dramatically improved anatomy and spatial relationships",
          "Best photorealism in the family + text rendering",
          "Personalization (--p) on by default",
          "Omni Reference (--oref) — new universal reference",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal hierarchy: [Subject] + [Subject details] + [Context/setting] + [Style/mood] + [Camera/lighting] + [Parameters].\n\nThe main subject always goes first. V7 processes tokens sequentially — opening words get maximum weight. «Beautiful cinematic photo of a woman» works worse than «An elderly fisherman with a weathered face, standing on a wooden dock at dawn, documentary photography style».\n\nWrite in coherent sentences, not commas between tags. The model understands grammar and context: «A man walking through rain-soaked streets, his reflection shimmering in puddles» beats «man, rain, street, wet, reflections» every time.",
      },
      {
        heading: "V7 parameters",
        body:
          "Core set: `--ar` (aspect ratio, default 1:1), `--s` or `--stylize` (0–1000, default 100 — strength of artistic interpretation), `--c` or `--chaos` (0–100, variation diversity), `--w` or `--weird` (0–3000, experimentation).\n\nStyle and references: `--style raw` removes the default artistic treatment, `--sref [URL]` transfers visual style from an image, `--sw` (0–1000) controls strength, `--oref` is the new-generation Omni Reference, `--iw` (0–3) weights image references, `--p` applies your personalization profile.\n\nModes: Draft (0.5x cost, fast) for iteration, Fast (1x) for everyday work, Turbo (2x) for urgent finals, Relax (free) for experiments.",
      },
      {
        heading: "Photorealism and lighting",
        body:
          "Lighting is the single most powerful quality lever in V7. Specific descriptions of light radically change the result: «golden hour light casting long shadows across weathered stone», «Rembrandt lighting with soft fill from camera left», «bioluminescent glow illuminating the fog» beat «nice lighting» or «dramatic light».\n\nFor photorealistic portraits, use photography vocabulary: «shot on 85mm f/1.8, shallow depth of field», «medium format look, high dynamic range», «35mm film grain, Kodak Portra 400 palette». These give the model technical anchors it responds to strongly.\n\nFor product shots combine `--s 25–75` with `--style raw` — this minimizes artistic interpretation and produces a literal result. For concept art and illustrations push `--s` to 300–600.",
      },
      {
        heading: "Draft mode and iteration",
        body:
          "Draft mode is V7's underrated tool. Generates 10x faster at 0.5x cost — ideal for finding direction. Strategy: test phrasings in Draft, switch to Fast or Turbo only once the prompt reliably produces what you want.\n\nPersonalization (--p) is built from your thumbs-up ratings in the Midjourney interface. It amplifies with high `--s` (300 + --p = strong personal style) and softens with low (`--s 100 --p` = gentle correction). Quality of ratings matters more than quantity — rate deliberately. Codes can be shared: `--p abc123`.",
      },
    ],
    examples: [
      {
        before:
          "beautiful cinematic photo of a fisherman, ultra detailed, 8k, masterpiece",
        after:
          "An elderly fisherman with a weathered face and silver beard, standing on a wooden dock at dawn, documentary photography style, contemplative mood, shot on Leica M11 with natural morning light, soft mist rising from the water --ar 3:2 --s 100 --v 7",
        note:
          "The old prompt buries the subject under style and spams quality words. V7 expects the subject first, with specific photographic anchors (Leica M11, natural morning light) replacing «8k, masterpiece».",
      },
      {
        before:
          "mountain, fog, sunrise, epic, cinematic, dramatic, beautiful",
        after:
          "Ancient redwood forest in morning mist, shafts of golden light filtering through canopy, ferns covering the forest floor, wide-angle composition, national geographic photography --ar 16:9 --s 150 --v 7",
        note:
          "Comma-separated tag lists are a V7 anti-pattern. A coherent description with specific light, composition, and a genre anchor («national geographic photography») reliably outperforms.",
      },
      {
        before:
          "product photo of a coffee mug",
        after:
          "Minimalist product shot of a ceramic coffee mug on a light oak table, soft natural window light from the left, clean composition, editorial style --ar 1:1 --s 25 --style raw --v 7",
        note:
          "Product photography is the scenario where low `--s` plus `--style raw` is mandatory. Without them the model adds artistic interpretation that breaks commercial use.",
      },
    ],
    mistakes: [
      {
        title: "Comma-separated keyword lists",
        explain:
          "The headline V7 anti-pattern. «mountain, fog, sunrise, epic, cinematic» produces chaotic results because the model expects coherent description. Write in sentences: subject, what they do, where they are, how they're lit.",
      },
      {
        title: "Quality-word spam",
        explain:
          "«beautiful, stunning, 8k, detailed, masterpiece, best quality» is useless noise in V7. These words burn precious positional weight at the start of the prompt and don't improve results. Replace them with concrete photographic anchors (lens, film stock, light source).",
      },
      {
        title: "Subject not in the opening words",
        explain:
          "«Beautiful cinematic photo of a woman» — the subject is third, style stole the weight. V7 processes tokens sequentially and gives maximum weight to the opening lines. Move «who or what» into the first sentence.",
      },
      {
        title: "Using --cref in V7",
        explain:
          "The --cref (Character Reference) parameter is removed in V7. If you copy a prompt from V6 and leave --cref in, it does nothing. Use --oref (Omni Reference) for universal transfer or --sref for style-only.",
      },
      {
        title: "Conflict between --s and --style raw",
        explain:
          "High `--s 500` plus `--style raw` pull the model in opposite directions: one says «more artistic interpretation», the other «less treatment». For photorealism the combo is `--s 25–100 + --style raw`; for illustration go high `--s` without `raw`.",
      },
    ],
    faq: [
      {
        q: "How is Midjourney 7 different from V6?",
        a: "V7 is the shift to natural language: the model now expects coherent descriptions instead of tag lists. Major upgrades include dramatically improved anatomy (hands, bodies, poses), best-in-family photorealism, in-image text rendering on signs and packaging, the new --oref (Omni Reference) parameter, and personalization on by default. The --cref parameter from V6 is gone.",
      },
      {
        q: "What parameters are recommended for photorealism?",
        a: "The baseline combination for photorealism is `--s 50–100 --style raw --v 7`. This minimizes artistic interpretation and yields a literal photographic result. Reinforce with specific anchors in the prompt: «shot on 85mm f/1.8», «medium format», «35mm film grain», «Kodak Portra 400» — V7 responds strongly to photography terminology.",
      },
      {
        q: "Should I write prompts in languages other than English?",
        a: "No, V7 is optimized for English. Prompts in other languages perform noticeably worse — the model loses nuance and anchors. For anything important, translate to English: the quality jump is visible. For short experiments other languages are fine, but don't expect the same detail level.",
      },
      {
        q: "What is --oref and how is it different from --sref?",
        a: "--sref (Style Reference) transfers only visual style from an image — palette, texture, lighting, composition. --oref (Omni Reference) is V7's new universal reference that transfers both content and style. Use --sref when you only want the style, --oref when you need to carry over a character or specific object from the reference.",
      },
      {
        q: "When should I use Draft mode?",
        a: "Draft mode is for iteration and direction-finding. Cost 0.5x, speed 10x — perfect for testing phrasings. Strategy: cycle prompt variants in Draft, switch to Fast or Turbo only once the prompt reliably produces what you want. Don't use Draft for finals — quality is lower.",
      },
      {
        q: "Can I combine --p with --sref in one prompt?",
        a: "Yes, and it's a working combination. --p applies your personal preference profile, --sref adds a style reference from a specific image. Reinforcement: high `--s 300 --p --sref [URL]` produces a strong personal style anchored to the reference. Just don't overload — more than three style modifiers at once tends to chaos.",
      },
      {
        q: "Does Opten support Midjourney 7?",
        a: "Yes, the Opten extension auto-detects Midjourney 7 and scores prompts against V7 structure: it checks for subject up front, coherent description instead of tags, absence of quality-spam, and correct parameter use (--ar, --s, --style raw, --sref). One click gives you a rewrite in V7's natural-language style plus hints on lighting and camera.",
      },
    ],
  },
};
