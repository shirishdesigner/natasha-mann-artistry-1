import { Link } from "@tanstack/react-router";
import bridalFeature from "@/assets/bridal-feature.jpg";
import { Reveal } from "./Reveal";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function BridalFeature() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.2);

  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-0">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-0 lg:px-12">
        <div className="lg:py-40 lg:pr-16">
          <Reveal>
            <p className="eyebrow text-champagne">Your Day. Your Beauty.</p>
            <h2 className="mt-7 text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-[3.5rem]">
              Bridal Beauty,
              <br />
              Designed Around You.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="rule-champagne mt-10 w-28" />
            <p className="mt-10 max-w-md text-base leading-[1.9] font-light text-ivory/60">
              From the first consultation to the final touch before you walk down
              the aisle, Natasha builds a bridal look that belongs entirely to you
              — refined, long-wearing, and photograph-ready. Skin tone, features,
              outfit, and the mood of your day all shape the artistry, so you feel
              confident, comfortable, and unmistakably yourself.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <Link
              to="/contact"
              className="sweep mt-12 inline-block border border-champagne/70 px-9 py-4 text-[0.66rem] font-medium tracking-[0.24em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink"
            >
              Book Bridal Consultation
            </Link>
          </Reveal>
        </div>

        <div ref={ref} className="relative lg:-mr-12 xl:-mr-24">
          <div className={cn("image-mask overflow-hidden", shown && "image-mask-in")}>
            <img
              src={bridalFeature}
              alt="Bride with an intricate braided updo photographed in candlelight"
              width={1808}
              height={1200}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-4/5 w-full object-cover object-[70%_center] lg:aspect-3/4"
            />
          </div>
          <span className="absolute top-10 -left-6 hidden h-32 w-px bg-champagne/50 lg:block" />
        </div>
      </div>
    </section>
  );
}
