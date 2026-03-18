"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";

export default function BuatCampaignPage() {
  const router = useRouter();
  const { currentLecturer, isHydrated } = useLecturerPortal();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    router.replace(
      currentLecturer ? "/sdgs-hub/riset/dashboard/buat" : "/sdgs-hub/riset/login"
    );
  }, [currentLecturer, isHydrated, router]);

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <section className="mx-auto max-w-2xl px-6">
        <div className="rounded-[2rem] border border-black/8 bg-white px-8 py-14 text-center shadow-sm">
          <div className="text-sm font-medium text-gray-500">Mengalihkan ke portal dosen...</div>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Form pembuatan campaign sekarang dipisah ke halaman khusus input riset
            agar terhubung langsung dengan akun pembuatnya.
          </p>
          <Link
            href={currentLecturer ? "/sdgs-hub/riset/dashboard/buat" : "/sdgs-hub/riset/login"}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
          >
            Buka Halaman Input
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
