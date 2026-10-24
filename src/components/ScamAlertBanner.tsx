import React from 'react';
import { AlertOctagon, ChevronRight } from 'lucide-react';

interface ScamAlertBannerProps {
  scamCount: number;
  onInspect: () => void;
}

export const ScamAlertBanner: React.FC<ScamAlertBannerProps> = ({ scamCount, onInspect }) => {
  if (scamCount === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-950/60 via-slate-900/80 to-slate-900/80 border border-rose-500/40 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 scam-glow">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
          <AlertOctagon className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-rose-300 flex items-center gap-2">
            Critical Security Alert: {scamCount} Fraudulent Recruitment Attacks Quarantined
          </h3>
          <p className="text-xs text-rose-200/80 mt-1 max-w-3xl leading-relaxed">
            Advance-fee wire solicitations ($250 onboarding fee), equipment deposit extortion ($180), and premature identity document harvesting (Aadhaar &amp; PAN card exfiltration) impersonating Microsoft, Amazon, and Google have been isolated.
          </p>
        </div>
      </div>

      <button
        onClick={onInspect}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 shadow-lg shadow-rose-600/30 transition"
      >
        <span>Inspect Threat Analysis</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
