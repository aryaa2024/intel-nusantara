import { 
  SituationalReport, 
  SituationalThreatLevel, 
  SituationalStatus, 
  OperationalScope 
} from '../types';
import { UNRAS_REPORTS } from '../data/situationalIntelligenceData';

// Kamus Entitas Geografis & Objek Sasaran Strategis Nasional
export const KNOWN_GEO_ENTITIES: {
  keywords: string[];
  entity: string;
  region: string;
  coordinates: { latitude: number; longitude: number };
}[] = [
  {
    keywords: ['dpr', 'mpr', 'senayan', 'parlemen', 'gatot subroto'],
    entity: 'Gedung DPR/MPR RI Senayan',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.2098, longitude: 106.7997 }
  },
  {
    keywords: ['patung kuda', 'monas', 'istana merdeka', 'istana negara', 'medan merdeka barat'],
    entity: 'Kawasan Patung Kuda & Istana Merdeka',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1754, longitude: 106.8272 }
  },
  {
    keywords: ['balai kota', 'medan merdeka selatan', 'pemprov dki'],
    entity: 'Balai Kota DKI Jakarta',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1818, longitude: 106.8288 }
  },
  {
    keywords: ['kpk', 'merah putih', 'kuningan', 'rasuna said'],
    entity: 'Gedung Merah Putih KPK RI',
    region: 'Jakarta Selatan, DKI Jakarta',
    coordinates: { latitude: -6.2088, longitude: 106.8317 }
  },
  {
    keywords: ['kejaksaan agung', 'kejagung', 'kebayoran baru', 'jampidsus'],
    entity: 'Gedung Utama Kejaksaan Agung RI',
    region: 'Jakarta Selatan, DKI Jakarta',
    coordinates: { latitude: -6.2415, longitude: 106.7998 }
  },
  {
    keywords: ['mabes polri', 'trunojoyo', 'bareskrim'],
    entity: 'Mabes Polri Trunojoyo',
    region: 'Jakarta Selatan, DKI Jakarta',
    coordinates: { latitude: -6.2392, longitude: 106.8005 }
  },
  {
    keywords: ['komdigi', 'kominfo', 'medan merdeka barat 9'],
    entity: 'Kementerian Komunikasi & Digital (Komdigi)',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1769, longitude: 106.8228 }
  },
  {
    keywords: ['kemnaker', 'kemenaker', 'gatot subroto 51'],
    entity: 'Kementerian Ketenagakerjaan RI',
    region: 'Jakarta Selatan, DKI Jakarta',
    coordinates: { latitude: -6.2372, longitude: 106.8341 }
  },
  {
    keywords: ['kilang balongan', 'pertamina balongan', 'indramayu'],
    entity: 'Obvitnas Kilang Minyak Balongan Pertamina',
    region: 'Indramayu, Jawa Barat',
    coordinates: { latitude: -6.3685, longitude: 108.3845 }
  },
  {
    keywords: ['plumpang', 'depot pertamina plumpang', 'koja'],
    entity: 'Depot & Terminal Bahan Bakar Minyak Plumpang',
    region: 'Jakarta Utara, DKI Jakarta',
    coordinates: { latitude: -6.1365, longitude: 106.9038 }
  },
  {
    keywords: ['pelabuhan merak', 'dermaga merak', 'bakauheni', 'cilegon'],
    entity: 'Pelabuhan Penyeberangan Merak ASDP',
    region: 'Cilegon, Banten',
    coordinates: { latitude: -5.9322, longitude: 105.9984 }
  },
  {
    keywords: ['tanjung priok', 'priok', 'pelabuhan jict'],
    entity: 'Pelabuhan Internasional Tanjung Priok',
    region: 'Jakarta Utara, DKI Jakarta',
    coordinates: { latitude: -6.1072, longitude: 106.8837 }
  },
  {
    keywords: ['soekarno-hatta', 'bandara soetta', 'cengkareng'],
    entity: 'Bandara Internasional Soekarno-Hatta',
    region: 'Tangerang, Banten',
    coordinates: { latitude: -6.1275, longitude: 106.6537 }
  },
  {
    keywords: ['ikn', 'nusantara', 'istana garuda', 'sepaku', 'penajam'],
    entity: 'Kompleks Pemerintahan Pusat IKN Nusantara',
    region: 'Penajam Paser Utara, Kaltim',
    coordinates: { latitude: -0.9734, longitude: 116.7089 }
  },
  {
    keywords: ['morowali', 'smelter nikel', 'bahodopi'],
    entity: 'Kawasan Industri & Tambang Nikel Morowali',
    region: 'Morowali, Sulawesi Tengah',
    coordinates: { latitude: -2.8533, longitude: 122.1583 }
  },
  {
    keywords: ['sugapa', 'intan jaya', 'papua tengah', 'kkb'],
    entity: 'Bandara Sugapa & Posko Taktis Terpadu',
    region: 'Intan Jaya, Papua Tengah',
    coordinates: { latitude: -3.7425, longitude: 137.0315 }
  },
  {
    keywords: ['selat malaka', 'alki i', 'perairan riau', 'batam'],
    entity: 'Koridor Maritim ALKI I Selat Malaka',
    region: 'Kepulauan Riau',
    coordinates: { latitude: 1.1500, longitude: 103.9500 }
  },
  {
    keywords: ['gedung sate', 'dprd jabar', 'bandung'],
    entity: 'Gedung Sate & DPRD Jawa Barat',
    region: 'Bandung, Jawa Barat',
    coordinates: { latitude: -6.9025, longitude: 107.6186 }
  },
  {
    keywords: ['dprd jatim', 'grahadi', 'surabaya'],
    entity: 'Gedung DPRD & Grahadi Jawa Timur',
    region: 'Surabaya, Jawa Timur',
    coordinates: { latitude: -7.2605, longitude: 112.7445 }
  },
  {
    keywords: ['medan', 'ringroad medan', 'lapangan merdeka'],
    entity: 'Kawasan Inti Kota & Simpang Pos Medan',
    region: 'Medan, Sumatera Utara',
    coordinates: { latitude: 3.5952, longitude: 98.6722 }
  },
  {
    keywords: ['gunung marapi', 'bukittinggi', 'kawah marapi', 'agam'],
    entity: 'Kawasan Lereng & Pos Pantau PVMBG Gunung Marapi',
    region: 'Agam & Tanah Datar, Sumatera Barat',
    coordinates: { latitude: -0.3811, longitude: 100.4739 }
  }
];

// Heuristic Parser: Ekstraksi Berita Otomatis dari Teks Mentah / URL
export const extractSituationalDataFromText = (
  rawText: string,
  sourceUrl = '',
  loggedBy = 'Operator Callsign'
): SituationalReport => {
  const textLower = rawText.toLowerCase();

  // 1. Ekstraksi Entitas & Wilayah Koordinat
  let matchedEntity = KNOWN_GEO_ENTITIES[0].entity;
  let matchedRegion = KNOWN_GEO_ENTITIES[0].region;
  let matchedCoords = KNOWN_GEO_ENTITIES[0].coordinates;

  for (const item of KNOWN_GEO_ENTITIES) {
    if (item.keywords.some((k) => textLower.includes(k))) {
      matchedEntity = item.entity;
      matchedRegion = item.region;
      matchedCoords = item.coordinates;
      break;
    }
  }

  // 2. Ekstraksi Waktu & Tanggal
  const timeRegex = /(?:pukul|jam)?\s*(\d{1,2}[:\.]\d{2})\s*(?:wib|wita|wit)?/i;
  const timeMatch = rawText.match(timeRegex);
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const timestampStr = timeMatch 
    ? `${timeMatch[1].replace('.', ':')} WIB` 
    : `${currentHours}:${currentMinutes} WIB`;

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const eventDate = `${yyyy}-${mm}-${dd}`;

  // 3. Ekstraksi Pihak Terlibat / Organisasi
  let partiesInvolved = 'Massa Aliansi Masyarakat / Elemen Terkait';
  if (textLower.includes('buruh') || textLower.includes('kspi') || textLower.includes('serikat')) {
    partiesInvolved = 'Konfederasi Serikat Buruh Indonesia (KSPI / KSBSI)';
  } else if (textLower.includes('bem') || textLower.includes('mahasiswa')) {
    partiesInvolved = 'Aliansi Mahasiswa & BEM Seluruh Indonesia (BEM SI)';
  } else if (textLower.includes('ojol') || textLower.includes('ojek online')) {
    partiesInvolved = 'Aliansi Pengemudi Ojek Online & Kurir Logistik';
  } else if (textLower.includes('petani') || textLower.includes('adat')) {
    partiesInvolved = 'Aliansi Masyarakat Adat & Solidaritas Petani Daerah';
  } else if (textLower.includes('kkb') || textLower.includes('separatis')) {
    partiesInvolved = 'Kelompok Kriminal Bersenjata (KKB Separatis Papua)';
  } else if (textLower.includes('densus') || textLower.includes('teror')) {
    partiesInvolved = 'Sel Terduga Jaringan Terorisme & Radikal Daring';
  } else if (textLower.includes('kpk') || textLower.includes('ott')) {
    partiesInvolved = 'Oknum Pejabat Pengadaan Proyek & Rekanan Swasta';
  } else if (textLower.includes('sabu') || textLower.includes('narkoba')) {
    partiesInvolved = 'Sindikat Penyelundupan Narkoba Jaringan Internasional';
  } else if (textLower.includes('begal') || textLower.includes('curanmor')) {
    partiesInvolved = 'Komplotan Residivis Begal Jalanan Bersenjata Api';
  }

  // 4. Ekstraksi Skala / Massa / Dampak
  let scaleEstimate = 'Skala Menengah / Aktivitas Dalam Pengawasan';
  let crowdCountEstimate = 450;

  const crowdNumberRegex = /(\d+[\.\,]?\d*)\s*(?:ribu|massa|orang|jiwa|demonstran|personel|buruh|mahasiswa)/i;
  const crowdMatch = rawText.match(crowdNumberRegex);
  if (crowdMatch) {
    let numStr = crowdMatch[1].replace(',', '.');
    let count = parseFloat(numStr);
    if (crowdMatch[0].toLowerCase().includes('ribu')) {
      count = count * 1000;
    } else if (count < 100 && numStr.includes('.')) {
      count = count * 1000;
    }
    crowdCountEstimate = Math.round(count);
    scaleEstimate = `± ${crowdCountEstimate.toLocaleString('id-ID')} Orang / Skala ${crowdCountEstimate >= 1500 ? 'Besar' : 'Sedang'}`;
  } else if (textLower.includes('ribuan')) {
    crowdCountEstimate = 2500;
    scaleEstimate = '± 2.500 Orang / Skala Besar';
  } else if (textLower.includes('ratusan')) {
    crowdCountEstimate = 600;
    scaleEstimate = '± 600 Orang / Skala Menengah';
  } else if (textLower.includes('puluhan')) {
    crowdCountEstimate = 80;
    scaleEstimate = '± 80 Orang / Terfokus';
  }

  // 5. Penentuan Tingkat Ancaman (Threat Level)
  let threatLevel: SituationalThreatLevel = 'MEDIUM';
  const criticalWords = ['ricuh', 'jebol', 'bakar', 'senpi', 'bom', 'tatp', 'ledakan', 'kkb', 'tembak', 'ott kpk', 'tewas', 'sabotase', 'darurat'];
  const highWords = ['blokir', 'bentrok', 'kawat berduri', 'gas air mata', 'curanmor', 'begal', 'sabu', 'korupsi', 'ancaman', 'pemogokan', 'phk'];
  const lowWords = ['damai', 'lancar', 'tertib', 'kondusif', 'audiensi lancar'];

  if (criticalWords.some((w) => textLower.includes(w))) {
    threatLevel = 'CRITICAL';
  } else if (highWords.some((w) => textLower.includes(w))) {
    threatLevel = 'HIGH';
  } else if (lowWords.some((w) => textLower.includes(w))) {
    threatLevel = 'LOW';
  }

  // 6. Penentuan Status Operasional
  let status: SituationalStatus = 'Live';
  if (textLower.includes('akan menggelar') || textLower.includes('rencana') || textLower.includes('rengiat') || textLower.includes('besok')) {
    status = 'Rencana/Rengiat';
  } else if (textLower.includes('telah membubarkan') || textLower.includes('selesai') || textLower.includes('kondusif') || textLower.includes('diamankan')) {
    status = 'Selesai';
  }

  // 7. Penentuan Kategori Operasional (Scope)
  let scope: OperationalScope = 'SECURITY_INCIDENT';
  if (textLower.includes('demo') || textLower.includes('unjuk rasa') || textLower.includes('orasi') || textLower.includes('ump')) {
    scope = 'UNRAS_MASSA';
  } else if (textLower.includes('kilang') || textLower.includes('obvitnas') || textLower.includes('pelabuhan') || textLower.includes('bandara')) {
    scope = 'OBVITNAS_THREAT';
  } else if (textLower.includes('kkb') || textLower.includes('teror') || textLower.includes('densus') || textLower.includes('senjata')) {
    scope = 'SECURITY_INCIDENT';
  } else if (textLower.includes('korupsi') || textLower.includes('ott') || textLower.includes('sabu') || textLower.includes('begal') || textLower.includes('curanmor')) {
    scope = 'CRIME_INVESTIGATION';
  } else if (textLower.includes('gunung') || textLower.includes('gempa') || textLower.includes('banjir') || textLower.includes('longsor')) {
    scope = 'DISASTER_HAZARD';
  }

  // 8. Ringkasan Pokok Isu
  let issueSummary = rawText.trim().slice(0, 180);
  if (rawText.length > 180) {
    issueSummary += '...';
  }

  // Bersihkan judul ringkasan jika format panjang
  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length > 0 && lines[0].length < 120) {
    issueSummary = lines[0].trim();
  }

  const uniqueId = `sitrep-${Date.now().toString().slice(-6)}`;
  const shareToken = `token_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString().slice(-4)}`;

  return {
    id: uniqueId,
    reportCode: `SITREP-2026-${Date.now().toString().slice(-4)}`,
    timestamp: timestampStr,
    eventDate,
    targetEntity: matchedEntity,
    region: matchedRegion,
    coordinates: matchedCoords,
    partiesInvolved,
    scaleEstimate,
    crowdCountEstimate,
    issueSummary,
    fullContent: rawText.trim(),
    threatLevel,
    status,
    scope,
    sourceUrl: sourceUrl || 'https://intel-nusantara.mil.id/osint-feed',
    loggedBy,
    sourceEngine: 'AI News Extractor & OSINT Sentinel v2.4',
    createdAt: new Date().toISOString(),
    shareToken
  };
};

// Preset Berita Simulasi untuk Uji Coba Cepat Operator (1-Click Simulation)
export const SIMULATION_PRESETS: {
  title: string;
  scope: OperationalScope;
  source: string;
  rawText: string;
  url: string;
}[] = [
  {
    title: 'Aksi Unras Ribuan Buruh di Gedung DPR RI Senayan',
    scope: 'UNRAS_MASSA',
    source: 'CNN Indonesia',
    url: 'https://cnnindonesia.com/nasional/demo-buruh-gedung-dpr-senayan',
    rawText: `Aksi unjuk rasa ribuan buruh dari aliansi KSPI memadati ruas jalan depan Gedung DPR RI Senayan Jakarta Pusat sejak pukul 10.15 WIB. Demonstran menuntut kenaikan upah minimum UMP 2027 minimal 10% dan penolakan gelombang PHK massal. Sebanyak 2.800 personel gabungan TNI-Polri disiagakan dengan kawat berduri dan unit Water Cannon. Suasana sempat memanas akibat pelemparan botol namun situasi terkendali.`
  },
  {
    title: 'Peringatan Ancaman Sabotase Obvitnas Kilang Minyak Balongan',
    scope: 'OBVITNAS_THREAT',
    source: 'Satgas Obvitnas TNI/Polri',
    url: 'https://pertamina.com/keamanan-kilang-balongan',
    rawText: `Sensor perimeter inframerah dan patroli gabungan mendeteksi anomali drone ilegal terbang rendah di zona terlarang Ring 1 Kilang Minyak Balongan Indramayu pada pukul 03.40 WIB. Unit anti-drone jammer telah mengaktifkan protokol penguncian frekuensi. Tingkat kewaspadaan ditingkatkan ke status darurat siaga 1 guna mengamankan tangki bahan bakar nasional.`
  },
  {
    title: 'Unras BEM SI di Kawasan Patung Kuda Monas Diwarnai Bakar Ban',
    scope: 'UNRAS_MASSA',
    source: 'Detikcom News',
    url: 'https://detik.com/news/demo-patung-kuda-monas-bakar-ban',
    rawText: `Ratusan mahasiswa BEM Seluruh Indonesia menggelar aksi unjuk rasa di bundaran Patung Kuda Monas Jakarta Pusat pukul 14.30 WIB. Massa membakar sejumlah ban bekas dan mencoba merobohkan barikade kawat berduri menuju Istana Merdeka. Aparat kepolisian mengerahkan kendaraan taktis pengurai massa dan mengimbau orasi berlangsung damai.`
  },
  {
    title: 'Pencegatan Kapal Penyelundupan Senpi Gelap di Selat Malaka',
    scope: 'SECURITY_INCIDENT',
    source: 'Bakamla RI & TNI AL',
    url: 'https://bakamla.go.id/pencegatan-senpi-selat-malaka',
    rawText: `Operasi intersepsi KRI dan kapal patroli Bakamla di ALKI I Selat Malaka berhasil melumpuhkan kapal kayu tanpa AIS pada pukul 08.15 WIB. Petugas menyita 28 pucuk senjata api serbu ilegal dan 450 butir amunisi tajam yang diselundupkan menuju pesisir timur Sumatera. Empat orang tersangka awak kapal diamankan ke pangkalan militer Batam.`
  },
  {
    title: 'Aksi Blokade Jalan Tambang Morowali oleh Ratusan Warga Adat',
    scope: 'UNRAS_MASSA',
    source: 'Antara News Daerah',
    url: 'https://antaranews.com/blokir-jalan-tambang-morowali',
    rawText: `Sebanyak 650 warga masyarakat adat membentangkan tenda dan memblokade jalan pengangkutan truk bijih nikel di kawasan industri tambang Morowali Sulawesi Tengah pukul 09.00 WIB. Warga menuntut pembayaran kompensasi lahan adat dan ganti rugi pencemaran aliran sungai. Mediasi difasilitasi Kapolres dan Bupati setempat.`
  },
  {
    title: 'Penggerebekan Sindikat Narkotika 145 Kg Sabu di Pelabuhan Merak',
    scope: 'CRIME_INVESTIGATION',
    source: 'Humas Bareskrim Polri',
    url: 'https://polri.go.id/bareskrim-sabu-pelabuhan-merak',
    rawText: `Tim Dittipidnarkoba Bareskrim Polri menggagalkan penyelundupan 145 kg sabu asal Golden Triangle yang disembunyikan di dasar kompartemen truk sayur di Pelabuhan Penyeberangan Merak pada pukul 01.30 WIB dini hari. Tiga orang kurir ditangkap dan jaringan penerima asal Jakarta telah dipetakan.`
  },
  {
    title: 'Konvoi Ratusan Buruh SPAI-FSPMI Melintasi Ancol Menuju Balai Kota DKI',
    scope: 'UNRAS_MASSA',
    source: 'Tempo.co Metro',
    url: 'https://metro.tempo.co/read/konvoi-buruh-balaikota-dki-ump',
    rawText: `Konvoi massa buruh FSPMI bergerak dari titik kumpul Ancol Barat menyusuri Jl. RE Martadinata, Jl. Benyamin Sueb, hingga Balai Kota DKI Jakarta sejak pukul 07.30 WIB. Massa menuntut penetapan kenaikan UMP 2027 minimal 8-10% serta penolakan regulasi lama. Sebanyak 150 personel gabungan siaga di sekeliling Medan Merdeka Selatan.`
  },
  {
    title: 'OTT KPK Terkait Kasus Suap Pengadaan Proyek Jalur Kereta Api',
    scope: 'CRIME_INVESTIGATION',
    source: 'KPK RI Info Perkara',
    url: 'https://kpk.go.id/berita-penindakan/ott-suap-jalur-kereta',
    rawText: `Komisi Pemberantasan Korupsi (KPK) melakukan Operasi Tangkap Tangan (OTT) terhadap pejabat pembuat komitmen di Jakarta Selatan dan Semarang pukul 09.40 WIB. Tim penindakan mengamankan uang tunai senilai Rp 14,2 Miliar dalam koper yang diduga sebagai commitment fee pemulusan lelang proyek jalur kereta api.`
  },
  {
    title: 'Kejagung Geledah Kantor Tambang Terkait Mafia Izin IUP Nikel',
    scope: 'CRIME_INVESTIGATION',
    source: 'Kejaksaan Agung RI',
    url: 'https://kejaksaan.go.id/berita/kejagung-geledah-kantor-tambang-nikel',
    rawText: `Penyidik Jampidsus Kejaksaan Agung menggeledah sejumlah kantor konsultan pertambangan dan instansi terkait di Jakarta Selatan sejak pukul 08.00 WIB. Penyidik menyita 3 boks dokumen legalitas IUP dan membekukan rekening korporasi terkait rekayasa kuota ekspor nikel ilegal bernilai triliunan rupiah.`
  },
  {
    title: 'Bareskrim Sita Rp 89 Miliar Kasus Beking Judi Online Oknum Komdigi',
    scope: 'SECURITY_INCIDENT',
    source: 'Detikcom Inet & Siber',
    url: 'https://detik.com/inet/cybercrime/bareskrim-sita-89-miliar-kasus-judol-komdigi',
    rawText: `Direktorat Tindak Pidana Siber Bareskrim Polri menggeledah ruko kantor satelit di Bekasi dan safe house Jakarta Selatan pukul 07.25 WIB. Petugas menyita uang tunai Rp 89 Miliar, 45 smartphone terenkripsi, serta puluhan emas batangan dari sindikat oknum kementerian yang sengaja membuka blokir ribuan situs judi online.`
  }
];

// Data Awal Bawaan Dasbor Situasional (Dataset Lengkap 68 Aksi Rengiat Jakarta & Nasional)
export const INITIAL_SITUATIONAL_REPORTS: SituationalReport[] = UNRAS_REPORTS;
