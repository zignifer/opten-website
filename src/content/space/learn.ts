export type LearnFilter = "All" | "Standalone" | "Prompt packs" | "Builder" | "Brand" | "Models";

export type LearnLessonStatus = "Available" | "In progress" | "Completed";

export type LearnAccess = "free" | "full-platform";

export type LearnCollectionKind = "course" | "standalone";

export type LearnAuthor = {
  name: string;
  initials: string;
  role: string;
  intro: string;
  note: string;
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

export type LearnVideoProviderMetadata = {
  provider: "youtube";
  providerAssetId: string;
  posterPath: string;
  playbackPolicy: "public-embed" | "subscription-gated-public-preview";
  signedPlaybackUrl: null;
  notes: string;
};

export type LearnLocalizedVideo = {
  youtubeId?: string;
  youtubeUrl?: string;
  audioLanguage?: "ru" | "en";
  captionLanguage?: "ru" | "en";
};

export type LearnLesson = {
  slug: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  status: LearnLessonStatus;
  access: LearnAccess;
  previewAvailable?: boolean;
  fullAccessOnly?: boolean;
  thumbnailPath: string;
  author?: LearnAuthor;
  updatedAt?: string;
  releaseNote?: string;
  filters: LearnFilter[];
  topics: string[];
  whatYouWillLearn: string[];
  updatedNote: string;
  youtubeId?: string;
  youtubeUrl?: string;
  localizedVideo?: Partial<Record<"ru" | "en", LearnLocalizedVideo>>;
  timestamps: LearnTimestamp[];
  materials: LearnMaterial[];
  videoProvider?: LearnVideoProviderMetadata;
};

export type LearnCourseProgress = {
  completed: number;
  total: number;
};

export type LearnCourse = {
  id: string;
  title: string;
  category: LearnFilter;
  label: string;
  description: string;
  progress: LearnCourseProgress;
  lessons: LearnLesson[];
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
  title: string;
  description: string;
  kind: LearnCollectionKind;
  categoryLabel: string;
  progress?: LearnCourseProgress;
  lessons: LearnLesson[];
};

export const learnFilters: LearnFilter[] = ["All", "Standalone", "Prompt packs", "Builder", "Brand", "Models"];

export const futureProtectedVideoDeliveryNote =
  "Current Learn MVP embeds public YouTube lessons. Future protected video delivery should use backend-issued signed short-lived playback URLs and a proper streaming/video provider if private Pro-only video files become required.";

const learnAssetBase = "/assets/space/learn-v2";

export const learnDefaultAuthor: LearnAuthor = {
  name: "Влад Воронежцев",
  initials: "ВВ",
  role: "Веб-дизайнер, AI-креатор",
  intro: "Показываю рабочие AI-процессы на реальных уроках: от идеи и промпта до готового видео.",
  note: "Уроки обновляются, когда меняются модели, интерфейсы или production-процесс.",
  avatarPath: `${learnAssetBase}/author-vlad-frame43.jpg`,
};

export const learnIntegrationTodos = {
  auth: "Use SpaceAuthProvider/account-summary for viewer identity and entitlement state.",
  subscription: "Pro lessons unlock when account-summary returns plan=pro with active or cancelled paid access.",
  video:
    "Public YouTube embed is the first delivery path. Keep provider access and timestamp generation in local scripts/server context, not in browser code.",
  contentManagement:
    "Replace this local catalog with an owner upload/content management workflow when course authoring is ready.",
};

const aiAvatarTimestamps: LearnTimestamp[] = [
  {
    time: "00:00",
    seconds: 0,
    title: "Введение в AI-аватары",
    description: "Как перенос движения и мимики превращает исходное видео в управляемого ИИ-персонажа.",
  },
  {
    time: "00:38",
    seconds: 38,
    title: "Подготовка видеореференса",
    description: "Записываем исходный ролик и вытаскиваем первый кадр для дальнейшей генерации.",
  },
  {
    time: "01:25",
    seconds: 85,
    title: "Создание образа персонажа",
    description: "Генерируем изображение персонажа в Syntax с сохранением позы и освещения.",
  },
  {
    time: "02:30",
    seconds: 150,
    title: "Изменение голоса в 11 Labs",
    description: "Используем Voice Changer, чтобы подготовить озвучку для будущего аватара.",
  },
  {
    time: "03:55",
    seconds: 235,
    title: "Анимация в Kling Motion Control",
    description: "Загружаем материалы и оживляем персонажа по движениям из видеореференса.",
  },
  {
    time: "04:45",
    seconds: 285,
    title: "Сборка проекта и липсинк",
    description: "Меняем оригинальный звук на сгенерированный и проверяем синхронизацию губ.",
  },
  {
    time: "05:50",
    seconds: 350,
    title: "Методы придания реализма",
    description: "Используем перезапись экрана телефона, чтобы получить более живое ощущение съемки.",
  },
  {
    time: "07:20",
    seconds: 440,
    title: "Апскейл видео и мемы",
    description: "Улучшаем исходники через апскейлер, чтобы избежать артефактов при анимации.",
  },
  {
    time: "08:35",
    seconds: 515,
    title: "Настройки фона и ориентации",
    description: "Разбираем параметры фона и направления взгляда персонажа в Kling Motion Control.",
  },
];

const defaultTimestamps: LearnTimestamp[] = [
  { time: "00:00", seconds: 0, title: "Контекст урока", description: "Что делаем и какой результат должен получиться." },
  { time: "01:40", seconds: 100, title: "Подготовка материалов", description: "Собираем входные данные и фиксируем ограничения." },
  { time: "04:10", seconds: 250, title: "Основной workflow", description: "Проходим ключевые действия в инструменте." },
  { time: "07:30", seconds: 450, title: "Проверка результата", description: "Смотрим на ошибки, артефакты и способы исправления." },
];

const aiVideoMaterials: LearnMaterial[] = [
  {
    title: "Шаблон промпта для AI-аватара",
    meta: "PDF · 245 КБ",
    kind: "pdf",
    actionLabel: "Скачать",
    href: "/dashboard/download-skill",
  },
  {
    title: "Примеры референсов и результатов",
    meta: "MP4 · 128 МБ",
    kind: "video",
    actionLabel: "Смотреть",
    href: "https://youtu.be/slxq1d8u-Hg",
  },
  {
    title: "Документация Kling Motion Control",
    meta: "Ссылка",
    kind: "link",
    actionLabel: "Перейти",
    href: "https://klingai.com/",
  },
];

function lesson(input: Omit<LearnLesson, "author" | "updatedNote" | "timestamps" | "materials"> & Partial<Pick<LearnLesson, "timestamps" | "materials" | "updatedNote">>): LearnLesson {
  return {
    ...input,
    author: learnDefaultAuthor,
    timestamps: input.timestamps ?? defaultTimestamps,
    materials: input.materials ?? [],
    updatedNote: input.updatedNote ?? "Материалы урока обновляются вместе с курсом.",
  };
}

export const learnCourses: LearnCourse[] = [
  {
    id: "ai-video-zero-to-pro",
    title: "Создание видео с помощью ИИ: от идеи до результата",
    category: "Models",
    label: "ИИ-генерация видео",
    description: "Практический курс по AI-видео: сценарий, промпт, персонажи, движение, звук и финальная сборка.",
    progress: { completed: 4, total: 12 },
    lessons: [
      lesson({
        slug: "ai-video-intro",
        title: "Введение в ИИ-видеогенерацию",
        description: "Разбираем, какие задачи решают современные видео-модели и где в workflow нужен Opten.",
        category: "ИИ-генерация видео",
        duration: "10:12",
        status: "Completed",
        access: "free",
        thumbnailPath: `${learnAssetBase}/ai-video-smoke.jpg`,
        filters: ["Models"],
        topics: ["AI video", "Workflow", "Prompting"],
        whatYouWillLearn: ["Понимать место видео-моделей в production-процессе", "Разделять идею, референс и промпт", "Оценивать качество первого результата"],
      }),
      lesson({
        slug: "video-tools-basics",
        title: "Основы работы с инструментами",
        description: "Настраиваем рабочую связку для генерации, проверки и доработки роликов.",
        category: "ИИ-генерация видео",
        duration: "13:45",
        status: "Completed",
        access: "free",
        thumbnailPath: `${learnAssetBase}/tools-server-corridor.jpg`,
        filters: ["Models"],
        topics: ["Tools", "Setup", "Production"],
        whatYouWillLearn: ["Собрать базовый набор инструментов", "Подготовить ассеты для генерации", "Не терять версии результата"],
      }),
      lesson({
        slug: "midjourney-style-light",
        title: "Midjourney: стиль, свет и композиция",
        description: "Создаём сильный первый кадр, который потом можно использовать в видео-моделях.",
        category: "ИИ-генерация изображений",
        duration: "12:18",
        status: "Completed",
        access: "free",
        thumbnailPath: `${learnAssetBase}/midjourney-landscape.jpg`,
        filters: ["Models"],
        topics: ["Midjourney", "Composition", "First frame"],
        whatYouWillLearn: ["Собирать визуальный стиль сцены", "Контролировать свет и композицию", "Готовить кадр под дальнейшую анимацию"],
      }),
      lesson({
        slug: "runway-prompt-to-video",
        title: "Kling Motion Control: AI-аватар под нужные движения",
        description:
          "В этом уроке вы сделаете AI-аватара, перенесёте на него движение из видеореференса, подготовите голос и соберёте результат с липсинком.",
        category: "ИИ-генерация видео",
        duration: "09:38",
        status: "In progress",
        access: "free",
        thumbnailPath: `${learnAssetBase}/runway-neon-city.jpg`,
        youtubeId: "slxq1d8u-Hg",
        youtubeUrl: "https://youtu.be/slxq1d8u-Hg?si=vszm1zByQhlrOc7u",
        localizedVideo: {
          ru: {
            youtubeId: "slxq1d8u-Hg",
            youtubeUrl: "https://youtu.be/slxq1d8u-Hg?si=vszm1zByQhlrOc7u",
            audioLanguage: "ru",
            captionLanguage: "ru",
          },
          en: {
            youtubeId: "slxq1d8u-Hg",
            youtubeUrl: "https://youtu.be/slxq1d8u-Hg?si=vszm1zByQhlrOc7u",
            captionLanguage: "en",
          },
        },
        filters: ["Models"],
        topics: ["Kling", "Motion Control", "AI avatar", "Lip sync"],
        whatYouWillLearn: [
          "Подготовить видеореференс и первый кадр",
          "Собрать образ персонажа в Syntax",
          "Сделать озвучку через 11 Labs",
          "Анимировать аватара в Kling Motion Control",
        ],
        timestamps: aiAvatarTimestamps,
        materials: aiVideoMaterials,
        updatedNote: "Тайм-коды сгенерированы через локальный NotebookLM pipeline 2026-06-06.",
      }),
      lesson({
        slug: "figma-ai-interface",
        title: "Создаём интерфейсы в Figma с ИИ",
        description: "Проектируем экран продукта и быстро собираем визуальный прототип под видео.",
        category: "Вайб-дизайн",
        duration: "14:05",
        status: "Available",
        access: "free",
        thumbnailPath: `${learnAssetBase}/figma-interior.jpg`,
        filters: ["Builder"],
        topics: ["Figma", "AI design", "Interface"],
        whatYouWillLearn: ["Собрать быстрый экран", "Подготовить интерфейс как ассет", "Использовать прототип как часть ролика"],
      }),
      ...[
        ["video-camera-motion", "Анимация и движения в видео", "14:05"],
        ["character-stability", "Стабильность персонажей и сцен", "16:20"],
        ["voice-and-sound", "Работа со звуком и озвучкой", "12:34"],
        ["color-grading-style", "Цветокоррекция и стилизация", "11:48"],
        ["export-codecs", "Экспорт, кодеки и оптимизация", "10:40"],
        ["real-project-cases", "Кейсы: разбор реальных проектов", "18:12"],
        ["final-project", "Финальный проект и выводы", "15:30"],
      ].map(([slug, title, duration], index) =>
        lesson({
          slug,
          title,
          description: "Продвинутый урок курса. Доступ открывается на тарифе Pro.",
          category: "ИИ-генерация видео",
          duration,
          status: "Available",
          access: "full-platform",
          fullAccessOnly: true,
          thumbnailPath: index % 2 === 0 ? `${learnAssetBase}/pika-neon-car.jpg` : `${learnAssetBase}/hero-portal.jpg`,
          filters: ["Models"],
          topics: ["Advanced AI video", "Production", "Pro"],
          whatYouWillLearn: ["Разбирать продвинутые production-приёмы", "Исправлять типичные ошибки генерации", "Готовить материал к публикации"],
        }),
      ),
    ],
  },
];

const standaloneLessons: LearnLesson[] = [
  lesson({
    slug: "prompt-engineering-basics",
    title: "Промпт-инжиниринг: базовые принципы и примеры",
    description: "Одиночный урок о структуре хорошего промпта: роль, сцена, ограничения, стиль и проверка результата.",
    category: "ИИ-генерация изображений",
    duration: "08:21",
    status: "Available",
    access: "free",
    thumbnailPath: `${learnAssetBase}/prompt-coast.jpg`,
    filters: ["Standalone", "Prompt packs"],
    topics: ["Prompting", "Images", "Basics"],
    whatYouWillLearn: ["Писать компактный промпт без лишних деталей", "Отделять стиль от результата", "Проверять промпт перед генерацией"],
  }),
  lesson({
    slug: "pika-new-features",
    title: "Pika 2.0: новые возможности и практические кейсы",
    description: "Одиночный обзор новых возможностей Pika и практических сценариев для коротких видео.",
    category: "ИИ-генерация видео",
    duration: "11:27",
    status: "Available",
    access: "full-platform",
    thumbnailPath: `${learnAssetBase}/pika-neon-car.jpg`,
    filters: ["Standalone", "Models"],
    topics: ["Pika", "AI video", "Overview"],
    whatYouWillLearn: ["Оценить новые режимы Pika", "Подобрать сценарии для коротких роликов", "Понять ограничения результата"],
  }),
  lesson({
    slug: "bolt-saas-evening",
    title: "Строим SaaS за вечер с помощью Bolt.new",
    description: "Одиночный урок по быстрому прототипированию SaaS-интерфейса без полноценной команды разработки.",
    category: "Вайб-кодинг",
    duration: "18:42",
    status: "Available",
    access: "free",
    thumbnailPath: `${learnAssetBase}/bolt-saas-screen.jpg`,
    filters: ["Standalone", "Builder"],
    topics: ["Bolt", "SaaS", "Vibe coding"],
    whatYouWillLearn: ["Собрать MVP-экран", "Сформулировать техническое задание", "Проверить результат без лишней архитектуры"],
  }),
  lesson({
    slug: "ai-design-assistants",
    title: "AI-помощники в дизайне: Figma, Uizard, Galileo",
    description: "Разбираем, где AI-дизайн помогает ускорить работу, а где всё ещё нужен ручной контроль.",
    category: "Вайб-дизайн",
    duration: "15:30",
    status: "Available",
    access: "free",
    thumbnailPath: `${learnAssetBase}/ai-design-dashboard.jpg`,
    filters: ["Standalone", "Builder"],
    topics: ["Design", "Figma", "AI assistants"],
    whatYouWillLearn: ["Выбирать AI-инструмент под задачу", "Сохранять дизайн-систему", "Быстро проверять варианты интерфейса"],
  }),
];

const standaloneCollection: LearnCollection = {
  id: "standalone-videos",
  title: "Все уроки",
  description: "Одиночные видео без продолжения. Часть будет бесплатной, часть будет открываться на тарифе Pro.",
  kind: "standalone",
  categoryLabel: "Одиночные уроки",
  lessons: standaloneLessons,
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

const collections: LearnCollection[] = [standaloneCollection, ...courseCollections];

export const learnOverviewBaseSections: LearnOverviewSection[] = [
  {
    id: standaloneCollection.id,
    title: standaloneCollection.title,
    description: standaloneCollection.description,
    iconPath: "/assets/space/figma/header-atoms/icon-explore.svg",
    lessons: standaloneCollection.lessons,
  },
  ...learnCourses.map((course) => ({
    id: course.id,
    title: course.title,
    metadata: `${course.lessons.length} уроков`,
    description: course.description,
    iconPath: "/assets/space/figma/prompt-stack.svg",
    lessons: course.lessons.slice(0, 4),
  })),
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
  return collections.flatMap((collection) => collection.lessons).find((item) => item.slug === slug);
}

export function getLearnCollectionForLesson(slug: string): LearnCollection | undefined {
  return collections.find((collection) => collection.lessons.some((item) => item.slug === slug));
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

export function getLessonPosition(slug: string) {
  const collection = getLearnCollectionForLesson(slug);
  if (!collection || collection.kind !== "course") return "";
  const index = collection.lessons.findIndex((item) => item.slug === slug);
  if (index < 0) return "";
  return `Урок ${index + 1} из ${collection.lessons.length}`;
}

export function getLearnLessonAuthor(item: LearnLesson) {
  return item.author ?? learnDefaultAuthor;
}

export function getLearnLessonReleaseNote(item: LearnLesson) {
  return item.releaseNote ?? item.updatedNote;
}

export function getLearnLessonUpdatedAt(item: LearnLesson) {
  return item.updatedAt ?? "2026-06-06";
}

export function getLearnLessonVideoProvider(item: LearnLesson): LearnVideoProviderMetadata {
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
  const queryMatch =
    !normalizedQuery ||
    `${item.title} ${item.description} ${item.category} ${item.topics.join(" ")} ${item.status}`.toLowerCase().includes(normalizedQuery);
  return filterMatch && queryMatch;
}
