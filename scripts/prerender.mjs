// Phase 2 GEO-B-1 / GEO-B-2 / D-02: Postbuild prerenderer for marketing routes.
// Reads dist/index.html, imports SSR bundle + manifest from .ssr-cache, splices per-route head + body, writes dist/{route}/index.html.
//
// Prerequisite build chain:
//   vite build                                                                  (SPA shell → dist/)
//   vite build --ssr scripts/entry-server.tsx --outDir .ssr-cache --emptyOutDir (React SSR bundle)
//   vite build --ssr scripts/seo-routes.ts    --outDir .ssr-meta               (route manifest)
//   node scripts/prerender.mjs
//
// Two outDirs prevent Vite 6 from erasing the entry-server bundle when compiling seo-routes.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SSR_BUNDLE = resolve(ROOT, ".ssr-cache", "entry-server.js");
const MANIFEST_BUNDLE = resolve(ROOT, ".ssr-meta", "seo-routes.js");

const { renderRoute } = await import(pathToFileURL(SSR_BUNDLE).href);
const { routes, SITE_ORIGIN, DEFAULT_OG_IMAGE } = await import(pathToFileURL(MANIFEST_BUNDLE).href);

const template = await readFile(resolve(DIST, "index.html"), "utf-8");

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Phase 3 GEO-C-4: bake <html lang> per emitted file. Replaces runtime mutator deleted in Plan 01 (RESEARCH.md Pattern 3).
function applyHtmlLang(html, meta) {
  const htmlLangRe = /<html\s+lang="[^"]*"([^>]*)>/;
  // Fail-fast: check anchor exists before replace (html===before is unreliable when lang already matches — Rule 1 fix).
  if (!htmlLangRe.test(html)) {
    throw new Error(`prerender(${meta.path}): no <html lang> matched. index.html structure changed?`);
  }
  // ([^>]*) preserves any future siblings like dir="ltr" — Pitfall 3 mitigation.
  return html.replace(htmlLangRe, `<html lang="${escapeAttr(meta.htmlLang)}"$1>`);
}

// Phase 3 GEO-C-3: inject hreflang triplet (ru / en / x-default) after canonical link (RESEARCH.md Pattern 2).
// Must run AFTER applyMeta — canonical link is injected by applyMeta; it doesn't exist in the source template.
// Reciprocity: all three href values come from seo-routes.ts manifest (Pitfall 5 — never hand-typed).
function applyHreflang(html, meta) {
  const before = html;
  const tags = [
    `    <link rel="alternate" hreflang="ru"        href="${escapeAttr(meta.hreflangAlternates.ru)}" />`,
    `    <link rel="alternate" hreflang="en"        href="${escapeAttr(meta.hreflangAlternates.en)}" />`,
    `    <link rel="alternate" hreflang="x-default" href="${escapeAttr(meta.hreflangAlternates.xDefault)}" />`,
  ].join("\n");
  // Anchor: canonical link injected by applyMeta.
  html = html.replace(/(<link rel="canonical"[^>]*\/>)/, `$1\n${tags}`);
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no <link rel="canonical"> anchor for hreflang. applyMeta ordering broken?`);
  }
  return html;
}

// Phase 3 GEO-C-4 / Pitfall 4: update og:locale + inject og:locale:alternate to match <html lang>.
// og:locale must always match <html lang> — mismatches confuse Open Graph scrapers (RESEARCH.md §Pitfall 4).
function applyOgLocale(html, meta) {
  const ogLocaleRe = /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/;
  // Fail-fast: check anchor exists before replace (html===before unreliable when content already matches — Rule 1 fix).
  if (!ogLocaleRe.test(html)) {
    throw new Error(`prerender(${meta.path}): no <meta property="og:locale"> matched. index.html structure changed?`);
  }
  const ogLocale = meta.htmlLang === "en" ? "en_US" : "ru_RU";
  const alternate = meta.htmlLang === "en" ? "ru_RU" : "en_US";
  // First replace: swap og:locale content value.
  html = html.replace(
    ogLocaleRe,
    `<meta property="og:locale" content="${escapeAttr(ogLocale)}" />`
  );
  // Second replace: inject og:locale:alternate after og:locale (idempotent).
  html = html.replace(
    /(<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>)/,
    `$1\n    <meta property="og:locale:alternate" content="${escapeAttr(alternate)}" />`
  );
  return html;
}

function applyMeta(html, meta) {
  const before = html;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeAttr(meta.ogDescription)}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escapeAttr(meta.ogDescription)}" />`);
  // Inject canonical after theme-color anchor (no canonical exists in source today — D-07)
  html = html.replace(
    /<meta name="theme-color"[^>]*\/?>/,
    (m) => `${m}\n    <link rel="canonical" href="${escapeAttr(meta.canonical)}" />`
  );
  if (html === before) {
    throw new Error(`prerender(${meta.path}): no <head> tags matched. index.html structure changed?`);
  }
  return html;
}

function applyBody(html, rendered) {
  const target = '<div id="root"></div>';
  if (!html.includes(target)) {
    throw new Error('prerender: empty <div id="root"></div> not found in dist/index.html');
  }
  return html.replace(target, `<div id="root">${rendered}</div>`);
}

// Path marker: lets main.tsx distinguish a real route match from an SPA-fallback hit.
// Without this, Vercel's rewrite serves dist/index.html (which is prerendered for "/")
// at any uncovered route (/account, /success, /dashboard/*) — hydrateRoot would then
// mismatch the client-rendered route component and trigger React #418/#423.
function applyMarker(html, path) {
  const marker = `<script>window.__PRERENDER_PATH=${JSON.stringify(path)};</script>`;
  if (!html.includes("</head>")) {
    throw new Error("prerender: </head> not found — cannot inject route marker");
  }
  return html.replace("</head>", `    ${marker}\n  </head>`);
}

// Phase 2.1 D-03: Synthesize <link rel="modulepreload"> from Vite's <script type="module" src="...">.
// Vite 6 does NOT auto-emit modulepreload for the entry chunk (RESEARCH.md line 122–130).
// The link is appended before </head>, which places it AFTER the Paddle <script> tag (which is
// higher in <head> in the source template). modulepreload only hints fetch parallelism — it does
// not change script execution order, so Paddle still loads synchronously before main.tsx runs
// (Integration Contract §6 preserved).
// MUST be called BEFORE applyMarker: applyMarker replaces </head> and a subsequent search for
// the same anchor would silently no-op (Pitfall 5, RESEARCH.md lines 465–470).
function applyModulePreload(html) {
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!match) return html; // dev build / missing entry — silent no-op
  const chunkHref = match[1];
  const tag = `    <link rel="modulepreload" href="${chunkHref}">`;
  return html.replace("</head>", `${tag}\n  </head>`);
}

// Phase 2.2 Safari fix: Vite emits <link rel="modulepreload"> for the entry and every
// statically-imported vendor chunk, but Safari < iOS 17 (Sep 2023) IGNORES modulepreload.
// On those browsers vendor-react.js / vendor-router.js / vendor-lucide.js only start
// fetching after the main chunk has parsed and the dynamic import graph has been
// resolved — adding 100-300 ms of sequential network time to TTI.
//
// Fix: for every <link rel="modulepreload"> already emitted, ALSO emit a parallel
// <link rel="preload" as="script" crossorigin>. preload as=script is supported on
// Safari iOS 11+ and triggers a parallel fetch into the prefetch cache. Modern browsers
// see both tags; modulepreload is preferred because it ALSO parses the module graph,
// but the preload duplicate doesn't hurt — same byte stream, double-counted in cache.
// The browser deduplicates the network request.
//
// Also emit a preload for the entry script (Vite emits a <script type="module" src=>
// for the entry but no preload, since the script tag itself is supposed to be enough —
// it isn't on slow Safari, which fetches scripts later than preloaded resources).
function applySafariPreloadFallback(html) {
  const moduleHrefs = [...html.matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"/g)].map(m => m[1]);
  const entryMatch = html.match(/<script type="module"[^>]*src="(\/assets\/index-[^"]+\.js)"/);
  const allHrefs = [...new Set([...(entryMatch ? [entryMatch[1]] : []), ...moduleHrefs])];
  if (allHrefs.length === 0) return html;
  const tags = allHrefs
    .map(h => `    <link rel="preload" as="script" crossorigin href="${h}">`)
    .join("\n");
  return html.replace("</head>", `${tags}\n  </head>`);
}

// Phase 2.2: Inject Paddle SDK <script> tag synchronously into /pay only.
// Integration Contract §6 requires window.Paddle to exist before PayPage interacts with it.
// Loading the SDK site-wide (previous behavior) cost 500-1500ms render-blocking on mobile 3G
// for routes that don't use Paddle (/, /welcome, /privacy, /terms, /refund). We now scope the
// sync tag to /pay/index.html; other routes load Paddle on demand via src/lib/paddle.ts.
// MUST run BEFORE applyMarker (consumes </head>).
function applyPaddleScript(html) {
  // preconnect first so DNS+TLS overlap with HTML parse, then the sync script tag.
  // Pair scoped to /pay only (PageSpeed flagged the site-wide preconnect as unused).
  const tag = `    <link rel="preconnect" href="https://cdn.paddle.com" />\n    <script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>`;
  return html.replace("</head>", `${tag}\n  </head>`);
}

for (const meta of routes) {
  // resolve ogImage default (Phase 2 site-wide og-card-ru.png per Open Question #2)
  const ogImage = meta.ogImage ?? DEFAULT_OG_IMAGE;
  // (ogImage is read but not currently re-injected — index.html already has og-card-ru.png hardcoded; Phase 4+ may swap this per-route)
  let html = applyMeta(template, meta);
  html = applyHtmlLang(html, meta);         // Phase 3 GEO-C-4: bake <html lang> per file
  html = applyHreflang(html, meta);         // Phase 3 GEO-C-3: inject hreflang triplet after canonical (must follow applyMeta)
  html = applyOgLocale(html, meta);         // Phase 3 GEO-C-4 / Pitfall 4: update og:locale + alternate
  html = applyModulePreload(html);          // Phase 2.1 D-03: must precede applyMarker (which consumes </head>)
  html = applySafariPreloadFallback(html);  // Phase 2.2 Safari fix: must run after applyModulePreload so it sees all module hrefs
  if (meta.path === "/pay" || meta.path === "/en/pay") {
    html = applyPaddleScript(html);         // Phase 3 D-03b: sync Paddle SDK on /pay AND /en/pay (symmetric extension; INTEGRATION-CONTRACT §6).
  }
  html = applyMarker(html, meta.path);
  if (meta.prerender === "full") {
    const rendered = renderRoute(meta.path);
    html = applyBody(html, rendered);
  }
  // For "head" tier (e.g., /pay): leave body empty, head is already overridden.
  // For "none" tier: skip (don't write a file — SPA fallback handles).
  if (meta.prerender === "none") continue;

  // Output path: "/" → dist/index.html (overwrite), "/welcome" → dist/welcome/index.html
  const outPath = meta.path === "/"
    ? resolve(DIST, "index.html")
    : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, "utf-8");
  console.log(`✓ ${meta.path} → ${outPath.replace(ROOT, "")} (${meta.prerender})`);
}
console.log(`✓ prerender complete: ${routes.filter(r => r.prerender !== "none").length} routes emitted`);
