import React, { useState } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Globe, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Search, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Share2, 
  ArrowUpRight,
  PlusCircle,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { NewsItem, SeverityLevel } from '../types';

interface DashboardProps {
  onNavigateToLogbookWithNews?: (news: NewsItem) => void;
  onNavigateToAIAnalysis?: (query: string) => void;
}

const MOCK_NEWS_DATA: NewsItem[] = [
  {
    id: 'news-101',
    source: 'BSSN Threat Advisory',
    title: 'Deteksi Kampanye Spionase Siber APT-38 Menyasar Sektor Finansial & Perbankan Nasional',
    summary: 'Ditemukan indikasi serangan spear-phishing berkedok regulasi BI terbaru yang membawa payload malware trojan perbankan modular. Sejumlah IP C2 terdeteksi aktif.',
    timestamp: '10 MENIT LALU',
    category: 'CYBER',
    threatLevel: 'CRITICAL',
    verified: true,
    region: 'DKI Jakarta / Nasional'
  },
  {
    id: 'news-102',
    source: 'CSIRT Infrastruktur Kritis',
    title: 'Lonjakan Traffic DDoS Skala Terabit pada Gateway Komunikasi Maritim Selat Malaka - Batam',
    summary: 'Serangan distributed denial of service terdistribusi dari botnet Mirai varian baru menyerang node telekomunikasi bawah laut. Mitigasi scrubbing center diaktifkan.',
    timestamp: '28 MENIT LALU',
    category: 'INFRASTRUKTUR',
    threatLevel: 'HIGH',
    verified: true,
    region: 'Kepulauan Riau / Batam'
  },
  {
    id: 'news-103',
    source: 'Direktorat Intelijen Strategis',
    title: 'Aktivitas Intelijen Sinyal Asing Terdeteksi di Sekitar Jalur Laut Kepulauan Indonesia (ALKI II)',
    summary: 'Patroli maritim dan sensor radar pesisir mendeteksi keberadaan transmisi radio frekuensi gelap (dark ship) tanpa AIS melintas di Selat Makassar menuju Laut Sulawesi.',
    timestamp: '1 JAM LALU',
    category: 'GEOPOLITIK',
    threatLevel: 'HIGH',
    verified: true,
    region: 'Selat Makassar / Sulawesi'
  },
  {
    id: 'news-104',
    source: 'DarkWeb OSINT Watchdog',
    title: 'Bocornya 4.5 Juta Baris Kredensial Pengguna Layanan Publik pada Pasar Gelap RaidForums Mirror',
    summary: 'Aktor ancaman dengan moniker "GhostNusantara" mengunggah basis data hash password dan NIK. Tim forensik sedang memverifikasi otentisitas sample data dump.',
    timestamp: '2 JAM LALU',
    category: 'CYBER',
    threatLevel: 'CRITICAL',
    verified: true,
    region: 'Nasional'
  },
  {
    id: 'news-105',
    source: 'Satgas Cyber Terorisme',
    title: 'Propaganda Ekstremisme Online Meningkat di Grup Tertutup Aplikasi Pesan Instan',
    summary: 'Pola rekrutmen digital dan seruan pendanaan terorisme menggunakan aset kripto Monero terpantau di lebih dari 12 channel komunikasi terenkripsi.',
    timestamp: '4 JAM LALU',
    category: 'TERORISME',
    threatLevel: 'MEDIUM',
    verified: false,
    region: 'Jawa Barat & Solo Raya'
  },
  {
    id: 'news-106',
    source: 'Satgas Keamanan Siber IKN',
    title: 'Audit Keamanan Sistem SCADA Otomasi Smart City Ibu Kota Nusantara Menunjukkan Kondisi Aman',
    summary: 'Penetrasi simulasi Red Team berkala telah diselesaikan pada sistem grid listrik dan air bersih digital IKN tanpa celah tembus kritikal.',
    timestamp: '5 JAM LALU',
    category: 'INFRASTRUKTUR',
    threatLevel: 'LOW',
    verified: true,
    region: 'IKN Nusantara / Kaltim'
  }
];

const INDONESIA_REGIONAL_HOTSPOTS = [
  { name: 'DKI JAKARTA (HUB KOMANDO)', status: 'CRITICAL', threatCount: 14, coords: '6.2088° S, 106.8456° E', color: 'text-red-500' },
  { name: 'BATAM - KEP. RIAU (GATEWAY)', status: 'HIGH', threatCount: 8, coords: '1.0456° N, 104.0305° E', color: 'text-amber-500' },
  { name: 'SURABAYA - JAWA TIMUR', status: 'ELEVATED', threatCount: 5, coords: '7.2575° S, 112.7521° E', color: 'text-amber-400' },
  { name: 'IKN NUSANTARA (PUSAT PEMERINTAHAN)', status: 'SECURE / MONITORED', threatCount: 2, coords: '0.9734° S, 116.7089° E', color: 'text-emerald-400' },
  { name: 'SELAT MAKASSAR / ALKI II', status: 'HIGH', threatCount: 6, coords: '1.5000° S, 118.5000° E', color: 'text-amber-500' },
  { name: 'PAPUA RESOURCE CORRIDOR', status: 'GUARDED', threatCount: 3, coords: '4.2699° S, 138.0804° E', color: 'text-blue-400' },
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateToLogbookWithNews, 
  onNavigateToAIAnalysis 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newsList] = useState<NewsItem[]>(MOCK_NEWS_DATA);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const filteredNews = newsList.filter(item => {
    const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-700/60 shadow-glow-red animate-pulse">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-700/60">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-700/60">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/60">LOW / NORMAL</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner Alert Bar */}
      <div className="bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-950 border border-red-700/50 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-500 shadow-glow-red">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs px-2 py-0.5 bg-red-900/80 text-white rounded font-bold uppercase tracking-widest">
                PRIORITAS TINGGI
              </span>
              <span className="text-zinc-400 text-xs hidden sm:inline">PEMANTAUAN REAL-TIME NUSANTARA</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide mt-1">
              STATUS KEAMANAN NASIONAL: <span className="text-red-500 font-mono">DEFCON 3 (SIAGA ELEVATED)</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Terdeteksi 4 kampanye intrusi aktif dan anomali jaringan pada sektor strategis nasional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button 
            onClick={() => onNavigateToAIAnalysis && onNavigateToAIAnalysis('Analisis situasi ancaman nasional terkini berdasarkan feed intelijen')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-glow-red"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ANALISIS ANCAMAN AI</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400">INSIDEN AKTIF</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            38 <span className="text-xs font-normal text-red-500 font-sans">+4 baru</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            2 Kritis membutuhkan mitigasi
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-red-600/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400">TARGET DIPANTAU</span>
            <Compass className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            12 <span className="text-xs font-normal text-amber-500 font-sans">Sel Aktif</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            5 APT Group & 7 Sindikat Siber
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-600/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400">IOC TERDETEKSI (24H)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            1,429 <span className="text-xs font-normal text-cyan-400 font-sans">IPs/Domains</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Sinkronisasi feed CSIRT real-time
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-cyan-600/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-400">INTEGRITAS SISTEM</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-2">
            99.98%
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">
            Enkripsi AES-256 Aktif
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-600/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Main Grid: Left News Aggregator, Right Regional Radar Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): News Aggregator */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            
            {/* News Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-950/60 border border-red-700/60 rounded-lg text-red-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm text-white tracking-wide">
                    NEWS AGGREGATOR & INTEL FEED
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Kompilasi Berita Intelijen, Kebocoran Data & Ancaman Nasional
                  </p>
                </div>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari berita / keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar font-mono text-xs">
              <span className="text-zinc-500 text-[11px] flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'ALL', label: 'SEMUA FEED' },
                { id: 'CYBER', label: 'CYBER DEFENSE' },
                { id: 'INFRASTRUKTUR', label: 'INFRASTRUKTUR' },
                { id: 'GEOPOLITIK', label: 'GEOPOLITIK' },
                { id: 'TERORISME', label: 'TERORISME' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white shadow-glow-red'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* News Feed List */}
            <div className="space-y-3 mt-2">
              {filteredNews.length === 0 ? (
                <div className="py-8 text-center font-mono text-xs text-zinc-500">
                  Tidak ada feed berita yang sesuai kriteria pencarian.
                </div>
              ) : (
                filteredNews.map((news) => (
                  <div
                    key={news.id}
                    className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="font-bold text-red-400 group-hover:text-red-300">
                          {news.source}
                        </span>
                        {news.verified && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {news.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded">
                          {news.region}
                        </span>
                        {getSeverityBadge(news.threatLevel)}
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white leading-snug">
                      {news.title}
                    </h4>
                    
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                      {news.summary}
                    </p>

                    {/* Actions on News Item */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60 font-mono text-xs">
                      <button
                        onClick={() => setSelectedNews(news)}
                        className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>Baca Rincian Intel</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {onNavigateToLogbookWithNews && (
                          <button
                            onClick={() => onNavigateToLogbookWithNews(news)}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-950/80 text-zinc-300 hover:text-red-400 border border-zinc-700 hover:border-red-700 text-[11px] flex items-center gap-1 transition-colors"
                            title="Salin dan eskalasi ke Daily Logbook SOC"
                          >
                            <PlusCircle className="w-3 h-3 text-red-500" />
                            <span>Eskalasi ke Logbook</span>
                          </button>
                        )}
                        {onNavigateToAIAnalysis && (
                          <button
                            onClick={() => onNavigateToAIAnalysis(news.title + ': ' + news.summary)}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-cyan-950/80 text-zinc-300 hover:text-cyan-300 border border-zinc-700 hover:border-cyan-700 text-[11px] flex items-center gap-1 transition-colors"
                            title="Bedah dengan AI Threat Analysis"
                          >
                            <Cpu className="w-3 h-3 text-cyan-400" />
                            <span>Analisis AI</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Regional Hotspots & Radar */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Radar Hotspot Card */}
          <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <h3 className="font-mono font-bold text-sm text-white">
                  SECTOR RADAR NUSANTARA
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded">
                LIVE SWEEP
              </span>
            </div>

            {/* Radar Circular Visual Representation */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto rounded-full border-2 border-red-600/40 bg-zinc-950 p-2 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              {/* Concentric rings */}
              <div className="absolute inset-4 rounded-full border border-red-800/30"></div>
              <div className="absolute inset-10 rounded-full border border-red-800/20"></div>
              <div className="absolute inset-16 rounded-full border border-red-800/10"></div>
              
              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-red-600/30"></div>
              <div className="absolute inset-y-0 left-1/2 w-px bg-red-600/30"></div>
              
              {/* Rotating Sweep Beam */}
              <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
                   style={{
                     background: 'conic-gradient(from 0deg, rgba(220, 38, 38, 0.4) 0deg, transparent 60deg, transparent 360deg)'
                   }}
              ></div>

              {/* Blip dots */}
              <div className="absolute top-[35%] left-[45%] w-2 h-2 rounded-full bg-red-500 shadow-glow-red animate-ping" title="Jakarta Hub"></div>
              <div className="absolute top-[25%] left-[30%] w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Batam Gateway"></div>
              <div className="absolute top-[48%] left-[60%] w-2 h-2 rounded-full bg-cyan-400 animate-pulse" title="IKN Hub"></div>
              <div className="absolute top-[52%] left-[78%] w-1.5 h-1.5 rounded-full bg-blue-400" title="Papua Region"></div>

              <div className="z-10 text-center font-mono">
                <span className="text-[9px] text-zinc-500 block">SABANG - MERAUKE</span>
                <span className="text-xs font-black text-white tracking-widest">38 PROVINSI</span>
                <span className="text-[8px] text-emerald-400 block mt-0.5">COVERAGE 100%</span>
              </div>
            </div>

            {/* Regional List */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-mono text-zinc-400 uppercase font-semibold flex justify-between">
                <span>SEKTOR PRIORITAS</span>
                <span>STATUS ANCAMAN</span>
              </div>

              {INDONESIA_REGIONAL_HOTSPOTS.map((spot, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/70 flex items-center justify-between font-mono text-xs hover:border-zinc-700 transition-colors"
                >
                  <div>
                    <div className="font-bold text-zinc-200 text-[11px] truncate">
                      {spot.name}
                    </div>
                    <div className="text-[9px] text-zinc-400">
                      {spot.coords}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold block ${spot.color}`}>
                      {spot.status}
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      {spot.threatCount} anomali
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail News */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b101c] border border-red-600/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 bg-red-950 text-red-300 border border-red-700 rounded font-bold uppercase">
                  {selectedNews.category}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  {selectedNews.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-zinc-400 space-y-1">
              <p>Sumber: <span className="text-zinc-200 font-semibold">{selectedNews.source}</span></p>
              <p>Wilayah Operasi: <span className="text-zinc-200 font-semibold">{selectedNews.region}</span></p>
              <p>Waktu Pembaruan: <span className="text-zinc-200 font-semibold">{selectedNews.timestamp}</span></p>
            </div>

            <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl text-xs text-zinc-300 leading-relaxed">
              {selectedNews.summary}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
              >
                Tutup
              </button>
              {onNavigateToLogbookWithNews && (
                <button
                  onClick={() => {
                    const item = selectedNews;
                    setSelectedNews(null);
                    onNavigateToLogbookWithNews(item);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-glow-red flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Jadikan Logbook SOC</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
