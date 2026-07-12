#!/usr/bin/env node
// Sync the extension-owned quick-Improve rewriter instruction into this repo's
// server-only Vercel bundle. The copies are committed because Vercel cannot
// read sibling repositories during a production build.

import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SOURCE_DIR = "C:/Projects/promptscore/config";
const TARGET_DIR = join(ROOT, "api", "_assets", "prompt-workbench");
const FILES = ["rewriter.md"];

async function main() {
  try {
    await stat(SOURCE_DIR);
  } catch {
    console.error(`Source not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  await mkdir(TARGET_DIR, { recursive: true });
  for (const filename of FILES) {
    await copyFile(join(SOURCE_DIR, filename), join(TARGET_DIR, filename));
  }

  console.log(`Synced ${FILES.join(", ")} -> ${TARGET_DIR}`);
}

main().catch((error) => {
  console.error("sync:prompt-workbench failed", error);
  process.exit(1);
});
