import React, { useEffect, useRef, useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Crosshair, 
  ShieldAlert, 
  Flame, 
  Clock,
  RotateCcw,
  Navigation,
  Sparkles,
  Users
} from 'lucide-react';
import { SituationalReport, SituationalThreatLevel } from '../types';
import { MOVEMENT_ROUTE_DATA, PARALLEL_EVENTS_DATA } from '../data/situationalIntelligenceData';

interface TacticalSituationalMapProps {
  reports: SituationalReport[];
  selectedReportId?: string | null;
  onSelectReport?: (report: SituationalReport) => void;
  focusedCoordinates?: { latitude: number; longitude: number } | null;
}

export const TacticalSituationalMap: React.FC<TacticalSituationalMapProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  focusedCoordinates
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const parallelMarkersRef = useRef<any[]>([]);
  const routePolylineRef = useRef<any>(null);
  const routeWaypointMarkersRef = useRef<any[]>([]);
  const tileLayersRef = useRef<any[]>([]);

  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [basemapMode, setBasemapMode] = useState<'dark' | 'satellite' | 'street'>('dark');
  
  // Kontrol Interaktif Ala MJ-Sentinel
  const [timeFilterHour, setTimeFilterHour] = useState<number | null>(null); // null = Seluruh hari, atau 6..18
  const [showRouteMassa, setShowRouteMassa] = useState<boolean>(true);
  const [showGiatMassa, setShowGiatMassa] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Kategori Sasaran & Palet Warna Resmi MJ-Sentinel
  const CATEGORY_COLORS: { label: string; color: string; bg: string }[] = [
    { label: 'Yudikatif / Penegak Hukum', color: '#ef4444', bg: 'bg-red-500' },
    { label: 'Korporasi / Swasta', color: '#f97316', bg: 'bg-orange-500' },
    { label: 'Korporasi / BUMN', color: '#eab308', bg: 'bg-amber-500' },
    { label: 'Korporasi / BUMD', color: '#14b8a6', bg: 'bg-teal-500' },
    { label: 'Pemerintah Pusat', color: '#3b82f6', bg: 'bg-blue-600' },
    { label: 'Pemda DKI / Ketenagakerjaan', color: '#06b6d4', bg: 'bg-cyan-500' },
    { label: 'Politik / Isu Nasional', color: '#a855f7', bg: 'bg-purple-500' },
    { label: 'Diplomatik', color: '#10b981', bg: 'bg-emerald-500' }
  ];

  // Helper pencocokan warna kategori
  const getCategoryColor = (report: any): string => {
    const cat = report.targetCategory || '';
    const found = CATEGORY_COLORS.find(c => cat.toLowerCase().includes(c.label.toLowerCase().slice(0, 8)));
    if (found) return found.color;

    // Fallback berdasarkan threat level
    if (report.threatLevel === 'CRITICAL') return '#ef4444';
    if (report.threatLevel === 'HIGH') return '#f97316';
    if (report.threatLevel === 'MEDIUM') return '#f59e0b';
    return '#10b981';
  };

  // Helper ukuran diameter marker berdasarkan estimasi massa
  const getMarkerSize = (crowd: number): { diameter: number; iconSize: number; label: string } => {
    if (crowd >= 200) return { diameter: 32, iconSize: 42, label: '≥200 org' };
    if (crowd >= 100) return { diameter: 26, iconSize: 36, label: '±150 org' };
    if (crowd >= 40) return { diameter: 20, iconSize: 30, label: '±50 org' };
    return { diameter: 14, iconSize: 24, label: '±15 org' };
  };

  // Fungsi ganti tema basemap peta (bebas watermark & tanpa API key)
  const switchBasemap = (mode: 'dark' | 'satellite' | 'street') => {
    const L = (window as any).L;
    const map = leafletMapInstanceRef.current;
    if (!L || !map) return;

    tileLayersRef.current.forEach(layer => {
      try {
        map.removeLayer(layer);
      } catch {
        // ignore
      }
    });
    tileLayersRef.current = [];

    if (mode === 'dark') {
      const base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Esri, HERE, Garmin, © OpenStreetMap'
      }).addTo(map);

      const ref = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);

      tileLayersRef.current = [base, ref];
    } else if (mode === 'satellite') {
      const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Esri, Maxar, Earthstar Geographics'
      }).addTo(map);

      const ref = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);

      tileLayersRef.current = [sat, ref];
    } else {
      const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      tileLayersRef.current = [osm];
    }

    setBasemapMode(mode);
  };

  // Inisialisasi Leaflet
  useEffect(() => {
    const checkLeaflet = () => {
      const L = (window as any).L;
      if (L && mapContainerRef.current) {
        if (!leafletMapInstanceRef.current) {
          try {
            // Default center Jakarta (titik episentrum unras)
            const map = L.map(mapContainerRef.current, {
              center: [-6.1850, 106.8280],
              zoom: 12,
              zoomControl: false,
              attributionControl: false
            });

            L.control.zoom({ position: 'bottomright' }).addTo(map);
            leafletMapInstanceRef.current = map;
            setIsLeafletReady(true);
            switchBasemap('dark');
          } catch (e) {
            console.warn('Leaflet init fallback', e);
            setIsLeafletReady(false);
          }
        } else {
          setIsLeafletReady(true);
        }
      }
    };

    checkLeaflet();
    const timer = setTimeout(checkLeaflet, 800);
    return () => clearTimeout(timer);
  }, []);

  // Update Polyline Rute Pergerakan Massa
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapInstanceRef.current;
    if (!L || !map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    routeWaypointMarkersRef.current.forEach(m => m.remove());
    routeWaypointMarkersRef.current = [];

    if (showRouteMassa && MOVEMENT_ROUTE_DATA?.titik?.length > 0) {
      const latlngs = MOVEMENT_ROUTE_DATA.titik.map(t => [t.lat, t.lon]);
      const poly = L.polyline(latlngs, {
        color: '#dc2626',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.95
      }).addTo(map);

      poly.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; padding: 6px; background: #0b1120; color: #f1f5f9; border: 1px solid #dc2626; border-radius: 6px;">
          <div style="font-weight: bold; color: #ef4444; margin-bottom: 2px;">${MOVEMENT_ROUTE_DATA.label}</div>
          <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 4px;">${MOVEMENT_ROUTE_DATA.teks}</div>
          <div style="font-size: 9px; color: #fca5a5; font-style: italic;">${MOVEMENT_ROUTE_DATA.catatan}</div>
        </div>
      `);
      routePolylineRef.current = poly;

      // Waypoint circle markers
      MOVEMENT_ROUTE_DATA.titik.forEach((wp, i) => {
        const wpIcon = L.divIcon({
          className: 'waypoint-marker',
          html: `
            <div style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#991b1b;border:2px solid #ffffff;color:#fff;font-size:9px;font-weight:900;box-shadow:0 0 8px #ef4444;">
              ${i + 1}
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const m = L.marker([wp.lat, wp.lon], { icon: wpIcon }).addTo(map);
        m.bindPopup(`
          <div style="font-family: monospace; font-size: 10px; padding: 4px; background: #0f172a; color: #f8fafc;">
            <strong>Pos ${i + 1}:</strong> ${wp.n}
          </div>
        `);
        routeWaypointMarkersRef.current.push(m);
      });
    }
  }, [showRouteMassa, isLeafletReady]);

  // Update Giat Massa Paralel (Non-Unras)
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapInstanceRef.current;
    if (!L || !map) return;

    parallelMarkersRef.current.forEach(m => m.remove());
    parallelMarkersRef.current = [];

    if (showGiatMassa && PARALLEL_EVENTS_DATA?.length > 0) {
      PARALLEL_EVENTS_DATA.forEach(ev => {
        const icon = L.divIcon({
          className: 'parallel-marker',
          html: `
            <div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#059669;border:2px solid #ffffff;box-shadow:0 0 10px #10b981;color:#ffffff;font-size:10px;font-weight:bold;">
              ★
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const m = L.marker([ev.lat, ev.lon], { icon }).addTo(map);
        const evNama = (ev as any).keg || (ev as any).nama || 'Giat Massa Publik';
        const evLokasi = (ev as any).l || (ev as any).lokasi || 'DKI Jakarta';
        const evMassa = (ev as any).m || (ev as any).massa || 1000;
        const evPJ = (ev as any).pj ? `PJ: ${(ev as any).pj}` : 'Beban lalu lintas DKI';

        m.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; padding: 6px; background: #064e3b; color: #ecfdf5; border-radius: 6px; min-width: 180px;">
            <div style="color: #34d399; font-weight: bold; text-transform: uppercase; font-size: 9px;">[GIAT MASSA PARALEL - NON UNRAS]</div>
            <div style="font-weight: bold; color: white; margin-top: 2px;">${evNama}</div>
            <div style="font-size: 10px; color: #a7f3d0; margin-top: 2px;">Lokasi: ${evLokasi}</div>
            <div style="font-size: 10px; color: #ffffff; margin-top: 2px; font-weight: 600;">Estimasi Beban: ±${evMassa.toLocaleString('id-ID')} orang</div>
            <div style="font-size: 9px; color: #d1fae5; margin-top: 4px; border-top: 1px solid #047857; padding-top: 2px;">Dampak: ${evPJ}</div>
          </div>
        `);
        parallelMarkersRef.current.push(m);
      });
    }
  }, [showGiatMassa, isLeafletReady]);

  // Update Titik Unjuk Rasa Terencana (Filter Jam, Kategori, & Ancaman)
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapInstanceRef.current;
    if (!L || !map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filtered = reports.filter(r => {
      // 1. Filter Ancaman
      if (activeFilter === 'CRITICAL' && r.threatLevel !== 'CRITICAL') return false;
      if (activeFilter === 'HIGH' && (r.threatLevel !== 'HIGH' && r.threatLevel !== 'CRITICAL')) return false;

      // 2. Filter Kategori Sasaran
      const repCat = (r as any).targetCategory;
      if (selectedCategory && repCat && !repCat.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // 3. Filter Jam Operasional (Time Slider)
      const hour = (r as any).startTimeHour;
      if (timeFilterHour !== null && hour !== undefined) {
        if (hour !== timeFilterHour && hour > timeFilterHour) return false;
      }

      return true;
    });

    filtered.forEach(report => {
      const colorHex = getCategoryColor(report);
      const isCritical = report.threatLevel === 'CRITICAL';
      const pulseClass = isCritical ? 'animate-ping' : '';
      const size = getMarkerSize(report.crowdCountEstimate || 20);

      const customIcon = L.divIcon({
        className: 'tactical-custom-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size.iconSize}px; height: ${size.iconSize}px; cursor: pointer;">
            <div style="position: absolute; width: ${size.diameter + 8}px; height: ${size.diameter + 8}px; border-radius: 9999px; background-color: ${colorHex}; opacity: 0.35;" class="${pulseClass}"></div>
            <div style="width: ${size.diameter}px; height: ${size.diameter}px; border-radius: 9999px; background-color: ${colorHex}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${colorHex}; display: flex; align-items: center; justify-content: center; color: white; font-size: ${size.diameter >= 26 ? '10px' : '8px'}; font-weight: 900; font-family: monospace;">
              ${report.crowdCountEstimate && report.crowdCountEstimate >= 50 ? report.crowdCountEstimate : '!'}
            </div>
          </div>
        `,
        iconSize: [size.iconSize, size.iconSize],
        iconAnchor: [size.iconSize / 2, size.iconSize / 2]
      });

      const marker = L.marker([report.coordinates.latitude, report.coordinates.longitude], {
        icon: customIcon
      }).addTo(map);

      const popupContent = `
        <div style="font-family: monospace; font-size: 11px; background: #090e1a; color: #f1f5f9; padding: 10px; border-radius: 8px; border: 1px solid #334155; min-width: 220px; box-shadow: 0 10px 25px rgba(0,0,0,0.8);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-weight: bold; color: ${colorHex}; text-transform: uppercase; font-size: 9px; padding: 2px 4px; background: rgba(255,255,255,0.08); border-radius: 4px;">
              ${(report as any).targetCategory || report.threatLevel}
            </span>
            <span style="color: #38bdf8; font-size: 10px; font-weight: bold;">
              ${report.timestamp}
            </span>
          </div>

          <div style="font-size: 12px; font-weight: 900; color: white; margin-bottom: 4px; line-height: 1.3;">
            ${report.targetEntity}
          </div>

          <div style="color: #cbd5e1; font-size: 10px; margin-bottom: 3px;">
            <strong>Massa:</strong> ${report.scaleEstimate}
          </div>

          <div style="color: #94a3b8; font-size: 10px; margin-bottom: 6px;">
            <strong>Organisasi:</strong> ${report.partiesInvolved}
          </div>

          <div style="color: #e2e8f0; font-size: 10px; line-height: 1.35; padding: 6px; background: #0f172a; border-radius: 4px; border-left: 2px solid ${colorHex}; margin-bottom: 6px;">
            ${report.issueSummary}
          </div>

          <div style="font-size: 9px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 4px; display: flex; justify-content: space-between;">
            <span>KLUSTER: ${(report as any).clusterGroup || 'DKI Jakarta'}</span>
            <span style="color: #38bdf8;">${report.coordinates.latitude.toFixed(4)}, ${report.coordinates.longitude.toFixed(4)}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'tactical-leaflet-popup',
        closeButton: false
      });

      marker.on('click', () => {
        if (onSelectReport) {
          onSelectReport(report);
        }
      });

      markersRef.current.push(marker);
    });
  }, [reports, isLeafletReady, activeFilter, timeFilterHour, selectedCategory, onSelectReport]);

  // Handle flyTo when focusedCoordinates or selectedReportId changes
  useEffect(() => {
    const map = leafletMapInstanceRef.current;
    if (!map) return;

    if (focusedCoordinates) {
      map.flyTo([focusedCoordinates.latitude, focusedCoordinates.longitude], 14, { duration: 1.2 });
    } else if (selectedReportId) {
      const rep = reports.find(r => r.id === selectedReportId);
      if (rep) {
        map.flyTo([rep.coordinates.latitude, rep.coordinates.longitude], 14, { duration: 1.2 });
      }
    }
  }, [focusedCoordinates, selectedReportId, reports]);

  // Reset tampilan ke pusat Jakarta
  const handleResetJakartaCenter = () => {
    const map = leafletMapInstanceRef.current;
    if (map) {
      map.flyTo([-6.1850, 106.8280], 12, { duration: 1.0 });
      setTimeFilterHour(null);
      setSelectedCategory(null);
      setActiveFilter('ALL');
    }
  };

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col shadow-2xl relative overflow-hidden font-mono text-zinc-100">
      
      {/* 1. Header Modul 01 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-950/70 border border-cyan-600/60 rounded-xl text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-wider uppercase flex items-center gap-2">
              <span className="text-amber-400 text-xs px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-800">01</span>
              PETA PERGERAKAN & SEBARAN TITIK AKSI
            </h3>
            <span className="text-[11px] text-zinc-400">
              Ukuran penanda = estimasi massa · warna = kategori sasaran · dilengkapi polyline rute pergerakan
            </span>
          </div>
        </div>

        {/* Basemap Switcher (Dark / Satelit / Street) */}
        <div className="flex items-center bg-black/80 border border-zinc-800 rounded-xl p-0.5 text-[10px]">
          <button
            onClick={() => switchBasemap('dark')}
            className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              basemapMode === 'dark'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Peta Taktis Gelap Komando"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>DARK</span>
          </button>
          <button
            onClick={() => switchBasemap('satellite')}
            className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              basemapMode === 'satellite'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Foto Udara Satelit Reconnaissance"
          >
            <Compass className="w-3 h-3 text-emerald-400" />
            <span>SATELIT</span>
          </button>
          <button
            onClick={() => switchBasemap('street')}
            className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              basemapMode === 'street'
                ? 'bg-blue-950 text-blue-300 border border-blue-700/80 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Peta Jalan Topografi OpenStreetMap"
          >
            <MapPin className="w-3 h-3 text-blue-400" />
            <span>STREET</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Control Bar (Time Slider + Toggles) */}
      <div className="bg-[#0b1222] border border-zinc-800/90 rounded-xl p-3 mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Slider Jam Interaktif */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase text-[11px]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>JAM:</span>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="range"
              min="6"
              max="18"
              step="1"
              value={timeFilterHour ?? 18}
              onChange={(e) => setTimeFilterHour(parseInt(e.target.value, 10))}
              className="w-32 sm:w-44 accent-cyan-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <span className="font-bold text-cyan-300 text-[11px] min-w-[85px]">
              {timeFilterHour !== null ? `≤ ${String(timeFilterHour).padStart(2, '0')}.00 WIB` : 'Seluruh Hari'}
            </span>
          </div>

          <button
            onClick={() => setTimeFilterHour(null)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              timeFilterHour === null 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-600' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Seluruh hari
          </button>
        </div>

        {/* Toggles: Rute Massa, Giat Massa, Reset Tampilan */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRouteMassa(!showRouteMassa)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
              showRouteMassa 
                ? 'bg-red-950/80 text-red-300 border-red-700 shadow-[0_0_8px_rgba(239,68,68,0.3)]' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
            title="Tampilkan garis konvoi pergerakan buruh/massa di jalan"
          >
            <Navigation className="w-3 h-3 text-red-400" />
            <span>Rute massa</span>
          </button>

          <button
            onClick={() => setShowGiatMassa(!showGiatMassa)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
              showGiatMassa 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
            title="Tampilkan titik kegiatan massa non-unras (wisuda, konser, tabligh akbar)"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Giat massa ({PARALLEL_EVENTS_DATA.length})</span>
          </button>

          <button
            onClick={handleResetJakartaCenter}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-1"
            title="Reset tampilan peta ke pusat Jakarta"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Reset tampilan</span>
          </button>
        </div>
      </div>

      {/* 3. Baris Filter Kategori Sasaran */}
      <div className="flex items-center gap-1.5 flex-wrap pt-2.5 text-[10px]">
        {CATEGORY_COLORS.map(cat => {
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(isSelected ? null : cat.label)}
              className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-zinc-800 text-white font-bold border-white' 
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Map Container */}
      <div className="relative w-full h-[460px] sm:h-[520px] rounded-xl overflow-hidden mt-3 border border-zinc-800 bg-[#070b14]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Fallback Vector Grid if loading */}
        {!isLeafletReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b14] z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500 flex items-center justify-center mx-auto shadow-glow-cyan animate-pulse">
              <Compass className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="text-sm font-bold text-white uppercase tracking-wider mt-3">
              MEMPERSIAPKAN PETA TAKTIS GEOSPASIAL...
            </div>
            <p className="text-xs text-zinc-400 max-w-sm mt-1">
              Menghubungkan ke server satelit geospasial Esri Dark Gray Canvas.
            </p>
          </div>
        )}

        {/* HUD Koordinat Overlay */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none bg-black/85 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] text-zinc-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>EPISENTRUM DKI:</span>
          <span className="text-cyan-300 font-bold">
            {focusedCoordinates 
              ? `${focusedCoordinates.latitude.toFixed(4)}, ${focusedCoordinates.longitude.toFixed(4)}`
              : selectedReport 
                ? `${selectedReport.coordinates.latitude.toFixed(4)}, ${selectedReport.coordinates.longitude.toFixed(4)}`
                : '-6.1850, 106.8280 (PUSAT JAKARTA)'
            }
          </span>
        </div>

        {/* Selected Target Dossier Mini Bar at Bottom */}
        {selectedReport && (
          <div className="absolute bottom-3 inset-x-3 z-10 bg-[#090e1a]/95 backdrop-blur-md border border-cyan-600/80 p-3 rounded-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                selectedReport.threatLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-700' :
                selectedReport.threatLevel === 'HIGH' ? 'bg-orange-950 text-orange-400 border border-orange-700' :
                'bg-amber-950 text-amber-400 border border-amber-700'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{selectedReport.targetEntity}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">
                    {selectedReport.status}
                  </span>
                  {(selectedReport as any).targetCategory && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {(selectedReport as any).targetCategory}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {selectedReport.region} • {selectedReport.scaleEstimate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-1 rounded font-bold">
                {selectedReport.coordinates.latitude.toFixed(4)}, {selectedReport.coordinates.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Legenda Ukuran Penanda & Catatan Analis (Screenshot 2) */}
      <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2">
        <div className="flex items-center gap-4 text-[10px] text-zinc-400 flex-wrap">
          <span className="font-bold text-zinc-300 uppercase">Ukuran penanda:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> ±15 orang
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-500"></span> ±50 orang
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4.5 h-4.5 rounded-full bg-cyan-500"></span> ±150 orang
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5.5 h-5.5 rounded-full bg-cyan-500"></span> ≥200 orang
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Giat massa non-unras
          </span>
          <span className="flex items-center gap-1.5 text-red-400 font-semibold">
            <span className="w-4 h-0.5 bg-red-500"></span> Rute pergerakan massa
          </span>
        </div>

        <p className="text-[10px] text-zinc-500 italic">
          Geser slider jam untuk melihat bagaimana titik aksi aktif berpindah sepanjang hari. Klik nama hotspot di panel kanan untuk memusatkan peta. Koordinat adalah estimasi geocode analis tingkat blok/gedung.
        </p>
      </div>

    </div>
  );
};
