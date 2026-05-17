---
phase: 04-content-surface
reviewed: 2026-05-17T00:00:00Z
depth: standard
files_reviewed: 19
files_reviewed_list:
  - public/robots.txt
  - scripts/entry-server.tsx
  - scripts/llms.mjs
  - scripts/prerender.mjs
  - scripts/seo-routes.ts
  - scripts/sitemap.mjs
  - src/app/App.tsx
  - src/app/components/FaqBlock.tsx
  - src/app/components/PricingStaticBlock.tsx
  - src/app/pages/AboutPage.tsx
  - src/app/pages/GuidePage.tsx
  - src/app/pages/PayPage.tsx
  - src/content/guides/gpt-image-2.ts
  - src/content/guides/index.ts
  - src/content/landingFaq.ts
  - src/i18n/en.json
  - src/i18n/paths.ts
  - src/i18n/ru.json
  - src/main.tsx
findings:
  critical: 2
  warning: 9
  info: 6
  total: 17
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-05-17T00:00:00Z
**Depth:** standard
**Files Reviewed:** 19
**Status:** issues_found

## Summary

Phase 4 expands the GEO/SEO surface with prerendered JSON-LD blocks, a postbuild
`llms.txt`/`llms-full.txt` emitter, an /about E-E-A-T page, a bilingual guide
template, a shared `FaqBlock`, and the /pay full-prerender flip. The
infrastructure work is solid (good fail-fast anchors in `prerender.mjs`, sound
SSR boundaries, manifest-driven hreflang). However the JSON-LD pipeline has a
**script-injection vulnerability** (CR-01) — embedded user-curated content can
break out of the `<script type="application/ld+json">` tag because
`JSON.stringify` does not escape `</script>` or `<`. There is also a customer-
facing **legal/refund inconsistency** (CR-02) where the RU `/refund` meta
description advertises a 7-day refund window while the page body and EN
counterpart state 3 days — the same description is also indexed by Google,
sitemap-listed, and emitted into llms.txt.

Beyond that: per-route `ogImage` overrides set in the EN manifest are silently
ignored by `applyMeta` (every EN file still serves `og-card-ru.png`); the /pay
Schema.org `Product` block ships a price-zero "Free tier" inside `offers` which
misrepresents the tier as a paid offer; the breadcrumbs on both guide routes
point at `/guides` which is not a real route; `detectExtension` has a state-
oscillation race; and the FaqBlock visible Q/A do not actually validate that
they match the JSON-LD `mainEntity` at build time (V-10 is a convention, not a
gate). Several smaller robustness, accessibility, and typing issues round out
the WARNING bucket.

## Critical Issues

### CR-01: JSON-LD `<script>` injection — `applyJsonLd` does not escape `</script>` or `<` in serialized strings

**File:** `scripts/prerender.mjs:186-203`
**Issue:** `applyJsonLd` does:
```js
const body = JSON.stringify(block, null, 2)
  .split("\n").map(l => "    " + l).join("\n");
return `    <script type="application/ld+json">\n${body}\n    </script>`;
```
`JSON.stringify` is **not HTML-safe**. If any string field inside a
`SchemaBlock` contains the literal substring `</script>` (case-insensitive,
with optional whitespace, etc.) the browser HTML tokenizer will close the
script tag *inside the JSON payload*, leak the remainder of the JSON as page
markup, and any `<script>` later in the JSON becomes executable. The same
class of vulnerability applies to a literal `<!--`. The schema today is built
from human-curated content (`gptImage2Guide.ru.faq`, `landingFaq.ru`,
breadcrumb names, page descriptions, `gptImage2Guide.ru.title`) — *any future
edit* to those sources, or a new guide adding "see `<script src=...>` tag
example" or "use the closing `</script>` sentinel" to its body, ships an XSS
to every prerendered page.

This is a BLOCKER because (a) the surface is large (15 prerendered routes,
each currently carrying 2-4 schema blocks built from RU/EN content strings);
(b) the input is unchecked — there is no build-time assert that strings
contain neither `</` nor `<!--`; (c) it permanently lives in `dist/**/index.html`
so even a CSP nonce policy can't catch it; (d) `extractText` in `llms.mjs`
strips `<script>` blocks *before* HTML decoding so the injection wouldn't even
appear in llms-full.txt — it only manifests in the live HTML.

**Fix:**
```js
function escapeJsonLd(s) {
  // Escape characters that terminate HTML parsing inside <script>, plus the two
  // separator codepoints (U+2028, U+2029) that historically broke older parsers.
  return s
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(new RegExp(String.fromCharCode(0x2028), "g"), String.fromCharCode(0x2028))
    .replace(new RegExp(String.fromCharCode(0x2029), "g"), String.fromCharCode(0x2029));
}

function applyJsonLd(html, meta) {
  if (!meta.schema || meta.schema.length === 0) return html;
  const blocks = meta.schema
    .map((block) => {
      const body = escapeJsonLd(JSON.stringify(block, null, 2))
        .split("\n").map((l) => "    " + l).join("\n");
      return `    <script type="application/ld+json">\n${body}\n    </script>`;
    })
    .join("\n");
  // ... rest unchanged
}
```
The `<`/`>` escapes are valid JSON, preserved by every JSON-LD
parser (Google, schema.org, Rich Results Test), and make `</script>`
impossible to construct from any input string. Add a defensive assertion at
the top: `if (/<\/script/i.test(JSON.stringify(meta.schema))) throw new Error(...)`
so a regression surfaces at build, not in production.

---

### CR-02: `/refund` RU meta description states "7 dней" but the policy body and EN sibling state "3 days" — published to search, sitemap, and llms.txt

**File:** `scripts/seo-routes.ts:361` (RU) vs. `src/i18n/ru.json:216` (RU body) and `scripts/seo-routes.ts:599` (EN)
**Issue:**
- `scripts/seo-routes.ts:361` (RU `/refund`): `description: "...Возврат в течение 7 дней при неиспользовании платных функций."`
- `scripts/seo-routes.ts:364` (RU `/refund`): `ogDescription: "Возврат средств за подписку Opten Pro в течение 7 дней при неиспользовании платных функций."`
- `src/i18n/ru.json` refund body (`3.1.1`): "...прошло не более **3 (трёх) календарных дней**..."
- `scripts/seo-routes.ts:599-602` (EN `/refund`): `description: "...Full refund within **3 days** if paid features are unused."`

The RU `/refund` description ships in (a) `<meta name="description">` in
`dist/refund/index.html`, (b) `<meta property="og:description">`, (c) `<meta
name="twitter:description">`, (d) the rendered title-card preview when shared,
(e) `dist/sitemap.xml` indirectly via the canonical, and (f) the RU `/refund`
section of `dist/llms-full.txt`. Search engines will index "7 days" while the
actual contract terms are "3 days" — this is a customer-facing legal/refund
policy mismatch. Treating this as BLOCKER because the legal exposure (and
support ticket cost) is real even if technically the body governs.

**Fix:** Bring the RU description in line with the body (and EN sibling):
```ts
// scripts/seo-routes.ts line 361
description: "Условия возврата средств за подписку и разовый доступ к Opten. Возврат в течение 3 дней при неиспользовании платных функций.",
// line 364
ogDescription: "Возврат средств за подписку Opten Pro в течение 3 дней при неиспользовании платных функций.",
```
Long-term: dedupe `description`/`ogDescription` and the policy body so they
can't drift (a single i18n key consumed by both the manifest builder and the
page renderer).

## Warnings

### WR-01: Per-route `ogImage` overrides are silently ignored — every EN page ships the RU OG card

**File:** `scripts/prerender.mjs:86-104, 223-226`
**Issue:** `applyMeta` swaps `<meta property="og:url">`, `og:title`,
`og:description`, `twitter:title`, `twitter:description`, and injects
`<link rel="canonical">` — but it never touches `<meta property="og:image">`.
The loop at line 225 reads `const ogImage = meta.ogImage ?? DEFAULT_OG_IMAGE`
and the comment at line 226 acknowledges "ogImage is read but not currently
re-injected — index.html already has og-card-ru.png hardcoded".

Phase 3 D-04 and Phase 4 deliberately set `ogImage: DEFAULT_OG_IMAGE_EN` on
seven EN routes (seo-routes.ts lines 463, 483, 519, 547, 575, 603, 633). All
of these settings are dead code — every EN file ends up advertising
`og-card-ru.png` to Facebook, LinkedIn, Twitter, Telegram, and OG scrapers.

**Fix:** Add an og:image swap inside `applyMeta` (or as a dedicated helper run
after it):
```js
const ogImage = meta.ogImage ?? DEFAULT_OG_IMAGE;
html = html.replace(
  /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
  `<meta property="og:image" content="${escapeAttr(ogImage)}" />`
);
// Also swap twitter:image for symmetry.
html = html.replace(
  /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
  `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`
);
```
Remove the misleading comment once the swap lands. Verify by grepping
`dist/en/**/index.html` for `og-card-en.png`.

---

### WR-02: `Product`/`AggregateOffer` includes a zero-price "Free tier" offer — misrepresents pricing to Google Rich Results

**File:** `scripts/seo-routes.ts:253-260, 489-496`
**Issue:** Both `/pay` and `/en/pay` build the Product schema via
`productBlock([...{name: "Free tier", price: "0", currency: "USD"}], ...)`.
Since the currencies are mixed (RUB + USD + USD) the `productBlock` function
falls into the multi-currency branch and emits a raw `offers` array — *which
includes the Free tier as a paid Offer with price="0" priceCurrency="USD"*.
Per schema.org/Offer and Google's Merchant guidelines a $0.00 paid offer is
either ignored or flagged; semantically Opten Pro is the *Product* and the
free tier is a separate plan that should not appear in the Pro Product's
offers. (Worse: AggregateOffer's lowPrice would become "0" if currencies
collapsed to one, dragging the displayed price range down to "from $0".)

**Fix:** Filter zero-price tiers out before computing offers, or model the
free tier as a separate Product entirely:
```ts
productBlock(
  [
    { name: "Pro Monthly (RU)", price: "199", currency: "RUB" },
    { name: "Pro Monthly",     price: "2.99", currency: "USD" },
  ],
  `${SITE_ORIGIN}/pay`,
),
```

---

### WR-03: Guide breadcrumbs link to `/guides` — a route that does not exist

**File:** `scripts/seo-routes.ts:438-446, 645-653`
**Issue:** Both guide routes emit:
```ts
breadcrumbBlock([
  { name: "Главная", url: `${SITE_ORIGIN}/` },
  { name: "Гайды",   url: `${SITE_ORIGIN}/guides` },        // 404
  { name: gptImage2Guide.ru.title, url: `${SITE_ORIGIN}/guides/gpt-image-2` },
], ...)
```
There is no `/guides` route in `seo-routes.ts`, `entry-server.tsx`, or
`main.tsx`. Crawlers following the breadcrumb chain hit the SPA fallback,
which serves dist/index.html with `__PRERENDER_PATH="/"` then main.tsx falls
through to the SPA's default route, which is the landing — but with the URL
`/guides` showing in the address bar. This is a soft 404 (200 OK content, wrong
URL) and crawlers usually mark these as low-quality duplicates.

**Fix:** Either (a) ship a /guides index page in Phase 4.1 (preferred — adds a
real entry to the site map) or (b) collapse the breadcrumb to two levels for
v1:
```ts
breadcrumbBlock([
  { name: "Главная", url: `${SITE_ORIGIN}/` },
  { name: gptImage2Guide.ru.title, url: `${SITE_ORIGIN}/guides/gpt-image-2` },
], ...)
```

---

### WR-04: `detectExtension` race — first-success can be overwritten by a later "not_installed"

**File:** `src/app/pages/PayPage.tsx:185-215`
**Issue:**
```js
for (const id of EXTENSION_IDS) {
  try {
    chrome.runtime.sendMessage(id, {...}, (response) => {
      tried++;
      if (chrome.runtime.lastError || !response) {
        if (tried >= EXTENSION_IDS.length) setExtStatus("not_installed");
        return;
      }
      if (response.token) { setExtStatus("ready"); ... }
      else                  setExtStatus("not_logged_in");
    });
  } catch { tried++; if (tried >= EXTENSION_IDS.length) setExtStatus("not_installed"); }
}
```
All IDs are messaged in parallel. If ID #1 succeeds and triggers
`setExtStatus("ready")` synchronously inside its callback, ID #2's callback
(which always runs because Chrome invokes it with a lastError when the ID
doesn't match) will increment `tried` to 2 (= EXTENSION_IDS.length) and run
`setExtStatus("not_installed")` — overwriting the "ready" state. The user
sees the install banner even though detection succeeded. Same flaw inverted:
if ID #2 (local dev) succeeds first, ID #1's callback may fire later and
still re-flip to "not_installed".

This is a real bug on dual-ID dev machines (where both IDs may resolve), and
a latent bug for production users when a future build adds a 3rd ID.

**Fix:** Capture a "resolved" flag and bail out:
```js
let resolved = false;
for (const id of EXTENSION_IDS) {
  try {
    chrome.runtime.sendMessage(id, {...}, (response) => {
      tried++;
      if (resolved) return;
      if (chrome.runtime.lastError || !response) {
        if (tried >= EXTENSION_IDS.length && !resolved) setExtStatus("not_installed");
        return;
      }
      resolved = true;
      if (response.token) { setToken(...); setExtStatus("ready"); fetchSubscription(response.token); }
      else                  setExtStatus("not_logged_in");
    });
  } catch { ... }
}
```

---

### WR-05: `productBlock` AggregateOffer reduce uses string compare-by-parseFloat without locale or NaN guards

**File:** `scripts/seo-routes.ts:179-194`
**Issue:** When currencies collapse to one, lowPrice/highPrice are computed
via:
```ts
plans.reduce((min, p) => (parseFloat(p.price) < parseFloat(min) ? p.price : min), plans[0].price)
```
- `parseFloat("2,99")` (comma decimal) returns `2`, silently producing wrong
  prices. Today all prices are dot-decimal strings — but the type signature
  (`price: string`) does not enforce this.
- `parseFloat("free")` returns `NaN`. `NaN < anything` is false, so a bad
  price silently becomes the highPrice survivor.
- `parseFloat("$2.99")` returns `NaN` (leading `$`).
- The reduce also calls `parseFloat(min)` on every iteration where `min` is
  already a confirmed-minimum string — re-parsing is wasted work but harmless.

Combined with WR-02 (free tier in the array), a future single-currency call
with `[{price: "0"}, {price: "2.99"}]` would emit `lowPrice: "0"` — Rich
Results Test will accept it and show "from $0" in search.

**Fix:** Normalize and validate input at the top of `productBlock`:
```ts
const parsed = plans.map((p) => {
  const n = Number(p.price);
  if (!Number.isFinite(n)) throw new Error(`productBlock: invalid price "${p.price}" for ${p.name}`);
  return { ...p, _num: n };
});
// Then compute min/max with parsed[i]._num and return the formatted string.
```

---

### WR-06: `path` from manifest used to build filesystem path in `llms.mjs` without traversal guard

**File:** `scripts/llms.mjs:84-90`
**Issue:**
```js
const outPath = meta.path === "/"
  ? resolve(DIST, "index.html")
  : meta.path === "/en/"
    ? resolve(DIST, "en", "index.html")
    : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");
```
Source paths come from `seo-routes.ts` (trusted today, all hardcoded). But a
future authoring mistake — `path: "/about/../../etc/passwd"` or even
`path: "/guides/../landing"` — would silently `readFile` outside `DIST` and
embed the content into llms-full.txt. The same pattern in `prerender.mjs:250`
would silently write outside `DIST`.

Not exploitable today (manifest is source-controlled, not user-controlled),
but the cost of a guard is one line and it locks in the invariant.

**Fix:** Validate that the resolved path stays under DIST:
```js
const outPath = ...;
if (!outPath.startsWith(DIST + sep) && outPath !== resolve(DIST, "index.html")) {
  throw new Error(`llms.mjs: path "${meta.path}" escapes DIST`);
}
```
Or simpler: reject any `meta.path` containing `..`, backslash, or absolute
prefixes in seo-routes' RouteMeta validator.

---

### WR-07: `extractText` HTML-entity decoding handles only 5 entities — every other entity leaks raw into llms-full.txt

**File:** `scripts/llms.mjs:68-82`
**Issue:** Only `&nbsp; &amp; &lt; &gt; &quot; &#39;` are decoded. If React's
SSR emits any other named entity (`&mdash;`, `&hellip;`, `&laquo;`,
`&raquo;`) or numeric reference (`&#8211;`, `&#x2014;`) for content in the
legal bodies / guide bodies / landing copy, llms-full.txt will read e.g.
`Opten &mdash; расширение` verbatim, degrading the corpus quality for AI
consumers (the file's stated purpose).

Lower severity than the others because: (a) React 18 renderToString typically
emits unicode characters directly rather than entities; (b) the file is for
AI ingestion not user display. But entity leakage is observable in
`dist/llms-full.txt` after the next legal-page edit that introduces an
HTML-escaped entity in source.

**Fix:** Use a comprehensive decoder. Minimal viable:
```js
.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
.replace(/&\w+;/g, "")  // strip any remaining named entity rather than leak
```
or pull in `html-entities` as a devDependency for full coverage.

---

### WR-08: `FaqBlock` receives `landingFaq[lang]` typed `readonly FaqItem[]` (due to `as const`) but is declared `FaqItem[]` — same for `faqPageBlock`

**File:** `src/app/components/FaqBlock.tsx:13-15`, `scripts/seo-routes.ts:123-134`
**Issue:** `src/content/landingFaq.ts:62` exports `export const landingFaq = { ru, en } as const;` — TypeScript infers the inner arrays as `readonly FaqItem[]`. Callers:
- `App.tsx:567` `<FaqBlock items={landingFaq[lang]} />` — `FaqBlock` declares `items: FaqItem[]`.
- `seo-routes.ts:232, 468` `faqPageBlock(landingFaq.ru, ...)` — `faqPageBlock` declares `items: { q: string; a: string }[]`.

With strict TS settings (the default `strict: true` enables variance checks on
Array element types), this should fail to compile because `readonly T[]` is
not assignable to `T[]`. The fact that `npm run build` apparently succeeds
suggests either (a) TS infers a wider mutable type than expected, or (b) the
existing `tsconfig.json` is lax. Either way the contract is wrong — `FaqBlock`
does not mutate `items` and should declare `readonly FaqItem[]`.

**Fix:**
```ts
// FaqBlock.tsx
interface Props {
  items: readonly FaqItem[];
  ...
}
// seo-routes.ts faqPageBlock signature
export function faqPageBlock(items: readonly { q: string; a: string }[], pageId: string): SchemaBlock { ... }
```

---

### WR-09: V-10 (visible Q/A == schema mainEntity) is a convention, not a gate

**File:** `src/content/landingFaq.ts:1-9`, `src/content/guides/gpt-image-2.ts`, `scripts/seo-routes.ts:232, 437, 468, 644`
**Issue:** Both `App.tsx` and `seo-routes.ts` consume the same `landingFaq` source — V-10 holds by construction. Same for guides: `GuidePage` uses `data.faq` and `seo-routes.ts` uses `gptImage2Guide.ru.faq`. There is no build-time assertion enforcing this. A future refactor that introduces a separate "landing FAQ" array for the page (because it needs a 6th question that doesn't fit the rich-snippets brief) would silently desync the visible Q/A from the JSON-LD `mainEntity` — which is the *specific* anti-pattern Google penalizes (mismatched FAQPage schema = manual action).

This is a process / regression-protection gap rather than an active bug. Worth a guard now because adding it later won't catch the regression that already broke.

**Fix:** Add a verification script run from `npm run build` post-prerender:
```js
// scripts/verify-faq-mainentity.mjs
import { JSDOM } from "jsdom"; // already devDep? if not, regex
import { readFile } from "node:fs/promises";

for (const route of ROUTES_WITH_FAQ) {
  const html = await readFile(distPath(route), "utf-8");
  const jsonLdFaq = extractFaqMainEntity(html); // parse <script type="application/ld+json"> blocks
  const visibleQs = extractVisibleQuestions(html); // parse <dt> contents of FaqBlock
  assertEqualSet(jsonLdFaq, visibleQs, route);
}
```

## Info

### IN-01: `Pricing` heading copy is hardcoded in JSX instead of i18n keys

**File:** `src/app/App.tsx:427-438`
**Issue:** The H2 inside `Pricing` is built from inline RU/EN spans (`<span>Скачай бесплатно. <Accent>Перейди на Pro,</Accent> когда будешь готов.</span>` and the EN equivalent) — both literally inlined. The pattern everywhere else in App.tsx uses `t("...")`. There is even an unused `t("pricing.heading")` in both ru.json (line 61) and en.json (line 61) that appears to be the original key. Either restore the i18n lookup or delete the unused dictionary entry.
**Fix:** Restore `t("pricing.heading")` (with a structured key for the accent split, or accept the simpler markup), or delete `pricing.heading` from both dictionaries.

---

### IN-02: `<a href="/#faq">` on PayPage crosses the lang boundary for EN users

**File:** `src/app/pages/PayPage.tsx:378`
**Issue:** `<a href="/#faq">` hardcodes the RU landing; on /en/pay it sends the user across the lang boundary to RU. Same issue exists for any `<a href="#...">` rendered on /en/pay since those anchors only exist on the landing (which is RU when the prefix is dropped).
**Fix:** Compute `const homeHash = lang === "en" ? "/en/#faq" : "/#faq";` and use that, or extend `<LocalizedLink>` to accept a hash and route through the EN prefix.

---

### IN-03: `entry-server.tsx` does not declare `/en/about` Route — request to `/en/about` during prerender would fall through

**File:** `scripts/entry-server.tsx:31-49`
**Issue:** This is intentional per D-01/D-02 (no `/en/about` sibling exists). However seo-routes.ts also omits the entry so prerender.mjs never asks for it — safe today. If a future seo-routes.ts entry is added for `/en/about` without also adding the Route in entry-server.tsx, prerender would emit a body containing the RouteLoading fallback (or the landing). Add a comment-asserted contract or a runtime assert in prerender.mjs that every `meta.path` of tier "full" matches at least one Route — defense-in-depth.
**Fix:** Add a build-time check listing the routes mounted in entry-server.tsx and asserting every `routes.filter(prerender === "full").map(.path)` is covered.

---

### IN-04: `Privacy` component id collides semantically with the `/privacy` legal route

**File:** `src/app/App.tsx:386-389`
**Issue:** The section id was renamed from "faq" to "privacy" so the navbar `#faq` link could correctly scroll to the actual FaqBlock. The rename is correct, but "privacy" as an id is now ambiguous with the `/privacy` legal page. Consider `id="trust"` or `id="data-handling"` — both better describe what the section actually contains and avoid the path-shaped confusion.
**Fix:** Optional rename `id="privacy"` → `id="trust"` (no functional impact; navbar links do not use this anchor).

---

### IN-05: Magic-number duplication of preload font filenames in `prerender.mjs` regression guard

**File:** `scripts/prerender.mjs:210-213`
**Issue:** The two regex literals hardcode `/fonts/PT-Root-UI_VF.woff2` and `/fonts/Unbounded-VF.woff2`. If the filenames change (Vite cache-busting hash future, or a font swap), the guard will throw on every route even though the new filenames are present. Extract the font basenames to a constant at module top:
```js
const REQUIRED_FONT_PRELOADS = ["PT-Root-UI_VF.woff2", "Unbounded-VF.woff2"];
const FONT_PRELOAD_REGEXES = REQUIRED_FONT_PRELOADS.map(name =>
  new RegExp(`<link\\s+rel="preload"\\s+href="/fonts/${name.replace(/\./g, "\\.")}"[^>]*as="font"`)
);
```
**Fix:** As above. Even more robust: parse the source `index.html` template once at script start and assert the regexes match it, then re-use the same regexes on prerendered output — that way the test can never silently drift from the source template.

---

### IN-06: `AboutPage` injects a `<style>{`...`}</style>` block inline — works but pollutes global CSS scope

**File:** `src/app/pages/AboutPage.tsx:156-192`
**Issue:** `.about-content h2 { ... }` etc. become global rules. They are scoped via the `.about-content` class so collision risk is low, but two pages doing this would lead to dueling globals. Tailwind 4 supports `@apply` in component files and the project uses arbitrary-value Tailwind everywhere else (`text-[24px]`, `mb-[16px]`); converting these to Tailwind utility classes on the rendered tags (or using Tailwind's `prose` plugin) would be more consistent.
**Fix:** Convert the `<h2>`/`<p>`/`<ul>`/`<li>`/`<a>` styling inside about-content into utility classes applied directly to the rendered nodes. Lower priority — current setup works.

---

_Reviewed: 2026-05-17T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
