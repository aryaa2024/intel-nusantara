// TypeScript Definitions for Intel Nusantara

export type ClearanceLevel = 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL' | 'RESTRICTED';

export type OperatorRole = 'COMMANDER' | 'INTEL_ANALYST' | 'CYBER_OPERATOR' | 'FIELD_AGENT';

export interface User {
  id: string;
  username: string;
  callsign: string;
  badgeNumber: string;
  role: OperatorRole;
  clearanceLevel: ClearanceLevel;
  unit: string;
  lastLogin: string;
}

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IncidentCategory = 
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
  timestamp: string;
  operatorId: string;
  operatorCallsign: string;
  title: string;
  category: IncidentCategory;
  severity: SeverityLevel;
  status: IncidentStatus;
  classification: ClearanceLevel;
  iocIndicators: string[]; // IPs, Hashes, Domains, Phone, etc.
  description: string;
  actionTaken: string;
  location?: string;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  summary: string;
  timestamp: string;
  category: 'CYBER' | 'POLITIK' | 'GEOPOLITIK' | 'TERORISME' | 'INFRASTRUKTUR';
  threatLevel: SeverityLevel;
  sourceUrl?: string;
  verified: boolean;
  region: string;
}

export interface TargetProfile {
  id: string;
  codeName: string;
  alias: string;
  classification: ClearanceLevel;
  threatLevel: SeverityLevel;
  category: 'CYBER_THREAT_ACTOR' | 'ESPIONAGE_CELL' | 'EXTREMIST_GROUP' | 'FRAUD_NETWORK';
  status: 'ACTIVE_MONITORING' | 'TARGET_IDENTIFIED' | 'DORMANT' | 'NEUTRALIZED';
  lastSeenLocation: string;
  digitalFootprint: {
    ipAddresses?: string[];
    socialHandles?: string[];
    cryptocurrencyWallets?: string[];
    domains?: string[];
  };
  notes: string;
  updatedAt: string;
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
