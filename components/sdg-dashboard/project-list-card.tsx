import Link from "next/link";
import { ArrowRight, FolderKanban, ShieldCheck } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import {
  getInternalProjectPath,
  getProjectCurrentStage,
  getProjectWorkflowProgress,
  type SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { ExternalApprovalBadge } from "@/components/sdg-dashboard/external-approval-badge";
import { ProjectStatusBadge } from "@/components/sdg-dashboard/project-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectListCardProps {
  project: SdgDashboardProjectRecord;
}

export function ProjectListCard({ project }: ProjectListCardProps) {
  const workflow = getProjectWorkflowProgress(project);
  const currentStageLabel = getProjectCurrentStage(project);
  const progressLabel =
    workflow.percentage === 100 ? "Tuntas" : `${workflow.percentage}%`;

  return (
    <Card className="overflow-hidden rounded-[26px] border-border/80 bg-background shadow-[0_20px_44px_-34px_rgba(15,23,42,0.34)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20">
      <CardHeader className="gap-4 border-b border-border/60 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_58%,rgba(182,37,42,0)_100%)] p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <ProjectStatusBadge status={project.status} />
              <ExternalApprovalBadge status={project.externalApprovalStatus} />
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-xl leading-tight text-foreground sm:text-[22px]">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                Mitra: {project.externalName}
              </CardDescription>
            </div>
          </div>
          <DashboardIconBadge icon={FolderKanban} size="lg" tone="muted" />
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Tahap yang sedang berjalan
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
                {currentStageLabel}
              </p>
            </div>
            <Badge variant="outline" className="bg-muted/10 text-foreground">
              {workflow.completedSteps}/{workflow.totalSteps} tahap
            </Badge>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted/20">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#8f1a20_0%,#b6252a_52%,#ed1e28_100%)]"
              style={{ width: `${workflow.percentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Progress workflow saat ini: {progressLabel}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4">
        <div className="rounded-2xl border border-border/80 bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Invitation code</p>
          </div>
          <p className="mt-2 rounded-full bg-muted/10 px-3 py-2 font-mono text-xs font-semibold tracking-[0.14em] text-foreground">
            {project.invitationCode}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Bagikan kode ini saat mitra perlu akses ke dashboard eksternal.
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/60 bg-[#fcfbfa] px-5 py-4">
        <Button asChild className="w-full sm:w-auto">
          <Link href={getInternalProjectPath(project)}>
            Lihat detail project
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
