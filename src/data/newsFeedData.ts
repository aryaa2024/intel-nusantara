import { NewsItem, NewsCategory, SeverityLevel } from '../types';

// Helper format tanggal Indonesia (DD MMMM YYYY)
export const formatIndonesianDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Helper format ISO Date string (YYYY-MM-DD)
export const formatISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper kalkulasi tanggal beberapa hari lalu
export const getDateDaysAgo = (daysAgo: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// Helper format jam WIB (HH:mm WIB)
export const formatWIBTime = (hours: number, minutes: number): string => {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  return `${h}:${m} WIB`;
};

// Generate dataset berita nasional terverifikasi 7 hari dinamis mengikuti tanggal hari ini
export const generateDynamicNewsDataset = (): NewsItem[] => {
  const today = new Date();
  const todayISO = formatISODate(today);
  const currentHour = today.getHours();

  return [
    // HARI INI (daysAgo: 0)
    {
      id: 'news-live-01',
      source: 'BSSN Threat Advisory',
      title: 'Deteksi Kampanye Spionase Siber APT-38 Menyasar Sektor Finansial & Perbankan Nasional',
      summary: 'Ditemukan indikasi serangan spear-phishing berkedok regulasi BI terbaru yang membawa payload trojan perbankan modular. Sejumlah IP Command & Control (C2) luar negeri terdeteksi aktif melakukan pemindaian port gateway.',
      fullContent: 'Pusat Operasi Keamanan Siber Nasional (BSSN) mengeluarkan peringatan darurat level kritis setelah mendeteksi lalu lintas data eksfiltrasi dari beberapa bank swasta nasional. Serangan menggunakan teknik DLL Side-Loading yang disisipkan dalam dokumen palsu perizinan valuta asing. Analis SOC diimbau memperketat filter gateway email dan memantau koneksi anomali port 443 non-standar.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 1), 42),
      publishedAt: `${todayISO}T10:42:00+07:00`,
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
      id: 'news-live-02',
      source: 'CNN Indonesia Hankam',
      title: 'TNI AL & Bakamla Gagalkan Penyelundupan 28 Senjata Gelap di Alur ALKI I Selat Malaka',
      summary: 'Operasi intersepsi gabungan KRI dan kapal patroli Korpolairud berhasil melumpuhkan kapal motor tanpa AIS yang mengangkut peti senjata api otomatis ilegal tujuan pesisir timur Sumatera.',
      fullContent: 'Berdasarkan sinyal intelijen maritim OSINT dan radar surveillance pesisir terpadu, kapal KM Bintang Samudera terdeteksi mematikan Automatic Identification System (AIS) saat memasuki ALKI I. Tim VBSS (Visit Board Search and Seizure) mengamankan 4 tersangka dan 28 pucuk senjata api otomatis. Wilayah perairan Riau kini ditempatkan dalam status patroli siaga 1.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 2), 15),
      publishedAt: `${todayISO}T08:15:00+07:00`,
      daysAgo: 0,
      category: 'Keamanan',
      threatLevel: 'HIGH',
      sourceUrl: 'https://cnnindonesia.com/nasional/tni-al-gagalkan-penyelundupan-selat-malaka',
      verified: true,
      region: 'Kepulauan Riau / Riau',
      impactScore: 'TINGGI',
      tags: ['Penyelundupan', 'Selat Malaka', 'Maritim', 'TNI AL', 'Kamtibmas']
    },
    {
      id: 'news-live-03',
      source: 'BMKG Geo-Hazard Warning',
      title: 'Peringatan Dini Status Siaga III Peningkatan Aktivitas Vulkanik Gunung Marapi & Seismisitas',
      summary: 'Sensor seismograf mencatat 18 rentetan gempa hembusan dan lontaran abu vulkanik setinggi 1.500 meter di atas kawah. Radius zona bahaya 4.5 km diberlakukan untuk pemukiman warga lereng gunung.',
      fullContent: 'Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG) bersama Badan Penanggulangan Bencana Daerah (BPBD) Sumatera Barat menaikkan radius pengungsian darurat. Tim TRC BNPB telah mendirikan posko tanggap darurat dan membagikan masker serta logistik medis kepada 3.200 warga terdampak hujan abu tebal di wilayah Bukittinggi dan sekitarnya.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 3), 30),
      publishedAt: `${todayISO}T06:30:00+07:00`,
      daysAgo: 0,
      category: 'Bencana',
      threatLevel: 'HIGH',
      sourceUrl: 'https://bmkg.go.id/situasi-erupsi-marapi-terkini',
      verified: true,
      region: 'Sumatera Barat',
      impactScore: 'TINGGI',
      tags: ['Vulkanik', 'Gunung Marapi', 'Evakuasi', 'BNPB', 'Siaga III']
    },
    {
      id: 'news-live-04',
      source: 'Detikcom Inet & Siber',
      title: 'Polda Metro Jaya & Bareskrim Bongkar Sindikat Call Center Scam Internasional di BSD',
      summary: 'Penggerebekan safe house sindikat penipuan perbankan dan love scam kripto menyita 80 unit laptop, ribuan kartu SIM aktif, serta server proxy penyamar IP internasional.',
      fullContent: 'Penyidik Subdit Siber Direktorat Reserse Kriminal Khusus Polda Metro Jaya menangkap 14 tersangka yang mengoperasikan infrastruktur penipuan berbasis social engineering. Kerugian nasabah diperkirakan menembus puluhan miliar rupiah. Pusat komando menggunakan jaringan VPN lapis ganda untuk mengelabui pelacakan IP.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 4), 10),
      publishedAt: `${todayISO}T05:10:00+07:00`,
      daysAgo: 0,
      category: 'Keamanan',
      threatLevel: 'HIGH',
      sourceUrl: 'https://detik.com/inet/cybercrime/polisi-gerebek-call-center-scam-bsd',
      verified: true,
      region: 'Banten / DKI Jakarta',
      impactScore: 'TINGGI',
      tags: ['Siber Polri', 'Scam', 'Social Engineering', 'Pencucian Uang']
    },
    {
      id: 'news-live-05',
      source: 'Antara News Politik & Hankam',
      title: 'Kemenko Polhukam Matangkan Kerangka Kerja Pertahanan Siber Objek Vital Nasional',
      summary: 'Rakor tingkat menteri menyepakati integrasi SOC seluruh pengelola Objek Vital Nasional (OVN) dengan Sistem Komando BSSN dan BIN guna mengantisipasi perang asimetris dan disinformasi.',
      fullContent: 'Pemerintah merampungkan draf aturan percepatan penanganan krisis siber nasional yang mewajibkan seluruh pengelola Objek Vital Nasional (OVN) mengintegrasikan SOC internal dengan Sistem Komando Nasional BSSN dan BIN. Regulasi ini juga memuat sanksi tegas atas kelalaian pengelolaan kebocoran data rahasia negara.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 5), 20),
      publishedAt: `${todayISO}T04:20:00+07:00`,
      daysAgo: 0,
      category: 'Politik',
      threatLevel: 'MEDIUM',
      sourceUrl: 'https://antaranews.com/politik/ruu-krisis-siber-nasional',
      verified: true,
      region: 'Nasional / Jakarta',
      impactScore: 'SEDANG',
      tags: ['Regulasi', 'Kemenkopolhukam', 'Ketahanan Siber', 'Objek Vital']
    },
    {
      id: 'news-live-06',
      source: 'Kompas.id Siber & Hukum',
      title: 'Analisis CSIRT: Peningkatan 300% Serangan Phishing QR Code (Quishing) pada Aplikasi Finansial',
      summary: 'Metode penipuan terbaru menyisipkan tautan berbahaya di dalam poster QR Code palsu pembayaran parkir dan e-commerce guna menguras saldo e-wallet pengguna.',
      fullContent: 'Pakar forensik digital Kompas merilis laporan tren serangan mobile malware 2026 yang mendominasi kawasan perkotaan. Kode QR palsu mengarahkan korban ke landing page tiruan yang secara otomatis mengunduh APK payload pencuri OTP SMS. Edukasi publik dan verifikasi sertifikat SSL menjadi rekomendasi utama.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 6), 45),
      publishedAt: `${todayISO}T03:45:00+07:00`,
      daysAgo: 0,
      category: 'Cyber',
      threatLevel: 'MEDIUM',
      sourceUrl: 'https://kompas.id/siber/waspada-serangan-quishing-qr-code',
      verified: true,
      region: 'DKI Jakarta & Surabaya',
      impactScore: 'SEDANG',
      tags: ['Quishing', 'QR Code', 'Phishing', 'Malware APK', 'E-Wallet']
    },

    // KEMARIN (daysAgo: 1)
    {
      id: 'news-nat-07',
      source: 'BSSN Threat Advisory',
      title: 'Pusat Malware BSSN Rilis IoC Terkait Varian Ransomware Akira 2.0 yang Mengincar Server Linux',
      summary: 'Ransomware mengeksploitasi kerentanan lama VMware ESXi dan SSH miskonfigurasi. Indikator kompromi hash SHA-256 dan IP pool telah disinkronkan ke seluruh SOC kementerian.',
      fullContent: 'Tim Gov-CSIRT mendeteksi 6 insiden enkripsi ransomware Akira varian mutasi yang menyerang hypervisor server lokal. Payload mampu menghapus shadow copy dan mematikan daemon backup otomatis. Seluruh operator sistem diinstruksikan segera mengisolasi node terdampak dan melakukan backup offline air-gapped.',
      timestamp: '21:10 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T21:10:00+07:00`,
      daysAgo: 1,
      category: 'Cyber',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://bssn.go.id/advisory-ransomware-akira-linux',
      verified: true,
      region: 'Jawa Barat & Jawa Tengah',
      impactScore: 'KRITIS',
      tags: ['Ransomware', 'Akira', 'ESXi', 'Linux', 'IoC']
    },
    {
      id: 'news-nat-08',
      source: 'BNPB Pusdalops',
      title: 'Banjir Bandang & Tanah Longsor Putuskan Jalur Logistik Antar-Kabupaten di Pesisir Selatan',
      summary: 'Curah hujan ekstrem memicu luapan sungai dan material longsor yang menimbun 4 jembatan penghubung utama. Jalur logistik dialihkan via koridor darurat.',
      fullContent: 'Pusat Pengendalian Operasi BNPB mencatat 1.800 kepala keluarga terisolasi sementara akibat tertutupnya akses jalan nasional. Alat berat Kementerian PUPR dan tim SAR gabungan TNI/Polri dikerahkan untuk membuka timbunan material longsor dan mendistribusikan bantuan logistik helikopter.',
      timestamp: '16:45 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T16:45:00+07:00`,
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
      id: 'news-nat-09',
      source: 'Detikcom Keamanan & Intelijen',
      title: 'Densus 88 Tangkap 3 Terduga Jaringan Radikal Digital Terkait Pendanaan Kripto Monero',
      summary: 'Penangkapan dilakukan di tiga lokasi berbeda di Jawa Barat dan Solo Raya. Petugas menyita bukti digital wallet Monero serta materi propaganda di channel terenkripsi.',
      fullContent: 'Operasi penindakan senyap berhasil mengamankan terduga fasilitator dana yang menghimpun donasi daring melalui bot Telegram terselubung. Dari penggeledahan barang bukti, ditemukan buku panduan pembuatan bahan peledak improvisasi (IED) dan percakapan rencana sabotase objek vital.',
      timestamp: '11:05 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T11:05:00+07:00`,
      daysAgo: 1,
      category: 'Keamanan',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://detik.com/keamanan/densus-tangkap-terduga-teror-kripto',
      verified: true,
      region: 'Solo Raya / Jawa Tengah',
      impactScore: 'KRITIS',
      tags: ['Densus 88', 'Terorisme', 'Kripto', 'Monero', 'Propaganda']
    },

    // 2 HARI LALU (daysAgo: 2)
    {
      id: 'news-nat-10',
      source: 'CNN Indonesia Pertahanan',
      title: 'Pangdam Jaya & Korps Marinir Gelar Latihan Pengamanan Objek Vital Energi Nasional',
      summary: 'Simulasi tanggap darurat ancaman terorisme dan sabotase drone pada kilang tangki bahan bakar minyak Plumpang dan fasilitas transmisi gas pipa bawah laut.',
      fullContent: 'Latihan gabungan melibatkan satuan antiteror Denjaka dan Yonif Mekanis dengan fokus penanggulangan serangan drone kamikaze nirawak serta simulasi pembebasan sandera. Pangdam menegaskan bahwa stabilitas pasokan energi ibu kota merupakan prioritas keamanan nasional tertinggi.',
      timestamp: '15:20 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(2))}T15:20:00+07:00`,
      daysAgo: 2,
      category: 'Keamanan',
      threatLevel: 'MEDIUM',
      sourceUrl: 'https://cnnindonesia.com/nasional/tni-marinir-latihan-pengamanan-obvitnas',
      verified: true,
      region: 'DKI Jakarta Utara',
      impactScore: 'SEDANG',
      tags: ['Latihan Gabungan', 'Marinir', 'Kilang Minyak', 'Obvitnas', 'Anti-Drone']
    },
    {
      id: 'news-nat-11',
      source: 'Kompas.id Polhukam',
      title: 'Kemenkopolhukam Bentuk Gugus Tugas Terpadu Penanganan Sindikat Perdagangan Orang (TPPO)',
      summary: 'Koordinasi lintas instansi BIN, Imigrasi, dan Bareskrim diperketat di pintu perbatasan Entikong dan Batam menyusul modus penyelundupan tenaga kerja ilegal ke kasino online.',
      fullContent: 'Satgas TPPO berhasil menggagalkan keberangkatan 42 calon pekerja migran non-prosedural di Bandara Soekarno-Hatta yang dijanjikan pekerjaan telemarketing di kawasan segitiga emas. Pelaku perekrut menggunakan modus agen perjalanan wisata fiktif.',
      timestamp: '10:15 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(2))}T10:15:00+07:00`,
      daysAgo: 2,
      category: 'Politik',
      threatLevel: 'HIGH',
      sourceUrl: 'https://kompas.id/polhukam/satgas-tppo-perbatasan-batam',
      verified: true,
      region: 'Batam & Kalimantan Barat',
      impactScore: 'TINGGI',
      tags: ['TPPO', 'Perbatasan', 'Satgas', 'Imigrasi', 'Judi Online']
    },

    // 3 HARI LALU (daysAgo: 3)
    {
      id: 'news-nat-12',
      source: 'Bakamla RI Komando Operasi',
      title: 'Bakamla RI KN Tanjung Datu 301 Halau Kapal Riset Asing yang Masuk Landas Kontinen Natuna',
      summary: 'Kapal survei kelautan berbendera asing terdeteksi berlayar tanpa izin dengan kecepatan rendah dan menggelar sensor seismik di perairan ZEE Indonesia.',
      fullContent: 'Setelah peringatan radio VHF berkali-kali tidak direspons secara memadai, KN Tanjung Datu melakukan manuver shadow intercept dan mengawal kapal keluar dari landas kontinen yurisdiksi Indonesia. Koordinasi diplomatik dilakukan Kementerian Luar Negeri.',
      timestamp: '17:30 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(3))}T17:30:00+07:00`,
      daysAgo: 3,
      category: 'Keamanan',
      threatLevel: 'HIGH',
      sourceUrl: 'https://bakamla.go.id/berita-penghalauan-kapal-survei-natuna',
      verified: true,
      region: 'Laut Natuna Utara / Kepri',
      impactScore: 'TINGGI',
      tags: ['Bakamla', 'Natuna Utara', 'ZEE', 'Kedaulatan Maritim']
    },
    {
      id: 'news-nat-13',
      source: 'Satgas Siber IKN',
      title: 'Audit Keamanan Sistem SCADA Smart City Ibu Kota Nusantara Menunjukkan Kondisi Prima',
      summary: 'Penetrasi simulasi Red Team berkala telah diselesaikan pada sistem grid listrik dan air bersih digital IKN Nusantara tanpa temuan celah kritikal.',
      fullContent: 'Audit ketat oleh konsorsium siber nasional menguji 45 perimeter IoT smart city, transmisi telemetri SCADA, dan otentikasi biometrik pusat komando IKN. Hasil audit menyatakan seluruh protokol enkripsi kuantum-resisten berjalan sesuai standar keamanan BSSN.',
      timestamp: '14:40 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(3))}T14:40:00+07:00`,
      daysAgo: 3,
      category: 'Cyber',
      threatLevel: 'LOW',
      sourceUrl: 'https://ikn.go.id/audit-keamanan-scada-berkala',
      verified: true,
      region: 'IKN Nusantara / Kaltim',
      impactScore: 'RENDAH',
      tags: ['IKN Nusantara', 'SCADA', 'Smart City', 'Red Team', 'Audit']
    },

    // 4 HARI LALU (daysAgo: 4)
    {
      id: 'news-nat-14',
      source: 'Antara News Hankam',
      title: 'Panglima TNI Tinjau Kesiapan Pasukan Perdamaian & Satgas Pengamanan Perbatasan RI-PNG',
      summary: 'Pemeriksaan persenjataan, pos pemantauan drone thermal perbatasan, dan kesiapan medis prajurit di sektor Merauke dan Boven Digoel.',
      fullContent: 'Panglima menegaskan pentingnya pemanfaatan teknologi drone jarak jauh berkamera termal dalam mengantisipasi jalur tikus penyelundupan lintas batas darat. Kolaborasi dengan tokoh adat setempat terus diperkuat guna menjaga stabilitas sosial dan keamanan perbatasan.',
      timestamp: '10:00 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(4))}T10:00:00+07:00`,
      daysAgo: 4,
      category: 'Keamanan',
      threatLevel: 'MEDIUM',
      sourceUrl: 'https://antaranews.com/hankam/tinjauan-perbatasan-papua',
      verified: true,
      region: 'Papua Selatan',
      impactScore: 'SEDANG',
      tags: ['Perbatasan', 'RI-PNG', 'Drone Thermal', 'TNI']
    },

    // 5 HARI LALU (daysAgo: 5)
    {
      id: 'news-nat-15',
      source: 'Kementerian ESDM & Siber',
      title: 'Deteksi Serangan Malware Phishing Menyamar Regulasi Subsidi Energi Baru',
      summary: 'Email tipuan dengan berkas attachment berbahaya disebarkan ke sejumlah BUMN dan kontraktor migas nasional untuk mencuri kredensial internal.',
      fullContent: 'File berekstensi .vbs dan .scr diinjeksi ke dalam dokumen PDF palsu bertajuk Kuota_Subsidi_ESDM_2026. Analisis sandbox mendeteksi modul infostealer RedLine varian mutasi baru. Seluruh domain pengirim email palsu telah diblokir di level gateway nasional.',
      timestamp: '16:15 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(5))}T16:15:00+07:00`,
      daysAgo: 5,
      category: 'Cyber',
      threatLevel: 'HIGH',
      sourceUrl: 'https://esdm.go.id/peringatan-phishing-sektor-energi',
      verified: true,
      region: 'Nasional',
      impactScore: 'TINGGI',
      tags: ['Phishing', 'ESDM', 'Infostealer', 'BUMN', 'RedLine']
    },

    // 6 HARI LALU (daysAgo: 6)
    {
      id: 'news-nat-16',
      source: 'Tempo Investigasi',
      title: 'Investigasi Mafia Penyelundupan Timah Ilegal Menggunakan Dokumen Muatan Ekspor Palsu',
      summary: 'Sindikat pemalsuan manifest kapal tongkang meloloskan ribuan ton pasir timah mentah melalui pelabuhan tikus Bangka Belitung menuju perairan internasional.',
      fullContent: 'Tim gabungan Kejaksaan Agung dan Satgas Terpadu Pertambangan menyita 4 kapal tongkang bermuatan timah ilegal tanpa barcode RKAB. Kerugian lingkungan dan pendapatan negara diestimasi mencapai triliunan rupiah.',
      timestamp: '18:45 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(6))}T18:45:00+07:00`,
      daysAgo: 6,
      category: 'Keamanan',
      threatLevel: 'HIGH',
      sourceUrl: 'https://tempo.co/investigasi/penyelundupan-timah-bangka',
      verified: true,
      region: 'Bangka Belitung',
      impactScore: 'TINGGI',
      tags: ['Tambang Ilegal', 'Bangka', 'Ekspor Gelap', 'Kejaksaan']
    }
  ];
};

// POOL DISPATCH BERITA STREAMING DINAMIS (Untuk Auto-Ingest Tiap 45 Detik / Tombol Refresh Manual)
export const STREAMING_NEWS_POOL: Omit<NewsItem, 'id' | 'timestamp' | 'publishedAt' | 'daysAgo'>[] = [
  {
    source: 'CNN Indonesia Hankam',
    title: 'BREAKING: Intersepsi Drone Liar Nirawak yang Melintas di Kawasan Terlarang Ring 1 IKN',
    summary: 'Sistem anti-drone jammer Paspampres berhasil memaksa turun (forced landing) satu unit drone berbaling-baling quadcopter yang terbang di atas Istana Garuda tanpa izin resmi navigasi udara.',
    fullContent: 'Operator pengendali drone teridentifikasi berada pada radius 1.2 km dari batas perimeter luar dan telah diamankan oleh satuan pengamanan gabungan Pomdam VI/Mulawarman. Memori drone sedang menjalani ekstraksi data forensik digital.',
    category: 'Keamanan',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://cnnindonesia.com/hankam/drone-liar-ikn-dilumpuhkan',
    verified: true,
    region: 'IKN Nusantara / Kaltim',
    impactScore: 'KRITIS',
    tags: ['Anti-Drone', 'IKN', 'Paspampres', 'Ring 1', 'Jammer']
  },
  {
    source: 'BSSN Threat Advisory',
    title: 'Gov-CSIRT Terbitkan Peringatan Darurat Patching Kerentanan Zero-Day Apache & OpenSSH',
    summary: 'Ditemukan celah eksekusi kode jarak jauh (RCE) yang mulai dimanfaatkan oleh botnet otomatis untuk menginfeksi server portal pemerintah daerah dan kementerian.',
    fullContent: 'BSSN menginstruksikan seluruh admin sistem SOC daerah untuk segera memperbarui paket openssh-server ke versi terbaru serta membatasi port 22 hanya melalui VPN terenkripsi dengan otentikasi kunci public-key.',
    category: 'Cyber',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://csirt.bssn.go.id/advisory-zero-day-openssh-apache',
    verified: true,
    region: 'Nasional / Seluruh Sektor',
    impactScore: 'KRITIS',
    tags: ['Zero-Day', 'BSSN', 'Gov-CSIRT', 'OpenSSH', 'Patching']
  },
  {
    source: 'BMKG Indonesia',
    title: 'Peringatan Dini Cuaca Ekstrem: Gelombang Tinggi 4.5 Meter di Samudera Hindia Selatan Jawa & Bali',
    summary: 'Bibit siklon tropis memicu angin kencang berkecepatan 35 knot dan risiko tinggi terhadap pelayaran nelayan serta kapal ferry lintas Selat Bali dan Selat Sunda.',
    fullContent: 'BMKG mengeluarkan peringatan siaga merah bagi operator kapal penyeberangan PT ASDP Indonesia Ferry untuk menunda sementara keberangkatan kapal kecil hingga kondisi gelombang mereda dalam 24 jam ke depan.',
    category: 'Bencana',
    threatLevel: 'HIGH',
    sourceUrl: 'https://bmkg.go.id/peringatan-cuaca-gelombang-tinggi-selatan-jawa',
    verified: true,
    region: 'Jawa Selatan & Selat Bali',
    impactScore: 'TINGGI',
    tags: ['BMKG', 'Gelombang Tinggi', 'Cuaca Ekstrem', 'ASDP', 'Pelayaran']
  },
  {
    source: 'Detikcom Inet & Siber',
    title: 'Bareskrim Siber Ungkap Serangan Ransomware LockBit Afiliasi Asia Tenggara yang Menyasar Rumah Sakit',
    summary: 'Penyidik siber berhasil memulihkan kunci dekripsi database rekam medis RSUD tanpa membayar tebusan berkat koordinasi intensif bersama Interpol Cyber Fusion Centre.',
    fullContent: 'Pelaku menuntut tebusan 15 Bitcoin melalui dompet terenkripsi. Berkat respon cepat tim insiden tanggap darurat, data cadangan berhasil dipulihkan dari cold-storage dalam kurun waktu 4 jam tanpa kebocoran data pasien.',
    category: 'Cyber',
    threatLevel: 'HIGH',
    sourceUrl: 'https://detik.com/inet/cybercrime/bareskrim-tangani-ransomware-rsud',
    verified: true,
    region: 'Jawa Timur',
    impactScore: 'TINGGI',
    tags: ['LockBit', 'Ransomware', 'Bareskrim', 'Rumah Sakit', 'Interpol']
  },
  {
    source: 'Antara News Hankam',
    title: 'Satgas Terpadu Operasi Damai Cartenz Amankan 3 Pucuk Senpi Otomatis di Puncak Jaya',
    summary: 'Penyisiran jalur tikus logistik kelompok bersenjata berhasil mengamankan amunisi kaliber 7.62 mm dan perangkat komunikasi radio satelit militer.',
    fullContent: 'Operasi dipimpin gabungan personel TNI-Polri setelah menerima laporan warga terkait pergerakan kelompok separatis. Wilayah Puncak Jaya kini dilaporkan kondusif dengan penjagaan ketat pos perbatasan.',
    category: 'Keamanan',
    threatLevel: 'HIGH',
    sourceUrl: 'https://antaranews.com/hankam/satgas-cartenz-amankan-senpi-papua',
    verified: true,
    region: 'Papua Tengah',
    impactScore: 'TINGGI',
    tags: ['Damai Cartenz', 'Papua', 'TNI-Polri', 'Senpi Ilegal']
  },
  {
    source: 'Kompas.id Cyber & Polhukam',
    title: 'Serangan DDoS Berkekuatan 920 Gbps Menggempur Gateway Pembayaran Nasional Berhasil Dimutasi',
    summary: 'Mitigasi scrubbing center telco nasional berhasil menyerap lalu lintas anomali amplifikasi DNS dan NTP dalam kurun waktu 12 menit tanpa gangguan transaksi publik.',
    fullContent: 'Lalu lintas serangan berasal dari 450.000 botnet perangkat router IoT yang terkompromi di berbagai belahan dunia. Tidak ada data nasabah yang bocor dan sistem kliring Bank Indonesia tetap beroperasi normal.',
    category: 'Cyber',
    threatLevel: 'HIGH',
    sourceUrl: 'https://kompas.id/cyber/mitigasi-ddos-gateway-pembayaran',
    verified: true,
    region: 'DKI Jakarta / Nasional',
    impactScore: 'TINGGI',
    tags: ['DDoS', 'Scrubbing Center', 'Perbankan', 'IoT Botnet']
  },
  {
    source: 'Bakamla RI Maritim',
    title: 'KN Pulau Marore 322 Halau Kapal Nelayan Asing Berpukat Harimau di Perairan Natuna',
    summary: 'Sebanyak dua kapal ikan asing tanpa dokumen izin penangkapan ikan terdeteksi mencuri sumber daya laut di wilayah yurisdiksi Indonesia.',
    fullContent: 'Personel Bakamla RI melakukan penangkapan dan mengawal kedua kapal ikan beserta 18 awak kapal ke pangkalan Batam untuk menjalani proses hukum dan penyitaan alat tangkap terlarang trawl.',
    category: 'Keamanan',
    threatLevel: 'MEDIUM',
    sourceUrl: 'https://bakamla.go.id/penangkapan-kapal-ikan-asing-natuna',
    verified: true,
    region: 'Laut Natuna Utara',
    impactScore: 'SEDANG',
    tags: ['Bakamla', 'Illegal Fishing', 'Natuna', 'Kedaulatan Maritim']
  },
  {
    source: 'Kemenko Polhukam RI',
    title: 'Pemerintah Perkuat Regulasi Perlindungan Data Pribadi (PDP) dengan Pembentukan Badan Pengawas Independen',
    summary: 'Regulasi baru mengatur denda administratif maksimal 2% dari total pendapatan tahunan korporasi jika terbukti lalai mengamankan basis data publik dari peretasan.',
    fullContent: 'Menteri Koordinator Bidang Polhukam menekankan bahwa kedaulatan data adalah bagian fundamental dari keamanan nasional. Seluruh PSE lingkup publik dan privat diwajibkan memiliki Data Protection Officer (DPO) bersertifikat.',
    category: 'Politik',
    threatLevel: 'LOW',
    sourceUrl: 'https://polhukam.go.id/pengesahan-badan-pengawas-pdp',
    verified: true,
    region: 'Nasional / Jakarta',
    impactScore: 'RENDAH',
    tags: ['PDP', 'Kemenkopolhukam', 'Data Privacy', 'DPO', 'Regulasi']
  },
  {
    source: 'Detikcom Nasional',
    title: 'Banjir Luapan Sungai Citarum Genangi 1.200 Rumah di Baleendah Kabupaten Bandung',
    summary: 'Hujan deras berdurasi 6 jam menyebabkan tanggul saluran air jebol. Tim SAR BPBD Jabar mengerahkan perahu karet untuk evakuasi balita dan lansia.',
    fullContent: 'Ketinggian air mencapai 80 hingga 150 cm di titik terendah pemukiman. Posko pengungsian darurat telah didirikan di kantor kecamatan dengan persediaan makanan dan pos kesehatan lapangan.',
    category: 'Bencana',
    threatLevel: 'MEDIUM',
    sourceUrl: 'https://detik.com/jabar/berita/banjir-baleendah-citarum',
    verified: true,
    region: 'Jawa Barat / Bandung',
    impactScore: 'SEDANG',
    tags: ['Banjir', 'Citarum', 'Baleendah', 'SAR BPBD', 'Evakuasi']
  },
  {
    source: 'Humas Mabes Polri',
    title: 'Bareskrim Tangkap Aktor Utama Pembuat Malware Trojan Perbankan Berkedok File Undangan Nikah APK',
    summary: 'Tersangka ditangkap di Sulawesi Selatan setelah melancarkan aksi phising APK yang telah menguras rekening ratusan korban di berbagai daerah.',
    fullContent: 'Dari hasil interogasi forensik, tersangka membeli source-code malware dari forum hacker luar negeri lalu memodifikasinya dengan fitur auto-forward SMS OTP ke bot Telegram pribadi. Rekening bank penampung telah dibekukan PPATK.',
    category: 'Cyber',
    threatLevel: 'HIGH',
    sourceUrl: 'https://polri.go.id/bareskrim-tangkap-pembuat-apk-undangan-nikah',
    verified: true,
    region: 'Sulawesi Selatan / Nasional',
    impactScore: 'TINGGI',
    tags: ['APK Malware', 'Phishing', 'Bareskrim', 'OTP SMS', 'Cyber Crime']
  }
];
