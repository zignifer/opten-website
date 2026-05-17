---
tags:
  - gsd
  - patterns
  - phase
phase: 4
milestone: "geo-optimization"
kind: phase-patterns
---
# Phase 4: Content surface — Pattern Map

**Mapped:** 2026-05-17
**Files analyzed:** 14 (7 NEW + 7 MODIFIED)
**Analogs found:** 14 / 14 (100% — Phase 4 is additive on top of well-established Phase 2/3 patterns)

## File Classification

| File | New/Modified | Role | Data Flow | Closest Analog | Match Quality |
|------|--------------|------|-----------|----------------|---------------|
| `src/app/pages/AboutPage.tsx` | NEW | page (RU-only, SSR) | static-render | `src/app/pages/WelcomePage.tsx` | exact (eager-import SSR page with embedded body content) |
| `src/app/pages/GuidePage.tsx` | NEW | page (bilingual, SSR, param) | static-render + URL param | `src/app/pages/WelcomePage.tsx` + `src/app/pages/PrivacyPage.tsx` | exact (eager + i18n via `useT`/`useLang` + content lookup) |
| `src/app/components/FaqBlock.tsx` | NEW | component (shared, SSR-safe) | static-render | `src/app/components/layout/LegalLayout.tsx` (shared chrome) + `src/app/components/ui/accordion.tsx` (Radix primitive) | role-match (no FAQ component exists; Radix Accordion already installed but unused) |
| `src/app/components/PricingStaticBlock.tsx` | NEW | component (SSR-safe extract) | static-render | inline `<div className="grid w-full max-w-[800px]…">` in `PayPage.tsx:434-528` | exact (literal extraction — pre-existing JSX subtree) |
| `src/content/guides/<slug>.ts` | NEW | data module (bilingual content) | const export | `scripts/seo-routes.ts` (manifest-as-data pattern) | role-match (no `src/content/` precedent; mirror manifest shape) |
| `scripts/llms.mjs` | NEW | build script (postbuild emitter) | file I/O | `scripts/sitemap.mjs` | exact (sibling postbuild step, same manifest import shape, fail-fast floor) |
| `scripts/schema-types.ts` (or inline in `seo-routes.ts`) | NEW | type module + schema builders | const export | `scripts/seo-routes.ts` (typed manifest with builders) | exact (same SSR-compiled `.ssr-meta/` output target) |
| `scripts/seo-routes.ts` | MODIFIED | manifest extension | typed config | itself (extend `RouteMeta` interface, add 3 entries, promote `/pay` + `/en/pay` to `"full"`) | self-analog |
| `scripts/prerender.mjs` | MODIFIED | postbuild apply-chain | string transform | itself (`applyHtmlLang`, `applyHreflang`, `applyOgLocale`, `applyPaddleScript` — see lines 35-180) | self-analog (every new `applyXxx` follows the same shape) |
| `scripts/entry-server.tsx` | MODIFIED | SSR mount | route table | itself (lines 21-44) | self-analog (mirror `main.tsx` mount block) |
| `src/main.tsx` | MODIFIED | SPA mount | route table | itself (lines 46-71) | self-analog |
| `src/i18n/paths.ts` | MODIFIED | i18n routing config | const set extension | itself (`EN_SIBLINGS` at lines 9-16) | self-analog (add `/guides/<slug>` ONLY, NOT `/about`) |
| `src/i18n/ru.json` + `en.json` | MODIFIED | i18n dict | flat key map | itself (lines 1-40 `nav.*` keys) | self-analog (add `nav.about`, `nav.guides`, `faq.*`, `about.*`, `guide.*` page-chrome keys) |
| `src/app/pages/PayPage.tsx` | MODIFIED | page refactor | JSX extract | itself (lines 434-528 pricing cards) | self-analog (extract `<PricingStaticBlock>`, remove `lazy()` from `main.tsx:18`, add to `entry-server.tsx`) |
| `public/robots.txt` | MODIFIED | static config | text append | itself (lines 1-56) | self-analog (append one `Content-Signal:` line) |
| `vercel.json` | MODIFIED | edge config | JSON edit | itself (`headers` array at lines 6-13) | self-analog (append `X-Frame-Options` header — no CSP) |
| `package.json` | MODIFIED | npm scripts | string edit | itself (`build` chain at line 7) | self-analog (append `&& node scripts/llms.mjs` to build) |

---

## Pattern Assignments

### `src/app/pages/AboutPage.tsx` (NEW — page, RU-only, SSR)

**Analog:** `src/app/pages/WelcomePage.tsx` (eager-imported SSR page with embedded body content and `useT`)

**Imports pattern** — copy from `WelcomePage.tsx:1-2`:

```tsx
import { useState, useEffect } from "react";
import { useT, useLang } from "../../i18n/LangContext";
```

For `/about` the imports collapse to (RU only — `useLang` optional, only if a guard is needed to no-op on `/en/about` fallback):

```tsx
import { useT } from "../../i18n/LangContext";
// optional: import LangSwitcher from "../components/LangSwitcher";
// optional: import LocalizedLink from "../components/LocalizedLink";
```

**Component shape pattern** — copy from `WelcomePage.tsx:16-98`:

```tsx
export default function AboutPage() {
  const t = useT();
  return (
    <div className="relative min-h-screen bg-black ... font-['PT_Root_UI',sans-serif]">
      {/* header with LocalizedLink to "/" + LangSwitcher (see LegalLayout.tsx:17-27) */}
      {/* hero block: founder photo + name + tagline */}
      {/* body: ~1000 words, RU only — content is embedded in JSX as static text */}
      {/* footer: same as LegalLayout.tsx:44-51 (LocalizedLink to privacy/terms/refund) */}
    </div>
  );
}
```

**Header/footer chrome pattern** — copy directly from `src/app/components/layout/LegalLayout.tsx:15-51`:

```tsx
// Header with brand link + LangSwitcher + back-to-home
<header className="flex items-center justify-between max-w-[800px] mx-auto px-[20px] py-[24px]">
  <LocalizedLink to="/" className="text-white text-[20px] font-bold no-underline hover:opacity-80 transition-opacity">
    Opten
  </LocalizedLink>
  <div className="flex items-center gap-[16px]">
    <LangSwitcher className="text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-['PT_Root_UI',sans-serif]" />
    <LocalizedLink to="/" className="text-[rgba(255,255,255,0.5)] text-[14px] no-underline hover:text-white transition-colors">
      {t("legal.backLink")}
    </LocalizedLink>
  </div>
</header>
```

**SSR-safety constraint** (`CONVENTIONS.md` §"SSR / Prerender Constraints"):
- No `window`, `localStorage`, `navigator` reads at render time.
- Any `useEffect` browser-side reads are fine — same shape as `WelcomePage.tsx:22-31`.
- Body content is embedded directly as JSX in Russian — D-07 forbids LLM-generated copy.

**Critical rules:**
- D-02: `/about` is RU only. Does NOT enter `EN_SIBLINGS`. `htmlLang: "ru"` and `hreflangAlternates.en` should still point at `${SITE_ORIGIN}/` (the landing) — NOT at `/en/about` (which does not exist).
- D-16: navbar/footer "About" link must be suppressed on EN — easiest implementation is to gate the link via `useLang()` in App.tsx and only render `<LocalizedLink to="/about">` when `lang === "ru"`. Planner picks final UX (hide vs "Coming soon in EN" stub).

---

### `src/app/pages/GuidePage.tsx` (NEW — page, bilingual, SSR, URL param)

**Analog:** `src/app/pages/WelcomePage.tsx` (i18n via `useT` + `useLang`, eager SSR-safe, body assembled from data) + `src/app/pages/PrivacyPage.tsx` (legal layout wrapper pattern).

**URL param via `react-router` v7** — no existing analog in repo (no page currently uses `:slug`). Use `useParams` from `react-router` (NOT `react-router-dom`, per `CONVENTIONS.md` Anti-Conventions):

```tsx
import { useParams } from "react-router";
import { useT, useLang } from "../../i18n/LangContext";
import FaqBlock from "../components/FaqBlock";
import { guidesBySlug } from "../../content/guides";

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();
  const t = useT();
  const data = slug ? guidesBySlug[slug]?.[lang] : undefined;
  if (!data) {
    // Fall through to 404-style content (single-anchor-guide scope; expand in Phase 4.1).
    return <div>Guide not found</div>;
  }
  return (
    <div className="...">
      {/* header chrome — same shape as LegalLayout.tsx:17-27 */}
      <h1>{data.title}</h1>
      <p>{data.intro}</p>
      {data.steps.map(step => (/* HowTo step block with before/after */))}
      <FaqBlock items={data.faq} />
      {/* footer — same as LegalLayout.tsx:44-51 */}
    </div>
  );
}
```

**Bilingual rendering pattern** — copy from `WelcomePage.tsx:11-20`:

```tsx
const slides: Record<string, string[]> = {
  ru: ["/assets/welcome-ru.png", ...],
  en: ["/assets/welcome-en.png", ...],
};
// then:
const { lang } = useLang();
const images = slides[lang];
```

For guides: the bilingual content is the entire `data` payload, indexed by `lang` (`{ ru: GuideContent, en: GuideContent }`). See `src/content/guides/<slug>.ts` below.

**Critical rules:**
- D-06: BOTH `/guides/<slug>` AND `/en/guides/<slug>` ship. Both added to `EN_SIBLINGS` (`paths.ts:9-16`).
- Eager-import in BOTH `main.tsx` AND `entry-server.tsx` (per `main.tsx:14-21` precedent: lazy is ONLY for SPA-only pages with `localStorage`/`window` at module load — guide pages have neither).
- SSR-safe: no browser API reads at render time. `useParams` is SSR-safe under `StaticRouter`.

---

### `src/app/components/FaqBlock.tsx` (NEW — component, shared, SSR-safe)

**Analog:** No existing FAQ component in repo. Closest is `src/app/components/ui/accordion.tsx` (Radix Accordion wrapper — already installed via `@radix-ui/react-accordion@1.2.3` per `package.json:16`, but currently has zero imports per `STRUCTURE.md` "Auto-Generated or Fragile Areas").

**Two-tier approach (recommended):**

1. **Static semantic markup for the schema body** (always emitted in SSR HTML — required so the `FAQPage` JSON-LD `mainEntity` Q/A text matches what crawlers see):

```tsx
// Use plain <dl> or <details>/<summary> — both serialize cleanly in SSR.
export interface FaqItem { q: string; a: string; }
export default function FaqBlock({ items, headingKey = "faq.heading" }: { items: FaqItem[]; headingKey?: string }) {
  const t = useT();
  return (
    <section id="faq" aria-labelledby="faq-heading" className="...">
      <h2 id="faq-heading">{t(headingKey)}</h2>
      <dl>
        {items.map((item, i) => (
          <div key={i}>
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

2. **Optional Radix enhancement** — if collapse-on-click UX is desired, wrap `<dl>` body with the Radix wrapper. `src/app/components/ui/accordion.tsx:9-66` is already in the codebase ready to import; example usage shape:

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

<Accordion type="single" collapsible>
  {items.map((item, i) => (
    <AccordionItem key={i} value={`faq-${i}`}>
      <AccordionTrigger>{item.q}</AccordionTrigger>
      <AccordionContent>{item.a}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

**Critical rules:**
- The Q/A TEXT must appear in initial HTML (not behind a JS-required interaction). Radix Accordion's content IS server-rendered (initial state respects `defaultValue`), but a plain `<dl>` is simpler and equally valid for the schema match.
- D-08: items are sourced from real user questions (Telegram + Chrome Web Store), not invented. Same Q/A set on landing + guide is acceptable.
- The block has NO i18n key duplication anxiety: items themselves are passed in as props (locale-resolved by the caller); only block-chrome keys (`faq.heading`) go through `useT`.

---

### `src/app/components/PricingStaticBlock.tsx` (NEW — D-12 extract)

**Analog:** Inline JSX subtree in `src/app/pages/PayPage.tsx:434-528` (the two pricing cards).

**Extraction pattern:**

Lift lines 434-528 verbatim into a new component. Strip references to runtime state (`currency`, `extStatus`, `hasActivePro`, `loading`, `error`) — those stay in `PayPage.tsx` and are layered on top of the static block in the live page. The static block receives ONLY the locale-derived currency as a prop (default `"RUB"` for `/pay`, `"USD"` for `/en/pay`).

```tsx
// src/app/components/PricingStaticBlock.tsx
import { useT } from "../../i18n/LangContext";

interface PricingStaticBlockProps {
  defaultCurrency: "RUB" | "USD";  // baked from the prerender URL (/pay vs /en/pay)
}

export default function PricingStaticBlock({ defaultCurrency }: PricingStaticBlockProps) {
  const t = useT();
  return (
    <div className="grid w-full max-w-[800px] gap-[24px] md:grid-cols-2">
      {/* One-time Card (PayPage.tsx:436-479 minus the {extStatus === "ready" ? ...} CTA branch) */}
      {/* Pro Card (PayPage.tsx:482-527 minus the {extStatus === "ready" ? ...} CTA branch) */}
      {/* Static fallback CTA: <a href={CHROME_STORE_URL}>{t("pay.onetime.tryBtn")}</a> */}
    </div>
  );
}
```

**Reused helpers** — `PricingFeature` (`PayPage.tsx:100-107`) and `Divider` (`PayPage.tsx:109-111`) must also move (or be re-exported) so the static block compiles without circular deps. Easiest: also extract them into `PricingStaticBlock.tsx` or a sibling `PricingPrimitives.tsx`.

**Critical rules (D-12):**
- The pricing facts (199₽ / $2.99 / 300 generations / feature bullets 1-5) MUST appear in the initial HTML on both `/pay` and `/en/pay` after the flip. Verification per RESEARCH §"Verification chain":
  - `curl -s https://opten.space/pay | grep -E "(199₽|\\$2\\.99|300 generations)"` → both prices + feature bullet visible.
- Paddle invariant: `applyPaddleScript()` at `prerender.mjs:175-180` gates on `meta.path === "/pay" || meta.path === "/en/pay"` (line 192) — this gate is PATH-BASED, not tier-based. Flipping `meta.prerender` from `"head"` to `"full"` does NOT touch the gate. **Verification:** `curl -s https://opten.space/pay | grep "cdn.paddle.com"` must still match after the flip.
- `PayPage.tsx` itself must be removed from the `lazy()` block at `src/main.tsx:18` AND added as an eager import in both `main.tsx` and `entry-server.tsx` (Option A from RESEARCH §Pattern 4). The bundle-size win was scoped to "landing pays for PayPage" — irrelevant on `/pay` itself.
- INTEGRATION-CONTRACT §6 hardcoded constants (`EXTENSION_IDS`, `SUPABASE_FUNCTIONS_URL`, `SUPABASE_ANON_KEY`, `CHROME_STORE_URL`) at `PayPage.tsx:10-17` — these stay where they are, untouched.

---

### `src/content/guides/<slug>.ts` (NEW — bilingual content data)

**Analog:** `scripts/seo-routes.ts` (typed manifest with declarative content). No `src/content/` precedent exists; this directory is being introduced.

**Shape pattern** — mirror the typed-export-and-array pattern from `seo-routes.ts:10-30`:

```ts
// src/content/guides/<slug>.ts
export interface GuideStep {
  title: string;
  body: string;        // ~150-250 words per step
  before?: string;     // before-prompt example (for the 30-50% savings claim)
  after?: string;      // after-prompt example
  imageSrc?: string;   // /assets/guides/<slug>/step-N.png
}
export interface GuideFaqItem { q: string; a: string; }
export interface GuideContent {
  slug: string;
  title: string;
  intro: string;
  steps: GuideStep[];
  faq: GuideFaqItem[];
  publishedAt: string; // ISO date — feeds schema dateCreated
  updatedAt: string;   // ISO date — feeds schema dateModified
}
export const guide: { ru: GuideContent; en: GuideContent } = {
  ru: { slug: "gpt-image-2", title: "Как писать промпты для GPT Image 2", /* … */ },
  en: { slug: "gpt-image-2", title: "How to write prompts for GPT Image 2", /* … */ },
};
```

**Aggregation barrel** (single-anchor scope, but shaped for Phase 4.1 expansion):

```ts
// src/content/guides/index.ts (or inline in GuidePage.tsx)
import { guide as gptImage2 } from "./gpt-image-2";
export const guidesBySlug = {
  "gpt-image-2": gptImage2,
} as const;
```

**Critical rules:**
- D-07: human-written, no LLM-generated copy.
- The content payload is the source of truth for the `HowTo` schema block (steps[].title + steps[].body) AND the `FAQPage` block (faq[].q + faq[].a). The schema builder in `seo-routes.ts` reads from this module at SSR-build time.

---

### `scripts/llms.mjs` (NEW — postbuild emitter)

**Analog:** `scripts/sitemap.mjs` (exact sibling — same manifest import, same postbuild slot, same fail-fast floor).

**Imports + manifest load pattern** — copy from `scripts/sitemap.mjs:15-31`:

```js
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const MANIFEST_BUNDLE = resolve(ROOT, ".ssr-meta", "seo-routes.js");

const { routes, SITE_ORIGIN } = await import(pathToFileURL(MANIFEST_BUNDLE).href);

const fullRoutes = routes.filter(r => r.prerender === "full");
if (fullRoutes.length < 13) {  // 12 baseline + 1 about (/guides counted via full prerender)
  throw new Error(`llms.mjs: expected at least 13 full-prerender routes after Phase 4, got ${fullRoutes.length}.`);
}
```

**llms.txt format** (per RESEARCH §"Don't Hand-Roll"; the spec at https://llmstxt.org/ is plain Markdown):

```js
const llmsTxt = `# Opten

> ${siteDescription}

## Marketing
${marketingRoutes.map(r => `- [${r.title}](${r.canonical})`).join("\n")}

## Guides
${guideRoutes.map(r => `- [${r.title}](${r.canonical})`).join("\n")}

## About
- [About](${SITE_ORIGIN}/about)

## Legal
- [Privacy](${SITE_ORIGIN}/privacy)
- [Terms](${SITE_ORIGIN}/terms)
- [Refund](${SITE_ORIGIN}/refund)
`;

await writeFile(resolve(DIST, "llms.txt"), llmsTxt, "utf-8");
```

**llms-full.txt body extraction** — read each `dist/<route>/index.html`, strip `<script>`, `<style>`, and HTML tags via regex (NO `cheerio` / `jsdom`, per RESEARCH §"Don't Hand-Roll"):

```js
async function extractText(htmlPath) {
  const html = await readFile(htmlPath, "utf-8");
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
```

**Size cap** (Claude's Discretion in CONTEXT.md): if `llmsFullTxt.length > 50_000`, truncate to root + guide + about + pricing (drop legal pages).

**Console output pattern** — mirror `sitemap.mjs:49`:

```js
console.log(`✓ llms.txt    → ${marketingRoutes.length + guideRoutes.length} routes`);
console.log(`✓ llms-full.txt → ${(llmsFullTxt.length / 1024).toFixed(1)} KB`);
```

**Existing `public/llms.txt`** (the stub at lines 1-21 of `public/llms.txt`): planner should delete this file. Vite copies `public/*` to `dist/` early in the build; the postbuild `llms.mjs` overwrites it. Leaving the stub in `public/` works but is confusing — clean source-of-truth is "llms.txt is generated, not authored".

---

### `scripts/schema-types.ts` or inline in `scripts/seo-routes.ts` (NEW)

**Analog:** `scripts/seo-routes.ts:10-31` (typed manifest + reusable constants).

**Type declaration pattern:**

```ts
// scripts/seo-routes.ts (extend the existing interface)
export interface SchemaBlock {
  "@context"?: string;
  "@type": string;
  "@id"?: string;
  [key: string]: unknown;  // permissive — schema.org spec is huge
}
export interface RouteMeta {
  // …existing fields…
  schema?: SchemaBlock[];  // NEW (D-09 / D-10)
}
```

**Reusable schema-block constants pattern** — mirror `SITE_ORIGIN` + `DEFAULT_OG_IMAGE` constants at `seo-routes.ts:29-31`:

```ts
// Reusable @id-keyed blocks declared once at module scope, embedded by reference per route.
const ORG_REF = { "@id": `${SITE_ORIGIN}/#org` };
const WEBSITE_REF = { "@id": `${SITE_ORIGIN}/#website` };
const PERSON_FOUNDER_REF = { "@id": `${SITE_ORIGIN}/#person-founder` };
const SOFTWARE_APP_REF = { "@id": `${SITE_ORIGIN}/#software-app` };

const ORG_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_ORIGIN}/#org`,
  name: "Opten",
  legalName: "ИП Воронежцев В.П.",
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/favicon-192x192.png`,
  founder: PERSON_FOUNDER_REF,
  sameAs: [
    "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl",
    "https://t.me/v_voronezhtsev",
  ],
};

const WEBSITE_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: "Opten",
  inLanguage: ["ru-RU", "en-US"],
  publisher: ORG_REF,
};

const SOFTWARE_APP_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_ORIGIN}/#software-app`,
  name: "Opten",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome",
  url: `${SITE_ORIGIN}/`,
  downloadUrl: "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl",
  publisher: ORG_REF,
  offers: [
    { "@type": "Offer", price: "0",    priceCurrency: "USD", name: "Free tier" },
    { "@type": "Offer", price: "2.99", priceCurrency: "USD", name: "Pro Monthly" },
    { "@type": "Offer", price: "199",  priceCurrency: "RUB", name: "Pro Monthly (RU)" },
  ],
};

const PERSON_FOUNDER_BLOCK: SchemaBlock = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_ORIGIN}/#person-founder`,
  name: "Виктор Воронежцев",
  url: `${SITE_ORIGIN}/about`,
  jobTitle: "Founder, Opten",
  worksFor: ORG_REF,
  sameAs: ["https://t.me/v_voronezhtsev"],
  // image: `${SITE_ORIGIN}/assets/about/founder.jpg`,  // D-03 — supplied during planning
};
```

**Schema builder helpers pattern** — these are pure functions that take page-specific data and return a `SchemaBlock`. Reuse them per route:

```ts
function faqPageBlock(items: { q: string; a: string }[], pageId: string): SchemaBlock {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageId}#faq`,
    mainEntity: items.map(it => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

function howToBlock(steps: { title: string; body: string }[], pageId: string, name: string): SchemaBlock {
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

function productBlock(/* args */): SchemaBlock { /* … */ }
function breadcrumbBlock(items: { name: string; url: string }[]): SchemaBlock { /* … */ }
```

**Per-route assignment** — add `schema:` field to each `routes[]` entry:

```ts
{
  path: "/",
  // …existing fields…
  schema: [ORG_BLOCK, SOFTWARE_APP_BLOCK, WEBSITE_BLOCK, faqPageBlock(landingFaqRu, `${SITE_ORIGIN}/`)],
},
{
  path: "/about",
  schema: [ORG_BLOCK, PERSON_FOUNDER_BLOCK, breadcrumbBlock([...])],
},
{
  path: "/guides/midjourney-v7-prompts",
  schema: [
    ORG_BLOCK,
    breadcrumbBlock([{ name: "Home", url: SITE_ORIGIN + "/" }, { name: "Guides", url: SITE_ORIGIN + "/guides" }, { name: guideRu.title, url: SITE_ORIGIN + "/guides/midjourney-v7-prompts" }]),
    howToBlock(guideRu.steps, `${SITE_ORIGIN}/guides/midjourney-v7-prompts`, guideRu.title),
    faqPageBlock(guideRu.faq, `${SITE_ORIGIN}/guides/midjourney-v7-prompts`),
  ],
},
{
  path: "/pay",
  schema: [ORG_BLOCK, productBlock(/* USD + RUB offers */), breadcrumbBlock([...])],
  prerender: "full",  // D-12 flip
},
```

**Critical rules:**
- Cross-references via `@id` are JS object references at module scope (`ORG_REF`, `PERSON_FOUNDER_REF`) — they resolve correctly because all blocks are in the same TS module. TypeScript will NOT enforce schema.org `@id` correctness; rely on the Rich Results Test in verification.
- The structured-data templates in `.planning/research/GEO-AUDIT-POST-PHASE-3.md` §"Phase 4 Schema Plan" are the planner's starting point. Reuse them, don't regenerate.

---

### `scripts/prerender.mjs` (MODIFIED — add 2 new apply helpers)

**Analog:** `scripts/prerender.mjs` itself (lines 35-180 — every existing `applyXxx` is the template).

**Universal apply-helper pattern** — every existing helper follows this 3-step shape:

```js
function applyXxx(html, meta) {
  const before = html;  // OR: regex pre-check
  html = html.replace(/* anchor */, /* replacement */);
  if (html === before) {  // OR: check regex matched
    throw new Error(`prerender(${meta.path}): no <anchor> matched. index.html changed?`);
  }
  return html;
}
```

See: `applyHtmlLang` (lines 35-43 — uses pre-check via `htmlLangRe.test(html)`), `applyHreflang` (lines 48-61 — uses `before` capture), `applyOgLocale` (lines 65-84), `applyMeta` (lines 86-104), `applyMarker` (lines 118-124).

**`applyJsonLd(html, meta)` — NEW** (mirror `applyModulePreload` at lines 134-140 for the `</head>` anchor):

```js
// Phase 4 D-09 / D-10: inject schema.org JSON-LD blocks per route into <head>.
// MUST run BEFORE applyMarker, applyPaddleScript, applyModulePreload — all consume </head>.
function applyJsonLd(html, meta) {
  if (!meta.schema || meta.schema.length === 0) return html;  // optional field
  const blocks = meta.schema.map(
    (block) => `    <script type="application/ld+json">
${JSON.stringify(block, null, 2).split("\n").map(l => "    " + l).join("\n")}
    </script>`
  ).join("\n");
  const before = html;
  html = html.replace("</head>", `${blocks}\n  </head>`);
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no </head> anchor for JSON-LD. index.html changed?`);
  }
  return html;
}
```

**`applyHeroPreload(html, meta)` — NEW** (mirror `applySafariPreloadFallback` at lines 158-167 — reads back from already-emitted HTML to find the hero `<img>`):

```js
// Phase 4 D-13: inject <link rel="preload" as="image"> + add fetchpriority="high" to hero image.
// Only runs on routes that render a hero — currently / and /en/. Detect via the prerendered <img>
// with the partner-logo OR feature-image src pattern; the hero image is the first <img> in <main>
// or has a specific data-attribute. Simplest reliable signal: regex-match the hero <img src=…>
// emitted by App.tsx. If no match, no-op (legal/welcome/about/guide routes don't render the hero).
function applyHeroPreload(html, meta) {
  if (meta.path !== "/" && meta.path !== "/en/") return html;
  const heroMatch = html.match(/<img[^>]+src="(\/assets\/landing-design\/[^"]+\.webp)"/);
  if (!heroMatch) return html;  // hero not found — non-fatal (vs all other apply helpers)
  const heroSrc = heroMatch[1];
  const tag = `    <link rel="preload" as="image" href="${heroSrc}" fetchpriority="high">`;
  const before = html;
  html = html.replace("</head>", `${tag}\n  </head>`);
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no </head> anchor for hero preload.`);
  }
  return html;
}
```

(Note: the precise hero `<img>` selector depends on `App.tsx` output; planner verifies the regex against actual built HTML and adjusts. The `</head>` anchor failure is fatal — the hero-not-found case is the soft no-op.)

**Apply-chain ordering** (per RESEARCH §Pattern 2 ordering note + `prerender.mjs:182-195` existing loop):

```
applyMeta             → existing line 186
applyHtmlLang         → existing line 187
applyHreflang         → existing line 188
applyOgLocale         → existing line 189
applyJsonLd           ← NEW (must precede applyMarker / applyPaddleScript / applyModulePreload — all consume </head>)
applyHeroPreload      ← NEW (must precede applyMarker — consumes </head>)
applyModulePreload    → existing line 190
applySafariPreloadFallback → existing line 191
applyPaddleScript     → existing line 192 (conditional, /pay + /en/pay only)
applyMarker           → existing line 195
applyBody             → existing line 198 (conditional, prerender === "full" only)
```

**The "consumes `</head>` cascade" is documented at `prerender.mjs:132-133`** — the comment block explicitly warns new apply helpers about this. Treat as binding.

**Critical rules:**
- Every new helper MUST include the `if (html === before) throw new Error(...)` fail-fast guard (per `CONVENTIONS.md` §"Error Handling" — Phase 2 D-08 baseline).
- The Paddle gate at `prerender.mjs:192` (`meta.path === "/pay" || meta.path === "/en/pay"`) is PATH-BASED — D-12 flipping `meta.prerender` from `"head"` to `"full"` does NOT need to touch this gate. **Verify this preservation manually** before merging the D-12 task.

---

### `scripts/entry-server.tsx` (MODIFIED — eager-mount new routes)

**Analog:** `scripts/entry-server.tsx:21-44` itself.

**Eager import pattern** — copy from lines 9-16:

```tsx
import App from "../src/app/App.tsx";
import WelcomePage from "../src/app/pages/WelcomePage.tsx";
import PrivacyPage from "../src/app/pages/PrivacyPage.tsx";
import TermsPage from "../src/app/pages/TermsPage.tsx";
import RefundPage from "../src/app/pages/RefundPage.tsx";
// Phase 4 NEW imports:
import AboutPage from "../src/app/pages/AboutPage.tsx";
import GuidePage from "../src/app/pages/GuidePage.tsx";
import PayPage from "../src/app/pages/PayPage.tsx";  // D-12: was lazy in main.tsx; now eager for SSR
```

**Route block pattern** — copy + extend lines 28-40:

```tsx
<Routes>
  <Route path="/" element={<App />} />
  <Route path="/welcome" element={<WelcomePage />} />
  <Route path="/privacy" element={<PrivacyPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/refund" element={<RefundPage />} />
  {/* Phase 4 NEW: */}
  <Route path="/about" element={<AboutPage />} />          {/* RU only — no /en/about per D-02 */}
  <Route path="/pay" element={<PayPage />} />              {/* D-12 promotion */}
  <Route path="/guides/:slug" element={<GuidePage />} />
  {/* EN siblings */}
  <Route path="/en/"        element={<App />} />
  <Route path="/en/welcome" element={<WelcomePage />} />
  <Route path="/en/privacy" element={<PrivacyPage />} />
  <Route path="/en/terms"   element={<TermsPage />} />
  <Route path="/en/refund"  element={<RefundPage />} />
  <Route path="/en/pay"     element={<PayPage />} />        {/* D-12 promotion */}
  <Route path="/en/guides/:slug" element={<GuidePage />} />
  {/* NOTE: /success /account /dashboard/* are SPA-only — intentionally NOT mounted here. */}
</Routes>
```

**Critical rules:**
- D-02: `/about` has NO `/en/about` sibling.
- The mount table in `main.tsx` MUST mirror this exactly (modulo the SPA-only routes per existing comment at line 34) — see "EN_SIBLINGS SYNC chain" in Shared Patterns below.
- PayPage now eager-imported here. The lazy() at `main.tsx:18` MUST be replaced with an eager import (D-12 / RESEARCH §Pattern 4 Option A).

---

### `src/main.tsx` (MODIFIED — add new routes, de-lazy PayPage)

**Analog:** `src/main.tsx:46-71` itself.

**Eager-import section pattern** — copy from lines 5-9:

```tsx
import App from "./app/App.tsx";
import PrivacyPage from "./app/pages/PrivacyPage.tsx";
import TermsPage from "./app/pages/TermsPage.tsx";
import RefundPage from "./app/pages/RefundPage.tsx";
import WelcomePage from "./app/pages/WelcomePage.tsx";
// Phase 4:
import AboutPage from "./app/pages/AboutPage.tsx";
import GuidePage from "./app/pages/GuidePage.tsx";
import PayPage from "./app/pages/PayPage.tsx";  // D-12: was lazy; now eager for SSR parity
```

**Lazy section pattern** — copy from lines 18-21 (PayPage REMOVED, others stay):

```tsx
// PayPage NO LONGER lazy (D-12: SSR parity for pricing facts).
const SuccessPage = lazy(() => import("./app/pages/SuccessPage.tsx"));
const AccountPage = lazy(() => import("./app/pages/AccountPage.tsx"));
const DownloadSkillPage = lazy(() => import("./app/pages/DownloadSkillPage.tsx"));
```

**Route block** — copy from lines 50-67, add `/about`, `/guides/:slug`, `/en/guides/:slug`. The existing `/pay` and `/en/pay` mounts at lines 52 and 62 stay unchanged (path is the same — only the import switches from lazy to eager).

**Critical rules:**
- The comment at lines 14-21 about "SPA-fallback routes only — NEVER add App/Welcome/Privacy/Terms/Refund here" applies to the LAZY block. Promoting PayPage out of lazy DOES NOT violate this — it's joining the eager block. The comment may need updating to clarify the new shape ("PayPage is eager post-Phase-4 D-12 because its body is now prerendered").

---

### `src/i18n/paths.ts` (MODIFIED — extend EN_SIBLINGS)

**Analog:** `src/i18n/paths.ts:9-16` itself.

**Pattern** — copy lines 9-16, add ONLY the guide path (NOT `/about`, per D-02):

```ts
export const EN_SIBLINGS = new Set<string>([
  "/",
  "/welcome",
  "/pay",
  "/privacy",
  "/terms",
  "/refund",
  "/guides/midjourney-v7-prompts",  // Phase 4 D-06
]);
```

**Critical rules (`CONVENTIONS.md` §"EN_SIBLINGS SYNC Contract"):**
- SYNC chain: this file ↔ `scripts/seo-routes.ts` ↔ `src/main.tsx` ↔ `scripts/entry-server.tsx`. All four must agree on `/guides/<slug>`. `/about` appears in only THREE (paths.ts UNTOUCHED).
- `localizeHref` at lines 57-68 already handles parameterized paths because it does a `EN_SIBLINGS.has(path)` lookup — the SET MUST contain the FULL resolved path (e.g. `/guides/midjourney-v7-prompts`), not the pattern `/guides/:slug`. If multiple anchor slugs ship in Phase 4.1, each slug becomes its own entry (or `localizeHref` evolves to match prefixes — defer to that phase).

---

### `scripts/seo-routes.ts` (MODIFIED — add 3 entries + extend type + promote `/pay`)

**Analog:** `scripts/seo-routes.ts:33-247` itself (12 existing entries).

**Existing entry pattern** — copy from lines 35-51 (the `/` entry):

```ts
{
  path: "/",
  htmlLang: "ru",
  hreflangAlternates: {
    ru: `${SITE_ORIGIN}/`,
    en: `${SITE_ORIGIN}/en/`,
    xDefault: `${SITE_ORIGIN}/`,
  },
  title: "…",
  description: "…",
  canonical: `${SITE_ORIGIN}/`,
  ogTitle: "…",
  ogDescription: "…",
  prerender: "full",
  changefreq: "weekly",
  priority: 1.0,
  schema: [/* Phase 4 NEW */],
},
```

**New `/about` entry** (RU only — `hreflangAlternates.en` points at landing fallback per D-02):

```ts
{
  path: "/about",
  htmlLang: "ru",
  hreflangAlternates: {
    ru: `${SITE_ORIGIN}/about`,
    en: `${SITE_ORIGIN}/`,         // D-02: no /en/about; fallback to landing
    xDefault: `${SITE_ORIGIN}/about`,
  },
  title: "О проекте Opten — кто стоит за расширением",
  description: "Opten — личный проект В. Воронежцева. История создания, команда, контакты.",
  canonical: `${SITE_ORIGIN}/about`,
  ogTitle: "О проекте Opten",
  ogDescription: "История создания Opten — расширения для оценки промптов.",
  prerender: "full",
  changefreq: "yearly",
  priority: 0.5,
  schema: [ORG_BLOCK, PERSON_FOUNDER_BLOCK, /* breadcrumb */],
},
```

**New `/guides/<slug>` entries** (bilingual — fully reciprocal hreflang per D-06):

```ts
{
  path: "/guides/midjourney-v7-prompts",
  htmlLang: "ru",
  hreflangAlternates: {
    ru: `${SITE_ORIGIN}/guides/midjourney-v7-prompts`,
    en: `${SITE_ORIGIN}/en/guides/midjourney-v7-prompts`,
    xDefault: `${SITE_ORIGIN}/guides/midjourney-v7-prompts`,
  },
  // …
  prerender: "full",
  changefreq: "monthly",
  priority: 0.7,
  schema: [/* HowTo, FAQPage, Breadcrumb, Org */],
},
// + mirror entry for /en/guides/midjourney-v7-prompts (same as the EN entries at lines 139-246)
```

**`/pay` and `/en/pay` D-12 promotion** — change ONE field per route:

```ts
// scripts/seo-routes.ts:53 entry — flip prerender from "head" to "full"
{
  path: "/pay",
  // …existing fields…
  prerender: "full",  // ← was "head"; D-12
  // …
  schema: [ORG_BLOCK, /* Product, Breadcrumb */],
},
// same flip for /en/pay at line 158
```

**Critical rules:**
- The file-header SYNC comment at line 2 ("title/description strings duplicated from src/i18n/ru.json") still applies — keep new `title`/`description` strings in step with `ru.json`/`en.json` chrome keys.
- `sitemap.mjs:29-31` floor check expects ≥ 12 routes — Phase 4 brings it to 15 (12 baseline + about + 2 guide siblings). The floor needs bumping if planner wants the check to remain meaningful (recommend `< 15` for the new floor).

---

### `src/i18n/ru.json` + `en.json` (MODIFIED — new chrome keys)

**Analog:** `src/i18n/ru.json:21-25` itself (existing `nav.*` keys).

**New keys to add** (chrome only — body copy stays in components / `src/content/guides/`):

```json
"nav.about": "О проекте",                          // RU only — gate via lang in App.tsx (D-16)
"nav.guides": "Гайды",                             // ru.json
"faq.heading": "Часто задаваемые вопросы",
"faq.q1": "…", "faq.a1": "…",                      // 5-6 pairs
// /about page-chrome strings (titles for sections — body is in TSX per D-07 / human-written)
"about.title": "…", "about.tagline": "…",
// /guides chrome strings — title placeholders, FAQ heading override, etc.
"guide.howToHeading": "Как это сделать", "guide.faqHeading": "Вопросы по теме",
```

Mirror in `en.json` (omit `nav.about` per D-16 OR include "Coming soon" stub label — planner's call).

---

### `src/app/pages/PayPage.tsx` (MODIFIED — extract PricingStaticBlock)

**Analog:** itself (lines 434-528).

**Refactor steps** (per RESEARCH §Pattern 4):

1. Move JSX lines 434-528 into `<PricingStaticBlock defaultCurrency={defaultCurrency} />` in the new component file. Replace runtime-conditional CTAs (`extStatus === "ready" ? ...`) with a static fallback (`<a href={CHROME_STORE_URL}>`) — the runtime CTA layer is appended OUTSIDE the static block in the live page.
2. PayPage now renders: `<header chrome>` + `<PricingStaticBlock />` + `<runtime CTA layer (currency toggle, status messages, Paddle buttons)>` + `<footer chrome>`.
3. Update `main.tsx`: remove `const PayPage = lazy(...)` (line 18); add eager import at top.
4. Update `entry-server.tsx`: add eager import + `<Route path="/pay">` and `<Route path="/en/pay">`.
5. Update `seo-routes.ts`: flip both `/pay` and `/en/pay` to `prerender: "full"`.

**Hardcoded constants stay** (`PayPage.tsx:10-17`): `SUPABASE_FUNCTIONS_URL`, `SUPABASE_ANON_KEY`, `CHROME_STORE_URL`, `EXTENSION_IDS` — untouched. INTEGRATION-CONTRACT §6 invariant.

---

### `public/robots.txt` (MODIFIED — append Content-Signal)

**Analog:** itself (lines 1-56).

**Pattern** — append after line 55 (`Sitemap:` line), before EOF:

```
Sitemap: https://opten.space/sitemap.xml

# Phase 4 D-14: AI-Preferences (IETF draft)
Content-Signal: search=yes, ai-train=yes, ai-retrieval=yes
```

The `Content-Signal:` directive is at file scope (not per-User-agent), which is how the IETF draft suggests it.

---

### `vercel.json` (MODIFIED — append X-Frame-Options)

**Analog:** itself (`vercel.json:6-13`).

**Pattern** — extend the `headers[0].headers` array (lines 7-12):

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy",        "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy",     "value": "camera=(), microphone=(), geolocation=(), payment=(self \"https://*.paddle.com\")" },
        { "key": "X-Frame-Options",        "value": "SAMEORIGIN" }
      ]
    }
  ],
  "functions": {
    "api/download-skill.ts": {
      "includeFiles": "api/_assets/**"
    }
  }
}
```

**Critical rules:**
- D-14 / PROJECT.md "Out of Scope": DO NOT add `Content-Security-Policy` here. The Paddle inline-script + nonce coordination is deferred to a separate ticket. Verify the planner does not silently bundle a CSP header into the same edit.

---

### `package.json` (MODIFIED — wire llms.mjs into build chain)

**Analog:** itself (line 7).

**Pattern** — extend the `build` chain (appending llms.mjs after sitemap.mjs is the simplest hook; "postbuild" npm-script convention is not used here per `Grep` confirming zero occurrences):

```json
"build": "vite build && vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir && vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta && node scripts/prerender.mjs && node scripts/sitemap.mjs && node scripts/llms.mjs"
```

---

## Shared Patterns

### Authentication / Authorization

**Not applicable to Phase 4.** All new pages (`/about`, `/guides/*`) are public marketing surfaces — no JWT, no extension messaging, no Supabase calls. The single exception is the D-12 PayPage refactor, which preserves but does not touch the existing extension-coupling at `PayPage.tsx:10-17, 179-205` (INTEGRATION-CONTRACT §6).

### Error Handling

**Source:** `scripts/prerender.mjs` (every `applyXxx` function lines 35-180)
**Apply to:** Every new build-time HTML mutator (`applyJsonLd`, `applyHeroPreload`, anything else introduced).

```js
function applyXxx(html, meta) {
  const before = html;  // OR: regex pre-check
  html = html.replace(/* anchor */, /* replacement */);
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no <anchor> matched. index.html structure changed?`);
  }
  return html;
}
```

**Source:** `scripts/sitemap.mjs:29-31` (floor check)
**Apply to:** `scripts/llms.mjs`.

```js
if (fullRoutes.length < EXPECTED_COUNT) {
  throw new Error(`script: expected at least ${EXPECTED_COUNT} routes, got ${fullRoutes.length}.`);
}
```

**Source:** `src/app/pages/PayPage.tsx:179-205` (extension detection try/catch)
**Apply to:** No new pages need this in Phase 4 (no new extension/Supabase calls).

### Internal Navigation

**Source:** `src/app/components/LocalizedLink.tsx:1-22` + `src/app/components/layout/LegalLayout.tsx:17-27, 44-51`
**Apply to:** Every new navbar/footer link to `/about`, `/guides/<slug>`, `/pay`, etc.

```tsx
import LocalizedLink from "../components/LocalizedLink";

// Internal link (rewrites to /en/<sibling> on /en/* URLs IF sibling exists in EN_SIBLINGS):
<LocalizedLink to="/pay">{t("nav.pricing")}</LocalizedLink>
<LocalizedLink to="/guides/midjourney-v7-prompts">{t("nav.guides")}</LocalizedLink>

// /about link — non-sibling; LocalizedLink will NOT rewrite it (returns "/about" unchanged on /en/*).
// D-16 mitigation: gate the link by lang at the call site.
{lang === "ru" && <LocalizedLink to="/about">{t("nav.about")}</LocalizedLink>}
```

**Anti-conventions (`CONVENTIONS.md`):**
- NEVER use bare `<Link>` for new internal navigation.
- NEVER hand-roll `"/en" + path` concatenation.
- NEVER import from `react-router-dom` (this project uses `react-router` v7 — verified zero occurrences of `react-router-dom`).

### EN_SIBLINGS SYNC Chain

**Source:** `CONVENTIONS.md` §"EN_SIBLINGS SYNC Contract" + `src/i18n/paths.ts:1-3` SYNC header.
**Apply to:** Adding `/guides/<slug>` (NOT `/about`, per D-02).

The 4 files that must agree:

1. `src/i18n/paths.ts:9-16` — `EN_SIBLINGS` set (used by `LocalizedLink` + `LangSwitcher`).
2. `scripts/seo-routes.ts:33-247` — manifest entries (RU `hreflangAlternates.en` + parallel EN entry).
3. `src/main.tsx:46-71` — `<Route path="/en/...">` declarations.
4. `scripts/entry-server.tsx:21-44` — `<Route path="/en/...">` declarations.

Missing any one of these breaks SPA navigation, prerender, or SEO. `/about` appears in #2, #3, #4 — and NOT in #1.

### SSR / Prerender Safety

**Source:** `CONVENTIONS.md` §"SSR / Prerender Constraints" + `src/main.tsx:14-21` comment + `src/i18n/LangContext.tsx:25, 62`.
**Apply to:** Every new prerendered page (`AboutPage`, `GuidePage`) and every component used by them (`FaqBlock`, `PricingStaticBlock`).

Rules:
- No `window`, `localStorage`, `navigator` reads at render time. Gate browser APIs behind `useEffect` or `typeof window === "undefined"` checks.
- No `React.lazy()` for any component reachable from `entry-server.tsx`. Eager imports only.
- `<html lang>` MUST NOT be mutated at runtime via `document.documentElement.lang = ...` (the bug that Plan 01 of Phase 3 fixed). The per-route `htmlLang` is baked at build time by `applyHtmlLang` in `prerender.mjs`.

### Validation

**Not applicable.** No form inputs in new pages. Schema blocks are validated post-deploy via Google Rich Results Test (manual). No build-time JSON-LD validation library (rejected in RESEARCH §"Alternatives Considered").

### Atomic Commit Convention

**Source:** `CLAUDE.md` §"Comments" + Phase 1/2/3 git history + `CONTEXT.md` "Established Patterns" point 3.
**Apply to:** Every plan task — one commit per requirement.

Recommended commit boundaries for Phase 4:
- Schema bundle (manifest + apply helper) — one commit.
- AboutPage page + content — one commit.
- GuidePage page + content data module — one commit.
- FaqBlock component + landing wire-up — one commit.
- PricingStaticBlock extract + /pay full-prerender flip — separate commit (billing surface).
- llms.mjs script + build wire-up — one commit.
- Hero preload helper — one commit.
- robots.txt + vercel.json headers — one commit.

Comment convention: `// Phase 4 D-09:`, `// Phase 4 D-12:`, `// Phase 4 D-14:` etc. — matches `// Phase 3 D-05:` etc. across `src/main.tsx`, `LangContext.tsx`, `paths.ts`, `LangSwitcher.tsx`.

### Static-File Shadowing

**Source:** Phase 2 D-01 (`STRUCTURE.md` "Where to Add New Code" point 1).
**Apply to:** All new routes (`/about`, `/guides/<slug>`, `/en/guides/<slug>`).

Vercel SPA rewrite (`vercel.json:3`: `/((?!api/).*) → /index.html`) is a FALLBACK. The prerender step emits real files (`dist/about/index.html`, `dist/guides/<slug>/index.html`, `dist/en/guides/<slug>/index.html`) that Vercel serves before falling through to the rewrite. No additional `vercel.json` route is needed — the static-file path takes precedence automatically.

### Locked Routes (extension-coupled)

**Source:** `CLAUDE.md` §"Locked routes" + `docs/INTEGRATION-CONTRACT.md` §3.
**Apply to:** Phase 4 is ADDITIVE — `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` are NOT renamed. `/pay` body promotion (D-12) keeps the path and the synchronous Paddle `<script>` (INTEGRATION-CONTRACT §6 / `prerender.mjs:192` gate). New routes (`/about`, `/guides/*`) are pure additions.

---

## No Analog Found

None. Every Phase 4 file has a concrete analog in the existing codebase. The phase is intentionally an additive layer on top of well-established Phase 2/3 patterns.

The only genuinely-new directory is `src/content/guides/` — but its shape is dictated by the typed-manifest pattern already in use at `scripts/seo-routes.ts:10-30`, so it has a structural analog even without a literal sibling file.

---

## Metadata

**Analog search scope:**
- `src/app/pages/**` — `WelcomePage.tsx`, `PrivacyPage.tsx`, `PayPage.tsx`, full structure scan
- `src/app/components/**` — `LegalLayout.tsx`, `LangSwitcher.tsx`, `LocalizedLink.tsx`, `ui/accordion.tsx`
- `src/i18n/**` — `LangContext.tsx`, `paths.ts`, `ru.json`
- `scripts/**` — `prerender.mjs`, `seo-routes.ts`, `entry-server.tsx`, `sitemap.mjs`
- Root config — `index.html`, `vercel.json`, `package.json`, `public/robots.txt`, `public/llms.txt`

**Files scanned via Read:** 18
**Files scanned via Grep:** 4 (`Accordion` usage, `postbuild`/`llms` script presence, `LocalizedLink`/`nav.` patterns in `App.tsx`, `PricingFeature`/`Divider` references)

**Pattern extraction date:** 2026-05-17

---

*Phase: 4 — Content surface*
*Pattern mapping: 2026-05-17*
