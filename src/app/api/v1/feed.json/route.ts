import { NextResponse } from "next/server";
import { bots } from "@/data/bots";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  const items = bots.map((bot) => ({
    id: bot.id,
    type: "use-case",
    slug: bot.slug,
    name: bot.name,
    headline: bot.name,
    url: `${SITE_URL}/en/bot/${bot.slug}`,
    template_url: bot.xaiBotUrl || null,
    summary: bot.description,
    description: bot.longDescription || bot.description,
    categories: [bot.category],
    integrations: bot.integrations,
    installs: bot.installs,
    source: {
      platform: "x",
      label: bot.authorHandle || `@${bot.author}`,
      url: bot.xPostUrl || (bot.authorHandle ? `https://x.com/${bot.authorHandle.replace(/^@/, "")}` : `${SITE_URL}/en/bot/${bot.slug}`),
    },
    added_at: bot.createdAt ? `${bot.createdAt}T00:00:00Z` : new Date().toISOString(),
  }));

  return NextResponse.json(
    {
      title: "Awesome Grok Bot Feed",
      description: "Curated Grok Bot use cases, plugins, prompts, and templates.",
      home_page_url: SITE_URL,
      feed_url: `${SITE_URL}/api/v1/feed.json`,
      version: "https://jsonfeed.org/version/1.1",
      total_count: items.length,
      items,
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    }
  );
}
