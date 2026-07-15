import {
  Check,
  Clock,
  Copy,
  CreditCard,
  Crown,
  FileText,
  Link as LinkIcon,
  Lock,
  LockOpen,
  Mail,
  Play,
  Tag,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { useLocation } from "react-router";
import { useLang } from "../../../../i18n/LangContext";
import type { AccountSummary } from "../../../../lib/optenAuth";
import {
  type CoursePaymentResponse,
  createCoursePayment,
  fetchCourseAccessSummary,
  formatCoursePrice,
  isValidCourseEmail,
  isValidCoursePromoCode,
  normalizeCourseEmail,
  normalizeCoursePromoCode,
  quoteCoursePayment,
  readCourseDiscountClaimTokenFromSearch,
} from "../../../../lib/courseAccess";
import { useCurrencyPreference } from "../../../../lib/currency";
import { ensurePaddle } from "../../../../lib/paddle";
import LocalizedLink from "../../LocalizedLink";
import ResponsiveImage from "../../ResponsiveImage";
import SiteFooter from "../../SiteFooter";
import SpaceHeader from "../SpaceHeader";
import { useSpaceAuth } from "../SpaceAuthProvider";
import type { PrivateCourseIntroContent } from "../../../../content/space/privateCourse";
import {
  HIDDEN_INTRO_ROUTE,
  HIDDEN_INTRO_SLUG,
  HIDDEN_INTRO_TELEGRAM_URL,
  HIDDEN_INTRO_UNLOCK_STORAGE_KEY,
  HIDDEN_INTRO_WEBSITE_SLOT_ENABLED,
  getHiddenIntroCopy,
} from "../../../../content/space/hiddenIntro";
import type { LearnCollection, LearnCoursePurchase, LearnLesson, LearnMaterial, LearnMissingItem, LearnOverviewSection, LearnPromptBlock, LearnTimestamp } from "../../../../content/space/learn";
import {
  getLearnCollectionCategoryLabel,
  getLearnCollectionTitle,
  getLearnLessonAuthor,
  getLearnLessonAuthorIntro,
  getLearnLessonAuthorRole,
  getLearnLessonCategoryLabel,
  getLearnLessonDescription,
  getLearnLessonMaterials,
  getLearnLessonMissingItems,
  getLearnLessonPrompts,
  getLearnLessonTimestamps,
  getLearnLessonTitle,
  getLearnLessonVideoProvider,
  getLessonPosition,
  getLearnAuthorName,
} from "../../../../content/space/learn";

const LEARN_PROGRESS_STORAGE_KEY = "opten_space_learn_progress_v1";
const AI_CONTENT_MARKETING_COURSE_SLUG = "ai-content-marketing-2026";
const COURSE_INTRO_SHOWCASE_HEADING_ID = "course-intro-showcase-title";

type StoredLearnProgress = {
  completed: string[];
  incomplete: string[];
};

type LearnSectionWrapperProps = {
  children: ReactNode;
};

export function LearnSectionWrapper({ children }: LearnSectionWrapperProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SpaceHeader variant="learnOnly" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-760px] top-[-620px] h-[982px] w-[1720px] bg-[url('/assets/landing-design/gradient-blob-shape.svg')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-[0.15] blur-[140px]"
      />
      <main className="relative z-10 mx-auto max-w-[1200px] px-[32px] pb-[76px] pt-[30px] max-md:px-[20px] max-md:pb-[54px] max-md:pt-[30px]">
        {children}
      </main>
      <SiteFooter variant="linksOnly" />
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
  const { lang } = useLang();

  return (
    <LocalizedLink
      to={`/learn/${lesson.slug}`}
      data-testid={`learn-video-card-${lesson.slug}`}
      className="group flex min-h-0 flex-col overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.05] no-underline transition hover:border-[#9cfb51]/45 hover:bg-white/[0.065]"
    >
      <div className="relative aspect-video overflow-hidden bg-white/5">
        <ResponsiveImage
          src={lesson.thumbnailPath}
          alt=""
          loading="lazy"
          width="1200"
          height="676"
          widths={[360, 480, 720, 960]}
          sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1279px) calc(50vw - 48px), 360px"
          className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.08),rgba(1,16,18,0.58))]" />
        <span className="absolute left-1/2 top-1/2 grid size-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#9cfb51] text-[#011417] shadow-[0_12px_34px_rgba(156,251,81,0.24)] transition group-hover:scale-[1.04] group-hover:bg-[#8ff144]">
          <Play size={20} fill="currentColor" />
        </span>
      </div>
      <div className="flex min-h-[92px] flex-col p-[12px]">
        <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.25] text-white">{getLearnLessonTitle(lesson, lang)}</h3>
        <p className="mt-[6px] line-clamp-1 text-[13px] leading-[1.35] text-white/62">{getLearnLessonDescription(lesson, lang)}</p>
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
  hiddenIntroRouteUnlocked?: boolean;
};

type SidebarTab = "lessons" | "timestamps";

export function LessonDetailLayout({ lesson, collection, hiddenIntroRouteUnlocked = false }: LessonDetailLayoutProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const { account, session, status: authStatus } = useSpaceAuth();
  const hasPro = hasProAccess(account);
  const purchase = collection.purchase;
  const courseAccess = useCourseAccess(purchase, session?.access_token ?? null);
  const hiddenIntroOpened = useHiddenIntroOpened();
  const hiddenIntroUnlocked = lesson.slug === HIDDEN_INTRO_SLUG && (hiddenIntroOpened || hiddenIntroRouteUnlocked);
  const courseHasAccess = purchase ? courseAccess.hasAccess : hasPro;
  const lessonAccessGranted = courseHasAccess || hiddenIntroUnlocked;
  const locked = isLessonLocked(lesson, lessonAccessGranted);
  const isCourse = collection.kind === "course";
  const [activeTab, setActiveTab] = useState<SidebarTab>(isCourse ? "lessons" : "timestamps");
  const [startSeconds, setStartSeconds] = useState(0);
  const [playRequestId, setPlayRequestId] = useState(0);
  const playerFrameRef = useRef<HTMLDivElement | null>(null);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);
  const [manualProgress, setManualProgress] = useState<StoredLearnProgress>(() => readStoredLearnProgress());

  useEffect(() => {
    setStartSeconds(0);
    setPlayRequestId(0);
  }, [lesson.slug]);

  useEffect(() => {
    const element = playerFrameRef.current;
    if (!element) return;

    const updatePlayerHeight = () => {
      setPlayerHeight(Math.round(element.getBoundingClientRect().height));
    };

    updatePlayerHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updatePlayerHeight);
      return () => window.removeEventListener("resize", updatePlayerHeight);
    }

    const observer = new ResizeObserver(updatePlayerHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [lesson.slug]);

  const completedSlugs = useMemo(() => getCompletedLessonSlugs(collection, manualProgress), [collection, manualProgress]);
  const displayedCollection = useMemo(
    () => applyLessonProgress(collection, completedSlugs, lesson.slug),
    [collection, completedSlugs, lesson.slug],
  );
  const displayedLesson = displayedCollection.lessons.find((item) => item.slug === lesson.slug) ?? lesson;
  const lessonCompleted = completedSlugs.has(lesson.slug);
  const courseMobileContentsClass = isCourse ? "max-lg:contents" : "";
  const courseMobileOrder = (order: 1 | 2 | 3 | 4 | 5) => {
    if (!isCourse) return "";
    if (order === 1) return "max-lg:order-1";
    if (order === 2) return "max-lg:order-2";
    if (order === 3) return "max-lg:order-3";
    if (order === 4) return "max-lg:order-4";
    return "max-lg:order-5";
  };
  const courseBreadcrumbTitle = isCourse ? getLearnCollectionTitle(collection, lang) : getLearnLessonTitle(lesson, lang);

  const handleTimestampSelect = (seconds: number) => {
    setStartSeconds(seconds);
    setPlayRequestId((current) => current + 1);
  };

  const handleLessonCompletionChange = (completed: boolean) => {
    setManualProgress((currentProgress) => {
      const nextProgress = updateStoredLessonProgress(currentProgress, lesson, completed);
      writeStoredLearnProgress(nextProgress);
      return nextProgress;
    });
  };

  return (
    <LearnSectionWrapper>
      <nav className="mb-[24px] flex min-w-0 flex-nowrap items-center gap-[9px] overflow-hidden whitespace-nowrap text-[14px] text-white/68 max-md:mb-[26px] max-md:gap-[5px] max-md:text-[12px]" aria-label={copy.breadcrumb}>
        <LocalizedLink to="/learn" className="shrink-0 text-white/68 no-underline hover:text-white">
          {copy.courses}
        </LocalizedLink>
        <span className="shrink-0 text-white/28">/</span>
        <span className="min-w-0 truncate font-medium text-white">{courseBreadcrumbTitle}</span>
      </nav>

      <section className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-[24px] max-lg:grid-cols-1 max-lg:gap-[18px]">
        <div className={`min-w-0 ${courseMobileContentsClass}`}>
          <div className={courseMobileOrder(1)}>
            <div ref={playerFrameRef}>
              <LessonPlayer
                key={displayedLesson.slug}
                lesson={displayedLesson}
                collectionId={collection.id}
                locked={locked}
                purchase={purchase}
                startSeconds={startSeconds}
                playRequestId={playRequestId}
                hiddenIntroUnlocked={hiddenIntroUnlocked}
              />
            </div>
            <LessonIntro
              lesson={displayedLesson}
              collection={displayedCollection}
              locked={locked}
              completed={lessonCompleted}
              onCompletionChange={handleLessonCompletionChange}
            />
          </div>
          <div className={courseMobileOrder(4)}>
            <LessonMaterials materials={getLearnLessonMaterials(displayedLesson, lang)} locked={locked} purchase={purchase} />
            <LessonPrompts
              prompts={getLearnLessonPrompts(displayedLesson, lang)}
              locked={locked}
              purchase={purchase}
              courseSlug={purchase?.courseSlug}
              lessonSlug={displayedLesson.slug}
              accessToken={session?.access_token ?? null}
            />
            <LessonMissingItems items={getLearnLessonMissingItems(displayedLesson, lang)} />
          </div>
          <div className={isCourse ? "max-lg:hidden" : undefined}>
            <RelatedLessons collection={displayedCollection} currentSlug={lesson.slug} hasAccess={courseHasAccess} purchase={purchase} />
          </div>
        </div>

        <aside className={`flex min-w-0 flex-col gap-[16px] lg:sticky lg:top-[88px] max-lg:gap-[18px] ${courseMobileContentsClass}`}>
          {purchase ? (
            courseAccess.hasAccess ? (
              <>
                <div className={`min-w-0 ${courseMobileOrder(2)}`}>
                  <CollectionSummaryCard lesson={displayedLesson} collection={displayedCollection} />
                </div>
                <div className={`min-w-0 ${courseMobileOrder(3)}`}>
                  <LessonSidebar
                    lesson={displayedLesson}
                    collection={displayedCollection}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onTimestampSelect={handleTimestampSelect}
                    hasAccess={courseHasAccess}
                    purchase={purchase}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={`min-w-0 ${courseMobileOrder(3)}`}>
                  <CoursePurchaseCard
                    collection={displayedCollection}
                    purchase={purchase}
                    hasAccess={courseAccess.hasAccess}
                    loadingAccess={courseAccess.loading || authStatus === "loading"}
                    initialEmail={session?.user.email ?? account?.email ?? ""}
                    playerHeight={playerHeight}
                  />
                </div>
                <div className={`min-w-0 ${courseMobileOrder(2)}`}>
                  <LessonSidebar
                    lesson={displayedLesson}
                    collection={displayedCollection}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onTimestampSelect={handleTimestampSelect}
                    hasAccess={courseHasAccess}
                    purchase={purchase}
                  />
                </div>
              </>
            )
          ) : (
            <>
              <CollectionSummaryCard lesson={displayedLesson} collection={displayedCollection} />
              <LessonSidebar
                lesson={displayedLesson}
                collection={displayedCollection}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onTimestampSelect={handleTimestampSelect}
                hasAccess={courseHasAccess}
                purchase={purchase}
              />
              <UnlockProCard hasPro={hasPro} />
            </>
          )}
        </aside>
      </section>
    </LearnSectionWrapper>
  );
}

type CourseIntroLayoutProps = {
  collection: LearnCollection;
  intro: PrivateCourseIntroContent;
};

export function CourseIntroLayout({ collection, intro }: CourseIntroLayoutProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const { account, session, status: authStatus } = useSpaceAuth();
  const hasPro = hasProAccess(account);
  const purchase = collection.purchase;
  const courseAccess = useCourseAccess(purchase, session?.access_token ?? null);
  const lessonAccessGranted = purchase ? courseAccess.hasAccess : hasPro;
  const [activeTab, setActiveTab] = useState<SidebarTab>("lessons");
  const playerFrameRef = useRef<HTMLDivElement | null>(null);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);
  const [manualProgress] = useState<StoredLearnProgress>(() => readStoredLearnProgress());

  useEffect(() => {
    const element = playerFrameRef.current;
    if (!element) return;

    const updatePlayerHeight = () => {
      setPlayerHeight(Math.round(element.getBoundingClientRect().height));
    };

    updatePlayerHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updatePlayerHeight);
      return () => window.removeEventListener("resize", updatePlayerHeight);
    }

    const observer = new ResizeObserver(updatePlayerHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [collection.id]);

  const completedSlugs = useMemo(() => getCompletedLessonSlugs(collection, manualProgress), [collection, manualProgress]);
  const displayedCollection = useMemo(() => applyLessonProgress(collection, completedSlugs, ""), [collection, completedSlugs]);
  const sidebarLesson = displayedCollection.lessons[0];
  const mobileTimestampsTabOverride =
    purchase?.courseSlug === AI_CONTENT_MARKETING_COURSE_SLUG
      ? {
          label: intro.showcase.eyebrow[lang].replace(/:$/, ""),
          targetId: COURSE_INTRO_SHOWCASE_HEADING_ID,
        }
      : undefined;
  const courseMobileContentsClass = "max-lg:contents";
  const courseMobileOrder = (order: 1 | 2 | 3 | 4 | 5) => {
    if (order === 1) return "max-lg:order-1";
    if (order === 2) return "max-lg:order-2";
    if (order === 3) return "max-lg:order-3";
    if (order === 4) return "max-lg:order-4";
    return "max-lg:order-5";
  };

  return (
    <LearnSectionWrapper>
      <nav className="mb-[24px] flex min-w-0 flex-nowrap items-center gap-[9px] overflow-hidden whitespace-nowrap text-[14px] text-white/68 max-md:mb-[26px] max-md:gap-[5px] max-md:text-[12px]" aria-label={copy.breadcrumb}>
        <LocalizedLink to="/learn" className="shrink-0 text-white/68 no-underline hover:text-white">
          {copy.courses}
        </LocalizedLink>
        <span className="shrink-0 text-white/28">/</span>
        <span className="min-w-0 truncate font-medium text-white">{getLearnCollectionTitle(collection, lang)}</span>
      </nav>

      <section className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-[24px] max-lg:grid-cols-1 max-lg:gap-[18px]">
        <div className={`min-w-0 ${courseMobileContentsClass}`}>
          <div className={courseMobileOrder(1)}>
            <div ref={playerFrameRef}>
              <CourseIntroVideoPlaceholder intro={intro} />
            </div>
            <CourseIntroHeader intro={intro} />
          </div>
          <div className={courseMobileOrder(4)}>
            <CourseIntroShowcase intro={intro} />
          </div>
        </div>

        {sidebarLesson && (
          <aside className={`flex min-w-0 flex-col gap-[16px] lg:sticky lg:top-[88px] max-lg:gap-[18px] ${courseMobileContentsClass}`}>
            {purchase ? (
              courseAccess.hasAccess ? (
                <>
                  <div className={`min-w-0 ${courseMobileOrder(2)}`}>
                    <CollectionSummaryCard lesson={sidebarLesson} collection={displayedCollection} />
                  </div>
                  <div className={`min-w-0 ${courseMobileOrder(3)}`}>
                    <LessonSidebar
                      lesson={sidebarLesson}
                      collection={displayedCollection}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      onTimestampSelect={() => undefined}
                      hasAccess={lessonAccessGranted}
                      purchase={purchase}
                      currentSlug=""
                      mobileTimestampsTabOverride={mobileTimestampsTabOverride}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={`min-w-0 ${courseMobileOrder(3)}`}>
                    <CoursePurchaseCard
                      collection={displayedCollection}
                      purchase={purchase}
                      hasAccess={courseAccess.hasAccess}
                      loadingAccess={courseAccess.loading || authStatus === "loading"}
                      initialEmail={session?.user.email ?? account?.email ?? ""}
                      playerHeight={playerHeight}
                    />
                  </div>
                  <div className={`min-w-0 ${courseMobileOrder(2)}`}>
                    <LessonSidebar
                      lesson={sidebarLesson}
                      collection={displayedCollection}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      onTimestampSelect={() => undefined}
                      hasAccess={lessonAccessGranted}
                      purchase={purchase}
                      currentSlug=""
                      mobileTimestampsTabOverride={mobileTimestampsTabOverride}
                    />
                  </div>
                </>
              )
            ) : (
              <>
                <CollectionSummaryCard lesson={sidebarLesson} collection={displayedCollection} />
                <LessonSidebar
                  lesson={sidebarLesson}
                  collection={displayedCollection}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onTimestampSelect={() => undefined}
                  hasAccess={lessonAccessGranted}
                  purchase={purchase}
                  currentSlug=""
                  mobileTimestampsTabOverride={mobileTimestampsTabOverride}
                />
                <UnlockProCard hasPro={hasPro} />
              </>
            )}
          </aside>
        )}
      </section>
    </LearnSectionWrapper>
  );
}

type HiddenIntroPlaceholderLayoutProps = {
  collection: LearnCollection;
};

export function HiddenIntroPlaceholderLayout({ collection }: HiddenIntroPlaceholderLayoutProps) {
  const { lang } = useLang();
  const courseHref = collection.routeBasePath?.[lang] ?? "/learn";

  useEffect(() => {
    try {
      window.localStorage.setItem(HIDDEN_INTRO_UNLOCK_STORAGE_KEY, "1");
    } catch {
      // Local storage is only a soft menu-state hint; the placeholder still renders.
    }
  }, []);

  return (
    <LearnSectionWrapper>
      <nav className="mb-[24px] flex min-w-0 flex-nowrap items-center gap-[9px] overflow-hidden whitespace-nowrap text-[14px] text-white/68 max-md:mb-[26px] max-md:gap-[5px] max-md:text-[12px]" aria-label="Breadcrumb">
        <LocalizedLink to="/learn" className="shrink-0 text-white/68 no-underline hover:text-white">
          {lang === "en" ? "Courses" : "Курсы"}
        </LocalizedLink>
        <span className="shrink-0 text-white/28">/</span>
        <LocalizedLink to={courseHref} className="min-w-0 truncate text-white/68 no-underline hover:text-white">
          {getLearnCollectionTitle(collection, lang)}
        </LocalizedLink>
        <span className="shrink-0 text-white/28">/</span>
        <span className="min-w-0 truncate font-medium text-white">{getHiddenIntroCopy("title", lang)}</span>
      </nav>

      <section className="grid min-h-[520px] place-items-center rounded-[8px] border border-white/10 bg-[#06191c] px-[28px] py-[56px] text-center shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div className="max-w-[620px]">
          <span className="mx-auto grid size-[54px] place-items-center rounded-full bg-[#9cfb51]/12 text-[#9cfb51]">
            <LockOpen size={24} strokeWidth={2.25} />
          </span>
          <h1 className="mt-[22px] text-[34px] font-bold leading-[1.12] tracking-normal text-white max-md:text-[28px]">
            {getHiddenIntroCopy("title", lang)}
          </h1>
          <p className="mx-auto mt-[14px] max-w-[520px] text-[16px] leading-[1.55] text-white/62 max-md:text-[15px]">
            {getHiddenIntroCopy("placeholderText", lang)}
          </p>
          <LocalizedLink
            to={courseHref}
            className="mx-auto mt-[26px] inline-flex h-[46px] items-center justify-center rounded-[8px] bg-[#9cfb51] px-[18px] text-[14px] font-bold text-[#062013] no-underline transition hover:bg-[#8ee943]"
          >
            {getHiddenIntroCopy("backToCourse", lang)}
          </LocalizedLink>
        </div>
      </section>
    </LearnSectionWrapper>
  );
}

function CourseIntroVideoPlaceholder({ intro }: { intro: PrivateCourseIntroContent }) {
  const { lang } = useLang();
  const publicIntroVideo = intro.publicIntroVideo;

  return (
    <section
      className="group relative aspect-video overflow-hidden rounded-[8px] border border-white/10 bg-[#03191c] shadow-[0_24px_80px_rgba(0,0,0,0.22)] max-md:rounded-[8px]"
      aria-label={intro.videoAriaLabel[lang]}
    >
      {publicIntroVideo ? (
        // Public intro renders the Kinescope player immediately, so the first visible play click starts playback.
        <iframe
          src={publicIntroVideo.embedUrl}
          title={intro.videoAriaLabel[lang]}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="eager"
        />
      ) : (
        <>
          <ResponsiveImage
            src={intro.posterPath}
            alt=""
            width="1200"
            height="676"
            loading="eager"
            widths={[480, 800, 1200]}
            sizes="(max-width: 1023px) calc(100vw - 32px), 816px"
            className="absolute inset-0 h-full w-full object-cover opacity-78"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.44),rgba(1,16,18,0.22)_48%,rgba(1,16,18,0.56))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(156,251,81,0.1),transparent_30%)]" />
          <button
            type="button"
            className="absolute left-1/2 top-1/2 grid size-[82px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-0 bg-[#9cfb51] text-[#011417] shadow-[0_18px_58px_rgba(156,251,81,0.28)] transition duration-200 group-hover:scale-[1.03] group-hover:bg-[#8ff144] max-md:size-[92px]"
            aria-label={intro.videoAriaLabel[lang]}
          >
            <Play size={32} fill="currentColor" className="translate-x-[2px] max-md:size-[38px]" />
          </button>
        </>
      )}
    </section>
  );
}

function CourseIntroHeader({ intro }: { intro: PrivateCourseIntroContent }) {
  const { lang } = useLang();
  const description = intro.description[lang];

  return (
    <section className="mt-[32px] max-w-[820px] max-md:mt-[28px]">
      <h1 className="text-[32px] font-bold leading-[1.12] tracking-[-0.01em] text-white max-md:text-[30px]">{intro.title[lang]}</h1>
      <p className="mt-[18px] max-w-[760px] whitespace-normal text-[16px] leading-[1.55] text-white/64 md:line-clamp-2 md:whitespace-pre-line max-md:mt-[18px] max-md:text-[18px] max-md:leading-[1.5]">
        {description}
      </p>
    </section>
  );
}

function CourseIntroShowcase({ intro }: { intro: PrivateCourseIntroContent }) {
  const { lang } = useLang();

  return (
    <section className="mt-[28px] max-w-[820px] max-md:mt-[28px]" aria-labelledby={COURSE_INTRO_SHOWCASE_HEADING_ID}>
      <div className="border-t border-white/10 pt-[25px]">
        <h2 id={COURSE_INTRO_SHOWCASE_HEADING_ID} className="scroll-mt-[88px] text-[24px] font-bold leading-[1.2] text-white max-md:text-[25px]">
          {intro.showcase.eyebrow[lang]}
        </h2>
        <div className="mt-[25px] grid h-[548px] grid-cols-2 grid-rows-2 gap-[25px] max-md:h-auto max-md:grid-cols-1 max-md:grid-rows-none">
          <CourseIntroMediaCard
            className="row-span-2 max-md:row-span-1 max-md:h-[540px]"
            videoSrc="/assets/space/courses/ai-content-marketing-2026/intro/course-intro-video-1.mp4"
            label={lang === "ru" ? "Создавать и редактировать видео" : "Create and edit video"}
          />
          <CourseIntroMediaCard
            className="max-md:aspect-[1.15/1]"
            videoSrc="/assets/space/courses/ai-content-marketing-2026/intro/course-intro-video-2.mp4"
            label={lang === "ru" ? "Генерировать фото и логотипы" : "Generate photos and logos"}
          />
          <CourseIntroMediaCard
            className="max-md:aspect-[1.15/1]"
            imageSrc="/assets/space/courses/ai-content-marketing-2026/intro/course-intro-photo-4.png"
            imageAlt=""
            label={lang === "ru" ? "Вайб-кодить сайты" : "Vibe-code websites"}
          />
        </div>
      </div>
    </section>
  );
}

type CourseIntroMediaCardProps = {
  className?: string;
  imageAlt?: string;
  imageSrc?: string;
  label: string;
  videoSrc?: string;
};

function CourseIntroMediaCard({ className = "", imageAlt = "", imageSrc, label, videoSrc }: CourseIntroMediaCardProps) {
  return (
    <article className={`relative overflow-hidden rounded-[8px] bg-[#0e2023] shadow-[0_18px_54px_rgba(0,0,0,0.24)] ${className}`}>
      {videoSrc ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={label}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img src={imageSrc} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
      )}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,rgba(1,20,23,0)_0%,rgba(1,20,23,0.68)_54%,rgba(1,20,23,0.92)_100%)]" />
      <h3 className="absolute bottom-[25px] left-[25px] right-[25px] text-[20px] font-bold leading-[1.12] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.42)] max-md:text-[20px]">
        {label}
      </h3>
    </article>
  );
}

type LessonPlayerProps = {
  lesson: LearnLesson;
  collectionId: string;
  locked: boolean;
  purchase?: LearnCoursePurchase;
  startSeconds: number;
  playRequestId: number;
  hiddenIntroUnlocked?: boolean;
};

type KinescopeTokenResponse = {
  embedUrl?: string;
  error?: string;
};

type KinescopeIframePlayer = {
  Events: {
    Loaded: string;
  };
  once(type: string, listener: (event: { target: KinescopeIframePlayer }) => void): KinescopeIframePlayer;
  seekTo(time: number): Promise<void>;
  play(): Promise<void>;
  destroy(options?: { keepElement?: boolean }): Promise<void>;
};

type KinescopeIframePlayerFactory = {
  create(
    elementId: string,
    options: {
      url: string;
      size?: { width?: number | string; height?: number | string };
      behavior?: {
        autoPlay?: boolean | "viewable";
        playsInline?: boolean;
        preload?: boolean | "none" | "metadata" | "auto";
        localStorage?: boolean;
      };
      ui?: { language?: "ru" | "en" };
      keepElement?: boolean;
    },
  ): Promise<KinescopeIframePlayer>;
};

declare global {
  interface Window {
    Kinescope?: {
      IframePlayer?: KinescopeIframePlayerFactory;
    };
    onKinescopeIframeAPIReady?: (playerFactory: KinescopeIframePlayerFactory) => void;
    __optenKinescopeIframeApiPromise?: Promise<KinescopeIframePlayerFactory>;
  }
}

const KINESCOPE_IFRAME_API_SRC = "https://player.kinescope.io/latest/iframe.player.js";

function loadKinescopeIframeApi(): Promise<KinescopeIframePlayerFactory> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("kinescope_browser_required"));
  }

  const loadedFactory = window.Kinescope?.IframePlayer;
  if (loadedFactory) return Promise.resolve(loadedFactory);
  if (window.__optenKinescopeIframeApiPromise) return window.__optenKinescopeIframeApiPromise;

  window.__optenKinescopeIframeApiPromise = new Promise<KinescopeIframePlayerFactory>((resolve, reject) => {
    let settled = false;
    let timeoutId: number | undefined;
    const previousReady = window.onKinescopeIframeAPIReady;

    const restoreCallback = () => {
      window.onKinescopeIframeAPIReady = previousReady;
    };

    const resolveFactory = (playerFactory: KinescopeIframePlayerFactory) => {
      if (settled) return;
      settled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      restoreCallback();
      try {
        previousReady?.(playerFactory);
      } catch {
        // Keep our course player independent from another optional page-level callback.
      }
      resolve(playerFactory);
    };

    const rejectFactory = (error: Error) => {
      if (settled) return;
      settled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      restoreCallback();
      delete window.__optenKinescopeIframeApiPromise;
      reject(error);
    };

    window.onKinescopeIframeAPIReady = resolveFactory;
    timeoutId = window.setTimeout(() => rejectFactory(new Error("kinescope_player_timeout")), 12000);

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${KINESCOPE_IFRAME_API_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("error", () => rejectFactory(new Error("kinescope_player_load_failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = KINESCOPE_IFRAME_API_SRC;
    script.async = true;
    script.addEventListener("error", () => rejectFactory(new Error("kinescope_player_load_failed")), { once: true });
    document.head.appendChild(script);
  });

  return window.__optenKinescopeIframeApiPromise;
}

function buildKinescopePlayerApiUrl(embedUrl: string) {
  try {
    const embed = new URL(embedUrl);
    const pathParts = embed.pathname.split("/").filter(Boolean);
    const videoId = pathParts[0] === "embed" ? pathParts[1] : pathParts[0];
    if (!videoId) return embedUrl;

    const playerUrl = new URL(`https://kinescope.io/${videoId}`);
    embed.searchParams.forEach((value, key) => playerUrl.searchParams.set(key, value));
    return playerUrl.toString();
  } catch {
    return embedUrl;
  }
}

function kinescopeElementId(lessonSlug: string) {
  return `kinescope-player-${lessonSlug.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function destroyKinescopePlayer(player: KinescopeIframePlayer) {
  void player.destroy({ keepElement: true }).catch(() => undefined);
}

function LessonPlayer({ lesson, collectionId, locked, purchase, startSeconds, playRequestId, hiddenIntroUnlocked = false }: LessonPlayerProps) {
  const { pathname } = useLocation();
  const { lang } = useLang();
  const [currency] = useCurrencyPreference();
  const { session } = useSpaceAuth();
  const copy = detailCopy[lang];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const kinescopePlayerRef = useRef<KinescopeIframePlayer | null>(null);
  const pendingKinescopeSeekRef = useRef({ seconds: 0, requestId: 0 });
  const provider = getLearnLessonVideoProvider(lesson);
  const [activated, setActivated] = useState(false);
  const [kinescopeEmbedUrl, setKinescopeEmbedUrl] = useState<string | null>(null);
  const [kinescopeLoading, setKinescopeLoading] = useState(false);
  const [kinescopeError, setKinescopeError] = useState<string | null>(null);
  const [kinescopeApiFallback, setKinescopeApiFallback] = useState(false);
  const localizedVideo = lesson.localizedVideo?.[lang];
  const youtubeId = localizedVideo?.youtubeId ?? lesson.youtubeId;
  const captionLanguage = localizedVideo?.captionLanguage ?? lang;
  const embedUrl = youtubeId ? getYoutubeEmbedUrl(youtubeId, lang, captionLanguage, startSeconds, activated) : "";
  const isLocalVideo = provider.provider === "local" && Boolean(lesson.localVideo);
  const isKinescopeVideo = provider.provider === "kinescope";
  const kinescopePlayerElementId = useMemo(() => kinescopeElementId(lesson.slug), [lesson.slug]);
  const purchasePrice = purchase
    ? formatCoursePrice(currency === "USD" ? purchase.priceUsd : purchase.priceRub, currency)
    : "";

  useEffect(() => {
    setActivated(false);
    setKinescopeEmbedUrl(null);
    setKinescopeError(null);
    setKinescopeLoading(false);
    setKinescopeApiFallback(false);
    kinescopePlayerRef.current = null;
    pendingKinescopeSeekRef.current = { seconds: 0, requestId: 0 };
  }, [lesson.slug]);

  useEffect(() => {
    if (playRequestId > 0) setActivated(true);
  }, [playRequestId]);

  useEffect(() => {
    if (!isLocalVideo || !activated || !videoRef.current || playRequestId <= 0) return;
    videoRef.current.currentTime = startSeconds;
    void videoRef.current.play().catch(() => undefined);
  }, [activated, isLocalVideo, playRequestId, startSeconds]);

  useEffect(() => {
    if (!isKinescopeVideo || !activated || playRequestId <= 0) return;

    pendingKinescopeSeekRef.current = { seconds: startSeconds, requestId: playRequestId };
    const player = kinescopePlayerRef.current;
    if (!player) return;

    void player
      .seekTo(Math.max(0, Math.floor(startSeconds)))
      .then(() => player.play())
      .catch(() => undefined);
  }, [activated, isKinescopeVideo, playRequestId, startSeconds]);

  useEffect(() => {
    if (!isKinescopeVideo || !activated || locked || kinescopeEmbedUrl) return;

    const accessToken = session?.access_token;
    const canUseHiddenIntroUnlock = lesson.slug === HIDDEN_INTRO_SLUG && hiddenIntroUnlocked;
    if (!accessToken && !canUseHiddenIntroUnlock) {
      setKinescopeError("missing_session");
      return;
    }

    let cancelled = false;
    setKinescopeLoading(true);
    setKinescopeError(null);

    fetch("/api/kinescope-course-token", {
      method: "POST",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseSlug: collectionId,
        lessonSlug: lesson.slug,
        hiddenIntroUnlocked: canUseHiddenIntroUnlock,
      }),
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => ({}))) as KinescopeTokenResponse;
        if (!response.ok || !body.embedUrl) throw new Error(body.error || "kinescope_token_failed");
        if (!cancelled) setKinescopeEmbedUrl(body.embedUrl);
      })
      .catch((error) => {
        if (!cancelled) setKinescopeError(error instanceof Error ? error.message : "kinescope_token_failed");
      })
      .finally(() => {
        if (!cancelled) setKinescopeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activated, collectionId, hiddenIntroUnlocked, isKinescopeVideo, kinescopeEmbedUrl, lesson.slug, locked, session?.access_token]);

  useEffect(() => {
    if (!isKinescopeVideo || !activated || !kinescopeEmbedUrl || kinescopeApiFallback) return;

    let cancelled = false;
    let playerForCleanup: KinescopeIframePlayer | null = null;
    setKinescopeError(null);

    loadKinescopeIframeApi()
      .then((playerFactory) =>
        playerFactory.create(kinescopePlayerElementId, {
          url: buildKinescopePlayerApiUrl(kinescopeEmbedUrl),
          size: { width: "100%", height: "100%" },
          keepElement: true,
          behavior: {
            autoPlay: true,
            playsInline: true,
            preload: "auto",
            localStorage: false,
          },
          ui: { language: lang === "ru" ? "ru" : "en" },
        }),
      )
      .then((player) => {
        if (cancelled) {
          destroyKinescopePlayer(player);
          return;
        }

        playerForCleanup = player;
        kinescopePlayerRef.current = player;
        player.once(player.Events.Loaded, () => {
          const seconds = Math.max(0, Math.floor(pendingKinescopeSeekRef.current.seconds));
          const seek = seconds > 0 ? player.seekTo(seconds) : Promise.resolve();
          void seek.then(() => player.play()).catch(() => undefined);
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setKinescopeError(error instanceof Error ? error.message : "kinescope_player_failed");
        setKinescopeApiFallback(true);
      });

    return () => {
      cancelled = true;
      const player = playerForCleanup ?? kinescopePlayerRef.current;
      if (kinescopePlayerRef.current === player) kinescopePlayerRef.current = null;
      if (player) destroyKinescopePlayer(player);
    };
  }, [activated, isKinescopeVideo, kinescopeApiFallback, kinescopeEmbedUrl, kinescopePlayerElementId, lang]);

  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/12 bg-[#0e2023] shadow-[0_18px_56px_rgba(0,0,0,0.24)]"
      data-video-provider={provider.provider}
      data-provider-asset-id={provider.providerAssetId}
      data-playback-policy={provider.playbackPolicy}
    >
      <div className="relative aspect-video overflow-hidden bg-[#06191c]">
        {locked && purchase ? (
          <>
            <ResponsiveImage
              src={provider.posterPath}
              alt=""
              width="1200"
              height="676"
              loading="eager"
              widths={[480, 800, 1200]}
              sizes="(max-width: 1023px) calc(100vw - 32px), 816px"
              className="h-full w-full object-cover opacity-62"
            />
            <div className="absolute inset-0 bg-[#011417]/58" />
            <div className="absolute inset-0 grid place-items-center px-[18px]">
              <span className="hidden size-[104px] place-items-center rounded-full bg-white/10 text-white/72 md:grid">
                <Lock size={42} />
              </span>
              <a
                href="#course-purchase"
                className="flex h-[52px] max-w-full items-center justify-center gap-[8px] rounded-[8px] bg-[#9cfb51] px-[22px] text-center text-[15px] font-bold leading-none text-[#062013] no-underline shadow-[0_18px_50px_rgba(156,251,81,0.22)] transition hover:bg-[#8ee943] md:hidden"
              >
                <CreditCard size={17} strokeWidth={2.2} />
                <span>{copy.buyCourseShort(purchasePrice)}</span>
              </a>
            </div>
          </>
        ) : locked || !activated ? (
          <>
            <ResponsiveImage
              src={provider.posterPath}
              alt=""
              width="1200"
              height="676"
              loading="eager"
              widths={[480, 800, 1200]}
              sizes="(max-width: 1023px) calc(100vw - 32px), 816px"
              className={`h-full w-full object-cover ${locked ? "opacity-62" : "opacity-90"}`}
            />
            <div className={`absolute inset-0 ${locked ? "bg-[#011417]/70 backdrop-blur-[2px]" : "bg-[linear-gradient(180deg,rgba(1,20,23,0.06),rgba(1,20,23,0.46))]"}`} />
            {locked ? (
              <div className="absolute inset-0 grid place-items-center px-[20px] text-center">
                <div className="w-full max-w-[360px] rounded-[14px] border border-white/18 bg-[#102126]/92 px-[24px] py-[24px] shadow-[0_22px_70px_rgba(0,0,0,0.44)] backdrop-blur-md max-sm:px-[18px] max-sm:py-[18px]">
                  <span className="mx-auto grid size-[48px] place-items-center rounded-full border border-[#9cfb51]/45 bg-[#9cfb51]/10 text-[#9cfb51]">
                    <Lock size={22} />
                  </span>
                  <h2 className="mt-[16px] text-[18px] font-bold leading-tight text-white">{copy.lockedLesson}</h2>
                  <p className="mt-[8px] text-[13px] leading-[1.45] text-white/68">
                    {purchase ? copy.courseLockedDescription : copy.lockedDescription}
                  </p>
                  <div className="mt-[18px] flex gap-[8px] max-sm:flex-col">
                    {purchase ? (
                      <a
                        href="#course-purchase"
                        className="flex h-[42px] flex-1 items-center justify-center rounded-[8px] bg-[#9cfb51] px-[14px] text-[14px] font-bold text-[#062013] no-underline transition hover:bg-[#8ee943]"
                      >
                        {copy.buyCourseShort(purchasePrice)}
                      </a>
                    ) : (
                      <LocalizedLink
                        to="/pay"
                        className="flex h-[42px] flex-1 items-center justify-center rounded-[8px] bg-[#9cfb51] px-[14px] text-[14px] font-bold text-[#062013] no-underline transition hover:bg-[#8ee943]"
                      >
                        {copy.openPro}
                      </LocalizedLink>
                    )}
                    <LocalizedLink
                      to={`/login?next=${encodeURIComponent(pathname)}`}
                      className="flex h-[42px] flex-1 items-center justify-center rounded-[8px] border border-[#9cfb51]/65 px-[14px] text-[14px] font-bold text-[#9cfb51] no-underline transition hover:bg-[#9cfb51]/10"
                    >
                      {purchase ? copy.signInPurchased : copy.signIn}
                    </LocalizedLink>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActivated(true)}
                className="absolute inset-0 grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9cfb51]/80"
                aria-label={copy.playLesson}
              >
                <span className="grid size-[76px] place-items-center rounded-full bg-[#9cfb51] text-[#011417] shadow-[0_16px_48px_rgba(156,251,81,0.26)] transition duration-200 hover:scale-[1.04] hover:bg-[#8ff144]">
                  <Play size={30} fill="currentColor" strokeWidth={2.4} className="ml-[3px]" />
                </span>
              </button>
            )}
          </>
        ) : isKinescopeVideo ? (
          kinescopeEmbedUrl ? (
            kinescopeApiFallback ? (
              <iframe
                key={`${provider.providerAssetId}-${kinescopeEmbedUrl}`}
                src={kinescopeEmbedUrl}
                title={getLearnLessonTitle(lesson, lang)}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            ) : (
              <iframe
                key={kinescopePlayerElementId}
                id={kinescopePlayerElementId}
                className="absolute inset-0 h-full w-full"
                title={getLearnLessonTitle(lesson, lang)}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            )
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[#06191c] px-[20px] text-center">
              <div className="max-w-[360px]">
                <p className="text-[15px] font-bold text-white">{kinescopeLoading ? copy.loadingVideo : copy.videoTokenError}</p>
                {kinescopeError && <p className="mt-[8px] text-[12px] leading-[1.45] text-white/45">{kinescopeError}</p>}
              </div>
            </div>
          )
        ) : isLocalVideo && lesson.localVideo ? (
          <video
            ref={videoRef}
            key={lesson.slug}
            src={lesson.localVideo.src}
            poster={lesson.localVideo.posterPath}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full bg-black object-cover"
          />
        ) : embedUrl ? (
          <iframe
            key={`${youtubeId}-${startSeconds}-${playRequestId}`}
            src={embedUrl}
            title={getLearnLessonTitle(lesson, lang)}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <ResponsiveImage
            src={provider.posterPath}
            alt=""
            width="1200"
            height="676"
            loading="lazy"
            widths={[480, 800, 1200]}
            sizes="(max-width: 1023px) calc(100vw - 32px), 816px"
            className="h-full w-full object-cover opacity-90"
          />
        )}
      </div>
    </section>
  );
}

function getYoutubeEmbedUrl(
  youtubeId: string,
  uiLanguage: "ru" | "en",
  captionLanguage: "ru" | "en",
  startSeconds: number,
  autoplay: boolean,
) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    iv_load_policy: "3",
    hl: uiLanguage,
    cc_lang_pref: captionLanguage,
  });

  if (autoplay) params.set("autoplay", "1");
  if (startSeconds > 0) params.set("start", String(startSeconds));
  if (captionLanguage === "en") params.set("cc_load_policy", "1");
  if (typeof window !== "undefined") params.set("origin", window.location.origin);

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

type LessonIntroProps = {
  lesson: LearnLesson;
  collection: LearnCollection;
  locked: boolean;
  completed: boolean;
  onCompletionChange: (completed: boolean) => void;
};

function LessonIntro({ lesson, collection, locked, completed, onCompletionChange }: LessonIntroProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const position = getLessonPosition(lesson.slug, lang);
  const description = getLearnLessonDescription(lesson, lang);
  const title = getNumberedCourseLessonTitle(collection, lesson, lang);

  return (
    <section className="mt-[26px] max-md:mt-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px] max-md:flex-col max-md:items-start max-md:gap-[10px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          {position && (
            <span className="rounded-[6px] bg-[#9cfb51]/10 px-[9px] py-[5px] text-[12px] font-bold leading-none text-[#9cfb51]">
              {position}
            </span>
          )}
          {!collection.purchase && (
            <span className="rounded-[6px] bg-white/[0.05] px-[9px] py-[5px] text-[12px] font-medium leading-none text-white/56">
              {getLearnCollectionCategoryLabel(collection, lang)}
            </span>
          )}
          {collection.purchase ? (
            <span className={`inline-flex items-center gap-[5px] rounded-[6px] border border-[#9cfb51]/35 bg-[#9cfb51]/10 px-[9px] py-[5px] text-[12px] font-bold leading-none text-[#9cfb51] ${locked ? "" : "max-md:hidden"}`}>
              {locked ? <Lock size={13} /> : <LockOpen size={13} />}
              {locked ? copy.unlocksAfterPurchase : copy.courseOpenBadge}
            </span>
          ) : locked ? (
            <span className="inline-flex items-center gap-[5px] rounded-[6px] border border-[#9cfb51]/35 bg-[#9cfb51]/10 px-[9px] py-[5px] text-[12px] font-bold leading-none text-[#9cfb51]">
              <Lock size={13} />
              Pro
            </span>
          ) : null}
        </div>
        {!locked && (
          <LessonCompletionAction
            completed={completed}
            copy={copy}
            onToggle={() => onCompletionChange(!completed)}
          />
        )}
      </div>
      <h1 className="mt-[18px] max-w-[820px] text-[30px] font-bold leading-[1.14] text-white max-md:mt-[20px] max-md:text-[25px]">
        {title}
      </h1>
      <LessonDescription description={description} copy={copy} />
    </section>
  );
}

const MOBILE_DESCRIPTION_PREVIEW_LENGTH = 102;

function LessonDescription({ description, copy }: { description: string; copy: (typeof detailCopy)["ru"] }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [description]);

  const canCollapse = description.length > MOBILE_DESCRIPTION_PREVIEW_LENGTH;
  const preview = canCollapse ? description.slice(0, MOBILE_DESCRIPTION_PREVIEW_LENGTH).trimEnd() : description;

  return (
    <div className="mt-[18px] max-w-[820px] pb-[20px] text-[14px] leading-[1.55] text-white/70 max-md:mt-[20px] max-md:pb-[14px] max-md:text-[16px]">
      <p className="max-md:hidden">{description}</p>
      <p className="hidden max-md:block">
        {expanded || !canCollapse ? description : `${preview}...`}
        {canCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="ml-[2px] inline cursor-pointer border-0 bg-transparent p-0 align-baseline text-[16px] font-bold leading-[inherit] text-white"
          >
            {expanded ? copy.showLessDescription : copy.showMoreDescription}
          </button>
        )}
      </p>
    </div>
  );
}

type LessonCompletionActionProps = {
  completed: boolean;
  copy: (typeof detailCopy)["ru"];
  onToggle: () => void;
};

function LessonCompletionAction({ completed, copy, onToggle }: LessonCompletionActionProps) {
  return (
    <button
      type="button"
      aria-pressed={completed}
      onClick={onToggle}
      className={`inline-flex h-[34px] cursor-pointer items-center gap-[7px] rounded-[8px] border px-[12px] text-[13px] font-bold leading-none outline-none transition focus-visible:ring-2 focus-visible:ring-[#9cfb51]/65 max-sm:h-[38px] max-sm:px-[14px] max-sm:text-[13px] ${
        completed
          ? "border-[#9cfb51]/35 bg-[#9cfb51]/12 text-[#9cfb51] hover:bg-[#9cfb51]/16"
          : "border-white/10 bg-white/[0.035] text-white/64 hover:border-[#9cfb51]/35 hover:text-[#9cfb51]"
      }`}
    >
      <span className={`grid size-[14px] place-items-center rounded-full ${completed ? "bg-[#9cfb51] text-[#011417]" : "border border-white/38 text-transparent"}`}>
        <Check size={9} strokeWidth={3} />
      </span>
      <span>{completed ? copy.lessonCompleted : copy.markLessonCompleted}</span>
      {completed && <span className="border-l border-[#9cfb51]/24 pl-[7px] text-white/56">{copy.undoCompleted}</span>}
    </button>
  );
}

type LessonMaterialsProps = {
  materials: LearnMaterial[];
  locked: boolean;
  purchase?: LearnCoursePurchase;
};

function LessonMaterials({ materials, locked, purchase }: LessonMaterialsProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const [expanded, setExpanded] = useState(false);

  if (materials.length === 0) return null;
  const canCollapseOnMobile = materials.length > 1;

  return (
    <section className="mt-[34px] max-w-[820px] max-md:mt-[38px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{copy.lessonMaterials}</h2>
      <div className="mt-[14px] overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023] max-md:mt-[18px]">
        {materials.map((material, index) => {
          const Icon = materialIcon(material.kind);
          const external = material.href.startsWith("http");
          const staticAsset = material.href.startsWith("/assets/");
          const pending = material.status === "pending";
          const disabled = locked || pending;
          const actionLabel = getMaterialActionLabel(material);
          const rowClass =
            `grid grid-cols-[34px_minmax(0,1fr)_154px] items-center gap-[12px] border-b border-white/8 px-[16px] py-[10px] last:border-b-0 max-sm:grid-cols-[32px_minmax(0,1fr)] max-sm:gap-[14px] max-sm:px-[18px] max-sm:py-[16px] ${
              canCollapseOnMobile && !expanded && index > 0 ? "max-md:hidden" : ""
            }`;

          return (
            <div key={material.title} className={rowClass}>
              <span className="grid size-[30px] place-items-center rounded-full bg-white/[0.065] text-white/76">
                <Icon size={17} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-medium leading-tight text-white">{material.title}</span>
                <span className="mt-[4px] block text-[12px] leading-tight text-white/42">{material.meta}</span>
              </span>
              {disabled ? (
                <span className={`flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.04] text-[13px] font-medium max-sm:col-span-2 max-sm:h-[44px] ${pending ? "text-[#9cfb51]/58" : "text-white/32"}`}>
                  {pending ? actionLabel : purchase ? copy.unlocksAfterPurchase : "Pro"}
                </span>
              ) : external || staticAsset ? (
                <a
                  href={material.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  download={staticAsset || material.href.endsWith(".zip") ? "" : undefined}
                  className="flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.06] text-[13px] font-medium text-white no-underline transition hover:bg-white/[0.1] max-sm:col-span-2 max-sm:h-[44px]"
                >
                  {actionLabel}
                </a>
              ) : (
                <LocalizedLink
                  to={material.href}
                  className="flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.06] text-[13px] font-medium text-white no-underline transition hover:bg-white/[0.1] max-sm:col-span-2 max-sm:h-[44px]"
                >
                  {actionLabel}
                </LocalizedLink>
              )}
            </div>
          );
        })}
        {canCollapseOnMobile && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="hidden h-[52px] w-full cursor-pointer items-center justify-center border-0 border-t border-white/8 bg-transparent px-[16px] text-[14px] font-bold text-white/82 transition hover:bg-white/[0.035] hover:text-white max-md:flex max-md:h-[60px]"
          >
            {expanded ? copy.showLessMaterials : copy.showMoreMaterials}
          </button>
        )}
      </div>
    </section>
  );
}

type LessonPromptsProps = {
  prompts: LearnPromptBlock[];
  locked: boolean;
  purchase?: LearnCoursePurchase;
  courseSlug?: string;
  lessonSlug: string;
  accessToken: string | null;
};

type LoadedPromptBody = {
  status: "loading" | "loaded" | "error";
  body?: string;
  sourceLabel?: string;
};

function LessonPrompts({ prompts, locked, purchase, courseSlug, lessonSlug, accessToken }: LessonPromptsProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadedBodies, setLoadedBodies] = useState<Record<string, LoadedPromptBody>>({});

  useEffect(() => {
    setLoadedBodies({});
    setCopiedKey(null);
  }, [accessToken, lessonSlug]);

  if (prompts.length === 0) return null;

  const getLoadedBody = (prompt: LearnPromptBlock, key: string) => prompt.body ?? loadedBodies[key]?.body;

  const loadPromptBody = async (prompt: LearnPromptBlock, key: string) => {
    if (locked || prompt.status === "pending" || prompt.body || !prompt.id || !courseSlug || !accessToken) return;
    if (loadedBodies[key]?.status === "loading" || loadedBodies[key]?.status === "loaded") return;

    setLoadedBodies((current) => ({ ...current, [key]: { status: "loading" } }));

    try {
      const response = await fetch("/api/course-prompt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          courseSlug,
          lessonSlug,
          promptId: prompt.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`prompt_load_failed:${response.status}`);
      }

      const payload = (await response.json()) as {
        prompt?: {
          body?: string;
          sourceLabel?: string | null;
        };
      };

      if (!payload.prompt?.body) {
        throw new Error("prompt_body_missing");
      }

      setLoadedBodies((current) => ({
        ...current,
        [key]: {
          status: "loaded",
          body: payload.prompt?.body,
          sourceLabel: payload.prompt?.sourceLabel ?? undefined,
        },
      }));
    } catch {
      setLoadedBodies((current) => ({ ...current, [key]: { status: "error" } }));
    }
  };

  const handleCopy = async (prompt: LearnPromptBlock, key: string) => {
    const body = getLoadedBody(prompt, key);
    if (!body || locked || prompt.status === "pending") return;
    try {
      await navigator.clipboard.writeText(body);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1400);
    } catch {
      setCopiedKey(null);
    }
  };

  return (
    <section className="mt-[34px] max-w-[820px] max-md:mt-[42px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{copy.lessonPrompts}</h2>
      <div className="mt-[14px] space-y-[10px] max-md:mt-[18px] max-md:space-y-[12px]">
        {prompts.map((prompt, index) => {
          const key = `${prompt.title}-${index}`;
          const loaded = loadedBodies[key];
          const promptBody = getLoadedBody(prompt, key);
          const pending = prompt.status === "pending" || (!prompt.body && !prompt.id);
          const disabled = locked || pending;
          const sourceLabel = prompt.sourceLabel ?? loaded?.sourceLabel;

          return (
            <details
              key={key}
              className="group overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]"
              onToggle={(event) => {
                if (event.currentTarget.open) {
                  void loadPromptBody(prompt, key);
                }
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-[14px] px-[16px] py-[14px] marker:hidden max-md:px-[18px] max-md:py-[17px]">
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold leading-tight text-white">{prompt.title}</span>
                  <span className="mt-[5px] block text-[12px] leading-[1.35] text-white/44">{prompt.meta}</span>
                </span>
                <span className={`shrink-0 rounded-[6px] px-[9px] py-[6px] text-[12px] font-bold leading-none ${pending ? "bg-[#9cfb51]/10 text-[#9cfb51]/70" : "bg-white/[0.06] text-white/68 group-open:text-[#9cfb51]"}`}>
                  {pending ? copy.materialPendingAction : copy.openPrompt}
                </span>
              </summary>
              <div className="border-t border-white/8 px-[16px] pb-[16px] pt-[14px]">
                {disabled ? (
                  <div className="flex min-h-[72px] items-center justify-center rounded-[8px] bg-white/[0.035] px-[16px] text-center text-[13px] font-medium leading-[1.35] text-white/44">
                    {pending ? copy.promptPendingText : purchase ? copy.unlocksAfterPurchase : "Pro"}
                  </div>
                ) : !promptBody ? (
                  <div className="flex min-h-[72px] items-center justify-center rounded-[8px] bg-white/[0.035] px-[16px] text-center text-[13px] font-medium leading-[1.35] text-white/44">
                    {loaded?.status === "error" ? copy.promptLoadError : loaded?.status === "loading" ? copy.promptLoading : copy.promptOpenToLoad}
                  </div>
                ) : (
                  <>
                    {sourceLabel && <div className="mb-[10px] text-[12px] font-medium text-[#9cfb51]/72">{sourceLabel}</div>}
                    <pre className="max-h-[420px] overflow-auto rounded-[8px] bg-[#06191c] p-[14px] text-[12px] leading-[1.55] text-white/78">
                      <code>{promptBody}</code>
                    </pre>
                    <button
                      type="button"
                      onClick={() => handleCopy(prompt, key)}
                      className="mt-[10px] inline-flex h-[34px] cursor-pointer items-center gap-[7px] rounded-[7px] border border-white/10 bg-white/[0.055] px-[11px] text-[12px] font-bold text-white/78 transition hover:border-[#9cfb51]/40 hover:text-[#9cfb51]"
                    >
                      {copiedKey === key ? <Check size={14} /> : <Copy size={14} />}
                      {copiedKey === key ? copy.copiedPrompt : copy.copyPrompt}
                    </button>
                  </>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

type LessonMissingItemsProps = {
  items: LearnMissingItem[];
};

function LessonMissingItems({ items }: LessonMissingItemsProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];

  if (items.length === 0) return null;

  return (
    <section className="mt-[34px] max-w-[820px]">
      <div className="flex flex-wrap items-end justify-between gap-[10px]">
        <div>
          <h2 className="text-[22px] font-bold leading-tight text-white">{copy.missingFromVideoTitle}</h2>
          <p className="mt-[7px] text-[13px] leading-[1.45] text-white/48">{copy.missingFromVideoDescription}</p>
        </div>
      </div>
      <div className="mt-[14px] overflow-hidden rounded-[8px] border border-[#9cfb51]/24 bg-[#10261b]/65">
        {items.map((item) => (
          <div key={item.title} className="grid grid-cols-[minmax(0,1fr)_136px] items-center gap-[12px] border-b border-[#9cfb51]/12 px-[16px] py-[12px] last:border-b-0 max-sm:grid-cols-1">
            <span className="min-w-0">
              <span className="block text-[14px] font-bold leading-tight text-white">{item.title}</span>
              <span className="mt-[5px] block text-[12px] leading-[1.35] text-white/48">{item.meta}</span>
            </span>
            <span className="flex h-[34px] items-center justify-center rounded-[7px] bg-[#9cfb51]/10 px-[10px] text-[12px] font-bold text-[#9cfb51]/78">
              {item.actionLabel ?? copy.materialPendingAction}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function materialIcon(kind: LearnMaterial["kind"]) {
  if (kind === "pdf") return FileText;
  if (kind === "video") return Video;
  return LinkIcon;
}

function getMaterialActionLabel(material: LearnMaterial) {
  if (material.kind === "pdf" || material.kind === "video" || material.href.startsWith("/assets/") || material.href.endsWith(".zip")) {
    return "Скачать";
  }
  return "Перейти";
}

type CollectionSummaryCardProps = {
  lesson: LearnLesson;
  collection: LearnCollection;
};

function CollectionSummaryCard({ lesson, collection }: CollectionSummaryCardProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const author = getLearnLessonAuthor(lesson);
  const authorName = getLearnAuthorName(author, lang);
  const progress = collection.progress;
  const isStandalone = collection.kind === "standalone";
  const mobileCourseProgress = collection.purchase ? progress : undefined;
  const eyebrow = collection.purchase
    ? copy.courseAccessOpen
    : isStandalone
      ? copy.singleLesson
      : getLearnCollectionCategoryLabel(collection, lang);

  return (
    <>
      {mobileCourseProgress && <CourseProgressCard progress={mobileCourseProgress} copy={copy} />}
      <section
        className={`rounded-[8px] border border-white/10 bg-[#0e2023]/92 px-[20px] py-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.18)] ${
          mobileCourseProgress ? "max-lg:hidden" : ""
        }`}
      >
        <p className="text-[13px] font-medium leading-tight text-white/42">{eyebrow}</p>
        <h2 className="mt-[14px] text-[20px] font-bold leading-[1.2] text-white">{isStandalone ? copy.lessonAuthor : getLearnCollectionTitle(collection, lang)}</h2>
        {isStandalone && <p className="mt-[10px] text-[13px] leading-[1.45] text-white/58">{getLearnLessonAuthorIntro(lesson, lang)}</p>}
        <div className="mt-[20px] flex items-center gap-[11px]">
          <ResponsiveImage
            src={author.avatarPath}
            alt=""
            width="400"
            height="400"
            loading="lazy"
            widths={[64, 96]}
            sizes="40px"
            className="size-[40px] shrink-0 rounded-full border border-white/14 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-tight text-white">{authorName}</p>
            <p className="mt-[4px] truncate text-[12px] leading-tight text-white/50">{getLearnLessonAuthorRole(lesson, lang)}</p>
          </div>
        </div>
        <AuthorSocialLinks copy={copy} />
        {progress && <CourseProgressBlock progress={progress} copy={copy} framed />}
      </section>
    </>
  );
}

type CourseProgress = NonNullable<LearnCollection["progress"]>;

function CourseProgressCard({ progress, copy }: { progress: CourseProgress; copy: (typeof detailCopy)["ru"] }) {
  return (
    <section className="rounded-[8px] border border-white/10 bg-[#0e2023]/92 px-[20px] py-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.18)] max-md:px-[28px] max-md:py-[28px] lg:hidden">
      <CourseProgressBlock progress={progress} copy={copy} />
    </section>
  );
}

function CourseProgressBlock({ progress, copy, framed = false }: { progress: CourseProgress; copy: (typeof detailCopy)["ru"]; framed?: boolean }) {
  const percent = Math.round((progress.completed / progress.total) * 100);

  return (
    <div className={framed ? "mt-[22px] border-t border-white/8 pt-[18px]" : undefined}>
      <div className="flex items-center justify-between gap-[12px]">
        <span className="text-[13px] font-medium text-white/72 max-md:text-[16px]">{copy.courseProgress}</span>
        <span className="text-[13px] font-bold text-[#9cfb51] max-md:text-[16px]">{percent}%</span>
      </div>
      <div className="mt-[12px] h-[5px] overflow-hidden rounded-full bg-white/12 max-md:mt-[24px]">
        <div className="h-full rounded-full bg-[#9cfb51]" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-[8px] text-right text-[12px] leading-tight text-white/44 max-md:mt-[18px] max-md:text-[14px]">
        {copy.progressCount(progress.completed, progress.total)}
      </p>
    </div>
  );
}

type AuthorSocialLinksProps = {
  copy: (typeof detailCopy)["ru"];
};

function AuthorSocialLinks({ copy }: AuthorSocialLinksProps) {
  return (
    <div className="mt-[18px] border-t border-white/8 pt-[16px]">
      <p className="text-[12px] font-medium leading-none text-white/38">{copy.authorSocials}</p>
      <div className="mt-[10px] flex flex-wrap gap-[8px]">
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
    </div>
  );
}

const authorSocialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/channel/UC797Sd_fYNILYZFuXsjjFDA", iconPath: "/assets/space/social/youtube.svg" },
  { label: "Instagram", href: "https://www.instagram.com/v.voronezhtsev/", iconPath: "/assets/space/social/instagram.svg" },
  { label: "Telegram", href: "https://t.me/v_voronezhtsev", iconPath: "/assets/space/social/telegram.svg" },
  { label: "TikTok", href: "https://www.tiktok.com/@v_voronezhtsev", iconPath: "/assets/space/social/tiktok.svg" },
] as const;

type LessonSidebarProps = {
  lesson: LearnLesson;
  collection: LearnCollection;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onTimestampSelect: (seconds: number) => void;
  hasAccess: boolean;
  purchase?: LearnCoursePurchase;
  currentSlug?: string;
  mobileTimestampsTabOverride?: {
    label: string;
    targetId: string;
  };
};

function LessonSidebar({
  lesson,
  collection,
  activeTab,
  onTabChange,
  onTimestampSelect,
  hasAccess,
  purchase,
  currentSlug,
  mobileTimestampsTabOverride,
}: LessonSidebarProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const isCourse = collection.kind === "course";
  const handleTimestampsTabClick = () => {
    if (mobileTimestampsTabOverride && typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      document.getElementById(mobileTimestampsTabOverride.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    onTabChange("timestamps");
  };

  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]/92 max-md:rounded-[10px]">
      <div className="flex h-[52px] items-end border-b border-white/8 px-[16px] max-md:h-[72px] max-md:px-[28px]">
        {isCourse && (
          <button
            type="button"
            onClick={() => onTabChange("lessons")}
            className={`relative h-[52px] min-w-[92px] cursor-pointer border-0 bg-transparent px-[10px] text-[14px] font-bold transition ${
              activeTab === "lessons" ? "text-white" : "text-white/58 hover:text-white"
            } max-md:h-[72px] max-md:min-w-[118px] max-md:text-[16px]`}
          >
            {copy.lessonsTab}
            {activeTab === "lessons" && <span className="absolute inset-x-[10px] bottom-0 h-[2px] rounded-full bg-[#9cfb51]" />}
          </button>
        )}
        <button
          type="button"
          onClick={handleTimestampsTabClick}
          className={`relative h-[52px] min-w-[116px] cursor-pointer border-0 bg-transparent px-[10px] text-[14px] font-bold transition ${
            activeTab === "timestamps" ? "text-white" : "text-white/58 hover:text-white"
          } max-md:h-[72px] max-md:min-w-[142px] max-md:text-[16px]`}
        >
          {mobileTimestampsTabOverride ? (
            <>
              <span className="max-lg:hidden">{copy.timestampsTab}</span>
              <span className="lg:hidden">{mobileTimestampsTabOverride.label}</span>
            </>
          ) : (
            copy.timestampsTab
          )}
          {activeTab === "timestamps" && <span className="absolute inset-x-[10px] bottom-0 h-[2px] rounded-full bg-[#9cfb51]" />}
        </button>
      </div>

      {activeTab === "lessons" && isCourse ? (
        <CourseOutline collection={collection} currentSlug={currentSlug ?? lesson.slug} hasAccess={hasAccess} purchase={purchase} />
      ) : (
        <TimestampList timestamps={getLearnLessonTimestamps(lesson, lang)} onSelect={onTimestampSelect} />
      )}
    </section>
  );
}

type CourseOutlineProps = {
  collection: LearnCollection;
  currentSlug: string;
  hasAccess: boolean;
  purchase?: LearnCoursePurchase;
  className?: string;
};

export function CourseOutline({ collection, currentSlug, hasAccess, purchase, className = "" }: CourseOutlineProps) {
  const { lang } = useLang();
  const hiddenIntroOpened = useHiddenIntroOpened();
  const showHiddenIntroSlot = HIDDEN_INTRO_WEBSITE_SLOT_ENABLED && collection.id === AI_CONTENT_MARKETING_COURSE_SLUG;

  return (
    <div className={`max-h-[720px] space-y-[2px] overflow-y-auto p-[8px] max-md:max-h-[312px] max-md:space-y-[4px] max-md:p-[12px] ${className}`}>
      {collection.lessons.map((outlineLesson, index) => {
        const current = outlineLesson.slug === currentSlug;
        const isHiddenIntro = outlineLesson.slug === HIDDEN_INTRO_SLUG;
        const hiddenIntroAvailable = isHiddenIntro && (hiddenIntroOpened || current);
        const locked = isLessonLocked(outlineLesson, hasAccess || hiddenIntroAvailable);
        const metaLabel = outlineLesson.duration;
        const displayNumber = getCourseLessonDisplayNumber(collection, outlineLesson) || String(index + 1);
        const rowClass = `group grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-[10px] rounded-[8px] px-[10px] py-[11px] no-underline transition max-md:grid-cols-[42px_minmax(0,1fr)_28px] max-md:gap-[10px] max-md:px-[12px] max-md:py-[14px] ${
          locked ? "min-h-[62px]" : ""
        } ${
          current
            ? "bg-[#173a22] text-white"
            : locked
              ? "bg-white/[0.035] text-white/68 hover:bg-white/[0.055] hover:text-white"
              : "text-white/76 hover:bg-white/[0.045] hover:text-white"
        }`;
        const rowContent = (
          <>
            <span className={`text-center text-[14px] font-bold leading-none max-md:text-[18px] ${current ? "text-[#9cfb51]" : isHiddenIntro ? "text-[#9cfb51]/72" : "text-white/48"}`}>
              {displayNumber}.
            </span>
            <span className="min-w-0">
              <span className={`block text-[14px] font-bold leading-[1.35] max-md:text-[16px] ${current ? "text-white" : ""}`}>
                {getLearnLessonTitle(outlineLesson, lang)}
              </span>
              <span className={`mt-[4px] block text-[12px] leading-tight max-md:text-[14px] ${isHiddenIntro && locked ? "text-[#9cfb51]" : "text-white/44"}`}>
                {isHiddenIntro && locked ? getHiddenIntroCopy("lockedAction", lang) : metaLabel}
              </span>
            </span>
            {locked ? (
              <span className="grid size-[22px] place-items-center text-[#9cfb51]/72">
                {isHiddenIntro ? <LinkIcon size={16} strokeWidth={2.25} /> : <Lock size={16} strokeWidth={2.25} />}
              </span>
            ) : (
              <LessonStatusDot lesson={outlineLesson} current={current} />
            )}
          </>
        );

        if (isHiddenIntro && locked) {
          return (
            <a
              key={outlineLesson.slug}
              href={HIDDEN_INTRO_TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className={rowClass}
            >
              {rowContent}
            </a>
          );
        }

        return (
          <LocalizedLink
            key={outlineLesson.slug}
            to={getLessonHref(collection, outlineLesson.slug, lang)}
            aria-current={current ? "page" : undefined}
            className={rowClass}
          >
            {rowContent}
          </LocalizedLink>
        );
      })}
      {showHiddenIntroSlot ? (
        hiddenIntroOpened || hasAccess ? (
          <LocalizedLink
            to={HIDDEN_INTRO_ROUTE}
            className="group grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-[10px] rounded-[8px] px-[10px] py-[11px] text-white/76 no-underline transition hover:bg-white/[0.045] hover:text-white max-md:grid-cols-[42px_minmax(0,1fr)_28px] max-md:gap-[10px] max-md:px-[12px] max-md:py-[14px]"
          >
            <span className="text-center text-[14px] font-bold leading-none text-[#9cfb51] max-md:text-[18px]">+</span>
            <span className="min-w-0">
              <span className="block text-[14px] font-bold leading-[1.35] max-md:text-[16px]">{getHiddenIntroCopy("title", lang)}</span>
              <span className="mt-[4px] block text-[12px] leading-tight text-white/44 max-md:text-[14px]">{getHiddenIntroCopy("lockedMeta", lang)}</span>
            </span>
            <span className={`grid size-[22px] place-items-center ${currentSlug === HIDDEN_INTRO_SLUG ? "text-[#9cfb51]" : "text-white/40"}`}>
              <LockOpen size={16} strokeWidth={2.25} />
            </span>
          </LocalizedLink>
        ) : (
          <a
            href={HIDDEN_INTRO_TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-[10px] rounded-[8px] bg-white/[0.035] px-[10px] py-[11px] text-white/68 no-underline transition hover:bg-white/[0.055] hover:text-white max-md:grid-cols-[42px_minmax(0,1fr)_28px] max-md:gap-[10px] max-md:px-[12px] max-md:py-[14px]"
          >
            <span className="text-center text-[14px] font-bold leading-none text-white/48 max-md:text-[18px]">+</span>
            <span className="min-w-0">
              <span className="block text-[14px] font-bold leading-[1.35] max-md:text-[16px]">{getHiddenIntroCopy("title", lang)}</span>
              <span className="mt-[4px] block text-[12px] leading-tight text-[#9cfb51] max-md:text-[14px]">{getHiddenIntroCopy("lockedAction", lang)}</span>
            </span>
            <span className="grid size-[22px] place-items-center text-[#788183]">
              <Lock size={16} strokeWidth={2.25} />
            </span>
          </a>
        )
      ) : null}
    </div>
  );
}

function useHiddenIntroOpened() {
  const [opened, setOpened] = useState(() => readHiddenIntroOpened());

  useEffect(() => {
    setOpened(readHiddenIntroOpened());
  }, []);

  return opened;
}

function readHiddenIntroOpened() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(HIDDEN_INTRO_UNLOCK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

type TimestampListProps = {
  timestamps: LearnTimestamp[];
  onSelect: (seconds: number) => void;
};

function TimestampList({ timestamps, onSelect }: TimestampListProps) {
  return (
    <div className="max-h-[720px] overflow-y-auto p-[8px]">
      {timestamps.map((timestamp) => (
        <button
          key={`${timestamp.time}-${timestamp.title}`}
          type="button"
          onClick={() => onSelect(timestamp.seconds)}
          className="group grid w-full cursor-pointer grid-cols-[52px_minmax(0,1fr)] gap-[10px] rounded-[8px] border-0 bg-transparent px-[10px] py-[11px] text-left transition hover:bg-white/[0.045] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/70"
        >
          <span className="mt-[1px] font-mono text-[13px] font-bold leading-tight text-[#9cfb51]">{timestamp.time}</span>
          <span className="min-w-0">
            <span className="block text-[14px] font-bold leading-[1.35] text-white group-hover:text-[#9cfb51]">
              {timestamp.title}
            </span>
            {timestamp.description && (
              <span className="mt-[4px] block text-[12px] leading-[1.35] text-white/48">{timestamp.description}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

type CourseAccessState = {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
};

function useCourseAccess(purchase: LearnCoursePurchase | undefined, accessToken: string | null): CourseAccessState {
  const [state, setState] = useState<CourseAccessState>({ hasAccess: false, loading: false, error: null });

  useEffect(() => {
    if (!purchase) {
      setState({ hasAccess: false, loading: false, error: null });
      return;
    }

    if (!accessToken) {
      setState({ hasAccess: false, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: null }));

    fetchCourseAccessSummary(accessToken, purchase.courseSlug)
      .then((summary) => {
        if (!cancelled) setState({ hasAccess: summary.has_access === true, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            hasAccess: false,
            loading: false,
            error: error instanceof Error ? error.message : "course_access_failed",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, purchase?.courseSlug]);

  return state;
}

type CoursePurchaseCardProps = {
  collection: LearnCollection;
  purchase: LearnCoursePurchase;
  hasAccess: boolean;
  loadingAccess: boolean;
  initialEmail: string;
  playerHeight?: number | null;
};

type PendingCoursePayment = {
  courseSlug: string;
  email: string;
  orderId?: string;
  at: number;
};

type CoursePromoFeedback = {
  tone: "success" | "error";
  text: string;
} | null;

const COURSE_PAYMENT_PENDING_STORAGE_KEY = "opten_course_payment_pending_v1";

type CourseDiscountClaimState = "idle" | "checking" | "active" | "expired" | "invalid";

function CoursePurchaseTitle({ count }: { count: number }) {
  const { lang } = useLang();
  const titleClass = "max-w-[314px] text-[19px] font-bold leading-[1.22] tracking-normal text-white max-sm:text-[18px]";

  if (lang === "en") {
    return (
      <h2 className={titleClass}>
        <span className="text-[#9cfb51]">{count}-lesson course</span> about AI for content marketing in{" "}
        <span className="text-[#9cfb51]">2026</span>
      </h2>
    );
  }

  return (
    <h2 className={titleClass}>
      <span className="text-[#9cfb51]">Курс из {count} уроков</span> про ИИ для контента и маркетинга в{" "}
      <span className="text-[#9cfb51]">2026г</span>
    </h2>
  );
}

function CoursePurchaseCard({ collection, purchase, hasAccess, loadingAccess, initialEmail, playerHeight }: CoursePurchaseCardProps) {
  const { lang } = useLang();
  const location = useLocation();
  const [currency] = useCurrencyPreference();
  const copy = detailCopy[lang];
  const discountClaimToken = useMemo(() => readCourseDiscountClaimTokenFromSearch(location.search), [location.search]);
  const [email, setEmail] = useState(initialEmail);
  const [emailTouched, setEmailTouched] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [appliedPromoQuote, setAppliedPromoQuote] = useState<CoursePaymentResponse | null>(null);
  const [discountClaimQuote, setDiscountClaimQuote] = useState<CoursePaymentResponse | null>(null);
  const [discountClaimState, setDiscountClaimState] = useState<CourseDiscountClaimState>("idle");
  const [claimNow, setClaimNow] = useState(() => Date.now());
  const [promoChecking, setPromoChecking] = useState(false);
  const [promoFeedback, setPromoFeedback] = useState<CoursePromoFeedback>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PendingCoursePayment | null>(() => readPendingCoursePayment(purchase.courseSlug));
  const playerHeightStyle = playerHeight
    ? ({ "--course-player-height": `${playerHeight}px` } as CSSProperties)
    : undefined;

  useEffect(() => {
    if (!emailTouched && initialEmail) setEmail(initialEmail);
  }, [emailTouched, initialEmail]);

  useEffect(() => {
    if (!discountClaimToken) {
      setDiscountClaimQuote(null);
      setDiscountClaimState("idle");
      return;
    }

    let cancelled = false;
    setDiscountClaimState("checking");
    setDiscountClaimQuote(null);
    setAppliedPromoCode(null);
    setAppliedPromoQuote(null);
    setPromoFeedback(null);

    quoteCoursePayment(purchase.courseSlug, currency, undefined, discountClaimToken)
      .then((quote) => {
        if (cancelled) return;
        setDiscountClaimQuote(quote);
        setClaimNow(Date.now());
        const expiresAtMs = Date.parse(quote.discount_claim_expires_at ?? "");
        setDiscountClaimState(
          quote.discount_claim_active === true && Number.isFinite(expiresAtMs) && expiresAtMs > Date.now()
            ? "active"
            : "expired",
        );
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "";
        setDiscountClaimQuote(null);
        setDiscountClaimState(message.includes("expired") || message.includes("used") ? "expired" : "invalid");
      });

    return () => {
      cancelled = true;
    };
  }, [currency, discountClaimToken, purchase.courseSlug]);

  useEffect(() => {
    if (!discountClaimToken || discountClaimState === "idle") return;
    const timer = window.setInterval(() => setClaimNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [discountClaimState, discountClaimToken]);

  const normalizedEmail = normalizeCourseEmail(email);
  const baseSaleValue = currency === "USD" ? purchase.priceUsd : purchase.priceRub;
  const claimExpiresAtMs = Date.parse(discountClaimQuote?.discount_claim_expires_at ?? "");
  const activeDiscountClaim =
    discountClaimState === "active" &&
    discountClaimQuote?.discount_claim_active === true &&
    Number.isFinite(claimExpiresAtMs) &&
    claimExpiresAtMs > claimNow;
  const claimBlocksPromo = Boolean(discountClaimToken && (discountClaimState === "checking" || activeDiscountClaim));
  const claimExpired = Boolean(
    discountClaimToken &&
      (discountClaimState === "expired" || discountClaimState === "invalid" || (discountClaimState === "active" && !activeDiscountClaim)),
  );
  const quotedAmountValue = activeDiscountClaim
    ? typeof discountClaimQuote?.amount_value === "number"
      ? discountClaimQuote.amount_value
      : null
    : typeof appliedPromoQuote?.amount_value === "number"
      ? appliedPromoQuote.amount_value
      : null;
  const effectiveSaleValue = quotedAmountValue ?? baseSaleValue;
  const showCrossedPrice = Boolean(activeDiscountClaim || (appliedPromoCode && appliedPromoQuote));
  const salePrice = formatCoursePrice(effectiveSaleValue, currency);
  const crossedPrice = formatCoursePrice(baseSaleValue, currency);
  const claimRemaining = activeDiscountClaim ? formatCourseClaimRemaining(claimExpiresAtMs - claimNow) : "";
  const claimDiscountPercent = discountClaimQuote?.claim_discount_percent ?? 20;
  const courseLessonsCount = collection.progress?.total || collection.lessons.length;
  const formMessage = error
    ? { tone: "error" as const, text: error }
    : claimExpired
      ? { tone: "muted" as const, text: copy.courseClaimExpired }
    : pendingPayment
      ? { tone: "muted" as const, text: copy.coursePaymentPending(pendingPayment.email) }
      : loadingAccess
        ? { tone: "muted" as const, text: copy.courseAccessLoading }
        : { tone: "legal" as const, text: copy.courseLegalNotice };

  useEffect(() => {
    if (claimBlocksPromo) {
      setAppliedPromoQuote(null);
      return;
    }

    if (!appliedPromoCode) {
      setAppliedPromoQuote(null);
      return;
    }

    let cancelled = false;
    setPromoChecking(true);
    setPromoFeedback(null);

    quoteCoursePayment(purchase.courseSlug, currency, appliedPromoCode)
      .then((quote) => {
        if (cancelled) return;
        setAppliedPromoQuote({
          ...quote,
          promo_code: quote.promo_code ?? appliedPromoCode,
        });
        setPromoFeedback({ tone: "success", text: copy.coursePromoApplied });
      })
      .catch(() => {
        if (cancelled) return;
        setAppliedPromoCode(null);
        setAppliedPromoQuote(null);
        setPromoFeedback({ tone: "error", text: copy.coursePromoInvalid });
      })
      .finally(() => {
        if (!cancelled) setPromoChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appliedPromoCode, claimBlocksPromo, currency, purchase.courseSlug, copy.coursePromoApplied, copy.coursePromoInvalid]);

  const handlePromoApply = () => {
    if (claimBlocksPromo) return;

    if (appliedPromoCode) {
      setAppliedPromoCode(null);
      setAppliedPromoQuote(null);
      setPromoFeedback(null);
      return;
    }

    const normalized = normalizeCoursePromoCode(promoCode);
    setPromoCode(normalized);
    setError(null);

    if (!normalized) {
      setAppliedPromoCode(null);
      setPromoFeedback(null);
      return;
    }

    if (!isValidCoursePromoCode(normalized)) {
      setAppliedPromoCode(null);
      setPromoFeedback({ tone: "error", text: copy.coursePromoInvalid });
      return;
    }

    setAppliedPromoCode(normalized);
    setAppliedPromoQuote(null);
    setPromoFeedback(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!isValidCourseEmail(normalizedEmail)) {
      setError(copy.courseInvalidEmail);
      return;
    }

    setSubmitting(true);
    try {
      const returnUrl = typeof window !== "undefined" ? window.location.href.split("#")[0] : `/learn/courses/${purchase.courseSlug}`;
      const effectivePromoCode = activeDiscountClaim ? undefined : appliedPromoCode ?? undefined;
      const effectiveClaimToken = activeDiscountClaim ? discountClaimToken ?? undefined : undefined;
      const result = await createCoursePayment(purchase.courseSlug, normalizedEmail, returnUrl, currency, effectivePromoCode, effectiveClaimToken);

      const pending = {
        courseSlug: purchase.courseSlug,
        email: normalizedEmail,
        orderId: result.order_id,
        at: Date.now(),
      };
      writePendingCoursePayment(pending);
      setPendingPayment(pending);

      if (currency === "USD") {
        if (!result.price_id) throw new Error("no_paddle_price_id");
        try {
          await ensurePaddle();
        } catch {
          throw new Error("paddle_sdk_blocked");
        }
        if (!window.Paddle) throw new Error("paddle_sdk_missing");
        window.Paddle.Checkout.open({
          items: [{ priceId: result.price_id, quantity: 1 }],
          customer: { email: normalizedEmail },
          ...(result.discount_id ? { discountId: result.discount_id } : {}),
          ...(result.discount_code ? { discountCode: result.discount_code } : {}),
          customData: result.custom_data ?? {
            kind: "course_purchase",
            course_slug: purchase.courseSlug,
            email: normalizedEmail,
            order_id: result.order_id ?? "",
          },
          settings: {
            theme: "dark",
            locale: "en",
            successUrl: appendCourseOrderParam(returnUrl, result.order_id),
            displayMode: "overlay",
            showAddDiscounts: false,
          },
          eventCallback: (event) => {
            if (event.name === "checkout.closed") setSubmitting(false);
          },
        });
        return;
      }

      if (!result.confirmation_url) throw new Error("no_confirmation_url");
      window.location.href = result.confirmation_url;
    } catch (paymentError) {
      setError(paymentError instanceof Error ? copy.coursePaymentError : copy.coursePaymentError);
      setSubmitting(false);
    }
  };

  if (hasAccess) {
    return (
      <section id="course-purchase" className="rounded-[8px] border border-[#9cfb51]/45 bg-[#10261b] p-[18px]">
        <div className="flex items-start gap-[12px]">
          <span className="grid size-[42px] shrink-0 place-items-center rounded-full bg-[#9cfb51]/12 text-[#9cfb51]">
            <Check size={20} />
          </span>
          <div>
            <h2 className="text-[16px] font-bold leading-tight text-white">{copy.courseAccessActive}</h2>
            <p className="mt-[8px] text-[13px] leading-[1.45] text-white/62">{copy.courseAccessActiveDescription}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="course-purchase"
      style={playerHeightStyle}
      className="relative flex min-h-[424px] items-center justify-center overflow-hidden rounded-[8px] border border-[#9cfb51]/60 bg-[linear-gradient(135deg,rgba(16,48,34,0.96),rgba(14,32,35,0.98))] shadow-[0_18px_60px_rgba(54,134,28,0.16)] lg:h-[var(--course-player-height)]"
    >
      <div className="relative h-[373px] w-[calc(100%-46px)] max-w-[314px]">
        <div className="absolute left-0 top-0 flex w-full items-start justify-between gap-[16px]">
          <div className="min-w-0">
            <CoursePurchaseTitle count={courseLessonsCount} />
          </div>
        </div>

        <div className="absolute left-0 top-[74px] flex w-full items-end gap-[24px]">
          <span className="font-['Unbounded',sans-serif] text-[41px] font-bold leading-[38px] text-white max-sm:text-[40px]">{salePrice}</span>
          {showCrossedPrice && (
            <span className="text-[24px] font-bold leading-[19px] text-white/36 line-through max-sm:text-[22px]">{crossedPrice}</span>
          )}
        </div>

        <div className="absolute left-0 top-[129px] h-[62px] w-full">
          {claimBlocksPromo ? (
            <>
              <p className="block h-[12px] text-[12px] font-bold leading-[12px] text-white/62">
                {copy.courseClaimLabel}
              </p>
              <div className="mt-[8px] flex h-[42px] items-center gap-[9px] rounded-[8px] border border-[#9cfb51]/65 bg-[#06191c] px-[12px]">
                <Clock size={16} strokeWidth={2} className="shrink-0 text-[#9cfb51]" />
                <p className="min-w-0 truncate text-[13px] font-bold leading-[16px] text-white">
                  {discountClaimState === "checking"
                    ? copy.courseClaimChecking
                    : copy.courseClaimActive(claimDiscountPercent, claimRemaining)}
                </p>
              </div>
            </>
          ) : (
            <>
              <label className="block h-[12px] text-[12px] font-bold leading-[12px] text-white/62" htmlFor="course-purchase-promo">
                {copy.coursePromoLabel}
              </label>
              <div
                className={`mt-[8px] flex h-[42px] items-center gap-[8px] rounded-[8px] border bg-[#06191c] pl-[12px] pr-[6px] transition focus-within:border-[#9cfb51]/65 ${
                  promoFeedback?.tone === "error"
                    ? "border-[#ff8f8f]/55"
                    : appliedPromoCode
                      ? "border-[#9cfb51]/65"
                      : "border-white/12"
                }`}
                title={promoFeedback?.text ?? undefined}
              >
                <Tag size={16} strokeWidth={2} className="shrink-0 text-white/38" />
                <input
                  id="course-purchase-promo"
                  type="text"
                  value={promoCode}
                  onChange={(event) => {
                    setPromoCode(normalizeCoursePromoCode(event.target.value).replace(/[^A-Z0-9]/g, "").slice(0, 32));
                    setAppliedPromoCode(null);
                    setAppliedPromoQuote(null);
                    setPromoFeedback(null);
                  }}
                  placeholder={copy.coursePromoPlaceholder}
                  autoComplete="off"
                  autoCapitalize="characters"
                  readOnly={Boolean(appliedPromoCode) || promoChecking}
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium uppercase text-white outline-none placeholder:normal-case placeholder:text-white/28"
                />
                <button
                  type="button"
                  disabled={promoChecking}
                  onClick={handlePromoApply}
                  className="h-[30px] min-w-[82px] shrink-0 cursor-pointer rounded-[6px] border-0 bg-white/8 px-[10px] text-[12px] font-bold text-white/78 transition hover:bg-white/12 hover:text-white disabled:cursor-wait disabled:opacity-70"
                >
                  {promoChecking ? copy.coursePromoChecking : appliedPromoCode ? copy.coursePromoCancel : copy.coursePromoApply}
                </button>
              </div>
            </>
          )}
        </div>

        <form className="contents" onSubmit={handleSubmit}>
          <div className="absolute left-0 top-[207px] h-[64px] w-full">
            <label className="block h-[12px] text-[12px] font-bold leading-[12px] text-white/62" htmlFor="course-purchase-email">
              {copy.courseEmailLabel}
            </label>
            <div className={`mt-[8px] flex h-[44px] items-center gap-[8px] rounded-[8px] border bg-[#06191c] px-[12px] focus-within:border-[#9cfb51]/65 ${error ? "border-[#ff8f8f]/55" : "border-white/12"}`}>
              <Mail size={16} strokeWidth={2} className="shrink-0 text-white/38" />
              <input
                id="course-purchase-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmailTouched(true);
                  setEmail(event.target.value);
                }}
                placeholder={copy.courseEmailPlaceholder}
                autoComplete="email"
                className="h-full min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-white/28"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="absolute left-0 top-[295px] flex h-[46px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border-0 bg-[#9cfb51] px-[16px] text-[14px] font-bold text-[#062013] transition hover:bg-[#8ee943] disabled:cursor-wait disabled:opacity-70"
          >
            <CreditCard size={17} strokeWidth={2} />
            {submitting ? copy.coursePaymentOpening : copy.courseBuyButton(salePrice)}
          </button>
          <div className="absolute left-0 top-[355px] flex h-[16px] w-full items-center justify-center overflow-hidden" aria-live="polite">
            {formMessage && (
              <p
                className={`flex min-w-0 items-center justify-center gap-[8px] truncate font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] ${
                  formMessage.tone === "error"
                    ? "text-[#ff8f8f]"
                    : formMessage.tone === "legal"
                      ? "text-[#9cfb51]/60"
                      : "text-white/45"
                }`}
              >
                <span className="truncate">{formMessage.text}</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function appendCourseOrderParam(returnUrl: string, orderId?: string) {
  if (!orderId) return returnUrl;
  try {
    const url = new URL(returnUrl, window.location.origin);
    url.searchParams.set("course_order", orderId);
    return url.toString();
  } catch {
    return returnUrl;
  }
}

function formatCourseClaimRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function readPendingCoursePayment(courseSlug: string): PendingCoursePayment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(COURSE_PAYMENT_PENDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingCoursePayment>;
    if (parsed.courseSlug !== courseSlug || typeof parsed.email !== "string") return null;
    if (typeof parsed.at !== "number" || Date.now() - parsed.at > 24 * 60 * 60 * 1000) return null;
    return {
      courseSlug,
      email: parsed.email,
      orderId: typeof parsed.orderId === "string" ? parsed.orderId : undefined,
      at: parsed.at,
    };
  } catch {
    return null;
  }
}

function writePendingCoursePayment(payment: PendingCoursePayment) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(COURSE_PAYMENT_PENDING_STORAGE_KEY, JSON.stringify(payment));
  } catch {
    // Best-effort checkout hint only.
  }
}

type UnlockProCardProps = {
  hasPro: boolean;
};

function UnlockProCard({ hasPro }: UnlockProCardProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];

  if (hasPro) {
    return (
      <section className="rounded-[8px] border border-[#9cfb51]/45 bg-[#10261b] p-[18px]">
        <div className="flex items-start gap-[12px]">
          <span className="grid size-[42px] shrink-0 place-items-center rounded-full bg-[#9cfb51]/12 text-[#9cfb51]">
            <Check size={20} />
          </span>
          <div>
            <h2 className="text-[16px] font-bold leading-tight text-white">{copy.proActive}</h2>
            <p className="mt-[8px] text-[13px] leading-[1.45] text-white/62">{copy.proActiveDescription}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[8px] border border-[#9cfb51]/55 bg-[linear-gradient(135deg,rgba(11,48,31,0.95),rgba(14,32,35,0.96))] p-[18px] shadow-[0_18px_60px_rgba(54,134,28,0.16)]">
      <div className="pointer-events-none absolute right-[-42px] top-[-28px] size-[120px] rounded-full bg-[#9cfb51]/12 blur-[4px]" />
      <div className="relative flex items-start gap-[12px]">
        <span className="grid size-[42px] shrink-0 place-items-center rounded-full bg-[#9cfb51]/14 text-[#9cfb51]">
          <Crown size={20} />
        </span>
        <div>
          <h2 className="text-[17px] font-bold leading-[1.25] text-white">{copy.unlockAllLessons}</h2>
          <p className="mt-[8px] text-[13px] leading-[1.45] text-white/68">
            {copy.unlockAllDescription}
          </p>
        </div>
      </div>
      <LocalizedLink
        to="/pay"
        className="relative mt-[18px] flex h-[43px] items-center justify-center rounded-[8px] bg-[#9cfb51] px-[16px] text-[14px] font-bold text-[#062013] no-underline transition hover:bg-[#8ee943]"
      >
        {copy.unlockOnPro}
      </LocalizedLink>
    </section>
  );
}

type RelatedLessonsProps = {
  collection: LearnCollection;
  currentSlug: string;
  hasAccess: boolean;
  purchase?: LearnCoursePurchase;
};

function RelatedLessons({ collection, currentSlug, hasAccess, purchase }: RelatedLessonsProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const lessons = useMemo(
    () => collection.lessons.filter((item) => item.slug !== currentSlug).slice(0, 2),
    [collection.lessons, currentSlug],
  );

  if (lessons.length === 0) return null;

  return (
    <section className="mt-[36px]">
      <h2 className="text-[24px] font-bold leading-tight text-white">{copy.allLessons}</h2>
      <div className="mt-[16px] grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
        {lessons.map((item) => {
          const locked = isLessonLocked(item, hasAccess);
          const showCourseLockVisual = Boolean(purchase);
          return (
            <LocalizedLink
              key={item.slug}
              to={getLessonHref(collection, item.slug, lang)}
              className="group overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023] text-white no-underline transition hover:border-[#9cfb51]/45 hover:bg-[#10282c]"
            >
              <div className="relative aspect-video overflow-hidden bg-[#06191c]">
                <ResponsiveImage
                  src={item.thumbnailPath}
                  alt=""
                  width="1200"
                  height="676"
                  loading="lazy"
                  widths={[360, 480, 720]}
                  sizes="(max-width: 639px) calc(100vw - 32px), 400px"
                  className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.035] ${
                    locked || showCourseLockVisual ? "opacity-60" : "opacity-82"
                  }`}
                />
                <span
                  className={`absolute inset-0 ${
                    locked || showCourseLockVisual ? "bg-[#011417]/52" : "bg-[linear-gradient(180deg,rgba(1,16,18,0.04),rgba(1,16,18,0.36))]"
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 grid size-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${
                    locked || showCourseLockVisual ? "bg-white/10 text-white/72" : "bg-[#9cfb51] text-[#011417] shadow-[0_14px_38px_rgba(156,251,81,0.22)]"
                  }`}
                >
                  {locked || showCourseLockVisual ? <Lock size={21} /> : <Play size={22} fill="currentColor" className="ml-[2px]" />}
                </span>
                <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/72 px-[6px] py-[4px] text-[13px] font-medium leading-none text-white">
                  {item.duration}
                </span>
              </div>
              <div className="px-[14px] pb-[18px] pt-[13px]">
                <p className="text-[12px] leading-none text-white/38">{getLearnLessonCategoryLabel(item, lang)}</p>
                <h3 className="mt-[9px] min-h-[48px] text-[18px] font-bold leading-[1.3] text-white">
                  {getNumberedCourseLessonTitle(collection, item, lang)}
                </h3>
                <p className="mt-[14px] text-[13px] font-medium text-[#9cfb51]">
                  {purchase ? copy.unlocksAfterPurchase : locked ? copy.unlocksOnPro : copy.watchLesson}
                </p>
              </div>
            </LocalizedLink>
          );
        })}
      </div>
    </section>
  );
}

function getLessonHref(collection: LearnCollection, slug: string, lang: "ru" | "en") {
  const basePath = collection.routeBasePath?.[lang] ?? "/learn";
  return `${basePath}/${slug}`;
}

function getNumberedCourseLessonTitle(collection: LearnCollection, lesson: LearnLesson, lang: "ru" | "en") {
  const title = getLearnLessonTitle(lesson, lang);
  if (collection.kind !== "course") return title;
  const displayNumber = getCourseLessonDisplayNumber(collection, lesson);
  return displayNumber ? `${displayNumber}. ${title}` : title;
}

function getCourseLessonDisplayNumber(collection: LearnCollection, lesson: LearnLesson) {
  if (collection.kind !== "course") return "";
  const index = collection.lessons.findIndex((item) => item.slug === lesson.slug);
  if (index < 0) return "";
  const hasHiddenIntro = collection.id === AI_CONTENT_MARKETING_COURSE_SLUG && collection.lessons.some((item) => item.slug === HIDDEN_INTRO_SLUG);
  if (!hasHiddenIntro) return String(index + 1);
  if (lesson.slug === HIDDEN_INTRO_SLUG) return "0";
  return String(index);
}

type LessonStatusDotProps = {
  lesson: LearnLesson;
  current: boolean;
};

function LessonStatusDot({ lesson, current }: LessonStatusDotProps) {
  if (lesson.status === "Completed") {
    return (
      <span className="grid size-[22px] place-items-center">
        <span className="grid size-[14px] place-items-center rounded-full bg-[#9cfb51] text-[#011417]">
          <Check size={10} strokeWidth={3} />
        </span>
      </span>
    );
  }

  return (
    <span className="grid size-[22px] place-items-center">
      <span
        className={`block size-[12px] rounded-full border ${
          current ? "border-[#9cfb51]" : "border-white/42"
        }`}
      />
    </span>
  );
}

function readStoredLearnProgress(): StoredLearnProgress {
  if (typeof window === "undefined") return { completed: [], incomplete: [] };

  try {
    const raw = window.localStorage.getItem(LEARN_PROGRESS_STORAGE_KEY);
    if (!raw) return { completed: [], incomplete: [] };
    const parsed = JSON.parse(raw) as Partial<StoredLearnProgress>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item): item is string => typeof item === "string") : [],
      incomplete: Array.isArray(parsed.incomplete) ? parsed.incomplete.filter((item): item is string => typeof item === "string") : [],
    };
  } catch {
    return { completed: [], incomplete: [] };
  }
}

function writeStoredLearnProgress(progress: StoredLearnProgress) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LEARN_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Local progress is a convenience; failing to persist should not break the lesson page.
  }
}

function updateStoredLessonProgress(progress: StoredLearnProgress, lesson: LearnLesson, completed: boolean): StoredLearnProgress {
  const completedSet = new Set(progress.completed);
  const incompleteSet = new Set(progress.incomplete);

  if (completed) {
    completedSet.add(lesson.slug);
    incompleteSet.delete(lesson.slug);
  } else {
    completedSet.delete(lesson.slug);
    if (lesson.status === "Completed") {
      incompleteSet.add(lesson.slug);
    } else {
      incompleteSet.delete(lesson.slug);
    }
  }

  return {
    completed: [...completedSet],
    incomplete: [...incompleteSet],
  };
}

function getCompletedLessonSlugs(collection: LearnCollection, progress: StoredLearnProgress) {
  const completed = new Set(collection.lessons.filter((item) => item.status === "Completed").map((item) => item.slug));

  for (const slug of progress.completed) completed.add(slug);
  for (const slug of progress.incomplete) completed.delete(slug);

  return completed;
}

function applyLessonProgress(collection: LearnCollection, completedSlugs: Set<string>, currentSlug: string): LearnCollection {
  const completedCount = collection.lessons.filter((item) => completedSlugs.has(item.slug)).length;

  return {
    ...collection,
    progress: collection.progress
      ? {
          ...collection.progress,
          completed: completedCount,
          total: collection.progress.total || collection.lessons.length,
        }
      : collection.progress,
    lessons: collection.lessons.map((item) => {
      if (completedSlugs.has(item.slug)) return { ...item, status: "Completed" };
      if (item.status === "Completed") return { ...item, status: item.slug === currentSlug ? "In progress" : "Available" };
      return item;
    }),
  };
}

function isLessonLocked(lesson: LearnLesson, hasAccess: boolean) {
  return lesson.access === "full-platform" && !hasAccess;
}

function hasProAccess(account: AccountSummary | null) {
  return Boolean(account && account.plan !== "free" && (account.status === "active" || account.status === "cancelled"));
}

function getRussianPlural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const detailCopy = {
  ru: {
    breadcrumb: "Навигация по курсу",
    courses: "Курсы",
    singleLesson: "Одиночный урок",
    lessonAuthor: "Автор урока",
    authorSocials: "Соцсети автора",
    lessonsTab: "Уроки",
    timestampsTab: "Тайм-коды",
    lessonMaterials: "Материалы урока",
    lessonPrompts: "Промпты урока",
    openPrompt: "Открыть",
    copyPrompt: "Скопировать",
    copiedPrompt: "Скопировано",
    promptLoading: "Загружаем промпт...",
    promptLoadError: "Не удалось загрузить промпт. Проверьте доступ и попробуйте снова.",
    promptOpenToLoad: "Промпт загрузится после открытия.",
    promptPendingText: "Текст промпта появится после обновления материала.",
    materialPendingAction: "Скоро",
    missingFromVideoTitle: "Дополнительные материалы",
    missingFromVideoDescription: "Здесь будут ссылки, файлы или уточнения к уроку.",
    showMoreMaterials: "Показать больше",
    showLessMaterials: "Скрыть",
    showMoreDescription: "Показать ещё",
    showLessDescription: "Скрыть",
    markLessonCompleted: "Отметить как пройдено",
    lessonCompleted: "Отмечено как пройдено",
    undoCompleted: "Отменить",
    lockedLesson: "Урок заблокирован",
    lockedDescription: "Разблокируйте тариф Pro, чтобы смотреть видео и получить доступ к материалам.",
    courseLockedDescription: "Этот урок открывается после разовой покупки курса. Введите email, оплатите курс и получите ссылку для входа.",
    loadingVideo: "Открываем видео...",
    videoTokenError: "Не удалось открыть видео. Обновите страницу или войдите заново.",
    openPro: "Открыть Pro",
    signIn: "Войти",
    signInPurchased: "Уже купили",
    playLesson: "Смотреть урок",
    courseProgress: "Прогресс курса",
    progressCount: (completed: number, total: number) => `${completed} из ${total} уроков пройдено`,
    unlocksOnPro: "Разблокируется на Pro",
    unlocksAfterPurchase: "Доступ после покупки",
    paidCourseBadge: "Курс",
    courseOpenBadge: "Курс открыт",
    courseAccessOpen: "Доступ открыт",
    proActive: "Pro активен",
    proActiveDescription: "Все Pro-уроки и материалы доступны без дополнительных оплат.",
    unlockAllLessons: "Разблокируйте все уроки",
    unlockAllDescription: "Получите доступ ко всем материалам курса и Pro-урокам без ограничений.",
    unlockOnPro: "Разблокировать на Pro",
    courseLessonsCount: (count: number) => `${count} ${getRussianPlural(count, "урок", "урока", "уроков")}`,
    coursePurchaseTitle: (count: number) => `Курс из ${count} ${getRussianPlural(count, "урока", "уроков", "уроков")} про нейросети для контента`,
    courseSaleEnds: "Скидка закончится через",
    coursePromoLabel: "Промокод",
    coursePromoPlaceholder: "",
    coursePromoApply: "Применить",
    coursePromoCancel: "Отменить",
    coursePromoChecking: "Проверяем",
    coursePromoInvalid: "Промокод не найден.",
    coursePromoApplied: "Промокод применён.",
    courseClaimLabel: "Скидка по ссылке",
    courseClaimChecking: "Проверяем персональную скидку...",
    courseClaimActive: (percent: number, remaining: string) => `Скидка ${percent}% еще ${remaining}`,
    courseClaimExpired: "Скидка по ссылке истекла.",
    courseEmailLabel: "Email для доступа",
    courseEmailPlaceholder: "Ваш Email",
    courseInvalidEmail: "Введите корректный email.",
    coursePaymentError: "Не удалось открыть оплату. Попробуйте ещё раз.",
    coursePaymentOpening: "Открываем оплату...",
    courseCheckoutNote: "Оплата через YooKassa. После оплаты отправим ссылку для входа на этот email; позже можно входить обычным кодом на ту же почту.",
    courseLegalNotice: "Оплачивая, принимаете оферту и политику.",
    courseAccessLoading: "Проверяем доступ к курсу...",
    coursePaymentPending: (email: string) => `Если оплата уже прошла, письмо со ссылкой отправлено на ${email}.`,
    courseBuyButton: (price: string) => `Открыть весь курс за ${price}`,
    buyCourseShort: (price: string) => `Открыть весь курс за ${price}`,
    courseAccessActive: "Доступ к курсу активен",
    courseAccessActiveDescription: "Видео и материалы курса открыты для этого аккаунта.",
    allLessons: "Все уроки",
    watchLesson: "Смотреть урок",
  },
  en: {
    breadcrumb: "Course navigation",
    courses: "Courses",
    singleLesson: "Single lesson",
    lessonAuthor: "Lesson author",
    authorSocials: "Author socials",
    lessonsTab: "Lessons",
    timestampsTab: "Timestamps",
    lessonMaterials: "Lesson materials",
    lessonPrompts: "Lesson prompts",
    openPrompt: "Open",
    copyPrompt: "Copy",
    copiedPrompt: "Copied",
    promptLoading: "Loading prompt...",
    promptLoadError: "Could not load the prompt. Check access and try again.",
    promptOpenToLoad: "The prompt will load after opening.",
    promptPendingText: "The prompt text will appear after the material is updated.",
    materialPendingAction: "Soon",
    missingFromVideoTitle: "Additional materials",
    missingFromVideoDescription: "Links, files, or lesson notes can appear here.",
    showMoreMaterials: "Show more",
    showLessMaterials: "Show less",
    showMoreDescription: "Show more",
    showLessDescription: "Show less",
    markLessonCompleted: "Mark as completed",
    lessonCompleted: "Marked as completed",
    undoCompleted: "Undo",
    lockedLesson: "Lesson locked",
    lockedDescription: "Unlock Pro to watch this video and get access to the lesson materials.",
    courseLockedDescription: "This lesson opens after a one-time course purchase. Enter your email, pay for the course, and receive a sign-in link.",
    loadingVideo: "Opening video...",
    videoTokenError: "Could not open the video. Refresh the page or sign in again.",
    openPro: "Open Pro",
    signIn: "Sign in",
    signInPurchased: "Already bought",
    playLesson: "Play lesson",
    courseProgress: "Course progress",
    progressCount: (completed: number, total: number) => `${completed} of ${total} lessons completed`,
    unlocksOnPro: "Unlocks on Pro",
    unlocksAfterPurchase: "Access after purchase",
    paidCourseBadge: "Course",
    courseOpenBadge: "Course open",
    courseAccessOpen: "Access open",
    proActive: "Pro active",
    proActiveDescription: "All Pro lessons and materials are available without extra payments.",
    unlockAllLessons: "Unlock all lessons",
    unlockAllDescription: "Get access to every course material and Pro lesson without limits.",
    unlockOnPro: "Unlock on Pro",
    courseLessonsCount: (count: number) => `${count} ${count === 1 ? "lesson" : "lessons"}`,
    coursePurchaseTitle: (count: number) => `${count}-lesson course about AI for content`,
    courseSaleEnds: "Discount ends in",
    coursePromoLabel: "Promo code",
    coursePromoPlaceholder: "",
    coursePromoApply: "Apply",
    coursePromoCancel: "Cancel",
    coursePromoChecking: "Checking",
    coursePromoInvalid: "Promo code was not found.",
    coursePromoApplied: "Promo code applied.",
    courseClaimLabel: "Link discount",
    courseClaimChecking: "Checking personal discount...",
    courseClaimActive: (percent: number, remaining: string) => `${percent}% discount: ${remaining} left`,
    courseClaimExpired: "The link discount has expired.",
    courseEmailLabel: "Access email",
    courseEmailPlaceholder: "you@example.com",
    courseInvalidEmail: "Enter a valid email.",
    coursePaymentError: "Could not open checkout. Try again.",
    coursePaymentOpening: "Opening checkout...",
    courseCheckoutNote: "Checkout is handled by YooKassa. After payment, we send a sign-in link to this email; later you can sign in with the usual email code.",
    courseLegalNotice: "By paying, you accept terms and privacy.",
    courseAccessLoading: "Checking course access...",
    coursePaymentPending: (email: string) => `If payment has succeeded, the access email was sent to ${email}.`,
    courseBuyButton: (price: string) => `Open full course for ${price}`,
    buyCourseShort: (price: string) => `Open full course for ${price}`,
    courseAccessActive: "Course access active",
    courseAccessActiveDescription: "Course videos and materials are unlocked for this account.",
    allLessons: "All lessons",
    watchLesson: "Watch lesson",
  },
} as const;
