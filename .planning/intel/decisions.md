---
tags:
  - gsd
  - intel
  - decisions
kind: "intel-decisions"
---
# Decisions Intel

Synthesized from ADR-type docs. One entry per locked decision. Source paths are absolute.

---

## DEC-integration-contract-locked-routes

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§3)
- **status:** LOCKED
- **scope:** URL routes that the shipped Opten Chrome extension navigates to
- **decision:** The site MUST keep these route paths live with the documented behavior, indefinitely:
  - `/welcome` — extension `onInstalled` navigates here on fresh install
  - `/pay` — popup "Upgrade" CTA opens this in a new tab
  - `/success` — YooKassa `return_url` after successful payment
  - `/account` — subscription management UI (linked from popup)
  - `/dashboard/download-skill` — Pro-only skill ZIP download
- **rationale:** Already-installed extensions on old versions break for affected users if these paths are renamed. To replace, ship a redirect from the old path.

## DEC-integration-contract-message-api

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§2)
- **status:** LOCKED
- **scope:** `externally_connectable` chrome.runtime message API between site and extension
- **decision:** The site is the sole initiator; the extension only replies. Four message types are supported:
  - `GET_AUTH_TOKEN` → returns `{ token, email }` or `{ token: null, reason }`
  - `GET_SUBSCRIPTION` → returns subscription object (`plan`, `status`, `expires_at`, `auto_renew`, `card_*`, `limit`, `remaining`) or `{ error }`
  - `CANCEL_SUBSCRIPTION` → returns `{ success, expires_at }` or `{ error, message }`
  - `WARMUP` → fire-and-forget; extension may ignore
- **rationale:** This is the only legal channel for the site to read auth/subscription state and trigger cancellation. Extension validates `sender.url` against `https://opten.space` (SEC-02).
- **forward-compat rule:** Site MUST NOT assume the response is exhaustive; new fields may be added. Removals require an extension-side deprecation window.

## DEC-integration-contract-extension-ids

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§2.2)
- **status:** LOCKED
- **scope:** Hardcoded Chrome Extension IDs duplicated in site pages
- **decision:** The `EXTENSION_IDS` array is duplicated in three files and must be kept in sync as a single triple:
  - `src/app/pages/PayPage.tsx`
  - `src/app/pages/AccountPage.tsx`
  - `src/app/pages/DownloadSkillPage.tsx`
  - Values: `["iphkppgbobpilmphloffcalicmejacfl", "kcmcaeenfmfnpiaihicecnfnagejpcog"]` (CWS + local dev)
- **rationale:** If CWS ID changes (re-upload as new listing), all three pages must be updated. Pages iterate the list and pick whichever responds first.

## DEC-integration-contract-supabase-constants

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§4)
- **status:** LOCKED (post-Phase-88 cutover)
- **scope:** Supabase project URL and anon key duplication
- **decision:** `SUPABASE_URL` and `SUPABASE_ANON_KEY` are duplicated across **four** locations and must rotate together:
  - `src/app/pages/PayPage.tsx`
  - `src/app/pages/AccountPage.tsx`
  - `api/download-skill.ts`
  - Extension repo `config/api.js`
- **values:** `SUPABASE_URL = "https://supabase.opten.space"` — self-hosted on Beget RU VPS since Phase 88 cutover (2026-05-25, extension v2.8 milestone). Cloud `https://vuywydhwkqmihfztpkgl.supabase.co` is a frozen cold backup, not active. Anon key (public-by-design `anon` role JWT) is **unchanged** — self-hosted GoTrue reuses the cloud `JWT_SECRET`, so the issuer `ref: vuywydhwkqmihfztpkgl` baked into the payload is still accepted by self-hosted Kong.
- **rationale:** Rotating/migrating the Supabase project requires one coordinated commit across all four files. The Phase 88 swap moved the base URL only; anon key rotation was deliberately avoided.

## DEC-integration-contract-edge-functions

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§4)
- **status:** LOCKED
- **scope:** Ownership and call sites for Supabase Edge Functions
- **decision:** All Edge Functions are owned and deployed from the **extension repo** (`C:\Projects\promptscore\supabase\functions\`). The site only calls them.
  - Site calls: `POST /create-payment` (RU YooKassa), `POST /create-payment-paddle` (EN Paddle), `POST /get-subscription` (rare fallback)
  - Extension calls: `POST /cancel-subscription`, `POST /cancel-subscription-paddle`
  - Provider-only: `/webhook`, `/webhook-paddle`, `/webhook-paddle-sandbox`, `/auto-renew`, `/expire-subscriptions`
- **rationale:** Schema changes require coordinated deploys across both repos.

## DEC-integration-contract-storage-keys

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§5)
- **status:** LOCKED
- **scope:** `chrome.storage.local` `ps_*` storage keys owned by extension
- **decision:** All subscription/auth state lives in the extension's `chrome.storage.local` under the `ps_*` prefix. Site reads these indirectly via the message API only — the response shape of `GET_*` messages mirrors the keys 1:1.
- **breaking-change protocol:** (1) add new key in extension parallel to old; (2) ship release writing both; (3) update site to read new field once extension is widely deployed; (4) remove old key in follow-up extension release. Never rename in one repo without the other.
- **special semantics:** `plan === 'cancelled'` means cancelled-but-still-in-paid-period — treat as Pro for access purposes (see `api/download-skill.ts:78-85`).

## DEC-integration-contract-paddle-init

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§6)
- **status:** LOCKED
- **scope:** Paddle.js v2 SDK initialization on the site
- **decision:**
  - Paddle CDN script MUST be loaded synchronously in `index.html` (not `async`/`defer`) — guarantees `window.Paddle` exists before `main.tsx` runs (Pitfall BG-67-01).
  - MUST NOT call `Paddle.Environment.set('production')` — v2 SDK throws on this. Only `Environment.set('sandbox')` or skip entirely.
  - Env vars (Vercel): `VITE_PADDLE_ENV` (`sandbox`|`production`), `VITE_PADDLE_CLIENT_TOKEN`.
- **rationale:** Switching the script tag attributes will race-condition PayPage. Paddle env switches must be coordinated with `create-payment-paddle` Edge Function priceId flips.

## DEC-integration-contract-update-protocol

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§8)
- **status:** LOCKED
- **scope:** When to update INTEGRATION-CONTRACT.md
- **decision:** Update the contract BEFORE merging a change to either repo if it touches: `manifest.json externally_connectable`, `background/background.js` `onMessageExternal` handler, any route path in §3, any Edge Function request/response shape (§4), any `ps_*` key (§5), `EXTENSION_IDS` (§2.2), or `SUPABASE_URL`/`SUPABASE_ANON_KEY` (§4). Bump the "Last sync" date and extension version reference at the top.
- **last sync:** 2026-05-28 against extension `manifest.json` v1.3.8 (post-v2.8 Self-Hosted Supabase Migration: Phase 88 cutover 2026-05-25, Phase 89 ops 2026-05-28).
