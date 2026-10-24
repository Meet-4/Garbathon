import { RawEmail } from '../types';

export const MOCK_RAW_EMAILS: RawEmail[] = [
  {
    id: 1,
    date: 'Oct 10, 2026',
    dateIso: '2026-10-10',
    sender: 'careers@stripe.com',
    subject: 'Application Received: Staff Software Engineer',
    body: 'Thanks for applying. Our engineering talent team is reviewing your profile.',
    company: 'Stripe',
    role: 'Staff Software Engineer'
  },
  {
    id: 2,
    date: 'Oct 11, 2026',
    dateIso: '2026-10-11',
    sender: 'recruiting@uber.com',
    subject: 'Thank you for applying to Uber',
    body: 'We received your application for Sr Backend Engineer. No action needed now.',
    company: 'Uber',
    role: 'Sr Backend Engineer'
  },
  {
    id: 3,
    date: 'Oct 12, 2026',
    dateIso: '2026-10-12',
    sender: 'careers@databricks.com',
    subject: 'Update on your application',
    body: 'After careful review, we have decided not to move forward with your candidacy at this time.',
    company: 'Databricks',
    role: 'Software Engineer'
  },
  {
    id: 4,
    date: 'Oct 13, 2026',
    dateIso: '2026-10-13',
    sender: 'talent@snowflake.com',
    subject: 'Snowflake Application Status',
    body: 'Thank you for interviewing/applying. We are proceeding with other applicants.',
    company: 'Snowflake',
    role: 'Software Engineer'
  },
  {
    id: 5,
    date: 'Oct 14, 2026',
    dateIso: '2026-10-14',
    sender: 'msft-recruitment-hr@gmail.com',
    subject: 'Immediate Job Offer: Senior Cloud Architect',
    body: 'Congratulations! You are selected for Microsoft Azure Cloud Architect. To confirm your placement, wire a $250 mandatory onboarding training module fee to our partner account.',
    company: 'Microsoft (Impersonated)',
    role: 'Senior Cloud Architect'
  },
  {
    id: 6,
    date: 'Oct 15, 2026',
    dateIso: '2026-10-15',
    sender: 'hiring@figma.com',
    subject: 'Figma Application Received',
    body: "We have received your application for Product Infrastructure. We'll be in touch.",
    company: 'Figma',
    role: 'Product Infrastructure'
  },
  {
    id: 7,
    date: 'Oct 16, 2026',
    dateIso: '2026-10-16',
    sender: 'amazon-hr-support@outlook.com',
    subject: 'Direct Selection: Lead Architect',
    body: 'Your resume was shortlisted for AWS. Before we schedule an interview, reply with scanned copies of your Aadhaar and PAN card for initial verification.',
    company: 'Amazon / AWS (Impersonated)',
    role: 'Lead Architect'
  },
  {
    id: 8,
    date: 'Oct 17, 2026',
    dateIso: '2026-10-17',
    sender: 'recruiter@coinbase.com',
    subject: 'Invitation to Screen: Coinbase',
    body: "We'd love to chat. Please book a 30-min recruiter screen for Oct 21.",
    company: 'Coinbase',
    role: 'Software Engineer'
  },
  {
    id: 9,
    date: 'Oct 17, 2026',
    dateIso: '2026-10-17',
    sender: 'careers@notion.so',
    subject: 'Notion Engineering Application',
    body: 'Application received. Our team is actively reviewing candidates.',
    company: 'Notion',
    role: 'Engineering'
  },
  {
    id: 10,
    date: 'Oct 18, 2026',
    dateIso: '2026-10-18',
    sender: 'talent@anthropic.com',
    subject: 'Next Steps with Anthropic',
    body: 'We would like to invite you to complete our technical assessment before Oct 25.',
    company: 'Anthropic',
    role: 'Technical Candidate'
  },
  {
    id: 11,
    date: 'Oct 19, 2026',
    dateIso: '2026-10-19',
    sender: 'careers@datadoghq.com',
    subject: 'Application Confirmation',
    body: 'Thank you for your interest in Datadog. We are reviewing your submission.',
    company: 'Datadog',
    role: 'Software Engineer'
  },
  {
    id: 12,
    date: 'Oct 20, 2026',
    dateIso: '2026-10-20',
    sender: 'hiring@openai.com',
    subject: 'Technical Interview Confirmation: Research Engineer',
    body: 'Your system architecture round is scheduled for Tuesday, Oct 27, 2026 at 2:00 PM PST via Google Meet.',
    company: 'OpenAI',
    role: 'Research Engineer'
  },
  {
    id: 13,
    date: 'Oct 21, 2026',
    dateIso: '2026-10-21',
    sender: 'google-recruiting-desk@yahoo.com',
    subject: 'Job Offer - Google Cloud Services',
    body: 'Selected candidate! Offer letter attached. Pay $180 equipment shipping & security deposit to begin home office delivery.',
    company: 'Google (Impersonated)',
    role: 'Cloud Services'
  },
  {
    id: 14,
    date: 'Oct 21, 2026',
    dateIso: '2026-10-21',
    sender: 'talent@linear.app',
    subject: 'Linear: Application Received',
    body: "Thanks for applying for Full Stack Engineer. We'll reach out if there's a match.",
    company: 'Linear',
    role: 'Full Stack Engineer'
  },
  {
    id: 15,
    date: 'Oct 21, 2026',
    dateIso: '2026-10-21',
    sender: 'recruiter@coinbase.com',
    subject: 'Post-Screen Follow-up',
    body: 'Great chatting today. Moving you to the technical interview loop; scheduling details will follow.',
    company: 'Coinbase',
    role: 'Software Engineer'
  },
  {
    id: 16,
    date: 'Oct 22, 2026',
    dateIso: '2026-10-22',
    sender: 'jobs@airtable.com',
    subject: 'Airtable Application Update',
    body: 'We reviewed your background and will not be advancing your candidacy.',
    company: 'Airtable',
    role: 'Software Engineer'
  },
  {
    id: 17,
    date: 'Oct 22, 2026',
    dateIso: '2026-10-22',
    sender: 'hr@scale.com',
    subject: 'Next Steps: Scale AI',
    body: "Let's connect for an introductory recruiter conversation on Monday, Oct 26.",
    company: 'Scale AI',
    role: 'Engineering Candidate'
  },
  {
    id: 18,
    date: 'Oct 23, 2026',
    dateIso: '2026-10-23',
    sender: 'careers@canva.com',
    subject: 'Offer of Employment - Senior Engineer',
    body: 'We are thrilled to offer you the role. Please find the official offer letter and benefits breakdown attached.',
    company: 'Canva',
    role: 'Senior Engineer'
  },
  {
    id: 19,
    date: 'Oct 23, 2026',
    dateIso: '2026-10-23',
    sender: 'talent@gusto.com',
    subject: 'Gusto Application Received',
    body: 'We have received your application. Thank you for your patience while we review.',
    company: 'Gusto',
    role: 'Software Engineer'
  },
  {
    id: 20,
    date: 'Oct 24, 2026',
    dateIso: '2026-10-24',
    sender: 'careers@elastic.co',
    subject: 'Elastic Application Update',
    body: 'Your application is currently being evaluated by our hiring managers.',
    company: 'Elastic',
    role: 'Software Engineer'
  }
];
