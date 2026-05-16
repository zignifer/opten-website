// Phase 3 D-05 / D-07b: URL is the only way to change language during a session.
// The switcher computes a target path from a literal allow-list (EN_SIBLINGS) and
// calls react-router navigate() — never writes to localStorage directly.
//
// SYNC: EN_SIBLINGS MUST match the 6 EN entries in scripts/seo-routes.ts.
// Update both files whenever an EN route is added or removed.
//
// Open-Redirect mitigation (RESEARCH.md §Security Domain T-03-22):
// No user-controlled strings (window.location.search, location.hash, query params,
// postMessage payloads) flow into navigate(). The target is computed from a pure
// path-rewrite function operating against the allow-list only.

import { useLocation, useNavigate } from "react-router";
import { useLang } from "../../i18n/LangContext";

// SYNC: must match the 6 EN entries in scripts/seo-routes.ts.
// Update both when adding/removing EN routes.
const EN_SIBLINGS = new Set(["/", "/welcome", "/pay", "/privacy", "/terms", "/refund"]);
const EN_LANDING = "/en/";

function getEnTarget(currentPath: string): string {
  if (EN_SIBLINGS.has(currentPath)) {
    return currentPath === "/" ? EN_LANDING : "/en" + currentPath;
  }
  // Pitfall 9 / OQ-6: locked routes without EN sibling → route to EN landing.
  return EN_LANDING;
}

function getRuTarget(currentPath: string): string {
  if (currentPath === "/en/" || currentPath === "/en") return "/";
  if (currentPath.startsWith("/en/")) return currentPath.slice(3); // strips "/en"
  // Defensive fallback — should never hit (switcher shows "RU" only when lang === "en"
  // which implies we are on a /en/* URL).
  return "/";
}

interface LangSwitcherProps {
  className?: string;
  onSwitch?: () => void; // optional side effect, e.g. close mobile menu
}

export default function LangSwitcher({ className, onSwitch }: LangSwitcherProps): JSX.Element {
  const { lang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const target =
    lang === "ru"
      ? getEnTarget(location.pathname)
      : getRuTarget(location.pathname);

  return (
    <button
      type="button"
      onClick={() => {
        navigate(target);
        onSwitch?.();
      }}
      className={className}
    >
      {lang === "ru" ? "EN" : "RU"}
    </button>
  );
}
