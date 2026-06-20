// Phase 5 follow-up: shared footer extracted from App.tsx Footer().
// Same CTA + gradient + nav across landing, blog, and other content pages.
// App surfaces can opt into linksOnly to reuse the footer nav without the marketing CTA.

import { useT, useLang } from "../../i18n/LangContext";
import LocalizedLink from "./LocalizedLink";
import InstallButton from "./InstallButton";
import { FooterDefinitionText } from "./DynamicPriceCopy";

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-[#9cfb51]">{children}</span>;
}

type SiteFooterProps = {
  variant?: "full" | "linksOnly";
};

export default function SiteFooter({ variant = "full" }: SiteFooterProps): JSX.Element {
  const t = useT();
  const { lang } = useLang();
  const footerLinks = (
    <>
      <LocalizedLink to="/about" className="hover:text-white">{t("nav.about")}</LocalizedLink>
      <LocalizedLink to="/blog" className="hover:text-white">{t("nav.blog")}</LocalizedLink>
      {/* Phase v2.0 MODELS-A-11: Models hub link */}
      <LocalizedLink to="/models" className="hover:text-white">{t("nav.models")}</LocalizedLink>
      <LocalizedLink to="/privacy" className="hover:text-white">{t("footer.privacy")}</LocalizedLink>
      <LocalizedLink to="/terms" className="hover:text-white">{t("footer.terms")}</LocalizedLink>
      <LocalizedLink to="/refund" className="hover:text-white">{t("footer.refund")}</LocalizedLink>
      <a href="https://t.me/v_voronezhtsev" target="_blank" rel="noopener noreferrer" className="hover:text-white">{t("footer.contact")}</a>
    </>
  );

  if (variant === "linksOnly") {
    return (
      <footer className="relative z-10 bg-transparent px-5 pb-8 pt-0 text-center">
        <div className="relative z-10 mx-auto w-full max-w-[900px]">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-4 font-['PT_Root_UI',sans-serif] text-[16px] text-white/40 sm:gap-8">
            {footerLinks}
          </div>
          <p className="mt-4 font-['PT_Root_UI',sans-serif] text-[16px] text-white/30">{t("footer.copyright")}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-[#011417] px-5 pb-8 pt-[70px] text-center md:pt-28">
      <div aria-hidden="true" className="opten-footer-gradient" />
      <div className="relative z-10 mx-auto max-w-[900px]">
        <h2 className="font-['Unbounded',sans-serif] text-[36px] font-bold leading-[1.12] text-white md:text-[60px]">
          {lang === "ru" ? (
            <>Хватит гадать. Генерируй<br /><Accent>с первой попытки.</Accent></>
          ) : (
            <>Stop Guessing. Generate<br /><Accent>On The First Try.</Accent></>
          )}
        </h2>
        <p className="mt-8 font-['PT_Root_UI',sans-serif] text-[18px] text-white">{t("cta.subtitle")}</p>
        <div className="mt-14 flex justify-center">
          <InstallButton />
        </div>
        <p className="mx-auto mt-8 w-full max-w-[760px] font-['PT_Root_UI',sans-serif] text-[14px] leading-[1.6] text-white/55 md:text-[15px]">
          <FooterDefinitionText />
        </p>
        <div className="mt-20 flex flex-wrap justify-center gap-x-5 gap-y-4 font-['PT_Root_UI',sans-serif] text-[16px] text-white/40 sm:gap-8">
          {footerLinks}
        </div>
        <p className="mt-4 font-['PT_Root_UI',sans-serif] text-[16px] text-white/30">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
