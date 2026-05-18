import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SDG_LIST = `
1. No Poverty
2. Zero Hunger
3. Good Health and Well-being
4. Quality Education
5. Gender Equality
6. Clean Water and Sanitation
7. Affordable and Clean Energy
8. Decent Work and Economic Growth
9. Industry, Innovation and Infrastructure
10. Reduced Inequalities
11. Sustainable Cities and Communities
12. Responsible Consumption and Production
13. Climate Action
14. Life Below Water
15. Life on Land
16. Peace, Justice and Strong Institutions
17. Partnerships for the Goals
`.trim();

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const body = await req.json();
  const { title, abstract } = body as { title?: string; abstract?: string };

  if (!title && !abstract) {
    return NextResponse.json(
      { error: "Judul atau abstrak wajib diisi." },
      { status: 400 },
    );
  }

  const userContent = [
    title ? `Judul: ${title}` : "",
    abstract ? `Abstrak: ${abstract}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemPrompt = `Kamu adalah asisten AI yang ahli dalam mengklasifikasikan dokumen ke dalam 17 Sustainable Development Goals (SDGs) PBB.

Daftar SDGs:
${SDG_LIST}

Tugas:
Berdasarkan judul dan/atau abstrak yang diberikan, tentukan SDG mana saja yang relevan dengan dokumen tersebut.

Berikan respons dalam format JSON array dengan struktur:
[
  {
    "sdg": <nomor SDG (1-17)>,
    "name": "<nama SDG>",
    "confidence": <skor kepercayaan 0-100>,
    "reason": "<penjelasan singkat mengapa dokumen ini relevan dengan SDG ini>"
  }
]

Aturan:
- Hanya sertakan SDG yang benar-benar relevan (confidence >= 40)
- Urutkan dari confidence tertinggi ke terendah
- Berikan penjelasan yang spesifik dan ringkas
- Respons HANYA dalam format JSON, tanpa teks tambahan`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: `OpenAI API error: ${response.status}`,
          details: errorData,
        },
        { status: 502 },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "[]";

    // Parse the JSON from the response
    let results;
    try {
      // Handle potential markdown code blocks in response
      const cleaned = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      results = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response.", raw: content },
        { status: 500 },
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to OpenAI API." },
      { status: 502 },
    );
  }
}
