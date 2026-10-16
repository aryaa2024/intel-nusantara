import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Eye, 
  Terminal, 
  Share2, 
  Tag,
  Crosshair,
  Edit3,
  Calendar,
  MapPin,
  Printer,
  Copy,
  Check,
  X,
  Layers,
  LayoutList,
  LayoutGrid,
  ShieldCheck,
  AlertCircle,
  Flame,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogEntry, SeverityLevel, IncidentCategory, IncidentStatus, ClearanceLevel } from '../types';

interface DailyLogbookProps {
  initialPreload?: Partial<LogEntry> | null;
  onClearPreload?: () => void;
}

// Data awal insiden logbook berstandar SOC dengan jenis kejadian resmi
const DEFAULT_LOG_ENTRIES: LogEntry[] = [
  {
    id: 'log-001',
    incidentId: 'INC-2026-9041',
    timestamp: '16/10/2026 14:32 WIB',
    incidentDate: '2026-10-16',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Deteksi Beaconing Trojan APT-38 ke Server Command & Control (C2)',
    category: 'Cyber Attack',
    severity: 'CRITICAL',
    status: 'CONTAINED',
    classification: 'TOP SECRET',
    location: 'Sektor Finansial / DKI Jakarta',
    description: 'Aktivitas transmisi data terenkripsi mencurigakan dari host internal workstation finance ke IP luar negeri dengan interval 45 detik. Analisis dump memori menemukan injeksi process hollowing pada explorer.exe.',
    actionTaken: 'Isolasi host via endpoint sensor, pencabutan token sesi LDAP, dan blocking IP C2 pada perimeter firewall nasional.',
    iocIndicators: ['185.220.101.45', 'c2-gate-redacted.onion', 'MD5: 8f9b23e1a0b3f52c', 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    createdAt: '2026-10-16T14:32:00+07:00'
  },
  {
    id: 'log-002',
    incidentId: 'INC-2026-9039',
    timestamp: '16/10/2026 09:15 WIB',
    incidentDate: '2026-10-16',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Intersepsi Kapal Penyelundupan Senpi Ilegal di Jalur ALKI I',
    category: 'Crime',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    classification: 'SECRET',
    location: 'Perairan Selat Malaka / Kep. Riau',
    description: 'Berdasarkan sinyal maritim gelap (dark ship tanpa AIS), tim gabungan patroli laut mencegat kapal kayu KM Bintang Samudera yang mengangkut 28 pucuk senjata api otomatis tanpa izin.',
    actionTaken: 'Pengamanan 4 tersangka, penyitaan barang bukti ke pangkalan AL Batam, dan koordinasi dengan intelijen keimigrasian.',
    iocIndicators: ['MMSI: 525000000 (Spoofed)', 'Kapal: KM Bintang Samudera', 'Senjata: 28 Unit Kaliber 5.56mm'],
    createdAt: '2026-10-16T09:15:00+07:00'
  },
  {
    id: 'log-003',
    incidentId: 'INC-2026-9035',
    timestamp: '15/10/2026 16:40 WIB',
    incidentDate: '2026-10-15',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Anomali Aliran Dana Kripto Monero Terkait Sel Ekstremisme Solo Raya',
    category: 'Terrorism Suspected',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    classification: 'TOP SECRET',
    location: 'Solo Raya / Jawa Tengah',
    description: 'Pemantauan saluran komunikasi gelap menemukan transaksi penarikan aset kripto anonim senilai 4.2 XMR yang diduga dialokasikan untuk logistik bahan peledak improvisasi.',
    actionTaken: 'Eskalasi target ke unit penindakan Densus 88 AT dan profiling alamat dompet penerima di jaringan darkweb.',
    iocIndicators: ['XMR Wallet: 888tNk4k2...9vLq', 'Telegram: @merdeka_cyber_cell', 'IP VPN: 45.154.255.89'],
    createdAt: '2026-10-15T16:40:00+07:00'
  },
  {
    id: 'log-004',
    incidentId: 'INC-2026-9028',
    timestamp: '15/10/2026 07:20 WIB',
    incidentDate: '2026-10-15',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Erupsi Eksplosif Gunung Marapi & Ancaman Lahar Dingin Pemukiman',
    category: 'Hazard',
    severity: 'HIGH',
    status: 'CONTAINED',
    classification: 'CONFIDENTIAL',
    location: 'Bukittinggi / Sumatera Barat',
    description: 'Lontaran abu vulkanik mencapai ketinggian 1.500 m disertai getaran tremor terus menerus. Akses jalan provinsi tertutup material abu tebal berpotensi memicu lahar hujan.',
    actionTaken: 'Aktivasi sirine peringatan dini, evakuasi 3.200 warga dalam radius 4.5 km, serta pembentukan posko darurat BNPB.',
    iocIndicators: ['Radius Bahaya: 4.5 KM', 'Status PVMBG: Siaga Level III'],
    createdAt: '2026-10-15T07:20:00+07:00'
  },
  {
    id: 'log-005',
    incidentId: 'INC-2026-9020',
    timestamp: '14/10/2026 13:10 WIB',
    incidentDate: '2026-10-14',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Aksi Massa Terprovokasi Narasi Deepfake di Depan Kantor Pemerintahan Daerah',
    category: 'Civil Unrest',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    classification: 'CONFIDENTIAL',
    location: 'Jayapura / Papua',
    description: 'Penyebaran video rekayasa AI (Deepfake) memicu konsentrasi massa sekitar 400 orang yang menuntut klarifikasi pernyataan pejabat pertahanan yang dipalsukan.',
    actionTaken: 'Penerbitan rilis verifikasi fakta cepat oleh Satgas Siber, dialog persuasif tokoh adat, dan pembubaran damai.',
    iocIndicators: ['Video Hash: 4a2d81f9e9c', 'Akun Penyebar: @nusantara_hoax_lab'],
    createdAt: '2026-10-14T13:10:00+07:00'
  },
  {
    id: 'log-006',
    incidentId: 'INC-2026-9012',
    timestamp: '13/10/2026 11:00 WIB',
    incidentDate: '2026-10-13',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Eksploitasi Celah Zero-Day pada VPN Gateway Kementerian Komunikasi',
    category: 'Cyber Attack',
    severity: 'HIGH',
    status: 'RESOLVED',
    classification: 'SECRET',
    location: 'Kementerian Komunikasi / Jakarta',
    description: 'Ditemukan anomali bypass autentikasi pada perimeter router gateway. Penyerang berupaya mengekstraksi berkas konfigurasi internal jaringan instansi.',
    actionTaken: 'Penerapan hotfix darurat vendor router, pembaruan SSL certificate, serta audit paket traffic historis.',
    iocIndicators: ['194.38.20.12', 'CVE-2026-4419', 'UserAgent: Mozilla/5.0 (PwnBot-Scanner)'],
    createdAt: '2026-10-13T11:00:00+07:00'
  }
];

export const DailyLogbook: React.FC<DailyLogbookProps> = ({ 
  initialPreload,
  onClearPreload 
}) => {
  const { currentUser, getOperatorStorage, setOperatorStorage } = useAuth();
  
  // Storage terisolasi per akun operator
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    return getOperatorStorage<LogEntry[]>('daily_logbook', DEFAULT_LOG_ENTRIES);
  });

  // Toggle Tampilan: "list" (Tabel) vs "detail" (Kartu Laporan Interaktif)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingLog, setViewingLog] = useState<LogEntry | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilterRange, setDateFilterRange] = useState<'ALL' | 'TODAY' | '7_DAYS' | 'SPECIFIC'>('ALL');
  const [specificDate, setSpecificDate] = useState<string>('');

  // Form Input Laporan Harian State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<IncidentCategory>('Cyber Attack');
  const [formSeverity, setFormSeverity] = useState<SeverityLevel>('HIGH');
  const [formStatus, setFormStatus] = useState<IncidentStatus>('INVESTIGATING');
  const [formClassification, setFormClassification] = useState<ClearanceLevel>('SECRET');
  const [formLocation, setFormLocation] = useState('Pusat Komando Jakarta');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formTime, setFormTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [formDescription, setFormDescription] = useState('');
  const [formActionTaken, setFormActionTaken] = useState('');
  const [formIocs, setFormIocs] = useState('');

  // Sinkronisasi ke LocalStorage terisolasi setiap kali data logs berubah
  useEffect(() => {
    setOperatorStorage('daily_logbook', logs);
  }, [logs]);

  // Preload data jika dialihkan dari modul lain (News Aggregator / AI Threat Analysis)
  useEffect(() => {
    if (initialPreload) {
      setFormTitle(initialPreload.title || '');
      setFormDescription(initialPreload.description || '');
      setFormActionTaken(initialPreload.actionTaken || '');
      setFormSeverity(initialPreload.severity || 'HIGH');
      setFormLocation(initialPreload.location || 'Wilayah Nasional');
      
      if (initialPreload.category) {
        setFormCategory(initialPreload.category);
      }
      setIsModalOpen(true);
      if (onClearPreload) onClearPreload();
    }
  }, [initialPreload]);

  // Handler Submit Laporan Baru
  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const parsedIOCs = formIocs
      .split('\n')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const formattedTimestamp = `${formDate.split('-').reverse().join('/')} ${formTime} WIB`;

    const newEntry: LogEntry = {
      id: `log-${Date.now()}`,
      incidentId: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: formattedTimestamp,
      incidentDate: formDate,
      operatorId: currentUser?.id || 'op-anon',
      operatorCallsign: currentUser?.callsign || 'OPERATOR-01',
      title: formTitle.trim(),
      category: formCategory,
      severity: formSeverity,
      status: formStatus,
      classification: formClassification,
      location: formLocation.trim() || 'Wilayah Terpantau',
      description: formDescription.trim(),
      actionTaken: formActionTaken.trim() || 'Monitoring status dan koordinasi tim lapangan.',
      iocIndicators: parsedIOCs.length > 0 ? parsedIOCs : ['N/A - Belum ada indikator spesifik'],
      createdAt: new Date().toISOString()
    };

    setLogs([newEntry, ...logs]);
    
    // Reset form
    setFormTitle('');
    setFormDescription('');
    setFormActionTaken('');
    setFormIocs('');
    setIsModalOpen(false);
  };

  // Handler Hapus Laporan
  const handleDeleteLog = (id: string) => {
    if (window.confirm('Hapus entri laporan intelijen ini secara permanen dari basis data operasional?')) {
      setLogs(logs.filter(l => l.id !== id));
      if (viewingLog?.id === id) setViewingLog(null);
    }
  };

  // Handler Ganti Status Insiden Cepat
  const handleStatusChange = (id: string, newStatus: IncidentStatus) => {
    setLogs(logs.map(log => log.id === id ? { ...log, status: newStatus } : log));
    if (viewingLog?.id === id) {
      setViewingLog({ ...viewingLog, status: newStatus });
    }
  };

  // Ekspor Ringkasan Laporan ke Format Teks (TXT SITREP)
  const handleExportTextSummary = () => {
    const header = `================================================================================
INTEL NUSANTARA COMMAND - DAILY SECURITY INTELLIGENCE LOGBOOK
SITREP CLASSIFICATION : TOP SECRET // NOFORN
OPERATOR CALLSIGN      : ${currentUser?.callsign || 'GARUDA-01'} (BADGE: ${currentUser?.badgeNumber || 'IN-8890'})
OPERATIONAL UNIT       : ${currentUser?.unit || 'Pusat Operasi Intelijen Siber & Pertahanan'}
EXPORT TIMESTAMP       : ${new Date().toLocaleString('id-ID')} WIB
TOTAL INCIDENTS LOGGED : ${filteredLogs.length}
================================================================================\n\n`;

    const body = filteredLogs.map((log, index) => {
      return `[ENTRY #${index + 1}] ID: ${log.incidentId} | TINGKAT: ${log.severity} | STATUS: ${log.status}
WAKTU/TANGGAL : ${log.timestamp}
LOKASI/WILAYAH: ${log.location}
JENIS KEJADIAN: ${log.category}
KLASIFIKASI   : ${log.classification}
JUDUL LAPORAN : ${log.title}
DESKRIPSI KRONOLOGI:
${log.description}

TINDAKAN MITIGASI/PENANGGULANGAN:
${log.actionTaken}

INDIKATOR KOMPROMI (IOCs):
${log.iocIndicators && log.iocIndicators.length > 0 ? log.iocIndicators.map(i => `  • ${i}`).join('\n') : '  • Tidak ada'}
--------------------------------------------------------------------------------`;
    }).join('\n\n');

    const fullText = header + body;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SITREP-INTEL-NUSANTARA-${currentUser?.callsign || 'SOC'}-${formDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Salin SITREP ke Clipboard
  const handleCopySitrep = () => {
    const textSummary = `[INTEL NUSANTARA - EXECUTIVE SITREP BRIEFING]
TOTAL INCIDENTS: ${filteredLogs.length} LAPORAN
OPERATOR: ${currentUser?.callsign} (${currentUser?.badgeNumber})

` + filteredLogs.map(l => `• [${l.incidentId}] [${l.severity}] ${l.category.toUpperCase()} - ${l.title} (${l.location}) - Status: ${l.status}`).join('\n');

    navigator.clipboard.writeText(textSummary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Ekspor JSON
  const handleExportJSON = () => {
    const reportData = {
      system: 'INTEL NUSANTARA SOC COMMAND',
      operator: currentUser?.callsign,
      badge: currentUser?.badgeNumber,
      exportedAt: new Date().toISOString(),
      totalEntries: filteredLogs.length,
      entries: filteredLogs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LOGBOOK-${currentUser?.callsign || 'SOC'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Logika Filter Laporan (Tanggal, Severity, Jenis Kejadian, Status, Kata Kunci)
  const filteredLogs = logs.filter(log => {
    // 1. Filter Severity
    const matchSeverity = severityFilter === 'ALL' || log.severity === severityFilter;

    // 2. Filter Status
    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;

    // 3. Filter Jenis Kejadian
    const matchCategory = categoryFilter === 'ALL' || 
      log.category.toLowerCase() === categoryFilter.toLowerCase();

    // 4. Filter Tanggal
    let matchDate = true;
    const todayStr = new Date().toISOString().slice(0, 10);
    if (dateFilterRange === 'TODAY') {
      matchDate = log.incidentDate === todayStr;
    } else if (dateFilterRange === '7_DAYS') {
      const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(log.incidentDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      matchDate = diffDays <= 7;
    } else if (dateFilterRange === 'SPECIFIC' && specificDate) {
      matchDate = log.incidentDate === specificDate;
    }

    // 5. Filter Kata Kunci
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      log.title.toLowerCase().includes(q) ||
      log.incidentId.toLowerCase().includes(q) ||
      log.location.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      log.category.toLowerCase().includes(q) ||
      (log.iocIndicators && log.iocIndicators.some(ioc => ioc.toLowerCase().includes(q)));

    return matchSeverity && matchStatus && matchCategory && matchDate && matchQuery;
  });

  // Helper Badge Severity: LOW (Hijau), MEDIUM (Kuning), HIGH (Oranye), CRITICAL (Merah)
  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-600 shadow-glow-red flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-orange-950/80 text-orange-400 border border-orange-600 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-yellow-950/80 text-yellow-400 border border-yellow-600 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-600 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> LOW
          </span>
        );
    }
  };

  // Helper Badge Jenis Kejadian
  const getCategoryBadge = (category: IncidentCategory | string) => {
    switch (category) {
      case 'Crime':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck className="w-3 h-3 text-zinc-400" /> CRIME
          </span>
        );
      case 'Hazard':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/70 text-amber-300 border border-amber-800 flex items-center gap-1 whitespace-nowrap">
            <Flame className="w-3 h-3 text-amber-400" /> HAZARD
          </span>
        );
      case 'Civil Unrest':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-950/70 text-purple-300 border border-purple-800 flex items-center gap-1 whitespace-nowrap">
            <Radio className="w-3 h-3 text-purple-400" /> CIVIL UNREST
          </span>
        );
      case 'Cyber Attack':
      case 'MALWARE_ANALYSIS':
      case 'NETWORK_INTRUSION':
      case 'DDOS_ANOMALY':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800 flex items-center gap-1 whitespace-nowrap">
            <Terminal className="w-3 h-3 text-cyan-400" /> CYBER ATTACK
          </span>
        );
      case 'Terrorism Suspected':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950/90 text-red-300 border border-red-700 shadow-glow-red flex items-center gap-1 whitespace-nowrap animate-pulse">
            <ShieldAlert className="w-3 h-3 text-red-400" /> TERRORISM SUSPECTED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            {category}
          </span>
        );
    }
  };

  // Helper Badge Status
  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-900/50 text-red-300 border border-red-700 font-bold">OPEN</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-900/50 text-yellow-300 border border-yellow-700 font-bold animate-pulse">INVESTIGATING</span>;
      case 'CONTAINED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-900/50 text-blue-300 border border-blue-700 font-bold">CONTAINED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/50 text-emerald-300 border border-emerald-700 font-bold">RESOLVED</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-900/50 text-purple-300 border border-purple-700 font-bold">ESCALATED</span>;
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Header Card */}
      <div className="bg-[#090e1a] border border-zinc-800/90 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono flex-wrap">
            <span className="p-2 rounded-xl bg-red-950 border border-red-700/60 text-red-500 shadow-glow-red">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
              SOC SECURITY INTELLIGENCE LOGBOOK
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-400 font-mono">
              OPERATOR AKTIF: <span className="text-white font-bold">{currentUser?.callsign}</span> ({currentUser?.badgeNumber})
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> ISOLASI DATA AKTIF
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mt-2">
            Pencatatan Harian Situasi Keamanan & Kejadian Intelijen
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Format resmi Security Operations Center (SOC) mencakup Crime, Hazard, Civil Unrest, Cyber Attack, dan Terrorism Suspected dengan isolasi lokal per akun.
          </p>
        </div>

        {/* Action Buttons: Export SITREP, Print Summary, New Report */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export Group */}
          <button
            onClick={handleExportTextSummary}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Unduh laporan ringkasan intelijen format teks resmi (SITREP)"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>EXPORT TXT</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Buka pratinjau lembar cetak SITREP resmi"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>RINGKASAN CETAK</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-mono text-xs font-bold transition-all shadow-glow-red flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>INPUT LAPORAN HARIAN</span>
          </button>
        </div>
      </div>

      {/* Control Bar: View Toggle (List vs Detail) & Filter / Search Controls */}
      <div className="bg-[#0b101c] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg font-mono">
        
        {/* Row 1: Search & View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari ID Insiden (INC-xxxx), Judul Kejadian, Lokasi/Wilayah, atau Kronologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-black/60 border border-zinc-700/80 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
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

          {/* Toggle View Mode: List View (Tabel) vs Detail View (Kartu Interaktif) */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-800 self-start md:self-auto flex-shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-red-600 text-white shadow-glow-red'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>LIST VIEW (TABEL)</span>
            </button>

            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'detail'
                  ? 'bg-red-600 text-white shadow-glow-red'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>DETAIL VIEW (KARTU)</span>
            </button>
          </div>
        </div>

        {/* Row 2: Comprehensive Multi-Filters (Tanggal, Jenis Kejadian, Severity, Status) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/80 text-xs">
          
          {/* 1. Filter Tanggal & Date Picker */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-red-500" /> TANGGAL KEJADIAN:
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={dateFilterRange}
                onChange={(e) => setDateFilterRange(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600"
              >
                <option value="ALL">SEMUA TANGGAL</option>
                <option value="TODAY">HARI INI</option>
                <option value="7_DAYS">7 HARI TERAKHIR</option>
                <option value="SPECIFIC">PILIH TANGGAL SPESIFIK...</option>
              </select>
            </div>
            {dateFilterRange === 'SPECIFIC' && (
              <input
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                className="w-full mt-1.5 px-2.5 py-1.5 bg-zinc-950 border border-red-700 rounded-lg text-zinc-100 text-xs focus:outline-none"
              />
            )}
          </div>

          {/* 2. Filter Jenis Kejadian */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-zinc-400" /> JENIS KEJADIAN:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">SEMUA JENIS KEJADIAN</option>
              <option value="Crime">CRIME (KRIMINALITAS)</option>
              <option value="Hazard">HAZARD (BENCANA ALAM)</option>
              <option value="Civil Unrest">CIVIL UNREST (AKSI MASSA)</option>
              <option value="Cyber Attack">CYBER ATTACK (SERANGAN SIBER)</option>
              <option value="Terrorism Suspected">TERRORISM SUSPECTED</option>
            </select>
          </div>

          {/* 3. Filter Tingkat Ancaman (Threat Severity) */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" /> THREAT SEVERITY:
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">SEMUA TINGKAT ANCAMAN</option>
              <option value="CRITICAL">CRITICAL (MERAH)</option>
              <option value="HIGH">HIGH (ORANYE)</option>
              <option value="MEDIUM">MEDIUM (KUNING)</option>
              <option value="LOW">LOW (HIJAU)</option>
            </select>
          </div>

          {/* 4. Filter Status Siklus Insiden */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> STATUS SIKLUS:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">SEMUA STATUS</option>
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="CONTAINED">CONTAINED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="ESCALATED">ESCALATED</option>
            </select>
          </div>

        </div>

        {/* Counter & Reset Filter */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/60">
          <span className="text-zinc-400">
            Menampilkan <span className="text-white font-bold">{filteredLogs.length}</span> dari {logs.length} catatan insiden operasional
          </span>
          {(searchQuery || categoryFilter !== 'ALL' || severityFilter !== 'ALL' || statusFilter !== 'ALL' || dateFilterRange !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
                setSeverityFilter('ALL');
                setStatusFilter('ALL');
                setDateFilterRange('ALL');
                setSpecificDate('');
              }}
              className="text-red-400 hover:text-red-300 underline font-bold"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN VIEW AREA (LIST VIEW vs DETAIL VIEW) */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center bg-[#090e1a] border border-zinc-800 rounded-2xl font-mono">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-base font-bold text-zinc-300">Tidak ada catatan laporan intelijen yang sesuai kriteria.</p>
          <p className="text-xs text-zinc-500 mt-1">Gunakan tombol "Input Laporan Harian" di atas untuk menambahkan laporan baru.</p>
        </div>
      ) : viewMode === 'list' ? (
        
        /* ---------------- LIST VIEW (TABEL TERSTRUKTUR STANDAR SOC) ---------------- */
        <div className="bg-[#090e1a] border border-zinc-800/90 rounded-2xl shadow-xl overflow-hidden font-mono">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0e1628] border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">ID Insiden</th>
                  <th className="py-3 px-4">Waktu & Tanggal</th>
                  <th className="py-3 px-4">Lokasi / Wilayah</th>
                  <th className="py-3 px-4">Jenis Kejadian</th>
                  <th className="py-3 px-4 min-w-[260px]">Judul Kejadian</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id}
                    onClick={() => setViewingLog(log)}
                    className="hover:bg-zinc-900/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-bold text-red-400 whitespace-nowrap">
                      {log.incidentId}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      <div className="text-zinc-200 font-semibold">{log.timestamp}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-zinc-300">
                        <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{log.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getCategoryBadge(log.category)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white group-hover:text-red-400 transition-colors">
                      <div className="line-clamp-1">{log.title}</div>
                      <div className="text-[10px] text-zinc-500 font-normal line-clamp-1 font-sans mt-0.5">
                        {log.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={log.status}
                        onChange={(e) => handleStatusChange(log.id, e.target.value as IncidentStatus)}
                        className="px-2 py-1 bg-black/60 border border-zinc-700 rounded-md text-[11px] text-zinc-200 focus:outline-none focus:border-red-500 font-bold"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="INVESTIGATING">INVESTIGATING</option>
                        <option value="CONTAINED">CONTAINED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="ESCALATED">ESCALATED</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingLog(log)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Lihat Rincian Laporan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Hapus Laporan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (

        /* ---------------- DETAIL VIEW (KARTU LAPORAN INTERAKTIF) ---------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setViewingLog(log)}
              className="bg-[#090e1a] hover:bg-[#0c1324] border border-zinc-800/90 hover:border-red-600/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Header Kartu */}
                <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                        {log.incidentId}
                      </span>
                      {getCategoryBadge(log.category)}
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {log.classification}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-0.5">
                      <Clock className="w-3 h-3 text-zinc-500" /> {log.timestamp}
                    </div>
                  </div>

                  <div>
                    {getSeverityBadge(log.severity)}
                  </div>
                </div>

                {/* Judul & Lokasi */}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                    {log.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>{log.location}</span>
                  </div>
                </div>

                {/* Deskripsi Kronologi */}
                <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
                  {log.description}
                </p>

                {/* IOCs Badge Preview */}
                {log.iocIndicators && log.iocIndicators.length > 0 && (
                  <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800/80 text-[11px] space-y-1">
                    <span className="text-zinc-500 font-bold block text-[10px]">INDIKATOR / ARTEFAK:</span>
                    <div className="text-zinc-300 truncate font-mono">
                      {log.iocIndicators.slice(0, 2).join(' | ')}
                      {log.iocIndicators.length > 2 && ` (+${log.iocIndicators.length - 2} lainnya)`}
                    </div>
                  </div>
                )}

                {/* Mitigasi / Tindakan */}
                <div className="p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 font-sans">
                  <span className="text-emerald-400 font-bold font-mono">PENANGGULANGAN: </span>
                  <span className="line-clamp-2">{log.actionTaken}</span>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div 
                className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400">Status:</span>
                  <select
                    value={log.status}
                    onChange={(e) => handleStatusChange(log.id, e.target.value as IncidentStatus)}
                    className="px-2 py-0.5 bg-black/70 border border-zinc-700 rounded-lg text-[11px] text-zinc-200 focus:outline-none focus:border-red-500 font-bold"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="CONTAINED">CONTAINED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="ESCALATED">ESCALATED</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingLog(log)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold"
                  >
                    Rincian
                  </button>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 rounded-lg"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. MODAL INPUT LAPORAN HARIAN (SOC STANDARD FORM) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b101c] border border-red-600/70 rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl font-mono relative my-8 text-zinc-200 max-h-[90vh] overflow-y-auto">
            
            {/* Header Form */}
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-red-950 border border-red-700/80 text-red-500 shadow-glow-red">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    FORM INPUT LAPORAN INTELIJEN HARIAN
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Operator Pencatat: <span className="text-red-400 font-bold">{currentUser?.callsign}</span> ({currentUser?.badgeNumber})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
              
              {/* Judul Kejadian */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                  Judul Kejadian / Insiden *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Intersepsi Penyelundupan Senjata Gelap di Perairan Selat Malaka"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 transition-colors font-mono"
                />
              </div>

              {/* Grid: Waktu/Tanggal & Lokasi/Wilayah */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                    Tanggal Kejadian *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                    Jam (WIB) *
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                    Lokasi / Wilayah *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Selat Malaka / Riau"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Grid: Jenis Kejadian & Klasifikasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                    Jenis Kejadian (Incident Type) *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as IncidentCategory)}
                    className="w-full px-3 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-bold"
                  >
                    <option value="Crime">CRIME (Kriminalitas / Pelanggaran Hukum)</option>
                    <option value="Hazard">HAZARD (Bahaya Alam / Bencana Lingkungan)</option>
                    <option value="Civil Unrest">CIVIL UNREST (Kerusuhan Sipil / Aksi Massa)</option>
                    <option value="Cyber Attack">CYBER ATTACK (Serangan Siber / Malware)</option>
                    <option value="Terrorism Suspected">TERRORISM SUSPECTED (Dugaan Terorisme)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                    Klasifikasi Kerahasiaan
                  </label>
                  <select
                    value={formClassification}
                    onChange={(e) => setFormClassification(e.target.value as ClearanceLevel)}
                    className="w-full px-3 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="TOP SECRET">TOP SECRET</option>
                    <option value="SECRET">SECRET</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                  </select>
                </div>
              </div>

              {/* Pilihan Threat Severity Level: LOW (Hijau), MEDIUM (Kuning), HIGH (Oranye), CRITICAL (Merah) */}
              <div>
                <label className="block text-zinc-300 font-bold mb-2 uppercase tracking-wider">
                  Tingkat Ancaman (Threat Severity Level) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { level: 'LOW' as const, label: 'LOW (HIJAU)', color: 'border-emerald-600 bg-emerald-950/40 text-emerald-400' },
                    { level: 'MEDIUM' as const, label: 'MEDIUM (KUNING)', color: 'border-yellow-600 bg-yellow-950/40 text-yellow-400' },
                    { level: 'HIGH' as const, label: 'HIGH (ORANYE)', color: 'border-orange-600 bg-orange-950/40 text-orange-400' },
                    { level: 'CRITICAL' as const, label: 'CRITICAL (MERAH)', color: 'border-red-600 bg-red-950/50 text-red-400 shadow-glow-red' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.level}
                      onClick={() => setFormSeverity(s.level)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                        formSeverity === s.level
                          ? `${s.color} ring-2 ring-white/20 font-black`
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        s.level === 'LOW' ? 'bg-emerald-400' :
                        s.level === 'MEDIUM' ? 'bg-yellow-400' :
                        s.level === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deskripsi Kronologi */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                  Deskripsi Kronologi Kejadian *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deskripsikan secara kronologis waktu kejadian, pihak terlibat, artefak yang ditemukan, dan eskalasi ancaman..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 font-sans focus:outline-none focus:border-red-600 text-xs leading-relaxed"
                />
              </div>

              {/* Tindakan Mitigasi / Penanggulangan */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                  Tindakan Penanggulangan / Mitigasi
                </label>
                <textarea
                  rows={2}
                  placeholder="Langkah taktis yang telah dilakukan oleh operator atau tim gabungan lapangan..."
                  value={formActionTaken}
                  onChange={(e) => setFormActionTaken(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 font-sans focus:outline-none focus:border-red-600 text-xs leading-relaxed"
                />
              </div>

              {/* Indikator Kompromi (IOCs) */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1.5 uppercase tracking-wider">
                  Indikator Kompromi (IOCs) / Entitas Pelaku (Opsional, pisahkan per baris)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh:&#10;192.168.1.100&#10;Kapal: KM Bintang Samudera&#10;Wallet: 0x889...&#10;MD5: a1b2c3d4"
                  value={formIocs}
                  onChange={(e) => setFormIocs(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 font-mono focus:outline-none focus:border-red-600 text-xs"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-glow-red flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>SIMPAN KE LOGBOOK OPERATOR</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 4. MODAL DETAIL VIEW DOSSIER LAPORAN */}
      {viewingLog && (
        <div 
          onClick={() => setViewingLog(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b101c] border border-red-600/70 rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl font-mono relative my-6 text-zinc-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800 gap-2">
              <div>
                <span className="text-[10px] px-2.5 py-0.5 bg-red-950 text-red-300 border border-red-700 rounded font-bold uppercase tracking-wider">
                  BERKAS LOGBOOK RESMI SOC • {viewingLog.incidentId}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-2 leading-snug">
                  {viewingLog.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingLog(null)}
                className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Informasi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">SEVERITY</span>
                <div className="mt-1">{getSeverityBadge(viewingLog.severity)}</div>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">JENIS KEJADIAN</span>
                <div className="mt-1">{getCategoryBadge(viewingLog.category)}</div>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">STATUS</span>
                <div className="mt-1">{getStatusBadge(viewingLog.status)}</div>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">OPERATOR</span>
                <span className="text-red-400 font-bold block mt-1">{viewingLog.operatorCallsign}</span>
              </div>
            </div>

            <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-500 text-[10px] block font-bold">WAKTU / TANGGAL:</span>
                <span className="text-zinc-200">{viewingLog.timestamp}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block font-bold">LOKASI / WILAYAH:</span>
                <span className="text-zinc-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" /> {viewingLog.location}
                </span>
              </div>
            </div>

            {/* Deskripsi Kronologi */}
            <div>
              <span className="text-zinc-400 block text-xs font-bold mb-1 uppercase tracking-wider">
                KRONOLOGI LENGKAP KEJADIAN:
              </span>
              <p className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-sans leading-relaxed whitespace-pre-line">
                {viewingLog.description}
              </p>
            </div>

            {/* Tindakan Mitigasi */}
            <div>
              <span className="text-zinc-400 block text-xs font-bold mb-1 uppercase tracking-wider">
                TINDAKAN PENANGGULANGAN / MITIGASI:
              </span>
              <p className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 font-sans leading-relaxed">
                {viewingLog.actionTaken}
              </p>
            </div>

            {/* Indikator Kompromi (IOCs) */}
            {viewingLog.iocIndicators && viewingLog.iocIndicators.length > 0 && (
              <div>
                <span className="text-zinc-400 block text-xs font-bold mb-1 uppercase tracking-wider">
                  INDIKATOR KOMPROMI (IOCs) & ARTEFAK:
                </span>
                <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl space-y-1 font-mono text-xs text-red-300">
                  {viewingLog.iocIndicators.map((ioc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-zinc-600">›</span>
                      <span>{ioc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Modal */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono">
                Klasifikasi: {viewingLog.classification} • Terenkripsi
              </span>
              <button
                onClick={() => setViewingLog(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold"
              >
                TUTUP BERKAS
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. MODAL RINGKASAN CETAK (PRINT-FRIENDLY SITREP SHEET) */}
      {isPrintModalOpen && (
        <div 
          onClick={() => setIsPrintModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b101c] border border-zinc-700 rounded-2xl max-w-3xl w-full p-5 sm:p-8 space-y-5 shadow-2xl font-mono relative my-6 text-zinc-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Header Cetak SITREP */}
            <div className="border-b-2 border-red-600 pb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-red-500 font-black tracking-widest uppercase">
                  MARKAS BESAR INTELIJEN NUSANTARA • PUSAT OPERASI KEAMANAN (SOC)
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  SECURITY INTELLIGENCE SITUATION REPORT (SITREP)
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} • {new Date().toLocaleTimeString('id-ID')} WIB
                </p>
              </div>

              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operator Credentials Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-black/60 p-3 rounded-xl border border-zinc-800">
              <div>
                <span className="text-zinc-500 text-[10px] block">PERWIRA OPERATOR:</span>
                <span className="font-bold text-white">{currentUser?.callsign}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">NOMOR BADGE:</span>
                <span className="font-bold text-zinc-200">{currentUser?.badgeNumber}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">TINGKAT CLEARANCE:</span>
                <span className="font-bold text-red-400">{currentUser?.clearanceLevel}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">TOTAL LAPORAN:</span>
                <span className="font-bold text-emerald-400">{filteredLogs.length} Entri</span>
              </div>
            </div>

            {/* Daftar Ringkasan Insiden Terstruktur */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                RINGKASAN REKAPITULASI INSIDEN OPERASIONAL:
              </span>

              {filteredLogs.map((log, idx) => (
                <div key={log.id} className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-bold text-red-400">
                      #{idx + 1}. [{log.incidentId}] {log.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getSeverityBadge(log.severity)}
                      {getStatusBadge(log.status)}
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Waktu: <span className="text-zinc-200">{log.timestamp}</span> | Wilayah: <span className="text-zinc-200">{log.location}</span> | Jenis: <span className="text-zinc-200">{log.category}</span>
                  </div>
                  <p className="text-zinc-300 font-sans text-xs">
                    {log.description}
                  </p>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    Mitigasi: {log.actionTaken}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar Cetak */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                onClick={handleCopySitrep}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-200 flex items-center gap-2"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">SITREP TERSALIN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>SALIN SITREP</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-glow-red flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>CETAK LEMBAR RESMI (PRINT)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
