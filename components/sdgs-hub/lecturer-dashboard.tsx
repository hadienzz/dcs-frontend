"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  ClipboardList,
  Eye,
  FileBadge2,
  LayoutDashboard,
  LogOut,
  MailOpen,
  PenSquare,
  PlusCircle,
  Trash2,
  UserCircle2,
  Users,
  Waves,
} from "lucide-react";
import { CreateProjectForm } from "./create-project-form";
import {
  useCreateResearch,
  useDeleteResearch,
  useUpdateResearch,
} from "@/hooks/riset";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import {
  buildLecturerNotifications,
  formatPortalDate,
  getApplicationStatusMeta,
} from "@/lib/portal-notifications";

const STATUS_STYLES = {
  open: "bg-emerald-100 text-emerald-700",
  "in-progress": "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS = {
  open: "Terbuka",
  "in-progress": "Berjalan",
  closed: "Ditutup",
};

const DASHBOARD_LINKS = [
  {
    title: "Overview",
    description: "Ringkasan dashboard dan pintasan ke halaman utama dosen.",
    href: "/sdgs-hub/riset/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Riset Saya",
    description:
      "Semua create, edit, detail, status, dan hapus campaign ada di sini.",
    href: "/sdgs-hub/riset/dashboard/saya",
    icon: ClipboardList,
  },
  {
    title: "Profile",
    description: "Lihat identitas dosen, NIP, foto, dan ringkasan akun aktif.",
    href: "/sdgs-hub/riset/dashboard/profile",
    icon: UserCircle2,
  },
];

function DashboardLoadingState() {
  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-[2rem] border border-black/8 bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Mengarahkan ke portal dosen...
          </p>
        </div>
      </div>
    </main>
  );
}

function isActiveDashboardLink(pathname: string, href: string) {
  if (href === "/sdgs-hub/riset/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

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

export function useLecturerDashboardState() {
  const router = useRouter();
  const lecturerPortal = useLecturerPortal();
  const sdgsHub = useSdgsHub();

  useEffect(() => {
    if (lecturerPortal.isHydrated && !lecturerPortal.currentLecturer) {
      router.replace("/login?role=dosen");
    }
  }, [lecturerPortal.currentLecturer, lecturerPortal.isHydrated, router]);

  const ownProjects = sdgsHub.projects.filter(
    (project) => project.lecturerId === lecturerPortal.currentLecturer?.id,
  );
  const totalOpenSlots = ownProjects.reduce(
    (total, project) =>
      total + Math.max(project.teamSlots - project.filledSlots, 0),
    0,
  );
  const activeProjects = ownProjects.filter(
    (project) => project.status !== "closed",
  ).length;
  const lecturerNotifications = buildLecturerNotifications({
    currentLecturer: lecturerPortal.currentLecturer,
    projects: sdgsHub.projects,
    students: lecturerPortal.students,
    applications: lecturerPortal.studentApplications,
  });

  return {
    ...lecturerPortal,
    ...sdgsHub,
    ownProjects,
    totalOpenSlots,
    activeProjects,
    lecturerNotifications,
  };
}

export function LecturerDashboardShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentLecturer,
    isHydrated,
    logout,
    ownProjects,
    totalOpenSlots,
    activeProjects,
  } = useLecturerDashboardState();

  if (!isHydrated || !currentLecturer) {
    return <DashboardLoadingState />;
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-[#b6252a]/10 bg-white p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.16)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                Dashboard Dosen
              </div>

              <div className="mt-5 rounded-2xl border border-[#b6252a]/10 bg-[linear-gradient(180deg,#fffaf9_0%,#ffffff_100%)] p-4">
                <div className="text-lg font-semibold tracking-tight text-gray-900">
                  {currentLecturer.name}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {currentLecturer.faculty}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {currentLecturer.position}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentLecturer.expertise.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#b6252a]/10 bg-white px-3 py-1 text-xs font-medium text-gray-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {DASHBOARD_LINKS.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveDashboardLink(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-start gap-3 rounded-2xl border px-4 py-4 transition ${
                        isActive
                          ? "border-[#b6252a]/20 bg-[#fff8f8] shadow-sm"
                          : "border-transparent bg-[#fcfcfc] hover:border-[#b6252a]/12 hover:bg-white"
                      }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl transition ${
                          isActive
                            ? "bg-[#b6252a] text-white"
                            : "bg-[#fff1f1] text-[#b6252a] group-hover:bg-[#ffe7e7]"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-semibold ${isActive ? "text-[#8f1a20]" : "text-gray-900"}`}
                        >
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs leading-relaxed text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/sdgs-hub/riset"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                >
                  Lihat Halaman Publik
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/login?role=dosen");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                >
                  <LogOut className="size-4" />
                  Keluar
                </button>
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-6">
            <div className="rounded-[2rem] border border-[#b6252a]/10 bg-white p-8 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.16)]">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  Workspace Aktif
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                  {title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-neutral-600">
                  {description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {currentLecturer.expertise.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#b6252a]/10 bg-[#fff9f9] px-3 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {[
                  {
                    label: "Total Project Saya",
                    value: ownProjects.length,
                    icon: BarChart3,
                  },
                  {
                    label: "Slot Mahasiswa Tersedia",
                    value: totalOpenSlots,
                    icon: Users,
                  },
                  {
                    label: "Project Aktif",
                    value: activeProjects,
                    icon: Waves,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-gray-100 bg-[linear-gradient(180deg,#fff_0%,#fcfcfc_100%)] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-gray-500">
                          {item.label}
                        </div>
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#b6252a]">
                          <Icon className="size-4" />
                        </div>
                      </div>
                      <div className="mt-4 text-4xl font-semibold tracking-tight text-gray-900">
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}

export function LecturerDashboard() {
  const {
    currentLecturer,
    isHydrated,
    ownProjects,
    totalOpenSlots,
    activeProjects,
    lecturerNotifications,
  } = useLecturerDashboardState();

  if (!isHydrated || !currentLecturer) {
    return <DashboardLoadingState />;
  }

  return (
    <LecturerDashboardShell
      title={`Portal ${currentLecturer.name}`}
      description="Dashboard dosen sekarang difokuskan ke tiga area: overview, pusat pengelolaan riset, dan profile akun aktif."
    >
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Ringkasan Cepat
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Semua operasi campaign sekarang dipusatkan di halaman Riset Saya
              agar workflow dosen lebih ringkas.
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              {
                title: "Total campaign",
                value: `${ownProjects.length} project`,
                desc: "Buka Riset Saya untuk tambah, edit, lihat detail, ubah status, atau hapus campaign.",
              },
              {
                title: "Slot mahasiswa tersedia",
                value: `${totalOpenSlots} slot`,
                desc: "Semua kontrol slot dan status campaign ada di daftar Riset Saya.",
              },
              {
                title: "Project aktif",
                value: `${activeProjects} project`,
                desc: "Project aktif adalah campaign yang belum ditutup.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5"
              >
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  {item.title}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  {item.value}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                Notifikasi Dosen
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                Permintaan mahasiswa ke riset Anda
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Semua notifikasi ini mengarah langsung ke detail riset dan
                panel CV mahasiswa yang mendaftar.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-4 py-2 text-sm font-semibold text-[#b6252a]">
              <Bell className="size-4" />
              {lecturerNotifications.length} update aktif
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {lecturerNotifications.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-[#fcfcfc] px-5 py-10 text-sm leading-7 text-gray-500 xl:col-span-3">
                Belum ada mahasiswa baru yang mengajukan diri ke penelitian
                Anda.
              </div>
            ) : (
              lecturerNotifications.slice(0, 3).map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.href}
                  className="rounded-[1.6rem] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fff9f9_100%)] p-5 transition hover:border-[#b6252a]/16 hover:shadow-[0_20px_56px_-40px_rgba(182,37,42,0.28)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${notification.badgeClassName}`}
                    >
                      {notification.badgeLabel}
                    </span>
                    <MailOpen className="size-4 text-[#b6252a]" />
                  </div>
                  <div className="mt-4 text-base font-semibold leading-7 text-gray-900">
                    {notification.title}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    {notification.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a]">
                    Buka detail pendaftar
                    <Eye className="size-4" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Halaman Utama Dosen
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Navigasi sekarang disederhanakan. Overview untuk ringkasan, Riset
            Saya untuk semua CRUD, dan Profile untuk identitas dosen.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {DASHBOARD_LINKS.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-gray-100 bg-[linear-gradient(180deg,#fff_0%,#fcfcfc_100%)] p-5 transition hover:border-[#b6252a]/15 hover:shadow-sm"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#b6252a]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </LecturerDashboardShell>
  );
}

export function LecturerOwnResearchPage() {
  const searchParams = useSearchParams();
  const {
    isHydrated,
    currentLecturer,
    ownProjects,
    updateProjectStatus,
    inviteProjectMember,
    removeProjectMember,
  } = useLecturerDashboardState();
  const createResearch = useCreateResearch({
    lecturer: currentLecturer,
    onSuccess: () => setIsCreateOpen(false),
  });
  const { deleteResearch } = useDeleteResearch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const editSectionRef = useRef<HTMLDivElement | null>(null);
  const [inviteEmailByProject, setInviteEmailByProject] = useState<
    Record<string, string>
  >({});
  const [teamFeedbackByProject, setTeamFeedbackByProject] = useState<
    Record<string, { type: "success" | "error"; message: string }>
  >({});

  useEffect(() => {
    if (searchParams.get("compose") === "create") {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const editingProject = useMemo(
    () =>
      ownProjects.find((project) => project.id === editingProjectId) ?? null,
    [editingProjectId, ownProjects],
  );
  const updateResearch = useUpdateResearch(editingProject, {
    onSuccess: () => setEditingProjectId(null),
  });

  useEffect(() => {
    if (!editingProject || !editSectionRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      editSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [editingProject]);

  if (!isHydrated || !currentLecturer) {
    return <DashboardLoadingState />;
  }

  return (
    <LecturerDashboardShell
      title="Riset Saya"
      description="Semua create, detail, update, status, dan delete campaign Anda sekarang dipusatkan di halaman ini."
    >
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Pusat CRUD Campaign
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Tambah campaign baru, edit campaign lama, buka detail riset,
                ubah status, dan hapus campaign dari satu halaman.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen((current) => !current);
                setEditingProjectId(null);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(182,37,42,0.9)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <PlusCircle className="size-4" />
              {isCreateOpen ? "Tutup Form" : "Tambah Riset Baru"}
            </button>
          </div>

          {isCreateOpen && (
            <div className="mt-6 rounded-[1.75rem] border border-[#b6252a]/10 bg-[#fffaf9] p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Tambah Campaign Baru
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Campaign baru akan langsung terhubung ke akun dosen aktif dan
                muncul di daftar Riset Saya.
              </p>
              <div className="mt-6">
                <CreateProjectForm
                  key="create-research-form"
                  initialValues={createResearch.initialValues}
                  validationSchema={createResearch.validationSchema}
                  onSubmit={createResearch.onSubmit}
                  sdgOptions={createResearch.sdgOptions}
                  isSubmitted={createResearch.isSubmitted}
                  lockLecturerIdentity
                  submitLabel="Publikasikan Campaign"
                  successMessage="Campaign berhasil dipublikasikan dan sekarang tampil di daftar Riset Saya."
                />
              </div>
            </div>
          )}

          {editingProject && (
            <div
              ref={editSectionRef}
              className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50/60 p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Edit Campaign
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Anda sedang mengedit {editingProject.title}. Simpan
                    perubahan agar profil riset ikut diperbarui.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProjectId(null)}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                >
                  Batal Edit
                </button>
              </div>
              <div className="mt-6">
                <CreateProjectForm
                  key={editingProject.id}
                  initialValues={updateResearch.initialValues}
                  validationSchema={updateResearch.validationSchema}
                  onSubmit={updateResearch.onSubmit}
                  sdgOptions={updateResearch.sdgOptions}
                  isSubmitted={updateResearch.isSubmitted}
                  lockLecturerIdentity
                  submitLabel="Simpan Perubahan"
                  successMessage="Perubahan campaign berhasil disimpan."
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Daftar Campaign Saya
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Semua campaign riset yang dibuat oleh akun {currentLecturer.id}{" "}
            ditampilkan di sini.
          </p>

          <div className="mt-6 space-y-4">
            {ownProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
                <PlusCircle className="mx-auto size-8 text-gray-300" />
                <p className="mt-4 text-sm font-medium text-gray-500">
                  Belum ada project. Gunakan tombol Tambah Riset Baru untuk
                  membuat campaign pertama Anda.
                </p>
              </div>
            ) : (
              ownProjects.map((project) => {
                const remainingSlots = Math.max(
                  project.teamSlots - project.filledSlots,
                  0,
                );
                const nextStatus =
                  project.status === "closed" ? "open" : "closed";
                const inviteEmail = inviteEmailByProject[project.id] ?? "";
                const teamFeedback = teamFeedbackByProject[project.id];

                return (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-gray-100 bg-[linear-gradient(180deg,#fff_0%,#fcfcfc_100%)] p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-[#fff1f1] px-2.5 py-1 text-xs font-semibold text-[#b6252a]">
                            {project.sdgCategory}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[project.status]}`}
                          >
                            {STATUS_LABELS[project.status]}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-gray-900">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {project.description}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                        {project.filledSlots} / {project.teamSlots} slot terisi
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-black/6 bg-white px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                          Tanggal Publikasi
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-800">
                          {formatDate(project.createdAt)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-black/6 bg-white px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                          Slot Terisi
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-800">
                          {project.filledSlots} / {project.teamSlots}
                        </div>
                      </div>
                      <div className="rounded-xl border border-black/6 bg-white px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                          Slot Tersisa
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-800">
                          {remainingSlots} mahasiswa
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            Anggota Tim Saat Ini
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            Kelola anggota tim langsung dari daftar campaign.
                          </p>
                        </div>
                        <span className="rounded-full border border-[#b6252a]/15 bg-[#fff7f7] px-3 py-1 text-xs font-semibold text-[#8f1a20]">
                          {project.teamMembers.length}/{project.teamSlots}{" "}
                          anggota
                        </span>
                      </div>

                      {project.teamMembers.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                          Belum ada anggota tim. Tambahkan lewat undangan email.
                        </div>
                      ) : (
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {project.teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {member.name}
                                  </div>
                                  <div className="mt-0.5 break-all text-xs text-gray-500">
                                    {member.email}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Keluarkan ${member.name} dari tim?`,
                                      )
                                    ) {
                                      const result = removeProjectMember(
                                        project.id,
                                        member.id,
                                      );
                                      setTeamFeedbackByProject((prev) => ({
                                        ...prev,
                                        [project.id]: {
                                          type: result.ok ? "success" : "error",
                                          message: result.message,
                                        },
                                      }));
                                    }
                                  }}
                                  className="inline-flex h-8 shrink-0 items-center justify-center self-start whitespace-nowrap rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                >
                                  Kick
                                </button>
                              </div>
                              <div className="mt-3 text-xs text-gray-600">
                                {member.role} • Fokus: {member.focus}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <form
                        className="mt-4 flex flex-col gap-2 sm:flex-row"
                        onSubmit={(event) => {
                          event.preventDefault();
                          const result = inviteProjectMember(
                            project.id,
                            inviteEmail,
                          );
                          setTeamFeedbackByProject((prev) => ({
                            ...prev,
                            [project.id]: {
                              type: result.ok ? "success" : "error",
                              message: result.message,
                            },
                          }));

                          if (result.ok) {
                            setInviteEmailByProject((prev) => ({
                              ...prev,
                              [project.id]: "",
                            }));
                          }
                        }}
                      >
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(event) =>
                            setInviteEmailByProject((prev) => ({
                              ...prev,
                              [project.id]: event.target.value,
                            }))
                          }
                          placeholder="Invite anggota via email"
                          className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#b6252a]/30"
                        />
                        <button
                          type="submit"
                          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-[#b6252a]/25 bg-[#fff3f3] px-4 text-sm font-semibold text-[#8f1a20] transition hover:bg-[#ffe9e9]"
                        >
                          Invite
                        </button>
                      </form>

                      {teamFeedback ? (
                        <p
                          className={`mt-2 text-xs font-medium ${
                            teamFeedback.type === "success"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {teamFeedback.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                      <Link
                        href={`/sdgs-hub/riset/dashboard/saya/${project.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                      >
                        <Eye className="size-4" />
                        Detail Riset
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProjectId(project.id);
                          setIsCreateOpen(false);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                      >
                        <PenSquare className="size-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateProjectStatus(project.id, nextStatus)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                      >
                        {project.status === "closed"
                          ? "Buka Lagi"
                          : "Tutup Pendaftaran"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Hapus campaign \"${project.title}\"?`,
                            )
                          ) {
                            deleteResearch(project.id);
                            if (editingProjectId === project.id) {
                              setEditingProjectId(null);
                            }
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 className="size-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </LecturerDashboardShell>
  );
}

export function LecturerResearchDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isHydrated,
    currentLecturer,
    ownProjects,
    studentApplications,
    students,
  } = useLecturerDashboardState();
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null,
  );

  const project = useMemo(
    () => ownProjects.find((item) => item.slug === slug) ?? null,
    [ownProjects, slug],
  );
  const projectApplicants = useMemo(() => {
    if (!project) {
      return [];
    }

    const studentLookup = new Map(
      students.map((student) => [student.email.toLowerCase(), student]),
    );

    return studentApplications
      .filter((application) => application.projectSlug === project.slug)
      .sort((left, right) => {
        const leftTime = Date.parse(
          left.statusUpdatedAt ?? left.requestedAt ?? "",
        );
        const rightTime = Date.parse(
          right.statusUpdatedAt ?? right.requestedAt ?? "",
        );

        return rightTime - leftTime;
      })
      .map((application) => ({
        application,
        student: studentLookup.get(application.studentEmail.toLowerCase()) ?? null,
        statusMeta: getApplicationStatusMeta(application.status),
      }));
  }, [project, studentApplications, students]);
  const highlightedApplicantId = searchParams.get("applicant");

  useEffect(() => {
    if (projectApplicants.length === 0) {
      setSelectedApplicantId(null);
      return;
    }

    const nextSelectedId =
      highlightedApplicantId &&
      projectApplicants.some(
        ({ application }) => application.id === highlightedApplicantId,
      )
        ? highlightedApplicantId
        : selectedApplicantId &&
            projectApplicants.some(
              ({ application }) => application.id === selectedApplicantId,
            )
          ? selectedApplicantId
          : projectApplicants[0].application.id;

    if (nextSelectedId !== selectedApplicantId) {
      setSelectedApplicantId(nextSelectedId);
    }
  }, [highlightedApplicantId, projectApplicants, selectedApplicantId]);

  const selectedApplicant = useMemo(
    () =>
      projectApplicants.find(
        ({ application }) => application.id === selectedApplicantId,
      ) ?? null,
    [projectApplicants, selectedApplicantId],
  );

  useEffect(() => {
    if (isHydrated && currentLecturer && !project) {
      router.replace("/sdgs-hub/riset/dashboard/saya");
    }
  }, [currentLecturer, isHydrated, project, router]);

  if (!isHydrated || !currentLecturer || !project) {
    return <DashboardLoadingState />;
  }

  return (
    <LecturerDashboardShell
      title={project.title}
      description="Detail internal riset untuk dosen aktif, berisi profil riset, metadata campaign, dan gambaran anggota tim."
    >
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#fff1f1] px-2.5 py-1 text-xs font-semibold text-[#b6252a]">
                {project.sdgCategory}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[project.status]}`}
              >
                {STATUS_LABELS[project.status]}
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">
              Profil Riset
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {project.overview}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] p-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Challenge
                </div>
                <div className="mt-3 text-sm leading-relaxed text-gray-700">
                  {project.challenge}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] p-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Komitmen
                </div>
                <div className="mt-3 text-sm leading-relaxed text-gray-700">
                  {project.commitment}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Luaran Yang Diharapkan
                </h3>
                <div className="mt-4 space-y-3">
                  {project.deliverables.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-3 text-sm text-gray-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Kualifikasi Yang Dicari
                </h3>
                <div className="mt-4 space-y-3">
                  {project.requirements.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-3 text-sm text-gray-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Metadata Campaign
              </h3>
              <div className="mt-5 space-y-4 text-sm text-gray-600">
                <div className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Tanggal Publikasi
                  </div>
                  <div className="mt-2 font-semibold text-gray-900">
                    {formatDate(project.createdAt)}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Timeline
                  </div>
                  <div className="mt-2 font-semibold text-gray-900">
                    {project.timeline}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Lokasi
                  </div>
                  <div className="mt-2 font-semibold text-gray-900">
                    {project.location}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Kontak Dosen
                  </div>
                  <div className="mt-2 font-semibold text-gray-900">
                    {project.dosenPhone}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Statistik Tim
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-4 text-center">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Slot Total
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">
                    {project.teamSlots}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-4 text-center">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Terisi
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">
                    {project.filledSlots}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#fcfcfc] px-4 py-4 text-center">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Tersisa
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">
                    {Math.max(project.teamSlots - project.filledSlots, 0)}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  Notifikasi Pendaftar
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  Mahasiswa yang ingin masuk riset ini
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Pilih salah satu pendaftar untuk melihat catatan aplikasi dan
                  preview CV secara langsung.
                </p>
              </div>
              <Bell className="size-5 text-[#b6252a]" />
            </div>

            <div className="mt-6 space-y-4">
              {projectApplicants.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-[#fcfcfc] px-5 py-10 text-sm leading-7 text-gray-500">
                  Belum ada permintaan mahasiswa yang masuk ke penelitian ini.
                </div>
              ) : (
                projectApplicants.map(({ application, student, statusMeta }) => (
                  <button
                    key={application.id}
                    type="button"
                    onClick={() => setSelectedApplicantId(application.id)}
                    className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                      selectedApplicantId === application.id
                        ? "border-[#b6252a]/20 bg-[linear-gradient(180deg,#fff6f6_0%,#ffffff_100%)] shadow-[0_18px_48px_-36px_rgba(182,37,42,0.32)]"
                        : "border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfc_100%)] hover:border-[#b6252a]/12"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {student?.name ?? application.studentEmail}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {student?.program ?? "Mahasiswa SDGs Hub"} •{" "}
                          {application.role}
                        </div>
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${statusMeta.badgeClassName}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {application.note}
                    </p>
                    <div className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                      Update {formatPortalDate(application.statusUpdatedAt ?? application.requestedAt)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  Detail Kandidat
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  Preview CV dan konteks aplikasi
                </h2>
              </div>
              <FileBadge2 className="size-5 text-[#b6252a]" />
            </div>

            {selectedApplicant ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[1.6rem] border border-black/6 bg-[#fcfcfc] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {selectedApplicant.student?.name ??
                            selectedApplicant.application.studentEmail}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {selectedApplicant.student?.program ??
                            "Mahasiswa SDGs Hub"}
                        </div>
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${selectedApplicant.statusMeta.badgeClassName}`}
                      >
                        {selectedApplicant.statusMeta.label}
                      </span>
                    </div>

                    <div className="mt-5 space-y-3 text-sm text-gray-600">
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                          Email
                        </div>
                        <div className="mt-2 font-semibold text-gray-900">
                          {selectedApplicant.student?.email ??
                            selectedApplicant.application.studentEmail}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                          Fakultas / Program
                        </div>
                        <div className="mt-2 font-semibold text-gray-900">
                          {selectedApplicant.student
                            ? `${selectedApplicant.student.faculty} • ${selectedApplicant.student.program}`
                            : "Profil mahasiswa belum tersedia"}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                          Peran yang diajukan
                        </div>
                        <div className="mt-2 font-semibold text-gray-900">
                          {selectedApplicant.application.role}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[1.3rem] border border-[#b6252a]/10 bg-[#fff9f9] p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#b6252a]">
                        <Users className="size-4" />
                        Catatan aplikasi
                      </div>
                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        {selectedApplicant.application.note}
                      </p>
                    </div>

                    {selectedApplicant.student?.skills?.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {selectedApplicant.student.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-[#b6252a]/10 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-[1.6rem] border border-black/6 bg-[#fcfcfc] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Preview CV Mahasiswa
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {selectedApplicant.student?.cvAttachment
                            ? selectedApplicant.student.cvAttachment.fileName
                            : selectedApplicant.application.cvFileName}
                        </div>
                      </div>
                      {selectedApplicant.student?.cvAttachment ? (
                        <a
                          href={selectedApplicant.student.cvAttachment.dataUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                        >
                          Buka CV
                          <Eye className="size-4" />
                        </a>
                      ) : null}
                    </div>

                    {selectedApplicant.student?.cvAttachment ? (
                      <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-black/8 bg-white">
                        <iframe
                          src={selectedApplicant.student.cvAttachment.dataUrl}
                          title={`CV ${selectedApplicant.student.name}`}
                          className="h-[28rem] w-full"
                        />
                      </div>
                    ) : (
                      <div className="mt-5 rounded-[1.4rem] border border-dashed border-amber-200 bg-amber-50/70 px-5 py-10 text-sm leading-7 text-amber-900/80">
                        CV mock untuk pendaftar ini belum tersedia.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-gray-200 bg-[#fcfcfc] px-5 py-10 text-sm leading-7 text-gray-500">
                Pilih pendaftar dari panel kiri untuk membuka detail aplikasi
                dan CV mahasiswa.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Anggota Tim Saat Ini
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Daftar mahasiswa yang saat ini sudah terhubung dengan campaign
                ini.
              </p>
            </div>
            <Link
              href="/sdgs-hub/riset/dashboard/saya"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
            >
              Kembali ke Riset Saya
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {project.teamMembers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center md:col-span-2 xl:col-span-3">
                <p className="text-sm font-medium text-gray-500">
                  Belum ada anggota tim aktif pada campaign ini.
                </p>
              </div>
            ) : (
              project.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-gray-100 bg-[#fcfcfc] p-5"
                >
                  <div className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {member.role}
                  </div>
                  <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                    Fokus kontribusi: {member.focus}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </LecturerDashboardShell>
  );
}

export function LecturerProfilePage() {
  const { isHydrated, currentLecturer, ownProjects, activeProjects } =
    useLecturerDashboardState();

  if (!isHydrated || !currentLecturer) {
    return <DashboardLoadingState />;
  }

  return (
    <LecturerDashboardShell
      title="Profile Dosen"
      description="Semua identitas akun dosen aktif diletakkan di halaman ini, termasuk NIP, nama lengkap, dan foto profil."
    >
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
          <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-[2rem] border border-[#b6252a]/10 bg-[#fff7f7]">
            <Image
              src={currentLecturer.avatarUrl}
              alt={currentLecturer.name}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>

          <div className="mt-6 text-center">
            <div className="text-2xl font-semibold tracking-tight text-gray-900">
              {currentLecturer.name}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {currentLecturer.position}
            </div>
            <div className="mt-3 inline-flex rounded-full border border-[#b6252a]/10 bg-[#fff7f7] px-4 py-1.5 text-sm font-medium text-[#8f1a20]">
              {currentLecturer.faculty}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Identitas Utama
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  NIP
                </div>
                <div className="mt-3 text-lg font-semibold text-gray-900">
                  {currentLecturer.nip}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  ID Login
                </div>
                <div className="mt-3 text-lg font-semibold text-gray-900">
                  {currentLecturer.id}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5 md:col-span-2">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Nama Lengkap
                </div>
                <div className="mt-3 text-lg font-semibold text-gray-900">
                  {currentLecturer.name}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Informasi Akademik
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Email
                </div>
                <div className="mt-3 text-sm font-semibold text-gray-900">
                  {currentLecturer.email}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  No. WhatsApp
                </div>
                <div className="mt-3 text-sm font-semibold text-gray-900">
                  {currentLecturer.phone}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Fakultas
                </div>
                <div className="mt-3 text-sm font-semibold text-gray-900">
                  {currentLecturer.faculty}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Jabatan
                </div>
                <div className="mt-3 text-sm font-semibold text-gray-900">
                  {currentLecturer.position}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Ringkasan Aktivitas
            </h2>
            <div className="mt-4 text-sm leading-relaxed text-gray-600">
              {currentLecturer.tagline}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Total Campaign
                </div>
                <div className="mt-3 text-3xl font-semibold text-gray-900">
                  {ownProjects.length}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-5 py-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Campaign Aktif
                </div>
                <div className="mt-3 text-3xl font-semibold text-gray-900">
                  {activeProjects}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {currentLecturer.expertise.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#b6252a]/10 bg-[#fff9f9] px-3 py-1.5 text-sm font-medium text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LecturerDashboardShell>
  );
}
