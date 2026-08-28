import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { SERVICE_DETAILS } from "./services-data";
import { BRAND, NAV_LINKS } from "./brand";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-ink/92 py-3 backdrop-blur-md"
            : "bg-gradient-to-b from-ink/70 to-transparent py-6",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-6 lg:px-12"
        >
          <Link to="/" className="min-w-0" aria-label={`${BRAND.name} — home`}>
            <Wordmark tone="light" />
          </Link>

          <div className="flex shrink-0 items-center gap-10">
            <ul className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) =>
                link.to === "/services" ? (
                  <li key={link.to} className="group relative">
                    <Link
                      to={link.to}
                      activeProps={{ className: "text-champagne" }}
                      className="relative flex items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.22em] text-ivory/75 uppercase transition-colors duration-500 hover:text-champagne after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-champagne after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100"
                    >
                      {link.label}
                      <ChevronDown
                        className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </Link>

                    <div className="invisible absolute top-full left-1/2 z-10 w-[min(20rem,80vw)] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-all duration-500 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <ul className="border border-champagne/20 bg-ink/97 py-3 backdrop-blur-md">
                        {SERVICE_DETAILS.map((service) => (
                          <li key={service.slug}>
                            <Link
                              to="/services/$slug"
                              params={{ slug: service.slug }}
                              activeProps={{ className: "text-champagne" }}
                              className="block px-6 py-3 text-[0.66rem] font-medium tracking-[0.18em] text-ivory/70 uppercase transition-colors duration-400 hover:bg-champagne/10 hover:text-champagne"
                            >
                              {service.title}
                            </Link>
                          </li>
                        ))}
                        <li className="mt-2 border-t border-ivory/10 pt-2">
                          <Link
                            to="/services"
                            className="block px-6 py-3 text-[0.62rem] font-medium tracking-[0.22em] text-champagne/80 uppercase transition-colors duration-400 hover:text-champagne"
                          >
                            All Services
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      activeOptions={{ exact: link.to === "/" }}
                      activeProps={{ className: "text-champagne" }}
                      className="relative text-[0.7rem] font-medium tracking-[0.22em] text-ivory/75 uppercase transition-colors duration-500 hover:text-champagne after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-champagne after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>


            <Link
              to="/contact"
              className="hidden border border-champagne/60 px-6 py-3 text-[0.65rem] font-medium tracking-[0.24em] text-champagne uppercase transition-all duration-500 hover:bg-champagne hover:text-ink sm:inline-block"
            >
              Book an Appointment
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="text-ivory transition-colors hover:text-champagne lg:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.2} />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-60 bg-ink transition-all duration-700 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Wordmark tone="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-ivory transition-colors hover:text-champagne"
          >
            <X className="h-6 w-6" strokeWidth={1.2} />
          </button>
        </div>

        <ul className="mt-10 flex flex-col gap-2 px-8">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.to}
              style={{ transitionDelay: `${120 + i * 70}ms` }}
              className={cn(
                "border-b border-ivory/10 transition-all duration-700",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
            >
              <Link
                to={link.to}
                onClick={() => setOpen(false)}
                className="block py-5 font-display text-3xl text-ivory"
              >
                {link.label}
              </Link>
              {link.to === "/services" ? (
                <ul className="-mt-1 pb-5 pl-1">
                  {SERVICE_DETAILS.map((service) => (
                    <li key={service.slug}>
                      <Link
                        to="/services/$slug"
                        params={{ slug: service.slug }}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-[0.66rem] font-medium tracking-[0.18em] text-ivory/50 uppercase"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="px-8 pt-10">
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block border border-champagne bg-champagne px-6 py-4 text-center text-[0.7rem] font-medium tracking-[0.24em] text-ink uppercase"
          >
            Book an Appointment
          </Link>
          <p className="script mt-8 text-2xl text-champagne/80">{BRAND.tagline}</p>
        </div>
      </div>
    </>
  );
}
