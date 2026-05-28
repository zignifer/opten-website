// seo/fal-image.mjs — generate one blog image via fal.ai GPT Image 2 (high quality).
//
// Self-contained helper for the daily blog routine. Outputs a JPEG at the
// requested size (default 1600x900, 16:9). Plain Node, no build step:
//
//   node seo/fal-image.mjs \
//     --prompt "Minimal dark hero, deep teal-black #011417, lime #9CFB51 glow, no text, 16:9" \
//     --out    "public/blog/<slug>/cover.jpg"
//
// FAL_KEY lookup order (the routine runs in an isolated git worktree where
// gitignored .env.local files are absent, so we also probe the real checkouts
// by absolute path):
//   1. --key arg
//   2. env FAL_KEY
//   3. <this worktree>/.env.local
//   4. C:\Projects\opten-website\.env.local   (main checkout)
//   5. C:\Projects\opten-seo\.env.local        (seo workspace fallback)
//
// sharp (a direct dependency of opten-website) guarantees exact WIDTHxHEIGHT.
// If it is somehow unavailable, we fall back to whatever fal returns (we still
// request the exact size) and the website build's dimension check is the net.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const MODEL_URL = "https://queue.fal.run/openai/gpt-image-2";

const KEY_FILES = [
  join(HERE, "..", ".env.local"),
  "C:\\Projects\\opten-website\\.env.local",
  "C:\\Projects\\opten-seo\\.env.local",
];

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--prompt") a.prompt = argv[++i];
    else if (k === "--out") a.out = argv[++i];
    else if (k === "--key") a.key = argv[++i];
    else if (k === "--width") a.width = parseInt(argv[++i], 10);
    else if (k === "--height") a.height = parseInt(argv[++i], 10);
  }
  return a;
}

function keyFromFile(path) {
  if (!existsSync(path)) return null;
  const m = readFileSync(path, "utf8").match(/^\s*FAL_KEY\s*=\s*(.+?)\s*$/m);
  return m ? m[1].replace(/^["']|["']$/g, "").trim() : null;
}

function resolveKey(explicit) {
  if (explicit) return explicit.trim();
  if (process.env.FAL_KEY) return process.env.FAL_KEY.trim();
  for (const f of KEY_FILES) {
    const k = keyFromFile(f);
    if (k) return k;
  }
  throw new Error(
    "FAL_KEY not found. Pass --key, set env FAL_KEY, or add FAL_KEY to one of: " +
      KEY_FILES.join(" | ")
  );
}

async function falJson(url, key, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`fal ${res.status} ${url}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : {};
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.prompt || !args.out) {
    console.error('Usage: node seo/fal-image.mjs --prompt "<image prompt>" --out "<path.jpg>" [--width 1600 --height 900]');
    process.exit(2);
  }
  const key = resolveKey(args.key);
  const width = args.width || 1600;
  const height = args.height || 900;

  const submit = await falJson(MODEL_URL, key, {
    method: "POST",
    body: JSON.stringify({
      prompt: args.prompt,
      image_size: { width, height },
      quality: "high",
      num_images: 1,
      output_format: "jpeg",
    }),
  });

  const reqId = submit.request_id;
  const statusUrl = submit.status_url || `${MODEL_URL}/requests/${reqId}/status`;
  const responseUrl = submit.response_url || `${MODEL_URL}/requests/${reqId}`;

  const deadline = Date.now() + 5 * 60 * 1000;
  let result = null;
  while (Date.now() < deadline) {
    const s = await falJson(statusUrl, key);
    if (s.status === "COMPLETED") {
      result = await falJson(responseUrl, key);
      break;
    }
    if (s.status === "FAILED" || s.status === "ERROR") {
      throw new Error(`fal generation failed: ${JSON.stringify(s).slice(0, 500)}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  if (!result) throw new Error("fal timed out after 5 min");

  const img = result.images && result.images[0];
  if (!img || !img.url) throw new Error(`no image in fal result: ${JSON.stringify(result).slice(0, 500)}`);

  const dl = await fetch(img.url);
  if (!dl.ok) throw new Error(`download failed ${dl.status}`);
  let buf = Buffer.from(await dl.arrayBuffer());

  try {
    const sharp = (await import("sharp")).default;
    buf = await sharp(buf).resize(width, height, { fit: "cover" }).jpeg({ quality: 88 }).toBuffer();
  } catch (e) {
    if (!/Cannot find (package|module)|ERR_MODULE_NOT_FOUND/.test(String(e))) throw e;
    console.warn("sharp unavailable — saving fal output as-is (run npm ci first to guarantee exact size)");
  }

  const outDir = dirname(args.out);
  if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(args.out, buf);
  console.log(`OK ${args.out} (${width}x${height}, ${buf.length} bytes)`);
}

main().catch((e) => {
  console.error(`fal-image error: ${e.message || e}`);
  process.exit(1);
});
