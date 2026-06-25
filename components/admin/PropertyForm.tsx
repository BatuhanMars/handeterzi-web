"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X, Loader2 } from "lucide-react";
import type { Property } from "@/lib/types";
import {
  CATEGORIES,
  STATUSES,
  CURRENCIES,
  ROOM_OPTIONS,
  HEATING_OPTIONS,
  BUILDING_AGE_OPTIONS,
  ZONING_OPTIONS,
  FEATURE_OPTIONS,
} from "@/lib/constants";
import ImageUploader from "./ImageUploader";

type FormState = {
  title: string;
  category: string;
  status: string;
  price: string;
  currency: string;
  reference: string;
  city: string;
  district: string;
  neighborhood: string;
  latitude: string;
  longitude: string;
  grossArea: string;
  netArea: string;
  rooms: string;
  bathrooms: string;
  buildingAge: string;
  floor: string;
  totalFloors: string;
  heating: string;
  furnished: boolean;
  inSite: boolean;
  zoning: string;
  blockParcel: string;
  description: string;
  published: boolean;
  featured: boolean;
};

function fromProperty(p?: Property): FormState {
  return {
    title: p?.title ?? "",
    category: p?.category ?? "konut",
    status: p?.status ?? "satilik",
    price: p?.price ? String(p.price) : "",
    currency: p?.currency ?? "TRY",
    reference: p?.reference ?? "",
    city: p?.city ?? "",
    district: p?.district ?? "",
    neighborhood: p?.neighborhood ?? "",
    latitude: p?.latitude != null ? String(p.latitude) : "",
    longitude: p?.longitude != null ? String(p.longitude) : "",
    grossArea: p?.grossArea != null ? String(p.grossArea) : "",
    netArea: p?.netArea != null ? String(p.netArea) : "",
    rooms: p?.rooms ?? "",
    bathrooms: p?.bathrooms != null ? String(p.bathrooms) : "",
    buildingAge: p?.buildingAge ?? "",
    floor: p?.floor ?? "",
    totalFloors: p?.totalFloors != null ? String(p.totalFloors) : "",
    heating: p?.heating ?? "",
    furnished: !!p?.furnished,
    inSite: !!p?.inSite,
    zoning: p?.zoning ?? "",
    blockParcel: p?.blockParcel ?? "",
    description: p?.description ?? "",
    published: p ? !!p.published : true,
    featured: !!p?.featured,
  };
}

export default function PropertyForm({ initial }: { initial?: Property }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(fromProperty(initial));
  const [features, setFeatures] = useState<string[]>(initial?.features ?? []);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [coverImage, setCoverImage] = useState<string | null>(
    initial?.coverImage ?? initial?.images?.[0] ?? null,
  );
  const [customFeature, setCustomFeature] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isArsa = form.category === "arsa";
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function toggleFeature(f: string) {
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  }

  function addCustomFeature() {
    const v = customFeature.trim();
    if (v && !features.includes(v)) setFeatures((p) => [...p, v]);
    setCustomFeature("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Lütfen bir başlık girin.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      latitude: form.latitude || null,
      longitude: form.longitude || null,
      grossArea: form.grossArea || null,
      netArea: form.netArea || null,
      bathrooms: form.bathrooms || null,
      totalFloors: form.totalFloors || null,
      features,
      images,
      coverImage,
    };

    try {
      const res = await fetch(
        initial ? `/api/properties/${initial.id}` : "/api/properties",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Kaydedilemedi.");
      }
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu.");
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24">
      {error && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Temel bilgiler */}
      <Section title="Temel Bilgiler">
        <Field label="İlan Başlığı *" full>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Örn: Kadıköy Caferağa'da Deniz Manzaralı 3+1 Daire"
            className={input}
          />
        </Field>
        <Field label="İlan Tipi">
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={input}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Durum">
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={input}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Fiyat">
          <input
            type="number"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="0"
            className={input}
          />
        </Field>
        <Field label="Para Birimi">
          <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className={input}>
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="İlan No (opsiyonel)">
          <input
            value={form.reference}
            onChange={(e) => set("reference", e.target.value)}
            placeholder="Boş bırakılırsa otomatik atanır"
            className={input}
          />
        </Field>
      </Section>

      {/* Konum */}
      <Section title="Konum">
        <Field label="İl">
          <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="İstanbul" className={input} />
        </Field>
        <Field label="İlçe">
          <input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Kadıköy" className={input} />
        </Field>
        <Field label="Mahalle / Semt">
          <input value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} placeholder="Caferağa" className={input} />
        </Field>
        <Field label="Enlem (Latitude)">
          <input value={form.latitude} onChange={(e) => set("latitude", e.target.value)} placeholder="40.9876" className={input} />
        </Field>
        <Field label="Boylam (Longitude)">
          <input value={form.longitude} onChange={(e) => set("longitude", e.target.value)} placeholder="29.0345" className={input} />
        </Field>
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="text-xs text-muted">
            Enlem/boylam girilirse harita tam konuma odaklanır; boş bırakılırsa
            ilçe/mahalle bilgisi kullanılır.
          </p>
        </div>
      </Section>

      {/* Detaylar */}
      <Section title={isArsa ? "Arsa Detayları" : "Konut Detayları"}>
        <Field label="Brüt Alan (m²)">
          <input type="number" value={form.grossArea} onChange={(e) => set("grossArea", e.target.value)} className={input} />
        </Field>
        <Field label="Net Alan (m²)">
          <input type="number" value={form.netArea} onChange={(e) => set("netArea", e.target.value)} className={input} />
        </Field>

        {isArsa ? (
          <>
            <Field label="İmar Durumu">
              <select value={form.zoning} onChange={(e) => set("zoning", e.target.value)} className={input}>
                <option value="">Seçiniz</option>
                {ZONING_OPTIONS.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </Field>
            <Field label="Ada / Parsel">
              <input value={form.blockParcel} onChange={(e) => set("blockParcel", e.target.value)} placeholder="123 / 45" className={input} />
            </Field>
          </>
        ) : (
          <>
            <Field label="Oda Sayısı">
              <input
                list="room-options"
                value={form.rooms}
                onChange={(e) => set("rooms", e.target.value)}
                placeholder="3+1"
                className={input}
              />
              <datalist id="room-options">
                {ROOM_OPTIONS.map((r) => (
                  <option key={r} value={r.trim()} />
                ))}
              </datalist>
            </Field>
            <Field label="Banyo Sayısı">
              <input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={input} />
            </Field>
            <Field label="Bina Yaşı">
              <select value={form.buildingAge} onChange={(e) => set("buildingAge", e.target.value)} className={input}>
                <option value="">Seçiniz</option>
                {BUILDING_AGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Bulunduğu Kat">
              <input value={form.floor} onChange={(e) => set("floor", e.target.value)} placeholder="3. Kat" className={input} />
            </Field>
            <Field label="Kat Sayısı">
              <input type="number" value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} className={input} />
            </Field>
            <Field label="Isıtma">
              <select value={form.heating} onChange={(e) => set("heating", e.target.value)} className={input}>
                <option value="">Seçiniz</option>
                {HEATING_OPTIONS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </Field>
            <div className="flex items-end gap-6 sm:col-span-2 lg:col-span-3">
              <Check label="Eşyalı" checked={form.furnished} onChange={(v) => set("furnished", v)} />
              <Check label="Site İçinde" checked={form.inSite} onChange={(v) => set("inSite", v)} />
            </div>
          </>
        )}
      </Section>

      {/* Özellikler */}
      <Section title="Özellikler" single>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURE_OPTIONS.map((f) => (
            <Check key={f} label={f} checked={features.includes(f)} onChange={() => toggleFeature(f)} />
          ))}
        </div>
        {features.filter((f) => !FEATURE_OPTIONS.includes(f)).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {features
              .filter((f) => !FEATURE_OPTIONS.includes(f))
              .map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs text-ink">
                  {f}
                  <button type="button" onClick={() => toggleFeature(f)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <input
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomFeature();
              }
            }}
            placeholder="Özel özellik ekle (örn: Akıllı ev sistemi)"
            className={`${input} max-w-xs`}
          />
          <button
            type="button"
            onClick={addCustomFeature}
            className="inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-2 text-sm text-ink hover:border-ink"
          >
            <Plus size={15} /> Ekle
          </button>
        </div>
      </Section>

      {/* Görseller */}
      <Section title="Fotoğraflar" single>
        <ImageUploader
          images={images}
          coverImage={coverImage}
          onChange={(imgs, cover) => {
            setImages(imgs);
            setCoverImage(cover);
          }}
        />
      </Section>

      {/* Açıklama */}
      <Section title="Açıklama" single>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={7}
          placeholder="Gayrimenkulü detaylı şekilde tanıtın: konum avantajları, oda dağılımı, manzara, ulaşım, çevre, yatırım potansiyeli..."
          className={`${input} resize-y`}
        />
      </Section>

      {/* Yayın */}
      <Section title="Yayın Ayarları" single>
        <div className="flex flex-wrap gap-8">
          <Check label="Sitede yayınla" checked={form.published} onChange={(v) => set("published", v)} />
          <Check label="Ana sayfada öne çıkar" checked={form.featured} onChange={(v) => set("featured", v)} />
        </div>
      </Section>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <span className="hidden text-sm text-muted sm:block">
            {initial ? "İlanı düzenliyorsunuz" : "Yeni ilan oluşturuyorsunuz"}
          </span>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="flex-1 rounded-sm border border-line px-5 py-2.5 text-sm text-ink hover:border-ink sm:flex-none"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-ink px-6 py-2.5 text-sm text-paper transition-colors hover:bg-ink-soft disabled:opacity-60 sm:flex-none"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {initial ? "Değişiklikleri Kaydet" : "İlanı Yayınla"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

const input =
  "w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink";

function Section({
  title,
  children,
  single,
}: {
  title: string;
  children: React.ReactNode;
  single?: boolean;
}) {
  return (
    <section className="rounded-sm border border-line bg-paper p-5 sm:p-6">
      <h2 className="mb-4 font-display text-lg text-ink">{title}</h2>
      {single ? (
        children
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      )}
    </section>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2 lg:col-span-3" : ""}`}>
      <span className="mb-1.5 block text-sm text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded-sm border-line accent-[#1a1816]"
      />
      {label}
    </label>
  );
}
