# Learn Publishing

`/learn` is the public, indexable Opten learning section. Legacy app URLs
(`/app/learn`, `/app/learn/:lessonSlug`, `/space/learn/:lessonSlug`) are
compatibility redirects only.

## Routes

- RU hub: `/learn`
- RU lesson: `/learn/:lessonSlug`
- EN hub: `/en/learn`
- EN lesson: `/en/learn/:lessonSlug`

Every public lesson ships RU and EN content together. Do not publish a RU-only
or EN-only lesson.

## Source Files

- Catalog and localized lesson data: `src/content/space/learn.ts`
- Lightweight i18n slug allow-list: `src/content/space/learnSlugs.ts`
- Overview page: `src/app/pages/space/LearnOverviewPage.tsx`
- Lesson page UI/player: `src/app/components/space/learn/LearnComponents.tsx`
- Runtime routes: `src/main.tsx`
- SSR routes: `scripts/entry-server.tsx`
- SEO metadata/schema routes: `scripts/seo-routes.ts`
- Sitemap lastmod and floor checks: `scripts/sitemap.mjs`
- LLM index floor and grouping: `scripts/llms.mjs`
- Static guard: `scripts/verify-space-learn.mjs`

## Adding A YouTube Lesson

1. Choose a locale-neutral slug and add it to `LEARN_LESSON_SLUGS`.
2. Add a `LearnLesson` entry to `publicLearnLessons`.
3. Use one of the existing topics only: `ai-image`, `ai-video`, `vibe-coding`,
   `vibe-design`, `business`.
4. Generate timestamps with NotebookLM:

   ```bash
   npm run learn:video-notes -- "https://youtu.be/..."
   ```

5. Store a 1200px-wide 16:9 thumbnail at
   `public/assets/learn/thumbs/<slug>.jpg`.
6. Store a 1200x630 OG crop at `public/assets/learn/og/<slug>.jpg`.
7. Fill RU and EN title, description, SEO title/description, topics, outcomes,
   timestamps, published date, duration, and YouTube metadata.
8. Run:

   ```bash
   npm run verify:space-learn
   npm run build
   ```

## Adding A Local Video

Optimize local MP4s before committing:

```bash
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:v libx264 -preset medium -crf 30 -c:a aac -b:a 96k -movflags +faststart public/assets/learn/video/<slug>.mp4
```

Also create:

- `public/assets/learn/video/<slug>-poster.jpg`
- `public/assets/learn/og/<slug>.jpg` at 1200x630

Set `localVideo` in the lesson entry. The local player supports native controls
and timestamp seeking.

## Access And Progress Rules

- Standalone lessons live in `publicLearnLessons` and do not create a
  "continue learning" course-progress card.
- Course collections stay hidden while `learnCourses` is empty.
- Future locked lessons use `access: "full-platform"`; UI labels this as
  unlocked on Pro, not as a credit price.
- Manual completion is stored in `localStorage.opten_space_learn_progress_v1`
  and must always be reversible.

## Player Notes

YouTube lessons use a custom Opten poster and play button before activation.
After click, the embedded YouTube iframe controls are controlled by YouTube and
cannot be fully restyled or hidden. Local MP4 lessons use the native video
player and can seek directly from timestamp clicks.

## Secrets

NotebookLM and YouTube access belongs in local `.secrets/*` files or process
environment only. Do not commit API keys, cookies, OAuth tokens, or NotebookLM
session material.
