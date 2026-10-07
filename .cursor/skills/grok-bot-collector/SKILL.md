---
name: grok-bot-collector
description: >-
  Searches X (Twitter) for new Grok Bot announcements and adds them to the
  grokbots directory. Use when the user asks to collect bots, search X for bots,
  find new grok bots, update the bot directory, or scrape bot announcements
  from X posts.
disable-model-invocation: true
---

# Grok Bot Collector

Collects Grok Bot entries from X posts via AgentEarth MCP and appends new bots to the project's bot data files.

## Prerequisites

- AgentEarth MCP namespace `user-agentearth` must be available.
- Bot data lives in `src/data/bots/` (split by category, barrel-exported from `src/data/bots/index.ts`)

## Workflow Checklist

When the user says "search X for new grok bots", "collect new bots from X", or similar:

- [ ] **Step 1** — Search X for Grok Bot posts
- [ ] **Step 2** — Parse results into bot entries
- [ ] **Step 3** — Check for duplicates against existing bots
- [ ] **Step 4** — Add new bots to the appropriate category file
- [ ] **Step 5** — Sync `README.md` and `README.zh.md` per `.cursor/rules/sync-readme-on-bot-update.mdc`
- [ ] **Step 6** — Run `pnpm build` to verify

Report a summary at the end: posts searched, bots found, bots added, duplicates skipped.

---

## Step 1: Search X for Grok Bot posts

### 1a. Discover the X search tool

Call `RecommendTools` in namespace `user-agentearth`:

```
query: "search X Twitter posts"
```

Pick the search tool from results. Prefer:

| Tool | Use when |
|------|----------|
| `ae_x_twitter_searchpostsrecent` | Last 7 days (5 credits/call) |
| `ae_x_twitter_searchpostsall` | 8–30 days ago via `start_time` (5 credits/call) |

Use `GetToolDetail` if the input schema is unclear.

### 1b. Run searches

Call `ExecuteTool` with the exact `tool_url` from `RecommendTools` (do not modify it).

Run multiple queries to maximize coverage:

```
"grok bot" -is:retweet
"Grok Bot" -is:retweet
"Grok Bot template" -is:retweet
"@bot is ready" grok -is:retweet
"Meet my Bot" grok -is:retweet
```

Suggested params for each search:

```json
{
  "query": "(\"grok bot\" OR \"Grok Bot\") -is:retweet lang:en",
  "max_results": 25,
  "sort_order": "recency",
  "expansions": "author_id",
  "tweet.fields": "created_at,text,author_id,public_metrics",
  "user.fields": "name,username"
}
```

**30-day window:** Compute `start_time` as 30 days before today in UTC ISO 8601 (e.g. `2026-07-31T00:00:00Z`). Use `ae_x_twitter_searchpostsall` with `start_time` for the full range; use `searchpostsrecent` for the freshest 7 days.

Paginate with `next_token` only when results look promising and credits allow. Tell the user estimated credit cost before running many queries.

### 1c. Filter results

Keep posts that look like **bot announcements**, not generic Grok chat:

- Mentions creating, sharing, or launching a Grok Bot
- Contains a bot name and what it does
- Includes phrases like "my bot", "built a bot", "bot template", "Meet my Bot", "is ready"

Skip: replies with no bot info, pure hype, retweets, unrelated Grok product news.

- Must be possible to find or derive a `https://x.ai/bot/{id}` URL for the bot

---

## Step 2: Parse results

**`xaiBotUrl` is required.** If the collector cannot find a valid `https://x.ai/bot/{id}` URL for a bot, skip that bot and list it in the summary as "needs manual xaiBotUrl".

For each qualifying post, extract:

| Field | Source |
|-------|--------|
| **name** | Bot title in post (often quoted, Title Case, or after "Meet my … Bot") |
| **author** | Display name from expanded user object |
| **authorHandle** | `@username` from author |
| **description** | What the bot does — 1–2 sentences, rewrite clearly if needed |
| **integrations** | Services mentioned: Gmail, Google Calendar, Slack, GitHub, LinkedIn, etc. Use `[]` if none |
| **xPostUrl** | `https://x.com/{username}/status/{tweet_id}` |
| **xaiBotUrl** | `https://x.ai/bot/{id}` — extract from post text, linked URLs, or by visiting the bot page on x.ai |
| **category** | Infer from description (see table below) |
| **slug** | Lowercase name → hyphens, strip special chars (e.g. `"Receipt Scanner"` → `receipt-scanner`) |

### Category heuristics

| Category | Signals |
|----------|---------|
| `engineering` | code, developer, git, IDE, harness, deploy, API, compiler, SQL |
| `sales` | sales, prospect, outreach, deal, pipeline, crm, pitch deck, gtm |
| `marketing` | marketing, social media, X, LinkedIn, copywriter, seo, audience, clips |
| `design` | design, figma, ui, ux, critique, sprite, palette, art director |
| `product` | product idea, competitor, user research, roadmap, founder, review |
| `operations` | workflow, office ops, facilities, admin, notion, legal, audit, invoices, expense |
| `recruiting-people` | recruit, talent, hiring, interview, ats, candidate, people |
| `personal` | lifestyle, health, wellness, habits, daily newspaper, credit cards, home robots |

Default to `operations` when unclear.

### Bot entry defaults

```typescript
{
  id: "<next id>",
  slug: "<generated-slug>",
  name: "<bot name>",
  author: "<display name>",
  authorHandle: "@<handle>",
  description: "<1-2 sentences>",
  integrations: ["Gmail"],
  installs: 0,
  category: "<category>",
  shape: "teardrop", // optional: blob, pebble, bean, egg, squircle, tablet, capsule, cylinder, hex, gem, crystal, wedge, shield, dome, arch, cloud, teardrop, leaf
  color: "blue",     // optional: red, orange, yellow, green, cyan, blue, violet, magenta, gray, brown, black
  iconColor: "bg-blue-500",
  createdAt: "<today YYYY-MM-DD>",
  xPostUrl: "https://x.com/...",
  xaiBotUrl: "https://x.ai/bot/...",
}
```

Only include `longDescription` if the post has substantial extra detail worth preserving.

---

## Step 3: Check for duplicates

Read all category files in `src/data/bots/` before adding anything.

Skip a candidate if **any** match:

- Same `slug` (case-insensitive)
- Same `name` (case-insensitive, ignoring minor punctuation)
- Same `xPostUrl`
- Same `authorHandle` + very similar name

Log skipped duplicates in the final summary.

---

## Step 4: Add new bots

### 4a. Assign IDs

Find the highest numeric `id` across all category files, then increment for each new bot.

### 4b. Pick iconColor

Choose a Tailwind class not already heavily used. Rotate through:

`bg-blue-500`, `bg-purple-500`, `bg-green-500`, `bg-orange-500`, `bg-teal-500`, `bg-red-500`, `bg-indigo-500`, `bg-yellow-500`, `bg-emerald-500`, `bg-cyan-500`, `bg-violet-500`, `bg-amber-500`, `bg-rose-500`, `bg-sky-500`, `bg-fuchsia-500`, `bg-pink-500`, `bg-lime-500`

### 4c. Set createdAt

Use today's date in `YYYY-MM-DD` format.

### 4d. Append to the correct category file

Add new bots to their matching category file in `src/data/bots/<category>.ts`:

- Insert new objects before the closing `];`
- Add a comma after the previous last entry
- Use double quotes for strings, trailing commas on object fields

Example entry:

```typescript
  {
    id: "80",
    slug: "weekly-digest-bot",
    name: "Weekly Digest Bot",
    author: "Jane Doe",
    authorHandle: "@janedoe",
    description:
      "Summarizes your unread emails every Monday and sends a one-page digest.",
    integrations: ["Gmail"],
    installs: 0,
    category: "operations",
    iconColor: "bg-cyan-500",
    createdAt: "2026-08-30",
    xPostUrl: "https://x.com/janedoe/status/1234567890",
    xaiBotUrl: "https://x.ai/bot/abc123",
  },
```

Do not reorder or modify existing entries unless the user asks.

---

## Step 5: Sync READMEs

Follow `.cursor/rules/sync-readme-on-bot-update.mdc`:
- Add new entries to `README.md` and `README.zh.md` under their matching category section.
- Format: `- **[Bot Name](xaiBotUrl)** by @handle — Description.`

---

## Step 6: Verify

```bash
pnpm build
```

If the build fails, fix TypeScript errors and rebuild.

---

## AgentEarth MCP reference

```
namespace: user-agentearth

RecommendTools  → find X tools by natural-language query
GetToolDetail   → inspect a tool's input_schema
ExecuteTool     → run a tool
  - tool_url: exact URL from RecommendTools (never modify)
  - params: per input_schema
```

Optional follow-up tools:

- `ae_x_twitter_getpostsbyid` — fetch full text of a promising post
- `ae_x_twitter_getusersbyusername` — resolve author display name

---

## Marketplace sync (official + third-party)

Use this when asked to sync the official marketplace and third-party directories. Reference implementation: `scripts/manual-incremental-2026-10-07.mjs` (data) and `scripts/sync-2026-10-07.mjs` (writes `src/data/bots/*.ts`, `README.md`, `README.zh.md`).

Sources:

| Source | How to read it |
|--------|----------------|
| Official `https://x.ai/bot/marketplace` | Crawl `/bot/marketplace/<category>` including `from-grok-bot-team`. Each row has `/bot/marketplace/bots/<slug>` and an `Add` link `/bot/<id>`. Set `isOfficial: true`; add `categories: ["From Grok Bot Team", "<Category>"]` for Grok Bot Team bots. Mirror every official bot into the `From Grok Bot Team` README sections. |
| `https://grokbot.dev` | `/marketplace/` lists all bots; each detail page `/marketplace/<slug>/` has JSON-LD (`SoftwareApplication`) with `description`, `author.name`, `installUrl` (the `x.ai/bot/<id>` URL), `citation[0]` (xPostUrl) and `datePublished`. Only fetch detail pages for rows not already matched locally. |
| `https://botdirectory.ai` | Rows are `div.bot-row` with `data-slug`, `data-name`, `data-category`, `data-integrations`; the x.ai URL is inside the row. Descriptions are truncated with `…`. |

Rules learned:

- Deduplicate by `xaiBotUrl` first, then slug, then same normalized name + same `authorHandle`. Same name with a different author is kept and renamed `Name (<author>)`.
- Compute the next `id` from the real maximum across all category files. Parse every entry block with a leading newline, otherwise the first field of each block is missed and ids restart at 1. Check id, slug and URL uniqueness after writing.
- Verify every candidate against `https://x.ai/bot/<id>`: HTTP 404 means skip; `<title>` is `"<name> by <author>"` and `og:description` is the live description (cut at about 150 chars with `...`). A title of just `Grok Bot` is a generic template, skip it.
- grokbot.dev data can be wrong. Some bots share one placeholder description, and some names do not match the live bot. When the grokbot.dev name does not match the x.ai title, or the description is the shared placeholder, use the x.ai title, author and description instead and classify by text.
- Clean truncated descriptions: cut back to the last full sentence if it is at least 60 characters, otherwise strip the ellipsis and end with a period.
- Bot IDs starting with `s` followed by 18+ hex characters are x.ai seed templates; do not attach the grokbot.dev handle.
- `createdAt` is the sync date. Run `pnpm build` at the end.
- Known pre-existing data issue: 18 ids are duplicated across category files (for example `991855`). Do not renumber without asking.

## Edge cases

- **Ambiguous post:** Skip rather than guess. Mention in summary.
- **Bot name missing:** Derive from first line or skip.
- **No integrations mentioned:** Use `[]`.
- **Non-English posts:** Skip unless user requests otherwise.
- **Credit limits:** Run fewer queries, report partial results.
- **Empty results:** Try broader queries (`grok bots`, `"built with grok"`) before giving up.
