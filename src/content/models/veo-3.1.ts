// Phase v2.0 MODELS-B-1 (agent batch 7): generated content for veo-3.1.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Veo 3.1: структура, ошибки, примеры",
    description:
      "Как писать промпты для Google Veo 3.1: нативное 1080p, вертикальное видео 9:16, image-to-video, аудио через двоеточие, частые ошибки и примеры до/после.",
    h1: "Veo 3.1: как писать промпты, которые модель понимает",
    intro:
      "Veo 3.1 — обновлённая видео-модель Google DeepMind с улучшенным следованием промпту, нативным 1080p, вертикальным форматом 9:16 и режимом image-to-video. Наследует генерацию аудио от Veo 3: диалоги, фон, SFX, музыка. Лимит промпта вырос до 2000 символов, длительность — до нескольких минут в расширенном режиме.",
    sections: [
      {
        heading: "Что нового в Veo 3.1",
        body:
          "Veo 3.1 — это пять конкретных апгрейдов поверх Veo 3. Первое: улучшенное следование промпту (Prompt Adherence) — модель точнее воспроизводит описания, меньше додумывает. Второе: нативная поддержка вертикального 9:16 для TikTok, Reels, Shorts — больше не нужно обрезать в постобработке. Третье: image-to-video — модель анимирует стартовое изображение, описывая в промпте движение, а не первый кадр.\n\nЧетвёртое: камерные пресеты — встроенные предустановки движения камеры (platform-specific), которые работают как дополнение к текстовому описанию. Пятое: более длинные клипы по сравнению с 8-секундным лимитом Veo 3. Базовое разрешение Veo 3.1 — до 1080p; варианты Fast и Fast Relax работают на 720p с большей скоростью и меньшей стоимостью. Лимит промпта расширен до ~2000 символов.",
        bullets: [
          "До 1080p (Veo 3.1), 720p (Fast/Fast Relax)",
          "Нативно 9:16 — TikTok, Reels, Shorts без обрезки",
          "Image-to-Video: анимация стартового изображения",
          "Камерные пресеты + расширенная длительность",
          "Лимит промпта ~2000 символов, аудио наследуется от Veo 3",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальный порядок: [Subject + Appearance] + [Context/Scene] + [Action] + [Camera Movement/Composition] + [Style/Mood] + [Lighting] + [Dialogue: text] + [Audio/Ambiance] + [(no subtitles!)].\n\nVeo 3.1 полностью наследует логику Veo 3 в отношении аудио: блок звука обязателен, диалоги через двоеточие, добавлять `(no subtitles!)` в конец. Из-за более строгого следования промпту тег работает надёжнее, чем в Veo 3.\n\nДля сложных сцен используй структурированный промпт с явными блоками:\n\nScene: A busy cafe in Paris, morning light streaming through large windows.\nCharacter: A young woman with auburn hair, wearing a cream sweater.\nAction: She lifts a cup of coffee, takes a sip, looks out the window.\nCamera: Slow dolly-in from medium shot to close-up.\nAudio: Ambient cafe sounds, clinking cups, soft jazz piano.\nMood: Warm, nostalgic, golden hour tones.\n(no subtitles!)\n\nМодель читает эту структуру лучше длинного абзаца.",
      },
      {
        heading: "Вертикальное видео и image-to-video",
        body:
          "Для вертикального 9:16 формат выбирается в платформе (Google AI Studio, Vertex AI), не пишется в промпт. Промпт нужно адаптировать под портретную компоновку: больше крупных планов, портретная ориентация субъекта, минимум широких пейзажных кадров (они теряются в 9:16). Selfie-стиль особенно хорошо ложится в вертикальный формат.\n\nДля image-to-video модель использует загруженное изображение как первый кадр, и промпт описывает движение и действие, а НЕ исходный кадр. Слабо: «A woman in a cafe drinking coffee» (это же показано на фото). Сильно: «The woman slowly lifts the cup to her lips and takes a sip. Camera: slow dolly-in to extreme close-up on her eyes. Background Sound: faint cafe chatter, distant espresso machine.». Описание начального состояния — лишний шум, фокус только на движении.",
      },
      {
        heading: "Диалоги, аудио, субтитры",
        body:
          "Vео 3.1 полностью наследует аудио-возможности Veo 3. Диалоги через двоеточие, не в кавычках: `says: text` лучше, чем `says \"text\"` — кавычки провоцируют вшитые субтитры. Добавляй `(no subtitles!)` в конец промпта.\n\nДлина диалога должна умещаться в длительность клипа: примерно 12-25 слов на 8-секундный отрезок. Слишком длинный диалог — модель говорит неестественно быстро. Слишком короткий — заполняет паузы AI-бормотанием. Для нескольких персонажей чётко указывай, кто говорит: «The woman in red says: ... The man with beard replies: ...».\n\nФоновые звуки прописывай явно — даже простое «ambient room tone» убирает риск «studio audience laughter». Для музыки указывай жанр и настроение: «a melancholic orchestral score swells», «upbeat electronic music with a driving beat», «no background music — just ambient room tone». Veo 3.1 точнее следует этим инструкциям, чем Veo 3.",
      },
      {
        heading: "Стилистика, физика, консистентность",
        body:
          "Стилистические модификаторы через «In the style of [style]:» работают как в Veo 3: LEGO, Claymation, Pixar animation, Anime, Graphic novel, 8-bit retro, Stop-motion, Origami, South Park, Simpsons, Noir, Blueprint, Marble, Watercolor. Физика сохраняется и улучшена: падение, отскок, жидкости, ткани, волосы, дым — симулируются реалистично даже при смене стиля.\n\nКонсистентность персонажей: как в Veo 3, детальное дословное описание в каждой генерации. «Maria, a woman in her 30s with long black hair in a braid, wearing a white lab coat and round glasses, with a warm smile» — повторяй этот блок без изменений между сценами, тогда лицо и одежда останутся стабильными.\n\nТайминг и темпоритм: для более точного контроля описывай последовательность событий — «The video opens with an establishing wide shot, then cuts to a close-up of her eyes, followed by a tracking shot as she walks down the alley». Модель читает это как раскадровку.",
      },
    ],
    examples: [
      {
        before: "a woman drinking coffee in a cafe",
        after:
          "Scene: A busy cafe in Paris on a Saturday morning, golden light streaming through large arched windows.\nCharacter: A young woman with auburn hair tied in a low ponytail, wearing a cream cable-knit sweater, sits at a small marble table by the window.\nAction: She lifts a small espresso cup, takes a slow sip, then sets it down and looks out the window with a pensive expression.\nCamera: Slow dolly-in from medium shot to close-up on her face.\nLighting: Warm golden hour light through the windows, soft fill from a nearby lamp.\nMood: Warm, nostalgic, contemplative.\nAudio: Ambient cafe sounds — clinking cups, soft conversation in French, a jazz piano playing quietly in the background.\n(no subtitles!)",
        note:
          "Структурированный промпт с явными блоками (Scene, Character, Action, Camera, Lighting, Mood, Audio). Veo 3.1 читает это лучше, чем длинный абзац.",
      },
      {
        before: "vertical video of a person in the city",
        after:
          "Vertical 9:16 composition optimized for mobile. A young man with messy dark hair and a black hoodie, leaning against a graffiti-covered wall in a neon-lit Tokyo alley. He looks down at his phone, smiles, then glances up at the camera. Camera: portrait close-up, slight handheld micro-shake, slow push-in. Lighting: cyan neon key from screen-left, warm spill from a noodle shop sign on screen-right. Style: slightly grainy, film-like, cinematic vlog aesthetic. Mood: cool, urban, intimate. Background Sound: distant traffic hum, faint J-pop playing from a nearby shop, light rain on metal awnings. (no subtitles!)",
        note:
          "Для 9:16: явно «portrait close-up», субъект расположен под вертикальный кадр, минимум широких планов. Формат выбирается на платформе, не пишется в промпт.",
      },
      {
        before: "animate this product photo of headphones",
        after:
          "[Image-to-Video: starting frame is a product shot of matte-black wireless headphones on a white marble pedestal]\n\nThe headphones begin a slow, smooth 360-degree rotation on the pedestal. Camera: slow continuous orbit around the headphones at eye level, shallow depth of field maintained throughout. Lighting: existing softbox key and rim light from the starting frame, with subtle highlight movement as the headphones rotate. Style: clean commercial photography. Mood: premium, refined. Audio: subtle electronic ambient tone, soft mechanical hum, a gentle chime at the start of rotation. (no subtitles!)",
        note:
          "Image-to-Video: промпт описывает МОВИЖЕНИЕ, не повторяет содержимое исходного фото. Освещение наследуется от стартового кадра, в промпте — только динамика.",
      },
    ],
    mistakes: [
      {
        title: "Описание начального кадра в Image-to-Video",
        explain:
          "В режиме image-to-video изображение УЖЕ задаёт первый кадр. Если в промпте писать «A woman sitting in a cafe drinking coffee» — это пустое повторение того, что и так показано на фото. Описывай только ДВИЖЕНИЕ: «She slowly lifts the cup, takes a sip, looks out the window. Camera: slow dolly-in». Фокус на динамике, не на статике.",
      },
      {
        title: "Указание формата в тексте промпта",
        explain:
          "«Vertical video», «9:16», «1080p» в тексте промпта игнорируются — это параметры генерации, выставляемые на платформе или через API. В промпте они становятся мусором. Если нужен вертикальный формат — выбирай его в Google AI Studio / Vertex AI, и адаптируй композицию: «portrait close-up», «subject centered», крупные планы.",
      },
      {
        title: "Горизонтальная компоновка при 9:16",
        explain:
          "Если выбран вертикальный формат, но в промпте «wide establishing shot of a city skyline» — субъект будет обрезан, кадр потеряет смысл. Под 9:16 адаптируй композицию: больше крупных планов, портретная ориентация людей, минимум широких пейзажей. Selfie-стиль особенно хорошо ложится в вертикальный формат.",
      },
      {
        title: "Диалог в кавычках без «no subtitles»",
        explain:
          "Veo 3.1 наследует поведение Veo 3 в отношении субтитров: кавычки в диалогах провоцируют вшитые субтитры внизу кадра, часто с ошибками. Используй формат `says: text` через двоеточие и добавляй `(no subtitles!)`. В Veo 3.1 этот тег работает надёжнее, чем в Veo 3, благодаря улучшенному следованию промпту.",
      },
      {
        title: "Перегенерация при одинаковом промпте",
        explain:
          "Veo 3.1 как и Veo 3 очень консистентен — идентичный промпт даёт схожий результат. Если нужны вариации, МЕНЯЙ промпт: добавь другой объектив, измени освещение, поменяй цветовую палитру или добавь деталь персонажа. Перегенерация без изменений — пустая трата токенов, реальные вариации получаются только через правку.",
      },
    ],
    faq: [
      {
        q: "Чем Veo 3.1 отличается от Veo 3?",
        a: "Пять апгрейдов: улучшенное следование промпту (меньше додумывания), нативная поддержка вертикального 9:16, image-to-video режим, камерные пресеты, более длинные клипы. Базовое разрешение выросло до 1080p (против 720p в Veo 3). Аудио-возможности наследуются полностью — диалоги, фон, SFX, музыка. Лимит промпта расширен с ~1500 до ~2000 символов.",
      },
      {
        q: "Какая разница между Veo 3.1, Fast и Fast Relax?",
        a: "Veo 3.1 — максимальное качество на 1080p, стандартная скорость. Veo 3.1 Fast — 720p, заметно быстрее, для итераций и прототипирования. Veo 3.1 Fast Relax — 720p, ещё экономнее по стоимости, для массовой генерации и тестов. Логика промптинга идентична во всех трёх вариантах: одни и те же блоки структуры, одни и те же приёмы для аудио и диалогов.",
      },
      {
        q: "Как сделать вертикальное видео для TikTok / Reels / Shorts?",
        a: "Формат 9:16 выбирается на платформе (Google AI Studio или Vertex AI), не пишется в промпт. В промпте адаптируй композицию: больше крупных планов, портретная ориентация субъекта, явное «portrait close-up» или «vertical composition». Минимум широких пейзажных кадров — они теряются в вертикальном формате. Selfie-стиль особенно хорошо подходит.",
      },
      {
        q: "Как использовать Image-to-Video режим?",
        a: "Загружаешь стартовое изображение (продуктовый шот, иллюстрация, фото) и в промпте описываешь ТОЛЬКО движение — не повторяй содержимое исходного кадра. Фокус: что движется, куда движется камера, какие звуки появляются. Освещение наследуется от стартового кадра. Это идеально для оживления продуктовой фотографии и анимации статичных иллюстраций.",
      },
      {
        q: "Можно ли писать диалоги на русском?",
        a: "Технически да — Veo 3.1 произносит русские слова, но качество заметно ниже, чем на английском: возможны искажения произношения и интонации. Для production-задач рекомендуется английский. Если нужен русский диалог — используй фонетическую запись сложных слов и тестируй на коротких фразах перед длинными сценами. Veo 3.1 чуть точнее Veo 3 в неанглийских языках.",
      },
      {
        q: "Какой оптимальный лимит длины промпта?",
        a: "Рекомендуемый лимит — около 2000 символов. Это даёт пространство для детального описания персонажей, среды, действий, камеры, освещения, аудио и стиля без потери качества. Промпты длиннее 2000 символов начинают терять детали: модель не успевает обработать всё описание целиком. Для очень сложных сцен разбивай на структурированные блоки (Scene/Character/Action/Camera/Audio).",
      },
      {
        q: "Поддерживается ли Opten для Veo 3.1?",
        a: "Да, расширение Opten распознаёт Veo 3.1, Fast и Fast Relax на платформах Google AI Studio, Vertex AI и Flow и оценивает промпты по структуре, описанной выше: проверяет блок аудио, формат диалогов через двоеточие, тег «(no subtitles!)», адаптацию композиции под формат, корректную структуру image-to-video. Одним кликом можно получить rewrite.",
      },
    ],
  },
  en: {
    title: "Veo 3.1 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Google Veo 3.1: 1080p, vertical 9:16, image-to-video, audio and dialogue via colon, common mistakes, and before/after examples.",
    h1: "Veo 3.1: how to write prompts the model actually understands",
    intro:
      "Veo 3.1 is Google DeepMind's updated video model with stronger prompt adherence, native 1080p, vertical 9:16 format, and image-to-video. It inherits audio generation from Veo 3: dialogue, ambience, SFX, music. The prompt limit grows to 2000 characters, and clips can run to several minutes in extended mode.",
    sections: [
      {
        heading: "What is new in Veo 3.1",
        body:
          "Veo 3.1 is five concrete upgrades on top of Veo 3. First: improved prompt adherence — the model follows descriptions more precisely, invents less. Second: native vertical 9:16 support for TikTok, Reels, and Shorts — no more cropping in post. Third: image-to-video — the model animates a starting frame, with the prompt describing motion, not the frame itself.\n\nFourth: camera presets — built-in movement presets (platform-specific) that supplement the text description. Fifth: longer clips compared to the 8-second Veo 3 ceiling. Base Veo 3.1 resolution is up to 1080p; the Fast and Fast Relax variants run at 720p with higher speed and lower cost. Prompt limit grows to about 2000 characters.",
        bullets: [
          "Up to 1080p (Veo 3.1), 720p (Fast / Fast Relax)",
          "Native 9:16 — TikTok, Reels, Shorts without cropping",
          "Image-to-Video: animate a starting frame",
          "Camera presets + extended duration",
          "Prompt limit ~2000 characters, audio inherited from Veo 3",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal order: [Subject + Appearance] + [Context/Scene] + [Action] + [Camera Movement/Composition] + [Style/Mood] + [Lighting] + [Dialogue: text] + [Audio/Ambiance] + [(no subtitles!)].\n\nVeo 3.1 fully inherits Veo 3 audio logic: the sound block is mandatory, dialogue uses a colon, append `(no subtitles!)` at the end. Thanks to stricter prompt adherence the tag works more reliably than in Veo 3.\n\nFor complex scenes use a structured prompt with explicit blocks:\n\nScene: A busy cafe in Paris, morning light streaming through large windows.\nCharacter: A young woman with auburn hair, wearing a cream sweater.\nAction: She lifts a cup of coffee, takes a sip, looks out the window.\nCamera: Slow dolly-in from medium shot to close-up.\nAudio: Ambient cafe sounds, clinking cups, soft jazz piano.\nMood: Warm, nostalgic, golden hour tones.\n(no subtitles!)\n\nThe model reads this layout better than a single long paragraph.",
      },
      {
        heading: "Vertical video and image-to-video",
        body:
          "For vertical 9:16 the format is chosen in the platform (Google AI Studio, Vertex AI), not in the prompt. Adapt the prompt to a portrait composition: more close-ups, portrait orientation for the subject, minimal wide landscape shots (they get lost in 9:16). Selfie style fits the vertical format particularly well.\n\nFor image-to-video the model uses the uploaded image as the first frame, and the prompt describes motion and action, NOT the original frame. Weak: «A woman in a cafe drinking coffee» (that is already shown in the photo). Strong: «The woman slowly lifts the cup to her lips and takes a sip. Camera: slow dolly-in to extreme close-up on her eyes. Background Sound: faint cafe chatter, distant espresso machine.». Description of the initial state is just noise — focus on motion only.",
      },
      {
        heading: "Dialogue, audio, subtitles",
        body:
          "Veo 3.1 fully inherits Veo 3 audio capabilities. Dialogue via colon, not in quotes: `says: text` works better than `says \"text\"` — quotes trigger embedded subtitles. Append `(no subtitles!)` to the end of the prompt.\n\nDialogue length must fit the clip duration: roughly 12-25 words per 8-second take. Too long — the model speaks unnaturally fast. Too short — it fills pauses with AI mumbling. With multiple characters state clearly who is speaking: «The woman in red says: ... The man with beard replies: ...».\n\nWrite background sounds out explicitly — even a plain «ambient room tone» removes the risk of «studio audience laughter». For music specify genre and mood: «a melancholic orchestral score swells», «upbeat electronic music with a driving beat», «no background music — just ambient room tone». Veo 3.1 follows these instructions more precisely than Veo 3.",
      },
      {
        heading: "Style, physics, consistency",
        body:
          "Style modifiers through «In the style of [style]:» work as in Veo 3: LEGO, Claymation, Pixar animation, Anime, Graphic novel, 8-bit retro, Stop-motion, Origami, South Park, Simpsons, Noir, Blueprint, Marble, Watercolor. Physics is preserved and improved: falls, bounces, fluids, fabric, hair, smoke simulate realistically even under style swaps.\n\nCharacter consistency: as in Veo 3, use a detailed verbatim description in every generation. «Maria, a woman in her 30s with long black hair in a braid, wearing a white lab coat and round glasses, with a warm smile» — repeat this block unchanged across scenes and the face plus wardrobe stay stable.\n\nPacing and timing: for tighter control describe the sequence of events — «The video opens with an establishing wide shot, then cuts to a close-up of her eyes, followed by a tracking shot as she walks down the alley». The model reads that as a shot breakdown.",
      },
    ],
    examples: [
      {
        before: "a woman drinking coffee in a cafe",
        after:
          "Scene: A busy cafe in Paris on a Saturday morning, golden light streaming through large arched windows.\nCharacter: A young woman with auburn hair tied in a low ponytail, wearing a cream cable-knit sweater, sits at a small marble table by the window.\nAction: She lifts a small espresso cup, takes a slow sip, then sets it down and looks out the window with a pensive expression.\nCamera: Slow dolly-in from medium shot to close-up on her face.\nLighting: Warm golden hour light through the windows, soft fill from a nearby lamp.\nMood: Warm, nostalgic, contemplative.\nAudio: Ambient cafe sounds — clinking cups, soft conversation in French, a jazz piano playing quietly in the background.\n(no subtitles!)",
        note:
          "Structured prompt with explicit blocks (Scene, Character, Action, Camera, Lighting, Mood, Audio). Veo 3.1 reads this better than a single long paragraph.",
      },
      {
        before: "vertical video of a person in the city",
        after:
          "Vertical 9:16 composition optimized for mobile. A young man with messy dark hair and a black hoodie, leaning against a graffiti-covered wall in a neon-lit Tokyo alley. He looks down at his phone, smiles, then glances up at the camera. Camera: portrait close-up, slight handheld micro-shake, slow push-in. Lighting: cyan neon key from screen-left, warm spill from a noodle shop sign on screen-right. Style: slightly grainy, film-like, cinematic vlog aesthetic. Mood: cool, urban, intimate. Background Sound: distant traffic hum, faint J-pop playing from a nearby shop, light rain on metal awnings. (no subtitles!)",
        note:
          "For 9:16: explicit «portrait close-up», subject positioned for a vertical frame, minimal wide shots. The format itself is set on the platform, not in the prompt.",
      },
      {
        before: "animate this product photo of headphones",
        after:
          "[Image-to-Video: starting frame is a product shot of matte-black wireless headphones on a white marble pedestal]\n\nThe headphones begin a slow, smooth 360-degree rotation on the pedestal. Camera: slow continuous orbit around the headphones at eye level, shallow depth of field maintained throughout. Lighting: existing softbox key and rim light from the starting frame, with subtle highlight movement as the headphones rotate. Style: clean commercial photography. Mood: premium, refined. Audio: subtle electronic ambient tone, soft mechanical hum, a gentle chime at the start of rotation. (no subtitles!)",
        note:
          "Image-to-Video: the prompt describes MOTION, not the contents of the source photo. Lighting is inherited from the starting frame; the prompt covers only dynamics.",
      },
    ],
    mistakes: [
      {
        title: "Describing the starting frame in Image-to-Video",
        explain:
          "In image-to-video mode the image ALREADY locks the first frame. Writing «A woman sitting in a cafe drinking coffee» in the prompt is just empty repetition of what the photo already shows. Describe MOTION only: «She slowly lifts the cup, takes a sip, looks out the window. Camera: slow dolly-in». Focus on dynamics, not statics.",
      },
      {
        title: "Format specified in the prompt text",
        explain:
          "«Vertical video», «9:16», «1080p» in the prompt text are ignored — these are generation parameters set on the platform or via the API. In the prompt they become noise. If you need vertical, pick it in Google AI Studio / Vertex AI and adapt the composition: «portrait close-up», «subject centered», close shots.",
      },
      {
        title: "Horizontal composition with 9:16 selected",
        explain:
          "If the vertical format is selected but the prompt still says «wide establishing shot of a city skyline» — the subject will be cropped and the frame loses meaning. For 9:16 adapt the composition: more close-ups, portrait orientation for people, minimal wide landscapes. Selfie style fits the vertical format particularly well.",
      },
      {
        title: "Dialogue in quotes without «no subtitles»",
        explain:
          "Veo 3.1 inherits Veo 3 subtitle behavior: quotes around dialogue trigger embedded captions at the bottom of the frame, often with typos. Use the `says: text` format with a colon and append `(no subtitles!)`. In Veo 3.1 the tag works more reliably than in Veo 3 thanks to improved prompt adherence.",
      },
      {
        title: "Re-rolling at an identical prompt",
        explain:
          "Veo 3.1, like Veo 3, is very consistent — an identical prompt yields a similar result. For variation CHANGE the prompt: swap the lens, change the lighting, alter the color palette, add a character detail. Re-rolling without changes wastes tokens; real variation comes only from edits.",
      },
    ],
    faq: [
      {
        q: "How is Veo 3.1 different from Veo 3?",
        a: "Five upgrades: improved prompt adherence (less guesswork), native vertical 9:16, image-to-video mode, camera presets, and longer clips. Base resolution rises to 1080p (vs. 720p in Veo 3). Audio capabilities are fully inherited — dialogue, ambience, SFX, music. The prompt limit grows from ~1500 to ~2000 characters.",
      },
      {
        q: "What is the difference between Veo 3.1, Fast, and Fast Relax?",
        a: "Veo 3.1 — maximum quality at 1080p, standard speed. Veo 3.1 Fast — 720p, noticeably faster, for iteration and prototyping. Veo 3.1 Fast Relax — 720p, even cheaper, for mass generation and tests. Prompting logic is identical across all three variants: the same structure blocks, the same audio and dialogue techniques.",
      },
      {
        q: "How do I make a vertical video for TikTok / Reels / Shorts?",
        a: "The 9:16 format is chosen on the platform (Google AI Studio or Vertex AI), not in the prompt. In the prompt adapt the composition: more close-ups, portrait orientation for the subject, explicit «portrait close-up» or «vertical composition». Minimize wide landscape shots — they get lost in vertical format. Selfie style is especially well suited.",
      },
      {
        q: "How do I use Image-to-Video mode?",
        a: "Upload a starting image (product shot, illustration, photo) and describe ONLY motion in the prompt — do not repeat what is already in the source frame. Focus on what moves, where the camera goes, what sounds appear. Lighting carries over from the starting frame. This is ideal for animating product photography and bringing static illustrations to life.",
      },
      {
        q: "Can I write dialogue in languages other than English?",
        a: "Technically yes — Veo 3.1 will pronounce other-language words, but quality is noticeably lower than in English: pronunciation and intonation can warp. For production work English is recommended. If you need non-English dialogue, use phonetic spelling for tricky words and test on short phrases before long scenes. Veo 3.1 is slightly more accurate than Veo 3 across non-English languages.",
      },
      {
        q: "What is the optimal prompt length?",
        a: "The recommended limit is around 2000 characters. That gives room for detailed descriptions of characters, environment, action, camera, lighting, audio, and style without losing quality. Prompts longer than 2000 characters start to drop details: the model cannot process the entire description in full. For very complex scenes break the prompt into structured blocks (Scene/Character/Action/Camera/Audio).",
      },
      {
        q: "Does Opten support Veo 3.1?",
        a: "Yes, the Opten extension detects Veo 3.1, Fast, and Fast Relax on Google AI Studio, Vertex AI, and Flow and scores prompts against the structure outlined above: it checks the audio block, the colon dialogue format, the «(no subtitles!)» tag, composition adapted to the format, and the correct image-to-video shape. One click gives you a rewrite.",
      },
    ],
  },
};
