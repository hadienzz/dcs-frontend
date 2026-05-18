import type { Metadata } from "next";

import { CheckSdgView } from "@/components/check-sdg/check-sdg-view";

export const metadata: Metadata = {
  title: "Cek SDG — Prediksi Kategori SDGs",
  description:
    "Upload dokumen atau masukkan judul dan abstrak untuk memprediksi kategori SDG yang relevan menggunakan AI.",
};

export default function Page() {
  return <CheckSdgView />;
}
