import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { normalizeSafeNext, storeSessionFromUrl } from "../../../lib/optenAuth";
import { useLang } from "../../../i18n/LangContext";
import { useSpaceAuth } from "../../components/space/SpaceAuthProvider";

export default function AppAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();
  const { refresh } = useSpaceAuth();
  const [error, setError] = useState<string | null>(null);
  const copy = callbackCopy[lang];
  const rawNext = new URLSearchParams(location.search).get("next");
  const safeNext = normalizeSafeNext(rawNext, location.pathname.startsWith("/app/") ? "/app/learn" : "/account");

  useEffect(() => {
    let cancelled = false;

    async function completeAuth() {
      try {
        storeSessionFromUrl(window.location.href);
        window.history.replaceState(null, "", window.location.pathname);
        await refresh();
        if (!cancelled) navigate(safeNext, { replace: true });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "auth_callback_failed");
      }
    }

    completeAuth();
    return () => {
      cancelled = true;
    };
  }, [navigate, refresh, safeNext]);

  return (
    <div className="grid min-h-screen place-items-center bg-[#011012] px-4 font-['PT_Root_UI',sans-serif] text-white">
      <section className="w-full max-w-[420px] rounded-[8px] border border-white/10 bg-white/[0.045] p-[24px] text-center">
        {error ? (
          <>
            <h1 className="text-[24px] font-bold leading-tight">{copy.errorTitle}</h1>
            <p className="mt-[10px] text-[14px] leading-[1.5] text-white/68">{error}</p>
            <button
              type="button"
              onClick={() => navigate(`/login?next=${encodeURIComponent(safeNext)}`, { replace: true })}
              className="mt-[18px] h-[42px] rounded-[8px] bg-[#9cfb51] px-[18px] text-[15px] font-bold text-[#011417]"
            >
              {copy.back}
            </button>
          </>
        ) : (
          <>
            <Loader2 size={28} className="mx-auto animate-spin text-[#9cfb51]" />
            <h1 className="mt-[14px] text-[22px] font-bold leading-tight">{copy.loadingTitle}</h1>
            <p className="mt-[8px] text-[14px] text-white/62">{copy.loadingText}</p>
          </>
        )}
      </section>
    </div>
  );
}

const callbackCopy = {
  ru: {
    loadingTitle: "Входим в Opten Space",
    loadingText: "Проверяем сессию и возвращаем вас в Learn.",
    errorTitle: "Войти не удалось",
    back: "Вернуться ко входу",
  },
  en: {
    loadingTitle: "Signing in to Opten Space",
    loadingText: "Checking the session and returning you to Learn.",
    errorTitle: "Could not sign in",
    back: "Back to sign in",
  },
} as const;
