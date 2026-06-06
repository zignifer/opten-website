import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import SpaceHeader from "../../components/space/SpaceHeader";
import { useSpaceAuth } from "../../components/space/SpaceAuthProvider";
import {
  getWebsiteAuthCallbackUrl,
  normalizeSafeNext,
  sendEmailOtp,
  startGoogleLogin,
  verifyEmailOtp,
} from "../../../lib/optenAuth";
import { useLang } from "../../../i18n/LangContext";

const SPACE_LOGO_SRC = "/assets/space/figma/header-atoms/logo-lockup.svg";

export default function AppLoginPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, refresh } = useSpaceAuth();
  const copy = loginCopy[lang];
  const rawNext = new URLSearchParams(location.search).get("next");
  const safeNext = normalizeSafeNext(rawNext, "/account");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "verifying" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const codeDigits = Array.from({ length: 6 }, (_, index) => code[index] || "");

  if (status === "signed_in") return <Navigate to={safeNext} replace />;

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = email.trim();
    if (!normalized || formState === "sending") return;

    setFormState("sending");
    setError(null);
    try {
      await sendEmailOtp(normalized, getWebsiteAuthCallbackUrl(safeNext));
      setFormState("sent");
      window.requestAnimationFrame(() => codeInputRefs.current[0]?.focus());
    } catch (err) {
      setFormState("error");
      const message = err instanceof Error ? err.message : "email_otp_failed";
      setError(resolveLoginError(message, copy));
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (formState === "sent" || formState === "verifying") {
      setCode("");
      setFormState("idle");
      setError(null);
    }
  }

  function handleChangeEmail() {
    setCode("");
    setFormState("idle");
    setError(null);
    window.requestAnimationFrame(() => document.getElementById("opten-space-email")?.focus());
  }

  function setCodeDigit(index: number, value: string) {
    const normalized = normalizeOtpCode(value);
    const nextDigits = codeDigits.slice();

    if (normalized.length > 1) {
      for (let i = 0; i < 6; i += 1) {
        nextDigits[i] = normalized[i] || "";
      }
      setCode(nextDigits.join(""));
      codeInputRefs.current[Math.min(normalized.length, 6) - 1]?.focus();
      return;
    }

    nextDigits[index] = normalized;
    setCode(nextDigits.join(""));
    if (normalized && index < 5) codeInputRefs.current[index + 1]?.focus();
  }

  function handleCodeKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      event.preventDefault();
      const nextDigits = codeDigits.slice();
      nextDigits[index - 1] = "";
      setCode(nextDigits.join(""));
      codeInputRefs.current[index - 1]?.focus();
    }
  }

  function handleCodePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = normalizeOtpCode(event.clipboardData.getData("text"));
    if (!pasted) return;
    event.preventDefault();
    const digits = Array.from({ length: 6 }, (_, index) => pasted[index] || "");
    setCode(digits.join(""));
    codeInputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
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
      navigate(safeNext, { replace: true });
    } catch (err) {
      setFormState("sent");
      const message = err instanceof Error ? err.message : "otp_verify_failed";
      setError(resolveLoginError(message, copy));
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020607] text-white">
      <SpaceHeader variant="learnOnly" />
      <main
        className="relative h-[calc(100svh-65px)] min-h-[560px] overflow-hidden bg-[#020607] text-white"
        style={{ fontFamily: "'PT Root UI', sans-serif" }}
      >
        <LoginBackground />

        <section className="absolute inset-0 z-10 overflow-hidden" aria-labelledby="opten-space-login-title">
          <div
            className="absolute left-1/2 top-1/2 h-[940px] w-[1672px] max-w-none"
            style={{ transform: "translate(calc(-50% - 4px), -50%)" }}
          >
            <div className="absolute left-[651px] top-[220px] z-[2] h-[500px] w-[358px] origin-center scale-[1.3] max-[520px]:scale-100">
              <LoginCardFrame />
              <div className="absolute left-[44px] top-[20px] z-10 flex w-[270px] flex-col items-center text-center">
          <img
            src={SPACE_LOGO_SRC}
            alt="Opten Space Beta"
            width="158"
            height="23"
            className="block h-[23px] w-[158px] shrink-0"
          />

          <div className="mt-[26px] flex w-full flex-col items-center gap-[10px]">
            <h1 id="opten-space-login-title" className="m-0 font-['Unbounded',sans-serif] text-[21px] font-medium leading-[1.12] tracking-[0] text-white">
              <span>{copy.titleLine1}</span>
              <br />
              <span>
                {copy.titleLine2Prefix}
                <span className="text-[#9cfb51]">{copy.titleHighlight}</span>
              </span>
            </h1>
            <p className="m-0 w-[300px] text-[12px] font-normal leading-[1.3] tracking-[0] text-white/70">{copy.description}</p>
          </div>

          {formState === "sent" || formState === "verifying" ? (
            <form onSubmit={handleCodeSubmit} className="mt-[22px] flex w-full flex-col items-center gap-[12px]">
              <label className="flex w-full flex-col gap-[8px]">
                <span className="flex w-full items-center justify-between text-left text-[12px] font-normal leading-[1.3] text-white/60">
                  <span>{copy.codeLabel}</span>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="cursor-pointer text-[12px] font-normal leading-[1.3] text-[#9cfb51]/75 outline-none transition hover:text-[#9cfb51] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cfb51]/50"
                  >
                    {copy.changeEmail}
                  </button>
                </span>
                <span className="flex h-[44px] w-full gap-[8px]">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => {
                        codeInputRefs.current[index] = node;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      aria-label={`${copy.codeDigitLabel} ${index + 1}`}
                      value={digit}
                      onChange={(event) => setCodeDigit(index, event.target.value)}
                      onKeyDown={(event) => handleCodeKeyDown(index, event)}
                      onPaste={handleCodePaste}
                      className="h-[44px] min-w-0 flex-1 rounded-[8px] border border-white/[0.27] bg-transparent p-0 text-center text-[15px] font-medium leading-[1.3] text-white outline-none transition focus:border-[#9cfb51]/80"
                    />
                  ))}
                </span>
              </label>

              <button
                type="submit"
                disabled={formState === "verifying" || normalizeOtpCode(code).length !== 6}
                className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border-0 bg-[#9cfb51] px-[24px] py-[12px] text-[13px] font-medium leading-[1.3] text-[#011417] outline-none transition hover:bg-[#8ff144] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formState === "verifying" ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
                {copy.codeButton}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="mt-[22px] flex w-full flex-col items-center gap-[12px]">
              <label className="flex w-full flex-col gap-[8px] text-left">
                <span className="text-[12px] font-normal leading-[1.3] text-white/60">{copy.emailLabel}</span>
                <input
                  id="opten-space-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  value={email}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="h-[44px] w-full rounded-[8px] border border-white/[0.27] bg-transparent px-[16px] text-[12px] font-normal leading-[1.3] text-white outline-none transition placeholder:text-white/20 focus:border-[#9cfb51]/80"
                />
              </label>

              <button
                type="submit"
                disabled={formState === "sending"}
                className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border-0 bg-[#9cfb51] px-[24px] py-[12px] text-[13px] font-medium leading-[1.3] text-[#011417] outline-none transition hover:bg-[#8ff144] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formState === "sending" ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
                {formState === "sending" ? copy.sending : copy.emailButton}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => startGoogleLogin(getWebsiteAuthCallbackUrl(safeNext))}
            className="relative mt-[12px] flex h-[44px] w-full cursor-pointer items-center justify-center gap-[12px] rounded-[8px] border-0 bg-white px-[24px] py-[11px] text-[13px] font-medium leading-[1.3] text-black outline-none transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          >
            <span className="pointer-events-none absolute inset-0 rounded-[8px] border border-black/10" aria-hidden="true" />
            <GoogleIcon />
            <span className="whitespace-nowrap">{copy.google}</span>
          </button>

          {error && <p className="mt-[12px] max-w-full truncate text-[12px] leading-[1.3] text-[#dc2626]">{copy.error}: {error}</p>}
          <LoginTrustBadges copy={copy} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function LoginBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#020607]">
      <div
        className="absolute left-1/2 top-1/2 h-[940px] w-[1672px] max-w-none"
        style={{ transform: "translate(calc(-50% - 4px), -50%)" }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1672 940"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="loginGreenCloud" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(785 602) rotate(8) scale(560 270)">
              <stop stopColor="#9CFB51" stopOpacity="0.08" />
              <stop offset="0.5" stopColor="#9CFB51" stopOpacity="0.03" />
              <stop offset="1" stopColor="#9CFB51" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="loginRightCloud" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1090 420) rotate(-14) scale(520 300)">
              <stop stopColor="#9CFB51" stopOpacity="0.045" />
              <stop offset="0.58" stopColor="#9CFB51" stopOpacity="0.016" />
              <stop offset="1" stopColor="#9CFB51" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="loginOrbitStroke" x1="176" y1="642" x2="1478" y2="210" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9CFB51" stopOpacity="0.04" />
              <stop offset="0.18" stopColor="#9CFB51" stopOpacity="0.26" />
              <stop offset="0.48" stopColor="#9CFB51" stopOpacity="0.17" />
              <stop offset="0.74" stopColor="#D7FF4E" stopOpacity="0.24" />
              <stop offset="1" stopColor="#9CFB51" stopOpacity="0.06" />
            </linearGradient>
            <radialGradient id="loginPointGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(34)">
              <stop stopColor="#9CFB51" stopOpacity="0.42" />
              <stop offset="0.28" stopColor="#9CFB51" stopOpacity="0.22" />
              <stop offset="0.58" stopColor="#9CFB51" stopOpacity="0.09" />
              <stop offset="1" stopColor="#9CFB51" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1672" height="940" fill="#020607" />
          <rect width="1672" height="940" fill="url(#loginGreenCloud)" />
          <rect width="1672" height="940" fill="url(#loginRightCloud)" />

          <g transform="rotate(-16 835 486)" opacity="0.72">
            <ellipse cx="835" cy="486" rx="470" ry="154" stroke="url(#loginOrbitStroke)" strokeWidth="0.7" />
            <ellipse cx="835" cy="486" rx="575" ry="192" stroke="url(#loginOrbitStroke)" strokeWidth="0.75" />
            <ellipse cx="835" cy="486" rx="695" ry="232" stroke="url(#loginOrbitStroke)" strokeWidth="0.8" />
            <ellipse cx="835" cy="486" rx="850" ry="300" stroke="url(#loginOrbitStroke)" strokeWidth="0.75" />
          </g>

          <g transform="translate(324 537)">
            <circle r="34" fill="url(#loginPointGlow)" />
            <circle r="9" fill="#9CFB51" opacity="0.18" />
            <circle r="6.8" fill="#9CFB51" />
            <circle r="2.8" fill="#E9FFD5" />
          </g>
          <g transform="translate(1312 263)">
            <circle r="34" fill="url(#loginPointGlow)" />
            <circle r="9" fill="#9CFB51" opacity="0.18" />
            <circle r="6.8" fill="#9CFB51" />
            <circle r="2.8" fill="#E9FFD5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function LoginCardFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-[500px] w-[358px] overflow-hidden rounded-[8px] bg-[linear-gradient(180deg,rgba(7,26,27,0.74)_0%,rgba(2,13,15,0.92)_100%)] shadow-[0_22px_70px_rgba(0,0,0,0.42),0_0_38px_rgba(156,251,81,0.06)]"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.05),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(156,251,81,0.07),transparent_43%)]" />
      <span className="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(rgba(255,255,255,0.18)_0.45px,transparent_0.68px),radial-gradient(rgba(156,251,81,0.12)_0.42px,transparent_0.7px)] [background-position:0_0,7px_9px] [background-size:12px_12px,18px_18px] [mask-image:linear-gradient(180deg,transparent_0%,black_15%,black_84%,transparent_100%)]" />
      <span className="absolute inset-0 rounded-[8px] border border-white/[0.2]" />
      <span className="absolute inset-[1px] rounded-[7px] border border-[#9cfb51]/[0.06]" />
      <span className="absolute left-0 top-[35px] h-[350px] w-px bg-[linear-gradient(180deg,transparent_0%,rgba(156,251,81,0.62)_22%,rgba(156,251,81,0.3)_67%,transparent_100%)] shadow-[0_0_16px_rgba(156,251,81,0.5)]" />
      <span className="absolute right-0 top-[34px] h-[350px] w-px bg-[linear-gradient(180deg,transparent_0%,rgba(156,251,81,0.48)_18%,rgba(156,251,81,0.34)_68%,transparent_100%)] shadow-[0_0_18px_rgba(156,251,81,0.45)]" />
      <span className="absolute left-[10px] right-[10px] top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(232,255,224,0.34)_22%,rgba(255,255,255,0.36)_50%,rgba(156,251,81,0.2)_78%,transparent_100%)]" />
      <span className="absolute bottom-0 left-[10px] right-[10px] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(156,251,81,0.08)_18%,rgba(227,255,194,0.5)_51%,rgba(156,251,81,0.08)_82%,transparent_100%)]" />
      <span className="absolute bottom-0 left-[122px] h-px w-[114px] bg-[linear-gradient(90deg,transparent_0%,rgba(156,251,81,0.52)_24%,rgba(227,255,194,0.95)_50%,rgba(156,251,81,0.52)_76%,transparent_100%)] shadow-[0_0_8px_rgba(156,251,81,0.72),0_0_24px_rgba(156,251,81,0.3)]" />
      <span className="absolute bottom-[-28px] left-[70px] h-[66px] w-[218px] bg-[radial-gradient(ellipse_at_center,rgba(156,251,81,0.18)_0%,rgba(156,251,81,0.07)_35%,transparent_78%)]" />
    </div>
  );
}

const loginCopy = {
  ru: {
    titleLine1: "Добро пожаловать",
    titleLine2Prefix: "в аккаунт ",
    titleHighlight: "Opten",
    description: "Единый вход для подписки, кредитов, расширения и будущих курсов.",
    google: "Войти через Google",
    emailLabel: "Email",
    emailPlaceholder: "mail@gmail.com",
    emailButton: "Отправить код на Email",
    sending: "Отправляем...",
    sent: "Код отправлен",
    codeLabel: "Код из Email",
    codeDigitLabel: "Цифра кода",
    changeEmail: "Изменить email",
    codeButton: "Подтвердить",
    invalidCode: "Код неверный или устарел. Проверьте цифры из последнего письма.",
    rateLimited: "Слишком много попыток. Подождите минуту и попробуйте снова.",
    genericError: "Попробуйте ещё раз или войдите через Google.",
    error: "Не удалось выполнить вход",
    loginBadge1: "Безопасный вход",
    loginBadge2: "Безопасные платежи через ЮКасса",
    loginBadge3: "Opten никогда не хранит ваши промпты",
  },
  en: {
    titleLine1: "Welcome",
    titleLine2Prefix: "to your ",
    titleHighlight: "Opten account",
    description: "One account for subscription, credits, the extension, and future courses.",
    google: "Continue with Google",
    emailLabel: "Email",
    emailPlaceholder: "mail@gmail.com",
    emailButton: "Send code to Email",
    sending: "Sending...",
    sent: "Code sent",
    codeLabel: "Code from Email",
    codeDigitLabel: "Code digit",
    changeEmail: "Change email",
    codeButton: "Confirm",
    invalidCode: "The code is invalid or expired. Check the digits from the latest email.",
    rateLimited: "Too many attempts. Wait a minute and try again.",
    genericError: "Try again or continue with Google.",
    error: "Could not sign in",
    loginBadge1: "Log in securely",
    loginBadge2: "Secure payments with UKassa",
    loginBadge3: "Opten never stores your prompts",
  },
} as const;

type LoginCopy = (typeof loginCopy)["ru"] | (typeof loginCopy)["en"];

function LoginTrustBadges({ copy }: { copy: LoginCopy }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-[12px] flex items-center gap-[8px] text-[12px] font-normal leading-[1.3] text-white/60">
        <LoginBadgeIcon variant="lock" className="text-white/60" />
        <span className="whitespace-nowrap">{copy.loginBadge1}</span>
      </div>

      <div className="mt-[28px] flex flex-col items-center gap-[4px]">
        <div className="flex items-center gap-[8px] rounded-full bg-[#9cfb51]/[0.05] px-[8px] py-[4px] text-[12px] font-normal leading-[1.3] text-[#9cfb51]/60">
          <LoginBadgeIcon variant="shield" className="text-[#9cfb51]/60" />
          <span className="whitespace-nowrap">{copy.loginBadge2}</span>
        </div>
        <div className="flex items-center gap-[8px] rounded-full bg-[#9cfb51]/[0.05] px-[8px] py-[4px] text-[12px] font-normal leading-[1.3] text-[#9cfb51]/60">
          <LoginBadgeIcon variant="eyeOff" className="text-[#9cfb51]/60" />
          <span className="whitespace-nowrap">{copy.loginBadge3}</span>
        </div>
      </div>
    </div>
  );
}

function LoginBadgeIcon({ variant, className }: { variant: "lock" | "shield" | "eyeOff"; className: string }) {
  const iconClassName = `h-[14px] w-[14px] shrink-0 ${className}`;

  if (variant === "lock") {
    return (
      <svg className={iconClassName} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          clipRule="evenodd"
          d="M7 0.875C6.18777 0.875 5.40882 1.19766 4.83449 1.77199C4.26016 2.34632 3.9375 3.12527 3.9375 3.9375V6.125C3.5894 6.125 3.25556 6.26328 3.00942 6.50942C2.76328 6.75556 2.625 7.0894 2.625 7.4375V11.8125C2.625 12.1606 2.76328 12.4944 3.00942 12.7406C3.25556 12.9867 3.5894 13.125 3.9375 13.125H10.0625C10.4106 13.125 10.7444 12.9867 10.9906 12.7406C11.2367 12.4944 11.375 12.1606 11.375 11.8125V7.4375C11.375 7.0894 11.2367 6.75556 10.9906 6.50942C10.7444 6.26328 10.4106 6.125 10.0625 6.125V3.9375C10.0625 3.12527 9.73984 2.34632 9.16551 1.77199C8.59118 1.19766 7.81223 0.875 7 0.875ZM8.75 6.125V3.9375C8.75 3.47337 8.56563 3.02825 8.23744 2.70006C7.90925 2.37187 7.46413 2.1875 7 2.1875C6.53587 2.1875 6.09075 2.37187 5.76256 2.70006C5.43437 3.02825 5.25 3.47337 5.25 3.9375V6.125H8.75Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }

  if (variant === "shield") {
    return (
      <svg className={iconClassName} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          clipRule="evenodd"
          d="M7.4375 1.49538C7.31718 1.38776 7.16142 1.32826 7 1.32826C6.83858 1.32826 6.68282 1.38776 6.5625 1.49538C5.37988 2.55598 3.90305 3.23245 2.3275 3.43525C2.17281 3.45513 2.03026 3.52946 1.9254 3.6449C1.82054 3.76035 1.76022 3.90937 1.75525 4.06525C1.69608 5.79845 2.1287 7.513 3.0031 9.01063C3.87749 10.5083 5.15794 11.7278 6.69638 12.5283C6.79018 12.577 6.89438 12.6024 7.00011 12.6023C7.10584 12.6021 7.20996 12.5764 7.30363 12.5274C8.84206 11.7269 10.1225 10.5074 10.9969 9.00976C11.8713 7.51212 12.3039 5.79757 12.2448 4.06438C12.2396 3.90865 12.1792 3.75984 12.0743 3.64457C11.9695 3.52931 11.827 3.45511 11.6725 3.43525C10.097 3.2327 8.62023 2.55654 7.4375 1.49625V1.49538ZM9.485 6.31137C9.59091 6.17433 9.63835 6.00097 9.61697 5.82909C9.5956 5.65721 9.50714 5.50075 9.37088 5.39382C9.23462 5.28689 9.06162 5.23817 8.88958 5.25827C8.71755 5.27837 8.56044 5.36566 8.4525 5.50112L6.46975 8.02375L5.45825 7.1575C5.39337 7.09809 5.3172 7.05232 5.23428 7.02293C5.15136 6.99354 5.06337 6.98112 4.97555 6.98642C4.88774 6.99171 4.80188 7.01461 4.72309 7.05375C4.6443 7.09289 4.57418 7.14747 4.51691 7.21425C4.45964 7.28103 4.41637 7.35865 4.3897 7.44248C4.36302 7.52632 4.35347 7.61466 4.36162 7.70226C4.36977 7.78986 4.39545 7.87492 4.43713 7.9524C4.47881 8.02987 4.53564 8.09818 4.60425 8.15325L6.1355 9.46575C6.20272 9.5234 6.28091 9.56684 6.36537 9.59347C6.44982 9.6201 6.53879 9.62936 6.62692 9.62069C6.71505 9.61202 6.80051 9.58561 6.87816 9.54304C6.95581 9.50048 7.02405 9.44263 7.07875 9.373L9.485 6.31137Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg className={iconClassName} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        clipRule="evenodd"
        d="M2.87 1.9425C2.7456 1.82658 2.58106 1.76347 2.41104 1.76647C2.24103 1.76947 2.07882 1.83834 1.95858 1.95858C1.83834 2.07882 1.76947 2.24103 1.76647 2.41104C1.76347 2.58106 1.82658 2.7456 1.9425 2.87L11.13 12.0575C11.1901 12.122 11.2625 12.1737 11.343 12.2096C11.4235 12.2454 11.5104 12.2647 11.5985 12.2663C11.6867 12.2678 11.7742 12.2516 11.8559 12.2186C11.9376 12.1856 12.0118 12.1365 12.0742 12.0742C12.1365 12.0118 12.1856 11.9376 12.2186 11.8559C12.2516 11.7742 12.2678 11.6867 12.2663 11.5985C12.2647 11.5104 12.2454 11.4235 12.2096 11.343C12.1737 11.2625 12.122 11.1901 12.0575 11.13L10.9008 9.97238C11.7684 9.25578 12.4222 8.31436 12.7908 7.25112C12.8462 7.09039 12.8462 6.91573 12.7908 6.755C12.5053 5.92633 12.0454 5.16854 11.442 4.53278C10.8387 3.89703 10.106 3.3981 9.29339 3.06967C8.48078 2.74124 7.60718 2.59096 6.73153 2.62897C5.85589 2.66698 4.99859 2.8924 4.2175 3.29L2.87 1.9425ZM5.6665 4.73812L6.65963 5.73213C6.88229 5.67264 7.11669 5.67275 7.33929 5.73245C7.5619 5.79215 7.7649 5.90935 7.92791 6.07227C8.09093 6.2352 8.20823 6.43813 8.26805 6.66071C8.32788 6.88328 8.32812 7.11768 8.26875 7.34037L9.26275 8.3335C9.55906 7.8321 9.6802 7.24639 9.60711 6.66858C9.53402 6.09078 9.27084 5.55369 8.85901 5.14186C8.44719 4.73003 7.9101 4.46686 7.33229 4.39377C6.75449 4.32068 6.16878 4.44182 5.66738 4.73812H5.6665Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M6.8355 9.61975L8.4245 11.2088C6.94411 11.5624 5.38511 11.3524 4.05104 10.6197C2.71697 9.88698 1.70333 8.68401 1.2075 7.245C1.1523 7.08453 1.1523 6.91022 1.2075 6.74975C1.43027 6.10485 1.75944 5.50181 2.18137 4.96562L4.38025 7.1645C4.42033 7.80254 4.69188 8.40402 5.14393 8.85607C5.59598 9.30812 6.19746 9.57967 6.8355 9.61975Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-[22px] w-[22px] shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
      <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.1H2.18V16.94C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.03 14.71L5.84 14.09Z" fill="#FBBC05" />
      <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.84 9.91C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335" />
    </svg>
  );
}

function isInvalidOtpError(message: string): boolean {
  return /otp_expired|invalid|expired|token/i.test(message);
}

function isRateLimitError(message: string): boolean {
  return /rate|security|after \d+\s*seconds?/i.test(message);
}

function normalizeOtpCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

function resolveLoginError(message: string, copy: LoginCopy): string {
  if (isInvalidOtpError(message)) return copy.invalidCode;
  if (isRateLimitError(message)) return copy.rateLimited;
  return copy.genericError;
}
