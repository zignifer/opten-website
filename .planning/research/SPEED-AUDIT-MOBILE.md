# Speed Audit — opten.space (mobile)

> Date: 2026-05-21 · Tool: PageSpeed Insights / Lighthouse (mobile strategy) + local `vite build` chunk analysis + source inspection.
> Goal: improve mobile load speed **without regressing the SEO architecture** (prerender / JSON-LD / hreflang / locked routes / build gates).

## 1. Measured state (mobile, lab)

Two representative routes measured (homepage + a programmatic model page) — numbers nearly identical, so the bottleneck is structural, not page-specific.

| Metric | `/` | `/models/sora-2` | Target |
|---|---|---|---|
| Performance score | 66/100 | 68/100 | ≥90 |
| **LCP** | **5.7 s** ❌ | **5.7 s** ❌ | <2.5 s |
| **FCP** | **4.4 s** | **4.4 s** | <1.8 s |
| Speed Index | 5.7 s | 4.4 s | <3.4 s |
| CLS | 0 ✅ | 0 ✅ | <0.1 |
| TBT | 10 ms ✅ | 0 ms ✅ | <200 ms |

- **No CrUX field data** for either URL (low real-user traffic) → we only have lab data.
- **Server latency: 1 ms**, Network RTT ≈ 2.8 ms → the backend/edge is fast. The problem is **not** TTFB.
- **No render-blocking resources** detected.
- **JS bootup: 723 ms total** (script eval 192 ms) → JS execution is **not** the bottleneck.

**Conclusion: this is a payload-weight problem on a throttled mobile connection, not a server, render-blocking, or JS-execution problem.** FCP/LCP are high purely because the browser is saturated downloading a large JS bundle + large fonts in parallel, and the LCP element (the H1, rendered in the Unbounded font) waits for that font.

## 2. Critical-path payload (real numbers from `vite build`)

| Resource | Raw | Gzip (over the wire) | On critical path? |
|---|---|---|---|
| `index-*.js` (entry chunk) | **2,097 KB** | **524 KB** | YES — High priority |
| `Unbounded-VF.woff2` | — | **254 KB** | YES — preloaded, LCP font (H1) |
| `vendor-react-*.js` | 143 KB | 46 KB | YES |
| `PT-Root-UI_VF.woff2` | — | **92 KB** | YES — VeryHigh priority (above-fold body) |
| `index-*.css` | 121 KB | 20 KB | YES — VeryHigh priority |
| `vendor-router-*.js` | 36 KB | 13 KB | YES |
| `vendor-lucide-*.js` | 3.5 KB | 1.2 KB | YES |
| Lazy chunks (Success/Account/DownloadSkill) | — | ~1–4 KB each | No (off critical path) |

**Critical path ≈ ~950 KB gzip** of JS + fonts + CSS hitting the browser at once on a throttled link. That is the entire story behind FCP 4.4 s / LCP 5.7 s.

## 3. Root causes (ranked by impact)

### RC-1 — The entry chunk ships the full text of all 62 model pages on *every* route (~dominant share of the 524 KB)
- `src/content/models/index.ts` uses `import.meta.glob("./[!_]*.ts", { eager: true })`.
- That **eagerly** pulls all 62 `<slug>.ts` content files — **1.9 MB of raw RU+EN prose** — into the import graph.
- `allModels` / `getModelBySlug` from that barrel are imported by `ModelsHubPage` and `ModelPage`, which are **eagerly imported** in `src/main.tsx`.
- Net effect: the **homepage** (and every other route) downloads the complete body text of all 62 model pages it never renders. This is the single largest contributor to the 2.1 MB raw entry chunk.

### RC-2 — Fonts are oversized for what's used (346 KB gzip on the critical path)
- `Unbounded-VF.woff2` (~254 KB): variable font, weight axis **200–900**, but only **400 / 700** are used. It is **preloaded** and is the **LCP element** font (H1 hero) — so its size directly gates LCP.
- `PT-Root-UI_VF.woff2` (~92 KB): weight axis **100–900**, only **400 / 500 / 700** used. `font-display: optional` (good — zero CLS), not preloaded, but still fetched at VeryHigh priority for above-fold body text.
- Both likely carry a full glyph set (Latin + Cyrillic + extras). Subsetting glyphs + pinning the weight range should cut these by ~70–85%.

### RC-3 — All routes are eagerly bundled (architectural constraint)
- Only `SuccessPage` / `AccountPage` / `DownloadSkillPage` are `React.lazy`. Everything else is eager.
- Reason (documented in `main.tsx`): `renderToString` in the prerender path **cannot resolve `React.lazy`**, so any route on the hydration path must be eager. This is a real constraint — naive route-level lazy-loading would break prerender/hydration.
- Beyond model content, the eager graph also pulls MUI icons + `@emotion`, `motion`, used Radix primitives, and `react-hook-form` into the entry chunk.

### RC-4 — CSS 121 KB raw / 20 KB gzip (minor)
- Tailwind 4 output; gzip is reasonable but worth verifying purge/content globs.

### RC-5 — "Avoid multiple page redirects" flagged (minor)
- Likely apex/trailing-slash or http→https hop. One extra redirect adds a full RTT on mobile. Low effort to confirm/fix.

### Ruled out (do NOT spend effort here)
- `recharts`, `embla-carousel`, `cmdk`, `vaul`, `react-day-picker` — imported only by unused `src/app/components/ui/*` primitives (drawer/command/calendar/carousel/chart), which **no page imports** → already tree-shaken out, not in the bundle.
- Images: 24 requests / 0.17 MB, all Low priority, WebP with PNG fallback `<source>` (PNGs only fetched by old browsers). Fine.
- Server / TTFB: 1 ms. Fine.

## 4. Proposed optimizations (prioritized) + SEO-safety note for each

### P0 — Slim the fonts (do first: highest ROI, ~zero risk, directly improves LCP)
- Subset Unbounded to used scripts (Latin + Cyrillic) and pin/limit the weight axis to ~400–700. Expected ~254 KB → ~30–60 KB.
- Same for PT-Root UI → ~92 KB → ~25–40 KB.
- Keep self-hosting, keep the Unbounded preload (it's the LCP font), keep `font-display: swap`/`optional`.
- **SEO impact: none.** Fonts are not crawler-relevant. Pure perf win. **Risk: low** (the only historical font footgun — a `local()` fallback face — is documented in `fonts.css` and we won't reintroduce it).

### P0 — Get the 62-model content out of the entry chunk (biggest single win)
Candidate approaches (to be pressure-tested):
- **(A) Data-island + lazy glob (preferred):** switch the glob to `{ eager: false }`; at prerender, inline the *single* model's content object as a JSON island (e.g. `window.__MODEL__`) in that route's HTML; `ModelPage` reads the island synchronously at hydration (no async → no mismatch), and falls back to the lazy glob only for client-side SPA navigation between models. Removes ~1.9 MB raw of model prose from every route's entry chunk.
- **(B) Per-model `manualChunks`:** only helps if the barrel import itself becomes dynamic; with an eager glob + static barrel the whole set stays in the graph. Likely insufficient alone.
- **(C) Separate client entry for model routes:** harder in a single SPA.
- **SEO impact: must stay neutral.** The prerendered HTML already contains the full visible model content via SSR — that must remain byte-identical so crawlers and AI extractors see no change. The risk is **hydration mismatch** (React #418/#423) if the island ≠ SSR output; mitigated by serializing the exact same content object the SSR used. The existing `__PRERENDER_PATH` discriminator must keep working.

### P1 — Audit the rest of the entry chunk
- After model content is out, re-profile with `rollup-plugin-visualizer` (already a devDependency) to see what remains: MUI icons + emotion, `motion`, Radix. Split rarely-used vendor libs into their own chunks (cache-friendly) and confirm MUI icons tree-shake via named imports. Consider whether `motion` is needed above the fold.

### P1 — Verify Tailwind purge / trim unused CSS.

### P2 — Confirm/fix the redirect hop (single hop to canonical apex, no trailing-slash bounce).

## 5. SEO-safety guardrails (invariants that MUST hold for any change)
1. Every prerendered route keeps full visible content + JSON-LD graph + hreflang triplets + baked `<html lang>` (never mutate lang at runtime — Phase 3 D-06).
2. `npm run build` must pass, including `verify-faq-mainentity.mjs` (FAQ ↔ FAQPage parity) and the sitemap/llms floor checks (144 routes).
3. `__PRERENDER_PATH` hydration discriminator in `main.tsx` must stay correct (extension deep-links to SPA-only routes depend on it).
4. Locked routes (`/welcome`, `/pay`, `/success`) must not be renamed.
5. `React.lazy` remains unsafe on any route that goes through `renderToString`/hydration — so prefer moving **data** (model content) out of the bundle over lazy-loading **components** on hydrated routes.
6. No half-translated output; RU + EN ship together.

## 6. Open questions for independent review
- Is the data-island approach (P0/A) the right call, or is there a cleaner Vite-native pattern that keeps prerender + hydration intact while excluding non-rendered model content from the entry chunk?
- Are there lower-risk wins being underweighted (e.g. is `motion` or MUI a bigger slice than assumed)?
- Any sequencing concern: which of {fonts, model-content split} should ship first to de-risk?

---

## 7. Reconciliation with independent Codex review (2026-05-21)

Codex did an independent pass (read the report + traced imports + measured the actual `dist` chunk). Outcome:

**Confirmed:**
- RC-1 quantified: the 62 model content files = **430 KB gzip = ~82 %** of the 524 KB entry chunk. The model glob is unambiguously the dominant slice — **not** MUI/motion/Radix.
- RC-2: font sizes and critical-path placement confirmed.
- Framing ("payload weight, not TTFB / not JS execution") confirmed.

**Corrected (errors in my report — accepted):**
1. §3 RC-3 overstated MUI icons + emotion + motion + Radix + react-hook-form as a meaningful eager slice. After the 62 models (430 KB) and i18n dicts (~51 KB), everything else is only ~40 KB gzip combined. Those libs are a rounding error next to model content; effort there is wasted.
2. §3 RC-2 said Unbounded uses only weights 400/700. **Verified wrong:** Unbounded is used at **500 (`font-medium`) and 700 (`font-bold`)** — and the model-page H1 (the LCP element on 124 model routes) uses **500** (`ModelPage.tsx:98`, `RelatedModels.tsx:26`, `BlogPostPage.tsx:114`, `ModelQuickFacts.tsx:91`). A subset that drops 500 would break the LCP heading on live SEO pages.
3. §4 P0 called font subsetting "~zero risk". Reality: **low-to-medium** — the site is fully bilingual RU/EN, so a bad subset = broken glyphs on live indexed pages.

**Missed contributors (added):**
- i18n dictionaries `ru.json` + `en.json` are statically imported in `LangContext.tsx:3,9` → **always in the entry chunk (~51 KB gzip)**, both languages on every route.
- `PayPage` is eager on all routes (`main.tsx:10,61,78`) — intentional (prerender-sensitive), ~27 KB.
- `ModelsHubPage.tsx:75-78,216-217` reads `content[lang].intro` for cards + search → any content split MUST keep a lightweight summary barrel or the hub breaks / mismatches.

**Missed risks (added):**
- Data-island JSON must be HTML-escaped (`</script>`, `<`) — reuse the existing prerender escaping (`scripts/prerender.mjs:243-258`).
- FAQ/schema parity gate (`verify-faq-mainentity.mjs`) can break if the first client render doesn't render the model FAQ (`ModelPage.tsx:232-233` renders FAQ only when `locale` exists; JSON-LD pulls from `locale.faq`).

## 8. Final reconciled plan (recommended order)

Both audits agree on the two P0s. Recommended sequencing favors de-risking: ship the self-contained LCP win first, then the higher-risk architectural change.

**Step 1 — Subset the fonts (P0, ship first).** Self-contained, reversible, directly unblocks the LCP element (H1 in Unbounded). Generate the subset from the **actual rendered corpus** (all prerendered HTML + `ru.json`/`en.json` + model prose), not from an alphabet. Keep full Cyrillic + Latin + punctuation + digits + ₽/$/%. Keep **all used weights** — Unbounded 500 + 700 (verify 400), PT-Root 400/500/700. Keep self-hosting, the Unbounded preload, and the existing `font-display`. Tool: `pyftsubset`/`glyphhanger`; diff against full corpus before swapping. Expected: ~220–280 KB gzip saved. SEO impact: none.

**Step 2 — Split the 62-model content out of the entry chunk (P0, biggest byte win).** Use the hydration-safe data-island pattern (Codex §6):
- SSR/prerender stays eager + synchronous — do **not** touch `entry-server.tsx`.
- `prerender.mjs` injects the single matched model's content as an escaped `<script type="application/json" id="model-content-island">` (reuse the JSON-LD escaper).
- Client-side barrel via Vite `isSsrBuild` alias-split: `getModelBySlug` reads the island **synchronously** on `/models/:slug` (no hydration mismatch); lazy `import.meta.glob` only for client-side SPA navigation between models.
- `ModelsHubPage` consumes a lightweight `_summaries` barrel (name + short intro), never the full prose.
- Expected: ~350–430 KB gzip off **every** route's entry chunk (entry ~524 KB → ~95–170 KB). Manage: JSON escaping, island ≡ SSR content, FAQ/schema parity, hub summaries.

**Step 3 — Lazy-load the non-current locale dictionary (P1).** Load only the active language synchronously (from the island/URL), defer the other to language switch. ~20–30 KB. Must keep the active-locale text synchronous to avoid mismatch.

**Step 4 — Wire `rollup-plugin-visualizer` (P1, low effort).** Already in `package.json:70`; add an opt-in script and re-profile after Step 2.

**Step 5 — Re-check preload competition (P2).** After Steps 1–2, revisit `applySafariPreloadFallback` (`scripts/prerender.mjs:210-218`).

**Guardrails for every step:** `npm run build` must pass incl. `verify-faq-mainentity.mjs` + sitemap/llms 144-route floor; `__PRERENDER_PATH` discriminator intact; no `React.lazy` on hydrated routes; locked routes (`/welcome`, `/pay`, `/success`) unchanged; prerendered HTML (visible content + JSON-LD + hreflang + baked `<html lang>`) byte-stable; RU + EN ship together.
