import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Contact } from "@/components/site/Contact";
import { Location } from "@/components/site/Location";
import { Faq } from "@/components/site/Faq";
import contactHero from "@/assets/service-party-combo.jpg";


import { ldScript, LOCAL_BUSINESS_LD, FAQ_LD } from "@/lib/structured-data";

const TITLE = "Contact & Booking | Natasha Mann Artistry, Brampton";
const DESCRIPTION =
  "Book your bridal or party makeup and hairstyling appointment with Natasha Mann Artistry in Brampton West, Ontario. Call, email, or send an enquiry.";

type ContactSearch = { service?: string | undefined };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch =>
    typeof search["service"] === "string" ? { service: search["service"] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [ldScript(LOCAL_BUSINESS_LD), ldScript(FAQ_LD)],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { service } = Route.useSearch();

  return (
    <>
      <PageHero
        eyebrow="Let's Create Together"
        title="Book Your Appointment."
        subtitle="Share a few details about your occasion and Natasha will get back to you with availability and a tailored recommendation."
        image={contactHero}
        imageAlt="Party makeup and hairstyling look by Natasha Mann Artistry"
        imagePosition="65% 30%"
        primaryCta={{ label: "Send An Enquiry", to: "/contact" }}
        secondaryCta={{ label: "Explore Services", to: "/services" }}
      />

      <Contact preselectService={service} />
      <Faq />
      <Location />
    </>
  );
}
