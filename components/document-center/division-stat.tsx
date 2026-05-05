interface DivisionStatProps {
  label: string;
  value: number;
}

export function DivisionStat({ label, value }: DivisionStatProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
