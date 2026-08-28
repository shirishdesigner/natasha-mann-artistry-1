import bridalCombo from "@/assets/service-bridal-combo.jpg";
import bridalMakeup from "@/assets/service-bridal-makeup.jpg";
import partyCombo from "@/assets/service-party-combo.jpg";
import partyHair from "@/assets/service-party-hair.jpg";
import partyMakeup from "@/assets/service-party-makeup.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";

export type ServiceDetail = {
  slug: string;
  title: string;
  short: string;
  cta: string;
  image: string;
  alt: string;
  imagePosition: string;
  gallery: { src: string; alt: string }[];
  feature?: boolean;
  eyebrow: string;
  heroTitle: string;
  intro: string;
  duration: string;
  bestFor: string;
  includes: string[];
  process: { step: string; detail: string }[];
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: "bridal-makeup-and-hairstyle",
    title: "Bridal Makeup & Hairstyle",
    short:
      "A complete bridal beauty experience combining professional makeup and hairstyling for your special day.",
    cta: "Explore Bridal",
    image: bridalCombo,
    alt: "Bride with soft glam makeup and a voluminous curled updo",
    imagePosition: "70% 25%",
    gallery: [
      { src: gallery1, alt: "Bride in soft champagne glam with a sculpted updo" },
      { src: gallery2, alt: "Bridal portrait with luminous skin and a floral hairpiece" },
      { src: gallery3, alt: "Detail of bridal hairstyling with delicate pins" },
      { src: gallery4, alt: "Bride photographed in natural window light" },
    ],
    feature: true,
    eyebrow: "Signature Bridal",
    heroTitle: "Bridal Makeup & Hairstyle.",
    intro:
      "The full bridal experience — makeup and hair designed together so every detail, from your veil placement to your lip tone, feels intentional. Long-wearing, photography-tested, and built around the way you want to feel walking down the aisle.",
    duration: "2.5 – 3 hours on the day",
    bestFor: "Brides who want one artist for a fully coordinated look",
    includes: [
      "Pre-booking consultation and look planning",
      "Skin prep, priming, and long-wear base",
      "Full makeup with lashes included",
      "Hairstyling with veil or accessory placement",
      "Touch-up guidance and a personal lip for the day",
    ],
    process: [
      {
        step: "Consultation",
        detail:
          "We talk through your outfit, jewellery, venue lighting, and the mood you want — soft and romantic, or bold and editorial.",
      },
      {
        step: "Trial",
        detail:
          "An optional trial lets us perfect the shade balance, test longevity, and lock in timings for the morning.",
      },
      {
        step: "Wedding Day",
        detail:
          "Natasha arrives at your home or venue with a calm, unhurried schedule so you are ready with time to spare.",
      },
    ],
  },
  {
    slug: "bridal-makeup",
    title: "Bridal Makeup",
    short: "Elegant, camera-ready makeup tailored specifically to the bride.",
    cta: "Learn More",
    image: bridalMakeup,
    alt: "Close-up of natural bridal makeup with luminous skin",
    imagePosition: "50% 30%",
    gallery: [
      { src: gallery2, alt: "Close-up of dewy bridal base and soft rose lip" },
      { src: gallery5, alt: "Bridal eye design with subtle shimmer and lashes" },
      { src: gallery1, alt: "Bride smiling with camera-ready bridal makeup" },
      { src: gallery6, alt: "Editorial bridal beauty portrait" },
    ],
    eyebrow: "Bridal Artistry",
    heroTitle: "Bridal Makeup.",
    intro:
      "Makeup-only bridal artistry for brides working with a separate hairstylist. Luminous skin, refined definition, and a finish that photographs beautifully in daylight, candlelight, and flash.",
    duration: "90 minutes – 2 hours",
    bestFor: "Brides with their own hairstylist or a simple hair plan",
    includes: [
      "Skin prep and colour-matched long-wear base",
      "Custom eye design with lashes",
      "Precision brows, contour, and blush placement",
      "Setting for humidity, tears, and long wear",
      "Touch-up tips for the rest of the day",
    ],
    process: [
      {
        step: "Look Planning",
        detail:
          "Share inspiration and outfit details so the palette complements your jewellery and fabric tones.",
      },
      {
        step: "Optional Trial",
        detail:
          "Ideal if you want to see the finish in photos before committing to the final look.",
      },
      {
        step: "The Day",
        detail:
          "A relaxed session timed around your hairstylist and photographer so nothing feels rushed.",
      },
    ],
  },
  {
    slug: "party-makeup-and-hairstyle",
    title: "Party Makeup & Hairstyle",
    short:
      "A coordinated makeup and hairstyling experience designed around your outfit, personality, and occasion.",
    cta: "Explore Service",
    image: partyCombo,
    alt: "Woman with glamorous party makeup and sleek styled hair",
    imagePosition: "55% 30%",
    gallery: [
      { src: gallery7, alt: "Party glam makeup paired with sleek styled hair" },
      { src: gallery8, alt: "Evening look with bold eyes and polished waves" },
      { src: gallery3, alt: "Guest of honour styled for an evening reception" },
      { src: gallery4, alt: "Occasion makeup and hair captured under warm light" },
    ],
    eyebrow: "Occasion Glam",
    heroTitle: "Party Makeup & Hairstyle.",
    intro:
      "Receptions, sangeets, engagements, birthdays, and galas — a complete makeup and hair pairing that turns one evening into a moment. Bold or understated, always finished to a professional standard.",
    duration: "2 – 2.5 hours",
    bestFor: "Guests of honour, family functions, and evening events",
    includes: [
      "Look direction based on your outfit and event",
      "Full makeup with lashes",
      "Hairstyling — updo, curls, sleek finish, or braid work",
      "Long-wear setting for dancing and late nights",
      "Group bookings available on request",
    ],
    process: [
      {
        step: "Share The Brief",
        detail:
          "Send your outfit photo, event time, and any reference looks you love.",
      },
      {
        step: "Design",
        detail:
          "Natasha recommends a makeup and hair pairing that balances your features and the occasion.",
      },
      {
        step: "Get Ready",
        detail:
          "Studio or on-location, with timings arranged around when you need to leave.",
      },
    ],
  },
  {
    slug: "party-hairstyle",
    title: "Party Hairstyle",
    short:
      "From sleek buns to soft curls and sophisticated updos, create a hairstyle that complements your look.",
    cta: "Learn More",
    image: partyHair,
    alt: "Elegant twisted low bun hairstyle seen from behind",
    imagePosition: "50% 40%",
    gallery: [
      { src: gallery4, alt: "Sculpted low bun with twisted detailing" },
      { src: gallery3, alt: "Soft romantic curls styled for an evening event" },
      { src: gallery8, alt: "Sleek polished blowout with a centre part" },
      { src: gallery6, alt: "Braid detailing finished with champagne pins" },
    ],
    eyebrow: "Hair Styling",
    heroTitle: "Party Hairstyle.",
    intro:
      "Hair-only styling for evenings when your makeup is handled. Structured updos, romantic waves, polished blowouts, and braid detailing — engineered to hold from the first photo to the last dance.",
    duration: "60 – 90 minutes",
    bestFor: "Events where you only need hair styled",
    includes: [
      "Style consultation and prep",
      "Heat styling with protection",
      "Updo, curls, waves, or sleek finish",
      "Accessory and dupatta placement",
      "Hold products chosen for your hair type",
    ],
    process: [
      {
        step: "Pick A Direction",
        detail: "Send a reference or describe the feel — soft, sleek, or sculpted.",
      },
      {
        step: "Prep",
        detail:
          "Guidance on how to arrive — washed, dry, and product-free works best.",
      },
      {
        step: "Style",
        detail: "Built to last through weather, dancing, and long celebrations.",
      },
    ],
  },
  {
    slug: "party-makeup",
    title: "Party Makeup",
    short:
      "Flawless makeup for parties, events, celebrations, and special occasions.",
    cta: "Learn More",
    image: partyMakeup,
    alt: "Evening makeup with champagne shimmer eyeshadow",
    imagePosition: "50% 30%",
    gallery: [
      { src: gallery5, alt: "Champagne shimmer eyeshadow with defined lashes" },
      { src: gallery7, alt: "Evening makeup with glowing skin and berry lip" },
      { src: gallery6, alt: "Close-up of blush and highlight placement" },
      { src: gallery2, alt: "Photo-ready party makeup in warm light" },
    ],
    eyebrow: "Evening Makeup",
    heroTitle: "Party Makeup.",
    intro:
      "Evening makeup with intent — a glowing base, defined eyes, and a finish that reads beautifully both in person and on camera. Perfect for dinners, birthdays, receptions, and photo sessions.",
    duration: "60 – 90 minutes",
    bestFor: "Celebrations, shoots, and nights out",
    includes: [
      "Skin prep and long-wear base",
      "Custom eye look with lashes",
      "Brows, blush, contour, and highlight",
      "Lip finish suited to your outfit",
      "Sensitive-skin friendly product options",
    ],
    process: [
      {
        step: "Brief",
        detail: "Tell Natasha the occasion, outfit colour, and how bold you want to go.",
      },
      {
        step: "Application",
        detail: "A calm, precise session with professional, sanitised tools.",
      },
      {
        step: "Finish",
        detail: "Setting and touch-up advice so the look holds all evening.",
      },
    ],
  },
];

export const getServiceBySlug = (slug: string) =>
  SERVICE_DETAILS.find((service) => service.slug === slug);

export const getServiceNeighbours = (slug: string) => {
  const i = SERVICE_DETAILS.findIndex((service) => service.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  const last = SERVICE_DETAILS.length - 1;
  return {
    prev: SERVICE_DETAILS[i === 0 ? last : i - 1],
    next: SERVICE_DETAILS[i === last ? 0 : i + 1],
  };
};
