import { cn } from "@/lib/utils";
import type { BotColor, BotShape } from "@/types";
import { resolveBotMark } from "@/lib/grok-bot-marks";

interface BotIconProps {
  name: string;
  shape?: BotShape;
  color?: BotColor;
  slug?: string;
  id?: string;
  iconColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
  thickStroke?: boolean;
  className?: string;
}

const PIXEL_SIZES: Record<"sm" | "md" | "lg" | "xl", number> = {
  sm: 32,
  md: 44,
  lg: 72,
  xl: 96,
};

export function BotIcon({
  name,
  shape,
  color,
  slug,
  id,
  size = "md",
  thickStroke,
  className,
}: BotIconProps) {
  const { coat, geometry } = resolveBotMark({
    shape,
    color,
    slug,
    name,
    id,
  });

  const px = PIXEL_SIZES[size];
  const useThickStroke = thickStroke ?? (size === "lg" || size === "xl");

  return (
    <span
      className={cn(
        "share-template-mark inline-flex shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105",
        className,
      )}
      style={{
        width: px,
        height: px,
        ["--share-coat-light" as string]: coat.light,
        ["--share-coat-dark" as string]: coat.dark,
      }}
      aria-label={`${name} icon`}
    >
      <svg
        aria-hidden="true"
        className={cn(
          "grok-bot-mark marketplace-bot-mark",
          useThickStroke && "marketplace-bot-mark--thick",
        )}
        style={{ width: px, height: px }}
        viewBox="-15 -15 259 259"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={geometry.transform || undefined}>
          <path className="grok-bot-mark__head" d={geometry.head} />
          <path className="grok-bot-mark__eye" d={geometry.leftEye} />
          <path className="grok-bot-mark__eye" d={geometry.rightEye} />
        </g>
      </svg>
    </span>
  );
}
