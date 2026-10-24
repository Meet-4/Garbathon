import { ProcessedApplication, RawEmail, InterviewBrief, FollowUpTask } from '../types';

export function downloadJsonFile(data: any, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildVerifiedExportPayload(
  applications: ProcessedApplication[],
  rawEmails: RawEmail[],
  interviewBrief: InterviewBrief | null,
  followUpTasks: FollowUpTask[]
) {
  const legitimate = applications.filter((a) => !a.threatAssessment.isSuspicious);
  const suspicious = applications.filter((a) => a.threatAssessment.isSuspicious);

  return {
    generation_timestamp: new Date().toISOString(),
    reference_date: '2026-10-24',
    system_summary: {
      total_emails_parsed: rawEmails.length,
      legitimate_pipelines: legitimate.length,
      quarantined_threats: suspicious.length,
      pending_follow_ups: followUpTasks.length,
    },
    scam_alerts: suspicious.map((s) => ({
      application_id: s.id,
      claimed_company: s.companyName,
      sender: s.rawEmail.senderEmail,
      threat_types: s.threatAssessment.threatTypes,
      risk_score: s.threatAssessment.riskScore,
      violations: s.threatAssessment.reasons,
      raw_snippet: s.rawEmail.body,
    })),
    tracker_board: {
      OFFER_EXTENDED: legitimate.filter((a) => a.stage === 'OFFER_EXTENDED'),
      INTERVIEW_SCHEDULED: legitimate.filter((a) => a.stage === 'INTERVIEW_SCHEDULED'),
      ASSESSMENT_OR_SCREEN: legitimate.filter((a) => a.stage === 'ASSESSMENT_OR_SCREEN'),
      APPLIED: legitimate.filter((a) => a.stage === 'APPLIED'),
      REJECTED: legitimate.filter((a) => a.stage === 'REJECTED'),
    },
    pending_follow_ups: followUpTasks.map((t) => ({
      company: t.companyName,
      role: t.roleTitle,
      recipient: t.recipientEmail,
      days_inactive: t.daysElapsed,
      outreach_subject: t.generatedSubject,
      outreach_body: t.generatedBody,
    })),
    interview_brief: interviewBrief,
  };
}

export function buildApplicationsCsv(applications: ProcessedApplication[]): string {
  const headers = ['ID', 'Company', 'Role Title', 'Stage', 'Days Inactive', 'Last Contact Date', 'Is Suspicious', 'Risk Score', 'Sender Email'];
  const rows = applications.map((app) => [
    app.id,
    `"${app.companyName.replace(/"/g, '""')}"`,
    `"${app.roleTitle.replace(/"/g, '""')}"`,
    app.stage,
    app.daysInactive,
    app.lastContactDate,
    app.threatAssessment.isSuspicious ? 'TRUE' : 'FALSE',
    app.threatAssessment.riskScore,
    `"${app.rawEmail.senderEmail.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
