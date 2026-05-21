// Phase 5 B-04: blog post card for /blog and /en/blog listing.
// Dark card on bg-[#0e2023] per the opten-design system, 16:9 cover, category badge,
// title, excerpt, and meta row (date + reading time + first 2 tags).
// Picture/srcset is intentionally NOT used here: blog covers live in public/blog/<slug>/
// (generated via Codex CLI in C8) and are referenced by absolute URL — vite-imagetools
// only optimizes assets imported through Vite, not arbitrary public/ paths.

import LocalizedLink from "./LocalizedLink";
import { useLang, useT } from "../../i18n/LangContext";
import type { BlogPostLocale, BlogTag } from "../../content/blog/types";

interface BlogPostCardProps {
  post: BlogPostLocale & { slug: string };
  tagLabel: (tag: BlogTag) => string;
}

function categoryLabelKey(category: BlogPostLocale["category"]): string {
  switch (category) {
    case "guide":
      return "blog.category.guide";
    case "deep-dive":
      return "blog.category.deepDive";
    case "comparison":
      return "blog.category.comparison";
    case "news":
      return "blog.category.news";
  }
}

function formatDate(iso: string, lang: "ru" | "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostCard({ post, tagLabel }: BlogPostCardProps) {
  const t = useT();
  const { lang } = useLang();
  const href = `/blog/${post.slug}`;
  return (
    <LocalizedLink
      to={href}
      className="group block overflow-hidden rounded-[12px] border border-white/10 bg-[#0e2023] text-inherit no-underline transition hover:border-white/20 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#011417]">
        <img
          src={post.cover.src}
          alt={post.cover.alt}
          width={post.cover.width}
          height={post.cover.height}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-col gap-[12px] p-[20px]">
        <span className="inline-flex w-fit items-center rounded-full bg-[rgba(156,251,81,0.15)] px-[10px] py-[3px] text-[11px] font-bold uppercase tracking-[1px] text-[#9cfb51]">
          {t(categoryLabelKey(post.category))}
        </span>
        <h3 className="font-['Unbounded',sans-serif] text-[18px] font-medium leading-[1.25] tracking-[-0.3px] text-white line-clamp-2">
          {post.title}
        </h3>
        <p className="text-[14px] leading-[1.55] text-white/65 line-clamp-3">{post.excerpt}</p>
        <div className="mt-[4px] flex flex-wrap items-center gap-x-[8px] gap-y-[4px] text-[12px] text-white/45">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
          <span>·</span>
          <span>
            {post.readingTimeMin} {t("blog.readingTime")}
          </span>
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-[8px] py-[2px] text-white/55">
              {tagLabel(tag)}
            </span>
          ))}
        </div>
      </div>
    </LocalizedLink>
  );
}
