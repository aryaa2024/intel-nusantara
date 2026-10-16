// TypeScript Definitions for Intel Nusantara

export type ClearanceLevel = 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL' | 'RESTRICTED';

export type OperatorRole = 'ADMIN' | 'OPERATOR' | 'COMMANDER' | 'INTEL_ANALYST' | 'CYBER_OPERATOR' | 'FIELD_AGENT';

export interface User {
  id: string;
  username: string;
  callsign: string;
  badgeNumber: string;
  role: OperatorRole;
  clearanceLevel: ClearanceLevel;
  unit: string;
  lastLogin: string;
  isOnline?: boolean;
}

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IncidentCategory = 
  | 'Crime'
  | 'Hazard'
  | 'Civil Unrest'
  | 'Cyber Attack'
  | 'Terrorism Suspected'
  | 'MALWARE_ANALYSIS'
  | 'NETWORK_INTRUSION'
  | 'OSINT_SURVEILLANCE'
  | 'CREDENTIAL_LEAK'
  | 'PHYSICAL_SECURITY'
  | 'DISINFORMATION'
  | 'DDOS_ANOMALY';

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'ESCALATED';

export interface LogEntry {
  id: string;
  incidentId: string;
  timestamp: string; // contoh: "16/10/2026 23:40 WIB"
  incidentDate: string; // Format YYYY-MM-DD
  operatorId: string;
  operatorCallsign: string;
  title: string;
  category: IncidentCategory;
  severity: SeverityLevel;
  status: IncidentStatus;
  classification: ClearanceLevel;
  location: string; // Lokasi / Wilayah Kejadian
  description: string; // Deskripsi Kronologi
  actionTaken: string; // Tindakan Mitigasi / Penanggulangan
  iocIndicators?: string[]; // Indikator Kompromi (Opsional)
  createdAt: string;
}

export type NewsCategory = 'Keamanan' | 'Bencana' | 'Politik' | 'Cyber' | 'Infrastruktur';

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  summary: string;
  fullContent?: string;
  timestamp: string; // Contoh: "10:42 WIB"
  publishedAt: string; // Format tanggal YYYY-MM-DD atau ISO
  daysAgo: number; // 0 untuk hari ini, 1-7 untuk arsip 7 hari
  category: NewsCategory | 'CYBER' | 'POLITIK' | 'GEOPOLITIK' | 'TERORISME' | 'INFRASTRUKTUR';
  threatLevel: SeverityLevel;
  sourceUrl: string;
  verified: boolean;
  region: string;
  impactScore?: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS';
  tags?: string[];
}

export type TargetStatus = 'UNKNOWN' | 'UNDER WATCH' | 'HIGH PRIORITY' | 'CLEARED' | 'ACTIVE_MONITORING' | 'TARGET_IDENTIFIED' | 'DORMANT' | 'NEUTRALIZED';

export interface TargetProfile {
  id: string;
  fullNameOrAlias: string; // Nama Lengkap / Alias
  codeName?: string;
  nik: string; // NIK / No Identitas
  phoneNumber: string; // No HP
  imei: string; // IMEI Perangkat
  lastKnownAddress: string; // Alamat Terakhir
  email: string; // Email
  photoUrl?: string; // Foto Target (URL atau Data URL)
  status: TargetStatus;
  threatLevel: SeverityLevel;
  classification: ClearanceLevel;
  category?: string;
  digitalFootprint?: {
    connectedPlatforms?: string[];
    dataBreaches?: string[];
    ipAddresses?: string[];
    socialHandles?: string[];
    cryptocurrencyWallets?: string[];
    domains?: string[];
  };
  notes: string;
  updatedAt: string;
  createdAt?: string;
}

export interface InstitutionalApiConfig {
  gatewayName: string;
  endpointUrl: string;
  apiKey: string;
  provider: 'DUKCAPIL_SECURE_GATEWAY' | 'TELCO_BTS_TRIANGULATION' | 'IMIGRASI_BORDER_CONTROL' | 'BSSN_THREAT_INTEL' | 'CUSTOM_API';
  status: 'READY' | 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  lastPingMs?: number;
  lastChecked?: string;
}

export interface AIAnalysisResult {
  id: string;
  targetOrQuery: string;
  riskScore: number; // 0 - 100
  threatVerdict: 'CRITICAL THREAT' | 'ELEVATED SUSPICION' | 'BENIGN ANOMALY' | 'SAFE / VERIFIED';
  mitreTactics: string[];
  summary: string;
  recommendedAction: string;
  analyzedAt: string;
}
