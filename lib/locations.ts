/*
  Shared locations utilities: complete Indonesia provinces + selected cities, 
  normalization helpers, and lookup.
*/

export type LngLat = [number, number]; // [lng, lat]

// Canonical province coordinates (approx city/capital centroid)
export const PROVINCE_COORDS: Record<string, LngLat> = {
  Aceh: [95.3238, 5.5483], // Banda Aceh
  "Sumatera Utara": [98.6523, 3.5952], // Medan
  "Sumatera Barat": [100.3543, -0.9492], // Padang
  Riau: [101.4478, 0.5071], // Pekanbaru
  "Kepulauan Riau": [104.458, 0.9181], // Tanjung Pinang
  Jambi: [103.617, -1.61],
  "Sumatera Selatan": [104.745, -2.976], // Palembang
  "Kepulauan Bangka Belitung": [106.11, -2.129], // Pangkal Pinang
  Bengkulu: [102.265, -3.8],
  Lampung: [105.266, -5.429], // Bandar Lampung
  "DKI Jakarta": [106.8456, -6.2088],
  "Jawa Barat": [107.6098, -6.9147], // Bandung
  "Jawa Tengah": [110.4203, -6.9667], // Semarang
  "DI Yogyakarta": [110.367, -7.801], // Yogyakarta
  "Jawa Timur": [112.7508, -7.2575], // Surabaya
  Banten: [106.1542, -6.1202], // Serang
  Bali: [115.2167, -8.65], // Denpasar
  "Nusa Tenggara Barat": [116.1167, -8.5833], // Mataram
  "Nusa Tenggara Timur": [123.583, -10.1788], // Kupang
  "Kalimantan Barat": [109.344, -0.026], // Pontianak
  "Kalimantan Tengah": [113.921, -2.2096], // Palangka Raya
  "Kalimantan Selatan": [114.592, -3.319], // Banjarmasin
  "Kalimantan Timur": [117.148, -0.502], // Samarinda
  "Kalimantan Utara": [117.371, 2.835], // Tanjung Selor
  "Sulawesi Utara": [124.845, 1.474], // Manado
  "Sulawesi Tengah": [119.871, -0.898], // Palu
  "Sulawesi Selatan": [119.431, -5.147], // Makassar
  "Sulawesi Tenggara": [122.516, -3.998], // Kendari
  Gorontalo: [123.058, 0.537],
  "Sulawesi Barat": [118.888, -2.674], // Mamuju
  Maluku: [128.19, -3.655], // Ambon
  "Maluku Utara": [127.597, 0.855], // Sofifi
  "Papua Barat": [134.064, -0.861], // Manokwari
  "Papua Barat Daya": [131.254, -0.876], // Sorong
  Papua: [140.669, -2.5916], // Jayapura
  "Papua Tengah": [135.497, -3.359], // Nabire
  "Papua Pegunungan": [138.957, -4.098], // Wamena
  "Papua Selatan": [140.406, -8.493], // Merauke
};

// A selection of frequently used cities in this project (can grow)
export const CITY_COORDS: Record<string, LngLat> = {
  Jakarta: [106.8456, -6.2088],
  "Telkom University Bandung": [107.6098, -6.9147],
  Bandung: [107.6098, -6.9147],
  Cirebon: [108.55, -6.737],
  Semarang: [110.4203, -6.9667],
  Kuningan: [108.4833, -6.9833],
  "Kab. Garut": [107.9025, -7.2278],
  Garut: [107.9025, -7.2278],
  Banten: [106.1542, -6.1202],
  "Kab. Serang": [106.1542, -6.1202],
  "Kab. Pandeglang": [106.105, -6.308],
  Bantaeng: [120.025, -5.5333],
  Bone: [120.35, -4.5389],
  Surabaya: [112.7508, -7.2575],
  Malang: [112.6304, -7.9839],
  Karanganyar: [111.046, -7.616],
  Purbalingga: [109.36, -7.39],
  "Kab. Bandung": [107.6098, -6.9147],
  "Kab. Cianjur": [107.142, -6.82],
  "Kab. Sukabumi": [106.9269, -6.9273],
  "Kab. Majalengka": [108.227, -6.836],
  Yogyakarta: [110.367, -7.801],
  "Gunung Kidul": [110.598, -7.965],
  Gowa: [119.475, -5.245],
  Bali: [115.2167, -8.65],
  "Kab. Karawang": [107.297, -6.301],
  Karawang: [107.297, -6.301],
  Pati: [111.04, -6.75],
  "Kab. Purwakarta": [107.443, -6.556],
  Pekalongan: [109.675, -6.888],
  "Kab. Blora": [111.4186, -7.0015],
  "Kab. Magelang": [110.217, -7.476],
  "Kab. Bantul": [110.333, -7.885],
  Bantul: [110.333, -7.885],
  "Kab. Klaten": [110.606, -7.704],
  "Kab. Banjarnegara": [109.7, -7.4],
  "Kab. Purworejo": [110.008, -7.713],
  "Cipadung Kidul": [107.704, -6.921],
  "Antapani Bandung": [107.665, -6.913],
  "Kab Indramayu": [108.32, -6.326],
  Indramayu: [108.32, -6.326],
  Pangandaran: [108.659, -7.689],
  Tarumajaya: [106.977, -6.099],
  "Telyu Bandung": [107.6098, -6.9147],
  "Kepulauan Seribu": [106.612, -5.744],
  Pangalengan: [107.6, -7.162],
  "Pontianak (Kalimantan Barat)": [109.344, -0.026],
};

// Aliases and normalization mapping
const ALIASES: Record<string, string> = {
  // Provinces
  "dki jakarta": "DKI Jakarta",
  jakarta: "DKI Jakarta",
  "daerah khusus ibukota jakarta": "DKI Jakarta",
  "daerah istimewa yogyakarta": "DI Yogyakarta",
  yogyakarta: "DI Yogyakarta",
  jogja: "DI Yogyakarta",
  kaltara: "Kalimantan Utara",
  kaltim: "Kalimantan Timur",
  kalteng: "Kalimantan Tengah",
  "kalimantan tengah": "Kalimantan Tengah",
  "kalimantan selatan": "Kalimantan Selatan",
  "kalimantan timur": "Kalimantan Timur",
  "kalimantan utara": "Kalimantan Utara",
  "kalimantan barat": "Kalimantan Barat",
  ntb: "Nusa Tenggara Barat",
  ntt: "Nusa Tenggara Timur",
  sumut: "Sumatera Utara",
  sumbar: "Sumatera Barat",
  sumsel: "Sumatera Selatan",
  babel: "Kepulauan Bangka Belitung",
  kepri: "Kepulauan Riau",
  "papua barat daya": "Papua Barat Daya",
  // Cities and variants
  bandung: "Bandung",
  " b a n d u n g ": "Bandung",
  "kabupaten bandung": "Kab. Bandung",
  "kab. bandung": "Kab. Bandung",
  serang: "Kab. Serang",
  bali: "Bali",
};

// Build a normalized lookup index combining provinces, cities and aliases
function normalizeKey(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[._,;:()\[\]{}]/g, "");
}

const CANONICAL_COORDS: Record<string, LngLat> = {
  ...PROVINCE_COORDS,
  ...CITY_COORDS,
};

const NAME_INDEX: Record<string, string> = {};
// direct names
Object.keys(CANONICAL_COORDS).forEach((name) => {
  NAME_INDEX[normalizeKey(name)] = name;
});
// aliases
Object.entries(ALIASES).forEach(([k, v]) => {
  NAME_INDEX[normalizeKey(k)] = v;
});

export function canonicalizeLocation(input: string): string | null {
  const key = normalizeKey(input);
  return NAME_INDEX[key] || null;
}

export function getCoords(input: string): LngLat | null {
  const name = canonicalizeLocation(input);
  return name ? CANONICAL_COORDS[name] || null : null;
}

export const LOCATION_COORDS: Record<string, LngLat> = CANONICAL_COORDS;
