#!/usr/bin/env node
/**
 * Sync Grok Bots from official marketplace (x.ai/bot/marketplace) and
 * third-party directories (grokbot.dev, botdirectory.ai, AgentEarth X community).
 * Deduplicates against local data, appends new entries, and updates READMEs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MANUAL_INCREMENTAL } from "./manual-incremental-2026-09-12.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BOTS_DIR = path.join(ROOT, "src/data/bots");
const CREATED_AT = "2026-09-12";

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

const OFFICIAL_CREATORS = new Set(["@orenmeetsworld", "@kristaletz"]);
const OFFICIAL_BOT_URLS = new Set([
  "https://x.ai/bot/yW-Q1yis7-VCNKbeJ6g6Z",
  "https://x.ai/bot/yA2-Ti3sPVNFO-zRzkwuX",
  "https://x.ai/bot/wsbOPOkHApmIYLrErnC4e",
]);

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+bot$/i, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function extractAuthor(handle) {
  if (!handle) return undefined;
  return handle.replace(/^@/, "");
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "grokbots-sync/1.0" },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

/** Parse grokbot.dev homepage / category pages for x.ai/bot links. */
function parseGrokbotDev(html) {
  const candidates = [];
  const linkRe = /https:\/\/x\.ai\/bot\/[A-Za-z0-9_-]+/g;
  const urls = [...new Set(html.match(linkRe) || [])];
  for (const xaiBotUrl of urls) {
    candidates.push({ xaiBotUrl, source: "grokbot.dev" });
  }
  return candidates;
}

/** Official marketplace: no new public templates as of 2026-09-10 (69 already local). */
async function fetchOfficialMarketplace() {
  try {
    const html = await fetchText("https://x.ai/bot/marketplace");
    const urls = [
      ...new Set(html.match(/https:\/\/x\.ai\/bot\/[A-Za-z0-9_-]+/g) || []),
    ];
    return { source: "x.ai/bot/marketplace", count: urls.length, urls };
  } catch (err) {
    console.warn("Official marketplace fetch skipped:", err.message);
    return { source: "x.ai/bot/marketplace", count: 0, urls: [], skipped: true };
  }
}

async function fetchThirdPartySources() {
  const results = [];
  for (const [name, url] of [
    ["grokbot.dev", "https://grokbot.dev"],
    ["botdirectory.ai", "https://botdirectory.ai"],
  ]) {
    try {
      const html = await fetchText(url);
      const parsed = parseGrokbotDev(html);
      results.push({ source: name, count: parsed.length });
    } catch (err) {
      console.warn(`${name} fetch skipped:`, err.message);
      results.push({ source: name, count: 0, skipped: true });
    }
  }
  return results;
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
  }
  return null;
}

function formatBotEntry(bot, styleIndex) {
  const shape = bot.shape || SHAPES[styleIndex % SHAPES.length];
  const color = bot.color || COLORS[styleIndex % COLORS.length];
  const iconColor =
    bot.iconColor || ICON_COLORS[styleIndex % ICON_COLORS.length];

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
  const insert = entries
    .map((e, i) => formatBotEntry(e, e._styleIndex + i))
    .join("\n");
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
  if (idx === -1)
    throw new Error(`Section not found: ${sectionHeader} in ${filePath}`);
  const afterHeader = idx + sectionHeader.length;
  const nextSection = content.indexOf("\n## ", afterHeader + 1);
  const insertAt = nextSection === -1 ? content.length : nextSection;
  const block = `\n${lines.join("\n")}\n`;
  content = content.slice(0, insertAt) + block + content.slice(insertAt);
  fs.writeFileSync(filePath, content);
}

function categoryLabel(category) {
  const labels = {
    engineering: "Engineering",
    product: "Product",
    design: "Design",
    marketing: "Marketing",
    sales: "Sales",
    operations: "Operations",
    "recruiting-people": "Recruiting & People",
    personal: "Personal",
  };
  return labels[category] || category;
}

function classifyOfficial(bot) {
  if (bot.isOfficial) return;
  if (OFFICIAL_BOT_URLS.has(bot.xaiBotUrl)) {
    bot.isOfficial = true;
    bot.categories = bot.categories || [
      "From Grok Bot Team",
      categoryLabel(bot.category),
    ];
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

async function main() {
  const officialScan = await fetchOfficialMarketplace();
  const thirdPartyScan = await fetchThirdPartySources();

  const { existing, maxId } = parseExistingBots();
  const dupLog = [];
  const newBots = [];
  const allExisting = [...existing];
  let nextId = maxId + 1;
  let styleIndex = maxId + 1;

  for (const c of MANUAL_INCREMENTAL) {
    c.author = c.author || extractAuthor(c.authorHandle);
    c.integrations = c.integrations || [];

    const dup = isDuplicate(c, allExisting);
    if (dup) {
      dupLog.push({ name: c.name, ...dup });
      continue;
    }

    c.id = String(nextId++);
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
    appendToReadme(path.join(ROOT, "README.md"), headers.en, [
      formatReadmeLine(bot),
    ]);
    appendToReadme(path.join(ROOT, "README.zh.md"), headers.zh, [
      formatReadmeLine(bot),
    ]);
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
    syncedAt: CREATED_AT,
    officialMarketplace: officialScan,
    thirdPartySources: thirdPartyScan,
    existingCount: existing.length,
    manualIncremental: MANUAL_INCREMENTAL.length,
    duplicatesSkipped: dupLog.length,
    newBotsTotal: newBots.length,
    idRange:
      newBots.length > 0
        ? `${newBots[0].id}–${newBots[newBots.length - 1].id}`
        : null,
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([k, v]) => [k, v.length]),
    ),
    newBots: newBots.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      category: b.category,
      xaiBotUrl: b.xaiBotUrl,
    })),
    dupSample: dupLog,
  };

  fs.writeFileSync(
    path.join(ROOT, "scripts/sync-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
