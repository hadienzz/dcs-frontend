import { cn } from "@/lib/utils";

type ParticipantAvatarSize = "sm" | "md";

interface ParticipantAvatarProps {
  name: string;
  size?: ParticipantAvatarSize;
  className?: string;
}

const sizeClassNames: Record<ParticipantAvatarSize, string> = {
  sm: "size-10 rounded-xl text-sm",
  md: "size-11 rounded-[14px] text-sm",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  return initials || "P";
}

export function ParticipantAvatar({
  name,
  size = "md",
  className,
}: ParticipantAvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center border border-primary/10 bg-primary/[0.08] font-semibold tracking-[0.02em] text-primary shadow-[0_10px_20px_-18px_rgba(182,37,42,0.4),inset_0_1px_0_rgba(255,255,255,0.72)]",
        sizeClassNames[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
