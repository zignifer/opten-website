import { LogIn, type LucideIcon } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import LocalizedLink from "./LocalizedLink";

export type HeaderMobileNavItem = {
  active: boolean;
  icon: LucideIcon;
  label: string;
  to: string;
};

type HeaderMobileMenuProps = {
  accountLabel: string;
  creditLabel: string;
  id: string;
  isOpen: boolean;
  languageLabel: string;
  loginTo: string;
  navItems: HeaderMobileNavItem[];
  onClose: () => void;
  signInLabel: string;
  signedIn: boolean;
  usageAriaLabel: string;
};

const figmaHeaderAssetBase = "/assets/space/figma/header-atoms";

export default function HeaderMobileMenu({
  accountLabel,
  creditLabel,
  id,
  isOpen,
  languageLabel,
  loginTo,
  navItems,
  onClose,
  signInLabel,
  signedIn,
  usageAriaLabel,
}: HeaderMobileMenuProps) {
  return (
    <div
      id={id}
      className={`absolute left-0 right-0 top-full border-b border-white/10 bg-[#011417]/98 px-4 pb-4 pt-3 shadow-[0_22px_44px_rgba(0,0,0,0.32)] backdrop-blur-sm lg:hidden ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[10px] border border-white/10 bg-[#0e2023] p-[6px]">
        <div className="grid gap-[2px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <LocalizedLink
                key={item.label}
                to={item.to}
                aria-current={item.active ? "page" : undefined}
                onClick={onClose}
                className={`group flex h-[46px] items-center gap-[11px] rounded-[8px] px-[12px] text-[15px] font-bold leading-none no-underline outline-none transition focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011417] ${
                  item.active ? "bg-[#9cfb51]/12 text-white" : "text-white/72 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  aria-hidden="true"
                  size={17}
                  strokeWidth={2}
                  className={`shrink-0 ${item.active ? "text-[#9cfb51]" : "text-white/55 group-hover:text-white/82"}`}
                />
                <span>{item.label}</span>
              </LocalizedLink>
            );
          })}
        </div>

        <div className="mt-[6px] grid gap-[2px] border-t border-white/8 pt-[6px]">
          <LocalizedLink
            to="/pay"
            aria-label={usageAriaLabel}
            onClick={onClose}
            className="flex h-[44px] items-center justify-between rounded-[8px] px-[12px] text-[14px] font-bold text-white no-underline outline-none transition hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011417]"
          >
            <span className="flex items-center gap-[10px]">
              <img
                src={`${figmaHeaderAssetBase}/icon-usage.svg`}
                alt=""
                aria-hidden="true"
                width="14"
                height="14"
                className="h-[14px] w-[14px] shrink-0"
              />
              <span>Pro</span>
            </span>
            <span className="text-white/78">{creditLabel}</span>
          </LocalizedLink>

          <LocalizedLink
            to={signedIn ? "/account" : loginTo}
            aria-label={signedIn ? accountLabel : signInLabel}
            title={signedIn ? accountLabel : undefined}
            onClick={onClose}
            className="flex h-[44px] items-center gap-[10px] rounded-[8px] px-[12px] text-[14px] font-bold text-white/78 no-underline outline-none transition hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011417]"
          >
            {signedIn ? (
              <img
                src={`${figmaHeaderAssetBase}/icon-account.svg`}
                alt=""
                aria-hidden="true"
                width="16"
                height="16"
                className="h-[16px] w-[16px] shrink-0"
              />
            ) : (
              <LogIn size={16} aria-hidden="true" className="shrink-0" />
            )}
            <span className="truncate">{signedIn ? accountLabel : signInLabel}</span>
          </LocalizedLink>

          <LangSwitcher
            label={languageLabel}
            onSwitch={onClose}
            className="flex h-[44px] w-full cursor-pointer items-center justify-between rounded-[8px] px-[12px] text-left text-[14px] font-bold text-white/78 outline-none transition hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011417]"
          />
        </div>
      </div>
    </div>
  );
}
