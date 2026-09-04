import { NextResponse } from "next/server";
import { bots } from "@/data/bots";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-static";

const CATEGORIES = [
  "productivity",
  "coding",
  "research",
  "social",
  "finance",
  "lifestyle",
  "enterprise",
] as const;

export async function GET() {
  const categoryCounts: Record<string, number> = {};
  bots.forEach((b) => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  const categorySamples = CATEGORIES.map((category) => {
    const items = bots
      .filter((b) => b.category === category)
      .slice(0, 8)
      .map(
        (b) =>
          `  - [${b.name}](${SITE_URL}/en/bot/${b.slug}): ${b.description}`,
      )
      .join("\n");
    return `### ${category} (${categoryCounts[category] ?? 0} bots)\n${items}`;
  }).join("\n\n");

  const fullIndex = bots
    .map(
      (b) =>
        `- [${b.name}](${SITE_URL}/en/bot/${b.slug}) (${b.category}): ${b.description}`,
    )
    .join("\n");

  const content = `# Awesome Grok Bot (awsomebot.com)
> A curated directory of ${bots.length}+ production-ready Grok Bots, templates, and agent recipes for xAI's Grok ecosystem.

## About
Awesome Grok Bot collects verified Grok Bots built for xAI's Grok ecosystem, covering coding, enterprise automation, finance, productivity, research, lifestyle, and social workflows.

## Machine-Readable Endpoints
- Sitemap: ${SITE_URL}/sitemap.xml
- Feed API (JSON): ${SITE_URL}/api/v1/feed.json
- LLMs Documentation: ${SITE_URL}/llms.txt
- Homepage: ${SITE_URL}/en

## Categories & Counts
${Object.entries(categoryCounts)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([cat, count]) => `- ${cat}: ${count} bots`)
  .join("\n")}

Total: ${bots.length} verified Grok Bot templates.

## Representative Bots by Category
${categorySamples}

## Full Bot Index
${fullIndex}

## How to Use
Open any bot's x.ai template URL from the feed or detail page, or paste the system instructions into your Grok Bot setup. Detail pages live at \`${SITE_URL}/en/bot/{slug}\`.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
