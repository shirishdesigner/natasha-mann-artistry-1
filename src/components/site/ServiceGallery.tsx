import { Link } from "@tanstack/react-router";
import { Expand } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { Lightbox, type LightboxImage } from "./Lightbox";

export function ServiceGallery({
  images,
  serviceTitle,
  activeIndex,
  onActiveIndexChange,
  shareHref,
}: {
  images: LightboxImage[];
  serviceTitle: string;
  activeIndex: number | null;
  onActiveIndexChange: (next: number | null) => void;
  shareHref?: ((index: number) => string) | undefined;
}) {
  return (
    <section className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Selected Work"
          title="The Look, In Practice"
          subtitle={`A closer look at recent ${serviceTitle.toLowerCase()} work — tap any image to view it full screen and copy a shareable link.`}
          align="left"
          tone="dark"
        />

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {images.map((shot, i) => (
            <Reveal
              key={shot.src}
              delay={i * 100}
              className={
                i === 0
                  ? "group relative col-span-2 row-span-2 overflow-hidden"
                  : "group relative overflow-hidden"
              }
            >
              <button
                type="button"
                onClick={() => onActiveIndexChange(i)}
                aria-label={`Open image: ${shot.alt}`}
                className={
                  i === 0
                    ? "relative block h-full min-h-[280px] w-full cursor-zoom-in overflow-hidden bg-ink sm:min-h-[420px]"
                    : "relative block aspect-3/4 w-full cursor-zoom-in overflow-hidden bg-ink"
                }
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-ink/15 transition-opacity duration-700 group-hover:opacity-0" />
                <span className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center bg-ink/70 text-champagne opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Expand className="h-4 w-4" strokeWidth={1.2} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <Link
            to="/portfolio"
            className="mt-12 inline-flex items-center gap-3 text-[0.66rem] font-medium tracking-[0.24em] text-champagne uppercase"
          >
            View Full Portfolio
            <span className="h-px w-8 bg-champagne" />
          </Link>
        </Reveal>
      </div>

      <Lightbox
        images={images}
        index={activeIndex}
        onClose={() => onActiveIndexChange(null)}
        onIndexChange={onActiveIndexChange}
        shareHref={shareHref}
      />
    </section>
  );
}
