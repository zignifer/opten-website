// Phase 2 GEO-B-3 / D-04: Postbuild sitemap.xml emitter.
// Phase 4.1 follow-up: per-route <lastmod> via git mtime (post-2026-05-17 GEO audit ME-12).
// Reads manifest from .ssr-meta/seo-routes.js, writes dist/sitemap.xml (overwrites Vite-copied public/sitemap.xml fallback).
//
// Deviation from plan spec: .ssr-meta/ (not .ssr-cache/) — Vite 6 empties outDir on every SSR build,
// so seo-routes.ts compiles to .ssr-meta/seo-routes.js and entry-server.tsx compiles to .ssr-cache/.
// See 02-04-SUMMARY.md for full explanation.
//
// Prerequisite build chain (Plan 02-06 will wire this):
//   vite build                                                                  (SPA shell → dist/)
//   vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir (React SSR bundle)
//   vite build --ssr scripts/seo-routes.ts    --outDir .ssr-meta               (route manifest)
//   node scripts/prerender.mjs
//   node scripts/sitemap.mjs

import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const MANIFEST_BUNDLE = resolve(ROOT, ".ssr-meta", "seo-routes.js");
const BUILD_DATE = new Date().toISOString().split("T")[0];

const { routes, SITE_ORIGIN } = await import(pathToFileURL(MANIFEST_BUNDLE).href);

const sitemapRoutes = routes.filter(r => r.prerender !== "none");

// Phase v2.0 MODELS-B-3b: floor bumped 22 → 144 now that all 62 model content
// files landed. 152 = 26 baseline/blog routes + 2 hubs (/models + /en/models) + 124 model
// pages (62 RU + 62 EN). Daily blog posts bring the floor to 170; public Learn adds 14 lesson routes
// and Learn Finds adds generated third-party video breakdown routes.
// /dashboard/*) carry prerender:"none" and are excluded from sitemapRoutes.
if (sitemapRoutes.length < 214) {
  throw new Error(`sitemap.mjs: expected at least 214 routes (64 marketing/blog routes + 24 Learn routes + 126 model routes), got ${sitemapRoutes.length}. Manifest mis-loaded or entries missing?`);
}

// Post-2026-05-17 GEO audit ME-12: per-route lastmod via git mtime of the source file driving
// the route. Same git mtime → same lastmod; this gives Google/Bing a meaningful freshness signal
// for partial-update deploys (was: uniform BUILD_DATE → every page looked equally fresh, which
// means every page also looks equally stale).
//
// path → primary source file. Both locale siblings share the same source (and therefore the same
// lastmod) — that's correct: bilingual edits to /about always touch src/content/about.tsx.
//
// Phase v2.0 MODELS-A-9: model paths handled by sourceForRoute() function below
// (dynamic — would otherwise need 124 hand-listed entries by end of Phase 2).
const PATH_TO_SOURCE = {
  "/":                       "src/app/App.tsx",
  "/en/":                    "src/app/App.tsx",
  "/about":                  "src/content/about.tsx",
  "/en/about":               "src/content/about.tsx",
  "/blog":                   "src/content/blog/index.ts",
  "/en/blog":                "src/content/blog/index.ts",
  "/blog/ai-for-work":       "src/content/blog/ai-for-work.ts",
  "/en/blog/ai-for-work":    "src/content/blog/ai-for-work.ts",
  "/blog/free-ai-courses":       "src/content/blog/free-ai-courses.ts",
  "/en/blog/free-ai-courses":    "src/content/blog/free-ai-courses.ts",
  "/blog/ai-courses-for-beginners":       "src/content/blog/ai-courses-for-beginners.ts",
  "/en/blog/ai-courses-for-beginners":    "src/content/blog/ai-courses-for-beginners.ts",
  "/blog/neural-networks-from-scratch":       "src/content/blog/neural-networks-from-scratch.ts",
  "/en/blog/neural-networks-from-scratch":    "src/content/blog/neural-networks-from-scratch.ts",
  "/blog/ai-training-beginners":       "src/content/blog/ai-training-beginners.ts",
  "/en/blog/ai-training-beginners":    "src/content/blog/ai-training-beginners.ts",
  "/blog/ai-headshot-generator":       "src/content/blog/ai-headshot-generator.ts",
  "/en/blog/ai-headshot-generator":    "src/content/blog/ai-headshot-generator.ts",
  "/blog/ai-ugc-for-brands":       "src/content/blog/ai-ugc-for-brands.ts",
  "/en/blog/ai-ugc-for-brands":    "src/content/blog/ai-ugc-for-brands.ts",
  "/blog/upscale-image-ai":       "src/content/blog/upscale-image-ai.ts",
  "/en/blog/upscale-image-ai":    "src/content/blog/upscale-image-ai.ts",
  "/blog/ai-lip-sync":       "src/content/blog/ai-lip-sync.ts",
  "/en/blog/ai-lip-sync":    "src/content/blog/ai-lip-sync.ts",
  "/blog/flux-2-prompts":    "src/content/blog/flux-2-prompts.ts",
  "/en/blog/flux-2-prompts": "src/content/blog/flux-2-prompts.ts",
  "/blog/kling-3-prompts":    "src/content/blog/kling-3-prompts.ts",
  "/en/blog/kling-3-prompts": "src/content/blog/kling-3-prompts.ts",
  "/blog/ai-influencer":    "src/content/blog/ai-influencer.ts",
  "/en/blog/ai-influencer": "src/content/blog/ai-influencer.ts",
  "/blog/prompt-examples":    "src/content/blog/prompt-examples.ts",
  "/en/blog/prompt-examples": "src/content/blog/prompt-examples.ts",
  "/blog/seedance-2-0-prompts":    "src/content/blog/seedance-2-0-prompts.ts",
  "/en/blog/seedance-2-0-prompts": "src/content/blog/seedance-2-0-prompts.ts",
  "/blog/ai-face-swap":    "src/content/blog/ai-face-swap.ts",
  "/en/blog/ai-face-swap": "src/content/blog/ai-face-swap.ts",
  "/blog/best-ai-video-2026":    "src/content/blog/best-ai-video-2026.ts",
  "/en/blog/best-ai-video-2026": "src/content/blog/best-ai-video-2026.ts",
  "/blog/sora-2-vs-veo-3-1":    "src/content/blog/sora-2-vs-veo-3-1.ts",
  "/en/blog/sora-2-vs-veo-3-1": "src/content/blog/sora-2-vs-veo-3-1.ts",
  "/blog/ai-logo-generator-prompt":    "src/content/blog/ai-logo-generator-prompt.ts",
  "/en/blog/ai-logo-generator-prompt": "src/content/blog/ai-logo-generator-prompt.ts",
  "/blog/nano-banana-prompts":    "src/content/blog/nano-banana-prompts.ts",
  "/en/blog/nano-banana-prompts": "src/content/blog/nano-banana-prompts.ts",
  "/blog/consistent-character-ai":    "src/content/blog/consistent-character-ai.ts",
  "/en/blog/consistent-character-ai": "src/content/blog/consistent-character-ai.ts",
  "/blog/prompt-structure":    "src/content/blog/prompt-structure.ts",
  "/en/blog/prompt-structure": "src/content/blog/prompt-structure.ts",
  "/blog/negative-prompt":    "src/content/blog/negative-prompt.ts",
  "/en/blog/negative-prompt": "src/content/blog/negative-prompt.ts",
  "/blog/image-to-video":    "src/content/blog/image-to-video.ts",
  "/en/blog/image-to-video": "src/content/blog/image-to-video.ts",
  "/blog/gpt-image-2":       "src/content/blog/gpt-image-2.ts",
  "/en/blog/gpt-image-2":    "src/content/blog/gpt-image-2.ts",
  "/pay":                    "src/app/pages/PayPage.tsx",
  "/en/pay":                 "src/app/pages/PayPage.tsx",
  "/welcome":                "src/app/pages/WelcomePage.tsx",
  "/en/welcome":             "src/app/pages/WelcomePage.tsx",
  "/privacy":                "src/app/pages/PrivacyPage.tsx",
  "/en/privacy":             "src/app/pages/PrivacyPage.tsx",
  "/terms":                  "src/app/pages/TermsPage.tsx",
  "/en/terms":               "src/app/pages/TermsPage.tsx",
  "/refund":                 "src/app/pages/RefundPage.tsx",
  "/en/refund":              "src/app/pages/RefundPage.tsx",
  "/models":                 "src/content/models/index.ts",
  "/en/models":              "src/content/models/index.ts",
  "/learn":                  "src/content/space/learn.ts",
  "/en/learn":               "src/content/space/learn.ts",
};

// Phase v2.0 MODELS-A-9: dynamic mapping for /models/<slug> paths. Each model
// route is driven by its individual content file in src/content/models/<slug>.ts.
function sourceForRoute(route) {
  const explicit = PATH_TO_SOURCE[route.path];
  if (explicit) return explicit;
  const match = route.path.match(/^\/(en\/)?models\/(.+)$/);
  if (match) return `src/content/models/${match[2]}.ts`;
  if (/^\/(en\/)?learn\/finds\/[^/]+$/.test(route.path)) return "src/content/space/learnFinds.generated.json";
  if (/^\/(en\/)?learn\/[^/]+$/.test(route.path)) return "src/content/space/learn.ts";
  return null;
}

function gitMtime(relativePath) {
  try {
    // -1 = last commit only; %cI = committer date ISO 8601 strict.
    const stdout = execFileSync("git", ["log", "-1", "--format=%cI", "--", relativePath], {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!stdout) return null;
    // Sitemap spec accepts full ISO 8601 — keep timezone for accuracy.
    // Strip to YYYY-MM-DD for consistency with the rest of the file/older audits.
    return stdout.split("T")[0];
  } catch {
    return null;
  }
}

function lastmodForRoute(route) {
  const source = sourceForRoute(route);
  if (!source) return BUILD_DATE;
  return gitMtime(source) ?? BUILD_DATE;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapRoutes.map(r => `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${lastmodForRoute(r)}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="ru"        href="${r.hreflangAlternates.ru}" />
    <xhtml:link rel="alternate" hreflang="en"        href="${r.hreflangAlternates.en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${r.hreflangAlternates.xDefault}" />
  </url>`).join("\n")}
</urlset>
`;

await writeFile(resolve(DIST, "sitemap.xml"), xml, "utf-8");
console.log(`✓ sitemap.xml → ${sitemapRoutes.length} routes (RU + EN, per-route lastmod via git mtime)`);
