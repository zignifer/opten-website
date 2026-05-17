---
status: partial
phase: 04-content-surface
source: [04-VERIFICATION.md]
started: 2026-05-17T00:00:00Z
updated: 2026-05-17T00:00:00Z
---

## Current Test

[awaiting human testing post-deploy]

## Tests

### 1. Google Rich Results Test on all prerendered routes
expected: 0 errors across Organization, SoftwareApplication, WebSite, Person, HowTo (5 steps), FAQPage, Product, BreadcrumbList types on `/`, `/en/`, `/about`, `/guides/gpt-image-2`, `/en/guides/gpt-image-2`, `/pay`, `/en/pay`
result: [pending — requires live URLs; submit each via https://search.google.com/test/rich-results after deploy]

### 2. Paddle / ЮKassa modal opens end-to-end on /pay (V-17, INTEGRATION-CONTRACT §6)
expected: With extension installed and logged in, the runtime CTA rail appears below the pricing cards. Click "Оплатить 199₽/мес" → ЮKassa redirect (RU) or "Pay $2.99" → Paddle overlay (EN). Console clean, no React #418/#423.
result: [pending — requires real Chrome extension instance with auth token]

### 3. Mobile LCP measurement on / and /en/ post-deploy
expected: Baseline 3.3 s (from 04-LCP-AUDIT.md). Phase 4 does NOT close V-18/V-19 LCP ≤ 2.5 s target (explicitly deferred per locked decision Option 1 to a future font-subsetting ticket). This test only confirms NO regression vs the 3.3 s baseline.
result: [pending — run via PageSpeed Insights against https://opten.space/ and https://opten.space/en/ after deploy]

### 4. X-Frame-Options edge header
expected: `curl -sI https://opten.space/` returns `X-Frame-Options: SAMEORIGIN` (V-20). Vercel applies headers from vercel.json at the edge — not visible in dist HTML.
result: [pending — single curl check after deploy]

### 5. Content-Signal directive in robots.txt
expected: `curl -s https://opten.space/robots.txt` includes `Content-Signal: search=yes, ai-train=yes, ai-input=yes` line (V-21). Already verified in dist/robots.txt locally; this just confirms Vercel doesn't filter or rewrite it.
result: [pending — single curl check after deploy]

### 6. llms.txt + llms-full.txt served as text/plain
expected: `curl -sI https://opten.space/llms.txt | grep -i 'content-type: text/plain'` matches. Vercel default for `.txt` extension — should be automatic. (V-13/V-14 build-time portion already verified.)
result: [pending — single curl check after deploy]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps

(none — all build-artifact level must_haves verified; the 6 items above are inherently post-deploy)
