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

const STORAGE_KEY = "opten_lang";

function detectLangFromStorage(): Lang {
  // Phase 3 Pitfall 6: SSR-safe guard — localStorage and navigator are undefined during renderToString.
  if (typeof window === "undefined") return "ru";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  return navigator.language.startsWith("ru") ? "ru" : "en";
}

// Phase 3 D-05: URL-prefix takes precedence over localStorage + navigator (GEO-C-4).
// Returns "en" only for explicit /en/* routes; returns null for unprefixed paths (D-07 preserved).
function detectLangFromPath(pathname: string): Lang | null {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  return null;
}

// Phase 2.2: EN dictionary lazy-loaded. The bundle analyzer revealed that statically
// importing both ru.json (16.5 KB gzip) and en.json (12.8 KB gzip) was burning 29 KB
// of gzipped weight on every visit — about 18 % of the entire main bundle — even
// though every visitor uses exactly one language. RU stays statically imported
// because it's the SSR default (LangProvider initial state) so it must be available
// synchronously during hydration; EN loads on demand via dynamic import() when a
// visitor's navigator.language indicates EN or they explicitly switch. EN visitors
// see RU text for one render frame, then the lang state updates and the tree re-
// renders in EN — barely perceptible, especially since the EN chunk lands in
// 30-80 ms on any decent connection.
type Dict = Record<string, string>;
const dicts: Partial<Record<Lang, Dict>> = { ru };
let enLoadPromise: Promise<Dict> | null = null;

// Phase 3 Pitfall 6 / Open Question #4: SSR needs synchronous en.json access so renderToString
// on /en/* sees EN strings. Top-level await was rejected by esbuild (chrome87 target).
// Fallback (RESEARCH.md OQ-4 recommendation b): use the statically-imported enFallback
// and populate dicts.en synchronously on the SERVER path at module-evaluation time.
// On the CLIENT, typeof window !== "undefined" so the branch is skipped — clients still
// use the lazy loadEnDict() path (zero behavioral change for browser visitors).
if (typeof window === "undefined") {
  (dicts as Record<Lang, Dict | undefined>).en = enFallback as Dict;
}

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
