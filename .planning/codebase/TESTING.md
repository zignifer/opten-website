# Testing Patterns

**Analysis Date:** 2026-05-16

## Test Framework

**None.**

- No Vitest, Jest, Mocha, or Node test runner configured. No `vitest.config.*`, `jest.config.*`, or `playwright.config.*` in the repo (verified via Glob — only matches are inside `node_modules/`).
- No `*.test.*` or `*.spec.*` files under `src/`, `api/`, or `scripts/` (only matches are inside `node_modules/`).
- No test-related `devDependencies` in `package.json:67-76` (no `vitest`, `jest`, `@testing-library/*`, `playwright`, `cypress`, `msw`).
- No `test` script in `package.json:6-9` — only `dev` and `build`.

## Test File Organization

Not applicable. There are no first-party tests.

## Mocking

Not applicable.

## Coverage

None measured. No coverage tool installed.

## The Only Quality Gate: `npm run build`

The single automated check on this repo is the Vite build:

```bash
npm run build
```

Defined in `package.json:7` — chains:
1. `vite build` (client bundle)
2. `vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir` (SSR bundle for prerender)
3. `vite build --ssr scripts/seo-routes.ts --outDir .ssr-meta` (SEO metadata bundle)
4. `node scripts/prerender.mjs` (static HTML for each route)
5. `node scripts/sitemap.mjs`

TypeScript errors surface here via `@vitejs/plugin-react` — there is **no `typecheck` script** and **no root `tsconfig.json`** (verified). TS checking is best-effort and lossy: a file with broken types may still compile if the offending construct happens to be stripped by the SWC transform.

There is no ESLint config in the repo (`.eslintrc*` absent at root). No formatter (`.prettierrc*` absent).

## Manual QA Surfaces

- **Local dev:** `npm run dev` → `http://localhost:5173`. Standard Vite HMR. Use Chrome DevTools for everything.
- **Vercel previews:** every push to a non-`main` branch builds a preview URL via Vercel. Push to `main` deploys to production (`opten.space`) — there is no staging environment between them.
- **Extension coupling:** to exercise `/pay`, `/account`, `/welcome`, or `/dashboard/download-skill`, you need the Opten Chrome extension installed and listed in `EXTENSION_IDS`. Site-side QA without the extension can only smoke-test the `extStatus === "not_installed"` UI branch.
- **Paddle sandbox:** set Vercel env `VITE_PADDLE_ENV=sandbox` + a sandbox `VITE_PADDLE_CLIENT_TOKEN` on a preview deployment to test USD checkout without taking real cards. Production envs are set per the regular Vercel project settings.
- **YooKassa:** sandbox flow is server-side, owned by the extension repo's Supabase Edge Functions. The site cannot drive YooKassa QA in isolation.

## Test Types

- **Unit tests:** none.
- **Integration tests:** none.
- **E2E tests:** none.
- **Visual regression:** none.
- **Lighthouse / perf:** not in repo. PageSpeed MCP is available locally per `MEMORY.md` and was used during Phase 2.x perf work, but results are not committed and there is no CI gate.

## Risk: Extension Integration Is Unverified

The site's most critical contract — the boundary with the Opten Chrome extension — has **zero automated coverage in this repo**:

- `chrome.runtime.sendMessage` shapes (`type: "GET_USER"`, `"GET_SUBSCRIPTION"`, etc.) defined in `docs/INTEGRATION-CONTRACT.md` §2 — no test asserts payload structure.
- `EXTENSION_IDS` constant is duplicated across `src/app/pages/PayPage.tsx:13-16`, `AccountPage.tsx:9-13`, `DownloadSkillPage.tsx`, and `api/download-skill.ts` — no test catches drift between them.
- Locked routes `/welcome`, `/pay`, `/success` — no test verifies they exist or render. The extension navigates here from already-shipped binaries; if `src/main.tsx:46-58` loses one of these routes during a refactor, the build still passes.
- Supabase Function URLs and the anon JWT are hardcoded as string literals — no test catches typos.

**Implication:** every change that touches billing, auth, the integration contract, or the locked routes must be manually validated against the extension before merging. The extension repo (`C:\Projects\promptscore`) has its own test surface, but it covers the extension side of the wire, not the site side. The two repos rely on **manual coordination + `docs/INTEGRATION-CONTRACT.md` as a binding spec** rather than executable tests.

## Common Patterns

Not applicable — no test code exists to demonstrate patterns.

---

*Testing analysis: 2026-05-16*
