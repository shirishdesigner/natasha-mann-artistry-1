import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroBride from "@/assets/hero-bride.jpg";
import { cn } from "@/lib/utils";

export function Hero() {
  const [ready, setReady] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => setOffset(Math.min(window.scrollY * 0.16, 120));
    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src={heroBride}
          alt="Bride with soft glam bridal makeup and a sleek chignon"
          width={1408}
          height={1808}
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-[68%_center] transition-[opacity,transform] duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform sm:object-[75%_center]",
            ready ? "opacity-100" : "opacity-0",
          )}
          style={{
            transform: `translate3d(0, ${offset * 0.35}px, 0) scale(${ready ? 1 : 1.08})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30 sm:bg-gradient-to-r sm:from-ink sm:via-ink/75 sm:to-transparent" />
      </div>


      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-6 pt-32 pb-28 sm:justify-center lg:px-12">
        <div className="max-w-xl">
          <p
            className={cn(
              "eyebrow text-champagne transition-all delay-300 duration-1000",
              ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
            )}
          >
            Brampton West · Ontario
          </p>

          <h1
            className={cn(
              "mt-7 font-display text-[2.75rem] leading-[0.95] text-ivory transition-all delay-[450ms] duration-1000 sm:text-6xl lg:text-[5.25rem]",
              ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            Natasha Mann
            <span className="mt-2 block text-champagne">Artistry</span>
          </h1>

          <div
            className={cn(
              "mt-8 flex items-center gap-4 transition-all delay-[650ms] duration-1000",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="h-px w-12 bg-champagne/70" />
            <p className="script text-2xl text-ivory/90 sm:text-3xl">
              Timeless Beauty. Every Occasion.
            </p>
          </div>

          <p
            className={cn(
              "mt-8 max-w-md text-sm leading-relaxed font-light text-ivory/65 transition-all delay-[800ms] duration-1000 sm:text-base",
              ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
            )}
          >
            Professional makeup artistry and hairstyling designed to make you feel
            confident, radiant, and effortlessly beautiful.
          </p>

          <div
            className={cn(
              "mt-11 flex flex-col gap-4 transition-all delay-[950ms] duration-1000 sm:flex-row sm:items-center",
              ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
            )}
          >
            <Link
              to="/contact"
              className="sweep bg-champagne px-9 py-4 text-center text-[0.68rem] font-medium tracking-[0.24em] text-ink uppercase transition-colors duration-500 hover:bg-blush"
            >
              Book Your Appointment
            </Link>
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-3 px-2 py-4 text-[0.68rem] font-medium tracking-[0.24em] text-ivory/80 uppercase transition-colors duration-500 hover:text-champagne"
            >
              Explore Services
              <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="text-[0.55rem] tracking-[0.32em] text-ivory/45 uppercase">
          Scroll
        </span>
        <span className="scroll-hint block h-14 w-px bg-champagne/70" />
      </div>
    </section>
  );
}
