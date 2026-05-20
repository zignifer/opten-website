// Phase v2.0 MODELS-A-5b: inline soft CTA injected between sections of a
// model page. Two variants:
//   - "after-features": "Opten распознаёт <модель> прямо в <платформа>..."
//   - "after-mistakes": "Не хочешь держать эти правила в голове?..."
// Body copy is parametrized with {modelName} and {platform}, taken from
// ModelMeta; the i18n strings use {name}/{platform} placeholders.

import { useT, useLang } from "../../i18n/LangContext";
import type { ModelMeta } from "../../content/models/types";
import { metaField } from "../../content/models/metaEn";

const STORE_URL = "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";

type Variant = "after-features" | "after-mistakes";

interface Props {
  variant: Variant;
  meta: ModelMeta;
}

function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

function platformName(meta: ModelMeta, lang: "ru" | "en"): string {
  // Take everything before " by " or before " (" to get a clean platform label,
  // e.g. "Kling AI (klingai.com) by Kuaishou" → "Kling AI"
  const stripped = (metaField(meta, "platform", lang) ?? "").split(/\s+by\s+|\s+\(/)[0];
  return stripped.trim();
}

export default function InlineOptenCallout({ variant, meta }: Props) {
  const t = useT();
  const { lang } = useLang();
  const bodyKey = variant === "after-features"
    ? "models.callout.afterFeatures"
    : "models.callout.afterMistakes";
  const body = interpolate(t(bodyKey), {
    name: metaField(meta, "name", lang) ?? meta.name,
    platform: platformName(meta, lang),
  });

  return (
    <aside
      className="my-[28px] rounded-[12px] border border-[rgba(156,251,81,0.2)] bg-[rgba(156,251,81,0.06)] p-[20px] md:p-[24px]"
      role="complementary"
    >
      <p className="mb-[14px] text-[15px] leading-[1.55] text-white/85 md:text-[16px]">
        {body}
      </p>
      <a
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-[8px] rounded-full bg-[#9cfb51] px-[18px] py-[10px] text-[14px] font-bold text-[#011417] no-underline transition hover:bg-white"
      >
        {t("models.callout.cta")} →
      </a>
    </aside>
  );
}
