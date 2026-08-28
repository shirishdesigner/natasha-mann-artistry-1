import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Link2, X } from "lucide-react";
import { toast } from "sonner";

export type LightboxImage = { src: string; alt: string };

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  shareHref,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
  shareHref?: ((index: number) => string) | undefined;
}) {
  const total = images.length;
  const open = index !== null;
  const [copied, setCopied] = useState(false);

  const go = useCallback(
    (dir: number) => {
      if (index === null || total === 0) return;
      onIndexChange((index + dir + total) % total);
    },
    [index, total, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  useEffect(() => {
    setCopied(false);
  }, [index]);

  if (!open || index === null) return null;
  const current = images[index];
  if (!current) return null;

  const copyLink = async () => {
    if (!shareHref) return;
    const url = `${window.location.origin}${shareHref(index)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied", { description: "Share this photo directly." });
    } catch {
      toast.error("Could not copy the link", { description: url });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
      className="fixed inset-0 z-[100] flex flex-col bg-ink/97 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 py-6 lg:px-12">
        <span className="text-[0.62rem] tracking-[0.28em] text-champagne uppercase">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-6" onClick={(event) => event.stopPropagation()}>
          {shareHref ? (
            <button
              type="button"
              onClick={() => void copyLink()}
              className="flex items-center gap-2.5 text-[0.58rem] tracking-[0.24em] text-ivory/60 uppercase transition-colors duration-500 hover:text-champagne"
            >
              <Link2 className="h-4 w-4" strokeWidth={1.2} aria-hidden />
              {copied ? "Link Copied" : "Copy Link"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="text-ivory/70 transition-colors duration-500 hover:text-champagne"
          >
            <X className="h-6 w-6" strokeWidth={1.2} />
          </button>
        </div>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center gap-4 px-4 sm:gap-8 sm:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="shrink-0 p-3 text-ivory/60 transition-colors duration-500 hover:text-champagne"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={1.2} />
        </button>

        <figure className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            decoding="async"
            className="max-h-[60vh] min-h-0 w-auto max-w-full flex-1 animate-[fade-in_0.6s_ease-out] object-contain sm:max-h-[70vh]"
          />

          <figcaption className="mt-6 max-w-xl text-center text-sm leading-relaxed font-light text-ivory/70">
            {current.alt}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="shrink-0 p-3 text-ivory/60 transition-colors duration-500 hover:text-champagne"
        >
          <ArrowRight className="h-6 w-6" strokeWidth={1.2} />
        </button>
      </div>

      <p className="px-6 pb-8 text-center text-[0.58rem] tracking-[0.26em] text-ivory/35 uppercase">
        Use arrow keys to browse &middot; Esc to close
      </p>
    </div>
  );
}
