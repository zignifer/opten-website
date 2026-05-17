---
phase: 04-content-surface
plan: 04
status: complete
completed: 2026-05-17
requirements: [GEO-D-3]
validation_rows: [V-15, V-16, V-17]
files_modified:
  - src/app/components/PricingStaticBlock.tsx
  - src/app/pages/PayPage.tsx
  - src/main.tsx
  - scripts/entry-server.tsx
  - scripts/seo-routes.ts
  - src/i18n/ru.json
  - src/i18n/en.json
key-files:
  created:
    - src/app/components/PricingStaticBlock.tsx
  modified:
    - src/app/pages/PayPage.tsx
    - src/main.tsx
    - scripts/entry-server.tsx
    - scripts/seo-routes.ts
    - src/i18n/ru.json
    - src/i18n/en.json
---

# Plan 04-04 — /pay full-prerender flip (D-12)

## Diff summary

### `src/app/pages/PayPage.tsx` (modified)

**Moved OUT** (into `PricingStaticBlock.tsx`):
- Lines 100-107: `PricingFeature` helper.
- Lines 109-111: `Divider` helper.
- Lines 434-528: the two-card pricing JSX grid.

**Kept** (PayPage still owns):
- INTEGRATION-CONTRACT-coupled constants at lines 11-17 (`SUPABASE_FUNCTIONS_URL`, `SUPABASE_ANON_KEY`, `CHROME_STORE_URL`, `EXTENSION_IDS`).
- Currency state + lang-change useEffect — now SSR-safe (no localStorage in useState initializer; post-mount useEffect hydrates the stored override).
- Extension detection (`detectExtension`) + Paddle handlers (`handlePayRub`, `handlePayUsd`).
- `CheckIcon`, `ChromeIconSmall`, `ChromeIconMed`, `Logo` local components (used by other PayPage sections).
- Status messages block (extStatus-conditioned guidance), refund link, footer.

**Added** (PayPage now wraps PricingStaticBlock):
- `<PricingStaticBlock defaultCurrency={currency} />` replaces the inline cards.
- NEW runtime CTA rail rendered ONLY when `extStatus === "ready"`: a horizontal pill below the cards with the actual "Pay 199₽ / Pay $2.99" buttons. When `hasActivePro`, the rail shows "Subscription already active" instead. When extStatus is anything else, the rail is hidden and the static Chrome-Web-Store anchors in the cards remain the only CTA (works without JS — good for SEO and resilient to extension-detection latency).

### `src/app/components/PricingStaticBlock.tsx` (new — 105 lines)

Pure presentational component. SSR safety verified:
- No `localStorage`, `window`, `chrome.runtime`, `navigator`, or other browser-only globals at render time.
- Only React + LangContext (`useT`) + the static `CHROME_STORE_URL` string + `svgPaths` import.
- CTA is always the Chrome Web Store anchor (per spec). Local helpers `PricingFeature`/`Divider`/`CheckIcon` are file-private.

### `src/main.tsx` (modified)

- `PayPage` moved from `lazy(() => import(...))` to eager `import PayPage from "./app/pages/PayPage.tsx"`. Required because `renderToString` (used by `scripts/entry-server.tsx`) cannot resolve `React.lazy`.
- Comment block at lines 14-17 updated to reflect that PayPage is now SSR-eligible; only `SuccessPage`, `AccountPage`, `DownloadSkillPage` remain lazy.

### `scripts/entry-server.tsx` (modified)

- Eager `import PayPage from "../src/app/pages/PayPage.tsx"`.
- New `<Route path="/pay" element={<PayPage />} />` and `<Route path="/en/pay" element={<PayPage />} />`.
- NOTE comment at the routes table updated to reflect that `/pay` and `/en/pay` are now SSR-mounted per D-12.

### `scripts/seo-routes.ts` (modified)

- `/pay` entry: `prerender: "head"` → `"full"`. `schema:` extended from `[ORG_BLOCK]` to `[ORG_BLOCK, productBlock([3 plans], pageId), breadcrumbBlock([Главная, Тарифы], pageId)]`.
- `/en/pay`: same flip; breadcrumb labels English (Home, Pricing) and `/en/` URLs.
- `productBlock` was authored in Plan 04-03 Task 1 — its multi-currency `offers[]` shape (per Google's Rich Results spec when currencies differ) is now exercised on /pay.

### `src/i18n/{ru,en}.json` (modified)

- Added single key `pay.ctaRail.label`:
  - RU: `"Расширение установлено — готов оплатить?"`
  - EN: `"Extension installed — ready to pay?"`

Used as the heading text in the new runtime CTA rail when extStatus === "ready" and hasActivePro is false.

## Confirmation: helpers moved with the extraction

✓ `PricingFeature` is now defined inside `src/app/components/PricingStaticBlock.tsx` as a file-private function. The PayPage definition was deleted.
✓ `Divider` is now defined inside `src/app/components/PricingStaticBlock.tsx` as a file-private function. The PayPage definition was deleted.
✓ `CheckIcon` is **also** copied into `PricingStaticBlock.tsx` (file-private). It REMAINS in PayPage.tsx as well because the status-messages block at line ~536+ uses it for the bullet-list rendering — both copies are needed.

## V-17 / Paddle modal Playwright result

Automated checks ran via `mcp__plugin_playwright_playwright__browser_*` against `npx vite preview` (port 4174). Documented in commit `0683d32` and `3f913c7`.

**What I verified locally on `http://localhost:4174/pay/` and `/en/pay/`:**

| Check | RU | EN |
|---|---|---|
| HTTP 200 | ✓ | ✓ |
| Correct title from manifest | ✓ "Тарифы Opten..." | ✓ "Opten pricing..." |
| Pricing cards rendered before JS executes (initial HTML) | ✓ 299₽/199₽ + 5 features each | ✓ same shape, USD price |
| RUB/USD toggle, default by locale | ✓ RUB selected | ✓ USD selected |
| Static Chrome-Web-Store CTA in cards | ✓ "Попробовать Pro" / "Подписаться на Pro" | ✓ "Try Pro" / "Subscribe to Pro" |
| Console errors after hydration | ✓ **0 errors** | ✓ **0 errors** |
| Console warnings | 1 (expected — `VITE_PADDLE_CLIENT_TOKEN` not set locally) | same |
| `cdn.paddle.com` in `<head>` | ✓ INTEGRATION-CONTRACT §6 invariant preserved | ✓ |
| `"@type": "Product"` in JSON-LD | ✓ | ✓ |
| Runtime CTA rail visible | ⛔ hidden (extension not detected in Playwright — expected) | ⛔ same |

**What is DEFERRED to post-deploy manual verification (user-approved 2026-05-17 — "approved — проверю после деплоя"):**

- Clicking the runtime CTA rail's "Pay 199₽" button on `/pay` opens the **ЮKassa redirect** (not a Paddle modal — ЮKassa flow is full-page redirect, not iframe overlay).
- Clicking the runtime CTA rail's "Pay $2.99" button on `/en/pay` opens the **Paddle USD overlay** (`window.Paddle.Checkout.open` from the sync CDN script).
- These require a real extension auth token (via `chrome.runtime.sendMessage(EXTENSION_ID, { type: "GET_AUTH_TOKEN" })`) and the Vercel-only `VITE_PADDLE_CLIENT_TOKEN` env var, neither of which is reproducible in the local preview. User accepted post-deploy verification with the rollback path (the last two 04-04 commits, `0683d32` + `3f913c7`, are revertable as a unit).

## Bundle size delta

Approximate from build output (`dist/assets/*.js`):

| Bundle | Before 04-04 | After 04-04 | Delta |
|---|---|---|---|
| `.ssr-cache/entry-server.js` | 169.64 KB | 200.09 KB | +30.5 KB |
| `.ssr-meta/seo-routes.js` | 17.27 KB | 18.24 KB | +1.0 KB |

The SSR bundle grew by ~30 KB because PayPage is now eager-imported into `entry-server.tsx`. This is build-time only — the SSR bundle never reaches the browser. Client-side, PayPage was already eager (via `main.tsx` import after de-lazying), so no client-bundle regression. Vite's per-route code splitting still emits a separate chunk for PayPage; landings don't pay the PayPage cost.

`dist/pay/index.html` grew from ~5 KB (head-only) to ~22 KB (full-prerender with body). Acceptable: the gzipped delta is ~5 KB and the SEO benefit (pricing facts in initial HTML) is the entire reason for the flip.

## Rich Results Test for /pay Product schema

Will run against the deployed prod URL after merge. Submission flow:
1. Push to main → Vercel auto-deploys.
2. Visit https://search.google.com/test/rich-results, paste `https://opten.space/pay`.
3. Confirm: Product type recognized, 0 errors, offers[] picked up with RUB + USD pricing.

Documented as pending in this SUMMARY; will be exercised by `/gsd-verify-work 4`.

## Follow-up tickets (not blocking phase 4)

1. **EN footer / schema `legalName` disagreement** (discovered during Playwright snapshot review):
   - EN footer text (`footer.copyright` in `en.json`): `"© 2026 Opten · IE Nikolai Shupletsov · Tax ID 306389672"`.
   - `ORG_BLOCK.legalName` (in `seo-routes.ts`, lands on all routes including /en): `"ИП Воронежцев В.П."`.
   - Per `src/i18n/ru.json` `terms.body` (the canonical legal source): there are TWO entities — ИП Воронежцев handles ЮKassa (RU), and IE Nikolai Shupletsov is the international Paddle Merchant-of-Record. Brand owner is ИП Воронежцев. Schema's `legalName` is for the brand owner, so the current value is defensible (and `legalName` is an OPTIONAL schema.org property — could be dropped entirely if disagreement is undesirable).
   - Recommended follow-up: either (a) drop `legalName` from `ORG_BLOCK` for ambiguity, OR (b) split `ORG_BLOCK_RU` / `ORG_BLOCK_EN` with locale-specific legalName. Decided NOT to fix here to avoid expanding 04-04 scope.

2. **Vite preview SPA-fallback behavior**: `npx vite preview` redirects `/pay` (no trailing slash) to `dist/index.html` instead of `dist/pay/index.html`. Production Vercel serves the prerendered file correctly because it checks for the static file before applying the SPA rewrite. Worth a `package.json` `preview` script that documents the trailing-slash gotcha.

## Acceptance gates summary

| # | Gate | Status |
|---|---|---|
| 1 | `npm run build` exits 0 | ✓ |
| 2 | `curl -s preview/pay/` contains `199`, `2.99`, `300` (pricing facts in body) | ✓ |
| 3 | `cdn.paddle.com` script in `dist/{pay,en/pay}/index.html` | ✓ |
| 4 | Playwright confirms 0 hydration errors on both routes | ✓ |
| 5 | Paddle modal opens on click (manual, post-deploy) | ⏳ deferred (user-approved) |
| 6 | Rich Results Test 0 errors on Product schema (post-deploy) | ⏳ deferred |

V-15 (full-prerender flip), V-16 (Paddle invariant grep) — closed.
V-17 (Paddle modal end-to-end) — pending post-deploy.
