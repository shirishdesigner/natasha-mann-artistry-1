import { BRAND, SERVICE_OPTIONS } from "@/components/site/brand";

export const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": "https://natashamannartistry.com/#business",
  name: BRAND.name,
  slogan: BRAND.tagline,
  description:
    "Professional bridal and party makeup artistry and hairstyling in Brampton West, Ontario.",
  email: BRAND.email,
  telephone: "+1-647-920-7117",
  priceRange: "$$",
  image: "/favicon.png",
  areaServed: [
    { "@type": "City", name: "Brampton" },
    { "@type": "City", name: "Mississauga" },
    { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brampton West",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  sameAs: [BRAND.instagram, BRAND.facebook, BRAND.tiktok],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  ],
};

export const SERVICE_CATALOG_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Makeup & Hairstyling Services",
  itemListElement: SERVICE_OPTIONS.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service,
      serviceType: service,
      provider: { "@type": "BeautySalon", name: BRAND.name },
      areaServed: { "@type": "City", name: "Brampton" },
      availableChannel: {
        "@type": "ServiceChannel",
        servicePhone: "+1-647-920-7117",
      },
    },
  })),
};

export const FAQS = [
  {
    question: "How far in advance should I book my bridal appointment?",
    answer:
      "For weddings, three to six months ahead is ideal — peak season dates fill quickly. For party looks, one to two weeks is usually enough, though earlier is always safer.",
  },
  {
    question: "Do you travel to my venue or home?",
    answer:
      "Yes. Natasha travels across Brampton, Mississauga, and the wider Greater Toronto Area so you can get ready comfortably at home or on-site at your venue.",
  },
  {
    question: "Is a bridal trial included?",
    answer:
      "A trial is strongly recommended for brides and can be added to any bridal booking. It lets us perfect your look, test longevity, and plan timings for the day.",
  },
  {
    question: "What products do you use?",
    answer:
      "Only professional, long-wearing, photography-friendly products, with sanitised tools for every client. Sensitive-skin and lightweight options are always available.",
  },
  {
    question: "Can you do makeup for my bridal party too?",
    answer:
      "Absolutely. Group bookings for bridesmaids, mothers, and family members can be arranged around your schedule — just share your headcount when you enquire.",
  },
  {
    question: "How do I confirm my date?",
    answer:
      "Send an enquiry through the contact form, call, or message on Instagram. Natasha replies with availability and a tailored recommendation before confirming.",
  },
];

export const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export const ldScript = (data: unknown) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});

export const reviewLd = (
  subject: string,
  reviews: { quote: string; name: string; context: string }[],
) => {
  if (reviews.length === 0) return {};
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 5,
      bestRating: 5,
      reviewCount: reviews.length,
      itemReviewed: subject,
    },
    review: reviews.map((item) => ({
      "@type": "Review",
      name: `${subject} review by ${item.name}`,
      reviewBody: item.quote,
      author: { "@type": "Person", name: item.name },
      publisher: { "@type": "Organization", name: BRAND.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
};
