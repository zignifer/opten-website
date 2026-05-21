# Safari Mobile — slow load + unresponsive buttons (RESOLVED)

> Date: 2026-05-21 · Method: dual independent analysis (Claude + Codex), cross-checked,
> then iterative deploy-and-test on a real iPhone with rollback available at each step.
> Companion to [[SPEED-AUDIT-MOBILE]] (which covered the load-weight / bundle / font work).

## Reported symptom (site owner, real iPhone / Safari)

- Site loads very slowly on Safari.
- Buttons don't respond during load and after scrolling.
- After every page load / navigation you must wait **2-3 seconds** before buttons work.

## TL;DR — what it actually was

Two distinct problems were conflated into one complaint:

1. **Slow load** — caused by load-weight (entry chunk + fonts). Already fixed earlier the
   same day in `dfdd68d` (font subsetting + splitting the 62 model-content files out of the
   entry chunk): mobile LCP **5.7 s → 2.7 s**, Performance **66 → 91**. See [[SPEED-AUDIT-MOBILE]].

2. **Unresponsive buttons + jank (the decisive remaining issue)** — caused by **expensive CSS
   blur on iOS Safari**, NOT by JavaScript weight. This is what the fixes in this document addressed.

## Root cause (decisive): heavy `filter: blur` / `backdrop-filter` on WebKit

- The hero glow was a decorative layer drawn with `filter: blur(285px)` over a 1720×982 px
  pseudo-element (`150px` over 960×548 on mobile), plus `will-change: transform` which
  permanently promoted a huge compositor layer — `src/styles/theme.css` `.opten-figma-gradient::before`.
- The fixed site header used `backdrop-filter` (`backdrop-blur-md`) — `src/app/components/SiteHeader.tsx`.
- These filters are cheap on Chrome (GPU-composited efficiently) but **expensive on iOS
  Safari/WebKit**, which re-paints/re-samples them heavily during load and **on every scroll
  frame**. The result: WebKit's main thread was saturated, so:
  - first interactivity (hydration handlers attaching) was delayed → the 2-3 s "dead buttons";
  - tap response after scrolling was sluggish.

### Why lab tools never caught it

PageSpeed Insights / Lighthouse run in **headless Chromium, not Safari**. Chromium composites
these filters efficiently, so the lab always reported "good" (Performance 91, TBT 70 ms) even
while the real iPhone was broken. **Lesson: for a Safari-specific complaint, a green Lighthouse
score proves nothing — the bottleneck can be WebKit compositing that Chromium hides.**

## Fixes shipped (in order, each deployed + tested on the real device)

| Fix | Commit | Change | Effect |
|---|---|---|---|
| FIX-01 | `3f4cc80` | `LangContext.tsx`: init `dicts.en` eagerly on the client (was SSR-only) — kills a React #418 hydration mismatch on `/en/*` | Correct fix, but not the user's main symptom (no improvement reported) |
| FIX-02 | `acb98a3` | `theme.css`: `overflow-x: hidden` → `clip` on html/body/#root — hardening vs WebKit root-scroller tap-deadzone | Harmless hardening; not the cause |
| **FIX-03** | `fdc5786` | `SiteHeader.tsx`: drop `backdrop-filter` on mobile (opaque bar), keep frosted glass on desktop (`md+`) | **Decisive** |
| **FIX-04** | `fdc5786` | `theme.css`: hero gradient blur `285px→140px` / `150px→75px`, drop `will-change` | **Decisive** |

After FIX-03 + FIX-04 the owner confirmed: **"всё хорошо работает."**

## Measured (PageSpeed mobile, lab / Chromium)

| Metric | Start of day | After fonts+bundle | After blur fix |
|---|---|---|---|
| Performance | 66 | 91 | **93** |
| LCP | 5.7 s | 2.7 s | 2.7 s |
| Speed Index | 5.7 s | 4.2 s | **2.4 s** |
| TBT | 10 ms | 70 ms | **0 ms** |

Speed Index 4.2 → 2.4 s and TBT 70 → 0 ms confirm the blur reduction unloaded the main thread
even in Chromium; the real-Safari win is larger (Chromium under-measures WebKit blur cost).

## Deferred — NOT needed (problem resolved without them)

- **FIX-05** (add `touchstart`/`pointerdown` to the menu outside-click handler) — minor robustness, optional.
- **FIX-06** (route-level code-splitting to cut critical JS / TTI) — per Codex review, the
  ~120 KB gz entry is already reasonable and the bottleneck was paint, not JS download. High
  effort + touches the fragile hydration path (`__PRERENDER_PATH` discriminator the extension
  relies on) for a modest, uncertain win. **Do not pursue unless future real-device traces show
  JS parse/eval — not paint/layout — as the bottleneck.** If ever revisited: the current route's
  component must be eagerly resolved before `hydrateRoot` (React 18 `lazy` still suspends on
  first render even if its import was pre-resolved → would re-break hydration).

## SEO-safety (held for every fix)

All changes were CSS / client-init only. Prerendered HTML, baked `<html lang>`, JSON-LD graph,
hreflang, sitemap, and the FAQ-parity build gate were untouched. `npm run build` passed
(144 routes, FAQ parity 888 questions, fonts gate). No markup or crawler-visible change.
