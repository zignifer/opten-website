// Phase 5 follow-up: extracted from App.tsx so SiteFooter (used on blog pages too) can
// render the install CTA without depending on App.tsx internals.

import { useT } from "../../i18n/LangContext";

const STORE_URL = "https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BrowserIcons({ size = "lg" }: { size?: "sm" | "lg" }) {
  const iconSize = size === "lg" ? "size-[40px]" : "size-[28px]";
  const srcSuffix = size === "lg" ? "lg" : "sm";
  const px = size === "lg" ? 40 : 28;
  return (
    <span className="flex items-center">
      <img alt="Chrome" src={`/assets/landing-design/chrome-${srcSuffix}.svg`} width={px} height={px} loading="eager" className={cx(iconSize, "relative z-10")} />
      <img alt="Yandex Browser" src={`/assets/landing-design/yandex-${srcSuffix}.svg`} width={px} height={px} loading="eager" className={cx(iconSize, "-ml-[8px]")} />
    </span>
  );
}

interface InstallButtonProps {
  compact?: boolean;
  label?: string;
}

export default function InstallButton({ compact = false, label }: InstallButtonProps): JSX.Element {
  const t = useT();
  return (
    <a
      href={STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "group inline-flex items-center justify-center rounded-full bg-white text-[#011417] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(156,251,81,0.18)]",
        compact ? "gap-2 px-3 py-2 text-[13px] font-bold" : "w-auto max-w-[calc(100vw-40px)] gap-2 px-[14px] py-[10px] sm:max-w-none sm:gap-3 sm:pl-[10px] sm:pr-6"
      )}
    >
      <BrowserIcons size={compact ? "sm" : "lg"} />
      <span className={cx("min-w-0 font-['PT_Root_UI',sans-serif] leading-[1.25]", compact && "whitespace-nowrap")}>
        {compact ? (
          label ?? t("hero.installBtn")
        ) : (
          <span className="flex flex-col text-left">
            <span className="whitespace-nowrap text-[13px] font-normal sm:text-[14px]">{t("hero.installBtnSub")}</span>
            <span className="whitespace-nowrap text-[17px] font-bold sm:text-[18px]">{label ?? t("hero.installBtn")}</span>
          </span>
        )}
      </span>
    </a>
  );
}
