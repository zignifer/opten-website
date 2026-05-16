# Codebase Concerns

**Analysis Date:** 2026-05-16
**Scope:** opten-website (public site) — extension coupling, locked surfaces, tech debt, in-flight perf work.

---

## 1. Integration coupling risks

Every change in this repo must be cross-checked against `C:\Projects\promptscore` (private extension repo). The binding contract is `docs/INTEGRATION-CONTRACT.md`. Concrete coupling points where a silent edit here breaks the shipped extension:

### 1.1 Duplicated constants (drift = silent break)

Same literal values copy-pasted across 4 site files plus the extension's `config/api.js`. Any divergence is a runtime break with no compile-time guard.

| Constant | Site occurrences |
|---|---|
| `SUPABASE_URL = "https://vuywydhwkqmihfztpkgl.supabase.co"` | `api/download-skill.ts:14`, `src/app/pages/PayPage.tsx:10` (as `SUPABASE_FUNCTIONS_URL`), `src/app/pages/AccountPage.tsx:6`, `src/app/pages/DownloadSkillPage.tsx` (only via fetch, no const) |
| `SUPABASE_ANON_KEY = "eyJ...A2O5qbj4PnKwQsshPtG7vrbKg"` | `api/download-skill.ts:15-16`, `src/app/pages/PayPage.tsx:11`, `src/app/pages/AccountPage.tsx:7` |
| `EXTENSION_IDS = ["iphkppgbobpilmphloffcalicmejacfl", "kcmcaeenfmfnpiaihicecnfnagejpcog"]` | `src/app/pages/PayPage.tsx:13-16`, `src/app/pages/AccountPage.tsx:9-12`, `src/app/pages/DownloadSkillPage.tsx:5-8` |
| `CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl"` | `src/app/pages/PayPage.tsx:12`, `src/app/pages/AccountPage.tsx:8` |

**Failure mode:** If someone updates only one file (e.g. rotates the anon key in `PayPage.tsx` but not `AccountPage.tsx`), `vite build` passes — the regression surfaces only at runtime, only on the un-updated page, and only against real Supabase. No grep gate enforces parity.

**Mitigation gap:** No `src/lib/constants.ts` shared module. No build-time assertion. `CLAUDE.md:28-30` documents the duplication but does not prevent it.

### 1.2 `externally_connectable` message contract

Site is one half of a 4-message protocol (`docs/INTEGRATION-CONTRACT.md` §2.2). Site calls:

- `GET_AUTH_TOKEN` — `src/app/pages/PayPage.tsx:189`, `src/app/pages/AccountPage.tsx:103`, `src/app/pages/DownloadSkillPage.tsx:43`
- `CANCEL_SUBSCRIPTION` — `src/app/pages/AccountPage.tsx:156`

Renaming a message type, changing a response field (`response.token`, `response.email`), or removing an extension ID from `EXTENSION_IDS` breaks already-shipped extension binaries. The extension manifest's `externally_connectable.matches` is `opten.space`-only, so localhost cannot exercise this path (`INTEGRATION-CONTRACT.md:55`).

### 1.3 Hydration / SSR contract with prerender

`src/main.tsx:65-72` relies on `window.__PRERENDER_PATH` written by `scripts/prerender.mjs`. SPA-fallback routes (`/account`, `/dashboard/download-skill`, `/success`) are intentionally lazy-loaded and must NOT be moved out of `lazy()` — comment at `src/main.tsx:14-17` warns that adding them to the eager-import list breaks `renderToString` because `React.lazy` cannot resolve during SSR. Recent precedent: Phase 2 hotfix `80b16be`.

### 1.4 Paddle SDK script tag

`scripts/prerender.mjs` injects a synchronous Paddle CDN `<script>` only into `dist/pay/index.html` (Phase 2.2). The integration contract requires `window.Paddle` available before `PayPage` mounts on direct `/pay` hits. Removing the prerender-time injection regresses the cold-load flow. `src/lib/paddle.ts:34` falls back to async injection for SPA-navigation hits — the two paths must both work.

---

## 2. Locked routes

Routes referenced by already-shipped extension binaries. Renames break the integration contract and cannot be hotfixed by deploying the site alone (would require a Chrome Web Store extension republish).

| Route | Owning component | Why locked |
|---|---|---|
| `/` | `src/app/App.tsx` | Public landing, sitemap root, OG card target |
| `/welcome` | `src/app/pages/WelcomePage.tsx` | Extension navigates here on first install (`chrome.runtime.openOptionsPage`-adjacent flow) |
| `/pay` | `src/app/pages/PayPage.tsx` | Extension popup upgrade CTA opens this URL; Paddle SDK preload hooks |
| `/success` | `src/app/pages/SuccessPage.tsx` | YooKassa `return_url` (hardcoded in Edge Function in the extension repo) |
| `/account` | `src/app/pages/AccountPage.tsx` | Extension popup "Manage subscription" link |
| `/dashboard/download-skill` | `src/app/pages/DownloadSkillPage.tsx` | Pro-gated skill ZIP download; JWT round-trip to `api/download-skill.ts` |
| `/privacy` | `src/app/pages/PrivacyPage.tsx` | Chrome Web Store listing requirement |
| `/terms` | `src/app/pages/TermsPage.tsx` | Linked from extension UI |
| `/refund` | `src/app/pages/RefundPage.tsx` | Linked from extension UI |

All 9 routes are registered in `src/main.tsx:49-57`.

**Rule:** Phase 3 (bilingual `/ru/*` `/en/*`) must ADD paths, never replace these root paths (`.planning/STATE.md:98`).

---

## 3. No automated safety net

Stated plainly: **the only check on every commit is `vite build`**.

- **No tests.** No Jest, Vitest, Playwright, or any test runner. `package.json` has no `test` script.
- **No typecheck script.** `package.json:6-9` defines only `build` and `dev`. TS errors surface during `vite build` (because Vite invokes the TS compiler for transforms), but `tsc --noEmit` is never run standalone.
- **No ESLint config.** No `.eslintrc*`, no `eslint.config.*`. The one `// eslint-disable-next-line react-hooks/exhaustive-deps` in `src/app/pages/DownloadSkillPage.tsx:28` is documentation, not enforcement.
- **No formatter.** No `.prettierrc`, no Biome config. Style drift is invisible until review.
- **CI surface.** Vercel runs `npm run build` on every push to `main` (`package.json:7`). That's it. Build green = deployed.

**Implication:** Refactors that touch coupling-prone files (PayPage, AccountPage, DownloadSkillPage, api/download-skill.ts) have no automated regression net. Manual smoke tests on a deployed preview are the only verification — see `.planning/phases/02.1-hydration-and-perf/02.1-VALIDATION.md:14`.

---

## 4. Fragile or generated code

### 4.1 `src/imports/` — Figma-Make-generated

| File | Lines | Risk |
|---|---|---|
| `src/imports/LandingPage/LandingPage.tsx` | 1445 | Auto-generated layout component. Original Figma-Make export. **Currently unused by App.tsx** but still bundled if imported. |
| `src/imports/LandingPage/svg-bvy0jfb1g6.ts` | 39 | SVG path strings consumed by `App.tsx`, `PayPage.tsx`, `AccountPage.tsx`. Editing any path here breaks visuals across multiple pages. Filename hash is meaningless — do NOT rename. |
| `src/imports/Frame51/Frame51.tsx` | 553 | Auto-generated. Currently unused. |
| `src/imports/Frame2/Frame2.tsx` | 19 | Auto-generated. Currently unused. |
| `src/imports/Frame51/svg-phej6zj9ki.ts` | 17 | Auto-generated SVG paths. |

**Rule:** Treat `src/imports/**` as read-only. The `svgPaths.pXXXXXXXX` keys are referenced literally (`PayPage.tsx:42-46` etc.); hand-edits break references with no compile error (TS keys are open string indexes).

**Note:** `src/imports/LandingPage/` also stores binary asset hashes (`*.png`, `*.webp`) imported by `App.tsx` and `PayPage.tsx`. Renaming or deleting these files breaks the landing page.

### 4.2 Large hand-edited files

| File | Lines | Concern |
|---|---|---|
| `src/app/pages/PayPage.tsx` | 636 | Carries Phase 66 + Phase 2.2 logic, RUB/USD currency split, Paddle SDK warm-up, extension detection loop. High blast radius. |
| `src/app/App.tsx` | 555 | Landing component, hand-edited with width/height attrs on every `<img>` (Phase 2.1 D-04, line 14). |
| `src/app/pages/AccountPage.tsx` | 418 | Subscription state + cancel flow + extension detection. |

### 4.3 `vendored` shadcn-style UI

`src/app/components/ui/*` (50+ files: `accordion.tsx`, `dropdown-menu.tsx`, etc.) — copy-pasted shadcn-ui primitives. Not a dependency, no upstream sync. Treat as project code, but most are unused by current pages (only `button`, `dialog`-family touched in `App.tsx` indirectly).

---

## 5. Tech debt / TODOs

**Counts (excluding `.obsidian/`, `.claude/worktrees/`, `node_modules/`, `dist/`):**

| Marker | Count in `src/` | Locations |
|---|---|---|
| `TODO` / `FIXME` / `HACK` / `XXX` | **0** | None — surprisingly clean for a 2k-line app codebase. |
| `@ts-ignore` / `@ts-expect-error` | **0** | None in `src/`. |
| `// eslint-disable*` | **1** | `src/app/pages/DownloadSkillPage.tsx:28` — `react-hooks/exhaustive-deps` on `useEffect(() => { void start(); }, [])` (intentional run-once-on-mount). |
| `as any` | **4 files** | `src/app/pages/AccountPage.tsx:95,152`, `src/app/pages/PayPage.tsx:180`, `src/app/pages/DownloadSkillPage.tsx:32` — all `(window as any).chrome`. Same pattern; would be cleaner with a typed `chrome` ambient declaration. |
| `as unknown` | **2** | `src/main.tsx:65` (`window as unknown as { __PRERENDER_PATH?: string }`), `src/app/components/Picture.tsx:53`. |

**Phase comments left in code (intentional, not debt — but mark the assumption surface):**

- `src/main.tsx:14, 23, 29` — Phase 2.1 D-01, Phase 2.2, Phase 2 D-06 invariants
- `src/app/App.tsx:14, 15, 66, 274, 300, 351` — Phase 2.1 D-04/D-05, Phase 2.2 fetchPriority/JSX whitespace/eager-load decisions
- `src/app/pages/PayPage.tsx:18, 118, 168, 266, 276, 325, 338, 343, 404, 439` — Phase 66 currency state, Phase 2.2 Paddle warm-up, D-04/D-10/D-12/D-19/D-20 decisions
- `src/lib/paddle.ts:1, 23` — Phase 2.2 conditional loader, BG-67-01 Paddle production-mode bug
- `src/styles/theme.css:129, 188-192` — Phase 2.2 SSR hex extraction, BG-MOBILE-SCROLL-WHITE-01

These are decision anchors. Removing or editing the referenced code without re-reading the corresponding decision (in `.planning/phases/`) risks regressing the bug being avoided.

---

## 6. Half-finished work in flight

### 6.1 Phase 02.2 — no `.planning/phases/02.2-*/` directory

Five commits on `main` mention Phase 02.2 (perf work):

```
c353e5e fix(02.2): use font-display:block for Unbounded
39d2f4d perf(02.2): eliminate FOUT jump — preload Unbounded + adjusted-fallback metrics
3556fe4 perf(02.2): self-host fonts as WOFF2, drop Google Fonts @import
451af5b perf(02.2): split main bundle, eager-load first below-fold images, gate hero animation, clean SSR markup
0a73069 perf(02.2): load Paddle SDK only on /pay (was sync on every route)
```

**Gap:** `.planning/phases/` contains `01-static-geo-foundations`, `02-per-route-prerender-per-route-metadata`, `02.1-hydration-and-perf` — but **no `02.2-*` directory**. There is no SPEC/PLAN/SUMMARY artifact for the 5 shipped commits. Phase 2.2 was apparently executed ad-hoc, bypassing GSD planning. The work is shipped (production-deployed via Vercel auto-deploy) but undocumented in `.planning/`.

### 6.2 Phase 02.1 state

`.planning/STATE.md:31` says `Status: Phase complete — ready for verification`. `progress.completed_plans: 15` out of 16 (94%). The phase has 7 plans and all 7 have `*-SUMMARY.md` artifacts. The "1 plan outstanding" likely reflects the post-deploy Lighthouse + tap-latency checkpoint (`02.1-07-03`) that requires production measurement — see `02.1-VALIDATION.md:55` ("manual" verification type).

### 6.3 Pending todos from earlier phases

`.planning/STATE.md:86-90` lists carried-over items:

- Phase 2 OG card unfurl test (Telegram/Slack) — never confirmed
- Phase 2 GEO rescore — gated on the 2026-05-22 to 2026-05-29 window
- Phase 2 lessons-learned writeup (anti-patterns for prerender phases)
- Phase 3 prerequisite: per-language URL strategy (`/ru/*` vs `?lang=` vs subdomain) — **blocks Phase 3 detailed planning**

### 6.4 Deferred items from earlier milestones

`.planning/STATE.md:104-107`:

- **CSP header in `vercel.json`** — deferred at Phase 1 close; conflicts with Paddle inline script.
- **UI library audit** (Radix + MUI 7 + Lucide + react-slick + embla + react-dnd + recharts + …) — inherited from Figma Make origin; many likely unused but still in `package.json` dependencies. Bundle still carries them via static analysis exclusion.

### 6.5 Worktrees still on disk

`.claude\worktrees\clever-jennings-46d8c8` and `.claude\worktrees\great-lewin-dc6051` are present at the repo root (visible via grep of `externally_connectable`). These are stale agent worktrees; whether they're tracked/dirty should be confirmed before any aggressive cleanup.

---

## 7. Security surfaces (enumerate only)

| # | Surface | Location | Notes |
|---|---|---|---|
| 1 | JWT validation | `api/download-skill.ts:56-75` | Bearer extraction + `fetch(${SUPABASE_URL}/auth/v1/user)` round-trip. No signature verification client-side — relies on Supabase auth endpoint. |
| 2 | Pro subscription check | `api/download-skill.ts:82-101` | REST query on `subscriptions` table with `status=in.(active,cancelled)`. Uses anon key + user JWT (RLS enforces row scope). |
| 3 | Anon key exposure | `api/download-skill.ts:15-16`, `src/app/pages/PayPage.tsx:11`, `src/app/pages/AccountPage.tsx:7` | Anon key is by-design public, but its presence in 4 places amplifies the rotation cost. |
| 4 | `VITE_*` public env vars | `src/lib/paddle.ts:17-18` (`VITE_PADDLE_ENV`, `VITE_PADDLE_CLIENT_TOKEN`) | Bundled into client at build time. Paddle client token is by-design public. |
| 5 | `externally_connectable` origin lock | Extension manifest (`promptscore/manifest.json`) — `matches: ["*://opten.space/*"]` | Site cannot be hosted on any other origin without re-issuing the extension. |
| 6 | CORS lock on `api/download-skill` | `api/download-skill.ts:22` (`CORS_ORIGIN = "https://opten.space"`) | Hard-coded. Preview deployments on `*.vercel.app` cannot exercise the download endpoint. |
| 7 | Paddle webhook | **NOT in this repo.** | Webhooks live in the extension repo's Supabase Edge Functions. Site only opens the Paddle.Checkout overlay (`src/app/pages/PayPage.tsx:266+`). |
| 8 | YooKassa webhook | **NOT in this repo.** | Same as Paddle — Edge Function in extension repo. |
| 9 | Hash-token entrypoint | `src/app/pages/AccountPage.tsx:76-83` | Reads `window.location.hash` for `token=...` (likely an extension-to-site handoff). Token is then sent to Supabase REST. |
| 10 | Missing CSP header | `vercel.json` (deferred) | Acknowledged in `.planning/STATE.md:107`. Paddle inline script blocks a strict policy. |

**Audit not performed.** This is enumeration only — see `docs/INTEGRATION-CONTRACT.md` §4-7 for the security-relevant contract details.

---

## 8. Performance constraints (recent work)

Phase 02.2 shipped without `.planning/` artifacts (see §6.1). The 5 commits touched:

| Commit | Area | Files |
|---|---|---|
| `0a73069` perf(02.2): load Paddle SDK only on `/pay` | Paddle SDK no longer in every route's HTML | `src/lib/paddle.ts:1-50`, `scripts/prerender.mjs`, `src/main.tsx:23-27` (sync `<script>` removed from `index.html`) |
| `451af5b` perf(02.2): bundle split + eager-load below-fold imgs + gate hero animation + clean SSR markup | Main chunk split; `OptenHeroAnimation` defers render until client mount | `src/app/components/OptenHeroAnimation.tsx:45+` (Phase 2.2 client-mount gate), `src/app/App.tsx:300,351` (first below-fold images promoted to eager) |
| `3556fe4` perf(02.2): self-host fonts as WOFF2 | Drop Google Fonts `@import` from CSS | `src/styles/fonts.css:1` (Phase 2.2 comment) |
| `39d2f4d` perf(02.2): preload Unbounded + adjusted-fallback metrics | Eliminate FOUT jump | `src/styles/fonts.css`, `index.html` `<link rel=preload>` |
| `c353e5e` fix(02.2): `font-display:block` for Unbounded | Adjusted-fallback was visually wrong | `src/styles/fonts.css` |

**Active perf constraints (do not regress):**

1. Main JS chunk size — target `≤ 325 KB` per `02.1-VALIDATION.md:54`.
2. CLS = 0 — enforced by `width`/`height` attrs on every `<img>` (`src/app/App.tsx:14` comment; `02.1-VALIDATION.md:50`).
3. Paddle SDK loads only on `/pay` (cold) or via `ensurePaddle()` (warm) — `src/lib/paddle.ts:34`. Never restore the sync `<script>` tag in `index.html`.
4. SPA-fallback routes stay `lazy()` — `src/main.tsx:14-17` is a hard invariant; violating it breaks SSR.
5. Hero animation render is deferred to client mount — `src/app/components/OptenHeroAnimation.tsx:45`. Removing the gate brings back the 30+ animated SVG paths to SSR markup.
6. Fonts: Unbounded WOFF2 self-hosted with `font-display: block` (post-fix); preload + adjusted-fallback prevents FOUT jump. `src/styles/fonts.css`.

---

*Concerns audit: 2026-05-16*
