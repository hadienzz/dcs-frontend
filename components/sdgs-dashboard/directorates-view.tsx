import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { directorateFields } from "@/lib/sdgs-dashboard-data";

import { PageHeader } from "./page-header";
import { SectionCard } from "./section-card";

export function DirectoratesView() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Direktorat" }]}
        title="Direktorat & Unit"
        description="Struktur direktorat Telkom University yang berkontribusi pada inisiatif SDGs."
      />
      <div className="space-y-6">
        {directorateFields.map((field) => (
          <section key={field.id} className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Bidang
              </p>
              <h2 className="text-lg font-semibold text-foreground">
                {field.name}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {field.directorates.map((directorate) => (
                <SectionCard
                  key={directorate.id}
                  title={directorate.name}
                  description={
                    directorate.units.length === 0
                      ? "Tanpa unit pendukung"
                      : `${directorate.units.length} unit pendukung`
                  }
                >
                  {directorate.units.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Belum ada unit yang terdaftar.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {directorate.units.map((unit) => (
                        <Badge
                          key={unit.id}
                          variant="neutral"
                          className="gap-1"
                        >
                          <Building2 className="h-3 w-3" />
                          {unit.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </SectionCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
