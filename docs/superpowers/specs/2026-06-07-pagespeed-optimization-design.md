# PageSpeed Optimization Design - 2026-06-07

## Goal

Improve Google PageSpeed results for the measured public and SPA-only routes without changing route names, auth/billing behavior, Learn content, or SEO-visible canonical assets.

Measured routes:

- `https://opten.space/`
- `https://opten.space/learn`
- `https://opten.space/learn/actual-ai-tools-2026`
- `https://opten.space/blog`
- `https://opten.space/blog/kling-3-prompts`
- `https://opten.space/login`

## Baseline

The official PageSpeed API quota without a key returned `429`. The paused local PageSpeed MCP config still contained a Google API key, so the keyed API was used for the baseline.

Mobile scores were already strong, but the weaker pages were image-heavy:

- `/learn`: 82, LCP 3.9s, total bytes ~1.39 MB
- `/learn/actual-ai-tools-2026`: 84, LCP 3.6s, total bytes ~0.69 MB
- `/blog`: 88, LCP 3.6s, total bytes ~1.96 MB
- `/blog/kling-3-prompts`: 86, LCP 3.6s, total bytes ~1.45 MB
- `/login`: 89, LCP 3.15s, total bytes ~0.56 MB
- `/`: 98, LCP 2.1s, total bytes ~0.64 MB

The recurring causes were:

- Public `blog` and `learn` images are referenced by path from `public/`, so Vite's existing image pipeline does not optimize them.
- Static assets on Vercel were served with `Cache-Control: public, must-revalidate, max-age=0`.
- SPA-only rewrites such as `/login` used `/index.html`, which is prerendered for the landing page and can expose stale landing markup/assets before the client mounts the actual route.

## Chosen Approach

1. Generate WebP and AVIF variants for public Blog/Learn raster images during `dev` and `build`.
2. Add a small `ResponsiveImage` component that maps existing root-relative image paths to the generated variants, while preserving the original image as the fallback `img src`.
3. Use responsive images only on Blog and Learn surfaces measured in the audit.
4. Emit a separate empty `spa.html` fallback shell and point SPA-only Vercel rewrites at it, preserving all locked route names and runtime behavior.
5. Add Vercel cache headers for hashed JS/CSS, fonts, generated responsive assets, and public raster/SVG image assets.

## Non-goals

- Do not rename or remove `/login`, `/auth/callback`, `/success`, `/account`, `/dashboard/download-skill`, `/prompt-library`, `/app/*`, or `/pay`.
- Do not change Supabase, Paddle, YooKassa, extension messaging, or auth storage behavior.
- Do not alter visible Learn/Blog content or JSON-LD canonical image URLs.
- Do not cache HTML documents immutably.
