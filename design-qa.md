**Findings**
- No actionable P0/P1/P2 findings remain.

**Open Questions**
- None. The implementation intentionally uses Opten fonts/colors and generated card imagery instead of the exact raster assets from the reference.

**Implementation Checklist**
- Built a second Learn page at `/app/learn-v2` without replacing `/app/learn`.
- Reused the existing Opten Space header and 1200px content width.
- Matched the reference structure: hero lesson, compact author card, topic pills, sort/search row, progress cards, collections, and all-lessons grid.
- Updated the top-section grid to the revised reference: `Unbounded` hero title constrained to the video column, lesson title/description typography matched to the author card, and a 261px by 412px author card aligned to the content field.
- Updated the Learn v2 surface to match landing-page color tokens: page background `#011417`, card/control surfaces `#0e2023`, top-right landing gradient, and a compact `SiteFooter` over a page-level bottom blob gradient.
- Updated collection/filter copy: collection cards use the requested five titles, and topic filters use `Вайб-кодинг` / `Вайб-дизайн`.
- Added the provided `line.png` as a title overlay asset on the Learn v2 H1.
- Generated and placed bitmap assets for thumbnails/cards and author portrait under `public/assets/space/learn-v2/`.
- Verified browser interactions: search, topic filtering, sorting, and section expansion actions.

**Follow-up Polish**
- P3: Generated imagery is intentionally not pixel-identical to the source reference, but matches the same dark cinematic AI-learning direction with Opten lime accents.

source visual truth path: `C:\Users\КОМП\Desktop\final.png` + latest in-thread top-section reference screenshot
implementation screenshot path: `C:\Projects\opten-website\tmp\design-qa\learn-v2-background-footer-top.png`
viewport: `1458x720`
state: default desktop `/app/learn-v2`
full-view comparison evidence: `C:\Projects\opten-website\tmp\design-qa\learn-v2-background-footer-top.png`
focused region comparison evidence: top section metrics were checked in the in-app browser: title cell `552px`, hero video `552px`, title overflow `false`, title font `Unbounded 55px`, H1 line overlay loaded from `/assets/space/learn-v2/title-line.png` at natural `531x59` and rendered as `460x30` with vertical scale, author card `261x412`, author/video bottom delta `0px`, author box-shadow `none`, lesson title matches author title at `21px`/`700`/`26.25px`, lesson description matches author description at `14px`/`400`/`21.7px`, root/background color `rgb(1,20,23)`, card/control color `rgb(14,32,35)`, top gradient positioned to the right, compact footer present with links `О проекте`, `Блог`, `Модели`, `Конфиденциальность`, `Оферта`, `Возврат`, `Связаться`, footer has no `.opten-footer-gradient`, page has a bottom `gradient-blob-shape.svg` layer using the same `1720x982`/`blur(140px)` scale as the landing hero and anchored below the page bottom, card-to-footer gap is `80px`, and no marketing CTA/install block.
patches made since previous QA pass: constrained the H1 to the video column, tuned its desktop size to fill the video width without clipping, added the provided title line overlay, shifted the featured lesson text block left by `18px`, matched the featured lesson typography to the author card typography, bottom-aligned the author card with the hero video, removed the author-card shadow, switched Learn v2 to landing background/card tokens, added a top-right landing gradient, added a compact footer with header-like bottom blob gradient, updated collection/filter labels, narrowed the author card, removed its detail button, and rebuilt the desktop grid to remove the extra right-side slack inside the content area.
final result: passed

---

# Prompt Workbench — Design QA

Scope: landing hero replacement, RU/EN copy, desktop and mobile layouts, model
selection, scoring tooltip, improvement action, success/error states, and the
public Cloudflare-backed request path.

## Visual comparison

- Source screenshot was used only for the score-control interaction language:
  planet icon, compact numeric pill, and a nearby score explanation.
- The implementation intentionally uses opten.space surfaces, green brand color,
  PT Root UI typography, existing radius scale, existing model metadata, and the
  committed Opten planet assets. The Syntx orange editor frame was not copied.
- Desktop at 1440×1100: the workbench aligns to the site's 1200 px content grid,
  has no horizontal overflow, and the complete editor/actions remain legible.
- Mobile at 390×844: the workbench resolves to a 335 px card, controls keep 40–44
  px tap targets, the model selector and actions stack without collision, and the
  score tooltip remains inside the viewport (`x=20`, `right=348`, no overflow).

## Interaction and accessibility

- Model selection is a labelled native select with all committed image/video
  model profiles grouped by type.
- Score and Improve are separate labelled buttons. The score tooltip contains
  evaluation only; it has no hidden improvement CTA.
- Empty/loading/result/error/success/undo/copy states were exercised in browser.
- Keyboard labels, focus rings, disabled states, semantic status colors, alt text,
  and minimum mobile control heights are present.
- The floating extension video is hidden while the hero is in view and becomes
  available only after scrolling, so it cannot obstruct the workbench actions.

## Runtime verification

- Production build passes.
- Local Vercel runtime serves the landing and `/api/prompt-workbench`.
- Real Seedance 2.0 scoring returns a structured score and issues through
  Cloudflare Workers AI.
- Real improvement replaces the prompt and exposes restore/copy controls.
- The authenticated Pro branch is server-gated by website JWT + live subscription
  before reusing the existing Claude Haiku proxy; anonymous tests remained on the
  Free Cloudflare branch.
- No Vite overlay, console errors, or horizontal page overflow were detected.

final result: passed

---

# Course Opten Generator Block — Design QA

**Findings**
- No actionable P0/P1/P2 findings remain.

**Open Questions**
- None. The implementation keeps the real course left-column width, so the live block is wider than the isolated reference crop while preserving the same compact proportions.

**Implementation Checklist**
- Removed the decorative heading icon and open-access badge.
- Matched the singular heading, locked description, two generator rows, and disabled purchase states.
- Reduced the desktop row height and action width to the compact reference density.
- Replaced the two-button upsell with one outlined `Открыть по подписке` action to `/pay`.
- Matched the reference banner wrap, emphasis, button height, borders, radii, and dark green surface treatment.
- Confirmed the generator section remains above lesson materials and stays inside the desktop lesson-content column.

**Follow-up Polish**
- No P3 follow-up is needed for the requested desktop state.

source visual truth path: `C:\Users\01EC~1\AppData\Local\Temp\codex-clipboard-f6ff83de-ae66-4983-a1cf-1fa9546b0a0c.png`
implementation screenshot path: `C:\Users\КОМП\AppData\Local\Temp\opten-generator-page-implementation-final.png`
viewport: `2048x1024`
state: signed-out, locked desktop `/learn/courses/ai-content-marketing-2026/lesson-1-prompting`
full-view comparison evidence: full browser-rendered course page at `C:\Users\КОМП\AppData\Local\Temp\opten-generator-page-implementation-final.png`; the block rendered at `752x302.34px` inside the left lesson column.
focused region comparison evidence: normalized side-by-side source/implementation comparison at `C:\Users\КОМП\AppData\Local\Temp\opten-generator-comparison-normalized.png`; focused implementation crop at `C:\Users\КОМП\AppData\Local\Temp\opten-generator-implementation-final.png`.
required fidelity surfaces: typography uses the existing Opten course font at matched weights and hierarchy; spacing and row rhythm match the compact reference; colors reuse the course dark-green and lime tokens; no raster image assets were present or substituted; all app-specific copy and emphasis match the supplied reference.
primary interactions tested: the single subscription CTA was unique and navigated to `http://127.0.0.1:4173/pay`; locked generator actions remained non-interactive.
console errors checked: no console errors were present in the final browser state.
comparison history: pass 1 found a P2 density mismatch in the conversion row—the CTA was 44px high and the sentence wrapped too late. The row was constrained, the CTA reduced to 40px, and the desktop line break matched to the reference. Pass 2 used the final normalized comparison and found no remaining P0/P1/P2 differences.
final result: passed
