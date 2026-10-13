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
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogEntry, SeverityLevel, IncidentCategory, IncidentStatus, ClearanceLevel } from '../types';

interface DailyLogbookProps {
  initialPreload?: Partial<LogEntry> | null;
  onClearPreload?: () => void;
}

const DEFAULT_LOG_ENTRIES: LogEntry[] = [
  {
    id: 'log-001',
    incidentId: 'INC-2026-9041',
    timestamp: '13/10/2026 14:32 WIB',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Deteksi Beaconing Trojan APT-38 ke Server Command & Control (C2)',
    category: 'MALWARE_ANALYSIS',
    severity: 'CRITICAL',
    status: 'CONTAINED',
    classification: 'TOP SECRET',
    iocIndicators: ['185.220.101.45', 'c2-gate-redacted.onion', 'MD5: 8f9b23e1a0b3f52c', 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    description: 'Aktivitas transmisi data terenkripsi mencurigakan dari host internal workstation finance ke IP luar negeri dengan interval 45 detik. Analisis dump memori menemukan injeksi process hollowing pada explorer.exe.',
    actionTaken: 'Isolasi host via endpoint sensor, pencabutan token sesi LDAP, dan blocking IP C2 pada perimeter firewall nasional.',
    location: 'Sektor Finansial / Jakarta',
    createdAt: new Date().toISOString()
  },
  {
    id: 'log-002',
    incidentId: 'INC-2026-9038',
    timestamp: '13/10/2026 11:15 WIB',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Eksploitasi Celah Zero-Day pada VPN Gateway Kementerian',
    category: 'NETWORK_INTRUSION',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    classification: 'SECRET',
    iocIndicators: ['194.38.20.12', 'CVE-2026-4419', 'UserAgent: Mozilla/5.0 (PwnBot-Scanner)'],
    description: 'Ditemukan anomali bypass autentikasi 2FA pada perimeter router gateway. Penyerang mencoba mengekstraksi berkas konfigurasi internal.',
    actionTaken: 'Penerapan patch darurat dari vendor, revokasi cert SSL/TLS gateway, serta forensik traffic packet capture.',
    location: 'Kementerian Komunikasi / Jakarta',
    createdAt: new Date().toISOString()
  },
  {
    id: 'log-003',
    incidentId: 'INC-2026-9022',
    timestamp: '13/10/2026 09:00 WIB',
    operatorId: 'op-001',
    operatorCallsign: 'GARUDA-01',
    title: 'Pemantauan Kampanye Disinformasi & Deepfake Separatis di Wilayah Timur',
    category: 'DISINFORMATION',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    classification: 'CONFIDENTIAL',
    iocIndicators: ['TikTok: @nusantara_hoax_lab', 'Telegram: @merdeka_cyber_cell', 'Hash: 4a2d81f9e'],
    description: 'Penyebaran video rekayasa AI (Deepfake) yang menampilkan pejabat militer menyampaikan narasi provokatif untuk memicu kerusuhan massa di Jayapura.',
    actionTaken: 'Koordinasi takedown konten dengan platform penyedia layanan dan penerbitan klarifikasi resmi melalui kanal resmi TNI/Polri.',
    location: 'Jayapura / Papua',
    createdAt: new Date().toISOString()
  }
];

export const DailyLogbook: React.FC<DailyLogbookProps> = ({ 
  initialPreload,
  onClearPreload 
}) => {
  const { currentUser, getOperatorStorage, setOperatorStorage } = useAuth();
  
  // Isolated storage for active operator
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    return getOperatorStorage<LogEntry[]>('daily_logbook', DEFAULT_LOG_ENTRIES);
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingLog, setViewingLog] = useState<LogEntry | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('MALWARE_ANALYSIS');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [status, setStatus] = useState<IncidentStatus>('INVESTIGATING');
  const [classification, setClassification] = useState<ClearanceLevel>('SECRET');
  const [iocInput, setIocInput] = useState('');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [location, setLocation] = useState('Pusat Komando Jakarta');

  // Save to isolated storage whenever logs change
  useEffect(() => {
    setOperatorStorage('daily_logbook', logs);
  }, [logs]);

  // Handle preloading from news escalation
  useEffect(() => {
    if (initialPreload) {
      setTitle(initialPreload.title || '');
      setDescription(initialPreload.description || '');
      setSeverity(initialPreload.severity || 'HIGH');
      setCategory(initialPreload.category || 'NETWORK_INTRUSION');
      setIsModalOpen(true);
      if (onClearPreload) onClearPreload();
    }
  }, [initialPreload]);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const parsedIOCs = iocInput
      .split('\n')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      incidentId: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date()) + ' WIB',
      operatorId: currentUser?.id || 'op-anon',
      operatorCallsign: currentUser?.callsign || 'OPERATOR-01',
      title: title.trim(),
      category,
      severity,
      status,
      classification,
      iocIndicators: parsedIOCs.length > 0 ? parsedIOCs : ['N/A - Belum teridentifikasi'],
      description: description.trim(),
      actionTaken: actionTaken.trim() || 'Monitoring berkelanjutan dan eskalasi tim teknis.',
      location: location.trim(),
      createdAt: new Date().toISOString()
    };

    setLogs([newLog, ...logs]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setActionTaken('');
    setIocInput('');
    setIsModalOpen(false);
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm('Hapus entri logbook insiden ini secara permanen dari basis data?')) {
      setLogs(logs.filter(l => l.id !== id));
      if (viewingLog?.id === id) setViewingLog(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: IncidentStatus) => {
    setLogs(logs.map(log => log.id === id ? { ...log, status: newStatus } : log));
    if (viewingLog?.id === id) {
      setViewingLog({ ...viewingLog, status: newStatus });
    }
  };

  // Export Logbook to formatted TXT / JSON
  const handleExportReport = () => {
    const reportData = {
      operator: currentUser?.callsign,
      badge: currentUser?.badgeNumber,
      unit: currentUser?.unit,
      exportedAt: new Date().toISOString(),
      totalEntries: logs.length,
      entries: logs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `INTEL-LOGBOOK-${currentUser?.callsign || 'SOC'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    const matchSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchQuery = 
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.iocIndicators.some(ioc => ioc.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchSeverity && matchStatus && matchQuery;
  });

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-700/60 shadow-glow-red">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-700/60">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-700/60">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">LOW</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/60">INFO</span>;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-900/60 text-red-300 border border-red-700">OPEN</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-900/60 text-amber-300 border border-amber-700 animate-pulse">INVESTIGATING</span>;
      case 'CONTAINED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-900/60 text-blue-300 border border-blue-700">CONTAINED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-700">RESOLVED</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-900/60 text-purple-300 border border-purple-700">ESCALATED</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header Controls */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono">
            <span className="p-1.5 rounded-lg bg-red-950 border border-red-700/60 text-red-500">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
              SOC LOGBOOK OPERASIONAL STANDAR
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">ISOLASI AKUN: {currentUser?.callsign}</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide mt-1">
            Catatan Harian Insiden & Penanganan Ancaman
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Pencatatan berstandar SOC militer/intelijen dengan penandaan IOC, kronologi, tindakan mitigasi, dan status resolusi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
            title="Ekspor seluruh berkas insiden ke JSON"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>EKSPOR BERKAS</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-glow-red flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>CATAT INSIDEN BARU</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari ID Insiden, Judul, Deskripsi, atau IOC (IP / Hash / Akun)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-zinc-700/80 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 whitespace-nowrap">Keparahan:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-2 bg-black/60 border border-zinc-700/80 rounded-lg text-zinc-200 focus:outline-none focus:border-red-600"
          >
            <option value="ALL">SEMUA TINGKAT</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-black/60 border border-zinc-700/80 rounded-lg text-zinc-200 focus:outline-none focus:border-red-600"
          >
            <option value="ALL">SEMUA STATUS</option>
            <option value="OPEN">OPEN</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="CONTAINED">CONTAINED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Incident List Table / Cards */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-[#090e1a] border border-zinc-800 rounded-2xl font-mono">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">Tidak ada catatan insiden yang sesuai filter pencarian.</p>
            <button
              onClick={() => { setSearchQuery(''); setSeverityFilter('ALL'); setStatusFilter('ALL'); }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:text-white"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#090e1a] hover:bg-[#0c1222] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-200 shadow-md font-mono"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                
                {/* Left Section */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-red-400 font-bold text-xs">
                      {log.incidentId}
                    </span>
                    {getSeverityBadge(log.severity)}
                    {getStatusBadge(log.status)}
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/60 text-red-300 border border-red-800/50">
                      {log.classification}
                    </span>
                    <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.timestamp}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {log.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {log.description}
                  </p>

                  {/* IOC Pills */}
                  {log.iocIndicators && log.iocIndicators.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> IOCs:
                      </span>
                      {log.iocIndicators.map((ioc, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-black/60 border border-zinc-800 text-[11px] text-zinc-300 font-mono select-all hover:border-red-600/50"
                        >
                          {ioc}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Taken summary */}
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80 text-[11px] text-zinc-300 mt-2">
                    <span className="text-red-400 font-bold">MITIGASI / TINDAKAN:</span> {log.actionTaken}
                  </div>
                </div>

                {/* Right Quick Controls */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800/80">
                  <div className="text-[11px] text-zinc-400 text-left lg:text-right">
                    <span>Operator: </span>
                    <span className="text-red-400 font-bold">{log.operatorCallsign}</span>
                    <div className="text-[10px] text-zinc-400">{log.location}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Quick status cycle button */}
                    <select
                      value={log.status}
                      onChange={(e) => handleStatusChange(log.id, e.target.value as IncidentStatus)}
                      className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-200 focus:outline-none focus:border-red-500"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="INVESTIGATING">INVESTIGATING</option>
                      <option value="CONTAINED">CONTAINED</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="ESCALATED">ESCALATED</option>
                    </select>

                    <button
                      onClick={() => setViewingLog(log)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Lihat Berkas Lengkap"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Hapus Entri Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE NEW INCIDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b101c] border border-red-600/60 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl font-mono relative my-8">
            
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-red-950 border border-red-700/60 text-red-500">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    PENCATATAN INSIDEN SOC BARU
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Operator: <span className="text-red-400 font-bold">{currentUser?.callsign}</span> ({currentUser?.badgeNumber})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">
                  Judul Insiden / Ringkasan Ancaman *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aktivitas Lateral Movement Melalui SMB Port 445"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase">
                    Kategori Serangan
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="MALWARE_ANALYSIS">MALWARE ANALYSIS</option>
                    <option value="NETWORK_INTRUSION">NETWORK INTRUSION</option>
                    <option value="OSINT_SURVEILLANCE">OSINT SURVEILLANCE</option>
                    <option value="CREDENTIAL_LEAK">CREDENTIAL LEAK</option>
                    <option value="PHYSICAL_SECURITY">PHYSICAL SECURITY</option>
                    <option value="DISINFORMATION">DISINFORMATION</option>
                    <option value="DDOS_ANOMALY">DDOS ANOMALY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase">
                    Tingkat Keparahan
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                    <option value="INFO">INFO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase">
                    Klasifikasi Berkas
                  </label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as ClearanceLevel)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="TOP SECRET">TOP SECRET</option>
                    <option value="SECRET">SECRET</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">
                  Indikator Kompromi (IOC) - Satu entri per baris
                </label>
                <textarea
                  rows={2}
                  placeholder="192.168.1.100&#10;attacker-domain.com&#10;SHA256: d5a8e..."
                  value={iocInput}
                  onChange={(e) => setIocInput(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 font-mono text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">
                  Kronologi & Rincian Teknis Insiden *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan bagaimana serangan/anomali terdeteksi, artefak yang ditemukan, dan dampaknya..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 font-sans text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">
                  Tindakan Penanggulangan / Countermeasures
                </label>
                <textarea
                  rows={2}
                  placeholder="Langkah mitigasi yang telah dilakukan oleh operator..."
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 font-sans text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-semibold"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-glow-red flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>SIMPAN KE LOGBOOK SOC</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DOSSIER MODAL */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b101c] border border-red-600/70 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl font-mono relative">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] px-2 py-0.5 bg-red-950 text-red-300 border border-red-700 rounded font-bold uppercase">
                  BERKAS RESMI SOC • {viewingLog.incidentId}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  {viewingLog.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingLog(null)}
                className="text-zinc-500 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-black/40 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">KEPARAHAN</span>
                {getSeverityBadge(viewingLog.severity)}
              </div>
              <div className="p-2 bg-black/40 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">STATUS</span>
                {getStatusBadge(viewingLog.status)}
              </div>
              <div className="p-2 bg-black/40 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">OPERATOR</span>
                <span className="text-red-400 font-bold">{viewingLog.operatorCallsign}</span>
              </div>
              <div className="p-2 bg-black/40 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">WAKTU</span>
                <span className="text-zinc-300">{viewingLog.timestamp}</span>
              </div>
            </div>

            <div>
              <span className="text-zinc-400 block text-xs font-bold mb-1">DESKRIPSI LENGKAP:</span>
              <p className="p-3 bg-black/50 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-sans leading-relaxed">
                {viewingLog.description}
              </p>
            </div>

            <div>
              <span className="text-zinc-400 block text-xs font-bold mb-1">INDIKATOR KOMPROMI (IOCs):</span>
              <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl space-y-1 font-mono text-xs text-red-300">
                {viewingLog.iocIndicators.map((ioc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-zinc-600">›</span>
                    <span>{ioc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-zinc-400 block text-xs font-bold mb-1">TINDAKAN MITIGASI / RESOLUSI:</span>
              <p className="p-3 bg-black/50 border border-zinc-800 rounded-xl text-xs text-emerald-300 font-sans leading-relaxed">
                {viewingLog.actionTaken}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setViewingLog(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold"
              >
                TUTUP BERKAS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
