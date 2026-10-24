export type ThreatType = 
  | 'ADVANCE_FEE_SCAM' 
  | 'FREEMAIL_IMPERSONATION' 
  | 'PREMATURE_IDENTITY_EXTRACTION';

export interface ThreatAnalysis {
  isSuspicious: boolean;
  threatTypes: ThreatType[];
  reasons: string[];
  riskScore: number; // 0 to 100
}

export type ApplicationStage = 
  | 'APPLIED' 
  | 'ASSESSMENT_OR_SCREEN' 
  | 'INTERVIEW_SCHEDULED' 
  | 'OFFER_EXTENDED' 
  | 'REJECTED';

export interface RawEmail {
  id: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  body: string;
  receivedDate: string; // ISO 8601 string
}

export interface ProcessedApplication {
  id: string;
  companyName: string;
  roleTitle: string;
  stage: ApplicationStage;
  lastContactDate: string;
  daysInactive: number;
  isNeedsFollowUp: boolean;
  threatAssessment: ThreatAnalysis;
  rawEmail: RawEmail;
  emailHistory?: RawEmail[];
}

export interface FollowUpTask {
  applicationId: string;
  companyName: string;
  roleTitle: string;
  recipientEmail: string;
  daysElapsed: number;
  generatedSubject: string;
  generatedBody: string;
}

export interface InterviewBrief {
  company: string;
  role: string;
  interviewDate: string;
  technicalTopics: string[];
  deepDiveQuestions: string[];
  reverseInterviewQuestions: string[];
}
