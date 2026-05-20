// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for sora-2.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Sora 2: структура, ошибки, примеры",
    description:
      "Как писать промпты для Sora 2 от OpenAI: структура брифа, камера и звук, Characters API, продление клипа до 120 секунд, типичные ошибки и примеры до/после.",
    h1: "Sora 2: как писать промпты, которые модель понимает",
    intro:
      "Sora 2 — video-модель от OpenAI с нативным звуком, поддержкой до двух персонажей через Characters API и клипами 4-20 секунд. Промпт работает как бриф для оператора-постановщика: стиль задаётся первым, дальше идёт субъект, действие, камера и звук. Длительность и разрешение задаются только через API-параметры, не текстом.",
    sections: [
      {
        heading: "Что умеет Sora 2",
        body:
          "Sora 2 генерирует клипы 4, 8, 12, 16 или 20 секунд в разрешениях 720×1280 или 1280×720 (Pro-версия добавляет 1024×1792, 1792×1024, 1080×1920, 1920×1080). Модель умеет нативный звук — диалоги, окружение, SFX и музыку. Через Characters API можно загрузить короткое видео персонажа (MP4, 2-4 секунды, 720p-1080p) и переиспользовать его между клипами; одновременно поддерживается до двух персонажей.\n\nУникальная фича — продление видео до 6 раз, суммарно до 120 секунд. При продлении модель использует полный оригинальный клип как контекст, а не последний кадр — это даёт стабильность движения между склейками. Для итерации часто проще собрать длинную сцену из двух склеенных четырёхсекундных клипов: модель надёжнее следует инструкциям в коротких отрезках.",
        bullets: [
          "Клипы 4-20 секунд, нативный звук и диалоги",
          "До 2 персонажей через Characters API (MP4-референс)",
          "Продление до 120 секунд с полным клипом в контексте",
          "Image-to-video: входное фото как якорь первого кадра",
          "Video Edit для точечных правок существующего клипа",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Стиль/Эстетика] + [Субъект/Персонаж] + [Сцена/Среда] + [Действие/Движение] + [Камера: кадр + движение] + [Освещение/Цвет] + [Настроение] + [Звук/Диалоги].\n\nГлавное правило — стиль идёт первым. Это самый мощный рычаг управления: одни и те же детали выглядят радикально по-разному при «Hollywood drama», «handheld smartphone clip» или «grainy vintage commercial». Дальше — конкретный субъект (не «a person», а «a woman in a red coat»), конкретное действие с глаголами («pedals three times, brakes, stops at crosswalk» вместо «moves quickly»), и обязательно крупность плана плюс движение камеры.\n\nПромпт — описание одного шота, не всей истории. Длинную сцену собирай из серии коротких клипов через продление или монтаж в посте.",
      },
      {
        heading: "Шаблон с блоками Cinematography и Actions",
        body:
          "Официальный шаблон Sora 2 разбивает промпт на блоки. Сверху — прозаическое описание сцены, персонажей, костюмов, декораций. Дальше:\n\nCinematography:\nCamera: medium close-up, slow push-in\nLighting: warm key from overhead practical, cool spill from window\nMood: gentle, whimsical, a touch of suspense\n\nActions:\n- The robot taps the bulb; sparks crackle.\n- It flinches, dropping the bulb.\n- A puff of steam escapes its chest.\n\nDialogue:\n- Robot: \"Almost lost it... but I got it!\"\n\nBackground Sound:\nRain, ticking clock, soft mechanical hum.\n\nЭта структура читается моделью как раскадровка. Для длинных клипов добавляй посекундную раскладку: «0.00-2.40 — Arrival Drift (32mm, slow dolly left)» — модель привязывает действия к таймкодам.",
      },
      {
        heading: "Звук, диалоги и палитра",
        body:
          "Sora 2 генерирует аудио вместе с видео. Даже для тихих сцен указывай хотя бы один ритмический звук — «distant traffic hiss», «a crisp snap», «faint mechanical hum» — иначе модель додумает фон сама. Диалоги выноси отдельным блоком с указанием персонажа и эмоции: «Detective (low voice): \"You're lying. I can hear it in your silence.\"».\n\nЦветовая палитра — 3-5 цветовых якорей через запятую: «amber, cream, walnut brown» или «teal and orange». Это критично для стабильности кадров при монтаже серии клипов. Освещение описывай через источники, а не яркость: не «brightly lit», а «soft window light with warm lamp fill, cool rim from hallway». Конкретные параметры объективов («Anamorphic 2.0x, shallow DOF, volumetric light») работают лучше абстрактного «cinematic look».",
      },
      {
        heading: "Продвинутый уровень: ультра-детальный промпт",
        body:
          "Для максимального контроля Sora 2 принимает ультра-детальные промпты: формат и внешний вид (shutter angle, capture type, halation), объективы и фильтры (32mm, 50mm, Pro-Mist, CPL), цветокоррекция (highlights, mids, blacks по отдельности), освещение и атмосфера (4×4 ultrabounce, negative fill, практические источники, дымка), детальные костюмы, реквизит и массовка, звуковой дизайн с уровнями LUFS, посекундная раскладка действий с точными таймкодами.\n\nДля Video Edit — описывай ровно одно конкретное изменение: «same shot, switch to 85mm» или «Change the color of the monster to orange». Не пытайся полностью переделать клип edit-режимом — это инструмент для точечных правок, и попытка переписать сцену целиком даст морфинг. Для радикальных изменений генерируй заново с новым промптом.",
      },
    ],
    examples: [
      {
        before: "a person walking down a street at night",
        after:
          "Cinematic neo-noir style, shot on 35mm film with subtle halation and natural grain. Wide-angle shot slowly pushing forward down a rain-soaked Tokyo street at 2am, neon signs reflecting in puddles. A woman in a black trench coat walks past a ramen shop, hands in pockets, breath visible in the cold air. Camera: low angle, slow dolly-in from eye level. Lighting: cyan key from neon, warm spill from shop windows. Palette: teal, magenta, amber. Mood: cinematic, lonely, tense. Background Sound: distant traffic hiss, rain on pavement, faint izakaya chatter.",
        note:
          "Стиль идёт первым, конкретный субъект с одеждой, действие с глаголами, явные источники света и палитра, ритмический звуковой фон.",
      },
      {
        before: "an old man tells a story",
        after:
          "In a 90s documentary-style interview, an elderly Swedish fisherman sits in a dim study lined with maritime maps. He wears a wool sweater and has a weathered face with deep wrinkles. Cinematography:\nCamera: medium close-up, static on tripod with slight handheld micro-shake\nLighting: soft window light from screen-left, warm practical lamp fill\nMood: nostalgic, intimate\n\nActions:\n- He looks down at his hands, then up to camera.\n- A faint smile crosses his face.\n\nDialogue:\n- Fisherman (quietly): \"I still remember when I was young.\"\n\nBackground Sound: distant foghorn, ticking wall clock, faint creak of the chair.",
        note:
          "Блочная структура Cinematography + Actions + Dialogue + Background Sound — модель читает это как раскадровку, диалог через двоеточие, не кавычки.",
      },
      {
        before: "a product video of headphones",
        after:
          "Commercial photography style, clean studio aesthetic with soft shadows. Smooth 360-degree rotating shot of matte-black wireless headphones on a white marble pedestal against a seamless white cyclorama. Subtle reflection on the pedestal surface. Camera: medium close-up, slow orbit at eye level, shallow depth of field. Lighting: large softbox key from above, gentle rim light from behind, gradient fill. Palette: white, charcoal, brushed metal accents. Mood: premium, minimal, confident. Background Sound: a single subtle electronic chime at the start, then ambient room tone.",
        note:
          "Продуктовый шот не требует драмы, но требует конкретики: тип материала, точное движение камеры, сетап освещения, минимальный, но осмысленный звук.",
      },
    ],
    mistakes: [
      {
        title: "Длительность и разрешение в тексте промпта",
        explain:
          "«Make this an 8-second 1080p video» — модель эти параметры из текста не читает. Длительность (seconds), размер (size) и persona (characters) задаются только через API-параметры. В промпте они становятся мусором и могут конфликтовать с настройками. Убирай их из текста и выставляй через UI или API.",
      },
      {
        title: "Размытое действие вместо конкретного глагола",
        explain:
          "«Person moves quickly» — модель не знает, как именно двигается субъект. Используй конкретные глаголы с таймингом: «sprinting», «tiptoeing», «gliding», «pedals three times, brakes, stops». Чем точнее глагол, тем меньше модель додумывает, тем стабильнее результат между генерациями.",
      },
      {
        title: "Несколько сцен в одном промпте",
        explain:
          "Один промпт = один шот. Если описать «she leaves the cafe, walks to the car, drives away» — модель попытается уместить три действия в один клип и съедет в морфинг. Разбивай историю на серию 4-8-секундных клипов и склеивай через продление или монтаж. Это даёт и стабильность, и контроль.",
      },
      {
        title: "Диалоги в кавычках без указания персонажа",
        explain:
          "«She says \"hello there\"» работает хуже, чем блочный диалог с явным персонажем и эмоцией: «Woman (warmly): \"Hello there.\"». Для нескольких персонажей чётко указывай кто говорит. При двух персонажах используй Characters API, чтобы они не «дрейфовали» внешне между генерациями.",
      },
      {
        title: "Абстрактное «cinematic look» вместо параметров",
        explain:
          "Слово «cinematic» само по себе не даёт модели направления — она интерпретирует его статистически. Заменяй конкретикой: «Anamorphic 2.0x lens, shallow DOF, volumetric light», «shot on Kodak Vision3 500T», «warm Kodak grade with subtle halation». Конкретные параметры объективов и плёнки — самый сильный стилистический рычаг.",
      },
    ],
    faq: [
      {
        q: "Сколько секунд длится один клип Sora 2?",
        a: "Один клип — 4, 8, 12, 16 или 20 секунд. Длительность задаётся через API-параметр seconds, не в тексте промпта. Дальше можно продлевать клип до 6 раз, суммарно до 120 секунд — при продлении модель использует полный исходный клип как контекст. Для нестабильных сцен 4-секундные отрезки работают надёжнее длинных.",
      },
      {
        q: "Чем Sora 2 Pro отличается от обычной Sora 2?",
        a: "Sora 2 Pro поддерживает больше разрешений: помимо 720×1280 и 1280×720 — ещё 1024×1792, 1792×1024, 1080×1920 и 1920×1080. Это даёт честное Full HD в обеих ориентациях и вертикальные форматы под Reels/Shorts/TikTok. Логика промптинга идентична, разница только в выходных разрешениях, доступных через API.",
      },
      {
        q: "Как добавить своего персонажа в видео?",
        a: "Через Characters API. Загружаешь короткое видео (MP4, 2-4 секунды, 720p-1080p, 16:9 или 9:16), модель учит персонажа, выдаёт ID. Дальше в промптах указываешь имя и ID — персонаж появляется в разных сценах с консистентной внешностью. Максимум 2 персонажа на одну генерацию; больше модель не вытягивает и срывается в морфинг.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Технически можно, но английский даёт заметно более стабильные результаты — особенно для камерных терминов, плёночных форматов и стилистических референсов. Кинематографический словарь («Anamorphic 2.0x», «Kodak Vision3 500T», «slow dolly-in») в английском исторически тренируется лучше. Промпт на английском, диалоги внутри клипа — на любом языке.",
      },
      {
        q: "Почему модель добавляет странный звук, которого я не просил?",
        a: "Если фоновый звук не описан явно — Sora 2 додумает его сама, и часто неудачно: появляется «studio audience laughter» в драматичных сценах или несуразный saxophone. Всегда явно прописывай Background Sound — даже для тихих сцен укажи один ритмический звук: «distant traffic hiss», «ticking wall clock», «soft mechanical hum».",
      },
      {
        q: "Что делать, если результат каждый раз разный при одинаковом промпте?",
        a: "Это особенность Sora 2 — даже идентичный промпт даёт вариативный результат между генерациями. Не пытайся «попасть» перегенерацией: лучше уточняй промпт. Добавь конкретный объектив, цветовые якоря, посекундную раскладку действий — это сужает пространство интерпретаций. Для серии шотов с одним персонажем используй Characters API.",
      },
      {
        q: "Поддерживается ли Opten для Sora 2?",
        a: "Да, расширение Opten распознаёт Sora 2 на платформах OpenAI и fal.ai и оценивает промпты по структуре, описанной выше: стиль в начале, конкретный субъект и действие, обязательная камера, явный фоновый звук, разделение длинных историй на шоты. Одним кликом можно получить rewrite с правильной структурой и без длительности/разрешения в тексте.",
      },
    ],
  },
  en: {
    title: "Sora 2 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for OpenAI's Sora 2: brief structure, camera and sound, Characters API, extension to 120 seconds, mistakes, before/after examples.",
    h1: "Sora 2: how to write prompts the model actually understands",
    intro:
      "Sora 2 is OpenAI's video model with native audio, support for up to two characters via the Characters API, and clips of 4-20 seconds. The prompt works like a brief for a director of photography: style first, then subject, action, camera, and sound. Duration and resolution are set only through API parameters, never in the text.",
    sections: [
      {
        heading: "What Sora 2 does",
        body:
          "Sora 2 generates clips of 4, 8, 12, 16, or 20 seconds at 720×1280 or 1280×720 (the Pro tier adds 1024×1792, 1792×1024, 1080×1920, 1920×1080). The model produces native audio — dialogue, ambience, SFX, and music. Through the Characters API you can upload a short character video (MP4, 2-4 seconds, 720p-1080p) and reuse it across clips; up to two characters are supported at once.\n\nA unique feature is video extension — up to 6 times, summing to 120 seconds total. On extension, the model uses the full original clip as context, not just the last frame, which keeps motion stable across joins. For iteration it is often easier to assemble a long scene from two stitched four-second clips: the model follows instructions more reliably in shorter takes.",
        bullets: [
          "Clips of 4-20 seconds, native audio and dialogue",
          "Up to 2 characters via the Characters API (MP4 reference)",
          "Extension up to 120 seconds with the full clip in context",
          "Image-to-video: input photo anchors the first frame",
          "Video Edit for surgical changes to an existing clip",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Style/Aesthetic] + [Subject/Character] + [Scene/Environment] + [Action/Motion] + [Camera: shot + movement] + [Lighting/Color] + [Mood] + [Sound/Dialogue].\n\nThe main rule — style goes first. It is the most powerful control lever: the same details look radically different under «Hollywood drama», «handheld smartphone clip», or «grainy vintage commercial». Then comes a concrete subject (not «a person» but «a woman in a red coat»), concrete action with verbs («pedals three times, brakes, stops at the crosswalk» instead of «moves quickly»), and always a shot size plus camera movement.\n\nA prompt describes one shot, not the whole story. Build long scenes from a series of short clips via extension or post-production cut.",
      },
      {
        heading: "Template with Cinematography and Actions blocks",
        body:
          "The official Sora 2 template breaks the prompt into blocks. At the top — a prose description of the scene, characters, wardrobe, set. Then:\n\nCinematography:\nCamera: medium close-up, slow push-in\nLighting: warm key from overhead practical, cool spill from window\nMood: gentle, whimsical, a touch of suspense\n\nActions:\n- The robot taps the bulb; sparks crackle.\n- It flinches, dropping the bulb.\n- A puff of steam escapes its chest.\n\nDialogue:\n- Robot: \"Almost lost it... but I got it!\"\n\nBackground Sound:\nRain, ticking clock, soft mechanical hum.\n\nThe model reads this structure as a shot breakdown. For longer clips add a second-by-second layout: «0.00-2.40 — Arrival Drift (32mm, slow dolly left)» — the model anchors actions to timecodes.",
      },
      {
        heading: "Sound, dialogue, and palette",
        body:
          "Sora 2 generates audio together with video. Even for quiet scenes specify at least one rhythmic sound — «distant traffic hiss», «a crisp snap», «faint mechanical hum» — otherwise the model will invent the background on its own. Put dialogue in a separate block with character name and emotion: «Detective (low voice): \"You're lying. I can hear it in your silence.\"».\n\nFor the color palette use 3-5 anchors separated by commas: «amber, cream, walnut brown» or «teal and orange». This is critical for cross-clip stability when cutting a series. Describe lighting through sources, not brightness: not «brightly lit» but «soft window light with warm lamp fill, cool rim from hallway». Concrete lens parameters («Anamorphic 2.0x, shallow DOF, volumetric light») work far better than the abstract «cinematic look».",
      },
      {
        heading: "Advanced level: ultra-detailed prompt",
        body:
          "For maximum control Sora 2 accepts ultra-detailed prompts: format and look (shutter angle, capture type, halation), lenses and filters (32mm, 50mm, Pro-Mist, CPL), color grade (highlights, mids, blacks separately), lighting and atmosphere (4×4 ultrabounce, negative fill, practicals, haze), wardrobe and props with detailed extras, sound design with LUFS levels, a second-by-second action breakdown with precise timecodes.\n\nFor Video Edit, describe exactly one concrete change: «same shot, switch to 85mm» or «Change the color of the monster to orange». Do not try to fully redesign a clip via edit mode — it is a tool for surgical fixes, and attempting to rewrite the whole scene yields morphing. For radical changes regenerate with a new prompt.",
      },
    ],
    examples: [
      {
        before: "a person walking down a street at night",
        after:
          "Cinematic neo-noir style, shot on 35mm film with subtle halation and natural grain. Wide-angle shot slowly pushing forward down a rain-soaked Tokyo street at 2am, neon signs reflecting in puddles. A woman in a black trench coat walks past a ramen shop, hands in pockets, breath visible in the cold air. Camera: low angle, slow dolly-in from eye level. Lighting: cyan key from neon, warm spill from shop windows. Palette: teal, magenta, amber. Mood: cinematic, lonely, tense. Background Sound: distant traffic hiss, rain on pavement, faint izakaya chatter.",
        note:
          "Style first, concrete subject with wardrobe, action with verbs, explicit light sources and palette, a rhythmic sound bed.",
      },
      {
        before: "an old man tells a story",
        after:
          "In a 90s documentary-style interview, an elderly Swedish fisherman sits in a dim study lined with maritime maps. He wears a wool sweater and has a weathered face with deep wrinkles. Cinematography:\nCamera: medium close-up, static on tripod with slight handheld micro-shake\nLighting: soft window light from screen-left, warm practical lamp fill\nMood: nostalgic, intimate\n\nActions:\n- He looks down at his hands, then up to camera.\n- A faint smile crosses his face.\n\nDialogue:\n- Fisherman (quietly): \"I still remember when I was young.\"\n\nBackground Sound: distant foghorn, ticking wall clock, faint creak of the chair.",
        note:
          "Block structure Cinematography + Actions + Dialogue + Background Sound — the model reads this as a shot breakdown, dialogue via colon, not quotes.",
      },
      {
        before: "a product video of headphones",
        after:
          "Commercial photography style, clean studio aesthetic with soft shadows. Smooth 360-degree rotating shot of matte-black wireless headphones on a white marble pedestal against a seamless white cyclorama. Subtle reflection on the pedestal surface. Camera: medium close-up, slow orbit at eye level, shallow depth of field. Lighting: large softbox key from above, gentle rim light from behind, gradient fill. Palette: white, charcoal, brushed metal accents. Mood: premium, minimal, confident. Background Sound: a single subtle electronic chime at the start, then ambient room tone.",
        note:
          "A product shot does not need drama but needs specifics: material type, exact camera motion, lighting setup, minimal but intentional sound.",
      },
    ],
    mistakes: [
      {
        title: "Duration and resolution written in the prompt text",
        explain:
          "«Make this an 8-second 1080p video» — the model does not read those parameters from text. Duration (seconds), size, and characters are set through API parameters only. In the prompt they become noise and can conflict with the actual settings. Strip them from the text and set them via the UI or API.",
      },
      {
        title: "Vague motion instead of a concrete verb",
        explain:
          "«Person moves quickly» — the model does not know how the subject moves. Use concrete verbs with timing: «sprinting», «tiptoeing», «gliding», «pedals three times, brakes, stops». The more precise the verb, the less the model has to invent and the more stable the result is across generations.",
      },
      {
        title: "Several scenes packed into one prompt",
        explain:
          "One prompt equals one shot. If you describe «she leaves the cafe, walks to the car, drives away» the model tries to fit three actions into a single clip and slides into morphing. Break the story into a series of 4-8 second clips and join them via extension or post cut. You get both stability and control.",
      },
      {
        title: "Dialogue in quotes without a named speaker",
        explain:
          "«She says \"hello there\"» works worse than a block dialogue with an explicit speaker and emotion: «Woman (warmly): \"Hello there.\"». For multiple characters state clearly who is speaking. With two characters use the Characters API so they do not drift visually between generations.",
      },
      {
        title: "Abstract «cinematic look» instead of parameters",
        explain:
          "The word «cinematic» alone gives the model no direction — it interprets it statistically. Replace it with specifics: «Anamorphic 2.0x lens, shallow DOF, volumetric light», «shot on Kodak Vision3 500T», «warm Kodak grade with subtle halation». Concrete lens and film parameters are the strongest stylistic lever.",
      },
    ],
    faq: [
      {
        q: "How long is a single Sora 2 clip?",
        a: "A single clip is 4, 8, 12, 16, or 20 seconds. Duration is set through the API parameter seconds, not in the prompt text. From there you can extend the clip up to 6 times, summing to 120 seconds — during extension the model uses the full original clip as context. For unstable scenes 4-second takes work more reliably than long ones.",
      },
      {
        q: "How is Sora 2 Pro different from regular Sora 2?",
        a: "Sora 2 Pro supports more resolutions: in addition to 720×1280 and 1280×720, it adds 1024×1792, 1792×1024, 1080×1920, and 1920×1080. This gives honest Full HD in both orientations and vertical formats for Reels, Shorts, and TikTok. Prompting logic is identical — the difference is purely the output resolutions exposed via API.",
      },
      {
        q: "How do I add my own character to a video?",
        a: "Through the Characters API. Upload a short video (MP4, 2-4 seconds, 720p-1080p, 16:9 or 9:16), the model learns the character and returns an ID. In prompts reference the name and ID — the character appears in different scenes with consistent appearance. Maximum two characters per generation; beyond that the model breaks down and slides into morphing.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "Technically yes, but English gives noticeably more stable results — especially for camera terms, film stocks, and stylistic references. The cinematographic vocabulary («Anamorphic 2.0x», «Kodak Vision3 500T», «slow dolly-in») has historically been trained best in English. Keep the prompt in English; in-clip dialogue can be in any language.",
      },
      {
        q: "Why does the model add strange audio I never asked for?",
        a: "If background sound is not described explicitly, Sora 2 will invent it, and often badly: «studio audience laughter» appears in dramatic scenes, or a random saxophone drops in. Always state Background Sound explicitly — even for quiet scenes give one rhythmic anchor: «distant traffic hiss», «ticking wall clock», «soft mechanical hum».",
      },
      {
        q: "What do I do if results differ every time with the same prompt?",
        a: "This is by design — even an identical prompt yields varied results across generations in Sora 2. Do not try to hit the right result by re-rolling: refine the prompt instead. Add a specific lens, color anchors, second-by-second action breakdown — that narrows the interpretation space. For a series of shots with one character, use the Characters API.",
      },
      {
        q: "Does Opten support Sora 2?",
        a: "Yes, the Opten extension detects Sora 2 on OpenAI and fal.ai platforms and scores prompts against the structure outlined above: style first, concrete subject and action, mandatory camera, explicit background sound, long stories split into shots. One click gives you a rewrite in the right structure, with duration and resolution stripped from the text.",
      },
    ],
  },
};
