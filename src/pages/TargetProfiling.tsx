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
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TargetProfile, SeverityLevel, ClearanceLevel } from '../types';

interface TargetProfilingProps {
  onAnalyzeTargetWithAI?: (targetInfo: string) => void;
}

const DEFAULT_TARGETS: TargetProfile[] = [
  {
    id: 'tgt-001',
    codeName: 'OP-VIPER (SHADOW SPIDER)',
    alias: 'Ransomware Broker "BlackJack"',
    classification: 'TOP SECRET',
    threatLevel: 'CRITICAL',
    category: 'CYBER_THREAT_ACTOR',
    status: 'ACTIVE_MONITORING',
    lastSeenLocation: 'Node VPN Transit / Frankfurt & Surabaya',
    digitalFootprint: {
      ipAddresses: ['103.145.22.8', '185.190.140.11'],
      socialHandles: ['@viper_c2_broker (Telegram)', 'X: @sec_viper_ghost'],
      cryptocurrencyWallets: ['bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq (BTC)'],
      domains: ['viper-exfil-node.pw', 'auth-gate-sync.net']
    },
    notes: 'Sindikat pemerasan data (ransomware-as-a-service). Bertanggung jawab atas upaya penetrasi pada data kementerian dan exfiltrasi arsip keuangan.',
    updatedAt: '13/10/2026 13:40 WIB'
  },
  {
    id: 'tgt-002',
    codeName: 'APARATUR-GHOST (APT-KRAKEN)',
    alias: 'State-Sponsored Recon Cell',
    classification: 'TOP SECRET',
    threatLevel: 'HIGH',
    category: 'ESPIONAGE_CELL',
    status: 'ACTIVE_MONITORING',
    lastSeenLocation: 'Laut Natuna Utara & Server Relay Batam',
    digitalFootprint: {
      ipAddresses: ['45.154.255.89', '91.240.118.23'],
      socialHandles: ['LinkedIn: [Palsu HR Intel Maritim]'],
      cryptocurrencyWallets: ['0x71C...883b (ETH)'],
      domains: ['maritime-intel-asean.org', 'defense-reg-portal.cc']
    },
    notes: 'Kelompok spionase dunia maya tingkat negara yang berfokus mengumpulkan data eksplorasi migas di landas kontinen Laut Natuna Utara.',
    updatedAt: '12/10/2026 21:10 WIB'
  },
  {
    id: 'tgt-003',
    codeName: 'SEL-AL-IKHWAN DIGI',
    alias: 'Media Propagandis Extremist',
    classification: 'SECRET',
    threatLevel: 'MEDIUM',
    category: 'EXTREMIST_GROUP',
    status: 'TARGET_IDENTIFIED',
    lastSeenLocation: 'Bandung & Solo Raya',
    digitalFootprint: {
      socialHandles: ['Telegram: @khilafah_digital_channel', 'Tox ID: 7F4C...'],
      cryptocurrencyWallets: ['Monero (XMR): 888tNk...'],
      domains: ['warta-tauhid-cadangan.xyz']
    },
    notes: 'Jaringan penyebaran materi radikalisme pemuda dan crowdfunding senjata ilegal via bot transaksi P2P.',
    updatedAt: '11/10/2026 16:20 WIB'
  }
];

export const TargetProfiling: React.FC<TargetProfilingProps> = ({ onAnalyzeTargetWithAI }) => {
  const { getOperatorStorage, setOperatorStorage } = useAuth();
  
  const [targets, setTargets] = useState<TargetProfile[]>(() => {
    return getOperatorStorage<TargetProfile[]>('target_profiles', DEFAULT_TARGETS);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTarget, setSelectedTarget] = useState<TargetProfile | null>(null);

  // OSINT Recon Tool State
  const [osintInput, setOsintInput] = useState('');
  const [osintLoading, setOsintLoading] = useState(false);
  const [osintResult, setOsintResult] = useState<any | null>(null);

  // Modal Add Target State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCodeName, setNewCodeName] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newCategory, setNewCategory] = useState<TargetProfile['category']>('CYBER_THREAT_ACTOR');
  const [newThreatLevel, setNewThreatLevel] = useState<SeverityLevel>('HIGH');
  const [newLocation, setNewLocation] = useState('');
  const [newIPs, setNewIPs] = useState('');
  const [newSocial, setNewSocial] = useState('');
  const [newWallets, setNewWallets] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    setOperatorStorage('target_profiles', targets);
  }, [targets]);

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) return;

    const newTarget: TargetProfile = {
      id: `tgt-${Date.now()}`,
      codeName: newCodeName.toUpperCase().trim(),
      alias: newAlias.trim() || 'Moniker Tidak Diketahui',
      classification: 'SECRET',
      threatLevel: newThreatLevel,
      category: newCategory,
      status: 'ACTIVE_MONITORING',
      lastSeenLocation: newLocation.trim() || 'Wilayah NKRI Terpantau',
      digitalFootprint: {
        ipAddresses: newIPs.split(',').map(s => s.trim()).filter(Boolean),
        socialHandles: newSocial.split(',').map(s => s.trim()).filter(Boolean),
        cryptocurrencyWallets: newWallets.split(',').map(s => s.trim()).filter(Boolean),
      },
      notes: newNotes.trim() || 'Profil dalam tahap profiling awal.',
      updatedAt: new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date()) + ' WIB'
    };

    setTargets([newTarget, ...targets]);
    setNewCodeName('');
    setNewAlias('');
    setNewLocation('');
    setNewIPs('');
    setNewSocial('');
    setNewWallets('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleDeleteTarget = (id: string) => {
    if (window.confirm('Hapus profil target ini dari database pengawasan?')) {
      setTargets(targets.filter(t => t.id !== id));
      if (selectedTarget?.id === id) setSelectedTarget(null);
    }
  };

  const handleRunOSINTRecon = () => {
    if (!osintInput.trim()) return;
    setOsintLoading(true);
    setOsintResult(null);

    setTimeout(() => {
      const input = osintInput.trim();
      const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(input);
      const isDomain = input.includes('.') && !input.startsWith('@');
      const isSocial = input.startsWith('@');

      setOsintResult({
        query: input,
        type: isIP ? 'IP Address' : isDomain ? 'Domain / Web Server' : isSocial ? 'Social Moniker' : 'Hash / Identitas Digital',
        riskScore: Math.floor(65 + Math.random() * 32),
        asn: isIP ? 'AS136052 (Indo Cyber Transit) / Host Gateway' : 'Cloudflare Protected / Reverse DNS Mapped',
        location: isIP ? 'Jakarta Pusat, Indonesia (Lat -6.2088, Lon 106.8456)' : 'Multi-regional Anycast CDN',
        portsOpen: isIP ? ['80 (HTTP)', '443 (HTTPS)', '22 (SSH)', '8080 (Proxy)'] : ['443 (HTTPS)'],
        threatBlacklist: 'Terdeteksi pada 3 Blacklist Reputasi Global (Spamhaus, AbuseIPDB, VirusTotal)',
        associatedActors: ['APT-38 Sub-cluster', 'Proxy Node Nusantara'],
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB'
      });
      setOsintLoading(false);
    }, 900);
  };

  const filteredTargets = targets.filter(t => {
    const matchCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchQuery = 
      t.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner Bar */}
      <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono">
            <span className="p-1.5 rounded-lg bg-amber-950 border border-amber-700/60 text-amber-500">
              <Crosshair className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              MODUL PROFILING TARGET & OSINT INTEL
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">STATUS AKTIF: {targets.length} DOSSIER</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide mt-1">
            Dossier Target Ancaman & Rekonstruksi Jejak Digital
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Analisis jejak digital open-source (OSINT), atribusi aktor ancaman (Threat Actor), dan jejak infrastruktur siber.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold shadow-glow-red flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>BUAT DOSSIER TARGET</span>
          </button>
        </div>
      </div>

      {/* OSINT Quick Recon Lookup Tool Widget */}
      <div className="bg-[#0b101c] border border-amber-800/40 rounded-2xl p-4 sm:p-5 shadow-md font-mono space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-amber-400 animate-spin" />
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              INSTANT OSINT RECONNAISSANCE TOOL
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400">IP • DOMAIN • HANDLE • HASH LOOKUP</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2 text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Masukkan IP (e.g. 103.145.22.8), Domain (e.g. evil-c2.net), atau Handle (@moniker)..."
              value={osintInput}
              onChange={(e) => setOsintInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunOSINTRecon()}
              className="w-full pl-9 pr-3 py-2.5 bg-black/70 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={handleRunOSINTRecon}
            disabled={osintLoading || !osintInput.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-black font-black rounded-xl tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            {osintLoading ? (
              <>
                <Activity className="w-4 h-4 animate-spin text-black" />
                <span>SCANNING OSINT...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4 text-black" />
                <span>RECON LOOKUP</span>
              </>
            )}
          </button>
        </div>

        {/* Recon Result Output Box */}
        {osintResult && (
          <div className="p-4 rounded-xl bg-black/80 border border-amber-600/50 mt-3 space-y-2 text-xs text-zinc-300 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                HASIL INTELIJEN: {osintResult.query} ({osintResult.type})
              </span>
              <span className="text-[11px] text-red-400 font-bold px-2 py-0.5 bg-red-950 border border-red-800 rounded">
                SKOR RISIKO: {osintResult.riskScore}/100 (TINGGI)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
              <div>
                <span className="text-zinc-500 block">GEOLOKASI & ASN:</span>
                <span className="text-zinc-200">{osintResult.location}</span>
                <div className="text-zinc-400">{osintResult.asn}</div>
              </div>
              <div>
                <span className="text-zinc-500 block">PORT TERDETEKSI:</span>
                <span className="text-cyan-400">{osintResult.portsOpen.join(', ')}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">STATUS REPUTASI:</span>
                <span className="text-red-400 font-semibold">{osintResult.threatBlacklist}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800/80">
              {onAnalyzeTargetWithAI && (
                <button
                  onClick={() => onAnalyzeTargetWithAI(`OSINT Recon target: ${osintResult.query} dengan ASN ${osintResult.asn} dan skor ancaman ${osintResult.riskScore}/100`)}
                  className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[11px] flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Kirim ke AI Threat Analysis</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Target Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari Code Name, Alias, Lokasi, atau Catatan Target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#090e1a] border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#090e1a] border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-red-600"
          >
            <option value="ALL">SEMUA KATEGORI</option>
            <option value="CYBER_THREAT_ACTOR">CYBER THREAT ACTOR</option>
            <option value="ESPIONAGE_CELL">ESPIONAGE CELL</option>
            <option value="EXTREMIST_GROUP">EXTREMIST GROUP</option>
            <option value="FRAUD_NETWORK">FRAUD NETWORK</option>
          </select>
        </div>
      </div>

      {/* Target Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTargets.map((target) => (
          <div
            key={target.id}
            className="bg-[#090e1a] hover:bg-[#0c1224] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all duration-200 font-mono relative group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60 uppercase">
                    {target.category.replace(/_/g, ' ')}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5 tracking-wide">
                    {target.codeName}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Alias: <span className="text-zinc-200">{target.alias}</span>
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  target.threatLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' :
                  target.threatLevel === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                  'bg-blue-950 text-blue-400 border-blue-800'
                }`}>
                  {target.threatLevel}
                </span>
              </div>

              {/* Location & Status */}
              <div className="py-2.5 text-xs text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span className="truncate">{target.lastSeenLocation}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Activity className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{target.status.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Digital Footprint Preview */}
              <div className="p-3 bg-black/60 border border-zinc-800/80 rounded-xl space-y-1.5 text-[11px]">
                <span className="text-zinc-500 font-bold block text-[10px] uppercase">
                  Jejak Digital Teridentifikasi:
                </span>
                {target.digitalFootprint.ipAddresses && target.digitalFootprint.ipAddresses.length > 0 && (
                  <div className="text-cyan-400 truncate">
                    IP: {target.digitalFootprint.ipAddresses.join(', ')}
                  </div>
                )}
                {target.digitalFootprint.socialHandles && target.digitalFootprint.socialHandles.length > 0 && (
                  <div className="text-zinc-300 truncate">
                    Social: {target.digitalFootprint.socialHandles.join(', ')}
                  </div>
                )}
                {target.digitalFootprint.cryptocurrencyWallets && target.digitalFootprint.cryptocurrencyWallets.length > 0 && (
                  <div className="text-amber-400 truncate">
                    Crypto: {target.digitalFootprint.cryptocurrencyWallets[0]}
                  </div>
                )}
              </div>

              {/* Notes */}
              <p className="text-xs text-zinc-400 font-sans mt-3 line-clamp-2">
                {target.notes}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-zinc-500">{target.updatedAt}</span>
              
              <div className="flex items-center gap-2">
                {onAnalyzeTargetWithAI && (
                  <button
                    onClick={() => onAnalyzeTargetWithAI(`Analisis dossier target: ${target.codeName} (${target.alias}) dengan jejak: ${JSON.stringify(target.digitalFootprint)}`)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-950 text-cyan-400 border border-zinc-700"
                    title="Analisis Target dengan AI"
                  >
                    <Cpu className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedTarget(target)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                >
                  Detail
                </button>
                <button
                  onClick={() => handleDeleteTarget(target.id)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400"
                  title="Hapus Profil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ADD TARGET */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b101c] border border-amber-600/70 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl font-mono relative my-8">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-950 border border-amber-700/60 text-amber-500">
                  <UserCheck className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-white">
                  BUAT PROFIL DOSSIER TARGET BARU
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTarget} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase">Code Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OP-COBRA-99"
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase">Alias / Moniker</label>
                  <input
                    type="text"
                    placeholder="e.g. ShadowZero"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TargetProfile['category'])}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CYBER_THREAT_ACTOR">CYBER THREAT ACTOR</option>
                    <option value="ESPIONAGE_CELL">ESPIONAGE CELL</option>
                    <option value="EXTREMIST_GROUP">EXTREMIST GROUP</option>
                    <option value="FRAUD_NETWORK">FRAUD NETWORK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1 uppercase">Tingkat Ancaman</label>
                  <select
                    value={newThreatLevel}
                    onChange={(e) => setNewThreatLevel(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">Lokasi Terakhir / Node Transit</label>
                <input
                  type="text"
                  placeholder="e.g. Node VPN Singapura / Jakarta Timur"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">IP Addresses (pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="103.20.11.2, 45.12.9.1"
                  value={newIPs}
                  onChange={(e) => setNewIPs(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">Akun Medsos / Handle (pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="@telegram_bot, @user_darkweb"
                  value={newSocial}
                  onChange={(e) => setNewSocial(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1 uppercase">Catatan Intelijen & Modus Operandi</label>
                <textarea
                  rows={2}
                  placeholder="Analisis taktik dan target sasaran kelompok ini..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-black font-black uppercase tracking-wider"
                >
                  SIMPAN DOSSIER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL TARGET MODAL */}
      {selectedTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b101c] border border-amber-600/70 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl font-mono relative">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-700 rounded font-bold uppercase">
                  DOSSIER RESMI • {selectedTarget.classification}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  {selectedTarget.codeName}
                </h3>
              </div>
              <button onClick={() => setSelectedTarget(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div className="text-xs space-y-2 text-zinc-300">
              <p>Alias: <span className="text-zinc-100 font-bold">{selectedTarget.alias}</span></p>
              <p>Kategori: <span className="text-zinc-100">{selectedTarget.category}</span></p>
              <p>Tingkat Ancaman: <span className="text-red-400 font-bold">{selectedTarget.threatLevel}</span></p>
              <p>Lokasi Pantauan: <span className="text-zinc-100">{selectedTarget.lastSeenLocation}</span></p>
            </div>

            <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl text-xs space-y-2">
              <span className="text-zinc-400 block font-bold">DIGITAL FOOTPRINT SUMMARY:</span>
              <div className="text-cyan-400">IPs: {selectedTarget.digitalFootprint.ipAddresses?.join(', ') || 'N/A'}</div>
              <div className="text-zinc-300">Social: {selectedTarget.digitalFootprint.socialHandles?.join(', ') || 'N/A'}</div>
              <div className="text-amber-400">Wallets: {selectedTarget.digitalFootprint.cryptocurrencyWallets?.join(', ') || 'N/A'}</div>
            </div>

            <div>
              <span className="text-zinc-400 block text-xs font-bold mb-1">CATATAN INTELIJEN:</span>
              <p className="p-3 bg-black/50 border border-zinc-800 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans">
                {selectedTarget.notes}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setSelectedTarget(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
