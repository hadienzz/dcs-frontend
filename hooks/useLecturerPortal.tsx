"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export interface LecturerProfile {
  id: string;
  name: string;
  phone: string;
  faculty: string;
  expertise: string[];
  tagline: string;
  position: string;
  avatarUrl: string;
  nip: string;
  email: string;
}

export interface StudentCvAttachment {
  fileName: string;
  mimeType: string;
  fileSize: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface StudentProfile {
  nim: string;
  email: string;
  name: string;
  faculty: string;
  program: string;
  batch: string;
  focus: string;
  phone: string;
  bio: string;
  skills: string[];
  cvAttachment?: StudentCvAttachment | null;
}

export type StudentResearchApplicationStatus =
  | "pending"
  | "reviewed"
  | "accepted"
  | "completed";

export interface StudentResearchApplication {
  id: string;
  studentEmail: string;
  projectSlug: string;
  projectTitle: string;
  lecturerName: string;
  requestedAt: string;
  role: string;
  status: StudentResearchApplicationStatus;
  statusUpdatedAt?: string;
  note: string;
  cvFileName: string;
}

export type AuthRole = "mahasiswa" | "dosen";

interface AuthRecord {
  email: string;
  password: string;
  role: AuthRole;
  userId: string;
}

interface LecturerLoginCredentials {
  email: string;
  password: string;
}

interface StudentLoginCredentials {
  email: string;
  password: string;
}

interface LecturerRegistrationPayload {
  name: string;
  email: string;
  password: string;
  faculty: string;
  position: string;
  nip: string;
  phone?: string;
}

interface StudentRegistrationPayload {
  nim: string;
  name: string;
  email: string;
  password: string;
  faculty: string;
  program: string;
  batch: string;
}

interface LecturerPortalState {
  currentLecturer: LecturerProfile | null;
  currentStudent: StudentProfile | null;
  lecturers: LecturerProfile[];
  students: StudentProfile[];
  studentApplications: StudentResearchApplication[];
  isHydrated: boolean;
  loginLecturer: (credentials: LecturerLoginCredentials) => {
    success: boolean;
    message?: string;
  };
  loginStudent: (credentials: StudentLoginCredentials) => {
    success: boolean;
    message?: string;
  };
  registerLecturer: (payload: LecturerRegistrationPayload) => {
    success: boolean;
    message?: string;
  };
  registerStudent: (payload: StudentRegistrationPayload) => {
    success: boolean;
    message?: string;
  };
  updateStudentProfile: (
    updates: Partial<Omit<StudentProfile, "nim" | "email">>,
  ) => void;
  uploadStudentCv: (payload: StudentCvAttachment) => {
    success: boolean;
    message?: string;
  };
  removeStudentCv: () => void;
  applyToResearch: (payload: {
    projectSlug: string;
    projectTitle: string;
    lecturerName: string;
    role: string;
    note: string;
  }) => { success: boolean; message?: string };
  updateStudentApplicationStatus: (
    applicationId: string,
    status: StudentResearchApplicationStatus,
    note?: string,
  ) => void;
  logoutStudent: () => void;
  logout: () => void;
}

const LECTURER_STORAGE_KEY = "sdgs-hub-lecturer-session";
export const STUDENT_STORAGE_KEY = "sdgs-hub-student-session";
const LECTURER_PROFILE_STORAGE_KEY = "sdgs-hub-lecturer-profiles";
const STUDENT_PROFILE_STORAGE_KEY = "sdgs-hub-student-profiles";
const STUDENT_APPLICATION_STORAGE_KEY = "sdgs-hub-student-applications";
const AUTH_RECORD_STORAGE_KEY = "sdgs-hub-auth-records";
const MAX_CV_SIZE_BYTES = 2 * 1024 * 1024;
export const DEMO_LECTURER_PASSWORD = "ResearchHub#26";
export const DEMO_STUDENT_PASSWORD = "CampusSDGs#26";

function createMockCvAttachment(
  fileName: string,
  uploadedAt: string,
): StudentCvAttachment {
  return {
    fileName,
    mimeType: "application/pdf",
    fileSize: 284_672,
    dataUrl: "/contohpdf.pdf",
    uploadedAt,
  };
}

const DEFAULT_LECTURER_AVATARS = [
  "/pakar/adiwijaya.jpg",
  "/pakar/aloysius.jpeg",
  "/pakar/jangkung.jpg",
];

export const LECTURER_ACCOUNTS: LecturerProfile[] = [
  {
    id: "DSN-24001",
    name: "Dr. Ahmad Fauzi, M.T.",
    phone: "081234567890",
    faculty: "Fakultas Informatika",
    expertise: ["Data Science", "Climate Analytics", "Sustainability"],
    tagline:
      "Membuka riset terapan berbasis data untuk isu lingkungan dan pertanian.",
    position: "Lektor Kepala",
    avatarUrl: "/pakar/dr-ahmad-fauzi.webp",
    nip: "19850312 201501 1 001",
    email: "ahmad.fauzi@telkomuniversity.ac.id",
  },
  {
    id: "DSN-24002",
    name: "Prof. Siti Nurhaliza, Ph.D.",
    phone: "082198765432",
    faculty: "Fakultas Rekayasa Industri",
    expertise: ["IoT", "Water Systems", "Smart Campus"],
    tagline:
      "Fokus pada sistem cerdas untuk kampus hijau dan efisiensi sumber daya.",
    position: "Guru Besar",
    avatarUrl: "/pakar/prof-siti-nurhaliza.webp",
    nip: "19780624 200312 2 002",
    email: "siti.nurhaliza@telkomuniversity.ac.id",
  },
  {
    id: "DSN-24003",
    name: "Dr. Budi Santoso, M.Kom.",
    phone: "085312345678",
    faculty: "Fakultas Informatika",
    expertise: ["EdTech", "Mobile Development", "Product Design"],
    tagline:
      "Mendorong solusi pendidikan digital yang lebih inklusif dan terukur.",
    position: "Lektor",
    avatarUrl: "/pakar/dr-budi-santoso.webp",
    nip: "19900115 201801 1 003",
    email: "budi.santoso@telkomuniversity.ac.id",
  },
  {
    id: "DSN-24004",
    name: "Dr. Rina Wijaya, M.Eng.",
    phone: "087654321098",
    faculty: "Fakultas Teknik Elektro",
    expertise: ["Energy Monitoring", "Dashboard", "Renewable Systems"],
    tagline:
      "Mengembangkan monitoring energi untuk mendukung operasional kampus berkelanjutan.",
    position: "Lektor Kepala",
    avatarUrl: "/pakar/dr-rina-wijaya.webp",
    nip: "19870920 201601 2 004",
    email: "rina.wijaya@telkomuniversity.ac.id",
  },
  {
    id: "DSN-24005",
    name: "Dr. Hendra Gunawan, M.Si.",
    phone: "081345678901",
    faculty: "Fakultas Ilmu Terapan",
    expertise: ["Machine Learning", "Air Quality", "Environmental Sensing"],
    tagline: "Menghubungkan sensor, machine learning, dan isu lingkungan kota.",
    position: "Lektor",
    avatarUrl: "/pakar/dr-hendra-gunawan.webp",
    nip: "19920708 202001 1 005",
    email: "hendra.gunawan@telkomuniversity.ac.id",
  },
];

export const STUDENT_ACCOUNTS: StudentProfile[] = [
  {
    nim: "1101234567",
    email: "anisa.putri@student.telkomuniversity.ac.id",
    name: "Anisa Putri",
    faculty: "Fakultas Rekayasa Industri",
    program: "S1 Teknik Industri",
    batch: "2023",
    focus: "Circular design dan kampus minim limbah",
    phone: "081234560123",
    bio: "Mahasiswa yang fokus pada circular design, sustainability operation, dan eksperimen program kampus minim limbah.",
    skills: ["Research", "Community Ops", "Design Thinking"],
    cvAttachment: createMockCvAttachment("cv-anisa-putri.pdf", "2026-03-01"),
  },
  {
    nim: "1109876543",
    email: "rizki.fajar@student.telkomuniversity.ac.id",
    name: "Rizki Fajar",
    faculty: "Fakultas Teknik Elektro",
    program: "S1 Teknik Telekomunikasi",
    batch: "2022",
    focus: "Mobilitas kampus dan transportasi rendah emisi",
    phone: "081222334455",
    bio: "Tertarik pada IoT, infrastruktur kampus, dan solusi transportasi rendah emisi yang mudah diadopsi pengguna.",
    skills: ["IoT", "Prototyping", "Field Testing"],
    cvAttachment: createMockCvAttachment("cv-rizki-fajar.pdf", "2026-02-20"),
  },
  {
    nim: "1102233445",
    email: "dewi.lestari@student.telkomuniversity.ac.id",
    name: "Dewi Lestari",
    faculty: "Fakultas Informatika",
    program: "S1 Sistem Informasi",
    batch: "2021",
    focus: "Pengalaman belajar, komunitas, dan mentoring digital",
    phone: "081333444555",
    bio: "Berfokus pada product thinking, UX research, dan pengembangan platform yang mendukung pengalaman belajar lebih inklusif.",
    skills: ["UX Research", "Product Strategy", "Facilitation"],
    cvAttachment: createMockCvAttachment("cv-dewi-lestari.pdf", "2026-01-14"),
  },
  {
    nim: "1103344556",
    email: "muhammad.ilham@student.telkomuniversity.ac.id",
    name: "Muhammad Ilham",
    faculty: "Fakultas Ilmu Terapan",
    program: "S1 Teknologi Pangan",
    batch: "2020",
    focus: "Urban farming dan ekosistem pangan kampus",
    phone: "081444555666",
    bio: "Senang mengerjakan project pangan berkelanjutan, urban farming, dan eksperimen operasional berbasis komunitas.",
    skills: ["Food System", "Project Coordination", "Data Collection"],
    cvAttachment: createMockCvAttachment("cv-muhammad-ilham.pdf", "2026-03-05"),
  },
  {
    nim: "1104455667",
    email: "sarah.amelia@student.telkomuniversity.ac.id",
    name: "Sarah Amelia",
    faculty: "Fakultas Komunikasi dan Bisnis",
    program: "S1 Administrasi Bisnis",
    batch: "2022",
    focus: "Community product growth dan digital campaign",
    phone: "081555666777",
    bio: "Membangun strategi adopsi produk, growth narrative, dan koordinasi campaign untuk inisiatif berdampak.",
    skills: ["Campaign Planning", "Stakeholder Mapping", "Copywriting"],
    cvAttachment: createMockCvAttachment("cv-sarah-amelia.pdf", "2026-02-27"),
  },
];

const SEEDED_AUTH_RECORDS: AuthRecord[] = [
  ...LECTURER_ACCOUNTS.map((lecturer) => ({
    email: lecturer.email.toLowerCase(),
    password: DEMO_LECTURER_PASSWORD,
    role: "dosen" as const,
    userId: lecturer.id,
  })),
  ...STUDENT_ACCOUNTS.map((student) => ({
    email: student.email.toLowerCase(),
    password: DEMO_STUDENT_PASSWORD,
    role: "mahasiswa" as const,
    userId: student.nim,
  })),
];

function getMergedLecturerDirectory(
  profiles: Record<string, LecturerProfile>,
): LecturerProfile[] {
  const merged = new Map<string, LecturerProfile>();

  LECTURER_ACCOUNTS.forEach((lecturer) => {
    merged.set(lecturer.email.toLowerCase(), lecturer);
  });

  Object.values(profiles).forEach((lecturer) => {
    merged.set(lecturer.email.toLowerCase(), lecturer);
  });

  return Array.from(merged.values());
}

function getMergedStudentDirectory(
  profiles: Record<string, StudentProfile>,
): StudentProfile[] {
  const merged = new Map<string, StudentProfile>();

  STUDENT_ACCOUNTS.forEach((student) => {
    merged.set(student.email.toLowerCase(), student);
  });

  Object.values(profiles).forEach((student) => {
    merged.set(student.email.toLowerCase(), student);
  });

  return Array.from(merged.values());
}

function getMergedAuthDirectory(records: AuthRecord[]) {
  const merged = new Map<string, AuthRecord>();

  SEEDED_AUTH_RECORDS.forEach((record) => {
    merged.set(record.email.toLowerCase(), record);
  });

  records.forEach((record) => {
    merged.set(record.email.toLowerCase(), {
      ...record,
      email: record.email.toLowerCase(),
    });
  });

  return Array.from(merged.values());
}

const INITIAL_STUDENT_APPLICATIONS: StudentResearchApplication[] = [
  {
    id: "req-anisa-1",
    studentEmail: "anisa.putri@student.telkomuniversity.ac.id",
    projectSlug: "analisis-dampak-perubahan-iklim-pertanian-lokal",
    projectTitle: "Analisis Dampak Perubahan Iklim terhadap Pertanian Lokal",
    lecturerName: "Dr. Ahmad Fauzi, M.T.",
    requestedAt: "2026-03-03",
    role: "Mahasiswa Data Analyst",
    status: "accepted",
    statusUpdatedAt: "2026-03-05",
    note: "Diterima untuk membantu pembersihan data lapangan dan analisis tren awal.",
    cvFileName: "cv-anisa-putri.pdf",
  },
  {
    id: "req-anisa-2",
    studentEmail: "anisa.putri@student.telkomuniversity.ac.id",
    projectSlug: "smart-water-management-system-kampus-hijau",
    projectTitle: "Smart Water Management System untuk Kampus Hijau",
    lecturerName: "Prof. Siti Nurhaliza, Ph.D.",
    requestedAt: "2026-03-07",
    role: "Research Support",
    status: "reviewed",
    statusUpdatedAt: "2026-03-08",
    note: "Dosen sedang menilai kecocokan pengalaman Anda untuk sesi observasi berikutnya.",
    cvFileName: "cv-anisa-putri.pdf",
  },
  {
    id: "req-rizki-1",
    studentEmail: "rizki.fajar@student.telkomuniversity.ac.id",
    projectSlug: "smart-water-management-system-kampus-hijau",
    projectTitle: "Smart Water Management System untuk Kampus Hijau",
    lecturerName: "Prof. Siti Nurhaliza, Ph.D.",
    requestedAt: "2026-02-24",
    role: "Mahasiswa IoT Engineer",
    status: "completed",
    statusUpdatedAt: "2026-03-02",
    note: "Sprint perangkat awal selesai dan dokumentasi prototipe telah dikirim.",
    cvFileName: "cv-rizki-fajar.pdf",
  },
  {
    id: "req-dewi-1",
    studentEmail: "dewi.lestari@student.telkomuniversity.ac.id",
    projectSlug: "platform-edukasi-digital-anak-pedesaan",
    projectTitle: "Platform Edukasi Digital untuk Anak Pedesaan",
    lecturerName: "Dr. Budi Santoso, M.Kom.",
    requestedAt: "2026-01-20",
    role: "UX Research Assistant",
    status: "completed",
    statusUpdatedAt: "2026-02-10",
    note: "Anda menyelesaikan studi kebutuhan pengguna dan wireframe tahap awal.",
    cvFileName: "cv-dewi-lestari.pdf",
  },
  {
    id: "req-ilham-1",
    studentEmail: "muhammad.ilham@student.telkomuniversity.ac.id",
    projectSlug: "renewable-energy-monitoring-dashboard",
    projectTitle: "Renewable Energy Monitoring Dashboard",
    lecturerName: "Dr. Rina Wijaya, M.Eng.",
    requestedAt: "2026-03-06",
    role: "Data Visualization Support",
    status: "pending",
    statusUpdatedAt: "2026-03-06",
    note: "Lamaran baru masuk dan menunggu review dari dosen pembimbing.",
    cvFileName: "cv-muhammad-ilham.pdf",
  },
  {
    id: "req-sarah-1",
    studentEmail: "sarah.amelia@student.telkomuniversity.ac.id",
    projectSlug: "sistem-deteksi-kualitas-udara-machine-learning",
    projectTitle: "Sistem Deteksi Kualitas Udara Berbasis Machine Learning",
    lecturerName: "Dr. Hendra Gunawan, M.Si.",
    requestedAt: "2026-03-01",
    role: "Community Product Support",
    status: "accepted",
    statusUpdatedAt: "2026-03-04",
    note: "Anda membantu penyusunan narasi pilot project dan strategi adopsi pengguna.",
    cvFileName: "cv-sarah-amelia.pdf",
  },
  {
    id: "req-dewi-2",
    studentEmail: "dewi.lestari@student.telkomuniversity.ac.id",
    projectSlug: "analisis-dampak-perubahan-iklim-pertanian-lokal",
    projectTitle: "Analisis Dampak Perubahan Iklim terhadap Pertanian Lokal",
    lecturerName: "Dr. Ahmad Fauzi, M.T.",
    requestedAt: "2026-03-10",
    role: "Research Documentation Support",
    status: "pending",
    statusUpdatedAt: "2026-03-10",
    note: "Mahasiswa mengajukan diri untuk membantu sintesis insight dan dokumentasi lapangan.",
    cvFileName: "cv-dewi-lestari.pdf",
  },
  {
    id: "req-sarah-2",
    studentEmail: "sarah.amelia@student.telkomuniversity.ac.id",
    projectSlug: "smart-water-management-system-kampus-hijau",
    projectTitle: "Smart Water Management System untuk Kampus Hijau",
    lecturerName: "Prof. Siti Nurhaliza, Ph.D.",
    requestedAt: "2026-03-11",
    role: "Growth & Outreach Support",
    status: "reviewed",
    statusUpdatedAt: "2026-03-12",
    note: "Dosen meminta evaluasi lanjutan untuk melihat kecocokan pada fase pilot dan adopsi pengguna.",
    cvFileName: "cv-sarah-amelia.pdf",
  },
];

function titleCaseFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "Mahasiswa";

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function readStoredStudentProfiles() {
  try {
    const rawProfiles = window.localStorage.getItem(
      STUDENT_PROFILE_STORAGE_KEY,
    );

    if (!rawProfiles) {
      return {} as Record<string, StudentProfile>;
    }

    return JSON.parse(rawProfiles) as Record<string, StudentProfile>;
  } catch {
    return {} as Record<string, StudentProfile>;
  }
}

function readStoredLecturerProfiles() {
  try {
    const rawProfiles = window.localStorage.getItem(
      LECTURER_PROFILE_STORAGE_KEY,
    );

    if (!rawProfiles) {
      return {} as Record<string, LecturerProfile>;
    }

    return JSON.parse(rawProfiles) as Record<string, LecturerProfile>;
  } catch {
    return {} as Record<string, LecturerProfile>;
  }
}

function readStoredApplications() {
  try {
    const rawApplications = window.localStorage.getItem(
      STUDENT_APPLICATION_STORAGE_KEY,
    );
    if (!rawApplications) {
      return INITIAL_STUDENT_APPLICATIONS;
    }

    return JSON.parse(rawApplications) as StudentResearchApplication[];
  } catch {
    return INITIAL_STUDENT_APPLICATIONS;
  }
}

function resolveStudentProfile(
  nim: string,
  email: string,
  storedProfile?: Partial<StudentProfile> | null,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedNim = nim.trim();

  const matchedStudent =
    STUDENT_ACCOUNTS.find(
      (student) =>
        student.nim === normalizedNim || student.email === normalizedEmail,
    ) ?? null;

  const baseProfile: StudentProfile = matchedStudent
    ? matchedStudent
    : {
        nim: normalizedNim,
        email: normalizedEmail,
        name: titleCaseFromEmail(normalizedEmail),
        faculty: "Telkom University",
        program: "Mahasiswa SDGs Hub",
        batch: normalizedNim.slice(0, 4) || "Aktif",
        focus: "Eksplorasi riset, ide, dan inovasi kampus",
        phone: "",
        bio: "Lengkapi profil ini agar dosen dapat memahami pengalaman dan fokus kontribusimu.",
        skills: ["Kolaborasi", "Riset", "Eksplorasi Ide"],
        cvAttachment: null,
      };

  return {
    ...baseProfile,
    ...storedProfile,
    nim: normalizedNim || storedProfile?.nim || baseProfile.nim,
    email: normalizedEmail || storedProfile?.email || baseProfile.email,
    skills:
      storedProfile?.skills && storedProfile.skills.length > 0
        ? storedProfile.skills
        : baseProfile.skills,
    cvAttachment:
      storedProfile?.cvAttachment ?? baseProfile.cvAttachment ?? null,
  } satisfies StudentProfile;
}

function readStoredAuthRecords() {
  try {
    const rawRecords = window.localStorage.getItem(AUTH_RECORD_STORAGE_KEY);

    if (!rawRecords) {
      return SEEDED_AUTH_RECORDS;
    }

    return getMergedAuthDirectory(JSON.parse(rawRecords) as AuthRecord[]);
  } catch {
    return SEEDED_AUTH_RECORDS;
  }
}

function createNextLecturerId(existingLecturers: LecturerProfile[]) {
  const highestId = existingLecturers.reduce((maxId, lecturer) => {
    const matchedNumber = lecturer.id.match(/^DSN-(\d{5})$/);

    if (!matchedNumber) {
      return maxId;
    }

    return Math.max(maxId, Number(matchedNumber[1]));
  }, 24000);

  return `DSN-${String(highestId + 1).padStart(5, "0")}`;
}

function saveStudentProfilesToStorage(
  profiles: Record<string, StudentProfile>,
) {
  window.localStorage.setItem(
    STUDENT_PROFILE_STORAGE_KEY,
    JSON.stringify(profiles),
  );
}

function saveLecturerProfilesToStorage(
  profiles: Record<string, LecturerProfile>,
) {
  window.localStorage.setItem(
    LECTURER_PROFILE_STORAGE_KEY,
    JSON.stringify(profiles),
  );
}

function saveAuthRecordsToStorage(records: AuthRecord[]) {
  window.localStorage.setItem(
    AUTH_RECORD_STORAGE_KEY,
    JSON.stringify(getMergedAuthDirectory(records)),
  );
}

const LecturerPortalContext = createContext<LecturerPortalState | null>(null);

export function LecturerPortalProvider({ children }: { children: ReactNode }) {
  const [currentLecturer, setCurrentLecturer] =
    useState<LecturerProfile | null>(null);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(
    null,
  );
  const [lecturerProfiles, setLecturerProfiles] = useState<
    Record<string, LecturerProfile>
  >({});
  const [studentProfiles, setStudentProfiles] = useState<
    Record<string, StudentProfile>
  >({});
  const [authRecords, setAuthRecords] = useState<AuthRecord[]>(
    SEEDED_AUTH_RECORDS,
  );
  const [studentApplications, setStudentApplications] = useState<
    StudentResearchApplication[]
  >([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const lecturers = useMemo(
    () => getMergedLecturerDirectory(lecturerProfiles),
    [lecturerProfiles],
  );
  const students = useMemo(
    () => getMergedStudentDirectory(studentProfiles),
    [studentProfiles],
  );

  useEffect(() => {
    const storedLecturerProfiles = readStoredLecturerProfiles();
    const storedStudentProfiles = readStoredStudentProfiles();
    const storedAuth = readStoredAuthRecords();
    const storedApplications = readStoredApplications();
    const lecturerDirectory = getMergedLecturerDirectory(storedLecturerProfiles);

    setLecturerProfiles(storedLecturerProfiles);
    setStudentProfiles(storedStudentProfiles);
    setAuthRecords(storedAuth);
    setStudentApplications(storedApplications);

    const storedLecturerSession =
      window.localStorage.getItem(LECTURER_STORAGE_KEY);
    if (storedLecturerSession) {
      const normalizedSession = storedLecturerSession.toLowerCase();
      const storedLecturer =
        lecturerDirectory.find(
          (lecturer) =>
            lecturer.id.toLowerCase() === normalizedSession ||
            lecturer.email.toLowerCase() === normalizedSession,
        ) ?? null;
      setCurrentLecturer(storedLecturer);
    }

    const storedStudent = window.localStorage.getItem(STUDENT_STORAGE_KEY);
    if (storedStudent) {
      try {
        const parsedStudent = JSON.parse(storedStudent) as {
          nim: string;
          email: string;
        };
        const resolvedStudent = resolveStudentProfile(
          parsedStudent.nim,
          parsedStudent.email,
          storedStudentProfiles[parsedStudent.email.toLowerCase()],
        );
        setCurrentStudent(resolvedStudent);
      } catch {
        window.localStorage.removeItem(STUDENT_STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(
      STUDENT_APPLICATION_STORAGE_KEY,
      JSON.stringify(studentApplications),
    );
  }, [isHydrated, studentApplications]);

  const syncAuthDirectory = useCallback((records: AuthRecord[]) => {
    const mergedRecords = getMergedAuthDirectory(records);
    saveAuthRecordsToStorage(mergedRecords);
    setAuthRecords(mergedRecords);
  }, []);

  const syncLecturerProfile = useCallback((profile: LecturerProfile) => {
    const nextProfiles = {
      ...readStoredLecturerProfiles(),
      [profile.email.toLowerCase()]: profile,
    };

    saveLecturerProfilesToStorage(nextProfiles);
    setLecturerProfiles(nextProfiles);
    window.localStorage.setItem(
      LECTURER_STORAGE_KEY,
      profile.email.toLowerCase(),
    );
    setCurrentLecturer(profile);
  }, []);

  const syncStudentProfile = useCallback((profile: StudentProfile) => {
    const nextProfiles = {
      ...readStoredStudentProfiles(),
      [profile.email.toLowerCase()]: profile,
    };

    saveStudentProfilesToStorage(nextProfiles);
    setStudentProfiles(nextProfiles);
    window.localStorage.setItem(
      STUDENT_STORAGE_KEY,
      JSON.stringify({ nim: profile.nim, email: profile.email }),
    );
    setCurrentStudent(profile);
  }, []);

  const loginLecturer = useCallback(
    ({ email, password }: LecturerLoginCredentials) => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      if (!/@telkomuniversity\.ac\.id$/i.test(normalizedEmail)) {
        return {
          success: false,
          message: "Gunakan email institusi dosen Telkom University.",
        };
      }

      if (/@student\.telkomuniversity\.ac\.id$/i.test(normalizedEmail)) {
        return {
          success: false,
          message: "Email mahasiswa tidak bisa dipakai untuk portal dosen.",
        };
      }

      const matchedRecord = authRecords.find(
        (record) =>
          record.role === "dosen" &&
          record.email === normalizedEmail &&
          record.password === normalizedPassword,
      );

      if (!matchedRecord) {
        return {
          success: false,
          message:
            "Email atau password dosen tidak cocok. Cek lagi atau register akun baru.",
        };
      }

      const matchedLecturer =
        lecturers.find(
          (lecturer) =>
            lecturer.email.toLowerCase() === normalizedEmail ||
            lecturer.id === matchedRecord.userId,
        ) ?? null;

      if (!matchedLecturer) {
        return {
          success: false,
          message:
            "Profil dosen tidak ditemukan. Register ulang untuk membuat akun baru.",
        };
      }

      window.localStorage.setItem(
        LECTURER_STORAGE_KEY,
        matchedLecturer.email.toLowerCase(),
      );
      window.localStorage.removeItem(STUDENT_STORAGE_KEY);
      setCurrentLecturer(matchedLecturer);
      setCurrentStudent(null);

      return { success: true };
    },
    [authRecords, lecturers],
  );

  const loginStudent = useCallback(
    ({ email, password }: StudentLoginCredentials) => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      if (!/@student\.telkomuniversity\.ac\.id$/i.test(normalizedEmail)) {
        return {
          success: false,
          message: "Gunakan email mahasiswa Telkom University.",
        };
      }

      const matchedRecord = authRecords.find(
        (record) =>
          record.role === "mahasiswa" &&
          record.email === normalizedEmail &&
          record.password === normalizedPassword,
      );

      if (!matchedRecord) {
        return {
          success: false,
          message:
            "Email atau password mahasiswa tidak cocok. Cek lagi atau register akun baru.",
        };
      }

      const matchedStudent =
        students.find(
          (student) =>
            student.email.toLowerCase() === normalizedEmail ||
            student.nim === matchedRecord.userId,
        ) ?? null;

      if (!matchedStudent) {
        return {
          success: false,
          message:
            "Profil mahasiswa tidak ditemukan. Register ulang untuk membuat akun baru.",
        };
      }

      syncStudentProfile(matchedStudent);
      window.localStorage.removeItem(LECTURER_STORAGE_KEY);
      setCurrentLecturer(null);

      return { success: true };
    },
    [authRecords, students, syncStudentProfile],
  );

  const registerLecturer = useCallback(
    (payload: LecturerRegistrationPayload) => {
      const normalizedEmail = payload.email.trim().toLowerCase();
      const normalizedPassword = payload.password.trim();
      const normalizedName = payload.name.trim();
      const normalizedFaculty = payload.faculty.trim();
      const normalizedPosition = payload.position.trim();
      const normalizedNip = payload.nip.trim();
      const normalizedPhone = payload.phone?.trim() ?? "";

      if (!normalizedName) {
        return {
          success: false,
          message: "Nama lengkap dosen wajib diisi.",
        };
      }

      if (!/@telkomuniversity\.ac\.id$/i.test(normalizedEmail)) {
        return {
          success: false,
          message: "Gunakan email institusi dosen Telkom University.",
        };
      }

      if (/@student\.telkomuniversity\.ac\.id$/i.test(normalizedEmail)) {
        return {
          success: false,
          message: "Email mahasiswa tidak bisa dipakai untuk register dosen.",
        };
      }

      if (normalizedPassword.length < 8) {
        return {
          success: false,
          message: "Password minimal 8 karakter.",
        };
      }

      if (!normalizedFaculty) {
        return {
          success: false,
          message: "Fakultas dosen wajib diisi.",
        };
      }

      if (!normalizedPosition) {
        return {
          success: false,
          message: "Posisi atau jabatan dosen wajib diisi.",
        };
      }

      if (!normalizedNip) {
        return {
          success: false,
          message: "NIP dosen wajib diisi.",
        };
      }

      const duplicatedEmail = authRecords.some(
        (record) => record.email === normalizedEmail,
      );

      if (duplicatedEmail) {
        return {
          success: false,
          message: "Email ini sudah terdaftar. Silakan login.",
        };
      }

      const normalizedNipKey = normalizedNip.replace(/\s+/g, "");
      const duplicatedNip = lecturers.some(
        (lecturer) =>
          lecturer.nip.replace(/\s+/g, "") === normalizedNipKey,
      );

      if (duplicatedNip) {
        return {
          success: false,
          message: "NIP dosen sudah digunakan oleh akun lain.",
        };
      }

      const nextLecturerId = createNextLecturerId(lecturers);
      const nextLecturer: LecturerProfile = {
        id: nextLecturerId,
        name: normalizedName,
        phone: normalizedPhone,
        faculty: normalizedFaculty,
        expertise: ["Riset Terapan", "Kolaborasi SDGs", "Project Mentoring"],
        tagline: `Membuka kolaborasi riset melalui ${normalizedFaculty}.`,
        position: normalizedPosition,
        avatarUrl:
          DEFAULT_LECTURER_AVATARS[
            lecturers.length % DEFAULT_LECTURER_AVATARS.length
          ],
        nip: normalizedNip,
        email: normalizedEmail,
      };

      syncLecturerProfile(nextLecturer);
      syncAuthDirectory([
        ...authRecords,
        {
          email: normalizedEmail,
          password: normalizedPassword,
          role: "dosen",
          userId: nextLecturerId,
        },
      ]);
      window.localStorage.removeItem(STUDENT_STORAGE_KEY);
      setCurrentStudent(null);

      return { success: true };
    },
    [authRecords, lecturers, syncAuthDirectory, syncLecturerProfile],
  );

  const registerStudent = useCallback(
    (payload: StudentRegistrationPayload) => {
      const normalizedNim = payload.nim.trim();
      const normalizedEmail = payload.email.trim().toLowerCase();
      const normalizedPassword = payload.password.trim();
      const normalizedName = payload.name.trim();
      const normalizedFaculty = payload.faculty.trim();
      const normalizedProgram = payload.program.trim();
      const normalizedBatch = payload.batch.trim();

      if (!normalizedName) {
        return {
          success: false,
          message: "Nama lengkap mahasiswa wajib diisi.",
        };
      }

      if (!/^\d{10}$/.test(normalizedNim)) {
        return {
          success: false,
          message: "NIM mahasiswa harus terdiri dari 10 digit angka.",
        };
      }

      if (!/@student\.telkomuniversity\.ac\.id$/i.test(normalizedEmail)) {
        return {
          success: false,
          message: "Gunakan email mahasiswa Telkom University.",
        };
      }

      if (normalizedPassword.length < 8) {
        return {
          success: false,
          message: "Password minimal 8 karakter.",
        };
      }

      if (!normalizedFaculty) {
        return {
          success: false,
          message: "Fakultas mahasiswa wajib diisi.",
        };
      }

      if (!normalizedProgram) {
        return {
          success: false,
          message: "Program studi wajib diisi.",
        };
      }

      if (!normalizedBatch) {
        return {
          success: false,
          message: "Angkatan wajib diisi.",
        };
      }

      const duplicatedEmail = authRecords.some(
        (record) => record.email === normalizedEmail,
      );

      if (duplicatedEmail) {
        return {
          success: false,
          message: "Email ini sudah terdaftar. Silakan login.",
        };
      }

      const duplicatedNim = students.some(
        (student) =>
          student.nim === normalizedNim &&
          student.email.toLowerCase() !== normalizedEmail,
      );

      if (duplicatedNim) {
        return {
          success: false,
          message: "NIM mahasiswa sudah digunakan oleh akun lain.",
        };
      }

      const nextStudent = resolveStudentProfile(normalizedNim, normalizedEmail, {
        name: normalizedName,
        faculty: normalizedFaculty,
        program: normalizedProgram,
        batch: normalizedBatch,
        focus: "Eksplorasi riset, ide, dan inovasi kampus",
        phone: "",
        bio: "Mahasiswa baru SDGs Hub. Lengkapi profil agar dosen dapat memahami fokus dan kontribusimu.",
        skills: ["Kolaborasi", "Riset", "Eksplorasi SDGs"],
        cvAttachment: null,
      });

      syncStudentProfile(nextStudent);
      syncAuthDirectory([
        ...authRecords,
        {
          email: normalizedEmail,
          password: normalizedPassword,
          role: "mahasiswa",
          userId: normalizedNim,
        },
      ]);
      window.localStorage.removeItem(LECTURER_STORAGE_KEY);
      setCurrentLecturer(null);

      return { success: true };
    },
    [authRecords, students, syncAuthDirectory, syncStudentProfile],
  );

  const updateStudentProfile = useCallback(
    (updates: Partial<Omit<StudentProfile, "nim" | "email">>) => {
      if (!currentStudent) {
        return;
      }

      const nextProfile = {
        ...currentStudent,
        ...updates,
        skills:
          updates.skills && updates.skills.length > 0
            ? updates.skills
            : currentStudent.skills,
      } satisfies StudentProfile;

      syncStudentProfile(nextProfile);
    },
    [currentStudent, syncStudentProfile],
  );

  const uploadStudentCv = useCallback(
    (payload: StudentCvAttachment) => {
      if (!currentStudent) {
        return {
          success: false,
          message: "Login sebagai mahasiswa terlebih dahulu.",
        };
      }

      if (payload.fileSize > MAX_CV_SIZE_BYTES) {
        return {
          success: false,
          message: "Ukuran CV maksimal 2 MB agar lampiran tetap ringan.",
        };
      }

      if (!/(pdf|msword|wordprocessingml)/i.test(payload.mimeType)) {
        return {
          success: false,
          message: "Upload CV dalam format PDF, DOC, atau DOCX.",
        };
      }

      syncStudentProfile({
        ...currentStudent,
        cvAttachment: payload,
      });

      return { success: true };
    },
    [currentStudent, syncStudentProfile],
  );

  const removeStudentCv = useCallback(() => {
    if (!currentStudent) {
      return;
    }

    syncStudentProfile({
      ...currentStudent,
      cvAttachment: null,
    });
  }, [currentStudent, syncStudentProfile]);

  const applyToResearch = useCallback(
    (payload: {
      projectSlug: string;
      projectTitle: string;
      lecturerName: string;
      role: string;
      note: string;
    }) => {
      if (!currentStudent) {
        return {
          success: false,
          message: "Login sebagai mahasiswa terlebih dahulu untuk mendaftar.",
        };
      }

      if (!currentStudent.cvAttachment) {
        return {
          success: false,
          message: "Upload CV terlebih dahulu sebelum mendaftar penelitian.",
        };
      }

      const duplicateApplication = studentApplications.find(
        (application) =>
          application.studentEmail === currentStudent.email &&
          application.projectSlug === payload.projectSlug,
      );

      if (duplicateApplication) {
        return {
          success: false,
          message: "Kamu sudah pernah mendaftar pada penelitian ini.",
        };
      }

      const application: StudentResearchApplication = {
        id: `req-${Date.now()}`,
        studentEmail: currentStudent.email,
        projectSlug: payload.projectSlug,
        projectTitle: payload.projectTitle,
        lecturerName: payload.lecturerName,
        requestedAt: new Date().toISOString().split("T")[0],
        role: payload.role,
        status: "pending",
        statusUpdatedAt: new Date().toISOString().split("T")[0],
        note:
          payload.note.trim() ||
          "Mahasiswa baru saja mengirim pendaftaran dan menunggu review awal.",
        cvFileName: currentStudent.cvAttachment.fileName,
      };

      setStudentApplications((prev) => [application, ...prev]);

      return {
        success: true,
        message:
          "Pendaftaran penelitian berhasil dikirim untuk direview dosen.",
      };
    },
    [currentStudent, studentApplications],
  );

  const updateStudentApplicationStatus = useCallback(
    (
      applicationId: string,
      status: StudentResearchApplicationStatus,
      note?: string,
    ) => {
      setStudentApplications((prev) =>
        prev.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status,
                statusUpdatedAt: new Date().toISOString().split("T")[0],
                note: note?.trim() || application.note,
              }
            : application,
        ),
      );
    },
    [],
  );

  const logoutStudent = useCallback(() => {
    window.localStorage.removeItem(STUDENT_STORAGE_KEY);
    setCurrentStudent(null);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(LECTURER_STORAGE_KEY);
    window.localStorage.removeItem(STUDENT_STORAGE_KEY);
    setCurrentLecturer(null);
    setCurrentStudent(null);
  }, []);

  const value = useMemo(
    () => ({
      currentLecturer,
      currentStudent,
      lecturers,
      students,
      studentApplications,
      isHydrated,
      loginLecturer,
      loginStudent,
      registerLecturer,
      registerStudent,
      updateStudentProfile,
      uploadStudentCv,
      removeStudentCv,
      applyToResearch,
      updateStudentApplicationStatus,
      logoutStudent,
      logout,
    }),
    [
      applyToResearch,
      currentLecturer,
      currentStudent,
      isHydrated,
      lecturers,
      loginLecturer,
      loginStudent,
      logout,
      logoutStudent,
      registerLecturer,
      registerStudent,
      removeStudentCv,
      studentApplications,
      students,
      updateStudentApplicationStatus,
      updateStudentProfile,
      uploadStudentCv,
    ],
  );

  return (
    <LecturerPortalContext.Provider value={value}>
      {children}
    </LecturerPortalContext.Provider>
  );
}

export function useLecturerPortal() {
  const context = useContext(LecturerPortalContext);

  if (!context) {
    throw new Error(
      "useLecturerPortal must be used within <LecturerPortalProvider>",
    );
  }

  return context;
}
