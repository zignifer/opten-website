// Phase v2.0 MODELS-A-5a: Quick-Facts table for model pages.
// Renders the parsed ModelMeta as a 2-column table. Null/empty cells hide
// the row entirely (no "—" placeholders). AI Overviews citation target —
// Google often quotes structured tables verbatim.

import { useT, useLang } from "../../i18n/LangContext";
import type { ModelMeta } from "../../content/models/types";
import { metaField } from "../../content/models/metaEn";

interface Props {
  meta: ModelMeta;
}

interface Row {
  label: string;
  value: string;
}

function formatPromptLength(meta: ModelMeta, t: (k: string) => string): string | null {
  if (!meta.promptLength) return null;
  const { min, max } = meta.promptLength;
  if (min === 0) return `≤ ${max} ${t("models.quickFacts.words")}`;
  return `${min}–${max} ${t("models.quickFacts.words")}`;
}

function formatBestLanguage(meta: ModelMeta, t: (k: string) => string): string {
  switch (meta.bestLanguage) {
    case "en":
      return t("models.quickFacts.langEnglish");
    case "ru":
      return t("models.quickFacts.langRussian");
    case "both":
      return t("models.quickFacts.langBoth");
  }
}

function formatType(meta: ModelMeta, t: (k: string) => string): string {
  return meta.type === "video" ? t("models.quickFacts.typeVideo") : t("models.quickFacts.typeImage");
}

function formatNegativePrompt(meta: ModelMeta, t: (k: string) => string): string | null {
  if (meta.negativePrompt === null) return null;
  return meta.negativePrompt ? t("common.yes") : t("common.no");
}

export default function ModelQuickFacts({ meta }: Props) {
  const t = useT();
  const { lang } = useLang();

  const rows: Row[] = [];
  rows.push({ label: t("models.quickFacts.type"), value: formatType(meta, t) });
  if (meta.vendor) {
    rows.push({ label: t("models.quickFacts.vendor"), value: meta.vendor });
  }
  const platform = metaField(meta, "platform", lang);
  if (platform) {
    rows.push({ label: t("models.quickFacts.platform"), value: platform });
  }
  const length = formatPromptLength(meta, t);
  if (length) {
    rows.push({ label: t("models.quickFacts.promptLength"), value: length });
  }
  const duration = metaField(meta, "duration", lang);
  if (duration) {
    rows.push({ label: t("models.quickFacts.duration"), value: duration });
  }
  const resolution = metaField(meta, "resolution", lang);
  if (resolution) {
    rows.push({ label: t("models.quickFacts.resolution"), value: resolution });
  }
  if (meta.features && meta.features.length > 0) {
    rows.push({ label: t("models.quickFacts.modes"), value: meta.features.join(", ") });
  }
  const neg = formatNegativePrompt(meta, t);
  if (neg) {
    rows.push({ label: t("models.quickFacts.negativePrompt"), value: neg });
  }
  rows.push({ label: t("models.quickFacts.bestLanguage"), value: formatBestLanguage(meta, t) });
  rows.push({
    label: t("models.quickFacts.optenSupport"),
    value: lang === "ru"
      ? "✓ Автоопределение, rewrite, score"
      : "✓ Auto-detect, rewrite, score",
  });

  return (
    <aside
      className="my-[32px] rounded-[12px] border border-white/10 bg-[#0e2023] p-[20px] md:p-[24px]"
      aria-label={t("models.quickFacts.heading")}
    >
      <h2 className="mb-[16px] font-['Unbounded',sans-serif] text-[18px] font-medium leading-[1.2] tracking-[-0.4px] text-white md:text-[20px]">
        {t("models.quickFacts.heading")}
      </h2>
      <dl className="grid gap-y-[10px] text-[14px] md:text-[15px]">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[140px_1fr] gap-x-[16px] sm:grid-cols-[180px_1fr]">
            <dt className="text-white/55">{row.label}</dt>
            <dd className="text-white/85">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
