import { FolderPlus, Handshake } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreateProject from "@/hooks/internal/use-create-project";

export function InternalCreateProjectFormSection() {
  const router = useRouter();
  const { formik, isPending, isSubmitting } = useCreateProject();
  const disabled = isPending || isSubmitting;
  return (
    <PortalSection
      eyebrow="Form project"
      title="Informasi awal project"
      description="Data ini dipakai untuk menyiapkan workspace internal, invitation code, dan dashboard mitra eksternal."
    >
      <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
        <div className="grid gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="project-name"
              className="text-sm font-semibold text-foreground"
            >
              Nama project
            </label>
            <Input
              id="project-name"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Contoh: Circular Campus Partnership 2026"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="external-name"
              className="text-sm font-semibold text-foreground"
            >
              Nama mitra / pihak eksternal
            </label>
            <Input
              id="external-name"
              name="partner_organization_name"
              value={formik.values.partner_organization_name}
              onChange={formik.handleChange}
              placeholder="Contoh: PT Green Circle Indonesia"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/10 p-5">
          <div className="flex items-start gap-3">
            <DashboardIconBadge icon={Handshake} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                Setelah project dibuat
              </p>
              <p className="text-[15px] leading-7 text-muted-foreground">
                Dashboard akan menyiapkan detail project, invitation code,
                portal mitra, dan alur proposal sampai progress report 3 bulan.
              </p>
            </div>
          </div>
        </div>

        {formik.errors.title || formik.errors.partner_organization_name ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {formik.errors.title || formik.errors.partner_organization_name}
          </div>
        ) : null}

        {formik.status?.submitError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {formik.status.submitError}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={disabled}>
            <FolderPlus data-icon="inline-start" />
            {disabled ? "Menyimpan..." : "Buat project & buka detail"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("../")}
          >
            Batal
          </Button>
        </div>
      </form>
    </PortalSection>
  );
}
