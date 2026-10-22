import type { Bot } from "@/types";
import zhDescriptions from "@/data/i18n/descriptions.zh.json";

const descriptionsByLocale: Record<string, Record<string, string>> = {
  zh: zhDescriptions as Record<string, string>,
};

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
