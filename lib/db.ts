import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { slugify } from "./format";
import { SEED_LISTINGS } from "./seed-data";

// On serverless platforms (Vercel, AWS Lambda) the deployment filesystem is
// read-only except for /tmp, which is ephemeral. Locally we keep the DB under
// /data so it persists. On serverless we use /tmp and auto-seed demo data so
// the site is fully viewable for review (writes won't survive a cold start).
const IS_SERVERLESS =
  !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = IS_SERVERLESS ? "/tmp" : path.join(process.cwd(), "data");
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, "app.db");

// Reuse a single connection across hot reloads in dev.
const globalForDb = globalThis as unknown as {
  __handeterziDb?: Database.Database;
};

function createConnection(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT NOT NULL UNIQUE,
      title         TEXT NOT NULL,
      category      TEXT NOT NULL,
      status        TEXT NOT NULL,
      price         REAL NOT NULL DEFAULT 0,
      currency      TEXT NOT NULL DEFAULT 'TRY',

      city          TEXT NOT NULL DEFAULT '',
      district      TEXT NOT NULL DEFAULT '',
      neighborhood  TEXT NOT NULL DEFAULT '',

      grossArea     REAL,
      netArea       REAL,
      rooms         TEXT,
      bathrooms     INTEGER,
      buildingAge   TEXT,
      floor         TEXT,
      totalFloors   INTEGER,
      heating       TEXT,
      furnished     INTEGER NOT NULL DEFAULT 0,
      inSite        INTEGER NOT NULL DEFAULT 0,

      zoning        TEXT,
      blockParcel   TEXT,

      description   TEXT NOT NULL DEFAULT '',
      features      TEXT NOT NULL DEFAULT '[]',
      images        TEXT NOT NULL DEFAULT '[]',
      coverImage    TEXT,

      latitude      REAL,
      longitude     REAL,

      reference     TEXT,

      published     INTEGER NOT NULL DEFAULT 1,
      featured      INTEGER NOT NULL DEFAULT 0,

      createdAt     TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_properties_published ON properties(published);
    CREATE INDEX IF NOT EXISTS idx_properties_category  ON properties(category);
    CREATE INDEX IF NOT EXISTS idx_properties_status    ON properties(status);

    CREATE TABLE IF NOT EXISTS messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT,
      subject     TEXT,
      message     TEXT NOT NULL,
      propertyId  INTEGER,
      read        INTEGER NOT NULL DEFAULT 0,
      createdAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

const nz = (v: number | null | undefined): number | null =>
  v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v);

// Insert demo listings when the table is empty. Uses raw SQL (no dependency on
// properties.ts) to avoid an import cycle. Runs once per fresh database.
function seedIfEmpty(db: Database.Database) {
  const { c } = db.prepare("SELECT COUNT(*) c FROM properties").get() as {
    c: number;
  };
  if (c > 0) return;

  const insert = db.prepare(`
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

  const tx = db.transaction(() => {
    SEED_LISTINGS.forEach((p, i) => {
      insert.run({
        slug: slugify(p.title) || `ilan-${i + 1}`,
        title: p.title,
        category: p.category,
        status: p.status,
        price: p.price ?? 0,
        currency: p.currency ?? "TRY",
        city: p.city ?? "",
        district: p.district ?? "",
        neighborhood: p.neighborhood ?? "",
        grossArea: nz(p.grossArea),
        netArea: nz(p.netArea),
        rooms: p.rooms || null,
        bathrooms: nz(p.bathrooms),
        buildingAge: p.buildingAge || null,
        floor: p.floor || null,
        totalFloors: nz(p.totalFloors),
        heating: p.heating || null,
        furnished: p.furnished ? 1 : 0,
        inSite: p.inSite ? 1 : 0,
        zoning: p.zoning || null,
        blockParcel: p.blockParcel || null,
        description: p.description ?? "",
        features: JSON.stringify(p.features ?? []),
        images: JSON.stringify(p.images ?? []),
        coverImage: p.coverImage || p.images?.[0] || null,
        latitude: nz(p.latitude),
        longitude: nz(p.longitude),
        reference: p.reference || `HT${String(i + 1).padStart(4, "0")}`,
        published: p.published ? 1 : 0,
        featured: p.featured ? 1 : 0,
      });
    });
  });
  tx();
}

export function getDb(): Database.Database {
  if (!globalForDb.__handeterziDb) {
    const db = createConnection();
    globalForDb.__handeterziDb = db; // set before seeding to avoid re-entry
    try {
      seedIfEmpty(db);
    } catch (e) {
      console.warn("Otomatik seed atlandı:", (e as Error).message);
    }
  }
  return globalForDb.__handeterziDb;
}
