import { cn } from "@/lib/utils";

interface IntegrationPillProps {
  name: string;
  className?: string;
}

export function IntegrationPill({ name, className }: IntegrationPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted",
        className,
      )}
    >
      {name}
    </span>
  );
}
