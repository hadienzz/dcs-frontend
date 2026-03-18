import {
  Mail,
  Users,
  Target,
  Layers,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { NavbarDetail } from "@/components/home/custom/navbar-detail-page";
import { Footer } from "@/components/home/section/footer";

export const revalidate = 0;

export default function TentangKamiPage() {
  const internalStaff = [
    { name: "Nadia Aruma Dita S., S.Kom." },
    { name: "Fadhilah Raihanah, S.T., M.Si." },
  ];
  const externalStaff = [
    { name: "Andry Arifin, S.M." },
    { name: "Althaf Mochammad Zhafir, S.Ikom." },
  ];

  const unggulan = [
    {
      title: "Konsistensi Berkelanjutan",
      desc: "Semua program tidak hanya sekali jalan, tetapi dirancang berkelanjutan sesuai prinsip sustainable development.",
      icon: CheckCircle2,
    },
    {
      title: "Pendekatan Digital",
      desc: "Memanfaatkan teknologi digital dalam implementasi SDGs, misalnya dengan aplikasi seperti Pirolisis dan Greenaps.",
      icon: Globe2,
    },
    {
      title: "Sistem Monitoring & Evaluasi",
      desc: "Program dikawal dengan monitoring dan evaluasi berkala untuk memastikan dampak yang terukur.",
      icon: Target,
    },
    {
      title: "Dokumentasi Lengkap",
      desc: "Seluruh aktivitas terdokumentasi—laporan, pengukuran dampak, publikasi, dan konten digital sebagai akuntabilitas.",
      icon: Layers,
    },
  ];

  const bidangUtama = [
    "Sosial",
    "Ekonomi",
    "Lingkungan",
    "Tata Kelola",
    "Sustainability",
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-gray-50">
      <NavbarDetail />

      {/* Hero */}
      <section className="relative pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-24 left-10 h-40 w-40 rounded-full bg-[#b6252a]/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-56 w-56 rounded-full bg-[#ED1E28]/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="mx-auto max-w-full flex sm:inline-flex flex-wrap items-center justify-center gap-2 bg-[#b6252a]/10 text-[#b6252a] px-4 py-2 rounded-full text-sm font-medium text-center">
            Digital Collaboration for Sustainability
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 text-balance">
            {`SDG's Telkom University`}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Kolaborasi digital untuk mendukung implementasi SDGs melalui
            pendidikan, penelitian, dan pengabdian berkelanjutan.
          </p>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#b6252a]" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Struktur Organisasi SDGs Telkom University
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Ketua */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Ketua Digital Collaboration for Sustainability
              </h3>
              <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">
                Dr. Runik Machfiroh
              </p>
              <a
                href="mailto:runikmachfiroh@telkomuniversity.ac.id"
                className="mt-3 flex flex-wrap max-w-full items-center gap-2 text-[#b6252a] hover:underline break-all"
              >
                <Mail className="h-4 w-4" />{" "}
                runikmachfiroh@telkomuniversity.ac.id
              </a>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Kepala Bagian Aksi dan Kolaborasi SDGs Center Telkom University
              </h3>
              <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">
                Mohamad Ridwan Noor, S.Pd.
              </p>
              <a
                href="mailto:runikmachfiroh@telkomuniversity.ac.id"
                className="mt-3 flex flex-wrap max-w-full items-center gap-2 text-[#b6252a] hover:underline break-all"
              >
                <Mail className="h-4 w-4" />{" "}
                mohridwannoor@telkomuniversity.ac.id
              </a>
            </div>

            {/* Kepala Urusan Internal */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Kepala Urusan Internal
              </h3>
              <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">
                Dicky Tiara Kusumah, S.Kom.
              </p>
              <a
                href="mailto:dickytiarakusumah@telkomuniversity.ac.id"
                className="mt-3 flex flex-wrap max-w-full items-center gap-2 text-[#b6252a] hover:underline break-all"
              >
                <Mail className="h-4 w-4" />{" "}
                dickytiarakusumah@telkomuniversity.ac.id
              </a>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Staf Urusan Internal
                </p>
                <ul className="space-y-1 text-gray-700">
                  {internalStaff.map((s) => (
                    <li key={s.name}>• {s.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kepala Urusan Eksternal */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Kepala Urusan Eksternal
              </h3>
              <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">
                Rifki Rahman Nur Ikhsan, M.T.
              </p>
              <a
                href="mailto:rfkrhmn@telkomuniversity.ac.id"
                className="mt-3 inline-flex items-center gap-2 text-[#b6252a] hover:underline"
              >
                <Mail className="h-4 w-4" /> rfkrhmn@telkomuniversity.ac.id
              </a>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Staf Urusan Eksternal
                </p>
                <ul className="space-y-1 text-gray-700">
                  {externalStaff.map((s) => (
                    <li key={s.name}>• {s.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bidang Utama (tags) */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Program Strategis – Bidang Utama
              </h3>
              <div className="flex flex-wrap gap-2">
                {bidangUtama.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1 rounded-full bg-[#b6252a]/10 text-[#b6252a] text-sm font-medium"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-[#b6252a]" />
              <h3 className="text-xl font-semibold text-gray-900">Visi</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li>
                Melakukan kolaborasi internal dan eksternal untuk meningkatkan
                kualitas Tridharma Perguruan Tinggi berbasis digital di bidang
                pendidikan, penelitian, dan pengabdian kepada masyarakat yang
                selaras dengan SDGs.
              </li>
              <li>
                Melakukan implementasi kerja sama penta helix serta memberikan
                kontribusi bagi pembangunan berkelanjutan Indonesia dan global
                dengan memanfaatkan teknologi digital.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-5 w-5 text-[#b6252a]" />
              <h3 className="text-xl font-semibold text-gray-900">Misi</h3>
            </div>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>
                Merancang media untuk mewadahi hasil implementasi SDGs yang
                terukur (produk dan kepakaran).
              </li>
              <li>
                Mengembangkan kapasitas internal untuk meningkatkan awareness
                terkait SDGs.
              </li>
              <li>
                Meningkatkan engagement dan kolaborasi dengan pemerintah,
                industri, masyarakat, media, dan perguruan tinggi lain.
              </li>
              <li>
                Membuat pilot project model pengembangan lima unggulan tujuan
                SDGs sebagai good practice dalam memanfaatkan teknologi digital
                di beberapa wilayah yang dapat direplikasi untuk rekognisi
                nasional dan internasional.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-12 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Keunggulan SDGs Telkom University
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {unggulan.map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#b6252a]/10 text-[#b6252a]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
