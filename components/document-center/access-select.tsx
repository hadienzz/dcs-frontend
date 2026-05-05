import type { DocumentDivision } from "@/types/document-center";
import { ALL_DIVISIONS_VALUE } from "@/utils/document-center";

interface AccessSelectProps {
  divisions: DocumentDivision[];
  value: string;
  disabled?: boolean;
  onChange: (divisionId: string) => void;
}

export function AccessSelect({
  divisions,
  value,
  disabled,
  onChange,
}: AccessSelectProps) {
  return (
    <select
      value={disabled ? ALL_DIVISIONS_VALUE : value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-12 w-full rounded-xl border border-border/80 bg-background px-4 text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <option value="">Assigned access</option>
      <option value={ALL_DIVISIONS_VALUE}>All divisions</option>
      {divisions.map((division) => (
        <option key={division.id} value={division.id}>
          {division.name}
        </option>
      ))}
    </select>
  );
}
