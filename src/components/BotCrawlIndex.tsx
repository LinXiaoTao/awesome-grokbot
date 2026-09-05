import { Link } from "@/i18n/routing";
import type { Bot, Category } from "@/types";
import { getCategoryStyle } from "@/lib/category-styles";

const CATEGORY_ORDER: Category[] = [
  "from-grok-bot-team",
  "sales",
  "marketing",
  "design",
  "engineering",
  "personal",
  "recruiting-people",
  "operations",
  "product",
];

interface BotCrawlIndexProps {
  bots: Bot[];
}

export function BotCrawlIndex({ bots }: BotCrawlIndexProps) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: bots
      .filter((bot) =>
        category === "from-grok-bot-team"
          ? bot.isOfficial ||
            bot.category === "from-grok-bot-team" ||
            bot.categories?.includes("From Grok Bot Team")
          : bot.category === category,
      )
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      aria-labelledby="bot-directory-index"
      className="border-t border-neutral-800 bg-neutral-950 px-4 py-16 text-neutral-100"
    >
      <div className="mx-auto max-w-container">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          Index · {bots.length} entries
        </p>
        <h2
          id="bot-directory-index"
          className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl"
        >
          Complete Directory
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Full archive of verified Grok Bot templates, grouped by category.
          Expand a section to browse every entry.
        </p>

        <nav
          aria-label="All Grok Bots by category"
          className="mt-10 space-y-0 divide-y divide-neutral-800 border-y border-neutral-800"
        >
          {grouped.map(({ category, items }) => {
            const style = getCategoryStyle(category);

            return (
              <details key={category} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 marker:content-none">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-8 w-1 shrink-0 rounded-full ${style.icon}`}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-sm uppercase tracking-wider text-neutral-200">
                      {category}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-neutral-500">
                    {items.length}
                  </span>
                </summary>
                <ul className="columns-1 gap-x-8 pb-5 sm:columns-2 lg:columns-3">
                  {items.map((bot) => (
                    <li key={bot.slug} className="mb-2 break-inside-avoid">
                      <Link
                        href={`/bot/${bot.slug}`}
                        className="text-sm text-neutral-400 underline-offset-2 transition-colors hover:text-white hover:underline"
                      >
                        {bot.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
