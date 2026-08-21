import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DEFAULT_ENV_PATH = resolve(ROOT, ".secrets", "gsc-oauth.env");
const DEFAULT_SITE = "sc-domain:opten.space";
const DEFAULT_SITEMAP = "https://opten.space/sitemap.xml";
const DEFAULT_INSPECTION_REPORT = resolve(ROOT, ".secrets", "gsc-inspection-latest.json");
const INSPECTION_CONCURRENCY = 8;
const GOOGLE_REQUEST_TIMEOUT_MS = 30_000;

function parseEnv(raw) {
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (!match) continue;
    out[match[1].trim()] = match[2].trim();
  }
  return out;
}

async function loadConfig() {
  const envPath = process.env.GSC_ENV_PATH
    ? resolve(ROOT, process.env.GSC_ENV_PATH)
    : DEFAULT_ENV_PATH;
  const fileEnv = parseEnv(await readFile(envPath, "utf8"));
  const config = {
    clientId: process.env.GSC_CLIENT_ID || fileEnv.GSC_CLIENT_ID,
    clientSecret: process.env.GSC_CLIENT_SECRET || fileEnv.GSC_CLIENT_SECRET,
    refreshToken: process.env.GSC_REFRESH_TOKEN || fileEnv.GSC_REFRESH_TOKEN,
    siteUrl: process.env.GSC_SITE_URL || fileEnv.GSC_SITE_URL || DEFAULT_SITE,
  };
  for (const [key, value] of Object.entries(config)) {
    if (!value) throw new Error(`Missing ${key}; expected it in ${envPath}`);
  }
  return config;
}

async function accessToken(config) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const body = await res.json();
  if (!body.access_token) {
    throw new Error(`Token exchange failed: ${body.error || res.status} ${body.error_description || ""}`.trim());
  }
  return body.access_token;
}

async function googleJson(url, token, options = {}) {
  const { headers: optionHeaders = {}, ...fetchOptions } = options;
  const res = await fetch(url, {
    ...fetchOptions,
    signal: options.signal || AbortSignal.timeout(GOOGLE_REQUEST_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...optionHeaders,
    },
  });
  if (res.status === 204) return { status: res.status, body: null };
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${JSON.stringify(body)}`);
  }
  return { status: res.status, body };
}

function sitePath(siteUrl) {
  return encodeURIComponent(siteUrl);
}

async function sites(token) {
  const { body } = await googleJson("https://www.googleapis.com/webmasters/v3/sites", token);
  console.log(JSON.stringify(body, null, 2));
}

async function sitemaps(token, config) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${sitePath(config.siteUrl)}/sitemaps`;
  const { body } = await googleJson(url, token);
  console.log(JSON.stringify(body, null, 2));
}

async function submitSitemap(token, config, sitemapUrl = DEFAULT_SITEMAP) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${sitePath(config.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const { status } = await googleJson(url, token, { method: "PUT" });
  console.log(JSON.stringify({ siteUrl: config.siteUrl, sitemapUrl, status, submitted: status === 204 }, null, 2));
}

async function inspectUrl(token, config, inspectionUrl) {
  const { body } = await googleJson("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", token, {
    method: "POST",
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: config.siteUrl,
    }),
  });
  const idx = body.inspectionResult?.indexStatusResult;
  return {
    inspectionUrl,
    verdict: idx?.verdict,
    coverageState: idx?.coverageState,
    robotsTxtState: idx?.robotsTxtState,
    indexingState: idx?.indexingState,
    pageFetchState: idx?.pageFetchState,
    googleCanonical: idx?.googleCanonical,
    userCanonical: idx?.userCanonical,
    lastCrawlTime: idx?.lastCrawlTime,
    sitemap: idx?.sitemap,
    referringUrls: idx?.referringUrls,
  };
}

async function inspect(token, config, inspectionUrl) {
  if (!inspectionUrl) throw new Error("Usage: node scripts/gsc.mjs inspect https://opten.space/path");
  console.log(JSON.stringify(await inspectUrl(token, config, inspectionUrl), null, 2));
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

async function inspectSitemap(token, config, sitemapUrl = DEFAULT_SITEMAP) {
  const sitemapRes = await fetch(sitemapUrl);
  if (!sitemapRes.ok) throw new Error(`Sitemap fetch failed: ${sitemapRes.status} ${sitemapRes.statusText}`);
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)]
    .map((match) => decodeXml(match[1].trim()))
    .filter((url) => url.startsWith("https://opten.space/"));
  if (urls.length === 0) throw new Error(`No opten.space URLs found in ${sitemapUrl}`);

  const results = new Array(urls.length);
  let nextIndex = 0;
  let completed = 0;
  async function worker() {
    while (nextIndex < urls.length) {
      const index = nextIndex;
      nextIndex += 1;
      const inspectionUrl = urls[index];
      try {
        results[index] = await inspectUrl(token, config, inspectionUrl);
      } catch (error) {
        results[index] = { inspectionUrl, error: String(error?.message || error) };
      } finally {
        completed += 1;
        if (completed % 25 === 0 || completed === urls.length) {
          console.error(`gsc inspect-sitemap: ${completed}/${urls.length}`);
        }
      }
    }
  }
  await Promise.all(Array.from({ length: INSPECTION_CONCURRENCY }, () => worker()));

  const byCoverageState = {};
  const byVerdict = {};
  for (const result of results) {
    const coverageState = result.coverageState || (result.error ? "Inspection error" : "Unknown");
    const verdict = result.verdict || (result.error ? "ERROR" : "UNKNOWN");
    byCoverageState[coverageState] = (byCoverageState[coverageState] || 0) + 1;
    byVerdict[verdict] = (byVerdict[verdict] || 0) + 1;
  }

  const examplesByCoverageState = Object.fromEntries(
    Object.keys(byCoverageState).map((coverageState) => [
      coverageState,
      results
        .filter((result) =>
          (result.coverageState || (result.error ? "Inspection error" : "Unknown")) === coverageState,
        )
        .slice(0, 10)
        .map((result) => result.inspectionUrl),
    ]),
  );
  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: config.siteUrl,
    sitemapUrl,
    total: results.length,
    byVerdict,
    byCoverageState,
    results,
  };
  await writeFile(DEFAULT_INSPECTION_REPORT, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({
    generatedAt: report.generatedAt,
    siteUrl: report.siteUrl,
    sitemapUrl: report.sitemapUrl,
    total: report.total,
    byVerdict,
    byCoverageState,
    examplesByCoverageState,
    reportPath: DEFAULT_INSPECTION_REPORT,
  }, null, 2));
}

async function performance(token, config, daysArg = "90") {
  const days = Number(daysArg);
  if (!Number.isFinite(days) || days <= 0) throw new Error("performance days must be a positive number");
  const end = new Date();
  const start = new Date(Date.now() - days * 864e5);
  const iso = (d) => d.toISOString().slice(0, 10);
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${sitePath(config.siteUrl)}/searchAnalytics/query`;
  const { body } = await googleJson(url, token, {
    method: "POST",
    body: JSON.stringify({
      startDate: iso(start),
      endDate: iso(end),
      dimensions: ["page"],
      rowLimit: 25,
    }),
  });
  console.log(JSON.stringify({
    siteUrl: config.siteUrl,
    days,
    rows: body.rows || [],
  }, null, 2));
}

async function queries(token, config, daysArg = "90") {
  const days = Number(daysArg);
  if (!Number.isFinite(days) || days <= 0) throw new Error("queries days must be a positive number");
  const end = new Date();
  const start = new Date(Date.now() - days * 864e5);
  const iso = (date) => date.toISOString().slice(0, 10);
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${sitePath(config.siteUrl)}/searchAnalytics/query`;
  const { body } = await googleJson(url, token, {
    method: "POST",
    body: JSON.stringify({
      startDate: iso(start),
      endDate: iso(end),
      dimensions: ["query", "page"],
      dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: "/blog/" }] }],
      rowLimit: 500,
    }),
  });
  console.log(JSON.stringify({ siteUrl: config.siteUrl, days, rows: body.rows || [] }, null, 2));
}

async function main() {
  const [command = "help", arg] = process.argv.slice(2);
  if (command === "help" || command === "--help" || command === "-h") {
    console.log([
      "Usage:",
      "  node scripts/gsc.mjs sites",
      "  node scripts/gsc.mjs sitemaps",
      "  node scripts/gsc.mjs submit-sitemap [sitemapUrl]",
      "  node scripts/gsc.mjs inspect https://opten.space/path",
      "  node scripts/gsc.mjs inspect-sitemap [sitemapUrl]",
      "  node scripts/gsc.mjs performance [days]",
      "  node scripts/gsc.mjs queries [days]",
    ].join("\n"));
    return;
  }

  const config = await loadConfig();
  const token = await accessToken(config);

  if (command === "sites") return sites(token);
  if (command === "sitemaps") return sitemaps(token, config);
  if (command === "submit-sitemap") return submitSitemap(token, config, arg);
  if (command === "inspect") return inspect(token, config, arg);
  if (command === "inspect-sitemap") return inspectSitemap(token, config, arg);
  if (command === "performance") return performance(token, config, arg);
  if (command === "queries") return queries(token, config, arg);
  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
