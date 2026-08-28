import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Cta = {
  label: string;
  to: "/" | "/about" | "/services" | "/portfolio" | "/testimonials" | "/contact";
  search?: { service?: string };
};



export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  imagePosition = "center",
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}) {

  const [ready, setReady] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!image) return;
    const t = window.setTimeout(() => setReady(true), 100);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => setOffset(Math.min(window.scrollY * 0.18, 90));
    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [image]);

  return (
    <section className="relative overflow-hidden bg-ink pt-36 pb-20 sm:pt-44 sm:pb-28">
      {image ? (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={imageAlt ?? ""}
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
              ready ? "opacity-70" : "opacity-0",
            )}
            style={{
              objectPosition: imagePosition,
              transform: `translate3d(0, ${offset}px, 0) scale(${ready ? 1 : 1.09})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40 sm:bg-gradient-to-r sm:from-ink sm:via-ink/75 sm:to-ink/25" />
        </div>
      ) : null}


      <div
        className={cn(
          "glow-champagne pointer-events-none absolute inset-0",
          image && "opacity-60",
        )}
        aria-hidden
      />


      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-champagne">{eyebrow}</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-[4rem]">
            {title}
          </h1>
        </Reveal>
        {subtitle ? (
          <Reveal delay={120}>
            <div className="rule-champagne mt-9 w-24" />
            <p className="mt-9 max-w-xl text-base leading-[1.9] font-light text-ivory/60">
              {subtitle}
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={220}>
          <div className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to={primaryCta?.to ?? "/contact"}
              search={primaryCta?.search as never}
              className="sweep bg-champagne px-9 py-4 text-center text-[0.68rem] font-medium tracking-[0.24em] text-ink uppercase transition-colors duration-500 hover:bg-blush"
            >
              {primaryCta?.label ?? "Book Your Appointment"}
            </Link>
            {secondaryCta ? (
              <Link
                to={secondaryCta.to}
                search={secondaryCta.search as never}
                className="group inline-flex items-center justify-center gap-3 px-2 py-4 text-[0.68rem] font-medium tracking-[0.24em] text-ivory/80 uppercase transition-colors duration-500 hover:text-champagne"
              >
                {secondaryCta.label}
                <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>

    </section>
  );
}
