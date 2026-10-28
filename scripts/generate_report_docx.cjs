const fs = require('fs');
const path = require('path');
const { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType, 
  ShadingType,
  ImageRun,
  Header,
  Footer,
  PageNumber
} = require('docx');

// Image file paths
const IMG_SRM_MATRIX = 'C:/Users/Axioo/.gemini/antigravity/brain/ac64346a-c0c8-46a6-9ceb-2138c321d352/.user_uploaded/media_1793085688492_ec0ad5f5.png';
const IMG_SRM_REGISTER = 'C:/Users/Axioo/.gemini/antigravity/brain/ac64346a-c0c8-46a6-9ceb-2138c321d352/.user_uploaded/media_1793085721081_b08058be.png';
const IMG_ASSESSMENT = 'C:/Users/Axioo/.gemini/antigravity/brain/ac64346a-c0c8-46a6-9ceb-2138c321d352/.user_uploaded/media_1793085748460_2c65a48c.png';
const IMG_TRACKING = 'C:/Users/Axioo/.gemini/antigravity/brain/ac64346a-c0c8-46a6-9ceb-2138c321d352/.user_uploaded/media_1793085786084_76e08646.png';
const IMG_REPORTING = 'C:/Users/Axioo/.gemini/antigravity/brain/ac64346a-c0c8-46a6-9ceb-2138c321d352/.user_uploaded/media_1793085814202_eb5896d1.png';

const OUTPUT_PATH = 'C:/Users/Axioo/Documents/Intel Nusantara/LAPORAN_DAN_PANDUAN_EXTENDED_MODULES_INTEL_NUSANTARA.docx';

// Styling Palette Constants
const COLOR_PRIMARY = '0B132B';
const COLOR_CRIMSON = 'B91C1C';
const COLOR_DARK_GRAY = '1E293B';
const COLOR_LIGHT_BG = 'F8FAFC';
const COLOR_BORDER = 'CBD5E1';
const COLOR_MUTED = '64748B';

// Helper formatting functions
function createTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    run: {
      size: 36,
      bold: true,
      color: COLOR_PRIMARY,
      font: 'Calibri'
    }
  });
}

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    run: {
      size: 28,
      bold: true,
      color: COLOR_CRIMSON,
      font: 'Calibri'
    }
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    run: {
      size: 22,
      bold: true,
      color: COLOR_PRIMARY,
      font: 'Calibri'
    }
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 60 },
    run: {
      size: 18,
      bold: true,
      color: COLOR_DARK_GRAY,
      font: 'Calibri'
    }
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFY,
    spacing: { before: 60, after: 100, line: 276 },
    children: [
      new TextRun({
        text: text,
        size: options.size || 21,
        font: 'Calibri',
        color: options.color || '1F2937',
        bold: options.bold || false,
        italics: options.italics || false
      })
    ]
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({
      text: boldPrefix + ' ',
      bold: true,
      size: 21,
      font: 'Calibri',
      color: COLOR_PRIMARY
    }));
  }
  children.push(new TextRun({
    text: text,
    size: 21,
    font: 'Calibri',
    color: '334155'
  }));

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 60, line: 260 },
    children
  });
}

function createCallout(title, content, borderColor = COLOR_CRIMSON, bgColor = 'FEF2F2') {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: bgColor },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: title, bold: true, size: 21, color: borderColor, font: 'Calibri' })
                ]
              }),
              new Paragraph({
                spacing: { after: 0, line: 260 },
                children: [
                  new TextRun({ text: content, size: 20, color: '334155', font: 'Calibri' })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createImageBlock(imagePath, captionText, width = 570, height = 350) {
  const imageBuffer = fs.readFileSync(imagePath);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 60 },
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: {
            width: width,
            height: height
          }
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 180 },
      children: [
        new TextRun({
          text: captionText,
          size: 18,
          italics: true,
          color: COLOR_MUTED,
          font: 'Calibri'
        })
      ]
    })
  ];
}

async function generateDocx() {
  console.log('Generating professional Word document...');

  const doc = new Document({
    creator: 'Markas Komando Operasi Intelijen Siber & Fisik Nusantara',
    title: 'Laporan Teknis & Panduan Operasional Extended Modules Platform Intel Nusantara',
    description: 'Dokumentasi implementasi modul SRM ISO 31000, Security Assessment ASIS International, Staff Tracking Geofencing, dan Automated Reporting Engine',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'INTEL NUSANTARA // SISTEM KOMANDO & OPERASI KEAMANAN TERPADU',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Calibri',
                    bold: true
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'KLASIFIKASI: TOP SECRET // NOFORN | Halaman ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    bold: true,
                    color: COLOR_CRIMSON,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: ' dari ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    bold: true,
                    color: COLOR_PRIMARY,
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // CLASSIFICATION BADGE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: '■ TOP SECRET // RESTRICTED DISSEMINATION // NOFORN ■',
                size: 20,
                bold: true,
                color: COLOR_CRIMSON,
                font: 'Calibri'
              })
            ]
          }),

          createTitle('LAPORAN IMPLEMENTASI TEKNIS & PANDUAN OPERASIONAL\nEXTENDED MODULES PLATFORM INTEL NUSANTARA'),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
            children: [
              new TextRun({
                text: 'Security Risk Management (ISO 31000) • Physical Security Assessment (ASIS International)\nGPS Telemetry & Geofencing Radar • Automated Reporting Engine (Daily SITREP)',
                size: 20,
                bold: true,
                color: COLOR_MUTED,
                font: 'Calibri'
              })
            ]
          }),

          // METADATA TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
              left: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
              right: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_LIGHT_BG },
                    children: [createParagraph('Kode Dokumen:', { bold: true, size: 19 })]
                  }),
                  new TableCell({
                    children: [createParagraph('IN-EXT-SOP-2026-V3', { size: 19, bold: true, color: COLOR_CRIMSON })]
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_LIGHT_BG },
                    children: [createParagraph('Versi Rilis:', { bold: true, size: 19 })]
                  }),
                  new TableCell({
                    children: [createParagraph('Production 2.4.0 (Enterprise SOC)', { size: 19 })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_LIGHT_BG },
                    children: [createParagraph('Otoritas Pengesah:', { bold: true, size: 19 })]
                  }),
                  new TableCell({
                    children: [createParagraph('Aryaa (Chief Operations / Admin Komando)', { size: 19, bold: true })]
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_LIGHT_BG },
                    children: [createParagraph('Tanggal Efektif:', { bold: true, size: 19 })]
                  }),
                  new TableCell({
                    children: [createParagraph('27 Oktober 2026', { size: 19 })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // BAB 1
          createHeading1('BAB I. RINGKASAN EKSEKUTIF & ARSITEKTUR EXTENDED MODULES'),
          createParagraph('Peningkatan platform Intel Nusantara dari arsitektur inti (Dashboard News, Daily Logbook, Target Profiling, dan AI Threat Analysis) menuju integrasi empat extended modules strategis bertujuan memenuhi standarisasi keamanan internasional dan kebutuhan operasional komando modern. Integrasi ini memberikan kapabilitas pengawasan ancaman komprehensif yang mencakup manajemen risiko berbasis ISO 31000, audit fisik berstandar ASIS International, pelacakan telemetri posisi personel dan aset melalui GPS Geofencing, serta otomasi penyusunan intelijen operasional (Daily SITREP, Weekly Brief, dan Monthly Review).'),
          
          createParagraph('Pilar-pilar arsitektur yang dibangun dirancang dengan kriteria integritas data absolut (zero-bug tolerance), arsitektur fail-safe terenkripsi, penyimpanan terisolasi per akun operator (operator-isolated local persistence), serta kesiapan data murni untuk konsumsi API hulu/hilir.'),

          createCallout(
            'PRINSIP ARSITEKTUR: KEAMANAN & KEANDALAN DATA',
            'Seluruh extended modules beroperasi pada standar Network-First Service Worker, pencegahan null-pointer melalui sanitasi defensif, pemulihan runtime mandiri melalui Error Boundary, serta kepatuhan output format JSON murni ISO 8601 UTC tanpa pembungkus narasi markdown.',
            COLOR_CRIMSON,
            'FEF2F2'
          ),

          // BAB 2
          createHeading1('BAB II. MODUL SECURITY RISK MANAGEMENT (SRM) - STANDAR ISO 31000:2018'),
          createParagraph('Modul Security Risk Management (SRM) menyediakan instrumen terstruktur bagi perwira intelijen dan komandan pengamanan dalam mengidentifikasi, mengkuantifikasi, serta merumuskan mitigasi skenario ancaman fisik maupun siber yang menyasar aset strategis atau Objek Vital Nasional (Obvitnas).'),

          createHeading2('2.1 Metodologi & Formulasi Matematis Matriks Risiko'),
          createParagraph('Kalkulasi tingkat keparahan risiko (Risk Score) dievaluasi menggunakan formulasi perkalian dua parameter fundamental skala 1 hingga 5 sesuai konsensus ISO 31000:'),
          createParagraph('Risk Score = Likelihood (Probabilitas Kejadian) × Impact (Tingkat Keparahan Dampak)', { bold: true, color: COLOR_CRIMSON, alignment: AlignmentType.CENTER }),

          createParagraph('Nilai komputasi skor (1 s/d 25) dipetakan secara ketat ke dalam empat kategori intervensi:'),
          createBullet('Skor 1 - 4: Kategori LOW (Hijau). Tindakan: Accept / Monitor. Risiko dinilai dapat diterima dalam batas toleransi wajar dan cukup dipantau secara berkala tanpa pengerahan sumber daya darurat.', '1. Kategori Rendah:'),
          createBullet('Skor 5 - 9: Kategori MEDIUM (Kuning). Tindakan: Standard Control. Diperlukan penegakan SOP standar, pemeriksaan berkala komponen, serta peningkatan kewaspadaan petugas piket.', '2. Kategori Menengah:'),
          createBullet('Skor 10 - 16: Kategori HIGH (Oranye). Tindakan: Urgent Mitigation. Menuntut rencana mitigasi cepat, penugasan personel pengawas khusus, serta revisi parameter proteksi fisik.', '3. Kategori Tinggi:'),
          createBullet('Skor 17 - 25: Kategori CRITICAL (Merah). Tindakan: Immediate Intervention. Kondisi darurat yang mewajibkan intervensi komando langsung, isolasi area/aset, dan pengerahan satgas penindak.', '4. Kategori Kritis:'),

          createHeading2('2.2 Taksonomi Strategi Mitigasi Terstruktur'),
          createParagraph('Setiap risiko yang terdaftar wajib dipasangkan dengan satu dari empat strategi pengendalian resmi:'),
          createBullet('Menghentikan kegiatan atau membatalkan operasi yang memicu timbulnya risiko.', 'Avoid (Menghindari):'),
          createBullet('Memindahkan beban dampak finansial atau teknis kepada pihak ketiga (asuransi, garansi SLA vendor, atau aliansi pengamanan eksternal).', 'Transfer (Mengalihkan):'),
          createBullet('Menerapkan penambahan kontrol teknis, hardening sistem, pemasangan sensor perimeter, atau penambahan regu patroli guna mereduksi probabilitas dan dampak.', 'Mitigate (Mengurangi):'),
          createBullet('Menerima sisa risiko (residual risk) yang telah berada di bawah batas toleransi setelah evaluasi komando.', 'Accept (Menerima):'),

          ...createImageBlock(IMG_SRM_MATRIX, 'Gambar 1. Tampilan Dasbor Matriks Heatmap 5 × 5 Interaktif (Probability vs Impact) Berstandar ISO 31000:2018'),
          ...createImageBlock(IMG_SRM_REGISTER, 'Gambar 2. Tampilan Tabel Risk Register Terpadu, Skor Kuantitatif, Strategi Mitigasi, dan Penanggung Jawab Sektor'),

          createHeading2('2.3 Panduan Operasional Modul SRM bagi Operator & Komandan'),
          createBullet('Buka menu navigasi utama di bilah samping, pilih "Security Risk Management". Perhatikan statistik ringkasan total skenario dan distribusi level di panel atas.', 'Langkah 1: Navigasi Modul:'),
          createBullet('Klik sel mana saja pada tabel visual Heatmap 5 × 5 (misal koordinat Likelihood 4 × Impact 5 = 20). Tabel register risiko di bawah akan otomatis terfilter hanya menampilkan skenario ancaman pada koordinat tersebut.', 'Langkah 2: Filter Interaktif Matriks:'),
          createBullet('Klik tombol "+ INPUT RISIKO BARU" di sudut kanan atas. Masukkan Judul Skenario Risiko, Kategori ISO, dan Aset Kritis yang terancam. Geser slider Likelihood (1-5) dan Impact (1-5); sistem secara real-time mengkalkulasi skor dan memberi lencana warna otomatis. Pilih strategi mitigasi (Mitigate/Avoid/Transfer/Accept) dan cantumkan Action Plan terperinci.', 'Langkah 3: Registrasi Skenario Baru:'),
          createBullet('Pada skenario berlevel CRITICAL atau HIGH, operator dapat mengklik tombol "ESKALASI" di kolom aksi tabel. Data risiko akan dikonversi menjadi laporan insiden terformat dan otomatis diteruskan ke modul Daily Logbook SOC tanpa input ulang.', 'Langkah 4: Eskalasi Lintas Modul:'),
          createBullet('Klik "EXPORT JSON API" untuk menyalin payload JSON murni berstandar enterprise yang siap ditransmisikan ke sistem analitik komando pusat.', 'Langkah 5: Ekspor Payload JSON:'),

          // BAB 3
          createHeading1('BAB III. MODUL SECURITY ASSESSMENT & GAP ANALYSIS - STANDAR ASIS INTERNATIONAL'),
          createParagraph('Modul Security Assessment mengadopsi standar global ASIS International untuk menilai tingkat kesiapan pengamanan fisik pada fasilitas properti, kawasan industri strategis, hotel berstandar internasional, gedung komersial, kompleks hunian vertikal, hingga instalasi Objek Vital Nasional (Obvitnas).'),

          createHeading2('3.1 Lima Pilar Inti Kerangka Kerja Audit ASIS'),
          createParagraph('Penilaian kepatuhan disusun atas lima pilar fondasi proteksi fisik fasilitas:'),
          createBullet('Evaluasi integritas kawat duri ganda (razor concertina), tinggi pagar minimal 2.4 meter, zona bebas halangan pandang (clear zone 3 meter), dan pencahayaan perimeter merata (>10 Lux).', '1. Perimeter Security (Keamanan Garis Luar):'),
          createBullet('Pemeriksaan palang penghalang anti-tabrak (crash-rated bollard), turnstile RFID, inspeksi kolong kendaraan cermin ganda, serta verifikasi biometrik pada area steril.', '2. Access Control (Kendali Akses Masuk):'),
          createBullet('Pengerasan struktur ruang kendali SOC dan server bertulang tahan ledakan, proteksi redundansi daya genset cadangan N+1, serta sistem pemadam otomatis gas clean agent.', '3. Physical Infrastructure (Infrastruktur Fisik):'),
          createBullet('Cakupan pengawasan kamera PTZ 360°, kamera pendeteksi panas (thermal imaging), eliminasi blindspot, serta kapasitas retensi rekaman video NVR terenkripsi minimal 30 hari.', '4. Surveillance / CCTV (Pengawasan Visual):'),
          createBullet('Kesiapan tombol darurat (silent panic alarm) terintegrasi kepolisian, ketersediaan SOP evakuasi darurat, serta pelaksanaan latihan simulasi tanggap terorisme.', '5. Incident Response Readiness (Kesiapan Tanggap Darurat):'),

          ...createImageBlock(IMG_ASSESSMENT, 'Gambar 3. Tampilan Dasbor Security Assessment ASIS International, Dial Gauge Skor Kepatuhan, dan Rekomendasi Mesin GAP Analysis'),

          createHeading2('3.2 Mekanisme Skoring & Mesin Analisis Kesenjangan (GAP Analysis)'),
          createParagraph('Setiap instrumen pada pilar evaluasi memiliki 3 opsi pemenuhan kriteria:'),
          createBullet('Memenuhi seluruh spesifikasi teknis dan SOP standar ASIS (Nilai: 100%).', 'COMPLIANT:'),
          createBullet('Standar terpenuhi sebagian namun terdapat hambatan kapasitas, cakupan parsial, atau komponen dalam pemeliharaan (Nilai: 50%).', 'PARTIAL:'),
          createBullet('Komponen gagal berfungsi, tidak tersedia, atau prosedur kadaluarsa (Nilai: 0%).', 'NON-COMPLIANT:'),

          createParagraph('Skor keseluruhan (Overall Compliance Score) dikalkulasi secara agregat. Apabila skor berada di bawah 65%, status fasilitas ditetapkan sebagai CRITICAL VULNERABILITY. Skor antara 65% - 84% berstatus MITIGATION REQUIRED, sedangkan skor ≥ 85% berstatus SECURITY ADEQUATE.'),
          createParagraph('Mesin GAP Analysis secara otomatis memindai seluruh item berstatus PARTIAL dan NON-COMPLIANT, mengidentifikasi akar permasalahan, dan merumuskan langkah koreksi prioritas untuk diajukan ke pimpinan instalasi.'),

          createHeading2('3.3 Panduan Operasional Security Assessment bagi Auditor & Operator'),
          createBullet('Pilih fasilitas sasaran audit melalui menu tarik-turun (dropdown) properti terinspeksi, atau klik "+ BUAT AUDIT BARU" untuk mendaftarkan fasilitas baru.', 'Langkah 1: Pemilihan Properti:'),
          createBullet('Pilih tab pilar yang hendak diperiksa (Perimeter, Access Control, Infra, CCTV, atau Response). Periksa kondisi fisik lapangan dan sesuaikan opsi tombol status (Compliant, Partial, atau Non-Compliant). Skor kepatuhan dan dial gauge akan langsung beradaptasi secara otomatis.', 'Langkah 2: Pengisian Checklist Lapangan:'),
          createBullet('Tinjau panel merah "TEMUAN GAP ANALYSIS". Cermati rekomendasi teknis ASIS untuk item yang berstatus celah keamanan.', 'Langkah 3: Evaluasi Rekomendasi GAP:'),
          createBullet('Klik "Eskalasi ke Logbook" pada temuan celah kritis untuk memerintahkan satgas lapangan melakukan perbaikan fisik darurat.', 'Langkah 4: Tindak Lanjut Eskalasi:'),

          // BAB 4
          createHeading1('BAB IV. MODUL STAFF TRACKING & GEOFENCING - TELEMETRI GPS & RADAR REAL-TIME'),
          createParagraph('Modul Staff Tracking & Geofencing mengimplementasikan pemantauan posisi telemetri real-time bagi personel satgas intelijen dan regu patroli lapangan dengan dukungan sensor satelit W3C HTML5 Geolocation API serta pemetaan geofence multi-zona.'),

          createHeading2('4.1 Algoritma Geofence Boundary & Formula Haversine'),
          createParagraph('Penentuan posisi personel terhadap perimeter aman zona objek vital dihitung secara presisi menggunakan formula jarak lengkung bumi (Haversine formula):'),
          createParagraph('d = 2R × arcsin( √[ sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2) ] )', { bold: true, color: COLOR_PRIMARY, alignment: AlignmentType.CENTER }),
          createParagraph('Dimana R adalah radius bumi (6.371.000 meter). Jarak d dari posisi GPS personel ke koordinat pusat zona dibandingkan terhadap radius zona geofence:'),
          createBullet('Personel berada di dalam radius zona aman yang ditugaskan. Indikator radar menampilkan titik hijau stabil.', 'Status IN_ZONE (Normal):'),
          createBullet('Personel berada di luar radius zona penugasan. Sistem memicu alarm siaga merah berkedip, mencatat pelanggaran pada audit trail, dan memberi peringatan jarak deviasi.', 'Status GEOFENCE_BREACH (Alert):'),

          ...createImageBlock(IMG_TRACKING, 'Gambar 4. Tampilan Radar Taktis Telemetri GPS 10 Hz, Pemetaan Titik Personel, Inspector Sensor, dan Tabel Log Pelanggaran Geofence'),

          createHeading2('4.2 Panduan Operasional Staff Tracking bagi Operator SOC'),
          createBullet('Klik tombol "AKTIFKAN GPS SAYA" pada bilah atas. Izinkan akses izin lokasi pada peramban. Sistem akan menyelaraskan koordinat satelit GPS fisik perangkat Anda, memplot posisi Anda pada radar, dan mengukur jarak Anda ke zona pengamanan Ring 1 secara akurat.', 'Fitur 1: Pelacakan GPS Perangkat Nyata:'),
          createBullet('Klik tombol "SIMULASI PATROLI" untuk mengamati perilaku radar saat personel mobile (MERPATI-07) bergerak dinamis melintasi batas geofence. Ketika personel menembus radius batas, banner peringatan dan log breach merah akan terpicu secara instan.', 'Fitur 2: Simulasi Dinamis Patroli:'),
          createBullet('Pada panel Telemetry Inspector sebelah kanan, operator dapat memasukkan koordinat latitude (-90 s/d 90) dan longitude (-180 s/d 180) secara manual untuk menguji integritas respon geofence pada koordinat tertentu.', 'Fitur 3: Injeksi Koordinat Manual:'),
          createBullet('Pada tabel "LOG PELANGGARAN GEOFENCE REAL-TIME", amati waktu pelanggaran, nama personel, dan jarak keluar. Klik "Eskalasi ke Logbook" untuk mendokumentasikan insiden disiplin penugasan ke laporan harian SOC.', 'Fitur 4: Audit Trail Pelanggaran:'),

          // BAB 5
          createHeading1('BAB V. MODUL AUTOMATED REPORTING ENGINE (DAILY, WEEKLY, MONTHLY)'),
          createParagraph('Modul Automated Reporting Engine berfungsi sebagai mesin konsolidasi data tingkat tinggi yang secara cerdas merangkum data operasional dari Daily Logbook, Matriks Risiko SRM ISO 31000, Hasil Audit ASIS, dan Log Geofence ke dalam dokumen eksekutif SITREP yang siap dicetak maupun diekspor.'),

          createHeading2('5.1 Klasifikasi Periode Pelaporan Intelijen'),
          createBullet('Fokus pada kronologi kejadian 24 jam terakhir, pergantian piket jaga, status telemetri personel aktif, dan penanganan insiden primer.', '1. Laporan Harian (Daily SITREP):'),
          createBullet('Fokus pada agregasi tren kejadian 7 hari, dinamika pergeseran matriks risiko ISO 31000, dan evaluasi kepatuhan fasilitas properti.', '2. Laporan Mingguan (Weekly Security Brief):'),
          createBullet('Fokus pada analisis vektor ancaman makro nasional, KPI kesiapan operasional pertahanan, dan rekomendasi strategis pimpinan komando.', '3. Laporan Bulanan (Monthly Strategic Review):'),

          ...createImageBlock(IMG_REPORTING, 'Gambar 5. Tampilan Generator Laporan Eksekutif SITREP Terpadu, Empat Indikator Metrik Terintegrasi, dan Ringkasan Tindakan Pimpinan'),

          createHeading2('5.2 Panduan Operasional Pembuatan Laporan Otomatis'),
          createBullet('Pilih periode yang diinginkan pada tombol tab: Harian (Daily), Mingguan (Weekly), atau Bulanan (Monthly).', 'Langkah 1: Pilih Interval:'),
          createBullet('Klik tombol merah "GENERATE LAPORAN [INTERVAL]". Sistem dalam hitungan detik akan mengagregasi ribuan poin data dan menyusun naskah laporan eksekutif lengkap dengan klasifikasi TOP SECRET // NOFORN.', 'Langkah 2: Kompilasi Dokumen Otomatis:'),
          createBullet('Tinjau 4 kartu metrik utama (Total Insiden, Skor Maksimal Risiko, Kepatuhan ASIS, dan Telemetri Staf) serta butir ringkasan tindakan pimpinan komando.', 'Langkah 3: Verifikasi Indikator Metrik:'),
          createBullet('Klik tombol "CETAK / PDF" di sudut kanan atas untuk membuka pratinjau cetak browser resmi dan menyimpan dokumen ke format PDF resolusi tinggi.', 'Langkah 4: Cetak Fisik & Arsip PDF:'),
          createBullet('Klik "FORMAT JSON API MURNI" untuk mendapatkan payload data JSON terenkripsi murni tanpa pembungkus narasi markdown, siap diinjeksikan ke pangkalan data Markas Komando.', 'Langkah 5: Integrasi JSON API:'),

          // BAB 6
          createHeading1('BAB VI. PROTOKOL OTORISASI, KREDENSIAL, & KEAMANAN SISTEM'),
          createParagraph('Demi menjaga integritas operasional dan kerahasiaan platform Intel Nusantara, tata kelola kredensial dan hak akses ditetapkan secara ketat:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
              left: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
              right: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    children: [createParagraph('Parameter Keamanan', { bold: true, color: 'FFFFFF', size: 19 })]
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    children: [createParagraph('Kredensial Resmi / Konfigurasi', { bold: true, color: 'FFFFFF', size: 19 })]
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    children: [createParagraph('Hak Akses & Batasan Otoritas', { bold: true, color: 'FFFFFF', size: 19 })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [createParagraph('Akun Administrator Komando', { bold: true })]
                  }),
                  new TableCell({
                    children: [createParagraph('Username: Aryaa\nPassword: 489147', { bold: true, color: COLOR_CRIMSON })]
                  }),
                  new TableCell({
                    children: [createParagraph('Otoritas penuh (ADMIN), akses eksklusif ke User Management, clearance TOP SECRET.')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [createParagraph('PIN Registrasi Personel Baru', { bold: true })]
                  }),
                  new TableCell({
                    children: [createParagraph('PIN: 9087', { bold: true, color: 'D97706' })]
                  }),
                  new TableCell({
                    children: [createParagraph('Wajib diinput saat personel mendaftarkan akun baru. Registrasi ditolak jika PIN salah.')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [createParagraph('Arsitektur Service Worker', { bold: true })]
                  }),
                  new TableCell({
                    children: [createParagraph('Cache Version: v3 (Network-First)', { bold: true })]
                  }),
                  new TableCell({
                    children: [createParagraph('Pencegahan blank screen, pengambilan index.html selalu langsung dari server saat daring.')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [createParagraph('Sistem Fail-Safe Runtime', { bold: true })]
                  }),
                  new TableCell({
                    children: [createParagraph('SOC Error Boundary Component', { bold: true })]
                  }),
                  new TableCell({
                    children: [createParagraph('Menangkap anomali komponen secara mandiri, menyediakan tombol reset pemulihan sesi seketika.')]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          createHeading2('6.1 Lembar Pengesahan & Validasi Akhir'),
          createParagraph('Dokumen laporan teknis dan manual operasional ini disusun dan disahkan sebagai acuan baku prosedur pengoperasian platform Intel Nusantara di lingkungan pusat kendali SOC maupun penugasan lapangan perwira intelijen.'),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 240, after: 60 },
            children: [
              new TextRun({
                text: 'Markas Komando Pusat Intel Nusantara, 27 Oktober 2026\n',
                size: 20,
                font: 'Calibri'
              }),
              new TextRun({
                text: 'Komandan Pusat Komando & Pengendali Sistem,\n\n\n\n',
                size: 20,
                font: 'Calibri'
              }),
              new TextRun({
                text: 'ARYAA (CALLSIGN: ARYAA-KOMANDO)\n',
                size: 22,
                bold: true,
                color: COLOR_CRIMSON,
                font: 'Calibri'
              }),
              new TextRun({
                text: 'Badge No: ADM-001 • Clearance: TOP SECRET // NOFORN',
                size: 18,
                color: COLOR_MUTED,
                font: 'Calibri'
              })
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Document generated successfully at: ${OUTPUT_PATH}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(2)} KB`);
}

generateDocx().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
