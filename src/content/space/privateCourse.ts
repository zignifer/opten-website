import type { LearnCollection, LearnLang, LearnLesson, LearnMaterial } from "./learn";
import { futureProtectedVideoDeliveryNote, learnDefaultAuthor } from "./learn";

export const PRIVATE_COURSE_SLUG = "ai-content-marketing-2026";
export const PRIVATE_COURSE_FIRST_LESSON_SLUG = "lesson-1-prompting";
export const PRIVATE_COURSE_FIRST_KINESCOPE_VIDEO_ID = "e941e14d-c5bf-40fc-abe5-a41e247777cf";

const privateCourseUpdatedAt = "2026-06-19";
const privateCourseTotalLessons = 15;
const currentAiTools2026Url = "https://disk.yandex.ru/d/HaU7LdU850QLVw";

const courseMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    {
      title: "Генератор промптов в ChatGPT",
      meta: "Opten Prompt Improver для генерации промптов под изображения",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator",
    },
    {
      title: "Скилл для генерации промптов в Claude",
      meta: "Скачивание Pro-сборки opten.zip через расширение Opten",
      kind: "link",
      actionLabel: "Скачать",
      href: "/dashboard/download-skill",
    },
    {
      title: "Syntx",
      meta: "AI-платформа для генерации изображений и видео",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://syntx.ai/welcome/GlUETIt6",
    },
    {
      title: "Higgsfield",
      meta: "AI-видео, движение камеры и визуальные эффекты",
      kind: "link",
      actionLabel: "Перейти",
      href: "https://higgsfield.ai/",
    },
    {
      title: "Актуальные нейросети 2026",
      meta: "Подборка актуальных AI-сервисов и инструментов для курса",
      kind: "link",
      actionLabel: "Скачать",
      href: currentAiTools2026Url,
    },
  ],
  en: [
    {
      title: "ChatGPT prompt generator",
      meta: "Opten Prompt Improver for image-generation prompts",
      kind: "link",
      actionLabel: "Open",
      href: "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator",
    },
    {
      title: "Claude prompt-generation Skill",
      meta: "Downloads the Pro opten.zip bundle through the Opten extension flow",
      kind: "link",
      actionLabel: "Download",
      href: "/dashboard/download-skill",
    },
    {
      title: "Syntx",
      meta: "AI platform for image and video generation",
      kind: "link",
      actionLabel: "Open",
      href: "https://syntx.ai/welcome/GlUETIt6",
    },
    {
      title: "Higgsfield",
      meta: "AI video, camera motion, and visual effects",
      kind: "link",
      actionLabel: "Open",
      href: "https://higgsfield.ai/",
    },
    {
      title: "Current AI tools 2026",
      meta: "A course pack with current AI services and tools",
      kind: "link",
      actionLabel: "Download",
      href: currentAiTools2026Url,
    },
  ],
};

type PrivateCourseLessonConfig = {
  slug: string;
  videoId: string;
  title: Record<LearnLang, string>;
  description: Record<LearnLang, string>;
  category: LearnLesson["category"];
  duration: string;
  durationIso: string;
  topics: Record<LearnLang, string[]>;
  whatYouWillLearn: Record<LearnLang, string[]>;
};

function poster(videoId: string) {
  return `https://kinescope.io/${videoId}/poster/lg.webp`;
}

function privateCourseLesson(config: PrivateCourseLessonConfig): LearnLesson {
  const posterPath = poster(config.videoId);

  return {
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
      ru: "Закрытый урок курса. Видео хранится в Kinescope и открывается через серверный Pro-gate.",
      en: "Private course lesson. Video is hosted on Kinescope and opened through the server-side Pro gate.",
    },
    filters: ["Standalone", "Prompt packs"],
    topics: config.topics,
    whatYouWillLearn: config.whatYouWillLearn,
    updatedNote: {
      ru: "Kinescope video id привязан 2026-06-19.",
      en: "Kinescope video id connected on 2026-06-19.",
    },
    timestamps: {
      ru: [],
      en: [],
    },
    materials: courseMaterials,
    videoProvider: {
      provider: "kinescope",
      providerAssetId: config.videoId,
      posterPath,
      playbackPolicy: "subscription-gated-public-preview",
      signedPlaybackUrl: null,
      notes: futureProtectedVideoDeliveryNote,
    },
  };
}

const privateCourseLessonConfigs: PrivateCourseLessonConfig[] = [
  {
    slug: PRIVATE_COURSE_FIRST_LESSON_SLUG,
    videoId: PRIVATE_COURSE_FIRST_KINESCOPE_VIDEO_ID,
    title: {
      ru: "Промптинг для создания визуала",
      en: "Prompting for visual creation",
    },
    description: {
      ru: "Разбираем, как собирать промпты для визуального контента и сразу использовать Opten-инструменты в ChatGPT, Claude, Syntx и Higgsfield.",
      en: "How to assemble prompts for visual content and use Opten tools in ChatGPT, Claude, Syntx, and Higgsfield.",
    },
    category: "ai-video",
    duration: "07:39",
    durationIso: "PT7M39S",
    topics: {
      ru: ["Промптинг", "AI-визуал", "ChatGPT", "Claude", "Syntx", "Higgsfield"],
      en: ["Prompting", "AI visuals", "ChatGPT", "Claude", "Syntx", "Higgsfield"],
    },
    whatYouWillLearn: {
      ru: [
        "Понять структуру промпта для визуального результата",
        "Использовать генератор промптов Opten в ChatGPT",
        "Скачать Claude Skill для генерации промптов",
        "Перенести готовый промпт в Syntx или Higgsfield",
      ],
      en: [
        "Understand the structure of a prompt for visual output",
        "Use the Opten prompt generator in ChatGPT",
        "Download the Claude Skill for prompt generation",
        "Move the finished prompt into Syntx or Higgsfield",
      ],
    },
  },
  {
    slug: "lesson-2-ai-services",
    videoId: "c3b06c01-19dd-4a3c-8218-7a216a2ebd67",
    title: { ru: "Какие сервисы использовать", en: "Which services to use" },
    description: {
      ru: "Разбираем рабочий набор сервисов для генерации контента, маркетинговых визуалов и быстрых production-задач.",
      en: "A practical stack of services for content generation, marketing visuals, and fast production work.",
    },
    category: "ai-video",
    duration: "06:48",
    durationIso: "PT6M48S",
    topics: {
      ru: ["AI-сервисы", "Контент", "Маркетинг", "Workflow"],
      en: ["AI services", "Content", "Marketing", "Workflow"],
    },
    whatYouWillLearn: {
      ru: ["Собрать базовый стек AI-сервисов", "Понять, какой инструмент под какую задачу использовать", "Не распыляться между десятками сервисов"],
      en: ["Build a base AI-service stack", "Map tools to the right production tasks", "Avoid spreading attention across too many services"],
    },
  },
  {
    slug: "lesson-3-logo-generation",
    videoId: "947a68e0-b570-4a9d-ad0c-ee55cc86b440",
    title: { ru: "Генерация логотипа в векторе", en: "Vector logo generation" },
    description: {
      ru: "Показываем, как подходить к генерации логотипов через промпт, стиль, ограничения и выбор подходящего результата.",
      en: "How to approach logo generation through prompt structure, style, constraints, and result selection.",
    },
    category: "ai-image",
    duration: "04:55",
    durationIso: "PT4M55S",
    topics: {
      ru: ["Логотип", "Брендинг", "Промптинг", "AI-дизайн"],
      en: ["Logo", "Branding", "Prompting", "AI design"],
    },
    whatYouWillLearn: {
      ru: ["Формулировать задачу на логотип", "Уточнять стиль и ограничения", "Отбирать результат под бренд-задачу"],
      en: ["Define a logo-generation task", "Clarify style and constraints", "Select outputs for brand use"],
    },
  },
  {
    slug: "lesson-4-photo-generation",
    videoId: "1fe7af11-23e5-46cf-bedf-e6bb41c2d3b3",
    title: { ru: "Базовая генерация фото", en: "Basic photo generation" },
    description: {
      ru: "Создаем фотореалистичные изображения и управляем сценой, светом, объектом и визуальной подачей через промпт.",
      en: "Creating photorealistic images while controlling scene, light, subject, and visual direction through the prompt.",
    },
    category: "ai-image",
    duration: "04:10",
    durationIso: "PT4M10S",
    topics: {
      ru: ["Фотореализм", "Свет", "Композиция", "AI-изображения"],
      en: ["Photorealism", "Lighting", "Composition", "AI images"],
    },
    whatYouWillLearn: {
      ru: ["Задавать сцену и объект", "Управлять светом и стилем", "Получать более production-ready изображения"],
      en: ["Describe scene and subject", "Control light and style", "Get more production-ready images"],
    },
  },
  {
    slug: "lesson-5-references",
    videoId: "02bcf12a-ab7c-49d4-96cb-441fafb898b9",
    title: { ru: "Продвинутая генерация фото", en: "Advanced photo generation" },
    description: {
      ru: "Разбираем, как использовать референсы, чтобы удерживать стиль, композицию, персонажа или продукт в генерациях.",
      en: "Using references to keep style, composition, character, or product direction stable across generations.",
    },
    category: "ai-image",
    duration: "09:54",
    durationIso: "PT9M54S",
    topics: {
      ru: ["Референсы", "Стиль", "Композиция", "Консистентность"],
      en: ["References", "Style", "Composition", "Consistency"],
    },
    whatYouWillLearn: {
      ru: ["Подбирать рабочие референсы", "Передавать стиль и композицию", "Снижать случайность результата"],
      en: ["Choose useful references", "Transfer style and composition", "Reduce randomness in outputs"],
    },
  },
  {
    slug: "lesson-6-image-editing",
    videoId: "a6294ef7-c6e6-4744-8b2e-60967fa7bfd7",
    title: { ru: "Редактирование фото в ИИ", en: "AI photo editing" },
    description: {
      ru: "Редактируем и улучшаем изображения: исправляем детали, меняем элементы и доводим генерацию до пригодного результата.",
      en: "Editing and improving images: fixing details, changing elements, and refining generations into usable results.",
    },
    category: "ai-image",
    duration: "06:41",
    durationIso: "PT6M41S",
    topics: {
      ru: ["Редактирование", "Inpainting", "Правки", "AI-изображения"],
      en: ["Editing", "Inpainting", "Fixes", "AI images"],
    },
    whatYouWillLearn: {
      ru: ["Планировать правки изображения", "Исправлять детали через промпт", "Доводить визуал до финального состояния"],
      en: ["Plan image edits", "Fix details through prompts", "Refine visuals to a final state"],
    },
  },
  {
    slug: "lesson-7-ai-video",
    videoId: "18f00246-366f-4f43-a67a-a1b3ead807c0",
    title: { ru: "Генерация видео: Картинка в видео", en: "Video generation: image to video" },
    description: {
      ru: "Переходим от статичного визуала к видео: движение, камера, длительность, ограничения и подготовка исходника.",
      en: "Moving from static visuals to video: motion, camera, duration, constraints, and source preparation.",
    },
    category: "ai-video",
    duration: "07:51",
    durationIso: "PT7M51S",
    topics: {
      ru: ["AI-видео", "Движение", "Камера", "Image-to-video"],
      en: ["AI video", "Motion", "Camera", "Image-to-video"],
    },
    whatYouWillLearn: {
      ru: ["Описывать движение и камеру", "Готовить изображение для видео", "Избегать типовых ошибок AI-видео"],
      en: ["Describe motion and camera", "Prepare an image for video", "Avoid common AI-video mistakes"],
    },
  },
  {
    slug: "lesson-8-frames",
    videoId: "43d3328a-dc4d-4e60-a269-aa1eebf7e2b4",
    title: { ru: "Генерация видео: Кейфреймс", en: "Video generation: keyframes" },
    description: {
      ru: "Разбираем работу с кадрами, визуальной логикой и связкой отдельных фреймов в понятный ролик.",
      en: "Working with frames, visual logic, and connecting separate shots into a coherent video.",
    },
    category: "ai-video",
    duration: "05:21",
    durationIso: "PT5M21S",
    topics: {
      ru: ["Кадры", "Фреймы", "Монтажная логика", "AI-видео"],
      en: ["Shots", "Frames", "Editing logic", "AI video"],
    },
    whatYouWillLearn: {
      ru: ["Думать роликом через кадры", "Связывать фреймы между собой", "Удерживать визуальную последовательность"],
      en: ["Think in shots", "Connect frames together", "Keep visual continuity"],
    },
  },
  {
    slug: "lesson-9-storytelling",
    videoId: "6f742d8c-cf18-4b9d-97b7-b3e6f63aa696",
    title: { ru: "Мультишот сцены с раскадровкой", en: "Multishot scenes with storyboard" },
    description: {
      ru: "Собираем сюжетную логику для AI-ролика: идея, сцены, переходы, акценты и понятный финальный результат.",
      en: "Building story logic for an AI video: idea, scenes, transitions, accents, and a clear final result.",
    },
    category: "ai-video",
    duration: "08:31",
    durationIso: "PT8M31S",
    topics: {
      ru: ["Сюжет", "Сценарий", "Сцены", "AI-видео"],
      en: ["Story", "Script", "Scenes", "AI video"],
    },
    whatYouWillLearn: {
      ru: ["Собирать идею в последовательность сцен", "Планировать переходы и акценты", "Делать ролик понятнее зрителю"],
      en: ["Turn an idea into a scene sequence", "Plan transitions and accents", "Make the video clearer for viewers"],
    },
  },
  {
    slug: "lesson-10-prompt-library",
    videoId: "3675dfeb-55da-47c3-aac8-35b0556dbd84",
    title: { ru: "Меняем фон в видео", en: "Changing the background in video" },
    description: {
      ru: "Организуем библиотеку промптов и материалов, чтобы не терять удачные формулы и быстрее повторять рабочие результаты.",
      en: "Organizing a prompt and resource library so useful formulas are not lost and working results are easier to repeat.",
    },
    category: "business",
    duration: "05:06",
    durationIso: "PT5M6S",
    topics: {
      ru: ["Библиотека", "Промпты", "Систематизация", "Workflow"],
      en: ["Library", "Prompts", "Systematization", "Workflow"],
    },
    whatYouWillLearn: {
      ru: ["Хранить удачные промпты", "Систематизировать материалы курса", "Быстрее возвращаться к рабочим связкам"],
      en: ["Store useful prompts", "Organize course materials", "Return to working setups faster"],
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
  if (!lessonSlug) return collection.lessons[0];
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
