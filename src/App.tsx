import React, { useState, useMemo } from 'react';
import { MOCK_RAW_EMAILS } from './data/mockEmails';
import { analyzeEmail } from './services/heuristics';
import { AnalyzedEmail, Application, CanonicalStage } from './types';
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
  // Analyze all 20 mock raw emails deterministically
  const analyzedEmails: AnalyzedEmail[] = useMemo(() => {
    return MOCK_RAW_EMAILS.map((email) => {
      const analysis = analyzeEmail(email);
      return { ...email, analysis };
    });
  }, []);

  // Consolidate into unique application pipelines
  const initialApplications: Application[] = useMemo(() => {
    const legitimate = analyzedEmails.filter((e) => !e.analysis.isScam);
    const map = new Map<string, Application>();

    legitimate.forEach((item) => {
      const companyKey = item.company.toLowerCase();
      const emailDate = new Date(item.dateIso);
      const refDate = new Date('2026-10-24');
      const diffTime = Math.abs(refDate.getTime() - emailDate.getTime());
      const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (!map.has(companyKey)) {
        map.set(companyKey, {
          id: `app-${item.id}`,
          company: item.company,
          role: item.role,
          stage: item.analysis.stage,
          lastDate: item.date,
          dateIso: item.dateIso,
          daysElapsed,
          snippet: item.body,
          sender: item.sender,
          emailThread: [item],
        });
      } else {
        const existing = map.get(companyKey)!;
        existing.emailThread.push(item);
        if (new Date(item.dateIso) >= new Date(existing.dateIso)) {
          existing.stage = item.analysis.stage;
          existing.lastDate = item.date;
          existing.dateIso = item.dateIso;
          existing.daysElapsed = daysElapsed;
          existing.snippet = item.body;
        }
      }
    });

    return Array.from(map.values());
  }, [analyzedEmails]);

  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [activeTab, setActiveTab] = useState<'kanban' | 'scams' | 'followup' | 'interview' | 'sandbox' | 'inbox'>('kanban');
  const [modalApp, setModalApp] = useState<Application | null>(null);
  const [modalEmail, setModalEmail] = useState<AnalyzedEmail | null>(null);
  const [defenseNoticeEmail, setDefenseNoticeEmail] = useState<AnalyzedEmail | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scamEmails = useMemo(() => {
    return analyzedEmails.filter((e) => e.analysis.isScam);
  }, [analyzedEmails]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStageChange = (appId: string, newStage: CanonicalStage) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
    );
    showToast(`Updated pipeline stage to ${newStage}`);
  };

  const handleExportJson = () => {
    const payload = {
      generation_timestamp: new Date().toISOString(),
      reference_date: '2026-10-24',
      system_summary: {
        total_emails: analyzedEmails.length,
        legitimate_emails: analyzedEmails.filter((e) => !e.analysis.isScam).length,
        unique_applications: applications.length,
        scam_alerts_count: scamEmails.length,
      },
      scam_alerts: scamEmails.map((s) => ({
        email_id: s.id,
        claimed_company: s.company,
        sender: s.sender,
        threat_type: s.analysis.threatType,
        red_flags: s.analysis.violations.map((v) => v.desc),
        risk_level: s.analysis.riskLevel,
      })),
      tracker_board: {
        OFFER_EXTENDED: applications.filter((a) => a.stage === 'OFFER_EXTENDED'),
        INTERVIEW_SCHEDULED: applications.filter((a) => a.stage === 'INTERVIEW_SCHEDULED'),
        SCREEN_TECH: applications.filter((a) => a.stage === 'SCREEN_TECH'),
        APPLIED: applications.filter((a) => a.stage === 'APPLIED'),
        REJECTED: applications.filter((a) => a.stage === 'REJECTED'),
      },
      pending_follow_ups: applications
        .filter((a) => a.stage === 'APPLIED' && a.daysElapsed >= 7)
        .map((a) => ({
          company: a.company,
          role: a.role,
          applied_date: a.dateIso,
          days_inactive: a.daysElapsed,
        })),
      interview_brief: {
        company: 'OpenAI',
        role: 'Research Engineer',
        scheduled_timestamp: '2026-10-27T14:00:00-08:00',
        round_type: 'System Architecture',
        platform: 'Google Meet',
        priority_domains: [
          'Distributed Parallelism (Megatron-LM, ZeRO-3, FSDP)',
          'Low-Latency Inference & PagedAttention (vLLM)',
          'High-throughput Streaming Dataloading & Deduplication',
        ],
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerguard_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported verified JSON dataset!');
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Company', 'Role', 'Status', 'Last Date', 'Days Elapsed', 'Sender'];
    const rows = applications.map((a) => [
      a.id,
      `"${a.company.replace(/"/g, '""')}"`,
      `"${a.role.replace(/"/g, '""')}"`,
      a.stage,
      a.lastDate,
      a.daysElapsed,
      `"${a.sender.replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerguard_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported applications spreadsheet CSV!');
  };

  const activeOffers = useMemo(() => applications.filter((a) => a.stage === 'OFFER_EXTENDED').length, [applications]);
  const staleFollowUps = useMemo(() => applications.filter((a) => a.stage === 'APPLIED' && a.daysElapsed >= 7).length, [applications]);

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <Header onExportJson={handleExportJson} onExportCsv={handleExportCsv} />

      {/* Top Stats Overview */}
      <StatsOverview
        totalEmails={analyzedEmails.length}
        activePipelines={applications.length}
        activeOffers={activeOffers}
        quarantinedScams={scamEmails.length}
        staleFollowUps={staleFollowUps}
      />

      {/* Critical Alert Banner */}
      <ScamAlertBanner scamCount={scamEmails.length} onInspect={() => setActiveTab('scams')} />

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
            {scamEmails.length}
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
            scamEmails={scamEmails}
            onQuarantine={(email) => showToast(`Quarantined ${email.sender} & added to firewall blacklist.`)}
            onGenerateDefense={(email) => setDefenseNoticeEmail(email)}
          />
        )}

        {activeTab === 'followup' && (
          <FollowUpQueue
            applications={applications}
            onSelectApp={(app) => setModalApp(app)}
          />
        )}

        {activeTab === 'interview' && <InterviewPrep />}

        {activeTab === 'sandbox' && <SecuritySandbox />}

        {activeTab === 'inbox' && (
          <RawInboxFeed
            emails={analyzedEmails}
            onInspectEmail={(email) => setModalEmail(email)}
          />
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal
        app={modalApp}
        email={modalEmail}
        defenseNoticeEmail={defenseNoticeEmail}
        onClose={() => {
          setModalApp(null);
          setModalEmail(null);
          setDefenseNoticeEmail(null);
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
