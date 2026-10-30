import type { Bot, Category, SortOption } from "@/types";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function isBotOfficial(bot: Bot): boolean {
  return (
    bot.isOfficial === true ||
    bot.category === "from-grok-bot-team" ||
    bot.categories?.includes("From Grok Bot Team") === true
  );
}

function compareNumericIdDesc(a: Bot, b: Bot): number {
  const idDelta = Number(b.id) - Number(a.id);
  if (Number.isFinite(idDelta) && idDelta !== 0) {
    return idDelta;
  }
  return 0;
}

function compareBotsBySort(a: Bot, b: Bot, sort: SortOption): number {
  if (sort === "popular") {
    return b.installs - a.installs;
  }
  if (sort === "newest") {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    const byDate =
      (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
    if (byDate !== 0) return byDate;
    return compareNumericIdDesc(a, b);
  }
  if (sort === "name") {
    return a.name.localeCompare(b.name);
  }
  const _exhaustive: never = sort;
  return _exhaustive;
}

function compareBots(a: Bot, b: Bot, sort: SortOption): number {
  // Official-first is the primary key for the default "popular" sort and for
  // "name". "newest" is createdAt only — pinning hid new bots after the officials.
  if (sort !== "newest") {
    const officialDelta = Number(isBotOfficial(b)) - Number(isBotOfficial(a));
    if (officialDelta !== 0) {
      return officialDelta;
    }
  }
  return compareBotsBySort(a, b, sort);
}

export function filterBots(
  bots: Bot[],
  options: {
    search: string;
    category: Category;
    integration: string;
    sort: SortOption;
    /** Pre-lowercased per-bot haystack for the active locale. */
    searchTextBySlug?: Record<string, string>;
  },
): Bot[] {
  let result = [...bots];

  const query = options.search.trim().toLowerCase();
  if (query) {
    const searchTextBySlug = options.searchTextBySlug;
    result = result.filter((bot) => {
      const haystack = searchTextBySlug?.[bot.slug];
      if (haystack) {
        return haystack.includes(query);
      }
      return (
        bot.name.toLowerCase().includes(query) ||
        bot.description.toLowerCase().includes(query) ||
        bot.authorHandle?.toLowerCase().includes(query) ||
        bot.author?.toLowerCase().includes(query)
      );
    });
  }

  if (options.category !== "all") {
    if (options.category === "from-grok-bot-team") {
      result = result.filter((bot) => isBotOfficial(bot));
    } else {
      result = result.filter((bot) => bot.category === options.category);
    }
  }

  if (options.integration !== "all") {
    result = result.filter((bot) =>
      bot.integrations.some(
        (i) => i.toLowerCase() === options.integration.toLowerCase(),
      ),
    );
  }

  result.sort((a, b) => compareBots(a, b, options.sort));

  return result;
}

export function getBotBySlug(bots: Bot[], slug: string): Bot | undefined {
  return bots.find((bot) => bot.slug === slug);
}

export function getRelatedBots(bots: Bot[], bot: Bot, limit = 3): Bot[] {
  return bots
    .filter((b) => b.slug !== bot.slug && b.category === bot.category)
    .sort((a, b) => compareBots(a, b, "popular"))
    .slice(0, limit);
}

export function formatInstallCount(count: number): string {
  return count.toLocaleString();
}

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.awsomebot.com";
/** Prefer www host — Vercel 308s apex→www; apex canonicals cause index thrash. */
export const SITE_URL = RAW_SITE_URL.replace(
  "://awsomebot.com",
  "://www.awsomebot.com",
);

export const LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};
