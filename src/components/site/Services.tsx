import { Link } from "@tanstack/react-router";
import { Reveal, SectionHeading } from "./Reveal";
import {
  SERVICE_DETAILS,
  type ServiceDetail,
} from "./services-data";

function ServiceCard({
  service,
  index,
}: {
  service: ServiceDetail;
  index: number;
}) {
  return (
    <Reveal
      delay={index * 90}
      className={
        service.feature
          ? "group relative w-[82vw] shrink-0 snap-start sm:w-auto lg:col-span-2"
          : "group relative w-[82vw] shrink-0 snap-start sm:w-auto"
      }
    >
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        className="block h-full"
      >

        <div
          className={
            service.feature
              ? "relative aspect-3/4 w-full overflow-hidden bg-ink sm:aspect-auto sm:h-full sm:min-h-[420px]"
              : "relative aspect-3/4 w-full overflow-hidden bg-ink sm:aspect-auto sm:h-full sm:min-h-[420px]"
          }
        >

          <img
            src={service.image}
            alt={service.alt}
            width={1008}
            height={1312}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
            <h3 className="max-w-[16ch] font-display text-2xl leading-tight text-ivory sm:text-[1.75rem]">
              {service.title}
            </h3>
            <p className="mt-4 max-w-sm text-[0.82rem] leading-relaxed font-light text-ivory/65">
              {service.short}
            </p>
            <span className="mt-6 inline-flex items-center gap-3 text-[0.62rem] font-medium tracking-[0.26em] text-champagne uppercase">
              {service.cta}
              <span className="h-px w-6 bg-champagne transition-all duration-700 group-hover:w-12" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function Services() {
  return (
    <section id="services" className="bg-secondary/40 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Our Craft"
          title="Services"
          subtitle="Beauty for every occasion."
        />

        <div className="mt-16 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-24 lg:grid-cols-3 lg:gap-8">
          {SERVICE_DETAILS.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
