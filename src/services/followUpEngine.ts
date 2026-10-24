import { ProcessedApplication, FollowUpTask } from '../types';

export type OutreachTone = 'leverage' | 'standard' | 'concise';

export function generateFollowUpMessage(
  app: ProcessedApplication,
  tone: OutreachTone = 'leverage',
  candidateName: string = '[Your Full Name]',
  includeCompetingOffer: boolean = true
): { subject: string; body: string } {
  const company = app.companyName;
  const role = app.roleTitle;
  const days = app.daysInactive;
  const formattedDate = new Date(app.lastContactDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const subject = `Re: Application Status - ${role} - ${candidateName}`;
  let body = `Hi ${company} Recruiting Team,\n\n`;

  if (tone === 'concise') {
    body += `I am following up on my candidacy for the ${role} position submitted on ${formattedDate} (${days} days ago).\n\n`;
    if (includeCompetingOffer) {
      body += `I am currently in final stages and received a written offer from Canva (Senior Engineer), but remain very excited about ${company}'s technical roadmap.\n\n`;
    }
    body += `Could you share if there are any updates on your interview schedule?\n\nThank you,\n${candidateName}\n[LinkedIn Profile] | [Phone Number]`;
    return { subject, body };
  }

  if (tone === 'standard') {
    body += `I hope your week is going well.\n\n`;
    body += `I wanted to follow up regarding my application for the ${role} position, which I submitted on ${formattedDate}. Given my experience architecting resilient distributed backends, I am very enthusiastic about the opportunity to contribute to ${company}.\n\n`;
    if (includeCompetingOffer) {
      body += `For scheduling transparency, I have recently advanced to late-stage discussions and received a formal offer elsewhere (Canva), but ${company} remains a top preference for me.\n\n`;
    }
    body += `I would love to learn if there are any updates on next steps or if you need any additional materials from my side.\n\nWarm regards,\n${candidateName}\n[LinkedIn Profile] | [Phone Number]`;
    return { subject, body };
  }

  // Default: Executive leverage
  body += `I hope you are having a productive week.\n\n`;
  body += `I am following up on the review timeline for my ${role} application submitted on ${formattedDate} (${days} days ago). My background directly aligns with the distributed infrastructure and high-throughput systems work at ${company}.\n\n`;
  if (includeCompetingOffer) {
    body += `As an update on my search timeline: I have recently received a written offer from Canva (Senior Engineer) with an acceptance window concluding early next week. However, because of ${company}'s mission and engineering challenges, I would strongly prefer to explore conversations with your team before making a final commitment.\n\n`;
    body += `If your engineering team is actively advancing candidates, would you have 15 minutes for a brief alignment sync on Monday?\n\n`;
  } else {
    body += `Could you kindly share if initial screenings are complete, and what the expected timeline is for candidate evaluations?\n\n`;
  }
  body += `Thank you for your time and guidance.\n\nBest regards,\n${candidateName}\n[LinkedIn Profile URL] | [Phone Number]`;

  return { subject, body };
}

export function generateFollowUpQueue(
  applications: ProcessedApplication[],
  tone: OutreachTone = 'leverage',
  candidateName: string = '[Your Full Name]',
  includeCompetingOffer: boolean = true
): FollowUpTask[] {
  return applications
    .filter((app) => app.isNeedsFollowUp)
    .sort((a, b) => b.daysInactive - a.daysInactive)
    .map((app) => {
      const { subject, body } = generateFollowUpMessage(app, tone, candidateName, includeCompetingOffer);
      return {
        applicationId: app.id,
        companyName: app.companyName,
        roleTitle: app.roleTitle,
        recipientEmail: app.rawEmail.senderEmail,
        daysElapsed: app.daysInactive,
        generatedSubject: subject,
        generatedBody: body,
      };
    });
}
