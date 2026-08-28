import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { BRAND, NAV_LINKS } from "./brand";
import { Wordmark } from "./Wordmark";

const SOCIALS = [
  { label: "Instagram", href: BRAND.instagram, icon: Instagram },
  { label: "Facebook", href: BRAND.facebook, icon: Facebook },
  { label: "TikTok", href: BRAND.tiktok, icon: Music2 },
];

export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-ink pt-20 pb-12">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <div>
            <Wordmark tone="light" />
            <p className="script mt-7 text-2xl text-champagne/80">
              Timeless Beauty. Every Occasion.
            </p>
            <div className="mt-8 flex items-center gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="text-ivory/55 transition-colors duration-500 hover:text-champagne"
                >
                  <s.icon className="h-4.5 w-4.5" strokeWidth={1.2} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.6rem] tracking-[0.3em] text-champagne uppercase">
              Explore
            </h2>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-light text-ivory/60 transition-colors duration-500 hover:text-champagne"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.6rem] tracking-[0.3em] text-champagne uppercase">
              Contact
            </h2>
            <ul className="mt-6 space-y-3 text-sm font-light text-ivory/60">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="transition-colors duration-500 hover:text-champagne"
                >
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.phoneHref}
                  className="transition-colors duration-500 hover:text-champagne"
                >
                  {BRAND.phone}
                </a>
              </li>
              <li>{BRAND.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 sm:flex-row">
          <p className="text-[0.62rem] tracking-[0.2em] text-ivory/35 uppercase">
            © 2026 Natasha Mann Artistry. All rights reserved.
          </p>
          <p className="text-[0.62rem] tracking-[0.2em] text-ivory/25 uppercase">
            Mobile service · Brampton &amp; surrounding areas
          </p>
        </div>
      </div>
    </footer>
  );
}
