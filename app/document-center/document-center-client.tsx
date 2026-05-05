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
import { useDocumentCenterDashboard } from "@/hooks/document-center/use-document-center-dashboard";
import { useDocumentCenterLoginForm } from "@/hooks/document-center/use-document-center-login-form";
import {
  useDocumentCenterLogoutMutation,
  useDocumentCenterSessionQuery,
} from "@/hooks/document-center/use-document-center-session";

export function DocumentCenterClient() {
  const sessionQuery = useDocumentCenterSessionQuery();
  const loginForm = useDocumentCenterLoginForm();
  const logoutMutation = useDocumentCenterLogoutMutation();
  const dashboard = useDocumentCenterDashboard({
    session: sessionQuery.data,
  });

  if (sessionQuery.isLoading) {
    return <DocumentCenterAuthLoading />;
  }

  if (!sessionQuery.data) {
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
              {dashboard.isSuperadmin ? "Superadmin" : "Pekerja"}
            </Badge>
            <Button
              type="button"
              onClick={dashboard.uploadActions.onStartUpload}
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
          activeTab={dashboard.activeTab}
          isSuperadmin={dashboard.isSuperadmin}
          onTabChange={dashboard.setActiveTab}
        >
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
                      dashboard.editingDocument
                        ? "Edit Metadata"
                        : "Upload Document"
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

              {dashboard.isSuperadmin ? (
                <>
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
              ) : null}
            </>
          )}
        </DocumentCenterTabs>
      </div>

      <DeleteDocumentDialog
        document={dashboard.pendingDeleteDocument}
        open={dashboard.isDeleteDialogOpen}
        isDeleting={dashboard.isDeletingDocument}
        onOpenChange={dashboard.deleteDialogActions.onOpenChange}
        onConfirm={dashboard.deleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={dashboard.isDivisionDeleteDialogOpen}
        entityLabel="divisi"
        entityName={dashboard.pendingDeleteDivision?.name}
        isDeleting={dashboard.isDeletingDivision}
        onOpenChange={dashboard.divisionDeleteDialogActions.onOpenChange}
        onConfirm={dashboard.divisionDeleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={dashboard.isSubdivisionDeleteDialogOpen}
        entityLabel="subdivisi"
        entityName={dashboard.pendingDeleteSubdivision?.subdivision.name}
        context={
          dashboard.pendingDeleteSubdivision
            ? `inside ${dashboard.pendingDeleteSubdivision.divisionName}`
            : undefined
        }
        isDeleting={dashboard.isDeletingSubdivision}
        onOpenChange={dashboard.subdivisionDeleteDialogActions.onOpenChange}
        onConfirm={dashboard.subdivisionDeleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={dashboard.isPicDeleteDialogOpen}
        entityLabel="PIC"
        entityName={dashboard.pendingDeletePic?.name}
        isDeleting={dashboard.isDeletingPic}
        onOpenChange={dashboard.picDeleteDialogActions.onOpenChange}
        onConfirm={dashboard.picDeleteDialogActions.onConfirm}
      />
      <DeleteEntityDialog
        open={dashboard.isUserDeleteDialogOpen}
        entityLabel="user"
        entityName={dashboard.pendingDeleteUser?.name}
        context={
          dashboard.pendingDeleteUser
            ? `with username ${dashboard.pendingDeleteUser.username}`
            : undefined
        }
        isDeleting={dashboard.isDeletingUser}
        onOpenChange={dashboard.userDeleteDialogActions.onOpenChange}
        onConfirm={dashboard.userDeleteDialogActions.onConfirm}
      />
    </main>
  );
}
