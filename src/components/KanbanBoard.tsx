import React, { useState, useMemo } from 'react';
import { ProcessedApplication, ApplicationStage } from '../types';
import { Search, Filter, Calendar, ExternalLink } from 'lucide-react';

interface KanbanBoardProps {
  applications: ProcessedApplication[];
  onStageChange: (appId: string, newStage: ApplicationStage) => void;
  onSelectApp: (app: ProcessedApplication) => void;
}

const STAGES: { id: ApplicationStage; title: string; color: string; badgeColor: string }[] = [
  { id: 'APPLIED', title: 'Applied', color: 'text-slate-300 border-slate-700', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
  { id: 'ASSESSMENT_OR_SCREEN', title: 'Screen / Tech', color: 'text-purple-300 border-purple-500/30', badgeColor: 'bg-purple-950/60 text-purple-300 border-purple-500/30' },
  { id: 'INTERVIEW_SCHEDULED', title: 'Interview Set', color: 'text-cyan-300 border-cyan-500/30', badgeColor: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30' },
  { id: 'OFFER_EXTENDED', title: 'Offer Extended', color: 'text-emerald-300 border-emerald-500/30', badgeColor: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' },
  { id: 'REJECTED', title: 'Rejected', color: 'text-rose-300 border-rose-500/30', badgeColor: 'bg-rose-950/60 text-rose-300 border-rose-500/30' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications, onStageChange, onSelectApp }) => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // Filter legitimate applications only (quarantined threats go to Scam Radar)
  const legitimateApps = useMemo(() => {
    return applications.filter((app) => !app.threatAssessment.isSuspicious);
  }, [applications]);

  const filteredApps = useMemo(() => {
    return legitimateApps.filter((app) => {
      const q = search.toLowerCase();
      const matchesSearch = app.companyName.toLowerCase().includes(q) || app.roleTitle.toLowerCase().includes(q);
      const matchesStage = stageFilter === 'ALL' || app.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [legitimateApps, search, stageFilter]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role title..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Stage Filter:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Stages ({legitimateApps.length})</option>
            <option value="APPLIED">Applied</option>
            <option value="ASSESSMENT_OR_SCREEN">Assessment or Screen</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="OFFER_EXTENDED">Offer Extended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
        {STAGES.map((col) => {
          const colApps = filteredApps.filter((a) => a.stage === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800/80 flex flex-col max-h-[780px]"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono font-bold">
                  {colApps.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="p-3 flex flex-col gap-3 overflow-y-auto min-h-[140px]">
                {colApps.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-600 font-medium">
                    No applications
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => onSelectApp(app)}
                      className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer shadow-sm group hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                          {app.companyName}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                          {col.title}
                        </span>
                      </div>

                      <div className="text-xs text-cyan-400/90 font-medium mb-2">
                        {app.roleTitle}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{new Date(app.lastContactDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className={`font-semibold ${app.isNeedsFollowUp ? 'text-rose-400' : 'text-slate-500'}`}>
                          ({app.daysInactive}d ago)
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed italic bg-slate-950/40 p-2 rounded border border-slate-800/50">
                        "{app.rawEmail.body}"
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 gap-2">
                        <select
                          value={app.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onStageChange(app.id, e.target.value as ApplicationStage)}
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="ASSESSMENT_OR_SCREEN">Assessment/Screen</option>
                          <option value="INTERVIEW_SCHEDULED">Interview</option>
                          <option value="OFFER_EXTENDED">Offer</option>
                          <option value="REJECTED">Rejected</option>
                        </select>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectApp(app);
                          }}
                          className="text-[11px] text-slate-400 hover:text-cyan-400 font-medium inline-flex items-center gap-1"
                        >
                          Audit
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
