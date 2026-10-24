import React, { useState, useMemo } from 'react';
import { AnalyzedEmail } from '../types';
import { Search, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RawInboxFeedProps {
  emails: AnalyzedEmail[];
  onInspectEmail: (email: AnalyzedEmail) => void;
}

export const RawInboxFeed: React.FC<RawInboxFeedProps> = ({ emails, onInspectEmail }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return emails.filter((e) =>
      e.company.toLowerCase().includes(q) ||
      e.sender.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q)
    );
  }, [emails, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-cyan-400" />
            Raw Ingestion Feed (20 Messages)
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
        {filtered.map((email) => {
          const isScam = email.analysis.isScam;

          return (
            <div
              key={email.id}
              onClick={() => onInspectEmail(email)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group shadow-sm"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-cyan-400">#{email.id}</span>
                  <span className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                    {email.company}
                  </span>
                  <span className="text-xs text-slate-500">&bull; {email.date}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isScam
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {isScam ? 'Scam Quarantined' : email.analysis.stage}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {email.sender} &bull; <span className="text-slate-300 font-sans font-medium">"{email.subject}"</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1 italic">
                  "{email.body}"
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectEmail(email);
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
