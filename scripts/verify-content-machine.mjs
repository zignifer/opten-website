import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { validateContentMachineSnapshot } from "./content-machine-contract.mjs";

const root = process.cwd();
const target = path.join(root, "api", "admin", "_contentMachineSnapshot.ts");
assert.ok(existsSync(target), "Run sync:content-machine before building.");

const source = readFileSync(target, "utf8");
const match = source.match(/CONTENT_MACHINE_SNAPSHOT\s*=\s*([\s\S]+)\s+as const;\s*$/);
assert.ok(match, "Generated content-machine module has an invalid shape.");
const encoded = match[1];
const snapshot = JSON.parse(encoded);
const { bytes } = validateContentMachineSnapshot(snapshot, encoded);

assert.match(
  readFileSync(path.join(root, "api", "admin", "content-machine.ts"), "utf8"),
  /requireAdmin/,
  "Content-machine endpoint must remain owner-protected.",
);
console.log(`content-machine verify: OK · ${snapshot.pipelines.length} pipelines · ${bytes} bytes`);
