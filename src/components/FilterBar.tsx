"use client";

import { motion } from "framer-motion";
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
    <div className="flex flex-col items-center gap-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
        {CATEGORIES.map(({ key, icon: Icon }) => {
          const isActive = category === key;
          const count = categoryCounts[key] ?? 0;

          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onCategoryChange(key)}
              className={cn(
                "group relative inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 md:text-sm",
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white/90 text-slate-600 hover:border-slate-400 hover:text-black"
              )}
              whileTap={{ scale: 0.96 }}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
              <span>{t(key)}</span>
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                )}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Secondary Filters (Sort & Integrations) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Sort selector */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-8 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-slate-400 focus:border-slate-900"
            aria-label={t("sortLabel")}
          >
            <option value="popular">{t("popular")}</option>
            <option value="newest">{t("newest")}</option>
            <option value="name">{t("name")}</option>
          </select>
          <ArrowUpDown
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>

        {/* Integration selector */}
        <div className="relative">
          <select
            value={integration}
            onChange={(e) => onIntegrationChange(e.target.value)}
            className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-slate-400 focus:border-slate-900"
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
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
