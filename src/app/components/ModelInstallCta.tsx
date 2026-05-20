// Phase v2.0 MODELS-A-5c: final CTA block at the end of every model page.
// "Готов писать промпты для <модели> в один клик?" + 3 bullets + pricing line
// + Chrome Web Store install button. Reuses the existing <InstallButton>
// for consistency with the landing page.

import { useT, useLang } from "../../i18n/LangContext";
import InstallButton from "./InstallButton";
import type { ModelMeta } from "../../content/models/types";
import { metaField } from "../../content/models/metaEn";

interface Props {
  meta: ModelMeta;
}

function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

export default function ModelInstallCta({ meta }: Props) {
  const t = useT();
  const { lang } = useLang();
  const heading = interpolate(t("models.installCta.heading"), {
    name: metaField(meta, "name", lang) ?? meta.name,
  });

  return (
    <section
      aria-labelledby="model-install-cta"
      className="mx-auto my-[60px] max-w-[800px] rounded-[16px] border border-white/10 bg-gradient-to-b from-[rgba(156,251,81,0.08)] to-[rgba(156,251,81,0.02)] px-[24px] py-[32px] md:px-[40px] md:py-[40px]"
    >
      <h2
        id="model-install-cta"
        className="mb-[20px] font-['Unbounded',sans-serif] text-[24px] font-medium leading-[1.2] tracking-[-0.4px] text-white md:text-[30px]"
      >
        {heading}
      </h2>
      <ul className="mb-[28px] flex flex-col gap-[10px] text-[15px] leading-[1.5] text-white/80 md:text-[16px]">
        <li className="flex items-start gap-[10px]">
          <span aria-hidden="true" className="mt-[6px] inline-block size-[8px] flex-none rounded-full bg-[#9cfb51]" />
          <span>{t("models.installCta.bullet1")}</span>
        </li>
        <li className="flex items-start gap-[10px]">
          <span aria-hidden="true" className="mt-[6px] inline-block size-[8px] flex-none rounded-full bg-[#9cfb51]" />
          <span>{t("models.installCta.bullet2")}</span>
        </li>
        <li className="flex items-start gap-[10px]">
          <span aria-hidden="true" className="mt-[6px] inline-block size-[8px] flex-none rounded-full bg-[#9cfb51]" />
          <span>{t("models.installCta.bullet3")}</span>
        </li>
      </ul>
      <div className="flex flex-col items-start gap-[14px] sm:flex-row sm:items-center sm:gap-[20px]">
        <InstallButton />
        <p className="text-[13px] leading-[1.4] text-white/55 md:text-[14px]">
          {t("models.installCta.pricing")}
        </p>
      </div>
    </section>
  );
}
