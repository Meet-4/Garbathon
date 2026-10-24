import { RawEmail, ThreatAnalysis, ThreatType } from '../types';

const FREEMAIL_DOMAINS = new Set([
  'gmail.com',
  'outlook.com',
  'yahoo.com',
  'hotmail.com',
  'protonmail.com',
  'icloud.com',
  'aol.com',
  'mail.com',
  'zoho.com'
]);

const ENTERPRISE_BRANDS = [
  { name: 'Microsoft', pattern: /(microsoft|azure|msft)/i },
  { name: 'Google', pattern: /(google|alphabet|gcp)/i },
  { name: 'Amazon AWS', pattern: /(amazon|aws)/i },
  { name: 'Apple', pattern: /(apple)/i },
  { name: 'Meta', pattern: /(meta|facebook)/i },
  { name: 'Netflix', pattern: /(netflix)/i },
  { name: 'Stripe', pattern: /(stripe)/i },
  { name: 'Uber', pattern: /(uber)/i },
  { name: 'OpenAI', pattern: /(openai)/i },
  { name: 'Anthropic', pattern: /(anthropic)/i },
  { name: 'Databricks', pattern: /(databricks)/i },
  { name: 'Snowflake', pattern: /(snowflake)/i },
  { name: 'Figma', pattern: /(figma)/i },
  { name: 'Canva', pattern: /(canva)/i },
  { name: 'Airtable', pattern: /(airtable)/i },
  { name: 'Linear', pattern: /(linear)/i },
  { name: 'Datadog', pattern: /(datadog)/i },
  { name: 'Elastic', pattern: /(elastic)/i },
  { name: 'Gusto', pattern: /(gusto)/i },
  { name: 'Coinbase', pattern: /(coinbase)/i },
  { name: 'Scale AI', pattern: /(scale ai|scale\.com)/i }
];

const ADVANCE_FEE_PATTERNS = [
  /wire\s+(a\s+)?\$?\d+/i,
  /mandatory\s+onboarding.*fee/i,
  /training\s+module\s+fee/i,
  /shipping\s+(&|and)?\s+security\s+deposit/i,
  /equipment\s+shipping/i,
  /partner\s+account/i,
  /pay\s+\$\d+/i,
  /\$250.*fee/i,
  /\$180.*deposit/i
];

const PREMATURE_PII_PATTERNS = [
  /aadhaar(\s+card)?/i,
  /pan\s+card/i,
  /social\s+security(\s+number)?/i,
  /\bssn\b/i,
  /scanned\s+copies\s+of\s+your/i,
  /passport\s+scan/i,
  /driver'?s\s+license\s+scan/i
];

export function analyzeThreat(email: RawEmail): ThreatAnalysis {
  const threatTypes: ThreatType[] = [];
  const reasons: string[] = [];
  let riskScore = 0;

  const emailDomain = (email.senderEmail.split('@')[1] || '').toLowerCase().trim();
  const fullText = `${email.senderName} ${email.subject} ${email.body}`.toLowerCase();

  // 1. Evaluate Freemail Impersonation
  const isFreemail = FREEMAIL_DOMAINS.has(emailDomain);
  const claimedBrand = ENTERPRISE_BRANDS.find(b => b.pattern.test(fullText) || b.pattern.test(email.senderEmail));

  if (isFreemail && claimedBrand) {
    threatTypes.push('FREEMAIL_IMPERSONATION');
    reasons.push(
      `Sender claims affiliation with ${claimedBrand.name} but transmits from consumer freemail provider (@${emailDomain}).`
    );
    riskScore += 45;
  }

  // 2. Evaluate Advance-Fee Solicitation
  const matchedFee = ADVANCE_FEE_PATTERNS.find(regex => regex.test(fullText));
  if (matchedFee) {
    threatTypes.push('ADVANCE_FEE_SCAM');
    reasons.push(
      'Unlawful upfront financial extortion detected (training fee, equipment deposit, or partner account wire demand).'
    );
    riskScore += 50;
  }

  // 3. Evaluate Premature Identity Document Extraction
  const matchedPii = PREMATURE_PII_PATTERNS.find(regex => regex.test(fullText));
  if (matchedPii) {
    threatTypes.push('PREMATURE_IDENTITY_EXTRACTION');
    reasons.push(
      'Demands unencrypted government identification documents (Aadhaar, PAN, SSN, passport) prior to verified interviews or HR portal onboarding.'
    );
    riskScore += 45;
  }

  riskScore = Math.min(100, Math.max(0, riskScore));
  const isSuspicious = threatTypes.length > 0 || riskScore >= 40;

  return {
    isSuspicious,
    threatTypes,
    reasons,
    riskScore
  };
}
