export interface SdgStat {
  label: string;
  value: string;
  description: string;
}

export interface SdgTrendPoint {
  year: string;
  value: number;
}

export interface SdgDistributionItem {
  label: string;
  value: number;
  max: number;
}

export interface SdgIndicator {
  code: string;
  title: string;
  description: string;
  value: string;
  unitLabel: string;
  source: string;
  updatedAt: string;
  statusLabel: string;
  imageUrl: string;
  trend: SdgTrendPoint[];
  distribution: SdgDistributionItem[];
  insights: string[];
  relatedPrograms: string[];
}

export interface SdgNewsItem {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  href: string;
}

export interface SdgGoal {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  englishName: string;
  color: string;
  foreground: string;
  imageUrl: string;
  tagline: string;
  summary: string;
  detail: string;
  targets: number;
  events: number;
  publications: number;
  actions: number;
  focusAreas: string[];
  stats: SdgStat[];
  indicators: SdgIndicator[];
  news: SdgNewsItem[];
}
