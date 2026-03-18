"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { DocumentPreviewSection } from "@/components/sdgs-hub/document-preview-section";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";
import { useSdgsHub, type Project } from "@/hooks/useSdgsHubData";

const STATUS_STYLES: Record<
  Project["status"],
  { label: string; className: string }
> = {
  open: {
    label: "Masih Dibuka",
    className: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  },
  "in-progress": {
    label: "Sedang Berjalan",
    className: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  },
  closed: {
    label: "Ditutup",
    className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
  },
};

const SDG_COLORS: Record<string, string> = {
  "SDG 1": "#E5243B",
  "SDG 2": "#DDA63A",
  "SDG 3": "#4C9F38",
  "SDG 4": "#C5192D",
  "SDG 5": "#FF3A21",
  "SDG 6": "#26BDE2",
  "SDG 7": "#FCC30B",
  "SDG 8": "#A21942",
  "SDG 9": "#FD6925",
  "SDG 10": "#DD1367",
  "SDG 11": "#FD9D24",
  "SDG 12": "#BF8B2E",
  "SDG 13": "#3F7E44",
  "SDG 14": "#0A97D9",
  "SDG 15": "#56C02B",
  "SDG 16": "#00689D",
  "SDG 17": "#19486A",
};

function formatDate(date: string) {
  const parsedDate = Date.parse(date);
  if (Number.isNaN(parsedDate)) {
    return date;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function getAccentColor(sdgCategory: string) {
  return SDG_COLORS[sdgCategory] || "#b6252a";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function RisetDetailPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const { projects } = useSdgsHub();
  const { currentStudent, isHydrated, applyToResearch } = useLecturerPortal();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationRole, setApplicationRole] = useState("Research Support");
  const [applicationNote, setApplicationNote] = useState("");
  const [applicationFeedback, setApplicationFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const project = useMemo(
    () => projects.find((item) => item.slug === params.slug),
    [params.slug, projects],
  );

  if (!project) {
    return (
      <main className="min-h-screen bg-white px-6 py-32">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-gray-100 bg-white p-10 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b6252a]">
            Detail Riset
          </p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Riset tidak ditemukan
          </h1>
          <p className="mt-4 text-base leading-8 text-gray-600">
            Data riset yang Anda cari belum tersedia atau sudah tidak aktif.
          </p>
          <Link
            href="/sdgs-hub/riset"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke halaman riset
          </Link>
        </div>
      </main>
    );
  }

  const remainingSlots = Math.max(project.teamSlots - project.filledSlots, 0);
  const statusInfo = STATUS_STYLES[project.status];
  const accentColor = getAccentColor(project.sdgCategory);
  const hasCv = Boolean(currentStudent?.cvAttachment);

  const goToPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? project.heroImages.length - 1 : currentIndex - 1,
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === project.heroImages.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const openApplyFlow = () => {
    if (!isHydrated) {
      return;
    }

    if (!currentStudent) {
      router.push("/login?role=mahasiswa");
      return;
    }

    if (!currentStudent.cvAttachment) {
      setApplicationFeedback({
        type: "error",
        message:
          "Upload CV terlebih dahulu di profil agar pendaftaran penelitian bisa diproses.",
      });
      return;
    }

    setApplicationFeedback(null);
    setShowApplyModal(true);
  };

  const submitApplication = () => {
    const result = applyToResearch({
      projectSlug: project.slug,
      projectTitle: project.title,
      lecturerName: project.dosenName,
      role: applicationRole.trim() || "Research Support",
      note: applicationNote.trim(),
    });

    if (!result.success) {
      setApplicationFeedback({
        type: "error",
        message: result.message ?? "Pendaftaran tidak dapat diproses.",
      });
      setShowApplyModal(false);
      return;
    }

    setApplicationFeedback({
      type: "success",
      message: result.message ?? "Pendaftaran berhasil dikirim.",
    });
    setShowApplyModal(false);
    setApplicationNote("");
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf8_0%,#ffffff_60%,#ffffff_100%)] pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.10)_0%,transparent_72%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.10)_0%,transparent_72%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <Link
            href="/sdgs-hub/riset"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition-all duration-200 hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke daftar riset
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {project.sdgCategory}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                  {remainingSlots} slot tersisa
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl md:leading-[1.08]">
                {project.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                {project.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-gray-200">
                  <CalendarDays className="h-4 w-4 text-[#b6252a]" />
                  Dipublikasikan {formatDate(project.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-gray-200">
                  <Clock3 className="h-4 w-4 text-[#b6252a]" />
                  {project.timeline}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-gray-200">
                  <MapPin className="h-4 w-4 text-[#b6252a]" />
                  {project.location}
                </span>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#b6252a]/10 bg-white/90 p-7 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.35)] backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                Ringkasan Project
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-[#fff7f7] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Pembimbing
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {project.dosenName}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#fafafa] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                      Slot Tim
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {project.filledSlots}/{project.teamSlots}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#fff8ec] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                      Komitmen
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                      {project.commitment}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Progress keterisian slot</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(
                      (project.filledSlots / project.teamSlots) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(project.filledSlots / project.teamSlots) * 100}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#b6252a]/10 bg-[#b6252a]/5 px-3 py-1.5 text-xs font-medium text-[#8f1a20]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {currentStudent && !hasCv ? (
                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900/85">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                      <div>
                        Upload CV terlebih dahulu sebelum mendaftar penelitian
                        ini.
                        <Link
                          href="/sdgs-hub/profil-saya/edit"
                          className="ml-1 font-semibold text-[#b6252a] underline-offset-4 hover:underline"
                        >
                          Lengkapi profil sekarang
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}

                {applicationFeedback ? (
                  <div
                    className={`rounded-[1.5rem] border px-4 py-4 text-sm leading-7 ${
                      applicationFeedback.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {applicationFeedback.message}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={openApplyFlow}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_-20px_rgba(182,37,42,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                >
                  <FileText className="h-4 w-4" />
                  {currentStudent
                    ? "Daftar penelitian ini"
                    : "Masuk untuk daftar penelitian"}
                </button>
                <Link
                  href="/sdgs-hub/riset"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50"
                >
                  Eksplor Riset Lain
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="relative overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_30px_70px_-45px_rgba(15,23,42,0.4)]">
                <Image
                  src={project.heroImages[activeImageIndex]}
                  alt={project.title}
                  width={1600}
                  height={1000}
                  className="h-[420px] w-full object-cover md:h-[520px]"
                />
                {project.heroImages.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={goToPreviousImage}
                      className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md transition hover:bg-white"
                      aria-label="Gambar sebelumnya"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextImage}
                      className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md transition hover:bg-white"
                      aria-label="Gambar berikutnya"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </div>

              {project.heroImages.length > 1 ? (
                <div className="mt-5 grid grid-cols-3 gap-4">
                  {project.heroImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`overflow-hidden rounded-[22px] border transition-all duration-300 ${
                        index === activeImageIndex
                          ? "border-[#b6252a] shadow-[0_18px_40px_-24px_rgba(182,37,42,0.55)]"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${project.title} ${index + 1}`}
                        width={640}
                        height={320}
                        className="h-28 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                  Tentang Riset
                </p>
                <p className="mt-5 text-base leading-8 text-gray-600">
                  {project.overview}
                </p>
              </div>

              <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                  Kontribusi Yang Dicari
                </p>
                <p className="mt-5 text-base leading-8 text-gray-600">
                  {project.challenge}
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection>
        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#fff9f7_100%)] py-10 lg:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                  Luaran Yang Diharapkan
                </p>
                <div className="mt-6 space-y-4">
                  {project.deliverables.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl bg-[#fffaf9] p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b6252a]" />
                      <p className="text-sm leading-7 text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                  Kualifikasi Yang Dicari
                </p>
                <div className="mt-6 space-y-4">
                  {project.requirements.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl bg-[#fafafa] p-4"
                    >
                      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#b6252a]" />
                      <p className="text-sm leading-7 text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection>
        <DocumentPreviewSection
          title="Dokumen Riset"
          description="Preview dokumen proposal atau lampiran riset. Jika belum ada upload, section ini menampilkan contoh dokumen dari public."
          documents={project.documents}
        />
      </ScrollSection>

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                Partisipan Saat Ini
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Siapa saja yang sudah terlibat?
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-gray-600">
              Detail ini menunjukkan pembimbing utama dan anggota tim yang saat
              ini sudah berpartisipasi dalam project.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3f3] text-lg font-semibold text-[#b6252a]">
                  {getInitials(project.dosenName)}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Pembimbing
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {project.dosenName}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-gray-600">
                Pembimbing utama yang membuka topik riset dan mengarahkan
                jalannya kolaborasi di dalam tim.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {project.teamMembers.length > 0 ? (
                project.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.3)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3f3] text-sm font-semibold text-[#b6252a]">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="mt-5 rounded-2xl bg-[#fafafa] px-4 py-3 text-sm leading-7 text-gray-600">
                      Fokus kontribusi: {member.focus}
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 rounded-[28px] border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    Belum ada partisipan aktif
                  </p>
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Tim ini masih membuka kesempatan bagi mahasiswa yang ingin
                    bergabung.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollSection>

      {showApplyModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6 py-10 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-[#b6252a]/10 bg-white p-7 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  Konfirmasi Pendaftaran
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  Daftar ke penelitian ini?
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  CV yang terpasang di profilmu akan ikut menjadi attachment
                  saat dosen meninjau pendaftaran untuk {project.title}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                aria-label="Tutup dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Peran yang kamu ajukan
                </label>
                <input
                  value={applicationRole}
                  onChange={(event) => setApplicationRole(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Catatan singkat untuk dosen
                </label>
                <textarea
                  rows={4}
                  value={applicationNote}
                  onChange={(event) => setApplicationNote(event.target.value)}
                  placeholder="Ceritakan singkat kenapa kamu tertarik, skill yang relevan, atau kontribusi yang ingin kamu bawa."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                />
              </div>

              <div className="rounded-[1.5rem] border border-gray-100 bg-[#fcfcfc] p-4 text-sm leading-7 text-gray-600">
                Pembimbing:{" "}
                <span className="font-semibold text-gray-800">
                  {project.dosenName}
                </span>
                <br />
                CV terlampir:{" "}
                <span className="font-semibold text-gray-800">
                  {currentStudent?.cvAttachment?.fileName}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitApplication}
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_38px_-20px_rgba(182,37,42,0.95)] transition hover:-translate-y-0.5"
              >
                Konfirmasi Pendaftaran
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
