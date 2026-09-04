"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Bot } from "@/types";
import { Link } from "@/i18n/routing";
import { BotIcon } from "./BotIcon";
import { IntegrationPill } from "./IntegrationPill";
import { getCategoryStyle } from "@/lib/category-styles";
import { cn } from "@/lib/utils";

interface BotCardProps {
  bot: Bot;
}

export function BotCard({ bot }: BotCardProps) {
  const tFilters = useTranslations("filters");
  const tBot = useTranslations("bot");
  const [copied, setCopied] = useState(false);

  const categoryStyle = getCategoryStyle(bot.category);

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const promptText = `Name: ${bot.name}\nDescription: ${bot.description}\nCategory: ${bot.category}\nInstructions:\nYou are ${bot.name}. ${bot.longDescription || bot.description}`;

    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const categoryLabel = tFilters.has(bot.category)
    ? tFilters(bot.category)
    : bot.category;

  return (
    <article className="group h-full">
      <Link
        href={`/bot/${bot.slug}`}
        className={cn(
          "flex h-full min-h-[240px] flex-col rounded-2xl border border-border/80 bg-white p-5 md:p-6",
          "shadow-xs card-hover-glow",
        )}
      >
        <div className="mb-3 flex items-start gap-3">
          <BotIcon
            name={bot.name}
            iconColor={categoryStyle.icon}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-neutral-900 group-hover:text-black">
                  {bot.name}
                </h3>
                {bot.authorHandle && (
                  <p className="mt-0.5 truncate text-xs font-medium text-muted">
                    {bot.authorHandle}
                  </p>
                )}
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                  categoryStyle.badge,
                )}
              >
                {categoryLabel}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
          {bot.description}
        </p>

        <div
          className="mt-auto space-y-3 border-t border-neutral-100 pt-3"
          onClick={(e) => e.preventDefault()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {bot.integrations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {bot.integrations.slice(0, 3).map((integration) => (
                <IntegrationPill key={integration} name={integration} />
              ))}
              {bot.integrations.length > 3 && (
                <IntegrationPill name={`+${bot.integrations.length - 3}`} />
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-100"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">
                    {tBot("copied")}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-neutral-400" />
                  <span>{tBot("copyPrompt")}</span>
                </>
              )}
            </button>

            {bot.xaiBotUrl && (
              <a
                href={bot.xaiBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalClick}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <span>{tBot("openInXai")}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
