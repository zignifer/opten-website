// Unified website header. The marketing menu is intentionally omitted: content
// navigation lives in the footer, while the header focuses on account, credits,
// language, and brand presence across marketing, billing, and app routes.

import { LogIn, User } from "lucide-react";
import { useLocation } from "react-router";
import LangSwitcher from "./LangSwitcher";
import LocalizedLink from "./LocalizedLink";
import { useT } from "../../i18n/LangContext";
import { ANNOUNCEMENT_ENABLED } from "../announcementConfig";
import { useSpaceAuth } from "./space/SpaceAuthProvider";

interface SiteHeaderProps {
  variant?: "landing" | "page";
  rightSlot?: React.ReactNode;
}

function Logo() {
  return (
    <img
      alt="Opten"
      src="/logo.svg"
      width="62"
      height="20"
      loading="eager"
      className="h-[18px] w-auto md:h-[20px]"
    />
  );
}

export default function SiteHeader({ rightSlot }: SiteHeaderProps): JSX.Element {
  const t = useT();
  const location = useLocation();
  const { status, account, session } = useSpaceAuth();
  const creditLabel = account ? `${account.remaining}/${account.limit}` : status === "loading" ? "..." : "0/300";
  const accountLabel = account?.email || session?.user.email || t("nav.account");
  const next = `${location.pathname}${location.search}`;
  const loginTo = `/login?next=${encodeURIComponent(next)}`;

  return (
    <header className={`fixed left-0 right-0 ${ANNOUNCEMENT_ENABLED ? "top-[40px]" : "top-0"} z-50 border-b border-white/10 bg-[#011012]/95 backdrop-blur-sm`}>
      <nav
        aria-label="Opten"
        className="mx-auto grid h-[64px] max-w-[1200px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-[32px] py-[16px] font-['PT_Root_UI',sans-serif] text-white max-lg:grid-cols-[auto_1fr_auto] max-md:px-4"
      >
        <LocalizedLink
          to="/"
          aria-label="Opten home"
          className="-ml-[4px] inline-flex h-[44px] w-[92px] items-center rounded-sm px-[4px] no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011012]"
        >
          <Logo />
        </LocalizedLink>

        <div className="hidden items-center justify-center gap-[12px] md:flex" aria-label="Account credits">
          <div
            className="flex h-[36px] items-center gap-[8px] rounded-full px-[12px] py-[8px]"
            aria-label={`Credits: ${creditLabel}`}
          >
            <img
              src="/assets/space/figma/header-atoms/icon-usage.svg"
              alt=""
              aria-hidden="true"
              width="14"
              height="14"
              className="h-[14px] w-[14px] shrink-0"
            />
            <span className="text-[14px] font-medium leading-[1.1] text-white">{creditLabel}</span>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-[8px]">
          <LangSwitcher className="flex h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-white/10 bg-transparent px-[10px] font-['PT_Root_UI',sans-serif] text-[13px] font-bold text-white/70 transition hover:border-white/25 hover:text-white" />

          {rightSlot ?? (
            status === "signed_in" ? (
              <LocalizedLink
                to="/account"
                aria-label={accountLabel}
                title={accountLabel}
                className="flex h-[44px] max-w-[220px] items-center gap-[8px] rounded-full bg-transparent px-[12px] py-[8px] text-[14px] font-medium text-white/78 no-underline transition hover:bg-white/[0.04] hover:text-white"
              >
                <User size={16} fill="currentColor" aria-hidden="true" />
                <span className="hidden truncate sm:inline">{accountLabel}</span>
              </LocalizedLink>
            ) : (
              <LocalizedLink
                to={loginTo}
                aria-label={t("nav.login")}
                className="flex h-[44px] items-center gap-[8px] rounded-full bg-transparent px-[12px] py-[8px] text-[14px] font-medium text-white/78 no-underline transition hover:bg-white/[0.04] hover:text-white"
              >
                <LogIn size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{t("nav.login")}</span>
              </LocalizedLink>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
