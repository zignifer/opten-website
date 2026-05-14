# Architecture — opten.space

> Routes, flows, and where state lives. Read this with
> [INTEGRATION-CONTRACT.md](../INTEGRATION-CONTRACT.md) — the contract is
> the source of truth for anything that crosses the site↔extension boundary.

## High-level

```
┌────────────────────────── opten.space (this repo) ──────────────────────────┐
│                                                                              │
│   index.html  ──sync──>  Paddle.js v2 CDN                                    │
│       │                                                                      │
│       └─> main.tsx (Paddle.Initialize) ─> <LangProvider> ─> <BrowserRouter>  │
│                                                                              │
│   Routes (8):                                                                │
│     /                   App.tsx                       (landing)              │
│     /pay                PayPage.tsx                   (RU YooKassa | EN Paddle)│
│     /success            SuccessPage.tsx               (post-payment)         │
│     /account            AccountPage.tsx               (subscription mgmt)    │
│     /welcome            WelcomePage.tsx               (first install)        │
│     /dashboard/         DownloadSkillPage.tsx         (Pro-only ZIP)         │
│       download-skill                                                         │
│     /privacy /terms /refund   (legal, static)                                │
│                                                                              │
│   API (Vercel serverless):                                                   │
│     GET /api/download-skill   →  validates JWT + Pro, streams opten.zip      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │                              │                          │
         │ chrome.runtime.sendMessage   │ fetch                    │ fetch
         │ (externally_connectable)     │                          │
         ▼                              ▼                          ▼
   ┌──────────────┐         ┌─────────────────────┐      ┌───────────────────┐
   │  Extension   │         │ Supabase Functions  │      │  Paddle Checkout  │
   │  (Chrome)    │         │ create-payment*     │      │  (overlay SDK)    │
   │              │         │ get-subscription    │      │                   │
   └──────────────┘         │ cancel-*  webhook*  │      └───────────────────┘
                            └─────────────────────┘
```

## Route map (`src/main.tsx`)

All routes are SPA. Vercel rewrites everything non-`/api/` to `index.html`
(see [`vercel.json`](../../vercel.json)). The router then handles paths client-side.

| Path | Component | Purpose | Talks to extension? | Talks to Supabase? |
|------|-----------|---------|---------------------|--------------------|
| `/` | [`App.tsx`](../../src/app/App.tsx) | Landing page, scroll-reveal | No | No |
| `/pay` | [`PayPage.tsx`](../../src/app/pages/PayPage.tsx) | Checkout — YooKassa for RU/RUB, Paddle for EN/USD | `GET_AUTH_TOKEN` to know who's paying | `create-payment` or `create-payment-paddle` |
| `/success` | [`SuccessPage.tsx`](../../src/app/pages/SuccessPage.tsx) | Post-YooKassa-redirect confirmation | No | No |
| `/account` | [`AccountPage.tsx`](../../src/app/pages/AccountPage.tsx) | View plan, cancel subscription | `GET_AUTH_TOKEN`, `GET_SUBSCRIPTION`, `CANCEL_SUBSCRIPTION` | Indirectly via extension |
| `/welcome` | [`WelcomePage.tsx`](../../src/app/pages/WelcomePage.tsx) | First-install onboarding (opened by extension on install) | No (extension navigates *to* this) | No |
| `/dashboard/download-skill` | [`DownloadSkillPage.tsx`](../../src/app/pages/DownloadSkillPage.tsx) | Pro-only skill ZIP download | `GET_AUTH_TOKEN` (Bearer for `/api/download-skill`) | `/api/download-skill` (this site's own serverless) |
| `/privacy` | [`PrivacyPage.tsx`](../../src/app/pages/PrivacyPage.tsx) | Legal | No | No |
| `/terms` | [`TermsPage.tsx`](../../src/app/pages/TermsPage.tsx) | Legal | No | No |
| `/refund` | [`RefundPage.tsx`](../../src/app/pages/RefundPage.tsx) | Legal | No | No |

## Page structure

```
src/
├── main.tsx                       — Paddle bootstrap + routes
├── app/
│   ├── App.tsx                    — landing
│   ├── components/                — shared UI (Header, Footer, hero, etc.)
│   └── pages/                     — one file per route
│       ├── PayPage.tsx
│       ├── AccountPage.tsx
│       ├── DownloadSkillPage.tsx
│       ├── WelcomePage.tsx
│       ├── SuccessPage.tsx
│       ├── PrivacyPage.tsx
│       ├── TermsPage.tsx
│       └── RefundPage.tsx
├── i18n/
│   ├── LangContext.tsx            — React context, useT, useLang
│   ├── ru.json                    — ~68KB dict
│   └── en.json                    — ~41KB dict
├── imports/                       — Figma-Make-generated SVG paths and assets per page
│                                    (LandingPage/, PayPage/, etc.) — auto-generated, brittle
├── styles/
│   ├── index.css                  — global CSS entry
│   ├── tailwind.css               — Tailwind directives
│   ├── theme.css                  — design tokens (colors, radii)
│   └── fonts.css                  — @font-face declarations
└── types/                         — TS type defs (e.g. for window.Paddle)
```

## i18n flow

1. [`LangContext`](../../src/i18n/LangContext.tsx) initializes from `localStorage.opten_lang` → falls back to `navigator.language.startsWith('ru') ? 'ru' : 'en'`.
2. `setLang(l)` writes to `localStorage` and re-renders.
3. `t(key)` looks up the dict for current lang, then falls back to `en`, then to the key string itself.
4. Side effect: `document.documentElement.lang` is updated on language change.

**Implications for SEO:**
- The initial HTML always ships with `<html lang="ru">` (hardcoded in `index.html`).
- The `lang` attribute is updated client-side after hydration, which crawlers may or may not honor.
- There are **no separate URLs per language** — `/` serves both RU and EN content depending on detection. Google sees one URL with content that varies post-hydration. This is a real SEO problem for the EN audience.
- There are **no `<link rel="alternate" hreflang>` tags**.

See [SEO-AUDIT.md](SEO-AUDIT.md) for the gap list and likely fixes.

## Billing flow — RU (YooKassa)

```
User on /pay (lang=ru, currency=RUB)
  └─> Detect extension via sendMessage(EXTENSION_IDS[0..1], GET_AUTH_TOKEN)
        └─> response.token   → user is signed in
  └─> User clicks "Оформить подписку"
        └─> POST  https://<supabase>.co/functions/v1/create-payment
              Authorization: Bearer <token>
              Body: { recurring: true }
        └─> Response: { confirmation_url }
        └─> window.location.href = confirmation_url   (YooKassa-hosted page)
              ↓
            User pays on YooKassa
              ↓
            YooKassa redirects to https://opten.space/success
              ↓
            (Meanwhile, YooKassa webhook → Supabase /webhook → subscriptions row, ps_sub_provider='yookassa')
```

## Billing flow — EN (Paddle)

```
User on /pay (lang=en, currency=USD)
  └─> Same extension detection.
  └─> User clicks "Subscribe"
        └─> POST  /functions/v1/create-payment-paddle
              Authorization: Bearer <token>
        └─> Response: { priceId, customerEmail, userId }
        └─> window.Paddle.Checkout.open({
              items: [{ priceId }],
              customer: { email: customerEmail },
              custom: { userId },
            })
              ↓
            Paddle overlay handles the checkout entirely
              ↓
            On success: Paddle webhook → Supabase /webhook-paddle (HMAC-SHA256)
              ↓
            subscriptions row written with provider='paddle'
```

**Why no `/success` redirect for Paddle:** Paddle's overlay SDK closes itself
and surfaces the success state inline; no full-page redirect needed.

## Account / cancellation flow

```
User on /account
  └─> sendMessage(extId, GET_AUTH_TOKEN) → check logged in
  └─> sendMessage(extId, GET_SUBSCRIPTION) → render plan + card info
  └─> User clicks "Cancel"
        └─> sendMessage(extId, CANCEL_SUBSCRIPTION)
              └─> Extension reads ps_sub_provider
                    └─> 'yookassa' → /functions/v1/cancel-subscription
                    └─> 'paddle'   → /functions/v1/cancel-subscription-paddle
              └─> Response: { success, expires_at }   (status flips to 'cancelled', plan stays 'pro' until expires_at)
```

## Skill ZIP download flow (`/dashboard/download-skill`)

```
User opens /dashboard/download-skill (linked from extension popup)
  └─> Page tries EXTENSION_IDS sequentially, calls GET_AUTH_TOKEN
        └─> If none respond: state = 'no_extension', render install CTA
        └─> If token returned but plan != pro: render upgrade CTA
        └─> If token + Pro: enable download button
  └─> Download button → GET /api/download-skill
        Authorization: Bearer <token from extension>
        └─> api/download-skill.ts:
              1. Validate JWT against Supabase auth/v1/user
              2. Query subscriptions WHERE plan=pro AND status IN (active, cancelled)
              3. If Pro: stream api/_assets/opten.zip with Content-Type: application/zip
              4. If not Pro: 403 { error: 'not_pro', upgrade_url: '/account?upgrade=skill' }
```

The auth check is defense-in-depth — the extension popup also gates the link.

## State summary

| State | Lives in | Who writes | Who reads |
|-------|----------|------------|-----------|
| Current language | `localStorage.opten_lang` | LangContext (client) | LangContext, `document.lang` |
| Payment currency | `localStorage.opten_pay_currency` | PayPage | PayPage |
| Auth token | Extension's `chrome.storage.local.ps_auth_token` | Extension OAuth | Extension (mirrored to site via `GET_AUTH_TOKEN`) |
| Subscription | Supabase `subscriptions` table | Webhooks (YooKassa, Paddle) | Edge Functions, extension, site (via extension) |
| Plan / quota | Extension `chrome.storage.local.ps_*` | Extension (synced from Supabase) | Site via `GET_SUBSCRIPTION` |

**The site has no persistent server-side state of its own.** All persistence
is either in the user's browser (localStorage, extension storage) or in
Supabase (owned by the extension repo).

## Build/asset notes

- [`api/_assets/opten.zip`](../../api/_assets/) — the Pro skill bundle. Bundled with the serverless function via `vercel.json` `includeFiles`. Update via `chore: refresh opten.zip` commits (see `12b3f17`).
- [`public/favicon-*.png`](../../public/) — 14 favicon sizes. Excessive — modern browsers need only a handful. Cleanup candidate.
- [`public/assets/welcome-{ru,en}-*.png`](../../public/assets/) — onboarding screenshots, one set per language.
- [`src/imports/`](../../src/imports/) — Figma-Make-generated SVG path dumps. Auto-generated; manual edits there get clobbered if the page is re-imported from Figma.
