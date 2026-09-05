export const CATEGORY_STYLES: Record<
  string,
  { badge: string; icon: string; accent: string }
> = {
  "from-grok-bot-team": {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-900",
    accent: "border-l-neutral-900",
  },
  sales: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-800",
    accent: "border-l-neutral-700",
  },
  marketing: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-700",
    accent: "border-l-neutral-600",
  },
  design: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-600",
    accent: "border-l-neutral-500",
  },
  engineering: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-900",
    accent: "border-l-neutral-800",
  },
  personal: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-600",
    accent: "border-l-neutral-500",
  },
  "recruiting-people": {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-800",
    accent: "border-l-neutral-700",
  },
  operations: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-700",
    accent: "border-l-neutral-600",
  },
  product: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-800",
    accent: "border-l-neutral-700",
  },
};

export function getCategoryStyle(category: string) {
  return (
    CATEGORY_STYLES[category] ?? {
      badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
      icon: "bg-neutral-800",
      accent: "border-l-neutral-700",
    }
  );
}
