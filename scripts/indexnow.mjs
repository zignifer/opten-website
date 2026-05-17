// Phase 4.2 P1-4: Postbuild IndexNow ping for Bing + Yandex.
// Reads dist/sitemap.xml, extracts <loc> URLs, POSTs the full list to
// https://api.indexnow.org/indexnow with the committed key.
//
// Best-effort by design: any network failure (DNS, timeout, non-2xx
// response) logs a warning but DOES NOT fail the build. IndexNow is a
// notification mechanism, not a precondition — losing one ping while
// shipping a sitemap is fine, search engines will recrawl on their
// own schedule eventually.
//
// To disable for local iteration: INDEXNOW_SKIP=1 npm run build
//   PowerShell: $env:INDEXNOW_SKIP=1; npm run build

import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const PUBLIC = resolve(ROOT, "public");
const HOST = "opten.space";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const TIMEOUT_MS = 5000;

async function findKey() {
  const files = await readdir(PUBLIC);
  const match = files.find((f) => /^[a-f0-9]{8,128}\.txt$/.test(f));
  if (!match) {
    throw new Error(
      "indexnow: no key file in public/ — generate one with `node -e \"console.log(require('crypto').randomBytes(16).toString('hex'))\"` and save as public/<key>.txt containing the same key",
    );
  }
  return match.replace(".txt", "");
}

async function extractUrls() {
  const xml = await readFile(resolve(DIST, "sitemap.xml"), "utf-8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length < 16) {
    throw new Error(
      `indexnow: expected >= 16 URLs from dist/sitemap.xml, got ${urls.length}`,
    );
  }
  return urls;
}

async function ping(key, urls) {
  const body = JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls,
  });
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
      signal: ctrl.signal,
    });
    clearTimeout(t);
    // 200/202 = accepted. 422 = invalid format. 4xx/5xx = log warning.
    if (res.status === 200 || res.status === 202) {
      console.log(
        `✓ indexnow → pinged ${urls.length} URLs (status ${res.status})`,
      );
    } else {
      console.warn(
        `⚠ indexnow → unexpected status ${res.status} (URLs still committed; this is best-effort)`,
      );
    }
  } catch (err) {
    clearTimeout(t);
    console.warn(
      `⚠ indexnow → ping failed (${err.message}); continuing build — best-effort by design`,
    );
  }
}

const key = await findKey();
const urls = await extractUrls();

// Skip the ping when running in CI without network or in dev (set
// INDEXNOW_SKIP=1 to bypass). Vercel build does have network — the
// ping fires on real deploys, no extra config needed.
if (process.env.INDEXNOW_SKIP === "1") {
  console.log(
    `✓ indexnow → skipped (INDEXNOW_SKIP=1); would have pinged ${urls.length} URLs with key ${key.slice(0, 8)}…`,
  );
} else {
  await ping(key, urls);
}
