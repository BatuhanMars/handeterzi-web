import type { PropertyInput } from "./properties";
import type {
  Currency,
  ListingStatus,
  PropertyCategory,
} from "./types";

const CATEGORIES = ["konut", "arsa", "isyeri", "ticari", "diger"];
const STATUSES = ["satilik", "kiralik"];
const CURRENCIES = ["TRY", "USD", "EUR"];

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v);
}

export function parsePropertyInput(body: Record<string, unknown>): {
  ok: true;
  data: PropertyInput;
} | { ok: false; error: string } {
  const title = str(body.title);
  if (!title) return { ok: false, error: "Başlık zorunludur." };

  const category = str(body.category);
  if (!CATEGORIES.includes(category))
    return { ok: false, error: "Geçersiz ilan tipi." };

  const status = str(body.status);
  if (!STATUSES.includes(status))
    return { ok: false, error: "Geçersiz ilan durumu." };

  const currency = CURRENCIES.includes(str(body.currency))
    ? (str(body.currency) as Currency)
    : "TRY";

  const features = Array.isArray(body.features)
    ? (body.features as unknown[]).map(str).filter(Boolean)
    : [];
  const images = Array.isArray(body.images)
    ? (body.images as unknown[]).map(str).filter(Boolean)
    : [];

  const data: PropertyInput = {
    title,
    category: category as PropertyCategory,
    status: status as ListingStatus,
    price: num(body.price) ?? 0,
    currency,
    city: str(body.city),
    district: str(body.district),
    neighborhood: str(body.neighborhood),
    grossArea: num(body.grossArea),
    netArea: num(body.netArea),
    rooms: str(body.rooms) || null,
    bathrooms: num(body.bathrooms),
    buildingAge: str(body.buildingAge) || null,
    floor: str(body.floor) || null,
    totalFloors: num(body.totalFloors),
    heating: str(body.heating) || null,
    furnished: body.furnished ? 1 : 0,
    inSite: body.inSite ? 1 : 0,
    zoning: str(body.zoning) || null,
    blockParcel: str(body.blockParcel) || null,
    description: str(body.description),
    features,
    images,
    coverImage: str(body.coverImage) || images[0] || null,
    latitude: num(body.latitude),
    longitude: num(body.longitude),
    reference: str(body.reference) || null,
    published: body.published ? 1 : 0,
    featured: body.featured ? 1 : 0,
    slug: str(body.slug) || undefined,
  };

  return { ok: true, data };
}
