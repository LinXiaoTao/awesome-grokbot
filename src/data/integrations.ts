import type { Integration } from "@/types";
import { bots } from "./bots";

export const integrations: Integration[] = [
  { id: "gmail", name: "Gmail" },
  { id: "google-calendar", name: "Google Calendar" },
  { id: "google-drive", name: "Google Drive" },
  { id: "github", name: "GitHub" },
  { id: "slack", name: "Slack" },
  { id: "notion", name: "Notion" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "threads", name: "Threads" },
  { id: "claude-code", name: "Claude Code" },
  { id: "hacker-news", name: "Hacker News" },
  { id: "youtube", name: "YouTube" },
  { id: "reddit", name: "Reddit" },
  { id: "pstack", name: "pstack" },
];

export function getAllIntegrationNames(): string[] {
  const set = new Set<string>();
  integrations.forEach((i) => set.add(i.name));
  bots.forEach((b) => b.integrations.forEach((name) => set.add(name)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
