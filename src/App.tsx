import React, { useState, useMemo } from 'react';
import { RAW_EMAILS_DATA } from './data/mockEmails';
import { processRawEmails } from './services/pipelineEngine';
import { generateFollowUpQueue } from './services/followUpEngine';
import { getUpcomingInterviewBrief } from './services/interviewEngine';
import {
  downloadJsonFile,
  downloadCsvFile,
  buildVerifiedExportPayload,
  buildApplicationsCsv
} from './services/exportEngine';
import { ProcessedApplication, ApplicationStage, RawEmail, ThreatAnalysis } from './types';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ScamAlertBanner } from './components/ScamAlertBanner';
import { KanbanBoard } from './components/KanbanBoard';
import { ScamRadar } from './components/ScamRadar';
import { FollowUpQueue } from './components/FollowUpQueue';
import { InterviewPrep } from './components/InterviewPrep';
import { SecuritySandbox } from './components/SecuritySandbox';
import { RawInboxFeed } from './components/RawInboxFeed';
import { DetailModal } from './components/DetailModal';
import { LayoutGrid, ShieldAlert, Clock, GraduationCap, PlayCircle, Inbox } from 'lucide-react';

export const App: React.FC = () => {
  // Ingest and process raw emails into applications
  const [applications, setApplications] = useState<ProcessedApplication[]>(() => {
    return processRawEmails(RAW_EMAILS_DATA);
  });

  const [activeTab, setActiveTab] = useState<'kanban' | 'scams' | 'followup' | 'interview' | 'sandbox' | 'inbox'>('kanban');
  const [modalApp, setModalApp] = useState<ProcessedApplication | null>(null);
  const [modalRawEmailItem, setModalRawEmailItem] = useState<{ email: RawEmail; threat: ThreatAnalysis } | null>(null);
  const [defenseNoticeApp, setDefenseNoticeApp] = useState<ProcessedApplication | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Derive counts & security metrics
  const legitimateApps = useMemo(() => applications.filter((a) => !a.threatAssessment.isSuspicious), [applications]);
  const scamApps = useMemo(() => applications.filter((a) => a.threatAssessment.isSuspicious), [applications]);
  const activeOffers = useMemo(() => legitimateApps.filter((a) => a.stage === 'OFFER_EXTENDED').length, [legitimateApps]);
  const staleFollowUps = useMemo(() => legitimateApps.filter((a) => a.isNeedsFollowUp).length, [legitimateApps]);

  const interviewBrief = useMemo(() => getUpcomingInterviewBrief(applications), [applications]);
  const followUpTasks = useMemo(() => generateFollowUpQueue(applications), [applications]);

  const handleStageChange = (appId: string, newStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, stage: newStage, isNeedsFollowUp: newStage === 'APPLIED' && app.daysInactive >= 7 } : app))
    );
    showToast(`Updated application stage to ${newStage}`);
  };

  const handleExportJson = () => {
    const payload = buildVerifiedExportPayload(applications, RAW_EMAILS_DATA, interviewBrief, followUpTasks);
    downloadJsonFile(payload, `careerguard_export_${new Date().toISOString().slice(0, 10)}.json`);
    showToast('Exported verified production JSON dataset!');
  };

  const handleExportCsv = () => {
    const csvContent = buildApplicationsCsv(applications);
    downloadCsvFile(csvContent, `careerguard_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Exported RFC-compliant applications CSV!');
  };

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <Header onExportJson={handleExportJson} onExportCsv={handleExportCsv} />

      {/* Top Stats Overview */}
      <StatsOverview
        totalEmails={RAW_EMAILS_DATA.length}
        activePipelines={legitimateApps.length}
        activeOffers={activeOffers}
        quarantinedScams={scamApps.length}
        staleFollowUps={staleFollowUps}
      />

      {/* Critical Alert Banner */}
      <ScamAlertBanner scamCount={scamApps.length} onInspect={() => setActiveTab('scams')} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto text-sm">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'kanban'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Pipeline Kanban</span>
        </button>

        <button
          onClick={() => setActiveTab('scams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'scams'
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Scam Radar</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-300 text-[11px] font-bold">
            {scamApps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('followup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'followup'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>7-Day Follow-Up Queue</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[11px] font-bold">
            {staleFollowUps}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'interview'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Interview Prep Briefing</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'sandbox'
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>Security Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'inbox'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Raw Inbox Feed</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <main>
        {activeTab === 'kanban' && (
          <KanbanBoard
            applications={applications}
            onStageChange={handleStageChange}
            onSelectApp={(app) => setModalApp(app)}
          />
        )}

        {activeTab === 'scams' && (
          <ScamRadar
            scamApplications={scamApps}
            onQuarantine={(app) => showToast(`Quarantined ${app.rawEmail.senderEmail} & added to firewall blacklist.`)}
            onGenerateDefense={(app) => setDefenseNoticeApp(app)}
          />
        )}

        {activeTab === 'followup' && (
          <FollowUpQueue
            applications={applications}
            onSelectApp={(app) => setModalApp(app)}
          />
        )}

        {activeTab === 'interview' && <InterviewPrep brief={interviewBrief} />}

        {activeTab === 'sandbox' && <SecuritySandbox />}

        {activeTab === 'inbox' && (
          <RawInboxFeed
            rawEmails={RAW_EMAILS_DATA}
            onInspectEmail={(email, threat) => setModalRawEmailItem({ email, threat })}
          />
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal
        app={modalApp}
        rawEmailItem={modalRawEmailItem}
        defenseNoticeApp={defenseNoticeApp}
        onClose={() => {
          setModalApp(null);
          setModalRawEmailItem(null);
          setDefenseNoticeApp(null);
        }}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
