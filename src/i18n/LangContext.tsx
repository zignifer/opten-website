import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router";
import ru from "./ru.json";
// Phase 3 Pitfall 6 fallback: static import of en.json so the SSR path (typeof window === "undefined")
// can populate dicts.en synchronously. The ~13 KB gzip cost is accepted per RESEARCH.md A3 as the
// fallback when top-level await is unavailable in the client target environment (chrome87+).
// Vite does NOT tree-shake this import because the client target doesn't constant-fold typeof window;
// however, the EN dict was already reachable by clients via loadEnDict() anyway — no new information leak.
import enFallback from "./en.json";

export type Lang = "ru" | "en";

// Post-Phase-3 fix: bumped storage key from "opten_lang" → "opten_lang_v3".
// The previous key was contaminated by older builds that auto-wrote "ru" on detect,
// so EN-browser visitors with a stale value were pinned to RU forever even after
// switching their browser language. The new key is written ONLY by an explicit
// LangSwitcher click; the legacy key is still read as a one-shot migration for
// users who explicitly chose "en" before (RU-pinned values are intentionally
// ignored so navigator.language gets a fresh chance to win).
const STORAGE_KEY = "opten_lang_v3";
const LEGACY_STORAGE_KEY = "opten_lang";

function detectLangFromStorage(): Lang {
  // Phase 3 Pitfall 6: SSR-safe guard — localStorage and navigator are undefined during renderToString.
  if (typeof window === "undefined") return "ru";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  // One-shot legacy migration: only honor an explicit "en" choice from the old key
  // (RU is the default detect result so it's not safe to treat as an explicit choice).
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy === "en") return "en";
  return navigator.language.startsWith("ru") ? "ru" : "en";
}

// Phase 3 D-05: URL-prefix takes precedence over localStorage + navigator (GEO-C-4).
// Returns "en" only for explicit /en/* routes; returns null for unprefixed paths (D-07 preserved).
function detectLangFromPath(pathname: string): Lang | null {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  return null;
}

// Both RU and EN dictionaries are statically imported and eagerly available. RU is the SSR
// default; EN must ALSO be present synchronously because on /en/* LangProvider initializes
// lang="en" from the URL prefix (below), so the first client render — before hydrateRoot in
// main.tsx — must emit EN to match the prerendered EN HTML. If dicts.en were absent there,
// t() would fall back to RU, diverging from the server HTML → React #418 hydration mismatch →
// full client re-render → buttons unresponsive for a beat on iOS Safari (the reported symptom).
// enFallback is already in the client bundle (the static import is not tree-shaken), so this
// costs zero extra bytes — the earlier "lazy EN" optimization was already moot for that reason.
// loadEnDict() below is now a fast-return no-op but kept for the SPA language-switch flow.
type Dict = Record<string, string>;
const dicts: Partial<Record<Lang, Dict>> = { ru, en: enFallback as Dict };
let enLoadPromise: Promise<Dict> | null = null;

function loadEnDict(): Promise<Dict> {
  if (dicts.en) return Promise.resolve(dicts.en);
  if (!enLoadPromise) {
    enLoadPromise = import("./en.json").then((m) => {
      dicts.en = m.default as Dict;
      return dicts.en;
    });
  }
  return enLoadPromise;
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

export const LangContext = createContext<LangContextValue>({
  lang: "ru",
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathLang = detectLangFromPath(location.pathname);
  // Phase 3 D-05/D-07: URL prefix wins (synchronous, SSR-safe via useLocation).
  // Unprefixed paths default to "ru" (D-07 storage/navigator detection runs post-mount).
  const [lang, setLangState] = useState<Lang>(pathLang ?? "ru");
  // enReady flips to true once en.json is in `dicts`. When the user is on EN but
  // the dict hasn't loaded yet, t() falls through to ru — visible for one frame.
  const [, setEnReady] = useState(false);

  useEffect(() => {
    // Re-detect when location changes (e.g., LangSwitcher navigates /welcome → /en/welcome).
    const next = detectLangFromPath(location.pathname);
    if (next === "en") {
      if (!dicts.en) {
        loadEnDict().then(() => { setEnReady(true); setLangState("en"); });
      } else {
        setLangState("en");
      }
      return;
    }
    if (next === "ru") {
      setLangState("ru");
      return;
    }
    // D-07: unprefixed routes — keep status-quo storage/navigator detection (post-mount).
    const detected = detectLangFromStorage();
    if (detected === "en") {
      loadEnDict().then(() => { setEnReady(true); setLangState("en"); });
    } else {
      setLangState("ru");
    }
  }, [location.pathname]);

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    if (l === "en" && !dicts.en) {
      // Ensure dict is in memory before flipping state — avoids a flash of RU keys
      // shown literally when the t() lookup falls through.
      loadEnDict().then(() => {
        setEnReady(true);
        setLangState("en");
      });
    } else {
      setLangState(l);
    }
  };

  const t = (key: string): string => {
    const current = dicts[lang];
    if (current && current[key] !== undefined) return current[key];
    // Fallback to ru (always loaded), then the key itself.
    return dicts.ru?.[key] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT(): (key: string) => string {
  return useContext(LangContext).t;
}

export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const { lang, setLang } = useContext(LangContext);
  return { lang, setLang };
}

// Post-Phase-3: true iff the current URL is /en/-prefixed. Used by <LocalizedLink>
// to decide whether to rewrite internal hrefs to their EN sibling. Lives here (not
// in paths.ts) because it needs the react-router context that LangProvider already
// consumes via useLocation().
export function useOnEnPath(): boolean {
  const { pathname } = useLocation();
  return pathname === "/en" || pathname.startsWith("/en/");
}
