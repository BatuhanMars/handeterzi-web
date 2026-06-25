import type { MetadataRoute } from "next";
import { listProperties } from "@/lib/properties";

const BASE = "https://www.handeterzi.com.tr";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/portfoy", "/hakkimizda", "/iletisim"].map(
    (p) => ({
      url: `${BASE}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    }),
  );

  const properties = listProperties().map((p) => ({
    url: `${BASE}/portfoy/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...properties];
}
