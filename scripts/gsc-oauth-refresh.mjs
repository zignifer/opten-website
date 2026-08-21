import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const STATUS_PATH = resolve(ROOT, ".secrets", "gsc-oauth-refresh.status.json");
const OUT_PATH = resolve(ROOT, ".secrets", "gsc-oauth-refresh.out.log");
const ERR_PATH = resolve(ROOT, ".secrets", "gsc-oauth-refresh.err.log");
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const TOKEN_EXCHANGE_ATTEMPTS = 3;
const TOKEN_EXCHANGE_RETRY_DELAYS_MS = [750, 2_000];
const ENV_PATHS = [
  resolve(ROOT, ".secrets", "gsc-oauth.env"),
].filter((path, index, list) => existsSync(path) && list.indexOf(path) === index);

function parseEnv(raw) {
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) out[match[1].trim()] = match[2].trim();
  }
  return out;
}

function upsertEnv(raw, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(raw)) return raw.replace(re, line);
  return raw.replace(/\s*$/, "") + `\n${line}\n`;
}

async function writeStatus(status) {
  await writeFile(STATUS_PATH, JSON.stringify({ ...status, updatedAt: new Date().toISOString() }, null, 2), "utf8");
}

async function readStatus() {
  return JSON.parse(await readFile(STATUS_PATH, "utf8"));
}

async function updateToken(refreshToken) {
  for (const path of ENV_PATHS) {
    const raw = await readFile(path, "utf8");
    await writeFile(path, upsertEnv(raw, "GSC_REFRESH_TOKEN", refreshToken), "utf8");
  }
}

function formatError(error) {
  const message = String(error?.message || error);
  const causeCode = error?.cause?.code;
  const causeMessage = error?.cause?.message;
  return [message, causeCode, causeMessage].filter(Boolean).join(" | ");
}

async function exchangeAuthorizationCode(cfg, code, redirectUri) {
  for (let attempt = 1; attempt <= TOKEN_EXCHANGE_ATTEMPTS; attempt += 1) {
    let tokenRes;
    try {
      tokenRes = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: cfg.GSC_CLIENT_ID,
          client_secret: cfg.GSC_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
        signal: AbortSignal.timeout(20_000),
      });
    } catch (error) {
      if (attempt === TOKEN_EXCHANGE_ATTEMPTS) {
        throw new Error(
          `Token transport failed after ${TOKEN_EXCHANGE_ATTEMPTS} attempts: ${formatError(error)}`,
        );
      }
      await new Promise((resolveWait) =>
        setTimeout(resolveWait, TOKEN_EXCHANGE_RETRY_DELAYS_MS[attempt - 1]),
      );
      continue;
    }

    const tokenBody = await tokenRes.json().catch(() => ({}));
    if (tokenRes.ok && tokenBody.refresh_token) return tokenBody.refresh_token;

    const retryableStatus = tokenRes.status === 429 || tokenRes.status >= 500;
    if (retryableStatus && attempt < TOKEN_EXCHANGE_ATTEMPTS) {
      await new Promise((resolveWait) =>
        setTimeout(resolveWait, TOKEN_EXCHANGE_RETRY_DELAYS_MS[attempt - 1]),
      );
      continue;
    }

    throw new Error(`Token exchange failed: ${tokenBody.error || tokenRes.status}`);
  }

  throw new Error("Token exchange failed without a response");
}

async function serve() {
  try {
    const raw = await readFile(ENV_PATHS[0], "utf8");
    const cfg = parseEnv(raw);
    if (!cfg.GSC_CLIENT_ID || !cfg.GSC_CLIENT_SECRET) {
      throw new Error("Missing GSC_CLIENT_ID/GSC_CLIENT_SECRET");
    }

    const state = randomBytes(16).toString("hex");
    let timeout;
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, "http://127.0.0.1");
        if (url.pathname !== "/oauth2callback") {
          res.writeHead(404).end("Not found");
          return;
        }
        if (url.searchParams.get("state") !== state) throw new Error("OAuth state mismatch");
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        if (error) throw new Error(`OAuth error: ${error}`);
        if (!code) throw new Error("No OAuth code returned");

        const redirectUri = `http://127.0.0.1:${server.address().port}/oauth2callback`;
        const refreshToken = await exchangeAuthorizationCode(cfg, code, redirectUri);
        await updateToken(refreshToken);
        await writeStatus({ status: "complete", updatedFiles: ENV_PATHS.length });
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(
          "<h1>Search Console access refreshed</h1><p>You can close this tab and return to Codex.</p>",
        );
        clearTimeout(timeout);
        server.close(() => process.exit(0));
      } catch (error) {
        const message = formatError(error);
        await writeStatus({ status: "error", message });
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }).end(message);
        clearTimeout(timeout);
        server.close(() => process.exit(1));
      }
    });

    server.listen(0, "127.0.0.1", async () => {
      const port = server.address().port;
      const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", cfg.GSC_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/webmasters");
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
      authUrl.searchParams.set("state", state);
      await writeStatus({
        status: "waiting",
        pid: process.pid,
        callback: redirectUri,
        authUrl: authUrl.toString(),
        updatedFiles: ENV_PATHS.length,
      });
    });

    timeout = setTimeout(async () => {
      await writeStatus({ status: "timeout", message: "Timed out waiting for Google OAuth callback" });
      server.close(() => process.exit(1));
    }, 600000);
  } catch (error) {
    await writeStatus({ status: "error", message: formatError(error) });
    process.exit(1);
  }
}

async function start() {
  if (ENV_PATHS.length === 0) {
    throw new Error("Missing .secrets/gsc-oauth.env");
  }
  await rm(STATUS_PATH, { force: true });
  await rm(OUT_PATH, { force: true });
  await rm(ERR_PATH, { force: true });

  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), "serve"], {
    cwd: ROOT,
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();

  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (existsSync(STATUS_PATH)) {
      console.log(JSON.stringify(await readStatus(), null, 2));
      return;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error("GSC OAuth helper did not write status file");
}

const command = process.argv[2] || "start";
if (command === "serve") {
  await serve();
} else if (command === "status") {
  console.log(JSON.stringify(await readStatus(), null, 2));
} else if (command === "start") {
  await start();
} else {
  throw new Error(`Unknown command: ${command}`);
}
