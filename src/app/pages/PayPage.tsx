import { useState, useEffect } from "react";
import { Link } from "react-router";

const SUPABASE_FUNCTIONS_URL = "https://vuywydhwkqmihfztpkgl.supabase.co/functions/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTkxMjAsImV4cCI6MjA1OTQzNTEyMH0.bG0GfCEMbMBqPOMtkFDAiFjKQMqFVLHGe3bTG-hsaMA";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <path d="M15 4.5L6.75 12.75L3 9" stroke="#2777C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PayPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Read auth token from URL hash: /pay#token=JWT_HERE
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const t = params.get("token");
    if (t) {
      setToken(t);
      // Clean up URL
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handlePay = async () => {
    if (!token) {
      setError("Сессия не найдена. Перейдите к оплате из расширения Opten.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(SUPABASE_FUNCTIONS_URL + "/create-payment", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "apikey": SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Ошибка создания платежа. Попробуйте ещё раз.");
        setLoading(false);
        return;
      }

      if (data.confirmation_url) {
        window.location.href = data.confirmation_url;
      } else {
        setError("Не удалось получить ссылку на оплату.");
        setLoading(false);
      }
    } catch {
      setError("Ошибка сети. Проверьте подключение и попробуйте ещё раз.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-[20px] py-[60px] font-['PT_Root_UI',sans-serif]">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex justify-center mb-[48px]">
          <Link to="/" className="text-white text-[24px] font-bold no-underline hover:opacity-80 transition-opacity">
            Opten
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d0d] rounded-[16px] p-[32px] relative">
          <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[16px]" />

          <div className="relative z-10 flex flex-col gap-[32px]">
            {/* Header */}
            <div className="flex flex-col gap-[8px]">
              <h1 className="text-white text-[28px] font-medium leading-[1.1] tracking-[-0.56px]">
                Opten Pro
              </h1>
              <p className="text-[rgba(255,255,255,0.6)] text-[16px] leading-[1.6]">
                Подписка на расширенные возможности
              </p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-[6px]">
              <span className="text-white text-[48px] leading-[1.1] tracking-[-0.96px]">199₽</span>
              <span className="text-[rgba(255,255,255,0.6)] text-[16px] leading-[2]">/ мес</span>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[rgba(255,255,255,0.1)]" />

            {/* Features */}
            <div className="flex flex-col gap-[12px]">
              <div className="flex gap-[8px] items-center">
                <CheckIcon />
                <span className="text-white text-[16px] leading-[1.5]">300 проверок в месяц</span>
              </div>
              <div className="flex gap-[8px] items-center">
                <CheckIcon />
                <span className="text-white text-[16px] leading-[1.5]">Улучшение промптов в один клик</span>
              </div>
              <div className="flex gap-[8px] items-center">
                <CheckIcon />
                <span className="text-white text-[16px] leading-[1.5]">Приоритетная скорость анализа</span>
              </div>
              <div className="flex gap-[8px] items-center">
                <CheckIcon />
                <span className="text-white text-[16px] leading-[1.5]">Ранний доступ к новым моделям</span>
              </div>
              <div className="flex gap-[8px] items-center">
                <CheckIcon />
                <span className="text-white text-[16px] leading-[1.5]">Автоматическое продление</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[rgba(255,255,255,0.1)]" />

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-white text-black text-[18px] font-bold py-[16px] rounded-[100px] cursor-pointer border-none transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? "Переход к оплате..." : "Оплатить 199₽/мес"}
            </button>

            {/* Error */}
            {error && (
              <p className="text-[#d4183d] text-[14px] text-center leading-[1.5]">{error}</p>
            )}

            {/* No token warning */}
            {!token && (
              <p className="text-[rgba(255,255,255,0.4)] text-[14px] text-center leading-[1.5]">
                Для оплаты перейдите на эту страницу из расширения Opten.
                <br />
                <Link to="/" className="text-[#2777C3] underline">Установить расширение</Link>
              </p>
            )}

            {/* Legal */}
            <p className="text-[rgba(255,255,255,0.3)] text-[12px] text-center leading-[1.5]">
              Нажимая кнопку, вы принимаете{" "}
              <Link to="/terms" className="text-[rgba(255,255,255,0.5)] underline">условия оферты</Link>
              {" "}и{" "}
              <Link to="/privacy" className="text-[rgba(255,255,255,0.5)] underline">политику конфиденциальности</Link>.
              <br />
              Подписка продлевается автоматически. Отменить можно в любой момент.
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-[8px] mt-[24px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 5.33H4C3.26 5.33 2.67 5.93 2.67 6.67V12.67C2.67 13.4 3.26 14 4 14H12C12.74 14 13.33 13.4 13.33 12.67V6.67C13.33 5.93 12.74 5.33 12 5.33ZM8 10.67C7.26 10.67 6.67 10.07 6.67 9.33C6.67 8.6 7.26 8 8 8C8.74 8 9.33 8.6 9.33 9.33C9.33 10.07 8.74 10.67 8 10.67ZM10.67 5.33V4C10.67 2.53 9.47 1.33 8 1.33C6.53 1.33 5.33 2.53 5.33 4V5.33H10.67Z" fill="rgba(255,255,255,0.3)" />
          </svg>
          <span className="text-[rgba(255,255,255,0.3)] text-[13px] font-['PT_Root_UI',sans-serif]">
            Безопасная оплата через ЮKassa
          </span>
        </div>
      </div>
    </div>
  );
}
