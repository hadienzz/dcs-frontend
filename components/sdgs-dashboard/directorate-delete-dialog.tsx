"use client";

import { AlertTriangle, Building2, Layers, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { DirectorateDeleteTarget } from "@/hooks/sdgs-dashboard/use-directorates-management";

interface DirectorateDeleteDialogProps {
  target: DirectorateDeleteTarget | null;
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

function getDeleteCopy(target: DirectorateDeleteTarget | null) {
  if (!target) {
    return {
      label: "item",
      name: "item ini",
      context: "Aksi ini tidak bisa dibatalkan.",
      impact: "Data akan dihapus dari struktur direktorat SDGs.",
      icon: Layers,
    };
  }

  if (target.type === "field") {
    return {
      label: "bidang",
      name: target.field.name,
      context: `${target.field.directorates.length} direktorat di dalam bidang ini ikut terhapus.`,
      impact: "Semua direktorat dan unit turunannya akan hilang dari dashboard.",
      icon: Layers,
    };
  }

  if (target.type === "directorate") {
    return {
      label: "direktorat",
      name: target.directorate.name,
      context: `${target.directorate.units.length} unit di bawah direktorat ini ikut terhapus.`,
      impact: `Direktorat akan dilepas dari ${target.field.name}.`,
      icon: Building2,
    };
  }

  return {
    label: "unit",
    name: target.unit.name,
    context: "Unit ini akan dihapus dari direktorat induknya.",
    impact: `Unit berada di ${target.directorate.name}.`,
    icon: Building2,
  };
}

export function DirectorateDeleteDialog({
  target,
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DirectorateDeleteDialogProps) {
  const copy = getDeleteCopy(target);
  const Icon = copy.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[480px] overflow-hidden rounded-lg p-0">
        <div className="border-b border-border bg-primary/5 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogHeader className="gap-1.5">
              <AlertDialogTitle className="text-xl font-semibold leading-tight text-foreground">
                Hapus {copy.label}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
                Pastikan struktur sudah benar sebelum data ini dihapus.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex gap-3 rounded-xl border border-border bg-background p-4">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm font-semibold text-foreground">
                {copy.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {copy.context}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {copy.impact} Aksi ini akan dikirim ke backend dan tidak bisa
            dibatalkan dari dialog ini.
          </p>
        </div>

        <AlertDialogFooter className="m-0 border-t border-border bg-muted/30 px-6 py-4">
          <AlertDialogClose
            render={
              <Button type="button" variant="outline" disabled={isDeleting}>
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting || !target}
          >
            {isDeleting ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            {isDeleting ? "Menghapus..." : "Hapus sekarang"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
