// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedance-1.0-pro.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedance 1.0 Pro: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedance 1.0 Pro от ByteDance: формулы T2V и I2V, camera switching, наречия интенсивности, ограничения версии 1.0 и примеры.",
    h1: "Seedance 1.0 Pro: как писать промпты, которые модель понимает",
    intro:
      "Seedance 1.0 Pro — полнофункциональная версия первого поколения video-модели ByteDance на платформе 即梦 (Jimeng). Делает 5 или 10 секунд в 720p/1080p, 24fps, принимает текст и одно изображение для Image-to-Video. Сильна в multi-shot с camera switching, но не понимает @-референсы, звук и негативные промпты — это всё появилось в 2.0.",
    sections: [
      {
        heading: "Что умеет 1.0 Pro и чего не умеет",
        body:
          "1.0 Pro — это «короткий, быстрый, надёжный» видеогенератор. Длительность жёстко 5 или 10 секунд — никаких 7 или 12. Разрешение 720p или 1080p, FPS всегда 24. На вход — текст или одно изображение для I2V. Pro быстрее 2.0 и стабильнее на простых сценах.\n\nОграничения первого поколения общие для всей линейки 1.0: нет @-референсов (только одно изображение без префикса), нет Consistency Control между генерациями, нет звукового контроля, нет продления видео, нет тайминг-раскадровки по секундам. Негативные промпты не работают вообще — модель их игнорирует или ломает на них.\n\nСильная сторона — multi-shot с camera switching: «Cut to», «Camera cut to», «Camera switching» внутри одного 10-секундного клипа работают надёжнее, чем в 1.0 Lite.",
        bullets: [
          "Длительность фиксированная: 5 или 10 секунд",
          "Разрешение 720p / 1080p, 24fps",
          "На вход: текст или 1 изображение (I2V)",
          "Multi-shot с camera switching работает",
          "Негативные промпты НЕ работают",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Каноническая формула: `[Субъект] + [Действие] + [Сцена] + [Камера] + [Стиль]`. Ядро — субъект, действие, сцена. Камера и стиль усиливают, но не заменяют ядро.\n\nДля Text-to-Video: «Субъект + Движение + Сцена + Камера + Стиль». Для Image-to-Video главное — динамика, а не описание статики: «Субъект + Движение, Фон + Движение, Камера + Движение». Если промпт I2V описывает то, что и так видно на изображении, модель не понимает, что должно двигаться.\n\nОбязательно указывать **fixed camera** для статичной камеры или **non-fixed camera** для любых движений. Без этого модель может выбрать неожиданно. Базовые параметры — разрешение, соотношение сторон, длительность — пишутся в конце: «Non-fixed camera, 720p, 9:16, 5s».",
      },
      {
        heading: "Camera switching и multi-shot",
        body:
          "Главная фишка 1.0 Pro по сравнению с Lite — умение переключать кадры внутри одного видео. Ключевые фразы: «Cut to», «Camera cut to», «Camera switching». В 10-секундном клипе можно сделать 2–3 кадра.\n\nПример из документации: «Panoramic shooting, the model approaches with a smile. Camera switching, close-up of the lower body, the straight design of the pants and the drape of the fabric are highlighted while walking.» Здесь один промпт описывает общий план → переключение → крупный план низа.\n\nПри смене сцены через «Cut to» — описывать новую сцену словами после переключения, не оставлять «Cut to.» в воздухе. Между кадрами должна быть логическая связь — иначе модель сделает разрыв.",
      },
      {
        heading: "Наречия интенсивности",
        body:
          "Без явного указания интенсивности 1.0 Pro выдаёт «среднее» движение — медленное, плавное, без энергии. Чтобы получить динамику, нужны наречия: fast, intense, large, high frequency, strong, crazy, quickly.\n\nПример: «car quickly passing by» вместо «car passing by» — даёт реально быструю проездку. «Wings flapping wildly» вместо «wings flapping» — крылья работают на полной мощности. «Crazy fast camera dolly-in» вместо «camera dolly-in» — резкое сближение.\n\nНаречия работают и для камерных движений, и для действий персонажей. Это самый дешёвый способ оживить вялый клип — добавить 2–3 наречия в ключевые моменты.",
      },
      {
        heading: "Что подходит для 1.0 Pro",
        body:
          "Реклама и e-commerce — анимация продуктовых фото, приближение к деталям с camera switching, модельная съёмка с динамичной камерой. Это самый частый сценарий для 1.0 Pro, и модель справляется отлично.\n\nПортретная и fashion-анимация — динамичные портреты с эмоциями, показ одежды с движением, wrap around camera для 360° эффекта. Здесь camera switching между общим планом и крупным даёт почти ТВ-эффект.\n\nЭкшн и спорт — последовательные спортивные действия, динамичная follow-камера, наречия интенсивности для выразительности. Атмосферные сцены — пейзажи с aerial/panoramic камерой, slow pan по детализированной сцене, кинематографическое освещение.\n\nЧего НЕ стоит ждать от 1.0 Pro: сложные нарративы на 15 секунд, точная тайминг-раскадровка, звуковой дизайн, продление видео, multi-character consistency. Для этого нужна 2.0 или New.",
      },
    ],
    examples: [
      {
        before: "красивая модель в платье ходит",
        after:
          "Full-body shot of a young woman in a long red silk dress walking down a marble corridor. She turns slightly toward the camera with a confident smile. Panoramic shooting, slow tracking shot following her movement. Camera switching, close-up of the dress fabric drape and her hand brushing the silk. Soft natural daylight from tall windows on the right, golden hour warm tones. Non-fixed camera, 1080p, 9:16, 10s.",
        note:
          "Главное отличие: чёткие действия глаголами, camera switching между общим и крупным планом, явный «non-fixed camera» и базовые параметры в конце. Это типичный fashion-промпт под сильную сторону 1.0 Pro.",
      },
      {
        before: "не делай мультяшно, не добавляй текст и водяные знаки",
        after:
          "Cinematic close-up of a steaming espresso cup on a dark wooden table in a softly lit café. Steam rises slowly, light catches the foam surface. Camera slowly orbits around the cup, ending on a side angle that reveals the latte art. Warm tungsten lighting, shallow depth of field, film grain. Non-fixed camera, 1080p, 16:9, 5s.",
        note:
          "Негативные промпты в 1.0 Pro не работают вообще. Вместо «не делай мультяшно» — позитивно прописать «cinematic», «film grain», «shallow depth of field». Вместо «не добавляй текст» — описать сцену так, чтобы в ней не было поверхностей для текста.",
      },
      {
        before: "анимируй моё фото машины",
        after:
          "The sports car quickly accelerates from a standstill on the wet asphalt road. Tires spin briefly, water spray rises from behind. Camera follows from a low rear-tracking angle, then switches to a side shot showing the full car body in motion. Headlights glow in the dim evening light, reflections on the wet road. Non-fixed camera, 1080p, 16:9, 5s.",
        note:
          "I2V-промпт должен описывать ДВИЖЕНИЕ, а не машину — она уже видна на референсе. Что разгоняется, как двигается камера, куда летит вода, что отражается на мокром асфальте. Наречие «quickly» спасает от вялой проездки.",
      },
    ],
    mistakes: [
      {
        title: "Негативные промпты в 1.0 Pro",
        explain:
          "«No watermark», «no cartoon», «without blur» модель в 1.0 Pro либо игнорирует, либо ломается на них. Правило: пиши что показывать, не что скрывать. Вместо «не мультяшно» → «photorealistic, film grain». Вместо «без текста» → описывай сцены без поверхностей для текста.",
      },
      {
        title: "@-синтаксис референсов",
        explain:
          "@image1, @video1, @audio1 — это всё из 2.0. В 1.0 Pro их нет: на вход одно изображение без префикса для I2V, и всё. Если промпт написан с @-синтаксисом, модель воспримет «@image1» как мусор в тексте и качество упадёт.",
      },
      {
        title: "Запрос на 7, 12, 15 секунд",
        explain:
          "Длительность жёстко 5 или 10 секунд. Никаких промежуточных вариантов. «Сделай 8-секундный клип» либо обрежется до 5, либо растянется до 10 со странным темпом. Если нужно 15 — это уже 2.0 или New.",
      },
      {
        title: "I2V-промпт описывает то, что видно на фото",
        explain:
          "Если на референсе машина и промпт «красная машина на дороге», модель не понимает, что должно двигаться. I2V-формула: «Субъект + Движение, Фон + Движение, Камера + Движение». Описывай динамику — что разгоняется, что вращается, куда летит свет.",
      },
      {
        title: "Тайминг по секундам в стиле «0-3с / 4-8с»",
        explain:
          "Тайминг-раскадровка появилась только в 2.0. В 1.0 Pro её нет — модель не парсит «0-3с» и «4-8с» как структуру. Для multi-shot используй «Cut to» и «Camera switching» с описанием каждого кадра.",
      },
    ],
    faq: [
      {
        q: "Чем 1.0 Pro отличается от 1.0 Lite?",
        a: "Pro имеет больше параметров, поддержку 1080p (в Lite только 720p), лучшее качество генерации и более точное следование сложным промптам. Но архитектурные ограничения первого поколения общие: нет @-референсов, нет звука, нет негативных промптов, нет тайминг-раскадровки. Pro — это «лучший Lite», а не «маленький 2.0».",
      },
      {
        q: "Стоит ли использовать 1.0 Pro вместо 2.0?",
        a: "Стоит в трёх случаях: нужна максимальная скорость на простом промпте (5-секундный продуктовый шот, fashion walk-by, atmospheric shot), не нужны @-референсы и звук, и хочется сэкономить на стоимости генерации. Для длинных нарративов, multi-character сцен, video extension и cinematic-промптов с эмоциональными арками — нужна 2.0 или New.",
      },
      {
        q: "Почему мои негативные промпты не работают?",
        a: "В 1.0 Pro негативные промпты не поддерживаются на уровне модели — это не баг платформы, а архитектурное ограничение. Базовая поддержка простых запретов появилась в 1.5 Pro, более полная — в 2.0. Решение: всё формулировать позитивно. «No watermark» → «clean composition». «No cartoon» → «photorealistic, cinematic».",
      },
      {
        q: "Что такое «collapse» в 1.0 Pro?",
        a: "Collapse — когда модель ломается на сложном промпте: морфит лицо, дублирует конечности, теряет логику движения. Это известное явление первого поколения. Рекомендуемое решение — просто перегенерировать с тем же промптом 2–3 раза; одна из попыток обычно проходит. Также помогает упростить промпт и убрать конфликтующие камерные движения.",
      },
      {
        q: "Можно ли клонировать камеру из референсного видео?",
        a: "Нет, копирование камеры из @video появилось только в 2.0. В 1.0 Pro можно только описывать камерные движения словами: «slow tracking shot», «orbit around the subject», «handheld follow». Если нужен конкретный паттерн из существующего ролика, расписывай его текстом — какая крупность, какое движение, какой угол.",
      },
      {
        q: "Поддерживает ли 1.0 Pro multi-character сцены?",
        a: "Поддерживает базово — модель умеет рендерить взаимодействие двух персонажей, и есть рабочие примеры вроде «The woman was crying and drinking when a man came in to comfort her». Но без @-референсов нельзя гарантировать одинаковую внешность персонажей между разными генерациями. Для серьёзной multi-character работы с consistency — нужна 2.0.",
      },
      {
        q: "Поддерживается ли Opten для Seedance 1.0 Pro?",
        a: "Да, расширение Opten распознаёт Seedance 1.0 Pro внутри syntx.ai и оценивает промпт по структуре первого поколения: проверяет наличие субъекта, действия, сцены и камеры, наличие fixed/non-fixed camera, корректность camera switching, отсутствие неработающих негативных промптов и @-синтаксиса. Одним кликом можно получить rewrite, адаптированный под возможности именно 1.0 Pro.",
      },
    ],
  },
  en: {
    title: "Seedance 1.0 Pro Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedance 1.0 Pro: T2V and I2V formulas, camera switching, intensity adverbs, version 1.0 limits, and examples.",
    h1: "Seedance 1.0 Pro: how to write prompts the model actually understands",
    intro:
      "Seedance 1.0 Pro is the full-featured first-generation video model from ByteDance on the 即梦 (Jimeng) platform. It produces 5 or 10 second clips at 720p/1080p, 24fps, and accepts text or one image for Image-to-Video. It is strong on multi-shot with camera switching, but it does not understand @-references, sound, or negative prompts — those all arrived in 2.0.",
    sections: [
      {
        heading: "What 1.0 Pro can and cannot do",
        body:
          "1.0 Pro is the «short, fast, reliable» video generator. Duration is locked at 5 or 10 seconds — no 7 or 12. Resolution is 720p or 1080p, FPS is always 24. Inputs are text or one image for I2V. Pro is faster than 2.0 and more stable on simple scenes.\n\nFirst-generation limits apply across the 1.0 line: no @-references (only a single unprefixed image), no Consistency Control between runs, no sound control, no video extension, no second-by-second storyboarding. Negative prompts do not work at all — the model ignores them or breaks on them.\n\nThe strong suit is multi-shot with camera switching: «Cut to», «Camera cut to», «Camera switching» inside a 10-second clip work more reliably than in 1.0 Lite.",
        bullets: [
          "Duration locked: 5 or 10 seconds",
          "Resolution 720p / 1080p, 24fps",
          "Input: text or 1 image (I2V)",
          "Multi-shot with camera switching works",
          "Negative prompts do NOT work",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Canonical formula: `[Subject] + [Action] + [Scene] + [Camera] + [Style]`. The core is subject, action, scene. Camera and style amplify but do not replace the core.\n\nFor Text-to-Video: «Subject + Motion + Scene + Camera + Style». For Image-to-Video the key is dynamics, not static description: «Subject + Motion, Background + Motion, Camera + Motion». An I2V prompt that describes what is already visible in the reference leaves the model guessing about what should move.\n\nAlways specify **fixed camera** for a locked-off shot or **non-fixed camera** for any movement. Without it the model picks unpredictably. Base parameters — resolution, aspect ratio, duration — go at the end: «Non-fixed camera, 720p, 9:16, 5s».",
      },
      {
        heading: "Camera switching and multi-shot",
        body:
          "The main feature 1.0 Pro has over Lite is the ability to switch shots inside a single video. Key phrases: «Cut to», «Camera cut to», «Camera switching». In a 10-second clip you can fit 2–3 shots.\n\nDocumentation example: «Panoramic shooting, the model approaches with a smile. Camera switching, close-up of the lower body, the straight design of the pants and the drape of the fabric are highlighted while walking.» One prompt describes a wide shot → switch → tight shot of the lower half.\n\nOn a scene cut via «Cut to» — describe the new scene in words after the switch, do not leave «Cut to.» hanging. There has to be a logical link between shots, otherwise the model produces a hard discontinuity.",
      },
      {
        heading: "Intensity adverbs",
        body:
          "Without explicit intensity 1.0 Pro renders «medium» motion — slow, smooth, no energy. To get dynamics you need adverbs: fast, intense, large, high frequency, strong, crazy, quickly.\n\nExamples: «car quickly passing by» instead of «car passing by» actually delivers a fast drive-by. «Wings flapping wildly» instead of «wings flapping» — wings working at full power. «Crazy fast camera dolly-in» instead of «camera dolly-in» — a sharp push-in.\n\nAdverbs work both on camera moves and on character actions. This is the cheapest way to wake up a sluggish clip — add 2–3 adverbs at key moments.",
      },
      {
        heading: "What 1.0 Pro is good at",
        body:
          "Advertising and e-commerce — animating product stills, close-up reveals via camera switching, model shoots with dynamic camera. This is the most frequent 1.0 Pro use case and the model nails it.\n\nPortrait and fashion animation — dynamic portraits with emotion, garment reveals with movement, wrap around camera for a 360° effect. Camera switching between wide and tight gives an almost broadcast feel.\n\nAction and sports — sequential sports actions, dynamic follow camera, intensity adverbs for punch. Atmospheric scenes — landscapes with aerial/panoramic camera, slow pan over detailed scenes, cinematic lighting.\n\nDo not expect from 1.0 Pro: complex 15-second narratives, second-precise storyboarding, sound design, video extension, multi-character consistency. For those you need 2.0 or New.",
      },
    ],
    examples: [
      {
        before: "beautiful model in a dress walking",
        after:
          "Full-body shot of a young woman in a long red silk dress walking down a marble corridor. She turns slightly toward the camera with a confident smile. Panoramic shooting, slow tracking shot following her movement. Camera switching, close-up of the dress fabric drape and her hand brushing the silk. Soft natural daylight from tall windows on the right, golden hour warm tones. Non-fixed camera, 1080p, 9:16, 10s.",
        note:
          "Key change: concrete action verbs, camera switching between wide and tight, an explicit «non-fixed camera» tag and base parameters at the end. This is a textbook fashion prompt that plays to 1.0 Pro's strengths.",
      },
      {
        before: "don't make it cartoonish, no text and no watermarks",
        after:
          "Cinematic close-up of a steaming espresso cup on a dark wooden table in a softly lit café. Steam rises slowly, light catches the foam surface. Camera slowly orbits around the cup, ending on a side angle that reveals the latte art. Warm tungsten lighting, shallow depth of field, film grain. Non-fixed camera, 1080p, 16:9, 5s.",
        note:
          "Negative prompts simply do not work in 1.0 Pro. Instead of «don't make it cartoonish», state the positive: «cinematic», «film grain», «shallow depth of field». Instead of «no text», describe a scene that has no surfaces text could land on.",
      },
      {
        before: "animate my car photo",
        after:
          "The sports car quickly accelerates from a standstill on the wet asphalt road. Tires spin briefly, water spray rises from behind. Camera follows from a low rear-tracking angle, then switches to a side shot showing the full car body in motion. Headlights glow in the dim evening light, reflections on the wet road. Non-fixed camera, 1080p, 16:9, 5s.",
        note:
          "An I2V prompt has to describe MOTION, not the car — the car is already in the reference. What accelerates, how the camera moves, where the spray flies, what the wet road reflects. The adverb «quickly» saves the shot from a sluggish drive-by.",
      },
    ],
    mistakes: [
      {
        title: "Negative prompts in 1.0 Pro",
        explain:
          "«No watermark», «no cartoon», «without blur» — 1.0 Pro either ignores these or breaks on them. Rule: state what to show, not what to hide. Instead of «not cartoonish» → «photorealistic, film grain». Instead of «no text» → describe scenes without surfaces for text.",
      },
      {
        title: "@-reference syntax",
        explain:
          "@image1, @video1, @audio1 are all from 2.0. 1.0 Pro doesn't have them: a single image input without a prefix for I2V, and that's it. A prompt written with @-syntax leaks the tokens into the text as garbage and quality drops.",
      },
      {
        title: "Asking for 7, 12, or 15 seconds",
        explain:
          "Duration is locked to 5 or 10 seconds. No in-between options. «Make an 8-second clip» either gets cropped to 5 or stretched to 10 with weird pacing. If you need 15, that's 2.0 or New.",
      },
      {
        title: "I2V prompt describes what is already in the photo",
        explain:
          "If the reference shows a car and the prompt says «red car on a road», the model has no idea what should move. I2V formula: «Subject + Motion, Background + Motion, Camera + Motion». Describe the dynamics — what accelerates, what rotates, where the light flies.",
      },
      {
        title: "Second-style timestamps like «0-3s / 4-8s»",
        explain:
          "Timestamp storyboarding arrived in 2.0. 1.0 Pro does not parse «0-3s» or «4-8s» as structure. For multi-shot use «Cut to» and «Camera switching» with an explicit description of each shot.",
      },
    ],
    faq: [
      {
        q: "How is 1.0 Pro different from 1.0 Lite?",
        a: "Pro has more parameters, 1080p support (Lite is 720p only), better generation quality, and tighter adherence to complex prompts. But the first-generation architectural limits are shared: no @-references, no sound, no negative prompts, no timestamp storyboarding. Pro is «better Lite», not «small 2.0».",
      },
      {
        q: "Should I use 1.0 Pro instead of 2.0?",
        a: "Yes in three cases: maximum speed on a simple prompt (5-second product shot, fashion walk-by, atmospheric shot), no need for @-references and sound, and a desire to save on generation cost. For long narratives, multi-character scenes, video extension, and cinematic prompts with emotional arcs — you need 2.0 or New.",
      },
      {
        q: "Why do my negative prompts not work?",
        a: "1.0 Pro does not support negative prompts at the model level — this is not a platform bug, it is an architectural limit. Basic support for simple bans arrived in 1.5 Pro, fuller support in 2.0. The fix is to phrase everything positively. «No watermark» → «clean composition». «No cartoon» → «photorealistic, cinematic».",
      },
      {
        q: "What is «collapse» in 1.0 Pro?",
        a: "Collapse is when the model breaks on a hard prompt: morphs faces, duplicates limbs, loses motion logic. It is a known first-generation phenomenon. The recommended fix is to simply regenerate with the same prompt 2–3 times; one attempt usually goes through cleanly. Simplifying the prompt and removing conflicting camera moves also helps.",
      },
      {
        q: "Can I clone camera moves from a reference video?",
        a: "No, copying camera from @video only arrived in 2.0. In 1.0 Pro you can only describe camera moves in words: «slow tracking shot», «orbit around the subject», «handheld follow». If you need a specific pattern from an existing reel, spell it out in text — what shot size, what movement, what angle.",
      },
      {
        q: "Does 1.0 Pro support multi-character scenes?",
        a: "It supports them at a basic level — the model can render two-character interactions, and there are working examples like «The woman was crying and drinking when a man came in to comfort her». But without @-references there is no way to guarantee identical appearance between separate generations. For serious multi-character work with consistency you need 2.0.",
      },
      {
        q: "Does Opten support Seedance 1.0 Pro?",
        a: "Yes, the Opten extension detects Seedance 1.0 Pro inside syntx.ai and scores prompts against the first-generation structure: it checks for subject, action, scene, and camera, the presence of fixed/non-fixed camera, correct camera switching, the absence of non-working negative prompts and @-syntax. One click gives you a rewrite adapted to what 1.0 Pro can actually do.",
      },
    ],
  },
};
