# Integration Contract — opten.space ↔ Opten Chrome Extension

> **Status:** LOCKED. This document is the authoritative interface between the site
> (`C:\Projects\opten-website`) and the extension (`C:\Projects\promptscore`).
> Any change here is a breaking change for the other side and must be coordinated.
>
> **Last sync:** 2026-07-19 against extension `manifest.json` version **1.4.2** (post-v2.8 milestone — Self-Hosted Supabase Migration completed; Phase 88 cutover done 2026-05-25; Phase 89 daily encrypted backups + monitoring shipped 2026-05-28; Phase 91 prompt-library schema/route contract added and launched in visible site navigation on 2026-06-02; Phase 92 extension context-menu save contract added; Phase 93 extension context-menu insert contract added in-tree; Phase 94 site-triggered prompt-library cache refresh added; Phase 95 Opten Space `/app/*` website-auth + `account-summary` backend surface documented; Phase 96 shared website login, website-first `/pay` + `/account`, and direct website cancellation documented; Phase 97 prompt-library free access for authenticated extension accounts documented; Phase 98 public Prompt Library snapshot route/RPC contract documented; Phase 99 visible auth switched to Email OTP/manual email entry only while retaining hidden Google OAuth architecture; the landing Prompt Workbench now mirrors the extension popup's authenticated quick-Improve model list and promptscore-proxy Claude Haiku transport; new Free accounts receive 3 one-time signup credits from `users.free_signup_credits` while existing Free accounts remain unchanged; score/rewrite accounting now uses service-role-only atomic reserve/release RPCs and never trusts client billing flags; standalone course checkout/access, Kinescope course playback, Telegram discount-only course funnel with direct `/start` offer delivery, one-time-per-lead Telegram 24h 20% discount claims, course-or-Pro Opten generators, owner service endpoints, Telegram broadcast history/deletion, and Telegram broadcast image uploads documented). Backend fully on self-hosted `supabase.opten.space`; manifest carries `https://supabase.opten.space/*` in `host_permissions` and the cloud `*.supabase.co` host was **removed** in v1.3.7. Dual-issuer local JWT verification handles cloud **ES256/JWKS** + self-hosted **HS256**.
> **Extension repo:** [zignifer/promptscore](https://github.com/zignifer/promptscore) (private).
> **Source of truth for the extension side:**
> - [`manifest.json`](../../promptscore/manifest.json) — `externally_connectable` block
> - [`background/background.js`](../../promptscore/background/background.js) — `onMessageExternal` handler (lines ~1002-1084), cross-issuer token guard at `clearAuthState()` (~L263) + token-refresh path (~L405-414) — invalidates stale cloud tokens carried over from pre-Phase-88 sessions
> - [`supabase/functions/`](../../promptscore/supabase/functions/) — Edge Functions

---

## 0. Post-v2.8 cutover note (2026-05-25 → 2026-05-28)

Extension milestone **v2.8 — Self-Hosted Supabase Migration** completed 2026-05-28. Impact on this contract:

1. **Supabase base URL changed** from `https://vuywydhwkqmihfztpkgl.supabase.co` to `https://supabase.opten.space` (see §4). Site-side source files were updated in lockstep with the extension cutover — verified in [`api/download-skill.ts`](../api/download-skill.ts), [`src/app/pages/PayPage.tsx`](../src/app/pages/PayPage.tsx), and [`src/app/pages/AccountPage.tsx`](../src/app/pages/AccountPage.tsx). The cloud project is now a frozen cold backup, not an active backend.
2. **Anon key is unchanged.** The self-hosted GoTrue reuses the same `JWT_SECRET` as the cloud project, so the existing `SUPABASE_ANON_KEY` (issuer `ref: vuywydhwkqmihfztpkgl` baked into the JWT payload) is still accepted by self-hosted Kong. No site-side key rotation required.
3. **Dual-issuer JWT reality.** Cloud-issued user tokens (legacy, ES256, verified via cloud JWKS) and self-hosted-issued tokens (HS256, verified via the shared `JWT_SECRET`) are both accepted by the site's local verifier (`api/download-skill.ts`) AND by self-hosted Edge Functions during the transition window. The extension's service worker additionally drops stale cloud tokens that no longer round-trip through `/auth/v1/user` — site code MUST NOT assume that a token received from `GET_AUTH_TOKEN` was just issued (it may be cloud-legacy and very close to extension-side invalidation).
4. **Edge Function request/response shapes are unchanged.** All 10 functions (see §4) behave the same to the caller — only the deploy target moved. No site-side code changes required beyond the base-URL constant.
5. **Extension `host_permissions` no longer includes the cloud URL.** Any future contract change that re-introduces a cloud-Supabase code path must also re-add the host to the extension's `manifest.json` and ship a new extension release.

---

## 1. Why this contract exists

The site and the extension are tightly coupled at four boundaries:

1. **`externally_connectable` messaging** — the only legal channel for the site to read auth/subscription state from the extension and to trigger subscription cancellation.
2. **Fixed URL paths** — the extension navigates the user to specific site routes on install (`/welcome`), upgrade (`/pay`), and after payment (`/success`). Renaming any of these silently breaks user flows.
3. **Supabase Edge Functions** — billing endpoints (`/create-payment*`, `/cancel-subscription*`, `/get-subscription`, `/account-summary`) are shared between the site and the extension. The site may initiate payment and cancellation with its own website JWT; the extension may still initiate the same operations through its own JWT. Schema changes require coordinated deploys.
4. **Storage keys (`ps_*`)** — `chrome.storage.local` is the extension's source of truth for plan/subscription state. The site reads (and in some flows updates) these keys indirectly via the message API. Renaming or removing a key is a breaking change.
5. **Website auth** — `/login`, `/auth/callback`, `/pay`, `/account`, and `/app/*` can authenticate directly against the same self-hosted Supabase Auth using public GoTrue endpoints. Credits and plan state still come from extension-owned Supabase Edge Functions and remain keyed by `auth.users.id`, not by email.

**Working rule:** if you change anything that touches a section below, open
the extension repo first, propose the change there, and only then ship the
site side. Backward-compatible additions (new optional response fields, new
message types) are fine; renames and removals are not.

---

## 2. `externally_connectable` — message API

### 2.1 Allowed origins

The extension only accepts messages from `https://opten.space/*`.
Defined in [`manifest.json:59-61`](../../promptscore/manifest.json#L59-L61):

```json
"externally_connectable": {
  "matches": ["https://opten.space/*"]
}
```

The handler additionally validates the exact `sender.url` origin at runtime
([`background.js:2220-2230`](../../promptscore/background/background.js#L2220-L2230), tag `SEC-02`):

```js
function isTrustedExternalSender(sender) {
  return !!(sender && sender.url && new URL(sender.url).origin === 'https://opten.space');
}

if (!isTrustedExternalSender(sender)) {
  sendResponse({ error: true, message: 'Unauthorized origin' });
  return;
}
```

**Implication for the site:** the site MUST be served from `https://opten.space`. Local dev on `localhost:5173` can talk to the extension only if a dev-mode extension build adds the localhost origin to `externally_connectable.matches` — currently it does NOT. For local PayPage/AccountPage testing, deploy to a preview URL on `*.opten.space` or use the production extension while logged-in.

### 2.2 Known extension IDs (hardcoded on the site)

Both repos hardcode the IDs. Defined in:
- [`src/app/pages/PayPage.tsx`](../src/app/pages/PayPage.tsx) (`EXTENSION_IDS`)
- [`src/app/pages/AccountPage.tsx`](../src/app/pages/AccountPage.tsx) (`EXTENSION_IDS`)
- [`src/app/pages/DownloadSkillPage.tsx`](../src/app/pages/DownloadSkillPage.tsx) (`EXTENSION_IDS`)
- [`src/app/pages/PromptLibraryPage.tsx`](../src/app/pages/PromptLibraryPage.tsx) (`EXTENSION_IDS`)

```ts
const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",  // Chrome Web Store
  "kcmcaeenfmfnpiaihicecnfnagejpcog",  // Local dev (unpacked)
];
```

Site pages iterate the list and pick whichever responds first. If the CWS ID ever changes (re-upload as a new listing) — update **all four pages**.

### 2.3 Message types

The site is the **initiator** of every message; the extension only replies.
All five handlers are defined in the external message handler in [`background.js`](../../promptscore/background/background.js).

#### `GET_AUTH_TOKEN`

```ts
chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, (response) => {
  // response: { token: string, email: string } | { token: null, reason: string }
});
```

- Returns the current Supabase JWT, refreshing it if expired.
- `reason` is `'not_logged_in'` if the user has no token, `'error'` on storage/refresh failure.
- Site uses this for: (a) detecting "extension installed?", (b) passing the JWT to `create-payment*` Edge Functions, (c) auth-gating `/dashboard/download-skill`.

#### `GET_SUBSCRIPTION`

```ts
chrome.runtime.sendMessage(id, { type: "GET_SUBSCRIPTION" }, (response) => {
  // Pro/cancelled response:
  // {
  //   plan: 'pro' | 'cancelled',
  //   status: 'active' | 'cancelled' | null,
  //   expires_at: ISO8601 | null,
  //   auto_renew: boolean,
  //   card_last4: string | null,
  //   card_type: 'visa' | 'mastercard' | ... | null,
  //   has_card: boolean,
  //   limit: number,       // 300 for Pro
  //   remaining: number,
  // }
  //
  // Free response (same shape, mostly nulls):
  // {
  //   plan: 'free',
  //   status: null,
  //   expires_at: null,
  //   auto_renew: false,
  //   card_last4: null,
  //   card_type: null,
  //   has_card: false,
  //   limit: 300,          // Pro target display limit; Free remaining may be 3..0 signup credits
  //   remaining: number,
  // }
  //
  // Error: { error: 'storage_read_failed' }
});
```

**Field-level notes:**
- `plan === 'cancelled'` means the user cancelled but is still inside the paid period. **Treat it as Pro for access purposes only while `expires_at` is absent or in the future** (download skill, no upgrade nag). Once `expires_at` is in the past, clients must treat the user as Free even if the daily `expire-subscriptions` cleanup has not relabeled the row yet. This mirrors the Pro gate in [`api/download-skill.ts`](../api/download-skill.ts).
- `limit: 300` for Free is the product positioning: the denominator is the Pro target limit. Since 2026-07-13, newly created Free accounts get `remaining: 3` from `public.users.free_signup_credits`, then count down to `0/300` with no monthly refill. Existing Free accounts keep `0/300`. Server-side proxy keeps production `FREE_LIMIT=0` only as a legacy fallback; canonical Free entitlement is the user-row grant.
- Forward-compatibility rule: **the site MUST NOT assume the response is exhaustive.** Future fields may be added.

#### `CANCEL_SUBSCRIPTION`

```ts
chrome.runtime.sendMessage(id, { type: "CANCEL_SUBSCRIPTION" }, (response) => {
  // response: { success: true, expires_at: ISO8601 } | { error: string, message: string }
});
```

- Dispatches inside the extension based on `ps_sub_provider` storage key (`'yookassa'` → `cancel-subscription` Edge Function; `'paddle'` → `cancel-subscription-paddle`).
- Legacy users (created pre-Phase 67) with missing `ps_sub_provider` fall back to `'yookassa'`. Do not strip this fallback without a migration.
- Used only by [`AccountPage.tsx`](../src/app/pages/AccountPage.tsx).

#### `REFRESH_PROMPT_LIBRARY_CACHE`

```ts
chrome.runtime.sendMessage(id, { type: "REFRESH_PROMPT_LIBRARY_CACHE" }, (response) => {
  // response: { ok: boolean, error?: 'refresh_failed' }
});
```

- Used by [`PromptLibraryPage.tsx`](../src/app/pages/PromptLibraryPage.tsx)
  after successful Prompt Library `POST`/`PATCH`/`DELETE`/mark-used mutations.
- The site sends no prompt body, title, tags, row ID, snippet, or selected text.
  The response also returns no prompt data.
- The extension performs a forced refresh of its own bounded
  `ps_prompt_library_cache` from PostgREST with its stored Bearer JWT, rebuilds
  native context menus, and bypasses the normal context-menu `onShown` throttle.
- Failure is non-blocking for the site UI; the next context-menu/cloud refresh
  can still self-heal.

#### `WARMUP`

```ts
chrome.runtime.sendMessage(id, { type: "WARMUP" });
```

- Fire-and-forget. The extension may ignore (returns `false`).
- Pings the proxy `/api/score` `OPTIONS` endpoint to warm Vercel's cold start (5-min cooldown).
- The site does NOT currently use it. Reserved.

---

## 3. URL contract

The extension navigates the user to these site routes. The site MUST keep them
live with these exact paths and the documented behavior.

| Path | Trigger | Behavior expected | Code reference |
|------|---------|-------------------|----------------|
| `/welcome` | `chrome.runtime.onInstalled` (fresh install) | First-run greeting; explain how to pin extension + sign in. May upsell Pro. | [`background.js:9`](../../promptscore/background/background.js#L9) |
| `/login` | User/site navigation | Canonical website login for marketing, billing, account, and app surfaces. Visible UI uses Email OTP/manual email entry only and stores `localStorage.opten_space_session_v1`. Google OAuth helper code is retained but its button stays hidden unless explicitly re-enabled. SPA-only, `noindex,nofollow`, no `/en/*` sibling. | Site-only |
| `/auth/callback` | Supabase Auth redirect | Canonical website auth callback. Stores the website session and returns to safe `next=...`; never logs the extension in automatically. SPA-only, `noindex,nofollow`, no `/en/*` sibling. | Site-only |
| `/pay` | Popup "Upgrade" CTA → opens new tab; user/site navigation | Render PayPage with RU/EN price + checkout buttons (YooKassa or Paddle). Prefers website JWT from `/login`; falls back to extension `GET_AUTH_TOKEN` for already-shipped extension flows. | [`background.js:903`](../../promptscore/background/background.js#L903) |
| `/success` | YooKassa redirect after successful payment | Show success state, optionally autoclose tab. Used as `return_url` in [`create-payment/index.ts:65`](../../promptscore/supabase/functions/create-payment/index.ts#L65). | YooKassa `return_url` |
| `/account` | User/site navigation; optional popup link | Website-first subscription management UI. Prefers website JWT, reads `account-summary`, can call `cancel-subscription` / `cancel-subscription-paddle` directly, and offers website-only logout. Falls back to extension `GET_AUTH_TOKEN` / `CANCEL_SUBSCRIPTION` for compatibility. SPA-only, `noindex,nofollow`, no `/en/*` sibling. | n/a (user-driven) |
| `/dashboard/download-skill` | Pro-only feature in popup → opens new tab | Auth-gated page that calls `/api/download-skill` to fetch `opten.zip`. | [popup Phase 73](../../promptscore/popup/popup.html) |
| `/prompt-library` | User/site navigation once launched; extension context menu `Открыть библиотеку`; Phase 93 manual fallback after failed direct insert | Free prompt library UI for any logged-in extension account. Calls `GET_AUTH_TOKEN` through the installed extension, then uses Supabase PostgREST for `prompt_library` CRUD/search without a subscription check. After successful mutations it calls `REFRESH_PROMPT_LIBRARY_CACHE` so native extension menus do not keep stale titles/favorite state. SPA-only, `noindex,nofollow`, no `/en/*` sibling. Insert fallback never receives prompt body text in URL. | Phase 91 + Phase 94 + Phase 97 |
| `/p/:slug` | User-shared public Prompt Library link | Read-only random-link snapshot of a user's library at publish/refresh time. Public read uses `prompt_library_get_public_snapshot` without auth; per-prompt save uses website auth (`localStorage.opten_space_session_v1`) and `prompt_library_save_public_prompt`. SPA-only, `noindex,nofollow`, no `/en/*` sibling. No bulk-copy action. | Phase 98 |
| `/learn/courses/:courseSlug/*` | Public course marketing, checkout, and gated lessons | Officially launched standalone paid course surface. It is promoted from public Learn, blog CTAs, Telegram, and other marketing surfaces, while its SPA routes remain `noindex` under the current policy. It is not a Pro subscription entitlement and is not opened by the extension. Payment starts through `create-course-payment`; access is checked through website auth + `course-access-summary`; Kinescope playback is gated by this site's `/api/kinescope-course-token` and `/api/kinescope-course-auth`. All 16 lessons require a normal course entitlement; a Telegram claim carries only the 24-hour checkout discount and never unlocks playback. Private prompts remain buyer-only. The separate Opten ChatGPT + Claude/Codex generator block is visible before materials/showcase on the course root and every lesson: its links open for a course buyer or active Pro user, while other visitors see locked generator previews plus course and `/pay` CTAs. The explanatory generator description is hidden once access opens. The removed legacy `/hidden-intro` route may only redirect to lesson 1 while preserving the claim query. | Site-only |
| `/app/*` | User/site navigation for Opten Space Beta | Account-based app shell. Canonical namespace for Space Beta app surfaces. `/app/learn*` and `/space/learn*` are compatibility redirects to public `/learn*`; public Learn is no longer indexed inside `/app`. Website auth uses the canonical `/login`; visible login uses Email OTP only while the retained Google OAuth path is hidden. App routes are SPA-only, `noindex,nofollow`, and have no `/en/*` sibling; language switches in-place via `opten_lang_v3`. | Phase 95/96 |

**Locked route names** (renames are breaking):
- `/welcome`, `/pay`, `/success` — referenced by the extension binary that's
  already shipped to users. If you rename them, **users on old extension
  versions will hit 404** until they update. Don't.
- `/prompt-library` — fixed Phase 91 route for Prompt Library launch and
  Phase 93 extension context-menu "open library" / failed-insert fallback
  actions. Do not rename it; in-tree extension code now opens this route.
- `/app/*` is not yet opened by shipped extension binaries, but it is the
  canonical Opten Space Beta web-app namespace. Do not move the app back to
  `/space/*`; keep `/space/*` only as temporary redirect/backward compatibility.
- `/learn/courses/*` is site-only, officially launched, and intentionally linked
  from public site marketing. Keep it out of extension navigation; under the
  current SPA routing policy it remains noindex and outside sitemap/llms/EN
  sibling lists unless a separate SEO routing decision changes that policy.

> **Note (Phase 3 D-03b):** the site additionally emits `/en/pay` as an EN sibling of `/pay`.
> The extension does NOT navigate to `/en/pay` in current shipped versions; this is a site-side
> SEO addition only (EN search results → direct link → same Paddle checkout). See §6 for the
> Paddle SDK invariant that applies to this sibling.

---

## 4. Supabase Edge Functions — shared backend

All functions live in the **extension repo** at
[`C:\Projects\promptscore\supabase\functions\`](../../promptscore/supabase/functions/),
not here. Deploy via `npx supabase functions deploy <name>` from that repo.
The site only **calls** them; it does not own them.

| Endpoint | Caller | Auth | Notes |
|----------|--------|------|-------|
| `POST /create-payment` | Site (`PayPage` RU path) | Bearer JWT | YooKassa. Body: `{ recurring: boolean }`. Returns `{ confirmation_url }`. `return_url` is hardcoded to `https://opten.space/success`. The JWT may come from website auth or extension fallback. |
| `POST /create-payment-paddle` | Site (`PayPage` EN path) | Bearer JWT | Paddle. Returns `{ priceId, customerEmail, userId }`. Site then calls `Paddle.Checkout.open(...)`. The JWT may come from website auth or extension fallback. |
| `POST /create-course-payment` | Hidden Learn course page (`/learn/courses/ai-content-marketing-2026/*`) | Public anon + email | Standalone course checkout, not Pro. Body: `{ course_slug, email, return_url, currency?, promo_code?, discount_claim_token? }`. For promo/claim preview, body may be `{ course_slug, currency?, promo_code?, discount_claim_token?, quote_only: true }`; it validates the code/claim and returns `{ provider, amount_value, list_amount_value, discount_percent, promo_discount_percent?, promo_code?, discount_code?, discount_id?, discount_claim_active?, discount_claim_expires_at?, claim_discount_percent?, discount_source?, currency }` without creating `course_orders`, provider payments, incrementing promo usage, or marking claims used. `discount_claim_token` has priority over `promo_code` and must not stack. Normal `currency="RUB"` checkout returns YooKassa `{ confirmation_url, order_id, amount_value, list_amount_value, discount_percent, promo_discount_percent?, discount_claim_active?, discount_claim_expires_at?, claim_discount_percent?, discount_source?, currency }`; `currency="USD"` returns Paddle `{ provider:"paddle", price_id, order_id, customer_email, custom_data, amount_value, list_amount_value, discount_percent, promo_discount_percent?, discount_code?, discount_id?, discount_claim_active?, discount_claim_expires_at?, claim_discount_percent?, discount_source?, currency }`. Promo errors are `invalid_promo_code`, `promo_not_active`, `promo_not_configured`, or `promo_lookup_failed`; claim errors are `invalid_discount_claim`, `discount_claim_not_found`, `discount_claim_expired`, `discount_claim_used`, or `discount_claim_lookup_failed`. The checkout email becomes the entitlement email; no website login is required before payment. |
| `POST /telegram-hidden-intro-opened` | Telegram course offer analytics | Public anon + claim token | Legacy-named endpoint retained for deployment compatibility. Body: `{ discount_claim_token, validate_only? }`. It validates that the token belongs to the Telegram course funnel and returns `{ preview_access:false, discount_active:boolean }`. It never authorizes playback. Without `validate_only:true`, it marks the first offer open in the existing claim/lead fields and records the legacy analytics event. It does not grant a course entitlement, Pro state, private prompt access, lesson playback, or paid Opten generator access. |
| `GET/POST /telegram-hidden-intro-stats` | Owner/admin tooling | `X-Opten-Admin-Secret` | Service endpoint returning lead, claim, order, and event counts for the Telegram hidden intro funnel. Uses `TELEGRAM_ADMIN_SECRET` with fallback to `TELEGRAM_WEBHOOK_SECRET`. |
| `POST /telegram-hidden-intro-broadcast` | Owner/admin tooling | `X-Opten-Admin-Secret` | Manual bot broadcast endpoint. Body supports `{ text, photo_url?, button_text?, button_url?, segment?, limit?, dry_run? }`; segment is `all`, `subscribed`, `access_granted`, or `access_granted_not_paid`. Sends sequentially with a small delay, persists a `telegram_broadcasts` row plus per-recipient `message_id` values for non-dry-run sends, and marks Telegram 403/blocked users as blocked. Broadcasts are delivery-only: they never create, refresh, or extend `course_discount_claims`. Returns `{ broadcast_id, recipients, sent, blocked, failed }` for real sends. |
| `GET/POST /telegram-hidden-intro-broadcasts` | Owner/admin tooling | `X-Opten-Admin-Secret` | Broadcast history and delete endpoint. `GET` returns recent stored broadcast rows. `POST` with `{ action:"delete", broadcast_id }` calls Telegram `deleteMessage` for stored recipient `chat_id` + `message_id` pairs and updates recipient/broadcast delete counters. Only broadcasts sent after message ID persistence was added are reliably deletable, and Telegram's own message deletion limits still apply. |
| `GET/POST /telegram-hidden-intro-assets` | Owner/admin tooling + Telegram image fetch | `POST`: `X-Opten-Admin-Secret`; `GET`: random asset token | Broadcast image asset endpoint. `POST` accepts `{ file_name?, content_type, data_base64 }` from the owner-gated website proxy and stores a compressed JPG/PNG/WEBP in `telegram_broadcast_assets` with service-role access. It returns a random HTTPS URL. `GET ?token=...` serves the image bytes publicly by unguessable token so Telegram can fetch `sendPhoto` images. |
| `GET/POST /telegram-hidden-intro-reminders` | Cron/admin tooling | `X-Opten-Admin-Secret` | Sends 12h and 1h claim-expiration reminders for unused Telegram claims. Skips blocked leads and buyers, records `reminder_sent`, and marks blocked users on Telegram 403. |
| `POST /cancel-subscription` | Site (`/account`) or extension (via `CANCEL_SUBSCRIPTION`) | Bearer JWT | YooKassa cancellation. Website path calls directly with website JWT; extension fallback still dispatches through `CANCEL_SUBSCRIPTION`. |
| `POST /cancel-subscription-paddle` | Site (`/account`) or extension (via `CANCEL_SUBSCRIPTION`) | Bearer JWT | Paddle cancellation. Website path calls directly with website JWT; extension fallback still dispatches through `CANCEL_SUBSCRIPTION`. |
| `POST /get-subscription` | Site (optional) | Bearer JWT | Reads `subscriptions` table. Used as a fallback if the extension is not installed (rare path). |
| `POST /account-summary` | Site `/login` consumers, `/pay`, `/account`, `/app/*`, extension popup cache refresh | Bearer JWT | Reads the verified user's account, `users.free_signup_credits`, latest subscription, and `usage_logs` count using service role, then returns a single account/credit summary. No payment mutation. Response is the canonical source for `email`, `plan`, `status`, `limit`, `used`, `remaining`, `expires_at`, `provider`, `currency`, and card metadata. |
| `POST /course-access-summary` | Hidden Learn course page + `/api/kinescope-course-token` | Bearer website JWT | Reads/claims a standalone course entitlement for the verified user. If an active entitlement exists for the JWT email and has no `user_id`, the function binds it to `auth.users.id`. Returns `{ course_slug, has_access, status, email, granted_at }`. |
| `POST /webhook` | YooKassa | IP-whitelist | Provider-only. Updates `subscriptions` table with `provider='yookassa'`. |
| `POST /webhook-paddle` | Paddle | HMAC-SHA256 | Provider-only. Updates `subscriptions` table with `provider='paddle'`. |
| `POST /webhook-paddle-sandbox` | Paddle sandbox | HMAC-SHA256 | Provider-only. For E2E testing. |
| `POST /auto-renew` | Cron job | Service role | Provider-only. |
| `POST /expire-subscriptions` | Cron job | Service role | Provider-only. |

**Hardcoded constants on the site** (must match Supabase project):
- `SUPABASE_URL = "https://supabase.opten.space"` — self-hosted (Phase 88 cutover COMPLETE — this is the live primary backend; cloud `vuywydhwkqmihfztpkgl.supabase.co` is a frozen cold backup). `PayPage.tsx` / `AccountPage.tsx` use the derived `SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1"`.
- `SUPABASE_REST_URL = "https://supabase.opten.space/rest/v1"` — used by Prompt Library PostgREST/RPC helpers.
- `SUPABASE_ANON_KEY = "eyJ...A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg"` — **UNCHANGED** (JWT secret reused; self-hosted Kong accepts the same anon key). (see [`src/lib/optenAuth.ts`](../src/lib/optenAuth.ts), [`src/lib/promptLibraryApi.ts`](../src/lib/promptLibraryApi.ts), [`PayPage.tsx`](../src/app/pages/PayPage.tsx), [`AccountPage.tsx`](../src/app/pages/AccountPage.tsx), [`api/download-skill.ts`](../api/download-skill.ts))

**Token verification (Phase 87 / D-03, updated Phase 88):** the site (`api/download-skill.ts`) and the Edge Functions verify the user JWT **locally** (jose, dual-issuer allowlist: cloud + self-hosted). `supabase.auth.getUser()` / `/auth/v1/user` is no longer called — it performs a session lookup that rejects cloud-issued tokens on self-hosted (sessions not migrated, Phase 86). **Cloud migrated to ASYMMETRIC signing keys, so cloud-issued tokens are now ES256 — verified via the cloud JWKS (`/auth/v1/.well-known/jwks.json`); self-hosted GoTrue still signs HS256 with the shared secret.** The verifier branches by the token's `alg`: HS256 → shared secret, ES256 → cloud JWKS. Both issuers are accepted during the transition so old-extension tokens keep working (CLIENT-06). Edge `create-payment*` additionally run a server-side preflight (user-exists + not-already-Pro) before charging.

### 4.1 Standalone course purchases

Hidden Kinescope course `ai-content-marketing-2026` is a separate paid product:

- The site shows a standalone course offer controlled by the global website
  currency switcher. The public RUB base price is `2 990 ₽`; public discounts
  are not hard-coded in the website and must come from server-side promo codes
  (planned common campaigns: `-20%` and `-40%`). The current USD checkout still
  uses the configured course Paddle one-time price ID returned by the backend.
  This offer is not the Pro subscription and must not be surfaced through
  extension subscription state.
- A guest enters email on the course page and calls
  `POST /create-course-payment`; the function creates a `course_orders` row.
  RUB checkout creates a YooKassa payment with
  `metadata.kind = "course_purchase"`. USD checkout returns a Paddle `price_id`
  and `custom_data.kind = "course_purchase"` for `Paddle.Checkout.open(...)`.
- Internal test promo code `FREE` is server-normalized to uppercase and is not
  a public marketing coupon. It maps the course price to `100 ₽` for RUB and
  `$1` for USD. Paddle requires a separate `$1` one-time price ID; do not let
  the browser set arbitrary checkout amounts.
- Marketing/partner promo codes live in `course_promo_codes`, not in the
  browser. The table is RLS-enabled with no anon/authenticated policies; only
  Edge Functions with service-role validate codes. Codes are uppercase
  `A-Z0-9`, up to 32 chars, so the same code can be passed to Paddle as
  `discountCode`. Percentage codes discount the current course base price; the
  resulting order stores the effective discount from list price.
- `course_promo_codes` supports `discount_kind = "percentage"` and
  `discount_kind = "fixed_price"`. Percentage codes may define
  `paddle_discount_code` / `paddle_discount_id`; for USD checkout the site must
  pass those through to `Paddle.Checkout.open(...)` as `discountCode` /
  `discountId`. If `paddle_discount_code` is empty, the backend may return the
  normalized promo code as `discount_code`.
- Promo activation is server-side only: `enabled`, optional `usage_limit`,
  `times_used`, `starts_at`, and `expires_at` are checked by
  `create-course-payment`. Quote preview must never create a `course_orders`
  row or increment `times_used`; successful YooKassa/Paddle course webhooks
  increment `times_used` once, only when the order was not already succeeded.
- Telegram claim discounts live in `course_discount_claims`, not in
  `course_promo_codes`. A claim is a random per-user token issued when a user
  requests course access in the Telegram bot. The token is discount-only and
  never unlocks lessons; its checkout discount is valid for 24 hours.
  New claims use a 20% discount. Already-issued claims keep their stored
  percentage until expiry so a previously promised offer is still honored.
  It is issued exactly once per Telegram lead: repeated course requests always
  reuse the same token, while an expired or used
  discount is never reissued or extended. A database invariant must enforce
  this even for concurrent or retried Telegram callbacks.
  While a claim is active, the website must hide the manual promo field and
  send `discount_claim_token` to `create-course-payment`; the backend ignores
  `promo_code` when a valid claim token is present. Quote preview can show the
  claim price/timer, but claims are marked used only by successful
  YooKassa/Paddle course webhooks. Successful course webhooks mark the related
  lead paid but do not send a Telegram payment-success message; access is
  delivered by email. USD claim checkout requires a Paddle
  discount code/id configured server-side; the browser must not set arbitrary
  checkout amounts. The canonical Paddle claim env keys are
  `PADDLE_DISCOUNT_CODE_COURSE_AI_CONTENT_MARKETING_2026_TELEGRAM20_{PRODUCTION|SANDBOX}`
  and `PADDLE_DISCOUNT_ID_COURSE_AI_CONTENT_MARKETING_2026_TELEGRAM20_{PRODUCTION|SANDBOX}`.
  Keep the `TELEGRAM40` env pair and Paddle discount active until every
  already-issued 40% claim has expired.
- Fixed-price promos require configured RUB and USD fixed amounts. The current
  internal fixed-price path is `FREE` (`100 ₽` / `$1`) and uses the separate
  Paddle `$1` price ID; do not let the browser set arbitrary checkout amounts.
- The YooKassa `/webhook` handler must branch on `metadata.kind` before
  requiring `metadata.user_id`. Course webhooks grant/confirm
  `course_entitlements`, create or reuse the Supabase Auth user for that email,
  generate a direct website magic link, and send it via Resend. They must not
  insert/update `subscriptions`, must not change `users.plan`, and must not
  reset `usage_logs`.
- The Paddle `/webhook-paddle` and `/webhook-paddle-sandbox` handlers must
  branch on verified `custom_data.kind = "course_purchase"` before requiring
  `custom_data.user_id`. Course Paddle webhooks grant the same
  `course_entitlements` and must not write Pro subscription state.
- If the magic link expires, the buyer can still use the normal `/login` Email
  OTP flow with the same email. `course-access-summary` claims the entitlement
  by email and binds it to `auth.users.id`.
- The Vercel endpoint `POST /api/kinescope-course-token` verifies the website
  JWT locally and signs the Kinescope `drmauthtoken`, but its access check is
  `course-access-summary`, not Pro subscription lookup. Player display settings
  are Kinescope operational config and must not be modeled as extension/site
  entitlement state.
- The Vercel endpoint `POST /api/course-prompt` verifies the website JWT and
  `course-access-summary` before returning a whitelisted private course prompt
  body from `api/_shared/coursePromptBodies.ts`.

Telegram course offer for the same course is intentionally a narrow sales
funnel:

- `/start` immediately creates or reuses the claim without requiring channel
  subscription, sends the public course introduction through Bot API
  `sendVideo`, then sends the separate HTML-formatted course offer with an
  `Открыть курс` button and the public Telegram channel link in the message
  text. Legacy callback actions remain accepted for buttons already present in
  old chats. This handler change is not a broadcast and must never push the new
  sequence to existing leads.
- The Bot API long description is `Привет! Здесь можно получить доступ в мой
  Telegram-канал с промптами и полезными инструкциями или посмотреть курс по
  ИИ.\n\nЖми /Start 👇`; the `/start` command description is `Открыть курс`.
- The bot stores users who press Start in `telegram_hidden_intro_leads` and
  writes funnel events to `telegram_hidden_intro_events`. These tables are
  RLS-enabled with no public policies and are accessed only by service-role
  Edge Functions.
- The website stores the claim token in
  `localStorage.opten_course_preview_claim_v1`. When `?claim=...` is present,
  it also best-effort calls the legacy-named `telegram-hidden-intro-opened` so
  the owner can see offer openings. The browser value is only a checkout
  discount transport and must never be sent to `/api/kinescope-course-token`.
- Owner tooling is intentionally service-endpoint based for MVP:
  `telegram-hidden-intro-stats` for funnel counts,
  `telegram-hidden-intro-broadcast` for manual posts, and
  `telegram-hidden-intro-reminders` for 12h/1h reminders. All use
  `X-Opten-Admin-Secret`; do not expose these controls in public site bundles.
- Every Kinescope course token requires normal website auth plus
  `course-access-summary`, including lessons 1–3. There is no Telegram playback
  access mode.
- All 16 lessons use the same locked course-purchase UI before entitlement.
  The website does not advertise free Telegram lessons and locked players do
  not deep-link to the bot.
- The bot sends the course offer directly after `/start`. An active reused
  claim returns the same discounted course link. An expired or used claim
  returns the ordinary course link and honestly states that the personal
  discount has ended. Lookup/create failures show `Открыть курс` first and
  `Перейти в Telegram` second.
- Private course prompts remain course-entitlement-gated. Telegram preview
  access must not enable Opten for ChatGPT or the Opten Claude/Codex download.
  The collection-level `Генератор промптов Opten` block stays visible before
  materials/showcase on the course root and every lesson, but its links open
  only for a course buyer or active Pro user; everyone else gets locked
  previews with one compact `/pay` subscription action. Once access opens, the
  sales description under the generator heading is hidden.
- The removed `hidden-intro`/lesson-0 content must not be present in
  `privateCourseCollection.lessons` or `api/_shared/kinescopeCourse.ts`. Its
  legacy URL may only redirect to lesson 1 while preserving the query string;
  it remains outside sitemap, llms.txt, public Learn, and EN sibling maps.

If the Supabase project is ever rotated/migrated, **all listed site files** plus the extension's
[`config/api.js`](../../promptscore/config/api.js) must be updated in one coordinated commit.

### 4.2 Website auth (Phase 95/96)

`/login`, `/auth/callback`, and `/app/*` are allowed to authenticate without
the extension installed. `/pay` and `/account` prefer that website session and
fall back to extension messages only for compatibility. Website auth uses only
public Supabase Auth endpoints on the live self-hosted backend:

- Visible auth starts with Email login at `/auth/v1/otp` and renders only an OTP code in the
  email. The GoTrue template intentionally shows `{{ .Token }}` and does not
  show `{{ .ConfirmationURL }}`: the code is the reliable path for the website
  and the extension popup. A normal email magic link would not automatically
  sign the Chrome extension in unless a separate short-lived extension
  handoff/bridge is built. The live self-hosted Auth template is
  served by this repo at `/auth-templates/magic-link.html` and referenced by
  the relevant `GOTRUE_MAILER_TEMPLATES_*` auth-template env vars on the VPS.
  The email is English-only by product decision; keep the template copy and
  the VPS `GOTRUE_MAILER_SUBJECTS_*` subject env vars in English.
- Google OAuth still exists in code at
  `/auth/v1/authorize?provider=google&redirect_to=...` on the site and via
  extension `SIGN_IN`/PKCE, but both visible buttons are hidden for now. Do not
  remove the architecture unless the product explicitly asks for a hard removal.
- Session refresh uses `/auth/v1/token?grant_type=refresh_token`.
- Session inspection uses the locally stored access token and the
  `account-summary` function; the website does not call service-role APIs.

Product rule:

```text
The subscription and credits belong to the auth.users.id that bought them.
If Google OAuth is re-enabled, Google account A and Email account B are
different accounts unless Supabase links them into the same auth user. Another
account seeing Free is expected.
```

Website/extension session rule:

```text
The website session and extension session are independent local sessions.
Website logout clears only localStorage.opten_space_session_v1 and public
Supabase logout for that website JWT. It must not mutate chrome.storage.local
ps_* keys or send an extension logout message.
```

Security rule:

- Do not put `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, payment secrets,
  proxy API keys, or provider OAuth secrets in the website or extension bundle.
- Website local storage may hold the web-app access/refresh session for `/app/*`
  MVP auth, but plan/credit authority remains server-side in `account-summary`.
- Any future "sign in on website then activate extension" handoff must use a
  short-lived server-issued code, not direct service-role secrets in the browser.

### 4.3 Public landing Prompt Workbench (site-owned)

The visible landing hero exposes improvement only and calls
`POST /api/prompt-workbench` on the website origin. The workbench can be viewed by
any visitor, but its AI action requires a signed-in website account. The browser
sends the normal website Bearer JWT only for a signed-in account; the endpoint
independently verifies the JWT before forwarding to promptscore-proxy. The proxy
atomically reserves from the shared operation ledger before calling Anthropic:
new Free accounts may spend their one-time signup credits, exhausted/old Free
accounts receive a limit error, and Pro accounts spend the normal 300-operation
monthly cycle. Concurrent requests for one user are serialized in PostgreSQL; a
provider failure releases only its exact reservation, and a repeated DB attempt
reuses the same idempotency key.

- Accepted action: `improve` only. Prompt scoring is not part of this endpoint.
- Allowed image models, in popup order: `nano-banana-2`, `nano-banana-pro`,
  `gpt-image-2`, `midjourney-8`, `midjourney-7`, `seedream-5`, `flux`, `z-image`.
- Allowed video models, in popup order: `seedance-2.0`, `kling-3`, `kling-2.6`,
  `veo-3.1`, `veo-3`, `wan`. Labels and ordering mirror `PS_CHAT_TOP_MODELS` in
  the extension popup. Every other slug returns `invalid_model` before proxy use.
- Optional references: up to 8 image files. The browser rejects sources larger
  than 10 MB, decodes them locally, resizes the long edge to at most 512 px, and
  converts them to JPEG at quality 0.7 before request construction. Reference
  bytes, previews, and prompt results are ephemeral component state; they are not
  written to localStorage or Supabase. Reference images use the same Anthropic
  multimodal content-block shape as the extension popup.
- Access errors are explicit: no/invalid website JWT returns
  `401 authentication_required` before proxy use; exhausted Free or over-limit
  Pro returns `429 pro_limit_reached` from the proxy-backed shared ledger.
- Transport mirrors `POPUP_REWRITE_PROMPT`: prompt must contain at least 20
  trimmed characters; response language is detected from prompt text; the server
  loads the same committed `rewriter.md`; the proxy body uses `model_name`,
  `is_video`, `max_tokens: 1200`, legacy-compatible `count_usage: true`, and
  `source: popup`. The proxy ignores client billing flags, uses Claude Haiku,
  loads the matching skill, and charges every rewrite against the shared
  operation ledger. The website server never receives the Anthropic API key and
  never decides usage entitlement locally beyond JWT verification.
- The canonical quick-Improve rewriter prompt remains extension-owned at
  `C:\Projects\promptscore\config\`. Run `npm run sync:prompt-workbench` to
  refresh the committed server-only copies in `api/_assets/prompt-workbench/`.
- The extension's paid score/improve transport remains unchanged. The website
  reuses the popup rewrite path server-to-server after JWT verification and
  relies on the proxy for Free-signup/Pro usage enforcement. The website must not
  claim a different named model than the one actually used. Marketing may use the
  product label `Opten`/`Opten Pro` without publishing provider internals.
- Prompt text/results/reference previews are ephemeral browser state; the website
  does not persist them in localStorage or Supabase. The endpoint applies a strict
  body cap, 20–6,000-character prompt bounds, exact popup model allowlist,
  JWT verification, and proxy timeout/retry policy.

### 4.1 Prompt Library PostgREST surface (Phase 91, extension save/insert added Phase 92/93)

Prompt Library data lives in the extension-owned Supabase database. The site
does not call an Edge Function for normal prompt CRUD/search. It calls
PostgREST directly with the extension-provided Bearer JWT and the public anon
key:

```http
GET    /rest/v1/prompt_library
POST   /rest/v1/prompt_library
PATCH  /rest/v1/prompt_library?id=eq.<uuid>
DELETE /rest/v1/prompt_library?id=eq.<uuid>
POST   /rest/v1/rpc/prompt_library_mark_used
```

Table: `public.prompt_library` (created by migration `014_prompt_library.sql`;
Phase 97 access rule updated by `015_prompt_library_free_access.sql` in the
extension repo).

Columns exposed to authenticated owners:

```ts
{
  id: string;
  user_id: string;
  title: string;
  body: string;
  tags: string[];
  favorite: boolean;
  source_host: string | null;
  source_url: string | null;
  source_title: string | null;
  body_hash: string;       // generated SHA-256 of normalized body
  use_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}
```

Access rules:

- RLS is authoritative. Website UX gates are advisory only.
- Prompt Library is free for every authenticated owner account. Phase 97
  migration `015_prompt_library_free_access.sql` keeps owner isolation and
  quotas, but removes the old `users.plan='pro'` + `subscriptions` entitlement
  check because this feature does not call the proxy, AI providers, Edge
  Functions, or `usage_logs`.
- The public site still requires the installed Chrome extension for normal use:
  `/prompt-library` gets its Bearer JWT only through `GET_AUTH_TOKEN`, not from
  the website `localStorage.opten_space_session_v1` session. RLS cannot
  distinguish extension-issued and website-issued Supabase JWTs because they are
  the same auth project tokens; the extension requirement is enforced by the
  route's UX/message contract.
- `DELETE` is allowed only for owner rows where `archived_at IS NOT NULL`.
  Active prompts must be archived before permanent delete.
- Quotas are server-side: 150 rows per user, 12,000 body chars, 8 tags, 50 chars
  per tag.
- Duplicate bodies are rejected per user by generated `body_hash`.
- Search uses PostgREST full-text filtering on trigger-maintained `search_vector` with
  the `wfts` operator. No embeddings, no Anthropic, no Vercel proxy, and no
  `usage_logs` writes are part of this surface.

RPC:

```ts
POST /rest/v1/rpc/prompt_library_mark_used
Body: { p_prompt_id: string }
Response: PromptLibraryRow
```

This increments `use_count`, sets `last_used_at`, and returns the updated row.
It is granted to `authenticated` only.

**Public snapshot RPCs (Phase 98):**

Public Prompt Library links are snapshots, not live mirrors. The private
`prompt_library` table stays owner-only. Migration
`016_prompt_library_public_snapshots.sql` in the extension repo adds copied
snapshot tables:

- `public.prompt_library_publications` — one random slug per owner, with
  `is_public`, `published_at`, `updated_at`, and `unpublished_at`.
- `public.prompt_library_publication_items` — copied prompt fields for public
  read-only display.

RPC contract:

```ts
POST /rest/v1/rpc/prompt_library_publication_summary
Body: {}
Auth: authenticated owner JWT
Response: [{ id, slug, is_public, published_at, updated_at, unpublished_at, item_count }] | []

POST /rest/v1/rpc/prompt_library_publish_snapshot
Body: {}
Auth: authenticated owner JWT
Response: [{ id, slug, is_public, published_at, updated_at, unpublished_at, item_count }]

POST /rest/v1/rpc/prompt_library_unpublish
Body: {}
Auth: authenticated owner JWT
Response: boolean

POST /rest/v1/rpc/prompt_library_get_public_snapshot
Body: { p_slug: string }
Auth: anon or authenticated
Response: rows with publication fields + nullable item fields

POST /rest/v1/rpc/prompt_library_save_public_prompt
Body: { p_item_id: string }
Auth: authenticated viewer website JWT
Response: PromptLibraryRow
```

Rules:

- Publishing copies all current non-archived owner prompts into the snapshot.
  New private prompts do not become public until the owner refreshes by calling
  `prompt_library_publish_snapshot` again.
- Unpublishing sets `is_public=false`; private rows and copied items are not
  deleted.
- Public viewing requires no token but returns rows only for active slugs.
- Saving creates an independent private `prompt_library` copy for the viewer.
  Existing owner RLS/quota/body-hash rules still apply to the inserted private
  row.
- `/p/:slug` is random-link and `noindex,nofollow` for MVP. There is no
  "copy whole library" action.

**Extension context-menu save (Phase 92):**

The extension service worker also calls this same PostgREST surface directly
when a logged-in user selects text on an HTTP(S) page and clicks
`Сохранить выделенное` in the native context menu:

- `POST /rest/v1/prompt_library?select=...` with `user_id`, deterministic
  `title`, selected `body`, empty `tags`, `favorite=false`, and source metadata
  from the active tab (`source_host`, `source_url`, `source_title`).
- Duplicate bodies are handled through the generated `body_hash` contract:
  after a unique-constraint response, the extension computes the same normalized
  SHA-256 hash locally, fetches the owner row by `body_hash`, restores it when
  archived, and refreshes its bounded local cache instead of creating another
  row.
- Authentication is checked locally through the extension token and owner
  isolation is enforced by PostgREST/RLS. Prompt-library save does not call the
  Vercel proxy, Anthropic, Edge Functions, or `usage_logs`.
- Prompt bodies must not be logged by either repo. Metadata-only logging
  (status code, result code, source host, prompt id) is acceptable.

**Extension context-menu insert (Phase 93):**

The extension service worker renders bounded native context-menu insert actions
from `ps_prompt_library_cache`, direct PostgREST refreshes, and site-triggered
`REFRESH_PROMPT_LIBRARY_CACHE` refreshes:

- `Вставить последний`, bounded `Избранные`, bounded `Недавние`, and
  `Открыть библиотеку`.
- Generic HTTP(S) page insertion uses `activeTab` + `chrome.scripting`
  after the explicit native context-menu gesture. The extension must not add
  `<all_urls>`, `clipboardRead`, or `clipboardWrite` for this feature.
- Successful insert calls `POST /rest/v1/rpc/prompt_library_mark_used` with
  `{ p_prompt_id }`, then refreshes the bounded local cache from the returned
  row/cache surface.
- Failed direct insertion opens `https://opten.space/prompt-library` as the
  manual path. Prompt body text is never placed in a URL, mirrored through the
  external message API, or copied through a broad clipboard permission.
- Prompt-library insert does not call the Vercel proxy, Anthropic, Edge
  Functions, or `usage_logs`.

---

## 5. Storage keys (`ps_*`) — extension-owned, site-readable

The extension persists state in `chrome.storage.local`. The site cannot read
these directly (only the extension's own background script can), but the
**response shape of `GET_AUTH_TOKEN` / `GET_SUBSCRIPTION` mirrors them 1:1**.
Renaming a key on the extension side requires updating the response field too.

| Key | Owner | Mirrors to message field | Notes |
|-----|-------|--------------------------|-------|
| `ps_auth_token` | Extension (Email OTP or hidden OAuth result) | `GET_AUTH_TOKEN.token` | JWT, refreshed automatically. |
| `ps_refresh_token` | Extension | — | Internal, PKCE refresh. |
| `ps_user_email` | Extension | `GET_AUTH_TOKEN.email` | |
| `ps_plan` | Extension (synced from Supabase) | `GET_SUBSCRIPTION.plan` | `'free' \| 'pro' \| 'cancelled'`. |
| `ps_remaining` | Extension (`account-summary` + proxy updates) | `GET_SUBSCRIPTION.remaining` | New Free starts at 3, old/spent Free can be 0, Pro counts down from 300. |
| `ps_limit` | Extension (`account-summary`) | `GET_SUBSCRIPTION.limit` | `300` for both Free display and Pro. |
| `ps_sub_status` | Extension | `GET_SUBSCRIPTION.status` | `'active' \| 'cancelled' \| null`. |
| `ps_sub_expires` | Extension | `GET_SUBSCRIPTION.expires_at` | ISO8601. |
| `ps_sub_card_last4` | Extension | `GET_SUBSCRIPTION.card_last4` | |
| `ps_sub_card_type` | Extension | `GET_SUBSCRIPTION.card_type` | |
| `ps_sub_has_card` | Extension | `GET_SUBSCRIPTION.has_card` | |
| `ps_sub_auto_renew` | Extension | `GET_SUBSCRIPTION.auto_renew` | |
| `ps_sub_provider` | Extension (set by webhook) | — (used internally for cancellation dispatch) | `'yookassa' \| 'paddle'`. Missing → fallback to `'yookassa'`. |
| `ps_pkce_verifier` | Extension | — | Internal Google OAuth state; retained behind hidden UI. |
| `ps_email_auth_pending` | Extension | — | Internal/local-only Email OTP popup state. Shape: `{ email, sentAt }`. Used only to restore the code-entry screen after Chrome closes the popup while the user checks email; cleared on successful sign-in, logout, and auth reset; never mirrored through the site message API. |
| `ps_prompt_library_cache` | Extension | — | Phase 92 local-only bounded cache for Prompt Library context menus; Phase 93 uses it for insert menu rows and may refresh it through PostgREST; Phase 94 lets the site trigger a refresh via `REFRESH_PROMPT_LIBRARY_CACHE` after successful library mutations. Shape: `{ version, updated_at, last_saved_id, last_saved_at, recent, favorites }`; `recent` is capped at 20 rows, `favorites` at 10 rows, and native menus show smaller bounded subsets. Rows may include prompt `body` for insertion, so the key is cleared on logout/auth reset and is never mirrored through the site message API. |

**Breaking-change protocol:**
1. Add a new key in the extension first (parallel to the old one).
2. Ship a release that writes both.
3. Update the site to read the new field once the extension version is widely deployed.
4. Eventually remove the old key in a follow-up extension release.

Never rename a key in one repo without the other.

---

## 6. Paddle SDK initialization (site-side detail with cross-impact)

Paddle's checkout SDK is initialized in [`src/lib/paddle.ts`](../src/lib/paddle.ts) via `ensurePaddle()`,
called from [`PayPage.tsx`](../src/app/pages/PayPage.tsx) on mount and again before `Paddle.Checkout.open()`.
The paid course purchase card also calls `ensurePaddle()` lazily before USD course checkout.

**Per-route loading strategy (Phase 2.2, extended symmetrically in Phase 3 D-03b):**
- The CDN `<script src="paddle.js">` tag is injected **synchronously** into `dist/pay/index.html`
  **and** `dist/en/pay/index.html` by [`scripts/prerender.mjs`](../scripts/prerender.mjs)
  (`applyPaddleScript`) — direct hits on `/pay` (e.g. from the extension popup's Upgrade CTA)
  and direct hits on `/en/pay` (e.g. from EN search results or a shared link) both have
  `window.Paddle` defined before React mounts. Integration with Pitfall #2 / `BG-67-01` is
  preserved on both routes that need it.
- Phase 3 D-03b widened the injection condition from `meta.path === "/pay"` to
  `meta.path === "/pay" || meta.path === "/en/pay"`. This is a **symmetric extension** of the
  §6 contract, not a violation — every `/pay` surface (root and EN sibling) ships Paddle sync.
- Other prerendered routes (`/`, `/welcome`, `/privacy`, `/terms`, `/refund`, `/en/`, `/en/welcome`,
  `/en/privacy`, `/en/terms`, `/en/refund`) and SPA-fallback routes (`/account`, `/success`,
  `/dashboard/download-skill`) do NOT load Paddle in HTML.
  Loading the SDK on every page cost 500-1500 ms of render-blocking on mobile 3G and provided
  no benefit.
- SPA-navigation to `/pay` (user clicks a `<Link to="/pay">` from landing) or USD course checkout
  triggers `ensurePaddle()`, which appends the `<script>` tag dynamically and resolves once it
  loads + `Paddle.Initialize()` has run.

**Don't:**
- Switch the `<script>` tag inside `dist/pay/index.html` to `async` or `defer` — `PayPage` will
  race-condition on direct hits. (The dynamic loader in `src/lib/paddle.ts` is itself `async`,
  but it `await`s the load promise inside `handlePayUsd()` before calling `Checkout.open()`.)
- Re-introduce the `<script src="paddle.js">` tag into the root `index.html` template — it would
  re-attach to every route's HTML and undo the Phase 2.2 perf win.
- Call `Environment.set('production')` — Paddle v2 SDK throws on this; only call `Environment.set('sandbox')` or skip entirely (Phase 67 fix).

**Env vars (Vercel):**
- `VITE_PADDLE_ENV` — `'sandbox'` | `'production'`
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token
- Course Paddle price IDs live in the extension-owned Edge Function
  environment, not in the website bundle:
  `PADDLE_PRICE_ID_COURSE_AI_CONTENT_MARKETING_2026_{SANDBOX|PRODUCTION}`
  and `PADDLE_PRICE_ID_COURSE_AI_CONTENT_MARKETING_2026_FREE_{SANDBOX|PRODUCTION}`.
  The current live production IDs are
  `pri_01kvk9vzec7cwgq7zgs9azw2re` (`$41`) and
  `pri_01kvk9x5mcnadfj0beymk23ze5` (`$1` FREE test).

If you switch envs, you must also flip the corresponding Paddle priceIds in the extension's `create-payment-paddle` and `create-course-payment` Edge Functions.

---

## 7. Known sharp edges & risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Renaming a route (`/pay`, `/welcome`, `/success`) | Already-installed extensions on old versions break for affected users until they update | Keep the routes. To replace, ship a redirect from the old path. |
| Changing `EXTENSION_IDS` without updating all 3 site pages | "Extension not installed" misdetection | Always grep-and-replace; consider extracting to a single constant. |
| Removing a field from `GET_SUBSCRIPTION` response | Site PayPage/AccountPage crashes | Forward-compatible additions only. Removals need extension-side deprecation window. |
| Rotating `SUPABASE_ANON_KEY` | Both repos break | Coordinate; the key is hardcoded in 3 site files + extension `config/api.js`. |
| Marking `/dashboard/download-skill` as public | Anyone gets the skill ZIP | Auth + Pro check in [`api/download-skill.ts`](../api/download-skill.ts) is defense-in-depth — keep it. |
| Treating `plan === 'cancelled'` as always Free or always Pro in site UI | Cancelled-but-not-expired users lose access prematurely, or expired users cannot pay again before cron cleanup | Mirror [`api/download-skill.ts`](../api/download-skill.ts): `'cancelled'` with a future `expires_at` is still Pro; past `expires_at` is Free for payment/UI purposes. |
| Paddle env-var flip without priceId sync | Real users get sandbox prices (or vice versa) | Treat Paddle env switch as a coordinated deploy across site + Edge Function. |
| Adding a new site route the extension navigates to | Site must exist before extension ships referring code | Site first, then extension. |
| Allowing anonymous landing requests to reach promptscore-proxy | Unmetered Claude usage and shared-ledger abuse | Verify the website JWT in `/api/prompt-workbench` before every proxy request; let the proxy enforce Free signup credits and Pro usage. |
| Trusting `count_usage` or any other client field to decide billing | An authenticated caller can bypass credits by changing the request body | Treat every score/rewrite as billable in promptscore-proxy; reserve atomically before Anthropic and release only the exact failed-provider reservation. |
| Marketing a named Pro model that is not actually used | Misleading paid-product claim and loss of user trust | Describe the product tier (`Opten Pro`) or name the real model; do not advertise a fabricated provider/model name. |
| Letting the landing model list drift from `PS_CHAT_TOP_MODELS` | Website and extension produce different quick-mode behavior or expose unsupported skills | Keep the exact 14 slugs, labels, order, and image/video grouping synchronized with `C:\Projects\promptscore\popup\popup.js`. |

---

## 8. When to update this document

Update this file **before** merging a change to either repo if it touches:

- `manifest.json` `externally_connectable` block
- `background/background.js` `onMessageExternal` handler
- Any of the route paths in section 3
- Any of the Edge Functions in section 4 (request/response shape)
- The `prompt_library` PostgREST/RPC shape in section 4.1
- Any of the `ps_*` storage keys in section 5
- The `EXTENSION_IDS` array in the site
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` constants
- The authenticated Prompt Workbench auth/action/model/request/usage contract

Then bump the "Last sync" date and the extension version reference at the top.
