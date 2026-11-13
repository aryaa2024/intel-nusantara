import { 
  SituationalReport, 
  SituationalThreatLevel, 
  SituationalStatus, 
  OperationalScope,
  SafetyAdvisory,
  SafetyAdvisoryLocationPoint,
  SafetyAdvisoryEmergencyContact,
  SafetyAdvisoryCluster
} from '../types';

// =========================================================================
// KAMUS GEOKODING PRESISI DKI JAKARTA & SEKITARNYA
// =========================================================================
export const JAKARTA_GEO_LOOKUP: Record<string, {
  cleanName: string;
  region: string;
  coordinates: { latitude: number; longitude: number };
  defaultElements?: string;
  defaultCrowd?: string;
  crowdCount?: number;
  threatLevel: SituationalThreatLevel;
  details?: string;
}> = {
  'dpr/mpr': {
    cleanName: 'Gedung DPR/MPR RI Senayan',
    region: 'Jakarta Pusat / Selatan, DKI Jakarta',
    coordinates: { latitude: -6.2098, longitude: 106.7997 },
    defaultElements: '11 elemen',
    defaultCrowd: '± 1.575 orang',
    crowdCount: 1575,
    threatLevel: 'CRITICAL',
    details: 'Konsentrasi massa utama di Jl. Gatot Subroto depan gerbang utama DPR/MPR RI'
  },
  'istana negara': {
    cleanName: 'Istana Negara & Medan Merdeka',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1702, longitude: 106.8243 },
    defaultElements: '4 elemen',
    defaultCrowd: '± 250 orang',
    crowdCount: 250,
    threatLevel: 'HIGH',
    details: 'Ring 1 VVIP pengamanan diperketat di Jl. Medan Merdeka Utara & Barat'
  },
  'silang selatan monas': {
    cleanName: 'Silang Selatan Monas & Patung Kuda',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1785, longitude: 106.8235 },
    defaultElements: '19 elemen',
    defaultCrowd: '± 660 orang',
    crowdCount: 660,
    threatLevel: 'HIGH',
    details: 'Titik kumpul sentral unjuk rasa & orasi di Silang Barat Daya / Patung Arjuna Wijaya'
  },
  'monas': {
    cleanName: 'Kawasan Silang Monas & Patung Kuda',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1785, longitude: 106.8235 },
    defaultElements: '19 elemen',
    defaultCrowd: '± 660 orang',
    crowdCount: 660,
    threatLevel: 'HIGH',
    details: 'Episentrum konsentrasi massa kawasan Monumen Nasional'
  },
  'tugu tani': {
    cleanName: 'Kawasan Tugu Tani / Aryaduta',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1823, longitude: 106.8340 },
    defaultElements: '1 elemen',
    defaultCrowd: '± 300 orang',
    crowdCount: 300,
    threatLevel: 'HIGH',
    details: 'Persimpangan Kwitang–Menteng–Senen potensi kemacetan & penyekatan arus'
  },
  'bundaran hi': {
    cleanName: 'Bundaran Hotel Indonesia (HI)',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1950, longitude: 106.8230 },
    defaultElements: '1 elemen',
    defaultCrowd: '± 50 orang',
    crowdCount: 50,
    threatLevel: 'MEDIUM',
    details: 'Aksi damai & orasi teatrikal di sekeliling air mancur Bundaran HI'
  },
  'thamrin': {
    cleanName: 'Koridor Jl. MH Thamrin – Jend. Sudirman',
    region: 'Jakarta Pusat / Selatan, DKI Jakarta',
    coordinates: { latitude: -6.2050, longitude: 106.8210 },
    defaultElements: '3 elemen',
    defaultCrowd: '± 180 orang',
    crowdCount: 180,
    threatLevel: 'MEDIUM',
    details: 'Jalur utama perkantoran & perbankan; potensi pengalihan arus lalu lintas TransJakarta'
  },
  'kebon sirih': {
    cleanName: 'Kawasan Kebon Sirih & DPRD DKI',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1845, longitude: 106.8310 },
    defaultElements: '3 elemen',
    defaultCrowd: '± 120 orang',
    crowdCount: 120,
    threatLevel: 'MEDIUM',
    details: 'Akses perlintasan perkantoran BUMN & Pemprov DKI Jakarta'
  },
  'balai kota': {
    cleanName: 'Balaikota DKI Jakarta (Jl. Merdeka Selatan)',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1818, longitude: 106.8288 },
    defaultElements: '4 elemen',
    defaultCrowd: '± 220 orang',
    crowdCount: 220,
    threatLevel: 'HIGH',
    details: 'Fokus tuntutan buruh ketenagakerjaan dan kebijakan upah UMP'
  },
  'kemenhut': {
    cleanName: 'Kementerian Kehutanan / Manggala Wanabakti',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.2115, longitude: 106.7995 },
    defaultElements: '2 elemen',
    defaultCrowd: '± 150 orang',
    crowdCount: 150,
    threatLevel: 'MEDIUM',
    details: 'Isu lingkungan & tata kelola kehutanan/karhutla'
  },
  'bpk ri': {
    cleanName: 'Badan Pemeriksa Keuangan (BPK RI)',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.2120, longitude: 106.8040 },
    defaultElements: '2 elemen',
    defaultCrowd: '± 100 orang',
    crowdCount: 100,
    threatLevel: 'MEDIUM',
    details: 'Jl. Gatot Subroto dekat persimpangan Senayan'
  },
  'dinkes dki': {
    cleanName: 'Dinkes DKI Jakarta (Petojo)',
    region: 'Jakarta Pusat, DKI Jakarta',
    coordinates: { latitude: -6.1680, longitude: 106.8150 },
    defaultElements: '1 elemen',
    defaultCrowd: '± 80 orang',
    crowdCount: 80,
    threatLevel: 'LOW',
    details: 'Tuntutan aspirasi nakes & PPPK'
  },
  'patung sudirman': {
    cleanName: 'Patung Jenderal Sudirman / Dukuh Atas',
    region: 'Jakarta Selatan, DKI Jakarta',
    coordinates: { latitude: -6.2080, longitude: 106.8220 },
    defaultElements: '1 elemen',
    defaultCrowd: '± 60 orang',
    crowdCount: 60,
    threatLevel: 'LOW',
    details: 'Pintu masuk simpul transportasi Dukuh Atas'
  }
};

// =========================================================================
// TEXT BROADCAST DEFAULT (SURAT EDARAN RESMI 10 NOVEMBER 2026)
// =========================================================================
export const DEFAULT_JAKPRO_BROADCAST_TEXT = `🚨 INFORMASI & HIMBAUAN KESELAMATAN

ANTISIPASI POTENSI AKSI UNJUK RASA DAN KEPADATAN MASSA DI WILAYAH DKI JAKARTA

Yth. Seluruh Jakpronian,

Sehubungan dengan rencana aksi unjuk rasa di sejumlah titik wilayah DKI Jakarta pada:

📅 Selasa, 10 November 2026

Kami mengimbau seluruh Jakpronian untuk meningkatkan kewaspadaan dan mengantisipasi potensi kepadatan massa, pengalihan arus lalu lintas, maupun penutupan jalan, khususnya di sekitar area berikut:

📍 DPR/MPR RI dan sekitarnya  
📍 Istana Negara / Medan Merdeka  
📍 Silang Selatan Monas  
📍 Tugu Tani  
📍 Bundaran HI  
📍 Koridor Thamrin–Sudirman  
📍 Kebon Sirih dan beberapa titik lainnya.

⚠️ HAL-HAL YANG PERLU DIPERHATIKAN:

1. Hindari mendatangi titik konsentrasi massa dan lokasi berlangsungnya aksi unjuk rasa.
2. Hindari kerumunan, jalan yang ditutup atau dibarikade, serta area yang mulai tidak kondusif.
3. Sebelum berangkat dan pulang kantor, pastikan untuk memeriksa kondisi lalu lintas serta menyiapkan rute alternatif.
4. Pertimbangkan penggunaan transportasi umum apabila memungkinkan.
5. Pastikan baterai telepon genggam dalam kondisi cukup dan tetap dapat dihubungi.
6. Pantau informasi dan perkembangan situasi melalui kanal resmi pemerintah maupun informasi internal perusahaan.

🏢 APABILA AKSI TERJADI SAAT BERADA DI KANTOR:

- Tetap tenang dan ikuti arahan Tim Tanggap Darurat, Security, HSE, dan Manajemen.
- Jauhi area gedung yang langsung menghadap titik kerumunan.
- Jangan keluar gedung apabila kondisi di luar belum dinyatakan aman.
- Ketahui jalur evakuasi dan titik kumpul.
- Ikuti instruksi perusahaan sesuai perkembangan situasi.

🚗 SAAT PERGI & PULANG KANTOR:

- Cek kondisi lalu lintas sebelum berangkat.
- Siapkan rute alternatif jika akses biasa terhambat.
- Hindari titik aksi dan kerumunan massa.
- Gunakan transportasi umum apabila memungkinkan.
- Pastikan baterai HP terisi penuh.
- Jika situasi tidak aman, jangan memaksakan perjalanan.
- Informasikan kondisi/perkiraan waktu tiba kepada keluarga dan atasan.

📞 NOMOR DARURAT:
- 112 – Layanan Darurat Jakarta (Call Center Pemprov DKI)
- 110 – Kepolisian (Polri Call Center)
- 118 / 119 – Ambulans & Kedaruratan Medis

Mari bersama-sama meningkatkan kewaspadaan, mengutamakan keselamatan diri, dan menjaga keamanan serta kelancaran aktivitas kerja.

Utamakan keselamatan, hindari risiko yang tidak perlu, dan tetap pantau informasi resmi.`;

// =========================================================================
// DEFAULT PARSED ADVISORY OBJECT
// =========================================================================
export const DEFAULT_JAKPRO_ADVISORY: SafetyAdvisory = {
  id: 'adv_jakpro_10nov2026',
  advisoryCode: 'ADV-2026-JKT-10NOV',
  title: 'ANTISIPASI POTENSI AKSI UNJUK RASA DAN KEPADATAN MASSA DI WILAYAH DKI JAKARTA',
  subtitle: 'INFORMASI & HIMBAUAN KESELAMATAN',
  targetAudience: 'Seluruh Jakpronian & Personel Lapangan',
  dateFormatted: 'Selasa, 10 November 2026',
  eventDateISO: '2026-11-10',
  summary: 'Sehubungan dengan rencana aksi unjuk rasa di sejumlah titik wilayah DKI Jakarta, seluruh Jakpronian diimbau untuk meningkatkan kewaspadaan, mengutamakan keselamatan, serta mengantisipasi potensi kepadatan dan pengalihan arus lalu lintas.',
  locations: [
    {
      name: 'DPR/MPR RI dan sekitarnya',
      cleanName: 'Gedung DPR/MPR RI Senayan',
      region: 'Jakarta Pusat, DKI Jakarta',
      elementCount: '11 elemen',
      crowdEstimate: '± 1.575 orang',
      crowdCount: 1575,
      threatLevel: 'CRITICAL',
      coordinates: { latitude: -6.2098, longitude: 106.7997 },
      details: 'Jl. Gatot Subroto, Senayan (Titik Utama Konsentrasi Massa)'
    },
    {
      name: 'Silang Selatan Monas',
      cleanName: 'Silang Selatan Monas & Patung Kuda',
      region: 'Jakarta Pusat, DKI Jakarta',
      elementCount: '19 elemen',
      crowdEstimate: '± 660 orang',
      crowdCount: 660,
      threatLevel: 'HIGH',
      coordinates: { latitude: -6.1785, longitude: 106.8235 },
      details: 'Silang Barat Daya & Bundaran Patung Kuda Arjuna Wijaya'
    },
    {
      name: 'Istana Negara / Medan Merdeka',
      cleanName: 'Istana Negara & Medan Merdeka',
      region: 'Jakarta Pusat, DKI Jakarta',
      elementCount: '4 elemen',
      crowdEstimate: '± 250 orang',
      crowdCount: 250,
      threatLevel: 'HIGH',
      coordinates: { latitude: -6.1702, longitude: 106.8243 },
      details: 'Pengamanan Ring 1 VVIP Medan Merdeka Utara'
    },
    {
      name: 'Tugu Tani',
      cleanName: 'Kawasan Tugu Tani / Aryaduta',
      region: 'Jakarta Pusat, DKI Jakarta',
      elementCount: '1 elemen',
      crowdEstimate: '± 300 orang',
      crowdCount: 300,
      threatLevel: 'HIGH',
      coordinates: { latitude: -6.1823, longitude: 106.8340 },
      details: 'Simpul Kwitang & Menteng Raya'
    },
    {
      name: 'Bundaran HI',
      cleanName: 'Bundaran Hotel Indonesia (HI)',
      region: 'Jakarta Pusat, DKI Jakarta',
      elementCount: '1 elemen',
      crowdEstimate: '± 50 orang',
      crowdCount: 50,
      threatLevel: 'MEDIUM',
      coordinates: { latitude: -6.1950, longitude: 106.8230 },
      details: 'Air Mancur Bundaran HI Jl. MH Thamrin'
    },
    {
      name: 'Koridor Thamrin–Sudirman',
      cleanName: 'Koridor Jl. MH Thamrin – Sudirman',
      region: 'Jakarta Pusat / Selatan, DKI Jakarta',
      elementCount: '3 elemen',
      crowdEstimate: '± 180 orang',
      crowdCount: 180,
      threatLevel: 'MEDIUM',
      coordinates: { latitude: -6.2050, longitude: 106.8210 },
      details: 'Jalur arteri utama perkantoran & perbankan nasional'
    },
    {
      name: 'Kebon Sirih dan beberapa titik lainnya',
      cleanName: 'Kawasan Kebon Sirih & DPRD DKI',
      region: 'Jakarta Pusat, DKI Jakarta',
      elementCount: '3 elemen',
      crowdEstimate: '± 120 orang',
      crowdCount: 120,
      threatLevel: 'MEDIUM',
      coordinates: { latitude: -6.1845, longitude: 106.8310 },
      details: 'Akses perlintasan gedung pemerintah & komersial'
    }
  ],
  actionOverview: {
    totalElements: '36 elemen',
    totalCrowd: '± 2.720 orang',
    locationClusters: [
      { label: 'Depan GD. DPR/MPR RI', elements: '11 elemen', crowd: '± 1.575 orang' },
      { label: 'Silang Selatan Monas', elements: '19 elemen', crowd: '± 660 orang' },
      { label: 'Bundaran HI', elements: '1 elemen', crowd: '± 50 orang' },
      { label: 'Tugu Tani', elements: '1 elemen', crowd: '± 300 orang' },
      { label: 'Lokasi lainnya (9 titik)', elements: '10 elemen', crowd: '± 390 orang' }
    ],
    issueClusters: [
      { label: 'Bencana (Karhutla/Ekologi)', elements: '8 elemen', crowd: '± 540 orang' },
      { label: '2 Tahun Pemerintahan Prabowo-Gibran', elements: '10 elemen', crowd: '± 420 orang' },
      { label: 'Makzulkan Gibran', elements: '5 elemen', crowd: '± 400 orang' },
      { label: 'Lainnya (PPPK, Penyadapan BIN, Kasus Hukum)', elements: '13 elemen', crowd: '± 1.360 orang' }
    ]
  },
  generalPoints: [
    'Hindari mendatangi titik konsentrasi massa dan lokasi berlangsungnya aksi unjuk rasa.',
    'Hindari kerumunan, jalan yang ditutup atau dibarikade, serta area yang mulai tidak kondusif.',
    'Sebelum berangkat dan pulang kantor, pastikan untuk memeriksa kondisi lalu lintas serta menyiapkan rute alternatif.',
    'Pertimbangkan penggunaan transportasi umum (MRT/LRT/KRL) apabila memungkinkan.',
    'Pastikan baterai telepon genggam dalam kondisi cukup dan tetap dapat dihubungi.',
    'Pantau informasi dan perkembangan situasi melalui kanal resmi pemerintah maupun informasi internal perusahaan.'
  ],
  officePoints: [
    'Tetap tenang dan ikuti arahan Tim Tanggap Darurat, Security, HSE, dan Manajemen.',
    'Jauhi area gedung yang langsung menghadap titik kerumunan massa atau jalan raya.',
    'Jangan keluar gedung apabila kondisi di luar belum dinyatakan aman oleh aparat/petugas keamanan.',
    'Ketahui jalur evakuasi dan lokasi titik kumpul darurat (Assembly Point).',
    'Ikuti instruksi perusahaan sesuai perkembangan situasi lapangan.'
  ],
  commutePoints: [
    'Cek kondisi lalu lintas dan pantau CCTV jalan raya sebelum berangkat.',
    'Siapkan rute alternatif untuk menghindari koridor Gatot Subroto, Sudirman-Thamrin, dan Monas.',
    'Hindari mendekati atau menonton aksi unjuk rasa demi keselamatan pribadi.',
    'Gunakan transportasi umum berbasis rel (MRT/LRT/Commuter Line) bila jalan raya dibarikade.',
    'Pastikan baterai HP terisi penuh dan powerbank siap digunakan.',
    'Jika situasi memburuk di perjalanan, cari tempat aman terlindung dan jangan memaksakan melintas.',
    'Informasikan posisi dan perkiraan waktu tiba kepada keluarga dan rekan kerja.'
  ],
  avoidPoints: [
    'Titik konsentrasi massa aksi unjuk rasa',
    'Jalan yang ditutup, dibarikade kawat berduri, atau dialihkan kepolisian',
    'Kerumunan massa dalam jumlah besar',
    'Area yang mulai menunjukkan tanda-tanda gesekan atau tidak kondusif',
    'Mendekati, mengambil video mencolok, atau menonton aksi unjuk rasa secara langsung'
  ],
  emergencyContacts: [
    { number: '112', label: 'Layanan Darurat Jakarta', description: 'Call Center Terpadu Pemprov DKI Jakarta (Bebas Pulsa)' },
    { number: '110', label: 'Kepolisian RI (Polri)', description: 'Layanan Darurat & Pengamanan Kepolisian 24 Jam' },
    { number: '118 / 119', label: 'Ambulans / Kedaruratan Medis', description: 'Gawat Darurat Medis & Pertolongan Pertama' }
  ],
  closingNotes: 'Mari bersama-sama meningkatkan kewaspadaan, mengutamakan keselamatan diri, dan menjaga keamanan serta kelancaran aktivitas kerja. Utamakan keselamatan, hindari risiko yang tidak perlu, dan tetap pantau informasi resmi.',
  rawText: DEFAULT_JAKPRO_BROADCAST_TEXT,
  parsedAt: new Date().toISOString(),
  isActive: true,
  sourceOperator: 'Bang Madi // Intel Nusantara Command & Jakpro Advisory'
};

// =========================================================================
// ENGINE PARSER BROADCAST WHATSAPP OTOMATIS (DUAL-OUTPUT)
// =========================================================================
export interface ParseBroadcastResult {
  advisory: SafetyAdvisory;
  extractedReports: SituationalReport[];
}

export function parseSmartBroadcastText(
  rawText: string,
  operatorCallsign: string = 'Operator Komando (Bang Madi)'
): ParseBroadcastResult {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // 1. Ekstraksi Judul
  let title = 'ANTISIPASI POTENSI AKSI UNJUK RASA DAN KEPADATAN MASSA';
  for (const line of lines) {
    const clean = line.replace(/[*_~`🚨⚠️]/g, '').trim();
    if (
      clean.toUpperCase().includes('ANTISIPASI') || 
      clean.toUpperCase().includes('UNJUK RASA') || 
      clean.toUpperCase().includes('HIMBAUAN KESELAMATAN') ||
      clean.toUpperCase().includes('SIAGA') ||
      clean.toUpperCase().includes('EDARAN')
    ) {
      title = clean;
      break;
    }
  }

  // 2. Ekstraksi Target Audiens
  let targetAudience = 'Seluruh Personel & Karyawan';
  for (const line of lines) {
    if (line.toLowerCase().includes('yth.') || line.toLowerCase().includes('kepada:')) {
      targetAudience = line.replace(/[*_~`]/g, '').replace(/yth\.?/i, '').replace(/,/g, '').trim();
      break;
    }
  }

  // 3. Ekstraksi Tanggal
  let dateFormatted = 'Selasa, 10 November 2026';
  let eventDateISO = '2026-11-10';
  for (const line of lines) {
    if (line.includes('📅') || line.toLowerCase().includes('pada hari') || line.toLowerCase().includes('pada:')) {
      const dateMatch = line.replace(/[*_~`📅]/g, '').replace(/pada\s*:/i, '').trim();
      if (dateMatch.length >= 6) {
        dateFormatted = dateMatch;
      }
    }
  }

  // 4. Ekstraksi Titik Lokasi (Mendeteksi 📍, bullet, atau kata kunci lokasi)
  const detectedLocationNames: string[] = [];
  lines.forEach(line => {
    if (line.includes('📍')) {
      const locPart = line.replace(/📍/g, '').replace(/[*_~`]/g, '').trim();
      if (locPart.length > 2) {
        detectedLocationNames.push(locPart);
      }
    }
  });

  // Fallback jika tidak memakai emoji 📍: cari dari kamus geocoding
  if (detectedLocationNames.length === 0) {
    Object.keys(JAKARTA_GEO_LOOKUP).forEach(key => {
      if (rawText.toLowerCase().includes(key)) {
        detectedLocationNames.push(JAKARTA_GEO_LOOKUP[key].cleanName);
      }
    });
  }

  // Default jika teks sangat singkat
  if (detectedLocationNames.length === 0) {
    detectedLocationNames.push('DPR/MPR RI dan sekitarnya', 'Silang Selatan Monas', 'Bundaran HI');
  }

  // 5. Buat SafetyAdvisoryLocationPoint & SituationalReport[]
  const parsedLocations: SafetyAdvisoryLocationPoint[] = [];
  const extractedReports: SituationalReport[] = [];
  const dateCode = dateFormatted.replace(/[^a-zA-Z0-9]/g, '').slice(-6) || '10NOV';

  detectedLocationNames.forEach((rawLoc, idx) => {
    const locLower = rawLoc.toLowerCase();
    let matchedKey: string | null = null;

    for (const key of Object.keys(JAKARTA_GEO_LOOKUP)) {
      if (locLower.includes(key) || key.includes(locLower)) {
        matchedKey = key;
        break;
      }
    }

    const geoData = matchedKey ? JAKARTA_GEO_LOOKUP[matchedKey] : null;
    const cleanName = geoData ? geoData.cleanName : rawLoc;
    const region = geoData ? geoData.region : 'DKI Jakarta';
    const coordinates = geoData ? geoData.coordinates : {
      latitude: -6.1850 + (idx * 0.008 * (idx % 2 === 0 ? 1 : -1)),
      longitude: 106.8280 + (idx * 0.006 * (idx % 2 === 0 ? -1 : 1))
    };
    const crowdCount = geoData?.crowdCount || (idx === 0 ? 1500 : idx === 1 ? 600 : 200);
    const crowdEstimate = geoData?.defaultCrowd || `± ${crowdCount} orang`;
    const elementCount = geoData?.defaultElements || `${Math.max(1, 10 - idx * 2)} elemen`;
    const threatLevel: SituationalThreatLevel = geoData?.threatLevel || (idx === 0 ? 'CRITICAL' : idx <= 2 ? 'HIGH' : 'MEDIUM');

    const locPoint: SafetyAdvisoryLocationPoint = {
      name: rawLoc,
      cleanName,
      region,
      elementCount,
      crowdEstimate,
      crowdCount,
      threatLevel,
      coordinates,
      details: geoData?.details || `Area potensi konsentrasi unras di ${cleanName}`
    };
    parsedLocations.push(locPoint);

    // Buat item SituationalReport untuk Peta & Tabel
    const reportCode = `SITREP-${dateCode}-${String(idx + 101).padStart(3, '0')}`;
    const sitrep: SituationalReport = {
      id: `sitrep_bc_${Date.now()}_${idx}`,
      reportCode,
      timestamp: idx === 0 ? '08:30 WIB' : idx === 1 ? '09:00 WIB' : '10:00 WIB',
      eventDate: eventDateISO,
      targetEntity: cleanName,
      region,
      coordinates,
      partiesInvolved: idx === 0 ? 'Aliansi Elemen Mahasiswa & Buruh Nasional' : 'Elemen Masyarakat & Ormas Terkoordinasi',
      scaleEstimate: `${crowdEstimate} (${elementCount})`,
      crowdCountEstimate: crowdCount,
      issueSummary: `Rencana konsentrasi aksi unjuk rasa & potensi penyekatan lalu lintas sesuai himbauan keselamatan.`,
      fullContent: `Laporan resmi himbauan keselamatan: Potensi kepadatan massa di ${cleanName}. Unsur pengamanan menyarankan menghindari area ini dan menggunakan rute alternatif.`,
      threatLevel,
      status: 'Rencana/Rengiat',
      scope: 'UNRAS_MASSA',
      loggedBy: operatorCallsign,
      sourceEngine: 'Smart Broadcast & Safety Advisory Parser v1.0',
      createdAt: new Date().toISOString()
    };
    extractedReports.push(sitrep);
  });

  // 6. Ekstraksi Poin Aturan & Arahan
  const generalPoints: string[] = [];
  const officePoints: string[] = [];
  const commutePoints: string[] = [];
  let currentSection: 'NONE' | 'GENERAL' | 'OFFICE' | 'COMMUTE' = 'NONE';

  lines.forEach(line => {
    const lUpper = line.toUpperCase();
    if (lUpper.includes('HAL-HAL YANG PERLU') || lUpper.includes('PERHATIKAN') || lUpper.includes('HIMBAUAN:')) {
      currentSection = 'GENERAL';
      return;
    }
    if (lUpper.includes('BERADA DI KANTOR') || lUpper.includes('SAAT DI KANTOR')) {
      currentSection = 'OFFICE';
      return;
    }
    if (lUpper.includes('PERGI & PULANG') || lUpper.includes('PULANG KANTOR') || lUpper.includes('PERJALANAN')) {
      currentSection = 'COMMUTE';
      return;
    }
    if (lUpper.includes('NOMOR DARURAT') || lUpper.includes('TERIMA KASIH')) {
      currentSection = 'NONE';
      return;
    }

    // Ambil baris jika berupa poin (1., 2., -, •)
    const isBullet = /^(\d+\.|\-|\•|\*)/.test(line);
    const cleanedText = line.replace(/^(\d+\.|\-|\•|\*)\s*/, '').replace(/[*_~`]/g, '').trim();

    if (isBullet && cleanedText.length > 5) {
      if (currentSection === 'GENERAL') generalPoints.push(cleanedText);
      else if (currentSection === 'OFFICE') officePoints.push(cleanedText);
      else if (currentSection === 'COMMUTE') commutePoints.push(cleanedText);
      else if (generalPoints.length < 6) generalPoints.push(cleanedText);
    }
  });

  // Default fallback points jika teks tidak memiliki sub-bagian lengkap
  const finalGeneralPoints = generalPoints.length > 0 ? generalPoints : DEFAULT_JAKPRO_ADVISORY.generalPoints;
  const finalOfficePoints = officePoints.length > 0 ? officePoints : DEFAULT_JAKPRO_ADVISORY.officePoints;
  const finalCommutePoints = commutePoints.length > 0 ? commutePoints : DEFAULT_JAKPRO_ADVISORY.commutePoints;

  // 7. Ekstraksi Nomor Darurat
  const emergencyContacts: SafetyAdvisoryEmergencyContact[] = [
    { number: '112', label: 'Layanan Darurat Jakarta', description: 'Call Center Terpadu Pemprov DKI (Bebas Pulsa)' },
    { number: '110', label: 'Kepolisian RI', description: 'Layanan Darurat & Pengamanan Polisi 24 Jam' },
    { number: '118 / 119', label: 'Ambulans & Medis', description: 'Gawat Darurat Medis & Pertolongan Pertama' }
  ];

  const totalCrowdNum = parsedLocations.reduce((sum, l) => sum + (l.crowdCount || 0), 0) || 2720;
  const totalElementsNum = parsedLocations.length * 5;

  const advisory: SafetyAdvisory = {
    id: `adv_${Date.now()}`,
    advisoryCode: `ADV-${new Date().getFullYear()}-${dateCode}`,
    title,
    subtitle: 'INFORMASI & HIMBAUAN KESELAMATAN',
    targetAudience,
    dateFormatted,
    eventDateISO,
    summary: `Sehubungan dengan rencana aksi unjuk rasa di ${parsedLocations.length} titik wilayah DKI Jakarta, seluruh ${targetAudience} diimbau meningkatkan kewaspadaan dan mengantisipasi penutupan jalan serta pengalihan arus lalu lintas.`,
    locations: parsedLocations,
    actionOverview: {
      totalElements: `${totalElementsNum} elemen`,
      totalCrowd: `± ${totalCrowdNum.toLocaleString('id-ID')} orang`,
      locationClusters: parsedLocations.slice(0, 5).map(l => ({
        label: l.cleanName,
        elements: l.elementCount || '2 elemen',
        crowd: l.crowdEstimate || '± 100 orang'
      })),
      issueClusters: [
        { label: 'Bencana (Karhutla/Ekologi)', elements: '8 elemen', crowd: '± 540 orang' },
        { label: 'Evaluasi Pemerintahan & Regulasi', elements: '10 elemen', crowd: '± 420 orang' },
        { label: 'Ketenagakerjaan & Aspirasi Publik', elements: '13 elemen', crowd: '± 1.360 orang' }
      ]
    },
    generalPoints: finalGeneralPoints,
    officePoints: finalOfficePoints,
    commutePoints: finalCommutePoints,
    avoidPoints: DEFAULT_JAKPRO_ADVISORY.avoidPoints,
    emergencyContacts,
    closingNotes: 'Mari bersama-sama mengutamakan keselamatan, memantau perkembangan situasi terkini, dan mengikuti SOP pengamanan internal.',
    rawText,
    parsedAt: new Date().toISOString(),
    isActive: true,
    sourceOperator: operatorCallsign
  };

  return {
    advisory,
    extractedReports
  };
}

// =========================================================================
// 1-KLIK PRESET BROADCAST UNTUK OPERATOR
// =========================================================================
export const BROADCAST_PRESETS = [
  {
    id: 'preset_jakpro_10nov',
    label: 'Himbauan Resmi Unras DKI (Jakpro 10 Nov 2026)',
    desc: 'Surat edaran resmi multi-titik (DPR/MPR, Monas, Tugu Tani, HI, Thamrin, Kebon Sirih)',
    rawText: DEFAULT_JAKPRO_BROADCAST_TEXT
  },
  {
    id: 'preset_buruh_kawasan',
    label: 'Peringatan Kontingensi Buruh Koridor Industri & Balaikota',
    desc: 'Aksi buruh FSPMI & KSPI rute Ancol - Balai Kota - Bundaran HI',
    rawText: `🚨 INFORMASI PENGAMANAN & HIMBAUAN KONTINGENSI BURUH

Yth. Seluruh Karyawan & Mitra Kerja,

Sehubungan dengan rencana mobilisasi massa buruh pada:
📅 Kamis, 12 November 2026

Dihimbau untuk mewaspadai titik aksi dan perlintasan konvoi:
📍 Balai Kota DKI Jakarta
📍 Silang Selatan Monas
📍 Kawasan Industri Pulogadung
📍 Kawasan Berikat Nusantara (KBN) Cakung
📍 Bundaran HI

⚠️ ARAHAN KESELAMATAN:
1. Hindari rute jalan utama yang dilewati konvoi roda dua buruh.
2. Gunakan jalur alternatif tol dalam kota atau transportasi rel.
3. Seluruh armada logistik diinstruksikan berangkat sebelum pukul 07.00 WIB.

🏢 PROTOKOL GEDUNG:
- Pengamanan perimeter gerbang diperketat.
- Akses tamu dan vendor ditutup sementara selama jam aksi 09.00 - 15.00 WIB.

📞 KONTAK DARURAT:
- 112 – Layanan Darurat Terpadu
- 110 – Hotline Kepolisian`
  },
  {
    id: 'preset_obvitnas_pelabuhan',
    label: 'Alert Siaga Obvitnas Pelabuhan Tanjung Priok & Plumpang',
    desc: 'Pemantauan pengamanan kawasan logistik strategis & terminal BBM',
    rawText: `🚨 EXECUTIVE SECURITY ALERT // OBVITNAS MARITIM & LOGISTIK

Yth. Tim Operasional & Manajemen Lapangan,

Menindaklanjuti potensi unjuk rasa sopir truk dan elemen pelabuhan pada:
📅 Jumat, 13 November 2026

Area pengawasan intensif Ring 1:
📍 Pelabuhan Tanjung Priok (JICT 1 & 2)
📍 Terminal BBM Pertamina Plumpang
📍 Pintu Tol Kebon Bawang & Akses Cilincing
📍 Kantor Walikota Jakarta Utara

⚠️ LANGKAH PENGAMANAN:
1. Pastikan seluruh jalur steril untuk distribusi logistik primer.
2. Koordinasi melekat dengan Polres Pelabuhan Tanjung Priok dan TNI AL.
3. Laporkan segera eskalasi massa ke Posko Komando Utama.

📞 NOMOR SIAGA:
- 112 – Posko Darurat
- 110 – Sentra Pelayanan Kepolisian`
  }
];

// =========================================================================
// HELPER SERIALISASI & DEKODING PAYLOAD TAUTAN BERBAGI LINTAS PERANGKAT
// (Memungkinkan orang lain membuka data terbaru tanpa butuh database server)
// =========================================================================
export function encodeSharePayload(data: any): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    utf8Bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Failed to encode share payload', e);
    return '';
  }
}

export function decodeSharePayload(encoded: string): any {
  try {
    if (!encoded) return null;
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to decode share payload', e);
    return null;
  }
}

