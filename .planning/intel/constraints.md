---
tags:
  - gsd
  - intel
  - constraints
kind: "intel-constraints"
---
# Constraints Intel

Synthesized from SPEC-type docs. Constraints that future work must respect — distinct from requirements (what to build) and decisions (what was chosen).

The two SPECs in this ingest cover GEO Phase A and yield constraints on URL routing, file placement, header configuration, and AI-crawler interaction.

---

## CON-static-files-win-over-spa-rewrite

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Architecture)
- **type:** protocol
- **constraint:** Vite copies `public/*` verbatim into `dist/`. Vercel serves those files at the matching root paths, which wins over the SPA-fallback rewrite (`/((?!api/).*)` → `/index.html`) because a real file at `dist/robots.txt` is served as a static asset before the rewrite triggers.
- **implication:** Any new file added under `public/` will shadow a same-name SPA route. Conversely, any file expected to be served as `text/plain` / `application/xml` / `image/*` MUST exist as a real file in `dist/` — otherwise the SPA rewrite returns `text/html`.
- **verification:** `curl -I` the path; if `Content-Type: text/html` returns, the file is missing from `dist/`.

## CON-locked-routes-keep-existing-paths

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Scope decisions) + C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§3)
- **type:** api-contract
- **constraint:** Future bilingual URL work (Phase C `/ru/*` `/en/*`) MUST add language-prefixed paths **alongside** existing locked routes — never rename. `/welcome`, `/pay`, `/success`, `/account`, `/dashboard/download-skill` must continue to respond at their current paths.
- **rationale:** Already-shipped extension binaries deep-link to these paths.

## CON-paddle-script-loading

- **source:** C:\Projects\opten-website\docs\INTEGRATION-CONTRACT.md (§6) + C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Components #7)
- **type:** protocol
- **constraint:** The Paddle.js CDN script in `index.html` MUST be loaded synchronously (no `async`/`defer`). The `<link rel="preconnect" href="https://cdn.paddle.com">` MUST NOT carry `crossorigin` — that opens a separate CORS connection the script tag won't reuse. `Paddle.Environment.set('production')` MUST NOT be called (Paddle v2 throws); only sandbox or skip.

## CON-permissions-policy-paddle-grant

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Components #6)
- **type:** nfr
- **constraint:** `Permissions-Policy` header MUST explicitly grant `payment` to `self` plus Paddle subdomains (`payment=(self "https://*.paddle.com")`). The Paddle overlay checkout requires the Payment Request API. `camera`, `microphone`, `geolocation` MUST be empty-list disabled.

## CON-csp-deferred

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Scope decisions + §Components #6)
- **type:** nfr
- **constraint:** CSP header is deferred from Phase A. It interacts with Paddle's inline script and requires per-source nonce coordination. Track as a separate ticket — not silently to be added inside Phase A's `vercel.json` edit.

## CON-robots-disallow-set

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Components #1)
- **type:** protocol
- **constraint:** `robots.txt` disallow set is exactly `/account`, `/success`, `/dashboard/`. `/pay` MUST remain open — it is a marketing/pricing surface, not transactional-only. `/welcome` is open.
- **note:** This deliberately diverges from the broader recommendation in `.planning/research/GEO-AUDIT.md` and `docs/SEO-AUDIT.md` (which mentioned `noindex` on `/pay`). SPEC wins by precedence; rationale recorded in INGEST-CONFLICTS.md.

## CON-sitemap-six-routes

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Components #2)
- **type:** schema
- **constraint:** `sitemap.xml` lists exactly six URLs: `/`, `/pay`, `/welcome`, `/privacy`, `/terms`, `/refund`. `/account`, `/success`, `/dashboard/*` are deliberately omitted (also Disallow'd in robots). `lastmod` field is intentionally omitted in Phase A (no automation yet); add in Phase B when prerender produces per-route build metadata.

## CON-og-card-dimensions-and-language

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Components #5)
- **type:** schema
- **constraint:** Both OG card PNGs MUST be exactly **1200×630**. The static `og:image` references the **RU** card (`og-card-ru.png`) because `<html lang="ru">` is hardcoded and the dominant audience is RU today. The EN card sits in `public/` ready for Phase B per-route meta to point at it.

## CON-jsonld-pricing-source-of-truth

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Components #4)
- **type:** schema
- **constraint:** Pricing values in the SoftwareApplication JSON-LD (`199 RUB`, `2.99 USD`, plus tier names) come from `src/i18n/ru.json` and MUST stay in sync if pricing changes. The recurring Pro tier is represented; the **one-time skill download** is intentionally NOT in the SoftwareApplication offers (separate product surface).

## CON-llms-txt-language

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Scope decisions)
- **type:** protocol
- **constraint:** `llms.txt` is **English only**. The file's audience is 100% LLMs; AI-assistant queries are predominantly English.

## CON-no-react-or-build-pipeline-changes-in-phase-a

- **source:** C:\Projects\opten-website\docs\superpowers\specs\2026-05-14-geo-phase-a-design.md (§Goal + §Architecture)
- **type:** nfr
- **constraint:** Phase A MUST NOT touch React source or the build pipeline. All changes are confined to `public/`, `index.html`, and `vercel.json`. No new dependencies. Each task = one component = one commit; eight atomic commits total.
