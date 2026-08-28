import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { About } from "@/components/site/About";
import { WhyNatasha } from "@/components/site/WhyNatasha";
import { Location } from "@/components/site/Location";
import { BookingCta } from "@/components/site/BookingCta";
import aboutHero from "@/assets/about-natasha.jpg";


import { ldScript, LOCAL_BUSINESS_LD } from "@/lib/structured-data";

const TITLE = "About Natasha Mann | Makeup Artist in Brampton West";
const DESCRIPTION =
  "Meet Natasha Mann — a professional makeup artist and hairstylist in Brampton West, Ontario, creating personalized bridal and party beauty looks.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The Art of Beauty"
        title="Beauty, Personally Crafted."
        subtitle="Every face is unique and every occasion deserves its own look. Discover the artistry, care, and attention behind Natasha Mann Artistry."
        image={aboutHero}
        imageAlt="Natasha Mann applying makeup in her studio"
        imagePosition="60% 30%"
        primaryCta={{ label: "Book A Consultation", to: "/contact" }}
        secondaryCta={{ label: "View Portfolio", to: "/portfolio" }}
      />

      <About />
      <WhyNatasha />
      <Location />
      <BookingCta />
    </>
  );
}
