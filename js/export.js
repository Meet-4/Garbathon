// Data Export Engine (JSON & CSV)

export function exportToJson(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `careerguard_export_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCsv(applications) {
  const headers = ['ID', 'Company', 'Role', 'Status', 'Last Date', 'Days Elapsed', 'Sender'];
  const rows = applications.map(app => [
    app.id,
    `"${(app.company || '').replace(/"/g, '""')}"`,
    `"${(app.role || '').replace(/"/g, '""')}"`,
    app.stage,
    app.lastDate,
    app.daysElapsed,
    `"${(app.sender || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `careerguard_applications_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
