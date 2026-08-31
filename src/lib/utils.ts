import type { Bot, Category, SortOption } from "@/types";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function filterBots(
  bots: Bot[],
  options: {
    search: string;
    category: Category;
    integration: string;
    sort: SortOption;
  },
): Bot[] {
  let result = [...bots];

  if (options.search.trim()) {
    const query = options.search.toLowerCase();
    result = result.filter(
      (bot) =>
        bot.name.toLowerCase().includes(query) ||
        bot.description.toLowerCase().includes(query) ||
        bot.authorHandle?.toLowerCase().includes(query) ||
        bot.author?.toLowerCase().includes(query),
    );
  }

  if (options.category !== "all") {
    result = result.filter((bot) => bot.category === options.category);
  }

  if (options.integration !== "all") {
    result = result.filter((bot) =>
      bot.integrations.some(
        (i) => i.toLowerCase() === options.integration.toLowerCase(),
      ),
    );
  }

  if (options.sort === "popular") {
    result.sort((a, b) => b.installs - a.installs);
  } else if (options.sort === "newest") {
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (options.sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

export function getBotBySlug(bots: Bot[], slug: string): Bot | undefined {
  return bots.find((bot) => bot.slug === slug);
}

export function getRelatedBots(bots: Bot[], bot: Bot, limit = 3): Bot[] {
  return bots
    .filter((b) => b.slug !== bot.slug && b.category === bot.category)
    .sort((a, b) => b.installs - a.installs)
    .slice(0, limit);
}

export function formatInstallCount(count: number): string {
  return count.toLocaleString();
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://awsomebot.com";

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
