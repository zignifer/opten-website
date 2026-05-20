// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for ltx-2.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для LTX 2: структура, ошибки, примеры",
    description:
      "Как писать промпты для LTX 2 от Lightricks: шестиэлементная структура, нативное 4K с 50 FPS и аудио, негативный промпт, типичные ошибки и примеры до/после.",
    h1: "LTX 2: как писать промпты, которые модель понимает",
    intro:
      "LTX 2 — open-source видеомодель от Lightricks на ltx.io. Существует в двух версиях: Fast (до 20 секунд, 2× быстрее) и Pro (до 10 секунд, плюс Audio-to-Video и Retake). Нативное 4K до 50 FPS, генерация аудио, Apache-лицензия. Промпт пишется как кинематографический shot list, оптимальная длина около 200 слов на английском.",
    sections: [
      {
        heading: "Что умеет LTX 2",
        body:
          "LTX 2 — open-source видеомодель с архитектурой Diffusion Transformer (DiT). Главные технические преимущества: нативное 4K (2160p) до 50 FPS — максимальное разрешение среди опрошенных моделей; нативная генерация аудио (диалоги, музыка, эмбиент, SFX) синхронно с видео; полные веса доступны на HuggingFace под Apache-лицензией; поддержка LoRA fine-tuning для кастомных стилей и движений.\n\nДве версии решают разные задачи. LTX 2 Fast — до 20 секунд, 2× быстрее и 1/10 стоимости compute. LTX 2 Pro — до 10 секунд, плюс эксклюзивные режимы: Audio-to-Video (генерация видео по аудио-треку), Retake (перегенерация участка без перезапуска), Extend. Negative prompt поддерживается в обеих версиях.",
        bullets: [
          "Нативное 4K (2160p) до 50 FPS — рекорд среди моделей",
          "LTX 2 Fast: до 20 секунд, 2× быстрее, 1/10 compute",
          "LTX 2 Pro: до 10 секунд, A2V, Retake, Extend",
          "Нативное аудио синхронно с видео",
          "Open source, Apache-лицензия, LoRA fine-tuning",
        ],
      },
      {
        heading: "6-элементная структура промпта",
        body:
          "Официальная структура от Lightricks — пиши как shot list оператора, подробные хронологические описания в формате параграфа. Шесть элементов:\n\n1. Shot type / camera position — кинематографические термины (wide shot, medium close-up, low-angle establishing).\n2. Environment — освещение, цветовая палитра, текстуры, атмосфера.\n3. Action — естественная последовательность в present-tense, от начала к концу.\n4. Character details — возраст, причёска, одежда, отличительные черты.\n5. Camera movement — как и когда; описание post-movement помогает.\n6. Audio description — эмбиент, музыка, речь, пение.\n\nНе все элементы обязательны для простых сцен, но 6-элементная структура — идеал для production-задач.",
      },
      {
        heading: "Ключевой принцип: длина промпта = длина видео",
        body:
          "Уникальная особенность LTX 2 — корреляция длины промпта с длительностью видео. Короткий промпт для длинного видео вызывает «rushing»: модель торопится уместить всё в начало и потом не знает, что делать дальше. Для 10-секундного видео нужно ~200 слов хронологического описания.\n\nLens/aperture language снижает артефакты: «50mm, f/2.8» уменьшает мерцание краёв. Explicit camera paths (dolly, crane, orbit) снижают temporal jitter — указывай конкретную траекторию камеры, а не общее «cinematic camera». При генерации 4K стоит добавлять в negative prompt «no high-frequency patterns» — иначе могут появиться moiré-артефакты на текстурах.\n\nДля автоматического улучшения промпта используется флаг `enhance_prompt=True` — модель сама расширит описание до оптимальной длины.",
      },
      {
        heading: "Аудио, A2V и Retake (Pro)",
        body:
          "LTX 2 генерирует аудио нативно, синхронно с видео. Описывай звуковой ландшафт явно: «ambient sound of distant city traffic and rustling leaves», «soft piano in the background gradually swelling into orchestral strings», «character speaks in calm low voice: \"Don't worry\"». Без описания аудио модель генерирует звук «по умолчанию», что часто менее выразительно.\n\nЭксклюзивные режимы LTX 2 Pro. Audio-to-Video — генерация видео по аудио-треку: модель синхронизирует визуал с ритмом, тоном и динамикой звука; полезно для музыкальных клипов и визуализаций. Retake — перегенерация конкретного участка видео без перезапуска всей генерации, экономит compute и сохраняет согласованность остального. Extend — продление существующего клипа с сохранением стиля и движения.",
      },
    ],
    examples: [
      {
        before: "девушка идёт по пляжу на закате",
        after:
          "Wide establishing shot at golden hour. A long stretch of empty Pacific coast with warm amber sunlight bathing the wet sand, soft pastel pink and orange sky reflecting on shallow waves, low rolling fog at the horizon. A young woman in her late twenties with long auburn hair tied loosely, wearing a cream linen sundress and bare feet, walks slowly from the right side of the frame toward the receding waves. She pauses, lifts her face to the sun, then continues walking parallel to the shoreline. Camera follows her with a smooth tracking dolly from a medium distance, gradually pulling back to reveal the vastness of the coast by the end of the clip. Shot on 50mm lens at f/2.8, shallow depth of field with soft bokeh on the background. Gentle ambient sound of waves rolling in and seagulls in the distance, soft acoustic guitar melody fades in around the 4-second mark.",
        note:
          "Полная 6-элементная структура: shot type, environment, character, action, camera movement, audio. Длина ~150 слов под 10-секундное видео, lens language (50mm, f/2.8), хронологическая прогрессия от начала к концу.",
      },
      {
        before: "уличная сцена в тумане",
        after:
          "Medium low-angle tracking shot at pre-dawn blue hour. A narrow cobblestone alley in a European old town, dense morning fog drifts at ankle level, wet cobblestones reflecting muted blue light from antique street lamps, brick walls covered in ivy, deep shadows between buildings. A man in his forties wearing a long charcoal wool coat and grey fedora walks deliberately away from the camera into the fog, hands in pockets. Camera dollies forward at the same pace as the subject, maintaining constant distance for the first 5 seconds, then gradually slows as he disappears into the fog. 35mm lens at f/2.0, anamorphic flares from street lamps, film grain texture. Ambient sound of distant church bells and faint footsteps on wet stone, a low cello drone gradually builds tension throughout the clip.",
        note:
          "Lens/aperture language (35mm, f/2.0), explicit camera path (dolly forward, gradually slows), хронологический ритм с timestamp («for the first 5 seconds», «throughout the clip»), полный аудио-дизайн.",
      },
      {
        before: "продуктовый шот часов",
        after:
          "Macro close-up product shot in studio. A premium stainless-steel automatic watch with sapphire crystal face, exposed mechanical movement visible through the case, dark navy leather strap with white stitching, placed on a black slate surface with soft directional rim lighting from the right. Camera orbits slowly around the watch at the same elevation, completing a quarter turn over the duration of the clip, revealing different angles of the case and dial. Shot on 100mm macro lens at f/4, razor-sharp focus on the mechanical movement, soft falloff into the background. Subtle ambient sound of the mechanical tick-tock of the watch movement clearly audible, distant soft piano in the background. No high-frequency patterns.",
        note:
          "Продуктовая сцена в 4K с guardrail в negative («no high-frequency patterns» против moiré), explicit camera path (orbit, quarter turn), lens language (100mm macro, f/4), описание аудио для подчёркивания механики.",
      },
    ],
    mistakes: [
      {
        title: "Короткий промпт для длинного видео",
        explain:
          "Уникальный антипаттерн LTX 2: длина промпта должна соответствовать длительности видео. Промпт в 10 слов для 10-секундного клипа вызывает «rushing» — модель торопится уместить всё в начало. Для 10 секунд нужно ~200 слов хронологического описания с прогрессией от начала к концу.",
      },
      {
        title: "Конфликтующие описания",
        explain:
          "«Still peaceful lake with dramatic waves crashing», «bright sunny day with dark moody shadows» — внутренние противоречия. LTX 2 пытается совместить несовместимое и выдаёт неконтролируемый результат. Держи описание стилистически согласованным или явно указывай прогрессию во времени.",
      },
      {
        title: "Отсутствие описания аудио",
        explain:
          "LTX 2 генерирует аудио нативно, и описание звукового ландшафта значительно улучшает результат. Без явного описания модель выбирает «средний» аудио-вариант, часто менее выразительный. Добавляй блок «Ambient sound of…», «Soft piano in the background…», «Character speaks in…» — это полноценный шестой элемент 6-элементной структуры.",
      },
      {
        title: "High-frequency patterns в 4K без negative guardrail",
        explain:
          "При генерации 4K высокочастотные паттерны (тонкие полосы, мелкие сетки, плотные текстуры) могут вызвать moiré-артефакты. Добавляй в negative prompt «no high-frequency patterns, no moiré, no aliasing» — это страховка специфичная для разрешений 2K и выше.",
      },
      {
        title: "Описание изображения в I2V вместо движения",
        explain:
          "Как и в Kling, в Image-to-Video модель уже видит исходное изображение. Описание внешности, одежды, окружения внутри I2V-промпта конфликтует с реальной картинкой. Длина 20–40 слов, описывать ТОЛЬКО движение и эволюцию сцены — что двигается, как и в каком темпе.",
      },
    ],
    faq: [
      {
        q: "Чем LTX 2 Fast отличается от LTX 2 Pro?",
        a: "Fast — до 20 секунд длительности, 2× быстрее, 1/10 стоимости compute, оптимален для прототипирования и длинных тестов. Pro — до 10 секунд, но с эксклюзивными режимами: Audio-to-Video (генерация видео по аудио-треку), Retake (перегенерация участка без перезапуска), Extend (продление клипа). Обе версии поддерживают 4K до 50 FPS, нативное аудио и negative prompt. Архитектура одинаковая — Diffusion Transformer (DiT).",
      },
      {
        q: "Почему промпт должен быть длинным?",
        a: "У LTX 2 есть уникальная корреляция: длина промпта = длительность видео. Короткий промпт для 10-секундного клипа вызывает «rushing» — модель торопится уместить всё в первые секунды. Для 10 секунд нужно ~200 слов хронологического описания с прогрессией. Это принципиальное отличие от Kling и других видеомоделей, где оптимально 50–150 слов.",
      },
      {
        q: "Как использовать lens и aperture language?",
        a: "Lens и aperture language («50mm, f/2.8», «35mm at f/2.0», «100mm macro at f/4») снижает специфичные артефакты LTX 2: мерцание краёв и temporal jitter. Указывай конкретный объектив, диафрагму, фокусное расстояние — это даёт модели понятный визуальный якорь и улучшает стабильность кадров. Дополнительно — explicit camera paths («dolly forward», «orbit», «crane up») снижают дрожание камеры.",
      },
      {
        q: "Как работает Audio-to-Video в Pro?",
        a: "A2V — эксклюзивный режим Pro: пользователь загружает аудио-трек (музыка, речь, эффекты), модель синхронизирует визуал с ритмом, тоном и динамикой звука. Полезно для музыкальных клипов, ASMR-визуализаций, продакт-демо с озвучкой. Промпт описывает визуальное содержимое, а тайминг и ритм берутся из аудио. Уникальная возможность среди видеомоделей — большинство других умеют только генерировать аудио, но не использовать его как input.",
      },
      {
        q: "Зачем добавлять «no high-frequency patterns» в negative?",
        a: "При генерации 4K (2160p) тонкие полосы, плотные сетки и мелкие повторяющиеся текстуры могут вызвать moiré-артефакты — характерные «волнистые» искажения. Negative prompt «no high-frequency patterns, no moiré, no aliasing» — страховка специфичная для высоких разрешений. На 1080p этот guardrail не обязателен, но не повредит.",
      },
      {
        q: "Можно ли локально запустить LTX 2?",
        a: "Да, LTX 2 — open source с полными весами на HuggingFace и поддержкой ComfyUI. Apache-style лицензия (free для проектов с выручкой до $10M). Для запуска на consumer-hardware подходит Fast-версия благодаря 1/10 compute cost. Поддерживается LoRA fine-tuning для кастомных стилей и движений — обычно занимает менее 1 часа. Альтернатива — облачный запуск через ltx.io или LTX Studio.",
      },
      {
        q: "Поддерживается ли Opten для LTX 2?",
        a: "Да, расширение Opten автоматически распознаёт LTX 2 (Fast и Pro) внутри ltx.io и LTX Studio. Оценка учитывает специфику модели: проверяет наличие всех шести элементов структуры, корреляцию длины промпта с длительностью видео, lens/aperture language, explicit camera paths, описание аудио, negative guardrails для 4K. Одним кликом можно получить rewrite в оптимальной 6-элементной структуре.",
      },
    ],
  },
  en: {
    title: "LTX 2 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Lightricks' LTX 2: the 6-element structure, native 4K and audio, negative prompt, common mistakes, and before/after examples.",
    h1: "LTX 2: how to write prompts the model actually understands",
    intro:
      "LTX 2 is Lightricks' open-source video model at ltx.io. It comes in two versions: Fast (up to 20 seconds, 2x faster) and Pro (up to 10 seconds, plus Audio-to-Video and Retake). Native 4K up to 50 FPS, audio generation, Apache license. The prompt is written as a cinematographer's shot list — optimal length around 200 words in English.",
    sections: [
      {
        heading: "What LTX 2 does well",
        body:
          "LTX 2 is an open-source video model built on a Diffusion Transformer (DiT) architecture. Key technical advantages: native 4K (2160p) up to 50 FPS — the highest resolution among surveyed models; native audio generation (dialogue, music, ambient, SFX) in sync with video; full weights on HuggingFace under an Apache license; LoRA fine-tuning support for custom styles and motion.\n\nTwo versions solve different problems. LTX 2 Fast — up to 20 seconds, 2x faster, 1/10 the compute cost, optimal for prototyping and long tests. LTX 2 Pro — up to 10 seconds with exclusive modes: Audio-to-Video (video generation from an audio track), Retake (regenerate a segment without restarting), Extend. Negative prompts are supported in both versions.",
        bullets: [
          "Native 4K (2160p) up to 50 FPS — a record among models",
          "LTX 2 Fast: up to 20 seconds, 2x faster, 1/10 compute",
          "LTX 2 Pro: up to 10 seconds, A2V, Retake, Extend",
          "Native audio in sync with video",
          "Open source, Apache license, LoRA fine-tuning",
        ],
      },
      {
        heading: "The 6-element prompt structure",
        body:
          "The official Lightricks structure — write like a cinematographer's shot list, detailed chronological descriptions in paragraph form. Six elements:\n\n1. Shot type / camera position — cinematic terms (wide shot, medium close-up, low-angle establishing).\n2. Environment — lighting, color palette, textures, atmosphere.\n3. Action — natural sequence in present-tense, start to finish.\n4. Character details — age, hair, clothing, distinctive features.\n5. Camera movement — how and when; describing post-movement helps.\n6. Audio description — ambient, music, dialogue, vocals.\n\nNot all six are mandatory for simple scenes, but the 6-element structure is the ideal for production work.",
      },
      {
        heading: "The key principle: prompt length = video length",
        body:
          "A unique LTX 2 feature is the correlation between prompt length and video duration. A short prompt for a long video causes «rushing»: the model crams everything into the start and then has nothing left to do. For a 10-second video you need ~200 words of chronological description.\n\nLens/aperture language reduces artifacts: «50mm, f/2.8» cuts edge flicker. Explicit camera paths (dolly, crane, orbit) reduce temporal jitter — specify a concrete camera trajectory, not a generic «cinematic camera». When generating 4K, add «no high-frequency patterns» to the negative prompt — otherwise moiré artifacts can appear on textures.\n\nFor automatic prompt enhancement, the `enhance_prompt=True` flag is available — the model expands the description to optimal length on its own.",
      },
      {
        heading: "Audio, A2V, and Retake (Pro)",
        body:
          "LTX 2 generates audio natively, in sync with video. Describe the audio landscape explicitly: «ambient sound of distant city traffic and rustling leaves», «soft piano in the background gradually swelling into orchestral strings», «character speaks in calm low voice: \"Don't worry\"». Without an audio description the model picks a «default» track, often less expressive.\n\nExclusive LTX 2 Pro modes. Audio-to-Video — video generation from an audio track: the model syncs visuals to rhythm, tone, and dynamics of the audio; useful for music videos and visualizations. Retake — regenerate a specific video segment without restarting the whole generation, saving compute and keeping the rest consistent. Extend — extending an existing clip while preserving style and motion.",
      },
    ],
    examples: [
      {
        before: "girl walks along the beach at sunset",
        after:
          "Wide establishing shot at golden hour. A long stretch of empty Pacific coast with warm amber sunlight bathing the wet sand, soft pastel pink and orange sky reflecting on shallow waves, low rolling fog at the horizon. A young woman in her late twenties with long auburn hair tied loosely, wearing a cream linen sundress and bare feet, walks slowly from the right side of the frame toward the receding waves. She pauses, lifts her face to the sun, then continues walking parallel to the shoreline. Camera follows her with a smooth tracking dolly from a medium distance, gradually pulling back to reveal the vastness of the coast by the end of the clip. Shot on 50mm lens at f/2.8, shallow depth of field with soft bokeh on the background. Gentle ambient sound of waves rolling in and seagulls in the distance, soft acoustic guitar melody fades in around the 4-second mark.",
        note:
          "Full 6-element structure: shot type, environment, character, action, camera movement, audio. Length ~150 words for a 10-second video, lens language (50mm, f/2.8), chronological progression from start to finish.",
      },
      {
        before: "foggy street scene",
        after:
          "Medium low-angle tracking shot at pre-dawn blue hour. A narrow cobblestone alley in a European old town, dense morning fog drifts at ankle level, wet cobblestones reflecting muted blue light from antique street lamps, brick walls covered in ivy, deep shadows between buildings. A man in his forties wearing a long charcoal wool coat and grey fedora walks deliberately away from the camera into the fog, hands in pockets. Camera dollies forward at the same pace as the subject, maintaining constant distance for the first 5 seconds, then gradually slows as he disappears into the fog. 35mm lens at f/2.0, anamorphic flares from street lamps, film grain texture. Ambient sound of distant church bells and faint footsteps on wet stone, a low cello drone gradually builds tension throughout the clip.",
        note:
          "Lens/aperture language (35mm, f/2.0), explicit camera path (dolly forward, gradually slows), chronological rhythm with timestamps («for the first 5 seconds», «throughout the clip»), full audio design.",
      },
      {
        before: "watch product shot",
        after:
          "Macro close-up product shot in studio. A premium stainless-steel automatic watch with sapphire crystal face, exposed mechanical movement visible through the case, dark navy leather strap with white stitching, placed on a black slate surface with soft directional rim lighting from the right. Camera orbits slowly around the watch at the same elevation, completing a quarter turn over the duration of the clip, revealing different angles of the case and dial. Shot on 100mm macro lens at f/4, razor-sharp focus on the mechanical movement, soft falloff into the background. Subtle ambient sound of the mechanical tick-tock of the watch movement clearly audible, distant soft piano in the background. No high-frequency patterns.",
        note:
          "4K product scene with a negative guardrail («no high-frequency patterns» against moiré), explicit camera path (orbit, quarter turn), lens language (100mm macro, f/4), audio description to emphasize mechanics.",
      },
    ],
    mistakes: [
      {
        title: "Short prompt for a long video",
        explain:
          "A unique LTX 2 anti-pattern: prompt length should match video duration. A 10-word prompt for a 10-second clip causes «rushing» — the model crams everything into the start. For 10 seconds you need ~200 words of chronological description with progression from start to finish.",
      },
      {
        title: "Conflicting descriptions",
        explain:
          "«Still peaceful lake with dramatic waves crashing», «bright sunny day with dark moody shadows» — internal contradictions. LTX 2 tries to reconcile the irreconcilable and outputs uncontrolled results. Keep the description stylistically consistent, or state temporal progression explicitly.",
      },
      {
        title: "No audio description",
        explain:
          "LTX 2 generates audio natively, and describing the audio landscape significantly improves the result. Without an explicit description the model picks an «average» audio variant, often less expressive. Add a block — «Ambient sound of…», «Soft piano in the background…», «Character speaks in…» — it's a full sixth element of the 6-element structure.",
      },
      {
        title: "High-frequency patterns in 4K without a negative guardrail",
        explain:
          "When generating 4K, high-frequency patterns (thin stripes, fine grids, dense textures) can cause moiré artifacts. Add «no high-frequency patterns, no moiré, no aliasing» to the negative prompt — insurance specific to 2K and higher resolutions.",
      },
      {
        title: "Describing the image in I2V instead of motion",
        explain:
          "As in Kling, in Image-to-Video the model already sees the source image. Describing appearance, clothing, or setting inside an I2V prompt conflicts with the actual picture. Length 20–40 words, describe ONLY motion and scene evolution — what moves, how, and at what tempo.",
      },
    ],
    faq: [
      {
        q: "How is LTX 2 Fast different from LTX 2 Pro?",
        a: "Fast — up to 20 seconds, 2x faster, 1/10 the compute cost, optimal for prototyping and long tests. Pro — up to 10 seconds, but with exclusive modes: Audio-to-Video (video generation from an audio track), Retake (regenerate a segment without restarting), Extend (clip extension). Both versions support 4K up to 50 FPS, native audio, and negative prompts. The architecture is the same — Diffusion Transformer (DiT).",
      },
      {
        q: "Why should the prompt be long?",
        a: "LTX 2 has a unique correlation: prompt length = video duration. A short prompt for a 10-second clip causes «rushing» — the model crams everything into the first seconds. For 10 seconds you need ~200 words of chronological description with progression. This is a fundamental difference from Kling and other video models, where 50–150 words is optimal.",
      },
      {
        q: "How do I use lens and aperture language?",
        a: "Lens and aperture language («50mm, f/2.8», «35mm at f/2.0», «100mm macro at f/4») reduces LTX 2-specific artifacts: edge flicker and temporal jitter. Specify a concrete lens, aperture, and focal length — it gives the model a clear visual anchor and improves frame stability. Additionally, explicit camera paths («dolly forward», «orbit», «crane up») reduce camera jitter.",
      },
      {
        q: "How does Audio-to-Video work in Pro?",
        a: "A2V is an exclusive Pro mode: the user uploads an audio track (music, speech, effects), and the model syncs visuals to the rhythm, tone, and dynamics of the sound. Useful for music videos, ASMR visualizations, product demos with voice-over. The prompt describes the visual content; timing and rhythm come from the audio. A unique capability among video models — most others can only generate audio, not consume it as input.",
      },
      {
        q: "Why add «no high-frequency patterns» to the negative?",
        a: "When generating 4K (2160p), thin stripes, dense grids, and small repeating textures can cause moiré artifacts — characteristic «wavy» distortions. The negative prompt «no high-frequency patterns, no moiré, no aliasing» is insurance specific to high resolutions. At 1080p this guardrail isn't required, but it doesn't hurt.",
      },
      {
        q: "Can I run LTX 2 locally?",
        a: "Yes, LTX 2 is open source with full weights on HuggingFace and ComfyUI support. Apache-style license (free for projects with revenue under $10M). For consumer hardware, the Fast version fits thanks to 1/10 compute cost. LoRA fine-tuning is supported for custom styles and motion — typically under 1 hour. The alternative is cloud execution via ltx.io or LTX Studio.",
      },
      {
        q: "Does Opten support LTX 2?",
        a: "Yes, the Opten extension auto-detects LTX 2 (Fast and Pro) inside ltx.io and LTX Studio. Scoring accounts for the model's specifics: it checks for all six structural elements, the correlation between prompt length and video duration, lens/aperture language, explicit camera paths, audio description, and negative guardrails for 4K. One click delivers a rewrite in the optimal 6-element structure.",
      },
    ],
  },
};
