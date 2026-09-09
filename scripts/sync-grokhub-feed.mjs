#!/usr/bin/env node
/**
 * Sync GrokHub feed + manual incremental bots into src/data/bots/
 * and update README.md / README.zh.md
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FEED_PATH =
  "/Users/leo/.cursor/projects/Users-leo-Projects-awesome-grokbot/agent-tools/efe21548-7e88-402a-8433-a4056bfc6eb4.txt";
const BOTS_DIR = path.join(ROOT, "src/data/bots");
const CREATED_AT = "2026-09-08";

const CATEGORIES = [
  "engineering",
  "product",
  "design",
  "marketing",
  "sales",
  "operations",
  "recruiting-people",
  "personal",
];

const CATEGORY_README = {
  engineering: { en: "## Engineering", zh: "## 工程研发" },
  product: { en: "## Product", zh: "## 产品管理" },
  design: { en: "## Design", zh: "## 设计" },
  marketing: { en: "## Marketing", zh: "## 市场营销" },
  sales: { en: "## Sales", zh: "## 销售" },
  operations: { en: "## Operations", zh: "## 企业运营" },
  "recruiting-people": { en: "## Recruiting & People", zh: "## 招聘与人事" },
  personal: { en: "## Personal", zh: "## 个人生活" },
};

const OFFICIAL_SECTION = { en: "## From Grok Bot Team", zh: "## 官方出品" };

const SHAPES = [
  "blob",
  "pebble",
  "bean",
  "egg",
  "squircle",
  "tablet",
  "capsule",
  "cylinder",
  "hex",
  "gem",
  "crystal",
  "wedge",
  "shield",
  "dome",
  "arch",
  "cloud",
  "teardrop",
  "leaf",
];
const COLORS = [
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "violet",
  "magenta",
  "gray",
];
const ICON_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-lime-500",
];

const OFFICIAL_CREATORS = new Set(["@orenmeetsworld"]);
const OFFICIAL_BOT_URLS = new Set(["https://x.ai/bot/yW-Q1yis7-VCNKbeJ6g6Z"]);

const MANUAL_INCREMENTAL = [
  {
    slug: "wool-radar",
    name: "Wool Radar",
    author: "Ben X",
    authorHandle: "@BenXlab",
    description:
      "Learns your grocery list and AI tools, then only pings matching Coles, Woolworths, Aldi, Costco specials, quota resets, and checkout codes.",
    integrations: ["Discounts", "Shopping", "Alerts"],
    xPostUrl: "https://x.com/BenXlab/status/2097187265617580405",
    xaiBotUrl: "https://x.ai/bot/WFW6_5N596TQpWCRjRZ5w",
    feedCategories: ["personal"],
    category: "personal",
  },
];

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+bot$/i, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function extractHandle(label) {
  if (!label) return undefined;
  const m = label.match(/@([A-Za-z0-9_]+)/);
  return m ? `@${m[1]}` : undefined;
}

function extractAuthor(label) {
  if (!label) return undefined;
  return label.replace(/^@/, "");
}

function mapCategory(feedCats, headline, summary) {
  const cats = (feedCats || []).map((c) => c.toLowerCase());
  const text = `${headline} ${summary}`.toLowerCase();

  const directMap = {
    personal: "personal",
    design: "design",
    sales: "sales",
    engineering: "engineering",
    "recruiting-people": "recruiting-people",
    recruiting: "recruiting-people",
    product: "product",
    marketing: "marketing",
    operations: "operations",
  };
  for (const c of cats) {
    if (directMap[c]) return directMap[c];
  }

  if (cats.includes("media")) {
    if (
      /tiktok|creative|marketing|social|content|influencer|ads|seo|copy|brand|campaign|video edit|clip|podcast|youtube|x post|twitter/i.test(
        text,
      )
    )
      return "marketing";
    return "personal";
  }
  if (cats.includes("ops") || cats.includes("setup")) return "operations";
  if (cats.includes("orchestration")) {
    if (/code|engineer|agent|deploy|api|git|dev/i.test(text))
      return "engineering";
    return "operations";
  }
  if (cats.includes("integrations")) {
    if (/code|engineer|api|dev|plugin|mcp/i.test(text)) return "engineering";
    return "operations";
  }
  if (cats.includes("research")) {
    if (/product|founder|idea|competitor|market/i.test(text)) return "product";
    return "engineering";
  }

  if (/recruit|talent|hiring|interview|candidate|ats/i.test(text))
    return "recruiting-people";
  if (/sales|prospect|outreach|deal|pipeline|crm|pitch|gtm/i.test(text))
    return "sales";
  if (
    /marketing|social media|copywriter|seo|audience|clips|tiktok|creative strategy/i.test(
      text,
    )
  )
    return "marketing";
  if (/design|figma|ui|ux|critique|sprite|prototype/i.test(text))
    return "design";
  if (/product idea|competitor|user research|roadmap|founder/i.test(text))
    return "product";
  if (/code|developer|git|deploy|api|engineer|harness/i.test(text))
    return "engineering";
  if (/workflow|office|admin|notion|legal|audit|invoice|expense|ops/i.test(text))
    return "operations";
  if (
    /lifestyle|health|wellness|habit|home|family|personal|grocery|shopping|discount/i.test(
      text,
    )
  )
    return "personal";
  return "operations";
}

function parseExistingBots() {
  const existing = [];
  let maxId = 0;
  for (const cat of CATEGORIES) {
    const content = fs.readFileSync(path.join(BOTS_DIR, `${cat}.ts`), "utf8");
    const blocks = content.split(/\n  \{\n/).slice(1);
    for (const block of blocks) {
      const get = (key) => {
        const m = block.match(new RegExp(`${key}:\\s*"([^"]*)"`));
        return m ? m[1] : undefined;
      };
      const bot = {
        id: get("id"),
        slug: get("slug"),
        name: get("name"),
        authorHandle: get("authorHandle"),
        xPostUrl: get("xPostUrl"),
        xaiBotUrl: get("xaiBotUrl"),
        category: cat,
      };
      if (bot.id) maxId = Math.max(maxId, parseInt(bot.id, 10));
      existing.push(bot);
    }
  }
  return { existing, maxId };
}

function isDuplicate(candidate, existing) {
  const normName = normalizeName(candidate.name);
  const url = (candidate.xaiBotUrl || "").toLowerCase();
  const slug = (candidate.slug || "").toLowerCase();

  for (const e of existing) {
    if (url && e.xaiBotUrl && url === e.xaiBotUrl.toLowerCase()) {
      return { reason: "xaiBotUrl", existing: e.name };
    }
    if (slug && e.slug && slug === e.slug.toLowerCase()) {
      return { reason: "slug", existing: e.name };
    }
    if (
      candidate.name &&
      e.name &&
      candidate.name.toLowerCase() === e.name.toLowerCase()
    ) {
      return { reason: "name", existing: e.name };
    }
    const eNorm = normalizeName(e.name);
    if (normName && eNorm && normName === eNorm) {
      return { reason: "variant-name", existing: e.name };
    }
    if (
      candidate.xPostUrl &&
      e.xPostUrl &&
      candidate.xPostUrl === e.xPostUrl &&
      normName &&
      eNorm &&
      normName === eNorm
    ) {
      return { reason: "xPostUrl+name", existing: e.name };
    }
    if (
      candidate.authorHandle &&
      e.authorHandle &&
      candidate.authorHandle.toLowerCase() === e.authorHandle.toLowerCase() &&
      normName &&
      eNorm &&
      (normName.includes(eNorm) || eNorm.includes(normName))
    ) {
      return { reason: "author+similar", existing: e.name };
    }
  }
  return null;
}

function feedItemToCandidate(item) {
  if (!item.template_url?.startsWith("https://x.ai/bot/")) return null;
  return {
    slug: item.slug,
    name: item.headline,
    author: extractAuthor(item.source?.label),
    authorHandle: extractHandle(item.source?.label),
    description: item.summary,
    integrations: [],
    xPostUrl: item.source?.url?.startsWith("http") ? item.source.url : undefined,
    xaiBotUrl: item.template_url,
    feedCategories: item.categories,
  };
}

function formatBotEntry(bot, styleIndex) {
  const shape = SHAPES[styleIndex % SHAPES.length];
  const color = COLORS[styleIndex % COLORS.length];
  const iconColor = ICON_COLORS[styleIndex % ICON_COLORS.length];

  const lines = [
    "  {",
    `    id: "${bot.id}",`,
    `    slug: "${bot.slug}",`,
    `    name: "${bot.name.replace(/"/g, '\\"')}",`,
  ];
  if (bot.author) lines.push(`    author: "${bot.author.replace(/"/g, '\\"')}",`);
  if (bot.authorHandle)
    lines.push(`    authorHandle: "${bot.authorHandle}",`);
  lines.push(
    "    description:",
    `      "${bot.description.replace(/"/g, '\\"')}",`,
  );
  if (bot.integrations?.length) {
    lines.push(
      `    integrations: [${bot.integrations.map((i) => `"${i}"`).join(", ")}],`,
    );
  } else {
    lines.push("    integrations: [],");
  }
  lines.push("    installs: 0,");
  lines.push(`    category: "${bot.category}",`);
  if (bot.categories?.length) {
    lines.push(
      `    categories: [${bot.categories.map((c) => `"${c}"`).join(", ")}],`,
    );
  }
  if (bot.isOfficial) lines.push("    isOfficial: true,");
  lines.push(`    shape: "${shape}",`);
  lines.push(`    color: "${color}",`);
  lines.push(`    iconColor: "${iconColor}",`);
  lines.push(`    createdAt: "${CREATED_AT}",`);
  if (bot.xPostUrl) lines.push(`    xPostUrl: "${bot.xPostUrl}",`);
  if (bot.xaiBotUrl) lines.push(`    xaiBotUrl: "${bot.xaiBotUrl}",`);
  lines.push("  },");
  return lines.join("\n");
}

function appendToCategoryFile(category, entries) {
  const filePath = path.join(BOTS_DIR, `${category}.ts`);
  let content = fs.readFileSync(filePath, "utf8");
  const insert = entries.map((e, i) => formatBotEntry(e, e._styleIndex + i)).join("\n");
  content = content.replace(/\n\];[\s\n]*$/, `\n${insert}\n];\n`);
  fs.writeFileSync(filePath, content);
}

function formatReadmeLine(bot) {
  const handle = bot.authorHandle ? ` by ${bot.authorHandle}` : "";
  return `- **[${bot.name}](${bot.xaiBotUrl})**${handle} — ${bot.description}`;
}

function appendToReadme(filePath, sectionHeader, lines) {
  let content = fs.readFileSync(filePath, "utf8");
  const idx = content.indexOf(sectionHeader);
  if (idx === -1) throw new Error(`Section not found: ${sectionHeader} in ${filePath}`);
  const afterHeader = idx + sectionHeader.length;
  const nextSection = content.indexOf("\n## ", afterHeader + 1);
  const insertAt = nextSection === -1 ? content.length : nextSection;
  const block = `\n${lines.join("\n")}\n`;
  content = content.slice(0, insertAt) + block + content.slice(insertAt);
  fs.writeFileSync(filePath, content);
}

function classifyOfficial(bot) {
  if (OFFICIAL_BOT_URLS.has(bot.xaiBotUrl)) {
    bot.isOfficial = true;
    bot.categories = ["From Grok Bot Team", "Marketing"];
    bot.category = "marketing";
    return;
  }
  if (
    bot.authorHandle &&
    OFFICIAL_CREATORS.has(bot.authorHandle) &&
    bot.name.toLowerCase().includes("klo")
  ) {
    bot.isOfficial = true;
    bot.categories = ["From Grok Bot Team", "Marketing"];
    bot.category = "marketing";
  }
}

// --- Main ---
const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf8"));
const { existing, maxId } = parseExistingBots();

const feedCandidates = feed.items
  .map(feedItemToCandidate)
  .filter(Boolean);
const candidates = [...feedCandidates, ...MANUAL_INCREMENTAL];

const dupLog = [];
const newBots = [];
const allExisting = [...existing];
let nextId = maxId + 1;
let styleIndex = maxId + 1;

for (const c of candidates) {
  const dup = isDuplicate(c, allExisting);
  if (dup) {
    dupLog.push({ name: c.name, ...dup });
    continue;
  }

  c.id = String(nextId++);
  c.category = c.category || mapCategory(c.feedCategories, c.name, c.description);
  classifyOfficial(c);
  c._styleIndex = styleIndex++;
  newBots.push(c);
  allExisting.push({
    name: c.name,
    slug: c.slug,
    xaiBotUrl: c.xaiBotUrl,
    xPostUrl: c.xPostUrl,
    authorHandle: c.authorHandle,
  });
}

const byCategory = {};
for (const bot of newBots) {
  if (!byCategory[bot.category]) byCategory[bot.category] = [];
  byCategory[bot.category].push(bot);
}

for (const [cat, bots] of Object.entries(byCategory)) {
  appendToCategoryFile(cat, bots);
}

const officialBots = newBots.filter((b) => b.isOfficial);
for (const bot of newBots) {
  const headers = CATEGORY_README[bot.category];
  appendToReadme(path.join(ROOT, "README.md"), headers.en, [formatReadmeLine(bot)]);
  appendToReadme(path.join(ROOT, "README.zh.md"), headers.zh, [formatReadmeLine(bot)]);
}
for (const bot of officialBots) {
  appendToReadme(path.join(ROOT, "README.md"), OFFICIAL_SECTION.en, [
    formatReadmeLine(bot),
  ]);
  appendToReadme(path.join(ROOT, "README.zh.md"), OFFICIAL_SECTION.zh, [
    formatReadmeLine(bot),
  ]);
}

const report = {
  feedTotal: feed.items.length,
  feedWithUrl: feed.items.filter((i) =>
    i.template_url?.startsWith("https://x.ai/bot/"),
  ).length,
  manualIncremental: MANUAL_INCREMENTAL.length,
  existingCount: existing.length,
  duplicatesSkipped: dupLog.length,
  newBotsTotal: newBots.length,
  byCategory: Object.fromEntries(
    Object.entries(byCategory).map(([k, v]) => [k, v.length]),
  ),
  officialBots: officialBots.map((b) => ({
    name: b.name,
    url: b.xaiBotUrl,
    author: b.authorHandle,
  })),
  newBotNames: newBots.map((b) => b.name),
  dupSample: dupLog.slice(0, 20),
};
fs.writeFileSync(
  path.join(ROOT, "scripts/sync-report.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
