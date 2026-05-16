# Codebase Concerns

**Analysis Date:** 2026-05-17
**Scope:** opten-website (public site) — extension coupling, locked surfaces, i18n drift surfaces, tech debt.

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

`scripts/prerender.mjs` injects a synchronous Paddle CDN `<script>` only into `dist/pay/index.html` (Phase 2.2) AND, post-Phase-3 (`5276b51`), into `dist/en/pay/index.html`. The integration contract requires `window.Paddle` available before `PayPage` mounts on direct `/pay` or `/en/pay` hits. Removing the prerender-time injection regresses the cold-load flow. `src/lib/paddle.ts:34` falls back to async injection for SPA-navigation hits — both paths must work. **Future:** if Phase 4 adds a third pricing URL, the injection allow-list in `scripts/prerender.mjs` MUST be widened.

---

## 2. Locked routes

Routes referenced by already-shipped extension binaries. Renames break the integration contract and cannot be hotfixed by deploying the site alone (would require a Chrome Web Store extension republish).

| Route | Owning component | Why locked |
|---|---|---|
| `/` | `src/app/App.tsx` | Public landing, sitemap root, OG card target |
| `/welcome` | `src/app/pages/WelcomePage.tsx` | Extension navigates here on first install |
| `/pay` | `src/app/pages/PayPage.tsx` | Extension popup upgrade CTA opens this URL; Paddle SDK preload hooks |
| `/success` | `src/app/pages/SuccessPage.tsx` | YooKassa `return_url` (hardcoded in Edge Function in the extension repo) |
| `/account` | `src/app/pages/AccountPage.tsx` | Extension popup "Manage subscription" link |
| `/dashboard/download-skill` | `src/app/pages/DownloadSkillPage.tsx` | Pro-gated skill ZIP download; JWT round-trip to `api/download-skill.ts` |
| `/privacy` | `src/app/pages/PrivacyPage.tsx` | Chrome Web Store listing requirement |
| `/terms` | `src/app/pages/TermsPage.tsx` | Linked from extension UI |
| `/refund` | `src/app/pages/RefundPage.tsx` | Linked from extension UI |

All 9 RU routes plus the 6 EN siblings are registered in `src/main.tsx`.

**Rule:** Phase 3 (`/en/*`) added paths — never replaced root paths. This holds permanently.

---

## 3. Bilingual i18n drift surfaces (post-Phase-3)

Phase 3 shipped path-prefix bilingual routing (D-01). Two post-release fixes (`c789dee` storage-key migration, `bfd164b` non-sibling switcher UX) cleaned up the immediate UX regressions, but four structural drift surfaces remain.

### 3.1 `EN_SIBLINGS` must stay in sync with `scripts/seo-routes.ts`

`src/i18n/paths.ts:9-16` defines `EN_SIBLINGS = Set<string>` — the allow-list driving `toEnTarget()`, `toRuTarget()`, and `localizeHref()`. `scripts/seo-routes.ts:138-247` defines the same 6 EN entries for prerender + sitemap + hreflang. The two files are **independent literals** — there is no shared source-of-truth and no build-time assertion that the sets match.

**Failure modes:**
- Add an EN route to `scripts/seo-routes.ts` only → page is prerendered + indexed, but `LocalizedLink` strips the `/en/` prefix when navigating to it from another EN page (user lands on RU sibling).
- Add to `EN_SIBLINGS` only → links localize, but the route is not prerendered (SSR returns SPA fallback) and not in sitemap (not indexed by Google).
- Remove from one but not the other → either dead links (404-like SPA fallback) or unindexed orphan.

**Mitigation in code:** `src/i18n/paths.ts:2-3` comment says "SYNC: EN_SIBLINGS MUST match the 6 EN entries in scripts/seo-routes.ts." Comment-as-enforcement only.

**Recommended:** when Phase 4 adds content routes, either (a) derive `EN_SIBLINGS` from `routes.filter(r => r.path.startsWith("/en/"))` at build time, or (b) add a unit/build assertion that both sets are equal.

### 3.2 Legacy `opten_lang` localStorage key — pending sunset

`src/i18n/LangContext.tsx:20-21` reads two keys:

- `opten_lang_v3` — current key, written only on explicit LangSwitcher click.
- `opten_lang` — legacy key, **read-only**, honored as a one-shot migration when value is exactly `"en"` (RU values intentionally ignored because older builds auto-wrote `"ru"` on detect, pinning EN-browser users to RU forever).

**Concern:** the legacy read path is dead weight after the stale-user population drops below ~1%. Estimated review window: 2026-08 to 2026-11 (3-6 months post-Phase-3). Remove `LEGACY_STORAGE_KEY` constant + the `legacy === "en"` branch in `detectLangFromStorage()` then.

### 3.3 `document.documentElement.lang` NOT updated on SPA toggle (intentional)

D-06 (Phase 2 hydration fix) removed the `useEffect` that wrote `document.documentElement.lang` on language change. The DOM `lang` attribute is now baked at prerender time only.

**Consequences:**
- Direct page loads on `/en/*` → correct (prerendered HTML has `<html lang="en">`).
- SPA toggle from `/` to `/en/` via LangSwitcher → URL changes, content re-renders in EN, but `document.documentElement.lang` stays `"ru"` until the next full page reload.

**Impact:**
- SEO/AI crawlers: none (they don't SPA-navigate; they request each URL fresh and see the correct prerendered `lang`).
- Accessibility (screen readers): borderline — most SRs re-read `lang` on document mutation, but the attribute itself doesn't change, only the text content does. Users who SPA-toggle inside a session may hear the new language pronounced under the old language's phoneme set until refresh.
- UX: none (users don't read `lang` attributes).

**Do not "fix" this without re-reading D-06** — the previous fix existed to eliminate the hydration mismatch that the write caused.

### 3.4 `LocalizedLink` is a convention, not enforcement

`src/app/components/LocalizedLink.tsx` only rewrites `to` when `useOnEnPath() === true` AND the target is in `EN_SIBLINGS`. Bare `<Link>` from `react-router` still works syntactically, but bare links from `/en/*` pages will **drop the `/en/` prefix** silently — the next page renders RU because URL is now unprefixed.

**Current usage (correct):** `src/app/App.tsx:11`, `src/app/pages/PayPage.tsx:4`, `src/app/pages/AccountPage.tsx:4`, `src/app/pages/DownloadSkillPage.tsx:3`, `src/app/pages/SuccessPage.tsx:3`, `src/app/components/layout/LegalLayout.tsx:3` — all use `LocalizedLink`. The only files importing `Link` directly from `react-router` are `LocalizedLink.tsx` itself (the wrapper) and routing infrastructure (`main.tsx`, `LangContext.tsx`, `LangSwitcher.tsx`).

**Regression risk:** when adding a new component with an internal navigation link, the natural autocomplete is `import { Link } from "react-router"`. Easy to ship a bare `<Link>` and not notice the EN-prefix drop until someone clicks it from `/en/*`.

**Convention:** `import LocalizedLink from "..."`, never `import { Link } from "react-router"` for internal navigation. Worth adding a brief note to `docs/ARCHITECTURE.md` or `CLAUDE.md` Conventions section.

### 3.5 `/pay` and `/en/pay` are head-only prerender tier

`scripts/seo-routes.ts:65,171` set `prerender: "head"` for both `/pay` URLs. This means: title, description, hreflang, OG tags, and Paddle SDK `<script>` tag are baked into the HTML, but the `<body>` is empty (SPA fallback fills it on hydration).

**Implication for Phase 4 (content surface) and GEO/AI optimization:** AI crawlers and SEO snippet extractors that don't execute JS see no pricing facts. Anyone scoring `/pay` for "what does Opten Pro cost?" gets nothing extractable from the HTML.

**Phase 4 consideration:** evaluate promoting `/pay` to `prerender: "full"` with a static pricing block (199₽/$2.99, 300 checks/mo, currency split) rendered server-side. The interactive Paddle modal can still be client-only — only the pricing facts need to be in the prerendered HTML for extraction. Trade-off: doubles the SSR work per build and ties the prerender pipeline to the pricing copy (it has to live in `entry-server.tsx` or be importable from there).

---

## 4. No automated safety net

Stated plainly: **the only check on every commit is `vite build`**.

- **No tests.** No Jest, Vitest, Playwright, or any test runner. `package.json` has no `test` script. Phase 3 verification (`22e767f`) was a one-off orchestrator Playwright sweep, not a recurring check.
- **No typecheck script.** `package.json` defines only `build` and `dev`. TS errors surface during `vite build` (Vite invokes the TS compiler for transforms), but `tsc --noEmit` is never run standalone.
- **No ESLint config.** No `.eslintrc*`, no `eslint.config.*`. The one `// eslint-disable-next-line react-hooks/exhaustive-deps` in `src/app/pages/DownloadSkillPage.tsx:28` is documentation, not enforcement.
- **No formatter.** No `.prettierrc`, no Biome config. Style drift is invisible until review.
- **CI surface.** Vercel runs `npm run build` on every push to `main`. That's it. Build green = deployed.

**Implication:** Refactors that touch coupling-prone files (PayPage, AccountPage, DownloadSkillPage, api/download-skill.ts) and i18n files (LangContext, paths, LocalizedLink) have no automated regression net. The §3 drift surfaces are especially exposed — there is nothing that fails CI if `EN_SIBLINGS` and `seo-routes.ts` go out of sync.

---

## 5. Fragile or generated code

### 5.1 `src/imports/` — Figma-Make-generated

| File | Lines | Risk |
|---|---|---|
| `src/imports/LandingPage/LandingPage.tsx` | 1445 | Auto-generated layout component. Currently unused by `App.tsx` but still bundled if imported. |
| `src/imports/LandingPage/svg-bvy0jfb1g6.ts` | 39 | SVG path strings consumed by `App.tsx`, `PayPage.tsx`, `AccountPage.tsx`. Editing any path breaks visuals across multiple pages. Filename hash is meaningless — do NOT rename. |
| `src/imports/Frame51/Frame51.tsx` | 553 | Auto-generated. Currently unused. |
| `src/imports/Frame2/Frame2.tsx` | 19 | Auto-generated. Currently unused. |
| `src/imports/Frame51/svg-phej6zj9ki.ts` | 17 | Auto-generated SVG paths. |

**Rule:** Treat `src/imports/**` as read-only. The `svgPaths.pXXXXXXXX` keys are referenced literally; hand-edits break references with no compile error (TS keys are open string indexes).

### 5.2 Large hand-edited files

| File | Lines | Concern |
|---|---|---|
| `src/app/pages/PayPage.tsx` | 636 | Phase 66 + Phase 2.2 + Phase 3 (`/en/pay` handling) logic, RUB/USD currency split, Paddle SDK warm-up, extension detection loop. High blast radius. |
| `src/app/App.tsx` | 555 | Landing component, hand-edited with `width`/`height` attrs on every `<img>` (Phase 2.1 D-04). |
| `src/app/pages/AccountPage.tsx` | 418 | Subscription state + cancel flow + extension detection. |

### 5.3 `vendored` shadcn-style UI

`src/app/components/ui/*` (50+ files: `accordion.tsx`, `dropdown-menu.tsx`, etc.) — copy-pasted shadcn-ui primitives. Not a dependency, no upstream sync. Most are unused by current pages.

---

## 6. Tech debt / TODOs

**Counts (excluding `.obsidian/`, `.claude/worktrees/`, `node_modules/`, `dist/`):**

| Marker | Count in `src/` | Locations |
|---|---|---|
| `TODO` / `FIXME` / `HACK` / `XXX` | **0** | None. |
| `@ts-ignore` / `@ts-expect-error` | **0** | None in `src/`. |
| `// eslint-disable*` | **1** | `src/app/pages/DownloadSkillPage.tsx:28` — `react-hooks/exhaustive-deps` on `useEffect(() => { void start(); }, [])` (intentional run-once-on-mount). |
| `as any` | **4 files** | `src/app/pages/AccountPage.tsx:95,152`, `src/app/pages/PayPage.tsx:180`, `src/app/pages/DownloadSkillPage.tsx:32` — all `(window as any).chrome`. Same pattern; would be cleaner with a typed `chrome` ambient declaration. |
| `as unknown` | **2** | `src/main.tsx:65` (`window as unknown as { __PRERENDER_PATH?: string }`), `src/app/components/Picture.tsx:53`. |

**Phase comments in code (intentional decision anchors, not debt):**

- `src/main.tsx`, `src/app/App.tsx`, `src/app/pages/PayPage.tsx` — Phase 2.1/2.2 decisions (D-04, D-05, D-06, D-10, D-12, D-19, D-20).
- `src/i18n/paths.ts`, `src/i18n/LangContext.tsx`, `src/app/components/LangSwitcher.tsx`, `src/app/components/LocalizedLink.tsx` — Phase 3 D-01/D-02/D-05/D-07 + post-3 follow-up notes (storage key bump, non-sibling switcher UX).
- `src/lib/paddle.ts` — Phase 2.2 conditional loader, BG-67-01 Paddle production-mode bug.
- `src/styles/theme.css`, `src/styles/fonts.css` — Phase 2.2 SSR hex extraction, BG-MOBILE-SCROLL-WHITE-01, font-display:block fix.
- `scripts/seo-routes.ts:2-8` — Phase 3 D-01/D-02 hreflang cluster contract.

These are decision anchors. Removing or editing the referenced code without re-reading the corresponding decision (in `.planning/phases/`) risks regressing the bug being avoided.

---

## 7. In-flight / deferred work

### 7.1 Phase 02.2 — no `.planning/phases/02.2-*/` directory

Phase 2.2 (mobile perf + Safari fixes) shipped as ~5-9 atomic commits (`0a73069`, `451af5b`, `3556fe4`, `39d2f4d`, `c353e5e`, `e9b24c6`, `15eb5c3`, `09341be`, `81284d4`) without per-task plan artifacts. ROADMAP.md Phase 2.2 section enumerates the scope; retroactive note in `02.1-VERIFICATION.md`. Phase closed 2026-05-16. Not a regression risk — recorded here only for traceability.

### 7.2 Phase 03 — closed, 2 post-release follow-ups landed

`.planning/STATE.md`: 8/8 plans shipped (closed 2026-05-16) plus 2 post-release i18n bugfixes (`c789dee`, `bfd164b`) on 2026-05-17. Full notes in `.planning/phases/03-bilingual-routing/03-POST-RELEASE.md`. The structural drift surfaces from these fixes are documented in §3.

### 7.3 Pending todos from earlier phases

`.planning/STATE.md`:

- Phase 2 OG card unfurl test (Telegram/Slack) — never confirmed.
- Phase 2 GEO rescore — partial (post-Phase-3 audit `2d3d6da` shows 12 → 30 → ~40 → 48 trajectory; `/geo audit` against fully-prerendered routes for Phase 2 baseline still pending the 2026-05-22 to 2026-05-29 window).
- Phase 2 lessons-learned writeup (anti-patterns for prerender phases) — not written.

### 7.4 Deferred items from earlier milestones

- **CSP header in `vercel.json`** — deferred at Phase 1 close; conflicts with Paddle inline script.
- **UI library audit** (Radix + MUI 7 + Lucide + react-slick + embla + react-dnd + recharts + …) — inherited from Figma Make origin; many likely unused but still in `package.json` dependencies.

### 7.5 Worktrees still on disk

`.claude/worktrees/clever-jennings-46d8c8` and `.claude/worktrees/great-lewin-dc6051` are present. These are stale agent worktrees; confirm tracked/dirty state before any cleanup.

---

## 8. Security surfaces (enumerate only)

| # | Surface | Location | Notes |
|---|---|---|---|
| 1 | JWT validation | `api/download-skill.ts:56-75` | Bearer extraction + `fetch(${SUPABASE_URL}/auth/v1/user)` round-trip. No signature verification client-side — relies on Supabase auth endpoint. |
| 2 | Pro subscription check | `api/download-skill.ts:82-101` | REST query on `subscriptions` table with `status=in.(active,cancelled)`. Uses anon key + user JWT (RLS enforces row scope). |
| 3 | Anon key exposure | `api/download-skill.ts:15-16`, `src/app/pages/PayPage.tsx:11`, `src/app/pages/AccountPage.tsx:7` | Anon key is by-design public, but its presence in 4 places amplifies the rotation cost. |
| 4 | `VITE_*` public env vars | `src/lib/paddle.ts:17-18` (`VITE_PADDLE_ENV`, `VITE_PADDLE_CLIENT_TOKEN`) | Bundled into client at build time. Paddle client token is by-design public. |
| 5 | `externally_connectable` origin lock | Extension manifest (`promptscore/manifest.json`) — `matches: ["*://opten.space/*"]` | Site cannot be hosted on any other origin without re-issuing the extension. |
| 6 | CORS lock on `api/download-skill` | `api/download-skill.ts:22` (`CORS_ORIGIN = "https://opten.space"`) | Hard-coded. Preview deployments on `*.vercel.app` cannot exercise the download endpoint. |
| 7 | Paddle webhook | **NOT in this repo.** | Webhooks live in the extension repo's Supabase Edge Functions. Site only opens the Paddle.Checkout overlay. |
| 8 | YooKassa webhook | **NOT in this repo.** | Same as Paddle. |
| 9 | Hash-token entrypoint | `src/app/pages/AccountPage.tsx:76-83` | Reads `window.location.hash` for `token=...` (extension-to-site handoff). Token is then sent to Supabase REST. |
| 10 | Open-redirect surface (LangSwitcher) | `src/app/components/LangSwitcher.tsx:35-51` + `src/i18n/paths.ts` | Mitigated by construction: targets computed from pure path rewriters operating against the `EN_SIBLINGS` allow-list. No user-controlled strings flow into `navigate()`. Documented inline at `paths.ts:5-7` and `LangSwitcher.tsx:12-14`. |
| 11 | Missing CSP header | `vercel.json` (deferred) | Acknowledged in `.planning/STATE.md`. Paddle inline script blocks a strict policy. |

**Audit not performed.** This is enumeration only — see `docs/INTEGRATION-CONTRACT.md` §4-7 for the security-relevant contract details.

---

## 9. Performance constraints (preserved invariants)

Phase 02.2 shipped without `.planning/` artifacts (see §7.1). Active perf constraints — **do not regress:**

1. Main JS chunk size — target `≤ 325 KB` per `02.1-VALIDATION.md:54`.
2. CLS = 0 — enforced by `width`/`height` attrs on every `<img>` (`src/app/App.tsx:14` comment).
3. Paddle SDK loads only on `/pay` and `/en/pay` (cold) or via `ensurePaddle()` (warm) — `src/lib/paddle.ts:34`. Never restore the sync `<script>` tag in `index.html`.
4. SPA-fallback routes stay `lazy()` — `src/main.tsx:14-17` is a hard invariant; violating it breaks SSR.
5. Hero animation render is deferred to client mount — `src/app/components/OptenHeroAnimation.tsx:45`. Removing the gate brings back the 30+ animated SVG paths to SSR markup.
6. Fonts: Unbounded WOFF2 self-hosted with `font-display: block` (post-fix); preload + adjusted-fallback prevents FOUT jump. `src/styles/fonts.css`.
7. EN dictionary stays lazy (`src/i18n/LangContext.tsx:42-75`). Static import of `en.json` on the SSR path only; client visitors still hit the dynamic-`import()` path. Reverting to a top-level static import re-burns ~13 KB gzip on every RU visit.

---

## 10. Historic (resolved)

Recorded so future passes don't re-discover them:

- **Pre-Phase-3 hydration mismatch on `/`** — resolved by Plan 03-01 (build-time `<html lang>` baking).
- **Bilingual URL strategy open question** — resolved by D-01 (path-prefix `/en/*`, not subdomain or `?lang=`).
- **LangSwitcher pinning EN-browser users to RU forever** — resolved 2026-05-17 (`c789dee`): bumped storage key from `opten_lang` to `opten_lang_v3` so older auto-written `"ru"` values stop dominating navigator.language detection. Legacy key still readable for one-shot EN migration (see §3.2 for sunset note).
- **LangSwitcher dumping non-sibling routes to `/en/` landing** — resolved 2026-05-17 (`bfd164b`): switcher now flips language in place (storage + context state) on `/account`, `/success`, `/dashboard/*` instead of navigating.

---

*Concerns audit: 2026-05-17*
