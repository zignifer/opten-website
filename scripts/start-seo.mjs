// Start SEO2 article workflow.
//
// This command does not generate an article by itself. It validates the active
// SEO2 brief queue, selects the next topic by the documented ordering, and
// prints an explicit start/no-topics result for the agent/user.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BRIEFS_DIR = resolve(ROOT, "seo2", "briefs");
const BLOG_DIR = resolve(ROOT, "src", "content", "blog");
const BLOG_INDEX = resolve(BLOG_DIR, "index.ts");
const VERIFY_BRIEFS = resolve(ROOT, "scripts", "verify-seo2-briefs.mjs");

const STATUS_ORDER = ["pending", "deferred", "ready"];

function runBriefGate() {
  const result = spawnSync(process.execPath, [VERIFY_BRIEFS], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    console.error("\nstart-seo: blocked because SEO2 brief gate failed.");
    process.exit(result.status ?? 1);
  }
}

function publishedSlugs() {
  const slugs = new Set();
  if (existsSync(BLOG_INDEX)) {
    const text = readFileSync(BLOG_INDEX, "utf8");
    for (const match of text.matchAll(/"([a-z0-9-]+)"\s*:/g)) slugs.add(match[1]);
  }
  if (existsSync(BLOG_DIR)) {
    for (const name of readdirSync(BLOG_DIR)) {
      if (/^[a-z0-9-]+\.ts$/.test(name) && name !== "index.ts" && name !== "types.ts") {
        slugs.add(name.replace(/\.ts$/, ""));
      }
    }
  }
  return slugs;
}

function parseBatchRows(batchText) {
  const lines = batchText.split(/\r?\n/).filter((line) => /^\|\s*\d+\s*\|/.test(line));
  return lines
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim());

      // Supported formats:
      // | # | status | slug | cluster | primary keyword | max volume | brief |
      // | # | slug | cluster | primary keyword | max volume | brief |
      const hasStatus = cells[2] && !/^`/.test(cells[2]);
      const status = hasStatus ? cells[2] : "pending";
      const slugCell = hasStatus ? cells[3] : cells[2];
      const briefCell = hasStatus ? cells[7] : cells[6];
      const slug = slugCell?.match(/`([^`]+)`/)?.[1] ?? "";
      const href = briefCell?.match(/\(([^)]+\.md)\)/)?.[1] ?? "";

      return { status, slug, href };
    })
    .filter((row) => row.slug && row.href);
}

function findNextTopic() {
  const published = publishedSlugs();
  const weeks = existsSync(BRIEFS_DIR)
    ? readdirSync(BRIEFS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\d{4}-W\d{2}$/.test(entry.name))
      .map((entry) => entry.name)
      .sort()
    : [];

  for (const week of weeks) {
    const batchPath = join(BRIEFS_DIR, week, "_batch.md");
    if (!existsSync(batchPath)) continue;
    const rows = parseBatchRows(readFileSync(batchPath, "utf8"));

    for (const wantedStatus of STATUS_ORDER) {
      const row = rows.find((candidate) =>
        candidate.status === wantedStatus && !published.has(candidate.slug)
      );
      if (!row) continue;
      return {
        week,
        status: row.status,
        slug: row.slug,
        brief: join("seo2", "briefs", week, row.href).replace(/\\/g, "/"),
      };
    }
  }

  return null;
}

runBriefGate();

const topic = findNextTopic();

if (!topic) {
  console.log("start-seo: no-topics");
  console.log("");
  console.log("All active SEO2 queue rows are already published or already present in src/content/blog.");
  console.log("Generate a new weekly batch in C:\\Projects\\opten-seo, copy it into seo2/briefs/YYYY-Www, then rerun npm run start:seo.");
  console.log("");
  console.log("Suggested next source command:");
  console.log("  cd C:\\Projects\\opten-seo\\scripts");
  console.log("  npm run briefs:weekly");
  process.exit(0);
}

console.log("start-seo: next-topic");
console.log(`week: ${topic.week}`);
console.log(`status: ${topic.status}`);
console.log(`slug: ${topic.slug}`);
console.log(`brief: ${topic.brief}`);
console.log("");
console.log("Codex task:");
console.log(`  Используй seo2/blog-post-instruction.md. Создай следующий SEO2 блог-пост для slug ${topic.slug} из ${topic.brief}.`);
