import { Instagram } from "lucide-react";
import g3 from "@/assets/gallery-3.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";
import g2 from "@/assets/gallery-2.jpg";
import { BRAND } from "./brand";
import { Reveal, SectionHeading } from "./Reveal";

const FEED = [
  { src: g6, alt: "Bride having blush applied while getting ready" },
  { src: g5, alt: "Close-up of champagne shimmer eye makeup" },
  { src: g2, alt: "Bridal braided updo with delicate white flowers" },
  { src: g3, alt: "Soft glam beauty portrait with bronze eye makeup" },
  { src: g7, alt: "Makeup brushes and palettes on ivory silk" },
  { src: g8, alt: "Romantic waves with dewy natural makeup" },
];

export function SocialGallery() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Instagram"
          title="Follow the Artistry"
          subtitle="Behind the looks, the beauty, and the moments."
        />

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-20 lg:grid-cols-6 lg:gap-4">
          {FEED.map((item, i) => (
            <Reveal key={item.src + i} delay={(i % 6) * 70} className="group">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="relative block overflow-hidden bg-ink"
                aria-label={`Open Instagram: ${item.alt}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="aspect-square w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-700 group-hover:bg-ink/45">
                  <Instagram
                    className="h-6 w-6 text-champagne opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    strokeWidth={1.1}
                    aria-hidden
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} className="mt-14 text-center">
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-3 text-[0.66rem] font-medium tracking-[0.24em] uppercase transition-colors duration-500 hover:text-champagne"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.2} aria-hidden />
            Follow {BRAND.instagramHandle}
            <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-14" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
