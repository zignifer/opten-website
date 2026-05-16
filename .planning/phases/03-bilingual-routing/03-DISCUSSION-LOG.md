# Phase 3: Bilingual routing - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-16
**Phase:** 3-bilingual-routing
**Areas discussed:** URL strategy & root `/`, Locked routes on EN, EN content & i18n pipeline, Pre-Phase-3 hydration mismatch on `/`

---

## URL strategy

| Option | Description | Selected |
|--------|-------------|----------|
| `/ru/* /en/*` path-prefix | Separate prerenders per language. Hreflang pairs. Single host. Compatible with current `prerender.mjs` — just expand `routes[]` in `seo-routes.ts`. | ✓ |
| `?lang=ru / ?lang=en` query | One physical URL per route. Minimum build changes, but near-zero for GEO/SEO — crawlers see one document. | |
| `ru.opten.space` subdomain | Separate host for RU, opten.space for EN (or vice versa). DNS/Vercel overhead, separates cookie space, isolates reputation in search engines. | |

**User's choice:** `/ru/* /en/*` path-prefix (audit recommendation).
**Notes:** Aligns with `.planning/research/GEO-AUDIT.md §C-5`. Becomes D-01.

---

## Root `/` behavior

| Option | Description | Selected |
|--------|-------------|----------|
| RU-canonical (status quo + hreflang) | No redirect. `/` stays RU; `/ru/*` not physically emitted; EN lives at `/en/*`. Hreflang links pairs. Minimum risk to extension. | ✓ |
| Client-side redirect on `/` by navigator.language | Hydrate, then `pushState('/en/')`. Audit's literal recommendation. | |
| Vercel-level redirect `/` → `/ru/` | Server 302/308. Loses brand-URL. | |
| Language picker on `/` | `/` shows RU/EN buttons. Breaks landing UX. | |

**User's choice:** RU-canonical — after requesting a deeper explanation of both this option and the risks of the client-side redirect alternative.
**Notes:** Reasons for rejecting client-side redirect (per discussion):
- Double-render flash for live users (mobile-perf regression risks Phase 02.2's gains).
- Hydration-mismatch amplification on the landing that already has an open mismatch.
- Canonical conflict — same URL serving different canonicals to different users → SEO degradation.
- Crawlers don't execute JS reliably — JS redirect benefits humans only; hreflang gives crawlers the same info without the cost.
- Risks of entangling locked-route deeplinks (`/welcome` from extension) with redirect logic.

Becomes D-02. `/ru/*` is virtual (hreflang `ru → /`); reversible later via 301 if needed.

---

## Locked routes on EN

| Option | Description | Selected |
|--------|-------------|----------|
| Marketing only (lock stays RU) | No `/en/welcome` or `/en/pay`. Maximum caution. Two valuable EN pages don't ship. | |
| Marketing + `/en/welcome` + `/en/pay` | Recommended. `/success`, `/account`, `/dashboard` stay RU (architectural reasons). Extension untouched; `/en/*` visible via search + header switcher. | ✓ |
| Marketing + `/en/welcome` + `/en/pay` + `/en/success` | Adds `/en/success`. But YooKassa is RUB-only; no EN payer ever reaches it. | |
| Coordinated `promptscore` release | Plus extension update so `navigator.language` picks `/welcome` vs `/en/welcome`. Maximum reach, but coordinated 2-repo release + new `manifest.json`. | |

**User's choice:** "Recommended" — after explicit per-route analysis of what could break.
**Notes:** Decision drivers per route:
- `/welcome` — fully bilingual content (10 i18n keys per lang) + EN screenshots already in `public/assets/welcome-en*.png`. Zero-risk add.
- `/pay` — 33 i18n keys per lang, billing logic handles both currencies. Requires `prerender.mjs` to inject Paddle sync `<script>` into `dist/en/pay/index.html` too (D-03b). Integration Contract §6 extended symmetrically — same protocol applies to `/en/pay`.
- `/success` — YooKassa-only return URL; EN payers go through Paddle Checkout modal which never lands here. `/en/success` would be a dead page.
- `/account` — `Disallow`'d, extension-coupled, zero GEO value.
- `/dashboard/download-skill` — `Disallow`'d, Pro-only, extension-coupled.

Codebase verification done before choosing: `Object.keys(en.json).length === 203 === Object.keys(ru.json).length`, no missing translations. PayPage/AccountPage/SuccessPage/WelcomePage all already drive content from `useT()`. Becomes D-03 + D-03b.

---

## EN-SEO-meta source of truth

| Option | Description | Selected |
|--------|-------------|----------|
| Directly in `seo-routes.ts` | Extend `RouteMeta` with `htmlLang` field; add 6 new entries for `/en/*`. Minimum new abstractions; SEO meta stays build-time contract, decoupled from runtime. | ✓ |
| From `en.json` + `ru.json` | Add ~30 `meta.*` keys to both JSONs; `seo-routes.ts` imports. Pricier bootstrap but kills "duplicated from ru.json" drift. | |

**User's choice:** Directly in `seo-routes.ts` (recommendation).
**Notes:** Becomes D-04. The JSON-import refactor is deferred to a future hygiene phase that can touch i18n + SEO together (recorded in CONTEXT.md `<deferred>`).

---

## LangContext language detection (Claude's discretion noted)

Not posed as a multi-option question — fixed in the framing because there's no real alternative. URL prefix `/en/` must take precedence over `navigator.language` and `localStorage.opten_lang`. Implementation choice (useEffect vs `useLocation` from `react-router`) is Claude's discretion. Becomes D-05.

---

## Pre-Phase-3: hydration mismatch on `/`

| Option | Description | Selected |
|--------|-------------|----------|
| Fix as Plan 01 of Phase 3 | Phase 3 Plan 01 = diagnose + fix the mismatch. Other plans wait. Clean baseline for dynamic `<html lang>`. Escalation path: if root cause is architectural, split into a separate mini-phase during plan-phase. | ✓ |
| Separate mini-phase 2.3 BEFORE Phase 3 | Full discuss/plan/execute cycle for the hydration issue alone. Pricier in workflow overhead, but problem fully isolated. | |
| Live with it | Mismatch is invisible to user; React recovers via client re-render. Risk it through Phase 3 and verify with Playwright at acceptance. Goes against STATE.md recommendation. | |

**User's choice:** Fix as Plan 01 of Phase 3 (recommendation).
**Notes:** Becomes D-06. STATE.md "Pre-Phase-3 known mismatch (carried from Phase 02.2)" entry directly motivated this option.

---

## Claude's Discretion

Items the discussion explicitly left to the planner / researcher:

- **Hreflang placement** — in each prerendered `<head>` (preferred) vs sitemap.xml-level annotations. Both valid; defaulting to `<head>` for AI-crawler-without-sitemap-discovery coverage.
- **Sitemap.xml shape** — pair-listed entries vs `<xhtml:link rel="alternate">` annotations. Cosmetic.
- **`scripts/seo-routes.ts` entry ordering** — RU-then-EN grouped vs per-page interleaved. Cosmetic.
- **`LangContext` URL-prefix detection implementation** — `useEffect` on path change vs `react-router`'s `useLocation`. `useLocation` is cleaner because language follows route.
- **Header language-switcher routing behavior** — does "EN" while on `/welcome` go to `/en/welcome` or to `/en/`? Default: route to the EN sibling if it exists, else `/en/`.
- **Treatment of the language switcher on RU-only locked routes (`/success`, `/account`, `/dashboard`)** — disable EN button or route to `/en/`. Default: route to `/en/` (friendlier).

---

## Deferred Ideas

- Physical `/ru/*` symmetry — keep virtual now (hreflang `ru → /`); revisit if SEO instrumentation post-launch suggests crawlers prefer explicit `/ru/*`. Reversible via 301 redirects.
- `/en/success`, `/en/account`, `/en/dashboard/download-skill` — no architectural reachability path for EN users; revisit only if a coordinated `promptscore` release ever opens them.
- Coordinated `promptscore` extension release that opens `/en/welcome` / `/en/pay` based on `navigator.language` — out of scope (requires `manifest.json` bump + `docs/INTEGRATION-CONTRACT.md §5` breaking-change protocol).
- EN-meta migration to `en.json`/`ru.json` as single source of truth — appealing long-term, defer to a future hygiene phase that can touch i18n + SEO together.
- Server-side `/` → `/en/` redirect on `navigator.language=en` — rejected in D-02; revisit only if measured EN conversion on `/` is much worse than `/en/`.
- `<html lang>` per-language in `index.html` source template — template stays `lang="ru"` (only consumer is `dist/index.html`).
- UI polish on the header language switcher — out of scope for routing-focused phase.
- Phase 4 (`/about`, `/guides/*`, FAQ schema) — explicit Phase 4 scope; Phase 3 ships scaffolding so Phase 4 plans land bilingual from day one.
