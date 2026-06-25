"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ImageOff, Expand } from "lucide-react";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  if (count === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-sm border border-line bg-sand-deep text-muted">
        <ImageOff size={32} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <div>
      <div
        className="group relative aspect-[16/10] cursor-zoom-in overflow-hidden rounded-sm bg-sand-deep"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={images[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-sm bg-ink/70 px-2.5 py-1.5 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100">
          <Expand size={13} /> Büyüt
        </div>
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Önceki"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity hover:bg-paper group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Sonraki"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity hover:bg-paper group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-3 rounded-sm bg-ink/70 px-2.5 py-1 text-xs text-paper">
              {active + 1} / {count}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-sm border transition-all sm:h-20 sm:w-20 ${
                i === active
                  ? "border-ink ring-1 ring-ink"
                  : "border-line opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => setLightbox(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-paper/80 hover:bg-paper/10 hover:text-paper"
          >
            <X size={24} />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Önceki"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-paper/80 hover:bg-paper/10 hover:text-paper"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                aria-label="Sonraki"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-paper/80 hover:bg-paper/10 hover:text-paper"
              >
                <ChevronRight size={28} />
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-sm bg-paper/10 px-3 py-1 text-sm text-paper">
                {active + 1} / {count}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
