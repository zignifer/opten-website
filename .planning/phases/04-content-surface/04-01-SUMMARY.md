---
phase: 04-content-surface
plan: 01
status: complete
completed: 2026-05-17
requirements: [GEO-D-3]
validation_rows: [V-20, V-21, V-22]
files_modified:
  - vercel.json
  - public/robots.txt
key-files:
  created: []
  modified:
    - vercel.json
    - public/robots.txt
---

# Plan 04-01 — sidecar fixes (D-14)

## What shipped

Two atomic commits landing the zero-risk D-14 sidecar fixes from Wave 1:

1. **`vercel.json`** — appended `{ "key": "X-Frame-Options", "value": "SAMEORIGIN" }` as the fourth entry in `headers[0].headers` on `/(.*)`. Site-wide clickjacking defense via Vercel edge headers. NO `Content-Security-Policy` added (V-22 — explicit Phase 4 prohibition; Paddle inline-script + nonce coordination is a separate ticket).
2. **`public/robots.txt`** — appended at file scope after the existing `Sitemap:` line:
   - `# Phase 4 D-14: AI-Preferences (IETF draft / Cloudflare proposal)`
   - `Content-Signal: search=yes, ai-train=yes, ai-input=yes`

## Vocabulary choice: `ai-input` vs `ai-retrieval`

Used `ai-input` (Cloudflare vocabulary per RESEARCH Open Question Q2), NOT `ai-retrieval` (CONTEXT D-14 vocabulary). Rationale: Cloudflare's `Content-Signal` proposal landed first in real-world infrastructure (their CDN emits headers in this shape), and the IETF AI-Preferences draft has not yet finalized the input/retrieval naming. If reviewer pushback comes, swap is a one-line follow-up — flagged in commit body.

## Acceptance verification

- `vercel.json` parses as valid JSON; `headers[0].headers` keys are now `X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options`. CSP NOT present (V-22 ✓).
- `public/robots.txt` contains `Content-Signal: search=yes, ai-train=yes, ai-input=yes` at file scope; the 8 per-bot Allow/Disallow blocks unchanged (V-21 ✓).
- `npm run build` exits 0 (12 routes prerendered as before).
- `dist/robots.txt` contains the new `Content-Signal:` line verbatim — Vite's static-asset copy picked it up (V-20 indirect ✓; full V-20 verification happens post-deploy via `curl -sI`).

## Rollback target

If `X-Frame-Options: SAMEORIGIN` causes a regression (highly unlikely — site is not iframed by any known consumer; `/account` and `/dashboard/*` are not iframed by the extension either, which uses message-passing), revert the single vercel.json commit. The robots.txt change is informational only and cannot cause a runtime regression.

## What this unlocks

Nothing for Wave 2 directly — these are independent sidecar fixes that close V-20/V-21/V-22 with minimal blast radius. The point was to derisk the deploy pipeline before heavier schema and content work in Waves 2-5.
