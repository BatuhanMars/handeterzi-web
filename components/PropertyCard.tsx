import Link from "next/link";
import Image from "next/image";
import { MapPin, Maximize, BedDouble, ImageOff } from "lucide-react";
import type { Property } from "@/lib/types";
import { categoryLabel, statusLabel } from "@/lib/constants";
import { formatPrice, formatArea } from "@/lib/format";

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.coverImage || property.images[0] || null;
  const area = property.netArea || property.grossArea;

  return (
    <Link
      href={`/portfoy/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(26,24,22,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-deep">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <ImageOff size={28} strokeWidth={1.4} />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-sm bg-ink/90 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-paper backdrop-blur">
            {statusLabel(property.status)}
          </span>
          <span className="rounded-sm bg-paper/90 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-ink backdrop-blur">
            {categoryLabel(property.category)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={13} className="text-accent" />
          {[property.district, property.city].filter(Boolean).join(", ")}
        </div>
        <h3 className="mt-2 line-clamp-2 font-display text-lg leading-snug text-ink">
          {property.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
          {property.rooms && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble size={14} className="text-muted" /> {property.rooms}
            </span>
          )}
          {area ? (
            <span className="inline-flex items-center gap-1.5">
              <Maximize size={14} className="text-muted" /> {formatArea(area)}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-line-soft pt-4">
          <span className="font-display text-xl text-ink">
            {formatPrice(property.price, property.currency)}
          </span>
          <span className="text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
            İncele →
          </span>
        </div>
      </div>
    </Link>
  );
}
