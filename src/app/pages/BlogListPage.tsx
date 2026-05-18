// Phase 5 B-04: blog listing page (/blog + /en/blog).
// SSR-safe: useSearchParams() works under StaticRouter (no window reads during render).
// On SSR `q` is always "" so prerendered HTML lists ALL posts (page 1 of full inventory)
// — hydration matches, then client takes over with filter/search interactions.
//
// JSON-LD on this route (CollectionPage + ItemList) is emitted by prerender via the
// route entry in scripts/seo-routes.ts. The DOM here mirrors that JSON-LD: H1 + .blog-intro
// (speakable selectors) plus the post grid.

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useLang, useT } from "../../i18n/LangContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BlogPostCard from "../components/BlogPostCard";
import { allBlogPosts } from "../../content/blog";
import type { BlogTag } from "../../content/blog/types";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 250;

export default function BlogListPage() {
  const { lang } = useLang();
  const t = useT();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTag = (searchParams.get("tag") ?? "") as BlogTag | "";
  const pageParam = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const queryParam = searchParams.get("q") ?? "";

  // Controlled input value (debounced into searchParams). Initial value matches URL on mount.
  const [queryInput, setQueryInput] = useState(queryParam);

  // Debounce the search input → URL. Skip on first render when input matches URL state.
  // Functional updater (prev => …) reads the CURRENT URL state when the timeout fires —
  // critical, otherwise a tag/page change between keystroke and debounce would be stomped
  // by the stale snapshot we captured at effect setup (codex review P2).
  useEffect(() => {
    if (queryInput === queryParam) return;
    const handle = window.setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (queryInput.trim()) {
            next.set("q", queryInput.trim());
          } else {
            next.delete("q");
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

  // Build the localized post inventory once per lang change.
  const localizedPosts = useMemo(
    () => allBlogPosts.map(({ slug, post }) => ({ slug, ...post[lang] })),
    [lang],
  );

  // Tag chip vocabulary: only show chips for tags that actually appear in posts.
  const tagSet = useMemo(() => {
    const set = new Set<BlogTag>();
    localizedPosts.forEach((p) => p.tags.forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [localizedPosts]);

  // Filter + search → final list.
  const filteredPosts = useMemo(() => {
    const q = queryParam.toLowerCase().trim();
    return localizedPosts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [localizedPosts, activeTag, queryParam]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pagePosts = filteredPosts.slice(pageStart, pageStart + PAGE_SIZE);

  function selectTag(nextTag: BlogTag | "") {
    const next = new URLSearchParams(searchParams);
    if (nextTag) next.set("tag", nextTag);
    else next.delete("tag");
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams(), { replace: true });
    setQueryInput("");
  }

  function tagLabel(tag: BlogTag): string {
    const key = `blog.tag.${tagToKey(tag)}`;
    return t(key);
  }

  // Tag → i18n key shape (kebab-case → camelCase).
  function tagToKey(tag: BlogTag): string {
    switch (tag) {
      case "ai-image-gen":
        return "aiImageGen";
      case "ai-video-gen":
        return "aiVideoGen";
      case "prompt-engineering":
        return "promptEngineering";
      case "model-deep-dive":
        return "modelDeepDive";
      case "workflow":
        return "workflow";
      case "release-notes":
        return "releaseNotes";
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SiteHeader variant="page" />

      {/* Hero — centered title + intro, with the signature gradient blob behind */}
      <section className="relative px-[20px] pt-[120px] sm:pt-[160px]">
        <div aria-hidden="true" className="opten-figma-gradient" />
        <div className="relative z-10 mx-auto max-w-[800px] text-center">
          <h1 className="font-['Unbounded',sans-serif] text-[36px] font-bold leading-[1.1] tracking-[-0.6px] text-white sm:text-[44px] md:text-[52px]">
            {t("blog.heading")}
          </h1>
          <p className="blog-intro mx-auto mt-[20px] max-w-[680px] text-[17px] leading-[1.6] text-white/70 md:text-[18px]">
            {t("blog.intro")}
          </p>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-[1100px] px-[20px] pb-[80px] pt-[40px]">
        {/* Filter chips (left) + search (right) in a single row on wide screens, wraps on narrow */}
        <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-[8px]" role="group" aria-label={t("blog.filter.label")}>
            <button
              type="button"
              onClick={() => selectTag("")}
              className={`rounded-full border px-[14px] py-[7px] text-[13px] font-medium transition ${
                activeTag === ""
                  ? "border-transparent bg-[#9cfb51] text-[#011417]"
                  : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
              }`}
              aria-pressed={activeTag === ""}
            >
              {t("blog.filter.all")}
            </button>
            {tagSet.map((tag) => {
              const active = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => selectTag(tag)}
                  aria-pressed={active}
                  className={`rounded-full border px-[14px] py-[7px] text-[13px] font-medium transition ${
                    active
                      ? "border-transparent bg-[#9cfb51] text-[#011417]"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tagLabel(tag)}
                </button>
              );
            })}
          </div>

          <label className="relative block w-full sm:w-[300px] sm:shrink-0">
            <span className="sr-only">{t("blog.search.placeholder")}</span>
            <input
              type="search"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={t("blog.search.placeholder")}
              className="h-[40px] w-full rounded-full border border-white/10 bg-white/5 px-[18px] text-[14px] text-white placeholder:text-white/35 transition focus:border-white/30 focus:bg-white/8 focus:outline-none"
            />
          </label>
        </div>

        {pagePosts.length === 0 ? (
          <div className="mt-[64px] flex flex-col items-center justify-center gap-[12px] rounded-[16px] border border-white/10 bg-white/5 px-[20px] py-[48px] text-center">
            <p className="text-[18px] font-medium text-white">{t("blog.empty.title")}</p>
            <p className="max-w-[420px] text-[14px] text-white/55">{t("blog.empty.body")}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-[12px] rounded-full bg-white px-[20px] py-[10px] text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5"
            >
              {t("blog.empty.clear")}
            </button>
          </div>
        ) : (
          <div className="mt-[40px] grid gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
            {pagePosts.map((p) => (
              <BlogPostCard key={p.slug} post={p} tagLabel={tagLabel} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-[48px] flex items-center justify-center gap-[8px]" aria-label="Pagination">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="rounded-full border border-white/10 bg-white/5 px-[14px] py-[8px] text-[13px] text-white/75 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                aria-current={n === safePage ? "page" : undefined}
                className={`rounded-full px-[14px] py-[8px] text-[13px] transition ${
                  n === safePage
                    ? "bg-[#9cfb51] text-[#011417] font-bold"
                    : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded-full border border-white/10 bg-white/5 px-[14px] py-[8px] text-[13px] text-white/75 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </nav>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
