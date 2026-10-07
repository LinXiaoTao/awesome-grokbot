#!/usr/bin/env node
/**
 * Append bots collected on 2026-10-07 to src/data/bots/*.ts, README.md and README.zh.md.
 * Skips anything already present (xaiBotUrl, slug, or same name + author handle).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { NEW_BOTS_2026_10_07 } from "./manual-incremental-2026-10-07.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BOTS_DIR = path.join(ROOT, "src/data/bots");
const CREATED_AT = "2026-10-07";

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

const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9\u0080-\uffff]/g, "");
const str = (value) => JSON.stringify(value);

function readExisting() {
  const urls = new Set();
  const slugs = new Set();
  const nameAuthors = new Set();
  let maxId = 0;
  for (const cat of CATEGORIES) {
    const content = fs.readFileSync(path.join(BOTS_DIR, `${cat}.ts`), "utf8");
    for (const block of content.split(/\n {2}\{\n/).slice(1)) {
      const get = (key) => `\n${block}`.match(new RegExp(`\\n    ${key}: "((?:[^"\\\\]|\\\\.)*)"`))?.[1];
      const id = Number.parseInt(get("id") ?? "0", 10);
      maxId = Math.max(maxId, id);
      const url = get("xaiBotUrl");
      if (url) urls.add(url);
      const slug = get("slug");
      if (slug) slugs.add(slug);
      const name = get("name");
      if (name) nameAuthors.add(`${normalizeName(name)}|${(get("authorHandle") ?? "").toLowerCase()}`);
    }
  }
  return { urls, slugs, nameAuthors, maxId };
}

function formatBotEntry(bot) {
  const lines = [
    "  {",
    `    id: ${str(bot.id)},`,
    `    slug: ${str(bot.slug)},`,
    `    name: ${str(bot.name)},`,
  ];
  if (bot.author) lines.push(`    author: ${str(bot.author)},`);
  if (bot.authorHandle) lines.push(`    authorHandle: ${str(bot.authorHandle)},`);
  lines.push("    description:", `      ${str(bot.description)},`);
  lines.push(`    integrations: [${bot.integrations.map(str).join(", ")}],`);
  lines.push("    installs: 0,");
  lines.push(`    category: ${str(bot.category)},`);
  if (bot.categories?.length) lines.push(`    categories: [${bot.categories.map(str).join(", ")}],`);
  if (bot.isOfficial) lines.push("    isOfficial: true,");
  lines.push(`    shape: ${str(bot.shape)},`);
  lines.push(`    color: ${str(bot.color)},`);
  lines.push(`    iconColor: ${str(bot.iconColor)},`);
  lines.push(`    createdAt: ${str(CREATED_AT)},`);
  if (bot.xPostUrl) lines.push(`    xPostUrl: ${str(bot.xPostUrl)},`);
  lines.push(`    xaiBotUrl: ${str(bot.xaiBotUrl)},`);
  lines.push("  },");
  return lines.join("\n");
}

function appendToCategoryFile(category, bots) {
  const filePath = path.join(BOTS_DIR, `${category}.ts`);
  const content = fs.readFileSync(filePath, "utf8");
  if (!/\n\];\s*$/.test(content)) throw new Error(`Unexpected file ending: ${filePath}`);
  const insert = bots.map(formatBotEntry).join("\n");
  fs.writeFileSync(filePath, content.replace(/\n\];\s*$/, `\n${insert}\n];\n`));
}

function formatReadmeLine(bot) {
  const name = bot.name.replace(/([[\]])/g, "\\$1");
  const handle = bot.authorHandle ? ` by ${bot.authorHandle}` : "";
  return `- **[${name}](${bot.xaiBotUrl})**${handle} — ${bot.description}`;
}

function appendToReadmeSection(filePath, header, lines) {
  const content = fs.readFileSync(filePath, "utf8");
  const start = content.indexOf(`\n${header}\n`);
  if (start === -1) throw new Error(`Section not found: ${header} in ${filePath}`);
  const afterHeader = start + header.length + 2;
  const next = content.indexOf("\n## ", afterHeader);
  const insertAt = next === -1 ? content.length : next;
  const head = content.slice(0, insertAt).replace(/\s+$/, "");
  const tail = content.slice(insertAt);
  fs.writeFileSync(filePath, `${head}\n${lines.join("\n")}\n${tail.startsWith("\n") ? tail : `\n${tail}`}`);
}

function main() {
  const existing = readExisting();
  const skipped = [];
  const toAdd = [];
  let nextId = existing.maxId + 1;

  for (const bot of NEW_BOTS_2026_10_07) {
    const key = `${normalizeName(bot.name)}|${(bot.authorHandle ?? "").toLowerCase()}`;
    const reason = existing.urls.has(bot.xaiBotUrl)
      ? "xaiBotUrl"
      : existing.slugs.has(bot.slug)
        ? "slug"
        : existing.nameAuthors.has(key)
          ? "name+author"
          : null;
    if (reason) {
      skipped.push({ name: bot.name, reason });
      continue;
    }
    existing.urls.add(bot.xaiBotUrl);
    existing.slugs.add(bot.slug);
    existing.nameAuthors.add(key);
    toAdd.push({ ...bot, id: String(nextId++) });
  }

  const byCategory = new Map();
  for (const bot of toAdd) {
    byCategory.set(bot.category, [...(byCategory.get(bot.category) ?? []), bot]);
  }

  for (const [category, bots] of byCategory) {
    appendToCategoryFile(category, bots);
    for (const [file, lang] of [["README.md", "en"], ["README.zh.md", "zh"]]) {
      appendToReadmeSection(path.join(ROOT, file), CATEGORY_README[category][lang], bots.map(formatReadmeLine));
    }
  }

  const official = toAdd.filter((bot) => bot.isOfficial);
  if (official.length > 0) {
    for (const [file, lang] of [["README.md", "en"], ["README.zh.md", "zh"]]) {
      appendToReadmeSection(path.join(ROOT, file), OFFICIAL_SECTION[lang], official.map(formatReadmeLine));
    }
  }

  console.log(
    JSON.stringify(
      {
        syncedAt: CREATED_AT,
        candidates: NEW_BOTS_2026_10_07.length,
        added: toAdd.length,
        official: official.length,
        skipped,
        byCategory: Object.fromEntries([...byCategory].map(([key, bots]) => [key, bots.length])),
        idRange: toAdd.length ? `${toAdd[0].id}–${toAdd.at(-1).id}` : null,
      },
      null,
      2,
    ),
  );
}

main();
