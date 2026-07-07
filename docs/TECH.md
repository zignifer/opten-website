# Tech Stack — opten.space

> Snapshot taken 2026-05-14, refreshed 2026-07-07 (public Learn, Learn Finds,
> hidden Kinescope course, Telegram hidden intro funnel, course API endpoints,
> route count update).
> Re-run discovery when `package.json` or build tooling changes meaningfully.

## Build & runtime

- **Vite 6.4.3** (pinned via pnpm overrides) — `npm run dev` for local, `npm run build` for production
- **React 18.3.1** + **React DOM 18.3.1** (peer deps, marked optional in `package.json` — unusual but works for Figma Make export origin)
- **TypeScript** via Vite's transpilation (no `tsc` in scripts)
- **`@vitejs/plugin-react` 4.7.0** + **`@tailwindcss/vite` 4.1.12** — both plugins required even though only React is heavily used. Do not remove (commented note in `vite.config.ts:9`).
- **Alias `@` → `./src`** in [`vite.config.ts`](../../vite.config.ts) — usable but most code uses relative imports.

## Routing

- **React Router 7.17.0** (`react-router` package, not `react-router-dom` — v7 unified API)
- **~39 client route patterns** declared in [`src/main.tsx`](../../src/main.tsx) + a catch-all 404, expanding to **204 prerendered SEO routes**:
  - **Marketing/legal/pricing/welcome:** 14 routes across RU + EN.
  - **Blog:** 40 routes across RU + EN.
  - **Model pages (Phase v2.0):** `/models` hub + `/models/:slug` (62 models) + `/en/*` mirrors = 2 hubs + 124 model pages, 126 routes total.
  - **Public Learn:** `/learn`, `/learn/:lessonSlug`, `/learn/finds/:findSlug` + `/en/*` mirrors = 24 routes total.
  - **SPA-only/noindex:** `/login`, `/auth/callback`, `/account`, `/success`, `/dashboard/download-skill`, `/prompt-library`, `/p/:slug`, `/app/*`, `/space/*`, `/internal/*`, `/learn/templates/*`, `/learn/courses/*`, `/en/learn/templates/*`.
  - **Catch-all** `<Route path="*">` → `<NotFound>` (locale-aware, injects `<meta robots=noindex>` at runtime)
- **Legacy redirects** (`vercel.json` `redirects[]`): `/guides`, `/en/guides`, `/guides/gpt-image-2`, `/en/guides/gpt-image-2` → `/blog`, `/en/blog`, `/blog/gpt-image-2`, `/en/blog/gpt-image-2` (Phase 5 B-07)
- **`vercel.json` rewrite:** all non-`/api/` paths → `/index.html` (SPA fallback at runtime; the prerendered HTML files in `dist/<route>/index.html` are what AI crawlers and link-unfurl bots see on first byte)

## Styling

- **Tailwind CSS 4.1.12** via the official Vite plugin (no `postcss.config.mjs` magic; the `postcss.config.mjs` file exists but the Vite plugin is what runs)
- **`tw-animate-css` 1.3.8** — animation utility classes
- Style entry point: [`src/styles/`](../../src/styles/) — `index.css`, `tailwind.css`, `theme.css`, `fonts.css`
- **Self-hosted SUBSET fonts** (`public/fonts/*.woff2`, 2026-05-21): Unbounded (~81 KB) + PT Root UI (~65 KB), weight axis pinned 400–700, subset to the real RU+EN corpus via [`scripts/subset-fonts.py`](../../scripts/subset-fonts.py) and gated by [`scripts/verify-fonts.mjs`](../../scripts/verify-fonts.mjs). Unbounded is preloaded (`<link rel=preload>` in `index.html` — it's the H1 LCP element, `font-display: swap`); PT Root UI uses `font-display: optional` (zero CLS).
- **iOS-Safari paint budget:** heavy `filter: blur` (hero gradient) and `backdrop-filter` (fixed header on mobile) were trimmed 2026-05-21 — cheap on Chrome but they saturate WebKit's main thread, delaying interactivity + scroll response on iPhone. See [`.planning/research/SAFARI-MOBILE-INTERACTIVITY.md`](../.planning/research/SAFARI-MOBILE-INTERACTIVITY.md).

## UI libraries

- **Radix UI** primitives (~25 packages: accordion, dialog, dropdown, popover, tabs, tooltip, etc.) — used for headless behavior; styled via Tailwind
- **MUI 7.3.5** (Material-UI v7) + `@mui/icons-material` — used selectively, mostly for icon glyphs. Note: pulling MUI v7 alongside Radix is heavy; consider whether MUI is still earning its weight.
- **Lucide React 0.487.0** — icon set, lighter alternative to MUI icons
- **`motion` 12.23.24** (formerly Framer Motion) — scroll-reveal animations on the landing
- **`embla-carousel-react` 8.6.0** — carousels
- **`react-slick` 0.31.0** — second carousel library (consider consolidating)
- **`sonner` 2.0.3** — toasts
- **`canvas-confetti` 1.9.4** — confetti effect (likely on success/welcome)
- **`recharts` 2.15.2** — charts (unclear where used; may be dead weight from the Figma Make export)

## Forms

- **`react-hook-form` 7.55.0** — primary form library

## Backend integration

- **Plain `fetch`** to Supabase REST + Functions endpoints — no `@supabase/supabase-js` SDK
- **Website auth/session helpers** live in [`src/lib/optenAuth.ts`](../../src/lib/optenAuth.ts) and store the website Supabase session in `localStorage.opten_space_session_v1`. `/pay`, `/account`, `/app/*`, and hidden course access prefer website JWTs; `/pay` and `/account` retain extension JWT fallback for shipped flows.
- **Hardcoded constants** in [`src/lib/optenAuth.ts`](../../src/lib/optenAuth.ts), [`src/lib/promptLibraryApi.ts`](../../src/lib/promptLibraryApi.ts), [`PayPage.tsx`](../../src/app/pages/PayPage.tsx), [`AccountPage.tsx`](../../src/app/pages/AccountPage.tsx), [`api/download-skill.ts`](../../api/download-skill.ts), and server shared helpers:
  - `SUPABASE_URL = "https://supabase.opten.space"` — **self-hosted** on Beget RU VPS (PG17, Caddy v2.11.3 front) since the Phase 88 cutover (2026-05-25, extension v2.8 milestone). The cloud project `https://vuywydhwkqmihfztpkgl.supabase.co` is now a frozen cold backup, not an active backend; it was removed from the extension's `host_permissions` in v1.3.7.
  - `SUPABASE_ANON_KEY = "eyJ...A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg"` — **unchanged** across the cutover. Self-hosted GoTrue reuses the same `JWT_SECRET` as the cloud project, so the existing anon key (issuer `ref: vuywydhwkqmihfztpkgl` baked into the JWT payload) is still accepted by self-hosted Kong. No key rotation required.
- **JWT verification (Phase 88 dual-issuer):** site serverless functions verify user JWTs **locally** with `jose` against the Supabase issuer allowlist and `SUPABASE_JWT_SECRET`; no `/auth/v1/user` session lookup. `api/download-skill.ts` gates Pro skill ZIP by `subscriptions`. `api/kinescope-course-token.ts` and `api/course-prompt.ts` gate hidden course content by `course-access-summary`.
- **Standalone course checkout/access** is owned by extension-side Supabase Edge Functions: `create-course-payment` (guest email + RUB/YooKassa or USD/Paddle one-time checkout, optional uppercase promo code, optional `quote_only: true` price preview) and `course-access-summary` (claim/read `course_entitlements` by website JWT email/user id). Promo rules live server-side in `course_promo_codes`; the browser receives only the quote/payment response and must not query promo rows directly.
- **Telegram hidden intro funnel** is also extension-owned: `telegram-hidden-intro-webhook` stores started users and events, checks channel subscription, and issues a 24h `course_discount_claims` token; `telegram-hidden-intro-opened` records lesson opens; `telegram-hidden-intro-stats`, `telegram-hidden-intro-broadcast`, and `telegram-hidden-intro-reminders` are service endpoints protected by `X-Opten-Admin-Secret`. A website admin surface must call them only through server-side `/api/*` proxies after website JWT + owner allowlist checks.
- **Paddle.js v2** loaded synchronously from `cdn.paddle.com` in [`index.html`](../../index.html). Initialized in [`main.tsx`](../../src/main.tsx) (Phase 67 fix: do not call `Environment.set('production')` — only sandbox).

## i18n (post-Phase-3)

- Custom context: [`src/i18n/LangContext.tsx`](../../src/i18n/LangContext.tsx)
- Two dicts: [`ru.json`](../../src/i18n/ru.json) (~68 KB), [`en.json`](../../src/i18n/en.json) (~41 KB) — both statically imported and **eagerly available on the client** (2026-05-21 fix `3f4cc80`). The earlier Phase 2.2 "lazy EN" optimization was already moot — the SSR-fallback static import pulled `en.json` into the entry chunk regardless — and on `/en/*` the EN dict MUST be present synchronously at the first client render or hydration mismatches (React #418 → buttons unresponsive for a beat on iOS Safari). `loadEnDict()` survives as a no-op fast-return for the SPA language-switch path
- Detection precedence: URL `/en/*` prefix → `localStorage.opten_lang_v3` (explicit choice) → legacy `localStorage.opten_lang === "en"` (one-shot migration) → `navigator.language`
- `LangSwitcher` is the only writer to `opten_lang_v3`; legacy `opten_lang="ru"` is intentionally ignored (was the cause of post-Phase-3 fix `c789dee`)
- `<html lang>` is **baked at prerender time** per output file (`scripts/prerender.mjs`) — not mutated at runtime (Phase 3 D-06 — runtime DOM mutation caused hydration mismatch)
- **`hreflang` triplet** (ru, en, x-default) injected into every prerendered `<head>`; sitemap.xml also carries `xhtml:link` reciprocal annotations (Phase 3 GEO-C-2/C-3)
- `<LocalizedLink>` ([src/app/components/LocalizedLink.tsx](../../src/app/components/LocalizedLink.tsx)) is the canonical internal-navigation primitive — preserves the `/en/` prefix when on EN routes
- `EN_SIBLINGS` constant lives in [`src/i18n/paths.ts`](../../src/i18n/paths.ts) — must stay in sync with EN entries in `scripts/seo-routes.ts` for marketing, blog, models, public Learn lessons, and Learn Finds. Hidden course/template/app routes intentionally do not get EN siblings for SEO.

## Vercel-side serverless

- **Functions** use Vercel's Node.js handler signature `(req, res)`:
  - [`api/download-skill.ts`](../../api/download-skill.ts) — validates Supabase JWT + live Pro subscription and streams `api/_assets/opten.zip`.
  - [`api/kinescope-course-token.ts`](../../api/kinescope-course-token.ts) — validates website JWT, checks `course-access-summary`, signs a short-lived Kinescope `drmauthtoken`, and returns an embed URL.
  - [`api/kinescope-course-auth.ts`](../../api/kinescope-course-auth.ts) — Kinescope server-to-server playback callback; verifies the signed playback token and returns 200/403.
  - [`api/course-prompt.ts`](../../api/course-prompt.ts) — validates website JWT + course access and returns a whitelisted private course prompt body.
- Future owner/admin endpoints should live here too, using the shared
  `api/_shared/optenServerAuth.ts` JWT verifier plus a server-side owner
  allowlist. They may call extension-owned service endpoints with server-only
  secrets; the browser must receive only aggregated stats or accepted job
  results.
- `api/download-skill.ts` bundles the Pro ZIP via `vercel.json` `includeFiles: "api/_assets/**"`.
- Hidden course downloadable materials under `public/assets/space/courses/**` are static public assets; locked prompt bodies stay server-side in `api/_shared/coursePromptBodies.ts`.
- JSON CORS is locked to `https://opten.space`.

## Env vars (Vercel)

| Var | Purpose | Where used |
|-----|---------|------------|
| `VITE_PADDLE_ENV` | `'sandbox'` \| `'production'` | [`main.tsx:26`](../../src/main.tsx#L26) |
| `VITE_PADDLE_CLIENT_TOKEN` | Paddle public client token | [`main.tsx:30`](../../src/main.tsx#L30) |
| `SUPABASE_JWT_SECRET` | Server-side HS256 JWT verification for site API functions | `api/download-skill.ts`, `api/_shared/optenServerAuth.ts` |
| `KINESCOPE_AUTH_JWT_SECRET` | Server-side HS256 secret for short-lived Kinescope `drmauthtoken` playback tokens | `api/kinescope-course-token.ts`, `api/kinescope-course-auth.ts` |
| `KINESCOPE_DRM_AUTH_USERNAME` / `KINESCOPE_DRM_AUTH_PASSWORD` | Optional Basic Auth for Kinescope's callback, if enabled in Kinescope settings | `api/kinescope-course-auth.ts` |

`VITE_*` vars are bundled into the client at build time — they're public. Real
secrets are NOT in the client bundle. Supabase service-role, payment secrets,
Resend, and course Paddle price IDs live in the extension-owned Supabase Edge
Function environment; Kinescope playback/token secrets live in Vercel server
environment. Local Kinescope operational API access belongs in gitignored
`.secrets/kinescope.env`, not in Vercel `VITE_*` vars.

## Scripts

```json
{
  "build": "node scripts/generate-summaries.mjs && node scripts/generate-responsive-images.mjs && vite build && vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir && vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta && node scripts/prerender.mjs && node scripts/sitemap.mjs && node scripts/llms.mjs && node scripts/verify-faq-mainentity.mjs && node scripts/verify-fonts.mjs && node scripts/indexnow.mjs",
  "dev": "node scripts/generate-responsive-images.mjs && vite",
  "verify:space-learn": "node scripts/verify-space-learn.mjs",
  "verify:kinescope-course": "node scripts/verify-kinescope-course.mjs"
}
```

- The build chain is the SEO surface. In order:
  1. `node scripts/generate-summaries.mjs` → regenerates `src/content/models/_summaries.ts` (lightweight name+intro barrel the hub uses, so full model prose stays out of the entry chunk).
  2. `node scripts/generate-responsive-images.mjs` → emits responsive image derivatives into `public/generated/`.
  3. `vite build` → SPA bundle in `dist/`. The **browser** build aliases the model barrel to `src/content/models/index.client.ts` — a data-island-backed lazy store — so the eager 62-file model-content glob never ships in the entry chunk (entry dropped ~2.1 MB → ~449 KB raw on 2026-05-21).
  4. `vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache` → SSR React bundle for prerender (SSR keeps the full eager barrel).
  5. `vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta` → per-route metadata manifest.
  6. `node scripts/prerender.mjs` → 202 `dist/<route>/index.html` files with per-route `<head>`, JSON-LD, `<html lang>`, hreflang (also localizes the static `keywords`/`og:image:alt`/author head tags on EN routes, and injects each model page's content as a `<script type="application/json" id="opten-model">` data-island the client store reads synchronously at hydration).
  7. `node scripts/sitemap.mjs` → `dist/sitemap.xml` with per-route `<lastmod>` (git mtime). **Has a floor check that fails the build if route count drops.**
  8. `node scripts/llms.mjs` → `dist/llms.txt` + `dist/llms-full.txt`. Same floor check.
  9. `node scripts/verify-faq-mainentity.mjs` → asserts visible FAQ DOM ≡ JSON-LD `FAQPage.mainEntity`. Build-time gate.
  10. `node scripts/verify-fonts.mjs` → asserts the subset `*.woff2` are present, within size bounds, weight axis intact, and the Unbounded preload survived. Build-time gate.
  11. `node scripts/indexnow.mjs` → pings Bing IndexNow with the updated URL set. Non-fatal on network failure.
- **Out-of-build model tooling** (run manually, NOT in the `build` chain): `node scripts/sync-skills.mjs` (copies promptscore-proxy `skills/*.md` → `src/content/models/_skills/`), `node scripts/build-models-registry.mjs` (parses `_skills/*.md` → AUTO-GEN `_registry.ts`, 62 `ModelMeta`), `node scripts/verify-models-content.mjs` (model content + EN-meta-cyrillic gate — a follow-up wants this wired into the build once Vercel Node ≥22.18 is confirmed).
- Learn guards: `npm run verify:space-learn` checks public Learn/Learn Finds route/content invariants; `npm run verify:kinescope-course` checks the hidden 16-video Kinescope course, lesson extras, server whitelist, and prompt/material guards.
- Ad-hoc: `node scripts/smoke-blog.mjs` (requires `npx playwright install chromium` once) — Playwright smoke for the blog flows.
- No `test` script — no Vitest/Jest.
- No `lint` script — no ESLint config.
- No `typecheck` script — TS errors only surface during the `vite build` step.
- Build output goes to `dist/` (gitignored). Two intermediate dirs `.ssr-cache/` and `.ssr-meta/` are also gitignored.

## Deployment

- **Vercel** project linked via `.vercel/` (committed only `.vercel/project.json` if present; `.env*.local` ignored).
- Auto-deploy on push to `main`.
- Custom domain: `opten.space`.
- Per recent commit messages, the active Vercel project name is `opten-website2` (commit `e7e1767`).

## Content & SEO tooling

- **Per-route metadata**: [`scripts/seo-routes.ts`](../../scripts/seo-routes.ts) — single source of truth. Each route declares `title`, `description`, `canonical`, `ogImage`, `hreflangAlternates`, `prerender` tier, and a `schema: SchemaBlock[]` array built from typed helpers (`faqPageBlock`, `howToBlock`, `productBlock`, `articleBlock`, `webPageBlock`, `breadcrumbBlock`, `collectionPageBlock`, `itemListBlock`, `blogPostingBlock`, `softwareApplicationModelBlock`, plus reusable `ORG_BLOCK` / `WEBSITE_BLOCK` / `SOFTWARE_APP_BLOCK` / `PERSON_FOUNDER_BLOCK` consts cross-linked via `@id` references — Phase 4 D-10). Model routes are built by `buildModelRoute` / `buildModelsHubRoute`; public Learn routes are expanded from `src/content/space/learn.ts` and `src/content/space/learnFinds.ts`.
- **Blog content**: [`src/content/blog/`](../../src/content/blog/) — one file per post implementing `BlogPost = { ru, en }`. Cover images in [`public/blog/<slug>/`](../../public/blog/). See [CONTENT-AUTHORING.md](CONTENT-AUTHORING.md).
- **Model content (Phase v2.0)**: [`src/content/models/`](../../src/content/models/) — 62 `<slug>.ts` files implementing `ModelContent = { ru, en }`, an AUTO-GEN `_registry.ts` (62 `ModelMeta` parsed from RU `_skills/*.md`), and `metaEn.ts` (hand-maintained EN overrides for the free-text meta fields + `metaField` helper). `index.ts` exports `allModels` + `HUB_HIDDEN_SLUGS` (11 umbrella models hidden from the hub grid/ItemList but kept live).
- **Public Learn content**: [`src/content/space/learn.ts`](../../src/content/space/learn.ts) for Opten-authored lessons, [`src/content/space/learnFinds.generated.json`](../../src/content/space/learnFinds.generated.json) + [`learnFinds.ts`](../../src/content/space/learnFinds.ts) for curated third-party YouTube videos. See [`docs/LEARN-PUBLISHING.md`](LEARN-PUBLISHING.md).
- **Hidden course content**: [`src/content/space/privateCourse.ts`](../../src/content/space/privateCourse.ts), [`privateCourseExtras.ts`](../../src/content/space/privateCourseExtras.ts), [`api/_shared/kinescopeCourse.ts`](../../api/_shared/kinescopeCourse.ts), and [`api/_shared/coursePromptBodies.ts`](../../api/_shared/coursePromptBodies.ts). Hidden course routes are noindex and excluded from sitemap/llms until launch. Promo-code pricing is not content; it is extension-owned backend data in `course_promo_codes`.
- **Static crawler files** (rooted in `public/`, served verbatim):
  - `robots.txt` — explicit blocks for 16 user-agents (Google/Bing/Yandex + 13 AI crawlers); `Content-Signal: search=yes, ai-train=yes, ai-input=yes` (Cloudflare AI-Preferences draft).
  - `llms.txt`, `llms-full.txt` — emitted by `scripts/llms.mjs` at build time (the `public/` versions are fallback only).
  - `sitemap.xml` — emitted by `scripts/sitemap.mjs` at build time with per-route `<lastmod>` from git mtime.
- **OG cards** at `public/og-card-{ru,en}.png` (1200×630). EN routes set `ogImage: DEFAULT_OG_IMAGE_EN`; RU routes inherit `DEFAULT_OG_IMAGE` (RU card). Per-post covers (blog) override this.
- **Headers** (`vercel.json`):
  - Global: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: SAMEORIGIN`.
  - Per-path `X-Robots-Tag: noindex, nofollow` on `/account`, `/en/account`, `/login`, `/auth/*`, `/success`, `/dashboard/*`, `/prompt-library`, `/p/:slug`, `/learn/templates/*`, `/learn/courses/*`, `/en/learn/templates/*`, `/app/*`, `/space/*`, `/internal/*`, `/api/*`.

## Dependency hygiene flags

- **Heavy UI surface area:** Radix + MUI + Lucide + react-slick + embla — three overlapping ecosystems. Worth auditing before adding more.
- **Figma Make origin:** `package.json` `name` is `@figma/my-make-file` and the README references a Figma export. Some imports (`imports/LandingPage/...`) are auto-generated SVG-path dumps from Figma. Edits there are brittle.
- **No lockfile mismatch tooling.** `package-lock.json` is committed; npm-based.
