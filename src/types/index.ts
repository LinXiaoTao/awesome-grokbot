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
  category: Category;
  categories?: string[];
  isOfficial?: boolean;
  shape?: BotShape;
  color?: BotColor;
  iconColor: string;
  createdAt: string;
  xPostUrl?: string;
  xaiBotUrl?: string;
}

export type Category =
  | "all"
  | "from-grok-bot-team"
  | "sales"
  | "marketing"
  | "design"
  | "engineering"
  | "personal"
  | "recruiting-people"
  | "operations"
  | "product";

export type BotShape =
  | "blob"
  | "pebble"
  | "bean"
  | "egg"
  | "squircle"
  | "tablet"
  | "capsule"
  | "cylinder"
  | "hex"
  | "gem"
  | "crystal"
  | "wedge"
  | "shield"
  | "dome"
  | "arch"
  | "cloud"
  | "teardrop"
  | "leaf";

export type BotColor =
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "violet"
  | "magenta"
  | "gray";

export type SortOption = "popular" | "newest" | "name";

export interface Integration {
  id: string;
  name: string;
  icon?: string;
}
