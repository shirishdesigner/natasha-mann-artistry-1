import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Testimonials } from "@/components/site/Testimonials";
import { WhyNatasha } from "@/components/site/WhyNatasha";
import { BookingCta } from "@/components/site/BookingCta";
import testimonialsHero from "@/assets/gallery-3.jpg";


import { ldScript, LOCAL_BUSINESS_LD } from "@/lib/structured-data";

const TITLE = "Testimonials | Client Reviews — Natasha Mann Artistry";
const DESCRIPTION =
  "Read what brides and party clients say about their makeup and hairstyling experience with Natasha Mann Artistry in Brampton, Ontario.";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [ldScript(LOCAL_BUSINESS_LD)],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Kind Words"
        title="Loved By Brides & Clients."
        subtitle="Real experiences from the people who trusted Natasha with their most memorable days."
        image={testimonialsHero}
        imageAlt="Client with radiant occasion makeup"
        imagePosition="50% 25%"
        primaryCta={{ label: "Book Your Appointment", to: "/contact" }}
        secondaryCta={{ label: "Explore Services", to: "/services" }}
      />

      <Testimonials />
      <WhyNatasha />
      <BookingCta />
    </>
  );
}
