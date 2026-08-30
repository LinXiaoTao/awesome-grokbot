"use client";

import { useTranslations } from "next-intl";
import type { Bot } from "@/types";
import { BotCard } from "./BotCard";

interface BotGridProps {
  bots: Bot[];
}

export function BotGrid({ bots }: BotGridProps) {
  const t = useTranslations("common");

  if (bots.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-black">{t("noResults")}</p>
        <p className="mt-2 text-sm text-muted">{t("tryDifferent")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {bots.map((bot, index) => (
        <BotCard key={bot.id} bot={bot} index={index} />
      ))}
    </div>
  );
}
