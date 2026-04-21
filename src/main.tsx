
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router";
  import App from "./app/App.tsx";
  import PayPage from "./app/pages/PayPage.tsx";
  import SuccessPage from "./app/pages/SuccessPage.tsx";
  import PrivacyPage from "./app/pages/PrivacyPage.tsx";
  import TermsPage from "./app/pages/TermsPage.tsx";
  import RefundPage from "./app/pages/RefundPage.tsx";
  import AccountPage from "./app/pages/AccountPage.tsx";
  import WelcomePage from "./app/pages/WelcomePage.tsx";
  import "./styles/index.css";
  import { LangProvider } from "./i18n/LangContext";

  // === Paddle.js v2 SDK bootstrap — Phase 66 D-14 (FE-05) ===
  // Environment.set MUST come before Initialize (Pitfall #4 — ordering contract).
  // Guarded by `if (window.Paddle)`: sync script tag in index.html normally guarantees it,
  // but adblock / CSP / network failure can leave it undefined (Pitfall #2).
  if (window.Paddle) {
    window.Paddle.Environment.set(import.meta.env.VITE_PADDLE_ENV as "sandbox" | "production");
    window.Paddle.Initialize({ token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string });
  } else {
    console.warn("[Opten] Paddle.js failed to load — USD payment path unavailable");
  }

  createRoot(document.getElementById("root")!).render(
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/pay" element={<PayPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
