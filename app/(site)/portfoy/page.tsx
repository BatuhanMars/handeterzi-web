import { Suspense } from "react";
import type { Metadata } from "next";
import { listProperties, distinctCities } from "@/lib/properties";
import type { PropertyCategory, ListingStatus } from "@/lib/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portföy",
  description: "Satılık ve kiralık konut, arsa ve ticari gayrimenkul ilanları.",
};

type SP = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const cities = distinctCities();

  const properties = listProperties({
    status: one(sp.durum) as ListingStatus | undefined,
    category: one(sp.tip) as PropertyCategory | undefined,
    city: one(sp.sehir),
    rooms: one(sp.oda),
    search: one(sp.q),
    minPrice: one(sp.min) ? Number(one(sp.min)) : undefined,
    maxPrice: one(sp.max) ? Number(one(sp.max)) : undefined,
    sort: one(sp.sirala) as "newest" | "price_asc" | "price_desc" | undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        <span className="eyebrow">Gayrimenkul Portföyü</span>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          İlanlar
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Satılık ve kiralık konut, arsa ve ticari gayrimenkullerimi aşağıdan
          inceleyebilir, filtreleyerek size en uygun seçeneği bulabilirsiniz.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-24" />}>
          <PropertyFilters cities={cities} />
        </Suspense>
      </div>

      <p className="mt-8 text-sm text-muted">
        <span className="font-medium text-ink">{properties.length}</span> ilan
        listeleniyor
      </p>

      {properties.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-sm border border-dashed border-line bg-sand p-16 text-center">
          <p className="font-display text-xl text-ink">Sonuç bulunamadı</p>
          <p className="mt-2 text-sm text-muted">
            Arama kriterlerinize uygun ilan bulunamadı. Filtreleri değiştirmeyi
            deneyin.
          </p>
        </div>
      )}
    </div>
  );
}
