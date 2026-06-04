import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock3, Lock, Play, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import LocalizedLink from "../../LocalizedLink";
import SpaceHeader from "../SpaceHeader";
import type { LearnCollection, LearnLesson, LearnOverviewSection } from "../../../../content/space/learn";
import {
  getLearnLessonVideoProvider,
  getLessonPosition,
} from "../../../../content/space/learn";

const accent = "#9cfb51";

type LearnSectionWrapperProps = {
  children: ReactNode;
};

export function LearnSectionWrapper({ children }: LearnSectionWrapperProps) {
  return (
    <div className="min-h-screen bg-[#011012] font-['PT_Root_UI',sans-serif] text-white">
      <SpaceHeader variant="learnOnly" />
      <main className="mx-auto max-w-[1200px] px-[32px] pb-[42px] pt-[24px] max-md:px-4">{children}</main>
    </div>
  );
}

type CourseSectionProps = {
  section: LearnOverviewSection;
};

export function CourseSection({ section }: CourseSectionProps) {
  return (
    <section>
      <div className="mb-[8px] flex flex-wrap items-end gap-x-[14px] gap-y-[3px]">
        <h2 className="flex items-center gap-[10px] text-[22px] font-bold leading-[1.2] text-white">
          <CourseSectionIcon iconPath={section.iconPath} />
          <span>{section.title}</span>
        </h2>
        {section.metadata && <span className="pb-[2px] text-[13px] leading-[1.4] text-white/58">{section.metadata}</span>}
      </div>
      <VideoGrid>
        {section.lessons.map((lesson) => (
          <VideoCard key={lesson.slug} lesson={lesson} />
        ))}
      </VideoGrid>
    </section>
  );
}

type CourseSectionIconProps = {
  iconPath: string;
};

function CourseSectionIcon({ iconPath }: CourseSectionIconProps) {
  return (
    <span
      aria-hidden="true"
      className="h-[20px] w-[20px] shrink-0 bg-[#9cfb51]"
      style={{
        WebkitMask: `url("${iconPath}") center / contain no-repeat`,
        mask: `url("${iconPath}") center / contain no-repeat`,
      }}
    />
  );
}

type VideoGridProps = {
  children: ReactNode;
};

export function VideoGrid({ children }: VideoGridProps) {
  return (
    <div className="learn-video-grid grid grid-cols-1 gap-[16px] md:grid-cols-2 xl:grid-cols-3" data-testid="learn-video-grid">
      {children}
    </div>
  );
}

type VideoCardProps = {
  lesson: LearnLesson;
};

export function VideoCard({ lesson }: VideoCardProps) {
  return (
    <LocalizedLink
      to={`/app/learn/${lesson.slug}`}
      data-testid={`learn-video-card-${lesson.slug}`}
      className="group flex min-h-0 flex-col overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.05] no-underline transition hover:border-[#9cfb51]/45 hover:bg-white/[0.065]"
    >
      <div className="relative aspect-video overflow-hidden bg-white/5">
        <img
          src={lesson.thumbnailPath}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.08),rgba(1,16,18,0.58))]" />
        <span className="absolute left-1/2 top-1/2 grid size-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/42 text-white backdrop-blur-sm transition group-hover:border-[#9cfb51]/70 group-hover:text-[#9cfb51]">
          <Play size={20} fill="currentColor" />
        </span>
      </div>
      <div className="flex min-h-[92px] flex-col p-[12px]">
        <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.25] text-white">{lesson.title}</h3>
        <p className="mt-[6px] line-clamp-1 text-[13px] leading-[1.35] text-white/62">{lesson.description}</p>
        <p className="mt-auto flex flex-wrap items-center gap-[7px] pt-[8px] text-[12px] leading-none text-white/58">
          <span>{lesson.duration}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-white/32" />
          <span className="text-[#9cfb51]">{lesson.status}</span>
        </p>
      </div>
    </LocalizedLink>
  );
}

type LessonDetailLayoutProps = {
  lesson: LearnLesson;
  collection: LearnCollection;
  previousLesson?: LearnLesson;
  nextLesson?: LearnLesson;
};

export function LessonDetailLayout({ lesson, collection, previousLesson, nextLesson }: LessonDetailLayoutProps) {
  return (
    <LearnSectionWrapper>
      <nav className="mb-[24px] flex flex-wrap items-center gap-[9px] text-[14px] text-white/68" aria-label="Breadcrumb">
        <LocalizedLink to="/app/learn" className="text-white/68 no-underline hover:text-white">
          Learn
        </LocalizedLink>
        <span>/</span>
        <span>{collection.title}</span>
        <span>/</span>
        <span>{lesson.title}</span>
      </nav>

      <section className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-[16px] max-lg:grid-cols-1">
        <div>
          <LessonPlayerMock lesson={lesson} />
          <DetailNavigation previousLesson={previousLesson} nextLesson={nextLesson} className="mt-[20px] hidden lg:flex" />
        </div>

        <aside className="flex min-w-0 flex-col gap-[16px]">
          <LessonInfoPanel lesson={lesson} collection={collection} />
          <CourseOutline collection={collection} currentSlug={lesson.slug} />
        </aside>
      </section>

      <DetailNavigation previousLesson={previousLesson} nextLesson={nextLesson} className="mt-[16px] lg:hidden" />
    </LearnSectionWrapper>
  );
}

type CourseOutlineProps = {
  collection: LearnCollection;
  currentSlug: string;
  className?: string;
};

export function CourseOutline({ collection, currentSlug, className = "" }: CourseOutlineProps) {
  return (
    <aside className={`rounded-[8px] border border-white/10 bg-white/[0.035] p-[16px] ${className}`}>
      <div className="border-b border-white/10 pb-[14px]">
        <h2 className="text-[20px] font-bold leading-tight text-white">{collection.title}</h2>
        <p className="mt-[6px] text-[14px] text-white/70">
          {collection.lessons.length} {collection.lessons.length === 1 ? "lesson" : "lessons"}
        </p>
      </div>

      <div className="mt-[12px] flex flex-col gap-[8px]">
        {collection.lessons.map((outlineLesson, index) => {
          const current = outlineLesson.slug === currentSlug;
          return (
            <LocalizedLink
              key={outlineLesson.slug}
              to={`/app/learn/${outlineLesson.slug}`}
              aria-current={current ? "page" : undefined}
              className={`group flex gap-[10px] rounded-[8px] border p-[11px] no-underline transition ${
                current
                  ? "border-[#9cfb51]/85 bg-[#9cfb51]/[0.07] text-white"
                  : "border-transparent bg-transparent text-white/78 hover:border-white/10 hover:bg-white/[0.035] hover:text-white"
              }`}
            >
              <span
                className={`mt-[1px] grid size-[24px] shrink-0 place-items-center rounded-full border text-[12px] ${
                  current ? "border-[#9cfb51] text-[#9cfb51]" : "border-white/32 text-white/78"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium leading-[1.4]">{outlineLesson.title}</span>
                <span className="mt-[4px] flex flex-wrap items-center gap-[8px] text-[12px] leading-[1.35] text-white/58">
                  <span>{outlineLesson.duration}</span>
                  <span className="flex items-center gap-[4px] text-[#9cfb51]">
                    {statusIcon(outlineLesson)}
                    {outlineLesson.status}
                  </span>
                </span>
              </span>
              {outlineLesson.access === "full-platform" && (
                <Lock size={16} className="mt-[3px] shrink-0 text-white/60" aria-label="Full platform access" />
              )}
            </LocalizedLink>
          );
        })}
      </div>

      <LocalizedLink
        to="/app/learn"
        className="mt-[14px] flex h-[44px] items-center justify-center gap-[10px] rounded-[8px] border border-white/12 bg-white/[0.025] text-[15px] font-medium text-white no-underline transition hover:border-white/25 hover:bg-white/[0.045]"
      >
        <ArrowLeft size={18} />
        Back to lessons
      </LocalizedLink>
    </aside>
  );
}

type LessonPlayerMockProps = {
  lesson: LearnLesson;
};

export function LessonPlayerMock({ lesson }: LessonPlayerMockProps) {
  const gated = lesson.access === "full-platform";
  const videoProvider = getLearnLessonVideoProvider(lesson);
  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.035] p-[16px]"
      data-video-provider={videoProvider.provider}
      data-provider-asset-id={videoProvider.providerAssetId}
      data-playback-policy={videoProvider.playbackPolicy}
    >
      <div className="relative aspect-video overflow-hidden rounded-[8px] border border-white/10 bg-[#06191c] max-sm:aspect-[4/3]">
        <img src={lesson.thumbnailPath} alt="" className="h-full w-full object-cover opacity-68" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(156,251,81,0.13),rgba(1,16,18,0.76)_54%,rgba(1,16,18,0.9))]" />
        <div className="absolute left-[16px] top-[16px] inline-flex items-center gap-[8px] rounded-full border border-white/14 bg-black/35 px-[12px] py-[8px] text-[14px] text-white backdrop-blur-sm max-sm:hidden">
          <Play size={16} className="text-[#9cfb51]" />
          Mock lesson player
        </div>
        {gated ? (
          <div className="absolute inset-0 grid place-items-center px-[22px] text-center">
            <div>
              <span className="mx-auto grid size-[72px] place-items-center rounded-full border border-[#9cfb51]/75 bg-[#011012]/68 text-white max-sm:size-[52px]">
                <Lock size={34} className="max-sm:size-[25px]" />
              </span>
              <h2 className="mt-[18px] text-[26px] font-bold leading-tight text-white max-sm:text-[21px]">
                Full access placeholder
              </h2>
              <p className="mt-[8px] text-[17px] leading-[1.45] text-white/72 max-sm:text-[13px]">
                Frontend mock for a future subscription-gated lesson.
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-[66px] place-items-center rounded-full border border-white/25 bg-black/42 text-white backdrop-blur-sm">
              <Play size={28} fill="currentColor" />
            </span>
          </div>
        )}
      </div>

      <div className="mt-[16px]">
        <div className="h-[5px] overflow-hidden rounded-full bg-white/25">
          <div className="h-full w-[22%] rounded-full bg-[#9cfb51]" />
        </div>
        <div className="mt-[13px] flex items-center gap-[16px] text-white">
          <Play size={21} fill="currentColor" />
          <Volume2 size={21} />
          <span className="text-[16px] text-[#9cfb51]">01:00</span>
          <span className="text-[16px] text-white/55">/ {lesson.duration.replace(" min", ":00")}</span>
          <span className="ml-auto rounded-[4px] border border-white/22 px-[5px] py-[2px] text-[12px] text-white/82">CC</span>
          <span className="text-[14px] text-white/82">1x</span>
        </div>
      </div>
    </section>
  );
}

type LessonInfoPanelProps = {
  lesson: LearnLesson;
  collection: LearnCollection;
  className?: string;
};

export function LessonInfoPanel({ lesson, collection, className = "" }: LessonInfoPanelProps) {
  const position = getLessonPosition(lesson.slug);
  const gated = lesson.access === "full-platform";
  return (
    <aside className={`rounded-[8px] border border-white/10 bg-white/[0.035] p-[20px] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-[10px]">
        <p className="text-[15px] font-bold leading-tight text-[#9cfb51]">{collection.title}</p>
        {position && <p className="text-[13px] leading-tight text-white/58">{position}</p>}
      </div>
      <h1 className="mt-[18px] text-[28px] font-bold leading-[1.12] text-white max-sm:text-[24px]">{lesson.title}</h1>
      <div className="mt-[12px] flex flex-wrap items-center gap-[10px] text-[13px] text-white/64">
        <span className="inline-flex items-center gap-[5px]">
          <Clock3 size={14} />
          {lesson.duration}
        </span>
        <span className="text-white/25">•</span>
        <span className="inline-flex items-center gap-[5px] text-[#9cfb51]">
          {statusIcon(lesson)}
          {lesson.status}
        </span>
      </div>
      <p className="mt-[20px] border-b border-white/10 pb-[20px] text-[14px] leading-[1.55] text-white/82">{lesson.description}</p>

      <section className="mt-[20px]">
        <h2 className="text-[18px] font-bold leading-tight text-white">What you'll learn</h2>
        <ul className="mt-[14px] space-y-[11px]">
          {lesson.whatYouWillLearn.map((item) => (
            <li key={item} className="flex gap-[9px] text-[14px] leading-[1.45] text-white/78">
              <CheckCircle2 size={18} className="mt-[1px] shrink-0 text-[#9cfb51]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {gated && (
        <section className="mt-[20px]">
          <button
            type="button"
            disabled
            aria-label="Full platform access is not available in this MVP"
            className="flex h-[48px] w-full cursor-default items-center justify-center gap-[10px] rounded-[8px] bg-[#9cfb51] px-[18px] text-[18px] font-bold text-[#011417] opacity-100"
          >
            <Lock size={19} />
            Full access placeholder
          </button>
          <p className="mt-[10px] text-center text-[13px] leading-[1.4] text-white/62">
            Frontend-only gated state. Access checks are not connected.
          </p>
        </section>
      )}
    </aside>
  );
}

type DetailNavigationProps = {
  previousLesson?: LearnLesson;
  nextLesson?: LearnLesson;
  className?: string;
};

function DetailNavigation({ previousLesson, nextLesson, className = "" }: DetailNavigationProps) {
  return (
    <nav
      className={`items-center justify-between gap-[12px] rounded-[8px] border border-white/10 bg-white/[0.025] p-[12px] ${className}`}
      aria-label="Lesson navigation"
    >
      {previousLesson ? (
        <LocalizedLink
          to={`/app/learn/${previousLesson.slug}`}
          className="inline-flex h-[42px] min-w-[160px] items-center gap-[10px] rounded-[8px] px-[12px] text-[15px] font-medium text-white no-underline transition hover:bg-white/[0.045]"
        >
          <ArrowLeft size={18} />
          Previous lesson
        </LocalizedLink>
      ) : (
        <span className="inline-flex h-[42px] min-w-[160px] items-center gap-[10px] rounded-[8px] px-[12px] text-[15px] text-white/32">
          <ArrowLeft size={18} />
          Previous lesson
        </span>
      )}
      {nextLesson ? (
        <LocalizedLink
          to={`/app/learn/${nextLesson.slug}`}
          className="ml-auto inline-flex h-[42px] min-w-[132px] items-center justify-end gap-[10px] rounded-[8px] px-[12px] text-[15px] font-medium text-white no-underline transition hover:bg-white/[0.045]"
        >
          Next lesson
          <ArrowRight size={18} />
        </LocalizedLink>
      ) : (
        <span className="ml-auto inline-flex h-[42px] min-w-[132px] items-center justify-end gap-[10px] rounded-[8px] px-[12px] text-[15px] text-white/32">
          Next lesson
          <ArrowRight size={18} />
        </span>
      )}
    </nav>
  );
}

function statusIcon(lesson: LearnLesson) {
  if (lesson.status === "Completed") return <CheckCircle2 size={14} />;
  if (lesson.status === "In progress") return <Circle size={14} />;
  return <Play size={14} color={accent} />;
}
