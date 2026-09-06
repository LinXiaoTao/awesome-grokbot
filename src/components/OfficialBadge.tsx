"use client";

import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface OfficialBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function OfficialBadge({ className, size = "sm" }: OfficialBadgeProps) {
  const t = useTranslations("bot");

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border border-neutral-900/10 bg-neutral-950 font-semibold text-white shadow-xs",
        size === "sm" && "px-2 py-0.5 text-[10px] tracking-wide uppercase",
        size === "md" && "gap-1.5 px-2.5 py-1 text-xs",
        className,
      )}
      title={t("officialTooltip")}
    >
      <BadgeCheck
        className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")}
        aria-hidden="true"
      />
      <span>{t("official")}</span>
    </span>
  );
}
