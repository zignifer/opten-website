import {
  Check,
  Crown,
  FileText,
  Link as LinkIcon,
  Lock,
  Play,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { useLang } from "../../../../i18n/LangContext";
import type { AccountSummary } from "../../../../lib/optenAuth";
import LocalizedLink from "../../LocalizedLink";
import ResponsiveImage from "../../ResponsiveImage";
import SiteFooter from "../../SiteFooter";
import SpaceHeader from "../SpaceHeader";
import { useSpaceAuth } from "../SpaceAuthProvider";
import type { LearnCollection, LearnLesson, LearnMaterial, LearnOverviewSection, LearnTimestamp } from "../../../../content/space/learn";
import {
  getLearnCollectionCategoryLabel,
  getLearnCollectionTitle,
  getLearnLessonAuthor,
  getLearnLessonAuthorIntro,
  getLearnLessonAuthorRole,
  getLearnLessonCategoryLabel,
  getLearnLessonDescription,
  getLearnLessonMaterials,
  getLearnLessonTimestamps,
  getLearnLessonTitle,
  getLearnLessonVideoProvider,
  getLessonPosition,
  getLearnAuthorName,
} from "../../../../content/space/learn";

const LEARN_PROGRESS_STORAGE_KEY = "opten_space_learn_progress_v1";

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
      <main className="relative z-10 mx-auto max-w-[1200px] px-[32px] pb-[76px] pt-[30px] max-md:px-4 max-md:pb-[58px] max-md:pt-[22px]">
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
};

type SidebarTab = "lessons" | "timestamps";

export function LessonDetailLayout({ lesson, collection }: LessonDetailLayoutProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const { account } = useSpaceAuth();
  const hasPro = hasProAccess(account);
  const locked = isLessonLocked(lesson, hasPro);
  const isCourse = collection.kind === "course";
  const [activeTab, setActiveTab] = useState<SidebarTab>(isCourse ? "lessons" : "timestamps");
  const [startSeconds, setStartSeconds] = useState(0);
  const [playRequestId, setPlayRequestId] = useState(0);
  const [manualProgress, setManualProgress] = useState<StoredLearnProgress>(() => readStoredLearnProgress());

  useEffect(() => {
    setStartSeconds(0);
    setPlayRequestId(0);
  }, [lesson.slug]);

  const completedSlugs = useMemo(() => getCompletedLessonSlugs(collection, manualProgress), [collection, manualProgress]);
  const displayedCollection = useMemo(
    () => applyLessonProgress(collection, completedSlugs, lesson.slug),
    [collection, completedSlugs, lesson.slug],
  );
  const displayedLesson = displayedCollection.lessons.find((item) => item.slug === lesson.slug) ?? lesson;
  const lessonCompleted = completedSlugs.has(lesson.slug);

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
      <nav className="mb-[24px] flex flex-wrap items-center gap-[9px] text-[14px] text-white/68" aria-label={copy.breadcrumb}>
        <LocalizedLink to="/learn" className="text-white/68 no-underline hover:text-white">
          {copy.courses}
        </LocalizedLink>
        {isCourse && (
          <>
            <span className="text-white/28">/</span>
            <span>{getLearnCollectionTitle(collection, lang)}</span>
          </>
        )}
        <span className="text-white/28">/</span>
        <span className="font-medium text-white">{getLearnLessonTitle(lesson, lang)}</span>
      </nav>

      <section className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-[24px] max-lg:grid-cols-1">
        <div className="min-w-0">
          <LessonPlayer lesson={displayedLesson} locked={locked} startSeconds={startSeconds} playRequestId={playRequestId} />
          <LessonIntro
            lesson={displayedLesson}
            collection={displayedCollection}
            locked={locked}
            completed={lessonCompleted}
            onCompletionChange={handleLessonCompletionChange}
          />
          <LessonMaterials materials={getLearnLessonMaterials(displayedLesson, lang)} locked={locked} />
          <RelatedLessons collection={displayedCollection} currentSlug={lesson.slug} hasPro={hasPro} />
        </div>

        <aside className="flex min-w-0 flex-col gap-[16px] lg:sticky lg:top-[88px]">
          <CollectionSummaryCard lesson={displayedLesson} collection={displayedCollection} />
          <LessonSidebar
            lesson={displayedLesson}
            collection={displayedCollection}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTimestampSelect={handleTimestampSelect}
            hasPro={hasPro}
          />
          <UnlockProCard hasPro={hasPro} />
        </aside>
      </section>
    </LearnSectionWrapper>
  );
}

type LessonPlayerProps = {
  lesson: LearnLesson;
  locked: boolean;
  startSeconds: number;
  playRequestId: number;
};

function LessonPlayer({ lesson, locked, startSeconds, playRequestId }: LessonPlayerProps) {
  const { pathname } = useLocation();
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const provider = getLearnLessonVideoProvider(lesson);
  const [activated, setActivated] = useState(false);
  const localizedVideo = lesson.localizedVideo?.[lang];
  const youtubeId = localizedVideo?.youtubeId ?? lesson.youtubeId;
  const captionLanguage = localizedVideo?.captionLanguage ?? lang;
  const embedUrl = youtubeId ? getYoutubeEmbedUrl(youtubeId, lang, captionLanguage, startSeconds, activated) : "";
  const isLocalVideo = provider.provider === "local" && Boolean(lesson.localVideo);

  useEffect(() => {
    setActivated(false);
  }, [lesson.slug]);

  useEffect(() => {
    if (playRequestId > 0) setActivated(true);
  }, [playRequestId]);

  useEffect(() => {
    if (!isLocalVideo || !activated || !videoRef.current || playRequestId <= 0) return;
    videoRef.current.currentTime = startSeconds;
    void videoRef.current.play().catch(() => undefined);
  }, [activated, isLocalVideo, playRequestId, startSeconds]);

  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/12 bg-[#0e2023] shadow-[0_18px_56px_rgba(0,0,0,0.24)]"
      data-video-provider={provider.provider}
      data-provider-asset-id={provider.providerAssetId}
      data-playback-policy={provider.playbackPolicy}
    >
      <div className="relative aspect-video overflow-hidden bg-[#06191c]">
        {locked || !activated ? (
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
                    {copy.lockedDescription}
                  </p>
                  <div className="mt-[18px] flex gap-[8px] max-sm:flex-col">
                    <LocalizedLink
                      to="/pay"
                      className="flex h-[42px] flex-1 items-center justify-center rounded-[8px] bg-[#9cfb51] px-[14px] text-[14px] font-bold text-[#062013] no-underline transition hover:bg-[#8ee943]"
                    >
                      {copy.openPro}
                    </LocalizedLink>
                    <LocalizedLink
                      to={`/login?next=${encodeURIComponent(pathname)}`}
                      className="flex h-[42px] flex-1 items-center justify-center rounded-[8px] border border-[#9cfb51]/65 px-[14px] text-[14px] font-bold text-[#9cfb51] no-underline transition hover:bg-[#9cfb51]/10"
                    >
                      {copy.signIn}
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

  return (
    <section className="mt-[26px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          {position && (
            <span className="rounded-[6px] bg-[#9cfb51]/10 px-[9px] py-[5px] text-[12px] font-bold leading-none text-[#9cfb51]">
              {position}
            </span>
          )}
          <span className="rounded-[6px] bg-white/[0.05] px-[9px] py-[5px] text-[12px] font-medium leading-none text-white/56">
            {getLearnCollectionCategoryLabel(collection, lang)}
          </span>
          {locked && (
            <span className="inline-flex items-center gap-[5px] rounded-[6px] border border-[#9cfb51]/35 bg-[#9cfb51]/10 px-[9px] py-[5px] text-[12px] font-bold leading-none text-[#9cfb51]">
              <Lock size={13} />
              Pro
            </span>
          )}
        </div>
        {!locked && (
          <LessonCompletionAction
            completed={completed}
            copy={copy}
            onToggle={() => onCompletionChange(!completed)}
          />
        )}
      </div>
      <h1 className="mt-[18px] max-w-[820px] text-[30px] font-bold leading-[1.14] text-white max-md:text-[25px]">
        {getLearnLessonTitle(lesson, lang)}
      </h1>
      <p className="mt-[18px] max-w-[820px] pb-[20px] text-[14px] leading-[1.55] text-white/70">
        {getLearnLessonDescription(lesson, lang)}
      </p>
    </section>
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
      className={`inline-flex h-[30px] cursor-pointer items-center gap-[7px] rounded-[7px] border px-[10px] text-[12px] font-bold leading-none outline-none transition focus-visible:ring-2 focus-visible:ring-[#9cfb51]/65 ${
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
};

function LessonMaterials({ materials, locked }: LessonMaterialsProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];

  if (materials.length === 0) return null;

  return (
    <section className="mt-[34px] max-w-[820px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{copy.lessonMaterials}</h2>
      <div className="mt-[14px] overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]">
        {materials.map((material) => {
          const Icon = materialIcon(material.kind);
          const external = material.href.startsWith("http");
          const disabled = locked;
          const rowClass =
            "grid grid-cols-[34px_minmax(0,1fr)_104px] items-center gap-[12px] border-b border-white/8 px-[16px] py-[10px] last:border-b-0 max-sm:grid-cols-[32px_minmax(0,1fr)]";

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
                <span className="flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.04] text-[13px] font-medium text-white/32 max-sm:col-span-2">
                  Pro
                </span>
              ) : external ? (
                <a
                  href={material.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.06] text-[13px] font-medium text-white no-underline transition hover:bg-white/[0.1] max-sm:col-span-2"
                >
                  {material.actionLabel}
                </a>
              ) : (
                <LocalizedLink
                  to={material.href}
                  className="flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.06] text-[13px] font-medium text-white no-underline transition hover:bg-white/[0.1] max-sm:col-span-2"
                >
                  {material.actionLabel}
                </LocalizedLink>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function materialIcon(kind: LearnMaterial["kind"]) {
  if (kind === "pdf") return FileText;
  if (kind === "video") return Video;
  return LinkIcon;
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
  const percent = progress ? Math.round((progress.completed / progress.total) * 100) : 0;
  const isStandalone = collection.kind === "standalone";

  return (
    <section className="rounded-[8px] border border-white/10 bg-[#0e2023]/92 px-[20px] py-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
      <p className="text-[13px] font-medium leading-tight text-white/42">{isStandalone ? copy.singleLesson : getLearnCollectionCategoryLabel(collection, lang)}</p>
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
      {progress && (
        <div className="mt-[22px] border-t border-white/8 pt-[18px]">
          <div className="flex items-center justify-between gap-[12px]">
            <span className="text-[13px] font-medium text-white/72">{copy.courseProgress}</span>
            <span className="text-[13px] font-bold text-[#9cfb51]">{percent}%</span>
          </div>
          <div className="mt-[12px] h-[5px] overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-[#9cfb51]" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-[8px] text-right text-[12px] leading-tight text-white/44">
            {copy.progressCount(progress.completed, progress.total)}
          </p>
        </div>
      )}
    </section>
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
  hasPro: boolean;
};

function LessonSidebar({ lesson, collection, activeTab, onTabChange, onTimestampSelect, hasPro }: LessonSidebarProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const isCourse = collection.kind === "course";
  const timestampsActive = activeTab === "timestamps";

  return (
    <section className={`overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]/92 ${timestampsActive ? "max-md:hidden" : ""}`}>
      <div className="flex h-[52px] items-end border-b border-white/8 px-[16px]">
        {isCourse && (
          <button
            type="button"
            onClick={() => onTabChange("lessons")}
            className={`relative h-[52px] min-w-[92px] cursor-pointer border-0 bg-transparent px-[10px] text-[14px] font-bold transition ${
              activeTab === "lessons" ? "text-white" : "text-white/58 hover:text-white"
            }`}
          >
            {copy.lessonsTab}
            {activeTab === "lessons" && <span className="absolute inset-x-[10px] bottom-0 h-[2px] rounded-full bg-[#9cfb51]" />}
          </button>
        )}
        <button
          type="button"
          onClick={() => onTabChange("timestamps")}
          className={`relative h-[52px] min-w-[116px] cursor-pointer border-0 bg-transparent px-[10px] text-[14px] font-bold transition max-md:hidden ${
            activeTab === "timestamps" ? "text-white" : "text-white/58 hover:text-white"
          }`}
        >
          {copy.timestampsTab}
          {activeTab === "timestamps" && <span className="absolute inset-x-[10px] bottom-0 h-[2px] rounded-full bg-[#9cfb51]" />}
        </button>
      </div>

      {activeTab === "lessons" && isCourse ? (
        <CourseOutline collection={collection} currentSlug={lesson.slug} hasPro={hasPro} />
      ) : (
        <TimestampList timestamps={getLearnLessonTimestamps(lesson, lang)} onSelect={onTimestampSelect} />
      )}
    </section>
  );
}

type CourseOutlineProps = {
  collection: LearnCollection;
  currentSlug: string;
  hasPro: boolean;
  className?: string;
};

export function CourseOutline({ collection, currentSlug, hasPro, className = "" }: CourseOutlineProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];

  return (
    <div className={`max-h-[720px] space-y-[2px] overflow-y-auto p-[8px] ${className}`}>
      {collection.lessons.map((outlineLesson, index) => {
        const current = outlineLesson.slug === currentSlug;
        const locked = isLessonLocked(outlineLesson, hasPro);
        return (
          <LocalizedLink
            key={outlineLesson.slug}
            to={getLessonHref(collection, outlineLesson.slug, lang)}
            aria-current={current ? "page" : undefined}
            className={`group grid grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-[10px] rounded-[8px] px-[10px] py-[11px] no-underline transition ${
              current
                ? "bg-[#9cfb51]/10 text-white"
                : locked
                  ? "bg-white/[0.035] text-white/68 hover:bg-white/[0.055] hover:text-white"
                  : "text-white/76 hover:bg-white/[0.045] hover:text-white"
            }`}
          >
            <span className={`text-center text-[14px] font-bold leading-none ${current ? "text-[#9cfb51]" : "text-white/48"}`}>
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className={`block text-[14px] font-bold leading-[1.35] ${current ? "text-white" : ""}`}>
                {getLearnLessonTitle(outlineLesson, lang)}
              </span>
              <span className="mt-[4px] block text-[12px] leading-tight text-white/44">
                {locked ? <span className="text-[#9cfb51]">{copy.unlocksOnPro}</span> : outlineLesson.duration}
              </span>
            </span>
            <LessonStatusDot lesson={outlineLesson} current={current} />
          </LocalizedLink>
        );
      })}
    </div>
  );
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
            <span className="mt-[4px] block text-[12px] leading-[1.35] text-white/48">{timestamp.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
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
  hasPro: boolean;
};

function RelatedLessons({ collection, currentSlug, hasPro }: RelatedLessonsProps) {
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
          const locked = isLessonLocked(item, hasPro);
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
                  className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.035]"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.04),rgba(1,16,18,0.36))]" />
                <span
                  className={`absolute left-1/2 top-1/2 grid size-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${
                    locked ? "bg-white/10 text-white/72" : "bg-[#9cfb51] text-[#011417] shadow-[0_14px_38px_rgba(156,251,81,0.22)]"
                  }`}
                >
                  {locked ? <Lock size={21} /> : <Play size={22} fill="currentColor" className="ml-[2px]" />}
                </span>
                <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/72 px-[6px] py-[4px] text-[13px] font-medium leading-none text-white">
                  {item.duration}
                </span>
              </div>
              <div className="px-[14px] pb-[18px] pt-[13px]">
                <p className="text-[12px] leading-none text-white/38">{getLearnLessonCategoryLabel(item, lang)}</p>
                <h3 className="mt-[9px] min-h-[48px] text-[18px] font-bold leading-[1.3] text-white">
                  {getLearnLessonTitle(item, lang)}
                </h3>
                <p className="mt-[14px] text-[13px] font-medium text-[#9cfb51]">
                  {locked ? copy.unlocksOnPro : copy.watchLesson}
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

function isLessonLocked(lesson: LearnLesson, hasPro: boolean) {
  return lesson.access === "full-platform" && !hasPro;
}

function hasProAccess(account: AccountSummary | null) {
  return Boolean(account && account.plan !== "free" && (account.status === "active" || account.status === "cancelled"));
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
    markLessonCompleted: "Отметить как изучено",
    lessonCompleted: "Урок изучен",
    undoCompleted: "Отменить",
    lockedLesson: "Урок заблокирован",
    lockedDescription: "Разблокируйте тариф Pro, чтобы смотреть видео и получить доступ к материалам.",
    openPro: "Открыть Pro",
    signIn: "Войти",
    playLesson: "Смотреть урок",
    courseProgress: "Прогресс курса",
    progressCount: (completed: number, total: number) => `${completed} из ${total} уроков`,
    unlocksOnPro: "Разблокируется на Pro",
    proActive: "Pro активен",
    proActiveDescription: "Все Pro-уроки и материалы доступны без дополнительных оплат.",
    unlockAllLessons: "Разблокируйте все уроки",
    unlockAllDescription: "Получите доступ ко всем материалам курса и Pro-урокам без ограничений.",
    unlockOnPro: "Разблокировать на Pro",
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
    markLessonCompleted: "Mark as learned",
    lessonCompleted: "Lesson learned",
    undoCompleted: "Undo",
    lockedLesson: "Lesson locked",
    lockedDescription: "Unlock Pro to watch this video and get access to the lesson materials.",
    openPro: "Open Pro",
    signIn: "Sign in",
    playLesson: "Play lesson",
    courseProgress: "Course progress",
    progressCount: (completed: number, total: number) => `${completed} of ${total} lessons`,
    unlocksOnPro: "Unlocks on Pro",
    proActive: "Pro active",
    proActiveDescription: "All Pro lessons and materials are available without extra payments.",
    unlockAllLessons: "Unlock all lessons",
    unlockAllDescription: "Get access to every course material and Pro lesson without limits.",
    unlockOnPro: "Unlock on Pro",
    allLessons: "All lessons",
    watchLesson: "Watch lesson",
  },
} as const;
