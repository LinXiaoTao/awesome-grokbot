import type { Integration } from "@/types";

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
  return integrations.map((i) => i.name);
}
