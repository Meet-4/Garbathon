import React, { useState } from 'react';
import { analyzeEmail } from '../services/heuristics';
import { EmailAnalysis } from '../types';
import { Shield, Play, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

const PRESETS = {
  msft: {
    sender: 'msft-recruitment-hr@gmail.com',
    subject: 'Immediate Job Offer: Senior Cloud Architect',
    body: 'Congratulations! You are selected for Microsoft Azure Cloud Architect. To confirm your placement, wire a $250 mandatory onboarding training module fee to our partner account.',
    company: 'Microsoft'
  },
  aws: {
    sender: 'amazon-hr-support@outlook.com',
    subject: 'Direct Selection: Lead Architect',
    body: 'Your resume was shortlisted for AWS. Before we schedule an interview, reply with scanned copies of your Aadhaar and PAN card for initial verification.',
    company: 'Amazon / AWS'
  },
  google: {
    sender: 'google-recruiting-desk@yahoo.com',
    subject: 'Job Offer - Google Cloud Services',
    body: 'Selected candidate! Offer letter attached. Pay $180 equipment shipping & security deposit to begin home office delivery.',
    company: 'Google'
  },
  clean: {
    sender: 'hiring@openai.com',
    subject: 'Technical Interview Confirmation: Research Engineer',
    body: 'Your system architecture round is scheduled for Tuesday, Oct 27, 2026 at 2:00 PM PST via Google Meet.',
    company: 'OpenAI'
  }
};

export const SecuritySandbox: React.FC = () => {
  const [sender, setSender] = useState(PRESETS.msft.sender);
  const [subject, setSubject] = useState(PRESETS.msft.subject);
  const [body, setBody] = useState(PRESETS.msft.body);
  const [result, setResult] = useState<EmailAnalysis>(() => {
    return analyzeEmail({
      id: 999,
      date: 'Oct 24, 2026',
      dateIso: '2026-10-24',
      sender: PRESETS.msft.sender,
      subject: PRESETS.msft.subject,
      body: PRESETS.msft.body,
      company: PRESETS.msft.company,
      role: 'Test Candidate'
    });
  });

  const handleRunScan = () => {
    const analysis = analyzeEmail({
      id: 999,
      date: 'Oct 24, 2026',
      dateIso: '2026-10-24',
      sender: sender.trim() || 'candidate@unknown.com',
      subject: subject.trim() || 'No Subject',
      body: body.trim(),
      company: 'External Target',
      role: 'Candidate'
    });
    setResult(analysis);
  };

  const loadPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setSender(p.sender);
    setSubject(p.subject);
    setBody(p.body);
    const analysis = analyzeEmail({
      id: 999,
      date: 'Oct 24, 2026',
      dateIso: '2026-10-24',
      sender: p.sender,
      subject: p.subject,
      body: p.body,
      company: p.company,
      role: 'Candidate'
    });
    setResult(analysis);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500';
    if (score >= 50) return 'text-amber-400 border-amber-500';
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
          Paste any incoming recruiter email header or message body to inspect its trust score and detect malicious recruitment vectors in real time.
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
                value={sender}
                onChange={(e) => setSender(e.target.value)}
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trust Gauge</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  result.isScam ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {result.riskLevel}
                </span>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(result.trustScore)}`}>
                  <span className="text-2xl font-black font-display leading-none">{result.trustScore}</span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">/ 100</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {result.isScam ? (
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
                    {result.isScam
                      ? 'Violates core candidate protection rules. Message contains advance-fee solicitations or unauthorized PII harvesting.'
                      : 'Syntax and sender origin correlate with verified talent acquisition infrastructure.'}
                  </p>
                </div>
              </div>

              {/* Violations List */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Detected Violations ({result.violations.length}):
                </div>
                {result.violations.length === 0 ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>No heuristic triggers detected.</span>
                  </div>
                ) : (
                  result.violations.map((v, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[11px]">[{v.rule}]</span>
                        <span className="text-slate-300 text-[11px] leading-snug">{v.desc}</span>
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
