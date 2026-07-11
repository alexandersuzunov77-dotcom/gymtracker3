import { getState, update, helpers } from '../store.js';
import { bindClicks, bindInputs, escapeHtml } from '../components/dom.js';

const { isoDate } = helpers;

const METRICS = [
  { key: 'weight', label: 'WEIGHT', unit: 'lb', goodDown: true },
  { key: 'bodyFat', label: 'BODY FAT', unit: '%', goodDown: true },
  { key: 'waist', label: 'WAIST', unit: 'in', goodDown: true },
  { key: 'chest', label: 'CHEST', unit: 'in', goodDown: false },
  { key: 'arms', label: 'ARMS', unit: 'in', goodDown: false },
  { key: 'thighs', label: 'THIGHS', unit: 'in', goodDown: false },
];

let showForm = false;

function fmtShort(dateIso) {
  return new Date(dateIso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function render(container) {
  const s = getState();
  const rows = [...s.measurements].sort((a, b) => a.date.localeCompare(b.date));
  const latest = rows[rows.length - 1];
  const prev = rows[rows.length - 2];

  const trend = rows.slice(-8);
  const maxW = Math.max(1, ...trend.map((r) => r.weight));
  const minW = Math.min(...trend.map((r) => r.weight));

  const historyCols = rows.slice(-4);

  container.innerHTML = `
    <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:18px;">
      <div class="page-title page-title-sm">MEASUREMENTS</div>
      <button class="btn primary" data-action="toggle-form">${showForm ? 'Cancel' : '+ Log measurement'}</button>
    </div>

    ${showForm ? `
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;align-items:end;">
          <div><label class="stat-label" style="display:block;margin-bottom:6px;">DATE</label><input type="date" data-field="m-date" value="${isoDate(new Date())}"></div>
          ${METRICS.map((m) => `<div><label class="stat-label" style="display:block;margin-bottom:6px;">${m.label}</label><input type="number" step="0.1" data-field="m-${m.key}" value="${latest ? latest[m.key] : ''}" style="width:100%;"></div>`).join('')}
        </div>
        <button class="btn primary" data-action="save-measurement" style="margin-top:12px;">Save entry</button>
      </div>
    ` : ''}

    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:16px;">
      ${METRICS.map((m) => {
        const val = latest ? latest[m.key] : null;
        const delta = latest && prev ? latest[m.key] - prev[m.key] : null;
        const isGood = delta == null ? null : (m.goodDown ? delta <= 0 : delta >= 0);
        return `
          <div class="stat-box">
            <div class="stat-label">${m.label}</div>
            <div style="font-family:'Oswald';font-weight:700;font-size:26px;color:var(--text-heading);line-height:1.1;">${val ?? '—'} <span style="font-size:12px;color:var(--text-ghost);font-weight:400;">${m.unit}</span></div>
            <div style="font-size:12px;font-weight:600;margin-top:2px;color:${delta == null ? 'var(--text-ghost)' : (isGood ? 'var(--positive)' : '#e0704a')};">${delta == null ? 'no history' : (delta <= 0 ? '▼ ' : '▲ ') + Math.abs(delta).toFixed(1)}</div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:14px;">
      <div class="stat-box">
        <div class="stat-label" style="margin-bottom:16px;">BODYWEIGHT TREND (LB)</div>
        <div class="bar-chart" style="height:150px;">
          ${trend.length ? trend.map((r) => {
            const range = Math.max(1, maxW - minW);
            const pct = 20 + Math.round(((r.weight - minW) / range) * 80);
            return `
              <div class="bar-col">
                <div class="bar-track" style="height:100%;"><div class="bar-fill" style="height:${pct}%;"></div></div>
                <span class="bar-label">${fmtShort(r.date)}</span>
              </div>
            `;
          }).join('') : `<div class="muted" style="width:100%;text-align:center;">Log an entry to see the trend.</div>`}
        </div>
      </div>
      <div class="grid-table" style="align-self:start;">
        <div class="grid-head" style="grid-template-columns:1.4fr repeat(${Math.max(historyCols.length, 1)}, 1fr);">
          <div>METRIC</div>
          ${historyCols.map((c) => `<div class="center">${fmtShort(c.date)}</div>`).join('')}
        </div>
        ${METRICS.map((m) => `
          <div class="grid-row" style="grid-template-columns:1.4fr repeat(${Math.max(historyCols.length, 1)}, 1fr);">
            <div style="color:var(--text-body2);font-size:13px;font-weight:500;">${m.label} (${m.unit})</div>
            ${historyCols.map((c) => `<div class="center mono" style="color:var(--text-dim);font-size:13px;">${c[m.key] ?? '—'}</div>`).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  bindClicks(container, {
    'toggle-form': () => { showForm = !showForm; render(container); },
    'save-measurement': () => {
      const date = container.querySelector('[data-field="m-date"]').value || isoDate(new Date());
      const entry = { date };
      METRICS.forEach((m) => {
        const v = parseFloat(container.querySelector(`[data-field="m-${m.key}"]`).value);
        entry[m.key] = Number.isFinite(v) ? v : (latest ? latest[m.key] : 0);
      });
      update((draft) => {
        const existing = draft.measurements.find((r) => r.date === date);
        if (existing) Object.assign(existing, entry); else draft.measurements.push(entry);
        const bw = draft.bodyweightLog.find((r) => r.date === date);
        if (bw) bw.weight = entry.weight; else draft.bodyweightLog.push({ date, weight: entry.weight });
      });
      showForm = false;
      render(container);
    },
  });
}
