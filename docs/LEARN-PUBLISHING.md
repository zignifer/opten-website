# Learn Publishing

`/learn` is the public, indexable Opten learning section. Legacy app URLs
(`/app/learn`, `/app/learn/:lessonSlug`, `/space/learn/:lessonSlug`) are
compatibility redirects only.

## Routes

- RU hub: `/learn`
- RU lesson: `/learn/:lessonSlug`
- RU find: `/learn/finds/:findSlug`
- EN hub: `/en/learn`
- EN lesson: `/en/learn/:lessonSlug`
- EN find: `/en/learn/finds/:findSlug`

Every public lesson ships RU and EN content together. Do not publish a RU-only
or EN-only lesson.

## Source Files

- Catalog and localized lesson data: `src/content/space/learn.ts`
- Generated Learn Finds data: `src/content/space/learnFinds.generated.json`
- Learn Finds typed helpers: `src/content/space/learnFinds.ts`
- Lightweight i18n slug allow-list: `src/content/space/learnSlugs.ts`
- Overview page: `src/app/pages/space/LearnOverviewPage.tsx`
- Lesson page UI/player: `src/app/components/space/learn/LearnComponents.tsx`
- Learn Find detail page: `src/app/pages/space/LearnFindDetailPage.tsx`
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

## Adding A Learn Find From Suffler

Learn Finds are curated third-party YouTube expert videos enriched by Opten.
They are not Opten-authored lessons and must not mirror or re-upload the video.
The page embeds the original YouTube video, uses the YouTube thumbnail, removes
the Opten author/course card, and labels the source as another author/source.

The normal publishing path is the local `C:\Projects\suffler` desktop app:

1. Analyze the YouTube link for the story script.
2. Click `Опубликовать на сайт`.
3. Suffler first tries to read YouTube metadata and chapter timestamps from the
   player payload or video description.
4. Suffler checks `notebooklm` auth, starts `notebooklm login` if needed, adds
   the YouTube source, asks for structured Learn Find JSON, merges it into
   `src/content/space/learnFinds.generated.json`, runs `npm run build`, commits,
   and pushes the generated content.
   - If YouTube chapters exist, their exact `time`/`seconds` values are kept;
     NotebookLM enriches titles/descriptions and translates RU/EN.
   - If chapters do not exist, NotebookLM must return 8-14 specific timestamps
     from the transcript, not broad rounded placeholders.
5. Vercel deploys from the pushed commit. The app shows the final public URL.

Manual edits are allowed only in `src/content/space/learnFinds.generated.json`
or the typed helper if the schema changes. Do not commit NotebookLM auth state,
temporary notebooks, raw transcripts, API keys, or local suffler settings.

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

## Hidden Kinescope Course MVP

The direct-link course MVP lives outside the public SEO Learn catalog:

- Course route: `/learn/courses/ai-content-marketing-2026`
- First lesson route:
  `/learn/courses/ai-content-marketing-2026/lesson-1-prompting`
- Source data: `src/content/space/privateCourse.ts`
- Client page: `src/app/pages/space/PrivateCoursePage.tsx`
- Playback token endpoint: `POST /api/kinescope-course-token`
- Kinescope auth callback: `POST /api/kinescope-course-auth`

Keep `/learn/courses/*` noindex and out of sitemap, llms.txt, header nav, and
`EN_SIBLINGS` until launch. Do not store Kinescope API keys or playback secrets
in browser code. The client requests a short-lived Kinescope embed URL with the
website Supabase JWT; the server verifies Pro access before signing
`drmauthtoken`. Kinescope then calls the auth callback during playback and gets
200 or 403.

Before enabling Kinescope project auth backend in production, set
`KINESCOPE_AUTH_JWT_SECRET` in Vercel and verify that the deployed callback is
reachable. Optional Basic Auth for the callback uses
`KINESCOPE_DRM_AUTH_USERNAME` and `KINESCOPE_DRM_AUTH_PASSWORD`.

## Future Course Collections

The course-page template is intentionally preserved in code, even though the
current public catalog uses standalone lessons only.

Direct noindex template URLs:

- Course page: `/learn/templates/course`
- Locked Pro lesson state: `/learn/templates/course/template-course-06`
- Standalone lesson page: `/learn/templates/standalone`
- English course page: `/en/learn/templates/course`
- English standalone lesson page: `/en/learn/templates/standalone`

- Add a future course to `learnCourses` in `src/content/space/learn.ts`.
- Keep `kind: "course"` through the generated `learnCollections` mapping.
- Put every course lesson in the course's `lessons` array in display order.
- Use `access: "free"` for open lessons and `access: "full-platform"` for
  lessons unlocked by Pro.
- Set `progress.total` to the number of course lessons. The UI recalculates
  completed count from manual progress and built-in completed lessons.
- Course lesson pages automatically show the right sidebar with both tabs:
  lesson list and timestamps.
- Standalone lesson pages keep only the timestamps tab.
- The "continue learning" surface should remain hidden while `learnCourses` is
  empty, and can be enabled when real course progress exists.
- Future placeholder cards live in `futureLearnCollections`; they are visual
  teasers only and should not link to fake lesson pages.

## Player Notes

YouTube lessons use a custom Opten poster and play button before activation.
After click, the embedded YouTube iframe controls are controlled by YouTube and
cannot be fully restyled or hidden. Local MP4 lessons use the native video
player and can seek directly from timestamp clicks.

## Secrets

NotebookLM and YouTube access belongs in local `.secrets/*` files or process
environment only. Do not commit API keys, cookies, OAuth tokens, or NotebookLM
session material.
