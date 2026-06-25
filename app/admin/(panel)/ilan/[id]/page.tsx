import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPropertyById } from "@/lib/properties";
import PropertyForm from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "İlan Düzenle" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(Number(id));
  if (!property) notFound();

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ChevronLeft size={15} /> Panele dön
      </Link>
      <h1 className="mt-3 mb-1 font-display text-2xl text-ink sm:text-3xl">
        İlanı Düzenle
      </h1>
      <p className="mb-6 text-sm text-muted">{property.title}</p>
      <PropertyForm initial={property} />
    </div>
  );
}
