// Phase 5 B-08: programmatic blog cover generator.
// Renders 1600×900 (16:9, ≥1200px for Rich Results carousel) gradient-blob covers
// in the opten-design system (dark #011417 base + #9cfb51 accent + soft cyan-teal blobs).
// SVG → sharp → JPEG (og:image fallback) + WebP @1x and @2x (responsive <picture>).
//
// Runs ad-hoc: `node scripts/gen-blog-covers.mjs`. Not wired into npm run build —
// regenerate covers only when slug list or visual spec changes.
//
// Output: public/blog/<slug>/cover.{jpg,webp,@2x.webp}.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Cover catalog: slug → blob accent palette + composition.
// Keep palette inside the opten-design gamut: deep teal-black bg, cyan-green mid,
// lime-green (#9cfb51) accent. No text baked into the image (multilingual reuse).
const COVERS = [
  {
    slug: "gpt-image-2",
    palette: {
      bgFrom: "#011417",
      bgTo:   "#02201f",
      blobA:  "#1b6b58", // teal core
      blobB:  "#0a3b3a", // teal halo
      accent: "#9cfb51", // lime streak
    },
    // Soft asymmetric composition: large teal blob upper-right, lime micro-streak lower-left.
    layout: "upper-right",
  },
];

const W = 1600;
const H = 900;

function svg({ palette, layout }) {
  const blob1 = layout === "upper-right"
    ? { cx: 1280, cy: 200, r: 720 }
    : { cx: 320, cy: 700, r: 720 };
  const blob2 = layout === "upper-right"
    ? { cx: 1450, cy: 360, r: 380 }
    : { cx: 150, cy: 540, r: 380 };
  const accent = layout === "upper-right"
    ? { cx: 280, cy: 740, r: 220 }
    : { cx: 1320, cy: 160, r: 220 };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="${palette.bgTo}" />
      <stop offset="100%" stop-color="${palette.bgFrom}" />
    </radialGradient>
    <radialGradient id="blobA" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="${palette.blobA}" stop-opacity="0.85" />
      <stop offset="60%" stop-color="${palette.blobB}" stop-opacity="0.45" />
      <stop offset="100%" stop-color="${palette.bgFrom}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="blobB" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="${palette.blobA}" stop-opacity="0.65" />
      <stop offset="100%" stop-color="${palette.bgFrom}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="accent" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="${palette.accent}" stop-opacity="0.55" />
      <stop offset="60%" stop-color="${palette.accent}" stop-opacity="0.10" />
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0" />
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1
                                            0 0 0 0 1
                                            0 0 0 0 1
                                            0 0 0 0.04 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${blob1.cx}" cy="${blob1.cy}" r="${blob1.r}" fill="url(#blobA)"/>
  <circle cx="${blob2.cx}" cy="${blob2.cy}" r="${blob2.r}" fill="url(#blobB)"/>
  <circle cx="${accent.cx}" cy="${accent.cy}" r="${accent.r}" fill="url(#accent)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.6"/>
</svg>`;
}

async function renderCover(cover) {
  const outDir = resolve(ROOT, "public", "blog", cover.slug);
  await mkdir(outDir, { recursive: true });

  const buf = Buffer.from(svg(cover));
  const base = sharp(buf, { density: 96 });

  // 1× variants @ 1600×900
  await base
    .clone()
    .jpeg({ quality: 86, mozjpeg: true, progressive: true })
    .toFile(resolve(outDir, "cover.jpg"));
  await base
    .clone()
    .webp({ quality: 82 })
    .toFile(resolve(outDir, "cover.webp"));

  // 2× variant @ 3200×1800 — sharper on retina without bloating @1x asset
  const buf2x = Buffer.from(svg(cover));
  await sharp(buf2x, { density: 192 })
    .resize(W * 2, H * 2, { fit: "cover" })
    .webp({ quality: 78 })
    .toFile(resolve(outDir, "cover@2x.webp"));

  console.log(`✓ ${cover.slug}: cover.jpg + cover.webp + cover@2x.webp → public/blog/${cover.slug}/`);
}

for (const cover of COVERS) {
  await renderCover(cover);
}
