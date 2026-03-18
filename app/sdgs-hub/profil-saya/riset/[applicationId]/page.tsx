import { Suspense } from "react";
import { StudentResearchStatusDetailPage } from "@/components/sdgs-hub/student-research-status-detail";

export default async function StudentResearchStatusDetailRoute({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  return (
    <Suspense>
      <StudentResearchStatusDetailPage applicationId={applicationId} />
    </Suspense>
  );
}
