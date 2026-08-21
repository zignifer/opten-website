# GSC indexing audit — 2026-08-21

## Scope and evidence

- Property: `sc-domain:opten.space`, verified through the local OAuth CLI with
  `permissionLevel: siteOwner`.
- Sitemap: `https://opten.space/sitemap.xml`.
- Full URL Inspection API pass across all 256 live sitemap URLs.
- Raw-HTML crawl of all 256 URLs to measure server-rendered internal links and
  homepage crawl depth.
- Full machine-readable snapshot:
  `.secrets/gsc-inspection-latest.json` (ignored, local only).

The Search Console UI count of 80 excluded pages and the API snapshot of 77 are
not contradictory. They are different freshness snapshots. The API result is
the reproducible baseline for this audit.

## Current baseline

| URL Inspection state | URLs |
|---|---:|
| Submitted and indexed | 179 |
| Discovered - currently not indexed | 43 |
| URL is unknown to Google | 24 |
| Crawled - currently not indexed | 10 |
| **Total** | **256** |

There is no confirmed crawl or canonical blocker:

- all 256 sitemap URLs returned fetchable HTML during the live crawl;
- `robots.txt` allows public content and references the sitemap;
- all 10 crawled-but-not-indexed URLs report `ALLOWED`,
  `INDEXING_ALLOWED`, and `SUCCESSFUL`;
- all 10 have matching Google and user canonicals;
- the sitemap has zero warnings and zero errors;
- Google last downloaded the sitemap on 2026-08-17.

The sitemap API's `indexed: 0` field is not used as coverage truth. URL
Inspection is the authoritative signal used here.

## Coverage by surface

| Surface | Total | Indexed | Not indexed | Indexed rate |
|---|---:|---:|---:|---:|
| RU blog | 42 | 28 | 14 | 67% |
| EN blog | 42 | 26 | 16 | 62% |
| RU models | 63 | 56 | 7 | 89% |
| EN models | 63 | 33 | 30 | 52% |
| RU Learn | 16 | 15 | 1 | 94% |
| EN Learn | 16 | 14 | 2 | 88% |
| RU other | 7 | 2 | 5 | 29% |
| EN other | 7 | 5 | 2 | 71% |

The largest actionable gap is EN model coverage. The second gap is blog
coverage in both languages.

## Crawl graph findings

Every sitemap URL has at least one inbound link somewhere in the sitemap graph,
but 16 non-indexed URLs are in isolated clusters that cannot be reached from
the homepage through server-rendered links:

- `https://opten.space/blog/ai-logo-generator-prompt`
- `https://opten.space/blog/kling-3-prompts`
- `https://opten.space/en/blog/ai-lip-sync`
- `https://opten.space/en/blog/ai-logo-generator-prompt`
- `https://opten.space/models/midjourney`
- `https://opten.space/blog/ai-face-swap`
- `https://opten.space/en/blog/ai-video-for-work`
- `https://opten.space/en/blog/seedance-2-0-prompts`
- `https://opten.space/en/blog/upwork-start-2026-checklist`
- `https://opten.space/en/models/luma-ray`
- `https://opten.space/en/models/sora`
- `https://opten.space/models/flux`
- `https://opten.space/welcome`
- `https://opten.space/blog/upscale-image-ai`
- `https://opten.space/en/models/imagen`
- `https://opten.space/en/models/seedance`

Six more non-indexed URLs are reachable only at depth 4-6:

| Depth | URL |
|---:|---|
| 4 | `https://opten.space/en/blog/prompt-examples` |
| 4 | `https://opten.space/en/blog/prompt-structure` |
| 4 | `https://opten.space/en/blog/vibe-coding-freelance` |
| 4 | `https://opten.space/en/models/veo` |
| 5 | `https://opten.space/en/blog/negative-prompt` |
| 6 | `https://opten.space/en/blog/image-to-video` |

This is a stronger explanation for delayed discovery than robots, status code,
canonical, or missing sitemap coverage.

## Freshness and content-selection findings

- 63 of the 77 non-indexed URLs have sitemap `lastmod=2026-08-12`; seven use
  2026-08-13, four use 2026-08-14, and three use 2026-08-21. A meaningful part
  of the count is therefore recrawl/indexing lag after recent commits.
- The 10 crawled-but-not-indexed pages contain roughly 900-2,000 raw HTML words.
  They are not thin by word count.
- Five of those ten have an indexed locale sibling. The issue is not a blanket
  route or locale configuration failure.
- Google is making a content-selection decision. Repeated model/article
  structures, weak page-specific evidence, limited primary-source attribution,
  and low contextual internal equity are more plausible causes than page length.

## Recommended action plan

### P0 — fix discovery and crawl depth

1. Add ordinary server-rendered links from the Blog and Model hubs to every
   valuable isolated URL listed above.
2. Bring the six depth-4+ pages to depth 3 or less through hub sections or
   contextual links from already-indexed pages.
3. Keep crawlable pagination only if it produces real `<a href>` routes with
   self-canonicals. Client-only pagination is not sufficient.
4. Decide whether `/welcome` is intended to rank. If it is only extension
   onboarding, remove it from the sitemap and serve `noindex,follow`; do not
   count that as an indexing failure. Keep `/pay` indexable only if it remains
   the intentional public pricing/product landing page.

Acceptance criterion: every valuable indexable sitemap URL is reachable from
the homepage in at most three server-rendered links.

### P1 — improve selection, starting with EN models

1. Do not bulk-rewrite all 30 non-indexed EN model pages at once.
2. Pilot 5-10 pages, including crawled-but-not-indexed pages, with:
   - a page-specific answer-first introduction;
   - official primary sources and visible verification date;
   - one reproducible prompt/settings/result example where evidence exists;
   - explicit model-specific limitations and version scope;
   - 2-3 contextual links from indexed guides/models, not only related cards.
3. Compare against indexed sibling pages and retain their strongest unique
   sections instead of expanding generic word count.

Acceptance criterion: pilot pages are recrawled and move to indexed status or
produce a specific new exclusion signal within a 28-day observation window.

### P2 — notify and monitor

1. After the link/content release, submit `sitemap.xml` once. Repeated unchanged
   submissions do not create value.
2. Request indexing manually only for the 5-10 changed priority URLs. Do not
   submit all unchanged URLs one by one.
3. Run `npm run gsc:inspect-sitemap` weekly and compare:
   - indexed total;
   - `Discovered` and `Unknown` totals;
   - EN model indexed rate;
   - the pilot URL states.

Google does not guarantee indexing for every valid page. The target is not to
force the excluded count to zero; it is to make every valuable URL discoverable,
distinct, evidence-backed, and easy to select.

## Reauthorization and repeatable tooling

- `npm run gsc:refresh-auth` starts the one-time localhost OAuth callback.
- Open its one-time `authUrl` in the external Chrome profile, not the embedded
  browser and not the ordinary Search Console dashboard.
- Success requires both `status: complete` and `npm run gsc:sites` returning an
  Opten property with `siteOwner`.
- The helper retries temporary token transport failures, 429, and 5xx responses
  up to three times and records the underlying network error when available.
- `npm run gsc:inspect-sitemap` performs the bounded full-sitemap inspection,
  prints progress and coverage examples, and writes the ignored full report.

## Limits

This snapshot covers the live sitemap and URL Inspection API on 2026-08-21. It
does not reproduce the Search Console UI's historical validation timelines, and
no index request, sitemap submission, or site-content change was made as part of
this audit.
