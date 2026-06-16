export type LearnLang = "ru" | "en";

export type LocalizedText = Record<LearnLang, string>;

export type LearnTopic = "ai-image" | "ai-video" | "vibe-coding" | "vibe-design" | "business";

export type LearnLessonStatus = "Available" | "In progress" | "Completed";

export type LearnAccess = "free" | "full-platform";

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
  provider: "youtube" | "local";
  providerAssetId: string;
  posterPath: string;
  playbackPolicy: "public-embed" | "subscription-gated-public-preview";
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
  localizedVideo?: Partial<Record<LearnLang, LearnLocalizedVideo>>;
  localVideo?: LearnLocalVideo;
  timestamps: Record<LearnLang, LearnTimestamp[]>;
  materials: Partial<Record<LearnLang, LearnMaterial[]>>;
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
  "Current Learn launch embeds public YouTube lessons and one optimized local public video. Future protected video delivery should use backend-issued signed short-lived playback URLs and a proper streaming/video provider if private Pro-only video files become required.";

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
    ru: "Веб-дизайнер, AI-креатор",
    en: "Web designer, AI creator",
  },
  intro: {
    ru: "Показываю рабочие AI-процессы на реальных уроках: от идеи и промпта до готового видео.",
    en: "I teach practical AI workflows through real lessons: from idea and prompt to finished visual content.",
  },
  note: {
    ru: "Уроки обновляются, когда меняются модели, интерфейсы или production-процесс.",
    en: "Lessons are updated when models, interfaces, or the production workflow change.",
  },
  avatarPath: `${legacyLearnAssetBase}/author-vlad-frame43.jpg`,
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
  { time: "00:00", seconds: 0, title: "Введение и разбор задания", description: "Условия эксперимента: новичок дорабатывает реальный заказ и получает исходные материалы." },
  { time: "01:28", seconds: 88, title: "Сетка и границы контента", description: "Ошибки позиционирования текста и кнопок относительно направляющих." },
  { time: "02:47", seconds: 167, title: "Отступы и фреймы", description: "Почему одинаковые отступы и порядок слоёв в Figma влияют на качество макета." },
  { time: "04:36", seconds: 276, title: "Карточки и фото", description: "Как избегать лишних обводок и подбирать изображения в единой цветовой гамме." },
  { time: "06:51", seconds: 411, title: "Иерархия заголовков и кнопок", description: "Разбор структуры текста и ошибок в названиях CTA." },
  { time: "08:44", seconds: 524, title: "Секция отзывов", description: "Критика логотипов поверх текста, выравнивания и выбора начертания шрифтов." },
  { time: "13:12", seconds: 792, title: "Галерея и Auto Layout", description: "Сложности верстки при разной высоте карточек и советы по автолейаутам." },
  { time: "18:14", seconds: 1094, title: "FAQ-блок", description: "Почему вопросы и ответы лучше проектировать в одну колонку." },
  { time: "20:23", seconds: 1223, title: "Единообразие иконок", description: "Контроль толщины линий и скруглений у иконок для целостного стиля." },
  { time: "21:32", seconds: 1292, title: "Финальный проект", description: "Обзор профессиональной версии сайта после доработок." },
];

const juniorOrderTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Brief and experiment setup", description: "A junior designer receives a real client order and source materials." },
  { time: "01:28", seconds: 88, title: "Grid and content boundaries", description: "Common positioning mistakes with text and buttons around layout guides." },
  { time: "02:47", seconds: 167, title: "Spacing and frames", description: "Why consistent spacing and clean Figma layers matter." },
  { time: "04:36", seconds: 276, title: "Cards and photo style", description: "Avoiding unnecessary borders and choosing images with a coherent palette." },
  { time: "06:51", seconds: 411, title: "Heading and button hierarchy", description: "Fixing text structure and CTA naming mistakes." },
  { time: "08:44", seconds: 524, title: "Testimonials section", description: "Reviewing logo placement, large block alignment, and font weight." },
  { time: "13:12", seconds: 792, title: "Gallery and Auto Layout", description: "Handling card-height differences and Figma auto-layout constraints." },
  { time: "18:14", seconds: 1094, title: "FAQ block", description: "Why question and answer blocks work better in one column." },
  { time: "20:23", seconds: 1223, title: "Consistent icons", description: "Controlling icon stroke weight and corner radius." },
  { time: "21:32", seconds: 1292, title: "Final project review", description: "A walkthrough of the professional version after the redesign." },
];

const clientWebsiteTimestampsRu: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Цели проекта", description: "Работа с реальным клиентом за $1100 и план первой секции сайта." },
  { time: "01:25", seconds: 85, title: "Мудборды и референсы", description: "Шрифты, цвета и визуальные решения, согласованные с заказчиком." },
  { time: "04:20", seconds: 260, title: "Фрейм и рабочая область", description: "Размер холста под MacBook Pro 16 и границы браузерной строки." },
  { time: "06:45", seconds: 405, title: "Hero-секция", description: "Настройка отступов и скруглений для основного контейнера." },
  { time: "10:15", seconds: 615, title: "Подбор графики", description: "Поиск изображений и удаление фона с помощью нейросетей." },
  { time: "13:30", seconds: 810, title: "Фон и экспозиция", description: "Размещение объектов и затемняющий слой для читаемости текста." },
  { time: "16:30", seconds: 990, title: "Типографика", description: "Основной заголовок, описание, интервалы и выравнивание." },
  { time: "18:50", seconds: 1130, title: "Кнопки через Auto Layout", description: "Сборка основной и второстепенной кнопок с автоматическими отступами." },
  { time: "23:30", seconds: 1410, title: "Шапка и меню", description: "Логотип, навигация и верхняя часть сайта." },
  { time: "25:50", seconds: 1550, title: "Финальный прототип", description: "Просмотр готовой первой секции в режиме презентации." },
];

const clientWebsiteTimestampsEn: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Project goals", description: "A real $1100 client website and the plan for the first section." },
  { time: "01:25", seconds: 85, title: "Moodboards and references", description: "Fonts, colors, and visual directions agreed with the client." },
  { time: "04:20", seconds: 260, title: "Frame and workspace", description: "Canvas size for MacBook Pro 16 and realistic browser bounds." },
  { time: "06:45", seconds: 405, title: "Hero section", description: "Spacing and radius setup for the main container." },
  { time: "10:15", seconds: 615, title: "Graphic selection", description: "Finding images and removing backgrounds with AI tools." },
  { time: "13:30", seconds: 810, title: "Background and exposure", description: "Placing objects and using dark overlays for readable text." },
  { time: "16:30", seconds: 990, title: "Typography", description: "Headline, description, line height, and alignment." },
  { time: "18:50", seconds: 1130, title: "Buttons with Auto Layout", description: "Building primary and secondary buttons with Figma auto layout." },
  { time: "23:30", seconds: 1410, title: "Header and menu", description: "Logo, navigation, and the top part of the site." },
  { time: "25:50", seconds: 1550, title: "Final prototype", description: "Reviewing the first section in presentation mode." },
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
    thumbnailPath: `${learnAssetBase}/thumbs/ai-avatar-motion-control.jpg`,
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
    thumbnailPath: `${learnAssetBase}/thumbs/junior-designer-1100-order.jpg`,
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
    thumbnailPath: `${learnAssetBase}/thumbs/client-website-navigation-hero.jpg`,
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
    thumbnailPath: `${learnAssetBase}/thumbs/ai-marketplace-product-cards.jpg`,
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
    thumbnailPath: `${learnAssetBase}/thumbs/web-design-references.jpg`,
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
