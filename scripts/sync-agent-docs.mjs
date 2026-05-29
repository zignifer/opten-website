import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(rootDir, "AGENTS.md");
const targetPath = path.join(rootDir, "CLAUDE.md");

const source = await readFile(sourcePath, "utf8");
await writeFile(targetPath, source.endsWith("\n") ? source : `${source}\n`, "utf8");

console.log("Synced CLAUDE.md from AGENTS.md");
