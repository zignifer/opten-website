// Phase 2 GEO-B-2 / D-02 / D-06: Build-time SSR entry — exports renderRoute(path).
// Decouples the SSR tree from src/main.tsx (which calls createRoot at module load — crashes in Node).
// Phase 4 D-12: /pay AND /en/pay are now SSR-mounted alongside the legal/welcome surface.
// /success /account /dashboard/* remain SPA-only.

import { Suspense } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router";
import App from "../src/app/App.tsx";
import WelcomePage from "../src/app/pages/WelcomePage.tsx";
import PrivacyPage from "../src/app/pages/PrivacyPage.tsx";
import TermsPage from "../src/app/pages/TermsPage.tsx";
import RefundPage from "../src/app/pages/RefundPage.tsx";
import PayPage from "../src/app/pages/PayPage.tsx";
import AboutPage from "../src/app/pages/AboutPage.tsx";
import "../src/styles/index.css";
import { LangProvider } from "../src/i18n/LangContext";
import { RouteLoading } from "../src/app/components/RouteLoading";

// Phase 3 D-06: Suspense wrapper mirrors main.tsx so SSR emits the `<!--$-->...<!--/$-->`
// boundary markers React 18 hydration walks; without it, client expects markers, finds none,
// throws React #418/#423 and falls back to full client re-render (the residual `/` mismatch).
export function renderRoute(path: string): string {
  // Phase 3 D-05: LangProvider uses useLocation() to derive initial lang from URL prefix.
  // useLocation() requires a Router context — LangProvider must be INSIDE StaticRouter, not outside.
  return renderToString(
    <StaticRouter location={path}>
      <LangProvider>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/pay" element={<PayPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Phase 4 D-12: /pay AND /en/pay are now SSR-mounted (flipped from head-only to full prerender). Phase 4 D-01/D-02: /about is RU-only — no /en/about mount. /success /account /dashboard/* remain SPA-only — intentionally NOT mounted here. */}
            <Route path="/en/"        element={<App />} />
            <Route path="/en/welcome" element={<WelcomePage />} />
            <Route path="/en/privacy" element={<PrivacyPage />} />
            <Route path="/en/terms"   element={<TermsPage />} />
            <Route path="/en/refund"  element={<RefundPage />} />
            <Route path="/en/pay"     element={<PayPage />} />
          </Routes>
        </Suspense>
      </LangProvider>
    </StaticRouter>
  );
}
