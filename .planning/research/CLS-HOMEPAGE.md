# CLS investigation — homepage mobile (post-speed-deploy)

> Date: 2026-05-21 · After the perf deploy (dfdd68d), mobile CLS on `/` = **0.057** (was 0); `/models/sora-2` = **0** ✅. Both within "good" (<0.1), but the homepage regressed from 0. This is MY report (Claude). An independent Codex pass + reconciliation follows.

## 1. Symptom
- `/` mobile: score 93, LCP 2.7s, FCP 2.3s, **CLS 0.057**.
- `/models/sora-2` mobile: score 94, LCP 2.6s, FCP 2.3s, **CLS 0**.
- Baseline (pre-deploy): `/` CLS was 0 — but FCP was 4.4s.

## 2. Root cause (high confidence): hero `<h1>` web-font swap reflow
Reasoning by elimination + code:
- **Only Unbounded uses `font-display: swap`.** PT-Root UI uses `font-display: optional` (`src/styles/fonts.css:23-39`) → it never swaps after first paint, so it cannot cause a post-paint shift. Therefore any swap-driven CLS must come from an **Unbounded** text element.
- **The only prominent above-the-fold Unbounded element on `/` is the hero `<h1>`** (`src/app/App.tsx:102`): `font-['Unbounded',sans-serif]`, `text-[36px] … md:text-[62px]`, `leading-[1.08]`, multi-line (accent line + `<br/>` + rest). Its fallback is the generic `sans-serif`.
- `OptenHeroAnimation` is `hidden` below 1066px (`App.tsx:111` `min-[1066px]:flex`), so it does NOT render on a 360px mobile viewport — ruled out.
- The hero `<h1>` is immediately followed by `highlight.svg` (dimensioned 260×28), the subtitle, and the install button. When the H1's wrapped height changes, everything below shifts.
- **Unbounded is an unusually WIDE display face**: avg lowercase advance ≈ **0.69 em**, OS/2 `xAvgCharWidth` = **0.74 em**, vs Arial ≈ **0.44 em**. So the system `sans-serif` fallback renders the H1 much narrower; when Unbounded swaps in, the line is ~1.5× wider → it can wrap to **more lines** → the H1 grows taller → content below shifts down. This is the classic font-swap CLS, and it's large precisely because the hero H1 is big and multi-line.

### Why the model page is 0 and the homepage is 0.057
- The model H1 (`ModelPage.tsx:98`) is smaller (`font-medium`, 28→40px), shorter (one localized heading), lower on the page (after a fixed breadcrumb + badge), so its swap reflow is below the per-shift threshold.
- **Why it appeared only now:** pre-deploy FCP was 4.4s. The page was so slow that the (then 254 KB) Unbounded font generally arrived around first paint, so little post-paint swap was recorded. After the speed work FCP is 2.3s — first paint now happens with the fallback **before** the (throttled-mobile) font arrives, so the swap, and its shift, now occur after paint and are counted. The speedup **exposed** a latent swap shift; it isn't a new layout bug.

> Note: I could not run a throttled local repro — the Playwright MCP `run_code_unsafe` sandbox lacks `setTimeout`, so CDP network-throttle + a `PerformanceObserver('layout-shift')` capture failed. The diagnosis rests on the font-display config, the metrics, and the elimination above. (Independent Codex confirmation requested.)

## 3. Recommended fix: metric-matched fallback `@font-face` (size-adjust + overrides)
Add a dedicated fallback family tuned to Unbounded's metrics so the pre-swap fallback occupies the **same space** as Unbounded → swap causes ~0 shift. Keeps `font-display: swap` and the real LCP font (no brand/LCP regression), zero JS, zero runtime cost.

Computed from the subset Unbounded (unitsPerEm 1000, hhea ascent/descent 995/-245, xAvgCharWidth 0.74 em) against Arial (capsize metrics):
- `size-adjust: 167.65%`
- `ascent-override: 59.35%`
- `descent-override: 14.61%`
- `line-gap-override: 0%`

```css
@font-face {
  font-family: 'Unbounded Fallback';
  src: local('Arial');
  size-adjust: 167.65%;
  ascent-override: 59.35%;
  descent-override: 14.61%;
  line-gap-override: 0%;
}
```
Then change the H1 stacks `font-['Unbounded',sans-serif]` → `font-['Unbounded','Unbounded_Fallback',sans-serif]` (every Unbounded usage, ~12 files).

**Avoids the documented footgun** in `fonts.css:8-13`: that bug was a second `@font-face` under the **same** family name with `src: local('Arial')`, which the browser preferred and never swapped away from. Here the fallback is a **separate** family used only as the next stack entry, with Unbounded **first** — so once Unbounded loads it's used, and the fallback only fills the swap window. No "stuck on Arial" bug.

Open questions for Codex:
- Verify the override metric choice (hhea vs OS/2 typo vs win ascent/descent) and the exact size-adjust/override numbers — wrong values leave residual shift.
- Cross-platform: `local('Arial')` is absent on some Linux/Android; does the fallback then collapse to bare `sans-serif` (un-adjusted) and reintroduce shift? Is a tool (fontaine / @capsizecss/createFontStack) safer than hand values?
- Is fixing a 0.057 (still-"good") CLS worth the ~12-file font-stack change, or is there a lower-touch option (e.g. reserving hero H1 min-height, or a tiny size-adjust-only fallback)?

---

## 4. Reconciled conclusion (Claude report + independent Codex pass + Codex adjudication)

Both passes converged on the **same root cause and fix shape**. Codex's independent diagnosis matched: hero H1 Unbounded `swap` reflow, exposed by the faster FCP, model page sub-threshold. Disagreement was only on the `size-adjust` derivation, adjudicated by Codex:

- **`size-adjust: 167.65%` is correct** (the xAvgCharWidth/width-ratio derivation). CSS `size-adjust` (Fonts L5 §4.4) scales glyph **advance widths**, and Chrome's fallback metric is `avgCharWidth(webfont)/avgCharWidth(fallback)`. The CLS is horizontal **reflow**, so the fix must match WIDTH. Codex's earlier cap-height-based 89% was rejected: it matches vertical geometry but leaves the ~47% advance-width gap → wrapping still differs → CLS persists.
- **Final override values** (from subset Unbounded: upm 1000, hhea asc/desc 995/-245, xAvgCharWidth 0.74em; Arial 0.441em):
  `size-adjust: 167.65%`, `ascent-override: 59.35%`, `descent-override: 14.61%`, `line-gap-override: 0%`.
- **Cross-platform:** `local('Arial')` alone collapses to un-adjusted Roboto on Android/Linux. Use a multi-`local()` src — Arial, Helvetica Neue, Liberation Sans, Arimo, Roboto (Roboto xWidthAvg ~0.449 ≈ Arial, ~2% off → acceptable).
- **Worth shipping:** yes — CSS-only, no markup/route/schema/LCP change, keeps `font-display: swap`. `min-height` on the H1 was rejected as fragile (breaks on copy/breakpoint/locale changes, only masks the vertical effect).

### Solution to ship
1. Add to `src/styles/fonts.css`:
```css
@font-face {
  font-family: 'Unbounded Fallback';
  src: local('Arial'), local('Helvetica Neue'), local('Liberation Sans'), local('Arimo'), local('Roboto');
  font-style: normal;
  font-weight: 400 700;
  size-adjust: 167.65%;
  ascent-override: 59.35%;
  descent-override: 14.61%;
  line-gap-override: 0%;
}
```
2. Insert the fallback into every Unbounded font stack (Tailwind arbitrary classes, ~17 occurrences across ~12 files; the repo already uses the underscore form, e.g. `font-['PT_Root_UI',sans-serif]`):
   `font-['Unbounded',sans-serif]` → `font-['Unbounded','Unbounded_Fallback',sans-serif]`
   (`'Unbounded_Fallback'` → `'Unbounded Fallback'` at build, matching the @font-face name; Unbounded stays FIRST so the real font wins once loaded — avoids the same-family footgun in `fonts.css:7-13`).
3. `unicode-range` on the fallback face is omitted (Codex suggested matching the subset ranges; unnecessary here since the family is referenced only by H1 stacks, and omitting it avoids an uncovered-glyph micro-shift).
4. Re-measure `/` mobile after deploy — expect CLS → ~0, LCP unchanged.

---

## 5. Post-deploy outcome + final decision (2026-05-21)

The metric-matched fallback was shipped (commit 65eadbb) and measured — **it did NOT move the lab CLS** (`/` mobile stayed 0.057–0.063 across runs; LCP improved to 2.4s, score 96). Investigation with an in-browser `PerformanceObserver('layout-shift', {buffered:true})` capture (the only working path — PageSpeed MCP doesn't expose CLS elements, the keyless Lighthouse API is rate-limited, and `run_code_unsafe` lacks `setTimeout`) **confirmed the shifting elements**: the InstallButton (`div.mt-12`) and the Partners `<section>` move down at ~6.5s when Unbounded finishes loading and the hero H1 grows — exactly the predicted hero-H1 swap reflow.

Why the fix didn't register in the lab:
- In a browser that HAS one of the `local()` fonts (this capture's Chromium had Liberation Sans → the fallback was active, `font-family` confirmed as `Unbounded, "Unbounded Fallback", sans-serif`), the residual shift was only ~0.016 — the fallback helped but didn't fully zero it (a single `size-adjust` from the *average* glyph width can't exactly match a *specific* headline's wrap point).
- Lighthouse's headless Chrome most likely has **none** of the listed `local()` fonts (Arial/Helvetica/Liberation/Arimo/Roboto), so 'Unbounded Fallback' has no usable src there → it collapses to bare `sans-serif`, un-adjusted → the lab CLS is unchanged. The fix would still help real devices (Windows/Android have Arial/Roboto), but that can't be shown in the lab number.

A fully robust, font-independent fix exists (reserve the hero H1 height per breakpoint/locale), but it is fiddly and copy-coupled.

**Decision (user, option 3): accept CLS 0.057.** It is comfortably within Google's "good" threshold (<0.1), and the headline win — LCP 5.7s → 2.4s, score 66 → 96 — is the prize. The ineffective metric-fallback was **reverted** for a clean tree (the 17 font stacks back to `font-['Unbounded',sans-serif]`, the 'Unbounded Fallback' @font-face removed). This document is kept as the record of the root-cause analysis should field CLS data later justify the reserved-height fix.
