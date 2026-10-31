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
  const h = String(Math.max(0, Math.min(23, hours))).padStart(2, '0');
  const m = String(Math.max(0, Math.min(59, minutes))).padStart(2, '0');
  return `${h}:${m} WIB`;
};

// Generate dataset berita nasional terverifikasi 7 hari dinamis mengikuti tanggal hari ini
export const generateDynamicNewsDataset = (): NewsItem[] => {
  const today = new Date();
  const todayISO = formatISODate(today);
  const currentHour = today.getHours();

  return [
    // =========================================================================
    // HARI INI (daysAgo: 0) - Waktu Real-Time Berjalan
    // =========================================================================
    {
      id: 'news-live-demo-01',
      source: 'CNN Indonesia Nasional',
      title: 'Aksi Ribuan Buruh & Mahasiswa Geruduk Gedung DPR RI Senayan Menuntut Kenaikan UMP & Tolak Gelombang PHK',
      summary: 'Massa gabungan konfederasi serikat buruh dan aliansi mahasiswa menggelar unjuk rasa besar di depan pintu gerbang utama Gedung DPR/MPR RI. Ditlantas Polda Metro Jaya memberlakukan rekayasa lalu lintas Jl. Gatot Subroto.',
      fullContent: 'Ribuan demonstran dari berbagai elemen buruh se-Jabodetabek dan mahasiswa memadati ruas Jl. Gatot Subroto sejak pukul 10.00 WIB. Tuntutan utama mencakup penetapan kenaikan UMP tahun 2027 minimal 8-10%, pencabutan kluster ketenagakerjaan, dan perlindungan buruh kontrak yang marak terkena PHK massal. Sebanyak 2.850 personel gabungan TNI-Polri disiagakan dengan kawat berduri dan unit Water Cannon di perimeter Ring 1 Gedung Parlemen. Perwakilan massa diterima audiensi oleh anggota Komisi IX DPR RI pada siang hari.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 1), 15),
      publishedAt: `${todayISO}T10:15:00+07:00`,
      daysAgo: 0,
      category: 'Demo',
      threatLevel: 'HIGH',
      sourceUrl: 'https://cnnindonesia.com/nasional/demo-buruh-mahasiswa-dpr-senayan',
      verified: true,
      region: 'DKI Jakarta / Gedung DPR RI',
      impactScore: 'TINGGI',
      tags: ['Demo Buruh', 'DPR RI', 'UMP', 'PHK Massal', 'Polda Metro Jaya', 'Rekayasa Lalin']
    },
    {
      id: 'news-live-korupsi-01',
      source: 'KPK RI Info Perkara',
      title: 'KPK Tangkap Tangan (OTT) Pejabat Kementerian & Rekanan Proyek Terkait Suap Pengadaan Jalur Kereta',
      summary: 'Tim penindakan Komisi Pemberantasan Korupsi mengamankan 6 orang tersangka beserta koper berisi uang tunai rupiah dan valuta asing senilai Rp 14,2 Miliar dalam operasi senyap di Jakarta dan Semarang.',
      fullContent: 'Juru Bicara Penindakan KPK membenarkan adanya Operasi Tangkap Tangan terhadap salah satu Direktur PPK Kementerian Perhubungan bersama kontraktor pelaksana swasta. Suap diduga berkaitan dengan commitment fee 10% untuk pemulusan lelang tender pemeliharaan rel ganda Sumatera-Jawa. Barang bukti dokumen lelang dan transaksi perbankan telah disegel di Gedung Merah Putih KPK untuk pemeriksaan intensif 1x24 jam.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 2), 40),
      publishedAt: `${todayISO}T09:40:00+07:00`,
      daysAgo: 0,
      category: 'Korupsi',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://kpk.go.id/berita-penindakan/ott-suap-jalur-kereta-kemenhub',
      verified: true,
      region: 'DKI Jakarta & Jawa Tengah',
      impactScore: 'KRITIS',
      tags: ['KPK', 'OTT', 'Korupsi', 'Suap Proyek', 'Kereta Api', 'Tipikor']
    },
    {
      id: 'news-live-kriminal-01',
      source: 'Humas Mabes Polri / Bareskrim',
      title: 'Bareskrim Polri Sita 145 Kg Sabu Asal Golden Triangle yang Disamarkan dalam Truk Sayur di Pelabuhan Merak',
      summary: 'Penyelundupan narkotika skala besar jaringan internasional transit dari Aceh menuju Pulau Jawa digagalkan Tim Satgassus Narkoba Dittipid Narkoba Bareskrim Polri saat menyeberang di Dermaga Eksekutif Merak.',
      fullContent: 'Berdasarkan sinyal intelijen analisis IT dan profiling lintasan kendaraan, petugas mencegat truk diesel muatan kol dan sawi asal Pekanbaru. Dalam pemeriksaan anjing pelacak K-9 dan pemindai x-ray, ditemukan kompartemen rahasia ganda di lantai bak truk berisi 145 bungkusan teh cina warna emas berisi kristal methamphetamine (sabu). Tiga orang kurir ditangkap dan jaringan pengendali asal Medan kini diburu.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 3), 10),
      publishedAt: `${todayISO}T08:10:00+07:00`,
      daysAgo: 0,
      category: 'Kriminal',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://polri.go.id/bareskrim-sita-145kg-sabu-pelabuhan-merak',
      verified: true,
      region: 'Banten / Pelabuhan Merak',
      impactScore: 'KRITIS',
      tags: ['Bareskrim', 'Narkoba', 'Sabu', 'Golden Triangle', 'Pelabuhan Merak', 'Kamtibmas']
    },
    {
      id: 'news-live-cyber-01',
      source: 'Detikcom Inet & Siber',
      title: 'Kasus Beking Judi Online Oknum Kementerian Komdigi: Bareskrim Sita Uang Tunai Rp 89 Miliar & Puluhan Emas Batangan',
      summary: 'Penyidik Direktorat Tindak Pidana Siber Bareskrim Polri menggeledah ruko kantor satelit di Bekasi dan safe house di Jakarta Selatan yang mengamankan miliaran rupiah dari pengelolaan ribuan situs judi slot.',
      fullContent: 'Sebanyak 18 tersangka termasuk pegawai berstatus ASN dan tenaga ahli honorer Kementerian Komunikasi dan Digital (Komdigi) telah diamankan. Modus operandi pelaku yakni sengaja tidak memblokir situs judi online tertentu yang menyetorkan uang upeti bulanan Rp 8-15 juta per domain website. Polisi menyita 45 unit smartphone terenkripsi, puluhan rekening bank, serta senjata api tanpa izin.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 4), 25),
      publishedAt: `${todayISO}T07:25:00+07:00`,
      daysAgo: 0,
      category: 'Cyber',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://detik.com/inet/cybercrime/bareskrim-sita-89-miliar-kasus-judol-komdigi',
      verified: true,
      region: 'DKI Jakarta & Bekasi',
      impactScore: 'KRITIS',
      tags: ['Judi Online', 'Komdigi', 'Siber Polri', 'TPPU', 'Bareskrim', 'Slot']
    },
    {
      id: 'news-live-teror-01',
      source: 'Antara News Hukum & Keamanan',
      title: 'Densus 88 Antiteror Polri Tangkap 4 Terduga Sel Radikal di Jawa Barat yang Siapkan Aksi Teror Pilkada',
      summary: 'Penangkapan serentak dilakukan di Bandung, Cirebon, dan Bogor. Petugas menyita bahan peledak berdaya ledak tinggi (TATP), busur panah, dan buku doktrin baiat.',
      fullContent: 'Juru Bicara Densus 88 AT Polri menyatakan keempat tersangka merupakan anggota jaringan Jamaah Ansharut Daulah (JAD) yang merencanakan penyerangan terhadap kantor kepolisian dan instalasi KPU daerah menjelang pemungutan suara pilkada serentak. Pelaku mempelajari teknik peracikan bahan peledak dari grup Telegram luar negeri beranggotakan ribuan simpatisan teror.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 5), 50),
      publishedAt: `${todayISO}T06:50:00+07:00`,
      daysAgo: 0,
      category: 'Terorisme',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://antaranews.com/hukum/densus88-tangkap-terduga-teroris-jabar-pilkada',
      verified: true,
      region: 'Jawa Barat (Bandung & Cirebon)',
      impactScore: 'KRITIS',
      tags: ['Densus 88', 'Terorisme', 'JAD', 'TATP', 'Bom IED', 'Pilkada']
    },
    {
      id: 'news-live-politik-01',
      source: 'Kompas.id Polhukam',
      title: 'Bawaslu & Sentra Gakkumdu Usut 86 Laporan Dugaan Politik Uang & Intimidasi ASN di Pilkada Serentak',
      summary: 'Badan Pengawas Pemilu memetakan indikasi pembagian paket sembako beramplop dan manipulasi absensi digital ASN untuk memenangkan paslon tertentu di wilayah Jawa dan Sumatera.',
      fullContent: 'Ketua Bawaslu RI menegaskan telah meneruskan 24 perkara pidana pemilu ke tingkat penyidikan kepolisian dan kejaksaan. Selain politik uang konvensional, Bawaslu mendeteksi penyaluran e-wallet dompet digital massal yang menyasar pemilih pemula di kawasan perkotaan.',
      timestamp: formatWIBTime(Math.max(0, currentHour - 6), 30),
      publishedAt: `${todayISO}T05:30:00+07:00`,
      daysAgo: 0,
      category: 'Politik',
      threatLevel: 'MEDIUM',
      sourceUrl: 'https://kompas.id/polhukam/bawaslu-usut-laporan-politik-uang-pilkada',
      verified: true,
      region: 'Nasional / Jawa & Sumatera',
      impactScore: 'SEDANG',
      tags: ['Pilkada', 'Bawaslu', 'Gakkumdu', 'Politik Uang', 'ASN Netralitas']
    },

    // =========================================================================
    // KEMARIN (daysAgo: 1) - Termasuk Demo Besar & Operasi Kriminal Kemarin
    // =========================================================================
    {
      id: 'news-kemarin-demo-02',
      source: 'Detikcom News',
      title: 'Aksi Unjuk Rasa Mahasiswa & Rakyat di Kawasan Patung Kuda Monas Diwarnai Bakar Ban & Kericuhan Ringan',
      summary: 'Massa mahasiswa BEM Seluruh Indonesia berunjuk rasa di Patung Kuda menolak kebijakan efisiensi subsidi dan menuntut transparansi penegakan hukum. Kawat berduri dan barrier water cannon disiagakan petugas.',
      fullContent: 'Unjuk rasa yang dimulai sejak pukul 14.00 WIB kemarin sempat memanas saat massa mencoba menerobos barikade kawat berduri menuju Istana Merdeka di Jl. Medan Merdeka Barat. Massa membakar sejumlah ban bekas dan melemparkan botol mineral ke arah petugas pengamanan. Kapolres Metro Jakarta Pusat memimpin negosiasi humanis sehingga situasi terkendali menjelang maghrib dan massa membubarkan diri dengan tertib.',
      timestamp: '17:45 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T17:45:00+07:00`,
      daysAgo: 1,
      category: 'Demo',
      threatLevel: 'HIGH',
      sourceUrl: 'https://detik.com/news/berita/demo-patung-kuda-monas-bakar-ban-ricuh',
      verified: true,
      region: 'DKI Jakarta / Patung Kuda Monas',
      impactScore: 'TINGGI',
      tags: ['Demo Mahasiswa', 'BEM SI', 'Patung Kuda', 'Monas', 'Brimob', 'Unjuk Rasa']
    },
    {
      id: 'news-kemarin-korupsi-02',
      source: 'Kejaksaan Agung RI Humas',
      title: 'Kejaksaan Agung Sita 12 Kapal Tongkang & Blokir Aset Rp 78 Miliar Terkait Korupsi Mafia Ekspor Timah Ilegal',
      summary: 'Penyidik Jampidsus Kejaksaan Agung melakukan penyitaan fisik kapal pengangkut mineral mentah ilegal di Kepulauan Bangka Belitung serta memeriksa 9 saksi pejabat kementerian ESDM.',
      fullContent: 'Tim penyidik Pidana Khusus Kejagung menyita 12 unit kapal tongkang dan tugboat yang digunakan sindikat penyelundupan pasir timah berkadar tinggi ke Singapura tanpa izin ekspor resmi RKAB. Kerugian perekonomian negara dalam tata niaga timah periode 2023-2026 ditaksir menembus puluhan triliun rupiah.',
      timestamp: '15:10 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T15:10:00+07:00`,
      daysAgo: 1,
      category: 'Korupsi',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://kejaksaan.go.id/berita-penyitaan-aset-mafia-timah-bangka',
      verified: true,
      region: 'Bangka Belitung / Pangkal Pinang',
      impactScore: 'KRITIS',
      tags: ['Kejagung', 'Korupsi Timah', 'Jampidsus', 'Penyitaan Aset', 'Mafia Tambang']
    },
    {
      id: 'news-kemarin-kriminal-02',
      source: 'Polda Metro Jaya Ditreskrimum',
      title: 'Polda Metro Jaya Gulung Sindikat Curanmor Bersenjata Api Asal Lampung: 2 Pelaku Ditembak, 35 Motor Disita',
      summary: 'Subdit Jatanras Ditreskrimum membongkar persembunyian komplotan pencuri sepeda motor bersenjata api rakitan revolver yang telah beraksi di lebih dari 50 lokasi perumahan Jabodetabek.',
      fullContent: 'Petugas melakukan penggerebekan di dua gudang penampungan di Tangerang Selatan dan Karawang. Pelaku kerap menembak korban atau warga yang memergoki aksinya. Dua orang eksekutor dilumpuhkan dengan tindakan tegas terukur di kaki karena berusaha melawan dengan senpi rakitan kaliber 9mm.',
      timestamp: '13:20 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T13:20:00+07:00`,
      daysAgo: 1,
      category: 'Kriminal',
      threatLevel: 'HIGH',
      sourceUrl: 'https://metro.polri.go.id/jatanras-tangkap-curanmor-senpi-lampung',
      verified: true,
      region: 'Jabodetabek & Tangerang',
      impactScore: 'TINGGI',
      tags: ['Curanmor', 'Senpi Rakitan', 'Jatanras', 'Polda Metro', 'Begal']
    },
    {
      id: 'news-kemarin-teror-02',
      source: 'Puspen TNI / Kodam XVII',
      title: 'Kontak Tembak Sengit Pasukan Gabungan TNI-Polri dengan KKB di Intan Jaya Papua, 2 Anggota Separatis Dilumpuhkan',
      summary: 'Satgas Damai Cartenz bersama prajurit Yonif memukul mundur kelompok separatis bersenjata yang menyerang pos keamanan bandara perintis Sugapa.',
      fullContent: 'Kelompok KKB pimpinan Undius Kogoya melancarkan rentetan tembakan dari lereng bukit ke arah perimeter Bandara Sugapa. Satgas gabungan membalas tembakan dan berhasil mengamankan 1 pucuk senapan serbu M16 A1, ratusan amunisi 5.56mm, serta alat komunikasi handy-talkie militer.',
      timestamp: '09:15 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T09:15:00+07:00`,
      daysAgo: 1,
      category: 'Terorisme',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://tni.mil.id/berita-kontak-tembak-kkb-intan-jaya',
      verified: true,
      region: 'Papua Tengah (Intan Jaya)',
      impactScore: 'KRITIS',
      tags: ['KKB Papua', 'Damai Cartenz', 'TNI AL/AD', 'Senpi M16', 'Separatisme']
    },
    {
      id: 'news-kemarin-demo-03',
      source: 'CNN Indonesia Bisnis & Transportasi',
      title: 'Ratusan Driver Ojol & Kurir Gelar Aksi Mogok Operasi dan Kepung Kantor Dishub: Tolak Potongan Aplikasi 30%',
      summary: 'Aliansi Pengemudi Ojek Online Nusantara menonaktifkan aplikasi secara serempak dan berorasi di kantor regulator transportasi meminta sanksi tegas kepada aplikator yang melanggar batas potongan 15%.',
      fullContent: 'Aksi konvoi sepeda motor driver ojol memadati kawasan Monas menuju kantor Dinas Perhubungan dan Kementerian Perhubungan. Massa menuntut pembentukan undang-undang status ketenagakerjaan mitra transportasi online yang selama ini tidak memiliki perlindungan jaminan sosial dan upah minimum kerja.',
      timestamp: '11:30 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(1))}T11:30:00+07:00`,
      daysAgo: 1,
      category: 'Demo',
      threatLevel: 'MEDIUM',
      sourceUrl: 'https://cnnindonesia.com/ekonomi/demo-ojol-kepung-dishub-potongan-aplikasi',
      verified: true,
      region: 'DKI Jakarta & Kota Besar',
      impactScore: 'SEDANG',
      tags: ['Demo Ojol', 'Mogok Kerja', 'Dishub', 'Aplikator', 'Kamtibmas']
    },

    // =========================================================================
    // 2 HARI LALU (daysAgo: 2) - Korupsi, Narkoba, & Begal
    // =========================================================================
    {
      id: 'news-2days-korupsi-03',
      source: 'Pengadilan Tipikor Jakarta',
      title: 'Sidang Kasus Dugaan Suap Proyek APBD: Mantan Kepala Dinas PU Divonis 11 Tahun Penjara & Denda Rp 1 Miliar',
      summary: 'Majelis Hakim Tipikor menyatakan terdakwa terbukti secara sah dan meyakinkan menerima fee proyek pengaspalan jalan sebesar Rp 28 Miliar dan memerintahkan perampasan tanah serta vila pribadi.',
      fullContent: 'Vonis majelis hakim sejalan dengan tuntutan jaksa penuntut umum KPK. Selain pidana penjara, hak politik terdakwa dicabut selama 5 tahun terhitung sejak bebas. Uang pengganti kerugian negara sebesar Rp 18,5 Miliar wajib dibayarkan dalam kurun 1 bulan.',
      timestamp: '16:00 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(2))}T16:00:00+07:00`,
      daysAgo: 2,
      category: 'Korupsi',
      threatLevel: 'HIGH',
      sourceUrl: 'https://pn-jakartapusat.go.id/sidang-tipikor-vonis-kadis-pu',
      verified: true,
      region: 'DKI Jakarta / Tipikor',
      impactScore: 'TINGGI',
      tags: ['Vonis Tipikor', 'Korupsi APBD', 'KPK', 'Uang Pengganti', 'Hakim']
    },
    {
      id: 'news-2days-kriminal-03',
      source: 'Polrestabes Medan Humas',
      title: 'Tim Anti-Begal Polrestabes Medan Ringkus 6 Pelaku Begal Sadis yang Lukai Korban Pelajar Pakai Celurit',
      summary: 'Penangkapan komplotan begal jalanan yang videonya viral di media sosial. Polisi menyita 4 bilah senjata tajam celurit panjang 1,5 meter dan 3 unit motor hasil rampasan.',
      fullContent: 'Para pelaku yang rata-rata masih berusia remaja dan terafiliasi geng motor kerap beraksi pada dini hari di kawasan Jl. Ringroad dan Simpang Pos Medan. Tiga pelaku yang mencoba kabur dan melawan petugas diberikan tindakan tegas tembakan di kaki.',
      timestamp: '14:20 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(2))}T14:20:00+07:00`,
      daysAgo: 2,
      category: 'Kriminal',
      threatLevel: 'HIGH',
      sourceUrl: 'https://tribratanews.sumut.polri.go.id/polrestabes-medan-ringkus-begal-sadis',
      verified: true,
      region: 'Sumatera Utara / Medan',
      impactScore: 'TINGGI',
      tags: ['Begal Medan', 'Geng Motor', 'Senjata Tajam', 'Polrestabes', 'Kriminalitas']
    },
    {
      id: 'news-2days-demo-04',
      source: 'Antara News Daerah',
      title: 'Warga Adat & Petani Blokir Akses Truk Tambang Nikel di Morowali Tuntut Ganti Rugi Lahan Perkebunan',
      summary: 'Ratusan warga desa membentangkan tenda dan memblokade pintu gerbang pabrik smelter menyusul belum dibayarkannya kompensasi pencemaran sungai dan tanaman sawit.',
      fullContent: 'Aksi blokade jalur logistik pengangkutan bijih nikel berlangsung selama 2 hari berturut-turut. Aparat Polres Morowali dan Kodim menerjunkan personel pengamanan untuk memediasi pertemuan antara manajemen perusahaan PMA dengan kepala adat.',
      timestamp: '10:45 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(2))}T10:45:00+07:00`,
      daysAgo: 2,
      category: 'Demo',
      threatLevel: 'MEDIUM',
      sourceUrl: 'https://antaranews.com/daerah/warga-blokir-jalan-tambang-morowali',
      verified: true,
      region: 'Sulawesi Tengah / Morowali',
      impactScore: 'SEDANG',
      tags: ['Demo Tambang', 'Morowali', 'Nikel', 'Blokir Jalan', 'Masyarakat Adat']
    },
    {
      id: 'news-2days-kriminal-04',
      source: 'Ditreskrimsus Polda Jatim',
      title: 'Polda Jatim Gerebek Gudang Penimbunan 50 Ton Solar Subsidi di Tuban yang Dijual ke Kapal Industri',
      summary: 'Sindikat mafia solar ilegal menggunakan truk tangki bertuliskan perusahaan ekspedisi palsu untuk menguras kuota solar SPBU di pesisir utara Jawa Timur.',
      fullContent: 'Penyidik menyita 5 armada truk modifikasi bertangki raksasa di dalam bak kayu, 45 kempu penampungan, selang pompa bertekanan tinggi, dan ribuan nota pembelian SPBU palsu. Keuntungan ilegal sindikat mencapai Rp 800 Juta per minggu.',
      timestamp: '19:10 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(2))}T19:10:00+07:00`,
      daysAgo: 2,
      category: 'Kriminal',
      threatLevel: 'HIGH',
      sourceUrl: 'https://jatim.polri.go.id/penimbunan-solar-subsidi-tuban',
      verified: true,
      region: 'Jawa Timur / Tuban',
      impactScore: 'TINGGI',
      tags: ['BBM Subsidi', 'Solar Ilegal', 'Polda Jatim', 'Mafia Migas', 'Tuban']
    },

    // =========================================================================
    // 3 HARI LALU (daysAgo: 3) - Pembunuhan, Densus, & Love Scam
    // =========================================================================
    {
      id: 'news-3days-kriminal-05',
      source: 'Detikcom Kriminal',
      title: 'Kasus Pembunuhan Berencana Pengusaha Tekstil di Sukoharjo: Tim Gabungan Ringkus 3 Eksekutor Bayaran',
      summary: 'Motif pembunuhan dipicu sengketa kepemilikan aset pabrik senilai Rp 15 Miliar. Pelaku utama yang merupakan mantan rekan bisnis korban menjanjikan imbalan Rp 100 Juta kepada eksekutor.',
      fullContent: 'Satreskrim Polres Sukoharjo dan Subdit Jatanras Polda Jateng menangkap 3 pelaku di lokasi persembunyian lereng Gunung Lawu. Barang bukti berupa mobil korban, tali jerat, dan pakaian bernoda darah berhasil diamankan tim forensik Puslabfor.',
      timestamp: '16:30 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(3))}T16:30:00+07:00`,
      daysAgo: 3,
      category: 'Kriminal',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://detik.com/jateng/hukum-kriminal/pembunuhan-berencana-pengusaha-sukoharjo',
      verified: true,
      region: 'Jawa Tengah / Sukoharjo',
      impactScore: 'KRITIS',
      tags: ['Pembunuhan Berencana', 'Sukoharjo', 'Jatanras', 'Puslabfor', 'Kriminal']
    },
    {
      id: 'news-3days-teror-03',
      source: 'BSSN & Densus 88 AT',
      title: 'Pemantauan OSINT: BNPT Temukan 12 Channel Telegram Terenkripsi yang Sebar Panduan Bom Pipa Rakitan',
      summary: 'Tim kontra-radikalisme siber berkoordinasi dengan Komdigi dan Telegram pusat untuk memutus transmisi modul pelatihan perang kota yang menyasar kalangan usia muda.',
      fullContent: 'Analisis lalu lintas siber menemukan lonjakan penyebaran berkas terenkripsi PDF berkategori IED manual di media sosial berbasis bot otomatis. Patroli siber intensif terus ditingkatkan guna mencegah infiltrasi radikalisme daring.',
      timestamp: '11:20 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(3))}T11:20:00+07:00`,
      daysAgo: 3,
      category: 'Terorisme',
      threatLevel: 'HIGH',
      sourceUrl: 'https://bnpt.go.id/kontra-radikalisasi-daring-telegram',
      verified: true,
      region: 'Nasional / Virtual',
      impactScore: 'TINGGI',
      tags: ['BNPT', 'OSINT', 'Telegram', 'Bom Pipa', 'Deradikalisasi']
    },
    {
      id: 'news-3days-cyber-02',
      source: 'Bareskrim Dittipidsiber',
      title: 'Bareskrim Bongkar Jaringan Love Scam & Investasi Bodong Beromzet Rp 120 Miliar di Apartemen Mewah Jaksel',
      summary: 'Sebanyak 21 WNA asal Tiongkok dan Malaysia bersama 8 WNI ditangkap karena mengoperasikan call center phishing terorganisir yang menipu korban nasabah bank nasional.',
      fullContent: 'Sindikat menggunakan foto profil palsu di aplikasi kencan untuk memperdaya korban agar mentransfer uang ke platform trading kripto fiktif. Dari hasil penggeledahan, petugas menyita 120 laptop, ribuan SIM Card internasional, dan token cold wallet Bitcoin.',
      timestamp: '18:15 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(3))}T18:15:00+07:00`,
      daysAgo: 3,
      category: 'Cyber',
      threatLevel: 'HIGH',
      sourceUrl: 'https://polri.go.id/bareskrim-bongkar-sindikat-love-scam-jaksel',
      verified: true,
      region: 'DKI Jakarta Selatan',
      impactScore: 'TINGGI',
      tags: ['Love Scam', 'Penipuan Kripto', 'Siber Bareskrim', 'Pig Butchering', 'Imigrasi']
    },

    // =========================================================================
    // 4 HARI LALU (daysAgo: 4) - Mafia Tanah & Penyelundupan Senjata
    // =========================================================================
    {
      id: 'news-4days-kriminal-06',
      source: 'Satgas Anti-Mafia Tanah Bareskrim',
      title: 'Satgas Anti-Mafia Tanah Tetapkan 7 Tersangka Pemalsu Sertifikat Hak Milik Lahan Strategis BSD Rp 240 Miliar',
      summary: 'Komplotan melibatkan mantan pegawai kantor pertanahan (BPN) yang memalsukan warkah dan girik tanah milik warga seluas 18 hektare.',
      fullContent: 'Bareskrim bersama Kementerian ATR/BPN membongkar praktik kolusi penerbitan sertifikat ganda. Tiga orang notaris nakal turut diperiksa terkait pembuatan akta jual beli palsu tanpa persetujuan pemilik tanah sah.',
      timestamp: '14:00 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(4))}T14:00:00+07:00`,
      daysAgo: 4,
      category: 'Kriminal',
      threatLevel: 'HIGH',
      sourceUrl: 'https://polri.go.id/mafia-tanah-bsd-tangerang-bareskrim',
      verified: true,
      region: 'Banten / Tangerang Selatan',
      impactScore: 'TINGGI',
      tags: ['Mafia Tanah', 'BPN', 'Sertifikat Palsu', 'Bareskrim', 'ATR/BPN']
    },
    {
      id: 'news-4days-keamanan-01',
      source: 'Bakamla RI & TNI AL',
      title: 'Gugus Tempur Laut Koarmada I Gagalkan Penyelundupan Senjata Ilegal di Selat Malaka Menuju Sumatera',
      summary: 'Intersepsi kapal kayu tanpa dokumen Automatic Identification System (AIS) di ALKI I menyita 28 pucuk senjata api serbu dan amunisi kaliber 5.56mm.',
      fullContent: 'Tim Visit Board Search and Seizure (VBSS) KRI melumpuhkan 4 awak kapal berkebangsaan asing yang mencoba membuang peti senjata ke laut. Kapal motor dan seluruh muatan dikawal ke pangkalan AL Batam guna penyelidikan tindak pidana penyelundupan transnasional.',
      timestamp: '08:45 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(4))}T08:45:00+07:00`,
      daysAgo: 4,
      category: 'Keamanan',
      threatLevel: 'CRITICAL',
      sourceUrl: 'https://tni.mil.id/tni-al-gagalkan-penyelundupan-senpi-selat-malaka',
      verified: true,
      region: 'Kepulauan Riau / Selat Malaka',
      impactScore: 'KRITIS',
      tags: ['Penyelundupan Senjata', 'TNI AL', 'Selat Malaka', 'Bakamla', 'Maritim']
    },

    // =========================================================================
    // 5 HARI LALU (daysAgo: 5) - Bencana & Keamanan Energi
    // =========================================================================
    {
      id: 'news-5days-bencana-01',
      source: 'BMKG / BNPB Pusdalops',
      title: 'Status Siaga III Erupsi Gunung Marapi: Muntahan Abu Vulkanik 1.500 Meter, Jalur Pendakian Ditutup Total',
      summary: 'Pusat Vulkanologi PVMBG menetapkan zona bahaya radius 4.5 km dari kawah aktif menyusul peningkatan tremor dan lontaran material pijar.',
      fullContent: 'Hujan abu vulkanik pekat melanda 3 kecamatan di Kabupaten Agam dan Tanah Datar. BPBD dan tim SAR gabungan membagikan 15.000 masker serta mengevakuasi kelompok rentan lansia ke balai desa darurat.',
      timestamp: '06:30 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(5))}T06:30:00+07:00`,
      daysAgo: 5,
      category: 'Bencana',
      threatLevel: 'HIGH',
      sourceUrl: 'https://bnpb.go.id/erupsi-marapi-status-siaga',
      verified: true,
      region: 'Sumatera Barat / Agam',
      impactScore: 'TINGGI',
      tags: ['Gunung Marapi', 'Erupsi', 'Abu Vulkanik', 'BNPB', 'BMKG']
    },
    {
      id: 'news-5days-korupsi-04',
      source: 'KPK RI Siaran Pers',
      title: 'KPK Tahan 4 Pejabat Pemkab Terkait Kasus Pemerasan Pengurusan Izin Tambang Galian C',
      summary: 'Tersangka diduga memeras para pengusaha tambang pasir dengan ancaman penutupan operasional jika tidak menyerahkan setoran wajib Rp 50 Juta per bulan.',
      fullContent: 'Penyidik menahan para tersangka di Rutan Cabang KPK Gedung Merah Putih untuk 20 hari pertama. Penyitaan dokumen aliran uang di rekening perantara telah mengindikasikan adanya aliran dana ke oknum pimpinan daerah.',
      timestamp: '17:00 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(5))}T17:00:00+07:00`,
      daysAgo: 5,
      category: 'Korupsi',
      threatLevel: 'HIGH',
      sourceUrl: 'https://kpk.go.id/berita-penahanan-pemerasan-tambang-galian-c',
      verified: true,
      region: 'Jawa Barat / Bogor',
      impactScore: 'TINGGI',
      tags: ['KPK', 'Pemerasan', 'Tambang Pasir', 'Penahanan', 'Pungli']
    },

    // =========================================================================
    // 6 HARI LALU (daysAgo: 6) - Korupsi Bansos & Narkoba
    // =========================================================================
    {
      id: 'news-6days-korupsi-05',
      source: 'Kejaksaan Tinggi DKI Jakarta',
      title: 'Kejati DKI Tahan Mantan Direktur BUMD Terkait Kasus Korupsi Pengadaan Beras Bansos Fiktif Rp 65 Miliar',
      summary: 'Penyidikan menemukan indikasi beras yang seharusnya disalurkan kepada warga miskin dimanipulasi dengan beras berkualitas buruk dan sebagian fiktif.',
      fullContent: 'Hasil audit Badan Pengawasan Keuangan dan Pembangunan (BPKP) menunjukkan kerugian total negara sebesar Rp 65,4 Miliar. Tersangka langsung ditahan di Rutan Salemba cabang Kejaksaan Agung.',
      timestamp: '15:40 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(6))}T15:40:00+07:00`,
      daysAgo: 6,
      category: 'Korupsi',
      threatLevel: 'HIGH',
      sourceUrl: 'https://kejati-dki.kejaksaan.go.id/penahanan-korupsi-beras-bansos',
      verified: true,
      region: 'DKI Jakarta',
      impactScore: 'TINGGI',
      tags: ['Kejati DKI', 'Korupsi Bansos', 'BUMD', 'BPKP', 'Penahanan']
    },
    {
      id: 'news-6days-kriminal-07',
      source: 'Polda Sumsel Ditresnarkoba',
      title: 'Polda Sumsel Musnahkan 80 Kg Sabu & 50.000 Butir Ekstasi Hasil Operasi Lintas Perbatasan',
      summary: 'Pemusnahan barang bukti narkotika asal Malaysia menggunakan mobil insinerator suhu tinggi disaksikan perwakilan Kejaksaan dan BNN.',
      fullContent: 'Barang bukti bernilai ratusan miliar rupiah tersebut disita dari 12 tersangka kurir sindikat internasional yang beroperasi di wilayah perairan Selat Bangka dan daratan Palembang.',
      timestamp: '10:00 WIB',
      publishedAt: `${formatISODate(getDateDaysAgo(6))}T10:00:00+07:00`,
      daysAgo: 6,
      category: 'Kriminal',
      threatLevel: 'HIGH',
      sourceUrl: 'https://sumsel.polri.go.id/pemusnahan-80kg-sabu-ekstasi-palembang',
      verified: true,
      region: 'Sumatera Selatan / Palembang',
      impactScore: 'TINGGI',
      tags: ['Narkoba', 'Polda Sumsel', 'Pemusnahan', 'Ekstasi', 'Sabu']
    }
  ];
};

// =========================================================================
// POOL DISPATCH BERITA STREAMING DINAMIS (Auto-Ingest Tiap 45 Detik / Refresh Manual)
// Mencakup: Demo, Korupsi, Kriminalitas, Terorisme, Kejahatan Siber, Politik
// =========================================================================
export const STREAMING_NEWS_POOL: Omit<NewsItem, 'id' | 'timestamp' | 'publishedAt' | 'daysAgo'>[] = [
  {
    source: 'CNN Indonesia Nasional',
    title: 'BREAKING: Massa Aksi Buruh Jebol Barikade Kawat Berduri di Pintu Belakang Gedung DPR, Brimob Tambah Pengamanan',
    summary: 'Eskalasi unjuk rasa buruh meningkat sore ini di Jl. Gelora Senayan. Ratusan demonstran mendesak pimpinan dewan menandatangani pakta integritas penolakan formula upah minimum.',
    fullContent: 'Petugas kepolisian mengimbau massa tetap kondusif melalui pengeras suara mobil Raisa (Pengurai Massa). Penambahan 3 kompi pasukan antihuru-hara Brimob dikerahkan untuk menutup celah barikade kawat berduri yang rusak.',
    category: 'Demo',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://cnnindonesia.com/nasional/demo-buruh-jebol-kawat-berduri-dpr',
    verified: true,
    region: 'DKI Jakarta / Senayan',
    impactScore: 'KRITIS',
    tags: ['Demo Buruh', 'DPR RI', 'Brimob', 'Raisa', 'Kericuhan']
  },
  {
    source: 'KPK RI Info Perkara',
    title: 'BREAKING: KPK Sita Uang Tunai Rp 22 Miliar & 3 Mobil Alphard dari Rumah Dinas Pejabat Daerah Tersangka Korupsi',
    summary: 'Penggeledahan maraton selama 8 jam oleh penyidik KPK menemukan brankas tersembunyi di balik dinding kamar tidur utama yang berisi tumpukan gepokan uang pecahan Rp 100 ribu.',
    fullContent: 'Barang bukti uang tunai dan dokumen perbankan telah diangkut ke markas Brimob daerah setempat untuk pencatatan berita acara penyitaan. Pejabat bersangkutan telah dicekal bepergian ke luar negeri oleh Ditjen Imigrasi.',
    category: 'Korupsi',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://kpk.go.id/penggeledahan-rumah-dinas-sita-22miliar',
    verified: true,
    region: 'Kalimantan Timur / Samarinda',
    impactScore: 'KRITIS',
    tags: ['KPK', 'Penggeledahan', 'Brankas Rahasia', 'Korupsi', 'Cekal']
  },
  {
    source: 'Detikcom Kriminal',
    title: 'BREAKING: Perampokan Bersenpi Toko Emas di Pasar Ciputat, Pelaku Lepaskan Tembakan & Bawa Kabur 2 Kg Emas',
    summary: 'Empat pria mengenakan helm tertutup dan jaket ojol beraksi di siang bolong. Seorang satpam pasar terluka terkena serempetan peluru pada bagian paha dan dilarikan ke RSUD.',
    fullContent: 'Pelaku menodongkan senjata api pistol jenis FN dan memecahkan etalase kaca menggunakan palu godam. Tim Resmob Polres Tangsel telah menggelar olah TKP dan menyita rekaman CCTV serta selongsong peluru kaliber 9mm.',
    category: 'Kriminal',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://detik.com/news/perampokan-toko-emas-ciputat-senpi',
    verified: true,
    region: 'Banten / Tangerang Selatan',
    impactScore: 'KRITIS',
    tags: ['Perampokan', 'Toko Emas', 'Senpi', 'Resmob', 'Ciputat']
  },
  {
    source: 'Humas Bareskrim Polri',
    title: 'Densus 88 AT Tangkap 2 Tersangka Pemasok Senjata Api & Amunisi ke Jaringan Teroris di Solo Raya',
    summary: 'Operasi penindakan senyap Densus 88 menyita sepucuk senapan serbu laras panjang, 2 pistol genggam, dan 450 butir amunisi tajam siap distribusi.',
    fullContent: 'Pelaku diduga memperoleh pasokan senjata dari jalur penyelundupan senjata perbatasan laut Filipina Selatan menuju Sulawesi dan Pulau Jawa. Keduanya kini ditahan di Rutan Cikeas untuk interogasi intensif.',
    category: 'Terorisme',
    threatLevel: 'CRITICAL',
    sourceUrl: 'https://polri.go.id/densus88-tangkap-pemasok-senjata-teror-solo',
    verified: true,
    region: 'Jawa Tengah / Solo Raya',
    impactScore: 'KRITIS',
    tags: ['Densus 88', 'Pemasok Senjata', 'Solo', 'Terorisme', 'Senpi Ilegal']
  },
  {
    source: 'Detikcom Inet & Siber',
    title: 'Bareskrim Bekukan 1.400 Rekening Bank Terkait Sindikat Bandar Judi Online Slot Asal Kamboja',
    summary: 'Total perputaran uang di rekening penampung menembus Rp 4,5 Triliun dalam setahun. PPATK dan OJK membantu pemblokiran instan demi menghentikan penarikan tunai.',
    fullContent: 'Bandar menggunakan modus meminjam identitas warga desa miskin dengan imbalan Rp 500 ribu untuk membuka buku rekening dan mobile banking yang kemudian dikirim ke Kamboja.',
    category: 'Cyber',
    threatLevel: 'HIGH',
    sourceUrl: 'https://detik.com/inet/cybercrime/rekening-judi-online-kamboja-dibekukan',
    verified: true,
    region: 'Nasional / Kamboja Network',
    impactScore: 'TINGGI',
    tags: ['Judi Online', 'Slot Kamboja', 'PPATK', 'Blokir Rekening', 'Bareskrim']
  },
  {
    source: 'Kompas.id Polhukam',
    title: 'Bawaslu Gagalkan Pembagian 1.500 Amplop "Serangan Fajar" di Rumah Timses Paslon Pilkada',
    summary: 'Penggerebekan oleh Pengawas Kelurahan/Desa (PKD) bersama kepolisian menemukan amplop berlogo paslon berisi uang tunai masing-masing Rp 150 ribu siap edar jelang hari pencoblosan.',
    fullContent: 'Dua orang koordinator lapangan diamankan bersama daftar nama calon pemilih beserta nomor NIK KTP. Kasus resmi diregistrasi di Sentra Gakkumdu untuk proses pidana pemilu kilat 14 hari.',
    category: 'Politik',
    threatLevel: 'HIGH',
    sourceUrl: 'https://kompas.id/polhukam/bawaslu-tangkap-serangan-fajar-pilkada',
    verified: true,
    region: 'Jawa Barat / Tasikmalaya',
    impactScore: 'TINGGI',
    tags: ['Serangan Fajar', 'Politik Uang', 'Pilkada', 'Bawaslu', 'Gakkumdu']
  },
  {
    source: 'Antara News Nasional',
    title: 'Unjuk Rasa Ribuan Petani Tuntut Penuntasan Sengketa Agraria di Depan Kantor Kementerian ATR/BPN Jakarta',
    summary: 'Massa mendesak pencabutan HGU perkebunan korporasi yang menggusur tanah garapan desa adat seluas 3.000 hektare di Riau dan Sumatera Utara.',
    fullContent: 'Massa menggelar tenda keprihatinan di trotoar Jl. Sisingamangaraja. Wakil Menteri ATR/BPN menemui delegasi petani dan menjanjikan pembentukan satgas audit sertifikat tanah dalam waktu 30 hari.',
    category: 'Demo',
    threatLevel: 'MEDIUM',
    sourceUrl: 'https://antaranews.com/nasional/demo-petani-sengketa-agraria-atrbpn',
    verified: true,
    region: 'DKI Jakarta Selatan',
    impactScore: 'SEDANG',
    tags: ['Demo Petani', 'Sengketa Lahan', 'ATR/BPN', 'HGU Sawit', 'Agraria']
  },
  {
    source: 'Kejaksaan Agung RI',
    title: 'Kejagung Periksa 5 Mantan Pejabat Bea Cukai Terkait Dugaan Korupsi Impor Tekstil Ilegal Rp 1,8 Triliun',
    summary: 'Penyelidikan mendalam membongkar modus pengurangan bea masuk secara manipulatif melalui pemalsuan kode HS kargo pelabuhan Tanjung Priok.',
    fullContent: 'Penyidik Pidsus Kejaksaan Agung mendalami dugaan aliran dana gratifikasi ke sejumlah rekening keluarga pejabat kepabeanan. Surat permohonan pencegahan ke luar negeri telah diterbitkan.',
    category: 'Korupsi',
    threatLevel: 'HIGH',
    sourceUrl: 'https://kejaksaan.go.id/penyidikan-korupsi-impor-tekstil-bea-cukai',
    verified: true,
    region: 'DKI Jakarta / Tanjung Priok',
    impactScore: 'TINGGI',
    tags: ['Kejagung', 'Bea Cukai', 'Impor Tekstil', 'Korupsi', 'Tanjung Priok']
  },
  {
    source: 'Polda Metro Jaya Humas',
    title: 'Polres Metro Jakbar Gerebek Markas Penampungan 12 Wanita Korban TPPO yang Dijanjikan Kerja di Dubai',
    summary: 'Dua orang pelaku calo penyalur tenaga kerja ilegal diamankan di rumah kontrakan kawasan Palmerah beserta paspor dan visa turis fiktif.',
    fullContent: 'Korban diiming-imingi gaji Rp 15 juta per bulan namun paspor ditahan dan diminta menandatangani surat utang rekayasa sebesar Rp 30 juta. Korban telah dipindahkan ke rumah aman Kementerian Sosial.',
    category: 'Kriminal',
    threatLevel: 'HIGH',
    sourceUrl: 'https://metro.polri.go.id/tppo-wanita-dubai-digagalkan-jakbar',
    verified: true,
    region: 'DKI Jakarta Barat',
    impactScore: 'TINGGI',
    tags: ['TPPO', 'Perdagangan Orang', 'Polres Jakbar', 'Imigrasi', 'Pekerja Migran']
  },
  {
    source: 'BSSN Threat Advisory',
    title: 'Peringatan Darurat BSSN: Malware Pencuri Data Trojan Perbankan Beredar Menggunakan File PDF Edaran Pemilu Palsu',
    summary: 'Pelaku kejahatan siber menyebarkan tautan berbahaya bertajuk "Daftar_DPT_Pilkada_2026.pdf.exe" yang secara otomatis menguras kredensial browser dan aplikasi m-banking korban.',
    fullContent: 'Pusat Operasi Keamanan Siber Nasional BSSN mendeteksi ribuan korban di kawasan pulau Jawa. Analis SOC kementerian diimbau memblokir IP server Command & Control (C2) asal Eropa Timur yang mengendalikan payload tersebut.',
    category: 'Cyber',
    threatLevel: 'HIGH',
    sourceUrl: 'https://bssn.go.id/advisory-malware-pdf-pilkada',
    verified: true,
    region: 'Nasional / Seluruh Sektor',
    impactScore: 'TINGGI',
    tags: ['Malware', 'Trojan Perbankan', 'BSSN', 'Pilkada', 'C2 Server']
  },
  {
    source: 'Detikcom News',
    title: 'Aksi Demo Ribuan Honorer di Depan Kantor Kemenpan-RB Tuntut Pengangkatan ASN Tanpa Tes Ulang',
    summary: 'Massa guru dan tenaga kesehatan dari berbagai kabupaten/kota di Indonesia mendesak pemerintah menuntaskan skema penataan non-ASN sebelum akhir tahun anggaran.',
    fullContent: 'Perwakilan forum honorer bergantian berorasi di atas mobil komando. Aksi berjalan tertib dengan kawalan ketat personel Polwan dan Sabhara Polres Metro Jakarta Selatan.',
    category: 'Demo',
    threatLevel: 'LOW',
    sourceUrl: 'https://detik.com/news/demo-guru-honorer-kemenpan-rb',
    verified: true,
    region: 'DKI Jakarta Selatan',
    impactScore: 'RENDAH',
    tags: ['Demo Honorer', 'Kemenpan-RB', 'PPPK', 'Guru Honorer', 'Aksi Damai']
  },
  {
    source: 'Polda Metro Jaya Ditreskrimsus',
    title: 'Polda Metro Jaya Tangkap Sindikat Pembuat Faktur Pajak Fiktif yang Rugikan Kas Negara Rp 75 Miliar',
    summary: 'Tiga tersangka mendirikan 12 perusahaan cangkang fiktif untuk menerbitkan faktur pajak PPN bodong kepada ratusan perusahaan manufaktur.',
    fullContent: 'Penyelidikan bersama Direktorat Jenderal Pajak menyita uang tunai Rp 18 Miliar, 4 unit ruko, serta komputer pencetak faktur fiktif. Pelaku dijerat pasal tindak pidana perpajakan dan TPPU.',
    category: 'Korupsi',
    threatLevel: 'HIGH',
    sourceUrl: 'https://metro.polri.go.id/faktur-pajak-fiktif-ditreskrimsus',
    verified: true,
    region: 'DKI Jakarta & Tangerang',
    impactScore: 'TINGGI',
    tags: ['Faktur Pajak', 'Pajak Bodong', 'Ditjen Pajak', 'Polda Metro', 'Korupsi']
  }
];
