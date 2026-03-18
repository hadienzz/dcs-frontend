import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import {
  LOCATION_COORDS,
  getCoords,
  canonicalizeLocation,
} from "@/lib/locations";

type ProvinceDoc = {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  aliases?: string[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  try {
    if (q) {
      const input = q.trim();
      // Try local first (fast path)
      const local = getCoords(input);
      if (local) {
        const name = canonicalizeLocation(input)!;
        return NextResponse.json({ name, coords: local });
      }

      // Fallback to Sanity match by name/aliases (case-insensitive)
      const query = `*[_type == "province" && (lower(name) == $n || count(aliases[lower(@) == $n]) > 0)][0]{name, latitude, longitude}`;
      const nameLower = input.toLowerCase();
      const doc = await client.fetch<ProvinceDoc | null>(query, {
        n: nameLower,
      });
      if (doc) {
        return NextResponse.json({
          name: doc.name,
          coords: [doc.longitude, doc.latitude],
        });
      }

      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    // No query: list all known local locations (provinces + cities) minimal
    const list = Object.entries(LOCATION_COORDS).map(([name, coords]) => ({
      name,
      coords,
    }));
    return NextResponse.json({ locations: list });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to resolve location";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
