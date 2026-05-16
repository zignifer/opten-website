// Phase 2 GEO-B-3 / D-04: Postbuild sitemap.xml emitter with build-time uniform <lastmod>.
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

if (sitemapRoutes.length < 12) {
  throw new Error(`sitemap.mjs: expected at least 12 routes (6 RU + 6 EN) per Phase 3, got ${sitemapRoutes.length}. Manifest mis-loaded or EN entries missing?`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapRoutes.map(r => `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="ru"        href="${r.hreflangAlternates.ru}" />
    <xhtml:link rel="alternate" hreflang="en"        href="${r.hreflangAlternates.en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${r.hreflangAlternates.xDefault}" />
  </url>`).join("\n")}
</urlset>
`;

await writeFile(resolve(DIST, "sitemap.xml"), xml, "utf-8");
console.log(`✓ sitemap.xml → ${sitemapRoutes.length} routes (RU + EN, lastmod ${BUILD_DATE})`);
