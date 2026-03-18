"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileBadge2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import {
  formatPortalDate,
  getApplicationStatusMeta,
} from "@/lib/portal-notifications";

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function StudentResearchStatusDetailPage({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const { currentLecturer, currentStudent, isHydrated, studentApplications } =
    useLecturerPortal();
  const { projects } = useSdgsHub();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (currentLecturer && !currentStudent) {
      router.replace("/sdgs-hub/riset/dashboard");
      return;
    }

    if (!currentStudent) {
      router.replace("/login?role=mahasiswa");
    }
  }, [currentLecturer, currentStudent, isHydrated, router]);

  const application = useMemo(() => {
    if (!currentStudent) {
      return null;
    }

    return (
      studentApplications.find(
        (item) =>
          item.id === applicationId &&
          item.studentEmail.toLowerCase() === currentStudent.email.toLowerCase(),
      ) ?? null
    );
  }, [applicationId, currentStudent, studentApplications]);

  const project = useMemo(
    () =>
      projects.find((item) => item.slug === application?.projectSlug) ?? null,
    [application?.projectSlug, projects],
  );

  useEffect(() => {
    if (isHydrated && currentStudent && !application) {
      router.replace("/sdgs-hub/profil-saya");
    }
  }, [application, currentStudent, isHydrated, router]);

  if (!isHydrated || !currentStudent || !application) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f5_0%,#ffffff_100%)] pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-[2rem] border border-[#b6252a]/10 bg-white px-8 py-16 text-center shadow-[0_28px_80px_-44px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-medium text-gray-500">
              Menyiapkan detail status penelitian...
            </p>
          </div>
        </div>
      </main>
    );
  }

  const statusMeta = getApplicationStatusMeta(application.status);
  const latestDate = application.statusUpdatedAt ?? application.requestedAt;
  const timeline = [
    {
      title: "Pengajuan dikirim",
      body: `Lamaran untuk ${application.projectTitle} berhasil masuk ke pipeline riset.`,
      date: formatPortalDate(application.requestedAt),
      active: true,
    },
    {
      title: "Evaluasi dosen",
      body:
        application.status === "pending"
          ? "Tim dosen belum memberi keputusan lanjutan. Status saat ini masih menunggu review."
          : "Dosen pembimbing sudah meninjau detail kontribusi, CV, dan kecocokan peran yang kamu ajukan.",
      date: formatPortalDate(latestDate),
      active: application.status !== "pending",
    },
    {
      title: statusMeta.label,
      body:
        application.status === "accepted"
          ? "Kamu sudah diterima dan bisa lanjut mengikuti ritme kolaborasi yang disiapkan dosen."
          : application.status === "completed"
            ? "Kolaborasi sudah selesai dan tercatat sebagai bagian dari histori profilmu."
            : application.status === "reviewed"
              ? "Aplikasi masih berada pada tahap review lanjutan sebelum keputusan final."
              : "Belum ada keputusan final. Pantau notifikasi untuk update berikutnya.",
      date: formatPortalDate(latestDate),
      active:
        application.status === "accepted" ||
        application.status === "completed" ||
        application.status === "reviewed",
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f4_0%,#ffffff_18%,#fffdf9_58%,#ffffff_100%)]">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.16)_0%,transparent_72%)] blur-3xl" />
          <div className="absolute right-0 top-8 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.14)_0%,transparent_72%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/sdgs-hub/profil-saya"
              className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/15 bg-white px-4 py-2 text-sm font-semibold text-[#9f1f25] transition hover:-translate-y-0.5 hover:border-[#b6252a]/30 hover:bg-[#fff6f6]"
            >
              <ArrowLeft className="size-4" />
              Kembali ke Profil Saya
            </Link>
            <Link
              href={`/sdgs-hub/riset/${application.projectSlug}`}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-[#b6252a]/20 hover:text-[#b6252a]"
            >
              Buka Halaman Riset
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2.2rem] border border-[#b6252a]/10 bg-white/92 p-8 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.24)] backdrop-blur">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff4f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                <Sparkles className="size-4" />
                Detail Status Penelitian
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusMeta.badgeClassName}`}
                >
                  {statusMeta.label}
                </span>
                <span className="rounded-full border border-black/8 bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-slate-500">
                  Update {formatPortalDate(latestDate)}
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl md:leading-tight">
                {application.projectTitle}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                {application.note}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  {
                    label: "Peran yang diajukan",
                    value: application.role,
                    icon: GraduationCap,
                  },
                  {
                    label: "Dosen pembimbing",
                    value: application.lecturerName,
                    icon: ShieldCheck,
                  },
                  {
                    label: "File CV terlampir",
                    value: application.cvFileName,
                    icon: FileBadge2,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-[1.5rem] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfc_100%)] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-slate-500">
                          {item.label}
                        </div>
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#b6252a]">
                          <Icon className="size-4" />
                        </div>
                      </div>
                      <div className="mt-4 text-lg font-semibold leading-7 text-slate-900">
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[1.8rem] border border-black/6 bg-[#fcfcfc] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                      Timeline Status
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                      Perjalanan pengajuanmu
                    </h2>
                  </div>
                  <ShieldCheck className="size-5 text-[#b6252a]" />
                </div>

                <div className="mt-6 space-y-4">
                  {timeline.map((item, index) => (
                    <div
                      key={item.title}
                      className="grid gap-4 rounded-[1.4rem] border border-black/6 bg-white p-5 md:grid-cols-[auto_1fr]"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-1 flex size-10 items-center justify-center rounded-2xl text-sm font-semibold ${
                            item.active
                              ? "bg-[linear-gradient(135deg,#8f1a20_0%,#ed1e28_100%)] text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                            {item.date}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_24px_72px_-46px_rgba(15,23,42,0.22)]">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  Ringkasan Riset
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  Snapshot project
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.4rem] border border-black/6 bg-[#fcfcfc] p-5">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Topik
                    </div>
                    <div className="mt-3 text-base font-semibold leading-7 text-slate-900">
                      {project?.title ?? application.projectTitle}
                    </div>
                  </div>
                  <div className="rounded-[1.4rem] border border-black/6 bg-[#fcfcfc] p-5">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Deskripsi singkat
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {project?.overview ??
                        "Detail project masih mengikuti campaign riset yang aktif di dashboard dosen."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_24px_72px_-46px_rgba(15,23,42,0.22)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                      CV Terkait
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                      Dokumen yang dinilai dosen
                    </h2>
                  </div>
                  <FileBadge2 className="size-5 text-[#b6252a]" />
                </div>

                {currentStudent.cvAttachment ? (
                  <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
                    <div className="text-base font-semibold text-emerald-800">
                      {currentStudent.cvAttachment.fileName}
                    </div>
                    <div className="mt-2 text-sm leading-7 text-emerald-900/75">
                      {formatBytes(currentStudent.cvAttachment.fileSize)} •
                      Upload {formatPortalDate(currentStudent.cvAttachment.uploadedAt)}
                    </div>
                    <a
                      href={currentStudent.cvAttachment.dataUrl}
                      download={currentStudent.cvAttachment.fileName}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:gap-3"
                    >
                      Buka CV
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[1.5rem] border border-dashed border-amber-200 bg-amber-50/60 p-5 text-sm leading-7 text-amber-900/80">
                    CV belum tersedia untuk akun ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
