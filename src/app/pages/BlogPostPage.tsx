// Phase 5 B-05: blog post page (/blog/:slug + /en/blog/:slug).
// Renamed from GuidePage.tsx — supports the new BlogPostLocale shape (body.intro +
// optional sections / steps / faq). Uses <SiteHeader variant="page"> so the unified
// hamburger menu (with Blog link) is consistent across the site.
//
// SEO-aligned DOM mirrors the JSON-LD emitted by scripts/seo-routes.ts:
//   - <h1> + .blog-intro = WebPage.speakable.cssSelector
//   - <time datetime=ISO> matches BlogPosting.datePublished/dateModified
//   - "/blog" breadcrumb anchor is reflected in BreadcrumbList @id #breadcrumb
//
// SSR-safe: useParams + useLang resolve under StaticRouter.

import { useParams } from "react-router";
import { useT, useLang } from "../../i18n/LangContext";
import LocalizedLink from "../components/LocalizedLink";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BlogPostCard from "../components/BlogPostCard";
import FaqBlock from "../components/FaqBlock";
import ResponsiveImage from "../components/ResponsiveImage";
import UpworkStartArticle from "../components/blog/UpworkStartArticle";
import { blogPostsBySlug, allBlogPosts, type BlogSlug } from "../../content/blog";
import type { BlogPromoBanner } from "../../content/blog/types";

function formatPostDate(iso: string, lang: "ru" | "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

function NotFoundFallback() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[#011417] font-['PT_Root_UI',sans-serif] flex flex-col items-center justify-center px-[20px]">
      <h1 className="text-white text-[28px] md:text-[32px] font-medium mb-[12px]">
        {t("guide.notFound.title")}
      </h1>
      <p className="text-[rgba(255,255,255,0.6)] text-[16px] mb-[24px]">
        {t("guide.notFound.body")}
      </p>
      <LocalizedLink
        to="/blog"
        className="rounded-[100px] bg-white px-[24px] py-[12px] text-[#011417] text-[14px] font-bold no-underline"
      >
        {t("blog.backToList")}
      </LocalizedLink>
    </div>
  );
}

function BlogPromoBanner({ banner }: { banner: BlogPromoBanner }) {
  return (
    <aside className="relative mt-[24px] min-h-[320px] overflow-hidden rounded-[8px] border border-white/10 bg-[#011417] md:min-h-[280px]">
      <div className="absolute inset-0" aria-hidden="true">
        <ResponsiveImage
          src={banner.image.src}
          alt=""
          width={banner.image.width}
          height={banner.image.height}
          loading="lazy"
          widths={[480, 800, 1200, 1600]}
          sizes="(max-width: 840px) calc(100vw - 40px), 800px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#011417] via-[#011417]/92 to-[#011417]/8" aria-hidden="true" />
      <div className="relative z-10 flex min-h-[320px] max-w-[430px] flex-col justify-center px-[22px] py-[28px] md:min-h-[280px] md:px-[32px]">
        {banner.eyebrow && (
          <p className="mb-[10px] text-[11px] font-bold uppercase tracking-[1.4px] text-[#9cfb51]">
            {banner.eyebrow}
          </p>
        )}
        <h3 className="font-['Unbounded',sans-serif] text-[22px] font-medium leading-[1.2] tracking-[-0.4px] text-white md:text-[26px]">
          {banner.title}
        </h3>
        <p className="mt-[12px] text-[15px] leading-[1.55] text-white/72 md:text-[16px]">
          {banner.body}
        </p>
        <LocalizedLink
          to={banner.href}
          className="mt-[20px] inline-flex w-fit items-center rounded-full bg-[#9cfb51] px-[18px] py-[10px] text-[14px] font-bold text-[#011417] no-underline transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(156,251,81,0.2)]"
        >
          {banner.ctaLabel} →
        </LocalizedLink>
      </div>
    </aside>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();
  const t = useT();

  const postEntry = slug ? blogPostsBySlug[slug as BlogSlug] : undefined;
  const data = postEntry?.[lang];
  if (!data) {
    return <NotFoundFallback />;
  }
  const steps = data.body.steps ?? [];
  const sections = data.body.sections ?? [];
  const faq = data.body.faq ?? [];

  // Related posts: explicit `related[]` if defined, else other recent posts.
  const explicitRelated = (data.related ?? [])
    .map((s) => allBlogPosts.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));
  const fallbackRelated = allBlogPosts.filter((b) => b.slug !== data.slug).slice(0, 2);
  const related = (explicitRelated.length ? explicitRelated : fallbackRelated).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SiteHeader variant="page" />

      <main className="mx-auto max-w-[800px] px-[20px] pb-[60px] pt-[120px] sm:pt-[140px]">
        {/* Breadcrumb (visible mirror of JSON-LD BreadcrumbList) — current page shown as truncated
            text node (no link), so users see they're on a leaf inside /blog. */}
        <nav aria-label="Breadcrumb" className="mb-[24px] flex flex-wrap items-center gap-x-[8px] gap-y-[4px] text-[13px] text-white/45">
          <LocalizedLink to="/" className="no-underline text-inherit transition hover:text-white">
            {t("nav.home")}
          </LocalizedLink>
          <span aria-hidden="true">/</span>
          <LocalizedLink to="/blog" className="no-underline text-inherit transition hover:text-white">
            {t("nav.blog")}
          </LocalizedLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="max-w-full truncate text-white/75">{data.title}</span>
        </nav>

        {/* Category badge */}
        <span className="inline-flex w-fit items-center rounded-full bg-[rgba(156,251,81,0.15)] px-[10px] py-[3px] text-[11px] font-bold uppercase tracking-[1px] text-[#9cfb51]">
          <span className="inline-block translate-y-[2px]">{t(`blog.category.${data.category}`)}</span>
        </span>

        <h1 className="mt-[16px] font-['Unbounded',sans-serif] text-[28px] font-medium leading-[1.15] tracking-[-0.6px] text-white md:text-[40px]">
          {data.title}
        </h1>

        {/* Byline + dates + reading time. Visible attribution for AI citation (HI-5 carryover). */}
        <p className="mt-[16px] text-[14px] leading-[1.55] text-white/45">
          <span className="text-white/70">{t("blog.byline")}</span>
          {" · "}
          <time dateTime={data.publishedAt}>{formatPostDate(data.publishedAt, lang)}</time>
          {data.updatedAt !== data.publishedAt && (
            <>
              {" · "}
              {t("blog.updatedLabel")}: <time dateTime={data.updatedAt}>{formatPostDate(data.updatedAt, lang)}</time>
            </>
          )}
          {" · "}
          {data.readingTimeMin} {t("blog.readingTime")}
        </p>

        {/* Cover image — 16:9, ≥1200px wide for Rich Results carousel */}
        <figure className="mt-[28px] overflow-hidden rounded-[12px] border border-white/10 bg-[#0e2023]">
          <ResponsiveImage
            src={data.cover.src}
            alt={data.cover.alt}
            width={data.cover.width}
            height={data.cover.height}
            loading="eager"
            widths={[480, 800, 1200, 1600]}
            sizes="(max-width: 840px) calc(100vw - 40px), 800px"
            className="block h-auto w-full"
          />
        </figure>

        {/* GEO citability: definitional answer-block in the first 40-60 words. */}
        <p className="blog-intro mt-[32px] text-[17px] leading-[1.6] text-white/75 md:text-[18px]">
          {data.body.intro}
        </p>

        {data.editorialLayout === "upwork-start" && <UpworkStartArticle lang={lang} />}

        {/* Optional ordered steps (HowTo source) */}
        {data.editorialLayout !== "upwork-start" && steps.length > 0 && (
          <ol className="mt-[40px] flex flex-col gap-[40px]">
            {steps.map((step, i) => (
              <li key={i} className="border-t border-white/10 pt-[28px]">
                <div className="mb-[12px] flex items-baseline gap-[12px]">
                  <span className="font-['Unbounded',sans-serif] text-[22px] font-bold leading-[1] text-[#9cfb51] md:text-[28px]">
                    {i + 1}.
                  </span>
                  <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.4px] text-white md:text-[24px]">
                    {step.title}
                  </h2>
                </div>
                <p className="mb-[16px] text-[16px] leading-[1.7] text-white/78">{step.body}</p>
                {step.before && step.after && (
                  <div className="mt-[16px] grid gap-[12px] md:grid-cols-2">
                    <div className="rounded-[8px] border border-[rgba(212,24,61,0.2)] bg-[rgba(212,24,61,0.08)] p-[16px]">
                      <p className="mb-[8px] text-[12px] font-bold uppercase tracking-[1px] text-[#d4183d]">
                        {t("guide.beforeLabel")}
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-[13px] leading-[1.6] text-white/70">{step.before}</pre>
                    </div>
                    <div className="rounded-[8px] border border-[rgba(156,251,81,0.2)] bg-[rgba(156,251,81,0.06)] p-[16px]">
                      <p className="mb-[8px] text-[12px] font-bold uppercase tracking-[1px] text-[#9cfb51]">
                        {t("guide.afterLabel")}
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-[13px] leading-[1.6] text-white/85">{step.after}</pre>
                    </div>
                  </div>
                )}
                {step.imageSrc && (
                  <ResponsiveImage
                    src={step.imageSrc}
                    alt={step.title}
                    loading="lazy"
                    width="800"
                    height="450"
                    widths={[480, 800]}
                    sizes="(max-width: 840px) calc(100vw - 40px), 800px"
                    className="mt-[16px] w-full rounded-[8px] border border-white/10"
                  />
                )}
                {step.promoBanner && <BlogPromoBanner banner={step.promoBanner} />}
              </li>
            ))}
          </ol>
        )}

        {/* Optional prose sections (essay-style posts) */}
        {data.editorialLayout !== "upwork-start" && sections.length > 0 && (
          <div className="mt-[40px] flex flex-col gap-[32px]">
            {sections.map((sec, i) => (
              <section key={i} className="border-t border-white/10 pt-[24px]">
                <h2 className="mb-[12px] text-[22px] font-medium leading-[1.3] tracking-[-0.4px] text-white md:text-[24px]">
                  {sec.heading}
                </h2>
                {sec.body.split("\n\n").map((paragraph, p) => (
                  <p key={p} className="mb-[14px] text-[16px] leading-[1.7] text-white/78">
                    {paragraph}
                  </p>
                ))}
                {sec.image && (
                  <ResponsiveImage
                    src={sec.image.src}
                    alt={sec.image.alt}
                    width={sec.image.width}
                    height={sec.image.height}
                    loading="lazy"
                    widths={[480, 800, 1200]}
                    sizes="(max-width: 840px) calc(100vw - 40px), 800px"
                    className="mt-[12px] w-full rounded-[8px] border border-white/10"
                  />
                )}
                {sec.promoBanner && <BlogPromoBanner banner={sec.promoBanner} />}
              </section>
            ))}
          </div>
        )}

        {/* Tags are surfaced in the byline + JSON-LD keywords; no duplicate pill row at the foot. */}
      </main>

      {/* FAQ — FaqBlock id preserved so verify-faq-mainentity.mjs regex (id="[^"]*faq[^"]*") matches */}
      {faq.length > 0 && (
        <FaqBlock items={faq} headingKey="blog.faqHeading" id="blog-faq" />
      )}

      {/* Related posts (or "Browse all" CTA when only this post exists) — width-aligned with the
          800px article column so the section reads as part of the post, not a sitewide widget. */}
      <section className="mx-auto max-w-[800px] px-[20px] pb-[60px]">
        <h2 className="mb-[20px] font-['Unbounded',sans-serif] text-[22px] font-medium leading-[1.2] tracking-[-0.4px] text-white md:text-[28px]">
          {t("blog.relatedHeading")}
        </h2>
        {related.length > 0 ? (
          <div className="grid gap-[20px] sm:grid-cols-2">
            {related.map(({ slug: s, post }) => (
              <BlogPostCard key={s} post={{ slug: s, ...post[lang] }} />
            ))}
          </div>
        ) : (
          <LocalizedLink
            to="/blog"
            className="inline-flex items-center gap-[8px] rounded-full border border-white/10 bg-white/5 px-[20px] py-[12px] text-[14px] text-white/85 no-underline transition hover:bg-white/10 hover:text-white"
          >
            {t("blog.viewAllPosts")} →
          </LocalizedLink>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
