---
tags:
  - gsd
  - intel
  - requirements
kind: "intel-requirements"
---
# Requirements Intel

Synthesized from SPEC-type docs. The two SPECs (`2026-05-14-geo-phase-a-design.md` design and `2026-05-14-geo-phase-a.md` plan) describe one milestone — **GEO Phase A** — at design-spec and implementation-plan granularity. They agree on every concrete value; this file collapses them into a single requirement set with 8 atomic tasks.

> Note: The PRECEDENCE input lists `PRD` as a recognized type, but no PRD docs are in this ingest. Requirements here are derived from SPECs (precedence 1) — they describe an in-flight phase, not a product-marketing PRD.

---

## REQ-geo-phase-a

- **source (design):** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md
- **source (plan):** C:\Projects\opten-website\docs\superpowers\plans\2026-05-14-geo-phase-a.md
- **status:** Approved for planning (design), ready-to-execute (plan)
- **scope:** Static GEO/SEO foundations for opten.space — no React or build-pipeline changes
- **goal:** Raise opten.space GEO score from **12/100 → ~30/100** by adding the static foundations AI crawlers and link-preview clients expect (robots.txt, sitemap.xml, llms.txt, inline JSON-LD, OG hero cards, security headers, Paddle preconnect).
- **closes audit findings:** C-2, C-3, H-1, H-2, H-5 (per `.planning/research/GEO-AUDIT.md`).
- **out of scope:** per-route prerender (Phase B), bilingual URL paths (Phase C), content surface (Phase D), brand authority work (Phase E), CSP header (deferred — conflicts with Paddle inline script).

### Acceptance criteria

After all sub-tasks land:
1. `npm run build` completes without warnings.
2. `npm run preview` serves: `/robots.txt` as `text/plain`, `/sitemap.xml` as `application/xml`, `/llms.txt` as `text/plain`, `/og-card-{ru,en}.png` as 1200×630 PNGs — NOT the SPA `index.html` fallback.
3. `dist/index.html` (and live root) contains exactly **two** `<script type="application/ld+json">` blocks: one `@type: SoftwareApplication`, one `@type: Organization`. Both parse as valid JSON and validate against schema.org.
4. `og:image` and `twitter:image` point to `https://opten.space/og-card-ru.png`; no remaining `favicon-310x310` references in `index.html`.
5. `<link rel="preconnect" href="https://cdn.paddle.com">` appears immediately before the Paddle `<script>` (no `crossorigin` attribute).
6. Vercel preview deploy serves three new response headers on every path: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.paddle.com")`.
7. `~/.claude/skills/geo/scripts/fetch_page.py` against the preview URL reports `structured_data` count = 2 (SoftwareApplication + Organization).
8. Telegram/Slack link unfurl on the preview URL renders the 1200×630 hero card (not the favicon).
9. After 7–14 days on production, `/geo audit https://opten.space` reports score uplift from 12 → ~30.

### Sub-requirements (8 atomic tasks, one commit each)

#### REQ-geo-a-1 — `public/robots.txt`

- **source:** plan §"Task 1", design §"Components #1"
- **deliverable:** new file `public/robots.txt` with explicit per-bot blocks for `*`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`, `anthropic-ai`. `Disallow: /account`, `/success`, `/dashboard/` on the first five. `Sitemap: https://opten.space/sitemap.xml` at end.
- **acceptance:** `curl http://localhost:4173/robots.txt` returns 200 + `Content-Type: text/plain` + content matches.

#### REQ-geo-a-2 — `public/sitemap.xml`

- **source:** plan §"Task 2", design §"Components #2"
- **deliverable:** new file `public/sitemap.xml` listing **six** marketing routes: `/`, `/pay`, `/welcome`, `/privacy`, `/terms`, `/refund`. Priorities 1.0/0.8/0.6/0.3/0.3/0.3. `lastmod` intentionally omitted (Phase A — no automation yet).
- **acceptance:** XML parses; `curl http://localhost:4173/sitemap.xml` returns 200 + `application/xml`.
- **note:** `/account`, `/success`, `/dashboard/*` deliberately excluded — also Disallow'd in robots.txt.

#### REQ-geo-a-3 — `public/llms.txt`

- **source:** plan §"Task 3", design §"Components #3"
- **deliverable:** new file `public/llms.txt`, English only, following llmstxt.org structure: H1 = "Opten", blockquote summary, "How it works" section, "Product" section with five links (CWS, /pay, /privacy, /terms, /refund).
- **acceptance:** `curl http://localhost:4173/llms.txt` returns 200 + `Content-Type: text/plain` + first line `# Opten`.

#### REQ-geo-a-4 — OG hero card files

- **source:** plan §"Task 4", design §"Components #5"
- **deliverable:** copy `opten-design/Landing/banner-ru.png` → `public/og-card-ru.png`; copy `opten-design/Landing/banner-eng.png` → `public/og-card-en.png`.
- **acceptance:** PIL reports both files are exactly `(1200, 630)`; both appear in `dist/`.

#### REQ-geo-a-5 — Inline JSON-LD in `index.html`

- **source:** plan §"Task 5", design §"Components #4"
- **deliverable:** two `<script type="application/ld+json">` blocks inserted before `</head>` and above the Paddle script:
  - `SoftwareApplication` — name `"Opten — AI Prompt Scorer"`, `applicationCategory: BrowserApplication`, `operatingSystem: Chrome`, three offers (USD $0 Free, USD $2.99 Pro, RUB ₽199 Pro RU), `installUrl` to CWS.
  - `Organization` — name `"Opten"`, logo `favicon-192x192.png`, `sameAs` = [CWS URL, `https://t.me/v_voronezhtsev`].
- **acceptance:** `re.findall` matches exactly 2 blocks; both parse as JSON; types are `['SoftwareApplication', 'Organization']`.
- **pricing-sync note:** Prices come from `src/i18n/ru.json` and must stay in sync if pricing changes. One-time skill download is intentionally NOT in the SoftwareApplication offers.

#### REQ-geo-a-6 — Replace OG image meta tags

- **source:** plan §"Task 6", design §"Components #5"
- **deliverable:** replace single `<meta property="og:image" content=".../favicon-310x310.png">` with the four-line block (image + width 1200 + height 630 + alt `"Opten — улучшай промпты перед генерацией"`); replace `<meta name="twitter:image">` content to `og-card-ru.png`.
- **acceptance:** `grep -n 'favicon-310x310' index.html` returns zero matches.

#### REQ-geo-a-7 — Paddle preconnect

- **source:** plan §"Task 7", design §"Components #7"
- **deliverable:** insert `<link rel="preconnect" href="https://cdn.paddle.com" />` immediately above the existing Paddle `<script>` tag in `index.html`.
- **acceptance:** preconnect link is present in `dist/index.html` directly above the Paddle script.
- **constraint:** `crossorigin` attribute MUST be omitted to match the Paddle `<script>`'s no-cors fetch posture. Adding it opens a separate CORS connection that the script tag won't reuse.

#### REQ-geo-a-8 — Security headers in `vercel.json`

- **source:** plan §"Task 8", design §"Components #6"
- **deliverable:** replace `vercel.json` with `rewrites` + `headers` + `functions` blocks. Three headers on `/(.*)`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.paddle.com")`.
- **acceptance:** `json.load(open('vercel.json'))` succeeds; `npm run build` succeeds; on Vercel preview `curl -sI / | grep -iE 'content-type-options|referrer-policy|permissions-policy'` returns three lines.
- **risk callout:** Highest-risk task in the plan. JSON syntax error breaks all deploys until reverted. Plan executes this **last** so earlier tasks are already safe; rollback procedure is `git revert <sha>`.
- **HSTS:** Already enforced by Vercel at the domain level — not set in `vercel.json`.
- **CSP:** Deferred. Conflicts with Paddle inline script; tracked as a separate ticket.

### Rollback procedure

Each task = one commit. If a deploy fails after merging, `git revert <sha>` the offending commit. Task 8 (vercel.json) is the only commit that can break a deploy on its own; tasks 1–7 are pure-static and deploy-safe.

### Verification

The codebase has no tests, no ESLint, no typecheck script. Verification gates per task are: `npm run build` + `npm run preview` + manual curl/inspection. Preview-deploy verification on Vercel happens once at the end of the plan.
