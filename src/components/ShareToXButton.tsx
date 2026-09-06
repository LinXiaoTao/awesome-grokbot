"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { computeBotDirectoryStats } from "@/lib/bot-stats";
import { buildTweetIntentUrl, openTweetIntent } from "@/lib/share-to-x";
import { cn, SITE_URL } from "@/lib/utils";
import { XIcon } from "./SocialIcons";

type ShareToXVariant = "navbar" | "hero" | "icon";

interface ShareToXButtonProps {
  variant?: ShareToXVariant;
  className?: string;
  onClick?: () => void;
}

export function ShareToXButton({
  variant = "navbar",
  className,
  onClick,
}: ShareToXButtonProps) {
  const t = useTranslations("share");
  const locale = useLocale();
  const stats = useMemo(() => computeBotDirectoryStats(), []);

  const handleClick = () => {
    const pageUrl = `${SITE_URL}/${locale}`;
    const tweetText = t("tweetTemplate", {
      total: stats.total,
      official: stats.official,
      categories: stats.categories,
    });
    openTweetIntent(buildTweetIntentUrl(tweetText, pageUrl));
    onClick?.();
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "text-muted transition-colors hover:text-black",
          className,
        )}
        aria-label={t("button")}
        title={t("tooltip")}
      >
        <XIcon />
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 hover:shadow-sm",
          className,
        )}
        title={t("tooltip")}
      >
        <XIcon className="h-3.5 w-3.5" />
        {t("buttonShort")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-xs sm:inline-flex",
        className,
      )}
      title={t("tooltip")}
    >
      <XIcon className="h-3.5 w-3.5" />
      {t("buttonShort")}
    </button>
  );
}
