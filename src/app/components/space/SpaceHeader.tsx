import { useEffect, useId, useState } from "react";
import { BookOpen, Chrome, Library, LogIn, Menu, X, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router";
import HeaderMobileMenu, { type HeaderMobileNavItem } from "../HeaderMobileMenu";
import LangSwitcher from "../LangSwitcher";
import LocalizedLink from "../LocalizedLink";
import { useLang } from "../../../i18n/LangContext";
import { useSpaceAuth } from "./SpaceAuthProvider";

const figmaHeaderAssetBase = "/assets/space/figma/header-atoms";

type SpaceNavItem = {
  label: "Learn" | "Extension" | "Library";
  icon: LucideIcon;
  to: string;
};

const navItems: SpaceNavItem[] = [
  { label: "Learn", icon: BookOpen, to: "/learn" },
  { label: "Extension", icon: Chrome, to: "/" },
  { label: "Library", icon: Library, to: "/prompt-library" },
];

type SpaceHeaderProps = {
  variant?: "space" | "learnOnly";
};

export default function SpaceHeader({ variant = "space" }: SpaceHeaderProps) {
  const location = useLocation();
  const { pathname } = location;
  const { lang } = useLang();
  const { status, account, session } = useSpaceAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const headerBackgroundClass = variant === "learnOnly" ? "bg-[#011417]/95" : "bg-[#011012]/95";
  const copy = headerCopy[lang];
  const next = `${pathname}${location.search}`;
  const loginTo = `/login?next=${encodeURIComponent(next)}`;
  const creditLabel = account ? `${account.remaining}/${account.limit}` : status === "loading" ? "..." : "0/300";
  const accountLabel = account?.email || session?.user.email || copy.account;
  const mobileNavItems: HeaderMobileNavItem[] = navItems.map((item) => ({
    active: isActiveNavItem(item.label, pathname),
    icon: item.icon,
    label: copy.nav[item.label],
    to: item.to,
  }));

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, location.search]);

  return (
    <header className={`sticky top-0 z-40 w-full border-b border-white/10 ${headerBackgroundClass} backdrop-blur-sm`}>
      <nav
        aria-label="Opten Space"
        className="mx-auto grid h-[64px] max-w-[1200px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-[32px] py-[16px] font-['PT_Root_UI',sans-serif] text-white max-lg:grid-cols-[auto_1fr_auto] max-md:px-4"
      >
        <LocalizedLink
          to="/"
          aria-label="Opten home"
          className="-ml-[4px] inline-flex h-[32px] w-[132px] items-center rounded-sm px-[4px] no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011012]"
        >
          <img
            src={`${figmaHeaderAssetBase}/logo-lockup.svg`}
            alt=""
            aria-hidden="true"
            width="124"
            height="23"
            className="block h-[23px] w-[124px] shrink-0"
          />
        </LocalizedLink>

        <div className="flex items-center justify-center gap-[12px] max-lg:hidden" aria-label="Space navigation">
          {navItems.map((item) => {
            const active = isActiveNavItem(item.label, pathname);
            const Icon = item.icon;
            return (
              <LocalizedLink
                key={item.label}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`group flex h-[32px] items-center gap-[8px] rounded-full px-[12px] py-[8px] text-[14px] font-medium leading-[1.1] no-underline outline-none transition focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011012] ${
                  active ? "bg-[#9cfb51]/10 text-white" : "bg-transparent text-white/70 hover:text-white"
                }`}
              >
                <Icon
                  aria-hidden="true"
                  size={16}
                  strokeWidth={2}
                  className={`h-[16px] w-[16px] shrink-0 transition ${
                    active ? "text-[#9cfb51]" : "text-white/70 group-hover:text-white"
                  }`}
                />
                <span>{copy.nav[item.label]}</span>
              </LocalizedLink>
            );
          })}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-[8px] max-lg:hidden">
          <LocalizedLink
            to="/pay"
            className="flex h-[31px] items-center gap-[8px] rounded-full px-[12px] py-[8px] no-underline outline-none transition hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#9cfb51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011012]"
            aria-label={copy.usage(creditLabel)}
          >
            <img
              src={`${figmaHeaderAssetBase}/icon-usage.svg`}
              alt=""
              aria-hidden="true"
              width="14"
              height="14"
              className="h-[14px] w-[14px] shrink-0"
            />
            <span className="text-[14px] font-medium leading-[1.1] text-white">{creditLabel}</span>
          </LocalizedLink>

          <LangSwitcher className="flex h-[32px] min-w-[42px] cursor-pointer items-center justify-center rounded-full border border-white/10 bg-transparent px-[10px] text-[13px] font-bold text-white/70 transition hover:border-white/25 hover:text-white" />

          {status === "signed_in" ? (
            <LocalizedLink
              to="/account"
              aria-label={accountLabel}
              title={accountLabel}
              className="flex h-[32px] max-w-[220px] items-center gap-[8px] rounded-full bg-transparent px-[12px] py-[8px] text-[14px] font-medium text-white/78 no-underline transition hover:bg-white/[0.04] hover:text-white"
            >
              <img
                src={`${figmaHeaderAssetBase}/icon-account.svg`}
                alt=""
                aria-hidden="true"
                width="16"
                height="16"
                className="h-[16px] w-[16px] shrink-0"
              />
              <span className="truncate">{accountLabel}</span>
            </LocalizedLink>
          ) : (
            <LocalizedLink
              to={loginTo}
              aria-label={copy.signIn}
              className="flex h-[32px] items-center gap-[8px] rounded-full bg-transparent px-[12px] py-[8px] text-[14px] font-medium text-white/78 no-underline transition hover:bg-white/[0.04] hover:text-white"
            >
              <LogIn size={16} />
              {copy.signIn}
            </LocalizedLink>
          )}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-[8px] lg:hidden">
          <LangSwitcher className="flex h-[36px] min-w-[42px] cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-[10px] text-[13px] font-bold text-white/76 transition hover:border-white/25 hover:text-white" />
          <button
            type="button"
            aria-label={mobileMenuOpen ? copy.closeMenu : copy.openMenu}
            aria-controls={mobileMenuId}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid size-[38px] place-items-center rounded-full border border-white/10 bg-white/[0.02] text-white/78 transition hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cfb51]/70"
          >
            {mobileMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <HeaderMobileMenu
        id={mobileMenuId}
        isOpen={mobileMenuOpen}
        navItems={mobileNavItems}
        creditLabel={creditLabel}
        usageAriaLabel={copy.usage(creditLabel)}
        accountLabel={accountLabel}
        signedIn={status === "signed_in"}
        loginTo={loginTo}
        signInLabel={copy.signIn}
        languageLabel={copy.language}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}

function isActiveNavItem(label: string, pathname: string) {
  if (label === "Learn") return pathname.startsWith("/learn") || pathname.startsWith("/en/learn");
  if (label === "Extension") return pathname === "/" || pathname === "/en";
  if (label === "Library") return pathname === "/prompt-library" || pathname === "/en/prompt-library";
  return false;
}

const headerCopy = {
  ru: {
    account: "Аккаунт",
    closeMenu: "Закрыть меню",
    language: "Язык",
    openMenu: "Открыть меню",
    signIn: "Войти",
    signOut: "Выйти",
    nav: { Learn: "Курсы", Extension: "Расширение", Library: "Библиотека" },
    usage: (value: string) => `Использовано кредитов: ${value}`,
  },
  en: {
    account: "Account",
    closeMenu: "Close menu",
    language: "Language",
    openMenu: "Open menu",
    signIn: "Sign in",
    signOut: "Sign out",
    nav: { Learn: "Courses", Extension: "Extension", Library: "Library" },
    usage: (value: string) => `Credit usage: ${value}`,
  },
} as const;
