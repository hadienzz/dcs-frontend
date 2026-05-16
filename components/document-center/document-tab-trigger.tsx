import type { ReactNode } from "react";

import { TabsTrigger } from "@/components/ui/tabs";
import type { DocumentCenterTab } from "@/hooks/document-center/document-center-options";

interface DocumentTabTriggerProps {
  value: DocumentCenterTab;
  icon: ReactNode;
  children: ReactNode;
}

export function DocumentTabTrigger({
  value,
  icon,
  children,
}: DocumentTabTriggerProps) {
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
