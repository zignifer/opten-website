import { useState, useEffect } from "react";
import { Link } from "react-router";
import svgPaths from "../../imports/LandingPage/svg-bvy0jfb1g6";

const SUPABASE_FUNCTIONS_URL = "https://vuywydhwkqmihfztpkgl.supabase.co/functions/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTkxMjAsImV4cCI6MjA1OTQzNTEyMH0.bG0GfCEMbMBqPOMtkFDAiFjKQMqFVLHGe3bTG-hsaMA";
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function cardBrandName(type: string | null): string {
  if (!type) return "Карта";
  const map: Record<string, string> = {
    Visa: "Visa", MasterCard: "MasterCard", Mir: "МИР",
    MaestroCard: "Maestro", UnionPay: "UnionPay",
  };
  return map[type] || type;
}

/* ─── Page ─── */

export default function AccountPage() {
  const [token, setToken] = useState<string | null>(null);
  const [extStatus, setExtStatus] = useState<ExtStatus>("detecting");
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError("Не удалось загрузить данные подписки.");
    } finally {
      setLoadingSub(false);
    }
  };

  const handleCancel = async () => {
    if (!token) return;
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(SUPABASE_FUNCTIONS_URL + "/cancel-subscription", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "apikey": SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCancelDone(true);
        // Update local state
        setSub(prev => prev ? {
          ...prev,
          status: "cancelled",
          auto_renew: false,
          card_last4: null,
          card_type: null,
          has_card: false,
        } : null);
      } else {
        setError(data.error || "Не удалось отменить подписку.");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
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
      `}</style>

      {/* ─── Navbar ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-[8px]" : "py-[21px]"}`}>
        <div className={`max-w-[1100px] mx-[8px] lg:mx-auto flex items-center justify-between rounded-[1000px] py-[8px] pl-[24px] pr-[8px] transition-all duration-300 ${scrolled ? "bg-[rgba(0,0,0,0.6)] backdrop-blur-[12px]" : "bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px]"}`}>
          <div className="hidden md:flex flex-1 gap-[24px] items-center text-[14px] text-white">
            <Link to="/" className="hover:opacity-80 transition-opacity">Главная</Link>
            <Link to="/pay" className="hover:opacity-80 transition-opacity">Тарифы</Link>
          </div>
          <Logo />
          <div className="flex-1" />
        </div>
      </nav>

      {/* ─── Content ─── */}
      <section className="flex-1 pt-[140px] pb-[80px] px-[20px]">
        <div className="max-w-[560px] mx-auto flex flex-col gap-[32px]">

          <h1 className="text-white text-[32px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.8px]">
            Управление подпиской
          </h1>

          {/* Extension status */}
          {extStatus === "detecting" && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-[rgba(255,255,255,0.5)] text-[15px]">Подключение к расширению...</p>
            </div>
          )}

          {extStatus === "not_installed" && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-white text-[15px] font-medium mb-[8px]">Расширение Opten не найдено</p>
              <p className="text-[rgba(255,255,255,0.5)] text-[14px] leading-[1.6]">
                <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-[#2777C3] underline">Установите расширение</a>,
                войдите в аккаунт и обновите эту страницу.
              </p>
            </div>
          )}

          {extStatus === "not_logged_in" && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-white text-[15px] font-medium mb-[8px]">Войдите в аккаунт</p>
              <p className="text-[rgba(255,255,255,0.5)] text-[14px] leading-[1.6]">
                Откройте popup расширения Opten, войдите через Google и обновите страницу.
              </p>
            </div>
          )}

          {/* Subscription info */}
          {extStatus === "ready" && loadingSub && (
            <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[24px] text-center">
              <p className="text-[rgba(255,255,255,0.5)] text-[15px]">Загрузка данных подписки...</p>
            </div>
          )}

          {extStatus === "ready" && !loadingSub && sub && (
            <>
              {/* ── Plan card ── */}
              <div className="bg-[#0d0d0d] rounded-[16px] p-[32px] relative">
                <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[16px]" />
                <div className="relative z-10 flex flex-col gap-[24px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[rgba(255,255,255,0.5)] text-[13px] uppercase tracking-[1px] mb-[4px]">Текущий тариф</p>
                      <p className="text-white text-[28px] font-medium leading-[1.1]">
                        {isFree ? "Бесплатный" : "Pro"}
                      </p>
                    </div>
                    {isActive && (
                      <div className="bg-[rgba(30,142,62,0.15)] px-[12px] py-[6px] rounded-[100px]">
                        <span className="text-[#34A853] text-[13px] font-medium">Активна</span>
                      </div>
                    )}
                    {isCancelled && (
                      <div className="bg-[rgba(255,180,0,0.15)] px-[12px] py-[6px] rounded-[100px]">
                        <span className="text-[#FBBC04] text-[13px] font-medium">Отменена</span>
                      </div>
                    )}
                  </div>

                  {(isActive || isCancelled) && sub.expires_at && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[rgba(255,255,255,0.5)] text-[13px]">
                        {isActive ? "Следующее списание" : "Доступ до"}
                      </p>
                      <p className="text-white text-[16px]">{formatDate(sub.expires_at)}</p>
                    </div>
                  )}

                  {isActive && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[rgba(255,255,255,0.5)] text-[13px]">Стоимость</p>
                      <p className="text-white text-[16px]">199 ₽ / мес (автоматическое продление)</p>
                    </div>
                  )}

                  {isFree && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[rgba(255,255,255,0.5)] text-[14px] leading-[1.6]">
                        10 проверок в месяц. Для расширенных возможностей перейдите на Pro.
                      </p>
                      <Link
                        to="/pay"
                        className="mt-[8px] bg-white text-black text-[16px] font-bold py-[14px] px-[32px] rounded-[100px] text-center no-underline inline-block hover:opacity-90 transition-opacity"
                      >
                        Перейти на Pro — 199₽/мес
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
                    <p className="text-[rgba(255,255,255,0.5)] text-[13px] uppercase tracking-[1px]">Способ оплаты</p>

                    {sub.has_card && sub.card_last4 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[12px]">
                          <CardIcon />
                          <div>
                            <p className="text-white text-[16px]">{cardBrandName(sub.card_type)} •••• {sub.card_last4}</p>
                            <p className="text-[rgba(255,255,255,0.4)] text-[13px]">Используется для автоплатежей</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[rgba(255,255,255,0.4)] text-[14px]">Карта не привязана</p>
                    )}

                    {/* Cancel / unlink button */}
                    {isActive && (
                      <div className="flex flex-col gap-[12px] pt-[8px] border-t border-[rgba(255,255,255,0.1)]">
                        {cancelDone ? (
                          <p className="text-[#FBBC04] text-[14px]">
                            Подписка отменена. Pro-доступ сохранится до {sub.expires_at ? formatDate(sub.expires_at) : "конца периода"}.
                            Карта отвязана.
                          </p>
                        ) : (
                          <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="text-[#d4183d] text-[14px] font-medium bg-transparent border-none cursor-pointer text-left p-0 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelling ? "Отменяем..." : "Отвязать карту и отменить подписку"}
                          </button>
                        )}
                        <p className="text-[rgba(255,255,255,0.3)] text-[12px] leading-[1.5]">
                          При отмене подписки карта будет отвязана. Автоматические списания прекратятся.
                          Доступ к Pro сохранится до конца оплаченного периода.
                        </p>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="pt-[8px] border-t border-[rgba(255,255,255,0.1)]">
                        <p className="text-[rgba(255,255,255,0.4)] text-[14px]">
                          Подписка отменена. Карта отвязана. Автоматические списания не производятся.
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
            <Link to="/" className="hover:text-white transition-colors no-underline text-inherit">Главная</Link>
            <Link to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">Конфиденциальность</Link>
            <Link to="/terms" className="hover:text-white transition-colors no-underline text-inherit">Оферта</Link>
            <Link to="/refund" className="hover:text-white transition-colors no-underline text-inherit">Возврат</Link>
            <a href="https://t.me/v_voronezhtsev" target="_blank" rel="noopener noreferrer" className="flex gap-[8px] items-center hover:text-white transition-colors no-underline text-inherit">
              <div className="overflow-clip relative shrink-0 size-[14px]">
                <div className="absolute inset-[17.97%_8.92%_0.78%_7.33%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0741 14.6261">
                    <path clipRule="evenodd" d={svgPaths.p3150f900} fill="currentColor" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
              Связаться
            </a>
          </div>
          <span className="leading-[1.6] text-[14px] text-[rgba(255,255,255,0.3)]">
            © 2026 Opten · ИП Воронежцев В.П. · ИНН 723016676391
          </span>
        </div>
      </footer>
    </div>
  );
}
