import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Users, 
  PhoneCall, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  Crosshair, 
  Building, 
  Car, 
  ShieldCheck, 
  Info, 
  Trash2,
  ExternalLink,
  Flame,
  Sparkles
} from 'lucide-react';
import { SafetyAdvisory, SafetyAdvisoryLocationPoint } from '../types';

interface ExecutiveSafetyAdvisoryCardProps {
  advisory: SafetyAdvisory;
  isReadOnly?: boolean;
  onFocusLocation?: (coords: { latitude: number; longitude: number }) => void;
  onSharePublicLink?: () => void;
  onDismissAdvisory?: () => void;
}

export const ExecutiveSafetyAdvisoryCard: React.FC<ExecutiveSafetyAdvisoryCardProps> = ({
  advisory,
  isReadOnly = false,
  onFocusLocation,
  onSharePublicLink,
  onDismissAdvisory
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // Fungsi Salin Pesan Format WhatsApp
  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(advisory.rawText);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  // Fungsi Cetak / Simpan PDF
  const handlePrint = () => {
    window.print();
  };

  // Fungsi Download Poster Gambar PNG HD (Direct High-Res HTML5 Canvas Generator)
  const handleDownloadPosterPng = () => {
    setIsGeneratingPng(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingPng(false);
        return;
      }

      // Ukuran Poster HD (1200 x 1750 px)
      canvas.width = 1200;
      canvas.height = 1750;

      // 1. Background & Border Komando
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient Accent Top
      const topGrad = ctx.createLinearGradient(0, 0, 1200, 0);
      topGrad.addColorStop(0, '#b91c1c');
      topGrad.addColorStop(0.5, '#dc2626');
      topGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, canvas.width, 140);

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('🚨 INFORMASI & HIMBAUAN KESELAMATAN // INTEL NUSANTARA', 50, 50);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`UNTUK: ${advisory.targetAudience.toUpperCase()}`, 50, 85);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText(`KODE ADVISORY: ${advisory.advisoryCode} • STATUS: SIAGA 1`, 50, 115);

      // 2. Banner Judul Utama
      ctx.fillStyle = '#111827';
      ctx.fillRect(40, 160, 1120, 130);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 160, 1120, 130);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px sans-serif';
      ctx.fillText(advisory.title, 60, 215, 1080);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`📅 ${advisory.dateFormatted.toUpperCase()}`, 60, 260);

      // 3. Grid 2 Kolom (Titik Aksi & Data Ringkas Rencana Aksi)
      // Kolom Kiri: Peta Area Potensi Aksi
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 310, 540, 480);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 310, 540, 480);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(40, 310, 540, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('📍 TITIK AREA POTENSI AKSI (DKI JAKARTA)', 60, 340);

      let yPos = 385;
      advisory.locations.slice(0, 7).forEach((loc, i) => {
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`${i + 1}. ${loc.cleanName}`, 60, yPos);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`(${loc.elementCount || 'Elemen'} • ${loc.crowdEstimate || '± 100 org'})`, 60, yPos + 22);

        yPos += 58;
      });

      // Kolom Kanan: Data Ringkas Rencana Aksi
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(620, 310, 540, 480);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(620, 310, 540, 480);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(620, 310, 540, 45);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('📊 DATA RINGKAS RENCANA AKSI', 640, 340);

      // Total Card
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(640, 370, 500, 75);
      ctx.strokeStyle = '#6366f1';
      ctx.strokeRect(640, 370, 500, 75);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`Total Massa: ${advisory.actionOverview?.totalCrowd || '± 2.720 orang'}`, 660, 415);

      // Klaster Isu Dominan
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText('KLASTER ISU DOMINAN:', 640, 480);

      let issueY = 515;
      const issues = [
        '1. Bencana (Karhutla/Ekologi) - 8 elemen | ±540 org',
        '2. 2 Tahun Pemerintahan Prabowo-Gibran - 10 elemen | ±420 org',
        '3. Makzulkan Gibran - 5 elemen | ±400 org',
        '4. Isu Lainnya (PPPK, Ketenagakerjaan, Hukum) - 13 elemen'
      ];
      issues.forEach(iss => {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        ctx.fillText(iss, 640, issueY);
        issueY += 38;
      });

      // 4. Baris Arahan Keselamatan (4 Kolom Taktis)
      // Box A: HINDARI
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(40, 810, 540, 320);
      ctx.strokeStyle = '#ef4444';
      ctx.strokeRect(40, 810, 540, 320);
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🚫 HAL-HAL YANG HARUS DIHINDARI:', 60, 845);

      let aY = 880;
      advisory.generalPoints.slice(0, 4).forEach((pt, i) => {
        ctx.fillStyle = '#ffffff';
        ctx.font = '15px sans-serif';
        ctx.fillText(`• ${pt.slice(0, 58)}...`, 60, aY);
        aY += 38;
      });

      // Box B: SAAT DI KANTOR
      ctx.fillStyle = '#022c22';
      ctx.fillRect(620, 810, 540, 320);
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(620, 810, 540, 320);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🏢 JIKA AKSI TERJADI SAAT DI KANTOR:', 640, 845);

      let bY = 880;
      advisory.officePoints.slice(0, 4).forEach((pt, i) => {
        ctx.fillStyle = '#ffffff';
        ctx.font = '15px sans-serif';
        ctx.fillText(`• ${pt.slice(0, 58)}...`, 640, bY);
        bY += 38;
      });

      // 5. Box C: SAAT PERJALANAN (Lebar Penuh)
      ctx.fillStyle = '#172554';
      ctx.fillRect(40, 1150, 1120, 180);
      ctx.strokeStyle = '#3b82f6';
      ctx.strokeRect(40, 1150, 1120, 180);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🚗 PANDUAN SAAT PERGI & PULANG KANTOR:', 60, 1185);

      let cY = 1220;
      advisory.commutePoints.slice(0, 3).forEach((pt, i) => {
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.fillText(`• ${pt.slice(0, 110)}`, 60, cY);
        cY += 36;
      });

      // 6. Baris Nomor Darurat (Call Center)
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(40, 1350, 1120, 160);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(40, 1350, 1120, 160);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('📞 NOMOR DARURAT & HOTLINE KEAMANAN JAKARTA:', 60, 1390);

      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('112', 80, 1450);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Darurat Jakarta', 80, 1480);

      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('110', 450, 1450);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Kepolisian RI', 450, 1480);

      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('118 / 119', 820, 1450);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Ambulans Medis', 820, 1480);

      // 7. Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '14px monospace';
      ctx.fillText(`Generated by Intel Nusantara Command & Situational Intelligence System • ${advisory.parsedAt.slice(0, 10)}`, 50, 1680);
      ctx.fillText('Matajaga Research • Official Executive Safety Advisory', 50, 1710);

      // Export ke File PNG
      const link = document.createElement('a');
      link.download = `Himbauan_Keselamatan_Unras_DKI_${advisory.eventDateISO || '2026-11-10'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Gagal generate poster PNG:', err);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  return (
    <div 
      ref={posterRef}
      className="bg-[#080d19] border-2 border-red-600/80 rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300 font-sans"
    >
      {/* Top Tactical Alert Bar */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 p-3 sm:p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/30 flex items-center justify-center flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/50 text-yellow-300 border border-yellow-400/40">
                OFFICIAL SAFETY ADVISORY // {advisory.advisoryCode}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-red-100 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Untuk: {advisory.targetAudience}
              </span>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wide leading-tight mt-1">
              {advisory.title}
            </h2>
          </div>
        </div>

        {/* Action Controls & Collapse Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-end md:self-center flex-wrap">
          <button
            onClick={handleDownloadPosterPng}
            disabled={isGeneratingPng}
            className="px-2.5 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-yellow-300 border border-yellow-400/40 text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95"
            title="Download poster visual dalam bentuk gambar PNG resolusi tinggi"
          >
            <Download className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">{isGeneratingPng ? 'Membuat...' : 'Download Gambar (PNG)'}</span>
            <span className="sm:hidden">PNG</span>
          </button>

          <button
            onClick={handleCopyWhatsApp}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
            title="Salin seluruh isi edaran resmi untuk disebar ke grup WhatsApp"
          >
            {copiedWA ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{copiedWA ? 'Tersalin!' : 'Salin Pesan WA'}</span>
            <span className="sm:hidden">WA</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-zinc-200 border border-white/20 text-[11px] transition-all"
            title="Cetak atau Simpan sebagai PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {!isReadOnly && onDismissAdvisory && (
            <button
              onClick={onDismissAdvisory}
              className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-[11px] transition-all"
              title="Hapus / Nonaktifkan Banner Himbauan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-2 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white border border-white/30 text-[11px] font-bold flex items-center gap-1"
          >
            {isCollapsed ? (
              <>
                <span>Buka Detail</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Tutup</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Date Pill & Summary Bar */}
      <div className="bg-[#0b1222] px-3.5 sm:px-5 py-2.5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>WAKTU RENCANA AKSI: <strong className="text-white underline">{advisory.dateFormatted}</strong></span>
        </div>
        <div className="text-zinc-400 text-[11px] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Klik titik lokasi di bawah untuk memusatkan peta Leaflet</span>
        </div>
      </div>

      {/* Main Collapsible Content */}
      {!isCollapsed && (
        <div className="p-3.5 sm:p-5 md:p-6 space-y-5">
          {/* Summary Text Box */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#05070c] p-3 sm:p-4 rounded-xl border border-zinc-800/80">
            {advisory.summary}
          </p>

          {/* Grid 2 Kolom (Area Potensi Aksi & Data Ringkas Rencana Aksi) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Sisi Kiri: Peta Area Potensi Aksi & Lokasi Rawan (7 Kolom) */}
            <div className="lg:col-span-7 bg-[#0b1222] border border-red-900/50 rounded-xl p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                    AREA &amp; TITIK POTENSI AKSI DI DKI JAKARTA
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                  {advisory.locations.length} TITIK
                </span>
              </div>

              {/* Daftar Lokasi Interaktif (Bisa Diklik untuk Fokus Peta) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {advisory.locations.map((loc, idx) => (
                  <div
                    key={idx}
                    onClick={() => onFocusLocation && onFocusLocation(loc.coordinates)}
                    className="p-2.5 rounded-lg bg-[#070b14] border border-zinc-800 hover:border-cyan-500/80 hover:bg-cyan-950/30 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {loc.cleanName}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                            {loc.region}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                        loc.threatLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                        loc.threatLevel === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-zinc-800 text-zinc-300'
                      }`}>
                        {loc.threatLevel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 mt-1.5 border-t border-zinc-800/60 font-mono">
                      <span className="text-amber-400 font-bold">
                        {loc.elementCount ? `${loc.elementCount} • ` : ''}{loc.crowdEstimate}
                      </span>
                      <span className="text-cyan-400 group-hover:underline flex items-center gap-0.5">
                        <Crosshair className="w-3 h-3" /> Fokus
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sisi Kanan: Data Ringkas Rencana Aksi (5 Kolom) */}
            <div className="lg:col-span-5 bg-[#0b1222] border border-zinc-800 rounded-xl p-3.5 sm:p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>DATA RINGKAS RENCANA AKSI</span>
                </h3>
              </div>

              {/* Total Card */}
              <div className="p-3 bg-gradient-to-r from-indigo-950/80 to-blue-950/80 border border-indigo-700/60 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-indigo-300 uppercase font-semibold">
                    TOTAL ESTIMASI DI LAPANGAN
                  </div>
                  <div className="text-base sm:text-lg font-black text-white mt-0.5">
                    {advisory.actionOverview?.totalElements || '36 elemen'} &bull; <span className="text-amber-400">{advisory.actionOverview?.totalCrowd || '± 2.720 orang'}</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              {/* Klaster Lokasi & Isu Breakdown */}
              <div className="space-y-2 text-[11px]">
                <strong className="text-zinc-300 block font-sans font-bold">A. KLASTER LOKASI UTAMA:</strong>
                <div className="space-y-1 bg-[#070b14] p-2.5 rounded-lg border border-zinc-800/80 font-mono">
                  {advisory.actionOverview?.locationClusters?.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-zinc-400">
                      <span className="truncate max-w-[170px] text-zinc-300">{i + 1}. {c.label}</span>
                      <span className="text-amber-300 font-bold whitespace-nowrap">{c.crowd}</span>
                    </div>
                  ))}
                </div>

                <strong className="text-zinc-300 block font-sans font-bold pt-1">B. KLASTER ISU DOMINAN:</strong>
                <div className="space-y-1 bg-[#070b14] p-2.5 rounded-lg border border-zinc-800/80 font-mono">
                  {advisory.actionOverview?.issueClusters?.slice(0, 3).map((iss, i) => (
                    <div key={i} className="flex justify-between items-center text-zinc-400">
                      <span className="truncate max-w-[170px] text-zinc-300">{iss.label}</span>
                      <span className="text-cyan-400 font-bold whitespace-nowrap">{iss.crowd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4-Box Advisory Matrix (Aturan Keselamatan Lapangan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs font-sans">
            {/* Box 1: Hal yang Perlu Diperhatikan & Dihindari */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#0b1222] border-l-4 border-l-red-500 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold font-mono">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="uppercase text-[11px] sm:text-xs">HAL YANG PERLU DIHINDARI</span>
              </div>
              <ul className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed">
                {advisory.generalPoints.slice(0, 4).map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 2: Jika Aksi Terjadi Saat Berada di Kantor */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#0b1222] border-l-4 border-l-emerald-500 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                <Building className="w-4 h-4 text-emerald-500" />
                <span className="uppercase text-[11px] sm:text-xs">JIKA AKSI TERJADI SAAT DI KANTOR</span>
              </div>
              <ul className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed">
                {advisory.officePoints.slice(0, 4).map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 3: Saat Pergi & Pulang Kantor */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#0b1222] border-l-4 border-l-blue-500 border border-zinc-800 space-y-2 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-blue-400 font-bold font-mono">
                <Car className="w-4 h-4 text-blue-500" />
                <span className="uppercase text-[11px] sm:text-xs">SAAT PERGI &amp; PULANG KANTOR</span>
              </div>
              <ul className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed">
                {advisory.commutePoints.slice(0, 4).map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-400 font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nomor Darurat Strip (Emergency Call Bar) */}
          <div className="bg-gradient-to-r from-red-950/90 via-red-900/80 to-zinc-950 p-3.5 sm:p-4 rounded-xl border border-red-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white font-bold font-mono">
              <PhoneCall className="w-5 h-5 text-yellow-400 animate-bounce" />
              <div>
                <div className="text-xs sm:text-sm uppercase tracking-wider text-yellow-300">
                  NOMOR DARURAT &amp; LAYANAN KEDARURATAN (DKI JAKARTA)
                </div>
                <div className="text-[11px] text-zinc-300 font-normal">
                  Tekan nomor di bawah untuk langsung melakukan panggilan darurat dari ponsel
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {advisory.emergencyContacts.map((contact, idx) => {
                const telNumber = contact.number.replace(/[^0-9]/g, '');
                return (
                  <a
                    key={idx}
                    href={`tel:${telNumber}`}
                    className="px-3 py-2 rounded-xl bg-black/60 hover:bg-black/90 border border-red-500/60 text-white flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    <div>
                      <div className="font-mono text-sm sm:text-base font-black text-yellow-300 leading-none">
                        {contact.number}
                      </div>
                      <div className="text-[9px] text-zinc-300 uppercase leading-tight mt-0.5">
                        {contact.label}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-800/80">
            <span>Sumber: <strong>{advisory.sourceOperator}</strong></span>
            <span>Diparse pada: <strong>{new Date(advisory.parsedAt).toLocaleString('id-ID')}</strong></span>
            <span className="text-cyan-400">Intel Nusantara Universal Situational Intelligence</span>
          </div>
        </div>
      )}
    </div>
  );
};
