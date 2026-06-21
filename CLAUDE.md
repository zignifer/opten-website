## Agent Context Ownership

`AGENTS.md` is the source of truth for all AI agent project context in this
repo. Update this file first.

`CLAUDE.md` is a compatibility mirror for Claude Code. After changing
`AGENTS.md`, run `npm run sync:agents` so Claude gets the same project
instructions and does not drift.

Do not recreate the old Codex adapter layout (`.codex/config.toml`,
`.codex/agents/`, `.agents/skills/`) unless explicitly requested. Project
knowledge belongs here, with detailed specs in `docs/` and `.planning/`.

## Project

**opten.space** — public website for the **Opten** Chrome extension. Vite +
React 18 + TypeScript + Tailwind 4, SPA, deployed on Vercel.

Six jobs: (1) marketing surface (landing in RU/EN), (2) website-first auth and
billing surface (`/login`, `/auth/callback`, `/pay`, `/account`, `/success` for
YooKassa RUB + Paddle USD — Pro is the only purchasable tier for AI-operations;
free-аккаунт даёт 0 операций, нужен для логина), (3)
Pro-only utilities (`/dashboard/download-skill` — streams `opten.zip` Claude
Skill bundle sourced from the extension repo's `opten/` dir, Phase 73), (4)
free Prompt Library at `/prompt-library` for any logged-in extension account
(the page still requires the Chrome extension to supply `GET_AUTH_TOKEN`;
Prompt Library has no AI/proxy/usage cost), (5) public read-only Prompt Library
snapshots at `/p/:slug` (random-link, noindex MVP; viewers save individual
prompts into their own private library through website auth), (6) public Learn
pages at `/learn`
and `/en/learn` (indexed RU/EN video lessons with schema, sitemap, llms.txt, and
legacy redirects from `/app/learn*`), plus Learn Finds at
`/learn/finds/:slug` and `/en/learn/finds/:slug` for curated third-party
YouTube expert videos enriched with Opten summaries, timestamps, commands,
prompts, resources, and risks, alongside the Opten Space Beta app shell
at `/app/*` (SPA-only, noindex) whose
account/credits state is read from the same self-hosted Supabase backend as the
extension, plus a hidden/noindex Kinescope-backed course MVP under
`/learn/courses/*` for direct-link testing of standalone paid Kinescope video
lessons before the course is linked from public navigation.

The extension is still the primary shipped product. Opten Space Beta is an
account-based web app surface, but it must share identity, subscription, and
credits with the extension through `auth.users.id` and extension-owned
Supabase Edge Functions.

Website auth is now canonical for site surfaces: `/login` stores a normal
Supabase website session in `localStorage.opten_space_session_v1`; `/pay` and
`/account` prefer that website JWT and fall back to the extension's
`GET_AUTH_TOKEN` only for compatibility. The visible login method on the site
and in the extension popup is Email OTP/manual email entry only. Google OAuth
helpers and the extension PKCE `SIGN_IN` path are retained as hidden
architecture, but their buttons must stay hidden unless the product explicitly
re-enables them. Website and extension sessions are independent local sessions.
Logging out from `/account` clears only the website session; it must not clear
extension `ps_*` storage. If the website is signed in as account A and the
extension as account B, subscription/credits are resolved by `auth.users.id`,
so account B correctly remains Free until the user signs into the extension as
account A.

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

Canonical website-auth routes:
- `/login` — shared website login for marketing, billing, account, and `/app/*`
- `/auth/callback` — shared Supabase Auth callback; supports safe `next=...`
- `/app/login` and `/app/auth/callback` remain compatibility routes/redirects.

Opten Space Beta app routes are **not extension-locked** yet, but `/app/*` is
the canonical app namespace for authenticated app surfaces going forward.
Learn is now a public SEO section at `/learn`; `/app/learn*` and `/space/learn*`
must remain temporary redirects/backward compatibility, not canonical links.
Learn Finds are public Learn content too. They embed the original YouTube video
and must not mirror, re-upload, or claim ownership of third-party videos. Use
the source YouTube thumbnail URL for cards unless a reviewed local asset is
added later. The page removes the Opten author/course card and labels the source
as another author/source instead.

Hidden Kinescope course routes live under `/learn/courses/:courseSlug` and
`/learn/courses/:courseSlug/:lessonSlug`. They are SPA-only, noindex, and must
not be added to the public Learn hub, sitemap, llms.txt, or EN sibling map until
the course is intentionally launched. The hidden course
`ai-content-marketing-2026` is a standalone one-time course purchase, not a Pro
entitlement. RUB checkout uses YooKassa; USD checkout uses Paddle with
course-specific one-time price IDs returned by
`/functions/v1/create-course-payment`. Promo preview uses the same endpoint with
optional `quote_only: true`; this validates the uppercase promo code and returns
the effective amount without creating `course_orders` or provider payments.
Guest checkout is initiated with an email address, selected currency, and optional uppercase promo code. Provider
webhooks grant a course entitlement and send a direct website auth link to the
same email. The internal test promo `FREE` maps to `100 ₽` or `$1` and requires
a separate Paddle `$1` price ID. Marketing/partner course promo codes live in
the extension-owned `course_promo_codes` table (RLS on, no public policies) and
must use uppercase `A-Z0-9` so the same code can be applied to YooKassa/RUB
server pricing and Paddle/USD `discountCode`. Kinescope video playback is server-gated: the client calls
`/api/kinescope-course-token` with the website Supabase JWT, the server verifies
course access through `/functions/v1/course-access-summary` and returns a
short-lived Kinescope embed URL with `drmauthtoken`, and Kinescope calls
`/api/kinescope-course-auth` during playback to receive 200/403. Never put the
Kinescope API key, auth JWT secret, Supabase service-role key, YooKassa secret,
Resend key, or raw playback token in the client bundle.

Hardcoded constants that are duplicated and must be kept in sync:
- `EXTENSION_IDS` — appears in [src/app/pages/PayPage.tsx](src/app/pages/PayPage.tsx), [src/app/pages/AccountPage.tsx](src/app/pages/AccountPage.tsx), [src/app/pages/DownloadSkillPage.tsx](src/app/pages/DownloadSkillPage.tsx), [src/app/pages/PromptLibraryPage.tsx](src/app/pages/PromptLibraryPage.tsx)
- `SUPABASE_URL`, `SUPABASE_REST_URL`, and `SUPABASE_ANON_KEY` — appears in [src/lib/optenAuth.ts](src/lib/optenAuth.ts), [src/lib/promptLibraryApi.ts](src/lib/promptLibraryApi.ts), [src/app/pages/PayPage.tsx](src/app/pages/PayPage.tsx), [src/app/pages/AccountPage.tsx](src/app/pages/AccountPage.tsx), [api/download-skill.ts](api/download-skill.ts), plus the extension's `config/api.js`

## Tech stack

- **Vite 6** + **React 18.3** + **React Router 7** + **TypeScript** + **Tailwind 4**
- **UI:** Radix UI primitives + MUI 7 icons + Lucide + `motion` for animation
- **Forms:** `react-hook-form`
- **Payments:** Paddle.js v2 (synchronous CDN script in `index.html`)
- **Backend:** plain `fetch` to Supabase REST + Functions (no `@supabase/supabase-js`)
- **Deploy:** Vercel, serverless functions in `api/` (`download-skill.ts` plus
  Kinescope course playback token/auth endpoints)
- **i18n:** Custom React context, RU/EN; URL prefix wins (`/en/*`), then `localStorage.opten_lang_v3` (explicit user choice, written by LangSwitcher), then `navigator.language`. Legacy key `opten_lang` is read **only** when its value is `"en"` for one-shot migration; RU values from the old key are intentionally ignored (they often came from auto-write, not explicit choice). Internal navigation uses `<LocalizedLink>` (drop-in `<Link>` replacement) — on `/en/*` URLs it rewrites internal hrefs to `/en/<sibling>` for EN-prefixed routes, including static/blog routes, 62 model slugs from `src/content/models/slugs.ts`, and Learn lesson slugs from `src/content/space/learnSlugs.ts`.

No tests, no ESLint config, no `typecheck` script. TS errors surface during
`vite build` (`npm run build`).

See [docs/TECH.md](docs/TECH.md) for full picture.

## Related repositories

| Repo | Path | Role |
|------|------|------|
| opten-website (this) | `C:\Projects\opten-website` | Public site |
| promptscore (private) | `C:\Projects\promptscore` | Chrome extension (Opten v1.4.1, MV3, post-v2.8 milestone shipped 2026-05-28) + Supabase Edge Functions + migrations + Paddle/YooKassa webhooks. Extension works on 4 platforms: syntx.ai, higgsfield.ai, freepik.com, magnific.com. Extension's Supabase moved cloud → self-hosted (`https://supabase.opten.space`) on 2026-05-25 (Phase 88 cutover); the cloud URL was removed from `host_permissions` in v1.3.7. Popup has **4 tabs** (ИИ-агрегаторы / Скилл / ChatGPT / Улучшить); the ChatGPT tab is a Pro-only «Открыть» CTA that opens a public OpenAI GPT — Pro-gating is UX-only by design. |
| opten-proxy (private) | `C:\Projects\promptscore-proxy` | Vercel proxy for the extension's AI requests + 63 model-specific skill files in `skills/*.md` (61 model + 2 fallback). Not used by the site directly, but the same skill files are bundled into the Pro-only `opten.zip` Claude Skill served via this repo's `/api/download-skill` |

The extension repo owns the Supabase project — all Edge Functions and
migrations are deployed from there, not from this repo.

## Architecture

```
index.html  ─sync→  Paddle.js CDN  (only in dist/pay/, dist/en/pay/ — Phase 2.2 + 3 D-03b)
     │
     └→ main.tsx → <BrowserRouter> → <LangProvider> → <Routes>
            ↓
        ~33 client route patterns + catch-all 404 → 182 prerendered routes:
          Marketing/billing RU (9): /, /pay, /welcome, /about, /blog, /blog/:slug,
                  /privacy, /terms, /refund
          Models RU (Phase v2.0): /models hub + /models/:slug (62 model pages)
          Learn RU: /learn hub + /learn/:lessonSlug (public video lessons)
          RU SPA-only (7, X-Robots-Tag noindex): /success, /login,
                                                  /auth/callback, /account,
                                                  /dashboard/download-skill,
                                                  /prompt-library, /p/:slug
          App SPA-only (X-Robots-Tag noindex): /app, /app/login,
                  /app/auth/callback; /app/learn* redirects to /learn*
          EN: /en/ sibling for each prerendered RU route + /en/models(/:slug) + /en/learn(/:slug)
          Catch-all: <Route path="*"> → NotFound (runtime noindex injection)

  Prerender (postbuild):  scripts/prerender.mjs → 182 dist/<route>/index.html files
                          (42 baseline/blog + 14 Learn + 2 model hubs + 124 model pages —
                          with hreflang triplets + baked <html lang>)
                          + sitemap.xml (182 URL) + llms.txt + IndexNow ping
                          + FaqBlock ↔ FAQPage parity assertion
  Site ↔ Extension:       chrome.runtime.sendMessage (externally_connectable, opten.space only)
  Site → Supabase:        fetch to /functions/v1/* and /rest/v1/* — base URL is
                          https://supabase.opten.space (self-hosted, Phase 88 cutover 2026-05-25;
                          cloud vuywydhwkqmihfztpkgl.supabase.co is a frozen cold backup)
                          `/login`, `/auth/callback`, and `/app/*` use public
                          Supabase Auth endpoints directly for website login;
                          visible login UI exposes Email OTP only while Google
                          OAuth code remains hidden/disabled for now;
                          `/pay` and `/account` prefer the website JWT, then
                          fall back to the extension JWT. Account/credit state
                          comes from `/functions/v1/account-summary`;
                          `/account` may call `/cancel-subscription*` directly
                          with a website JWT. Service-role secrets stay in
                          extension-owned Edge Functions only.
                          Prompt Library public snapshots use PostgREST RPCs:
                          owner publish/refresh/unpublish uses the extension
                          JWT on `/prompt-library`; public `/p/:slug` reads an
                          active snapshot without auth; per-prompt save uses
                          the website JWT and inserts a private copy under
                          the viewer's `auth.users.id`.
                          Auth email for OTP login is sent by
                          self-hosted Supabase Auth through Resend SMTP and
                          uses the public GoTrue template at
                          /auth-templates/magic-link.html. The code is the
                          only rendered email sign-in path; no magic-link CTA
                          is shown in the email.
  Site → Paddle:          window.Paddle.Checkout.open(...)
  Site own API:           GET /api/download-skill (Vercel serverless, JWT + Pro-gated)
                          POST /api/kinescope-course-token — website JWT + course entitlement gate;
                          returns short-lived Kinescope embed URL with drmauthtoken
                          POST /api/kinescope-course-auth — Kinescope server callback;
                          validates signed drmauthtoken and returns 200/403

  Legacy 301 redirects:   /guides/* → /blog/*, /en/guides/* → /en/blog/*
                          (Phase 5 B-07; the /guides/* URL space is retired)
```

**Locked/auth/noindex routes never get `/en/*` siblings by design** (Phase 3 D-03): `/success` is YooKassa-RUB only; `/login`, `/auth/*`, `/account`, `/dashboard/*`, `/prompt-library`, `/p/*`, `/learn/courses/*`, and `/app/*` are authenticated, app, hidden-course, or random-link snapshot surfaces (Disallow'd/noindex) rather than content/SEO pages. Public Learn is the exception to the old app Learn prototype: canonical Learn routes are `/learn` and `/en/learn`, while `/app/learn*` redirects. On locked/auth routes the LangSwitcher or app-local language switch flips language *in place* (storage + state) instead of navigating.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for routes, billing flows, and i18n details.

## Conventions

### File structure

```
api/                     — Vercel serverless functions:
                             download-skill.ts — Pro-gated Claude Skill ZIP
                             kinescope-course-token.ts — course-entitlement-gated playback token issuer
                             kinescope-course-auth.ts — Kinescope playback auth callback
                             _shared/ — server-only course/auth constants
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
├── main.tsx             — entry, route patterns (incl. /models hub + /models/:slug, /learn, /prompt-library, /p/:slug, RU+EN siblings) + catch-all, hydrate-vs-mount discriminator
├── app/
│   ├── App.tsx          — landing
│   ├── components/      — shared UI:
│   │     SiteHeader, SiteFooter — compact account/header shell + shared footer
│   │     LocalizedLink, LangSwitcher — i18n-aware nav
│   │     FaqBlock — semantic <dl>; source-of-truth for FAQPage schema
│   │     BlogPostCard, Picture, InstallButton, OptenHeroAnimation, RouteLoading
│   │     layout/, figma/, ui/ — wrappers, fallbacks, Radix-derived primitives
│   └── pages/           — one file per route (incl. BlogListPage, BlogPostPage, AboutPage,
│                          ModelsHubPage, ModelPage, PromptLibraryPage,
│                          PublicPromptLibraryPage, NotFound)
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
├── lib/                 — paddle.ts (ensurePaddle lazy loader, Phase 2.2),
│                          optenAuth.ts (website Supabase session),
│                          promptLibraryApi.ts (Prompt Library PostgREST/RPC helpers)
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
- Extension-coupled auth and subscription state lives in the **extension's** `chrome.storage.local` (`ps_*` keys) — legacy site surfaces read via `chrome.runtime.sendMessage(...)`.
- `/login`, `/pay`, `/account`, and Opten Space `/app/*` share the website Supabase session in `localStorage.opten_space_session_v1` and refresh it through public GoTrue endpoints. Visible auth uses Email OTP/manual email entry only; Google OAuth helpers may remain in code but must not render a login button unless explicitly re-enabled. Credits/subscription state still comes from the shared backend by calling `/functions/v1/account-summary` with the user's Bearer JWT. `/pay` and `/account` use extension messages only as fallback compatibility. Do not put service-role keys, JWT secrets, payment secrets, or proxy API keys in the website bundle.
- `/account` website logout clears only `localStorage.opten_space_session_v1` and calls public Supabase logout for that website JWT. It must not send extension logout messages or mutate extension-owned `ps_*` keys.
- `/prompt-library` private CRUD still uses the extension-provided JWT and owner-scoped `prompt_library` RLS. Public `/p/:slug` snapshot viewing is anonymous read-only through `prompt_library_get_public_snapshot`; saving a public prompt uses the website Supabase session and creates an independent private `prompt_library` copy for the viewer. Never weaken private `prompt_library` RLS to make public links work.
- Opten Space email auth renders only an OTP code in the email. The same OTP flow is used by the website and the extension popup: send through `/auth/v1/otp`, verify through `/auth/v1/verify`, then persist a normal Supabase session for the same `auth.users.id`. GoTrue may still generate an internal confirmation URL, but the public template does not show it; a normal email magic link would open the website callback and would not automatically log the Chrome extension in unless a separate extension handoff/bridge is built.

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

### Browser verification

For local UI verification, use the Codex in-app Browser first (`iab`) for
opening, inspecting, clicking, typing, screenshotting, and checking localhost
routes. Do not default to the standalone Playwright CLI for site checks.

Use Playwright CLI only as a fallback when the in-app Browser tool is not
available in the current session, and say that explicitly in the final note.
Project scripts that already use Playwright, such as `scripts/smoke-blog.mjs`,
can remain Playwright-based unless they are being rewritten.

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
- Course Paddle one-time price IDs are server-only in the extension-owned
  Supabase Edge Function environment:
  `PADDLE_PRICE_ID_COURSE_AI_CONTENT_MARKETING_2026_{SANDBOX|PRODUCTION}` and
  `PADDLE_PRICE_ID_COURSE_AI_CONTENT_MARKETING_2026_FREE_{SANDBOX|PRODUCTION}`.
  Current live production price IDs: `$41` =
  `pri_01kvk9vzec7cwgq7zgs9azw2re`, `$1` FREE test =
  `pri_01kvk9x5mcnadfj0beymk23ze5`.
- `KINESCOPE_AUTH_JWT_SECRET` — server-only HS256 secret used to sign and
  verify short-lived Kinescope `drmauthtoken` playback tokens for hidden course
  lessons. Must be long random text and must match both Kinescope course API
  endpoints.
- `KINESCOPE_DRM_AUTH_USERNAME` / `KINESCOPE_DRM_AUTH_PASSWORD` — optional
  Basic Auth credentials for Kinescope's server-to-server callback to
  `/api/kinescope-course-auth`, if configured in the Kinescope dashboard/API.

`VITE_*` vars are public — bundled into the client at build. Real secrets
(Supabase service role, Paddle private API key, YooKassa secrets, Kinescope API
key, Kinescope auth JWT secret) live only in server environments. The Kinescope
API key used for upload/catalog admin is an operational secret, not a website
bundle variable; keep local copies in ignored files only.

Self-hosted Supabase Auth SMTP is configured on the VPS, not in Vercel. The
live OTP email template is a public static file in this repo:
`public/auth-templates/magic-link.html`. GoTrue references it with
the `GOTRUE_MAILER_TEMPLATES_*` auth-template env vars for magic link,
confirmation, and recovery email branches, but the template renders only
`{{ .Token }}` and does not render `{{ .ConfirmationURL }}`. The auth email is
English-only by product decision; keep both the HTML copy and the
`GOTRUE_MAILER_SUBJECTS_*` subject env vars on the VPS in English. Do not put
Resend API keys or SMTP passwords in this repo.

### Google Search Console local access

Agents can access the Opten Search Console property through the existing
OAuth installed-app flow. Service Account access was tried and rejected by the
GSC UI (`email not found` when adding the service account as a user), so use
OAuth with the owner Google account instead.

Local credentials live only in `.secrets/gsc-oauth.env` (gitignored) with:

- `GSC_CLIENT_ID`
- `GSC_CLIENT_SECRET`
- `GSC_REFRESH_TOKEN`
- `GSC_SITE_URL=sc-domain:opten.space`

The same credentials are mirrored from `C:\Projects\opten-seo\.env.local`.
Use `node scripts/gsc.mjs sites`, `node scripts/gsc.mjs sitemaps`,
`node scripts/gsc.mjs submit-sitemap`, and
`node scripts/gsc.mjs inspect https://opten.space/models` for direct GSC API
checks. If Google returns `invalid_grant`, refresh the OAuth token in the same
installed-app flow and update `.secrets/gsc-oauth.env`.

### Yandex Webmaster local access

Yandex Webmaster API access uses a direct OAuth token, not the Yandex Cloud
Wordstat API key. The legacy Wordstat OAuth token in `C:\Projects\opten-seo`
does not work for Webmaster (`ACCESS_FORBIDDEN`, missing scopes).

Local credentials belong in `.secrets/yandex-webmaster.env` (gitignored):

- `YANDEX_WEBMASTER_OAUTH_TOKEN`
- `YANDEX_WEBMASTER_HOST_URL=https://opten.space/`

Create the token from a Yandex OAuth app with Yandex Webmaster permissions
(`webmaster:hostinfo` and `webmaster:verify` in the official setup flow).
Tokens are short-lived operational secrets; if Yandex returns `401` or
`ACCESS_FORBIDDEN`, issue a fresh token and update the local `.secrets` file.
Use `node scripts/yandex-webmaster.mjs user`, `hosts`, `summary`, `sitemaps`,
`queries`, and `recrawl <url>` for checks.

Current local status (2026-06-01): access is configured and verified. The API
sees `https://opten.space/` as `verified: true`; summary returned `sqi: 10`,
`searchable_pages_count: 146`, `excluded_pages_count: 4`; sitemap
`https://opten.space/sitemap.xml` had `errors_count: 0`, `urls_count: 160`;
popular search queries returned 41 rows for 2026-05-24..2026-05-30. Use this
API directly for Yandex indexing/search visibility checks before guessing from
public search results.

### Opten Space Learn video timestamp tooling

Learn course/lesson pages embed public YouTube videos in the SPA and store
ready-to-render timestamps in `src/content/space/learn.ts`. Do not call
NotebookLM, YouTube Data API, or any provider key from browser code.

Hidden course MVP videos use Kinescope and are defined in
`src/content/space/privateCourse.ts`. The first Kinescope lesson is
`/learn/courses/ai-content-marketing-2026/lesson-1-prompting` and uses
Kinescope video id `e941e14d-c5bf-40fc-abe5-a41e247777cf`. Keep this route out
of public navigation until launch. Configure the Kinescope project auth backend
only after the Vercel deployment has `KINESCOPE_AUTH_JWT_SECRET` and the
`/api/kinescope-course-auth` endpoint is live.

Local-only credentials for generating lesson timestamps live in
`.secrets/learn-video.env` (gitignored):

- `NOTEBOOKLM_NOTEBOOK_ID` — NotebookLM notebook used for Opten Learn video notes
- `YOUTUBE_API_KEY` — optional YouTube Data API v3 key copied from
  `C:\Projects\Obsidian\Vlad\.env` for future metadata/comment enrichment
- `YOUTUBE_CHANNEL_ID` — optional owner channel id from the same vault

Use `node scripts/learn-video-notes.mjs <youtube-url>` to add a YouTube source
to NotebookLM, wait for indexing, and print a JSON timestamp array. The script
sets `PYTHONIOENCODING=utf-8`, `NO_COLOR=1`, and `TERM=dumb` before calling the
`notebooklm` CLI because the Windows/Rich default console path can fail on
Unicode. Paste reviewed output into the relevant lesson's `timestamps` array;
keep generated source IDs and provider notes out of the public bundle unless
they are intentionally non-secret.

Learn Finds are generated from the local `C:\Projects\suffler` desktop tool.
The website reads them from `src/content/space/learnFinds.generated.json`.
Suffler may call the local `notebooklm` CLI, write that generated JSON, run the
site build, then commit and push the generated content so Vercel deploys it.
The publisher must block before committing if the website worktree has unrelated
tracked changes, and it must never commit NotebookLM auth files, API keys,
temporary notebooks, raw transcripts, or local suffler settings.

## Content & SEO — read before adding pages, posts, or images

The site shipped v1.0 (GEO Optimization, 12 → ~72.6 score, 7 phases) and v2.0
(Programmatic SEO — 62 model pages × RU/EN + 2 hubs = 144 prerendered routes,
shipped 2026-05-20) with a JSON-LD entity graph enforced by build-time gates.
**Adding a marketing/blog page is a coordinated 6-file change** (model pages
follow the generated flow above), not a one-shot file write.

Non-negotiables (the full set lives in `docs/CONTENT-AUTHORING.md`):

1. RU + EN ship together. No half-translated posts.
2. First 40-60 words = definitional answer block (`<h1>` + `.blog-intro`). AI Overviews extract this verbatim.
3. SEO keywords must be embedded in natural grammar. Do not paste raw search strings into visible copy (`Апскейл фото нейросеть`, `озвучка видео нейросеть тг`, `kling 3.0 цена`) unless the sentence explicitly discusses the query; rewrite as prose (`апскейл фото через нейросеть`, `нейросетевая озвучка видео для Telegram`, `цена Kling 3.0`).
4. JSON-LD must mirror the visible DOM — FAQs, dates, prices, person names. `verify-faq-mainentity.mjs` enforces FAQ parity at build time; the others are auditor-detectable.
5. Cover images: `public/blog/<slug>/cover.jpg`, ≥1600×900, no in-image text (one asset works for RU + EN + OG + visible `<img>`).
6. SEO2 inline blog images are locale-specific final rasters: generate RU and EN images with the short text already rendered inside the image. Use **Bebas Neue only** for all visible typography in SEO2 generated images, and attach/use `seo2/Reference/bebas-neue-font-reference.png` as the font reference in generation prompts. The Opten lime accent must be exactly `#9CFB51` in prompts and art direction; do not substitute warmer yellow-green, darker green, or approximate "lime" hues. Do not generate textless bases and add text afterward with editor/Canvas/HTML/CSS/Sharp overlays.
7. Every `<img>` gets explicit `width`/`height` (CLS guard).
8. `<html lang>` is baked at prerender, NEVER mutated at runtime (Phase 3 D-06).
9. Locale-neutral slugs — `/blog/foo` is the same slug in RU and EN.
10. `npm run build` must pass locally — the sitemap + llms floor checks fail loudly when routes are forgotten.

**The full playbook with route-registration checklist, schema graph rules, image conventions, and a list of optimizations that have already been tried and rejected: [docs/CONTENT-AUTHORING.md](docs/CONTENT-AUTHORING.md).** Open this file alongside `seo-routes.ts` whenever adding a new page.

## Project docs

Reference documentation lives in `docs/`:

- [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md) — **binding interface with the extension**
- [docs/CONTENT-AUTHORING.md](docs/CONTENT-AUTHORING.md) — **GEO+SEO playbook for new pages, blog posts, images** (read before any content change)
- [docs/LEARN-PUBLISHING.md](docs/LEARN-PUBLISHING.md) — **public Learn video publishing workflow** (RU/EN lesson data, timestamps, thumbnails, OG images, schema, sitemap)
- [docs/SEARCH-CONSOLE.md](docs/SEARCH-CONSOLE.md) — local Google Search Console OAuth access and CLI commands
- [docs/YANDEX-WEBMASTER.md](docs/YANDEX-WEBMASTER.md) — local Yandex Webmaster OAuth access and CLI commands
- [docs/TECH.md](docs/TECH.md) — stack snapshot
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — routes, flows, state
- [docs/SEO-AUDIT.md](docs/SEO-AUDIT.md) — SEO baseline + gap analysis (v1.0 input artifact)

Active planning state lives in `.planning/` (managed by GSD slash commands).
See `_index.md` for the Obsidian-friendly navigation hub.
