import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { listProperties, unreadMessageCount } from "@/lib/properties";
import PropertyTable from "@/components/admin/PropertyTable";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const items = listProperties({ includeUnpublished: true });
  const published = items.filter((p) => p.published).length;
  const featured = items.filter((p) => p.featured).length;
  const unread = unreadMessageCount();

  const stats = [
    { label: "Toplam İlan", value: items.length },
    { label: "Yayında", value: published },
    { label: "Öne Çıkan", value: featured },
    { label: "Okunmamış Mesaj", value: unread },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Panel</h1>
          <p className="mt-1 text-sm text-muted">
            Gayrimenkul portföyünüzü buradan yönetin.
          </p>
        </div>
        <Link
          href="/admin/ilan/yeni"
          className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-ink-soft"
        >
          <PlusCircle size={16} /> Yeni İlan
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border border-line bg-paper p-5">
            <div className="font-display text-3xl text-ink">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-4 font-display text-xl text-ink">İlanlar</h2>
      <PropertyTable items={items} />
    </div>
  );
}
