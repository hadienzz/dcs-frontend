import type { DocumentDivision } from "@/types/document-center";
import { fieldClassName } from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { cn } from "@/lib/utils";

interface DivisionSelectProps {
  id: string;
  name: string;
  value: string;
  divisions: DocumentDivision[];
  onChange: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DivisionSelect({
  id,
  name,
  value,
  divisions,
  onChange,
  onBlur,
  placeholder = "Pilih divisi",
  disabled,
  className,
}: DivisionSelectProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className={cn(fieldClassName(), "appearance-none", className)}
    >
      <option value="">{placeholder}</option>
      {divisions.map((division) => (
        <option key={division.id} value={division.id}>
          {division.name}
        </option>
      ))}
    </select>
  );
}
