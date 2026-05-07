import { ReactNode } from "react";
import { Link } from "react-router";
import { useT, useLang } from "../../../i18n/LangContext";

interface ConnectLayoutProps {
  title: string;
  children: ReactNode;
}

export default function ConnectLayout({ title, children }: ConnectLayoutProps) {
  const t = useT();
  const { lang, setLang } = useLang();

  return (
    <div className="min-h-screen bg-black font-['PT_Root_UI',sans-serif]">
      {/* Header */}
      <header className="flex items-center justify-between max-w-[800px] mx-auto px-[20px] py-[24px]">
        <Link to="/" className="text-white text-[20px] font-medium no-underline hover:opacity-80 transition-opacity">
          Opten
        </Link>
        <div className="flex items-center gap-[16px]">
          <button
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-['PT_Root_UI',sans-serif]"
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>
          <Link to="/" className="text-[rgba(255,255,255,0.5)] text-[14px] no-underline hover:text-white transition-colors">
            {t("legal.backLink")}
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[800px] mx-auto px-[20px] pb-[80px] pt-[40px]">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-[-0.8px] text-white leading-[1.2] mb-[24px]">
          {title}
        </h1>
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-[800px] mx-auto px-[20px] py-[32px] border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-wrap gap-[24px] text-[14px] text-[rgba(255,255,255,0.4)]">
          <Link to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.privacy")}</Link>
          <Link to="/terms" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.terms")}</Link>
          <Link to="/refund" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.refund")}</Link>
          <Link to="/connect-claude" className="hover:text-white transition-colors no-underline text-inherit">{t("footer.connectClaude")}</Link>
          <span>{t("legal.footer.copyright")}</span>
        </div>
      </footer>
    </div>
  );
}
