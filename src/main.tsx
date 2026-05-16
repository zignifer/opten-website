
  import { createRoot, hydrateRoot } from "react-dom/client";
  import { lazy, Suspense } from "react";
  import { BrowserRouter, Routes, Route } from "react-router";
  import App from "./app/App.tsx";
  import PrivacyPage from "./app/pages/PrivacyPage.tsx";
  import TermsPage from "./app/pages/TermsPage.tsx";
  import RefundPage from "./app/pages/RefundPage.tsx";
  import WelcomePage from "./app/pages/WelcomePage.tsx";
  import "./styles/index.css";
  import { LangProvider } from "./i18n/LangContext";
  import { RouteLoading } from "./app/components/RouteLoading";

  // Phase 2.1 D-01: SPA-fallback routes only — NEVER add App/Welcome/Privacy/Terms/Refund here.
  // renderToString in entry-server.tsx cannot resolve React.lazy() — only routes that never
  // enter the hydrateRoot path are safe to lazy-load (RESEARCH.md "Suspense + hydrateRoot at
  // Route Level" lines 329–363). Phase 2 hotfix 80b16be is the precedent.
  const PayPage = lazy(() => import("./app/pages/PayPage.tsx"));
  const SuccessPage = lazy(() => import("./app/pages/SuccessPage.tsx"));
  const AccountPage = lazy(() => import("./app/pages/AccountPage.tsx"));
  const DownloadSkillPage = lazy(() => import("./app/pages/DownloadSkillPage.tsx"));

  // === Paddle.js v2 SDK bootstrap — Phase 66 D-14 (FE-05), Phase 67 fix ===
  // Environment.set MUST come before Initialize (Pitfall #4 — ordering contract).
  // Guarded by `if (window.Paddle)`: sync script tag in index.html normally guarantees it,
  // but adblock / CSP / network failure can leave it undefined (Pitfall #2).
  //
  // Phase 67 / BG-67-01: Paddle v2 SDK Environment.set() only accepts 'sandbox' —
  // passing 'production' throws `Cannot read properties of undefined (reading
  // 'profitwellSnippetBase')` because production is the default and lacks a lookup
  // entry. Call Environment.set() ONLY for sandbox; production skips it entirely.
  if (window.Paddle) {
    const paddleEnv = import.meta.env.VITE_PADDLE_ENV as "sandbox" | "production";
    const paddleToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined;
    if (paddleToken) {
      if (paddleEnv === "sandbox") {
        window.Paddle.Environment.set("sandbox");
      }
      window.Paddle.Initialize({ token: paddleToken });
    } else {
      console.warn("[Opten] VITE_PADDLE_CLIENT_TOKEN is not set — USD payment path unavailable");
    }
  } else {
    console.warn("[Opten] Paddle.js failed to load — USD payment path unavailable");
  }

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
  // Paddle bootstrap above runs BEFORE this call — order locked by DEC-integration-contract-paddle-init / BG-67-01.

  const tree = (
    <LangProvider>
      <BrowserRouter>
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
            <Route path="/dashboard/download-skill" element={<DownloadSkillPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LangProvider>
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
