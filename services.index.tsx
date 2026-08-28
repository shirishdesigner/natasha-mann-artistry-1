import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Services } from "@/components/site/Services";
import { BridalFeature } from "@/components/site/BridalFeature";
import { BookingCta } from "@/components/site/BookingCta";
import { Faq } from "@/components/site/Faq";
import servicesHero from "@/assets/service-bridal-combo.jpg";


import { ldScript, LOCAL_BUSINESS_LD, SERVICE_CATALOG_LD, FAQ_LD } from "@/lib/structured-data";

const TITLE = "Services | Bridal & Party Makeup — Natasha Mann Artistry";
const DESCRIPTION =
  "Bridal makeup and hairstyling, party makeup, and occasion hairstyling in Brampton West, Ontario. Explore the full service menu at Natasha Mann Artistry.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [ldScript(LOCAL_BUSINESS_LD), ldScript(SERVICE_CATALOG_LD), ldScript(FAQ_LD)],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Signature Offerings"
        title="Services Made For Your Moment."
        subtitle="From bridal artistry to party glam, each service is tailored to your features, your outfit, and the mood of your celebration."
        image={servicesHero}
        imageAlt="Bride with completed bridal makeup and hairstyling"
        imagePosition="70% 25%"
        primaryCta={{ label: "Book Your Appointment", to: "/contact" }}
        secondaryCta={{ label: "See The Work", to: "/portfolio" }}
      />

      <Services />
      <BridalFeature />
      <Faq />
      <BookingCta />
    </>
  );
}
