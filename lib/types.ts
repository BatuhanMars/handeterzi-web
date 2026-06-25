// Shared domain types for the real-estate site.

export type PropertyCategory = "konut" | "arsa" | "isyeri" | "ticari" | "diger";
export type ListingStatus = "satilik" | "kiralik";
export type Currency = "TRY" | "USD" | "EUR";

export interface Property {
  id: number;
  slug: string;
  title: string;
  category: PropertyCategory;
  status: ListingStatus;
  price: number;
  currency: Currency;

  city: string; // İl
  district: string; // İlçe
  neighborhood: string; // Mahalle / semt

  // Specs (optional depending on category)
  grossArea: number | null; // m² brüt
  netArea: number | null; // m² net
  rooms: string | null; // "3+1"
  bathrooms: number | null;
  buildingAge: string | null; // "0", "5-10", "20+"
  floor: string | null; // "3. Kat", "Bahçe katı"
  totalFloors: number | null;
  heating: string | null; // "Kombi (Doğalgaz)"
  furnished: number; // 0/1 eşyalı
  inSite: number; // 0/1 site içinde

  // Arsa-specific
  zoning: string | null; // İmar durumu
  blockParcel: string | null; // Ada / Parsel

  description: string;
  features: string[]; // JSON array
  images: string[]; // JSON array of /uploads/... paths
  coverImage: string | null;

  latitude: number | null;
  longitude: number | null;

  reference: string | null; // İlan no / referans

  published: number; // 0/1
  featured: number; // 0/1

  createdAt: string;
  updatedAt: string;
}

// Shape of a row as stored in SQLite (arrays are JSON strings).
export interface PropertyRow
  extends Omit<Property, "features" | "images"> {
  features: string;
  images: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  propertyId: number | null;
  read: number; // 0/1
  createdAt: string;
}

export interface PropertyFilter {
  category?: PropertyCategory;
  status?: ListingStatus;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: string;
  search?: string;
  includeUnpublished?: boolean;
  featuredOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: number;
}
