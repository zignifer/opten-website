import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useT, useLang } from "../../i18n/LangContext";
import svgPaths from "../../imports/LandingPage/svg-bvy0jfb1g6";

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

/* ─── Icons ─── */

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

function CardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <path d="M2 10H22" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <rect x="5" y="14" width="4" height="2" rx="0.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

function formatDate(iso: string, lang: string) {
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function cardBrandName(type: string | null, t: (key: string) => string): string {
  if (!type) return t("account.payment.cardDefault");
  const map: Record<string, string> = {
    Visa: "Visa", MasterCard: "MasterCard", Mir: "МИР",
    MaestroCard: "Maestro", UnionPay: "UnionPay",
  };
  return map[type] || type;
}

/* ─── Page ─── */

export default function AccountPage() {
  const t = useT();
  const { lang, setLang } = useLang();
  const [token, setToken] = useState<string | null>(null);
  const [extStatus, setExtStatus] = useState<ExtStatus>("detecting");
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Try hash token first
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const hashToken = params.get("token");
    if (hashToken) {
      setToken(hashToken);
      setExtStatus("ready");
      window.history.replaceState(null, "", window.location.pathname);
      fetchSubscription(hashToken);
    } else {
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
            // Always fetch fresh data from Edge Function (not stale chrome.storage cache)
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
      } else {
        setError("Ошибка подписки: " + (data._debug_auth_error || data.error || res.status));
      }
    } catch {
      setError(t("account.error.loadSubFailed"));
    } finally {
      setLoadingSub(false);
    }
  };

  const handleCancel = () => {
    setCancelling(true);
    setError(null);
    try {
      const chrome = (window as any).chrome;
      // Find working extension ID
      for (const id of EXTENSION_IDS) {
        try {
          chrome.runtime.sendMessage(id, { type: "CANCEL_SUBSCRIPTION" }, (response: any) => {
            if (chrome.runtime.lastError || !response) return;
            if (response.success) {
              setCancelDone(true);
              setSub(prev => prev ? {
                ...prev,
                status: "cancelled",
                auto_renew: false,
                card_last4: null,
                card_type: null,
                has_card: false,
              } : null);
            } else if (response.error) {
              setError(t("account.error.cancelFailed"));
            }
            setCancelling(false);
          });
        } catch { /* try next ID */ }
      }
    } catch {
      setError(t("account.error.network"));
      setCancelling(false);
    }
  };

  const isActive = sub?.status === "active";
  const isCancelled = sub?.status === "cancelled";
  const isFree = !sub || sub.plan === "free" || sub.status === "expired";


  return (
    <div className="w-full min-h-screen bg-black flex flex-col font-['PT_Root_UI',sans-serif]">
      <style>{`
        a { text-decoration: none; color: inherit; }
        .btn-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
        }
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
              <div className="bg-[rgba(255,255,255,0.1)] flex gap-[8px] items-center justify-center p-[10px] px-[16px] rounded-[100px]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7 8.17c-2.53 0-4.17 1.11-4.17 2.5V12h8.34v-1.33c0-1.39-1.64-2.5-4.17-2.5z" fill="rgba(255,255,255,0.7)"/></svg>
                <span className="hidden sm:inline font-['PT_Root_UI',sans-serif] text-[14px] text-[rgba(255,255,255,0.7)]">{email}</span>
              </div>
            ) : (
              <Link to="/account" className="btn-hover bg-white flex gap-[8px] items-center justify-center p-[12px] px-[20px] rounded-[100px] cursor-pointer border-none no-underline">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 7.5a3 3 0 100-6 3 3 0 000 6zM7.5 9C4.46 9 2 10.34 2 12v1.5h11V12c0-1.66-2.46-3-5.5-3z" fill="#181818"/></svg>
                <span className="hidden sm:inline font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[14px] text-[#181818] text-center whitespace-nowrap">{t("nav.account")}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Content ─── */}
      <section className="flex-1 pt-[140px] pb-[80px] px-[20px]">
        <div className="max-w-[560px] mx-auto flex flex-col gap-[32px]">

          <h1 className="text-white text-[32px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.8px] text-center">
            {t("account.title")}
          </h1>

          {/* Extension status */}
          {extStatus === "detecting" && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-[rgba(255,255,255,0.5)] text-[15px]">{t("account.ext.detecting")}</p>
            </div>
          )}

          {extStatus === "not_installed" && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-white text-[15px] font-medium mb-[8px]">{t("account.ext.notInstalled.title")}</p>
              <p className="text-[rgba(255,255,255,0.5)] text-[14px] leading-[1.6]">
                <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-[#2777C3] underline">{t("account.ext.notInstalled.desc1")}</a>,{" "}
                {t("account.ext.notInstalled.desc2")}
              </p>
            </div>
          )}

          {extStatus === "not_logged_in" && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-white text-[15px] font-medium mb-[8px]">{t("account.ext.notLoggedIn.title")}</p>
              <p className="text-[rgba(255,255,255,0.5)] text-[14px] leading-[1.6]">
                {t("account.ext.notLoggedIn.desc")}
              </p>
            </div>
          )}

          {/* Subscription info */}
          {extStatus === "ready" && loadingSub && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-[rgba(255,255,255,0.5)] text-[15px]">{t("account.sub.loading")}</p>
            </div>
          )}

          {extStatus === "ready" && !loadingSub && (
            <>
              {/* ── Plan card ── */}
              <div className="bg-[#0d0d0d] rounded-[16px] p-[32px] relative">
                <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[16px]" />
                <div className="relative z-10 flex flex-col gap-[24px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[rgba(255,255,255,0.5)] text-[13px] uppercase tracking-[1px] mb-[4px]">{t("account.plan.label")}</p>
                      <p className="text-white text-[28px] font-medium leading-[1.1]">
                        {isFree ? t("account.plan.free") : t("account.plan.pro")}
                      </p>
                    </div>
                    {isActive && (
                      <div className="bg-[rgba(30,142,62,0.15)] px-[12px] py-[6px] rounded-[100px]">
                        <span className="text-[#34A853] text-[13px] font-medium">{t("account.plan.statusActive")}</span>
                      </div>
                    )}
                    {isCancelled && (
                      <div className="bg-[rgba(255,180,0,0.15)] px-[12px] py-[6px] rounded-[100px]">
                        <span className="text-[#FBBC04] text-[13px] font-medium">{t("account.plan.statusCancelled")}</span>
                      </div>
                    )}
                  </div>

                  {(isActive || isCancelled) && sub.expires_at && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[rgba(255,255,255,0.5)] text-[13px]">
                        {isActive ? t("account.plan.nextCharge") : t("account.plan.accessUntil")}
                      </p>
                      <p className="text-white text-[16px]">{formatDate(sub.expires_at, lang)}</p>
                    </div>
                  )}

                  {isActive && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[rgba(255,255,255,0.5)] text-[13px]">{t("account.plan.priceLabel")}</p>
                      <p className="text-white text-[16px]">{t("account.plan.priceValue")}</p>
                    </div>
                  )}

                  {isFree && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[rgba(255,255,255,0.5)] text-[14px] leading-[1.6]">
                        {t("account.plan.freeDesc")}
                      </p>
                      <Link
                        to="/pay"
                        className="mt-[8px] bg-white text-black text-[16px] font-bold py-[14px] px-[32px] rounded-[100px] text-center no-underline inline-block hover:opacity-90 transition-opacity"
                      >
                        {t("account.plan.upgradeBtn")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Card info ── */}
              {(isActive || isCancelled) && (
                <div className="bg-[#0d0d0d] rounded-[16px] p-[32px] relative">
                  <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[16px]" />
                  <div className="relative z-10 flex flex-col gap-[24px]">
                    <p className="text-[rgba(255,255,255,0.5)] text-[13px] uppercase tracking-[1px]">{t("account.payment.label")}</p>

                    {sub.has_card && sub.card_last4 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[12px]">
                          <CardIcon />
                          <div>
                            <p className="text-white text-[16px]">{cardBrandName(sub.card_type, t)} •••• {sub.card_last4}</p>
                            <p className="text-[rgba(255,255,255,0.4)] text-[13px]">{t("account.payment.autoLabel")}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[rgba(255,255,255,0.4)] text-[14px]">{t("account.payment.noCard")}</p>
                    )}

                    {/* Cancel / unlink button */}
                    {isActive && (
                      <div className="flex flex-col gap-[12px] pt-[8px] border-t border-[rgba(255,255,255,0.1)]">
                        {cancelDone ? (
                          <p className="text-[#FBBC04] text-[14px]">
                            {t("account.cancel.done").replace("{date}", sub.expires_at ? formatDate(sub.expires_at, lang) : "")}
                          </p>
                        ) : (
                          <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="text-[#d4183d] text-[14px] font-medium bg-transparent border-none cursor-pointer text-left p-0 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelling ? t("account.cancel.inProgress") : t("account.cancel.btn")}
                          </button>
                        )}
                        <p className="text-[rgba(255,255,255,0.3)] text-[12px] leading-[1.5]">
                          {t("account.cancel.disclaimer")}
                        </p>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="pt-[8px] border-t border-[rgba(255,255,255,0.1)]">
                        <p className="text-[rgba(255,255,255,0.4)] text-[14px]">
                          {t("account.cancelled.info")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-[#d4183d] text-[14px] text-center">{error}</p>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-black w-full border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex flex-col items-center gap-[16px] py-[32px] px-[20px]">
          <div className="flex flex-wrap justify-center gap-[20px] sm:gap-[32px] text-[14px] text-[rgba(255,255,255,0.4)]">
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
          <span className="leading-[1.6] text-[14px] text-[rgba(255,255,255,0.3)]">
            {t("footer.copyright")}
          </span>
        </div>
      </footer>
    </div>
  );
}
