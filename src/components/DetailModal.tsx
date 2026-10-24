import React from 'react';
import { ProcessedApplication, RawEmail, ThreatAnalysis } from '../types';
import { X } from 'lucide-react';

interface DetailModalProps {
  app: ProcessedApplication | null;
  rawEmailItem: { email: RawEmail; threat: ThreatAnalysis } | null;
  defenseNoticeApp: ProcessedApplication | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ app, rawEmailItem, defenseNoticeApp, onClose }) => {
  if (!app && !rawEmailItem && !defenseNoticeApp) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-white">
            {defenseNoticeApp
              ? `IC3 / Cyber Complaint Advisory: ${defenseNoticeApp.companyName}`
              : app
              ? `Application Audit: ${app.companyName} (${app.roleTitle})`
              : rawEmailItem
              ? `Email Audit: #${rawEmailItem.email.id} (${rawEmailItem.email.senderName})`
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
          {defenseNoticeApp && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <strong>Advisory:</strong> Do NOT wire funds, purchase gift cards, or submit PII documents. This solicitation matches criminal advance-fee and identity theft patterns.
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Generated Legal / IC3 Report Text:
                </label>
                <textarea
                  readOnly
                  rows={8}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed resize-none focus:outline-none"
                  value={`INCIDENT REPORT SUMMARY:
Impersonated Organization: ${defenseNoticeApp.companyName}
Originating Sender: ${defenseNoticeApp.rawEmail.senderEmail} (${defenseNoticeApp.rawEmail.senderName})
Threat Categories: ${defenseNoticeApp.threatAssessment.threatTypes.join(', ')}
Calculated Risk Score: ${defenseNoticeApp.threatAssessment.riskScore}/100
Received Date: ${defenseNoticeApp.lastContactDate}
Evidence Excerpt: "${defenseNoticeApp.rawEmail.body}"
Heuristic Triggers:
${defenseNoticeApp.threatAssessment.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}`}
                />
              </div>
            </div>
          )}

          {app && !defenseNoticeApp && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline Stage</div>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">{app.stage}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Days Inactive</div>
                  <div className={`text-sm font-bold mt-0.5 ${app.daysInactive >= 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {app.daysInactive} Days
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  Associated Email Thread ({app.emailHistory?.length || 1}):
                </h4>
                <div className="space-y-3">
                  {(app.emailHistory || [app.rawEmail]).map((e) => (
                    <div key={e.id} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono text-slate-300">{e.senderEmail}</span>
                        <span>{new Date(e.receivedDate).toLocaleDateString()}</span>
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

          {rawEmailItem && !defenseNoticeApp && !app && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div><strong className="text-slate-400">Sender:</strong> <span className="font-mono text-cyan-400">{rawEmailItem.email.senderEmail}</span> ({rawEmailItem.email.senderName})</div>
                <div><strong className="text-slate-400">Received Date:</strong> <span className="text-slate-200">{rawEmailItem.email.receivedDate}</span></div>
                <div><strong className="text-slate-400">Subject:</strong> <span className="text-slate-200">{rawEmailItem.email.subject}</span></div>
                <div className="pt-2 border-t border-slate-800 font-mono text-slate-300 italic">
                  "{rawEmailItem.email.body}"
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Security Threat Evaluation:</div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                    rawEmailItem.threat.isSuspicious
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {rawEmailItem.threat.isSuspicious ? 'Suspicious / Quarantined' : 'Verified Sender'}
                  </span>
                  <span className="text-xs text-slate-300">
                    Risk Score: <strong className="text-white">{rawEmailItem.threat.riskScore}/100</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  {rawEmailItem.threat.reasons.length === 0 ? (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                      ✓ No fraud heuristic triggers detected.
                    </div>
                  ) : (
                    rawEmailItem.threat.reasons.map((reason, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                        <strong>[{rawEmailItem.threat.threatTypes[i] || 'VIOLATION'}]</strong> {reason}
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
