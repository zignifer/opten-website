// Phase 2.1 D-05/D-06: Thin wrapper over vite-imagetools@6.2.9 PictureData output.
// Renders <picture><source type="image/webp"><img> from ?as=picture import shape.
// Not yet wired to call sites — plan 02.1-05 wraps App.tsx PNG <img> tags.
import type { Picture as PictureData } from 'vite-imagetools'

interface PictureProps {
  data: PictureData;
  width: number;
  height: number;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

export function Picture({ data, width, height, alt, className, loading, fetchPriority }: PictureProps) {
  return (
    <picture>
      {data.sources.map((source) => (
        <source key={source.type} srcSet={source.srcset} type={source.type} />
      ))}
      <img
        src={data.img.src}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
