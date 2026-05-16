// Phase 2 GEO-B-1 / D-03: Per-route metadata manifest (RU only — D-05).
// SYNC: title/description strings duplicated from src/i18n/ru.json — keep both in step until Phase 3 introduces a unified i18n→manifest pipeline.

// Phase 3 D-01/D-02: cluster pairs (reciprocal hreflang per RESEARCH.md Pitfall 5):
//   "/"        ↔ "/en/"          "/pay"     ↔ "/en/pay"
//   "/welcome" ↔ "/en/welcome"   "/privacy" ↔ "/en/privacy"
//   "/terms"   ↔ "/en/terms"     "/refund"  ↔ "/en/refund"
// xDefault always = RU sibling (D-02 root canonical).

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
}

export const SITE_ORIGIN = "https://opten.space";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-card-ru.png`;
export const DEFAULT_OG_IMAGE_EN = `${SITE_ORIGIN}/og-card-en.png`; // Phase 3 D-04 — EN OG card (already in public/ from Phase 1 GEO-A-4)

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
    ogDescription: "Перейди на Pro и улучшай промпты в один клик. 199₽/мес или $2.99/мес. Начни бесплатно.",
    prerender: "head",
    changefreq: "monthly",
    priority: 0.8,
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
    description: "Условия возврата средств за подписку и разовый доступ к Opten. Возврат в течение 7 дней при неиспользовании платных функций.",
    canonical: `${SITE_ORIGIN}/refund`,
    ogTitle: "Политика возврата — Opten",
    ogDescription: "Возврат средств за подписку Opten Pro в течение 7 дней при неиспользовании платных функций.",
    prerender: "full",
    changefreq: "yearly",
    priority: 0.3,
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
    ogDescription: "Upgrade to Pro and improve prompts in one click. $2.99/mo or 199₽/mo. Start for free.",
    ogImage: DEFAULT_OG_IMAGE_EN,
    prerender: "head",
    changefreq: "monthly",
    priority: 0.8,
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
  },
];
