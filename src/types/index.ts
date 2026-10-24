export type CanonicalStage =
  | 'APPLIED'
  | 'SCREEN_TECH'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER_EXTENDED'
  | 'REJECTED'
  | 'SCAM_QUARANTINED';

export interface SecurityViolation {
  rule: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  desc: string;
}

export interface EmailAnalysis {
  emailId: number;
  isScam: boolean;
  riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
  trustScore: number;
  threatType: string | null;
  violations: SecurityViolation[];
  stage: CanonicalStage;
}

export interface RawEmail {
  id: number;
  date: string;
  dateIso: string;
  sender: string;
  subject: string;
  body: string;
  company: string;
  role: string;
}

export interface AnalyzedEmail extends RawEmail {
  analysis: EmailAnalysis;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  stage: CanonicalStage;
  lastDate: string;
  dateIso: string;
  daysElapsed: number;
  snippet: string;
  sender: string;
  emailThread: AnalyzedEmail[];
}

export interface FollowUpItem {
  company: string;
  role: string;
  appliedDate: string;
  daysElapsed: number;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}
