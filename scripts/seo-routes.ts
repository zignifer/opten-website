// Phase 2 GEO-B-1 / D-03: Per-route metadata manifest (RU only — D-05).
// SYNC: title/description strings duplicated from src/i18n/ru.json — keep both in step until Phase 3 introduces a unified i18n→manifest pipeline.

// Phase 4 D-06 / D-08 / V-10: imports from src/content for HowTo + FAQ schema sources.
// Phase 5 B-01: gptImage2 guide relocated to src/content/blog/ — body shape now wraps
// intro/steps/faq under `body: { ... }`. URL still /guides/gpt-image-2 until B-07.
// This compiles cleanly via vite build --ssr; the deep imports resolve at SSR-bundle time.
import { post as gptImage2Guide } from "../src/content/blog/gpt-image-2";
import { post as aiFaceSwapGuide } from "../src/content/blog/ai-face-swap";
import { post as flux2PromptsGuide } from "../src/content/blog/flux-2-prompts";
import { post as kling3PromptsGuide } from "../src/content/blog/kling-3-prompts";
import { post as aiInfluencerGuide } from "../src/content/blog/ai-influencer";
import { post as seedance20PromptsGuide } from "../src/content/blog/seedance-2-0-prompts";
import { post as promptExamplesGuide } from "../src/content/blog/prompt-examples";
import { post as bestAiVideo2026Guide } from "../src/content/blog/best-ai-video-2026";
import { post as consistentCharacterAiGuide } from "../src/content/blog/consistent-character-ai";
import { post as imageToVideoGuide } from "../src/content/blog/image-to-video";
import { post as negativePromptGuide } from "../src/content/blog/negative-prompt";
import { post as nanoBananaPromptsGuide } from "../src/content/blog/nano-banana-prompts";
import { post as promptStructureGuide } from "../src/content/blog/prompt-structure";
import { post as sora2VsVeo31Guide } from "../src/content/blog/sora-2-vs-veo-3-1";
import { post as aiLogoGeneratorPromptGuide } from "../src/content/blog/ai-logo-generator-prompt";
import { landingFaq } from "../src/content/landingFaq";
// Phase v2.0 MODELS-A-6: programmatic model pages. allModels is the registry +
// content barrel. Only models with `content !== undefined` produce a route in
// the loop below — in Phase 1 that's only the manual gpt-image-2 reference;
// Phase 2 fills the rest.
import { allModels, HUB_HIDDEN_SLUGS } from "../src/content/models";
import { metaField } from "../src/content/models/metaEn";
import type { ModelContent, ModelEntry, ModelMeta } from "../src/content/models/types";
import {
  featuredLearnLesson,
  getLearnLessonCategoryLabel,
  getLearnLessonDescription,
  getLearnLessonOutcomes,
  getLearnLessonSeoDescription,
  getLearnLessonSeoTitle,
  getLearnLessonTitle,
  getLearnLessonTopics,
  getLearnLessonVideoProvider,
  learnHubFaq,
  publicLearnLessons,
  type LearnLang,
  type LearnLesson,
} from "../src/content/space/learn";

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
// previously not linked in sameAs (audit CR-2). Public about copy now positions Vlad as a
// multi-platform AI creator across Instagram, Telegram, YouTube, TikTok and VK.
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
  description: "Opten — Chrome-расширение для генерации, AI-оценки и улучшения промптов под 60+ моделей генерации изображений и видео (Midjourney, GPT Image 2, Kling 3.0, Veo 3.1, Seedance и др.).",
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
    "Opten is a Chrome extension that generates, scores and improves prompts in one click across 60+ image and video generation models (Midjourney, GPT Image 2, Kling 3.0, Veo 3.1, Seedance, etc.).",
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
  description: "Chrome extension that generates, scores and rewrites AI prompts for 60+ image and video generation models (Midjourney, GPT Image 2, Kling 3.0, Veo 3.1, Seedance, Nano Banana, Flux, Imagen) in one click directly inside the generator's UI.",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome",
  softwareVersion: "1.4.1",
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
  description: "AI-блогер и веб-дизайнер, автор Chrome-расширения Opten для оценки промптов под конкретные AI-модели.",
  knowsAbout: [
    "AI image generation",
    "Prompt engineering",
    "Midjourney",
    "GPT Image 2",
    "Kling 3.0",
    "Veo 3.1",
    "Seedance",
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
    ? "Каталог из 60+ AI-моделей генерации изображений и видео, в которых работает Opten: Midjourney, Kling 3.0, Veo 3.1, Seedance, Flux, Imagen и др."
    : "Catalog of 60+ AI image and video models supported by Opten: Midjourney, Kling 3.0, Veo 3.1, Seedance, Flux, Imagen, and more.";
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

function absoluteAssetUrl(path: string): string {
  return path.startsWith("http://") || path.startsWith("https://") ? path : `${SITE_ORIGIN}${path}`;
}

function learnOgImageUrl(lesson: LearnLesson): string {
  return `${SITE_ORIGIN}/assets/learn/og/${lesson.slug}.jpg`;
}

function learnHubRoute(lang: LearnLang): RouteMeta {
  const path = lang === "ru" ? "/learn" : "/en/learn";
  const ruUrl = `${SITE_ORIGIN}/learn`;
  const enUrl = `${SITE_ORIGIN}/en/learn`;
  const pageUrl = lang === "ru" ? ruUrl : enUrl;
  const inLanguage = lang === "ru" ? "ru-RU" : "en-US";
  const homeName = lang === "ru" ? "Главная" : "Home";
  const learnName = lang === "ru" ? "Курсы" : "Courses";
  const title = lang === "ru"
    ? "Курсы по нейросетям и ИИ: AI-видео, дизайн, вайб-кодинг | Opten"
    : "AI Courses & Tutorials: Vibe Coding, Web Design and AI Video | Opten";
  const description = lang === "ru"
    ? "Бесплатное обучение ИИ и нейросетям от Opten: уроки по AI-видео, веб-дизайну в Figma, вайб-кодингу и промптам. Практические разборы Влада Воронежцева."
    : "Free AI courses and tutorials from Opten: learn AI, vibe coding, Figma web design, AI video, prompt engineering and practical AI workflows with Vlad Voronezhtsev.";

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
    ogImage: learnOgImageUrl(featuredLearnLesson),
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "weekly",
    priority: 0.85,
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
        publicLearnLessons.map((lesson) => ({
          url: lang === "ru" ? `${SITE_ORIGIN}/learn/${lesson.slug}` : `${SITE_ORIGIN}/en/learn/${lesson.slug}`,
          name: getLearnLessonTitle(lesson, lang),
          datePublished: lesson.publishedAt,
        })),
        pageUrl,
      ),
      webPageBlock({
        pageId: pageUrl,
        url: pageUrl,
        name: title,
        inLanguage,
        cssSelector: ["h1", "h2", ".learn-intro", ".learn-faq-question", ".learn-faq-answer"],
        about: SOFTWARE_APP_REF,
      }),
      faqPageBlock(learnHubFaq[lang], pageUrl),
      breadcrumbBlock(
        [
          { name: homeName, url: lang === "ru" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/en/` },
          { name: learnName, url: pageUrl },
        ],
        pageUrl,
      ),
    ],
  };
}

function learningResourceBlock(lesson: LearnLesson, lang: LearnLang, pageUrl: string, inLanguage: "ru-RU" | "en-US"): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${pageUrl}#learning-resource`,
    name: getLearnLessonTitle(lesson, lang),
    description: getLearnLessonDescription(lesson, lang),
    inLanguage,
    author: PERSON_FOUNDER_REF,
    provider: ORG_REF,
    publisher: ORG_REF,
    learningResourceType: "Video lesson",
    educationalLevel: lang === "ru" ? "Начальный и средний уровень" : "Beginner to intermediate",
    teaches: getLearnLessonOutcomes(lesson, lang),
    keywords: getLearnLessonTopics(lesson, lang).join(", "),
    timeRequired: lesson.durationIso,
    datePublished: lesson.publishedAt,
    dateModified: lesson.updatedAt,
    isAccessibleForFree: lesson.access === "free",
    mainEntityOfPage: pageUrl,
  };
}

function videoObjectBlock(lesson: LearnLesson, lang: LearnLang, pageUrl: string, inLanguage: "ru-RU" | "en-US"): SchemaBlock {
  const provider = getLearnLessonVideoProvider(lesson);
  const block: SchemaBlock = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${pageUrl}#video`,
    name: getLearnLessonTitle(lesson, lang),
    description: getLearnLessonDescription(lesson, lang),
    thumbnailUrl: [absoluteAssetUrl(lesson.thumbnailPath)],
    uploadDate: lesson.publishedAt,
    duration: lesson.durationIso,
    inLanguage,
    author: PERSON_FOUNDER_REF,
    publisher: ORG_REF,
    isPartOf: { "@id": `${pageUrl}#learning-resource` },
  };

  if (provider.provider === "local") {
    block.contentUrl = provider.contentUrl ?? absoluteAssetUrl(lesson.localVideo?.src ?? lesson.thumbnailPath);
  } else {
    block.embedUrl = `https://www.youtube-nocookie.com/embed/${provider.providerAssetId}`;
  }

  return block;
}

function buildLearnLessonRoute(lesson: LearnLesson, lang: LearnLang): RouteMeta {
  const path = lang === "ru" ? `/learn/${lesson.slug}` : `/en/learn/${lesson.slug}`;
  const ruUrl = `${SITE_ORIGIN}/learn/${lesson.slug}`;
  const enUrl = `${SITE_ORIGIN}/en/learn/${lesson.slug}`;
  const pageUrl = lang === "ru" ? ruUrl : enUrl;
  const inLanguage = lang === "ru" ? "ru-RU" : "en-US";
  const homeName = lang === "ru" ? "Главная" : "Home";
  const learnName = lang === "ru" ? "Курсы" : "Courses";
  const title = getLearnLessonSeoTitle(lesson, lang);
  const description = getLearnLessonSeoDescription(lesson, lang);

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
    ogImage: learnOgImageUrl(lesson),
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.75,
    schema: [
      lang === "en" ? ORG_BLOCK_EN : ORG_BLOCK,
      WEBSITE_BLOCK,
      learningResourceBlock(lesson, lang, pageUrl, inLanguage),
      videoObjectBlock(lesson, lang, pageUrl, inLanguage),
      articleBlock({
        pageId: pageUrl,
        type: "TechArticle",
        headline: getLearnLessonTitle(lesson, lang),
        description,
        datePublished: lesson.publishedAt,
        dateModified: lesson.updatedAt,
        inLanguage,
        articleSection: getLearnLessonCategoryLabel(lesson, lang),
        image: absoluteAssetUrl(lesson.thumbnailPath),
      }),
      webPageBlock({
        pageId: pageUrl,
        url: pageUrl,
        name: title,
        inLanguage,
        cssSelector: ["h1", "h2"],
        about: SOFTWARE_APP_REF,
      }),
      breadcrumbBlock(
        [
          { name: homeName, url: lang === "ru" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/en/` },
          { name: learnName, url: lang === "ru" ? `${SITE_ORIGIN}/learn` : `${SITE_ORIGIN}/en/learn` },
          { name: getLearnLessonTitle(lesson, lang), url: pageUrl },
        ],
        pageUrl,
      ),
    ],
  };
}

const learnRouteEntries: RouteMeta[] = [
  learnHubRoute("ru"),
  learnHubRoute("en"),
  ...publicLearnLessons.flatMap((lesson) => [
    buildLearnLessonRoute(lesson, "ru"),
    buildLearnLessonRoute(lesson, "en"),
  ]),
];

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
    description: "Opten — личный проект Влада Воронежцева, AI-блогера, веб-дизайнера и автора Chrome-расширения для оценки промптов. История, контакты, реквизиты.",
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
        description: "Opten — личный проект Влада Воронежцева, AI-блогера, веб-дизайнера и автора Chrome-расширения для оценки промптов.",
        datePublished: "2026-05-17",
        dateModified: "2026-05-31",
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
          { url: `${SITE_ORIGIN}/blog/flux-2-prompts`, name: flux2PromptsGuide.ru.title, datePublished: flux2PromptsGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/kling-3-prompts`, name: kling3PromptsGuide.ru.title, datePublished: kling3PromptsGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/ai-influencer`, name: aiInfluencerGuide.ru.title, datePublished: aiInfluencerGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/prompt-examples`, name: promptExamplesGuide.ru.title, datePublished: promptExamplesGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`, name: seedance20PromptsGuide.ru.title, datePublished: seedance20PromptsGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/ai-face-swap`, name: aiFaceSwapGuide.ru.title, datePublished: aiFaceSwapGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/best-ai-video-2026`, name: bestAiVideo2026Guide.ru.title, datePublished: bestAiVideo2026Guide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`, name: sora2VsVeo31Guide.ru.title, datePublished: sora2VsVeo31Guide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`, name: aiLogoGeneratorPromptGuide.ru.title, datePublished: aiLogoGeneratorPromptGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/nano-banana-prompts`, name: nanoBananaPromptsGuide.ru.title, datePublished: nanoBananaPromptsGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/consistent-character-ai`, name: consistentCharacterAiGuide.ru.title, datePublished: consistentCharacterAiGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/prompt-structure`, name: promptStructureGuide.ru.title, datePublished: promptStructureGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/negative-prompt`, name: negativePromptGuide.ru.title, datePublished: negativePromptGuide.ru.publishedAt },
          { url: `${SITE_ORIGIN}/blog/image-to-video`, name: imageToVideoGuide.ru.title, datePublished: imageToVideoGuide.ru.publishedAt },
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

  // Daily blog automation: /blog/flux-2-prompts — Flux 2 prompt structure guide.
  {
    path: "/blog/flux-2-prompts",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/flux-2-prompts`,
      en: `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/flux-2-prompts`,
    },
    title: flux2PromptsGuide.ru.title,
    description: flux2PromptsGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/flux-2-prompts`,
    ogTitle: flux2PromptsGuide.ru.title,
    ogDescription: flux2PromptsGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${flux2PromptsGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/flux-2-prompts`,
        headline: flux2PromptsGuide.ru.title,
        description: flux2PromptsGuide.ru.description,
        datePublished: flux2PromptsGuide.ru.publishedAt,
        dateModified: flux2PromptsGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: flux2PromptsGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${flux2PromptsGuide.ru.cover.src}`,
          width: flux2PromptsGuide.ru.cover.width,
          height: flux2PromptsGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/flux-2-prompts`,
        url: `${SITE_ORIGIN}/blog/flux-2-prompts`,
        name: flux2PromptsGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (flux2PromptsGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/flux-2-prompts`,
        flux2PromptsGuide.ru.title,
      ),
      faqPageBlock(flux2PromptsGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/flux-2-prompts`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: flux2PromptsGuide.ru.title, url: `${SITE_ORIGIN}/blog/flux-2-prompts` },
        ],
        `${SITE_ORIGIN}/blog/flux-2-prompts`,
      ),
    ],
  },

  // Daily blog automation: /blog/kling-3-prompts — Kling 3.0 prompt control guide.
  {
    path: "/blog/kling-3-prompts",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/kling-3-prompts`,
      en: `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/kling-3-prompts`,
    },
    title: kling3PromptsGuide.ru.title,
    description: kling3PromptsGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/kling-3-prompts`,
    ogTitle: kling3PromptsGuide.ru.title,
    ogDescription: kling3PromptsGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${kling3PromptsGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/kling-3-prompts`,
        headline: kling3PromptsGuide.ru.title,
        description: kling3PromptsGuide.ru.description,
        datePublished: kling3PromptsGuide.ru.publishedAt,
        dateModified: kling3PromptsGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: kling3PromptsGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${kling3PromptsGuide.ru.cover.src}`,
          width: kling3PromptsGuide.ru.cover.width,
          height: kling3PromptsGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/kling-3-prompts`,
        url: `${SITE_ORIGIN}/blog/kling-3-prompts`,
        name: kling3PromptsGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (kling3PromptsGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/kling-3-prompts`,
        kling3PromptsGuide.ru.title,
      ),
      faqPageBlock(kling3PromptsGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/kling-3-prompts`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: kling3PromptsGuide.ru.title, url: `${SITE_ORIGIN}/blog/kling-3-prompts` },
        ],
        `${SITE_ORIGIN}/blog/kling-3-prompts`,
      ),
    ],
  },

  // Daily blog automation: /blog/ai-influencer — consistent AI influencer workflow guide.
  {
    path: "/blog/ai-influencer",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/ai-influencer`,
      en: `${SITE_ORIGIN}/en/blog/ai-influencer`,
      xDefault: `${SITE_ORIGIN}/blog/ai-influencer`,
    },
    title: aiInfluencerGuide.ru.title,
    description: aiInfluencerGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/ai-influencer`,
    ogTitle: aiInfluencerGuide.ru.title,
    ogDescription: aiInfluencerGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${aiInfluencerGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/ai-influencer`,
        headline: aiInfluencerGuide.ru.title,
        description: aiInfluencerGuide.ru.description,
        datePublished: aiInfluencerGuide.ru.publishedAt,
        dateModified: aiInfluencerGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: aiInfluencerGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${aiInfluencerGuide.ru.cover.src}`,
          width: aiInfluencerGuide.ru.cover.width,
          height: aiInfluencerGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/ai-influencer`,
        url: `${SITE_ORIGIN}/blog/ai-influencer`,
        name: aiInfluencerGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (aiInfluencerGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/ai-influencer`,
        aiInfluencerGuide.ru.title,
      ),
      faqPageBlock(aiInfluencerGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/ai-influencer`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: aiInfluencerGuide.ru.title, url: `${SITE_ORIGIN}/blog/ai-influencer` },
        ],
        `${SITE_ORIGIN}/blog/ai-influencer`,
      ),
    ],
  },

  // Daily blog automation: /blog/prompt-examples — prompt examples adaptation guide.
  {
    path: "/blog/prompt-examples",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/prompt-examples`,
      en: `${SITE_ORIGIN}/en/blog/prompt-examples`,
      xDefault: `${SITE_ORIGIN}/blog/prompt-examples`,
    },
    title: promptExamplesGuide.ru.title,
    description: promptExamplesGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/prompt-examples`,
    ogTitle: promptExamplesGuide.ru.title,
    ogDescription: promptExamplesGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${promptExamplesGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/prompt-examples`,
        headline: promptExamplesGuide.ru.title,
        description: promptExamplesGuide.ru.description,
        datePublished: promptExamplesGuide.ru.publishedAt,
        dateModified: promptExamplesGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: promptExamplesGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${promptExamplesGuide.ru.cover.src}`,
          width: promptExamplesGuide.ru.cover.width,
          height: promptExamplesGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/prompt-examples`,
        url: `${SITE_ORIGIN}/blog/prompt-examples`,
        name: promptExamplesGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (promptExamplesGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/prompt-examples`,
        promptExamplesGuide.ru.title,
      ),
      faqPageBlock(promptExamplesGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/prompt-examples`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: promptExamplesGuide.ru.title, url: `${SITE_ORIGIN}/blog/prompt-examples` },
        ],
        `${SITE_ORIGIN}/blog/prompt-examples`,
      ),
    ],
  },

  // Daily blog automation: /blog/seedance-2-0-prompts — Seedance 2.0 prompt structure guide.
  {
    path: "/blog/seedance-2-0-prompts",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
      en: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
    },
    title: seedance20PromptsGuide.ru.title,
    description: seedance20PromptsGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
    ogTitle: seedance20PromptsGuide.ru.title,
    ogDescription: seedance20PromptsGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${seedance20PromptsGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
        headline: seedance20PromptsGuide.ru.title,
        description: seedance20PromptsGuide.ru.description,
        datePublished: seedance20PromptsGuide.ru.publishedAt,
        dateModified: seedance20PromptsGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: seedance20PromptsGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${seedance20PromptsGuide.ru.cover.src}`,
          width: seedance20PromptsGuide.ru.cover.width,
          height: seedance20PromptsGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
        url: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
        name: seedance20PromptsGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (seedance20PromptsGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
        seedance20PromptsGuide.ru.title,
      ),
      faqPageBlock(seedance20PromptsGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/seedance-2-0-prompts`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: seedance20PromptsGuide.ru.title, url: `${SITE_ORIGIN}/blog/seedance-2-0-prompts` },
        ],
        `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
      ),
    ],
  },

  // Daily blog automation: /blog/ai-face-swap — AI face swap quality-control guide.
  {
    path: "/blog/ai-face-swap",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/ai-face-swap`,
      en: `${SITE_ORIGIN}/en/blog/ai-face-swap`,
      xDefault: `${SITE_ORIGIN}/blog/ai-face-swap`,
    },
    title: aiFaceSwapGuide.ru.title,
    description: aiFaceSwapGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/ai-face-swap`,
    ogTitle: aiFaceSwapGuide.ru.title,
    ogDescription: aiFaceSwapGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${aiFaceSwapGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/ai-face-swap`,
        headline: aiFaceSwapGuide.ru.title,
        description: aiFaceSwapGuide.ru.description,
        datePublished: aiFaceSwapGuide.ru.publishedAt,
        dateModified: aiFaceSwapGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: aiFaceSwapGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${aiFaceSwapGuide.ru.cover.src}`,
          width: aiFaceSwapGuide.ru.cover.width,
          height: aiFaceSwapGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/ai-face-swap`,
        url: `${SITE_ORIGIN}/blog/ai-face-swap`,
        name: aiFaceSwapGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (aiFaceSwapGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/ai-face-swap`,
        aiFaceSwapGuide.ru.title,
      ),
      faqPageBlock(aiFaceSwapGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/ai-face-swap`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: aiFaceSwapGuide.ru.title, url: `${SITE_ORIGIN}/blog/ai-face-swap` },
        ],
        `${SITE_ORIGIN}/blog/ai-face-swap`,
      ),
    ],
  },

  // Daily blog automation: /blog/best-ai-video-2026 — best AI video generator comparison.
  {
    path: "/blog/best-ai-video-2026",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
      en: `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
      xDefault: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
    },
    title: bestAiVideo2026Guide.ru.title,
    description: bestAiVideo2026Guide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
    ogTitle: bestAiVideo2026Guide.ru.title,
    ogDescription: bestAiVideo2026Guide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${bestAiVideo2026Guide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
        headline: bestAiVideo2026Guide.ru.title,
        description: bestAiVideo2026Guide.ru.description,
        datePublished: bestAiVideo2026Guide.ru.publishedAt,
        dateModified: bestAiVideo2026Guide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: bestAiVideo2026Guide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${bestAiVideo2026Guide.ru.cover.src}`,
          width: bestAiVideo2026Guide.ru.cover.width,
          height: bestAiVideo2026Guide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
        url: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
        name: bestAiVideo2026Guide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (bestAiVideo2026Guide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/best-ai-video-2026`,
        bestAiVideo2026Guide.ru.title,
      ),
      faqPageBlock(bestAiVideo2026Guide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/best-ai-video-2026`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: bestAiVideo2026Guide.ru.title, url: `${SITE_ORIGIN}/blog/best-ai-video-2026` },
        ],
        `${SITE_ORIGIN}/blog/best-ai-video-2026`,
      ),
    ],
  },

  // Daily blog automation: /blog/sora-2-vs-veo-3-1 — Sora 2 vs Veo 3.1 comparison.
  {
    path: "/blog/sora-2-vs-veo-3-1",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
      en: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
      xDefault: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
    },
    title: sora2VsVeo31Guide.ru.title,
    description: sora2VsVeo31Guide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
    ogTitle: sora2VsVeo31Guide.ru.title,
    ogDescription: sora2VsVeo31Guide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${sora2VsVeo31Guide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
        headline: sora2VsVeo31Guide.ru.title,
        description: sora2VsVeo31Guide.ru.description,
        datePublished: sora2VsVeo31Guide.ru.publishedAt,
        dateModified: sora2VsVeo31Guide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: sora2VsVeo31Guide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${sora2VsVeo31Guide.ru.cover.src}`,
          width: sora2VsVeo31Guide.ru.cover.width,
          height: sora2VsVeo31Guide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
        url: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
        name: sora2VsVeo31Guide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (sora2VsVeo31Guide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
        sora2VsVeo31Guide.ru.title,
      ),
      faqPageBlock(sora2VsVeo31Guide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: sora2VsVeo31Guide.ru.title, url: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1` },
        ],
        `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
      ),
    ],
  },

  // Daily blog automation: /blog/ai-logo-generator-prompt — AI logo generator prompting guide.
  {
    path: "/blog/ai-logo-generator-prompt",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
      en: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
      xDefault: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
    },
    title: aiLogoGeneratorPromptGuide.ru.title,
    description: aiLogoGeneratorPromptGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
    ogTitle: aiLogoGeneratorPromptGuide.ru.title,
    ogDescription: aiLogoGeneratorPromptGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${aiLogoGeneratorPromptGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
        headline: aiLogoGeneratorPromptGuide.ru.title,
        description: aiLogoGeneratorPromptGuide.ru.description,
        datePublished: aiLogoGeneratorPromptGuide.ru.publishedAt,
        dateModified: aiLogoGeneratorPromptGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: aiLogoGeneratorPromptGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${aiLogoGeneratorPromptGuide.ru.cover.src}`,
          width: aiLogoGeneratorPromptGuide.ru.cover.width,
          height: aiLogoGeneratorPromptGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
        url: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
        name: aiLogoGeneratorPromptGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (aiLogoGeneratorPromptGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
        aiLogoGeneratorPromptGuide.ru.title,
      ),
      faqPageBlock(aiLogoGeneratorPromptGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: aiLogoGeneratorPromptGuide.ru.title, url: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt` },
        ],
        `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
      ),
    ],
  },

  // Daily blog automation: /blog/nano-banana-prompts — Nano Banana Pro prompting guide.
  {
    path: "/blog/nano-banana-prompts",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
      en: `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
    },
    title: nanoBananaPromptsGuide.ru.title,
    description: nanoBananaPromptsGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
    ogTitle: nanoBananaPromptsGuide.ru.title,
    ogDescription: nanoBananaPromptsGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${nanoBananaPromptsGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
        headline: nanoBananaPromptsGuide.ru.title,
        description: nanoBananaPromptsGuide.ru.description,
        datePublished: nanoBananaPromptsGuide.ru.publishedAt,
        dateModified: nanoBananaPromptsGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: nanoBananaPromptsGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${nanoBananaPromptsGuide.ru.cover.src}`,
          width: nanoBananaPromptsGuide.ru.cover.width,
          height: nanoBananaPromptsGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
        url: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
        name: nanoBananaPromptsGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (nanoBananaPromptsGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/nano-banana-prompts`,
        nanoBananaPromptsGuide.ru.title,
      ),
      faqPageBlock(nanoBananaPromptsGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/nano-banana-prompts`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: nanoBananaPromptsGuide.ru.title, url: `${SITE_ORIGIN}/blog/nano-banana-prompts` },
        ],
        `${SITE_ORIGIN}/blog/nano-banana-prompts`,
      ),
    ],
  },

  // Daily blog automation: /blog/prompt-structure — prompt-engineering deep dive.
  {
    path: "/blog/prompt-structure",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/prompt-structure`,
      en: `${SITE_ORIGIN}/en/blog/prompt-structure`,
      xDefault: `${SITE_ORIGIN}/blog/prompt-structure`,
    },
    title: promptStructureGuide.ru.title,
    description: promptStructureGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/prompt-structure`,
    ogTitle: promptStructureGuide.ru.title,
    ogDescription: promptStructureGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${promptStructureGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/prompt-structure`,
        headline: promptStructureGuide.ru.title,
        description: promptStructureGuide.ru.description,
        datePublished: promptStructureGuide.ru.publishedAt,
        dateModified: promptStructureGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: promptStructureGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${promptStructureGuide.ru.cover.src}`,
          width: promptStructureGuide.ru.cover.width,
          height: promptStructureGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/prompt-structure`,
        url: `${SITE_ORIGIN}/blog/prompt-structure`,
        name: promptStructureGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (promptStructureGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/prompt-structure`,
        promptStructureGuide.ru.title,
      ),
      faqPageBlock(promptStructureGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/prompt-structure`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: promptStructureGuide.ru.title, url: `${SITE_ORIGIN}/blog/prompt-structure` },
        ],
        `${SITE_ORIGIN}/blog/prompt-structure`,
      ),
    ],
  },

  // Daily blog automation: /blog/negative-prompt — prompt-engineering guide.
  {
    path: "/blog/negative-prompt",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/negative-prompt`,
      en: `${SITE_ORIGIN}/en/blog/negative-prompt`,
      xDefault: `${SITE_ORIGIN}/blog/negative-prompt`,
    },
    title: negativePromptGuide.ru.title,
    description: negativePromptGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/negative-prompt`,
    ogTitle: negativePromptGuide.ru.title,
    ogDescription: negativePromptGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${negativePromptGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/negative-prompt`,
        headline: negativePromptGuide.ru.title,
        description: negativePromptGuide.ru.description,
        datePublished: negativePromptGuide.ru.publishedAt,
        dateModified: negativePromptGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: negativePromptGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${negativePromptGuide.ru.cover.src}`,
          width: negativePromptGuide.ru.cover.width,
          height: negativePromptGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/negative-prompt`,
        url: `${SITE_ORIGIN}/blog/negative-prompt`,
        name: negativePromptGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (negativePromptGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/negative-prompt`,
        negativePromptGuide.ru.title,
      ),
      faqPageBlock(negativePromptGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/negative-prompt`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: negativePromptGuide.ru.title, url: `${SITE_ORIGIN}/blog/negative-prompt` },
        ],
        `${SITE_ORIGIN}/blog/negative-prompt`,
      ),
    ],
  },

  // Daily blog automation: /blog/consistent-character-ai — evergreen BL-technique guide.
  {
    path: "/blog/consistent-character-ai",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/consistent-character-ai`,
      en: `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
      xDefault: `${SITE_ORIGIN}/blog/consistent-character-ai`,
    },
    title: consistentCharacterAiGuide.ru.title,
    description: consistentCharacterAiGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/consistent-character-ai`,
    ogTitle: consistentCharacterAiGuide.ru.title,
    ogDescription: consistentCharacterAiGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${consistentCharacterAiGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/consistent-character-ai`,
        headline: consistentCharacterAiGuide.ru.title,
        description: consistentCharacterAiGuide.ru.description,
        datePublished: consistentCharacterAiGuide.ru.publishedAt,
        dateModified: consistentCharacterAiGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: consistentCharacterAiGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${consistentCharacterAiGuide.ru.cover.src}`,
          width: consistentCharacterAiGuide.ru.cover.width,
          height: consistentCharacterAiGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/consistent-character-ai`,
        url: `${SITE_ORIGIN}/blog/consistent-character-ai`,
        name: consistentCharacterAiGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (consistentCharacterAiGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/consistent-character-ai`,
        consistentCharacterAiGuide.ru.title,
      ),
      faqPageBlock(consistentCharacterAiGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/consistent-character-ai`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: consistentCharacterAiGuide.ru.title, url: `${SITE_ORIGIN}/blog/consistent-character-ai` },
        ],
        `${SITE_ORIGIN}/blog/consistent-character-ai`,
      ),
    ],
  },

  // Blog automation trial: /blog/image-to-video — first SEO bilingual post from BLOG-AUTOMATION.md.
  {
    path: "/blog/image-to-video",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/image-to-video`,
      en: `${SITE_ORIGIN}/en/blog/image-to-video`,
      xDefault: `${SITE_ORIGIN}/blog/image-to-video`,
    },
    title: imageToVideoGuide.ru.title,
    description: imageToVideoGuide.ru.description,
    canonical: `${SITE_ORIGIN}/blog/image-to-video`,
    ogTitle: imageToVideoGuide.ru.title,
    ogDescription: imageToVideoGuide.ru.excerpt,
    ogImage: `${SITE_ORIGIN}${imageToVideoGuide.ru.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/blog/image-to-video`,
        headline: imageToVideoGuide.ru.title,
        description: imageToVideoGuide.ru.description,
        datePublished: imageToVideoGuide.ru.publishedAt,
        dateModified: imageToVideoGuide.ru.updatedAt,
        inLanguage: "ru-RU",
        articleSection: "Гайд",
        keywords: imageToVideoGuide.ru.tags,
        image: {
          url: `${SITE_ORIGIN}${imageToVideoGuide.ru.cover.src}`,
          width: imageToVideoGuide.ru.cover.width,
          height: imageToVideoGuide.ru.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/blog/image-to-video`,
        url: `${SITE_ORIGIN}/blog/image-to-video`,
        name: imageToVideoGuide.ru.title,
        inLanguage: "ru-RU",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (imageToVideoGuide.ru.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/blog/image-to-video`,
        imageToVideoGuide.ru.title,
      ),
      faqPageBlock(imageToVideoGuide.ru.body.faq ?? [], `${SITE_ORIGIN}/blog/image-to-video`),
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "Блог", url: `${SITE_ORIGIN}/blog` },
          { name: imageToVideoGuide.ru.title, url: `${SITE_ORIGIN}/blog/image-to-video` },
        ],
        `${SITE_ORIGIN}/blog/image-to-video`,
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
    description: "Opten is a personal project by Vlad Voronezhtsev, AI blogger, web designer and creator of the Chrome extension for prompt scoring. Origin story, contacts, legal details.",
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
        description: "Opten is a personal project by Vlad Voronezhtsev, AI blogger, web designer and creator of the Chrome extension for prompt scoring.",
        datePublished: "2026-05-17",
        dateModified: "2026-05-31",
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
          { url: `${SITE_ORIGIN}/en/blog/flux-2-prompts`, name: flux2PromptsGuide.en.title, datePublished: flux2PromptsGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/kling-3-prompts`, name: kling3PromptsGuide.en.title, datePublished: kling3PromptsGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/ai-influencer`, name: aiInfluencerGuide.en.title, datePublished: aiInfluencerGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/prompt-examples`, name: promptExamplesGuide.en.title, datePublished: promptExamplesGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`, name: seedance20PromptsGuide.en.title, datePublished: seedance20PromptsGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/ai-face-swap`, name: aiFaceSwapGuide.en.title, datePublished: aiFaceSwapGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/best-ai-video-2026`, name: bestAiVideo2026Guide.en.title, datePublished: bestAiVideo2026Guide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`, name: sora2VsVeo31Guide.en.title, datePublished: sora2VsVeo31Guide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`, name: aiLogoGeneratorPromptGuide.en.title, datePublished: aiLogoGeneratorPromptGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/nano-banana-prompts`, name: nanoBananaPromptsGuide.en.title, datePublished: nanoBananaPromptsGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/consistent-character-ai`, name: consistentCharacterAiGuide.en.title, datePublished: consistentCharacterAiGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/prompt-structure`, name: promptStructureGuide.en.title, datePublished: promptStructureGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/negative-prompt`, name: negativePromptGuide.en.title, datePublished: negativePromptGuide.en.publishedAt },
          { url: `${SITE_ORIGIN}/en/blog/image-to-video`, name: imageToVideoGuide.en.title, datePublished: imageToVideoGuide.en.publishedAt },
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

  // Daily blog automation: /en/blog/flux-2-prompts EN sibling.
  {
    path: "/en/blog/flux-2-prompts",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/flux-2-prompts`,
      en: `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/flux-2-prompts`,
    },
    title: flux2PromptsGuide.en.title,
    description: flux2PromptsGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
    ogTitle: flux2PromptsGuide.en.title,
    ogDescription: flux2PromptsGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${flux2PromptsGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
        headline: flux2PromptsGuide.en.title,
        description: flux2PromptsGuide.en.description,
        datePublished: flux2PromptsGuide.en.publishedAt,
        dateModified: flux2PromptsGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: flux2PromptsGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${flux2PromptsGuide.en.cover.src}`,
          width: flux2PromptsGuide.en.cover.width,
          height: flux2PromptsGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
        url: `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
        name: flux2PromptsGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (flux2PromptsGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
        flux2PromptsGuide.en.title,
      ),
      faqPageBlock(flux2PromptsGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/flux-2-prompts`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: flux2PromptsGuide.en.title, url: `${SITE_ORIGIN}/en/blog/flux-2-prompts` },
        ],
        `${SITE_ORIGIN}/en/blog/flux-2-prompts`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/kling-3-prompts EN sibling.
  {
    path: "/en/blog/kling-3-prompts",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/kling-3-prompts`,
      en: `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/kling-3-prompts`,
    },
    title: kling3PromptsGuide.en.title,
    description: kling3PromptsGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
    ogTitle: kling3PromptsGuide.en.title,
    ogDescription: kling3PromptsGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${kling3PromptsGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
        headline: kling3PromptsGuide.en.title,
        description: kling3PromptsGuide.en.description,
        datePublished: kling3PromptsGuide.en.publishedAt,
        dateModified: kling3PromptsGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: kling3PromptsGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${kling3PromptsGuide.en.cover.src}`,
          width: kling3PromptsGuide.en.cover.width,
          height: kling3PromptsGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
        url: `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
        name: kling3PromptsGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (kling3PromptsGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
        kling3PromptsGuide.en.title,
      ),
      faqPageBlock(kling3PromptsGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/kling-3-prompts`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: kling3PromptsGuide.en.title, url: `${SITE_ORIGIN}/en/blog/kling-3-prompts` },
        ],
        `${SITE_ORIGIN}/en/blog/kling-3-prompts`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/ai-influencer EN sibling.
  {
    path: "/en/blog/ai-influencer",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/ai-influencer`,
      en: `${SITE_ORIGIN}/en/blog/ai-influencer`,
      xDefault: `${SITE_ORIGIN}/blog/ai-influencer`,
    },
    title: aiInfluencerGuide.en.title,
    description: aiInfluencerGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/ai-influencer`,
    ogTitle: aiInfluencerGuide.en.title,
    ogDescription: aiInfluencerGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${aiInfluencerGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/ai-influencer`,
        headline: aiInfluencerGuide.en.title,
        description: aiInfluencerGuide.en.description,
        datePublished: aiInfluencerGuide.en.publishedAt,
        dateModified: aiInfluencerGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: aiInfluencerGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${aiInfluencerGuide.en.cover.src}`,
          width: aiInfluencerGuide.en.cover.width,
          height: aiInfluencerGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/ai-influencer`,
        url: `${SITE_ORIGIN}/en/blog/ai-influencer`,
        name: aiInfluencerGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (aiInfluencerGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/ai-influencer`,
        aiInfluencerGuide.en.title,
      ),
      faqPageBlock(aiInfluencerGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/ai-influencer`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: aiInfluencerGuide.en.title, url: `${SITE_ORIGIN}/en/blog/ai-influencer` },
        ],
        `${SITE_ORIGIN}/en/blog/ai-influencer`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/prompt-examples EN sibling.
  {
    path: "/en/blog/prompt-examples",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/prompt-examples`,
      en: `${SITE_ORIGIN}/en/blog/prompt-examples`,
      xDefault: `${SITE_ORIGIN}/blog/prompt-examples`,
    },
    title: promptExamplesGuide.en.title,
    description: promptExamplesGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/prompt-examples`,
    ogTitle: promptExamplesGuide.en.title,
    ogDescription: promptExamplesGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${promptExamplesGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/prompt-examples`,
        headline: promptExamplesGuide.en.title,
        description: promptExamplesGuide.en.description,
        datePublished: promptExamplesGuide.en.publishedAt,
        dateModified: promptExamplesGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: promptExamplesGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${promptExamplesGuide.en.cover.src}`,
          width: promptExamplesGuide.en.cover.width,
          height: promptExamplesGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/prompt-examples`,
        url: `${SITE_ORIGIN}/en/blog/prompt-examples`,
        name: promptExamplesGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (promptExamplesGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/prompt-examples`,
        promptExamplesGuide.en.title,
      ),
      faqPageBlock(promptExamplesGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/prompt-examples`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: promptExamplesGuide.en.title, url: `${SITE_ORIGIN}/en/blog/prompt-examples` },
        ],
        `${SITE_ORIGIN}/en/blog/prompt-examples`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/seedance-2-0-prompts EN sibling.
  {
    path: "/en/blog/seedance-2-0-prompts",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
      en: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/seedance-2-0-prompts`,
    },
    title: seedance20PromptsGuide.en.title,
    description: seedance20PromptsGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
    ogTitle: seedance20PromptsGuide.en.title,
    ogDescription: seedance20PromptsGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${seedance20PromptsGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
        headline: seedance20PromptsGuide.en.title,
        description: seedance20PromptsGuide.en.description,
        datePublished: seedance20PromptsGuide.en.publishedAt,
        dateModified: seedance20PromptsGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: seedance20PromptsGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${seedance20PromptsGuide.en.cover.src}`,
          width: seedance20PromptsGuide.en.cover.width,
          height: seedance20PromptsGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
        url: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
        name: seedance20PromptsGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (seedance20PromptsGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
        seedance20PromptsGuide.en.title,
      ),
      faqPageBlock(seedance20PromptsGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: seedance20PromptsGuide.en.title, url: `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts` },
        ],
        `${SITE_ORIGIN}/en/blog/seedance-2-0-prompts`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/ai-face-swap EN sibling.
  {
    path: "/en/blog/ai-face-swap",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/ai-face-swap`,
      en: `${SITE_ORIGIN}/en/blog/ai-face-swap`,
      xDefault: `${SITE_ORIGIN}/blog/ai-face-swap`,
    },
    title: aiFaceSwapGuide.en.title,
    description: aiFaceSwapGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/ai-face-swap`,
    ogTitle: aiFaceSwapGuide.en.title,
    ogDescription: aiFaceSwapGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${aiFaceSwapGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/ai-face-swap`,
        headline: aiFaceSwapGuide.en.title,
        description: aiFaceSwapGuide.en.description,
        datePublished: aiFaceSwapGuide.en.publishedAt,
        dateModified: aiFaceSwapGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: aiFaceSwapGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${aiFaceSwapGuide.en.cover.src}`,
          width: aiFaceSwapGuide.en.cover.width,
          height: aiFaceSwapGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/ai-face-swap`,
        url: `${SITE_ORIGIN}/en/blog/ai-face-swap`,
        name: aiFaceSwapGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (aiFaceSwapGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/ai-face-swap`,
        aiFaceSwapGuide.en.title,
      ),
      faqPageBlock(aiFaceSwapGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/ai-face-swap`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: aiFaceSwapGuide.en.title, url: `${SITE_ORIGIN}/en/blog/ai-face-swap` },
        ],
        `${SITE_ORIGIN}/en/blog/ai-face-swap`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/best-ai-video-2026 EN sibling.
  {
    path: "/en/blog/best-ai-video-2026",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
      en: `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
      xDefault: `${SITE_ORIGIN}/blog/best-ai-video-2026`,
    },
    title: bestAiVideo2026Guide.en.title,
    description: bestAiVideo2026Guide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
    ogTitle: bestAiVideo2026Guide.en.title,
    ogDescription: bestAiVideo2026Guide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${bestAiVideo2026Guide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
        headline: bestAiVideo2026Guide.en.title,
        description: bestAiVideo2026Guide.en.description,
        datePublished: bestAiVideo2026Guide.en.publishedAt,
        dateModified: bestAiVideo2026Guide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: bestAiVideo2026Guide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${bestAiVideo2026Guide.en.cover.src}`,
          width: bestAiVideo2026Guide.en.cover.width,
          height: bestAiVideo2026Guide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
        url: `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
        name: bestAiVideo2026Guide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (bestAiVideo2026Guide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
        bestAiVideo2026Guide.en.title,
      ),
      faqPageBlock(bestAiVideo2026Guide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/best-ai-video-2026`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: bestAiVideo2026Guide.en.title, url: `${SITE_ORIGIN}/en/blog/best-ai-video-2026` },
        ],
        `${SITE_ORIGIN}/en/blog/best-ai-video-2026`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/sora-2-vs-veo-3-1 EN sibling.
  {
    path: "/en/blog/sora-2-vs-veo-3-1",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
      en: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
      xDefault: `${SITE_ORIGIN}/blog/sora-2-vs-veo-3-1`,
    },
    title: sora2VsVeo31Guide.en.title,
    description: sora2VsVeo31Guide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
    ogTitle: sora2VsVeo31Guide.en.title,
    ogDescription: sora2VsVeo31Guide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${sora2VsVeo31Guide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
        headline: sora2VsVeo31Guide.en.title,
        description: sora2VsVeo31Guide.en.description,
        datePublished: sora2VsVeo31Guide.en.publishedAt,
        dateModified: sora2VsVeo31Guide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: sora2VsVeo31Guide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${sora2VsVeo31Guide.en.cover.src}`,
          width: sora2VsVeo31Guide.en.cover.width,
          height: sora2VsVeo31Guide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
        url: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
        name: sora2VsVeo31Guide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (sora2VsVeo31Guide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
        sora2VsVeo31Guide.en.title,
      ),
      faqPageBlock(sora2VsVeo31Guide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: sora2VsVeo31Guide.en.title, url: `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1` },
        ],
        `${SITE_ORIGIN}/en/blog/sora-2-vs-veo-3-1`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/ai-logo-generator-prompt EN sibling.
  {
    path: "/en/blog/ai-logo-generator-prompt",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
      en: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
      xDefault: `${SITE_ORIGIN}/blog/ai-logo-generator-prompt`,
    },
    title: aiLogoGeneratorPromptGuide.en.title,
    description: aiLogoGeneratorPromptGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
    ogTitle: aiLogoGeneratorPromptGuide.en.title,
    ogDescription: aiLogoGeneratorPromptGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${aiLogoGeneratorPromptGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
        headline: aiLogoGeneratorPromptGuide.en.title,
        description: aiLogoGeneratorPromptGuide.en.description,
        datePublished: aiLogoGeneratorPromptGuide.en.publishedAt,
        dateModified: aiLogoGeneratorPromptGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: aiLogoGeneratorPromptGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${aiLogoGeneratorPromptGuide.en.cover.src}`,
          width: aiLogoGeneratorPromptGuide.en.cover.width,
          height: aiLogoGeneratorPromptGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
        url: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
        name: aiLogoGeneratorPromptGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (aiLogoGeneratorPromptGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
        aiLogoGeneratorPromptGuide.en.title,
      ),
      faqPageBlock(aiLogoGeneratorPromptGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: aiLogoGeneratorPromptGuide.en.title, url: `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt` },
        ],
        `${SITE_ORIGIN}/en/blog/ai-logo-generator-prompt`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/nano-banana-prompts EN sibling.
  {
    path: "/en/blog/nano-banana-prompts",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
      en: `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
      xDefault: `${SITE_ORIGIN}/blog/nano-banana-prompts`,
    },
    title: nanoBananaPromptsGuide.en.title,
    description: nanoBananaPromptsGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
    ogTitle: nanoBananaPromptsGuide.en.title,
    ogDescription: nanoBananaPromptsGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${nanoBananaPromptsGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
        headline: nanoBananaPromptsGuide.en.title,
        description: nanoBananaPromptsGuide.en.description,
        datePublished: nanoBananaPromptsGuide.en.publishedAt,
        dateModified: nanoBananaPromptsGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: nanoBananaPromptsGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${nanoBananaPromptsGuide.en.cover.src}`,
          width: nanoBananaPromptsGuide.en.cover.width,
          height: nanoBananaPromptsGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
        url: `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
        name: nanoBananaPromptsGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (nanoBananaPromptsGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
        nanoBananaPromptsGuide.en.title,
      ),
      faqPageBlock(nanoBananaPromptsGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/nano-banana-prompts`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: nanoBananaPromptsGuide.en.title, url: `${SITE_ORIGIN}/en/blog/nano-banana-prompts` },
        ],
        `${SITE_ORIGIN}/en/blog/nano-banana-prompts`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/prompt-structure EN sibling.
  {
    path: "/en/blog/prompt-structure",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/prompt-structure`,
      en: `${SITE_ORIGIN}/en/blog/prompt-structure`,
      xDefault: `${SITE_ORIGIN}/blog/prompt-structure`,
    },
    title: promptStructureGuide.en.title,
    description: promptStructureGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/prompt-structure`,
    ogTitle: promptStructureGuide.en.title,
    ogDescription: promptStructureGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${promptStructureGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/prompt-structure`,
        headline: promptStructureGuide.en.title,
        description: promptStructureGuide.en.description,
        datePublished: promptStructureGuide.en.publishedAt,
        dateModified: promptStructureGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: promptStructureGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${promptStructureGuide.en.cover.src}`,
          width: promptStructureGuide.en.cover.width,
          height: promptStructureGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/prompt-structure`,
        url: `${SITE_ORIGIN}/en/blog/prompt-structure`,
        name: promptStructureGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (promptStructureGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/prompt-structure`,
        promptStructureGuide.en.title,
      ),
      faqPageBlock(promptStructureGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/prompt-structure`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: promptStructureGuide.en.title, url: `${SITE_ORIGIN}/en/blog/prompt-structure` },
        ],
        `${SITE_ORIGIN}/en/blog/prompt-structure`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/negative-prompt EN sibling.
  {
    path: "/en/blog/negative-prompt",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/negative-prompt`,
      en: `${SITE_ORIGIN}/en/blog/negative-prompt`,
      xDefault: `${SITE_ORIGIN}/blog/negative-prompt`,
    },
    title: negativePromptGuide.en.title,
    description: negativePromptGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/negative-prompt`,
    ogTitle: negativePromptGuide.en.title,
    ogDescription: negativePromptGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${negativePromptGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/negative-prompt`,
        headline: negativePromptGuide.en.title,
        description: negativePromptGuide.en.description,
        datePublished: negativePromptGuide.en.publishedAt,
        dateModified: negativePromptGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: negativePromptGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${negativePromptGuide.en.cover.src}`,
          width: negativePromptGuide.en.cover.width,
          height: negativePromptGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/negative-prompt`,
        url: `${SITE_ORIGIN}/en/blog/negative-prompt`,
        name: negativePromptGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (negativePromptGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/negative-prompt`,
        negativePromptGuide.en.title,
      ),
      faqPageBlock(negativePromptGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/negative-prompt`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: negativePromptGuide.en.title, url: `${SITE_ORIGIN}/en/blog/negative-prompt` },
        ],
        `${SITE_ORIGIN}/en/blog/negative-prompt`,
      ),
    ],
  },

  // Daily blog automation: /en/blog/consistent-character-ai EN sibling. Mirrors /blog/consistent-character-ai.
  {
    path: "/en/blog/consistent-character-ai",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/consistent-character-ai`,
      en: `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
      xDefault: `${SITE_ORIGIN}/blog/consistent-character-ai`,
    },
    title: consistentCharacterAiGuide.en.title,
    description: consistentCharacterAiGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
    ogTitle: consistentCharacterAiGuide.en.title,
    ogDescription: consistentCharacterAiGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${consistentCharacterAiGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
        headline: consistentCharacterAiGuide.en.title,
        description: consistentCharacterAiGuide.en.description,
        datePublished: consistentCharacterAiGuide.en.publishedAt,
        dateModified: consistentCharacterAiGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: consistentCharacterAiGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${consistentCharacterAiGuide.en.cover.src}`,
          width: consistentCharacterAiGuide.en.cover.width,
          height: consistentCharacterAiGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
        url: `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
        name: consistentCharacterAiGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (consistentCharacterAiGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
        consistentCharacterAiGuide.en.title,
      ),
      faqPageBlock(consistentCharacterAiGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/consistent-character-ai`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: consistentCharacterAiGuide.en.title, url: `${SITE_ORIGIN}/en/blog/consistent-character-ai` },
        ],
        `${SITE_ORIGIN}/en/blog/consistent-character-ai`,
      ),
    ],
  },

  // Blog automation trial: /en/blog/image-to-video EN sibling. Mirrors /blog/image-to-video.
  {
    path: "/en/blog/image-to-video",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/blog/image-to-video`,
      en: `${SITE_ORIGIN}/en/blog/image-to-video`,
      xDefault: `${SITE_ORIGIN}/blog/image-to-video`,
    },
    title: imageToVideoGuide.en.title,
    description: imageToVideoGuide.en.description,
    canonical: `${SITE_ORIGIN}/en/blog/image-to-video`,
    ogTitle: imageToVideoGuide.en.title,
    ogDescription: imageToVideoGuide.en.excerpt,
    ogImage: `${SITE_ORIGIN}${imageToVideoGuide.en.cover.src}`,
    author: FOUNDER_NAME,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK_EN,
      blogPostingBlock({
        pageId: `${SITE_ORIGIN}/en/blog/image-to-video`,
        headline: imageToVideoGuide.en.title,
        description: imageToVideoGuide.en.description,
        datePublished: imageToVideoGuide.en.publishedAt,
        dateModified: imageToVideoGuide.en.updatedAt,
        inLanguage: "en-US",
        articleSection: "Guide",
        keywords: imageToVideoGuide.en.tags,
        image: {
          url: `${SITE_ORIGIN}${imageToVideoGuide.en.cover.src}`,
          width: imageToVideoGuide.en.cover.width,
          height: imageToVideoGuide.en.cover.height,
        },
      }),
      webPageBlock({
        pageId: `${SITE_ORIGIN}/en/blog/image-to-video`,
        url: `${SITE_ORIGIN}/en/blog/image-to-video`,
        name: imageToVideoGuide.en.title,
        inLanguage: "en-US",
        cssSelector: ["h1", ".blog-intro", "h2"],
      }),
      howToBlock(
        (imageToVideoGuide.en.body.steps ?? []).map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/blog/image-to-video`,
        imageToVideoGuide.en.title,
      ),
      faqPageBlock(imageToVideoGuide.en.body.faq ?? [], `${SITE_ORIGIN}/en/blog/image-to-video`),
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Blog", url: `${SITE_ORIGIN}/en/blog` },
          { name: imageToVideoGuide.en.title, url: `${SITE_ORIGIN}/en/blog/image-to-video` },
        ],
        `${SITE_ORIGIN}/en/blog/image-to-video`,
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
  ...learnRouteEntries,
  ...modelRouteEntries,
];
