// Select exactly one topic from the single SEO topic registry.
// Research is deliberately manual and runs only when this command reports
// `research-needed`; it never generates an article by itself.

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = resolve(ROOT, "seo2", "topic-registry.json");
const VERIFY_REGISTRY = resolve(ROOT, "scripts", "verify-seo-topic-registry.mjs");

const gate = spawnSync(process.execPath, [VERIFY_REGISTRY], { cwd: ROOT, encoding: "utf8", stdio: "pipe" });
if (gate.status !== 0) {
  process.stdout.write(gate.stdout);
  process.stderr.write(gate.stderr);
  console.error("\nstart-seo: blocked because the topic registry gate failed.");
  process.exit(gate.status ?? 1);
}

if (!existsSync(REGISTRY_PATH)) throw new Error(`Missing ${REGISTRY_PATH}`);
const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
const ordered = [...registry.topics].sort((a, b) => a.queueOrder - b.queueOrder);
const topic = ordered.find((item) => item.status === "queued") ?? ordered.find((item) => item.status === "deferred");

if (!topic) {
  console.log("start-seo: research-needed");
  console.log("");
  console.log("No queued topics remain. Follow seo2/TOPIC-PIPELINE.md inside this repository,");
  console.log("append reviewed candidates to seo2/topic-registry.json, validate, and rerun npm run start:seo.");
  process.exit(0);
}

const primary = topic.keywords.filter((keyword) => keyword.role === "primary");
const secondary = topic.keywords.filter((keyword) => keyword.role === "secondary");
console.log("start-seo: next-topic");
console.log(`status: ${topic.status}`);
console.log(`queue-order: ${topic.queueOrder}`);
console.log(`slug: ${topic.slug}`);
console.log(`cluster: ${topic.clusterId}`);
console.log(`intent: ${topic.intentType}${topic.buyerStage ? ` / ${topic.buyerStage}` : ""}`);
console.log(`primary-destination: ${topic.primaryDestination}`);
console.log(`title-hint: ${topic.titleHint}`);
console.log(`primary-keywords: ${primary.map((item) => `[${item.language}] ${item.phrase}`).join(" | ")}`);
console.log(`secondary-keywords: ${secondary.map((item) => `[${item.language}] ${item.phrase}`).join(" | ")}`);
console.log("");
console.log("Codex task:");
console.log(`  Используй seo2/blog-post-instruction.md и запись ${topic.slug} из seo2/topic-registry.json. Создай ровно один SEO2 блог-пост и направь основной promo CTA на ${topic.primaryDestination}.`);
