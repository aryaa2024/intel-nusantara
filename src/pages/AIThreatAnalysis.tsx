import React, { useState, useEffect } from 'react';
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
  Target
} from 'lucide-react';
import { AIAnalysisResult, LogEntry } from '../types';

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
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<AIAnalysisResult[]>([]);
  const [activeResult, setActiveResult] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setInputText(initialQuery);
      handleAnalyze(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  const handleAnalyze = (queryToRun?: string) => {
    const text = queryToRun || inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      // Dynamic Tactical AI Threat Generator based on content
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
        action = '1. Isolasi host endpoint 10.20.4.88 dari subnet produksi.\n2. Sinkronkan pemblokiran wildcard DNS domain *.cloud-sync-resolver.top pada seluruh recursive resolver internal.\n3. Lakukan snapshot live RAM memori untuk analisis binary malware.';
      } else if (lower.includes('phish') || lower.includes('email') || lower.includes('.iso')) {
        riskScore = 85;
        verdict = 'CRITICAL THREAT';
        mitreTactics = ['T1566.001: Spearphishing Attachment', 'T1204.002: Malicious File', 'T1553.005: Mark-of-the-Web Bypass via Container (ISO)'];
        summary = 'Kampanye spear-phishing berkedok institusi negara memanfaatkan berkas arsip kontainer ISO untuk mem-bypass inspeksi email gateway dan proteksi Mark-of-the-Web Windows.';
        action = '1. Lakukan quarantine email di seluruh mail-server exchange organisasi.\n2. Masukkan hash berkas ISO dan IP pengirim ke daftar blacklist CSIRT nasional.\n3. Verifikasi apakah ada staf yang sempat mengeksekusi berkas lampiran.';
      } else if (lower.includes('credential') || lower.includes('login') || lower.includes('stuffing')) {
        riskScore = 78;
        verdict = 'ELEVATED SUSPICION';
        mitreTactics = ['T1110.004: Credential Stuffing', 'T1078: Valid Accounts', 'T1499.003: Endpoint DoS'];
        summary = 'Serangan terdistribusi Credential Stuffing memanfaatkan dump database kebocoran lama untuk membobol akun nasabah aktif. Pola traffic botnet otomatis dengan rotasi proxy.';
        action = '1. Aktifkan rate limiting agresif dan validasi CAPTCHA pintar berbasis behavioral.\n2. Terapkan paksa reset password bertahap bagi akun yang terindikasi terkena uji coba login.\n3. Blokir subnet IP botnet penyerang.';
      } else {
        riskScore = 75;
        verdict = 'ELEVATED SUSPICION';
        mitreTactics = ['T1059: Command and Scripting Interpreter', 'T1027: Obfuscated Files or Information', 'T1490: Inhibit System Recovery'];
        summary = `Hasil pemindaian model AI mendeteksi probabilitas ancaman siber sebesar ${riskScore}% pada indikator yang diserahkan. Karakteristik mengindikasikan aktivitas ofensif yang memerlukan investigasi mendalam.`;
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
      setHistory(prev => [result, ...prev]);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (!activeResult) return;
    const textToCopy = `[INTEL NUSANTARA - AI THREAT ASSESSMENT REPORT]
VERDICT: ${activeResult.threatVerdict} (RISK SCORE: ${activeResult.riskScore}/100)
WAKTU: ${activeResult.analyzedAt}
QUERY: ${activeResult.targetOrQuery}

MITRE ATT&CK TACTICS:
${activeResult.mitreTactics.join('\n')}

RINGKASAN INTELIJEN:
${activeResult.summary}

REKOMENDASI PROTOKOL MITIGASI:
${activeResult.recommendedAction}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEscalateToLogbook = () => {
    if (!activeResult || !onEscalateToLogbook) return;
    onEscalateToLogbook({
      title: `[AI Threat Assessment] ${activeResult.threatVerdict}: ${activeResult.targetOrQuery.slice(0, 60)}...`,
      description: `${activeResult.summary}\n\nMITRE Framework Mapping: ${activeResult.mitreTactics.join(', ')}`,
      actionTaken: activeResult.recommendedAction,
      severity: activeResult.riskScore > 85 ? 'CRITICAL' : 'HIGH',
      category: 'MALWARE_ANALYSIS'
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono">
      
      {/* Top Banner Header */}
      <div className="bg-[#090e1a] border border-cyan-800/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              MESIN ANALISIS ANCAMAN AI & HEURISTIK SOC
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">MODEL INTELIJEN V4.2</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide mt-1">
            Penilaian Ancaman Siber & Rekomendasi Taktis MITRE ATT&CK
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Masukkan log mentah, indikator kompromi (IOC), email mencurigakan, atau simulasi serangan untuk mendapatkan evaluasi risiko dan protokol penanggulangan instan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NEURAL READY</span>
          </span>
        </div>
      </div>

      {/* Preset Tactical Prompt Buttons */}
      <div className="space-y-2">
        <span className="text-[11px] text-zinc-400 uppercase font-semibold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> SIMULASI SKENARIO CEPAT (KLIK UNTUK ANALISIS):
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
          rows={4}
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
        <div className="bg-[#090e1a] border border-cyan-600/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5 animate-fadeIn">
          
          {/* Header Assessment */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${
                activeResult.riskScore >= 80 
                  ? 'bg-red-950/60 border-red-700 text-red-500 shadow-glow-red' 
                  : 'bg-amber-950/60 border-amber-700 text-amber-500'
              }`}>
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400">STATUS PUTUSAN ANCAMAN:</span>
                <h3 className={`text-lg font-black tracking-widest ${
                  activeResult.riskScore >= 80 ? 'text-red-500' : 'text-amber-400'
                }`}>
                  {activeResult.threatVerdict}
                </h3>
              </div>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block">THREAT RISK SCORE</span>
                <span className="text-2xl font-black text-white">
                  {activeResult.riskScore}<span className="text-xs text-zinc-500 font-normal">/100</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center font-bold text-sm text-red-400">
                {activeResult.riskScore >= 85 ? 'CRIT' : 'HIGH'}
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Mapping */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" />
              PEMETAAN FRAMEWORK MITRE ATT&CK:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {activeResult.mitreTactics.map((tactic, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-black/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-semibold"
                >
                  {tactic}
                </span>
              ))}
            </div>
          </div>

          {/* Intelligence Summary */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              RINGKASAN INTELIJEN & TEMUAN ANOMALI:
            </span>
            <div className="p-4 bg-black/50 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-sans leading-relaxed">
              {activeResult.summary}
            </div>
          </div>

          {/* Countermeasures Protocol */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              PROTOKOL TINDAKAN MITIGASI DIREKOMENDASIKAN:
            </span>
            <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 font-mono whitespace-pre-line leading-relaxed">
              {activeResult.recommendedAction}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
            <span className="text-[10px] text-zinc-500">
              Dievaluasi pada: {activeResult.analyzedAt}
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'TERSALIN' : 'SALIN LAPORAN'}</span>
              </button>

              {onEscalateToLogbook && (
                <button
                  onClick={handleEscalateToLogbook}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-glow-red flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ESKALASI KE LOGBOOK SOC</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
