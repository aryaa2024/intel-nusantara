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

export type NewsCategory = 
  | 'Keamanan' 
  | 'Bencana' 
  | 'Politik' 
  | 'Cyber' 
  | 'Infrastruktur'
  | 'Kriminal'
  | 'Terorisme'
  | 'Korupsi'
  | 'Demo';

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  summary: string;
  fullContent?: string;
  timestamp: string; // Contoh: "10:42 WIB"
  publishedAt: string; // Format tanggal YYYY-MM-DD atau ISO
  daysAgo: number; // 0 untuk hari ini, 1-7 untuk arsip 7 hari
  category: NewsCategory | string;
  threatLevel: SeverityLevel;
  sourceUrl: string;
  verified: boolean;
  region: string;
  impactScore?: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS';
  tags?: string[];
  isLiveIncoming?: boolean;
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

// ==========================================
// 1. EXTENDED MODULE: SECURITY RISK MANAGEMENT (ISO 31000)
// ==========================================
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MitigationStrategy = 'Avoid' | 'Transfer' | 'Mitigate' | 'Accept';

export interface RiskItem {
  id: string;
  riskId: string; // e.g. "RSK-2026-001"
  title: string;
  category: 'Physical Security' | 'Cyber Threat' | 'Infrastructure' | 'Personnel & Insider' | 'Sabotage / Terrorism' | 'Supply Chain';
  likelihood: number; // 1 - 5 (1: Rare, 2: Unlikely, 3: Possible, 4: Likely, 5: Almost Certain)
  impact: number; // 1 - 5 (1: Insignificant, 2: Minor, 3: Moderate, 4: Major, 5: Catastrophic)
  score: number; // likelihood * impact (1 - 25)
  level: RiskLevel;
  mitigationStrategy: MitigationStrategy;
  actionPlan: string;
  owner: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'TREATED' | 'ACCEPTED';
  assetName: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. EXTENDED MODULE: SECURITY ASSESSMENT (ASIS INTERNATIONAL)
// ==========================================
export type PropertyType = 
  | 'Residential' 
  | 'Commercial' 
  | 'Hotels' 
  | 'Apartments' 
  | 'Vital Objects / Obvitnas' 
  | 'Data Center';

export type AssessmentPillar = 
  | 'Perimeter Security' 
  | 'Access Control' 
  | 'Physical Infrastructure' 
  | 'Surveillance (CCTV)' 
  | 'Incident Response Readiness';

export interface ChecklistItem {
  id: string;
  pillar: AssessmentPillar;
  question: string;
  requirement: string;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  score: number; // 100, 50, 0
  weight: number;
  notes: string;
}

export interface GapAnalysisItem {
  id: string;
  pillar: AssessmentPillar;
  gapDescription: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  priorityOrder: number;
}

export interface SecurityAssessment {
  id: string;
  assessmentId: string; // e.g. "ASM-2026-001"
  propertyName: string;
  propertyType: PropertyType;
  location: string;
  assessorCallsign: string;
  complianceScore: number; // 0 - 100%
  pillarScores: Record<AssessmentPillar, number>;
  checklist: ChecklistItem[];
  gapAnalysis: GapAnalysisItem[];
  conductedAt: string;
  status: 'COMPLETED' | 'DRAFT' | 'REVIEW_PENDING';
  overallVerdict: 'SECURITY ADEQUATE' | 'MITIGATION REQUIRED' | 'CRITICAL VULNERABILITY';
}

// ==========================================
// 3. EXTENDED MODULE: STAFF TRACKING & GEOFENCING (GPS TELEMETRY)
// ==========================================
export type StaffTrackingStatus = 'IN_ZONE' | 'GEOFENCE_BREACH' | 'OFFLINE';

export interface GPSCoordinate {
  latitude: number; // -90 to 90
  longitude: number; // -180 to 180
  accuracy?: number; // meters
  speed?: number; // km/h
  altitude?: number; // meters
  timestamp: string; // ISO 8601
}

export interface GeofenceZone {
  id: string;
  name: string;
  code: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radiusMeters: number;
  propertyType: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  perimeterPolygon?: { lat: number; lng: number }[];
}

export interface StaffMember {
  id: string;
  staffId: string; // e.g. "STF-8891"
  name: string;
  callsign: string;
  role: string;
  phone: string;
  avatarUrl?: string;
  batteryLevel: number; // 0 - 100%
  assignedZoneId: string;
  currentLocation: GPSCoordinate;
  status: StaffTrackingStatus;
  lastPing: string;
  distanceFromZoneCenter: number; // meters
}

export interface GeofenceBreachLog {
  id: string;
  breachId: string; // e.g. "BRC-2026-104"
  staffId: string;
  staffCallsign: string;
  staffName: string;
  zoneId: string;
  zoneName: string;
  timestamp: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distanceMeters: number;
  status: 'ALERT' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
  alertSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

// ==========================================
// 4. EXTENDED MODULE: AUTOMATED REPORTING GENERATOR
// ==========================================
export type ReportInterval = 'Daily' | 'Weekly' | 'Monthly';

export interface StandardAPIResponse<T = any> {
  module: 'SRM' | 'ASSESSMENT' | 'TRACKING' | 'REPORTING';
  status: 'success' | 'error';
  timestamp: string;
  data: {
    summary: Record<string, any>;
    details: T[];
    action_items: string[];
  };
  error_handling: {
    has_error: boolean;
    warning_logs: string[];
  };
}

export interface GeneratedReport {
  id: string;
  reportId: string;
  interval: ReportInterval;
  title: string;
  generatedAt: string;
  periodLabel: string;
  authorCallsign: string;
  classification: ClearanceLevel;
  summary: {
    totalIncidents: number;
    criticalIncidents: number;
    srmMaxRiskScore: number;
    srmCriticalRisks: number;
    averageComplianceScore: number;
    activeStaffCount: number;
    geofenceBreachCount: number;
    operationalReadinessScore: number;
  };
  sections: {
    title: string;
    description: string;
    keyPoints: string[];
  }[];
  actionItems: string[];
  rawApiPayload: StandardAPIResponse;
}
