#!/usr/bin/env node
// Build gate for the self-hosted fonts. The actual subsetting is a local-only
// step (scripts/subset-fonts.py, needs Python/fontTools); this Node gate runs in
// the Vercel build and fails loudly on the regressions that matter:
//   - a font file went missing, got truncated, or was restored to its full
//     (un-subset) size — which would silently re-bloat the LCP critical path;
//   - the @font-face weight range or the Unbounded preload was dropped.
// Glyph-coverage correctness is asserted at subset time by subset-fonts.py.

import { readFile, stat } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Per-font size window (bytes). Floor guards against truncation/empty; ceiling
// is below each font's UN-subset size so a stale/restored full font fails:
//   Unbounded full ~254 KB -> ceiling 120 KB (subset ~79 KB)
//   PT Root  full  ~91 KB  -> ceiling  80 KB (subset ~64 KB)
const FONTS = [
  { file: "public/fonts/Unbounded-VF.woff2", minKB: 20, maxKB: 120 },
  { file: "public/fonts/PT-Root-UI_VF.woff2", minKB: 20, maxKB: 80 },
];

const errors = [];

for (const { file, minKB, maxKB } of FONTS) {
  const path = join(ROOT, file);
  let size;
  try {
    size = (await stat(path)).size;
  } catch {
    errors.push(`${file}: missing`);
    continue;
  }
  const kb = size / 1024;
  if (kb < minKB) errors.push(`${file}: ${kb.toFixed(1)} KB < floor ${minKB} KB (truncated?)`);
  if (kb > maxKB) errors.push(`${file}: ${kb.toFixed(1)} KB > ceiling ${maxKB} KB (un-subset font committed?)`);
  // woff2 magic: "wOF2"
  const head = Buffer.alloc(4);
  const { open } = await import("node:fs/promises");
  const fh = await open(path, "r");
  await fh.read(head, 0, 4, 0);
  await fh.close();
  if (head.toString("latin1") !== "wOF2") errors.push(`${file}: not a woff2 file (bad magic)`);
}

const css = await readFile(join(ROOT, "src/styles/fonts.css"), "utf8");
const weightDecls = (css.match(/font-weight:\s*400 700;/g) || []).length;
if (weightDecls < 2) {
  errors.push(`src/styles/fonts.css: expected 2 "font-weight: 400 700" declarations (subset axis), found ${weightDecls}`);
}

const indexHtml = await readFile(join(ROOT, "index.html"), "utf8");
if (!/<link rel="preload"[^>]*\/fonts\/Unbounded-VF\.woff2[^>]*as="font"/.test(indexHtml)) {
  errors.push(`index.html: missing Unbounded preload (LCP font) — regression`);
}

if (errors.length) {
  console.error("✗ verify-fonts failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ verify-fonts: subset fonts present, sized, weight axis + preload intact");
