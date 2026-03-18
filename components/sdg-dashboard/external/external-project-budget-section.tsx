import type {
  BudgetItem,
  PartnerStageApprovalStatus,
} from "@/components/sdg-dashboard/dashboard-data";
import {
  getBudgetItemRemainingAmount,
  getBudgetItemSubtotal,
} from "@/components/sdg-dashboard/dashboard-data";
import { formatCurrency } from "@/components/sdg-dashboard/dashboard-formatters";
import { ExternalStageApprovalAction } from "@/components/sdg-dashboard/external/external-stage-approval-action";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { VisibilityBadge } from "@/components/sdg-dashboard/visibility-badge";

interface ExternalProjectBudgetSectionProps {
  budgetItems: BudgetItem[];
  totalBudgetLabel: string;
  spentBudgetLabel: string;
  remainingBudgetLabel: string;
  approvalStatus: PartnerStageApprovalStatus;
  canApprove: boolean;
  approvalHelperText?: string;
  onApprove: () => void;
}

export function ExternalProjectBudgetSection({
  budgetItems,
  totalBudgetLabel,
  spentBudgetLabel,
  remainingBudgetLabel,
  approvalStatus,
  canApprove,
  approvalHelperText,
  onApprove,
}: ExternalProjectBudgetSectionProps) {
  return (
    <PortalSection
      eyebrow="RAB & realisasi"
      title="Detail budget yang dibagikan"
      description="Mitra melihat rincian item RAB, total anggaran, pengeluaran per transaksi, dan sisa budget untuk proyek ini sebelum memberi persetujuan budget."
      action={
        <ExternalStageApprovalAction
          status={approvalStatus}
          buttonLabel="Setujui budget"
          pendingLabel="Menunggu persetujuan budget"
          approvedLabel="Budget disetujui mitra"
          disabled={!canApprove}
          helperText={approvalHelperText}
          onApprove={onApprove}
        />
      }
    >
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
          <p className="text-xs font-medium text-muted-foreground">Total RAB</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {totalBudgetLabel}
          </p>
        </div>
        <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Anggaran terpakai
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {spentBudgetLabel}
          </p>
        </div>
        <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
          <p className="text-xs font-medium text-muted-foreground">Sisa budget</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {remainingBudgetLabel}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {budgetItems.length > 0 ? (
          budgetItems.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-border/80 bg-muted/10 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.category}
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {item.description}
                  </p>
                </div>
                <VisibilityBadge scope={item.visibilityScope} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-[20px] border border-border/80 bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">RAB</p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {formatCurrency(getBudgetItemSubtotal(item))}
                  </p>
                </div>
                <div className="rounded-[20px] border border-border/80 bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Terpakai
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {formatCurrency(item.spentAmount)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-border/80 bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Sisa budget
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {formatCurrency(getBudgetItemRemainingAmount(item))}
                  </p>
                </div>
                <div className="rounded-[20px] border border-border/80 bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">Volume</p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {item.volume} {item.unit}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-border/80 bg-background p-5">
                <p className="text-sm font-semibold text-foreground">
                  Detail pengeluaran
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Rincian transaksi yang membentuk realisasi item RAB ini.
                </p>
                <div className="mt-4 space-y-3">
                  {item.expenses.length > 0 ? (
                    item.expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="grid gap-3 rounded-[18px] border border-border/80 bg-muted/10 p-4 md:grid-cols-[150px_minmax(0,1fr)_180px]"
                      >
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Tanggal
                          </p>
                          <p className="mt-2 text-[15px] font-semibold text-foreground">
                            {expense.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Pengeluaran
                          </p>
                          <p className="mt-2 text-[15px] leading-7 text-foreground">
                            {expense.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Nominal
                          </p>
                          <p className="mt-2 text-[15px] font-semibold text-foreground">
                            {formatCurrency(expense.amount)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-border/80 bg-muted/10 px-4 py-4">
                      <p className="text-sm leading-6 text-muted-foreground">
                        Belum ada rincian pengeluaran yang dibagikan untuk item ini.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-border/80 bg-muted/10 px-5 py-6">
            <p className="text-[15px] leading-7 text-muted-foreground">
              Belum ada item budget yang dibagikan ke mitra.
            </p>
          </div>
        )}
      </div>
    </PortalSection>
  );
}
