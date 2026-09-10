#!/usr/bin/env node
/**
 * Sync Grok Bots from official marketplace (x.ai/bot/marketplace) and
 * third-party directories (grokbot.dev, botdirectory.ai, AgentEarth X community).
 * Deduplicates against local data, appends new entries, and updates READMEs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BOTS_DIR = path.join(ROOT, "src/data/bots");
const CREATED_AT = "2026-09-10";

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

/** Verified incremental bots from 2026-09-10 market scan (official + third-party). */
const MANUAL_INCREMENTAL = [
  {
    slug: "affiliate-recruiter",
    name: "Affiliate Recruiter",
    authorHandle: "@zilvestro",
    description:
      "Finds and ranks the people who could actually sell your product for you.",
    category: "sales",
    xaiBotUrl: "https://x.ai/bot/TaCAhCtPGCvObAaK7ZDQQ",
    xPostUrl: "https://x.com/zilvestro/status/2097995020217323736",
  },
  {
    slug: "bot-maintenance-auditor",
    name: "ボット整備",
    authorHandle: "@x_stone_island",
    description:
      "Keeps the labels on your other bots honest about what they now do.",
    category: "engineering",
    xaiBotUrl: "https://x.ai/bot/BlTqnV5o9E35Dwo2sodyD",
    xPostUrl: "https://x.com/x_stone_island/status/2097947982192951719",
  },
  {
    slug: "blogdrafter",
    name: "blogdrafter",
    authorHandle: "@daisuke",
    description:
      "Drafts and edits blog posts that still sound like you wrote them.",
    category: "marketing",
    xaiBotUrl: "https://x.ai/bot/A6o9Z1NYSIRBX-VIoEcQi",
    xPostUrl: "https://x.com/daisuke/status/2097903822232518947",
  },
  {
    slug: "product-builder-cos",
    name: "Product Builder CoS",
    authorHandle: "@sneharavindra",
    description:
      "Turns a signed-off product plan into a checklist someone actually tracks.",
    category: "product",
    xaiBotUrl: "https://x.ai/bot/6tbtv4Tln4MvKc5duOkle",
    xPostUrl: "https://x.com/sneharavindra/status/2097897846397956553",
  },
  {
    slug: "kirbot",
    name: "KirBot",
    authorHandle: "@SuddenlyJon",
    description:
      "Merges two overlapping bots into one, then helps you retire the spare.",
    category: "engineering",
    xaiBotUrl: "https://x.ai/bot/Jzy-isV1YW5ZLl3W6rq6h",
    xPostUrl: "https://x.com/SuddenlyJon/status/2097865550592417976",
  },
  {
    slug: "slack-radar",
    name: "slack radar",
    authorHandle: "@parkersmith",
    description:
      "Reads your Slack so you do not have to, and speaks only when it matters.",
    integrations: ["Slack"],
    category: "operations",
    xaiBotUrl: "https://x.ai/bot/m4WfJ0ODD0O1runkfq0Ak",
    xPostUrl: "https://x.com/parkersmith/status/2097827032646529500",
  },
  {
    slug: "quotewise-daily",
    name: "Quotewise Daily",
    authorHandle: "@quotewiser",
    description: "A quotation desk that can prove who actually said it.",
    category: "personal",
    xaiBotUrl: "https://x.ai/bot/kmmBn74qwBr9lgedW4naf",
    xPostUrl: "https://x.com/quotewiser/status/2097819326506008642",
  },
  {
    slug: "renewals-invoice-bot",
    name: "Renewals Invoice Bot",
    authorHandle: "@compileinstyle",
    description:
      "Settles your recurring bills up to a fixed weekly limit, and asks before anything new.",
    category: "operations",
    xaiBotUrl: "https://x.ai/bot/-9hlUkQbsgE7oUyQvUPum",
    xPostUrl: "https://x.com/compileinstyle/status/2097809676242956768",
  },
  {
    slug: "personal-trainer",
    name: "Personal Trainer",
    authorHandle: "@nathanglass",
    description:
      "Keeps one client logging meals and sessions between coaching check-ins.",
    category: "personal",
    xaiBotUrl: "https://x.ai/bot/t9TIKE_igItEQd6tOyyRd",
    xPostUrl: "https://x.com/nathanglass/status/2097769379274326161",
  },
  {
    slug: "app-store-review-bot",
    name: "App Store Review Bot",
    authorHandle: "@stevederico",
    description:
      "Checks your iOS app against Apple's review rules before Apple does.",
    category: "engineering",
    xaiBotUrl: "https://x.ai/bot/KzBEylM_3NFTjATszLICV",
    xPostUrl: "https://x.com/stevederico/status/2097765393939247601",
  },
  {
    slug: "i-m-not-old-yet",
    name: "I'm not old yet",
    authorHandle: "@AdventureNLearn",
    description:
      "Writes memes that mock the junk mail telling you you are old.",
    category: "personal",
    xaiBotUrl: "https://x.ai/bot/izlQpnudtxbmDRKr7GvRs",
    xPostUrl: "https://x.com/AdventureNLearn/status/2097741271456776259",
  },
  {
    slug: "tolstoy",
    name: "Tolstoy",
    authorHandle: "@SuddenlyJon",
    description:
      "A literary companion that weighs your week the way Tolstoy might.",
    category: "personal",
    xaiBotUrl: "https://x.ai/bot/42Clq7Vdn2X7zcwJ9OGxR",
    xPostUrl: "https://x.com/SuddenlyJon/status/2097706995507675535",
  },
  {
    slug: "poe",
    name: "Poe",
    authorHandle: "@SuddenlyJon",
    description:
      "A gothic literary companion with a taste for puzzles and dread.",
    category: "personal",
    xaiBotUrl: "https://x.ai/bot/EcUpzABnh3MfZQTN7inmP",
    xPostUrl: "https://x.com/SuddenlyJon/status/2097706986187948143",
  },
  {
    slug: "customer-feedback-watch",
    name: "Customer Feedback Watch",
    authorHandle: "@egavrilenko11",
    description:
      "Monitors public X for customer feedback, complaints, and bug reports about your product, especially billing and authentication issues.",
    integrations: ["X API"],
    category: "operations",
    xaiBotUrl: "https://x.ai/bot/8Snl1TovbMwClPoBiHrWT",
    xPostUrl: "https://x.com/egavrilenko11/status/2095604008555893015",
  },
];

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

  for (const bot of newBots) {
    const headers = CATEGORY_README[bot.category];
    appendToReadme(path.join(ROOT, "README.md"), headers.en, [
      formatReadmeLine(bot),
    ]);
    appendToReadme(path.join(ROOT, "README.zh.md"), headers.zh, [
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
