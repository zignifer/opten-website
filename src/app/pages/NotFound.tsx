// Phase 4.2 / Wave 3 (P1-1): catch-all 404 surface.
// Replaces the soft-404 fallback (Vercel SPA rewrite served the landing for any
// unknown path → 200 OK + landing-like content, indexed by Google as duplicate
// content). React Router 7 now matches <Route path="*"> last and renders this
// view client-side. The HTTP status remains 200 (changing it would require a
// Vercel edge function — deferred per CONTEXT D-3, Phase 6 architectural refactor).
//
// The component injects <meta name="robots" content="noindex,nofollow"> into
// <head> on mount so crawlers stop indexing typo'd URLs as duplicates of the
// landing. On unmount (e.g. user clicks the home link) the meta is removed so
// the next page does not inherit a stale noindex.

import { useEffect } from "react";
import { useT, useLang } from "../../i18n/LangContext";
import LocalizedLink from "../components/LocalizedLink";

export default function NotFound() {
  const t = useT();
  const { lang } = useLang();

  useEffect(() => {
    // Set page title (locale-aware).
    const previousTitle = document.title;
    document.title = `${t("notFound.title")} — Opten`;

    // Inject (or update) <meta name="robots" content="noindex,nofollow">.
    // Idempotent: reuse an existing tag if present, otherwise create one.
    // We track whether we created the tag so cleanup only removes our own
    // injection and leaves any pre-existing robots tag intact.
    let createdMeta = false;
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
      createdMeta = true;
    }
    meta.setAttribute("content", "noindex,nofollow");

    return () => {
      // Restore title.
      document.title = previousTitle;
      // Clean up our meta injection so navigating to a real page (e.g. via the
      // home link) does not leave a noindex hint behind.
      if (createdMeta) {
        meta?.parentNode?.removeChild(meta);
      } else if (previousContent !== null) {
        meta?.setAttribute("content", previousContent);
      }
    };
    // Depend on `lang` (stable across renders) rather than `t` (fresh closure
    // each LangProvider render — would cause unnecessary inject/cleanup churn).
    // t(key) is semantically a pure function of lang for this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-[20px] py-[96px] font-['PT_Root_UI',sans-serif]">
      <div className="max-w-[640px] w-full text-center">
        <p className="text-[14px] uppercase tracking-[0.1em] text-[rgba(0,0,0,0.4)] mb-[16px]">
          404
        </p>
        <h1 className="text-[32px] sm:text-[40px] leading-[1.1] font-bold text-black mb-[16px]">
          {t("notFound.title")}
        </h1>
        <p className="text-[16px] sm:text-[18px] leading-[1.5] text-[rgba(0,0,0,0.65)] mb-[32px]">
          {t("notFound.body")}
        </p>
        <LocalizedLink
          to="/"
          className="inline-block px-[24px] py-[12px] rounded-[12px] bg-black text-white text-[15px] no-underline hover:opacity-90 transition-opacity"
        >
          {t("notFound.home")}
        </LocalizedLink>
      </div>
    </main>
  );
}
