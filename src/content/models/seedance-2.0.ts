// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedance-2.0.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedance 2.0: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedance 2.0 от ByteDance: TRY CGI-структура, @-референсы, тайминг-раскадровка, эмоциональный реализм и примеры до/после.",
    h1: "Seedance 2.0: как писать промпты, которые модель понимает",
    intro:
      "Seedance 2.0 — флагманская видео-модель ByteDance на платформе 即梦 (Jimeng). Делает 4–15 секунд до 2K, принимает до 9 изображений, 3 видео и 3 аудио за запрос. Понимает @-референсы, тайминг-раскадровку по секундам и многослойные TRY CGI-блоки. На syntx.ai стандарт — английский, на нативной платформе лучше работает китайский.",
    sections: [
      {
        heading: "Что нового в Seedance 2.0",
        body:
          "По сравнению с 1.0 Pro / 1.5 Pro это поколенческий скачок. Длительность теперь не фиксированные 5 или 10 секунд, а свободные 4–15. Появилась полная мультимодальность — до 12 файлов за один запрос: изображения, видео и аудио одновременно. Заработал Consistency Control через @-референсы, звуковой контроль с клонированием голоса, продление видео через @Video и тайминг-раскадровка по секундам.\n\nКлючевое архитектурное отличие: модель внутренне маршрутизирует именованные блоки (LOCATION, STYLE, STORY, CHARACTERS, SHOT STRUCTURE) в разные подсистемы — environment, identity, temporal planner. Поэтому «полотно текста» в одном параграфе даёт заметно худший результат, чем тот же текст, разнесённый по блокам.",
        bullets: [
          "Длительность 4–15 секунд (вместо 5/10 в 1.0/1.5)",
          "До 9 изображений + 3 видео + 3 аудио за один запрос",
          "Полный Consistency Control через @image, @video, @audio",
          "Тайминг-раскадровка по секундам (0–4с / 4–10с / 10–15с)",
          "Звуковой контроль и клонирование голоса",
        ],
      },
      {
        heading: "TRY CGI-структура промпта",
        body:
          "Канонический порядок блоков для cinematic-результата: [TITLE & ACT] → LOCATION → REFERENCE ASSIGNMENT → STYLE → STORY → CHARACTERS → SHOT STRUCTURE. Между блоками — ровно одна пустая строка, после двоеточия — пробел.\n\nLOCATION — окружение, свет, погода, ключевые детали фона. STYLE — визуальный пресет («Ultra-photorealistic 4K live-action cinema», «Gritty film grain»). STORY — что происходит в этой конкретной генерации в 1–2 предложениях. CHARACTERS — участники, их текущее настроение, внешние особенности. SHOT STRUCTURE — раскадровка с актами.\n\nЭто работает сильнее, чем 6-шаговая формула «Субъект + Действие + Сцена + Камера + Стиль + Звук», потому что блоки попадают в правильные слои генерации.",
      },
      {
        heading: "@-референсы и identity preservation",
        body:
          "Seedance 2.0 принимает референсы через `@`-префикс с привязкой к роли: @image1/@image2/@image3 для персонажей и сцен, @video1/@video2/@video3 для копирования камеры и ритма, @audio1/@audio2/@audio3 для голоса и SFX.\n\nКритически важная фраза для персонажа — **Strict identity preservation. No morphing or style changes.** Без неё модель будет «улучшать» лицо между секундами, и persistent character ломается уже к 4-й секунде. Это совет №1 от TRY CGI.\n\nШаблон REFERENCE ASSIGNMENT: «Protagonist (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.» Для аудио — «Audio (@audio1): Reference for realistic electrical buzzing and low machinery hum.»",
      },
      {
        heading: "Тайминг-раскадровка 0–15s",
        body:
          "Для 10–15-секундных видео TRY CGI рекомендует 3 именованных акта с фиксированным каркасом полей: Action / Emotional Acting / Camera / Lighting / VFX / Audio Rule.\n\nКанонический 15s шаблон — 0–4s [THE ENTRY] (завязка), 4–10s [THE REVELATION] (поворот, часто dolly-in или crash-zoom), 10–15s [ACTION RESPONSE] (развязка, handheld, motion blur). Для 8s — 2 акта ENTRY → PAYOFF, для 10s — SETUP → CLIMAX.\n\nГлавная ошибка — описывать эмоции общими словами («он испуган»). Правильный путь — микромимика: «jaw clenches, nostrils flare, pupils dilate, micro-tremor in the eyelids». Без этих микро-сигналов лицо выглядит как «маска» с правильной общей эмоцией, но мёртвое.",
      },
      {
        heading: "Audio Rule и анти-AI-look",
        body:
          "Дефолт для cinematic-промптов — **тишина + diegetic**, не музыка. Если пользователь явно не попросил саундтрек — его не должно быть. Универсальный финальный якорь: «No music. Diegetic sound design only.»\n\nSeedance 2.0 без явных указаний склонна выдавать пластиковую кожу, чрезмерно тёплый свет и hyperreal-stylization. Спасает финальная строка с анти-AI-якорями: «Ultra-photorealistic 4K live-action cinema. Grounded realism. Gritty film grain. No cartoonish look, no AI aesthetic, no over-stylization. Practical lighting, no glossy AI render look.»\n\nДля superhero/action — «Gritty superhero realism, the look of Nolan's Dark Knight, not animation.» Для документалистики — «Documentary cinema verité, handheld realism, the look of HBO drama, not Netflix gloss.»",
      },
    ],
    examples: [
      {
        before: "видео где собака бежит через площадь, динамично",
        after:
          "LOCATION: Urban square at midday. Concrete pavement, wooden benches, food stalls, crowd in background. Bright natural sunlight with strong side rim light.\n\nSTYLE: Ultra-photorealistic 4K cinematic action, gritty film grain, realistic muscle and fur, practical lighting. Gritty realism like a Nolan action film. No cartoonish AI look.\n\nSTORY: A dog in a black collar makes a high-speed escape across the square, demonstrating athletic jumps between people and obstacles.\n\nCHARACTERS: Dog, muscular and energetic, in a black collar. Focused eyes, pupils dilated with adrenaline, fur swept back by speed.\n\nSHOT STRUCTURE (10 SEC TOTAL):\n\n0-4s — [SETUP]\n  Action: Dog launches from a crouch, muscles tensed.\n  Emotional Acting: Concentration. Pupils dilated, ears pinned back, nostrils flared.\n  Camera: Low angle dolly tracking behind the dog.\n  Audio Rule: Diegetic only — claws on concrete, panting.\n\n4-10s — [CLIMAX]\n  Action: Dog vaults a bench, weaves through a crowd.\n  Camera: Side tracking, motion blur on background.\n  Audio Rule: Footsteps, breath, distant crowd. No music.\n\nNo music. Diegetic sound design only. Grounded realism, gritty film grain, no AI aesthetic.",
        note:
          "Главное отличие: блочная TRY CGI-структура вместо одного предложения. Каждый блок попадает в свой слой генерации (environment, identity, temporal planner), а финальный анти-AI-якорь спасает от пластикового рендера.",
      },
      {
        before: "герой смотрит на экран компьютера и понимает что случилось",
        after:
          "LOCATION: Dim server room, racks of blinking LEDs, smoke from a fried capacitor, single overhead bulb.\n\nREFERENCE ASSIGNMENT:\n- Protagonist (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n\nSTYLE: Ultra-photorealistic 4K cinematic, anamorphic lens flare, gritty film grain. The look of a modern tech thriller, not animation.\n\nSTORY: Character realizes the breach is live, in real time, on the terminal in front of them.\n\nSHOT STRUCTURE (8 SEC TOTAL):\n\n0-4s — [ENTRY]\n  Action: Character types rapidly, leans toward the monitor.\n  Emotional Acting: Focused tension. Jaw clenches, brow furrowed, breathing shallow.\n  Camera: Medium shot, slight handheld sway.\n  Lighting: Cold monitor glow on face, warm overhead bulb behind.\n\n4-8s — [PAYOFF]\n  Action: Character freezes mid-keystroke, eyes locked on the screen.\n  Emotional Acting: Shock. Pupils dilate, nostrils flare, micro-tremor in the eyelids. Screen light reflects in the pupils.\n  Camera: Slow dolly-in to an extreme close-up of the eyes.\n  Lighting: Screen reflection sharp in the pupils.\n  Audio Rule: Only the soft hum of servers and slow inhale. No music.\n\nNo music. Diegetic sound design only.",
        note:
          "Identity preservation для @image1 + микромимика в Emotional Acting вместо «он удивлён» = живое лицо с настоящим shock-моментом, а не AI-маска.",
      },
      {
        before: "продлить моё видео на 5 секунд и добавить пробежку",
        after:
          "REFERENCE ASSIGNMENT:\n- Base footage (@video1): Use this as the source. Match exact lighting, color grading, lens, and frame composition of the last frame. Continue camera motion seamlessly.\n\nExtend @video1 by 5 seconds. New content begins exactly from the last frame of @video1 — preserve framing, exposure, and color grade.\n\nNew action: The character in frame breaks into a sprint, accelerating from a walk over the first 2 seconds, then full sprint for the remaining 3. Camera transitions from medium tracking to a tighter handheld follow.\n\nAudio Rule: Diegetic only — footsteps accelerating, breath quickening. No music.\n\nNo music. Diegetic sound design only. Grounded realism, no AI gloss.",
        note:
          "Video Extension работает только если явно указать @video1 как источник и описать стыковку — «continue camera motion seamlessly», «preserve framing, exposure, color grade». Без этого склейка ломается на первой же секунде нового сегмента.",
      },
    ],
    mistakes: [
      {
        title: "Сплошной параграф вместо TRY CGI-блоков",
        explain:
          "«Полотно текста» из одного абзаца теряет 30–40% качества по сравнению с тем же текстом, разнесённым по LOCATION / STYLE / STORY / CHARACTERS / SHOT STRUCTURE. Модель внутренне маршрутизирует разные блоки в разные слои генерации, и без явных заголовков маршрутизация шумит.",
      },
      {
        title: "@-референс на персонажа без identity preservation",
        explain:
          "Если есть @image1 на лицо, но нет фразы «Strict identity preservation. No morphing or style changes.» — модель «улучшит» лицо между секундами видео. К 4-й секунде персонаж уже не похож на референс. Эта фраза — совет №1 от TRY CGI для consistency.",
      },
      {
        title: "Эмоции описаны общими словами",
        explain:
          "«Он испуган», «она счастлива», «удивление» дают на выходе мёртвое лицо-маску. Seedance 2.0 рендерит микромимику только когда её явно описать: «jaw clenches, pupils dilate, micro-tremor in the eyelids, nostrils flare». Минимум 2–3 микро-сигнала на каждый акт.",
      },
      {
        title: "Эпическая музыка по умолчанию",
        explain:
          "Промпт «epic orchestral soundtrack», «dramatic background score» без явного запроса от пользователя превращает cinematic-сцену в трейлер. Дефолт — «No music. Diegetic sound design only.» Музыку добавлять только если пользователь явно её попросил.",
      },
      {
        title: "Запрос на >15 секунд одним промптом",
        explain:
          "Лимит платформы — 15 секунд за один запуск. На «сделай 30-секундный ролик» модель либо обрежет, либо сломает темп. Правильный путь — сегментировать: первый промпт до 15с, второй сегмент через @video1 с «Extend @video1 by 15 seconds» и описанием нового контента.",
      },
    ],
    faq: [
      {
        q: "Чем Seedance 2.0 отличается от 1.5 Pro?",
        a: "Пять ключевых апгрейдов: свободная длительность 4–15 секунд вместо фиксированных 5/10, полная мультимодальность с поддержкой до 12 файлов за запрос, Consistency Control через @-референсы, звуковой контроль с клонированием голоса, и тайминг-раскадровка по секундам. Для серьёзного cinematic-контента это однозначный апгрейд, для простых 5-секундных шотов 1.5 Pro быстрее.",
      },
      {
        q: "На каком языке писать промпт?",
        a: "На нативной платформе 即梦 (Jimeng) лучше работает китайский — модель обучалась на китайских данных. На syntx.ai стандарт — английский, и качество стабильное. Русский тоже принимается, но даёт чуть менее предсказуемые результаты в сложных сценах. Технические якоря (4K, dolly-in, handheld, film grain) всегда оставляем на английском внутри любого языка.",
      },
      {
        q: "Что делать с реалистичными лицами в загружаемых изображениях?",
        a: "Платформа блокирует реалистичные человеческие лица в @image и @video референсах — это политика ByteDance, обойти нельзя. Варианты: использовать стилизованные портреты (концепт-арт, иллюстрация), снимать сцены без узнаваемых лиц (силуэты, со спины, дальний план), или генерировать персонажа полностью текстом без референса.",
      },
      {
        q: "Можно ли сделать видео длиннее 15 секунд?",
        a: "Не за один запуск — 15 секунд это жёсткий лимит. Длинные видео собирают сегментами: первый промпт до 15с заканчивается на «чистом» кадре, второй сегмент использует первый как @video1 с инструкцией «Extend @video1 by Xс» и описанием нового контента. Между сегментами обязательно описать точку склейки — что на последнем кадре первого сегмента и как продолжается во втором.",
      },
      {
        q: "Зачем нужна фраза «No music. Diegetic sound design only.»?",
        a: "Без явного указания Seedance 2.0 часто добавляет фоновую музыку — это превращает cinematic-сцену в трейлер. Серьёзное кино звучит как настоящая жизнь: шаги, дыхание, шум среды, без саундтрека в hard-моментах. Diegetic — это «звуки, источник которых есть в кадре». Этот финальный якорь работает как фильтр, который выключает «трейлер-режим» по умолчанию.",
      },
      {
        q: "Какие микромимические дескрипторы давать на каждый акт?",
        a: "TRY CGI рекомендует минимум 2–3 микро-сигнала из трёх групп. Группа «взгляд» — eyes darting, pupils dilating, focused gaze, micro-tremor in the eyelids. Группа «мышцы лица» — jaw clenching, nostrils flaring, brow tension, lips tightening. Группа «дыхание и тело» — visible heavy breathing, shoulder movement on inhale, hand tremor, visible sweat. Без этих дескрипторов модель рендерит «маску» с правильной общей эмоцией, но мёртвую.",
      },
      {
        q: "Поддерживается ли Opten для Seedance 2.0?",
        a: "Да, расширение Opten распознаёт Seedance 2.0 внутри syntx.ai и оценивает промпт по TRY CGI-структуре: проверяет наличие именованных блоков LOCATION/STYLE/STORY/CHARACTERS, identity preservation у @-референсов, микромимики в Emotional Acting, Audio Rule с diegetic-якорем и анти-AI-фраз в финале. Одним кликом можно получить rewrite в каноническом формате.",
      },
    ],
  },
  en: {
    title: "Seedance 2.0 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedance 2.0: TRY CGI structure, @-references, timestamp storyboarding, emotional realism, and before/after examples.",
    h1: "Seedance 2.0: how to write prompts the model actually understands",
    intro:
      "Seedance 2.0 is ByteDance's flagship video model on the 即梦 (Jimeng) platform. It generates 4–15 second clips up to 2K, accepts up to 9 images, 3 videos, and 3 audio inputs per request. It understands @-references, second-by-second storyboarding, and named TRY CGI blocks. On syntx.ai the standard is English; on the native platform Chinese performs better.",
    sections: [
      {
        heading: "What is new in Seedance 2.0",
        body:
          "Compared to 1.0 Pro and 1.5 Pro this is a generational jump. Duration is no longer fixed at 5 or 10 seconds — anywhere from 4 to 15 is open. Full multimodality landed: up to 12 files per request across images, videos, and audio. Consistency Control via @-references, voice cloning and sound design, video extension through @Video, and second-precise storyboarding all became available.\n\nThe key architectural shift: the model internally routes named blocks (LOCATION, STYLE, STORY, CHARACTERS, SHOT STRUCTURE) into different subsystems — environment, identity, temporal planner. A wall of text in a single paragraph yields noticeably worse output than the same text split across explicit blocks.",
        bullets: [
          "Duration 4–15 seconds (vs 5/10 in 1.0/1.5)",
          "Up to 9 images + 3 videos + 3 audio per request",
          "Full Consistency Control via @image, @video, @audio",
          "Second-by-second storyboarding (0–4s / 4–10s / 10–15s)",
          "Voice cloning and sound design",
        ],
      },
      {
        heading: "TRY CGI prompt structure",
        body:
          "Canonical block order for cinematic results: [TITLE & ACT] → LOCATION → REFERENCE ASSIGNMENT → STYLE → STORY → CHARACTERS → SHOT STRUCTURE. One blank line between blocks, a space after every colon.\n\nLOCATION — environment, lighting, weather, key background details. STYLE — visual preset (\"Ultra-photorealistic 4K live-action cinema\", \"Gritty film grain\"). STORY — what happens in this specific generation, in one or two sentences. CHARACTERS — participants, their current mood, current appearance. SHOT STRUCTURE — the act-based breakdown.\n\nThis works stronger than the basic 6-step formula because named blocks route into the right generation layers.",
      },
      {
        heading: "@-references and identity preservation",
        body:
          "Seedance 2.0 accepts references via an `@`-prefix bound to a role: @image1/@image2/@image3 for characters and scenes, @video1/@video2/@video3 for camera and rhythm cloning, @audio1/@audio2/@audio3 for voice and SFX.\n\nThe critical phrase for any character reference is **Strict identity preservation. No morphing or style changes.** Without it, the model will «improve» the face between seconds and persistent character breaks by second four. This is TRY CGI's number-one consistency tip.\n\nReference assignment template: «Protagonist (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.» For audio: «Audio (@audio1): Reference for realistic electrical buzzing and low machinery hum.»",
      },
      {
        heading: "Timestamp storyboarding 0–15s",
        body:
          "For 10–15 second videos, TRY CGI recommends three named acts with a fixed field skeleton: Action / Emotional Acting / Camera / Lighting / VFX / Audio Rule.\n\nThe canonical 15s template — 0–4s [THE ENTRY] (setup), 4–10s [THE REVELATION] (turn, often dolly-in or crash-zoom), 10–15s [ACTION RESPONSE] (resolution, handheld, motion blur). For 8s — two acts ENTRY → PAYOFF, for 10s — SETUP → CLIMAX.\n\nThe biggest trap is describing emotion in general terms («he is scared»). The right path is micro-acting: «jaw clenches, nostrils flare, pupils dilate, micro-tremor in the eyelids». Without these micro-signals the face renders as a mask with the correct overall emotion, but dead.",
      },
      {
        heading: "Audio Rule and anti-AI-look",
        body:
          "The default for cinematic prompts is **silence plus diegetic**, not music. If the user did not explicitly ask for a score, there should not be one. Universal final anchor: «No music. Diegetic sound design only.»\n\nWithout explicit guidance Seedance 2.0 tends toward plastic skin, overly warm light, and hyperreal stylization. The fix is a final line of anti-AI anchors: «Ultra-photorealistic 4K live-action cinema. Grounded realism. Gritty film grain. No cartoonish look, no AI aesthetic, no over-stylization. Practical lighting, no glossy AI render look.»\n\nFor superhero/action — «Gritty superhero realism, the look of Nolan's Dark Knight, not animation.» For documentary — «Documentary cinema verité, handheld realism, the look of HBO drama, not Netflix gloss.»",
      },
    ],
    examples: [
      {
        before: "video of a dog running across a square, make it dynamic",
        after:
          "LOCATION: Urban square at midday. Concrete pavement, wooden benches, food stalls, crowd in background. Bright natural sunlight with strong side rim light.\n\nSTYLE: Ultra-photorealistic 4K cinematic action, gritty film grain, realistic muscle and fur, practical lighting. Gritty realism like a Nolan action film. No cartoonish AI look.\n\nSTORY: A dog in a black collar makes a high-speed escape across the square, demonstrating athletic jumps between people and obstacles.\n\nCHARACTERS: Dog, muscular and energetic, in a black collar. Focused eyes, pupils dilated with adrenaline, fur swept back by speed.\n\nSHOT STRUCTURE (10 SEC TOTAL):\n\n0-4s — [SETUP]\n  Action: Dog launches from a crouch, muscles tensed.\n  Emotional Acting: Concentration. Pupils dilated, ears pinned back, nostrils flared.\n  Camera: Low angle dolly tracking behind the dog.\n  Audio Rule: Diegetic only — claws on concrete, panting.\n\n4-10s — [CLIMAX]\n  Action: Dog vaults a bench, weaves through a crowd.\n  Camera: Side tracking, motion blur on background.\n  Audio Rule: Footsteps, breath, distant crowd. No music.\n\nNo music. Diegetic sound design only. Grounded realism, gritty film grain, no AI aesthetic.",
        note:
          "Key change: TRY CGI block structure instead of one sentence. Each block routes into its own generation layer (environment, identity, temporal planner), and the final anti-AI anchor saves the shot from plastic render.",
      },
      {
        before: "hero looks at a computer screen and realizes what happened",
        after:
          "LOCATION: Dim server room, racks of blinking LEDs, smoke from a fried capacitor, single overhead bulb.\n\nREFERENCE ASSIGNMENT:\n- Protagonist (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n\nSTYLE: Ultra-photorealistic 4K cinematic, anamorphic lens flare, gritty film grain. The look of a modern tech thriller, not animation.\n\nSTORY: Character realizes the breach is live, in real time, on the terminal in front of them.\n\nSHOT STRUCTURE (8 SEC TOTAL):\n\n0-4s — [ENTRY]\n  Action: Character types rapidly, leans toward the monitor.\n  Emotional Acting: Focused tension. Jaw clenches, brow furrowed, breathing shallow.\n  Camera: Medium shot, slight handheld sway.\n  Lighting: Cold monitor glow on face, warm overhead bulb behind.\n\n4-8s — [PAYOFF]\n  Action: Character freezes mid-keystroke, eyes locked on the screen.\n  Emotional Acting: Shock. Pupils dilate, nostrils flare, micro-tremor in the eyelids. Screen light reflects in the pupils.\n  Camera: Slow dolly-in to an extreme close-up of the eyes.\n  Lighting: Screen reflection sharp in the pupils.\n  Audio Rule: Only the soft hum of servers and slow inhale. No music.\n\nNo music. Diegetic sound design only.",
        note:
          "Identity preservation on @image1 plus explicit micro-acting in Emotional Acting instead of «he is surprised» = a living face with a real shock beat, not an AI mask.",
      },
      {
        before: "extend my video by 5 seconds and add a sprint",
        after:
          "REFERENCE ASSIGNMENT:\n- Base footage (@video1): Use this as the source. Match exact lighting, color grading, lens, and frame composition of the last frame. Continue camera motion seamlessly.\n\nExtend @video1 by 5 seconds. New content begins exactly from the last frame of @video1 — preserve framing, exposure, and color grade.\n\nNew action: The character in frame breaks into a sprint, accelerating from a walk over the first 2 seconds, then full sprint for the remaining 3. Camera transitions from medium tracking to a tighter handheld follow.\n\nAudio Rule: Diegetic only — footsteps accelerating, breath quickening. No music.\n\nNo music. Diegetic sound design only. Grounded realism, no AI gloss.",
        note:
          "Video Extension works only if you explicitly tag @video1 as the source and describe the seam — «continue camera motion seamlessly», «preserve framing, exposure, color grade». Without this the join breaks in the first second of the new segment.",
      },
    ],
    mistakes: [
      {
        title: "Wall of text instead of TRY CGI blocks",
        explain:
          "A single-paragraph dump loses 30–40% of quality compared to the same text split across LOCATION / STYLE / STORY / CHARACTERS / SHOT STRUCTURE. The model internally routes named blocks into different generation layers, and without explicit headings the routing becomes noisy.",
      },
      {
        title: "@-reference on a character without identity preservation",
        explain:
          "If you have @image1 of a face but no «Strict identity preservation. No morphing or style changes.» phrase, the model «improves» the face between seconds. By second four the character no longer matches the reference. This phrase is TRY CGI's number-one consistency tip.",
      },
      {
        title: "Emotion described in general terms",
        explain:
          "«He is scared», «she is happy», «surprise» render as a dead mask. Seedance 2.0 renders micro-acting only when you describe it explicitly: «jaw clenches, pupils dilate, micro-tremor in the eyelids, nostrils flare». Aim for at least 2–3 micro-signals per act.",
      },
      {
        title: "Epic music by default",
        explain:
          "A prompt with «epic orchestral soundtrack» or «dramatic background score» without the user explicitly asking for it turns a cinematic scene into a trailer. The default is «No music. Diegetic sound design only.» Add music only when the user explicitly requested it.",
      },
      {
        title: "Asking for more than 15 seconds in one prompt",
        explain:
          "The platform cap is 15 seconds per run. «Make a 30-second clip» will either get truncated or break the pacing. The right path is segmentation: first prompt up to 15s, second segment via @video1 with «Extend @video1 by 15 seconds» plus new content description.",
      },
    ],
    faq: [
      {
        q: "How is Seedance 2.0 different from 1.5 Pro?",
        a: "Five key upgrades: free 4–15 second duration instead of fixed 5/10, full multimodality with up to 12 files per request, Consistency Control via @-references, voice cloning and sound design, and second-by-second storyboarding. For serious cinematic content this is a clear upgrade; for simple 5-second shots 1.5 Pro is faster.",
      },
      {
        q: "Which language should I write the prompt in?",
        a: "On the native 即梦 (Jimeng) platform Chinese performs best — the model was trained on Chinese data. On syntx.ai the standard is English and quality is stable. Russian also works but produces slightly less predictable results in complex scenes. Technical anchors (4K, dolly-in, handheld, film grain) always stay in English inside any other language.",
      },
      {
        q: "What about realistic human faces in uploaded references?",
        a: "The platform blocks realistic human faces in @image and @video references — this is a ByteDance policy and cannot be bypassed. Options: use stylized portraits (concept art, illustration), shoot scenes without recognizable faces (silhouettes, back-shots, long shots), or generate the character fully from text without any reference.",
      },
      {
        q: "Can I make a video longer than 15 seconds?",
        a: "Not in a single run — 15 seconds is a hard cap. Long videos are assembled in segments: the first prompt up to 15s ends on a «clean» frame, the second segment uses the first as @video1 with an instruction «Extend @video1 by Xs» plus new content. Between segments you must describe the seam — what is on the last frame of segment one and how it continues in segment two.",
      },
      {
        q: "Why is «No music. Diegetic sound design only.» needed?",
        a: "Without explicit guidance Seedance 2.0 often adds background music — that turns a cinematic scene into a trailer. Serious film sounds like real life: footsteps, breath, ambient noise, no score during hard beats. Diegetic means «sounds whose source is in the frame». This final anchor acts as a filter that switches off the default «trailer mode».",
      },
      {
        q: "Which micro-acting descriptors should go in each act?",
        a: "TRY CGI recommends at least 2–3 micro-signals across three groups. The «gaze» group — eyes darting, pupils dilating, focused gaze, micro-tremor in the eyelids. The «facial muscles» group — jaw clenching, nostrils flaring, brow tension, lips tightening. The «breathing and body» group — visible heavy breathing, shoulder movement on inhale, hand tremor, visible sweat. Without these descriptors the model renders a mask with the right overall emotion but no life.",
      },
      {
        q: "Does Opten support Seedance 2.0?",
        a: "Yes, the Opten extension detects Seedance 2.0 inside syntx.ai and scores prompts against the TRY CGI structure: checks for named LOCATION/STYLE/STORY/CHARACTERS blocks, identity preservation on @-references, micro-acting inside Emotional Acting, an Audio Rule with a diegetic anchor, and anti-AI phrases in the closing line. One click gives you a rewrite in the canonical format.",
      },
    ],
  },
};
