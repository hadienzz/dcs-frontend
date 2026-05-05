import { Loader2 } from "lucide-react";

export function DocumentCenterAuthLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,#fbfbfc_0%,#f7f7f8_46%,#fff_100%)] px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background px-5 py-4 text-sm font-semibold text-muted-foreground shadow-sm">
        <Loader2 className="size-4 animate-spin text-primary" />
        Memeriksa sesi Document Center...
      </div>
    </main>
  );
}
