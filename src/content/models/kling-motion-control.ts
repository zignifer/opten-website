// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for kling-motion-control.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Kling Motion Control: структура, ошибки, примеры",
    description:
      "Как писать промпты для Kling Motion Control: арт-дирекция вместо режиссуры движения, Motion Brush, 6-осевая камера, типичные ошибки и примеры до и после.",
    h1: "Kling Motion Control: как писать промпты, которые модель понимает",
    intro:
      "Kling Motion Control — режим Kling от Kuaishou для переноса движений с референсного видео на персонажа из изображения. Длительность 5–10 секунд, разрешение до 4K (Kling 3.0), Motion Brush до 6 элементов на кадр. Главное правило: промпт = арт-дирекция (как выглядит), а НЕ режиссура движения (как двигается).",
    sections: [
      {
        heading: "Что такое Kling Motion Control",
        body:
          "Motion Control — это НЕ Text-to-Video. Здесь промпт выполняет принципиально другую функцию: движения, жесты, мимика и тайминг берутся из референсного видео или рисуются кистью, а промпт описывает только внешность персонажа и окружение.\n\nДва основных режима. Reference Video Motion Transfer — пользователь загружает референсное видео (3–30 секунд, чёткий субъект, минимальная тряска) и изображение персонажа. Система извлекает скелетную анимацию, тайминг и контактную динамику и применяет к персонажу. Motion Brush — пользователь рисует траектории движения прямо на изображении, до 6 отдельных элементов с индивидуальными траекториями; промпт описывает общую сцену, а не движение.",
        bullets: [
          "Перенос движений с видео-референса на персонажа из изображения",
          "Motion Brush: до 6 элементов с индивидуальными траекториями",
          "6-осевая камера в Kling 3.0: pan, tilt, roll, dolly, truck, pedestal",
          "Длительность 5–10 секунд, до 4K (Kling 3.0)",
          "Element Binding: фиксация черт лица и идентичности персонажа",
        ],
      },
      {
        heading: "Три столпа промпта",
        body:
          "Промпт для Motion Control строится из трёх блоков. Внешность персонажа: одежда и стиль (формальный, кэжуал, кинематографический), возрастной диапазон, настроение, детали лица (текстура кожи, выразительные глаза, освещение), общий визуальный тон (реалистичный, стилизованный, полированный).\n\nОкружение: тип среды (студия, офис, город, природа), глубина и освещение (мягкий блюр, малая глубина резкости), атмосфера (профессиональная, уютная, драматичная, минималистичная).\n\nВизуальный стиль и качество: стиль камеры (кинематографический, документальный, соцсети), цветокоррекция (нейтральная, тёплая, контрастная), уровень реализма (фотореалистичный, коммерческий, редакторский). Формула: [Внешность персонажа] + [Среда/фон] + [Визуальный стиль]. Оптимальная длина 30–80 слов.",
      },
      {
        heading: "Главное правило: арт-дирекция, не режиссура движения",
        body:
          "Reference Video Transfer переносит движения, жесты, мимику, тайминг АВТОМАТИЧЕСКИ из референсного видео. Описание движений в промпте — главный антипаттерн режима. Фразы «character dances», «waves hand», «walks forward», «smiles then frowns», «at 3 seconds raises hand» либо игнорируются, либо конфликтуют с движениями из видео.\n\nMotion Brush работает аналогично: пользователь РИСУЕТ траектории на изображении, движение задаётся кистью. Промпт описывает общую сцену и атмосферу, а не конкретные движения элементов. Допустимо общее описание динамики («gentle breeze», «flowing water»), но не конкретные инструкции анимации.\n\nЗолотое правило одно: промпт = как выглядит, а НЕ как двигается.",
      },
      {
        heading: "Продвинутые техники Kling 3.0",
        body:
          "Element Binding в Kling 3.0 фиксирует черты лица, текстуру кожи и диапазон выражений персонажа по всем кадрам — даже при сложных поворотах головы и сменах ракурса. Это критично для коммерческих видео, где идентичность персонажа должна быть безупречной.\n\n6-осевое управление камерой позволяет одновременно управлять движением персонажа (из референса) и движением камеры: pan, tilt, roll, dolly, truck, pedestal. В промпте можно указать направление кадра — это допустимо, в отличие от описания движений тела.\n\nФизически-корректный рендеринг симулирует перенос веса, контакт с поверхностями, реакцию ткани и артикуляцию суставов. Руки правильно захватывают предметы, ноги отталкиваются от поверхности с видимым импульсом, одежда реагирует на ускорение тела. Эти эффекты включаются автоматически — описывать их в промпте не нужно.",
      },
    ],
    examples: [
      {
        before: "корпоративный спикер",
        after:
          "Style the character as a polished corporate presenter in a tailored navy suit with a crisp white shirt and minimal silver watch, realistic skin texture with subtle facial details, professional grooming, neat short haircut. Placed in a modern office environment with floor-to-ceiling glass walls overlooking a city skyline, soft natural daylight from above, clean minimalist interior. Cinematic realism with shallow depth of field, professional commercial quality, neutral warm color grading.",
        note:
          "Все три столпа: внешность персонажа с конкретными деталями, окружение с глубиной и освещением, визуальное качество. Никаких инструкций по движениям — они из референсного видео.",
      },
      {
        before: "девушка в стиле UGC",
        after:
          "Turn the character into a casual lifestyle creator wearing soft cream knit sweater and neutral makeup with natural facial details, mid-20s age range, friendly expression. Set against a warm home interior with bookshelf and indoor plants in soft bokeh background, golden afternoon window light, cozy atmosphere. Clean commercial lighting with slightly elevated saturation, social-media UGC aesthetic, smartphone camera feel.",
        note:
          "Полная смена контекста персонажа без затрагивания перформанса. Стиль (cream knit, neutral makeup), окружение (home interior, bookshelf, window light), качество (UGC aesthetic) — арт-дирекция в чистом виде.",
      },
      {
        before: "Motion Brush: «золотое пшеничное поле на закате»",
        after:
          "A golden wheat field under warm sunset light, gentle atmosphere with soft golden hour glow, photorealistic rendering with shallow depth of field, layered composition with distant tree line and pastel orange sky in the background, cinematic color grading with rich amber and ochre tones.",
        note:
          "Для Motion Brush промпт описывает сцену и атмосферу, не движение. Колыхание колосьев задаётся пользователем кистью прямо на изображении. Допустимы общие фразы вроде «gentle atmosphere», но не «wheat sways from left to right».",
      },
    ],
    mistakes: [
      {
        title: "Описание движений в промпте",
        explain:
          "Главный антипаттерн режима. «The character dances», «waves hand», «walks forward», «turns head left» — движения в Reference Video Transfer берутся из референсного видео автоматически. В Motion Brush — рисуются кистью. Промпт описывает внешность и среду, а НЕ движение тела.",
      },
      {
        title: "Описание мимики и эмоций как действий",
        explain:
          "«Character smiles, then frowns», «expression changes from happy to sad» — мимика и эмоциональные переходы тоже берутся из референсного видео. В промпте можно указать общий эмоциональный тон («friendly expression», «serious demeanor») как часть описания персонажа, но не последовательность смены выражений.",
      },
      {
        title: "Описание тайминга перформанса",
        explain:
          "«At 3 seconds character raises hand», «after 5 seconds turns to camera» — тайминг полностью из референсного видео. Любые временные маркеры в промпте для Motion Control конфликтуют с реальным перформансом и могут привести к артефактам. Тайминг = референс, а не промпт.",
      },
      {
        title: "Промпт в стиле обычного T2V",
        explain:
          "Если писать промпт с действиями, камерными движениями и стилем (как для Text-to-Video), это неправильный режим. T2V-промпт здесь даст худший результат, чем коротко описанная арт-дирекция. Оптимальная длина для Motion Control — 30–80 слов; более длинный промпт обычно содержит лишние инструкции по движению.",
      },
      {
        title: "Слишком короткий или абстрактный промпт",
        explain:
          "Промпт меньше 10 слов оставляет модели слишком мало визуальной информации о персонаже и среде. Абстрактные формулировки «make it look cool», «something dynamic», «professional vibe» не дают опоры. Конкретные детали внешности (одежда, материалы) и среды (тип локации, освещение) обязательны.",
      },
    ],
    faq: [
      {
        q: "Чем Motion Control отличается от обычного T2V в Kling?",
        a: "В T2V промпт описывает ВСЁ — субъект, действия, движения, камеру, среду, стиль. В Motion Control движения, жесты, мимика, тайминг берутся из референсного видео или задаются кистью; промпт описывает ТОЛЬКО внешность персонажа и окружение. Это принципиально другая стратегия промптинга — арт-дирекция, а не режиссура движения.",
      },
      {
        q: "Какие требования к референсному видео?",
        a: "Длительность 3–30 секунд, чёткий субъект (одна центральная фигура), минимальная тряска камеры, хорошее освещение. Сложные ракурсы и быстрая смена положения тела работают, но требуют качественного изображения персонажа. Многофигурные сцены в референсе плохо переносятся — лучше брать видео с одним персонажем. Скелетная анимация извлекается автоматически.",
      },
      {
        q: "Как работает Motion Brush?",
        a: "Пользователь загружает статичное изображение и рисует траектории движения прямо на нём. Motion Brush задаёт направление, скорость и дугу для выбранной области; Static Brush фиксирует области, которые НЕ должны двигаться. До 6 отдельных элементов с индивидуальными траекториями. Промпт в этом режиме описывает сцену и атмосферу, не конкретные движения — те заданы кистью.",
      },
      {
        q: "Что такое Element Binding?",
        a: "Element Binding в Kling 3.0 — система фиксации черт лица, текстуры кожи и диапазона выражений персонажа по всем кадрам. Гарантирует, что лицо не «дрейфует» при поворотах головы и сменах ракурса. Критично для коммерческих видео с виртуальными презентерами и AI-инфлюенсерами, где идентичность персонажа должна оставаться безупречной в каждом кадре.",
      },
      {
        q: "Можно ли указать движение камеры в Motion Control?",
        a: "Да, в Kling 3.0 доступно 6-осевое управление камерой: pan, tilt, roll, dolly, truck, pedestal. Камерное направление в промпте — допустимо: «medium shot with slow dolly in», «close-up holding steady», «wide tracking shot from the side». Это отличается от описания движений тела персонажа — те запрещены, движение камеры разрешено.",
      },
      {
        q: "Какая оптимальная длина промпта?",
        a: "30–80 слов. Короче — недостаточно визуальной информации о персонаже и среде. Длиннее — обычно начинаются лишние инструкции по движениям, тайминг или эмоциональные переходы, которые конфликтуют с референсным видео. Сладкая точка — около 50 слов: три блока (внешность, среда, стиль) по 15–20 слов каждый.",
      },
      {
        q: "Поддерживается ли Opten для Kling Motion Control?",
        a: "Да, расширение Opten автоматически распознаёт Kling Motion Control внутри klingai.com и применяет специальную стратегию оценки: проверяет отсутствие инструкций по движениям, мимике и таймингу, наличие трёх столпов (внешность, среда, стиль), оптимальную длину 30–80 слов. Если в промпте найдены движения тела — Opten предупредит и предложит rewrite в режиме арт-дирекции.",
      },
    ],
  },
  en: {
    title: "Kling Motion Control Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Kling Motion Control: art direction not motion direction, Motion Brush, 6-axis camera, common mistakes, and before/after examples.",
    h1: "Kling Motion Control: how to write prompts the model actually understands",
    intro:
      "Kling Motion Control is a Kuaishou Kling mode for transferring motion from a reference video onto a character from an image. Duration 5–10 seconds, resolution up to 4K (Kling 3.0), Motion Brush up to 6 elements per frame. The golden rule: the prompt is art direction (how it looks), NOT motion direction (how it moves).",
    sections: [
      {
        heading: "What Kling Motion Control is",
        body:
          "Motion Control is NOT Text-to-Video. Here the prompt plays a fundamentally different role: motion, gestures, expression, and timing come from a reference video or are painted with a brush; the prompt describes only the character's appearance and the setting.\n\nTwo primary modes. Reference Video Motion Transfer — the user uploads a reference video (3–30 seconds, clear subject, minimal camera shake) and an image of the character. The system extracts skeletal animation, timing, and contact dynamics and applies them to the character. Motion Brush — the user paints motion trajectories directly on the image, up to 6 separate elements with individual trajectories; the prompt describes the overall scene, not the motion.",
        bullets: [
          "Motion transfer from a video reference onto a character from an image",
          "Motion Brush: up to 6 elements with individual trajectories",
          "6-axis camera in Kling 3.0: pan, tilt, roll, dolly, truck, pedestal",
          "Duration 5–10 seconds, up to 4K (Kling 3.0)",
          "Element Binding: locks facial features and character identity",
        ],
      },
      {
        heading: "The three pillars of the prompt",
        body:
          "A Motion Control prompt is built from three blocks. Character appearance: clothing and style (formal, casual, cinematic), age range, mood, facial details (skin texture, expressive eyes, lighting), overall visual tone (realistic, stylized, polished).\n\nSetting: type of environment (studio, office, city, nature), depth and lighting (soft blur, shallow depth of field), atmosphere (professional, cozy, dramatic, minimalist).\n\nVisual style and quality: camera style (cinematic, documentary, social media), color grading (neutral, warm, contrasty), level of realism (photorealistic, commercial, editorial). Formula: [Character appearance] + [Setting/background] + [Visual style]. Sweet-spot length 30–80 words.",
      },
      {
        heading: "The golden rule: art direction, not motion direction",
        body:
          "Reference Video Transfer takes motion, gestures, expression, and timing AUTOMATICALLY from the reference video. Describing motion in the prompt is the mode's main anti-pattern. Phrases like «character dances», «waves hand», «walks forward», «smiles then frowns», «at 3 seconds raises hand» are either ignored or conflict with motion from the video.\n\nMotion Brush works similarly: the user PAINTS trajectories on the image; motion is set by the brush. The prompt describes the overall scene and atmosphere, not specific element motions. General dynamic phrasing («gentle breeze», «flowing water») is acceptable, but specific animation instructions aren't.\n\nThe golden rule is one: the prompt is how it looks, NOT how it moves.",
      },
      {
        heading: "Advanced Kling 3.0 techniques",
        body:
          "Element Binding in Kling 3.0 locks the character's facial features, skin texture, and expression range across all frames — even during complex head turns and angle changes. Critical for commercial videos where character identity must stay flawless.\n\n6-axis camera control lets you steer character motion (from the reference) and camera motion at the same time: pan, tilt, roll, dolly, truck, pedestal. Camera direction may be specified in the prompt — this is allowed, unlike body-motion descriptions.\n\nPhysically-correct rendering simulates weight transfer, surface contact, fabric response, and joint articulation. Hands grip objects properly, feet push off surfaces with visible momentum, clothing reacts to body acceleration. These effects are automatic — no need to describe them in the prompt.",
      },
    ],
    examples: [
      {
        before: "corporate presenter",
        after:
          "Style the character as a polished corporate presenter in a tailored navy suit with a crisp white shirt and minimal silver watch, realistic skin texture with subtle facial details, professional grooming, neat short haircut. Placed in a modern office environment with floor-to-ceiling glass walls overlooking a city skyline, soft natural daylight from above, clean minimalist interior. Cinematic realism with shallow depth of field, professional commercial quality, neutral warm color grading.",
        note:
          "All three pillars: character appearance with concrete details, setting with depth and lighting, visual quality. No motion instructions — those come from the reference video.",
      },
      {
        before: "girl in UGC style",
        after:
          "Turn the character into a casual lifestyle creator wearing a soft cream knit sweater and neutral makeup with natural facial details, mid-20s age range, friendly expression. Set against a warm home interior with bookshelf and indoor plants in soft bokeh background, golden afternoon window light, cozy atmosphere. Clean commercial lighting with slightly elevated saturation, social-media UGC aesthetic, smartphone camera feel.",
        note:
          "Full character context shift without touching the performance. Style (cream knit, neutral makeup), setting (home interior, bookshelf, window light), quality (UGC aesthetic) — pure art direction.",
      },
      {
        before: "Motion Brush: «golden wheat field at sunset»",
        after:
          "A golden wheat field under warm sunset light, gentle atmosphere with soft golden hour glow, photorealistic rendering with shallow depth of field, layered composition with distant tree line and pastel orange sky in the background, cinematic color grading with rich amber and ochre tones.",
        note:
          "For Motion Brush the prompt describes the scene and atmosphere, not motion. The swaying wheat is painted by the user with the brush directly on the image. General phrases like «gentle atmosphere» are fine; «wheat sways from left to right» is not.",
      },
    ],
    mistakes: [
      {
        title: "Describing motion in the prompt",
        explain:
          "The mode's main anti-pattern. «The character dances», «waves hand», «walks forward», «turns head left» — motion in Reference Video Transfer comes from the reference video automatically. In Motion Brush it's painted with a brush. The prompt describes appearance and setting, NOT body motion.",
      },
      {
        title: "Describing expression and emotion as actions",
        explain:
          "«Character smiles, then frowns», «expression changes from happy to sad» — expression and emotional transitions also come from the reference video. The prompt can state an overall emotional tone («friendly expression», «serious demeanor») as part of the character description, but not a sequence of expression changes.",
      },
      {
        title: "Describing performance timing",
        explain:
          "«At 3 seconds character raises hand», «after 5 seconds turns to camera» — timing comes entirely from the reference video. Any temporal markers in a Motion Control prompt conflict with the actual performance and can cause artifacts. Timing = reference, not prompt.",
      },
      {
        title: "A prompt written like regular T2V",
        explain:
          "Writing a prompt with actions, camera moves, and style (like for Text-to-Video) is the wrong mode. A T2V prompt here yields worse results than concise art direction. Sweet-spot length for Motion Control is 30–80 words; longer prompts usually contain extra motion instructions.",
      },
      {
        title: "Prompts that are too short or too abstract",
        explain:
          "A prompt under 10 words leaves too little visual information about the character and setting. Abstract phrasing — «make it look cool», «something dynamic», «professional vibe» — gives no anchor. Concrete appearance details (clothing, materials) and setting details (location type, lighting) are required.",
      },
    ],
    faq: [
      {
        q: "How is Motion Control different from regular T2V in Kling?",
        a: "In T2V the prompt describes EVERYTHING — subject, actions, motion, camera, environment, style. In Motion Control, motion, gestures, expression, and timing come from a reference video or are set by a brush; the prompt describes ONLY the character's appearance and setting. A fundamentally different prompting strategy — art direction, not motion direction.",
      },
      {
        q: "What are the requirements for the reference video?",
        a: "Duration 3–30 seconds, clear subject (one central figure), minimal camera shake, good lighting. Complex angles and rapid body-position changes work but need a high-quality character image. Multi-figure reference scenes transfer poorly — pick a video with one subject. Skeletal animation is extracted automatically.",
      },
      {
        q: "How does Motion Brush work?",
        a: "The user uploads a still image and paints motion trajectories directly on it. Motion Brush sets direction, speed, and arc for the selected area; Static Brush locks areas that should NOT move. Up to 6 separate elements with individual trajectories. The prompt in this mode describes the scene and atmosphere, not specific motions — those are set by the brush.",
      },
      {
        q: "What is Element Binding?",
        a: "Element Binding in Kling 3.0 is a system that locks the character's facial features, skin texture, and expression range across all frames. It ensures the face doesn't «drift» during head turns or angle changes. Critical for commercial videos with virtual presenters and AI influencers, where character identity must stay flawless in every frame.",
      },
      {
        q: "Can I specify camera motion in Motion Control?",
        a: "Yes, Kling 3.0 supports 6-axis camera control: pan, tilt, roll, dolly, truck, pedestal. Camera direction in the prompt is allowed: «medium shot with slow dolly in», «close-up holding steady», «wide tracking shot from the side». This is different from describing the character's body motion — those are forbidden; camera motion is allowed.",
      },
      {
        q: "What's the optimal prompt length?",
        a: "30–80 words. Shorter — not enough visual information about the character and setting. Longer — usually starts to include extra motion instructions, timing, or emotional transitions that conflict with the reference video. The sweet spot is around 50 words: three blocks (appearance, setting, style) of 15–20 words each.",
      },
      {
        q: "Does Opten support Kling Motion Control?",
        a: "Yes, the Opten extension auto-detects Kling Motion Control inside klingai.com and applies a special scoring strategy: it checks for the absence of motion, expression, and timing instructions, the presence of the three pillars (appearance, setting, style), and the optimal 30–80 word length. If body-motion is found in the prompt, Opten flags it and offers a rewrite in art-direction mode.",
      },
    ],
  },
};
