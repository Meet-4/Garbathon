import React, { useState } from 'react';
import { analyzeThreat } from '../services/securityEngine';
import { ThreatAnalysis, RawEmail } from '../types';
import { Shield, Play, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

const PRESETS = {
  msft: {
    senderEmail: 'msft-recruitment-hr@gmail.com',
    senderName: 'Microsoft HR Placement Desk',
    subject: 'Immediate Job Offer: Senior Cloud Architect',
    body: 'Congratulations! You are selected for Microsoft Azure Cloud Architect. To confirm your placement, wire a $250 mandatory onboarding training module fee to our partner account.',
    receivedDate: '2026-10-14T08:00:00Z',
  },
  aws: {
    senderEmail: 'amazon-hr-support@outlook.com',
    senderName: 'AWS Hiring Support',
    subject: 'Direct Selection: Lead Architect',
    body: 'Your resume was shortlisted for AWS. Before we schedule an interview, reply with scanned copies of your Aadhaar and PAN card for initial verification.',
    receivedDate: '2026-10-16T10:10:00Z',
  },
  google: {
    senderEmail: 'google-recruiting-desk@yahoo.com',
    senderName: 'Google Cloud Services Recruiting',
    subject: 'Job Offer - Google Cloud Services',
    body: 'Selected candidate! Offer letter attached. Pay $180 equipment shipping & security deposit to begin home office delivery.',
    receivedDate: '2026-10-21T07:45:00Z',
  },
  clean: {
    senderEmail: 'hiring@openai.com',
    senderName: 'OpenAI Recruiting',
    subject: 'Technical Interview Confirmation: Research Engineer',
    body: 'Your system architecture round is scheduled for Tuesday, Oct 27, 2026 at 2:00 PM PST via Google Meet.',
    receivedDate: '2026-10-20T14:00:00Z',
  }
};

export const SecuritySandbox: React.FC = () => {
  const [senderEmail, setSenderEmail] = useState(PRESETS.msft.senderEmail);
  const [subject, setSubject] = useState(PRESETS.msft.subject);
  const [body, setBody] = useState(PRESETS.msft.body);
  const [result, setResult] = useState<ThreatAnalysis>(() => {
    return analyzeThreat({
      id: 'test-1',
      senderEmail: PRESETS.msft.senderEmail,
      senderName: PRESETS.msft.senderName,
      subject: PRESETS.msft.subject,
      body: PRESETS.msft.body,
      receivedDate: PRESETS.msft.receivedDate
    });
  });

  const handleRunScan = () => {
    const analysis = analyzeThreat({
      id: 'custom-scan',
      senderEmail: senderEmail.trim() || 'candidate@unknown.com',
      senderName: 'Recruiter',
      subject: subject.trim() || 'No Subject',
      body: body.trim(),
      receivedDate: new Date().toISOString()
    });
    setResult(analysis);
  };

  const loadPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setSenderEmail(p.senderEmail);
    setSubject(p.subject);
    setBody(p.body);
    const analysis = analyzeThreat({
      id: `preset-${key}`,
      senderEmail: p.senderEmail,
      senderName: p.senderName,
      subject: p.subject,
      body: p.body,
      receivedDate: p.receivedDate
    });
    setResult(analysis);
  };

  const getScoreColor = (score: number) => {
    if (score <= 20) return 'text-emerald-400 border-emerald-500';
    if (score <= 50) return 'text-amber-400 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold font-display text-white flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-cyan-400" />
          Live Anti-Fraud Security Sandbox
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Paste any incoming recruiter email header or message body to inspect its threat classification and risk score in real time.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white">Interactive Heuristic Diagnostic Console</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Load Threat Preset:</span>
            <select
              onChange={(e) => loadPreset(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="msft">Microsoft $250 Wire Scam</option>
              <option value="aws">AWS Aadhaar/PAN Harvesting</option>
              <option value="google">Google $180 Equipment Deposit</option>
              <option value="clean">OpenAI Technical Confirmation</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Sender Address:
              </label>
              <input
                type="text"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Subject Line:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Email Body Text:
              </label>
              <textarea
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              onClick={handleRunScan}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Analyze Threat Vector</span>
            </button>
          </div>

          {/* Results Gauge & Violations */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Risk Assessment</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  result.isSuspicious ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {result.isSuspicious ? 'THREAT SUSPECT' : 'VERIFIED SAFE'}
                </span>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(result.riskScore)}`}>
                  <span className="text-2xl font-black font-display leading-none">{result.riskScore}</span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Risk Score</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {result.isSuspicious ? (
                      <>
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="text-rose-400">Critical Threat Quarantined</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-emerald-400">Authenticated Safe Sender</span>
                      </>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {result.isSuspicious
                      ? 'Violates core candidate protection rules. Contains advance-fee solicitations, freemail impersonation, or premature identity extraction.'
                      : 'Sender domain authentication and syntax correlate with standard verified corporate recruiting.'}
                  </p>
                </div>
              </div>

              {/* Violations List */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Detected Reasons ({result.reasons.length}):
                </div>
                {result.reasons.length === 0 ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>No fraud heuristic triggers identified.</span>
                  </div>
                ) : (
                  result.reasons.map((reason, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[11px]">{result.threatTypes[i] || 'VIOLATION'}</span>
                        <span className="text-slate-300 text-[11px] leading-snug">{reason}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
              Evaluated strictly on local client. Zero telemetry dispatched.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
