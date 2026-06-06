# Unified Website Auth Design

## Goal

Make opten.space usable without the Chrome extension for login, payment, and subscription management, while preserving every shipped extension route and message flow.

## Product Decision

The website becomes a first-class account surface. Users can sign in at `/login`, pay at `/pay`, manage the plan at `/account`, and later spend credits inside web products such as courses. The Chrome extension remains the primary shipped product, but it is no longer required for website billing or account management.

Course/Learn navigation is hidden for now because the Learn product is not launch-ready. The `/app/learn` routes can remain live for internal/direct testing, but the global header must not advertise them.

## Architecture

Website auth uses the existing public Supabase Auth REST helpers in `src/lib/optenAuth.ts` and the existing `localStorage.opten_space_session_v1` session. The same website session is used by `/login`, `/pay`, `/account`, and `/app/*`.

Subscription and credit authority stays server-side. Website surfaces read account state through the extension-owned `account-summary` Edge Function in `C:\Projects\promptscore`. Payment and cancellation mutations still happen through extension-owned Edge Functions with a verified user JWT.

The extension integration remains backward compatible. Existing extension users opening `/pay`, `/account`, or `/dashboard/download-skill` can still be served through `GET_AUTH_TOKEN` fallback when no website session exists. No `ps_*` storage keys are renamed, and no extension binary route is removed.

## Routes

`/login` is the canonical public website login route. It is SPA-only and noindex.

`/app/login` redirects to `/login` or renders the same login component as a compatibility alias. This keeps existing local links and previously shipped beta URLs from breaking.

`/app/learn` and `/app/learn/:lessonSlug` stay registered but are hidden from navigation until Learn is ready.

Locked routes stay live:

- `/welcome`
- `/pay`
- `/success`
- `/account`
- `/dashboard/download-skill`
- `/prompt-library`

## Header

Use the Opten Space visual language for the global header: dark compact bar, logo, language toggle, credits, and profile/login affordance.

Do not include marketing navigation in the header. Marketing links remain available in the footer.

Signed-out state:

- Shows a `Login` / `Войти` action.
- Action points to `/login` with the current path as `next` where useful.

Signed-in state:

- Shows credits from `account-summary` as `<remaining>/<limit>`.
- Shows the account email/profile affordance.
- Profile click navigates to `/account`.
- Profile click must not sign out.

Logout is available only as an explicit account-page action.

## Login

The existing `/app/login` UI and logic are reused for `/login`, with copy adjusted from "Opten Space only" to the whole Opten account.

Google OAuth and email OTP both use the existing self-hosted Supabase Auth endpoints. The callback stores the website session under `opten_space_session_v1`.

After successful login:

- If `next` is present and is a safe same-origin path, redirect there.
- Otherwise redirect to `/account` for the global login route.
- The `/app/auth/callback` compatibility flow may still return to `/app/learn` when launched from app-only links.

## Payment

`/pay` token resolution order:

1. Refresh and use website session if present.
2. If absent, use extension `GET_AUTH_TOKEN` fallback.
3. If neither exists, show a login CTA and route to `/login?next=/pay`.

Payment uses the same `create-payment` and `create-payment-paddle` Edge Functions. Their existing preflight prevents orphan charges and duplicate active payments.

Already-Pro detection should prefer `account-summary` for website sessions and keep the old `get-subscription` fallback for extension tokens.

## Account

`/account` token resolution order:

1. Refresh and use website session if present.
2. If absent, use extension `GET_AUTH_TOKEN` fallback.
3. If neither exists, show a login CTA and route to `/login?next=/account`.

When using a website session, `/account` reads `account-summary`.

When cancelling from a website session, `/account` calls:

- `cancel-subscription-paddle` when `provider === "paddle"`
- `cancel-subscription` otherwise

Both functions already verify the Bearer JWT and operate on the authenticated user's subscription.

When using only an extension token, `/account` can keep the old `CANCEL_SUBSCRIPTION` message fallback so the extension can dispatch by `ps_sub_provider`.

Account page adds a visible sign-out button. Website sign-out clears only `opten_space_session_v1` and calls Supabase logout with the website access token. It must not send `SIGN_OUT` to the extension and must not clear extension `ps_*` storage.

## Cross-Account Behavior

Website and extension sessions are intentionally independent local sessions. If the user signs into the website as account A and the extension as account B, each surface reads the plan and credits for its own `auth.users.id`.

This is acceptable and safe because all entitlement is keyed by user id. The UI must show the active email clearly so users can match accounts when needed.

No automatic website-to-extension login handoff is included. A future handoff must use a short-lived server-issued code, not service-role secrets or copied refresh tokens.

## Documentation Updates

Update `AGENTS.md` first, then run `npm run sync:agents`.

Update:

- `docs/INTEGRATION-CONTRACT.md`
- `docs/ARCHITECTURE.md`
- `.planning/PROJECT.md` or active planning docs if needed

The contract should document `/login`, website-first `/pay` and `/account`, direct website cancellation, and the independent-session rule.

## Verification

Required local checks:

- `npm run verify:space-learn`
- targeted static verification for unified auth/header behavior
- `npm run build`
- browser checks for `/`, `/pay`, `/login`, `/account`, `/app/learn`

Browser checks should verify that the global header has no marketing nav, that Learn is not shown as a nav item, and that profile navigation goes to `/account` rather than signing out.

## Out Of Scope

- Automatic login sync from website to extension.
- Extension storage changes.
- New Edge Function schemas.
- Indexing `/app/*` or `/login`.
- Shipping Learn/Courses navigation before the product is ready.
