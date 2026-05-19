// Phase v2.0 MODELS-A-5e: models hub page (/models + /en/models).
// Grid of all 62 models with Image/Video filter via ?type query param. SSR-safe
// — first render on server reflects the URL state (which matches first client
// render); no hydration drift.
//
// JSON-LD on this route (CollectionPage + ItemList) emitted by
// scripts/seo-routes.ts. Visible DOM mirrors the ItemList: each model card
// in DOM order = ItemListElement[N].url.

import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useLang, useT } from "../../i18n/LangContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import LocalizedLink from "../components/LocalizedLink";
import { allModels } from "../../content/models";

type FilterValue = "" | "image" | "video";

export default function ModelsHubPage() {
  const { lang } = useLang();
  const t = useT();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeFilter = (searchParams.get("type") ?? "") as FilterValue;

  const filteredModels = useMemo(() => {
    return allModels.filter((m) => {
      if (!typeFilter) return true;
      return m.meta.type === typeFilter;
    });
  }, [typeFilter]);

  const imageCount = useMemo(() => allModels.filter((m) => m.meta.type === "image").length, []);
  const videoCount = useMemo(() => allModels.filter((m) => m.meta.type === "video").length, []);

  function selectType(next: FilterValue) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("type", next);
    else params.delete("type");
    setSearchParams(params, { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SiteHeader variant="page" />

      <main className="mx-auto max-w-[1080px] px-[20px] pb-[60px] pt-[120px] sm:pt-[140px]">
        <nav
          aria-label="Breadcrumb"
          className="mb-[24px] flex flex-wrap items-center gap-x-[8px] gap-y-[4px] text-[13px] text-white/45"
        >
          <LocalizedLink to="/" className="no-underline text-inherit transition hover:text-white">
            {t("nav.home")}
          </LocalizedLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-white/75">{t("nav.models")}</span>
        </nav>

        <h1 className="font-['Unbounded',sans-serif] text-[32px] font-medium leading-[1.15] tracking-[-0.6px] text-white md:text-[44px]">
          {t("models.hub.heading")}
        </h1>

        <p className="model-intro mt-[20px] max-w-[760px] text-[17px] leading-[1.6] text-white/75 md:text-[18px]">
          {t("models.hub.intro")}
        </p>

        {/* Type filter chips */}
        <div role="tablist" aria-label={t("models.hub.filterLabel")} className="mt-[28px] flex flex-wrap gap-[10px]">
          <button
            type="button"
            role="tab"
            aria-selected={typeFilter === ""}
            onClick={() => selectType("")}
            className={`rounded-full px-[16px] py-[8px] text-[13px] font-bold transition ${
              typeFilter === ""
                ? "bg-white text-[#011417]"
                : "border border-white/15 bg-transparent text-white/75 hover:border-white/30"
            }`}
          >
            {t("models.hub.filterAll")} ({allModels.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={typeFilter === "image"}
            onClick={() => selectType("image")}
            className={`rounded-full px-[16px] py-[8px] text-[13px] font-bold transition ${
              typeFilter === "image"
                ? "bg-white text-[#011417]"
                : "border border-white/15 bg-transparent text-white/75 hover:border-white/30"
            }`}
          >
            {t("models.hub.filterImage")} ({imageCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={typeFilter === "video"}
            onClick={() => selectType("video")}
            className={`rounded-full px-[16px] py-[8px] text-[13px] font-bold transition ${
              typeFilter === "video"
                ? "bg-white text-[#011417]"
                : "border border-white/15 bg-transparent text-white/75 hover:border-white/30"
            }`}
          >
            {t("models.hub.filterVideo")} ({videoCount})
          </button>
        </div>

        {/* Grid */}
        <div className="mt-[32px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((m) => {
            const typeLabel = m.meta.type === "video"
              ? t("models.quickFacts.typeVideo")
              : t("models.quickFacts.typeImage");
            const platformLabel = m.meta.platform.split(/\s+by\s+|\s+\(/)[0].trim();
            const description = m.content
              ? m.content[lang].intro
              : `${platformLabel} · ${m.meta.vendor}`;
            return (
              <LocalizedLink
                key={m.slug}
                to={`/models/${m.slug}`}
                className="group flex h-full flex-col gap-[10px] rounded-[12px] border border-white/10 bg-[#0e2023] p-[18px] no-underline transition hover:border-white/25"
              >
                <span className={`inline-flex w-fit items-center rounded-full px-[8px] py-[2px] text-[10px] font-bold uppercase tracking-[1px] ${
                  m.meta.type === "video"
                    ? "bg-[rgba(89,180,255,0.15)] text-[#59b4ff]"
                    : "bg-[rgba(156,251,81,0.15)] text-[#9cfb51]"
                }`}>
                  {typeLabel}
                </span>
                <h2 className="text-[17px] font-medium leading-[1.3] tracking-[-0.3px] text-white transition group-hover:text-[#9cfb51]">
                  {m.meta.name}
                </h2>
                <p className="text-[13px] leading-[1.5] text-white/55 line-clamp-3">
                  {description.length > 140 ? description.slice(0, 137).trimEnd() + "…" : description}
                </p>
              </LocalizedLink>
            );
          })}
        </div>

        {filteredModels.length === 0 && (
          <p className="mt-[40px] text-center text-[15px] text-white/55">
            {t("models.hub.empty")}
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
