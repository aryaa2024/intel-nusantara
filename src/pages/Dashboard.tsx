import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Globe, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Search, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Share2, 
  ArrowUpRight,
  PlusCircle,
  Cpu,
  RefreshCw,
  Calendar,
  Layers,
  ChevronRight,
  Copy,
  Check,
  X,
  Activity,
  Zap,
  Tag,
  MapPin,
  Newspaper,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { NewsItem, SeverityLevel, NewsCategory } from '../types';

interface DashboardProps {
  onNavigateToLogbookWithNews?: (news: NewsItem) => void;
  onNavigateToAIAnalysis?: (query: string) => void;
}

// Dataset Berita Nasional & Keamanan Publik Lengkap (Arsip 7 Hari: 10 - 16 Oktober 2026)
const INITIAL_NATIONAL_NEWS: NewsItem[] = [
  // HARI INI (16 OKT 2026) - daysAgo: 0
  {
    id: 'news-nat-01',
    source: 'BSSN Threat Advisory',
    title: 'Deteksi Kampanye Spionase Siber APT-38 Menyasar Sektor Finansial & Perbankan Nasional',
    summary: 'Ditemukan indikasi serangan spear-phishing berkedok regulasi BI terbaru yang membawa payload trojan perbankan modular. Sejumlah IP Command & Control (C2) luar negeri terdeteksi aktif melakukan pemindaian.',
    fullContent: 'Pusat Operasi Keamanan Siber Nasional (BSSN) mengeluarkan peringatan darurat level kritis setelah mendeteksi lalu lintas data eksfiltrasi dari beberapa bank swasta nasional. Serangan menggunakan teknik DLL Side-Loading yang disisipkan dalam dokumen palsu perizinan valuta asing. Analis SOC diimbau memperketat filter gateway email dan memantau koneksi anomali port 443 non-standar.',
    timestamp: '10:42 WIB',
    publishedAt: '2026-10-16T10:42:00+07:00',
    daysAgo: 0,
    category: 'Cyber',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://bssn.go.id/advisory-keamanan-finansial',
    verified: true,
    region: 'DKI Jakarta / Nasional',
    impactScore: 'KRITIS',
    tags: ['APT-38', 'Perbankan', 'Spear-Phishing', 'Trojan', 'C2']
  },
  {
    id: 'news-nat-02',
    source: 'Humas Mabes Polri / Bakamla',
    title: 'Gugus Patroli Laut Gagalkan Penyelundupan Senjata Gelap di Perairan Selat Malaka',
    summary: 'Operasi gabungan TNI AL dan Korpolairud berhasil mengamankan satu kapal motor tanpa dokumen resmi yang membawa puluhan senjata api laras panjang ilegal transit menuju pesisir timur Sumatera.',
    fullContent: 'Berdasarkan sinyal intelijen maritim OSINT dan radar surveillance pesisir, kapal KM Bintang Samudera terdeteksi mematikan Automatic Identification System (AIS) saat memasuki ALKI I. Tim VBSS (Visit Board Search and Seizure) mengamankan 4 tersangka dan 28 pucuk senjata api otomatis. Wilayah perairan Riau kini ditempatkan dalam status patroli siaga 1.',
    timestamp: '08:15 WIB',
    publishedAt: '2026-10-16T08:15:00+07:00',
    daysAgo: 0,
    category: 'Keamanan',
    threatLevel: 'HIGH',
    sourceUrl: 'https://polri.go.id/berita-patroli-selat-malaka',
    verified: true,
    region: 'Kepulauan Riau / Riau',
    impactScore: 'TINGGI',
    tags: ['Penyelundupan', 'Selat Malaka', 'Maritim', 'TNI AL', 'Kamtibmas']
  },
  {
    id: 'news-nat-03',
    source: 'BMKG / BNPB Siaga Bencana',
    title: 'Peringatan Dini Status Siaga III Peningkatan Aktivitas Vulkanik Gunung Marapi',
    summary: 'Sensor seismograf mencatat rentetan gempa hembusan dan lontaran abu vulkanik setinggi 1.500 meter di atas kawah. Radius bahaya 4.5 km diberlakukan untuk pemukiman warga lereng gunung.',
    fullContent: 'Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG) bersama Badan Penanggulangan Bencana Daerah (BPBD) Sumatera Barat menaikkan radius pengungsian darurat. Tim TRC BNPB telah mendirikan posko tanggap darurat dan membagikan masker serta logistik medis kepada 3.200 warga terdampak hujan abu tebal di wilayah Bukittinggi dan sekitarnya.',
    timestamp: '06:30 WIB',
    publishedAt: '2026-10-16T06:30:00+07:00',
    daysAgo: 0,
    category: 'Bencana',
    threatLevel: 'HIGH',
    sourceUrl: 'https://bnpb.go.id/situasi-erupsi-marapi-terkini',
    verified: true,
    region: 'Sumatera Barat',
    impactScore: 'TINGGI',
    tags: ['Vulkanik', 'Gunung Marapi', 'Evakuasi', 'BNPB', 'Siaga III']
  },
  {
    id: 'news-nat-04',
    source: 'Antara News Politik',
    title: 'Kemenkopolhukam Matangkan RUU Tata Kelola Krisis Siber & Ketahanan Infrastruktur Strategis',
    summary: 'Rapat koordinasi tingkat menteri menyepakati kerangka kerja pertahanan siber terpadu lintas kementerian untuk memitigasi eskalasi perang informasi dan disinformasi jelang pemilu daerah serentak.',
    fullContent: 'Pemerintah merampungkan draf aturan percepatan penanganan krisis siber nasional yang mewajibkan seluruh pengelola Objek Vital Nasional (OVN) mengintegrasikan SOC internal dengan Sistem Komando Nasional BSSN dan BIN. Regulasi ini juga memuat sanksi tegas atas kelalaian pengelolaan kebocoran data rahasia negara.',
    timestamp: '14:20 WIB',
    publishedAt: '2026-10-16T14:20:00+07:00',
    daysAgo: 0,
    category: 'Politik',
    threatLevel: 'MEDIUM',
    sourceUrl: 'https://antaranews.com/politik/ruu-krisis-siber-nasional',
    verified: true,
    region: 'Nasional / Jakarta',
    impactScore: 'SEDANG',
    tags: ['Regulasi', 'Kemenkopolhukam', 'Ketahanan Siber', 'Objek Vital']
  },

  // KEMARIN (15 OKT 2026) - daysAgo: 1
  {
    id: 'news-nat-05',
    source: 'DarkWeb OSINT Watchdog',
    title: 'Bocornya 4.5 Juta Baris Kredensial Layanan Publik pada Forum Bawah Tanah DarkWeb',
    summary: 'Aktor ancaman dengan moniker "GhostNusantara" mengunggah sampel basis data NIK, email, dan hash password. Tim forensik siber melakukan verifikasi validitas enkripsi.',
    fullContent: 'Investigasi tim OSINT Intel Nusantara menemukan tautan dump basis data berkapasitas 12 GB pada mirror BreachForums. Sampel data berisi nama lengkap, nomor telepon, alamat, dan instansi pengguna portal daerah. Koordinasi dilakukan bersama CERT instansi terkait guna melakukan force-reset kredensial terdampak.',
    timestamp: '21:10 WIB',
    publishedAt: '2026-10-15T21:10:00+07:00',
    daysAgo: 1,
    category: 'Cyber',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://cyberintel-watchdog.org/leak-analisis-ghostnusantara',
    verified: true,
    region: 'Jawa Tengah & Nasional',
    impactScore: 'KRITIS',
    tags: ['Data Leak', 'DarkWeb', 'NIK', 'GhostNusantara', 'Breach']
  },
  {
    id: 'news-nat-06',
    source: 'BNPB Pusdalops',
    title: 'Banjir Bandang & Tanah Longsor Putuskan Jalur Logistik Antar-Kabupaten di Pesisir Selatan',
    summary: 'Curah hujan ekstrem memicu luapan sungai dan material longsor yang menimbun 4 jembatan penghubung utama. Jalur logistik dialihkan via koridor alternatif darurat.',
    fullContent: 'Pusat Pengendalian Operasi BNPB mencatat 1.800 kepala keluarga terisolasi sementara akibat tertutupnya akses jalan nasional. Alat berat Kementerian PUPR dan tim SAR gabungan TNI/Polri dikerahkan untuk membuka timbunan material longsor dan mendistribusikan bantuan logistik helikopter.',
    timestamp: '16:45 WIB',
    publishedAt: '2026-10-15T16:45:00+07:00',
    daysAgo: 1,
    category: 'Bencana',
    threatLevel: 'HIGH',
    sourceUrl: 'https://bnpb.go.id/bencana-longsor-pesisir-selatan',
    verified: true,
    region: 'Sumatera Barat',
    impactScore: 'TINGGI',
    tags: ['Banjir Bandang', 'Longsor', 'Jalur Logistik', 'SAR Gabungan']
  },
  {
    id: 'news-nat-07',
    source: 'Detikcom Keamanan & Intelijen',
    title: 'Densus 88 Tangkap 3 Terduga Jaringan Radikal Digital Terkait Pendanaan Teror Kripto',
    summary: 'Penangkapan dilakukan di tiga lokasi berbeda di Jawa Barat dan Solo Raya. Petugas menyita bukti digital wallet Monero serta materi propaganda di channel terenkripsi.',
    fullContent: 'Operasi penindakan senyap berhasil mengamankan terduga fasilitator dana yang menghimpun donasi daring melalui bot Telegram terselubung. Dari penggeledahan barang bukti, ditemukan buku panduan pembuatan bahan peledak improvisasi (IED) dan percakapan rencana sabotase objek vital.',
    timestamp: '11:05 WIB',
    publishedAt: '2026-10-15T11:05:00+07:00',
    daysAgo: 1,
    category: 'Keamanan',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://detik.com/keamanan/densus-tangkap-terduga-teror-kripto',
    verified: true,
    region: 'Jawa Barat & Jawa Tengah',
    impactScore: 'KRITIS',
    tags: ['Densus 88', 'Kontra-Terorisme', 'Crypto Crime', 'Kamtibmas']
  },

  // 2 HARI LALU (14 OKT 2026) - daysAgo: 2
  {
    id: 'news-nat-08',
    source: 'CSIRT Infrastruktur Kritis',
    title: 'Lonjakan Traffic DDoS Skala Terabit Menyasar Gateway Komunikasi Bawah Laut Batam',
    summary: 'Serangan DDoS terdistribusi dengan intensitas puncak 1.4 Tbps menghantam simpul pertukaran data maritim. Protokol scrubbing center internasional diaktifkan penuh.',
    fullContent: 'Serangan botnet IoT Mirai generasi terbaru terpantau membanjiri port DNS dan NTP refleksi untuk melumpuhkan routing fiber optic bawah laut Batam-Singapura. Dalam waktu 18 menit, sistem mitigasi scrubbing center berhasil menyaring 98% paket sampah tanpa terjadi pemadaman telekomunikasi nasional.',
    timestamp: '19:30 WIB',
    publishedAt: '2026-10-14T19:30:00+07:00',
    daysAgo: 2,
    category: 'Cyber',
    threatLevel: 'HIGH',
    sourceUrl: 'https://csirt.id/insiden-ddos-kabel-bawah-laut',
    verified: true,
    region: 'Kepulauan Riau / Batam',
    impactScore: 'TINGGI',
    tags: ['DDoS', 'Infrastruktur', 'Kabel Laut', 'Scrubbing Center']
  },
  {
    id: 'news-nat-09',
    source: 'Kompas Hankam & Diplomasi',
    title: 'RI & Negara Tetangga Bahas Protokol Pengamanan Jalur Selat Singapura - Selat Malaka',
    summary: 'Pertemuan trilateral menyepakati peningkatan frekuensi patroli udara maritim dan integrasi radar maritim real-time untuk mencegah perompakan dan kejahatan transnasional.',
    fullContent: 'Kementerian Luar Negeri bersama Badan Intelijen Strategis (BAIS) TNI menggelar perundingan pertahanan maritim regional. Kesepakatan mencakup pertukaran data intelijen sinyal perkapalan mencurigakan tanpa AIS guna menjamin keamanan navigasi kapal niaga internasional.',
    timestamp: '13:50 WIB',
    publishedAt: '2026-10-14T13:50:00+07:00',
    daysAgo: 2,
    category: 'Politik',
    threatLevel: 'MEDIUM',
    sourceUrl: 'https://kompas.id/hankam/patroli-terkoordinasi-malaka',
    verified: true,
    region: 'Selat Malaka / Internasional',
    impactScore: 'SEDANG',
    tags: ['Trilateral', 'Diplomasi', 'Hankam', 'Selat Malaka']
  },

  // 3 HARI LALU (13 OKT 2026) - daysAgo: 3
  {
    id: 'news-nat-10',
    source: 'Direktorat Intelijen Strategis',
    title: 'Aktivitas Intelijen Sinyal Asing Terdeteksi di Sekitar Jalur Laut Kepulauan (ALKI II)',
    summary: 'Sensor radar pesisir dan patroli KRI mendeteksi keberadaan transmisi radio frekuensi gelap (dark ship) melintas di Selat Makassar menuju Laut Sulawesi.',
    fullContent: 'Sebuah kapal riset berbendera asing terpantau melakukan manuver mencurigakan di luar jalur perlintasan transit damai ALKI II. Analisis telemetry menunjukkan adanya penurunan sensor bawah air (sonobuoy). KRI dipersiapkan untuk intersepsi identifikasi fisik.',
    timestamp: '17:25 WIB',
    publishedAt: '2026-10-13T17:25:00+07:00',
    daysAgo: 3,
    category: 'Keamanan',
    threatLevel: 'HIGH',
    sourceUrl: 'https://tni.mil.id/situasi-pengamanan-alki-2',
    verified: true,
    region: 'Selat Makassar / Sulawesi',
    impactScore: 'TINGGI',
    tags: ['ALKI II', 'Dark Ship', 'Intelijen Sinyal', 'KRI', 'Kedaulatan']
  },
  {
    id: 'news-nat-11',
    source: 'BMKG Geofisika',
    title: 'Gempa Tektonik Magnitudo 5.8 Guncang Pesisir Barat Daya Maluku, Tidak Berpotensi Tsunami',
    summary: 'Pusat gempa berada di kedalaman 85 km laut Banda. Gempa dirasakan skala III-IV MMI di Saumlaki tanpa laporan kerusakan infrastruktur fatal.',
    fullContent: 'Hasil analisis mekanisme sumber BMKG menunjukkan gempa bumi memiliki mekanisme pergerakan naik (thrust fault). BPBD setempat menghimbau warga tetap tenang dan menghindari bangunan retak akibat gempa susulan berkekuatan lebih rendah.',
    timestamp: '09:12 WIB',
    publishedAt: '2026-10-13T09:12:00+07:00',
    daysAgo: 3,
    category: 'Bencana',
    threatLevel: 'LOW',
    sourceUrl: 'https://bmkg.go.id/gempabumi/m5-8-maluku',
    verified: true,
    region: 'Maluku',
    impactScore: 'RENDAH',
    tags: ['Gempa Bumi', 'Laut Banda', 'BMKG', 'Mitigasi']
  },

  // 4 HARI LALU (12 OKT 2026) - daysAgo: 4
  {
    id: 'news-nat-12',
    source: 'Satgas Siber IKN',
    title: 'Audit Keamanan Sistem SCADA Smart City Ibu Kota Nusantara Menunjukkan Kondisi Prima',
    summary: 'Penetrasi simulasi Red Team berkala telah diselesaikan pada sistem grid listrik dan air bersih digital IKN Nusantara tanpa temuan celah kritikal.',
    fullContent: 'Audit ketat oleh konsorsium siber nasional menguji 45 perimeter IoT smart city, transmisi telemetri SCADA, dan otentikasi biometrik pusat komando IKN. Hasil audit menyatakan seluruh protokol enkripsi kuantum-resisten berjalan sesuai standar keamanan BSSN.',
    timestamp: '15:40 WIB',
    publishedAt: '2026-10-12T15:40:00+07:00',
    daysAgo: 4,
    category: 'Cyber',
    threatLevel: 'LOW',
    sourceUrl: 'https://ikn.go.id/audit-keamanan-scada-berkala',
    verified: true,
    region: 'IKN Nusantara / Kaltim',
    impactScore: 'RENDAH',
    tags: ['IKN Nusantara', 'SCADA', 'Smart City', 'Red Team', 'Audit']
  },
  {
    id: 'news-nat-13',
    source: 'Antara News Hankam',
    title: 'Panglima TNI Tinjau Kesiapan Pasukan Perdamaian & Satgas Pengamanan Perbatasan RI-PNG',
    summary: 'Pemeriksaan persenjataan, pos pemantauan drone thermal perbatasan, dan kesiapan medis prajurit di sektor Merauke dan Boven Digoel.',
    fullContent: 'Panglima menegaskan pentingnya pemanfaatan teknologi drone jarak jauh berkamera termal dalam mengantisipasi jalur tikus penyelundupan lintas batas darat. Kolaborasi dengan tokoh adat setempat terus diperkuat guna menjaga stabilitas sosial dan keamanan perbatasan.',
    timestamp: '10:00 WIB',
    publishedAt: '2026-10-12T10:00:00+07:00',
    daysAgo: 4,
    category: 'Keamanan',
    threatLevel: 'MEDIUM',
    sourceUrl: 'https://antaranews.com/hankam/tinjauan-perbatasan-papua',
    verified: true,
    region: 'Papua Selatan',
    impactScore: 'SEDANG',
    tags: ['Perbatasan', 'RI-PNG', 'Drone Thermal', 'TNI']
  },

  // 5 HARI LALU (11 OKT 2026) - daysAgo: 5
  {
    id: 'news-nat-14',
    source: 'Kementerian ESDM & Siber',
    title: 'Deteksi Serangan Malware Phishing Menyamar Regulasi Subsidi Energi Baru',
    summary: 'Email tipuan dengan berkas attachment berbahaya disebarkan ke sejumlah BUMN dan kontraktor migas nasional untuk mencuri kredensial internal.',
    fullContent: 'File berekstensi .vbs dan .scr diinjeksi ke dalam dokumen PDF palsu bertajuk Kuota_Subsidi_ESDM_2026. Analisis sandbox mendeteksi modul infostealer RedLine varian mutasi baru. Seluruh domain pengirim email palsu telah diblokir di level gateway nasional.',
    timestamp: '16:15 WIB',
    publishedAt: '2026-10-11T16:15:00+07:00',
    daysAgo: 5,
    category: 'Cyber',
    threatLevel: 'HIGH',
    sourceUrl: 'https://esdm.go.id/peringatan-phishing-sektor-energi',
    verified: true,
    region: 'Nasional',
    impactScore: 'TINGGI',
    tags: ['Phishing', 'ESDM', 'Infostealer', 'BUMN', 'RedLine']
  },
  {
    id: 'news-nat-15',
    source: 'BNPB Info Bencana',
    title: 'Penanganan Karhutla di Wilayah Lahan Gambut Riau Terkendali Berkat Operasi Modifikasi Cuaca',
    summary: 'Operasi modifikasi cuaca (TMC) berhasil memicu hujan buatan intensif di 4 kabupaten rawan titik api, menurunkan indeks polusi udara secara signifikan.',
    fullContent: 'Satgas Gabungan Darat dan Udara mengerahkan pesawat Cassa 212 untuk menyemai 12 ton garam NaCL pada bibit awan potensial. Pemantauan satelit Terra/Aqua kini hanya mendeteksi 2 titik hotspot sisa dengan level kepercayaan rendah.',
    timestamp: '11:30 WIB',
    publishedAt: '2026-10-11T11:30:00+07:00',
    daysAgo: 5,
    category: 'Bencana',
    threatLevel: 'MEDIUM',
    sourceUrl: 'https://bnpb.go.id/karhutla-riau-terkendali',
    verified: true,
    region: 'Riau',
    impactScore: 'SEDANG',
    tags: ['Karhutla', 'Gambut', 'TMC', 'Hujan Buatan']
  },

  // 6 HARI LALU (10 OKT 2026) - daysAgo: 6
  {
    id: 'news-nat-16',
    source: 'Kompas Politik & Hukum',
    title: 'DPR Sahkan Peningkatan Alokasi Anggaran Transformasi Digital Keamanan Siber Nasional',
    summary: 'Komisi I DPR menyetujui penambahan anggaran pengadaan peralatan intelijen kriptografi dan pusat simulasi cyber range militer terpadu.',
    fullContent: 'Penambahan alokasi ditujukan untuk memperkuat kemandirian infrastruktur enkripsi dalam negeri serta rekrutmen 1.000 talenta siber muda untuk memperkuat kesiapan National SOC menghadapi ancaman perang asimetris modern.',
    timestamp: '18:45 WIB',
    publishedAt: '2026-10-10T18:45:00+07:00',
    daysAgo: 6,
    category: 'Politik',
    threatLevel: 'LOW',
    sourceUrl: 'https://kompas.id/politik/anggaran-siber-dpr-disahkan',
    verified: true,
    region: 'DKI Jakarta / Nasional',
    impactScore: 'RENDAH',
    tags: ['DPR RI', 'Anggaran Pertahanan', 'Cyber Range', 'Kriptografi']
  },
  {
    id: 'news-nat-17',
    source: 'Polda Metro Jaya Humas',
    title: 'Pengungkapan Sindikat Penipuan Transaksi Online Lintas Negara Bermodus Love Scam & Investasi Kripto',
    summary: 'Penyidik Subdit Siber menangkap 14 warga negara asing dan lokal di kawasan perumahan elit BSD yang mengoperasikan call center phishing terorganisir.',
    fullContent: 'Sindikat menargetkan korban nasabah perbankan nasional dengan kerugian ditaksir mencapai Rp 42 Miliar. Sebanyak 80 perangkat laptop, ratusan kartu SIM ilegal, dan router penyamar IP proxy disita sebagai barang bukti tindak pidana pencucian uang.',
    timestamp: '13:10 WIB',
    publishedAt: '2026-10-10T13:10:00+07:00',
    daysAgo: 6,
    category: 'Keamanan',
    threatLevel: 'HIGH',
    sourceUrl: 'https://metro.polri.go.id/siber-sindikat-love-scam',
    verified: true,
    region: 'Banten / DKI Jakarta',
    impactScore: 'TINGGI',
    tags: ['Love Scam', 'Siber Polri', 'Pencucian Uang', 'Phishing']
  }
];

const INDONESIA_REGIONAL_HOTSPOTS = [
  { name: 'DKI JAKARTA (HUB KOMANDO)', status: 'CRITICAL', threatCount: 14, coords: '6.2088° S, 106.8456° E', color: 'text-red-500' },
  { name: 'BATAM - KEP. RIAU (GATEWAY)', status: 'HIGH', threatCount: 8, coords: '1.0456° N, 104.0305° E', color: 'text-amber-500' },
  { name: 'SURABAYA - JAWA TIMUR', status: 'ELEVATED', threatCount: 5, coords: '7.2575° S, 112.7521° E', color: 'text-amber-400' },
  { name: 'IKN NUSANTARA (PUSAT PEMERINTAHAN)', status: 'SECURE / MONITORED', threatCount: 2, coords: '0.9734° S, 116.7089° E', color: 'text-emerald-400' },
  { name: 'SELAT MAKASSAR / ALKI II', status: 'HIGH', threatCount: 6, coords: '1.5000° S, 118.5000° E', color: 'text-amber-500' },
  { name: 'PAPUA RESOURCE CORRIDOR', status: 'GUARDED', threatCount: 3, coords: '4.2699° S, 138.0804° E', color: 'text-blue-400' },
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateToLogbookWithNews, 
  onNavigateToAIAnalysis 
}) => {
  // State Filter & Pencarian
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [timeArchiveFilter, setTimeArchiveFilter] = useState<'ALL' | 'TODAY' | '3_DAYS' | '7_DAYS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State Data Berita & Detail Modal
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NATIONAL_NEWS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // State Refresh & Telemetri
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('23:26 WIB');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  // Set initial refresh time
  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setLastRefreshedTime(`${hours}:${minutes} WIB`);
  }, []);

  // Handler Manual Refresh dengan simulasi pembaruan feed
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshToast('Menghubungkan ke Feed Satelit & Gateway Berita Nasional...');

    setTimeout(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const newTimestamp = `${hours}:${minutes} WIB`;
      
      setLastRefreshedTime(newTimestamp);
      setIsRefreshing(false);
      setRefreshToast('Feed Berita Nasional Berhasil Disinkronkan!');

      setTimeout(() => setRefreshToast(null), 3000);
    }, 900);
  };

  // Filter Logic: Kategori, Rentang Waktu (7 Days Archive), dan Pencarian Kata Kunci
  const filteredNews = newsList.filter(item => {
    // 1. Filter Kategori
    const matchCategory = selectedCategory === 'ALL' || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    // 2. Filter Rentang Waktu (Archive)
    let matchTime = true;
    if (timeArchiveFilter === 'TODAY') {
      matchTime = item.daysAgo === 0;
    } else if (timeArchiveFilter === '3_DAYS') {
      matchTime = item.daysAgo <= 2;
    } else if (timeArchiveFilter === '7_DAYS') {
      matchTime = item.daysAgo <= 6;
    }

    // 3. Filter Pencarian Kata Kunci
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q)));

    return matchCategory && matchTime && matchQuery;
  });

  // Salin Rangkuman Berita ke Clipboard
  const handleCopyNews = (news: NewsItem) => {
    const text = `[INTEL NUSANTARA - INTEL BRIEFING]
KATEGORI: ${news.category.toUpperCase()} | KEPARAHAN: ${news.threatLevel}
WAKTU: ${news.timestamp} (${news.publishedAt.slice(0, 10)})
SUMBER: ${news.source} (${news.region})
JUDUL: ${news.title}

RINGKASAN:
${news.summary}

TAUTAN ASLI: ${news.sourceUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Helper Badge Kategori
  const getCategoryBadge = (category: string) => {
    const cat = category.toUpperCase();
    if (cat === 'CYBER') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-cyan-400" /> CYBER
        </span>
      );
    }
    if (cat === 'KEAMANAN') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-800/80 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-red-400" /> KEAMANAN
        </span>
      );
    }
    if (cat === 'BENCANA') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80 flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400" /> BENCANA
        </span>
      );
    }
    if (cat === 'POLITIK') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 flex items-center gap-1">
          <Compass className="w-3 h-3 text-indigo-400" /> POLITIK
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
        {category}
      </span>
    );
  };

  // Helper Badge Tingkat Keparahan
  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-700/80 shadow-glow-red animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-700/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-700/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LOW / INFO
          </span>
        );
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Toast Notification Refresh */}
      {refreshToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#0d1424] border border-cyan-500 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-fadeIn">
          <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{refreshToast}</span>
        </div>
      )}

      {/* Top Banner Alert Bar */}
      <div className="bg-gradient-to-r from-red-950/70 via-zinc-900 to-zinc-950 border border-red-700/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-500 shadow-glow-red flex-shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono flex-wrap">
              <span className="text-xs px-2 py-0.5 bg-red-900/90 text-white rounded font-bold uppercase tracking-widest">
                PRIORITAS TINGGI
              </span>
              <span className="text-zinc-400 text-xs hidden sm:inline">PEMANTAUAN REAL-TIME NUSANTARA</span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                DEFCON 3 (SIAGA ELEVATED)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide mt-1 truncate">
              KOMANDO SITUASI & AGGREGATOR BERITA NASIONAL
            </h2>
            <p className="text-xs text-zinc-400 font-mono line-clamp-1 sm:line-clamp-none">
              Integrasi intelijen publik: Keamanan Maritim & Darat, Bencana Alam BMKG/BNPB, Dinamika Politik Hankam, dan Siber.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
          <button 
            onClick={() => onNavigateToAIAnalysis && onNavigateToAIAnalysis('Analisis situasi ancaman nasional terkini berdasarkan kompilasi feed intelijen 7 hari terakhir')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-mono text-xs font-bold transition-all shadow-glow-red"
          >
            <Cpu className="w-4 h-4" />
            <span>ANALISIS ANCAMAN AI</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400 uppercase">FEED BERITA AKTIF</span>
            <Newspaper className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            {newsList.length} <span className="text-xs font-normal text-cyan-400 font-sans">Laporan</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Arsip terverifikasi 7 hari
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-cyan-600/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400 uppercase">STATUS KRITIS</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            {newsList.filter(n => n.threatLevel === 'CRITICAL').length} <span className="text-xs font-normal text-red-500 font-sans">Perhatian</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Membutuhkan respon SOC
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-red-600/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400 uppercase">WILAYAH TERPANTAU</span>
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            38 <span className="text-xs font-normal text-amber-500 font-sans">Provinsi</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Radar Sabang - Merauke
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-600/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400 uppercase">INTEGRITAS FEED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            100%
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Sumber Resmi & Terverifikasi
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-600/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Main Grid: Left Column (8 cols) News Aggregator, Right Column (4 cols) Sector Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): REAL-TIME NATIONAL NEWS AGGREGATOR */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#090e1a] border border-zinc-800/90 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
            
            {/* 1. Header Bar: Title, Live Update Beacon, & Manual Refresh Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-950/70 border border-red-700/60 rounded-xl text-red-400 shadow-glow-red">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-base text-white tracking-wide">
                      REAL-TIME NATIONAL NEWS AGGREGATOR
                    </h3>
                  </div>
                  {/* Indikator LIVE UPDATE dengan animasi titik hijau/merah */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                      LIVE UPDATE
                    </span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      Sync: <span className="text-zinc-200 font-semibold">{lastRefreshedTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Manual Refresh */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-700/80 hover:border-red-600/60 text-zinc-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  title="Perbarui linimasa berita secara manual"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'MEMPERBARUI...' : 'REFRESH'}</span>
                </button>
              </div>
            </div>

            {/* 2. Filter & Pencarian Controls */}
            <div className="space-y-3 font-mono">
              
              {/* Row 1: Search Input */}
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan kata kunci, judul, sumber (BSSN/BMKG/Polri), atau wilayah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-black/60 border border-zinc-700/80 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Row 2: Filter Tabs (7 DAYS ARCHIVE & Rentang Waktu) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                {/* 7 Days Archive Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                  <span className="text-zinc-500 text-[11px] flex items-center gap-1 mr-1 flex-shrink-0">
                    <Calendar className="w-3 h-3 text-red-500" /> Rentang:
                  </span>
                  {[
                    { id: 'ALL' as const, label: 'SEMUA ARSIP' },
                    { id: 'TODAY' as const, label: 'HARI INI (24 JAM)' },
                    { id: '3_DAYS' as const, label: '3 HARI TERAKHIR' },
                    { id: '7_DAYS' as const, label: '7 DAYS ARCHIVE' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setTimeArchiveFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                        timeArchiveFilter === tab.id
                          ? 'bg-red-950 text-red-300 border border-red-700 shadow-glow-red font-bold'
                          : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Counter Result Badge */}
                <span className="text-[11px] text-zinc-400 self-end sm:self-auto flex-shrink-0">
                  Ditemukan: <span className="text-white font-bold">{filteredNews.length}</span> berita
                </span>
              </div>

              {/* Row 3: Category Filter Pills (Keamanan, Bencana, Politik, Cyber) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-zinc-500 text-[11px] flex items-center gap-1 mr-1 flex-shrink-0">
                  <Filter className="w-3 h-3 text-zinc-400" /> Kategori:
                </span>
                {[
                  { id: 'ALL', label: 'SEMUA KATEGORI' },
                  { id: 'Keamanan', label: 'KEAMANAN' },
                  { id: 'Bencana', label: 'BENCANA' },
                  { id: 'Politik', label: 'POLITIK' },
                  { id: 'Cyber', label: 'CYBER' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-red-600 text-white shadow-glow-red font-bold'
                        : 'bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. News Feed List */}
            <div className="space-y-3.5 pt-1">
              {filteredNews.length === 0 ? (
                <div className="py-12 px-4 text-center bg-[#070b14] border border-zinc-800 rounded-2xl font-mono">
                  <Newspaper className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-300 font-semibold">Tidak ada berita yang sesuai dengan filter atau kata kunci.</p>
                  <p className="text-xs text-zinc-500 mt-1">Coba ubah filter rentang waktu ke "7 DAYS ARCHIVE" atau reset kata kunci.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setTimeArchiveFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200 hover:text-white"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                filteredNews.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => setSelectedNews(news)}
                    className="cursor-pointer p-4 sm:p-5 rounded-2xl bg-zinc-900/60 hover:bg-[#0e1628] border border-zinc-800 hover:border-red-600/50 transition-all duration-200 group shadow-sm hover:shadow-md relative overflow-hidden"
                  >
                    {/* Top Row: Category, Source Media, Timestamp, Severity Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getCategoryBadge(news.category)}
                        <span className="font-mono font-bold text-xs text-zinc-200 group-hover:text-red-400 transition-colors">
                          {news.source}
                        </span>
                        {news.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded" title="Sumber Terverifikasi Resmi">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                        <span className="text-zinc-600 hidden sm:inline">•</span>
                        {/* Timestamp Kejadian (Contoh: 10:42 WIB) */}
                        <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" /> {news.timestamp}
                        </span>
                        {news.daysAgo > 0 && (
                          <span className="text-zinc-500 font-mono text-[10px] bg-zinc-800/80 px-1.5 py-0.2 rounded">
                            {news.daysAgo === 1 ? 'Kemarin' : `${news.daysAgo} hari lalu`}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700/50">
                          {news.region}
                        </span>
                        {getSeverityBadge(news.threatLevel)}
                      </div>
                    </div>

                    {/* Judul Berita */}
                    <h4 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white leading-snug break-words">
                      {news.title}
                    </h4>

                    {/* Ringkasan Singkat (Executive summary, tidak terpotong aneh) */}
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans line-clamp-2">
                      {news.summary}
                    </p>

                    {/* Bottom Action Bar of Card */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/70 font-mono text-xs">
                      <div className="flex items-center gap-2 text-zinc-400 group-hover:text-red-400 transition-colors">
                        <span className="text-[11px] font-semibold">Klik untuk Detail Berita</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {onNavigateToLogbookWithNews && (
                          <button
                            onClick={() => onNavigateToLogbookWithNews(news)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-300 border border-zinc-700 hover:border-red-700 text-[11px] flex items-center gap-1 transition-colors"
                            title="Eskalasi ke Daily Logbook SOC"
                          >
                            <PlusCircle className="w-3 h-3 text-red-500" />
                            <span className="hidden sm:inline">Eskalasi Logbook</span>
                          </button>
                        )}

                        {onNavigateToAIAnalysis && (
                          <button
                            onClick={() => onNavigateToAIAnalysis(news.title + ': ' + news.summary)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-cyan-950 text-zinc-300 hover:text-cyan-300 border border-zinc-700 hover:border-cyan-700 text-[11px] flex items-center gap-1 transition-colors"
                            title="Bedah dengan AI Threat Analysis"
                          >
                            <Cpu className="w-3 h-3 text-cyan-400" />
                            <span className="hidden sm:inline">AI Analysis</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Regional Hotspots & Radar Display */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Radar Hotspot Card */}
          <div className="bg-[#090e1a] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <h3 className="font-bold text-sm text-white tracking-wide">
                  SECTOR RADAR NUSANTARA
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded font-bold">
                LIVE SWEEP
              </span>
            </div>

            {/* Radar Circular Visual */}
            <div className="relative w-full aspect-square max-w-[220px] mx-auto rounded-full border-2 border-red-600/40 bg-zinc-950 p-2 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              {/* Concentric rings */}
              <div className="absolute inset-4 rounded-full border border-red-800/30"></div>
              <div className="absolute inset-10 rounded-full border border-red-800/20"></div>
              <div className="absolute inset-16 rounded-full border border-red-800/10"></div>
              
              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-red-600/30"></div>
              <div className="absolute inset-y-0 left-1/2 w-px bg-red-600/30"></div>
              
              {/* Rotating Sweep Beam */}
              <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
                   style={{
                     background: 'conic-gradient(from 0deg, rgba(220, 38, 38, 0.4) 0deg, transparent 60deg, transparent 360deg)'
                   }}
              ></div>

              {/* Blip dots */}
              <div className="absolute top-[35%] left-[45%] w-2 h-2 rounded-full bg-red-500 shadow-glow-red animate-ping" title="Jakarta Hub"></div>
              <div className="absolute top-[25%] left-[30%] w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Batam Gateway"></div>
              <div className="absolute top-[48%] left-[60%] w-2 h-2 rounded-full bg-cyan-400 animate-pulse" title="IKN Hub"></div>
              <div className="absolute top-[52%] left-[78%] w-1.5 h-1.5 rounded-full bg-blue-400" title="Papua Region"></div>

              <div className="z-10 text-center">
                <span className="text-[9px] text-zinc-500 block">SABANG - MERAUKE</span>
                <span className="text-xs font-black text-white tracking-widest">38 PROVINSI</span>
                <span className="text-[8px] text-emerald-400 block mt-0.5">COVERAGE 100%</span>
              </div>
            </div>

            {/* Regional List */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] text-zinc-400 uppercase font-semibold flex justify-between">
                <span>SEKTOR PRIORITAS</span>
                <span>STATUS ANCAMAN</span>
              </div>

              {INDONESIA_REGIONAL_HOTSPOTS.map((spot, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between text-xs hover:border-zinc-700 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-zinc-200 text-[11px] truncate">
                      {spot.name}
                    </div>
                    <div className="text-[9px] text-zinc-400">
                      {spot.coords}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-bold block ${spot.color}`}>
                      {spot.status}
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      {spot.threatCount} anomali
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. DETAIL MODAL / DRAWER BERITA NASIONAL */}
      {selectedNews && (
        <div 
          onClick={() => setSelectedNews(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b101c] border border-red-600/60 rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl font-mono relative my-6 text-zinc-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800 gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getCategoryBadge(selectedNews.category)}
                  {getSeverityBadge(selectedNews.threatLevel)}
                  {selectedNews.verified && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RESMI & TERVERIFIKASI
                    </span>
                  )}
                  <span className="text-zinc-400 text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedNews.timestamp}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white leading-snug break-words">
                  {selectedNews.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 transition-colors flex-shrink-0"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-black/50 border border-zinc-800/90 rounded-xl">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">SUMBER MEDIA</span>
                <span className="text-zinc-100 font-bold truncate block">{selectedNews.source}</span>
              </div>
              <div className="p-2.5 bg-black/50 border border-zinc-800/90 rounded-xl">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">WILAYAH KEJADIAN</span>
                <span className="text-zinc-100 font-bold truncate block">{selectedNews.region}</span>
              </div>
              <div className="p-2.5 bg-black/50 border border-zinc-800/90 rounded-xl">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">DAMPAK STRATEGIS</span>
                <span className="text-red-400 font-bold block">{selectedNews.impactScore || 'SEDANG'}</span>
              </div>
              <div className="p-2.5 bg-black/50 border border-zinc-800/90 rounded-xl">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">TANGGAL RILIS</span>
                <span className="text-zinc-300 font-bold block">{selectedNews.publishedAt.slice(0, 10)}</span>
              </div>
            </div>

            {/* Ringkasan Singkat & Konten Lengkap Berita */}
            <div className="space-y-3">
              <div>
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                  RINGKASAN EKSEKUTIF BERITA:
                </span>
                <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans">
                  {selectedNews.summary}
                </div>
              </div>

              {selectedNews.fullContent && (
                <div>
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                    LAPORAN SITUASI LENGKAP:
                  </span>
                  <div className="p-3.5 bg-zinc-950/90 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                    {selectedNews.fullContent}
                  </div>
                </div>
              )}

              {/* Tagar / Entitas Terkait */}
              {selectedNews.tags && selectedNews.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-red-500" /> Kata Kunci:
                  </span>
                  {selectedNews.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tautan Sumber Asli & Tombol Aksi */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              {/* Banner Sumber Asli */}
              <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-xl flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 truncate">
                  <ExternalLink className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-zinc-400 truncate">
                    Tautan Asli: <span className="text-zinc-200 underline">{selectedNews.sourceUrl}</span>
                  </span>
                </div>
                <a
                  href={selectedNews.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-glow-red flex items-center gap-1 transition-colors"
                >
                  <span>BUKA SUMBER ASLI</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Action Buttons: Copy, Escalate to Logbook, AI Threat Analysis */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                <button
                  onClick={() => handleCopyNews(selectedNews)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">RANGKUMAN TERSALIN</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>SALIN RANGKUMAN</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onNavigateToAIAnalysis && (
                    <button
                      onClick={() => {
                        const item = selectedNews;
                        setSelectedNews(null);
                        onNavigateToAIAnalysis(`Analisis ancaman intelijen dari berita: "${item.title}". Kronologi: ${item.summary}`);
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>ANALISIS AI</span>
                    </button>
                  )}

                  {onNavigateToLogbookWithNews && (
                    <button
                      onClick={() => {
                        const item = selectedNews;
                        setSelectedNews(null);
                        onNavigateToLogbookWithNews(item);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-glow-red flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>ESKALASI KE LOGBOOK SOC</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
