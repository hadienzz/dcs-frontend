import Link from "next/link";
import { FolderKanban } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectNotFoundStateProps {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
}

export function ProjectNotFoundState({
  title,
  description,
  href,
  ctaLabel,
}: ProjectNotFoundStateProps) {
  return (
    <main className="min-h-screen bg-[#f7f4f1]">
      <div className="mx-auto flex min-h-screen w-full max-w-[720px] items-center px-4 py-8 sm:px-6">
        <Card className="w-full rounded-[28px] border-border/80 shadow-[0_28px_56px_-42px_rgba(15,23,42,0.35)]">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <DashboardIconBadge icon={FolderKanban} size="lg" tone="warning" />
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href={href}>{ctaLabel}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

