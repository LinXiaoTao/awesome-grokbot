#!/usr/bin/env node
/**
 * Regression: GSC "Not found (404)" export for sc-domain:awsomebot.com
 * (2026-10-30) must resolve to HTTP 200 after following redirects.
 *
 * Usage: node scripts/seo/verify-gsc-404.mjs [url-list.txt]
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const listPath = resolve(
  process.argv[2] ?? `${__dirname}/awsomebot-gsc-404-2026-10-30.txt`,
);
const urls = readFileSync(listPath, "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean);

const concurrency = 20;
let i = 0;
const bad = [];

async function check(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "awsomebot-gsc-404-verify/1.0" },
  });
  if (!res.ok) {
    bad.push({ url, status: res.status, final: res.url });
  }
}

async function worker() {
  while (i < urls.length) {
    const url = urls[i++];
    try {
      await check(url);
    } catch (err) {
      bad.push({ url, status: -1, final: String(err) });
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

if (bad.length) {
  console.error(`FAIL ${bad.length}/${urls.length} did not end at 200:`);
  for (const row of bad.slice(0, 50)) {
    console.error(`  ${row.status} ${row.url} -> ${row.final}`);
  }
  process.exit(1);
}

console.log(`OK ${urls.length}/${urls.length} → HTTP 200 (followed redirects)`);
