import { currencySymbol } from "./constants";

// "2.450.000 ₺"
export function formatPrice(price: number, currency: string): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(price || 0);
  return `${formatted} ${currencySymbol(currency)}`;
}

export function formatArea(area: number | null): string {
  if (!area) return "—";
  return `${new Intl.NumberFormat("tr-TR").format(area)} m²`;
}

export function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value.replace(" ", "T") + "Z"));
  } catch {
    return value;
  }
}

const TR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ç: "c",
  Ğ: "g",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};

export function slugify(input: string): string {
  return input
    .trim()
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
