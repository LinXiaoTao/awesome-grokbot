# Awesome Grok Bot [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

English | [中文](README.zh.md)

> A curated list of the best [Grok Bots](https://x.ai/bot) — AI assistants built on xAI's Grok platform.

[Grok Bots](https://x.ai/bot) are AI assistants on xAI's Grok platform. Each bot is a specialized agent with its own profile, integrations, and routines — built to do one job well, from managing your inbox to reviewing pull requests. This list collects the best community-built Grok Bots in one place.

## Contents

- [Productivity](#productivity)
- [Coding](#coding)
- [Research](#research)
- [Social](#social)
- [Finance](#finance)
- [Lifestyle](#lifestyle)
- [Enterprise](#enterprise)

## Productivity

Bots for email, calendar, task management, and writing.

- **[Product Idea Stress Test](#product-idea-stress-test)** by @hnshah — Investigates a product or startup idea for founders. Surfaces what has to be true, evidence for and against, the assumption most likely to kill it, and what to do next.
- **[Newsletter Cleanup](#newsletter-cleanup)** by @scheemunai — Buckets everything into a review page you can actually read, then acts on your decisions. It unsubscribes rather than deletes, so nothing disappears from your inbox.
- **[Critiquito](#critiquito)** by @mamuso — A product design critic that reviews interface screenshots from the person who has to use them. It names what is unclear, hard, or unforgiving, and picks one highest-impact fix.
- **[Pitch Deck Coach](#pitch-deck-coach)** by @hnshah — Upload the deck and it reports back on what lands, what gets believed, what raises a question, and what survives the meeting, then helps you sharpen the story.
- **[Grok Bot Coach](#grok-bot-coach)** — Help you design, audit, and tune Grok bots so they are usable and helpful. Start from a concrete job in the profile, the right connectors, standing routines for the work.
- **[Dispatch](#dispatch)** by @FilippoFonseca — If someone agreed to a call and no invite exists, it creates the calendar event, which closes the gap where a yes quietly turns into nothing ever being scheduled.
- **[Google Agent](#google-agent)** by @ryanthawks — It searches and reads your mail, files and events freely, and stops for an explicit yes before it sends, deletes or moves anything. The asymmetry is the whole design.
- **[Inbot](#inbot)** by @matt_silberman — Setup asks you to connect the lot — mail, Slack or Teams, calendars, Notion and messengers — and then it works them down.
- **[Spark (Onboarding)](#spark-onboarding)** by @vincentzhu — Asks a short set of questions, creates the bots that match your answers, and then nudges you towards connecting the accounts.
- **[Rutin](#rutin)** by @naoufal_elh — A Monday-morning optimizer that scans every bot's routines and proposes schedule fixes.
- **[Reaper](#reaper)** — Find recurring work, tools, processes, and obligations that no longer justify their existence.
- **[AIUsageBot](#aiusagebot)** — Interviews you about which AI subscriptions to track and where leftover lives, then pings remaining %.
- **[Human Copywriter](#human-copywriter)** — A human-voice rewrite desk for email, posts, blogs, DMs, landing-page bodies, and PR.
- **[grokbots.best](#grokbots-best)** — Submits public Grok Bot templates to the grokbots.best directory.
- **[Bot inbox](#bot-inbox)** by @waynesutton — A weekday unread digest for Grok Bots. Lists bots and group chats with new activity, one line each.
- **[ShopBot](#shopbot)** — Buys things online for you using web search, Shopify, and Link — goes from product hunt to checkout on its own computer.
- **[AI PM OS](#ai-pm-os)** — Sample of the AI PM OS for product managers. Leads with the Problem First skill to pull teams back from solutions to the underlying problem.
- **[Bodyguard](#bodyguard)** by @liam_fallen — Protects the owner's time and attention from requests that do not deserve direct access. Classifies inbound email and calendar asks into let-through, bundle, or decline.
- **[Fixer](#fixer)** by @liam_fallen — Takes annoying loose-end problems, investigates fully, and gets them as close to resolved as possible before needing you.
- **[Onboarding Coach](#onboarding-coach)** — Welcomes new Grok Bot users, learns how they live and work, then proposes concrete jobs and how a specialist team should grow.
- **[Shikamaru](#shikamaru)** — Chief of Staff who hires and manages specialist agents in a named world. Speaks up only for world-level calls or tasks that cannot be delegated.
- **[Workshop Facilitator](#workshop-facilitator)** — Facilitates workshops with a person and other specialist agents. Sets one objective, tracks open questions, and closes only when leftover work has an owner.
- **[den](#den)** by @Adamdesgns — Family-bot relay that sits between dad and the family's bots so he can stay consistent on academics, money habits, and raising kids while on the road.
- **[Chief](#chief)** — Router only, never the worker. Assigns one object owner, then stays out of the pair. Hears one line: live, blocked, or an owner call.
- **[Dewey](#dewey)** — Watches Gmail and pings you when a message looks time-sensitive or needs a reply. Reads freely; never sends, replies, or trashes mail unless you ask.

## Coding

Developer tools, code review, and engineering workflows.

- **[AI Harness Assistant](#ai-harness-assistant)** — Keep your computers current on AI coding harnesses you already use (Codex, Claude Code, Grok Build, OpenCode, Cursor, and similar). Update installed tools only.
- **[loops](#loops)** — Generalized engineering outer loop. Sits above coding agents, uses pstack as reference, writes goal-style prompts with testable proof, and runs the loop.
- **[PR Reviewer](#pr-reviewer)** by @mustafaergisi — Leads with what can break, what is untested and where the context is too thin to judge, so review starts at the scary part of the diff instead of the easy part.
- **[Site Audit](#site-audit)** — SEO + content + speed + a11y + CRO + schema audit. Scored, P0/P1/P2, evidence URLs. Monthly diff. No invented metrics.
- **[Cursor Agent](#cursor-agent)** — Local-only builder. Runs cursor-agent CLI on the user's laptop for experiments and a shop-floor CLI. Cloud agents stay the default for GitHub PRs.
- **[Dr Eggbot](#dr-eggbot)** by @poteto — Asks a handful of preference questions, then generates a properly structured bot rather than a blank one.
- **[Forge (Template Foundry)](#forge-template-foundry)** by @rryssf — Hand it a task or a job description and it returns a complete bot recipe on the first pass.
- **[freebots.lol](#freebots-lol)** by @Daniel_Farinax — A bot that joins freebots.lol as itself: own Ed25519 key, own page, signed board posts, weekday heartbeats.
- **[Professor Oak](#professor-oak)** by @kiaraplds — A lab-coat agent-maker. Invents memorable names, writes full job descriptions, and gives every new agent a matching mascot face.
- **[Gardener](#gardener)** — Weed leftover from a codebase. Small fixes only, never a refactor, never a behavior change.
- **[Examiner](#examiner)** — Maintain a reliable timeline of important changes so you can reconstruct what happened.
- **[Apps](#apps)** by @waynesutton — One-shot Convex web apps. Say "build me a chat app" and it scaffolds Vite + React + TypeScript, a Convex backend.
- **[Grimoire](#grimoire)** — Coding wizard with 50 skills and a Grim Council. Spells for vibecoding, business, and running personal workflows on autopilot.
- **[Agent Looper](#agent-looper)** — You say what to build and how to know it's done. It keeps a coding agent working on your computer until that check passes.
- **[UI/UX Designer](#ui-ux-designer)** — World-class product engineer for mobile and desktop web. Ships Convex + TanStack + React end to end with simple, intuitive UI.
- **[Vet](#vet)** — Inspects Grok Bot templates and teammates for malicious intent, hidden instructions, dangerous skills, and unattended routines. Read-only pass/warn/fail verdicts.
- **[Speed Lab](#speed-lab)** — Autoresearch loop for render speed. Walks ranked techniques, keeps only measured LCP wins, and asks whether to submit results to the makefaster.dev leaderboard.

## Research

Information gathering, analysis, and competitive intelligence.

- **[Research Bot](#research-bot)** by @ArthurMacwaters — Reasons from first principles and refuses to hand back an answer with an unverified source without saying so, which is the difference between research and a confident guess.
- **[last30days](#last30days)** by @mvanhorn — Research what people actually say about any topic in the last 30 days across Hacker News, YouTube, GitHub, and Reddit.
- **[Frontier Model Watch](#frontier-model-watch)** — Watches official releases from xAI, Anthropic, Google, OpenAI, Moonshot, Alibaba, Zhipu, DeepSeek, MiniMax, and Tencent. Runs at 07:30 EAT. Sends a short brief.
- **[Lennybot](#lennybot)** by @lennysan — Answers questions from Lenny's Data archive.
- **[StoriesBot](#storiesbot)** by @viticci — Longform reviews, Setups and the Shortcuts Archive, all answerable in one place. Another creator archive: the corpus is the publication's own writing.
- **[Interrogator](#interrogator)** — Find important assumptions the owner is operating on and check whether they are still true.
- **[Competitor Watching](#competitor-watching)** — Snapshots you vs 3-8 competitors (pricing, changelog, features, jobs, messaging). Weekly diffs.
- **[Scout](#scout)** — A competitive intelligence agent for organic growth.
- **[Index](#index)** — SEO and AEO program teammate. Reads what you already connected, recommends a stack, runs keyword research, writer briefs, and technical search health.
- **[News Scout](#news-scout)** — Weekday morning news scout for your niche. Message digest or morning scout and it replies with today's picks or the slow-day line.

## Social

Content creation, social media management, and fan engagement.

- **[Repost X Posts Everywhere](#repost-x-posts)** by @jackfriks — Mirrors new X posts to Threads, LinkedIn, Facebook, and Bluesky through Post Bridge. For people who post on X and want those originals everywhere.
- **[Clip Bot](#clip-bot)** by @ThisWeeknAI — Cuts social-ready podcast highlights from YouTube: captioned 16:9 clips with karaoke captions and a source card, then drops the file on your computer.
- **[Imogen (Alt Text)](#imogen-alt-text)** by @kentcdodds — Writes short alt text focused on the part of the image that actually matters, so posts stay accessible.
- **[Shorty](#shorty)** by @farzyness — Starts from proven performers rather than everything you have posted, picks the strong hooks, formats 9:16 with captions.
- **[Clipper](#clipper)** by @thesoragirls — Takes footage from X or your own files, watches it, decides what the moment actually is, captions the talking GIFs.
- **[X Brief](#x-brief)** by @daniel_mac8 — On first chat, connect X, learn what you actually pay attention to from your recent posts, confirm that beat.
- **[Growth Desk](#growth-desk)** by @Av1dlive — Draft-only X growth desk. You grow one named account. You do not research the feed. You do not post.
- **[X Top 500 Fans](#x-top-500-fans)** — Ranks your top 500 X fans each month by who liked your posts most.
- **[Video Editor](#video-editor)** — Takes your raw footage and handles clips, cuts, sound, titles, pacing, and export — end-to-end video editing on its own machine.
- **[Content Growth Coach](#content-growth-coach)** — Paste your YouTube, TikTok, X, or stream. It tells you what's holding the page back, what to fix first, and what to post next.
- **[Blair](#blair)** — Personal shopping agent that hunts used and secondhand designer goods across marketplaces, surfaces matches with pics and prices, and reaches out to sellers with your approval.
- **[X High Coach](#x-high-coach)** — Drop an X username. Get a score, health flags, unfollow watch, and punchy rewrites for anyone who wants more reach and fewer surprises.
- **[떡이](#tteok-i)** — X account editor. One diagnosis of what is holding the account back, one next post in their voice, plus the cut of what not to post.
- **[Paddy](#paddy)** — YouTube strategist for creators who want the whole video judged, not just the title. Checks topic, title, thumbnail, spoken open, and what to leave alone after publish.

## Finance

Budgeting, deals, credit cards, and expense tracking.

- **[Bounty Hunter](#bounty-hunter)** by @liam_fallen — Goes looking for money that is already yours but unclaimed: missed refunds, forgotten credits, overcharges and things you are owed and never got round to pursuing.
- **[Credit Card Max](#credit-card-max)** — Advises which credit card to use for a given purchase to maximize points, cash back, and perks. Tracks cards, unused benefits, and misrouted recurring charges.
- **[Deal Hunting](#deal-hunting)** — Landed-cost shopping: real prices, shipping and tax, preferred retailers. Watchlist optional. Never buys unless asked.
- **[Point Peddler](#point-peddler)** by @poteto — Its one job is credit-card and airline points, so you never spend longer than a moment deciding how to book.
- **[Lease Finder](#lease-finder)** — Hunts current lease deals on whatever you're shopping. Pulls sites that track deep discounts.
- **[Receipt Scanner](#receipt-scanner)** by @limeunfiltered — Logs emailed receipts into a Google Sheet and Drive folder.
- **[Cost-Smart Health Brief](#cost-smart-health-brief)** — Turns one health or health-system question into a 3-minute brief: evidence, cheaper options, and when to see a clinician. Not a doctor.
- **[Tradey](#tradey)** — Autonomous short-term equity desk. North star: beat SPY on a dedicated brokerage cash account. Pings only after a live place or a broker reject you must know.
- **[porshe](#porshe)** — Business-money scout that finds unpaid invoices, pending payments, and uncollected work in your inbox, then names the one next action to collect it.

## Lifestyle

Health, cooking, home, family, and fitness.

- **[Be Happier](#be-happier)** by @lennysan — Looks at your email and calendar each week, then suggests 3 concrete things that would make you happier. Protects existing life, does not add new habits.
- **[Chef](#chef)** by @DogecoinNorway — Defaults to seasonal local recipes rather than whatever is trending, turns the plan into a shopping list, and places the order online.
- **[Tradbot](#tradbot)** by @clairevo — Despite the name it is not a trading bot: it watches your personal inbox and calendar so school items, family plans and household follow-ups stop slipping through.
- **[Home Robots](#home-robots)** by @SawyerMerritt — Connect each robot once and then run the lot by talking to a single bot, instead of opening a different app for the lawn, the floors and everything else.
- **[Chicken Joe (Surf Report)](#chicken-joe-surf-report)** by @parker__conrad — Works through the breaks from Marin County down to Santa Cruz before you are awake, so the answer is one message rather than nine tabs.
- **[Melissa (Fitness & Nutrition Coach)](#melissa-fitness-nutrition-coach)** by @tpgoebel — Logs meals as they happen and balances chasing you for updates against leaving you alone.
- **[Homework Checker](#homework-checker)** by @kevinace — An after-school summary of what is outstanding, plus a one-off explainer on the topic whenever a score dips.
- **[TeslrBot](#teslrbot)** by @HeresMyEth — Control happens through a third-party connector you log into on the bot's own machine, so the car is reachable without you copying tokens around.
- **[Travel Agent](#travel-agent)** — Travel partner for trip logging, city scoring, and light itinerary prep. Logs trips in a Notion Travel Log and confirms before creating or editing rows.
- **[Friend Cloner](#friend-cloner)** — Turn a WhatsApp group into a Grok Bot friend group. Reads how they talk, learns their voice, then drafts a bot of them for your approval before creation.

## Enterprise

Team management, executive assistants, and orchestration.

- **[Talent Matchmaker](#talent-matchmaker)** by @lennysan — Matches job seekers with open roles from your email. Scans investor updates and inbound for hiring signals and people looking, tracks both sides of the marketplace.
- **[Projects Manager](#projects-manager)** by @ericzakariasson — Spins up a coder, designer, researcher and writer as separate bots, gives each project its own Notion row and channel, and lets the specialists claim tasks.
- **[Jess (Executive Assistant)](#jess-executive-assistant)** by @LoganARobison — A weekday executive assistant: it reads everything first, answers staff questions from a written playbook, and posts the client call notes so you start the day caught up.
- **[Kody](#kody)** by @kentcdodds — Sits across people, projects and your other assistants, and its job is to make what you said matters actually turn into work that is moving somewhere.
- **[Alfred (Bot Chief Advisor)](#alfred-bot-chief-advisor)** by @heyrobinai — Rather than building one assistant, it audits the set you already have and reshapes the org as the business changes.
- **[Kirk (Enterprise Crew)](#kirk-enterprise-crew)** by @The_Mr_Wizard — A Star Trek role-play that is also a genuine agent-team demo: the command chair spawns specialists who work as a crew.
- **[TheFounder](#thefounder)** by @DaniAcostaAI — The founder's chief of staff and keeper of the shared machine. Route work to specialists.
- **[Echo](#echo)** by @kristaletz — Turns a customer call into slides from customer context. Works with Figma or Google Slides.
- **[Chieeeeefy](#chieeeeefy)** by @naoufal_elh — Chief of Staff for a Field Engineer. Calendar and work Gmail first. Convert event timezones to the user's current local time.
- **[Master](#master)** — Lean orchestrator only. Never owns work clocks or keeps recurring personal tasks. Routes immediately to specialist owners.
- **[Chief of Staff](#chief-of-staff)** by @Av1dlive — You are the Chief of Staff. One brain. You run the person's day and the company from one desk.
- **[Leader 1:1 Bot](#leader-1-1-bot)** by @scottxmetcalf — Carries the thread forward instead of restarting each week, picks the few topics actually worth the slot.
- **[PhoneZero Operator](#phonezero-operator)** — Runs PhoneZero outbound calls. Walks Telnyx and xAI setup on its computer, plans first, waits for an explicit yes, then reports what a live person said.
- **[koala](#koala)** by @kentcdodds — Kent C. Dodds' launch GTM bot for kody.codes. Kody is your assistant's home: memory, keys, code, and automations portable across MCP hosts.

## Contributing

See [contributing.md](contributing.md) for how to submit a bot.

## Website

Browse the full directory at [awsomebot.com](https://awsomebot.com).

## Maintainer

**LinXiaoTao** — [GitHub](https://github.com/LinXiaoTao) · [X](https://x.com/linxiaotao1993) · [Email](mailto:linxiaotao1993@gmail.com)

## Disclaimer

This is a community-maintained directory. Not affiliated with xAI.

## License

[![CC0](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, the contributors have waived all copyright and related or neighboring rights to this work.
