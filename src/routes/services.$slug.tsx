import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { BookingCta } from "@/components/site/BookingCta";
import { Faq } from "@/components/site/Faq";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { BRAND } from "@/components/site/brand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ServiceGallery } from "@/components/site/ServiceGallery";
import { ServiceTestimonials } from "@/components/site/ServiceTestimonials";
import { ServiceBookingBar } from "@/components/site/ServiceBookingBar";
import { getServiceTestimonials } from "@/components/site/service-testimonials";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  SERVICE_DETAILS,
  getServiceBySlug,
  getServiceNeighbours,
} from "@/components/site/services-data";
import { ldScript, LOCAL_BUSINESS_LD, FAQ_LD, reviewLd } from "@/lib/structured-data";

type ServiceSearch = { photo?: number | undefined };

export const Route = createFileRoute("/services/$slug")({
  validateSearch: (search: Record<string, unknown>): ServiceSearch => {
    const raw = Number(search["photo"]);
    return Number.isInteger(raw) && raw >= 0 && raw < 12 ? { photo: raw } : {};
  },
  loader: ({ params }) => {
    const service = getServiceBySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service Unavailable | Natasha Mann Artistry" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} in Brampton | Natasha Mann Artistry`;
    const description = service.short;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/services/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
      scripts: [
        ldScript(LOCAL_BUSINESS_LD),
        ldScript(FAQ_LD),
        ldScript({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: "/services",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: service.title,
              item: `/services/${params.slug}`,
            },
          ],
        }),
        ldScript({
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          serviceType: service.title,
          description: service.short,
          provider: { "@type": "BeautySalon", name: BRAND.name },
          areaServed: { "@type": "City", name: "Brampton" },
          ...reviewLd(service.title, getServiceTestimonials(params.slug)),
        }),
      ],
    };
  },
  component: ServiceDetailPage,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <section className="bg-ink px-6 pt-48 pb-32 text-center">
      <p className="eyebrow text-champagne">Not Found</p>
      <h1 className="mt-6 text-4xl text-ivory sm:text-5xl">
        This service doesn&rsquo;t exist.
      </h1>
      <Link
        to="/services"
        className="mt-10 inline-block bg-champagne px-9 py-4 text-[0.68rem] font-medium tracking-[0.24em] text-ink uppercase"
      >
        View All Services
      </Link>
    </section>
  );
}

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const { photo } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const others = SERVICE_DETAILS.filter((s) => s.slug !== service.slug);
  const { prev, next } = getServiceNeighbours(service.slug);
  const testimonials = getServiceTestimonials(service.slug);

  const setPhoto = (next: number | null) => {
    void navigate({
      search: next === null ? {} : { photo: next },
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.heroTitle}
        subtitle={service.short}
        image={service.image}
        imageAlt={service.alt}
        imagePosition={service.imagePosition}
        primaryCta={{
          label: "Book This Service",
          to: "/contact",
          search: { service: service.title },
        }}
        secondaryCta={{ label: "All Services", to: "/services" }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: service.title },
        ]}
      />

      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24 lg:px-12">
          <Reveal>
            <p className="eyebrow text-champagne">The Experience</p>
            <p className="mt-8 text-lg leading-[1.9] font-light text-muted-foreground">
              {service.intro}
            </p>

            <div className="rule-champagne mt-12 w-24" />

            <h2 className="mt-12 font-display text-3xl text-foreground">
              What&rsquo;s Included
            </h2>
            <ul className="mt-8 space-y-5">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
                  <span className="text-sm leading-relaxed font-light text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140}>
            <div className="bg-ink p-9 sm:p-11">
              <p className="eyebrow text-champagne">At A Glance</p>
              <dl className="mt-8 space-y-7">
                <div>
                  <dt className="text-[0.62rem] tracking-[0.26em] text-ivory/40 uppercase">
                    Duration
                  </dt>
                  <dd className="mt-2 text-base font-light text-ivory/85">
                    {service.duration}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] tracking-[0.26em] text-ivory/40 uppercase">
                    Best For
                  </dt>
                  <dd className="mt-2 text-base font-light text-ivory/85">
                    {service.bestFor}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] tracking-[0.26em] text-ivory/40 uppercase">
                    Location
                  </dt>
                  <dd className="mt-2 text-base font-light text-ivory/85">
                    {BRAND.location} &amp; travel across the GTA
                  </dd>
                </div>
              </dl>
              <Link
                to="/contact"
                search={{ service: service.title }}
                className="sweep mt-10 block bg-champagne px-8 py-4 text-center text-[0.66rem] font-medium tracking-[0.24em] text-ink uppercase transition-colors duration-500 hover:bg-blush"
              >
                Check Availability
              </Link>
              <a
                href={BRAND.phoneHref}
                className="mt-4 block px-8 py-3 text-center text-[0.66rem] font-medium tracking-[0.24em] text-ivory/70 uppercase transition-colors duration-500 hover:text-champagne"
              >
                Call {BRAND.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <SectionHeading
            eyebrow="How It Works"
            title="From Enquiry To Finished Look"
            align="left"
          />
          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {service.process.map((item, i) => (
              <Reveal key={item.step} delay={i * 110}>
                <p className="font-display text-4xl text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 font-display text-2xl text-foreground">
                  {item.step}
                </h3>
                <p className="mt-4 text-sm leading-relaxed font-light text-muted-foreground">
                  {item.detail}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ServiceGallery
        images={service.gallery}
        serviceTitle={service.title}
        activeIndex={photo ?? null}
        onActiveIndexChange={setPhoto}
        shareHref={(index) => `/services/${service.slug}?photo=${index}`}
      />

      <ServiceTestimonials items={testimonials} serviceTitle={service.title} />

      <nav
        aria-label="Service navigation"
        className="border-y border-border bg-background"
      >
        <div className="mx-auto grid max-w-[1400px] gap-px px-6 sm:grid-cols-2 lg:px-12">
          {prev ? (
            <Link
              to="/services/$slug"
              params={{ slug: prev.slug }}
              className="group flex items-center gap-5 py-10 sm:pr-10"
            >
              <ArrowLeft
                className="h-5 w-5 shrink-0 text-champagne transition-transform duration-500 group-hover:-translate-x-1.5"
                strokeWidth={1.2}
              />
              <span>
                <span className="block text-[0.6rem] tracking-[0.26em] text-muted-foreground uppercase">
                  Previous Service
                </span>
                <span className="mt-2 block font-display text-2xl text-foreground transition-colors duration-500 group-hover:text-champagne">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : null}
          {next ? (
            <Link
              to="/services/$slug"
              params={{ slug: next.slug }}
              className="group flex items-center justify-end gap-5 py-10 text-right sm:border-l sm:border-border sm:pl-10"
            >
              <span>
                <span className="block text-[0.6rem] tracking-[0.26em] text-muted-foreground uppercase">
                  Next Service
                </span>
                <span className="mt-2 block font-display text-2xl text-foreground transition-colors duration-500 group-hover:text-champagne">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-champagne transition-transform duration-500 group-hover:translate-x-1.5"
                strokeWidth={1.2}
              />
            </Link>
          ) : null}
        </div>
      </nav>

      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <SectionHeading
            eyebrow="Also Available"
            title="Other Services"
            align="left"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item, i) => (
              <Reveal key={item.slug} delay={i * 90} className="group">
                <Link
                  to="/services/$slug"
                  params={{ slug: item.slug }}
                  className="block"
                >
                  <div className="relative aspect-3/4 overflow-hidden bg-ink">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-display text-xl leading-tight text-ivory">
                        {item.title}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-3 text-[0.6rem] font-medium tracking-[0.26em] text-champagne uppercase">
                        View
                        <span className="h-px w-6 bg-champagne transition-all duration-700 group-hover:w-10" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Faq />
      <BookingCta />
      <ServiceBookingBar serviceTitle={service.title} />
    </>
  );
}
