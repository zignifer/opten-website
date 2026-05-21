// Resets scroll to the top on client-side route changes. <BrowserRouter> (non-data
// router) does not manage scroll, so footer links (privacy/terms/blog sit at the
// bottom) used to land the next page at its previous scrollY — i.e. "opens at the
// bottom". Renders null; mounted in BOTH main.tsx and entry-server.tsx so the SSR
// and client trees stay identical (no DOM output → no hydration offset).
import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

// useLayoutEffect on the client avoids a one-frame flash at the old scroll position;
// fall back to useEffect under SSR (renderToString) to silence the no-op warning.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  useIsoLayoutEffect(() => {
    if (hash) return; // preserve native anchor scroll (e.g. /#faq)
    if (navType === "POP") return; // back/forward + initial load — let the browser restore
    window.scrollTo(0, 0);
  }, [pathname, hash, navType]);
  return null;
}
