import {
  Check,
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
  isCourseTestPromoCode,
  isValidCourseEmail,
  isValidCoursePromoCode,
  normalizeCourseEmail,
  normalizeCoursePromoCode,
  quoteCoursePayment,
} from "../../../../lib/courseAccess";
import { useCurrencyPreference } from "../../../../lib/currency";
import { ensurePaddle } from "../../../../lib/paddle";
import LocalizedLink from "../../LocalizedLink";
import ResponsiveImage from "../../ResponsiveImage";
import SiteFooter from "../../SiteFooter";
import SpaceHeader from "../SpaceHeader";
import { useSpaceAuth } from "../SpaceAuthProvider";
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
  const { account, session, status: authStatus } = useSpaceAuth();
  const hasPro = hasProAccess(account);
  const purchase = collection.purchase;
  const courseAccess = useCourseAccess(purchase, session?.access_token ?? null);
  const lessonAccessGranted = purchase ? courseAccess.hasAccess : hasPro;
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
  const courseMobileOrder = (order: 1 | 2 | 3 | 4) => {
    if (!isCourse) return "";
    if (order === 1) return "max-lg:order-1";
    if (order === 2) return "max-lg:order-2";
    if (order === 3) return "max-lg:order-3";
    return "max-lg:order-4";
  };

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
            <span className="max-md:hidden">{getLearnCollectionTitle(collection, lang)}</span>
            <span className="hidden max-md:inline">...</span>
          </>
        )}
        <span className="text-white/28">/</span>
        <span className="font-medium text-white">{getLearnLessonTitle(lesson, lang)}</span>
      </nav>

      <section className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-[24px] max-lg:grid-cols-1">
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
          <div className={courseMobileOrder(3)}>
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
            <RelatedLessons collection={displayedCollection} currentSlug={lesson.slug} hasAccess={lessonAccessGranted} purchase={purchase} />
          </div>
        </div>

        <aside className={`flex min-w-0 flex-col gap-[16px] lg:sticky lg:top-[88px] ${courseMobileContentsClass}`}>
          {purchase ? (
            courseAccess.hasAccess ? (
              <>
                <div className={`min-w-0 ${courseMobileOrder(2)}`}>
                  <CollectionSummaryCard lesson={displayedLesson} collection={displayedCollection} />
                </div>
                <div className={`min-w-0 ${courseMobileOrder(4)}`}>
                  <LessonSidebar
                    lesson={displayedLesson}
                    collection={displayedCollection}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onTimestampSelect={handleTimestampSelect}
                    hasAccess={lessonAccessGranted}
                    purchase={purchase}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={`min-w-0 ${courseMobileOrder(2)}`}>
                  <CoursePurchaseCard
                    collection={displayedCollection}
                    purchase={purchase}
                    hasAccess={courseAccess.hasAccess}
                    loadingAccess={courseAccess.loading || authStatus === "loading"}
                    initialEmail={session?.user.email ?? account?.email ?? ""}
                    playerHeight={playerHeight}
                  />
                </div>
                <div className={`min-w-0 ${courseMobileOrder(4)}`}>
                  <LessonSidebar
                    lesson={displayedLesson}
                    collection={displayedCollection}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onTimestampSelect={handleTimestampSelect}
                    hasAccess={lessonAccessGranted}
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
                hasAccess={lessonAccessGranted}
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

type LessonPlayerProps = {
  lesson: LearnLesson;
  collectionId: string;
  locked: boolean;
  purchase?: LearnCoursePurchase;
  startSeconds: number;
  playRequestId: number;
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

function LessonPlayer({ lesson, collectionId, locked, purchase, startSeconds, playRequestId }: LessonPlayerProps) {
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
    if (!accessToken) {
      setKinescopeError("missing_session");
      return;
    }

    let cancelled = false;
    setKinescopeLoading(true);
    setKinescopeError(null);

    fetch("/api/kinescope-course-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseSlug: collectionId,
        lessonSlug: lesson.slug,
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
  }, [activated, collectionId, isKinescopeVideo, kinescopeEmbedUrl, lesson.slug, locked, session?.access_token]);

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
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid size-[104px] place-items-center rounded-full bg-white/10 text-white/72">
                <Lock size={42} />
              </span>
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

  return (
    <section className="mt-[26px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
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
            <span className="inline-flex items-center gap-[5px] rounded-[6px] border border-[#9cfb51]/35 bg-[#9cfb51]/10 px-[9px] py-[5px] text-[12px] font-bold leading-none text-[#9cfb51]">
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
  purchase?: LearnCoursePurchase;
};

function LessonMaterials({ materials, locked, purchase }: LessonMaterialsProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const [expanded, setExpanded] = useState(false);

  if (materials.length === 0) return null;
  const canCollapseOnMobile = materials.length > 1;

  return (
    <section className="mt-[34px] max-w-[820px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{copy.lessonMaterials}</h2>
      <div className="mt-[14px] overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]">
        {materials.map((material, index) => {
          const Icon = materialIcon(material.kind);
          const external = material.href.startsWith("http");
          const staticAsset = material.href.startsWith("/assets/");
          const pending = material.status === "pending";
          const disabled = locked || pending;
          const actionLabel = pending ? copy.materialPendingAction : material.actionLabel;
          const rowClass =
            `grid grid-cols-[34px_minmax(0,1fr)_154px] items-center gap-[12px] border-b border-white/8 px-[16px] py-[10px] last:border-b-0 max-sm:grid-cols-[32px_minmax(0,1fr)] ${
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
                <span className={`flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.04] text-[13px] font-medium max-sm:col-span-2 ${pending ? "text-[#9cfb51]/58" : "text-white/32"}`}>
                  {pending ? actionLabel : purchase ? copy.unlocksAfterPurchase : "Pro"}
                </span>
              ) : external || staticAsset ? (
                <a
                  href={material.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  download={material.href.endsWith(".zip") ? "" : undefined}
                  className="flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.06] text-[13px] font-medium text-white no-underline transition hover:bg-white/[0.1] max-sm:col-span-2"
                >
                  {actionLabel}
                </a>
              ) : (
                <LocalizedLink
                  to={material.href}
                  className="flex h-[36px] items-center justify-center rounded-[7px] bg-white/[0.06] text-[13px] font-medium text-white no-underline transition hover:bg-white/[0.1] max-sm:col-span-2"
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
            className="hidden h-[52px] w-full cursor-pointer items-center justify-center border-0 border-t border-white/8 bg-transparent px-[16px] text-[14px] font-bold text-white/82 transition hover:bg-white/[0.035] hover:text-white max-md:flex"
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
    <section className="mt-[34px] max-w-[820px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{copy.lessonPrompts}</h2>
      <div className="mt-[14px] space-y-[10px]">
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
              <summary className="flex cursor-pointer list-none items-center justify-between gap-[14px] px-[16px] py-[14px] marker:hidden">
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
  const eyebrow = collection.purchase
    ? copy.courseAccessOpen
    : isStandalone
      ? copy.singleLesson
      : getLearnCollectionCategoryLabel(collection, lang);

  return (
    <section className="rounded-[8px] border border-white/10 bg-[#0e2023]/92 px-[20px] py-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
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
  hasAccess: boolean;
  purchase?: LearnCoursePurchase;
};

function LessonSidebar({ lesson, collection, activeTab, onTabChange, onTimestampSelect, hasAccess, purchase }: LessonSidebarProps) {
  const { lang } = useLang();
  const copy = detailCopy[lang];
  const isCourse = collection.kind === "course";

  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]/92">
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
          className={`relative h-[52px] min-w-[116px] cursor-pointer border-0 bg-transparent px-[10px] text-[14px] font-bold transition ${
            activeTab === "timestamps" ? "text-white" : "text-white/58 hover:text-white"
          }`}
        >
          {copy.timestampsTab}
          {activeTab === "timestamps" && <span className="absolute inset-x-[10px] bottom-0 h-[2px] rounded-full bg-[#9cfb51]" />}
        </button>
      </div>

      {activeTab === "lessons" && isCourse ? (
        <CourseOutline collection={collection} currentSlug={lesson.slug} hasAccess={hasAccess} purchase={purchase} />
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

  return (
    <div className={`max-h-[720px] space-y-[2px] overflow-y-auto p-[8px] ${className}`}>
      {collection.lessons.map((outlineLesson, index) => {
        const current = outlineLesson.slug === currentSlug;
        const locked = isLessonLocked(outlineLesson, hasAccess);
        const metaLabel = outlineLesson.duration;
        return (
          <LocalizedLink
            key={outlineLesson.slug}
            to={getLessonHref(collection, outlineLesson.slug, lang)}
            aria-current={current ? "page" : undefined}
            className={`group grid grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-[10px] rounded-[8px] px-[10px] py-[11px] no-underline transition ${
              locked ? "min-h-[62px]" : ""
            } ${
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
                {metaLabel}
              </span>
            </span>
            {locked ? (
              <span className="grid size-[22px] place-items-center text-[#788183]">
                <Lock size={16} strokeWidth={2.25} />
              </span>
            ) : (
              <LessonStatusDot lesson={outlineLesson} current={current} />
            )}
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

function CourseSecurePaymentIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.4376 1.49524C7.31728 1.38762 7.16152 1.32812 7.0001 1.32812C6.83868 1.32812 6.68292 1.38762 6.5626 1.49524C5.37998 2.55584 3.90315 3.23231 2.3276 3.43511C2.17291 3.45499 2.03036 3.52932 1.9255 3.64476C1.82064 3.76021 1.76032 3.90923 1.75535 4.06511C1.69618 5.79831 2.1288 7.51286 3.0032 9.01049C3.87759 10.5081 5.15804 11.7277 6.69648 12.5281C6.79028 12.5769 6.89448 12.6023 7.00021 12.6021C7.10594 12.602 7.21006 12.5763 7.30373 12.5272C8.84216 11.7268 10.1226 10.5073 10.997 9.00962C11.8714 7.51198 12.304 5.79743 12.2449 4.06423C12.2397 3.90851 12.1793 3.7597 12.0744 3.64443C11.9696 3.52917 11.8271 3.45497 11.6726 3.43511C10.0971 3.23256 8.62033 2.5564 7.4376 1.49611V1.49524ZM9.4851 6.31123C9.59101 6.17419 9.63845 6.00083 9.61707 5.82895C9.5957 5.65707 9.50724 5.50061 9.37098 5.39368C9.23472 5.28675 9.06172 5.23803 8.88968 5.25813C8.71765 5.27823 8.56054 5.36552 8.4526 5.50099L6.46985 8.02361L5.45835 7.15736C5.39347 7.09795 5.3173 7.05218 5.23438 7.02279C5.15146 6.9934 5.06347 6.98098 4.97566 6.98628C4.88784 6.99157 4.80198 7.01447 4.72319 7.05361C4.6444 7.09275 4.57428 7.14733 4.51701 7.21411C4.45974 7.28089 4.41648 7.35851 4.3898 7.44234C4.36312 7.52618 4.35357 7.61452 4.36172 7.70212C4.36987 7.78972 4.39555 7.87478 4.43723 7.95226C4.47891 8.02973 4.53574 8.09804 4.60435 8.15311L6.1356 9.46561C6.20282 9.52326 6.28101 9.5667 6.36547 9.59333C6.44992 9.61996 6.53889 9.62922 6.62702 9.62055C6.71515 9.61189 6.80061 9.58547 6.87826 9.5429C6.95591 9.50034 7.02415 9.44249 7.07885 9.37286L9.4851 6.31123Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CoursePurchaseTitle({ count, compact }: { count: number; compact: boolean }) {
  const { lang } = useLang();
  const titleClass = `text-[17px] font-bold leading-[1.22] tracking-normal text-white max-sm:text-[16px] ${
    compact ? "max-w-[248px]" : "max-w-[280px]"
  }`;

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
  const [currency] = useCurrencyPreference();
  const copy = detailCopy[lang];
  const [email, setEmail] = useState(initialEmail);
  const [emailTouched, setEmailTouched] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [appliedPromoQuote, setAppliedPromoQuote] = useState<CoursePaymentResponse | null>(null);
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

  const normalizedEmail = normalizeCourseEmail(email);
  const baseSaleValue = currency === "USD" ? purchase.priceUsd : purchase.priceRub;
  const listValue = currency === "USD" ? purchase.listPriceUsd : purchase.listPriceRub;
  const quotedAmountValue = typeof appliedPromoQuote?.amount_value === "number" ? appliedPromoQuote.amount_value : null;
  const effectiveSaleValue = quotedAmountValue ?? baseSaleValue;
  const crossedValue = typeof appliedPromoQuote?.list_amount_value === "number" ? appliedPromoQuote.list_amount_value : listValue;
  const showCrossedPrice = Boolean(appliedPromoCode && appliedPromoQuote);
  const salePrice = formatCoursePrice(effectiveSaleValue, currency);
  const listPrice = formatCoursePrice(crossedValue, currency);
  const courseLessonsCount = collection.progress?.total || collection.lessons.length;
  const promoBadgeLabel = getCoursePromoBadgeLabel(appliedPromoCode, appliedPromoQuote);
  const formMessage = error
    ? { tone: "error" as const, text: error }
    : pendingPayment
      ? { tone: "muted" as const, text: copy.coursePaymentPending(pendingPayment.email) }
      : loadingAccess
        ? { tone: "muted" as const, text: copy.courseAccessLoading }
        : { tone: "secure" as const, text: copy.courseSecurePayment(currency === "USD" ? "Paddle" : "ЮКасса") };

  useEffect(() => {
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
  }, [appliedPromoCode, currency, purchase.courseSlug, copy.coursePromoApplied, copy.coursePromoInvalid]);

  const handlePromoApply = () => {
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
      const effectivePromoCode = appliedPromoCode ?? undefined;
      const result = await createCoursePayment(purchase.courseSlug, normalizedEmail, returnUrl, currency, effectivePromoCode);

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
            <CoursePurchaseTitle count={courseLessonsCount} compact={Boolean(promoBadgeLabel)} />
          </div>
          {promoBadgeLabel && (
            <span className="mt-[1px] shrink-0 rounded-[6px] bg-[#9cfb51] px-[8px] py-[5px] text-[12px] font-bold leading-none text-[#062013]">
              {promoBadgeLabel}
            </span>
          )}
        </div>

        <div className="absolute left-0 top-[74px] flex w-full items-end gap-[24px]">
          <span className="font-['Unbounded',sans-serif] text-[41px] font-bold leading-[38px] text-white max-sm:text-[40px]">{salePrice}</span>
          {showCrossedPrice && (
            <span className="text-[24px] font-bold leading-[19px] text-white/36 line-through max-sm:text-[22px]">{listPrice}</span>
          )}
        </div>

        <div className="absolute left-0 top-[129px] h-[62px] w-full">
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
                    : formMessage.tone === "secure"
                      ? "text-[#9cfb51]/60"
                      : "text-white/45"
                }`}
              >
                {formMessage.tone === "secure" && <CourseSecurePaymentIcon className="size-[14px] shrink-0" />}
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

function getCoursePromoBadgeLabel(promoCode: string | null, quote: CoursePaymentResponse | null) {
  if (!promoCode || !quote) return null;
  if (isCourseTestPromoCode(promoCode)) return "FREE";
  const promoPercent = typeof quote.promo_discount_percent === "number" ? quote.promo_discount_percent : null;
  if (promoPercent && promoPercent > 0 && promoPercent < 100) return `-${Math.round(promoPercent)}%`;
  const fallbackPercent = typeof quote.discount_percent === "number" ? quote.discount_percent : null;
  if (fallbackPercent && fallbackPercent > 0 && fallbackPercent < 100) return `-${Math.round(fallbackPercent)}%`;
  return null;
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
                  {getLearnLessonTitle(item, lang)}
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
    promptPendingText: "Точный текст нужно добрать из видео или загрузить отдельным файлом.",
    materialPendingAction: "Нужно добавить",
    missingFromVideoTitle: "Нужно добрать из видео",
    missingFromVideoDescription: "Поля уже заведены. Когда будет ссылка, скриншот, файл или точный текст, сюда можно просто подставить готовый материал.",
    showMoreMaterials: "Показать больше",
    showLessMaterials: "Скрыть",
    markLessonCompleted: "Отметить как изучено",
    lessonCompleted: "Урок изучен",
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
    progressCount: (completed: number, total: number) => `${completed} из ${total} уроков`,
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
    courseEmailLabel: "Email для доступа",
    courseEmailPlaceholder: "Ваш Email",
    courseInvalidEmail: "Введите корректный email.",
    coursePaymentError: "Не удалось открыть оплату. Попробуйте ещё раз.",
    coursePaymentOpening: "Открываем оплату...",
    courseCheckoutNote: "Оплата через YooKassa. После оплаты отправим ссылку для входа на этот email; позже можно входить обычным кодом на ту же почту.",
    courseSecurePayment: (provider: string) => `Безопасные платежи через ${provider}`,
    courseAccessLoading: "Проверяем доступ к курсу...",
    coursePaymentPending: (email: string) => `Если оплата уже прошла, письмо со ссылкой отправлено на ${email}.`,
    courseBuyButton: (price: string) => `Купить за ${price}`,
    buyCourseShort: (price: string) => `Купить за ${price}`,
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
    promptPendingText: "The exact text needs to be captured from the video or uploaded as a separate file.",
    materialPendingAction: "Need to add",
    missingFromVideoTitle: "Need to capture from video",
    missingFromVideoDescription: "The fields are already prepared. Once a link, screenshot, file, or exact text is available, it can be dropped in here.",
    showMoreMaterials: "Show more",
    showLessMaterials: "Show less",
    markLessonCompleted: "Mark as learned",
    lessonCompleted: "Lesson learned",
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
    progressCount: (completed: number, total: number) => `${completed} of ${total} lessons`,
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
    courseEmailLabel: "Access email",
    courseEmailPlaceholder: "you@example.com",
    courseInvalidEmail: "Enter a valid email.",
    coursePaymentError: "Could not open checkout. Try again.",
    coursePaymentOpening: "Opening checkout...",
    courseCheckoutNote: "Checkout is handled by YooKassa. After payment, we send a sign-in link to this email; later you can sign in with the usual email code.",
    courseSecurePayment: (provider: string) => `Secure payments via ${provider}`,
    courseAccessLoading: "Checking course access...",
    coursePaymentPending: (email: string) => `If payment has succeeded, the access email was sent to ${email}.`,
    courseBuyButton: (price: string) => `Buy for ${price}`,
    buyCourseShort: (price: string) => `Buy for ${price}`,
    courseAccessActive: "Course access active",
    courseAccessActiveDescription: "Course videos and materials are unlocked for this account.",
    allLessons: "All lessons",
    watchLesson: "Watch lesson",
  },
} as const;
