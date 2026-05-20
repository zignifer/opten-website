// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for luma-ray-3.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Luma Ray 3: структура, ошибки, примеры",
    description:
      "Как писать промпты для Luma Ray 3 / Ray 3.14 / Ray 3 Reasoning: Character Reference, Draft Mode, 16-bit HDR, Visual Annotation, ошибки и примеры до/после.",
    h1: "Luma Ray 3: как писать промпты, которые модель понимает",
    intro:
      "Luma Ray 3 — линейка моделей Luma: Ray 3.14 (рабочая лошадка, default для 90% задач), Ray 3 Reasoning (мультимодальная «рассуждающая» модель). Доступна в Dream Machine и Adobe Firefly. Уникальные возможности: Character Reference для сохранения идентичности персонажа, Draft Mode (5–10x быстрее), 16-bit HDR, Visual Annotation, нативное 1080p. Длительность 5 или 10 секунд.",
    sections: [
      {
        heading: "Что нового в Ray 3",
        body:
          "Ray 3 разделена на две модели. Ray 3.14 — рабочая лошадка, самая быстрая в линейке, рекомендуется как default для 90% задач. Нативное 1080p, HDR, EXR экспорт. Отличное кинематографическое качество: плёночное освещение, стабильная камера, убедительное движение.\n\nRay 3 (Reasoning) — первая мультимодальная «рассуждающая» модель генерации видео. Разбивает сложные креативные задания на шаги, как режиссёр, планирующий раскадровку. Умеет оценивать и уточнять собственные результаты для логической согласованности.\n\nУникальные фичи Ray 3 (только в Reasoning, не в 3.14): Character Reference — загрузка референсного изображения персонажа для сохранения идентичности через T2V, I2V, V2V и Reference Mode. Draft Mode — генерация в 5–10x быстрее и дешевле для итерации идей. 16-bit HDR — нативный расширенный динамический диапазон для студийного качества. Visual Annotation — рисование инструкций прямо на стартовом кадре для точного управления движением.",
        bullets: [
          "Ray 3.14 — default для 90% задач, нативное 1080p",
          "Ray 3 Reasoning — Character Reference, Draft Mode, 16-bit HDR",
          "Visual Annotation — инструкции прямо на кадре",
          "EXR экспорт для профессионального цветокора (540p/720p)",
          "Длительность 5 или 10 секунд, Modify до 18с, Extend до ~30с",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Формула Ray 3 идентична остальному семейству: [Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood].\n\nКак и Ray 2, Ray 3 — «positive only» модель. Негативные промпты контрпродуктивны, описывай только желаемое. Используй present continuous: «running», «pouring», «spinning» — не «begins to», «will», «starts». По умолчанию Ray 3 тяготеет к кинематографическому стилю — если хочешь документальный или social-look, указывай явно.\n\nОптимальная длина — около 100 слов, сфокусированных на действии. Меньше 15 слов — модель додумывает слишком много. Больше 200 слов — перегрузка. Освещение и настроение значительно влияют на качество: «golden hour side lighting», «moody noir lighting, high contrast», «crisp commercial lighting».",
      },
      {
        heading: "Character Reference (только Ray 3)",
        body:
          "Главная уникальная фича Ray 3 — Character Reference для сохранения идентичности персонажа через несколько генераций. Загружается референсное изображение, и промпт описывает только СЦЕНУ и ДЕЙСТВИЕ — внешность определяется референсом.\n\nКлючевое правило: НЕ описывай внешность персонажа повторно. Это делает референсное изображение. Промпт «Character walking through a foggy forest, leaves crunching underfoot, mist swirling around legs, low-angle tracking shot» — корректный. Промпт «Tall woman with blonde hair, blue eyes, wearing red jacket, walking through a foggy forest» — переописывает то, что уже задано референсом, и сбивает модель.\n\nЛучший результат с чёткими, хорошо освещёнными фото лица и ключевых черт. Character Reference работает в T2V, I2V, V2V и Reference Mode. Для многошотовых нарративов с одним персонажем — это must-have. Для одиночных кадров без идентичности — не нужно.",
      },
      {
        heading: "Draft Mode и режимы генерации",
        body:
          "Draft Mode (только Ray 3, не в 3.14) — быстрая генерация в низком разрешении для итерации идей. 5–10x быстрее и дешевле. Стратегия: тестируй идеи в Draft, переключайся на стандартный режим в 1080p для финального рендера. Это особенно полезно для отладки промптов и поиска нужной композиции.\n\nModify (V2V) — трансформация существующего видео, до 18 секунд. Три режима: Adhere (1–3, сохранение оригинала), Flex (1–3, баланс), Reimagine (1–3, творческая свобода). Описывай КОНЕЧНОЕ СОСТОЯНИЕ, не команды: «Cyberpunk neon city at night, rain-slicked streets, purple and blue lighting» работает, «Change the sky to blue» нет. Начинай с Adhere 1–2, повышай при необходимости.\n\nExtend продлевает до ~30 секунд суммарно, Loop делает бесшовное зацикленное видео. Visual Annotation — рисование инструкций прямо на стартовом кадре: разметка зон движения, положения объектов, траектории камеры. Визуальное дополнение к текстовому промпту.",
      },
      {
        heading: "HDR и профессиональный workflow",
        body:
          "16-bit HDR в Ray 3 — нативный расширенный динамический диапазон для драматичного освещения: закаты, неон, огонь, сценическое освещение. EXR экспорт (только 540p и 720p) — для профессионального цветокора в DaVinci Resolve, Nuke и других пост-инструментах.\n\nРекомендованный workflow: 1) Итерируй на 720p или в Draft Mode — экономит время и кредиты. 2) Финальный рендер на 1080p для большинства задач. 3) HDR для драматичного света. 4) Loop для продуктовых шоукейсов. 5) 21:9 ultrawide для cinematic-проектов с letterbox-эстетикой. 6) EXR для пост-продакшена с цветокором.\n\nДля нарративных проектов с одним персонажем используй комбинацию: Character Reference + Draft Mode для итерации + финальный рендер на 1080p без Draft + HDR если кадры в драматичном свете. Это даёт production-ready результат с консистентным героем через несколько шотов.",
      },
    ],
    examples: [
      {
        before:
          "young woman hiking, will look beautiful, hyper-realistic",
        after:
          "Young woman in red jacket hiking up a mountain trail, backpack bouncing slightly with each step, hair tied back, breathing visible in cold air, camera tracking alongside, golden hour side lighting, crisp cinematic detail.",
        note:
          "Запрещённые слова («will look beautiful», «hyper-realistic») убраны. Добавлено вторичное движение (backpack bouncing, breathing visible), present continuous (hiking), конкретная камера (tracking alongside) и свет (golden hour side lighting).",
      },
      {
        before:
          "Tall woman with blonde hair walking through forest (с Character Reference)",
        after:
          "Character walking through a foggy forest, leaves crunching underfoot, mist swirling around legs, low-angle tracking shot, soft diffused morning light, atmospheric depth.",
        note:
          "При Character Reference НЕ описывай внешность повторно — это делает референсное изображение. Промпт фокусируется только на сцене (foggy forest, mist), действии (walking, leaves crunching) и камере (low-angle tracking). Это даёт лучшую консистентность через шоты.",
      },
      {
        before:
          "Change the cloudy sky to clear blue (Modify)",
        after:
          "Clear blue sky with bright daylight, soft white clouds at the horizon, warm sunlight casting natural shadows — same composition and subject as original, Adhere intensity 2.",
        note:
          "Для Modify в Ray 3 описывай КОНЕЧНОЕ состояние как самостоятельную сцену, не команды. Указание интенсивности (Adhere 2) и якорь на сохранение композиции дают предсказуемый результат с минимальным дрейфом.",
      },
    ],
    mistakes: [
      {
        title: "Пере-описание внешности с Character Reference",
        explain:
          "Когда используешь Character Reference, не описывай внешность персонажа в промпте — это делает референсное изображение. Промпт фокусируется на СЦЕНЕ и ДЕЙСТВИИ. Описание внешности дублирует референс и сбивает модель — она пытается совместить два источника информации о персонаже, что даёт нестабильность.",
      },
      {
        title: "Запрещённые слова в Ray 3",
        explain:
          "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — эмпирически деградируют качество на всех моделях Ray, включая Ray 3. Замени на конкретику: вместо «hyper-realistic» — «sharp focused detail, cinematic film grain». Вместо «beautiful» — конкретное описание света, композиции, настроения.",
      },
      {
        title: "Команды и временной язык в Modify",
        explain:
          "«Change the sky to blue», «transforms into a forest», «remove the clouds» — в Modify не работают. Решение: описывай КОНЕЧНОЕ СОСТОЯНИЕ как самостоятельную сцену. «Clear blue sky with bright daylight» работает, «change to blue sky» нет. Никакого временного языка («changes to», «transforms into») — модель не понимает последовательность.",
      },
      {
        title: "Слишком короткий или слишком длинный промпт",
        explain:
          "Меньше 15 слов — модель додумывает слишком много, результат непредсказуем. Больше 200 слов — перегрузка деталями, модель теряет фокус. ~100 слов — золотой стандарт для Ray 3: достаточно деталей субъекта, действия, сцены, вторичного движения, камеры и света без перегрузки.",
      },
      {
        title: "Игнорирование Draft Mode для итерации",
        explain:
          "Полноценный рендер Ray 3 на 1080p стоит времени и кредитов. Draft Mode (5–10x быстрее) специально создан для итерации идей и отладки промптов. Стратегия: гоняй варианты в Draft до стабильного результата, переключайся на стандартный режим только для финала. Не итерируй на полном качестве — это технический долг.",
      },
    ],
    faq: [
      {
        q: "В чём разница между Ray 3 и Ray 3.14?",
        a: "Ray 3.14 — рабочая лошадка, самая быстрая в линейке, рекомендуется для 90% задач: быстрая генерация, нативное 1080p, HDR, EXR экспорт. Ray 3 (Reasoning) — мультимодальная «рассуждающая» модель с уникальными фичами: Character Reference для консистентности персонажа, Draft Mode (5–10x быстрее), 16-bit HDR, Visual Annotation. Используй Ray 3.14 по умолчанию, переключайся на Ray 3 когда нужна идентичность через шоты или быстрая итерация.",
      },
      {
        q: "Что такое Character Reference в Ray 3?",
        a: "Character Reference — фича только в Ray 3 (не в 3.14), которая позволяет загрузить референсное изображение персонажа для сохранения идентичности через несколько генераций. Работает в T2V, I2V, V2V и Reference Mode. Главное правило: промпт описывает только СЦЕНУ и ДЕЙСТВИЕ — внешность задаётся референсом. НЕ описывай внешность повторно. Лучший результат с чёткими, хорошо освещёнными фото.",
      },
      {
        q: "Когда использовать Draft Mode?",
        a: "Draft Mode (только Ray 3) — для итерации идей и отладки промптов. 5–10x быстрее и дешевле обычного рендера. Стратегия: тестируй промпт в Draft до стабильного результата, переключайся на стандартный режим в 1080p для финала. Не используй Draft для финальных рендеров — качество ниже. Не используй стандартный режим для каждой итерации — это технический долг.",
      },
      {
        q: "Что такое Visual Annotation?",
        a: "Visual Annotation — фича Ray 3, позволяющая рисовать инструкции прямо на стартовом кадре: размечать зоны движения, положения объектов, траектории камеры. Это визуальное дополнение к текстовому промпту, особенно полезное для сложного движения, точного позиционирования объектов и многосубъектных сцен. Не заменяет текст, а дополняет его.",
      },
      {
        q: "Поддерживает ли Ray 3 16-bit HDR?",
        a: "Да, Ray 3 — первая модель Luma с нативным 16-bit HDR. Это расширенный динамический диапазон для студийного качества: драматичное освещение (закаты, неон, огонь, сценический свет) выглядит правдоподобно. EXR экспорт (540p и 720p) даёт несжатые HDR-кадры для профессионального цветокора в DaVinci Resolve, Nuke и других пост-инструментах. Ray 3.14 также поддерживает HDR.",
      },
      {
        q: "Какой длительности можно сгенерировать?",
        a: "T2V и I2V — 5 или 10 секунд за один запуск. Modify (V2V) — до 18 секунд. Extend продлевает до ~30 секунд суммарно, далее качество деградирует. Каждое продление через Extend — отдельный промпт с описанием нового контента. Для бесшовного зацикленного видео используй Loop. Для нарративов длиннее 30 секунд — несколько отдельных шотов через Character Reference.",
      },
      {
        q: "Поддерживает ли Opten Luma Ray 3?",
        a: "Да, расширение Opten автоматически распознаёт все модели линейки Ray 3 (Ray 3, Ray 3.14, Ray 3 Reasoning) и оценивает промпты с учётом их специфики. Проверяет правильное использование Character Reference (без переописания внешности), отсутствие команд в Modify, present continuous, конкретное описание камеры и света, оптимальную длину ~100 слов. Одним кликом получаешь rewrite под выбранную модель.",
      },
    ],
  },
  en: {
    title: "Luma Ray 3 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Luma Ray 3 / Ray 3.14 / Ray 3 Reasoning: Character Reference, Draft Mode, 16-bit HDR, Visual Annotation, mistakes, and examples.",
    h1: "Luma Ray 3: how to write prompts the model actually understands",
    intro:
      "Luma Ray 3 is the Ray 3 lineup: Ray 3.14 (the workhorse, default for 90% of tasks) and Ray 3 Reasoning (the multimodal «thinking» model). Available in Dream Machine and Adobe Firefly. Unique features: Character Reference for character identity, Draft Mode (5–10x faster), 16-bit HDR, Visual Annotation, native 1080p. Duration is 5 or 10 seconds.",
    sections: [
      {
        heading: "What's new in Ray 3",
        body:
          "Ray 3 is split into two models. Ray 3.14 is the workhorse — the fastest in the lineup, recommended as default for 90% of tasks. Native 1080p, HDR, EXR export. Excellent cinematic quality: filmic lighting, stable camera, convincing motion.\n\nRay 3 (Reasoning) is the first multimodal «thinking» video model. It breaks down complex creative briefs into steps, like a director planning a storyboard. It can evaluate and refine its own results for logical consistency.\n\nUnique features in Ray 3 only (not in 3.14): Character Reference — upload a reference image to preserve identity across T2V, I2V, V2V and Reference Mode. Draft Mode — generation 5–10x faster and cheaper for idea iteration. 16-bit HDR — native extended dynamic range for studio quality. Visual Annotation — draw instructions directly on the start frame for precise motion control.",
        bullets: [
          "Ray 3.14 — default for 90% of tasks, native 1080p",
          "Ray 3 Reasoning — Character Reference, Draft Mode, 16-bit HDR",
          "Visual Annotation — instructions drawn on the frame",
          "EXR export for professional color grading (540p/720p)",
          "Duration 5 or 10 seconds, Modify up to 18s, Extend up to ~30s",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "The Ray 3 formula is identical to the rest of the family: [Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood].\n\nLike Ray 2, Ray 3 is a «positive only» model. Negative prompts are counter-productive — describe only what you want. Use present continuous: «running», «pouring», «spinning» — not «begins to», «will», «starts». Ray 3 defaults toward a cinematic look — if you want documentary or social-style, state it explicitly.\n\nOptimal length is around 100 words focused on the action. Under 15 words — the model fills in too much. Over 200 words — overload. Lighting and mood significantly drive quality: «golden hour side lighting», «moody noir lighting, high contrast», «crisp commercial lighting».",
      },
      {
        heading: "Character Reference (Ray 3 only)",
        body:
          "The headline Ray 3 feature is Character Reference for preserving character identity across multiple generations. Upload a reference image and the prompt describes only the SCENE and ACTION — appearance is locked by the reference.\n\nKey rule: do NOT re-describe the character's appearance. The reference image does that. The prompt «Character walking through a foggy forest, leaves crunching underfoot, mist swirling around legs, low-angle tracking shot» is correct. The prompt «Tall woman with blonde hair, blue eyes, wearing red jacket, walking through a foggy forest» re-describes what the reference already defines and throws the model off.\n\nBest results come from clear, well-lit photos showing the face and key features. Character Reference works in T2V, I2V, V2V and Reference Mode. For multi-shot narratives with one character — must-have. For one-off shots without identity needs — not required.",
      },
      {
        heading: "Draft Mode and generation modes",
        body:
          "Draft Mode (Ray 3 only, not in 3.14) — fast low-resolution generation for idea iteration. 5–10x faster and cheaper. Strategy: test ideas in Draft, switch to standard 1080p mode for final renders. Especially useful for prompt debugging and finding the right composition.\n\nModify (V2V) — transforming existing video, up to 18 seconds. Three modes: Adhere (1–3, preserves the original), Flex (1–3, balance), Reimagine (1–3, creative freedom). Describe the END STATE, not commands: «Cyberpunk neon city at night, rain-slicked streets, purple and blue lighting» works; «Change the sky to blue» doesn't. Start at Adhere 1–2 and raise as needed.\n\nExtend pushes total length up to ~30 seconds, Loop produces a seamless looped video. Visual Annotation — drawing instructions directly on the start frame: motion zones, object positions, camera paths. A visual supplement to the text prompt.",
      },
      {
        heading: "HDR and professional workflow",
        body:
          "16-bit HDR in Ray 3 is native extended dynamic range for dramatic lighting: sunsets, neon, fire, stage lights. EXR export (540p and 720p only) is for professional color grading in DaVinci Resolve, Nuke, and other post tools.\n\nRecommended workflow: 1) Iterate at 720p or in Draft Mode — saves time and credits. 2) Final render at 1080p for most tasks. 3) HDR for dramatic light. 4) Loop for product showcases. 5) 21:9 ultrawide for cinematic projects with a letterbox feel. 6) EXR for post-production with color grading.\n\nFor narrative projects with one character, use the combination: Character Reference + Draft Mode for iteration + final render at 1080p without Draft + HDR if shots have dramatic light. This yields production-ready results with a consistent hero across multiple shots.",
      },
    ],
    examples: [
      {
        before:
          "young woman hiking, will look beautiful, hyper-realistic",
        after:
          "Young woman in red jacket hiking up a mountain trail, backpack bouncing slightly with each step, hair tied back, breathing visible in cold air, camera tracking alongside, golden hour side lighting, crisp cinematic detail.",
        note:
          "Forbidden words («will look beautiful», «hyper-realistic») removed. Added secondary motion (backpack bouncing, breathing visible), present continuous (hiking), explicit camera (tracking alongside) and light (golden hour side lighting).",
      },
      {
        before:
          "Tall woman with blonde hair walking through forest (with Character Reference)",
        after:
          "Character walking through a foggy forest, leaves crunching underfoot, mist swirling around legs, low-angle tracking shot, soft diffused morning light, atmospheric depth.",
        note:
          "With Character Reference do NOT re-describe appearance — that's what the reference image handles. The prompt focuses on the scene (foggy forest, mist), action (walking, leaves crunching), and camera (low-angle tracking). This gives the best consistency across shots.",
      },
      {
        before:
          "Change the cloudy sky to clear blue (Modify)",
        after:
          "Clear blue sky with bright daylight, soft white clouds at the horizon, warm sunlight casting natural shadows — same composition and subject as original, Adhere intensity 2.",
        note:
          "For Modify in Ray 3, describe the END STATE as a standalone scene, not as a command. Specifying intensity (Adhere 2) and anchoring «same composition» yields predictable results with minimal drift.",
      },
    ],
    mistakes: [
      {
        title: "Re-describing appearance with Character Reference",
        explain:
          "When using Character Reference, don't describe the character's appearance in the prompt — the reference image does that. The prompt should focus on the SCENE and ACTION. Describing appearance duplicates the reference and throws the model off — it tries to combine two sources of character information, producing instability.",
      },
      {
        title: "Forbidden words in Ray 3",
        explain:
          "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» empirically degrade quality across all Ray models, including Ray 3. Replace with concrete description: instead of «hyper-realistic» write «sharp focused detail, cinematic film grain». Instead of «beautiful» use concrete light, composition, mood description.",
      },
      {
        title: "Commands and temporal language in Modify",
        explain:
          "«Change the sky to blue», «transforms into a forest», «remove the clouds» — don't work in Modify. The fix: describe the END STATE as a standalone scene. «Clear blue sky with bright daylight» works; «change to blue sky» doesn't. No temporal language («changes to», «transforms into») — the model doesn't understand sequence.",
      },
      {
        title: "Prompt too short or too long",
        explain:
          "Under 15 words — the model fills in too much, results are unpredictable. Over 200 words — detail overload, the model loses focus. ~100 words is the gold standard for Ray 3: enough detail on subject, action, scene, secondary motion, camera, and light without overload.",
      },
      {
        title: "Skipping Draft Mode for iteration",
        explain:
          "A full Ray 3 render at 1080p costs time and credits. Draft Mode (5–10x faster) is purpose-built for idea iteration and prompt debugging. Strategy: cycle variants in Draft until stable, switch to standard mode only for finals. Don't iterate at full quality — that's technical debt.",
      },
    ],
    faq: [
      {
        q: "What's the difference between Ray 3 and Ray 3.14?",
        a: "Ray 3.14 is the workhorse — the fastest in the lineup, recommended for 90% of tasks: fast generation, native 1080p, HDR, EXR export. Ray 3 (Reasoning) is the multimodal «thinking» model with unique features: Character Reference for character consistency, Draft Mode (5–10x faster), 16-bit HDR, Visual Annotation. Use Ray 3.14 by default, switch to Ray 3 when you need identity across shots or fast iteration.",
      },
      {
        q: "What is Character Reference in Ray 3?",
        a: "Character Reference is a Ray 3-only feature (not in 3.14) that lets you upload a reference image of a character to preserve identity across multiple generations. Works in T2V, I2V, V2V and Reference Mode. Key rule: the prompt describes only the SCENE and ACTION — appearance is set by the reference. Do NOT re-describe appearance. Best results with clear, well-lit photos.",
      },
      {
        q: "When should I use Draft Mode?",
        a: "Draft Mode (Ray 3 only) is for idea iteration and prompt debugging. 5–10x faster and cheaper than standard rendering. Strategy: test the prompt in Draft until stable, switch to standard 1080p mode for finals. Don't use Draft for final renders — quality is lower. Don't use standard mode for every iteration — that's technical debt.",
      },
      {
        q: "What is Visual Annotation?",
        a: "Visual Annotation is a Ray 3 feature that lets you draw instructions directly on the start frame: motion zones, object positions, camera paths. It's a visual supplement to the text prompt, especially useful for complex motion, precise object placement, and multi-subject scenes. It doesn't replace text — it complements it.",
      },
      {
        q: "Does Ray 3 support 16-bit HDR?",
        a: "Yes, Ray 3 is Luma's first model with native 16-bit HDR. This is extended dynamic range for studio quality: dramatic lighting (sunsets, neon, fire, stage lights) looks convincing. EXR export (540p and 720p) gives uncompressed HDR frames for professional color grading in DaVinci Resolve, Nuke, and other post tools. Ray 3.14 also supports HDR.",
      },
      {
        q: "How long can I generate?",
        a: "T2V and I2V — 5 or 10 seconds per run. Modify (V2V) — up to 18 seconds. Extend pushes total length to ~30 seconds, beyond that quality degrades. Each Extend run is a separate prompt with new content. For seamless looping use Loop. For narratives longer than 30 seconds — multiple separate shots tied together via Character Reference.",
      },
      {
        q: "Does Opten support Luma Ray 3?",
        a: "Yes, the Opten extension auto-detects every model in the Ray 3 lineup (Ray 3, Ray 3.14, Ray 3 Reasoning) and scores prompts with their specifics in mind. It checks correct use of Character Reference (no re-describing appearance), absence of commands in Modify, present continuous, concrete camera and light descriptions, and the optimal ~100-word length. One click gives you a rewrite targeted at the selected model.",
      },
    ],
  },
};
