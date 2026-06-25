import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PropertyForm from "@/components/admin/PropertyForm";

export const metadata = { title: "Yeni İlan" };

export default function NewPropertyPage() {
  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ChevronLeft size={15} /> Panele dön
      </Link>
      <h1 className="mt-3 mb-6 font-display text-2xl text-ink sm:text-3xl">
        Yeni İlan Ekle
      </h1>
      <PropertyForm />
    </div>
  );
}
