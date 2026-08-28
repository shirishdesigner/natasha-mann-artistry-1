import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import type { ServiceTestimonial } from "./service-testimonials";
import { cn } from "@/lib/utils";

export function ServiceTestimonials({
  items,
  serviceTitle,
}: {
  items: ServiceTestimonial[];
  serviceTitle: string;
}) {
  const total = items.length;
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    setIndex(0);
  }, [serviceTitle]);

  useEffect(() => {
    if (total < 2) return;
    const id = window.setInterval(() => go(1), 9000);
    return () => window.clearInterval(id);
  }, [go, total]);

  if (total === 0) return null;
  const active = items[index] ?? items[0]!;

  return (
    <section className="bg-secondary/40 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Client Words"
          title={`What ${serviceTitle} Clients Say`}
          subtitle="A few notes from recent clients who booked this exact service."
          align="left"
        />

        <Reveal delay={110}>
          <figure
            key={index}
            className="mt-14 animate-[fade-in_0.7s_ease-out] border border-border bg-background p-9 sm:p-14"
          >
            <div className="flex gap-1.5 text-champagne" aria-hidden>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-current" strokeWidth={1} />
              ))}
            </div>
            <blockquote className="mt-8 max-w-3xl font-display text-2xl leading-[1.55] font-light text-foreground sm:text-3xl">
              &ldquo;{active.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-10 border-t border-border pt-7">
              <span className="script block text-3xl text-foreground/85">{active.name}</span>
              <span className="mt-2 block text-[0.6rem] tracking-[0.26em] text-champagne uppercase">
                {active.context}
              </span>
            </figcaption>
          </figure>

          {total > 1 ? (
            <div className="mt-10 flex items-center gap-8">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="text-muted-foreground transition-colors duration-500 hover:text-champagne"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.1} />
              </button>

              <div className="flex items-center gap-3">
                {items.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show review from ${item.name}`}
                    aria-current={i === index}
                    className={cn(
                      "h-px transition-all duration-700",
                      i === index ? "w-10 bg-champagne" : "w-5 bg-foreground/20",
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="text-muted-foreground transition-colors duration-500 hover:text-champagne"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.1} />
              </button>

              <span className="ml-auto text-[0.6rem] tracking-[0.26em] text-muted-foreground uppercase">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
