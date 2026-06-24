import type { LearnCollection, LearnLang, LearnLesson, LearnMaterial, LearnTimestamp } from "./learn";
import { futureProtectedVideoDeliveryNote, learnDefaultAuthor } from "./learn";
import { getPrivateCourseLessonExtras } from "./privateCourseExtras";

export const PRIVATE_COURSE_SLUG = "ai-content-marketing-2026";
export const PRIVATE_COURSE_FIRST_LESSON_SLUG = "lesson-1-prompting";
export const PRIVATE_COURSE_FIRST_KINESCOPE_VIDEO_ID = "e941e14d-c5bf-40fc-abe5-a41e247777cf";
export const PRIVATE_COURSE_PRICE_RUB = 2990;
export const PRIVATE_COURSE_LIST_PRICE_RUB = 2990;
export const PRIVATE_COURSE_PRICE_USD = 41;
export const PRIVATE_COURSE_LIST_PRICE_USD = 41;
export const PRIVATE_COURSE_DISCOUNT_PERCENT = 0;
export const PRIVATE_COURSE_SALE_ENDS_AT = "2026-06-30T23:59:59+05:00";

export type PrivateCourseIntroContent = {
  title: Record<LearnLang, string>;
  description: Record<LearnLang, string>;
  posterPath: string;
  publicIntroVideo?: {
    providerAssetId: string;
    embedUrl: string;
  };
  videoAriaLabel: Record<LearnLang, string>;
  showcase: {
    eyebrow: Record<LearnLang, string>;
  };
};

export const privateCourseIntroContent: PrivateCourseIntroContent = {
  title: {
    ru: "Курс про нейросети для контента и маркетинга",
    en: "AI for Content and Marketing Course",
  },
  description: {
    ru: "На практике создадим с нуля бренд кофейни NOVA: промпты, фото, логотип и видео.\nЗатем соберём сайт nova-coffee.ru и контент для рекламы, чтобы всё выглядело как одна система.",
    en: "In practice, we build the NOVA coffee brand from scratch: prompts, photos, logo, and video.\nThen we assemble the nova-coffee.ru website and ad content so the whole system feels consistent.",
  },
  posterPath: "/assets/learn/video/actual-ai-tools-2026-poster.jpg",
  publicIntroVideo: {
    providerAssetId: "9c0fc06c-0063-4d9d-98f8-5333f993072b",
    embedUrl: "https://kinescope.io/embed/kgJ8g56Bu5BpggbbaFLhqc",
  },
  videoAriaLabel: {
    ru: "Вводный ролик курса",
    en: "Course intro video",
  },
  showcase: {
    eyebrow: {
      ru: "Вы научитесь:",
      en: "You will learn:",
    },
  },
};

const privateCourseUpdatedAt = "2026-06-23";
const privateCourseTotalLessons = 16;
const currentAiTools2026Url = "https://disk.yandex.ru/d/HaU7LdU850QLVw";
const pendingKinescopePosterPath = "/assets/space/learn-v2/ai-design-dashboard.jpg";

const courseMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    {
      title: "Syntx",
      meta: "Платформа для генерации фото и видео",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://syntx.ai/welcome/GlUETIt6",
    },
    {
      title: "Opten (ChatGPT)",
      meta: "Сервис для генерации промптов в ChatGPT",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator",
    },
    {
      title: "Opten (Claude и Codex)",
      meta: "Скилл для генерации промптов в Claude и Codex",
      kind: "pdf",
      actionLabel: "Скачать",
      href: "/assets/space/courses/ai-content-marketing-2026/opten-skill.zip",
    },
    {
      title: "Higgsfield",
      meta: "Платформа для генерации и управления видео",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://higgsfield.ai/",
    },
    {
      title: "Актуальные нейросети 2026",
      meta: "Список актуальных AI-сервисов и инструментов",
      kind: "link",
      actionLabel: "Скачать",
      href: currentAiTools2026Url,
    },
  ],
  en: [
    {
      title: "Syntx",
      meta: "AI platform for image and video generation",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://syntx.ai/welcome/GlUETIt6",
    },
    {
      title: "Opten (ChatGPT)",
      meta: "Prompt generation service in ChatGPT",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator",
    },
    {
      title: "Opten (Claude and Codex)",
      meta: "Prompt generation skill for Claude and Codex",
      kind: "pdf",
      actionLabel: "Скачать",
      href: "/assets/space/courses/ai-content-marketing-2026/opten-skill.zip",
    },
    {
      title: "Higgsfield",
      meta: "Platform for video generation and control",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://higgsfield.ai/",
    },
    {
      title: "Current AI tools 2026",
      meta: "Current AI services and tools list",
      kind: "link",
      actionLabel: "Скачать",
      href: currentAiTools2026Url,
    },
  ],
};

type PrivateCourseLessonConfig = {
  slug: string;
  videoId?: string;
  title: Record<LearnLang, string>;
  description: Record<LearnLang, string>;
  category: LearnLesson["category"];
  duration: string;
  durationIso: string;
  topics: Record<LearnLang, string[]>;
  whatYouWillLearn: Record<LearnLang, string[]>;
  timestamps: Record<LearnLang, LearnTimestamp[]>;
};

function poster(videoId: string) {
  return `https://kinescope.io/${videoId}/poster/lg.webp`;
}

function timestamp(time: string, title: string, description = ""): LearnTimestamp {
  const [minutes, seconds] = time.split(":").map(Number);
  return {
    time,
    seconds: (minutes || 0) * 60 + (seconds || 0),
    title,
    description,
  };
}

function timestamps(items: Array<[string, string]>): LearnTimestamp[] {
  return items.map(([time, title]) => timestamp(time, title));
}

function privateCourseLesson(config: PrivateCourseLessonConfig): LearnLesson {
  const posterPath = config.videoId ? poster(config.videoId) : pendingKinescopePosterPath;
  const extras = getPrivateCourseLessonExtras(config.slug);

  const lesson: LearnLesson = {
    slug: config.slug,
    title: config.title,
    description: config.description,
    category: config.category,
    duration: config.duration,
    durationIso: config.durationIso,
    status: "Available",
    access: "full-platform",
    fullAccessOnly: true,
    thumbnailPath: posterPath,
    author: learnDefaultAuthor,
    publishedAt: privateCourseUpdatedAt,
    updatedAt: privateCourseUpdatedAt,
    releaseNote: {
      ru: "Закрытый урок курса. Видео хранится в Kinescope и открывается через серверный course-entitlement gate.",
      en: "Private course lesson. Video is hosted on Kinescope and opened through the server-side course entitlement gate.",
    },
    filters: ["Standalone", "Course"],
    topics: config.topics,
    whatYouWillLearn: config.whatYouWillLearn,
    updatedNote: {
      ru: config.videoId ? "Kinescope video id привязан 2026-06-21." : "Kinescope video id нужно добавить после получения из кабинета.",
      en: config.videoId ? "Kinescope video id connected on 2026-06-21." : "Kinescope video id needs to be added from the dashboard.",
    },
    timestamps: config.timestamps,
    materials: extras?.materials ?? courseMaterials,
    prompts: extras?.prompts,
    missingItems: extras?.missingItems,
  };

  if (config.videoId) {
    lesson.videoProvider = {
      provider: "kinescope",
      providerAssetId: config.videoId,
      posterPath,
      playbackPolicy: "course-entitlement-gated-preview",
      signedPlaybackUrl: null,
      notes: futureProtectedVideoDeliveryNote,
    };
  }

  return lesson;
}

const privateCourseLessonConfigs: PrivateCourseLessonConfig[] = [
  {
    slug: PRIVATE_COURSE_FIRST_LESSON_SLUG,
    videoId: PRIVATE_COURSE_FIRST_KINESCOPE_VIDEO_ID,
    title: { ru: "Работа с ChatGPT и Claude", en: "Working with ChatGPT and Claude" },
    description: {
      ru: "В уроке показываю, зачем в курсе нужны ChatGPT, Claude и другие языковые модели: как писать промпт как понятное ТЗ, разделять задачи по чатам и использовать простую формулу запроса.",
      en: "This lesson shows why the course uses ChatGPT, Claude, and other language models: writing prompts as clear briefs, splitting tasks into separate chats, and using a simple request formula.",
    },
    category: "ai-video",
    duration: "11:26",
    durationIso: "PT11M26S",
    topics: {
      ru: ["LLM", "Промптинг", "ChatGPT", "Claude", "Opten"],
      en: ["LLM", "Prompting", "ChatGPT", "Claude", "Opten"],
    },
    whatYouWillLearn: {
      ru: ["Писать промпт как понятное ТЗ", "Разделять задачи по чатам", "Использовать формулу промпта"],
      en: ["Write prompts as clear briefs", "Split tasks into separate chats", "Use a simple prompt formula"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "План курса и нейросети"],
        ["00:52", "Что такое промпт"],
        ["01:45", "Контекст и отдельные чаты"],
        ["03:10", "Формула промпта"],
        ["04:15", "Opten для промптов"],
        ["05:15", "Инструкции в ChatGPT и Claude"],
        ["07:10", "Актуальные модели"],
        ["08:35", "Syntx и тарифы"],
        ["09:40", "Доступ и оплата сервисов"],
      ]),
      en: timestamps([
        ["00:00", "Course plan and AI models"],
        ["00:52", "What a prompt is"],
        ["01:45", "Context and separate chats"],
        ["03:10", "Prompt formula"],
        ["04:15", "Opten for prompts"],
        ["05:15", "Instructions in ChatGPT and Claude"],
        ["07:10", "Current models"],
        ["08:35", "Syntx and plans"],
        ["09:40", "Access and payments"],
      ]),
    },
  },
  {
    slug: "lesson-2-ai-services",
    videoId: "c3b06c01-19dd-4a3c-8218-7a216a2ebd67",
    title: { ru: "Обзор Syntx и Higgsfield", en: "Syntx and Higgsfield overview" },
    description: {
      ru: "В уроке разбираю, где запускать генерации и почему в курсе используется Syntx: выбор модели, добавление референсов, сохранение промптов и расчёт кредитов заранее.",
      en: "This lesson explains where to run generations and why the course uses Syntx: model choice, references, saved prompts, and credit estimates in advance.",
    },
    category: "ai-video",
    duration: "06:47",
    durationIso: "PT6M47S",
    topics: {
      ru: ["Syntx", "Higgsfield", "Модели", "Кредиты"],
      en: ["Syntx", "Higgsfield", "Models", "Credits"],
    },
    whatYouWillLearn: {
      ru: ["Выбирать сервис под задачу", "Не терять промпты", "Планировать кредиты"],
      en: ["Choose a service for the task", "Keep prompts organized", "Plan credit usage"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Где генерировать"],
        ["00:55", "Почему Syntx"],
        ["01:40", "Текстовые модели"],
        ["02:35", "Картинки и референсы"],
        ["03:40", "Как не потерять промпт"],
        ["04:20", "Кредиты"],
        ["05:25", "История генераций"],
        ["06:05", "Зачем Higgsfield"],
      ]),
      en: timestamps([
        ["00:00", "Where to generate"],
        ["00:55", "Why Syntx"],
        ["01:40", "Text models"],
        ["02:35", "Images and references"],
        ["03:40", "How not to lose a prompt"],
        ["04:20", "Credits"],
        ["05:25", "Generation history"],
        ["06:05", "Why Higgsfield"],
      ]),
    },
  },
  {
    slug: "lesson-3-logo-generation",
    videoId: "947a68e0-b570-4a9d-ad0c-ee55cc86b440",
    title: { ru: "Создание логотипа", en: "Logo creation" },
    description: {
      ru: "В уроке показываю, чем растровая картинка отличается от векторного логотипа: как я собираю логотип NOVA в Recraft, перевожу растровый вариант в вектор через Quiver, скачиваю SVG и открываю его для правок в Figma.",
      en: "This lesson shows how raster images differ from vector logos: how I build the NOVA logo in Recraft, vectorize a raster version with Quiver, export SVG, and open it for edits in Figma.",
    },
    category: "ai-image",
    duration: "08:03",
    durationIso: "PT8M3S",
    topics: {
      ru: ["Логотип", "Вектор", "Recraft", "Figma"],
      en: ["Logo", "Vector", "Recraft", "Figma"],
    },
    whatYouWillLearn: {
      ru: ["Отличать PNG/JPG от SVG", "Собрать промпт для Recraft", "Править логотип в Figma"],
      en: ["Tell PNG/JPG from SVG", "Build a Recraft prompt", "Edit the logo in Figma"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Растр и вектор"],
        ["00:48", "Идеи и референсы"],
        ["01:35", "Промпт для Recraft"],
        ["02:20", "Генерация логотипа"],
        ["03:05", "SVG в Figma"],
        ["03:50", "Растровые варианты"],
        ["04:35", "Векторизация через Quiver"],
        ["05:20", "Recraft напрямую"],
        ["06:05", "Экспорт логотипа"],
      ]),
      en: timestamps([
        ["00:00", "Raster and vector"],
        ["00:48", "Ideas and references"],
        ["01:35", "Prompt for Recraft"],
        ["02:20", "Logo generation"],
        ["03:05", "SVG in Figma"],
        ["03:50", "Raster variants"],
        ["04:35", "Vectorizing with Quiver"],
        ["05:20", "Recraft directly"],
        ["06:05", "Logo export"],
      ]),
    },
  },
  {
    slug: "lesson-4-photo-generation",
    videoId: "1fe7af11-23e5-46cf-bedf-e6bb41c2d3b3",
    title: { ru: "Генерация изображений", en: "Image generation" },
    description: {
      ru: "В уроке показываю, какую модель брать под разные задачи с картинками: как готовится первый кадр для NOVA и почему сначала лучше запускать дешёвый тест, а не дорогой рендер.",
      en: "This lesson shows which model to choose for different image tasks: preparing the first NOVA frame and why a cheap test should come before an expensive render.",
    },
    category: "ai-image",
    duration: "04:09",
    durationIso: "PT4M9S",
    topics: {
      ru: ["Nano Banana", "GPT Image", "Модели", "Syntx"],
      en: ["Nano Banana", "GPT Image", "Models", "Syntx"],
    },
    whatYouWillLearn: {
      ru: ["Выбирать модель под формат", "Запускать дешёвый тест", "Оценивать первый результат"],
      en: ["Choose a model for the format", "Run a cheap test first", "Evaluate the first result"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Модель под задачу"],
        ["00:45", "Карта моделей"],
        ["01:25", "Шпаргалка"],
        ["02:00", "Первый промпт"],
        ["02:45", "Генерация в Syntx"],
        ["03:20", "Сначала тест"],
        ["03:50", "Проверяем результат"],
      ]),
      en: timestamps([
        ["00:00", "Model for the task"],
        ["00:45", "Model map"],
        ["01:25", "Cheat sheet"],
        ["02:00", "First prompt"],
        ["02:45", "Generating in Syntx"],
        ["03:20", "Test first"],
        ["03:50", "Checking the result"],
      ]),
    },
  },
  {
    slug: "lesson-5-references",
    videoId: "02bcf12a-ab7c-49d4-96cb-441fafb898b9",
    title: { ru: "Работа с референсами", en: "Working with references" },
    description: {
      ru: "В уроке разбираю, как использовать референсы, чтобы картинки не выглядели случайными: как отдельно удерживать внешность, стиль, логотип и композицию.",
      en: "This lesson explains how to use references so generated images do not feel random: separating identity, style, logo, and composition control.",
    },
    category: "ai-image",
    duration: "09:54",
    durationIso: "PT9M54S",
    topics: {
      ru: ["Референсы", "Внешность", "Стиль", "Композиция"],
      en: ["References", "Identity", "Style", "Composition"],
    },
    whatYouWillLearn: {
      ru: ["Удерживать внешность", "Разделять роли референсов", "Сохранять стиль и логотип"],
      en: ["Keep identity consistent", "Separate reference roles", "Preserve style and logo"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Зачем референсы"],
        ["00:55", "Держим внешность"],
        ["02:00", "Промпт на внешность"],
        ["03:15", "Opten для референсов"],
        ["04:20", "Роли референсов"],
        ["05:45", "Стиль и свет"],
        ["07:05", "Текст и логотип"],
        ["08:30", "Переносим механику"],
        ["09:25", "Итог по референсам"],
      ]),
      en: timestamps([
        ["00:00", "Why references"],
        ["00:55", "Keeping identity"],
        ["02:00", "Identity prompt"],
        ["03:15", "Opten for references"],
        ["04:20", "Reference roles"],
        ["05:45", "Style and light"],
        ["07:05", "Text and logo"],
        ["08:30", "Transferring mechanics"],
        ["09:25", "Reference recap"],
      ]),
    },
  },
  {
    slug: "lesson-6-image-editing",
    videoId: "a6294ef7-c6e6-4744-8b2e-60967fa7bfd7",
    title: { ru: "ИИ редактирование фото", en: "AI photo editing" },
    description: {
      ru: "В уроке показываю, почему картинка портится после множества правок: как аккуратно удалять лишние детали, работать с маской и сохранять качество исходного изображения.",
      en: "This lesson shows why images degrade after too many edits: removing unwanted details, working with masks, and preserving the source quality.",
    },
    category: "ai-image",
    duration: "08:53",
    durationIso: "PT8M53S",
    topics: {
      ru: ["Редактирование", "Маски", "Photoshop", "Качество"],
      en: ["Editing", "Masks", "Photoshop", "Quality"],
    },
    whatYouWillLearn: {
      ru: ["Править изображение точечно", "Работать с маской", "Сохранять резкость"],
      en: ["Make precise edits", "Work with masks", "Preserve sharpness"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Деградация качества"],
        ["00:55", "Потеря деталей"],
        ["01:40", "Быстрые правки в Syntx"],
        ["02:25", "Побочные эффекты правок"],
        ["03:05", "Двойная генерация"],
        ["04:10", "Маски в Photoshop"],
        ["05:25", "Сохраняем оригинал"],
        ["06:35", "Проверка артефактов"],
        ["07:10", "Photopea"],
        ["08:00", "Кисти и горячие клавиши"],
      ]),
      en: timestamps([
        ["00:00", "Quality degradation"],
        ["00:55", "Detail loss"],
        ["01:40", "Quick edits in Syntx"],
        ["02:25", "Edit side effects"],
        ["03:05", "Double generation"],
        ["04:10", "Masks in Photoshop"],
        ["05:25", "Keeping the original"],
        ["06:35", "Artifact check"],
        ["07:10", "Photopea"],
        ["08:00", "Brushes and hotkeys"],
      ]),
    },
  },
  {
    slug: "lesson-7-ai-video",
    videoId: "18f00246-366f-4f43-a67a-a1b3ead807c0",
    title: { ru: "Генерация видео", en: "Video generation" },
    description: {
      ru: "В уроке разбираю, почему видео стоит дороже картинок и как не тратить кредиты впустую: запуск видео из текста, из картинки и пример простого вертикального ролика.",
      en: "This lesson explains why video costs more than images and how not to waste credits: text-to-video, image-to-video, and a simple vertical clip example.",
    },
    category: "ai-video",
    duration: "07:50",
    durationIso: "PT7M50S",
    topics: {
      ru: ["AI-видео", "Kling", "Seedance", "9:16"],
      en: ["AI video", "Kling", "Seedance", "9:16"],
    },
    whatYouWillLearn: {
      ru: ["Разбирать форматы видео", "Запускать image-to-video", "Экономить кредиты"],
      en: ["Understand video formats", "Run image-to-video", "Save credits"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Видео дороже"],
        ["00:55", "Форматы видео"],
        ["02:05", "Kling и Seedance"],
        ["03:10", "Видео из текста"],
        ["04:15", "Видео из картинки"],
        ["05:30", "Промпт на русском"],
        ["06:25", "Неудачный дубль"],
        ["07:15", "Экономим кредиты"],
      ]),
      en: timestamps([
        ["00:00", "Video costs more"],
        ["00:55", "Video formats"],
        ["02:05", "Kling and Seedance"],
        ["03:10", "Text to video"],
        ["04:15", "Image to video"],
        ["05:30", "Prompt in Russian"],
        ["06:25", "Bad take"],
        ["07:15", "Saving credits"],
      ]),
    },
  },
  {
    slug: "lesson-8-frames",
    videoId: "43d3328a-dc4d-4e60-a269-aa1eebf7e2b4",
    title: { ru: "Режим ключевых кадров", en: "Keyframe mode" },
    description: {
      ru: "В уроке показываю, как задавать первый и последний кадр видео, чтобы контролировать движение и получать понятный переход вместо случайной анимации.",
      en: "This lesson shows how to set the first and last frame of a video for better motion control and a clear transition instead of random animation.",
    },
    category: "ai-video",
    duration: "05:21",
    durationIso: "PT5M21S",
    topics: {
      ru: ["Keyframes", "Kling", "Камера", "Переход"],
      en: ["Keyframes", "Kling", "Camera", "Transition"],
    },
    whatYouWillLearn: {
      ru: ["Задавать стартовый кадр", "Задавать финальный кадр", "Контролировать движение"],
      en: ["Set a start frame", "Set an end frame", "Control motion"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Что такое ключевые кадры"],
        ["00:45", "Старт и финал"],
        ["01:35", "Переход NOVA"],
        ["02:25", "Движение камеры"],
        ["03:20", "Длительность и формат"],
        ["04:05", "Сводим кадры"],
        ["04:50", "Дальше мультишот"],
      ]),
      en: timestamps([
        ["00:00", "What keyframes are"],
        ["00:45", "Start and finish"],
        ["01:35", "NOVA transition"],
        ["02:25", "Camera movement"],
        ["03:20", "Duration and format"],
        ["04:05", "Combining frames"],
        ["04:50", "Next: multishot"],
      ]),
    },
  },
  {
    slug: "lesson-9-storytelling",
    videoId: "6f742d8c-cf18-4b9d-97b7-b3e6f63aa696",
    title: { ru: "Режим мультишот", en: "Multishot mode" },
    description: {
      ru: "В уроке показываю, как собирать ролик из нескольких сцен: структура, раскадровка и подход к исправлению слабого фрагмента без пересборки всей генерации.",
      en: "This lesson shows how to build a video from several scenes: structure, storyboard, and fixing a weak fragment without rebuilding the whole generation.",
    },
    category: "ai-video",
    duration: "08:30",
    durationIso: "PT8M30S",
    topics: {
      ru: ["Мультишот", "Сюжет", "Раскадровка", "Seedance"],
      en: ["Multishot", "Story", "Storyboard", "Seedance"],
    },
    whatYouWillLearn: {
      ru: ["Собирать структуру ролика", "Писать промпт по сценам", "Чинить слабые дубли"],
      en: ["Structure a clip", "Write scene prompts", "Fix weak takes"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Ролик из сцен"],
        ["00:55", "Идея ролика"],
        ["02:05", "Промпт по сценам"],
        ["03:20", "Первый кадр"],
        ["04:25", "Чиним плохой дубль"],
        ["05:35", "Раскадровка"],
        ["06:45", "Референсы через @"],
        ["07:45", "Итог по сюжету"],
      ]),
      en: timestamps([
        ["00:00", "Clip from scenes"],
        ["00:55", "Video idea"],
        ["02:05", "Scene prompt"],
        ["03:20", "First frame"],
        ["04:25", "Fixing a bad take"],
        ["05:35", "Storyboard"],
        ["06:45", "References via @"],
        ["07:45", "Story recap"],
      ]),
    },
  },
  {
    slug: "lesson-10-prompt-library",
    videoId: "3675dfeb-55da-47c3-aac8-35b0556dbd84",
    title: { ru: "ИИ редактирование видео", en: "AI video editing" },
    description: {
      ru: "В уроке показываю, как менять фон и одежду в уже готовом видео: разбираю исходник, первый кадр, финальный результат и ограничения такой AI-правки.",
      en: "This lesson shows how to change a background and clothing in an existing video: the source clip, first frame, final result, and limits of this AI edit.",
    },
    category: "ai-video",
    duration: "05:05",
    durationIso: "PT5M5S",
    topics: {
      ru: ["ИИ-правка", "Видео", "Фон", "Одежда"],
      en: ["AI editing", "Video", "Background", "Clothing"],
    },
    whatYouWillLearn: {
      ru: ["Подготовить первый кадр", "Поставить маску", "Понять ограничения модели"],
      en: ["Prepare the first frame", "Place a mask", "Understand model limits"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Правим готовое видео"],
        ["00:40", "Первый кадр"],
        ["01:30", "Меняем фон"],
        ["02:20", "Маска"],
        ["03:15", "Проверяем результат"],
        ["04:10", "Ограничения модели"],
        ["04:45", "Дальше аватары"],
      ]),
      en: timestamps([
        ["00:00", "Editing existing video"],
        ["00:40", "First frame"],
        ["01:30", "Changing background"],
        ["02:20", "Mask"],
        ["03:15", "Checking result"],
        ["04:10", "Model limits"],
        ["04:45", "Next: avatars"],
      ]),
    },
  },
  {
    slug: "lesson-11-ai-avatars",
    videoId: "602d64ae-48ab-4730-a4fc-81b4d9677c14",
    title: { ru: "Создание AI-аватаров", en: "Creating AI avatars" },
    description: {
      ru: "В уроке показываю, как делается говорящий аватар из картинки и аудио: подготовка персонажа, запись голоса и синхронизация губ с озвучкой.",
      en: "This lesson shows how a talking avatar is made from an image and audio: character prep, voice recording, and lip sync with narration.",
    },
    category: "ai-video",
    duration: "07:03",
    durationIso: "PT7M3S",
    topics: {
      ru: ["AI-аватары", "Lipsync", "ElevenLabs", "HeyGen"],
      en: ["AI avatars", "Lip sync", "ElevenLabs", "HeyGen"],
    },
    whatYouWillLearn: {
      ru: ["Подготовить персонажа", "Записать голос", "Оживить фото"],
      en: ["Prepare a character", "Record a voice", "Animate a photo"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Из чего аватар"],
        ["00:55", "Персонаж NOVA"],
        ["01:55", "Стиль Pixar"],
        ["02:55", "Голос"],
        ["04:00", "Эмоции в тексте"],
        ["04:50", "Оживляем фото"],
        ["06:00", "Ограничения"],
        ["06:40", "Дальше движение"],
      ]),
      en: timestamps([
        ["00:00", "Avatar ingredients"],
        ["00:55", "NOVA character"],
        ["01:55", "Pixar style"],
        ["02:55", "Voice"],
        ["04:00", "Text emotions"],
        ["04:50", "Animating a photo"],
        ["06:00", "Limits"],
        ["06:40", "Next: motion"],
      ]),
    },
  },
  {
    slug: "lesson-12-motion-control",
    videoId: "d01c3455-92fe-4ffa-b878-d367211cfb5a",
    title: { ru: "Генерация озвучки", en: "Voiceover generation" },
    description: {
      ru: "В уроке показываю подготовку озвучки, замену внешности по референсу и сборку финального ролика в CapCut. Связываю голос, персонажа, первый кадр и motion control.",
      en: "This lesson shows voiceover prep, appearance replacement with a reference, and final assembly in CapCut. It connects voice, character, first frame, and motion control.",
    },
    category: "ai-video",
    duration: "09:08",
    durationIso: "PT9M8S",
    topics: {
      ru: ["Озвучка", "ElevenLabs", "CapCut", "Motion Control"],
      en: ["Voiceover", "ElevenLabs", "CapCut", "Motion Control"],
    },
    whatYouWillLearn: {
      ru: ["Подготовить озвучку", "Заменить внешность по референсу", "Собрать результат в монтаже"],
      en: ["Prepare voiceover", "Replace appearance from a reference", "Assemble the final edit"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Движение по референсу"],
        ["00:55", "Референс движения"],
        ["01:55", "Первый кадр"],
        ["03:05", "Сохраняем позу"],
        ["04:15", "Меняем голос"],
        ["05:35", "Движение в Kling"],
        ["06:50", "Собираем результат"],
        ["07:50", "Монтаж в CapCut"],
        ["08:40", "Итог по NOVA"],
      ]),
      en: timestamps([
        ["00:00", "Motion from reference"],
        ["00:55", "Motion reference"],
        ["01:55", "First frame"],
        ["03:05", "Keeping the pose"],
        ["04:15", "Changing the voice"],
        ["05:35", "Motion in Kling"],
        ["06:50", "Assembling result"],
        ["07:50", "Editing in CapCut"],
        ["08:40", "NOVA recap"],
      ]),
    },
  },
  {
    slug: "lesson-13-upscale",
    videoId: "c8494fb4-b8cf-4b4e-b6e8-7b43aebd9189",
    title: { ru: "Апскейл фото и видео", en: "Photo and video upscaling" },
    description: {
      ru: "В уроке разбираю, когда нужен апскейл, почему плохой исходник не спасается магически и как выбирать режимы для фото и видео. Отдельно показываю, когда сначала монтировать, а уже потом улучшать качество.",
      en: "This lesson explains when upscaling helps, why a bad source is not magically fixed, and how to choose modes for photos and video. It also shows when to edit first and upscale later.",
    },
    category: "ai-video",
    duration: "08:57",
    durationIso: "PT8M57S",
    topics: {
      ru: ["Апскейл", "Фото", "Видео", "Качество"],
      en: ["Upscale", "Photo", "Video", "Quality"],
    },
    whatYouWillLearn: {
      ru: ["Выбирать режим апскейла", "Оценивать исходник", "Планировать порядок монтажа"],
      en: ["Choose an upscale mode", "Evaluate the source", "Plan the edit order"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Зачем апскейл"],
        ["00:55", "Фото-апскейл"],
        ["02:00", "Похожесть исходника"],
        ["03:25", "Плохой исходник"],
        ["04:35", "Видео-апскейл"],
        ["05:55", "Режимы апскейла"],
        ["07:10", "Сначала монтаж"],
        ["08:15", "Дальше Codex"],
      ]),
      en: timestamps([
        ["00:00", "Why upscale"],
        ["00:55", "Photo upscale"],
        ["02:00", "Source similarity"],
        ["03:25", "Bad source"],
        ["04:35", "Video upscale"],
        ["05:55", "Upscale modes"],
        ["07:10", "Edit first"],
        ["08:15", "Next: Codex"],
      ]),
    },
  },
  {
    slug: "lesson-14-codex",
    videoId: "7a62c38c-b75d-4777-8ee8-74c81eda7a18",
    title: { ru: "Настройка Codex", en: "Codex setup" },
    description: {
      ru: "В уроке показываю, как настроить Codex как рабочее окружение для проекта, а не просто чат: папка проекта, доступ к файлам, модель, режимы, AGENTS.md, MCP и подключение Opten.",
      en: "This lesson shows how to set up Codex as a project workspace, not just a chat: project folder, file access, model, modes, AGENTS.md, MCP, and Opten connection.",
    },
    category: "vibe-coding",
    duration: "12:33",
    durationIso: "PT12M33S",
    topics: {
      ru: ["Codex", "AGENTS.md", "MCP", "Автоматизация"],
      en: ["Codex", "AGENTS.md", "MCP", "Automation"],
    },
    whatYouWillLearn: {
      ru: ["Настроить проект Codex", "Понять роль AGENTS.md", "Подключать MCP и Opten"],
      en: ["Set up a Codex project", "Understand AGENTS.md", "Connect MCP and Opten"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Codex для проекта"],
        ["01:00", "Зачем отдельный проект"],
        ["02:05", "Папка проекта"],
        ["03:05", "Доступ к файлам"],
        ["04:20", "Модель и режим"],
        ["05:45", "Лимиты и контекст"],
        ["07:00", "Файл AGENTS.md"],
        ["08:25", "Что такое MCP"],
        ["09:45", "Higgsfield MCP"],
        ["10:55", "Opten в Codex"],
        ["11:55", "Дальше автоматизация"],
      ]),
      en: timestamps([
        ["00:00", "Codex for a project"],
        ["01:00", "Why a separate project"],
        ["02:05", "Project folder"],
        ["03:05", "File access"],
        ["04:20", "Model and mode"],
        ["05:45", "Limits and context"],
        ["07:00", "AGENTS.md file"],
        ["08:25", "What MCP is"],
        ["09:45", "Higgsfield MCP"],
        ["10:55", "Opten in Codex"],
        ["11:55", "Next: automation"],
      ]),
    },
  },
  {
    slug: "lesson-15-higgsfield-mcp",
    videoId: "54757622-4f97-4d8f-a97e-1f95ac2561f1",
    title: { ru: "Автоматизация контента", en: "Content automation" },
    description: {
      ru: "В уроке показываю, как автоматизировать контент для бренда NOVA: сначала разобрать видео-референс через Higgsfield MCP и Codex, затем зафиксировать стиль баннеров в design.md и генерировать новые посты без повторного объяснения бренда.",
      en: "This lesson shows how to automate NOVA brand content: first analyzing a video reference through Higgsfield MCP and Codex, then locking banner style in design.md and generating new posts without re-explaining the brand.",
    },
    category: "vibe-coding",
    duration: "14:42",
    durationIso: "PT14M42S",
    topics: {
      ru: ["Higgsfield MCP", "Codex", "GPT Image", "design.md", "Автоматизация"],
      en: ["Higgsfield MCP", "Codex", "GPT Image", "design.md", "Automation"],
    },
    whatYouWillLearn: {
      ru: [
        "Анализировать видео-референс через Codex и Higgsfield MCP",
        "Генерировать первый кадр и ролик через GPT Image и Seedance",
        "Фиксировать визуальный стиль бренда в design.md",
        "Использовать шрифты и референсы для серии баннеров",
      ],
      en: [
        "Analyze a video reference through Codex and Higgsfield MCP",
        "Generate a first frame and clip with GPT Image and Seedance",
        "Lock a brand visual style in design.md",
        "Use fonts and references for a repeatable banner series",
      ],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Видео-референс как задача"],
        ["00:43", "Скачиваем референс"],
        ["01:20", "Запрос для Higgsfield MCP"],
        ["02:08", "Промпты для кадра и ролика"],
        ["02:37", "Генерация через MCP"],
        ["03:31", "Структура и результат видео"],
        ["04:23", "Переход к баннерам"],
        ["05:36", "Четыре обложки поста"],
        ["06:33", "Графические варианты"],
        ["07:18", "Шрифты через референсы"],
        ["08:53", "Сохраняем стиль в папку"],
        ["09:26", "design.md в Codex"],
        ["10:43", "Текст внутри изображения"],
        ["11:09", "Посты по design.md"],
        ["11:47", "Итерации и новые референсы"],
        ["12:57", "Где применять систему"],
        ["14:18", "Масштабирование баннеров"],
      ]),
      en: timestamps([
        ["00:00", "Video reference as a task"],
        ["00:43", "Downloading the reference"],
        ["01:20", "Prompt for Higgsfield MCP"],
        ["02:08", "Frame and clip prompts"],
        ["02:37", "Generation through MCP"],
        ["03:31", "Video structure and result"],
        ["04:23", "Moving to banners"],
        ["05:36", "Four post covers"],
        ["06:33", "Graphic variants"],
        ["07:18", "Fonts as references"],
        ["08:53", "Saving style into a folder"],
        ["09:26", "design.md in Codex"],
        ["10:43", "Text inside the image"],
        ["11:09", "Posts from design.md"],
        ["11:47", "Iterations and new references"],
        ["12:57", "Where to use the system"],
        ["14:18", "Scaling banners"],
      ]),
    },
  },
  {
    slug: "lesson-16-nova-website",
    videoId: "34992868-3dc1-416c-8438-d25ced15833a",
    title: { ru: "Вайб-кодинг сайта", en: "Vibe-coding a website" },
    description: {
      ru: "В уроке показываю, как собрать структуру лендинга, подготовить ассеты NOVA и превратить ТЗ в сайт через Codex: локальный запуск, проверка в браузере, мобильная версия, Vercel-деплой и подключение домена.",
      en: "This lesson shows how to structure a landing page, prepare NOVA assets, and turn a brief into a website through Codex: local run, browser checks, mobile layout, Vercel deploy, and domain connection.",
    },
    category: "vibe-coding",
    duration: "21:08",
    durationIso: "PT21M8S",
    topics: {
      ru: ["ChatGPT", "Codex", "Vercel", "Лендинг"],
      en: ["ChatGPT", "Codex", "Vercel", "Landing page"],
    },
    whatYouWillLearn: {
      ru: ["Собрать ТЗ сайта", "Запустить проект локально", "Задеплоить на Vercel"],
      en: ["Create a website brief", "Run the project locally", "Deploy to Vercel"],
    },
    timestamps: {
      ru: timestamps([
        ["00:00", "Собираем сайт"],
        ["01:05", "Проблема нейросайтов"],
        ["02:25", "Структура лендинга"],
        ["03:45", "Ассеты NOVA"],
        ["05:05", "ТЗ для Codex"],
        ["06:40", "Референс страницы"],
        ["08:20", "Файлы сайта"],
        ["10:05", "Локальный запуск"],
        ["11:45", "Проверка в браузере"],
        ["13:15", "Мобильная версия"],
        ["15:10", "Блоки сайта"],
        ["17:00", "Деплой на Vercel"],
        ["18:40", "Домен"],
        ["20:00", "Итог курса"],
      ]),
      en: timestamps([
        ["00:00", "Building the site"],
        ["01:05", "Problem with AI websites"],
        ["02:25", "Landing structure"],
        ["03:45", "NOVA assets"],
        ["05:05", "Brief for Codex"],
        ["06:40", "Page reference"],
        ["08:20", "Site files"],
        ["10:05", "Local run"],
        ["11:45", "Browser check"],
        ["13:15", "Mobile version"],
        ["15:10", "Page blocks"],
        ["17:00", "Deploy to Vercel"],
        ["18:40", "Domain"],
        ["20:00", "Course recap"],
      ]),
    },
  },
];

export const privateCourseLessons: LearnLesson[] = privateCourseLessonConfigs.map(privateCourseLesson);

export const privateCourseCollection: LearnCollection = {
  id: PRIVATE_COURSE_SLUG,
  title: {
    ru: "Нейросети для контента и маркетинга 2026",
    en: "AI for Content and Marketing 2026",
  },
  description: {
    ru: "Закрытый курс Opten по созданию контента и маркетинговой упаковки с помощью ИИ.",
    en: "A private Opten course on creating content and marketing assets with AI.",
  },
  kind: "course",
  categoryLabel: {
    ru: "Закрытый курс",
    en: "Private course",
  },
  routeBasePath: {
    ru: `/learn/courses/${PRIVATE_COURSE_SLUG}`,
    en: `/learn/courses/${PRIVATE_COURSE_SLUG}`,
  },
  purchase: {
    provider: "course",
    courseSlug: PRIVATE_COURSE_SLUG,
    priceRub: PRIVATE_COURSE_PRICE_RUB,
    listPriceRub: PRIVATE_COURSE_LIST_PRICE_RUB,
    priceUsd: PRIVATE_COURSE_PRICE_USD,
    listPriceUsd: PRIVATE_COURSE_LIST_PRICE_USD,
    discountPercent: PRIVATE_COURSE_DISCOUNT_PERCENT,
    saleEndsAt: PRIVATE_COURSE_SALE_ENDS_AT,
  },
  progress: {
    completed: 0,
    total: privateCourseTotalLessons,
  },
  lessons: privateCourseLessons,
};

export function getPrivateCourseCollection(courseSlug: string | undefined): LearnCollection | undefined {
  return courseSlug === PRIVATE_COURSE_SLUG ? privateCourseCollection : undefined;
}

export function findPrivateCourseLesson(courseSlug: string | undefined, lessonSlug: string | undefined): LearnLesson | undefined {
  const collection = getPrivateCourseCollection(courseSlug);
  if (!collection) return undefined;
  if (!lessonSlug) return undefined;
  return collection.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function getAdjacentPrivateCourseLessons(courseSlug: string | undefined, lessonSlug: string) {
  const collection = getPrivateCourseCollection(courseSlug);
  if (!collection) return {};
  const index = collection.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  return {
    previousLesson: index > 0 ? collection.lessons[index - 1] : undefined,
    nextLesson: index >= 0 && index < collection.lessons.length - 1 ? collection.lessons[index + 1] : undefined,
  };
}
