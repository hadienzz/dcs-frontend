"use client";

import { useState } from "react";
import type { FormikProps } from "formik";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  DocumentCenterLoginFormValues,
  DocumentCenterLoginRole,
} from "@/types/document-center";
import { cn } from "@/lib/utils";

interface LoginFormStatus {
  submitError?: string;
}

interface DocumentCenterLoginPanelProps {
  formik: FormikProps<DocumentCenterLoginFormValues>;
  isSubmitting: boolean;
  onRoleChange: (role: DocumentCenterLoginRole) => void;
}

function getPasswordError(formik: FormikProps<DocumentCenterLoginFormValues>) {
  const error = formik.errors.password;

  return formik.touched.password && error ? String(error) : undefined;
}

export function DocumentCenterLoginPanel({
  formik,
  isSubmitting,
  onRoleChange,
}: DocumentCenterLoginPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const status = formik.status as LoginFormStatus | undefined;
  const isSuperadmin = formik.values.role === "superadmin";
  const passwordError = getPasswordError(formik);

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#fcfcfb_0%,#f4f1ec_54%,#ffffff_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 text-primary" />
            Document Center
          </div>
          <div className="max-w-xl space-y-5">
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-5xl">
              Masuk ke ruang kerja dokumen.
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Pekerja memakai satu akun bersama untuk upload dan melihat arsip.
              Superadmin memakai password untuk kelola struktur, PIC, user, dan
              aksi sensitif.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm">
              <Users className="mb-3 size-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Pekerja bersama
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Akses cepat untuk upload dan browsing dokumen.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm">
              <KeyRound className="mb-3 size-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Superadmin
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Password wajib untuk perubahan data master.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_28px_80px_-54px_rgba(15,23,42,0.42)] sm:p-7"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Pilih akses
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal text-foreground">
                {isSuperadmin ? "Superadmin" : "Pekerja biasa"}
              </h2>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
              {isSuperadmin ? (
                <ShieldCheck className="size-5" />
              ) : (
                <Users className="size-5" />
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  role: "shared-user",
                  label: "Pekerja",
                  icon: <Users className="size-4" />,
                },
                {
                  role: "superadmin",
                  label: "Superadmin",
                  icon: <ShieldCheck className="size-4" />,
                },
              ] as const
            ).map((option) => (
              <button
                key={option.role}
                type="button"
                onClick={() => onRoleChange(option.role)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                  formik.values.role === option.role
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_16px_28px_-22px_rgba(182,37,42,0.9)]"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>

          {isSuperadmin ? (
            <div className="mt-6 space-y-2">
              <label
                htmlFor="document-center-password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="document-center-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Masukkan password superadmin"
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 pr-12 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {passwordError ? (
                <p className="text-sm font-medium text-destructive">
                  {passwordError}
                </p>
              ) : null}
            </div>
          ) : null}

          {status?.submitError ? (
            <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {status.submitError}
            </div>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
            {isSubmitting ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <LogIn data-icon="inline-start" />
            )}
            {isSubmitting ? "Masuk..." : "Masuk"}
          </Button>
        </form>
      </div>
    </section>
  );
}
