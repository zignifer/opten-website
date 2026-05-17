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

if (sitemapRoutes.length < 16) {
  throw new Error(`sitemap.mjs: expected at least 16 routes (7 RU + 7 EN + 2 guide siblings per Phase 4 D-01/D-06 + Phase 4.1 B-03 /en/about), got ${sitemapRoutes.length}. Manifest mis-loaded or entries missing?`);
}

// Post-2026-05-17 GEO audit ME-12: per-route lastmod via git mtime of the source file driving
// the route. Same git mtime → same lastmod; this gives Google/Bing a meaningful freshness signal
// for partial-update deploys (was: uniform BUILD_DATE → every page looked equally fresh, which
// means every page also looks equally stale).
//
// path → primary source file. Both locale siblings share the same source (and therefore the same
// lastmod) — that's correct: bilingual edits to /about always touch src/content/about.tsx.
const PATH_TO_SOURCE = {
  "/":                       "src/app/App.tsx",
  "/en/":                    "src/app/App.tsx",
  "/about":                  "src/content/about.tsx",
  "/en/about":               "src/content/about.tsx",
  "/guides/gpt-image-2":     "src/content/guides/gpt-image-2.ts",
  "/en/guides/gpt-image-2":  "src/content/guides/gpt-image-2.ts",
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
};

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
  const source = PATH_TO_SOURCE[route.path];
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
