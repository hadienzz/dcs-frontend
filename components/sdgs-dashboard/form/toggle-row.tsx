import { cn } from "@/lib/utils";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

/**
 * Lightweight on/off toggle that renders as a styled checkbox so we don't
 * need to add another Radix dep just for two switches.
 */
export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  id,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/70 p-4">
      <div className="pr-4">
        <label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
        {description ? (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
