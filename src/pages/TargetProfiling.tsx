import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  Search, 
  Plus, 
  Globe, 
  ShieldAlert, 
  UserCheck, 
  Activity, 
  ExternalLink, 
  MapPin, 
  Hash, 
  Wallet, 
  Eye, 
  Trash2, 
  Radar, 
  AlertCircle,
  Cpu,
  Phone,
  Mail,
  Smartphone,
  IdCard,
  Server,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  X,
  FileText,
  Sliders,
  Radio,
  Lock,
  Unlock,
  Key,
  Database,
  Building2,
  Camera,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TargetProfile, TargetStatus, SeverityLevel, ClearanceLevel, InstitutionalApiConfig } from '../types';

interface TargetProfilingProps {
  onAnalyzeTargetWithAI?: (targetInfo: string) => void;
}

// Preset foto avatar intelijen taktis (SVG data URIs / placeholder beresolusi tinggi dengan efek siluet)
const AVATAR_PRESETS = [
  { id: 'av-1', label: 'Siluet Intel 01', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-2', label: 'Operator Samaran', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-3', label: 'Aktor Siber Bertopeng', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-4', label: 'Target Wanita Profiler', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' }
];

const DEFAULT_TARGETS: TargetProfile[] = [
  {
    id: 'tgt-001',
    fullNameOrAlias: 'Rahmat Hidayat ("BlackJack")',
    codeName: 'OP-VIPER',
    nik: '3273011408890004',
    phoneNumber: '+62 812-8921-4432',
    imei: '864209045123456',
    email: 'rahmat.blackjack@proton.me',
    lastKnownAddress: 'Apartemen Sudirman Park Tower B Lt. 14, Jakarta Pusat',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    status: 'HIGH PRIORITY',
    threatLevel: 'CRITICAL',
    classification: 'TOP SECRET',
    category: 'CYBER_THREAT_ACTOR',
    digitalFootprint: {
      connectedPlatforms: ['Telegram (@sec_blackjack)', 'WhatsApp', 'BreachForums Mirror', 'GitHub (Gist terenkripsi)'],
      dataBreaches: ['IndoFinance Dump 2024', 'GovPortal NIK Leak 2025'],
      ipAddresses: ['103.145.22.8', '185.190.140.11'],
      socialHandles: ['@sec_viper_ghost', '@c2_broker_ind'],
      cryptocurrencyWallets: ['bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq (BTC)']
    },
    notes: 'Sindikat pemerasan data (ransomware-as-a-service). Bertanggung jawab atas upaya penetrasi pada data kementerian dan exfiltrasi arsip keuangan.',
    updatedAt: '16/10/2026 21:40 WIB',
    createdAt: '2026-10-10T12:00:00+07:00'
  },
  {
    id: 'tgt-002',
    fullNameOrAlias: 'Drs. Hendra Kusuma ("Kraken")',
    codeName: 'APARATUR-GHOST',
    nik: '2171021903780002',
    phoneNumber: '+62 821-4455-8899',
    imei: '357890123456789',
    email: 'h.kusuma.consulting@maritime-asean.org',
    lastKnownAddress: 'Komp. Harbour Bay Blok D No. 12, Batu Ampar, Kota Batam',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    status: 'UNDER WATCH',
    threatLevel: 'HIGH',
    classification: 'TOP SECRET',
    category: 'ESPIONAGE_CELL',
    digitalFootprint: {
      connectedPlatforms: ['LinkedIn (Profil Palsu Konsultan)', 'Signal Messenger', 'DarkWeb Node'],
      dataBreaches: ['AseanMaritime Registry Dump 2025'],
      ipAddresses: ['45.154.255.89', '91.240.118.23'],
      domains: ['maritime-intel-asean.org']
    },
    notes: 'Kelompok spionase dunia maya berfokus mengumpulkan data eksplorasi migas di landas kontinen Laut Natuna Utara.',
    updatedAt: '15/10/2026 18:20 WIB',
    createdAt: '2026-10-12T10:00:00+07:00'
  },
  {
    id: 'tgt-003',
    fullNameOrAlias: 'Fajar Nugraha ("Abu Zahra")',
    codeName: 'SEL-AL-IKHWAN',
    nik: '3372041212950007',
    phoneNumber: '+62 857-9912-3344',
    imei: '861122334455667',
    email: 'khilafah.media09@tuta.io',
    lastKnownAddress: 'Jl. Slamet Riyadi Gg. Kenanga No. 8, Laweyan, Surakarta',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'UNDER WATCH',
    threatLevel: 'HIGH',
    classification: 'SECRET',
    category: 'EXTREMIST_GROUP',
    digitalFootprint: {
      connectedPlatforms: ['Telegram (@khilafah_digital_channel)', 'Tox Chat', 'Monero P2P'],
      dataBreaches: ['DarkMarket P2P Leak 2026'],
      cryptocurrencyWallets: ['Monero (XMR): 888tNk4k2...9vLq']
    },
    notes: 'Fasilitator pendanaan kripto terorisme dan penyebaran konten propaganda radikal di aplikasi pesan terenkripsi.',
    updatedAt: '14/10/2026 16:20 WIB',
    createdAt: '2026-10-11T14:30:00+07:00'
  },
  {
    id: 'tgt-004',
    fullNameOrAlias: 'Siti Aminah ("Maya Sandy")',
    codeName: 'CYBER-PHISH-04',
    nik: '3174055506990001',
    phoneNumber: '+62 813-1122-3344',
    imei: '869900112233445',
    email: 'mayasandy.hrd@gmail.com',
    lastKnownAddress: 'Cluster Greenwich Park, BSD City, Tangerang',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    status: 'CLEARED',
    threatLevel: 'LOW',
    classification: 'CONFIDENTIAL',
    category: 'FRAUD_NETWORK',
    digitalFootprint: {
      connectedPlatforms: ['Instagram', 'Tokopedia', 'BCA Mobile'],
      dataBreaches: []
    },
    notes: 'Terduga awal sindikat scamming online, namun hasil audit forensik membuktikan akun target menjadi korban pencurian identitas NIK.',
    updatedAt: '13/10/2026 11:00 WIB',
    createdAt: '2026-10-09T09:00:00+07:00'
  }
];

export const TargetProfiling: React.FC<TargetProfilingProps> = ({ onAnalyzeTargetWithAI }) => {
  const { getOperatorStorage, setOperatorStorage } = useAuth();
  
  // Storage profil target terisolasi
  const [targets, setTargets] = useState<TargetProfile[]>(() => {
    return getOperatorStorage<TargetProfile[]>('target_profiles', DEFAULT_TARGETS);
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedTarget, setSelectedTarget] = useState<TargetProfile | null>(null);

  // OSINT Digital Footprint Search (Mock Search) State
  const [osintSearchInput, setOsintSearchInput] = useState('');
  const [osintSearching, setOsintSearching] = useState(false);
  const [osintSearchResult, setOsintSearchResult] = useState<any | null>(null);

  // Institutional API Gateway Configuration State
  const [apiGatewayConfig, setApiGatewayConfig] = useState<InstitutionalApiConfig>(() => {
    return getOperatorStorage<InstitutionalApiConfig>('inst_api_config', {
      gatewayName: 'DUKCAPIL & TELCO BTS SURVEILLANCE GATEWAY',
      endpointUrl: 'https://gateway.intel.mil.id/api/v2/secure-query/target',
      apiKey: 'SEC-INTEL-NUSANTARA-KEY-8890-AES256',
      provider: 'DUKCAPIL_SECURE_GATEWAY',
      status: 'READY',
      lastPingMs: 14,
      lastChecked: 'Baru saja'
    });
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingSuccessMessage, setPingSuccessMessage] = useState<string | null>(null);
  const [isGatewayConfigOpen, setIsGatewayConfigOpen] = useState(false);

  // Modal Input Profil Target State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCodeName, setFormCodeName] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formImei, setFormImei] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState(AVATAR_PRESETS[0].url);
  const [formStatus, setFormStatus] = useState<TargetStatus>('UNDER WATCH');
  const [formSeverity, setFormSeverity] = useState<SeverityLevel>('HIGH');
  const [formClassification, setFormClassification] = useState<ClearanceLevel>('SECRET');
  const [formNotes, setFormNotes] = useState('');
  const [formConnectedPlatforms, setFormConnectedPlatforms] = useState('');
  const [formBreaches, setFormBreaches] = useState('');

  // Sinkronisasi ke LocalStorage terisolasi
  useEffect(() => {
    setOperatorStorage('target_profiles', targets);
  }, [targets]);

  useEffect(() => {
    setOperatorStorage('inst_api_config', apiGatewayConfig);
  }, [apiGatewayConfig]);

  // Handler Submit Profil Target Baru
  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formNik.trim()) return;

    const platforms = formConnectedPlatforms
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    const breaches = formBreaches
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    const newTarget: TargetProfile = {
      id: `tgt-${Date.now()}`,
      fullNameOrAlias: formName.trim(),
      codeName: formCodeName.trim() ? formCodeName.toUpperCase().trim() : 'UNIDENTIFIED-CELL',
      nik: formNik.trim(),
      phoneNumber: formPhone.trim() || 'N/A',
      imei: formImei.trim() || 'N/A',
      email: formEmail.trim() || 'N/A',
      lastKnownAddress: formAddress.trim() || 'Lokasi Dalam Penelusuran',
      photoUrl: formPhotoUrl || AVATAR_PRESETS[0].url,
      status: formStatus,
      threatLevel: formSeverity,
      classification: formClassification,
      category: 'CYBER_THREAT_ACTOR',
      digitalFootprint: {
        connectedPlatforms: platforms.length > 0 ? platforms : ['WhatsApp', 'Ponsel GSM'],
        dataBreaches: breaches.length > 0 ? breaches : ['Tidak terdaftar pada public dump']
      },
      notes: formNotes.trim() || 'Profil intelijen dibuat melalui portal target profiling.',
      updatedAt: new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date()) + ' WIB',
      createdAt: new Date().toISOString()
    };

    setTargets([newTarget, ...targets]);

    // Reset Form
    setFormName('');
    setFormCodeName('');
    setFormNik('');
    setFormPhone('');
    setFormImei('');
    setFormEmail('');
    setFormAddress('');
    setFormNotes('');
    setFormConnectedPlatforms('');
    setFormBreaches('');
    setIsAddModalOpen(false);
  };

  // Handler Hapus Target
  const handleDeleteTarget = (id: string) => {
    if (window.confirm('Hapus berkas dossier target ini dari basis data pengawasan intelijen?')) {
      setTargets(targets.filter(t => t.id !== id));
      if (selectedTarget?.id === id) setSelectedTarget(null);
    }
  };

  // Handler Ganti Status Target Langsung
  const handleStatusChange = (id: string, newStatus: TargetStatus) => {
    setTargets(targets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selectedTarget?.id === id) {
      setSelectedTarget({ ...selectedTarget, status: newStatus });
    }
  };

  // Handler OSINT Digital Footprint Search (Mock Recon Engine)
  const handleRunOSINTSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!osintSearchInput.trim()) return;

    setOsintSearching(true);
    setOsintSearchResult(null);

    setTimeout(() => {
      const q = osintSearchInput.trim();
      const isEmail = q.includes('@');
      const isPhone = /^[0-9+-\s()]+$/.test(q);

      setOsintSearchResult({
        query: q,
        type: isEmail ? 'Surat Elektronik (Email)' : isPhone ? 'Nomor Ponsel (MSISDN)' : 'Identitas Digital Terbuka',
        reputationScore: 'HIGH RISK (84/100)',
        operatorOrHost: isPhone ? 'Telkomsel Halo (Pascabayar) / IMSI Valid' : 'Proton AG (Terenkripsi Swiss)',
        lastBtsLocation: 'Cell Tower ID: JKT-CLD-088 (Radius 300m Cilandak Barat, Jakarta Selatan)',
        associatedPlatforms: [
          'WhatsApp Messenger (Aktif 14 menit lalu)',
          'Telegram Messenger (Username: @dark_operator_99)',
          'Tokopedia (Akun terverifikasi sejak 2021)',
          'BreachForums Mirror (Posting thread jual beli database)',
          'LinkedIn (Profil Konsultan Swasta)'
        ],
        breachesDetected: [
          'IndoCitizen 2024 Dump (NIK, No HP, Alamat Terverifikasi)',
          'FinTech Peer-to-Peer Leak 2025 (Rekening Bank & Email)',
          'Public GovService Credentials 2026'
        ],
        tagsSpam: ['"Penipu Investasi Saham Palsu"', '"Broker Data Gelap"', '"Akun Anonim C2"'],
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB'
      });

      setOsintSearching(false);
    }, 1100);
  };

  // Handler Mengimpor Hasil OSINT ke Form Tambah Target
  const handleImportOSINTToForm = () => {
    if (!osintSearchResult) return;
    if (osintSearchResult.type.includes('Email')) {
      setFormEmail(osintSearchResult.query);
    } else {
      setFormPhone(osintSearchResult.query);
    }
    setFormConnectedPlatforms(osintSearchResult.associatedPlatforms.join(', '));
    setFormBreaches(osintSearchResult.breachesDetected.join(', '));
    setFormNotes(`Hasil OSINT Footprint Recon: Terdeteksi pada BTS ${osintSearchResult.lastBtsLocation}. Reputasi: ${osintSearchResult.reputationScore}.`);
    setIsAddModalOpen(true);
  };

  // Handler Test Ping Koneksi API Instansi
  const handleTestPingApi = () => {
    setIsTestingPing(true);
    setPingSuccessMessage(null);

    setTimeout(() => {
      const ping = Math.floor(12 + Math.random() * 15);
      setApiGatewayConfig(prev => ({
        ...prev,
        status: 'CONNECTED',
        lastPingMs: ping,
        lastChecked: new Date().toLocaleTimeString('id-ID') + ' WIB'
      }));
      setIsTestingPing(false);
      setPingSuccessMessage(`Koneksi Gateway ${apiGatewayConfig.provider} Berhasil! Latensi: ${ping}ms (HTTP 200 OK)`);
      setTimeout(() => setPingSuccessMessage(null), 4000);
    }, 850);
  };

  // Helper Badge Status Target: UNKNOWN, UNDER WATCH, HIGH PRIORITY, CLEARED
  const getTargetStatusBadge = (status: TargetStatus) => {
    switch (status) {
      case 'HIGH PRIORITY':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-600 shadow-glow-red flex items-center gap-1.5 whitespace-nowrap animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600"></span> HIGH PRIORITY
          </span>
        );
      case 'UNDER WATCH':
      case 'ACTIVE_MONITORING':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-600 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> UNDER WATCH
          </span>
        );
      case 'CLEARED':
      case 'NEUTRALIZED':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-600 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> CLEARED
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-zinc-400"></span> UNKNOWN
          </span>
        );
    }
  };

  // Filter Profil Target
  const filteredTargets = targets.filter(t => {
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchSeverity = severityFilter === 'ALL' || t.threatLevel === severityFilter;
    
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      t.fullNameOrAlias.toLowerCase().includes(q) ||
      (t.codeName && t.codeName.toLowerCase().includes(q)) ||
      t.nik.toLowerCase().includes(q) ||
      t.phoneNumber.toLowerCase().includes(q) ||
      t.imei.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.lastKnownAddress.toLowerCase().includes(q) ||
      t.notes.toLowerCase().includes(q);

    return matchStatus && matchSeverity && matchQuery;
  });

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 1. TOP HEADER & INSTANT ACTIONS */}
      <div className="bg-[#090e1a] border border-zinc-800/90 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-amber-950 border border-amber-700/60 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <Crosshair className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              TARGET PROFILING & OSINT SURVEILLANCE
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-400">
              TOTAL TARGET: <span className="text-white font-bold">{targets.length} DOSSIER</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mt-2">
            Pusat Profiling Target & Rekonstruksi Jejak Digital Intelijen
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Pengelolaan dossier intelijen mencakup NIK, No HP, IMEI, Alamat, Email, Footprint OSINT, serta Gateway Integrasi Database Provider/Instansi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsGatewayConfigOpen(!isGatewayConfigOpen)}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
          >
            <Server className="w-4 h-4 text-cyan-400" />
            <span>SERVER GATEWAY</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-mono text-xs font-bold transition-all shadow-glow-red flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>INPUT PROFIL TARGET</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION KHUSUS: INSTITUTIONAL TRACKING SERVER GATEWAY (ENDPOINT READY) */}
      <div className={`bg-[#0b101c] border ${apiGatewayConfig.status === 'CONNECTED' ? 'border-cyan-600/60' : 'border-zinc-800'} rounded-2xl p-4 sm:p-6 shadow-xl transition-all space-y-4 font-mono`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-700/60 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                MODUL INTEGRASI RESMI / ENDPOINT READY
              </div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                INSTITUTIONAL TRACKING SERVER GATEWAY
              </h3>
            </div>
          </div>

          {/* Indikator Status Koneksi API Instansi */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
              apiGatewayConfig.status === 'CONNECTED'
                ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : apiGatewayConfig.status === 'READY'
                ? 'bg-cyan-950/60 border-cyan-600 text-cyan-300'
                : 'bg-red-950/60 border-red-600 text-red-400'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${apiGatewayConfig.status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${apiGatewayConfig.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-cyan-500'}`}></span>
              </span>
              <span>STATUS SERVER: {apiGatewayConfig.status}</span>
              {apiGatewayConfig.lastPingMs && (
                <span className="text-[10px] text-zinc-400 hidden sm:inline">({apiGatewayConfig.lastPingMs}ms)</span>
              )}
            </div>

            <button
              onClick={() => setIsGatewayConfigOpen(!isGatewayConfigOpen)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white"
              title="Konfigurasi Endpoint"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifikasi Sukses Ping */}
        {pingSuccessMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{pingSuccessMessage}</span>
          </div>
        )}

        {/* Form Konfigurasi API Endpoint (Bisa di-toggle / selalu terlihat) */}
        {isGatewayConfigOpen && (
          <div className="bg-black/60 p-4 rounded-xl border border-zinc-800 space-y-3.5 text-xs animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-bold mb-1 uppercase">Penyedia / Gateway Instansi:</label>
                <select
                  value={apiGatewayConfig.provider}
                  onChange={(e) => setApiGatewayConfig({ ...apiGatewayConfig, provider: e.target.value as any })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="DUKCAPIL_SECURE_GATEWAY">DUKCAPIL (Verifikasi Kependudukan & Biometrik)</option>
                  <option value="TELCO_BTS_TRIANGULATION">TELCO BTS (Triangulasi Geolokasi & IMEI Ponsel)</option>
                  <option value="IMIGRASI_BORDER_CONTROL">IMIGRASI (Cekal & Lintas Batas Paspor)</option>
                  <option value="BSSN_THREAT_INTEL">BSSN (National Cyber Threat Feed)</option>
                  <option value="CUSTOM_API">CUSTOM SECURE ENDPOINT</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1 uppercase">Environment Koneksi:</label>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> PRODUCTION (SSL/TLS 1.3)
                  </span>
                  <span className="text-[11px] text-zinc-500">AES-256 GCM ENCRYPTED</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1 uppercase">API Endpoint Base URL:</label>
              <input
                type="text"
                value={apiGatewayConfig.endpointUrl}
                onChange={(e) => setApiGatewayConfig({ ...apiGatewayConfig, endpointUrl: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1 uppercase flex items-center justify-between">
                <span>Secret API Key / Bearer Token:</span>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-cyan-400 hover:text-cyan-300 text-[10px]"
                >
                  {showApiKey ? 'SEMBUNYIKAN' : 'TAMPILKAN TOKEN'}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiGatewayConfig.apiKey}
                  onChange={(e) => setApiGatewayConfig({ ...apiGatewayConfig, apiKey: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleTestPingApi}
                disabled={isTestingPing}
                className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-300 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                <span>{isTestingPing ? 'MENGUJI LATENSI...' : 'TEST PING KONEKSI'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOperatorStorage('inst_api_config', apiGatewayConfig);
                  setIsGatewayConfigOpen(false);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold"
              >
                SIMPAN & TUTUP
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. OSINT DIGITAL FOOTPRINT SEARCH (MOCK SEARCH TOOL) */}
      <div className="bg-[#0b101c] border border-amber-800/50 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-950 border border-amber-700/60 text-amber-400">
              <Radar className="w-4 h-4 animate-spin" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-widest">
                OSINT DIGITAL FOOTPRINT RECONNAISSANCE ENGINE
              </h3>
              <p className="text-[11px] text-zinc-400">
                Pencarian jejak digital terbuka via No HP, Email, atau NIK untuk melacak akun terhubung dan histori kebocoran data.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleRunOSINTSearch} className="flex flex-col sm:flex-row items-stretch gap-2.5 text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Masukkan No HP (e.g. +62 812-8921-4432) atau Email (e.g. target@proton.me)..."
              value={osintSearchInput}
              onChange={(e) => setOsintSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/70 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={osintSearching || !osintSearchInput.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-black font-black rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {osintSearching ? (
              <>
                <Activity className="w-4 h-4 animate-spin text-black" />
                <span>SCANNING OSINT...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4 text-black" />
                <span>SEARCH FOOTPRINT</span>
              </>
            )}
          </button>
        </form>

        {/* Hasil Recon Footprint */}
        {osintSearchResult && (
          <div className="p-4 sm:p-5 rounded-xl bg-black/80 border border-amber-600/60 space-y-3.5 text-xs text-zinc-200 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">HASIL PENCARIAN REKAM JEJAK:</span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  {osintSearchResult.query} ({osintSearchResult.type})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-red-950 text-red-400 border border-red-700 rounded-md font-bold text-[11px]">
                  REPUTASI: {osintSearchResult.reputationScore}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-zinc-400 font-bold block flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" /> PLATFORM DIGITAL TERHUBUNG:
                </span>
                <ul className="space-y-1 text-zinc-300">
                  {osintSearchResult.associatedPlatforms.map((plat: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-zinc-600">›</span>
                      <span>{plat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-zinc-400 font-bold block flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> HISTORI KEBOCORAN DATA (DATA BREACHES):
                </span>
                <ul className="space-y-1 text-red-300">
                  {osintSearchResult.breachesDetected.map((br: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-red-500">⚠</span>
                      <span>{br}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 text-[10px] text-zinc-400 border-t border-zinc-800/60">
                  Lokasi BTS Terakhir: <span className="text-zinc-200">{osintSearchResult.lastBtsLocation}</span>
                </div>
              </div>
            </div>

            {/* Actions on OSINT Result */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-800">
              <span className="text-[10px] text-zinc-500">
                Waktu Pemindaian: {osintSearchResult.timestamp}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleImportOSINTToForm}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-600 text-amber-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>JADIKAN PROFIL TARGET BARU</span>
                </button>

                {onAnalyzeTargetWithAI && (
                  <button
                    type="button"
                    onClick={() => onAnalyzeTargetWithAI(`Analisis jejak OSINT untuk query ${osintSearchResult.query}. Platform terdeteksi: ${osintSearchResult.associatedPlatforms.join(', ')}. Kebocoran: ${osintSearchResult.breachesDetected.join(', ')}`)}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>ANALISIS AI</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. SEARCH & FILTER CONTROLS FOR TARGET DOSSIERS */}
      <div className="bg-[#0b101c] border border-zinc-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari Nama Lengkap, Alias, NIK (16 digit), No HP, IMEI, atau Email Target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Filter Status Target: UNKNOWN, UNDER WATCH, HIGH PRIORITY, CLEARED */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600 font-bold"
          >
            <option value="ALL">SEMUA STATUS</option>
            <option value="HIGH PRIORITY">HIGH PRIORITY (MERAH)</option>
            <option value="UNDER WATCH">UNDER WATCH (KUNING)</option>
            <option value="UNKNOWN">UNKNOWN (ABU-ABU)</option>
            <option value="CLEARED">CLEARED (HIJAU)</option>
          </select>
        </div>

        {/* Filter Severity */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 whitespace-nowrap">Ancaman:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-red-600"
          >
            <option value="ALL">SEMUA SEVERITY</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* 5. DOSSIER CARDS GRID (INTELLIGENCE DOSSIER VIEW) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>BERKAS DOSSIER INTELIJEN TERVALIDASI ({filteredTargets.length})</span>
          <span className="text-[11px] text-zinc-500">KLASIFIKASI: TOP SECRET // NOFORN</span>
        </div>

        {filteredTargets.length === 0 ? (
          <div className="p-12 text-center bg-[#090e1a] border border-zinc-800 rounded-2xl font-mono">
            <UserCheck className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-zinc-300">Tidak ada berkas profil target yang sesuai filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setSeverityFilter('ALL'); }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200 hover:text-white"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 font-mono">
            {filteredTargets.map((target) => (
              <div
                key={target.id}
                onClick={() => setSelectedTarget(target)}
                className="bg-[#090e1a] hover:bg-[#0c1324] border border-zinc-800/90 hover:border-red-600/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Watermark Dossier */}
                <div className="absolute -right-6 -bottom-6 text-zinc-900/30 text-7xl font-black select-none pointer-events-none">
                  CLASSIFIED
                </div>

                <div className="space-y-3.5 relative z-10">
                  
                  {/* Header: Photo, Status Badge, Code Name */}
                  <div className="flex items-start gap-4 pb-3 border-b border-zinc-800/90">
                    
                    {/* Foto Target dengan overlay Crosshair Surveillance */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-zinc-700 group-hover:border-red-500/80 bg-black flex-shrink-0 shadow-md">
                      <img
                        src={target.photoUrl || AVATAR_PRESETS[0].url}
                        alt={target.fullNameOrAlias}
                        className="w-full h-full object-cover object-top filter grayscale contrast-125 group-hover:filter-none transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = AVATAR_PRESETS[0].url;
                        }}
                      />
                      {/* Crosshair Scanner Lines */}
                      <div className="absolute inset-0 border border-red-500/30 pointer-events-none"></div>
                      <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/80 text-[8px] font-mono text-red-400 font-bold rounded">
                        REC
                      </div>
                    </div>

                    {/* Identitas Utama */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                          {target.codeName || 'TARGET-ID'}
                        </span>
                        {getTargetStatusBadge(target.status)}
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-white group-hover:text-red-400 transition-colors truncate">
                        {target.fullNameOrAlias}
                      </h4>

                      <div className="text-xs text-zinc-400 space-y-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <IdCard className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                          <span>NIK: <span className="text-zinc-200 font-bold select-all">{target.nik}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>No HP: <span className="text-zinc-200 select-all">{target.phoneNumber}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Smartphone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>IMEI: <span className="text-zinc-200 select-all">{target.imei}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alamat & Email */}
                  <div className="text-xs text-zinc-300 space-y-1 bg-black/50 p-2.5 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">Email: <span className="text-zinc-200 select-all">{target.email}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="truncate text-zinc-400">Alamat: <span className="text-zinc-200">{target.lastKnownAddress}</span></span>
                    </div>
                  </div>

                  {/* Digital Footprint Badges */}
                  {target.digitalFootprint && (
                    <div className="space-y-1 text-[11px]">
                      <span className="text-zinc-500 font-bold text-[10px] uppercase">
                        REKAM JEJAK DIGITAL TERKONFIRMASI:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {target.digitalFootprint.connectedPlatforms?.slice(0, 3).map((plat, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]">
                            {plat}
                          </span>
                        ))}
                        {target.digitalFootprint.dataBreaches && target.digitalFootprint.dataBreaches.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-red-950/70 border border-red-800 text-red-300 text-[10px] font-bold">
                            {target.digitalFootprint.dataBreaches[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Catatan Intelijen */}
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    {target.notes}
                  </p>
                </div>

                {/* Bottom Card Controls */}
                <div 
                  className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs relative z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500">Ubah Status:</span>
                    <select
                      value={target.status}
                      onChange={(e) => handleStatusChange(target.id, e.target.value as TargetStatus)}
                      className="px-2 py-1 bg-black/80 border border-zinc-700 rounded-lg text-[10px] text-zinc-200 font-bold focus:outline-none focus:border-red-500"
                    >
                      <option value="HIGH PRIORITY">HIGH PRIORITY</option>
                      <option value="UNDER WATCH">UNDER WATCH</option>
                      <option value="UNKNOWN">UNKNOWN</option>
                      <option value="CLEARED">CLEARED</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onAnalyzeTargetWithAI && (
                      <button
                        onClick={() => onAnalyzeTargetWithAI(`Analisis dossier target intelijen: ${target.fullNameOrAlias} (${target.codeName}), NIK: ${target.nik}, No HP: ${target.phoneNumber}, IMEI: ${target.imei}, Alamat: ${target.lastKnownAddress}. Status: ${target.status}. Catatan: ${target.notes}`)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-950 text-cyan-400 border border-zinc-700"
                        title="Analisis Target dengan AI"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedTarget(target)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                    >
                      Dossier
                    </button>

                    <button
                      onClick={() => handleDeleteTarget(target.id)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400"
                      title="Hapus Profil Target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. MODAL INPUT FORM PROFIL TARGET BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b101c] border border-red-600/70 rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl font-mono relative my-8 text-zinc-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-red-950 border border-red-700/80 text-red-500 shadow-glow-red">
                  <UserCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    INPUT FORMULIR PROFIL TARGET BARU
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Pencatatan Identitas, Telekomunikasi, dan Jejak Digital
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTarget} className="space-y-4 text-xs">
              
              {/* Row 1: Nama Lengkap / Alias & Code Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Nama Lengkap / Alias *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rahmat Hidayat / BlackJack"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Code Name Operasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: OP-VIPER"
                    value={formCodeName}
                    onChange={(e) => setFormCodeName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Row 2: NIK & No HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    NIK / Nomor Identitas (16 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3273011408890004"
                    value={formNik}
                    onChange={(e) => setFormNik(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Nomor HP (Telepon Seluler) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: +62 812-8921-4432"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              {/* Row 3: IMEI & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    IMEI Perangkat Seluler (15 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 864209045123456"
                    value={formImei}
                    onChange={(e) => setFormImei(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Alamat Email Target *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: target@proton.me"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Row 4: Alamat Terakhir */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1 uppercase">
                  Alamat Terakhir Terpantau *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Apartemen Sudirman Park Tower B Lt. 14, Jakarta Pusat"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Row 5: Foto Target & Preset Avatar */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1 uppercase flex items-center justify-between">
                  <span>Foto Profil Target (URL / Preset Taktis):</span>
                  <span className="text-[10px] text-zinc-500">Pilih Avatar di bawah</span>
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="URL Foto..."
                    value={formPhotoUrl}
                    onChange={(e) => setFormPhotoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/60 border border-zinc-700 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-red-600"
                  />
                </div>
                {/* Preset Avatar Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_PRESETS.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setFormPhotoUrl(av.url)}
                      className={`p-1.5 rounded-xl border flex items-center gap-2 transition-all text-[10px] ${
                        formPhotoUrl === av.url ? 'border-red-600 bg-red-950/50 text-white shadow-glow-red' : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-6 h-6 rounded-md object-cover" />
                      <span className="truncate">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 6: Status Target (UNKNOWN, UNDER WATCH, HIGH PRIORITY, CLEARED) & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Status Target *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TargetStatus)}
                    className="w-full px-3 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-bold"
                  >
                    <option value="HIGH PRIORITY">HIGH PRIORITY (MERAH)</option>
                    <option value="UNDER WATCH">UNDER WATCH (KUNING)</option>
                    <option value="UNKNOWN">UNKNOWN (ABU-ABU)</option>
                    <option value="CLEARED">CLEARED (HIJAU)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Tingkat Ancaman (Severity)
                  </label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              {/* Row 7: Digital Footprints & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Platform Digital Terhubung (pisahkan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Telegram, WhatsApp, LinkedIn, BreachForums"
                    value={formConnectedPlatforms}
                    onChange={(e) => setFormConnectedPlatforms(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1 uppercase">
                    Histori Kebocoran Data (Data Breaches)
                  </label>
                  <input
                    type="text"
                    placeholder="IndoFinance Dump, NIK Portal Leak"
                    value={formBreaches}
                    onChange={(e) => setFormBreaches(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1 uppercase">
                  Catatan Intelijen & Modus Operandi Target
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan taktis pergerakan, kebiasaan, rekan sindikat, dan rekomendasi penindakan..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-glow-red flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SIMPAN PROFIL TARGET</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. MODAL DETAIL DOSSIER INTELIJEN LENGKAP */}
      {selectedTarget && (
        <div 
          onClick={() => setSelectedTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b101c] border border-red-600/70 rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl font-mono relative my-6 text-zinc-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded-xl overflow-hidden border border-red-500 bg-black flex-shrink-0">
                  <img
                    src={selectedTarget.photoUrl || AVATAR_PRESETS[0].url}
                    alt={selectedTarget.fullNameOrAlias}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] px-2 py-0.5 bg-red-950 text-red-300 border border-red-700 rounded font-bold uppercase">
                    BERKAS RESMI • {selectedTarget.classification}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {selectedTarget.fullNameOrAlias}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    Code Name: <span className="text-red-400 font-bold">{selectedTarget.codeName || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTarget(null)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">STATUS TARGET</span>
                <div className="mt-1">{getTargetStatusBadge(selectedTarget.status)}</div>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">SEVERITY</span>
                <span className="text-red-400 font-bold block mt-1">{selectedTarget.threatLevel}</span>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">TELEKOMUNIKASI</span>
                <span className="text-emerald-400 font-bold block mt-1 truncate">{selectedTarget.phoneNumber}</span>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] font-bold">IMEI HW ID</span>
                <span className="text-cyan-400 font-bold block mt-1 truncate">{selectedTarget.imei}</span>
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-xs space-y-1.5">
              <div>NIK: <span className="text-white font-bold select-all">{selectedTarget.nik}</span></div>
              <div>Email: <span className="text-white select-all">{selectedTarget.email}</span></div>
              <div>Alamat Terakhir: <span className="text-zinc-300">{selectedTarget.lastKnownAddress}</span></div>
            </div>

            {selectedTarget.digitalFootprint && (
              <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-xs space-y-2">
                <span className="text-zinc-400 font-bold block text-[11px] uppercase">
                  JEJAK DIGITAL & HISTORI KEBOCORAN DATA:
                </span>
                <div className="text-cyan-400">
                  Platform: {selectedTarget.digitalFootprint.connectedPlatforms?.join(', ') || 'N/A'}
                </div>
                <div className="text-red-400">
                  Data Breaches: {selectedTarget.digitalFootprint.dataBreaches?.join(', ') || 'Tidak terdeteksi pada public dump'}
                </div>
              </div>
            )}

            <div>
              <span className="text-zinc-400 block text-xs font-bold mb-1 uppercase">CATATAN INTELIJEN:</span>
              <p className="p-3 bg-black/50 border border-zinc-800 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans">
                {selectedTarget.notes}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setSelectedTarget(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold"
              >
                TUTUP DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
