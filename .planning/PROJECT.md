---
tags:
  - gsd
  - project
  - moc
kind: "project-context"
aliases:
  - Project Context
---
# opten-website

## What This Is

`opten.space` is the public website for **Opten**, a Chrome extension that scores and improves AI image-generation prompts inline in 43+ image generators (Midjourney, DALL-E, Stable Diffusion, Flux, ...). The site itself is not the product — the extension is. The site exists to do three jobs: marketing surface (RU/EN landing), billing surface (`/pay`, `/account`, `/success` for YooKassa RUB + Paddle USD), and Pro-only utilities (`/dashboard/download-skill`).

Primary audience: Russian-speaking AI image-prompt power users + Pro tier upsell from the Opten Chrome extension. Bilingual (RU primary, EN secondary — EN funnel currently under-served).

## Core Value

The site must reliably **sell, service, and onboard extension users without breaking the shipped integration contract with the extension binary**. If everything else fails, locked routes (`/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`) and the four-message `externally_connectable` API to the extension must keep working.

## Current Milestone

**GEO Optimization** — raise opten.space GEO score from **12/100 → ~30/100 (Phase 1) → higher (Phases 2-5)** by adding static foundations and gradually layering prerender, bilingual paths, content surface, and brand authority. Success metric for Phase 1: GEO score moves from 12 → ~30 within 14 days of deploying Phase 1 (measured by the `geo-seo-claude` audit tool).

## Requirements

See `.planning/REQUIREMENTS.md` for the full list. Headline:

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet in this milestone — Phase 1 in flight)

### Active (v1 of this milestone)

- [ ] **REQ-GEO-A-1..8** — 8 atomic static-GEO commits (Phase 1: robots.txt, sitemap.xml, llms.txt, OG hero cards, inline JSON-LD, OG meta replacement, Paddle preconnect, security headers in vercel.json)

### Deferred (v2 / future phases)

- **REQ-GEO-B** — per-route prerender + per-route metadata (Phase 2)
- **REQ-GEO-C** — bilingual routing strategy (Phase 3)
- **REQ-GEO-D** — content surface: /about, /guides/*, FAQ schema (Phase 4)
- **REQ-GEO-E** — brand authority: Product Hunt, Wikipedia, Reddit, YouTube, sameAs schema (Phase 5)

### Out of Scope (this milestone)

- **CSP header** — conflicts with Paddle inline script; separate ticket. Not silently to be added inside Phase 1's vercel.json edit.
- **`@supabase/supabase-js` SDK** — site uses plain fetch; not switching.
- **Tests / ESLint / typecheck script** — codebase has none; not adding inside a GEO milestone. Verification gate stays `npm run build` + `npm run preview` + manual curl.
- **Renaming any locked route** — replacement requires a redirect from the old path (per integration contract).

## Context

- **Coupled repo:** `C:\Projects\promptscore` (private `zignifer/promptscore`) — owns the Chrome extension binary, Supabase Edge Functions, Paddle/YooKassa webhooks, migrations. The site only **calls** Edge Functions.
- **AI proxy:** `C:\Projects\promptscore-proxy` — private; not used by the site.
- **Stack:** Vite 6 + React 18.3 + React Router 7 + Tailwind 4. No tests, no lint, no typecheck script. TS errors surface only during `vite build`.
- **i18n:** custom React context, RU/EN dicts in `src/i18n/{ru,en}.json`. `localStorage.opten_lang` + `navigator.language` detection. `<html lang="ru">` is hardcoded.
- **State:** site has no persistent server-side state of its own. `localStorage`: `opten_lang`, `opten_pay_currency`. Extension owns auth/plan via `chrome.storage.local.ps_*`.
- **Deploy:** Vercel auto-deploys `main`. Project: `opten-website2`. No release versioning — every push to `main` is a release.
- **Hygiene flag:** site has three overlapping icon/UI ecosystems (Radix + MUI + Lucide + react-slick + embla) inherited from Figma Make origin. Possible dead weight; tracked but not in this milestone.
- **GEO baseline:** 12/100. Root cause: SPA shell, no SSR — every route returns byte-identical empty `index.html`. To AI crawlers, the entire site is one document.
- **Two open strategic questions** (Phase 2/3 prerequisites, no resolution yet):
  - Cross-route head-management strategy (`react-helmet-async` vs build-time prerender)
  - Per-language URL strategy (`/ru/*` `/en/*` vs `?lang=` vs subdomain)

## Constraints

- **Tech stack**: Vite + React 18 + Tailwind 4 + Paddle.js v2 + Supabase REST/Functions — fixed for this milestone; no framework changes.
- **Deployment**: Vercel static + 1 serverless function (`api/download-skill.ts`). No backend in this repo.
- **Compatibility**: Must remain compatible with shipped extension `manifest.json v1.3.5` (and all older shipped versions, until they expire by `chrome.runtime` deprecation).
- **Verification**: No tests, no lint, no typecheck — every requirement's acceptance gate is `npm run build` + `npm run preview` + manual curl/inspection. Do NOT invent test-shaped acceptance criteria.
- **Phase 1 confinement**: Phase 1 MUST NOT touch React source or the build pipeline. All changes confined to `public/`, `index.html`, `vercel.json`. No new dependencies.
- **Locked-route preservation**: Phase 3 bilingual URLs MUST add `/ru/*` `/en/*` siblings **alongside** locked routes — never rename `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill`.
- **Static-file precedence**: any file added under `public/` shadows a same-name SPA route. Any path that must serve as text/plain, application/xml, or image/* MUST exist as a real file in `dist/`; otherwise the SPA rewrite returns `text/html`.

## Key Decisions

The following 8 decisions are **LOCKED** by `docs/INTEGRATION-CONTRACT.md` (binding interface with the Opten Chrome extension repo at `C:\Projects\promptscore`). They are reproduced verbatim below from `.planning/intel/decisions.md` — do not auto-override.

<decisions>

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **DEC-integration-contract-locked-routes** — `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` must stay live with documented behavior, indefinitely. Replacement requires a redirect from the old path. | Already-installed extensions deep-link to these paths; renaming breaks affected users. | ✓ Good (locked) |
| **DEC-integration-contract-message-api** — Site is sole initiator of `externally_connectable` messages; extension only replies. Four message types: `GET_AUTH_TOKEN`, `GET_SUBSCRIPTION`, `CANCEL_SUBSCRIPTION`, `WARMUP`. Forward-compat: site MUST NOT assume response is exhaustive. | Only legal channel for site to read auth/subscription state. Extension validates `sender.url` against `https://opten.space` (SEC-02). | ✓ Good (locked) |
| **DEC-integration-contract-extension-ids** — `EXTENSION_IDS = ["iphkppgbobpilmphloffcalicmejacfl", "kcmcaeenfmfnpiaihicecnfnagejpcog"]` duplicated in PayPage.tsx, AccountPage.tsx, DownloadSkillPage.tsx. Must rotate together. | If CWS ID changes (re-upload as new listing), all three pages must update. Pages iterate the list and pick whichever responds first. | ✓ Good (locked) |
| **DEC-integration-contract-supabase-constants** — `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"` + anon key (public-by-design `anon` role JWT) duplicated across 4 files (PayPage.tsx, AccountPage.tsx, api/download-skill.ts, extension's `config/api.js`). Must rotate together. | Rotating/migrating Supabase project requires one coordinated commit across all 4 files. | ✓ Good (locked) |
| **DEC-integration-contract-edge-functions** — All Edge Functions are owned and deployed from the **extension repo** (`C:\Projects\promptscore\supabase\functions\`). Site only calls them. Site call sites: `create-payment`, `create-payment-paddle`, `get-subscription` (rare fallback). | Schema changes require coordinated deploys across both repos. | ✓ Good (locked) |
| **DEC-integration-contract-storage-keys** — All subscription/auth state lives in extension's `chrome.storage.local` under `ps_*` prefix. Site reads indirectly via message API only. Special semantics: `plan === 'cancelled'` means cancelled-but-still-in-paid-period — treat as Pro for access (see `api/download-skill.ts:78-85`). Breaking-change protocol: add new key parallel to old → ship release writing both → update site → remove old key in follow-up extension release. | Never rename in one repo without the other. | ✓ Good (locked) |
| **DEC-integration-contract-paddle-init** — Paddle CDN script MUST load synchronously in `index.html` (not async/defer) — guarantees `window.Paddle` exists before `main.tsx` runs (Pitfall BG-67-01). MUST NOT call `Paddle.Environment.set('production')` (v2 SDK throws). Env vars: `VITE_PADDLE_ENV` (sandbox\|production), `VITE_PADDLE_CLIENT_TOKEN`. | Switching script tag attributes will race-condition PayPage. Paddle env switches must coordinate with `create-payment-paddle` Edge Function priceId flips. | ✓ Good (locked) |
| **DEC-integration-contract-update-protocol** — Update `docs/INTEGRATION-CONTRACT.md` BEFORE merging a change to either repo if it touches: `manifest.json externally_connectable`, `background/background.js onMessageExternal`, any §3 route, any Edge Function shape (§4), any `ps_*` key (§5), `EXTENSION_IDS` (§2.2), or `SUPABASE_URL`/`SUPABASE_ANON_KEY` (§4). Bump "Last sync" date and extension version reference. | Last sync: 2026-05-14 against extension `manifest.json v1.3.5`. | ✓ Good (locked) |

</decisions>

Additional milestone-level decisions (added during planning):

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Phase 1 confined to static files | Spec mandate: no React or build-pipeline changes in Phase A. Eight atomic commits; Task 8 (vercel.json) executed last as highest-risk. | — Pending |
| `robots.txt` keeps `/pay` crawlable | `/pay` is a marketing/pricing surface, not transactional-only. Diverges from SEO-AUDIT.md's broader recommendation; SPEC wins by precedence. | — Pending |
| `sitemap.xml` lists exactly 6 routes | `/account`, `/success`, `/dashboard/*` deliberately omitted (also Disallow'd). `lastmod` omitted in Phase 1; add in Phase 2 when prerender produces per-route build metadata. | — Pending |
| `llms.txt` is English only | Audience is 100% LLMs; AI-assistant queries are predominantly English. | — Pending |
| OG `og:image` = RU card | `<html lang="ru">` is hardcoded; dominant audience is RU today. EN card sits in `public/` ready for Phase 2 per-route meta to point at it. | — Pending |
| CSP header deferred from Phase 1 | Interacts with Paddle's inline script; requires per-source nonce coordination. Separate ticket. | — Pending |

---
*Last updated: 2026-05-14 after `new-project-from-ingest` bootstrap from `.planning/intel/`*
