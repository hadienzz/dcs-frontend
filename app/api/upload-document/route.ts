import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export const runtime = "nodejs";

function toSafeFileBase(input: string) {
  return input
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const candidate = formData.get("file");

    if (!(candidate instanceof File)) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 },
      );
    }

    if (candidate.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Hanya file PDF yang diperbolehkan." },
        { status: 415 },
      );
    }

    if (candidate.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB." },
        { status: 413 },
      );
    }

    const bytes = Buffer.from(await candidate.arrayBuffer());
    const safeBase = toSafeFileBase(candidate.name || "dokumen");
    const fileName = `${Date.now()}-${safeBase || "dokumen"}-${randomUUID().slice(0, 8)}.pdf`;
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "documents",
    );
    const fullPath = path.join(uploadsDir, fileName);

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(fullPath, bytes);

    return NextResponse.json({
      document: {
        name: candidate.name,
        url: `/uploads/documents/${fileName}`,
        mimeType: candidate.type,
        size: candidate.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Upload dokumen gagal diproses." },
      { status: 500 },
    );
  }
}
