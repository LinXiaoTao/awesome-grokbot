export const CATEGORY_STYLES: Record<
  string,
  { badge: string; icon: string; accent: string }
> = {
  coding: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-900",
    accent: "border-l-neutral-900",
  },
  enterprise: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-800",
    accent: "border-l-neutral-700",
  },
  finance: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-700",
    accent: "border-l-neutral-600",
  },
  lifestyle: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-600",
    accent: "border-l-neutral-500",
  },
  productivity: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-900",
    accent: "border-l-neutral-800",
  },
  research: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-800",
    accent: "border-l-neutral-700",
  },
  social: {
    badge: "border-neutral-300 bg-neutral-50 text-neutral-800",
    icon: "bg-neutral-700",
    accent: "border-l-neutral-600",
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
