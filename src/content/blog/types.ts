// Phase 5 B-01: blog content type — supersedes the Phase 4 GuideContent type.
// Same shape as guides under the hood (steps + faq optional), with extras for the listing
// surface: cover image, excerpt/description for cards & meta, category for filtering,
// readingTimeMin for the byline. Author is implicit — single-author site, uses FOUNDER_NAME
// from scripts/seo-routes.ts:49 everywhere a byline renders.

export type BlogTag =
  | "ai-image-gen"
  | "ai-video-gen"
  | "prompt-engineering"
  | "model-deep-dive"
  | "workflow"
  | "release-notes";

export type BlogCategory = "guide" | "news";

export interface BlogImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface BlogPromoBanner {
  eyebrow?: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  image: BlogImage;
}

export interface BlogFaqItem {
  q: string;
  a: string;
}

export interface BlogStep {
  title: string;
  body: string;
  before?: string;
  after?: string;
  imageSrc?: string;
  promoBanner?: BlogPromoBanner;
}

export interface BlogSection {
  heading: string;
  body: string;
  image?: BlogImage;
  promoBanner?: BlogPromoBanner;
}

export interface BlogPostBody {
  intro: string;              // first 40-60 words = definitional answer-block (GEO citability)
  sections?: BlogSection[];   // prose blocks (h2 + body)
  steps?: BlogStep[];         // ordered list → HowTo schema source
  faq?: BlogFaqItem[];        // → FAQPage schema source
}

export interface BlogPostLocale {
  slug: string;
  title: string;
  excerpt: string;            // 140-180 chars (cards + meta description)
  description: string;        // 150-160 chars (<meta name=description>)
  category: BlogCategory;     // visible blog label/filter: guide or news
  tags: BlogTag[];            // 2-4 technical SEO keywords, not visible filters
  cover: BlogImage;           // ≥1200px wide for Rich Results carousel; ideally 1600×900
  articleHero?: BlogImage;    // optional in-article visual; cover remains the card/OG image
  readingTimeMin: number;
  publishedAt: string;        // ISO yyyy-mm-dd
  updatedAt: string;
  body: BlogPostBody;
  related?: string[];         // slugs; UI shows max 2
  editorialLayout?: "upwork-start"; // opt-in renderer for longform editorial stories
}

export interface BlogPost {
  ru: BlogPostLocale;
  en: BlogPostLocale;
}
