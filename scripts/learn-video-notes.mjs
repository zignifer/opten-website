#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const DEFAULT_ENV_PATH = resolve(ROOT, ".secrets", "learn-video.env");

const TIMESTAMP_PROMPT = [
  "Составь 8-10 важных тайм-кодов для этого YouTube-урока.",
  "Ответь только JSON-массивом без markdown.",
  'Формат каждого элемента: {"time":"MM:SS","seconds":number,"title":"короткий заголовок на русском","description":"1 короткое предложение о том, что происходит в этом фрагменте"}.',
  "Тайм-коды должны идти по порядку и отражать реальные смысловые блоки видео.",
].join(" ");

function parseEnv(raw) {
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    out[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim();
  }
  return out;
}

function readConfig() {
  const envPath = process.env.LEARN_VIDEO_ENV_PATH ? resolve(ROOT, process.env.LEARN_VIDEO_ENV_PATH) : DEFAULT_ENV_PATH;
  const fileEnv = existsSync(envPath) ? parseEnv(readFileSync(envPath, "utf8")) : {};
  const notebookId = process.env.NOTEBOOKLM_NOTEBOOK_ID || fileEnv.NOTEBOOKLM_NOTEBOOK_ID;
  if (!notebookId) throw new Error(`Missing NOTEBOOKLM_NOTEBOOK_ID; expected it in ${envPath}`);
  return { envPath, notebookId };
}

function runNotebookLm(args, { timeout = 180_000 } = {}) {
  const result = spawnSync("notebooklm", args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout,
    env: {
      ...process.env,
      PYTHONIOENCODING: "utf-8",
      NO_COLOR: "1",
      TERM: "dumb",
    },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `notebooklm exited with ${result.status}`).trim());
  }
  return result.stdout.trim();
}

function parseJsonObject(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1));
    throw new Error(`NotebookLM did not return JSON object: ${raw.slice(0, 240)}`);
  }
}

function parseTimestampArray(raw) {
  const answerStart = raw.indexOf("[");
  const answerEnd = raw.lastIndexOf("]");
  if (answerStart < 0 || answerEnd <= answerStart) {
    throw new Error(`NotebookLM did not return a JSON timestamp array: ${raw.slice(0, 320)}`);
  }

  const parsed = JSON.parse(raw.slice(answerStart, answerEnd + 1));
  if (!Array.isArray(parsed)) throw new Error("NotebookLM timestamp response is not an array");
  return parsed.map((item, index) => {
    const seconds = Number(item.seconds);
    if (!item.time || !Number.isFinite(seconds) || !item.title) {
      throw new Error(`Invalid timestamp item at index ${index}`);
    }
    return {
      time: String(item.time),
      seconds,
      title: String(item.title),
      description: String(item.description || ""),
    };
  });
}

function printUsage() {
  console.log(
    [
      "Usage:",
      "  node scripts/learn-video-notes.mjs <youtube-url>",
      "  node scripts/learn-video-notes.mjs --source-id <notebooklm-source-id>",
      "",
      "Env:",
      "  NOTEBOOKLM_NOTEBOOK_ID in .secrets/learn-video.env or process env.",
    ].join("\n"),
  );
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    printUsage();
    return;
  }

  const sourceIdFlag = args.indexOf("--source-id");
  const sourceIdFromArgs = sourceIdFlag >= 0 ? args[sourceIdFlag + 1] : "";
  const youtubeUrl = args.find((arg, index) => !arg.startsWith("-") && index !== sourceIdFlag + 1);

  if (!youtubeUrl && !sourceIdFromArgs) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const { notebookId } = readConfig();
  let sourceId = sourceIdFromArgs;

  if (!sourceId) {
    const addRaw = runNotebookLm(["source", "add", youtubeUrl, "--notebook", notebookId, "--type", "youtube", "--json"], {
      timeout: 180_000,
    });
    const addJson = parseJsonObject(addRaw);
    sourceId = addJson.source?.id || addJson.source_id || addJson.id;
    if (!sourceId) throw new Error(`NotebookLM source add response did not include source id: ${addRaw.slice(0, 320)}`);
    runNotebookLm(["source", "wait", sourceId, "--notebook", notebookId, "--timeout", "300"], { timeout: 360_000 });
  }

  const askRaw = runNotebookLm(["ask", TIMESTAMP_PROMPT, "--notebook", notebookId, "-s", sourceId, "--json"], {
    timeout: 240_000,
  });
  const askJson = parseJsonObject(askRaw);
  const timestamps = parseTimestampArray(askJson.answer || askRaw);
  console.log(JSON.stringify(timestamps, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
