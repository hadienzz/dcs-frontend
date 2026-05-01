"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  Building2,
  ChevronRight,
  FileArchive,
  FileText,
  Folder,
  FolderOpen,
  LayoutDashboard,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { ActivityLogTable } from "@/components/document-center/activity-log-table";
import { DashboardStatsCard } from "@/components/document-center/dashboard-stats-card";
import { DivisionSelect } from "@/components/document-center/division-select";
import { DocumentCard } from "@/components/document-center/document-card";
import { DocumentTable } from "@/components/document-center/document-table";
import { PICSelect } from "@/components/document-center/pic-select";
import { SubdivisionSelect } from "@/components/document-center/subdivision-select";
import { UploadDocumentForm } from "@/components/document-center/upload-document-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteDocumentMutation,
  useDivisionMutations,
  useDocumentCenterData,
  usePicMutations,
  useUserMutations,
} from "@/hooks/document-center/use-document-center-data";
import { useUploadDocumentForm } from "@/hooks/document-center/use-upload-document-form";
import { EMPTY_DOCUMENT_CENTER_STORE } from "@/types/document-center";
import type {
  DocumentAccount,
  DocumentDashboardStats,
  DocumentDivision,
  DocumentFilters,
  DocumentUserRole,
  EnrichedActivityLogEntry,
  EnrichedDocumentRecord,
} from "@/types/document-center";
import { getErrorMessage } from "@/utils/api-error";
import {
  ALL_DIVISIONS_VALUE,
  getAllPics,
  getDivisionById,
  getPicsByDivision,
  getSubdivisionsByDivision,
} from "@/utils/document-center";

type DocumentCenterTab =
  | "overview"
  | "center"
  | "upload"
  | "divisions"
  | "pic"
  | "users"
  | "activity";

type DocumentViewMode = "cards" | "table";

const EMPTY_FILTERS: DocumentFilters = {
  search: "",
  divisionId: "",
  subdivisionId: "",
  picId: "",
};

export function DocumentCenterClient() {
  const [activeTab, setActiveTab] = useState<DocumentCenterTab>("overview");
  const [documentViewMode, setDocumentViewMode] =
    useState<DocumentViewMode>("cards");
  const [filters, setFilters] = useState<DocumentFilters>(EMPTY_FILTERS);
  const [driveDivisionId, setDriveDivisionId] = useState("");
  const [driveSubdivisionId, setDriveSubdivisionId] = useState("");
  const [editingDocument, setEditingDocument] =
    useState<EnrichedDocumentRecord | null>(null);

  const documentCenterQuery = useMemo(
    () => ({
      ...filters,
      driveDivisionId,
      driveSubdivisionId,
    }),
    [driveDivisionId, driveSubdivisionId, filters],
  );
  const { data: store = EMPTY_DOCUMENT_CENTER_STORE, isLoading } =
    useDocumentCenterData(documentCenterQuery);
  const deleteDocumentMutation = useDeleteDocumentMutation();
  const divisionMutations = useDivisionMutations();
  const picMutations = usePicMutations();
  const userMutations = useUserMutations();

  const divisions = store.divisions;
  const filterSubdivisionOptions = useMemo(
    () => getSubdivisionsByDivision(divisions, filters.divisionId),
    [divisions, filters.divisionId],
  );
  const filterPicOptions = useMemo(
    () => getPicsByDivision(divisions, filters.divisionId),
    [divisions, filters.divisionId],
  );
  const activeDriveDivision = getDivisionById(divisions, driveDivisionId);
  const activeDriveSubdivision = activeDriveDivision?.subdivisions.find(
    (subdivision) => subdivision.id === driveSubdivisionId,
  );

  const uploadForm = useUploadDocumentForm({
    divisions,
    documentToEdit: editingDocument,
    onCompleted: () => {
      if (editingDocument) {
        setEditingDocument(null);
        setActiveTab("center");
      }
    },
  });

  function notifyMutationError(error: unknown, fallbackMessage: string) {
    toast.error(getErrorMessage(error, fallbackMessage));
  }

  function handleFilterDivisionChange(divisionId: string) {
    setFilters((current) => ({
      ...current,
      divisionId,
      subdivisionId: "",
      picId: "",
    }));
  }

  function handleViewDocument(document: EnrichedDocumentRecord) {
    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownloadDocument(document: EnrichedDocumentRecord) {
    const link = window.document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.fileName;
    link.rel = "noopener noreferrer";
    link.click();
    toast.success("Download dimulai.");
  }

  function handleEditDocument(document: EnrichedDocumentRecord) {
    setEditingDocument(document);
    setActiveTab("upload");
  }

  function handleDeleteDocument(document: EnrichedDocumentRecord) {
    deleteDocumentMutation.mutate(document.id, {
      onSuccess: () => toast.success("Dokumen berhasil dihapus."),
      onError: (error) =>
        notifyMutationError(error, "Dokumen belum bisa dihapus."),
    });
  }

  const documentActions = {
    onView: handleViewDocument,
    onDownload: handleDownloadDocument,
    onEdit: handleEditDocument,
    onDelete: handleDeleteDocument,
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fafafa_0%,#fff_100%)]">
      <header className="sticky top-0 z-40 border-b border-black/6 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">
                Document Center
              </h1>
              <p className="text-xs text-muted-foreground">
                Division, subdivision, and PIC document dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Superadmin</Badge>
            <Button
              type="button"
              onClick={() => {
                setEditingDocument(null);
                setActiveTab("upload");
              }}
            >
              <Upload data-icon="inline-start" />
              Upload
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as DocumentCenterTab)}
        >
          <div className="overflow-x-auto pb-1">
            <TabsList className="flex min-w-max gap-2 rounded-[24px] border-border/80 bg-background/95 p-2 shadow-[0_18px_36px_-32px_rgba(15,23,42,0.34)]">
              <DocumentTabTrigger value="overview" icon={<LayoutDashboard />}>
                Overview
              </DocumentTabTrigger>
              <DocumentTabTrigger value="center" icon={<FolderOpen />}>
                Document Center
              </DocumentTabTrigger>
              <DocumentTabTrigger value="upload" icon={<Upload />}>
                Upload
              </DocumentTabTrigger>
              <DocumentTabTrigger value="divisions" icon={<Building2 />}>
                Divisions
              </DocumentTabTrigger>
              <DocumentTabTrigger value="pic" icon={<UserRound />}>
                PIC
              </DocumentTabTrigger>
              <DocumentTabTrigger value="users" icon={<Users />}>
                Users
              </DocumentTabTrigger>
              <DocumentTabTrigger value="activity" icon={<Activity />}>
                Activity
              </DocumentTabTrigger>
            </TabsList>
          </div>

          {isLoading ? (
            <Card className="rounded-[24px] border-border/80 bg-background">
              <CardContent className="p-8 text-sm text-muted-foreground">
                Loading document center...
              </CardContent>
            </Card>
          ) : null}

          <TabsContent value="overview">
            <OverviewPanel
              stats={store.stats}
              recentDocuments={store.recentDocuments}
              recentActivityLogs={store.recentActivityLogs}
              documentActions={documentActions}
            />
          </TabsContent>

          <TabsContent value="center">
            <DocumentCenterPanel
              divisions={divisions}
              documents={store.documents}
              filters={filters}
              subdivisionOptions={filterSubdivisionOptions}
              picOptions={filterPicOptions}
              driveDivisionId={driveDivisionId}
              driveSubdivisionId={driveSubdivisionId}
              activeDriveDivision={activeDriveDivision}
              activeDriveSubdivision={activeDriveSubdivision}
              viewMode={documentViewMode}
              onViewModeChange={setDocumentViewMode}
              onSearchChange={(search) =>
                setFilters((current) => ({ ...current, search }))
              }
              onFilterDivisionChange={handleFilterDivisionChange}
              onFilterSubdivisionChange={(subdivisionId) =>
                setFilters((current) => ({ ...current, subdivisionId }))
              }
              onFilterPicChange={(picId) =>
                setFilters((current) => ({ ...current, picId }))
              }
              onClearFilters={() => setFilters(EMPTY_FILTERS)}
              onOpenDivision={(divisionId) => {
                setDriveDivisionId(divisionId);
                setDriveSubdivisionId("");
              }}
              onOpenSubdivision={(subdivisionId) =>
                setDriveSubdivisionId(subdivisionId)
              }
              onGoRoot={() => {
                setDriveDivisionId("");
                setDriveSubdivisionId("");
              }}
              onGoDivision={() => setDriveSubdivisionId("")}
              documentActions={documentActions}
            />
          </TabsContent>

          <TabsContent value="upload">
            <SectionCard
              eyebrow="Document upload"
              title={editingDocument ? "Edit Metadata" : "Upload Document"}
              description="Upload documents into a Division -> Subdivision -> Document structure."
            >
              <UploadDocumentForm
                formik={uploadForm.formik}
                divisions={divisions}
                subdivisionOptions={uploadForm.subdivisionOptions}
                picOptions={uploadForm.picOptions}
                isSubmitting={uploadForm.isSubmitting}
                isEditMode={uploadForm.isEditMode}
                onDivisionChange={uploadForm.handleDivisionChange}
                onCancelEdit={() => {
                  setEditingDocument(null);
                  setActiveTab("center");
                }}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="divisions">
            <DivisionManagementPanel
              divisions={divisions}
              onCreateDivision={(name) =>
                divisionMutations.createDivision.mutate(
                  { name },
                  {
                    onSuccess: () => toast.success("Divisi berhasil ditambahkan."),
                    onError: (error) =>
                      notifyMutationError(error, "Divisi belum bisa ditambahkan."),
                  },
                )
              }
              onUpdateDivision={(divisionId, name) =>
                divisionMutations.updateDivision.mutate(
                  { divisionId, values: { name } },
                  {
                    onSuccess: () => toast.success("Divisi berhasil diperbarui."),
                    onError: (error) =>
                      notifyMutationError(error, "Divisi belum bisa diperbarui."),
                  },
                )
              }
              onDeleteDivision={(divisionId) =>
                divisionMutations.deleteDivision.mutate(divisionId, {
                  onSuccess: () => toast.success("Divisi berhasil dihapus."),
                  onError: (error) =>
                    notifyMutationError(error, "Divisi belum bisa dihapus."),
                })
              }
              onCreateSubdivision={(divisionId, name) =>
                divisionMutations.createSubdivision.mutate(
                  { divisionId, name },
                  {
                    onSuccess: () =>
                      toast.success("Subdivisi berhasil ditambahkan."),
                    onError: (error) =>
                      notifyMutationError(
                        error,
                        "Subdivisi belum bisa ditambahkan.",
                      ),
                  },
                )
              }
              onUpdateSubdivision={(divisionId, subdivisionId, name) =>
                divisionMutations.updateSubdivision.mutate(
                  { subdivisionId, values: { divisionId, name } },
                  {
                    onSuccess: () =>
                      toast.success("Subdivisi berhasil diperbarui."),
                    onError: (error) =>
                      notifyMutationError(
                        error,
                        "Subdivisi belum bisa diperbarui.",
                      ),
                  },
                )
              }
              onDeleteSubdivision={(divisionId, subdivisionId) =>
                divisionMutations.deleteSubdivision.mutate(
                  { divisionId, subdivisionId },
                  {
                    onSuccess: () => toast.success("Subdivisi berhasil dihapus."),
                    onError: (error) =>
                      notifyMutationError(
                        error,
                        "Subdivisi belum bisa dihapus.",
                      ),
                  },
                )
              }
            />
          </TabsContent>

          <TabsContent value="pic">
            <PICManagementPanel
              divisions={divisions}
              onCreatePic={(divisionId, name) =>
                picMutations.createPic.mutate(
                  { divisionId, name },
                  {
                    onSuccess: () => toast.success("PIC berhasil ditambahkan."),
                    onError: (error) =>
                      notifyMutationError(error, "PIC belum bisa ditambahkan."),
                  },
                )
              }
              onUpdatePic={(picId, divisionId, name) =>
                picMutations.updatePic.mutate(
                  { id: picId, divisionId, name },
                  {
                    onSuccess: () => toast.success("PIC berhasil diperbarui."),
                    onError: (error) =>
                      notifyMutationError(error, "PIC belum bisa diperbarui."),
                  },
                )
              }
              onDeletePic={(picId) =>
                picMutations.deletePic.mutate(picId, {
                  onSuccess: () => toast.success("PIC berhasil dihapus."),
                  onError: (error) =>
                    notifyMutationError(error, "PIC belum bisa dihapus."),
                })
              }
            />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementPanel
              divisions={divisions}
              users={store.users}
              onCreateUser={(payload) =>
                userMutations.createUser.mutate(payload, {
                  onSuccess: () => toast.success("User berhasil dibuat."),
                  onError: (error) =>
                    notifyMutationError(error, "User belum bisa dibuat."),
                })
              }
              onUpdateUser={(payload) =>
                userMutations.updateUser.mutate(payload, {
                  onSuccess: () => toast.success("User berhasil diperbarui."),
                  onError: (error) =>
                    notifyMutationError(error, "User belum bisa diperbarui."),
                })
              }
              onDeleteUser={(userId) =>
                userMutations.deleteUser.mutate(userId, {
                  onSuccess: () => toast.success("User berhasil dihapus."),
                  onError: (error) =>
                    notifyMutationError(error, "User belum bisa dihapus."),
                })
              }
            />
          </TabsContent>

          <TabsContent value="activity">
            <SectionCard
              eyebrow="Audit trail"
              title="Activity Log"
              description="Upload, edit, delete, and management actions are tracked here."
            >
              <ActivityLogTable activityLogs={store.activityLogs} />
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function DocumentTabTrigger({
  value,
  icon,
  children,
}: {
  value: DocumentCenterTab;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className="min-w-[128px] justify-start rounded-[18px] px-4 py-3 [&_svg]:size-4"
    >
      {icon}
      {children}
    </TabsTrigger>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[24px] border-border/80 bg-background shadow-[0_16px_30px_-28px_rgba(15,23,42,0.3)]">
      <CardHeader className="border-b border-border/60 bg-[linear-gradient(180deg,rgba(182,37,42,0.035),rgba(182,37,42,0.012)_60%,rgba(182,37,42,0)_100%)] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {eyebrow}
            </p>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-[1.375rem] font-semibold leading-tight text-foreground">
                {title}
              </CardTitle>
              {description ? (
                <p className="max-w-3xl text-[15px] leading-7 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

function OverviewPanel({
  stats,
  recentDocuments,
  recentActivityLogs,
  documentActions,
}: {
  stats: DocumentDashboardStats;
  recentDocuments: EnrichedDocumentRecord[];
  recentActivityLogs: EnrichedActivityLogEntry[];
  documentActions: {
    onView: (document: EnrichedDocumentRecord) => void;
    onDownload: (document: EnrichedDocumentRecord) => void;
    onEdit: (document: EnrichedDocumentRecord) => void;
    onDelete: (document: EnrichedDocumentRecord) => void;
  };
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatsCard
          icon={FileArchive}
          label="Total documents"
          value={`${stats.totalDocuments}`}
          helper="All documents currently stored in the center."
        />
        <DashboardStatsCard
          icon={Building2}
          label="Total divisions"
          value={`${stats.totalDivisions}`}
          helper="Primary document ownership structure."
        />
        <DashboardStatsCard
          icon={Folder}
          label="Total subdivisions"
          value={`${stats.totalSubdivisions}`}
          helper="Nested folders inside each division."
        />
        <DashboardStatsCard
          icon={UserRound}
          label="PIC entries"
          value={`${stats.totalPicEntries}`}
          helper="People available as Inputted By / PIC."
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          eyebrow="Recent uploads"
          title="Recently Uploaded Documents"
          description="Newest files across all divisions."
        >
          {recentDocuments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recentDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  {...documentActions}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText />}
              title="No documents yet"
              description="Uploaded documents will appear here."
            />
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Recent activity"
          title="Activity Log"
          description="Latest tracked changes in the document center."
        >
          <ActivityLogTable activityLogs={recentActivityLogs} />
        </SectionCard>
      </div>
    </div>
  );
}

function DocumentCenterPanel({
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
}: {
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
}) {
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

function FolderButton({
  title,
  helper,
  count,
  onClick,
}: {
  title: string;
  helper: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[112px] items-start gap-4 rounded-[24px] border border-border/80 bg-background p-5 text-left shadow-[0_16px_30px_-28px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_36px_-30px_rgba(182,37,42,0.45)]"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] border border-primary/12 bg-primary/[0.08] text-primary">
        <Folder className="size-5 fill-primary/10" />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 font-semibold leading-6 text-foreground">
          {title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
        <Badge variant="neutral" className="mt-3">
          {count} documents
        </Badge>
      </div>
    </button>
  );
}

function DivisionManagementPanel({
  divisions,
  onCreateDivision,
  onUpdateDivision,
  onDeleteDivision,
  onCreateSubdivision,
  onUpdateSubdivision,
  onDeleteSubdivision,
}: {
  divisions: DocumentDivision[];
  onCreateDivision: (name: string) => void;
  onUpdateDivision: (divisionId: string, name: string) => void;
  onDeleteDivision: (divisionId: string) => void;
  onCreateSubdivision: (divisionId: string, name: string) => void;
  onUpdateSubdivision: (
    divisionId: string,
    subdivisionId: string,
    name: string,
  ) => void;
  onDeleteSubdivision: (divisionId: string, subdivisionId: string) => void;
}) {
  const [newDivisionName, setNewDivisionName] = useState("");
  const [divisionDrafts, setDivisionDrafts] = useState<Record<string, string>>({});
  const [subdivisionDrafts, setSubdivisionDrafts] = useState<Record<string, string>>(
    {},
  );
  const [newSubdivisionNames, setNewSubdivisionNames] = useState<Record<string, string>>(
    {},
  );

  function handleCreateDivision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newDivisionName.trim()) {
      return;
    }

    onCreateDivision(newDivisionName.trim());
    setNewDivisionName("");
  }

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="Division Management"
      description="Create, edit, and delete divisions with nested subdivisions."
      action={
        <form onSubmit={handleCreateDivision} className="flex gap-2">
          <Input
            value={newDivisionName}
            onChange={(event) => setNewDivisionName(event.target.value)}
            placeholder="New division"
            className="min-w-[220px]"
          />
          <Button type="submit">
            <Plus data-icon="inline-start" />
            Add
          </Button>
        </form>
      }
    >
      <div className="space-y-4">
        {divisions.map((division) => {
          const divisionDraft = divisionDrafts[division.id] ?? division.name;

          return (
            <div
              key={division.id}
              className="rounded-[24px] border border-border/80 bg-muted/[0.08] p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    value={divisionDraft}
                    onChange={(event) =>
                      setDivisionDrafts((current) => ({
                        ...current,
                        [division.id]: event.target.value,
                      }))
                    }
                    className="max-w-sm"
                  />
                  <Badge variant="neutral">
                    {division.subdivisions.length} subdivisions
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onUpdateDivision(division.id, divisionDraft)}
                    disabled={!divisionDraft.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteDivision(division.id)}
                    aria-label={`Delete ${division.name}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
                {division.subdivisions.map((subdivision) => {
                  const draft = subdivisionDrafts[subdivision.id] ?? subdivision.name;

                  return (
                    <div
                      key={subdivision.id}
                      className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background p-3 sm:flex-row sm:items-center"
                    >
                      <Input
                        value={draft}
                        onChange={(event) =>
                          setSubdivisionDrafts((current) => ({
                            ...current,
                            [subdivision.id]: event.target.value,
                          }))
                        }
                      />
                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            onUpdateSubdivision(
                              division.id,
                              subdivision.id,
                              draft,
                            )
                          }
                          disabled={!draft.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            onDeleteSubdivision(division.id, subdivision.id)
                          }
                          aria-label={`Delete ${subdivision.name}`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const name = newSubdivisionNames[division.id]?.trim() ?? "";

                    if (!name) {
                      return;
                    }

                    onCreateSubdivision(division.id, name);
                    setNewSubdivisionNames((current) => ({
                      ...current,
                      [division.id]: "",
                    }));
                  }}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <Input
                    value={newSubdivisionNames[division.id] ?? ""}
                    onChange={(event) =>
                      setNewSubdivisionNames((current) => ({
                        ...current,
                        [division.id]: event.target.value,
                      }))
                    }
                    placeholder={`New subdivision for ${division.name}`}
                  />
                  <Button type="submit" variant="outline">
                    <Plus data-icon="inline-start" />
                    Add Subdivision
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function PICManagementPanel({
  divisions,
  onCreatePic,
  onUpdatePic,
  onDeletePic,
}: {
  divisions: DocumentDivision[];
  onCreatePic: (divisionId: string, name: string) => void;
  onUpdatePic: (picId: string, divisionId: string, name: string) => void;
  onDeletePic: (picId: string) => void;
}) {
  const people = getAllPics(divisions);
  const [newPic, setNewPic] = useState({ name: "", divisionId: "" });
  const [picDrafts, setPicDrafts] = useState<
    Record<string, { name: string; divisionId: string }>
  >({});

  function handleCreatePic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const divisionId = newPic.divisionId || divisions[0]?.id;

    if (!divisionId || !newPic.name.trim()) {
      return;
    }

    onCreatePic(divisionId, newPic.name.trim());
    setNewPic({ name: "", divisionId: "" });
  }

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="PIC Management"
      description="Manage people assigned to each division."
      action={
        <form onSubmit={handleCreatePic} className="grid gap-2 sm:grid-cols-[220px_220px_auto]">
          <Input
            value={newPic.name}
            onChange={(event) =>
              setNewPic((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="PIC name"
          />
          <DivisionSelect
            id="newPicDivision"
            name="newPicDivision"
            value={newPic.divisionId}
            divisions={divisions}
            onChange={(divisionId) =>
              setNewPic((current) => ({ ...current, divisionId }))
            }
          />
          <Button type="submit">
            <Plus data-icon="inline-start" />
            Add
          </Button>
        </form>
      }
    >
      {people.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {people.map((person) => {
            const draft = picDrafts[person.id] ?? {
              name: person.name,
              divisionId: person.divisionId,
            };

            return (
              <div
                key={person.id}
                className="rounded-[24px] border border-border/80 bg-muted/[0.08] p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <Input
                    value={draft.name}
                    onChange={(event) =>
                      setPicDrafts((current) => ({
                        ...current,
                        [person.id]: { ...draft, name: event.target.value },
                      }))
                    }
                  />
                  <DivisionSelect
                    id={`division-${person.id}`}
                    name={`division-${person.id}`}
                    value={draft.divisionId}
                    divisions={divisions}
                    onChange={(divisionId) =>
                      setPicDrafts((current) => ({
                        ...current,
                        [person.id]: { ...draft, divisionId },
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        onUpdatePic(person.id, draft.divisionId, draft.name)
                      }
                      disabled={!draft.name.trim() || !draft.divisionId}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDeletePic(person.id)}
                      aria-label={`Delete ${person.name}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<UserRound />}
          title="No PIC entries"
          description="Create a PIC entry to use it in document uploads."
        />
      )}
    </SectionCard>
  );
}

function UserManagementPanel({
  divisions,
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
}: {
  divisions: DocumentDivision[];
  users: DocumentAccount[];
  onCreateUser: (payload: {
    name: string;
    username: string;
    role: DocumentUserRole;
    assignedDivisionIds: string[];
  }) => void;
  onUpdateUser: (payload: {
    id: string;
    name: string;
    username: string;
    role: DocumentUserRole;
    assignedDivisionIds: string[];
  }) => void;
  onDeleteUser: (userId: string) => void;
}) {
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    role: "shared-user" as DocumentUserRole,
    assignedDivisionId: "",
  });
  const [userDrafts, setUserDrafts] = useState<
    Record<
      string,
      {
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionId: string;
      }
    >
  >({});

  function toAssignedDivisionIds(role: DocumentUserRole, assignedDivisionId: string) {
    if (role === "superadmin") {
      return [ALL_DIVISIONS_VALUE];
    }

    return assignedDivisionId ? [assignedDivisionId] : [];
  }

  function getAssignedDivisionValue(user: DocumentAccount) {
    if (user.assignedDivisionIds.includes(ALL_DIVISIONS_VALUE)) {
      return ALL_DIVISIONS_VALUE;
    }

    return user.assignedDivisionIds[0] ?? "";
  }

  function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newUser.name.trim() || !newUser.username.trim()) {
      return;
    }

    onCreateUser({
      name: newUser.name.trim(),
      username: newUser.username.trim(),
      role: newUser.role,
      assignedDivisionIds: toAssignedDivisionIds(
        newUser.role,
        newUser.assignedDivisionId,
      ),
    });
    setNewUser({
      name: "",
      username: "",
      role: "shared-user",
      assignedDivisionId: "",
    });
  }

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="User Management"
      description="Create and manage superadmin or shared user accounts."
    >
      <form
        onSubmit={handleCreateUser}
        className="mb-6 grid gap-3 rounded-[24px] border border-border/80 bg-muted/[0.08] p-4 lg:grid-cols-[1fr_1fr_180px_220px_auto]"
      >
        <Input
          value={newUser.name}
          onChange={(event) =>
            setNewUser((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="Name"
        />
        <Input
          value={newUser.username}
          onChange={(event) =>
            setNewUser((current) => ({
              ...current,
              username: event.target.value,
            }))
          }
          placeholder="Email / username"
        />
        <RoleSelect
          value={newUser.role}
          onChange={(role) => setNewUser((current) => ({ ...current, role }))}
        />
        <AccessSelect
          divisions={divisions}
          value={newUser.assignedDivisionId}
          disabled={newUser.role === "superadmin"}
          onChange={(assignedDivisionId) =>
            setNewUser((current) => ({ ...current, assignedDivisionId }))
          }
        />
        <Button type="submit">
          <Plus data-icon="inline-start" />
          Create
        </Button>
      </form>

      <div className="space-y-3">
        {users.map((user) => {
          const draft = userDrafts[user.id] ?? {
            name: user.name,
            username: user.username,
            role: user.role,
            assignedDivisionId: getAssignedDivisionValue(user),
          };

          return (
            <div
              key={user.id}
              className="grid gap-3 rounded-[24px] border border-border/80 bg-background p-4 lg:grid-cols-[1fr_1fr_180px_220px_auto]"
            >
              <Input
                value={draft.name}
                onChange={(event) =>
                  setUserDrafts((current) => ({
                    ...current,
                    [user.id]: { ...draft, name: event.target.value },
                  }))
                }
              />
              <Input
                value={draft.username}
                onChange={(event) =>
                  setUserDrafts((current) => ({
                    ...current,
                    [user.id]: { ...draft, username: event.target.value },
                  }))
                }
              />
              <RoleSelect
                value={draft.role}
                onChange={(role) =>
                  setUserDrafts((current) => ({
                    ...current,
                    [user.id]: { ...draft, role },
                  }))
                }
              />
              <AccessSelect
                divisions={divisions}
                value={draft.assignedDivisionId}
                disabled={draft.role === "superadmin"}
                onChange={(assignedDivisionId) =>
                  setUserDrafts((current) => ({
                    ...current,
                    [user.id]: { ...draft, assignedDivisionId },
                  }))
                }
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onUpdateUser({
                      id: user.id,
                      name: draft.name,
                      username: draft.username,
                      role: draft.role,
                      assignedDivisionIds: toAssignedDivisionIds(
                        draft.role,
                        draft.assignedDivisionId,
                      ),
                    })
                  }
                  disabled={!draft.name.trim() || !draft.username.trim()}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDeleteUser(user.id)}
                  aria-label={`Delete ${user.name}`}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function RoleSelect({
  value,
  onChange,
}: {
  value: DocumentUserRole;
  onChange: (role: DocumentUserRole) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as DocumentUserRole)}
      className="flex h-12 w-full rounded-xl border border-border/80 bg-background px-4 text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
    >
      <option value="superadmin">Superadmin</option>
      <option value="shared-user">Shared User Account</option>
    </select>
  );
}

function AccessSelect({
  divisions,
  value,
  disabled,
  onChange,
}: {
  divisions: DocumentDivision[];
  value: string;
  disabled?: boolean;
  onChange: (divisionId: string) => void;
}) {
  return (
    <select
      value={disabled ? ALL_DIVISIONS_VALUE : value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-12 w-full rounded-xl border border-border/80 bg-background px-4 text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <option value="">Assigned access</option>
      <option value={ALL_DIVISIONS_VALUE}>All divisions</option>
      {divisions.map((division) => (
        <option key={division.id} value={division.id}>
          {division.name}
        </option>
      ))}
    </select>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-border/80 bg-muted/[0.08] px-6 py-10 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-[16px] border border-border/80 bg-background text-muted-foreground [&_svg]:size-5">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
