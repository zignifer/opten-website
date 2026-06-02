// Phase 3 follow-up (post-3): single source of truth for EN-sibling rewrites.
// SYNC: EN_SIBLINGS MUST match the EN entries in scripts/seo-routes.ts.
// Static entries below + dynamic /models/<slug> entries (Phase v2.0 MODELS-A-7)
// derived from src/content/models/slugs.ts. Update both files when adding routes.
//
// Open-Redirect mitigation (RESEARCH.md §Security T-03-22 preserved):
// Targets are computed from a pure path-rewrite operating against the allow-list
// only. No user-controlled strings (search, hash, postMessage) flow into navigate().

// Phase v2.0 MODELS-A-7: light-import — `slugs.ts` only re-exports a string[],
// no React or content modules pulled into the i18n bundle (R2 mitigation).
import { MODEL_SLUGS_WITH_CONTENT } from "../content/models/slugs";

const STATIC_EN_SIBLINGS: readonly string[] = [
  "/",
  "/welcome",
  "/pay",
  "/privacy",
  "/terms",
  "/refund",
  "/about", // Phase 4.1 B-03
  "/blog", // Phase 5 B-04
  "/blog/prompt-examples", // Daily blog automation
  "/blog/seedance-2-0-prompts", // Daily blog automation
  "/blog/ai-face-swap", // Daily blog automation
  "/blog/best-ai-video-2026", // Daily blog automation
  "/blog/sora-2-vs-veo-3-1", // Daily blog automation
  "/blog/ai-logo-generator-prompt", // Daily blog automation
  "/blog/nano-banana-prompts", // Daily blog automation
  "/blog/consistent-character-ai", // Daily blog automation
  "/blog/prompt-structure", // Daily blog automation
  "/blog/negative-prompt", // Daily blog automation
  "/blog/image-to-video", // Blog automation trial
  "/blog/gpt-image-2", // Phase 5 B-05/B-07
  "/models", // Phase v2.0 MODELS-A-7
];

const MODEL_PATHS = MODEL_SLUGS_WITH_CONTENT.map((slug) => `/models/${slug}`);

export const EN_SIBLINGS = new Set<string>([...STATIC_EN_SIBLINGS, ...MODEL_PATHS]);

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
