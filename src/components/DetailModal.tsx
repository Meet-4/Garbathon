import React from 'react';
import { Application, AnalyzedEmail } from '../types';
import { X, ShieldAlert, CheckCircle2, Calendar, Mail, Building2 } from 'lucide-react';

interface DetailModalProps {
  app: Application | null;
  email: AnalyzedEmail | null;
  defenseNoticeEmail: AnalyzedEmail | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ app, email, defenseNoticeEmail, onClose }) => {
  if (!app && !email && !defenseNoticeEmail) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-white">
            {defenseNoticeEmail
              ? `IC3 / Cyber Crime Legal Notice: ${defenseNoticeEmail.company}`
              : app
              ? `Application Audit: ${app.company} (${app.role})`
              : email
              ? `Email Audit: #${email.id} (${email.company})`
              : 'Details'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {defenseNoticeEmail && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <strong>Advisory:</strong> Do NOT reply or remit funds. This email constitutes recruitment fraud violating federal electronic communications statutes.
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Generated IC3 / Cyber Complaint Report:
                </label>
                <textarea
                  readOnly
                  rows={8}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed resize-none focus:outline-none"
                  value={`INCIDENT REPORT SUMMARY:
Impersonated Organization: ${defenseNoticeEmail.company}
Originating Sender: ${defenseNoticeEmail.sender}
Fraud Classification: ${defenseNoticeEmail.analysis.threatType || 'Advance-Fee Fraud'}
Date Received: ${defenseNoticeEmail.date}
Evidence Excerpt: "${defenseNoticeEmail.body}"
Heuristic Triggers: ${defenseNoticeEmail.analysis.violations.map(v => v.desc).join('; ')}`}
                />
              </div>
            </div>
          )}

          {app && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline Stage</div>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">{app.stage}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inactivity Elapsed</div>
                  <div className={`text-sm font-bold mt-0.5 ${app.daysElapsed >= 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {app.daysElapsed} Days
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  Associated Email Thread ({app.emailThread.length}):
                </h4>
                <div className="space-y-3">
                  {app.emailThread.map((e) => (
                    <div key={e.id} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono text-slate-300">{e.sender}</span>
                        <span>{e.date}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">{e.subject}</div>
                      <p className="text-xs text-slate-400 leading-relaxed font-mono italic">
                        "{e.body}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {email && !defenseNoticeEmail && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div><strong className="text-slate-400">Sender:</strong> <span className="font-mono text-cyan-400">{email.sender}</span></div>
                <div><strong className="text-slate-400">Date:</strong> <span className="text-slate-200">{email.date}</span></div>
                <div><strong className="text-slate-400">Subject:</strong> <span className="text-slate-200">{email.subject}</span></div>
                <div className="pt-2 border-t border-slate-800 font-mono text-slate-300 italic">
                  "{email.body}"
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Security Verdict:</div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                    email.analysis.isScam
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {email.analysis.riskLevel}
                  </span>
                  <span className="text-xs text-slate-300">
                    Trust Score: <strong className="text-white">{email.analysis.trustScore}/100</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  {email.analysis.violations.length === 0 ? (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                      ✓ Passed all candidate security and sender domain checks.
                    </div>
                  ) : (
                    email.analysis.violations.map((v, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                        <strong>[{v.rule}]</strong> {v.desc}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
