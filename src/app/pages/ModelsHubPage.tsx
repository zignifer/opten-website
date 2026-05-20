// Phase v2.0 MODELS-A-5e: models hub page (/models + /en/models).
// Grid of all 62 models with Image/Video filter (?type) + name search (?q).
// SSR-safe: on SSR `type`/`q` reflect the URL (empty by default) so prerendered
// HTML lists ALL models — hydration matches, then the client takes over with
// filter/search interactions. Filter row layout mirrors BlogListPage.
//
// JSON-LD on this route (CollectionPage + ItemList) emitted by
// scripts/seo-routes.ts. Visible DOM mirrors the ItemList: each model card
// in DOM order = ItemListElement[N].url (full, unfiltered list on SSR).

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useLang, useT } from "../../i18n/LangContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import LocalizedLink from "../components/LocalizedLink";
import { allModels } from "../../content/models";
import { metaField } from "../../content/models/metaEn";

type FilterValue = "" | "image" | "video";

const SEARCH_DEBOUNCE_MS = 250;

export default function ModelsHubPage() {
  const { lang } = useLang();
  const t = useT();
  const [searchParams, setSearchParams] = useSearchParams();

  // Until hydrated, mirror the SSR render (prerendered with no query params →
  // unfiltered, empty search) so a direct-load / refresh of a filtered URL
  // (?type=, ?q=) doesn't throw a hydration mismatch — the prerender always
  // emits the full, unfiltered list. After mount we flip to the real URL state.
  const [hydrated, setHydrated] = useState(false);
  const typeFilter = (hydrated ? searchParams.get("type") ?? "" : "") as FilterValue;
  const queryParam = hydrated ? searchParams.get("q") ?? "" : "";

  // Controlled search input. Starts empty to match SSR; synced from the URL after mount.
  const [queryInput, setQueryInput] = useState("");
  useEffect(() => {
    setHydrated(true);
    setQueryInput(searchParams.get("q") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search input → URL. Functional updater reads CURRENT params when the
  // timeout fires, so a type-filter change between keystroke and debounce is kept
  // (same pattern as BlogListPage, codex review P2).
  useEffect(() => {
    if (queryInput === queryParam) return;
    const handle = window.setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (queryInput.trim()) next.set("q", queryInput.trim());
          else next.delete("q");
          return next;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

  const imageCount = useMemo(() => allModels.filter((m) => m.meta.type === "image").length, []);
  const videoCount = useMemo(() => allModels.filter((m) => m.meta.type === "video").length, []);

  const filteredModels = useMemo(() => {
    const q = queryParam.toLowerCase().trim();
    return allModels.filter((m) => {
      if (typeFilter && m.meta.type !== typeFilter) return false;
      if (!q) return true;
      const name = (metaField(m.meta, "name", lang) ?? "").toLowerCase();
      const vendor = (m.meta.vendor ?? "").toLowerCase();
      const intro = m.content ? m.content[lang].intro.toLowerCase() : "";
      return `${name} ${vendor} ${intro}`.includes(q);
    });
  }, [typeFilter, queryParam, lang]);

  function selectType(next: FilterValue) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("type", next);
    else params.delete("type");
    setSearchParams(params, { replace: true });
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams(), { replace: true });
    setQueryInput("");
  }

  const filters: { value: FilterValue; label: string; count: number }[] = [
    { value: "", label: t("models.hub.filterAll"), count: allModels.length },
    { value: "image", label: t("models.hub.filterImage"), count: imageCount },
    { value: "video", label: t("models.hub.filterVideo"), count: videoCount },
  ];

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

        {/* Filter controls — mirrors BlogListPage. Mobile (< sm): native <select>
            stacked above a full-width search input. Desktop (≥ sm): chip row on
            the left, fixed-width search on the right. */}
        <div className="mt-[14px] flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
          {/* Mobile dropdown — hidden ≥ sm */}
          <label className="relative block w-full sm:hidden">
            <span className="sr-only">{t("models.hub.filterLabel")}</span>
            <select
              value={typeFilter}
              onChange={(e) => selectType((e.target.value || "") as FilterValue)}
              className="h-[40px] w-full appearance-none rounded-full border border-white/10 bg-white/5 px-[18px] pr-[40px] text-[14px] text-white transition focus:border-white/30 focus:bg-white/8 focus:outline-none"
            >
              {filters.map((f) => (
                <option key={f.value} value={f.value} className="bg-[#0e2023] text-white">
                  {f.label} ({f.count})
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="pointer-events-none absolute right-[16px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-white/55"
              fill="none"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>

          {/* Desktop chip row — hidden < sm */}
          <div
            className="hidden flex-wrap items-center gap-[8px] sm:flex"
            role="group"
            aria-label={t("models.hub.filterLabel")}
          >
            {filters.map((f) => {
              const active = typeFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => selectType(f.value)}
                  aria-pressed={active}
                  className={`rounded-full border px-[14px] py-[7px] text-[13px] font-medium transition ${
                    active
                      ? "border-transparent bg-[#9cfb51] text-[#011417]"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              );
            })}
          </div>

          {/* Search — full width on mobile, fixed 300px on ≥ sm */}
          <label className="relative block w-full sm:w-[300px] sm:shrink-0">
            <span className="sr-only">{t("models.hub.searchPlaceholder")}</span>
            <input
              type="search"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={t("models.hub.searchPlaceholder")}
              className="h-[40px] w-full rounded-full border border-white/10 bg-white/5 px-[18px] text-[14px] text-white placeholder:text-white/35 transition focus:border-white/30 focus:bg-white/8 focus:outline-none"
            />
          </label>
        </div>

        {filteredModels.length === 0 ? (
          <div className="mt-[64px] flex flex-col items-center justify-center gap-[12px] rounded-[16px] border border-white/10 bg-white/5 px-[20px] py-[48px] text-center">
            <p className="text-[18px] font-medium text-white">{t("models.hub.emptyTitle")}</p>
            <p className="max-w-[420px] text-[14px] text-white/55">{t("models.hub.emptyBody")}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-[12px] rounded-full bg-white px-[20px] py-[10px] text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5"
            >
              {t("models.hub.emptyClear")}
            </button>
          </div>
        ) : (
          <div className="mt-[32px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((m) => {
              const typeLabel = m.meta.type === "video"
                ? t("models.quickFacts.typeVideo")
                : t("models.quickFacts.typeImage");
              const platformLabel = (metaField(m.meta, "platform", lang) ?? "").split(/\s+by\s+|\s+\(/)[0].trim();
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
                    {metaField(m.meta, "name", lang)}
                  </h2>
                  <p className="text-[13px] leading-[1.5] text-white/55 line-clamp-3">
                    {description.length > 140 ? description.slice(0, 137).trimEnd() + "…" : description}
                  </p>
                </LocalizedLink>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
