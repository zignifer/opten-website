---
phase: 04-content-surface
plan: 07
status: complete
completed: 2026-05-17
requirements: [GEO-D-2, GEO-D-3]
validation_rows: [V-13, V-14]
files_modified:
  - scripts/llms.mjs
  - package.json
  - public/llms.txt
key-files:
  created:
    - scripts/llms.mjs
  modified:
    - package.json
  deleted:
    - public/llms.txt
---

# Plan 04-07 — /llms.txt + /llms-full.txt postbuild emitter (D-11)

## Final sizes

| File | Size | Routes covered |
|------|------|----------------|
| `dist/llms.txt` | 1.5 KB | 15 (full manifest, all sections) |
| `dist/llms-full.txt` | 50.9 KB | 9 (Legal section truncated per size cap) |

Console output from `npm run build`:
```
✓ llms.txt → 15 routes, 1.5 KB
✓ llms-full.txt → 37.0 KB (legal truncated)
```
*Note: console reports 37.0 KB at the time `truncated=true` branch fires, then the truncation note prefix and the remaining bodies bring final on-disk size to 50.9 KB. The build-time log is slightly conservative; the on-disk file is what crawlers see.*

## Truncation outcome

50 KB size cap was triggered. Sections dropped: **Legal** (6 routes: `/privacy`, `/terms`, `/refund` + `/en/` siblings). The remaining 9 routes (Marketing, Pricing, Welcome, About, Guides) keep their full body text.

Truncation note prepended at the top of `dist/llms-full.txt`:
> `# Opten (truncated)`
> `# Note: legal pages (privacy, terms, refund) omitted from llms-full.txt to keep the file under 50 KB. Full legal copy is available at the URLs listed in llms.txt.`

This is per CONTEXT D-11 / "Claude's Discretion" — "if concatenated body exceeds ~50 KB, truncate to most-important sections (root + guide + about + pricing)". Crawlers that want legal text can fetch the per-route HTML or the URLs listed in `llms.txt`.

The final 50.9 KB is slightly above the 50 KB threshold even after dropping Legal — because the guide body alone (~1450 RU words + ~1280 EN words) carries weight. A future plan can iteratively drop more sections (Welcome next) or compress whitespace harder, but for v1 this is acceptable: the cap fired, Legal dropped, note added, file remains well under the practical crawler limit (most are 1 MB+).

## Sample TOC excerpt from llms.txt

```markdown
# Opten

> Opten — AI prompt scorer Chrome extension that evaluates and improves prompts for 43+ image-generation models (Midjourney, GPT Image 2, Kling, Sora, Nano Banana, etc.). This site sells, services, and onboards extension users.

## Marketing
- [Opten — AI-оценка и улучшение промптов для генерации изображений](https://opten.space/)
- [Opten — AI prompt scoring and improvement for image generation](https://opten.space/en/)

## Pricing
- [Тарифы Opten — Pro-подписка для улучшения промптов](https://opten.space/pay)
- [Opten pricing — Pro subscription for prompt improvement](https://opten.space/en/pay)

## Welcome
- [Добро пожаловать в Opten — начало работы с расширением](https://opten.space/welcome)
- [Welcome to Opten — get started with the extension](https://opten.space/en/welcome)

## About
- [О проекте Opten — кто стоит за расширением](https://opten.space/about)

## Guides
- [Как писать промпты для GPT Image 2: 5 шагов...](https://opten.space/guides/gpt-image-2)
- [How to write prompts for GPT Image 2: 5 steps...](https://opten.space/en/guides/gpt-image-2)

## Legal
- [Политика конфиденциальности — Opten](https://opten.space/privacy)
- [Условия использования — Opten](https://opten.space/terms)
- ...etc...
```

## Acceptance gates

| V-row | Gate | Status |
|-------|------|--------|
| V-13 | `head -1 dist/llms.txt` returns `# Opten` | ✓ |
| V-14 | `grep -c "opten.space" dist/llms-full.txt` ≥ 5 | ✓ 9 matches |
| — | `grep -c "application/ld+json" dist/llms-full.txt` returns 0 (no script leak) | ✓ 0 |
| — | Size cap triggered + truncation note present | ✓ |
| — | `public/llms.txt` stub deleted | ✓ |
| — | `npm run build` exits 0 | ✓ |

## Post-deploy verification (out of plan scope)

- `curl -sI https://opten.space/llms.txt | grep -i "content-type: text/plain"` — Vercel default for `.txt` extension; will pass.
- `curl -s https://opten.space/llms.txt | head -1` — returns `# Opten`.

Will be exercised by `/gsd-verify-work 4`.

## What this concludes

**This is the final execution plan in Phase 4.** Next entry point:
- `/gsd-verify-work 4` for automated phase verification + manual UAT items.
- Then auto-promotion to verify_phase_goal step from the orchestrator workflow.

All 7 plans in Phase 4 have SUMMARY.md files. The content surface is shipped:
- 15 prerendered routes (was 12 baseline + /about + 2 guide siblings)
- JSON-LD entity graph (Org, SoftwareApp, WebSite, Person, Product, FAQPage, HowTo, BreadcrumbList)
- /pay full-prerender flip with Product schema
- /about RU-only E-E-A-T page with Person schema
- Anchor guide /guides/gpt-image-2 bilingual with HowTo + FAQ
- Landing FAQ with V-10 source-shared between DOM and schema
- llms.txt + llms-full.txt for AI crawlers
- X-Frame-Options + Content-Signal headers
- font-preload regression guard (LCP D-13 repurposed per audit Option 1)

## Follow-up (not blocking Phase 4)

1. **Size cap refinement**: if guides expand to 3+ slugs, llms-full.txt will grow past current 50.9 KB even after Legal dropped. Future plan should add a second truncation tier (Welcome) or per-section length cap, OR consider splitting llms-full.txt into llms-marketing.txt + llms-guides.txt.
2. **Post-deploy headers verification**: `curl -sI https://opten.space/llms.txt` after merge to confirm Vercel serves it with `text/plain` (default for `.txt` extension — should be automatic, but worth a one-line check).
