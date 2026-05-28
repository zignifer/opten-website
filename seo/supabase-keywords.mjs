// seo/supabase-keywords.mjs — read SEO keyword data from the opten-seo Supabase
// project WITHOUT leaving this repo. Optional live source; the committed snapshot
// seo/blog-clusters.md stays the default.
//
//   node seo/supabase-keywords.mjs                 # all BL-* clusters, top by volume
//   node seo/supabase-keywords.mjs --cluster BL-news --limit 50
//   node seo/supabase-keywords.mjs --lang ru
//
// Creds (SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY) are read from .env.local — the
// publishable key only (read). Never put the secret key / access token here.
// Lookup order: env → C:\Projects\opten-website\.env.local → C:\Projects\opten-seo\.env.local.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV_FILES = [
  join(HERE, "..", ".env.local"),
  "C:\\Projects\\opten-website\\.env.local",
  "C:\\Projects\\opten-seo\\.env.local",
];

function fromEnvFiles(key) {
  if (process.env[key]) return process.env[key].trim();
  for (const f of ENV_FILES) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, "utf8").match(new RegExp("^\\s*" + key + "\\s*=\\s*(.+?)\\s*$", "m"));
    if (m) return m[1].replace(/^["']|["']$/g, "").trim();
  }
  return null;
}

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--cluster") a.cluster = argv[++i];
    else if (k === "--lang") a.lang = argv[++i];
    else if (k === "--limit") a.limit = parseInt(argv[++i], 10);
  }
  return a;
}

async function main() {
  const args = parseArgs(process.argv);
  const url = fromEnvFiles("SUPABASE_URL");
  const key = fromEnvFiles("SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) {
    console.error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY in .env.local");
    process.exit(2);
  }

  const params = new URLSearchParams();
  params.set("select", "keyword,language,volume,cluster_id");
  params.set("cluster_id", args.cluster ? `eq.${args.cluster}` : "like.BL-*");
  if (args.lang) params.set("language", `eq.${args.lang}`);
  params.set("order", "cluster_id,volume.desc.nullslast");
  params.set("limit", String(args.limit || 200));

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/seo_keywords?${params.toString()}`;
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.error(`Supabase ${res.status}: ${(await res.text()).slice(0, 400)}`);
    process.exit(1);
  }
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log("(no rows)");
    return;
  }
  for (const r of rows) {
    console.log(`${(r.cluster_id || "").padEnd(14)} ${(r.language || "").padEnd(3)} ${String(r.volume ?? "").padStart(7)}  ${r.keyword}`);
  }
  console.log(`\n${rows.length} rows`);
}

main().catch((e) => {
  console.error(`supabase-keywords error: ${e.message || e}`);
  process.exit(1);
});
