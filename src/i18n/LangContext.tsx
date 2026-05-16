import { createContext, useContext, useState, useEffect } from "react";
import ru from "./ru.json";

export type Lang = "ru" | "en";

const STORAGE_KEY = "opten_lang";

function detectLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  return navigator.language.startsWith("ru") ? "ru" : "en";
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
  const [lang, setLangState] = useState<Lang>("ru"); // Phase 2 D-05: SSR-safe RU default; detection runs in useEffect below.
  // enReady flips to true once en.json is in `dicts`. When the user is on EN but
  // the dict hasn't loaded yet, t() falls through to ru — visible for one frame.
  const [, setEnReady] = useState(false);

  useEffect(() => {
    // detectLang() reads localStorage + navigator — defer to client mount (RESEARCH.md Pitfall 1).
    const detected = detectLang();
    if (detected === "en") {
      loadEnDict().then(() => {
        setEnReady(true);
        setLangState("en");
      });
    } else {
      setLangState("ru");
    }
  }, []);

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
