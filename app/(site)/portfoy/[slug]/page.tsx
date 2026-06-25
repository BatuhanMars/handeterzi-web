import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Hash,
  Check,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { getPropertyBySlug } from "@/lib/properties";
import { categoryLabel, statusLabel } from "@/lib/constants";
import { formatPrice, formatArea, formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import PropertyGallery from "@/components/PropertyGallery";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "İlan bulunamadı" };
  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      images: property.coverImage ? [property.coverImage] : undefined,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const images = property.coverImage
    ? [property.coverImage, ...property.images.filter((i) => i !== property.coverImage)]
    : property.images;

  const specs: { label: string; value: string }[] = [];
  const push = (label: string, value: string | number | null | undefined) => {
    if (value !== null && value !== undefined && value !== "")
      specs.push({ label, value: String(value) });
  };
  push("İlan Tipi", categoryLabel(property.category));
  push("Durum", statusLabel(property.status));
  if (property.grossArea) push("Brüt Alan", formatArea(property.grossArea));
  if (property.netArea) push("Net Alan", formatArea(property.netArea));
  push("Oda Sayısı", property.rooms);
  push("Banyo Sayısı", property.bathrooms);
  push("Bina Yaşı", property.buildingAge);
  push("Bulunduğu Kat", property.floor);
  push("Kat Sayısı", property.totalFloors);
  push("Isıtma", property.heating);
  if (property.category === "konut")
    push("Eşya Durumu", property.furnished ? "Eşyalı" : "Eşyasız");
  push("İmar Durumu", property.zoning);
  push("Ada / Parsel", property.blockParcel);

  const mapQuery =
    property.latitude && property.longitude
      ? `${property.latitude},${property.longitude}`
      : encodeURIComponent(
          [property.neighborhood, property.district, property.city]
            .filter(Boolean)
            .join(", ") || "Türkiye",
        );
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&z=14&output=embed`;

  const waText = encodeURIComponent(
    `Merhaba, "${property.title}" (${property.reference ?? ""}) ilanı hakkında bilgi almak istiyorum.`,
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <Link href="/" className="hover:text-ink">Ana Sayfa</Link>
        <ChevronRight size={13} />
        <Link href="/portfoy" className="hover:text-ink">Portföy</Link>
        <ChevronRight size={13} />
        <span className="text-ink-soft">{property.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <PropertyGallery images={images} title={property.title} />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm bg-ink px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-paper">
                {statusLabel(property.status)}
              </span>
              <span className="rounded-sm border border-line px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-ink-soft">
                {categoryLabel(property.category)}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <MapPin size={15} className="text-accent" />
              {[property.neighborhood, property.district, property.city]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          {/* Specs */}
          <div className="mt-8">
            <h2 className="font-display text-xl text-ink">Özellikler</h2>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="bg-paper px-4 py-3.5">
                  <dt className="text-xs text-muted">{s.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mt-8">
              <h2 className="font-display text-xl text-ink">Açıklama</h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {property.description}
              </div>
            </div>
          )}

          {/* Features */}
          {property.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl text-ink">İç & Dış Özellikler</h2>
              <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {property.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink-soft">
                    <Check size={15} className="shrink-0 text-accent" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Map */}
          <div className="mt-8">
            <h2 className="font-display text-xl text-ink">Konum</h2>
            <div className="mt-4 aspect-[16/9] overflow-hidden rounded-sm border border-line">
              <iframe
                src={mapSrc}
                title="Konum"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-sm border border-line bg-paper p-6">
              <div className="text-xs uppercase tracking-wider text-muted">Fiyat</div>
              <div className="mt-1 font-display text-3xl text-ink">
                {formatPrice(property.price, property.currency)}
              </div>
              {property.reference && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
                  <Hash size={12} /> İlan No: {property.reference}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-4 py-3 text-sm text-paper transition-colors hover:bg-ink-soft"
                >
                  <Phone size={15} /> {site.phone}
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink px-4 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  <MessageCircle size={15} /> WhatsApp&apos;tan Yaz
                </a>
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <div className="font-display text-base text-ink">{site.name}</div>
                <div className="text-xs text-muted">{site.role}</div>
              </div>
            </div>

            <div className="mt-4 rounded-sm border border-line bg-sand p-6">
              <h3 className="font-display text-lg text-ink">Bilgi Talep Et</h3>
              <p className="mt-1 text-xs text-muted">
                Formu doldurun, en kısa sürede dönüş yapayım.
              </p>
              <div className="mt-4">
                <ContactForm propertyId={property.id} compact />
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-muted">
              İlan güncelleme: {formatDate(property.updatedAt)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
