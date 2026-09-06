import { bots } from "@/data/bots";
import { isBotOfficial } from "@/lib/utils";
import type { Bot } from "@/types";

/** Filter tabs excluding "all" — matches hero statsCategories copy. */
export const DIRECTORY_CATEGORY_COUNT = 9;

export interface BotDirectoryStats {
  total: number;
  official: number;
  categories: number;
}

export function computeBotDirectoryStats(
  botList: Bot[] = bots,
): BotDirectoryStats {
  return {
    total: botList.length,
    official: botList.filter(isBotOfficial).length,
    categories: DIRECTORY_CATEGORY_COUNT,
  };
}
