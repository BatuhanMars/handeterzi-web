"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, STATUSES, ROOM_OPTIONS } from "@/lib/constants";

export default function PropertyFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [showMore, setShowMore] = useState(false);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.push(`/portfoy?${next.toString()}`));
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("q", search.trim());
  };

  const clearAll = () => {
    setSearch("");
    startTransition(() => router.push("/portfoy"));
  };

  const hasFilters = Array.from(params.keys()).length > 0;

  const selectClass =
    "w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

  return (
    <div className="rounded-sm border border-line bg-paper p-4 sm:p-5">
      <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Konum, başlık veya anahtar kelime ara..."
            className="w-full rounded-sm border border-line bg-paper py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-ink"
          />
        </div>
        <button
          type="submit"
          className="rounded-sm bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-ink-soft"
        >
          Ara
        </button>
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-line px-4 py-2.5 text-sm text-ink-soft hover:border-ink hover:text-ink"
        >
          <SlidersHorizontal size={15} /> Filtreler
        </button>
      </form>

      <div
        className={`grid gap-3 overflow-hidden transition-all sm:grid-cols-2 lg:grid-cols-5 ${
          showMore ? "mt-4 max-h-[600px]" : "max-h-0 sm:mt-4 sm:max-h-[600px]"
        }`}
      >
        <select
          value={params.get("durum") ?? ""}
          onChange={(e) => setParam("durum", e.target.value)}
          className={selectClass}
        >
          <option value="">Tüm İlanlar</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={params.get("tip") ?? ""}
          onChange={(e) => setParam("tip", e.target.value)}
          className={selectClass}
        >
          <option value="">Tüm Tipler</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={params.get("sehir") ?? ""}
          onChange={(e) => setParam("sehir", e.target.value)}
          className={selectClass}
        >
          <option value="">Tüm Şehirler</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={params.get("oda") ?? ""}
          onChange={(e) => setParam("oda", e.target.value)}
          className={selectClass}
        >
          <option value="">Oda Sayısı</option>
          {ROOM_OPTIONS.map((r) => (
            <option key={r} value={r.trim()}>{r.trim()}</option>
          ))}
        </select>

        <select
          value={params.get("sirala") ?? ""}
          onChange={(e) => setParam("sirala", e.target.value)}
          className={selectClass}
        >
          <option value="">Sıralama: Önerilen</option>
          <option value="newest">En Yeni</option>
          <option value="price_asc">Fiyat (Artan)</option>
          <option value="price_desc">Fiyat (Azalan)</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink"
        >
          <X size={13} /> Filtreleri temizle
          {isPending && <span className="ml-1 animate-pulse">·</span>}
        </button>
      )}
    </div>
  );
}
