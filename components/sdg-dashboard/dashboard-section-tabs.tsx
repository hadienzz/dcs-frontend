import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardSectionTabItem {
  value: string;
  label: string;
  helper: string;
}

interface DashboardSectionTabsProps {
  items: DashboardSectionTabItem[];
}

export function DashboardSectionTabs({ items }: DashboardSectionTabsProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <TabsList className="flex min-w-max gap-2 rounded-[24px] border-border/80 bg-background/95 p-2 shadow-[0_18px_36px_-32px_rgba(15,23,42,0.34)]">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="min-w-[170px] flex-1 justify-start whitespace-normal rounded-[18px] px-4 py-3 text-left sm:min-w-[188px]"
          >
            <span className="flex flex-col items-start gap-1">
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="text-xs leading-5 opacity-80">{item.helper}</span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}

