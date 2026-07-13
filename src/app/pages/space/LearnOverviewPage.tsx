import {
  BookOpen,
  ChevronDown,
  Play,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import {
  featuredLearnLesson,
  futureLearnCollections,
  getFutureCollectionSubtitle,
  getFutureCollectionTitle,
  getLearnAuthorName,
  getLearnLessonAuthor,
  getLearnLessonCategoryLabel,
  getLearnLessonDescription,
  getLearnLessonTitle,
  hiddenLearnOverviewLessonSlugs,
  learnHubFaq,
  learnTopicLabels,
  publicLearnLessons,
  type LearnFutureCollection,
  type LearnLang,
  type LearnLesson,
  type LearnTopic,
} from "../../../content/space/learn";
import { privateCourseCollection } from "../../../content/space/privateCourse";
import {
  findMatchesQuery,
  getLearnFindDescription,
  getLearnFindRoute,
  getLearnFindSourceLabel,
  getLearnFindTitle,
  getYoutubeThumbnailUrl,
  learnFinds,
  type LearnFind,
} from "../../../content/space/learnFinds";
import LocalizedLink from "../../components/LocalizedLink";
import ResponsiveImage from "../../components/ResponsiveImage";
import SiteFooter from "../../components/SiteFooter";
import SpaceHeader from "../../components/space/SpaceHeader";

const assetBase = "/assets/space/learn-v2";

type TopicFilter = "all" | "ai-image" | "ai-video" | "vibe-coding" | "vibe-design";
type SortKey = "new" | "duration";
type ContentTab = "lessons" | "finds";

const SHOW_LEARN_COLLECTIONS = false;
const HIDDEN_LEARN_LESSON_SLUGS = new Set<string>(hiddenLearnOverviewLessonSlugs);
const topics: TopicFilter[] = ["all", "ai-image", "ai-video", "vibe-coding", "vibe-design"];

const authorSocialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/channel/UC797Sd_fYNILYZFuXsjjFDA", iconPath: "/assets/space/social/youtube.svg" },
  { label: "Instagram", href: "https://www.instagram.com/v.voronezhtsev/", iconPath: "/assets/space/social/instagram.svg" },
  { label: "Telegram", href: "https://t.me/v_voronezhtsev", iconPath: "/assets/space/social/telegram.svg" },
  { label: "TikTok", href: "https://www.tiktok.com/@v_voronezhtsev", iconPath: "/assets/space/social/tiktok.svg" },
] as const;

const sortLabels: Record<LearnLang, Record<SortKey, string>> = {
  ru: {
    new: "Новые",
    duration: "Длительность",
  },
  en: {
    new: "Newest",
    duration: "Duration",
  },
};

const topicLabels: Record<LearnLang, Record<TopicFilter | LearnTopic, string>> = {
  ru: {
    all: "Все темы",
    ...learnTopicLabels.ru,
  },
  en: {
    all: "All topics",
    ...learnTopicLabels.en,
  },
};

const pageCopy = {
  ru: {
    heroTitleLine1Before: "Обучение",
    heroTitleLine1Highlight: "ИИ",
    heroTitleLine1After: "",
    watchLesson: "Смотреть урок",
    filterLabel: "Фильтр тем",
    sortLabel: "Сортировка",
    sortPrefix: "Сортировка:",
    searchLabel: "Поиск уроков",
    searchPlaceholder: "Поиск уроков...",
    collectionsTitle: "Подборки",
    viewAllCollections: "Смотреть всё",
    aiTrainingTitle: "Обучение ИИ",
    viewAllCourse: "Смотреть все",
    allLessonsTitle: "Бесплатные уроки",
    findsTitle: "Находки",
    lessonsTab: "Уроки",
    findsTab: "Находки",
    findBadge: "Из сториз",
    noResultsTitle: "Ничего не найдено",
    noResultsText: "Попробуйте изменить тему или поисковый запрос.",
    soon: "Скоро",
    lessonUnit: "уроков",
    faqTitle: "Ответы по курсам",
  },
  en: {
    heroTitleLine1Before: "",
    heroTitleLine1Highlight: "AI",
    heroTitleLine1After: "Courses",
    watchLesson: "Watch lesson",
    filterLabel: "Topic filter",
    sortLabel: "Sorting",
    sortPrefix: "Sort:",
    searchLabel: "Search lessons",
    searchPlaceholder: "Search lessons...",
    collectionsTitle: "Collections",
    viewAllCollections: "View all",
    aiTrainingTitle: "AI training",
    viewAllCourse: "View all",
    allLessonsTitle: "Free lessons",
    findsTitle: "Finds",
    lessonsTab: "Lessons",
    findsTab: "Finds",
    findBadge: "From stories",
    noResultsTitle: "Nothing found",
    noResultsText: "Try changing the topic or search query.",
    soon: "Soon",
    lessonUnit: "lessons",
    faqTitle: "Course answers",
  },
} as const;

const courseAuthor = {
  label: {
    ru: "Автор курсов",
    en: "Course author",
  },
  description: {
    ru: "3 года создаю видеоуроки и рабочие процессы по нейросетям.",
    en: "I have been creating video lessons and AI workflows for 3 years.",
  },
  stats: [
    {
      value: { ru: "34K", en: "34K" },
      label: { ru: "подписчиков", en: "followers" },
      active: true,
    },
    {
      value: { ru: "9 лет", en: "9 years" },
      label: { ru: "в digital", en: "in design" },
    },
  ],
} as const;

const featuredCoursePromo = {
  coverPath: "/assets/learn/video/actual-ai-tools-2026-poster.jpg",
  title: {
    ru: "Нейросети для контента и маркетинга 2026",
    en: "AI for Content and Marketing 2026",
  },
  description: {
    ru: "Всё, что нужно знать для создания упаковки бренда, не имея навыков в дизайне и монтаже. За 15 коротких уроков мы создадим логотип, фото и видео в соцсети, запустим сайт и всё это с помощью ИИ!",
    en: "The most honest AI course. In under an hour, I will cover everything you need to know to create a brand package without design or editing skills. Across 15 short lessons, we will create a logo, photos and social videos, launch a website, and do it all with AI.",
  },
  cta: {
    ru: "Перейти",
    en: "Open",
  },
  href: "/learn/courses/ai-content-marketing-2026",
} as const;

const featuredCourseLessons = privateCourseCollection.lessons.slice(0, 3);

export default function LearnOverviewPage() {
  const { lang } = useLang();
  const copy = pageCopy[lang];
  const [activeTopic, setActiveTopic] = useState<TopicFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("new");
  const [query, setQuery] = useState("");
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [contentTab, setContentTab] = useState<ContentTab>("lessons");

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    setShowAllCollections(false);
  }, [activeTopic, normalizedQuery]);

  const filteredCollections = useMemo(
    () =>
      futureLearnCollections.filter((collection) => {
        const topicMatch = activeTopic === "all" || collection.topic === activeTopic;
        const haystack = [
          getFutureCollectionTitle(collection, lang),
          getFutureCollectionSubtitle(collection, lang),
          learnTopicLabels[lang][collection.topic],
        ]
          .join(" ")
          .toLowerCase();
        return topicMatch && (!normalizedQuery || haystack.includes(normalizedQuery));
      }),
    [activeTopic, normalizedQuery, lang],
  );

  const filteredLessons = useMemo(() => {
    const lessons = publicLearnLessons.filter((lesson) => {
      if (HIDDEN_LEARN_LESSON_SLUGS.has(lesson.slug)) return false;
      const topicMatch = activeTopic === "all" || lesson.category === activeTopic;
      const haystack = [
        getLearnLessonTitle(lesson, lang),
        getLearnLessonDescription(lesson, lang),
        getLearnLessonCategoryLabel(lesson, lang),
        getLearnLessonAuthor(lesson).name,
      ]
        .join(" ")
        .toLowerCase();
      return topicMatch && (!normalizedQuery || haystack.includes(normalizedQuery));
    });

    return [...lessons].sort((a, b) => {
      if (sortKey === "duration") return durationToSeconds(b.duration) - durationToSeconds(a.duration);
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [activeTopic, normalizedQuery, sortKey, lang]);

  const filteredFinds = useMemo(() => {
    const finds = learnFinds.filter((find) => {
      const topicMatch = activeTopic === "all" || find.topic === activeTopic;
      return topicMatch && findMatchesQuery(find, lang, normalizedQuery);
    });

    return [...finds].sort((a, b) => {
      if (sortKey === "duration") return durationToSeconds(b.duration) - durationToSeconds(a.duration);
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [activeTopic, normalizedQuery, sortKey, lang]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SpaceHeader variant="learnOnly" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-780px] top-[-640px] h-[982px] w-[1720px] bg-[url('/assets/landing-design/gradient-blob-shape.svg')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-[0.18] blur-[140px] max-md:right-[-560px] max-md:top-[-300px] max-md:h-[548px] max-md:w-[960px] max-md:opacity-20 max-md:blur-[75px]"
      />
      <main className="relative z-10 mx-auto max-w-[1200px] px-[32px] pb-[80px] pt-[60px] max-md:px-4 max-md:pb-[64px] max-md:pt-[30px]">
        <section className="grid min-[1120px]:grid-cols-[minmax(0,552px)_minmax(0,224px)_261px] min-[1120px]:justify-between">
          <div className="max-md:text-center">
            <h1 className="relative inline-block max-w-[552px] font-['Unbounded',sans-serif] text-[52px] font-bold leading-[1.05] tracking-normal text-white max-md:mx-auto max-md:text-center max-md:text-[39px]">
              <span className="relative z-10">
                <span className="relative inline-block">
                  {copy.heroTitleLine1Before ? `${copy.heroTitleLine1Before} ` : ""}
                  <span className="text-[#9cfb51]">{copy.heroTitleLine1Highlight}</span>
                  {copy.heroTitleLine1After ? ` ${copy.heroTitleLine1After}` : ""}
                </span>
              </span>
            </h1>
          </div>

          <AuthorCard lang={lang} />

          <HeroVideoCard lang={lang} className="mt-[51px] max-[1119px]:max-w-[552px] max-md:mt-[30px] min-[1120px]:col-start-1 min-[1120px]:row-start-2" />
          <article className="mt-[51px] flex min-h-[310px] flex-col justify-center max-[1119px]:max-w-[552px] max-md:mt-[20px] max-md:min-h-0 max-md:items-center max-md:text-center min-[1120px]:col-start-2 min-[1120px]:row-start-2 min-[1120px]:w-[215px] min-[1120px]:max-w-[215px] min-[1120px]:-ml-[18px]">
            <h2 className="text-[21px] font-bold leading-tight text-white">
              {featuredCoursePromo.title[lang]}
            </h2>
            <p className="mt-[15px] text-[14px] leading-[1.55] text-white/55">
              {featuredCoursePromo.description[lang]}
            </p>
            <LocalizedLink
              to={featuredCoursePromo.href}
              className="mt-[24px] flex h-[43px] w-[197px] items-center justify-center rounded-[8px] bg-[#9cfb51] px-[20px] text-[14px] font-bold text-[#062013] no-underline transition hover:bg-[#adff6f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011417] max-md:w-full min-[1120px]:w-full"
            >
              {featuredCoursePromo.cta[lang]}
            </LocalizedLink>
          </article>
        </section>

        <section className="mt-[34px] flex flex-wrap gap-[8px] max-md:hidden" aria-label={copy.filterLabel}>
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

        <section className="mt-[22px] border-t border-white/10 pt-[13px] max-md:mt-[44px] max-md:border-t-0 max-md:pt-0">
          <div className="flex items-center justify-between gap-[18px] max-md:flex-col max-md:items-stretch max-md:gap-[6px]">
            <label className="relative hidden w-full max-md:block">
              <span className="sr-only">{copy.filterLabel}</span>
              <SlidersHorizontal
                aria-hidden="true"
                size={15}
                className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-white/28 max-md:hidden"
              />
              <select
                value={activeTopic}
                onChange={(event) => setActiveTopic(event.target.value as TopicFilter)}
                className="h-[42px] w-full appearance-none rounded-[7px] border border-transparent bg-[#0e2023] pl-[40px] pr-[38px] text-[13px] font-medium text-white/86 outline-none transition hover:bg-[#10282c] focus:border-[#9cfb51]/55 max-md:pl-[14px]"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic} className="bg-[#0e2023] text-white">
                    {topicLabel(topic, lang)}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                size={17}
                className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2 text-white/78"
              />
            </label>

            <label className="relative block w-[215px] max-md:w-full">
              <span className="sr-only">{copy.sortLabel}</span>
              <SlidersHorizontal
                aria-hidden="true"
                size={15}
                className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-white/28 max-md:hidden"
              />
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className="h-[42px] w-full appearance-none rounded-[7px] border border-transparent bg-[#0e2023] pl-[40px] pr-[38px] text-[13px] font-medium text-white/86 outline-none transition hover:bg-[#10282c] focus:border-[#9cfb51]/55 max-md:pl-[14px]"
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
                className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-white/28 max-md:hidden"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-[42px] w-full rounded-[7px] border border-transparent bg-[#0e2023] pl-[40px] pr-[14px] text-[13px] text-white outline-none transition placeholder:text-white/48 hover:bg-[#10282c] focus:border-[#9cfb51]/55 max-md:pl-[14px]"
              />
            </label>
          </div>
        </section>

        {SHOW_LEARN_COLLECTIONS && (
          <LessonSection
            title={copy.collectionsTitle}
            action={
              filteredCollections.length > 1 && !showAllCollections ? (
                <button
                  type="button"
                  onClick={() => setShowAllCollections(true)}
                  className="hidden h-[30px] shrink-0 items-center rounded-full border border-[#9cfb51]/45 px-[12px] text-[12px] font-bold leading-none text-[#9cfb51] transition hover:bg-[#9cfb51]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/70 max-md:inline-flex"
                >
                  {copy.viewAllCollections}
                </button>
              ) : null
            }
          >
            <div className="grid grid-cols-1 gap-[14px] min-[560px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1120px]:grid-cols-5">
              {filteredCollections.map((collection, index) => (
                <CollectionTile
                  key={collection.id}
                  collection={collection}
                  lang={lang}
                  className={!showAllCollections && index > 0 ? "max-md:hidden" : ""}
                />
              ))}
            </div>
          </LessonSection>
        )}

        <LessonSection
          title={copy.aiTrainingTitle}
          action={
            <LocalizedLink
              to={featuredCoursePromo.href}
              className="inline-flex h-[30px] shrink-0 items-center rounded-full border border-[#9cfb51]/45 px-[12px] text-[12px] font-bold leading-none text-[#9cfb51] no-underline transition hover:bg-[#9cfb51]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/70"
            >
              {copy.viewAllCourse}
            </LocalizedLink>
          }
        >
          <div className="grid grid-cols-3 gap-[17px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            {featuredCourseLessons.map((lesson) => (
              <LargeLessonCard
                key={lesson.slug}
                lesson={lesson}
                lang={lang}
                href={`${featuredCoursePromo.href}/${lesson.slug}`}
              />
            ))}
          </div>
        </LessonSection>

        <LessonSection
          title={contentTab === "lessons" ? copy.allLessonsTitle : copy.findsTitle}
          action={<LearnContentTabs activeTab={contentTab} onChange={setContentTab} lang={lang} />}
        >
          {contentTab === "lessons" ? (
            <div className="grid grid-cols-3 gap-[17px] max-lg:grid-cols-2 max-sm:grid-cols-1">
              {filteredLessons.map((lesson) => (
                <LargeLessonCard key={lesson.slug} lesson={lesson} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[17px] max-lg:grid-cols-2 max-sm:grid-cols-1">
              {filteredFinds.map((find) => (
                <LargeFindCard key={find.slug} find={find} lang={lang} badge={copy.findBadge} />
              ))}
            </div>
          )}
        </LessonSection>

        {(SHOW_LEARN_COLLECTIONS ? filteredCollections.length === 0 : true) &&
          (contentTab === "lessons" ? filteredLessons.length === 0 : filteredFinds.length === 0) && (
          <section className="mt-[32px] rounded-[8px] border border-white/10 bg-[#0e2023] px-[20px] py-[38px] text-center">
            <p className="text-[16px] text-white">{copy.noResultsTitle}</p>
            <p className="mt-[6px] text-[14px] text-white/55">{copy.noResultsText}</p>
          </section>
          )}

        <LearnFaqSection lang={lang} />
      </main>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[620px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_100%)] max-md:h-[420px]"
      >
        <div className="absolute left-1/2 bottom-[-500px] h-[982px] w-[1720px] -translate-x-[56%] bg-[url('/assets/landing-design/gradient-blob-shape.svg')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-[0.18] blur-[140px] max-md:bottom-[-260px] max-md:h-[548px] max-md:w-[960px] max-md:-translate-x-[59%] max-md:opacity-20 max-md:blur-[75px]" />
      </div>
      <SiteFooter variant="linksOnly" />
    </div>
  );
}

function LearnContentTabs({ activeTab, onChange, lang }: { activeTab: ContentTab; onChange: (tab: ContentTab) => void; lang: LearnLang }) {
  const copy = pageCopy[lang];
  const items: { id: ContentTab; label: string }[] = [
    { id: "lessons", label: copy.lessonsTab },
    { id: "finds", label: copy.findsTab },
  ];

  return (
    <div className="inline-flex h-[36px] shrink-0 rounded-[8px] border border-white/10 bg-[#0e2023] p-[3px]" aria-label={lang === "ru" ? "Тип контента" : "Content type"}>
      {items.map((item) => {
        const active = item.id === activeTab;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={active}
            className={`h-[28px] min-h-0 rounded-[6px] border-0 px-[12px] pb-[1px] text-[13px] font-bold transition ${
              active ? "bg-[#9cfb51] text-[#062013]" : "bg-transparent text-white/58 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function HeroVideoCard({ lang, className = "" }: { lang: LearnLang; className?: string }) {
  return (
    <div
      className={`relative block aspect-video overflow-hidden rounded-[12px] border border-white/12 bg-[#0e2023] text-left shadow-[0_20px_60px_rgba(0,0,0,0.22)] ${className}`}
      aria-label={featuredCoursePromo.title[lang]}
    >
      <ResponsiveImage
        src={featuredCoursePromo.coverPath}
        alt=""
        width="1200"
        height="676"
        loading="eager"
        widths={[480, 800, 1200]}
        sizes="(max-width: 1119px) 552px, 552px"
        className="absolute inset-0 h-full w-full object-cover opacity-78"
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.44),rgba(1,16,18,0.22)_48%,rgba(1,16,18,0.56))]" />
    </div>
  );
}

function AuthorCard({ lang }: { lang: LearnLang }) {
  const author = getLearnLessonAuthor(featuredLearnLesson);
  const authorName = getLearnAuthorName(author, lang);

  return (
    <aside className="row-span-2 flex flex-col rounded-[15px] border border-white/10 bg-[#0e2023] px-[20px] py-[20px] shadow-none max-[1119px]:mt-[24px] max-[1119px]:max-w-[552px] max-md:hidden min-[1120px]:col-start-3 min-[1120px]:row-start-1 min-[1120px]:h-[412px] min-[1120px]:self-end">
      <p className="text-[11px] font-bold uppercase leading-none text-white/38">{courseAuthor.label[lang]}</p>
      <ResponsiveImage
        src={author.avatarPath}
        alt={authorName}
        width="400"
        height="400"
        loading="lazy"
        widths={[96, 192]}
        sizes="96px"
        className="mt-[22px] size-[96px] rounded-full border border-white/16 object-cover"
      />
      <h2 className="mt-[22px] text-[21px] font-bold leading-tight text-white">{authorName}</h2>
      <p className="mt-[15px] text-[14px] leading-[1.55] text-white/55">{courseAuthor.description[lang]}</p>
      <div className="mt-[16px] flex flex-wrap gap-[8px]" aria-label={lang === "ru" ? "Соцсети автора" : "Author social links"}>
        {authorSocialLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="grid size-[43px] place-items-center rounded-full opacity-80 transition hover:opacity-100 hover:drop-shadow-[0_0_14px_rgba(156,251,81,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cfb51]/60"
          >
            <img src={item.iconPath} alt="" width="43" height="43" className="size-[43px]" loading="lazy" />
          </a>
        ))}
      </div>
      <dl className="mt-auto flex w-[226px] items-start">
        <div aria-hidden="true" className="shrink-0">
          <ResponsiveImage
            src={`${assetBase}/author-followers-avatars.png`}
            alt=""
            width="285"
            height="180"
            loading="eager"
            decoding="async"
            widths={[96, 192, 320]}
            sizes="58px"
            className="h-[37.24px] w-[58px] -translate-y-[2px] select-none object-fill"
          />
        </div>
        {courseAuthor.stats.map((stat, index) => (
          <Stat
            key={stat.value.ru}
            value={stat.value[lang]}
            label={stat.label[lang]}
            active={"active" in stat ? stat.active : false}
            className={index === 0 ? "ml-[7px] w-[72px]" : "ml-[17px] w-[72px]"}
          />
        ))}
      </dl>
    </aside>
  );
}

function Stat({ value, label, active = false, className = "" }: { value: string; label: string; active?: boolean; className?: string }) {
  return (
    <div className={className}>
      <dt className={`text-[16px] font-bold leading-[1.3] ${active ? "text-[#9cfb51]" : "text-white"}`}>{value}</dt>
      <dd className="text-[12px] leading-[1.3] text-white/55">{label}</dd>
    </div>
  );
}

function LessonSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-[26px]">
      <div className="mb-[14px] flex items-center justify-between gap-[16px]">
        <h2 className="text-[22px] font-bold leading-tight text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function LearnFaqSection({ lang }: { lang: LearnLang }) {
  const copy = pageCopy[lang];
  const items = learnHubFaq[lang];

  return (
    <section id="learn-faq" className="learn-faq mt-[48px] pt-[28px]" aria-labelledby="learn-faq-heading">
      <h2 id="learn-faq-heading" className="text-[22px] font-bold leading-tight text-white">{copy.faqTitle}</h2>
      <dl className="mt-[18px] grid grid-cols-2 gap-[14px] max-md:grid-cols-1">
        {items.map((item) => (
          <div key={item.q} className="rounded-[8px] border border-white/10 bg-white/[0.025] px-[18px] py-[17px]">
            <dt className="learn-faq-question text-[16px] font-bold leading-[1.35] text-white">{item.q}</dt>
            <dd className="learn-faq-answer mt-[9px] text-[14px] leading-[1.65] text-white/62">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CollectionTile({ collection, lang, className = "" }: { collection: LearnFutureCollection; lang: LearnLang; className?: string }) {
  const copy = pageCopy[lang];

  return (
    <article className={`group relative block min-h-[237px] overflow-hidden rounded-[9px] border border-white/10 bg-[#0e2023] text-left transition hover:border-[#9cfb51]/45 ${className}`}>
      <ResponsiveImage
        src={collection.image}
        alt=""
        width="1200"
        height="676"
        loading="lazy"
        widths={[360, 480, 720]}
        sizes="(max-width: 559px) calc(100vw - 32px), (max-width: 899px) calc(50vw - 24px), 220px"
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
        <span className="block text-[17px] font-bold leading-[1.24] text-white">{getFutureCollectionTitle(collection, lang)}</span>
        <span className="mt-[7px] block text-[13px] leading-tight text-white/55">{getFutureCollectionSubtitle(collection, lang)}</span>
      </span>
    </article>
  );
}

function LargeLessonCard({ lesson, lang, href }: { lesson: LearnLesson; lang: LearnLang; href?: string }) {
  const author = getLearnLessonAuthor(lesson);
  const authorName = getLearnAuthorName(author, lang);

  return (
    <LocalizedLink
      to={href ?? `/learn/${lesson.slug}`}
      className="group block overflow-hidden rounded-[9px] border border-white/10 bg-[#0e2023] text-left no-underline transition hover:border-[#9cfb51]/45 hover:bg-[#10282c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]"
    >
      <MediaThumb lesson={lesson} />
      <div className="px-[14px] pb-[20px] pt-[13px]">
        <p className="text-[12px] leading-none text-white/38">{getLearnLessonCategoryLabel(lesson, lang)}</p>
        <h3 className="mt-[9px] min-h-[49px] text-[18px] font-bold leading-[1.3] text-white">{getLearnLessonTitle(lesson, lang)}</h3>
        <div className="mt-[22px] flex items-center gap-[10px] text-[13px] text-white/52">
          <ResponsiveImage
            src={author.avatarPath}
            alt=""
            width="400"
            height="400"
            loading="lazy"
            decoding="async"
            widths={[64, 96]}
            sizes="25px"
            className="size-[25px] shrink-0 rounded-full border border-white/14 object-cover"
          />
          <span>{authorName}</span>
          <span className="ml-[6px] text-white/35">{lessonUpdated(lesson, lang)}</span>
        </div>
      </div>
    </LocalizedLink>
  );
}

function LargeFindCard({ find, lang, badge }: { find: LearnFind; lang: LearnLang; badge: string }) {
  return (
    <LocalizedLink
      to={getLearnFindRoute(find, lang)}
      className="group block overflow-hidden rounded-[9px] border border-white/10 bg-[#0e2023] text-left no-underline transition hover:border-[#9cfb51]/45 hover:bg-[#10282c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]"
    >
      <div className="relative aspect-video overflow-hidden bg-[#0e2023]">
        <img
          src={getYoutubeThumbnailUrl(find.youtubeId)}
          alt=""
          width="1280"
          height="720"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.035]"
          onError={(event) => {
            const image = event.currentTarget;
            if (image.dataset.fallback !== "true") {
              image.dataset.fallback = "true";
              image.src = getYoutubeThumbnailUrl(find.youtubeId, "hq");
            }
          }}
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.04),rgba(1,16,18,0.38))]" />
        <span className="absolute left-[10px] top-[10px] rounded-[5px] bg-[#9cfb51] px-[8px] py-[5px] text-[11px] font-bold leading-none text-[#062013]">
          {badge}
        </span>
        <span className="absolute left-1/2 top-1/2 grid size-[48px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#9cfb51] text-[#011417] shadow-[0_14px_38px_rgba(156,251,81,0.22)] transition group-hover:scale-[1.04] group-hover:bg-[#8ff144]">
          <Play size={21} fill="currentColor" className="ml-[2px]" />
        </span>
        <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/72 px-[6px] py-[4px] text-[13px] font-medium leading-none text-white">
          {find.duration}
        </span>
      </div>
      <div className="px-[14px] pb-[20px] pt-[13px]">
        <p className="text-[12px] leading-none text-white/38">{topicLabel(find.topic, lang)}</p>
        <h3 className="mt-[9px] text-[18px] font-bold leading-[1.3] text-white">{getLearnFindTitle(find, lang)}</h3>
        <p className="mt-[8px] line-clamp-2 text-[13px] leading-[1.45] text-white/58">{getLearnFindDescription(find, lang)}</p>
        <div className="mt-[18px] flex items-center gap-[10px] text-[13px] text-white/52">
          <span className="grid size-[25px] shrink-0 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-[11px] font-bold text-[#9cfb51]">
            AI
          </span>
          <span>{getLearnFindSourceLabel(find, lang)}</span>
          <span className="ml-[6px] text-white/35">{findUpdated(find, lang)}</span>
        </div>
      </div>
    </LocalizedLink>
  );
}

function MediaThumb({ lesson }: { lesson: LearnLesson }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-[#0e2023]">
      <ResponsiveImage
        src={lesson.thumbnailPath}
        alt=""
        width="1200"
        height="676"
        loading="lazy"
        widths={[360, 480, 720, 960]}
        sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 36px), 380px"
        className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.035]"
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.04),rgba(1,16,18,0.26))]" />
      <span className="absolute left-1/2 top-1/2 grid size-[48px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#9cfb51] text-[#011417] shadow-[0_14px_38px_rgba(156,251,81,0.22)] transition group-hover:scale-[1.04] group-hover:bg-[#8ff144]">
        <Play size={21} fill="currentColor" className="ml-[2px]" />
      </span>
      <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/72 px-[6px] py-[4px] text-[13px] font-medium leading-none text-white">
        {lesson.duration}
      </span>
    </div>
  );
}

function renderFeaturedLessonTitle(lesson: LearnLesson, lang: LearnLang) {
  const title = getLearnLessonTitle(lesson, lang);
  if (lang !== "ru" || title !== "Актуальные нейросети в 2026 году") return title;

  return (
    <>
      Актуальные нейросети{" "}
      <br />
      в 2026 году
    </>
  );
}

function topicLabel(topic: TopicFilter | LearnTopic, lang: LearnLang) {
  return topicLabels[lang][topic];
}

function lessonUpdated(lesson: LearnLesson, lang: LearnLang) {
  const date = new Date(`${lesson.publishedAt}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function findUpdated(find: LearnFind, lang: LearnLang) {
  const date = new Date(`${find.publishedAt}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function durationToSeconds(duration: string) {
  const parts = duration.split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}
