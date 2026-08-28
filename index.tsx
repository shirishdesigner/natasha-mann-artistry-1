import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { BridalFeature } from "@/components/site/BridalFeature";
import { WhyNatasha } from "@/components/site/WhyNatasha";
import { Location } from "@/components/site/Location";
import { Testimonials } from "@/components/site/Testimonials";
import { SocialGallery } from "@/components/site/SocialGallery";
import { BookingCta } from "@/components/site/BookingCta";
import { Faq } from "@/components/site/Faq";
import {
  ldScript,
  LOCAL_BUSINESS_LD,
  SERVICE_CATALOG_LD,
  FAQ_LD,
} from "@/lib/structured-data";

const TITLE = "Natasha Mann Artistry | Bridal Makeup Artist, Brampton";
const DESCRIPTION =
  "Professional bridal and party makeup artistry and hairstyling in Brampton West, Ontario. Timeless beauty for weddings, parties and every occasion.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      ldScript(LOCAL_BUSINESS_LD),
      ldScript(SERVICE_CATALOG_LD),
      ldScript(FAQ_LD),
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <BridalFeature />
      <WhyNatasha />
      <Testimonials />
      <SocialGallery />
      <Location />
      <Faq />
      <BookingCta />
    </>
  );
}
