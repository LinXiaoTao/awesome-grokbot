export interface Bot {
  id: string;
  slug: string;
  name: string;
  author?: string;
  authorHandle?: string;
  description: string;
  longDescription?: string;
  integrations: string[];
  installs: number;
  category: string;
  iconColor: string;
  createdAt: string;
  xPostUrl?: string;
}

export type Category =
  | "all"
  | "productivity"
  | "coding"
  | "research"
  | "social"
  | "finance"
  | "lifestyle"
  | "enterprise";

export type SortOption = "popular" | "newest";

export interface Integration {
  id: string;
  name: string;
  icon?: string;
}
