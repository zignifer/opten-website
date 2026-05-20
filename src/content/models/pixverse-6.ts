// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for pixverse-6.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для PixVerse V6: структура, ошибки, примеры",
    description:
      "Как писать промпты для PixVerse V6: literal-стиль, нативное аудио, multi-shot, cinematic lens controls, негативные промпты, типичные ошибки и примеры до/после.",
    h1: "PixVerse V6: как писать промпты, которые модель понимает",
    intro:
      "PixVerse V6 — видеомодель PixVerse с нативной генерацией аудио, multi-shot режимом и 20+ cinematic lens controls. Поддерживает T2V и I2V, до 15 секунд при 1080p, негативные промпты и кастомные seed-значения. Лучше всего реагирует на буквальные физические описания, не на метафоры.",
    sections: [
      {
        heading: "Что нового в V6",
        body:
          "Главная фича V6 — нативная генерация аудио за один проход: фоновая музыка, SFX, эмбиент, даже диалоги. Аудио описывается явно в промпте («Loud engine roaring sound. Tires hitting gravel sound.») и генерируется синхронно с видео.\n\nВторая фича — multi-shot engine: короткометражки с нативными переходами и консистентностью персонажей. Третья — 20+ cinematic lens controls (focal length, aperture, DoF, lens distortion, chromatic aberration, vignetting) как продакшн-параметры, не как prompt hints. И четвёртая — до 15 секунд при 1080p в одной генерации против 5–10 у предыдущих версий.",
        bullets: [
          "Нативное аудио (BGM, SFX, диалоги, эмбиент) за один проход",
          "Multi-shot engine с переходами и character consistency",
          "20+ cinematic lens controls как параметры, не текст",
          "До 15 секунд при 1080p (5–8 сек на V5.5)",
          "Поддержка негативных промптов и custom seed",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "PixVerse понимает буквально — никаких метафор и абстракций. Базовая формула: [Subject] + [Action] + [Environment] + [Camera movement] + [Audio description].\n\nОписывай только что ВИДНО и СЛЫШНО. «Tears of the sky» — мусор; «Heavy rain falling on pavement» — рабочий промпт. Это особенно важно для V6, потому что новые lens controls работают только если модель чётко понимает физическую сцену.\n\nДлина промпта — от 2 до 2 048 символов. Параметр `thinking_type` (enabled/disabled/auto) включает автооптимизацию промпта — на коротких промптах enabled может заметно улучшить результат.",
      },
      {
        heading: "Аудио в промпте",
        body:
          "V6 — одна из первых публичных видеомоделей с нативным аудио. Описывай звуки явно в тексте промпта: «Loud engine roaring sound. Tires hitting gravel sound. Wind rushing past.»\n\nПоддерживаемые категории: SFX (engine, footsteps, splashes, impacts), эмбиент (forest, urban street, ocean waves), BGM (упрощённо — «soft piano music», «driving bass beat»), диалоги в кавычках с lip-sync. Чем конкретнее звук, тем лучше — «soft synth pad» вместо «nice music».\n\nАудио описывается отдельным блоком в промпте, обычно после визуальной части. Это не «лишний текст», как может показаться — это рабочая фича V6, без неё в кадре будет тишина.",
      },
      {
        heading: "Style presets и lens controls",
        body:
          "Стили задаются параметром, не в промпте: `anime`, `3d_animation`, `clay`, `comic`, `cyberpunk`. Если написать в тексте «in anime style» — будет хуже, чем выбрать preset через параметр. Каждый preset поддерживает lip-sync для диалоговых сцен.\n\nCinematic lens controls тоже через параметры: focal length (24mm wide, 50mm normal, 85mm portrait), aperture (f/1.4 shallow DoF, f/8 deep), lens distortion, chromatic aberration, vignetting. Это не prompt hints, а продакшн-настройки, как на реальной камере. На V5.5 этих контроллов нет, всё нужно было прописывать в тексте — на V6 это вынесено отдельно.",
      },
      {
        heading: "Multi-shot и негативные промпты",
        body:
          "Multi-shot engine — короткометражки до 15 секунд с нативными переходами между шотами. Сохраняется консистентность освещения и персонажей через серию кадров. Можно загрузить до 3 reference изображений (multi-image reference) для фиксации внешности персонажа.\n\nКлючевое правило multi-shot — повторять character descriptors в каждом шоте, иначе модель начнёт дрейфовать. «The woman in red coat» в шоте 1, «she» в шоте 2 — плохо; «the woman in red coat» в обоих — хорошо.\n\nНегативные промпты в V6 работают штатно: `\"blurry, distorted hands, extra limbs, watermark\"`. Это отдельное поле, не часть основного промпта. В отличие от Runway Gen-4/4.5 (где негативы не поддерживаются), здесь это рабочий инструмент.",
      },
    ],
    examples: [
      {
        before:
          "красивое кинематографичное видео машины в городе ночью",
        after:
          "A black sports car drives through a wet downtown street at night. Neon signs reflect on the asphalt. Camera tracks the car from a low angle, smooth dolly motion. Loud engine roaring sound, tires hissing on wet pavement, distant urban ambient. 50mm focal length, shallow DoF.",
        note: "Буквальные физические детали (wet street, neon reflections), явное аудио (engine, tires, ambient), отдельный блок lens (50mm, shallow DoF). V5.5 потребовал бы прописать «50mm shallow depth of field» в текст; V6 принимает это как параметр.",
      },
      {
        before:
          "анимешный клип где девушка плачет от грусти, эмоциональная музыка",
        after:
          "A young woman sits on a windowsill, soft tears running down her cheeks. Rain on the glass behind her, grey overcast light. Camera slowly pushes in from medium shot to close-up. Soft piano music, gentle rain ambient. Style preset: anime (set via parameter, not in prompt).",
        note: "Стиль anime вынесен в параметр, не в текст. Эмоция передана через физические детали (tears, posture, rain), а не через абстрактное «sad». Аудио описано отдельным блоком.",
      },
      {
        before:
          "продуктовый ролик кроссовок на улице",
        after:
          "Shot 1: Close-up of running shoes on wet asphalt, water splashing as the foot lifts off. Shot 2: Medium tracking shot, the runner sprints down an empty street at sunrise. Shot 3: Wide shot, the runner crosses the frame, golden light flaring through buildings. Footsteps slapping pavement, rhythmic breath, upbeat electronic music. Negative prompt: blurry, watermark.",
        note: "Multi-shot структура (3 шота, явные переходы), повтор «runner» в каждом для consistency, аудио отдельным блоком, негативный промпт вынесен отдельно. Это сильная сторона именно V6.",
      },
    ],
    mistakes: [
      {
        title: "Метафоры вместо буквальных описаний",
        explain:
          "PixVerse понимает буквально. «Tears of the sky» модель попытается интерпретировать дословно — может появиться плачущее небо или странный артефакт. «Heavy rain falling on pavement» даст ровно то, что нужно. Описывай физически: что движется, как именно, в какой среде.",
      },
      {
        title: "Стили в тексте промпта вместо параметра",
        explain:
          "«In anime style» или «as a clay animation» в тексте работает заметно хуже, чем выбор соответствующего style preset через параметр (`anime`, `clay`, `3d_animation`, `comic`, `cyberpunk`). Стили вынесены в отдельное поле специально — используй его, а текст оставь для содержимого сцены.",
      },
      {
        title: "Отсутствие аудио-описания на V6",
        explain:
          "V6 умеет нативно генерировать аудио, но только если ты его описал в промпте. Без аудио-блока кадр будет тихим. Минимум — упомянуть ambient («urban street ambient»). Максимум — конкретные SFX, BGM и диалоги в кавычках. Это рабочая фича модели, а не лишний текст.",
      },
      {
        title: "1080p × 10 секунд на V5.5",
        explain:
          "На V5.5 при 1080p максимум 5–8 секунд; 10 секунд возможны только в 720p. На V6 это снято — до 15 секунд при 1080p за один проход. Если генерация на V5.5 проваливается с запросом «1080p, 10s», переключайся на V6 или соглашайся на 720p.",
      },
      {
        title: "Забыть character descriptors в multi-shot",
        explain:
          "В multi-shot режиме модель легко теряет персонажа между шотами, если в каждом не повторять ключевые дескрипторы. «The woman in red coat» в шоте 1, «she» в шоте 2 — drift почти гарантирован. Повторяй короткий descriptor («the woman in red coat») в каждом шоте — это удерживает identity.",
      },
    ],
    faq: [
      {
        q: "Чем PixVerse V6 отличается от V5.5?",
        a: "Четыре главных отличия: нативная генерация аудио (BGM, SFX, диалоги) за один проход, до 15 секунд при 1080p против 5–8 на V5.5, 20+ cinematic lens controls как параметры, и multi-shot engine с нативными переходами. V5.5 остаётся актуальным для коротких клипов с эффектами (46 шаблонов effects), но для серьёзного контента V6 — однозначный апгрейд.",
      },
      {
        q: "Нужно ли описывать аудио в промпте, если хочется тихий клип?",
        a: "Да, лучше явно. Если аудио не описано, V6 либо генерирует тишину, либо добавляет случайный ambient — это непредсказуемо. Для тихого клипа можно написать «silent» или указать только тонкий ambient: «very faint room tone». Контролируемая тишина лучше случайной — это вообще главное правило работы с аудио в V6.",
      },
      {
        q: "Поддерживаются ли негативные промпты?",
        a: "Да, это документированная фича V6 (и V5.5). Негативный промпт — отдельное поле или API-параметр. Формат: запятая-разделённый список того, что исключить: «blurry, distorted hands, extra limbs, watermark, text». В отличие от Runway Gen-4/4.5, где негативы не работают, в PixVerse это рабочий инструмент.",
      },
      {
        q: "Как сохранить персонажа между кадрами в multi-shot?",
        a: "Два инструмента: повторение character descriptors в каждом шоте и multi-image reference (до 3 изображений персонажа на вход). Лучшая практика — комбинировать оба: загрузить 2–3 фото персонажа как reference и в каждом текстовом шоте повторять короткое описание («the woman in red coat»). Это даёт максимальную консистентность.",
      },
      {
        q: "Что делать с параметром thinking_type?",
        a: "Три значения: `enabled` (модель автоматически оптимизирует промпт перед генерацией), `disabled` (промпт идёт как написан), `auto` (модель решает по сложности промпта). Для коротких промптов 10–20 слов `enabled` даёт заметное улучшение качества. Для длинных детальных промптов 100+ слов `disabled` сохраняет твой контроль. `auto` — разумный дефолт.",
      },
      {
        q: "Какой длины должен быть промпт?",
        a: "От 2 до 2 048 символов технически. На практике 50–200 слов — оптимально для большинства сцен. Короткие промпты (10–20 слов) лучше комбинировать с `thinking_type=enabled`. Длинные multi-shot промпты могут быть 300+ слов с тремя блоками шотов и аудио-описанием — это нормально.",
      },
      {
        q: "Поддерживается ли Opten для PixVerse V6?",
        a: "Да, расширение Opten распознаёт PixVerse внутри pixverse.ai и оценивает промпты по структуре, специфичной для V6: проверяет наличие аудио-описания, буквальность физических описаний, использование style preset как параметра (а не в тексте), повторение character descriptors в multi-shot и адекватность негативного промпта.",
      },
    ],
  },
  en: {
    title: "PixVerse V6 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for PixVerse V6: literal style, native audio, multi-shot, cinematic lens controls, negative prompts, common mistakes and examples.",
    h1: "PixVerse V6: how to write prompts the model actually understands",
    intro:
      "PixVerse V6 is a video model from PixVerse with native audio generation, multi-shot mode, and 20+ cinematic lens controls. It supports T2V and I2V, up to 15 seconds at 1080p, negative prompts, and custom seeds. It responds best to literal physical descriptions — not metaphors.",
    sections: [
      {
        heading: "What's new in V6",
        body:
          "The headline feature is native audio in a single pass: background music, SFX, ambient, even dialogue. Audio is described explicitly in the prompt («Loud engine roaring sound. Tires hitting gravel sound.») and generated in sync with the video.\n\nSecond, the multi-shot engine: short films with native transitions and character consistency. Third, 20+ cinematic lens controls (focal length, aperture, DoF, lens distortion, chromatic aberration, vignetting) as production parameters, not prompt hints. And fourth, up to 15 seconds at 1080p in a single generation, versus 5–10 in previous versions.",
        bullets: [
          "Native audio (BGM, SFX, dialogue, ambient) in one pass",
          "Multi-shot engine with transitions and character consistency",
          "20+ cinematic lens controls as parameters, not text",
          "Up to 15 seconds at 1080p (5–8 sec on V5.5)",
          "Negative prompts and custom seed supported",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "PixVerse reads literally — no metaphors, no abstractions. The base formula: [Subject] + [Action] + [Environment] + [Camera movement] + [Audio description].\n\nDescribe only what you SEE and HEAR. «Tears of the sky» is noise; «Heavy rain falling on pavement» is a working prompt. This matters extra on V6, because the new lens controls only kick in when the model has a clear grip on the physical scene.\n\nPrompt length ranges from 2 to 2,048 characters. The `thinking_type` parameter (enabled/disabled/auto) toggles automatic prompt optimization — on short prompts, `enabled` can noticeably lift quality.",
      },
      {
        heading: "Audio in the prompt",
        body:
          "V6 is one of the first public video models with native audio. Describe sounds explicitly in the prompt text: «Loud engine roaring sound. Tires hitting gravel sound. Wind rushing past.»\n\nSupported categories: SFX (engine, footsteps, splashes, impacts), ambient (forest, urban street, ocean waves), BGM (simplified — «soft piano music», «driving bass beat»), dialogue in quotes with lip-sync. The more specific the sound, the better — «soft synth pad» beats «nice music».\n\nAudio sits in a separate block in the prompt, usually after the visual part. It's not «extra text» as it might look — it's a working V6 feature; skip it and you get silence.",
      },
      {
        heading: "Style presets and lens controls",
        body:
          "Styles are set via parameter, not in the prompt text: `anime`, `3d_animation`, `clay`, `comic`, `cyberpunk`. Writing «in anime style» in the text works noticeably worse than picking the preset through the parameter. Each preset supports lip-sync for dialogue scenes.\n\nCinematic lens controls are also parameters: focal length (24mm wide, 50mm normal, 85mm portrait), aperture (f/1.4 shallow DoF, f/8 deep), lens distortion, chromatic aberration, vignetting. These are production settings, like on a real camera. V5.5 didn't have them — you had to write it all in text; V6 lifts that out into dedicated fields.",
      },
      {
        heading: "Multi-shot and negative prompts",
        body:
          "The multi-shot engine produces short films up to 15 seconds with native transitions between shots. Lighting and character consistency carry across the sequence. You can upload up to 3 reference images (multi-image reference) to lock a character's look.\n\nThe key multi-shot rule — repeat character descriptors in every shot, or the model drifts. «The woman in red coat» in shot 1, «she» in shot 2 — bad; «the woman in red coat» in both — good.\n\nNegative prompts in V6 work normally: `\"blurry, distorted hands, extra limbs, watermark\"`. They live in a separate field, not in the main prompt. Unlike Runway Gen-4/4.5 (which don't support negatives), here it's a working tool.",
      },
    ],
    examples: [
      {
        before: "beautiful cinematic video of a car in the city at night",
        after:
          "A black sports car drives through a wet downtown street at night. Neon signs reflect on the asphalt. Camera tracks the car from a low angle, smooth dolly motion. Loud engine roaring sound, tires hissing on wet pavement, distant urban ambient. 50mm focal length, shallow DoF.",
        note: "Literal physical detail (wet street, neon reflections), explicit audio (engine, tires, ambient), separate lens block (50mm, shallow DoF). V5.5 would force lens settings into the text; V6 takes them as parameters.",
      },
      {
        before: "anime clip where a girl cries from sadness, emotional music",
        after:
          "A young woman sits on a windowsill, soft tears running down her cheeks. Rain on the glass behind her, grey overcast light. Camera slowly pushes in from medium shot to close-up. Soft piano music, gentle rain ambient. Style preset: anime (set via parameter, not in prompt).",
        note: "The anime style moves into the parameter, not the text. Emotion is carried by physical detail (tears, posture, rain), not the abstract «sad». Audio is its own block.",
      },
      {
        before: "product video of sneakers on the street",
        after:
          "Shot 1: Close-up of running shoes on wet asphalt, water splashing as the foot lifts off. Shot 2: Medium tracking shot, the runner sprints down an empty street at sunrise. Shot 3: Wide shot, the runner crosses the frame, golden light flaring through buildings. Footsteps slapping pavement, rhythmic breath, upbeat electronic music. Negative prompt: blurry, watermark.",
        note: "Multi-shot structure (3 shots, explicit transitions), «runner» repeated in each for consistency, audio in a separate block, negative prompt moved out. This is the V6 sweet spot.",
      },
    ],
    mistakes: [
      {
        title: "Metaphors instead of literal description",
        explain:
          "PixVerse reads literally. «Tears of the sky» will be interpreted literally — you might get a crying sky or a weird artifact. «Heavy rain falling on pavement» yields exactly what you want. Describe physically: what moves, how exactly, in what environment.",
      },
      {
        title: "Styles in the prompt text instead of the parameter",
        explain:
          "«In anime style» or «as a clay animation» in the text works noticeably worse than picking the matching style preset through the parameter (`anime`, `clay`, `3d_animation`, `comic`, `cyberpunk`). Styles live in a separate field for a reason — use it and keep the text for scene content.",
      },
      {
        title: "No audio description on V6",
        explain:
          "V6 can generate audio natively, but only if you describe it in the prompt. Without an audio block the clip is silent. Minimum — mention ambient («urban street ambient»). Maximum — concrete SFX, BGM, and quoted dialogue. It's a real model feature, not filler.",
      },
      {
        title: "1080p × 10 seconds on V5.5",
        explain:
          "On V5.5, 1080p maxes out at 5–8 seconds; 10 seconds is only available at 720p. V6 removes that limit — up to 15 seconds at 1080p in one pass. If a V5.5 request for «1080p, 10s» fails, switch to V6 or accept 720p.",
      },
      {
        title: "Forgetting character descriptors in multi-shot",
        explain:
          "In multi-shot mode the model loses the character between shots unless you repeat the key descriptors in each one. «The woman in red coat» in shot 1, «she» in shot 2 — drift is almost guaranteed. Repeat the short descriptor («the woman in red coat») in every shot to hold identity.",
      },
    ],
    faq: [
      {
        q: "How does PixVerse V6 differ from V5.5?",
        a: "Four main differences: native audio generation (BGM, SFX, dialogue) in one pass, up to 15 seconds at 1080p versus 5–8 on V5.5, 20+ cinematic lens controls as parameters, and a multi-shot engine with native transitions. V5.5 remains useful for short clips with effects (46 effect templates), but for serious content V6 is a clear upgrade.",
      },
      {
        q: "Do I need to describe audio in the prompt if I want a silent clip?",
        a: "Yes, explicitly. If audio isn't described, V6 either generates silence or adds random ambient — unpredictable. For a quiet clip, write «silent» or specify a thin ambient: «very faint room tone». Controlled silence beats accidental silence — that's the main rule for working with V6 audio.",
      },
      {
        q: "Are negative prompts supported?",
        a: "Yes, it's a documented V6 feature (also V5.5). The negative prompt is a separate field or API parameter. Format: comma-separated list of things to exclude: «blurry, distorted hands, extra limbs, watermark, text». Unlike Runway Gen-4/4.5 where negatives don't work, in PixVerse this is a working tool.",
      },
      {
        q: "How do I keep a character consistent across multi-shot frames?",
        a: "Two tools: repeating character descriptors in every shot and multi-image reference (up to 3 character photos as input). Best practice is to combine both — upload 2–3 reference photos and repeat a short text descriptor («the woman in red coat») in every shot. That gives maximum consistency.",
      },
      {
        q: "What should I do with the thinking_type parameter?",
        a: "Three values: `enabled` (model auto-optimizes the prompt before generation), `disabled` (prompt goes through as written), `auto` (model decides by prompt complexity). For short prompts of 10–20 words, `enabled` noticeably improves quality. For long detailed prompts of 100+ words, `disabled` preserves your control. `auto` is a sensible default.",
      },
      {
        q: "How long should the prompt be?",
        a: "From 2 to 2,048 characters technically. In practice 50–200 words is optimal for most scenes. Short prompts (10–20 words) pair well with `thinking_type=enabled`. Long multi-shot prompts can hit 300+ words with three shot blocks plus an audio description — that's normal for the format.",
      },
      {
        q: "Does Opten support PixVerse V6?",
        a: "Yes, the Opten extension recognizes PixVerse inside pixverse.ai and scores prompts against the V6-specific structure: it checks for an audio description block, literal physical phrasing, style preset used as a parameter (not in text), repeated character descriptors in multi-shot, and a sensible negative prompt.",
      },
    ],
  },
};
