# PageSpeed Optimization Plan - 2026-06-07

## Scope

Autonomous implementation approved by the user in chat. Use the existing Vite/React/static-prerender architecture and keep changes scoped to performance plumbing.

## Steps

1. Add responsive image generation
   - Create `scripts/generate-responsive-images.mjs` using existing `sharp`.
   - Generate `public/generated/responsive/**` from `public/blog/**`, `public/assets/learn/**`, and `public/assets/space/learn-v2/**`.
   - Ignore generated output in git and run the generator before `dev` and `build`.

2. Render responsive images
   - Add `src/app/components/ResponsiveImage.tsx`.
   - Replace direct Blog/Learn `<img>` usage for covers, thumbnails, posters, author avatars, and collection cards.
   - Keep original `src`, `alt`, `width`, and `height` fallbacks.

3. Remove stale landing fallback from SPA-only routes
   - Emit `dist/spa.html` in `scripts/prerender.mjs`.
   - Point only SPA/noindex rewrites in `vercel.json` at `/spa.html`.

4. Add static cache policy
   - Long immutable cache for generated responsive assets, JS/CSS, and fonts.
   - Long but non-immutable cache for public image paths.
   - Leave HTML, API, auth/backend calls, and payment endpoints uncached by these rules.

5. Verify
   - Run `npm run build`.
   - Inspect generated `dist/spa.html` and responsive assets.
   - Deploy/push and run fresh Google PageSpeed measurements against the public preview or live deployment available after push.
