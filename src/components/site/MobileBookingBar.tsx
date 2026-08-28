import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { BRAND } from "./brand";
import { cn } from "@/lib/utils";

export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);
  const pathname = useLocation({ select: (l) => l.pathname });
  const onServiceDetail = /^\/services\/.+/.test(pathname);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-3 border-t border-ivory/10 bg-ink/95 p-3 backdrop-blur-md transition-transform duration-700 sm:hidden",
        visible && !onServiceDetail ? "translate-y-0" : "translate-y-full",
      )}
    >
      <Link
        to="/contact"
        className="bg-champagne py-3.5 text-center text-[0.65rem] font-medium tracking-[0.24em] text-ink uppercase"
      >
        Book an Appointment
      </Link>
      <a
        href={BRAND.phoneHref}
        aria-label="Call Natasha"
        className="grid w-14 place-items-center border border-ivory/25 text-champagne"
      >
        <Phone className="h-4 w-4" strokeWidth={1.3} />
      </a>
    </div>
  );
}
