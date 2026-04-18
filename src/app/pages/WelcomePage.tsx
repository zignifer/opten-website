import { useState, useEffect } from "react";
import { useT, useLang } from "../../i18n/LangContext";

const steps = [
  { num: "1", titleKey: "welcome.step1.title", descKey: "welcome.step1.desc" },
  { num: "2", titleKey: "welcome.step2.title", descKey: "welcome.step2.desc" },
  { num: "3", titleKey: "welcome.step3.title", descKey: "welcome.step3.desc" },
  { num: "4", titleKey: "welcome.step4.title", descKey: "welcome.step4.desc" },
];

const slides: Record<string, string[]> = {
  ru: ["/assets/welcome-ru.png", "/assets/welcome-ru-2.png", "/assets/welcome-ru-3.png"],
  en: ["/assets/welcome-en.png", "/assets/welcome-en-2.png", "/assets/welcome-en-3.png"],
};

export default function WelcomePage() {
  const t = useT();
  const { lang } = useLang();
  const [idx, setIdx] = useState(0);
  const images = slides[lang];

  useEffect(() => {
    setIdx(0);
  }, [lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-[20px] py-[48px] font-['PT_Root_UI',sans-serif]">
      {/* Blinking arrow pointing to extension area */}
      <img
        src="/assets/welcome-arrow.svg"
        alt=""
        className="absolute top-[6px] right-[89px] sm:right-[109px] w-[40px] sm:w-[50px] animate-[blink_1.5s_ease-in-out_infinite]"
        draggable={false}
      />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
      `}</style>

      <div className="w-full max-w-[520px] flex flex-col items-center gap-[32px]">
        {/* Auto-slider */}
        <div className="relative w-full overflow-hidden rounded-[12px]">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Opten extension"
              className="w-full block transition-opacity duration-700"
              style={{
                opacity: i === idx ? 1 : 0,
                position: i === 0 ? "relative" : "absolute",
                top: 0,
                left: 0,
              }}
              draggable={false}
            />
          ))}
        </div>

        {/* Steps */}
        <div className="w-full flex flex-col gap-[20px]">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-[16px] items-start">
              <span className="shrink-0 w-[32px] h-[32px] rounded-full bg-[#111] flex items-center justify-center text-white text-[14px] font-bold mt-[2px]">
                {step.num}
              </span>
              <div className="flex flex-col gap-[2px]">
                <p className="text-[#111] text-[16px] font-medium leading-[1.3]">
                  {t(step.titleKey)}
                </p>
                <p className="text-[#888] text-[14px] leading-[1.4] whitespace-nowrap">
                  {t(step.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
