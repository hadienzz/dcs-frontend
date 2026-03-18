/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_URL = "https://chatbotdcs-production.up.railway.app/chat";

export async function POST(req: NextRequest) {
  try {
    const AUTH_TOKEN = process.env.AUTH_TOKEN;
    if (!AUTH_TOKEN) {
      return NextResponse.json(
        { error: "Missing AUTH_TOKEN environment variable." },
        { status: 500 }
      );
    }

    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Invalid body. Expecting { question: string }" },
        { status: 400 }
      );
    }

    const upstream = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN.startsWith("Bearer ")
          ? AUTH_TOKEN
          : `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({ question }),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { error: "Upstream error", detail: text },
        { status: upstream.status }
      );
    }

    // Normalisasi respons
    const data = await upstream.json();
    const answer =
      data?.answer ??
      data?.reply ??
      data?.message ??
      "Maaf, tidak ada jawaban.";
    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Chat route failed", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
