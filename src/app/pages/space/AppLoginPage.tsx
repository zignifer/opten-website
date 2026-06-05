import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import SpaceHeader from "../../components/space/SpaceHeader";
import { useSpaceAuth } from "../../components/space/SpaceAuthProvider";
import { sendEmailOtp, startGoogleLogin, verifyEmailOtp } from "../../../lib/optenAuth";
import { useLang } from "../../../i18n/LangContext";

export default function AppLoginPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { status, refresh } = useSpaceAuth();
  const copy = loginCopy[lang];
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "verifying" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (status === "signed_in") return <Navigate to="/app/learn" replace />;

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = email.trim();
    if (!normalized || formState === "sending") return;

    setFormState("sending");
    setError(null);
    try {
      await sendEmailOtp(normalized);
      setFormState("sent");
    } catch (err) {
      setFormState("error");
      const message = err instanceof Error ? err.message : "email_otp_failed";
      setError(resolveLoginError(message, copy));
    }
  }

  async function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    const normalizedCode = normalizeOtpCode(code);
    if (!normalizedEmail || normalizedCode.length !== 6 || formState === "verifying") return;

    setFormState("verifying");
    setError(null);
    try {
      await verifyEmailOtp(normalizedEmail, normalizedCode);
      await refresh();
      navigate("/app/learn", { replace: true });
    } catch (err) {
      setFormState("sent");
      const message = err instanceof Error ? err.message : "otp_verify_failed";
      setError(resolveLoginError(message, copy));
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
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (formState === "sent" || formState === "verifying") {
                        setCode("");
                        setFormState("idle");
                        setError(null);
                      }
                    }}
                    placeholder={copy.emailPlaceholder}
                    className="h-[46px] w-full rounded-[8px] border border-white/10 bg-[#06191c] pl-[42px] pr-[14px] text-[15px] text-white outline-none transition placeholder:text-white/34 focus:border-[#9cfb51]/60"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={formState === "sending" || formState === "sent" || formState === "verifying"}
                className="mt-[14px] flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[8px] bg-[#9cfb51] px-[16px] text-[16px] font-bold text-[#011417] transition hover:bg-[#8be942] disabled:cursor-default disabled:opacity-70"
              >
                {formState === "sending" ? <Loader2 size={18} className="animate-spin" /> : null}
                {formState === "sent" ? <CheckCircle2 size={18} /> : null}
                {formState === "sent" ? copy.sent : copy.emailButton}
              </button>
            </form>

            {(formState === "sent" || formState === "verifying") && (
              <form onSubmit={handleCodeSubmit} className="mt-[16px] rounded-[8px] border border-white/10 bg-[#06191c]/70 p-[14px]">
                <label className="block">
                  <span className="mb-[8px] block text-[14px] font-medium text-white/74">{copy.codeLabel}</span>
                  <span className="relative block">
                    <KeyRound
                      aria-hidden="true"
                      size={17}
                      className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-white/42"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(event) => setCode(normalizeOtpCode(event.target.value))}
                      placeholder={copy.codePlaceholder}
                      className="h-[46px] w-full rounded-[8px] border border-white/10 bg-[#011012] pl-[42px] pr-[14px] text-[18px] font-bold tracking-[0.18em] text-white outline-none transition placeholder:text-[15px] placeholder:font-normal placeholder:tracking-normal placeholder:text-white/34 focus:border-[#9cfb51]/60"
                    />
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={formState === "verifying" || normalizeOtpCode(code).length !== 6}
                  className="mt-[12px] flex h-[46px] w-full items-center justify-center gap-[10px] rounded-[8px] border border-[#9cfb51]/50 bg-[#9cfb51]/12 px-[16px] text-[15px] font-bold text-[#9cfb51] transition hover:bg-[#9cfb51]/18 disabled:cursor-default disabled:opacity-60"
                >
                  {formState === "verifying" ? <Loader2 size={18} className="animate-spin" /> : null}
                  {copy.codeButton}
                </button>
              </form>
            )}

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
    emailButton: "Получить код",
    sent: "Код отправлен",
    codeLabel: "Код из письма",
    codePlaceholder: "6 цифр",
    codeButton: "Войти по коду",
    invalidCode: "Код неверный или устарел. Проверьте цифры из последнего письма.",
    rateLimited: "Слишком много попыток. Подождите минуту и попробуйте снова.",
    genericError: "Попробуйте ещё раз или войдите через Google.",
    error: "Не удалось выполнить вход",
    note: "Email-вход работает через одноразовый код из письма. Пароль для MVP не требуется.",
  },
  en: {
    title: "Sign in to Opten Space",
    description: "Use the same account that owns the subscription. Credits and Pro status belong to the account, not to the device.",
    google: "Continue with Google",
    or: "or",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    emailButton: "Get code",
    sent: "Code sent",
    codeLabel: "Code from email",
    codePlaceholder: "6 digits",
    codeButton: "Sign in with code",
    invalidCode: "The code is invalid or expired. Check the digits from the latest email.",
    rateLimited: "Too many attempts. Wait a minute and try again.",
    genericError: "Try again or continue with Google.",
    error: "Could not sign in",
    note: "Email sign-in works with a one-time code from the email. Passwords are not required for the MVP.",
  },
} as const;

function isInvalidOtpError(message: string): boolean {
  return /otp_expired|invalid|expired|token/i.test(message);
}

function isRateLimitError(message: string): boolean {
  return /rate|security|after \d+\s*seconds?/i.test(message);
}

function normalizeOtpCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

function resolveLoginError(message: string, copy: (typeof loginCopy)["ru"] | (typeof loginCopy)["en"]): string {
  if (isInvalidOtpError(message)) return copy.invalidCode;
  if (isRateLimitError(message)) return copy.rateLimited;
  return copy.genericError;
}
