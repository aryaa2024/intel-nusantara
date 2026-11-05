import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Globe, 
  AlertTriangle, 
  Flame, 
  Search, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Share2, 
  PlusCircle, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Activity, 
  Users, 
  MapPin, 
  Printer, 
  Layers, 
  ChevronRight, 
  Lock, 
  Trash2, 
  Edit3, 
  Send, 
  FileText, 
  Compass, 
  BarChart3, 
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Cpu,
  LogIn,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  SituationalReport, 
  SituationalThreatLevel, 
  SituationalStatus, 
  OperationalScope 
} from '../types';
import { 
  extractSituationalDataFromText, 
  SIMULATION_PRESETS, 
  INITIAL_SITUATIONAL_REPORTS 
} from '../utils/aiNewsExtractor';
import { TacticalSituationalMap } from '../components/TacticalSituationalMap';

interface SituationalIntelligencePageProps {
  isReadOnly?: boolean;
  publicShareToken?: string | null;
  onExitToLogin?: () => void;
}

const STORAGE_KEY = 'intel_situational_reports_v1';

export const SituationalIntelligencePage: React.FC<SituationalIntelligencePageProps> = ({
  isReadOnly = false,
  publicShareToken = null,
  onExitToLogin
}) => {
  const { currentUser } = useAuth();

  // State Data Laporan Situasional
  const [reports, setReports] = useState<SituationalReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SITUATIONAL_REPORTS;
  });

  // State Interaksi & Navigasi
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [focusedCoords, setFocusedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScope, setFilterScope] = useState<string>('ALL');
  const [filterThreat, setFilterThreat] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // State Modal Input Berita AI
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [rawNewsInput, setRawNewsInput] = useState('');
  const [sourceUrlInput, setSourceUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<SituationalReport | null>(null);

  // State Modal Share Link Publik
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [generatedShareUrl, setGeneratedShareUrl] = useState('');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // State Detail Dossier Modal
  const [detailDossierReport, setDetailDossierReport] = useState<SituationalReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Timestamp Cut-Off
  const [cutOffTime, setCutOffTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setCutOffTime(`${dd}/${mm}/${yyyy} ${hh}:${min}:${ss} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simpan data saat diperbarui (hanya di mode operator)
  const saveReports = (newReports: SituationalReport[]) => {
    setReports(newReports);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
    } catch (e) {
      console.error('Failed to save situational reports', e);
    }
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Eksekusi Ekstraksi Berita Otomatis
  const handleRunAiExtraction = () => {
    if (!rawNewsInput.trim()) {
      showToast('Harap masukkan teks berita atau pilih salah satu preset simulasi.');
      return;
    }

    setIsExtracting(true);
    setExtractionResult(null);

    setTimeout(() => {
      const operatorName = currentUser ? `${currentUser.callsign} (${currentUser.badgeNumber})` : 'Operator Komando';
      const extracted = extractSituationalDataFromText(rawNewsInput, sourceUrlInput, operatorName);
      setExtractionResult(extracted);
      setIsExtracting(false);
    }, 900);
  };

  // Simpan hasil ekstraksi ke feed laporan aktif
  const handleCommitExtractedReport = () => {
    if (!extractionResult) return;

    const updated = [extractionResult, ...reports];
    saveReports(updated);
    setIsInputModalOpen(false);
    setRawNewsInput('');
    setSourceUrlInput('');
    setExtractionResult(null);
    setSelectedReportId(extractionResult.id);
    setFocusedCoords(extractionResult.coordinates);
    showToast(`Laporan [${extractionResult.reportCode}] berhasil diekstraksi dan diplot ke peta!`);
  };

  // Isi form dengan salah satu Preset Simulasi
  const handleApplyPreset = (preset: typeof SIMULATION_PRESETS[0]) => {
    setRawNewsInput(preset.rawText);
    setSourceUrlInput(preset.url);
  };

  // Buka Modal Share Link Publik
  const handleOpenShareModal = () => {
    const origin = window.location.origin;
    const token = `share_${Date.now().toString().slice(-6)}`;
    // Menghasilkan link yang kompatibel baik dengan path /share/report/:token maupun query ?share=:token
    const shareUrl = `${origin}/?share=${token}#/share/report/${token}`;
    setGeneratedShareUrl(shareUrl);
    setIsShareModalOpen(true);
    setCopiedShareLink(false);
  };

  // Salin Link Publik ke Clipboard
  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(generatedShareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  // Bagikan via WhatsApp
  const handleShareToWhatsApp = () => {
    const totalReports = reports.length;
    const criticalCount = reports.filter(r => r.threatLevel === 'CRITICAL').length;
    const highCount = reports.filter(r => r.threatLevel === 'HIGH').length;

    const message = `*🚨 [INTEL NUSANTARA - EXECUTIVE SITUATIONAL REPORT]*
*Klasifikasi:* DOKUMEN EKSEKUTIF BERBAGI TERBATAS
*Waktu Cut-Off:* ${cutOffTime}

*Ringkasan Pemantauan:*
• Total Laporan Terpantau: ${totalReports} Titik Sasaran
• Hotspot Status Kritis: ${criticalCount} Sektor
• Hotspot Status Tinggi: ${highCount} Sektor

Akses Dasbor Pemantauan Interaktif (Langsung Dibuka Tanpa Login):
👉 ${generatedShareUrl}

_Pusat Komando & Analisis Situasional Intel Nusantara_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Hapus Laporan (Admin Only)
  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Hapus laporan situasional ini dari dasbor?')) {
      const updated = reports.filter(r => r.id !== id);
      saveReports(updated);
      if (selectedReportId === id) setSelectedReportId(null);
      showToast('Laporan berhasil dihapus.');
    }
  };

  // Ubah Status Cepat (Admin Only)
  const handleToggleStatus = (id: string, currentStatus: SituationalStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: SituationalStatus = 
      currentStatus === 'Live' ? 'Selesai' :
      currentStatus === 'Selesai' ? 'Rencana/Rengiat' : 'Live';

    const updated = reports.map(r => r.id === id ? { ...r, status: nextStatus } : r);
    saveReports(updated);
    showToast(`Status diubah menjadi: ${nextStatus}`);
  };

  // Reset Data ke Awal (Admin Only)
  const handleResetDefaultReports = () => {
    if (window.confirm('Reset seluruh laporan situasional ke dataset default?')) {
      saveReports(INITIAL_SITUATIONAL_REPORTS);
      setSelectedReportId(null);
      setFocusedCoords(null);
      showToast('Dasbor berhasil di-reset ke data bawaan.');
    }
  };

  // Kalkulasi 4 Metrik Utama
  const metrics = useMemo(() => {
    const totalActive = reports.length;
    const liveCount = reports.filter(r => r.status === 'Live').length;
    const rencanaCount = reports.filter(r => r.status === 'Rencana/Rengiat').length;
    const criticalHighCount = reports.filter(r => r.threatLevel === 'CRITICAL' || r.threatLevel === 'HIGH').length;
    const totalCrowdEstimate = reports.reduce((acc, r) => acc + (r.crowdCountEstimate || 0), 0);

    return {
      totalActive,
      liveCount,
      rencanaCount,
      criticalHighCount,
      totalCrowdEstimate,
      peakHourEstimate: '10:00 - 15:30 WIB'
    };
  }, [reports]);

  // Urutan Peringkat Hotspot (Hotspot Ranking)
  const rankedHotspots = useMemo(() => {
    const threatOrder: Record<SituationalThreatLevel, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    };

    return [...reports].sort((a, b) => {
      const diff = threatOrder[b.threatLevel] - threatOrder[a.threatLevel];
      if (diff !== 0) return diff;
      return (b.crowdCountEstimate || 0) - (a.crowdCountEstimate || 0);
    });
  }, [reports]);

  // Filter Data untuk Tabel Eksposur
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchSearch = !searchQuery.trim() || 
        report.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.partiesInvolved.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.issueSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchScope = filterScope === 'ALL' || report.scope === filterScope;
      const matchThreat = filterThreat === 'ALL' || report.threatLevel === filterThreat;
      const matchStatus = filterStatus === 'ALL' || report.status === filterStatus;

      return matchSearch && matchScope && matchThreat && matchStatus;
    });
  }, [reports, searchQuery, filterScope, filterThreat, filterStatus]);

  // Helper Badge Tingkat Ancaman
  const renderThreatBadge = (level: SituationalThreatLevel) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-700 shadow-glow-red animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-300 border border-orange-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LOW / INFO
          </span>
        );
    }
  };

  // Helper Badge Status Operasional
  const renderStatusBadge = (status: SituationalStatus) => {
    switch (status) {
      case 'Live':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> LIVE SEKARANG
          </span>
        );
      case 'Rencana/Rengiat':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> RENGIAT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-zinc-400" /> SELESAI
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#0d1424] border border-cyan-500 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-fadeIn">
          <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Public View Notice (Strict Read-Only Mode) */}
      {isReadOnly && (
        <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-cyan-950/80 border border-cyan-600/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500 text-cyan-400 shadow-glow-cyan flex-shrink-0">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-cyan-900/90 text-cyan-200 rounded font-bold uppercase tracking-widest">
                  MODE PUBLIK // STRICT READ-ONLY
                </span>
                <span className="text-emerald-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> TERBUKA TANPA LOGIN
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide mt-0.5">
                EXECUTIVE SITUATIONAL REPORT & MONITORING INTELLIGENCE
              </h2>
              <p className="text-[11px] text-zinc-400">
                Laporan eksekutif situasional resmi yang dibagikan secara terenkripsi untuk pimpinan & stakeholder.
              </p>
            </div>
          </div>

          {onExitToLogin && (
            <button
              onClick={onExitToLogin}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500 text-zinc-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 self-start sm:self-auto"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Login Operator Komando</span>
            </button>
          )}
        </div>
      )}

      {/* 1. HEADER KOMANDO & METADATA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
            UNIVERSAL SITUATIONAL INTELLIGENCE // MJ-SENTINEL KERNEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
            SITUATIONAL INTEL <span className="text-cyan-400">& PUBLIC SHARE</span>
          </h1>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 mt-1 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-700 text-red-300 font-bold uppercase tracking-wider">
              {isReadOnly ? 'DOKUMEN EKSEKUTIF BERBAGI TERBATAS' : 'INTERNAL - TERBATAS // PROTOKOL SOC'}
            </span>
            <span>•</span>
            <span className="text-zinc-300">
              Cut-Off Telemetri: <strong className="text-cyan-300">{cutOffTime || 'Memuat...'}</strong>
            </span>
          </div>
        </div>

        {/* Action Controls for Operator (Hidden in Read-Only Mode) */}
        {!isReadOnly && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>INPUT BERITA (AI EXTRACTOR)</span>
            </button>

            <button
              onClick={handleOpenShareModal}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500 text-cyan-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              title="Buat Tautan Berbagi Publik (Akses Tanpa Login)"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>BAGIKAN LAPORAN</span>
            </button>

            <button
              onClick={handleResetDefaultReports}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-red-400 transition-colors"
              title="Reset ke Laporan Situasional Awal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. GRID METRIC CARDS (4 KARTU OPERASIONAL) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        {/* Card 1: Total Laporan Terpantau */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 uppercase font-semibold">TOTAL LAPORAN AKTIF</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {metrics.totalActive} <span className="text-xs font-normal text-cyan-400 font-sans">Objek Sasaran</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">{metrics.liveCount} Live</span>
            <span>•</span>
            <span className="text-cyan-400">{metrics.rencanaCount} Rengiat</span>
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-cyan-600/10 rounded-full blur-xl"></div>
        </div>

        {/* Card 2: Akumulasi Estimasi Massa */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 uppercase font-semibold">AKUMULASI MASSA / DAMPAK</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            ± {metrics.totalCrowdEstimate.toLocaleString('id-ID')} <span className="text-xs font-normal text-amber-400 font-sans">Orang</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Estimasi crowd pergerakan lapangan
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-600/10 rounded-full blur-xl"></div>
        </div>

        {/* Card 3: Hotspot Ancaman Tinggi & Kritis */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 uppercase font-semibold">HOTSPOT ANCAMAN TINGGI</span>
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 mt-2">
            {metrics.criticalHighCount} <span className="text-xs font-normal text-red-500 font-sans">Sektor Kritis</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Status CRITICAL & HIGH alert
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-red-600/10 rounded-full blur-xl"></div>
        </div>

        {/* Card 4: Waktu Puncak / Titik Jam Rawan */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 uppercase font-semibold">WAKTU PUNCAK RAWAN</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2 truncate">
            {metrics.peakHourEstimate}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-bold">
            SIAGA 1 // PENGAMANAN PERIMETER
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-600/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* 3. LAYOUT 2 KOLOM: SISI KIRI (PETA TAKTIS LEAFLET) & SISI KANAN (PERINGKAT HOTSPOT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri (8 cols): PETA TAKTIS VISUAL LEAFLET / OSM CONTAINER */}
        <div className="lg:col-span-8 space-y-4">
          <TacticalSituationalMap
            reports={reports}
            selectedReportId={selectedReportId}
            onSelectReport={(report) => {
              setSelectedReportId(report.id);
              setFocusedCoords(report.coordinates);
            }}
            focusedCoordinates={focusedCoords}
          />
        </div>

        {/* Kolom Kanan (4 cols): PANEL PERINGKAT HOTSPOT & ANALISIS ESKALASI */}
        <div className="lg:col-span-4 space-y-4 font-mono">
          <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <h3 className="font-bold text-sm text-white tracking-wide uppercase">
                  PERINGKAT HOTSPOT
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded font-bold">
                PRIORITAS ESKALASI
              </span>
            </div>

            <p className="text-[11px] text-zinc-400">
              Daftar objek sasaran diurutkan berdasarkan tingkat keparahan ancaman dan estimasi konsentrasi massa. Klik kartu untuk memusatkan peta:
            </p>

            {/* List Hotspot Cards */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {rankedHotspots.map((item, index) => {
                const isSelected = selectedReportId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedReportId(item.id);
                      setFocusedCoords(item.coordinates);
                    }}
                    className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 group relative ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-[#0d1424]/80 hover:bg-[#111a30] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="w-5 h-5 rounded-full bg-black/60 border border-zinc-700 flex items-center justify-center text-[10px] font-black text-cyan-400">
                          #{index + 1}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {item.targetEntity}
                        </span>
                      </div>
                      {renderThreatBadge(item.threatLevel)}
                    </div>

                    <div className="text-[11px] text-zinc-400 flex items-center justify-between mt-1">
                      <span className="truncate max-w-[180px]">{item.region}</span>
                      <span className="text-zinc-200 font-bold">{item.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-zinc-300 line-clamp-1 mt-1 font-sans">
                      {item.scaleEstimate}
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-800/80 text-[10px]">
                      <span className="text-cyan-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.coordinates.latitude.toFixed(4)}, {item.coordinates.longitude.toFixed(4)}
                      </span>
                      <span className="text-zinc-500 group-hover:text-cyan-300 flex items-center gap-1">
                        <span>Fokus Peta</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* 4. TABEL EKSPOSUR DATA OPERASIONAL */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 font-mono">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              TABEL EKSPOSUR DATA OPERASIONAL TERPADU
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Rangkuman terstruktur seluruh objek sasaran, estimasi dampak, isu pokok, dan status penanganan
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari entitas, isu, wilayah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Scope Filter */}
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value)}
              className="px-2.5 py-1.5 bg-black/60 border border-zinc-700 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">SEMUA LINGKUP</option>
              <option value="UNRAS_MASSA">UNRAS / MASSA</option>
              <option value="OBVITNAS_THREAT">OBVITNAS</option>
              <option value="SECURITY_INCIDENT">INSIDEN KEAMANAN</option>
              <option value="CRIME_INVESTIGATION">KRIMINALITAS</option>
              <option value="PATROL_INTERCEPTION">PATROLI / CEGAT</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-black/60 border border-zinc-700 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">SEMUA STATUS</option>
              <option value="Live">LIVE SEKARANG</option>
              <option value="Rencana/Rengiat">RENGIAT</option>
              <option value="Selesai">SELESAI</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] text-zinc-400 bg-black/40">
                <th className="py-3 px-3">KODE / WAKTU</th>
                <th className="py-3 px-3">OBJEK SASARAN</th>
                <th className="py-3 px-3">WILAYAH & KOORDINAT</th>
                <th className="py-3 px-3">PIHAK TERLIBAT</th>
                <th className="py-3 px-3">SKALA / MASSA</th>
                <th className="py-3 px-3">POKOK ISU</th>
                <th className="py-3 px-3">ANCAMAN</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-zinc-500">
                    Tidak ada laporan situasional yang sesuai dengan kriteria filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredReports.map((row) => (
                  <tr 
                    key={row.id}
                    onClick={() => {
                      setSelectedReportId(row.id);
                      setFocusedCoords(row.coordinates);
                    }}
                    className={`cursor-pointer transition-colors ${
                      selectedReportId === row.id 
                        ? 'bg-cyan-950/30' 
                        : 'hover:bg-zinc-900/40'
                    }`}
                  >
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-white">{row.reportCode}</div>
                      <div className="text-[10px] text-zinc-400">{row.timestamp}</div>
                    </td>

                    <td className="py-3 px-3 font-bold text-zinc-100 max-w-[160px] truncate">
                      {row.targetEntity}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-zinc-300">{row.region}</div>
                      <div className="text-[10px] text-cyan-400">
                        {row.coordinates.latitude.toFixed(4)}, {row.coordinates.longitude.toFixed(4)}
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-[150px] truncate text-zinc-300">
                      {row.partiesInvolved}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-amber-300 font-semibold">
                      {row.scaleEstimate}
                    </td>

                    <td className="py-3 px-3 max-w-[200px] truncate text-zinc-300 font-sans" title={row.issueSummary}>
                      {row.issueSummary}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderThreatBadge(row.threatLevel)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderStatusBadge(row.status)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailDossierReport(row)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-950 text-zinc-300 hover:text-cyan-300 border border-zinc-700 transition-colors"
                          title="Lihat Detail Dossier Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isReadOnly && (
                          <>
                            <button
                              onClick={(e) => handleToggleStatus(row.id, row.status, e)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-950 text-zinc-300 hover:text-emerald-300 border border-zinc-700 transition-colors"
                              title="Ubah Status Operasional (Live / Selesai / Rengiat)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleDeleteReport(row.id, e)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-400 border border-zinc-700 transition-colors"
                              title="Hapus Laporan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. AUDIT TRAIL & LOGGING FOOTER */}
      <div className="p-4 bg-[#080d1a] border border-zinc-800/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] font-mono text-zinc-400 shadow-inner">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            LOGGED BY: <strong className="text-white">{currentUser?.callsign || 'HQ-OPERATOR'} ({currentUser?.badgeNumber || 'ADM-001'})</strong>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span>
            SOURCE: <strong className="text-zinc-200">AI News Extractor & OSINT Engine v2.4</strong>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 VERIFIED
          </span>
        </div>

        <div className="text-zinc-500 text-right">
          PLATFORM INTEL NUSANTARA // MJ-SENTINEL PROTOCOL
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: SIMULATOR AI NEWS EXTRACTION (INPUT LAYER)
          ========================================================================= */}
      {isInputModalOpen && !isReadOnly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#090e1a] border-2 border-cyan-600/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl font-mono text-zinc-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    SIMULATOR AI NEWS EXTRACTION (INPUT LAYER)
                  </h3>
                  <span className="text-[10px] text-cyan-400">
                    Ekstraksi Otomatis: Waktu, Sasaran, Koordinat, Pihak Terlibat, Skala, & Ancaman
                  </span>
                </div>
              </div>

              <button
                onClick={() => { setIsInputModalOpen(false); setExtractionResult(null); }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preset 1-Click Simulation Buttons */}
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                PILIH PRESET SIMULASI CEPAT:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SIMULATION_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2 rounded-xl bg-zinc-900/90 hover:bg-cyan-950/50 border border-zinc-800 hover:border-cyan-600 text-left text-[10px] transition-all group"
                  >
                    <span className="font-bold text-zinc-200 group-hover:text-cyan-300 block truncate">
                      {p.title}
                    </span>
                    <span className="text-zinc-500 text-[9px] block mt-0.5">
                      {p.source}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form Text Area */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  TAUTAN SUMBER BERITA (OPSIONAL):
                </label>
                <input
                  type="text"
                  placeholder="https://cnnindonesia.com/nasional/berita-terkini"
                  value={sourceUrlInput}
                  onChange={(e) => setSourceUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  TEKS LAPORAN MENTAH / BERITA (RAW TEXT):
                </label>
                <textarea
                  rows={5}
                  placeholder="Tempelkan paragraf berita unras, patroli keamanan, ancaman obvitnas, kebakaran, dll..."
                  value={rawNewsInput}
                  onChange={(e) => setRawNewsInput(e.target.value)}
                  className="w-full p-3 bg-black/60 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleRunAiExtraction}
                disabled={isExtracting}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-bold text-xs transition-all shadow-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExtracting ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-white" />
                    <span>MEMPROSES HEURISTIC NLP & EKSTRAKSI GEO-ENTITY...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>JALANKAN EKSTRAKSI AI OTOMATIS</span>
                  </>
                )}
              </button>
            </div>

            {/* Extraction Results Preview */}
            {extractionResult && (
              <div className="p-4 bg-black/70 border border-cyan-500 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    HASIL EKSTRAKSI STRUKTUR BERITA
                  </span>
                  {renderThreatBadge(extractionResult.threatLevel)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">Waktu & Tanggal:</span>
                    <span className="font-bold text-white">{extractionResult.timestamp} ({extractionResult.eventDate})</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Status Operasional:</span>
                    <span className="font-bold text-emerald-400">{extractionResult.status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Entitas / Objek Sasaran:</span>
                    <span className="font-bold text-white">{extractionResult.targetEntity}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Wilayah & Koordinat:</span>
                    <span className="font-bold text-cyan-300">{extractionResult.region} [{extractionResult.coordinates.latitude}, {extractionResult.coordinates.longitude}]</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Pihak Terlibat:</span>
                    <span className="font-bold text-zinc-200">{extractionResult.partiesInvolved}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Estimasi Skala:</span>
                    <span className="font-bold text-amber-300">{extractionResult.scaleEstimate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">Ringkasan Pokok Isu:</span>
                  <p className="text-xs text-zinc-200 font-sans mt-0.5">{extractionResult.issueSummary}</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setExtractionResult(null)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleCommitExtractedReport}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Plot ke Dasbor & Peta Taktis</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: BAGIKAN LAPORAN PUBLIK (PUBLIC SHARE LINK GENERATOR)
          ========================================================================= */}
      {isShareModalOpen && !isReadOnly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#090e1a] border-2 border-cyan-500 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl font-mono text-zinc-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-400">
                  <Share2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    BAGIKAN LAPORAN PUBLIK (TANPA LOGIN)
                  </h3>
                  <span className="text-[10px] text-cyan-400">
                    Akses Langsung Read-Only Untuk Stakeholder & Pimpinan
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-black/50 border border-zinc-800 rounded-xl space-y-2 text-xs">
              <span className="text-zinc-400 text-[11px] block">
                Tautan publik ini dapat langsung dibuka oleh siapa saja tanpa perlu login atau registrasi akun. Seluruh fungsi administrasi disembunyikan dalam mode Strict Read-Only.
              </span>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={generatedShareUrl}
                  className="w-full px-3 py-2 bg-black/80 border border-cyan-600/60 rounded-xl text-xs text-cyan-300 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyPublicLink}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-all shadow-sm"
                >
                  {copiedShareLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedShareLink ? 'DISALIN!' : 'SALIN'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleShareToWhatsApp}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>BAGIKAN KE WHATSAPP (BRIEFING OTOMATIS)</span>
              </button>

              <button
                type="button"
                onClick={() => window.open(generatedShareUrl, '_blank')}
                className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>UJI TAMPILAN PUBLIK DI TAB BARU</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DETAIL DOSSIER LAPORAN
          ========================================================================= */}
      {detailDossierReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#090e1a] border-2 border-zinc-700 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl font-mono text-zinc-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800 gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-cyan-400">{detailDossierReport.reportCode}</span>
                  {renderThreatBadge(detailDossierReport.threatLevel)}
                  {renderStatusBadge(detailDossierReport.status)}
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {detailDossierReport.targetEntity}
                </h3>
              </div>

              <button
                onClick={() => setDetailDossierReport(null)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-black/50 p-3.5 rounded-xl border border-zinc-800">
              <div>
                <span className="text-zinc-500 block text-[10px]">WAKTU KEJADIAN</span>
                <span className="font-bold text-white">{detailDossierReport.timestamp} ({detailDossierReport.eventDate})</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">WILAYAH SASARAN</span>
                <span className="font-bold text-white">{detailDossierReport.region}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">KOORDINAT GPS</span>
                <span className="font-bold text-cyan-400">{detailDossierReport.coordinates.latitude}, {detailDossierReport.coordinates.longitude}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">ESTIMASI MASSA / SKALA</span>
                <span className="font-bold text-amber-300">{detailDossierReport.scaleEstimate}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-400 block mb-1">PIHAK / ORGANISASI TERLIBAT:</span>
              <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-xs text-zinc-200">
                {detailDossierReport.partiesInvolved}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-400 block mb-1">LAPORAN KRONOLOGI / POKOK ISU:</span>
              <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                {detailDossierReport.fullContent || detailDossierReport.issueSummary}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800">
              <span>Dicatat oleh: {detailDossierReport.loggedBy}</span>
              <button
                type="button"
                onClick={() => setDetailDossierReport(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white"
              >
                Tutup Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
