import { useState } from "react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";
import { Reveal, SectionHeading } from "./Reveal";
import { Lightbox } from "./Lightbox";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Bridal", "Makeup", "Hairstyle", "Glam"] as const;
type Filter = (typeof FILTERS)[number];

type Shot = {
  src: string;
  alt: string;
  tags: Exclude<Filter, "All">[];
  span: string;
};

export const SHOTS: Shot[] = [
  {
    src: g1,
    alt: "Bride holding white roses with romantic bridal makeup",
    tags: ["Bridal", "Makeup"],
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: g2,
    alt: "Intricate bridal braided updo with small white flowers",
    tags: ["Bridal", "Hairstyle"],
    span: "sm:col-span-2",
  },
  {
    src: g3,
    alt: "Soft glam beauty portrait with bronze champagne eye makeup",
    tags: ["Makeup", "Glam"],
    span: "",
  },
  {
    src: g5,
    alt: "Macro detail of champagne shimmer eyeshadow and lashes",
    tags: ["Makeup"],
    span: "",
  },
  {
    src: g4,
    alt: "Evening glam look with sleek high ponytail and black gown",
    tags: ["Glam", "Hairstyle"],
    span: "sm:row-span-2",
  },
  {
    src: g6,
    alt: "Bride having blush applied while getting ready",
    tags: ["Bridal", "Makeup"],
    span: "sm:col-span-2",
  },
  {
    src: g8,
    alt: "Soft romantic waves with dewy natural makeup",
    tags: ["Glam", "Hairstyle"],
    span: "",
  },
  {
    src: g7,
    alt: "Champagne toned makeup brushes and palettes on ivory silk",
    tags: ["Makeup"],
    span: "sm:col-span-3",
  },
];

export function Portfolio({
  activeIndex,
  onActiveIndexChange,
  shareHref,
}: {
  activeIndex: number | null;
  onActiveIndexChange: (next: number | null) => void;
  shareHref?: ((index: number) => string) | undefined;
}) {
  const [filter, setFilter] = useState<Filter>("All");

  const shots =
    filter === "All"
      ? SHOTS.map((shot, index) => ({ shot, index }))
      : SHOTS.map((shot, index) => ({ shot, index })).filter(({ shot }) =>
          shot.tags.includes(filter as Exclude<Filter, "All">),
        );

  return (
    <section id="portfolio" className="bg-background py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Selected Work"
          title="Portfolio"
          subtitle="A glimpse of the artistry — open any photo to view it full screen and copy a shareable link."
        />

        <Reveal delay={100}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "relative pb-2 text-[0.63rem] font-medium tracking-[0.26em] uppercase transition-colors duration-500",
                  filter === f
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-champagne transition-transform duration-500",
                    filter === f ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid auto-rows-[240px] grid-flow-row-dense grid-cols-1 gap-4 sm:auto-rows-[210px] sm:grid-cols-4 lg:auto-rows-[250px] lg:gap-5">
          {shots.map(({ shot, index }, i) => (
            <Reveal
              key={shot.src}
              delay={(i % 4) * 80}
              className={cn("group h-full", shot.span)}
            >
              <button
                type="button"
                onClick={() => onActiveIndexChange(index)}
                className="relative h-full w-full cursor-zoom-in overflow-hidden bg-ink"
                aria-label={`View image: ${shot.alt}`}
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/35" />
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-5 text-left text-[0.58rem] tracking-[0.28em] text-ivory uppercase opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                  {shot.tags.join(" · ")}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        images={SHOTS.map((shot) => ({ src: shot.src, alt: shot.alt }))}
        index={activeIndex}
        onClose={() => onActiveIndexChange(null)}
        onIndexChange={onActiveIndexChange}
        shareHref={shareHref}
      />
    </section>
  );
}
