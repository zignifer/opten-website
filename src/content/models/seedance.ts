// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for seedance.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedance 2.0: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedance 2.0 от ByteDance: 10 типов генерации, timestamp-раскадровка, мультимодальный вход, звуковой контроль, типичные ошибки.",
    h1: "Seedance 2.0: как писать промпты, которые модель понимает",
    intro:
      "Seedance 2.0 — видеомодель от ByteDance (платформа 即梦/Jimeng) с длительностью 4–15 секунд за один запуск и разрешением до 2K. Мощный мультимодальный вход: до 9 изображений, 3 видео и 3 аудио на запрос. 10 типов генерации, timestamp-раскадровка для длинных видео, нативный звуковой контроль. Промпты до 2 000 символов.",
    sections: [
      {
        heading: "Что умеет Seedance 2.0",
        body:
          "Seedance 2.0 — одна из самых функциональных видеомоделей публичного рынка. Десять типов генерации в одном продукте: T2V, Consistency Control с @-референсами, копирование камеры из reference-видео, копирование спецэффектов, story completion, video extension, voice cloning, one-take long shot, video editing, beat sync с музыкой.\n\nМультимодальный вход: до 9 изображений (jpeg/png/webp/bmp/tiff/gif, <30MB), до 3 видео (mp4/mov, 2–15с, <50MB, 480p–720p), до 3 аудио (mp3/wav, ≤15с суммарно, <15MB), максимум 12 файлов в одном запросе. Длительность 4–15 секунд за проход, для более длинного контента — последовательное продление через @Video.",
        bullets: [
          "10 типов генерации, включая voice cloning и beat sync",
          "Мультимодальный вход: 9 изображений + 3 видео + 3 аудио",
          "Длительность 4–15 секунд, разрешение до 2K",
          "@-референсы для consistency control персонажей и сцен",
          "Timestamp-раскадровка для 13–15 секундных нарративов",
        ],
      },
      {
        heading: "Базовая структура промпта",
        body:
          "Оптимальная формула: [Subject/Character] + [Scene/Environment] + [Action/Motion] + [Camera Movement] + [Timing Breakdown] + [Audio/Sound] + [Style/Mood]. Не обязательно использовать все элементы — состав зависит от типа видео.\n\nЧем больше конкретики, тем лучше результат. Активные глаголы вместо абстракций («ходит, поворачивается, берёт» вместо «что-то происходит»). Хотя бы одно указание на крупность плана или движение камеры в каждом промпте. Конкретное физическое описание сцены и среды.\n\nДлина промпта — до 2 000 символов. На syntx.ai (англоязычная платформа) рекомендуется английский; на нативном 即梦 китайский даёт чуть лучшие результаты. Английский в любом случае не штраф — модель обучена на обоих языках.",
      },
      {
        heading: "10 типов генерации",
        body:
          "T2V — генерация только из текста. Consistency Control — фиксация персонажа/продукта/сцены через @-референсы изображений. Копирование камеры — загрузка reference-видео для копирования камерных движений и хореографии. Копирование спецэффектов — VFX и переходы из reference-видео.\n\nStory Completion — модель достраивает сюжет из раскадровки или последовательности изображений. Video Extension — плавное продление существующего видео. Voice Control — клонирование голоса, генерация диалогов, звуковой дизайн. One-Take Long Shot — непрерывный план без склеек.\n\nVideo Editing — замена персонажей, изменение сюжета. Beat Sync — синхронизация визуального ритма с музыкой через reference-аудио. Каждый тип имеет свою формулу промпта (см. документацию на платформе).",
      },
      {
        heading: "Timestamp-раскадровка",
        body:
          "Самая мощная техника для 13–15 секундных видео — разбивка по секундам. Это даёт точный контроль над развитием нарратива:\n\n0-3с: [сцена + камера + звук]\n4-8с: [сцена + камера + звук]\n9-12с: [сцена + камера + звук]\n13-15с: [сцена + камера + звук]\n\nКлючевое правило — реалистичные таймкоды. Полноценное действие требует 2–3 секунды, короткий жест — 1 секунду. Не пытайся упаковать «ходьбу через комнату» в 0.5 секунды. Для 4–8 секундных видео timestamp не обязателен — достаточно одного-двух ключевых моментов. Для 9–12 секунд тайминг рекомендуется. Для 13–15 — обязателен для хорошего результата.",
      },
      {
        heading: "Звук, диалоги, продление",
        body:
          "Voice Control — Seedance может клонировать голос из reference-аудио и применять его к диалогам. Диалоги в кавычках с указанием персонажа и эмоции: «The woman calmly says: \"I told you it would work.\"». Звуковой дизайн отдельной строкой — engine roaring, footsteps, ambient, music.\n\nДля видео длиннее 15 секунд — многосегментная генерация. Сегмент 1 — нормальная генерация до 15с, заканчивается на «чистом» кадре. Сегмент 2+ — загрузка предыдущего видео как @Video1, промпт «Продлить @Video1 на Xс» + описание нового контента. Между сегментами — описание точки склейки для плавного перехода. Так собираются 30+ секундные нарративы.\n\nТехнические параметры в начале промпта: ориентация, aspect ratio (2.35:1 / 16:9 / 9:16), FPS, длительность, стиль/тон. В конце — негативные инструкции («Запрещено: текст, субтитры, водяные знаки»), хотя на syntx.ai формат негативов может работать иначе.",
      },
    ],
    examples: [
      {
        before:
          "видео где человек убегает по улице",
        after:
          "Wide tracking shot of a man in a black hoodie sprinting down a narrow alley at dusk. Side tracking, camera moves at chest height parallel to him. He knocks over a fruit stall, stumbles, gets back up, keeps running. Wet pavement reflects neon signs. Loud panicked footsteps, distant crowd murmur, heavy breathing. 16:9, 24fps, 8 seconds, cinematic noir tone.",
        note: "Конкретная сцена (alley at dusk), физические детали (knocks over stall, wet pavement), камерные параметры (chest height parallel), звук (footsteps, crowd, breathing), технические параметры в конце. Это рабочий T2V-промпт.",
      },
      {
        before:
          "длинное видео с историей героя 15 секунд",
        after:
          "0-3с: Wide shot, a woman in a red coat walks toward a wooden cabin in a snowy forest. Slow forward dolly, soft ambient wind, crunching snow.\n4-8с: Medium shot, she opens the cabin door, warm orange light spills onto the snow. Camera slowly pushes in.\n9-12с: Interior close-up, she sets a lantern on a wooden table, takes off her gloves. Soft crackling fireplace ambient.\n13-15с: Wide interior shot, she sits by the fire, exhales. Camera pulls back to reveal the warm, intimate room. Soft piano music begins.",
        note: "Timestamp-раскадровка с реалистичным таймингом (3–4 секунды на beat), консистентный персонаж (the woman in red coat), плавный нарратив через 4 сцены. Звук варьируется по сценам. Это сильная сторона именно Seedance 2.0.",
      },
      {
        before:
          "продуктовый ролик с моим брендом из 3 кадров",
        after:
          "Use @Image1 (product hero shot) and @Image2 (lifestyle context). Beat sync to @Audio1 (brand music track).\n0-2с: Close-up of @Image1 product rotating slowly on a marble surface. Soft side light, shallow DoF.\n3-5с: Cut to @Image2 lifestyle scene, person holds the product naturally, smiles slightly. Hand-held camera, warm afternoon light.\n6-8с: Wide editorial shot, product centered with brand color palette around it. Smooth dolly out. Beat hit at 8s. 16:9, 24fps.",
        note: "Multi-modal промпт с @-референсами (Image1, Image2, Audio1), beat sync к музыке, timestamp-раскадровка для 3 шотов, технические параметры. Это production-сценарий, под который Seedance 2.0 спроектирован.",
      },
    ],
    mistakes: [
      {
        title: "Слишком короткий или слишком длинный промпт",
        explain:
          "Меньше 15 слов — модель додумает слишком много, и результат непредсказуем. Больше 2 000 символов — перегрузка деталями, модель начинает игнорировать часть промпта. Оптимум для большинства сцен — 50–200 слов, для timestamp-раскадровок — 300–500 слов с явными сценами.",
      },
      {
        title: "Конфликтующие камерные движения одновременно",
        explain:
          "«Zoom in while panning left and orbiting around» — модель не справится с тремя одновременными движениями за 5–10 секунд экранного времени. Выбирай одно главное движение в сцене, плюс опциональный модификатор скорости. Если нужны разные движения — разбивай на сегменты через timestamp-раскадровку.",
      },
      {
        title: "Запрос больше 15 секунд в одном проходе",
        explain:
          "15 секунд — жёсткий лимит платформы за одну генерацию. Запрос «30-секундное видео» либо обрежет до 15, либо вернёт ошибку. Для более длинного контента — многосегментная схема через Video Extension: сегмент за сегментом с плавными склейками.",
      },
      {
        title: "Абстрактные формулировки вместо физических действий",
        explain:
          "«Something beautiful happens», «emotional moment», «mood shifts» — модель не понимает абстракций. Описывай конкретные физические действия: «she slowly turns her head», «light fades from warm to cool», «petals fall onto the table». Это даёт предсказуемый, контролируемый результат.",
      },
      {
        title: "Реалистичные человеческие лица в загружаемых изображениях",
        explain:
          "Платформа 即梦/Jimeng блокирует загрузку реалистичных человеческих лиц в качестве референсов — это политика ByteDance, не bypass'абельное ограничение. Для I2V с людьми используй стилизованные референсы (illustration, painting, cartoon) или генерируй сцену с людьми через T2V без reference-изображения.",
      },
    ],
    faq: [
      {
        q: "На каком языке писать промпт?",
        a: "Seedance 2.0 — китайская модель, на нативной платформе 即梦 китайский даёт чуть лучшие результаты. Но английский тоже хорошо поддерживается, особенно на syntx.ai (англоязычная платформа). Для большинства production-сценариев английский — стандарт, не штраф. Если знаешь китайский — пиши на нём, это даст marginal улучшение.",
      },
      {
        q: "Какой длины может быть видео?",
        a: "От 4 до 15 секунд за один запуск. Это гибкая длительность с шагом 1 секунда. Для более длинного контента — многосегментная генерация через Video Extension: загружаешь предыдущее видео как @Video1, пишешь «Продлить @Video1 на Xс» + описание новой части. Так собираются 30+ секундные нарративы из последовательных сегментов.",
      },
      {
        q: "Когда обязательна timestamp-раскадровка?",
        a: "Для 13–15 секундных видео — обязательна для хорошего результата, иначе модель не справляется с длинным нарративом. Для 9–12 секунд — рекомендуется. Для 4–8 секунд — необязательна, достаточно одного-двух ключевых моментов. Формат: «0-3с: …», «4-8с: …», с реалистичными таймкодами (2–3 секунды на полноценное действие).",
      },
      {
        q: "Как сохранить персонажа через несколько сцен?",
        a: "Через Consistency Control с @-референсами изображений. Загружаешь 1–3 фото персонажа, в промпте ссылаешься на @Image1: «@Image1 walks across the room», «@Image1 sits down». Модель будет удерживать внешность через всю генерацию. Для серии видео тот же @-референс даёт consistent персонажа на нескольких клипах.",
      },
      {
        q: "Можно ли клонировать голос?",
        a: "Да, через Voice Control. Загружаешь reference-аудио (mp3/wav, ≤15с, <15MB) и в промпте указываешь @Audio1 как источник голоса для диалогов. Диалоги в кавычках с указанием персонажа: «The woman calmly says: \"I told you.\"». Это даёт lip-sync с клонированным голосом — мощный инструмент для дубляжа и виртуальных персонажей.",
      },
      {
        q: "Какие ограничения по входным файлам?",
        a: "До 9 изображений (jpeg/png/webp/bmp/tiff/gif, <30MB каждое), до 3 видео (mp4/mov, 2–15с, <50MB, 480p–720p), до 3 аудио (mp3/wav, ≤15с суммарно, <15MB). Максимум 12 файлов в одном запросе. Платформа блокирует реалистичные человеческие лица в загружаемых изображениях/видео — для I2V с людьми используй стилизованные референсы.",
      },
      {
        q: "Поддерживается ли Opten для Seedance 2.0?",
        a: "Да, расширение Opten распознаёт Seedance внутри syntx.ai и оценивает промпты по структуре, специфичной для модели: проверяет наличие субъекта, действия и камеры, корректность timestamp-раскадровки для длинных видео, реалистичность таймкодов, использование @-референсов для consistency, и описание звука в промпте. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Seedance 2.0 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedance 2.0: 10 generation types, timestamp storyboarding, multimodal input, voice control, common mistakes and examples.",
    h1: "Seedance 2.0: how to write prompts the model actually understands",
    intro:
      "Seedance 2.0 is a video model from ByteDance (Jimeng platform) with 4–15 seconds per generation and resolution up to 2K. Powerful multimodal input: up to 9 images, 3 videos, and 3 audio files per request. 10 generation types, timestamp storyboarding for long videos, native voice control. Prompts up to 2,000 characters.",
    sections: [
      {
        heading: "What Seedance 2.0 does well",
        body:
          "Seedance 2.0 is one of the most feature-rich public video models. Ten generation types in one product: T2V, Consistency Control with @-references, copying camera from a reference video, copying VFX, story completion, video extension, voice cloning, one-take long shot, video editing, beat sync to music.\n\nMultimodal input: up to 9 images (jpeg/png/webp/bmp/tiff/gif, <30MB), up to 3 videos (mp4/mov, 2–15s, <50MB, 480p–720p), up to 3 audio files (mp3/wav, ≤15s combined, <15MB), max 12 files per request. Duration 4–15 seconds per pass; for longer content, sequential extension via @Video.",
        bullets: [
          "10 generation types including voice cloning and beat sync",
          "Multimodal input: 9 images + 3 videos + 3 audio files",
          "Duration 4–15 seconds, resolution up to 2K",
          "@-references for character and scene consistency control",
          "Timestamp storyboarding for 13–15 second narratives",
        ],
      },
      {
        heading: "Basic prompt structure",
        body:
          "Optimal formula: [Subject/Character] + [Scene/Environment] + [Action/Motion] + [Camera Movement] + [Timing Breakdown] + [Audio/Sound] + [Style/Mood]. You don't have to use every element — composition depends on video type.\n\nThe more specific, the better. Active verbs over abstractions («walks, turns, picks up» beats «something happens»). At least one shot-size or camera-movement directive per prompt. Concrete physical description of the scene and environment.\n\nPrompt length is up to 2,000 characters. On syntx.ai (English-language platform) English is recommended; on native Jimeng Chinese yields slightly better results. English is fine either way — the model is trained bilingually.",
      },
      {
        heading: "The 10 generation types",
        body:
          "T2V — text-only generation. Consistency Control — lock a character, product, or scene via @-references. Copy Camera — upload a reference video to copy camera moves and choreography. Copy VFX — replicate transitions and effects from a reference video.\n\nStory Completion — the model continues a narrative from a storyboard or image sequence. Video Extension — smooth continuation of an existing video. Voice Control — voice cloning, dialogue generation, sound design. One-Take Long Shot — continuous shot without cuts.\n\nVideo Editing — character swaps, plot changes. Beat Sync — visual rhythm synced to music via reference audio. Each type has its own prompt formula (see platform documentation).",
      },
      {
        heading: "Timestamp storyboarding",
        body:
          "The most powerful technique for 13–15 second videos is per-second breakdown. It gives precise control over narrative pacing:\n\n0-3s: [scene + camera + sound]\n4-8s: [scene + camera + sound]\n9-12s: [scene + camera + sound]\n13-15s: [scene + camera + sound]\n\nKey rule — realistic timecodes. A full action needs 2–3 seconds, a short gesture 1 second. Don't try to cram «walking across a room» into 0.5 seconds. For 4–8 second videos, timestamp isn't required — one or two key moments are enough. For 9–12 seconds, timing is recommended. For 13–15 seconds, it's mandatory for a good result.",
      },
      {
        heading: "Sound, dialogue, extension",
        body:
          "Voice Control — Seedance can clone a voice from reference audio and apply it to dialogue. Dialogue in quotes with character and emotion: «The woman calmly says: \"I told you it would work.\"». Sound design as a separate line — engine roaring, footsteps, ambient, music.\n\nFor videos longer than 15 seconds, use multi-segment generation. Segment 1 — normal generation up to 15s, ending on a «clean» frame. Segment 2+ — upload the previous video as @Video1, prompt «Extend @Video1 by Xs» + description of the new content. Between segments — describe the seam for a smooth handoff. That's how 30+ second narratives are built.\n\nTechnical parameters at the start of the prompt: orientation, aspect ratio (2.35:1 / 16:9 / 9:16), FPS, duration, style/tone. At the end — negative instructions («Forbidden: text, subtitles, watermarks»), though on syntx.ai the negative format may work differently.",
      },
    ],
    examples: [
      {
        before: "video where a man runs down the street",
        after:
          "Wide tracking shot of a man in a black hoodie sprinting down a narrow alley at dusk. Side tracking, camera moves at chest height parallel to him. He knocks over a fruit stall, stumbles, gets back up, keeps running. Wet pavement reflects neon signs. Loud panicked footsteps, distant crowd murmur, heavy breathing. 16:9, 24fps, 8 seconds, cinematic noir tone.",
        note: "Concrete scene (alley at dusk), physical detail (knocks over stall, wet pavement), camera parameters (chest height parallel), sound (footsteps, crowd, breathing), technical parameters at the end. A working T2V prompt.",
      },
      {
        before: "long 15-second video with a hero's story",
        after:
          "0-3s: Wide shot, a woman in a red coat walks toward a wooden cabin in a snowy forest. Slow forward dolly, soft ambient wind, crunching snow.\n4-8s: Medium shot, she opens the cabin door, warm orange light spills onto the snow. Camera slowly pushes in.\n9-12s: Interior close-up, she sets a lantern on a wooden table, takes off her gloves. Soft crackling fireplace ambient.\n13-15s: Wide interior shot, she sits by the fire, exhales. Camera pulls back to reveal the warm, intimate room. Soft piano music begins.",
        note: "Timestamp storyboarding with realistic pacing (3–4 seconds per beat), consistent character (the woman in red coat), smooth narrative across 4 scenes. Sound varies by scene. The Seedance 2.0 sweet spot.",
      },
      {
        before: "product spot with my brand using 3 shots",
        after:
          "Use @Image1 (product hero shot) and @Image2 (lifestyle context). Beat sync to @Audio1 (brand music track).\n0-2s: Close-up of @Image1 product rotating slowly on a marble surface. Soft side light, shallow DoF.\n3-5s: Cut to @Image2 lifestyle scene, person holds the product naturally, smiles slightly. Hand-held camera, warm afternoon light.\n6-8s: Wide editorial shot, product centered with brand color palette around it. Smooth dolly out. Beat hit at 8s. 16:9, 24fps.",
        note: "Multimodal prompt with @-references (Image1, Image2, Audio1), beat sync to music, timestamp breakdown for 3 shots, technical parameters. This is the production scenario Seedance 2.0 is designed for.",
      },
    ],
    mistakes: [
      {
        title: "Prompt too short or too long",
        explain:
          "Under 15 words — the model invents too much, results are unpredictable. Over 2,000 characters — detail overload, the model starts ignoring parts of the prompt. The sweet spot for most scenes is 50–200 words; for timestamp storyboards 300–500 words with explicit scenes.",
      },
      {
        title: "Conflicting camera moves at once",
        explain:
          "«Zoom in while panning left and orbiting around» — the model can't fit three simultaneous moves into 5–10 seconds of screen time. Pick one main move per scene plus an optional speed modifier. If you need different moves, split them across timestamp segments.",
      },
      {
        title: "Asking for more than 15 seconds in one pass",
        explain:
          "15 seconds is a hard platform limit per generation. A «30-second video» request either truncates to 15 or errors out. For longer content, use the multi-segment approach via Video Extension: segment by segment with smooth handoffs.",
      },
      {
        title: "Abstract phrasing instead of physical actions",
        explain:
          "«Something beautiful happens», «emotional moment», «mood shifts» — the model doesn't understand abstractions. Describe concrete physical actions: «she slowly turns her head», «light fades from warm to cool», «petals fall onto the table». This delivers predictable, controllable results.",
      },
      {
        title: "Realistic human faces in uploaded references",
        explain:
          "The Jimeng platform blocks uploading realistic human faces as references — it's a ByteDance policy, not a bypassable limit. For I2V with humans, use stylized references (illustration, painting, cartoon) or generate the human-containing scene via T2V without a reference image.",
      },
    ],
    faq: [
      {
        q: "What language should I write the prompt in?",
        a: "Seedance 2.0 is a Chinese model — on native Jimeng, Chinese yields slightly better results. But English is also well supported, especially on syntx.ai (the English-language platform). For most production scenarios English is the standard, not a penalty. If you know Chinese, write in it — that delivers a marginal lift.",
      },
      {
        q: "How long can the video be?",
        a: "From 4 to 15 seconds per generation, flexible with 1-second steps. For longer content, use multi-segment generation via Video Extension: upload the previous video as @Video1, write «Extend @Video1 by Xs» + a description of the new part. That's how 30+ second narratives are built from sequential segments.",
      },
      {
        q: "When is timestamp storyboarding mandatory?",
        a: "For 13–15 second videos — mandatory for a good result; otherwise the model can't handle the long narrative. For 9–12 seconds — recommended. For 4–8 seconds — optional, one or two key moments are enough. Format: «0-3s: …», «4-8s: …», with realistic timecodes (2–3 seconds per full action).",
      },
      {
        q: "How do I keep a character consistent across multiple scenes?",
        a: "Use Consistency Control with @-references. Upload 1–3 photos of the character, reference @Image1 in the prompt: «@Image1 walks across the room», «@Image1 sits down». The model holds the appearance throughout the generation. For a series of videos, the same @-reference yields a consistent character across multiple clips.",
      },
      {
        q: "Can I clone a voice?",
        a: "Yes, via Voice Control. Upload reference audio (mp3/wav, ≤15s, <15MB) and reference @Audio1 in the prompt as the voice source for dialogue. Dialogue in quotes with character markers: «The woman calmly says: \"I told you.\"». This delivers lip-sync with the cloned voice — a powerful tool for dubbing and virtual characters.",
      },
      {
        q: "What are the input file limits?",
        a: "Up to 9 images (jpeg/png/webp/bmp/tiff/gif, <30MB each), up to 3 videos (mp4/mov, 2–15s, <50MB, 480p–720p), up to 3 audio files (mp3/wav, ≤15s combined, <15MB). Max 12 files per request. The platform blocks realistic human faces in uploaded references — for I2V with humans, use stylized references.",
      },
      {
        q: "Does Opten support Seedance 2.0?",
        a: "Yes, the Opten extension recognizes Seedance inside syntx.ai and scores prompts against the model-specific structure: it checks for subject, action, and camera, correct timestamp storyboarding for long videos, realistic timecodes, @-reference use for consistency, and audio description in the prompt. One click yields a rewrite in the right structure.",
      },
    ],
  },
};
