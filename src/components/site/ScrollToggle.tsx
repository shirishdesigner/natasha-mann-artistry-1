import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ScrollToggle() {
  const [visible, setVisible] = useState(false);
  const [atBottomHalf, setAtBottomHalf] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(max > 400);
      setAtBottomHalf(max > 0 && scrolled / max > 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  const toTop = atBottomHalf;

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: toTop ? 0 : document.documentElement.scrollHeight,
          behavior: "smooth",
        })
      }
      aria-label={toTop ? "Scroll to top of page" : "Scroll to bottom of page"}
      title={toTop ? "Back to top" : "Skip to bottom"}
      className="fixed right-5 bottom-24 z-50 flex h-11 w-11 items-center justify-center border border-champagne/40 bg-ink/85 text-champagne backdrop-blur transition-all duration-500 hover:bg-champagne hover:text-ink sm:bottom-8 lg:right-8"
    >
      {toTop ? (
        <ArrowUp className="h-4 w-4" strokeWidth={1.4} aria-hidden />
      ) : (
        <ArrowDown className="h-4 w-4" strokeWidth={1.4} aria-hidden />
      )}
    </button>
  );
}
