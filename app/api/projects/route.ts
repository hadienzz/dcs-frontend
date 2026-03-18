import { NextResponse } from "next/server";
import { client, urlFor } from "@/lib/sanity";
import { getCoords, canonicalizeLocation } from "@/lib/locations";

type SanityProject = {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  status?: "Completed" | "Ongoing";
  beneficiaries?: string;
  peopleHelped?: number;
  sdgs?: number[];
  startYear?: number;
  endYear?: number;
  image?: unknown;
  locationsProvince?: Array<
    { _ref: string; _type: "reference" } & {
      name?: string;
      latitude?: number;
      longitude?: number;
    }
  >;
  locationsText?: string[];
};

export async function GET() {
  try {
    const query = `*[_type == "project"]{
      _id,
      title,
      slug,
      description,
      status,
      beneficiaries,
      peopleHelped,
      sdgs,
      startYear,
      endYear,
      image,
      locationsProvince[]->{name, latitude, longitude},
      locationsText
    }`;
    const data = await client.fetch<SanityProject[]>(query);

    const projects = data.flatMap((p, idx) => {
      const date =
        p.startYear && p.endYear
          ? `${p.startYear}–${p.endYear}`
          : p.startYear
            ? String(p.startYear)
            : p.endYear
              ? String(p.endYear)
              : "-";

      const points: Array<{ city: string; coords: [number, number] }> = [];

      // Provinces references
      (p.locationsProvince || []).forEach((prov) => {
        if (
          typeof prov?.longitude === "number" &&
          typeof prov?.latitude === "number"
        ) {
          points.push({
            city: prov.name || "",
            coords: [prov.longitude, prov.latitude],
          });
        }
      });

      // Text locations (normalized via local lookup)
      (p.locationsText || []).forEach((name) => {
        const coords = getCoords(name);
        if (coords) {
          const canon = canonicalizeLocation(name) || name;
          points.push({ city: canon, coords });
        }
      });

      // Fallback: if no locations, skip
      if (!points.length) return [];

      return points.map((pt, i) => ({
        id: idx * 1000 + i,
        city: pt.city,
        coords: pt.coords as [number, number],
        title: p.title,
        description: p.description || "",
        date,
        beneficiaries: p.beneficiaries || "-",
        peopleHelped: typeof p.peopleHelped === "number" ? p.peopleHelped : 0,
        status: p.status || "Ongoing",
        image: p.image
          ? urlFor(p.image).width(1200).height(720).fit("crop").url()
          : null,
        slug: (p.slug?.current || p.title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        sdgs: p.sdgs || [],
      }));
    });

    return NextResponse.json({ projects });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch projects";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
