---
tags:
  - gsd
  - plan
  - phase
  - geo
kind: phase-plan
phase: 1
milestone: geo-optimization
status: ready-to-execute
date: 2026-05-14
tasks: 8
related:
  - "[[.planning/phases/01-static-geo-foundations/1-SPEC|1-SPEC]]"
  - "[[.planning/research/GEO-AUDIT]]"
  - "[[docs/SEO-AUDIT]]"
---

# GEO Phase A — Static GEO Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise opten.space's GEO score from 12/100 to ~30/100 by adding the static foundations AI crawlers and link-preview clients expect — robots.txt, sitemap.xml, llms.txt, inline JSON-LD, proper OG card, security headers, Paddle preconnect — without touching React or the build pipeline.

**Architecture:** 8 atomic changes, all in `public/`, `index.html`, and `vercel.json`. Each task = one component = one commit. No new dependencies, no React changes, no build-pipeline changes. Vite's static asset handling makes new files in `public/` win over the Vercel SPA-rewrite, which is the core mechanism that fixes the "/robots.txt returns HTML" bug.

**Tech Stack:** Vite 6, static files, Vercel rewrites/headers, schema.org JSON-LD. No test framework in repo — verification is `npm run build` + `npm run preview` + curl + manual schema validation.

**Source documents:**
- Design spec: [[.planning/phases/01-static-geo-foundations/1-SPEC|1-SPEC]]
- Audit findings: [[.planning/research/GEO-AUDIT|GEO-AUDIT]]

**Verification philosophy:** Since this codebase has no tests, no ESLint, and no typecheck script (per [[CLAUDE]]), each task's verification is a `npm run build` + `npm run preview` + curl/manual-inspection check. The build itself is the only automated gate. Preview-deploy verification on Vercel happens once at the end.

---

## Task 1: robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create the file**

Create `public/robots.txt` with this exact content:

```
User-agent: *
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: GPTBot
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: ClaudeBot
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: PerplexityBot
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: Google-Extended
Allow: /
Disallow: /account
Disallow: /success
Disallow: /dashboard/

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://opten.space/sitemap.xml
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`

Expected: build succeeds with no warnings. `dist/robots.txt` exists and is byte-identical to `public/robots.txt`.

- [ ] **Step 3: Preview-server verify**

Run: `npm run preview` (in background or separate terminal)

Then: `curl -sI http://localhost:4173/robots.txt` and `curl -s http://localhost:4173/robots.txt | head -5`

Expected:
- Status `200`
- `Content-Type: text/plain` (Vite serves `.txt` as plain text)
- First five lines match the file content (starts with `User-agent: *`)

Stop the preview server after verifying.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt
git commit -m "feat(seo): add robots.txt with AI crawler directives"
```

---

## Task 2: sitemap.xml

**Files:**
- Create: `public/sitemap.xml`

- [ ] **Step 1: Create the file**

Create `public/sitemap.xml` with this exact content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://opten.space/</loc>        <changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://opten.space/pay</loc>     <changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://opten.space/welcome</loc> <changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://opten.space/privacy</loc> <changefreq>yearly</changefreq> <priority>0.3</priority></url>
  <url><loc>https://opten.space/terms</loc>   <changefreq>yearly</changefreq> <priority>0.3</priority></url>
  <url><loc>https://opten.space/refund</loc>  <changefreq>yearly</changefreq> <priority>0.3</priority></url>
</urlset>
```

- [ ] **Step 2: Validate XML syntax**

Run: `~/.claude/skills/geo/.venv/bin/python3 -c "import xml.etree.ElementTree as ET; ET.parse('public/sitemap.xml'); print('OK')"`

Expected: prints `OK`. Any other output = malformed XML, fix it.

- [ ] **Step 3: Build and preview verify**

Run: `npm run build && npm run preview`

Then: `curl -sI http://localhost:4173/sitemap.xml` and `curl -s http://localhost:4173/sitemap.xml | head -3`

Expected:
- Status `200`
- `Content-Type: application/xml` or `text/xml`
- First lines contain `<?xml version="1.0"` and `<urlset`

Stop the preview server.

- [ ] **Step 4: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat(seo): add sitemap.xml with 6 marketing routes"
```

---

## Task 3: llms.txt

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1: Create the file**

Create `public/llms.txt` with this exact content:

```markdown
# Opten

> Opten is a Chrome extension that scores and improves AI image-generation
> prompts for 43+ models (Midjourney, DALL-E, Stable Diffusion, Flux, etc.)
> directly inside the generator's interface — so users don't waste credits
> on bad prompts.

## How it works

Opten detects which AI image model the user is targeting, scores the
current prompt against that model's optimal patterns, and offers one-click
rewrites. Works inline in 43+ web-based image generators.

## Product

- [Install on Chrome Web Store](https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl)
- [Pricing](https://opten.space/pay) — Free tier + Pro at $2.99/month (199₽)
- [Privacy](https://opten.space/privacy)
- [Terms](https://opten.space/terms)
- [Refund policy](https://opten.space/refund)
```

- [ ] **Step 2: Build and preview verify**

Run: `npm run build && npm run preview`

Then: `curl -sI http://localhost:4173/llms.txt` and `curl -s http://localhost:4173/llms.txt | head -3`

Expected:
- Status `200`
- `Content-Type: text/plain`
- First line is `# Opten`

Stop the preview server.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt
git commit -m "feat(seo): add llms.txt product summary for AI assistants"
```

---

## Task 4: Copy OG card images into public/

**Files:**
- Create: `public/og-card-ru.png` (copy of `opten-design/Landing/banner-ru.png`)
- Create: `public/og-card-en.png` (copy of `opten-design/Landing/banner-eng.png`)

- [ ] **Step 1: Copy the files**

Run:
```bash
cp opten-design/Landing/banner-ru.png public/og-card-ru.png
cp opten-design/Landing/banner-eng.png public/og-card-en.png
```

- [ ] **Step 2: Verify dimensions**

Run: `~/.claude/skills/geo/.venv/bin/python3 -c "from PIL import Image; print('ru:', Image.open('public/og-card-ru.png').size); print('en:', Image.open('public/og-card-en.png').size)"`

Expected: both print `(1200, 630)`. If a different size — abort and re-check the source files.

- [ ] **Step 3: Build verify**

Run: `npm run build`

Expected: build succeeds. Files appear in `dist/og-card-ru.png` and `dist/og-card-en.png`.

- [ ] **Step 4: Commit**

```bash
git add public/og-card-ru.png public/og-card-en.png
git commit -m "feat(seo): add 1200x630 OG hero cards (RU + EN)"
```

---

## Task 5: Inline JSON-LD in index.html

**Files:**
- Modify: `index.html` — add two `<script type="application/ld+json">` blocks before `</head>`

- [ ] **Step 1: Read the current index.html `<head>` to find the insertion point**

Run: `grep -n '</head>' index.html`

Expected: a single line number for the closing `</head>` tag. The two JSON-LD blocks will be inserted on the line(s) immediately above it.

- [ ] **Step 2: Insert the JSON-LD blocks**

Open `index.html`. Find the line immediately before `</head>` (in the current file this is the line with the Paddle script tag). Insert these two blocks **above** the Paddle script tag:

```html
    <!-- Schema.org: SoftwareApplication (Phase A — GEO foundations) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Opten — AI Prompt Scorer",
      "url": "https://opten.space/",
      "applicationCategory": "BrowserApplication",
      "operatingSystem": "Chrome",
      "description": "Chrome extension that scores and improves AI image-generation prompts for 43+ models (Midjourney, DALL-E, Stable Diffusion, Flux, etc.) directly inside the generator's interface.",
      "offers": [
        { "@type": "Offer", "price": "0",    "priceCurrency": "USD", "name": "Free tier" },
        { "@type": "Offer", "price": "2.99", "priceCurrency": "USD", "name": "Pro (monthly)" },
        { "@type": "Offer", "price": "199",  "priceCurrency": "RUB", "name": "Pro (monthly, RU)" }
      ],
      "installUrl": "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl"
    }
    </script>

    <!-- Schema.org: Organization (Phase A — GEO foundations) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Opten",
      "url": "https://opten.space/",
      "logo": "https://opten.space/favicon-192x192.png",
      "sameAs": [
        "https://chromewebstore.google.com/detail/opten-—-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl",
        "https://t.me/v_voronezhtsev"
      ]
    }
    </script>
```

- [ ] **Step 3: Validate each JSON-LD block parses as JSON**

Run:
```bash
~/.claude/skills/geo/.venv/bin/python3 -c "
import re, json
html = open('index.html', encoding='utf-8').read()
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
print(f'Found {len(blocks)} JSON-LD blocks')
for i, b in enumerate(blocks):
    obj = json.loads(b)
    print(f'  Block {i+1}: @type={obj[\"@type\"]} — valid JSON')
"
```

Expected output:
```
Found 2 JSON-LD blocks
  Block 1: @type=SoftwareApplication — valid JSON
  Block 2: @type=Organization — valid JSON
```

If JSON.parse fails for either block — there is a syntax error (likely a stray comma or quote). Fix and re-run.

- [ ] **Step 4: Build verify**

Run: `npm run build`

Expected: build succeeds. `dist/index.html` contains both `<script type="application/ld+json">` blocks.

- [ ] **Step 5: Run the GEO fetch script against the build**

Run: `npm run preview` then in another terminal:

```bash
~/.claude/skills/geo/scripts/fetch_page.py http://localhost:4173 | ~/.claude/skills/geo/.venv/bin/python3 -c "
import json, sys
d = json.load(sys.stdin)
print('structured_data count:', len(d['structured_data']))
print('types:', [s.get('@type') for s in d['structured_data']])
"
```

Expected:
```
structured_data count: 2
types: ['SoftwareApplication', 'Organization']
```

Stop the preview server.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(seo): inline JSON-LD SoftwareApplication + Organization schemas"
```

---

## Task 6: Swap the OG image meta tags

**Files:**
- Modify: `index.html` — replace existing `og:image` and `twitter:image` meta tags

- [ ] **Step 1: Locate the current OG image meta tags**

Run: `grep -n 'og:image\|twitter:image' index.html`

Expected: two matches — both pointing at `favicon-310x310.png`. Note their line numbers.

- [ ] **Step 2: Replace the existing single `og:image` line**

Find the line:
```html
<meta property="og:image" content="https://opten.space/favicon-310x310.png" />
```

Replace it with this **four-line block**:
```html
<meta property="og:image"        content="https://opten.space/og-card-ru.png" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"    content="Opten — улучшай промпты перед генерацией" />
```

- [ ] **Step 3: Replace the `twitter:image` line**

Find the line:
```html
<meta name="twitter:image" content="https://opten.space/favicon-310x310.png" />
```

Replace its `content=` value:
```html
<meta name="twitter:image" content="https://opten.space/og-card-ru.png" />
```

- [ ] **Step 4: Verify no stale 310x310 references remain**

Run: `grep -n 'favicon-310x310' index.html`

Expected: zero matches. If anything remains, finish replacing.

- [ ] **Step 5: Build verify**

Run: `npm run build`

Expected: build succeeds. `dist/index.html` contains `og:image content="https://opten.space/og-card-ru.png"`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(seo): replace favicon OG image with 1200x630 hero card"
```

---

## Task 7: Paddle preconnect

**Files:**
- Modify: `index.html` — add one `<link rel="preconnect">` immediately before the Paddle `<script>` tag

- [ ] **Step 1: Locate the Paddle script tag**

Run: `grep -n 'cdn.paddle.com' index.html`

Expected: at least one match — the `<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>` line.

- [ ] **Step 2: Add the preconnect link**

Immediately above the Paddle `<script>` tag, insert:

```html
    <link rel="preconnect" href="https://cdn.paddle.com" />
```

Final result looks like:
```html
    <link rel="preconnect" href="https://cdn.paddle.com" />
    <script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
```

Note: `crossorigin` is deliberately omitted to match the script's no-cors fetch posture (see [design spec, component 7](../specs/2026-05-14-geo-phase-a-design.md#7-paddle-preconnect)).

- [ ] **Step 3: Build verify**

Run: `npm run build`

Expected: build succeeds. `dist/index.html` contains the preconnect line immediately above the Paddle script.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "perf(paddle): preconnect to cdn.paddle.com to cut handshake latency"
```

---

## Task 8: Security headers in vercel.json

**Files:**
- Modify: `vercel.json` — add `headers` block

⚠️ **This is the highest-risk task in the plan.** A syntax error breaks all deploys until reverted. Verify carefully.

- [ ] **Step 1: Read current vercel.json**

Run: `cat vercel.json`

Expected: matches the current content from the design spec (`rewrites` + `functions`, no `headers`).

- [ ] **Step 2: Replace the file**

Replace `vercel.json` content with:

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy",        "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy",     "value": "camera=(), microphone=(), geolocation=(), payment=(self \"https://*.paddle.com\")" }
      ]
    }
  ],
  "functions": {
    "api/download-skill.ts": {
      "includeFiles": "api/_assets/**"
    }
  }
}
```

- [ ] **Step 3: Validate JSON syntax**

Run: `~/.claude/skills/geo/.venv/bin/python3 -c "import json; json.load(open('vercel.json')); print('OK')"`

Expected: prints `OK`. Any error = malformed JSON, fix it.

- [ ] **Step 4: Build verify**

Run: `npm run build`

Expected: build succeeds. (Headers only take effect on Vercel, not in `npm run preview`, so we can't verify them locally — preview-deploy will.)

- [ ] **Step 5: Commit**

```bash
git add vercel.json
git commit -m "feat(security): add X-Content-Type-Options, Referrer-Policy, Permissions-Policy"
```

---

## Final Verification (after all 8 tasks)

These steps happen once after Tasks 1–8 are committed. They live outside the per-task atomic-commit flow because they verify integration.

- [ ] **Step 1: Local end-to-end smoke**

Run: `npm run build && npm run preview`

Then in another terminal:
```bash
~/.claude/skills/geo/.venv/bin/python3 -c "
import urllib.request, json
base = 'http://localhost:4173'

# Static files
for path, expect_type in [('/robots.txt', 'text/plain'),
                          ('/sitemap.xml', 'xml'),
                          ('/llms.txt', 'text/plain'),
                          ('/og-card-ru.png', 'image/png'),
                          ('/og-card-en.png', 'image/png')]:
    r = urllib.request.urlopen(base + path)
    ct = r.headers.get('Content-Type', '')
    ok = expect_type in ct
    print(f'  {path}: {r.status} {ct} {\"OK\" if ok else \"FAIL\"}')

# JSON-LD count
import re
html = urllib.request.urlopen(base + '/').read().decode('utf-8')
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
print(f'  JSON-LD blocks: {len(blocks)} (expected 2)')
for b in blocks:
    print(f'    @type:', json.loads(b)['@type'])

# OG image
if 'og-card-ru.png' in html and 'favicon-310x310' not in html:
    print('  og:image: OK (points to og-card-ru.png, no stale favicon reference)')
else:
    print('  og:image: FAIL')

# Paddle preconnect
if 'preconnect' in html and 'cdn.paddle.com' in html:
    print('  Paddle preconnect: OK')
else:
    print('  Paddle preconnect: FAIL')
"
```

Expected output:
```
  /robots.txt: 200 text/plain... OK
  /sitemap.xml: 200 ...xml... OK
  /llms.txt: 200 text/plain... OK
  /og-card-ru.png: 200 image/png OK
  /og-card-en.png: 200 image/png OK
  JSON-LD blocks: 2 (expected 2)
    @type: SoftwareApplication
    @type: Organization
  og:image: OK (points to og-card-ru.png, no stale favicon reference)
  Paddle preconnect: OK
```

If anything says FAIL — abort, fix the failing task, and re-run.

Stop the preview server.

- [ ] **Step 2: Push to remote and open a preview deploy**

```bash
git push
```

Vercel auto-creates a preview deployment for the branch. Note the preview URL (e.g. `opten-website2-git-...-zignifer.vercel.app`).

- [ ] **Step 3: Verify security headers on preview**

```bash
curl -sI https://<preview-url>/ | grep -iE 'content-type-options|referrer-policy|permissions-policy'
```

Expected: three lines, one per header, with the values from `vercel.json`. If any are missing — the `headers` block in `vercel.json` is malformed or Vercel hasn't applied them; check `vercel.json` JSON and re-deploy.

- [ ] **Step 4: Verify static files on preview**

```bash
curl -sI https://<preview-url>/robots.txt
curl -sI https://<preview-url>/sitemap.xml
curl -sI https://<preview-url>/llms.txt
```

All three should return `200` with `Content-Type: text/plain` (or `application/xml` for sitemap), **not** `text/html`. If any return `text/html` — the Vercel SPA-rewrite is still winning, which means the file isn't in `dist/`. Check the build output.

- [ ] **Step 5: Run the GEO audit script against preview**

```bash
~/.claude/skills/geo/scripts/fetch_page.py https://<preview-url>/ | ~/.claude/skills/geo/.venv/bin/python3 -c "
import json, sys
d = json.load(sys.stdin)
print('Schema count:', len(d['structured_data']))
print('Schema types:', [s.get('@type') for s in d['structured_data']])
print('Errors:', d.get('errors'))
"
```

Expected: 2 schemas (SoftwareApplication + Organization). The SPA-content warning may still appear — that's expected (it's the Phase B problem, not ours).

- [ ] **Step 6: Visual OG card test**

Paste the preview URL into a fresh Telegram chat or a Slack message. The link unfurl should now show the **large 1200×630 hero card** with the green Opten logo and "Улучшай промпты перед генерацией" copy — not the tiny favicon tile.

If still showing the favicon — link-preview clients aggressively cache OG metadata. Use [opengraph.dev](https://www.opengraph.dev/) or [LinkedIn's post inspector](https://www.linkedin.com/post-inspector/) to force a re-fetch.

- [ ] **Step 7: Production deploy + final GEO score**

After merging to `main`, Vercel auto-deploys to production. Then 7–14 days later (typical AI crawler refresh window):

```bash
~/.claude/skills/geo/scripts/fetch_page.py https://opten.space/
/geo audit https://opten.space
```

Expected: GEO score moves from 12 → ~30. Schema count is 2. Per-route SPA-emptiness warnings remain (Phase B fixes those).

---

## Rollback procedure

If anything breaks after merging to `main`:

- **All tasks have separate commits** — revert the specific commit that caused the problem:
  ```bash
  git revert <sha>
  git push
  ```
- The most failure-prone commit is **Task 8 (vercel.json)**. If a deploy fails right after Task 8, that's the first place to look.
- The other 7 commits are pure-static and cannot break a deploy on their own.

---

## Risks and mitigations (recap from design spec)

| Risk | Mitigation in plan |
|---|---|
| `vercel.json` syntax error breaks deploy | Task 8 Step 3 validates JSON before commit; Task 8 is last so earlier work is already safe |
| OG card em-dash in JSON-LD URL gets mojibake | Task 5 Step 3 parses JSON to catch this |
| Sitemap XML malformed | Task 2 Step 2 parses XML to catch this |
| Static file lost to SPA-fallback | Final Verification Step 4 confirms `Content-Type` not `text/html` |
