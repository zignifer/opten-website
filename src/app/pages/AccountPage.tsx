import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useT, useLang } from "../../i18n/LangContext";
import LocalizedLink from "../components/LocalizedLink";
import SiteHeader from "../components/SiteHeader";
import {
  fetchAccountSummary,
  signOut as signOutWebsite,
  type AccountSummary,
} from "../../lib/optenAuth";
import { useCurrencyPreference } from "../../lib/currency";
import { useSpaceAuth } from "../components/space/SpaceAuthProvider";
import svgPaths from "../../imports/LandingPage/svg-bvy0jfb1g6";

const SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAyODUsImV4cCI6MjA5MTAzNjI4NX0.A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg";
const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";
const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",  // Chrome Web Store
  "kcmcaeenfmfnpiaihicecnfnagejpcog",  // Local dev
];

type ExtStatus = "detecting" | "not_installed" | "not_logged_in" | "ready";
type AuthSource = "website" | "extension" | null;

interface Subscription {
  plan: string;
  status: string | null;
  expires_at: string | null;
  auto_renew: boolean;
  card_last4: string | null;
  card_type: string | null;
  has_card: boolean;
  provider?: string | null;
  currency?: string | null;
}

/* ─── Icons ─── */

function Logo() {
  return (
    <LocalizedLink to="/" className="inline-block leading-[0] no-underline shrink-0">
      <img alt="Opten" src="/logo.svg" width="62" height="20" loading="eager" className="block h-[20px] w-auto" />
    </LocalizedLink>
  );
}

function CardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10H22" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="14" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

function StatusPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0e2023]/90 p-[24px] text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      {children}
    </div>
  );
}

function formatDate(iso: string, lang: string) {
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function isSubscriptionPeriodLive(expiresAt: string | null): boolean {
  if (!expiresAt) return true;
  const expiresMs = Date.parse(expiresAt);
  return Number.isNaN(expiresMs) || expiresMs > Date.now();
}

function hasCurrentPaidAccess(sub: Subscription | null): boolean {
  return !!sub
    && sub.plan !== "free"
    && (sub.status === "active" || sub.status === "cancelled")
    && isSubscriptionPeriodLive(sub.expires_at);
}

function cardBrandName(type: string | null, t: (key: string) => string): string {
  if (!type) return t("account.payment.cardDefault");
  const map: Record<string, string> = {
    Visa: "Visa", MasterCard: "MasterCard", Mir: "МИР",
    MaestroCard: "Maestro", UnionPay: "UnionPay",
  };
  return map[type] || type;
}

function subscriptionFromAccount(account: AccountSummary | null): Subscription | null {
  if (!account) return null;
  return {
    plan: account.plan,
    status: account.status,
    expires_at: account.expires_at,
    auto_renew: account.auto_renew,
    card_last4: account.card_last4,
    card_type: account.card_type,
    has_card: account.has_card,
    provider: account.provider,
    currency: account.currency,
  };
}

/* ─── Page ─── */

export default function AccountPage() {
  const t = useT();
  const { lang } = useLang();
  const [currency] = useCurrencyPreference();
  const navigate = useNavigate();
  const {
    status: authStatus,
    session,
    account,
    refresh: refreshSpaceAuth,
  } = useSpaceAuth();
  // Phase 4.1 WR-03 (IN-02 sibling — same pattern as PayPage Wave 9): lang-aware FAQ anchor.
  // /account has no /en/account sibling per Phase 3 D-03 (extension-coupled SPA-only route);
  // EN users who flip language stay on /account but their FAQ click must go to /en/#faq, not /#faq.
  const homeHash = lang === "en" ? "/en/#faq" : "/#faq";
  const [token, setToken] = useState<string | null>(null);
  const [authSource, setAuthSource] = useState<AuthSource>(null);
  const [extStatus, setExtStatus] = useState<ExtStatus>("detecting");
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hashTokenMode, setHashTokenMode] = useState(false);

  useEffect(() => {
    // Try hash token first
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const hashToken = params.get("token");
    if (hashToken) {
      setHashTokenMode(true);
      setAuthSource("extension");
      setToken(hashToken);
      setExtStatus("ready");
      window.history.replaceState(null, "", window.location.pathname);
      fetchSubscription(hashToken);
    }

    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (hashTokenMode) return;

    if (authStatus === "loading") {
      setExtStatus("detecting");
      return;
    }

    if (authStatus === "signed_in" && session) {
      setAuthSource("website");
      setToken(session.access_token);
      setEmail(account?.email || session.user.email);
      setExtStatus("ready");
      setSub(subscriptionFromAccount(account));
      setLoadingSub(false);
      setError(null);
      return;
    }

    setAuthSource(null);
    setToken(null);
    setEmail(null);
    setSub(null);
    detectExtension();
  }, [authStatus, session?.access_token, session?.user.email, account, hashTokenMode]);

  const detectExtension = () => {
    const chrome = (window as any).chrome;
    if (!chrome?.runtime?.sendMessage) {
      setExtStatus("not_installed");
      return;
    }
    let tried = 0;
    let resolved = false;
    for (const id of EXTENSION_IDS) {
      try {
        chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, (response: any) => {
          if (resolved) return;
          tried++;
          if (chrome.runtime.lastError || !response) {
            if (!resolved && tried >= EXTENSION_IDS.length) setExtStatus("not_installed");
            return;
          }
          if (response.token) {
            resolved = true;
            setAuthSource("extension");
            setToken(response.token);
            if (response.email) setEmail(response.email);
            setExtStatus("ready");
            // Always fetch fresh data from Edge Function (not stale chrome.storage cache)
            fetchSubscription(response.token);
          } else {
            resolved = true;
            setExtStatus("not_logged_in");
          }
        });
      } catch {
        tried++;
        if (!resolved && tried >= EXTENSION_IDS.length) setExtStatus("not_installed");
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

  const handleCancel = async () => {
    setCancelling(true);
    setError(null);
    if (authSource === "website" && token) {
      try {
        const endpoint = sub?.provider === "paddle" ? "/cancel-subscription-paddle" : "/cancel-subscription";
        const res = await fetch(SUPABASE_FUNCTIONS_URL + endpoint, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token,
            "apikey": SUPABASE_ANON_KEY,
            "Content-Type": "application/json",
          },
          body: "{}",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.error || !data.success) {
          setError(t("account.error.cancelFailed"));
          return;
        }

        setCancelDone(true);
        const nextAccount = await fetchAccountSummary(token).catch(() => null);
        if (nextAccount) {
          setSub(subscriptionFromAccount(nextAccount));
        } else {
          setSub(prev => prev ? {
            ...prev,
            status: "cancelled",
            auto_renew: false,
            card_last4: null,
            card_type: null,
            has_card: false,
            expires_at: data.expires_at || prev.expires_at,
          } : null);
        }
        await refreshSpaceAuth();
      } catch {
        setError(t("account.error.network"));
      } finally {
        setCancelling(false);
      }
      return;
    }

    try {
      const chrome = (window as any).chrome;
      let resolved = false;
      // Find working extension ID
      for (const id of EXTENSION_IDS) {
        try {
          chrome.runtime.sendMessage(id, { type: "CANCEL_SUBSCRIPTION" }, (response: any) => {
            if (resolved || chrome.runtime.lastError || !response) return;
            resolved = true;
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

  const handleWebsiteSignOut = async () => {
    setError(null);
    await signOutWebsite(session?.access_token);
    setAuthSource(null);
    setToken(null);
    setEmail(null);
    setSub(null);
    await refreshSpaceAuth();
    navigate("/login?next=/account", { replace: true });
  };

  const hasPaidAccess = hasCurrentPaidAccess(sub);
  const isActive = hasPaidAccess && sub?.status === "active";
  const isCancelled = hasPaidAccess && sub?.status === "cancelled";
  const isFree = !hasPaidAccess;
  const isOneTime = (isActive || isCancelled) && !sub?.auto_renew;
  const isSubscription = (isActive || isCancelled) && !!sub?.auto_renew;
  const selectedProPrice = currency === "USD" ? t("pricing.pro.priceUsd") : t("pricing.pro.price");
  const activeProPrice = sub?.currency === "USD"
    ? (lang === "en" ? "$2.99/mo (auto-renewal)" : "$2.99 / мес (автоматическое продление)")
    : (lang === "en" ? "199 ₽ / mo (auto-renewal)" : "199 ₽ / мес (автоматическое продление)");
  const upgradeLabel = lang === "en" ? `Upgrade to Pro — ${selectedProPrice}/mo` : `Перейти на Pro — ${selectedProPrice}/мес`;


  return (
    <div className="account-page flex min-h-screen w-full flex-col bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <style>{`
        /* Phase 5 follow-up: scoped to .account-page so the bare 'a { color: inherit }' rule
           below doesn't bleed into <SiteHeader>'s Account button (whose Tailwind text-[#011417]
           was being overridden to white-on-white, making the button look empty on /account). */
        .account-page > section a { text-decoration: none; color: inherit; }
        .btn-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
        }
      `}</style>

      {/* Phase 5 follow-up: unified SiteHeader. When the user is signed in, the right cluster
          of the header surfaces an email pill (matching the pre-refactor bespoke navbar) so
          the user sees which account they're managing without scrolling. Falls back to the
          default Account button when no email is available. */}
      <SiteHeader
        variant="page"
        rightSlot={email ? (
          <LocalizedLink
            to="/account"
            aria-label={email}
            title={email}
            className="inline-flex h-[32px] max-w-[220px] items-center gap-[8px] rounded-full bg-transparent px-[12px] py-[8px] font-['PT_Root_UI',sans-serif] text-[14px] font-medium text-white/78 no-underline transition hover:bg-white/[0.04] hover:text-white"
          >
            <img
              src="/assets/space/figma/header-atoms/icon-account.svg"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
              className="h-[16px] w-[16px] shrink-0"
            />
            <span className="truncate">{email}</span>
          </LocalizedLink>
        ) : undefined}
      />

      {/* ─── Content ─── */}
      <section className="relative flex-1 overflow-hidden bg-[#011417] px-[20px] pb-[80px] pt-[131px] md:pt-[170px]">
        <div
          aria-hidden="true"
          className="opten-figma-gradient"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
          }}
        />
        <div className="relative z-10 mx-auto flex max-w-[620px] flex-col gap-[28px]">

          <h1 className="text-center font-['Unbounded',sans-serif] text-[34px] font-bold leading-[1.1] tracking-[-0.4px] text-white md:text-[46px]">
            {t("account.title")}
          </h1>

          {/* Extension status */}
          {extStatus === "detecting" && (
            <StatusPanel>
              <p className="text-[15px] text-white/55">{t("account.ext.detecting")}</p>
            </StatusPanel>
          )}

          {extStatus === "not_installed" && (
            <StatusPanel>
              <p className="mb-[8px] text-[15px] font-medium text-white">{t("account.auth.signInTitle")}</p>
              <p className="mx-auto mb-[16px] max-w-[420px] text-[14px] leading-[1.6] text-white/55">
                {t("account.auth.signInDesc")}
              </p>
              <LocalizedLink
                to="/login?next=/account"
                className="inline-flex rounded-[100px] bg-[#9cfb51] px-[22px] py-[12px] text-[14px] font-bold text-[#011417] no-underline transition hover:-translate-y-0.5"
              >
                {t("account.auth.signInCta")}
              </LocalizedLink>
            </StatusPanel>
          )}

          {extStatus === "not_logged_in" && (
            <StatusPanel>
              <p className="mb-[8px] text-[15px] font-medium text-white">{t("account.auth.signInTitle")}</p>
              <p className="mx-auto mb-[16px] max-w-[420px] text-[14px] leading-[1.6] text-white/55">
                {t("account.ext.notLoggedIn.desc")}
              </p>
              <LocalizedLink
                to="/login?next=/account"
                className="inline-flex rounded-[100px] bg-[#9cfb51] px-[22px] py-[12px] text-[14px] font-bold text-[#011417] no-underline transition hover:-translate-y-0.5"
              >
                {t("account.auth.signInCta")}
              </LocalizedLink>
            </StatusPanel>
          )}

          {/* Subscription info */}
          {extStatus === "ready" && loadingSub && (
            <StatusPanel>
              <p className="text-[15px] text-white/55">{t("account.sub.loading")}</p>
            </StatusPanel>
          )}

          {extStatus === "ready" && !loadingSub && (
            <>
              {/* ── Plan card ── */}
              <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-[#0e2023] p-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-[32px]">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9cfb51]/40 to-transparent" />
                <div className={`relative z-10 flex flex-col ${isFree ? "gap-[18px]" : "gap-[24px]"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-[4px] text-[13px] uppercase tracking-[1px] text-white/45">{t("account.plan.label")}</p>
                      <p className="text-[28px] font-medium leading-[1.1] text-white">
                        {isFree ? t("account.plan.free") : t("account.plan.pro")}
                      </p>
                    </div>
                    {isActive && (
                      <div className="rounded-[100px] bg-[#9cfb51]/12 px-[12px] py-[6px]">
                        <span className="text-[13px] font-medium text-[#9cfb51]">{t("account.plan.statusActive")}</span>
                      </div>
                    )}
                    {isCancelled && (
                      <div className="rounded-[100px] bg-[#FBBC04]/15 px-[12px] py-[6px]">
                        <span className="text-[13px] font-medium text-[#FBBC04]">{t("account.plan.statusCancelled")}</span>
                      </div>
                    )}
                  </div>

                  {(isActive || isCancelled) && sub.expires_at && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[13px] text-white/50">
                        {isSubscription && isActive ? t("account.plan.nextCharge") : t("account.plan.accessUntil")}
                      </p>
                      <p className="text-[16px] text-white">{formatDate(sub.expires_at, lang)}</p>
                    </div>
                  )}

                  {isSubscription && isActive && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[13px] text-white/50">{t("account.plan.priceLabel")}</p>
                      <p className="text-[16px] text-white">{activeProPrice}</p>
                    </div>
                  )}

                  {isFree && (
                    <div className="flex flex-col">
                      <p className="text-[14px] leading-[1.6] text-white/55">
                        {t("account.plan.freeDesc")}
                      </p>
                      <LocalizedLink
                        to="/pay"
                        className="mt-[30px] inline-block rounded-[100px] bg-[#9cfb51] px-[32px] py-[14px] text-center text-[16px] font-bold !text-[#011417] no-underline transition hover:-translate-y-0.5"
                      >
                        {upgradeLabel}
                      </LocalizedLink>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Card info ── */}
              {isSubscription && (
                <div className="relative rounded-[16px] border border-white/10 bg-[#0e2023] p-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-[32px]">
                  <div className="relative z-10 flex flex-col gap-[24px]">
                    <p className="text-[13px] uppercase tracking-[1px] text-white/45">{t("account.payment.label")}</p>

                    {sub.has_card && sub.card_last4 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[12px]">
                          <span className="text-white/55"><CardIcon /></span>
                          <div>
                            <p className="text-[16px] text-white">{cardBrandName(sub.card_type, t)} •••• {sub.card_last4}</p>
                            <p className="text-[13px] text-white/40">{t("account.payment.autoLabel")}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[14px] text-white/45">{t("account.payment.noCard")}</p>
                    )}

                    {/* Cancel / unlink button */}
                    {isActive && (
                      <div className="flex flex-col gap-[12px] border-t border-white/10 pt-[8px]">
                        {cancelDone ? (
                          <p className="text-[14px] text-[#FBBC04]">
                            {t("account.cancel.done").replace("{date}", sub.expires_at ? formatDate(sub.expires_at, lang) : "")}
                          </p>
                        ) : (
                          <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="cursor-pointer border-none bg-transparent p-0 text-left text-[14px] font-medium text-[#ff5d76] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancelling ? t("account.cancel.inProgress") : t("account.cancel.btn")}
                          </button>
                        )}
                        <p className="text-[12px] leading-[1.5] text-white/35">
                          {t("account.cancel.disclaimer")}
                        </p>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="border-t border-white/10 pt-[8px]">
                        <p className="text-[14px] text-white/45">
                          {t("account.cancelled.info")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {authSource === "website" && (
                <button
                  type="button"
                  onClick={handleWebsiteSignOut}
                  className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[8px] border border-white/15 bg-transparent px-[24px] font-['PT_Root_UI',sans-serif] text-[14px] font-medium leading-[1.3] text-white transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                >
                  {t("account.signOut.btn")}
                </button>
              )}
            </>
          )}

          {error && (
            <p className="text-center text-[14px] text-[#ff5d76]">{error}</p>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-full border-t border-white/5 bg-[#011417]">
        <div className="flex flex-col items-center gap-[16px] py-[32px] px-[20px]">
          <div className="flex flex-wrap justify-center gap-[20px] text-[14px] text-white/40 sm:gap-[32px]">
            <LocalizedLink to="/" className="hover:text-white transition-colors no-underline text-inherit">{t("nav.home")}</LocalizedLink>
            <LocalizedLink to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">{t("footer.privacy")}</LocalizedLink>
            <LocalizedLink to="/terms" className="hover:text-white transition-colors no-underline text-inherit">{t("footer.terms")}</LocalizedLink>
            <LocalizedLink to="/refund" className="hover:text-white transition-colors no-underline text-inherit">{t("footer.refund")}</LocalizedLink>
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
