import { RawEmail, EmailAnalysis, SecurityViolation, CanonicalStage } from '../types';

const FREE_MAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'yahoo.com',
  'hotmail.com',
  'protonmail.com',
  'icloud.com',
  'aol.com'
];

const KNOWN_ENTERPRISES = [
  'microsoft',
  'google',
  'amazon',
  'aws',
  'apple',
  'meta',
  'netflix',
  'stripe',
  'uber',
  'openai',
  'anthropic',
  'databricks',
  'snowflake',
  'figma',
  'canva',
  'airtable',
  'linear',
  'datadog',
  'elastic',
  'gusto',
  'coinbase',
  'scale'
];

const ADVANCE_FEE_REGEX = /(wire|fee|deposit|payment|pay \$|\$250|\$180|training module|onboarding fee|shipping & security|equipment shipping|partner account)/i;
const SENSITIVE_DOCS_REGEX = /(aadhaar|pan card|ssn|social security|passport scan|scanned copies of your|driver's license scan)/i;
const IMMEDIATE_OFFER_REGEX = /(immediate job offer|direct selection|selected candidate!|congratulations! you are selected)/i;

export function analyzeEmail(email: RawEmail): EmailAnalysis {
  const senderLower = email.sender.toLowerCase();
  const domain = senderLower.split('@')[1] || '';
  const textContent = `${email.subject} ${email.body}`.toLowerCase();

  const violations: SecurityViolation[] = [];
  let threatType: string | null = null;
  let riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
  let trustScore = 100;

  // 1. Free-mail domain spoofing
  const isFreeMail = FREE_MAIL_DOMAINS.includes(domain);
  const claimedEnterprise = KNOWN_ENTERPRISES.find(brand =>
    textContent.includes(brand) || senderLower.includes(brand) || (email.company && email.company.toLowerCase().includes(brand))
  );

  if (isFreeMail && claimedEnterprise) {
    violations.push({
      rule: 'FREE_MAIL_ENTERPRISE_SPOOF',
      severity: 'CRITICAL',
      desc: `Sender claims affiliation with ${claimedEnterprise.toUpperCase()} but utilizes consumer webmail (@${domain}).`
    });
    trustScore -= 45;
  }

  // 2. Advance fee demand
  if (ADVANCE_FEE_REGEX.test(textContent)) {
    const matched = textContent.match(ADVANCE_FEE_REGEX)![0];
    violations.push({
      rule: 'ADVANCE_FEE_SOLICITATION',
      severity: 'CRITICAL',
      desc: `Unlawful financial demand detected ("${matched}"). Legitimate employers never charge onboarding or hardware fees.`
    });
    threatType = threatType || 'Advance-Fee Fraud';
    trustScore -= 50;
  }

  // 3. Premature identity documents
  if (SENSITIVE_DOCS_REGEX.test(textContent)) {
    const matched = textContent.match(SENSITIVE_DOCS_REGEX)![0];
    violations.push({
      rule: 'PREMATURE_PII_EXTRACTION',
      severity: 'CRITICAL',
      desc: `Extortion of confidential government identity proofs (${matched.toUpperCase()}) over unencrypted email before official HR portal verification.`
    });
    threatType = threatType || 'Identity Theft / PII Harvesting';
    trustScore -= 45;
  }

  // 4. Instant job offer without interviews
  if (IMMEDIATE_OFFER_REGEX.test(textContent) && isFreeMail) {
    violations.push({
      rule: 'COLD_IMMEDIATE_OFFER',
      severity: 'HIGH',
      desc: 'Offer awarded immediately without technical screens or hiring manager interviews.'
    });
    trustScore -= 30;
  }

  trustScore = Math.max(0, Math.min(100, trustScore));

  if (violations.length > 0) {
    riskLevel = trustScore < 40 ? 'CRITICAL' : 'WARNING';
    if (!threatType) threatType = 'Suspicious Domain Spoof';
  }

  const isScam = riskLevel === 'CRITICAL' || violations.length >= 2;

  let stage: CanonicalStage = 'APPLIED';
  if (!isScam) {
    const bodySubject = `${email.subject} ${email.body}`.toLowerCase();
    if (
      bodySubject.includes('decided not to move forward') ||
      bodySubject.includes('proceeding with other applicants') ||
      bodySubject.includes('will not be advancing') ||
      bodySubject.includes('not moving forward')
    ) {
      stage = 'REJECTED';
    } else if (
      bodySubject.includes('offer of employment') ||
      bodySubject.includes('thrilled to offer you the role') ||
      bodySubject.includes('official offer letter')
    ) {
      stage = 'OFFER_EXTENDED';
    } else if (
      bodySubject.includes('is scheduled for') ||
      bodySubject.includes('round is scheduled') ||
      bodySubject.includes('interview confirmation')
    ) {
      stage = 'INTERVIEW_SCHEDULED';
    } else if (
      bodySubject.includes('invitation to screen') ||
      bodySubject.includes('technical assessment') ||
      bodySubject.includes('post-screen follow-up') ||
      bodySubject.includes('introductory recruiter conversation') ||
      bodySubject.includes('moving you to the technical interview loop')
    ) {
      stage = 'SCREEN_TECH';
    } else {
      stage = 'APPLIED';
    }
  } else {
    stage = 'SCAM_QUARANTINED';
  }

  return {
    emailId: email.id,
    isScam,
    riskLevel,
    trustScore,
    threatType,
    violations,
    stage
  };
}
