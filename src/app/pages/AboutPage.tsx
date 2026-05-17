// Phase 4 D-01 / D-02: RU-only E-E-A-T page. /en/about deferred to Phase 4.1.
// SSR-eligible: no localStorage/window/navigator access at render time. Body content
// is human-curated (sourced from C:/Projects/Obsidian/Vlad/ — author's vault) and
// approved by user 2026-05-17 per D-07 (no LLM-generated body on E-E-A-T pages).
// Hero renders initials placeholder per locked decision option (c) — photo deferred.

import { useT, useLang } from "../../i18n/LangContext";
import LangSwitcher from "../components/LangSwitcher";
import LocalizedLink from "../components/LocalizedLink";
// Phase 4.1 W12a: body content extracted to a per-language data file so W12b can
// add the EN sibling without bloating this component. Fallback to RU until W12b
// populates aboutContent.en (currently null sentinel).
import { aboutContent } from "../../content/about";

export default function AboutPage() {
  const t = useT();
  const { lang } = useLang();
  const content = aboutContent[lang] ?? aboutContent.ru;

  return (
    <div className="min-h-screen bg-black font-['PT_Root_UI',sans-serif]">
      {/* Header chrome (mirrors LegalLayout) */}
      <header className="flex items-center justify-between max-w-[800px] mx-auto px-[20px] py-[24px]">
        <LocalizedLink to="/" className="text-white text-[20px] font-bold no-underline hover:opacity-80 transition-opacity">
          Opten
        </LocalizedLink>
        <div className="flex items-center gap-[16px]">
          <LangSwitcher className="text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-['PT_Root_UI',sans-serif]" />
          <LocalizedLink to="/" className="text-[rgba(255,255,255,0.5)] text-[14px] no-underline hover:text-white transition-colors">
            {t("about.backLink")}
          </LocalizedLink>
        </div>
      </header>

      {/* Hero — initials placeholder (locked decision option c — photo deferred to Phase 4.1+ hotfix) */}
      <section className="max-w-[800px] mx-auto px-[20px] pt-[16px] pb-[40px] flex flex-col md:flex-row gap-[24px] md:gap-[32px] items-center md:items-start">
        <div className="shrink-0 size-[96px] md:size-[120px] rounded-full bg-gradient-to-br from-[#9cfb51] to-[#5fb821] flex items-center justify-center">
          <span className="font-['Unbounded',sans-serif] text-[36px] md:text-[44px] font-bold text-[#011417] tracking-[-1px] select-none" aria-hidden="true">
            ВВ
          </span>
        </div>
        <div className="flex flex-col items-center md:items-start gap-[8px] text-center md:text-left">
          <h1 className="text-white text-[32px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.8px]">
            Влад Воронежцев
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-[16px] md:text-[18px] leading-[1.5]">
            {t("about.tagline")}
          </p>
          <a
            href="https://t.me/v_voronezhtsev"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[12px] inline-flex items-center gap-[8px] rounded-[100px] bg-white px-[20px] py-[10px] font-['PT_Root_UI',sans-serif] text-[14px] font-bold text-[#011417] no-underline hover:opacity-90 transition-opacity"
          >
            {t("about.contactCta")}
          </a>
        </div>
      </section>

      {/* Body content — human-written, sourced from author's Obsidian vault, approved by user 2026-05-17.
          Phase 4.1 W12a: section data lives in src/content/about.tsx (per-language). EN populated in W12b. */}
      <main className="max-w-[800px] mx-auto px-[20px] pb-[80px]">
        <article className="about-content text-[rgba(255,255,255,0.78)] text-[16px] leading-[1.7]">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-white text-[24px] font-medium mt-[48px] mb-[18px] leading-[1.3] tracking-[-0.4px] first:mt-0">{section.heading}</h2>
              {section.body}
            </div>
          ))}
        </article>
      </main>

      {/* Footer chrome (mirrors LegalLayout) */}
      <footer className="max-w-[800px] mx-auto px-[20px] py-[32px] border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-wrap gap-[24px] text-[14px] text-[rgba(255,255,255,0.4)]">
          <LocalizedLink to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.privacy")}</LocalizedLink>
          <LocalizedLink to="/terms" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.terms")}</LocalizedLink>
          <LocalizedLink to="/refund" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.refund")}</LocalizedLink>
          <span>{t("legal.footer.copyright")}</span>
        </div>
      </footer>
    </div>
  );
}
