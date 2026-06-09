# GEO/SEO Audit: opten.space

**Audit date:** 2026-06-08  
**Site:** https://opten.space  
**Business type:** Chrome extension / SaaS-style product site  
**Scope:** local build, live HTML, sitemap, robots, llms.txt, Yandex Webmaster API, Google Search Console API.

## Executive Summary

Overall SEO/GEO architecture is healthy. The current build produces 182 fully prerendered indexable URLs, split evenly between RU and EN. Live `https://opten.space/sitemap.xml` also contains 182 URLs, and a full live sweep found no sitemap URL returning non-200, no `X-Robots-Tag`, no meta `noindex`, no missing canonical, no `html lang` mismatch, and no Cyrillic in EN meta descriptions.

Main live discrepancy is indexing freshness, not route architecture: Yandex Webmaster last downloaded the sitemap on 2026-06-05 and still reports 166 sitemap URLs, while the live sitemap has 182. The 16 newest URLs are dated 2026-06-07, mostly public Learn pages. Recrawl requests were accepted by Yandex on 2026-06-08 for the sitemap, Learn URLs, root, EN root, `/pay`, and `/en/pay`.

Google Search Console OAuth was refreshed during follow-up work. GSC now confirms the root URL is indexed, while `/en/` and most newly added SEO pages are only discovered or unknown. This explains the reported mixed-language snippet: Google is showing the indexed RU root for an English brand query, not an indexed EN homepage.

One technical issue was found after GSC started working: `www` host redirects cover non-trailing paths such as `/models`, but live `https://www.opten.space/`, `https://www.opten.space/en/`, and trailing-slash paths such as `/blog/`, `/models/`, `/learn/` currently return `200`. This was fixed in `vercel.json` by adding explicit root and trailing-slash host redirects; deployment is still required for the live site to change.

## Score Snapshot

| Category | Score | Notes |
|---|---:|---|
| Technical SEO/GEO | 95 | SSR/prerender, sitemap, robots, llms.txt, canonical, hreflang, noindex boundaries are clean. |
| Schema & Structured Data | 90 | 1308 JSON-LD blocks parse cleanly; FAQ parity gate passes. EN schema still contains legal Cyrillic fields. |
| AI Citability | 86 | Definitional sections, FAQ, Learn, model pages, and llms.txt are strong. |
| Content E-E-A-T | 84 | Founder/about/schema signals are present; Yandex recommends region/business directory signals. |
| Platform/Index Freshness | 72 | Yandex is behind current sitemap; GSC sitemap is refreshed to 182 URLs but many pages remain discovered/not indexed. |
| Brand Authority | 72 | Chrome Web Store and founder links exist; third-party brand authority is still the long-term growth lever. |

**Composite estimate:** 84/100.

## Checks Run

- `npm run build` passed.
- `node scripts/verify-models-content.mjs` verified 62 model pages and EN meta fields; it also produced a false failure by treating `index.client.ts` as a model file.
- Local route manifest: 182 routes, 91 RU, 91 EN, all `prerender: full`, no duplicate paths, no missing hreflang alternates.
- Local sitemap: 182 URLs, 91 RU, 91 EN, 126 model URLs, 14 Learn URLs, 28 blog URLs.
- Live sitemap: 182 URLs.
- Full live sweep of all sitemap URLs: 182/182 status 200, no noindex, no lang mismatch, no EN Cyrillic meta description.
- Live robots: sitemap present; major AI/search crawlers explicitly allowed.
- Live llms.txt: present, 17,836 bytes.
- Yandex Webmaster: host verified; `searchable_pages_count: 151`, `excluded_pages_count: 2`, `sqi: 10`.
- Yandex sitemap: errors `0`, last downloaded `2026-06-05T14:24:43+03:00`, `urls_count: 166`.
- Yandex diagnostics present issues: `NO_METRIKA_COUNTER_BINDING`, `NO_METRIKA_COUNTER`, `NOT_IN_SPRAV`, `NO_REGIONS`; no fatal/critical access, robots, sitemap, DNS, SSL, 4xx/5xx issues.
- Google Search Console API: OAuth refreshed; account has `siteOwner` access to `sc-domain:opten.space` and `https://opten.space/`.
- GSC sitemap under URL-prefix property: `lastDownloaded=2026-06-08T17:01:02.998Z`, `submitted=182`, `warnings=0`, `errors=0`.
- GSC URL Inspection:
  - `https://opten.space/`: `PASS`, `Submitted and indexed`, last crawl `2026-05-31T02:30:43Z`.
  - `https://opten.space/en/`: `Discovered - currently not indexed`.
  - `https://opten.space/models`: `URL is unknown to Google`.
  - `https://opten.space/en/models`: `Discovered - currently not indexed`.
  - `https://opten.space/learn`: `Discovered - currently not indexed`.
  - `https://opten.space/en/learn`: `URL is unknown to Google`.
  - `https://opten.space/blog/gpt-image-2`: `Discovered - currently not indexed`.
  - `https://opten.space/en/blog/gpt-image-2`: `URL is unknown to Google`.
  - `https://www.opten.space/`: `Alternate page with proper canonical tag`, Google canonical `https://opten.space/`.
- GSC 30-day performance: mostly root URL (`19 clicks`, `213 impressions`, average position `7.0`); one old `https://www.opten.space/terms` row with 2 impressions.

## Mixed Google Snippet Finding

The screenshot shows an English query but a Russian snippet. Current live HTML does not show an EN meta-description leak:

- `https://opten.space/` has RU `html lang`, RU title, RU description, canonical root.
- `https://opten.space/en/` has EN `html lang`, EN title, EN description, canonical `/en/`.
- Both have reciprocal `hreflang` and `x-default` points to the RU root by project decision.

Confirmed explanation: Google is ranking/showing the indexed RU root URL for the English brand query and rewriting the title toward English, while still taking the description from the RU root page. GSC shows `/en/` is only `Discovered - currently not indexed`, so Google currently has no indexed EN homepage to prefer.

This is not a canonical/hreflang implementation failure in the current live HTML. It is an indexing/selection issue, amplified by the intentional `x-default -> RU` architecture and by the fact that Google has not indexed the EN homepage yet.

## Issues

### High

1. Google has not indexed most non-root SEO pages yet.
   - Impact: EN homepage and new content cannot win their intended SERP snippets until indexed.
   - Evidence: GSC URL Inspection reports `/en/`, `/learn`, `/blog/gpt-image-2` as `Discovered - currently not indexed`; `/models`, `/en/learn`, `/en/blog/gpt-image-2` as `URL is unknown to Google`.
   - Action taken: sitemap was submitted under both `sc-domain:opten.space` and `https://opten.space/`; URL-prefix property downloaded 182 URLs with zero errors.

2. Live `www` redirects miss root and trailing-slash paths.
   - Impact: duplicate crawlable host variants for `https://www.opten.space/`, `https://www.opten.space/en/`, `/blog/`, `/models/`, `/learn/`.
   - Evidence: live fetch returned `200` for those URLs; GSC treats `https://www.opten.space/` as an alternate canonicalized page and still has old `https://www.opten.space/terms` indexed from an April crawl.
   - Fix prepared: `vercel.json` now has explicit host redirects for `/` and `/:path*/`; deploy required.

3. Yandex sitemap processing is behind live sitemap.
   - Impact: Yandex currently reports 166 URLs while live sitemap has 182.
   - Evidence: Yandex last downloaded sitemap on 2026-06-05; new Learn URLs have `lastmod=2026-06-07`.
   - Action taken: queued recrawl for sitemap, Learn URLs, root, EN root, `/pay`, and `/en/pay`; queue count became 19.

### Medium

1. EN pages include Cyrillic in JSON-LD schema.
   - Scope: mostly `legalName: "ИП Воронежцев В.П."` on EN pages; `/en/about` also includes founder legal/name fields in Cyrillic.
   - Impact: probably low for snippets because EN meta descriptions are clean, but it is a mixed-language signal in page head.
   - Recommendation: keep real legal name if legally required, but translate/dual-locale `Person.description` on `/en/about`.

2. Yandex diagnostics recommend business/local signals.
   - Present: `NOT_IN_SPRAV`, `NO_REGIONS`, `NO_METRIKA_COUNTER`, `NO_METRIKA_COUNTER_BINDING`.
   - Impact: not a crawl/indexing blocker, but relevant for RU visibility.

3. `verify-models-content.mjs` false-fails on `index.client.ts`.
   - Impact: manual audit signal is noisy.
   - Fix: exclude `index.client.ts` and other barrels from the model-file glob.

## Quick Wins

1. Deploy the `www` redirect fix in `vercel.json`, then verify:
   - `https://www.opten.space/`
   - `https://www.opten.space/en/`
   - `https://www.opten.space/blog/`
   - `https://www.opten.space/models/`
   - `https://www.opten.space/learn/`

2. Re-check GSC sitemap and inspected URLs in 24-72 hours:
   - `node scripts/gsc.mjs sitemaps`
   - `node scripts/gsc.mjs inspect https://opten.space/en/`
   - `node scripts/gsc.mjs inspect https://opten.space/learn`
   - `node scripts/gsc.mjs inspect https://opten.space/models`

3. Re-check Yandex sitemap in 24-72 hours:
   - `node scripts/yandex-webmaster.mjs sitemaps`
   - Expected: `urls_count` moves from 166 to 182.

4. Fix `verify-models-content.mjs` glob so model EN-meta checks can be trusted as a clean gate.

5. If `/en/` remains not indexed after sitemap recrawl, manually use GSC UI's "Request indexing" for `/en/`, `/en/models`, `/en/learn`, and the strongest EN blog/model pages.

## Current Conclusion

SEO architecture is mostly correctly wired. Google Search Console is now accessible, the sitemap is submitted with 182 URLs and zero errors, and the Russian description in an English query is explained by `/en/` not being indexed. The main actionable code fix is the `www` host redirect gap for root/trailing-slash URLs; after deploying that, the remaining work is search-engine recrawl/indexing latency.
