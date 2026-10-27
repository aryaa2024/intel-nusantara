import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Download, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  X, 
  Layers, 
  ArrowUpRight, 
  Zap, 
  RefreshCw,
  FileSpreadsheet,
  Building2,
  Lock,
  Flame,
  FileCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RiskItem, RiskLevel, MitigationStrategy, StandardAPIResponse, LogEntry } from '../types';

interface SecurityRiskManagementProps {
  onEscalateToLogbook?: (log: Partial<LogEntry>) => void;
}

// Initial ISO 31000 Risk Register Seed
const DEFAULT_RISK_ITEMS: RiskItem[] = [
  {
    id: 'rsk-01',
    riskId: 'RSK-2026-001',
    title: 'Infiltrasi Fisik Jalur Perimeter Belakang Obvitnas Kilang Minyak',
    category: 'Physical Security',
    likelihood: 4,
    impact: 5,
    score: 20,
    level: 'CRITICAL',
    mitigationStrategy: 'Mitigate',
    actionPlan: 'Pemasangan kawat duri razor concertina ganda, sensor getar PIDS, penambahan patroli anjing K9 setiap 30 menit.',
    owner: 'Mayor Inf. Bambang - Komandan Satgas Pam',
    status: 'IN_PROGRESS',
    assetName: 'Perimeter Sektor Barat Laut Obvitnas',
    createdAt: '2026-10-25T08:30:00Z',
    updatedAt: '2026-10-27T04:15:00Z'
  },
  {
    id: 'rsk-02',
    riskId: 'RSK-2026-002',
    title: 'Serangan Ransomware Sektor OT SCADA Server Pompa Distribusi',
    category: 'Cyber Threat',
    likelihood: 4,
    impact: 4,
    score: 16,
    level: 'HIGH',
    mitigationStrategy: 'Mitigate',
    actionPlan: 'Penerapan air-gapping total jaringan OT/IT, update patch firmware PLC, enkripsi backup offline harian.',
    owner: 'Aryaa - Kepala Subdit Siber SOC',
    status: 'OPEN',
    assetName: 'Server SCADA Sektor Utama',
    createdAt: '2026-10-26T10:15:00Z',
    updatedAt: '2026-10-27T02:00:00Z'
  },
  {
    id: 'rsk-03',
    riskId: 'RSK-2026-003',
    title: 'Kegagalan Genset Cadangan Saat Pemadaman Listrik Gardu Induk',
    category: 'Infrastructure',
    likelihood: 3,
    impact: 4,
    score: 12,
    level: 'HIGH',
    mitigationStrategy: 'Transfer',
    actionPlan: 'Klaim SLA pemeliharaan berkala vendor daya darurat, instalasi ATS (Automatic Transfer Switch) redundan.',
    owner: 'Lettu Czi. Danang - Kepala Sarpras',
    status: 'IN_PROGRESS',
    assetName: 'Power Plant & Gardu Darurat B',
    createdAt: '2026-10-24T14:00:00Z',
    updatedAt: '2026-10-26T17:30:00Z'
  },
  {
    id: 'rsk-04',
    riskId: 'RSK-2026-004',
    title: 'Kebocoran Kredensial Akses Gerbang oleh Personel Kontraktor Luar',
    category: 'Personnel & Insider',
    likelihood: 3,
    impact: 3,
    score: 9,
    level: 'MEDIUM',
    mitigationStrategy: 'Avoid',
    actionPlan: 'Wajib rotasi passcard RFID harian, biometric escrow pada checkpoint ruang server, pendampingan terus-menerus.',
    owner: 'Kapten Hendra - Provos & Akses',
    status: 'TREATED',
    assetName: 'Sistem Akses Kontrol Turnstile Pintu 3',
    createdAt: '2026-10-22T09:00:00Z',
    updatedAt: '2026-10-26T11:45:00Z'
  },
  {
    id: 'rsk-05',
    riskId: 'RSK-2026-005',
    title: 'Keterlambatan Pengiriman Komponen CCTV Pengganti Dari Vendor Luar',
    category: 'Supply Chain',
    likelihood: 2,
    impact: 2,
    score: 4,
    level: 'LOW',
    mitigationStrategy: 'Accept',
    actionPlan: 'Penyimpanan stok suku cadang minimum 5 unit kamera PTZ di gudang logistik internal.',
    owner: 'Serka Ruslan - Teknisi CCTV',
    status: 'ACCEPTED',
    assetName: 'Inventaris Kamera Thermal & PTZ',
    createdAt: '2026-10-20T11:20:00Z',
    updatedAt: '2026-10-25T16:00:00Z'
  }
];

// Helper kalkulasi level risiko sesuai standar ISO 31000
export const calculateRiskLevel = (score: number): RiskLevel => {
  if (score >= 17) return 'CRITICAL';
  if (score >= 10) return 'HIGH';
  if (score >= 5) return 'MEDIUM';
  return 'LOW';
};

// Helper warna dan deskripsi level risiko
export const getRiskLevelMeta = (level: RiskLevel) => {
  switch (level) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL (17 - 25)',
        badgeColor: 'bg-red-950/80 text-red-300 border-red-600',
        textColor: 'text-red-500',
        action: 'Immediate Intervention (Intervensi Langsung)',
        dotColor: 'bg-red-500 shadow-glow-red'
      };
    case 'HIGH':
      return {
        label: 'HIGH (10 - 16)',
        badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-600',
        textColor: 'text-orange-400',
        action: 'Urgent Mitigation (Mitigasi Cepat)',
        dotColor: 'bg-orange-500 shadow-glow-orange'
      };
    case 'MEDIUM':
      return {
        label: 'MEDIUM (5 - 9)',
        badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500',
        textColor: 'text-amber-400',
        action: 'Standard Control (Kontrol Standar)',
        dotColor: 'bg-amber-500'
      };
    case 'LOW':
    default:
      return {
        label: 'LOW (1 - 4)',
        badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-600',
        textColor: 'text-emerald-400',
        action: 'Accept / Monitor (Terima & Pantau)',
        dotColor: 'bg-emerald-500'
      };
  }
};

export const SecurityRiskManagement: React.FC<SecurityRiskManagementProps> = ({ onEscalateToLogbook }) => {
  const { currentUser, getOperatorStorage, setOperatorStorage } = useAuth();
  
  const [risks, setRisks] = useState<RiskItem[]>(() => {
    return getOperatorStorage<RiskItem[]>('srm_risk_register_iso31000', DEFAULT_RISK_ITEMS);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedCell, setSelectedCell] = useState<{ l: number; i: number } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRisk, setViewingRisk] = useState<RiskItem | null>(null);
  const [jsonExportModal, setJsonExportModal] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<RiskItem['category']>('Physical Security');
  const [formAssetName, setFormAssetName] = useState('');
  const [formLikelihood, setFormLikelihood] = useState<number>(3);
  const [formImpact, setFormImpact] = useState<number>(3);
  const [formStrategy, setFormStrategy] = useState<MitigationStrategy>('Mitigate');
  const [formActionPlan, setFormActionPlan] = useState('');
  const [formOwner, setFormOwner] = useState(currentUser?.callsign || 'OPERATOR-01');

  // Sinkronisasi ke LocalStorage terisolasi
  useEffect(() => {
    setOperatorStorage('srm_risk_register_iso31000', risks);
  }, [risks]);

  // Statistik
  const totalRisks = risks.length;
  const criticalCount = risks.filter(r => r.level === 'CRITICAL').length;
  const highCount = risks.filter(r => r.level === 'HIGH').length;
  const mediumCount = risks.filter(r => r.level === 'MEDIUM').length;
  const lowCount = risks.filter(r => r.level === 'LOW').length;
  const maxScore = risks.reduce((acc, r) => Math.max(acc, r.score), 0);

  // Filter Data
  const filteredRisks = risks.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.riskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.actionPlan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === 'ALL' || r.level === levelFilter;
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchesCell = !selectedCell || (r.likelihood === selectedCell.l && r.impact === selectedCell.i);

    return matchesSearch && matchesLevel && matchesCategory && matchesCell;
  });

  // Handler Submit
  const handleSaveRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formActionPlan.trim()) return;

    const score = formLikelihood * formImpact;
    const level = calculateRiskLevel(score);
    const nowIso = new Date().toISOString();

    const newRisk: RiskItem = {
      id: `rsk-${Date.now()}`,
      riskId: `RSK-2026-${String(risks.length + 1).padStart(3, '0')}`,
      title: formTitle.trim(),
      category: formCategory,
      assetName: formAssetName.trim() || 'Aset Teridentifikasi',
      likelihood: formLikelihood,
      impact: formImpact,
      score,
      level,
      mitigationStrategy: formStrategy,
      actionPlan: formActionPlan.trim(),
      owner: formOwner.trim(),
      status: 'OPEN',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    setRisks([newRisk, ...risks]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormAssetName('');
    setFormActionPlan('');
    setFormLikelihood(3);
    setFormImpact(3);
    setFormStrategy('Mitigate');
  };

  const handleEscalateRisk = (risk: RiskItem) => {
    if (onEscalateToLogbook) {
      onEscalateToLogbook({
        title: `[Eskalasi SRM ISO 31000] ${risk.title}`,
        category: risk.category === 'Physical Security' ? 'PHYSICAL_SECURITY' : 
                  risk.category === 'Cyber Threat' ? 'Cyber Attack' : 
                  risk.category === 'Sabotage / Terrorism' ? 'Terrorism Suspected' : 'Hazard',
        severity: risk.level === 'CRITICAL' ? 'CRITICAL' : risk.level === 'HIGH' ? 'HIGH' : 'MEDIUM',
        location: risk.assetName,
        description: `Risk ID: ${risk.riskId}\nLikelihood: ${risk.likelihood}/5 | Impact: ${risk.impact}/5 | Score: ${risk.score}/25 (${risk.level})\nStrategi: ${risk.mitigationStrategy}\nPenanggung Jawab: ${risk.owner}\n\nRencana Aksi Mitigasi:\n${risk.actionPlan}`,
        actionTaken: `Eskalasi otomatis dari Modul SRM. Tindakan kontrol: ${risk.mitigationStrategy}.`
      });
    }
  };

  // Generate pure JSON standard output
  const generatePureJson = (): StandardAPIResponse<RiskItem> => {
    return {
      module: 'SRM',
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        summary: {
          standard: 'ISO 31000:2018 Risk Management',
          formula: 'Risk Score = Likelihood (1-5) x Impact (1-5)',
          total_risks_evaluated: totalRisks,
          risk_distribution: {
            critical: criticalCount,
            high: highCount,
            medium: mediumCount,
            low: lowCount
          },
          highest_risk_score: maxScore,
          active_mitigation_count: risks.filter(r => r.status === 'IN_PROGRESS').length
        },
        details: risks,
        action_items: risks
          .filter(r => r.level === 'CRITICAL' || r.level === 'HIGH')
          .map(r => `[${r.riskId}] ${r.title} -> Control: ${r.mitigationStrategy} (${r.actionPlan.slice(0, 80)}...)`)
      },
      error_handling: {
        has_error: false,
        warning_logs: []
      }
    };
  };

  const copyJsonToClipboard = () => {
    const jsonStr = JSON.stringify(generatePureJson(), null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            STANDAR INTERNASIONAL // ISO 31000:2018
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
            SECURITY RISK <span className="text-red-600">MANAGEMENT</span> (SRM)
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Matriks Penilaian Risiko Terpadu Likelihood (1-5) × Impact (1-5) & Strategi Mitigasi Terstruktur
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setJsonExportModal(true)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-cyan-400 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>EXPORT JSON API</span>
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs rounded-xl shadow-glow-red flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>INPUT RISIKO BARU</span>
          </button>
        </div>
      </div>

      {/* 2. STATISTIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div className="p-3.5 bg-[#090e1a] border border-zinc-800 rounded-xl">
          <span className="text-[10px] text-zinc-500 uppercase block">TOTAL REGISTRASI</span>
          <span className="text-2xl font-black text-white">{totalRisks}</span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">Skenario Risiko</span>
        </div>

        <div className="p-3.5 bg-red-950/20 border border-red-800/60 rounded-xl">
          <span className="text-[10px] text-red-400 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            CRITICAL (17-25)
          </span>
          <span className="text-2xl font-black text-red-400">{criticalCount}</span>
          <span className="text-[10px] text-red-300/70 block mt-0.5">Intervensi Segera</span>
        </div>

        <div className="p-3.5 bg-orange-950/20 border border-orange-800/60 rounded-xl">
          <span className="text-[10px] text-orange-400 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            HIGH (10-16)
          </span>
          <span className="text-2xl font-black text-orange-400">{highCount}</span>
          <span className="text-[10px] text-orange-300/70 block mt-0.5">Mitigasi Mendesak</span>
        </div>

        <div className="p-3.5 bg-amber-950/20 border border-amber-800/60 rounded-xl">
          <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            MEDIUM (5-9)
          </span>
          <span className="text-2xl font-black text-amber-400">{mediumCount}</span>
          <span className="text-[10px] text-amber-300/70 block mt-0.5">Kontrol Standar</span>
        </div>

        <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/60 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            LOW (1-4)
          </span>
          <span className="text-2xl font-black text-emerald-400">{lowCount}</span>
          <span className="text-[10px] text-emerald-300/70 block mt-0.5">Pantau / Terima</span>
        </div>
      </div>

      {/* 3. INTERACTIVE 5x5 HEATMAP MATRIX (ISO 31000) */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-6 font-mono space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              MATRIKS RISIKO 5 × 5 INTERAKTIF (HEATMAP PROBABILITY VS IMPACT)
            </h2>
            <p className="text-[11px] text-zinc-400">
              Klik pada kotak matriks untuk menyaring daftar risiko berdasarkan koordinat (Likelihood × Impact)
            </p>
          </div>

          {selectedCell && (
            <button
              onClick={() => setSelectedCell(null)}
              className="text-[11px] text-red-400 hover:text-red-300 underline self-start sm:self-auto"
            >
              Reset Filter Matriks (L:{selectedCell.l}, I:{selectedCell.i})
            </button>
          )}
        </div>

        {/* The Matrix Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[550px]">
            {/* Top Label for Impact */}
            <div className="text-center text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
              SEVERITY OF IMPACT (TINGKAT KEPARAHAN / DAMPAK) ➔
            </div>

            <div className="grid grid-cols-[130px_repeat(5,1fr)] gap-1.5 text-center text-xs">
              
              {/* Header Cols */}
              <div className="p-2 text-[10px] font-bold text-zinc-500 text-right pr-3 flex items-center justify-end">
                LIKELIHOOD ⬇
              </div>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-300">1: Insignificant</div>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-300">2: Minor</div>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-300">3: Moderate</div>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-300">4: Major</div>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-300">5: Catastrophic</div>

              {/* Rows: 5 down to 1 */}
              {[
                { l: 5, label: '5: Almost Certain' },
                { l: 4, label: '4: Likely' },
                { l: 3, label: '3: Possible' },
                { l: 2, label: '2: Unlikely' },
                { l: 1, label: '1: Rare' }
              ].map(({ l, label }) => (
                <React.Fragment key={l}>
                  {/* Row Label */}
                  <div className="p-2 bg-zinc-900/60 border border-zinc-800/70 rounded text-[10px] font-bold text-zinc-400 flex items-center justify-end pr-2 text-right">
                    {label}
                  </div>

                  {/* 5 Impact Cells for this Likelihood */}
                  {[1, 2, 3, 4, 5].map(i => {
                    const score = l * i;
                    const level = calculateRiskLevel(score);
                    const matchingRisks = risks.filter(r => r.likelihood === l && r.impact === i);
                    const count = matchingRisks.length;
                    const isSelected = selectedCell?.l === l && selectedCell?.i === i;

                    let bgClass = '';
                    if (level === 'CRITICAL') bgClass = 'bg-red-950/60 border-red-600/80 hover:bg-red-900/80 text-red-200';
                    else if (level === 'HIGH') bgClass = 'bg-orange-950/60 border-orange-600/80 hover:bg-orange-900/80 text-orange-200';
                    else if (level === 'MEDIUM') bgClass = 'bg-amber-950/60 border-amber-500/80 hover:bg-amber-900/80 text-amber-200';
                    else bgClass = 'bg-emerald-950/60 border-emerald-600/80 hover:bg-emerald-900/80 text-emerald-200';

                    return (
                      <button
                        key={`${l}-${i}`}
                        type="button"
                        onClick={() => setSelectedCell(isSelected ? null : { l, i })}
                        className={`p-2.5 rounded-lg border transition-all flex flex-col items-center justify-center relative group ${bgClass} ${
                          isSelected ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : ''
                        }`}
                      >
                        <span className="text-[10px] font-bold opacity-80">{score}</span>
                        {count > 0 && (
                          <span className="mt-1 px-1.5 py-0.5 rounded-full bg-black/70 border border-white/20 text-[10px] font-black text-white">
                            {count} RISK
                          </span>
                        )}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
              Low (1-4): Accept / Monitor
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-600 inline-block"></span>
              Medium (5-9): Standard Control
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-orange-600 inline-block"></span>
              High (10-16): Urgent Mitigation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-600 inline-block"></span>
              Critical (17-25): Immediate Intervention
            </span>
          </div>

          <span className="text-zinc-500 text-[10px]">
            ISO 31000:2018 Risk Assessment Matrix Standard
          </span>
        </div>
      </div>

      {/* 4. RISK REGISTER FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID Risiko, Judul Ancaman, Aset, atau Rencana Aksi..."
            className="w-full pl-10 pr-4 py-2 bg-black/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600 font-bold"
          >
            <option value="ALL">SEMUA LEVEL</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600"
          >
            <option value="ALL">SEMUA KATEGORI</option>
            <option value="Physical Security">Physical Security</option>
            <option value="Cyber Threat">Cyber Threat</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Personnel & Insider">Personnel & Insider</option>
            <option value="Sabotage / Terrorism">Sabotage / Terrorism</option>
            <option value="Supply Chain">Supply Chain</option>
          </select>
        </div>
      </div>

      {/* 5. RISK REGISTER TABLE */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl overflow-hidden font-mono shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0d1424] border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Risk ID</th>
                <th className="py-3.5 px-4">Skenario Risiko & Aset</th>
                <th className="py-3.5 px-4 text-center">Likelihood × Impact</th>
                <th className="py-3.5 px-4 text-center">Score & Level</th>
                <th className="py-3.5 px-4">Strategi Mitigasi</th>
                <th className="py-3.5 px-4">Penanggung Jawab</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredRisks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    Tidak ditemukan data risiko yang sesuai kriteria pencarian/filter.
                  </td>
                </tr>
              ) : (
                filteredRisks.map((item) => {
                  const meta = getRiskLevelMeta(item.level);
                  return (
                    <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 text-[11px] text-zinc-300">
                          {item.riskId}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-bold text-zinc-100 hover:text-red-400 transition-colors cursor-pointer" onClick={() => setViewingRisk(item)}>
                          {item.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-2">
                          <span className="text-zinc-500">Aset:</span>
                          <span className="text-zinc-300 font-semibold">{item.assetName}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-cyan-400">{item.category}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-zinc-800">
                          <span className="text-zinc-300 font-bold">{item.likelihood}</span>
                          <span className="text-zinc-500">×</span>
                          <span className="text-zinc-300 font-bold">{item.impact}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black ${meta.badgeColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`}></span>
                          {item.score} • {item.level}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>{item.mitigationStrategy}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate mt-0.5" title={item.actionPlan}>
                          {item.actionPlan}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-zinc-300 whitespace-nowrap">
                        {item.owner}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingRisk(item)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                            title="Lihat Detail Dossier"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {(item.level === 'CRITICAL' || item.level === 'HIGH') && onEscalateToLogbook && (
                            <button
                              type="button"
                              onClick={() => handleEscalateRisk(item)}
                              className="px-2 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                              title="Eskalasi ke Daily Logbook SOC"
                            >
                              <ArrowUpRight className="w-3 h-3" />
                              <span>ESKALASI</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. MODAL: INPUT RISIKO BARU (ISO 31000) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0a0f1d] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden font-mono my-8">
            <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                  TAMBAH DAFTAR RISIKO BARU // ISO 31000
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRisk} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                  Judul Skenario Risiko *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Sabotase Katup Suplai Gas Jalur Utama..."
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                    Kategori Risiko ISO
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="Physical Security">Physical Security</option>
                    <option value="Cyber Threat">Cyber Threat</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Personnel & Insider">Personnel & Insider</option>
                    <option value="Sabotage / Terrorism">Sabotage / Terrorism</option>
                    <option value="Supply Chain">Supply Chain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                    Aset Kritis Terdampak *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAssetName}
                    onChange={(e) => setFormAssetName(e.target.value)}
                    placeholder="e.g. Sektor Pompa Bahan Bakar 02"
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Dynamic Matrix Slider / Pickers */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-300 uppercase">
                    KALKULASI ISO 31000 MATRIX:
                  </span>
                  {(() => {
                    const previewScore = formLikelihood * formImpact;
                    const previewLevel = calculateRiskLevel(previewScore);
                    const meta = getRiskLevelMeta(previewLevel);
                    return (
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black ${meta.badgeColor}`}>
                        SKOR: {previewScore} ({previewLevel})
                      </span>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-[10px] font-bold uppercase mb-1">
                      Likelihood / Kemungkinan Terjadi (1 - 5): <span className="text-white text-xs">{formLikelihood}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={formLikelihood}
                      onChange={(e) => setFormLikelihood(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                      <span>1: Rare</span>
                      <span>3: Possible</span>
                      <span>5: Almost Certain</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[10px] font-bold uppercase mb-1">
                      Impact / Tingkat Dampak (1 - 5): <span className="text-white text-xs">{formImpact}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={formImpact}
                      onChange={(e) => setFormImpact(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                      <span>1: Insignificant</span>
                      <span>3: Moderate</span>
                      <span>5: Catastrophic</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                    Strategi Mitigasi (ISO 31000)
                  </label>
                  <select
                    value={formStrategy}
                    onChange={(e) => setFormStrategy(e.target.value as MitigationStrategy)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-bold"
                  >
                    <option value="Mitigate">Mitigate (Kurangi Risiko / Kontrol Teknis)</option>
                    <option value="Avoid">Avoid (Hindari Risiko / Hentikan Aktivitas)</option>
                    <option value="Transfer">Transfer (Alihkan Risiko / Asuransi / Vendor)</option>
                    <option value="Accept">Accept (Terima Risiko / Pantau Berkala)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                    Personel Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOwner}
                    onChange={(e) => setFormOwner(e.target.value)}
                    placeholder="e.g. Kapten Satgas Intel Pam"
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                  Rencana Tindakan Mitigasi Terperinci (Action Plan) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formActionPlan}
                  onChange={(e) => setFormActionPlan(e.target.value)}
                  placeholder="Jelaskan langkah kontrol spesifik, penugasan personel, perlengkapan sensor..."
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-glow-red flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>SIMPAN KE RISK REGISTER</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: DETAIL DOSSIER RISIKO */}
      {viewingRisk && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0a0f1d] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden font-mono">
            <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500 font-bold">{viewingRisk.riskId}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-xs text-zinc-300 uppercase">BERKAS DOSSIER RISIKO</span>
              </div>
              <button onClick={() => setViewingRisk(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <h3 className="text-base font-black text-white leading-snug">
                  {viewingRisk.title}
                </h3>
                <div className="text-zinc-400 text-[11px] mt-1 flex items-center gap-2">
                  <span>Aset: <strong className="text-zinc-200">{viewingRisk.assetName}</strong></span>
                  <span>•</span>
                  <span>Kategori: <strong className="text-cyan-400">{viewingRisk.category}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-black/40 border border-zinc-800 rounded-xl">
                <div>
                  <span className="text-[10px] text-zinc-500 block">LIKELIHOOD × IMPACT</span>
                  <span className="text-sm font-bold text-white">
                    {viewingRisk.likelihood} × {viewingRisk.impact}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">TOTAL SCORE & LEVEL</span>
                  <span className="text-sm font-black text-red-400">
                    {viewingRisk.score} • {viewingRisk.level}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">STRATEGI KONTROL</span>
                  <span className="text-sm font-bold text-amber-300">
                    {viewingRisk.mitigationStrategy}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">PENANGGUNG JAWAB</span>
                  <span className="text-sm font-bold text-zinc-300">
                    {viewingRisk.owner}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Rencana Tindakan Mitigasi Terperinci:
                </label>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 text-[11px] leading-relaxed">
                  {viewingRisk.actionPlan}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-zinc-500">
                <span>Dibuat: {new Date(viewingRisk.createdAt).toLocaleString('id-ID')}</span>
                <span>Diperbarui: {new Date(viewingRisk.updatedAt).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#0d1424] border-t border-zinc-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingRisk(null)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs"
              >
                Tutup
              </button>
              {(viewingRisk.level === 'CRITICAL' || viewingRisk.level === 'HIGH') && onEscalateToLogbook && (
                <button
                  type="button"
                  onClick={() => {
                    handleEscalateRisk(viewingRisk);
                    setViewingRisk(null);
                  }}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-glow-red flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>ESKALASI KE LOGBOOK</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: JSON API EXPORT VIEW */}
      {jsonExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0a0f1d] border border-cyan-700/80 rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                  PAYLOAD RESMI API SRM (ISO 31000 SCHEMA)
                </h3>
              </div>
              <button onClick={() => setJsonExportModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-black/90 text-cyan-300 text-xs font-mono">
              <pre className="whitespace-pre-wrap">{JSON.stringify(generatePureJson(), null, 2)}</pre>
            </div>

            <div className="px-6 py-3 bg-[#0d1424] border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">
                100% Parsable JSON • ISO 8601 UTC • Zero Bug Schema
              </span>

              <div className="flex items-center gap-2">
                {copiedNotification && (
                  <span className="text-emerald-400 text-xs font-bold animate-fadeIn">
                    ✓ Tersalin ke Clipboard!
                  </span>
                )}
                <button
                  onClick={copyJsonToClipboard}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Salin JSON Murni
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
