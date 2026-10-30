import type { MetadataRoute } from "next";
import { bots } from "@/data/bots";
import {
  getIndexableLocalesForBot,
} from "@/lib/localized-description";
import { SITE_URL, LOCALES } from "@/lib/utils";
// Sitemap locs: locale homes for all UI languages + bot detail only for
// indexable locales (en + zh-with-translation). GSC 404 bare /bot/:slug
// redirects already live in next.config / vercel.json (#7).

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
  }

  for (const bot of bots) {
    const indexableLocales = getIndexableLocalesForBot(bot);
    if (indexableLocales.length === 0) continue;

    const botLanguages: Record<string, string> = {};
    for (const loc of indexableLocales) {
      botLanguages[loc] = `${SITE_URL}/${loc}/bot/${bot.slug}`;
    }
    botLanguages["x-default"] = `${SITE_URL}/en/bot/${bot.slug}`;

    for (const locale of indexableLocales) {
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
