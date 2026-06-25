import type {
  Currency,
  ListingStatus,
  PropertyCategory,
} from "./types";

export const CATEGORIES: { value: PropertyCategory; label: string }[] = [
  { value: "konut", label: "Konut" },
  { value: "arsa", label: "Arsa" },
  { value: "isyeri", label: "İş Yeri" },
  { value: "ticari", label: "Ticari" },
  { value: "diger", label: "Diğer" },
];

export const STATUSES: { value: ListingStatus; label: string }[] = [
  { value: "satilik", label: "Satılık" },
  { value: "kiralik", label: "Kiralık" },
];

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "TRY", label: "Türk Lirası (₺)", symbol: "₺" },
  { value: "USD", label: "Dolar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
];

export const ROOM_OPTIONS = [
  "1+0",
  "1+1",
  "2+1",
  "3+1",
  "4+1",
  "4+2",
  "5+1",
  "5+2",
  "6+ ",
];

export const HEATING_OPTIONS = [
  "Kombi (Doğalgaz)",
  "Merkezi (Doğalgaz)",
  "Merkezi (Pay Ölçer)",
  "Yerden Isıtma",
  "Klima",
  "Soba",
  "Şömine",
  "Isıtma Yok",
];

export const BUILDING_AGE_OPTIONS = [
  "0 (Sıfır)",
  "1",
  "2",
  "3",
  "4",
  "5-10",
  "11-15",
  "16-20",
  "21-25",
  "26-30",
  "31 ve üzeri",
];

export const ZONING_OPTIONS = [
  "Konut İmarlı",
  "Ticari İmarlı",
  "Konut + Ticari",
  "Sanayi İmarlı",
  "Turizm İmarlı",
  "Tarla",
  "Bağ - Bahçe",
  "Zeytinlik",
  "İmarsız",
];

// Common property amenities offered as toggles in the admin form.
export const FEATURE_OPTIONS = [
  "Asansör",
  "Otopark",
  "Kapalı Otopark",
  "Balkon",
  "Teras",
  "Bahçe",
  "Eşyalı",
  "Site İçinde",
  "Güvenlik",
  "Yüzme Havuzu",
  "Spor Salonu",
  "Çocuk Oyun Alanı",
  "Doğalgaz",
  "Ankastre Mutfak",
  "Ebeveyn Banyosu",
  "Giyinme Odası",
  "Çelik Kapı",
  "Görüntülü Diafon",
  "Isı Yalıtımı",
  "Deniz Manzarası",
  "Doğa Manzarası",
  "Krediye Uygun",
];

// A short list of common Turkish provinces for the filter dropdown.
// The admin can type any city freely; this is only a convenience list.
export const COMMON_CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Muğla",
  "Kocaeli",
  "Tekirdağ",
  "Balıkesir",
  "Aydın",
];

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function statusLabel(value: string): string {
  return STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function currencySymbol(value: string): string {
  return CURRENCIES.find((c) => c.value === value)?.symbol ?? "₺";
}
