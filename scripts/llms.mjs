// Phase 4 D-11: postbuild emitter for llms.txt + llms-full.txt. Sibling of sitemap.mjs.
// Generates two files into dist/:
//   - llms.txt       — markdown table-of-contents of every prerendered marketing route, grouped by section.
//   - llms-full.txt  — concatenated body text extracted from dist/<route>/index.html (regex strip, no jsdom).
// Build chain order: must run AFTER scripts/sitemap.mjs (which runs after scripts/prerender.mjs).

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const MANIFEST_BUNDLE = resolve(ROOT, ".ssr-meta", "seo-routes.js");

const { routes } = await import(pathToFileURL(MANIFEST_BUNDLE).href);

const prerenderedRoutes = routes.filter((r) => r.prerender !== "none");

// Floor check: after Phase 4 expected count is 15 (12 baseline + /about per 04-05 + 2 guide siblings per 04-06).
if (prerenderedRoutes.length < 15) {
  throw new Error(
    `llms.mjs: expected at least 15 prerendered routes (12 baseline + /about (04-05) + 2 guide siblings (04-06)), got ${prerenderedRoutes.length}. Manifest mis-loaded or routes missing?`,
  );
}

const SUMMARY =
  "Opten — AI prompt scorer Chrome extension that evaluates and improves prompts for 43+ image-generation models (Midjourney, GPT Image 2, Kling, Sora, Nano Banana, etc.). This site sells, services, and onboards extension users.";

// Section grouping — routes that don't match any rule below are bucketed as Other.
const SECTIONS = [
  { name: "Marketing", match: (p) => p === "/" || p === "/en/" },
  { name: "Pricing", match: (p) => p === "/pay" || p === "/en/pay" },
  { name: "Welcome", match: (p) => p === "/welcome" || p === "/en/welcome" },
  { name: "About", match: (p) => p === "/about" },
  { name: "Guides", match: (p) => /^\/(en\/)?guides\//.test(p) },
  {
    name: "Legal",
    match: (p) => /^\/(en\/)?(privacy|terms|refund)$/.test(p),
  },
];

function sectionOf(path) {
  const found = SECTIONS.find((s) => s.match(path));
  return found ? found.name : "Other";
}

const grouped = new Map();
for (const sec of SECTIONS) grouped.set(sec.name, []);
grouped.set("Other", []);
for (const r of prerenderedRoutes) {
  grouped.get(sectionOf(r.path)).push(r);
}

// Build llms.txt body.
let llmsTxt = `# Opten\n\n> ${SUMMARY}\n`;
for (const [name, items] of grouped) {
  if (items.length === 0) continue;
  llmsTxt += `\n## ${name}\n`;
  for (const r of items) {
    llmsTxt += `- [${r.title}](${r.canonical})\n`;
  }
}

// Build llms-full.txt — extract text body from each prerendered file.
// Strip <script> and <style> blocks ENTIRELY before stripping tags so JSON-LD payloads
// (which sit in <script type="application/ld+json">) don't leak into the plaintext output.
function extractText(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function bodyForRoute(meta) {
  const outPath =
    meta.path === "/"
      ? resolve(DIST, "index.html")
      : meta.path === "/en/"
        ? resolve(DIST, "en", "index.html")
        : resolve(DIST, meta.path.replace(/^\//, ""), "index.html");
  let html;
  try {
    html = await readFile(outPath, "utf-8");
  } catch {
    return null;
  }
  const text = extractText(html);
  return `# ${meta.title}\nURL: ${meta.canonical}\n\n${text}`;
}

const allBodies = (await Promise.all(prerenderedRoutes.map(bodyForRoute))).filter(Boolean);
let llmsFullTxt = allBodies.join("\n\n---\n\n");

// Size cap: if > 50 KB, drop legal section bodies and re-join.
const SIZE_CAP_BYTES = 50_000;
let truncated = false;
if (Buffer.byteLength(llmsFullTxt, "utf-8") > SIZE_CAP_BYTES) {
  const kept = await Promise.all(
    prerenderedRoutes
      .filter((r) => sectionOf(r.path) !== "Legal")
      .map(bodyForRoute),
  );
  const note =
    "# Opten (truncated)\n\n# Note: legal pages (privacy, terms, refund) omitted from llms-full.txt to keep the file under 50 KB. Full legal copy is available at the URLs listed in llms.txt.\n\n";
  llmsFullTxt = note + kept.filter(Boolean).join("\n\n---\n\n");
  truncated = true;
}

await writeFile(resolve(DIST, "llms.txt"), llmsTxt, "utf-8");
await writeFile(resolve(DIST, "llms-full.txt"), llmsFullTxt, "utf-8");

console.log(
  `✓ llms.txt → ${prerenderedRoutes.length} routes, ${(llmsTxt.length / 1024).toFixed(1)} KB`,
);
console.log(
  `✓ llms-full.txt → ${(llmsFullTxt.length / 1024).toFixed(1)} KB${truncated ? " (legal truncated)" : ""}`,
);
