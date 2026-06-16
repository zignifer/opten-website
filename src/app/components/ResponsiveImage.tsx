import type { ImgHTMLAttributes } from "react";

const GENERATED_BASE = "/generated/responsive";
const SUPPORTED_EXTENSIONS = new Set(["jpg", "jpeg", "png"]);
const DEFAULT_WIDTHS = [480, 800, 1200] as const;

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  widths?: readonly number[];
};

function parsePublicImage(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) return null;

  const queryIndex = src.search(/[?#]/);
  const cleanSrc = queryIndex === -1 ? src : src.slice(0, queryIndex);
  const extIndex = cleanSrc.lastIndexOf(".");
  if (extIndex === -1) return null;

  const extension = cleanSrc.slice(extIndex + 1).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(extension)) return null;

  return {
    stem: cleanSrc.slice(1, extIndex),
  };
}

function buildSrcSet(src: string, widths: readonly number[], format: "avif" | "webp") {
  const parsed = parsePublicImage(src);
  if (!parsed) return "";

  return widths
    .map((width) => `${GENERATED_BASE}/${parsed.stem}-${width}.${format} ${width}w`)
    .join(", ");
}

function buildFallbackSrc(src: string) {
  const hashIndex = src.indexOf("#");
  const withoutHash = hashIndex === -1 ? src : src.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : src.slice(hashIndex);
  const separator = withoutHash.includes("?") ? "&" : "?";

  return `${withoutHash}${separator}responsive-fallback=1${hash}`;
}

export default function ResponsiveImage({
  src,
  widths = DEFAULT_WIDTHS,
  sizes = "100vw",
  decoding = "async",
  onError,
  ...imgProps
}: ResponsiveImageProps) {
  const parsed = parsePublicImage(src);
  if (!parsed) {
    return <img src={src} decoding={decoding} onError={onError} {...imgProps} />;
  }

  const uniqueWidths = [...new Set(widths)].sort((a, b) => a - b);

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(src, uniqueWidths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(src, uniqueWidths, "webp")} sizes={sizes} />
      <img
        src={src}
        decoding={decoding}
        sizes={sizes}
        onError={(event) => {
          const image = event.currentTarget;
          if (image.dataset.generatedFallback !== "true") {
            image.dataset.generatedFallback = "true";
            image.closest("picture")?.querySelectorAll("source").forEach((source) => source.remove());
            image.src = buildFallbackSrc(src);
            return;
          }
          onError?.(event);
        }}
        {...imgProps}
      />
    </picture>
  );
}
