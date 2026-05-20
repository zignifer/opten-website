// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for sora.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Sora: структура, ошибки, примеры",
    description:
      "Как писать промпты для Sora от OpenAI: бриф для оператора-постановщика, стиль и движение камеры, диалоги, звук, частые ошибки и примеры до и после кадра.",
    h1: "Sora: как писать промпты, которые модель понимает",
    intro:
      "Sora — линейка video-моделей от OpenAI с клипами 4-20 секунд и поддержкой консистентных персонажей. Промпт работает как бриф для оператора-постановщика: стиль задаётся первым, дальше идёт субъект, действие, камера, освещение и звук. Английский даёт самые стабильные результаты, особенно для камерной и плёночной терминологии.",
    sections: [
      {
        heading: "Что умеет Sora",
        body:
          "Sora генерирует видеоклипы длительностью 4-20 секунд за один запуск. Базовое разрешение — 720×1280 или 1280×720, Pro-варианты добавляют до 1080×1920 и 1920×1080 для вертикальных и горизонтальных Full HD форматов. Поддерживается до двух персонажей через Characters API: короткое референсное видео (MP4, 2-4 секунды, 720p-1080p, 16:9 или 9:16) превращается в переиспользуемый персонаж с консистентной внешностью между генерациями.\n\nКлип можно продлевать до 6 раз, суммарно до 120 секунд — модель использует полный исходный клип как контекст, а не только последний кадр. Image-to-Video позволяет загрузить фото или AI-арт как визуальный якорь первого кадра; промпт описывает, что происходит дальше. Видеоредактирование принимает точечные правки в существующий клип: «same shot, switch to 85mm» или «change the color of the monster to orange» — это инструмент для surgical fixes, не для полной переделки.",
        bullets: [
          "Клипы 4-20 секунд за один запуск",
          "До 2 консистентных персонажей через Characters API",
          "Продление до 120 секунд с полным клипом в контексте",
          "Image-to-Video: фото как якорь первого кадра",
          "Video Edit для точечных правок существующего клипа",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Стиль/Эстетика] + [Субъект/Персонаж] + [Сцена/Среда] + [Действие/Движение] + [Камера: кадр + движение] + [Освещение/Цвет] + [Настроение] + [Звук/Диалоги].\n\nСтиль идёт первым — это самый мощный рычаг управления в Sora. Одни и те же детали сцены выглядят радикально по-разному при «1970s romantic drama, shot on 35mm film», «16mm black-and-white documentary» или «90s documentary-style interview». Дальше — конкретный субъект (не «a person», а «a woman in a red coat»), физическое действие с глаголами и таймингом, обязательно крупность плана плюс движение камеры. Хотя бы одно указание на камеру нужно всегда.\n\nОдин промпт описывает один шот, не всю историю. Длинные сцены собирай из серии коротких клипов через продление в Sora или монтаж в посте — это даёт и стабильность, и контроль над раскадровкой.",
      },
      {
        heading: "Камера, освещение, цвет",
        body:
          "Камеру задавай через крупность плана И движение: «Wide establishing shot, eye level» + «slow dolly-in». Стиль съёмки — «handheld», «Steadicam», «shoulder-mounted», «static tripod». Угол — «eye level», «low angle», «aerial», «Dutch angle». Глубина — «shallow depth of field», «deep focus», «rack focus».\n\nОсвещение описывай через источники, а не яркость: не «brightly lit», а «soft window light with warm lamp fill, cool rim from hallway». Цветовая палитра — 3-5 цветовых якорей через запятую: «amber, cream, walnut brown» или «teal and orange». Это критично для стабильности кадра при монтаже серии клипов. Конкретные параметры объективов («Anamorphic 2.0x», «Kodak Vision3 500T», «volumetric light») работают лучше абстрактного «cinematic look».",
      },
      {
        heading: "Звук и диалоги",
        body:
          "Даже для тихих сцен указывай хотя бы один ритмический звук — «distant traffic hiss», «a crisp snap», «faint mechanical hum», «soft mechanical drone». Иначе модель додумает фоновый звук сама, и часто неудачно — самый частый артефакт это смех аудитории как в ситкоме. Диалоги выноси отдельным блоком с указанием персонажа и эмоции:\n\nDialogue:\n- Detective (low voice): \"You're lying. I can hear it in your silence.\"\n- Suspect (tired): \"Or maybe I'm just tired of talking.\"\n\nПри нескольких персонажах чётко указывай кто и что говорит — это нужно и для аудио, и для камерного фокуса модели. Для серии шотов с одним персонажем используй Characters API, чтобы внешность не «дрейфовала» между генерациями.",
      },
      {
        heading: "Продвинутый уровень",
        body:
          "Для сложных кинематографичных кадров Sora принимает ультра-детальные промпты: формат и внешний вид (shutter angle, capture type, grain, halation), объективы и фильтры (focal length, Pro-Mist, CPL), цветокоррекция (highlights, mids, blacks по отдельности), освещение и атмосфера (ключевой свет, отражатели типа 4×4 ultrabounce, негативное заполнение, практические источники, дымка), локация и кадрирование (передний, средний и задний планы), костюмы и реквизит, звуковой дизайн с уровнями LUFS.\n\nДля длинных клипов добавляй посекундную раскладку действий: «0.00-2.40 — Arrival Drift (32mm, shoulder-mounted slow dolly left). Camera slides past platform signage; shallow focus reveals traveler mid-frame.» — модель привязывает события к таймкодам и держит ритм между склейками клипов.",
      },
    ],
    examples: [
      {
        before: "a beautiful street at night",
        after:
          "Cinematic neo-noir style, shot on 35mm film with natural grain and subtle halation. Wide-angle shot slowly tracking forward down a rain-soaked Tokyo street at 2am, wet asphalt, zebra crosswalk, neon signs reflecting in puddles. Camera: low angle, slow dolly-in from eye level, shallow depth of field. Lighting: cyan key from neon, warm spill from a ramen shop window, cool rim from the alley. Palette: teal, magenta, amber. Mood: cinematic, lonely, tense. Background Sound: distant traffic hiss, rain on pavement, faint izakaya chatter.",
        note:
          "Стиль идёт первым, конкретные детали среды, явное движение камеры и сетап освещения, цветовая палитра как якорь, ритмический звуковой фон.",
      },
      {
        before: "person moves quickly",
        after:
          "Handheld ENG camera style, 16mm documentary look with natural film grain. A cyclist in a yellow rain jacket pedals three times across a wet intersection, brakes hard, and stops just before a zebra crosswalk as a tram passes. Camera: medium shot at eye level, handheld with subtle micro-shake, follows the cyclist in a slow lateral track. Lighting: overcast natural daylight, soft and even, cool color temperature. Palette: slate grey, yellow, asphalt black. Mood: gritty, observational. Background Sound: tram bell, wet tyres on pavement, distant city hum.",
        note:
          "Абстрактное «moves quickly» заменено на конкретное действие с глаголами и таймингом — модель знает, как именно двигается субъект и где останавливается.",
      },
      {
        before: "a product spinning",
        after:
          "Commercial photography style, clean studio aesthetic. Smooth 360-degree rotating shot of matte-black wireless headphones on a white marble pedestal against a seamless white cyclorama. Camera: medium close-up, slow continuous orbit at eye level, shallow depth of field with smooth bokeh on the backdrop. Lighting: large softbox key from above, gentle rim light from behind, subtle gradient fill from screen-right. Palette: white, charcoal, brushed metal accents. Mood: premium, minimal, confident. Background Sound: a single subtle electronic chime at the start, then ambient room tone.",
        note:
          "Продуктовый шот: конкретика материала, точное движение камеры (smooth orbit), сетап освещения с тремя источниками, минимальный звук как ритм.",
      },
    ],
    mistakes: [
      {
        title: "Слишком короткий промпт без деталей",
        explain:
          "«A cat playing with a ball» — модель будет додумывать всё: породу, освещение, ракурс, фон. Результат непредсказуем. Минимум для стабильности: конкретный субъект с деталями («tabby cat»), действие с глаголом («batting a red yarn ball»), среда («across hardwood floors»), камера и свет.",
      },
      {
        title: "Размытое освещение",
        explain:
          "«Bright» или «dark» не говорят модели, ОТКУДА свет. Указывай источники и направление: «soft window light from screen-left with warm tungsten fill from above, cool rim from hallway». Даже простое «golden hour, natural sunlight» работает лучше абстрактного «brightly lit».",
      },
      {
        title: "Несколько сцен в одном промпте",
        explain:
          "Один промпт = один шот. Описание «she leaves the cafe, drives to the airport, boards a plane» модель попытается уместить в один клип и сорвётся в морфинг. Разбивай историю на серию 4-8-секундных клипов и склеивай через продление или монтаж в посте.",
      },
      {
        title: "Длительность или разрешение в тексте промпта",
        explain:
          "«Make this 1080p and 12 seconds long» — модель эти параметры из текста не читает. Длительность и разрешение задаются только через API-параметры или UI. В тексте они становятся мусором и могут конфликтовать с настройками. Убирай из промпта.",
      },
      {
        title: "Абстрактное «cinematic look» вместо параметров",
        explain:
          "«Cinematic» сам по себе ничего не значит для модели. Заменяй конкретикой: «Anamorphic 2.0x lens, shallow DOF, volumetric light», «shot on Kodak Vision3 500T», «warm Kodak grade with halation». Конкретные параметры плёнки и объективов — самый сильный стилистический рычаг в Sora.",
      },
    ],
    faq: [
      {
        q: "Чем Sora отличается от Sora 2?",
        a: "Sora — общий идентификатор для всей линейки моделей OpenAI; Sora 2 — конкретная актуальная версия с нативным звуком, Characters API и более точным следованием промпту. На уровне промптинга подходы совпадают: стиль первым, конкретный субъект, физическое действие, камера, свет, звук. Sora 2 строже относится к структуре и блочному формату Cinematography/Actions/Dialogue.",
      },
      {
        q: "Сколько секунд может длиться один клип?",
        a: "Один запуск — от 4 до 20 секунд. Дальше клип можно продлевать до 6 раз, суммарно до 120 секунд. При продлении модель использует полный исходный клип как контекст, а не последний кадр — это даёт более стабильное движение между склейками. Для нестабильных сцен 4-секундные отрезки работают надёжнее.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Технически да, но английский даёт заметно более стабильные результаты — особенно для камерных терминов («wide establishing shot», «slow dolly-in»), плёночных форматов и стилистических референсов. Кинематографический словарь исторически тренируется лучше в английском. Промпт на английском, диалоги внутри клипа можно писать на любом языке.",
      },
      {
        q: "Что такое Characters API и зачем он нужен?",
        a: "Characters API позволяет загрузить короткое видео персонажа (MP4, 2-4 секунды, 720p-1080p, 16:9 или 9:16) и получить ID. Дальше в промптах указываешь имя и ID — модель воспроизводит того же персонажа в разных сценах с консистентной внешностью. Максимум 2 персонажа на одну генерацию; больше модель не вытягивает и срывается в морфинг.",
      },
      {
        q: "Почему результат каждый раз разный при одинаковом промпте?",
        a: "Это особенность Sora, а не баг — модель сэмплит из распределения, и идентичный промпт даёт вариативный результат между запусками. Не пытайся попасть перегенерацией: лучше уточняй промпт. Добавь конкретный объектив, цветовые якоря, посекундную раскладку — это сужает интерпретацию. Для серии шотов с одним персонажем используй Characters API.",
      },
      {
        q: "Как избежать «студийного смеха аудитории» в фоне?",
        a: "Это типичный артефакт, когда фоновый звук не описан явно — модель додумывает «laughter» в любую сцену, где есть несколько людей. Лечение: всегда явно прописывай Background Sound, даже для тихих сцен. Один ритмический якорь — «distant traffic hiss», «ticking wall clock», «faint mechanical hum» — убирает проблему.",
      },
      {
        q: "Поддерживается ли Opten для Sora?",
        a: "Да, расширение Opten распознаёт Sora на платформах OpenAI (ChatGPT, API) и оценивает промпты по структуре, описанной выше: стиль в начале, конкретный субъект, физическое действие, обязательная камера, явный звуковой фон. Одним кликом можно получить rewrite с правильной структурой и без длительности/разрешения в тексте промпта.",
      },
    ],
  },
  en: {
    title: "Sora Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for OpenAI's Sora: brief for a DP, style and camera, dialogue, audio, common mistakes, and before/after examples for all versions.",
    h1: "Sora: how to write prompts the model actually understands",
    intro:
      "Sora is OpenAI's line of video models that produce 4-20 second clips with consistent characters. The prompt works as a brief for a director of photography: style first, then subject, action, camera, lighting, and sound. English gives the most stable results, especially for camera and film-stock vocabulary.",
    sections: [
      {
        heading: "What Sora does",
        body:
          "Sora generates clips of 4-20 seconds per run. Base resolution is 720×1280 or 1280×720, and Pro variants add up to 1080×1920 and 1920×1080. Up to two characters are supported via the Characters API: a short reference video (MP4, 2-4 seconds, 720p-1080p) becomes a reusable character with consistent appearance.\n\nA clip can be extended up to 6 times, summing to 120 seconds — the model uses the full original clip as context. Image-to-Video accepts a photo or AI art as a visual anchor for the first frame; the prompt describes what happens next. Video Edit takes surgical changes: «same shot, switch to 85mm» or «change the color of the monster to orange».",
        bullets: [
          "Clips of 4-20 seconds per run",
          "Up to 2 consistent characters via the Characters API",
          "Extension up to 120 seconds with the full clip in context",
          "Image-to-Video: a photo anchors the first frame",
          "Video Edit for surgical changes to an existing clip",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Style/Aesthetic] + [Subject/Character] + [Scene/Environment] + [Action/Motion] + [Camera: shot + movement] + [Lighting/Color] + [Mood] + [Sound/Dialogue].\n\nStyle goes first — it is the most powerful control lever. The same details look radically different under «1970s romantic drama, shot on 35mm film», «16mm black-and-white documentary», or «90s documentary-style interview». Then comes a concrete subject (not «a person» but «a woman in a red coat»), a physical action with verbs and timing, and always a shot size plus camera movement.\n\nOne prompt describes one shot, not the whole story. Build long scenes from a series of short clips via extension or post cut.",
      },
      {
        heading: "Camera, lighting, color",
        body:
          "Set the camera through both shot size AND movement: «Wide establishing shot, eye level» + «slow dolly-in». Shooting style — «handheld», «Steadicam», «shoulder-mounted», «static tripod». Angle — «eye level», «low angle», «aerial», «Dutch angle». Depth — «shallow depth of field», «deep focus», «rack focus».\n\nDescribe lighting through sources, not brightness: not «brightly lit» but «soft window light with warm lamp fill, cool rim from hallway». For the palette use 3-5 anchors separated by commas: «amber, cream, walnut brown» or «teal and orange». This is critical for cross-clip stability when cutting a series. Concrete lens parameters («Anamorphic 2.0x», «Kodak Vision3 500T», «volumetric light») work far better than the abstract «cinematic look».",
      },
      {
        heading: "Sound and dialogue",
        body:
          "Even for quiet scenes specify at least one rhythmic sound — «distant traffic hiss», «a crisp snap», «faint mechanical hum». Otherwise the model invents the background on its own, often badly. Put dialogue in a separate block with character name and emotion:\n\nDialogue:\n- Detective (low voice): \"You're lying. I can hear it in your silence.\"\n- Suspect (tired): \"Or maybe I'm just tired of talking.\"\n\nWith multiple characters state clearly who is speaking — this matters both for audio and for camera focus. For a series of shots with one character, use the Characters API so appearance does not drift across generations.",
      },
      {
        heading: "Advanced level",
        body:
          "For complex cinematic shots Sora accepts ultra-detailed prompts: format and look (shutter angle, capture type, grain, halation), lenses and filters (focal length, Pro-Mist, CPL), color grade (highlights, mids, blacks separately), lighting and atmosphere (key light, 4×4 ultrabounce, negative fill, practicals, haze), location and framing (foreground, mid, and background planes), wardrobe and props, sound design with LUFS levels.\n\nFor longer clips add a second-by-second action layout: «0.00-2.40 — Arrival Drift (32mm, shoulder-mounted slow dolly left). Camera slides past platform signage; shallow focus reveals traveler mid-frame.» — the model anchors events to timecodes and holds rhythm across clip joins.",
      },
    ],
    examples: [
      {
        before: "a beautiful street at night",
        after:
          "Cinematic neo-noir style, shot on 35mm film with natural grain and subtle halation. Wide-angle shot slowly tracking forward down a rain-soaked Tokyo street at 2am, wet asphalt, zebra crosswalk, neon signs reflecting in puddles. Camera: low angle, slow dolly-in from eye level, shallow depth of field. Lighting: cyan key from neon, warm spill from a ramen shop window, cool rim from the alley. Palette: teal, magenta, amber. Mood: cinematic, lonely, tense. Background Sound: distant traffic hiss, rain on pavement, faint izakaya chatter.",
        note:
          "Style first, concrete environmental details, explicit camera motion and lighting setup, palette as anchor, a rhythmic sound bed.",
      },
      {
        before: "person moves quickly",
        after:
          "Handheld ENG camera style, 16mm documentary look with natural film grain. A cyclist in a yellow rain jacket pedals three times across a wet intersection, brakes hard, and stops just before a zebra crosswalk as a tram passes. Camera: medium shot at eye level, handheld with subtle micro-shake, follows the cyclist in a slow lateral track. Lighting: overcast natural daylight, soft and even, cool color temperature. Palette: slate grey, yellow, asphalt black. Mood: gritty, observational. Background Sound: tram bell, wet tyres on pavement, distant city hum.",
        note:
          "Abstract «moves quickly» replaced with concrete action, verbs, and timing — the model knows exactly how the subject moves and where it stops.",
      },
      {
        before: "a product spinning",
        after:
          "Commercial photography style, clean studio aesthetic. Smooth 360-degree rotating shot of matte-black wireless headphones on a white marble pedestal against a seamless white cyclorama. Camera: medium close-up, slow continuous orbit at eye level, shallow depth of field with smooth bokeh on the backdrop. Lighting: large softbox key from above, gentle rim light from behind, subtle gradient fill from screen-right. Palette: white, charcoal, brushed metal accents. Mood: premium, minimal, confident. Background Sound: a single subtle electronic chime at the start, then ambient room tone.",
        note:
          "Product shot: material specifics, exact camera motion (smooth orbit), three-source lighting setup, a minimal sound used as rhythm.",
      },
    ],
    mistakes: [
      {
        title: "Too short a prompt without details",
        explain:
          "«A cat playing with a ball» — the model has to invent everything: breed, lighting, angle, background. Result is unpredictable. Minimum for stability: a concrete subject with details («tabby cat»), action with a verb («batting a red yarn ball»), environment («across hardwood floors»), camera, and light.",
      },
      {
        title: "Vague lighting",
        explain:
          "«Bright» or «dark» does not tell the model WHERE the light comes from. Specify sources and direction: «soft window light from screen-left with warm tungsten fill from above, cool rim from hallway». Even a simple «golden hour, natural sunlight» works better than the abstract «brightly lit».",
      },
      {
        title: "Several scenes in one prompt",
        explain:
          "One prompt equals one shot. A description like «she leaves the cafe, drives to the airport, boards a plane» pushes the model to fit three actions into one clip and it slides into morphing. Break the story into a series of 4-8 second clips and join them via extension or a post cut.",
      },
      {
        title: "Duration or resolution in the prompt text",
        explain:
          "«Make this 1080p and 12 seconds long» — the model does not read those parameters from text. Duration and resolution are set through API parameters or the UI only. In the text they become noise and can conflict with the actual settings. Strip them from the prompt.",
      },
      {
        title: "Abstract «cinematic look» instead of parameters",
        explain:
          "«Cinematic» alone means nothing to the model. Replace it with specifics: «Anamorphic 2.0x lens, shallow DOF, volumetric light», «shot on Kodak Vision3 500T», «warm Kodak grade with halation». Concrete film stock and lens parameters are the strongest stylistic lever in Sora.",
      },
    ],
    faq: [
      {
        q: "How is Sora different from Sora 2?",
        a: "Sora is the umbrella identifier for OpenAI's entire model line; Sora 2 is the current concrete version with native audio, Characters API, and tighter prompt adherence. At the prompting level the approach is the same: style first, concrete subject, physical action, camera, light, sound. Sora 2 is stricter about structure and the Cinematography/Actions/Dialogue block format.",
      },
      {
        q: "How long can a single clip be?",
        a: "A single run is 4 to 20 seconds. From there the clip can be extended up to 6 times, summing to 120 seconds. On extension the model uses the full original clip as context, not just the last frame — this gives more stable motion across joins. For unstable scenes 4-second takes work more reliably.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "Technically yes, but English gives noticeably more stable results — especially for camera terms («wide establishing shot», «slow dolly-in»), film formats, and stylistic references. The cinematographic vocabulary has historically been trained best in English. Keep the prompt in English; in-clip dialogue can be in any language.",
      },
      {
        q: "What is the Characters API and why use it?",
        a: "The Characters API lets you upload a short character video (MP4, 2-4 seconds, 720p-1080p, 16:9 or 9:16) and get back an ID. In prompts you reference the name and ID, and the model reproduces the same character in different scenes with consistent appearance. Maximum two characters per generation; beyond that the model breaks down and slides into morphing.",
      },
      {
        q: "Why do results differ every run with the same prompt?",
        a: "This is by design, not a bug — the model samples from a distribution, and an identical prompt yields varied results across runs. Do not try to land it via re-rolls: refine the prompt instead. Add a specific lens, color anchors, a second-by-second layout — that narrows the interpretation. For a series of shots with one character, use the Characters API.",
      },
      {
        q: "How do I avoid «studio audience laughter» in the background?",
        a: "It is a typical artifact when background sound is not described explicitly — the model drops «laughter» into any scene with multiple people. The fix: always state Background Sound explicitly, even for quiet scenes. One rhythmic anchor — «distant traffic hiss», «ticking wall clock», «faint mechanical hum» — removes the problem.",
      },
      {
        q: "Does Opten support Sora?",
        a: "Yes, the Opten extension detects Sora on OpenAI platforms (ChatGPT, API) and scores prompts against the structure outlined above: style first, concrete subject, physical action, mandatory camera, explicit sound bed. One click gives you a rewrite in the right structure, with duration and resolution stripped from the prompt text.",
      },
    ],
  },
};
