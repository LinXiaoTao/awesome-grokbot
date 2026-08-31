"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Copy, Check, ExternalLink } from "lucide-react";
import type { Bot } from "@/types";
import { IntegrationPill } from "./IntegrationPill";
import { cn } from "@/lib/utils";

interface BotCardProps {
  bot: Bot;
  index?: number;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  coding: {
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200/70",
    dot: "bg-emerald-500",
  },
  enterprise: {
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    border: "border-purple-200/70",
    dot: "bg-purple-500",
  },
  finance: {
    bg: "bg-teal-50/80",
    text: "text-teal-700",
    border: "border-teal-200/70",
    dot: "bg-teal-500",
  },
  lifestyle: {
    bg: "bg-rose-50/80",
    text: "text-rose-700",
    border: "border-rose-200/70",
    dot: "bg-rose-500",
  },
  productivity: {
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200/70",
    dot: "bg-blue-500",
  },
  research: {
    bg: "bg-indigo-50/80",
    text: "text-indigo-700",
    border: "border-indigo-200/70",
    dot: "bg-indigo-500",
  },
  social: {
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200/70",
    dot: "bg-amber-500",
  },
};

export function BotCard({ bot, index = 0 }: BotCardProps) {
  const locale = useLocale();
  const tFilters = useTranslations("filters");
  const tBot = useTranslations("bot");
  const [copied, setCopied] = useState(false);

  const categoryStyle =
    CATEGORY_STYLES[bot.category] || {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      dot: "bg-slate-500",
    };

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const promptText = `Name: ${bot.name}\nDescription: ${bot.description}\nCategory: ${bot.category}\nInstructions:\nYou are ${bot.name}. ${bot.longDescription || bot.description}`;

    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const categoryLabel = tFilters.has(bot.category)
    ? tFilters(bot.category)
    : bot.category;

  return (
    <motion.article
      className="group relative h-full flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] card-hover-glow transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
    >
      <a
        href={`/${locale}/bot/${bot.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block flex-1"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-black">
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
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
              categoryStyle.bg,
              categoryStyle.text,
              categoryStyle.border
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", categoryStyle.dot)} />
            {categoryLabel}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {bot.description}
        </p>
      </a>

      <div className="mt-auto space-y-3 pt-3 border-t border-slate-100">
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

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 active:scale-95"
            title="Copy Prompt template"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1 text-emerald-600 font-semibold"
                >
                  <Check className="h-3.5 w-3.5" />
                  {tBot("copied")}
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  {tBot("copyPrompt")}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {bot.xaiBotUrl && (
            <a
              href={bot.xaiBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:text-black hover:bg-slate-100"
            >
              <span>{tBot("openInXai")}</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
