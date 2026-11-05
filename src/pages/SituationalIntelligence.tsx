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
  Eye,
  Navigation,
  Building,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Scale
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
import { 
  RAW_UNRAS_DATA,
  UNRAS_REPORTS, 
  SITREP_FINDINGS, 
  EXECUTIVE_RECOMMENDATIONS, 
  CORPORATE_EXPOSURES, 
  MOVEMENT_ROUTE_DATA, 
  PARALLEL_EVENTS_DATA, 
  CANCELLATIONS_H1_DATA, 
  UNCONFIRMED_SIGNALS_DATA, 
  OUTSIDE_JAKARTA_DATA 
} from '../data/situationalIntelligenceData';
import { TacticalSituationalMap } from '../components/TacticalSituationalMap';

interface SituationalIntelligencePageProps {
  isReadOnly?: boolean;
  publicShareToken?: string | null;
  onExitToLogin?: () => void;
}

const STORAGE_KEY = 'intel_situational_reports_v2';

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
        if (Array.isArray(parsed) && parsed.length >= 20) {
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
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveReports = (newReports: SituationalReport[]) => {
    setReports(newReports);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
    } catch {
      // storage error
    }
  };

  // Eksekusi AI News Parser
  const handleRunAiExtraction = () => {
    if (!rawNewsInput.trim()) {
      showToast('Harap masukkan teks atau link laporan berita!');
      return;
    }

    setIsExtracting(true);
    setTimeout(() => {
      try {
        const loggedCallsign = currentUser ? `${currentUser.callsign} (${currentUser.username})` : 'Operator Aryaa (ARYAA-KOMANDO)';
        const extracted = extractSituationalDataFromText(rawNewsInput, sourceUrlInput, loggedCallsign);
        setExtractionResult(extracted);
      } catch (err) {
        showToast('Gagal mengekstraksi data berita. Periksa format teks.');
      } finally {
        setIsExtracting(false);
      }
    }, 600);
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
    const corporateCount = CORPORATE_EXPOSURES.length;
    const totalCrowd = (RAW_UNRAS_DATA.totals as any)?.total_massa || (RAW_UNRAS_DATA.totals as any)?.massa || 1975;

    const message = `*🚨 [MJ-SENTINEL - EXECUTIVE SITUATIONAL REPORT]*
*SITUATION REPORT: SITUASI JAKARTA & UNJUK RASA*
*Klasifikasi:* INTERNAL - TERBATAS // TINGKAT DIREKSI
*Cut-Off Data:* 5 Nov 2026, 03.46 WIB (${cutOffTime})
*Status Data:* Rencana (Rengiat), Bukan Realisasi

*Ringkasan Eksekutif:*
• Titik Rencana Aksi: ${totalReports} Titik (Jakpus 33, Jaksel 32, Jakut 3)
• Estimasi Agregat Massa: ± ${totalCrowd.toLocaleString('id-ID')} Orang
• Aksi Skala Besar (≥100 org): 4 Aksi (PN Jakpus 250, Borwita 200, FSPMI 150)
• Aksi Skala Kecil (≤25 org): 56 Aksi (82% dari total)
• Eksposur Korporasi Bisnis: ${corporateCount} Aksi (685 orang menyasar gedung komersial)
• Puncak Jam Rawan: 10.00 & 13.00 WIB

Buka Dasbor Situasional Interaktif (Langsung Tanpa Login):
👉 ${generatedShareUrl}

_Matajaga Research • Intelligence & Advisory & Intel Nusantara Command_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Reset Data ke Awal (Admin Only)
  const handleResetDefaultReports = () => {
    if (window.confirm('Reset seluruh laporan situasional ke dataset default MJ-Sentinel 68 Aksi?')) {
      saveReports(UNRAS_REPORTS);
      setSelectedReportId(null);
      setFocusedCoords(null);
      showToast('Dasbor berhasil di-reset ke dataset bawaan.');
    }
  };

  // 7 KPI Stats Tingkat Direksi
  const kpiStats = useMemo(() => {
    const totalAksi = reports.length;
    const totalMassa = reports.reduce((acc, r) => acc + (r.crowdCountEstimate || 0), 0);
    const aksiBesar = reports.filter(r => (r.crowdCountEstimate || 0) >= 100).length;
    const aksiKecil = reports.filter(r => (r.crowdCountEstimate || 0) <= 25).length;
    const persenKecil = Math.round((aksiKecil / Math.max(1, totalAksi)) * 100);
    const eksposurKorporasi = reports.filter(r => (r as any).isCorporateExposure || (r as any).targetCategory?.includes('Korporasi') || r.scope === 'OBVITNAS_THREAT').length;
    const klasterCount = 36;
    const giatParalelCount = PARALLEL_EVENTS_DATA.length;
    const giatParalelMassa = PARALLEL_EVENTS_DATA.reduce((acc, g: any) => acc + (g.m || g.massa || 0), 0);

    return {
      totalAksi,
      totalMassa: totalMassa || 1975,
      aksiBesar,
      aksiKecil,
      persenKecil,
      eksposurKorporasi,
      klasterCount,
      giatParalelCount,
      giatParalelMassa
    };
  }, [reports]);

  // Urutan Peringkat Hotspot
  const rankedHotspots = useMemo(() => {
    return [...reports].sort((a, b) => (b.crowdCountEstimate || 0) - (a.crowdCountEstimate || 0));
  }, [reports]);

  // Filter Data untuk Tabel
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchSearch = 
        report.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.partiesInvolved.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.issueSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchThreat = filterThreat === 'ALL' || report.threatLevel === filterThreat;
      const matchStatus = filterStatus === 'ALL' || report.status === filterStatus;
      const repCat = (report as any).targetCategory || '';
      const matchCategory = filterCategory === 'ALL' || repCat.toLowerCase().includes(filterCategory.toLowerCase());

      return matchSearch && matchThreat && matchStatus && matchCategory;
    });
  }, [reports, searchQuery, filterThreat, filterStatus, filterCategory]);

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-7 font-sans text-slate-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#0d1424] border border-cyan-500 text-cyan-200 px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-fadeIn">
          <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Public View Notice (Strict Read-Only Mode) */}
      {isReadOnly && (
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-600/70 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-fadeIn">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-600/20 border border-amber-500 text-amber-400 shadow-glow-amber flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-amber-900/90 text-amber-200 rounded font-bold uppercase tracking-widest">
                  MODE PUBLIK // STRICT READ-ONLY
                </span>
                <span className="text-emerald-400 text-[10px] sm:text-xs flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> TERBUKA TANPA LOGIN
                </span>
              </div>
              <h2 className="text-xs sm:text-base font-bold text-white tracking-wide mt-0.5 leading-snug">
                EXECUTIVE SITUATIONAL REPORT &amp; THREAT MONITORING
              </h2>
              <p className="text-[10px] sm:text-[11px] text-zinc-400">
                Laporan intelijen situasional resmi untuk pimpinan, pengelola aset komersial, &amp; stakeholder.
              </p>
            </div>
          </div>

          {onExitToLogin && (
            <button
              onClick={onExitToLogin}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500 text-zinc-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 self-start sm:self-auto"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Login Operator</span>
            </button>
          )}
        </div>
      )}

      {/* =========================================================================
          HEADER EKSEKUTIF ALA MJ-SENTINEL (Screenshot 1)
          ========================================================================= */}
      <div className="space-y-3 border-b border-zinc-800/80 pb-5 sm:pb-6">
        {/* Brand Tagline & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400 tracking-wider sm:tracking-widest font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>MJ-SENTINEL &bull; MATAJAGA RESEARCH &bull; INTELLIGENCE &amp; ADVISORY</span>
          </div>

          {/* Action Controls for Operator (Hidden in Read-Only Mode) */}
          {!isReadOnly && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsInputModalOpen(true)}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5"
                title="Input Artikel Berita Baru Menggunakan Parser Otomatis AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span className="truncate">INPUT BERITA AI</span>
              </button>

              <button
                onClick={handleOpenShareModal}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500 text-cyan-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                title="Buat Tautan Berbagi Publik (Akses Siapa Saja Tanpa Login)"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">BAGIKAN LINK</span>
              </button>

              <button
                onClick={handleResetDefaultReports}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-red-400 transition-colors flex-shrink-0"
                title="Reset ke Dataset Bawaan MJ-Sentinel 68 Titik"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Big Executive Title */}
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Situasi Jakarta &amp; Unjuk Rasa<br />
            <span className="text-slate-300 font-semibold text-base sm:text-xl lg:text-2xl">Kamis, 5 November 2026</span>
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 mt-1 max-w-4xl leading-relaxed">
            Gambaran situasional tingkat direksi atas 68 titik unjuk rasa terencana di DKI Jakarta, sebaran geografis, puncak waktu, rute pergerakan massa, dan eksposur terhadap entitas korporasi.
          </p>
        </div>

        {/* 4 Executive Badges (Sesuai Persis Screenshot 1) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap font-mono text-[9px] sm:text-[10px] md:text-[11px] pt-0.5">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-600/90 font-bold uppercase tracking-wider shadow-sm">
            INTERNAL &mdash; TERBATAS
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800 tracking-wider">
            CUT-OFF: <strong>5 NOV 2026, 03.46 WIB</strong> ({cutOffTime})
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-zinc-900/90 text-zinc-400 border border-zinc-800">
            SUMBER TUNGGAL &bull; BELUM VERIFIKASI SILANG
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-blue-950/80 text-blue-300 border border-blue-700/80 font-bold uppercase tracking-wider">
            STATUS: RENCANA (RENGIAT)
          </span>
        </div>
      </div>

      {/* =========================================================================
          7 KARTU KPI TINGKAT DIREKSI (Screenshot 1 - Rapi di Mobile & Desktop)
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 font-mono">
        {/* KPI 1 */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-2.5 sm:p-3.5 shadow-sm relative overflow-hidden">
          <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-semibold leading-tight block truncate">
            TITIK UNJUK RASA
          </span>
          <div className="text-lg sm:text-2xl font-black text-white mt-1 flex items-baseline gap-1">
            {kpiStats.totalAksi} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">aksi</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight truncate">
            Jakpus 33 &bull; Jaksel 32 &bull; Jakut 3
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-2.5 sm:p-3.5 shadow-sm relative overflow-hidden">
          <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-semibold leading-tight block truncate">
            ESTIMASI MASSA
          </span>
          <div className="text-lg sm:text-2xl font-black text-white mt-1 flex items-baseline gap-1">
            {kpiStats.totalMassa.toLocaleString('id-ID')} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">orang</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight truncate">
            Agregat angka &ldquo;&plusmn;&rdquo; pelapor
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#0b101c] border border-red-900/60 rounded-xl p-2.5 sm:p-3.5 shadow-sm relative overflow-hidden">
          <span className="text-[9px] sm:text-[10px] text-red-400 uppercase font-bold leading-tight block truncate">
            SKALA &ge;100 ORANG
          </span>
          <div className="text-lg sm:text-2xl font-black text-red-400 mt-1 flex items-baseline gap-1">
            {kpiStats.aksiBesar} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">aksi</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight truncate">
            PN Jakpus, Borwita, FSPMI
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-2.5 sm:p-3.5 shadow-sm relative overflow-hidden">
          <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-semibold leading-tight block truncate">
            SKALA &le;25 ORANG
          </span>
          <div className="text-lg sm:text-2xl font-black text-white mt-1 flex items-baseline gap-1">
            {kpiStats.aksiKecil} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">aksi</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight truncate">
            {kpiStats.persenKecil}% &mdash; mayoritas kecil
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-[#0b101c] border border-amber-900/60 rounded-xl p-2.5 sm:p-3.5 shadow-sm relative overflow-hidden">
          <span className="text-[9px] sm:text-[10px] text-amber-400 uppercase font-bold leading-tight block truncate">
            EKSPOSUR BISNIS
          </span>
          <div className="text-lg sm:text-2xl font-black text-amber-400 mt-1 flex items-baseline gap-1">
            {kpiStats.eksposurKorporasi} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">aksi</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight truncate">
            685 org &bull; gedung korporasi
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-2.5 sm:p-3.5 shadow-sm relative overflow-hidden">
          <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-semibold leading-tight block truncate">
            KLASTER TITIK
          </span>
          <div className="text-lg sm:text-2xl font-black text-white mt-1 flex items-baseline gap-1">
            {kpiStats.klasterCount} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">klaster</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight truncate">
            Aksi menumpuk di 1 titik
          </div>
        </div>

        {/* KPI 7 (Span 2 columns on mobile so it fills the 4th row cleanly) */}
        <div className="col-span-2 sm:col-span-1 bg-[#0b101c] border border-emerald-900/60 rounded-xl p-2.5 sm:p-3.5 shadow-sm relative overflow-hidden">
          <span className="text-[9px] sm:text-[10px] text-emerald-400 uppercase font-bold leading-tight block truncate">
            GIAT MASSA PARALEL
          </span>
          <div className="text-lg sm:text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
            {kpiStats.giatParalelCount} <span className="text-[10px] sm:text-xs font-normal text-zinc-400">giat</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight truncate">
            {kpiStats.giatParalelMassa.toLocaleString('id-ID')} org &bull; beban lalin
          </div>
        </div>
      </div>

      {/* =========================================================================
          01. PETA PERGERAKAN & SEBARAN TITIK AKSI + PANEL HOTSPOT (Screenshot 1)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Kolom Kiri: Tactical Map Container (8 Kolom) */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          <TacticalSituationalMap
            reports={reports}
            selectedReportId={selectedReportId}
            onSelectReport={(rep) => {
              setSelectedReportId(rep.id);
              setFocusedCoords(rep.coordinates);
            }}
            focusedCoordinates={focusedCoords}
          />
        </div>

        {/* Kolom Kanan: Panel Peringkat Hotspot menurut Akumulasi Massa (4 Kolom) */}
        <div className="lg:col-span-4 bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-4 flex flex-col h-[340px] sm:h-[420px] lg:h-[500px] shadow-xl">
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                HOTSPOT MENURUT MASSA
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              PRIORITAS
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 mt-1 pr-1 font-mono text-xs space-y-0.5">
            {rankedHotspots.slice(0, 15).map((hotspot, idx) => {
              const isSelected = selectedReportId === hotspot.id;
              const crowd = hotspot.crowdCountEstimate || 20;

              return (
                <div
                  key={hotspot.id}
                  onClick={() => {
                    setSelectedReportId(hotspot.id);
                    setFocusedCoords(hotspot.coordinates);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border border-cyan-500 shadow-sm'
                      : 'hover:bg-zinc-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        crowd >= 100 ? 'bg-red-500' :
                        crowd >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                      <span className="font-bold text-zinc-200 text-xs line-clamp-1">
                        {idx + 1}. {hotspot.targetEntity}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold whitespace-nowrap">
                      {hotspot.timestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400 mt-1 pl-4 flex items-center justify-between">
                    <span>{hotspot.region}</span>
                    <strong className="text-white font-bold">&plusmn;{crowd} orang</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-800 text-center font-mono text-[10px] text-zinc-500">
            Klik lokasi untuk memusatkan kamera peta
          </div>
        </div>
      </div>

      {/* =========================================================================
          02. PENILAIAN SITUASI (Executive SitRep Analysis) (Screenshot 2)
          ========================================================================= */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">02</span>
            Penilaian Situasi
          </h2>
          <span className="text-[11px] sm:text-xs font-mono text-zinc-400 italic">
            Analisis &mdash; bukan pernyataan sumber
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {SITREP_FINDINGS.map((finding) => (
            <div 
              key={finding.id}
              className={`p-3.5 sm:p-4 rounded-xl bg-[#0b1222] border-l-4 ${
                finding.accent === 'red' ? 'border-l-red-500 border border-zinc-800/80' :
                finding.accent === 'amber' ? 'border-l-amber-500 border border-zinc-800/80' :
                'border-l-cyan-500 border border-zinc-800/80'
              } space-y-1.5`}
            >
              <h3 className="font-bold text-xs sm:text-sm text-white leading-snug">
                {finding.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {finding.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          03. POLA SEBARAN (3 Kolom Bar Breakdown) (Screenshot 3)
          ========================================================================= */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4 font-mono">
        <div className="border-b border-zinc-800 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">03</span>
            Pola Sebaran
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 text-xs">
          {/* Kolom 1: Jam Mulai Aksi */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-800">
              JAM MULAI AKSI
            </h3>
            <div className="space-y-2">
              {RAW_UNRAS_DATA.jam?.map((j: any) => {
                const maxVal = 26;
                const widthPct = Math.min(100, (j.jumlah_aksi / maxVal) * 100);
                return (
                  <div key={j.jam} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-300 font-semibold">{j.jam} WIB</span>
                      <span className="text-zinc-400">
                        <strong className="text-white">{j.jumlah_aksi}</strong> aksi &bull; &plusmn;{j.massa} org
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div 
                        className={`h-full rounded-full ${
                          j.jumlah_aksi >= 15 ? 'bg-red-500' :
                          j.jumlah_aksi >= 8 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.max(6, widthPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom 2: Tema Isu Dominan */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-800">
              TEMA ISU DOMINAN
            </h3>
            <div className="space-y-2">
              {RAW_UNRAS_DATA.tema?.map((t: any) => {
                const maxVal = 25;
                const widthPct = Math.min(100, (t.jumlah_aksi / maxVal) * 100);
                return (
                  <div key={t.tema} className="space-y-1">
                    <div className="flex justify-between text-[11px] gap-2">
                      <span className="text-zinc-300 font-semibold truncate flex-1">{t.tema}</span>
                      <span className="text-zinc-400 font-bold text-white whitespace-nowrap">
                        {t.jumlah_aksi} aksi
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div 
                        className="h-full rounded-full bg-red-600"
                        style={{ width: `${Math.max(6, widthPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom 3: Kategori Sasaran */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-800">
              KATEGORI SASARAN
            </h3>
            <div className="space-y-2">
              {RAW_UNRAS_DATA.kat?.map((k: any) => {
                const maxVal = 22;
                const widthPct = Math.min(100, (k.jumlah_aksi / maxVal) * 100);
                return (
                  <div key={k.kategori} className="space-y-1">
                    <div className="flex justify-between text-[11px] gap-2">
                      <span className="text-zinc-300 font-semibold truncate flex-1">{k.kategori}</span>
                      <span className="text-zinc-400 whitespace-nowrap">
                        <strong className="text-white">{k.jumlah_aksi}</strong> aksi &bull; &plusmn;{k.massa} org
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div 
                        className={`h-full rounded-full ${
                          k.kategori.includes('Yudikatif') ? 'bg-red-500' :
                          k.kategori.includes('Swasta') ? 'bg-orange-500' :
                          k.kategori.includes('Pemerintah') ? 'bg-amber-500' :
                          k.kategori.includes('BUMN') ? 'bg-blue-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.max(6, widthPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          04. RUTE PERGERAKAN MASSA
          ========================================================================= */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4 font-mono">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">04</span>
            Rute Pergerakan Massa
          </h2>
          <span className="text-xs text-red-400 font-bold flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" /> JALUR ARTERI AKTIF
          </span>
        </div>

        <div className="bg-[#0b1222] border border-red-900/60 rounded-xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span>{MOVEMENT_ROUTE_DATA.label}</span>
          </div>

          <div className="text-xs text-zinc-300 font-sans p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 leading-relaxed">
            <strong>Koridor Rute:</strong> {MOVEMENT_ROUTE_DATA.teks}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px] pt-1">
            {MOVEMENT_ROUTE_DATA.titik.map((t, idx) => (
              <div key={idx} className="p-2 sm:p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-900 text-red-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-zinc-200 truncate">{t.n}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-amber-300/90 italic pt-1 border-t border-zinc-800/80">
            <strong>Catatan Analis:</strong> {MOVEMENT_ROUTE_DATA.catatan}
          </p>
        </div>
      </div>

      {/* =========================================================================
          05. TABEL EKSPOSUR KORPORASI (Khusus Gedung Bisnis & Kantor Swasta/BUMN)
          ========================================================================= */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4 font-mono">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">05</span>
              Eksposur Korporasi
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              26 aksi menyasar kantor perusahaan dan gedung komersial (Wisma 46, SCBD, Menara Batavia, Sinarmas Land, dll.)
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold">
            {CORPORATE_EXPOSURES.length} TITIK GEDUNG TERPAPAR
          </span>
        </div>

        {/* Tampilan Desktop & Tablet (Layar Lebar) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0b1222] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">WAKTU</th>
                <th className="py-2.5 px-3">ENTITAS / GEDUNG SASARAN</th>
                <th className="py-2.5 px-3">WILAYAH</th>
                <th className="py-2.5 px-3">ORGANISASI PENGUNJUK RASA</th>
                <th className="py-2.5 px-3 text-right">MASSA</th>
                <th className="py-2.5 px-3">POKOK TUNTUTAN</th>
                <th className="py-2.5 px-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-[#070b14]">
              {CORPORATE_EXPOSURES.map((exp) => (
                <tr 
                  key={exp.id} 
                  className="hover:bg-zinc-900/60 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedReportId(exp.id);
                    setFocusedCoords(exp.coordinates);
                  }}
                >
                  <td className="py-2.5 px-3 whitespace-nowrap text-cyan-400 font-bold">
                    {exp.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                    {exp.targetEntity}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400 whitespace-nowrap">
                    {exp.region}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300 whitespace-nowrap">
                    {exp.partiesInvolved}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-400 whitespace-nowrap">
                    &plusmn;{exp.crowdCountEstimate} org
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300 max-w-xs truncate">
                    {exp.issueSummary}
                  </td>
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDetailDossierReport(exp)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-950 text-cyan-300 border border-zinc-700 transition-colors"
                      title="Lihat Detail Lengkap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tampilan Khusus Mobile Phone (Daftar Kartu Taktis Rapi) */}
        <div className="block md:hidden space-y-2.5">
          {CORPORATE_EXPOSURES.map((exp) => (
            <div
              key={exp.id}
              onClick={() => {
                setSelectedReportId(exp.id);
                setFocusedCoords(exp.coordinates);
              }}
              className="p-3 bg-[#070b14] border border-zinc-800 rounded-xl space-y-2 cursor-pointer hover:border-amber-600/70 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-xs truncate">
                    {exp.targetEntity}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {exp.region}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 whitespace-nowrap">
                  {exp.timestamp}
                </span>
              </div>

              <div className="text-[11px] text-zinc-300 leading-snug">
                <span className="text-zinc-500 font-bold">Ormas:</span> {exp.partiesInvolved}
              </div>

              <div className="text-[10px] text-zinc-400 bg-zinc-900/80 p-2 rounded-lg border border-zinc-800 leading-relaxed font-sans">
                {exp.issueSummary}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px]">
                <span className="font-bold text-amber-400">
                  Massa: &plusmn;{exp.crowdCountEstimate} orang
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailDossierReport(exp);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-cyan-950 text-cyan-300 font-semibold border border-zinc-700 flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Detail</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          06. KLASTER TITIK BERBEDA (Aksi Menumpuk di Titik yang Sama)
          ========================================================================= */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4 font-mono">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">06</span>
              Klaster Titik Berbeda
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sebaran 36 klaster titik konsentrasi di mana aksi unjuk rasa menumpuk pada lokasi gedung atau koridor yang sama
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
            {RAW_UNRAS_DATA.klaster?.length || 36} KLASTER TERIDENTIFIKASI
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 max-h-[380px] overflow-y-auto pr-1">
          {RAW_UNRAS_DATA.klaster?.map((kl: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setFocusedCoords({ latitude: kl.lat, longitude: kl.lon })}
              className="p-3 rounded-xl bg-[#0b1222] border border-zinc-800 hover:border-cyan-500/80 transition-all cursor-pointer group space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-white text-xs line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {idx + 1}. {kl.n}
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap ${
                  kl.tg === 'TINGGI'
                    ? 'bg-red-950/80 text-red-400 border border-red-800'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                }`}>
                  {kl.tg}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="truncate max-w-[150px]">{kl.w}</span>
                <span className="text-cyan-400 font-bold">{kl.a} aksi</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                <span className="text-amber-400 font-semibold">&plusmn;{kl.m} orang</span>
                <span className="group-hover:text-cyan-400 transition-colors">Fokus Peta &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          07 & 08: KONTEKS H-1 & GROUND TRUTH + SINYAL LUAR DAERAH
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 font-mono">
        {/* Modul 07: Konteks H-1 */}
        <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-3">
          <div className="border-b border-zinc-800 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">07</span>
              Konteks H-1 &mdash; 4 November 2026
            </h2>
            <span className="text-[10px] text-zinc-400 italic">Verifikasi Lapangan</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Dasar penilaian bahwa rengiat adalah rencana, bukan realisasi. 4 dari 4 rencana aksi Jakarta Pusat dibatalkan:
          </p>

          <div className="space-y-2 text-xs">
            {CANCELLATIONS_H1_DATA.map((c, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#0b1222] border border-zinc-800 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white">{c.o}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Lokasi: {c.l} (Korlap: {c.k})</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-bold text-[10px]">
                  {c.s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modul 08: Sinyal Belum Terkonfirmasi & Konteks Luar Jakarta */}
        <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-3">
          <div className="border-b border-zinc-800 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">08</span>
              Sinyal Belum Terkonfirmasi &amp; Konteks Luar
            </h2>
            <span className="text-[10px] text-cyan-400 font-bold">EARLY WARNING</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Perlu pemantauan potensi eskalasi di luar wilayah DKI Jakarta:
          </p>

          <div className="space-y-2 text-xs">
            {UNCONFIRMED_SIGNALS_DATA.slice(0, 2).map((s, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#0b1222] border border-zinc-800">
                <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                  <span>{s.t}</span>
                  <span className="text-amber-400 font-semibold">{s.st}</span>
                </div>
                <div className="font-bold text-white">{s.s}</div>
                <div className="text-[11px] text-zinc-400 mt-1">{s.d}</div>
              </div>
            ))}

            <div className="p-2.5 rounded-xl bg-[#0b1222] border border-zinc-800">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Rencana Unras Makassar (7 Titik)</span>
                <span className="text-[10px] text-cyan-400">Sulawesi Selatan</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                Fokus isu: PT Yin Jing Internasional (ketenagakerjaan), Pertamina Masjid Raya (BBM bersubsidi), &amp; Pengadilan Negeri Makassar.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          09. REKOMENDASI OPERASIONAL TINGKAT DIREKSI
          ========================================================================= */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-xl space-y-4">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-mono">
            <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">09</span>
            Rekomendasi Operasional Tingkat Direksi
          </h2>
          <span className="text-xs font-mono text-cyan-400 font-bold">ANALISIS MITIGASI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {EXECUTIVE_RECOMMENDATIONS.map((rec) => (
            <div key={rec.id} className="p-3.5 sm:p-4 rounded-xl bg-[#0b1222] border border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                {rec.category}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {rec.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          10. BATASAN DATA & JEJAK SUMBER
          ========================================================================= */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-2 font-mono text-xs text-zinc-400">
        <div className="border-b border-zinc-800 pb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800">10</span>
            Batasan Data &amp; Jejak Sumber
          </h2>
          <span className="text-[10px] text-zinc-500">AUDIT TRAIL</span>
        </div>

        <p className="leading-relaxed">
          <strong>Batasan yang wajib dibaca sebelum dokumen ini dipakai sebagai dasar keputusan:</strong> Rengiat adalah rencana, bukan realisasi. Pada 4 November 2026, 4 dari 4 rencana aksi Jakarta Pusat dibatalkan. Tingkat realisasi 5 November tidak dapat diprediksi dari data ini. Seluruh angka massa adalah agregat angka perkiraan pelapor rengiat.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex-wrap gap-2">
          <span>Logged by: <strong>Aryaa (ARYAA-KOMANDO)</strong></span>
          <span>Source: <strong>MJ-Sentinel Intelligence Heuristic Engine v3.0</strong></span>
          <span>SHA-256 Hash: <code className="text-cyan-400">e89a3f...d194c2</code></span>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: SIMULATOR AI NEWS EXTRACTION
          ========================================================================= */}
      {isInputModalOpen && !isReadOnly && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#090e1a] border border-cyan-500/80 w-full max-w-3xl rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <h3 className="font-mono text-sm sm:text-base font-bold text-white uppercase">
                  SIMULATOR AI NEWS EXTRACTION // MJ-SENTINEL INPUT LAYER
                </h3>
              </div>
              <button 
                onClick={() => setIsInputModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets 1-Klik */}
            <div>
              <label className="block text-[11px] font-mono text-cyan-400 uppercase font-semibold mb-1.5">
                PRESET SIMULASI INSTAN (KLIK UNTUK MENGISI FORM SECARA OTOMATIS):
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SIMULATION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-cyan-950 border border-zinc-800 hover:border-cyan-600 text-zinc-300 hover:text-cyan-300 transition-all text-left"
                  >
                    #{idx + 1} {preset.title.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Form Input */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">
                  URL SUMBER BERITA (OPSIONAL):
                </label>
                <input
                  type="text"
                  placeholder="https://cnnindonesia.com/nasional/demo-buruh-gedung-dpr"
                  value={sourceUrlInput}
                  onChange={(e) => setSourceUrlInput(e.target.value)}
                  className="w-full bg-[#05070c] border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">
                  TEKS / LAPORAN BERITA MENTAH (RAW NEWS TEXT):
                </label>
                <textarea
                  rows={4}
                  placeholder="Tempelkan paragraf berita unjuk rasa, patroli, atau ancaman keamanan di sini..."
                  value={rawNewsInput}
                  onChange={(e) => setRawNewsInput(e.target.value)}
                  className="w-full bg-[#05070c] border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleRunAiExtraction}
                  disabled={isExtracting}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold flex items-center gap-2 shadow-glow-cyan disabled:opacity-50"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{isExtracting ? 'MENGEKSTRAKSI DATA...' : 'EKSTRAKSI OTOMATIS OLEH AI'}</span>
                </button>
              </div>
            </div>

            {/* Hasil Ekstraksi Preview */}
            {extractionResult && (
              <div className="bg-[#05070c] border border-emerald-600/70 rounded-xl p-4 font-mono text-xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>DATA BERHASIL DIEKSTRAKSI (HASIL REKOMENDASI AI):</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">
                    {extractionResult.reportCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">GEDUNG / OBJEK SASARAN:</span>
                    <div className="text-white font-bold">{extractionResult.targetEntity}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">WILAYAH & KOORDINAT:</span>
                    <div className="text-cyan-300">
                      {extractionResult.region} [{extractionResult.coordinates.latitude.toFixed(4)}, {extractionResult.coordinates.longitude.toFixed(4)}]
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">ESTIMASI MASSA / DAMPAK:</span>
                    <div className="text-amber-300 font-bold">{extractionResult.scaleEstimate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">TINGKAT ANCAMAN & STATUS:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-red-400">[{extractionResult.threatLevel}]</span>
                      <span className="text-zinc-300">{extractionResult.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => setExtractionResult(null)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCommitExtractedReport}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>SETUJUI & PLOT KE PETA TAKTIS</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: BAGIKAN LINK PUBLIK
          ========================================================================= */}
      {isShareModalOpen && !isReadOnly && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#090e1a] border border-cyan-500 w-full max-w-lg rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white uppercase text-xs sm:text-sm">
                  BAGIKAN LAPORAN SITUASIONAL (PUBLIC SHARE)
                </h3>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              Tautan publik ini dapat diakses oleh siapa saja (Direksi, Klien, atau Pimpinan) <strong>TANPA MEMERLUKAN LOGIN ATAU REGISTRASI</strong>. Seluruh tombol aksi admin otomatis disembunyikan.
            </p>

            <div className="p-3 bg-[#05070c] border border-zinc-800 rounded-xl space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase font-semibold">
                URL BERBAGI PUBLIK BERISI TOKEN:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedShareUrl}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-cyan-300 font-mono text-[11px]"
                />
                <button
                  onClick={handleCopyPublicLink}
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  {copiedShareLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleShareToWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-4 h-4" />
                <span>BAGIKAN KE WHATSAPP (PESAN RESMI)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DETAIL DOSSIER REPORT
          ========================================================================= */}
      {detailDossierReport && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#090e1a] border border-zinc-700 w-full max-w-2xl rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">
                  DOSSIER INTELIJEN // {detailDossierReport.reportCode}
                </span>
                <h3 className="font-bold text-white text-sm sm:text-base mt-0.5">
                  {detailDossierReport.targetEntity}
                </h3>
              </div>
              <button 
                onClick={() => setDetailDossierReport(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 bg-[#05070c] border border-zinc-800 rounded-xl space-y-2">
                <div className="flex justify-between text-zinc-400 font-mono text-[10px] sm:text-[11px] flex-wrap gap-1">
                  <span>Waktu: <strong className="text-white">{detailDossierReport.timestamp}</strong></span>
                  <span>Wilayah: <strong className="text-white">{detailDossierReport.region}</strong></span>
                </div>
                <div className="flex justify-between text-zinc-400 font-mono text-[10px] sm:text-[11px] flex-wrap gap-1">
                  <span>Massa: <strong className="text-amber-400">{detailDossierReport.scaleEstimate}</strong></span>
                  <span>Ancaman: <strong className="text-red-400">{detailDossierReport.threatLevel}</strong></span>
                </div>
              </div>

              <div>
                <strong className="text-zinc-300 font-mono text-[11px] uppercase block mb-1">
                  Organisasi / Pihak Terlibat:
                </strong>
                <p className="text-white bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                  {detailDossierReport.partiesInvolved}
                </p>
              </div>

              <div>
                <strong className="text-zinc-300 font-mono text-[11px] uppercase block mb-1">
                  Pokok Isu &amp; Tuntutan:
                </strong>
                <p className="text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800 leading-relaxed">
                  {detailDossierReport.issueSummary}
                </p>
              </div>

              <div>
                <strong className="text-zinc-300 font-mono text-[11px] uppercase block mb-1">
                  Uraian Lengkap Laporan / Berita:
                </strong>
                <p className="text-zinc-400 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800 leading-relaxed">
                  {detailDossierReport.fullContent || 'Tidak ada uraian tambahan.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setDetailDossierReport(null)}
                className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold"
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
