import type { DocumentPic } from "@/types/document-center";
import { fieldClassName } from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { cn } from "@/lib/utils";

interface PICSelectProps {
  id: string;
  name: string;
  value: string;
  people: DocumentPic[];
  onChange: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function PICSelect({
  id,
  name,
  value,
  people,
  onChange,
  onBlur,
  disabled,
  className,
}: PICSelectProps) {
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
      <option value="">{disabled ? "Pilih divisi terlebih dahulu" : "Pilih PIC"}</option>
      {people.map((person) => (
        <option key={person.id} value={person.id}>
          {person.name}
        </option>
      ))}
    </select>
  );
}
