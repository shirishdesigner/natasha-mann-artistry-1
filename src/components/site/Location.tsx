import { MapPin } from "lucide-react";
import { Reveal } from "./Reveal";

export function Location() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-secondary/50 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--charcoal) 1px, transparent 1px), linear-gradient(90deg, var(--charcoal) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 text-center lg:px-12">
        <Reveal>
          <p className="eyebrow text-muted-foreground">Proudly Based In</p>
          <div className="mt-7 flex items-center justify-center gap-4">
            <MapPin className="h-7 w-7 shrink-0 text-champagne" strokeWidth={1} aria-hidden />
            <h2 className="text-4xl tracking-[0.02em] sm:text-5xl lg:text-6xl">
              Brampton West
            </h2>
          </div>
          <div className="rule-champagne mx-auto mt-9 w-40" />
          <p className="mt-8 text-sm font-light tracking-[0.14em] text-muted-foreground uppercase">
            Serving Brampton and surrounding areas
          </p>
        </Reveal>
      </div>
    </section>
  );
}
