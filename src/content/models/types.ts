// Phase v2.0 MODELS-A-1: TS types for programmatic model pages.
// Sibling to src/content/blog/types.ts but shaped for SoftwareApplication-style
// pages (TechArticle + SoftwareApplication, not BlogPosting). 62 model pages
// generated from C:/Projects/promptscore-proxy/skills/*.md via Phase 1 parser.

export type ModelType = "image" | "video";

export type ModelBestLanguage = "en" | "ru" | "both";

/**
 * Quick-Facts row shown in ModelQuickFacts table. `null` value → row hidden.
 * Locale strings (units, labels) live in i18n/ru.json + en.json under models.quickFacts.*.
 */
export interface ModelPromptLength {
  min: number;
  max: number;
}

/**
 * Hard facts parsed from `## Идентификация` + `## Ограничения платформы` blocks
 * in each promptscore-proxy skill MD. Written by scripts/build-models-registry.mjs.
 * Agents in Phase 2 receive this and only fill in `ModelContent` — they do NOT
 * regenerate meta (prevents drift between parser and generated content).
 */
export interface ModelMeta {
  slug: string;                   // "kling-2.6" — locale-neutral
  name: string;                   // "Kling 2.6 Pro"
  type: ModelType;
  vendor: string;                 // "Kuaishou"
  platform: string;               // "Kling AI (klingai.com)"
  platformUrl: string;            // "https://klingai.com"
  bestLanguage: ModelBestLanguage;
  promptLength: ModelPromptLength | null;
  features: string[];             // ["T2V", "I2V", "Elements", "Motion Control"]
  duration: string | null;        // "До 10 секунд" — video only
  resolution: string | null;      // "1080p" — image: pixel grid, video: 1080p/4K
  negativePrompt: boolean | null; // null = unknown from skill MD
  publishedAt: string;            // ISO yyyy-mm-dd — first commit of skill MD
  updatedAt: string;              // ISO yyyy-mm-dd — latest skill MD touch
}

export interface ModelSection {
  heading: string;
  body: string;                   // paragraphs separated by \n\n
  bullets?: string[];
  table?: { rows: [string, string][] };
}

export interface ModelExample {
  before: string;
  after: string;
  note?: string;
}

export interface ModelMistake {
  title: string;
  explain: string;
}

export interface ModelFaqItem {
  q: string;
  a: string;
}

/**
 * Per-locale content body. RU and EN must mirror each other 1:1 (same number of
 * sections, examples, mistakes, faq items). Brands stay untranslated ("Midjourney 7"
 * stays "Midjourney 7" in both locales).
 */
export interface ModelLocale {
  title: string;                  // ≤60 chars — <title> + og:title
  description: string;            // 150-160 chars — <meta name=description>
  h1: string;                     // visible <h1> heading
  intro: string;                  // 40-60 words, definitional, speakable-eligible
  sections: ModelSection[];       // 4-5 blocks, 100-200 words each
  examples: ModelExample[];       // exactly 3 before/after pairs
  mistakes: ModelMistake[];       // exactly 5 common mistakes
  faq: ModelFaqItem[];            // ≥6 Q-A, answer ≥30 words
}

export interface ModelContent {
  ru: ModelLocale;
  en: ModelLocale;
}

/**
 * Index entry exported by src/content/models/index.ts → consumed by seo-routes.ts
 * loop and ModelsHubPage card grid. `content` undefined during Phase 1 for all
 * models except the manual reference (gpt-image-2). Phase 2 fills the rest.
 */
export interface ModelEntry {
  slug: string;
  meta: ModelMeta;
  content?: ModelContent;
}
