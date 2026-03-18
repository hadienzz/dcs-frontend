"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  FileBadge2,
  FileText,
  GraduationCap,
  Heart,
  Lightbulb,
  LogOut,
  Medal,
  Microscope,
  PencilLine,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import {
  buildStudentNotifications,
  formatPortalDate,
  getApplicationStatusMeta,
} from "@/lib/portal-notifications";

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

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function StudentProfilePage() {
  const router = useRouter();
  const {
    currentLecturer,
    currentStudent,
    isHydrated,
    logoutStudent,
    studentApplications,
  } = useLecturerPortal();
  const { ideas, innovations } = useSdgsHub();

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

  const researchRequests = useMemo(() => {
    if (!currentStudent) {
      return [];
    }

    return studentApplications.filter(
      (application) => application.studentEmail === currentStudent.email,
    );
  }, [currentStudent, studentApplications]);

  const researchNotifications = useMemo(
    () => buildStudentNotifications(researchRequests),
    [researchRequests],
  );

  const ideaHistory = useMemo(() => {
    if (!currentStudent) {
      return [];
    }

    return ideas
      .filter((idea) => idea.email.toLowerCase() === currentStudent.email)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [currentStudent, ideas]);

  const innovationHistory = useMemo(() => {
    if (!currentStudent) {
      return [];
    }

    return innovations
      .filter(
        (innovation) =>
          innovation.creatorEmail?.toLowerCase() === currentStudent.email,
      )
      .sort(
        (a, b) => Date.parse(b.createdAt ?? "") - Date.parse(a.createdAt ?? ""),
      );
  }, [currentStudent, innovations]);

  const researchHistory = useMemo(
    () =>
      researchRequests.filter(
        (request) =>
          request.status === "accepted" || request.status === "completed",
      ),
    [researchRequests],
  );

  const totalLikes = useMemo(() => {
    const ideaLikes = ideaHistory.reduce(
      (total, idea) => total + idea.votes,
      0,
    );
    const innovationLikes = innovationHistory.reduce(
      (total, innovation) => total + (innovation.likes ?? 0),
      0,
    );

    return ideaLikes + innovationLikes;
  }, [ideaHistory, innovationHistory]);

  const badges = useMemo(() => {
    const earnedBadges = [
      {
        id: "impact",
        title: totalLikes >= 40 ? "Impact Builder" : "Impact Starter",
        description:
          totalLikes >= 40
            ? "Karyamu berhasil mengumpulkan atensi tinggi dari komunitas SDGs Hub."
            : "Sudah mulai membangun jejak kontribusi di ekosistem SDGs Hub.",
        icon: Heart,
        tone: "from-[#fff1f2] to-white text-[#b6252a]",
      },
      {
        id: "research",
        title:
          researchHistory.length >= 2
            ? "Research Collaborator"
            : "Research Explorer",
        description:
          researchHistory.length >= 2
            ? "Aktif terlibat dalam lebih dari satu ritme kolaborasi bersama dosen."
            : "Sudah masuk ke alur kolaborasi riset dan mulai membangun kredibilitas.",
        icon: Microscope,
        tone: "from-[#eef9ff] to-white text-[#0f6e95]",
      },
      {
        id: "portfolio",
        title:
          ideaHistory.length + innovationHistory.length >= 3
            ? "Portfolio Shaper"
            : "Idea Contributor",
        description:
          ideaHistory.length + innovationHistory.length >= 3
            ? "Portofoliomu sudah tersebar di ide dan inovasi dengan ritme kontribusi yang konsisten."
            : "Sudah mulai membangun portofolio yang terlihat dan mudah dievaluasi.",
        icon: Medal,
        tone: "from-[#fff7e8] to-white text-[#a05a00]",
      },
    ];

    if (researchRequests.some((request) => request.status === "pending")) {
      earnedBadges.push({
        id: "pipeline",
        title: "Pipeline Active",
        description:
          "Masih ada request riset aktif yang sedang bergerak dalam pipeline review.",
        icon: TimerReset,
        tone: "from-[#f5f3ff] to-white text-[#6d3de4]",
      });
    }

    return earnedBadges;
  }, [
    ideaHistory.length,
    innovationHistory.length,
    researchHistory.length,
    researchRequests,
    totalLikes,
  ]);

  if (!isHydrated || !currentStudent) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff_0%,#fff7f6_100%)] pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-[2rem] border border-[#b6252a]/10 bg-white px-8 py-16 text-center shadow-[0_28px_80px_-44px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-medium text-gray-500">
              Menyiapkan workspace profil mahasiswa...
            </p>
          </div>
        </div>
      </main>
    );
  }

  const hasCv = Boolean(currentStudent.cvAttachment);
  const activeResearchCount = researchRequests.filter(
    (request) => request.status === "pending" || request.status === "reviewed",
  ).length;
  const portfolioActivityCount = ideaHistory.length + innovationHistory.length;
  const latestNotifications = researchNotifications.slice(0, 2);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff5f3_0%,#ffffff_18%,#fffdf8_58%,#ffffff_100%)]">
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.14)_0%,transparent_72%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(252,195,11,0.16)_0%,transparent_75%)] blur-3xl" />
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.14)_0%,transparent_72%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          {!hasCv ? (
            <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-amber-200 bg-[linear-gradient(135deg,#fff8e8_0%,#fffdf9_100%)] p-5 shadow-[0_20px_50px_-40px_rgba(180,83,9,0.28)] md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                    CV Belum Lengkap
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-amber-900/80">
                    Upload CV terlebih dahulu agar profilmu siap dibaca dosen
                    dan kamu bisa mendaftar penelitian tanpa hambatan.
                  </p>
                </div>
              </div>
              <Link
                href="/sdgs-hub/profil-saya/edit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(182,37,42,0.95)] transition hover:-translate-y-0.5"
              >
                <FileText className="size-4" />
                Upload CV Sekarang
              </Link>
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div className="self-start rounded-[2rem] border border-[#b6252a]/10 bg-white/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.24)] backdrop-blur">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff4f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  <Sparkles className="size-4" />
                  Profil Mahasiswa
                </div>

                <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-20 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,#8f1a20_0%,#ed1e28_100%)] text-2xl font-semibold text-white shadow-[0_20px_40px_-20px_rgba(182,37,42,0.95)]">
                      {getInitials(currentStudent.name)}
                    </div>
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                        {currentStudent.name}
                      </h1>
                      <p className="mt-1 text-sm text-gray-500">
                        {currentStudent.program} • Angkatan{" "}
                        {currentStudent.batch}
                      </p>
                      <p className="mt-2 max-w-2xl text-base leading-7 text-gray-600">
                        {currentStudent.focus}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/sdgs-hub/profil-saya/edit"
                      className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/15 bg-white px-5 py-3 text-sm font-semibold text-[#9f1f25] transition hover:-translate-y-0.5 hover:border-[#b6252a]/30 hover:bg-[#fff6f6]"
                    >
                      <PencilLine className="size-4" />
                      Edit Profil
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logoutStudent();
                        router.push("/login?role=mahasiswa");
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(182,37,42,0.95)] transition hover:-translate-y-0.5"
                    >
                      <LogOut className="size-4" />
                      Keluar
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
                    {currentStudent.faculty}
                  </span>
                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
                    NIM {currentStudent.nim}
                  </span>
                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
                    {currentStudent.email}
                  </span>
                  {currentStudent.phone ? (
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
                      {currentStudent.phone}
                    </span>
                  ) : null}
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_0.7fr]">
                  <div className="rounded-[1.65rem] border border-[#b6252a]/10 bg-[linear-gradient(135deg,#fff7f4_0%,#ffffff_60%,#fff5ec_100%)] p-6">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b6252a]/72">
                      Ringkasan Profil
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {currentStudent.bio}
                    </p>

                    <div className="mt-6 border-t border-[#b6252a]/10 pt-5">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                        Skill Stack
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {currentStudent.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-[#b6252a]/10 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {[
                      {
                        label: "Request Riset",
                        value: researchRequests.length,
                        icon: Microscope,
                      },
                      {
                        label: "Kolaborasi Dosen",
                        value: researchHistory.length,
                        icon: GraduationCap,
                      },
                      {
                        label: "Aktivitas Portofolio",
                        value: portfolioActivityCount,
                        icon: BookOpen,
                      },
                      {
                        label: "Update Aktif",
                        value: researchNotifications.length,
                        icon: Bell,
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="rounded-[1.4rem] border border-black/6 bg-white p-4 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.18)]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-gray-500">
                              {item.label}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fff2f2] text-[#b6252a]">
                              <Icon className="size-4" />
                            </div>
                          </div>
                          <div className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
                            {item.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white/96 shadow-[0_28px_72px_-44px_rgba(15,23,42,0.24)] backdrop-blur">
                <div className="bg-[linear-gradient(180deg,#8f1a20_0%,#b6252a_46%,#ed1e28_100%)] p-7 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                    Student Command Center
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Ritme profil dan pipeline risetmu
                  </h2>
                  {/* <p className="mt-3 text-sm leading-7 text-white/80">
                    Semua update penting diringkas di satu rail supaya kamu
                    bisa baca status, cek kesiapan CV, lalu lanjut ke detail
                    tanpa harus scroll terlalu jauh.
                  </p> */}

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      {
                        label: "Total likes kontribusi",
                        value: totalLikes,
                        icon: Heart,
                      },
                      {
                        label: "Request berjalan",
                        value: activeResearchCount,
                        icon: ShieldCheck,
                      },
                      {
                        label: "Badge aktif",
                        value: badges.length,
                        icon: Medal,
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 backdrop-blur"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-white/78">
                              {item.label}
                            </span>
                            <Icon className="size-4 text-white/88" />
                          </div>
                          <div className="mt-3 text-3xl font-semibold tracking-tight">
                            {item.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-black/6 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                        Research Inbox
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
                        Notifikasi penelitian terbaru
                      </h2>
                    </div>
                    <div className="inline-flex min-w-11 items-center justify-center rounded-full border border-[#b6252a]/10 bg-[#fff4f3] px-3 py-1.5 text-sm font-semibold text-[#b6252a]">
                      {researchNotifications.length}
                    </div>
                  </div>

                  {latestNotifications.length === 0 ? (
                    <div className="mt-5 rounded-[1.4rem] border border-dashed border-gray-200 bg-[#fcfcfc] px-5 py-8 text-sm leading-7 text-gray-500">
                      Belum ada notifikasi baru terkait pengajuan penelitianmu.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {latestNotifications.map((notification) => (
                        <Link
                          key={notification.id}
                          href={notification.href}
                          className="group block rounded-[1.4rem] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fff9f9_100%)] p-4 transition hover:-translate-y-0.5 hover:border-[#b6252a]/16 hover:shadow-[0_18px_48px_-36px_rgba(182,37,42,0.3)]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff2f2] text-[#b6252a]">
                              <Bell className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${notification.badgeClassName}`}
                                >
                                  {notification.badgeLabel}
                                </span>
                                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                                  {notification.meta}
                                </span>
                              </div>
                              <div className="mt-3 text-sm font-semibold leading-6 text-gray-900">
                                {notification.title}
                              </div>
                              <p className="mt-1 text-sm leading-6 text-gray-500">
                                {notification.description}
                              </p>
                              <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#b6252a] transition group-hover:gap-3">
                                Buka detail status
                                <ArrowRight className="size-3.5" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href="#research-pipeline"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition hover:gap-3"
                  >
                    Lihat pipeline lengkap
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="border-t border-black/6 bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                        Attachment CV
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
                        Dokumen untuk dosen
                      </h2>
                    </div>
                    <FileBadge2 className="size-5 text-[#b6252a]" />
                  </div>

                  {currentStudent.cvAttachment ? (
                    <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-emerald-700">
                            {currentStudent.cvAttachment.fileName}
                          </div>
                          <div className="mt-2 text-sm text-emerald-800/80">
                            {formatBytes(currentStudent.cvAttachment.fileSize)}{" "}
                            • Upload{" "}
                            {formatDate(currentStudent.cvAttachment.uploadedAt)}
                          </div>
                        </div>
                        <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                          Siap
                        </span>
                      </div>
                      <a
                        href={currentStudent.cvAttachment.dataUrl}
                        download={currentStudent.cvAttachment.fileName}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:gap-3"
                      >
                        Unduh CV
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[1.5rem] border border-dashed border-amber-200 bg-amber-50/60 p-5 text-sm leading-7 text-amber-900/80">
                      CV belum diunggah. Lengkapi profil agar dosen dapat
                      langsung melihat lampiran saat meninjau pendaftaranmu.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ScrollSection>
        <section id="research-pipeline" className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.22)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                    Status Request Riset
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                    Pipeline kolaborasi dengan dosen
                  </h2>
                </div>
                <Link
                  href="/sdgs-hub/riset"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition hover:gap-3"
                >
                  Cari riset lain
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {researchRequests.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-[#fcfcfc] px-5 py-10 text-center text-sm text-gray-500">
                    Belum ada request riset yang tercatat untuk akun ini.
                  </div>
                ) : (
                  researchRequests.map((request) => {
                    const status = getApplicationStatusMeta(request.status);

                    return (
                      <div
                        key={request.id}
                        className="rounded-[1.5rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff_0%,#fffafa_100%)] p-5"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="text-lg font-semibold tracking-tight text-gray-900">
                              {request.projectTitle}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              Peran yang diajukan:{" "}
                              <span className="font-medium text-gray-700">
                                {request.role}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              Dikirim pada {formatDate(request.requestedAt)} •
                              Update{" "}
                              {formatPortalDate(
                                request.statusUpdatedAt ?? request.requestedAt,
                              )}{" "}
                              • CV: {request.cvFileName}
                            </div>
                          </div>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${status.badgeClassName}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                          {request.note}
                        </p>

                        <div className="mt-4 text-sm text-gray-500">
                          Pembimbing:{" "}
                          <span className="font-medium text-gray-700">
                            {request.lecturerName}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <Link
                            href={`/sdgs-hub/profil-saya/riset/${request.id}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition hover:gap-3"
                          >
                            Lihat detail status
                            <ArrowRight className="size-4" />
                          </Link>
                          <Link
                            href={`/sdgs-hub/riset/${request.projectSlug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:gap-3 hover:text-[#b6252a]"
                          >
                            Lihat detail riset
                            <ArrowRight className="size-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.22)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  Badge Saya
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  Capaian yang sedang terbentuk
                </h2>

                <div className="mt-6 space-y-4">
                  {badges.map((badge) => {
                    const Icon = badge.icon;

                    return (
                      <div
                        key={badge.id}
                        className={`rounded-[1.5rem] border border-black/6 bg-gradient-to-br p-5 ${badge.tone}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <div className="text-base font-semibold text-gray-900">
                              {badge.title}
                            </div>
                            <p className="mt-2 text-sm leading-7 text-gray-600">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 py-6 pb-20">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.22)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                    History Ide
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                    Postingan ide mahasiswa
                  </h2>
                </div>
                <Lightbulb className="size-5 text-[#b6252a]" />
              </div>

              <div className="mt-6 space-y-4">
                {ideaHistory.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-[#fcfcfc] px-5 py-8 text-sm text-gray-500">
                    Belum ada ide yang diposting dengan akun ini.
                  </div>
                ) : (
                  ideaHistory.map((idea) => (
                    <div
                      key={idea.id}
                      className="rounded-[1.5rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf7_100%)] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold tracking-tight text-gray-900">
                            {idea.title}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {idea.sdgCategory} • {formatDate(idea.createdAt)}
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/10 bg-[#fff3f3] px-3 py-1.5 text-sm font-semibold text-[#b6252a]">
                          <Heart className="size-4" />
                          {idea.votes}
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-gray-600">
                        {idea.description}
                      </p>

                      <Link
                        href={`/sdgs-hub/ide/${idea.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition hover:gap-3"
                      >
                        Buka detail ide
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.22)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                    History Inovasi
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                    Postingan inovasi yang pernah kamu dorong
                  </h2>
                </div>
                <Rocket className="size-5 text-[#b6252a]" />
              </div>

              <div className="mt-6 space-y-4">
                {innovationHistory.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-[#fcfcfc] px-5 py-8 text-sm text-gray-500">
                    Belum ada inovasi yang terhubung ke akun ini.
                  </div>
                ) : (
                  innovationHistory.map((innovation) => (
                    <div
                      key={innovation.id}
                      className="rounded-[1.5rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold tracking-tight text-gray-900">
                            {innovation.title}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {innovation.sdgCategory} •{" "}
                            {formatDate(innovation.createdAt ?? "")}
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                          <Heart className="size-4" />
                          {innovation.likes ?? 0}
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-gray-600">
                        {innovation.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {innovation.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/sdgs-hub/inovasi/${innovation.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition hover:gap-3"
                      >
                        Buka detail inovasi
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
