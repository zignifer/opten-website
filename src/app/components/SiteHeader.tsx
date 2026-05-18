// Phase 5 B-03: unified site header with hamburger menu on every viewport.
// Replaces the bespoke Navbar() that lived in App.tsx (landing-only) and harmonizes
// header UX between landing and content pages.
//
// Layout (mobile + desktop identical):
//   [☰ hamburger]   [LOGO]   [LangSwitcher] [Account ▸]
// Dropdown panel below the bar contains: Home / Features / Pricing / Blog / FAQ / About.
//
// Variant prop drives anchor behavior:
//   - "landing" → anchors render as #features (smooth-scroll inside the current page)
//   - "page"    → anchors render as /#features (full-page nav back to landing, then scroll)
//
// LocalizedLink preserves /en/* prefix on both variants — anchor href is built from base
// path returned by useOnEnPath() so SiteHeader on /en/blog correctly links to /en/#features.

import { useEffect, useRef, useState } from "react";
import { Menu, User, X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import LocalizedLink from "./LocalizedLink";
import { useT, useOnEnPath } from "../../i18n/LangContext";

interface SiteHeaderProps {
  variant?: "landing" | "page";
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

export default function SiteHeader({ variant = "page" }: SiteHeaderProps): JSX.Element {
  const t = useT();
  const onEnPath = useOnEnPath();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Compose anchor hrefs based on variant. On `page` we send the user to the landing
  // route and then to the in-page anchor — the browser handles the scroll on first paint
  // (useNavigate({hash}) is unreliable across cold loads). On `landing` the bare hash
  // triggers smooth-scroll within the current page.
  const homeHref = onEnPath ? "/en/" : "/";
  const anchor = (hash: string): string => {
    if (variant === "landing") return `#${hash}`;
    return `${homeHref}#${hash}`;
  };

  // Outside-click + Escape close. Mousedown phase to beat React-Router Link onClick.
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-5">
      <nav className="mx-auto flex max-w-[1100px] items-center justify-between rounded-full bg-[rgba(0,0,0,0.34)] py-2 pl-2 pr-2 text-white backdrop-blur-md sm:pl-3">
        <button
          ref={buttonRef}
          type="button"
          aria-label={t("nav.menuToggle")}
          aria-expanded={open}
          aria-controls="site-header-menu"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full bg-white/5 transition hover:bg-white/10"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>

        <LocalizedLink to="/" className="absolute left-1/2 -translate-x-1/2" onClick={closeMenu}>
          <Logo />
        </LocalizedLink>

        <div className="flex items-center gap-2">
          <LangSwitcher
            className="font-['PT_Root_UI',sans-serif] text-[14px] text-white/55 transition hover:text-white bg-transparent border-none cursor-pointer px-2"
            onSwitch={closeMenu}
          />
          <LocalizedLink
            to="/account"
            className="inline-flex h-[40px] items-center gap-2 rounded-full bg-white px-3 sm:px-4 font-['PT_Root_UI',sans-serif] text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 no-underline"
            onClick={closeMenu}
          >
            <User size={16} fill="currentColor" />
            <span className="hidden sm:inline">{t("nav.account")}</span>
          </LocalizedLink>
        </div>
      </nav>

      {open && (
        <div
          ref={panelRef}
          id="site-header-menu"
          role="menu"
          className="mx-auto mt-2 flex max-w-[1100px] flex-col gap-1 rounded-[20px] border border-white/10 bg-[#071d1a] p-3 font-['PT_Root_UI',sans-serif] text-white shadow-2xl"
        >
          <LocalizedLink
            to="/"
            onClick={closeMenu}
            className="block rounded-[12px] px-4 py-3 text-[15px] text-white/85 transition hover:bg-white/5 hover:text-white no-underline"
          >
            {t("nav.home")}
          </LocalizedLink>
          <a
            href={anchor("features")}
            onClick={closeMenu}
            className="block rounded-[12px] px-4 py-3 text-[15px] text-white/85 transition hover:bg-white/5 hover:text-white no-underline"
          >
            {t("nav.features")}
          </a>
          <a
            href={anchor("pricing")}
            onClick={closeMenu}
            className="block rounded-[12px] px-4 py-3 text-[15px] text-white/85 transition hover:bg-white/5 hover:text-white no-underline"
          >
            {t("nav.pricing")}
          </a>
          <LocalizedLink
            to="/blog"
            onClick={closeMenu}
            className="block rounded-[12px] px-4 py-3 text-[15px] text-white/85 transition hover:bg-white/5 hover:text-white no-underline"
          >
            {t("nav.blog")}
          </LocalizedLink>
          <a
            href={anchor("faq")}
            onClick={closeMenu}
            className="block rounded-[12px] px-4 py-3 text-[15px] text-white/85 transition hover:bg-white/5 hover:text-white no-underline"
          >
            {t("nav.faq")}
          </a>
          <LocalizedLink
            to="/about"
            onClick={closeMenu}
            className="block rounded-[12px] px-4 py-3 text-[15px] text-white/85 transition hover:bg-white/5 hover:text-white no-underline"
          >
            {t("nav.about")}
          </LocalizedLink>
        </div>
      )}
    </header>
  );
}
