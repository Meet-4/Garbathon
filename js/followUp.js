// 7-Day Inactivity Follow-Up Queue & Outreach Generator

export class FollowUpManager {
  constructor(applications, onFollowUpSent) {
    this.applications = applications;
    this.onFollowUpSent = onFollowUpSent;
    this.selectedApp = null;
    this.includeLeverage = true;
    this.tone = 'leverage'; // 'leverage', 'standard', 'concise'
  }

  setApplications(apps) {
    this.applications = apps;
    this.render();
  }

  getFollowUpQueue() {
    // Legitimate apps in APPLIED status with >= 7 days elapsed
    return this.applications
      .filter(app => app.stage === 'APPLIED' && app.daysElapsed >= 7)
      .sort((a, b) => b.daysElapsed - a.daysElapsed);
  }

  render() {
    const queue = this.getFollowUpQueue();
    const tableBody = document.getElementById('followup-table-body');
    const queueBadge = document.getElementById('followup-queue-badge');
    const targetSelect = document.getElementById('followup-target-select');

    if (queueBadge) queueBadge.textContent = queue.length;
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (targetSelect) targetSelect.innerHTML = '';

    if (queue.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-dim); padding: 2rem;">
            No applications currently exceed the 7-day inactivity threshold!
          </td>
        </tr>
      `;
      this.renderTemplate(null);
      return;
    }

    queue.forEach((app, idx) => {
      const priority = idx === 0 ? 'P1' : idx === 1 ? 'P2' : idx === 2 ? 'P3' : 'P4';
      const badgeColor = idx <= 1 ? 'badge-danger' : 'badge-warning';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="badge ${badgeColor}">${priority}</span></td>
        <td><strong>${escapeHtml(app.company)}</strong></td>
        <td>${escapeHtml(app.role)}</td>
        <td>${app.lastDate} <span style="color: #ef4444; font-weight: 600;">(${app.daysElapsed} days)</span></td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="window.followUp.selectApp('${app.id}')">
            Draft Outreach
          </button>
        </td>
      `;
      tableBody.appendChild(row);

      if (targetSelect) {
        const opt = document.createElement('option');
        opt.value = app.id;
        opt.textContent = `${app.company} (${app.role} - ${app.daysElapsed}d silent)`;
        if (this.selectedApp && this.selectedApp.id === app.id) {
          opt.selected = true;
        }
        targetSelect.appendChild(opt);
      }
    });

    if (!this.selectedApp || !queue.some(a => a.id === this.selectedApp.id)) {
      this.selectedApp = queue[0];
    }

    this.renderTemplate(this.selectedApp);
  }

  selectApp(appId) {
    this.selectedApp = this.applications.find(a => a.id === appId);
    const targetSelect = document.getElementById('followup-target-select');
    if (targetSelect && this.selectedApp) {
      targetSelect.value = this.selectedApp.id;
    }
    this.renderTemplate(this.selectedApp);
  }

  setIncludeLeverage(val) {
    this.includeLeverage = val;
    this.renderTemplate(this.selectedApp);
  }

  setTone(tone) {
    this.tone = tone;
    this.renderTemplate(this.selectedApp);
  }

  generateEmailText(app) {
    if (!app) return 'No application selected.';

    const candidateName = '[Your Full Name]';
    const role = app.role;
    const company = app.company;
    const dateStr = app.lastDate;

    let subject = `Re: Application Status - ${role} - ${candidateName}`;
    let body = `Hi ${company} Recruiting Team,\n\n`;

    if (this.tone === 'concise') {
      body += `I am following up on my application for the ${role} position submitted on ${dateStr}.\n\n`;
      if (this.includeLeverage) {
        body += `I am currently in active interview loops and recently received a competitive offer from Canva, but remains particularly keen on ${company}'s team and technical challenges.\n\n`;
      }
      body += `Could you kindly share an update on the hiring timeline?\n\nThank you,\n${candidateName}\n[LinkedIn URL] | [Phone Number]`;
      return { subject, body };
    }

    if (this.tone === 'standard') {
      body += `I hope your week is going well.\n\n`;
      body += `I wanted to follow up on my candidacy for the ${role} role, for which I submitted my profile on ${dateStr}. Given my experience designing resilient distributed systems, I am eager to explore how I can support ${company}'s upcoming milestones.\n\n`;
      if (this.includeLeverage) {
        body += `To be completely transparent with scheduling, I have advanced to late-stage discussions and received an official offer elsewhere (Canva), but ${company} is a standout priority for me.\n\n`;
      }
      body += `I would love to learn if there are any updates or additional materials you need from my side.\n\nWarm regards,\n${candidateName}\n[LinkedIn URL] | [Phone Number]`;
      return { subject, body };
    }

    // Default: High-leverage executive tone
    body += `I hope you are having a productive week.\n\n`;
    body += `I am writing to check in on the review process for my ${role} application submitted on ${dateStr}. My background aligns directly with the core distributed infrastructure and backend reliability priorities at ${company}.\n\n`;
    if (this.includeLeverage) {
      body += `As an update on my job search timeline: I have recently received a written offer from Canva (Senior Engineer) with a decision window closing next week. However, because of ${company}'s mission and technical domain, I would strongly prefer to explore opportunities with your team before finalizing my commitment.\n\n`;
      body += `If your team is currently advancing candidates for this role, could we connect for a brief 15-minute sync early next week?\n\n`;
    } else {
      body += `Could you share if the team has completed initial screenings, and what the expected timeline is for the next round of decisions?\n\n`;
    }
    body += `Thank you for your time and guidance.\n\nBest regards,\n${candidateName}\n[LinkedIn Profile URL] | [Phone Number]`;

    return { subject, body };
  }

  renderTemplate(app) {
    const subjectInput = document.getElementById('email-subject-preview');
    const bodyTextarea = document.getElementById('email-body-preview');
    if (!subjectInput || !bodyTextarea) return;

    if (!app) {
      subjectInput.value = '';
      bodyTextarea.value = 'Select an application from the queue to generate follow-up message.';
      return;
    }

    const { subject, body } = this.generateEmailText(app);
    subjectInput.value = subject;
    bodyTextarea.value = body;
  }

  copyEmail() {
    const subjectInput = document.getElementById('email-subject-preview');
    const bodyTextarea = document.getElementById('email-body-preview');
    if (!subjectInput || !bodyTextarea) return;

    const fullMessage = `SUBJECT: ${subjectInput.value}\n\n${bodyTextarea.value}`;
    navigator.clipboard.writeText(fullMessage).then(() => {
      if (window.showToast) {
        window.showToast('Follow-up email copied to clipboard!', 'success');
      }
    }).catch(() => {
      if (window.showToast) {
        window.showToast('Failed to copy. Please manually copy from text box.', 'warning');
      }
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
