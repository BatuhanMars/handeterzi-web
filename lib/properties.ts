import { getDb } from "./db";
import { slugify } from "./format";
import type {
  ContactMessage,
  Property,
  PropertyFilter,
  PropertyRow,
} from "./types";

export type PropertyInput = Omit<
  Property,
  "id" | "slug" | "createdAt" | "updatedAt" | "reference"
> & { slug?: string; reference?: string | null };

function rowToProperty(row: PropertyRow): Property {
  return {
    ...row,
    features: safeParseArray(row.features),
    images: safeParseArray(row.images),
  };
}

function safeParseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function uniqueSlug(base: string, ignoreId?: number): string {
  const db = getDb();
  const slug = slugify(base) || "ilan";
  let candidate = slug;
  let n = 2;
  while (true) {
    const row = db
      .prepare("SELECT id FROM properties WHERE slug = ?")
      .get(candidate) as { id: number } | undefined;
    if (!row || row.id === ignoreId) return candidate;
    candidate = `${slug}-${n++}`;
  }
}

const COLUMNS = `
  id, slug, title, category, status, price, currency,
  city, district, neighborhood,
  grossArea, netArea, rooms, bathrooms, buildingAge, floor, totalFloors,
  heating, furnished, inSite, zoning, blockParcel,
  description, features, images, coverImage,
  latitude, longitude, reference, published, featured,
  createdAt, updatedAt
`;

export function listProperties(filter: PropertyFilter = {}): Property[] {
  const db = getDb();
  const where: string[] = [];
  const params: unknown[] = [];

  if (!filter.includeUnpublished) where.push("published = 1");
  if (filter.featuredOnly) where.push("featured = 1");
  if (filter.category) {
    where.push("category = ?");
    params.push(filter.category);
  }
  if (filter.status) {
    where.push("status = ?");
    params.push(filter.status);
  }
  if (filter.city) {
    where.push("city = ?");
    params.push(filter.city);
  }
  if (filter.district) {
    where.push("district = ?");
    params.push(filter.district);
  }
  if (filter.rooms) {
    where.push("rooms = ?");
    params.push(filter.rooms);
  }
  if (typeof filter.minPrice === "number") {
    where.push("price >= ?");
    params.push(filter.minPrice);
  }
  if (typeof filter.maxPrice === "number") {
    where.push("price <= ?");
    params.push(filter.maxPrice);
  }
  if (filter.search) {
    where.push(
      "(title LIKE ? OR description LIKE ? OR city LIKE ? OR district LIKE ? OR neighborhood LIKE ?)",
    );
    const q = `%${filter.search}%`;
    params.push(q, q, q, q, q);
  }

  let order = "featured DESC, datetime(createdAt) DESC";
  if (filter.sort === "price_asc") order = "price ASC";
  else if (filter.sort === "price_desc") order = "price DESC";
  else if (filter.sort === "newest") order = "datetime(createdAt) DESC";

  const limit = filter.limit ? `LIMIT ${Number(filter.limit)}` : "";
  const sql = `SELECT ${COLUMNS} FROM properties ${
    where.length ? "WHERE " + where.join(" AND ") : ""
  } ORDER BY ${order} ${limit}`;

  const rows = db.prepare(sql).all(...params) as PropertyRow[];
  return rows.map(rowToProperty);
}

export function getPropertyBySlug(
  slug: string,
  includeUnpublished = false,
): Property | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT ${COLUMNS} FROM properties WHERE slug = ?`)
    .get(slug) as PropertyRow | undefined;
  if (!row) return null;
  if (!includeUnpublished && !row.published) return null;
  return rowToProperty(row);
}

export function getPropertyById(id: number): Property | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT ${COLUMNS} FROM properties WHERE id = ?`)
    .get(id) as PropertyRow | undefined;
  return row ? rowToProperty(row) : null;
}

export function createProperty(input: PropertyInput): Property {
  const db = getDb();
  const slug = uniqueSlug(input.slug || input.title);

  const stmt = db.prepare(`
    INSERT INTO properties (
      slug, title, category, status, price, currency,
      city, district, neighborhood,
      grossArea, netArea, rooms, bathrooms, buildingAge, floor, totalFloors,
      heating, furnished, inSite, zoning, blockParcel,
      description, features, images, coverImage,
      latitude, longitude, reference, published, featured
    ) VALUES (
      @slug, @title, @category, @status, @price, @currency,
      @city, @district, @neighborhood,
      @grossArea, @netArea, @rooms, @bathrooms, @buildingAge, @floor, @totalFloors,
      @heating, @furnished, @inSite, @zoning, @blockParcel,
      @description, @features, @images, @coverImage,
      @latitude, @longitude, @reference, @published, @featured
    )
  `);

  const info = stmt.run(serialize({ ...input, slug }));
  const id = Number(info.lastInsertRowid);

  // Auto reference number if none provided.
  if (!input.reference) {
    db.prepare("UPDATE properties SET reference = ? WHERE id = ?").run(
      `HT${String(id).padStart(4, "0")}`,
      id,
    );
  }
  return getPropertyById(id)!;
}

export function updateProperty(
  id: number,
  input: PropertyInput,
): Property | null {
  const db = getDb();
  const existing = getPropertyById(id);
  if (!existing) return null;
  const slug = uniqueSlug(input.slug || input.title, id);

  db.prepare(`
    UPDATE properties SET
      slug=@slug, title=@title, category=@category, status=@status,
      price=@price, currency=@currency,
      city=@city, district=@district, neighborhood=@neighborhood,
      grossArea=@grossArea, netArea=@netArea, rooms=@rooms, bathrooms=@bathrooms,
      buildingAge=@buildingAge, floor=@floor, totalFloors=@totalFloors,
      heating=@heating, furnished=@furnished, inSite=@inSite,
      zoning=@zoning, blockParcel=@blockParcel,
      description=@description, features=@features, images=@images,
      coverImage=@coverImage, latitude=@latitude, longitude=@longitude,
      reference=@reference, published=@published, featured=@featured,
      updatedAt=datetime('now')
    WHERE id=@id
  `).run({ ...serialize({ ...input, slug }), id, reference: input.reference ?? existing.reference });

  return getPropertyById(id);
}

export function deleteProperty(id: number): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM properties WHERE id = ?").run(id);
  return info.changes > 0;
}

export function setPublished(id: number, published: boolean): void {
  getDb()
    .prepare("UPDATE properties SET published = ?, updatedAt = datetime('now') WHERE id = ?")
    .run(published ? 1 : 0, id);
}

export function setFeatured(id: number, featured: boolean): void {
  getDb()
    .prepare("UPDATE properties SET featured = ?, updatedAt = datetime('now') WHERE id = ?")
    .run(featured ? 1 : 0, id);
}

export function distinctCities(): string[] {
  const rows = getDb()
    .prepare(
      "SELECT DISTINCT city FROM properties WHERE published = 1 AND city <> '' ORDER BY city",
    )
    .all() as { city: string }[];
  return rows.map((r) => r.city);
}

export function countProperties(includeUnpublished = true): number {
  const sql = includeUnpublished
    ? "SELECT COUNT(*) c FROM properties"
    : "SELECT COUNT(*) c FROM properties WHERE published = 1";
  return (getDb().prepare(sql).get() as { c: number }).c;
}

// Convert a PropertyInput into the flat param object SQLite expects.
function serialize(input: PropertyInput & { slug: string }) {
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    status: input.status,
    price: input.price ?? 0,
    currency: input.currency ?? "TRY",
    city: input.city ?? "",
    district: input.district ?? "",
    neighborhood: input.neighborhood ?? "",
    grossArea: nz(input.grossArea),
    netArea: nz(input.netArea),
    rooms: input.rooms || null,
    bathrooms: nz(input.bathrooms),
    buildingAge: input.buildingAge || null,
    floor: input.floor || null,
    totalFloors: nz(input.totalFloors),
    heating: input.heating || null,
    furnished: input.furnished ? 1 : 0,
    inSite: input.inSite ? 1 : 0,
    zoning: input.zoning || null,
    blockParcel: input.blockParcel || null,
    description: input.description ?? "",
    features: JSON.stringify(input.features ?? []),
    images: JSON.stringify(input.images ?? []),
    coverImage: input.coverImage || null,
    latitude: nz(input.latitude),
    longitude: nz(input.longitude),
    reference: input.reference ?? null,
    published: input.published ? 1 : 0,
    featured: input.featured ? 1 : 0,
  };
}

function nz(v: number | null | undefined): number | null {
  if (v === null || v === undefined) return null;
  return Number.isFinite(Number(v)) ? Number(v) : null;
}

/* ----------------------------- Messages ----------------------------- */

export function createMessage(input: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  propertyId?: number | null;
}): number {
  const info = getDb()
    .prepare(
      `INSERT INTO messages (name, email, phone, subject, message, propertyId)
       VALUES (@name, @email, @phone, @subject, @message, @propertyId)`,
    )
    .run({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject ?? null,
      message: input.message,
      propertyId: input.propertyId ?? null,
    });
  return Number(info.lastInsertRowid);
}

export function listMessages(): ContactMessage[] {
  return getDb()
    .prepare("SELECT * FROM messages ORDER BY datetime(createdAt) DESC")
    .all() as ContactMessage[];
}

export function unreadMessageCount(): number {
  return (
    getDb().prepare("SELECT COUNT(*) c FROM messages WHERE read = 0").get() as {
      c: number;
    }
  ).c;
}

export function markMessageRead(id: number, read = true): void {
  getDb()
    .prepare("UPDATE messages SET read = ? WHERE id = ?")
    .run(read ? 1 : 0, id);
}

export function deleteMessage(id: number): boolean {
  return getDb().prepare("DELETE FROM messages WHERE id = ?").run(id).changes > 0;
}
