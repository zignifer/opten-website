import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

function read(file) {
  return readFileSync(join(root, file), "utf8");
}

const requiredFiles = [
  "src/content/space/privateCourse.ts",
  "src/app/pages/space/PrivateCoursePage.tsx",
  "api/kinescope-course-token.ts",
  "api/kinescope-course-auth.ts",
  "api/_shared/kinescopeCourse.ts",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing Kinescope course artifact: ${file}`);
}

const content = read("src/content/space/privateCourse.ts");
const serverCourseContent = read("api/_shared/kinescopeCourse.ts");

const expectedKinescopeLessons = [
  ["lesson-1-prompting", "e941e14d-c5bf-40fc-abe5-a41e247777cf"],
  ["lesson-2-ai-services", "c3b06c01-19dd-4a3c-8218-7a216a2ebd67"],
  ["lesson-3-logo-generation", "947a68e0-b570-4a9d-ad0c-ee55cc86b440"],
  ["lesson-4-photo-generation", "1fe7af11-23e5-46cf-bedf-e6bb41c2d3b3"],
  ["lesson-5-references", "02bcf12a-ab7c-49d4-96cb-441fafb898b9"],
  ["lesson-6-image-editing", "a6294ef7-c6e6-4744-8b2e-60967fa7bfd7"],
  ["lesson-7-ai-video", "18f00246-366f-4f43-a67a-a1b3ead807c0"],
  ["lesson-8-frames", "43d3328a-dc4d-4e60-a269-aa1eebf7e2b4"],
  ["lesson-9-storytelling", "6f742d8c-cf18-4b9d-97b7-b3e6f63aa696"],
  ["lesson-10-prompt-library", "3675dfeb-55da-47c3-aac8-35b0556dbd84"],
];

assert.match(content, /e941e14d-c5bf-40fc-abe5-a41e247777cf/, "Private course must use the uploaded Kinescope video id");
assert.match(content, /ai-content-marketing-2026/, "Private course must expose a stable hidden course slug");
assert.match(content, /lesson-1-prompting/, "Private course must expose the first lesson slug");
for (const [lessonSlug, videoId] of expectedKinescopeLessons) {
  assert.match(content, new RegExp(lessonSlug), `Private course content must include ${lessonSlug}`);
  assert.match(content, new RegExp(videoId), `Private course content must include Kinescope video ${videoId}`);
  assert.match(serverCourseContent, new RegExp(lessonSlug), `Server Kinescope whitelist must include ${lessonSlug}`);
  assert.match(serverCourseContent, new RegExp(videoId), `Server Kinescope whitelist must include Kinescope video ${videoId}`);
}
assert.match(content, /chatgpt\.com\/g\/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator/, "Lesson materials must link the ChatGPT prompt generator");
assert.match(content, /\/dashboard\/download-skill/, "Lesson materials must link the Pro skill download route");
assert.match(content, /https:\/\/syntx\.ai\/welcome\/GlUETIt6/, "Lesson materials must link Syntx");
assert.match(content, /https:\/\/higgsfield\.ai\//, "Lesson materials must link Higgsfield");
assert.match(content, /https:\/\/disk\.yandex\.ru\/d\/HaU7LdU850QLVw/, "Every private course lesson must expose the current AI tools 2026 material");
assert.match(content, /provider:\s*"kinescope"/, "Private lesson must use the Kinescope video provider");

const learn = read("src/content/space/learn.ts");
assert.match(learn, /provider:\s*"youtube"\s*\|\s*"local"\s*\|\s*"kinescope"/, "Learn provider type must include Kinescope");

const components = read("src/app/components/space/learn/LearnComponents.tsx");
assert.match(components, /provider\.provider === "kinescope"/, "Learn player must branch for Kinescope videos");
assert.match(components, /\/api\/kinescope-course-token/, "Learn player must request Kinescope embed URLs through the server");
assert.doesNotMatch(components, /kine\.txt|KINESCOPE_API|Bearer\s+[0-9a-f-]{36}/i, "Client code must not expose Kinescope API keys");
const kinescopeFetchIndex = components.indexOf('fetch("/api/kinescope-course-token"');
assert.notEqual(kinescopeFetchIndex, -1, "Learn player must keep Kinescope token fetch in source");
const kinescopeFetchEffectStart = components.lastIndexOf("useEffect(() => {", kinescopeFetchIndex);
const kinescopeFetchDepsStart = components.indexOf("}, [", kinescopeFetchIndex);
const kinescopeFetchEffectEnd = components.indexOf("]);", kinescopeFetchDepsStart);
assert.ok(kinescopeFetchEffectStart >= 0 && kinescopeFetchDepsStart > kinescopeFetchIndex && kinescopeFetchEffectEnd > kinescopeFetchDepsStart, "Learn player must keep Kinescope token fetch inside a React effect");
const kinescopeFetchEffectBody = components.slice(kinescopeFetchEffectStart, kinescopeFetchDepsStart);
const kinescopeFetchEffectDeps = components.slice(kinescopeFetchDepsStart, kinescopeFetchEffectEnd);
assert.doesNotMatch(kinescopeFetchEffectBody, /if \([^\n]*\bkinescopeLoading\b/, "Kinescope token fetch must not use loading state as an effect guard because it can skip the replacement request");
assert.doesNotMatch(kinescopeFetchEffectDeps, /\bkinescopeLoading\b/, "Kinescope token fetch must not depend on loading state because it cancels the in-flight request");

const tokenApi = read("api/kinescope-course-token.ts");
const serverAuth = read("api/_shared/optenServerAuth.ts");
const serverCourse = serverCourseContent;
assert.match(tokenApi, /KINESCOPE_AUTH_JWT_SECRET/, "Token API must sign playback tokens with a server env secret");
assert.match(tokenApi, /hasLiveProSubscription/, "Token API must enforce Pro access server-side");
assert.match(serverAuth, /subscriptions/, "Server auth helper must query subscriptions for Pro access");
assert.match(tokenApi, /buildKinescopeEmbedUrl/, "Token API must return Kinescope embed URLs through the shared builder");
assert.match(serverCourse, /drmauthtoken/, "Kinescope embed URL builder must attach the DRM auth token");

const authApi = read("api/kinescope-course-auth.ts");
assert.match(authApi, /KINESCOPE_AUTH_JWT_SECRET/, "Kinescope auth callback must verify the same server env secret");
assert.match(authApi, /403/, "Kinescope auth callback must be able to deny playback");
assert.match(authApi, /jwtVerify/, "Kinescope auth callback must validate signed playback JWTs");

const main = read("src/main.tsx");
assert.match(main, /\/learn\/courses\/:courseSlug"/, "Main router must register hidden course routes");
assert.match(main, /\/learn\/courses\/:courseSlug\/:lessonSlug"/, "Main router must register hidden course lesson routes");
assert.ok(main.indexOf('/learn/courses/:courseSlug') < main.indexOf('/learn/:lessonSlug'), "Course routes must be registered before generic /learn/:lessonSlug");

const vercel = read("vercel.json");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"destination": "\/spa\.html"/, "Hidden course routes must SPA-rewrite to /spa.html");
assert.match(vercel, /"source": "\/learn\/courses\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "Hidden course routes must ship noindex headers");

const agents = read("AGENTS.md");
assert.match(agents, /Kinescope/i, "AGENTS.md must document the Kinescope course integration");
assert.match(agents, /KINESCOPE_AUTH_JWT_SECRET/, "AGENTS.md must document the Kinescope playback env secret");

console.log("Kinescope private course integration artifacts are present.");
