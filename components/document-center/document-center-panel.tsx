import { ChevronRight, FileText, Search } from "lucide-react";

import { DocumentCard } from "@/components/document-center/document-card";
import { DocumentTable } from "@/components/document-center/document-table";
import { DivisionSelect } from "@/components/document-center/division-select";
import { EmptyState } from "@/components/document-center/empty-state";
import { FolderButton } from "@/components/document-center/folder-button";
import { PICSelect } from "@/components/document-center/pic-select";
import { SectionCard } from "@/components/document-center/section-card";
import { SubdivisionSelect } from "@/components/document-center/subdivision-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DocumentViewMode } from "@/hooks/document-center/use-document-center-dashboard";
import type {
  DocumentDivision,
  DocumentFilters,
  EnrichedDocumentRecord,
} from "@/types/document-center";
import { getPicsByDivision, getSubdivisionsByDivision } from "@/utils/document-center";

interface DocumentCenterPanelProps {
  divisions: DocumentDivision[];
  documents: EnrichedDocumentRecord[];
  filters: DocumentFilters;
  subdivisionOptions: ReturnType<typeof getSubdivisionsByDivision>;
  picOptions: ReturnType<typeof getPicsByDivision>;
  driveDivisionId: string;
  driveSubdivisionId: string;
  activeDriveDivision?: DocumentDivision;
  activeDriveSubdivision?: { id: string; name: string };
  viewMode: DocumentViewMode;
  onViewModeChange: (viewMode: DocumentViewMode) => void;
  onSearchChange: (search: string) => void;
  onFilterDivisionChange: (divisionId: string) => void;
  onFilterSubdivisionChange: (subdivisionId: string) => void;
  onFilterPicChange: (picId: string) => void;
  onClearFilters: () => void;
  onOpenDivision: (divisionId: string) => void;
  onOpenSubdivision: (subdivisionId: string) => void;
  onGoRoot: () => void;
  onGoDivision: () => void;
  documentActions: {
    onView: (document: EnrichedDocumentRecord) => void;
    onDownload: (document: EnrichedDocumentRecord) => void;
    onEdit: (document: EnrichedDocumentRecord) => void;
    onDelete: (document: EnrichedDocumentRecord) => void;
  };
}

export function DocumentCenterPanel({
  divisions,
  documents,
  filters,
  subdivisionOptions,
  picOptions,
  driveDivisionId,
  driveSubdivisionId,
  activeDriveDivision,
  activeDriveSubdivision,
  viewMode,
  onViewModeChange,
  onSearchChange,
  onFilterDivisionChange,
  onFilterSubdivisionChange,
  onFilterPicChange,
  onClearFilters,
  onOpenDivision,
  onOpenSubdivision,
  onGoRoot,
  onGoDivision,
  documentActions,
}: DocumentCenterPanelProps) {
  const hasFolders = !driveDivisionId || (driveDivisionId && !driveSubdivisionId);

  return (
    <SectionCard
      eyebrow="Document center"
      title="Drive Workspace"
      description="Browse by division folders, drill into subdivisions, or use search and filters."
      action={
        <div className="flex gap-2">
          <Button
            type="button"
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("cards")}
          >
            Cards
          </Button>
          <Button
            type="button"
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("table")}
          >
            Table
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search title, PIC, division, or subdivision"
              className="pl-11"
            />
          </div>
          <DivisionSelect
            id="filterDivision"
            name="filterDivision"
            value={filters.divisionId}
            divisions={divisions}
            onChange={onFilterDivisionChange}
            placeholder="All divisions"
          />
          <SubdivisionSelect
            id="filterSubdivision"
            name="filterSubdivision"
            value={filters.subdivisionId}
            subdivisions={subdivisionOptions}
            onChange={onFilterSubdivisionChange}
            disabled={!filters.divisionId}
          />
          <PICSelect
            id="filterPic"
            name="filterPic"
            value={filters.picId}
            people={picOptions}
            onChange={onFilterPicChange}
            disabled={!filters.divisionId}
          />
          <Button type="button" variant="outline" onClick={onClearFilters}>
            Clear
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={onGoRoot}
            className="font-semibold text-primary hover:underline"
          >
            Divisions
          </button>
          {activeDriveDivision ? (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={onGoDivision}
                className="font-semibold text-primary hover:underline"
              >
                {activeDriveDivision.name}
              </button>
            </>
          ) : null}
          {activeDriveSubdivision ? (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {activeDriveSubdivision.name}
              </span>
            </>
          ) : null}
        </div>

        {hasFolders ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {!driveDivisionId
              ? divisions.map((division) => (
                  <FolderButton
                    key={division.id}
                    title={division.name}
                    helper={`${division.subdivisions.length} subdivisions`}
                    count={division.documentCount ?? 0}
                    onClick={() => onOpenDivision(division.id)}
                  />
                ))
              : activeDriveDivision?.subdivisions.map((subdivision) => (
                  <FolderButton
                    key={subdivision.id}
                    title={subdivision.name}
                    helper={activeDriveDivision.name}
                    count={subdivision.documentCount ?? 0}
                    onClick={() => onOpenSubdivision(subdivision.id)}
                  />
                ))}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Documents</h3>
              <p className="text-sm text-muted-foreground">
                {documents.length} item{documents.length === 1 ? "" : "s"} shown
              </p>
            </div>
          </div>

          {documents.length === 0 ? (
            <EmptyState
              icon={<FileText />}
              title="No documents found"
              description="Try another folder, search term, or filter."
            />
          ) : viewMode === "cards" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  {...documentActions}
                />
              ))}
            </div>
          ) : (
            <DocumentTable documents={documents} {...documentActions} />
          )}
        </div>
      </div>
    </SectionCard>
  );
}
