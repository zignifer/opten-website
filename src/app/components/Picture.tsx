// Phase 2.1 D-05/D-06: Thin wrapper over vite-imagetools@6.2.9 PictureData output.
// Renders <picture><source type="image/webp"><img> from ?as=picture import shape.
//
// vite-imagetools@6.2.9 actual as=picture data shape (confirmed Wave 0):
//   { sources: { webp: "srcset_string", png?: "srcset_string" }, img: { src, w, h } }
// The sources object is keyed by format name (not an array).
// This differs from the ASSUMED shape (array) in RESEARCH.md A1 — handled here (Rule 1 fix).
//
// SSR: vite-imagetools resolves to the same object shape in SSR builds when public/ exclude
// is overridden. Falls back to <img src={data}> if data is unexpectedly a string.
import type { Picture as PictureData } from 'vite-imagetools'

// Map of format name (as returned by vite-imagetools@6.2.9) to MIME type
const FORMAT_MIME: Record<string, string> = {
  webp: 'image/webp',
  avif: 'image/avif',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

interface PictureProps {
  data: PictureData | string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
}

// Phase 2.2: fetchPriority dropped — React 18.3 emits the camelCase JSX prop as-is in SSR
// markup, then mismatches it on hydration → React #418 + #423 fall through to a full client
// re-render. Re-add as lowercase `fetchpriority` attribute after upgrading to React 19.

export function Picture({ data, width, height, alt, className, loading, sizes }: PictureProps) {
  // Fallback: if data resolves to a plain URL string (unexpected), render <img> directly
  if (typeof data === 'string') {
    return (
      <img
        src={data}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading={loading}
      />
    );
  }

  // vite-imagetools@6.2.9 as=picture shape: sources is a Record<format, srcset_string>
  // e.g. { webp: "/assets/img.webp 1100w", png: "/assets/img.png 1100w" }
  // With multiple sizes (?w=400;1100) the srcset string contains both descriptors.
  const sourcesObj = data.sources as unknown as Record<string, string>;
  const webpSrcset = sourcesObj['webp'];
  const pngSrcset = sourcesObj['png'];

  // Render WebP source first for modern browsers, then PNG fallback in <img>
  // sizes tells the browser which srcset variant to pick — without it, all srcset
  // entries are eligible and the browser uses heuristics that often pick the largest.
  return (
    <picture>
      {webpSrcset && (
        <source srcSet={webpSrcset} type="image/webp" sizes={sizes} />
      )}
      <img
        src={data.img.src}
        srcSet={pngSrcset}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading={loading}
      />
    </picture>
  );
}
