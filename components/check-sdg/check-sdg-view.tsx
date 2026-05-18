"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Sparkles,
  Target,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface SdgResult {
  sdg: number;
  name: string;
  confidence: number;
  reason: string;
}

// SDG colors matching the official UN palette
const sdgColors: Record<number, string> = {
  1: "#E5243B",
  2: "#DDA63A",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3A21",
  6: "#26BDE2",
  7: "#FCC30B",
  8: "#A21942",
  9: "#FD6925",
  10: "#DD1367",
  11: "#FD9D24",
  12: "#BF8B2E",
  13: "#3F7E44",
  14: "#0A97D9",
  15: "#56C02B",
  16: "#00689D",
  17: "#19486A",
};

export function CheckSdgView() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SdgResult[] | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (file: File) => {
      setFileName(file.name);
      // Read text content from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          // Use first line as title if empty, rest as abstract
          const lines = text.split("\n").filter((l) => l.trim());
          if (!title && lines[0]) setTitle(lines[0].slice(0, 200));
          if (!abstract && lines.length > 1) {
            setAbstract(lines.slice(1).join("\n").slice(0, 3000));
          }
        }
      };
      reader.readAsText(file);
    },
    [title, abstract],
  );

  const handleSubmit = async () => {
    if (!title.trim() && !abstract.trim()) {
      setError("Masukkan judul atau abstrak terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/check-sdg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          abstract: abstract.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan.");
        return;
      }

      setResults(data.results ?? []);
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setAbstract("");
    setFileName("");
    setResults(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#b6252a]/[0.08]">
              <Target className="size-4 text-[#b6252a]" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              SDG Checker
            </span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#b6252a]/[0.06] ring-1 ring-[#b6252a]/10">
            <Sparkles className="size-6 text-[#b6252a]" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Cek Kategori SDG Dokumen
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
            Masukkan judul dan abstrak dokumen, atau upload file — AI akan
            memprediksi SDG mana yang paling relevan.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div className="space-y-5">
            {/* File upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="cursor-pointer rounded-xl border-2 border-dashed border-black/[0.08] bg-white p-6 text-center transition-colors hover:border-[#b6252a]/30 hover:bg-[#b6252a]/[0.01]"
            >
              <Upload className="mx-auto size-6 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700">
                Upload dokumen
              </p>
              <p className="mt-1 text-xs text-slate-400">
                TXT, PDF, DOCX — atau drag & drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.doc"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>

            {fileName && (
              <div className="flex items-center gap-2 rounded-lg border border-black/[0.06] bg-white px-3 py-2.5">
                <FileText className="size-4 text-slate-400" />
                <span className="flex-1 truncate text-sm text-slate-700">
                  {fileName}
                </span>
                <button
                  type="button"
                  onClick={() => setFileName("")}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-black/[0.06]" />
              <span className="text-xs font-medium text-slate-400">atau isi manual</span>
              <div className="h-px flex-1 bg-black/[0.06]" />
            </div>

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Judul Dokumen
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul dokumen..."
                className="border-black/[0.08] bg-white text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Abstrak / Deskripsi
              </label>
              <Textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Masukkan abstrak atau deskripsi dokumen..."
                rows={8}
                className="border-black/[0.08] bg-white text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                {abstract.length}/3000 karakter
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || (!title.trim() && !abstract.trim())}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {isLoading ? "Menganalisis..." : "Analisis SDG"}
              </Button>
              {(title || abstract || results) && (
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Results panel */}
          <div className="space-y-4">
            <div className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="border-b border-black/[0.04] px-5 py-4">
                <h2 className="text-[15px] font-semibold text-slate-900">
                  Hasil Prediksi
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  SDG yang relevan dengan dokumen Anda
                </p>
              </div>

              <div className="p-4">
                {isLoading && (
                  <div className="flex flex-col items-center py-10 text-center">
                    <Loader2 className="size-8 animate-spin text-[#b6252a]" />
                    <p className="mt-3 text-sm text-slate-500">
                      AI sedang menganalisis dokumen...
                    </p>
                  </div>
                )}

                {!isLoading && !results && (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100">
                      <Target className="size-5 text-slate-400" />
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      Masukkan dokumen dan klik &ldquo;Analisis SDG&rdquo;
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Hasil prediksi akan muncul di sini
                    </p>
                  </div>
                )}

                {!isLoading && results && results.length === 0 && (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50">
                      <Target className="size-5 text-amber-500" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Tidak ada SDG yang terdeteksi
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Coba tambahkan detail lebih banyak pada abstrak
                    </p>
                  </div>
                )}

                {!isLoading && results && results.length > 0 && (
                  <div className="space-y-3">
                    {results.map((result) => (
                      <SdgResultCard key={result.sdg} result={result} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-black/[0.04] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Tentang
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Fitur ini menggunakan AI (GPT-4o-mini) untuk menganalisis
                konten dokumen dan memprediksi relevansinya terhadap 17
                Sustainable Development Goals PBB. Skor confidence
                menunjukkan tingkat keyakinan AI.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SdgResultCard({ result }: { result: SdgResult }) {
  const color = sdgColors[result.sdg] ?? "#333";
  const confidenceLabel =
    result.confidence >= 80
      ? "Sangat Relevan"
      : result.confidence >= 60
        ? "Relevan"
        : "Cukup Relevan";

  return (
    <div className="rounded-xl border border-black/[0.06] bg-[#fafafa] p-4 transition-colors hover:bg-white">
      <div className="flex items-start gap-3">
        {/* SDG badge */}
        <div
          className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
          style={{ backgroundColor: color }}
        >
          <span className="text-lg font-bold leading-none">{result.sdg}</span>
          <span className="text-[8px] uppercase tracking-wide">SDG</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{result.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {result.reason}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${result.confidence}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-slate-600">
          {result.confidence}%
        </span>
      </div>
      <p className="mt-1 text-[10px] font-medium text-slate-400">
        {confidenceLabel}
      </p>
    </div>
  );
}
