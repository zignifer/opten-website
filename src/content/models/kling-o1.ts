// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for kling-o1.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Kling O1: структура, ошибки, примеры",
    description:
      "Как писать промпты для Kling O1 — reasoning-видеомодели Kuaishou: четыре режима (I2V, V2V Transform, Ref2V, Edit), якоря сохранения и примеры до и после.",
    h1: "Kling O1: как писать промпты, которые модель понимает",
    intro:
      "Kling O1 — рассуждающая видеомодель Kuaishou на klingai.com. Длительность до 10 секунд, разрешение до 1080p, четыре специализированных режима: I2V, V2V Transform, Reference-to-Video и V2V Edit. Каждый режим требует своей стратегии промптинга — применение неправильной стратегии даёт нестабильные результаты, даже если промпт детальный.",
    sections: [
      {
        heading: "Что такое Kling O1",
        body:
          "Kling O1 — reasoning-модель: в отличие от предыдущих версий, она лучше понимает намерение промпта, а не только ключевые слова. Перед генерацией выполняет внутренний анализ сцены, что особенно помогает в сложных составных задачах.\n\nЧетыре режима, каждый со своей стратегией промптинга. Image-to-Video для оживления статичных изображений. Video-to-Video Transform для стилевых трансфертов с сохранением исходного движения. Reference-to-Video для генерации с консистентностью элементов из 1–4 референсов. V2V Edit для хирургической точности — модификации конкретных элементов при сохранении всего остального. Качество результата определяется структурой промпта больше, чем количеством слов.",
        bullets: [
          "Reasoning-модель: анализирует намерение, а не только слова",
          "Четыре режима: I2V, V2V Transform, Ref2V, V2V Edit",
          "Длительность до 10 секунд, разрешение до 1080p",
          "До 4 референсов в Reference-to-Video",
          "Хирургическая точность в V2V Edit с явными якорями сохранения",
        ],
      },
      {
        heading: "Общая структура промпта",
        body:
          "Базовая структура для всех режимов: [Subject + Primary Action] → [Environmental Context] → [Camera Movement/Perspective] → [Style/Quality Descriptors]. Главное правило — начинать с субъекта и основного действия. Каждый элемент даёт модели конкретный визуальный якорь.\n\nСлабый промпт: «A car driving through a city at sunset». Сильный: «A sleek silver sports car accelerates through a rain-slicked downtown street as golden sunset light breaks through storm clouds, camera tracking alongside at street level, cinematic lighting with volumetric light rays, photorealistic rendering». Разница — конкретные визуальные якоря: внешность машины, состояние улицы, качество освещения, поведение камеры, желаемая эстетика. Оптимальная длина 50–150 слов.",
      },
      {
        heading: "I2V и V2V Transform: разные стратегии",
        body:
          "I2V описывает ТОЛЬКО движение. Длина 20–40 слов. Разделяй движение субъекта и камеры: «Camera slowly pushes in while the subject turns their head to look over their shoulder». Темпоральные дескрипторы управляют ритмом: «gradually», «suddenly», «smoothly», «rhythmically». Описывать то, что уже на изображении, — антипаттерн.\n\nV2V Transform — стилевые трансферты с сохранением движения. Формула: «Transform into [целевой стиль] + while maintaining original motion and composition + [конкретные изменения]». Обязательный якорь — «maintaining the original camera movement and subject blocking». Без него модель может внести нежелательные изменения в движение. Пример: «Transform into a cyberpunk cityscape with neon signs, holographic advertisements, and rain-slicked streets reflecting colored lights, maintaining the original camera movement and subject blocking, add volumetric fog and lens flares».",
      },
      {
        heading: "Reference-to-Video и V2V Edit",
        body:
          "Ref2V — генерация с консистентностью элементов из 1–4 референсных изображений. Формула: [Персонаж из ref 1] + [Действие/взаимодействие] + [Пространственные отношения] + [Среда из ref N]. Обязательно явно привязать каждый референс к элементу сцены: «Character A (reference 1) stands in the foreground left, turning to hand an object to Character B (reference 2) who enters from the right background». Согласованная терминология — критично: если назвали «the red jacket», не переключайся на «crimson coat».\n\nV2V Edit — хирургическая точность. Формула: «Keeping [что сохранить] identical + change only [что изменить] + [конкретное описание изменения]». Начинать с того, что НЕ меняется: «Keeping all camera movement, subject blocking, and background elements identical, change only the sky to a dramatic sunset with purple and orange clouds». Допустимы негативные инструкции: «Do not alter facial features, do not change body proportions».",
      },
      {
        heading: "Продвинутые техники для reasoning",
        body:
          "Послойное описание движения — разделение переднего, среднего и заднего планов: «Foreground subject walks left to right, midground traffic moves right to left at faster speed, background pedestrians move at varying paces, creating parallax depth». Это даёт O1 понятную глубинную иерархию.\n\nХореография освещения — как свет меняется в течение клипа: «Scene begins in shadow, sunlight gradually breaks through clouds at the 3-second mark, illuminating the subject's face by the 5-second mark, casting long shadows». Reasoning-модель отлично работает с темпоральными прогрессиями.\n\nОписание с учётом физики — гравитация, инерция, сопротивление воздуха: «Fabric drapes and flows with gravity, responding to body movement with slight delay, catching air resistance during faster motions». Это помогает O1 генерировать физически правдоподобные сцены.",
      },
    ],
    examples: [
      {
        before: "I2V: «человек идёт к морю»",
        after:
          "Walks slowly toward the ocean with relaxed steps, hair and clothing moving gently in the warm sea breeze, waves rolling onto shore in the background at a steady rhythm, camera slowly pushes in from behind while gradually tilting up to reveal the horizon",
        note:
          "I2V в правильном режиме: только движение, без описания внешности; разделение движения субъекта и камеры; темпоральный дескриптор «slowly», «gradually»; послойное описание (foreground subject, background waves).",
      },
      {
        before: "V2V Transform: «сделай киберпанк»",
        after:
          "Transform into a cyberpunk cityscape with neon signs, holographic advertisements floating between buildings, and rain-slicked streets reflecting saturated magenta and cyan colored lights, maintaining the original camera movement and subject blocking. Add volumetric fog at street level, lens flares on neon signs, and chromatic aberration on bright lights. High-contrast Blade Runner aesthetic with warm amber and cool blue color grading.",
        note:
          "Явный якорь сохранения «maintaining the original camera movement and subject blocking», конкретные стилистические якоря (Blade Runner), описание эффектов и цветокоррекции.",
      },
      {
        before: "V2V Edit: «замени небо на закат»",
        after:
          "Keeping all camera movement, subject blocking, foreground objects, and ground lighting identical, change only the sky to a dramatic sunset with deep purple, orange, and pink cloud formations. Increase contrast in the sky by 15% to match the dramatic mood. Do not alter facial features, do not change body proportions, do not modify the lighting direction on the subject.",
        note:
          "Структура V2V Edit: сначала что сохранить (camera, blocking, foreground, ground lighting), потом что изменить (sky only), потом негативные инструкции для гарантии. Маскирующий язык изолирует изменение.",
      },
    ],
    mistakes: [
      {
        title: "Применение T2V-стратегии к I2V",
        explain:
          "Описание внешности персонажа, одежды, окружения внутри I2V-промпта — модель уже видит изображение. Описание сцены в I2V конфликтует с реальной картинкой. Длина 20–40 слов, описывать ТОЛЬКО движение и эволюцию сцены. Разделяй движение субъекта и камеры — это критично для O1.",
      },
      {
        title: "V2V Transform без указания что сохранить",
        explain:
          "Если в V2V Transform не указать «maintaining the original camera movement and subject blocking», модель часто вносит нежелательные изменения в движение — субъект меняет позу, камера сбивается. Якорь сохранения обязателен в каждом V2V Transform промпте.",
      },
      {
        title: "Несогласованная терминология в Ref2V",
        explain:
          "Если в первом предложении промпта назвали «the red jacket», а в третьем переключились на «crimson coat» — модель воспринимает это как два разных объекта и может смешать или подменить. Используй одну согласованную формулировку для каждого референсного элемента через весь промпт.",
      },
      {
        title: "V2V Edit без изоляции изменений",
        explain:
          "Если просто написать «change the sky to sunset» без явного якоря сохранения, V2V Edit меняет всю сцену вместо целевого элемента — освещение, тени, цвета фона. Начинай с того, что сохранить: «Keeping camera movement, subject blocking, and ground lighting identical, change only the sky…».",
      },
      {
        title: "Конфликтующие описания в одном промпте",
        explain:
          "«Bright sunny day with dark moody shadows», «cheerful upbeat scene with melancholic atmosphere» — внутренние противоречия. O1 как reasoning-модель пытается разрешить конфликт и выдаёт неконтролируемый микс. Держи описание стилистически согласованным или явно указывай прогрессию («scene transitions from bright morning to moody evening»).",
      },
    ],
    faq: [
      {
        q: "Чем Kling O1 отличается от Kling 2.6 Pro и 3.0?",
        a: "Kling O1 — reasoning-модель: перед генерацией выполняет внутренний анализ сцены, лучше понимает намерение, а не только ключевые слова. Четыре специализированных режима (I2V, V2V Transform, Ref2V, V2V Edit), каждый со своей стратегией промптинга. 2.6 Pro и 3.0 — общие T2V/I2V модели; O1 заточен под трансформации и редактирование с хирургической точностью.",
      },
      {
        q: "Какая разница между V2V Transform и V2V Edit?",
        a: "V2V Transform меняет общий стиль или атмосферу всего видео (реализм → аниме, день → ночь, современное → cyberpunk). Сохраняет исходное движение, переписывает визуальную эстетику. V2V Edit — хирургическая модификация конкретного элемента (замена неба, изменение цвета одежды, удаление объекта) при сохранении ВСЕГО остального. Edit требует явных якорей сохранения и часто негативных инструкций.",
      },
      {
        q: "Сколько референсов брать в Reference-to-Video?",
        a: "1–4 референсных изображения. Каждый референс должен быть явно привязан к элементу сцены в промпте: «Character A (reference 1) stands in the foreground left». Пространственные отношения между референсами критичны — где кто находится, кто к кому поворачивается. Согласованная терминология через весь промпт обязательна: не переключайся с «red jacket» на «crimson coat» в следующем предложении.",
      },
      {
        q: "Зачем разделять движение субъекта и камеры?",
        a: "В I2V и других режимах O1 особенно сильно реагирует на разделение «кто двигается» и «как двигается камера». «Camera slowly pushes in while the subject turns their head» — модель чётко понимает, что камера и субъект — два независимых элемента. Без разделения reasoning-модель может перепутать, кто инициирует движение, и сгенерировать рассинхронизированную сцену.",
      },
      {
        q: "Какие темпоральные дескрипторы работают?",
        a: "Маркеры ритма и пейсинга: «gradually», «suddenly», «smoothly», «rhythmically». Точечные маркеры времени: «at the 3-second mark», «by the end of the clip», «in the first 2 seconds». Прогрессии: «light fog at the start gradually thickens to dense mist by the end». Reasoning-модель O1 особенно хорошо работает с темпоральными прогрессиями и хореографией освещения.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Можно, но качество ниже. Kling O1 лучше всего реагирует на структурированные английские промпты, особенно из-за технической кинематографической лексики и специфичных формул для каждого режима (V2V Transform, V2V Edit). Reasoning-режим работает на любом языке, но в английском доступен больший словарь стилевых якорей. Для production переводи на английский.",
      },
      {
        q: "Поддерживается ли Opten для Kling O1?",
        a: "Да, расширение Opten автоматически распознаёт Kling O1 и его четыре режима внутри klingai.com. Каждый режим оценивается по своей стратегии: I2V — короткий промпт о движении; V2V Transform — наличие якоря сохранения; Ref2V — привязка референсов к элементам и согласованная терминология; V2V Edit — изоляция изменений с явным «Keeping … identical». Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Kling O1 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Kling O1 — Kuaishou's reasoning video model: four modes (I2V, V2V, Ref2V, Edit), preservation anchors, and before/after examples.",
    h1: "Kling O1: how to write prompts the model actually understands",
    intro:
      "Kling O1 is Kuaishou's reasoning video model on klingai.com. Duration up to 10 seconds, resolution up to 1080p, four specialized modes: I2V, V2V Transform, Reference-to-Video, and V2V Edit. Each mode needs its own prompting strategy — applying the wrong strategy gives unstable results, even with a detailed prompt.",
    sections: [
      {
        heading: "What Kling O1 is",
        body:
          "Kling O1 is a reasoning model: unlike previous versions, it understands prompt intent rather than just keywords. It runs an internal scene analysis before generation, especially helpful for complex compound tasks.\n\nFour modes, each with its own prompting strategy. Image-to-Video for animating still images. Video-to-Video Transform for style transfers that preserve the original motion. Reference-to-Video for generation with element consistency from 1–4 references. V2V Edit for surgical precision — modifying specific elements while preserving everything else. Output quality is driven more by prompt structure than by word count.",
        bullets: [
          "Reasoning model: analyzes intent, not just words",
          "Four modes: I2V, V2V Transform, Ref2V, V2V Edit",
          "Duration up to 10 seconds, resolution up to 1080p",
          "Up to 4 references in Reference-to-Video",
          "Surgical precision in V2V Edit with explicit preservation anchors",
        ],
      },
      {
        heading: "General prompt structure",
        body:
          "Baseline structure for all modes: [Subject + Primary Action] → [Environmental Context] → [Camera Movement/Perspective] → [Style/Quality Descriptors]. The key rule — start with the subject and the primary action. Each element gives the model a concrete visual anchor.\n\nWeak prompt: «A car driving through a city at sunset». Strong: «A sleek silver sports car accelerates through a rain-slicked downtown street as golden sunset light breaks through storm clouds, camera tracking alongside at street level, cinematic lighting with volumetric light rays, photorealistic rendering». The difference — concrete visual anchors: car appearance, street condition, lighting quality, camera behavior, the desired aesthetic. Sweet-spot length 50–150 words.",
      },
      {
        heading: "I2V and V2V Transform: different strategies",
        body:
          "I2V describes ONLY motion. Length 20–40 words. Separate subject motion from camera motion: «Camera slowly pushes in while the subject turns their head to look over their shoulder». Temporal descriptors control rhythm: «gradually», «suddenly», «smoothly», «rhythmically». Describing what's already in the image is an anti-pattern.\n\nV2V Transform — style transfers that preserve motion. Formula: «Transform into [target style] + while maintaining original motion and composition + [specific changes]». Required anchor — «maintaining the original camera movement and subject blocking». Without it the model may inject unwanted changes into motion. Example: «Transform into a cyberpunk cityscape with neon signs, holographic advertisements, and rain-slicked streets reflecting colored lights, maintaining the original camera movement and subject blocking, add volumetric fog and lens flares».",
      },
      {
        heading: "Reference-to-Video and V2V Edit",
        body:
          "Ref2V — generation with element consistency from 1–4 reference images. Formula: [Character from ref 1] + [Action/interaction] + [Spatial relations] + [Setting from ref N]. Each reference must be explicitly tied to an element in the scene: «Character A (reference 1) stands in the foreground left, turning to hand an object to Character B (reference 2) who enters from the right background». Consistent terminology is critical: if you say «the red jacket», don't switch to «crimson coat».\n\nV2V Edit — surgical precision. Formula: «Keeping [what to preserve] identical + change only [what to change] + [specific change description]». Start with what does NOT change: «Keeping all camera movement, subject blocking, and background elements identical, change only the sky to a dramatic sunset with purple and orange clouds». Negative instructions are allowed: «Do not alter facial features, do not change body proportions».",
      },
      {
        heading: "Advanced techniques for reasoning",
        body:
          "Layered motion description — separating foreground, midground, and background: «Foreground subject walks left to right, midground traffic moves right to left at faster speed, background pedestrians move at varying paces, creating parallax depth». This gives O1 a clear depth hierarchy.\n\nLighting choreography — how light changes through the clip: «Scene begins in shadow, sunlight gradually breaks through clouds at the 3-second mark, illuminating the subject's face by the 5-second mark, casting long shadows». A reasoning model handles temporal progressions beautifully.\n\nPhysics-aware description — gravity, inertia, air resistance: «Fabric drapes and flows with gravity, responding to body movement with slight delay, catching air resistance during faster motions». Helps O1 generate physically plausible scenes.",
      },
    ],
    examples: [
      {
        before: "I2V: «person walks to the sea»",
        after:
          "Walks slowly toward the ocean with relaxed steps, hair and clothing moving gently in the warm sea breeze, waves rolling onto shore in the background at a steady rhythm, camera slowly pushes in from behind while gradually tilting up to reveal the horizon",
        note:
          "I2V in the right mode: motion only, no appearance description; subject motion separated from camera motion; temporal descriptors «slowly», «gradually»; layered description (foreground subject, background waves).",
      },
      {
        before: "V2V Transform: «make it cyberpunk»",
        after:
          "Transform into a cyberpunk cityscape with neon signs, holographic advertisements floating between buildings, and rain-slicked streets reflecting saturated magenta and cyan colored lights, maintaining the original camera movement and subject blocking. Add volumetric fog at street level, lens flares on neon signs, and chromatic aberration on bright lights. High-contrast Blade Runner aesthetic with warm amber and cool blue color grading.",
        note:
          "Explicit preservation anchor «maintaining the original camera movement and subject blocking», concrete style anchors (Blade Runner), effect and color-grading descriptions.",
      },
      {
        before: "V2V Edit: «change the sky to sunset»",
        after:
          "Keeping all camera movement, subject blocking, foreground objects, and ground lighting identical, change only the sky to a dramatic sunset with deep purple, orange, and pink cloud formations. Increase contrast in the sky by 15% to match the dramatic mood. Do not alter facial features, do not change body proportions, do not modify the lighting direction on the subject.",
        note:
          "V2V Edit structure: first what to preserve (camera, blocking, foreground, ground lighting), then what to change (sky only), then negative instructions as a guarantee. Masking language isolates the change.",
      },
    ],
    mistakes: [
      {
        title: "Applying T2V strategy to I2V",
        explain:
          "Describing character appearance, clothing, or setting inside an I2V prompt — the model already sees the image. Describing the scene in I2V conflicts with the actual picture. Length 20–40 words, ONLY motion and scene evolution. Separate subject motion from camera motion — critical for O1.",
      },
      {
        title: "V2V Transform without a preservation anchor",
        explain:
          "Without «maintaining the original camera movement and subject blocking» in a V2V Transform prompt, the model often injects unwanted changes — the subject changes pose, the camera drifts. The preservation anchor is required in every V2V Transform prompt.",
      },
      {
        title: "Inconsistent terminology in Ref2V",
        explain:
          "If the first sentence calls it «the red jacket» and the third switches to «crimson coat», the model treats them as two different objects and can mix or swap them. Use one consistent phrasing for each referenced element throughout the prompt.",
      },
      {
        title: "V2V Edit without isolating the change",
        explain:
          "Just writing «change the sky to sunset» without an explicit preservation anchor makes V2V Edit change the whole scene instead of the target element — lighting, shadows, background colors. Start with what to preserve: «Keeping camera movement, subject blocking, and ground lighting identical, change only the sky…».",
      },
      {
        title: "Conflicting descriptions in a single prompt",
        explain:
          "«Bright sunny day with dark moody shadows», «cheerful upbeat scene with melancholic atmosphere» — internal contradictions. As a reasoning model, O1 tries to resolve the conflict and outputs an uncontrolled mix. Keep the description stylistically consistent, or state progression explicitly («scene transitions from bright morning to moody evening»).",
      },
    ],
    faq: [
      {
        q: "How is Kling O1 different from Kling 2.6 Pro and 3.0?",
        a: "Kling O1 is a reasoning model: it runs internal scene analysis before generation and understands intent rather than just keywords. Four specialized modes (I2V, V2V Transform, Ref2V, V2V Edit), each with its own prompting strategy. 2.6 Pro and 3.0 are general T2V/I2V models; O1 is tuned for transformations and editing with surgical precision.",
      },
      {
        q: "What's the difference between V2V Transform and V2V Edit?",
        a: "V2V Transform changes the overall style or atmosphere of the whole video (realism → anime, day → night, modern → cyberpunk). It preserves the original motion and rewrites the visual aesthetic. V2V Edit is a surgical modification of a specific element (sky swap, clothing color change, object removal) while keeping EVERYTHING else. Edit requires explicit preservation anchors and often negative instructions.",
      },
      {
        q: "How many references should I use in Reference-to-Video?",
        a: "1–4 reference images. Each reference must be explicitly tied to a scene element in the prompt: «Character A (reference 1) stands in the foreground left». Spatial relationships between references are critical — who's where, who's turning toward whom. Consistent terminology throughout the prompt is required: don't switch from «red jacket» to «crimson coat» in the next sentence.",
      },
      {
        q: "Why separate subject motion from camera motion?",
        a: "In I2V and other modes, O1 responds strongly to separating «who moves» from «how the camera moves». «Camera slowly pushes in while the subject turns their head» — the model clearly sees that camera and subject are two independent elements. Without separation a reasoning model can confuse who initiates motion and generate a desynced scene.",
      },
      {
        q: "Which temporal descriptors work?",
        a: "Rhythm and pacing markers: «gradually», «suddenly», «smoothly», «rhythmically». Point-in-time markers: «at the 3-second mark», «by the end of the clip», «in the first 2 seconds». Progressions: «light fog at the start gradually thickens to dense mist by the end». O1 as a reasoning model handles temporal progression and lighting choreography especially well.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "You can, but quality drops. Kling O1 responds best to structured English prompts, especially because of technical cinematic vocabulary and mode-specific formulas (V2V Transform, V2V Edit). The reasoning mode works in any language, but English exposes a wider vocabulary of style anchors. For production, translate to English.",
      },
      {
        q: "Does Opten support Kling O1?",
        a: "Yes, the Opten extension auto-detects Kling O1 and its four modes inside klingai.com. Each mode is scored with its own strategy: I2V — short motion-only prompt; V2V Transform — presence of a preservation anchor; Ref2V — reference-to-element binding and consistent terminology; V2V Edit — change isolation with explicit «Keeping … identical». One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
