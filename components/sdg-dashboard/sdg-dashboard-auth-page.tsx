"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSdgDashboardRouteByRole,
  useSdgDashboardAuth,
} from "@/hooks/use-sdg-dashboard-auth";
import { cn } from "@/lib/utils";
import useLogin from "@/hooks/auth/use-login";
import useRegister from "@/hooks/auth/use-register";

type AuthMode = "login" | "register";
type FeedbackTone = "error" | "success";

const FORM_INPUT_CLASSNAME =
  "h-[54px] rounded-[20px] border-[#ecd6d8] bg-[#fffdfd] px-4 text-[15px] shadow-none placeholder:text-[#9d7f82] focus-visible:border-[#b6252a] focus-visible:ring-[#b6252a]/15";

function buildModeButtonClass(isActive: boolean) {
  return cn(
    "flex-1 rounded-full px-4 py-3 text-sm font-semibold transition",
    isActive
      ? "bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_52%,#d73a41_100%)] text-white shadow-[0_18px_40px_-24px_rgba(182,37,42,0.55)]"
      : "text-[#7e5a5d] hover:bg-[#fff2f3] hover:text-[#7d1318]",
  );
}

export function SdgDashboardAuthPage() {
  const router = useRouter();
  const { currentAccount, isHydrated } = useSdgDashboardAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [feedback, setFeedback] = useState<{
    tone: FeedbackTone;
    message: string;
  } | null>(null);
  const { formik: loginFormik, isPending: isLoginPending } = useLogin({
    onSuccess: (user) => {
      router.replace(getSdgDashboardRouteByRole(user.role));
    },
    onError: (message) => {
      setFeedback({
        tone: "error",
        message,
      });
    },
  });
  const { formik: registerFormik, isPending: isRegisterPending } = useRegister({
    onSuccess: (user) => {
      router.replace(getSdgDashboardRouteByRole(user.role));
    },
    onError: (message) => {
      setFeedback({
        tone: "error",
        message,
      });
    },
  });

  useEffect(() => {
    if (!isHydrated || !currentAccount) {
      return;
    }

    router.replace(getSdgDashboardRouteByRole(currentAccount.role));
  }, [currentAccount, isHydrated, router]);

  function clearFeedback() {
    setFeedback(null);
  }

  function handleModeChange(mode: AuthMode) {
    setAuthMode(mode);
    clearFeedback();
  }

  function handleLoginChange(event: ChangeEvent<HTMLInputElement>) {
    clearFeedback();
    loginFormik.handleChange(event);
  }

  function handleRegisterChange(event: ChangeEvent<HTMLInputElement>) {
    clearFeedback();
    registerFormik.handleChange(event);
  }

  if (isHydrated && currentAccount) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7f7_0%,#fff1f2_52%,#fbe5e7_100%)] px-4">
        <div className="rounded-[30px] border border-[#f0d7d9] bg-white/88 px-6 py-5 text-sm text-[#7e4b4f] shadow-[0_36px_90px_-56px_rgba(126,19,24,0.5)] backdrop-blur-xl">
          Menyiapkan workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(182,37,42,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(215,58,65,0.12),transparent_28%),linear-gradient(180deg,#fff9f9_0%,#fff4f4_44%,#fce8ea_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1380px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_500px] lg:px-8 lg:py-10">
        <section className="relative min-h-[560px] overflow-hidden rounded-[36px] border border-[#7b161b]/18 shadow-[0_48px_120px_-56px_rgba(126,19,24,0.72)]">
          <Image
            src="/sdgdashboard/bglagi.jpg"
            alt="Gedung Telkom University"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 60vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(95,10,15,0.2),rgba(108,13,18,0.62)_38%,rgba(63,8,13,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,214,173,0.16),transparent_28%)]" />
          <div className="absolute -left-16 bottom-24 h-48 w-48 rounded-full bg-[#ffb9bf]/18 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#ffd8b4]/14 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-2 py-2 pr-4 text-white shadow-[0_18px_44px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_18px_34px_-24px_rgba(0,0,0,0.5)] ring-1 ring-white/30">
                  <Image
                    src="/dcslogo.png"
                    alt="DCS Telkom University"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/72">
                    DCS Telkom University
                  </p>
                  <p className="text-sm font-semibold text-white">
                    SDGs Dashboard
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-white/14 bg-black/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82 backdrop-blur-md">
                Telkom University
              </span>
            </div>

            <div className="max-w-[620px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                Satu pintu akses
              </p>
              <h1 className="mt-5 max-w-[10ch] text-[3rem] font-semibold leading-[0.92] text-white sm:text-[3.8rem] lg:text-[4.9rem]">
                Masuk yang
                <span className="block font-[family-name:var(--font-instrument-serif)] italic text-[#ffd5d8]">
                  lebih resmi,
                </span>
                lebih rapi.
              </h1>
              <p className="mt-5 max-w-[34rem] text-[15px] leading-7 text-[#f4d9dc] sm:text-base">
                Internal lanjut ke area kerja internal. Akun baru langsung jadi
                pihak eksternal untuk portal mitra.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
              {/* <div className="grid gap-3 sm:grid-cols-2">
                {HERO_PANELS.map(({ icon: Icon, title, copy }) => (
                  <div
                    key={title}
                    className="rounded-[26px] border border-white/12 bg-white/8 p-4 text-white backdrop-blur-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-[#ffe4c8] ring-1 ring-white/14">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-semibold">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{copy}</p>
                  </div>
                ))}
              </div> */}

              {/* <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-black/15 p-2 backdrop-blur-md">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                  <Image
                    src="/sdgdashboard/tunc.webp"
                    alt="Lingkungan Telkom University"
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(58,6,10,0.5)_100%)]" />
                </div>

                <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-[20px] border border-white/12 bg-black/26 px-4 py-3 text-white backdrop-blur-md">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                    Kampus
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    Kolaborasi dari satu dashboard
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[34px] border border-[#f1d5d8] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,245,245,0.98))] p-5 shadow-[0_40px_110px_-62px_rgba(126,19,24,0.48)] backdrop-blur-xl sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26a6f]">
                  Akses akun
                </p>
                <h2 className="mt-3 text-[2rem] font-semibold leading-none text-[#6f1116]">
                  {authMode === "login" ? "Masuk" : "Buat akun"}
                </h2>
              </div>
            </div>

            <div className="mt-6 rounded-full bg-[#fff1f2] p-1.5">
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className={buildModeButtonClass(authMode === "login")}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange("register")}
                  className={buildModeButtonClass(authMode === "register")}
                >
                  Buat akun
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-7 space-y-5"
                  onSubmit={loginFormik.handleSubmit}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="sdg-login-email"
                        className="text-sm font-semibold text-[#5d2327]"
                      >
                        Email
                      </label>
                      <Input
                        id="sdg-login-email"
                        type="email"
                        value={loginFormik.values.email}
                        onChange={handleLoginChange}
                        name="email"
                        autoComplete="email"
                        placeholder="nama@instansi.com"
                        className={FORM_INPUT_CLASSNAME}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="sdg-login-password"
                        className="text-sm font-semibold text-[#5d2327]"
                      >
                        Password
                      </label>
                      <Input
                        id="sdg-login-password"
                        type="password"
                        value={loginFormik.values.password}
                        onChange={handleLoginChange}
                        name="password"
                        autoComplete="current-password"
                        placeholder="Masukkan password"
                        className={FORM_INPUT_CLASSNAME}
                      />
                    </div>
                  </div>

                  {feedback ? (
                    <div
                      className={cn(
                        "rounded-[22px] border px-4 py-3 text-sm leading-6",
                        feedback.tone === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-800",
                      )}
                    >
                      {feedback.message}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isLoginPending}
                    className="h-[54px] w-full rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_52%,#d83a41_100%)] text-white shadow-[0_24px_46px_-26px_rgba(182,37,42,0.72)] transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    {isLoginPending ? "Memproses..." : "Masuk ke workspace"}
                    <ArrowRight data-icon="inline-end" />
                  </Button>

                  <p className="text-center text-sm text-[#875055]">
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeChange("register")}
                      className="font-semibold text-[#8f1a20] transition hover:text-[#6f1116]"
                    >
                      Buat akun
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-7 space-y-5"
                  onSubmit={registerFormik.handleSubmit}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="sdg-register-name"
                        className="text-sm font-semibold text-[#5d2327]"
                      >
                        Nama
                      </label>
                      <Input
                        id="sdg-register-name"
                        value={registerFormik.values.name}
                        onChange={handleRegisterChange}
                        name="name"
                        autoComplete="name"
                        placeholder="Nama PIC"
                        className={FORM_INPUT_CLASSNAME}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="sdg-register-organization"
                        className="text-sm font-semibold text-[#5d2327]"
                      >
                        Instansi
                      </label>
                      <Input
                        id="sdg-register-organization"
                        value={registerFormik.values.organization}
                        onChange={handleRegisterChange}
                        name="organization"
                        autoComplete="organization"
                        placeholder="Nama instansi"
                        className={FORM_INPUT_CLASSNAME}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="sdg-register-email"
                        className="text-sm font-semibold text-[#5d2327]"
                      >
                        Email
                      </label>
                      <Input
                        id="sdg-register-email"
                        type="email"
                        value={registerFormik.values.email}
                        onChange={handleRegisterChange}
                        name="email"
                        autoComplete="email"
                        placeholder="nama@instansi.com"
                        className={FORM_INPUT_CLASSNAME}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="sdg-register-password"
                          className="text-sm font-semibold text-[#5d2327]"
                        >
                          Password
                        </label>
                        <Input
                          id="sdg-register-password"
                          type="password"
                          value={registerFormik.values.password}
                          onChange={handleRegisterChange}
                          name="password"
                          autoComplete="new-password"
                          placeholder="Minimal 8 karakter"
                          className={FORM_INPUT_CLASSNAME}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="sdg-register-confirm-password"
                          className="text-sm font-semibold text-[#5d2327]"
                        >
                          Konfirmasi
                        </label>
                        <Input
                          id="sdg-register-confirm-password"
                          type="password"
                          value={registerFormik.values.confirmPassword}
                          onChange={handleRegisterChange}
                          name="confirmPassword"
                          autoComplete="new-password"
                          placeholder="Ulangi password"
                          className={FORM_INPUT_CLASSNAME}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[#f1d9dc] bg-[#fff5f5] px-4 py-4 text-sm leading-6 text-[#7a4b50]">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#b6252a]" />
                      <div>
                        <p className="font-semibold text-[#7d1318]">
                          Role default langsung pihak eksternal
                        </p>
                        <p className="mt-1">
                          Akses internal dikelola terpisah.
                        </p>
                      </div>
                    </div>
                  </div>

                  {feedback ? (
                    <div
                      className={cn(
                        "rounded-[22px] border px-4 py-3 text-sm leading-6",
                        feedback.tone === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-800",
                      )}
                    >
                      {feedback.message}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isRegisterPending}
                    className="h-[54px] w-full rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_52%,#d83a41_100%)] text-white shadow-[0_24px_46px_-26px_rgba(182,37,42,0.72)] transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    {isRegisterPending ? "Memproses..." : "Buat akun"}
                    <ArrowRight data-icon="inline-end" />
                  </Button>

                  <p className="text-center text-sm text-[#875055]">
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeChange("login")}
                      className="font-semibold text-[#8f1a20] transition hover:text-[#6f1116]"
                    >
                      Masuk
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6 rounded-[26px] border border-[#f1d8db] bg-[#fff7f8] px-4 py-4">
              <div className="flex items-start gap-3 text-[#7a4d51]">
                <Sparkles className="mt-0.5 h-5 w-5 text-[#b6252a]" />
                <p className="text-sm leading-6">
                  Masuk memakai akun yang sudah terdaftar di backend. Akun baru
                  otomatis menjadi pihak eksternal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
