// Live Email Security Scanner Sandbox

import { analyzeEmail } from './heuristics.js';

export class SandboxScanner {
  constructor() {
    this.presets = {
      msft: {
        sender: 'msft-recruitment-hr@gmail.com',
        subject: 'Immediate Job Offer: Senior Cloud Architect',
        body: 'Congratulations! You are selected for Microsoft Azure Cloud Architect. To confirm your placement, wire a $250 mandatory onboarding training module fee to our partner account.'
      },
      aws: {
        sender: 'amazon-hr-support@outlook.com',
        subject: 'Direct Selection: Lead Architect',
        body: 'Your resume was shortlisted for AWS. Before we schedule an interview, reply with scanned copies of your Aadhaar and PAN card for initial verification.'
      },
      google: {
        sender: 'google-recruiting-desk@yahoo.com',
        subject: 'Job Offer - Google Cloud Services',
        body: 'Selected candidate! Offer letter attached. Pay $180 equipment shipping & security deposit to begin home office delivery.'
      },
      clean: {
        sender: 'hiring@openai.com',
        subject: 'Technical Interview Confirmation: Research Engineer',
        body: 'Your system architecture round is scheduled for Tuesday, Oct 27, 2026 at 2:00 PM PST via Google Meet.'
      }
    };
  }

  init() {
    const senderInput = document.getElementById('sandbox-sender');
    const subjectInput = document.getElementById('sandbox-subject');
    const bodyInput = document.getElementById('sandbox-body');
    const scanBtn = document.getElementById('btn-sandbox-scan');
    const presetSelect = document.getElementById('sandbox-preset-select');

    if (scanBtn) {
      scanBtn.addEventListener('click', () => this.runScan());
    }

    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (this.presets[val]) {
          const p = this.presets[val];
          if (senderInput) senderInput.value = p.sender;
          if (subjectInput) subjectInput.value = p.subject;
          if (bodyInput) bodyInput.value = p.body;
          this.runScan();
        }
      });
    }

    // Auto-run initial test
    this.runScan();
  }

  runScan() {
    const sender = (document.getElementById('sandbox-sender')?.value || '').trim();
    const subject = (document.getElementById('sandbox-subject')?.value || '').trim();
    const body = (document.getElementById('sandbox-body')?.value || '').trim();

    if (!sender && !body) return;

    const mockEmail = {
      id: 9999,
      sender: sender || 'unknown@unknown.com',
      subject: subject || 'No Subject',
      body: body || '',
      company: 'Testing Domain'
    };

    const result = analyzeEmail(mockEmail);
    this.renderResult(result);
  }

  renderResult(res) {
    const scoreVal = document.getElementById('gauge-score-val');
    const gaugeCircle = document.getElementById('gauge-circle-outer');
    const verdictTitle = document.getElementById('sandbox-verdict-title');
    const verdictDesc = document.getElementById('sandbox-verdict-desc');
    const violationsList = document.getElementById('sandbox-violations-list');

    if (scoreVal) scoreVal.textContent = res.trustScore;

    // Conic gradient based on score
    if (gaugeCircle) {
      const deg = Math.round((res.trustScore / 100) * 360);
      let color = '#10b981'; // Green
      if (res.trustScore < 50) color = '#ef4444'; // Red
      else if (res.trustScore < 80) color = '#f59e0b'; // Amber

      gaugeCircle.style.background = `conic-gradient(${color} 0deg, ${color} ${deg}deg, rgba(255, 255, 255, 0.1) ${deg}deg 360deg)`;
    }

    if (verdictTitle) {
      if (res.trustScore >= 80) {
        verdictTitle.innerHTML = `<span style="color: #10b981;">VERIFIED / CLEAN APPLICATION</span>`;
      } else if (res.trustScore >= 50) {
        verdictTitle.innerHTML = `<span style="color: #f59e0b;">SUSPICIOUS / ELEVATED RISK</span>`;
      } else {
        verdictTitle.innerHTML = `<span style="color: #ef4444;">CRITICAL THREAT: ${res.threatType || 'RECRUITMENT FRAUD'}</span>`;
      }
    }

    if (verdictDesc) {
      if (res.trustScore >= 80) {
        verdictDesc.textContent = 'Sender authentication and message context align with industry-standard recruitment protocols.';
      } else if (res.trustScore >= 50) {
        verdictDesc.textContent = 'Anomalies detected. Exercise caution and verify via company career portal before clicking attachments.';
      } else {
        verdictDesc.textContent = 'MALICIOUS ATTACK DETECTED: This message exhibits high-confidence indicators of advance-fee fraud or credential/identity harvesting. Quarantined.';
      }
    }

    if (violationsList) {
      violationsList.innerHTML = '';
      if (res.violations.length === 0) {
        violationsList.innerHTML = `<li style="color: #10b981;">✓ No scam heuristics triggered. Sender domain and syntax appear valid.</li>`;
      } else {
        res.violations.forEach(v => {
          const li = document.createElement('li');
          li.innerHTML = `<span>[${v.severity}]</span> ${v.desc}`;
          violationsList.appendChild(li);
        });
      }
    }
  }
}
