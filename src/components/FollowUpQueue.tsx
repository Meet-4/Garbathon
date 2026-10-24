import React, { useState, useMemo } from 'react';
import { Application } from '../types';
import { Clock, Send, Copy, Check, Sparkles, Building2 } from 'lucide-react';

interface FollowUpQueueProps {
  applications: Application[];
  onSelectApp: (app: Application) => void;
}

export const FollowUpQueue: React.FC<FollowUpQueueProps> = ({ applications }) => {
  const staleApps = useMemo(() => {
    return applications
      .filter((a) => a.stage === 'APPLIED' && a.daysElapsed >= 7)
      .sort((a, b) => b.daysElapsed - a.daysElapsed);
  }, [applications]);

  const [selectedAppId, setSelectedAppId] = useState<string>(staleApps[0]?.id || '');
  const [tone, setTone] = useState<'leverage' | 'standard' | 'concise'>('leverage');
  const [includeLeverage, setIncludeLeverage] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedApp = useMemo(() => {
    return staleApps.find((a) => a.id === selectedAppId) || staleApps[0];
  }, [staleApps, selectedAppId]);

  const emailContent = useMemo(() => {
    if (!selectedApp) return { subject: '', body: '' };

    const candidateName = '[Your Full Name]';
    const company = selectedApp.company;
    const role = selectedApp.role;
    const dateStr = selectedApp.lastDate;

    const subject = `Re: Application Status - ${role} - ${candidateName}`;
    let body = `Hi ${company} Recruiting Team,\n\n`;

    if (tone === 'concise') {
      body += `I am following up on my application for the ${role} position submitted on ${dateStr}.\n\n`;
      if (includeLeverage) {
        body += `I am currently in active interview loops and recently received a competitive written offer from Canva, but remain particularly keen on ${company}'s team and technical challenges.\n\n`;
      }
      body += `Could you kindly share an update on the hiring timeline?\n\nThank you,\n${candidateName}\n[LinkedIn URL] | [Phone Number]`;
      return { subject, body };
    }

    if (tone === 'standard') {
      body += `I hope your week is going well.\n\n`;
      body += `I wanted to follow up on my candidacy for the ${role} role, for which I submitted my profile on ${dateStr}. Given my experience designing resilient distributed systems, I am eager to explore how I can support ${company}'s upcoming milestones.\n\n`;
      if (includeLeverage) {
        body += `To be completely transparent with scheduling, I have advanced to late-stage discussions and received an official offer from Canva (Senior Engineer), but ${company} is a standout priority for me.\n\n`;
      }
      body += `I would love to learn if there are any updates or additional materials you need from my side.\n\nWarm regards,\n${candidateName}\n[LinkedIn URL] | [Phone Number]`;
      return { subject, body };
    }

    // Default: Executive leverage
    body += `I hope you are having a productive week.\n\n`;
    body += `I am writing to check in on the review process for my ${role} application submitted on ${dateStr}. My background aligns directly with the core distributed infrastructure and backend reliability priorities at ${company}.\n\n`;
    if (includeLeverage) {
      body += `As an update on my job search timeline: I have recently received a written offer from Canva (Senior Engineer) with an acceptance window closing next week. However, because of ${company}'s engineering culture and technical domain, I would strongly prefer to explore opportunities with your team before finalizing my commitment.\n\n`;
      body += `If your team is currently advancing candidates for this role, could we connect for a brief 15-minute sync early next week?\n\n`;
    } else {
      body += `Could you share if the team has completed initial screenings, and what the expected timeline is for the next round of decisions?\n\n`;
    }
    body += `Thank you for your time and guidance.\n\nBest regards,\n${candidateName}\n[LinkedIn Profile URL] | [Phone Number]`;

    return { subject, body };
  }, [selectedApp, tone, includeLeverage]);

  const handleCopy = () => {
    const full = `Subject: ${emailContent.subject}\n\n${emailContent.body}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold font-display text-white flex items-center gap-2.5">
          <Clock className="w-6 h-6 text-amber-500" />
          7-Day Inactivity Follow-Up Radar
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Automated prioritization of silent applications (&ge; 7 days since initial receipt) with high-leverage outreach drafting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Inactive Pipelines */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
            <span>Stale Pipelines Queue ({staleApps.length})</span>
            <span className="text-[10px] text-amber-400 font-normal">Sorted by Days Silent</span>
          </h3>

          <div className="space-y-2.5">
            {staleApps.map((app, idx) => {
              const priority = idx === 0 ? 'P1' : idx === 1 ? 'P2' : idx === 2 ? 'P3' : 'P4';
              const isSelected = (selectedApp && selectedApp.id === app.id);

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-3.5 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      idx <= 1 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {priority}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {app.company}
                      </div>
                      <div className="text-xs text-slate-400">{app.role}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-rose-400">
                      {app.daysElapsed} days
                    </div>
                    <div className="text-[10px] text-slate-500">{app.lastDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Outreach Generator */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Smart Outreach Draft Generator
            </h3>
            <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              High Leverage Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Target Pipeline:
              </label>
              <select
                value={selectedApp?.id || ''}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {staleApps.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.company} — {a.role} ({a.daysElapsed}d)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Outreach Tone:
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="leverage">Executive Leverage (Offer Accelerator)</option>
                <option value="standard">Standard Professional</option>
                <option value="concise">Concise &amp; Direct</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
            <input
              type="checkbox"
              id="leverage-chk"
              checked={includeLeverage}
              onChange={(e) => setIncludeLeverage(e.target.checked)}
              className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="leverage-chk" className="text-slate-300 cursor-pointer">
              Mention competing offer timeline (Canva Senior Engineer written offer)
            </label>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Subject Line:
            </label>
            <input
              type="text"
              readOnly
              value={emailContent.subject}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Message Body:
            </label>
            <textarea
              readOnly
              rows={9}
              value={emailContent.body}
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Personalize candidate name &amp; phone before transmitting.
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
