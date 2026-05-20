// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for runway-gen4.5.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Runway Gen-4.5: структура, ошибки, примеры",
    description:
      "Как писать промпты для Runway Gen-4.5: text-to-video и image-to-video, timestamp-синтаксис по секундам, гибкая длительность 2–10с, типичные ошибки и примеры.",
    h1: "Runway Gen-4.5: как писать промпты, которые модель понимает",
    intro:
      "Runway Gen-4.5 — первая модель Runway с полноценным text-to-video плюс image-to-video в одной архитектуре. Autoregressive-to-Diffusion даёт заметно улучшенную физику воды, ткани и инерции, гибкую длительность от 2 до 10 секунд и уникальный timestamp-синтаксис для последовательных beat'ов внутри одного клипа. Негативные промпты и JSON по-прежнему не работают.",
    sections: [
      {
        heading: "Что нового в Gen-4.5",
        body:
          "Главное отличие от Gen-4 — самостоятельный T2V-режим. Сцена строится прямо из текста, без обязательного референса. При этом I2V тоже на месте и работает по тем же правилам, что и в Gen-4: описывай только движение.\n\nВторое отличие — гибкая длительность от 2 до 10 секунд (не только 5 или 10), плюс выбор 24 или 25 fps. Третье — timestamp-синтаксис вида `[00:01]`, `[00:03]`, который позволяет режиссировать последовательные действия с точностью до секунды. И четвёртое — заметно улучшенная физика жидкостей, ткани и моментум: всплеск воды, развевающаяся ткань, падающая пыль выглядят убедительнее, чем в Gen-4.",
        bullets: [
          "T2V + I2V в одной модели — выбор по сценарию",
          "Гибкая длительность 2–10 секунд (24 или 25 fps)",
          "Timestamp-синтаксис: `[00:01]`, `[00:03]` для секундных таймкодов",
          "Улучшенная физика воды, ткани, частиц",
          "T2V aspect: только 1280:720 и 720:1280; I2V — много вариантов",
        ],
      },
      {
        heading: "Структура промпта для T2V",
        body:
          "В T2V-режиме нужно описать всю сцену: камера, субъект, действие, среда. Базовая формула — [Camera] shot of [subject] [action] in [environment]. [Supporting descriptions].\n\nОптимально начинать с типа кадра и движения камеры: «Wide tracking shot of a runner sprinting across a misty beach at sunrise.» Это сразу задаёт композицию. Среда даёт модели нужный mood — освещение, атмосферу, текстуры.\n\nМаксимум промпта неофициально — около 1 800 символов. Естественный язык работает лучше, чем теги или JSON. Активные глаголы в настоящем времени, конкретные физические детали типа «water splashing», «fabric draping», «dust settling».",
      },
      {
        heading: "Структура промпта для I2V",
        body:
          "В I2V-режиме правила те же, что и в Gen-4: входное изображение задаёт визуал, промпт описывает ТОЛЬКО движение. Не нужно описывать платье, парк, освещение — это уже на референсе. Просто скажи, что должно двигаться и как ходит камера.\n\nОптимальная длина для I2V-промпта — 10–30 слов. Если описывать содержимое референса, это тратит токены и иногда конфликтует с реальным изображением. Активные глаголы, одно главное камерное движение, опциональный модификатор скорости — «slowly», «gradually», «suddenly».",
      },
      {
        heading: "Timestamp-синтаксис для последовательных сцен",
        body:
          "Уникальная фича Gen-4.5 — режиссура по таймкодам. Формат: `[00:01] action`, `[00:03] next action`. Это лучший способ выстроить мини-нарратив из нескольких действий внутри 5–10 секундного клипа.\n\nКлючевое правило — таймкоды должны быть реалистичны. «Ходьба через комнату за 0.5 секунды» физически невозможна, и модель попытается это нарушить либо испортит динамику. Давай достаточно времени между beat'ами: 2–3 секунды на полноценное действие, 1 секунда — для короткого жеста или смены кадра.\n\nПример: `[00:01] A bird takes off from a branch. [00:03] It soars over a misty valley. [00:06] Camera pulls back to reveal the full mountain range.`",
      },
      {
        heading: "Чего НЕ нужно делать",
        body:
          "Негативные промпты не работают — «no clouds», «without text» могут произвести именно то, что просили исключить. JSON-форматирование (`{\"camera\": \"...\"}`) игнорируется. Командный стиль («add rain», «remove the hat») тоже — Gen-4.5 не command-driven модель.\n\nВ I2V-режиме не описывай содержимое референса — это тратит контекст и иногда вызывает drift. В T2V не смешивай несколько aspect ratios в одном запросе: T2V поддерживает только 1280:720 и 720:1280. Нереалистичные таймкоды (плотные beat'ы по 0.5 секунды) ломают темп — давай движению дышать.",
      },
    ],
    examples: [
      {
        before:
          "красивое кинематографичное видео заката над океаном с волнами",
        after:
          "Wide cinematic shot of waves rolling onto a black sand beach at sunset. Slow dolly-in toward the foam line. Warm orange and deep purple sky reflected on the wet sand. Soft, deliberate pacing, natural light, 24fps.",
        note: "T2V-промпт строит всю сцену: тип кадра, среда, движение камеры, цветовая палитра, fps. Активные глаголы в настоящем времени, никаких метафор.",
      },
      {
        before:
          "оживи это фото и сделай что-нибудь драматичное",
        after:
          "Slow push-in toward the subject. Wind picks up gradually, lifting her hair and the edges of her coat. Camera stays steady, shallow depth maintained on the eyes.",
        note: "I2V-режим — промпт описывает только движение и атмосферу, не содержимое референса. Физические детали (wind lifting hair, coat edges) дают убедительный мини-сюжет в 5 секундах.",
      },
      {
        before:
          "видео где человек заходит в кафе и садится за столик",
        after:
          "[00:01] Wide shot, a man pushes open the cafe door, late afternoon light streaming in. [00:04] He walks across the wooden floor toward a corner table. [00:07] He pulls out the chair and sits down, exhales slowly. Camera follows at chest height, smooth steadicam.",
        note: "Timestamp-синтаксис разбивает 10-секундный нарратив на три beat'а с реалистичным таймингом — 3 секунды на каждое действие. Это сильная сторона именно Gen-4.5.",
      },
    ],
    mistakes: [
      {
        title: "Смешение T2V и I2V логики",
        explain:
          "В T2V нужно описать всю сцену, в I2V — только движение. Если в I2V описать «a woman in red in a park» — модель будет сопоставлять текст с референсом и иногда дрейфовать. Если в T2V забыть среду и субъект — получится «just a camera move» без содержимого. Понимай, в каком режиме работаешь, и пиши соответственно.",
      },
      {
        title: "Нереалистичные таймкоды",
        explain:
          "`[00:01] walks across the room [00:02] sits down [00:03] picks up the cup` — это нереалистично для 3 секунд экранного времени. Модель либо ускорит движение до неестественного, либо проигнорирует часть beat'ов. Дай каждому действию 2–3 секунды дыхания, коротким жестам — 1 секунду.",
      },
      {
        title: "Негативные промпты",
        explain:
          "Gen-4.5 не поддерживает негативные промпты — это документированное ограничение. «No clouds» может вызвать облака, «without text» — добавить текст. Описывай желаемое позитивно: вместо «no fog» пиши «clear visibility», вместо «no jitter» — «smooth steadicam motion».",
      },
      {
        title: "Aspect ratio mismatch в T2V",
        explain:
          "T2V в Gen-4.5 поддерживает только два соотношения сторон: 1280:720 (landscape) и 720:1280 (portrait). Запросы вида «square 1:1» или «21:9 ultrawide» в T2V не выполнятся. I2V гибче — там много landscape/portrait/square вариантов, потому что aspect берётся из входного изображения.",
      },
      {
        title: "JSON и командный стиль",
        explain:
          "Структуры `{\"camera\": \"dolly\", \"action\": \"walk\"}` или команды «add rain», «remove the hat», «pretend you are a director» Gen-4.5 не понимает. Пиши естественным языком, полными предложениями. Хорошо: «Light rain begins to fall as the camera pulls back.» Плохо: «add: rain. camera: pull back.»",
      },
    ],
    faq: [
      {
        q: "Чем Gen-4.5 отличается от Gen-4?",
        a: "Главных отличий четыре: самостоятельный T2V-режим (Gen-4 только I2V), гибкая длительность 2–10 секунд против фиксированных 5/10, timestamp-синтаксис для секундных таймкодов и заметно улучшенная физика воды, ткани и моментум. Архитектура тоже новая — Autoregressive-to-Diffusion вместо чистой diffusion. Для большинства задач это апгрейд, кроме случаев когда нужна минимальная стоимость на простой I2V.",
      },
      {
        q: "Когда использовать T2V, а когда I2V?",
        a: "T2V — когда сцены ещё нет и хочешь сгенерировать всё из текста: концепт-видео, мини-нарративы, прототипы. I2V — когда есть конкретный референс (продукт, портрет, локация) и нужно его оживить. I2V даёт больше визуального контроля, T2V — больше творческой свободы. На одной модели можно смело комбинировать оба режима в проекте.",
      },
      {
        q: "Как правильно использовать timestamp-синтаксис?",
        a: "Формат `[00:01] action`, `[00:03] next action` с реалистичными таймкодами. Давай каждому полноценному действию 2–3 секунды, коротким жестам — 1 секунду. Не клади больше 3–4 beat'ов на 10-секундный клип. Это инструмент для последовательного нарратива, не для упаковки максимума событий в минимум времени.",
      },
      {
        q: "Какие aspect ratio поддерживаются?",
        a: "В T2V только два варианта: 1280:720 (landscape) и 720:1280 (portrait) — другие соотношения не выполнятся. В I2V гибче: aspect берётся из входного изображения, есть множество landscape, portrait и square опций. FPS на выбор 24 или 25 для обоих режимов.",
      },
      {
        q: "Можно ли превысить 10 секунд за одну генерацию?",
        a: "Нет, лимит одной генерации Gen-4.5 — 10 секунд (минимум 2). Для более длинных нарративов нужно собирать клип из нескольких генераций, используя последний кадр предыдущей как вход в следующую. Это требует ручной работы, но даёт продакшн-уровень нарратива на 30+ секунд.",
      },
      {
        q: "Какой длины должен быть промпт?",
        a: "Для I2V — 10–30 слов, как в Gen-4. Для T2V — длиннее, до 1 800 символов неофициально, потому что нужно описать сцену целиком. Для timestamp-промптов длина естественно растёт за счёт нескольких beat'ов. Главное правило — концентрация смысла, не объём: каждое предложение должно нести физическое или визуальное действие.",
      },
      {
        q: "Поддерживается ли Opten для Runway Gen-4.5?",
        a: "Да, расширение Opten автоматически распознаёт Runway внутри runwayml.com и оценивает промпты по структуре, специфичной для Gen-4.5: проверяет соответствие T2V/I2V режиму, реалистичность таймкодов в timestamp-промптах, отсутствие негативных конструкций и JSON. Одним кликом можно получить rewrite, перестроенный под выбранный режим.",
      },
    ],
  },
  en: {
    title: "Runway Gen-4.5 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Runway Gen-4.5: text-to-video and image-to-video, second-level timestamp syntax, flexible 2–10s duration, mistakes and examples.",
    h1: "Runway Gen-4.5: how to write prompts the model actually understands",
    intro:
      "Runway Gen-4.5 is Runway's first model with full text-to-video alongside image-to-video. The Autoregressive-to-Diffusion architecture improves physics (water, fabric, momentum), supports flexible 2–10 second duration, and adds a unique timestamp syntax for sequential beats. Negative prompts and JSON are not supported.",
    sections: [
      {
        heading: "What's new in Gen-4.5",
        body:
          "The main difference from Gen-4 is native T2V mode. Scenes are built straight from text, no reference required. I2V is still there and follows the same rules as in Gen-4: describe movement only.\n\nSecond, duration is flexible from 2 to 10 seconds (not just 5 or 10), with a choice of 24 or 25 fps. Third, the timestamp syntax `[00:01]`, `[00:03]` lets you direct sequential actions with second-level precision. And fourth, physics for liquids, fabric, and momentum is markedly better — water splashes, flowing fabric, and settling dust look more convincing than in Gen-4.",
        bullets: [
          "T2V + I2V in one model — pick by scenario",
          "Flexible duration 2–10 seconds (24 or 25 fps)",
          "Timestamp syntax: `[00:01]`, `[00:03]` for second-level beats",
          "Better physics for water, fabric, and particles",
          "T2V aspect: only 1280:720 and 720:1280; I2V has many options",
        ],
      },
      {
        heading: "Prompt structure for T2V",
        body:
          "In T2V mode you describe the full scene: camera, subject, action, environment. The base formula is [Camera] shot of [subject] [action] in [environment]. [Supporting descriptions].\n\nLead with the shot type and camera move: «Wide tracking shot of a runner sprinting across a misty beach at sunrise.» That locks composition immediately. The environment gives the model the mood — lighting, atmosphere, textures.\n\nMax prompt length is unofficially around 1,800 characters. Natural language beats tags or JSON. Active verbs in present tense, concrete physical detail like «water splashing», «fabric draping», «dust settling».",
      },
      {
        heading: "Prompt structure for I2V",
        body:
          "In I2V mode the rules are the same as in Gen-4: the input image sets the visual, the prompt describes ONLY movement. No need to describe the dress, the park, or the lighting — that's already in the reference. Just say what should move and how the camera should travel.\n\nOptimal I2V prompt length is 10–30 words. Describing the reference content wastes tokens and sometimes conflicts with the actual image. Active verbs, one main camera move, optional speed modifier — «slowly», «gradually», «suddenly».",
      },
      {
        heading: "Timestamp syntax for sequential scenes",
        body:
          "The unique Gen-4.5 feature is timecode direction. Format: `[00:01] action`, `[00:03] next action`. This is the best way to build a mini-narrative from several actions inside a 5–10 second clip.\n\nThe key rule — timecodes must be realistic. «Walking across the room in 0.5 seconds» is physically impossible, and the model will either break it or ruin the dynamics. Give beats room to breathe: 2–3 seconds for a full action, 1 second for a short gesture or cut.\n\nExample: `[00:01] A bird takes off from a branch. [00:03] It soars over a misty valley. [00:06] Camera pulls back to reveal the full mountain range.`",
      },
      {
        heading: "What NOT to do",
        body:
          "Negative prompts don't work — «no clouds», «without text» can produce exactly what you tried to exclude. JSON formatting (`{\"camera\": \"...\"}`) is ignored. Command style («add rain», «remove the hat») too — Gen-4.5 is not a command-driven model.\n\nIn I2V mode, don't describe the reference content — it wastes context and sometimes causes drift. In T2V, don't mix multiple aspect ratios in one request: T2V supports only 1280:720 and 720:1280. Unrealistic timecodes (dense 0.5-second beats) break the pacing — let the motion breathe.",
      },
    ],
    examples: [
      {
        before: "beautiful cinematic ocean sunset video with waves",
        after:
          "Wide cinematic shot of waves rolling onto a black sand beach at sunset. Slow dolly-in toward the foam line. Warm orange and deep purple sky reflected on the wet sand. Soft, deliberate pacing, natural light, 24fps.",
        note: "T2V prompt builds the whole scene: shot type, environment, camera move, color palette, fps. Active verbs in present tense, no metaphors.",
      },
      {
        before: "bring this photo to life and make something dramatic",
        after:
          "Slow push-in toward the subject. Wind picks up gradually, lifting her hair and the edges of her coat. Camera stays steady, shallow depth maintained on the eyes.",
        note: "I2V mode — the prompt describes only movement and atmosphere, not reference content. Physical detail (wind lifting hair, coat edges) yields a convincing 5-second mini-story.",
      },
      {
        before: "video where a man walks into a cafe and sits at a table",
        after:
          "[00:01] Wide shot, a man pushes open the cafe door, late afternoon light streaming in. [00:04] He walks across the wooden floor toward a corner table. [00:07] He pulls out the chair and sits down, exhales slowly. Camera follows at chest height, smooth steadicam.",
        note: "Timestamp syntax splits a 10-second narrative into three beats with realistic pacing — 3 seconds per action. This is the Gen-4.5 sweet spot.",
      },
    ],
    mistakes: [
      {
        title: "Mixing T2V and I2V logic",
        explain:
          "In T2V you describe the whole scene; in I2V you describe only movement. If you describe «a woman in red in a park» in I2V, the model will try to match the text to the reference and sometimes drift. If you forget the environment and subject in T2V, you get «just a camera move» with no content. Know which mode you're in and write accordingly.",
      },
      {
        title: "Unrealistic timecodes",
        explain:
          "`[00:01] walks across the room [00:02] sits down [00:03] picks up the cup` is unrealistic for 3 seconds of screen time. The model will either speed motion to an unnatural pace or skip some beats. Give each action 2–3 seconds of breathing room, short gestures 1 second.",
      },
      {
        title: "Negative prompts",
        explain:
          "Gen-4.5 doesn't support negative prompts — it's a documented limitation. «No clouds» can produce clouds, «without text» can add text. Describe what you want positively: instead of «no fog» write «clear visibility», instead of «no jitter» write «smooth steadicam motion».",
      },
      {
        title: "Aspect ratio mismatch in T2V",
        explain:
          "T2V in Gen-4.5 supports only two aspect ratios: 1280:720 (landscape) and 720:1280 (portrait). Requests like «square 1:1» or «21:9 ultrawide» won't render in T2V. I2V is more flexible — many landscape/portrait/square options because aspect comes from the input image.",
      },
      {
        title: "JSON and command style",
        explain:
          "Structures like `{\"camera\": \"dolly\", \"action\": \"walk\"}` or commands like «add rain», «remove the hat», «pretend you are a director» don't work in Gen-4.5. Write in natural language, full sentences. Good: «Light rain begins to fall as the camera pulls back.» Bad: «add: rain. camera: pull back.»",
      },
    ],
    faq: [
      {
        q: "How is Gen-4.5 different from Gen-4?",
        a: "Four major differences: native T2V mode (Gen-4 is I2V only), flexible 2–10 second duration versus fixed 5/10, timestamp syntax for second-level beats, and markedly better physics for water, fabric, and momentum. The architecture is also new — Autoregressive-to-Diffusion instead of pure diffusion. For most tasks it's an upgrade, except when you need minimal cost on simple I2V.",
      },
      {
        q: "When should I use T2V versus I2V?",
        a: "T2V — when there's no scene yet and you want to generate everything from text: concept videos, mini-narratives, prototypes. I2V — when you have a concrete reference (product, portrait, location) and want to animate it. I2V gives more visual control; T2V gives more creative freedom. You can confidently combine both modes in the same project on a single model.",
      },
      {
        q: "How do I use the timestamp syntax correctly?",
        a: "Format `[00:01] action`, `[00:03] next action` with realistic timecodes. Give each full action 2–3 seconds, short gestures 1 second. Don't stack more than 3–4 beats into a 10-second clip. This is a tool for sequential narrative, not for cramming maximum events into minimum time.",
      },
      {
        q: "Which aspect ratios are supported?",
        a: "T2V supports only two: 1280:720 (landscape) and 720:1280 (portrait) — other ratios won't render. I2V is more flexible: aspect comes from the input image, and there are many landscape, portrait, and square options. FPS choice is 24 or 25 for both modes.",
      },
      {
        q: "Can I exceed 10 seconds in one generation?",
        a: "No, the single-generation cap in Gen-4.5 is 10 seconds (minimum 2). For longer narratives you stitch multiple generations, using the last frame of one as the input image for the next. That's manual work, but it gets you production-grade narratives of 30+ seconds.",
      },
      {
        q: "How long should the prompt be?",
        a: "For I2V — 10–30 words, same as Gen-4. For T2V — longer, up to ~1,800 characters unofficially, because you need to describe the scene in full. Timestamp prompts naturally grow due to multiple beats. The rule is concentration of meaning, not volume: every sentence should carry a physical or visual action.",
      },
      {
        q: "Does Opten support Runway Gen-4.5?",
        a: "Yes, the Opten extension auto-detects Runway inside runwayml.com and scores prompts against the structure specific to Gen-4.5: it checks alignment with T2V or I2V mode, realism of timecodes in timestamp prompts, and the absence of negative constructions and JSON. One click gives you a rewrite restructured for the selected mode.",
      },
    ],
  },
};
