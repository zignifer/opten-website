
  import { createRoot, hydrateRoot } from "react-dom/client";
  import { lazy, Suspense } from "react";
  import { BrowserRouter, Routes, Route } from "react-router";
  import App from "./app/App.tsx";
  import PrivacyPage from "./app/pages/PrivacyPage.tsx";
  import TermsPage from "./app/pages/TermsPage.tsx";
  import RefundPage from "./app/pages/RefundPage.tsx";
  import WelcomePage from "./app/pages/WelcomePage.tsx";
  import PayPage from "./app/pages/PayPage.tsx";
  import AboutPage from "./app/pages/AboutPage.tsx";
  import "./styles/index.css";
  import { LangProvider } from "./i18n/LangContext";
  import { RouteLoading } from "./app/components/RouteLoading";

  // Phase 4 D-12: PayPage is now eager (SSR-prerendered body) — the lazy block below covers only
  // SuccessPage / AccountPage / DownloadSkillPage which remain SPA-only.
  // renderToString in entry-server.tsx cannot resolve React.lazy() — only routes that never
  // enter the hydrateRoot path are safe to lazy-load (RESEARCH.md "Suspense + hydrateRoot at
  // Route Level" lines 329–363). Phase 2 hotfix 80b16be is the precedent.
  const SuccessPage = lazy(() => import("./app/pages/SuccessPage.tsx"));
  const AccountPage = lazy(() => import("./app/pages/AccountPage.tsx"));
  const DownloadSkillPage = lazy(() => import("./app/pages/DownloadSkillPage.tsx"));

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
  const tree = (
    <BrowserRouter>
      <LangProvider>
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
            <Route path="/dashboard/download-skill" element={<DownloadSkillPage />} />
            {/* Phase 3 D-01/D-03b: /en/* siblings. Mirror of entry-server.tsx EN routes + /en/pay (head-only, client-mount-only). __PRERENDER_PATH discriminator (lines 65-66) handles these unchanged — meta.path strings written by applyMarker include "/en/welcome" etc. */}
            <Route path="/en/"        element={<App />} />
            <Route path="/en/pay"     element={<PayPage />} />
            <Route path="/en/welcome" element={<WelcomePage />} />
            <Route path="/en/privacy" element={<PrivacyPage />} />
            <Route path="/en/terms"   element={<TermsPage />} />
            <Route path="/en/refund"  element={<RefundPage />} />
          </Routes>
        </Suspense>
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
