"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: Category[] = [
  "all",
  "productivity",
  "coding",
  "research",
  "social",
  "finance",
  "lifestyle",
];

interface FilterBarProps {
  category: Category;
  integration: string;
  integrations: string[];
  onCategoryChange: (category: Category) => void;
  onIntegrationChange: (integration: string) => void;
}

export function FilterBar({
  category,
  integration,
  integrations,
  onCategoryChange,
  onIntegrationChange,
}: FilterBarProps) {
  const t = useTranslations("filters");

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              category === cat
                ? "border-black bg-black text-white"
                : "border-border bg-white text-muted hover:border-black hover:text-black",
            )}
            whileTap={{ scale: 0.97 }}
          >
            {t(cat)}
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <select
          value={integration}
          onChange={(e) => onIntegrationChange(e.target.value)}
          className="appearance-none rounded-full border border-border bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-black outline-none transition-colors duration-200 hover:border-black focus:border-black"
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
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
