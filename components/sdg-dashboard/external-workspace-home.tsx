"use client";

import { useRouter } from "next/navigation";
import { FolderArchive, FolderClock, ShieldCheck } from "lucide-react";

import {
  getExternalPortalPath,
  getProjectsNeedingAttention,
} from "@/components/sdg-dashboard/dashboard-data";
import { ExternalWorkspaceDirectorySection } from "@/components/sdg-dashboard/external/external-workspace-directory-section";
import { ExternalWorkspaceHeroSection } from "@/components/sdg-dashboard/external/external-workspace-hero-section";
import { PortalMetricCard } from "@/components/sdg-dashboard/portal-metric-card";
import useJoinProject from "@/hooks/external/use-join-project";
import { useSdgDashboardProjects } from "@/hooks/use-sdg-dashboard-projects";

export function ExternalWorkspaceHome() {
  const router = useRouter();
  const { projects } = useSdgDashboardProjects();
  const { formik } = useJoinProject({
    onSuccess: (projectSlug) => {
      router.push(getExternalPortalPath(projectSlug));
    },
  });

  const attentionProjects = getProjectsNeedingAttention(projects);
  const ongoingProjectsCount = projects.filter(
    (project) => project.status === "ongoing",
  ).length;
  const completedProjectsCount = projects.filter(
    (project) => project.status === "completed",
  ).length;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ef_0%,#f5efe8_32%,#f7f6f2_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ExternalWorkspaceHeroSection
          invitationCode={formik.values.invitationCode}
          invitationError={formik.status?.submitError ?? null}
          onInvitationCodeChange={(value) => {
            formik.setFieldValue("invitationCode", value);

            if (formik.status?.submitError) {
              formik.setStatus(undefined);
            }
          }}
          onInvitationCodeSubmit={() => {
            formik.submitForm();
          }}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PortalMetricCard
            icon={ShieldCheck}
            label="Total workspace"
            value={`${projects.length}`}
            helper="Jumlah dashboard yang bisa dibuka dari sudut pandang mitra."
          />
          <PortalMetricCard
            icon={FolderClock}
            label="Perlu keputusan"
            value={`${attentionProjects.length}`}
            helper="Proposal yang masih menunggu keputusan mitra."
          />
          <PortalMetricCard
            icon={FolderClock}
            label="Program ongoing"
            value={`${ongoingProjectsCount}`}
            helper="Program aktif yang sedang berjalan bersama mitra."
          />
          <PortalMetricCard
            icon={FolderArchive}
            label="Program selesai"
            value={`${completedProjectsCount}`}
            helper="Arsip project yang sudah selesai dari sudut pandang mitra."
          />
        </section>

        <ExternalWorkspaceDirectorySection projects={projects} />
      </div>
    </main>
  );
}
