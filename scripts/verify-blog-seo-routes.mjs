// Blog route HTML/schema gate.
// Usage after `npm run build`: node scripts/verify-blog-seo-routes.mjs <slug> [<slug>...]

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_ORIGIN = "https://opten.space";

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error("✗ usage: node scripts/verify-blog-seo-routes.mjs <slug> [<slug>...]");
  process.exit(1);
}

let failureCount = 0;

function fail(message) {
  console.error(`✗ ${message}`);
  failureCount += 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function routeHtmlPath(slug, lang) {
  return lang === "ru"
    ? resolve(DIST, "blog", slug, "index.html")
    : resolve(DIST, "en", "blog", slug, "index.html");
}

function jsonLdBlocks(html) {
  const blocks = [];
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(regex)) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`invalid JSON-LD block: ${error.message}`);
    }
  }
  return blocks.flatMap((block) => {
    if (Array.isArray(block)) return block;
    if (Array.isArray(block?.["@graph"])) return block["@graph"];
    return [block];
  });
}

function hasSchemaType(blocks, type) {
  return blocks.some((block) => block?.["@type"] === type || (Array.isArray(block?.["@type"]) && block["@type"].includes(type)));
}

function countPattern(html, regex) {
  return (html.match(regex) ?? []).length;
}

function hasTagWithAttrs(html, tagName, attrs) {
  const tagRegex = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return [...html.matchAll(tagRegex)].some(([tag]) =>
    Object.entries(attrs).every(([name, value]) => {
      const attrRegex = new RegExp(`\\b${name}="${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "i");
      return attrRegex.test(tag);
    }),
  );
}

function verifyRoute(slug, lang) {
  const path = routeHtmlPath(slug, lang);
  const label = `${lang === "ru" ? "/blog" : "/en/blog"}/${slug}`;
  if (!existsSync(path)) {
    fail(`${label}: missing prerendered HTML at ${path}`);
    return;
  }

  const html = readFileSync(path, "utf8");
  const canonical = lang === "ru" ? `${SITE_ORIGIN}/blog/${slug}` : `${SITE_ORIGIN}/en/blog/${slug}`;
  const ruHref = `${SITE_ORIGIN}/blog/${slug}`;
  const enHref = `${SITE_ORIGIN}/en/blog/${slug}`;

  if (html.includes(`<html lang="${lang}"`)) pass(`${label}: html lang=${lang}`);
  else fail(`${label}: missing baked <html lang="${lang}">`);

  if (html.includes(`<link rel="canonical" href="${canonical}"`)) pass(`${label}: canonical`);
  else fail(`${label}: missing canonical ${canonical}`);

  if (
    hasTagWithAttrs(html, "link", { rel: "alternate", hreflang: "ru", href: ruHref }) &&
    hasTagWithAttrs(html, "link", { rel: "alternate", hreflang: "en", href: enHref }) &&
    hasTagWithAttrs(html, "link", { rel: "alternate", hreflang: "x-default", href: ruHref })
  ) {
    pass(`${label}: reciprocal hreflang`);
  } else {
    fail(`${label}: missing reciprocal hreflang triplet`);
  }

  if (html.includes(`property="og:image" content="${SITE_ORIGIN}/blog/${slug}/cover.jpg"`)) pass(`${label}: og:image cover`);
  else fail(`${label}: og:image must point at /blog/${slug}/cover.jpg`);

  if (html.includes('class="blog-intro')) pass(`${label}: .blog-intro present`);
  else fail(`${label}: missing .blog-intro`);

  if (/<time\b[^>]*\bdate(?:t|T)ime="\d{4}-\d{2}-\d{2}"/.test(html)) pass(`${label}: visible time`);
  else fail(`${label}: missing visible <time datetime=ISO>`);

  if (countPattern(html, /<img\b/g) >= 5) pass(`${label}: visible images`);
  else fail(`${label}: expected cover + inline images in rendered HTML`);

  const blocks = jsonLdBlocks(html);
  for (const type of ["Organization", "BlogPosting", "WebPage", "BreadcrumbList", "FAQPage", "HowTo"]) {
    if (hasSchemaType(blocks, type)) pass(`${label}: ${type} JSON-LD`);
    else fail(`${label}: missing ${type} JSON-LD`);
  }

  const blogPosting = blocks.find((block) => block?.["@type"] === "BlogPosting");
  if (blogPosting?.image?.url === `${SITE_ORIGIN}/blog/${slug}/cover.jpg`) pass(`${label}: BlogPosting image cover`);
  else fail(`${label}: BlogPosting.image must point at cover`);
}

for (const slug of slugs) {
  console.log(`\n=== Blog SEO route gate: ${slug} ===`);
  verifyRoute(slug, "ru");
  verifyRoute(slug, "en");
}

if (failureCount > 0) {
  console.error(`\nBlog SEO route gate failed: ${failureCount} issue(s).`);
  process.exit(1);
}

console.log("\nBlog SEO route gate passed.");
