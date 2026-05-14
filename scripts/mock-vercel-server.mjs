// Local test server that emulates Vercel's static-file-precedence-over-rewrite behavior.
// Static files in dist/ win first; unmatched paths fall back to /index.html.
// Used only for local playwright verification of Phase 2 hydration logic — not committed to the build.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = resolve(fileURLToPath(import.meta.url), "../..", "dist");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".png":  "image/png",
  ".svg":  "image/svg+xml",
  ".xml":  "application/xml",
  ".txt":  "text/plain; charset=utf-8",
  ".ico":  "image/x-icon",
};

async function tryFile(p) {
  try { return await readFile(p); } catch { return null; }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";

  // 1. Try exact static file
  let body = await tryFile(resolve(DIST, "." + pathname));
  let ext = extname(pathname);

  // 2. Try as directory (pathname/index.html)
  if (!body && !ext) {
    body = await tryFile(resolve(DIST, "." + pathname, "index.html"));
    ext = ".html";
  }

  // 3. SPA fallback: /index.html
  if (!body) {
    body = await tryFile(resolve(DIST, "index.html"));
    ext = ".html";
  }

  if (!body) { res.statusCode = 404; res.end("not found"); return; }
  res.statusCode = 200;
  res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
  res.end(body);
});

const PORT = Number(process.env.PORT ?? 4182);
server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock vercel serving dist/ at http://127.0.0.1:${PORT}`);
});
