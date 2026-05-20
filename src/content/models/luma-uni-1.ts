// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for luma-uni-1.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Luma Uni-1: структура, ошибки, примеры",
    description:
      "Как писать промпты для Luma Uni-1: 8 шаблонов, multi-reference fusion с ролями, режимы Generate/Modify, reasoning + intent_weight, seed как recipe, примеры.",
    h1: "Luma Uni-1: как писать промпты, которые модель понимает",
    intro:
      "Luma Uni-1 — image-модель Luma Labs с уникальной архитектурой: decoder-only autoregressive transformer (НЕ диффузия), генерирует пиксели последовательно. Нативное 2K разрешение, reasoning по умолчанию (модель «думает» о композиции перед рендером), до 9 референсов с явными ролями (CHARACTER, STYLE, LIGHTING и др.), сильная мультиязычность. Доступна через Luma Labs и REST API.",
    sections: [
      {
        heading: "Что отличает Uni-1",
        body:
          "Uni-1 — это не диффузионная модель. Архитектура decoder-only autoregressive transformer генерирует пиксели последовательно, что даёт ей уникальные преимущества: сильное удержание спатиальных отношений, лучшая работа с многореференсными композициями, поддержка раскадровок с консистентностью персонажа, и встроенный reasoning, который «думает» о визуальном намерении перед рендером.\n\nПрактические следствия: Uni-1 заметно сильнее диффузий на сложных композиционных промптах типа «собака на красном диване, спиной к зрителю, в левой трети кадра, через окно виден дождливый город». Но Uni-1 медленнее диффузий (~40–50 секунд для 2K с reasoning) и не оптимальна для high-volume A/B тестов.",
        bullets: [
          "Decoder-only autoregressive, не диффузия",
          "Нативное 2K без апскейла",
          "До 9 референсов с явными ролями",
          "Reasoning по умолчанию (intent_weight на API)",
          "Storyboard режим с консистентностью персонажа",
        ],
      },
      {
        heading: "Структура промпта и шаблоны",
        body:
          "Универсальный «Fast Start» шаблон (закрывает 80% задач): `A [субъект], in [стиль], with [освещением], [камера/композиция], [окружение/фон], mood: [эмоция], details: [ключевые специфики]`.\n\nПример: «A ceramic artist shaping a lopsided bowl, documentary photography style, soft window lighting, close-up shot, cluttered home studio background, mood: focused and quiet, details: clay-covered hands, imperfect texture, tools scattered on wooden table».\n\nUni-1 ждёт связных предложений или явных секций, не tag soup. Модель сильнее реагирует на структурированные промпты с явными секциями (Subject, Style, Lighting, Camera, Mood, Details), чем на сырую прозу. Простые теги через запятую работают хуже, чем в диффузиях.",
      },
      {
        heading: "8 шаблонов Uni-1",
        body:
          "Uni-1 Field Guide определяет 8 шаблонов под разные задачи. Fast Start — для большинства задач, исследования и первых идей. Cinematic Control — структурированный кинематографический брифинг с раздельными блоками Subject/Style/Scene/Camera/Details. Direct Edit — точечное редактирование в режиме Modify с эксплицитным Keep-блоком.\n\nMulti-Reference Fusion — комбинирование 2–9 референсов с ролями (IMAGE 1: use as CHARACTER, IMAGE 2: use for STYLE, IMAGE 3: use as LIGHTING). Layout Control — прямое указание зон (LEFT / CENTER / RIGHT / BACKGROUND) с описанием объектов в каждой. Storyboard Generator — раскадровка с сохранением персонажа через несколько кадров.\n\nLoose / Creative Mode — фрагменты-настроение для ранней идеации («туман, пыль, утро, тишина»). Structured JSON — для разработчиков, формальная структура. Выбор шаблона зависит от задачи: режим важнее тегов.",
      },
      {
        heading: "Reference роли и Keep-блок",
        body:
          "Главная фича Uni-1 — назначение ролей референсам. Возможные роли: CHARACTER, STYLE, LIGHTING, COMPOSITION, OUTFIT, BACKGROUND, POSE. Каждой одну роль — это снижает конфликты между референсами.\n\nПример: «Combine the following: IMAGE 1: use as CHARACTER reference. Preserve their exact facial features, bone structure, skin tone, and age. IMAGE 2: use for STYLE — painterly digital illustration. IMAGE 3: use as LIGHTING reference — soft golden hour. Output: editorial portrait of the character in a city park, mood: contemplative.»\n\nKeep-блок — критичен в режиме Modify. Без явного «Keep: face, identity, pose, lighting» модель дрейфует и меняет то, что не просили. Шаблон Direct Edit: `Edit instructions: Change: [что меняется], Keep: [что должно остаться], Style shift: [опционально], Lighting: [опционально], Details: [специфические правки]`. Это главный приём против drift.",
      },
      {
        heading: "Reasoning и seed как recipe",
        body:
          "Uni-1 — «думающая» модель: сначала строит внутреннюю карту визуального намерения, потом рендерит. На API параметр `intent_weight` управляет глубиной этого рассуждения. Для сложных композиционных промптов оставляй reasoning активным — это даёт лучший результат на пространственных отношениях, мульти-референсных композициях и storyboard-задачах.\n\nДля простых задач reasoning замедляет генерацию по сравнению с диффузией — если важна скорость и задача простая, используй другие модели. Можно посмотреть «логи мыслей» через `/v1/reasoning-logs` (API).\n\nSeed как «recipe»: сохраняй `prompt + seed` вместе — это переиспользуемый рецепт. Workflow «Exploration → Lock → Iterate»: 1) гоняй варианты со случайным seed, 2) после понравившегося результата зафиксируй seed, 3) меняй только текст промпта, оставляя seed. Это даёт контролируемые итерации без потери базовой композиции.",
      },
    ],
    examples: [
      {
        before:
          "ceramic artist, beautiful, detailed studio",
        after:
          "A ceramic artist shaping a lopsided bowl, documentary photography style, soft window lighting, close-up shot, cluttered home studio background, mood: focused and quiet, details: clay-covered hands, imperfect texture, tools scattered on wooden table.",
        note:
          "Fast Start шаблон закрывает 80% задач. Структура: [субъект] + [стиль] + [свет] + [камера/композиция] + [фон] + mood + details. Каждая секция даёт модели опору, на которую она опирается в reasoning-проходе.",
      },
      {
        before:
          "portrait combining 3 references",
        after:
          "Combine the following: IMAGE 1: use as CHARACTER reference. Preserve facial features, bone structure, skin tone. IMAGE 2: use for STYLE — painterly digital illustration with visible brush strokes. IMAGE 3: use as LIGHTING reference — soft golden hour side light. Output: Subject: editorial portrait of the character in a city park during autumn. Style: dominant from IMAGE 2. Composition: rule of thirds, medium close-up. Details: warm autumn palette, soft shadow on the right side.",
        note:
          "Multi-Reference Fusion с явными ролями — главный приём Uni-1 при ≥2 референсах. Конфликт ролей (два IMAGE как CHARACTER) даёт drift. Уникальные роли + блок Output с конкретикой = чистый фьюжн.",
      },
      {
        before:
          "remove the wall behind the subject (Modify)",
        after:
          "Edit instructions: Change: replace the brick wall behind the subject with a soft out-of-focus city skyline at golden hour. Keep: subject's face, identity, pose, clothing, exact lighting on the face, framing. Style shift: documentary photography. Details: warm orange tones in background, slight bokeh, no harsh edges around subject.",
        note:
          "Direct Edit шаблон с эксплицитным Keep — критичен в режиме Modify. Без Keep модель меняет то, что не просили (лицо, позу, свет). Keep-список фиксирует контракт: что трогать, что нет.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup без структуры",
        explain:
          "Uni-1 — не диффузия, она ждёт связных предложений или явных секций. «cat, fluffy, garden, sunny, big eyes, flowers» работает значительно хуже, чем связное описание или Fast Start шаблон с явными секциями (subject, style, lighting, camera, mood, details). Простые теги через запятую не используют сильную сторону Uni-1.",
      },
      {
        title: "Конфликт ролей у референсов",
        explain:
          "Два IMAGE с одинаковой ролью (например, оба назначены как CHARACTER) дают drift — модель не знает, какой из них главный. Назначай уникальные роли каждому референсу: один CHARACTER, другой STYLE, третий LIGHTING. Это снижает конфликты и даёт чистый фьюжн.",
      },
      {
        title: "Отсутствие Keep-блока в Modify",
        explain:
          "В режиме Modify без явного Keep модель может изменить то, что не просили — лицо, позу, свет, окружение. Каждый Modify-промпт должен иметь блок «Keep: [конкретный список того, что не трогать]». Для итеративного редактирования повторяй Keep на каждой итерации.",
      },
      {
        title: "Параметры синтаксиса других моделей",
        explain:
          "Midjourney `--ar`, `::weight`, `(keyword:1.2)` от Stable Diffusion, BREAK не работают в Uni-1 и попадают в текст промпта как мусор. Размеры указывай явно («2K», «portrait», «landscape»), вес слов регулируй порядком и явными ролями референсов, стили — нормальными прилагательными или явной секцией Style.",
      },
      {
        title: "Слишком много стилей одновременно",
        explain:
          "«photorealistic + anime + watercolor» без явного намерения ломает результат. Uni-1 пытается совместить несовместимое и даёт странный гибрид. Если хочешь смесь стилей — назначь их разным референсам (IMAGE 1 STYLE: photorealism, IMAGE 2 STYLE: watercolor texture), либо используй один доминантный стиль с акцентами.",
      },
    ],
    faq: [
      {
        q: "Чем Uni-1 отличается от диффузионных моделей?",
        a: "Uni-1 использует decoder-only autoregressive transformer (не диффузию) — генерирует пиксели последовательно. Это даёт сильное удержание спатиальных отношений, лучшую работу с многореференсными композициями, поддержку storyboard с консистентностью персонажа и встроенный reasoning. Минус — медленнее диффузий (~40–50 сек для 2K). Не оптимальна для high-volume A/B тестов, оптимальна для control-сценариев.",
      },
      {
        q: "Какие роли можно назначать референсам?",
        a: "Доступные роли в Multi-Reference Fusion: CHARACTER (внешность персонажа), STYLE (визуальный стиль), LIGHTING (освещение), COMPOSITION (компоновка), OUTFIT (одежда), BACKGROUND (фон), POSE (поза). Каждому референсу — одну роль. Это снижает конфликты между референсами. Назначение ролей — главная фича Uni-1 при использовании ≥2 референсов, без них модель не знает, какой референс за что отвечает.",
      },
      {
        q: "Что такое Fast Start шаблон?",
        a: "Fast Start — универсальный шаблон Uni-1, закрывающий 80% задач: `A [субъект], in [стиль], with [освещением], [камера/композиция], [окружение/фон], mood: [эмоция], details: [ключевые специфики]`. Связное описание с явными элементами даёт модели опоры для reasoning-прохода. Для более сложных задач есть 7 других шаблонов (Cinematic Control, Direct Edit, Multi-Reference Fusion, Layout Control, Storyboard, Loose Mode, JSON).",
      },
      {
        q: "Поддерживает ли Uni-1 русский язык?",
        a: "Да, Uni-1 сильна в мультиязычности — корректно работает с русским, украинским, китайским и другими языками. Текст в самом изображении тоже можно просить на любом языке, включая кириллицу. Но для production-задач рекомендуется английский — это даёт чуть более стабильные результаты в сложных промптах. Для экспериментов и личных задач русский работает хорошо.",
      },
      {
        q: "Что такое seed как recipe?",
        a: "Seed в Uni-1 — это не просто параметр воспроизводимости, а часть «рецепта». Workflow «Exploration → Lock → Iterate»: 1) гоняй варианты со случайным seed для исследования, 2) после понравившегося результата зафиксируй seed, 3) меняй только текст промпта, оставляя seed. Это даёт контролируемые итерации без потери базовой композиции. Сохраняй `prompt + seed` вместе — это переиспользуемый рецепт для серии работ.",
      },
      {
        q: "Что такое intent_weight на API?",
        a: "`intent_weight` — параметр на API Uni-1, управляющий глубиной reasoning-прохода модели перед рендером. Выше значение = больше времени на «думание» о визуальном намерении, лучше результат на сложных композициях. Ниже = быстрее, но менее проработанная композиция. Для простых задач можно снижать; для пространственно сложных промптов и multi-reference — оставлять default или повышать. Также есть `/v1/reasoning-logs` для просмотра «логов мыслей».",
      },
      {
        q: "Поддерживает ли Opten Luma Uni-1?",
        a: "Да, расширение Opten автоматически распознаёт Uni-1 и оценивает промпты по специфике этой модели. Проверяет использование одного из 8 шаблонов, правильное назначение ролей референсам (без конфликтов), наличие Keep-блока в Modify, отсутствие синтаксиса Midjourney/SD, осмысленное использование reasoning. Одним кликом получаешь rewrite под выбранный шаблон Uni-1.",
      },
    ],
  },
  en: {
    title: "Luma Uni-1 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Luma Uni-1: 8 templates, multi-reference fusion with roles, Generate/Modify modes, reasoning + intent_weight, seed as recipe, examples.",
    h1: "Luma Uni-1: how to write prompts the model actually understands",
    intro:
      "Luma Uni-1 is a Luma Labs image model with a unique architecture: decoder-only autoregressive transformer (NOT diffusion), generating pixels sequentially. Native 2K resolution, reasoning on by default (the model «thinks» about composition before rendering), up to 9 references with explicit roles (CHARACTER, STYLE, LIGHTING, etc.), strong multilingual support. Available via Luma Labs and REST API.",
    sections: [
      {
        heading: "What sets Uni-1 apart",
        body:
          "Uni-1 is not a diffusion model. The decoder-only autoregressive transformer architecture generates pixels sequentially, which gives it unique advantages: strong spatial-relationship retention, better behavior on multi-reference composites, support for storyboards with character consistency, and built-in reasoning that «thinks» about visual intent before rendering.\n\nPractical consequences: Uni-1 is noticeably stronger than diffusion on complex composite prompts like «a dog on a red couch, back to viewer, in the left third of the frame, with a rainy city visible through the window». But Uni-1 is slower than diffusion (~40–50 seconds for 2K with reasoning) and not optimal for high-volume A/B tests.",
        bullets: [
          "Decoder-only autoregressive, not diffusion",
          "Native 2K without upscale",
          "Up to 9 references with explicit roles",
          "Reasoning on by default (intent_weight on the API)",
          "Storyboard mode with character consistency",
        ],
      },
      {
        heading: "Prompt structure and templates",
        body:
          "Universal Fast Start template (covers 80% of tasks): `A [subject], in [style], with [lighting], [camera/composition], [environment/background], mood: [emotion], details: [key specifics]`.\n\nExample: «A ceramic artist shaping a lopsided bowl, documentary photography style, soft window lighting, close-up shot, cluttered home studio background, mood: focused and quiet, details: clay-covered hands, imperfect texture, tools scattered on wooden table».\n\nUni-1 expects coherent sentences or explicit sections, not tag soup. The model responds more strongly to structured prompts with explicit sections (Subject, Style, Lighting, Camera, Mood, Details) than to raw prose. Simple comma-separated tags work worse here than they do in diffusion models.",
      },
      {
        heading: "Uni-1's 8 templates",
        body:
          "The Uni-1 Field Guide defines 8 templates for different tasks. Fast Start — for most tasks, exploration, and first ideas. Cinematic Control — structured cinematic brief with separate Subject/Style/Scene/Camera/Details blocks. Direct Edit — surgical editing in Modify mode with an explicit Keep block.\n\nMulti-Reference Fusion — combining 2–9 references with roles (IMAGE 1: use as CHARACTER, IMAGE 2: use for STYLE, IMAGE 3: use as LIGHTING). Layout Control — direct zone specification (LEFT / CENTER / RIGHT / BACKGROUND) with objects in each. Storyboard Generator — storyboard with character consistency across multiple frames.\n\nLoose / Creative Mode — vibe fragments for early ideation («fog, dust, morning, silence»). Structured JSON — for developers, formal structure. Template choice depends on the task: mode beats tags.",
      },
      {
        heading: "Reference roles and the Keep block",
        body:
          "Uni-1's headline feature is assigning roles to references. Available roles: CHARACTER, STYLE, LIGHTING, COMPOSITION, OUTFIT, BACKGROUND, POSE. One role per reference — this reduces conflict between references.\n\nExample: «Combine the following: IMAGE 1: use as CHARACTER reference. Preserve their exact facial features, bone structure, skin tone, and age. IMAGE 2: use for STYLE — painterly digital illustration. IMAGE 3: use as LIGHTING reference — soft golden hour. Output: editorial portrait of the character in a city park, mood: contemplative.»\n\nThe Keep block is critical in Modify mode. Without an explicit «Keep: face, identity, pose, lighting» the model drifts and changes things you didn't ask for. The Direct Edit template: `Edit instructions: Change: [what changes], Keep: [what stays], Style shift: [optional], Lighting: [optional], Details: [specific edits]`. This is the main weapon against drift.",
      },
      {
        heading: "Reasoning and seed as recipe",
        body:
          "Uni-1 is a «thinking» model: it first builds an internal map of visual intent, then renders. On the API, `intent_weight` controls the depth of that reasoning. For complex composite prompts leave reasoning active — it gives the best result on spatial relationships, multi-reference composites, and storyboard tasks.\n\nFor simple tasks reasoning slows generation compared to diffusion — if speed matters and the task is simple, use other models. You can inspect the «thinking logs» via `/v1/reasoning-logs` (API).\n\nSeed as «recipe»: save `prompt + seed` together — it's a reusable recipe. The «Exploration → Lock → Iterate» workflow: 1) cycle variants with random seed, 2) lock the seed once you like a result, 3) change only the prompt text while keeping the seed. This gives controlled iteration without losing the base composition.",
      },
    ],
    examples: [
      {
        before:
          "ceramic artist, beautiful, detailed studio",
        after:
          "A ceramic artist shaping a lopsided bowl, documentary photography style, soft window lighting, close-up shot, cluttered home studio background, mood: focused and quiet, details: clay-covered hands, imperfect texture, tools scattered on wooden table.",
        note:
          "The Fast Start template covers 80% of tasks. Structure: [subject] + [style] + [light] + [camera/composition] + [background] + mood + details. Each section gives the model an anchor for its reasoning pass.",
      },
      {
        before:
          "portrait combining 3 references",
        after:
          "Combine the following: IMAGE 1: use as CHARACTER reference. Preserve facial features, bone structure, skin tone. IMAGE 2: use for STYLE — painterly digital illustration with visible brush strokes. IMAGE 3: use as LIGHTING reference — soft golden hour side light. Output: Subject: editorial portrait of the character in a city park during autumn. Style: dominant from IMAGE 2. Composition: rule of thirds, medium close-up. Details: warm autumn palette, soft shadow on the right side.",
        note:
          "Multi-Reference Fusion with explicit roles is Uni-1's main technique with ≥2 references. Role conflict (two IMAGEs as CHARACTER) causes drift. Unique roles plus an Output block with specifics produces a clean fusion.",
      },
      {
        before:
          "remove the wall behind the subject (Modify)",
        after:
          "Edit instructions: Change: replace the brick wall behind the subject with a soft out-of-focus city skyline at golden hour. Keep: subject's face, identity, pose, clothing, exact lighting on the face, framing. Style shift: documentary photography. Details: warm orange tones in background, slight bokeh, no harsh edges around subject.",
        note:
          "The Direct Edit template with an explicit Keep is critical in Modify. Without Keep the model changes things you didn't ask for (face, pose, lighting). The Keep list locks the contract: what to touch, what to leave alone.",
      },
    ],
    mistakes: [
      {
        title: "Tag soup without structure",
        explain:
          "Uni-1 is not diffusion — it expects coherent sentences or explicit sections. «cat, fluffy, garden, sunny, big eyes, flowers» works significantly worse than a coherent description or a Fast Start template with explicit sections (subject, style, lighting, camera, mood, details). Plain comma tags don't tap into Uni-1's strengths.",
      },
      {
        title: "Role conflicts between references",
        explain:
          "Two IMAGEs with the same role (e.g. both assigned as CHARACTER) cause drift — the model doesn't know which is primary. Assign unique roles to each reference: one CHARACTER, another STYLE, a third LIGHTING. This reduces conflicts and produces clean fusion.",
      },
      {
        title: "Missing Keep block in Modify",
        explain:
          "In Modify mode without an explicit Keep, the model may change things you didn't ask for — face, pose, lighting, surroundings. Every Modify prompt should have a «Keep: [concrete list of things to preserve]» block. For iterative edits, repeat the Keep on every turn.",
      },
      {
        title: "Other models' parameter syntax",
        explain:
          "Midjourney `--ar`, Stable Diffusion `::weight`, `(keyword:1.2)`, BREAK don't work in Uni-1 and end up as literal noise in the prompt. Set dimensions explicitly («2K», «portrait», «landscape»), weight words via order and explicit reference roles, set style via normal adjectives or an explicit Style section.",
      },
      {
        title: "Too many styles at once",
        explain:
          "«photorealistic + anime + watercolor» without explicit intent breaks the result. Uni-1 tries to combine incompatible directions and produces a strange hybrid. If you want a style mix — assign them to different references (IMAGE 1 STYLE: photorealism, IMAGE 2 STYLE: watercolor texture) or use one dominant style with accents.",
      },
    ],
    faq: [
      {
        q: "How is Uni-1 different from diffusion models?",
        a: "Uni-1 uses a decoder-only autoregressive transformer (not diffusion) — generating pixels sequentially. This gives strong spatial-relationship retention, better multi-reference composition behavior, storyboard support with character consistency, and built-in reasoning. Downside — slower than diffusion (~40–50 seconds for 2K). Not optimal for high-volume A/B testing; optimal for control-heavy scenarios.",
      },
      {
        q: "Which roles can I assign to references?",
        a: "Available roles in Multi-Reference Fusion: CHARACTER (appearance), STYLE (visual style), LIGHTING (lighting), COMPOSITION (layout), OUTFIT (clothing), BACKGROUND (background), POSE (pose). One role per reference. This reduces conflict between references. Role assignment is Uni-1's main technique when using ≥2 references — without roles the model doesn't know which reference is responsible for what.",
      },
      {
        q: "What is the Fast Start template?",
        a: "Fast Start is Uni-1's universal template that covers 80% of tasks: `A [subject], in [style], with [lighting], [camera/composition], [environment/background], mood: [emotion], details: [key specifics]`. A coherent description with explicit elements gives the model anchors for the reasoning pass. For more complex tasks there are 7 other templates (Cinematic Control, Direct Edit, Multi-Reference Fusion, Layout Control, Storyboard, Loose Mode, JSON).",
      },
      {
        q: "Does Uni-1 support languages other than English?",
        a: "Yes, Uni-1 is strong at multilingual — works correctly with Russian, Ukrainian, Chinese, and others. In-image text can also be requested in any language, including Cyrillic. But for production prompts English is recommended — it gives slightly more stable results on complex prompts. For experiments and personal tasks other languages work well.",
      },
      {
        q: "What is seed as recipe?",
        a: "In Uni-1 the seed is not just a reproducibility parameter — it's part of the «recipe». The «Exploration → Lock → Iterate» workflow: 1) cycle variants with random seed for exploration, 2) lock the seed once you like a result, 3) change only the prompt text while keeping the seed. This gives controlled iteration without losing the base composition. Save `prompt + seed` together — it's a reusable recipe for a series.",
      },
      {
        q: "What is intent_weight on the API?",
        a: "`intent_weight` is a Uni-1 API parameter that controls the depth of the model's reasoning pass before rendering. Higher value = more time «thinking» about visual intent, better results on complex composites. Lower = faster but less worked-out composition. For simple tasks you can lower it; for spatially complex prompts and multi-reference keep it default or raise it. The API also exposes `/v1/reasoning-logs` to inspect the «thinking logs».",
      },
      {
        q: "Does Opten support Luma Uni-1?",
        a: "Yes, the Opten extension auto-detects Uni-1 and scores prompts against this model's specifics. It checks for use of one of the 8 templates, correct reference role assignment (no conflicts), presence of a Keep block in Modify, absence of Midjourney/SD syntax, and meaningful use of reasoning. One click gives you a rewrite targeted at the chosen Uni-1 template.",
      },
    ],
  },
};
