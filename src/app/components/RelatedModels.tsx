// Phase v2.0 MODELS-A-5d: 3-card grid of related models at the bottom of a
// model page. Algorithm: same type (image|video), exclude current slug,
// reverse-alphabetical (stable, no random), take 3. From content/models
// helper getRelatedModels.

import { useT, useLang } from "../../i18n/LangContext";
import LocalizedLink from "./LocalizedLink";
import { getRelatedModels } from "@/content/models";
import { metaField } from "../../content/models/metaEn";
import type { ModelMeta } from "../../content/models/types";

interface Props {
  currentSlug: string;
  type: ModelMeta["type"];
}

export default function RelatedModels({ currentSlug, type }: Props) {
  const t = useT();
  const { lang } = useLang();
  const related = getRelatedModels(currentSlug, type, 3);

  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-[800px] px-[20px] pb-[60px]">
      <h2 className="mb-[20px] font-['Unbounded','Unbounded_Fallback',sans-serif] text-[22px] font-medium leading-[1.2] tracking-[-0.4px] text-white md:text-[28px]">
        {t("models.related.heading")}
      </h2>
      <div className="grid gap-[16px] sm:grid-cols-2 md:grid-cols-3">
        {related.map((m) => {
          const typeLabel = m.meta.type === "video"
            ? t("models.quickFacts.typeVideo")
            : t("models.quickFacts.typeImage");
          const platformLabel = (metaField(m.meta, "platform", lang) ?? "").split(/\s+by\s+|\s+\(/)[0].trim();
          const description = m.content
            ? m.content[lang].intro
            : `${typeLabel} · ${platformLabel}`;
          return (
            <LocalizedLink
              key={m.slug}
              to={`/models/${m.slug}`}
              className="group flex h-full flex-col gap-[10px] rounded-[12px] border border-white/10 bg-[#0e2023] p-[18px] no-underline transition hover:border-white/25"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-[rgba(156,251,81,0.15)] px-[8px] py-[2px] text-[10px] font-bold uppercase tracking-[1px] text-[#9cfb51]">
                {typeLabel}
              </span>
              <h3 className="text-[17px] font-medium leading-[1.3] tracking-[-0.3px] text-white transition group-hover:text-[#9cfb51]">
                {metaField(m.meta, "name", lang)}
              </h3>
              <p className="text-[13px] leading-[1.5] text-white/55 line-clamp-3">
                {description.length > 140 ? description.slice(0, 137).trimEnd() + "…" : description}
              </p>
            </LocalizedLink>
          );
        })}
      </div>
    </section>
  );
}
