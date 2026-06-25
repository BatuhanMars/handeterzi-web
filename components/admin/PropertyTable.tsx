"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Star,
  Pencil,
  Trash2,
  ImageOff,
  ExternalLink,
} from "lucide-react";
import type { Property } from "@/lib/types";
import { categoryLabel, statusLabel } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

export default function PropertyTable({ items }: { items: Property[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function patch(id: number, body: Record<string, boolean>) {
    setBusy(id);
    await fetch(`/api/properties/${id}/visibility`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(id: number, title: string) {
    if (!confirm(`"${title}" ilanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`))
      return;
    setBusy(id);
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-line bg-paper p-12 text-center">
        <p className="font-display text-lg text-ink">Henüz ilan yok</p>
        <p className="mt-1 text-sm text-muted">
          İlk gayrimenkul ilanınızı eklemek için “Yeni İlan”a tıklayın.
        </p>
        <Link
          href="/admin/ilan/yeni"
          className="mt-5 inline-flex rounded-sm bg-ink px-5 py-2.5 text-sm text-paper hover:bg-ink-soft"
        >
          Yeni İlan Ekle
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-paper">
      <ul className="divide-y divide-line">
        {items.map((p) => {
          const cover = p.coverImage || p.images[0];
          const isBusy = busy === p.id;
          return (
            <li
              key={p.id}
              className={`flex flex-col gap-4 p-4 transition-opacity sm:flex-row sm:items-center ${
                isBusy ? "opacity-50" : ""
              }`}
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-sand-deep">
                {cover ? (
                  <Image src={cover} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <ImageOff size={18} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm border border-line px-1.5 py-0.5 text-[0.62rem] uppercase tracking-wide text-muted">
                    {statusLabel(p.status)}
                  </span>
                  <span className="rounded-sm border border-line px-1.5 py-0.5 text-[0.62rem] uppercase tracking-wide text-muted">
                    {categoryLabel(p.category)}
                  </span>
                  {!p.published && (
                    <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 text-[0.62rem] uppercase tracking-wide text-amber-700">
                      Taslak
                    </span>
                  )}
                  {p.featured ? (
                    <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 text-[0.62rem] uppercase tracking-wide text-accent-dark">
                      Öne Çıkan
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 truncate font-medium text-ink">{p.title}</div>
                <div className="text-xs text-muted">
                  {[p.district, p.city].filter(Boolean).join(", ")} ·{" "}
                  {p.reference} · {formatPrice(p.price, p.currency)}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <IconBtn
                  title={p.published ? "Yayından kaldır" : "Yayınla"}
                  onClick={() => patch(p.id, { published: !p.published })}
                  active={!!p.published}
                >
                  {p.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </IconBtn>
                <IconBtn
                  title={p.featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                  onClick={() => patch(p.id, { featured: !p.featured })}
                  active={!!p.featured}
                >
                  <Star size={16} className={p.featured ? "fill-current" : ""} />
                </IconBtn>
                <a
                  href={`/portfoy/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Sitede gör"
                  className="flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-sand hover:text-ink"
                >
                  <ExternalLink size={16} />
                </a>
                <Link
                  href={`/admin/ilan/${p.id}`}
                  title="Düzenle"
                  className="flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-sand hover:text-ink"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => remove(p.id, p.title)}
                  title="Sil"
                  className="flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  active,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors hover:bg-sand ${
        active ? "text-accent-dark" : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
