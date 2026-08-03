import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { SignJWT } from "jose";

const ROOT = process.cwd();
const FIXTURE_PATH = join(ROOT, "scripts", "fixtures", "prompt-workbench-vibecoding.json");
const GUARDRAIL_PATH = join(ROOT, "api", "_shared", "promptWorkbenchVibecoding.ts");

const tempDir = await mkdtemp(join(tmpdir(), "opten-vibecoding-"));
const bundledGuardrails = join(tempDir, "guardrails.mjs");
const bundledHandler = join(tempDir, "prompt-workbench.mjs");

try {
  await build({
    entryPoints: [GUARDRAIL_PATH],
    outfile: bundledGuardrails,
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node18",
    logLevel: "silent",
  });
  await build({
    entryPoints: [join(ROOT, "api", "prompt-workbench.ts")],
    outfile: bundledHandler,
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node18",
    logLevel: "silent",
  });

  const {
    detectVibecodingPromptLanguage,
    extractVibecodingProtectedFragments,
    validateVibecodingCandidate,
    vibecodingPromptReferencesImages,
  } = await import(`${pathToFileURL(bundledGuardrails).href}?v=${Date.now()}`);

  const fixtures = JSON.parse(await readFile(FIXTURE_PATH, "utf8"));
  assert.ok(Array.isArray(fixtures), "golden fixture must be an array");
  assert.ok(fixtures.length >= 50, "golden fixture must contain at least 50 cases");
  assert.equal(new Set(fixtures.map((fixture) => fixture.id)).size, fixtures.length, "fixture ids must be unique");
  assert.ok(fixtures.filter((fixture) => fixture.lang === "ru").length >= 20, "fixture must cover Russian requests");
  assert.ok(fixtures.filter((fixture) => fixture.lang === "en").length >= 20, "fixture must cover English requests");

  const fixtureFailures = [];
  for (const fixture of fixtures) {
    try {
      assert.ok(typeof fixture.input === "string" && fixture.input.trim(), `${fixture.id}: input is required`);
      assert.ok(typeof fixture.expected === "string" && fixture.expected.trim(), `${fixture.id}: expected output is required`);
      assert.ok(Array.isArray(fixture.required), `${fixture.id}: required must be an array`);
      assert.ok(Array.isArray(fixture.protected), `${fixture.id}: protected must be an array`);
      assert.ok(Array.isArray(fixture.forbidden), `${fixture.id}: forbidden must be an array`);
      assert.equal(typeof fixture.allowNoop, "boolean", `${fixture.id}: allowNoop must be explicit`);

      const validation = validateVibecodingCandidate(fixture.input, fixture.expected);
      const expectedNoChange = fixture.input.trim().replace(/\s+/g, " ") === fixture.expected.trim().replace(/\s+/g, " ");
      if (expectedNoChange) {
        assert.equal(validation.accepted, false, `${fixture.id}: a provider no-op must not be billed as an improvement`);
        assert.equal(validation.reason, "no_change", `${fixture.id}: unchanged output must be classified as no_change`);
      } else {
        assert.equal(validation.accepted, true, `${fixture.id}: golden output rejected as ${validation.reason}`);
        assert.equal(validation.prompt, fixture.expected.trim(), `${fixture.id}: accepted output must remain unchanged`);
      }

      const expectedLower = fixture.expected.toLocaleLowerCase();
      for (const required of fixture.required) {
        assert.ok(expectedLower.includes(required.toLocaleLowerCase()), `${fixture.id}: missing required meaning "${required}"`);
      }
      for (const literal of fixture.protected) {
        assert.ok(fixture.input.includes(literal), `${fixture.id}: protected literal is absent from input: ${literal}`);
        assert.ok(fixture.expected.includes(literal), `${fixture.id}: protected literal changed or disappeared: ${literal}`);
        assert.ok(extractVibecodingProtectedFragments(fixture.input).includes(literal), `${fixture.id}: runtime extractor does not protect: ${literal}`);
      }
      for (const forbidden of fixture.forbidden) {
        assert.ok(!expectedLower.includes(forbidden.toLocaleLowerCase()), `${fixture.id}: forbidden addition appeared: ${forbidden}`);
      }
      assert.equal(validateVibecodingCandidate(fixture.input, fixture.input).reason, "no_change", `${fixture.id}: exact no-op must be refundable`);
    } catch (error) {
      fixtureFailures.push(error instanceof Error ? error.message : String(error));
    }
  }
  assert.deepEqual(fixtureFailures, [], `golden fixture failures:\n${fixtureFailures.join("\n")}`);

  const protectedSource = "Run npm run build for POST /api/items at https://opten.space using `saveItem()` and @Image1 on v2.4.1 with #9cfb51.";
  const protectedFragments = extractVibecodingProtectedFragments(protectedSource);
  for (const literal of ["npm run build", "POST /api/items", "https://opten.space", "`saveItem()`", "@Image1", "v2.4.1", "#9cfb51"]) {
    assert.ok(protectedFragments.includes(literal), `runtime extractor must protect ${literal}`);
  }

  assert.equal(validateVibecodingCandidate("Fix POST /api/items without changing `itemId`.", "Fix the endpoint.").reason, "missing_protected_fragment");
  assert.equal(validateVibecodingCandidate("Create a landing page for a florist.", "Create a modern responsive landing page for a florist.").reason, "introduced_requirement");
  assert.equal(validateVibecodingCandidate("Create a straightforward landing page for a florist with a catalog and contacts.", "Create a minimalist landing page for a florist with a catalog and contacts.").reason, "introduced_requirement");
  assert.equal(validateVibecodingCandidate("Исправь кнопку оплаты в форме заказа.", "```\nИсправь кнопку оплаты в форме заказа.\n```").reason, "formatting_wrapper");
  assert.equal(validateVibecodingCandidate("Исправь кнопку оплаты в форме заказа и сделай надпись на ней короче.", "Исправь кнопку.").reason, "compressed_too_far");
  assert.equal(validateVibecodingCandidate("Нужно что-то сделать с профилем.", "").reason, "empty");

  const longSource = "Смотри, нужно реализовать вот такой функционал, но я не уверен, что мы правильно всё тут спланировали. Поэтому нужно, чтобы ты всё перепроверил, разбил на этапы и через Super Powers сделал реализацию, делай всё сразу же в папке в ветки Main. Не переключай ни на какие там другие ветки, разбей там на этапы, спланируй реализацию, э-э так, чтобы контекст между сжатиями не терялся у нас при реализации. и всё реализуй, чтобы у меня в конечном итоге был рабочий функционал. в генераторе промтов на сайте под вайб-кодинг, получается.";
  const missingRequirements = "Реализуй функционал вайб-кодинга по этапам через Super Powers в ветке Main.";
  const missingRequirementsValidation = validateVibecodingCandidate(longSource, missingRequirements);
  assert.equal(missingRequirementsValidation.reason, "missing_semantic_anchor");
  for (const anchor of ["planning", "verification", "context", "compaction", "completion", "preservation", "negation"]) {
    assert.ok(missingRequirementsValidation.missingAnchors?.includes(anchor), `Russian semantic guard must detect missing ${anchor}`);
  }

  const feedbackSource = "Смотри, он очень сильно много моментов упустил. Посмотри, что у нас там за правила и почему он не сохранил разбиение на этапы и Super Powers. Я не хотел такой сильной обрезки. Также этот текущий запрос он вообще не смог переписать.";
  const metaResponse = "Я вижу ваше разочарование, но мне нужно уточнить мою роль.\n\nЯ — инструмент для очистки запроса.\n\nПожалуйста, предоставьте исходный текст ещё раз.";
  assert.equal(validateVibecodingCandidate(feedbackSource, metaResponse).reason, "meta_response");

  assert.equal(detectVibecodingPromptLanguage("Исправь handleSubmit в UserCard"), "ru");
  assert.equal(detectVibecodingPromptLanguage("Fix handleSubmit in UserCard"), "en");
  assert.equal(vibecodingPromptReferencesImages("По скриншоту выровняй кнопку"), true);
  assert.equal(vibecodingPromptReferencesImages("Align the button in the attached image"), true);
  assert.equal(vibecodingPromptReferencesImages("Выровняй кнопку с полем"), false);

  const [models, component, api, cleaner] = await Promise.all([
    readFile(join(ROOT, "src", "content", "promptWorkbenchModels.ts"), "utf8"),
    readFile(join(ROOT, "src", "app", "components", "PromptWorkbench.tsx"), "utf8"),
    readFile(join(ROOT, "api", "prompt-workbench.ts"), "utf8"),
    readFile(join(ROOT, "api", "_assets", "prompt-workbench", "vibecoding-cleaner.md"), "utf8"),
  ]);

  assert.match(models, /vibecoding:\s*\[[\s\S]*slug:\s*"codex"[\s\S]*slug:\s*"claude"[\s\S]*slug:\s*"gemini"/);
  assert.match(component, /vibecoding:\s*"codex"/);
  assert.match(component, /vibecoding:\s*"Вайбкодинг"/);
  assert.match(component, /vibecoding:\s*"Vibe coding"/);
  assert.match(component, /<option value="vibecoding"/);
  assert.match(api, /codex:\s*"_coding-codex"[\s\S]*claude:\s*"_coding-claude"[\s\S]*gemini:\s*"_coding-gemini"/);
  assert.match(api, /source:\s*isVibecoding \? "website_vibecoding" : "popup"/);
  assert.doesNotMatch(api, /validateVibecodingCandidate\(prompt,/, "website must not silently replace a billed proxy result after proxy finalization");
  assert.match(api, /X-Opten-Website-Signature/);
  assert.match(api, /vibecoding_original:\s*isVibecoding \? prompt/);
  assert.match(api, /!vibecodingPromptReferencesImages\(prompt\) \? \[\] : images/);
  assert.match(cleaner, /Every semantic element[\s\S]*explicit source/i);
  assert.match(cleaner, /Coverage is more important than brevity/i);
  assert.match(cleaner, /never summarization/i);
  assert.match(cleaner, /return the original request unchanged/i);
  assert.match(cleaner, /Do not translate the request/i);

  const { default: promptWorkbenchHandler } = await import(`${pathToFileURL(bundledHandler).href}?v=${Date.now()}`);
  const testJwtSecret = "vibecoding-focused-verifier-secret-32-bytes-minimum";
  const previousJwtSecret = process.env.SUPABASE_JWT_SECRET;
  const previousFetch = globalThis.fetch;
  process.env.SUPABASE_JWT_SECRET = testJwtSecret;
  const token = await new SignJWT({ email: "focused@example.test" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("focused-user")
    .setAudience("authenticated")
    .setIssuer("https://supabase.opten.space/auth/v1")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(testJwtSecret));

  function createResponseRecorder() {
    return {
      statusCode: 200,
      headers: new Map(),
      writableEnded: false,
      body: undefined,
      setHeader(name, value) { this.headers.set(name, value); },
      end(value) {
        this.writableEnded = true;
        this.body = typeof value === "string" && value ? JSON.parse(value) : value;
      },
    };
  }

  async function callHandler(body, authorization = `Bearer ${token}`) {
    const response = createResponseRecorder();
    await promptWorkbenchHandler({ method: "POST", headers: { authorization }, body }, response);
    return response;
  }

  try {
    const proxyRequests = [];
    let nextProxyText = "";
    let nextProxyStatus = 200;
    let nextProxyPlan = "free";
    let nextProxyExtra = {};
    globalThis.fetch = async (url, init) => {
      assert.equal(String(url), "https://promptscore-proxy.vercel.app/api/rewrite");
      const request = JSON.parse(init.body);
      proxyRequests.push(request);
      if (request.source === "website_vibecoding") {
        const timestamp = init.headers["X-Opten-Website-Timestamp"];
        const signature = init.headers["X-Opten-Website-Signature"];
        const promptHash = createHash("sha256").update(request.vibecoding_original, "utf8").digest("hex");
        const expectedSignature = createHmac("sha256", testJwtSecret)
          .update(`${timestamp}\n${request.model_name}\n${promptHash}`, "utf8")
          .digest("hex");
        assert.equal(signature, expectedSignature, "website Vibe Coding request must be server-signed");
      }
      return new Response(JSON.stringify({
        content: [{ type: "text", text: nextProxyText }],
        remaining: 2,
        limit: 300,
        plan: nextProxyPlan,
        ...nextProxyExtra,
      }), { status: nextProxyStatus, headers: { "Content-Type": "application/json" } });
    };

    nextProxyText = "Создай лендинг для сервиса доставки.";
    const cleaned = await callHandler({
      action: "improve",
      prompt: "Слушай, ну сделай мне, пожалуйста, лендинг для сервиса доставки, короче.",
      model: "codex",
      images: [{ data: "YWJj", mediaType: "image/jpeg" }],
    });
    assert.equal(cleaned.statusCode, 200);
    assert.equal(cleaned.body.result.prompt, nextProxyText);
    assert.equal(proxyRequests[0].model_name, "_coding-codex");
    assert.equal(proxyRequests[0].source, "website_vibecoding");
    assert.equal(typeof proxyRequests[0].messages[0].content, "string", "unreferenced image bytes must not reach the coding model");
    assert.match(proxyRequests[0].system_prompt, /closed-world editing task/i);

    const screenshotPrompt = "По приложенному скриншоту выровняй кнопку с полем ввода, больше ничего не меняй.";
    nextProxyStatus = 422;
    nextProxyExtra = { error: "no_improvement", reason: "introduced_requirement", usage_released: true, remaining: 3 };
    const requestCountBeforeGuard = proxyRequests.length;
    const guarded = await callHandler({
      action: "improve",
      prompt: screenshotPrompt,
      model: "claude",
      images: [{ data: "YWJj", mediaType: "image/jpeg" }],
    });
    assert.equal(guarded.statusCode, 422);
    assert.equal(guarded.body.error, "no_improvement");
    assert.equal(guarded.body.usage_released, true, "rejected provider output must restore the credit");
    assert.equal(proxyRequests.length, requestCountBeforeGuard + 1, "refundable no-improvement must never be retried and billed again");
    assert.equal(proxyRequests[1].model_name, "_coding-claude");
    assert.ok(Array.isArray(proxyRequests[1].messages[0].content), "explicit screenshot references must keep the attachment");
    assert.equal(proxyRequests[1].messages[0].content.some((item) => item.type === "image"), true);
    nextProxyStatus = 200;
    nextProxyExtra = {};

    for (const [publicModel, internalModel] of [["codex", "_coding-codex"], ["claude", "_coding-claude"], ["gemini", "_coding-gemini"]]) {
      nextProxyText = "Create a landing page for a delivery service.";
      const response = await callHandler({ action: "improve", prompt: "Hey, please create a landing page for a delivery service.", model: publicModel, images: [] });
      assert.equal(response.statusCode, 200);
      assert.equal(proxyRequests.at(-1).model_name, internalModel);
    }

    nextProxyPlan = "pro";
    nextProxyText = "Create a landing page for a delivery service.";
    const proSuccess = await callHandler({ action: "improve", prompt: "Hey, please create a landing page for a delivery service.", model: "codex", images: [] });
    assert.equal(proSuccess.statusCode, 200);
    assert.equal(proSuccess.body.plan, "pro");
    assert.equal(proSuccess.body.tier, "pro");

    nextProxyStatus = 429;
    nextProxyPlan = "free";
    const exhaustedFree = await callHandler({ action: "improve", prompt: "Create a landing page for a delivery service.", model: "codex", images: [] });
    assert.equal(exhaustedFree.statusCode, 429);
    assert.equal(exhaustedFree.body.error, "pro_limit_reached");
    nextProxyStatus = 200;

    const signedOut = await callHandler({ action: "improve", prompt: "Create a landing page for a delivery service.", model: "codex" }, "");
    assert.equal(signedOut.statusCode, 401);
    assert.equal(signedOut.body.error, "authentication_required");

    const invalidModel = await callHandler({ action: "improve", prompt: "Create a landing page for a delivery service.", model: "unknown" });
    assert.equal(invalidModel.statusCode, 400);
    assert.equal(invalidModel.body.error, "invalid_model");
  } finally {
    globalThis.fetch = previousFetch;
    if (previousJwtSecret === undefined) delete process.env.SUPABASE_JWT_SECRET;
    else process.env.SUPABASE_JWT_SECRET = previousJwtSecret;
  }

  console.log(`verify-prompt-workbench-vibecoding: ok (${fixtures.length} golden cases)`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
