"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, LogIn, Eye, EyeOff } from "lucide-react";

const SUPERADMIN_CREDENTIALS = {
  email: "superadmin@sdgs.telkomuniversity.ac.id",
  password: "sdgsadmin2026",
};

const SUPERADMIN_STORAGE_KEY = "sdgs-superadmin-session";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = window.localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    if (session) {
      router.replace("/superadmin/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      email === SUPERADMIN_CREDENTIALS.email &&
      password === SUPERADMIN_CREDENTIALS.password
    ) {
      window.localStorage.setItem(
        SUPERADMIN_STORAGE_KEY,
        JSON.stringify({ email, loggedInAt: new Date().toISOString() }),
      );
      router.push("/superadmin/dashboard");
    } else {
      setError("Email atau password salah. Silakan coba lagi.");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff_0%,#faf5f5_100%)]">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Panel - Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-[2rem] border border-[#b6252a]/10 bg-[linear-gradient(145deg,#6b1318_0%,#8f1a20_40%,#b6252a_80%,#d9383e_100%)] p-8 text-white shadow-[0_32px_90px_-50px_rgba(143,26,32,0.65)] lg:p-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              <ShieldCheck className="size-3.5" />
              Super Admin SDGs
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl md:leading-tight">
              Panel Admin untuk mengelola submisi SDGs Hub.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75">
              Kelola dan review semua ide, inovasi, dan riset yang disubmit oleh
              mahasiswa dan dosen. Approve, tolak, atau kirim pesan revisi
              langsung dari dashboard.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Review & approve submisi ide mahasiswa",
                "Moderasi produk inovasi sebelum dipublikasikan",
                "Kirim feedback & alasan penolakan ke user",
                "Pantau riset yang sedang berjalan",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <ShieldCheck className="h-3 w-3 text-white/90" />
                  </div>
                  <span className="text-sm text-white/85">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Demo Account
              </p>
              <p className="mt-2 text-sm text-white/80">
                <span className="font-medium text-white/90">Email:</span>{" "}
                {SUPERADMIN_CREDENTIALS.email}
              </p>
              <p className="text-sm text-white/80">
                <span className="font-medium text-white/90">Password:</span>{" "}
                {SUPERADMIN_CREDENTIALS.password}
              </p>
            </div>
          </motion.div>

          {/* Right Panel - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)] lg:p-10"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b6252a]/8">
                <KeyRound className="h-6 w-6 text-[#b6252a]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Login Super Admin
                </h2>
                <p className="text-sm text-gray-500">SDGs Center Dashboard</p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@sdgs.telkomuniversity.ac.id"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(182,37,42,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_20px_38px_-16px_rgba(182,37,42,0.95)]"
              >
                <LogIn className="h-4 w-4" />
                Masuk ke Dashboard
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
