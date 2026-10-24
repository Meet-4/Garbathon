import { RawEmail, ProcessedApplication, ApplicationStage } from '../types';
import { analyzeThreat } from './securityEngine';

const REFERENCE_DATE_ISO = '2026-10-24T00:00:00Z';

function parseCompanyAndRole(email: RawEmail): { companyName: string; roleTitle: string } {
  const text = `${email.subject} ${email.senderName} ${email.body}`;

  // Company extraction
  let companyName = 'Unknown Enterprise';
  if (/stripe/i.test(text)) companyName = 'Stripe';
  else if (/uber/i.test(text)) companyName = 'Uber';
  else if (/databricks/i.test(text)) companyName = 'Databricks';
  else if (/snowflake/i.test(text)) companyName = 'Snowflake';
  else if (/microsoft|azure|msft/i.test(text)) companyName = 'Microsoft';
  else if (/figma/i.test(text)) companyName = 'Figma';
  else if (/amazon|aws/i.test(text)) companyName = 'Amazon AWS';
  else if (/coinbase/i.test(text)) companyName = 'Coinbase';
  else if (/notion/i.test(text)) companyName = 'Notion';
  else if (/anthropic/i.test(text)) companyName = 'Anthropic';
  else if (/datadog/i.test(text)) companyName = 'Datadog';
  else if (/openai/i.test(text)) companyName = 'OpenAI';
  else if (/google/i.test(text)) companyName = 'Google Cloud';
  else if (/linear/i.test(text)) companyName = 'Linear';
  else if (/airtable/i.test(text)) companyName = 'Airtable';
  else if (/scale(\s+ai)?/i.test(text)) companyName = 'Scale AI';
  else if (/canva/i.test(text)) companyName = 'Canva';
  else if (/gusto/i.test(text)) companyName = 'Gusto';
  else if (/elastic/i.test(text)) companyName = 'Elastic';

  // Role extraction
  let roleTitle = 'Software Engineer';
  if (/staff software engineer/i.test(text)) roleTitle = 'Staff Software Engineer';
  else if (/sr backend engineer|senior backend engineer/i.test(text)) roleTitle = 'Sr Backend Engineer';
  else if (/senior cloud architect|azure cloud architect/i.test(text)) roleTitle = 'Senior Cloud Architect';
  else if (/product infrastructure/i.test(text)) roleTitle = 'Product Infrastructure Engineer';
  else if (/lead architect/i.test(text)) roleTitle = 'Lead Architect';
  else if (/research engineer/i.test(text)) roleTitle = 'Research Engineer';
  else if (/full stack engineer/i.test(text)) roleTitle = 'Full Stack Engineer';
  else if (/senior engineer/i.test(text)) roleTitle = 'Senior Engineer';
  else if (/notion engineering/i.test(text)) roleTitle = 'Engineering';

  return { companyName, roleTitle };
}

function classifyStage(email: RawEmail): ApplicationStage {
  const content = `${email.subject} ${email.body}`.toLowerCase();

  if (
    content.includes('decided not to move forward') ||
    content.includes('proceeding with other applicants') ||
    content.includes('will not be advancing') ||
    content.includes('not moving forward')
  ) {
    return 'REJECTED';
  }

  if (
    content.includes('offer of employment') ||
    content.includes('thrilled to offer you the role') ||
    content.includes('official offer letter')
  ) {
    return 'OFFER_EXTENDED';
  }

  if (
    content.includes('is scheduled for') ||
    content.includes('round is scheduled') ||
    content.includes('interview confirmation')
  ) {
    return 'INTERVIEW_SCHEDULED';
  }

  if (
    content.includes('invitation to screen') ||
    content.includes('technical assessment') ||
    content.includes('post-screen follow-up') ||
    content.includes('introductory recruiter conversation') ||
    content.includes('moving you to the technical interview loop')
  ) {
    return 'ASSESSMENT_OR_SCREEN';
  }

  return 'APPLIED';
}

export function calculateDaysInactive(receivedDateStr: string, referenceDateStr: string = REFERENCE_DATE_ISO): number {
  const received = new Date(receivedDateStr);
  const ref = new Date(referenceDateStr);
  const diffTime = Math.abs(ref.getTime() - received.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function processRawEmails(rawEmails: RawEmail[], refDateStr: string = REFERENCE_DATE_ISO): ProcessedApplication[] {
  // First, parse each email individually
  const individualApps = rawEmails.map((email) => {
    const { companyName, roleTitle } = parseCompanyAndRole(email);
    const threatAssessment = analyzeThreat(email);
    const stage = classifyStage(email);
    const daysInactive = calculateDaysInactive(email.receivedDate, refDateStr);
    const isNeedsFollowUp = stage === 'APPLIED' && daysInactive >= 7 && !threatAssessment.isSuspicious;

    return {
      id: `app-${email.id}`,
      companyName,
      roleTitle,
      stage,
      lastContactDate: email.receivedDate,
      daysInactive,
      isNeedsFollowUp,
      threatAssessment,
      rawEmail: email,
      emailHistory: [email],
    };
  });

  // Group and consolidate by company to merge progressive threads (e.g., Coinbase #8 and #15)
  const consolidatedMap = new Map<string, ProcessedApplication>();

  individualApps.forEach((app) => {
    // If it's suspicious, keep it distinct as a security alert
    if (app.threatAssessment.isSuspicious) {
      consolidatedMap.set(app.id, app);
      return;
    }

    const key = app.companyName.toLowerCase();
    if (!consolidatedMap.has(key)) {
      consolidatedMap.set(key, app);
    } else {
      const existing = consolidatedMap.get(key)!;
      existing.emailHistory = [...(existing.emailHistory || []), app.rawEmail];

      // Update to latest interaction
      if (new Date(app.lastContactDate) >= new Date(existing.lastContactDate)) {
        existing.stage = app.stage;
        existing.lastContactDate = app.lastContactDate;
        existing.daysInactive = app.daysInactive;
        existing.rawEmail = app.rawEmail;
        existing.isNeedsFollowUp = existing.stage === 'APPLIED' && existing.daysInactive >= 7;
      }
    }
  });

  return Array.from(consolidatedMap.values());
}
