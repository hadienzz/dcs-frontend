import { cn } from "@/lib/utils";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  id,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-[#fafafa] p-4">
      <div className="pr-4">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-slate-800"
        >
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b6252a]/20 focus-visible:ring-offset-2",
          checked ? "bg-[#b6252a]" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
