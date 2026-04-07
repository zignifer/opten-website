
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router";
  import App from "./app/App.tsx";
  import PayPage from "./app/pages/PayPage.tsx";
  import SuccessPage from "./app/pages/SuccessPage.tsx";
  import PrivacyPage from "./app/pages/PrivacyPage.tsx";
  import TermsPage from "./app/pages/TermsPage.tsx";
  import RefundPage from "./app/pages/RefundPage.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
      </Routes>
    </BrowserRouter>
  );
