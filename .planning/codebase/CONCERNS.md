# Codebase Concerns

**Analysis Date:** 2026-05-18

## Integration Contract Coupling

**Hardcoded constant duplication (4 files):**
- Constants: EXTENSION_IDS, SUPABASE_URL, SUPABASE_ANON_KEY duplicated in 4 files
- Files: src/app/pages/PayPage.tsx, src/app/pages/AccountPage.tsx, src/app/pages/DownloadSkillPage.tsx, api/download-skill.ts
- Issue: Supabase key rotation requires coordinated commits across 4 files plus extension repo. Risk of desynchronized deploys breaking billing.
- Fix: Extract to shared config module or Vercel env vars.

**Locked routes with no redirects:**
- /welcome, /pay, /success (hardcoded in extension v1.3.6)
- Renaming = 404 for old extension versions. No vercel.json safeguards.
- Fix: Add redirects first, deploy, wait 1 week, then remove old routes.

**externally_connectable message API (4-message contract):**
- GET_AUTH_TOKEN, GET_SUBSCRIPTION, CANCEL_SUBSCRIPTION, WARMUP
- Field removals break site. Never remove, only add optional fields.
- Current: GET_SUBSCRIPTION checked at runtime for plan==='cancelled' logic.

**Paddle SDK per-route injection:**
- Script tag injected into dist/pay/index.html and dist/en/pay/index.html ONLY by prerender.mjs
- DO NOT re-introduce to root index.html (undoes Phase 2.2 perf win)
- DO NOT use async/defer
- DO NOT call Environment.set('production') - Paddle v2 throws
- DO use ensurePaddle() for SPA navigation

**plan==='cancelled' logic - NOT free:**
- Cancelled-but-not-expired users must retain Pro access
- download-skill.ts checks status IN ('active', 'cancelled')
- Keep as defense-in-depth against future UI regressions

---

## Tech Debt

**UI ecosystem fragmentation:**
- Radix UI (24 primitives), Material-UI 7.3.5, Lucide 0.487
- Legacy: react-slick 0.31 (unused?), embla-carousel-react 8.6
- Two carousel libraries competing; MUI icons duplicate Lucide
- Fix: Audit carousel (Phase 5 uses Embla), remove react-slick, drop MUI icons

**Figma-Make-generated src/imports/ SVG paths (brittle):**
- Auto-generated paths. Re-export from Figma clobbers manual edits.
- Mitigation: Lock directory; re-imports go to staging, manual diff.

**package.json still named "@figma/my-make-file":**
- Confuses developers and logs. Rename to "opten-website" (private: true, no impact).

**recharts 2.15.2 and react-dnd likely dead code:**
- ~200 KB bundle cost on no visible feature.
- Remove if pre-Phase-5.

**14 favicon sizes (excessive):**
- Keep: 192px (Android), 180px (iOS), 32px (browser), .ico
- Drop: 57–152 (EOL iOS versions), 310 (Windows Phone EOL 2020)

---

## Route Inventory Sync Debt (Silent Build Failures)

**Routes hand-listed in 6+ files:**
- src/main.tsx (16 routes)
- scripts/seo-routes.ts (manifest)
- src/i18n/paths.ts (EN_SIBLINGS set, 9 routes)
- scripts/prerender.mjs, sitemap.mjs, llms.mjs, entry-server.tsx

**No CI gate - silent failures:**
- EN_SIBLINGS (9) MUST match EN routes in main.tsx (8 as of Phase 5 B-04/B-05)
- Developer can add /en/new-route to main.tsx but forget paths.ts
- Silent failure: route renders but LangSwitcher doesn't navigate (flips lang in place)
- Phase 4.1 B-03 added /en/about. Phase 5 B-04 added /en/blog (in set).

**Files to update together:**
- src/main.tsx (add /en/* Route)
- src/i18n/paths.ts (add to EN_SIBLINGS)
- scripts/seo-routes.ts (add RouteMeta with hreflang)

**Blog post routing friction:**
- /blog/:slug + /en/blog/:slug
- src/content/blog/ posts manually registered in paths.ts
- Only 1 post (/blog/gpt-image-2) currently. Friction to scale.

---

## Known Traps (Do Not Re-introduce)

**Runtime <html lang> mutation (Phase 3 D-06 AVOIDED):**
- renderToString bakes lang. Hydration fails if React mutates at runtime.
- DO NOT add useEffect that mutates document.documentElement.lang

**Lazy-loading SSR-prerendered routes (Phase 2 hotfix 80b16be):**
- renderToString cannot resolve React.lazy()
- PayPage eager (SSR); SuccessPage, AccountPage, DownloadSkillPage lazy (SPA-only)
- DO NOT lazy-load /, /pay, /welcome

**Bare <Link> instead of <LocalizedLink>:**
- <Link to="/pay"> on /en/* drops /en/ prefix
- DO NOT use <Link> for internal nav on bilingual routes

**opten.zip without vercel.json update:**
- api/_assets/opten.zip must be bundled via vercel.json includeFiles
- DO NOT move/delete ZIP without updating config

---

## Operational Risks

**Vercel project name is opten-website2 (not opten-website):**
- Name mismatch with git repo. Causes dashboard confusion.
- Locked by deployment history. Renaming requires re-setup.

**No release versioning - every push is a release:**
- package.json has no version field
- No staged rollout; rollback is git revert + push
- Manual UAT + post-deploy curl checks is the contract

**No automated tests:**
- No Jest/Vitest config or test files
- Regressions caught only post-deploy
- GSD phases include build verification + smoke tests

**Env vars in Vercel only (no .env):**
- VITE_PADDLE_ENV, VITE_PADDLE_CLIENT_TOKEN
- Switch requires manual Vercel edit + re-deploy
- Must coordinate with extension's create-payment-paddle priceIds

**Manual curl post-deploy (no synthetic monitoring):**
- Unmonitored window between deploy and manual check
- Startup errors (ZIP missing, Supabase unreachable) catch only if checked

---

## GEO/SEO Maintenance

**Bing Webmaster token placeholder:**
- index.html line 20: "BING_VERIFICATION_TOKEN_TODO"
- Awaits user registration. Replace, push, Bing picks up on next crawl.
- Non-blocking; IndexNow already provides discovery.

**IndexNow key deduplication (WR-02 fix):**
- public/<32-hex>.txt (single file, not per-route)
- Correctly deduped. No maintenance needed.

---

## Fragile Areas

**Currency state + lang interaction (Phase 66 D-04):**
- src/app/pages/PayPage.tsx lines 121–149
- Complex useRef state machine. Easy to regress.
- Keep comments; test currency+lang interactions.

**SSR vs hydration edge cases (Phase 2 D-06, Phase 3 D-05):**
- src/main.tsx hydration detector, src/i18n/LangContext.tsx
- localStorage in renderToString (guarded by typeof window check)
- Missing __PRERENDER_PATH marker misdetects SPA fallback
- Lang from URL (sync, SSR-safe) vs localStorage (async, browser-only)

---

## Missing Critical Features (Deferred to v2)

**HTTP 404 status code (Phase 6):**
- Currently: Vercel SPA rewrite returns 404 routes at HTTP 200
- Risk: Search engines see 200; SEO penalty if indexed as duplicate
- Mitigation: robots noindex/nofollow runtime-injected

---

*Concerns audit: 2026-05-18*
