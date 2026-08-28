import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BRAND } from "./brand";
import { cn } from "@/lib/utils";

export function ServiceBookingBar({ serviceTitle }: { serviceTitle: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-champagne/20 bg-ink/95 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 lg:px-12">
        <div className="min-w-0">
          <p className="text-[0.58rem] tracking-[0.28em] text-champagne uppercase">
            Now Booking
          </p>
          <p className="mt-1 truncate font-display text-lg text-ivory">
            {serviceTitle}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={BRAND.phoneHref}
            className="hidden px-4 py-3 text-[0.62rem] font-medium tracking-[0.24em] text-ivory/70 uppercase transition-colors duration-500 hover:text-champagne sm:block"
          >
            Call
          </a>
          <Link
            to="/contact"
            search={{ service: serviceTitle }}
            className="sweep bg-champagne px-6 py-3.5 text-[0.62rem] font-medium tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:bg-blush sm:px-8"
          >
            Book This Service
          </Link>
        </div>
      </div>
    </div>
  );
}
