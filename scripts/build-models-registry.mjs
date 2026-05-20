#!/usr/bin/env node
// Phase v2.0 MODELS-A-3: parse src/content/models/_skills/*.md → write _registry.ts
//
// Reads the "## Идентификация" block and "## Ограничения платформы" table from
// each skill MD, normalizes the values, and emits a TS file with a typed array
// of ModelMeta. Run after sync-skills.mjs whenever skills change upstream.
//
// NOTE: name/platform/duration/resolution are parsed VERBATIM from the RU skill
// MDs, so they come out in Russian. The /en/* pages get English via the
// hand-maintained src/content/models/metaEn.ts overrides — this generator never
// touches that file (regen-safe). When a new model lands or its RU meta
// changes, add/refresh its metaEn.ts entry; scripts/verify-models-content.mjs
// fails the build if any EN-resolved meta field still contains Cyrillic.
//
// Usage:  node scripts/build-models-registry.mjs
//
// Source:  src/content/models/_skills/*.md
// Target:  src/content/models/_registry.ts

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SKILLS_DIR = join(ROOT, "src/content/models/_skills");
const REGISTRY_FILE = join(ROOT, "src/content/models/_registry.ts");

const TODAY = new Date().toISOString().slice(0, 10);

// --- field extractors ---

function extractIdentificationBlock(md) {
  const m = md.match(/##\s*Идентификация\s*([\s\S]*?)(?=\n##\s|\n---|$)/);
  return m ? m[1] : "";
}

function extractLimitsTable(md) {
  const m = md.match(/##\s*Ограничения платформы\s*([\s\S]*?)(?=\n##\s|\n---|$)/);
  return m ? m[1] : "";
}

function pickField(block, fieldName) {
  // matches: - **field_name:** value
  const re = new RegExp(
    `[-*]\\s*\\*\\*${fieldName}\\s*:?\\*\\*\\s*([^\\n]+)`,
    "i"
  );
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function parseTableRows(table) {
  // returns array of [key, value] pairs from a markdown table
  const rows = [];
  for (const line of table.split("\n")) {
    const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    // skip header/separator rows
    if (/^-+$/.test(cells[0])) continue;
    if (cells[0].toLowerCase() === "параметр") continue;
    rows.push([cells[0], cells.slice(1).join(" | ")]);
  }
  return rows;
}

function normalizeKey(key) {
  return key.toLowerCase().replace(/[^a-zа-я0-9]/gi, " ").replace(/\s+/g, " ").trim();
}

function findRow(rows, ...patterns) {
  for (const [key, value] of rows) {
    const norm = normalizeKey(key);
    for (const pat of patterns) {
      if (norm.includes(pat)) return value;
    }
  }
  return null;
}

// --- field normalizers ---

function normalizeType(raw) {
  if (!raw) return "image";
  const s = raw.toLowerCase();
  if (s.includes("video")) return "video";
  if (s.includes("image")) return "image";
  return "image";
}

function normalizeBestLanguage(raw) {
  if (!raw) return "en";
  const s = raw.toLowerCase();
  if (s.startsWith("english") || s.includes(" en)") || s.includes("(en")) return "en";
  if (s.startsWith("russian") || s.startsWith("русск")) return "ru";
  if (s.includes("both") || s.includes("любой") || s.includes("both")) return "both";
  return "en";
}

function extractVendorAndUrl(platformStr, modelName) {
  // platform examples:
  //   "Kling AI (klingai.com) by Kuaishou"
  //   "midjourney.com / Discord"
  //   "OpenAI (ChatGPT, API), fal.ai"
  //   "Replicate, Segmind, ComfyUI, fal.ai, BFL API и др."
  let vendor = null;
  let platformUrl = null;

  // vendor via "by X"
  const byMatch = platformStr.match(/\bby\s+([A-Z][A-Za-z0-9 .&-]+?)(?:[,.;)]|$)/);
  if (byMatch) vendor = byMatch[1].trim();

  // domain via (foo.com) or first bare domain
  const parenDomain = platformStr.match(/\(([a-z0-9-]+\.[a-z]{2,}(?:\.[a-z]{2,})?)\)/i);
  const bareDomain = platformStr.match(/\b([a-z0-9-]+\.(?:com|ai|art|io|co|me)(?:\.[a-z]{2,})?)\b/i);
  const domain = parenDomain ? parenDomain[1] : bareDomain ? bareDomain[1] : null;
  if (domain) platformUrl = "https://" + domain.toLowerCase();

  // fallback vendor: first word of platform, or first word of model name
  if (!vendor) {
    const firstWord = platformStr.split(/[\s(,/]/)[0];
    if (firstWord && /^[A-Z]/.test(firstWord)) vendor = firstWord;
  }
  if (!vendor && modelName) {
    vendor = modelName.split(" ")[0];
  }

  return { vendor: vendor || "Unknown", platformUrl: platformUrl || "" };
}

function parsePromptLength(raw) {
  if (!raw) return null;
  // examples: "50–150 слов", "оптимально 50–200 слов", "~6000 символов", "До 200 слов"
  // we want word counts, not char counts
  const rangeMatch = raw.match(/(\d+)[–\-—](\d+)\s*слов/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
  }
  // "До 200 слов" → 0 to 200
  const upToWords = raw.match(/до\s+(\d+)\s*слов/i);
  if (upToWords) return { min: 0, max: parseInt(upToWords[1], 10) };
  // "оптимально 50 слов"
  const singleWords = raw.match(/(\d+)\s*слов/);
  if (singleWords) {
    const v = parseInt(singleWords[1], 10);
    return { min: Math.max(0, v - 20), max: v + 50 };
  }
  return null;
}

function parseNegativePrompt(rows, md) {
  // Check table first
  const tableVal = findRow(rows, "негатив", "negative");
  if (tableVal) {
    const s = tableVal.toLowerCase();
    if (s.includes("да") || s.includes("yes") || s.includes("поддерж") || s.includes("support")) return true;
    if (s.includes("нет") || s.includes("no") || s.includes("не поддерж")) return false;
  }
  // Fallback: search md body for mentions
  if (/негативн[а-я]+\s+промпт/i.test(md) && !/не поддержив/i.test(md)) {
    return true;
  }
  return null;
}

function parseFeatures(rows, md) {
  const features = new Set();
  const modes = findRow(rows, "режим");
  if (modes) {
    // split by comma, dot, or " и "
    for (const part of modes.split(/[,;.]|\s+и\s+/i)) {
      const p = part.trim();
      // strip parenthetical, take first 30 chars
      const cleaned = p.replace(/\(.*?\)/g, "").trim();
      if (cleaned && cleaned.length < 50 && !/^\d/.test(cleaned)) {
        features.add(cleaned);
      }
    }
  }
  return Array.from(features).slice(0, 6);
}

// --- main parse ---

function parseSkill(filename, md) {
  const idBlock = extractIdentificationBlock(md);
  const limitsTable = extractLimitsTable(md);
  const rows = parseTableRows(limitsTable);

  const slug = (pickField(idBlock, "model_id") || filename.replace(/\.md$/, "")).trim();
  const name = (pickField(idBlock, "model_name") || slug).trim();
  const type = normalizeType(pickField(idBlock, "type"));
  const platformRaw = (pickField(idBlock, "platform") || "").trim();
  const bestLanguage = normalizeBestLanguage(pickField(idBlock, "best_language"));

  const { vendor, platformUrl } = extractVendorAndUrl(platformRaw, name);

  const promptLength = parsePromptLength(
    findRow(rows, "длин", "length", "длина промпта")
  );
  const duration = type === "video" ? findRow(rows, "длительност", "duration") : null;
  const resolution = findRow(rows, "разрешен", "resolution");
  const negativePrompt = parseNegativePrompt(rows, md);
  const features = parseFeatures(rows, md);

  return {
    slug,
    name,
    type,
    vendor,
    platform: platformRaw,
    platformUrl,
    bestLanguage,
    promptLength,
    features,
    duration: duration ? truncate(duration, 80) : null,
    resolution: resolution ? truncate(resolution, 80) : null,
    negativePrompt,
    publishedAt: TODAY,
    updatedAt: TODAY,
  };
}

function truncate(s, max) {
  if (!s) return s;
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

function tsLiteral(value, indent = 2) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value.toString();
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") {
    return '"' + value.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return "[" + value.map((v) => tsLiteral(v, indent)).join(", ") + "]";
  }
  if (typeof value === "object") {
    const pad = " ".repeat(indent);
    const innerPad = " ".repeat(indent + 2);
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const lines = entries.map(
      ([k, v]) => `${innerPad}${k}: ${tsLiteral(v, indent + 2)}`
    );
    return `{\n${lines.join(",\n")},\n${pad}}`;
  }
  return "null";
}

async function main() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name)
    .sort();

  if (files.length === 0) {
    console.error("✗ No skill MDs found. Run sync-skills.mjs first.");
    process.exit(1);
  }

  const models = [];
  for (const file of files) {
    const md = await readFile(join(SKILLS_DIR, file), "utf8");
    try {
      models.push(parseSkill(file, md));
    } catch (err) {
      console.error(`✗ Failed to parse ${file}:`, err.message);
      process.exit(1);
    }
  }

  models.sort((a, b) => a.slug.localeCompare(b.slug));

  const header = `// AUTO-GENERATED by scripts/build-models-registry.mjs — do not edit by hand.
// Source: src/content/models/_skills/*.md (synced from C:/Projects/promptscore-proxy/skills).
// Rerun \`node scripts/build-models-registry.mjs\` to refresh after upstream changes.
//
// Phase v2.0 MODELS-A-3.

import type { ModelMeta } from "./types";

export const MODELS_REGISTRY: ModelMeta[] = [
`;
  const body = models
    .map((m) => "  " + tsLiteral(m, 2) + ",")
    .join("\n");
  const footer = "\n];\n";

  await writeFile(REGISTRY_FILE, header + body + footer, "utf8");

  console.log(`✓ Wrote ${models.length} models → ${REGISTRY_FILE}`);
  const videos = models.filter((m) => m.type === "video").length;
  const images = models.filter((m) => m.type === "image").length;
  console.log(`  Image: ${images}  Video: ${videos}`);
}

main().catch((err) => {
  console.error("✗ build-models-registry failed:", err);
  process.exit(1);
});
