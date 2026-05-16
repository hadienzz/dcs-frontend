import type { ReactNode } from "react";
import {
  Building2,
  FolderOpen,
  LayoutDashboard,
  Upload,
  UserRound,
  Users,
} from "lucide-react";

import { DocumentTabTrigger } from "@/components/document-center/document-tab-trigger";
import { Tabs, TabsList } from "@/components/ui/tabs";
import type { DocumentCenterTab } from "@/hooks/document-center/document-center-options";
import { cn } from "@/lib/utils";

interface DocumentCenterTabsProps {
  activeTab: DocumentCenterTab;
  isSuperadmin: boolean;
  onTabChange: (tab: DocumentCenterTab) => void;
  children: ReactNode;
}

export function DocumentCenterTabs({
  activeTab,
  isSuperadmin,
  onTabChange,
  children,
}: DocumentCenterTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as DocumentCenterTab)}
    >
      <div className="pb-1">
        <TabsList
          className={cn(
            "grid w-full grid-cols-2 gap-2 rounded-[24px] border-border/80 bg-background/95 p-2 shadow-[0_18px_36px_-32px_rgba(15,23,42,0.34)] sm:grid-cols-3",
            isSuperadmin ? "lg:grid-cols-6" : "lg:grid-cols-3",
          )}
        >
          <DocumentTabTrigger value="overview" icon={<LayoutDashboard />}>
            Overview
          </DocumentTabTrigger>
          <DocumentTabTrigger value="center" icon={<FolderOpen />}>
            Document Center
          </DocumentTabTrigger>
          <DocumentTabTrigger value="upload" icon={<Upload />}>
            Upload
          </DocumentTabTrigger>
          {isSuperadmin ? (
            <>
              <DocumentTabTrigger value="divisions" icon={<Building2 />}>
                Divisions
              </DocumentTabTrigger>
              <DocumentTabTrigger value="pic" icon={<UserRound />}>
                PIC
              </DocumentTabTrigger>
              <DocumentTabTrigger value="users" icon={<Users />}>
                Users
              </DocumentTabTrigger>
            </>
          ) : null}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
