#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { NEW_BOTS_2026_09_29 } from "./manual-incremental-2026-09-29.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BOTS_DIR = path.join(ROOT, "src/data/bots");
const CREATED_AT = "2026-09-29";

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
  "blob", "pebble", "bean", "egg", "squircle", "tablet", "capsule", "cylinder",
  "hex", "gem", "crystal", "wedge", "shield", "dome", "arch", "cloud", "teardrop", "leaf"
];
const COLORS = [
  "black", "brown", "red", "orange", "yellow", "green", "cyan", "blue", "violet", "magenta", "gray"
];
const ICON_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-teal-500", "bg-red-500",
  "bg-yellow-500", "bg-indigo-500", "bg-pink-500", "bg-emerald-500", "bg-cyan-500", "bg-rose-500"
];

function getAllExistingBots() {
  const all = [];
  for (const cat of CATEGORIES) {
    const filePath = path.join(BOTS_DIR, `${cat}.ts`);
    const content = fs.readFileSync(filePath, "utf8");
    const idMatches = [...content.matchAll(/id:\s*[\"'](\d+)[\"']/g)].map(m => parseInt(m[1], 10));
    const urlMatches = [...content.matchAll(/xaiBotUrl:\s*[\"']([^\"']+)[\"']/g)].map(m => m[1]);
    const slugMatches = [...content.matchAll(/slug:\s*[\"']([^\"']+)[\"']/g)].map(m => m[1]);
    for (let i = 0; i < idMatches.length; i++) {
      all.push({ id: idMatches[i], url: urlMatches[i], slug: slugMatches[i], category: cat });
    }
  }
  return all;
}

function formatBotEntry(bot, idx) {
  const shape = bot.shape || SHAPES[idx % SHAPES.length];
  const color = bot.color || COLORS[idx % COLORS.length];
  const iconColor = bot.iconColor || ICON_COLORS[idx % ICON_COLORS.length];

  const lines = [
    "  {",
    `    id: "${bot.id}",`,
    `    slug: "${bot.slug}",`,
    `    name: "${bot.name.replace(/"/g, '\\"')}",`,
    `    description:`,
    `      "${bot.description.replace(/"/g, '\\"')}",`,
  ];
  if (bot.author) lines.push(`    author: "${bot.author.replace(/"/g, '\\"')}",`);
  if (bot.authorHandle) lines.push(`    authorHandle: "${bot.authorHandle}",`);
  if (bot.integrations?.length) {
    lines.push(`    integrations: [${bot.integrations.map(i => `"${i}"`).join(", ")}],`);
  } else {
    lines.push("    integrations: [],");
  }
  lines.push("    installs: 0,");
  lines.push(`    category: "${bot.category}",`);
  if (bot.categories?.length) {
    lines.push(`    categories: [${bot.categories.map(c => `"${c}"`).join(", ")}],`);
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
  const insert = entries.map((e, i) => formatBotEntry(e, i)).join("\n");
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

function main() {
  const existing = getAllExistingBots();
  const maxId = Math.max(...existing.map(b => b.id));
  const existingUrls = new Set(existing.map(b => b.url).filter(Boolean));
  const existingSlugs = new Set(existing.map(b => b.slug));

  console.log(`Current bot count: ${existing.length}, max ID: ${maxId}`);

  const toAdd = [];
  let nextId = maxId + 1;

  for (const bot of NEW_BOTS_2026_09_29) {
    if (existingUrls.has(bot.xaiBotUrl)) {
      console.log(`Skipping duplicate URL: ${bot.name} (${bot.xaiBotUrl})`);
      continue;
    }
    let slug = bot.slug;
    if (existingSlugs.has(slug)) {
      slug = `${slug}-2`;
    }
    existingSlugs.add(slug);

    toAdd.push({
      ...bot,
      id: String(nextId++),
      slug
    });
  }

  console.log(`Adding ${toAdd.length} new bots...`);

  // Group by category
  const byCategory = {};
  for (const bot of toAdd) {
    if (!byCategory[bot.category]) byCategory[bot.category] = [];
    byCategory[bot.category].push(bot);
  }

  for (const [cat, bots] of Object.entries(byCategory)) {
    console.log(`Appending ${bots.length} bots to ${cat}.ts`);
    appendToCategoryFile(cat, bots);

    // Update README.md
    const readmeLines = bots.map(formatReadmeLine);
    appendToReadme(path.join(ROOT, "README.md"), CATEGORY_README[cat].en, readmeLines);
    appendToReadme(path.join(ROOT, "README.zh.md"), CATEGORY_README[cat].zh, readmeLines);
  }

  console.log(`Successfully synced ${toAdd.length} new bots.`);
}

main();
