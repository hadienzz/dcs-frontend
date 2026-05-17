"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Building2,
  Edit2,
  Eye,
  Key,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  directorateFields,
  directorateById,
  directorateFieldById,
} from "@/lib/sdgs-dashboard-data";
import type { Directorate, DirectorateField, Unit } from "@/types/sdgs-dashboard";

import { PageHeader } from "./page-header";

// --- Types ---
type AccountRole = "admin" | "directorate" | "unit";

interface Account {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  /** For directorate role: which directorate */
  directorateId?: string;
  /** For unit role: which directorate + unit */
  unitId?: string;
  /** Field the directorate belongs to */
  fieldId?: string;
  createdAt: string;
  lastLogin?: string;
}

function uid() {
  return `acc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Sample data
const initialAccounts: Account[] = [
  {
    id: "acc-admin-1",
    name: "Admin SDGs",
    email: "admin@telkomuniversity.ac.id",
    role: "admin",
    createdAt: "2025-01-15T00:00:00Z",
    lastLogin: "2026-05-16T10:30:00Z",
  },
];

type ModalMode =
  | { type: "add" }
  | { type: "edit"; account: Account }
  | null;

type FilterRole = "all" | AccountRole;

const roleLabels: Record<AccountRole, string> = {
  admin: "Admin",
  directorate: "Direktorat",
  unit: "Unit",
};

const roleBadgeStyles: Record<AccountRole, string> = {
  admin:
    "bg-[#b6252a]/[0.06] text-[#b6252a] ring-[#b6252a]/10",
  directorate:
    "bg-blue-50 text-blue-700 ring-blue-100/80",
  unit:
    "bg-emerald-50 text-emerald-700 ring-emerald-100/80",
};

const filterTabs: { key: FilterRole; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "admin", label: "Admin" },
  { key: "directorate", label: "Direktorat" },
  { key: "unit", label: "Unit" },
];

export function AccountsManagementView() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [modal, setModal] = useState<ModalMode>(null);
  const [activeFilter, setActiveFilter] = useState<FilterRole>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // --- CRUD ---
  const addAccount = useCallback((account: Omit<Account, "id" | "createdAt">) => {
    setAccounts((prev) => [
      ...prev,
      { ...account, id: uid(), createdAt: new Date().toISOString() },
    ]);
  }, []);

  const editAccount = useCallback(
    (id: string, updates: Partial<Account>) => {
      setAccounts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      );
    },
    [],
  );

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // --- Filter & search ---
  const filteredAccounts = useMemo(() => {
    let data = accounts;
    if (activeFilter !== "all") {
      data = data.filter((a) => a.role === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      data = data.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q),
      );
    }
    return data;
  }, [accounts, activeFilter, searchQuery]);

  // --- Stats ---
  const stats = useMemo(
    () => ({
      total: accounts.length,
      admin: accounts.filter((a) => a.role === "admin").length,
      directorate: accounts.filter((a) => a.role === "directorate").length,
      unit: accounts.filter((a) => a.role === "unit").length,
    }),
    [accounts],
  );

  // --- Helpers ---
  function getAccessLabel(account: Account): string {
    if (account.role === "admin") return "Akses penuh ke semua data";
    if (account.role === "directorate" && account.directorateId) {
      const dir = directorateById.get(account.directorateId);
      return dir ? `Semua inisiatif ${dir.name}` : "Direktorat tidak ditemukan";
    }
    if (account.role === "unit" && account.directorateId && account.unitId) {
      const dir = directorateById.get(account.directorateId);
      const unit = dir?.units.find((u) => u.id === account.unitId);
      return unit ? `Hanya inisiatif ${unit.name}` : "Unit tidak ditemukan";
    }
    return "—";
  }

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Akun" }]}
        title="Manajemen Akun"
        description="Buat dan kelola akun untuk direktorat dan unit agar bisa mengakses inisiatif SDGs."
        actions={
          <Button onClick={() => setModal({ type: "add" })}>
            <Plus className="size-4" />
            Tambah Akun
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200/60">
            <Users className="size-4 text-slate-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#b6252a]/[0.06] ring-1 ring-[#b6252a]/10">
            <Shield className="size-4 text-[#b6252a]" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.admin}</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100/60">
            <Building2 className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.directorate}</p>
            <p className="text-xs text-slate-400">Direktorat</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100/60">
            <Key className="size-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.unit}</p>
            <p className="text-xs text-slate-400">Unit</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-0.5 rounded-lg border border-black/[0.06] bg-[#f5f5f5] p-1">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/[0.06]"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                    isActive
                      ? "bg-[#b6252a]/[0.08] text-[#b6252a]"
                      : "bg-slate-200/60 text-slate-500",
                  )}
                >
                  {tab.key === "all"
                    ? stats.total
                    : stats[tab.key as AccountRole]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-black/[0.06] bg-white pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
          />
        </div>
      </div>

      {/* Account list */}
      {filteredAccounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/[0.08] bg-white py-12 text-center">
          <Users className="mx-auto mb-3 size-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">
            {searchQuery.trim()
              ? "Tidak ada akun ditemukan"
              : "Belum ada akun"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {searchQuery.trim()
              ? `Tidak ada hasil untuk "${searchQuery.trim()}"`
              : "Klik tombol Tambah Akun untuk membuat akun baru."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-4 rounded-xl border border-black/[0.06] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fafafa]"
            >
              {/* Avatar */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {account.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {account.name}
                  </p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                      roleBadgeStyles[account.role],
                    )}
                  >
                    {roleLabels[account.role]}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Mail className="size-3" />
                  {account.email}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Eye className="size-3" />
                  {getAccessLabel(account)}
                </p>
              </div>

              {/* Meta */}
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-xs text-slate-400">
                  Dibuat {dateFormatter.format(new Date(account.createdAt))}
                </p>
                {account.lastLogin && (
                  <p className="mt-0.5 text-[11px] text-slate-300">
                    Login terakhir{" "}
                    {dateFormatter.format(new Date(account.lastLogin))}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setModal({ type: "edit", account })}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                  title="Edit akun"
                >
                  <Edit2 className="size-3.5" />
                </button>
                {account.role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Hapus akun "${account.name}"? Aksi ini tidak bisa dibatalkan.`,
                        )
                      ) {
                        deleteAccount(account.id);
                      }
                    }}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Hapus akun"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Access info card */}
      <div className="mt-8 rounded-xl border border-black/[0.04] bg-[#fafafa] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          Hak Akses
        </p>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded bg-[#b6252a]/[0.08] text-[#b6252a]">
              <Shield className="size-3" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">Admin</p>
              <p className="text-xs text-slate-400">
                Akses penuh ke semua inisiatif, direktorat, dan pengaturan.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
              <Building2 className="size-3" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">Direktorat</p>
              <p className="text-xs text-slate-400">
                Bisa melihat semua inisiatif milik direktorat tersebut dan
                seluruh unit di bawahnya.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-600">
              <Key className="size-3" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">Unit</p>
              <p className="text-xs text-slate-400">
                Hanya bisa mengakses inisiatif yang dimiliki unit tersebut saja.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <AccountFormModal
          mode={modal}
          onClose={() => setModal(null)}
          onAdd={addAccount}
          onEdit={editAccount}
        />
      )}
    </>
  );
}

// --- Form Modal ---
interface AccountFormModalProps {
  mode: NonNullable<ModalMode>;
  onClose: () => void;
  onAdd: (account: Omit<Account, "id" | "createdAt">) => void;
  onEdit: (id: string, updates: Partial<Account>) => void;
}

function AccountFormModal({
  mode,
  onClose,
  onAdd,
  onEdit,
}: AccountFormModalProps) {
  const isEdit = mode.type === "edit";
  const initial = isEdit ? mode.account : null;

  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<AccountRole>(initial?.role ?? "unit");
  const [selectedFieldId, setSelectedFieldId] = useState(
    initial?.fieldId ?? directorateFields[0]?.id ?? "",
  );
  const [selectedDirId, setSelectedDirId] = useState(
    initial?.directorateId ?? "",
  );
  const [selectedUnitId, setSelectedUnitId] = useState(
    initial?.unitId ?? "",
  );

  // Available directorates based on field
  const availableDirs = useMemo(() => {
    const field = directorateFields.find((f) => f.id === selectedFieldId);
    return field?.directorates ?? [];
  }, [selectedFieldId]);

  // Available units based on directorate
  const availableUnits = useMemo(() => {
    const dir = availableDirs.find((d) => d.id === selectedDirId);
    return dir?.units ?? [];
  }, [availableDirs, selectedDirId]);

  // Reset cascading selections
  const handleFieldChange = (newFieldId: string) => {
    setSelectedFieldId(newFieldId);
    const field = directorateFields.find((f) => f.id === newFieldId);
    const firstDir = field?.directorates[0]?.id ?? "";
    setSelectedDirId(firstDir);
    const dir = field?.directorates.find((d) => d.id === firstDir);
    setSelectedUnitId(dir?.units[0]?.id ?? "");
  };

  const handleDirChange = (newDirId: string) => {
    setSelectedDirId(newDirId);
    const dir = availableDirs.find((d) => d.id === newDirId);
    setSelectedUnitId(dir?.units[0]?.id ?? "");
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;

    const payload: Omit<Account, "id" | "createdAt"> = {
      name: name.trim(),
      email: email.trim(),
      role,
      fieldId: role !== "admin" ? selectedFieldId : undefined,
      directorateId: role !== "admin" ? selectedDirId : undefined,
      unitId: role === "unit" ? selectedUnitId : undefined,
    };

    if (isEdit) {
      onEdit(initial!.id, payload);
    } else {
      onAdd(payload);
    }
    onClose();
  };

  const canSubmit =
    name.trim() &&
    email.trim() &&
    (role === "admin" ||
      (role === "directorate" && selectedDirId) ||
      (role === "unit" && selectedDirId && selectedUnitId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-lg font-semibold text-slate-900">
          {isEdit ? "Edit Akun" : "Tambah Akun Baru"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {isEdit
            ? "Ubah informasi dan hak akses akun."
            : "Buat akun baru untuk direktorat atau unit."}
        </p>

        <div className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Nama
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap..."
              className="border-black/[0.08] text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@telkomuniversity.ac.id"
              className="border-black/[0.08] text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Tipe Akun
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["admin", "directorate", "unit"] as AccountRole[]).map(
                (r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-all",
                      role === r
                        ? "border-[#b6252a]/30 bg-[#b6252a]/[0.03] ring-1 ring-[#b6252a]/10"
                        : "border-black/[0.06] bg-white hover:border-black/[0.12]",
                    )}
                  >
                    {r === "admin" && (
                      <Shield
                        className={cn(
                          "size-5",
                          role === r ? "text-[#b6252a]" : "text-slate-400",
                        )}
                      />
                    )}
                    {r === "directorate" && (
                      <Building2
                        className={cn(
                          "size-5",
                          role === r ? "text-[#b6252a]" : "text-slate-400",
                        )}
                      />
                    )}
                    {r === "unit" && (
                      <Key
                        className={cn(
                          "size-5",
                          role === r ? "text-[#b6252a]" : "text-slate-400",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        role === r ? "text-[#b6252a]" : "text-slate-600",
                      )}
                    >
                      {roleLabels[r]}
                    </span>
                  </button>
                ),
              )}
            </div>
            {/* Role description */}
            <p className="mt-2 text-[11px] text-slate-400">
              {role === "admin" &&
                "Akses penuh ke semua data dan pengaturan."}
              {role === "directorate" &&
                "Bisa melihat semua inisiatif direktorat dan unit di bawahnya."}
              {role === "unit" &&
                "Hanya bisa mengakses inisiatif milik unit tersebut."}
            </p>
          </div>

          {/* Directorate & Unit selectors */}
          {role !== "admin" && (
            <>
              {/* Field */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Bidang
                </label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10"
                >
                  {directorateFields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Directorate */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Direktorat
                </label>
                {availableDirs.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-black/[0.08] px-3 py-2 text-sm text-slate-400">
                    Bidang ini belum punya direktorat.
                  </p>
                ) : (
                  <select
                    value={selectedDirId}
                    onChange={(e) => handleDirChange(e.target.value)}
                    className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10"
                  >
                    <option value="">Pilih direktorat...</option>
                    {availableDirs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Unit (only for unit role) */}
              {role === "unit" && selectedDirId && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Unit
                  </label>
                  {availableUnits.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-black/[0.08] px-3 py-2 text-sm text-slate-400">
                      Direktorat ini belum punya unit.
                    </p>
                  ) : (
                    <select
                      value={selectedUnitId}
                      onChange={(e) => setSelectedUnitId(e.target.value)}
                      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10"
                    >
                      <option value="">Pilih unit...</option>
                      {availableUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="text-sm"
          >
            {isEdit ? "Simpan" : "Buat Akun"}
          </Button>
        </div>
      </div>
    </div>
  );
}
