## Project

**opten.space** — public website for the **Opten** Chrome extension. Vite +
React 18 + TypeScript + Tailwind 4, SPA, deployed on Vercel.

Three jobs: (1) marketing surface (landing in RU/EN), (2) billing surface
(`/pay`, `/account`, `/success` for YooKassa RUB + Paddle USD), (3) Pro-only
utilities (`/dashboard/download-skill` skill ZIP download).

The site is **not the product** — the extension is. The site exists to sell,
service, and onboard extension users.

## CRITICAL: Read this before any change to billing/auth/routes/integration

The site is tightly coupled with the **Opten Chrome extension** at
`C:\Projects\promptscore` (private repo `zignifer/promptscore`). Coupling
points: `externally_connectable` message API, fixed URL paths (`/welcome`,
`/pay`, `/success`), Supabase Edge Functions, hardcoded constants
(`EXTENSION_IDS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`).

**Before editing anything that touches those areas, read [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md).** It is the binding interface. Renames or removals on either side are breaking changes.

Locked routes (referenced by already-shipped extension binaries — do not rename):
- `/welcome` — extension navigates here on first install
- `/pay` — extension opens this from popup upgrade CTA
- `/success` — YooKassa `return_url`

Hardcoded constants that are duplicated and must be kept in sync:
- `EXTENSION_IDS` — appears in [src/app/pages/PayPage.tsx](src/app/pages/PayPage.tsx), [src/app/pages/AccountPage.tsx](src/app/pages/AccountPage.tsx), [src/app/pages/DownloadSkillPage.tsx](src/app/pages/DownloadSkillPage.tsx)
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` — appears in those three files plus [api/download-skill.ts](api/download-skill.ts) plus the extension's `config/api.js`

## Tech stack

- **Vite 6** + **React 18.3** + **React Router 7** + **TypeScript** + **Tailwind 4**
- **UI:** Radix UI primitives + MUI 7 icons + Lucide + `motion` for animation
- **Forms:** `react-hook-form`
- **Payments:** Paddle.js v2 (synchronous CDN script in `index.html`)
- **Backend:** plain `fetch` to Supabase REST + Functions (no `@supabase/supabase-js`)
- **Deploy:** Vercel, one serverless function at `api/download-skill.ts`
- **i18n:** Custom React context, RU/EN, `localStorage.opten_lang` + `navigator.language` detection

No tests, no ESLint config, no `typecheck` script. TS errors surface during
`vite build` (`npm run build`).

See [docs/TECH.md](docs/TECH.md) for full picture.

## Related repositories

| Repo | Path | Role |
|------|------|------|
| opten-website (this) | `C:\Projects\opten-website` | Public site |
| promptscore (private) | `C:\Projects\promptscore` | Chrome extension + Supabase Edge Functions + migrations + Paddle/YooKassa webhooks |
| opten-proxy (private) | `C:\Projects\promptscore-proxy` | Vercel proxy for the extension's AI requests (not used by the site) |

The extension repo owns the Supabase project — all Edge Functions and
migrations are deployed from there, not from this repo.

## Architecture

```
index.html  ─sync→  Paddle.js CDN
     │
     └→ main.tsx (Paddle.Initialize) → <LangProvider> → <BrowserRouter>
            ↓
        8 routes: /, /pay, /success, /account, /welcome, /privacy, /terms,
                  /refund, /dashboard/download-skill

  Site ↔ Extension:    chrome.runtime.sendMessage (externally_connectable, opten.space only)
  Site → Supabase:     fetch to /functions/v1/* and /rest/v1/*
  Site → Paddle:       window.Paddle.Checkout.open(...)
  Site own API:        GET /api/download-skill (Vercel serverless, JWT + Pro-gated)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for routes, billing flows, and i18n details.

## Conventions

### File structure

```
api/                     — Vercel serverless functions (currently only download-skill.ts)
public/                  — static assets, favicons, partner logos, welcome screenshots
src/
├── main.tsx             — entry, Paddle bootstrap, routes
├── app/
│   ├── App.tsx          — landing
│   ├── components/      — shared UI
│   └── pages/           — one file per route
├── i18n/                — LangContext + ru.json/en.json dicts
├── imports/             — Figma-Make-generated SVG paths (auto-generated; brittle)
├── styles/              — index.css, tailwind.css, theme.css, fonts.css
└── types/               — TS type defs
```

### Code style

- TypeScript everywhere, `.tsx` for components
- Tailwind utility classes preferred over custom CSS
- Path alias `@` → `./src` available but most imports are relative
- No formatter configured (no Prettier, no ESLint)
- React Router 7 syntax (`import { Link } from "react-router"`, not `react-router-dom`)

### State & storage

- React Context for i18n only
- `localStorage` for: `opten_lang`, `opten_pay_currency`
- All auth and subscription state lives in the **extension's** `chrome.storage.local` (`ps_*` keys) — site reads via `chrome.runtime.sendMessage(...)` only

### Naming

- **Components:** PascalCase, one per file
- **Constants:** UPPER_SNAKE_CASE for module-level (`SUPABASE_URL`, `EXTENSION_IDS`, `CHROME_STORE_URL`)
- **i18n keys:** dot.namespaced in dicts (see `ru.json`/`en.json`)
- **localStorage keys:** `opten_` prefix
- **Extension storage keys** (read indirectly): `ps_*` prefix (extension-owned — see INTEGRATION-CONTRACT §5)

### CSS

- Tailwind 4 via `@tailwindcss/vite` plugin
- Theme tokens in [src/styles/theme.css](src/styles/theme.css)
- Custom fonts loaded in [src/styles/fonts.css](src/styles/fonts.css)

### Comments

- Phase references: `// Phase 66:`, `// Phase 73:` — match the extension repo's phase numbering when changes span both repos
- Design decisions: `// D-04:`, bugs: `// BG-67-01:` — same convention as the extension

## Workflow

This project uses [Superpowers](https://github.com/obra/superpowers) for
agentic workflow conventions (planning, execution, review). Follow the
Superpowers commands and skills installed in your environment when doing
non-trivial work; refer to that repo for the current command list.

For ad-hoc edits this section is non-binding — just keep changes scoped and
respect the integration contract above.

## Deploy & build

- **Local dev:** `npm run dev` (Vite, port 5173)
- **Build:** `npm run build` (Vite → `dist/`)
- **Deploy:** auto on push to `main` via Vercel. Vercel project name per recent commits: `opten-website2`.
- **Custom domain:** opten.space (HTTPS).

**No release versioning.** Unlike the extension, the site has no `version` in
`package.json` semver workflow — every push to `main` is a release. There is
no Chrome Web Store gating. Hotfix iteration speed is high; coordinate breaking
changes with the extension manually.

## Env vars

Set in Vercel (project settings, not in repo):
- `VITE_PADDLE_ENV` — `'sandbox'` | `'production'`
- `VITE_PADDLE_CLIENT_TOKEN` — Paddle public client token

`VITE_*` vars are public — bundled into the client at build. Real secrets
(Supabase service role, Paddle private API key, YooKassa secrets) live in
the **extension repo's** Supabase Edge Function secrets.

## Project docs

Reference documentation lives in `docs/`:

- [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md) — **binding interface with the extension**
- [docs/TECH.md](docs/TECH.md) — stack snapshot
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — routes, flows, state
- [docs/SEO-AUDIT.md](docs/SEO-AUDIT.md) — SEO baseline + gap analysis
