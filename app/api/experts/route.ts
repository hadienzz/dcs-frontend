import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    const experts = await client.fetch(
      `*[_type == "expert"]|order(name asc){
        _id,
        name,
        slug,
        image,
        expertise,
        sdgNumbers,
        position,
        bio
      }`
    );
    return NextResponse.json({ experts });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch experts" },
      { status: 500 }
    );
  }
}
