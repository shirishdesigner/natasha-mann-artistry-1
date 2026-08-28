import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  to?: "/" | "/about" | "/services" | "/portfolio" | "/testimonials" | "/contact";
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-ink/95">
      <ol className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 py-4 text-[0.62rem] font-medium tracking-[0.2em] uppercase lg:px-12">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.to && !last ? (
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="text-ivory/50 transition-colors duration-500 hover:text-champagne"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={last ? "text-champagne" : "text-ivory/50"}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight
                  className="h-3 w-3 text-ivory/25"
                  strokeWidth={1.5}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
