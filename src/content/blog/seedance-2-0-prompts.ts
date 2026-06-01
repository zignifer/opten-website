import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-06-01";

const COVER_RU = {
  src: "/blog/seedance-2-0-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка статьи про Seedance 2.0 промпты для видео-сцен",
};
const COVER_EN = {
  src: "/blog/seedance-2-0-prompts/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for Seedance 2.0 prompts and video scene structure",
};

const ru: BlogPostLocale = {
  slug: "seedance-2-0-prompts",
  title: "Seedance 2.0 промпты: структура видео-сцены без дрейфа",
  excerpt:
    "Seedance 2.0 промпты работают лучше, когда сцена разбита на блоки. Разбираем промпты для Seedance 2.0, тайминг и ограничения.",
  description:
    "Seedance 2.0 промпты: как описывать сцену, движение, объект и ограничения, чтобы видео не теряло бренд и камеру.",
  category: "news",
  tags: ["release-notes", "model-deep-dive", "ai-video-gen"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["prompt-structure", "negative-prompt", "image-to-video"],
  body: {
    intro:
      "Seedance 2.0 промпты — это не список красивых слов, а короткий режиссерский бриф для AI video: сцена, объект, движение камеры, тайминг, звук и ограничения. Модель сильна в мультимодальных сценах, но без структуры легко теряет брендовый объект, меняет композицию или смешивает действия.",
    steps: [
      {
        title: "Начните со сцены, а не с эффекта",
        body:
          "Для Seedance 2.0 обзор возможностей быстро уводит в звук, референсы и длинные ролики, но рабочий сиданс 2.0 промпт начинается проще: где происходит сцена, что в кадре главное, как камера это видит. Если первым поставить стиль вроде `cinematic, dramatic, high detail`, модель получит настроение, но не получит постановку.\n\nПрактичный порядок: `Scene` -> `Subject` -> `Action` -> `Camera` -> `Lighting` -> `Audio` -> `Constraints`. На syntx.ai и в большинстве API-оберток английский prompt обычно стабильнее, поэтому даже русскую задачу полезно превращать в английский блок. Opten здесь работает как preflight: разворачивает короткую идею в структуру и показывает, где забыты камера, объект или запреты.",
        before:
          "Seedance 2.0, сделай красивое видео продукта в городе, cinematic.",
        after:
          "Scene: rainy night street with wet asphalt and neon reflections.\nSubject: matte black smart speaker on a glass table, centered and recognizable.\nAction: light turns on, the speaker rotates 20 degrees, raindrops move in the background.\nCamera: slow push-in, eye-level, 50mm product shot.\nLighting: cool neon rim light, soft top reflection.\nAudio: diegetic rain and low electric hum only.\nConstraints: no logo drift, no extra products, no text, no watermark.",
        imageSrc: "/blog/seedance-2-0-prompts/ru/step-1.jpg",
      },
      {
        title: "Зафиксируйте объект и движение в одной строке",
        body:
          "Главная ошибка в промпты для Seedance 2.0 — описывать движение отдельно от объекта. Тогда модель может красиво провести камеру, но по дороге заменить форму товара, цвет корпуса или детали упаковки. Для product-сцен и персонажей нужна строка continuity: что именно должно оставаться неизменным от первого кадра до последнего.\n\nКейс: первый рендер сцены с бутылкой спортивного напитка выглядел динамично, но бутылка во втором шоте стала другой: крышка изменилась, этикетка исчезла, корпус стал шире. Исправление было не в `more realistic`, а в точном preserve-блоке: `preserve the same bottle silhouette, cap shape, label placement, matte material, and color palette through every frame`. После этого движение камеры осталось, а объект перестал распадаться.",
        before:
          "A branded bottle slides across a studio table, fast camera move, premium ad look.",
        after:
          "Subject continuity: preserve the same bottle silhouette, cap shape, label placement, matte material, and color palette through every frame. Motion: bottle slides 30 cm left to right while camera tracks parallel at table height. Constraints: no redesign, no label drift, no extra objects.",
        imageSrc: "/blog/seedance-2-0-prompts/ru/step-2.jpg",
      },
      {
        title: "Разбейте 15 секунд на понятные акты",
        body:
          "Готовые промпты для Seedance 2.0 почти всегда выигрывают, если в них есть тайминг. Для 4-6 секунд достаточно одного действия. Для 8-10 секунд лучше два beat'а. Для 12-15 секунд нужен storyboard: что происходит в начале, где поворот, чем заканчивается сцена.\n\nНе пытайтесь упаковать три действия в одну секунду. Модель может дорисовать переход, но зритель увидит скачок. Нормальный темп: 0-4с setup, 4-10с развитие, 10-15с payoff. В каждом акте повторяйте камеру и состояние объекта, если они критичны. Это особенно важно для промптов с несколькими референсами, где сцена должна держать один продукт, одного персонажа или одну локацию.",
        before:
          "15-second product video: speaker activates, city changes, camera flies around, logo appears, rain stops.",
        after:
          "0-4s: close product shot, speaker light slowly turns on, camera pushes in.\n4-10s: side tracking shot, rain reflections move across the glass table, product stays centered.\n10-15s: camera settles into a locked hero frame, light pulse fades, rain ambience continues.\nConstraints: no text, no logo drift, no shape changes, diegetic sound only.",
        imageSrc: "/blog/seedance-2-0-prompts/ru/step-3.jpg",
      },
      {
        title: "Добавьте запреты как production-страховку",
        body:
          "Seedance 2.0 ai хорошо понимает позитивное описание, но сложные сцены все равно требуют negative constraints. Запрещайте не абстрактное «плохое качество», а конкретные провалы: logo drift, extra products, sudden camera jump, warped hands, plastic skin, unwanted subtitles, random text.\n\nЕсли работаете через seedance 2.0 api или сервис, где есть отдельное поле negative prompt, вынесите туда артефакты и водяные знаки. Если отдельного поля нет, оставьте `Constraints` в конце основного prompt. Важно не перегружать: 5-8 точных запретов работают лучше, чем длинная стена из всех возможных дефектов.",
        before:
          "Make it realistic and don't make mistakes.",
        after:
          "Constraints: no logo drift, no product redesign, no extra objects, no sudden camera jump, no subtitles, no random text, no watermark, no glossy AI render look.",
        imageSrc: "/blog/seedance-2-0-prompts/ru/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "Что такое Seedance 2.0 промпты?",
        a: "Это структурированные инструкции для видео-модели ByteDance: сцена, главный объект, действие, камера, свет, звук, тайминг и ограничения. Чем точнее эти блоки, тем меньше модель додумывает и тем стабильнее держит объект между кадрами.",
      },
      {
        q: "Как писать промпты для Seedance 2.0 на русском?",
        a: "Задачу можно формулировать по-русски, но финальный prompt для production лучше собирать на английском: модель и многие платформы стабильнее понимают camera, lighting, timing и constraints. Русский текст оставляйте для черновика, английский блок — для генерации.",
      },
      {
        q: "Где взять готовые промпты для Seedance 2.0?",
        a: "Лучше брать не готовый текст целиком, а шаблон: Scene -> Subject -> Action -> Camera -> Lighting -> Audio -> Constraints. Подставьте свою сцену и обязательно добавьте preserve-строку для продукта, персонажа или локации.",
      },
      {
        q: "Seedance 2.0 api требует другой промпт?",
        a: "Смысловая структура та же. Разница в том, что API или провайдер может отдельно задавать duration, aspect ratio, reference files и negative prompt. Не дублируйте технические параметры в тексте, если они уже есть отдельными полями.",
      },
      {
        q: "Почему Seedance 2.0 меняет объект в середине видео?",
        a: "Обычно prompt описал движение, но не зафиксировал subject continuity. Добавьте строку с тем, что нельзя менять: silhouette, material, color palette, label placement, camera relation. Для товара это важнее, чем очередное слово `cinematic`.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "seedance-2-0-prompts",
  title: "Seedance 2.0 prompts: build video scenes without drift",
  excerpt:
    "seedance 2.0 prompts work best as scene blocks. Use this seedance 2.0 ai workflow for subject continuity, timing, and constraints.",
  description:
    "Seedance 2.0 prompts guide: structure scene, motion, subject continuity, timing, and constraints for cleaner AI video output.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "seedance 2.0 is a multimodal AI video model, but good seedance 2.0 prompts still behave like short director briefs: scene, subject, camera motion, timing, audio, and constraints. The model can handle complex references, but without structure it may change the product, drift the camera, or merge actions.",
    steps: [
      {
        title: "Start with the scene, not the effect",
        body:
          "The release story around Seedance 2.0 is tempting: audio, references, longer clips, complex motion. But a working prompt starts with simpler production logic: where the scene happens, what the main subject is, and how the camera sees it. If the first line is only `cinematic, dramatic, high detail`, the model gets mood without blocking.\n\nUse this order: `Scene` -> `Subject` -> `Action` -> `Camera` -> `Lighting` -> `Audio` -> `Constraints`. On syntx.ai and most seedance 2.0 ai wrappers, English tends to be the stable production language, even if your brief starts in another language. Opten works as a prompt preflight here: it expands the rough idea and catches missing camera, subject, or constraint fields before you spend a render.",
        before:
          "Seedance 2.0, make a beautiful product video in a city, cinematic.",
        after:
          "Scene: rainy night street with wet asphalt and neon reflections.\nSubject: matte black smart speaker on a glass table, centered and recognizable.\nAction: light turns on, the speaker rotates 20 degrees, raindrops move in the background.\nCamera: slow push-in, eye-level, 50mm product shot.\nLighting: cool neon rim light, soft top reflection.\nAudio: diegetic rain and low electric hum only.\nConstraints: no logo drift, no extra products, no text, no watermark.",
        imageSrc: "/blog/seedance-2-0-prompts/en/step-1.jpg",
      },
      {
        title: "Lock subject continuity next to motion",
        body:
          "The common mistake in seedance 2.0 prompts is describing motion separately from the object. The model may execute a nice camera move while quietly changing the product shape, package color, or small identity details. Product shots and character scenes need one continuity line: what must stay unchanged from the first frame to the last.\n\nPractical case: the first render of a sports-drink bottle looked dynamic, but the bottle became a different object in shot two. The cap changed, the label disappeared, and the body got wider. The fix was not `more realistic`; it was a preserve block: `preserve the same bottle silhouette, cap shape, label placement, matte material, and color palette through every frame`. After one edit, the camera still moved, but the product stopped falling apart.",
        before:
          "A branded bottle slides across a studio table, fast camera move, premium ad look.",
        after:
          "Subject continuity: preserve the same bottle silhouette, cap shape, label placement, matte material, and color palette through every frame. Motion: bottle slides 30 cm left to right while camera tracks parallel at table height. Constraints: no redesign, no label drift, no extra objects.",
        imageSrc: "/blog/seedance-2-0-prompts/en/step-2.jpg",
      },
      {
        title: "Storyboard 15 seconds into readable acts",
        body:
          "Good seedance 2.0 ai examples usually include timing. For 4-6 seconds, one action is enough. For 8-10 seconds, use two beats. For 12-15 seconds, write a storyboard: what sets up the shot, where the turn happens, and how the scene resolves.\n\nDo not cram three actions into one second. The model may invent a transition, but the viewer will read it as a jump. A reliable pacing pattern is 0-4s setup, 4-10s development, 10-15s payoff. Repeat the camera and subject state inside each act when they matter. This is especially useful with multiple references where one product, character, or location must survive the whole clip.",
        before:
          "15-second product video: speaker activates, city changes, camera flies around, logo appears, rain stops.",
        after:
          "0-4s: close product shot, speaker light slowly turns on, camera pushes in.\n4-10s: side tracking shot, rain reflections move across the glass table, product stays centered.\n10-15s: camera settles into a locked hero frame, light pulse fades, rain ambience continues.\nConstraints: no text, no logo drift, no shape changes, diegetic sound only.",
        imageSrc: "/blog/seedance-2-0-prompts/en/step-3.jpg",
      },
      {
        title: "Use constraints like production insurance",
        body:
          "Seedance 2.0 follows positive direction well, but complex scenes still need negative constraints. Do not write vague lines like `bad quality`. Name the specific failures: logo drift, extra products, sudden camera jump, warped hands, plastic skin, unwanted subtitles, random text.\n\nIf you work through a seedance 2.0 api provider with a separate negative prompt field, put artifacts and watermark bans there. If there is no separate field, keep a `Constraints` block at the end of the main prompt. Keep it tight: five to eight precise bans usually work better than a long wall of every possible defect.",
        before:
          "Make it realistic and don't make mistakes.",
        after:
          "Constraints: no logo drift, no product redesign, no extra objects, no sudden camera jump, no subtitles, no random text, no watermark, no glossy AI render look.",
        imageSrc: "/blog/seedance-2-0-prompts/en/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "What are seedance 2.0 prompts?",
        a: "They are structured instructions for ByteDance's video model: scene, subject, action, camera, lighting, audio, timing, and constraints. The more clearly those blocks are written, the less the model has to invent between frames.",
      },
      {
        q: "What is the best seedance 2.0 ai prompt structure?",
        a: "Use Scene -> Subject -> Action -> Camera -> Lighting -> Audio -> Constraints. For longer clips, add timestamped beats. For products or characters, add a subject-continuity line so the model knows what must not change.",
      },
      {
        q: "Does seedance 2.0 api need a different prompt?",
        a: "The semantic prompt stays the same, but the API or provider may expose duration, aspect ratio, reference files, and negative prompt as separate fields. Use those fields when available instead of repeating every technical setting in the text.",
      },
      {
        q: "Can I use seedance 2.0 prompts for product videos?",
        a: "Yes, but product videos need stricter continuity than mood videos. Lock silhouette, material, color palette, label placement, camera relation, and the list of banned changes. Otherwise the model may create a beautiful clip with the wrong product.",
      },
      {
        q: "What are good seedance 2.0 ai examples to start from?",
        a: "Start from a short scene block, not a giant template: `Scene`, `Subject`, `Action`, `Camera`, `Lighting`, `Audio`, `Constraints`. Then add a 0-4s / 4-10s / 10-15s storyboard only when the clip is long enough to need it.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
