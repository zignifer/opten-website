import { useEffect, useState } from "react";
import { useLang, useT } from "../i18n/LangContext";
import {
  Check,
  Menu,
  Rocket,
  User,
  X,
} from "lucide-react";
import LangSwitcher from "./components/LangSwitcher";
import LocalizedLink from "./components/LocalizedLink";
import FaqBlock from "./components/FaqBlock";
import { landingFaq } from "../content/landingFaq";
import OptenHeroAnimation from "./components/OptenHeroAnimation";
import { Picture } from "./components/Picture";
import type { Picture as PictureData } from 'vite-imagetools';
// Phase 2.1 D-04: Add width/height attrs to every <img> for CLS=0 (aspect-ratio-from-attributes)
// Phase 2.1 D-05: vite-imagetools ?as=picture static imports (paths relative to src/app/App.tsx)
// Phase 2.2: ?w=400;1100 generates two srcset entries each. The Picture component
// passes a `sizes` attribute so the browser picks the 400 px variant on mobile (where
// the image renders at ~300-360 px wide) and the 1100 px variant on desktop. PageSpeed
// previously flagged ~93 KB of waste — feature cards on mobile were downloading the
// 1100 px asset for a 306 px container.
import featureModelsSrc from '../../public/assets/landing-design/feature-models.png?w=400;1100&format=webp;png&as=picture'
import featureCreditsSrc from '../../public/assets/landing-design/feature-credits.png?w=400;1100&format=webp;png&as=picture'
import featureInterfaceRuSrc from '../../public/assets/landing-design/feature-interface-ru.png?w=400;1100&format=webp;png&as=picture'
import featureInterfaceEnSrc from '../../public/assets/landing-design/feature-interface-en.png?w=400;1100&format=webp;png&as=picture'
import featureEnhanceRuSrc from '../../public/assets/landing-design/feature-enhance-ru.png?w=400;1100&format=webp;png&as=picture'
import featureEnhanceEnSrc from '../../public/assets/landing-design/feature-enhance-en.png?w=400;1100&format=webp;png&as=picture'
import stepsInnerRuSrc from '../../public/assets/landing-design/steps-inner-ru.png?w=430;813&format=webp;png&as=picture'
import stepsInnerEnSrc from '../../public/assets/landing-design/steps-inner-en.png?w=430;813&format=webp;png&as=picture'
import canvaSrc from '../../public/assets/partners/canva.png?w=268&format=webp;png&as=picture'
import freepikSrc from '../../public/assets/partners/freepik.png?w=268&format=webp;png&as=picture'
import higgsfieldSrc from '../../public/assets/partners/higgsfield.png?w=268&format=webp;png&as=picture'
import syntxSrc from '../../public/assets/partners/syntx.png?w=268&format=webp;png&as=picture'

const STORE_URL = "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";
const ASSET_ROOT = "/assets/landing-design";

const partnerSrcMap = {
  canva: canvaSrc,
  freepik: freepikSrc,
  higgsfield: higgsfieldSrc,
  syntx: syntxSrc,
} as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function titleCaseEn(text: string, lang: string) {
  if (lang !== "en") return text;

  return text.replace(/[A-Za-z]+(?:['’][A-Za-z]+)?/g, (word) => {
    if (word === word.toUpperCase()) return word;

    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
}

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-[#9cfb51]">{children}</span>;
}

function Logo() {
  return <img alt="Opten" src="/logo.svg" width="62" height="20" loading="eager" className="h-[18px] w-auto md:h-[20px]" />;
}

function BrowserIcons({ size = "lg" }: { size?: "sm" | "lg" }) {
  const iconSize = size === "lg" ? "size-[40px]" : "size-[28px]";
  const srcSuffix = size === "lg" ? "lg" : "sm";
  const px = size === "lg" ? 40 : 28;
  // Phase 2.2: fetchPriority dropped — React 18.3 doesn't normalize the camelCase JSX prop,
  // so SSR emits `fetchPriority="high"` verbatim and hydration sees a mismatch → React #418
  // + #423 fall through to a full client re-render (the actual cause of "buttons unresponsive
  // for 1-3 s on mobile"). Re-add as `fetchpriority` (lowercase) after upgrading to React 19.
  return (
    <span className="flex items-center">
      <img alt="Chrome" src={`/assets/landing-design/chrome-${srcSuffix}.svg`} width={px} height={px} loading="eager" className={cx(iconSize, "relative z-10")} />
      <img alt="Yandex Browser" src={`/assets/landing-design/yandex-${srcSuffix}.svg`} width={px} height={px} loading="eager" className={cx(iconSize, "-ml-[8px]")} />
    </span>
  );
}

function InstallButton({ compact = false, label }: { compact?: boolean; label?: string }) {
  const t = useT();
  return (
    <a
      href={STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "group inline-flex items-center justify-center rounded-full bg-white text-[#011417] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(156,251,81,0.18)]",
        compact ? "gap-2 px-3 py-2 text-[13px] font-bold" : "w-[calc(100vw-32px)] max-w-[390px] gap-2 px-[10px] py-[10px] pr-4 sm:w-auto sm:max-w-none sm:gap-3 sm:pr-6"
      )}
    >
      <BrowserIcons size={compact ? "sm" : "lg"} />
      <span className={cx("min-w-0 font-['PT_Root_UI',sans-serif] leading-[1.25]", compact && "whitespace-nowrap")}>
        {compact ? (
          label ?? t("hero.installBtn")
        ) : (
          <span className="flex flex-col text-left">
            <span className="whitespace-nowrap text-[13px] font-normal sm:text-[14px]">{t("hero.installBtnSub")}</span>
            <span className="whitespace-nowrap text-[17px] font-bold sm:text-[18px]">{label ?? t("hero.installBtn")}</span>
          </span>
        )}
      </span>
    </a>
  );
}

function Navbar() {
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-5">
      <nav className="mx-auto flex max-w-[1100px] items-center justify-between rounded-full bg-[rgba(0,0,0,0.34)] py-2 pl-5 pr-2 text-white backdrop-blur-md md:pl-6">
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-full bg-white/5 md:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>

        <div className="hidden flex-1 items-center gap-6 font-['PT_Root_UI',sans-serif] text-[14px] md:flex">
          <a href="#features" className="opacity-90 transition hover:opacity-100">{t("nav.features")}</a>
          <a href="#pricing" className="opacity-90 transition hover:opacity-100">{t("nav.pricing")}</a>
          <a href="#faq" className="opacity-90 transition hover:opacity-100">{t("nav.faq")}</a>
          {/* Phase 4 D-01 / D-16: About link, RU-only — hide-entirely option per CONTEXT D-16 (no /en/about exists). */}
          {lang === "ru" && (
            <LocalizedLink to="/about" className="opacity-90 transition hover:opacity-100">{t("nav.about")}</LocalizedLink>
          )}
          <LangSwitcher className="bg-transparent font-['PT_Root_UI',sans-serif] text-[14px] text-white/45 transition hover:text-white" />
        </div>

        <LocalizedLink to="/" className="absolute left-1/2 -translate-x-1/2">
          <Logo />
        </LocalizedLink>

        <div className="flex flex-1 items-center justify-end gap-2">
          <LocalizedLink
            to="/account"
            className="inline-flex h-[44px] items-center gap-2 rounded-full bg-white px-4 font-['PT_Root_UI',sans-serif] text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5"
          >
            <User size={16} fill="currentColor" />
            <span className="hidden lg:inline">{t("nav.account")}</span>
          </LocalizedLink>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 flex max-w-[1100px] flex-col gap-4 rounded-[20px] border border-white/10 bg-[#071d1a] p-5 font-['PT_Root_UI',sans-serif] text-white shadow-2xl md:hidden">
          <a href="#features" onClick={() => setOpen(false)}>{t("nav.features")}</a>
          <a href="#pricing" onClick={() => setOpen(false)}>{t("nav.pricing")}</a>
          <a href="#faq" onClick={() => setOpen(false)}>{t("nav.faq")}</a>
          {/* Phase 4 D-01 / D-16: About link, RU-only (mobile menu mirror of desktop nav). */}
          {lang === "ru" && (
            <LocalizedLink to="/about" onClick={() => setOpen(false)}>{t("nav.about")}</LocalizedLink>
          )}
          <LangSwitcher className="w-fit bg-transparent p-0 text-left text-white/60" onSwitch={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}

function Hero() {
  const t = useT();
  const { lang } = useLang();
  const title = t("hero.title");
  const rawAccentTitle = lang === "ru" ? "Не сливай кредиты" : "Stop wasting credits";
  const accentTitle = titleCaseEn(rawAccentTitle, lang);
  const restTitle = titleCaseEn(title.replace(rawAccentTitle, "").trim(), lang);
  return (
    <section className="relative overflow-hidden bg-[#011417] px-5 pb-24 pt-[131px] md:min-h-[850px] md:pb-28 md:pt-[190px]">
      <div aria-hidden="true" className="opten-figma-gradient" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center text-center">
        <h1 className="font-['Unbounded',sans-serif] text-[36px] font-bold leading-[1.08] text-white sm:text-[54px] md:text-[62px]">
          <Accent>{accentTitle}</Accent>
          {restTitle ? <><br />{restTitle}</> : null}
        </h1>
        <img alt="" src={`${ASSET_ROOT}/highlight.svg`} width="260" height="28" loading="eager" className="relative mt-1 h-auto w-[260px] md:-left-[50px] md:w-[360px]" />
        <p className="mt-8 w-full max-w-[800px] font-['PT_Root_UI',sans-serif] text-[16px] leading-[1.6] text-white md:text-[18px]">
          {t("hero.subtitle1")}
          <strong>{t("hero.subtitle2")}</strong>
        </p>
        <div className="mt-12 hidden w-full justify-center overflow-visible min-[1066px]:flex">
          <div className="w-[680px] max-w-full overflow-visible">
            <OptenHeroAnimation />
          </div>
        </div>
        <div className="mt-12">
          <InstallButton />
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const t = useT();
  return (
    <section className="w-full bg-[#011417]">
      <div className="flex flex-col items-center justify-center pb-[70px] px-[20px] md:pb-[56px] md:px-[120px]">
        <div className="flex flex-col gap-[24px] items-center">
          <p className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[16px] md:text-[18px] text-[rgba(255,255,255,0.6)] text-center">
            {t("partners.label")}
          </p>
          <div className="hidden md:flex gap-[80px] items-center justify-center">
            <PartnerLink name="syntx" href="https://syntx.ai/welcome/GlUETIt6" />
            <PartnerLink name="freepik" href="https://www.freepik.com/" />
            <PartnerLink name="higgsfield" href="https://higgsfield.ai/" />
            <PartnerCanva />
          </div>
          <div className="flex md:hidden flex-col gap-[40px] items-center w-full max-w-[320px]">
            <div className="flex items-center justify-between w-full">
              <PartnerLink name="syntx" href="https://syntx.ai/welcome/GlUETIt6" />
              <PartnerLink name="freepik" href="https://www.freepik.com/" />
            </div>
            <div className="flex items-center justify-between w-full">
              <PartnerLink name="higgsfield" href="https://higgsfield.ai/" />
              <PartnerCanva />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerLink({ name, href }: { name: "syntx" | "freepik" | "higgsfield"; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="relative h-[40px] w-[134px] transition hover:opacity-80">
      <PartnerLogo name={name} />
    </a>
  );
}

function PartnerCanva() {
  return (
    <div className="relative h-[40px] w-[134px]">
      <PartnerLogo name="canva" />
      <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2">
        <SoonBadge />
      </div>
    </div>
  );
}

function SoonBadge() {
  const t = useT();
  return (
    <div className="flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-2 py-[3px] backdrop-blur-[2px]">
      <p className="whitespace-nowrap text-center font-['PT_Root_UI',sans-serif] text-[11px] font-medium leading-[1.1] text-white">{t("partners.soon")}</p>
    </div>
  );
}

function PartnerLogo({ name }: { name: "syntx" | "freepik" | "higgsfield" | "canva" }) {
  return <Picture data={partnerSrcMap[name]} width={268} height={80} alt={name} loading="eager" className="h-full w-full object-contain" />;
}

function Steps() {
  const t = useT();
  const { lang } = useLang();
  const stepsSrc = lang === "ru" ? stepsInnerRuSrc : stepsInnerEnSrc;
  return (
    <section id="features" className="bg-[#011417] px-5 py-[70px] md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Phase 2.2: JSX literal whitespace ("} <br />") creates an adjacent text-then-expression
            pair that React 18 SSR delimits with `<!-- -->` comments; React 18 hydration sometimes
            fails to reconcile these against the client tree → React #418 + #423 fall through to a
            full client re-render. Fix is to fold whitespace into the preceding expression so the
            JSX child list never has two adjacent text nodes. */}
        <SectionTitle>
          {titleCaseEn(t("steps.heading1"), lang) + " "}
          <br />
          <Accent>{titleCaseEn(t("steps.heading2"), lang)}</Accent>
        </SectionTitle>
        <div className="mt-[60px] grid items-stretch gap-12 md:mt-20 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-[56px] xl:gap-[80px] 2xl:gap-[120px]">
          <div className="flex flex-col gap-12 md:gap-14">
            <Step num="01" title={t("steps.01.title")} desc={t("steps.01.desc")} />
            <Step
              num="02"
              title={<>{t("steps.02.titlePre") + " "}<InlinePlanet />{" " + t("steps.02.titlePost")}</>}
              desc={t("steps.02.desc")}
            />
            <Step
              num="03"
              title={<>{t("steps.03.titlePre") + " "}<InlineStars />{" " + t("steps.03.titlePost")}</>}
              desc={t("steps.03.desc")}
              nowrapDesktop
            />
          </div>
          <div className="relative flex min-h-[420px] w-full shrink-0 overflow-hidden rounded-[16px] border border-white/10 bg-[#0e2023] lg:h-[512px] lg:w-[500px]">
            {/* Phase 2.2: steps-inner is the first below-fold image users scroll to; lazy
                made it pop in 1-2s after scroll on mobile 3G. Eager lets the browser start
                the fetch in parallel with critical resources. sizes tells the browser to
                pick the 430px variant on mobile (image renders ~318px wide) instead of
                downloading the 813px desktop variant. */}
            <Picture data={stepsSrc} width={813} height={638} alt="" loading="eager" sizes="(max-width: 768px) 320px, 430px" className="absolute left-1/2 top-1/2 w-[86%] max-w-[430px] -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <InstallButton />
        </div>
      </div>
    </section>
  );
}

function InlinePlanet() {
  return <img alt="" src={`${ASSET_ROOT}/optenicon.svg`} width="28" height="28" loading="lazy" className="inline size-7 align-[-4px]" />;
}

function InlineStars() {
  return <img alt="" src={`${ASSET_ROOT}/stars.svg`} width="28" height="28" loading="lazy" className="inline size-7 align-[-4px]" />;
}

function Step({ num, title, desc, nowrapDesktop = false }: { num: string; title: React.ReactNode; desc: string; nowrapDesktop?: boolean }) {
  return (
    <article className="grid grid-cols-[32px_1fr] gap-1 md:grid-cols-[48px_1fr] md:gap-3">
      <span className="font-['PT_Root_UI',sans-serif] text-[18px] leading-[1.6] text-white/45">{num}</span>
      <div>
        <h3 className={cx("font-['PT_Root_UI',sans-serif] text-[28px] font-medium leading-[1.12] text-white md:text-[36px]", nowrapDesktop && "xl:whitespace-nowrap")}>{title}</h3>
        <p className="mt-4 max-w-[590px] font-['PT_Root_UI',sans-serif] text-[17px] leading-[1.6] text-white/55 md:text-[18px]">{desc}</p>
      </div>
    </article>
  );
}

function FeatureCards() {
  const t = useT();
  const { lang } = useLang();
  const suffix = lang === "ru" ? "ru" : "en";

  return (
    <section className="bg-[#011417] px-5 py-[70px] md:py-24">
      <div className="mx-auto max-w-[1240px]">
        <div className="relative mx-auto max-w-[1000px] text-center">
          <SectionTitle>
            {titleCaseEn(t("features.heading1"), lang) + " "}
            <br />
            {titleCaseEn(t("features.heading2"), lang)}
          </SectionTitle>
          <img alt="" src={`${ASSET_ROOT}/cross.svg`} width="150" height="126" loading="lazy" className="pointer-events-none absolute left-1/2 top-1/2 w-[150px] -translate-x-1/2 -translate-y-1/2 md:w-[205px]" />
        </div>
        <div className="mt-[60px] grid gap-3 md:mt-20 md:grid-cols-2">
          {/* Phase 2.2: first feature card is closest to viewport on the typical mobile scroll
              path; load it eagerly (low priority) so users don't see a 1-2s blank below the
              steps section. Cards 2-4 stay lazy. */}
          <FeatureCard title={t("features.card1.title")} desc={t("features.card1.desc")} imgData={featureModelsSrc} imgWidth={1100} imgHeight={424} loading="eager" />
          <FeatureCard title={t("features.card2.title")} desc={t("features.card2.desc")} imgData={suffix === "ru" ? featureInterfaceRuSrc : featureInterfaceEnSrc} imgWidth={1100} imgHeight={424} imageFirst />
          <FeatureCard title={t("features.card3.title")} desc={t("features.card3.desc")} imgData={featureCreditsSrc} imgWidth={1100} imgHeight={424} />
          <FeatureCard title={t("features.card4.title")} desc={t("features.card4.desc")} imgData={suffix === "ru" ? featureEnhanceRuSrc : featureEnhanceEnSrc} imgWidth={1100} imgHeight={372} />
        </div>
        <div className="mt-16 flex justify-center">
          <InstallButton />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc, imgData, imgWidth, imgHeight, imageFirst = false, loading = "lazy" }: { title: string; desc: string; imgData: PictureData; imgWidth: number; imgHeight: number; imageFirst?: boolean; loading?: "eager" | "lazy" }) {
  // sizes: on mobile single-column grid the card is full viewport minus padding (~320px),
  // on desktop two-column grid each card is ~500px. Browser picks the right srcset entry.
  const sizes = "(max-width: 768px) 320px, 500px";
  return (
    <article className="flex min-h-[405px] flex-col overflow-hidden rounded-[12px] border border-white/10 bg-[#0e2023]">
      {imageFirst && <Picture data={imgData} width={imgWidth} height={imgHeight} alt="" loading={loading} sizes={sizes} className="mx-8 h-auto w-[calc(100%-64px)] rounded-[4px] object-contain" />}
      <div className="p-8">
        <h3 className="font-['PT_Root_UI',sans-serif] text-[24px] font-medium leading-[1.12] text-white">{title}</h3>
        <p className="mt-4 whitespace-pre-wrap font-['PT_Root_UI',sans-serif] text-[16px] leading-[1.65] text-white/55">{desc}</p>
      </div>
      {!imageFirst && <Picture data={imgData} width={imgWidth} height={imgHeight} alt="" loading={loading} sizes={sizes} className="mx-8 mt-auto h-auto w-[calc(100%-64px)] rounded-[4px] object-contain" />}
    </article>
  );
}

function Privacy() {
  const t = useT();
  const { lang } = useLang();
  return (
    <section id="faq" className="bg-[#011417] px-5 py-[70px] md:py-24">
      <div className="mx-auto grid w-full max-w-[1240px] gap-y-5 lg:grid-cols-[460px_1fr] lg:gap-[200px]">
        <h2 className="w-full min-w-0 text-center font-['Unbounded',sans-serif] text-[36px] font-bold leading-[1.1] text-white md:text-[52px] lg:text-left">{titleCaseEn(t("privacy.sectionTitle"), lang)}</h2>
        <div className="flex w-full min-w-0 flex-col lg:-mt-10">
          <PrivacyItem title={t("privacy.item1.title")} desc={t("privacy.item1.desc")} />
          <PrivacyItem title={t("privacy.item2.title")} desc={t("privacy.item2.desc")} />
          <PrivacyItem title={t("privacy.item3.title")} desc={t("privacy.item3.desc")} last />
        </div>
      </div>
    </section>
  );
}

function PrivacyItem({ title, desc, last = false }: { title: string; desc: string; last?: boolean }) {
  return (
    <article className={cx("w-full min-w-0 pt-10", last ? "pb-0 md:pb-10" : "pb-10 border-b border-white/10")}>
      <h3 className="font-['PT_Root_UI',sans-serif] text-[28px] font-medium leading-[1.15] text-white md:text-[32px]">{title}</h3>
      <div className="mt-6 flex min-w-0 gap-6">
        <img alt="" src={`${ASSET_ROOT}/stars.svg`} width="20" height="20" loading="lazy" className="mt-1 size-5 shrink-0" />
        <p className="min-w-0 font-['PT_Root_UI',sans-serif] text-[18px] leading-[1.65] text-white/55">{desc}</p>
      </div>
    </article>
  );
}

function Pricing() {
  const t = useT();
  const { lang } = useLang();
  const isRu = lang === "ru";
  const onetimePrice = isRu ? t("pricing.onetime.price") : t("pricing.onetime.priceUsd");
  const proPrice = isRu ? t("pricing.pro.price") : t("pricing.pro.priceUsd");
  return (
    <section id="pricing" className="bg-[#011417] px-5 py-[70px] md:py-24">
      <div className="mx-auto max-w-[800px]">
        <SectionTitle className="w-[calc(100vw-24px)] md:w-auto">
          {isRu ? (
            <>
              <span className="md:hidden">Скачай бесплатно. <Accent>Перейди на Pro,</Accent> когда будешь готов.</span>
              <span className="hidden md:inline">Скачай бесплатно.<br /><Accent>Перейди на Pro,</Accent><br />когда будешь готов.</span>
            </>
          ) : (
            <>
              <span className="md:hidden">Start Free. <Accent>Upgrade To Pro</Accent> When You're Ready.</span>
              <span className="hidden md:inline">Start Free.<br /><Accent>Upgrade To Pro</Accent><br />When You're Ready.</span>
            </>
          )}
        </SectionTitle>
        <div className="mt-[60px] grid gap-6 md:mt-16 md:grid-cols-2">
          <PlanCard
            dark
            title={t("pricing.onetime.subtitle")}
            price={onetimePrice}
            features={[t("pricing.onetime.feature1"), t("pricing.onetime.feature2"), t("pricing.onetime.feature3"), t("pricing.onetime.feature4"), t("pricing.onetime.feature5")]}
            buttonText={t("pay.onetime.tryBtn")}
          />
          <PlanCard
            title={t("pricing.pro.subtitle")}
            price={proPrice}
            period={t("pricing.pro.period")}
            features={[t("pricing.pro.feature1"), t("pricing.pro.feature2"), t("pricing.pro.feature3"), t("pricing.pro.feature4"), t("pricing.pro.feature5")]}
            buttonText={t("pay.pro.tryBtn")}
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({ title, price, period, features, buttonText, dark = false }: { title: string; price: string; period?: string; features: string[]; buttonText: string; dark?: boolean }) {
  return (
    <article className={cx("relative flex min-h-[600px] flex-col justify-between rounded-[12px] border p-8", dark ? "border-white/10 bg-[#0e2023] text-white" : "border-white/10 bg-[#9cfb51] text-[#011417]")}>
      <div>
        <h3 className="font-['PT_Root_UI',sans-serif] text-[24px] font-medium leading-[1.1] tracking-[-0.48px]">{title}</h3>
        <div className="mt-8 flex items-end gap-2">
          <span className={cx("font-['Unbounded',sans-serif] text-[48px] font-bold leading-[1.1] tracking-[-0.96px]", dark && "text-[#9cfb51]")}>{price}</span>
          {period ? <span className={cx("pb-1 font-['PT_Root_UI',sans-serif] text-[16px] leading-[2]", dark ? "text-white/55" : "text-[#011417]/60")}>{period}</span> : null}
        </div>
        <div className={cx("my-12 h-px", dark ? "bg-white/10" : "bg-[#011417]/12")} />
        <ul className="space-y-3 font-['PT_Root_UI',sans-serif] text-[17px] md:text-[18px]">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <Check className={cx("mt-1 size-[18px] shrink-0 stroke-[1.8]", dark ? "text-white/60" : "text-[#011417]/70")} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {dark ? (
        <LocalizedLink to="/pay" className="inline-flex h-16 w-full items-center justify-center rounded-full bg-white px-6 font-['PT_Root_UI',sans-serif] text-[18px] font-bold text-[#011417] transition hover:-translate-y-0.5">
          {buttonText}
        </LocalizedLink>
      ) : (
        <LocalizedLink to="/pay" className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#011417] px-6 font-['PT_Root_UI',sans-serif] text-[18px] font-bold text-[#9cfb51] transition hover:-translate-y-0.5">
          <Rocket size={24} fill="currentColor" />
          <span>{buttonText}</span>
        </LocalizedLink>
      )}
    </article>
  );
}

function Footer() {
  const t = useT();
  const { lang } = useLang();
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
        <div className="mt-8 flex items-center justify-center gap-3 font-['PT_Root_UI',sans-serif] text-[18px] text-white">
          <Check className="size-[18px] stroke-[1.8]" />
          <span>{t("cta.freeLabel")}</span>
        </div>
        <div className="mt-20 flex flex-wrap justify-center gap-x-5 gap-y-4 font-['PT_Root_UI',sans-serif] text-[16px] text-white/40 sm:gap-8">
          {/* Phase 4 D-01 / D-16: About link, RU-only (footer mirror). */}
          {lang === "ru" && (
            <LocalizedLink to="/about" className="hover:text-white">{t("nav.about")}</LocalizedLink>
          )}
          <LocalizedLink to="/privacy" className="hover:text-white">{t("footer.privacy")}</LocalizedLink>
          <LocalizedLink to="/terms" className="hover:text-white">{t("footer.terms")}</LocalizedLink>
          <LocalizedLink to="/refund" className="hover:text-white">{t("footer.refund")}</LocalizedLink>
          <a href="https://t.me/v_voronezhtsev" target="_blank" rel="noopener noreferrer" className="hover:text-white">{t("footer.contact")}</a>
        </div>
        <p className="mt-4 font-['PT_Root_UI',sans-serif] text-[16px] text-white/30">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cx("mx-auto text-center font-['Unbounded',sans-serif] text-[36px] font-bold leading-[1.1] text-white sm:text-[46px] md:text-[52px]", className)}>
      {children}
    </h2>
  );
}

function GradientBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("pointer-events-none absolute rounded-[50%] bg-[#9cfb51] opacity-20 blur-[175px]", className)}
    />
  );
}

export default function App() {
  const t = useT();
  const { lang } = useLang();

  useEffect(() => {
    document.title = t("meta.title");
  }, [t]);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-[#011417] text-white">
      <Navbar />
      <Hero />
      <Partners />
      <Steps />
      <FeatureCards />
      <Privacy />
      <Pricing />
      {/* Phase 4 D-08 / GEO-D-3: landing FAQ block — schema in seo-routes.ts mirrors landingFaq[lang] (V-10). */}
      <FaqBlock items={landingFaq[lang]} />
      <Footer />
    </div>
  );
}
