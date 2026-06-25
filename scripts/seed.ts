/**
 * Demo ilan verisini veritabanına ekler. Görseller repoya dahil edilen statik
 * dosyalardır (public/uploads/seed-*.jpg) — indirme yapılmaz.
 *
 * Not: Veritabanı boşsa uygulama bunu zaten otomatik ekler (lib/db.ts).
 * Bu script yalnızca elle yeniden kurmak için.
 *
 * Çalıştırma:  npm run seed              (veri varsa atlar)
 *              npm run seed -- --force   (mevcut ilanları silip yeniden kurar)
 */
import { getDb } from "../lib/db";
import { createProperty, countProperties } from "../lib/properties";
import { SEED_LISTINGS } from "../lib/seed-data";

function main() {
  const force = process.argv.includes("--force");

  if (countProperties() > 0 && !force) {
    console.log(
      "Veritabanında zaten ilan var. Yeniden kurmak için: npm run seed -- --force",
    );
    return;
  }

  if (force) {
    getDb().exec("DELETE FROM properties;");
    console.log("Mevcut ilanlar silindi.");
  }

  let n = 0;
  for (const listing of SEED_LISTINGS) {
    createProperty(listing);
    n++;
  }
  console.log(`\n✓ ${n} ilan eklendi.`);
}

main();
