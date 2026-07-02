// SEO2 brief gate.
//
// Active weekly queue rows (pending/deferred/ready) must point to article briefs
// that already contain a concrete Visual Production Brief. This prevents agents
// from starting image generation from legacy "Image Suggestions" hints.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BRIEFS_DIR = resolve(ROOT, "seo2", "briefs");
const ACTIVE_STATUSES = new Set(["pending", "deferred", "ready"]);

let failureCount = 0;
let checkedCount = 0;

function fail(message) {
  console.error(`✗ ${message}`);
  failureCount += 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function parseFrontMatter(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m"));
  return match?.[1]?.trim() ?? "";
}

function parseBatchRows(batchText) {
  return batchText
    .split(/\r?\n/)
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim());
      const status = cells[2] ?? "";
      const slug = cells[3]?.match(/`([^`]+)`/)?.[1] ?? "";
      const href = cells[7]?.match(/\(([^)]+\.md)\)/)?.[1] ?? "";
      return { status, slug, href };
    })
    .filter((row) => row.slug && row.href);
}

function requirePattern(text, pattern, label, fileLabel) {
  if (pattern.test(text)) return true;
  fail(`${fileLabel}: missing ${label}`);
  return false;
}

function verifyBrief(week, row) {
  if (!ACTIVE_STATUSES.has(row.status)) return;

  checkedCount += 1;
  let ok = true;
  const filePath = resolve(BRIEFS_DIR, week, row.href);
  const fileLabel = `${week}/${row.href}`;

  if (!existsSync(filePath)) {
    fail(`${fileLabel}: missing file for active slug ${row.slug}`);
    return;
  }

  const text = readFileSync(filePath, "utf8");
  const frontSlug = parseFrontMatter(text, "slug");
  if (frontSlug !== row.slug) {
    fail(`${fileLabel}: frontmatter slug "${frontSlug}" does not match batch slug "${row.slug}"`);
    ok = false;
  }

  if (!/^## Visual Production Brief\b/m.test(text)) {
    fail(`${fileLabel}: active brief must contain ## Visual Production Brief`);
    return;
  }

  if (/^## Image Suggestions\b/m.test(text)) {
    fail(`${fileLabel}: legacy ## Image Suggestions must be replaced before article generation`);
    ok = false;
  }

  ok = requirePattern(text, /### Cover|### Cover Concept/i, "cover concept subsection", fileLabel) && ok;
  ok = requirePattern(text, /### Inline Frames/i, "inline frames subsection", fileLabel) && ok;
  ok = requirePattern(text, /### Information Layer/i, "information layer subsection", fileLabel) && ok;
  ok = requirePattern(text, /\bRU\b[\s\S]{0,80}\bEN\b/i, "paired RU/EN frame labels", fileLabel) && ok;
  ok = requirePattern(text, /Bebas Neue/i, "Bebas Neue typography rule", fileLabel) && ok;
  ok = requirePattern(text, /#9CFB51/i, "exact Opten lime #9CFB51", fileLabel) && ok;
  ok = requirePattern(text, /seo2[\\/]+Reference[\\/]+bebas-neue-font-reference\.png/i, "Bebas Neue font reference path", fileLabel) && ok;
  ok = requirePattern(text, /ai-headshot|ai-ugc/i, "W23/W26 strong visual reference assets", fileLabel) && ok;
  ok = requirePattern(text, /supporting labels?|micro-?labels?|micro-?cards?|мини-?подпис|подпис[ьи]/i, "supporting labels/micro-cards rule", fileLabel) && ok;
  ok = requirePattern(text, /3\s*[-–]\s*4|3\+|three|три|четыр/i, "3-4 supporting visual facts rule", fileLabel) && ok;
  ok = requirePattern(text, /checklist|scorecard|timeline|before\/after|matrix|flow|anatomy|decision tree|чек|таймлайн|до\/после|схем|карточ/i, "visual structure rule", fileLabel) && ok;
  ok = requirePattern(text, /title-only|заголов/i, "title-only image rejection rule", fileLabel) && ok;
  ok = requirePattern(text, /generated|сгенерирован/i, "generated-in-image text rule", fileLabel) && ok;
  ok = requirePattern(text, /overlay|overlays|накладыв|сло[йя]|постобработ/i, "no text overlay/post-processing rule", fileLabel) && ok;
  ok = requirePattern(text, /floating UI|floating panels|dashboard|connector|repeated|повтор/i, "batch motif/reuse ban", fileLabel) && ok;

  if (ok) pass(`${fileLabel}: visual brief ready`);
}

if (!existsSync(BRIEFS_DIR)) {
  fail(`missing SEO2 briefs directory ${BRIEFS_DIR}`);
} else {
  for (const entry of readdirSync(BRIEFS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d{4}-W\d{2}$/.test(entry.name)) continue;
    const batchPath = join(BRIEFS_DIR, entry.name, "_batch.md");
    if (!existsSync(batchPath)) continue;
    const rows = parseBatchRows(readFileSync(batchPath, "utf8"));
    for (const row of rows) verifyBrief(entry.name, row);
  }
}

if (failureCount > 0) {
  console.error(`\nSEO2 brief gate failed: ${failureCount} issue(s), ${checkedCount} active brief(s) checked.`);
  process.exit(1);
}

console.log(`\nSEO2 brief gate passed: ${checkedCount} active brief(s) checked.`);
