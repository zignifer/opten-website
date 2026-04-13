import { Link } from "react-router";
import { useT } from "../../../i18n/LangContext";

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  const t = useT();

  return (
    <div className="min-h-screen bg-black font-['PT_Root_UI',sans-serif]">
      {/* Header */}
      <header className="flex items-center justify-between max-w-[800px] mx-auto px-[20px] py-[24px]">
        <Link to="/" className="text-white text-[20px] font-bold no-underline hover:opacity-80 transition-opacity">
          Opten
        </Link>
        <Link to="/" className="text-[rgba(255,255,255,0.5)] text-[14px] no-underline hover:text-white transition-colors">
          {t("legal.backLink")}
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-[800px] mx-auto px-[20px] pb-[80px]">
        <h1 className="text-white text-[32px] md:text-[40px] font-medium leading-[1.2] tracking-[-0.8px] mb-[8px]">
          {title}
        </h1>
        <p className="text-[rgba(255,255,255,0.3)] text-[14px] mb-[40px]">
          {t("legal.updatedAt")} {updatedAt}
        </p>

        <div className="legal-content text-[rgba(255,255,255,0.7)] text-[16px] leading-[1.7]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[800px] mx-auto px-[20px] py-[32px] border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-wrap gap-[24px] text-[14px] text-[rgba(255,255,255,0.4)]">
          <Link to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.privacy")}</Link>
          <Link to="/terms" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.terms")}</Link>
          <Link to="/refund" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.refund")}</Link>
          <span>{t("legal.footer.copyright")}</span>
        </div>
      </footer>

      <style>{`
        .legal-content h2 {
          color: white;
          font-size: 22px;
          font-weight: 500;
          margin-top: 40px;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .legal-content h3 {
          color: white;
          font-size: 18px;
          font-weight: 500;
          margin-top: 28px;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .legal-content p {
          margin-bottom: 12px;
        }
        .legal-content ul, .legal-content ol {
          margin-bottom: 12px;
          padding-left: 24px;
        }
        .legal-content li {
          margin-bottom: 6px;
        }
        .legal-content a {
          color: #2777C3;
          text-decoration: underline;
        }
        .legal-content a:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}
