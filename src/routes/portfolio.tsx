import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Portfolio, SHOTS } from "@/components/site/Portfolio";
import { SocialGallery } from "@/components/site/SocialGallery";
import { BookingCta } from "@/components/site/BookingCta";
import portfolioHero from "@/assets/bridal-feature.jpg";

import { ldScript, LOCAL_BUSINESS_LD } from "@/lib/structured-data";

const TITLE = "Portfolio | Bridal & Party Makeup Gallery — Natasha Mann";
const DESCRIPTION =
  "Browse the Natasha Mann Artistry portfolio — bridal, party, and editorial makeup and hairstyling work from Brampton West, Ontario.";

type PortfolioSearch = { photo?: number | undefined };

export const Route = createFileRoute("/portfolio")({
  validateSearch: (search: Record<string, unknown>): PortfolioSearch => {
    const raw = Number(search["photo"]);
    return Number.isInteger(raw) && raw >= 0 && raw < SHOTS.length ? { photo: raw } : {};
  },
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
  component: PortfolioPage,
});

function PortfolioPage() {
  const { photo } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

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
        eyebrow="Selected Work"
        title="A Gallery Of Finished Looks."
        subtitle="Bridal, party, and editorial artistry captured on the day it mattered most."
        image={portfolioHero}
        imageAlt="Editorial bridal beauty campaign photograph"
        imagePosition="55% 35%"
        primaryCta={{ label: "Book Your Look", to: "/contact" }}
        secondaryCta={{ label: "Explore Services", to: "/services" }}
      />

      <Portfolio
        activeIndex={photo ?? null}
        onActiveIndexChange={setPhoto}
        shareHref={(index) => `/portfolio?photo=${index}`}
      />
      <SocialGallery />
      <BookingCta />
    </>
  );
}
