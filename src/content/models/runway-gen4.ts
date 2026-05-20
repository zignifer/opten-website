// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for runway-gen4.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Runway Gen-4: структура, ошибки, примеры",
    description:
      "Как писать промпты для Runway Gen-4: image-to-video режим, описание движения и камеры, типичные ошибки, примеры до/после, сравнение с Gen-4 Turbo и cost-логика.",
    h1: "Runway Gen-4: как писать промпты, которые модель понимает",
    intro:
      "Runway Gen-4 — image-to-video модель от Runway с нативным 720p (апскейл до 4K) и длительностью 5 или 10 секунд. Без входного изображения генерация невозможна — это I2V-only. Промпт описывает ТОЛЬКО движение и камеру, визуал берётся из референса. Негативные промпты и JSON игнорируются.",
    sections: [
      {
        heading: "Что умеет Runway Gen-4",
        body:
          "Gen-4 — это специализированная I2V-модель: ей всегда нужно входное изображение, описание сцены строить не нужно — оно уже зафиксировано в кадре. Сильная сторона — кинематографические камерные движения и анимация статичных фото с тонкими физическими деталями (волосы на ветру, складки ткани, лёгкие жесты).\n\nGen-4 Turbo — облегчённый вариант 5 кредитов/сек вместо 12. Используется для прототипирования и быстрых итераций, дальше финальный рендер уже на полном Gen-4. Промпты для Turbo допускают чуть меньше деталей.",
        bullets: [
          "Image-to-Video only — без референса генерация не запускается",
          "720p нативно, апскейл до 4K на финальном этапе",
          "Длительность 5 или 10 секунд (выбор фиксированный)",
          "12 кредитов/сек (Gen-4) или 5 кредитов/сек (Gen-4 Turbo)",
          "Не поддерживает негативные промпты и JSON-форматирование",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Поскольку визуал уже задан изображением, промпт описывает только движение. Базовая формула — [Камерное движение]: [субъект] [действие]. [Дополнительные детали движения].\n\nОптимальная длина — 10–30 слов. Короткий промпт (10–15 слов) часто работает лучше длинного — Runway официально пишет: «Clarity matters more than structure». Никаких приветствий, объяснений, JSON, команд в духе «add rain».\n\nАктивные глаголы в настоящем времени: «walks», «pulls back», «rotates slowly». Лучше одно чёткое камерное движение, чем несколько одновременных — Gen-4 плохо справляется с комбинацией zoom + pan + orbit в одной сцене.",
      },
      {
        heading: "Словарь камерных движений",
        body:
          "Gen-4 хорошо понимает стандартный кинематографический лексикон, потому что он буквально взят из учебных данных. Базовые движения: dolly in/out, truck left/right, pan left/right, tilt up/down. Сложные: crane shot, arc shot, whip pan, crash zoom, push-in, pull-out. Стиль камеры: handheld, steadicam, gimbal, smooth tracking, static.\n\nЗадавай одно главное движение и опционально модификатор скорости — «slowly», «suddenly», «gradually». Это даёт контроль над темпом, не перегружая модель.",
      },
      {
        heading: "Turbo vs Gen-4: когда использовать что",
        body:
          "Turbo стоит 5 кредитов/сек и быстрее — идеально для проб камерных движений, исследования вариаций, A/B-теста идей. Полный Gen-4 — финальный рендер, когда movement и тайминг уже подтверждены.\n\nПрактический пайплайн: 3–5 итераций на Turbo (40–50 кредитов на 10-секундный клип), затем один финальный рендер на Gen-4 (120 кредитов). Это в 2–3 раза экономнее, чем итерировать сразу на полной модели. Для production-кампаний с десятками клипов разница в бюджете существенная.",
      },
      {
        heading: "Чего НЕ нужно делать",
        body:
          "Главная ошибка новичков — описывать то, что уже видно на референсе: «a woman in a red dress standing in a park». Это пустая трата токенов и иногда вызывает конфликт с реальным изображением. Опиши только что меняется: «The woman tilts her head and smiles. Camera dollies in slowly.»\n\nНегативные промпты не работают — «no clouds» может произвести облака. JSON, командные конструкции («add rain», «remove the hat»), разговорный стиль («пожалуйста, сделай») — всё это игнорируется или попадает в шум. Опиши только желаемый результат позитивно.",
      },
    ],
    examples: [
      {
        before:
          "красивое видео с этим фото где девушка в красном платье стоит в парке и улыбается, добавь движение",
        after:
          "Slow dolly-in toward the subject. The woman gently tilts her head and smiles softly. Subtle hair movement in the breeze. Smooth tracking, cinematic pacing.",
        note: "Старая версия описывает референс (платье, парк), новая — только движение и камеру. Активные глаголы в настоящем времени, одно камерное движение, мягкие физические детали.",
      },
      {
        before:
          "сделай динамичное видео продукта с разных ракурсов",
        after:
          "Slow orbital arc shot around the product, 180-degree sweep. Subtle product highlights catch the light as the camera moves. Smooth steadicam motion, no jitter.",
        note: "Конкретное камерное движение (orbital arc, 180°) вместо размытого «с разных ракурсов». Указан тип стабилизации — это даёт чистый коммерческий рендер вместо «дёрганого» результата.",
      },
      {
        before:
          "оживи портрет, добавь эмоции, без размытия фона",
        after:
          "Slight head turn to the left. The subject blinks once, then breaks into a soft smile. Static camera, shallow depth maintained on the eyes.",
        note: "Убран негативный промпт «без размытия» — он не работает в Gen-4. Заменён на позитивную инструкцию «shallow depth maintained». Микрожесты (blink, smile) — сильная сторона I2V.",
      },
    ],
    mistakes: [
      {
        title: "Запуск без входного изображения",
        explain:
          "Gen-4 — это I2V-only модель, без референса генерация физически невозможна. Это не баг и не workaround — архитектура модели не содержит T2V-режима. Если нужен text-to-video на Runway, бери Gen-4.5. Перед запуском всегда проверяй, что в Generation Settings есть изображение.",
      },
      {
        title: "Описание сцены вместо движения",
        explain:
          "Промпт «a woman in a red dress in a park, sunset, beautiful» бесполезен — вся эта информация уже на референсе. Промпт должен начинаться с глагола движения или с типа камерного хода. Сцена задана картинкой, твой промпт — это инструкция оператору, что снимать дальше.",
      },
      {
        title: "Негативные промпты",
        explain:
          "«No clouds», «no blur», «without text» в Gen-4 могут произвести именно то, что просили исключить — модель видит «clouds», «blur», «text» и иногда генерирует их. Описывай только желаемое позитивно: вместо «no fast motion» пиши «slow, deliberate movement».",
      },
      {
        title: "Несколько камерных движений одновременно",
        explain:
          "«Pan left while zooming in and rotating» Gen-4 переварит криво — получится дрейф камеры без чёткого направления. Выбирай одно главное движение (dolly in ИЛИ pan ИЛИ orbit) и опционально модификатор скорости. 5–10 секунд — не время для сложной раскадровки.",
      },
      {
        title: "JSON-форматирование и командный стиль",
        explain:
          "Структуры вида `{\"camera\": \"dolly\", \"subject\": \"woman\"}` или команды «add rain», «remove the hat» Runway игнорирует — это не command-driven модель. Пиши естественным языком, полными предложениями: «Light rain begins to fall as the camera slowly pulls back.»",
      },
    ],
    faq: [
      {
        q: "Можно ли использовать Gen-4 без входного изображения?",
        a: "Нет, Gen-4 — это image-to-video only модель, входное изображение обязательно. Архитектура не содержит T2V-режима. Если нужен полноценный text-to-video, бери Runway Gen-4.5 — это первая модель Runway с самостоятельным T2V плюс I2V. Gen-4 хорош именно для оживления статичных фото и анимации продуктовых референсов.",
      },
      {
        q: "Чем Gen-4 отличается от Gen-4 Turbo?",
        a: "Turbo стоит 5 кредитов/сек против 12 у полного Gen-4, генерирует быстрее, но качество чуть ниже на сложных физических деталях. Используй Turbo для прототипирования и пробы камерных движений, финальный рендер — на Gen-4. Промпты для обеих версий идентичны по структуре, разница только в кредитах и финальном качестве.",
      },
      {
        q: "Какой длины должен быть промпт для Gen-4?",
        a: "Оптимально 10–30 слов. Runway официально пишет «Clarity matters more than structure» — короткий чёткий промпт часто работает лучше длинного с десятком уточнений. 5–10 секунд клипа просто не вместят сложную раскадровку, так что лишние детали либо игнорируются, либо вызывают drift камеры.",
      },
      {
        q: "Поддерживает ли Gen-4 негативные промпты?",
        a: "Нет, негативные промпты Gen-4 не поддерживает — это документированное ограничение. Конструкции «no rain», «without text», «avoid blur» могут сработать наоборот: модель видит ключевые слова и иногда генерирует именно то, что просили исключить. Описывай желаемое позитивно — «clear sky», «empty signage», «sharp focus».",
      },
      {
        q: "Какое разрешение и длительность доступны?",
        a: "Нативное разрешение — 720p, апскейл до 4K делается на финальном этапе. Длительность фиксированная: 5 или 10 секунд, промежуточных значений нет. Для более длинных нарративов нужно собирать клип из нескольких генераций или использовать Gen-4.5 с гибкой длительностью 2–10 секунд и timestamp-синтаксисом.",
      },
      {
        q: "Можно ли через промпт менять одежду или объекты на референсе?",
        a: "Нет, Gen-4 не редактирует визуал референса — это не edit-модель. Команды «change the dress to blue», «add a hat» либо игнорируются, либо ломают консистентность. Для замены объектов на референсе нужен image edit (например, GPT Image 2 или Flux Kontext), а уже отредактированное изображение подавать как вход в Gen-4.",
      },
      {
        q: "Поддерживается ли Opten для Runway Gen-4?",
        a: "Да, расширение Opten автоматически распознаёт Runway внутри runwayml.com и оценивает промпты по структуре, специфичной для Gen-4: проверяет наличие движения и камерной директивы, отсутствие негативных конструкций и описания референса, длину промпта в оптимальном диапазоне 10–30 слов. Одним кликом получаешь rewrite в правильной I2V-структуре.",
      },
    ],
  },
  en: {
    title: "Runway Gen-4 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Runway Gen-4: image-to-video only mode, movement and camera language, common mistakes, before/after examples, and Turbo vs full Gen-4.",
    h1: "Runway Gen-4: how to write prompts the model actually understands",
    intro:
      "Runway Gen-4 is an image-to-video model from Runway with native 720p (upscale to 4K) and a fixed duration of 5 or 10 seconds. Generation cannot run without an input image — Gen-4 is I2V-only. The prompt describes ONLY movement and camera; the visual is locked by the reference. Negative prompts and JSON are ignored.",
    sections: [
      {
        heading: "What Runway Gen-4 does well",
        body:
          "Gen-4 is a dedicated I2V model: it always needs an input image, and you don't have to describe the scene — that's already fixed in the frame. Strengths are cinematic camera moves and animating still photos with subtle physical detail (hair in a breeze, fabric folds, small gestures).\n\nGen-4 Turbo is the lighter tier at 5 credits/sec instead of 12. Use it for prototyping and quick iteration, then finalize on full Gen-4. Turbo tolerates slightly less detailed prompts.",
        bullets: [
          "Image-to-Video only — no reference, no generation",
          "720p native, upscale to 4K at the final step",
          "Duration 5 or 10 seconds (fixed choices)",
          "12 credits/sec (Gen-4) or 5 credits/sec (Gen-4 Turbo)",
          "No support for negative prompts or JSON formatting",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Because the visual is already set by the image, the prompt describes movement only. The base formula is [Camera movement]: [subject] [action]. [Additional motion details].\n\nOptimal length is 10–30 words. A short prompt (10–15 words) often beats a long one — Runway officially says: «Clarity matters more than structure». No greetings, explanations, JSON, or commands like «add rain».\n\nActive verbs in present tense: «walks», «pulls back», «rotates slowly». One clear camera move beats several simultaneous ones — Gen-4 struggles with zoom + pan + orbit combinations in a single scene.",
      },
      {
        heading: "Camera vocabulary",
        body:
          "Gen-4 understands the standard cinematic lexicon well because it was literally pulled from the training data. Basic moves: dolly in/out, truck left/right, pan left/right, tilt up/down. Advanced: crane shot, arc shot, whip pan, crash zoom, push-in, pull-out. Camera style: handheld, steadicam, gimbal, smooth tracking, static.\n\nSet one main move plus an optional speed modifier — «slowly», «suddenly», «gradually». This controls pacing without overloading the model.",
      },
      {
        heading: "Turbo vs Gen-4: when to use which",
        body:
          "Turbo costs 5 credits/sec and renders faster — ideal for trying camera moves, exploring variations, A/B-testing ideas. Full Gen-4 is the final render once the movement and timing are confirmed.\n\nPractical pipeline: 3–5 iterations on Turbo (40–50 credits for a 10-second clip), then one final render on Gen-4 (120 credits). That's 2–3× cheaper than iterating directly on the full model. For production campaigns with dozens of clips the budget difference adds up fast.",
      },
      {
        heading: "What NOT to do",
        body:
          "The classic beginner mistake is describing what's already visible in the reference: «a woman in a red dress standing in a park». That wastes tokens and sometimes conflicts with the actual image. Describe only what changes: «The woman tilts her head and smiles. Camera dollies in slowly.»\n\nNegative prompts don't work — «no clouds» can produce clouds. JSON, command syntax («add rain», «remove the hat»), conversational style («please make…») — all of that is ignored or ends up as noise. Describe the desired result positively.",
      },
    ],
    examples: [
      {
        before: "make a nice video with this photo where the woman in red is in the park smiling, add some motion",
        after:
          "Slow dolly-in toward the subject. The woman gently tilts her head and smiles softly. Subtle hair movement in the breeze. Smooth tracking, cinematic pacing.",
        note: "The old version describes the reference (dress, park); the new one describes only movement and camera. Active verbs in present tense, one camera move, soft physical detail.",
      },
      {
        before: "make a dynamic product video from different angles",
        after:
          "Slow orbital arc shot around the product, 180-degree sweep. Subtle product highlights catch the light as the camera moves. Smooth steadicam motion, no jitter.",
        note: "A concrete camera move (orbital arc, 180°) instead of vague «different angles». Stabilization is specified — this yields a clean commercial render instead of jittery output.",
      },
      {
        before: "bring this portrait to life, add emotion, no background blur",
        after:
          "Slight head turn to the left. The subject blinks once, then breaks into a soft smile. Static camera, shallow depth maintained on the eyes.",
        note: "Removed the negative «no blur» — it doesn't work in Gen-4. Replaced with positive «shallow depth maintained». Micro-gestures (blink, smile) are a strength of I2V.",
      },
    ],
    mistakes: [
      {
        title: "Running without an input image",
        explain:
          "Gen-4 is an I2V-only model — generation is physically impossible without a reference. This is not a bug or a workaround target; the architecture has no T2V mode. If you need text-to-video on Runway, use Gen-4.5. Always confirm there's an image attached in Generation Settings before launching.",
      },
      {
        title: "Describing the scene instead of the movement",
        explain:
          "A prompt like «a woman in a red dress in a park, sunset, beautiful» is useless — that information is already in the reference. The prompt should start with a movement verb or a camera move type. The scene is locked by the image; your prompt is the operator's instruction for what to shoot next.",
      },
      {
        title: "Negative prompts",
        explain:
          "«No clouds», «no blur», «without text» in Gen-4 can produce exactly what you tried to exclude — the model sees «clouds», «blur», «text» as tokens and sometimes generates them. Describe what you want positively: instead of «no fast motion» write «slow, deliberate movement».",
      },
      {
        title: "Multiple camera moves at once",
        explain:
          "«Pan left while zooming in and rotating» comes out as undirected camera drift in Gen-4. Pick one main move (dolly in OR pan OR orbit) plus an optional speed modifier. Five to ten seconds is not enough screen time for complex blocking — the model can't fit it cleanly.",
      },
      {
        title: "JSON formatting and command-style prompts",
        explain:
          "Structures like `{\"camera\": \"dolly\", \"subject\": \"woman\"}` or commands like «add rain», «remove the hat» are ignored by Runway — it's not a command-driven model. Write in natural language, full sentences: «Light rain begins to fall as the camera slowly pulls back.»",
      },
    ],
    faq: [
      {
        q: "Can I use Gen-4 without an input image?",
        a: "No, Gen-4 is image-to-video only — the input image is mandatory. The architecture has no T2V mode. If you need full text-to-video, use Runway Gen-4.5, which is Runway's first model with native T2V plus I2V. Gen-4 shines at animating still photos and product references where the visual is already nailed.",
      },
      {
        q: "What's the difference between Gen-4 and Gen-4 Turbo?",
        a: "Turbo costs 5 credits/sec versus 12 for full Gen-4, renders faster, and is slightly weaker on complex physical detail. Use Turbo for prototyping and trying camera moves, then render the final pass on Gen-4. The prompt structure is identical for both versions — only credits and final quality differ.",
      },
      {
        q: "How long should a Gen-4 prompt be?",
        a: "Sweet spot is 10–30 words. Runway officially says «Clarity matters more than structure» — a short, sharp prompt often beats a long one stuffed with qualifiers. A 5–10 second clip simply can't fit complex blocking, so extra detail either gets ignored or causes camera drift.",
      },
      {
        q: "Does Gen-4 support negative prompts?",
        a: "No, negative prompts are not supported — that's a documented limitation. Constructs like «no rain», «without text», «avoid blur» can backfire: the model sees the keywords and sometimes generates exactly what you wanted excluded. Describe the desired state positively — «clear sky», «empty signage», «sharp focus».",
      },
      {
        q: "What resolution and duration are available?",
        a: "Native resolution is 720p with optional upscale to 4K at the final step. Duration is fixed at 5 or 10 seconds — no intermediate values. For longer narratives you need to stitch multiple generations or switch to Gen-4.5, which offers flexible 2–10 second duration and timestamp syntax for sequential beats.",
      },
      {
        q: "Can I change outfits or objects on the reference via prompt?",
        a: "No, Gen-4 does not edit the reference visual — it's not an edit model. Commands like «change the dress to blue» or «add a hat» are either ignored or break consistency. To swap objects in the reference, run an image edit first (GPT Image 2 or Flux Kontext) and feed the edited image into Gen-4 as the input.",
      },
      {
        q: "Does Opten support Runway Gen-4?",
        a: "Yes, the Opten extension auto-detects Runway inside runwayml.com and scores prompts against the structure specific to Gen-4: it checks for movement and a camera directive, the absence of negative constructions and reference descriptions, and prompt length in the optimal 10–30 word range. One click gives you a rewrite in the right I2V structure.",
      },
    ],
  },
};
