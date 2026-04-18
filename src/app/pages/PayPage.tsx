import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useT, useLang } from "../../i18n/LangContext";
import svgPaths from "../../imports/LandingPage/svg-bvy0jfb1g6";
import imgFrame37 from "../../imports/LandingPage/da31c95f5bc0f013c26804882654e49618ec43c7.webp";
import imgChromeSm from "../../imports/LandingPage/chrome-icon-sm.svg";
import imgYandexSm from "../../imports/LandingPage/yandex-icon-sm.svg";

const SUPABASE_FUNCTIONS_URL = "https://vuywydhwkqmihfztpkgl.supabase.co/functions/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAyODUsImV4cCI6MjA5MTAzNjI4NX0.A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg";
const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";
const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",  // Chrome Web Store
  "kcmcaeenfmfnpiaihicecnfnagejpcog",  // Local dev
];

type ExtStatus = "detecting" | "not_installed" | "not_logged_in" | "ready";

interface Subscription {
  plan: string;
  status: string | null;
  expires_at: string | null;
  auto_renew: boolean;
  card_last4: string | null;
  card_type: string | null;
  has_card: boolean;
}

/* ─── Reusable Icons (same as landing) ─── */

function ChromeIconSmall() {
  return (
    <div className="relative shrink-0 size-[15px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip_chrome_sm_pay)">
          <path d={svgPaths.p8cb8900} fill="#F1F3F4" />
          <path d={svgPaths.p191fd780} fill="url(#p_chrome_sm_pay_0)" />
          <path d={svgPaths.p2affbc00} fill="#1A73E8" />
          <path d={svgPaths.p27a43300} fill="url(#p_chrome_sm_pay_1)" />
          <path d={svgPaths.p9dcf560} fill="url(#p_chrome_sm_pay_2)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_sm_pay_0" x1="1.00531" x2="13.9941" y1="4.6875" y2="4.6875"><stop stopColor="#D93025" /><stop offset="1" stopColor="#EA4335" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_sm_pay_1" x1="6.47562" x2="12.97" y1="14.8997" y2="3.65125"><stop stopColor="#FCC934" /><stop offset="1" stopColor="#FBBC04" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_sm_pay_2" x1="8.31188" x2="1.8175" y1="14.5319" y2="3.28313"><stop stopColor="#1E8E3E" /><stop offset="1" stopColor="#34A853" /></linearGradient>
          <clipPath id="clip_chrome_sm_pay"><rect fill="white" height="15" width="15" /></clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ChromeIconMed() {
  return (
    <div className="relative shrink-0 size-[23px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
        <g clipPath="url(#clip_chrome_md_pay)">
          <path d={svgPaths.p19a6fb00} fill="white" />
          <path d={svgPaths.p8b6f480} fill="url(#p_chrome_md_pay_0)" />
          <path d={svgPaths.p9ca2e00} fill="#1A73E8" />
          <path d={svgPaths.p27e1a780} fill="url(#p_chrome_md_pay_1)" />
          <path d={svgPaths.p5178480} fill="url(#p_chrome_md_pay_2)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_md_pay_0" x1="1.54148" x2="21.4576" y1="7.1875" y2="7.1875"><stop stopColor="#D93025" /><stop offset="1" stopColor="#EA4335" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_md_pay_1" x1="9.92929" x2="19.8873" y1="22.8462" y2="5.59858"><stop stopColor="#FCC934" /><stop offset="1" stopColor="#FBBC04" /></linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="p_chrome_md_pay_2" x1="12.7449" x2="2.78683" y1="22.2822" y2="5.03413"><stop stopColor="#1E8E3E" /><stop offset="1" stopColor="#34A853" /></linearGradient>
          <clipPath id="clip_chrome_md_pay"><rect fill="white" height="23" width="23" /></clipPath>
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

function Logo() {
  return (
    <Link to="/" className="inline-grid grid-cols-[max-content] grid-rows-[max-content] leading-[0] place-items-start relative shrink-0 no-underline">
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
    </Link>
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

function Divider() {
  return <div className="w-full h-[1px] shrink-0 bg-[rgba(255,255,255,0.1)]" />;
}

/* ─── Page ─── */

export default function PayPage() {
  const t = useT();
  const { lang, setLang } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [extStatus, setExtStatus] = useState<ExtStatus>("detecting");
  const [scrolled, setScrolled] = useState(false);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);

  useEffect(() => {
    // 1. Check URL hash first (direct link from extension)
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const hashToken = params.get("token");
    if (hashToken) {
      setToken(hashToken);
      setExtStatus("ready");
      window.history.replaceState(null, "", window.location.pathname);
      fetchSubscription(hashToken);
    } else {
      // 2. Try to get token from extension via externally_connectable
      detectExtension();
    }

    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const detectExtension = () => {
    const chrome = (window as any).chrome;
    if (!chrome?.runtime?.sendMessage) {
      setExtStatus("not_installed");
      return;
    }
    // Try each known extension ID until one responds
    let tried = 0;
    for (const id of EXTENSION_IDS) {
      try {
        chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, (response: any) => {
          tried++;
          if (chrome.runtime.lastError || !response) {
            if (tried >= EXTENSION_IDS.length) setExtStatus("not_installed");
            return;
          }
          if (response.token) {
            setToken(response.token);
            if (response.email) setEmail(response.email);
            setExtStatus("ready");
            fetchSubscription(response.token);
          } else {
            setExtStatus("not_logged_in");
          }
        });
      } catch {
        tried++;
        if (tried >= EXTENSION_IDS.length) setExtStatus("not_installed");
      }
    }
  };

  const fetchSubscription = async (authToken: string) => {
    setLoadingSub(true);
    try {
      const res = await fetch(SUPABASE_FUNCTIONS_URL + "/get-subscription", {
        headers: {
          "Authorization": "Bearer " + authToken,
          "apikey": SUPABASE_ANON_KEY,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSub(data);
      }
    } catch {
      // silent — PayPage degrades gracefully (buttons remain enabled if fetch fails)
    } finally {
      setLoadingSub(false);
    }
  };

  const handlePay = async (recurring: boolean) => {
    if (!token) {
      setError(t("pay.error.sessionNotFound"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SUPABASE_FUNCTIONS_URL + "/create-payment", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "apikey": SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recurring }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || t("pay.error.paymentFailed"));
        setLoading(false);
        return;
      }
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url;
      } else {
        setError(t("pay.error.noUrl"));
        setLoading(false);
      }
    } catch {
      setError(t("pay.error.network"));
      setLoading(false);
    }
  };

  // D-10: active or cancelled (not yet expired) Pro blocks payment
  const hasActivePro = sub !== null && (sub.status === "active" || sub.status === "cancelled") && sub.plan !== "free";

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      <style>{`
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
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* ─── Navbar ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-[8px]" : "py-[21px]"}`}>
        <div className={`max-w-[1100px] mx-[8px] lg:mx-auto flex items-center justify-between rounded-[1000px] py-[8px] pl-[24px] pr-[8px] transition-all duration-300 ${scrolled ? "bg-[rgba(0,0,0,0.6)] backdrop-blur-[12px]" : "bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px]"}`}>
          <div className="hidden md:flex flex-1 gap-[24px] items-center font-['PT_Root_UI',sans-serif] text-[14px] text-white">
            <Link to="/" className="hover:opacity-80 transition-opacity">{t("nav.home")}</Link>
            <Link to="/pay" className="hover:opacity-80 transition-opacity">{t("nav.pricing")}</Link>
            <a href="/#faq" className="hover:opacity-80 transition-opacity">{t("nav.faq")}</a>
            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-['PT_Root_UI',sans-serif]"
            >
              {lang === "ru" ? "EN" : "RU"}
            </button>
          </div>
          <Logo />
          <div className="flex-1 flex justify-end ml-auto md:ml-0">
            {email ? (
              <Link to="/account" className="bg-[rgba(255,255,255,0.1)] flex gap-[8px] items-center justify-center p-[10px] px-[16px] rounded-[100px] no-underline">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7 8.17c-2.53 0-4.17 1.11-4.17 2.5V12h8.34v-1.33c0-1.39-1.64-2.5-4.17-2.5z" fill="rgba(255,255,255,0.7)"/></svg>
                <span className="hidden sm:inline font-['PT_Root_UI',sans-serif] text-[14px] text-[rgba(255,255,255,0.7)]">{email}</span>
              </Link>
            ) : (
              <Link to="/account" className="btn-hover bg-white flex gap-[8px] items-center justify-center p-[12px] px-[20px] rounded-[100px] cursor-pointer border-none no-underline">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 7.5a3 3 0 100-6 3 3 0 000 6zM7.5 9C4.46 9 2 10.34 2 12v1.5h11V12c0-1.66-2.46-3-5.5-3z" fill="#181818"/></svg>
                <span className="hidden sm:inline font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[14px] text-[#181818] text-center whitespace-nowrap">{t("nav.account")}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Pricing Section ─── */}
      <section className="flex-1 bg-black w-full border-none pt-[80px] md:pt-[120px]">
        <div className="flex flex-col items-center overflow-clip">
          <div className="flex flex-col gap-[40px] md:gap-[56px] items-center px-[20px] md:px-[100px] py-[60px] md:py-[80px] w-full max-w-[1440px]">
            <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[32px] sm:text-[42px] md:text-[52px] text-center text-white tracking-[-1.04px] max-w-[650px]">
              {t("pay.title")}
            </p>

            <div className="flex flex-col md:flex-row gap-[24px] w-full max-w-[800px]">
              {/* ── One-time Card (D-01: plain dark bg, D-02: subtitle, FE-01: 5 features) ── */}
              <div className="flex-1">
                <div className="card-hover bg-[#0d0d0d] rounded-[12px] h-[600px] relative overflow-clip">
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[12px]" />
                  <div className="flex flex-col justify-between p-[32px] h-full">
                    <div className="flex flex-col gap-[40px]">
                      <div className="flex flex-col gap-[12px]">
                        <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[24px] text-white tracking-[-0.48px]">{t("pricing.onetime.subtitle")}</p>
                        <span className="font-['PT_Root_UI',sans-serif] leading-[1.1] text-[48px] text-white tracking-[-0.96px]">{t("pricing.onetime.price")}</span>
                      </div>
                      <Divider />
                      <div className="flex flex-col gap-[12px]">
                        <PricingFeature text={t("pricing.onetime.feature1")} />
                        <PricingFeature text={t("pricing.onetime.feature2")} />
                        <PricingFeature text={t("pricing.onetime.feature3")} />
                        <PricingFeature text={t("pricing.onetime.feature4")} />
                        <PricingFeature text={t("pricing.onetime.feature5")} />
                      </div>
                    </div>
                    {extStatus === "ready" ? (
                      hasActivePro ? (
                        <button
                          disabled
                          className="inline-flex gap-[12px] items-center justify-center px-[32px] py-[18px] rounded-[100px] font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-white whitespace-nowrap bg-[#555] opacity-40 cursor-not-allowed border-none w-full"
                        >
                          {t("pay.alreadyActive")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePay(false)}
                          disabled={loading}
                          className="btn-hover bg-white inline-flex gap-[12px] items-center justify-center px-[32px] py-[18px] rounded-[100px] relative cursor-pointer border-none font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-black whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                          <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
                          {loading ? t("pay.onetime.payingBtn") : t("pay.onetime.payBtn")}
                        </button>
                      )
                    ) : (
                      <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn-hover bg-white inline-flex gap-[12px] items-center justify-center px-[32px] py-[18px] rounded-[100px] relative cursor-pointer border-none no-underline">
                        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
                        <span className="font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-black whitespace-nowrap">{t("pay.onetime.tryBtn")}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Pro Card ── */}
              <div className="flex-1">
                <div className="card-hover rounded-[12px] h-[600px] relative overflow-clip">
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
                    <div className="absolute bg-[#0d0d0d] inset-0 rounded-[12px]" />
                    <img alt="" className="absolute max-w-none object-cover rounded-[12px] size-full" src={imgFrame37} />
                    <div className="absolute bg-[rgba(0,0,0,0.48)] inset-0 rounded-[12px]" />
                  </div>
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[12px] z-10" />
                  <div className="relative z-10 flex flex-col justify-between p-[32px] h-full">
                    <div className="flex flex-col gap-[40px]">
                      <div className="flex flex-col gap-[8px]">
                        <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[24px] text-white tracking-[-0.48px]">{t("pricing.pro.subtitle")}</p>
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
                    {extStatus === "ready" ? (
                      hasActivePro ? (
                        <button
                          disabled
                          className="inline-flex gap-[12px] items-center justify-center px-[32px] py-[18px] rounded-[100px] font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-white whitespace-nowrap bg-[#555] opacity-40 cursor-not-allowed border-none w-full"
                        >
                          {t("pay.alreadyActive")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePay(true)}
                          disabled={loading}
                          className="btn-hover bg-white inline-flex gap-[12px] items-center justify-center px-[32px] py-[18px] rounded-[100px] relative cursor-pointer border-none font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-black whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                          <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
                          {loading ? t("pay.pro.payingBtn") : t("pay.pro.payBtn")}
                        </button>
                      )
                    ) : (
                      <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn-hover bg-white inline-flex gap-[12px] items-center justify-center px-[32px] py-[18px] rounded-[100px] relative cursor-pointer border-none no-underline">
                        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
                        <span className="font-['PT_Root_UI',sans-serif] font-bold leading-[1.3] text-[18px] text-black whitespace-nowrap">{t("pay.pro.tryBtn")}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Status messages ── */}
            <div className="flex flex-col gap-[16px] items-center max-w-[560px]">
              {error && (
                <p className="font-['PT_Root_UI',sans-serif] text-[#d4183d] text-[14px] text-center leading-[1.5]">{error}</p>
              )}

              {extStatus === "detecting" && (
                <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] px-[24px] py-[16px] text-center">
                  <p className="font-['PT_Root_UI',sans-serif] text-[rgba(255,255,255,0.5)] text-[14px] leading-[1.6]">
                    {t("pay.status.detecting")}
                  </p>
                </div>
              )}

              {extStatus === "not_installed" && (
                <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] px-[24px] py-[20px] text-center w-full">
                  <p className="font-['PT_Root_UI',sans-serif] text-white text-[15px] font-medium leading-[1.5] mb-[12px]">
                    {t("pay.status.notInstalled.title")}
                  </p>
                  <div className="flex flex-col gap-[8px] text-left max-w-[360px] mx-auto">
                    <div className="flex gap-[10px] items-center">
                      <span className="text-[#2777C3] text-[14px] font-bold shrink-0 w-[20px] text-center font-['PT_Root_UI',sans-serif]">1</span>
                      <p className="font-['PT_Root_UI',sans-serif] text-[rgba(255,255,255,0.6)] text-[14px] leading-[1.5]">
                        <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-[#2777C3] underline">{t("pay.status.notInstalled.step1pre")}</a> {t("pay.status.notInstalled.step1post")}
                      </p>
                    </div>
                    <div className="flex gap-[10px] items-center">
                      <span className="text-[#2777C3] text-[14px] font-bold shrink-0 w-[20px] text-center font-['PT_Root_UI',sans-serif]">2</span>
                      <p className="font-['PT_Root_UI',sans-serif] text-[rgba(255,255,255,0.6)] text-[14px] leading-[1.5]">
                        {t("pay.status.notInstalled.step2")}
                      </p>
                    </div>
                    <div className="flex gap-[10px] items-center">
                      <span className="text-[#2777C3] text-[14px] font-bold shrink-0 w-[20px] text-center font-['PT_Root_UI',sans-serif]">3</span>
                      <p className="font-['PT_Root_UI',sans-serif] text-[rgba(255,255,255,0.6)] text-[14px] leading-[1.5]">
                        {t("pay.status.notInstalled.step3")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {extStatus === "not_logged_in" && (
                <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] px-[24px] py-[20px] text-center w-full">
                  <p className="font-['PT_Root_UI',sans-serif] text-white text-[15px] font-medium leading-[1.5] mb-[8px]">
                    {t("pay.status.notLoggedIn.title")}
                  </p>
                  <p className="font-['PT_Root_UI',sans-serif] text-[rgba(255,255,255,0.6)] text-[14px] leading-[1.6]">
                    {t("pay.status.notLoggedIn.desc")}
                  </p>
                </div>
              )}

              {extStatus === "ready" && (
                <p className="font-['PT_Root_UI',sans-serif] text-[rgba(255,255,255,0.3)] text-[12px] text-center leading-[1.5]">
                  {t("pay.status.ready.disclaimer")}{" "}
                  <Link to="/terms" className="text-[rgba(255,255,255,0.5)] underline">{t("pay.status.ready.terms")}</Link>
                  {" "}{t("pay.status.ready.and")}{" "}
                  <Link to="/privacy" className="text-[rgba(255,255,255,0.5)] underline">{t("pay.status.ready.privacy")}</Link>.
                  {" "}{t("pay.status.ready.autoRenew")}
                </p>
              )}

              <div className="flex items-center justify-center gap-[8px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 5.33H4C3.26 5.33 2.67 5.93 2.67 6.67V12.67C2.67 13.4 3.26 14 4 14H12C12.74 14 13.33 13.4 13.33 12.67V6.67C13.33 5.93 12.74 5.33 12 5.33ZM8 10.67C7.26 10.67 6.67 10.07 6.67 9.33C6.67 8.6 7.26 8 8 8C8.74 8 9.33 8.6 9.33 9.33C9.33 10.07 8.74 10.67 8 10.67ZM10.67 5.33V4C10.67 2.53 9.47 1.33 8 1.33C6.53 1.33 5.33 2.53 5.33 4V5.33H10.67Z" fill="rgba(255,255,255,0.3)" />
                </svg>
                <span className="text-[rgba(255,255,255,0.3)] text-[13px] font-['PT_Root_UI',sans-serif]">
                  {t("pay.secure")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-black w-full border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex flex-col items-center gap-[16px] py-[32px] px-[20px]">
          <div className="flex flex-wrap justify-center gap-[20px] sm:gap-[32px] font-['PT_Root_UI',sans-serif] text-[14px] text-[rgba(255,255,255,0.4)]">
            <Link to="/" className="hover:text-white transition-colors no-underline text-inherit">{t("nav.home")}</Link>
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
          <span className="font-['PT_Root_UI',sans-serif] leading-[1.6] text-[14px] text-[rgba(255,255,255,0.3)]">
            {t("footer.copyright")}
          </span>
        </div>
      </footer>
    </div>
  );
}
