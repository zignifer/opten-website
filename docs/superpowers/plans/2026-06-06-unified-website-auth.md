# Unified Website Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/login`, `/pay`, `/account`, and the global header work from a website Supabase session first, without requiring the Chrome extension, while keeping extension fallback compatibility.

**Architecture:** The existing `SpaceAuthProvider` becomes the global website auth provider. Site surfaces use `account-summary` for account/credit state, payment Edge Functions for checkout, and cancel Edge Functions directly when the user is signed in on the website. Extension `GET_AUTH_TOKEN` and `CANCEL_SUBSCRIPTION` stay as fallback paths only.

**Tech Stack:** Vite 6, React 18, React Router 7, TypeScript, Tailwind 4, plain `fetch` to self-hosted Supabase Auth/Functions, no `@supabase/supabase-js` in the website bundle.

---

### Task 1: Verification Gates

**Files:**
- Create: `C:\Projects\opten-website\scripts\verify-unified-auth.mjs`
- Modify: `C:\Projects\opten-website\package.json`
- Modify: `C:\Projects\opten-website\scripts\verify-space-learn.mjs`

- [ ] **Step 1: Add a failing static verification script**

Create `scripts/verify-unified-auth.mjs` with checks for:

- `main.tsx` registers `/login` and `/auth/callback`.
- `main.tsx` wraps the whole routed app in `SpaceAuthProvider`.
- `vercel.json` rewrites and noindexes `/login`, `/auth/callback`, and `/app/*`.
- `SiteHeader.tsx` uses `useSpaceAuth`, links signed-in profile to `/account`, links signed-out action to `/login`, and does not import/render hamburger marketing navigation.
- `SpaceHeader.tsx` no longer advertises `Learn` in `navItems`.
- `PayPage.tsx` imports `useSpaceAuth` and `refreshSessionIfNeeded`.
- `AccountPage.tsx` imports `useSpaceAuth`, `fetchAccountSummary`, and `signOut`.
- `AccountPage.tsx` contains direct `cancel-subscription-paddle` and `cancel-subscription` calls.
- `AppLoginPage.tsx` supports a safe `next` redirect and no longer hardcodes `/app/learn` as the only post-login destination.

- [ ] **Step 2: Add npm script**

Add:

```json
"verify:unified-auth": "node scripts/verify-unified-auth.mjs"
```

- [ ] **Step 3: Run RED check**

Run:

```powershell
npm run verify:unified-auth
```

Expected: FAIL because `/login`, global provider wrapping, header changes, and account direct cancellation do not exist yet.

- [ ] **Step 4: Update the Learn verifier**

Change `scripts/verify-space-learn.mjs` so it no longer requires a visible Learn nav item. It should require that `/app/learn` routes still exist, but that `SpaceHeader.tsx` does not include `label: "Learn"` in visible nav items.

### Task 2: Global Website Auth Routes

**Files:**
- Modify: `C:\Projects\opten-website\src\main.tsx`
- Modify: `C:\Projects\opten-website\scripts\entry-server.tsx`
- Modify: `C:\Projects\opten-website\src\app\pages\space\AppLoginPage.tsx`
- Modify: `C:\Projects\opten-website\src\app\pages\space\AppAuthCallbackPage.tsx`
- Modify: `C:\Projects\opten-website\src\lib\optenAuth.ts`
- Modify: `C:\Projects\opten-website\vercel.json`

- [ ] **Step 1: Wrap the whole app in `SpaceAuthProvider`**

Import `SpaceAuthProvider` eagerly in `main.tsx` and `entry-server.tsx`. Wrap `<ScrollToTop />`, `<AnnouncementBar />`, and `<Routes>` in `<SpaceAuthProvider>`.

Remove route-local `<SpaceAuthProvider>` wrappers from `/app/*` routes.

- [ ] **Step 2: Add canonical routes**

Add routes:

```tsx
<Route path="/login" element={<AppLoginPage />} />
<Route path="/auth/callback" element={<AppAuthCallbackPage />} />
```

Keep:

```tsx
<Route path="/app/login" element={<Navigate to="/login?next=/app/learn" replace />} />
<Route path="/app/auth/callback" element={<AppAuthCallbackPage />} />
```

- [ ] **Step 3: Add safe next helpers**

Add to `src/lib/optenAuth.ts`:

```ts
export function normalizeSafeNext(value: string | null | undefined, fallback = "/account"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.startsWith("/auth/") || value.startsWith("/app/auth/")) return fallback;
  return value;
}

export function getWebsiteAuthCallbackUrl(next?: string | null): string {
  if (typeof window === "undefined") return "https://opten.space/auth/callback";
  const url = new URL(`${window.location.origin}/auth/callback`);
  const safeNext = normalizeSafeNext(next, "");
  if (safeNext) url.searchParams.set("next", safeNext);
  return url.toString();
}
```

Keep `getAppAuthCallbackUrl()` for compatibility.

- [ ] **Step 4: Make login route generic**

In `AppLoginPage.tsx`:

- Read `next` from `useLocation().search`.
- Use `normalizeSafeNext(next, "/account")`.
- When already signed in, navigate to safe next.
- Call `startGoogleLogin(getWebsiteAuthCallbackUrl(safeNext))`.
- Call `sendEmailOtp(normalized, getWebsiteAuthCallbackUrl(safeNext))`.
- After `verifyEmailOtp`, navigate to safe next.
- Update copy from "Opten Space" to "Opten account" / "аккаунт Opten".

- [ ] **Step 5: Make callback route respect next**

In `AppAuthCallbackPage.tsx`:

- Read `next` from the callback URL search params before calling `storeSessionFromUrl`.
- Normalize it with `normalizeSafeNext`.
- Replace browser history to `window.location.pathname`.
- Navigate to safe next.
- On error, navigate back to `/login?next=<safeNext>`.

- [ ] **Step 6: Add Vercel rewrite/noindex**

Add rewrites:

```json
{ "source": "/login", "destination": "/index.html" },
{ "source": "/auth/callback", "destination": "/index.html" }
```

Add noindex headers for:

```json
"/login"
"/login/:path*"
"/auth/:path*"
```

### Task 3: Global Header

**Files:**
- Modify: `C:\Projects\opten-website\src\app\components\SiteHeader.tsx`
- Modify: `C:\Projects\opten-website\src\app\components\space\SpaceHeader.tsx`

- [ ] **Step 1: Remove marketing hamburger from `SiteHeader`**

Remove `Menu`, `X`, open state, outside-click behavior, and the dropdown marketing nav from `SiteHeader.tsx`.

Keep only:

- Logo centered/left according to the compact Space visual language.
- Language toggle.
- Credits chip.
- Account/login action.

- [ ] **Step 2: Read account state in `SiteHeader`**

Import:

```ts
import { LogIn, User } from "lucide-react";
import { useLocation } from "react-router";
import { useSpaceAuth } from "./space/SpaceAuthProvider";
```

Render:

- Loading credits: `...`
- Signed-in credits: `${account.remaining}/${account.limit}`
- Signed-out credits: `0/300`
- Signed-in profile link: `<LocalizedLink to="/account">`
- Signed-out login link: `<LocalizedLink to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}>`

No logout button appears in the header.

- [ ] **Step 3: Hide Learn in `SpaceHeader`**

Change `navItems` to contain only:

```ts
{ label: "Extension", icon: Chrome, to: "/" },
{ label: "Library", icon: Library, to: "/prompt-library" }
```

Remove `BookOpenCheck` import and the `Learn` label type.

- [ ] **Step 4: Make Space profile navigate instead of logout**

Change signed-in account button in `SpaceHeader.tsx` to a `LocalizedLink` to `/account`. Remove the direct `signOut()` click from the header.

### Task 4: Website-First `/pay`

**Files:**
- Modify: `C:\Projects\opten-website\src\app\pages\PayPage.tsx`

- [ ] **Step 1: Import website auth**

Import:

```ts
import { useSpaceAuth } from "../components/space/SpaceAuthProvider";
import { fetchAccountSummary, refreshSessionIfNeeded, readSession, type AccountSummary } from "../../lib/optenAuth";
```

- [ ] **Step 2: Add source-aware auth state**

Add:

```ts
type AuthSource = "website" | "extension" | null;
```

Track `authSource` alongside `token`, `email`, `sub`, and `extStatus`.

- [ ] **Step 3: Prefer website session**

On auth provider state:

- If `status === "signed_in"` and `session` exists, set token/email from website session, set `authSource = "website"`, set `extStatus = "ready"`, and map `account` into the local `Subscription` shape.
- If `status === "signed_out"` or `"error"`, run existing extension detection.
- Keep hash token support as extension fallback.

- [ ] **Step 4: Replace no-extension payment UX**

For no token states, show login CTA instead of Chrome Store install requirement:

```tsx
<LocalizedLink to="/login?next=/pay">...</LocalizedLink>
```

Keep extension-specific copy only as secondary fallback text when extension is present but not logged in.

- [ ] **Step 5: Keep payment handlers unchanged except token source**

`handlePayRub` and `handlePayUsd` continue using `token`. No provider secret or service role key enters the bundle.

### Task 5: Website-First `/account`

**Files:**
- Modify: `C:\Projects\opten-website\src\app\pages\AccountPage.tsx`

- [ ] **Step 1: Import website auth**

Import:

```ts
import { useNavigate } from "react-router";
import { useSpaceAuth } from "../components/space/SpaceAuthProvider";
import { fetchAccountSummary, signOut as signOutWebsite, type AccountSummary } from "../../lib/optenAuth";
```

- [ ] **Step 2: Add source-aware account state**

Add:

```ts
type AuthSource = "website" | "extension" | null;
```

Track `authSource` and map `AccountSummary` to the local `Subscription` shape.

- [ ] **Step 3: Prefer website session**

When `useSpaceAuth()` reports signed in:

- Use `session.access_token`.
- Use `account.email` or `session.user.email`.
- Set `authSource = "website"`.
- Render `account.remaining/account.limit` in an account summary row.

When signed out or auth error, use existing extension detection fallback.

- [ ] **Step 4: Direct website cancellation**

In `handleCancel`, branch by `authSource`.

For website source:

```ts
const endpoint = sub?.provider === "paddle" ? "/cancel-subscription-paddle" : "/cancel-subscription";
await fetch(SUPABASE_FUNCTIONS_URL + endpoint, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + token,
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  },
});
```

On success, update local state to cancelled and call `refresh()` from `useSpaceAuth()`.

For extension source, keep existing `CANCEL_SUBSCRIPTION` fallback.

- [ ] **Step 5: Add website logout**

Add a separate account card/action:

- Label RU: `Выйти из аккаунта сайта`
- Label EN: `Sign out of website account`
- On click call `signOutWebsite(session?.access_token)` or `spaceAuth.signOut()`.
- Navigate to `/login?next=/account`.
- Do not call extension `SIGN_OUT`.

- [ ] **Step 6: Replace no-extension account UX**

If no website session and no extension token, show login CTA to `/login?next=/account`, not extension install instructions.

### Task 6: Docs And Contracts

**Files:**
- Modify: `C:\Projects\opten-website\AGENTS.md`
- Modify: `C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md`
- Modify: `C:\Projects\opten-website\docs\ARCHITECTURE.md`
- Run: `npm run sync:agents`

- [ ] **Step 1: Update `AGENTS.md` first**

Document:

- `/login` as canonical website login.
- `/pay` and `/account` as website-first, extension-fallback surfaces.
- `/account` direct website cancellation.
- Independent website/extension session rule.
- Learn/Courses nav hidden until ready.

- [ ] **Step 2: Update integration contract**

Update route table and Edge Function caller notes:

- `/login` SPA-only noindex.
- `/pay` may use website JWT or extension JWT.
- `/account` may call cancel functions directly with website JWT or fallback through extension.
- Cross-account behavior is expected and safe.

- [ ] **Step 3: Update architecture docs**

Update route map, billing flow, account flow, header section, and state summary.

- [ ] **Step 4: Sync Claude mirror**

Run:

```powershell
npm run sync:agents
```

Expected: exits 0 and updates `CLAUDE.md`.

### Task 7: GREEN Verification

**Files:**
- No new files beyond previous tasks.

- [ ] **Step 1: Static checks**

Run:

```powershell
npm run verify:unified-auth
npm run verify:space-learn
```

Expected: both pass.

- [ ] **Step 2: Build**

Run:

```powershell
npm run build
```

Expected: exit 0.

- [ ] **Step 3: Browser verification**

Start dev server:

```powershell
npm run dev -- --host 127.0.0.1
```

Open with the in-app Browser:

- `http://127.0.0.1:5173/`
- `http://127.0.0.1:5173/login`
- `http://127.0.0.1:5173/pay`
- `http://127.0.0.1:5173/account`
- `http://127.0.0.1:5173/app/learn`

Verify:

- Header has no hamburger marketing nav.
- Header has no Learn/Courses tab.
- Signed-out profile action points to `/login`.
- `/login?next=/account` preserves the destination through email/Google flows.
- `/pay` shows website login CTA when no session/token exists.
- `/account` shows website login CTA when no session/token exists.
- `/app/learn` remains reachable directly but not advertised in nav.

- [ ] **Step 4: Review diff**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; changed files match this plan.
