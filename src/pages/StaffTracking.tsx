import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  ShieldAlert, 
  Radio, 
  Battery, 
  BatteryCharging, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Sliders, 
  Plus, 
  Compass, 
  LocateFixed, 
  Crosshair, 
  FileCode, 
  ArrowUpRight, 
  RefreshCw, 
  X,
  Volume2,
  VolumeX,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  StaffMember, 
  GeofenceZone, 
  GeofenceBreachLog, 
  GPSCoordinate, 
  StandardAPIResponse, 
  LogEntry 
} from '../types';

interface StaffTrackingProps {
  onEscalateToLogbook?: (log: Partial<LogEntry>) => void;
}

// Haversine formula kalkulasi jarak 2 titik koordinat bumi dalam satuan meter
export const calculateDistanceMeters = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371e3; // Radius bumi dalam meter
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Validasi ketat koordinat latitude (-90 s/d 90) dan longitude (-180 s/d 180)
export const validateCoordinates = (lat: number, lon: number): boolean => {
  return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

// Default Geofence Zones (Indonesia SOC Core Sites)
const DEFAULT_ZONES: GeofenceZone[] = [
  {
    id: 'zone-01',
    name: 'Zona 1: Ring 1 Obvitnas Istana & Monas',
    code: 'Z-JKT-MONAS',
    center: {
      latitude: -6.175392,
      longitude: 106.827153
    },
    radiusMeters: 800,
    propertyType: 'Pusat Pemerintahan & Ring 1',
    riskLevel: 'CRITICAL',
    description: 'Area pembatasan perimeter tinggi objek vital nasional DKI Jakarta.'
  },
  {
    id: 'zone-02',
    name: 'Zona 2: Kilang Minyak Obvitnas Plaju',
    code: 'Z-PLJ-OBVIT',
    center: {
      latitude: -2.990928,
      longitude: 104.823611
    },
    radiusMeters: 1200,
    propertyType: 'Kilang Migas Obvitnas',
    riskLevel: 'HIGH',
    description: 'Perimeter tangki bahan bakar dan instalasi pipa bertekanan tinggi.'
  },
  {
    id: 'zone-03',
    name: 'Zona 3: Bandara Soekarno-Hatta Perimeter T3',
    code: 'Z-CGK-T3',
    center: {
      latitude: -6.125556,
      longitude: 106.655833
    },
    radiusMeters: 1500,
    propertyType: 'Transportasi Udara Internasional',
    riskLevel: 'HIGH',
    description: 'Sektor landasan pacu, hanggar kargo, dan gerbang perimeter udara.'
  }
];

// Initial Staff Members
const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'stf-01',
    staffId: 'STF-8891',
    name: 'Kapten Budi Santoso',
    callsign: 'GARUDA-01',
    role: 'Komandan Regu Patroli Sektor Barat',
    phone: '+62 811-9922-101',
    batteryLevel: 88,
    assignedZoneId: 'zone-01',
    currentLocation: {
      latitude: -6.175100,
      longitude: 106.827300,
      accuracy: 4,
      speed: 3.2,
      altitude: 15,
      timestamp: new Date().toISOString()
    },
    status: 'IN_ZONE',
    lastPing: '1 menit lalu',
    distanceFromZoneCenter: 35
  },
  {
    id: 'stf-02',
    staffId: 'STF-8892',
    name: 'Lettu Farhan Pratama',
    callsign: 'MERPATI-07',
    role: 'Patroli Mobile Sepeda Motor',
    phone: '+62 812-4411-902',
    batteryLevel: 64,
    assignedZoneId: 'zone-01',
    currentLocation: {
      latitude: -6.184500,
      longitude: 106.828900,
      accuracy: 6,
      speed: 24.5,
      altitude: 12,
      timestamp: new Date().toISOString()
    },
    status: 'GEOFENCE_BREACH', // Di luar radius 800m
    lastPing: 'Baru saja',
    distanceFromZoneCenter: 1030
  },
  {
    id: 'stf-03',
    staffId: 'STF-8893',
    name: 'Serma Agus Supriatna',
    callsign: 'BADAK-04',
    role: 'Pengawas Sensor Perimeter Pintu 4',
    phone: '+62 813-7722-304',
    batteryLevel: 92,
    assignedZoneId: 'zone-02',
    currentLocation: {
      latitude: -2.991200,
      longitude: 104.823900,
      accuracy: 3,
      speed: 0.0,
      altitude: 20,
      timestamp: new Date().toISOString()
    },
    status: 'IN_ZONE',
    lastPing: '2 menit lalu',
    distanceFromZoneCenter: 45
  }
];

export const StaffTrackingPage: React.FC<StaffTrackingProps> = ({ onEscalateToLogbook }) => {
  const { currentUser, getOperatorStorage, setOperatorStorage } = useAuth();

  const [zones, setZones] = useState<GeofenceZone[]>(() => {
    return getOperatorStorage<GeofenceZone[]>('staff_geofence_zones', DEFAULT_ZONES);
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    return getOperatorStorage<StaffMember[]>('staff_tracking_list', DEFAULT_STAFF);
  });

  const [breachLogs, setBreachLogs] = useState<GeofenceBreachLog[]>(() => {
    return getOperatorStorage<GeofenceBreachLog[]>('staff_breach_logs', [
      {
        id: 'brc-01',
        breachId: 'BRC-2026-104',
        staffId: 'STF-8892',
        staffCallsign: 'MERPATI-07',
        staffName: 'Lettu Farhan Pratama',
        zoneId: 'zone-01',
        zoneName: 'Zona 1: Ring 1 Obvitnas Istana & Monas',
        timestamp: '27/10/2026 13:45 WIB',
        coordinates: {
          latitude: -6.184500,
          longitude: 106.828900
        },
        distanceMeters: 1030,
        status: 'ALERT',
        alertSeverity: 'CRITICAL'
      }
    ]);
  });

  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || '');

  // HTML5 Real Device GPS State
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);
  const [liveGpsError, setLiveGpsError] = useState<string | null>(null);
  const [liveGpsCoords, setLiveGpsCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Simulation State
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const simulationIntervalRef = useRef<any>(null);

  // Manual Telemetry Form
  const [manualStaffId, setManualStaffId] = useState('STF-8891');
  const [manualLat, setManualLat] = useState('-6.175100');
  const [manualLng, setManualLng] = useState('106.827300');
  const [telemetryMessage, setTelemetryMessage] = useState<string | null>(null);

  // Modals
  const [jsonExportModal, setJsonExportModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Persistence
  useEffect(() => {
    setOperatorStorage('staff_geofence_zones', zones);
    setOperatorStorage('staff_tracking_list', staffList);
    setOperatorStorage('staff_breach_logs', breachLogs);
  }, [zones, staffList, breachLogs]);

  // Handle HTML5 Device Geolocation
  const toggleLiveGps = () => {
    if (isLiveGpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveGpsActive(false);
      setLiveGpsError(null);
      return;
    }

    if (!('geolocation' in navigator)) {
      setLiveGpsError('Browser atau perangkat ini tidak mendukung HTML5 Geolocation API.');
      return;
    }

    setLiveGpsError(null);
    setIsLiveGpsActive(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, altitude } = position.coords;
        setLiveGpsCoords({ lat: latitude, lng: longitude, accuracy });

        // Update / Add current Operator as a tracked device
        const activeZone = zones.find(z => z.id === selectedZoneId) || zones[0];
        const distance = calculateDistanceMeters(
          latitude, 
          longitude, 
          activeZone.center.latitude, 
          activeZone.center.longitude
        );

        const isBreach = distance > activeZone.radiusMeters;
        const nowIso = new Date().toISOString();

        setStaffList(prev => {
          const operatorIdx = prev.findIndex(s => s.staffId === 'OPERATOR-DEVICE');
          const operatorEntry: StaffMember = {
            id: 'stf-operator-live',
            staffId: 'OPERATOR-DEVICE',
            name: `${currentUser?.callsign || 'Operator'} (Device GPS)`,
            callsign: currentUser?.callsign || 'HQ-OPERATOR',
            role: 'Device Sensor / Posko Operasional',
            phone: 'Internal Session',
            batteryLevel: 99,
            assignedZoneId: activeZone.id,
            currentLocation: {
              latitude,
              longitude,
              accuracy: Math.round(accuracy),
              speed: speed ? Math.round(speed * 3.6) : 0,
              altitude: altitude ? Math.round(altitude) : 10,
              timestamp: nowIso
            },
            status: isBreach ? 'GEOFENCE_BREACH' : 'IN_ZONE',
            lastPing: 'Live Realtime',
            distanceFromZoneCenter: distance
          };

          if (operatorIdx === -1) {
            return [operatorEntry, ...prev];
          } else {
            const next = [...prev];
            next[operatorIdx] = operatorEntry;
            return next;
          }
        });

        // Trigger breach log if breach occurred
        if (isBreach) {
          triggerBreachAlert({
            staffId: 'OPERATOR-DEVICE',
            staffCallsign: currentUser?.callsign || 'HQ-OPERATOR',
            staffName: `${currentUser?.callsign || 'Operator'} (Live GPS)`,
            zone: activeZone,
            coords: { latitude, longitude },
            distance
          });
        }
      },
      (err) => {
        setLiveGpsError(`Gagal memperoleh koordinat GPS: ${err.message}`);
        setIsLiveGpsActive(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Helper trigger breach alert
  const triggerBreachAlert = ({
    staffId,
    staffCallsign,
    staffName,
    zone,
    coords,
    distance
  }: {
    staffId: string;
    staffCallsign: string;
    staffName: string;
    zone: GeofenceZone;
    coords: { latitude: number; longitude: number };
    distance: number;
  }) => {
    const newLog: GeofenceBreachLog = {
      id: `brc-${Date.now()}`,
      breachId: `BRC-2026-${Math.floor(100 + Math.random() * 900)}`,
      staffId,
      staffCallsign,
      staffName,
      zoneId: zone.id,
      zoneName: zone.name,
      timestamp: new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date()) + ' WIB',
      coordinates: coords,
      distanceMeters: distance,
      status: 'ALERT',
      alertSeverity: distance > zone.radiusMeters * 1.5 ? 'CRITICAL' : 'HIGH'
    };

    setBreachLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Simulation Mode: toggle patrol simulation
  const toggleSimulation = () => {
    if (isSimulationRunning) {
      clearInterval(simulationIntervalRef.current);
      setIsSimulationRunning(false);
      return;
    }

    setIsSimulationRunning(true);
    let step = 0;

    simulationIntervalRef.current = setInterval(() => {
      step += 1;
      const angle = (step * 25) * (Math.PI / 180);
      const activeZone = zones.find(z => z.id === 'zone-01') || zones[0];

      // Oscillate distance between 400m and 1300m
      const distanceMeters = 400 + Math.sin(step * 0.3) * 800;
      const deltaLat = (distanceMeters / 111111) * Math.cos(angle);
      const deltaLng = (distanceMeters / (111111 * Math.cos(activeZone.center.latitude * (Math.PI / 180)))) * Math.sin(angle);

      const simLat = Number((activeZone.center.latitude + deltaLat).toFixed(6));
      const simLng = Number((activeZone.center.longitude + deltaLng).toFixed(6));
      const isBreach = distanceMeters > activeZone.radiusMeters;

      setStaffList(prev => {
        return prev.map(s => {
          if (s.staffId === 'STF-8892') { // MERPATI-07 mobile patrol
            return {
              ...s,
              currentLocation: {
                ...s.currentLocation,
                latitude: simLat,
                longitude: simLng,
                speed: Math.round(20 + Math.random() * 15),
                timestamp: new Date().toISOString()
              },
              status: isBreach ? 'GEOFENCE_BREACH' : 'IN_ZONE',
              distanceFromZoneCenter: Math.round(distanceMeters)
            };
          }
          return s;
        });
      });

      if (isBreach && step % 4 === 0) {
        triggerBreachAlert({
          staffId: 'STF-8892',
          staffCallsign: 'MERPATI-07',
          staffName: 'Lettu Farhan Pratama',
          zone: activeZone,
          coords: { latitude: simLat, longitude: simLng },
          distance: Math.round(distanceMeters)
        });
      }
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Process manual telemetry input
  const handleProcessManualTelemetry = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (!validateCoordinates(lat, lng)) {
      setTelemetryMessage('Koordinat tidak valid! Latitude wajib -90 s/d 90, Longitude -180 s/d 180.');
      return;
    }

    const staff = staffList.find(s => s.staffId === manualStaffId) || staffList[0];
    const assignedZone = zones.find(z => z.id === staff.assignedZoneId) || zones[0];
    const distance = calculateDistanceMeters(lat, lng, assignedZone.center.latitude, assignedZone.center.longitude);
    const isBreach = distance > assignedZone.radiusMeters;

    const updatedStaffList = staffList.map(s => {
      if (s.staffId === staff.staffId) {
        return {
          ...s,
          currentLocation: {
            ...s.currentLocation,
            latitude: lat,
            longitude: lng,
            timestamp: new Date().toISOString()
          },
          status: isBreach ? ('GEOFENCE_BREACH' as const) : ('IN_ZONE' as const),
          distanceFromZoneCenter: distance
        };
      }
      return s;
    });

    setStaffList(updatedStaffList);

    if (isBreach) {
      triggerBreachAlert({
        staffId: staff.staffId,
        staffCallsign: staff.callsign,
        staffName: staff.name,
        zone: assignedZone,
        coords: { latitude: lat, longitude: lng },
        distance
      });
      setTelemetryMessage(`[GEOFENCE BREACH] Personel ${staff.callsign} berada ${distance}m di luar perimeter!`);
    } else {
      setTelemetryMessage(`[IN ZONE] Personel ${staff.callsign} berada ${distance}m di dalam perimeter aman.`);
    }

    setTimeout(() => setTelemetryMessage(null), 4000);
  };

  // Escalate breach to Daily Logbook
  const handleEscalateBreach = (log: GeofenceBreachLog) => {
    if (onEscalateToLogbook) {
      onEscalateToLogbook({
        title: `[Geofence Breach] Personel ${log.staffCallsign} Melewati Batas ${log.zoneName}`,
        category: 'PHYSICAL_SECURITY',
        severity: log.alertSeverity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        location: `${log.coordinates.latitude.toFixed(5)}, ${log.coordinates.longitude.toFixed(5)} (${log.zoneName})`,
        description: `Insiden Pelanggaran Geofence Telemetri GPS:\nPersonel: ${log.staffName} (${log.staffCallsign})\nID Staf: ${log.staffId}\nZona Target: ${log.zoneName}\nJarak Keluar Perimeter: ${log.distanceMeters} Meter\nKoordinat: Lat ${log.coordinates.latitude}, Lng ${log.coordinates.longitude}\nWaktu: ${log.timestamp}`,
        actionTaken: 'Aktivasi protokol peringatan radio saluran darurat dan koordinasi titik cegat satgas.'
      });
    }
  };

  // Pure JSON API Payload
  const generatePureJson = (): StandardAPIResponse<StaffMember> => {
    return {
      module: 'TRACKING',
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        summary: {
          total_staff_monitored: staffList.length,
          in_zone_count: staffList.filter(s => s.status === 'IN_ZONE').length,
          geofence_breach_count: staffList.filter(s => s.status === 'GEOFENCE_BREACH').length,
          active_zones_monitored: zones.length,
          latest_breach_alerts: breachLogs.slice(0, 3)
        },
        details: staffList,
        action_items: breachLogs
          .filter(b => b.status === 'ALERT')
          .map(b => `[GEOFENCE_BREACH_ALERT] Personel ${b.staffCallsign} terdeteksi ${b.distanceMeters}m di luar ${b.zoneName}. Dispatch kontak radio.`)
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

  const selectedStaff = staffList.find(s => s.id === selectedStaffId) || staffList[0];
  const activeZone = zones.find(z => z.id === selectedStaff?.assignedZoneId) || zones[0];
  const activeBreachesCount = staffList.filter(s => s.status === 'GEOFENCE_BREACH').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            RADAR TELEMETRI GPS // HTML5 GEOLOCATION & GEOFENCING
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
            STAFF TRACKING <span className="text-red-600">& GEOFENCING</span>
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Pemantauan Real-Time Koordinat GPS Personel Lapangan, Perimeter Obvitnas & Deteksi Pelanggaran Geofence
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* HTML5 Live GPS Toggle */}
          <button
            onClick={toggleLiveGps}
            className={`px-3 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
              isLiveGpsActive 
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse' 
                : 'bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-emerald-400'
            }`}
          >
            <LocateFixed className="w-4 h-4" />
            <span>{isLiveGpsActive ? 'GPS AKTIF (LIVE SENSOR)' : 'AKTIFKAN GPS SAYA'}</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            className={`px-3 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSimulationRunning
                ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-amber-400'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{isSimulationRunning ? 'STOP SIMULASI PATROLI' : 'SIMULASI PATROLI'}</span>
          </button>

          <button
            onClick={() => setJsonExportModal(true)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-cyan-400 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>EXPORT JSON API</span>
          </button>
        </div>
      </div>

      {/* Live GPS Error Warning if any */}
      {liveGpsError && (
        <div className="p-3 bg-red-950/60 border border-red-700 rounded-xl text-red-200 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{liveGpsError}</span>
        </div>
      )}

      {/* Telemetry Success/Breach Toast */}
      {telemetryMessage && (
        <div className="p-3 bg-black/80 border border-zinc-700 rounded-xl text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-zinc-100 font-bold">{telemetryMessage}</span>
        </div>
      )}

      {/* 2. STATISTIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 bg-[#090e1a] border border-zinc-800 rounded-xl">
          <span className="text-[10px] text-zinc-500 uppercase block">TOTAL PERSONEL</span>
          <span className="text-2xl font-black text-white">{staffList.length}</span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">Staf Aktif Dilacak</span>
        </div>

        <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/60 rounded-xl">
          <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            IN ZONE (AMAN)
          </span>
          <span className="text-2xl font-black text-emerald-400">
            {staffList.filter(s => s.status === 'IN_ZONE').length}
          </span>
          <span className="text-[10px] text-emerald-300/70 block mt-0.5">Dalam Perimeter</span>
        </div>

        <div className="p-3.5 bg-red-950/20 border border-red-800/60 rounded-xl">
          <span className="text-[10px] text-red-400 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            GEOFENCE BREACH
          </span>
          <span className="text-2xl font-black text-red-400">{activeBreachesCount}</span>
          <span className="text-[10px] text-red-300/70 block mt-0.5">Pelanggaran Batas</span>
        </div>

        <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/60 rounded-xl">
          <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            ZONA GEOFENCE
          </span>
          <span className="text-2xl font-black text-cyan-400">{zones.length}</span>
          <span className="text-[10px] text-cyan-300/70 block mt-0.5">Sektor Obvitnas Terdaftar</span>
        </div>
      </div>

      {/* 3. TACTICAL RADAR VISUALIZER & TELEMETRY PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        
        {/* Tactical Radar Display */}
        <div className="lg:col-span-2 p-5 bg-[#080d19] border border-zinc-800 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[420px]">
          {/* Radar background circles & grid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[380px] h-[380px] rounded-full border border-emerald-500"></div>
            <div className="w-[280px] h-[280px] rounded-full border border-emerald-500"></div>
            <div className="w-[180px] h-[180px] rounded-full border border-emerald-500"></div>
            <div className="w-[80px] h-[80px] rounded-full border border-emerald-500"></div>
            <div className="absolute w-full h-[1px] bg-emerald-500"></div>
            <div className="absolute h-full w-[1px] bg-emerald-500"></div>
          </div>

          {/* Radar Sweeper Line Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] pointer-events-none">
            <div className="w-full h-full rounded-full border-t-2 border-emerald-400/40 animate-spin" style={{ animationDuration: '4s' }}></div>
          </div>

          {/* Radar Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
              <div>
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                  DISPLAY RADAR GEOFENCE TACTICAL (REAL-TIME TELEMETRY)
                </h3>
                <span className="text-[10px] text-zinc-400">
                  Target: {activeZone.name} (Radius: {activeZone.radiusMeters} Meter)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block">GPS REFRESH</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                ONLINE 10 Hz
              </span>
            </div>
          </div>

          {/* Radar Canvas / Interactive Positions Simulation */}
          <div className="relative flex-1 flex items-center justify-center py-10 relative z-10">
            
            {/* Center Zone Pin (HQ) */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-cyan-600/60 border-2 border-cyan-400 flex items-center justify-center text-[10px] text-white font-black shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                HQ
              </div>
              <span className="text-[9px] text-cyan-300 font-bold mt-1 bg-black/70 px-1 rounded">
                PUSAT ZONA
              </span>
            </div>

            {/* Staff Pins mapped relative to distance */}
            {staffList.map((stf, index) => {
              const isBreach = stf.status === 'GEOFENCE_BREACH';
              // Positioning offsets based on index and breach status
              const angle = (index * 90 + (stf.distanceFromZoneCenter % 60)) * (Math.PI / 180);
              const maxVisualRadius = 140;
              const normalizedDist = Math.min(stf.distanceFromZoneCenter / (activeZone.radiusMeters * 1.5), 1.2);
              const posX = Math.cos(angle) * (normalizedDist * maxVisualRadius);
              const posY = Math.sin(angle) * (normalizedDist * maxVisualRadius);

              return (
                <div
                  key={stf.id}
                  onClick={() => setSelectedStaffId(stf.id)}
                  style={{
                    transform: `translate(${posX}px, ${posY}px)`
                  }}
                  className={`absolute cursor-pointer transition-transform duration-500 group flex flex-col items-center`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all ${
                    isBreach
                      ? 'bg-red-600 border-white text-white shadow-glow-red animate-bounce'
                      : 'bg-emerald-600 border-emerald-200 text-white shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  }`}>
                    {stf.callsign.slice(0, 2)}
                  </div>

                  <span className={`text-[9px] font-bold px-1 py-0.5 rounded mt-0.5 whitespace-nowrap shadow-md ${
                    isBreach ? 'bg-red-950 text-red-300 border border-red-600' : 'bg-black/80 text-zinc-200 border border-zinc-700'
                  }`}>
                    {stf.callsign} ({stf.distanceFromZoneCenter}m)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Radar Bottom Stats Bar */}
          <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400 relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Hijau: In Zone (Normal)
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Merah: Geofence Breach (Alert)
              </span>
            </div>

            <div className="text-zinc-500">
              Koordinat Pusat: {activeZone.center.latitude}, {activeZone.center.longitude}
            </div>
          </div>
        </div>

        {/* Selected Staff Dossier / Telemetry Inspector */}
        <div className="p-5 bg-[#090e1a] border border-zinc-800 rounded-2xl flex flex-col justify-between font-mono shadow-xl space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-[11px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                TELEMETRY INSPECTOR
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                selectedStaff?.status === 'GEOFENCE_BREACH'
                  ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-600'
              }`}>
                {selectedStaff?.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-white">{selectedStaff?.name}</h3>
              <p className="text-xs text-amber-400 font-bold">{selectedStaff?.callsign} • {selectedStaff?.staffId}</p>
              <p className="text-[11px] text-zinc-400 mt-1">{selectedStaff?.role}</p>
            </div>

            <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Latitude:</span>
                <span className="text-zinc-200 font-bold">{selectedStaff?.currentLocation.latitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Longitude:</span>
                <span className="text-zinc-200 font-bold">{selectedStaff?.currentLocation.longitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Akurasi GPS:</span>
                <span className="text-cyan-400 font-bold">±{selectedStaff?.currentLocation.accuracy || 5} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Kecepatan:</span>
                <span className="text-zinc-200 font-bold">{selectedStaff?.currentLocation.speed || 0} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Jarak Dari Pusat:</span>
                <span className={`font-black ${
                  (selectedStaff?.distanceFromZoneCenter || 0) > activeZone.radiusMeters ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {selectedStaff?.distanceFromZoneCenter} m / Batas {activeZone.radiusMeters} m
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-zinc-800/80">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  Baterai Perangkat:
                </span>
                <span className="text-zinc-200 font-bold">{selectedStaff?.batteryLevel}%</span>
              </div>
            </div>
          </div>

          {/* Quick Manual Telemetry Injector Form */}
          <form onSubmit={handleProcessManualTelemetry} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2 text-[11px]">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">
              INJEKSI TELEMETRI KOORDINAT MANUAL:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-zinc-500 block">Latitude (-90 to 90)</label>
                <input
                  type="text"
                  required
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full px-2 py-1 bg-black/60 border border-zinc-700 rounded text-zinc-100 text-xs"
                />
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 block">Longitude (-180 to 180)</label>
                <input
                  type="text"
                  required
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-full px-2 py-1 bg-black/60 border border-zinc-700 rounded text-zinc-100 text-xs"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold transition-colors"
            >
              Uji & Perbarui Telemetri
            </button>
          </form>
        </div>
      </div>

      {/* 4. REAL-TIME GEOFENCE BREACH LOG TABLE */}
      <div className="bg-[#090e1a] border border-red-900/60 rounded-2xl p-5 font-mono space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
            <span>LOG PELANGGARAN GEOFENCE REAL-TIME (BREACH AUDIT TRAIL):</span>
          </div>
          <span className="text-[10px] text-zinc-500">
            Total {breachLogs.length} Catatan Kejadian
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0e1628] border-b border-zinc-800 text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                <th className="py-2.5 px-3">Breach ID</th>
                <th className="py-2.5 px-3">Personel / Callsign</th>
                <th className="py-2.5 px-3">Zona Geofence</th>
                <th className="py-2.5 px-3">Jarak Pelanggaran</th>
                <th className="py-2.5 px-3">Waktu Kejadian</th>
                <th className="py-2.5 px-3">Status Alert</th>
                <th className="py-2.5 px-3 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {breachLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-zinc-500 text-xs">
                    Tidak ada catatan pelanggaran geofence aktif. Seluruh personel berada di dalam zona aman.
                  </td>
                </tr>
              ) : (
                breachLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-zinc-300">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px]">
                        {log.breachId}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {log.staffName} <span className="text-amber-400 font-bold">({log.staffCallsign})</span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300 text-[11px]">
                      {log.zoneName}
                    </td>
                    <td className="py-2.5 px-3 text-red-400 font-bold">
                      {log.distanceMeters} Meter
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400 text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-600 text-[9px] font-black uppercase">
                        {log.status} • {log.alertSeverity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {onEscalateToLogbook && (
                        <button
                          type="button"
                          onClick={() => handleEscalateBreach(log)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shadow-glow-red inline-flex items-center gap-1 transition-all"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Eskalasi ke Logbook</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL: JSON API EXPORT VIEW */}
      {jsonExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0a0f1d] border border-cyan-700/80 rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                  PAYLOAD RESMI API TELEMETRY (GPS GEOFENCING SCHEMA)
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
                100% Valid Coordinates • ISO 8601 UTC • Geofence Rules Evaluated
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
