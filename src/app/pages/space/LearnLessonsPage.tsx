import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  getLearnLessonDescription,
  getLearnLessonTitle,
  getLearnLessonTopics,
  publicLearnLessons,
  type LearnLang,
  type LearnTopic,
} from "../../../content/space/learn";
import { useLang } from "../../../i18n/LangContext";
import SiteFooter from "../../components/SiteFooter";
import SpaceHeader from "../../components/space/SpaceHeader";
import LearnLessonCard from "../../components/space/learn/LearnLessonCard";

type CatalogFilter = "all" | Extract<LearnTopic, "ai-video" | "vibe-coding">;

const filters: CatalogFilter[] = ["all", "ai-video", "vibe-coding"];

const copy = {
  ru: {
    title: "Бесплатные уроки",
    intro: "Практические видеоуроки по нейросетям, генерации видео, дизайну и вайб-кодингу. Выбирайте тему и повторяйте весь процесс по шагам.",
    filterLabel: "Фильтр уроков",
    filterLabels: {
      all: "Все",
      "ai-video": "Генерация видео",
      "vibe-coding": "Вайбкодинг",
    },
    searchLabel: "Поиск уроков",
    searchPlaceholder: "Поиск по урокам...",
    emptyTitle: "Уроки не найдены",
    emptyBody: "Попробуйте другой запрос или сбросьте фильтр.",
    clear: "Показать все уроки",
  },
  en: {
    title: "Free lessons",
    intro: "Practical video lessons on AI, video generation, design, and vibe coding. Pick a topic and follow the complete workflow step by step.",
    filterLabel: "Lesson filter",
    filterLabels: {
      all: "All",
      "ai-video": "Video generation",
      "vibe-coding": "Vibe coding",
    },
    searchLabel: "Search lessons",
    searchPlaceholder: "Search lessons...",
    emptyTitle: "No lessons found",
    emptyBody: "Try another query or clear the filter.",
    clear: "Show all lessons",
  },
} satisfies Record<LearnLang, object>;

export default function LearnLessonsPage() {
  const { lang } = useLang();
  const pageCopy = copy[lang];
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>("all");
  const [query, setQuery] = useState("");

  const lessons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...publicLearnLessons]
      .filter((lesson) => {
        if (activeFilter !== "all" && lesson.category !== activeFilter) return false;
        if (!normalizedQuery) return true;
        const haystack = [
          getLearnLessonTitle(lesson, lang),
          getLearnLessonDescription(lesson, lang),
          ...getLearnLessonTopics(lesson, lang),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [activeFilter, lang, query]);

  function clearFilters() {
    setActiveFilter("all");
    setQuery("");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SpaceHeader variant="learnOnly" />

      <section className="relative overflow-hidden px-5 pb-[66px] pt-[92px] md:pb-[82px] md:pt-[126px]">
        <div
          aria-hidden="true"
          className="opten-figma-gradient"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[800px] text-center">
          <h1 className="font-['Unbounded',sans-serif] text-[36px] font-bold leading-[1.1] tracking-[-0.6px] text-white sm:text-[44px] md:text-[52px]">
            {pageCopy.title}
          </h1>
          <p className="learn-lessons-intro mx-auto mt-[20px] max-w-[720px] text-[17px] leading-[1.6] text-white/70 md:text-[18px]">
            {pageCopy.intro}
          </p>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-[1100px] px-[20px] pb-[88px] pt-[36px]">
        <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:hidden">
            <span className="sr-only">{pageCopy.filterLabel}</span>
            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value as CatalogFilter)}
              className="h-[40px] w-full appearance-none rounded-full border border-white/10 bg-white/5 px-[18px] pr-[40px] text-[14px] text-white transition focus:border-white/30 focus:bg-white/8 focus:outline-none"
            >
              {filters.map((filter) => (
                <option key={filter} value={filter} className="bg-[#0e2023] text-white">
                  {pageCopy.filterLabels[filter]}
                </option>
              ))}
            </select>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute right-[16px] top-1/2 size-[12px] -translate-y-1/2 text-white/55" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>

          <div className="hidden flex-wrap items-center gap-[8px] sm:flex" role="group" aria-label={pageCopy.filterLabel}>
            {filters.map((filter) => {
              const active = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={active}
                  className={`rounded-full border px-[14px] py-[7px] text-[13px] font-medium transition ${
                    active
                      ? "border-transparent bg-[#9cfb51] text-[#011417]"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {pageCopy.filterLabels[filter]}
                </button>
              );
            })}
          </div>

          <label className="relative block w-full sm:w-[300px] sm:shrink-0">
            <span className="sr-only">{pageCopy.searchLabel}</span>
            <Search aria-hidden="true" size={15} className="pointer-events-none absolute left-[16px] top-1/2 -translate-y-1/2 text-white/32" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={pageCopy.searchPlaceholder}
              className="h-[40px] w-full rounded-full border border-white/10 bg-white/5 py-0 pl-[42px] pr-[18px] text-[14px] text-white placeholder:text-white/35 transition focus:border-white/30 focus:bg-white/8 focus:outline-none"
            />
          </label>
        </div>

        {lessons.length === 0 ? (
          <div className="mt-[64px] flex flex-col items-center justify-center gap-[12px] rounded-[16px] border border-white/10 bg-white/5 px-[20px] py-[48px] text-center">
            <p className="text-[18px] font-medium text-white">{pageCopy.emptyTitle}</p>
            <p className="max-w-[420px] text-[14px] text-white/55">{pageCopy.emptyBody}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-[12px] rounded-full bg-white px-[20px] py-[10px] text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5"
            >
              {pageCopy.clear}
            </button>
          </div>
        ) : (
          <div className="mt-[40px] grid items-stretch gap-[24px] sm:grid-cols-2 lg:grid-cols-3" data-testid="learn-lessons-grid">
            {lessons.map((lesson) => (
              <LearnLessonCard key={lesson.slug} lesson={lesson} lang={lang} showDescription />
            ))}
          </div>
        )}
      </main>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[480px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)]">
        <div className="absolute left-1/2 bottom-[-520px] h-[982px] w-[1720px] -translate-x-[56%] bg-[url('/assets/landing-design/gradient-blob-shape.svg')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-[0.16] blur-[140px]" />
      </div>
      <SiteFooter variant="linksOnly" />
    </div>
  );
}
