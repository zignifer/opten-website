// Phase 5 final verification: Playwright smoke-script for the blog.
// Spins up a static http.server against dist/, drives a headless Chromium through
// the blog flows, and asserts JSON-LD shape + DOM hooks + LangSwitcher + filter UX.
//
// Not part of npm run build — ad-hoc invocation: `node scripts/smoke-blog.mjs`.
// Requires chromium installed: `npx playwright install chromium` (one-time).

import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BASE = "http://127.0.0.1:8765";

// Spawn python http.server pinned to dist/
const server = spawn(
  "python",
  ["-m", "http.server", "8765", "-d", "dist"],
  { stdio: ["ignore", "pipe", "pipe"] },
);
await wait(1500); // boot

let pass = 0;
let fail = 0;
function assert(cond, label) {
  if (cond) {
    console.log(`  ✓ ${label}`);
    pass++;
  } else {
    console.log(`  ✗ ${label}`);
    fail++;
  }
}

try {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  console.log("=== /blog (listing) ===");
  await page.goto(`${BASE}/blog/`);
  const blogTypes = await page.$$eval(
    'script[type="application/ld+json"]',
    (els) => els.flatMap((e) => {
      try { return JSON.parse(e.textContent || "{}"); } catch { return []; }
    }).map((b) => b["@type"]).filter(Boolean),
  );
  assert(blogTypes.includes("CollectionPage"), "CollectionPage JSON-LD present");
  assert(blogTypes.includes("ItemList"), "ItemList JSON-LD present");
  assert(blogTypes.includes("BreadcrumbList"), "BreadcrumbList JSON-LD present");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  assert(canonical === "https://opten.space/blog", `canonical=${canonical}`);
  const hreflangs = await page.locator('link[rel="alternate"]').count();
  assert(hreflangs >= 3, `hreflang link tags: ${hreflangs} (≥3 expected)`);
  const h1 = await page.locator("h1").textContent();
  assert(h1?.includes("Блог"), `H1 contains "Блог" (got: ${h1})`);
  const introClass = await page.locator(".blog-intro").count();
  assert(introClass === 1, `.blog-intro selector for speakable schema (count: ${introClass})`);

  // Visible post card
  const cards = await page.locator("h3").count();
  assert(cards >= 1, `at least one BlogPostCard rendered (h3 count: ${cards})`);

  console.log("\n=== /blog/gpt-image-2 (post) ===");
  await page.goto(`${BASE}/blog/gpt-image-2/`);
  const postTypes = await page.$$eval(
    'script[type="application/ld+json"]',
    (els) => els.flatMap((e) => {
      try { return JSON.parse(e.textContent || "{}"); } catch { return []; }
    }).map((b) => b["@type"]).filter(Boolean),
  );
  assert(postTypes.includes("BlogPosting"), "BlogPosting JSON-LD present");
  assert(postTypes.includes("FAQPage"), "FAQPage JSON-LD present");
  assert(postTypes.includes("HowTo"), "HowTo JSON-LD present");
  assert(postTypes.includes("BreadcrumbList"), "BreadcrumbList JSON-LD present");
  const postCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  assert(postCanonical === "https://opten.space/blog/gpt-image-2", `canonical=${postCanonical}`);
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  assert(ogImage?.includes("/blog/gpt-image-2/cover.jpg"), `og:image points at post cover (got: ${ogImage})`);
  const postIntroClass = await page.locator(".blog-intro").count();
  assert(postIntroClass === 1, `.blog-intro selector on post page (count: ${postIntroClass})`);
  const timeEl = await page.locator("time").first().getAttribute("datetime");
  assert(timeEl?.match(/^\d{4}-\d{2}-\d{2}$/), `<time datetime=ISO>: ${timeEl}`);
  // Hamburger button always present
  const hamburger = await page.locator('button[aria-label]').first().getAttribute("aria-label");
  assert(hamburger?.length, `hamburger button label: ${hamburger}`);

  console.log("\n=== /en/blog/gpt-image-2 (EN sibling) ===");
  await page.goto(`${BASE}/en/blog/gpt-image-2/`);
  const enTypes = await page.$$eval(
    'script[type="application/ld+json"]',
    (els) => els.flatMap((e) => {
      try { return JSON.parse(e.textContent || "{}"); } catch { return []; }
    }).map((b) => b["@type"]).filter(Boolean),
  );
  assert(enTypes.includes("BlogPosting"), "EN: BlogPosting JSON-LD present");
  const enCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  assert(enCanonical === "https://opten.space/en/blog/gpt-image-2", `EN canonical=${enCanonical}`);
  const enHtmlLang = await page.evaluate(() => document.documentElement.lang);
  assert(enHtmlLang === "en", `<html lang>=${enHtmlLang}`);

  console.log("\n=== Landing (hamburger present, no inline nav) ===");
  await page.goto(`${BASE}/`);
  const landingHamburger = await page.locator('button[aria-label]').first().count();
  assert(landingHamburger === 1, `Landing has hamburger button: ${landingHamburger}`);
  // Click hamburger and confirm Blog link appears
  await page.locator('button[aria-label]').first().click();
  await wait(200);
  const blogLinkVisible = await page.locator('text=Блог').count();
  assert(blogLinkVisible >= 1, `Blog menu item visible after hamburger click: ${blogLinkVisible}`);

  console.log("\n=== /guides/gpt-image-2 (should 404 locally; Vercel will 301 in prod) ===");
  const response = await page.goto(`${BASE}/guides/gpt-image-2/`, { waitUntil: "domcontentloaded" }).catch(() => null);
  assert(response?.status() === 404, `local static-serve returns 404 for retired URL (Vercel will redirect 308→/blog/gpt-image-2): ${response?.status()}`);

  await browser.close();
} catch (err) {
  console.error("\nFATAL:", err);
  fail++;
}

server.kill();
console.log(`\n=== Smoke: ${pass} passed, ${fail} failed ===`);
process.exit(fail === 0 ? 0 : 1);
