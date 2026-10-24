import React from 'react';
import { Mail, Briefcase, Award, ShieldAlert, Clock } from 'lucide-react';

interface StatsOverviewProps {
  totalEmails: number;
  activePipelines: number;
  activeOffers: number;
  quarantinedScams: number;
  staleFollowUps: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalEmails,
  activePipelines,
  activeOffers,
  quarantinedScams,
  staleFollowUps,
}) => {
  const stats = [
    {
      label: 'Ingested Emails',
      value: totalEmails,
      icon: Mail,
      accent: 'border-l-cyan-500 text-cyan-400 bg-cyan-500/10',
    },
    {
      label: 'Valid Pipelines',
      value: activePipelines,
      icon: Briefcase,
      accent: 'border-l-blue-500 text-blue-400 bg-blue-500/10',
    },
    {
      label: 'Active Offers',
      value: activeOffers,
      icon: Award,
      accent: 'border-l-emerald-500 text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'Quarantined Scams',
      value: quarantinedScams,
      icon: ShieldAlert,
      accent: 'border-l-rose-500 text-rose-400 bg-rose-500/10',
    },
    {
      label: '≥7d Inactive Follow-ups',
      value: staleFollowUps,
      icon: Clock,
      accent: 'border-l-amber-500 text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 border-l-4 ${stat.accent.split(' ')[0]} flex items-center gap-3.5 shadow-md`}
          >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${stat.accent}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
