
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
    if (paddleEnv === "sandbox") {
      window.Paddle.Environment.set("sandbox");
    }
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
