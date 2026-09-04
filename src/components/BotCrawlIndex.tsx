import { Link } from "@/i18n/routing";
import type { Bot } from "@/types";
import type { Category } from "@/types";

const CATEGORY_ORDER: Category[] = [
  "productivity",
  "coding",
  "research",
  "social",
  "finance",
  "lifestyle",
  "enterprise",
];

interface BotCrawlIndexProps {
  bots: Bot[];
}

export function BotCrawlIndex({ bots }: BotCrawlIndexProps) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: bots
      .filter((bot) => bot.category === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      aria-labelledby="bot-directory-index"
      className="border-t border-border/60 bg-slate-50/50 px-4 py-12"
    >
      <div className="mx-auto max-w-container">
        <h2
          id="bot-directory-index"
          className="mb-2 text-lg font-bold tracking-tight text-slate-900 md:text-xl"
        >
          Complete Grok Bot Directory
        </h2>
        <p className="mb-8 text-sm text-slate-600">
          Browse all {bots.length} verified Grok Bot templates by category.
        </p>

        <nav aria-label="All Grok Bots by category">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {grouped.map(({ category, items }) => (
              <div key={category}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {category} ({items.length})
                </h3>
                <ul className="space-y-1.5 text-sm">
                  {items.map((bot) => (
                    <li key={bot.slug}>
                      <Link
                        href={`/bot/${bot.slug}`}
                        className="text-slate-700 underline-offset-2 transition-colors hover:text-black hover:underline"
                      >
                        {bot.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
