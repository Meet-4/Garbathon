import React, { useState, useMemo } from 'react';
import { RawEmail, ThreatAnalysis } from '../types';
import { analyzeThreat } from '../services/securityEngine';
import { Search, Mail } from 'lucide-react';

interface RawInboxFeedProps {
  rawEmails: RawEmail[];
  onInspectEmail: (email: RawEmail, threat: ThreatAnalysis) => void;
}

export const RawInboxFeed: React.FC<RawInboxFeedProps> = ({ rawEmails, onInspectEmail }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const enrichedEmails = useMemo(() => {
    return rawEmails.map((email) => {
      const threat = analyzeThreat(email);
      return { email, threat };
    });
  }, [rawEmails]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return enrichedEmails.filter(({ email }) =>
      email.senderName.toLowerCase().includes(q) ||
      email.senderEmail.toLowerCase().includes(q) ||
      email.subject.toLowerCase().includes(q) ||
      email.body.toLowerCase().includes(q)
    );
  }, [enrichedEmails, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-cyan-400" />
            Raw Ingestion Feed ({rawEmails.length} Messages)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of all parsed communications received between Oct 10 and Oct 24, 2026.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search raw emails..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(({ email, threat }) => {
          const isScam = threat.isSuspicious;

          return (
            <div
              key={email.id}
              onClick={() => onInspectEmail(email, threat)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group shadow-sm"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-cyan-400">#{email.id}</span>
                  <span className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                    {email.senderName}
                  </span>
                  <span className="text-xs text-slate-500">
                    &bull; {new Date(email.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isScam
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {isScam ? 'Scam Quarantined' : 'Verified Sender'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {email.senderEmail} &bull; <span className="text-slate-300 font-sans font-medium">"{email.subject}"</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1 italic font-mono">
                  "{email.body}"
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectEmail(email, threat);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 text-slate-300 text-xs font-semibold shrink-0 transition"
              >
                Inspect
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
