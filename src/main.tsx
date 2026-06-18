
  import { createRoot, hydrateRoot } from "react-dom/client";
  import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";
  import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router";
  import App from "./app/App.tsx";
  import PrivacyPage from "./app/pages/PrivacyPage.tsx";
  import TermsPage from "./app/pages/TermsPage.tsx";
  import RefundPage from "./app/pages/RefundPage.tsx";
  import WelcomePage from "./app/pages/WelcomePage.tsx";
  import PayPage from "./app/pages/PayPage.tsx";
  import AboutPage from "./app/pages/AboutPage.tsx";
  // Phase 5 B-07: GuidePage retired — /guides/* redirects to /blog/* via vercel.json.
  import BlogListPage from "./app/pages/BlogListPage.tsx";
  import BlogPostPage from "./app/pages/BlogPostPage.tsx";
  // Phase v2.0 MODELS-A-8: programmatic model pages.
  import ModelsHubPage from "./app/pages/ModelsHubPage.tsx";
  import ModelPage from "./app/pages/ModelPage.tsx";
  import NotFound from "./app/pages/NotFound.tsx";
  import "./styles/index.css";
  import { LangProvider } from "./i18n/LangContext";
  import { RouteLoading } from "./app/components/RouteLoading";
  import ScrollToTop from "./app/components/ScrollToTop";
  import AnnouncementBar from "./app/components/AnnouncementBar";
  import { SpaceAuthProvider } from "./app/components/space/SpaceAuthProvider.tsx";

  // Phase 4 D-12: PayPage is now eager (SSR-prerendered body) — the lazy block below covers only
  // SuccessPage / AccountPage / DownloadSkillPage which remain SPA-only.
  // renderToString in entry-server.tsx cannot resolve React.lazy() — only routes that never
  // enter the hydrateRoot path are safe to lazy-load (RESEARCH.md "Suspense + hydrateRoot at
  // Route Level" lines 329–363). Phase 2 hotfix 80b16be is the precedent.
  const SuccessPage = lazy(() => import("./app/pages/SuccessPage.tsx"));
  const AccountPage = lazy(() => import("./app/pages/AccountPage.tsx"));
  const DownloadSkillPage = lazy(() => import("./app/pages/DownloadSkillPage.tsx"));
  const PromptLibraryPage = lazy(() => import("./app/pages/PromptLibraryPage.tsx"));
  const PromptLibraryDemoPage = lazy(() => import("./app/pages/PromptLibraryDemoPage.tsx"));
  const PublicPromptLibraryPage = lazy(() => import("./app/pages/PublicPromptLibraryPage.tsx"));
  const AppIndexPage = lazy(() => import("./app/pages/space/AppIndexPage.tsx"));
  const AppLoginPage = lazy(() => import("./app/pages/space/AppLoginPage.tsx"));
  const AppAuthCallbackPage = lazy(() => import("./app/pages/space/AppAuthCallbackPage.tsx"));
  const LearnOverviewPage = lazy(() => import("./app/pages/space/LearnOverviewPage.tsx"));
  const LessonDetailPage = lazy(() => import("./app/pages/space/LessonDetailPage.tsx"));
  const LearnFindDetailPage = lazy(() => import("./app/pages/space/LearnFindDetailPage.tsx"));
  const LearnTemplatePage = lazy(() => import("./app/pages/space/LearnTemplatePage.tsx"));
  const PrivateCoursePage = lazy(() => import("./app/pages/space/PrivateCoursePage.tsx"));
  // Phase 2.2: Paddle bootstrap moved to src/lib/paddle.ts.
  // /pay/index.html still gets the sync <script> tag via prerender.mjs — direct hits
  // have window.Paddle ready before PayPage mounts. Non-pay routes skip the SDK
  // entirely; SPA-navigation to /pay (click from landing) triggers async load via
  // ensurePaddle() inside PayPage. Integration Contract §6 preserved on /pay.

  // === Hydration detector — Phase 2 D-06 (GEO-B-2) ===
  // Two signals must agree for hydrateRoot to be safe:
  //   (1) <div id="root"> has prerendered children (Vite minifies an empty root with no
  //       whitespace, so hasChildNodes() reliably discriminates — RESEARCH.md Pitfall 3).
  //   (2) The prerendered HTML was generated for THIS path. Vercel's SPA rewrite
  //       (/((?!api/).*) → /index.html) serves dist/index.html (prerendered for "/") at
  //       any uncovered route — /account, /success, /dashboard/* etc. — so the children
  //       of #root look hydratable but describe the wrong route. The prerender script
  //       writes window.__PRERENDER_PATH per emitted file; if it doesn't match
  //       window.location.pathname, we are in SPA-fallback territory and must wipe the
  //       stale tree and createRoot. Without this check, React #418/#423 fires on every
  //       extension deep-link load (DownloadSkillPage / AccountPage / SuccessPage).
  // Paddle bootstrap is now lazy (src/lib/paddle.ts, called by PayPage on mount) —
  // ordering against this hydration block is irrelevant since Paddle is only consumed on /pay.

  // Phase 3 D-05: LangProvider uses useLocation() to derive initial lang from URL prefix.
  // useLocation() requires a Router context — LangProvider must be INSIDE BrowserRouter, not outside.
  const CHUNK_RELOAD_STORAGE_KEY = "opten_chunk_reload_v1";
  const CHUNK_RELOAD_COOLDOWN_MS = 30_000;
  const CHUNK_ERROR_PATTERN =
    /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk \d+ failed|Unable to preload CSS/i;

  function isChunkLoadError(error: unknown): boolean {
    const message = error instanceof Error ? `${error.name} ${error.message}` : String(error || "");
    return CHUNK_ERROR_PATTERN.test(message);
  }

  function reloadOnceAfterChunkError(): boolean {
    const reloadKey = `${window.location.pathname}${window.location.search}`;
    try {
      const previous = JSON.parse(window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY) || "null") as {
        key?: string;
        at?: number;
      } | null;
      if (previous?.key === reloadKey && previous.at && Date.now() - previous.at < CHUNK_RELOAD_COOLDOWN_MS) {
        return false;
      }
      window.sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, JSON.stringify({ key: reloadKey, at: Date.now() }));
    } catch {
      // If sessionStorage is blocked, a single reload is still the safest recovery path.
    }
    window.location.reload();
    return true;
  }

  function registerChunkReloadHandler() {
    const chunkWindow = window as typeof window & { __optenChunkReloadHandlerInstalled?: boolean };
    if (chunkWindow.__optenChunkReloadHandlerInstalled) return;
    chunkWindow.__optenChunkReloadHandlerInstalled = true;

    window.addEventListener("vite:preloadError", (event) => {
      const preloadEvent = event as Event & { payload?: unknown };
      if (!isChunkLoadError(preloadEvent.payload)) return;
      event.preventDefault();
      reloadOnceAfterChunkError();
    });

    window.addEventListener("unhandledrejection", (event) => {
      if (!isChunkLoadError(event.reason)) return;
      if (reloadOnceAfterChunkError()) event.preventDefault();
    });
  }

  function LegacyLearnLessonRedirect() {
    const { lessonSlug } = useParams();
    return <Navigate to={lessonSlug ? `/learn/${lessonSlug}` : "/learn"} replace />;
  }

  type ChunkReloadBoundaryState = {
    error: "chunk" | "app" | null;
  };

  class ChunkReloadBoundary extends Component<{ children: ReactNode }, ChunkReloadBoundaryState> {
    state: ChunkReloadBoundaryState = { error: null };

    static getDerivedStateFromError(error: unknown): ChunkReloadBoundaryState {
      return { error: isChunkLoadError(error) ? "chunk" : "app" };
    }

    componentDidCatch(error: unknown, info: ErrorInfo) {
      if (isChunkLoadError(error)) {
        if (!reloadOnceAfterChunkError()) {
          console.error("[Opten] lazy chunk failed after a reload attempt", error, info);
        }
        return;
      }
      console.error("[Opten] uncaught route error", error, info);
    }

    render() {
      if (!this.state.error) return this.props.children;

      const isChunk = this.state.error === "chunk";
      return (
        <div className="grid min-h-screen place-items-center bg-[#011417] px-4 font-['PT_Root_UI',sans-serif] text-white">
          <section className="w-full max-w-[420px] rounded-[8px] border border-white/10 bg-white/[0.045] p-[24px] text-center">
            <h1 className="text-[24px] font-bold leading-tight">
              {isChunk ? "Нужно обновить страницу" : "Что-то пошло не так"}
            </h1>
            <p className="mt-[10px] text-[14px] leading-[1.5] text-white/68">
              {isChunk
                ? "Загружается новая версия Opten. Обновите страницу, если она не обновилась автоматически."
                : "Обновите страницу и попробуйте снова."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-[18px] h-[42px] cursor-pointer rounded-[8px] border-0 bg-[#9cfb51] px-[18px] text-[15px] font-bold text-[#011417]"
            >
              Обновить
            </button>
          </section>
        </div>
      );
    }
  }

  registerChunkReloadHandler();

  const tree = (
    <BrowserRouter>
      <LangProvider>
        <SpaceAuthProvider>
          <ScrollToTop />
          <AnnouncementBar />
          <ChunkReloadBoundary>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
              <Route path="/" element={<App />} />
              <Route path="/pay" element={<PayPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Phase 5 B-04 + B-05: /blog hub and bilingual post page. /guides/* retired in B-07. */}
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              {/* Phase v2.0 MODELS-A-8: programmatic model pages. Hub + per-model RU/EN. */}
              <Route path="/models" element={<ModelsHubPage />} />
              <Route path="/models/:slug" element={<ModelPage />} />
              <Route path="/dashboard/download-skill" element={<DownloadSkillPage />} />
              <Route path="/prompt-library" element={<PromptLibraryPage />} />
              <Route path="/p/:slug" element={<PublicPromptLibraryPage />} />
              <Route path="/internal/prompt-library-demo" element={<PromptLibraryDemoPage />} />
              <Route path="/login" element={<AppLoginPage />} />
              <Route path="/auth/callback" element={<AppAuthCallbackPage />} />
              <Route path="/learn" element={<LearnOverviewPage />} />
              <Route path="/learn/templates/:templateKind" element={<LearnTemplatePage />} />
              <Route path="/learn/templates/:templateKind/:templateLessonSlug" element={<LearnTemplatePage />} />
              <Route path="/learn/courses/:courseSlug" element={<PrivateCoursePage />} />
              <Route path="/learn/courses/:courseSlug/:lessonSlug" element={<PrivateCoursePage />} />
              <Route path="/learn/finds/:findSlug" element={<LearnFindDetailPage />} />
              <Route path="/learn/:lessonSlug" element={<LessonDetailPage />} />
              <Route path="/app" element={<AppIndexPage />} />
              <Route path="/app/login" element={<Navigate to="/login?next=/learn" replace />} />
              <Route path="/app/auth/callback" element={<AppAuthCallbackPage />} />
              <Route path="/app/learn" element={<Navigate to="/learn" replace />} />
              <Route path="/app/learn-v2" element={<Navigate to="/learn" replace />} />
              <Route path="/app/learn/:lessonSlug" element={<LegacyLearnLessonRedirect />} />
              <Route path="/space/learn" element={<Navigate to="/learn" replace />} />
              <Route path="/space/learn/:lessonSlug" element={<LegacyLearnLessonRedirect />} />
              {/* Phase 3 D-01/D-03b: /en/* siblings. Mirror of entry-server.tsx EN routes + /en/pay (head-only, client-mount-only). __PRERENDER_PATH discriminator (lines 65-66) handles these unchanged — meta.path strings written by applyMarker include "/en/welcome" etc. Phase 4 D-06: /en/guides/:slug bilingual anchor. */}
              <Route path="/en/"        element={<App />} />
              <Route path="/en/pay"     element={<PayPage />} />
              <Route path="/en/welcome" element={<WelcomePage />} />
              <Route path="/en/privacy" element={<PrivacyPage />} />
              <Route path="/en/terms"   element={<TermsPage />} />
              <Route path="/en/refund"  element={<RefundPage />} />
              <Route path="/en/about"   element={<AboutPage />} /> {/* Phase 4.1 B-03: EN sibling for /about */}
              <Route path="/en/blog" element={<BlogListPage />} />
              <Route path="/en/blog/:slug" element={<BlogPostPage />} />
              <Route path="/en/models" element={<ModelsHubPage />} />
              <Route path="/en/models/:slug" element={<ModelPage />} />
              <Route path="/en/learn" element={<LearnOverviewPage />} />
              <Route path="/en/learn/templates/:templateKind" element={<LearnTemplatePage />} />
              <Route path="/en/learn/templates/:templateKind/:templateLessonSlug" element={<LearnTemplatePage />} />
              <Route path="/en/learn/finds/:findSlug" element={<LearnFindDetailPage />} />
              <Route path="/en/learn/:lessonSlug" element={<LessonDetailPage />} />
              {/* Phase 4.2 / Wave 3 (P1-1): catch-all 404. MUST be LAST — React Router 7 matches in declaration order, so any earlier `*` would shadow specific routes. NotFound injects <meta name="robots" content="noindex,nofollow"> at runtime to stop search engines from indexing typo'd URLs as duplicates of the landing. Status code stays 200 (Vercel SPA rewrite is unchanged; HTTP 404 is deferred to Phase 6 per CONTEXT D-3). */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ChunkReloadBoundary>
        </SpaceAuthProvider>
      </LangProvider>
    </BrowserRouter>
  );

  const root = document.getElementById("root")!;
  const prerenderPath = (window as unknown as { __PRERENDER_PATH?: string }).__PRERENDER_PATH;
  const pathMatches = prerenderPath !== undefined && prerenderPath === window.location.pathname;
  if (root.hasChildNodes() && pathMatches) {
    hydrateRoot(root, tree);
  } else {
    if (root.hasChildNodes()) root.innerHTML = "";
    createRoot(root).render(tree);
  }
