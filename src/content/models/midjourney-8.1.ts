// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for midjourney-8.1.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Midjourney 8.1: структура, ошибки, примеры",
    description:
      "Как писать промпты для Midjourney V8.1 Alpha: удалённые параметры (--no, --ow, --p 0), anti-bokeh stack, --raw, нативное 2K и подробные примеры до и после.",
    h1: "Midjourney 8.1: как писать промпты, которые модель понимает",
    intro:
      "Midjourney V8.1 Alpha — апгрейд V8, доступный только через alpha.midjourney.com (Discord не поддерживается). Главные сдвиги: HD теперь дефолт (флаг --hd не нужен), параметры `--no`, `--ow`, `--p 0` удалены, image-референсы загружаются только через UI-слоты. Модель ещё более буквальна, чем V8, и имеет сильный baked-in bokeh, требующий anti-bokeh stack для документального реализма.",
    sections: [
      {
        heading: "Что изменилось в V8.1",
        body:
          "V8.1 — это не отдельный продукт, а апгрейд V8. Но Midjourney удалил ряд параметров, которые работали раньше — это критично для оценки промпта.\n\nУдалены: `--no` (negatives — теперь описывай позитивно), `--ow` (omni-weight — нет замены), `--p 0` (отключение персонализации — теперь только через UI). Сообщение об ошибке от Midjourney: `--no is not compatible with --version 8.1`. Если в промпте под V8.1 есть `--no`, `--ow` или `--p 0` — это ошибка №1 для немедленного флага.\n\nHD стал дефолтным — флаг `--hd` больше не нужен, нативное 2K включено по умолчанию. Image references — только через 3 UI-слота: Start Frame, Image Prompts, Style References. Безопасный набор рабочих параметров: `--raw`, `--s`, `--ar`, `--c`, `--q`.",
        bullets: [
          "Удалены: --no, --ow, --p 0 (не работают в V8.1)",
          "HD по умолчанию — флаг --hd больше не нужен",
          "Image references только через UI-слоты, не параметрами",
          "Только web (alpha.midjourney.com), Discord не поддерживается",
          "Anti-bokeh stack нужен для документального реализма",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "V8.1 вознаграждает связные cinematic-описания, а не списки тегов. Параграф 60–140 слов, читается как режиссёр описывает кадр оператору.\n\nПорядок элементов: 1) Shot type + subject («Candid iPhone close-up of a woman in her 20s…»), 2) Specific physical details — что делает её именно ею, а не generic «woman», 3) Wardrobe + props — материалы, состояние, износ, 4) Action / expression — конкретный момент, 5) Camera angle and lens feel — один короткий технический якорь, 6) Light + setting — источник, направление, атмосфера, 7) Finishing texture — skin / grain / realism cue в конце.\n\nПосле промпта — отдельный блок с параметрами V8.1. Главные правила: указывай освещение явно, пиши связными описаниями, добавляй камеру и оптику, фиксируй `--ar` с самого начала.",
      },
      {
        heading: "Параметр-дефолты по категориям",
        body:
          "Готовые baseline-комбинации (Dan Kieft v3): Photorealism / documentary / cinematic action — `--raw --s 100 --ar 16:9`. Editorial portraits / fashion — `--s 100 --ar 16:9` без `--raw`. Stylized illustration / anime / cyberpunk — `--s 250 --ar 16:9` без `--raw`. Movie posters — `--s 250 --ar 2:3` без `--raw`. Fantasy character close-ups (grounded) — `--raw --s 100`, (stylized) — `--s 250` без `--raw`.\n\n`--raw` отключает house-style стилизацию Midjourney (повышенный контраст, тёплая color grade, полированный glow). Делает результат более prompt-faithful. Используй для photorealism, documentary, продуктовых задач. НЕ используй для stylized illustration, fantasy art, editorial fashion, movie posters — категорий, которые выигрывают от house-style.\n\n`--s` (stylize): 100 (default) — сбалансировано, 250 — заметно более стилизованно для иллюстраций, 500–750 — максимальная художественная интерпретация, дрейф от промпта.",
      },
      {
        heading: "Anti-bokeh stack",
        body:
          "V8.1 имеет сильный baked-in bokeh — модель почти всегда добавляет shallow depth of field на close-up'ах. Для iPhone-реализма или документальной фотографии это убивает аутентичность: у iPhone маленький сенсор, естественно глубокая depth of field, настоящего bokeh нет (Portrait Mode — софтверная подделка).\n\nAnti-bokeh stack — стакать 3–4 фразы одновременно: «Deep focus, sharp from foreground to background. No blur, no bokeh, no depth-of-field separation. Shot on 24mm lens at f/11. Natural deep depth of field of an iPhone. Hyperfocal deep focus, sharp throughout entire frame.» Для V8.1 одной фразы недостаточно — модель проигнорирует.\n\nКритическое исключение: в action cinema (battle scenes, charging POV, mid-combat) shallow depth of field на герое с soft chaos позади — это правильно. Так снимают prestige-кино (Last Samurai, Gladiator, Pelennor Fields). Не борись с bokeh в action cinema, борись с bokeh в static realism.",
      },
      {
        heading: "Multi-reference rules",
        body:
          "В V8.1 image-референсы загружаются только через UI: 3 слота — Start Frame, Image Prompts, Style References. Когда в слотах 8+ референсов, правила меняются.\n\n1) Ссылайся на референс, не переописывай его: «He wears the field jacket from the reference» вместо «an olive green canvas field jacket with leather collar and four utility pockets». 2) Назначай каждому референсу место: «The camera hangs in his right hand. The bag is across his shoulder. The compass clipped to his belt.» Каждый референс — это слот в сцене. 3) Избегай clutter language — не пытайся «оправдать» каждый референс художественным языком. 4) Выбрасывай референсы без testable value — если не можешь чётко поместить референс в сцену, модель его всё равно проигнорирует. 5) На 12+ референсах ожидай частичный провал — спланируй так, чтобы 2–3 самых важных легли чисто.",
      },
    ],
    examples: [
      {
        before:
          "iPhone selfie of a woman in subway --no blur, bokeh, depth of field --v 8.1",
        after:
          "iPhone selfie photograph of a young woman in her early 20s sitting on a bench in a busy New York City subway station, holding her iPhone at arm's length. Front camera perspective, slightly elevated angle. She wears a soft pink leotard, dark hair in a tight bun. Around her, the busy NYC subway, white tile walls, fluorescent overhead lighting. The natural deep depth of field of an iPhone front camera, everything in sharp clear focus, no blur or bokeh, no portrait mode effect. Hyper-realistic skin texture, raw unfiltered iPhone photography aesthetic. --raw --s 100 --ar 16:9",
        note:
          "В V8.1 `--no` не работает (это ошибка №1). Решение: anti-bokeh stack (3–4 фразы) позитивным описанием. Параметры в конце — `--raw --s 100 --ar 16:9` (Dan Kieft default для photorealism).",
      },
      {
        before:
          "cyberpunk anime girl in neon alley",
        after:
          "Stylized anime cyberpunk illustration in the visual style of Arcane, Cyberpunk Edgerunners, and Blade Runner Black Lotus, mid-shot of a stylish cyberpunk woman leaning against a graffiti-covered wall in a narrow rain-soaked neon alleyway, smoking a cigarette with a contemplative expression. Long straight white hair with blunt bangs, sharp angular jawline, large striking cyan eyes. Neon-lit skyscrapers, wet pavement reflecting saturated red and pink neon glow. Painterly digital illustration with visible brush strokes, anime-stylized proportions. --s 250 --ar 16:9",
        note:
          "Stylized illustration — sweet spot V8.1: `--s 250` без `--raw`. Жанровые якоря (Arcane, Cyberpunk Edgerunners) дают модели чёткий стилевой ориентир. Конкретные детали персонажа (white hair, blunt bangs, cyan eyes) — буквальная V8.1 выполнит точно.",
      },
      {
        before:
          "horror movie poster of a girl in hallway",
        after:
          "Cinematic horror movie poster artwork, vertical composition, a small girl about seven years old walking slowly forward down the middle of an enormous long empty hallway of an old turn-of-the-century gothic mansion, viewed from far behind her at floor level. She wears a long pale Victorian-era white nightgown, dragging a worn old teddy bear. The hallway stretches into deep darkness with peeling wallpaper, dust motes in pale window light. At the very far end, a tall thin shadowy figure stands watching her. Cool desaturated palette, the look of a prestige A24 horror poster. Significant negative space at top for typography. --s 250 --ar 2:3",
        note:
          "Movie poster paradigm: `--s 250 --ar 2:3` (вертикальный формат для типографики). Якорь к A24 эстетике, restraint в показе монстра, явное упоминание negative space для будущего текста.",
      },
    ],
    mistakes: [
      {
        title: "Использование --no в V8.1",
        explain:
          "Параметр `--no` удалён в V8.1 — модель возвращает ошибку «--no is not compatible with --version 8.1». Замени на позитивное описание: вместо «--no clutter» пиши «clean background, minimal props». Это самая частая ошибка в промптах после обновления до V8.1.",
      },
      {
        title: "Использование удалённых параметров --ow и --p 0",
        explain:
          "`--ow` (omni-weight) и `--p 0` (отключение персонализации) удалены в V8.1. Замены нет — описывай без omni-weight, персонализацию управляй через UI Style Creator. Если копируешь промпт из V8 — проверь и удали эти флаги.",
      },
      {
        title: "Использование --hd как флага в V8.1",
        explain:
          "HD теперь default в V8.1, флаг `--hd` не нужен — нативное 2K включено по умолчанию. Стоимость поднялась относительно V8 base, но это уже встроено в дефолтный режим. Указание `--hd` не вызовет ошибку, но не имеет смысла.",
      },
      {
        title: "Anti-bokeh stack в action-сценах",
        explain:
          "В action cinema (battle, mid-charge, POV) shallow depth of field на герое — это правильная кинематография, а не баг. Так снимает prestige-кино. Если стакаешь anti-bokeh в action-сцене — ты борешься с правильным эффектом. Anti-bokeh нужен только для iPhone-реализма и static documentary, не для cinematic action.",
      },
      {
        title: "Tag-soup стиль (список слов через запятую)",
        explain:
          "V8.1 интерпретирует промпт ещё более буквально, чем V8 — список слов через запятую даёт хаотичный результат. Пиши связными cinematic-описаниями 60–140 слов. Один параграф, как режиссёр описывает кадр оператору, в порядке: shot type + subject → details → wardrobe → action → camera → light → texture.",
      },
    ],
    faq: [
      {
        q: "Чем V8.1 отличается от V8?",
        a: "V8.1 — это апгрейд V8, не отдельный продукт. Главные сдвиги: удалены параметры `--no`, `--ow`, `--p 0`; HD стал дефолтным (флаг `--hd` не нужен); image-референсы загружаются только через UI-слоты, не параметрами; интерпретация ещё более буквальная; baked-in bokeh усилился. Безопасный набор рабочих параметров: `--raw`, `--s`, `--ar`, `--c`, `--q`.",
      },
      {
        q: "Какие параметры рекомендуются для photorealism в V8.1?",
        a: "Baseline для photorealism, documentary и cinematic action — `--raw --s 100 --ar 16:9` (Dan Kieft v3 default). `--raw` отключает house-style стилизацию Midjourney (полированный glow, тёплая color grade), делает результат более prompt-faithful. Для iPhone-реализма дополнительно нужен anti-bokeh stack из 3–4 фраз в самом промпте.",
      },
      {
        q: "Что такое anti-bokeh stack и когда его использовать?",
        a: "V8.1 имеет сильный baked-in bokeh — почти всегда добавляет shallow depth of field на close-up'ах. Для iPhone-реализма и документального стиля это убивает аутентичность. Anti-bokeh stack — 3–4 фразы одновременно: «Deep focus», «No blur, no bokeh», «Shot on 24mm lens at f/11», «Natural deep depth of field of an iPhone». Одной фразы V8.1 проигнорирует. НЕ используй anti-bokeh в action-сценах — там shallow DoF корректен.",
      },
      {
        q: "Как заменить --no в V8.1?",
        a: "Описывай позитивно. Вместо «--no clutter» пиши «clean background, minimal props». Вместо «--no text, watermark» — «no text in the image» прямо в промпте или «empty surface, no signage». Вместо «--no bokeh» — anti-bokeh stack из нескольких фраз. Это требует больше слов, но V8.1 надёжно реагирует на позитивные описания.",
      },
      {
        q: "Когда использовать `--raw`, а когда без него?",
        a: "С `--raw`: photorealism, documentary, cinematic action, продуктовая съёмка, fantasy close-ups в grounded стиле — категории, где промпт должен доминировать над house-style. Без `--raw`: stylized illustration, editorial portraits, fantasy art, movie posters, anime, cyberpunk — категории, которые выигрывают от полированного дефолтного стиля Midjourney.",
      },
      {
        q: "Подходит ли V8.1 для текста в изображении или UI-мокапов?",
        a: "Нет, для text-heavy задач V8.1 заметно слабее GPT Image 2 и Nano Banana Pro. Длинные надписи, инфографика, мульти-language текст — рекомендуем переключиться на специализированную модель. V8.1 надёжно отрисовывает только 1–3 слова в кавычках. UI-мокапы и плотные инфографики — не для этой модели.",
      },
      {
        q: "Поддерживает ли Opten Midjourney 8.1?",
        a: "Да, расширение Opten автоматически распознаёт V8.1 и проверяет специфику этой версии: отсутствие удалённых параметров (`--no`, `--ow`, `--p 0`, `--hd` как флага), наличие anti-bokeh stack для iPhone/documentary сцен, использование `--raw` под фотореализм, корректные дефолтные параметры (`--s 100` для photorealism, `--s 250` для stylized). Одним кликом получаешь rewrite в формате Dan Kieft v3.",
      },
    ],
  },
  en: {
    title: "Midjourney 8.1 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Midjourney V8.1 Alpha: removed parameters (--no, --ow, --p 0), anti-bokeh stack, --raw, native 2K, and before/after examples.",
    h1: "Midjourney 8.1: how to write prompts the model actually understands",
    intro:
      "Midjourney V8.1 Alpha is the V8 upgrade, available only on alpha.midjourney.com (no Discord). Main shifts: HD is now default (the --hd flag is gone), parameters `--no`, `--ow`, `--p 0` are removed, image references load only via UI slots. The model interprets even more literally than V8 and has strong baked-in bokeh that requires an anti-bokeh stack for documentary realism.",
    sections: [
      {
        heading: "What changed in V8.1",
        body:
          "V8.1 is not a separate product — it's an upgrade to V8. But Midjourney removed several parameters that used to work, which is critical for prompt scoring.\n\nRemoved: `--no` (negatives — describe positively now), `--ow` (omni-weight — no replacement), `--p 0` (disabling personalization — UI only now). Midjourney's error message: `--no is not compatible with --version 8.1`. If a V8.1 prompt contains `--no`, `--ow`, or `--p 0`, that's mistake #1 for immediate flagging.\n\nHD is default — the `--hd` flag is no longer needed; native 2K is included by default. Image references load only via 3 UI slots: Start Frame, Image Prompts, Style References. The safe set of working parameters is `--raw`, `--s`, `--ar`, `--c`, `--q`.",
        bullets: [
          "Removed: --no, --ow, --p 0 (do not work in V8.1)",
          "HD by default — the --hd flag is gone",
          "Image references only via UI slots, not parameters",
          "Web only (alpha.midjourney.com) — Discord not supported",
          "Anti-bokeh stack required for documentary realism",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "V8.1 rewards coherent cinematic descriptions, not tag lists. A 60–140-word paragraph that reads like a director briefing a cinematographer.\n\nElement order: 1) Shot type + subject («Candid iPhone close-up of a woman in her 20s…»), 2) Specific physical details — what makes her her, not a generic «woman», 3) Wardrobe + props — materials, condition, wear, 4) Action / expression — a concrete moment, 5) Camera angle and lens feel — one short technical anchor, 6) Light + setting — source, direction, atmosphere, 7) Finishing texture — skin / grain / realism cue at the end.\n\nAfter the prompt — a separate parameter block for V8.1. Core rules: state lighting explicitly, write coherent descriptions, add camera and lens, lock `--ar` from the start.",
      },
      {
        heading: "Parameter defaults by category",
        body:
          "Ready-made baselines (Dan Kieft v3): Photorealism / documentary / cinematic action — `--raw --s 100 --ar 16:9`. Editorial portraits / fashion — `--s 100 --ar 16:9` without `--raw`. Stylized illustration / anime / cyberpunk — `--s 250 --ar 16:9` without `--raw`. Movie posters — `--s 250 --ar 2:3` without `--raw`. Fantasy character close-ups (grounded) — `--raw --s 100`; (stylized) — `--s 250` without `--raw`.\n\n`--raw` disables Midjourney's house-style treatment (boosted contrast, warm color grade, polished glow). It makes the result more prompt-faithful. Use it for photorealism, documentary, product work. Do NOT use it for stylized illustration, fantasy art, editorial fashion, movie posters — categories that benefit from house-style.\n\n`--s` (stylize): 100 (default) for balance, 250 for noticeably more stylized illustration, 500–750 for maximum artistic interpretation and prompt drift.",
      },
      {
        heading: "Anti-bokeh stack",
        body:
          "V8.1 has strong baked-in bokeh — the model almost always adds shallow depth of field on close-ups. For iPhone realism or documentary photography this kills authenticity: iPhone sensors are small and naturally deep-focus; there's no real bokeh (Portrait Mode is a software fake).\n\nAnti-bokeh stack — 3–4 phrases at once: «Deep focus, sharp from foreground to background. No blur, no bokeh, no depth-of-field separation. Shot on 24mm lens at f/11. Natural deep depth of field of an iPhone. Hyperfocal deep focus, sharp throughout entire frame.» One phrase is not enough — V8.1 will ignore it.\n\nCritical exception: in action cinema (battle scenes, charging POV, mid-combat) shallow depth of field on the hero with soft chaos behind is correct — that's how prestige cinema actually shoots these scenes (Last Samurai, Gladiator, Pelennor Fields). Don't fight bokeh in action cinema; fight it in static realism.",
      },
      {
        heading: "Multi-reference rules",
        body:
          "In V8.1, image references load only via the UI: 3 slots — Start Frame, Image Prompts, Style References. When 8+ references are loaded, the rules change.\n\n1) Reference, don't re-describe: «He wears the field jacket from the reference» beats «an olive green canvas field jacket with leather collar and four utility pockets». 2) Place each reference: «The camera hangs in his right hand. The bag is across his shoulder. The compass clipped to his belt.» Each reference gets a slot in the scene. 3) Avoid clutter language — don't try to «justify» each reference with art-speak. 4) Drop references with no testable value — if you can't place it clearly, the model will ignore it anyway. 5) At 12+ references expect partial failure — plan so that 2–3 most important ones land cleanly.",
      },
    ],
    examples: [
      {
        before:
          "iPhone selfie of a woman in subway --no blur, bokeh, depth of field --v 8.1",
        after:
          "iPhone selfie photograph of a young woman in her early 20s sitting on a bench in a busy New York City subway station, holding her iPhone at arm's length. Front camera perspective, slightly elevated angle. She wears a soft pink leotard, dark hair in a tight bun. Around her, the busy NYC subway, white tile walls, fluorescent overhead lighting. The natural deep depth of field of an iPhone front camera, everything in sharp clear focus, no blur or bokeh, no portrait mode effect. Hyper-realistic skin texture, raw unfiltered iPhone photography aesthetic. --raw --s 100 --ar 16:9",
        note:
          "In V8.1 `--no` doesn't work (mistake #1). The fix: anti-bokeh stack (3–4 phrases) as positive description. Parameters at the end — `--raw --s 100 --ar 16:9` (Dan Kieft default for photorealism).",
      },
      {
        before:
          "cyberpunk anime girl in neon alley",
        after:
          "Stylized anime cyberpunk illustration in the visual style of Arcane, Cyberpunk Edgerunners, and Blade Runner Black Lotus, mid-shot of a stylish cyberpunk woman leaning against a graffiti-covered wall in a narrow rain-soaked neon alleyway, smoking a cigarette with a contemplative expression. Long straight white hair with blunt bangs, sharp angular jawline, large striking cyan eyes. Neon-lit skyscrapers, wet pavement reflecting saturated red and pink neon glow. Painterly digital illustration with visible brush strokes, anime-stylized proportions. --s 250 --ar 16:9",
        note:
          "Stylized illustration sweet spot for V8.1: `--s 250` without `--raw`. Genre anchors (Arcane, Cyberpunk Edgerunners) give the model a sharp style target. Concrete character details (white hair, blunt bangs, cyan eyes) — V8.1's literal interpretation executes them exactly.",
      },
      {
        before:
          "horror movie poster of a girl in hallway",
        after:
          "Cinematic horror movie poster artwork, vertical composition, a small girl about seven years old walking slowly forward down the middle of an enormous long empty hallway of an old turn-of-the-century gothic mansion, viewed from far behind her at floor level. She wears a long pale Victorian-era white nightgown, dragging a worn old teddy bear. The hallway stretches into deep darkness with peeling wallpaper, dust motes in pale window light. At the very far end, a tall thin shadowy figure stands watching her. Cool desaturated palette, the look of a prestige A24 horror poster. Significant negative space at top for typography. --s 250 --ar 2:3",
        note:
          "Movie poster paradigm: `--s 250 --ar 2:3` (vertical format for typography). A24 aesthetic anchor, restraint in revealing the monster, explicit mention of negative space for future text.",
      },
    ],
    mistakes: [
      {
        title: "Using --no in V8.1",
        explain:
          "The `--no` parameter is removed in V8.1 — the model returns the error «--no is not compatible with --version 8.1». Replace it with positive description: instead of «--no clutter» write «clean background, minimal props». This is the most common mistake in prompts after the V8.1 update.",
      },
      {
        title: "Using removed --ow and --p 0 parameters",
        explain:
          "`--ow` (omni-weight) and `--p 0` (disabling personalization) are removed in V8.1. No replacement — describe without omni-weight, manage personalization via the UI Style Creator. If copying a prompt from V8, check for these flags and strip them.",
      },
      {
        title: "Using --hd as a flag in V8.1",
        explain:
          "HD is the default in V8.1; the `--hd` flag is unnecessary — native 2K is included by default. The cost has risen relative to V8 base, but that's baked into the default mode now. Specifying `--hd` won't throw an error but has no effect.",
      },
      {
        title: "Anti-bokeh stack in action scenes",
        explain:
          "In action cinema (battle, mid-charge, POV) shallow depth of field on the hero is correct cinematography, not a bug — that's how prestige cinema shoots these scenes. Stacking anti-bokeh in an action scene fights the correct effect. Anti-bokeh is for iPhone realism and static documentary, not cinematic action.",
      },
      {
        title: "Tag-soup style (comma-separated words)",
        explain:
          "V8.1 interprets the prompt even more literally than V8 — a list of comma-separated words produces chaos. Write coherent cinematic descriptions of 60–140 words. One paragraph, like a director briefing a cinematographer, in the order: shot type + subject → details → wardrobe → action → camera → light → texture.",
      },
    ],
    faq: [
      {
        q: "How is V8.1 different from V8?",
        a: "V8.1 is an upgrade to V8, not a separate product. Main shifts: parameters `--no`, `--ow`, `--p 0` are removed; HD is default (the `--hd` flag is gone); image references load only via UI slots, not parameters; interpretation is even more literal; baked-in bokeh is stronger. The safe set of working parameters is `--raw`, `--s`, `--ar`, `--c`, `--q`.",
      },
      {
        q: "What parameters are recommended for photorealism in V8.1?",
        a: "Baseline for photorealism, documentary, and cinematic action is `--raw --s 100 --ar 16:9` (Dan Kieft v3 default). `--raw` disables Midjourney's house-style treatment (polished glow, warm color grade) and makes the result more prompt-faithful. For iPhone realism you additionally need an anti-bokeh stack of 3–4 phrases inside the prompt.",
      },
      {
        q: "What is the anti-bokeh stack and when do I use it?",
        a: "V8.1 has strong baked-in bokeh — it almost always adds shallow depth of field on close-ups. For iPhone realism and documentary style this kills authenticity. The anti-bokeh stack is 3–4 phrases at once: «Deep focus», «No blur, no bokeh», «Shot on 24mm lens at f/11», «Natural deep depth of field of an iPhone». One phrase V8.1 will ignore. Do NOT use anti-bokeh in action scenes — there shallow DoF is correct.",
      },
      {
        q: "How do I replace --no in V8.1?",
        a: "Describe positively. Instead of «--no clutter» write «clean background, minimal props». Instead of «--no text, watermark» — «no text in the image» inside the prompt or «empty surface, no signage». Instead of «--no bokeh» — an anti-bokeh stack of multiple phrases. It takes more words, but V8.1 responds reliably to positive descriptions.",
      },
      {
        q: "When should I use `--raw` versus skipping it?",
        a: "With `--raw`: photorealism, documentary, cinematic action, product photography, grounded fantasy close-ups — categories where the prompt should dominate over house-style. Without `--raw`: stylized illustration, editorial portraits, fantasy art, movie posters, anime, cyberpunk — categories that benefit from Midjourney's polished default style.",
      },
      {
        q: "Is V8.1 good for in-image text or UI mockups?",
        a: "No, for text-heavy tasks V8.1 is noticeably weaker than GPT Image 2 and Nano Banana Pro. Long captions, infographics, multi-language text — switch to a specialized model. V8.1 only reliably renders 1–3 words wrapped in quotes. UI mockups and dense infographics are not for this model.",
      },
      {
        q: "Does Opten support Midjourney 8.1?",
        a: "Yes, the Opten extension auto-detects V8.1 and checks this version's specifics: absence of removed parameters (`--no`, `--ow`, `--p 0`, `--hd` as a flag), presence of an anti-bokeh stack for iPhone/documentary scenes, use of `--raw` for photorealism, correct default parameters (`--s 100` for photorealism, `--s 250` for stylized). One click gives you a rewrite in Dan Kieft v3 format.",
      },
    ],
  },
};
