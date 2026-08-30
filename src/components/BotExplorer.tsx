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

export function BotExplorer() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [category, setCategory] = useState<Category>("all");
  const [integration, setIntegration] = useState("all");

  const integrations = useMemo(() => getAllIntegrationNames(), []);

  const filteredBots = useMemo(
    () => filterBots(bots, { search, category, integration, sort }),
    [search, category, integration, sort],
  );

  return (
    <>
      <Hero>
        <SearchBar value={search} onChange={setSearch} />
        <div id="categories">
          <FilterBar
            sort={sort}
            category={category}
            integration={integration}
            integrations={integrations}
            onSortChange={setSort}
            onCategoryChange={setCategory}
            onIntegrationChange={setIntegration}
          />
        </div>
      </Hero>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-container">
          <BotGrid bots={filteredBots} />
        </div>
      </section>
    </>
  );
}
