import { cn } from "@/lib/utils";
import { sdgById } from "@/lib/sdgs-dashboard-data";

interface SdgIconProps {
  /** SDG id, e.g. "sdg-7". */
  id: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "size-7 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-14 text-sm",
} as const;

/**
 * Visual SDG marker — colored tile with the goal number.
 */
export function SdgIcon({ id, size = "md", className }: SdgIconProps) {
  const sdg = sdgById.get(id);
  if (!sdg) return null;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]",
        sizeMap[size],
        className,
      )}
      style={{ backgroundColor: sdg.color }}
      title={`SDG ${sdg.number} — ${sdg.name}`}
      aria-label={`SDG ${sdg.number} — ${sdg.name}`}
    >
      {sdg.number}
    </div>
  );
}
