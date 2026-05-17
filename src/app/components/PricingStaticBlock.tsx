// Phase 4 D-12: SSR-renderable pricing card pair extracted from PayPage.tsx (lines 434-528).
// Renders the visual pricing layout WITHOUT any runtime extension/Paddle state — the CTA in
// each card is always the Chrome Web Store anchor (static fallback). PayPage.tsx layers the
// runtime "Pay now" buttons in a separate section after this mount.
//
// SSR safety: no localStorage, no window access, no chrome.runtime, no useState/useEffect.
// Pure render from `defaultCurrency` prop + the LangContext (context value is provided in both
// renderToString (entry-server.tsx) and hydrateRoot (main.tsx) trees).

import { useT } from "../../i18n/LangContext";
import svgPaths from "../../imports/LandingPage/svg-bvy0jfb1g6";

// Phase 4 D-12: duplicated locally (not extension-coupled — marketing string only). The
// INTEGRATION-CONTRACT-synced EXTENSION_IDS / SUPABASE_* constants stay in PayPage.tsx.
const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";

function CheckIcon({ className = "text-white/60" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 size-[18px] ${className}`}>
      <svg className="absolute block size-full" fill="none" viewBox="0 0 18 18">
        <path d={svgPaths.p11eab980} fill="currentColor" />
      </svg>
    </div>
  );
}

function PricingFeature({ text, tone = "dark" }: { text: string; tone?: "dark" | "green" }) {
  return (
    <div className="flex items-start gap-[10px]">
      <CheckIcon className={tone === "green" ? "mt-[2px] text-[#011417]/70" : "mt-[2px] text-white/60"} />
      <span className={`font-['PT_Root_UI',sans-serif] text-[16px] leading-[1.55] md:text-[17px] ${tone === "green" ? "text-[#011417]" : "text-white"}`}>{text}</span>
    </div>
  );
}

function Divider() {
  return <div className="w-full h-[1px] shrink-0 bg-[rgba(255,255,255,0.1)]" />;
}

export default function PricingStaticBlock({ defaultCurrency }: { defaultCurrency: "RUB" | "USD" }) {
  const t = useT();
  const currency = defaultCurrency;

  return (
    <div className="grid w-full max-w-[800px] gap-[24px] md:grid-cols-2">
      {/* ── One-time Card (static — D-12) ── */}
      <div className="flex-1">
        <div className="card-hover relative min-h-[600px] overflow-hidden rounded-[12px] border border-white/10 bg-[#0e2023]">
          <div className="flex h-full min-h-[600px] flex-col justify-between p-[32px]">
            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[12px]">
                <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[24px] text-white tracking-[-0.48px]">{t("pricing.onetime.subtitle")}</p>
                <span className="font-['Unbounded',sans-serif] text-[48px] font-bold leading-[1.1] text-[#9cfb51]">{currency === "USD" ? t("pricing.onetime.priceUsd") : t("pricing.onetime.price")}</span>
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
            <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn-hover relative inline-flex cursor-pointer items-center justify-center gap-[12px] rounded-[100px] border-none bg-white px-[32px] py-[18px] no-underline">
              <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[100px]" />
              <span className="font-['PT_Root_UI',sans-serif] text-[18px] font-bold leading-[1.3] text-[#011417]">{t("pay.onetime.tryBtn")}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Pro Card (static — D-12) ── */}
      <div className="flex-1">
        <div className="card-hover relative min-h-[600px] overflow-hidden rounded-[12px] border border-white/10 bg-[#9cfb51] text-[#011417]">
          <div className="relative z-10 flex h-full min-h-[600px] flex-col justify-between p-[32px]">
            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[8px]">
                <p className="font-['PT_Root_UI',sans-serif] font-medium leading-[1.1] text-[24px] text-[#011417] tracking-[-0.48px]">{t("pricing.pro.subtitle")}</p>
                <div className="flex gap-[6px] items-end">
                  <span className="font-['Unbounded',sans-serif] text-[48px] font-bold leading-[1.1] text-[#011417]">{currency === "USD" ? t("pricing.pro.priceUsd") : t("pricing.pro.price")}</span>
                  <span className="pb-1 font-['PT_Root_UI',sans-serif] text-[16px] leading-[2] text-[#011417]/60">{t("pricing.pro.period")}</span>
                </div>
              </div>
              <div className="h-px w-full shrink-0 bg-[#011417]/12" />
              <div className="flex flex-col gap-[12px]">
                <PricingFeature tone="green" text={t("pricing.pro.feature1")} />
                <PricingFeature tone="green" text={t("pricing.pro.feature2")} />
                <PricingFeature tone="green" text={t("pricing.pro.feature3")} />
                <PricingFeature tone="green" text={t("pricing.pro.feature4")} />
                <PricingFeature tone="green" text={t("pricing.pro.feature5")} />
              </div>
            </div>
            <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn-hover relative inline-flex cursor-pointer items-center justify-center gap-[12px] rounded-[100px] border-none bg-[#011417] px-[32px] py-[18px] no-underline">
              <span className="font-['PT_Root_UI',sans-serif] text-[18px] font-bold leading-[1.3] text-[#9cfb51]">{t("pay.pro.tryBtn")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
