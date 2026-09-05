"use client";

import { useMemo, useState } from "react";
import { bots } from "@/data/bots";
import { getAllIntegrationNames } from "@/data/integrations";
import type { Category, SortOption } from "@/types";
import { filterBots } from "@/lib/utils";
import { Hero } from "./Hero";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { BotGrid } from "./BotGrid";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";

interface BotExplorerProps {
  botCount: number;
}

export function BotExplorer({ botCount }: BotExplorerProps) {
  const t = useTranslations("common");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [integration, setIntegration] = useState("all");
  const [sort, setSort] = useState<SortOption>("popular");

  const integrations = useMemo(() => getAllIntegrationNames(), []);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      all: bots.length,
      "from-grok-bot-team": 0,
      sales: 0,
      marketing: 0,
      design: 0,
      engineering: 0,
      personal: 0,
      "recruiting-people": 0,
      operations: 0,
      product: 0,
    };
    bots.forEach((b) => {
      if (
        b.isOfficial ||
        b.category === "from-grok-bot-team" ||
        b.categories?.includes("From Grok Bot Team")
      ) {
        counts["from-grok-bot-team"]++;
      }
      const cat = b.category as Category;
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
    return counts;
  }, []);

  const filteredBots = useMemo(
    () => filterBots(bots, { search, category, integration, sort }),
    [search, category, integration, sort]
  );

  const isFiltered = search.trim() !== "" || category !== "all" || integration !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setIntegration("all");
  };

  return (
    <>
      <Hero botCount={botCount}>
        <SearchBar value={search} onChange={setSearch} />
        <div id="categories">
          <FilterBar
            category={category}
            integration={integration}
            integrations={integrations}
            sort={sort}
            categoryCounts={categoryCounts}
            onCategoryChange={setCategory}
            onIntegrationChange={setIntegration}
            onSortChange={setSort}
          />
        </div>
      </Hero>

      <section className="px-4 pb-24 pt-6">
        <div className="mx-auto max-w-container">
          <div className="mb-6 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>
              {t("showingCount", { shown: filteredBots.length, total: bots.length })}
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition-colors hover:text-black"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{t("resetFilters")}</span>
              </button>
            )}
          </div>

          <BotGrid bots={filteredBots} />
        </div>
      </section>
    </>
  );
}
