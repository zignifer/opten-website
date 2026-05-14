// Phase 2 GEO-B-2 / D-02 / D-06: Build-time SSR entry — exports renderRoute(path).
// Decouples the SSR tree from src/main.tsx (which calls createRoot at module load — crashes in Node).
// Only the 5 full-prerender marketing routes are mounted (D-02 full-prerender tier).
// /pay is head-only (D-02), /success /account /dashboard/* are SPA-only — intentionally NOT mounted here.

import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router";
import App from "../src/app/App.tsx";
import WelcomePage from "../src/app/pages/WelcomePage.tsx";
import PrivacyPage from "../src/app/pages/PrivacyPage.tsx";
import TermsPage from "../src/app/pages/TermsPage.tsx";
import RefundPage from "../src/app/pages/RefundPage.tsx";
import "../src/styles/index.css";
import { LangProvider } from "../src/i18n/LangContext";

export function renderRoute(path: string): string {
  return renderToString(
    <LangProvider>
      <StaticRouter location={path}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          {/* NOTE: /pay is head-only (D-02), /success /account /dashboard/* are SPA-only — intentionally NOT mounted here. */}
        </Routes>
      </StaticRouter>
    </LangProvider>
  );
}
