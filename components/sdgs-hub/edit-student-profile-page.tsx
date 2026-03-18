"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Save,
  ShieldAlert,
  Trash2,
  Upload,
} from "lucide-react";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Gagal membaca file."));
    };

    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

export function EditStudentProfilePage() {
  const router = useRouter();
  const {
    currentStudent,
    currentLecturer,
    isHydrated,
    updateStudentProfile,
    uploadStudentCv,
    removeStudentCv,
  } = useLecturerPortal();
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [program, setProgram] = useState("");
  const [batch, setBatch] = useState("");
  const [phone, setPhone] = useState("");
  const [focus, setFocus] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploadingCv, setIsUploadingCv] = useState(false);

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

  useEffect(() => {
    if (!currentStudent) {
      return;
    }

    setName(currentStudent.name);
    setFaculty(currentStudent.faculty);
    setProgram(currentStudent.program);
    setBatch(currentStudent.batch);
    setPhone(currentStudent.phone);
    setFocus(currentStudent.focus);
    setBio(currentStudent.bio);
    setSkills(currentStudent.skills.join(", "));
  }, [currentStudent]);

  if (!isHydrated || !currentStudent) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff_0%,#fff7f6_100%)] pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-[2rem] border border-[#b6252a]/10 bg-white px-8 py-16 text-center shadow-[0_28px_80px_-44px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-medium text-gray-500">
              Menyiapkan editor profil mahasiswa...
            </p>
          </div>
        </div>
      </main>
    );
  }

  const handleSave = () => {
    updateStudentProfile({
      name: name.trim(),
      faculty: faculty.trim(),
      program: program.trim(),
      batch: batch.trim(),
      phone: phone.trim(),
      focus: focus.trim(),
      bio: bio.trim(),
      skills: skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    setErrorMessage("");
    setInfoMessage("Profil berhasil diperbarui.");
  };

  const handleCvChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingCv(true);
    setInfoMessage("");
    setErrorMessage("");

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const result = uploadStudentCv({
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString().split("T")[0],
      });

      if (!result.success) {
        setErrorMessage(result.message ?? "Gagal mengunggah CV.");
      } else {
        setInfoMessage(
          "CV berhasil diunggah dan akan tampil sebagai attachment profil.",
        );
      }
    } catch {
      setErrorMessage("File CV tidak dapat diproses.");
    } finally {
      event.target.value = "";
      setIsUploadingCv(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f6_0%,#ffffff_100%)]">
      <ScrollSection>
        <section className="mx-auto max-w-5xl px-6 pt-32 pb-20">
          <Link
            href="/sdgs-hub/profil-saya"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition hover:gap-3"
          >
            <ArrowLeft className="size-4" />
            Kembali ke profil saya
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-[#b6252a]/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.2)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff4f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                <FileText className="size-4" />
                Edit Profil Mahasiswa
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900">
                Perbarui profil dan lampiran CV
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                Informasi ini akan menjadi acuan utama saat dosen meninjau
                profil dan pendaftaran penelitianmu.
              </p>

              {infoMessage ? (
                <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                  {infoMessage}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Nama Lengkap
                    </label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Nomor HP
                    </label>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Fakultas
                    </label>
                    <input
                      value={faculty}
                      onChange={(event) => setFaculty(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Program Studi
                    </label>
                    <input
                      value={program}
                      onChange={(event) => setProgram(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Angkatan
                    </label>
                    <input
                      value={batch}
                      onChange={(event) => setBatch(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Fokus Kontribusi
                  </label>
                  <input
                    value={focus}
                    onChange={(event) => setFocus(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Ringkasan Profil
                  </label>
                  <textarea
                    rows={5}
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Skills Utama
                  </label>
                  <input
                    value={skills}
                    onChange={(event) => setSkills(event.target.value)}
                    placeholder="Pisahkan dengan koma, misalnya: Research, UX, IoT"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_38px_-20px_rgba(182,37,42,0.95)] transition hover:-translate-y-0.5"
                >
                  <Save className="size-4" />
                  Simpan Perubahan Profil
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.2)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                      Upload CV
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
                      Lampiran yang wajib sebelum daftar riset
                    </h2>
                  </div>
                  <Upload className="size-5 text-[#b6252a]" />
                </div>

                {!currentStudent.cvAttachment ? (
                  <div className="mt-6 flex items-start gap-3 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900/80">
                    <ShieldAlert className="mt-1 size-5 shrink-0 text-amber-700" />
                    Upload CV terlebih dahulu. Banner ini juga akan muncul di
                    halaman profil dan detail riset sampai lampiran tersedia.
                  </div>
                ) : null}

                <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#b6252a]/15 bg-[#fff9f8] p-5">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-transparent px-4 py-8 text-center transition hover:border-[#b6252a]/12 hover:bg-white">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#b6252a] shadow-sm">
                      <Upload className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {isUploadingCv ? "Mengunggah CV..." : "Pilih file CV"}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Format PDF, DOC, atau DOCX. Maksimal 2 MB.
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleCvChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {currentStudent.cvAttachment ? (
                  <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
                    <div className="text-sm font-semibold text-emerald-700">
                      {currentStudent.cvAttachment.fileName}
                    </div>
                    <div className="mt-2 text-sm text-emerald-800/80">
                      {formatBytes(currentStudent.cvAttachment.fileSize)} •
                      Upload {currentStudent.cvAttachment.uploadedAt}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={currentStudent.cvAttachment.dataUrl}
                        download={currentStudent.cvAttachment.fileName}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        <FileText className="size-4" />
                        Unduh CV
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          removeStudentCv();
                          setInfoMessage("CV berhasil dihapus dari profil.");
                          setErrorMessage("");
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                        Hapus CV
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
