import { cn } from "@/lib/utils";
import { sdgById } from "@/lib/sdgs-dashboard-data";

interface SdgIconProps {
  /** SDG id, e.g. "sdg-7". */
  id: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
} as const;

/**
 * Visual SDG marker — colored tile with the goal number. Replaces the
 * generic leaf icon with the recognized UN SDG color palette.
 */
export function SdgIcon({ id, size = "md", className }: SdgIconProps) {
  const sdg = sdgById.get(id);
  if (!sdg) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md font-bold text-white shadow-sm shrink-0",
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
