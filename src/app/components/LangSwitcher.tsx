// Phase 3 D-05 / D-07b + post-3 follow-ups:
//   1. URL is the primary signal for language; localStorage records the explicit
//      choice so it survives navigation away from /en/* into unprefixed locked
//      routes (/account, /success, /dashboard/*) that have no EN sibling.
//   2. On locked routes WITHOUT an EN sibling, the switcher must NOT navigate —
//      it flips language in place (storage + context state) so the user stays
//      on the page they were on. Previously the switcher dumped them onto the
//      EN landing, which felt like a redirect bug.
//
// EN_SIBLINGS and the path rewriters live in src/i18n/paths.ts.
//
// Open-Redirect mitigation (RESEARCH.md §Security T-03-22):
// No user-controlled strings flow into navigate(). The target is computed from
// pure path-rewriters operating against the allow-list only.

import { useLocation, useNavigate } from "react-router";
import { useLang } from "../../i18n/LangContext";
import { toEnTarget, toRuTarget } from "../../i18n/paths";

interface LangSwitcherProps {
  className?: string;
  label?: string;
  onSwitch?: () => void; // optional side effect, e.g. close mobile menu
}

export default function LangSwitcher({ className, label, onSwitch }: LangSwitcherProps): JSX.Element {
  const { lang, setLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const nextLang = lang === "ru" ? "en" : "ru";
  const activeLabel = lang === "ru" ? "RU" : "EN";

  return (
    <button
      type="button"
      onClick={() => {
        // Storage + context-state flip is synchronous and runs first so any
        // effect listening on lang/pathname converges to the new language
        // regardless of whether we navigate below.
        setLang(nextLang);

        const target =
          nextLang === "en"
            ? toEnTarget(location.pathname)
            : toRuTarget(location.pathname);

        // null means "no EN sibling for this URL" (e.g. /account, /success,
        // /dashboard/*) or "already on the right side" — stay on the current
        // page, just let the content layer re-render in the new language.
        if (target !== null && target !== location.pathname) {
          navigate(target);
        }

        onSwitch?.();
      }}
      className={className}
    >
      {label ? (
        <>
          <span>{label}</span>
          <span>{activeLabel}</span>
        </>
      ) : (
        activeLabel
      )}
    </button>
  );
}
