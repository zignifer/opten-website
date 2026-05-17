// Phase 2 GEO-B-1 / D-03: Per-route metadata manifest (RU only — D-05).
// SYNC: title/description strings duplicated from src/i18n/ru.json — keep both in step until Phase 3 introduces a unified i18n→manifest pipeline.

// Phase 4 D-06 / D-08 / V-10: imports from src/content for HowTo + FAQ schema sources.
// This compiles cleanly via vite build --ssr; the deep imports resolve at SSR-bundle time.
import { guide as gptImage2Guide } from "../src/content/guides/gpt-image-2";
import { landingFaq } from "../src/content/landingFaq";

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
  ogImage?: string;                     // absolute URL; Phase 2 keeps og-card-ru.png site-wide (PROJECT.md decision)
  prerender: "full" | "head" | "none"; // D-02 tier
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;                     // 0..1 — matches Phase 1 sitemap priorities
  schema?: SchemaBlock[];               // Phase 4 D-09: optional schema.org JSON-LD blocks; consumed by prerender.mjs applyJsonLd
}

export const SITE_ORIGIN = "https://opten.space";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-card-ru.png`;
export const DEFAULT_OG_IMAGE_EN = `${SITE_ORIGIN}/og-card-en.png`; // Phase 3 D-04 — EN OG card (already in public/ from Phase 1 GEO-A-4)

// Phase 4 D-09: external URLs used by multiple schema blocks.
const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";
const FOUNDER_TELEGRAM_URL = "https://t.me/v_voronezhtsev";

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
  founder: PERSON_FOUNDER_REF,
  sameAs: [
    CHROME_STORE_URL,
    FOUNDER_TELEGRAM_URL,
  ],
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
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome",
  url: `${SITE_ORIGIN}/`,
  downloadUrl: CHROME_STORE_URL,
  publisher: ORG_REF,
  offers: [
    { "@type": "Offer", price: "2.99", priceCurrency: "USD", name: "Pro Monthly" },
    { "@type": "Offer", price: "199",  priceCurrency: "RUB", name: "Pro Monthly (RU)" },
  ],
};

// Phase 4 D-09: defined at module scope, wired onto /about only in Plan 04-05 (per D-03).
export const PERSON_FOUNDER_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_ORIGIN}/#person-founder`,
  name: "Виктор Воронежцев",
  url: `${SITE_ORIGIN}/about`,
  jobTitle: "Founder, Opten",
  worksFor: ORG_REF,
  sameAs: [FOUNDER_TELEGRAM_URL],
  // image: `${SITE_ORIGIN}/assets/about/founder.jpg`,  // D-03 / 04-LCP-AUDIT lock: ship without photo (option c) — Plan 04-05 keeps this commented; future Phase 4.1 hotfix uncomments when asset lands.
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
    description: "Opten Pro subscription — AI prompt scoring and one-click improvement for 43+ image generation models.",
    brand: ORG_REF,
    // Anchor product back to the SoftwareApplication entity so the graph stays connected.
    isRelatedTo: SOFTWARE_APP_REF,
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
    title: "Opten — AI-оценка и улучшение промптов для генерации изображений",
    description: "Opten оценивает промпт под конкретную нейросеть, показывает ошибки и исправляет их в один клик. Работает с 43+ моделями прямо в интерфейсе генератора.",
    canonical: `${SITE_ORIGIN}/`,
    ogTitle: "Opten — не сливай кредиты на плохие промпты",
    ogDescription: "AI-оценка и улучшение промптов для 43+ моделей генерации изображений. Прямо в интерфейсе генератора.",
    prerender: "full",
    changefreq: "weekly",
    priority: 1.0,
    // Phase 4 D-09 / D-08 / V-10: Org + SoftwareApp + WebSite + FAQPage landing graph.
    schema: [ORG_BLOCK, SOFTWARE_APP_BLOCK, WEBSITE_BLOCK, faqPageBlock(landingFaq.ru, `${SITE_ORIGIN}/`)],
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

  // Phase 4 D-01 / D-02: RU-only /about entry. NO /en/about sibling — deferred to Phase 4.1.
  // hreflang.en falls back to landing per D-02 (NOT to a non-existent /en/about).
  {
    path: "/about",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/about`,
      en: `${SITE_ORIGIN}/`,           // D-02 — no /en/about; fallback to landing
      xDefault: `${SITE_ORIGIN}/about`,
    },
    title: "О проекте Opten — кто стоит за расширением",
    description: "Opten — личный проект Влада Воронежцева, AI-блогера и автора Chrome-расширения для оценки промптов. История создания, контакты, реквизиты.",
    canonical: `${SITE_ORIGIN}/about`,
    ogTitle: "О проекте Opten",
    ogDescription: "История создания Opten — расширения для оценки промптов под конкретную AI-модель.",
    prerender: "full",
    changefreq: "yearly",
    priority: 0.5,
    // Phase 4 D-09: Org + Person (founder) + breadcrumb (Главная → О проекте).
    // PERSON_FOUNDER_BLOCK still has image commented per locked decision option (c) — photo deferred.
    schema: [
      ORG_BLOCK,
      PERSON_FOUNDER_BLOCK,
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: "О проекте", url: `${SITE_ORIGIN}/about` },
        ],
        `${SITE_ORIGIN}/about`,
      ),
    ],
  },

  // Phase 4 D-04 / D-06: anchor guide RU entry. EN sibling below in the EN section.
  {
    path: "/guides/gpt-image-2",
    htmlLang: "ru",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/guides/gpt-image-2`,
      en: `${SITE_ORIGIN}/en/guides/gpt-image-2`,
      xDefault: `${SITE_ORIGIN}/guides/gpt-image-2`,
    },
    title: gptImage2Guide.ru.title,
    description: "Структура промпта, шаблон Change/Preserve/Constraints, итерация вместо overload — 5 шагов от случайной генерации к точному результату в GPT Image 2.",
    canonical: `${SITE_ORIGIN}/guides/gpt-image-2`,
    ogTitle: gptImage2Guide.ru.title,
    ogDescription: "5 шагов + 5 FAQ-вопросов от автора Opten.",
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      howToBlock(
        gptImage2Guide.ru.steps.map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/guides/gpt-image-2`,
        gptImage2Guide.ru.title,
      ),
      faqPageBlock(gptImage2Guide.ru.faq, `${SITE_ORIGIN}/guides/gpt-image-2`),
      // Phase 04.1 WR-03: collapsed 3-level breadcrumb (root → /guides index → article) to 2 levels
      // (root → article). The /guides index page does not exist — linking to it produces a soft-404.
      // Revisit when a second guide is added (one-guide index has poor UX, not worth shipping now).
      breadcrumbBlock(
        [
          { name: "Главная", url: `${SITE_ORIGIN}/` },
          { name: gptImage2Guide.ru.title, url: `${SITE_ORIGIN}/guides/gpt-image-2` },
        ],
        `${SITE_ORIGIN}/guides/gpt-image-2`,
      ),
    ],
  },

  // Phase 3 D-04: EN siblings (6 entries). EN ogImage = DEFAULT_OG_IMAGE_EN. SYNC: title/description duplicated from src/i18n/en.json — see line 2 SYNC policy.
  {
    path: "/en/",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/`,
      en: `${SITE_ORIGIN}/en/`,
      xDefault: `${SITE_ORIGIN}/`,
    },
    title: "Opten — AI prompt scoring and improvement for image generation",
    description: "Opten evaluates your prompt for the specific AI model, shows what's wrong, and fixes it in one click. Works with 43+ models right inside the generator interface.",
    canonical: `${SITE_ORIGIN}/en/`,
    ogTitle: "Opten — stop wasting credits on bad prompts",
    ogDescription: "AI prompt scoring and improvement for 43+ image generation models. Right inside the generator interface.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full",
    changefreq: "weekly",
    priority: 1.0,
    // Phase 4 D-09 / D-08 / V-10: Org + SoftwareApp + WebSite + EN FAQPage (separate from RU set — Q/A localized).
    schema: [ORG_BLOCK, SOFTWARE_APP_BLOCK, WEBSITE_BLOCK, faqPageBlock(landingFaq.en, `${SITE_ORIGIN}/en/`)],
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
      ORG_BLOCK,
      productBlock(
        [
          { name: "Pro Monthly (RU)", price: "199", currency: "RUB" },
          { name: "Pro Monthly", price: "2.99", currency: "USD" },
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
      ORG_BLOCK,
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
      ORG_BLOCK,
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
      ORG_BLOCK,
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
      ORG_BLOCK,
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: "Refund Policy", url: `${SITE_ORIGIN}/en/refund` },
        ],
        `${SITE_ORIGIN}/en/refund`,
      ),
    ],
  },

  // Phase 4 D-06: anchor guide EN sibling.
  {
    path: "/en/guides/gpt-image-2",
    htmlLang: "en",
    hreflangAlternates: {
      ru: `${SITE_ORIGIN}/guides/gpt-image-2`,
      en: `${SITE_ORIGIN}/en/guides/gpt-image-2`,
      xDefault: `${SITE_ORIGIN}/guides/gpt-image-2`,
    },
    title: gptImage2Guide.en.title,
    description: "Structure, Change/Preserve/Constraints template, iterate-don't-overload — 5 steps from random output to precise GPT Image 2 results.",
    canonical: `${SITE_ORIGIN}/en/guides/gpt-image-2`,
    ogTitle: gptImage2Guide.en.title,
    ogDescription: "5 steps + 5 FAQ items by the author of Opten.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "full",
    changefreq: "monthly",
    priority: 0.7,
    schema: [
      ORG_BLOCK,
      howToBlock(
        gptImage2Guide.en.steps.map((s) => ({ title: s.title, body: s.body })),
        `${SITE_ORIGIN}/en/guides/gpt-image-2`,
        gptImage2Guide.en.title,
      ),
      faqPageBlock(gptImage2Guide.en.faq, `${SITE_ORIGIN}/en/guides/gpt-image-2`),
      // Phase 04.1 WR-03: collapsed 3-level breadcrumb (root → /en/guides index → article) to 2 levels
      // (root → article). The /en/guides index page does not exist — linking to it produces a soft-404.
      breadcrumbBlock(
        [
          { name: "Home", url: `${SITE_ORIGIN}/en/` },
          { name: gptImage2Guide.en.title, url: `${SITE_ORIGIN}/en/guides/gpt-image-2` },
        ],
        `${SITE_ORIGIN}/en/guides/gpt-image-2`,
      ),
    ],
  },
];
