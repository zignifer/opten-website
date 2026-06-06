import LocalizedLink from "../LocalizedLink";
import { BookOpen, Chrome, Library, LogIn, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router";
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
  const { pathname } = useLocation();
  const { lang, setLang } = useLang();
  const { status, account, session } = useSpaceAuth();
  const headerBackgroundClass = variant === "learnOnly" ? "bg-[#011417]/95" : "bg-[#011012]/95";
  const copy = headerCopy[lang];
  const loginTo = `/login?next=${encodeURIComponent(pathname)}`;
  const creditLabel = account ? `${account.remaining}/${account.limit}` : status === "loading" ? "..." : "0/300";
  const accountLabel = account?.email || session?.user.email || copy.account;

  return (
    <header className={`sticky top-0 z-40 w-screen border-b border-white/10 ${headerBackgroundClass} backdrop-blur-sm`}>
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

        <div className="flex items-center justify-center gap-[12px] max-md:hidden" aria-label="Space navigation">
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

          <button
            type="button"
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            aria-label={copy.switchLanguage}
            className="flex h-[32px] min-w-[42px] cursor-pointer items-center justify-center rounded-full border border-white/10 bg-transparent px-[10px] text-[13px] font-bold text-white/70 transition hover:border-white/25 hover:text-white"
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>

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
      </nav>
    </header>
  );
}

function isActiveNavItem(label: string, pathname: string) {
  if (label === "Learn") return pathname.startsWith("/learn") || pathname.startsWith("/en/learn");
  if (label === "Extension") return pathname === "/";
  if (label === "Library") return pathname === "/prompt-library";
  return false;
}

const headerCopy = {
  ru: {
    account: "Аккаунт",
    signIn: "Войти",
    signOut: "Выйти",
    switchLanguage: "Переключить язык",
    nav: { Learn: "Курсы", Extension: "Расширение", Library: "Библиотека" },
    usage: (value: string) => `Использовано кредитов: ${value}`,
  },
  en: {
    account: "Account",
    signIn: "Sign in",
    signOut: "Sign out",
    switchLanguage: "Switch language",
    nav: { Learn: "Courses", Extension: "Extension", Library: "Library" },
    usage: (value: string) => `Credit usage: ${value}`,
  },
} as const;
