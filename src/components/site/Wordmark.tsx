import { cn } from "@/lib/utils";
import logoLight from "@/assets/nm-logo-light.png";
export function Wordmark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const src = logoLight;
  return (
    <img
      src={src}
      alt="Natasha Mann Artistry"
      loading="eager"
      decoding="async"
      className={cn("h-11 w-auto object-contain sm:h-12", className)}
    />
  );
}
