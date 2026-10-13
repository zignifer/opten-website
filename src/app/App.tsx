import { useEffect } from "react";
import { useLang, useT } from "../i18n/LangContext";
import { Hero, Partners, FeatureCards, Privacy, Pricing } from "./components/landing/LandingSections";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import FaqBlock from "./components/FaqBlock";
import ExtensionVideoAvatar from "./components/ExtensionVideoAvatar";
import { useSpaceAuth } from "./components/space/SpaceAuthProvider";
import { landingFaq } from "../content/landingFaq";
import type { AccountSummary } from "../lib/optenAuth";

function hasCurrentPaidAccess(account: AccountSummary | null): boolean {
  if (!account || account.plan === "free") return false;
  if (account.status !== "active" && account.status !== "cancelled") return false;
  if (!account.expires_at) return true;

  const expiresAt = Date.parse(account.expires_at);
  return Number.isNaN(expiresAt) || expiresAt > Date.now();
}

export default function App() {
  const t = useT();
  const { lang } = useLang();
  const { account, status } = useSpaceAuth();
  const showExtensionVideo = status !== "loading" && !hasCurrentPaidAccess(account);

  useEffect(() => {
    document.title = t("meta.title");
  }, [t]);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-[#011417] text-white">
      <SiteHeader />
      <main>
        <Hero />
        <Partners />
        <FeatureCards />
        <Privacy />
        <Pricing />
        {/* Phase 4 D-08 / GEO-D-3: landing FAQ block — schema in seo-routes.ts mirrors landingFaq[lang] (V-10). */}
        <FaqBlock items={landingFaq[lang]} />
      </main>
      {showExtensionVideo ? <ExtensionVideoAvatar /> : null}
      <SiteFooter />
    </div>
  );
}
