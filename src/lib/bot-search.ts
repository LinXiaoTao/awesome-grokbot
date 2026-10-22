import type { Bot, Category } from "@/types";
import { isBotOfficial } from "@/lib/utils";

const SEARCH_CATEGORY_KEYS = [
  "from-grok-bot-team",
  "sales",
  "marketing",
  "design",
  "engineering",
  "personal",
  "recruiting-people",
  "operations",
  "product",
] as const satisfies readonly Category[];

export function categoryNamesForSearch(
  translate: (key: (typeof SEARCH_CATEGORY_KEYS)[number]) => string,
): Record<string, string> {
  const names: Record<string, string> = {};
  for (const key of SEARCH_CATEGORY_KEYS) {
    names[key] = translate(key);
  }
  return names;
}

/**
 * Haystack for one bot in the active locale.
 * English description is included once; a different localized description is appended.
 * The result is lowercased so matching is case-insensitive, including CJK substrings.
 */
export function buildBotSearchText(
  bot: Bot,
  localizedDescription: string | undefined,
  categoryNames: Record<string, string>,
): string {
  const parts: string[] = [bot.name, bot.description];

  if (
    localizedDescription &&
    localizedDescription.trim() !== "" &&
    localizedDescription !== bot.description
  ) {
    parts.push(localizedDescription);
  }

  const primary = categoryNames[bot.category];
  if (primary) parts.push(primary);

  if (isBotOfficial(bot)) {
    const officialName = categoryNames["from-grok-bot-team"];
    if (officialName && officialName !== primary) {
      parts.push(officialName);
    }
  }

  if (bot.author) parts.push(bot.author);
  if (bot.authorHandle) parts.push(bot.authorHandle);
  for (const integration of bot.integrations) {
    parts.push(integration);
  }

  return parts.join("\n").toLowerCase();
}

export function buildSearchTextBySlug(
  bots: Bot[],
  localizedDescriptions: Record<string, string>,
  categoryNames: Record<string, string>,
): Record<string, string> {
  const searchTextBySlug: Record<string, string> = {};
  for (const bot of bots) {
    searchTextBySlug[bot.slug] = buildBotSearchText(
      bot,
      localizedDescriptions[bot.slug],
      categoryNames,
    );
  }
  return searchTextBySlug;
}
