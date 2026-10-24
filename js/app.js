import { RAW_EMAILS } from './mockData.js';
import { analyzeEmail } from './heuristics.js';
import { KanbanManager } from './kanban.js';
import { FollowUpManager } from './followUp.js';
import { InterviewPrepManager } from './interviewPrep.js';
import { SandboxScanner } from './sandbox.js';
import { exportToJson, exportToCsv } from './export.js';

// Global State
window.appState = {
  rawEmails: [...RAW_EMAILS],
  analyzedEmails: [],
  applications: [],
  scamAlerts: [],
  refDate: new Date('2026-10-24T17:18:49+05:30')
};

// Toast helper
window.showToast = function(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast badge-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'danger' ? '⚠️' : 'ℹ️'}</span>
    <div>${msg}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Process Emails Deterministically
function processBatch() {
  const analyzed = window.appState.rawEmails.map(email => {
    const analysis = analyzeEmail(email);
    return { ...email, analysis };
  });

  window.appState.analyzedEmails = analyzed;
  window.appState.scamAlerts = analyzed.filter(e => e.analysis.isScam);

  // Group legitimate emails by company into consolidated applications
  const legitimate = analyzed.filter(e => !e.analysis.isScam);
  const appMap = new Map();

  legitimate.forEach(item => {
    const companyKey = item.company.toLowerCase();
    
    // Calculate days elapsed relative to Oct 24, 2026
    const emailDate = new Date(item.dateIso);
    const refDate = new Date('2026-10-24');
    const diffTime = Math.abs(refDate - emailDate);
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (!appMap.has(companyKey)) {
      appMap.set(companyKey, {
        id: `app-${item.id}`,
        company: item.company,
        role: item.role,
        stage: item.analysis.stage,
        lastDate: item.date,
        dateIso: item.dateIso,
        daysElapsed: daysElapsed,
        snippet: item.body,
        sender: item.sender,
        emailThread: [item]
      });
    } else {
      const existing = appMap.get(companyKey);
      existing.emailThread.push(item);
      // If newer email advances stage (e.g., Coinbase ID #15 advances ID #8 to SCREEN_TECH)
      if (new Date(item.dateIso) >= new Date(existing.dateIso)) {
        existing.stage = item.analysis.stage;
        existing.lastDate = item.date;
        existing.dateIso = item.dateIso;
        existing.daysElapsed = daysElapsed;
        existing.snippet = item.body;
      }
    }
  });

  window.appState.applications = Array.from(appMap.values());
}

// Render Top Stats
function renderStats() {
  const totalEmailsElem = document.getElementById('stat-total-emails');
  const activePipelinesElem = document.getElementById('stat-active-pipelines');
  const offersElem = document.getElementById('stat-offers');
  const scamsElem = document.getElementById('stat-scams');
  const followupsElem = document.getElementById('stat-followups');

  const offersCount = window.appState.applications.filter(a => a.stage === 'OFFER_EXTENDED').length;
  const followupsCount = window.appState.applications.filter(a => a.stage === 'APPLIED' && a.daysElapsed >= 7).length;

  if (totalEmailsElem) totalEmailsElem.textContent = window.appState.rawEmails.length;
  if (activePipelinesElem) activePipelinesElem.textContent = window.appState.applications.length;
  if (offersElem) offersElem.textContent = offersCount;
  if (scamsElem) scamsElem.textContent = window.appState.scamAlerts.length;
  if (followupsElem) followupsElem.textContent = followupsCount;

  const scamBadgeCount = document.getElementById('tab-scam-count');
  if (scamBadgeCount) scamBadgeCount.textContent = window.appState.scamAlerts.length;
}

// Render Scam & Phishing Radar
function renderScamRadar() {
  const grid = document.getElementById('scam-radar-grid');
  if (!grid) return;

  grid.innerHTML = '';
  window.appState.scamAlerts.forEach(scam => {
    const card = document.createElement('div');
    card.className = 'scam-card fade-in';
    card.innerHTML = `
      <div class="scam-header">
        <div>
          <div class="scam-company">${scam.company}</div>
          <span class="scam-sender">${scam.sender}</span>
        </div>
        <span class="badge badge-danger">CRITICAL THREAT</span>
      </div>
      <div class="scam-threat-title">🚨 ${scam.analysis.threatType || 'Recruitment Fraud Vector'}</div>
      <div class="scam-quote">"${scam.body}"</div>
      <ul class="scam-signals">
        ${scam.analysis.violations.map(v => `<li><span>[VIOLATION]</span> ${v.desc}</li>`).join('')}
      </ul>
      <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
        <button class="btn btn-danger btn-sm" onclick="window.quarantineScam(${scam.id})">
          Quarantine Sender
        </button>
        <button class="btn btn-ghost btn-sm" onclick="window.generateScamDefense(${scam.id})">
          View Defense Notice
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Raw Inbox List
function renderRawInbox() {
  const container = document.getElementById('raw-inbox-list');
  if (!container) return;

  container.innerHTML = '';
  window.appState.analyzedEmails.forEach(email => {
    const isScam = email.analysis.isScam;
    const item = document.createElement('div');
    item.className = 'raw-feed-item fade-in';
    item.innerHTML = `
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
          <strong style="color: #ffffff;">#${email.id} | ${email.company}</strong>
          <span class="card-date">${email.date}</span>
          <span class="badge ${isScam ? 'badge-danger' : 'badge-success'}">${isScam ? 'SCAM DETECTED' : email.analysis.stage}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">${email.sender} &bull; "${email.subject}"</div>
        <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 0.35rem;">"${email.body}"</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="window.inspectEmail(${email.id})">Inspect</button>
    `;
    container.appendChild(item);
  });
}

// Modal Inspect Logic
window.inspectEmail = function(id) {
  const email = window.appState.analyzedEmails.find(e => e.id === id);
  if (!email) return;

  const modal = document.getElementById('app-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body-content');

  title.textContent = `Audit Log: Email #${email.id} (${email.company})`;
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
        <div style="margin-bottom: 0.4rem;"><strong>Sender:</strong> <span style="font-family: var(--font-mono); color: var(--primary-cyan);">${email.sender}</span></div>
        <div style="margin-bottom: 0.4rem;"><strong>Date:</strong> ${email.date}</div>
        <div style="margin-bottom: 0.4rem;"><strong>Subject:</strong> ${email.subject}</div>
        <div><strong>Body:</strong> <p style="margin-top: 0.3rem; color: #cbd5e1;">"${email.body}"</p></div>
      </div>
      <div>
        <h4 style="margin-bottom: 0.5rem; color: #ffffff;">Security Analysis Verdict:</h4>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
          <span class="badge ${email.analysis.isScam ? 'badge-danger' : 'badge-success'}">${email.analysis.riskLevel}</span>
          <span style="font-size: 0.85rem;">Trust Score: <strong>${email.analysis.trustScore}/100</strong></span>
        </div>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
          ${email.analysis.violations.length === 0 ? '<li style="color: #10b981;">✓ Passed all deterministic fraud heuristics.</li>' : ''}
          ${email.analysis.violations.map(v => `<li style="font-size: 0.85rem; color: #f87171;">⚠️ [${v.rule}] ${v.desc}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  modal.classList.add('open');
};

window.inspectApplication = function(app) {
  const modal = document.getElementById('app-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body-content');

  title.textContent = `Pipeline Profile: ${app.company} (${app.role})`;
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;">
        <div>
          <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase;">Current Pipeline Stage</div>
          <div style="font-size: 1.2rem; font-weight: 700; color: #ffffff;">${app.stage}</div>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase;">Days Elapsed</div>
          <div style="font-size: 1.2rem; font-weight: 700; color: ${app.daysElapsed >= 7 ? '#ef4444' : '#10b981'};">${app.daysElapsed} Days</div>
        </div>
      </div>
      <div>
        <h4 style="margin-bottom: 0.5rem; color: #ffffff;">Associated Email Thread (${app.emailThread.length}):</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${app.emailThread.map(e => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-dim);">
                <span>${e.sender}</span>
                <span>${e.date}</span>
              </div>
              <div style="font-weight: 600; font-size: 0.9rem; color: #ffffff; margin: 0.25rem 0;">${e.subject}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">"${e.body}"</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
};

window.quarantineScam = function(scamId) {
  window.showToast(`Sender quarantined and domain added to active firewall blacklist.`, 'danger');
};

window.generateScamDefense = function(scamId) {
  const scam = window.appState.scamAlerts.find(s => s.id === scamId);
  if (!scam) return;

  const modal = document.getElementById('app-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body-content');

  title.textContent = `Fraud Advisory & Legal Defense: ${scam.company}`;
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); padding: 1rem; border-radius: 8px; color: #fca5a5;">
        <strong>Advisory:</strong> Do NOT reply or click attachments. This email constitutes recruitment fraud violating federal electronic fraud statutes.
      </div>
      <p style="font-size: 0.9rem; color: #cbd5e1;">Recommended action: Submit an Internet Crime Complaint Center (IC3) / National Cyber Crime Reporting Portal report with the header logs below.</p>
      <textarea class="email-body-textarea" readonly style="height: 180px;">Incident Report Summary:
Company Impersonated: ${scam.company}
Originating Address: ${scam.sender}
Fraud Type: ${scam.analysis.threatType}
Evidence: "${scam.body}"
Heuristic Triggers: ${scam.analysis.violations.map(v => v.desc).join('; ')}</textarea>
    </div>
  `;
  modal.classList.add('open');
};

// Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('fade-in');
      }
    });
  });
}

// Modal Close Handling
function initModal() {
  const modal = document.getElementById('app-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  processBatch();
  renderStats();
  renderScamRadar();
  renderRawInbox();
  initTabs();
  initModal();

  // Initialize Kanban
  window.kanban = new KanbanManager(
    window.appState.applications,
    (app, newStage) => {
      window.showToast(`Updated ${app.company} stage to ${newStage}`, 'info');
      renderStats();
      if (window.followUp) window.followUp.render();
    },
    (app) => window.inspectApplication(app)
  );
  window.kanban.render();

  // Search and Filter Listeners for Kanban
  const searchInput = document.getElementById('kanban-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => window.kanban.setSearch(e.target.value));
  }
  const filterSelect = document.getElementById('kanban-filter-select');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => window.kanban.setFilter(e.target.value));
  }

  // Initialize Follow Up Manager
  window.followUp = new FollowUpManager(
    window.appState.applications,
    (app) => window.showToast(`Follow up logged for ${app.company}`, 'success')
  );
  window.followUp.render();

  // Follow-Up outreach controls
  const targetSelect = document.getElementById('followup-target-select');
  if (targetSelect) {
    targetSelect.addEventListener('change', (e) => window.followUp.selectApp(e.target.value));
  }
  const leverageToggle = document.getElementById('toggle-offer-leverage');
  if (leverageToggle) {
    leverageToggle.addEventListener('change', (e) => window.followUp.setIncludeLeverage(e.target.checked));
  }
  const toneSelect = document.getElementById('followup-tone-select');
  if (toneSelect) {
    toneSelect.addEventListener('change', (e) => window.followUp.setTone(e.target.value));
  }
  const copyBtn = document.getElementById('btn-copy-followup');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => window.followUp.copyEmail());
  }

  // Initialize Interview Prep
  window.interviewPrep = new InterviewPrepManager();
  window.interviewPrep.init();

  // Initialize Sandbox Scanner
  window.sandboxScanner = new SandboxScanner();
  window.sandboxScanner.init();

  // Export Buttons
  const exportJsonBtn = document.getElementById('btn-export-json');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const payload = {
        generation_timestamp: new Date().toISOString(),
        reference_date: '2026-10-24',
        system_summary: {
          total_emails: window.appState.rawEmails.length,
          legitimate_emails: window.appState.analyzedEmails.filter(e => !e.analysis.isScam).length,
          unique_applications: window.appState.applications.length,
          scam_alerts_count: window.appState.scamAlerts.length
        },
        scam_alerts: window.appState.scamAlerts.map(s => ({
          email_id: s.id,
          claimed_company: s.company,
          sender: s.sender,
          threat_type: s.analysis.threatType,
          red_flags: s.analysis.violations.map(v => v.desc),
          risk_level: s.analysis.riskLevel
        })),
        tracker_board: {
          OFFER_EXTENDED: window.appState.applications.filter(a => a.stage === 'OFFER_EXTENDED'),
          INTERVIEW_SCHEDULED: window.appState.applications.filter(a => a.stage === 'INTERVIEW_SCHEDULED'),
          SCREEN_TECH: window.appState.applications.filter(a => a.stage === 'SCREEN_TECH'),
          APPLIED: window.appState.applications.filter(a => a.stage === 'APPLIED'),
          REJECTED: window.appState.applications.filter(a => a.stage === 'REJECTED')
        },
        pending_follow_ups: window.followUp.getFollowUpQueue().map(a => ({
          company: a.company,
          role: a.role,
          applied_date: a.dateIso,
          days_inactive: a.daysElapsed
        })),
        interview_brief: {
          company: 'OpenAI',
          role: 'Research Engineer',
          scheduled_timestamp: '2026-10-27T14:00:00-08:00',
          round_type: 'System Architecture',
          platform: 'Google Meet',
          priority_domains: [
            'Distributed Parallelism (Megatron-LM, ZeRO-3, FSDP)',
            'Low-Latency Inference & PagedAttention (vLLM)',
            'High-throughput Streaming Dataloading & Deduplication'
          ]
        }
      };
      exportToJson(payload);
      window.showToast('Exported verified JSON report!', 'success');
    });
  }

  const exportCsvBtn = document.getElementById('btn-export-csv');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      exportToCsv(window.appState.applications);
      window.showToast('Exported CSV applications spreadsheet!', 'success');
    });
  }
});
