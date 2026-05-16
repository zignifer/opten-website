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

export function toEnTarget(pathname: string): string {
  if (EN_SIBLINGS.has(pathname)) {
    return pathname === "/" ? EN_LANDING : "/en" + pathname;
  }
  // D-07 / OQ-6: locked route without EN sibling (/account, /success, /dashboard/*)
  // — switcher routes to EN landing and writes localStorage so the content layer
  // flips when the user later navigates back to the unprefixed route.
  return EN_LANDING;
}

export function toRuTarget(pathname: string): string {
  if (pathname === "/en/" || pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3); // strips "/en"
  return "/";
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
