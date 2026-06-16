import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-06-11";

const COVER_RU = {
  src: "/blog/flux-2-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про Flux 2 промпты для генерации изображений",
};
const COVER_EN = {
  src: "/blog/flux-2-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for a Flux 2 prompt guide for AI image generation",
};

const ru: BlogPostLocale = {
  slug: "flux-2-prompts",
  title: "Промпты для Flux 2: структура точных изображений",
  excerpt:
    "Промпты для Flux 2 работают лучше, когда вы выбираете вариант модели заранее: Klein для быстрых тестов, Pro или Max для финального кадра.",
  description:
    "Гайд по промптам для Flux 2: как выбрать Klein, Pro или Max, собрать prompt для портрета и исправить пластиковую кожу через свет, линзу и texture.",
  category: "guide",
  tags: ["release-notes", "model-deep-dive", "ai-image-gen", "prompt-engineering"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "negative-prompt", "gpt-image-2"],
  body: {
    intro:
      "Промпты для Flux 2 работают как короткий арт-дирекшн для модели Black Forest Labs: сначала выбор варианта, затем сцена, объект, свет, камера, материал и запреты. В обзоре Flux 2 легко уйти в названия Max, Pro, Dev и Klein, но качество чаще ломается из-за слабой структуры prompt.",
    steps: [
      {
        title: "Сначала выберите вариант Flux 2",
        body:
          "У Flux 2 несколько разных режимов работы, и prompt лучше писать под задачу, а не под красивое название. Flux 2 max и flux 2 pro подходят для финальных кадров, где важны фотореализм, редактирование и стабильность деталей. Flux 2 dev полезен, когда нужен open-weight workflow. Flux 2 klein 9B и flux 2 klein 4B нужны для быстрых тестов, локального прототипирования и latency-sensitive задач.\n\nПрактическое правило: не начинайте production с самого дорогого или самого тяжелого варианта. Сначала проверьте композицию и логику на klein или dev, затем переносите очищенный prompt в pro или max. Так вы тратите финальный рендер на уже собранный бриф, а не на выяснение, где забыли свет, материал или ограничения.",
        before:
          "Flux 2, сделай красивый портрет, реализм, высокое качество.",
        after:
          "Model choice: draft on Flux 2 klein 9B, final render on Flux 2 pro.\nGoal: editorial studio portrait for a campaign key visual.\nQuality target: natural skin, controlled lighting, no plastic texture.\nConstraints: keep face realistic, no glossy AI render look, no extra accessories.",
        imageSrc: "/blog/flux-2-prompts/ru/step-3.jpg",
      },
      {
        title: "Соберите prompt из пяти блоков",
        body:
          "Промпт для Flux 2 лучше держать не как поток тегов, а как короткий производственный бриф. Рабочий порядок: `Scene` -> `Subject` -> `Lighting` -> `Camera` -> `Material / texture` -> `Constraints`. Если первый абзац состоит из `cinematic, detailed, beautiful`, модель получает настроение, но не получает постановку.\n\nПримеры для Flux 2 особенно хорошо работают, когда в начале есть назначение кадра: campaign portrait, product hero shot, editorial still, catalog image, concept frame. Назначение помогает модели выбрать визуальный режим. Opten можно использовать как генератор и preflight-редактор промпта: он разворачивает сырую идею в блоки и показывает, где отсутствует камера, материал или запрет.",
        before:
          "Flux 2: красивый портрет мужчины, студия, реализм, high detail.",
        after:
          "Purpose: editorial studio portrait for a premium skincare campaign.\nScene: dark graphite studio, neutral background, subtle lime rim light.\nSubject: man in a black turtleneck, three-quarter view, calm expression.\nLighting: large softbox from front-left, weak rim light from back-right.\nCamera: 85mm lens, eye-level, shallow depth of field.\nMaterial / texture: visible pores, matte skin, natural imperfections.\nConstraints: no plastic skin, no waxy shine, no extra jewelry, no random text.",
        imageSrc: "/blog/flux-2-prompts/ru/step-1.jpg",
      },
      {
        title: "Исправляйте портрет не словом realistic, а деталями",
        body:
          "Самая частая ошибка: портрет выглядит пластмассовым, и автор добавляет `more realistic`. Обычно это почти ничего не меняет. Модель не знает, что именно сломано: материал кожи, линза, свет, постобработка или запреты. Поэтому исправление должно назвать конкретную ось.\n\nКейс: первый render в Flux 2 дал аккуратное лицо, но кожа стала глянцевой, как 3D-пластик. Рабочая правка была не `make it better`, а набор ограничений: `matte skin`, `visible pores`, `subtle skin texture`, `soft directional light`, `85mm portrait lens`, `no waxy surface`. После этого кадр остался чистым, но лицо стало ближе к редакционной фотографии.",
        before:
          "Make the portrait more realistic, high quality, cinematic.",
        after:
          "Change only skin rendering and lighting.\nPreserve: face shape, pose, black outfit, dark studio background, camera angle.\nAdd: matte skin, visible pores, subtle under-eye texture, soft directional light, 85mm portrait lens.\nConstraints: no waxy shine, no plastic surface, no beauty-filter blur, no extra accessories.",
        imageSrc: "/blog/flux-2-prompts/ru/step-2.jpg",
      },
      {
        title: "Добавьте constraints как защиту от артефактов",
        body:
          "Flux 2.0 сильнее старых image-моделей в контроле и редактировании, но длинная сцена все равно может додумать лишнее: случайный текст, лишние украшения, слишком глянцевую кожу, неправильную перспективу, перепутанный материал. Negative prompt в стиле `bad quality, ugly` слабее, чем короткий список конкретных запретов.\n\nДля портрета запреты одни: no plastic skin, no waxy shine, no extra jewelry, no warped eyes. Для product shot другие: no logo drift, no wrong material, no extra packaging, no random text. Для fashion-кадра добавьте preserve-строку: лицо, поза, одежда, силуэт, свет и дистанция до камеры не меняются.",
        before:
          "Не делай ошибок, сделай красиво и профессионально.",
        after:
          "Constraints: no random text, no watermark, no extra accessories, no plastic skin, no waxy shine, no distorted hands, no logo drift, no material change.\nPreserve: face, pose, outfit silhouette, camera angle, background, lighting direction.",
        imageSrc: "/blog/flux-2-prompts/ru/step-4.jpg",
      },
      {
        title: "Итерируйте по одной оси",
        body:
          "В production с Flux 2 работает простой цикл: черновик, тест, одна правка. Не стоит одновременно менять свет, фон, позу, одежду и линзу. Если результат улучшился, вы не поймете, что сработало. Если ухудшился, не поймете, что сломало кадр.\n\nЛучший цикл: сначала зафиксируйте сцену и объект, затем отдельно проверьте свет, отдельно материал, отдельно камеру, отдельно constraints. Так примеры для Flux 2 становятся переносимыми: вы сохраняете работающий prompt skeleton и меняете только subject, style или платформенные параметры. Это быстрее, чем каждый раз просить модель «сделать лучше».",
        before:
          "Make it better: change background, improve skin, add cinematic lighting, different pose, better camera.",
        after:
          "Iteration 1: keep everything, make lighting softer.\nIteration 2: keep lighting, add matte skin and visible pores.\nIteration 3: keep face and pose, change only background to dark graphite.\nIteration 4: keep composition, remove random text and extra accessories.",
        imageSrc: "/blog/flux-2-prompts/ru/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "Что такое Flux 2?",
        a: "Flux 2 — второе поколение image-моделей Black Forest Labs для генерации и редактирования изображений. В практическом prompt workflow важны не только названия max, pro, dev и klein, а то, как вы задаете сцену, объект, свет, камеру и ограничения.",
      },
      {
        q: "Чем Flux 2 Klein отличается от Flux 2 Pro?",
        a: "Flux 2 klein 4B и 9B рассчитаны на быстрые и более легкие сценарии, в том числе локальные тесты и прототипы. Flux 2 pro лучше использовать для финального production-кадра, когда важны качество, скорость и стабильность результата.",
      },
      {
        q: "Что писать в генераторе промптов для Flux 2?",
        a: "Пишите не один теговый запрос, а блоки: Purpose, Scene, Subject, Lighting, Camera, Material / texture и Constraints. Так генератор получает структуру, а не просто набор слов вроде `cinematic` и `high detail`.",
      },
      {
        q: "Можно ли скачать Flux 2?",
        a: "Открытые веса доступны не для всех вариантов. Для локальных сценариев смотрите Flux 2 dev и Flux 2 klein в официальных источниках Black Forest Labs или Hugging Face. Max и pro обычно используются через hosted/API-доступ.",
      },
      {
        q: "Почему Flux 2 делает пластиковые портреты?",
        a: "Чаще всего prompt не задал материал кожи, линзу, свет и запреты. Добавьте `matte skin`, `visible pores`, `soft directional light`, конкретную линзу и ограничения вроде `no waxy shine` и `no beauty-filter blur`.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "flux-2-prompts",
  title: "Flux 2 prompts: structure for precise AI images",
  excerpt:
    "flux 2 prompts work best when model choice comes first: flux 2 klein for quick tests, flux 2 pro or max for final campaign images with fewer failed renders.",
  description:
    "Flux 2 prompts guide: choose flux 2 klein, pro, dev or max, write stronger portrait prompts, and fix plastic skin with lighting, lens, texture, and constraints.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "flux 2 is Black Forest Labs' second-generation image model family, and strong flux 2 prompts read like compact art direction: model choice, scene, subject, lighting, camera, material, and constraints. The search phrase flux 2.0 usually points to the same practical need: cleaner prompt structure before spending a final render.",
    steps: [
      {
        title: "Choose the Flux 2 variant first",
        body:
          "A Flux 2 prompt should start from the job, not from the most impressive model name. Flux 2 max and flux 2 pro are the obvious candidates for final images where photorealism, editing quality, and stable detail matter. Flux 2 dev is the open-weight lane for deployable workflows. Flux 2 klein 9B and flux 2 klein 4B are better for fast tests, local prototyping, and latency-sensitive tools.\n\nThe practical workflow is simple: draft composition and prompt logic on klein or dev, then move the cleaned prompt to pro or max for the final pass. That way the expensive render is solving the image, not discovering that the prompt forgot lighting, material, or constraints.",
        before:
          "Flux 2, make a beautiful portrait, realistic, high quality.",
        after:
          "Model choice: draft on Flux 2 klein 9B, final render on Flux 2 pro.\nGoal: editorial studio portrait for a campaign key visual.\nQuality target: natural skin, controlled lighting, no plastic texture.\nConstraints: keep face realistic, no glossy AI render look, no extra accessories.",
        imageSrc: "/blog/flux-2-prompts/en/step-3.jpg",
      },
      {
        title: "Build the prompt from five blocks",
        body:
          "The safest Flux 2 prompt structure is a short production brief, not a tag stream. Use this order: `Scene` -> `Subject` -> `Lighting` -> `Camera` -> `Material / texture` -> `Constraints`. If the first line is only `cinematic, detailed, beautiful`, the model receives mood without blocking.\n\nGood flux 2 examples usually declare the image purpose early: campaign portrait, product hero shot, editorial still, catalog image, concept frame. Purpose gives the model a visual mode. Opten can act as the prompt preflight here: it expands a rough idea into blocks and catches missing camera, material, or constraint fields before you render.",
        before:
          "Flux 2 prompt generator: beautiful portrait of a man, studio, realistic, high detail.",
        after:
          "Purpose: editorial studio portrait for a premium skincare campaign.\nScene: dark graphite studio, neutral background, subtle lime rim light.\nSubject: man in a black turtleneck, three-quarter view, calm expression.\nLighting: large softbox from front-left, weak rim light from back-right.\nCamera: 85mm lens, eye-level, shallow depth of field.\nMaterial / texture: visible pores, matte skin, natural imperfections.\nConstraints: no plastic skin, no waxy shine, no extra jewelry, no random text.",
        imageSrc: "/blog/flux-2-prompts/en/step-1.jpg",
      },
      {
        title: "Fix portraits with details, not `realistic`",
        body:
          "The common failure case is a portrait that looks clean but plastic. Adding `more realistic` rarely fixes it because the model does not know which axis failed: skin material, lens, light, retouching, or negative constraints. Name the broken axis.\n\nPractical case: the first Flux 2 render produced a neat face, but the skin looked glossy, almost like a 3D surface. The useful edit was not `make it better`; it was a specific constraint set: `matte skin`, `visible pores`, `subtle skin texture`, `soft directional light`, `85mm portrait lens`, `no waxy surface`. The frame stayed polished, but the face moved closer to editorial photography.",
        before:
          "Make the portrait more realistic, high quality, cinematic.",
        after:
          "Change only skin rendering and lighting.\nPreserve: face shape, pose, black outfit, dark studio background, camera angle.\nAdd: matte skin, visible pores, subtle under-eye texture, soft directional light, 85mm portrait lens.\nConstraints: no waxy shine, no plastic surface, no beauty-filter blur, no extra accessories.",
        imageSrc: "/blog/flux-2-prompts/en/step-2.jpg",
      },
      {
        title: "Use constraints as artifact insurance",
        body:
          "Flux 2.0 is stronger than older image models at control and editing, but complex prompts can still invent the wrong details: random text, extra jewelry, glossy skin, bad perspective, or material drift. A vague negative prompt like `bad quality, ugly` is weaker than a short list of actual failure modes.\n\nFor portraits, constrain skin and anatomy: no plastic skin, no waxy shine, no extra jewelry, no warped eyes. For product shots, constrain brand and material: no logo drift, no wrong material, no extra packaging, no random text. For fashion, add a preserve line for face, pose, outfit, silhouette, lighting, and camera distance.",
        before:
          "Don't make mistakes, make it beautiful and professional.",
        after:
          "Constraints: no random text, no watermark, no extra accessories, no plastic skin, no waxy shine, no distorted hands, no logo drift, no material change.\nPreserve: face, pose, outfit silhouette, camera angle, background, lighting direction.",
        imageSrc: "/blog/flux-2-prompts/en/step-4.jpg",
      },
      {
        title: "Iterate on one axis at a time",
        body:
          "A reliable Flux 2 production workflow is draft, test, one edit. Do not change lighting, background, pose, outfit, and lens in the same pass. If the result improves, you won't know what worked. If it gets worse, you won't know what broke the image.\n\nUse a tighter loop: lock scene and subject first, then test lighting, then material, then camera, then constraints. This makes your flux 2 examples reusable: the prompt skeleton survives, while subject, style, or platform settings change. It is much faster than asking the model to `make it better` after every render.",
        before:
          "Make it better: change background, improve skin, add cinematic lighting, different pose, better camera.",
        after:
          "Iteration 1: keep everything, make lighting softer.\nIteration 2: keep lighting, add matte skin and visible pores.\nIteration 3: keep face and pose, change only background to dark graphite.\nIteration 4: keep composition, remove random text and extra accessories.",
        imageSrc: "/blog/flux-2-prompts/en/step-5.jpg",
      },
    ],
    faq: [
      {
        q: "What is flux 2?",
        a: "Flux 2 is Black Forest Labs' second-generation image model family for generation and editing. For prompt writers, the useful question is not only max versus pro versus dev versus klein, but how clearly the prompt defines scene, subject, light, camera, material, and constraints.",
      },
      {
        q: "What is flux 2 klein?",
        a: "Flux 2 klein is the smaller, faster Flux 2 line, including 4B and 9B variants. Use it for drafts, local tests, and latency-sensitive workflows before moving a polished prompt to pro or max for the final image.",
      },
      {
        q: "When should I use flux 2 pro?",
        a: "Use flux 2 pro when you need a final production image with higher quality and stronger detail stability than a quick draft. Draft the prompt cheaply first, then use pro once composition, lighting, and constraints are clear.",
      },
      {
        q: "Is flux 2.0 different from Flux 2?",
        a: "In search behavior, flux 2.0 usually refers to the same second-generation Flux 2 family. Keep the model name exact in your prompt or UI notes, but solve the real problem with structure: scene, subject, lighting, camera, texture, constraints.",
      },
      {
        q: "How do I stop Flux 2 from making plastic skin?",
        a: "Specify the material and lighting instead of writing `more realistic`. Add `matte skin`, `visible pores`, `soft directional light`, an actual portrait lens, and constraints such as `no waxy shine` and `no beauty-filter blur`.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
