import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  SlidersHorizontal, 
  Download, 
  FileCode, 
  ChevronRight, 
  Layers, 
  Eye, 
  DoorClosed, 
  Cctv, 
  Flame, 
  Radio, 
  Zap, 
  Plus, 
  FileSpreadsheet, 
  X,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  SecurityAssessment, 
  AssessmentPillar, 
  PropertyType, 
  ChecklistItem, 
  GapAnalysisItem, 
  StandardAPIResponse,
  LogEntry
} from '../types';

interface SecurityAssessmentProps {
  onEscalateToLogbook?: (log: Partial<LogEntry>) => void;
}

// Initial Standard ASIS Checklist Blueprint
const BLUEPRINT_CHECKLIST: ChecklistItem[] = [
  // 1. Perimeter Security
  {
    id: 'chk-p1',
    pillar: 'Perimeter Security',
    question: 'Pagar Pembatas & Kawat Duri Ganda',
    requirement: 'Pagar perimeter fisik minimum tinggi 2.4 meter dengan razor concertina kawat berduri pada sudut 45 derajat.',
    status: 'COMPLIANT',
    score: 100,
    weight: 20,
    notes: 'Kawat razor concertina terpasang rapi di seluruh garis batas barat dan utara.'
  },
  {
    id: 'chk-p2',
    pillar: 'Perimeter Security',
    question: 'Zona Bebas Pandang (Clear Zone)',
    requirement: 'Zona bebas vegetasi dan halangan pandang minimum 3 meter di dalam dan di luar perimeter.',
    status: 'PARTIAL',
    score: 50,
    weight: 15,
    notes: 'Sektor timur masih terdapat semak lebat yang menghalangi pandangan kamera pengawas.'
  },
  {
    id: 'chk-p3',
    pillar: 'Perimeter Security',
    question: 'Penerangan Perimeter (Security Lighting)',
    requirement: 'Penerangan perimeter minimum 10 Lux merata di sepanjang pagar dengan sumber daya UPS darurat.',
    status: 'COMPLIANT',
    score: 100,
    weight: 15,
    notes: 'Lampu LED high-output terpasang per jarak 15 meter, sensor cahaya otomatis berfungsi.'
  },

  // 2. Access Control
  {
    id: 'chk-a1',
    pillar: 'Access Control',
    question: 'Portal Masuk & Inspeksi Kendaraan',
    requirement: 'Palang penghalang kendaraan anti-tabrak (crash-rated bollard) dengan cermin kolong dan detektor logam.',
    status: 'COMPLIANT',
    score: 100,
    weight: 20,
    notes: 'Bollard hidrolik aktif pada gerbang utama, inspeksi bagasi SOP 100% terlaksana.'
  },
  {
    id: 'chk-a2',
    pillar: 'Access Control',
    question: 'Autentikasi Akses Personel & Biometrik',
    requirement: 'Sistem turnstile RFID terintegrasi pangkalan data personel, verifikasi sidik jari/wajah untuk area steril.',
    status: 'PARTIAL',
    score: 50,
    weight: 20,
    notes: 'Turnstile RFID aktif, namun autentikasi biometrik ruang kontrol masih dalam kalibrasi teknis.'
  },

  // 3. Physical Infrastructure
  {
    id: 'chk-i1',
    pillar: 'Physical Infrastructure',
    question: 'Pengerasan Fisik Ruang Komando & Server',
    requirement: 'Dinding beton bertulang tahan ledakan dengan pintu baja berklasifikasi tahan api 2 jam.',
    status: 'COMPLIANT',
    score: 100,
    weight: 25,
    notes: 'Pintu lapis baja SOC tersertifikasi UL, akses magnetik interlocking berfungsi normal.'
  },
  {
    id: 'chk-i2',
    pillar: 'Physical Infrastructure',
    question: 'Redundansi Daya (Dual UPS & Backup Generator)',
    requirement: 'Konfigurasi daya cadangan N+1 dengan sistem ATS transisi beban otomatis dalam waktu kurang dari 10 detik.',
    status: 'NON_COMPLIANT',
    score: 0,
    weight: 20,
    notes: 'Genset 2 mengalami kebocoran seal pendingin, belum ada unit genset cadangan kedua.'
  },

  // 4. Surveillance (CCTV)
  {
    id: 'chk-c1',
    pillar: 'Surveillance (CCTV)',
    question: 'Cakupan Kamera PTZ & Eliminasi Blindspot',
    requirement: 'Semua titik masuk utama, lorong transit, dan perimeter tercover tanpa blindspot dengan fungsi night vision / IR.',
    status: 'COMPLIANT',
    score: 100,
    weight: 25,
    notes: 'Total 48 kamera IP high-definition beroperasi, resolusi 4K dengan sensor inframerah 50m.'
  },
  {
    id: 'chk-c2',
    pillar: 'Surveillance (CCTV)',
    question: 'Retensi Rekaman NVR & Proteksi Arsip',
    requirement: 'Penyimpanan rekaman minimum 30 hari dalam storage SAN/NAS terenkripsi dengan proteksi tamper-proof.',
    status: 'PARTIAL',
    score: 50,
    weight: 20,
    notes: 'Storage hanya mampu menyimpan rekaman selama 21 hari karena peningkatan resolusi kamera baru.'
  },

  // 5. Incident Response Readiness
  {
    id: 'chk-r1',
    pillar: 'Incident Response Readiness',
    question: 'Tombol Darurat (Panic Alarm) & Jalur Hotline Instansi',
    requirement: 'Tombol panik silent alarm terhubung langsung ke Pusat Kendali Satgas Pam Obvit dan kepolisian setempat.',
    status: 'COMPLIANT',
    score: 100,
    weight: 25,
    notes: 'Silent alarm teruji aktif, waktu respon kepolisian terkonfirmasi dalam simulasi di bawah 7 menit.'
  },
  {
    id: 'chk-r2',
    pillar: 'Incident Response Readiness',
    question: 'Simulasi Drill Evakuasi & Latihan Kontra-Terorisme',
    requirement: 'Pelaksanaan latihan tanggap darurat dan simulasi terorisme minimum 1 kali setiap 6 bulan dengan sertifikasi.',
    status: 'NON_COMPLIANT',
    score: 0,
    weight: 20,
    notes: 'Terakhir kali latihan evakuasi diselenggarakan 9 bulan lalu, jadwal drill kuartal ini tertunda.'
  }
];

// Helper kalkulasi GAP Analysis dari checklist
const generateGapAnalysis = (checklist: ChecklistItem[]): GapAnalysisItem[] => {
  const gaps: GapAnalysisItem[] = [];
  let order = 1;

  checklist.forEach(item => {
    if (item.status === 'NON_COMPLIANT') {
      gaps.push({
        id: `gap-${item.id}`,
        pillar: item.pillar,
        gapDescription: `Kegagalan Total Standar ASIS: ${item.question} (${item.notes})`,
        severity: 'CRITICAL',
        recommendation: `Intervensi Segera: Lakukan perbaikan/pengadaan darurat untuk memenuhi persyaratan "${item.requirement}".`,
        priorityOrder: order++
      });
    } else if (item.status === 'PARTIAL') {
      gaps.push({
        id: `gap-${item.id}`,
        pillar: item.pillar,
        gapDescription: `Pemenuhan Sebagian (GAP 50%): ${item.question} (${item.notes})`,
        severity: 'MEDIUM',
        recommendation: `Optimalisasi Kontrol: Tingkatkan kapasitas atau jadwal pemeliharaan agar tercapai kepatuhan 100%.`,
        priorityOrder: order++
      });
    }
  });

  return gaps;
};

// Initial Seed Assessments
const DEFAULT_ASSESSMENTS: SecurityAssessment[] = [
  {
    id: 'asm-01',
    assessmentId: 'ASM-2026-001',
    propertyName: 'Kompleks Obvitnas Kilang Minyak & Depo BBM Utama',
    propertyType: 'Vital Objects / Obvitnas',
    location: 'Cilacap / Jawa Tengah',
    assessorCallsign: 'ARYAA-KOMANDO',
    complianceScore: 78,
    pillarScores: {
      'Perimeter Security': 83,
      'Access Control': 75,
      'Physical Infrastructure': 50,
      'Surveillance (CCTV)': 75,
      'Incident Response Readiness': 50
    },
    checklist: BLUEPRINT_CHECKLIST,
    gapAnalysis: generateGapAnalysis(BLUEPRINT_CHECKLIST),
    conductedAt: '2026-10-26T14:00:00Z',
    status: 'COMPLETED',
    overallVerdict: 'MITIGATION REQUIRED'
  },
  {
    id: 'asm-02',
    assessmentId: 'ASM-2026-002',
    propertyName: 'Hotel Grand Nusantara International Suites',
    propertyType: 'Hotels',
    location: 'Kawasan Sudirman / DKI Jakarta',
    assessorCallsign: 'GARUDA-01',
    complianceScore: 91,
    pillarScores: {
      'Perimeter Security': 95,
      'Access Control': 90,
      'Physical Infrastructure': 88,
      'Surveillance (CCTV)': 95,
      'Incident Response Readiness': 88
    },
    checklist: BLUEPRINT_CHECKLIST.map(c => ({ ...c, status: 'COMPLIANT' as const, score: 100 })),
    gapAnalysis: [],
    conductedAt: '2026-10-25T10:30:00Z',
    status: 'COMPLETED',
    overallVerdict: 'SECURITY ADEQUATE'
  }
];

export const SecurityAssessmentPage: React.FC<SecurityAssessmentProps> = ({ onEscalateToLogbook }) => {
  const { currentUser, getOperatorStorage, setOperatorStorage } = useAuth();

  const [assessments, setAssessments] = useState<SecurityAssessment[]>(() => {
    const raw = getOperatorStorage<SecurityAssessment[]>('asis_security_assessments', DEFAULT_ASSESSMENTS);
    return Array.isArray(raw) && raw.length > 0 ? raw : DEFAULT_ASSESSMENTS;
  });

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    assessments[0]?.id || DEFAULT_ASSESSMENTS[0].id
  );

  const [activePillarTab, setActivePillarTab] = useState<AssessmentPillar | 'ALL'>('ALL');
  const [jsonExportModal, setJsonExportModal] = useState(false);
  const [isNewAssessmentModalOpen, setIsNewAssessmentModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // New assessment form
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState<PropertyType>('Vital Objects / Obvitnas');
  const [newPropLocation, setNewPropLocation] = useState('DKI Jakarta');

  const currentAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0] || DEFAULT_ASSESSMENTS[0];

  useEffect(() => {
    setOperatorStorage('asis_security_assessments', assessments);
  }, [assessments]);

  // Recalculate compliance score when checklist items change
  const handleUpdateChecklistStatus = (itemId: string, newStatus: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT') => {
    if (!currentAssessment) return;

    const newScore = newStatus === 'COMPLIANT' ? 100 : newStatus === 'PARTIAL' ? 50 : 0;
    const updatedChecklist = currentAssessment.checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, status: newStatus, score: newScore };
      }
      return item;
    });

    // Recalculate pillar scores
    const pillars: AssessmentPillar[] = [
      'Perimeter Security',
      'Access Control',
      'Physical Infrastructure',
      'Surveillance (CCTV)',
      'Incident Response Readiness'
    ];

    const pillarScores: Record<AssessmentPillar, number> = {} as any;
    let totalScoreSum = 0;

    pillars.forEach(p => {
      const pItems = updatedChecklist.filter(i => i.pillar === p);
      if (pItems.length > 0) {
        const pAvg = Math.round(pItems.reduce((acc, curr) => acc + curr.score, 0) / pItems.length);
        pillarScores[p] = pAvg;
        totalScoreSum += pAvg;
      } else {
        pillarScores[p] = 100;
        totalScoreSum += 100;
      }
    });

    const overallScore = Math.round(totalScoreSum / pillars.length);
    const updatedGaps = generateGapAnalysis(updatedChecklist);

    let verdict: SecurityAssessment['overallVerdict'] = 'SECURITY ADEQUATE';
    if (overallScore < 65) verdict = 'CRITICAL VULNERABILITY';
    else if (overallScore < 85) verdict = 'MITIGATION REQUIRED';

    const updatedAssessment: SecurityAssessment = {
      ...currentAssessment,
      complianceScore: overallScore,
      pillarScores,
      checklist: updatedChecklist,
      gapAnalysis: updatedGaps,
      overallVerdict: verdict
    };

    setAssessments(assessments.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
  };

  const handleCreateNewAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim()) return;

    const newId = `asm-${Date.now()}`;
    const newAss: SecurityAssessment = {
      id: newId,
      assessmentId: `ASM-2026-${String(assessments.length + 1).padStart(3, '0')}`,
      propertyName: newPropName.trim(),
      propertyType: newPropType,
      location: newPropLocation.trim(),
      assessorCallsign: currentUser?.callsign || 'OPERATOR-01',
      complianceScore: 78,
      pillarScores: {
        'Perimeter Security': 83,
        'Access Control': 75,
        'Physical Infrastructure': 50,
        'Surveillance (CCTV)': 75,
        'Incident Response Readiness': 50
      },
      checklist: BLUEPRINT_CHECKLIST,
      gapAnalysis: generateGapAnalysis(BLUEPRINT_CHECKLIST),
      conductedAt: new Date().toISOString(),
      status: 'COMPLETED',
      overallVerdict: 'MITIGATION REQUIRED'
    };

    setAssessments([newAss, ...assessments]);
    setSelectedAssessmentId(newId);
    setIsNewAssessmentModalOpen(false);
    setNewPropName('');
  };

  const handleEscalateGap = (gap: GapAnalysisItem) => {
    if (onEscalateToLogbook) {
      onEscalateToLogbook({
        title: `[GAP ASIS ${gap.pillar}] ${gap.gapDescription.slice(0, 70)}`,
        category: 'PHYSICAL_SECURITY',
        severity: gap.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        location: currentAssessment?.propertyName || 'Fasilitas Terinspeksi',
        description: `Inspeksi Standar ASIS International:\n${gap.gapDescription}\n\nRekomendasi Perbaikan:\n${gap.recommendation}`,
        actionTaken: 'Eskalasi temuan GAP Analysis audit fisik ke pimpinan operasional lapangan.'
      });
    }
  };

  // Pure JSON API Payload
  const generatePureJson = (): StandardAPIResponse<SecurityAssessment> => {
    return {
      module: 'ASSESSMENT',
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        summary: {
          standard: 'ASIS International Physical Security Assessment Framework',
          assessment_id: currentAssessment.assessmentId,
          property_name: currentAssessment.propertyName,
          property_type: currentAssessment.propertyType,
          overall_compliance_percentage: currentAssessment.complianceScore,
          verdict: currentAssessment.overallVerdict,
          pillar_breakdown: currentAssessment.pillarScores,
          total_gaps_identified: currentAssessment.gapAnalysis.length,
          critical_gaps_count: currentAssessment.gapAnalysis.filter(g => g.severity === 'CRITICAL').length
        },
        details: [currentAssessment],
        action_items: currentAssessment.gapAnalysis.map(g => `[${g.pillar}] ${g.recommendation}`)
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

  const filteredChecklist = currentAssessment?.checklist.filter(item => {
    if (activePillarTab === 'ALL') return true;
    return item.pillar === activePillarTab;
  }) || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
            AUDIT KEAMANAN FISIK // STANDAR ASIS INTERNATIONAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
            SECURITY <span className="text-red-600">ASSESSMENT</span> & GAP ANALYSIS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Audit 5 Pilar Utama: Perimeter, Akses Kontrol, Infrastruktur Fisik, CCTV, & Kesiapan Tanggap Darurat
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
            onClick={() => setIsNewAssessmentModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs rounded-xl shadow-glow-red flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>BUAT AUDIT BARU</span>
          </button>
        </div>
      </div>

      {/* 2. PROPERTY SELECTOR & COMPLIANCE SCORE HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
        
        {/* Facility Info Card */}
        <div className="lg:col-span-2 p-5 bg-[#090e1a] border border-zinc-800 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <span className="text-[11px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                OBJEK PROPERTI / FASILITAS TERINSPEKSI
              </span>
              
              {/* Dropdown Selector */}
              <select
                value={selectedAssessmentId}
                onChange={(e) => setSelectedAssessmentId(e.target.value)}
                className="px-3 py-1.5 bg-black/80 border border-zinc-700 rounded-lg text-zinc-200 text-xs font-bold focus:outline-none focus:border-red-600"
              >
                {assessments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.propertyName} ({a.propertyType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                {currentAssessment.propertyName}
              </h2>
              <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-3">
                <span>Wilayah: <strong className="text-zinc-200">{currentAssessment.location}</strong></span>
                <span>•</span>
                <span>Tipe: <strong className="text-cyan-400">{currentAssessment.propertyType}</strong></span>
                <span>•</span>
                <span>Auditor: <strong className="text-amber-400">{currentAssessment.assessorCallsign}</strong></span>
              </div>
            </div>
          </div>

          {/* 5 Pillars Progress Bar Overview */}
          <div className="pt-4 mt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            {Object.entries(currentAssessment.pillarScores).map(([pillar, score]) => (
              <div key={pillar} className="p-2 bg-black/40 border border-zinc-800/80 rounded-lg">
                <span className="text-[9px] text-zinc-500 uppercase block truncate" title={pillar}>
                  {pillar}
                </span>
                <span className={`text-base font-black ${
                  score >= 85 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Score Dial Card */}
        <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xl ${
          currentAssessment.complianceScore >= 85 
            ? 'bg-emerald-950/20 border-emerald-800/70' 
            : currentAssessment.complianceScore >= 65 
            ? 'bg-amber-950/20 border-amber-800/70' 
            : 'bg-red-950/20 border-red-800/70'
        }`}>
          <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-2">
            OVERALL COMPLIANCE SCORE
          </span>

          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#27272a"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={currentAssessment.complianceScore >= 85 ? '#10b981' : currentAssessment.complianceScore >= 65 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * currentAssessment.complianceScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{currentAssessment.complianceScore}%</span>
              <span className="text-[9px] text-zinc-400 uppercase">ASIS STD</span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
              currentAssessment.complianceScore >= 85 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600' 
                : currentAssessment.complianceScore >= 65 
                ? 'bg-amber-950 text-amber-300 border-amber-600' 
                : 'bg-red-950 text-red-300 border-red-600'
            }`}>
              {currentAssessment.overallVerdict}
            </span>
          </div>
        </div>
      </div>

      {/* 3. GAP ANALYSIS RECOMMENDATIONS SECTION */}
      {currentAssessment.gapAnalysis.length > 0 && (
        <div className="bg-[#090e1a] border border-red-900/60 rounded-2xl p-5 font-mono space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <span>TEMUAN GAP ANALYSIS (REKOMENDASI PERBAIKAN STANDAR ASIS):</span>
            </div>
            <span className="text-[10px] text-zinc-500">
              {currentAssessment.gapAnalysis.length} Celah Terdeteksi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {currentAssessment.gapAnalysis.map((gap) => (
              <div 
                key={gap.id}
                className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1.5 hover:border-red-600/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-bold text-cyan-300">
                    {gap.pillar}
                  </span>
                  <span className={`text-[10px] font-black ${
                    gap.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {gap.severity} GAP
                  </span>
                </div>

                <p className="text-zinc-200 font-semibold text-[11px] leading-snug">
                  {gap.gapDescription}
                </p>

                <p className="text-[11px] text-zinc-400 italic bg-zinc-900/40 p-2 rounded border border-zinc-800/80">
                  <strong className="text-zinc-300 not-italic">Rekomendasi ASIS:</strong> {gap.recommendation}
                </p>

                {onEscalateToLogbook && (
                  <div className="pt-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleEscalateGap(gap)}
                      className="px-2 py-0.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      <span>Eskalasi ke Logbook</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PILLARS FILTER TAB */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
        <button
          onClick={() => setActivePillarTab('ALL')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activePillarTab === 'ALL'
              ? 'bg-red-600 text-white shadow-glow-red'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Semua 5 Pilar ({currentAssessment.checklist.length})
        </button>

        {[
          'Perimeter Security',
          'Access Control',
          'Physical Infrastructure',
          'Surveillance (CCTV)',
          'Incident Response Readiness'
        ].map((pillar) => (
          <button
            key={pillar}
            onClick={() => setActivePillarTab(pillar as AssessmentPillar)}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
              activePillarTab === pillar
                ? 'bg-red-600 text-white shadow-glow-red'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {pillar}
          </button>
        ))}
      </div>

      {/* 5. INTERACTIVE AUDIT CHECKLIST */}
      <div className="space-y-3 font-mono">
        {filteredChecklist.map((item) => (
          <div 
            key={item.id}
            className="p-4 bg-[#090e1a] border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-bold text-cyan-400">
                  {item.pillar}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {item.question}
                </h4>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                <span className="text-zinc-500 font-bold">Standar Persyaratan:</span> {item.requirement}
              </p>

              <div className="text-[11px] text-zinc-300 bg-black/40 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                <span className="text-amber-400 font-bold">Catatan Temuan Lapangan:</span> {item.notes}
              </div>
            </div>

            {/* Toggle Status Buttons */}
            <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
              <button
                type="button"
                onClick={() => handleUpdateChecklistStatus(item.id, 'COMPLIANT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  item.status === 'COMPLIANT'
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>COMPLIANT (100%)</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateChecklistStatus(item.id, 'PARTIAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  item.status === 'PARTIAL'
                    ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PARTIAL (50%)</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateChecklistStatus(item.id, 'NON_COMPLIANT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  item.status === 'NON_COMPLIANT'
                    ? 'bg-red-600 text-white shadow-glow-red'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>NON-COMPLIANT (0%)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 6. MODAL: BUAT AUDIT BARU */}
      {isNewAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0a0f1d] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden font-mono">
            <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                  TAMBAH AUDIT PROPERTI BARU // ASIS
                </h3>
              </div>
              <button onClick={() => setIsNewAssessmentModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewAssessment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                  Nama Properti / Fasilitas Kritis *
                </label>
                <input
                  type="text"
                  required
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  placeholder="Contoh: Gedung Data Center Sektor Timur"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                  Tipe Properti (Fokus Area ASIS)
                </label>
                <select
                  value={newPropType}
                  onChange={(e) => setNewPropType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-bold"
                >
                  <option value="Vital Objects / Obvitnas">Vital Objects / Obvitnas</option>
                  <option value="Commercial">Commercial (Gedung Perkantoran / Mall)</option>
                  <option value="Hotels">Hotels (Perhotelan & Resort)</option>
                  <option value="Apartments">Apartments (Hunian Bertingkat)</option>
                  <option value="Residential">Residential (Perumahan)</option>
                  <option value="Data Center">Data Center / Fasilitas Server</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase text-[11px]">
                  Lokasi / Wilayah
                </label>
                <input
                  type="text"
                  required
                  value={newPropLocation}
                  onChange={(e) => setNewPropLocation(e.target.value)}
                  placeholder="e.g. Jakarta Selatan / DKI Jakarta"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAssessmentModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-glow-red flex items-center gap-1.5"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>BUAT & MULAI AUDIT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: JSON API EXPORT VIEW */}
      {jsonExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0a0f1d] border border-cyan-700/80 rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                  PAYLOAD RESMI API ASSESSMENT (ASIS INTERNATIONAL SCHEMA)
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
                100% Parsable JSON • ASIS Standard • Zero Bug Schema
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
