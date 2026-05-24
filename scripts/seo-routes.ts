// Phase 2 GEO-B-1 / D-03: Per-route metadata manifest (RU only — D-05).
// SYNC: title/description strings duplicated from src/i18n/ru.json — keep both in step until Phase 3 introduces a unified i18n→manifest pipeline.

// Phase 4 D-06 / D-08 / V-10: imports from src/content for HowTo + FAQ schema sources.
// Phase 5 B-01: gptImage2 guide relocated to src/content/blog/ — body shape now wraps
// intro/steps/faq under `body: { ... }`. URL still /guides/gpt-image-2 until B-07.
// This compiles cleanly via vite build --ssr; the deep imports resolve at SSR-bundle time.
import { post as gptImage2Guide } from "../src/content/blog/gpt-image-2";
import { landingFaq } from "../src/content/landingFaq";
// Phase v2.0 MODELS-A-6: programmatic model pages. allModels is the registry +
// content barrel. Only models with `content !== undefined` produce a route in
// the loop below — in Phase 1 that's only the manual gpt-image-2 reference;
// Phase 2 fills the rest.
import { allModels, HUB_HIDDEN_SLUGS } from "../src/content/models";
import { metaField } from "../src/content/models/metaEn";
import type { ModelContent, ModelEntry, ModelMeta } from "../src/content/models/types";

// Phase 3 D-01/D-02: cluster pairs (reciprocal hreflang per RESEARCH.md Pitfall 5):
//   "/"        ↔ "/en/"          "/pay"     ↔ "/en/pay"
//   "/welcome" ↔ "/en/welcome"   "/privacy" ↔ "/en/privacy"
//   "/terms"   ↔ "/en/terms"     "/refund"  ↔ "/en/refund"
// xDefault always = RU sibling (D-02 root canonical).

// Phase 4 D-09: schema.org JSON-LD block shape. Loose typing — schema.org has
// hundreds of types; we lean on the Rich Results Test rather than the TS compiler
// for correctness. The index signature lets us add arbitrary schema properties
// (mainEntity, offers, step, etc.) without per-type interface fatigue.
export interface SchemaBlock {
  "@context"?: string;
  "@type": string;
  "@id"?: string;
  [key: string]: unknown;
}

export interface RouteMeta {
  path: string;                         // canonical pathname (D-07: bare, no trailing slash except "/")
  htmlLang: "ru" | "en";               // Phase 3 D-04: language tag baked per-route at prerender time
  hreflangAlternates: {                 // Phase 3 D-02: reciprocal triplet (RESEARCH.md Pattern 1)
    ru: string;
    en: string;
    xDefault: string;
  };
  title: string;                        // <title>
  description: string;                  // <meta name="description">
  canonical: string;                    // absolute URL for <link rel="canonical"> AND <meta og:url>
  ogTitle: string;                      // <meta property="og:title">
  ogDescription: string;               // <meta property="og:description">
  ogImage?: string;                     // absolute URL; Phase 4.1 WR-01: EN routes set DEFAULT_OG_IMAGE_EN here, RU routes leave undefined and applyOgImage falls back to DEFAULT_OG_IMAGE = og-card-ru.png
  author?: string;                      // Post-2026-05-17 GEO audit ME-10: per-route <meta name="author">. Set on routes with a named human byline (/about, /guides/*); other routes keep the template's generic "Opten".
  prerender: "full" | "head" | "none"; // D-02 tier
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;                     // 0..1 — matches Phase 1 sitemap priorities
  schema?: SchemaBlock[];               // Phase 4 D-09: optional schema.org JSON-LD blocks; consumed by prerender.mjs applyJsonLd
  modelIsland?: ModelIslandData;        // Speed/Phase B: per-page model content data-island. prerender.mjs injects it as <script type="application/json" id="opten-model"> so the client bundle can drop the eager 62-model glob. Both langs (LangSwitcher does client-side navigate). Only set on /models/:slug routes.
}

// Speed/Phase B: payload of the model data-island. Carries BOTH locales so a
// client-side RU↔EN language switch on a model page resolves content[otherLang]
// synchronously (no async hop, no hydration mismatch).
export interface ModelIslandData {
  slug: string;
  meta: ModelMeta;
  content: ModelContent;
}

// Post-2026-05-17 GEO audit ME-10: shared author string for routes with a human byline.
// Match PERSON_FOUNDER_BLOCK.name so meta + JSON-LD don't disagree (audit CR-1 root-cause class).
export const FOUNDER_NAME = "Влад Воронежцев";

export const SITE_ORIGIN = "https://opten.space";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-card-ru.png`;
export const DEFAULT_OG_IMAGE_EN = `${SITE_ORIGIN}/og-card-en.png`; // Phase 3 D-04 — EN OG card (already in public/ from Phase 1 GEO-A-4)

// Phase 4 D-09: external URLs used by multiple schema blocks.
const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";
const FOUNDER_TELEGRAM_URL = "https://t.me/v_voronezhtsev";
// Post-2026-05-17 GEO audit: founder's AI-blogger YouTube — primary external authority signal,
// previously not linked in sameAs (audit CR-2). 4500+ subs, 54 videos, ~7M views over the past year.
const FOUNDER_YOUTUBE_URL = "https://www.youtube.com/@v.voronezhtsev";

// Phase 4 D-10: @id reference pointers — used inside schema blocks to cross-link the entity graph
// without inlining the full block (avoids duplication and gives crawlers a single canonical entity per @id).
const ORG_REF = { "@id": `${SITE_ORIGIN}/#org` };
const WEBSITE_REF = { "@id": `${SITE_ORIGIN}/#website` };
const SOFTWARE_APP_REF = { "@id": `${SITE_ORIGIN}/#software-app` };
const PERSON_FOUNDER_REF = { "@id": `${SITE_ORIGIN}/#person-founder` };

// Phase 4 D-09: full reusable schema-block constants. Each block is the canonical declaration
// of its @id-keyed entity; other blocks reference them via *_REF pointers above.

export const ORG_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_ORIGIN}/#org`,
  name: "Opten",
  legalName: "ИП Воронежцев В.П.",
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/favicon-192x192.png`,
  // Post-audit: description + foundingDate + contactPoint give AI systems a complete entity card
  // (was barebones name/url/logo only). foundingDate = official Opten launch 2026-04-22.
  description: "Opten — Chrome-расширение для генерации, AI-оценки и улучшения промптов под 60+ моделей генерации изображений и видео (Midjourney, GPT Image 2, Kling, Sora и др.).",
  foundingDate: "2026-04-22",
  founder: PERSON_FOUNDER_REF,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "zignifer@gmail.com",
    url: FOUNDER_TELEGRAM_URL,
    availableLanguage: ["ru", "en"],
  },
  sameAs: [
    CHROME_STORE_URL,
    FOUNDER_TELEGRAM_URL,
    FOUNDER_YOUTUBE_URL,
  ],
};

// EN sibling of ORG_BLOCK — same @id / entity, English description for /en/* pages.
// Audit fix: the RU description was leaking onto EN pages. legalName stays Cyrillic
// ("ИП Воронежцев В.П.") — it's the real registered legal name (schema.org legalName).
export const ORG_BLOCK_EN: SchemaBlock = {
  ...ORG_BLOCK,
  description:
    "Opten is a Chrome extension that generates, scores and improves prompts in one click across 60+ image and video generation models (Midjourney, GPT Image 2, Kling, Sora, etc.).",
};

export const WEBSITE_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: "Opten",
  inLanguage: ["ru-RU", "en-US"],
  publisher: ORG_REF,
};

export const SOFTWARE_APP_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_ORIGIN}/#software-app`,
  name: "Opten",
  // Post-audit: description, screenshot, softwareVersion — required by Google for SoftwareApp rich result.
  // softwareVersion synced from C:\Projects\promptscore\manifest.json (extension repo, single source of truth).
  description: "Chrome extension that generates, scores and rewrites AI prompts for 60+ image and video generation models (Midjourney, GPT Image 2, Kling, Sora, Nano Banana, Flux, Imagen) in one click directly inside the generator's UI.",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome",
  softwareVersion: "1.3.6",
  screenshot: DEFAULT_OG_IMAGE_EN,
  url: `${SITE_ORIGIN}/`,
  downloadUrl: CHROME_STORE_URL,
  publisher: ORG_REF,
  // Phase 4.2 P0-5 / CONTEXT D-4: aggregateRating removed — hardcoded 5.0/2 did not match live Chrome Web Store. Restore when ≥10 honest reviews accumulate (Phase 5).
  offers: [
    { "@type": "Offer", price: "2.99", priceCurrency: "USD", name: "Pro Monthly" },
    { "@type": "Offer", price: "199",  priceCurrency: "RUB", name: "Pro Monthly (RU)" },
    { "@type": "Offer", price: "4.99", priceCurrency: "USD", name: "Pro One-time" },
    { "@type": "Offer", price: "299",  priceCurrency: "RUB", name: "Pro One-time (RU)" },
  ],
};

// Phase 4 D-09: defined at module scope, wired onto /about only in Plan 04-05 (per D-03).
// Post-2026-05-17 GEO audit CR-1: name was "Виктор Воронежцев" — schema-vs-body conflict (visible
// text везде "Влад Воронежцев"). Audit confirmed independently by 4/5 agents + Codex CLI.
// Fixed by promoting "Влад" to canonical name and keeping the legal form as alternateName.
export const PERSON_FOUNDER_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_ORIGIN}/#person-founder`,
  name: "Влад Воронежцев",
  alternateName: "Воронежцев Владислав Павлович",
  givenName: "Владислав",
  familyName: "Воронежцев",
  url: `${SITE_ORIGIN}/about`,
  jobTitle: "Founder, Opten",
  description: "AI-блогер, автор Chrome-расширения Opten для оценки промптов под конкретные AI-модели.",
  knowsAbout: [
    "AI image generation",
    "Prompt engineering",
    "Midjourney",
    "GPT Image 2",
    "Kling",
    "Sora",
    "Flux",
  ],
  worksFor: ORG_REF,
  sameAs: [FOUNDER_TELEGRAM_URL, FOUNDER_YOUTUBE_URL],
  // Post-v1.0 hotfix (2026-05-18): user-supplied founder photo landed.
  // Closes deferred P1-6 from the 2026-05-17 SEO/GEO synthesis. Asset is
  // 400×400 raster (Google Rich Results validator prefers raster over WebP
  // for Person.image — the visible <picture> on /about serves WebP@1x/@2x
  // with this JPEG as fallback).
  image: `${SITE_ORIGIN}/founder.jpg`,
};

// Phase 4 D-09: pure builder helpers — page-specific schema blocks. Each takes a pageId URL
// used to scope nested @id values (e.g. `${pageId}#faq`) so the same builder can produce
// distinct entities on different routes without @id collisions.

export function faqPageBlock(items: readonly { q: string; a: string }[], pageId: string): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageId}#faq`,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function howToBlock(steps: { title: string; body: string }[], pageId: string, name: string): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${pageId}#howto`,
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
}

// Phase 4 D-09: Product block — used by /pay in Plan 04-04 (D-12 full-prerender flip). Accepts an
// array of plan-tier objects and emits a Product with `offers` as an AggregateOffer when ≥2 tiers,
// or a single Offer when 1. Per Google's Rich Results spec, AggregateOffer requires
// lowPrice/highPrice/priceCurrency; we compute those from the input array.
export function productBlock(plans: { name: string; price: string; currency: string }[], pageId: string): SchemaBlock {
  // Phase 04.1 WR-05: normalize + validate prices at function entry. parseFloat happily eats
  // "199 руб" or locale-comma strings ("199,99") and returns NaN/199 silently, which then
  // propagates into AggregateOffer lowPrice/highPrice math. Number() is strict — non-finite
  // throws with file/line context so a future translator typo fails the build, not Rich Results.
  // Keep the original formatted string `p.price` for schema output; `_n` is internal min/max only.
  const parsed = plans.map((p) => {
    const n = Number(p.price);
    if (!Number.isFinite(n)) {
      throw new Error(
        `productBlock(${pageId}): non-finite price "${p.price}" for plan "${p.name}" — expected a number-parseable string (e.g. "199" or "2.99")`,
      );
    }
    return { ...p, _n: n };
  });
  const product: SchemaBlock = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageId}#product`,
    name: "Opten Pro",
    description: "Opten Pro subscription — AI prompt scoring and one-click improvement for 60+ image generation models.",
    // Post-audit: Google requires `image` for Product rich result.
    image: [DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_EN],
    brand: ORG_REF,
    // Anchor product back to the SoftwareApplication entity so the graph stays connected.
    isRelatedTo: SOFTWARE_APP_REF,
    // Phase 4.2 P0-5 / CONTEXT D-4: aggregateRating removed — hardcoded 5.0/2 did not match live Chrome Web Store. Restore when ≥10 honest reviews accumulate (Phase 5).
  };
  if (plans.length === 1) {
    product.offers = {
      "@type": "Offer",
      name: plans[0].name,
      price: plans[0].price,
      priceCurrency: plans[0].currency,
      availability: "https://schema.org/InStock",
    };
  } else {
    // AggregateOffer when multi-currency / multi-tier.
    // lowPrice/highPrice are scoped per-currency only when currencies are identical; otherwise
    // we keep the raw `offers` array — Google accepts either shape on Product.
    const currencies = new Set(plans.map((p) => p.currency));
    if (currencies.size === 1) {
      // Pick the formatted string corresponding to the min/max numeric for lowPrice/highPrice output.
      const minN = parsed.reduce((m, p) => Math.min(m, p._n), Infinity);
      const maxN = parsed.reduce((m, p) => Math.max(m, p._n), -Infinity);
      const minPrice = parsed.find((p) => p._n === minN)!.price;
      const maxPrice = parsed.find((p) => p._n === maxN)!.price;
      product.offers = {
        "@type": "AggregateOffer",
        priceCurrency: plans[0].currency,
        lowPrice: minPrice,
        highPrice: maxPrice,
        offerCount: plans.length,
        availability: "https://schema.org/InStock",
      };
    } else {
      product.offers = plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.price,
        priceCurrency: p.currency,
        availability: "https://schema.org/InStock",
      }));
    }
  }
  return product;
}

// Phase v2.0 MODELS-A-6: SoftwareApplication block for an AI MODEL (distinct
// from SOFTWARE_APP_BLOCK above which describes Opten the extension). Each
// /models/<slug> page emits one of these to surface the model as a structured
// entity — applicationCategory maps to type, brand to vendor, isRelatedTo
// anchors it to the Opten extension so the graph stays connected.
export function softwareApplicationModelBlock(opts: {
  pageId: string;
  modelName: string;
  modelType: "image" | "video";
  vendor: string;
  description: string;
  url?: string;
  sameAs?: string[];
}): SchemaBlock {
  const block: SchemaBlock = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${opts.pageId}#model`,
    name: opts.modelName,
    description: opts.description,
    applicationCategory: opts.modelType === "video" ? "VideoApplication" : "GraphicsApplication",
    brand: { "@type": "Organization", name: opts.vendor },
    isRelatedTo: SOFTWARE_APP_REF,
  };
  if (opts.url) block.url = opts.url;
  if (opts.sameAs && opts.sameAs.length > 0) block.sameAs = opts.sameAs;
  return block;
}

// Post-2026-05-17 GEO audit HI-4: Article wrapper gives AI a canonical author+date attribution that
// HowTo/FAQPage alone don't carry. `type: "TechArticle"` for technical guides, `"Article"` for /about.
// Cross-refs PERSON_FOUNDER_BLOCK as `author` and ORG_BLOCK as `publisher` via existing @id graph.
export function articleBlock(opts: {
  pageId: string;
  type?: "Article" | "TechArticle";
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  inLanguage: "ru-RU" | "en-US";
  articleSection?: string;
  image?: string;
}): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "Article",
    "@id": `${opts.pageId}#article`,
    headline: opts.headline,
    description: opts.description,
    author: PERSON_FOUNDER_REF,
    publisher: ORG_REF,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: opts.inLanguage,
    mainEntityOfPage: opts.pageId,
    ...(opts.articleSection ? { articleSection: opts.articleSection } : {}),
    ...(opts.image ? { image: opts.image } : {}),
  };
}

// Post-2026-05-17 GEO audit ME-4: speakable declares which CSS-selected fragments are voice-ready
// for Google Assistant / Perplexity voice mode. Empty everywhere → instant +8 in audit ME-4.
export function webPageBlock(opts: {
  pageId: string;
  url: string;
  name: string;
  inLanguage: "ru-RU" | "en-US";
  cssSelector: string[];
  about?: { "@id": string };
}): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${opts.pageId}#webpage`,
    url: opts.url,
    name: opts.name,
    isPartOf: WEBSITE_REF,
    inLanguage: opts.inLanguage,
    ...(opts.about ? { about: opts.about } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: opts.cssSelector,
    },
  };
}

export function breadcrumbBlock(items: { name: string; url: string }[], pageId: string): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageId}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// Phase 5 B-02: blog-listing schema. `CollectionPage` is the canonical schema.org type for
// "a page that lists entries"; Google treats the legacy `Blog` type as an alias of CollectionPage
// in Rich Results — picking one (CollectionPage) avoids duplicate-entity warnings. Pair with
// an itemListBlock (sibling, not nested) for the post inventory — AI Overviews follow @id refs
// to the post pages rather than reading inline BlogPosting payloads.
export function collectionPageBlock(opts: {
  pageId: string;
  url: string;
  name: string;
  description: string;
  inLanguage: "ru-RU" | "en-US";
}): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${opts.pageId}#collection`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.inLanguage,
    isPartOf: WEBSITE_REF,
    publisher: ORG_REF,
  };
}

// Phase 5 B-02: ItemList — enumerates visible posts on a listing as ListItem refs (url only,
// NOT inline BlogPosting payloads). itemListOrder=ItemListOrderDescending signals newest-first
// to crawlers. Empty list is legal (numberOfItems: 0) — only emit when the listing has zero
// posts you intend to surface (unlikely; left for completeness).
export function itemListBlock(
  items: { url: string; name: string; datePublished?: string }[],
  pageId: string,
): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageId}#itemlist`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: it.url,
      name: it.name,
      ...(it.datePublished ? { datePublished: it.datePublished } : {}),
    })),
  };
}

// Phase 5 B-02: BlogPosting — more specific than the generic Article; preferred by Google for
// blog posts in Rich Results. author/publisher resolved via @id refs to the existing entity
// graph (PERSON_FOUNDER_REF / ORG_REF) — no denormalization. `keywords` is the comma-joined
// tag string (Google convention; AI Overview reads it for topical extraction). `articleBody`
// intentionally OMITTED — Google explicitly does not use it, and inlining the body inflates
// payload pointlessly. Image MUST be ≥1200px wide for the Rich Results carousel; we pass an
// {url,width,height} object so the spec validator is satisfied.
export function blogPostingBlock(opts: {
  pageId: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  inLanguage: "ru-RU" | "en-US";
  articleSection: string;
  keywords: string[];
  image: { url: string; width: number; height: number };
  wordCount?: number;
}): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${opts.pageId}#blogposting`,
    mainEntityOfPage: opts.pageId,
    headline: opts.headline,
    description: opts.description,
    image: {
      "@type": "ImageObject",
      url: opts.image.url,
      width: opts.image.width,
      height: opts.image.height,
    },
    author: PERSON_FOUNDER_REF,
    publisher: ORG_REF,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: opts.inLanguage,
    articleSection: opts.articleSection,
    keywords: opts.keywords.join(", "),
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
  };
}

// --- Phase v2.0 MODELS-A-6: programmatic model route helpers -------------

// Strip "by X" suffix and parenthetical from the platform string for use as a
// user-facing platform label (e.g. "Kling AI (klingai.com) by Kuaishou" → "Kling AI").
function platformLabel(meta: ModelMeta): string {
  return meta.platform.split(/\s+by\s+|\s+\(/)[0].trim();
}

function modelArticleSection(meta: ModelMeta, lang: "ru" | "en"): string {
  if (lang === "ru") return meta.type === "video" ? "Видео-модель" : "Image-модель";
  return meta.type === "video" ? "Video model" : "Image model";
}

function buildModelRoute(entry: ModelEntry, lang: "ru" | "en"): RouteMeta {
  if (!entry.content) {
    throw new Error(`buildModelRoute called for ${entry.slug} without content — filter callers by entry.content`);
  }
  const { meta } = entry;
  const locale = entry.content[lang];
  const path = lang === "ru" ? `/models/${meta.slug}` : `/en/models/${meta.slug}`;
  const ruUrl = `${SITE_ORIGIN}/models/${meta.slug}`;
  const enUrl = `${SITE_ORIGIN}/en/models/${meta.slug}`;
  const pageUrl = lang === "ru" ? ruUrl : enUrl;
  const inLanguage = lang === "ru" ? "ru-RU" : "en-US";
  const hubName = lang === "ru" ? "Модели" : "Models";
  const homeName = lang === "ru" ? "Главная" : "Home";
  const hubUrl = lang === "ru" ? `${SITE_ORIGIN}/models` : `${SITE_ORIGIN}/en/models`;
  const homeUrl = lang === "ru" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/en/`;

  return {
    path,
    htmlLang: lang,
    hreflangAlternates: {
      ru: ruUrl,
      en: enUrl,
      xDefault: ruUrl,
    },
    title: locale.title,
    description: locale.description,
    canonical: pageUrl,
    ogTitle: locale.title,
    ogDescription: locale.description,
    ogImage: lang === "ru" ? DEFAULT_OG_IMAGE : DEFAULT_OG_IMAGE_EN,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    // Speed/Phase B: both-langs island (identical on the RU and EN siblings).
    modelIsland: { slug: meta.slug, meta, content: entry.content },
    schema: [
      lang === "en" ? ORG_BLOCK_EN : ORG_BLOCK,
      WEBSITE_BLOCK,
      articleBlock({
        pageId: pageUrl,
        type: "TechArticle",
        headline: locale.title,
        description: locale.description,
        datePublished: meta.publishedAt,
        dateModified: meta.updatedAt,
        inLanguage,
        articleSection: modelArticleSection(meta, lang),
      }),
      softwareApplicationModelBlock({
        pageId: pageUrl,
        modelName: metaField(meta, "name", lang) ?? meta.name,
        modelType: meta.type,
        vendor: meta.vendor,
        description: locale.intro,
        url: meta.platformUrl || undefined,
      }),
      SOFTWARE_APP_BLOCK,
      webPageBlock({
        pageId: pageUrl,
        url: pageUrl,
        name: locale.title,
        inLanguage,
        cssSelector: ["h1", ".model-intro", "h2"],
      }),
      faqPageBlock(locale.faq, pageUrl),
      breadcrumbBlock(
        [
          { name: homeName, url: homeUrl },
          { name: hubName, url: hubUrl },
          { name: metaField(meta, "name", lang) ?? meta.name, url: pageUrl },
        ],
        pageUrl,
      ),
    ],
  };
}

function buildModelsHubRoute(lang: "ru" | "en", modelsWithContent: ModelEntry[]): RouteMeta {
  const path = lang === "ru" ? "/models" : "/en/models";
  const ruUrl = `${SITE_ORIGIN}/models`;
  const enUrl = `${SITE_ORIGIN}/en/models`;
  const pageUrl = lang === "ru" ? ruUrl : enUrl;
  const inLanguage = lang === "ru" ? "ru-RU" : "en-US";
  const homeName = lang === "ru" ? "Главная" : "Home";
  const homeUrl = lang === "ru" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/en/`;
  const title = lang === "ru"
    ? "Поддерживаемые AI-модели — каталог Opten"
    : "Supported AI models — Opten catalog";
  const description = lang === "ru"
    ? "Каталог из 60+ AI-моделей генерации изображений и видео, в которых работает Opten: Midjourney, Sora, Kling, Flux, Veo, Imagen и др."
    : "Catalog of 60+ AI image and video models supported by Opten: Midjourney, Sora, Kling, Flux, Veo, Imagen, and more.";
  const hubName = lang === "ru" ? "Модели" : "Models";

  return {
    path,
    htmlLang: lang,
    hreflangAlternates: {
      ru: ruUrl,
      en: enUrl,
      xDefault: ruUrl,
    },
    title,
    description,
    canonical: pageUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage: lang === "ru" ? DEFAULT_OG_IMAGE : DEFAULT_OG_IMAGE_EN,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "weekly",
    priority: 0.8,
    schema: [
      lang === "en" ? ORG_BLOCK_EN : ORG_BLOCK,
      WEBSITE_BLOCK,
      collectionPageBlock({
        pageId: pageUrl,
        url: pageUrl,
        name: title,
        description,
        inLanguage,
      }),
      itemListBlock(
        modelsWithContent
          .filter((m) => !HUB_HIDDEN_SLUGS.has(m.slug))
          .map((m) => ({
            url: lang === "ru" ? `${SITE_ORIGIN}/models/${m.slug}` : `${SITE_ORIGIN}/en/models/${m.slug}`,
            name: metaField(m.meta, "name", lang) ?? m.meta.name,
          })),
        pageUrl,
      ),
      webPageBlock({
        pageId: pageUrl,
        url: pageUrl,
        name: title,
        inLanguage,
        cssSelector: ["h1", ".model-intro"],
      }),
      breadcrumbBlock(
        [
          { name: homeName, url: homeUrl },
          { name: hubName, url: pageUrl },
        ],
        pageUrl,
      ),
    ],
  };
}

const modelsWithContent = allModels.filter((m): m is ModelEntry & { content: NonNullable<typeof m.content> } =>
  m.content !== undefined,
);
const modelRouteEntries: RouteMeta[] = [
  buildModelsHubRoute("ru", modelsWithContent),
  buildModelsHubRoute("en", modelsWithContent),
  ...modelsWithContent.flatMap((entry) => [
    buildModelRoute(entry, "ru"),
    buildModelRoute(entry, "en"),
  ]),
];

export const routes: RouteMeta[] = [
  // --- RU entries (6) ---
  {
    path: "/",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/`,
      en: `${SITE_ORIGIN}/en/`,
      xDefault: `${SITE_ORIGIN}/`,
    },
    title: "Opten — генератор и улучшение промптов для нейросетей",
    description: "Opten генерирует, оценивает и улучшает промпт под конкретную нейросеть, находит ошибки и исправляет в один клик. 60+ моделей в интерфейсе генератора.",
    canonical: `${SITE_ORIGIN}/`,
    ogTitle: "Opten — не сливай кредиты на плохие промпты",
    ogDescription: "Генератор, оценка и улучшение промптов для 60+ моделей генерации. Прямо в интерфейсе генератора.",
    prerender: "full",
    changefreq: "weekly",
    priority: 1.0,
    // Phase 4 D-09 / D-08 / V-10: Org + SoftwareApp + WebSite + FAQPage landing graph.
    // Post-2026-05-17 audit ME-4: +WebPage with speakable on H1 + FAQ Q&A (voice/AI extraction).
    schema: [
      ORG_BLOCK,
      SOFTWARE_APP_BLOCK,
      WEBSITE_BLOCK,
      webPageBlock({
        pageId: `${SITE_ORIGIN}/`,
        url: `${SITE_ORIGIN}/`,
        name: "Opten — генератор и улучшение промптов",
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".faq-question", ".faq-answer"],
        about: SOFTWARE_APP_REF,
      }),
      faqPageBlock(landingFaq.ru, `${SITE_ORIGIN}/`),
    ],
  },
  {
    path: "/pay",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/pay`,
      en: `${SITE_ORIGIN}/en/pay`,
      xDefault: `${SITE_ORIGIN}/pay`,
    },
    title: "Тарифы Opten — Pro-подписка для улучшения промптов",
    description: "Выберите тариф Opten Pro: 300 проверок в месяц, улучшение промптов в один клик. Оплата через ЮKassa (₽) или Paddle ($).",
    canonical: `${SITE_ORIGIN}/pay`,
    ogTitle: "Тарифы Opten — Pro с 300 генерациями в месяц",
    ogDescription: "Перейди на Pro и улучшай промпты в один клик. 199₽/мес или 299₽ разово.",
    prerender: "full", // Phase 4 D-12 (post-revert f9dfdb1): full prerender keeps the runtime-conditional pricing cards in initial HTML with visible prices, so Product schema validates against visible content.
    changefreq: "monthly",
    priority: 0.8,
    // Phase 4 D-09 / D-12: Org + Product (multi-currency offers) + breadcrumb.
    // Phase 04.1 WR-02: Free-tier Offer entry dropped — Pro is the Product, the free tier is acquisition copy.
    schema: [
      ORG_BLOCK,
      productBlock(
        [
          { name: "Pro Monthly (RU)", price: "199", currency: "RUB" },
          { name: "Pro Monthly", price: "2.99", currency: "USD" },
          { name: "Pro One-time (RU)", price: "299", currency: "RUB" },
          { name: "Pro One-time", price: "4.99", currency: "USD" },
        ],
        `${SITE_ORIGIN}/pay`,
      ),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Тарифы", url: `${SITE_ORIGIN}/pay` },
        ],
        `${SITE_ORIGIN}/pay`,
      ),
    ],
  },
  {
    path: "/welcome",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/welcome`,
      en: `${SITE_ORIGIN}/en/welcome`,
      xDefault: `${SITE_ORIGIN}/welcome`,
    },
    title: "Добро пожаловать в Opten — начало работы с расширением",
    description: "Opten установлен. Закрепи расширение, войди через Google и начни оценивать промпты прямо в интерфейсе AI-генератора.",
    canonical: `${SITE_ORIGIN}/welcome`,
    ogTitle: "Opten установлен — три шага для первого промпта",
    ogDescription: "Закрепи расширение, войди в аккаунт и открой syntx.ai или higgsfield.ai. Оцени промпт за секунды.",
    prerender: "full",
    changefreq: "monthly",
    priority: 0.6,
    // Phase 4 D-09: Org + breadcrumb (Главная → Добро пожаловать).
    schema: [
      ORG_BLOCK,
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Добро пожаловать", url: `${SITE_ORIGIN}/welcome` },
        ],
        `${SITE_ORIGIN}/welcome`,
      ),
    ],
  },
  {
    path: "/privacy",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/privacy`,
      en: `${SITE_ORIGIN}/en/privacy`,
      xDefault: `${SITE_ORIGIN}/privacy`,
    },
    title: "Политика конфиденциальности — Opten",
    description: "Политика конфиденциальности сервиса Opten: какие данные собираются, как используются и защищаются персональные данные пользователей.",
    canonical: `${SITE_ORIGIN}/privacy`,
    ogTitle: "Политика конфиденциальности — Opten",
    ogDescription: "Политика конфиденциальности сервиса Opten: сбор, хранение и защита персональных данных.",
    prerender: "full",
    changefreq: "yearly",
    priority: 0.3,
    schema: [
      ORG_BLOCK,
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Политика конфиденциальности", url: `${SITE_ORIGIN}/privacy` },
        ],
        `${SITE_ORIGIN}/privacy`,
      ),
    ],
  },
  {
    path: "/terms",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/terms`,
      en: `${SITE_ORIGIN}/en/terms`,
      xDefault: `${SITE_ORIGIN}/terms`,
    },
    title: "Условия использования — Opten",
    description: "Договор-оферта на предоставление доступа к сервису Opten: тарифы, порядок оплаты, права и обязанности сторон.",
    canonical: `${SITE_ORIGIN}/terms`,
    ogTitle: "Условия использования — Opten",
    ogDescription: "Договор-оферта сервиса Opten: тарифные планы, порядок оплаты, права и обязанности.",
    prerender: "full",
    changefreq: "yearly",
    priority: 0.3,
    schema: [
      ORG_BLOCK,
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Условия использования", url: `${SITE_ORIGIN}/terms` },
        ],
        `${SITE_ORIGIN}/terms`,
      ),
    ],
  },
  {
    path: "/refund",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/refund`,
      en: `${SITE_ORIGIN}/en/refund`,
      xDefault: `${SITE_ORIGIN}/refund`,
    },
    title: "Политика возврата — Opten",
    description: "Условия возврата средств за подписку и разовый доступ к Opten. Возврат в течение 3 дней при неиспользовании платных функций.",
    canonical: `${SITE_ORIGIN}/refund`,
    ogTitle: "Политика возврата — Opten",
    ogDescription: "Возврат средств за подписку Opten Pro в течение 3 дней при неиспользовании платных функций.",
    prerender: "full",
    changefreq: "yearly",
    priority: 0.3,
    schema: [
      ORG_BLOCK,
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Политика возврата", url: `${SITE_ORIGIN}/refund` },
        ],
        `${SITE_ORIGIN}/refund`,
      ),
    ],
  },

  // Phase 4 D-01 / D-02 / Phase 4.1 B-03: RU /about entry, now with reciprocal EN sibling at /en/about.
  // hreflang.en flipped from `/` (D-02 fallback) to `/en/about` (true sibling — B-03 closure).
  {
    path: "/about",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/about`,
      en: `${SITE_ORIGIN}/en/about`,    // Phase 4.1 B-03: reciprocal pair
      xDefault: `${SITE_ORIGIN}/about`,
    },
    title: "О проекте Opten — кто стоит за расширением",
    description: "Opten — личный проект Влада Воронежцева, AI-блогера и автора Chrome-расширения для оценки промптов. История создания, контакты, реквизиты.",
    canonical: `${SITE_ORIGIN}/about`,
    ogTitle: "О проекте Opten",
    ogDescription: "История создания Opten — расширения для оценки промптов под конкретную AI-модель.",
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "yearly",
    priority: 0.5,
    // Phase 4 D-09: Org + Person (founder) + breadcrumb (Главная → О проекте).
    // PERSON_FOUNDER_BLOCK still has image commented per locked decision option (c) — photo deferred.
    // Post-2026-05-17 audit HI-4: +Article gives AI canonical author+date for /about copy.
    schema: [
      ORG_BLOCK,
      PERSON_FOUNDER_BLOCK,
      articleBlock({
        pageId: `${SITE_ORIGIN}/about`,
        type: "Article",
        headline: "О проекте Opten — кто стоит за расширением",
        description: "Opten — личный проект Влада Воронежцева, AI-блогера и автора Chrome-расширения для оценки промптов.",
        datePublished: "2026-05-17",
        dateModified: "2026-05-17",
        inLanguage: "ru-RU",
        articleSection: "About",
      }),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "О проекте", url: `${SITE_ORIGIN}/about` },
        ],
        `${SITE_ORIGIN}/about`,
      ),
    ],
  },

  // Phase 5 B-04: /blog hub. Empty ItemList for now — gets populated when /blog/:slug posts are
  // added in B-05. Listing page only emits CollectionPage + ItemList + WebPage + BreadcrumbList.
  {
    path: "/blog",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog`,
      en: `${SITE_ORIGIN}/en/blog`,
      xDefault: `${SITE_ORIGIN}/blog`,
    },
    title: "Блог Opten — гайды по AI-генерации изображений и видео",
    description: "Гайды по AI-генерации, разборы моделей и заметки о промпт-инжиниринге. Без воды, на примерах. Бесплатно, на русском и английском.",
    canonical: `${SITE_ORIGIN}/blog`,
    ogTitle: "Блог Opten",
    ogDescription: "Гайды по AI-генерации изображений и видео, разборы моделей и заметки о промпт-инжиниринге.",
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "weekly",
    priority: 0.8,
    schema: [
      ORG_BLOCK,
      WEBSITE_BLOCK,
      collectionPageBlock({
        pageId: `${SITE_ORIGIN}/blog`,
        url: `${SITE_ORIGIN}/blog`,
        name: "Блог Opten",
        description: "Гайды по AI-генерации, разборы моделей и заметки о промпт-инжиниринге.",
        inLanguage: "ru-RU",
      }),
      itemListBlock(
        [
          // Phase 5 B-07: /guides retired; ItemList points at the new /blog canonical (codex review P2).
          { url: `${SITE_ORIGIN}/blog/gpt-image-2`, name: gptImage2Guide.ru.title, datePublished: gptImage2Guide.ru.publishedAt },
        ],
        `${SITE_ORIGIN}/blog`,
      ),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog`,
        url: `${SITE_ORIGIN}/blog`,
        name: "Блог Opten",
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro"],
      }),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
        ],
        `${SITE_ORIGIN}/blog`,
      ),
    ],
  },

  // Phase 5 B-05: /blog/gpt-image-2 — new canonical URL for the GPT Image 2 post.
  // Coexists with the legacy /guides/gpt-image-2 entry below until B-07 (Vercel 301 redirect).
  // Uses BlogPosting (more specific than the legacy entry's TechArticle) — Google's preferred
  // schema for blog posts in Rich Results.
  {
    path: "/blog/gpt-image-2",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/gpt-image-2`,
      en: `${SITE_ORIGIN}/en/blog/gpt-image-2`,
      xDefault: `${SITE_ORIGIN}/blog/gpt-image-2`,
    },
    title: gptImage2Guide.ru.title,
    description: gptImage2Guide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/gpt-image-2`,
    ogTitle: gptImage2Guide.ru.title,
    ogDescription: gptImage2Guide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${gptImage2Guide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/gpt-image-2`,
        headline: gptImage2Guide.ru.title,
        description: gptImage2Guide.ru.description,
        datePublished: gptImage2Guide.ru.publishedAt,
        dateModified: gptImage2Guide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: gptImage2Guide.ru.tags,
        // Uses the same cover as visible <img> + og:image for consistency.
        image: {
          url: `${SITE_ORIGIN}${gptImage2Guide.ru.cover.src}`,
          width: gptImage2Guide.ru.cover.width,
          height: gptImage2Guide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/gpt-image-2`,
        url: `${SITE_ORIGIN}/blog/gpt-image-2`,
        name: gptImage2Guide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (gptImage2Guide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/gpt-image-2`,
        gptImage2Guide.ru.title,
      ),
      faqPageBlock(gptImage2Guide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/gpt-image-2`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: gptImage2Guide.ru.title, url: `${SITE_ORIGIN}/blog/gpt-image-2` },
        ],
        `${SITE_ORIGIN}/blog/gpt-image-2`,
      ),
    ],
  },

  // Phase 5 B-07: legacy /guides/gpt-image-2 RU entry removed; redirected to /blog/gpt-image-2
  // via vercel.json. articleBlock import retained — still used by /about entries.

  // Phase 3 D-04: EN siblings (6 entries). EN ogImage = DEFAULT_OG_IMAGE_EN. SYNC: title/description duplicated from src/i18n/en.json — see line 2 SYNC policy.
  {
    path: "/en/",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/`,
      en: `${SITE_ORIGIN}/en/`,
      xDefault: `${SITE_ORIGIN}/`,
    },
    title: "Opten — AI Prompt Generator, Optimizer & Scorer (60+ models)",
    description: "Opten generates, scores and optimizes your prompt for the specific AI model — shows what's wrong and fixes it in one click. 60+ models, right inside the generator.",
    canonical: `${SITE_ORIGIN}/en/`,
    ogTitle: "Opten — stop wasting credits on bad prompts",
    ogDescription: "AI prompt generator, optimizer and scorer for 60+ image & video models. Right inside the generator interface.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full",
    changefreq: "weekly",
    priority: 1.0,
    // Phase 4 D-09 / D-08 / V-10: Org + SoftwareApp + WebSite + EN FAQPage (separate from RU set — Q/A localized).
    // Post-2026-05-17 audit ME-4: +WebPage with speakable on H1 + FAQ Q&A.
    schema: [
      ORG_BLOCK_EN,
      SOFTWARE_APP_BLOCK,
      WEBSITE_BLOCK,
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/`,
        url: `${SITE_ORIGIN}/en/`,
        name: "Opten — AI prompt generator & optimizer",
        inLanguage: "en-US",
        cssSelector: ["h1", ".faq-question", ".faq-answer"],
        about: SOFTWARE_APP_REF,
      }),
      faqPageBlock(landingFaq.en, `${SITE_ORIGIN}/en/`),
    ],
  },
  {
    path: "/en/pay",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/pay`,
      en: `${SITE_ORIGIN}/en/pay`,
      xDefault: `${SITE_ORIGIN}/pay`,
    },
    title: "Opten pricing — Pro subscription for prompt improvement",
    description: "Choose your Opten Pro plan: 300 checks per month, one-click prompt improvement. Pay via YooKassa (₽) or Paddle ($).",
    canonical: `${SITE_ORIGIN}/en/pay`,
    ogTitle: "Opten pricing — Pro with 300 checks per month",
    ogDescription: "Upgrade to Pro and improve prompts in one click. $2.99/mo or $4.99 one-time.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full", // Phase 4 D-12 (post-revert f9dfdb1): full prerender keeps the runtime-conditional pricing cards in initial HTML with visible prices, so Product schema validates against visible content.
    changefreq: "monthly",
    priority: 0.8,
    // Phase 04.1 WR-02: Free-tier Offer entry dropped — Pro is the Product, the free tier is acquisition copy.
    schema: [
      ORG_BLOCK_EN,
      productBlock(
        [
          { name: "Pro Monthly (RU)", price: "199", currency: "RUB" },
          { name: "Pro Monthly", price: "2.99", currency: "USD" },
          { name: "Pro One-time (RU)", price: "299", currency: "RUB" },
          { name: "Pro One-time", price: "4.99", currency: "USD" },
        ],
        `${SITE_ORIGIN}/en/pay`,
      ),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Pricing", url: `${SITE_ORIGIN}/en/pay` },
        ],
        `${SITE_ORIGIN}/en/pay`,
      ),
    ],
  },
  {
    path: "/en/welcome",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/welcome`,
      en: `${SITE_ORIGIN}/en/welcome`,
      xDefault: `${SITE_ORIGIN}/welcome`,
    },
    title: "Welcome to Opten — get started with the extension",
    description: "Opten is installed. Pin the extension, sign in with Google, and start scoring prompts right inside the AI generator interface.",
    canonical: `${SITE_ORIGIN}/en/welcome`,
    ogTitle: "Opten installed — three steps to your first prompt",
    ogDescription: "Pin the extension, sign in to your account, and open syntx.ai or higgsfield.ai. Score your prompt in seconds.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.6,
    schema: [
      ORG_BLOCK_EN,
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Welcome", url: `${SITE_ORIGIN}/en/welcome` },
        ],
        `${SITE_ORIGIN}/en/welcome`,
      ),
    ],
  },
  {
    path: "/en/privacy",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/privacy`,
      en: `${SITE_ORIGIN}/en/privacy`,
      xDefault: `${SITE_ORIGIN}/privacy`,
    },
    title: "Privacy Policy — Opten",
    description: "Privacy policy of the Opten service: what data is collected, how it is used and how personal data of users is protected.",
    canonical: `${SITE_ORIGIN}/en/privacy`,
    ogTitle: "Privacy Policy — Opten",
    ogDescription: "Privacy policy of the Opten service: data collection, storage and protection of personal information.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full",
    changefreq: "yearly",
    priority: 0.3,
    schema: [
      ORG_BLOCK_EN,
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Privacy Policy", url: `${SITE_ORIGIN}/en/privacy` },
        ],
        `${SITE_ORIGIN}/en/privacy`,
      ),
    ],
  },
  {
    path: "/en/terms",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/terms`,
      en: `${SITE_ORIGIN}/en/terms`,
      xDefault: `${SITE_ORIGIN}/terms`,
    },
    title: "Terms of Service — Opten",
    description: "Terms of service for the Opten service: plans, payment procedure, rights and obligations of the parties.",
    canonical: `${SITE_ORIGIN}/en/terms`,
    ogTitle: "Terms of Service — Opten",
    ogDescription: "Terms of service for Opten: pricing plans, payment procedure, rights and obligations.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full",
    changefreq: "yearly",
    priority: 0.3,
    schema: [
      ORG_BLOCK_EN,
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Terms of Service", url: `${SITE_ORIGIN}/en/terms` },
        ],
        `${SITE_ORIGIN}/en/terms`,
      ),
    ],
  },
  {
    path: "/en/refund",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/refund`,
      en: `${SITE_ORIGIN}/en/refund`,
      xDefault: `${SITE_ORIGIN}/refund`,
    },
    title: "Refund Policy — Opten",
    description: "Conditions for refunds on Opten subscriptions and one-time access. Full refund within 3 days if paid features are unused.",
    canonical: `${SITE_ORIGIN}/en/refund`,
    ogTitle: "Refund Policy — Opten",
    ogDescription: "Refunds on Opten Pro subscriptions within 3 days if paid features are unused.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full",
    changefreq: "yearly",
    priority: 0.3,
    schema: [
      ORG_BLOCK_EN,
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Refund Policy", url: `${SITE_ORIGIN}/en/refund` },
        ],
        `${SITE_ORIGIN}/en/refund`,
      ),
    ],
  },

  // Phase 4.1 B-03: /en/about EN sibling. Mirrors the RU /about entry — Org + Person (founder) + breadcrumb (Home → About).
  // PERSON_FOUNDER_BLOCK is shared with the RU entry (same @id graph node) so search engines see one Person across both locales.
  {
    path: "/en/about",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/about`,
      en: `${SITE_ORIGIN}/en/about`,
      xDefault: `${SITE_ORIGIN}/about`,
    },
    title: "About Opten — who's behind the extension",
    description: "Opten is a personal project by Vlad Voronezhtsev, AI blogger and creator of the Chrome extension for prompt scoring. Origin story, contacts, legal details.",
    canonical: `${SITE_ORIGIN}/en/about`,
    ogTitle: "About Opten",
    ogDescription: "Origin story of Opten — the extension for scoring prompts against specific AI models.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "yearly",
    priority: 0.5,
    schema: [
      ORG_BLOCK_EN,
      PERSON_FOUNDER_BLOCK,
      articleBlock({
        pageId: `${SITE_ORIGIN}/en/about`,
        type: "Article",
        headline: "About Opten — who's behind the extension",
        description: "Opten is a personal project by Vlad Voronezhtsev, AI blogger and creator of the Chrome extension for prompt scoring.",
        datePublished: "2026-05-17",
        dateModified: "2026-05-17",
        inLanguage: "en-US",
        articleSection: "About",
      }),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "About", url: `${SITE_ORIGIN}/en/about` },
        ],
        `${SITE_ORIGIN}/en/about`,
      ),
    ],
  },

  // Phase 5 B-04: /en/blog hub. Mirror of /blog with EN copy and en-US schema language.
  {
    path: "/en/blog",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog`,
      en: `${SITE_ORIGIN}/en/blog`,
      xDefault: `${SITE_ORIGIN}/blog`,
    },
    title: "Opten Blog — guides for AI image and video generation",
    description: "Guides for AI image and video generation, model deep dives, and prompt-engineering notes. No fluff, just worked examples. Free, RU + EN.",
    canonical: `${SITE_ORIGIN}/en/blog`,
    ogTitle: "Opten Blog",
    ogDescription: "Guides for AI image and video generation, model deep dives, and prompt-engineering notes.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "weekly",
    priority: 0.8,
    schema: [
      ORG_BLOCK_EN,
      WEBSITE_BLOCK,
      collectionPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog`,
        url: `${SITE_ORIGIN}/en/blog`,
        name: "Opten Blog",
        description: "Guides for AI image and video generation, model deep dives, and prompt-engineering notes.",
        inLanguage: "en-US",
      }),
      itemListBlock(
        [
          // Phase 5 B-07: /en/guides retired; ItemList points at the new /en/blog canonical (codex review P2).
          { url: `${SITE_ORIGIN}/en/blog/gpt-image-2`, name: gptImage2Guide.en.title, datePublished: gptImage2Guide.en.publishedAt },
        ],
        `${SITE_ORIGIN}/en/blog`,
      ),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog`,
        url: `${SITE_ORIGIN}/en/blog`,
        name: "Opten Blog",
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro"],
      }),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
        ],
        `${SITE_ORIGIN}/en/blog`,
      ),
    ],
  },

  // Phase 5 B-05: /en/blog/gpt-image-2 EN sibling. Mirrors /blog/gpt-image-2.
  {
    path: "/en/blog/gpt-image-2",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/gpt-image-2`,
      en: `${SITE_ORIGIN}/en/blog/gpt-image-2`,
      xDefault: `${SITE_ORIGIN}/blog/gpt-image-2`,
    },
    title: gptImage2Guide.en.title,
    description: gptImage2Guide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/gpt-image-2`,
    ogTitle: gptImage2Guide.en.title,
    ogDescription: gptImage2Guide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${gptImage2Guide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/gpt-image-2`,
        headline: gptImage2Guide.en.title,
        description: gptImage2Guide.en.description,
        datePublished: gptImage2Guide.en.publishedAt,
        dateModified: gptImage2Guide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: gptImage2Guide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${gptImage2Guide.en.cover.src}`,
          width: gptImage2Guide.en.cover.width,
          height: gptImage2Guide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/gpt-image-2`,
        url: `${SITE_ORIGIN}/en/blog/gpt-image-2`,
        name: gptImage2Guide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (gptImage2Guide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/gpt-image-2`,
        gptImage2Guide.en.title,
      ),
      faqPageBlock(gptImage2Guide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/gpt-image-2`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: gptImage2Guide.en.title, url: `${SITE_ORIGIN}/en/blog/gpt-image-2` },
        ],
        `${SITE_ORIGIN}/en/blog/gpt-image-2`,
      ),
    ],
  },

  // Phase 5 B-07: legacy /en/guides/gpt-image-2 EN entry removed; redirected to /en/blog/gpt-image-2
  // via vercel.json.

  // Phase v2.0 MODELS-A-6: programmatic model pages — hub (RU + EN) and one
  // RouteMeta per (model, locale) for every model with content !== undefined.
  // Phase 1 ships only the gpt-image-2 reference = 4 new routes (2 hubs + 2
  // page locales). Phase 2 expands modelsWithContent to all 62 → 126 routes.
  ...modelRouteEntries,
];
