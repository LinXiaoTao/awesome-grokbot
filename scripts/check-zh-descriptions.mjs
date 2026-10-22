import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const en = JSON.parse(
  readFileSync(path.join(root, "scripts/i18n/descriptions.en.json"), "utf8"),
);
const zh = JSON.parse(
  readFileSync(path.join(root, "src/data/i18n/descriptions.zh.json"), "utf8"),
);

const cjk =
  /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/u;
const errors = [];

for (const [slug, value] of Object.entries(zh)) {
  if (!Object.prototype.hasOwnProperty.call(en, slug)) {
    errors.push(`key missing from descriptions.en.json: ${slug}`);
    continue;
  }
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`empty value: ${slug}`);
    continue;
  }
  if (!cjk.test(value)) {
    errors.push(`value has no CJK characters: ${slug}`);
  }
}

const zhCount = Object.keys(zh).length;
const total = Object.keys(en).length;
console.log(`coverage: ${zhCount} / ${total}`);

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  console.error(`check failed (${errors.length})`);
  process.exit(1);
}
