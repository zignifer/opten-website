# Opten — visual system and owner workspace

The current website and extension are the source of this library. This is an
inventory of existing implementation, not a redesign or a record of new user
approval. First library revision: 2026-10-13. The new owner workspace is pending
user review; historical product components retain their current status.

## Start here

- Owner workspace: `/admin`; website and extension have separate tabs and
  stable hash links. The default section is the project overview.
- Local design-only preview: `/admin?preview=design-system`. Available only in
  Vite development; operations are unavailable there.
- `npm run sync:design-system` refreshes website-derived inventory.
- `npm run sync:design-system -- --extension C:\Projects\promptscore` refreshes
  website inventory and the read-only extension snapshot.
- `npm run build` runs the existing production checks. No new stack or service
  is required. The extension checkout is not a build dependency.
- `npm run verify:design-system` checks inventory hashes, copied extension
  media, the noindex route policy and seven HTTP authorization cases.
- New-page process: `docs/page-workflow/README.md` → project Creative Director
  (direction only) → fresh-context builder. Graphics are generated at build
  stage only; client setup files are not required as repeated attachments.

## Source ownership

| Layer | Source | Library representation |
| --- | --- | --- |
| Website visual basis | Homepage, `src/app/components/landing/LandingSections.tsx` | Real imported primitives and sections |
| Website fonts | `src/styles/fonts.css`, `public/fonts/` | Source-derived font declarations and live specimens |
| Existing CSS foundation | `src/styles/theme.css` | Observed variables; generic UI scaffold values are distinct from marketing colors |
| Shared website UI | `src/app/components/` | Real imports, variants, usage paths; installed/unused UI is labelled separately |
| Website media | `public/assets/`, `public/blog/`, source references | File, dimensions, family, usage and local preview |
| Extension popup | `promptscore/popup/popup.html`, `popup.css`, `content/i18n.js` | Sanitized HTML/CSS snapshot in sandboxed frames; no extension runtime |
| Extension injected UI | `promptscore/content/content.css`, `ui/` | Source-derived CSS, score/status SVG families |
| Access contracts | `docs/INTEGRATION-CONTRACT.md` | Linked documentation; shared identity/auth/billing remain intact |

The owner supplied the existing [Opten Figma component library](https://www.figma.com/design/KRDykjGReot4r3lvb1u6Ju/Opten--2-?node-id=3613-17)
as the format reference. Its current `Components` page, Foundations and Product
CTAs were read on 2026-10-13. Grouping and source traceability follow that
reference; the owner specifically flagged the Figma gradient as inaccurate.
The workspace uses `.opten-footer-gradient` from the website CSS, including its
layers, rather than reproducing the flagged Figma rendering. Figma was read-only.

## Website

The homepage supplies the dark green background, lime accent, typography,
rounded surfaces, paired platform-icon CTAs, handwritten decorations and
product-interface imagery. Colors and numeric styles shown in the workspace
are generated from source rather than maintained as independent Markdown
numbers. Unbounded carries marketing headings and selected editorial titles;
PT Root UI carries product text and controls. Inter remains an observed
secondary family where the source uses it.

Use existing variants of `InstallButton`, `AiAccessButton`, `FeatureCard`,
`SectionTitle`, `Step`, `PrivacyItem`, `PlanCard`, navigation, FAQ, BlogPostCard
and LearnLessonCard. Homepage sections use the same exported implementations
as the catalog. The catalog uses isolated sample data for display; it must not
submit paid AI requests, create payments, send OTP email or delete history.

The site remains responsive. Source breakpoints apply to specimens; the
workspace frame is narrower than the full browser. Large section previews can
be viewed at an explicit viewport width. Specimens must preserve readable
text and media crops without changing production CSS.

## Extension

The popup uses its own Inter files, fixed popup geometry and neutral dark
surfaces. Keep it separate from marketing typography. The catalog shows
email/OTP, Free/Pro, tabs, platform cards, prompt controls, reference controls,
integration instructions, banner and score-icon states. A snapshot is not a
running extension: Chrome APIs, auth, network requests and provider actions are
excluded. Selector, source revision and checksum accompany each specimen.
Website builds retain the committed snapshot until explicitly synchronized.

## Images and icons

Preserve existing product screenshots, RU/EN pairs, decorative SVGs and
platform logos. FeatureCards imagery is part of the homepage's visual language;
do not replace it with generic generated pictures. The media register includes
existing blog and Learn imagery too. Third-party YouTube posters remain live
remote resources and are recorded as such rather than copied locally.

Technical icons come from the actual imports of Lucide, MUI, inline SVG and
local project SVGs. An installed package is not evidence of an icon being used.
The catalog records actual names and source references. New imagery requires
a concrete section purpose and normal project review; no images were generated
for this setup. Recorded use does not imply a new license or approval.

## Coverage and maintenance

`src/design-system/catalog.tsx` owns the list of live website demonstrations.
`scripts/sync-design-system.mjs` owns extraction and extension specimen
selectors. `src/design-system/generated/` contains derived inventories and
revision provenance. The workspace separately lists source components that
have no live specimen; never call the demonstration list complete merely
because the inventory is broad.

For a visual change: inspect the current source and homepage, reuse the shared
component, update the relevant demo/asset metadata, synchronize the inventory,
then verify the new render and behavior at desktop and mobile sizes. Keep
existing auth, billing, routes, copy, SEO and extension integration contracts.
Check conflicts between AGENTS.md and observed code explicitly; an inventory
does not authorize unrelated product corrections.

The generic `01-PROJECT-SETUP.md` contributed source traceability, a layered
component catalog, media registration and browser verification. Its Astro
migration and 1728px desktop default were not adopted. The page production
process and media rules have now been adapted into `docs/page-workflow/` for
Opten, with direction and implementation kept as separate stages. TMA2 contributed catalog organization
only; its colors, fonts and component code were not copied.

## Page directions and revisions

The project-owned workflow is documented in `docs/page-workflow/README.md`,
`02-CREATIVE-DIRECTOR.md`, `03-START-PAGE.md` and `MEDIA-PROTOCOL.md` in that
directory. New pages begin with direction only, then another agent works from
the saved package in a fresh context. User confirmation on 2026-10-13: all
image generation belongs to implementation; the director only plans graphics.
The builder can develop proposed compositions after checking the actual
components/content/render, while preserving product and visual contracts.

For each actually commissioned page, add one record here with route/scope,
canonical content, active direction link/status, working/shown/user-approved
revision, library/assets, verification and remaining constraints. Full page
directions live under `docs/page-workflow/pages/<page-slug>/`; current content
sources remain canonical. No new page has been commissioned by the workflow
setup request itself. Do not create fictional page entries or approval records.

## Verification of the first workspace revision

Browser inspection on 2026-10-13 covered the two libraries at 1512 × 1000 and
the overview, typography, components and imagery at 390 × 852. Search, mobile
navigation, document switching, real specimen viewports and the workbench
preview were exercised. All 48 extension states loaded their exact Inter font
and local images; none clipped or ran scripts. The workbench preview sent zero
AI requests. The owner workspace stayed unavailable when signed out. The
session handler passed missing/invalid JWT, non-owner, user-ID owner, email
owner, unsupported method and OPTIONS tests. Provider JWT verification was
stubbed in those HTTP tests; the production verifier itself is unchanged.

`npm run build`, `npm run verify:design-system`,
`npm run verify:prompt-workbench-vibecoding` (57 golden cases), and
`npm run verify:email-only-auth` passed locally. Screenshots are local QA
artifacts under `output/playwright/`. The new session endpoint and owner
workspace have not been deployed or tested against a live production session.
This is local verification, not user approval or a production release.
