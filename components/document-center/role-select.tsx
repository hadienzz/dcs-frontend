import type { DocumentUserRole } from "@/types/document-center";

interface RoleSelectProps {
  value: DocumentUserRole;
  onChange: (role: DocumentUserRole) => void;
}

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as DocumentUserRole)}
      className="flex h-12 w-full rounded-xl border border-border/80 bg-background px-4 text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
    >
      <option value="superadmin">Superadmin</option>
      <option value="shared-user">Shared User Account</option>
    </select>
  );
}
