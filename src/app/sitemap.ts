import type { MetadataRoute } from "next";
import { bots } from "@/data/bots";
import { SITE_URL, LOCALES } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });

    for (const bot of bots) {
      entries.push({
        url: `${SITE_URL}/${locale}/bot/${bot.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
