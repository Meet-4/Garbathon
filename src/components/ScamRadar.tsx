import React from 'react';
import { AnalyzedEmail } from '../types';
import { ShieldAlert, AlertTriangle, ShieldCheck, FileWarning, Lock } from 'lucide-react';

interface ScamRadarProps {
  scamEmails: AnalyzedEmail[];
  onQuarantine: (email: AnalyzedEmail) => void;
  onGenerateDefense: (email: AnalyzedEmail) => void;
}

export const ScamRadar: React.FC<ScamRadarProps> = ({ scamEmails, onQuarantine, onGenerateDefense }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold font-display text-white flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-rose-500" />
          Scam &amp; Phishing Red-Flag Alert Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Automated heuristic isolation of spoofed enterprise domains, advance-fee extortion, and premature identity document theft.
        </p>
      </div>

      {/* Threats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scamEmails.map((email) => (
          <div
            key={email.id}
            className="p-5 rounded-xl bg-slate-900/90 border border-rose-500/40 shadow-lg shadow-rose-950/20 flex flex-col justify-between hover:border-rose-500/70 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-base text-white">{email.company}</h3>
                  <span className="font-mono text-xs text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block mt-1">
                    {email.sender}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  CRITICAL THREAT
                </span>
              </div>

              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{email.analysis.threatType || 'Fraudulent Recruitment Vector'}</span>
              </div>

              <blockquote className="text-xs text-slate-300 italic bg-slate-950/70 p-3 rounded-lg border-l-2 border-rose-500 mb-4 leading-relaxed font-mono">
                "{email.body}"
              </blockquote>

              <div className="space-y-1.5 mb-5">
                <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Deterministic Violations:
                </div>
                {email.analysis.violations.map((v, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{v.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onQuarantine(email)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
              >
                Quarantine Sender
              </button>
              <button
                onClick={() => onGenerateDefense(email)}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                IC3 Legal Notice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Best Practices Cards */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Heuristic Fraud Defense Principles (Candidate Shielding)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              1. Free-mail Enterprise Check
            </div>
            <p className="text-slate-400 leading-relaxed">
              Legitimate enterprise talent acquisition (Microsoft, Amazon, Google) strictly operates under authenticated corporate domains (e.g., @microsoft.com), never consumer webmail (@gmail.com, @outlook.com).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
              <FileWarning className="w-3.5 h-3.5" />
              2. Advance-Fee Absolute Ban
            </div>
            <p className="text-slate-400 leading-relaxed">
              Real employers never require candidates to wire "training fees", "onboarding deposits", or "hardware shipping costs". Any request for upfront wire transfers is criminal advance-fee fraud.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              3. Premature Identity Defense
            </div>
            <p className="text-slate-400 leading-relaxed">
              Demands for scans of government identifiers (Aadhaar, PAN, SSN) before interviews occur over email are designed for identity theft and loan fraud. Real verifications only happen post-offer via secured HRIS portals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
