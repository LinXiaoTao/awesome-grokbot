import { cn } from "@/lib/utils";

interface BotIconProps {
  name: string;
  iconColor: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-16 w-16 rounded-2xl",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
};

export function BotIcon({
  name,
  iconColor,
  size = "md",
  className,
}: BotIconProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-white",
        iconColor,
        sizeClasses[size],
        className,
      )}
      aria-label={`${name} icon`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn(iconSizes[size], "text-white")}
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 5.58 2 10c0 2.24 1.12 4.27 2.94 5.72L4 20l4.5-2.08c1.13.36 2.32.58 3.5.58 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
      </svg>
    </div>
  );
}
