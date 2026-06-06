# Public Learn Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch Opten Learn as a public SEO-ready `/learn` and `/en/learn` section with real videos and preserved future templates.

**Architecture:** Keep the existing React/Vite/Tailwind Learn UI but move the canonical route from `/app/learn` to `/learn`. Replace split overview/detail data with a single localized content module that feeds UI, route lookup, SEO metadata, sitemap, llms, and schema. Keep old app routes as redirects and leave `/app/*` noindex.

**Tech Stack:** Vite 6, React 18, React Router 7, TypeScript, Tailwind 4, build-time SSR/prerender, JSON-LD, ffmpeg for local video optimization.

---

### Task 1: Route And Header Contract

**Files:**
- Modify: `src/main.tsx`
- Modify: `scripts/entry-server.tsx`
- Modify: `src/app/components/SiteHeader.tsx`
- Modify: `src/app/components/space/SpaceHeader.tsx`
- Modify: `src/i18n/paths.ts`
- Modify: `scripts/verify-unified-auth.mjs`
- Modify: `scripts/verify-space-learn.mjs`

- [ ] Register `/learn`, `/learn/:lessonSlug`, `/en/learn`, and `/en/learn/:lessonSlug`.
- [ ] Redirect `/app/learn*`, `/app/learn-v2`, and `/space/learn*` to `/learn`.
- [ ] Point `/app/login` compatibility redirect to `/login?next=/learn`.
- [ ] Add Learn/Courses tab to both shared headers and mark it active on `/learn` and `/en/learn`.
- [ ] Add `/learn` and lesson slugs to `EN_SIBLINGS`.
- [ ] Update static verification scripts so they require public Learn routes and no longer require Learn to be hidden.
- [ ] Run `npm run verify:unified-auth` and `npm run verify:space-learn`.
- [ ] Commit with `feat: expose learn routes`.

### Task 2: Unified Learn Content

**Files:**
- Modify: `src/content/space/learn.ts`
- Modify: `src/app/pages/space/LearnOverviewPage.tsx`
- Modify: `src/app/pages/space/LessonDetailPage.tsx`
- Modify: `src/app/components/space/learn/LearnComponents.tsx`

- [ ] Add localized RU/EN fields and helper functions for title, description, category, author role, timestamps, materials, and CTA copy.
- [ ] Publish six real standalone lessons and remove public placeholder lessons from "All lessons".
- [ ] Preserve future collections as coming-soon collection cards without fake lesson rows or "View all" CTAs.
- [ ] Hide `Continue learning` unless local progress includes at least one course collection lesson.
- [ ] Keep standalone completion toggles local but exclude standalone-only progress from `Continue learning`.
- [ ] Make all lesson links canonical `/learn/:slug`.
- [ ] Add native local-video player support for the featured lesson.
- [ ] Run `npm run verify:space-learn`.
- [ ] Commit with `feat: publish learn lesson catalog`.

### Task 3: Video Assets

**Files:**
- Create: `public/assets/learn/video/actual-ai-tools-2026.mp4`
- Create: `public/assets/learn/video/actual-ai-tools-2026-poster.jpg`
- Create: `public/assets/learn/thumbs/*.jpg`
- Modify: `src/content/space/learn.ts`

- [ ] Use ffmpeg to compress `C:\Users\КОМП\Desktop\главное.MP4` into a web-friendly public video.
- [ ] Use ffmpeg to extract a poster frame.
- [ ] Download static thumbnails for the five YouTube lessons.
- [ ] Reference all public images/videos from the catalog.
- [ ] Confirm generated asset sizes are suitable for web delivery.
- [ ] Commit with `feat: add learn video assets`.

### Task 4: SEO Manifest And Schema

**Files:**
- Modify: `scripts/seo-routes.ts`
- Modify: `scripts/entry-server.tsx`
- Modify: `src/i18n/paths.ts`
- Modify: `scripts/verify-space-learn.mjs`

- [ ] Add Learn overview route metadata for RU and EN.
- [ ] Add one route metadata entry per public lesson in RU and EN.
- [ ] Emit `CollectionPage`, `ItemList`, `Course`, `VideoObject`, `WebPage`, and `BreadcrumbList` schema using catalog data.
- [ ] Keep Learn out of noindex headers.
- [ ] Ensure `/learn` and lesson routes are full prerender routes.
- [ ] Run `npm run build`.
- [ ] Commit with `feat: add learn seo metadata`.

### Task 5: Browser Verification And Final Push

**Files:**
- Modify only if verification finds issues.

- [ ] Open `/learn` in the in-app browser and verify real lessons, header tab, hidden mobile hero extras, and no fake "Continue learning".
- [ ] Open `/en/learn` and verify EN page content and links.
- [ ] Open `/learn/actual-ai-tools-2026` and verify local video, author card, timestamps, and completion toggle.
- [ ] Open `/app/learn` and verify it redirects to `/learn`.
- [ ] Run `npm run verify:unified-auth`.
- [ ] Run `npm run verify:space-learn`.
- [ ] Run `npm run build`.
- [ ] Commit any verification fixes.
- [ ] Push `main` to origin.

