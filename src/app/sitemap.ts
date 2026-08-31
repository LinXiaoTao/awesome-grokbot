import type { MetadataRoute } from "next";
import { bots } from "@/data/bots";
import { SITE_URL, LOCALES } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const homeLanguages: Record<string, string> = {};
    for (const loc of LOCALES) {
      homeLanguages[loc] = `${SITE_URL}/${loc}`;
    }
    homeLanguages["x-default"] = `${SITE_URL}/en`;

    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: homeLanguages,
      },
    });

    for (const bot of bots) {
      const botLanguages: Record<string, string> = {};
      for (const loc of LOCALES) {
        botLanguages[loc] = `${SITE_URL}/${loc}/bot/${bot.slug}`;
      }
      botLanguages["x-default"] = `${SITE_URL}/en/bot/${bot.slug}`;

      entries.push({
        url: `${SITE_URL}/${locale}/bot/${bot.slug}`,
        lastModified: bot.createdAt ? new Date(bot.createdAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: botLanguages,
        },
      });
    }
  }

  return entries;
}
