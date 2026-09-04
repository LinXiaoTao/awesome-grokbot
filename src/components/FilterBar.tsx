"use client";

import {
  ChevronDown,
  LayoutGrid,
  Zap,
  Code2,
  Search,
  Share2,
  DollarSign,
  HeartHandshake,
  Building2,
  ArrowUpDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Category, SortOption } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: { key: Category; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", icon: LayoutGrid },
  { key: "productivity", icon: Zap },
  { key: "coding", icon: Code2 },
  { key: "research", icon: Search },
  { key: "social", icon: Share2 },
  { key: "finance", icon: DollarSign },
  { key: "lifestyle", icon: HeartHandshake },
  { key: "enterprise", icon: Building2 },
];

interface FilterBarProps {
  category: Category;
  integration: string;
  integrations: string[];
  sort: SortOption;
  categoryCounts: Record<Category, number>;
  onCategoryChange: (category: Category) => void;
  onIntegrationChange: (integration: string) => void;
  onSortChange: (sort: SortOption) => void;
}

export function FilterBar({
  category,
  integration,
  integrations,
  sort,
  categoryCounts,
  onCategoryChange,
  onIntegrationChange,
  onSortChange,
}: FilterBarProps) {
  const t = useTranslations("filters");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative w-full max-w-4xl">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#f8fafc] to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-[#f8fafc] to-transparent md:hidden" />
        <div className="scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {CATEGORIES.map(({ key, icon: Icon }) => {
            const isActive = category === key;
            const count = categoryCounts[key] ?? 0;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onCategoryChange(key)}
                className={cn(
                  "inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-200 md:text-sm",
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                    : "border-neutral-200 bg-white/90 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive ? "text-white" : "text-neutral-400",
                  )}
                />
                <span>{t(key)}</span>
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-neutral-100 text-neutral-500",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="min-h-9 appearance-none rounded-full border border-neutral-200 bg-white py-2 pl-8 pr-8 text-xs font-medium text-neutral-700 outline-none transition-colors hover:border-neutral-400 focus:border-neutral-900"
            aria-label={t("sortLabel")}
          >
            <option value="popular">{t("popular")}</option>
            <option value="newest">{t("newest")}</option>
            <option value="name">{t("name")}</option>
          </select>
          <ArrowUpDown
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
        </div>

        <div className="relative">
          <select
            value={integration}
            onChange={(e) => onIntegrationChange(e.target.value)}
            className="min-h-9 appearance-none rounded-full border border-neutral-200 bg-white py-2 pl-4 pr-8 text-xs font-medium text-neutral-700 outline-none transition-colors hover:border-neutral-400 focus:border-neutral-900"
            aria-label={t("allIntegrations")}
          >
            <option value="all">{t("allIntegrations")}</option>
            {integrations.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
