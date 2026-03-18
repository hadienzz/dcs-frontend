import type { FormEvent } from "react";
import { Plus } from "lucide-react";

import type { TimelineEntry } from "@/components/sdg-dashboard/dashboard-data";
import { timelineOwnerOptions } from "@/components/sdg-dashboard/dashboard-data";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Button } from "@/components/ui/button";
import {
  FieldBlock,
  fieldClassName,
  Textarea,
} from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { InternalStageNotice } from "@/components/sdg-dashboard/internal/internal-stage-notice";

interface InternalProjectTimelineSectionProps {
  timelineUnlocked: boolean;
  timelineSaved: boolean;
  timelineEntries: TimelineEntry[];
  onAddTimelineEntry: () => void;
  onUpdateTimelineEntry: (
    entryId: string,
    field: keyof Omit<TimelineEntry, "id" | "weekLabel">,
    value: string,
  ) => void;
  onSaveTimeline: (event: FormEvent<HTMLFormElement>) => void;
  onGoToBudget: () => void;
}

export function InternalProjectTimelineSection({
  timelineUnlocked,
  timelineSaved,
  timelineEntries,
  onAddTimelineEntry,
  onUpdateTimelineEntry,
  onSaveTimeline,
  onGoToBudget,
}: InternalProjectTimelineSectionProps) {
  return (
    <div className="space-y-6">
      {!timelineUnlocked ? (
        <InternalStageNotice
          title="Timeline terkunci sampai mitra memberi persetujuan"
          description="Kirim proposal ke mitra terlebih dahulu. Setelah mitra menyetujui dari portal eksternal, tim internal bisa menyimpan timeline 3 bulan."
        />
      ) : null}

      <PortalSection
        eyebrow="Step 2"
        title="Timeline 3 bulan"
        description="Buat alur kerja yang sederhana dan mudah dibaca mitra: fokus kegiatan, deliverable, dan owner utama per bulan."
        action={
          <Button type="button" variant="outline" onClick={onAddTimelineEntry} disabled={!timelineUnlocked}>
            <Plus data-icon="inline-start" />
            Tambah bulan
          </Button>
        }
      >
        <form className="space-y-5" onSubmit={onSaveTimeline}>
          <fieldset disabled={!timelineUnlocked} className={!timelineUnlocked ? "space-y-5 opacity-70" : "space-y-5"}>
            {timelineEntries.map((entry, index) => (
              <div key={entry.id} className="rounded-2xl border border-border/80 bg-muted/10 p-5">
                <div className="grid gap-5 lg:grid-cols-[110px_minmax(0,1fr)]">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {entry.weekLabel}
                    </p>
                  </div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <FieldBlock htmlFor={`${entry.id}-focus`} label="Fokus kegiatan" className="lg:col-span-2">
                      <Textarea
                        id={`${entry.id}-focus`}
                        value={entry.focus}
                        onChange={(event) =>
                          onUpdateTimelineEntry(entry.id, "focus", event.target.value)
                        }
                      />
                    </FieldBlock>
                    <FieldBlock htmlFor={`${entry.id}-deliverable`} label="Deliverable">
                      <Textarea
                        id={`${entry.id}-deliverable`}
                        value={entry.deliverable}
                        onChange={(event) =>
                          onUpdateTimelineEntry(
                            entry.id,
                            "deliverable",
                            event.target.value,
                          )
                        }
                      />
                    </FieldBlock>
                    <FieldBlock htmlFor={`${entry.id}-owner`} label="Owner utama">
                      <select
                        id={`${entry.id}-owner`}
                        className={fieldClassName()}
                        value={entry.owner}
                        onChange={(event) =>
                          onUpdateTimelineEntry(entry.id, "owner", event.target.value)
                        }
                      >
                        {timelineOwnerOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </FieldBlock>
                  </div>
                </div>
              </div>
            ))}
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={!timelineUnlocked}>
              Simpan timeline
            </Button>
            <Button type="button" variant="outline" onClick={onGoToBudget} disabled={!timelineSaved}>
              Lanjut ke budget
            </Button>
          </div>
        </form>
      </PortalSection>
    </div>
  );
}
