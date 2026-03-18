"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  KeyRound,
  LibraryBig,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DEMO_LECTURER_PASSWORD,
  DEMO_STUDENT_PASSWORD,
  LECTURER_ACCOUNTS,
  STUDENT_ACCOUNTS,
  useLecturerPortal,
} from "@/hooks/useLecturerPortal";

type LoginRole = "mahasiswa" | "dosen";
type AuthMode = "login" | "register";
type FeedbackTone = "error" | "success";

type StudentRegisterFormState = {
  name: string;
  nim: string;
  email: string;
  faculty: string;
  program: string;
  batch: string;
  password: string;
  confirmPassword: string;
};

type LecturerRegisterFormState = {
  name: string;
  email: string;
  faculty: string;
  position: string;
  nip: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const STUDENT_REGISTER_INITIAL: StudentRegisterFormState = {
  name: "",
  nim: "",
  email: "",
  faculty: "",
  program: "",
  batch: "",
  password: "",
  confirmPassword: "",
};

const LECTURER_REGISTER_INITIAL: LecturerRegisterFormState = {
  name: "",
  email: "",
  faculty: "",
  position: "",
  nip: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const ROLE_CONFIG = {
  mahasiswa: {
    icon: GraduationCap,
    badge: "Portal Mahasiswa",
    pageBackground:
      "bg-[radial-gradient(circle_at_top_left,rgba(30,167,182,0.2),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(252,195,11,0.18),transparent_30%),linear-gradient(180deg,#f4fbff_0%,#ffffff_50%,#fffaf1_100%)]",
    heroBackground:
      "bg-[linear-gradient(150deg,#083d67_0%,#0f5e8a_44%,#1a8d96_100%)]",
    accentSurface:
      "border-[#1570a6]/12 shadow-[0_32px_96px_-50px_rgba(11,66,109,0.62)]",
    accentSoft: "bg-[#eaf6fc] text-[#1570a6]",
    toggleActive:
      "bg-[linear-gradient(135deg,#0f4c81_0%,#1570a6_58%,#1ea7b6_100%)] text-white shadow-[0_18px_36px_-20px_rgba(21,112,166,0.7)]",
    toggleIdle: "bg-white/70 text-slate-600 hover:bg-[#eef7fb]",
    inputFocus:
      "focus:border-[#1570a6]/45 focus:ring-4 focus:ring-[#1570a6]/10",
    submitButton:
      "bg-[linear-gradient(135deg,#0f4c81_0%,#1570a6_58%,#1ea7b6_100%)] text-white shadow-[0_18px_36px_-20px_rgba(21,112,166,0.78)] hover:-translate-y-0.5 hover:brightness-105",
    feedback: "border-amber-200 bg-amber-50 text-amber-700",
    loginTitle: "Masuk sebagai mahasiswa",
    registerTitle: "Register account mahasiswa",
    loginDescription:
      "Gunakan email kampus dan password untuk masuk ke profil, ide, inovasi, dan pipeline riset.",
    registerDescription:
      "Bikin akun mahasiswa yang siap dipakai untuk eksplorasi riset dan menyimpan profil kampusmu.",
    heroLoginHeading:
      "Login mahasiswa sekarang cukup email kampus dan password.",
    heroRegisterHeading:
      "Buat akun mahasiswa yang langsung siap dipakai di SDGs Hub.",
    heroLoginCopy:
      "Flow login sekarang dibuat lebih ringkas supaya mahasiswa bisa langsung fokus ke eksplorasi riset, pengisian profil, dan pengiriman kontribusi tanpa langkah tambahan.",
    heroRegisterCopy:
      "Setelah register, akun mahasiswa langsung aktif dan bisa dipakai untuk menyimpan identitas kampus, membangun portofolio awal, dan lanjut ke flow riset yang relevan.",
    benefits: [
      "Masuk lebih cepat dengan email kampus resmi.",
      "Profil mahasiswa langsung tersambung ke fitur ide, inovasi, dan riset.",
      "CTA register dibuat eksplisit supaya onboarding akun baru lebih jelas.",
    ],
    registerChecklist: [
      "Profil awal mahasiswa langsung dibuat otomatis.",
      "Akun bisa lanjut ke halaman profil pribadi setelah submit.",
      "Field register disusun singkat agar tetap cepat di mobile.",
    ],
    emailHint: "Gunakan email `@student.telkomuniversity.ac.id`.",
    demoPassword: DEMO_STUDENT_PASSWORD,
  },
  dosen: {
    icon: KeyRound,
    badge: "Portal Dosen",
    pageBackground:
      "bg-[radial-gradient(circle_at_top_left,rgba(237,30,40,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(143,26,32,0.14),transparent_26%),linear-gradient(180deg,#fff8f8_0%,#ffffff_54%,#fff6ef_100%)]",
    heroBackground:
      "bg-[linear-gradient(150deg,#5b1014_0%,#8f1a20_42%,#d23639_100%)]",
    accentSurface:
      "border-[#b6252a]/12 shadow-[0_32px_96px_-50px_rgba(143,26,32,0.58)]",
    accentSoft: "bg-[#fff1f1] text-[#b6252a]",
    toggleActive:
      "bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] text-white shadow-[0_18px_36px_-20px_rgba(182,37,42,0.7)]",
    toggleIdle: "bg-white/70 text-slate-600 hover:bg-[#fff3f3]",
    inputFocus:
      "focus:border-[#b6252a]/45 focus:ring-4 focus:ring-[#b6252a]/10",
    submitButton:
      "bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] text-white shadow-[0_18px_36px_-20px_rgba(182,37,42,0.78)] hover:-translate-y-0.5 hover:brightness-105",
    feedback: "border-red-200 bg-red-50 text-red-600",
    loginTitle: "Masuk sebagai dosen",
    registerTitle: "Register account dosen",
    loginDescription:
      "Gunakan email institusi dan password untuk membuka dashboard campaign riset pribadi.",
    registerDescription:
      "Daftarkan akun dosen baru untuk mengaktifkan workspace riset, profil, dan campaign Anda.",
    heroLoginHeading:
      "Portal dosen kini login lewat email institusi dan password.",
    heroRegisterHeading:
      "Aktifkan akun dosen baru tanpa bergantung ke ID login lama.",
    heroLoginCopy:
      "Dosen sekarang masuk lewat kredensial yang lebih familiar supaya akses ke dashboard, campaign, dan review mahasiswa terasa lebih natural.",
    heroRegisterCopy:
      "Form register dosen dirancang untuk langsung menghasilkan profil akun baru lengkap dengan identitas dasar, posisi, dan akses ke dashboard pribadi.",
    benefits: [
      "Akses dashboard dosen lewat email institusi yang konsisten.",
      "Register dosen langsung membuat workspace riset personal.",
      "CTA login/register dipisah jelas supaya alur lebih mudah dipahami.",
    ],
    registerChecklist: [
      "Profil dosen langsung dibuat dengan NIP dan posisi akademik.",
      "Akun baru otomatis diarahkan ke dashboard setelah register.",
      "Struktur form tetap ringkas walau data identitas lebih lengkap.",
    ],
    emailHint: "Gunakan email `@telkomuniversity.ac.id`.",
    demoPassword: DEMO_LECTURER_PASSWORD,
  },
} as const;

export function LecturerLoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentLecturer,
    currentStudent,
    isHydrated,
    loginLecturer,
    loginStudent,
    registerLecturer,
    registerStudent,
  } = useLecturerPortal();
  const [activeRole, setActiveRole] = useState<LoginRole>("mahasiswa");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [studentRegisterForm, setStudentRegisterForm] = useState(
    STUDENT_REGISTER_INITIAL,
  );
  const [lecturerRegisterForm, setLecturerRegisterForm] = useState(
    LECTURER_REGISTER_INITIAL,
  );
  const [feedback, setFeedback] = useState<{
    tone: FeedbackTone;
    message: string;
  } | null>(null);

  useEffect(() => {
    const role = searchParams.get("role");
    const mode = searchParams.get("mode");

    if (role === "mahasiswa" || role === "dosen") {
      setActiveRole(role);
    }

    if (mode === "login" || mode === "register") {
      setAuthMode(mode);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (currentLecturer) {
      router.replace("/sdgs-hub/riset/dashboard");
      return;
    }

    if (currentStudent) {
      router.replace("/sdgs-hub/profil-saya");
    }
  }, [currentLecturer, currentStudent, isHydrated, router]);

  const roleConfig = ROLE_CONFIG[activeRole];
  const RoleIcon = roleConfig.icon;

  const demoAccounts = useMemo(
    () =>
      activeRole === "mahasiswa"
        ? STUDENT_ACCOUNTS.slice(0, 3).map((student) => ({
            title: student.name,
            email: student.email,
            meta: `${student.program} • NIM ${student.nim}`,
            password: DEMO_STUDENT_PASSWORD,
          }))
        : LECTURER_ACCOUNTS.slice(0, 3).map((lecturer) => ({
            title: lecturer.name,
            email: lecturer.email,
            meta: `${lecturer.faculty} • ${lecturer.position}`,
            password: DEMO_LECTURER_PASSWORD,
          })),
    [activeRole],
  );

  const inputClass = `w-full rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.3)] transition placeholder:text-slate-400 focus:outline-none ${roleConfig.inputFocus}`;
  const mutedButtonClass =
    "rounded-2xl border border-black/6 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-black/10 hover:bg-white";

  const clearFeedback = () => setFeedback(null);

  const handleRoleChange = (role: LoginRole) => {
    setActiveRole(role);
    setAuthMode("login");
    setLoginEmail("");
    setLoginPassword("");
    clearFeedback();
  };

  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    clearFeedback();
  };

  const handleDemoFill = (email: string, password: string) => {
    setAuthMode("login");
    setLoginEmail(email);
    setLoginPassword(password);
    clearFeedback();
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result =
      activeRole === "mahasiswa"
        ? loginStudent({ email: loginEmail, password: loginPassword })
        : loginLecturer({ email: loginEmail, password: loginPassword });

    if (!result.success) {
      setFeedback({
        tone: "error",
        message: result.message ?? "Login tidak dapat diproses.",
      });
      return;
    }

    setFeedback(null);
    router.push(
      activeRole === "mahasiswa"
        ? "/sdgs-hub/profil-saya"
        : "/sdgs-hub/riset/dashboard",
    );
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeRole === "mahasiswa") {
      if (
        studentRegisterForm.password.trim() !==
        studentRegisterForm.confirmPassword.trim()
      ) {
        setFeedback({
          tone: "error",
          message: "Konfirmasi password mahasiswa belum cocok.",
        });
        return;
      }

      const result = registerStudent({
        name: studentRegisterForm.name,
        nim: studentRegisterForm.nim,
        email: studentRegisterForm.email,
        faculty: studentRegisterForm.faculty,
        program: studentRegisterForm.program,
        batch: studentRegisterForm.batch,
        password: studentRegisterForm.password,
      });

      if (!result.success) {
        setFeedback({
          tone: "error",
          message: result.message ?? "Register mahasiswa gagal diproses.",
        });
        return;
      }

      setFeedback({
        tone: "success",
        message: "Akun mahasiswa berhasil dibuat. Mengarahkan ke profil...",
      });
      router.push("/sdgs-hub/profil-saya");
      return;
    }

    if (
      lecturerRegisterForm.password.trim() !==
      lecturerRegisterForm.confirmPassword.trim()
    ) {
      setFeedback({
        tone: "error",
        message: "Konfirmasi password dosen belum cocok.",
      });
      return;
    }

    const result = registerLecturer({
      name: lecturerRegisterForm.name,
      email: lecturerRegisterForm.email,
      faculty: lecturerRegisterForm.faculty,
      position: lecturerRegisterForm.position,
      nip: lecturerRegisterForm.nip,
      phone: lecturerRegisterForm.phone,
      password: lecturerRegisterForm.password,
    });

    if (!result.success) {
      setFeedback({
        tone: "error",
        message: result.message ?? "Register dosen gagal diproses.",
      });
      return;
    }

    setFeedback({
      tone: "success",
      message: "Akun dosen berhasil dibuat. Mengarahkan ke dashboard...",
    });
    router.push("/sdgs-hub/riset/dashboard");
  };

  return (
    <section
      className={`relative min-h-screen overflow-hidden pt-28 pb-16 transition-colors duration-300 ${roleConfig.pageBackground}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-10 h-52 w-52 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[-4rem] top-28 h-56 w-56 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-white/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-4xl rounded-[2rem] border border-black/8 bg-white/80 p-3 shadow-[0_26px_80px_-46px_rgba(15,23,42,0.3)] backdrop-blur"
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleRoleChange("mahasiswa")}
                aria-pressed={activeRole === "mahasiswa"}
                className={`inline-flex items-center justify-center gap-2 rounded-[1.25rem] px-5 py-3 text-sm font-semibold transition ${activeRole === "mahasiswa" ? ROLE_CONFIG.mahasiswa.toggleActive : roleConfig.toggleIdle}`}
              >
                <GraduationCap className="size-4" />
                Login Mahasiswa
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("dosen")}
                aria-pressed={activeRole === "dosen"}
                className={`inline-flex items-center justify-center gap-2 rounded-[1.25rem] px-5 py-3 text-sm font-semibold transition ${activeRole === "dosen" ? ROLE_CONFIG.dosen.toggleActive : roleConfig.toggleIdle}`}
              >
                <KeyRound className="size-4" />
                Login Dosen
              </button>
            </div>

            {/* <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                aria-pressed={authMode === "login"}
                className={`rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition ${authMode === "login" ? roleConfig.accentSoft : mutedButtonClass}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("register")}
                aria-pressed={authMode === "register"}
                className={`rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition ${authMode === "register" ? roleConfig.accentSoft : mutedButtonClass}`}
              >
                Register
              </button>
            </div> */}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.06fr_0.94fr] xl:items-start">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`overflow-hidden rounded-[2.5rem] border border-white/10 ${roleConfig.heroBackground} p-8 text-white ${roleConfig.accentSurface}`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
              <RoleIcon className="size-3.5" />
              {roleConfig.badge}
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl md:leading-tight">
              {authMode === "login"
                ? roleConfig.heroLoginHeading
                : roleConfig.heroRegisterHeading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80">
              {authMode === "login"
                ? roleConfig.heroLoginCopy
                : roleConfig.heroRegisterCopy}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {roleConfig.benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-white/12 bg-white/10 px-4 py-4 text-sm leading-relaxed text-white/88 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
              {authMode === "login" ? (
                <>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <BadgeCheck className="size-4 text-white/90" />
                    Demo account siap pakai
                  </div>
                  <div className="mt-4 space-y-3">
                    {demoAccounts.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() =>
                          handleDemoFill(account.email, account.password)
                        }
                        className="flex w-full items-start justify-between gap-4 rounded-[1.3rem] border border-white/12 bg-white/10 px-4 py-4 text-left transition hover:bg-white/14"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {account.title}
                          </div>
                          <div className="mt-1 text-sm text-white/72">
                            {account.email}
                          </div>
                          <div className="mt-1 text-xs text-white/64">
                            {account.meta}
                          </div>
                        </div>
                        <div className="rounded-full border border-white/15 bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                          Autofill
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-[1.2rem] border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/78">
                    <ShieldCheck className="size-4 shrink-0" />
                    Password demo:{" "}
                    <span className="font-semibold text-white">
                      {roleConfig.demoPassword}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Sparkles className="size-4 text-white/90" />
                    Sesudah register
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {roleConfig.registerChecklist.map((item, index) => {
                      const Icon =
                        index === 0
                          ? LibraryBig
                          : index === 1
                            ? BookOpen
                            : ShieldCheck;

                      return (
                        <div
                          key={item}
                          className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4"
                        >
                          <div className="flex size-10 items-center justify-center rounded-2xl bg-white/12 text-white">
                            <Icon className="size-4" />
                          </div>
                          <div className="mt-4 text-sm leading-relaxed text-white/86">
                            {item}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="rounded-[2.25rem] border border-black/8 bg-white/92 p-6 shadow-[0_30px_90px_-54px_rgba(15,23,42,0.26)] backdrop-blur sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-[1.2rem] ${roleConfig.accentSoft}`}
              >
                <RoleIcon className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/6 bg-[#fafafa] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {authMode === "login" ? "Secure Access" : "New Account"}
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  {authMode === "login"
                    ? roleConfig.loginTitle
                    : roleConfig.registerTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {authMode === "login"
                    ? roleConfig.loginDescription
                    : roleConfig.registerDescription}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeRole}-${authMode}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                {authMode === "login" ? (
                  <form className="mt-8 space-y-4" onSubmit={handleLoginSubmit}>
                    <div>
                      <label
                        htmlFor={`${activeRole}-login-email`}
                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                      >
                        Email
                      </label>
                      <input
                        id={`${activeRole}-login-email`}
                        type="email"
                        autoComplete="email"
                        value={loginEmail}
                        onChange={(event) => setLoginEmail(event.target.value)}
                        placeholder={
                          activeRole === "mahasiswa"
                            ? "nama@student.telkomuniversity.ac.id"
                            : "nama@telkomuniversity.ac.id"
                        }
                        className={inputClass}
                        aria-describedby={`${activeRole}-email-hint`}
                        required
                      />
                      <p
                        id={`${activeRole}-email-hint`}
                        className="mt-1.5 text-xs text-slate-500"
                      >
                        {roleConfig.emailHint}
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor={`${activeRole}-login-password`}
                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>
                      <input
                        id={`${activeRole}-login-password`}
                        type="password"
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(event) =>
                          setLoginPassword(event.target.value)
                        }
                        placeholder="Masukkan password akun"
                        className={inputClass}
                        required
                      />
                    </div>

                    {feedback && (
                      <div
                        role={feedback.tone === "error" ? "alert" : "status"}
                        aria-live="polite"
                        className={`rounded-[1.25rem] border px-4 py-3 text-sm font-medium ${
                          feedback.tone === "error"
                            ? roleConfig.feedback
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {feedback.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isHydrated}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-[1.25rem] px-6 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${roleConfig.submitButton}`}
                    >
                      {activeRole === "mahasiswa"
                        ? "Masuk ke Profil Mahasiswa"
                        : "Masuk ke Dashboard Dosen"}
                      <ArrowRight className="size-4" />
                    </button>
                  </form>
                ) : (
                  <form
                    className="mt-8 space-y-4"
                    onSubmit={handleRegisterSubmit}
                  >
                    {activeRole === "mahasiswa" ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="student-register-name"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Nama lengkap
                            </label>
                            <input
                              id="student-register-name"
                              type="text"
                              autoComplete="name"
                              value={studentRegisterForm.name}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  name: event.target.value,
                                }))
                              }
                              placeholder="Nama mahasiswa"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="student-register-nim"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              NIM
                            </label>
                            <input
                              id="student-register-nim"
                              type="text"
                              inputMode="numeric"
                              value={studentRegisterForm.nim}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  nim: event.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10),
                                }))
                              }
                              placeholder="1101234567"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="student-register-batch"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Angkatan
                            </label>
                            <input
                              id="student-register-batch"
                              type="text"
                              inputMode="numeric"
                              value={studentRegisterForm.batch}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  batch: event.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 4),
                                }))
                              }
                              placeholder="2024"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="student-register-email"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Email mahasiswa
                            </label>
                            <input
                              id="student-register-email"
                              type="email"
                              autoComplete="email"
                              value={studentRegisterForm.email}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  email: event.target.value,
                                }))
                              }
                              placeholder="nama@student.telkomuniversity.ac.id"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="student-register-faculty"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Fakultas
                            </label>
                            <input
                              id="student-register-faculty"
                              type="text"
                              value={studentRegisterForm.faculty}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  faculty: event.target.value,
                                }))
                              }
                              placeholder="Fakultas Informatika"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="student-register-program"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Program studi
                            </label>
                            <input
                              id="student-register-program"
                              type="text"
                              value={studentRegisterForm.program}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  program: event.target.value,
                                }))
                              }
                              placeholder="S1 Sistem Informasi"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="student-register-password"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Password
                            </label>
                            <input
                              id="student-register-password"
                              type="password"
                              autoComplete="new-password"
                              minLength={8}
                              value={studentRegisterForm.password}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  password: event.target.value,
                                }))
                              }
                              placeholder="Minimal 8 karakter"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="student-register-confirm-password"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Konfirmasi password
                            </label>
                            <input
                              id="student-register-confirm-password"
                              type="password"
                              autoComplete="new-password"
                              minLength={8}
                              value={studentRegisterForm.confirmPassword}
                              onChange={(event) =>
                                setStudentRegisterForm((prev) => ({
                                  ...prev,
                                  confirmPassword: event.target.value,
                                }))
                              }
                              placeholder="Ulangi password"
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="lecturer-register-name"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Nama lengkap
                            </label>
                            <input
                              id="lecturer-register-name"
                              type="text"
                              autoComplete="name"
                              value={lecturerRegisterForm.name}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  name: event.target.value,
                                }))
                              }
                              placeholder="Nama dosen"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="lecturer-register-email"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Email institusi
                            </label>
                            <input
                              id="lecturer-register-email"
                              type="email"
                              autoComplete="email"
                              value={lecturerRegisterForm.email}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  email: event.target.value,
                                }))
                              }
                              placeholder="nama@telkomuniversity.ac.id"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lecturer-register-faculty"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Fakultas
                            </label>
                            <input
                              id="lecturer-register-faculty"
                              type="text"
                              value={lecturerRegisterForm.faculty}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  faculty: event.target.value,
                                }))
                              }
                              placeholder="Fakultas Rekayasa Industri"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lecturer-register-position"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Posisi / jabatan
                            </label>
                            <input
                              id="lecturer-register-position"
                              type="text"
                              value={lecturerRegisterForm.position}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  position: event.target.value,
                                }))
                              }
                              placeholder="Lektor"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lecturer-register-nip"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              NIP
                            </label>
                            <input
                              id="lecturer-register-nip"
                              type="text"
                              value={lecturerRegisterForm.nip}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  nip: event.target.value,
                                }))
                              }
                              placeholder="19780624 200312 2 002"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lecturer-register-phone"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Nomor kontak
                            </label>
                            <input
                              id="lecturer-register-phone"
                              type="tel"
                              autoComplete="tel"
                              value={lecturerRegisterForm.phone}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  phone: event.target.value,
                                }))
                              }
                              placeholder="081234567890"
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lecturer-register-password"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Password
                            </label>
                            <input
                              id="lecturer-register-password"
                              type="password"
                              autoComplete="new-password"
                              minLength={8}
                              value={lecturerRegisterForm.password}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  password: event.target.value,
                                }))
                              }
                              placeholder="Minimal 8 karakter"
                              className={inputClass}
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lecturer-register-confirm-password"
                              className="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                              Konfirmasi password
                            </label>
                            <input
                              id="lecturer-register-confirm-password"
                              type="password"
                              autoComplete="new-password"
                              minLength={8}
                              value={lecturerRegisterForm.confirmPassword}
                              onChange={(event) =>
                                setLecturerRegisterForm((prev) => ({
                                  ...prev,
                                  confirmPassword: event.target.value,
                                }))
                              }
                              placeholder="Ulangi password"
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {feedback && (
                      <div
                        role={feedback.tone === "error" ? "alert" : "status"}
                        aria-live="polite"
                        className={`rounded-[1.25rem] border px-4 py-3 text-sm font-medium ${
                          feedback.tone === "error"
                            ? roleConfig.feedback
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {feedback.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isHydrated}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-[1.25rem] px-6 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${roleConfig.submitButton}`}
                    >
                      {activeRole === "mahasiswa"
                        ? "Buat Akun Mahasiswa"
                        : "Buat Akun Dosen"}
                      <ArrowRight className="size-4" />
                    </button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 rounded-[1.6rem] border border-black/6 bg-[#fafafa] p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-[1.1rem] ${roleConfig.accentSoft}`}
                >
                  <UserPlus className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    {authMode === "login"
                      ? "Belum punya akun?"
                      : "Sudah punya akun?"}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {authMode === "login"
                      ? `Klik CTA register untuk membuat account ${activeRole} baru tanpa keluar dari halaman ini.`
                      : `Kalau account sudah siap, balik ke login dan masuk dengan email serta password yang baru dibuat.`}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleModeChange(
                        authMode === "login" ? "register" : "login",
                      )
                    }
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:opacity-70"
                  >
                    {authMode === "login"
                      ? "Register account"
                      : "Kembali ke login"}
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
