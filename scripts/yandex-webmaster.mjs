import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DEFAULT_ENV_PATH = resolve(ROOT, ".secrets", "yandex-webmaster.env");
const API_BASE = "https://api.webmaster.yandex.net/v4";
const DEFAULT_HOST_URL = "https://opten.space/";

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
  const envPath = process.env.YANDEX_WEBMASTER_ENV_PATH
    ? resolve(ROOT, process.env.YANDEX_WEBMASTER_ENV_PATH)
    : DEFAULT_ENV_PATH;
  const fileEnv = parseEnv(await readFile(envPath, "utf8"));
  const config = {
    token: process.env.YANDEX_WEBMASTER_OAUTH_TOKEN || fileEnv.YANDEX_WEBMASTER_OAUTH_TOKEN,
    hostUrl: process.env.YANDEX_WEBMASTER_HOST_URL || fileEnv.YANDEX_WEBMASTER_HOST_URL || DEFAULT_HOST_URL,
  };
  if (!config.token) throw new Error(`Missing YANDEX_WEBMASTER_OAUTH_TOKEN in ${envPath}`);
  return config;
}

async function yandexJson(path, config, options = {}) {
  const url = path.startsWith("https://") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `OAuth ${config.token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
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

async function getUser(config) {
  const { body } = await yandexJson("/user", config);
  return body.user_id ?? body.userId ?? body.id;
}

async function getHosts(config) {
  const userId = await getUser(config);
  const { body } = await yandexJson(`/user/${encodeURIComponent(userId)}/hosts`, config);
  const hosts = body.hosts || body.items || [];
  return { userId, hosts };
}

function normalizeUrl(value) {
  return String(value || "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

async function getHost(config) {
  const { userId, hosts } = await getHosts(config);
  const target = normalizeUrl(config.hostUrl);
  const host = hosts.find((item) => {
    const candidates = [
      item.ascii_host_url,
      item.unicode_host_url,
      item.host_url,
      item.host_id,
    ];
    return candidates.some((candidate) => normalizeUrl(candidate).includes(target));
  });
  if (!host) {
    throw new Error(`Host for ${config.hostUrl} not found. Available: ${hosts.map((h) => h.host_id || h.ascii_host_url || h.unicode_host_url).join(", ")}`);
  }
  return { userId, hostId: host.host_id, host };
}

async function user(config) {
  const { body } = await yandexJson("/user", config);
  console.log(JSON.stringify(body, null, 2));
}

async function hosts(config) {
  const result = await getHosts(config);
  console.log(JSON.stringify(result, null, 2));
}

async function summary(config) {
  const { userId, hostId, host } = await getHost(config);
  const { body } = await yandexJson(`/user/${encodeURIComponent(userId)}/hosts/${encodeURIComponent(hostId)}/summary`, config);
  console.log(JSON.stringify({ host, summary: body }, null, 2));
}

async function sitemaps(config) {
  const { userId, hostId, host } = await getHost(config);
  const { body } = await yandexJson(`/user/${encodeURIComponent(userId)}/hosts/${encodeURIComponent(hostId)}/sitemaps`, config);
  console.log(JSON.stringify({ host, sitemaps: body }, null, 2));
}

async function queries(config, orderBy = "TOTAL_SHOWS") {
  const { userId, hostId, host } = await getHost(config);
  const params = new URLSearchParams({
    order_by: orderBy,
    limit: "100",
  });
  for (const indicator of ["TOTAL_SHOWS", "TOTAL_CLICKS", "AVG_SHOW_POSITION", "AVG_CLICK_POSITION"]) {
    params.append("query_indicator", indicator);
  }
  const { body } = await yandexJson(`/user/${encodeURIComponent(userId)}/hosts/${encodeURIComponent(hostId)}/search-queries/popular?${params}`, config);
  console.log(JSON.stringify({ host, queries: body }, null, 2));
}

async function recrawlQueue(config) {
  const { userId, hostId, host } = await getHost(config);
  const { body } = await yandexJson(`/user/${encodeURIComponent(userId)}/hosts/${encodeURIComponent(hostId)}/recrawl/queue`, config);
  console.log(JSON.stringify({ host, queue: body }, null, 2));
}

async function recrawl(config, url) {
  if (!url) throw new Error("Usage: node scripts/yandex-webmaster.mjs recrawl https://opten.space/path");
  const { userId, hostId, host } = await getHost(config);
  const { status, body } = await yandexJson(`/user/${encodeURIComponent(userId)}/hosts/${encodeURIComponent(hostId)}/recrawl/queue`, config, {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  console.log(JSON.stringify({ host, url, status, body }, null, 2));
}

async function main() {
  const [command = "help", arg] = process.argv.slice(2);
  if (command === "help" || command === "--help" || command === "-h") {
    console.log([
      "Usage:",
      "  node scripts/yandex-webmaster.mjs user",
      "  node scripts/yandex-webmaster.mjs hosts",
      "  node scripts/yandex-webmaster.mjs summary",
      "  node scripts/yandex-webmaster.mjs sitemaps",
      "  node scripts/yandex-webmaster.mjs queries [TOTAL_SHOWS|TOTAL_CLICKS]",
      "  node scripts/yandex-webmaster.mjs recrawl-queue",
      "  node scripts/yandex-webmaster.mjs recrawl https://opten.space/path",
    ].join("\n"));
    return;
  }

  const config = await loadConfig();
  if (command === "user") return user(config);
  if (command === "hosts") return hosts(config);
  if (command === "summary") return summary(config);
  if (command === "sitemaps") return sitemaps(config);
  if (command === "queries") return queries(config, arg);
  if (command === "recrawl-queue") return recrawlQueue(config);
  if (command === "recrawl") return recrawl(config, arg);
  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
