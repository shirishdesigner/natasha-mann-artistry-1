import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "Natasha made me feel like the most beautiful version of myself on my wedding day. My makeup lasted through tears, dancing and a very long night — and still looked flawless in every photo.",
    name: "Simran K.",
    context: "Bride, Brampton",
  },
  {
    quote:
      "She listened to exactly what I wanted and then made it better. The hair updo was elegant and held perfectly, and the makeup was soft, glowy and so me.",
    name: "Ashley R.",
    context: "Engagement Party",
  },
  {
    quote:
      "Calm, professional and genuinely kind. Getting ready with Natasha was the most relaxed part of my morning, and my bridal party couldn't stop complimenting her work.",
    name: "Priya S.",
    context: "Bride, Mississauga",
  },
  {
    quote:
      "I booked her for a family celebration and left feeling glamorous without looking overdone. Everyone asked who did my makeup.",
    name: "Nadia M.",
    context: "Party Makeup",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    const id = window.setInterval(() => go(1), 8000);
    return () => window.clearInterval(id);
  }, [go]);

  const active = TESTIMONIALS[index]!;

  return (
    <section id="testimonials" className="bg-ink py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Client Stories"
          title="Kind Words"
          subtitle="Beautiful experiences. Beautiful memories."
          tone="dark"
        />

        <Reveal delay={120} className="mt-16 lg:mt-24">
          <div className="flex justify-center gap-2" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-champagne text-champagne" />
            ))}
          </div>

          <blockquote
            key={index}
            className="mx-auto mt-12 max-w-3xl animate-[fade-in_0.9s_ease-out] text-center"
          >
            <p className="font-display text-2xl leading-[1.5] font-light text-ivory sm:text-3xl lg:text-[2.25rem] lg:leading-[1.45]">
              &ldquo;{active.quote}&rdquo;
            </p>
            <footer className="mt-12">
              <p className="script text-3xl text-champagne">{active.name}</p>
              <p className="mt-3 text-[0.6rem] tracking-[0.3em] text-ivory/45 uppercase">
                {active.context}
              </p>
            </footer>
          </blockquote>

          <div className="mt-16 flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="text-ivory/50 transition-colors duration-500 hover:text-champagne"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.1} />
            </button>

            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={i === index}
                  className={cn(
                    "h-px transition-all duration-700",
                    i === index ? "w-10 bg-champagne" : "w-5 bg-ivory/25",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="text-ivory/50 transition-colors duration-500 hover:text-champagne"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.1} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
