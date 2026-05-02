"use client";

import { type ReactNode } from "react";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  Users,
} from "lucide-react";

import { DeleteDocumentDialog } from "@/components/document-center/delete-document-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RECENT_RANGE_OPTIONS,
  RECENT_SORT_OPTIONS,
  useDivisionManagementState,
  useDocumentCenterDashboard,
  usePicManagementState,
  useUserManagementState,
  type DocumentCenterTab,
  type DocumentViewMode,
} from "@/hooks/document-center/use-document-center-dashboard";
import type {
  DocumentAccount,
  DocumentDivision,
  DocumentFilters,
  DocumentUserRole,
  EnrichedDocumentRecord,
  RecentDocumentRange,
  RecentDocumentSort,
  RecentDocumentsPagination,
} from "@/types/document-center";
import {
  ALL_DIVISIONS_VALUE,
  getPicsByDivision,
  getSubdivisionsByDivision,
} from "@/utils/document-center";

export function DocumentCenterClient() {
  const dashboard = useDocumentCenterDashboard();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfbfc_0%,#f7f7f8_46%,#fff_100%)]">
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
              onClick={dashboard.uploadActions.onStartUpload}
            >
              <Upload data-icon="inline-start" />
              Upload
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Tabs
          value={dashboard.activeTab}
          onValueChange={(value) =>
            dashboard.setActiveTab(value as DocumentCenterTab)
          }
        >
          <div className="pb-1">
            <TabsList className="grid w-full grid-cols-2 gap-2 rounded-[24px] border-border/80 bg-background/95 p-2 shadow-[0_18px_36px_-32px_rgba(15,23,42,0.34)] sm:grid-cols-3 lg:grid-cols-6">
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
            </TabsList>
          </div>

          {dashboard.loadErrorMessage ? (
            <DocumentCenterErrorPanel
              message={dashboard.loadErrorMessage}
              isRetrying={dashboard.isRefreshing}
              onRetry={dashboard.onRetryLoad}
            />
          ) : (
            <>
          <TabsContent value="overview">
            {dashboard.isLoading ? (
              <DocumentCenterLoadingPanel variant="overview" />
            ) : (
              <OverviewPanel
                recentDocuments={dashboard.store.recentDocuments}
                recentPagination={dashboard.store.recentDocumentsPagination}
                recentRange={dashboard.recentRange}
                recentSort={dashboard.recentSort}
                recentRangeLabel={dashboard.recentRangeLabel}
                firstItem={dashboard.recentFirstItem}
                lastItem={dashboard.recentLastItem}
                {...dashboard.overviewActions}
                documentActions={dashboard.documentActions}
              />
            )}
          </TabsContent>

          <TabsContent value="center">
            {dashboard.isLoading ? (
              <DocumentCenterLoadingPanel variant="center" />
            ) : (
              <DocumentCenterPanel
                divisions={dashboard.divisions}
                documents={dashboard.store.documents}
                filters={dashboard.filters}
                subdivisionOptions={dashboard.filterSubdivisionOptions}
                picOptions={dashboard.filterPicOptions}
                driveDivisionId={dashboard.driveDivisionId}
                driveSubdivisionId={dashboard.driveSubdivisionId}
                activeDriveDivision={dashboard.activeDriveDivision}
                activeDriveSubdivision={dashboard.activeDriveSubdivision}
                viewMode={dashboard.documentViewMode}
                onViewModeChange={dashboard.setDocumentViewMode}
                {...dashboard.documentCenterActions}
                documentActions={dashboard.documentActions}
              />
            )}
          </TabsContent>

          <TabsContent value="upload">
            {dashboard.isLoading ? (
              <DocumentCenterLoadingPanel variant="form" />
            ) : (
              <SectionCard
                eyebrow="Document upload"
                title={
                  dashboard.editingDocument ? "Edit Metadata" : "Upload Document"
                }
                description="Upload documents into a Division -> Subdivision -> Document structure."
              >
                <UploadDocumentForm
                  formik={dashboard.uploadForm.formik}
                  divisions={dashboard.divisions}
                  subdivisionOptions={dashboard.uploadForm.subdivisionOptions}
                  picOptions={dashboard.uploadForm.picOptions}
                  isSubmitting={dashboard.uploadForm.isSubmitting}
                  isEditMode={dashboard.uploadForm.isEditMode}
                  onDivisionChange={dashboard.uploadForm.handleDivisionChange}
                  onCancelEdit={dashboard.uploadActions.onCancelEdit}
                />
              </SectionCard>
            )}
          </TabsContent>

          <TabsContent value="divisions">
            {dashboard.isLoading ? (
              <DocumentCenterLoadingPanel variant="management" />
            ) : (
              <DivisionManagementPanel
                divisions={dashboard.divisions}
                pendingState={dashboard.divisionPendingState}
                {...dashboard.divisionActions}
              />
            )}
          </TabsContent>

          <TabsContent value="pic">
            {dashboard.isLoading ? (
              <DocumentCenterLoadingPanel variant="management" />
            ) : (
              <PICManagementPanel
                divisions={dashboard.divisions}
                pendingState={dashboard.picPendingState}
                {...dashboard.picActions}
              />
            )}
          </TabsContent>

          <TabsContent value="users">
            {dashboard.isLoading ? (
              <DocumentCenterLoadingPanel variant="management" />
            ) : (
              <UserManagementPanel
                divisions={dashboard.divisions}
                users={dashboard.store.users}
                pendingState={dashboard.userPendingState}
                {...dashboard.userActions}
              />
            )}
          </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <DeleteDocumentDialog
        document={dashboard.pendingDeleteDocument}
        open={dashboard.isDeleteDialogOpen}
        isDeleting={dashboard.isDeletingDocument}
        onOpenChange={dashboard.deleteDialogActions.onOpenChange}
        onConfirm={dashboard.deleteDialogActions.onConfirm}
      />
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
      className="min-w-0 justify-center gap-2 rounded-[18px] px-3 py-3 text-center [&_svg]:size-4"
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
    <Card className="overflow-hidden rounded-[24px] border-border/80 bg-background shadow-[0_20px_48px_-36px_rgba(15,23,42,0.36)]">
      <CardHeader className="border-b border-border/60 bg-[linear-gradient(180deg,rgba(182,37,42,0.05),rgba(182,37,42,0.016)_62%,rgba(182,37,42,0)_100%)] pb-5">
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

function DocumentCenterLoadingPanel({
  variant,
}: {
  variant: "overview" | "center" | "form" | "management";
}) {
  const skeletonCards = variant === "form" ? 4 : variant === "management" ? 3 : 6;

  return (
    <SectionCard
      eyebrow="Loading"
      title="Preparing document workspace"
      description="Fetching the latest document center data."
      action={
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Syncing
        </div>
      }
    >
      <div className="space-y-5" aria-busy="true" aria-live="polite">
        {variant !== "management" ? (
          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        ) : null}

        <div
          className={
            variant === "form"
              ? "grid gap-5 lg:grid-cols-2"
              : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          }
        >
          {Array.from({ length: skeletonCards }).map((_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-border/70 bg-background p-5"
            >
              <div className="flex gap-3">
                <Skeleton className="size-11 rounded-[14px]" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="mt-5 flex gap-2">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function DocumentCenterErrorPanel({
  message,
  isRetrying,
  onRetry,
}: {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <SectionCard
      eyebrow="Unable to load"
      title="Document Center needs a refresh"
      description={message}
      action={
        <Button type="button" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : null}
          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      }
    >
      <div className="flex min-h-[220px] flex-col justify-center rounded-[24px] border border-destructive/15 bg-destructive/[0.04] p-6">
        <div className="mb-4 flex size-12 items-center justify-center rounded-[16px] border border-destructive/20 bg-background text-destructive">
          <AlertTriangle className="size-5" />
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Data belum bisa ditampilkan. Coba ulangi; kalau masih gagal, hubungi
          admin dengan konteks halaman ini.
        </p>
      </div>
    </SectionCard>
  );
}

function OverviewPanel({
  recentDocuments,
  recentPagination,
  recentRange,
  recentSort,
  recentRangeLabel,
  firstItem,
  lastItem,
  onRecentRangeChange,
  onRecentSortChange,
  onRecentPageChange,
  documentActions,
}: {
  recentDocuments: EnrichedDocumentRecord[];
  recentPagination: RecentDocumentsPagination;
  recentRange: RecentDocumentRange;
  recentSort: RecentDocumentSort;
  recentRangeLabel: string;
  firstItem: number;
  lastItem: number;
  onRecentRangeChange: (range: RecentDocumentRange) => void;
  onRecentSortChange: (sort: RecentDocumentSort) => void;
  onRecentPageChange: (page: number) => void;
  documentActions: {
    onView: (document: EnrichedDocumentRecord) => void;
    onDownload: (document: EnrichedDocumentRecord) => void;
    onEdit: (document: EnrichedDocumentRecord) => void;
    onDelete: (document: EnrichedDocumentRecord) => void;
  };
}) {
  return (
    <SectionCard
      eyebrow="Overview"
      title="Recently Uploaded Documents"
      description="Newest document uploads, sortable by upload window."
      action={
        <div className="grid gap-2 sm:grid-cols-[180px_180px]">
          <select
            value={recentRange}
            onChange={(event) =>
              onRecentRangeChange(event.target.value as RecentDocumentRange)
            }
            className="flex h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
            aria-label="Filter recent uploads by date range"
          >
            {RECENT_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={recentSort}
            onChange={(event) =>
              onRecentSortChange(event.target.value as RecentDocumentSort)
            }
            className="flex h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
            aria-label="Sort recent uploads"
          >
            {RECENT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2 rounded-[20px] border border-border/70 bg-muted/[0.08] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {recentPagination.totalItems} upload
              {recentPagination.totalItems === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-muted-foreground">
              {recentRangeLabel} - page {recentPagination.page} of{" "}
              {recentPagination.totalPages}
            </p>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Showing {firstItem}-{lastItem}
          </p>
        </div>

        {recentDocuments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

        <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {recentPagination.totalItems > 0
              ? `${firstItem}-${lastItem} of ${recentPagination.totalItems} documents`
              : "No documents in this range"}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRecentPageChange(recentPagination.page - 1)}
              disabled={recentPagination.page <= 1}
            >
              <ChevronLeft data-icon="inline-start" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRecentPageChange(recentPagination.page + 1)}
              disabled={recentPagination.page >= recentPagination.totalPages}
            >
              Next
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
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
  pendingState,
  onCreateDivision,
  onUpdateDivision,
  onDeleteDivision,
  onCreateSubdivision,
  onUpdateSubdivision,
  onDeleteSubdivision,
}: {
  divisions: DocumentDivision[];
  pendingState: {
    isCreatingDivision: boolean;
    savingDivisionId?: string;
    deletingDivisionId?: string;
    creatingSubdivisionDivisionId?: string;
    savingSubdivisionId?: string;
    deletingSubdivisionId?: string;
  };
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
  const state = useDivisionManagementState({
    onCreateDivision,
    onUpdateDivision,
    onCreateSubdivision,
  });
  const canCreateDivision = Boolean(state.newDivisionName.trim());

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="Division Management"
      description="Create, edit, and delete divisions with nested subdivisions."
      action={
        <form
          onSubmit={(event) => {
            event.preventDefault();
            state.createDivision();
          }}
          className="flex gap-2"
        >
          <Input
            value={state.newDivisionName}
            onChange={(event) => state.setNewDivisionName(event.target.value)}
            placeholder="New division"
            className="min-w-[220px]"
          />
          <Button
            type="submit"
            disabled={pendingState.isCreatingDivision || !canCreateDivision}
          >
            {pendingState.isCreatingDivision ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            {pendingState.isCreatingDivision ? "Adding..." : "Add"}
          </Button>
        </form>
      }
    >
      <div className="space-y-4">
        {divisions.map((division) => {
          const divisionDraft = state.getDivisionDraft(division);
          const isSavingDivision = pendingState.savingDivisionId === division.id;
          const isDeletingDivision =
            pendingState.deletingDivisionId === division.id;

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
                      state.setDivisionDraft(division.id, event.target.value)
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
                    onClick={() => state.saveDivision(division.id, divisionDraft)}
                    disabled={
                      isSavingDivision ||
                      isDeletingDivision ||
                      !divisionDraft.trim()
                    }
                  >
                    {isSavingDivision ? (
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                    ) : null}
                    {isSavingDivision ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteDivision(division.id)}
                    disabled={isDeletingDivision || isSavingDivision}
                    aria-label={`Delete ${division.name}`}
                  >
                    {isDeletingDivision ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
                {division.subdivisions.map((subdivision) => {
                  const draft = state.getSubdivisionDraft(subdivision);
                  const isSavingSubdivision =
                    pendingState.savingSubdivisionId === subdivision.id;
                  const isDeletingSubdivision =
                    pendingState.deletingSubdivisionId === subdivision.id;

                  return (
                    <div
                      key={subdivision.id}
                      className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background p-3 sm:flex-row sm:items-center"
                    >
                      <Input
                        value={draft}
                        onChange={(event) =>
                          state.setSubdivisionDraft(
                            subdivision.id,
                            event.target.value,
                          )
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
                          disabled={
                            isSavingSubdivision ||
                            isDeletingSubdivision ||
                            !draft.trim()
                          }
                        >
                          {isSavingSubdivision ? (
                            <Loader2
                              data-icon="inline-start"
                              className="animate-spin"
                            />
                          ) : null}
                          {isSavingSubdivision ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            onDeleteSubdivision(division.id, subdivision.id)
                          }
                          disabled={isDeletingSubdivision || isSavingSubdivision}
                          aria-label={`Delete ${subdivision.name}`}
                        >
                          {isDeletingSubdivision ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {(() => {
                  const newSubdivisionName = state.getNewSubdivisionName(
                    division.id,
                  );
                  const isCreatingSubdivision =
                    pendingState.creatingSubdivisionDivisionId === division.id;

                  return (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    state.createSubdivision(division.id);
                  }}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <Input
                    value={newSubdivisionName}
                    onChange={(event) =>
                      state.setNewSubdivisionName(
                        division.id,
                        event.target.value,
                      )
                    }
                    placeholder={`New subdivision for ${division.name}`}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={
                      isCreatingSubdivision || !newSubdivisionName.trim()
                    }
                  >
                    {isCreatingSubdivision ? (
                      <Loader2
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                    ) : (
                      <Plus data-icon="inline-start" />
                    )}
                    {isCreatingSubdivision ? "Adding..." : "Add Subdivision"}
                  </Button>
                </form>
                  );
                })()}
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
  pendingState,
  onCreatePic,
  onUpdatePic,
  onDeletePic,
}: {
  divisions: DocumentDivision[];
  pendingState: {
    isCreatingPic: boolean;
    savingPicId?: string;
    deletingPicId?: string;
  };
  onCreatePic: (divisionId: string, name: string) => void;
  onUpdatePic: (picId: string, divisionId: string, name: string) => void;
  onDeletePic: (picId: string) => void;
}) {
  const state = usePicManagementState({
    divisions,
    onCreatePic,
    onUpdatePic,
  });
  const canCreatePic = Boolean(
    state.newPic.name.trim() && (state.newPic.divisionId || divisions[0]?.id),
  );

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="PIC Management"
      description="Manage people assigned to each division."
      action={
        <form
          onSubmit={(event) => {
            event.preventDefault();
            state.createPic();
          }}
          className="grid gap-2 sm:grid-cols-[220px_220px_auto]"
        >
          <Input
            value={state.newPic.name}
            onChange={(event) => state.setNewPicName(event.target.value)}
            placeholder="PIC name"
          />
          <DivisionSelect
            id="newPicDivision"
            name="newPicDivision"
            value={state.newPic.divisionId}
            divisions={divisions}
            onChange={state.setNewPicDivisionId}
          />
          <Button
            type="submit"
            disabled={pendingState.isCreatingPic || !canCreatePic}
          >
            {pendingState.isCreatingPic ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            {pendingState.isCreatingPic ? "Adding..." : "Add"}
          </Button>
        </form>
      }
    >
      {state.people.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {state.people.map((person) => {
            const draft = state.getPicDraft(person);
            const isSavingPic = pendingState.savingPicId === person.id;
            const isDeletingPic = pendingState.deletingPicId === person.id;

            return (
              <div
                key={person.id}
                className="rounded-[24px] border border-border/80 bg-muted/[0.08] p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <Input
                    value={draft.name}
                    onChange={(event) =>
                      state.setPicDraftName(person, event.target.value)
                    }
                  />
                  <DivisionSelect
                    id={`division-${person.id}`}
                    name={`division-${person.id}`}
                    value={draft.divisionId}
                    divisions={divisions}
                    onChange={(divisionId) =>
                      state.setPicDraftDivisionId(person, divisionId)
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        state.updatePic(person.id, draft.divisionId, draft.name)
                      }
                      disabled={
                        isSavingPic ||
                        isDeletingPic ||
                        !draft.name.trim() ||
                        !draft.divisionId
                      }
                    >
                      {isSavingPic ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                      ) : null}
                      {isSavingPic ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDeletePic(person.id)}
                      disabled={isDeletingPic || isSavingPic}
                      aria-label={`Delete ${person.name}`}
                    >
                      {isDeletingPic ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
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
  pendingState,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
}: {
  divisions: DocumentDivision[];
  users: DocumentAccount[];
  pendingState: {
    isCreatingUser: boolean;
    savingUserId?: string;
    deletingUserId?: string;
  };
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
  const state = useUserManagementState({
    onCreateUser,
    onUpdateUser,
  });
  const canCreateUser = Boolean(
    state.newUser.name.trim() && state.newUser.username.trim(),
  );

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="User Management"
      description="Create and manage superadmin or shared user accounts."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          state.createUser();
        }}
        className="mb-6 grid gap-3 rounded-[24px] border border-border/80 bg-muted/[0.08] p-4 lg:grid-cols-[1fr_1fr_180px_220px_auto]"
      >
        <Input
          value={state.newUser.name}
          onChange={(event) =>
            state.setNewUserField("name", event.target.value)
          }
          placeholder="Name"
        />
        <Input
          value={state.newUser.username}
          onChange={(event) =>
            state.setNewUserField("username", event.target.value)
          }
          placeholder="Email / username"
        />
        <RoleSelect
          value={state.newUser.role}
          onChange={(role) => state.setNewUserField("role", role)}
        />
        <AccessSelect
          divisions={divisions}
          value={state.newUser.assignedDivisionId}
          disabled={state.newUser.role === "superadmin"}
          onChange={(assignedDivisionId) =>
            state.setNewUserField("assignedDivisionId", assignedDivisionId)
          }
        />
        <Button
          type="submit"
          disabled={pendingState.isCreatingUser || !canCreateUser}
        >
          {pendingState.isCreatingUser ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Plus data-icon="inline-start" />
          )}
          {pendingState.isCreatingUser ? "Creating..." : "Create"}
        </Button>
      </form>

      <div className="space-y-3">
        {users.map((user) => {
          const draft = state.getUserDraft(user);
          const isSavingUser = pendingState.savingUserId === user.id;
          const isDeletingUser = pendingState.deletingUserId === user.id;

          return (
            <div
              key={user.id}
              className="grid gap-3 rounded-[24px] border border-border/80 bg-background p-4 lg:grid-cols-[1fr_1fr_180px_220px_auto]"
            >
              <Input
                value={draft.name}
                onChange={(event) =>
                  state.setUserDraftField(
                    user.id,
                    draft,
                    "name",
                    event.target.value,
                  )
                }
              />
              <Input
                value={draft.username}
                onChange={(event) =>
                  state.setUserDraftField(
                    user.id,
                    draft,
                    "username",
                    event.target.value,
                  )
                }
              />
              <RoleSelect
                value={draft.role}
                onChange={(role) =>
                  state.setUserDraftField(user.id, draft, "role", role)
                }
              />
              <AccessSelect
                divisions={divisions}
                value={draft.assignedDivisionId}
                disabled={draft.role === "superadmin"}
                onChange={(assignedDivisionId) =>
                  state.setUserDraftField(
                    user.id,
                    draft,
                    "assignedDivisionId",
                    assignedDivisionId,
                  )
                }
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => state.updateUser(user.id, draft)}
                  disabled={
                    isSavingUser ||
                    isDeletingUser ||
                    !draft.name.trim() ||
                    !draft.username.trim()
                  }
                >
                  {isSavingUser ? (
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                  ) : null}
                  {isSavingUser ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDeleteUser(user.id)}
                  disabled={isDeletingUser || isSavingUser}
                  aria-label={`Delete ${user.name}`}
                >
                  {isDeletingUser ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
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
