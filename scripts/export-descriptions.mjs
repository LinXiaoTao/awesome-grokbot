import { mkdirSync, writeFileSync } from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

register("./strip-ts-hook.mjs", import.meta.url);

const { bots } = await import("../src/data/bots/index.ts");

const seen = new Map();
const duplicateSlugs = [];

for (const bot of bots) {
  if (seen.has(bot.slug)) {
    duplicateSlugs.push(bot.slug);
  }
  seen.set(bot.slug, bot.description ?? "");
}

if (duplicateSlugs.length > 0) {
  console.error(
    `Duplicate slugs (${duplicateSlugs.length}): ${[...new Set(duplicateSlugs)].join(", ")}`,
  );
  console.error("Refusing to overwrite keys. Key descriptions by a unique field before export.");
  process.exit(1);
}

const descriptions = Object.fromEntries(seen);
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "i18n");
const outFile = path.join(outDir, "descriptions.en.json");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(descriptions, null, 2)}\n`);

console.log(`Wrote ${Object.keys(descriptions).length} descriptions to ${outFile}`);
