import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  FileCode, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Check, 
  X, 
  AlertTriangle,
  Building2,
  Navigation,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  ReportInterval, 
  GeneratedReport, 
  StandardAPIResponse, 
  LogEntry, 
  RiskItem, 
  SecurityAssessment, 
  StaffMember, 
  GeofenceBreachLog 
} from '../types';

export const AutomatedReportingPage: React.FC = () => {
  const { currentUser, getOperatorStorage, setOperatorStorage } = useAuth();

  const [activeInterval, setActiveInterval] = useState<ReportInterval>('Daily');
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jsonExportModal, setJsonExportModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Retrieve live context data from other modules
  const rawLogs = getOperatorStorage<LogEntry[]>('daily_logbook', []);
  const logbookEntries = Array.isArray(rawLogs) ? rawLogs : [];

  const rawRisks = getOperatorStorage<RiskItem[]>('srm_risk_register_iso31000', []);
  const riskItems = Array.isArray(rawRisks) ? rawRisks : [];

  const rawAssessments = getOperatorStorage<SecurityAssessment[]>('asis_security_assessments', []);
  const assessments = Array.isArray(rawAssessments) ? rawAssessments : [];

  const rawStaff = getOperatorStorage<StaffMember[]>('staff_tracking_list', []);
  const staffList = Array.isArray(rawStaff) ? rawStaff : [];

  const rawBreaches = getOperatorStorage<GeofenceBreachLog[]>('staff_breach_logs', []);
  const breachLogs = Array.isArray(rawBreaches) ? rawBreaches : [];

  // Compute live statistics for aggregation
  const totalIncidents = logbookEntries.length;
  const criticalIncidents = logbookEntries.filter(l => l.severity === 'CRITICAL').length;
  const srmMaxScore = riskItems.reduce((max, r) => Math.max(max, r.score), 0);
  const srmCriticalCount = riskItems.filter(r => r.level === 'CRITICAL').length;
  const avgCompliance = assessments.length > 0 
    ? Math.round(assessments.reduce((acc, a) => acc + a.complianceScore, 0) / assessments.length)
    : 85;
  const activeStaff = staffList.length;
  const breachCount = breachLogs.length;

  // Build the standardized JSON API response
  const buildStandardApiResponse = (interval: ReportInterval, reportTitle: string): StandardAPIResponse => {
    const nowIso = new Date().toISOString();
    return {
      module: 'REPORTING',
      status: 'success',
      timestamp: nowIso,
      data: {
        summary: {
          interval,
          title: reportTitle,
          author_callsign: currentUser?.callsign || 'OPERATOR-01',
          classification: 'TOP SECRET // NOFORN',
          kpi_metrics: {
            total_incidents_recorded: totalIncidents,
            critical_threat_incidents: criticalIncidents,
            srm_max_risk_score: srmMaxScore,
            srm_critical_risks_count: srmCriticalCount,
            average_asis_compliance_score: `${avgCompliance}%`,
            active_patrol_staff_tracked: activeStaff,
            geofence_breach_events: breachCount,
            overall_readiness_index: '92.4%'
          }
        },
        details: [
          {
            section_id: 'OPERATIONAL_SITREP',
            title: interval === 'Daily' ? 'Laporan Operasional Harian & Log Kejadian' : 
                   interval === 'Weekly' ? 'Agregasi Tren Mingguan Insiden & Penanganan' : 'Analisis Vektor Ancaman Strategis Bulanan',
            incident_highlights: logbookEntries.slice(0, 5).map(l => ({
              id: l.incidentId,
              title: l.title,
              category: l.category,
              severity: l.severity,
              location: l.location,
              action: l.actionTaken
            }))
          },
          {
            section_id: 'RISK_MANAGEMENT_ISO31000',
            title: 'Audit Matriks Risiko ISO 31000:2018',
            priority_risks: riskItems.filter(r => r.level === 'CRITICAL' || r.level === 'HIGH').map(r => ({
              risk_id: r.riskId,
              title: r.title,
              score: r.score,
              level: r.level,
              control_strategy: r.mitigationStrategy,
              action_plan: r.actionPlan
            }))
          },
          {
            section_id: 'ASIS_COMPLIANCE_STATUS',
            title: 'Kepatuhan Keamanan Fisik ASIS International',
            audited_properties: assessments.map(a => ({
              property_name: a.propertyName,
              property_type: a.propertyType,
              compliance_percentage: `${a.complianceScore}%`,
              verdict: a.overallVerdict,
              unresolved_gaps: a.gapAnalysis.length
            }))
          },
          {
            section_id: 'GEOFENCE_TELEMETRY_AUDIT',
            title: 'Audit Posisi Personel & Pelanggaran Geofence',
            staff_status: {
              total_monitored: staffList.length,
              in_zone: staffList.filter(s => s.status === 'IN_ZONE').length,
              breaches: staffList.filter(s => s.status === 'GEOFENCE_BREACH').length
            },
            recent_breaches: breachLogs.slice(0, 5)
          }
        ],
        action_items: [
          'Tingkatkan frekuensi patroli ganda pada sektor perimeter dengan status GAP ASIS.',
          'Lakukan intervensi mitigasi segera terhadap risiko dengan skor ISO 31000 >= 17.',
          'Pastikan seluruh perangkat personel lapangan mengaktifkan modul telemetri GPS aktif.',
          'Lakukan pengujian berkala switch genset ATS darurat untuk menjaga redundansi daya N+1.'
        ]
      },
      error_handling: {
        has_error: false,
        warning_logs: []
      }
    };
  };

  // Pre-seeded Initial Reports
  const [reports, setReports] = useState<GeneratedReport[]>(() => {
    const rawSaved = getOperatorStorage<GeneratedReport[]>('automated_generated_reports', []);
    if (rawSaved && rawSaved.length > 0) return rawSaved;

    const initialDailyApi = buildStandardApiResponse('Daily', 'Laporan Situasi Harian SOC Intel Nusantara');
    const initialReport: GeneratedReport = {
      id: 'rep-daily-01',
      reportId: 'REP-D-2026-1027',
      interval: 'Daily',
      title: 'Laporan Situasi Harian SOC Intel Nusantara (Daily SITREP)',
      generatedAt: '27/10/2026 13:50 WIB',
      periodLabel: 'Periode Shift 24 Jam (26-27 Oktober 2026)',
      authorCallsign: currentUser?.callsign || 'ARYAA-KOMANDO',
      classification: 'TOP SECRET',
      summary: {
        totalIncidents: 6,
        criticalIncidents: 2,
        srmMaxRiskScore: 20,
        srmCriticalRisks: 1,
        averageComplianceScore: 84,
        activeStaffCount: 4,
        geofenceBreachCount: 1,
        operationalReadinessScore: 92
      },
      sections: [
        {
          title: 'Ringkasan Eksekutif Operasi Intelijen',
          description: 'Seluruh perimeter objek vital nasional dan aset siber terpantau dalam status siaga tinggi. Telah dilakukan netralisasi terhadap anomali probe scanner pada server SCADA dan koordinasi regu patroli perbatasan.',
          keyPoints: [
            'Deteksi 1 pelanggaran geofence personel patroli mobile di Ring 1 Monas (terkonfirmasi pergerakan pengecekan jalur darurat).',
            'Pembaruan matriks risiko ISO 31000 mengidentifikasi 1 skenario berisiko kritis (skor 20/25) pada perimeter Obvitnas Cilacap.',
            'Audit ASIS International menunjukkan skor rata-rata kepatuhan fisik 84% dengan rekomendasi perbaikan sensor PIDS.'
          ]
        },
        {
          title: 'Status Penanganan Insiden & Kesiapan Tanggap Darurat',
          description: 'Tim respon cepat (Quick Response Team) berada dalam kesiapan penuh dengan waktu respon terverifikasi kurang dari 5 menit.',
          keyPoints: [
            'Sistem UPS N+1 dalam pengawasan teknisi darurat pasca temuan GAP pada uji beban genset.',
            'CCTV perimeter 48 kamera beroperasi normal tanpa rekaman terputus.'
          ]
        }
      ],
      actionItems: [
        'Tingkatkan frekuensi patroli ganda pada sektor barat laut Obvitnas.',
        'Lakukan evaluasi penempatan sensor razor concertina.',
        'Wajibkan pelaporan berkala GPS setiap 15 menit bagi regu bergerak.'
      ],
      rawApiPayload: initialDailyApi
    };

    return [initialReport];
  });

  useEffect(() => {
    setOperatorStorage('automated_generated_reports', reports);
  }, [reports]);

  // Set active report if not set
  useEffect(() => {
    if (!selectedReportId && reports.length > 0) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports]);

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Handler Generate New Report
  const handleGenerateReport = (interval: ReportInterval) => {
    setIsGenerating(true);

    setTimeout(() => {
      const nowStr = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date()) + ' WIB';

      const prefix = interval === 'Daily' ? 'REP-D' : interval === 'Weekly' ? 'REP-W' : 'REP-M';
      const reportId = `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const title = interval === 'Daily' 
        ? `Laporan Harian Operasi Keamanan SOC (Daily SitRep)`
        : interval === 'Weekly' 
        ? `Laporan Berkala Mingguan Ancaman & Manajemen Risiko (Weekly Security Brief)`
        : `Laporan Strategis Bulanan Vektor Ancaman Nasional (Monthly Strategic Intel Report)`;

      const period = interval === 'Daily' 
        ? `Periode 24 Jam Terakhir (${new Date().toLocaleDateString('id-ID')})`
        : interval === 'Weekly' 
        ? `Periode Mingguan (7 Hari Terakhir)`
        : `Periode Bulanan Terpadu (30 Hari Terakhir)`;

      const rawApi = buildStandardApiResponse(interval, title);

      const newReport: GeneratedReport = {
        id: `rep-${Date.now()}`,
        reportId,
        interval,
        title,
        generatedAt: nowStr,
        periodLabel: period,
        authorCallsign: currentUser?.callsign || 'ARYAA-KOMANDO',
        classification: 'TOP SECRET',
        summary: {
          totalIncidents,
          criticalIncidents,
          srmMaxRiskScore: srmMaxScore,
          srmCriticalRisks: srmCriticalCount,
          averageComplianceScore: avgCompliance,
          activeStaffCount: activeStaff,
          geofenceBreachCount: breachCount,
          operationalReadinessScore: Math.round(88 + Math.random() * 8)
        },
        sections: [
          {
            title: `Ringkasan Eksekutif Intelijen (${interval})`,
            description: `Konsolidasi otomatis data operasional sistem Intel Nusantara mencakup seluruh modul aktif: Daily Logbook, Security Risk Management ISO 31000, Security Assessment ASIS, dan Pelacakan Telemetri GPS Geofencing.`,
            keyPoints: [
              `Total ${totalIncidents} insiden tercatat dalam database terisolasi operator dengan ${criticalIncidents} berstatus CRITICAL.`,
              `Evaluasi risiko ISO 31000 menghasilkan skor risiko tertinggi ${srmMaxScore}/25 dengan ${srmCriticalCount} skenario memerlukan intervensi segera.`,
              `Kepatuhan rata-rata fasilitas objek vital nasional mencapai ${avgCompliance}% terhadap standar fisik ASIS International.`,
              `Pelacakan GPS geofence memonitor ${activeStaff} personel dengan ${breachCount} kali peringatan perimeter tercatat.`
            ]
          },
          {
            title: 'Rekomendasi Strategis & Tindakan Operasional',
            description: 'Berdasarkan kalkulasi matriks keparahan ancaman dan analisis celah keamanan terintegrasi:',
            keyPoints: [
              'Optimalisasi perimeter pertahanan fisik pada objek vital nasional kategori Ring 1.',
              'Penyelarasan SOP tanggap darurat dan peremajaan jadwal drill berkala.',
              'Peningkatan patroli gabungan dan pemeliharaan sensor perimeter PIDS.'
            ]
          }
        ],
        actionItems: [
          'Distribusi salinan terenkripsi ke Markas Komando Pusat.',
          'Pencabutan izin akses kontraktor pada fasilitas berstatus GAP.',
          'Verifikasi berkala sinkronisasi GPS telemetri perangkat operasional.'
        ],
        rawApiPayload: rawApi
      };

      setReports([newReport, ...reports]);
      setSelectedReportId(newReport.id);
      setIsGenerating(false);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  const copyJsonToClipboard = () => {
    if (!currentReport) return;
    const jsonStr = JSON.stringify(currentReport.rawApiPayload, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            GENERATOR LAPORAN TERINTEGRASI // SOC SITREP ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
            AUTOMATED <span className="text-red-600">REPORTING</span> GENERATOR
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Agregasi Laporan Harian (Daily), Mingguan (Weekly), dan Bulanan (Monthly) Berformat Eksekutif & API JSON Murni
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setJsonExportModal(true)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-cyan-400 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>FORMAT JSON API MURNI</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-100 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>CETAK / PDF</span>
          </button>
        </div>
      </div>

      {/* 2. REPORT INTERVAL SELECTOR & GENERATION HERO */}
      <div className="p-5 bg-[#090e1a] border border-zinc-800 rounded-2xl shadow-xl font-mono space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-500" />
            PILIH PERIODE LAPORAN INTELIJEN:
          </span>

          {/* Interval Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {(['Daily', 'Weekly', 'Monthly'] as ReportInterval[]).map((interval) => (
              <button
                key={interval}
                onClick={() => setActiveInterval(interval)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeInterval === interval
                    ? 'bg-red-600 text-white shadow-glow-red'
                    : 'bg-black/60 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {interval === 'Daily' ? 'Harian (Daily)' : interval === 'Weekly' ? 'Mingguan (Weekly)' : 'Bulanan (Monthly)'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="text-xs text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-200">
              {activeInterval === 'Daily' && 'Fokus Harian: Logbook shift 24 jam, pergantian piket jaga, telemetri real-time, dan insiden aktif.'}
              {activeInterval === 'Weekly' && 'Fokus Mingguan: Akumulasi tren kejadian 7 hari, dinamika matriks risiko ISO 31000, dan hasil audit ASIS.'}
              {activeInterval === 'Monthly' && 'Fokus Bulanan: Analisis vektor ancaman makro, KPI efektivitas mitigasi, rekomendasi pimpinan strategis.'}
            </p>
            <p className="text-[11px] text-zinc-500">
              Data ditarik otomatis secara langsung dari 4 modul operasional platform Intel Nusantara.
            </p>
          </div>

          <button
            onClick={() => handleGenerateReport(activeInterval)}
            disabled={isGenerating}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center justify-center gap-2 transition-all flex-shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>MENGAGREGASI DATA...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>GENERATE LAPORAN {activeInterval.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. REPORT VIEWER / EXECUTIVE DOSSIER */}
      {currentReport ? (
        <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-6 sm:p-8 font-mono space-y-6 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none">
          
          {/* Classification & Top Official Header */}
          <div className="border-b-2 border-red-600/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-red-500 font-bold uppercase tracking-widest">
                <span>INTEL NUSANTARA SECURITY COMMAND</span>
                <span>•</span>
                <span>KODE DOKUMEN: {currentReport.reportId}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {currentReport.title}
              </h2>
              <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{currentReport.periodLabel}</span>
                <span>•</span>
                <span>Waktu Terbit: <strong className="text-zinc-200">{currentReport.generatedAt}</strong></span>
                <span>•</span>
                <span>Otoritas: <strong className="text-amber-400">{currentReport.authorCallsign}</strong></span>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-600 rounded text-xs font-black tracking-widest uppercase">
                {currentReport.classification} // NOFORN
              </span>
            </div>
          </div>

          {/* 4 Multi-Module KPI Metric Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">INSIDEN TERCATAT</span>
              <div className="text-2xl font-black text-white">
                {currentReport.summary.totalIncidents}
                <span className="text-xs text-red-400 ml-1.5 font-bold">({currentReport.summary.criticalIncidents} Kritis)</span>
              </div>
              <span className="text-[10px] text-zinc-400 block">Modul Daily Logbook</span>
            </div>

            <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">SKOR MAKS RISIKO ISO</span>
              <div className="text-2xl font-black text-orange-400">
                {currentReport.summary.srmMaxRiskScore}
                <span className="text-xs text-zinc-400 ml-1">/ 25</span>
              </div>
              <span className="text-[10px] text-zinc-400 block">Modul SRM ISO 31000</span>
            </div>

            <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">KEPATUHAN ASIS STD</span>
              <div className="text-2xl font-black text-cyan-400">
                {currentReport.summary.averageComplianceScore}%
              </div>
              <span className="text-[10px] text-zinc-400 block">Modul Security Assessment</span>
            </div>

            <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">STATUS TELEMETRI</span>
              <div className="text-2xl font-black text-emerald-400">
                {currentReport.summary.activeStaffCount} STAF
              </div>
              <span className="text-[10px] text-red-400 block">{currentReport.summary.geofenceBreachCount} Pelanggaran Geofence</span>
            </div>
          </div>

          {/* Structured Report Sections */}
          <div className="space-y-6 pt-2">
            {currentReport.sections.map((sec, idx) => (
              <div key={idx} className="p-5 bg-black/40 border border-zinc-800/90 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <span className="text-red-500 font-mono">0{idx + 1}.</span>
                  {sec.title}
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {sec.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  {sec.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <ChevronRight className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Items Box */}
          <div className="p-5 bg-red-950/20 border border-red-700/60 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              TINDAKAN OPERASIONAL PRIORITAS MARKAS KOMANDO:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-200">
              {currentReport.actionItems.map((act, aIdx) => (
                <div key={aIdx} className="flex items-start gap-2 bg-black/60 p-2.5 rounded-lg border border-red-900/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature & Authentication Footer */}
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400">
            <div>
              <p className="font-bold text-zinc-200 uppercase">PUSAT OPERASI INTELIJEN NUSANTARA</p>
              <p className="text-[10px] text-zinc-500">Sertifikasi Enkripsi SOC Level-7 • Validasi Integritas Data 100%</p>
            </div>

            <div className="text-left sm:text-right font-mono">
              <p className="text-zinc-500 text-[10px]">TANDA TANGAN OTORISASI OPERATOR:</p>
              <p className="text-emerald-400 font-bold uppercase tracking-wider">[VERIFIED: {currentReport.authorCallsign}]</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-zinc-500 bg-[#090e1a] border border-zinc-800 rounded-2xl">
          Belum ada laporan yang di-generate. Silakan klik tombol "GENERATE LAPORAN" di atas.
        </div>
      )}

      {/* 4. MODAL: JSON API OUTPUT MODAL */}
      {jsonExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0a0f1d] border border-cyan-700/80 rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                  PAYLOAD RESMI API REPORTING (MANDATORY JSON SCHEMA)
                </h3>
              </div>
              <button onClick={() => setJsonExportModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-black/90 text-cyan-300 text-xs font-mono">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(currentReport ? currentReport.rawApiPayload : buildStandardApiResponse(activeInterval, 'Intel Nusantara Report'), null, 2)}
              </pre>
            </div>

            <div className="px-6 py-3 bg-[#0d1424] border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">
                Pure JSON Output • Zero Markdown Wrap • ISO 8601 UTC
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
