import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useT, useLang } from "../i18n/LangContext";
import { Link } from "react-router";
const OptenHeroAnimation = lazy(() => import("./components/OptenHeroAnimation"));
import svgPaths from "../imports/LandingPage/svg-bvy0jfb1g6";
import imgImage1 from "../imports/LandingPage/fa3631bfe3de9114866b4560b13297991ede111d.png";
import imgFrame161 from "../imports/LandingPage/a4aab81523531c9d1cdd22f1a16ebda5bcca69aa.png";
import imgFrame231 from "../imports/LandingPage/6fe2b2e482114aaece3557d61a780f48e409ae7a.png";
import imgFrame233 from "../imports/LandingPage/643b83f6ac31944ea5c6501794954e84df3835ec.png";
import imgFrame233En from "../imports/LandingPage/imgFrame233-en.png";
import imgFrame234 from "../imports/LandingPage/5d0e2aab408679eb569960b14c42e066e5a20b92.png";
import imgFrame232 from "../imports/LandingPage/dc7c40ef44dccb75d38f341e5a8e7f03b9d865a4.png";
import imgFrame232En from "../imports/LandingPage/imgFrame232-en.png";
import imgFrame37 from "../imports/LandingPage/da31c95f5bc0f013c26804882654e49618ec43c7.png";
import imgChromeLg from "../imports/LandingPage/chrome-icon-lg.svg";
import imgYandexLg from "../imports/LandingPage/yandex-icon-lg.svg";
import imgChromeSm from "../imports/LandingPage/chrome-icon-sm.svg";
import imgYandexSm from "../imports/LandingPage/yandex-icon-sm.svg";

/* ─── Scroll animation hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}

/* ─── Reusable SVG Icons ─── */
function ChromeIconSmall() {
  return (
    <div className="relative shrink-0 size-[15px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip_chrome_sm)">
          <path d={svgPaths.p8cb8900} fill="#F1F3F4" />
          <path d={svgPaths.p191fd780} fill="url(#p_chrome_sm_0)" />
          <path d={svgPaths.p2affbc00} fill="#1A73E8" />
          <path d={svgPaths.p27a43300} fill="url(#p_chrome_sm_1)" />
          <path d={svgPaths.p9dcf560} fill="url(#p_chrome_sm_2)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_sm_0" x1="1.00531" x2="13.9941" y1="4.6875" y2="4.6875"><stop stopColor="#D93025" /><stop offset="1" stopColor="#EA4335" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_sm_1" x1="6.47562" x2="12.97" y1="14.8997" y2="3.65125"><stop stopColor="#FCC934" /><stop offset="1" stopColor="#FBBC04" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_sm_2" x1="8.31188" x2="1.8175" y1="14.5319" y2="3.28313"><stop stopColor="#1E8E3E" /><stop offset="1" stopColor="#34A853" /></linearGradient>
          <clipPath id="clip_chrome_sm"><rect fill="white" height="15" width="15" /></clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ChromeIconMed() {
  return (
    <div className="relative shrink-0 size-[23px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
        <g clipPath="url(#clip_chrome_md)">
          <path d={svgPaths.p19a6fb00} fill="white" />
          <path d={svgPaths.p8b6f480} fill="url(#p_chrome_md_0)" />
          <path d={svgPaths.p9ca2e00} fill="#1A73E8" />
          <path d={svgPaths.p27e1a780} fill="url(#p_chrome_md_1)" />
          <path d={svgPaths.p5178480} fill="url(#p_chrome_md_2)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_md_0" x1="1.54148" x2="21.4576" y1="7.1875" y2="7.1875"><stop stopColor="#D93025" /><stop offset="1" stopColor="#EA4335" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_md_1" x1="9.92929" x2="19.8873" y1="22.8462" y2="5.59858"><stop stopColor="#FCC934" /><stop offset="1" stopColor="#FBBC04" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_md_2" x1="12.7449" x2="2.78683" y1="22.2822" y2="5.03413"><stop stopColor="#1E8E3E" /><stop offset="1" stopColor="#34A853" /></linearGradient>
          <clipPath id="clip_chrome_md"><rect fill="white" height="23" width="23" /></clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ChromeIconLg() {
  return (
    <div className="relative shrink-0 w-[46px] h-[40px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 40">
        <g clipPath="url(#clip_chrome_lg)">
          <path d={svgPaths.pdb78400} fill="#F1F3F4" />
          <path d={svgPaths.pdb78400} fill="#F1F3F4" />
          <path d={svgPaths.p2c37f680} fill="#E8EAED" />
          <path d={svgPaths.pdaf5400} fill="url(#p_chrome_lg_0)" />
          <path d={svgPaths.pe345a00} fill="url(#p_chrome_lg_1)" />
          <path d={svgPaths.p347aee80} fill="url(#p_chrome_lg_2)" />
          <path d={svgPaths.p1247b800} fill="#F1F3F4" />
          <path d={svgPaths.p4730800} fill="#1A73E8" />
          <path d={svgPaths.p36cb4800} fill="#BDC1C6" opacity="0.1" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_lg_0" x1="5.79804" x2="40.1989" y1="29.3985" y2="29.3985"><stop stopColor="#D93025" /><stop offset="1" stopColor="#EA4335" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_lg_1" x1="25.1519" x2="7.9121" y1="55.5109" y2="25.692"><stop stopColor="#1E8E3E" /><stop offset="1" stopColor="#34A853" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_lg_2" x1="37.3579" x2="20.1187" y1="26.8733" y2="56.6912"><stop stopColor="#FBBC04" /><stop offset="1" stopColor="#FCC934" /></linearGradient>
          <clipPath id="clip_chrome_lg"><rect fill="white" height="40" width="46" /></clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 18 18">
        <path d={svgPaths.p11eab980} fill="white" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

function StarBullet() {
  return (
    <div className="h-[28px] shrink-0 w-[14px] relative">
      <div className="absolute inset-[-17.86%_-85.71%]">
        <svg className="block size-full" fill="none" viewBox="0 0 38 38">
          <g>
            <g filter="url(#star_glow)">
              <path d={svgPaths.p1ba15070} fill="#2777C3" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="38" id="star_glow" width="38" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.152941 0 0 0 0 0.466667 0 0 0 0 0.764706 0 0 0 1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

const STORE_URL = "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";

/* Кнопка Hero / Footer — большая, с подписью Chrome / Yandex Browser */
function InstallButtonLarge() {
  const t = useT();
  return (
    <a href={STORE_URL} target="_blank" rel="noopener noreferrer"
      className="btn-hover bg-white inline-flex gap-[12px] items-center pl-[10px] pr-[24px] py-[10px] rounded-[100px] relative cursor-pointer border-none no-underline">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      {/* Иконки Chrome + Yandex внахлёст */}
      <div className="flex items-center pr-[8px] shrink-0">
        <div className="relative shrink-0 size-[40px] z-10">
          <img alt="Chrome" className="absolute block size-full" src={imgChromeLg} />
        </div>
        <div className="relative shrink-0 size-[40px] -ml-[8px]">
          <img alt="Yandex Browser" className="absolute block size-full" src={imgYandexLg} />
        </div>
      </div>
      <div className="flex flex-col items-start leading-[1.3] text-black whitespace-nowrap">
        <span className="font-['PT_Root_UI',sans-serif] text-[14px]">{t("hero.installBtnSub")}</span>
        <span className="font-['PT_Root_UI',sans-serif] font-bold text-[18px]">{t("hero.installBtn")}</span>
      </div>
    </a>
  );
}

/* Кнопка для остальных мест — меньше, без подписи. На мобильных без иконок */
function InstallButtonSmall() {
  const t = useT();
  return (
    <a href={STORE_URL} target="_blank" rel="noopener noreferrer"
      className="btn-hover bg-white inline-flex gap-[12px] items-center justify-center px-[24px] py-[16px] rounded-[100px] relative cursor-pointer border-none no-underline">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
      {/* Иконки Chrome + Yandex — скрыты на мобильных */}
      <div className="hidden md:flex items-center pr-[8px] shrink-0">
        <div className="relative shrink-0 size-[32px] z-10">
          <img alt="Chrome" className="absolute block size-full" src={imgChromeSm} />
        </div>
        <div className="relative shrink-0 size-[32px] -ml-[8px]">
          <img alt="Yandex Browser" className="absolute block size-full" src={imgYandexSm} />
        </div>
      </div>
      <span className="font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-black whitespace-nowrap">{t("hero.installBtn")}</span>
    </a>
  );
}

/* Оставляем для совместимости с тарифами */
function InstallButtonWhite({ text = "Установить бесплатно" }: { text?: string }) {
  return <InstallButtonSmall />;
}

function Divider({ width = "100%" }: { width?: string }) {
  return (
    <div className="w-full h-[1px] shrink-0 bg-[rgba(255,255,255,0.1)]" />
  );
}

/* ─── Logo ─── */
function Logo() {
  return (
    <div className="inline-grid grid-cols-[max-content] grid-rows-[max-content] leading-[0] place-items-start relative shrink-0">
      <div className="col-start-1 row-start-1 h-[20px] w-[17.45px] relative">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4501 20">
          <path d={svgPaths.p1af53b80} fill="white" />
          <path d={svgPaths.p11bbe580} fill="white" />
          <path d={svgPaths.p3028f5f0} fill="white" />
        </svg>
      </div>
      <div className="col-start-1 row-start-1 h-[19.014px] ml-[24.73px] mt-[1.99px] w-[57.84px] relative">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.8402 19.0139">
          <path d={svgPaths.p2caec700} fill="white" />
          <path d={svgPaths.p395c8980} fill="white" />
          <path d={svgPaths.p11961000} fill="white" />
          <path d={svgPaths.p1de84f00} fill="white" />
          <path d={svgPaths.p355f7e80} fill="white" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useT();
  const { lang, setLang } = useLang();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.title = t("meta.title");
  }, [t]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-[8px]" : "py-[21px]"}`}>
      <div className={`max-w-[1100px] mx-[8px] lg:mx-auto flex items-center justify-between rounded-[1000px] py-[8px] pl-[24px] pr-[8px] transition-all duration-300 ${scrolled ? "bg-[rgba(0,0,0,0.6)] backdrop-blur-[12px]" : "bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px]"}`}>
        {/* Mobile hamburger */}
        <button className="md:hidden mr-auto text-white cursor-pointer bg-transparent border-none p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex flex-1 gap-[24px] items-center font-['PT_Root_UI',sans-serif] text-[14px] text-white">
          <a href="#features" className="hover:opacity-80 transition-opacity">{t("nav.features")}</a>
          <a href="#pricing" className="hover:opacity-80 transition-opacity">{t("nav.pricing")}</a>
          <a href="#faq" className="hover:opacity-80 transition-opacity">{t("nav.faq")}</a>
          <button
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-['PT_Root_UI',sans-serif]"
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>
        </div>

        <Logo />

        <div className="flex-1 flex justify-end ml-auto md:ml-0">
          <Link to="/account" className="btn-hover bg-white flex gap-[8px] items-center justify-center p-[12px] px-[20px] rounded-[100px] cursor-pointer border-none no-underline">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 7.5a3 3 0 100-6 3 3 0 000 6zM7.5 9C4.46 9 2 10.34 2 12v1.5h11V12c0-1.66-2.46-3-5.5-3z" fill="#181818"/></svg>
            <span className="hidden sm:inline font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[14px] text-[#181818] text-center whitespace-nowrap">{t("nav.account")}</span>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(0,0,0,0.9)] backdrop-blur-[12px] mx-[16px] mt-[8px] rounded-[16px] p-[24px] flex flex-col gap-[20px] font-['PT_Root_UI',sans-serif] text-[16px] text-white">
          <a href="#features" className="hover:opacity-80" onClick={() => setMenuOpen(false)}>{t("nav.features")}</a>
          <a href="#pricing" className="hover:opacity-80" onClick={() => setMenuOpen(false)}>{t("nav.pricing")}</a>
          <a href="#faq" className="hover:opacity-80" onClick={() => setMenuOpen(false)}>{t("nav.faq")}</a>
          <Link to="/account" className="hover:opacity-80" onClick={() => setMenuOpen(false)}>{t("nav.account")}</Link>
          <button
            onClick={() => { setLang(lang === "ru" ? "en" : "ru"); setMenuOpen(false); }}
            className="text-left text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-['PT_Root_UI',sans-serif] text-[16px] p-0"
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const t = useT();
  return (
    <section className="bg-[#181818] relative overflow-clip w-full min-h-[600px] md:h-[850px]">
      <style>{`
        .hero-anim-wrap { display: none !important; }
        .hero-fallback { display: flex !important; }
        @media (min-width: 1066px) {
          .hero-anim-wrap { display: flex !important; }
          .hero-fallback { display: none !important; }
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <img alt="" className="min-w-full min-h-full object-cover pointer-events-none" src={imgImage1} />
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] via-[rgba(0,0,0,0.2)] to-black inset-0" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-[120px] pb-[60px] px-[20px]">
        {/* Desktop layout (>=1066px): no badge, tighter gap, animation */}
        <div className="hero-anim-wrap w-full flex-col items-center">
          <div className="flex flex-col gap-[19px] items-center max-w-[590px]" style={{ paddingTop: 30 }}>
            <h1 className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[62px] text-center text-white tracking-[-1.24px]">
              {t("hero.title")}
            </h1>
            <p className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[18px] text-center text-white">
              <span>{t("hero.subtitle1")}</span>
              <span className="font-bold">{t("hero.subtitle2")}</span>
            </p>
          </div>
          <div className="mt-[45px] overflow-visible" style={{ width: 680, position: "relative" }}>
            <Suspense fallback={<div style={{ height: 170 }} />}>
              <OptenHeroAnimation />
            </Suspense>
          </div>
          <div className="mt-[45px]">
            <InstallButtonLarge />
          </div>
        </div>

        {/* Mobile/tablet layout (<1066px): original design, no animation */}
        <div className="hero-fallback flex-col items-center gap-[24px]">
          <div className="flex flex-col gap-[24px] items-center max-w-[590px]">
            <div className="flex gap-[6px] items-start flex-wrap justify-center">
              <div className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.1)] flex items-center justify-center px-[12px] py-[6px] rounded-[100px] relative">
                <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[100px]" />
                <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[14px] text-center text-white whitespace-nowrap">{t("hero.badge")}</p>
              </div>
            </div>
            <h1 className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[36px] sm:text-[48px] text-center text-white tracking-[-1.24px]">
              {t("hero.title")}
            </h1>
            <p className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[16px] text-center text-white">
              <span>{t("hero.subtitle1")}</span>
              <span className="font-bold">{t("hero.subtitle2")}</span>
            </p>
          </div>
          <div className="mt-[48px]">
            <InstallButtonLarge />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Partners Section ─── */
function SoonBadge() {
  const t = useT();
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center px-[8px] py-[3px] rounded-[100px]">
      <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[11px] text-center text-white whitespace-nowrap">{t("partners.soon")}</p>
    </div>
  );
}

function PartnersSection() {
  const t = useT();
  return (
    <section className="bg-black w-full">
      <RevealSection>
        <div className="flex flex-col items-center justify-center pb-[56px] px-[20px] md:px-[120px]">
          <div className="flex flex-col gap-[24px] items-center">
            <p className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[16px] md:text-[18px] text-[rgba(255,255,255,0.6)] text-center">
              {t("partners.label")}
            </p>
            {/* Десктоп: одна строка */}
            <div className="hidden md:flex gap-[80px] items-center justify-center">
              <a href="https://syntx.ai/welcome/GlUETIt6" target="_blank" rel="noopener noreferrer" className="relative hover:opacity-80 transition-opacity w-[134px] h-[40px]">
                <img alt="Syntx" className="w-full h-full object-contain" src="/assets/partners/syntx.png" />
              </a>
              <div className="relative w-[134px] h-[40px]">
                <img alt="Freepik" className="w-full h-full object-contain" src="/assets/partners/freepik.png" />
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"><SoonBadge /></div>
              </div>
              <div className="relative w-[134px] h-[40px]">
                <img alt="Higgsfield" className="w-full h-full object-contain" src="/assets/partners/higgsfield.png" />
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"><SoonBadge /></div>
              </div>
              <div className="relative w-[134px] h-[40px]">
                <img alt="Canva" className="w-full h-full object-contain" src="/assets/partners/canva.png" />
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"><SoonBadge /></div>
              </div>
            </div>
            {/* Мобильный: 2×2 сетка */}
            <div className="flex md:hidden flex-col gap-[40px] items-center w-full max-w-[320px]">
              <div className="flex items-center justify-between w-full">
                <a href="https://syntx.ai/welcome/GlUETIt6" target="_blank" rel="noopener noreferrer" className="relative hover:opacity-80 transition-opacity w-[134px] h-[40px]">
                  <img alt="Syntx" className="w-full h-full object-contain" src="/assets/partners/syntx.png" />
                </a>
                <div className="relative w-[134px] h-[40px]">
                  <img alt="Freepik" className="w-full h-full object-contain" src="/assets/partners/freepik.png" />
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"><SoonBadge /></div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="relative w-[134px] h-[40px]">
                  <img alt="Higgsfield" className="w-full h-full object-contain" src="/assets/partners/higgsfield.png" />
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"><SoonBadge /></div>
                </div>
                <div className="relative w-[134px] h-[40px]">
                  <img alt="Canva" className="w-full h-full object-contain" src="/assets/partners/canva.png" />
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"><SoonBadge /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

/* ─── Three Steps Section ─── */
function ThreeStepsSection() {
  const t = useT();
  const { lang } = useLang();
  return (
    <section id="features" className="bg-black w-full">
      <div className="flex flex-col items-center overflow-clip">
        <div className="flex flex-col gap-[48px] md:gap-[72px] items-center px-[20px] md:px-[100px] py-[60px] md:py-[80px] w-full max-w-[1440px]">
          <RevealSection>
            <div className="font-['PT_Root_UI',sans-serif] font-medium text-center text-white tracking-[-1.04px]">
              <p className="leading-[1.1] text-[32px] sm:text-[42px] md:text-[52px] text-[rgba(255,255,255,0.6)]">{t("steps.heading1")}</p>
              <p className="leading-[1.1] text-[32px] sm:text-[42px] md:text-[52px]">{t("steps.heading2")}</p>
            </div>
          </RevealSection>

          <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[120px] items-start justify-center w-full">
            <div className="flex flex-col gap-[40px] md:gap-[56px] flex-1">
              <RevealSection>
                <StepItem num="01" title={t("steps.01.title")} desc={t("steps.01.desc")} />
              </RevealSection>
              <RevealSection>
                <StepItem num="02" title={<>{t("steps.02.titlePre")} <OptenInlineIcon /> {t("steps.02.titlePost")}</>} desc={t("steps.02.desc")} />
              </RevealSection>
              <RevealSection>
                <StepItem num="03" title={<>{t("steps.03.titlePre")} <SparkleInlineIcon /> {t("steps.03.titlePost")}</>} desc={t("steps.03.desc")} />
              </RevealSection>
            </div>
            <div className="w-full lg:w-[500px] shrink-0">
              <img alt="" className="w-full h-auto object-cover rounded-[8px]" src={lang === "ru" ? "/assets/frame-53.png" : "/assets/frame-53-en.png"} />
            </div>
          </div>

          <RevealSection>
            <InstallButtonWhite />
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

function OptenInlineIcon() {
  return (
    <span className="inline-block relative w-[22px] h-[25px] align-middle mx-[2px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.8126 25.0001">
        <path d={svgPaths.p7c6c400} fill="white" />
        <path d={svgPaths.p1f56500} fill="white" />
        <path d={svgPaths.pf7df100} fill="white" />
      </svg>
    </span>
  );
}

function SparkleInlineIcon() {
  return (
    <span className="inline-block relative size-[25px] align-middle mx-[2px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 25 25">
        <path clipRule="evenodd" d={svgPaths.p2d8d1100} fill="white" fillRule="evenodd" />
      </svg>
    </span>
  );
}

function StepItem({ num, title, desc }: { num: string; title: React.ReactNode; desc: string }) {
  return (
    <div className="flex gap-[24px] items-start w-full">
      <span className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[18px] text-[rgba(255,255,255,0.6)]">{num}</span>
      <div className="flex flex-col gap-[12px]">
        <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[28px] md:text-[40px] text-white tracking-[-0.8px]">{title}</p>
        <p className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[16px] md:text-[18px] text-[rgba(255,255,255,0.6)]">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Feature Cards Section ─── */
function FeatureCardsSection() {
  const t = useT();
  const { lang } = useLang();
  return (
    <section className="bg-black w-full">
      <div className="flex flex-col items-center overflow-clip">
        <div className="flex flex-col gap-[48px] md:gap-[72px] items-center px-[20px] md:px-[100px] py-[60px] md:py-[80px] w-full max-w-[1440px]">
          <RevealSection>
            <div className="font-['PT_Root_UI',sans-serif] font-medium text-center text-white tracking-[-1.04px]">
              <p className="leading-[1.1] text-[32px] sm:text-[42px] md:text-[52px]">{t("features.heading1")}</p>
              <p className="leading-[1.1] text-[32px] sm:text-[42px] md:text-[52px]">{t("features.heading2")}</p>
            </div>
          </RevealSection>

          <div className="flex flex-col gap-[12px] w-full">
            <div className="flex flex-col md:flex-row gap-[12px] w-full">
              <RevealSection className="flex-1">
                <FeatureCard
                  title={t("features.card1.title")}
                  desc={t("features.card1.desc")}
                  img={imgFrame231}
                  imgPosition="bottom"
                />
              </RevealSection>
              <RevealSection className="flex-1">
                <FeatureCard
                  title={t("features.card2.title")}
                  desc={t("features.card2.desc")}
                  img={lang === "ru" ? imgFrame233 : imgFrame233En}
                  imgPosition="top"
                />
              </RevealSection>
            </div>
            <div className="flex flex-col md:flex-row gap-[12px] w-full">
              <RevealSection className="flex-1">
                <FeatureCard
                  title={t("features.card3.title")}
                  desc={t("features.card3.desc")}
                  img={imgFrame234}
                  imgPosition="bottom"
                />
              </RevealSection>
              <RevealSection className="flex-1">
                <FeatureCard
                  title={t("features.card4.title")}
                  desc={t("features.card4.desc")}
                  img={lang === "ru" ? imgFrame232 : imgFrame232En}
                  imgPosition="bottom"
                />
              </RevealSection>
            </div>
          </div>

          <RevealSection>
            <InstallButtonWhite />
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc, img, imgPosition }: { title: string; desc: string; img: string; imgPosition: "top" | "bottom" }) {
  return (
    <div className="card-hover bg-[#0d0d0d] md:min-h-[400px] relative rounded-[12px] overflow-clip h-full">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[12px]" />
      <div className={`flex flex-col gap-[40px] p-[32px] h-full`}>
        {imgPosition === "top" && <img alt="" className="w-full h-auto object-contain rounded-[4px]" src={img} />}
        <div className="flex flex-col gap-[12px]">
          <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[20px] md:text-[24px] text-white tracking-[-0.48px]">{title}</p>
          <p className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[14px] md:text-[16px] text-[rgba(255,255,255,0.6)] whitespace-pre-wrap">{desc}</p>
        </div>
        {imgPosition === "bottom" && <img alt="" className="w-full h-auto object-contain rounded-[4px] mt-auto" src={img} />}
      </div>
    </div>
  );
}

/* ─── Privacy Section ─── */
function PrivacySection() {
  const t = useT();
  return (
    <section id="faq" className="bg-black w-full">
      <div className="flex flex-row justify-center overflow-clip">
        <div className="flex flex-col lg:flex-row gap-[48px] lg:gap-[100px] items-start px-[20px] md:px-[100px] py-[60px] md:py-[80px] w-full max-w-[1440px]">
          <RevealSection>
            <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[36px] md:text-[52px] text-white tracking-[-1.04px] max-w-[394px] text-center md:text-left">{t("privacy.sectionTitle")}</p>
          </RevealSection>
          <div className="flex flex-col gap-[48px] md:gap-[64px] flex-1">
            <RevealSection>
              <PrivacyItem title={t("privacy.item1.title")} desc={t("privacy.item1.desc")} />
            </RevealSection>
            <Divider />
            <RevealSection>
              <PrivacyItem title={t("privacy.item2.title")} desc={t("privacy.item2.desc")} />
            </RevealSection>
            <Divider />
            <RevealSection>
              <PrivacyItem title={t("privacy.item3.title")} desc={t("privacy.item3.desc")} />
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[24px] md:text-[32px] text-white tracking-[-0.64px]">{title}</p>
      <div className="flex gap-[24px] items-start w-full">
        <StarBullet />
        <p className="flex-1 font-['PT_Root_UI',sans-serif] leading-[1.6] text-[16px] md:text-[18px] text-[rgba(255,255,255,0.6)]">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Pricing Section ─── */
function PricingSection() {
  const t = useT();
  return (
    <section id="pricing" className="bg-black w-full border-none">
      <div className="flex flex-col items-center overflow-clip">
        <div className="flex flex-col gap-[40px] md:gap-[56px] items-center px-[20px] md:px-[100px] py-[60px] md:py-[80px] w-full max-w-[1440px]">
          <RevealSection>
            <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[32px] sm:text-[42px] md:text-[52px] text-center text-white tracking-[-1.04px] max-w-[650px]">{t("pricing.heading")}</p>
          </RevealSection>

          <div className="flex flex-col md:flex-row gap-[24px] w-full max-w-[800px]">
            <RevealSection className="flex-1">
              <div className="card-hover bg-[#0d0d0d] rounded-[12px] h-[600px] relative overflow-clip">
                <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[12px]" />
                <div className="flex flex-col justify-between p-[32px] h-full">
                  <div className="flex flex-col gap-[40px]">
                    <div className="flex flex-col gap-[12px]">
                      <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[24px] text-white tracking-[-0.48px]">{t("pricing.free.name")}</p>
                      <div className="flex gap-[6px] items-end">
                        <span className="font-['PT_Root_UI',sans-serif] leading-[1.1] text-[48px] text-white tracking-[-0.96px]">{t("pricing.free.price")}</span>
                        <span className="font-['PT_Root_UI',sans-serif] leading-[2] text-[16px] text-[rgba(255,255,255,0.6)]">{t("pricing.free.period")}</span>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-[12px]">
                      <PricingFeature text={t("pricing.free.feature1")} />
                      <PricingFeature text={t("pricing.free.feature2")} />
                      <PricingFeature text={t("pricing.free.feature3")} />
                      <PricingFeature text={t("pricing.free.feature4")} />
                    </div>
                  </div>
                  <InstallButtonWhite />
                </div>
              </div>
            </RevealSection>

            <RevealSection className="flex-1">
              <div className="card-hover rounded-[12px] h-[600px] relative overflow-clip">
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
                  <div className="absolute bg-[#0d0d0d] inset-0 rounded-[12px]" />
                  <img alt="" className="absolute max-w-none object-cover rounded-[12px] size-full" src={imgFrame37} />
                  <div className="absolute bg-[rgba(0,0,0,0.48)] inset-0 rounded-[12px]" />
                </div>
                <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[12px] z-10" />
                <div className="relative z-10 flex flex-col justify-between p-[32px] h-full">
                  <div className="flex flex-col gap-[40px]">
                    <div className="flex flex-col gap-[12px]">
                      <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[24px] text-white tracking-[-0.48px]">{t("pricing.pro.name")}</p>
                      <div className="flex gap-[6px] items-end">
                        <span className="font-['PT_Root_UI',sans-serif] leading-[1.1] text-[48px] text-white tracking-[-0.96px]">{t("pricing.pro.price")}</span>
                        <span className="font-['PT_Root_UI',sans-serif] leading-[2] text-[16px] text-[rgba(255,255,255,0.6)]">{t("pricing.pro.period")}</span>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-[12px]">
                      <PricingFeature text={t("pricing.pro.feature1")} />
                      <PricingFeature text={t("pricing.pro.feature2")} />
                      <PricingFeature text={t("pricing.pro.feature3")} />
                      <PricingFeature text={t("pricing.pro.feature4")} />
                      <PricingFeature text={t("pricing.pro.feature5")} />
                    </div>
                  </div>
                  <Link to="/pay" className="btn-hover bg-white inline-flex gap-[12px] items-center justify-center px-[32px] py-[18px] rounded-[100px] relative cursor-pointer border-none no-underline">
                    <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
                    <span className="font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-black whitespace-nowrap">{t("pricing.pro.btn")}</span>
                  </Link>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <div className="flex gap-[8px] items-center">
      <CheckIcon />
      <span className="font-['PT_Root_UI',sans-serif] leading-[1.5] text-[16px] md:text-[18px] text-white">{text}</span>
    </div>
  );
}

/* ─── Footer CTA Section ─── */
function FooterSection() {
  const t = useT();
  return (
    <section className="bg-black relative w-full overflow-clip border-none">
      {/* BG image centered */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <img alt="" className="w-full h-full object-cover" src={imgFrame37} />
        </div>
      </div>
      {/* Top gradient: black fading into the image */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.6) 30%, transparent 50%)' }} />
      {/* Bottom gradient: image fading back to black */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6) 80%, black 100%)' }} />

      <div className="relative z-10 flex flex-col gap-[60px] md:gap-[80px] items-center pb-[32px] pt-[100px] md:pt-[120px] px-[20px] md:px-[100px]">
        <RevealSection>
          <div className="flex flex-col gap-[24px] items-center text-center text-white max-w-[730px]">
            <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[36px] sm:text-[48px] md:text-[62px] tracking-[-1.24px]">{t("cta.title")}</p>
            <p className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[16px] md:text-[18px]">{t("cta.subtitle")}</p>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="flex flex-col gap-[24px] items-center">
            <InstallButtonLarge />
            <div className="flex gap-[12px] items-center">
              <CheckIcon />
              <span className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[18px] text-center text-white">{t("cta.freeLabel")}</span>
            </div>
          </div>
        </RevealSection>

        <div className="flex flex-col items-center gap-[16px]">
          <div className="flex flex-wrap justify-center gap-[20px] sm:gap-[32px] font-['PT_Root_UI',sans-serif] text-[14px] text-[rgba(255,255,255,0.4)]">
            <Link to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-white transition-colors no-underline text-inherit">{t("footer.terms")}</Link>
            <Link to="/refund" className="hover:text-white transition-colors no-underline text-inherit">{t("footer.refund")}</Link>
            <a href="https://t.me/v_voronezhtsev" target="_blank" rel="noopener noreferrer" className="flex gap-[8px] items-center hover:text-white transition-colors no-underline text-inherit">
              <div className="overflow-clip relative shrink-0 size-[14px]">
                <div className="absolute inset-[17.97%_8.92%_0.78%_7.33%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0741 14.6261">
                    <path clipRule="evenodd" d={svgPaths.p3150f900} fill="currentColor" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
              {t("footer.contact")}
            </a>
          </div>
          <span className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[14px] text-[rgba(255,255,255,0.3)] text-center">{t("footer.copyright")}</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Main App ─── */
export default function App() {
  return (
    <div className="w-full min-h-full bg-black">
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .btn-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
      <Navbar />
      <HeroSection />
      <PartnersSection />
      <ThreeStepsSection />
      <FeatureCardsSection />
      <PrivacySection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}