import React, { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  FileText,
  Activity,
  PlusCircle,
  Zap,
  Target,
  BarChart3,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  Download,
  AlertCircle,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AIAnalysisResult, LogEntry, SeverityLevel } from '../types';

interface AIThreatAnalysisProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
  onEscalateToLogbook?: (log: Partial<LogEntry>) => void;
}

const TACTICAL_PROMPTS = [
  {
    title: 'Phishing Email Kementerian',
    category: 'INITIAL ACCESS',
    prompt: 'Analisis email masuk berkas lampiran "Perubahan_Regulasi_Pajak_2026.iso" yang dikirimkan dari alamat spoofing info@kemenkeu-portal-update.com dengan IP origin 194.26.29.112.'
  },
  {
    title: 'DNS Beaconing Malware C2',
    category: 'COMMAND & CONTROL',
    prompt: 'Investigasi anomali query DNS internal dengan pola TXT query base64 berulang setiap 30 detik menuju domain ns1.cloud-sync-resolver.top dari workstation 10.20.4.88.'
  },
  {
    title: 'Credential Stuffing Perbankan',
    category: 'CREDENTIAL ACCESS',
    prompt: 'Terdeteksi 45,000 percobaan login gagal dalam 10 menit dengan variasi user-agent Linux/Python-requests menyerang endpoint REST API login m-banking nasional.'
  },
  {
    title: 'Ransomware Process Injection',
    category: 'EXECUTION & DEFENSE EVASION',
    prompt: 'Analisis deteksi EDR atas eksekusi powershell.exe terenkripsi base64 yang mencoba menghentikan service vss (Volume Shadow Copy) dan menginjeksi process svchost.exe.'
  }
];

export const AIThreatAnalysis: React.FC<AIThreatAnalysisProps> = ({ 
  initialQuery, 
  onClearInitialQuery,
  onEscalateToLogbook 
}) => {
  const { currentUser, getOperatorStorage, setOperatorStorage } = useAuth();

  // Ambil data logbook aktual dari akun operator aktif
  const [operatorLogs] = useState<LogEntry[]>(() => {
    return getOperatorStorage<LogEntry[]>('daily_logbook', []);
  });

  // Kalkulasi Skor Ancaman Nasional (0 - 100) berdasarkan logbook harian
  const { threatScore, severityCounts, threatVerdictLabel, threatColorClass } = useMemo(() => {
    const counts = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };

    operatorLogs.forEach(log => {
      if (log.severity === 'CRITICAL') counts.CRITICAL++;
      else if (log.severity === 'HIGH') counts.HIGH++;
      else if (log.severity === 'MEDIUM') counts.MEDIUM++;
      else counts.LOW++;
    });

    // Bobot penilaian ancaman: Dasar 28 + (Critical * 18) + (High * 9) + (Medium * 4) + (Low * 1)
    let score = 28 + (counts.CRITICAL * 18) + (counts.HIGH * 9) + (counts.MEDIUM * 4) + (counts.LOW * 1);
    score = Math.min(Math.max(score, 15), 98);

    let verdict = 'GUARDED / NORMAL';
    let color = 'text-emerald-400 stroke-emerald-500';

    if (score >= 80) {
      verdict = 'CRITICAL ALERT (DEFCON 2)';
      color = 'text-red-500 stroke-red-600';
    } else if (score >= 65) {
      verdict = 'ELEVATED THREAT (DEFCON 3)';
      color = 'text-orange-400 stroke-orange-500';
    } else if (score >= 45) {
      verdict = 'MODERATE SUSPICION (DEFCON 4)';
      color = 'text-yellow-400 stroke-yellow-500';
    }

    return {
      threatScore: score,
      severityCounts: counts,
      threatVerdictLabel: verdict,
      threatColorClass: color
    };
  }, [operatorLogs]);

  // Automated Daily Briefing State
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [briefingTimestamp, setBriefingTimestamp] = useState<string>(() => {
    return getOperatorStorage<string>('ai_last_briefing_time', 'Auto-generated at 06:00 WIB - Completed');
  });
  const [executiveSummary, setExecutiveSummary] = useState<string>(() => {
    return getOperatorStorage<string>('ai_executive_summary', 
      'Berdasarkan sintesis logbook operasional 24 jam terakhir, postur keamanan nasional berada pada status SIAGA ELEVATED (Skor 86/100) dipicu eskalasi aktivitas beaconing trojan spionase APT-38 yang menyasar sektor perbankan pusat di DKI Jakarta, serta insiden penyelundupan senjata api gelap di jalur maritim Selat Malaka yang berhasil diintersepsi. Potensi kerentanan bypass VPN gateway kementerian dan ancaman erupsi Gunung Marapi memerlukan pemantauan kontinyu lintas matra guna mencegah disrupsi layanan publik strategis dan kepanikan sosial.'
    );
  });
  const [operationalRecommendations, setOperationalRecommendations] = useState<string[]>([
    'Perketat inspeksi paket firewall perimeter dan isolasi subnet terminal perbankan yang terindikasi anomali koneksi ke node C2 luar negeri.',
    'Intensifkan patroli udara maritim dan radar pesisir di koridor ALKI I guna menutup celah penyelundupan senjata lintas batas perairan Riau.',
    'Distribusikan patch keamanan zero-day darurat pada seluruh appliance VPN gateway instansi pemerintah dalam tempo 1x24 jam.',
    'Pertahankan status Siaga III dan koordinasi tim logistik darurat BNPB untuk evakuasi warga dalam radius bahaya 4.5 km Gunung Marapi.'
  ]);

  // Form Input Analisis Kustom
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeResult, setActiveResult] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setInputText(initialQuery);
      handleAnalyze(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  // Handler Generate AI Briefing Otomatis dari Daily Logbook
  const handleGenerateAIBriefing = () => {
    setIsGeneratingBriefing(true);

    setTimeout(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const newTime = `Auto-generated at ${hours}:${minutes} WIB - Completed`;

      // Ekstraksi data logbook terkini
      const critTitles = operatorLogs.filter(l => l.severity === 'CRITICAL').map(l => l.title);
      const highTitles = operatorLogs.filter(l => l.severity === 'HIGH').map(l => l.title);
      
      const summaryText = `Berdasarkan rekapitulasi ${operatorLogs.length} insiden operasional pada logbook SOC per ${hours}:${minutes} WIB, postur ancaman nasional dievaluasi pada tingkat ${threatVerdictLabel} (Skor Risiko: ${threatScore}/100). Fokus atensi prioritas tertuju pada penanganan ${critTitles.length > 0 ? critTitles[0] : 'anomali lalu lintas data perimeter'} serta eskalasi ${highTitles.length > 0 ? highTitles[0] : 'gangguan infrastruktur publik'}. Koordinasi taktis antar-instansi (TNI/Polri, BSSN, dan BNPB) telah mengaktifkan protokol mitigasi terpadu guna menjaga integritas kedaulatan informasi serta keselamatan publik di seluruh wilayah NKRI.`;

      const newRecs = [
        `Pertahankan status pemantauan siaga tinggi pada ${operatorLogs[0]?.location || 'Sektor Jakarta & Batam'} dengan inspeksi berkala per 15 menit.`,
        'Verifikasi integritas backup offline dan rotasi kunci otentikasi biometrik pada server komando utama.',
        'Lakukan cross-referencing IOC indikator kompromi terbaru dengan repositori global CSIRT.',
        'Kirimkan SITREP berkala ke pimpinan komando sebelum briefing operasional berikutnya.'
      ];

      setExecutiveSummary(summaryText);
      setOperationalRecommendations(newRecs);
      setBriefingTimestamp(newTime);
      setOperatorStorage('ai_executive_summary', summaryText);
      setOperatorStorage('ai_last_briefing_time', newTime);
      setIsGeneratingBriefing(false);
    }, 1200);
  };

  // Handler Analisis Query Kustom
  const handleAnalyze = (queryToRun?: string) => {
    const text = queryToRun || inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let riskScore = 88;
      let verdict: AIAnalysisResult['threatVerdict'] = 'CRITICAL THREAT';
      let mitreTactics = ['T1566: Phishing', 'T1204: User Execution', 'T1071: Standard Application Layer Protocol', 'T1059: Command & Scripting Interpreter'];
      let summary = '';
      let action = '';

      if (lower.includes('dns') || lower.includes('beacon') || lower.includes('c2')) {
        riskScore = 94;
        verdict = 'CRITICAL THREAT';
        mitreTactics = ['T1071.004: DNS Application Layer Protocol', 'T1572: Protocol Tunneling', 'T1041: Exfiltration Over C2 Channel'];
        summary = 'Anomali DNS Beaconing terkonfirmasi sebagai saluran komunikasi tertutup malware C2 (Command & Control). Payload base64 menandakan eksfiltrasi data terenkripsi atau penerimaan instruksi kendali jarak jauh.';
        action = '1. Isolasi host endpoint terdampak dari subnet produksi.\n2. Sinkronkan pemblokiran wildcard DNS domain C2 pada seluruh recursive resolver internal.\n3. Lakukan snapshot live RAM memori untuk analisis binary malware.';
      } else if (lower.includes('phish') || lower.includes('email') || lower.includes('.iso')) {
        riskScore = 85;
        verdict = 'CRITICAL THREAT';
        mitreTactics = ['T1566.001: Spearphishing Attachment', 'T1204.002: Malicious File', 'T1553.005: Mark-of-the-Web Bypass via Container (ISO)'];
        summary = 'Kampanye spear-phishing berkedok institusi negara memanfaatkan berkas arsip kontainer ISO untuk mem-bypass inspeksi email gateway dan proteksi Mark-of-the-Web Windows.';
        action = '1. Lakukan quarantine email di seluruh mail-server exchange organisasi.\n2. Masukkan hash berkas ISO dan IP pengirim ke daftar blacklist CSIRT nasional.\n3. Verifikasi apakah ada staf yang sempat mengeksekusi berkas lampiran.';
      } else {
        riskScore = 76;
        verdict = 'ELEVATED SUSPICION';
        mitreTactics = ['T1059: Command and Scripting Interpreter', 'T1027: Obfuscated Files or Information', 'T1490: Inhibit System Recovery'];
        summary = `Hasil evaluasi kecerdasan buatan mendeteksi probabilitas ancaman sebesar ${riskScore}% pada indikator yang diserahkan. Karakteristik anomali mengindikasikan aktivitas ofensif yang memerlukan investigasi mendalam.`;
        action = '1. Terapkan pemantauan khusus pada semua entitas/artefak terkait.\n2. Catat seluruh IOC ke Daily Logbook SOC untuk cross-referencing intelijen.\n3. Siapkan langkah kontainmen jika aktivitas eskalasi meningkat.';
      }

      const result: AIAnalysisResult = {
        id: `ai-eval-${Date.now()}`,
        targetOrQuery: text,
        riskScore,
        threatVerdict: verdict,
        mitreTactics,
        summary,
        recommendedAction: action,
        analyzedAt: new Date().toLocaleTimeString('id-ID') + ' WIB'
      };

      setActiveResult(result);
      setIsAnalyzing(false);
    }, 1100);
  };

  // Salin Draf Briefing Eksekutif ke Clipboard
  const handleCopyBriefing = () => {
    const textToCopy = `[INTEL NUSANTARA - EXECUTIVE DAILY THREAT BRIEFING]
STATUS: ${threatVerdictLabel} (THREAT SCORE: ${threatScore}/100)
WAKTU GENERATE: ${briefingTimestamp}
OPERATOR: ${currentUser?.callsign || 'GARUDA-01'} (${currentUser?.badgeNumber || 'IN-8890'})

DRAF LAPORAN EKSEKUTIF:
${executiveSummary}

REKOMENDASI LANGKAH OPERASIONAL:
${operationalRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2000);
  };

  // Unduh Berkas SITREP AI Briefing
  const handleDownloadBriefing = () => {
    const fullContent = `================================================================================
INTEL NUSANTARA COMMAND - AI-POWERED THREAT BRIEFING REPORT
KLASIFIKASI: TOP SECRET // NOFORN
STATUS SINTESIS: ${briefingTimestamp}
OPERATOR: ${currentUser?.callsign} (${currentUser?.badgeNumber})
THREAT SEVERITY SCORE: ${threatScore}/100 (${threatVerdictLabel})
================================================================================

1. EXECUTIVE SUMMARY (DRAF LAPORAN EKSEKUTIF):
${executiveSummary}

2. MATRIKS DISTRIBUSI INSIDEN LOGBOOK:
• Critical Incidents : ${severityCounts.CRITICAL} Kasus
• High Severity      : ${severityCounts.HIGH} Kasus
• Medium Severity    : ${severityCounts.MEDIUM} Kasus
• Low / Guarded      : ${severityCounts.LOW} Kasus
Total Laporan Aktif  : ${operatorLogs.length} Entri

3. REKOMENDASI LANGKAH OPERASIONAL LANJUTAN:
${operationalRecommendations.map((r, i) => `[REKOMENDASI #${i + 1}]\n${r}`).join('\n\n')}

================================================================================
VERIFIED BY NEURAL INTEL SYSTEM V4.2 • DIREKTORAT OPERASI KEAMANAN SIBER
================================================================================`;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-BRIEFING-REPORT-${threatScore}PTS-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Kalkulasi Sudut Needle dan Dashoffset untuk Gauge Visual
  // Circle perimeter = 2 * PI * r = 2 * 3.14159 * 75 ≈ 471
  const gaugeCircumference = 471;
  const strokeDashoffset = gaugeCircumference - (threatScore / 100) * (gaugeCircumference * 0.75);

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 1. TOP BANNER HEADER */}
      <div className="bg-[#090e1a] border border-cyan-800/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-700/60 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Cpu className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              AI-POWERED THREAT ANALYSIS & DAILY BRIEFING
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-400">
              MESIN SINTESIS INTELIJEN V4.2
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> SINKRON LOGBOOK SOC
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mt-2">
            Pusat Penilaian Skor Ancaman & Generator Briefing Eksekutif
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Kalkulasi otomatis Threat Severity Score (0-100) berbasis bobot insiden harian, peringkasan cerdas draf briefing eksekutif, serta rekomendasi taktis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleGenerateAIBriefing}
            disabled={isGeneratingBriefing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold shadow-glow-red flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingBriefing ? 'animate-spin' : ''}`} />
            <span>{isGeneratingBriefing ? 'MEN-GENERATE BRIEFING...' : 'GENERATE AI BRIEFING'}</span>
          </button>
        </div>
      </div>

      {/* 2. DUAL PANEL: THREAT SEVERITY GAUGE & METRICS BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Visual Dial/Gauge Skor Ancaman (0 - 100) */}
        <div className="lg:col-span-5 bg-[#090e1a] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 font-mono flex flex-col justify-between relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <h3 className="font-bold text-sm text-white tracking-wider">
                THREAT SEVERITY SCORE
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-700">
              KALKULASI OTOMATIS
            </span>
          </div>

          {/* Semicircular / Circular Gauge Meter */}
          <div className="relative flex flex-col items-center justify-center py-2">
            <svg className="w-56 h-56 transform -rotate-135" viewBox="0 0 200 200">
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r="75"
                fill="none"
                stroke="#182234"
                strokeWidth="14"
                strokeDasharray={`${gaugeCircumference * 0.75} ${gaugeCircumference * 0.25}`}
                strokeLinecap="round"
              />

              {/* Dynamic Animated Value Arc */}
              <circle
                cx="100"
                cy="100"
                r="75"
                fill="none"
                stroke={threatScore >= 80 ? '#dc2626' : threatScore >= 65 ? '#f97316' : threatScore >= 45 ? '#eab308' : '#10b981'}
                strokeWidth="14"
                strokeDasharray={`${gaugeCircumference * 0.75} ${gaugeCircumference * 0.25}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: threatScore >= 80 ? 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.7))' : 'none'
                }}
              />
            </svg>

            {/* Center Gauge Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2 pointer-events-none">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                {threatScore}
              </span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                SKALA 0 - 100
              </span>
              <span className={`text-[11px] font-black uppercase px-2 py-0.5 mt-1.5 rounded border ${
                threatScore >= 80 ? 'bg-red-950 text-red-400 border-red-700' :
                threatScore >= 65 ? 'bg-orange-950 text-orange-400 border-orange-700' :
                'bg-emerald-950 text-emerald-400 border-emerald-700'
              }`}>
                {threatVerdictLabel}
              </span>
            </div>
          </div>

          {/* Gauge Scale Labels */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold px-4 border-t border-zinc-800/80 pt-3">
            <span className="text-emerald-400">0 (LOW)</span>
            <span className="text-yellow-400">45 (MEDIUM)</span>
            <span className="text-orange-400">65 (HIGH)</span>
            <span className="text-red-500">100 (CRITICAL)</span>
          </div>

        </div>

        {/* Right Column (7 cols): Logbook Metrics & Breakdown Card */}
        <div className="lg:col-span-7 bg-[#090e1a] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 font-mono flex flex-col justify-between">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white tracking-wider">
                DISTRIBUSI LOGBOOK HARIAN & BOBOT ANCAMAN
              </h3>
            </div>
            <span className="text-[11px] text-zinc-400">
              Total Insiden: <span className="text-white font-bold">{operatorLogs.length}</span>
            </span>
          </div>

          {/* 4 Severity Mini-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-red-400">CRITICAL</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              </div>
              <div className="text-2xl font-black text-white">
                {severityCounts.CRITICAL}
              </div>
              <div className="text-[9px] text-zinc-400">Bobot: +18 pts/kasus</div>
            </div>

            <div className="p-3 bg-orange-950/40 border border-orange-800/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-400">HIGH</span>
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              </div>
              <div className="text-2xl font-black text-white">
                {severityCounts.HIGH}
              </div>
              <div className="text-[9px] text-zinc-400">Bobot: +9 pts/kasus</div>
            </div>

            <div className="p-3 bg-yellow-950/40 border border-yellow-800/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-yellow-400">MEDIUM</span>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              </div>
              <div className="text-2xl font-black text-white">
                {severityCounts.MEDIUM}
              </div>
              <div className="text-[9px] text-zinc-400">Bobot: +4 pts/kasus</div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400">LOW</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-black text-white">
                {severityCounts.LOW}
              </div>
              <div className="text-[9px] text-zinc-400">Bobot: +1 pts/kasus</div>
            </div>

          </div>

          {/* Logbook Quick Correlation Notice */}
          <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl text-xs space-y-1.5 font-sans">
            <div className="flex items-center gap-2 font-mono font-bold text-zinc-200">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>SINTESIS REAL-TIME DARI DAILY LOGBOOK</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Skor ancaman dihitung otomatis secara transparan dari akumulasi catatan logbook operator <span className="text-white font-mono font-bold">{currentUser?.callsign}</span>. Setiap laporan baru berkategori Kritis atau Tinggi yang Anda catat akan otomatis menggeser jarum dial ancaman nasional secara real-time.
            </p>
          </div>

          {/* Sub-Actions */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[11px] text-zinc-500">
              Basis Data: Isolated Operator Sandbox
            </span>
            <button
              onClick={handleGenerateAIBriefing}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Sinkronkan Ulang Draf</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* 3. DAILY BRIEFING CARD (AUTOMATED SUMMARY GENERATOR) */}
      <div className="bg-[#090e1a] border border-red-600/50 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5 font-mono relative overflow-hidden">
        
        {/* Glow Ambient Corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Briefing Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-red-950 border border-red-700 rounded-xl text-red-500 shadow-glow-red">
                <FileText className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-white tracking-wide">
                DAILY EXECUTIVE THREAT BRIEFING
              </h3>
            </div>
            {/* Status Ringkasan Harian (Contoh: Auto-generated at 06:00 WIB - Completed) */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-bold text-zinc-200">{briefingTimestamp}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi AI Core
              </span>
            </div>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyBriefing}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedBriefing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBriefing ? 'TERSALIN' : 'SALIN BRIEFING'}</span>
            </button>

            <button
              onClick={handleDownloadBriefing}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Unduh laporan lengkap ke file teks"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>EKSPOR SITREP</span>
            </button>
          </div>
        </div>

        {/* Draf Laporan Eksekutif (1 Paragraf Rangkuman Tajam) */}
        <div className="space-y-2 relative z-10">
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-red-500" />
            RINGKASAN EKSEKUTIF SITUASI ANCAMAN NASIONAL (EXECUTIVE SUMMARY):
          </label>
          <div className="p-4 sm:p-5 bg-black/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans font-normal shadow-inner">
            {executiveSummary}
          </div>
        </div>

        {/* Rekomendasi Langkah Operasional Selanjutnya */}
        <div className="space-y-2 relative z-10">
          <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            REKOMENDASI LANGKAH OPERASIONAL SELANJUTNYA (NEXT ACTIONABLE PROTOCOLS):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {operationalRecommendations.map((rec, idx) => (
              <div 
                key={idx}
                className="p-3 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-300 flex items-start gap-2.5 font-sans transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 border border-red-800/80 flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-snug">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. TACTICAL PROMPT SIMULATION & CUSTOM PAYLOAD ANALYZER */}
      <div className="space-y-4 font-mono">
        
        {/* Preset Tactical Simulations */}
        <div className="space-y-2">
          <span className="text-[11px] text-zinc-400 uppercase font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> SIMULASI ANCAMAN SIBER SPESIFIK (KLIK UNTUK EVALUASI):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {TACTICAL_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p.prompt);
                  handleAnalyze(p.prompt);
                }}
                className="p-3 rounded-xl bg-[#090e1a] hover:bg-[#0e1628] border border-zinc-800 hover:border-cyan-600/60 text-left transition-all duration-200 group"
              >
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
                  {p.category}
                </div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-white leading-snug">
                  {p.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box Area */}
        <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-500" />
              INPUT PAYLOAD / RAW LOG / ARTEFAK ANCAMAN
            </span>
            <span className="text-[10px] text-zinc-500">Mendukung IOC, Log Snort, Base64, & Teks Bebas</span>
          </label>

          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik atau tempel artefak ancaman di sini (contoh: Deteksi koneksi mencurigakan ke IP 185.220.101.45 port 443 dengan payload PowerShell terenkripsi)..."
            className="w-full p-3.5 bg-black/70 border border-zinc-700/80 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-zinc-400">
              Karakter: <span className="text-zinc-200">{inputText.length}</span>
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !inputText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>MEMPROSES ANALISIS INTELIJEN...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>EKSEKUSI PENILAIAN ANCAMAN AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Assessment Result Card */}
        {activeResult && (
          <div className="bg-[#090e1a] border border-cyan-600/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-red-500 shadow-glow-red">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400">PUTUSAN ANCAMAN SIBER:</span>
                  <h3 className="text-base sm:text-lg font-black text-red-500 tracking-wider">
                    {activeResult.threatVerdict} ({activeResult.riskScore}/100)
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block">Waktu Evaluasi: {activeResult.analyzedAt}</span>
              </div>
            </div>

            {/* MITRE ATT&CK */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-300 uppercase">PEMETAAN MITRE ATT&CK:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {activeResult.mitreTactics.map((tactic, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-black border border-cyan-800 text-cyan-300 text-xs">
                    {tactic}
                  </span>
                ))}
              </div>
            </div>

            {/* Ringkasan */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-300 uppercase">RINGKASAN INTELIJEN:</span>
              <p className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-sans leading-relaxed">
                {activeResult.summary}
              </p>
            </div>

            {/* Mitigasi */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase">PROTOKOL PENANGGULANGAN:</span>
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 whitespace-pre-line leading-relaxed font-mono">
                {activeResult.recommendedAction}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              {onEscalateToLogbook && (
                <button
                  onClick={() => onEscalateToLogbook({
                    title: `[AI Threat Assessment] ${activeResult.threatVerdict}: ${activeResult.targetOrQuery.slice(0, 50)}...`,
                    description: activeResult.summary,
                    actionTaken: activeResult.recommendedAction,
                    severity: activeResult.riskScore >= 80 ? 'CRITICAL' : 'HIGH',
                    category: 'Cyber Attack'
                  })}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-glow-red flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>ESKALASI KE DAILY LOGBOOK</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
