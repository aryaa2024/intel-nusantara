import React, { useEffect, useRef, useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Maximize2, 
  Crosshair, 
  RefreshCw, 
  ShieldAlert, 
  Flame, 
  Users, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { SituationalReport, SituationalThreatLevel } from '../types';

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
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [hoveredReport, setHoveredReport] = useState<SituationalReport | null>(null);

  // Initialize or check Leaflet on mount
  useEffect(() => {
    const checkLeaflet = () => {
      const L = (window as any).L;
      if (L && mapContainerRef.current) {
        if (!leafletMapInstanceRef.current) {
          try {
            // Inisialisasi peta berpusat di wilayah kepulauan Indonesia
            const map = L.map(mapContainerRef.current, {
              center: [-2.5, 118.0],
              zoom: 5,
              zoomControl: false,
              attributionControl: false
            });

            // Dark CartoDB Matter Tile Layer (Tactical Dark Mode)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
              subdomains: 'abcd',
              maxZoom: 19
            }).addTo(map);

            // Tambahkan kontrol zoom kustom di sudut kanan bawah
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            leafletMapInstanceRef.current = map;
            setIsLeafletReady(true);
          } catch (e) {
            console.warn('Leaflet init fallback to tactical vector canvas', e);
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

  // Update Leaflet markers whenever reports or activeFilter change
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapInstanceRef.current;

    if (!L || !map) return;

    // Bersihkan marker lama
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filtered = reports.filter(r => {
      if (activeFilter === 'CRITICAL') return r.threatLevel === 'CRITICAL';
      if (activeFilter === 'HIGH') return r.threatLevel === 'HIGH' || r.threatLevel === 'CRITICAL';
      return true;
    });

    filtered.forEach(report => {
      const isCritical = report.threatLevel === 'CRITICAL';
      const isHigh = report.threatLevel === 'HIGH';
      const isMedium = report.threatLevel === 'MEDIUM';

      const colorHex = isCritical ? '#ef4444' : isHigh ? '#f97316' : isMedium ? '#f59e0b' : '#10b981';
      const pulseClass = isCritical ? 'animate-ping' : '';

      // Custom Tactical HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'tactical-custom-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: ${colorHex}; opacity: 0.35;" class="${pulseClass}"></div>
            <div style="width: 18px; height: 18px; border-radius: 9999px; background-color: ${colorHex}; border: 2px solid #ffffff; box-shadow: 0 0 12px ${colorHex}; display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: 900;">
              !
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([report.coordinates.latitude, report.coordinates.longitude], {
        icon: customIcon
      }).addTo(map);

      // Popup isi data taktis
      const popupContent = `
        <div style="font-family: monospace; font-size: 11px; background: #090e1a; color: #f1f5f9; padding: 8px; border-radius: 8px; border: 1px solid #334155; min-width: 200px;">
          <div style="font-weight: bold; color: ${colorHex}; text-transform: uppercase; font-size: 10px; margin-bottom: 2px;">
            [${report.threatLevel}] // ${report.status}
          </div>
          <div style="font-size: 12px; font-weight: 900; color: white; margin-bottom: 4px;">
            ${report.targetEntity}
          </div>
          <div style="color: #94a3b8; font-size: 10px; margin-bottom: 4px;">
            ${report.region} (${report.timestamp})
          </div>
          <div style="color: #cbd5e1; font-size: 11px; line-height: 1.3; margin-bottom: 6px;">
            ${report.scaleEstimate}
          </div>
          <div style="font-size: 9px; color: #38bdf8; border-top: 1px solid #1e293b; padding-top: 4px;">
            KOORDINAT: ${report.coordinates.latitude.toFixed(4)}, ${report.coordinates.longitude.toFixed(4)}
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
  }, [reports, isLeafletReady, activeFilter, onSelectReport]);

  // Handle focused coordinates or selected report focus
  useEffect(() => {
    const map = leafletMapInstanceRef.current;
    if (!map) return;

    if (focusedCoordinates) {
      map.flyTo([focusedCoordinates.latitude, focusedCoordinates.longitude], 12, {
        duration: 1.2
      });
    } else if (selectedReportId) {
      const rep = reports.find(r => r.id === selectedReportId);
      if (rep) {
        map.flyTo([rep.coordinates.latitude, rep.coordinates.longitude], 12, {
          duration: 1.2
        });
      }
    }
  }, [focusedCoordinates, selectedReportId, reports]);

  // Reset View to Indonesia Center
  const handleResetIndonesiaCenter = () => {
    const map = leafletMapInstanceRef.current;
    if (map) {
      map.flyTo([-2.5, 118.0], 5, { duration: 1.0 });
    }
  };

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className="bg-[#090e1a] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col shadow-2xl relative overflow-hidden font-mono text-zinc-100">
      
      {/* Top Map Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-950/70 border border-cyan-600/60 rounded-xl text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-wider uppercase flex items-center gap-2">
              PETA SITUASIONAL TAKTIS (LEAFLET / OSM ENGINE)
            </h3>
            <span className="text-[11px] text-zinc-400">
              Visualisasi Sebaran Objek, Wilayah Sasaran, & Koordinat GPS Real-Time
            </span>
          </div>
        </div>

        {/* Filter on Map & Quick Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/60 border border-zinc-800 rounded-xl p-0.5 text-[10px]">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              SEMUA ({reports.length})
            </button>
            <button
              onClick={() => setActiveFilter('HIGH')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'HIGH'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              HIGH ({reports.filter(r => r.threatLevel === 'HIGH' || r.threatLevel === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setActiveFilter('CRITICAL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'CRITICAL'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              CRITICAL ({reports.filter(r => r.threatLevel === 'CRITICAL').length})
            </button>
          </div>

          <button
            onClick={handleResetIndonesiaCenter}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1 shadow-sm"
            title="Pusatkan Peta ke Seluruh Wilayah Indonesia"
          >
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline text-[11px]">RESET HQ</span>
          </button>
        </div>
      </div>

      {/* Map Body: Leaflet Container with Visual Fallback */}
      <div className="relative w-full h-[400px] sm:h-[460px] rounded-xl overflow-hidden mt-3 border border-zinc-800 bg-[#070b14]">
        
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Fallback Vector Grid if Leaflet tiles are still downloading or offline */}
        {!isLeafletReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b14] z-10 p-6 text-center">
            {/* Tactical grid background rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-[320px] h-[320px] rounded-full border border-cyan-500"></div>
              <div className="w-[220px] h-[220px] rounded-full border border-cyan-500"></div>
              <div className="w-[120px] h-[120px] rounded-full border border-cyan-500"></div>
              <div className="w-full h-[1px] bg-cyan-500/40"></div>
              <div className="h-full w-[1px] bg-cyan-500/40"></div>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500 flex items-center justify-center mx-auto shadow-glow-cyan animate-pulse">
                <Compass className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                MEMPERSIAPKAN TACTICAL MAP CONTAINER...
              </div>
              <p className="text-xs text-zinc-400 max-w-sm">
                Menghubungkan ke satelit geospasial CartoDB Dark Matter & OpenStreetMap Indonesia.
              </p>
            </div>
          </div>
        )}

        {/* Tactical Crosshair HUD Overlay */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none bg-black/80 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] text-zinc-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>HUD KOORDINAT:</span>
          <span className="text-cyan-300 font-bold">
            {focusedCoordinates 
              ? `${focusedCoordinates.latitude.toFixed(4)}, ${focusedCoordinates.longitude.toFixed(4)}`
              : selectedReport 
                ? `${selectedReport.coordinates.latitude.toFixed(4)}, ${selectedReport.coordinates.longitude.toFixed(4)}`
                : '-2.5000, 118.0000 (PUSAT RI)'
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

      {/* Map Legend Footer */}
      <div className="flex items-center justify-between pt-3 mt-1 text-[11px] text-zinc-400 border-t border-zinc-800/60 flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-zinc-500 font-semibold text-[10px]">LEGENDA ANCAMAN:</span>
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> CRITICAL
          </span>
          <span className="flex items-center gap-1.5 text-orange-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> HIGH
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> MEDIUM
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> LOW / INFO
          </span>
        </div>

        <div className="text-[10px] text-zinc-500">
          PROYEKSI: WGS84 // GEO-RADAR NUSANTARA
        </div>
      </div>

    </div>
  );
};
