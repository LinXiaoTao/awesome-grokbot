import type { Bot } from "@/types";
import type { Locale } from "@/lib/utils";
import zhDescriptions from "@/data/i18n/descriptions.zh.json";

const descriptionsByLocale: Record<string, Record<string, string>> = {
  zh: zhDescriptions as Record<string, string>,
};

/** Min English description length for sitemap / index eligibility. */
export const MIN_INDEXABLE_DESCRIPTION_LENGTH = 40;

function translatedDescription(
  slug: string,
  locale: string,
): string | undefined {
  const text = descriptionsByLocale[locale]?.[slug];
  if (typeof text === "string" && text.trim() !== "") {
    return text;
  }
  return undefined;
}

/** zh translation when present, otherwise the English description. */
export function getLocalizedDescription(
  bot: Pick<Bot, "slug" | "description">,
  locale: string,
): string {
  return translatedDescription(bot.slug, locale) ?? bot.description;
}

/** Sparse map of slug → translated description for the active locale. */
export function getLocalizedDescriptionOverrides(
  locale: string,
): Record<string, string> {
  const table = descriptionsByLocale[locale];
  if (!table) return {};

  const overrides: Record<string, string> = {};
  for (const [slug, text] of Object.entries(table)) {
    if (typeof text === "string" && text.trim() !== "") {
      overrides[slug] = text;
    }
  }
  return overrides;
}

/** True when this locale has a real bot-body translation (not English fallback). */
export function hasLocalizedDescription(slug: string, locale: string): boolean {
  if (locale === "en") return true;
  return translatedDescription(slug, locale) !== undefined;
}

/** Empty / stub English descriptions should not solicit crawls. */
export function isBotIndexableContent(
  bot: Pick<Bot, "description">,
): boolean {
  return (bot.description?.trim().length ?? 0) >= MIN_INDEXABLE_DESCRIPTION_LENGTH;
}

/**
 * Locales worth listing in sitemap / hreflang for a bot.
 * en = source; zh = only when a Chinese description exists.
 * ja/ko/es/fr/de keep UI chrome but reuse English bodies → thin duplicates,
 * so they stay out of the sitemap (pages remain reachable + noindex).
 */
export function getIndexableLocalesForBot(
  bot: Pick<Bot, "slug" | "description">,
): Locale[] {
  if (!isBotIndexableContent(bot)) return [];
  const locales: Locale[] = ["en"];
  if (hasLocalizedDescription(bot.slug, "zh")) {
    locales.push("zh");
  }
  return locales;
}

/** Whether crawlers should index this locale's bot detail page. */
export function shouldIndexBotPage(
  bot: Pick<Bot, "slug" | "description">,
  locale: string,
): boolean {
  if (!isBotIndexableContent(bot)) return false;
  if (locale === "en") return true;
  return hasLocalizedDescription(bot.slug, locale);
}
