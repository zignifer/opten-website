---
phase: 04-content-surface
plan: 02
type: audit
status: complete
completed: 2026-05-17
consumed_by: 04-03-PLAN.md
---

# 04-LCP-AUDIT — Production LCP element identification

Wave-0 prerequisite for Plan 04-03 D-13 (`applyHeroPreload`). Source: PageSpeed Insights MCP, mobile strategy, 2026-05-17 11:51 UTC.

## 1. Run metadata

| URL | Strategy | Perf score | Date | Tool |
|-----|----------|------------|------|------|
| `https://opten.space/` | mobile | 91/100 | 2026-05-17T06:51:10Z | `mcp__pagespeed__*` |
| `https://opten.space/en/` | mobile | 92/100 | 2026-05-17T06:51:32Z | `mcp__pagespeed__*` |

CRUX field data and `largest-contentful-paint-element.details.items[0].node.snippet` are NOT directly exposed by the PageSpeed MCP wrapper — the tool summarizes Lighthouse JSON instead of forwarding it raw. The LCP element identification below is therefore **inferred from the network waterfall + above-the-fold DOM inspection of production HTML**, not extracted from the raw audit field. Confidence: high (the field-of-candidates is small enough to triangulate unambiguously).

## 2. Baseline metrics (locked floor for V-18 / V-19)

| Metric | `/` mobile | `/en/` mobile | Target (V-18/V-19) |
|--------|-----------|---------------|--------------------|
| **LCP** | **3.30 s** ❌ | **3.30 s** ❌ | ≤ 2.5 s |
| FCP | 1.50 s | 1.50 s | — |
| Speed Index | 2.88 s | 2.60 s | — |
| TBT | 0 ms | 0 ms | — |
| CLS | 0 | 0 | — |
| TTI | 3.30 s | — | — |
| FID (lab) | 26 ms | — | — |

Pre-Phase-4 baseline: **3.3 s LCP on both locales**. Floor for V-18/V-19 post-deploy verification.

## 3. LCP candidate on `/` (mobile)

**Element type: TEXT (the hero `<h1>`), font-blocked on Unbounded-VF.woff2.**

### Evidence

1. **Top high-priority resources** (`mcp__pagespeed__get_network_analysis` mobile):
   - `Unbounded-VF.woff2` — 254.6 KB, priority HIGH (variable font, used by `<h1>`)
   - `PT-Root-UI_VF.woff2` — 92.0 KB, priority HIGH (used by body text)
   - JS vendor bundles — 47 KB + 42 KB, HIGH
   - CSS — 19.9 KB, VeryHigh
   - **All `<img>` candidates above the fold are tiny SVGs (≤5 KB)** — `logo.svg`, `highlight.svg` (260×28 underline decoration), `chrome-lg.svg`/`yandex-lg.svg` (40×40 browser icons), partner-strip PNGs (268×80). None have the pixel-area to dominate LCP.

2. **Above-the-fold DOM** (`curl -s https://opten.space/ | grep '<img\|<h1'`):
   - Only `loading="eager"` images in the first viewport are header logo + decorative SVGs + the partner-strip logos. The visually-dominant element above the fold is the **H1 headline**, comment confirms `<!-- preload both webfonts so the fetch starts in parallel with HTML/CSS — Unbounded in <h1>, PT Root UI ... -->`.
   - The big feature-card images (`steps-inner-ru-DWM3Xlhm.png` 813×638 `srcset`, `feature-models-DAmafaja.png` 1100×424) sit in feature sections **below** the mobile fold — they load `eager` to avoid scroll-jank but are not in viewport at paint time.

3. **Timing gap FCP→LCP = 1.8 s**: text appears at 1.5 s (FCP, likely with system-font swap or partial Unbounded already cached), but LCP only ticks at 3.3 s when the Unbounded font finishes loading and the H1 reflows to its final glyphs — classic text-LCP + font-swap signature. `font-display: swap` is already enabled (`src/styles/fonts.css`).

### Production HTML already has

```html
<link rel="preload" href="/fonts/PT-Root-UI_VF.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="/fonts/Unbounded-VF.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
```

(Source: production curl; Phase 2.2 added these.)

## 4. LCP candidate on `/en/` (mobile)

**Identical to `/`** — same H1 element, same Unbounded-VF.woff2 font dependency, same already-existing preloads. Network waterfall is identical except for one localized image (`steps-inner-en-B6ityx6O.webp` 34.8 KB instead of the RU variant). Page weight is 0.61 MB vs 0.64 MB. LCP 3.3 s both locales.

## 5. Implication for Plan 04-03 (D-13 — `applyHeroPreload`)

**This is the critical finding the user needs to decide on before 04-03 starts.**

The literal Plan 04-03 task as written assumes there is a hero **image** to preload via `<link rel="preload" as="image" fetchpriority="high">`. The audit shows:

- There is no above-the-fold hero image — the visually-dominant element is the H1 text.
- The fonts that gate the H1 paint are **already** `rel=preload` (Phase 2.2 work).
- `font-display: swap` is already on.

So a literal D-13 image-preload `applyHeroPreload` will be a no-op or worse (preloading an off-screen `feature-models.png` could hurt LCP by stealing connection capacity from the font request).

### Recommended preload-target for Plan 04-03

```
Plan 04-03 applyHeroPreload should preload: [nothing new — the LCP-blocking
fonts /fonts/PT-Root-UI_VF.woff2 and /fonts/Unbounded-VF.woff2 are already
preloaded in index.html since Phase 2.2 with as="font" crossorigin]
```

### Recommended Plan 04-03 detection regex

If 04-03 still wants a defensive build-time check (idempotency / regression guard), the regex should verify the **existing** font preloads are present in every prerendered HTML (12 routes), not insert a new `as="image"` line. Suggested:

```js
// In scripts/prerender.mjs apply-chain (Plan 04-03 D-13 slot):
// REGRESSION GUARD only — fonts already preloaded by Phase 2.2 in index.html.
const FONT_PRELOAD_REGEX = /<link\s+rel="preload"\s+href="\/fonts\/Unbounded-VF\.woff2"[^>]*as="font"/;
if (!FONT_PRELOAD_REGEX.test(html)) {
  throw new Error(`[prerender] ${route}: missing Unbounded font preload — Phase 2.2 work regressed`);
}
```

### Three options for Plan 04-03's D-13 task

1. **Recommended: convert D-13 from "add image preload" → "regression guard on existing font preloads"**. The plan's `applyHeroPreload` becomes a one-line assertion that the Phase 2.2 preloads survived the build. Closes the D-13 intent (gate LCP-affecting resources) without adding noise. Plan-checker concerns about cross-route correctness become trivial (regex either matches all 12 routes or build fails).
2. Skip D-13 entirely. Keep 04-03 as JSON-LD-only. LCP work moves to a future phase (Unbounded font subsetting, brotli precompression, or HTTP/3 server push).
3. Insist on image preload despite the audit. Possible targets: `feature-models-nxObKNfk.png` (400w mobile srcset variant) — but this image is below the fold; preloading it likely pushes LCP **up**, not down. **Not recommended.**

## 6. Render-blocking context (informational)

PageSpeed flagged the following non-LCP-affecting opportunities (all "Low" priority):
- Minify CSS, minify JS — Vite already does this; remaining bytes are dependency-injected, no further savings without bundler-config change.
- Reduce unused CSS / JS — Tailwind 4 purge is on; remaining unused bytes are framework runtime (React + Router).
- Avoid multiple page redirects — likely the `/en` → `/en/` trailing-slash redirect or the trailing-slash canonicalization. Single hop, negligible impact.

No render-blocking issue points at code we control beyond Wave-1 changes already in flight.

## 7. Approval ask for the user

This audit's recommendation diverges from the literal Plan 04-03 task wording. Three response paths (per Plan 04-02 `<resume-signal>`):

- **"approved — option 1"** → I'll update 04-03 D-13 task wording to "regression guard on existing Phase 2.2 font preloads" before executing 04-03.
- **"approved — option 2"** → 04-03 drops D-13 entirely, ships JSON-LD-only.
- **"approved — option 3"** → 04-03 ships literal D-13 image preload (against audit recommendation; LCP likely degrades).
- Anything else → I'll act on your instructions.

Without your decision Plan 04-03 (Wave 2) cannot start cleanly because the D-13 task body needs to match the actual LCP-blocking resource.
