import { Heart, Sparkles, Flower2 } from "lucide-react";
import { Reveal } from "./Reveal";

const PILLARS = [
  {
    icon: Heart,
    title: "Flawless Confidence",
    copy: "Makeup designed to enhance your natural beauty and make you feel your best.",
  },
  {
    icon: Sparkles,
    title: "Personalized Just For You",
    copy: "Every look is tailored to your features, style, outfit, and occasion.",
  },
  {
    icon: Flower2,
    title: "Beauty With Care",
    copy: "A thoughtful, professional experience from consultation to final look.",
  },
];

export function WhyNatasha() {
  return (
    <section className="bg-background py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-14 sm:grid-cols-3 sm:gap-8 lg:gap-16">
          {PILLARS.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 130}
              className="relative sm:px-2 lg:px-6"
            >
              {i > 0 ? (
                <span className="absolute top-2 -left-4 hidden h-24 w-px bg-border sm:block lg:-left-8" />
              ) : null}
              <pillar.icon
                className="h-8 w-8 text-champagne"
                strokeWidth={0.9}
                aria-hidden
              />
              <h3 className="mt-8 text-[0.7rem] font-medium tracking-[0.28em] text-foreground uppercase">
                {pillar.title}
              </h3>
              <p className="mt-5 text-sm leading-[1.9] font-light text-muted-foreground">
                {pillar.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
