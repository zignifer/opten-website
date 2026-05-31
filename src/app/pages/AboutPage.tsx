// Phase 4 D-01 / D-02: RU-only E-E-A-T page. /en/about deferred to Phase 4.1.
// SSR-eligible: no localStorage/window/navigator access at render time. Body content
// is human-curated (sourced from C:/Projects/Obsidian/Vlad/ — author's vault) and
// approved by user 2026-05-17 per D-07 (no LLM-generated body on E-E-A-T pages).
// Hero renders initials placeholder per locked decision option (c) — photo deferred.

import { useT, useLang } from "../../i18n/LangContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
// Phase 4.1 W12a: body content extracted to a per-language data file so W12b can
// add the EN sibling without bloating this component. Fallback to RU until W12b
// populates aboutContent.en (currently null sentinel).
import { aboutContent } from "../../content/about";

export default function AboutPage() {
  const t = useT();
  const { lang } = useLang();
  const content = aboutContent[lang] ?? aboutContent.ru;

  return (
    <div className="min-h-screen bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SiteHeader variant="page" />

      {/* Hero — founder photo. Phase 4.2 P1-6 (deferred from synthesis): real photo
          replaces the initials placeholder. Asset is 400×400 (1x) + 800×800 (2x) WebP
          with a JPEG fallback served from Person.image in Org/Person schema. */}
      <section className="relative overflow-hidden bg-[#011417] px-5 pb-16 pt-[131px] md:pb-20 md:pt-[190px]">
        <div
          aria-hidden="true"
          className="opten-figma-gradient"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
          }}
        />
        <div className="relative z-10 mx-auto flex max-w-[900px] flex-col items-center gap-[28px] text-center">
          <picture className="shrink-0">
            <source
              type="image/webp"
              srcSet="/founder.webp 1x, /founder@2x.webp 2x"
            />
            <img
              src="/founder.jpg"
              srcSet="/founder.jpg 1x, /founder@2x.webp 2x"
              width="140"
              height="140"
              alt={t("about.heroAlt")}
              loading="eager"
              decoding="async"
              className="size-[112px] rounded-full border border-white/10 bg-[#011417] object-cover shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:size-[140px]"
            />
          </picture>
          <div className="flex max-w-[780px] flex-col items-center gap-[14px]">
            <h1 className="font-['Unbounded',sans-serif] text-[36px] font-bold leading-[1.1] tracking-[-0.6px] text-white sm:text-[44px] md:text-[52px]">
              Влад Воронежцев
            </h1>
            <p className="max-w-[650px] text-[17px] leading-[1.6] text-white/70 md:text-[18px]">
              {t("about.tagline")}
            </p>
            <div className="mt-[4px] flex flex-wrap items-center justify-center gap-[10px]">
              <a
                href="https://t.me/v_voronezhtsev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[8px] rounded-[100px] bg-[#9cfb51] px-[20px] py-[10px] font-['PT_Root_UI',sans-serif] text-[14px] font-bold text-[#011417] no-underline transition hover:-translate-y-0.5"
              >
                {t("about.contactCta")}
              </a>
              {/* Post-2026-05-17 GEO audit ME-7: email contact alongside Telegram. AI systems
                  prefer ContactPoint.email for "how do I reach the founder" queries. */}
              <a
                href="mailto:zignifer@gmail.com"
                className="inline-flex items-center gap-[8px] rounded-[100px] border border-white/15 px-[20px] py-[10px] font-['PT_Root_UI',sans-serif] text-[14px] font-medium text-white no-underline transition hover:bg-white/5"
              >
                {t("about.emailCta")}
              </a>
            </div>
          </div>
          <div className="grid w-full max-w-[760px] gap-[10px] sm:grid-cols-3">
            {content.highlights.map((item) => (
              <div key={item.label} className="rounded-[12px] border border-white/10 bg-white/[0.04] px-[16px] py-[14px] text-left backdrop-blur-sm">
                <p className="font-['Unbounded',sans-serif] text-[22px] font-bold leading-[1.1] text-[#9cfb51]">{item.value}</p>
                <p className="mt-[6px] text-[13px] leading-[1.35] text-white/55">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body content — human-written, sourced from author's Obsidian vault, approved by user 2026-05-17.
          Phase 4.1 W12a: section data lives in src/content/about.tsx (per-language). EN populated in W12b. */}
      <main className="mx-auto max-w-[900px] px-[20px] pb-[80px] pt-[8px]">
        <article className="about-content grid gap-[18px] text-[16px] leading-[1.7] text-white/78">
          {content.sections.map((section, i) => (
            <section key={i} className="rounded-[16px] border border-white/10 bg-[#0e2023] p-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.16)] md:p-[32px]">
              <h2 className="mb-[18px] text-[24px] font-medium leading-[1.3] tracking-[-0.4px] text-white">{section.heading}</h2>
              {section.body}
            </section>
          ))}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
