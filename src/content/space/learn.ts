export type LearnLang = "ru" | "en";

export type LocalizedText = Record<LearnLang, string>;

export type LearnTopic = "ai-image" | "ai-video" | "vibe-coding" | "vibe-design" | "business";

export type LearnLessonStatus = "Available" | "In progress" | "Completed";

export type LearnAccess = "free" | "full-platform";

export type LearnCoursePurchase = {
  provider: "course";
  courseSlug: string;
  priceRub: number;
  listPriceRub: number;
  priceUsd: number;
  listPriceUsd: number;
  discountPercent: number;
  saleEndsAt: string;
};

export type LearnCollectionKind = "course" | "standalone";

export type LearnFilter = "All" | "Standalone" | "Prompt packs" | "Builder" | "Brand" | "Models";

export type LearnAuthor = {
  name: string;
  localizedName?: LocalizedText;
  initials: string;
  role: LocalizedText;
  intro: LocalizedText;
  note: LocalizedText;
  avatarPath: string;
};

export type LearnTimestamp = {
  time: string;
  seconds: number;
  title: string;
  description: string;
};

export type LearnMaterial = {
  title: string;
  meta: string;
  kind: "pdf" | "video" | "link";
  actionLabel: string;
  href: string;
  status?: "ready" | "pending";
};

export type LearnPromptBlock = {
  id?: string;
  title: string;
  meta: string;
  body?: string;
  language?: "text" | "markdown" | "bash";
  sourceLabel?: string;
  status?: "ready" | "pending";
};

export type LearnMissingItem = {
  title: string;
  meta: string;
  actionLabel?: string;
};

export type LearnLocalVideo = {
  src: string;
  posterPath: string;
  contentUrl: string;
};

export type LearnLocalizedVideo = {
  youtubeId?: string;
  youtubeUrl?: string;
  audioLanguage?: LearnLang;
  captionLanguage?: LearnLang;
};

export type LearnVideoProviderMetadata = {
  provider: "youtube" | "local" | "kinescope";
  providerAssetId: string;
  posterPath: string;
  playbackPolicy: "public-embed" | "subscription-gated-public-preview" | "course-entitlement-gated-preview";
  signedPlaybackUrl: null;
  contentUrl?: string;
  notes: string;
};

export type LearnLesson = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  seoTitle?: LocalizedText;
  seoDescription?: LocalizedText;
  category: LearnTopic;
  duration: string;
  durationIso: string;
  status: LearnLessonStatus;
  access: LearnAccess;
  previewAvailable?: boolean;
  fullAccessOnly?: boolean;
  thumbnailPath: string;
  author?: LearnAuthor;
  publishedAt: string;
  updatedAt: string;
  releaseNote: LocalizedText;
  filters: LearnFilter[];
  topics: Record<LearnLang, string[]>;
  whatYouWillLearn: Record<LearnLang, string[]>;
  updatedNote: LocalizedText;
  youtubeId?: string;
  youtubeUrl?: string;
  youtubePinnedCommentId?: string;
  localizedVideo?: Partial<Record<LearnLang, LearnLocalizedVideo>>;
  localVideo?: LearnLocalVideo;
  timestamps: Record<LearnLang, LearnTimestamp[]>;
  materials: Partial<Record<LearnLang, LearnMaterial[]>>;
  prompts?: Partial<Record<LearnLang, LearnPromptBlock[]>>;
  missingItems?: Partial<Record<LearnLang, LearnMissingItem[]>>;
  videoProvider?: LearnVideoProviderMetadata;
};

export type LearnCourseProgress = {
  completed: number;
  total: number;
};

export type LearnCourse = {
  id: string;
  title: LocalizedText;
  category: LearnFilter;
  label: LocalizedText;
  description: LocalizedText;
  progress?: LearnCourseProgress;
  lessons: LearnLesson[];
};

export type LearnFutureCollection = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  lessons: number;
  topic: LearnTopic;
  image: string;
};

export type LearnFaqItem = {
  q: string;
  a: string;
};

export type LearnOverviewSection = {
  id: string;
  title: string;
  metadata?: string;
  description: string;
  iconPath: string;
  lessons: LearnLesson[];
};

export type LearnCollection = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  kind: LearnCollectionKind;
  categoryLabel: LocalizedText;
  routeBasePath?: LocalizedText;
  purchase?: LearnCoursePurchase;
  promptGenerators?: Partial<Record<LearnLang, LearnMaterial[]>>;
  progress?: LearnCourseProgress;
  lessons: LearnLesson[];
};

export const learnFilters: LearnFilter[] = ["All", "Standalone", "Prompt packs", "Builder", "Brand", "Models"];

export const learnTopics: LearnTopic[] = ["ai-image", "ai-video", "vibe-coding", "vibe-design", "business"];

export const learnTopicLabels: Record<LearnLang, Record<"all" | LearnTopic, string>> = {
  ru: {
    all: "Все темы",
    "ai-image": "ИИ-генерация изображений",
    "ai-video": "ИИ-генерация видео",
    "vibe-coding": "Вайб-кодинг",
    "vibe-design": "Вайб-дизайн",
    business: "ИИ для бизнеса",
  },
  en: {
    all: "All topics",
    "ai-image": "AI image generation",
    "ai-video": "AI video generation",
    "vibe-coding": "Vibe-coding",
    "vibe-design": "Vibe-design",
    business: "AI for business",
  },
};

export const hiddenLearnOverviewLessonSlugs = [
  "client-website-navigation-hero",
  "junior-designer-1100-order",
  "web-design-references",
  "figma-to-codex-website",
] as const;

export const learnHubIntro: LocalizedText = {
  ru:
    "Бесплатные курсы по нейросетям и уроки Opten помогают начать обучение ИИ с практики, если вы изучаете нейросети с нуля: AI-видео, генерация изображений, веб-дизайн в Figma, вайб-кодинг, AI-визуал для брендов и промпты для современных моделей.",
  en:
    "Start learning AI with practical Opten lessons: generative AI, vibe coding, Claude Code, Cursor, Lovable, Figma web design, AI video and prompt engineering workflows.",
};

export const learnHubFaq: Record<LearnLang, LearnFaqItem[]> = {
  ru: [
    {
      q: "Какие курсы по нейросетям есть на Opten?",
      a: "На Opten собраны бесплатные уроки и будущие курсы по нейросетям: AI-видео, генерация изображений, промпты, вайб-кодинг, веб-дизайн в Figma и AI-визуал для брендов.",
    },
    {
      q: "С чего начать обучение ИИ и нейросетям с нуля?",
      a: "Начните с вводных уроков и подборки «Нейросети с нуля», затем переходите к практическим темам: AI-видео, дизайну, промптам или вайб-кодингу под вашу рабочую задачу.",
    },
    {
      q: "Есть ли бесплатные уроки по нейросетям?",
      a: "Да. Раздел /learn содержит бесплатные видеоуроки, тайм-коды и материалы. Новые открытые уроки добавляются по мере выхода разборов и обновления AI-инструментов.",
    },
    {
      q: "Что такое вайб-кодинг простыми словами?",
      a: "Вайб-кодинг — это создание сайтов, приложений и автоматизаций через постановку задач ИИ-инструментам. Человек задает цель, проверяет результат и доводит проект до рабочего состояния.",
    },
    {
      q: "Подойдут ли курсы веб-дизайна новичку?",
      a: "Да, если идти от практики: Figma, референсы, структура сайта, визуальные блоки и разборы реальных экранов. В уроках Opten дизайн связан с нейросетями и современным AI-workflow.",
    },
    {
      q: "Что входит в обучение ИИ Opten?",
      a: learnHubIntro.ru,
    },
  ],
  en: [
    {
      q: "What AI courses and tutorials are available on Opten?",
      a: "Opten brings together free AI courses, tutorials, and upcoming collections on generative AI, vibe coding, Figma web design, AI video, prompt engineering, and practical AI workflows.",
    },
    {
      q: "How should beginners start learning AI?",
      a: "Start with beginner AI tutorials, then move into one practical track: AI video, Figma web design, prompt engineering, or vibe coding. The goal is to learn AI by building useful outputs, not by memorizing theory.",
    },
    {
      q: "Are there free AI courses on Opten?",
      a: "Yes. The /learn section includes free AI lessons, video tutorials, timestamps, and materials. New open lessons are added as AI tools and production workflows change.",
    },
    {
      q: "What is vibe coding?",
      a: "Vibe coding means building websites, apps, and automations by describing the goal to AI coding tools such as Claude Code, Cursor, Lovable, or similar agents, then reviewing and refining the output into a working project.",
    },
    {
      q: "Does Opten cover prompt engineering courses?",
      a: "Opten Learn connects prompt engineering with real creative workflows: AI video, image generation, web design, and vibe coding. The lessons focus on writing clearer prompts before you generate, review, or ship the result.",
    },
    {
      q: "What does Opten AI learning include?",
      a: learnHubIntro.en,
    },
  ],
};

export const futureProtectedVideoDeliveryNote =
  "Current Learn launch embeds public YouTube lessons and one optimized local public video. Protected video delivery uses backend-issued signed short-lived playback URLs and a proper streaming/video provider when private course or Pro video files are required.";

const legacyLearnAssetBase = "/assets/space/learn-v2";
const learnAssetBase = "/assets/learn";

export const learnDefaultAuthor: LearnAuthor = {
  name: "Влад Воронежцев",
  localizedName: {
    ru: "Влад Воронежцев",
    en: "Vlad Voronezhtsev",
  },
  initials: "ВВ",
  role: {
    ru: "9 лет в веб-дизайне",
    en: "Web designer, AI creator",
  },
  intro: {
    ru: "Показываю рабочие AI-процессы на реальных уроках: от идеи и промпта до результата.",
    en: "I teach practical AI workflows through real lessons: from idea and prompt to finished visual content.",
  },
  note: {
    ru: "Уроки обновляются, когда меняются модели, интерфейсы или production-процесс.",
    en: "Lessons are updated when models, interfaces, or the production workflow change.",
  },
  avatarPath: `${legacyLearnAssetBase}/author-vlad-avatar-color.png`,
};

export const learnIntegrationTodos = {
  auth: "Use SpaceAuthProvider/account-summary for optional viewer identity and entitlement state.",
  subscription: "Future Pro lessons unlock when account-summary returns plan=pro with active or cancelled paid access.",
  video:
    "Public YouTube embed and optimized public MP4 are the first delivery paths. Keep provider access and timestamp generation in local scripts/server context, not in browser code.",
  contentManagement:
    "Replace this local catalog with an owner upload/content management workflow when course authoring is ready.",
};

const emptyMaterials: Record<LearnLang, LearnMaterial[]> = { ru: [], en: [] };

const aiWebsiteVibeDesignMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    { title: "Инструкция и материалы Seedance 2.5", meta: "Материалы к уроку в Telegram-канале автора", kind: "link", actionLabel: "Открыть", href: "https://t.me/v_voronezhtsev" },
    { title: "Syntx", meta: "Генерация фото и видео со скидкой автора 15%", kind: "link", actionLabel: "Перейти", href: "https://syntx.ai/welcome/GlUETIt6" },
    { title: "Полный курс по нейросетям", meta: "Визуал, видео и сайты с помощью ИИ", kind: "link", actionLabel: "Открыть курс", href: "/learn/courses/ai-content-marketing-2026" },
  ],
  en: [
    { title: "Seedance 2.5 guide and materials", meta: "Lesson materials in the author's Telegram channel", kind: "link", actionLabel: "Open", href: "https://t.me/v_voronezhtsev" },
    { title: "Syntx", meta: "AI image and video generation with the author's 15% discount", kind: "link", actionLabel: "Open", href: "https://syntx.ai/welcome/GlUETIt6" },
    { title: "Complete AI course", meta: "Visuals, video, and websites made with AI", kind: "link", actionLabel: "Open course", href: "/learn/courses/ai-content-marketing-2026" },
  ],
};

const actualAiToolsMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    { title: "Higgsfield", meta: "AI-видео, движение камеры и визуальные эффекты", kind: "link", actionLabel: "Перейти", href: "https://higgsfield.ai/" },
    { title: "Freepik / Magnific", meta: "Изображения, апскейл и визуальные ассеты", kind: "link", actionLabel: "Перейти", href: "https://freepik.com/" },
    { title: "Syntx", meta: "AI-аватары и визуальные генерации", kind: "link", actionLabel: "Перейти", href: "https://syntx.ai/welcome/GlUETIt6" },
  ],
  en: [
    { title: "Higgsfield", meta: "AI video, camera motion, and visual effects", kind: "link", actionLabel: "Open", href: "https://higgsfield.ai/" },
    { title: "Freepik / Magnific", meta: "Images, upscaling, and visual assets", kind: "link", actionLabel: "Open", href: "https://freepik.com/" },
    { title: "Syntx", meta: "AI avatars and visual generation", kind: "link", actionLabel: "Open", href: "https://syntx.ai/welcome/GlUETIt6" },
  ],
};

const aiAvatarMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    { title: "Исходники с медведем", meta: "Материалы для скачивания на Яндекс Диске", kind: "link", actionLabel: "Скачать", href: "https://disk.yandex.ru/d/xzRwLyTMdrptYg" },
    { title: "Исходники с человеком", meta: "Материалы для скачивания на Яндекс Диске", kind: "link", actionLabel: "Скачать", href: "https://disk.yandex.ru/d/oXQC8gAKd7fLrQ" },
    { title: "Промпты для урока", meta: "Готовые промпты и текстовые заготовки", kind: "link", actionLabel: "Открыть", href: "https://disk.yandex.ru/i/RW634KjnQBxXOA" },
  ],
  en: [
    { title: "Bear source files", meta: "Downloadable files on Yandex Disk", kind: "link", actionLabel: "Download", href: "https://disk.yandex.ru/d/xzRwLyTMdrptYg" },
    { title: "Human source files", meta: "Downloadable files on Yandex Disk", kind: "link", actionLabel: "Download", href: "https://disk.yandex.ru/d/oXQC8gAKd7fLrQ" },
    { title: "Lesson prompts", meta: "Ready prompts and text blocks", kind: "link", actionLabel: "Open", href: "https://disk.yandex.ru/i/RW634KjnQBxXOA" },
  ],
};

const juniorOrderMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    { title: "Проект в Figma", meta: "Исходный макет Lesson 2", kind: "link", actionLabel: "Открыть", href: "https://www.figma.com/design/mOcAHEj6CTfJ4I6rX3njbS/Lesson-2?node-id=0-1&t=4jkf8940YqYUa4ty-1" },
  ],
  en: [
    { title: "Figma project", meta: "Lesson 2 source design", kind: "link", actionLabel: "Open", href: "https://www.figma.com/design/mOcAHEj6CTfJ4I6rX3njbS/Lesson-2?node-id=0-1&t=4jkf8940YqYUa4ty-1" },
  ],
};

const clientWebsiteMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    { title: "AI инструмент удаления фона", meta: "Magnific Background Remover", kind: "link", actionLabel: "Перейти", href: "https://www.magnific.com/ai/background-remover" },
    { title: "Проект в Figma", meta: "Исходный макет Lesson Show", kind: "link", actionLabel: "Открыть", href: "https://www.figma.com/design/veGLoNcpik3KFPVt80NrCE/Lesson--Show-?node-id=0-1&t=ntKcUydisb4baiXQ-1" },
  ],
  en: [
    { title: "AI background remover", meta: "Magnific Background Remover", kind: "link", actionLabel: "Open", href: "https://www.magnific.com/ai/background-remover" },
    { title: "Figma project", meta: "Lesson Show source design", kind: "link", actionLabel: "Open", href: "https://www.figma.com/design/veGLoNcpik3KFPVt80NrCE/Lesson--Show-?node-id=0-1&t=ntKcUydisb4baiXQ-1" },
  ],
};

const marketplaceCardsMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    { title: "Проект в Figma", meta: "Исходный макет урока OZON карточка", kind: "link", actionLabel: "Открыть", href: "https://www.figma.com/design/EOlrmBQqBnS3hBJuARSWdu/%D0%A3%D1%80%D0%BE%D0%BA-OZON-%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0?node-id=0-1&t=1oPi9xThdfdNHQSr-1" },
  ],
  en: [
    { title: "Figma project", meta: "OZON product card lesson source design", kind: "link", actionLabel: "Open", href: "https://www.figma.com/design/EOlrmBQqBnS3hBJuARSWdu/%D0%A3%D1%80%D0%BE%D0%BA-OZON-%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0?node-id=0-1&t=1oPi9xThdfdNHQSr-1" },
  ],
};

const referencesMaterials: Record<LearnLang, LearnMaterial[]> = {
  ru: [
    { title: "Проект в Figma", meta: "Исходный макет Pyros lesson", kind: "link", actionLabel: "Открыть", href: "https://www.figma.com/design/guN3wlvDOU5Noj96hXLoaM/Pyros--lesson-?node-id=0-1&t=QtmYU4jb6IxF2iPS-1" },
  ],
  en: [
    { title: "Figma project", meta: "Pyros lesson source design", kind: "link", actionLabel: "Open", href: "https://www.figma.com/design/guN3wlvDOU5Noj96hXLoaM/Pyros--lesson-?node-id=0-1&t=QtmYU4jb6IxF2iPS-1" },
  ],
};

function localize<T>(value: Record<LearnLang, T>, lang: LearnLang): T {
  return value[lang] ?? value.ru;
}

const actualAiToolsTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Какие сервисы остаются в работе", description: "Короткое введение в набор нейросетей, которые закрывают большинство задач дизайна и контента." },
  { time: "00:45", seconds: 45, title: "Критерии отбора инструментов", description: "Почему в рабочем наборе остаются только сервисы, которые дают стабильный результат и экономят время." },
  { time: "01:30", seconds: 90, title: "Инструменты для изображений", description: "Разбор нейросетей, которые помогают быстро получать основу для дизайна, рекламы и визуальных концептов." },
  { time: "02:40", seconds: 160, title: "Видео и анимация", description: "Как выбирать генераторы видео под ролики, аватары, продуктовые сцены и короткий контент." },
  { time: "03:45", seconds: 225, title: "Дизайн и интерфейсы", description: "Какие AI-сервисы помогают ускорять UI-задачи, мудборды, композицию и подготовку ассетов." },
  { time: "04:55", seconds: 295, title: "Контентный workflow", description: "Как связать несколько инструментов в один процесс: идея, визуал, монтаж и публикация." },
  { time: "06:20", seconds: 380, title: "Как не распыляться", description: "Почему лучше глубоко освоить малый набор сервисов, чем постоянно прыгать между десятками новинок." },
  { time: "07:10", seconds: 430, title: "Итоги и следующий шаг", description: "Финальный список рабочих инструментов и логика выбора под собственные задачи." },
];

const actualAiToolsTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "The tools that stay in the workflow", description: "A quick introduction to the AI services that cover most design and content tasks." },
  { time: "00:45", seconds: 45, title: "Selection criteria", description: "Why only tools with stable output and real time savings deserve a permanent place." },
  { time: "01:30", seconds: 90, title: "Image-generation tools", description: "AI tools for creating bases for design, ads, and visual concepts." },
  { time: "02:40", seconds: 160, title: "Video and animation", description: "How to choose video generators for clips, avatars, product scenes, and short content." },
  { time: "03:45", seconds: 225, title: "Design and interfaces", description: "AI services that speed up UI tasks, moodboards, composition, and asset preparation." },
  { time: "04:55", seconds: 295, title: "Content workflow", description: "How to connect several tools into one process: idea, visuals, edit, and publishing." },
  { time: "06:20", seconds: 380, title: "Avoiding tool overload", description: "Why mastering a small stack beats constantly jumping between dozens of new services." },
  { time: "07:10", seconds: 430, title: "Wrap-up and next step", description: "The final shortlist and how to choose tools for your own work." },
];

const aiAvatarTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Введение в AI-аватары", description: "Объяснение принципа работы технологии переноса движений и мимики человека на ИИ-персонажа." },
  { time: "00:38", seconds: 38, title: "Подготовка видеореференса", description: "Запись исходного ролика и правильное извлечение первого кадра через Premiere Pro для работы." },
  { time: "01:25", seconds: 85, title: "Создание образа персонажа", description: "Генерация финального изображения в сервисе Syntax на основе референса лица и первого кадра." },
  { time: "02:30", seconds: 150, title: "Изменение голоса в 11 Labs", description: "Использование Voice Changer для подготовки качественной озвучки персонажа." },
  { time: "03:55", seconds: 235, title: "Анимация в Kling Motion Control", description: "Загрузка материалов и оживление персонажа по движениям из видеореференса." },
  { time: "04:45", seconds: 285, title: "Сборка проекта и липсинк", description: "Замена оригинального звука на сгенерированный и проверка синхронизации губ." },
  { time: "05:50", seconds: 350, title: "Методы придания реализма", description: "Приёмы с перезаписью звука и видео с экрана для эффекта живой съёмки." },
  { time: "07:20", seconds: 440, title: "Апскейл видео для мемов", description: "Улучшение качества исходников через Upscaler, чтобы избежать артефактов при анимации." },
  { time: "08:35", seconds: 515, title: "Настройки фона и ориентации", description: "Разбор параметров фона и направления взгляда персонажа в Kling Motion Control." },
];

const aiAvatarTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Intro to AI avatars", description: "How motion and facial expression transfer turns a reference video into a controllable AI character." },
  { time: "00:38", seconds: 38, title: "Preparing the video reference", description: "Recording the source clip and extracting the first frame for further generation." },
  { time: "01:25", seconds: 85, title: "Creating the character look", description: "Generating the final character image from the face reference and first frame." },
  { time: "02:30", seconds: 150, title: "Changing the voice in 11 Labs", description: "Using Voice Changer to prepare a convincing voice for the character." },
  { time: "03:55", seconds: 235, title: "Animation in Kling Motion Control", description: "Uploading the materials and animating the character with movement from the video reference." },
  { time: "04:45", seconds: 285, title: "Assembly and lip sync", description: "Replacing the original audio and checking whether the lip sync matches the new voice." },
  { time: "05:50", seconds: 350, title: "Making the result feel real", description: "Phone-screen recording tricks that make the output feel less synthetic." },
  { time: "07:20", seconds: 440, title: "Upscaling meme videos", description: "Improving source videos before animation to reduce artifacts." },
  { time: "08:35", seconds: 515, title: "Background and orientation settings", description: "Key background and gaze-direction settings in Kling Motion Control." },
];

const juniorOrderTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Вступление и информация", description: "Условия эксперимента с реальным заказом на дизайн сайта." },
  { time: "00:18", seconds: 18, title: "Что было дано начинающему дизайнеру", description: "Исходные материалы и задача для новичка." },
  { time: "01:23", seconds: 83, title: "Смотрим дизайн ученика", description: "Первый просмотр результата без исправлений." },
  { time: "01:52", seconds: 112, title: "Разбираем секцию с услугами", description: "Ошибки в композиции и структуре карточек услуг." },
  { time: "03:34", seconds: 214, title: "Какие должны быть отступы", description: "Настройка ритма, сетки и границ контента." },
  { time: "09:24", seconds: 564, title: "Редизайн секции услуг", description: "Практическая переработка первого проблемного блока." },
  { time: "10:38", seconds: 638, title: "Разделение секций фоном", description: "Как фон помогает отделять смысловые блоки страницы." },
  { time: "11:20", seconds: 680, title: "Разбор секции с отзывами", description: "Проверка композиции, текста и визуальных акцентов." },
  { time: "12:45", seconds: 765, title: "Выравнивание текста на странице", description: "Исправление направляющих и положения текстовых блоков." },
  { time: "14:38", seconds: 878, title: "Аватарки людей в отзывах", description: "Работа с фотографиями и подачей авторов отзывов." },
  { time: "16:50", seconds: 1010, title: "Редизайн второй секции", description: "Финальная переработка блока отзывов." },
  { time: "18:32", seconds: 1112, title: "Разбор секции с галереей", description: "Оценка структуры и размеров карточек галереи." },
  { time: "19:03", seconds: 1143, title: "Принципы работы Auto Layout", description: "Настройка адаптивных карточек и внутренних отступов." },
  { time: "22:45", seconds: 1365, title: "Редизайн третьей секции", description: "Пересборка галереи с учётом правил Auto Layout." },
  { time: "23:50", seconds: 1430, title: "Где искать референсы и UX-примеры", description: "Источники идей для структуры и интерфейсных решений." },
  { time: "24:20", seconds: 1460, title: "Разбор последней секции FAQ", description: "Проверка логики и композиции блока вопросов." },
  { time: "25:48", seconds: 1548, title: "Редизайн FAQ", description: "Практическая переработка вопросов и ответов." },
  { time: "27:04", seconds: 1624, title: "Толщина иконок", description: "Как привести иконки к единому визуальному стилю." },
  { time: "28:17", seconds: 1697, title: "Дизайн, который принял клиент", description: "Финальный вариант реального клиентского проекта." },
];

const juniorOrderTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Introduction and context", description: "The setup for a real client website design experiment." },
  { time: "00:18", seconds: 18, title: "What the junior designer received", description: "The source materials and task handed to the beginner." },
  { time: "01:23", seconds: 83, title: "Reviewing the student's design", description: "A first look at the result before corrections." },
  { time: "01:52", seconds: 112, title: "Reviewing the services section", description: "Composition and card-structure mistakes in the first section." },
  { time: "03:34", seconds: 214, title: "Choosing the right spacing", description: "Setting rhythm, grid, and content boundaries." },
  { time: "09:24", seconds: 564, title: "Redesigning the services section", description: "A practical rebuild of the first problem area." },
  { time: "10:38", seconds: 638, title: "Separating sections with backgrounds", description: "Using background changes to divide page sections." },
  { time: "11:20", seconds: 680, title: "Reviewing the testimonials section", description: "Checking composition, text, and visual emphasis." },
  { time: "12:45", seconds: 765, title: "Aligning page text", description: "Fixing guides and text-block positioning." },
  { time: "14:38", seconds: 878, title: "People avatars in testimonials", description: "Improving photos and author presentation." },
  { time: "16:50", seconds: 1010, title: "Redesigning the second section", description: "The final rebuild of the testimonials block." },
  { time: "18:32", seconds: 1112, title: "Reviewing the gallery section", description: "Checking gallery structure and card sizes." },
  { time: "19:03", seconds: 1143, title: "Auto Layout principles", description: "Building responsive cards and consistent inner spacing." },
  { time: "22:45", seconds: 1365, title: "Redesigning the third section", description: "Rebuilding the gallery with Auto Layout rules." },
  { time: "23:50", seconds: 1430, title: "Finding references and UX examples", description: "Sources for layout and interface ideas." },
  { time: "24:20", seconds: 1460, title: "Reviewing the final FAQ section", description: "Checking the logic and composition of the FAQ." },
  { time: "25:48", seconds: 1548, title: "Redesigning the FAQ", description: "A practical rebuild of the questions and answers." },
  { time: "27:04", seconds: 1624, title: "Icon stroke weight", description: "Bringing icons into one consistent visual system." },
  { time: "28:17", seconds: 1697, title: "The design accepted by the client", description: "The final version of the real client project." },
];

const clientWebsiteTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Вступление и информация", description: "Задача реального клиентского проекта и план урока." },
  { time: "00:20", seconds: 20, title: "Moodboard в веб-дизайне", description: "Подготовка визуального направления для сайта." },
  { time: "01:15", seconds: 75, title: "Что предоставил клиент", description: "Разбор исходных материалов и требований заказчика." },
  { time: "02:57", seconds: 177, title: "Собираем референсы", description: "Поиск примеров для структуры и визуального стиля." },
  { time: "04:50", seconds: 290, title: "Размеры фрейма для сайта", description: "Настройка рабочего фрейма в Figma." },
  { time: "06:05", seconds: 365, title: "Как начать дизайн в Figma", description: "Первые шаги от пустого фрейма к структуре страницы." },
  { time: "07:12", seconds: 432, title: "Фон первой секции сайта", description: "Сборка основы hero-секции и её фона." },
  { time: "10:26", seconds: 626, title: "Поиск изображений на Unsplash", description: "Подбор подходящей графики для композиции." },
  { time: "12:04", seconds: 724, title: "Удаляем фон изображения", description: "Подготовка исходника через AI background remover." },
  { time: "12:43", seconds: 763, title: "Редактируем изображения в Figma", description: "Размещение и настройка графики внутри макета." },
  { time: "15:25", seconds: 925, title: "Цветокоррекция изображения", description: "Сведение изображения с общей палитрой сайта." },
  { time: "16:15", seconds: 975, title: "Добавляем H1-заголовок", description: "Создание главного текстового акцента страницы." },
  { time: "16:55", seconds: 1015, title: "Работа с типографикой", description: "Настройка шрифтов, интервалов и иерархии." },
  { time: "19:42", seconds: 1182, title: "Дизайн кнопок", description: "Сборка основной CTA-кнопки." },
  { time: "21:19", seconds: 1279, title: "Иконки через Iconify", description: "Добавление иконок из плагина в интерфейс." },
  { time: "21:50", seconds: 1310, title: "Кнопка в Auto Layout", description: "Перевод CTA в адаптивный компонент." },
  { time: "23:10", seconds: 1390, title: "Второстепенная кнопка", description: "Создание второго действия в hero-секции." },
  { time: "23:56", seconds: 1436, title: "Чистим слои и Auto Layout", description: "Организация слоёв и адаптивной структуры макета." },
  { time: "25:22", seconds: 1522, title: "Размещаем логотип", description: "Добавление логотипа в верхнюю часть сайта." },
  { time: "26:00", seconds: 1560, title: "Работаем над навигацией", description: "Сборка меню и элементов шапки." },
  { time: "27:41", seconds: 1661, title: "Auto Layout навигации", description: "Настройка адаптивной структуры меню." },
  { time: "28:22", seconds: 1702, title: "Заключение и следующая часть", description: "Финальный просмотр и план продолжения серии." },
];

const clientWebsiteTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Introduction and project context", description: "The real client brief and the plan for the lesson." },
  { time: "00:20", seconds: 20, title: "Moodboards in web design", description: "Preparing the visual direction for the website." },
  { time: "01:15", seconds: 75, title: "What the client provided", description: "Reviewing the source materials and requirements." },
  { time: "02:57", seconds: 177, title: "Collecting references", description: "Finding examples for structure and visual style." },
  { time: "04:50", seconds: 290, title: "Website frame dimensions", description: "Setting up the working frame in Figma." },
  { time: "06:05", seconds: 365, title: "Starting the design in Figma", description: "Moving from an empty frame to the page structure." },
  { time: "07:12", seconds: 432, title: "First-section background", description: "Building the foundation of the hero section." },
  { time: "10:26", seconds: 626, title: "Finding images on Unsplash", description: "Selecting the right graphics for the composition." },
  { time: "12:04", seconds: 724, title: "Removing the image background", description: "Preparing the source image with an AI background remover." },
  { time: "12:43", seconds: 763, title: "Editing images in Figma", description: "Placing and adjusting graphics inside the layout." },
  { time: "15:25", seconds: 925, title: "Image color correction", description: "Matching the image to the website palette." },
  { time: "16:15", seconds: 975, title: "Adding the H1 heading", description: "Creating the main text emphasis for the page." },
  { time: "16:55", seconds: 1015, title: "Working with typography", description: "Setting fonts, spacing, and hierarchy." },
  { time: "19:42", seconds: 1182, title: "Designing buttons", description: "Building the primary CTA button." },
  { time: "21:19", seconds: 1279, title: "Adding icons with Iconify", description: "Bringing plugin icons into the interface." },
  { time: "21:50", seconds: 1310, title: "Converting the button to Auto Layout", description: "Turning the CTA into a responsive component." },
  { time: "23:10", seconds: 1390, title: "Creating the secondary button", description: "Adding the second action to the hero section." },
  { time: "23:56", seconds: 1436, title: "Cleaning layers and Auto Layout", description: "Organizing layers and the responsive layout structure." },
  { time: "25:22", seconds: 1522, title: "Placing the logo", description: "Adding the logo to the top of the website." },
  { time: "26:00", seconds: 1560, title: "Building the navigation", description: "Creating the menu and header elements." },
  { time: "27:41", seconds: 1661, title: "Navigation Auto Layout", description: "Making the menu structure responsive." },
  { time: "28:22", seconds: 1702, title: "Conclusion and next part", description: "Reviewing the result and previewing the next episode." },
];

const marketplaceCardsTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Выбор ниши и товара", description: "Выбор премиального парфюма и качественного изображения без фона." },
  { time: "00:52", seconds: 52, title: "Идеи для фона в ChatGPT", description: "Генерация текстовых концепций для окружения карточки." },
  { time: "02:25", seconds: 145, title: "Финальный фон", description: "Создание изображения и вписывание товара в композицию с тенями." },
  { time: "05:58", seconds: 358, title: "Flair.ai", description: "Сравнение ChatGPT с сервисом для продуктовых карточек." },
  { time: "07:22", seconds: 442, title: "Макет в Figma", description: "Размер фрейма и рабочее пространство под маркетплейс." },
  { time: "09:50", seconds: 590, title: "Текст и шрифты", description: "Заголовки и шрифт, который поддерживает премиальность товара." },
  { time: "12:35", seconds: 755, title: "Улучшение визуала", description: "Градиенты и световые оверлеи для атмосферы и читаемости." },
  { time: "16:50", seconds: 1010, title: "Инфографика размеров", description: "Графические индикаторы для габаритов продукта." },
  { time: "19:40", seconds: 1180, title: "Декоративные плашки", description: "Импорт векторов и цветовая коррекция под стиль карточки." },
  { time: "23:15", seconds: 1395, title: "Экспорт результата", description: "Финальная проверка и выбор формата сохранения." },
];

const marketplaceCardsTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Choosing niche and product", description: "Selecting a premium perfume and a clean product image." },
  { time: "00:52", seconds: 52, title: "Background ideas in ChatGPT", description: "Generating text concepts for the product-card environment." },
  { time: "02:25", seconds: 145, title: "Final background", description: "Generating the scene and placing the product with shadows." },
  { time: "05:58", seconds: 358, title: "Flair.ai overview", description: "Comparing ChatGPT with a specialized product-card tool." },
  { time: "07:22", seconds: 442, title: "Figma layout", description: "Setting up the marketplace frame and workspace." },
  { time: "09:50", seconds: 590, title: "Text and fonts", description: "Headlines and typography that support the premium feeling." },
  { time: "12:35", seconds: 755, title: "Visual polish", description: "Gradients and light overlays for readability and atmosphere." },
  { time: "16:50", seconds: 1010, title: "Size infographics", description: "Graphic indicators for product dimensions." },
  { time: "19:40", seconds: 1180, title: "Decorative badges", description: "Importing vectors and recoloring them to match the card style." },
  { time: "23:15", seconds: 1395, title: "Export", description: "Final review and choosing the export format." },
];

const referencesTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Три правила референсов", description: "Почему важно вдохновляться, а не копировать дизайн полностью." },
  { time: "00:45", seconds: 45, title: "Где искать идеи", description: "Dribbble и Behance как быстрые источники качественных шотов." },
  { time: "01:35", seconds: 95, title: "Структура и навигация", description: "Сравнение расположения элементов в референсе и итоговом проекте." },
  { time: "03:15", seconds: 195, title: "Уникальный дизайн", description: "Как менять структуру главной страницы и добавлять собственную графику." },
  { time: "04:50", seconds: 290, title: "Цвета и формы", description: "Изменение палитры, скруглений, кнопок и размеров элементов." },
  { time: "06:20", seconds: 380, title: "Мудборды", description: "Шаблоны moodboard для согласования стилистики с клиентом." },
  { time: "08:10", seconds: 490, title: "Расширенные шаблоны", description: "Обзор набора готовых мудбордов для разных проектов." },
  { time: "09:35", seconds: 575, title: "ИИ-анимация персонажа", description: "Оживление изображения ворона через ChatGPT и нейросети для видео." },
  { time: "11:15", seconds: 675, title: "Итоги правил", description: "Как комбинировать элементы из разных источников в один продукт." },
];

const referencesTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Three rules for references", description: "Why references should inspire, not become full copies." },
  { time: "00:45", seconds: 45, title: "Where to find ideas", description: "Using Dribbble and Behance for high-quality visual directions." },
  { time: "01:35", seconds: 95, title: "Structure and navigation", description: "Comparing layout decisions in a reference and the final project." },
  { time: "03:15", seconds: 195, title: "Making it unique", description: "Changing hero structure and adding your own graphic language." },
  { time: "04:50", seconds: 290, title: "Colors and shapes", description: "Changing palette, radius, button style, and element scale." },
  { time: "06:20", seconds: 380, title: "Moodboards", description: "Moodboard templates for aligning visual direction with a client." },
  { time: "08:10", seconds: 490, title: "Extended templates", description: "A set of ready-made moodboards for different project types." },
  { time: "09:35", seconds: 575, title: "AI character animation", description: "Animating a raven image through ChatGPT and AI video tools." },
  { time: "11:15", seconds: 675, title: "Rule recap", description: "Combining elements from different sources into one original product." },
];

const figmaToCodexTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Как перенести сайт из Figma в код", description: "Задача урока и итоговый формат рабочего сайта." },
  { time: "00:53", seconds: 53, title: "Почему я отказался от Tilda", description: "Причины перехода от конструктора к полноценному коду." },
  { time: "02:07", seconds: 127, title: "Подготовка макета в Figma", description: "Проверка фрейма и исходников перед передачей в Codex." },
  { time: "03:12", seconds: 192, title: "Установка и настройка Codex", description: "Подготовка локального инструмента к работе над сайтом." },
  { time: "04:13", seconds: 253, title: "Создание папки проекта", description: "Организация файлов для новой кодовой версии сайта." },
  { time: "05:09", seconds: 309, title: "Подключение Figma к Codex", description: "Настройка Figma MCP для чтения выбранного макета." },
  { time: "05:47", seconds: 347, title: "Промпт и постоянная инструкция", description: "Формулировка задачи и правил, которые Codex должен соблюдать." },
  { time: "08:18", seconds: 498, title: "Добавляем локальные шрифты", description: "Подключение шрифтов из дизайна в проект." },
  { time: "09:17", seconds: 557, title: "Первый запрос на вёрстку", description: "Передача выбранного фрейма и запуск первой реализации." },
  { time: "10:30", seconds: 630, title: "Результат первой итерации", description: "Сверка сгенерированной страницы с исходным макетом." },
  { time: "11:46", seconds: 706, title: "Правки через аннотации", description: "Исправление расхождений по точечным комментариям." },
  { time: "14:04", seconds: 844, title: "Планируем и добавляем анимации", description: "Описание поведения интерфейса и реализация движения." },
  { time: "16:32", seconds: 992, title: "Мобильная версия и адаптив", description: "Проверка и доработка страницы для маленьких экранов." },
  { time: "17:58", seconds: 1078, title: "Публикация сайта на Vercel", description: "Развёртывание готового проекта в интернете." },
  { time: "20:15", seconds: 1215, title: "Подключение собственного домена", description: "Привязка домена к опубликованному проекту." },
  { time: "21:34", seconds: 1294, title: "Админ-панель вместо CMS", description: "Подход к управлению контентом без конструктора." },
  { time: "22:30", seconds: 1350, title: "Vercel или российский хостинг", description: "Сравнение вариантов размещения готового сайта." },
  { time: "23:13", seconds: 1393, title: "Где научиться всему процессу", description: "Финальные рекомендации и дальнейшие шаги." },
];

const figmaToCodexTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Moving a website from Figma to code", description: "The lesson goal and the final working website format." },
  { time: "00:53", seconds: 53, title: "Why I stopped using Tilda", description: "Why the workflow moved from a builder to real code." },
  { time: "02:07", seconds: 127, title: "Preparing the Figma layout", description: "Checking the frame and assets before handing them to Codex." },
  { time: "03:12", seconds: 192, title: "Installing and configuring Codex", description: "Preparing the local tool for the website project." },
  { time: "04:13", seconds: 253, title: "Creating the project folder", description: "Organizing files for the new codebase." },
  { time: "05:09", seconds: 309, title: "Connecting Figma to Codex", description: "Setting up Figma MCP to read the selected layout." },
  { time: "05:47", seconds: 347, title: "The prompt and standing instructions", description: "Defining the task and the rules Codex must follow." },
  { time: "08:18", seconds: 498, title: "Adding local fonts", description: "Bringing the design fonts into the project." },
  { time: "09:17", seconds: 557, title: "The first implementation request", description: "Sending the selected frame and starting the first build." },
  { time: "10:30", seconds: 630, title: "First-iteration result", description: "Comparing the generated page with the source layout." },
  { time: "11:46", seconds: 706, title: "Corrections through annotations", description: "Fixing mismatches with focused visual comments." },
  { time: "14:04", seconds: 844, title: "Planning and adding animations", description: "Describing interface behavior and implementing motion." },
  { time: "16:32", seconds: 992, title: "Mobile version and responsive layout", description: "Reviewing and refining the page for smaller screens." },
  { time: "17:58", seconds: 1078, title: "Publishing the website on Vercel", description: "Deploying the finished project to the web." },
  { time: "20:15", seconds: 1215, title: "Connecting a custom domain", description: "Pointing a domain at the deployed project." },
  { time: "21:34", seconds: 1294, title: "An admin panel instead of a CMS", description: "Managing content without going back to a site builder." },
  { time: "22:30", seconds: 1350, title: "Vercel or Russian hosting", description: "Comparing hosting options for the finished website." },
  { time: "23:13", seconds: 1393, title: "Where to learn the full workflow", description: "Final recommendations and next steps." },
];

const clientWebsiteFigmaCodexTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Сайт для клиента за 50 000 ₽: что делаем", description: "Постановка задачи и план работы над сайтом реального клиента." },
  { time: "00:24", seconds: 24, title: "Референс на Tilda и проблемы с адаптивом", description: "Разбор исходной страницы и её поведения на разных экранах." },
  { time: "01:46", seconds: 106, title: "Перенос страницы в Figma через Capture Page", description: "Импорт референса в Figma для дальнейшей переработки." },
  { time: "02:32", seconds: 152, title: "Очистка автолайяутов и настройка сетки", description: "Подготовка структуры макета и рабочей сетки." },
  { time: "04:14", seconds: 254, title: "Редизайн навигации и первой секции", description: "Обновление шапки и первого экрана сайта." },
  { time: "06:30", seconds: 390, title: "Логотип и персонаж через ChatGPT", description: "Создание визуальных элементов для нового дизайна." },
  { time: "11:29", seconds: 689, title: "AI-анимация в Syntx и Kling", description: "Подготовка анимации для визуала с помощью AI-инструментов." },
  { time: "14:30", seconds: 870, title: "Вторая секция и плагин Blobs", description: "Сборка следующего блока страницы и декоративной графики." },
  { time: "18:19", seconds: 1099, title: "Мобильная версия макета", description: "Адаптация дизайна под мобильный экран." },
  { time: "21:31", seconds: 1291, title: "Перенос из Figma в Codex через Figma MCP", description: "Передача готового макета в Codex для вёрстки." },
  { time: "23:31", seconds: 1411, title: "Результат в браузере и проверка адаптива", description: "Проверка собранной страницы на компьютере и телефоне." },
  { time: "24:03", seconds: 1443, title: "Исправление бага мобильной навигации", description: "Точечная доработка поведения меню на мобильном устройстве." },
  { time: "26:15", seconds: 1575, title: "Итоги урока и следующая часть", description: "Финальный результат и анонс продолжения серии." },
];

const clientWebsiteFigmaCodexTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "The 50,000 ₽ client website: the plan", description: "The brief and workflow for a real client website." },
  { time: "00:24", seconds: 24, title: "The Tilda reference and responsive issues", description: "Reviewing the source page and its behavior across screen sizes." },
  { time: "01:46", seconds: 106, title: "Moving the page into Figma with Capture Page", description: "Importing the reference into Figma for redesign." },
  { time: "02:32", seconds: 152, title: "Cleaning auto layouts and setting up the grid", description: "Preparing the layout structure and working grid." },
  { time: "04:14", seconds: 254, title: "Redesigning navigation and the first section", description: "Updating the header and hero section." },
  { time: "06:30", seconds: 390, title: "Creating a logo and character with ChatGPT", description: "Building visual elements for the new design." },
  { time: "11:29", seconds: 689, title: "AI animation in Syntx and Kling", description: "Animating the visual with AI tools." },
  { time: "14:30", seconds: 870, title: "The second section and the Blobs plugin", description: "Building the next page block and its decorative graphics." },
  { time: "18:19", seconds: 1099, title: "The mobile layout", description: "Adapting the design for a mobile screen." },
  { time: "21:31", seconds: 1291, title: "Moving from Figma to Codex through Figma MCP", description: "Passing the finished layout to Codex for implementation." },
  { time: "23:31", seconds: 1411, title: "Browser result and responsive review", description: "Checking the implemented page on desktop and mobile." },
  { time: "24:03", seconds: 1443, title: "Fixing the mobile navigation bug", description: "Correcting the menu behavior on mobile." },
  { time: "26:15", seconds: 1575, title: "Lesson recap and the next part", description: "Reviewing the result and previewing the continuation." },
];

const aiWebsiteVibeDesignTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Вайбкодинг сайта для клиента: план урока", description: "План продолжения работы над реальным клиентским сайтом." },
  { time: "00:27", seconds: 27, title: "Результат урока 1 и запуск локального сервера", description: "Проверка первой версии проекта и подготовка локальной среды." },
  { time: "01:22", seconds: 82, title: "Три способа продолжить дизайн сайта", description: "Сравнение подходов к развитию существующего макета." },
  { time: "02:02", seconds: 122, title: "GPT Image 2.0: генерируем новые секции", description: "Создание вариантов новых блоков сайта через GPT Image 2.0." },
  { time: "04:15", seconds: 255, title: "Промпт для сетки 1440/1200 px", description: "Настройка размеров холста и контентной сетки в запросе." },
  { time: "05:31", seconds: 331, title: "Product Design в Codex и шаблон стиля", description: "Передача визуального направления и правил проекта в Codex." },
  { time: "09:10", seconds: 550, title: "Почему прямой AI-дизайн получается шаблонным", description: "Разбор слабых мест полностью автоматической генерации дизайна." },
  { time: "10:32", seconds: 632, title: "Выбираем секции и собираем макет в Figma", description: "Отбор удачных блоков и сборка цельной страницы в Figma." },
  { time: "13:47", seconds: 827, title: "Image to Code: вёрстка сайта по изображению", description: "Перенос выбранного визуального решения в рабочий код." },
  { time: "15:47", seconds: 947, title: "Иконки без артефактов в GPT Image", description: "Генерация чистых иконок для интерфейса сайта." },
  { time: "18:10", seconds: 1090, title: "Результат в Codex и перенос сайта в Figma", description: "Проверка реализации и возврат собранных секций в макет." },
  { time: "19:04", seconds: 1144, title: "Ручная доработка секций в Figma", description: "Точечная правка композиции и деталей после AI-генерации." },
  { time: "21:05", seconds: 1265, title: "Отзывы, форма и маркетинг секций", description: "Добавление контентных блоков, которые поддерживают задачу сайта." },
  { time: "22:04", seconds: 1324, title: "Рекламное видео для сайта в Seedance 2.5", description: "Подготовка сценария и референсов для AI-видео." },
  { time: "25:16", seconds: 1516, title: "Настройки Syntx: Omni Reference и 720p", description: "Выбор параметров для 15-секундной генерации в Seedance 2.5." },
  { time: "26:54", seconds: 1614, title: "Что получилось в 15-секундной генерации", description: "Просмотр результата и выявление проблемного финала ролика." },
  { time: "27:45", seconds: 1665, title: "Исправляем AI-видео в Adobe Premiere Pro", description: "Монтажная правка неудачной части готовой генерации." },
  { time: "29:04", seconds: 1744, title: "Готовые иконки, иллюстрации и видео", description: "Обзор подготовленного набора визуальных материалов." },
  { time: "29:47", seconds: 1787, title: "Возвращаем новые секции в основной проект Codex", description: "Интеграция доработанных блоков в рабочую версию сайта." },
  { time: "31:07", seconds: 1867, title: "Что будет в финальном уроке", description: "Анонс заключительной части серии о клиентском сайте." },
];

const aiWebsiteVibeDesignTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "The client website vibe-coding plan", description: "Planning the next stage of the real client website project." },
  { time: "00:27", seconds: 27, title: "Lesson one result and local server", description: "Reviewing the first build and preparing the local environment." },
  { time: "01:22", seconds: 82, title: "Three ways to continue the website design", description: "Comparing approaches for extending the existing layout." },
  { time: "02:02", seconds: 122, title: "Generating new sections with GPT Image 2.0", description: "Creating alternative website sections with GPT Image 2.0." },
  { time: "04:15", seconds: 255, title: "A prompt for the 1440/1200 px grid", description: "Defining the canvas and content grid dimensions in the prompt." },
  { time: "05:31", seconds: 331, title: "Product Design in Codex and the style template", description: "Passing the visual direction and project rules to Codex." },
  { time: "09:10", seconds: 550, title: "Why direct AI design looks generic", description: "Examining the weak points of fully automated design generation." },
  { time: "10:32", seconds: 632, title: "Selecting sections and assembling them in Figma", description: "Choosing the strongest blocks and building a coherent Figma page." },
  { time: "13:47", seconds: 827, title: "Image to Code: implementing from an image", description: "Turning the selected visual direction into working code." },
  { time: "15:47", seconds: 947, title: "Artifact-free icons in GPT Image", description: "Generating clean interface icons for the website." },
  { time: "18:10", seconds: 1090, title: "The Codex result and moving it into Figma", description: "Reviewing the implementation and returning the sections to the design." },
  { time: "19:04", seconds: 1144, title: "Manual section refinements in Figma", description: "Adjusting composition and details after AI generation." },
  { time: "21:05", seconds: 1265, title: "Testimonials, form, and section marketing", description: "Adding content blocks that support the website's business goal." },
  { time: "22:04", seconds: 1324, title: "A Seedance 2.5 promo video for the website", description: "Preparing the script and references for an AI-generated video." },
  { time: "25:16", seconds: 1516, title: "Syntx settings: Omni Reference and 720p", description: "Choosing settings for a 15-second Seedance 2.5 generation." },
  { time: "26:54", seconds: 1614, title: "The 15-second generation result", description: "Reviewing the output and identifying its problematic ending." },
  { time: "27:45", seconds: 1665, title: "Fixing the AI video in Adobe Premiere Pro", description: "Editing the weak part of the generated video." },
  { time: "29:04", seconds: 1744, title: "Finished icons, illustrations, and video", description: "Reviewing the completed set of visual assets." },
  { time: "29:47", seconds: 1787, title: "Returning new sections to the main Codex project", description: "Integrating the refined blocks into the working website." },
  { time: "31:07", seconds: 1867, title: "What the final lesson will cover", description: "Previewing the last part of the client website series." },
];

function lesson(input: LearnLesson): LearnLesson {
  return { ...input, author: input.author ?? learnDefaultAuthor };
}

export const publicLearnLessons: LearnLesson[] = [
  lesson({
    slug: "actual-ai-tools-2026",
    title: {
      ru: "Актуальные нейросети в 2026 году",
      en: "The AI tools that matter in 2026",
    },
    description: {
      ru: "За всё время работы я попробовал около 40 сервисов с нейросетями. Но эти 5 закрывают 99% моих задач в дизайне и создании контента.",
      en: "After trying around 40 AI services, these five tools cover 99% of my design and content creation tasks.",
    },
    seoTitle: {
      ru: "Актуальные нейросети в 2026 году — 5 AI-сервисов для дизайна и контента",
      en: "The AI tools that matter in 2026 — five services for design and content",
    },
    seoDescription: {
      ru: "Урок Влада Воронежцева: 5 нейросетей, которые закрывают основные задачи в дизайне, визуалах, видео и создании контента в 2026 году.",
      en: "A practical lesson by Vlad Voronezhtsev: five AI tools that cover design, visuals, video, and content creation in 2026.",
    },
    category: "ai-video",
    duration: "07:45",
    durationIso: "PT7M45S",
    status: "Available",
    access: "free",
    thumbnailPath: `${learnAssetBase}/video/actual-ai-tools-2026-cover.png`,
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    releaseNote: {
      ru: "Главный урок раздела Learn: рабочий набор AI-инструментов без лишнего шума.",
      en: "The featured Learn lesson: a practical AI toolkit without the noise.",
    },
    filters: ["Standalone", "Models"],
    topics: {
      ru: ["AI tools", "Дизайн", "Контент", "2026"],
      en: ["AI tools", "Design", "Content", "2026"],
    },
    whatYouWillLearn: {
      ru: ["Собрать короткий рабочий стек AI-сервисов", "Понять, какие инструменты закрывают дизайн и контент", "Не распыляться на десятки похожих нейросетей"],
      en: ["Build a compact AI tool stack", "Understand which tools cover design and content work", "Avoid wasting time on dozens of similar services"],
    },
    updatedNote: {
      ru: "Локальное видео оптимизировано для сайта через ffmpeg 2026-06-06.",
      en: "Local video optimized for the site with ffmpeg on 2026-06-06.",
    },
    localVideo: {
      src: `${learnAssetBase}/video/actual-ai-tools-2026.mp4`,
      posterPath: `${learnAssetBase}/video/actual-ai-tools-2026-cover.png`,
      contentUrl: `https://opten.space${learnAssetBase}/video/actual-ai-tools-2026.mp4`,
    },
    timestamps: { ru: actualAiToolsTimestampsRu, en: actualAiToolsTimestampsEn },
    materials: actualAiToolsMaterials,
  }),
  lesson({
    slug: "ai-avatar-motion-control",
    title: {
      ru: "Kling Motion Control: AI-аватар под нужные движения",
      en: "Kling Motion Control: AI avatar with the right movement",
    },
    description: {
      ru: "Меняем внешность, голос и получаем персонажа, который говорит и двигается в точности как видео референс. По этой же схеме делаются все танцующие мемы и персонажи из соцсетей. В этом уроке разобрал полный процесс: от съёмки до готового ролика.",
      en: "We change the appearance and voice and get a character that speaks and moves exactly like the video reference. The same workflow is used for dancing memes and social-media characters. In this lesson I break down the full process, from shooting to the final video.",
    },
    seoTitle: {
      ru: "Как сделать AI-аватара и анимировать его в Kling Motion Control",
      en: "How to create and animate an AI avatar in Kling Motion Control",
    },
    seoDescription: {
      ru: "Практический урок по AI-аватарам: видеореференс, Syntax, 11 Labs, Kling Motion Control, липсинк и финальная сборка.",
      en: "A practical AI avatar lesson: video reference, Syntax, 11 Labs, Kling Motion Control, lip sync, and final assembly.",
    },
    category: "ai-video",
    duration: "09:38",
    durationIso: "PT9M38S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/slxq1d8u-Hg/maxresdefault.jpg",
    publishedAt: "2026-05-29",
    updatedAt: "2026-06-06",
    releaseNote: {
      ru: "Тайм-коды обновлены через локальный NotebookLM pipeline.",
      en: "Timestamps refreshed through the local NotebookLM pipeline.",
    },
    filters: ["Standalone", "Models"],
    topics: {
      ru: ["Kling", "Motion Control", "AI-аватар", "Lip sync"],
      en: ["Kling", "Motion Control", "AI avatar", "Lip sync"],
    },
    whatYouWillLearn: {
      ru: ["Подготовить видеореференс и первый кадр", "Собрать образ персонажа в Syntax", "Сделать озвучку через 11 Labs", "Анимировать аватара в Kling Motion Control"],
      en: ["Prepare the video reference and first frame", "Create a character image in Syntax", "Generate voiceover in 11 Labs", "Animate the avatar in Kling Motion Control"],
    },
    updatedNote: {
      ru: "Тайм-коды сгенерированы через локальный NotebookLM pipeline 2026-06-06.",
      en: "Timestamps generated through the local NotebookLM pipeline on 2026-06-06.",
    },
    youtubeId: "slxq1d8u-Hg",
    youtubeUrl: "https://youtu.be/slxq1d8u-Hg",
    localizedVideo: {
      ru: { youtubeId: "slxq1d8u-Hg", youtubeUrl: "https://youtu.be/slxq1d8u-Hg", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "slxq1d8u-Hg", youtubeUrl: "https://youtu.be/slxq1d8u-Hg", captionLanguage: "en" },
    },
    timestamps: { ru: aiAvatarTimestampsRu, en: aiAvatarTimestampsEn },
    materials: aiAvatarMaterials,
  }),
  lesson({
    slug: "junior-designer-1100-order",
    title: {
      ru: "Новичок доделывает заказ за $1100: разбор дизайна сайта",
      en: "A junior finishes a $1100 order: website design review",
    },
    description: {
      ru: "Второй ролик про то как я делаю дизайн сайта за 1,100 долларов, но в этот раз я решил сменить формат съёмки и дал возможность абсолютному новичку который только смотрел теорию по фигме, доделать дизайн страницы. А я тем временем уже буду делать разбор его работы и исправлять. Таким образом мы разберём все ошибки которые новички допускают при создании дизайна сайта в Figma, приятного просмотра.",
      en: "The second video about how I design a website for $1,100, but this time I changed the filming format and let an absolute beginner, who had only watched Figma theory, finish the page design. Meanwhile, I review his work and fix it. This way we go through all the mistakes beginners make when designing a website in Figma.",
    },
    category: "vibe-design",
    duration: "29:57",
    durationIso: "PT29M57S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/blrSogS4yXM/maxresdefault.jpg",
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-06",
    releaseNote: {
      ru: "Практический разбор ошибок начинающего дизайнера на реальном заказе.",
      en: "A practical review of junior design mistakes on a real client order.",
    },
    filters: ["Standalone", "Builder"],
    topics: {
      ru: ["Figma", "UX/UI", "Разбор макета", "Сетка"],
      en: ["Figma", "UX/UI", "Design critique", "Grid"],
    },
    whatYouWillLearn: {
      ru: ["Проверять сетку и границы контента", "Выравнивать отступы и фреймы", "Улучшать карточки, иконки и FAQ-блоки"],
      en: ["Check grid and content boundaries", "Align spacing and frames", "Improve cards, icons, and FAQ blocks"],
    },
    updatedNote: {
      ru: "Тайм-коды сгенерированы через локальный NotebookLM pipeline 2026-06-06.",
      en: "Timestamps generated through the local NotebookLM pipeline on 2026-06-06.",
    },
    youtubeId: "blrSogS4yXM",
    youtubeUrl: "https://youtu.be/blrSogS4yXM",
    localizedVideo: {
      ru: { youtubeId: "blrSogS4yXM", youtubeUrl: "https://youtu.be/blrSogS4yXM", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "blrSogS4yXM", youtubeUrl: "https://youtu.be/blrSogS4yXM", captionLanguage: "en" },
    },
    timestamps: { ru: juniorOrderTimestampsRu, en: juniorOrderTimestampsEn },
    materials: juniorOrderMaterials,
  }),
  lesson({
    slug: "client-website-navigation-hero",
    title: {
      ru: "Дизайн сайта за $1100: навигация и главная секция в Figma",
      en: "$1100 website design: navigation and hero section in Figma",
    },
    description: {
      ru: "В этом видео я покажу, как сделать сайт в Figma работая над реальным проектом по веб-дизайну: клиент заплатил мне за создание сайта в Figma, и я делюсь полным процессом. Вы узнаете как правильно выстраивать дизайн-процессы, какие UX/UI решения принимаю и какие материалы для дизайна использую. Это первая серия, впереди ещё больше полезных фишек для дизайнеров и тех, кто хочет зарабатывать на веб-дизайне.",
      en: "In this video I show how to design a website in Figma while working on a real web-design project: a client paid me to create a website in Figma, and I share the full process. You will learn how I structure design processes, what UX/UI decisions I make, and what design materials I use. This is the first episode, with more useful techniques ahead for designers and anyone who wants to earn from web design.",
    },
    category: "vibe-design",
    duration: "29:34",
    durationIso: "PT29M34S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/MEs-DdIjPy0/maxresdefault.jpg",
    publishedAt: "2026-05-24",
    updatedAt: "2026-06-06",
    releaseNote: {
      ru: "Подходит как базовый урок по созданию hero-секции для коммерческого сайта.",
      en: "A practical base lesson for designing a commercial website hero section.",
    },
    filters: ["Standalone", "Builder"],
    topics: {
      ru: ["Figma", "Hero section", "Навигация", "UX/UI"],
      en: ["Figma", "Hero section", "Navigation", "UX/UI"],
    },
    whatYouWillLearn: {
      ru: ["Собрать moodboard и визуальную основу", "Подготовить фон и графику", "Сделать CTA-кнопки и навигацию через Auto Layout"],
      en: ["Build a moodboard and visual base", "Prepare the background and graphics", "Create CTA buttons and navigation with Auto Layout"],
    },
    updatedNote: {
      ru: "Тайм-коды сгенерированы через локальный NotebookLM pipeline 2026-06-06.",
      en: "Timestamps generated through the local NotebookLM pipeline on 2026-06-06.",
    },
    youtubeId: "MEs-DdIjPy0",
    youtubeUrl: "https://youtu.be/MEs-DdIjPy0",
    localizedVideo: {
      ru: { youtubeId: "MEs-DdIjPy0", youtubeUrl: "https://youtu.be/MEs-DdIjPy0", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "MEs-DdIjPy0", youtubeUrl: "https://youtu.be/MEs-DdIjPy0", captionLanguage: "en" },
    },
    timestamps: { ru: clientWebsiteTimestampsRu, en: clientWebsiteTimestampsEn },
    materials: clientWebsiteMaterials,
  }),
  lesson({
    slug: "ai-marketplace-product-cards",
    title: {
      ru: "AI-дизайн карточек товаров для OZON и Wildberries",
      en: "AI product-card design for marketplaces",
    },
    description: {
      ru: "В этом видео покажу, как с помощью ChatGPT и нейросетей можно сделать красивые карточки товаров для маркетплейсов без единого фото! Я просто взял изображение товара, сгенерировал фон, совместил их — и получил полноценную карточку, готовую для загрузки на OZON и Wildberries. Идеально для тех, у кого нет студии или бюджета на съёмку. Смотри до конца, чтобы понять, как это может упростить тебе жизнь.",
      en: "In this video I show how to use ChatGPT and AI tools to create beautiful product cards for marketplaces without a single photo shoot. I take a product image, generate a background, combine them, and get a complete card ready for OZON and Wildberries. Perfect for anyone without a studio or shooting budget. Watch to the end to see how much this can simplify your workflow.",
    },
    category: "ai-image",
    duration: "26:22",
    durationIso: "PT26M22S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/-0elJixu1kc/maxresdefault.jpg",
    publishedAt: "2026-05-20",
    updatedAt: "2026-06-06",
    releaseNote: {
      ru: "Урок для дизайнеров карточек товаров и визуалов для маркетплейсов.",
      en: "A lesson for product-card designers and marketplace visual work.",
    },
    filters: ["Standalone", "Brand"],
    topics: {
      ru: ["ChatGPT", "Figma", "Маркетплейсы", "Product cards"],
      en: ["ChatGPT", "Figma", "Marketplaces", "Product cards"],
    },
    whatYouWillLearn: {
      ru: ["Сгенерировать фон под товар", "Собрать карточку в Figma", "Добавить текст, инфографику и декоративные элементы"],
      en: ["Generate a product background", "Build the card in Figma", "Add text, infographics, and decorative elements"],
    },
    updatedNote: {
      ru: "Тайм-коды сгенерированы через локальный NotebookLM pipeline 2026-06-06.",
      en: "Timestamps generated through the local NotebookLM pipeline on 2026-06-06.",
    },
    youtubeId: "-0elJixu1kc",
    youtubeUrl: "https://youtu.be/-0elJixu1kc",
    localizedVideo: {
      ru: { youtubeId: "-0elJixu1kc", youtubeUrl: "https://youtu.be/-0elJixu1kc", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "-0elJixu1kc", youtubeUrl: "https://youtu.be/-0elJixu1kc", captionLanguage: "en" },
    },
    timestamps: { ru: marketplaceCardsTimestampsRu, en: marketplaceCardsTimestampsEn },
    materials: marketplaceCardsMaterials,
  }),
  lesson({
    slug: "web-design-references",
    title: {
      ru: "Как веб-дизайнеру работать с референсами и не копировать",
      en: "How web designers use references without copying",
    },
    description: {
      ru: "В этом видео я рассказываю про то, как воровать в веб-дизайне правильно. Почему все дизайнеры собирают референсы, создают мудборды и откуда вообще брать вдохновение для дизайна сайта. Если ты когда-либо сталкивался с проблемой «не знаю с чего начать дизайн», это видео для тебя. Я объясню, зачем дизайнеры анализируют чужие работы, копируют элементы интерфейсов, используют референсы Dribbble и Behance, и почему это не считается воровством, если делать всё с умом. Разберём примеры, как собирать референсы для лендинга, как делать уникальный UI-дизайн, комбинируя идеи с разных источников. Это видео — отличный старт для тех, кто хочет понять, как делать дизайн не с нуля, а эффективно.",
      en: "In this video I explain how to borrow ideas in web design the right way: why designers collect references, build moodboards, and where inspiration for a website design actually comes from. If you have ever felt stuck and did not know where to start a design, this lesson is for you. I explain why designers analyze other work, reuse interface ideas, study Dribbble and Behance references, and why it is not theft when done thoughtfully. We go through examples of collecting references for a landing page and making a unique UI design by combining ideas from different sources. This is a strong starting point for anyone who wants to design efficiently instead of starting from a blank page.",
    },
    category: "vibe-design",
    duration: "13:52",
    durationIso: "PT13M52S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/MsIkbE1w-fM/maxresdefault.jpg",
    publishedAt: "2026-06-04",
    updatedAt: "2026-06-06",
    releaseNote: {
      ru: "Короткий урок по насмотренности, мудбордам и этичной работе с чужими идеями.",
      en: "A focused lesson on visual taste, moodboards, and ethical use of references.",
    },
    filters: ["Standalone", "Builder"],
    topics: {
      ru: ["Референсы", "Moodboard", "Figma", "Веб-дизайн"],
      en: ["References", "Moodboard", "Figma", "Web design"],
    },
    whatYouWillLearn: {
      ru: ["Искать сильные референсы", "Анализировать структуру без копирования", "Собирать мудборды для клиента"],
      en: ["Find strong references", "Analyze structure without copying", "Build client-ready moodboards"],
    },
    updatedNote: {
      ru: "Тайм-коды сгенерированы через локальный NotebookLM pipeline 2026-06-06.",
      en: "Timestamps generated through the local NotebookLM pipeline on 2026-06-06.",
    },
    youtubeId: "MsIkbE1w-fM",
    youtubeUrl: "https://youtu.be/MsIkbE1w-fM",
    localizedVideo: {
      ru: { youtubeId: "MsIkbE1w-fM", youtubeUrl: "https://youtu.be/MsIkbE1w-fM", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "MsIkbE1w-fM", youtubeUrl: "https://youtu.be/MsIkbE1w-fM", captionLanguage: "en" },
    },
    timestamps: { ru: referencesTimestampsRu, en: referencesTimestampsEn },
    materials: referencesMaterials,
  }),
  lesson({
    slug: "figma-to-codex-website",
    title: {
      ru: "Из Figma в код: сайт через Codex без Tilda",
      en: "From Figma to code with Codex, without Tilda",
    },
    description: {
      ru: "Рабочая версия сайта из Figma за один промпт. Показываю, как перенести макет в код через Codex и Figma MCP без ручной сборки в Tilda. Это практический процесс создания сайта с помощью ИИ: дизайн остаётся в Figma, а Codex собирает рабочую версию проекта в коде. На примере сайта своего клиента прохожу весь процесс: подготавливаю фрейм и локальные шрифты, подключаю Figma MCP, передаю выбранный макет в Codex, сверяю первую версию с дизайном, исправляю расхождения через аннотации, проверяю адаптив, добавляю анимации и публикую проект через Vercel.",
      en: "A working website from Figma in one prompt. I show how to move a layout into code with Codex and Figma MCP, without manually rebuilding it in Tilda. This is a practical AI-assisted website workflow: the design stays in Figma while Codex creates the working project in code. Using a real client website, I prepare the frame and local fonts, connect Figma MCP, hand the selected layout to Codex, compare the first version with the design, fix differences through annotations, check the responsive layout, add animations, and publish the project with Vercel.",
    },
    seoTitle: {
      ru: "Как перенести сайт из Figma в код через Codex и Figma MCP",
      en: "How to move a Figma website into code with Codex and Figma MCP",
    },
    seoDescription: {
      ru: "Практический урок: перенос макета из Figma в рабочий код через Codex и Figma MCP, правки по аннотациям, адаптив, анимации и публикация на Vercel.",
      en: "A practical lesson on moving a Figma layout into working code with Codex and Figma MCP, correcting it with annotations, adding responsive behavior and motion, and deploying to Vercel.",
    },
    category: "vibe-coding",
    duration: "24:29",
    durationIso: "PT24M29S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/XRVo8ZU6Nis/maxresdefault.jpg",
    publishedAt: "2026-07-22",
    updatedAt: "2026-08-01",
    releaseNote: {
      ru: "Добавлен полный набор из 18 оригинальных глав YouTube.",
      en: "Published with all 18 original YouTube chapters.",
    },
    filters: ["Standalone", "Builder"],
    topics: {
      ru: ["Codex", "Figma MCP", "Вайб-кодинг", "Vercel"],
      en: ["Codex", "Figma MCP", "Vibe coding", "Vercel"],
    },
    whatYouWillLearn: {
      ru: ["Подготовить Figma-макет к переносу", "Подключить Figma MCP к Codex", "Исправить первую версию по аннотациям", "Проверить адаптив и опубликовать сайт"],
      en: ["Prepare a Figma layout for implementation", "Connect Figma MCP to Codex", "Correct the first build with annotations", "Verify responsive behavior and deploy the website"],
    },
    updatedNote: {
      ru: "Метаданные, обложка и 18 глав сверены с YouTube 2026-08-01.",
      en: "Metadata, thumbnail, and all 18 chapters verified against YouTube on 2026-08-01.",
    },
    youtubeId: "XRVo8ZU6Nis",
    youtubeUrl: "https://youtu.be/XRVo8ZU6Nis",
    localizedVideo: {
      ru: { youtubeId: "XRVo8ZU6Nis", youtubeUrl: "https://youtu.be/XRVo8ZU6Nis", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "XRVo8ZU6Nis", youtubeUrl: "https://youtu.be/XRVo8ZU6Nis", captionLanguage: "en" },
    },
    timestamps: { ru: figmaToCodexTimestampsRu, en: figmaToCodexTimestampsEn },
    materials: emptyMaterials,
  }),
  lesson({
    slug: "client-website-figma-codex",
    title: {
      ru: "Сайт за 50 000 ₽ в Figma и Codex",
      en: "50,000 ₽ client site in Figma and Codex",
    },
    description: {
      ru: "Собираю сайт для реального клиента за 50 000 ₽: переношу референс с Tilda в Figma, создаю визуалы и AI-анимацию, а затем верстаю первые две секции в Codex через Figma MCP. Это первый урок из серии о вайбкодинге. Показываю весь проход от сетки и адаптива до рабочего результата на компьютере и телефоне, а затем исправляю баг в навигации.",
      en: "I build a website for a real client with a 50,000 ₽ budget: move a Tilda reference into Figma, create visuals and AI animation, then implement the first two sections in Codex through Figma MCP. This is the first lesson in a vibe-coding series, covering the full path from the grid and responsive layout to a working desktop and mobile result, followed by a navigation bug fix.",
    },
    seoTitle: {
      ru: "Сайт для клиента за 50 000 ₽ в Figma и Codex через Figma MCP",
      en: "Building a 50,000 ₽ client site with Figma, Codex, and Figma MCP",
    },
    seoDescription: {
      ru: "Практический урок: перенос референса с Tilda в Figma, редизайн, AI-анимация, адаптив и вёрстка первых секций в Codex через Figma MCP.",
      en: "A practical lesson on moving a Tilda reference into Figma, redesigning it, creating AI animation, adapting it for mobile, and implementing the first sections in Codex through Figma MCP.",
    },
    category: "vibe-coding",
    duration: "27:30",
    durationIso: "PT27M30S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/hekYDp3-ErQ/maxresdefault.jpg",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-07",
    releaseNote: {
      ru: "Первый урок серии о создании сайта для реального клиента в Figma и Codex.",
      en: "The first lesson in a series about building a real client website with Figma and Codex.",
    },
    filters: ["Standalone", "Builder"],
    topics: {
      ru: ["Figma", "Codex", "Figma MCP", "Вайбкодинг"],
      en: ["Figma", "Codex", "Figma MCP", "Vibe coding"],
    },
    whatYouWillLearn: {
      ru: ["Перенести референс с Tilda в Figma", "Собрать сетку, навигацию и первые две секции", "Создать визуалы и AI-анимацию", "Перенести макет в Codex через Figma MCP и проверить адаптив"],
      en: ["Move a Tilda reference into Figma", "Build the grid, navigation, and first two sections", "Create visuals and AI animation", "Move the layout into Codex through Figma MCP and verify responsive behavior"],
    },
    updatedNote: {
      ru: "Метаданные, обложка и 13 глав сверены с YouTube 2026-08-07.",
      en: "Metadata, thumbnail, and all 13 chapters verified against YouTube on 2026-08-07.",
    },
    youtubeId: "hekYDp3-ErQ",
    youtubeUrl: "https://youtu.be/hekYDp3-ErQ",
    youtubePinnedCommentId: "UgwOceSJ09Q1jVsn6WZ4AaABAg",
    localizedVideo: {
      ru: { youtubeId: "hekYDp3-ErQ", youtubeUrl: "https://youtu.be/hekYDp3-ErQ", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "hekYDp3-ErQ", youtubeUrl: "https://youtu.be/hekYDp3-ErQ", captionLanguage: "en" },
    },
    timestamps: { ru: clientWebsiteFigmaCodexTimestampsRu, en: clientWebsiteFigmaCodexTimestampsEn },
    materials: emptyMaterials,
  }),
  lesson({
    slug: "ai-website-vibe-design",
    title: {
      ru: "Вайб-дизайн сайта с нейросетями",
      en: "AI vibe design for a client website",
    },
    description: {
      ru: "Продолжаю делать сайт для реального клиента за 50 000 ₽ и показываю три способа развить дизайн с помощью ИИ. Генерирую новые секции и иконки в GPT Image 2.0, верстаю выбранные блоки в Codex по изображению, возвращаю результат в Figma и создаю 15-секундное рекламное видео в Seedance 2.5. В финале исправляю неудачную часть AI-видео в Adobe Premiere Pro и интегрирую готовые материалы в основной проект.",
      en: "I continue building a website for a real client with a 50,000 ₽ budget and compare three ways to extend its design with AI. I generate new sections and icons in GPT Image 2.0, implement the selected blocks in Codex from an image, return the result to Figma, and create a 15-second promo video in Seedance 2.5. Finally, I repair the weak part of the AI video in Adobe Premiere Pro and integrate the finished assets into the main project.",
    },
    seoTitle: {
      ru: "Вайб-дизайн сайта с помощью нейросетей: GPT Image, Codex и Seedance",
      en: "AI website vibe design with GPT Image, Codex, and Seedance",
    },
    seoDescription: {
      ru: "Практический урок по вайб-дизайну: секции и иконки в GPT Image 2.0, вёрстка по изображению в Codex, макет в Figma и AI-видео в Seedance 2.5.",
      en: "A practical AI vibe-design lesson covering GPT Image 2.0 sections and icons, image-to-code implementation in Codex, Figma refinement, and a Seedance 2.5 promo video.",
    },
    category: "vibe-design",
    duration: "32:09",
    durationIso: "PT32M9S",
    status: "Available",
    access: "free",
    thumbnailPath: "https://i.ytimg.com/vi/ZWLiM5Wqv3M/maxresdefault.jpg",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-11",
    releaseNote: {
      ru: "Второй урок серии о создании сайта для реального клиента с помощью Figma, Codex и нейросетей.",
      en: "The second lesson in the series about building a real client website with Figma, Codex, and AI tools.",
    },
    filters: ["Standalone", "Builder"],
    topics: {
      ru: ["Вайб-дизайн", "GPT Image 2.0", "Codex", "Seedance 2.5"],
      en: ["Vibe design", "GPT Image 2.0", "Codex", "Seedance 2.5"],
    },
    whatYouWillLearn: {
      ru: ["Продолжить существующий дизайн тремя AI-способами", "Создать секции и чистые иконки в GPT Image 2.0", "Перенести дизайн в код через Codex и вернуть его в Figma", "Собрать и исправить 15-секундное AI-видео в Seedance 2.5 и Premiere Pro"],
      en: ["Extend an existing design with three AI approaches", "Create sections and clean icons in GPT Image 2.0", "Move a design into code with Codex and return it to Figma", "Create and repair a 15-second AI video with Seedance 2.5 and Premiere Pro"],
    },
    updatedNote: {
      ru: "Метаданные, живая обложка и все 20 глав сверены с YouTube 2026-08-11.",
      en: "Metadata, live thumbnail, and all 20 chapters verified against YouTube on 2026-08-11.",
    },
    youtubeId: "ZWLiM5Wqv3M",
    youtubeUrl: "https://youtu.be/ZWLiM5Wqv3M",
    localizedVideo: {
      ru: { youtubeId: "ZWLiM5Wqv3M", youtubeUrl: "https://youtu.be/ZWLiM5Wqv3M", audioLanguage: "ru", captionLanguage: "ru" },
      en: { youtubeId: "ZWLiM5Wqv3M", youtubeUrl: "https://youtu.be/ZWLiM5Wqv3M", captionLanguage: "en" },
    },
    timestamps: { ru: aiWebsiteVibeDesignTimestampsRu, en: aiWebsiteVibeDesignTimestampsEn },
    materials: aiWebsiteVibeDesignMaterials,
  }),
];

export const featuredLearnLesson = publicLearnLessons[0];

export const futureLearnCollections: LearnFutureCollection[] = [
  {
    id: "quick-start",
    title: { ru: "Нейросети с нуля", en: "Learn AI for beginners" },
    subtitle: { ru: "Быстрый старт в ИИ", en: "Free AI courses and tutorials" },
    description: { ru: "Подборка базовых уроков по нейросетям появится после публикации первого курса.", en: "A beginner AI lesson collection will appear after the first course is published." },
    lessons: 12,
    topic: "ai-image",
    image: `${legacyLearnAssetBase}/quick-start-lines.jpg`,
  },
  {
    id: "ai-video-zero-to-pro",
    title: { ru: "AI-видео с нуля", en: "AI video tutorials" },
    subtitle: { ru: "Уроки по нейросетям для видео", en: "Generative AI for video" },
    description: { ru: "Будущий курс по AI-видео, персонажам, движению, звуку и финальной сборке.", en: "A future course on AI video, characters, motion, sound, and final assembly." },
    lessons: 14,
    topic: "ai-video",
    image: `${legacyLearnAssetBase}/ai-video-smoke.jpg`,
  },
  {
    id: "vibe-coding-projects",
    title: { ru: "Вайб-кодинг с нейросетями", en: "Vibe coding lessons" },
    subtitle: { ru: "Создаем сайты и прототипы", en: "Build apps with AI tools" },
    description: { ru: "Будущая подборка по быстрым прототипам, сайтам и AI-разработке.", en: "A future collection on rapid prototypes, websites, and AI-assisted development." },
    lessons: 10,
    topic: "vibe-coding",
    image: `${legacyLearnAssetBase}/vibe-code-purple.jpg`,
  },
  {
    id: "business-ai",
    title: { ru: "Нейросети для бизнеса", en: "AI training for work" },
    subtitle: { ru: "Рабочие задачи и автоматизация", en: "Business tasks and automation" },
    description: { ru: "Будущая подборка бизнес-кейсов, автоматизаций и контент-процессов.", en: "A future collection of business cases, automation, and content workflows." },
    lessons: 9,
    topic: "business",
    image: `${legacyLearnAssetBase}/business-jars.jpg`,
  },
  {
    id: "tools-reviews",
    title: { ru: "AI-инструменты для дизайна", en: "Best AI tools" },
    subtitle: { ru: "Видео, промпты и сравнения", en: "Prompts, design and video" },
    description: { ru: "Будущие обзоры сервисов и сравнительные разборы AI-инструментов.", en: "Future service reviews and AI-tool comparisons." },
    lessons: 9,
    topic: "ai-video",
    image: `${legacyLearnAssetBase}/tools-server-corridor.jpg`,
  },
];

export const learnCourses: LearnCourse[] = [];

const standaloneCollection: LearnCollection = {
  id: "standalone-videos",
  title: { ru: "Все уроки", en: "All lessons" },
  description: {
    ru: "Одиночные видео без продолжения: практические разборы по AI, дизайну, видео и рабочим процессам.",
    en: "Standalone videos without a sequence: practical lessons on AI, design, video, and workflows.",
  },
  kind: "standalone",
  categoryLabel: { ru: "Одиночные уроки", en: "Single lessons" },
  lessons: publicLearnLessons,
};

const courseCollections: LearnCollection[] = learnCourses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  kind: "course",
  categoryLabel: course.label,
  progress: course.progress,
  lessons: course.lessons,
}));

export const learnCollections: LearnCollection[] = [standaloneCollection, ...courseCollections];

const templateCourseLessons: LearnLesson[] = [
  lesson({
    ...publicLearnLessons[0],
    slug: "template-course-01",
    title: { ru: "Шаблон курса: вводный открытый урок", en: "Course template: open intro lesson" },
    description: {
      ru: "Первый бесплатный урок подборки: используется для проверки карточки, сайдбара и прогресса курса.",
      en: "The first free course lesson used to verify the course card, sidebar, and progress state.",
    },
    status: "Completed",
    access: "free",
    releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
  }),
  lesson({
    ...publicLearnLessons[1],
    slug: "template-course-02",
    title: { ru: "Шаблон курса: инструменты и подготовка", en: "Course template: tools and preparation" },
    description: {
      ru: "Открытый урок подборки для состояния выполненного урока и переходов внутри курса.",
      en: "An open course lesson for testing completed state and in-course navigation.",
    },
    status: "Completed",
    access: "free",
    releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
  }),
  lesson({
    ...publicLearnLessons[2],
    slug: "template-course-03",
    title: { ru: "Шаблон курса: референсы и структура", en: "Course template: references and structure" },
    description: {
      ru: "Открытый урок подборки для проверки промежуточного состояния списка уроков.",
      en: "An open course lesson for testing the middle state of the lesson outline.",
    },
    status: "Completed",
    access: "free",
    releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
  }),
  lesson({
    ...publicLearnLessons[3],
    slug: "template-course-04",
    title: { ru: "Шаблон курса: текущий урок подборки", en: "Course template: current collection lesson" },
    description: {
      ru: "Основной шаблонный экран курса: текущий урок, материалы, вкладки Уроки/Тайм-коды и прогресс.",
      en: "The primary course template screen: current lesson, materials, Lessons/Timestamps tabs, and progress.",
    },
    status: "In progress",
    access: "free",
    releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
  }),
  lesson({
    ...publicLearnLessons[4],
    slug: "template-course-05",
    title: { ru: "Шаблон курса: следующий открытый урок", en: "Course template: next open lesson" },
    description: {
      ru: "Открытый урок после текущего, чтобы видеть поведение будущих доступных уроков.",
      en: "An open lesson after the current one, used to verify future available lesson behavior.",
    },
    status: "Available",
    access: "free",
    releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
  }),
  lesson({
    ...publicLearnLessons[5],
    slug: "template-course-06",
    title: { ru: "Шаблон курса: Pro-урок с блокировкой", en: "Course template: locked Pro lesson" },
    description: {
      ru: "Шаблон заблокированного урока с Pro-плашкой на видео и подписью в списке уроков.",
      en: "A locked lesson template with the Pro overlay on video and locked label in the lesson outline.",
    },
    status: "Available",
    access: "full-platform",
    fullAccessOnly: true,
    releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
  }),
  lesson({
    ...publicLearnLessons[1],
    slug: "template-course-07",
    title: { ru: "Шаблон курса: второй Pro-урок", en: "Course template: second Pro lesson" },
    description: {
      ru: "Дополнительный заблокированный урок для проверки длинного списка и одинаковых Pro-состояний.",
      en: "An additional locked lesson for checking longer outlines and repeated Pro states.",
    },
    status: "Available",
    access: "full-platform",
    fullAccessOnly: true,
    releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
  }),
];

const templateStandaloneLesson = lesson({
  ...publicLearnLessons[0],
  slug: "template-standalone-lesson",
  title: { ru: "Шаблон одиночного урока", en: "Standalone lesson template" },
  description: {
    ru: "Шаблон страницы одиночного видео: без вкладки уроков, только тайм-коды, автор и Pro-блок справа.",
    en: "A standalone video page template: no lesson-list tab, only timestamps, author card, and Pro block on the right.",
  },
  releaseNote: { ru: "Template-only lesson. Hidden from SEO and sitemap.", en: "Template-only lesson. Hidden from SEO and sitemap." },
});

export const learnTemplateCollections: LearnCollection[] = [
  {
    id: "course",
    title: { ru: "Шаблон подборки курса", en: "Course collection template" },
    description: {
      ru: "Внутренний шаблон будущей подборки: прогресс, список уроков, бесплатные и Pro-состояния.",
      en: "An internal future-collection template: progress, lesson outline, free and Pro states.",
    },
    kind: "course",
    categoryLabel: { ru: "Шаблон курса", en: "Course template" },
    routeBasePath: { ru: "/learn/templates/course", en: "/en/learn/templates/course" },
    progress: { completed: 3, total: templateCourseLessons.length },
    lessons: templateCourseLessons,
  },
  {
    id: "standalone",
    title: { ru: "Шаблон одиночного урока", en: "Standalone lesson template" },
    description: {
      ru: "Внутренний шаблон одиночного урока без продолжения.",
      en: "An internal template for a standalone lesson without a sequence.",
    },
    kind: "standalone",
    categoryLabel: { ru: "Шаблон одиночного урока", en: "Standalone template" },
    routeBasePath: { ru: "/learn/templates/standalone", en: "/en/learn/templates/standalone" },
    lessons: [templateStandaloneLesson],
  },
];

export const learnTemplateLinks = [
  {
    id: "course",
    title: { ru: "Шаблон подборки курса", en: "Course collection template" },
    path: "/learn/templates/course",
    enPath: "/en/learn/templates/course",
  },
  {
    id: "locked-course-lesson",
    title: { ru: "Шаблон заблокированного Pro-урока", en: "Locked Pro lesson template" },
    path: "/learn/templates/course/template-course-06",
    enPath: "/en/learn/templates/course/template-course-06",
  },
  {
    id: "standalone",
    title: { ru: "Шаблон одиночного урока", en: "Standalone lesson template" },
    path: "/learn/templates/standalone",
    enPath: "/en/learn/templates/standalone",
  },
] as const;

export function getLearnTemplateCollection(templateKind: string | undefined): LearnCollection | undefined {
  if (!templateKind) return undefined;
  return learnTemplateCollections.find((collection) => collection.id === templateKind);
}

export function getDefaultLearnTemplateLesson(collection: LearnCollection): LearnLesson {
  return collection.lessons.find((item) => item.status === "In progress") ?? collection.lessons[0];
}

export function findLearnTemplateLesson(templateKind: string | undefined, lessonSlug: string | undefined): LearnLesson | undefined {
  const collection = getLearnTemplateCollection(templateKind);
  if (!collection) return undefined;
  if (!lessonSlug) return getDefaultLearnTemplateLesson(collection);
  return collection.lessons.find((item) => item.slug === lessonSlug);
}

export function getAdjacentLearnTemplateLessons(templateKind: string | undefined, lessonSlug: string) {
  const collection = getLearnTemplateCollection(templateKind);
  if (!collection) return { previousLesson: undefined, nextLesson: undefined };
  const index = collection.lessons.findIndex((item) => item.slug === lessonSlug);
  return {
    previousLesson: index > 0 ? collection.lessons[index - 1] : undefined,
    nextLesson: index >= 0 && index < collection.lessons.length - 1 ? collection.lessons[index + 1] : undefined,
  };
}

export const learnOverviewBaseSections: LearnOverviewSection[] = [
  {
    id: standaloneCollection.id,
    title: standaloneCollection.title.ru,
    description: standaloneCollection.description.ru,
    iconPath: "/assets/space/figma/header-atoms/icon-explore.svg",
    lessons: standaloneCollection.lessons,
  },
];

export function getLearnOverviewSections(query: string, activeFilter: LearnFilter): LearnOverviewSection[] {
  const normalizedQuery = query.trim().toLowerCase();
  return learnOverviewBaseSections
    .map((section) => ({
      ...section,
      lessons: section.lessons.filter((item) => lessonMatches(item, normalizedQuery, activeFilter)),
    }))
    .filter((section) => section.lessons.length > 0);
}

export function findLearnLesson(slug: string | undefined): LearnLesson | undefined {
  if (!slug) return undefined;
  return learnCollections.flatMap((collection) => collection.lessons).find((item) => item.slug === slug);
}

export function getLearnCollectionForLesson(slug: string): LearnCollection | undefined {
  return learnCollections.find((collection) => collection.lessons.some((item) => item.slug === slug));
}

export function getAdjacentLearnLessons(slug: string) {
  const collection = getLearnCollectionForLesson(slug);
  if (!collection) return { previousLesson: undefined, nextLesson: undefined };
  const index = collection.lessons.findIndex((item) => item.slug === slug);
  return {
    previousLesson: index > 0 ? collection.lessons[index - 1] : undefined,
    nextLesson: index >= 0 && index < collection.lessons.length - 1 ? collection.lessons[index + 1] : undefined,
  };
}

export function getLessonPosition(slug: string, lang: LearnLang = "ru") {
  const collection = getLearnCollectionForLesson(slug);
  if (!collection || collection.kind !== "course") return "";
  const index = collection.lessons.findIndex((item) => item.slug === slug);
  if (index < 0) return "";
  return lang === "en" ? `Lesson ${index + 1} of ${collection.lessons.length}` : `Урок ${index + 1} из ${collection.lessons.length}`;
}

export function getLearnLessonAuthor(item: LearnLesson) {
  return item.author ?? learnDefaultAuthor;
}

export function getLearnAuthorName(author: LearnAuthor, lang: LearnLang) {
  return author.localizedName?.[lang] ?? author.name;
}

export function getLearnLessonTitle(item: LearnLesson, lang: LearnLang) {
  return localize(item.title, lang);
}

export function getLearnLessonDescription(item: LearnLesson, lang: LearnLang) {
  return localize(item.description, lang);
}

export function getLearnLessonSeoTitle(item: LearnLesson, lang: LearnLang) {
  return item.seoTitle ? localize(item.seoTitle, lang) : getLearnLessonTitle(item, lang);
}

export function getLearnLessonSeoDescription(item: LearnLesson, lang: LearnLang) {
  return item.seoDescription ? localize(item.seoDescription, lang) : getLearnLessonDescription(item, lang);
}

export function getLearnLessonCategoryLabel(item: LearnLesson, lang: LearnLang) {
  return learnTopicLabels[lang][item.category];
}

export function getLearnLessonTopics(item: LearnLesson, lang: LearnLang) {
  return localize(item.topics, lang);
}

export function getLearnLessonOutcomes(item: LearnLesson, lang: LearnLang) {
  return localize(item.whatYouWillLearn, lang);
}

export function getLearnLessonTimestamps(item: LearnLesson, lang: LearnLang) {
  return localize(item.timestamps, lang);
}

export function getLearnLessonMaterials(item: LearnLesson, lang: LearnLang) {
  return item.materials[lang] ?? item.materials.ru ?? [];
}

export function getLearnCollectionPromptGenerators(item: LearnCollection, lang: LearnLang) {
  return item.promptGenerators?.[lang] ?? item.promptGenerators?.ru ?? [];
}

export function getLearnLessonPrompts(item: LearnLesson, lang: LearnLang) {
  return item.prompts?.[lang] ?? item.prompts?.ru ?? [];
}

export function getLearnLessonMissingItems(item: LearnLesson, lang: LearnLang) {
  return item.missingItems?.[lang] ?? item.missingItems?.ru ?? [];
}

export function getLearnLessonReleaseNote(item: LearnLesson, lang: LearnLang = "ru") {
  return localize(item.releaseNote, lang);
}

export function getLearnLessonUpdatedAt(item: LearnLesson) {
  return item.updatedAt;
}

export function getLearnLessonAuthorRole(item: LearnLesson, lang: LearnLang) {
  return localize(getLearnLessonAuthor(item).role, lang);
}

export function getLearnLessonAuthorIntro(item: LearnLesson, lang: LearnLang) {
  return localize(getLearnLessonAuthor(item).intro, lang);
}

export function getLearnCollectionTitle(item: LearnCollection, lang: LearnLang) {
  return localize(item.title, lang);
}

export function getLearnCollectionDescription(item: LearnCollection, lang: LearnLang) {
  return localize(item.description, lang);
}

export function getLearnCollectionCategoryLabel(item: LearnCollection, lang: LearnLang) {
  return localize(item.categoryLabel, lang);
}

export function getFutureCollectionTitle(item: LearnFutureCollection, lang: LearnLang) {
  return localize(item.title, lang);
}

export function getFutureCollectionSubtitle(item: LearnFutureCollection, lang: LearnLang) {
  return localize(item.subtitle, lang);
}

export function getFutureCollectionDescription(item: LearnFutureCollection, lang: LearnLang) {
  return localize(item.description, lang);
}

export function getLearnLessonVideoProvider(item: LearnLesson): LearnVideoProviderMetadata {
  if (item.localVideo) {
    return (
      item.videoProvider ?? {
        provider: "local",
        providerAssetId: item.slug,
        posterPath: item.localVideo.posterPath,
        playbackPolicy: "public-embed",
        signedPlaybackUrl: null,
        contentUrl: item.localVideo.contentUrl,
        notes: futureProtectedVideoDeliveryNote,
      }
    );
  }

  return (
    item.videoProvider ?? {
      provider: "youtube",
      providerAssetId: item.youtubeId ?? `todo-${item.slug}`,
      posterPath: item.thumbnailPath,
      playbackPolicy: item.access === "full-platform" ? "subscription-gated-public-preview" : "public-embed",
      signedPlaybackUrl: null,
      notes: futureProtectedVideoDeliveryNote,
    }
  );
}

function lessonMatches(item: LearnLesson, normalizedQuery: string, activeFilter: LearnFilter) {
  const filterMatch = activeFilter === "All" || item.filters.includes(activeFilter);
  const haystack = [
    item.title.ru,
    item.title.en,
    item.description.ru,
    item.description.en,
    learnTopicLabels.ru[item.category],
    learnTopicLabels.en[item.category],
    item.topics.ru.join(" "),
    item.topics.en.join(" "),
    item.status,
  ]
    .join(" ")
    .toLowerCase();
  const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
  return filterMatch && queryMatch;
}
