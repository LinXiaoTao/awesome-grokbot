# Contributing

Thanks for helping grow the Awesome Grok Bot directory.

## How to submit a bot

You can submit a bot in either of these ways:

1. **Website form** — Use the [submit form](https://awesomegrokbots.com/submit) on awesomegrokbots.com.
2. **Pull request** — Open a PR in this repository (see format below).

## Pull request format

When submitting via PR, please update both:

1. **README.md** — Add an entry to the correct category section in [README.md](README.md). Also add the translated description to [README.zh.md](README.zh.md).
2. **`src/data/bots.ts`** — Add a full bot object matching the existing `Bot` type (slug, name, description, integrations, installs, category, iconColor, createdAt, and authorHandle when applicable).

Entry format in README:

```markdown
- **[Bot Name](#slug)** by @handle — One-line description.
```

Omit `by @handle` when the bot has no author. Sort entries within each category by installs (descending), then alphabetically by name.

## Quality bar

A bot must meet all of the following to be listed:

- **Publicly available** — Others can find and use it on the Grok platform.
- **Accurate description** — It does what the one-line description says.
- **Maintained** — The bot is kept in working order; broken or abandoned bots may be removed.

## Review process

Submissions are reviewed within **48 hours**. Maintainers may ask for changes before merging. If a bot no longer meets the quality bar, it may be removed from the list.
