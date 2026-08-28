import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { BRAND } from "./brand";
import { Reveal } from "./Reveal";

const PARTICLES = [
  { left: "12%", delay: "0s", size: 4 },
  { left: "26%", delay: "1.8s", size: 3 },
  { left: "41%", delay: "3.4s", size: 5 },
  { left: "58%", delay: "0.9s", size: 3 },
  { left: "72%", delay: "2.6s", size: 4 },
  { left: "88%", delay: "4.2s", size: 3 },
];

export function BookingCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 sm:py-36 lg:py-44">
      <div className="glow-champagne pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {PARTICLES.map((p) => (
          <span
            key={p.left}
            className="particle absolute bottom-10 rounded-full bg-champagne"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[900px] px-6 text-center lg:px-12">
        <Reveal>
          <p className="eyebrow text-champagne">Ready When You Are</p>
          <h2 className="mt-8 text-4xl leading-[1.1] text-ivory sm:text-5xl lg:text-[3.75rem]">
            Let&rsquo;s Make You Look &amp; Feel
            <span className="block text-champagne">Your Absolute Best.</span>
          </h2>
          <p className="mt-8 text-sm font-light tracking-[0.06em] text-ivory/55">
            Ready to create your perfect look?
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="sweep w-full bg-champagne px-10 py-4 text-[0.66rem] font-medium tracking-[0.24em] text-ink uppercase transition-colors duration-500 hover:bg-blush sm:w-auto"
            >
              Book an Appointment
            </Link>
            <a
              href={BRAND.phoneHref}
              className="inline-flex w-full items-center justify-center gap-3 border border-ivory/25 px-10 py-4 text-[0.66rem] font-medium tracking-[0.24em] text-ivory uppercase transition-colors duration-500 hover:border-champagne hover:text-champagne sm:w-auto"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.3} aria-hidden />
              Call Natasha
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
