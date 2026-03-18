import Link from "next/link";
import { ArrowLeft, Compass, Home, Search } from "lucide-react";
import { NavbarDetail } from "@/components/home/custom/navbar-detail-page";
import { Footer } from "@/components/home/section/footer";

const QUICK_LINKS = [
  {
    title: "Kembali ke Home",
    description: "Balik ke halaman utama SDG's Telkom University.",
    href: "/",
    icon: Home,
  },
  {
    title: "Jelajahi SDGs Hub",
    description: "Masuk ke portal riset, inovasi, dan ide mahasiswa.",
    href: "/sdgs-hub",
    icon: Compass,
  },
  {
    title: "Lihat Berita",
    description: "Cek update dan artikel terbaru dari platform ini.",
    href: "/news",
    icon: Search,
  },
];

export default function NotFound() {
  return (
    <>
      <NavbarDetail />

      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f7f8_0%,#ffffff_24%,#f9f6f6_100%)] pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(182,37,42,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(182,37,42,0.45)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute left-1/2 top-28 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.07)_0%,transparent_68%)] blur-3xl" />
          <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(237,30,40,0.05)_0%,transparent_70%)] blur-3xl" />
        </div>

        <section className="relative mx-auto max-w-6xl px-6">
          <div className="rounded-[2.2rem] border border-[#b6252a]/10 bg-white/92 p-8 shadow-[0_32px_90px_-44px_rgba(15,23,42,0.22)] backdrop-blur-sm md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#b6252a]/10 bg-[linear-gradient(180deg,#fffafa_0%,#ffffff_100%)] px-6 py-12 md:px-10 md:py-14">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(182,37,42,0.08),transparent_52%)]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                    Error 404
                  </div>

                  <div className="mt-6 text-[6rem] font-semibold leading-none tracking-[-0.08em] text-[#b6252a]/14 sm:text-[8rem] md:text-[10rem]">
                    404
                  </div>

                  <div className="mt-4 h-1.5 w-20 rounded-full bg-[linear-gradient(90deg,#8f1a20_0%,#ed1e28_100%)]" />

                  <h1 className="mt-6 max-w-xl text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
                    Page Not Found
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
                    Halaman yang Anda cari tidak ditemukan, mungkin URL-nya salah, sudah dipindah, atau memang belum tersedia.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-18px_rgba(182,37,42,0.9)] transition hover:-translate-y-0.5 hover:brightness-105"
                    >
                      <Home className="size-4" />
                      Kembali ke Home
                    </Link>
                    <Link
                      href="/sdgs-hub"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
                    >
                      <ArrowLeft className="size-4" />
                      Buka SDGs Hub
                    </Link>
                  </div>

                  <div className="mt-8 text-xs uppercase tracking-[0.2em] text-gray-400">
                    Cannot find matching route
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                    Quick Navigation
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                    Pilihan cepat untuk lanjut jelajah
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Kalau route yang Anda cari tidak ada, gunakan pintasan ini untuk kembali ke area utama situs.
                  </p>
                </div>

                <div className="space-y-3">
                  {QUICK_LINKS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[linear-gradient(180deg,#fff_0%,#fcfcfc_100%)] p-5 transition hover:border-[#b6252a]/15 hover:shadow-sm"
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#b6252a]">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900">{item.title}</div>
                          <div className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}