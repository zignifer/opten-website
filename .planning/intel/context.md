---
tags:
  - gsd
  - intel
  - context
kind: "intel-context"
---
# Context Intel

Running notes synthesized from DOC-type sources. Material that informs planning but is not itself a decision, requirement, or constraint. Topics are organized for the roadmapper consumer.

---

## Topic: Product & business framing

**Source:** CLAUDE.md (project rules, not ingested as doc) + cross-doc preamble in ARCHITECTURE.md and GEO-AUDIT-REPORT.md.

- **Product:** Opten — Chrome extension that scores and improves AI image-generation prompts inline in 43+ web-based image generators (Midjourney, DALL-E, Stable Diffusion, Flux, etc.).
- **This repo:** `opten.space` — the public marketing/billing site, not the product itself. The site's three jobs: (1) marketing surface (RU/EN landing), (2) billing surface (`/pay`, `/account`, `/success` for YooKassa RUB + Paddle USD), (3) Pro-only utilities (`/dashboard/download-skill`).
- **Audience:** Bilingual RU/EN. RU is the dominant audience today; EN funnel is under-served.
- **Adjacent repos:** Extension at `C:\Projects\promptscore` (private `zignifer/promptscore`), AI proxy at `C:\Projects\promptscore-proxy` (private, not used by the site).

---

## Topic: Current technical stack (snapshot 2026-05-14)

**Source:** C:\Projects\opten-website\docs\TECH.md

- **Build/runtime:** Vite 6.3.5, React 18.3.1, TypeScript (via Vite transpilation; no `tsc` script), React Router 7.13.0 (`react-router`, not `react-router-dom`).
- **Styling:** Tailwind CSS 4.1.12 via `@tailwindcss/vite`; `tw-animate-css`; theme tokens in `src/styles/theme.css`; custom fonts in `src/styles/fonts.css`.
- **UI libs (heavy surface — audit candidate):** Radix UI primitives (~25 packages), MUI 7.3.5 + icons, Lucide React, `motion` (formerly Framer Motion), `embla-carousel-react`, `react-slick`, `sonner`, `canvas-confetti`, `recharts` (unclear where used; possibly dead weight from Figma Make export).
- **Forms:** `react-hook-form` 7.55.
- **Backend integration:** plain `fetch` to Supabase REST/Functions; no `@supabase/supabase-js` SDK. As of the Phase 88 cutover (2026-05-25, extension v2.8 milestone), `SUPABASE_URL` is `https://supabase.opten.space` — self-hosted on a Beget RU VPS (PG17, Caddy v2.11.3 front). Cloud `vuywydhwkqmihfztpkgl.supabase.co` is a frozen cold backup. Anon key unchanged (same `JWT_SECRET` reused). JWT verification on the site (`api/download-skill.ts`) is now local + dual-issuer (HS256 self-hosted + ES256 cloud JWKS for legacy tokens); the legacy `EXTENSION_SECRET` bearer path is gone.
- **Paddle:** v2 SDK loaded synchronously from CDN in `index.html`; initialized in `src/main.tsx`.
- **i18n:** custom React context (`src/i18n/LangContext.tsx`); two dicts (`ru.json` ~68KB, `en.json` ~41KB); detection via `localStorage.opten_lang` → `navigator.language`.
- **Vercel serverless:** single function `api/download-skill.ts`; ZIP bundled via `vercel.json` `includeFiles: "api/_assets/**"`.
- **Env vars (public Vite vars):** `VITE_PADDLE_ENV`, `VITE_PADDLE_CLIENT_TOKEN`.
- **Scripts:** only `build` and `dev`. **No `test`, no `lint`, no `typecheck`.** TS errors only surface during `vite build`.
- **Deploy:** auto on push to `main` via Vercel. Active project name per recent commits: `opten-website2`. Custom domain: `opten.space`.
- **Hygiene flags:** three overlapping icon/UI ecosystems (Radix + MUI + Lucide + react-slick + embla); Figma Make origin (`package.json` name `@figma/my-make-file`); auto-generated Figma SVG dumps in `src/imports/` are brittle to manual edits.

---

## Topic: Architecture & routes

**Source:** C:\Projects\opten-website\docs\ARCHITECTURE.md

- **Eight SPA routes**, declared in `src/main.tsx`:
  - `/` → `App.tsx` (landing)
  - `/pay` → `PayPage.tsx` (YooKassa RU / Paddle EN)
  - `/success` → `SuccessPage.tsx` (post-YooKassa)
  - `/account` → `AccountPage.tsx` (subscription mgmt)
  - `/welcome` → `WelcomePage.tsx` (first-install onboarding)
  - `/dashboard/download-skill` → `DownloadSkillPage.tsx` (Pro-only ZIP)
  - `/privacy` `/terms` `/refund` → legal pages
- **SPA rewrite:** Vercel rewrites all non-`/api/` paths to `/index.html`; React Router handles client-side routing.
- **Billing flow (RU/YooKassa):** PayPage → `GET_AUTH_TOKEN` → `POST /create-payment` (Bearer JWT, `{ recurring: true }`) → response `{ confirmation_url }` → redirect to YooKassa-hosted page → user pays → YooKassa redirects to `/success`; webhook updates `subscriptions` table with `ps_sub_provider='yookassa'`.
- **Billing flow (EN/Paddle):** PayPage → `GET_AUTH_TOKEN` → `POST /create-payment-paddle` → response `{ priceId, customerEmail, userId }` → `window.Paddle.Checkout.open(...)` → Paddle overlay handles checkout; webhook → `/webhook-paddle` (HMAC-SHA256) updates `subscriptions` with `provider='paddle'`. No `/success` redirect — overlay closes itself.
- **Account/cancellation:** AccountPage → `GET_AUTH_TOKEN` + `GET_SUBSCRIPTION` to render → `CANCEL_SUBSCRIPTION` → extension reads `ps_sub_provider` and dispatches to `cancel-subscription` or `cancel-subscription-paddle` Edge Function → response `{ success, expires_at }`; status flips to `cancelled`, plan stays `pro` until expires_at.
- **Skill ZIP flow:** DownloadSkillPage tries `EXTENSION_IDS` sequentially → `GET_AUTH_TOKEN`. If no extension → install CTA; if not Pro → upgrade CTA; if Pro → download button → `GET /api/download-skill` with Bearer JWT → serverless validates JWT against Supabase + queries `subscriptions WHERE plan=pro AND status IN (active, cancelled)` → streams `api/_assets/opten.zip` or 403 with `upgrade_url: /account?upgrade=skill`.
- **State summary:** site has no persistent server-side state of its own. `localStorage`: `opten_lang`, `opten_pay_currency`. Extension owns auth/plan via `chrome.storage.local.ps_*`. Supabase `subscriptions` table owned by extension repo.

---

## Topic: SEO baseline (pre-GEO-Phase-A)

**Source:** C:\Projects\opten-website\docs\SEO-AUDIT.md

- **TL;DR:** Site has basic OG/Twitter tags and favicons — and that is essentially all the SEO it has. No sitemap, no robots.txt, no JSON-LD, no hreflang, no per-page meta, no analytics, no canonical strategy.
- **What exists:** `<title>` (RU-only, applied to every route), RU `meta description`, OG/Twitter cards (image is a 310×310 favicon — too small; recommended 1200×630), 14 favicon sizes (excessive but harmless), `<html lang="ru">` hardcoded with client-side flip, Paddle script synchronous in `<head>`.
- **`vercel.json` baseline:** SPA rewrite present; no cache headers, no security headers, no `cleanUrls`, no `trailingSlash`.
- **Critical gaps enumerated** (full list in source):
  1. No `sitemap.xml`
  2. No `robots.txt`
  3. No `<link rel="canonical">`
  4. No `hreflang` — biggest single loss for EN funnel
  5. No per-route `<title>`/`<meta description>`
  6. No JSON-LD (SoftwareApplication, Organization, BreadcrumbList, FAQPage, Product+Offer)
  7. No per-language URL strategy
  8. OG image is a 310×310 favicon
- **Perf / CWV:** Paddle script blocks parser (cannot be `async` — see contract §6); mitigation = `preconnect` to `cdn.paddle.com`. No image-optimization strategy. No font-display audit. No bundle analysis.
- **Measurement:** No analytics, no Search Console verification, no error monitoring.
- **Proposed phase split (preview only — not a roadmap):**
  - Phase A: SEO foundation (static) — sitemap, robots, per-lang paths, per-route titles/descriptions, hreflang, canonical, OG cards
  - Phase B: Structured data (SoftwareApplication / Organization / Product JSON-LD)
  - Phase C: Performance (Paddle preconnect, image opt, font-display, bundle)
  - Phase D: Measurement (analytics, Search Console, Sentry)
- **Hard prerequisite for phases A-B:** per-language URL strategy decision.
- **Don't touch:** locked routes (`/welcome`, `/pay`, `/success`) — see INTEGRATION-CONTRACT §3.

---

## Topic: GEO (AI-citability) baseline (pre-Phase-A)

**Source:** C:\Projects\opten-website\.planning/research/GEO-AUDIT.md

- **Overall GEO score: 12/100 (Critical).** Bilingual SaaS audited across 7 routes.
- **Root cause:** Vite SPA with no SSR. Every route returns the byte-identical `index.html` with 9 words of `<title>`/`<meta>` content, 0 `<h1>` tags, 0 JSON-LD blocks, 0 internal links, empty `<div id="root">`. To AI crawlers, the entire site is one document.
- **Score breakdown:** AI Citability 5/100, Brand Authority 20/100, Content E-E-A-T 8/100, Technical GEO 12/100, Schema 0/100, Platform 25/100.
- **Critical findings:**
  - **C-1 No SSR** — entire site is one empty SPA shell. Fix = static prerender (Vite SSG / vite-plugin-ssr / Vike).
  - **C-2 robots/sitemap/llms.txt return SPA HTML** — Vercel rewrite swallows the paths, worse than 404. Fix = real files in `public/`.
  - **C-3 Zero structured data** — no JSON-LD anywhere. Fix = inline in `index.html` head pre-hydration.
  - **C-4 All 7 routes share one `<title>`/`<meta>`** (RU only). Fix = per-route head management (preferably build-time prerender).
  - **C-5 No language signaling for EN audience** — `<html lang="ru">` hardcoded, no `hreflang`. Fix = `/ru/*` `/en/*` path-prefix strategy.
- **High-priority findings (H-1..H-5):** No llms.txt; OG card is a tiny favicon; no `/about` E-E-A-T surface; "Opten" brand collides with Hungarian legal DB + Australian company; no security headers beyond HSTS.
- **Medium (M-1..M-5):** no canonicals; no per-route robots meta; no FAQ schema; no HowTo content; no Wikipedia/Reddit/YouTube presence.
- **Low (L-1..L-5):** 14 favicons; no Paddle preconnect; no Web App Manifest; hardcoded `og:locale: ru_RU`; no analytics.
- **Quick wins** (named by the audit as "this week" candidates):
  1. robots.txt + sitemap.xml + llms.txt
  2. Inline JSON-LD SoftwareApplication + Organization
  3. 1200×630 OG card
  4. Paddle preconnect
  5. Security headers in `vercel.json`
  — these five together would move the score 12 → ~30 without touching React. **This is the GEO Phase A scope.**
- **30-day plan from the audit** (informational — does NOT bind the roadmap):
  - Week 1: static GEO foundations (matches Phase A)
  - Week 2: per-route metadata + prerender spike
  - Week 3: bilingual + E-E-A-T
  - Week 4: content surface + measurement

---

## Topic: Cross-route head-management strategy (open question)

**Source:** SEO-AUDIT.md §"Likely fix shape" + GEO-AUDIT-REPORT.md C-4

Two options surfaced for per-route `<title>`/meta/canonical:
1. Runtime via `react-helmet-async` — doesn't help non-JS crawlers.
2. Build-time prerender — works hand-in-hand with C-1 (SSR), is the preferred fix.

No decision recorded yet. Phase B territory.

---

## Topic: Per-language URL strategy (open question — Phase B/C prerequisite)

**Source:** SEO-AUDIT.md §"Likely fix shape" + GEO-AUDIT-REPORT.md C-5

Options listed:
- `/ru/*` `/en/*` path prefixes — recommended as cleanest.
- `?lang=` query — worst.
- `ru.opten.space` subdomain — adds DNS+SSL overhead.

No decision recorded yet. The constraint that matters: locked routes `/welcome`, `/pay`, `/success` MUST continue to respond at root paths (extension deep-links). New `/ru/welcome` etc. are **additions, not replacements** (see CON-locked-routes-keep-existing-paths).

---

## Topic: Subscription plan state semantics

**Source:** INTEGRATION-CONTRACT.md §2.3 + §5 + ARCHITECTURE.md skill ZIP flow

- `plan: 'free' | 'pro' | 'cancelled'`.
- `plan === 'cancelled'` is a transitional state: user cancelled but is still inside the paid period. **Treat as Pro for access purposes** — download skill, no upgrade nag. `expires_at` is when access actually ends. Mirrors `api/download-skill.ts:78-85`.
- `limit: 300` for Free is the L3C-01 product positioning (popup shows `0/300` — Pro-лимит, на который нацелен апгрейд); the proxy enforces `FREE_LIMIT=0` server-side since the Phase 88 go-live (2026-05-25, flipped on Vercel production to match the popup display — free = 0 операций, Pro required). Do not "fix" this on the site unless the env var is also flipped back.
- Legacy users (created pre-Phase 67) with missing `ps_sub_provider` fall back to `'yookassa'` for cancellation dispatch — do not strip the fallback without a migration.

---

## Topic: Phase numbering convention

**Source:** CLAUDE.md (project rules)

- Phase references in code/comments: `// Phase 66:`, `// Phase 73:` — match the **extension repo's** phase numbering when changes span both repos.
- Design decisions: `// D-04:`, bugs: `// BG-67-01:` — same convention as the extension.
- This planning workflow uses GSD-style numbered phases (per MEMORY.md), distinct from but compatible with the extension's phase numbering.

---

## Topic: Files explicitly off-limits (do-not-touch list)

**Source:** SEO-AUDIT.md §"Files that should NOT be touched" + INTEGRATION-CONTRACT.md

- Routes `/welcome`, `/pay`, `/success` — locked per INTEGRATION-CONTRACT §3. New language-prefixed siblings are additions, not replacements.
- `EXTENSION_IDS` arrays in PayPage / AccountPage / DownloadSkillPage — keep the three in sync. Consider extracting to a single shared constant in a future refactor.
- Hardcoded `SUPABASE_URL` / `SUPABASE_ANON_KEY` — rotating requires coordinated commit across the three site files + extension `config/api.js`.
