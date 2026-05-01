import type { DocumentSubdivision } from "@/types/document-center";
import { fieldClassName } from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { cn } from "@/lib/utils";

interface SubdivisionSelectProps {
  id: string;
  name: string;
  value: string;
  subdivisions: DocumentSubdivision[];
  onChange: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function SubdivisionSelect({
  id,
  name,
  value,
  subdivisions,
  onChange,
  onBlur,
  disabled,
  className,
}: SubdivisionSelectProps) {
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
      <option value="">
        {disabled ? "Pilih divisi terlebih dahulu" : "Pilih subdivisi"}
      </option>
      {subdivisions.map((subdivision) => (
        <option key={subdivision.id} value={subdivision.id}>
          {subdivision.name}
        </option>
      ))}
    </select>
  );
}
