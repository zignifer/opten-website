import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Navigate } from "react-router";
import SpaceHeader from "../../components/space/SpaceHeader";
import { useSpaceAuth } from "../../components/space/SpaceAuthProvider";
import { sendMagicLink, startGoogleLogin } from "../../../lib/optenAuth";
import { useLang } from "../../../i18n/LangContext";

export default function AppLoginPage() {
  const { lang } = useLang();
  const { status } = useSpaceAuth();
  const copy = loginCopy[lang];
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (status === "signed_in") return <Navigate to="/app/learn" replace />;

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = email.trim();
    if (!normalized || formState === "sending") return;

    setFormState("sending");
    setError(null);
    try {
      await sendMagicLink(normalized);
      setFormState("sent");
    } catch (err) {
      setFormState("error");
      setError(err instanceof Error ? err.message : "magic_link_failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#011012] font-['PT_Root_UI',sans-serif] text-white">
      <SpaceHeader />
      <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-[1200px] items-center px-[32px] py-[42px] max-md:px-4">
        <section className="grid grid-cols-[minmax(0,1fr)_420px] gap-[24px] max-lg:grid-cols-1">
          <div className="max-w-[640px] self-center">
            <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#9cfb51]">Opten Space Beta</p>
            <h1 className="mt-[12px] font-['Unbounded',sans-serif] text-[42px] font-medium leading-[1.05] text-white max-sm:text-[32px]">
              {copy.title}
            </h1>
            <p className="mt-[16px] max-w-[540px] text-[17px] leading-[1.65] text-white/70">{copy.description}</p>
          </div>

          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-[20px] shadow-[0_24px_90px_rgba(0,0,0,0.25)]">
            <button
              type="button"
              onClick={() => startGoogleLogin()}
              className="flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[8px] border border-white/14 bg-white/[0.06] px-[16px] text-[15px] font-bold text-white transition hover:border-[#9cfb51]/50 hover:bg-white/[0.08]"
            >
              <span className="grid size-[22px] place-items-center rounded-full bg-white text-[13px] font-bold text-[#011012]">G</span>
              {copy.google}
              <ArrowRight size={18} className="ml-auto" />
            </button>

            <div className="my-[18px] flex items-center gap-[10px] text-[12px] uppercase tracking-[0.08em] text-white/36">
              <span className="h-px flex-1 bg-white/10" />
              {copy.or}
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleEmailSubmit}>
              <label className="block">
                <span className="mb-[8px] block text-[14px] font-medium text-white/74">{copy.emailLabel}</span>
                <span className="relative block">
                  <Mail
                    aria-hidden="true"
                    size={17}
                    className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-white/42"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy.emailPlaceholder}
                    className="h-[46px] w-full rounded-[8px] border border-white/10 bg-[#06191c] pl-[42px] pr-[14px] text-[15px] text-white outline-none transition placeholder:text-white/34 focus:border-[#9cfb51]/60"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={formState === "sending" || formState === "sent"}
                className="mt-[14px] flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[8px] bg-[#9cfb51] px-[16px] text-[16px] font-bold text-[#011417] transition hover:bg-[#8be942] disabled:cursor-default disabled:opacity-70"
              >
                {formState === "sending" ? <Loader2 size={18} className="animate-spin" /> : null}
                {formState === "sent" ? <CheckCircle2 size={18} /> : null}
                {formState === "sent" ? copy.sent : copy.emailButton}
              </button>
            </form>

            {error && <p className="mt-[12px] text-[13px] leading-[1.45] text-red-300">{copy.error}: {error}</p>}
            <p className="mt-[16px] text-[13px] leading-[1.5] text-white/52">{copy.note}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

const loginCopy = {
  ru: {
    title: "Войдите в Opten Space",
    description: "Используйте тот же аккаунт, на котором оформлена подписка. Кредиты и Pro-статус привязаны к аккаунту, а не к устройству.",
    google: "Войти через Google",
    or: "или",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    emailButton: "Получить ссылку для входа",
    sent: "Ссылка отправлена",
    error: "Не удалось отправить ссылку",
    note: "Email-вход работает через безопасную magic link ссылку. Пароль для MVP не требуется.",
  },
  en: {
    title: "Sign in to Opten Space",
    description: "Use the same account that owns the subscription. Credits and Pro status belong to the account, not to the device.",
    google: "Continue with Google",
    or: "or",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    emailButton: "Send sign-in link",
    sent: "Link sent",
    error: "Could not send the link",
    note: "Email sign-in uses a secure magic link. Passwords are not required for the MVP.",
  },
} as const;
