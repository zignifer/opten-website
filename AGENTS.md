## Project

**opten.space** — public website for the **Opten** Chrome extension. Vite +
React 18 + TypeScript + Tailwind 4, SPA, deployed on Vercel.

Three jobs: (1) marketing surface (landing in RU/EN), (2) billing surface
(`/pay`, `/account`, `/success` for YooKassa RUB + Paddle USD — Pro is the
only purchasable tier; free-аккаунт даёт 0 операций, нужен для логина), (3)
Pro-only utilities (`/dashboard/download-skill` — streams `opten.zip` Claude
Skill bundle sourced from the extension repo's `opten/` dir, Phase 73).

The site is **not the product** — the extension is. The site exists to sell,
service, and onboard extension users.

## CRITICAL: Read this before any change to billing/auth/routes/integration

The site is tightly coupled with the **Opten Chrome extension** at
`C:\Projects\promptscore` (private repo `zignifer/promptscore`). Coupling
points: `externally_connectable` message API, fixed URL paths (`/welcome`,
`/pay`, `/success`), Supabase Edge Functions, hardcoded constants
(`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`).

**Before editing anything that touches those areas, read [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md).** It is the binding interface. Renames or removals on either side are breaking changes.

Locked routes (referenced by already-shipped extension binaries — do not rename):
- `/welcome` — extension navigates here on first install
- `/pay` — extension opens this from popup upgrade CTA
- `/success` — YooKassa `return_url`

Hardcoded constants that are duplicated and must be kept in sync:
- `EXTENSION_IDS` — appears in [src/app/pages/PayPage.tsx](src/app/pages/PayPage.tsx), [src/app/pages/AccountPage.tsx](src/app/pages/AccountPage.tsx), [src/app/pages/DownloadSkillPage.tsx](src/app/pages/DownloadSkillPage.tsx)
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` — appears in those three files plus [api/download-skill.ts](api/download-skill.ts) plus the extension's `config/api.js`

## Tech stack

- **Vite 6** + **React 18.3** + **React Router 7** + **TypeScript** + **Tailwind 4**
- **UI:** Radix UI primitives + MUI 7 icons + Lucide + `motion` for animation
- **Forms:** `react-hook-form`
- **Payments:** Paddle.js v2 (synchronous CDN script in `index.html`)
- **Backend:** plain `fetch` to Supabase REST + Functions (no `@supabase/supabase-js`)
- **Deploy:** Vercel, one serverless function at `api/download-skill.ts`
- **i18n:** Custom React context, RU/EN; URL prefix wins (`/en/*`), then `localStorage.opten_lang_v3` (explicit user choice, written by LangSwitcher), then `navigator.language`. Legacy key `opten_lang` is read **only** when its value is `"en"` for one-shot migration; RU values from the old key are intentionally ignored. Internal navigation uses `<LocalizedLink>` (drop-in `<Link>` replacement) — on `/en/*` URLs it rewrites internal hrefs to `/en/<sibling>` for the EN-prefixed routes — 9 static + 62 model slugs (see `EN_SIBLINGS` in `src/i18n/paths.ts`, built from `src/content/models/slugs.ts`).

No tests, no ESLint config, no `typecheck` script. TS errors surface during
`vite build` (`npm run build`).

See [docs/TECH.md](docs/TECH.md) for full picture.

## Related repositories

| Repo | Path | Role |
|------|------|------|
| opten-website (this) | `C:\Projects\opten-website` | Public site |
| promptscore (private) | `C:\Projects\promptscore` | Chrome extension (Opten v1.3.8, MV3, post-v2.8 milestone shipped 2026-05-28) + Supabase Edge Functions + migrations + Paddle/YooKassa webhooks. Extension works on 4 platforms: syntx.ai, higgsfield.ai, freepik.com, magnific.com. Extension's Supabase moved cloud → self-hosted (`https://supabase.opten.space`) on 2026-05-25 (Phase 88 cutover); the cloud URL was removed from `host_permissions` in v1.3.7. Popup has **4 tabs** (ИИ-агрегаторы / Скилл / ChatGPT / Улучшить); the ChatGPT tab is a Pro-only «Открыть» CTA that opens a public OpenAI GPT — Pro-gating is UX-only by design. |
| opten-proxy (private) | `C:\Projects\promptscore-proxy` | Vercel proxy for the extension's AI requests + 63 model-specific skill files in `skills/*.md`. Not used by the site directly, but the same skill files are bundled into the Pro-only `opten.zip` Claude Skill served via this repo's `/api/download-skill` |

The extension repo owns the Supabase project — all Edge Functions and
migrations are deployed from there, not from this repo.

## Architecture

```
index.html  ─sync→  Paddle.js CDN  (only in dist/pay/, dist/en/pay/ — Phase 2.2 + 3 D-03b)
     │
     └→ main.tsx → <BrowserRouter> → <LangProvider> → <Routes>
            ↓
        ~22 client route patterns + catch-all 404 → 144 prerendered routes:
          Marketing/billing RU (9): /, /pay, /welcome, /about, /blog, /blog/:slug,
                  /privacy, /terms, /refund
          Models RU (Phase v2.0): /models hub + /models/:slug (62 model pages)
          RU SPA-only (3, X-Robots-Tag noindex): /success, /account,
                                                  /dashboard/download-skill
          EN: /en/ sibling for each prerendered RU route + /en/models(/:slug)
          Catch-all: <Route path="*"> → NotFound (runtime noindex injection)

  Prerender (postbuild):  scripts/prerender.mjs → 144 dist/<route>/index.html files
                          (18 baseline + 2 model hubs + 124 model pages — 62 RU + 62 EN —
                          with hreflang triplets + baked <html lang>)
                          + sitemap.xml (144 URL) + llms.txt + IndexNow ping
                          + FaqBlock ↔ FAQPage parity assertion
  Site ↔ Extension:       chrome.runtime.sendMessage (externally_connectable, opten.space only)
  Site → Supabase:        fetch to /functions/v1/* and /rest/v1/* — base URL is
                          https://supabase.opten.space (self-hosted, Phase 88 cutover 2026-05-25;
                          cloud vuywydhwkqmihfztpkgl.supabase.co is a frozen cold backup)
  Site → Paddle:          window.Paddle.Checkout.open(...)
  Site own API:           GET /api/download-skill (Vercel serverless, JWT + Pro-gated)

  Legacy 301 redirects:   /guides/* → /blog/*, /en/guides/* → /en/blog/*
                          (Phase 5 B-07; the /guides/* URL space is retired)
```

**Locked routes never get `/en/*` siblings by design** (Phase 3 D-03): `/success` is YooKassa-RUB only, `/account` and `/dashboard/*` are extension-coupled SPA-only routes (Disallow'd in robots.txt). On those routes the LangSwitcher flips language *in place* (storage + state) instead of navigating.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for routes, billing flows, and i18n details.

## Conventions

### File structure

```
api/                     — Vercel serverless functions (currently only download-skill.ts)
public/                  — static assets (favicons, partner logos, welcome screenshots,
                           OG cards, founder image, blog/<slug>/cover.jpg)
scripts/                 — build pipeline:
                             entry-server.tsx     — SSR React tree
                             seo-routes.ts        — per-route metadata + schema graph
                             prerender.mjs        — emits per-route dist HTML
                             sitemap.mjs          — emits sitemap.xml w/ git-mtime lastmod
                             llms.mjs             — emits llms.txt + llms-full.txt
                             verify-faq-mainentity.mjs — FAQ ↔ FAQPage build-time gate
                             indexnow.mjs         — Bing IndexNow ping
                             smoke-blog.mjs       — ad-hoc Playwright smoke for /blog
                             sync-skills.mjs      — copies promptscore-proxy skills/*.md → src/content/models/_skills/
                             build-models-registry.mjs — parses _skills/*.md → _registry.ts (62 ModelMeta; AUTO-GEN)
                             verify-models-content.mjs — model content + EN-meta-cyrillic gate (run manually, not in build)
src/
├── main.tsx             — entry, ~22 route patterns (incl. /models hub + /models/:slug, RU+EN) + catch-all, hydrate-vs-mount discriminator
├── app/
│   ├── App.tsx          — landing
│   ├── components/      — shared UI:
│   │     SiteHeader, SiteFooter — unified hamburger header + shared footer
│   │     LocalizedLink, LangSwitcher — i18n-aware nav
│   │     FaqBlock — semantic <dl>; source-of-truth for FAQPage schema
│   │     BlogPostCard, Picture, InstallButton, OptenHeroAnimation, RouteLoading
│   │     layout/, figma/, ui/ — wrappers, fallbacks, Radix-derived primitives
│   └── pages/           — one file per route (incl. BlogListPage, BlogPostPage, AboutPage,
│                          ModelsHubPage, ModelPage, NotFound)
├── content/             — humans edit here, consumed by pages + SEO manifest:
│   ├── about.tsx        — AboutPage body data
│   ├── landingFaq.ts    — landing FAQ; mirrored 1:1 into FAQPage schema
│   ├── blog/            — one TS file per post, BlogPost = { ru, en }
│   └── models/          — Phase v2.0 programmatic SEO. 62 <slug>.ts content files
│                          (ModelContent = { ru, en }) + _registry.ts (AUTO-GEN, 62
│                          ModelMeta; do not hand-edit without also fixing _skills) +
│                          _skills/*.md (RU source) + metaEn.ts (EN overrides for free-text
│                          meta name/platform/duration/resolution + metaField helper) +
│                          index.ts (allModels barrel + HUB_HIDDEN_SLUGS) + slugs.ts
│                          (light import for paths.ts) + types.ts
├── i18n/                — LangContext + ru.json/en.json + paths.ts (EN_SIBLINGS)
├── imports/             — Figma-Make-generated SVG paths (auto-generated; brittle)
├── lib/                 — paddle.ts (ensurePaddle lazy loader, Phase 2.2)
├── styles/              — index.css, tailwind.css, theme.css, fonts.css
└── types/               — TS type defs
```

`src/i18n/paths.ts` is the single source of truth for `EN_SIBLINGS` (9 static routes + every `/models/<slug>`, derived from `src/content/models/slugs.ts`). It MUST stay in sync with the EN entries in `scripts/seo-routes.ts` — easy to miss when adding a route.

**Adding a new page or blog post touches 6 files in sync** (route, manifest, EN siblings, sitemap, llms.txt, dicts) plus optional content/blog files. The full checklist + GEO/SEO patterns are in [docs/CONTENT-AUTHORING.md](docs/CONTENT-AUTHORING.md) — read that before touching content.

**Model pages (Phase v2.0) follow a different flow:** they are generated, not hand-listed. Source = `src/content/models/_skills/*.md` (synced from promptscore-proxy via `sync-skills.mjs`) → `build-models-registry.mjs` emits `_registry.ts` (62 `ModelMeta`) → one `<slug>.ts` content file per model (`ModelContent = { ru, en }`). `seo-routes.ts` expands all models with content into routes; `slugs.ts` drives `EN_SIBLINGS`. Free-text meta (name/platform/duration/resolution) is RU-only in the registry → English comes from hand-maintained `metaEn.ts` overrides via the `metaField(meta, field, lang)` helper (the build has no gate for this; run `node scripts/verify-models-content.mjs` to catch Cyrillic leaking into EN). `HUB_HIDDEN_SLUGS` (in `index.ts`) hides 11 general/umbrella models from the `/models` grid + ItemList schema while keeping their pages live.

### Code style

- TypeScript everywhere, `.tsx` for components
- Tailwind utility classes preferred over custom CSS
- Path alias `@` → `./src` available but most imports are relative
- No formatter configured (no Prettier, no ESLint)
- React Router 7 syntax (`import { Link } from "react-router"`, not `react-router-dom`)
- For internal navigation prefer `<LocalizedLink>` over bare `<Link>` — it preserves the `/en/` URL prefix when the user is on an EN route. Bare `<Link>` is still allowed but drops the prefix (was the source of a post-Phase-3 bug)

### State & storage

- React Context for i18n only
- `localStorage` for: `opten_lang_v3` (i18n, written by LangSwitcher only), `opten_pay_currency`. Legacy `opten_lang` is read-only for one-shot EN migration — do not write to it.
- All auth and subscription state lives in the **extension's** `chrome.storage.local` (`ps_*` keys) — site reads via `chrome.runtime.sendMessage(...)` only

### Naming

- **Components:** PascalCase, one per file
- **Constants:** UPPER_SNAKE_CASE for module-level (`SUPABASE_URL`, `EXTENSION_IDS`, `CHROME_STORE_URL`)
- **i18n keys:** dot.namespaced in dicts (see `ru.json`/`en.json`)
- **localStorage keys:** `opten_` prefix
- **Extension storage keys** (read indirectly): `ps_*` prefix (extension-owned — see INTEGRATION-CONTRACT §5)

### CSS

- Tailwind 4 via `@tailwindcss/vite` plugin
- Theme tokens in [src/styles/theme.css](src/styles/theme.css)
- Custom fonts loaded in [src/styles/fonts.css](src/styles/fonts.css)

### Comments

- Phase references: `// Phase 66:`, `// Phase 73:` — match the extension repo's phase numbering when changes span both repos
- Design decisions: `// D-04:`, bugs: `// BG-67-01:` — same convention as the extension

## Workflow

This project uses **GSD (Get Shit Done)** for planning. Live state in
`.planning/`:

- `.planning/PROJECT.md` — project context, locked decisions (mirrors INTEGRATION-CONTRACT.md)
- `.planning/ROADMAP.md` — milestone → phases breakdown
- `.planning/REQUIREMENTS.md` — falsifiable requirements per milestone
- `.planning/STATE.md` — current phase / progress / blockers
- `.planning/phases/XX-name/` — per-phase artifacts: `N-SPEC.md`, `N-PLAN.md`, `N-CONTEXT.md`
- `.planning/intel/` — consolidated context from ingested docs (read-only after bootstrap)
- `.planning/research/` — audit reports and exploratory analyses (e.g. `GEO-AUDIT.md`)

For non-trivial work use the GSD slash commands (`/gsd-plan-phase`,
`/gsd-execute-phase`, `/gsd-verify-work`, etc.) — they keep state in
`.planning/` in sync and respect locked decisions.

For ad-hoc edits this section is non-binding — just keep changes scoped and
respect the integration contract above.

The Obsidian vault root is the repo root, so every `.md` here also appears
in the vault graph. Prefer `[[wikilinks]]` over relative markdown links
inside `.planning/` so backlinks/graph view stay populated. See `_index.md`
for the navigation hub.

## Deploy & build

- **Local dev:** `npm run dev` (Vite, port 5173)
- **Build:** `npm run build` (Vite → `dist/`)
- **Deploy:** auto on push to `main` via Vercel. Vercel project name per recent commits: `opten-website2`.
- **Custom domain:** opten.space (HTTPS).

**No release versioning.** Unlike the extension, the site has no `version` in
`package.json` semver workflow — every push to `main` is a release. There is
no Chrome Web Store gating. Hotfix iteration speed is high; coordinate breaking
changes with the extension manually.

## Env vars

Set in Vercel (project settings, not in repo):
- `VITE_PADDLE_ENV` — `'sandbox'` | `'production'`
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token

`VITE_*` vars are public — bundled into the client at build. Real secrets
(Supabase service role, Paddle private API key, YooKassa secrets) live in
the **extension repo's** Supabase Edge Function secrets.

## Content & SEO — read before adding pages, posts, or images

The site shipped v1.0 (GEO Optimization, 12 → ~72.6 score, 7 phases) and v2.0
(Programmatic SEO — 62 model pages × RU/EN + 2 hubs = 144 prerendered routes,
shipped 2026-05-20) with a JSON-LD entity graph enforced by build-time gates.
**Adding a marketing/blog page is a coordinated 6-file change** (model pages
follow the generated flow above), not a one-shot file write.

Non-negotiables (the full set lives in `docs/CONTENT-AUTHORING.md`):

1. RU + EN ship together. No half-translated posts.
2. First 40-60 words = definitional answer block (`<h1>` + `.blog-intro`). AI Overviews extract this verbatim.
3. JSON-LD must mirror the visible DOM — FAQs, dates, prices, person names. `verify-faq-mainentity.mjs` enforces FAQ parity at build time; the others are auditor-detectable.
4. Cover images: `public/blog/<slug>/cover.jpg`, ≥1600×900, no in-image text (one asset works for RU + EN + OG + visible `<img>`).
5. Every `<img>` gets explicit `width`/`height` (CLS guard).
6. `<html lang>` is baked at prerender, NEVER mutated at runtime (Phase 3 D-06).
7. Locale-neutral slugs — `/blog/foo` is the same slug in RU and EN.
8. `npm run build` must pass locally — the sitemap + llms floor checks fail loudly when routes are forgotten.

**The full playbook with route-registration checklist, schema graph rules, image conventions, and a list of optimizations that have already been tried and rejected: [docs/CONTENT-AUTHORING.md](docs/CONTENT-AUTHORING.md).** Open this file alongside `seo-routes.ts` whenever adding a new page.

## Project docs

Reference documentation lives in `docs/`:

- [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md) — **binding interface with the extension**
- [docs/CONTENT-AUTHORING.md](docs/CONTENT-AUTHORING.md) — **GEO+SEO playbook for new pages, blog posts, images** (read before any content change)
- [docs/TECH.md](docs/TECH.md) — stack snapshot
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — routes, flows, state
- [docs/SEO-AUDIT.md](docs/SEO-AUDIT.md) — SEO baseline + gap analysis (v1.0 input artifact)

Active planning state lives in `.planning/` (managed by GSD slash commands).
See `_index.md` for the Obsidian-friendly navigation hub.
