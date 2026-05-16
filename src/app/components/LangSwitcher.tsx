// Phase 3 D-05 / D-07b + post-3 follow-up: URL is the primary signal; localStorage
// records the explicit choice so it survives navigation away from /en/* into
// unprefixed locked routes (/account, /success, /dashboard/*) that have no EN sibling.
//
// EN_SIBLINGS and the path rewriters live in src/i18n/paths.ts.
//
// Open-Redirect mitigation (RESEARCH.md §Security T-03-22):
// No user-controlled strings (window.location.search, location.hash, query params,
// postMessage payloads) flow into navigate(). The target is computed from a pure
// path-rewrite function operating against the allow-list only.

import { useLocation, useNavigate } from "react-router";
import { useLang } from "../../i18n/LangContext";
import { toEnTarget, toRuTarget } from "../../i18n/paths";

interface LangSwitcherProps {
  className?: string;
  onSwitch?: () => void; // optional side effect, e.g. close mobile menu
}

export default function LangSwitcher({ className, onSwitch }: LangSwitcherProps): JSX.Element {
  const { lang, setLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const nextLang = lang === "ru" ? "en" : "ru";
  const target =
    lang === "ru"
      ? toEnTarget(location.pathname)
      : toRuTarget(location.pathname);

  return (
    <button
      type="button"
      onClick={() => {
        // Write storage first so any code reading localStorage during the navigate
        // (e.g. LangProvider effect on the new route) sees the explicit choice.
        setLang(nextLang);
        navigate(target);
        onSwitch?.();
      }}
      className={className}
    >
      {lang === "ru" ? "EN" : "RU"}
    </button>
  );
}
