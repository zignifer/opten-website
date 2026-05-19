#!/usr/bin/env node
// Phase v2.0 MODELS-A-2: sync model skill MDs from promptscore-proxy into this repo.
// Idempotent. Run manually (not in prebuild) — Vercel builds use the git-tracked
// files in src/content/models/_skills/.
//
// Usage:  node scripts/sync-skills.mjs
//
// Source:  C:/Projects/promptscore-proxy/skills/*.md   (62 model files + 2 fallback)
// Target:  src/content/models/_skills/*.md             (62 files; _default-* excluded)

import { readdir, copyFile, mkdir, stat } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SOURCE_DIR = "C:/Projects/promptscore-proxy/skills";
const TARGET_DIR = join(ROOT, "src/content/models/_skills");

async function main() {
  let sourceExists = false;
  try {
    await stat(SOURCE_DIR);
    sourceExists = true;
  } catch {
    // ignore
  }
  if (!sourceExists) {
    console.error(`✗ Source not found: ${SOURCE_DIR}`);
    console.error("  This script syncs skill MDs from a sibling repo. Make sure");
    console.error("  C:/Projects/promptscore-proxy is cloned and skills/ has MD files.");
    process.exit(1);
  }

  await mkdir(TARGET_DIR, { recursive: true });

  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("_"))
    .map((e) => e.name);

  if (mdFiles.length === 0) {
    console.error(`✗ No model MD files found in ${SOURCE_DIR}`);
    process.exit(1);
  }

  let copied = 0;
  for (const filename of mdFiles) {
    const src = join(SOURCE_DIR, filename);
    const dst = join(TARGET_DIR, filename);
    await copyFile(src, dst);
    copied += 1;
  }

  console.log(`✓ Synced ${copied} model skill MDs → ${TARGET_DIR}`);
  console.log(`  (excluded fallbacks: _default-image.md, _default-video.md)`);
}

main().catch((err) => {
  console.error("✗ sync-skills failed:", err);
  process.exit(1);
});
