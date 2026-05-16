import type {
  SdgDistributionItem,
  SdgGoal,
  SdgIndicator,
  SdgNewsItem,
  SdgStat,
  SdgTrendPoint,
} from "@/types/sdgs-public";

type GoalSeed = {
  id: number;
  name: string;
  shortName: string;
  englishName: string;
  color: string;
  foreground?: string;
  imageUrl: string;
  tagline: string;
  summary: string;
  detail: string;
  focusAreas: string[];
  targets: number;
  events: number;
  publications: number;
  actions: number;
};

type IndicatorSeed = {
  code: string;
  title: string;
  description: string;
  value: string;
  unitLabel: string;
  source: string;
  updatedAt: string;
  statusLabel: string;
  baseValue: number;
  direction: "up" | "down" | "steady";
};

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;

const goalSeeds: GoalSeed[] = [
  {
    id: 1,
    name: "Tanpa Kemiskinan",
    shortName: "Kemiskinan",
    englishName: "No Poverty",
    color: "#E5243B",
    imageUrl: image("photo-1500937386664-56d1dfef3854"),
    tagline: "Mengakhiri kemiskinan dalam segala bentuk di semua tempat.",
    summary:
      "SDG 1 memantau akses perlindungan sosial, ketahanan ekonomi keluarga, dan penurunan kemiskinan ekstrem.",
    detail:
      "Fokus utama SDG 1 adalah memastikan rumah tangga rentan mendapat akses layanan dasar, dukungan ekonomi, dan perlindungan dari guncangan sosial maupun bencana.",
    focusAreas: ["Kemiskinan ekstrem", "Perlindungan sosial", "Akses layanan dasar"],
    targets: 7,
    events: 136,
    publications: 18,
    actions: 1485,
  },
  {
    id: 2,
    name: "Tanpa Kelaparan",
    shortName: "Pangan",
    englishName: "Zero Hunger",
    color: "#DDA63A",
    foreground: "#1f2937",
    imageUrl: image("photo-1498837167922-ddd27525d352"),
    tagline: "Mencapai ketahanan pangan, gizi baik, dan pertanian berkelanjutan.",
    summary:
      "SDG 2 melihat keamanan pangan, kualitas gizi, produktivitas pertanian, dan akses rantai pasok pangan.",
    detail:
      "Goal ini menghubungkan intervensi pangan kampus, riset pertanian, edukasi gizi, serta dukungan pada komunitas rentan agar akses pangan makin adil.",
    focusAreas: ["Ketahanan pangan", "Gizi komunitas", "Pertanian berkelanjutan"],
    targets: 8,
    events: 84,
    publications: 22,
    actions: 916,
  },
  {
    id: 3,
    name: "Kehidupan Sehat dan Sejahtera",
    shortName: "Kesehatan",
    englishName: "Good Health and Well-being",
    color: "#4C9F38",
    imageUrl: image("photo-1528605248644-14dd04022da1"),
    tagline: "Menjamin kehidupan sehat dan mendorong kesejahteraan.",
    summary:
      "SDG 3 mengukur akses layanan kesehatan, perilaku hidup sehat, kesehatan mental, dan pencegahan penyakit.",
    detail:
      "Di lingkungan kampus dan komunitas, goal ini diterjemahkan menjadi program preventif, literasi kesehatan, dan penguatan data kesehatan publik.",
    focusAreas: ["Kesehatan preventif", "Kesehatan mental", "Layanan kesehatan"],
    targets: 13,
    events: 128,
    publications: 31,
    actions: 1240,
  },
  {
    id: 4,
    name: "Pendidikan Berkualitas",
    shortName: "Pendidikan",
    englishName: "Quality Education",
    color: "#C5192D",
    imageUrl: image("photo-1522202176988-66273c2fd55f"),
    tagline: "Memastikan pendidikan inklusif, setara, dan berkualitas.",
    summary:
      "SDG 4 memantau akses belajar, kualitas pembelajaran, literasi digital, dan kesempatan pengembangan diri.",
    detail:
      "Goal ini cocok untuk program beasiswa, platform belajar, pelatihan guru, riset pendidikan, dan akses pembelajaran bagi wilayah kurang terlayani.",
    focusAreas: ["Akses belajar", "Literasi digital", "Kualitas pembelajaran"],
    targets: 10,
    events: 165,
    publications: 44,
    actions: 1760,
  },
  {
    id: 5,
    name: "Kesetaraan Gender",
    shortName: "Gender",
    englishName: "Gender Equality",
    color: "#FF3A21",
    imageUrl: image("photo-1521017432531-fbd92d768814"),
    tagline: "Mencapai kesetaraan gender dan memberdayakan semua perempuan.",
    summary:
      "SDG 5 membaca partisipasi setara, keamanan ruang belajar, kepemimpinan, dan akses kesempatan.",
    detail:
      "Indikatornya membantu menilai apakah kebijakan dan program memberi ruang aman, adil, serta setara bagi perempuan dan kelompok rentan.",
    focusAreas: ["Partisipasi setara", "Ruang aman", "Kepemimpinan perempuan"],
    targets: 9,
    events: 76,
    publications: 19,
    actions: 812,
  },
  {
    id: 6,
    name: "Air Bersih dan Sanitasi Layak",
    shortName: "Air Bersih",
    englishName: "Clean Water and Sanitation",
    color: "#26BDE2",
    foreground: "#10303a",
    imageUrl: image("photo-1500530855697-b586d89ba3ee"),
    tagline: "Menjamin ketersediaan dan pengelolaan air bersih berkelanjutan.",
    summary:
      "SDG 6 memantau akses air aman, sanitasi, kualitas air, efisiensi pemakaian, dan konservasi sumber air.",
    detail:
      "Goal ini penting untuk program smart water, pengelolaan limbah, edukasi sanitasi, dan perlindungan sumber daya air.",
    focusAreas: ["Air minum aman", "Sanitasi", "Efisiensi air"],
    targets: 8,
    events: 91,
    publications: 25,
    actions: 990,
  },
  {
    id: 7,
    name: "Energi Bersih dan Terjangkau",
    shortName: "Energi",
    englishName: "Affordable and Clean Energy",
    color: "#FCC30B",
    foreground: "#1f2937",
    imageUrl: image("photo-1509395176047-4a66953fd231"),
    tagline: "Memastikan akses energi yang terjangkau, andal, dan modern.",
    summary:
      "SDG 7 menilai akses energi, efisiensi konsumsi, transisi energi terbarukan, dan literasi energi.",
    detail:
      "Data goal ini membantu membaca kontribusi kampus terhadap energi surya, efisiensi gedung, dan inovasi sistem energi bersih.",
    focusAreas: ["Energi terbarukan", "Efisiensi energi", "Akses energi"],
    targets: 5,
    events: 72,
    publications: 20,
    actions: 740,
  },
  {
    id: 8,
    name: "Pekerjaan Layak dan Pertumbuhan Ekonomi",
    shortName: "Pekerjaan",
    englishName: "Decent Work and Economic Growth",
    color: "#A21942",
    imageUrl: image("photo-1519389950473-47ba0277781c"),
    tagline: "Mendorong pertumbuhan ekonomi inklusif dan pekerjaan layak.",
    summary:
      "SDG 8 melihat kesempatan kerja, kewirausahaan, produktivitas, keselamatan kerja, dan ekonomi kreatif.",
    detail:
      "Goal ini menghubungkan inkubasi bisnis, pelatihan karier, kolaborasi industri, serta penciptaan lapangan kerja yang bermartabat.",
    focusAreas: ["Kewirausahaan", "Kesiapan kerja", "Produktivitas inklusif"],
    targets: 12,
    events: 118,
    publications: 28,
    actions: 1188,
  },
  {
    id: 9,
    name: "Industri, Inovasi dan Infrastruktur",
    shortName: "Inovasi",
    englishName: "Industry, Innovation and Infrastructure",
    color: "#FD6925",
    imageUrl: image("photo-1518770660439-4636190af475"),
    tagline: "Membangun infrastruktur tangguh dan mendorong inovasi.",
    summary:
      "SDG 9 mengukur kapasitas riset, inovasi teknologi, infrastruktur, dan kolaborasi industri.",
    detail:
      "Goal ini cocok untuk menampilkan prototype, publikasi, paten, transfer teknologi, serta proyek berbasis teknologi yang berdampak.",
    focusAreas: ["Riset terapan", "Infrastruktur digital", "Transfer teknologi"],
    targets: 8,
    events: 146,
    publications: 53,
    actions: 1394,
  },
  {
    id: 10,
    name: "Berkurangnya Kesenjangan",
    shortName: "Inklusi",
    englishName: "Reduced Inequalities",
    color: "#DD1367",
    imageUrl: image("photo-1516939884455-1445c8652f83"),
    tagline: "Mengurangi kesenjangan di dalam dan antarwilayah.",
    summary:
      "SDG 10 menilai akses setara, inklusi kelompok rentan, mobilitas sosial, dan kebijakan anti-diskriminasi.",
    detail:
      "Indikatornya membantu melihat apakah program membuka akses, menurunkan hambatan, dan memperluas manfaat untuk kelompok kurang terlayani.",
    focusAreas: ["Inklusi sosial", "Akses setara", "Mobilitas sosial"],
    targets: 10,
    events: 88,
    publications: 21,
    actions: 930,
  },
  {
    id: 11,
    name: "Kota dan Permukiman Berkelanjutan",
    shortName: "Kota",
    englishName: "Sustainable Cities and Communities",
    color: "#FD9D24",
    foreground: "#1f2937",
    imageUrl: image("photo-1496247749665-49cf5b1022e9"),
    tagline: "Mewujudkan kota inklusif, aman, tangguh, dan berkelanjutan.",
    summary:
      "SDG 11 membaca transportasi, ruang publik, kualitas udara, hunian, dan ketahanan kota.",
    detail:
      "Goal ini relevan untuk peta dampak, smart city, mobilitas hijau, pengurangan emisi, dan peningkatan kualitas lingkungan perkotaan.",
    focusAreas: ["Mobilitas hijau", "Kualitas udara", "Ruang publik"],
    targets: 10,
    events: 121,
    publications: 32,
    actions: 1276,
  },
  {
    id: 12,
    name: "Konsumsi dan Produksi yang Bertanggung Jawab",
    shortName: "Konsumsi",
    englishName: "Responsible Consumption and Production",
    color: "#BF8B2E",
    foreground: "#1f2937",
    imageUrl: image("photo-1532996122724-e3c354a0b15b"),
    tagline: "Mendorong pola konsumsi dan produksi yang berkelanjutan.",
    summary:
      "SDG 12 memantau pengurangan sampah, efisiensi material, pengadaan berkelanjutan, dan budaya konsumsi sadar.",
    detail:
      "Goal ini membantu menilai circular economy, pengelolaan sampah, pengurangan plastik, pelaporan keberlanjutan, dan edukasi konsumsi bertanggung jawab.",
    focusAreas: ["Pengurangan sampah", "Circular economy", "Pengadaan hijau"],
    targets: 11,
    events: 97,
    publications: 26,
    actions: 1088,
  },
  {
    id: 13,
    name: "Penanganan Perubahan Iklim",
    shortName: "Iklim",
    englishName: "Climate Action",
    color: "#3F7E44",
    imageUrl: image("photo-1473448912268-2022ce9509d8"),
    tagline: "Mengambil aksi cepat untuk melawan perubahan iklim.",
    summary:
      "SDG 13 menilai mitigasi, adaptasi, literasi iklim, emisi, dan kesiapsiagaan bencana.",
    detail:
      "Goal ini menjadi rumah data untuk proyek pengurangan emisi, riset adaptasi, kampanye iklim, dan penguatan resiliensi komunitas.",
    focusAreas: ["Mitigasi emisi", "Adaptasi iklim", "Literasi iklim"],
    targets: 5,
    events: 103,
    publications: 35,
    actions: 1162,
  },
  {
    id: 14,
    name: "Ekosistem Lautan",
    shortName: "Lautan",
    englishName: "Life Below Water",
    color: "#0A97D9",
    imageUrl: image("photo-1507525428034-b723cf961d3e"),
    tagline: "Melestarikan dan memanfaatkan laut secara berkelanjutan.",
    summary:
      "SDG 14 memantau kualitas ekosistem laut, polusi air, konservasi, dan ekonomi pesisir.",
    detail:
      "Walau kampus berada di daratan, kontribusi dapat muncul melalui riset sensor, edukasi sampah, pengolahan limbah, dan kolaborasi pesisir.",
    focusAreas: ["Polusi laut", "Konservasi pesisir", "Ekonomi biru"],
    targets: 10,
    events: 54,
    publications: 16,
    actions: 602,
  },
  {
    id: 15,
    name: "Ekosistem Daratan",
    shortName: "Daratan",
    englishName: "Life on Land",
    color: "#56C02B",
    foreground: "#103018",
    imageUrl: image("photo-1501004318641-b39e6451bec6"),
    tagline: "Melindungi, memulihkan, dan mendukung ekosistem daratan.",
    summary:
      "SDG 15 mengukur biodiversitas, rehabilitasi lahan, ruang hijau, dan perlindungan habitat.",
    detail:
      "Goal ini mencakup konservasi, pemetaan vegetasi, urban farming, penanaman pohon, dan edukasi keanekaragaman hayati.",
    focusAreas: ["Biodiversitas", "Ruang hijau", "Rehabilitasi lahan"],
    targets: 12,
    events: 82,
    publications: 24,
    actions: 940,
  },
  {
    id: 16,
    name: "Perdamaian, Keadilan dan Kelembagaan Tangguh",
    shortName: "Keadilan",
    englishName: "Peace, Justice and Strong Institutions",
    color: "#00689D",
    imageUrl: image("photo-1516321497487-e288fb19713f"),
    tagline: "Mendukung masyarakat damai, adil, dan institusi akuntabel.",
    summary:
      "SDG 16 memantau tata kelola, transparansi, literasi hukum, keamanan digital, dan partisipasi publik.",
    detail:
      "Data goal ini membantu menilai program anti-kekerasan, perlindungan data, akuntabilitas layanan, dan kapasitas kelembagaan.",
    focusAreas: ["Tata kelola", "Keamanan digital", "Partisipasi publik"],
    targets: 12,
    events: 69,
    publications: 23,
    actions: 710,
  },
  {
    id: 17,
    name: "Kemitraan untuk Mencapai Tujuan",
    shortName: "Kemitraan",
    englishName: "Partnerships for the Goals",
    color: "#19486A",
    imageUrl: image("photo-1528605248644-14dd04022da1"),
    tagline: "Menguatkan kemitraan global untuk pembangunan berkelanjutan.",
    summary:
      "SDG 17 melihat kolaborasi lintas sektor, pendanaan, data, publikasi bersama, dan jejaring implementasi.",
    detail:
      "Goal ini menjadi penghubung seluruh SDGs karena dampak berkelanjutan butuh kolaborasi kampus, industri, pemerintah, komunitas, dan mitra global.",
    focusAreas: ["Kemitraan", "Data terbuka", "Pendanaan dampak"],
    targets: 19,
    events: 143,
    publications: 38,
    actions: 1544,
  },
];

const indicatorSeedsByGoal: Record<number, IndicatorSeed[]> = {
  1: [
    {
      code: "1.1.1",
      title: "Proporsi penduduk di bawah garis kemiskinan internasional",
      description:
        "Memantau kelompok yang hidup di bawah batas kemiskinan ekstrem dan membutuhkan intervensi perlindungan dasar.",
      value: "3.9%",
      unitLabel: "Capaian 2026",
      source: "Dashboard DCS, survei program komunitas",
      updatedAt: "Mei 2026",
      statusLabel: "Turun 0.8 poin",
      baseValue: 3.9,
      direction: "down",
    },
    {
      code: "1.2.1",
      title: "Proporsi penduduk di bawah garis kemiskinan nasional",
      description:
        "Mengukur tingkat kemiskinan nasional pada komunitas dampingan dan wilayah prioritas.",
      value: "12.64%",
      unitLabel: "Capaian 2026",
      source: "Data program sosial dan ekonomi lokal",
      updatedAt: "Mei 2026",
      statusLabel: "Membaik",
      baseValue: 12.64,
      direction: "down",
    },
    {
      code: "1.3.1",
      title: "Cakupan perlindungan sosial bagi kelompok rentan",
      description:
        "Melihat jangkauan bantuan, pendampingan, dan akses layanan sosial untuk rumah tangga rentan.",
      value: "68%",
      unitLabel: "Penerima terlayani",
      source: "Rekap program pengabdian masyarakat",
      updatedAt: "April 2026",
      statusLabel: "Naik 9%",
      baseValue: 68,
      direction: "up",
    },
  ],
  2: [
    {
      code: "2.1.1",
      title: "Prevalensi kerawanan pangan",
      description: "Membaca akses pangan aman dan cukup pada komunitas sasaran.",
      value: "8.7%",
      unitLabel: "Rumah tangga rentan",
      source: "Survei gizi dan pangan komunitas",
      updatedAt: "April 2026",
      statusLabel: "Turun",
      baseValue: 8.7,
      direction: "down",
    },
    {
      code: "2.2.2",
      title: "Cakupan edukasi gizi keluarga",
      description: "Mengukur partisipasi keluarga dalam program literasi gizi dan pangan sehat.",
      value: "74%",
      unitLabel: "Peserta aktif",
      source: "Program edukasi pangan DCS",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 74,
      direction: "up",
    },
    {
      code: "2.4.1",
      title: "Luas area pertanian berkelanjutan",
      description: "Memantau area demonstrasi pertanian, urban farming, dan praktik tanam rendah limbah.",
      value: "18 ha",
      unitLabel: "Area dampingan",
      source: "Catatan program pertanian komunitas",
      updatedAt: "Maret 2026",
      statusLabel: "Stabil",
      baseValue: 18,
      direction: "steady",
    },
  ],
  3: [
    {
      code: "3.4.1",
      title: "Cakupan program kesehatan preventif",
      description: "Mengukur penerima manfaat program screening, edukasi, dan layanan preventif.",
      value: "81%",
      unitLabel: "Cakupan peserta",
      source: "Rekap layanan kesehatan kampus",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 81,
      direction: "up",
    },
    {
      code: "3.8.1",
      title: "Akses layanan kesehatan esensial",
      description: "Melihat kemudahan akses layanan dasar, rujukan, dan edukasi kesehatan.",
      value: "76%",
      unitLabel: "Cakupan layanan",
      source: "Survei akses layanan",
      updatedAt: "April 2026",
      statusLabel: "Naik 6%",
      baseValue: 76,
      direction: "up",
    },
    {
      code: "3.d.1",
      title: "Kesiapan edukasi risiko kesehatan",
      description: "Menilai kemampuan kanal kampus dan komunitas merespons risiko kesehatan publik.",
      value: "69%",
      unitLabel: "Skor kesiapan",
      source: "Audit program kesehatan publik",
      updatedAt: "April 2026",
      statusLabel: "Membaik",
      baseValue: 69,
      direction: "up",
    },
  ],
  4: [
    {
      code: "4.1.1",
      title: "Capaian pembelajaran dasar",
      description: "Memantau peningkatan literasi dan numerasi peserta program pendidikan.",
      value: "78%",
      unitLabel: "Peserta tuntas",
      source: "Evaluasi program belajar",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 78,
      direction: "up",
    },
    {
      code: "4.3.1",
      title: "Partisipasi pendidikan tinggi dan pelatihan",
      description: "Mengukur akses pelatihan, kursus, dan kesempatan pembelajaran lanjut.",
      value: "62%",
      unitLabel: "Partisipasi aktif",
      source: "Data program pelatihan",
      updatedAt: "April 2026",
      statusLabel: "Naik 8%",
      baseValue: 62,
      direction: "up",
    },
    {
      code: "4.4.1",
      title: "Keterampilan digital pemuda",
      description: "Melihat proporsi peserta yang menguasai kompetensi digital dasar dan produktif.",
      value: "71%",
      unitLabel: "Peserta kompeten",
      source: "Assessment literasi digital",
      updatedAt: "Mei 2026",
      statusLabel: "Membaik",
      baseValue: 71,
      direction: "up",
    },
  ],
  5: [
    {
      code: "5.1.1",
      title: "Kebijakan anti-diskriminasi gender",
      description: "Menilai ketersediaan aturan dan mekanisme perlindungan yang bisa diakses.",
      value: "86%",
      unitLabel: "Kepatuhan unit",
      source: "Audit kebijakan internal",
      updatedAt: "April 2026",
      statusLabel: "Meningkat",
      baseValue: 86,
      direction: "up",
    },
    {
      code: "5.5.1",
      title: "Partisipasi perempuan dalam kepemimpinan",
      description: "Mengukur representasi perempuan dalam struktur program, riset, dan komunitas.",
      value: "47%",
      unitLabel: "Representasi",
      source: "Data organisasi dan program",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 47,
      direction: "up",
    },
    {
      code: "5.b.1",
      title: "Akses teknologi bagi perempuan",
      description: "Melihat akses pelatihan, perangkat, dan literasi teknologi untuk peserta perempuan.",
      value: "73%",
      unitLabel: "Akses aktif",
      source: "Program literasi digital inklusif",
      updatedAt: "Maret 2026",
      statusLabel: "Membaik",
      baseValue: 73,
      direction: "up",
    },
  ],
  6: [
    {
      code: "6.1.1",
      title: "Akses air minum aman",
      description: "Mengukur titik layanan dan rumah tangga yang memiliki akses air aman.",
      value: "84%",
      unitLabel: "Cakupan akses",
      source: "Audit air dan sanitasi",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 84,
      direction: "up",
    },
    {
      code: "6.3.1",
      title: "Kualitas pengolahan air limbah",
      description: "Menilai proporsi air limbah yang dikelola atau dipantau dengan standar layak.",
      value: "66%",
      unitLabel: "Terkelola",
      source: "Monitoring fasilitas air",
      updatedAt: "April 2026",
      statusLabel: "Membaik",
      baseValue: 66,
      direction: "up",
    },
    {
      code: "6.4.1",
      title: "Efisiensi penggunaan air",
      description: "Mengukur perubahan konsumsi air pada fasilitas dan program dampingan.",
      value: "14%",
      unitLabel: "Penghematan",
      source: "Smart water dashboard",
      updatedAt: "Mei 2026",
      statusLabel: "Lebih efisien",
      baseValue: 14,
      direction: "up",
    },
  ],
  7: [
    {
      code: "7.2.1",
      title: "Porsi energi terbarukan",
      description: "Melihat kontribusi energi bersih terhadap kebutuhan energi program dan fasilitas.",
      value: "21%",
      unitLabel: "Porsi energi",
      source: "Dashboard energi kampus",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 21,
      direction: "up",
    },
    {
      code: "7.3.1",
      title: "Intensitas konsumsi energi",
      description: "Mengukur efisiensi penggunaan energi pada gedung dan kegiatan prioritas.",
      value: "11%",
      unitLabel: "Penurunan intensitas",
      source: "Audit energi semesteran",
      updatedAt: "April 2026",
      statusLabel: "Turun",
      baseValue: 11,
      direction: "down",
    },
    {
      code: "7.b.1",
      title: "Investasi infrastruktur energi bersih",
      description: "Memantau belanja dan dukungan infrastruktur untuk energi bersih.",
      value: "5 proyek",
      unitLabel: "Proyek aktif",
      source: "Portofolio proyek energi",
      updatedAt: "Maret 2026",
      statusLabel: "Bertambah",
      baseValue: 5,
      direction: "up",
    },
  ],
  8: [
    {
      code: "8.3.1",
      title: "Dukungan kewirausahaan dan UMKM",
      description: "Mengukur penerima manfaat pelatihan, inkubasi, dan akses pasar.",
      value: "132 UMKM",
      unitLabel: "Terdampingi",
      source: "Rekap inkubasi bisnis",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 132,
      direction: "up",
    },
    {
      code: "8.5.2",
      title: "Tingkat kesiapan kerja peserta",
      description: "Menilai kesiapan peserta memasuki kerja layak melalui asesmen kompetensi.",
      value: "77%",
      unitLabel: "Siap kerja",
      source: "Career readiness survey",
      updatedAt: "April 2026",
      statusLabel: "Membaik",
      baseValue: 77,
      direction: "up",
    },
    {
      code: "8.8.1",
      title: "Kepatuhan keselamatan kerja",
      description: "Memantau penerapan standar keselamatan pada program dan kegiatan lapangan.",
      value: "91%",
      unitLabel: "Kepatuhan",
      source: "Audit keselamatan kegiatan",
      updatedAt: "Mei 2026",
      statusLabel: "Stabil tinggi",
      baseValue: 91,
      direction: "steady",
    },
  ],
  9: [
    {
      code: "9.5.1",
      title: "Intensitas riset dan pengembangan",
      description: "Melihat jumlah output riset, prototype, dan publikasi teknologi terapan.",
      value: "53 output",
      unitLabel: "Output R&D",
      source: "Repository riset DCS",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 53,
      direction: "up",
    },
    {
      code: "9.b.1",
      title: "Dukungan inovasi teknologi lokal",
      description: "Mengukur jumlah inovasi yang diuji, didampingi, atau siap diadopsi mitra.",
      value: "34 inovasi",
      unitLabel: "Inovasi aktif",
      source: "Portofolio inovasi",
      updatedAt: "April 2026",
      statusLabel: "Bertambah",
      baseValue: 34,
      direction: "up",
    },
    {
      code: "9.c.1",
      title: "Akses infrastruktur digital",
      description: "Memantau cakupan akses konektivitas dan layanan digital pada lokasi dampingan.",
      value: "82%",
      unitLabel: "Cakupan",
      source: "Monitoring program digital",
      updatedAt: "Maret 2026",
      statusLabel: "Membaik",
      baseValue: 82,
      direction: "up",
    },
  ],
  10: [
    {
      code: "10.2.1",
      title: "Inklusi sosial kelompok rentan",
      description: "Mengukur partisipasi kelompok rentan dalam program dan layanan kampus-komunitas.",
      value: "64%",
      unitLabel: "Partisipasi",
      source: "Survei inklusi program",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 64,
      direction: "up",
    },
    {
      code: "10.3.1",
      title: "Aduan diskriminasi yang tertangani",
      description: "Memantau respons terhadap aduan dan tindak lanjut perlindungan akses setara.",
      value: "92%",
      unitLabel: "Tertangani",
      source: "Sistem layanan aduan",
      updatedAt: "April 2026",
      statusLabel: "Stabil",
      baseValue: 92,
      direction: "steady",
    },
    {
      code: "10.4.1",
      title: "Dukungan kebijakan inklusif",
      description: "Menilai program yang memasukkan prinsip inklusi dan pemerataan manfaat.",
      value: "71%",
      unitLabel: "Program selaras",
      source: "Audit desain program",
      updatedAt: "Mei 2026",
      statusLabel: "Meningkat",
      baseValue: 71,
      direction: "up",
    },
  ],
  11: [
    {
      code: "11.2.1",
      title: "Akses mobilitas berkelanjutan",
      description: "Membaca jangkauan transportasi rendah emisi, jalur aman, dan program mobilitas hijau.",
      value: "57%",
      unitLabel: "Cakupan akses",
      source: "Peta mobilitas kampus",
      updatedAt: "Mei 2026",
      statusLabel: "Naik",
      baseValue: 57,
      direction: "up",
    },
    {
      code: "11.6.2",
      title: "Kualitas udara area prioritas",
      description: "Memantau konsentrasi polutan dan kualitas udara di area kegiatan.",
      value: "21 AQI",
      unitLabel: "Rata-rata perbaikan",
      source: "Sensor kualitas udara",
      updatedAt: "April 2026",
      statusLabel: "Lebih baik",
      baseValue: 21,
      direction: "down",
    },
    {
      code: "11.7.1",
      title: "Akses ruang publik hijau",
      description: "Mengukur proporsi area yang bisa digunakan untuk aktivitas publik dan ruang hijau.",
      value: "38%",
      unitLabel: "Area terbuka",
      source: "Peta ruang publik",
      updatedAt: "Maret 2026",
      statusLabel: "Bertambah",
      baseValue: 38,
      direction: "up",
    },
  ],
  12: [
    {
      code: "12.2.1",
      title: "Efisiensi penggunaan material",
      description: "Memantau konsumsi material, reuse, dan efisiensi sumber daya dalam program prioritas.",
      value: "18%",
      unitLabel: "Penghematan material",
      source: "Audit material program",
      updatedAt: "Mei 2026",
      statusLabel: "Lebih efisien",
      baseValue: 18,
      direction: "up",
    },
    {
      code: "12.5.1",
      title: "Pengurangan sampah melalui reuse dan daur ulang",
      description: "Mengukur sampah yang berhasil dicegah, dipilah, digunakan ulang, atau didaur ulang.",
      value: "42%",
      unitLabel: "Sampah teralihkan",
      source: "Dashboard waste management",
      updatedAt: "Mei 2026",
      statusLabel: "Naik 12%",
      baseValue: 42,
      direction: "up",
    },
    {
      code: "12.6.1",
      title: "Pelaporan keberlanjutan organisasi",
      description: "Melihat unit dan mitra yang mulai mencatat dampak lingkungan serta sosial secara rutin.",
      value: "29 laporan",
      unitLabel: "Laporan aktif",
      source: "Rekap laporan sustainability",
      updatedAt: "April 2026",
      statusLabel: "Bertambah",
      baseValue: 29,
      direction: "up",
    },
  ],
  13: [
    {
      code: "13.1.1",
      title: "Kesiapan menghadapi risiko iklim",
      description: "Menilai kapasitas adaptasi, mitigasi risiko, dan protokol kesiapsiagaan.",
      value: "72%",
      unitLabel: "Skor resiliensi",
      source: "Audit risiko iklim",
      updatedAt: "Mei 2026",
      statusLabel: "Membaik",
      baseValue: 72,
      direction: "up",
    },
    {
      code: "13.2.2",
      title: "Estimasi penurunan emisi program",
      description: "Mengukur kontribusi program pada pengurangan emisi karbon operasional.",
      value: "18.4 tCO2e",
      unitLabel: "Terhindarkan",
      source: "Kalkulator emisi DCS",
      updatedAt: "April 2026",
      statusLabel: "Naik",
      baseValue: 18.4,
      direction: "up",
    },
    {
      code: "13.3.1",
      title: "Literasi iklim peserta program",
      description: "Memantau pemahaman peserta tentang krisis iklim dan aksi yang bisa dilakukan.",
      value: "79%",
      unitLabel: "Skor literasi",
      source: "Pre-post test edukasi iklim",
      updatedAt: "Mei 2026",
      statusLabel: "Meningkat",
      baseValue: 79,
      direction: "up",
    },
  ],
  14: [
    {
      code: "14.1.1",
      title: "Pengurangan potensi sampah ke perairan",
      description: "Memantau sampah yang dicegah masuk ke drainase, sungai, dan wilayah pesisir.",
      value: "16 ton",
      unitLabel: "Sampah dicegah",
      source: "Program pengurangan sampah",
      updatedAt: "April 2026",
      statusLabel: "Naik",
      baseValue: 16,
      direction: "up",
    },
    {
      code: "14.2.1",
      title: "Dukungan konservasi pesisir",
      description: "Mengukur area atau komunitas pesisir yang mendapat intervensi konservasi.",
      value: "9 lokasi",
      unitLabel: "Lokasi dampingan",
      source: "Portofolio konservasi",
      updatedAt: "Maret 2026",
      statusLabel: "Bertambah",
      baseValue: 9,
      direction: "up",
    },
    {
      code: "14.a.1",
      title: "Riset dan teknologi kelautan",
      description: "Melihat output riset sensor, pemetaan, dan edukasi yang relevan dengan ekosistem laut.",
      value: "12 output",
      unitLabel: "Output riset",
      source: "Repository riset kelautan",
      updatedAt: "Mei 2026",
      statusLabel: "Meningkat",
      baseValue: 12,
      direction: "up",
    },
  ],
  15: [
    {
      code: "15.1.1",
      title: "Area ruang hijau dan konservasi",
      description: "Mengukur area yang dipulihkan, ditanami, atau dikelola sebagai ruang hijau.",
      value: "24 ha",
      unitLabel: "Area hijau",
      source: "Peta konservasi daratan",
      updatedAt: "Mei 2026",
      statusLabel: "Bertambah",
      baseValue: 24,
      direction: "up",
    },
    {
      code: "15.5.1",
      title: "Perlindungan keanekaragaman hayati",
      description: "Memantau kegiatan edukasi, inventarisasi spesies, dan perlindungan habitat.",
      value: "38 spesies",
      unitLabel: "Tercatat",
      source: "Inventaris biodiversitas",
      updatedAt: "April 2026",
      statusLabel: "Naik",
      baseValue: 38,
      direction: "up",
    },
    {
      code: "15.9.1",
      title: "Integrasi nilai ekosistem dalam program",
      description: "Menilai program yang memasukkan prinsip perlindungan ekosistem daratan.",
      value: "67%",
      unitLabel: "Program selaras",
      source: "Audit desain program",
      updatedAt: "Mei 2026",
      statusLabel: "Membaik",
      baseValue: 67,
      direction: "up",
    },
  ],
  16: [
    {
      code: "16.6.1",
      title: "Akuntabilitas layanan dan program",
      description: "Mengukur transparansi pelaporan, dokumentasi keputusan, dan tindak lanjut layanan.",
      value: "88%",
      unitLabel: "Kepatuhan",
      source: "Audit tata kelola program",
      updatedAt: "Mei 2026",
      statusLabel: "Stabil",
      baseValue: 88,
      direction: "steady",
    },
    {
      code: "16.7.1",
      title: "Partisipasi pemangku kepentingan",
      description: "Melihat keterlibatan komunitas, mitra, dan penerima manfaat dalam pengambilan keputusan.",
      value: "73%",
      unitLabel: "Partisipasi",
      source: "Survei kolaborasi",
      updatedAt: "April 2026",
      statusLabel: "Naik",
      baseValue: 73,
      direction: "up",
    },
    {
      code: "16.10.2",
      title: "Kebijakan akses informasi publik",
      description: "Memantau ketersediaan informasi program yang mudah diakses dan diperbarui.",
      value: "82%",
      unitLabel: "Keterbukaan",
      source: "Audit kanal informasi",
      updatedAt: "Maret 2026",
      statusLabel: "Meningkat",
      baseValue: 82,
      direction: "up",
    },
  ],
  17: [
    {
      code: "17.6.1",
      title: "Kolaborasi pengetahuan dan riset",
      description: "Mengukur kerja sama riset, publikasi bersama, dan transfer pengetahuan lintas institusi.",
      value: "42 mitra",
      unitLabel: "Mitra aktif",
      source: "Database kemitraan DCS",
      updatedAt: "Mei 2026",
      statusLabel: "Bertambah",
      baseValue: 42,
      direction: "up",
    },
    {
      code: "17.16.1",
      title: "Kemitraan multi-pihak untuk SDGs",
      description: "Memantau inisiatif yang melibatkan kampus, industri, pemerintah, dan komunitas.",
      value: "31 program",
      unitLabel: "Program kolaboratif",
      source: "Portofolio kemitraan",
      updatedAt: "April 2026",
      statusLabel: "Naik",
      baseValue: 31,
      direction: "up",
    },
    {
      code: "17.18.1",
      title: "Ketersediaan data dampak",
      description: "Menilai kelengkapan data indikator yang bisa dipakai untuk pelaporan dan keputusan.",
      value: "79%",
      unitLabel: "Data lengkap",
      source: "Dashboard data dampak",
      updatedAt: "Mei 2026",
      statusLabel: "Membaik",
      baseValue: 79,
      direction: "up",
    },
  ],
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const slugifyGoal = (goal: GoalSeed) =>
  `sdg-${goal.id}-${goal.shortName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

function buildTrend(seed: IndicatorSeed): SdgTrendPoint[] {
  const years = ["2022", "2023", "2024", "2025", "2026"];
  const directionSign = seed.direction === "down" ? 1 : seed.direction === "up" ? -1 : 0.2;
  const spread = Math.max(1.2, seed.baseValue * 0.12);

  return years.map((year, index) => {
    const remaining = years.length - index - 1;
    const value =
      seed.direction === "steady"
        ? seed.baseValue + (index % 2 === 0 ? 0.6 : -0.4)
        : seed.baseValue + remaining * spread * directionSign;

    return {
      year,
      value: Number(value.toFixed(2)),
    };
  });
}

function buildDistribution(goal: GoalSeed, seed: IndicatorSeed): SdgDistributionItem[] {
  return goal.focusAreas.map((label, index) => ({
    label,
    value: Math.min(96, Math.max(18, Math.round(seed.baseValue * (0.52 + index * 0.16) + goal.id * 2))),
    max: 100,
  }));
}

function buildStats(goal: GoalSeed): SdgStat[] {
  return [
    {
      label: "Target",
      value: String(goal.targets),
      description: "Target SDG yang dipetakan",
    },
    {
      label: "Program",
      value: String(Math.max(6, Math.round(goal.actions / 80))),
      description: "Program dan aksi terdokumentasi",
    },
    {
      label: "Publikasi",
      value: String(goal.publications),
      description: "Riset, laporan, dan artikel",
    },
    {
      label: "Event",
      value: String(goal.events),
      description: "Aktivitas edukasi dan kolaborasi",
    },
  ];
}

function buildNews(goal: GoalSeed): SdgNewsItem[] {
  return [
    {
      title: `DCS perkuat dashboard dampak untuk ${goal.name}`,
      excerpt: `Ringkasan data ${goal.shortName.toLowerCase()} kini dikurasi menjadi indikator yang lebih mudah dibaca oleh publik dan mitra.`,
      date: "16 Mei 2026",
      category: "Dashboard",
      href: "/news",
    },
    {
      title: `Program kolaborasi ${goal.shortName.toLowerCase()} masuk fase pemantauan`,
      excerpt: "Tim mulai menghubungkan laporan lapangan, bukti kegiatan, dan capaian indikator agar evaluasi program lebih presisi.",
      date: "12 Mei 2026",
      category: "Program",
      href: "/program",
    },
    {
      title: `Riset mahasiswa dorong aksi ${goal.englishName}`,
      excerpt: "Mahasiswa dan dosen menguji pendekatan berbasis data untuk memperkuat dampak SDGs di komunitas prioritas.",
      date: "7 Mei 2026",
      category: "Riset",
      href: "/sdgs-hub/riset",
    },
  ];
}

function buildInsights(goal: GoalSeed, seed: IndicatorSeed) {
  return [
    `${seed.title} menjadi sinyal utama untuk membaca kemajuan ${goal.shortName.toLowerCase()}.`,
    `Tren 2022-2026 menunjukkan arah ${seed.direction === "down" ? "penurunan risiko" : "perbaikan capaian"} pada lokasi dampingan.`,
    `Data perlu diperbarui berkala agar keputusan program tetap berbasis bukti.`,
  ];
}

function buildRelatedPrograms(goal: GoalSeed) {
  return [
    `Program prioritas ${goal.shortName}`,
    `Riset terapan ${goal.englishName}`,
    `Kolaborasi komunitas SDG ${goal.id}`,
  ];
}

function buildIndicators(goal: GoalSeed): SdgIndicator[] {
  return indicatorSeedsByGoal[goal.id].map((seed, index) => ({
    ...seed,
    imageUrl: index === 0 ? goal.imageUrl : image(index === 1 ? "photo-1497366754035-f200968a6e72" : "photo-1517048676732-d65bc937f952"),
    trend: buildTrend(seed),
    distribution: buildDistribution(goal, seed),
    insights: buildInsights(goal, seed),
    relatedPrograms: buildRelatedPrograms(goal),
  }));
}

const sdgGoals: SdgGoal[] = goalSeeds.map((goal) => ({
  ...goal,
  slug: slugifyGoal(goal),
  foreground: goal.foreground ?? "#ffffff",
  stats: buildStats(goal),
  indicators: buildIndicators(goal),
  news: buildNews(goal),
}));

function findGoal(goalParam: string | number) {
  const normalized = String(goalParam).toLowerCase().trim();
  const numberFromParam = Number(normalized.replace(/^sdg-/, ""));

  return (
    sdgGoals.find((goal) => goal.slug === normalized) ??
    sdgGoals.find((goal) => String(goal.id) === normalized) ??
    sdgGoals.find((goal) => goal.id === numberFromParam) ??
    null
  );
}

export function getSdgGoalSlugs() {
  return sdgGoals.map((goal) => goal.slug);
}

export function getSdgGoalByParam(goalParam: string | number) {
  return findGoal(goalParam);
}

export function getSdgGoalsSnapshot() {
  return sdgGoals;
}

export const sdgsPublicService = {
  async listGoals(): Promise<SdgGoal[]> {
    await wait(90);
    return sdgGoals;
  },

  async getGoal(goalParam: string | number): Promise<SdgGoal | null> {
    await wait(90);
    return findGoal(goalParam);
  },
};
