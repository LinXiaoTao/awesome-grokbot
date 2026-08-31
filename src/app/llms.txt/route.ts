import { NextResponse } from "next/server";
import { bots } from "@/data/bots";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  const categoryCounts: Record<string, number> = {};
  bots.forEach((b) => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  const content = `# Awesome Grok Bot (awsomebot.com)
> A curated directory of 200+ production-ready Grok Bots, templates, and agent recipes.

## About
Awesome Grok Bot collects verified Grok Bots built for xAI's Grok ecosystem, covering coding, enterprise automation, finance, productivity, research, lifestyle, and social workflows.

## Endpoints for AI Agents
- Feed API: ${SITE_URL}/api/v1/feed.json
- LLMs Documentation: ${SITE_URL}/llms.txt

## Categories & Counts
${Object.entries(categoryCounts)
  .map(([cat, count]) => `- ${cat}: ${count} bots`)
  .join("\n")}

## Sample Bots Directory
${bots
  .slice(0, 50)
  .map(
    (b) =>
      `- [${b.name}](${b.xaiBotUrl || `${SITE_URL}/en/bot/${b.slug}`}) (${b.category}): ${b.description}`
  )
  .join("\n")}

## How to use
To run any of these bots, open the x.ai template URL or paste the system instructions into your Grok Bot setup.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
