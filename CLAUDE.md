## Agent Context Ownership

`AGENTS.md` is the source of truth for all AI agent project context in this
repo. Update this file first.

`CLAUDE.md` is a compatibility mirror for Claude Code. After changing
`AGENTS.md`, run `npm run sync:agents` so Claude gets the same project
instructions and does not drift.

Do not recreate the old Codex adapter layout (`.codex/config.toml`,
`.codex/agents/`, `.agents/skills/`) unless explicitly requested. Project
knowledge belongs here, with detailed specs in `docs/`.

## Project

**opten.space** — public website for the **Opten** Chrome extension. Vite +
React 18 + TypeScript + Tailwind 4, SPA, deployed on Vercel.

## Hard command: write SEO article

When the user writes `напиши SEO-статью`, `напиши seo статью`, or asks to write
the next SEO article in this repo, this is a local SEO2 queue command, not a
general SEO/GEO audit and not a skill-discovery task. Do not invoke `geo`,
`geo-audit`, or similar audit skills for this exact command. `start SEO`,
`start seo`, and `старт SEO` are legacy aliases for the same flow, but the
preferred user-facing command is `напиши SEO-статью`.

Run:

```powershell
npm run start:seo
```

If it prints `start-seo: no-topics`, stop and tell the user the current SEO2
brief queue is exhausted and a new weekly batch must be generated in
`C:\Projects\opten-seo`. If it prints `start-seo: next-topic`, create exactly
one SEO2 blog post for that returned slug using `seo2/blog-post-instruction.md`.

Seven jobs: (1) marketing surface (landing in RU/EN), (2) website-first auth and
billing surface (`/login`, `/auth/callback`, `/pay`, `/account`, `/success` for
YooKassa RUB + Paddle USD — Pro is the only purchasable tier for AI-operations;
new Free accounts get 3 one-time signup credits while existing Free accounts may
remain at `0/300`; лендинг-редактор is an authenticated AI surface that spends
credits from the same shared ledger as быстрый режим `Улучшить` в popup
расширения), (3)
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
extension, plus the officially launched standalone Kinescope-backed course
under `/learn/courses/*`. The course is promoted from public Learn, blog CTAs,
Telegram, and other marketing surfaces. Its SPA routes remain `noindex` under
the current architecture; this is a crawler policy, not an indication that the
course is unlaunched, and (7) a public RU/EN prompt workbench in the landing hero:
the visible landing UI is improvement-only (no prompt score control or score
tooltip), lets the user select one of the popup quick-Improve model profiles,
enter a prompt, attach up to 8 ephemeral image references, and invoke improvement.
It calls this repo's same-origin `POST /api/prompt-workbench`, which verifies a
website JWT and mirrors the extension popup's `POPUP_REWRITE_PROMPT` flow:
minimum 20 characters, prompt-content language detection, the same committed
`rewriter.md`, Anthropic reference blocks, `max_tokens: 1200`,
legacy-compatible `count_usage: true`, `source: popup`, and the existing promptscore-proxy Claude
Haiku/shared operation ledger. Proxy billing is unconditional and never trusts this client field: it atomically reserves before Anthropic and releases only on provider failure. Anonymous requests return
`authentication_required`; signed-in Free users may spend their one-time signup
credits; exhausted Free users receive the proxy limit error; live Pro users spend
from the normal 300-operation monthly cycle. The only selectable
image models are Nano Banana 2, Nano Banana Pro, Chat GPT Image 2, Midjourney 8,
Midjourney 7, Seedream 5 Lite, Flux 2 Pro, and Z-Image. The only video models are
Seedance 2.0, Kling 3.0, Kling 2.6, Google Veo 3.1, Google Veo 3.0, and Wan 2.6.
The reference picker mirrors the extension popup pipeline (10 MB source cap,
512 px long-edge JPEG compression, quality 0.7, loading/removal states) but follows
the larger landing-page dimensions from Figma. Reference bytes and previews stay in
component memory and must never be written to localStorage. The endpoint and landing
UI accept only the `improve` action; prompt scoring is not part of this surface. The
textarea placeholder and empty-reference label mirror the popup (`Промпт или идея
20+ символов...`, `Загрузить фото`); inline errors occupy the lower-left status area,
while the lower-right always shows `Последнее обновление: DD.MM.YYYY`, computed from
the visitor's current local date and refreshed after midnight. Landing section order
is Hero/workbench → Partners → FeatureCards → Privacy → Pricing → FAQ. The Hero
upgrade CTA is rendered only after auth resolution and only for signed-out/Free
visitors; active Pro users must not see a one-frame CTA flash, and the desktop Hero
minimum height must shrink by the CTA height plus its top margin when the CTA is
absent. `ExtensionVideoAvatar` is fixed in the lower-right and visible immediately
in the top viewport; do not gate it behind a scroll threshold. The landing H1 keeps
the responsive sizes of 36/54/68 px. At the `md` breakpoint the RU Hero H1 is
locked to exactly two lines (`Не сливай кредиты` / `на плохие промпты`); the EN
equivalent follows the same explicit accent/rest two-line structure, while mobile
may wrap naturally. Its desktop highlight is positioned under the word `плохие`,
with a deliberate 118 px leftward offset from the center of the full second line.
The Hero workbench-to-CTA spacing is 64 px,
matching the `mt-16` rhythm used for the CTA in FeatureCards. On desktop, Free and
signed-out visitors see the green `Перейти на Pro—199₽/мес` CTA and the white AI-chat
CTA in one row at equal widths; on smaller screens they stack. Active Pro visitors
see only the centered white CTA. The boundary spacing after Partners and before
FeatureCards is intentionally doubled to 140 px on mobile and 192 px from the
`md` breakpoint. The Hero always shows a white secondary
`Использовать на сайтах: ChatGPT и Claude` CTA styled like the large extension
install button, with the supplied Claude icon first and ChatGPT icon second. Free
and signed-out visitors see it below the green `Перейти на Pro` CTA; active Pro
visitors see only the white CTA, without an auth-loading flash. It opens a
site-styled modal with Claude first and ChatGPT second, matching the extension's
three-step instructions. Claude downloads `opten.zip` through the existing
`/api/download-skill` endpoint using the website JWT; ChatGPT opens the same public
Opten GPT URL as the extension. Both actions remain disabled until Pro access is
resolved. Free/signed-out modal state explains the lock and includes a green
`Перейти на Pro` link. The modal must also explicitly explain the product reason
for these chat integrations: Claude and ChatGPT preserve the conversation context
between messages while applying the same Opten prompt-improvement instructions, so
users can refine prompts through an ongoing dialogue instead of isolated requests.
The AI-chat modal heading is centered and locked to two explicit lines:
`Улучшай промпты` / `в Claude и ChatGPT`; its introductory copy is centered too.
On desktop only, the RU introductory copy is locked to two explicit lines after
`ИИ-чату`; mobile keeps natural wrapping.
On mobile, both paired-icon white CTA variants (Claude/ChatGPT and
Chrome/Yandex Browser) hug their contents instead of stretching to the viewport;
each uses exactly 14 px of horizontal padding. Across mobile and desktop, every
paired-icon CTA renders both platform icons at the same 40 x 40 px size. Desktop
button sizing otherwise remains unchanged.
The Chrome/Yandex Browser CTAs beneath Partners and FeatureCards both reuse the
shared `InstallButton`; on desktop their pill dimensions, two-line typography,
icon overlap, spacing, and platform-icon sizes must remain identical.

The extension is still the primary shipped product. Opten Space Beta is an
account-based web app surface, but it must share identity, subscription, and
credits with the extension through `auth.users.id` and extension-owned
Supabase Edge Functions.

Every top-navigation implementation, including both `SiteHeader` and
`SpaceHeader`, labels the landing route as `Генератор промптов` (`Prompt
generator` in EN), not `Расширение`; the route and active-state key remain
unchanged for compatibility.

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

The launched Kinescope course routes live under `/learn/courses/:courseSlug`
and `/learn/courses/:courseSlug/:lessonSlug`. They are SPA-only and `noindex`
under the current routing policy, but public Learn and marketing pages may link
to the course root and course previews intentionally. Keep them out of sitemap,
llms.txt, and the EN sibling map unless a separate SEO routing decision changes
that policy. The `ai-content-marketing-2026` course is a standalone one-time
course purchase, not a Pro entitlement. RUB checkout uses YooKassa; USD
checkout uses Paddle with
course-specific one-time price IDs returned by
`/functions/v1/create-course-payment`. Promo preview uses the same endpoint with
optional `quote_only: true`; this validates the uppercase promo code and returns
the effective amount without creating `course_orders` or provider payments.
Guest checkout is initiated with an email address, selected currency, and
optional uppercase promo code. Provider webhooks grant a course entitlement and
send a direct website auth link to the same email. The internal test promo
`FREE` maps to `100 ₽` or `$1` and requires a separate Paddle `$1` price ID.
The public RUB base price is `2 990 ₽`; public discounts are not hard-coded in
the website and must be represented by server-side promo codes (planned common
campaigns: `-20%` and `-40%`). Marketing/partner course promo codes live in the extension-owned
`course_promo_codes` table (RLS on, no public policies) with `discount_kind` =
`fixed_price` or `percentage`, `enabled`, optional `usage_limit`, `times_used`,
`starts_at`, and `expires_at`. Codes must use uppercase `A-Z0-9` so the same
code can be applied to YooKassa/RUB server pricing and Paddle/USD
`discountCode`; `times_used` is incremented only by a successful provider
webhook, never by quote preview. Kinescope video playback is server-gated: the client calls
`/api/kinescope-course-token` with the website Supabase JWT, the server verifies
course access through `/functions/v1/course-access-summary` and returns a
short-lived Kinescope embed URL with `drmauthtoken`. Kinescope calls
`/api/kinescope-course-auth` during playback to receive 200/403. Never put the
Kinescope API key, auth JWT secret, Supabase service-role key, YooKassa secret,
Resend key, or raw playback token in the client bundle.

The Telegram course offer is a separate sales funnel for this course, not a
course entitlement and not a Pro feature. The Telegram bot backend retains the
legacy service name `supabase/functions/telegram-hidden-intro-webhook` for
deployment compatibility and has `verify_jwt = false`; it validates
`TELEGRAM_WEBHOOK_SECRET`, stores started users in
`telegram_hidden_intro_leads`, writes
funnel events to `telegram_hidden_intro_events`, and issues a random per-user
`course_discount_claims` link to the course checkout. A Telegram claim is a
discount transport only and must never authorize lesson playback; all 16
lessons require a normal course entitlement through `course-access-summary`.
The removed `hidden-intro`/lesson-0 content must not appear in
`privateCourseCollection.lessons` or `api/_shared/kinescopeCourse.ts`; the
legacy URL may only redirect to lesson 1 while preserving the claim query.
The browser stores the claim token in
`localStorage.opten_course_preview_claim_v1`, reports the initial open to the
legacy-named `/functions/v1/telegram-hidden-intro-opened` endpoint for funnel
analytics, and uses it only when quoting or creating checkout. The 24-hour
window applies to the 20% checkout discount. Repeated bot requests reuse the
same claim and must never create, refresh, or extend the discount. Already
issued claims retain their stored percentage until expiry, but they no longer
unlock lessons. The claim does not unlock private course prompts or the
separate `Генератор промптов Opten` section. That
collection-level generator block must remain visible on the course root and
every lesson page. On desktop it stays compact inside the left lesson-content
column and appears before lesson materials/course showcase and prompts, never
as a full-width block below the course sidebar. Its explanatory description is
shown only while access is locked; a course buyer or active Pro user sees the
heading and working ChatGPT and Claude/Codex links without the sales
description. Everyone else sees the same two generators in a locked conversion
state with one outlined `Открыть по подписке` CTA to `/pay`; the banner copy
may also mention the full course, but the course checkout CTA stays in the
dedicated purchase surface instead of this compact generator block.
A Telegram lead may receive the 24h discount claim exactly once: repeated
course requests reuse the same claim token, while an expired or used discount
is never reissued or extended. Manual admin broadcasts
are delivery-only and must never create, refresh, or extend
`course_discount_claims`. The 24h 20% claim discount has priority over manual
promo codes and must not stack. Provider webhooks mark it used only after
successful payment and mark the lead paid, but do not send a Telegram
payment-success message; course access is delivered by email;
reminders and broadcasts skip used claims and mark Bot API 403/blocked
recipients as blocked.

For future `/start` updates only, the Telegram bot immediately creates/reuses
the discount claim, sends the public course intro video, then sends the
HTML-formatted course offer with one `Открыть курс` button and the public
Telegram channel link in the message text. Legacy course callbacks remain
accepted so buttons already present in old chats continue to work. The course
copy
positions the practical result as a complete brand package worth at least
100,000 RUB on the market and must not promise subscriber/client growth.
Changing `/start` must never trigger a broadcast or any message to existing
leads. The website must not advertise free Telegram lessons or deep-link to the
bot from locked lesson players; all locked lessons point to the normal course
purchase surface.
The locked Bot API name is `Влад Воронежцев | Уроки и промпты`, and the locked
short description is `Доступ к урокам и каналу с промптами.`; future bot
updates must not change either value unless the owner explicitly asks. The Bot
API long description remains `Привет! Здесь можно получить доступ в мой
Telegram-канал с промптами и полезными инструкциями или посмотреть курс по
ИИ.\n\nЖми /Start 👇`, and the `/start` command description is `Открыть курс`.
These exact name, short description, long description, and command values must
be set and verified in both the default Bot API scope and the `ru` language
scope, because Telegram clients may prefer the localized RU profile.
If claim creation fails, the bot shows `Открыть курс` first and `Перейти в
Telegram` second.
The video must use a stable public HTTPS URL. The reviewed default is the
source-controlled 720p H.264/AAC asset at
`/assets/telegram/ai-content-marketing-2026-intro-v2.mp4` (17.5 MB, below
Telegram's 20 MB remote-URL limit); `TELEGRAM_INTRO_VIDEO_URL` may override it.
Do not use a Telegram `file_id`, because a stale ID can silently restore cached
media after deploys.

The owner/admin dashboard on opten.space is a general protected admin surface
under `/admin`, not a Telegram-only one-off. The first module is Telegram
hidden-intro operations: read funnel stats through `/api/admin/telegram-stats`
send Telegram broadcasts through `/api/admin/telegram-broadcast`, and review or
delete stored broadcast history through `/api/admin/telegram-broadcasts`.
Broadcast images are uploaded through `/api/admin/telegram-upload-photo`, which
checks the website JWT + owner allowlist and then calls the extension-owned
`telegram-hidden-intro-assets` Edge Function with `TELEGRAM_ADMIN_SECRET`.
Uploaded images are stored server-side and exposed only as random public HTTPS
asset URLs for Telegram `sendPhoto`; never put raw image data or operational
storage/service secrets in browser storage. Broadcast send must always run a
dry-run recipient preview first and require an explicit final confirmation with
the exact recipient count; the extension-owned backend must persist new
broadcast recipient `message_id` values before a post can be deleted later. Old
broadcasts that were sent before message IDs were stored are not reliably
deletable. `/admin` authenticates through
the normal website Supabase session
(`localStorage.opten_space_session_v1`) and server-side allowlists in this repo's
serverless functions. Do not add a separate hardcoded admin password to the
browser bundle. Prefer `OPTEN_ADMIN_USER_IDS` for stable owner authorization;
`OPTEN_ADMIN_EMAILS` exists as a bootstrap fallback. Never expose
`TELEGRAM_ADMIN_SECRET`, Telegram bot tokens, Supabase service-role keys,
payment secrets, or operational provider keys to browser JavaScript,
localStorage, route params, or public PostgREST calls. Client admin pages call
this repo's serverless `/api/admin/*` endpoints; those endpoints verify the
website JWT, check the server-side owner allowlist, and then call
extension-owned service endpoints with server-only secrets.

Hardcoded constants that are duplicated and must be kept in sync:
- `EXTENSION_IDS` — appears in [src/app/pages/PayPage.tsx](src/app/pages/PayPage.tsx), [src/app/pages/AccountPage.tsx](src/app/pages/AccountPage.tsx), [src/app/pages/DownloadSkillPage.tsx](src/app/pages/DownloadSkillPage.tsx), [src/app/pages/PromptLibraryPage.tsx](src/app/pages/PromptLibraryPage.tsx)
- `SUPABASE_URL`, `SUPABASE_REST_URL`, and `SUPABASE_ANON_KEY` — appears in [src/lib/optenAuth.ts](src/lib/optenAuth.ts), [src/lib/promptLibraryApi.ts](src/lib/promptLibraryApi.ts), [src/app/pages/PayPage.tsx](src/app/pages/PayPage.tsx), [src/app/pages/AccountPage.tsx](src/app/pages/AccountPage.tsx), [api/download-skill.ts](api/download-skill.ts), plus the extension's `config/api.js`

## Tech stack

### Global PageSpeed audits

Google PageSpeed Insights is configured globally for this Windows user. Run
`pagespeed <public-url>` from any project; add `-Strategy both` for mobile and
desktop or `-Category all` for all Lighthouse categories. This one-shot command
reads the user-level `PAGESPEED_API_KEY` and exits after the Google response.
The global `pagespeed` MCP must remain disabled by default because it can keep
PowerShell/npx/Node processes in memory. Enable it only for an MCP-specific task
with `pagespeed-mcp on`, restart the client, then run `pagespeed-mcp off` and
restart again immediately after the task. Never copy the key into this
repository or create a project-local MCP duplicate. Keep Lighthouse lab metrics
separate from CrUX field metrics. Full usage and the portable `AGENTS.md` block are in
[docs/PAGESPEED-GLOBAL.md](docs/PAGESPEED-GLOBAL.md).
Live keyed mobile, desktop, Accessibility, and four-category calls were verified
on 2026-07-17. The command retries one transient PageSpeed `429`; inspect Google
Cloud quota settings only if the retry also fails.

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
| opten-proxy (private) | `C:\Projects\promptscore-proxy` | Vercel proxy for extension AI requests and the website `PromptWorkbench`, plus 63 model-specific skill files in `skills/*.md` (61 model + 2 fallback). The same skill files are bundled into the Pro-only `opten.zip` Claude Skill served via this repo's `/api/download-skill` |

The extension repo owns the Supabase project — all Edge Functions and
migrations are deployed from there, not from this repo.

## Architecture

```
index.html  ─sync→  Paddle.js CDN  (only in dist/pay/, dist/en/pay/ — Phase 2.2 + 3 D-03b)
     │
     └→ main.tsx → <BrowserRouter> → <LangProvider> → <Routes>
            ↓
        ~39 client route patterns + catch-all 404 → 204 prerendered SEO routes:
          Marketing/billing RU (9): /, /pay, /welcome, /about, /blog, /blog/:slug,
                  /privacy, /terms, /refund
          Models RU (Phase v2.0): /models hub + /models/:slug (62 model pages)
          Learn RU: /learn hub + /learn/:lessonSlug (public video lessons)
                    + /learn/finds/:slug (curated third-party expert videos)
          Launched paid course SPA-only: /learn/courses/:courseSlug(/:lessonSlug)
          RU SPA-only (7, X-Robots-Tag noindex): /success, /login,
                                                  /auth/callback, /account,
                                                  /dashboard/download-skill,
                                                  /prompt-library, /p/:slug
          App SPA-only (X-Robots-Tag noindex): /app, /app/login,
                  /app/auth/callback; /app/learn* redirects to /learn*
          EN: /en/ sibling for each prerendered RU route + /en/models(/:slug)
              + /en/learn(/:slug) + /en/learn/finds/:slug
          Catch-all: <Route path="*"> → NotFound (runtime noindex injection)

  Prerender (postbuild):  scripts/prerender.mjs → 204 dist/<route>/index.html files
                          (40 blog + 24 Learn + 126 model + marketing/legal/pricing —
                          with hreflang triplets + baked <html lang>)
                          + sitemap.xml (204 URL) + llms.txt + IndexNow ping
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
                          Course checkout/access uses extension-owned Edge
                          Functions: `/create-course-payment` for one-time
                          RUB/USD checkout and `/course-access-summary` for
                          entitlement checks; it is separate from Pro.
                          Auth email for OTP login is sent by
                          self-hosted Supabase Auth through Resend SMTP and
                          uses the public GoTrue template at
                          /auth-templates/magic-link.html. The code is the
                          only rendered email sign-in path; no magic-link CTA
                          is shown in the email.
  Site → Paddle:          window.Paddle.Checkout.open(...)
  Site own API:           GET /api/download-skill (Vercel serverless, JWT + Pro-gated)
                          POST /api/prompt-workbench — authenticated landing workbench;
                          website JWT → promptscore-proxy Claude Haiku quick-Improve path
                          and shared operation ledger; exact 14-model popup allowlist,
                          input cap, proxy-enforced Free signup/Pro limits
                          POST /api/course-prompt — website JWT + course entitlement gate;
                          returns whitelisted private course prompt bodies
                          POST /api/kinescope-course-token — website JWT + course entitlement gate;
                          returns short-lived Kinescope embed URL with drmauthtoken
                          POST /api/kinescope-course-auth — Kinescope server callback;
                          validates signed drmauthtoken and returns 200/403

  Legacy 301 redirects:   /guides/* → /blog/*, /en/guides/* → /en/blog/*
                          (Phase 5 B-07; the /guides/* URL space is retired)
```

**Locked/auth/noindex routes never get `/en/*` siblings by design** (Phase 3 D-03): `/success` is YooKassa-RUB only; `/login`, `/auth/*`, `/account`, `/dashboard/*`, `/prompt-library`, `/p/*`, `/learn/courses/*`, and `/app/*` are authenticated, app, paid-course, or random-link snapshot surfaces (Disallow'd/noindex) rather than content/SEO pages. The course is nevertheless officially launched and publicly promoted; `noindex` is independent of launch status. Public Learn is the exception to the old app Learn prototype: canonical Learn routes are `/learn` and `/en/learn`, while `/app/learn*` redirects. On locked/auth routes the LangSwitcher or app-local language switch flips language *in place* (storage + state) instead of navigating.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for routes, billing flows, and i18n details.

## Conventions

### File structure

```
api/                     — Vercel serverless functions:
                             download-skill.ts — Pro-gated Claude Skill ZIP
                             prompt-workbench.ts — authenticated quick-Improve endpoint
                                                   (legacy score action may remain server-side)
                             course-prompt.ts — course-entitlement-gated prompt body endpoint
                             kinescope-course-token.ts — course-entitlement-gated playback token issuer
                             kinescope-course-auth.ts — Kinescope playback auth callback
                             _shared/ — server-only auth, course, Kinescope, and AI helpers
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
├── main.tsx             — entry, route patterns (incl. /models, /learn, /learn/finds, launched paid /learn/courses, /prompt-library, /p/:slug, RU+EN siblings) + catch-all, hydrate-vs-mount discriminator
├── app/
│   ├── App.tsx          — landing
│   ├── components/      — shared UI:
│   │     SiteHeader, SiteFooter — compact account/header shell + shared footer
│   │     LocalizedLink, LangSwitcher — i18n-aware nav
│   │     FaqBlock — semantic <dl>; source-of-truth for FAQPage schema
│   │     BlogPostCard, Picture, InstallButton, PromptWorkbench, RouteLoading
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
│   └── space/           — public Learn lessons/finds and launched paid Kinescope course:
│                          learn.ts, learnSlugs.ts, learnFinds.generated.json,
│                          learnFinds.ts, privateCourse.ts, privateCourseExtras.ts
├── i18n/                — LangContext + ru.json/en.json + paths.ts (EN_SIBLINGS)
├── imports/             — Figma-Make-generated SVG paths (auto-generated; brittle)
├── lib/                 — paddle.ts (ensurePaddle lazy loader, Phase 2.2),
│                          optenAuth.ts (website Supabase session),
│                          promptLibraryApi.ts (Prompt Library PostgREST/RPC helpers)
├── styles/              — index.css, tailwind.css, theme.css, fonts.css
└── types/               — TS type defs
```

`src/i18n/paths.ts` is the single source of truth for `EN_SIBLINGS` (static marketing routes + every `/models/<slug>` from `src/content/models/slugs.ts` + public Learn lesson/find slugs). It MUST stay in sync with the EN entries in `scripts/seo-routes.ts` — easy to miss when adding a route.

**Adding a new page or blog post touches 6 files in sync** (route, manifest, EN siblings, sitemap, llms.txt, dicts) plus optional content/blog files. The full checklist + GEO/SEO patterns are in [docs/CONTENT-AUTHORING.md](docs/CONTENT-AUTHORING.md) — read that before touching content.

SEO briefs contain search intent, not literal copy. Do not paste raw,
ungrammatical keyword strings into visible text, titles, descriptions, FAQ,
or examples just to preserve exact match. Inflect and rewrite keys naturally
(`бизнес портрет нейросеть` → `бизнес-портрет через нейросеть`,
`деловой портрет нейросеть` → `деловой портрет в нейросети/через нейросеть`).
Exact raw query strings are allowed only when explicitly discussing the search
query itself.

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
- The landing `PromptWorkbench` is visible publicly but its AI action requires a signed-in website session and is otherwise ephemeral: prompt text, AI results, selected files, compressed reference bytes, and preview URLs stay in component memory and are not written to `localStorage`. The browser calls only same-origin `/api/prompt-workbench`; logged-out clicks show an authentication error, signed-in Free clicks may spend one-time signup credits, exhausted Free users receive the proxy limit error, and live Pro sessions spend the normal 300-operation monthly cycle. The server verifies the JWT, enforces the extension popup's exact 14-model quick-Improve allowlist and 20-character minimum, then calls the existing `promptscore-proxy` Claude Haiku rewrite endpoint with the popup-equivalent request and legacy-compatible `count_usage: true`; the proxy is the final usage gate and charges every rewrite regardless of client fields through atomic reserve-before-provider accounting. Uploaded references are capped at 8 files, 10 MB per source, compressed client-side to JPEG with a 512 px maximum long edge, and must be revoked/cleared when removed or unmounted. During `npm run dev`, `vite.config.ts` mounts the same Node handler as dev-only middleware so localhost exercises the production handler contract. The reference-strip add button uses an inset focus ring: the strip scrolls horizontally, so an external ring would be clipped by its overflow boundary after the native file picker closes. Copying is local and does not consume usage: desktop shows a secondary `Скопировать` action beside `Улучшить`, while mobile shows the extension-matching outline copy icon in the workbench header. Both copy the current prompt and cross-fade to the extension's filled icon for 500 ms after success.
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

This repo uses ordinary docs/issues for planning. Keep project context in
`AGENTS.md`; keep durable specs, audits, and handoffs in `docs/`.

For non-trivial work, create ordinary docs or implementation plans in `docs/`
when needed. For ad-hoc edits, keep changes scoped and respect the integration
contract above.

### Browser verification

For local UI verification, use the Codex in-app Browser first (`iab`) for
opening, inspecting, clicking, typing, screenshotting, and checking localhost
routes. Do not default to the standalone Playwright CLI for site checks.

Use Playwright CLI only as a fallback when the in-app Browser tool is not
available in the current session, and say that explicitly in the final note.
Project scripts that already use Playwright, such as `scripts/smoke-blog.mjs`,
can remain Playwright-based unless they are being rewritten.

The Obsidian vault root is the repo root, so every `.md` here also appears
in the vault graph. Prefer `[[wikilinks]]` in project notes when that improves
navigation. See `_index.md` for the navigation hub.

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
- `SUPABASE_JWT_SECRET` — server-only self-hosted Supabase JWT secret used by
  site API functions to verify website/extension JWTs locally. Must match the
  self-hosted GoTrue `JWT_SECRET`.
- `OPTEN_ADMIN_USER_IDS` — server-only comma-separated owner `auth.users.id`
  allowlist for `/api/admin/*`. Prefer this over email for long-term admin
  authorization. Production currently includes the owner account
  `zignifer@gmail.com`.
- `OPTEN_ADMIN_EMAILS` — optional server-only comma-separated owner email
  allowlist for `/api/admin/*` bootstrap/fallback.
- `TELEGRAM_ADMIN_SECRET` — server-only secret used by website admin proxy
  endpoints to call extension-owned Telegram service Edge Functions for stats
  and broadcasts.
- Course Paddle one-time price IDs are server-only in the extension-owned
  Supabase Edge Function environment:
  `PADDLE_PRICE_ID_COURSE_AI_CONTENT_MARKETING_2026_{SANDBOX|PRODUCTION}` and
  `PADDLE_PRICE_ID_COURSE_AI_CONTENT_MARKETING_2026_FREE_{SANDBOX|PRODUCTION}`.
  Current live production price IDs: `$41` =
  `pri_01kvk9vzec7cwgq7zgs9azw2re`, `$1` FREE test =
  `pri_01kvk9x5mcnadfj0beymk23ze5`.
- `KINESCOPE_AUTH_JWT_SECRET` — server-only HS256 secret used to sign and
  verify short-lived Kinescope `drmauthtoken` playback tokens for paid course
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

Preferred reauthorization flow for agents:

1. Run `npm run gsc:refresh-auth`. It starts a temporary localhost callback and
   writes `.secrets/gsc-oauth-refresh.status.json` with `authUrl`, `callback`,
   and current `status`.
2. Use the Chrome control plugin/skill to open the `authUrl` in the user's real
   Chrome profile. Do not rely on `Start-Process` from PowerShell as the primary
   UX; in this desktop setup it may silently fail to surface a browser window.
3. Leave the Chrome tab as a handoff and tell the user: choose the Google
   account that owns Search Console for `opten.space`, approve the Webmasters /
   Search Console scope, then say `готово`.
4. After the user confirms, read the status file. `status: "complete"` means the
   helper saved the new `GSC_REFRESH_TOKEN` into both `.secrets/gsc-oauth.env`
   and `C:\Projects\opten-seo\.env.local`.
5. Verify immediately with `npm run gsc:sites` and then continue the audit with
   `npm run gsc:sitemaps`, `npm run gsc:performance -- 28`, and targeted
   `npm run gsc:inspect -- <url>` checks.

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

### Kinescope local API access

Kinescope operational API access for the paid course is local-only and
gitignored in `.secrets/kinescope.env`:

- `KINESCOPE_API_KEY`

The key was originally copied from `C:\Users\КОМП\Desktop\kine.txt`. Use it
only from server-side scripts or terminal checks, never in client code or
`VITE_*` variables. Current Kinescope objects for
`ai-content-marketing-2026`: project `2b95951a-c2f0-4bbd-b5c4-0642539438b2`,
gated lesson player `f4e68659-b78f-4b48-8134-3856d827efa9`, public intro
player `84928f86-0df1-4a04-885e-183ca8fdb5d2`, 16 video IDs whitelisted in
`api/_shared/kinescopeCourse.ts`.

### Opten Space Learn video timestamp tooling

Learn course/lesson pages embed public YouTube videos in the SPA and store
ready-to-render timestamps in `src/content/space/learn.ts`. Do not call
NotebookLM, YouTube Data API, or any provider key from browser code.

Paid course videos use Kinescope and are defined in
`src/content/space/privateCourse.ts`. The `ai-content-marketing-2026` course has
16 connected Kinescope lesson videos, all whitelisted in
`api/_shared/kinescopeCourse.ts`. The course is launched and intentionally
linked from public Learn and marketing content. The gated lesson project has
project encryption enabled, strict DRM auth
configured to `https://opten.space/api/kinescope-course-auth`, domain
restrictions for `opten.space` and `www.opten.space`, subtitle display enabled,
and course chapters. The course root intro video is the exception: it lives in
the separate public Kinescope project `Public`
(`ca34b0dc-484e-49ac-8981-9d7485d32c09`, `privacy_type=anywhere`,
`encrypted=false`) and embeds directly on
`/learn/courses/ai-content-marketing-2026/` without
`/api/kinescope-course-token` or `drmauthtoken`. Current public intro video:
Kinescope video `9c0fc06c-0063-4d9d-98f8-5333f993072b`, embed
`https://kinescope.io/embed/kgJ8g56Bu5BpggbbaFLhqc`, player
`84928f86-0df1-4a04-885e-183ca8fdb5d2` with
`enable_default_subtitle=true` so the checked RU subtitle track opens by
default. Kinescope
does not expose an API endpoint for starting AI subtitle generation; the public
API can upload ready `.srt/.vtt` subtitle files or enable existing subtitle
tracks. Kinescope lesson IDs are random provider UUIDs; new uploaded lessons
must be added to both `src/content/space/privateCourse.ts` and
`api/_shared/kinescopeCourse.ts`.

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

### Canonical SEO growth plan

For SEO prioritization and implementation order, use
[docs/seo/SEO-GROWTH-PLAN.md](docs/seo/SEO-GROWTH-PLAN.md) as the canonical
working plan. It consolidates the July 2026 search-console audit, GEO/AI
research, external-authority strategy, and implementation backlog. Files under
`docs/seo/research/` are historical starting research only: do not implement a
recommendation from them unless it is retained in the canonical plan.

Product and integration constraints in this `AGENTS.md` and
[docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md) always take
precedence over SEO ideas. In particular, do not expose or index paid
Kinescope course lessons, weaken course entitlement checks, promise unsupported
extension integrations, or introduce free AI operations solely for SEO.

The site shipped v1.0 (GEO Optimization, 12 → ~72.6 score, 7 phases) and v2.0
(Programmatic SEO — 62 model pages × RU/EN + 2 hubs = 126 prerendered model
routes, shipped 2026-05-20) with a JSON-LD entity graph enforced by build-time
gates. Total prerendered SEO route count is currently 204 after public Learn
and Learn Finds.
**Adding a marketing/blog page is a coordinated 6-file change** (model pages
follow the generated flow above), not a one-shot file write.

Non-negotiables (the full set lives in `docs/CONTENT-AUTHORING.md`):

1. RU + EN ship together. No half-translated posts.
2. First 40-60 words = definitional answer block (`<h1>` + `.blog-intro`). AI Overviews extract this verbatim.
3. SEO keywords must be embedded in natural grammar. Do not paste raw search strings into visible copy (`Апскейл фото нейросеть`, `озвучка видео нейросеть тг`, `kling 3.0 цена`) unless the sentence explicitly discusses the query; rewrite as prose (`апскейл фото через нейросеть`, `нейросетевая озвучка видео для Telegram`, `цена Kling 3.0`).
4. JSON-LD must mirror the visible DOM — FAQs, dates, prices, person names. `verify-faq-mainentity.mjs` enforces FAQ parity at build time; the others are auditor-detectable.
5. Cover images: `public/blog/<slug>/cover.jpg`, ≥1600×900, no in-image text (one asset works for RU + EN + OG + visible `<img>`).
6. SEO2 inline blog images are locale-specific final rasters: generate RU and EN images with the short text already rendered inside the image. Use **Bebas Neue only** for all visible typography in SEO2 generated images, and attach/use `seo2/Reference/bebas-neue-font-reference.png` as the font reference in generation prompts. The Opten lime accent must be exactly `#9CFB51` in prompts and art direction; do not substitute warmer yellow-green, darker green, or approximate "lime" hues. Do not generate textless bases and add text afterward with editor/Canvas/HTML/CSS/Sharp overlays.
7. Before generating any SEO2 blog art, the article brief must contain a concrete `Visual Production Brief` in the W23 pattern: one distinct no-text cover concept plus separate RU/EN inline frame concepts. Do not proceed from generic `Image Suggestions` like "learning desk" or "course board". The visual brief must force distinct physical/subject scenes and explicitly ban repeated floating UI boards, laptop dashboards, green connector networks, or reused composition across posts in the same batch.
8. Course promo banners are the exception to the inline-text rule: they are reusable generated rasters with a clean left-side negative-space zone and a right-side Opten-style visual; the heading, description, and CTA button are rendered as accessible HTML so the same asset can be reused and localized. Save them under `public/blog/_banners/`, use dark SaaS editorial styling (`#011417` + exact `#9CFB51`), and link blog CTAs to `/learn/courses/ai-content-marketing-2026`. Future blog promo CTAs should advertise this course, not the Chrome extension, unless the article is specifically about extension install/use.
9. Active SEO2 weekly briefs must pass `npm run verify:seo2-briefs` before article generation. This gate rejects active `pending`/`deferred`/`ready` briefs that still use `## Image Suggestions` or lack generated-in-image visual rules. `npm run build` runs the same gate first.
10. Every `<img>` gets explicit `width`/`height` (CLS guard).
11. `<html lang>` is baked at prerender, NEVER mutated at runtime (Phase 3 D-06).
12. Locale-neutral slugs — `/blog/foo` is the same slug in RU and EN.
13. `npm run build` must pass locally — the sitemap + llms floor checks fail loudly when routes are forgotten.
14. User command `напиши SEO-статью` means: run `npm run start:seo` first. Legacy aliases `start SEO`, `start seo`, and `старт SEO` mean the same thing. If it prints `start-seo: no-topics`, do not generate an article; tell the user a new weekly batch must be generated in `opten-seo`. If it prints `start-seo: next-topic`, create exactly one SEO2 post for that slug using `seo2/blog-post-instruction.md`.
15. New SEO2 weekly blog posts must pass `npm run verify:seo2-blog -- <slug>`
    before commit. This is a blocking editorial/build gate, not an optional
    audit. It checks the SEO2 visual layer (4+ RU inline images, 4+ EN inline
    images, generated image files present, course CTA to
    `/learn/courses/ai-content-marketing-2026`) and basic content constraints.
    After `npm run build`, run `npm run verify:blog-seo -- <slug>` to assert the
    prerendered DOM/metadata/schema contract for both `/blog/<slug>` and
    `/en/blog/<slug>`. A normal build is not enough for SEO2 posts.

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
- [docs/seo/SEO-GROWTH-PLAN.md](docs/seo/SEO-GROWTH-PLAN.md) — **canonical SEO/GEO priorities and implementation plan**
- [docs/seo/README.md](docs/seo/README.md) — SEO documentation index; historical audits live under `docs/seo/research/`

See `_index.md` for the Obsidian-friendly navigation hub.
