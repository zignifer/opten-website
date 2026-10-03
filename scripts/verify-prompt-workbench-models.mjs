import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { SignJWT } from "jose";

const tempDir = await mkdtemp(join(tmpdir(), "opten-model-routing-"));
const bundledHandler = join(tempDir, "prompt-workbench.mjs");
const previousFetch = globalThis.fetch;
const previousJwtSecret = process.env.SUPABASE_JWT_SECRET;
const testJwtSecret = "model-routing-test-secret-local-only";

try {
  await build({
    entryPoints: [join(process.cwd(), "api", "prompt-workbench.ts")],
    outfile: bundledHandler,
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node18",
    logLevel: "silent",
  });
  const { default: handler } = await import(pathToFileURL(bundledHandler).href);
  process.env.SUPABASE_JWT_SECRET = testJwtSecret;
  const token = await new SignJWT({ email: "models@example.test" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("model-routing-test-user")
    .setAudience("authenticated")
    .setIssuer("https://supabase.opten.space/auth/v1")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(testJwtSecret));

  const requests = [];
  const resultPrompt = "A ceramic cup beside a window in soft morning light, vertical composition.";
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), "https://promptscore-proxy.vercel.app/api/rewrite");
    requests.push(JSON.parse(init.body));
    return new Response(JSON.stringify({
      content: [{ type: "text", text: resultPrompt }],
      remaining: 2,
      limit: 300,
      plan: "free",
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  async function invoke(body) {
    const response = {
      statusCode: 200,
      writableEnded: false,
      setHeader() {},
      end(value) {
        this.writableEnded = true;
        this.body = typeof value === "string" && value ? JSON.parse(value) : value;
      },
    };
    await handler({ method: "POST", headers: { authorization: `Bearer ${token}` }, body }, response);
    return response;
  }

  for (const [model, isVideo] of [
    ["gpt-image-2.5-sunburst", false],
    ["gpt-image-2.5-flare", false],
    ["kling-4", true],
    ["gpt-image-2", false],
    ["seedance-2.5", true],
  ]) {
    for (const images of [undefined, []]) {
      const response = await invoke({ action: "improve", prompt: "A ceramic cup beside a window in morning light.", model, images });
      assert.equal(response.statusCode, 200, `${model} must work without uploaded references`);
      assert.equal(response.body.result.prompt, resultPrompt);
      const request = requests.at(-1);
      assert.equal(request.model_name, model, "The variant slug must reach the proxy unchanged");
      assert.equal(request.is_video, isVideo);
      assert.equal(request.count_usage, true);
      assert.equal(request.source, "popup");
      assert.equal(typeof request.messages[0].content, "string", "Text-only requests must not synthesize images");
    }
  }

  const reference = { data: "YWJj", mediaType: "image/jpeg" };
  for (const model of ["gpt-image-2.5-sunburst", "gpt-image-2.5-flare", "kling-4"]) {
    const response = await invoke({ action: "improve", prompt: "Use this cup as a product reference in morning light.", model, images: [reference] });
    assert.equal(response.statusCode, 200);
    const content = requests.at(-1).messages[0].content;
    assert.equal(Array.isArray(content), true);
    assert.deepEqual(content[1].source, { type: "base64", media_type: "image/jpeg", data: reference.data });
  }

  const requestCount = requests.length;
  for (const model of ["gpt-image-2.5", "unknown-model"]) {
    const response = await invoke({ action: "improve", prompt: "A ceramic cup beside a window in morning light.", model, images: [] });
    assert.equal(response.statusCode, 400, "The website exposes only explicitly curated variants");
    assert.equal(response.body.error, "invalid_model");
  }
  assert.equal(requests.length, requestCount, "Rejected slugs must not call the proxy");
  console.log("PASS Workbench model routing: 10 text-only, 3 optional-reference, 2 rejected-slug requests; no network or AI calls");
} finally {
  globalThis.fetch = previousFetch;
  if (previousJwtSecret === undefined) delete process.env.SUPABASE_JWT_SECRET;
  else process.env.SUPABASE_JWT_SECRET = previousJwtSecret;
  await rm(tempDir, { recursive: true, force: true });
}
