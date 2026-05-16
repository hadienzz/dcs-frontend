"use client";

import { Loader2, LogOut, ShieldCheck, Upload } from "lucide-react";

import { DocumentCenterAuthLoading } from "@/components/document-center/document-center-auth-loading";
import { DocumentCenterErrorPanel } from "@/components/document-center/document-center-error-panel";
import { DocumentCenterLoadingPanel } from "@/components/document-center/document-center-loading-panel";
import { DocumentCenterLoginPanel } from "@/components/document-center/document-center-login-panel";
import { DocumentCenterPanel } from "@/components/document-center/document-center-panel";
import { DocumentCenterTabs } from "@/components/document-center/document-center-tabs";
import { DeleteDocumentDialog } from "@/components/document-center/delete-document-dialog";
import { DeleteEntityDialog } from "@/components/document-center/delete-entity-dialog";
import { DivisionManagementPanel } from "@/components/document-center/division-management-panel";
import { OverviewPanel } from "@/components/document-center/overview-panel";
import { PICManagementPanel } from "@/components/document-center/pic-management-panel";
import { SectionCard } from "@/components/document-center/section-card";
import { UploadDocumentForm } from "@/components/document-center/upload-document-form";
import { UserManagementPanel } from "@/components/document-center/user-management-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useDivisionManagementActions } from "@/hooks/document-center/use-division-management-actions";
import { useDocumentActions } from "@/hooks/document-center/use-document-actions";
import { useDocumentCenterDrive } from "@/hooks/document-center/use-document-center-drive";
import { useDocumentCenterDriveContext } from "@/hooks/document-center/use-document-center-drive-context";
import { useDocumentCenterFilterOptions } from "@/hooks/document-center/use-document-center-filter-options";
import { useDocumentCenterFilters } from "@/hooks/document-center/use-document-center-filters";
import { useDocumentCenterLoginForm } from "@/hooks/document-center/use-document-center-login-form";
import {
  useDocumentCenterLogoutMutation,
  useDocumentCenterSessionQuery,
} from "@/hooks/document-center/use-document-center-session";
import { useDocumentCenterStoreQuery } from "@/hooks/document-center/use-document-center-store-query";
import { useDocumentCenterTabs } from "@/hooks/document-center/use-document-center-tabs";
import { useDocumentDeleteDialog } from "@/hooks/document-center/use-document-delete-dialog";
import { useDocumentViewMode } from "@/hooks/document-center/use-document-view-mode";
import { usePicManagementActions } from "@/hooks/document-center/use-pic-management-actions";
import { useRecentDocumentsControls } from "@/hooks/document-center/use-recent-documents-controls";
import { useRecentDocumentsPagination } from "@/hooks/document-center/use-recent-documents-pagination";
import { useUploadDocumentForm } from "@/hooks/document-center/use-upload-document-form";
import { useUserManagementActions } from "@/hooks/document-center/use-user-management-actions";

export function DocumentCenterClient() {
  const sessionQuery = useDocumentCenterSessionQuery();
  const loginForm = useDocumentCenterLoginForm();
  const logoutMutation = useDocumentCenterLogoutMutation();
  const session = sessionQuery.data;

  const tabs = useDocumentCenterTabs(session);
  const filters = useDocumentCenterFilters();
  const drive = useDocumentCenterDrive();
  const recent = useRecentDocumentsControls();
  const viewMode = useDocumentViewMode();

  const documentCenter = useDocumentCenterStoreQuery({
    session,
    filters: filters.filters,
    driveDivisionId: drive.driveDivisionId,
    driveSubdivisionId: drive.driveSubdivisionId,
    recentRange: recent.recentRange,
    recentSort: recent.recentSort,
    recentPage: recent.recentPage,
    recentPageSize: recent.recentPageSize,
  });

  const filterOptions = useDocumentCenterFilterOptions({
    divisions: documentCenter.divisions,
    divisionId: filters.filters.divisionId,
  });
  const driveContext = useDocumentCenterDriveContext({
    divisions: documentCenter.divisions,
    driveDivisionId: drive.driveDivisionId,
    driveSubdivisionId: drive.driveSubdivisionId,
  });
  const recentPagination = useRecentDocumentsPagination({
    pagination: documentCenter.store.recentDocumentsPagination,
    itemCount: documentCenter.store.recentDocuments.length,
  });

  const documentDelete = useDocumentDeleteDialog();
  const documentControls = useDocumentActions({
    isSuperadmin: tabs.isSuperadmin,
    onOpenUploadTab: () => tabs.setActiveTab("upload"),
    onOpenCenterTab: () => tabs.setActiveTab("center"),
    onRequestDelete: documentDelete.requestDeleteDocument,
  });
  const uploadForm = useUploadDocumentForm({
    divisions: documentCenter.divisions,
    documentToEdit: documentControls.editingDocument,
    accountUsername: session?.username,
    onCompleted: documentControls.onUploadCompleted,
  });

  const divisionManagement = useDivisionManagementActions();
  const picManagement = usePicManagementActions();
  const userManagement = useUserManagementActions();

  if (sessionQuery.isLoading) {
    return <DocumentCenterAuthLoading />;
  }

  if (!session) {
    return (
      <DocumentCenterLoginPanel
        formik={loginForm.formik}
        isSubmitting={loginForm.isSubmitting}
        onRoleChange={loginForm.setRole}
      />
    );
  }

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
            <Badge variant="outline">
              {tabs.isSuperadmin ? "Superadmin" : "Pekerja"}
            </Badge>
            <Button
              type="button"
              onClick={documentControls.uploadActions.onStartUpload}
            >
              <Upload data-icon="inline-start" />
              Upload
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <LogOut data-icon="inline-start" />
              )}
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <DocumentCenterTabs
          activeTab={tabs.activeTab}
          isSuperadmin={tabs.isSuperadmin}
          onTabChange={tabs.setActiveTab}
        >
          {documentCenter.loadErrorMessage ? (
            <DocumentCenterErrorPanel
              message={documentCenter.loadErrorMessage}
              isRetrying={documentCenter.isRefreshing}
              onRetry={documentCenter.onRetryLoad}
            />
          ) : (
            <>
              <TabsContent value="overview">
                {documentCenter.isLoading ? (
                  <DocumentCenterLoadingPanel variant="overview" />
                ) : (
                  <OverviewPanel
                    recentDocuments={documentCenter.store.recentDocuments}
                    recentPagination={
                      documentCenter.store.recentDocumentsPagination
                    }
                    recentRange={recent.recentRange}
                    recentSort={recent.recentSort}
                    recentRangeLabel={recent.recentRangeLabel}
                    firstItem={recentPagination.recentFirstItem}
                    lastItem={recentPagination.recentLastItem}
                    {...recent.overviewActions}
                    documentActions={documentControls.documentActions}
                  />
                )}
              </TabsContent>

              <TabsContent value="center">
                {documentCenter.isLoading ? (
                  <DocumentCenterLoadingPanel variant="center" />
                ) : (
                  <DocumentCenterPanel
                    divisions={documentCenter.divisions}
                    documents={documentCenter.store.documents}
                    filters={filters.filters}
                    subdivisionOptions={filterOptions.filterSubdivisionOptions}
                    picOptions={filterOptions.filterPicOptions}
                    driveDivisionId={drive.driveDivisionId}
                    driveSubdivisionId={drive.driveSubdivisionId}
                    activeDriveDivision={driveContext.activeDriveDivision}
                    activeDriveSubdivision={driveContext.activeDriveSubdivision}
                    viewMode={viewMode.documentViewMode}
                    onViewModeChange={viewMode.setDocumentViewMode}
                    {...filters.filterActions}
                    {...drive.driveActions}
                    documentActions={documentControls.documentActions}
                  />
                )}
              </TabsContent>

              <TabsContent value="upload">
                {documentCenter.isLoading ? (
                  <DocumentCenterLoadingPanel variant="form" />
                ) : (
                  <SectionCard
                    eyebrow="Document upload"
                    title={
                      documentControls.editingDocument
                        ? "Edit Metadata"
                        : "Upload Document"
                    }
                    description="Upload documents into a Division -> Subdivision -> Document structure."
                  >
                    <UploadDocumentForm
                      formik={uploadForm.formik}
                      divisions={documentCenter.divisions}
                      subdivisionOptions={uploadForm.subdivisionOptions}
                      picOptions={uploadForm.picOptions}
                      isSubmitting={uploadForm.isSubmitting}
                      isEditMode={uploadForm.isEditMode}
                      onDivisionChange={uploadForm.handleDivisionChange}
                      onCancelEdit={documentControls.uploadActions.onCancelEdit}
                    />
                  </SectionCard>
                )}
              </TabsContent>

              {tabs.isSuperadmin ? (
                <>
                  <TabsContent value="divisions">
                    {documentCenter.isLoading ? (
                      <DocumentCenterLoadingPanel variant="management" />
                    ) : (
                      <DivisionManagementPanel
                        divisions={documentCenter.divisions}
                        pendingState={divisionManagement.divisionPendingState}
                        {...divisionManagement.divisionActions}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="pic">
                    {documentCenter.isLoading ? (
                      <DocumentCenterLoadingPanel variant="management" />
                    ) : (
                      <PICManagementPanel
                        divisions={documentCenter.divisions}
                        pendingState={picManagement.picPendingState}
                        {...picManagement.picActions}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="users">
                    {documentCenter.isLoading ? (
                      <DocumentCenterLoadingPanel variant="management" />
                    ) : (
                      <UserManagementPanel
                        divisions={documentCenter.divisions}
                        users={documentCenter.store.users}
                        pendingState={userManagement.userPendingState}
                        {...userManagement.userActions}
                      />
                    )}
                  </TabsContent>
                </>
              ) : null}
            </>
          )}
        </DocumentCenterTabs>
      </div>

      <DeleteDocumentDialog
        document={documentDelete.pendingDeleteDocument}
        open={documentDelete.isDeleteDialogOpen}
        isDeleting={documentDelete.isDeletingDocument}
        onOpenChange={documentDelete.deleteDialogActions.onOpenChange}
        onConfirm={documentDelete.deleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={divisionManagement.isDivisionDeleteDialogOpen}
        entityLabel="divisi"
        entityName={divisionManagement.pendingDeleteDivision?.name}
        isDeleting={divisionManagement.isDeletingDivision}
        onOpenChange={
          divisionManagement.divisionDeleteDialogActions.onOpenChange
        }
        onConfirm={divisionManagement.divisionDeleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={divisionManagement.isSubdivisionDeleteDialogOpen}
        entityLabel="subdivisi"
        entityName={
          divisionManagement.pendingDeleteSubdivision?.subdivision.name
        }
        context={
          divisionManagement.pendingDeleteSubdivision
            ? `inside ${divisionManagement.pendingDeleteSubdivision.divisionName}`
            : undefined
        }
        isDeleting={divisionManagement.isDeletingSubdivision}
        onOpenChange={
          divisionManagement.subdivisionDeleteDialogActions.onOpenChange
        }
        onConfirm={divisionManagement.subdivisionDeleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={picManagement.isPicDeleteDialogOpen}
        entityLabel="PIC"
        entityName={picManagement.pendingDeletePic?.name}
        isDeleting={picManagement.isDeletingPic}
        onOpenChange={picManagement.picDeleteDialogActions.onOpenChange}
        onConfirm={picManagement.picDeleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={userManagement.isUserDeleteDialogOpen}
        entityLabel="user"
        entityName={userManagement.pendingDeleteUser?.name}
        context={
          userManagement.pendingDeleteUser
            ? `with username ${userManagement.pendingDeleteUser.username}`
            : undefined
        }
        isDeleting={userManagement.isDeletingUser}
        onOpenChange={userManagement.userDeleteDialogActions.onOpenChange}
        onConfirm={userManagement.userDeleteDialogActions.onConfirm}
      />
    </main>
  );
}
