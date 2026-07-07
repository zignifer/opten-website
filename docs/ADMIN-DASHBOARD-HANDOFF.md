# Admin Dashboard Handoff - 2026-07-07

## Goal

Build a small protected owner admin surface on `opten.space` for acquisition and traffic-channel operations.

The first module is Telegram hidden intro:

- view funnel stats;
- view lead/claim/payment aggregates;
- publish Telegram bot broadcasts;
- send optional image + text as one Telegram post;
- keep room for future channels beyond Telegram.

This must be a general `/admin/*` surface, not a one-off `/admin/telegram` architecture.

## Current Repo State

Use these commits as the fresh baseline:

- `C:\Projects\opten-website` main: `702ee05 docs: refresh Telegram funnel context`
- `C:\Projects\promptscore-main-publish` main: `a7ba760 docs: refresh Telegram funnel context`
- Telegram funnel implementation already live from earlier commits:
  - website: `3550ff7 Add Telegram course discount claim UI`
  - backend: `32149ed Add Telegram hidden intro funnel`
  - backend hotfix: `f71f313 Fix USD Telegram claim quote`

Important local note:

- `C:\Projects\promptscore-main-publish` is the clean backend/extension main worktree used for the pushed Telegram work.
- `C:\Projects\promptscore` has pre-existing dirty local state from older work. Do not reset or mix it into admin work unless the owner explicitly asks.

## Must Read First

Website repo:

- `AGENTS.md`
- `docs/INTEGRATION-CONTRACT.md`
- `docs/ARCHITECTURE.md`
- `docs/TECH.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`

Backend/extension repo:

- `AGENTS.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `supabase/functions/telegram-hidden-intro-*`
- `supabase/functions/_shared/telegram-funnel.ts`
- `supabase/functions/_shared/course-discount-claims.ts`
- `supabase/migrations/20260707164000_telegram_hidden_intro_funnel.sql`

Skills/process to use in a new context:

- Use `superpowers:brainstorming` before implementation if design is not yet approved.
- Use `supabase:supabase` for any Auth, RLS, Edge Function, Storage, migration, or cron work.

## Existing Telegram Funnel

Live Supabase Edge Functions on `https://supabase.opten.space/functions/v1/*`:

- `telegram-hidden-intro-webhook`
- `telegram-hidden-intro-opened`
- `telegram-hidden-intro-stats`
- `telegram-hidden-intro-broadcast`
- `telegram-hidden-intro-reminders`
- modified `create-course-payment`

Main tables:

- `telegram_hidden_intro_leads`
- `telegram_hidden_intro_events`
- `course_discount_claims`
- `course_orders`
- `course_entitlements`
- `course_promo_codes`

Current behavior:

- Bot stores users who press `/start`.
- Bot checks Telegram channel subscription via Bot API `getChatMember`.
- Bot grants hidden intro link with `?claim=...`.
- Website reports lesson open to `telegram-hidden-intro-opened`.
- Claim discount lasts 24h and has priority over manual promo codes.
- While claim is active, website hides promo-code input.
- Provider webhooks mark claim as used after successful payment.
- Broadcast/reminders skip blocked leads and buyers where implemented.

Verified live before handoff:

- Bot `@opten_space_bot` `/start codexqa` works.
- Subscription verification gives hidden intro claim link.
- Production claim page showed RUB `1794` from `2990`.
- USD quote showed `$24.60` from `$41`.
- Claim overrides manual `FREE` promo in quote-only flow.
- Stats endpoint returned expected first-test counts.
- No real payment was created as part of verification.

## Current Security Findings

RLS is enabled for:

- `telegram_hidden_intro_leads`
- `telegram_hidden_intro_events`
- `course_discount_claims`

There are no public RLS policies for these tables.

However, live inspection found broad default table grants to `anon` and `authenticated`. Because RLS has no policies, rows should still be blocked through Data API, but this should be tightened as defense in depth.

First backend migration should revoke direct table privileges:

```sql
revoke all on public.telegram_hidden_intro_leads from anon, authenticated;
revoke all on public.telegram_hidden_intro_events from anon, authenticated;
revoke all on public.course_discount_claims from anon, authenticated;
```

Create migrations with Supabase CLI, do not invent filenames manually:

```powershell
cd C:\Projects\promptscore-main-publish
npx supabase migration new harden_telegram_hidden_intro_private_tables
```

Then deploy from the backend repo using the existing self-hosted Supabase workflow documented in `scripts/ops/SELF-HOSTED-SUPABASE-RUNBOOK.md`.

## Recommended Admin Architecture

Do this:

```text
Browser /admin
  -> website Supabase session from localStorage.opten_space_session_v1
  -> Vercel serverless /api/admin/*
  -> verify Supabase JWT with SUPABASE_JWT_SECRET
  -> check server-side owner allowlist
  -> call extension-owned Supabase Edge Function with server-only admin secret
  -> return aggregated stats / accepted job result to browser
```

Do not do this:

- Do not put `TELEGRAM_ADMIN_SECRET` in frontend env vars.
- Do not put bot token in frontend code.
- Do not put service-role key in frontend code.
- Do not call private Telegram tables directly from browser PostgREST.
- Do not use user-editable `user_metadata` for admin authorization.

Suggested Vercel env vars:

- `OPTEN_ADMIN_USER_IDS` - comma-separated `auth.users.id` allowlist.
- `OPTEN_ADMIN_EMAILS` - optional secondary allowlist.
- `TELEGRAM_ADMIN_SECRET` - server-only secret used by `/api/admin/*` to call Telegram service endpoints.

Admin authorization should be based on server-verified JWT `sub`, preferably `auth.users.id`.

## Website Files Likely To Add

Suggested shape:

```text
api/
  admin.ts or admin/
    telegram-stats.ts
    telegram-broadcast.ts
  _shared/
    adminAuth.ts

src/
  app/pages/admin/
    AdminDashboardPage.tsx
    AdminLoginGate.tsx
    AdminTelegramPanel.tsx
  lib/
    adminApi.ts
```

Route:

- `/admin`
- optional future nested routes can be UI tabs rather than route explosion.

Vercel:

- add `/admin/:path*` rewrite to `spa.html`;
- add `X-Robots-Tag: noindex, nofollow` for `/admin/:path*`.

## Admin UX MVP

First screen:

- compact dashboard shell;
- cards: Start, subscribed, access granted, hidden lesson opened, checkout created, paid, blocked, active claims;
- funnel row/table;
- generated_at timestamp;
- refresh button;
- auto refresh every 30-60 seconds while open.

Telegram broadcast composer:

- segment selector:
  - all;
  - subscribed;
  - access_granted;
  - access_granted_not_paid;
- text;
- optional image;
- optional button text + URL;
- dry-run preview first;
- final confirmation with exact recipient count.

For image + text as one post:

- Use Telegram `sendPhoto` with `caption`.
- Caption limit is 1024 chars.
- Photo limit is 10MB in Telegram Bot API; use a stricter admin limit such as 5MB.
- If text exceeds caption limit and image is present, block send with a clear UI error. Do not silently split into two messages.

## Broadcast Backend Notes

Existing `telegram-hidden-intro-broadcast` supports:

```json
{
  "text": "...",
  "photo_url": "...",
  "button_text": "...",
  "button_url": "...",
  "segment": "all|subscribed|access_granted|access_granted_not_paid",
  "limit": 5000,
  "dry_run": true
}
```

Limitations for admin MVP:

- It accepts `photo_url`, not uploaded files.
- It sends sequentially with a delay.
- It marks 403/blocked leads.
- It records `broadcast_sent` / `broadcast_failed` events.
- It does not yet persist full broadcast job objects/cancel/retry state.
- It does not yet handle Telegram `429 retry_after` specially.

Recommended phases:

1. Use existing endpoint for read-only stats + dry-run.
2. Add safe upload path or private storage if image upload is required immediately.
3. Add `telegram_broadcasts` / `telegram_broadcast_recipients` tables only when job history/cancel/retry is needed.
4. Add `retry_after` handling before large broadcasts.

## Daily Stats

Do not use realtime for v1 admin.

Recommended:

- Admin page polling every 30-60 seconds while open.
- Daily snapshot at 10:00 Yekaterinburg = 05:00 UTC.
- Store snapshots in a future `telegram_hidden_intro_daily_stats` table or send owner Telegram summary first.
- For self-hosted setup, VPS cron is simpler than building a complex scheduler first.

## Complexity Assessment

Overall: medium.

Why:

- React UI is straightforward.
- Existing website auth and Vercel JWT verifier already exist.
- Existing Telegram stats/broadcast endpoints already exist.
- Main risk is security boundary and operational safety for broadcasts.

Recommended implementation phases:

1. Security hardening migration + live verification.
2. Website server-side admin auth helper and protected `/admin` shell.
3. Read-only Telegram stats panel.
4. Broadcast dry-run and text-only send through server proxy.
5. Image upload/sendPhoto support.
6. Broadcast job persistence, retry_after handling, daily snapshots.

## Verification Commands

Website:

```powershell
cd C:\Projects\opten-website
npm run sync:agents
npm run build
```

Backend function checks:

```powershell
cd C:\Projects\promptscore-main-publish
npx supabase --version
```

Use existing repo docs/runbooks before deploying to self-hosted Supabase.

## Security Checklist For Implementation

- `git diff --check` clean in both repos.
- `AGENTS.md` updated first for durable architecture changes.
- `CLAUDE.md` mirrored after `AGENTS.md`.
- No service-role key in browser bundle.
- No Telegram admin secret in browser bundle.
- No bot token in browser bundle.
- No raw lead table access from browser.
- No admin authorization based on `user_metadata`.
- Admin route noindex in `vercel.json`.
- Admin API verifies JWT server-side.
- Admin API checks owner allowlist server-side.
- Broadcast final send requires explicit confirmation after dry-run recipient count.
- Image uploads reject SVG/HTML and oversized files.
- Telegram blocked users are marked blocked and skipped later.

## First Practical Task In New Context

Start with this order:

1. Pull latest `main` in `C:\Projects\opten-website`.
2. Pull latest `main` in `C:\Projects\promptscore-main-publish`.
3. Read this file, `AGENTS.md`, and `docs/INTEGRATION-CONTRACT.md`.
4. Create a short approved design for `/admin`.
5. Implement Phase 1 only: security hardening migration + admin auth proxy skeleton + read-only `/admin` shell.

Do not start with broadcast send. Get the admin security boundary correct first.
