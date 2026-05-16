// Phase 3 follow-up (post-3): single source of truth for EN-sibling rewrites.
// SYNC: EN_SIBLINGS MUST match the 6 EN entries in scripts/seo-routes.ts.
// Update both files whenever an EN route is added or removed.
//
// Open-Redirect mitigation (RESEARCH.md §Security T-03-22 preserved):
// Targets are computed from a pure path-rewrite operating against the allow-list
// only. No user-controlled strings (search, hash, postMessage) flow into navigate().

export const EN_SIBLINGS = new Set<string>([
  "/",
  "/welcome",
  "/pay",
  "/privacy",
  "/terms",
  "/refund",
]);

export const EN_LANDING = "/en/";

// Normalize trailing slashes so /privacy and /privacy/ both look up the same
// sibling. Phase 2 D-07 says the canonical form is without a trailing slash,
// but `/` and `/en/` are the two exceptions (those keep their slash).
function stripTrailingSlash(p: string): string {
  if (p === "/" || p === "/en/") return p;
  return p.endsWith("/") ? p.slice(0, -1) : p;
}

// Returns the /en/<sibling> URL when the current path has an EN sibling, or null
// otherwise. Callers (LangSwitcher) treat null as "do not navigate — keep the URL,
// flip language via storage so the content layer updates in place". This is the
// fix for the user-reported "switching language on /account/-style pages dumps me
// back on the EN landing" bug: locked routes without EN siblings (/account,
// /success, /dashboard/*) should NOT navigate at all.
export function toEnTarget(pathname: string): string | null {
  const p = stripTrailingSlash(pathname);
  if (EN_SIBLINGS.has(p)) {
    return p === "/" ? EN_LANDING : "/en" + p;
  }
  return null;
}

// Mirror of toEnTarget for EN→RU. Returns the RU URL only when stripping the
// /en/ prefix actually changes the path; null otherwise (already on an
// unprefixed route — URL stays, content flips via setLang).
export function toRuTarget(pathname: string): string | null {
  const p = stripTrailingSlash(pathname);
  if (p === "/en") return "/";
  if (p.startsWith("/en/")) return p.slice(3); // strips "/en"
  return null;
}

// Used by <LocalizedLink>: when the user is currently on a /en/* URL, an internal
// link like to="/pay" should resolve to "/en/pay" so the URL prefix (and the
// hreflang signal it carries) survives the navigation. For non-sibling targets
// (e.g. to="/account") the original path is returned — the content layer relies
// on localStorage / context to keep the language flipped on unprefixed URLs.
export function localizeHref(href: string, onEnPath: boolean): string {
  if (!onEnPath) return href;
  if (href.startsWith("/en/") || href === "/en") return href;
  if (!href.startsWith("/")) return href; // external / hash-only / mailto — skip
  const match = href.match(/^([^?#]*)(.*)$/);
  const path = match?.[1] ?? href;
  const suffix = match?.[2] ?? "";
  if (EN_SIBLINGS.has(path)) {
    return (path === "/" ? EN_LANDING : "/en" + path) + suffix;
  }
  return href;
}
