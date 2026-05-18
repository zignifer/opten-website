// Phase 4 D-04 / D-05 / D-06: bilingual anchor guide. /guides/<slug> + /en/guides/<slug>
// both prerendered. SSR-safe: useParams + useLang work under StaticRouter. Lang is derived
// from URL prefix by LangProvider (Phase 3 D-05).

import { useParams } from "react-router";
import { useT, useLang } from "../../i18n/LangContext";
import LocalizedLink from "../components/LocalizedLink";
import LangSwitcher from "../components/LangSwitcher";
import FaqBlock from "../components/FaqBlock";
// Phase 5 B-01: content moved to src/content/blog/; URL still /guides/:slug until B-07.
import { blogPostsBySlug, type BlogSlug } from "../../content/blog";

// Post-2026-05-17 GEO audit HI-5: visible date block. AI/crawler reads "Опубликовано: 17 мая 2026"
// directly + the machine-readable <time datetime=ISO> attribute.
function formatGuideDate(iso: string, lang: "ru" | "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

function NotFoundFallback() {
  const t = useT();
  return (
    <div className="min-h-screen bg-black font-['PT_Root_UI',sans-serif] flex flex-col items-center justify-center px-[20px]">
      <h1 className="text-white text-[28px] md:text-[32px] font-medium mb-[12px]">
        {t("guide.notFound.title")}
      </h1>
      <p className="text-[rgba(255,255,255,0.6)] text-[16px] mb-[24px]">
        {t("guide.notFound.body")}
      </p>
      <LocalizedLink to="/" className="rounded-[100px] bg-white px-[24px] py-[12px] text-[#011417] text-[14px] font-bold no-underline">
        {t("nav.home")}
      </LocalizedLink>
    </div>
  );
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();
  const t = useT();

  const guideEntry = slug ? blogPostsBySlug[slug as BlogSlug] : undefined;
  const data = guideEntry?.[lang];
  if (!data) {
    return <NotFoundFallback />;
  }
  const steps = data.body.steps ?? [];
  const faq = data.body.faq ?? [];

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

      <main className="max-w-[800px] mx-auto px-[20px] pb-[40px]">
        <h1 className="text-white text-[28px] md:text-[40px] font-medium leading-[1.15] tracking-[-0.6px] mb-[12px]">
          {data.title}
        </h1>
        {/* Post-2026-05-17 GEO audit HI-5: visible byline + date. <time> carries machine-readable
            ISO; visible text gives AI a citation anchor and humans a freshness signal. */}
        <p className="text-[rgba(255,255,255,0.4)] text-[14px] leading-[1.5] mb-[20px]">
          {t("guide.publishedLabel")}:{" "}
          <time dateTime={data.publishedAt}>{formatGuideDate(data.publishedAt, lang)}</time>
          {data.updatedAt !== data.publishedAt && (
            <>
              {" · "}
              {t("guide.updatedLabel")}:{" "}
              <time dateTime={data.updatedAt}>{formatGuideDate(data.updatedAt, lang)}</time>
            </>
          )}
        </p>
        <p className="guide-intro text-[rgba(255,255,255,0.7)] text-[17px] md:text-[18px] leading-[1.6] mb-[40px]">
          {data.body.intro}
        </p>

        <ol className="guide-steps flex flex-col gap-[40px]">
          {steps.map((step, i) => (
            <li key={i} className="border-t border-[rgba(255,255,255,0.08)] pt-[28px]">
              <div className="flex items-baseline gap-[12px] mb-[12px]">
                <span className="font-['Unbounded',sans-serif] text-[22px] md:text-[28px] font-bold text-[#9cfb51] leading-[1]">
                  {i + 1}.
                </span>
                <h2 className="text-white text-[20px] md:text-[24px] font-medium leading-[1.3] tracking-[-0.4px]">
                  {step.title}
                </h2>
              </div>
              <p className="text-[rgba(255,255,255,0.78)] text-[16px] leading-[1.7] mb-[16px]">
                {step.body}
              </p>
              {step.before && step.after && (
                <div className="grid gap-[12px] md:grid-cols-2 mt-[16px]">
                  <div className="rounded-[8px] bg-[rgba(212,24,61,0.08)] border border-[rgba(212,24,61,0.2)] p-[16px]">
                    <p className="text-[#d4183d] text-[12px] font-bold uppercase tracking-[1px] mb-[8px]">
                      {t("guide.beforeLabel")}
                    </p>
                    <pre className="text-[rgba(255,255,255,0.7)] text-[13px] leading-[1.6] whitespace-pre-wrap font-mono">{step.before}</pre>
                  </div>
                  <div className="rounded-[8px] bg-[rgba(156,251,81,0.06)] border border-[rgba(156,251,81,0.2)] p-[16px]">
                    <p className="text-[#9cfb51] text-[12px] font-bold uppercase tracking-[1px] mb-[8px]">
                      {t("guide.afterLabel")}
                    </p>
                    <pre className="text-[rgba(255,255,255,0.85)] text-[13px] leading-[1.6] whitespace-pre-wrap font-mono">{step.after}</pre>
                  </div>
                </div>
              )}
              {step.imageSrc && (
                <img
                  src={step.imageSrc}
                  alt={step.title}
                  loading="lazy"
                  width="800"
                  height="450"
                  className="mt-[16px] w-full rounded-[8px] border border-[rgba(255,255,255,0.08)]"
                />
              )}
            </li>
          ))}
        </ol>
      </main>

      <FaqBlock items={faq} headingKey="guide.faqHeading" id="guide-faq" />

      {/* Footer chrome (mirrors LegalLayout) */}
      <footer className="max-w-[800px] mx-auto px-[20px] py-[32px] border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-wrap gap-[24px] text-[14px] text-[rgba(255,255,255,0.4)]">
          {/* Phase 4.1 B-03: /en/about now exists — About link shown in both locales (same fix as
              src/app/App.tsx footer/nav; this footer was missed in the original audit pass). */}
          <LocalizedLink to="/about" className="hover:text-white transition-colors no-underline text-inherit">{t("nav.about")}</LocalizedLink>
          <LocalizedLink to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.privacy")}</LocalizedLink>
          <LocalizedLink to="/terms" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.terms")}</LocalizedLink>
          <LocalizedLink to="/refund" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.refund")}</LocalizedLink>
          <span>{t("legal.footer.copyright")}</span>
        </div>
      </footer>
    </div>
  );
}
