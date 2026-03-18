import { client } from "@/lib/sanity";
import { HeroClient } from "../custom/hero-client";

type StatItem = {
  numberText: string;
  label: string;
  description?: string;
};

export async function HeroSection() {
  const query = `*[_type == 'heroStats'][0]{ items[]{ numberText, label, description } }`;
  const result = await client.fetch<{ items?: StatItem[] }>(
    query,
    {},
    { cache: "no-store", next: { tags: ["hero-stats"] } },
  );

  const stats: StatItem[] =
    result?.items && result.items.length
      ? result.items
      : [
          {
            numberText: "17",
            label: "SDG Goals",
            description: "Global Targets",
          },
          {
            numberText: "52",
            label: "Active Projects",
            description: "In Progress",
          },
          {
            numberText: "281",
            label: "Mitra Industri",
            description: "Collaborations",
          },
          {
            numberText: "4500",
            label: "Students Engaged",
            description: "Community Impact",
          },
        ];

  return <HeroClient stats={stats} />;
}
