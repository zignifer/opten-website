# Opten Space App Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Opten Space Beta to `/app`, add website-side Google/email auth, and read shared account credits from the extension-owned self-hosted Supabase backend without touching the extension UI.

**Architecture:** `/app/*` is a noindex SPA platform surface, not an SEO/prerendered content route. Website auth uses public Supabase Auth endpoints with the anon key only; account/credit state comes from a new `account-summary` Supabase Edge Function in `C:\Projects\promptscore`. Credits remain keyed by `auth.users.id`.

**Tech Stack:** Vite + React 18 + React Router 7 + Tailwind 4 on the website; Deno Supabase Edge Functions in `promptscore`; plain `fetch`, no `@supabase/supabase-js` in the website bundle.

---

### Task 1: Contract And SEO Boundaries

**Files:**
- Modify: `C:\Projects\opten-website\AGENTS.md`
- Modify: `C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md`
- Modify: `C:\Projects\opten-website\docs\ARCHITECTURE.md`
- Modify: `C:\Projects\opten-website\docs\CONTENT-AUTHORING.md`
- Run: `npm run sync:agents`

- [ ] **Step 1: Document `/app` as noindex app surface**

Add the durable rule that `/app/*` is SPA-only, excluded from sitemap/llms/prerender, and translated in-place with `localStorage.opten_lang_v3`.

- [ ] **Step 2: Document `account-summary`**

Update the integration contract Edge Functions table with `POST /account-summary`, authenticated by Bearer JWT and returning account, plan, status, and credits.

- [ ] **Step 3: Sync Claude mirror**

Run: `npm run sync:agents`

Expected: `Synced CLAUDE.md from AGENTS.md`

### Task 2: Account Summary Backend

**Files:**
- Create: `C:\Projects\promptscore\supabase\functions\account-summary\summary.ts`
- Create: `C:\Projects\promptscore\supabase\functions\account-summary\summary.test.ts`
- Create: `C:\Projects\promptscore\supabase\functions\account-summary\index.ts`

- [ ] **Step 1: Write failing Deno tests for entitlement summary**

Tests must cover:
- live active Pro returns `remaining = 300 - used`
- unexpired cancelled Pro still returns Pro
- expired latest subscription returns Free with `remaining = 0`
- `past_due` with future `expires_at` still returns Pro
- Free user displays limit `300` and remaining `0`

Run: `cd C:\Projects\promptscore\supabase\functions; deno test account-summary\summary.test.ts`

Expected before helper exists: module import failure.

- [ ] **Step 2: Implement pure summary helper**

Implement `resolveAccountSummary(input)` and export constants/types. Keep service-role DB reads out of the helper.

- [ ] **Step 3: Run helper tests**

Run: `cd C:\Projects\promptscore\supabase\functions; deno test account-summary\summary.test.ts`

Expected: all tests pass.

- [ ] **Step 4: Implement Edge Function**

Use `_shared/auth.ts` for local dual-issuer JWT verification, `_shared/cors.ts` for CORS, and a service-role Supabase client inside the handler. Return JSON only. No service role key in website code.

### Task 3: Website Auth Client And Account Context

**Files:**
- Create: `C:\Projects\opten-website\src\lib\optenAuth.ts`
- Create: `C:\Projects\opten-website\src\app\components\space\SpaceAuthProvider.tsx`

- [ ] **Step 1: Extend website verification script first**

Add static checks for `src/lib/optenAuth.ts`, `SpaceAuthProvider`, `/app` routes, `/app/:path*` noindex, and no remaining primary `/space/learn` route ownership.

Run: `npm run verify:space-learn`

Expected before implementation: fail on missing auth files/routes.

- [ ] **Step 2: Implement Supabase Auth REST helpers**

Add helpers for:
- `startGoogleLogin(redirectTo)`
- `sendMagicLink(email, redirectTo)`
- `readSession()`
- `storeSessionFromUrl(url)`
- `refreshSessionIfNeeded()`
- `signOut()`
- `fetchAccountSummary(token)`

Use `localStorage` key `opten_space_session_v1`. Keep only public Supabase URL/anon key in the bundle.

- [ ] **Step 3: Implement SpaceAuthProvider**

Load session on mount, refresh when close to expiry, call `account-summary`, expose `{ session, account, status, error, signOut, refresh }`.

### Task 4: `/app` Routes, Header, Login, And Learn Move

**Files:**
- Modify: `C:\Projects\opten-website\src\main.tsx`
- Create: `C:\Projects\opten-website\src\app\pages\space\AppIndexPage.tsx`
- Create: `C:\Projects\opten-website\src\app\pages\space\AppLoginPage.tsx`
- Create: `C:\Projects\opten-website\src\app\pages\space\AppAuthCallbackPage.tsx`
- Modify: `C:\Projects\opten-website\src\app\components\space\SpaceHeader.tsx`
- Modify: `C:\Projects\opten-website\src\app\components\space\learn\LearnComponents.tsx`
- Modify: `C:\Projects\opten-website\src\app\pages\space\LessonDetailPage.tsx`
- Modify: `C:\Projects\opten-website\vercel.json`
- Modify: `C:\Projects\opten-website\public\robots.txt`

- [ ] **Step 1: Add `/app` route family**

Routes:
- `/app` redirects to `/app/learn`
- `/app/login`
- `/app/auth/callback`
- `/app/learn`
- `/app/learn/:lessonSlug`

Keep `/space/learn` and `/space/learn/:lessonSlug` as temporary redirects to `/app/learn` so current local links do not 404.

- [ ] **Step 2: Update Space navigation**

Header logo points to `/app/learn`. Learn tab points to `/app/learn`. Extension points to `/`. Library points to `/prompt-library`.

- [ ] **Step 3: Render real account state**

Header shows:
- signed-out: `Войти` / `Sign in`
- loading: muted credit placeholder
- signed-in Free: `0/300`
- signed-in Pro: `<remaining>/300`
- account email in the account affordance

- [ ] **Step 4: Add login page**

Russian/English copy uses `useLang()` rather than SEO route prefix. Google button redirects to Supabase OAuth. Email form sends a magic link and shows a check-email state.

- [ ] **Step 5: Add auth callback**

Parse Supabase hash params, store session, clear URL token fragment, redirect to `/app/learn`.

### Task 5: Verification

**Files:**
- Modify: `C:\Projects\opten-website\scripts\verify-space-learn.mjs`

- [ ] **Step 1: Run static website verification**

Run: `npm run verify:space-learn`

Expected: pass.

- [ ] **Step 2: Run backend helper tests**

Run: `cd C:\Projects\promptscore\supabase\functions; deno test account-summary\summary.test.ts`

Expected: pass.

- [ ] **Step 3: Run website build**

Run: `npm run build`

Expected: pass. Existing dynamic/static import warnings for model content are acceptable if unchanged.

- [ ] **Step 4: Browser verification**

Open `http://127.0.0.1:5175/app/learn` in the in-app browser. Check that `/app/learn` renders Learn, `/space/learn` redirects, header account state is coherent, and `/app/login` renders Google/email options.
