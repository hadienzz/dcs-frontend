import type { FormEvent } from "react";
import { Plus } from "lucide-react";

import type { BudgetItem } from "@/components/sdg-dashboard/dashboard-data";
import {
  getBudgetItemRemainingAmount,
  getBudgetItemSubtotal,
  visibilityScopeOptions,
} from "@/components/sdg-dashboard/dashboard-data";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { VisibilityBadge } from "@/components/sdg-dashboard/visibility-badge";
import { Button } from "@/components/ui/button";
import {
  FieldBlock,
  fieldClassName,
  Input,
} from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { InternalStageNotice } from "@/components/sdg-dashboard/internal/internal-stage-notice";

interface InternalProjectBudgetSectionProps {
  budgetUnlocked: boolean;
  budgetSaved: boolean;
  budgetItems: BudgetItem[];
  totalBudgetLabel: string;
  spentBudgetLabel: string;
  remainingBudgetLabel: string;
  onAddBudgetItem: () => void;
  onUpdateBudgetItem: (
    itemId: string,
    field: keyof Omit<BudgetItem, "id">,
    value: string,
  ) => void;
  onAddBudgetExpense: (itemId: string) => void;
  onUpdateBudgetExpense: (
    itemId: string,
    expenseId: string,
    field: "description" | "date" | "amount",
    value: string,
  ) => void;
  onRemoveBudgetExpense: (itemId: string, expenseId: string) => void;
  onSaveBudget: (event: FormEvent<HTMLFormElement>) => void;
  onGoToProgress: () => void;
}

export function InternalProjectBudgetSection({
  budgetUnlocked,
  budgetSaved,
  budgetItems,
  totalBudgetLabel,
  spentBudgetLabel,
  remainingBudgetLabel,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onAddBudgetExpense,
  onUpdateBudgetExpense,
  onRemoveBudgetExpense,
  onSaveBudget,
  onGoToProgress,
}: InternalProjectBudgetSectionProps) {
  return (
    <div className="space-y-6">
      {!budgetUnlocked ? (
        <InternalStageNotice
          title="Budget menunggu timeline"
          description="Simpan timeline 3 bulan lebih dulu agar RAB dan realisasi anggaran mengikuti kebutuhan eksekusi yang sudah jelas."
        />
      ) : null}

      <PortalSection
        eyebrow="Step 3"
        title="Budget RAB, realisasi, dan visibilitas"
        description="Setiap item bisa ditandai apakah dibagikan ke mitra atau hanya untuk kebutuhan internal."
        action={
          <Button type="button" variant="outline" onClick={onAddBudgetItem} disabled={!budgetUnlocked}>
            <Plus data-icon="inline-start" />
            Tambah item
          </Button>
        }
      >
        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">Total RAB</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{totalBudgetLabel}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">Anggaran terpakai</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{spentBudgetLabel}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">Sisa anggaran</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{remainingBudgetLabel}</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={onSaveBudget}>
          <fieldset disabled={!budgetUnlocked} className={!budgetUnlocked ? "space-y-4 opacity-70" : "space-y-4"}>
            {budgetItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/80 bg-muted/10 p-5">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_160px_140px_160px_200px]">
                  <FieldBlock htmlFor={`${item.id}-description`} label="Deskripsi">
                    <Input
                      id={`${item.id}-description`}
                      value={item.description}
                      onChange={(event) =>
                        onUpdateBudgetItem(item.id, "description", event.target.value)
                      }
                    />
                  </FieldBlock>
                  <FieldBlock htmlFor={`${item.id}-category`} label="Kategori">
                    <Input
                      id={`${item.id}-category`}
                      value={item.category}
                      onChange={(event) =>
                        onUpdateBudgetItem(item.id, "category", event.target.value)
                      }
                    />
                  </FieldBlock>
                  <FieldBlock htmlFor={`${item.id}-volume`} label="Volume">
                    <Input
                      id={`${item.id}-volume`}
                      type="number"
                      min={0}
                      value={item.volume}
                      onChange={(event) =>
                        onUpdateBudgetItem(item.id, "volume", event.target.value)
                      }
                    />
                  </FieldBlock>
                  <FieldBlock htmlFor={`${item.id}-unit`} label="Unit">
                    <Input
                      id={`${item.id}-unit`}
                      value={item.unit}
                      onChange={(event) =>
                        onUpdateBudgetItem(item.id, "unit", event.target.value)
                      }
                    />
                  </FieldBlock>
                  <FieldBlock htmlFor={`${item.id}-scope`} label="Visibilitas">
                    <select
                      id={`${item.id}-scope`}
                      className={fieldClassName()}
                      value={item.visibilityScope}
                      onChange={(event) =>
                        onUpdateBudgetItem(item.id, "visibilityScope", event.target.value)
                      }
                    >
                      {visibilityScopeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FieldBlock>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <FieldBlock htmlFor={`${item.id}-unit-cost`} label="Biaya satuan">
                    <Input
                      id={`${item.id}-unit-cost`}
                      type="number"
                      min={0}
                      value={item.unitCost}
                      onChange={(event) =>
                        onUpdateBudgetItem(item.id, "unitCost", event.target.value)
                      }
                    />
                  </FieldBlock>
                  <div className="rounded-2xl border border-border/80 bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Anggaran terpakai
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(item.spentAmount)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Dihitung otomatis dari detail pengeluaran di bawah.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Ringkasan item
                      </p>
                      <VisibilityBadge scope={item.visibilityScope} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">Subtotal RAB</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(getBudgetItemSubtotal(item))}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">Sisa budget</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(getBudgetItemRemainingAmount(item))}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-border/80 bg-background p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Detail pengeluaran
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Catat pengeluaran yang membentuk realisasi item RAB ini agar mitra juga bisa melihat rinciannya.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onAddBudgetExpense(item.id)}
                    >
                      <Plus data-icon="inline-start" />
                      Tambah pengeluaran
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {item.expenses.length > 0 ? (
                      item.expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="grid gap-3 rounded-2xl border border-border/80 bg-muted/10 p-4 md:grid-cols-[170px_minmax(0,1fr)_180px_auto]"
                        >
                          <FieldBlock htmlFor={`${expense.id}-date`} label="Tanggal">
                            <Input
                              id={`${expense.id}-date`}
                              type="date"
                              value={expense.date}
                              onChange={(event) =>
                                onUpdateBudgetExpense(
                                  item.id,
                                  expense.id,
                                  "date",
                                  event.target.value,
                                )
                              }
                            />
                          </FieldBlock>
                          <FieldBlock htmlFor={`${expense.id}-desc`} label="Pengeluaran">
                            <Input
                              id={`${expense.id}-desc`}
                              value={expense.description}
                              onChange={(event) =>
                                onUpdateBudgetExpense(
                                  item.id,
                                  expense.id,
                                  "description",
                                  event.target.value,
                                )
                              }
                              placeholder="Contoh: konsumsi kickoff"
                            />
                          </FieldBlock>
                          <FieldBlock htmlFor={`${expense.id}-amount`} label="Nominal">
                            <Input
                              id={`${expense.id}-amount`}
                              type="number"
                              min={0}
                              value={expense.amount}
                              onChange={(event) =>
                                onUpdateBudgetExpense(
                                  item.id,
                                  expense.id,
                                  "amount",
                                  event.target.value,
                                )
                              }
                            />
                          </FieldBlock>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveBudgetExpense(item.id, expense.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 px-4 py-4">
                        <p className="text-sm leading-6 text-muted-foreground">
                          Belum ada rincian pengeluaran. Tambahkan transaksi pertama agar realisasi anggaran terbentuk.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={!budgetUnlocked}>
              Simpan budget
            </Button>
            <Button type="button" variant="outline" onClick={onGoToProgress} disabled={!budgetSaved}>
              Buka progress
            </Button>
          </div>
        </form>
      </PortalSection>
    </div>
  );
}
