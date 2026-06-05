import {
  BadgeCheck,
  BookOpen,
  ChevronDown,
  Play,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import SiteFooter from "../../components/SiteFooter";
import SpaceHeader from "../../components/space/SpaceHeader";

const assetBase = "/assets/space/learn-v2";

type LearnTopic = "Все темы" | "ИИ-генерация изображений" | "ИИ-генерация видео" | "Вайб-кодинг" | "Вайб-дизайн";
type LessonTopic = Exclude<LearnTopic, "Все темы"> | "ИИ для бизнеса";
type SortKey = "new" | "popular" | "progress";
type LearnLang = "ru" | "en";
type LocalizedText = Record<LearnLang, string>;

type LessonCard = {
  id: string;
  title: string;
  topic: LessonTopic;
  image: string;
  duration: string;
  author: string;
  updated: string;
  dateRank: number;
  progress?: number;
};

type CollectionCard = {
  id: string;
  title: string;
  subtitle: string;
  lessons: number;
  topic: LessonTopic;
  image: string;
};

const topics: LearnTopic[] = [
  "Все темы",
  "ИИ-генерация изображений",
  "ИИ-генерация видео",
  "Вайб-кодинг",
  "Вайб-дизайн",
];

const sortLabels: Record<LearnLang, Record<SortKey, string>> = {
  ru: {
    new: "Новые",
    popular: "Популярные",
    progress: "Прогресс",
  },
  en: {
    new: "Newest",
    popular: "Popular",
    progress: "Progress",
  },
};

const courseAuthor = {
  name: "Влад Воронежцев",
  avatar: `${assetBase}/author-vlad-frame43.jpg`,
  label: {
    ru: "Автор курсов",
    en: "Course author",
  },
  description: {
    ru: "Веб-дизайнер и AI-креатор. Создаю видеоуроки и рабочие процессы по нейросетям с 2022 года.",
    en: "Web designer and AI creator. I have been creating video lessons and AI workflows since 2022.",
  },
  stats: [
    {
      value: { ru: "34K", en: "34K" },
      label: { ru: "подписчиков", en: "followers" },
      active: true,
    },
    {
      value: { ru: "9 лет", en: "9 years" },
      label: { ru: "в дизайне", en: "in design" },
    },
  ],
} as const;

const featuredLesson = {
  title: "Как создавать кинематографичные видео с помощью ИИ",
  description:
    "Полный разбор рабочего процесса: от идеи и промпта до финального монтажа. Инструменты, приёмы и настройки для впечатляющих результатов.",
  image: `${assetBase}/hero-portal.jpg`,
  duration: "24:48",
};

const pageCopy = {
  ru: {
    heroTitleLead: "Курсы",
    heroTitleTail: "от",
    featuredTitle: featuredLesson.title,
    featuredDescription: "Полный разбор рабочего процесса: от идеи и промпта до финального монтажа.",
    watchLesson: "Смотреть урок",
    filterLabel: "Фильтр тем",
    sortLabel: "Сортировка",
    sortPrefix: "Сортировка:",
    searchLabel: "Поиск уроков",
    searchPlaceholder: "Поиск уроков...",
    continueTitle: "Продолжить обучение",
    collectionsTitle: "Подборки",
    allLessonsTitle: "Все уроки",
    showAll: "Смотреть все",
    noResultsTitle: "Ничего не найдено",
    noResultsText: "Попробуйте изменить тему или поисковый запрос.",
    soon: "Скоро",
    lessonUnit: "уроков",
  },
  en: {
    heroTitleLead: "Courses",
    heroTitleTail: "by",
    featuredTitle: "How to create cinematic AI videos",
    featuredDescription: "A complete workflow breakdown: from idea and prompt to final edit.",
    watchLesson: "Watch lesson",
    filterLabel: "Topic filter",
    sortLabel: "Sorting",
    sortPrefix: "Sort:",
    searchLabel: "Search lessons",
    searchPlaceholder: "Search lessons...",
    continueTitle: "Continue learning",
    collectionsTitle: "Collections",
    allLessonsTitle: "All lessons",
    showAll: "View all",
    noResultsTitle: "Nothing found",
    noResultsText: "Try changing the topic or search query.",
    soon: "Soon",
    lessonUnit: "lessons",
  },
} as const;

const topicLabels: Record<LearnLang, Record<LearnTopic | LessonTopic, string>> = {
  ru: {
    "Все темы": "Все темы",
    "ИИ-генерация изображений": "ИИ-генерация изображений",
    "ИИ-генерация видео": "ИИ-генерация видео",
    "Вайб-кодинг": "Вайб-кодинг",
    "Вайб-дизайн": "Вайб-дизайн",
    "ИИ для бизнеса": "ИИ для бизнеса",
  },
  en: {
    "Все темы": "All topics",
    "ИИ-генерация изображений": "AI image generation",
    "ИИ-генерация видео": "AI video generation",
    "Вайб-кодинг": "Vibe-coding",
    "Вайб-дизайн": "Vibe-design",
    "ИИ для бизнеса": "AI for business",
  },
};

const lessonTranslations: Record<string, { title: LocalizedText; updated: LocalizedText }> = {
  "cursor-web-app": {
    title: { ru: "Создаём веб-приложение с помощью Cursor", en: "Build a web app with Cursor" },
    updated: { ru: "Сегодня", en: "Today" },
  },
  "midjourney-style-light": {
    title: { ru: "Midjourney: стили, свет и композиция", en: "Midjourney: styles, light, and composition" },
    updated: { ru: "Вчера", en: "Yesterday" },
  },
  "runway-prompt-to-video": {
    title: { ru: "Runway Gen-3: от промпта до готового ролика", en: "Runway Gen-3: from prompt to finished video" },
    updated: { ru: "3 дня назад", en: "3 days ago" },
  },
  "figma-ai-interface": {
    title: { ru: "Создаём интерфейсы в Figma с ИИ", en: "Create Figma interfaces with AI" },
    updated: { ru: "1 неделю назад", en: "1 week ago" },
  },
  "prompt-engineering-basics": {
    title: {
      ru: "Промпт-инжиниринг: базовые принципы и примеры",
      en: "Prompt engineering: basic principles and examples",
    },
    updated: { ru: "2 дня назад", en: "2 days ago" },
  },
  "pika-new-features": {
    title: { ru: "Pika 2.0: новые возможности и практические кейсы", en: "Pika 2.0: new capabilities and practical cases" },
    updated: { ru: "4 дня назад", en: "4 days ago" },
  },
  "bolt-saas-evening": {
    title: { ru: "Строим SaaS за вечер с помощью Bolt.new", en: "Build a SaaS in one evening with Bolt.new" },
    updated: { ru: "6 дней назад", en: "6 days ago" },
  },
  "ai-design-assistants": {
    title: { ru: "AI-помощники в дизайне: Figma, Uizard, Galileo", en: "AI design assistants: Figma, Uizard, Galileo" },
    updated: { ru: "1 неделю назад", en: "1 week ago" },
  },
  "figma-ai-repeat": {
    title: { ru: "Создаём интерфейсы в Figma с ИИ", en: "Create Figma interfaces with AI" },
    updated: { ru: "1 неделю назад", en: "1 week ago" },
  },
  "business-cases": {
    title: { ru: "AI-автоматизация для бизнеса: кейсы и инструменты", en: "AI automation for business: cases and tools" },
    updated: { ru: "2 недели назад", en: "2 weeks ago" },
  },
  "cursor-advanced": {
    title: { ru: "Cursor workflow: рефакторинг и быстрые прототипы", en: "Cursor workflow: refactoring and rapid prototypes" },
    updated: { ru: "2 недели назад", en: "2 weeks ago" },
  },
  "runway-editing": {
    title: { ru: "Runway монтаж: темп, кадр и финальная сборка", en: "Runway editing: pacing, framing, and final assembly" },
    updated: { ru: "3 недели назад", en: "3 weeks ago" },
  },
  "midjourney-advanced": {
    title: { ru: "Midjourney: сложные сцены и стабильный стиль", en: "Midjourney: complex scenes and stable style" },
    updated: { ru: "3 недели назад", en: "3 weeks ago" },
  },
};

const collectionTranslations: Record<string, { title: LocalizedText; subtitle: LocalizedText }> = {
  "quick-start": {
    title: { ru: "Быстрый старт в ИИ", en: "AI quick start" },
    subtitle: { ru: "Для начинающих", en: "For beginners" },
  },
  "ai-video-zero-to-pro": {
    title: { ru: "AI-видео с нуля", en: "AI video from zero" },
    subtitle: { ru: "Кинематография и сторителлинг", en: "Cinematography and storytelling" },
  },
  "vibe-coding-projects": {
    title: { ru: "Вайб-кодим проект", en: "Vibe-code a project" },
    subtitle: { ru: "Практика и готовые шаблоны", en: "Practice and ready-made templates" },
  },
  "business-ai": {
    title: { ru: "ИИ для бизнеса", en: "AI for business" },
    subtitle: { ru: "Автоматизация и рост", en: "Automation and growth" },
  },
  "tools-reviews": {
    title: { ru: "Полезные инструменты", en: "Useful tools" },
    subtitle: { ru: "Полные гайды и сравнения", en: "Complete guides and comparisons" },
  },
};

const continueLessons: LessonCard[] = [
  {
    id: "cursor-web-app",
    title: "Создаём веб-приложение с помощью Cursor",
    topic: "Вайб-кодинг",
    image: `${assetBase}/cursor-code.jpg`,
    duration: "16:32",
    author: courseAuthor.name,
    updated: "Сегодня",
    dateRank: 8,
    progress: 65,
  },
  {
    id: "midjourney-style-light",
    title: "Midjourney: стили, свет и композиция",
    topic: "ИИ-генерация изображений",
    image: `${assetBase}/midjourney-landscape.jpg`,
    duration: "12:18",
    author: courseAuthor.name,
    updated: "Вчера",
    dateRank: 7,
    progress: 40,
  },
  {
    id: "runway-prompt-to-video",
    title: "Runway Gen-3: от промпта до готового ролика",
    topic: "ИИ-генерация видео",
    image: `${assetBase}/runway-neon-city.jpg`,
    duration: "19:47",
    author: courseAuthor.name,
    updated: "3 дня назад",
    dateRank: 6,
    progress: 25,
  },
  {
    id: "figma-ai-interface",
    title: "Создаём интерфейсы в Figma с ИИ",
    topic: "Вайб-дизайн",
    image: `${assetBase}/figma-interior.jpg`,
    duration: "14:05",
    author: courseAuthor.name,
    updated: "1 неделю назад",
    dateRank: 4,
    progress: 60,
  },
];

const collections: CollectionCard[] = [
  {
    id: "quick-start",
    title: "Быстрый старт в ИИ",
    subtitle: "Для начинающих",
    lessons: 12,
    topic: "ИИ-генерация изображений",
    image: `${assetBase}/quick-start-lines.jpg`,
  },
  {
    id: "ai-video-zero-to-pro",
    title: "AI-видео с нуля",
    subtitle: "Кинематография и сторителлинг",
    lessons: 14,
    topic: "ИИ-генерация видео",
    image: `${assetBase}/ai-video-smoke.jpg`,
  },
  {
    id: "vibe-coding-projects",
    title: "Вайб-кодим проект",
    subtitle: "Практика и готовые шаблоны",
    lessons: 10,
    topic: "Вайб-кодинг",
    image: `${assetBase}/vibe-code-purple.jpg`,
  },
  {
    id: "business-ai",
    title: "ИИ для бизнеса",
    subtitle: "Автоматизация и рост",
    lessons: 9,
    topic: "ИИ для бизнеса",
    image: `${assetBase}/business-jars.jpg`,
  },
  {
    id: "tools-reviews",
    title: "Полезные инструменты",
    subtitle: "Полные гайды и сравнения",
    lessons: 9,
    topic: "ИИ-генерация видео",
    image: `${assetBase}/tools-server-corridor.jpg`,
  },
];

const allLessons: LessonCard[] = [
  {
    id: "prompt-engineering-basics",
    title: "Промпт-инжиниринг: базовые принципы и примеры",
    topic: "ИИ-генерация изображений",
    image: `${assetBase}/prompt-coast.jpg`,
    duration: "08:21",
    author: courseAuthor.name,
    updated: "2 дня назад",
    dateRank: 10,
  },
  {
    id: "pika-new-features",
    title: "Pika 2.0: новые возможности и практические кейсы",
    topic: "ИИ-генерация видео",
    image: `${assetBase}/pika-neon-car.jpg`,
    duration: "11:27",
    author: courseAuthor.name,
    updated: "4 дня назад",
    dateRank: 9,
  },
  {
    id: "bolt-saas-evening",
    title: "Строим SaaS за вечер с помощью Bolt.new",
    topic: "Вайб-кодинг",
    image: `${assetBase}/bolt-saas-screen.jpg`,
    duration: "18:42",
    author: courseAuthor.name,
    updated: "6 дней назад",
    dateRank: 8,
  },
  {
    id: "ai-design-assistants",
    title: "AI-помощники в дизайне: Figma, Uizard, Galileo",
    topic: "Вайб-дизайн",
    image: `${assetBase}/ai-design-dashboard.jpg`,
    duration: "15:30",
    author: courseAuthor.name,
    updated: "1 неделю назад",
    dateRank: 7,
  },
  {
    id: "figma-ai-repeat",
    title: "Создаём интерфейсы в Figma с ИИ",
    topic: "Вайб-дизайн",
    image: `${assetBase}/figma-interior.jpg`,
    duration: "14:05",
    author: courseAuthor.name,
    updated: "1 неделю назад",
    dateRank: 6,
  },
  {
    id: "business-cases",
    title: "AI-автоматизация для бизнеса: кейсы и инструменты",
    topic: "ИИ для бизнеса",
    image: `${assetBase}/business-jars.jpg`,
    duration: "13:18",
    author: courseAuthor.name,
    updated: "2 недели назад",
    dateRank: 5,
  },
  {
    id: "cursor-advanced",
    title: "Cursor workflow: рефакторинг и быстрые прототипы",
    topic: "Вайб-кодинг",
    image: `${assetBase}/cursor-code.jpg`,
    duration: "17:04",
    author: courseAuthor.name,
    updated: "2 недели назад",
    dateRank: 4,
  },
  {
    id: "runway-editing",
    title: "Runway монтаж: темп, кадр и финальная сборка",
    topic: "ИИ-генерация видео",
    image: `${assetBase}/runway-neon-city.jpg`,
    duration: "20:10",
    author: courseAuthor.name,
    updated: "3 недели назад",
    dateRank: 3,
  },
  {
    id: "midjourney-advanced",
    title: "Midjourney: сложные сцены и стабильный стиль",
    topic: "ИИ-генерация изображений",
    image: `${assetBase}/midjourney-landscape.jpg`,
    duration: "16:14",
    author: courseAuthor.name,
    updated: "3 недели назад",
    dateRank: 2,
  },
];

export default function LearnOverviewPage() {
  const { lang } = useLang();
  const copy = pageCopy[lang];
  const [activeTopic, setActiveTopic] = useState<LearnTopic>("Все темы");
  const [sortKey, setSortKey] = useState<SortKey>("new");
  const [query, setQuery] = useState("");
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [showAllLessons, setShowAllLessons] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredContinueLessons = useMemo(
    () => filterLessons(continueLessons, activeTopic, normalizedQuery, lang),
    [activeTopic, normalizedQuery, lang],
  );
  const filteredCollections = useMemo(
    () =>
      collections.filter((collection) => {
        const topicMatch = activeTopic === "Все темы" || collection.topic === activeTopic;
        const queryMatch =
          !normalizedQuery ||
          `${collectionTitle(collection, lang)} ${collectionSubtitle(collection, lang)} ${topicLabel(collection.topic, lang)}`
            .toLowerCase()
            .includes(normalizedQuery);
        return topicMatch && queryMatch;
      }),
    [activeTopic, normalizedQuery, lang],
  );
  const filteredLessons = useMemo(() => {
    const lessons = filterLessons(allLessons, activeTopic, normalizedQuery, lang);
    return [...lessons].sort((a, b) => {
      if (sortKey === "popular") return b.duration.localeCompare(a.duration, "ru");
      if (sortKey === "progress") return (b.progress ?? 0) - (a.progress ?? 0);
      return b.dateRank - a.dateRank;
    });
  }, [activeTopic, normalizedQuery, sortKey, lang]);

  const displayedCollections = showAllCollections ? filteredCollections : filteredCollections.slice(0, 5);
  const displayedLessons = showAllLessons ? filteredLessons : filteredLessons.slice(0, 6);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SpaceHeader variant="learnOnly" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-780px] top-[-640px] h-[982px] w-[1720px] bg-[url('/assets/landing-design/gradient-blob-shape.svg')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-[0.18] blur-[140px] max-md:right-[-560px] max-md:top-[-300px] max-md:h-[548px] max-md:w-[960px] max-md:opacity-20 max-md:blur-[75px]"
      />
      <main className="relative z-10 mx-auto max-w-[1200px] px-[32px] pb-[80px] pt-[60px] max-md:px-4 max-md:pb-[64px] max-md:pt-[28px]">
        <section className="grid min-[1120px]:grid-cols-[minmax(0,552px)_minmax(0,224px)_261px] min-[1120px]:justify-between">
          <div>
            <h1 className="relative inline-block font-['Unbounded',sans-serif] text-[55px] font-bold leading-[1.05] tracking-normal text-white max-md:text-[42px] min-[1120px]:whitespace-nowrap">
              <span className="relative z-10">
                <span className="relative inline-block">
                  <span className="relative z-10">{copy.heroTitleLead}</span>
                  <img
                    src={`${assetBase}/title-line.png`}
                    alt=""
                    aria-hidden="true"
                    width="532"
                    height="74"
                    className="pointer-events-none absolute left-[-22px] top-[16%] z-20 h-auto w-[276px] max-w-none origin-center translate-y-[4px] scale-y-[0.72] select-none max-md:left-[-14px] max-md:top-[17%] max-md:w-[218px]"
                  />
                </span>{" "}
                {copy.heroTitleTail} <span className="text-[#9cfb51]">Opten</span>
              </span>
            </h1>
          </div>

          <AuthorCard lang={lang} />

          <HeroVideoCard lang={lang} className="mt-[51px] min-[1120px]:col-start-1 min-[1120px]:row-start-2" />
          <article className="mt-[51px] flex min-h-[310px] flex-col justify-center max-[1119px]:max-w-[552px] min-[1120px]:col-start-2 min-[1120px]:row-start-2 min-[1120px]:-ml-[18px]">
            <h2 className="text-[21px] font-bold leading-tight text-white">{copy.featuredTitle}</h2>
            <p className="mt-[15px] text-[14px] leading-[1.55] text-white/55">
              {copy.featuredDescription}
            </p>
            <button
              type="button"
              className="mt-[24px] h-[43px] w-[197px] rounded-[8px] bg-[#9cfb51] px-[20px] text-[14px] font-bold text-[#062013] transition hover:bg-[#8ee943] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011417]"
            >
              {copy.watchLesson}
            </button>
          </article>
        </section>

        <section className="mt-[34px] flex flex-wrap gap-[8px]" aria-label={copy.filterLabel}>
          {topics.map((topic) => {
            const active = topic === activeTopic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setActiveTopic(topic)}
                aria-pressed={active}
                className={`h-[37px] rounded-full border px-[17px] text-[14px] font-medium transition ${
                  active
                    ? "border-[#9cfb51] bg-[#9cfb51]/[0.08] text-white"
                    : "border-white/10 bg-white/[0.02] text-white/64 hover:border-white/24 hover:text-white"
                }`}
              >
                {topicLabel(topic, lang)}
              </button>
            );
          })}
        </section>

        <section className="mt-[22px] border-t border-white/10 pt-[13px]">
          <div className="flex items-center justify-between gap-[18px] max-md:flex-col max-md:items-stretch">
            <label className="relative block w-[215px] max-md:w-full">
              <span className="sr-only">{copy.sortLabel}</span>
              <SlidersHorizontal
                aria-hidden="true"
                size={15}
                className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-white/28"
              />
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className="h-[42px] w-full appearance-none rounded-[7px] border border-transparent bg-[#0e2023] pl-[40px] pr-[38px] text-[13px] font-medium text-white/86 outline-none transition hover:bg-[#10282c] focus:border-[#9cfb51]/55"
              >
                {(Object.keys(sortLabels[lang]) as SortKey[]).map((key) => (
                  <option key={key} value={key} className="bg-[#0e2023] text-white">
                    {copy.sortPrefix} {sortLabels[lang][key]}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                size={17}
                className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2 text-white/78"
              />
            </label>

            <label className="relative block w-[260px] max-md:w-full">
              <span className="sr-only">{copy.searchLabel}</span>
              <Search
                aria-hidden="true"
                size={17}
                className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-white/28"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-[42px] w-full rounded-[7px] border border-transparent bg-[#0e2023] pl-[40px] pr-[14px] text-[13px] text-white outline-none transition placeholder:text-white/48 hover:bg-[#10282c] focus:border-[#9cfb51]/55"
              />
            </label>
          </div>
        </section>

        <LessonSection
          title={copy.continueTitle}
          showAllLabel={copy.showAll}
          onShowAll={() => setShowAllLessons(true)}
        >
          <div className="grid grid-cols-4 gap-[14px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            {filteredContinueLessons.map((lesson) => (
              <ProgressLessonCard key={lesson.id} lesson={lesson} lang={lang} />
            ))}
          </div>
        </LessonSection>

        <LessonSection
          title={copy.collectionsTitle}
          showAllLabel={copy.showAll}
          onShowAll={() => setShowAllCollections(true)}
        >
          <div className="grid grid-cols-1 gap-[14px] min-[560px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1120px]:grid-cols-5">
            {displayedCollections.map((collection) => (
              <CollectionTile key={collection.id} collection={collection} lang={lang} />
            ))}
          </div>
        </LessonSection>

        <LessonSection
          title={copy.allLessonsTitle}
          showAllLabel={filteredLessons.length > displayedLessons.length ? copy.showAll : undefined}
          onShowAll={() => setShowAllLessons(true)}
        >
          <div className="grid grid-cols-3 gap-[17px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            {displayedLessons.map((lesson) => (
              <LargeLessonCard key={lesson.id} lesson={lesson} lang={lang} />
            ))}
          </div>
        </LessonSection>

        {filteredContinueLessons.length === 0 && filteredCollections.length === 0 && filteredLessons.length === 0 && (
          <section className="mt-[32px] rounded-[8px] border border-white/10 bg-[#0e2023] px-[20px] py-[38px] text-center">
            <p className="text-[16px] text-white">{copy.noResultsTitle}</p>
            <p className="mt-[6px] text-[14px] text-white/55">{copy.noResultsText}</p>
          </section>
        )}
      </main>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[360px] overflow-hidden max-md:h-[280px]">
        <div className="absolute left-1/2 bottom-[-640px] h-[982px] w-[1720px] -translate-x-[56%] bg-[url('/assets/landing-design/gradient-blob-shape.svg')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-[0.18] blur-[140px] max-md:bottom-[-300px] max-md:h-[548px] max-md:w-[960px] max-md:-translate-x-[59%] max-md:opacity-20 max-md:blur-[75px]" />
      </div>
      <SiteFooter variant="linksOnly" />
    </div>
  );
}

function HeroVideoCard({ lang, className = "" }: { lang: LearnLang; className?: string }) {
  return (
    <button
      type="button"
      className={`group relative block aspect-video overflow-hidden rounded-[12px] border border-white/12 bg-[#0e2023] text-left shadow-[0_20px_60px_rgba(0,0,0,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011417] ${className}`}
      aria-label={`${pageCopy[lang].watchLesson}: ${pageCopy[lang].featuredTitle}`}
    >
      <img
        src={featuredLesson.image}
        alt=""
        width="1200"
        height="676"
        className="absolute inset-0 h-full w-full object-cover opacity-88 transition duration-500 group-hover:scale-[1.025]"
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.02),rgba(1,16,18,0.24))]" />
      <span className="absolute left-1/2 top-1/2 grid size-[63px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#061417]/88 text-[#9cfb51] shadow-[0_10px_32px_rgba(0,0,0,0.36)] transition group-hover:scale-105">
        <Play size={32} fill="currentColor" className="ml-[3px]" />
      </span>
      <span className="absolute bottom-[10px] right-[11px] rounded-[4px] bg-black/70 px-[6px] py-[4px] text-[13px] font-medium leading-none text-white">
        {featuredLesson.duration}
      </span>
    </button>
  );
}

function AuthorCard({ lang }: { lang: LearnLang }) {
  return (
    <aside className="row-span-2 flex flex-col rounded-[15px] border border-white/10 bg-[#0e2023] px-[20px] py-[20px] shadow-none max-[1119px]:mt-[24px] max-[1119px]:max-w-[552px] min-[1120px]:col-start-3 min-[1120px]:row-start-1 min-[1120px]:h-[412px] min-[1120px]:self-end">
      <p className="text-[11px] font-bold uppercase leading-none text-white/38">{courseAuthor.label[lang]}</p>
      <img
        src={courseAuthor.avatar}
        alt={courseAuthor.name}
        width="400"
        height="400"
        className="mt-[22px] size-[96px] rounded-full border border-white/16 object-cover"
      />
      <h2 className="mt-[22px] inline-flex items-center gap-[7px] text-[21px] font-bold leading-tight text-white">
        {courseAuthor.name} <BadgeCheck size={15} className="text-[#9cfb51]" fill="currentColor" />
      </h2>
      <p className="mt-[15px] text-[14px] leading-[1.55] text-white/55">{courseAuthor.description[lang]}</p>
      <dl className="mt-auto grid grid-cols-2 gap-[24px]">
        {courseAuthor.stats.map((stat) => (
          <Stat
            key={stat.value.ru}
            value={stat.value[lang]}
            label={stat.label[lang]}
            active={"active" in stat ? stat.active : false}
          />
        ))}
      </dl>
    </aside>
  );
}

function Stat({ value, label, active = false }: { value: string; label: string; active?: boolean }) {
  return (
    <div>
      <dt className={`text-[16px] font-bold leading-none ${active ? "text-[#9cfb51]" : "text-white/70"}`}>{value}</dt>
      <dd className="mt-[7px] text-[12px] leading-tight text-white/42">{label}</dd>
    </div>
  );
}

function LessonSection({
  title,
  showAllLabel,
  onShowAll,
  children,
}: {
  title: string;
  showAllLabel?: string;
  onShowAll: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mt-[26px]">
      <div className="mb-[14px] flex items-center justify-between gap-[16px]">
        <h2 className="text-[22px] font-bold leading-tight text-white">{title}</h2>
        {showAllLabel && (
          <button type="button" onClick={onShowAll} className="text-[14px] font-medium text-white/52 transition hover:text-white">
            {showAllLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ProgressLessonCard({ lesson, lang }: { lesson: LessonCard; lang: LearnLang }) {
  return (
    <button
      type="button"
      className="group overflow-hidden rounded-[9px] border border-white/10 bg-[#0e2023] text-left transition hover:border-[#9cfb51]/45 hover:bg-[#10282c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]"
    >
      <MediaThumb lesson={lesson} compact />
      <div className="px-[12px] pb-[12px] pt-[12px]">
        <p className="text-[12px] leading-none text-white/38">{topicLabel(lesson.topic, lang)}</p>
        <h3 className="mt-[8px] min-h-[42px] text-[16px] font-bold leading-[1.28] text-white">{lessonTitle(lesson, lang)}</h3>
        <p className="mt-[18px] text-[14px] font-medium text-white/80">{lesson.progress}%</p>
        <div className="mt-[7px] h-[4px] rounded-full bg-white/12">
          <div className="h-full rounded-full bg-[#9cfb51]" style={{ width: `${lesson.progress}%` }} />
        </div>
      </div>
    </button>
  );
}

function CollectionTile({ collection, lang }: { collection: CollectionCard; lang: LearnLang }) {
  const copy = pageCopy[lang];

  return (
    <button
      type="button"
      className="group relative min-h-[237px] overflow-hidden rounded-[9px] border border-white/10 bg-[#0e2023] text-left transition hover:border-[#9cfb51]/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]"
    >
      <img
        src={collection.image}
        alt=""
        width="1200"
        height="676"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-500 group-hover:scale-[1.035]"
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.12),rgba(1,16,18,0.9)_78%)]" />
      <span className="absolute left-[13px] top-[13px] inline-flex h-[18px] w-[46px] items-center justify-center rounded-[4px] bg-[#9cfb51] pb-[4px] pl-[9px] pr-[9px] pt-[3px] text-[10px] font-medium leading-[1.1] tracking-[-0.03em] text-[#062013]">
        {copy.soon}
      </span>
      <span className="absolute bottom-[82px] left-[13px] inline-flex items-center gap-[5px] text-[12px] text-white/80">
        <BookOpen size={14} />
        {collection.lessons} {copy.lessonUnit}
      </span>
      <span className="absolute inset-x-[13px] bottom-[17px]">
        <span className="block text-[17px] font-bold leading-[1.24] text-white">{collectionTitle(collection, lang)}</span>
        <span className="mt-[7px] block text-[13px] leading-tight text-white/55">{collectionSubtitle(collection, lang)}</span>
      </span>
    </button>
  );
}

function LargeLessonCard({ lesson, lang }: { lesson: LessonCard; lang: LearnLang }) {
  return (
    <button
      type="button"
      className="group overflow-hidden rounded-[9px] border border-white/10 bg-[#0e2023] text-left transition hover:border-[#9cfb51]/45 hover:bg-[#10282c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]"
    >
      <MediaThumb lesson={lesson} />
      <div className="px-[14px] pb-[20px] pt-[13px]">
        <p className="text-[12px] leading-none text-white/38">{topicLabel(lesson.topic, lang)}</p>
        <h3 className="mt-[9px] min-h-[49px] text-[18px] font-bold leading-[1.3] text-white">{lessonTitle(lesson, lang)}</h3>
        <div className="mt-[22px] flex items-center gap-[10px] text-[13px] text-white/52">
          <img
            src={courseAuthor.avatar}
            alt=""
            width="400"
            height="400"
            loading="lazy"
            decoding="async"
            className="size-[25px] shrink-0 rounded-full border border-white/14 object-cover"
          />
          <span>{lesson.author}</span>
          <span className="ml-[6px] text-white/35">{lessonUpdated(lesson, lang)}</span>
        </div>
      </div>
    </button>
  );
}

function MediaThumb({ lesson, compact = false }: { lesson: LessonCard; compact?: boolean }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-[#0e2023]">
      <img
        src={lesson.image}
        alt=""
        width="1200"
        height="676"
        loading="lazy"
        className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.035]"
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.04),rgba(1,16,18,0.26))]" />
      <span
        className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/22 bg-black/58 text-white backdrop-blur-sm transition group-hover:border-[#9cfb51]/70 group-hover:text-[#9cfb51] ${
          compact ? "size-[43px]" : "size-[48px]"
        }`}
      >
        <Play size={compact ? 19 : 21} fill="currentColor" className="ml-[2px]" />
      </span>
      <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/72 px-[6px] py-[4px] text-[13px] font-medium leading-none text-white">
        {lesson.duration}
      </span>
    </div>
  );
}

function filterLessons(lessons: LessonCard[], activeTopic: LearnTopic, normalizedQuery: string, lang: LearnLang) {
  return lessons.filter((lesson) => {
    const topicMatch = activeTopic === "Все темы" || lesson.topic === activeTopic;
    const queryMatch =
      !normalizedQuery ||
      `${lessonTitle(lesson, lang)} ${topicLabel(lesson.topic, lang)} ${lesson.author} ${lessonUpdated(lesson, lang)}`
        .toLowerCase()
        .includes(normalizedQuery);
    return topicMatch && queryMatch;
  });
}

function topicLabel(topic: LearnTopic | LessonTopic, lang: LearnLang) {
  return topicLabels[lang][topic];
}

function lessonTitle(lesson: LessonCard, lang: LearnLang) {
  return lessonTranslations[lesson.id]?.title[lang] ?? lesson.title;
}

function lessonUpdated(lesson: LessonCard, lang: LearnLang) {
  return lessonTranslations[lesson.id]?.updated[lang] ?? lesson.updated;
}

function collectionTitle(collection: CollectionCard, lang: LearnLang) {
  return collectionTranslations[collection.id]?.title[lang] ?? collection.title;
}

function collectionSubtitle(collection: CollectionCard, lang: LearnLang) {
  return collectionTranslations[collection.id]?.subtitle[lang] ?? collection.subtitle;
}
