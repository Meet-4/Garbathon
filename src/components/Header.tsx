import React from 'react';
import { Shield, ShieldCheck, Download, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  onExportJson: () => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportJson, onExportCsv }) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 text-cyan-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            CareerGuard &amp; Tracker
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            AI Job Pipeline Analytics &amp; Anti-Fraud Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Shield &bull; Reference Date: Oct 24, 2026</span>
        </div>

        <button
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          Export CSV
        </button>

        <button
          onClick={onExportJson}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500 transition shadow-lg shadow-cyan-600/25"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>
    </header>
  );
};
