import { Link } from "react-router";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-[20px] py-[60px] font-['PT_Root_UI',sans-serif]">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-[32px]">
        {/* Logo */}
        <Link to="/" className="text-white text-[24px] font-bold no-underline hover:opacity-80 transition-opacity">
          Opten
        </Link>

        {/* Success icon */}
        <div className="w-[80px] h-[80px] rounded-full bg-[#1E8E3E] flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M30 13L16.5 26.5L10 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-[12px] items-center text-center">
          <h1 className="text-white text-[32px] font-medium leading-[1.1] tracking-[-0.64px]">
            Оплата прошла успешно!
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-[18px] leading-[1.6]">
            Подписка Opten Pro активирована. Теперь у вас 300 проверок в месяц и улучшение промптов в один клик.
          </p>
        </div>

        {/* What to do next */}
        <div className="bg-[#0d0d0d] rounded-[16px] p-[24px] w-full relative">
          <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] inset-0 pointer-events-none rounded-[16px]" />
          <div className="relative z-10 flex flex-col gap-[16px]">
            <p className="text-white text-[16px] font-medium">Что дальше?</p>
            <div className="flex flex-col gap-[12px]">
              <div className="flex gap-[12px] items-start">
                <span className="text-[#2777C3] text-[14px] font-medium shrink-0 mt-[2px]">1.</span>
                <p className="text-[rgba(255,255,255,0.6)] text-[14px] leading-[1.5]">
                  Вернитесь в генератор изображений, где установлен Opten
                </p>
              </div>
              <div className="flex gap-[12px] items-start">
                <span className="text-[#2777C3] text-[14px] font-medium shrink-0 mt-[2px]">2.</span>
                <p className="text-[rgba(255,255,255,0.6)] text-[14px] leading-[1.5]">
                  Pro-статус обновится автоматически в течение минуты
                </p>
              </div>
              <div className="flex gap-[12px] items-start">
                <span className="text-[#2777C3] text-[14px] font-medium shrink-0 mt-[2px]">3.</span>
                <p className="text-[rgba(255,255,255,0.6)] text-[14px] leading-[1.5]">
                  Если статус не обновился — откройте popup расширения и проверьте
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to site */}
        <Link
          to="/"
          className="text-[#2777C3] text-[16px] no-underline hover:underline transition-all"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
