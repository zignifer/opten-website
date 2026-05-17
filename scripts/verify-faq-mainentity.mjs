// Phase 4.1 WR-09: build-time gate enforcing V-10 (FaqBlock visible Q/A set ==
// FAQPage mainEntity set). Runs after prerender.mjs writes per-route HTML.
// Throws with route + diff on parity break. No jsdom — regex extraction per
// scripts/llms.mjs / scripts/sitemap.mjs convention.
//
// Build chain: ... node scripts/prerender.mjs && node scripts/sitemap.mjs &&
//              node scripts/llms.mjs && node scripts/verify-faq-mainentity.mjs

import { readFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const MANIFEST_BUNDLE = resolve(ROOT, ".ssr-meta", "seo-routes.js");

const { routes } = await import(pathToFileURL(MANIFEST_BUNDLE).href);

// Phase 4 D-08 / V-10: after Phase 4 the expected FAQPage routes are exactly 4
// (landing RU + EN, gpt-image-2 guide RU + EN). Floor check mirrors llms.mjs.
const faqRoutes = routes.filter(
  (r) =>
    r.prerender !== "none" &&
    Array.isArray(r.schema) &&
    r.schema.some((b) => b["@type"] === "FAQPage"),
);

if (faqRoutes.length < 4) {
  throw new Error(
    `verify-faq-mainentity.mjs: expected at least 4 FAQPage routes (landing RU + EN, guide RU + EN per Phase 4 D-08), got ${faqRoutes.length}. Manifest or routes drifted?`,
  );
}

// Decode the set of HTML entities React's SSR can emit inside <dt> text:
// named (&amp; &quot; &#39; &lt; &gt; &nbsp;), numeric decimal (&#39; → '),
// numeric hex (&#x27; → ' — React 18 SSR uses this form for apostrophes inside
// attribute-safe contexts). JSON-LD payload doesn't need this — JSON.parse
// natively decodes the unicode escapes < / > / & written by
// prerender.mjs's escapeJsonLd.
function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => {
      const num = Number(n);
      if (!Number.isFinite(num) || num < 0 || num > 0x10ffff) return "";
      try {
        return String.fromCodePoint(num);
      } catch {
        return "";
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, h) => {
      const num = parseInt(h, 16);
      if (!Number.isFinite(num) || num < 0 || num > 0x10ffff) return "";
      try {
        return String.fromCodePoint(num);
      } catch {
        return "";
      }
    });
}

function normalize(s) {
  // Decode entities BEFORE whitespace collapse so e.g. &nbsp; (U+00A0) is
  // converted to a regular space and then merged with adjacent whitespace.
  return decodeEntities(s).replace(/\s+/g, " ").trim();
}

function extractSchemaQuestions(html, route) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const collected = [];
  for (const block of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(block[1]);
    } catch {
      continue;
    }
    if (parsed && parsed["@type"] === "FAQPage") {
      if (!Array.isArray(parsed.mainEntity)) {
        throw new Error(
          `verify-faq-mainentity.mjs: route ${route} — FAQPage block found but mainEntity is not an array`,
        );
      }
      for (const q of parsed.mainEntity) {
        if (!q || typeof q.name !== "string") {
          throw new Error(
            `verify-faq-mainentity.mjs: route ${route} — mainEntity entry missing string "name": ${JSON.stringify(q).slice(0, 120)}`,
          );
        }
        collected.push(normalize(q.name));
      }
    }
  }
  return collected;
}

function extractVisibleQuestions(html, route) {
  // FaqBlock renders `<section id="X" aria-labelledby="X-heading">` where X is
  // the `id` prop passed by the caller. Landing pages use `id="faq"`;
  // GuidePage uses `id="guide-faq"` (see src/app/pages/GuidePage.tsx). Match
  // any section whose id contains "faq" so the verifier doesn't have to be
  // updated each time a new FaqBlock caller picks a different id.
  const sectionMatch = html.match(/<section[^>]*id="[^"]*faq[^"]*"[\s\S]*?<\/section>/i);
  if (!sectionMatch) {
    throw new Error(
      `verify-faq-mainentity.mjs: route ${route} — no <section id="...faq..."> found in HTML; FaqBlock missing or section id was renamed?`,
    );
  }
  const dts = [...sectionMatch[0].matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>/g)];
  if (dts.length === 0) {
    throw new Error(
      `verify-faq-mainentity.mjs: route ${route} — FAQ <section> found but contains zero <dt> elements`,
    );
  }
  return dts.map((m) => normalize(m[1]));
}

function diffSets(visible, schema) {
  const visSet = new Set(visible);
  const schSet = new Set(schema);
  const visibleOnly = [...visSet].filter((q) => !schSet.has(q));
  const schemaOnly = [...schSet].filter((q) => !visSet.has(q));
  const sameSize = visSet.size === schSet.size;
  const sameContents = visibleOnly.length === 0 && schemaOnly.length === 0;
  return { equal: sameSize && sameContents, visibleOnly, schemaOnly };
}

async function checkRoute(meta) {
  // Phase 04.1 WR-06 mirror: input-edge rejection. meta.path is SSR-bundled,
  // but defense-in-depth never hurts.
  if (meta.path.includes("..") || meta.path.includes("\\")) {
    throw new Error(
      `verify-faq-mainentity.mjs: refusing suspicious meta.path "${meta.path}" (contains '..' or backslash)`,
    );
  }

  const outPath =
    meta.path === "/"
      ? resolve(DIST, "index.html")
      : meta.path === "/en/"
        ? resolve(DIST, "en", "index.html")
        : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");

  if (outPath !== resolve(DIST, "index.html") && !outPath.startsWith(DIST + sep)) {
    throw new Error(
      `verify-faq-mainentity.mjs: outPath "${outPath}" escapes DIST "${DIST}" for meta.path "${meta.path}"`,
    );
  }

  let html;
  try {
    html = await readFile(outPath, "utf-8");
  } catch {
    throw new Error(
      `verify-faq-mainentity.mjs: missing emitted HTML for ${meta.path} at ${outPath}. Did prerender.mjs run first?`,
    );
  }

  const schemaQs = extractSchemaQuestions(html, meta.path);
  if (schemaQs.length === 0) {
    throw new Error(
      `verify-faq-mainentity.mjs: route ${meta.path} — manifest declares FAQPage but no FAQPage mainEntity questions found in emitted HTML`,
    );
  }

  const visibleQs = extractVisibleQuestions(html, meta.path);

  const { equal, visibleOnly, schemaOnly } = diffSets(visibleQs, schemaQs);
  if (!equal) {
    const visBlock = visibleOnly.length
      ? visibleOnly.map((q) => "    - " + q).join("\n")
      : "    (none)";
    const schBlock = schemaOnly.length
      ? schemaOnly.map((q) => "    - " + q).join("\n")
      : "    (none)";
    throw new Error(
      `verify-faq-mainentity.mjs: route ${meta.path} — FAQ drift detected. visible ↔ schema parity broken.\n  Visible-only questions (in <dt> but not in JSON-LD mainEntity):\n${visBlock}\n  Schema-only questions (in JSON-LD mainEntity but not in <dt>):\n${schBlock}\n  Hint: both sides should derive from the same source array (e.g. src/content/landingFaq.ts). Check the schema input in scripts/seo-routes.ts.`,
    );
  }

  return visibleQs.length;
}

let totalQs = 0;
for (const meta of faqRoutes) {
  totalQs += await checkRoute(meta);
}

console.log(
  `✓ verify-faq-mainentity: ${faqRoutes.length} routes checked, ${totalQs} questions, all visible↔schema parity holds`,
);
