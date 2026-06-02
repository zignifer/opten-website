# Integration Contract — opten.space ↔ Opten Chrome Extension

> **Status:** LOCKED. This document is the authoritative interface between the site
> (`C:\Projects\opten-website`) and the extension (`C:\Projects\promptscore`).
> Any change here is a breaking change for the other side and must be coordinated.
>
> **Last sync:** 2026-06-02 against extension `manifest.json` version **1.3.8** (post-v2.8 milestone — Self-Hosted Supabase Migration completed; Phase 88 cutover done 2026-05-25; Phase 89 daily encrypted backups + monitoring shipped 2026-05-28; Phase 91 prompt-library schema/route contract added but not launched in visible navigation; Phase 92 extension context-menu save contract added; Phase 93 extension context-menu insert contract added in-tree; Phase 94 site-triggered prompt-library cache refresh added). Backend fully on self-hosted `supabase.opten.space`; manifest carries `https://supabase.opten.space/*` in `host_permissions` and the cloud `*.supabase.co` host was **removed** in v1.3.7. Dual-issuer local JWT verification handles cloud **ES256/JWKS** + self-hosted **HS256**.
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
3. **Supabase Edge Functions** — billing endpoints (`/create-payment*`, `/cancel-subscription*`, `/get-subscription`) are shared between the site (initiates payment) and the extension (initiates cancellation). Schema changes require coordinated deploys.
4. **Storage keys (`ps_*`)** — `chrome.storage.local` is the extension's source of truth for plan/subscription state. The site reads (and in some flows updates) these keys indirectly via the message API. Renaming or removing a key is a breaking change.

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
  //   limit: 300,          // L3C-01 (260428): free-аккаунт displays 0/300 — free даёт 0 операций, Pro даёт 300
  //   remaining: number,
  // }
  //
  // Error: { error: 'storage_read_failed' }
});
```

**Field-level notes:**
- `plan === 'cancelled'` means the user cancelled but is still inside the paid period. **Treat it as Pro for access purposes** (download skill, no upgrade nag). The `expires_at` is when access actually ends. This mirrors `api/download-skill.ts:78-85`.
- `limit: 300` for Free is the L3C-01 product positioning (free-аккаунт даёт 0 операций; popup shows `0/300` так как 300 — это Pro-лимит, на который нацелен апгрейд). Server-side proxy enforces `FREE_LIMIT=0` (Phase 88 go-live — flipped on Vercel production to match the popup `0/300` display; free = 0 операций, Pro required).
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
| `/pay` | Popup "Upgrade" CTA → opens new tab | Render PayPage with RU/EN price + checkout buttons (YooKassa or Paddle). Calls `GET_AUTH_TOKEN` to know who's paying. | [`background.js:903`](../../promptscore/background/background.js#L903) |
| `/success` | YooKassa redirect after successful payment | Show success state, optionally autoclose tab. Used as `return_url` in [`create-payment/index.ts:65`](../../promptscore/supabase/functions/create-payment/index.ts#L65). | YooKassa `return_url` |
| `/account` | Optional — sometimes linked from popup | Subscription management UI, calls `CANCEL_SUBSCRIPTION`. | n/a (user-driven) |
| `/dashboard/download-skill` | Pro-only feature in popup → opens new tab | Auth-gated page that calls `/api/download-skill` to fetch `opten.zip`. | [popup Phase 73](../../promptscore/popup/popup.html) |
| `/prompt-library` | User/site navigation once launched; extension context menu `Открыть библиотеку`; Phase 93 manual fallback after failed direct insert | Pro-only prompt library UI. Calls `GET_AUTH_TOKEN`, checks subscription, then uses Supabase PostgREST for `prompt_library` CRUD/search. After successful mutations it calls `REFRESH_PROMPT_LIBRARY_CACHE` so native extension menus do not keep stale titles/favorite state. Free/expired users see locked upsell state without prompt data reads. SPA-only, `noindex,nofollow`, no `/en/*` sibling. Insert fallback never receives prompt body text in URL. | Phase 91 + Phase 94 |

**Locked route names** (renames are breaking):
- `/welcome`, `/pay`, `/success` — referenced by the extension binary that's
  already shipped to users. If you rename them, **users on old extension
  versions will hit 404** until they update. Don't.
- `/prompt-library` — fixed Phase 91 route for Prompt Library launch and
  Phase 93 extension context-menu "open library" / failed-insert fallback
  actions. Do not rename it; in-tree extension code now opens this route.

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
| `POST /create-payment` | Site (`PayPage` RU path) | Bearer JWT | YooKassa. Body: `{ recurring: boolean }`. Returns `{ confirmation_url }`. `return_url` is hardcoded to `https://opten.space/success`. |
| `POST /create-payment-paddle` | Site (`PayPage` EN path) | Bearer JWT | Paddle. Returns `{ priceId, customerEmail, userId }`. Site then calls `Paddle.Checkout.open(...)`. |
| `POST /cancel-subscription` | Extension (via `CANCEL_SUBSCRIPTION`) | Bearer JWT | YooKassa cancellation. Site never calls directly. |
| `POST /cancel-subscription-paddle` | Extension (via `CANCEL_SUBSCRIPTION`) | Bearer JWT | Paddle cancellation. Site never calls directly. |
| `POST /get-subscription` | Site (optional) | Bearer JWT | Reads `subscriptions` table. Used as a fallback if the extension is not installed (rare path). |
| `POST /webhook` | YooKassa | IP-whitelist | Provider-only. Updates `subscriptions` table with `provider='yookassa'`. |
| `POST /webhook-paddle` | Paddle | HMAC-SHA256 | Provider-only. Updates `subscriptions` table with `provider='paddle'`. |
| `POST /webhook-paddle-sandbox` | Paddle sandbox | HMAC-SHA256 | Provider-only. For E2E testing. |
| `POST /auto-renew` | Cron job | Service role | Provider-only. |
| `POST /expire-subscriptions` | Cron job | Service role | Provider-only. |

**Hardcoded constants on the site** (must match Supabase project):
- `SUPABASE_URL = "https://supabase.opten.space"` — self-hosted (Phase 88 cutover COMPLETE — this is the live primary backend; cloud `vuywydhwkqmihfztpkgl.supabase.co` is a frozen cold backup). `PayPage.tsx` / `AccountPage.tsx` use the derived `SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1"`.
- `SUPABASE_ANON_KEY = "eyJ...A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg"` — **UNCHANGED** (JWT secret reused; self-hosted Kong accepts the same anon key). (see [`PayPage.tsx`](../src/app/pages/PayPage.tsx), [`AccountPage.tsx`](../src/app/pages/AccountPage.tsx), [`api/download-skill.ts`](../api/download-skill.ts))

**Token verification (Phase 87 / D-03, updated Phase 88):** the site (`api/download-skill.ts`) and the Edge Functions verify the user JWT **locally** (jose, dual-issuer allowlist: cloud + self-hosted). `supabase.auth.getUser()` / `/auth/v1/user` is no longer called — it performs a session lookup that rejects cloud-issued tokens on self-hosted (sessions not migrated, Phase 86). **Cloud migrated to ASYMMETRIC signing keys, so cloud-issued tokens are now ES256 — verified via the cloud JWKS (`/auth/v1/.well-known/jwks.json`); self-hosted GoTrue still signs HS256 with the shared secret.** The verifier branches by the token's `alg`: HS256 → shared secret, ES256 → cloud JWKS. Both issuers are accepted during the transition so old-extension tokens keep working (CLIENT-06). Edge `create-payment*` additionally run a server-side preflight (user-exists + not-already-Pro) before charging.

If the Supabase project is ever rotated/migrated, **all three site files** plus the extension's
[`config/api.js`](../../promptscore/config/api.js) must be updated in one coordinated commit.

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

Table: `public.prompt_library` (migration `014_prompt_library.sql` in the
extension repo).

Columns exposed to entitled owners:

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
- Entitled means `users.plan='pro'` plus a `subscriptions` row with
  `plan='pro'`, `status in ('active','cancelled')`, and `expires_at` absent or
  in the future.
- Free/expired users must not fetch `prompt_library` rows. The site renders a
  locked upsell state before data access.
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

**Extension context-menu save (Phase 92):**

The extension service worker also calls this same PostgREST surface directly
when a Pro user selects text on an HTTP(S) page and clicks
`Сохранить выделенное` in the native context menu:

- `POST /rest/v1/prompt_library?select=...` with `user_id`, deterministic
  `title`, selected `body`, empty `tags`, `favorite=false`, and source metadata
  from the active tab (`source_host`, `source_url`, `source_title`).
- Duplicate bodies are handled through the generated `body_hash` contract:
  after a unique-constraint response, the extension computes the same normalized
  SHA-256 hash locally, fetches the owner row by `body_hash`, restores it when
  archived, and refreshes its bounded local cache instead of creating another
  row.
- Entitlement is checked locally for UX and then enforced by PostgREST/RLS.
  The extension refreshes only `users`/`subscriptions` state for this feature;
  prompt-library save does not call the Vercel proxy, Anthropic, Edge Functions,
  or `usage_logs`.
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
| `ps_auth_token` | Extension (OAuth result) | `GET_AUTH_TOKEN.token` | JWT, refreshed automatically. |
| `ps_refresh_token` | Extension | — | Internal, PKCE refresh. |
| `ps_user_email` | Extension | `GET_AUTH_TOKEN.email` | |
| `ps_plan` | Extension (synced from Supabase) | `GET_SUBSCRIPTION.plan` | `'free' \| 'pro' \| 'cancelled'`. |
| `ps_remaining` | Extension (proxy increments) | `GET_SUBSCRIPTION.remaining` | |
| `ps_limit` | Extension | `GET_SUBSCRIPTION.limit` | `300` for both Free (display) and Pro. |
| `ps_sub_status` | Extension | `GET_SUBSCRIPTION.status` | `'active' \| 'cancelled' \| null`. |
| `ps_sub_expires` | Extension | `GET_SUBSCRIPTION.expires_at` | ISO8601. |
| `ps_sub_card_last4` | Extension | `GET_SUBSCRIPTION.card_last4` | |
| `ps_sub_card_type` | Extension | `GET_SUBSCRIPTION.card_type` | |
| `ps_sub_has_card` | Extension | `GET_SUBSCRIPTION.has_card` | |
| `ps_sub_auto_renew` | Extension | `GET_SUBSCRIPTION.auto_renew` | |
| `ps_sub_provider` | Extension (set by webhook) | — (used internally for cancellation dispatch) | `'yookassa' \| 'paddle'`. Missing → fallback to `'yookassa'`. |
| `ps_pkce_verifier` | Extension | — | Internal OAuth state. |
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
  no benefit (only `PayPage` consumes `window.Paddle`).
- SPA-navigation to `/pay` (user clicks a `<Link to="/pay">` from landing) triggers
  `ensurePaddle()` inside `PayPage`, which appends the `<script>` tag dynamically and resolves
  once it loads + `Paddle.Initialize()` has run.

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

If you switch envs, you must also flip the corresponding Paddle priceIds in the extension's `create-payment-paddle` Edge Function.

---

## 7. Known sharp edges & risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Renaming a route (`/pay`, `/welcome`, `/success`) | Already-installed extensions on old versions break for affected users until they update | Keep the routes. To replace, ship a redirect from the old path. |
| Changing `EXTENSION_IDS` without updating all 3 site pages | "Extension not installed" misdetection | Always grep-and-replace; consider extracting to a single constant. |
| Removing a field from `GET_SUBSCRIPTION` response | Site PayPage/AccountPage crashes | Forward-compatible additions only. Removals need extension-side deprecation window. |
| Rotating `SUPABASE_ANON_KEY` | Both repos break | Coordinate; the key is hardcoded in 3 site files + extension `config/api.js`. |
| Marking `/dashboard/download-skill` as public | Anyone gets the skill ZIP | Auth + Pro check in [`api/download-skill.ts`](../api/download-skill.ts) is defense-in-depth — keep it. |
| Treating `plan === 'cancelled'` as Free in site UI | Cancelled-but-not-expired users lose access prematurely | Mirror [`api/download-skill.ts:78-85`](../api/download-skill.ts#L78-L85): `'cancelled'` with an active period is still Pro. |
| Paddle env-var flip without priceId sync | Real users get sandbox prices (or vice versa) | Treat Paddle env switch as a coordinated deploy across site + Edge Function. |
| Adding a new site route the extension navigates to | Site must exist before extension ships referring code | Site first, then extension. |

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

Then bump the "Last sync" date and the extension version reference at the top.
