export const BRAND = {
  name: "Natasha Mann Artistry",
  tagline: "Timeless Beauty. Every Occasion.",
  email: "natashamannartistry@gmail.com",
  phone: "647-920-7117",
  phoneHref: "tel:+16479207117",
  location: "Brampton West, Ontario",
  instagram: "https://instagram.com/natashamannartistry",
  instagramHandle: "@natashamannartistry",
  facebook: "https://facebook.com/natashamannartistry",
  tiktok: "https://tiktok.com/@natashamannartistry",
} as const;

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Contact", to: "/contact" },
] as const;

export const SERVICE_OPTIONS = [
  "Bridal Makeup & Hairstyle",
  "Bridal Makeup",
  "Party Makeup & Hairstyle",
  "Party Hairstyle",
  "Party Makeup",
] as const;
