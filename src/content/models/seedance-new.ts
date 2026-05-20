// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedance-new.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedance New: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedance New от ByteDance: bleeding edge версия 2.0+, улучшенная стабильность длинных видео, тайминг-раскадровка и примеры.",
    h1: "Seedance New: как писать промпты, которые модель понимает",
    intro:
      "Seedance New — самая свежая итерация видео-модели ByteDance, наследник Seedance 2.0 с экспериментальными улучшениями. Делает 4–15 секунд до 2K, принимает до 9 изображений, 3 видео и 3 аудио. Заметно стабильнее 2.0 на длинных видео и сложных consistency-сценах. Все техники 2.0 работают в полном объёме — это «2.0+», не отдельная архитектура.",
    sections: [
      {
        heading: "Чем New отличается от 2.0",
        body:
          "New — это bleeding edge: те же лимиты платформы (4–15 секунд, до 2K, 12 файлов на запрос), но улучшенная стабильность генерации длинных видео и более точное следование сложным промптам. На 13–15-секундных нарративах New ломается реже, чем 2.0.\n\nЭкспериментально улучшен Consistency Control — персонажи между актами «дрейфуют» меньше, что критично для cinematic-сцен с эмоциональной аркой. Документации мало, но на практике именно эта модель даёт лучшие результаты на сложных TRY CGI-промптах.\n\nВажно для оценки: поскольку это самая свежая версия, все техники 2.0 (TRY CGI-блоки, @-референсы, тайминг по секундам, identity preservation, микромимика, Audio Rule, анти-AI-якоря) применимы в полном объёме. Оценка должна быть максимально строгой — модель способна обработать промпт любой сложности.",
        bullets: [
          "Все возможности Seedance 2.0 в полном объёме",
          "Улучшенная стабильность длинных видео (13–15с)",
          "Меньше character drift между актами",
          "Лучшее следование сложным многослойным промптам",
          "Bleeding edge — документация ограничена",
        ],
      },
      {
        heading: "TRY CGI-структура промпта",
        body:
          "Канонический порядок блоков: [TITLE & ACT] → LOCATION → REFERENCE ASSIGNMENT → STYLE → STORY → CHARACTERS → SHOT STRUCTURE. Между блоками — ровно одна пустая строка, после двоеточия — пробел.\n\nLOCATION — окружение, свет, погода, ключевые детали фона. STYLE — визуальный пресет («Ultra-photorealistic 4K live-action cinema», «Gritty film grain»). STORY — что происходит в этой генерации в 1–2 предложениях. CHARACTERS — участники, их текущее настроение, внешние особенности. SHOT STRUCTURE — раскадровка с актами.\n\nNew, как и 2.0, внутренне маршрутизирует именованные блоки в разные слои генерации. На New этот эффект усилен: разница между «полотном текста» и блочным промптом больше, чем на 2.0. Если когда-нибудь стоило тратить время на блочную структуру — то именно сейчас.",
      },
      {
        heading: "Тайминг-раскадровка и эмоциональный реализм",
        body:
          "Для 13–15-секундных видео — обязательная тайминг-раскадровка по секундам. На New она работает заметно стабильнее 2.0: меньше склеек и character drift между актами.\n\nКанонический шаблон: 0–4s [THE ENTRY], 4–10s [THE REVELATION], 10–15s [ACTION RESPONSE]. В каждом акте — поля Action / Emotional Acting / Camera / Lighting / VFX / Audio Rule.\n\nЭмоциональный реализм — главный множитель качества. На каждый акт минимум 2–3 микро-сигнала: jaw clenching, pupils dilating, micro-tremor in the eyelids, nostrils flaring, visible heavy breathing, shoulder movement on inhale. Без них даже идеальная композиция выглядит как маска. New рендерит микромимику особенно убедительно — это то, ради чего стоит переходить с 2.0.",
      },
      {
        heading: "@-референсы и identity preservation",
        body:
          "Полный @-синтаксис работает: @image1/@image2/@image3 для персонажей и сцен, @video1/@video2/@video3 для копирования камеры и ритма, @audio1/@audio2/@audio3 для голоса и SFX. Лимит — 9 изображений + 3 видео + 3 аудио = до 12 файлов.\n\nКритическая фраза для @image на персонажа — **Strict identity preservation. No morphing or style changes.** На New character drift между актами заметно меньше, чем на 2.0, но без этой фразы он всё равно появляется к 8–10 секунде.\n\nДля сложных multi-character сцен с двумя и более @image-референсами — повторяй identity preservation для каждого: «Protagonist (@image1): Strict identity preservation. Antagonist (@image2): Strict identity preservation.» — иначе модель смешает черты.",
      },
      {
        heading: "Когда использовать именно New",
        body:
          "Главный сценарий — длинные 13–15-секундные cinematic-нарративы с эмоциональной аркой и сложной camera choreography. На 2.0 такие промпты периодически ломаются на середине; на New ломаются реже.\n\nMulti-character сцены с двумя и более @image-референсами — New держит consistency между персонажами лучше. Сложные TRY CGI-промпты со всеми блоками (LOCATION + REFERENCE ASSIGNMENT + STYLE + STORY + CHARACTERS + 3-актовая SHOT STRUCTURE) на New работают как задумано.\n\nЧего НЕ стоит ждать: New не превращает плохой промпт в хороший. Если в промпте нет identity preservation, нет микромимики, нет анти-AI-якорей — результат всё равно будет посредственным. Все правила 2.0 действуют, New только повышает потолок качества при правильно написанных промптах.",
      },
    ],
    examples: [
      {
        before: "длинное драматичное видео где детектив раскрывает дело",
        after:
          "LOCATION: Dim 1970s detective office, smoke-stained walls, single desk lamp with cracked green glass shade, evidence photos pinned to a corkboard, half-empty whiskey glass on the desk.\n\nREFERENCE ASSIGNMENT:\n- Detective (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n\nSTYLE: Ultra-photorealistic 4K cinematic, anamorphic lens flare, gritty film grain, neo-noir color grade with deep shadows and warm key light. The look of Chinatown, not Netflix gloss.\n\nSTORY: Detective stares at the corkboard, makes the connection that solves the case, and quietly reaches for the phone.\n\nCHARACTERS: Mid-50s detective, weathered face, three-day stubble, loosened tie, rolled shirtsleeves. Tired but sharp.\n\nSHOT STRUCTURE (15 SEC TOTAL):\n\n0-4s — [THE ENTRY]\n  Action: Detective slowly scans the corkboard, eyes moving photo to photo.\n  Emotional Acting: Quiet focus. Brow furrowed, jaw set, lips slightly parted.\n  Camera: Medium shot, slow handheld drift left to right.\n  Lighting: Warm desk lamp from below, deep shadows on the upper face.\n\n4-10s — [THE REVELATION]\n  Action: Detective stops on one photo, leans in, then sharply pulls back as the realization lands.\n  Emotional Acting: Shock turning to grim certainty. Pupils dilate, jaw clenches, micro-tremor in the eyelids, slow exhale through the nose.\n  Camera: Slow dolly-in to extreme close-up of the eyes, then slight push back.\n  Lighting: Lamp glow sharpens, screen of evidence in the pupils.\n\n10-15s — [ACTION RESPONSE]\n  Action: Detective reaches for the rotary phone, dials without looking, lifts the receiver.\n  Emotional Acting: Cold focus. Brow tension, lips tight, steady breathing.\n  Camera: Tight side angle, handheld, slight motion blur.\n  Audio Rule: Diegetic only — phone dial clicks, glass scraping on the desk, slow inhale.\n\nNo music. Diegetic sound design only. Grounded realism, gritty film grain, no cartoonish look, no AI aesthetic.",
        note:
          "Это типичный 15-секундный TRY CGI-промпт под сильную сторону New: длинный нарратив с тремя актами, identity preservation на детектива, эмоциональная арка от focus → revelation → cold resolve через явную микромимику.",
      },
      {
        before: "два героя сидят в баре и спорят, эмоционально",
        after:
          "LOCATION: Smoky neighborhood bar at night, low pendant lights over the booth, neon sign across the window throwing red across one side of the frame.\n\nREFERENCE ASSIGNMENT:\n- Hero A (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n- Hero B (@image2): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n\nSTYLE: Ultra-photorealistic 4K cinematic, 35mm anamorphic, gritty film grain. The look of a Sicario booth scene, not a sitcom.\n\nSTORY: Hero A pushes Hero B for an answer; Hero B refuses; the tension cracks but does not break.\n\nSHOT STRUCTURE (10 SEC TOTAL):\n\n0-4s — [SETUP]\n  Action: Hero A leans forward across the table, voice low and pressing. Hero B keeps his eyes down on the glass.\n  Emotional Acting: Hero A — controlled pressure, jaw set, eyes locked on Hero B. Hero B — refusal, lips tight, slow breathing, brow heavy.\n  Camera: Two-shot, slow handheld dolly-in.\n  Lighting: Warm key from above, red neon rim on the right.\n\n4-10s — [CLIMAX]\n  Action: Hero B looks up sharply, holds the gaze for two beats, then deliberately picks up his glass and drinks.\n  Emotional Acting: Hero B — quiet defiance. Eyes steady, nostrils flare once, micro-tremor at the corner of the mouth. Hero A — micro-recoil, brief blink, jaw flexes.\n  Camera: Cut to tight shot-reverse-shot on each face.\n  Audio Rule: Diegetic only — glass on wood, low background bar chatter, breathing. No music.\n\nNo music. Diegetic sound design only. Grounded realism, no AI gloss.",
        note:
          "Multi-character сцена с двумя @image-референсами — New держит consistency для обоих персонажей надёжнее, чем 2.0. Identity preservation повторяется для каждого, микромимика прописана отдельно на каждое лицо.",
      },
      {
        before: "продли моё 15-секундное видео ещё на 10 секунд",
        after:
          "REFERENCE ASSIGNMENT:\n- Base footage (@video1): Use this as the source. Match exact lighting, color grading, lens, and frame composition of the last frame. Continue camera motion seamlessly.\n\nExtend @video1 by 10 seconds. New content begins exactly from the last frame of @video1 — preserve framing, exposure, and color grade.\n\nSHOT STRUCTURE (10 SEC NEW CONTENT):\n\n0-4s — [CONTINUATION]\n  Action: The character on screen finishes the action from the previous segment and begins to walk away from camera into the corridor.\n  Camera: Continue the slow tracking from @video1, transition into a wider locked-off shot once the character is mid-corridor.\n  Lighting: Match the existing cool corridor fluorescents from the previous segment.\n\n4-10s — [PAYOFF]\n  Action: Character reaches the far door, hesitates, then pushes it open. Light from the other side spills into the corridor.\n  Emotional Acting: Quiet resolution. Slight pause, shoulders settle, slow exhale.\n  Camera: Locked wide, gentle push-in as the door opens.\n  Audio Rule: Diegetic only — footsteps, door hinge, distant ambient. No music.\n\nNo music. Diegetic sound design only. Grounded realism, no AI gloss.",
        note:
          "Video Extension через @video1 + полная TRY CGI-структура для новых 10 секунд. На New склейка из сегмента в сегмент работает плавнее, чем на 2.0 — character drift и color drift сведены к минимуму.",
      },
    ],
    mistakes: [
      {
        title: "Считать New «другой моделью», а не 2.0+",
        explain:
          "Все правила 2.0 действуют для New в полном объёме: TRY CGI-блоки, identity preservation, микромимика, Audio Rule, анти-AI-якоря. New не «перепрошита» — это та же архитектура с улучшениями стабильности. Промпт без блоков на New работает так же плохо, как и на 2.0.",
      },
      {
        title: "Multi-character без identity preservation на каждого",
        explain:
          "Если в сцене два @image-референса, identity preservation надо повторять для каждого: «Hero A (@image1): Strict identity preservation. Hero B (@image2): Strict identity preservation.» Без этого модель смешает черты между персонажами уже к середине клипа.",
      },
      {
        title: "Полагаться на улучшенную стабильность вместо правильной структуры",
        explain:
          "New стабильнее 2.0, но это не значит «можно писать как попало». Сплошной параграф вместо блочной структуры, эмоции общими словами, отсутствие микромимики — всё это даёт на New такой же провал в качестве, как и на 2.0. Бонус стабильности срабатывает только поверх правильно написанного промпта.",
      },
      {
        title: "Эпическая музыка без явной просьбы пользователя",
        explain:
          "Дефолт — «No music. Diegetic sound design only.» Универсальный финальный якорь. Музыка превращает cinematic-сцену в трейлер, а на 15-секундных нарративах с эмоциональной аркой это убивает погружение. Если пользователь хочет музыку — он попросит явно.",
      },
      {
        title: "Запрос на >15 секунд одним промптом",
        explain:
          "New, как и 2.0, ограничен 15 секундами за запуск. На «сделай 30-секундный ролик» модель либо обрежет, либо сломает темп. Правильный путь — сегментация: первый промпт до 15с, второй сегмент через @video1 с «Extend @video1 by 15 seconds» и описанием нового контента.",
      },
    ],
    faq: [
      {
        q: "Стоит ли использовать New вместо Seedance 2.0?",
        a: "Да в двух случаях: нужны длинные 13–15-секундные cinematic-нарративы с эмоциональной аркой (New ломается реже на середине), или нужна multi-character сцена с двумя+ @image-референсами (New держит consistency между персонажами лучше). На простых 5–10-секундных шотах разница между 2.0 и New почти неразличима — берите ту, что доступна на платформе.",
      },
      {
        q: "Все ли техники Seedance 2.0 работают на New?",
        a: "Да, в полном объёме. TRY CGI-блоки, @-референсы (до 9 image + 3 video + 3 audio), identity preservation с фразой «Strict identity preservation. No morphing or style changes.», тайминг-раскадровка по секундам, эмоциональный реализм через микромимику, Audio Rule, анти-AI-якоря — всё работает без изменений. New — это та же архитектура, не другая модель.",
      },
      {
        q: "Почему документации по New так мало?",
        a: "Это самая свежая итерация — bleeding edge версия, которую ByteDance ещё не документировала отдельно. Все техники наследуются от Seedance 2.0 без изменений, поэтому отдельной документации просто нет. Если возникает сомнение «работает ли X на New», ответ почти всегда «да, как на 2.0» — за исключением экспериментальных улучшений стабильности на длинных видео.",
      },
      {
        q: "Можно ли делать видео длиннее 15 секунд на New?",
        a: "Не за один запуск — 15 секунд это жёсткий лимит платформы, тот же, что и в 2.0. Длинные видео собирают сегментами: первый промпт до 15с заканчивается на «чистом» кадре, второй сегмент использует первый как @video1 с инструкцией «Extend @video1 by Xс» и описанием нового контента. Многосегментная генерация в New работает стабильнее — character drift между сегментами меньше.",
      },
      {
        q: "Что значит «character drift» и как его избежать?",
        a: "Character drift — это когда персонаж на @image-референсе меняется между актами или сегментами видео: лицо «улучшается», одежда варьируется, причёска плывёт. На 2.0 это проявляется к 8–10 секунде даже с identity preservation. На New фраза «Strict identity preservation. No morphing or style changes.» работает заметно надёжнее, и character drift сводится к минимуму. Но повторять её всё равно нужно — для каждого @image-референса.",
      },
      {
        q: "Какие сценарии лучше всего раскрывают потенциал New?",
        a: "Три сценария. Первый — длинные 13–15-секундные cinematic-нарративы с тремя актами (ENTRY → REVELATION → ACTION RESPONSE) и эмоциональной аркой. Второй — multi-character сцены с двумя+ @image-референсами, где consistency между персонажами критична. Третий — Video Extension через @video1 на несколько сегментов, где seamless continuation важнее всего. Во всех трёх New ощутимо выигрывает у 2.0.",
      },
      {
        q: "Поддерживается ли Opten для Seedance New?",
        a: "Да, расширение Opten распознаёт Seedance New внутри syntx.ai и оценивает промпт по той же TRY CGI-структуре, что и для 2.0: проверяет именованные блоки LOCATION/STYLE/STORY/CHARACTERS, identity preservation на каждом @-референсе, микромимику в Emotional Acting, Audio Rule с diegetic-якорем, анти-AI-фразы в финале. Одним кликом получишь rewrite, использующий все преимущества bleeding edge версии.",
      },
    ],
  },
  en: {
    title: "Seedance New Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedance New: bleeding-edge 2.0+ version, improved long-video stability, timestamp storyboarding, and examples.",
    h1: "Seedance New: how to write prompts the model actually understands",
    intro:
      "Seedance New is the latest iteration of ByteDance's video model, successor to Seedance 2.0 with experimental refinements. It makes 4–15 second clips up to 2K and accepts up to 9 images, 3 videos, and 3 audio inputs. Noticeably more stable than 2.0 on long videos and consistency scenes. All 2.0 techniques apply in full — this is «2.0+», not a separate architecture.",
    sections: [
      {
        heading: "How New differs from 2.0",
        body:
          "New is bleeding edge: the same platform limits (4–15 seconds, up to 2K, 12 files per request), but better long-video generation stability and tighter adherence to complex prompts. On 13–15-second narratives New breaks less often than 2.0.\n\nConsistency Control is experimentally improved — characters drift less between acts, which matters for cinematic scenes with an emotional arc. Documentation is thin, but in practice this model delivers the best results on complex TRY CGI prompts.\n\nKey rating note: as the latest version, all 2.0 techniques (TRY CGI blocks, @-references, per-second timing, identity preservation, micro-acting, Audio Rule, anti-AI anchors) apply in full. Scoring should be maximally strict — the model can handle prompts of any complexity.",
        bullets: [
          "All Seedance 2.0 capabilities in full",
          "Improved long-video stability (13–15s)",
          "Less character drift between acts",
          "Better adherence to complex layered prompts",
          "Bleeding edge — documentation is limited",
        ],
      },
      {
        heading: "TRY CGI prompt structure",
        body:
          "Canonical block order: [TITLE & ACT] → LOCATION → REFERENCE ASSIGNMENT → STYLE → STORY → CHARACTERS → SHOT STRUCTURE. One blank line between blocks, a space after every colon.\n\nLOCATION — environment, lighting, weather, key background details. STYLE — visual preset («Ultra-photorealistic 4K live-action cinema», «Gritty film grain»). STORY — what happens in this generation in one or two sentences. CHARACTERS — participants, their current mood, current appearance. SHOT STRUCTURE — the act-based breakdown.\n\nNew, like 2.0, internally routes named blocks into different generation layers. On New this effect is amplified: the gap between «wall of text» and a block-structured prompt is wider than on 2.0. If it was ever worth spending time on block structure — it is now.",
      },
      {
        heading: "Timestamp storyboarding and emotional realism",
        body:
          "For 13–15-second videos, per-second storyboarding is mandatory. On New it works noticeably more stably than on 2.0: fewer seams and less character drift between acts.\n\nCanonical template: 0–4s [THE ENTRY], 4–10s [THE REVELATION], 10–15s [ACTION RESPONSE]. Each act has fields Action / Emotional Acting / Camera / Lighting / VFX / Audio Rule.\n\nEmotional realism is the main quality multiplier. At least 2–3 micro-signals per act: jaw clenching, pupils dilating, micro-tremor in the eyelids, nostrils flaring, visible heavy breathing, shoulder movement on inhale. Without these even a perfect composition reads as a mask. New renders micro-acting especially convincingly — this is the reason to move from 2.0 to New.",
      },
      {
        heading: "@-references and identity preservation",
        body:
          "Full @-syntax works: @image1/@image2/@image3 for characters and scenes, @video1/@video2/@video3 for camera and rhythm cloning, @audio1/@audio2/@audio3 for voice and SFX. Cap is 9 images + 3 videos + 3 audio = up to 12 files.\n\nThe critical phrase for any @image of a character — **Strict identity preservation. No morphing or style changes.** On New character drift between acts is noticeably lower than on 2.0, but without this phrase it still appears by second 8–10.\n\nFor complex multi-character scenes with two or more @image references, repeat identity preservation for each: «Protagonist (@image1): Strict identity preservation. Antagonist (@image2): Strict identity preservation.» — otherwise the model blends features across characters.",
      },
      {
        heading: "When to specifically use New",
        body:
          "The main scenario is long 13–15-second cinematic narratives with an emotional arc and complex camera choreography. On 2.0 such prompts occasionally break mid-clip; on New they break less.\n\nMulti-character scenes with two or more @image references — New holds consistency between characters better. Complex TRY CGI prompts with all blocks (LOCATION + REFERENCE ASSIGNMENT + STYLE + STORY + CHARACTERS + a 3-act SHOT STRUCTURE) on New work the way they are intended to.\n\nDo not expect: New does not turn a bad prompt into a good one. Without identity preservation, micro-acting, or anti-AI anchors the result will still be mediocre. All 2.0 rules apply; New only raises the ceiling for properly written prompts.",
      },
    ],
    examples: [
      {
        before: "long dramatic video where a detective cracks the case",
        after:
          "LOCATION: Dim 1970s detective office, smoke-stained walls, single desk lamp with cracked green glass shade, evidence photos pinned to a corkboard, half-empty whiskey glass on the desk.\n\nREFERENCE ASSIGNMENT:\n- Detective (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n\nSTYLE: Ultra-photorealistic 4K cinematic, anamorphic lens flare, gritty film grain, neo-noir color grade with deep shadows and warm key light. The look of Chinatown, not Netflix gloss.\n\nSTORY: Detective stares at the corkboard, makes the connection that solves the case, and quietly reaches for the phone.\n\nCHARACTERS: Mid-50s detective, weathered face, three-day stubble, loosened tie, rolled shirtsleeves. Tired but sharp.\n\nSHOT STRUCTURE (15 SEC TOTAL):\n\n0-4s — [THE ENTRY]\n  Action: Detective slowly scans the corkboard, eyes moving photo to photo.\n  Emotional Acting: Quiet focus. Brow furrowed, jaw set, lips slightly parted.\n  Camera: Medium shot, slow handheld drift left to right.\n  Lighting: Warm desk lamp from below, deep shadows on the upper face.\n\n4-10s — [THE REVELATION]\n  Action: Detective stops on one photo, leans in, then sharply pulls back as the realization lands.\n  Emotional Acting: Shock turning to grim certainty. Pupils dilate, jaw clenches, micro-tremor in the eyelids, slow exhale through the nose.\n  Camera: Slow dolly-in to extreme close-up of the eyes, then slight push back.\n  Lighting: Lamp glow sharpens, screen of evidence in the pupils.\n\n10-15s — [ACTION RESPONSE]\n  Action: Detective reaches for the rotary phone, dials without looking, lifts the receiver.\n  Emotional Acting: Cold focus. Brow tension, lips tight, steady breathing.\n  Camera: Tight side angle, handheld, slight motion blur.\n  Audio Rule: Diegetic only — phone dial clicks, glass scraping on the desk, slow inhale.\n\nNo music. Diegetic sound design only. Grounded realism, gritty film grain, no cartoonish look, no AI aesthetic.",
        note:
          "Textbook 15-second TRY CGI prompt that plays to New's strengths: long narrative with three acts, identity preservation on the detective, emotional arc from focus → revelation → cold resolve via explicit micro-acting.",
      },
      {
        before: "two characters in a bar arguing, emotional",
        after:
          "LOCATION: Smoky neighborhood bar at night, low pendant lights over the booth, neon sign across the window throwing red across one side of the frame.\n\nREFERENCE ASSIGNMENT:\n- Hero A (@image1): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n- Hero B (@image2): Strict identity preservation. Use this image for exact facial features and wardrobe. No morphing or style changes.\n\nSTYLE: Ultra-photorealistic 4K cinematic, 35mm anamorphic, gritty film grain. The look of a Sicario booth scene, not a sitcom.\n\nSTORY: Hero A pushes Hero B for an answer; Hero B refuses; the tension cracks but does not break.\n\nSHOT STRUCTURE (10 SEC TOTAL):\n\n0-4s — [SETUP]\n  Action: Hero A leans forward across the table, voice low and pressing. Hero B keeps his eyes down on the glass.\n  Emotional Acting: Hero A — controlled pressure, jaw set, eyes locked on Hero B. Hero B — refusal, lips tight, slow breathing, brow heavy.\n  Camera: Two-shot, slow handheld dolly-in.\n  Lighting: Warm key from above, red neon rim on the right.\n\n4-10s — [CLIMAX]\n  Action: Hero B looks up sharply, holds the gaze for two beats, then deliberately picks up his glass and drinks.\n  Emotional Acting: Hero B — quiet defiance. Eyes steady, nostrils flare once, micro-tremor at the corner of the mouth. Hero A — micro-recoil, brief blink, jaw flexes.\n  Camera: Cut to tight shot-reverse-shot on each face.\n  Audio Rule: Diegetic only — glass on wood, low background bar chatter, breathing. No music.\n\nNo music. Diegetic sound design only. Grounded realism, no AI gloss.",
        note:
          "Multi-character scene with two @image references — New holds consistency for both characters more reliably than 2.0. Identity preservation is repeated for each, micro-acting is described separately for each face.",
      },
      {
        before: "extend my 15-second video by another 10 seconds",
        after:
          "REFERENCE ASSIGNMENT:\n- Base footage (@video1): Use this as the source. Match exact lighting, color grading, lens, and frame composition of the last frame. Continue camera motion seamlessly.\n\nExtend @video1 by 10 seconds. New content begins exactly from the last frame of @video1 — preserve framing, exposure, and color grade.\n\nSHOT STRUCTURE (10 SEC NEW CONTENT):\n\n0-4s — [CONTINUATION]\n  Action: The character on screen finishes the action from the previous segment and begins to walk away from camera into the corridor.\n  Camera: Continue the slow tracking from @video1, transition into a wider locked-off shot once the character is mid-corridor.\n  Lighting: Match the existing cool corridor fluorescents from the previous segment.\n\n4-10s — [PAYOFF]\n  Action: Character reaches the far door, hesitates, then pushes it open. Light from the other side spills into the corridor.\n  Emotional Acting: Quiet resolution. Slight pause, shoulders settle, slow exhale.\n  Camera: Locked wide, gentle push-in as the door opens.\n  Audio Rule: Diegetic only — footsteps, door hinge, distant ambient. No music.\n\nNo music. Diegetic sound design only. Grounded realism, no AI gloss.",
        note:
          "Video Extension via @video1 plus a full TRY CGI structure for the new 10 seconds. On New the segment-to-segment seam is smoother than on 2.0 — character drift and color drift are minimized.",
      },
    ],
    mistakes: [
      {
        title: "Treating New as «a different model», not 2.0+",
        explain:
          "All 2.0 rules apply to New in full: TRY CGI blocks, identity preservation, micro-acting, Audio Rule, anti-AI anchors. New is not «re-architected» — it's the same architecture with stability improvements. A blockless prompt on New performs as poorly as on 2.0.",
      },
      {
        title: "Multi-character without identity preservation on each",
        explain:
          "If the scene has two @image references, identity preservation must be repeated for each: «Hero A (@image1): Strict identity preservation. Hero B (@image2): Strict identity preservation.» Without that the model blends features between characters by mid-clip.",
      },
      {
        title: "Relying on improved stability instead of proper structure",
        explain:
          "New is more stable than 2.0, but that doesn't mean «write whatever». A solid paragraph instead of block structure, generic emotion words, no micro-acting — all of these produce the same quality drop on New as on 2.0. The stability bonus only applies on top of a properly written prompt.",
      },
      {
        title: "Epic music without the user explicitly asking for it",
        explain:
          "Default is «No music. Diegetic sound design only.» Universal closing anchor. Music turns a cinematic scene into a trailer, and on 15-second narratives with an emotional arc it kills immersion. If the user wants music, they will ask explicitly.",
      },
      {
        title: "Asking for more than 15 seconds in one prompt",
        explain:
          "New, like 2.0, is capped at 15 seconds per run. «Make a 30-second clip» will either get truncated or break the pacing. The right path is segmentation: first prompt up to 15s, second segment via @video1 with «Extend @video1 by 15 seconds» plus a new-content description.",
      },
    ],
    faq: [
      {
        q: "Should I use New instead of Seedance 2.0?",
        a: "Yes in two cases: when you need long 13–15-second cinematic narratives with an emotional arc (New breaks less often mid-clip), or when you need a multi-character scene with two+ @image references (New holds consistency between characters better). On simple 5–10-second shots the difference between 2.0 and New is almost imperceptible — take whichever is available on the platform.",
      },
      {
        q: "Do all Seedance 2.0 techniques work on New?",
        a: "Yes, in full. TRY CGI blocks, @-references (up to 9 image + 3 video + 3 audio), identity preservation with the phrase «Strict identity preservation. No morphing or style changes.», per-second storyboarding, emotional realism via micro-acting, Audio Rule, anti-AI anchors — everything works unchanged. New is the same architecture, not a different model.",
      },
      {
        q: "Why is documentation on New so thin?",
        a: "It's the freshest iteration — a bleeding-edge version that ByteDance hasn't documented separately yet. All techniques inherit from Seedance 2.0 unchanged, so there is simply no separate documentation. When in doubt about whether X works on New, the answer is almost always «yes, like on 2.0» — with the exception of experimental long-video stability gains.",
      },
      {
        q: "Can I make videos longer than 15 seconds on New?",
        a: "Not in one run — 15 seconds is a hard platform cap, the same as on 2.0. Long videos are assembled in segments: the first prompt up to 15s ends on a «clean» frame, the second segment uses the first as @video1 with an instruction «Extend @video1 by Xs» plus a new-content description. Multi-segment generation on New is more stable — segment-to-segment character drift is reduced.",
      },
      {
        q: "What is «character drift» and how do I avoid it?",
        a: "Character drift is when a character on an @image reference changes between acts or segments: face «improves», wardrobe varies, hairstyle floats. On 2.0 it shows up by second 8–10 even with identity preservation. On New the phrase «Strict identity preservation. No morphing or style changes.» works noticeably more reliably, and character drift is minimized. But you still have to repeat it for every @image reference.",
      },
      {
        q: "Which scenarios best showcase New's potential?",
        a: "Three scenarios. First — long 13–15-second cinematic narratives with three acts (ENTRY → REVELATION → ACTION RESPONSE) and an emotional arc. Second — multi-character scenes with two+ @image references where consistency between characters is critical. Third — Video Extension via @video1 across several segments where seamless continuation matters most. In all three New tangibly outperforms 2.0.",
      },
      {
        q: "Does Opten support Seedance New?",
        a: "Yes, the Opten extension detects Seedance New inside syntx.ai and scores prompts against the same TRY CGI structure as for 2.0: it checks named LOCATION/STYLE/STORY/CHARACTERS blocks, identity preservation on every @-reference, micro-acting inside Emotional Acting, an Audio Rule with a diegetic anchor, and anti-AI phrases in the closing line. One click gives you a rewrite that uses every bleeding-edge advantage.",
      },
    ],
  },
};
