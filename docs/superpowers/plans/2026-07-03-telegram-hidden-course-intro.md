# Telegram Hidden Course Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Telegram bot flow that can give subscribers a future hidden course intro link while preparing the website safely, without disrupting the currently working paid course.

**Architecture:** Keep the first version deliberately simple: Telegram handles subscription check and sends a secret noindex website URL; the website stores a local browser flag after that URL is opened. Because the hidden intro video does not exist yet, the site must only prepare disabled/placeholder-safe plumbing and must not insert a playable hidden lesson into the active paid course outline until the video is ready.

**Tech Stack:** Supabase Edge Functions in `C:\Projects\promptscore`, Telegram Bot API, Vite + React + TypeScript in `C:\Projects\opten-website`, existing `/learn/courses/*` SPA/noindex course surface.

**Implementation status, 2026-07-03:** website prep, guardrails, backend function, VPS deploy, bot creation, webhook setup, `/start`, and the negative subscription path are complete. The live bot is `@opten_space_bot`. Successful subscription verification is blocked only by Telegram Web: the web client did not surface the newly created bot in the channel admin picker, so `@opten_space_bot` still needs to be added as an administrator to `@v_voronezhtsev` in Telegram Desktop or mobile before `getChatMember` can access the member list.

---

## Safety Rules

- Do not change the existing 16 paid lesson slugs, video IDs, Kinescope whitelist entries, payment flow, or `course-access-summary` behavior.
- Do not add the future hidden intro to `privateCourseCollection.lessons` while the real video is missing.
- Do not add the future hidden intro to sitemap, llms.txt, public Learn hub, public Learn SEO manifests, or EN siblings.
- Keep `/learn/courses/*` noindex and SPA-only.
- Do not put `TELEGRAM_BOT_TOKEN`, Telegram webhook secret, Supabase service role, Kinescope secrets, or payment secrets in the website bundle.
- Treat the first website change as a feature flag / placeholder only: it may show a non-invasive CTA slot, but it must not alter paid lesson playback or purchase gating.

## File Structure

Website repo `C:\Projects\opten-website`:

- Modify `AGENTS.md` first, then run `npm run sync:agents`.
- Add `src/content/space/hiddenIntro.ts` for hidden-intro constants, labels, localStorage key, route slug, and feature flags.
- Modify `src/app/pages/space/PrivateCoursePage.tsx` to recognize the future secret route without redirecting to `/learn`.
- Modify `src/app/components/space/learn/LearnComponents.tsx` only through a small helper/component boundary for the optional hidden-intro CTA; avoid broad course layout rewrites.
- Add `scripts/verify-hidden-intro.mjs` to assert the hidden intro does not enter public SEO outputs or the paid lesson Kinescope whitelist while disabled.
- Modify `package.json` to add `verify:hidden-intro`.
- Modify `docs/INTEGRATION-CONTRACT.md` and `docs/ARCHITECTURE.md` to document the non-entitlement Telegram hidden intro flow.

Extension/backend repo `C:\Projects\promptscore`:

- Add `supabase/functions/telegram-hidden-intro-webhook/index.ts` for Telegram webhook handling.
- Add `supabase/functions/_shared/telegram-hidden-intro.ts` for message text, Telegram API helper, membership status checks, and secret URL builder.
- Add function tests or lightweight Deno checks for subscription status decisions.
- Update backend docs/AGENTS with required Telegram secrets and deployment steps.

## Task 1: Document The Contract First

**Files:**
- Modify: `C:\Projects\opten-website\AGENTS.md`
- Modify: `C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md`
- Modify: `C:\Projects\opten-website\docs\ARCHITECTURE.md`
- Run: `npm run sync:agents`

- [x] Add a short section to `AGENTS.md` that says the Telegram hidden intro is a free lead magnet, not a course entitlement and not a Pro feature.
- [x] Document that the first shipped website version must not add a missing-video lesson to the active paid course outline.
- [x] Document the chosen access model: secret noindex URL from Telegram, local browser flag after opening, no tokens, no Telegram user database in v1.
- [x] Run `npm run sync:agents`.
- [x] Verify `CLAUDE.md` mirrors the new `AGENTS.md` text.

Expected result: future agents do not accidentally convert the Telegram hidden intro into a paid entitlement, public SEO page, or database-heavy account-linking flow.

## Task 2: Build The Minimal Telegram Bot Backend

**Files:**
- Create: `C:\Projects\promptscore\supabase\functions\_shared\telegram-hidden-intro.ts`
- Create: `C:\Projects\promptscore\supabase\functions\telegram-hidden-intro-webhook\index.ts`
- Modify: `C:\Projects\promptscore\AGENTS.md`

- [x] Implement webhook handling for Telegram `message` and `callback_query` updates.
- [x] On `/start`, send a welcome message with two inline buttons: subscribe to the channel and check subscription.
- [x] On `check_subscription`, call Telegram `getChatMember` with `TELEGRAM_CHANNEL_ID` and the callback user id.
- [x] Treat `creator`, `administrator`, and `member` as subscribed. Treat `restricted` as subscribed only when Telegram returns `is_member: true`. Treat `left`, `kicked`, API errors, and missing user id as not subscribed.
- [x] If subscribed, send the secret website URL:
  `https://opten.space/learn/courses/ai-content-marketing-2026/hidden-intro`
- [x] If not subscribed, edit or send a message that says subscription was not found and includes the same subscribe/check buttons.
- [x] Validate `X-Telegram-Bot-Api-Secret-Token` against `TELEGRAM_WEBHOOK_SECRET` on every webhook request.
- [x] Keep no lead table in v1. Logging may include Telegram update id, action name, and status only; do not log message bodies or secrets.

Required Edge Function env vars:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_BOT_USERNAME
TELEGRAM_CHANNEL_ID
TELEGRAM_CHANNEL_URL
TELEGRAM_WEBHOOK_SECRET
HIDDEN_INTRO_URL=https://opten.space/learn/courses/ai-content-marketing-2026/hidden-intro
```

Expected result: the bot can be launched and tested independently before the real video exists.

## Task 3: Prepare Website Constants Without Changing The Live Course

**Files:**
- Create: `C:\Projects\opten-website\src\content\space\hiddenIntro.ts`
- Test: `C:\Projects\opten-website\scripts\verify-hidden-intro.mjs`

- [x] Create constants:

```ts
export const HIDDEN_INTRO_SLUG = "hidden-intro";
export const HIDDEN_INTRO_ROUTE = "/learn/courses/ai-content-marketing-2026/hidden-intro";
export const HIDDEN_INTRO_UNLOCK_STORAGE_KEY = "opten_hidden_intro_opened_v1";
export const HIDDEN_INTRO_WEBSITE_SLOT_ENABLED = false;
export const HIDDEN_INTRO_VIDEO_ENABLED = false;
export const HIDDEN_INTRO_TELEGRAM_URL = "https://t.me/<bot_username>?start=hidden_intro";
```

- [x] Add RU copy for the locked/menu state:
  - locked title: `Скрытый урок`
  - locked action: `Получить доступ в Telegram`
  - placeholder text: `Урок скоро появится. Доступ будет открываться по ссылке из Telegram.`
- [x] Add EN fallback copy, even if the route remains RU-only, so TS usage stays typed.
- [x] Do not import this file into public Learn routes or SEO manifests.

Expected result: the site has a single source of truth for the hidden-intro route and localStorage key, but no user-visible course behavior changes yet.

## Task 4: Add A Safe Secret Route Placeholder

**Files:**
- Modify: `C:\Projects\opten-website\src\app\pages\space\PrivateCoursePage.tsx`
- Create or modify through small component boundary in: `C:\Projects\opten-website\src\app\components\space\learn\LearnComponents.tsx`

- [x] In `PrivateCoursePage.tsx`, special-case `lessonSlug === HIDDEN_INTRO_SLUG`.
- [x] If `HIDDEN_INTRO_VIDEO_ENABLED === false`, render a noindex placeholder page instead of redirecting to `/learn`.
- [x] On mount of that placeholder page, write `localStorage.setItem(HIDDEN_INTRO_UNLOCK_STORAGE_KEY, "1")`.
- [x] The placeholder must not call `/api/kinescope-course-token`, `course-access-summary`, `create-course-payment`, or any payment APIs.
- [x] The placeholder must show only course breadcrumb, title `Скрытый урок`, the “soon” copy, and a CTA back to the course root.
- [x] Paid users must not see any changed behavior in existing lesson routes.

Expected result: the secret URL can be opened from Telegram now, but because the video is missing, it only records the future unlock state and shows a harmless placeholder.

## Task 5: Add Optional Course Menu Slot Behind A Flag

**Files:**
- Modify: `C:\Projects\opten-website\src\app\components\space\learn\LearnComponents.tsx`
- Use: `C:\Projects\opten-website\src\content\space\hiddenIntro.ts`

- [x] Add a helper that reads `HIDDEN_INTRO_UNLOCK_STORAGE_KEY` after mount.
- [x] If `HIDDEN_INTRO_WEBSITE_SLOT_ENABLED === false`, render the course outline exactly as it works today.
- [x] If enabled later and localStorage flag is absent, show a non-lesson CTA row: `Скрытый урок — получить доступ в Telegram`.
- [x] If enabled later and localStorage flag is present, show a normal-looking accessible row: `Скрытый урок`, linking to `HIDDEN_INTRO_ROUTE`.
- [x] Do not include this row in `privateCourseCollection.lessons`; keep it as a UI-only synthetic row until the real video is ready.

Expected result: the future menu behavior is prepared but disabled by default, so current users are unaffected.

## Task 6: Add Verification Guardrails

**Files:**
- Create: `C:\Projects\opten-website\scripts\verify-hidden-intro.mjs`
- Modify: `C:\Projects\opten-website\package.json`
- Modify: `C:\Projects\opten-website\scripts\verify-kinescope-course.mjs` only if needed for a stable assertion boundary

- [x] Add `npm run verify:hidden-intro`.
- [x] Verify `HIDDEN_INTRO_WEBSITE_SLOT_ENABLED = false` and `HIDDEN_INTRO_VIDEO_ENABLED = false` for this first release.
- [x] Verify `hidden-intro` is not present in `api/_shared/kinescopeCourse.ts`.
- [x] Verify `hidden-intro` is not present in `privateCourseLessonConfigs`.
- [x] Verify `hidden-intro` is not present in `scripts/seo-routes.ts`, `src/content/space/learnSlugs.ts`, sitemap-related public route lists, or llms generation route lists.
- [x] Add `verify:hidden-intro` to local validation notes, but do not wire it into `npm run build` until the first implementation is stable.

Expected result: a future edit cannot accidentally expose the missing-video lesson as a real paid lesson or SEO route.

## Task 7: Manual Telegram Setup

**Files:**
- No repo file required unless adding operational docs.

- [x] Create or reuse the Telegram bot in BotFather.
- [ ] Add the bot as admin to the required Telegram channel so `getChatMember` can verify subscribers. Blocked in Telegram Web; use Telegram Desktop/mobile for `@v_voronezhtsev`.
- [x] Deploy `telegram-hidden-intro-webhook` from `C:\Projects\promptscore`.
- [x] Set webhook with Telegram `setWebhook`, passing the deployed function URL and `secret_token`.
- [ ] Test `/start`, subscribe button, failed check, successful check, and secret URL delivery. `/start`, subscribe button, and failed check are verified; successful check waits for channel admin access.

Expected result: the bot works as a front door before the real hidden lesson video exists.

## Task 8: Validation Before Merge

**Website commands:**

```powershell
cd C:\Projects\opten-website
npm run verify:hidden-intro
npm run verify:kinescope-course
npm run build
```

Expected:

```text
Hidden intro guardrails passed.
Kinescope private course integration artifacts are present.
vite build and prerender complete without TypeScript errors.
```

**Backend commands:**

```powershell
cd C:\Projects\promptscore\supabase\functions
deno check telegram-hidden-intro-webhook\index.ts
```

Expected: no Deno type errors.

**Browser checks:**

- Existing `/learn/courses/ai-content-marketing-2026` course root still renders.
- Existing lesson 1 still opens for an entitled paid user.
- Existing locked lessons still show purchase UI for a non-entitled user.
- `/learn/courses/ai-content-marketing-2026/hidden-intro` shows the placeholder and writes the localStorage flag.
- Public Learn, sitemap, llms, and SEO pages do not expose the hidden intro.

## Later Release: When The Video Exists

- Flip `HIDDEN_INTRO_VIDEO_ENABLED` only after the Kinescope video ID exists.
- Decide whether to make the video public-embed like the current course intro or server-gated like paid lessons.
- If the hidden intro should appear in the menu, flip `HIDDEN_INTRO_WEBSITE_SLOT_ENABLED`.
- At that point update `verify-hidden-intro.mjs` expectations deliberately, not accidentally.
- Keep the full paid course entitlement logic unchanged.
