# Learn Finds Suffler Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Learn Finds website format and a suffler publish flow that turns analyzed YouTube videos into deployed site pages.

**Architecture:** The website renders typed content from `src/content/space/learnFinds.generated.json` and prerenders public RU/EN find routes. Suffler calls NotebookLM CLI locally, merges structured data into the generated JSON, runs the website build, then commits and pushes the generated content.

**Tech Stack:** Vite 6, React 18, React Router 7, TypeScript, Tailwind 4, Electron, Node.js `child_process`, local `notebooklm` CLI, git.

---

### Task 1: Website Learn Finds Content Model

**Files:**
- Create: `src/content/space/learnFinds.generated.json`
- Create: `src/content/space/learnFinds.ts`
- Modify: `src/content/space/learnSlugs.ts`

- [ ] Add three seed finds using the already validated YouTube URLs.
- [ ] Add typed helpers for localized fields, thumbnail URLs, route lookup, and timestamp/resource normalization.
- [ ] Export `LEARN_FIND_SLUGS` for light route/sitemap imports.

### Task 2: Website Learn Finds UI

**Files:**
- Modify: `src/app/pages/space/LearnOverviewPage.tsx`
- Create: `src/app/pages/space/LearnFindDetailPage.tsx`
- Modify: `src/app/components/space/learn/LearnComponents.tsx`
- Modify: `src/main.tsx`
- Modify: `scripts/entry-server.tsx`

- [ ] Add a segmented switch beside the Learn lesson heading.
- [ ] Render find cards from YouTube thumbnails.
- [ ] Add a detail page with YouTube player, summary, takeaways, commands, prompts, resources, risks, timestamps, and source link.
- [ ] Register RU/EN routes.

### Task 3: Website SEO Pipeline

**Files:**
- Modify: `scripts/seo-routes.ts`
- Modify: `scripts/sitemap.mjs`
- Modify: `scripts/llms.mjs`
- Modify: `scripts/verify-space-learn.mjs`
- Modify: `src/i18n/paths.ts`
- Modify: `docs/LEARN-PUBLISHING.md`

- [ ] Add prerender metadata/schema for find routes.
- [ ] Add EN sibling mapping, sitemap lastmod source, llms grouping, and static verify guards.
- [ ] Document the generated JSON publish path.

### Task 4: Suffler Publish Pipeline

**Files:**
- Create: `C:\Projects\suffler\youtube-story-teleprompter-mvp\desktop\publisher\learnFindPublisher.js`
- Create: `C:\Projects\suffler\youtube-story-teleprompter-mvp\desktop\test\publisher.test.js`
- Modify: `C:\Projects\suffler\youtube-story-teleprompter-mvp\desktop\main.js`
- Modify: `C:\Projects\suffler\youtube-story-teleprompter-mvp\desktop\preload.js`
- Modify: `C:\Projects\suffler\youtube-story-teleprompter-mvp\desktop\renderer\index.html`
- Modify: `C:\Projects\suffler\youtube-story-teleprompter-mvp\desktop\renderer\app.js`
- Modify: `C:\Projects\suffler\youtube-story-teleprompter-mvp\desktop\renderer\style.css`
- Modify: `C:\Projects\suffler\youtube-story-teleprompter-mvp\README.md`

- [ ] Implement NotebookLM status/login/analyze helpers.
- [ ] Implement generated JSON merge, build, commit, and push with dirty worktree guards.
- [ ] Add Publish button and status/link UI after analysis.
- [ ] Add publisher unit tests with dry-run stubs.

### Task 5: Verification

**Commands:**
- Website: `npm run sync:agents`, `npm run verify:space-learn`, `npm run build`
- Suffler: `npm test`
- Browser smoke: open local `/learn` and one `/learn/finds/:slug` route and verify nonblank UI.
