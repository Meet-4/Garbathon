// Interactive Application Kanban Board

export class KanbanManager {
  constructor(applications, onStageChange, onCardClick) {
    this.applications = applications;
    this.onStageChange = onStageChange;
    this.onCardClick = onCardClick;
    this.searchTerm = '';
    this.stageFilter = 'ALL';
  }

  setApplications(apps) {
    this.applications = apps;
    this.render();
  }

  setSearch(term) {
    this.searchTerm = term.toLowerCase().trim();
    this.render();
  }

  setFilter(filter) {
    this.stageFilter = filter;
    this.render();
  }

  updateAppStage(appId, newStage) {
    const app = this.applications.find(a => a.id === appId);
    if (app) {
      app.stage = newStage;
      if (this.onStageChange) this.onStageChange(app, newStage);
      this.render();
    }
  }

  render() {
    const columns = {
      APPLIED: document.getElementById('col-applied-list'),
      SCREEN_TECH: document.getElementById('col-screen-list'),
      INTERVIEW_SCHEDULED: document.getElementById('col-interview-list'),
      OFFER_EXTENDED: document.getElementById('col-offer-list'),
      REJECTED: document.getElementById('col-rejected-list')
    };

    const counts = {
      APPLIED: document.getElementById('count-applied'),
      SCREEN_TECH: document.getElementById('count-screen'),
      INTERVIEW_SCHEDULED: document.getElementById('count-interview'),
      OFFER_EXTENDED: document.getElementById('count-offer'),
      REJECTED: document.getElementById('count-rejected')
    };

    // Clear lists
    Object.values(columns).forEach(col => {
      if (col) col.innerHTML = '';
    });

    const stageCounts = {
      APPLIED: 0,
      SCREEN_TECH: 0,
      INTERVIEW_SCHEDULED: 0,
      OFFER_EXTENDED: 0,
      REJECTED: 0
    };

    const filtered = this.applications.filter(app => {
      const matchesSearch = 
        app.company.toLowerCase().includes(this.searchTerm) ||
        app.role.toLowerCase().includes(this.searchTerm);
      const matchesStage = this.stageFilter === 'ALL' || app.stage === this.stageFilter;
      return matchesSearch && matchesStage;
    });

    filtered.forEach(app => {
      if (stageCounts[app.stage] !== undefined) {
        stageCounts[app.stage]++;
      }

      const targetCol = columns[app.stage];
      if (!targetCol) return;

      const card = document.createElement('div');
      card.className = 'app-card fade-in';
      card.id = `card-${app.id}`;
      card.innerHTML = `
        <div class="card-top">
          <div class="card-company">${escapeHtml(app.company)}</div>
          <span class="badge ${getStageBadgeClass(app.stage)}">${formatStageName(app.stage)}</span>
        </div>
        <div class="card-role">${escapeHtml(app.role)}</div>
        <div class="card-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          ${app.lastDate} (${app.daysElapsed}d ago)
        </div>
        <div class="card-snippet">"${escapeHtml(app.snippet)}"</div>
        <div class="card-actions">
          <select class="input-control btn-sm" style="width: auto; padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="event.stopPropagation();" onchange="window.kanban.updateAppStage('${app.id}', this.value)">
            <option value="APPLIED" ${app.stage === 'APPLIED' ? 'selected' : ''}>Applied</option>
            <option value="SCREEN_TECH" ${app.stage === 'SCREEN_TECH' ? 'selected' : ''}>Screen/Tech</option>
            <option value="INTERVIEW_SCHEDULED" ${app.stage === 'INTERVIEW_SCHEDULED' ? 'selected' : ''}>Interview</option>
            <option value="OFFER_EXTENDED" ${app.stage === 'OFFER_EXTENDED' ? 'selected' : ''}>Offer</option>
            <option value="REJECTED" ${app.stage === 'REJECTED' ? 'selected' : ''}>Rejected</option>
          </select>
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); window.kanban.openModal('${app.id}')" title="View Details">
            Inspect
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        this.openModal(app.id);
      });

      targetCol.appendChild(card);
    });

    // Update column badge counters
    Object.keys(counts).forEach(k => {
      if (counts[k]) counts[k].textContent = stageCounts[k] || 0;
    });
  }

  openModal(appId) {
    const app = this.applications.find(a => a.id === appId);
    if (!app) return;
    if (this.onCardClick) this.onCardClick(app);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getStageBadgeClass(stage) {
  switch (stage) {
    case 'OFFER_EXTENDED': return 'badge-success';
    case 'INTERVIEW_SCHEDULED': return 'badge-info';
    case 'SCREEN_TECH': return 'badge-purple';
    case 'REJECTED': return 'badge-danger';
    case 'APPLIED':
    default: return 'badge-applied';
  }
}

function formatStageName(stage) {
  switch (stage) {
    case 'OFFER_EXTENDED': return 'Offer Extended';
    case 'INTERVIEW_SCHEDULED': return 'Interview Set';
    case 'SCREEN_TECH': return 'Screen / Tech';
    case 'REJECTED': return 'Rejected';
    case 'APPLIED': return 'Applied';
    default: return stage;
  }
}
