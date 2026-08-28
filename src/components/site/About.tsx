import { Link } from "@tanstack/react-router";
import aboutNatasha from "@/assets/about-natasha.jpg";
import { Reveal } from "./Reveal";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function About() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.25);

  return (
    <section id="about" className="bg-background py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 lg:grid-cols-[0.95fr_1fr] lg:gap-24 lg:px-12">
        <div ref={ref} className="relative">
          <div
            className={cn(
              "image-mask overflow-hidden",
              shown && "image-mask-in",
            )}
          >
            <img
              src={aboutNatasha}
              alt="Natasha Mann, professional makeup artist, holding a makeup brush"
              width={1200}
              height={1504}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
          <span className="absolute -right-4 -bottom-6 hidden h-24 w-px bg-champagne/60 lg:block" />
        </div>

        <div>
          <Reveal>
            <p className="eyebrow text-champagne">The Art of Beauty</p>
            <h2 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.75rem]">
              Beauty,
              <br />
              Personally Crafted.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="rule-champagne mt-10 w-24" />
            <p className="mt-10 max-w-lg text-base leading-[1.9] font-light text-muted-foreground">
              Every face is unique. Every occasion deserves its own look. Natasha
              creates personalized makeup and hairstyling experiences designed
              around your features, your style, and the moment you're celebrating.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <p className="script mt-12 text-4xl text-foreground/85">Natasha Mann</p>
            <p className="mt-3 text-[0.6rem] tracking-[0.34em] text-muted-foreground uppercase">
              Professional Makeup Artist
            </p>

            <Link
              to="/services"
              className="group mt-12 inline-flex items-center gap-4 text-[0.68rem] font-medium tracking-[0.24em] uppercase transition-colors duration-500 hover:text-champagne"
            >
              Meet Natasha
              <span className="h-px w-10 bg-current transition-all duration-500 group-hover:w-16" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
