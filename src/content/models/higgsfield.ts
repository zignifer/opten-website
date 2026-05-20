// Phase v2.0 MODELS-B-1 (agent batch 1): generated content for higgsfield.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Higgsfield: структура, ошибки, примеры",
    description:
      "Как писать промпты для Higgsfield Soul 2.0, Soul Cinema и DoP: креативный бриф, motion presets, разделение задач, типичные ошибки и примеры.",
    h1: "Higgsfield: как писать промпты, которые модель понимает",
    intro:
      "Higgsfield — платформа с проприетарными моделями Soul 2.0 (image, до 4K), Soul Cinema (era-aware image) и DoP (image-to-video, 5 секунд, 720–1080p, 100+ motion presets). Soul понимает субкультурные коды и микротренды нативно, DoP принимает короткие командные промпты — одно действие плюс одно движение камеры за раз.",
    sections: [
      {
        heading: "Что входит в семейство Higgsfield",
        body:
          "Soul 2.0 — image-модель с разрешением до 4K, режимами T2I и I2I, 20+ стилевыми пресетами и системой Soul ID для консистентности персонажей. Понимает фэшн-терминологию, субкультурный язык, микротренды («phone flash», «disposable camera», «Y2K street»).\n\nSoul Cinema — отдельная image-модель с фокусом на кинематографических ключевых кадрах. Глубокие текстуры, плёночное зерно, стилизация под эпохи (70s, 90s). Подходит для раскадровок и концепт-арта.\n\nDoP — image-to-video модель: 5 секунд, 720–1080p, 100+ motion presets (360 Orbit, Dolly In/Out, Whip Pan, FPV Drone, Bullet Time). Тиры скорости: Lite (быстрый превью), Turbo (1.5–2× быстрее Standard), Standard (макс. качество).",
        bullets: [
          "Soul 2.0: T2I + I2I, до 4K, 20+ стилевых пресетов",
          "Soul Cinema: era-aware image (70s, 90s), плёночная стилизация",
          "DoP: I2V, 5 секунд, 720p–1080p, 100+ motion presets",
          "Soul ID — консистентность персонажей через несколько генераций",
          "Face/Character Swap — визуальные инструменты, без текстовых промптов",
        ],
      },
      {
        heading: "Структура промпта для Soul",
        body:
          "Промпт для Soul 2.0 / Soul Cinema — это креативный бриф, а не список тегов. Формула: [Mood/Aesthetic] + [Subject with visual cues] + [References/Style] + [Technical hints].\n\nSoul нативно понимает субкультурный и эстетический язык: «phone flash editorial», «disposable camera Y2K street», «90s film grain», «editorial fashion forward». Не нужно переобъяснять эти термины — модель распознаёт коды.\n\nДлина: короткие-средние промпты. Выбор стилевого пресета снижает нужду в сложном промпте. Для I2I (Soul Reference) используй референсное изображение как стилевой якорь — промпт описывает направление, не визуал.",
      },
      {
        heading: "Структура промпта для DoP (видео)",
        body:
          "DoP принимает короткие и прямые промпты. Формула: [Active verb action] + [Camera direction]. Одно действие плюс одно движение камеры за раз.\n\nИспользуй активные глаголы: «darts through», «leaps across», «crashes into», «glides», «spins». Удаляй «fillers» — командный стиль работает лучше описательного.\n\nKлючевое правило: разделение задач. Освещение и кадрирование — в промпте изображения (Soul). Движение — в видео-промпте (DoP). Освещение в видео-промпте вызывает мерцание. Motion preset выбирается ОТДЕЛЬНО от текстового промпта — это параметр, не часть промпта.\n\n«Shot on full-frame cinema camera» в видео-промпте повышает реализм.",
      },
      {
        heading: "Soul ID, HEX, Reference",
        body:
          "Soul ID — консистентность персонажей через несколько генераций. Использовать свежие, однотипные референсные фото. Главный антипаттерн — смешивание старых и новых референсов: это вызывает drift идентичности.\n\nSoul HEX — автоматическое извлечение и применение цветовых палитр из референсных изображений. Полезно для брендовых серий и моодбордов с фиксированной цветовой схемой.\n\nSoul Reference — I2I с визуальным якорением: загружаешь референс, промпт описывает что изменить или как стилизовать. Чистый белый фон на входном изображении — антипаттерн, не хватает глубины для Soul.",
      },
      {
        heading: "Face Swap, Character Swap и тиры DoP",
        body:
          "Face Swap и Character Swap — визуальные инструменты, НЕ используют текстовые промпты. Face Swap — замена лица в изображении/видео на основе визуального ввода. Character Swap (Recast) — перенос полного образа: тело, мимика, тон кожи, движение. 30+ пресетов персонажей. Оценка промпта для этих режимов невозможна — они работают без текста.\n\nТиры DoP — скорость генерации, не разные модели:\n\nDoP Lite (2 кредита) — самый быстрый, для превью концептов. DoP Turbo (6.5 кредитов) — 1.5–2× быстрее Standard, баланс скорость/качество. DoP Standard (9 кредитов) — стандарт, максимальное качество и улучшенный реализм освещения.",
      },
    ],
    examples: [
      {
        before: "красивая девушка в стиле 90-х",
        after:
          "Phone flash editorial portrait of a young woman with bleached blonde hair and pink eyeshadow, oversized denim jacket, holding a disposable camera, Y2K street aesthetic, slight motion blur, harsh frontal flash, low fashion editorial mood.",
        note:
          "Soul 2.0 нативно понимает «phone flash», «disposable camera», «Y2K» — не нужно переобъяснять. Конкретные эстетические коды + субъект с визуальными деталями + техника съёмки.",
      },
      {
        before:
          "the woman walks through the city looking sad and then turns around to look at the camera with cinematic lighting and atmospheric mood",
        after:
          "Walks briskly through neon-lit alley, Whip Pan toward camera.",
        note:
          "DoP промпт должен быть КОРОТКИМ. Одно действие плюс одно движение камеры. Освещение и кадрирование — в Soul-промпте, не в DoP. Motion preset (Whip Pan) — это параметр, выбирается отдельно.",
      },
      {
        before: "white background portrait, simple, clean",
        after:
          "Editorial portrait of a young woman with long dark hair, wearing a cream cashmere sweater, against a soft warm grey studio backdrop, natural window light from the left, fashion-forward mood, shallow depth of field.",
        note:
          "Чистый белый фон на входном изображении — антипаттерн для Soul, не хватает глубины. Описание конкретного фона (warm grey backdrop) и освещения дают модели опору для рендеринга.",
      },
    ],
    mistakes: [
      {
        title: "Длинные сложные промпты для DoP",
        explain:
          "DoP — image-to-video с фокусом на движении. Длинные описательные промпты с историей и эмоциями работают плохо. Короткие командные конструкции «Active verb + Camera direction» — норма. Если хочется сложности, переноси её в image-промпт (Soul), а не в DoP.",
      },
      {
        title: "Освещение и объектив в видео-промпте",
        explain:
          "Освещение и кадрирование в DoP-промпте вызывают мерцание (flicker). Эти параметры должны быть зафиксированы на этапе изображения (Soul). Видео-промпт описывает только движение и действие. Это базовое правило разделения задач между Soul и DoP.",
      },
      {
        title: "Смешивание старых и новых референсов для Soul ID",
        explain:
          "Soul ID обеспечивает консистентность персонажа через несколько генераций при свежих, однотипных референсных фото. Смешивание старых снимков (другая стрижка, освещение, возраст) и новых вызывает drift идентичности — модель усредняет лицо. Используй 3–5 свежих фото в едином стиле.",
      },
      {
        title: "Чистый белый фон на входном изображении",
        explain:
          "Soul (как T2I, так и I2I) хуже работает с чистым белым фоном на входе — не хватает глубины и контекста для генерации. Используй cluttered scene, studio backdrop с тоном, или environmental background. Если фон должен быть нейтральным, описывай его как «soft warm grey backdrop», не «pure white».",
      },
      {
        title: "Промпт для Face Swap / Character Swap",
        explain:
          "Face Swap и Character Swap (Recast) — визуальные инструменты, без текстовых промптов. Работают на основе входных изображений и пресетов. Если ты пытаешься редактировать лицо или образ через текст в этих режимах — ничего не сработает. Используй Soul Reference (I2I) для текстового редактирования или Face Swap для визуального переноса.",
      },
    ],
    faq: [
      {
        q: "Чем отличаются Soul 2.0, Soul Cinema и DoP?",
        a: "Soul 2.0 — image-модель до 4K с фэшн-фокусом, понимает субкультурные коды и микротренды. Soul Cinema — image-модель с era-aware стилизацией (70s, 90s), плёночное зерно, кинематографические ключевые кадры. DoP — image-to-video, 5 секунд, 100+ motion presets, принимает короткие командные промпты. Эти модели часто используются в связке: Soul/Cinema → ключевой кадр → DoP анимирует его.",
      },
      {
        q: "В чём разница между DoP Lite, Turbo и Standard?",
        a: "Это тиры скорости, не разные модели. DoP Lite (2 кредита) — самый быстрый, для превью концептов. DoP Turbo (6.5 кредитов) — 1.5–2× быстрее Standard, баланс. DoP Standard (9 кредитов) — максимальное качество, улучшенный реализм освещения. Для финальной продукции — Standard, для итераций — Turbo, для быстрых тестов — Lite.",
      },
      {
        q: "Как работает Soul ID для консистентности персонажа?",
        a: "Загружаешь 3–5 свежих, однотипных референсных фото персонажа. Soul ID извлекает идентичность и сохраняет её через несколько генераций. Главное правило — не смешивать старые и новые фото: разная стрижка, освещение, возраст вызывают drift. Идеально — одна сессия съёмки с разных ракурсов в одинаковом стиле.",
      },
      {
        q: "Почему нельзя редактировать освещение в DoP-промпте?",
        a: "Освещение и кадрирование в видео-промпте вызывают мерцание (flicker) между кадрами. DoP — image-to-video, и освещение должно быть зафиксировано на этапе изображения. Если нужно изменить свет — генерируй новое изображение через Soul с нужным освещением, потом анимируй через DoP. Это базовое правило разделения задач.",
      },
      {
        q: "Можно ли использовать Face Swap через текстовый промпт?",
        a: "Нет. Face Swap и Character Swap (Recast) — визуальные инструменты, работают на основе входных изображений и пресетов, без текста. Для текстового редактирования лица или образа используй Soul Reference (I2I): загружаешь референс, промпт описывает изменение. Это разные пайплайны.",
      },
      {
        q: "Какие motion presets поддерживает DoP?",
        a: "100+ пресетов, включая 360 Orbit, Dolly In/Out, Whip Pan, FPV Drone, Bullet Time, Tracking. Выбираются отдельно от текстового промпта — это параметр, не часть промпта. В DoP-промпте описывай действие («darts through», «leaps»), а motion preset — через UI или API-параметр. Это разделение делает результат предсказуемее.",
      },
      {
        q: "Поддерживается ли Opten для Higgsfield?",
        a: "Да, расширение Opten автоматически распознаёт Higgsfield Soul 2.0, Soul Cinema и DoP. Оценивает промпты по структуре, описанной выше: проверяет креативный бриф для Soul, короткий командный промпт для DoP, разделение задач (освещение в Soul, движение в DoP), отсутствие текстовых промптов для Face/Character Swap. Одним кликом можно получить rewrite в правильной структуре.",
      },
    ],
  },
  en: {
    title: "Higgsfield Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Higgsfield Soul 2.0, Soul Cinema, and DoP: creative brief, motion presets, task separation, common mistakes, and examples.",
    h1: "Higgsfield: how to write prompts the model actually understands",
    intro:
      "Higgsfield is a platform with proprietary models — Soul 2.0 (image, up to 4K), Soul Cinema (era-aware image), and DoP (image-to-video, 5 seconds, 720–1080p, 100+ motion presets). Soul understands subcultural codes and micro-trends natively; DoP accepts short command-style prompts — one action plus one camera move at a time.",
    sections: [
      {
        heading: "What's in the Higgsfield family",
        body:
          "Soul 2.0 — image model up to 4K with T2I and I2I modes, 20+ style presets, and a Soul ID system for character consistency. Understands fashion terminology, subcultural language, micro-trends («phone flash», «disposable camera», «Y2K street»).\n\nSoul Cinema — a separate image model focused on cinematic keyframes. Deep textures, film grain, era styling (70s, 90s). Suited for storyboards and concept art.\n\nDoP — image-to-video model: 5 seconds, 720–1080p, 100+ motion presets (360 Orbit, Dolly In/Out, Whip Pan, FPV Drone, Bullet Time). Speed tiers: Lite (fast preview), Turbo (1.5–2× faster than Standard), Standard (max quality).",
        bullets: [
          "Soul 2.0: T2I + I2I, up to 4K, 20+ style presets",
          "Soul Cinema: era-aware image (70s, 90s), film-grain styling",
          "DoP: I2V, 5 seconds, 720p–1080p, 100+ motion presets",
          "Soul ID — character consistency across multiple generations",
          "Face/Character Swap — visual tools, no text prompts",
        ],
      },
      {
        heading: "Soul prompt structure",
        body:
          "A Soul 2.0 / Soul Cinema prompt is a creative brief, not a tag list. Formula: [Mood/Aesthetic] + [Subject with visual cues] + [References/Style] + [Technical hints].\n\nSoul natively understands subcultural and aesthetic language: «phone flash editorial», «disposable camera Y2K street», «90s film grain», «editorial fashion forward». No need to over-explain these terms — the model recognizes the codes.\n\nLength: short-to-medium prompts. Picking a style preset lowers the need for a complex prompt. For I2I (Soul Reference) use the reference image as a stylistic anchor — the prompt describes direction, not the visual.",
      },
      {
        heading: "DoP prompt structure (video)",
        body:
          "DoP accepts short, direct prompts. Formula: [Active verb action] + [Camera direction]. One action plus one camera move at a time.\n\nUse active verbs: «darts through», «leaps across», «crashes into», «glides», «spins». Drop fillers — command style beats descriptive style here.\n\nKey rule: task separation. Lighting and framing go in the image prompt (Soul). Motion goes in the video prompt (DoP). Lighting in the video prompt causes flicker. Motion preset is selected SEPARATELY from the text prompt — it's a parameter, not part of the prompt.\n\n«Shot on full-frame cinema camera» in the video prompt boosts realism.",
      },
      {
        heading: "Soul ID, HEX, Reference",
        body:
          "Soul ID — character consistency across multiple generations. Use fresh, uniform reference photos. The main antipattern is mixing old and new references — this causes identity drift.\n\nSoul HEX — automatic extraction and application of color palettes from reference images. Useful for brand series and moodboards with a fixed color scheme.\n\nSoul Reference — I2I with visual anchoring: upload a reference, the prompt describes what to change or how to stylize. A pure white background on the input image is an antipattern — there's not enough depth for Soul.",
      },
      {
        heading: "Face Swap, Character Swap, and DoP tiers",
        body:
          "Face Swap and Character Swap are visual tools — they do NOT use text prompts. Face Swap — face replacement in an image/video based on visual input. Character Swap (Recast) — full appearance transfer: body, mimic, skin tone, movement. 30+ character presets. Prompt scoring for these modes is impossible — they run without text.\n\nDoP tiers are generation speeds, not different models:\n\nDoP Lite (2 credits) — fastest, for concept previews. DoP Turbo (6.5 credits) — 1.5–2× faster than Standard, balanced. DoP Standard (9 credits) — standard, max quality and improved lighting realism.",
      },
    ],
    examples: [
      {
        before: "beautiful girl in 90s style",
        after:
          "Phone flash editorial portrait of a young woman with bleached blonde hair and pink eyeshadow, oversized denim jacket, holding a disposable camera, Y2K street aesthetic, slight motion blur, harsh frontal flash, low fashion editorial mood.",
        note:
          "Soul 2.0 natively understands «phone flash», «disposable camera», «Y2K» — no need to over-explain. Concrete aesthetic codes + subject with visual cues + technique.",
      },
      {
        before:
          "the woman walks through the city looking sad and then turns around to look at the camera with cinematic lighting and atmospheric mood",
        after:
          "Walks briskly through neon-lit alley, Whip Pan toward camera.",
        note:
          "A DoP prompt should be SHORT. One action plus one camera move. Lighting and framing belong in the Soul prompt, not in DoP. Motion preset (Whip Pan) is a parameter, selected separately.",
      },
      {
        before: "white background portrait, simple, clean",
        after:
          "Editorial portrait of a young woman with long dark hair, wearing a cream cashmere sweater, against a soft warm grey studio backdrop, natural window light from the left, fashion-forward mood, shallow depth of field.",
        note:
          "A pure white background on the input image is a Soul antipattern — not enough depth. A concrete background (warm grey backdrop) and lighting give the model something to anchor on.",
      },
    ],
    mistakes: [
      {
        title: "Long complex prompts for DoP",
        explain:
          "DoP is image-to-video with a focus on motion. Long descriptive prompts with story and emotion work poorly. Short command-style «Active verb + Camera direction» is the norm. If complexity is needed, push it into the image prompt (Soul), not into DoP.",
      },
      {
        title: "Lighting and lens in the video prompt",
        explain:
          "Lighting and framing in a DoP prompt cause flicker. These parameters should be fixed at the image stage (Soul). The video prompt describes only motion and action. This is the basic task-separation rule between Soul and DoP.",
      },
      {
        title: "Mixing old and new references for Soul ID",
        explain:
          "Soul ID delivers character consistency across multiple generations with fresh, uniform reference photos. Mixing old shots (different haircut, lighting, age) with new ones causes identity drift — the model averages the face. Use 3–5 fresh photos in one consistent style.",
      },
      {
        title: "Pure white background on the input image",
        explain:
          "Soul (both T2I and I2I) works worse with a pure white input background — not enough depth or context for generation. Use a cluttered scene, a toned studio backdrop, or an environmental background. If the background must be neutral, describe it as «soft warm grey backdrop», not «pure white».",
      },
      {
        title: "Prompting Face Swap / Character Swap",
        explain:
          "Face Swap and Character Swap (Recast) are visual tools, no text prompts. They run on input images and presets. Trying to edit a face or look via text in these modes won't work. Use Soul Reference (I2I) for text-driven editing or Face Swap for visual transfer.",
      },
    ],
    faq: [
      {
        q: "How are Soul 2.0, Soul Cinema, and DoP different?",
        a: "Soul 2.0 — image model up to 4K with a fashion focus, understands subcultural codes and micro-trends. Soul Cinema — image model with era-aware styling (70s, 90s), film grain, cinematic keyframes. DoP — image-to-video, 5 seconds, 100+ motion presets, accepts short command-style prompts. These models are often chained: Soul/Cinema → keyframe → DoP animates it.",
      },
      {
        q: "What's the difference between DoP Lite, Turbo, and Standard?",
        a: "These are speed tiers, not separate models. DoP Lite (2 credits) — fastest, for concept previews. DoP Turbo (6.5 credits) — 1.5–2× faster than Standard, balanced. DoP Standard (9 credits) — max quality, improved lighting realism. For final production — Standard, for iterations — Turbo, for quick tests — Lite.",
      },
      {
        q: "How does Soul ID deliver character consistency?",
        a: "Upload 3–5 fresh, uniform reference photos of the character. Soul ID extracts identity and preserves it across multiple generations. The key rule — don't mix old and new photos: different haircut, lighting, or age cause drift. Ideal — one photo session from different angles in the same style.",
      },
      {
        q: "Why can't lighting be edited in the DoP prompt?",
        a: "Lighting and framing in the video prompt cause flicker between frames. DoP is image-to-video, and lighting must be locked at the image stage. To change the light — generate a new image via Soul with the desired lighting, then animate via DoP. This is the basic task-separation rule.",
      },
      {
        q: "Can Face Swap be used through a text prompt?",
        a: "No. Face Swap and Character Swap (Recast) are visual tools — they run on input images and presets, without text. For text-driven editing of a face or look, use Soul Reference (I2I): upload a reference, prompt describes the change. These are different pipelines.",
      },
      {
        q: "What motion presets does DoP support?",
        a: "100+ presets including 360 Orbit, Dolly In/Out, Whip Pan, FPV Drone, Bullet Time, Tracking. They're chosen separately from the text prompt — it's a parameter, not part of the prompt. In the DoP prompt, describe the action («darts through», «leaps»); the motion preset goes through the UI or API parameter. This separation keeps results predictable.",
      },
      {
        q: "Does Opten support Higgsfield?",
        a: "Yes, the Opten extension auto-detects Higgsfield Soul 2.0, Soul Cinema, and DoP. It scores prompts against the structure outlined above: creative brief for Soul, short command prompt for DoP, task separation (lighting in Soul, motion in DoP), and absence of text prompts for Face/Character Swap. One click delivers a rewrite in the correct structure.",
      },
    ],
  },
};
