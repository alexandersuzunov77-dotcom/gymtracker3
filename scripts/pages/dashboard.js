import { getState, helpers } from '../store.js';
import { bindClicks, escapeHtml } from '../components/dom.js';
import { bestEst1RM, earliestEst1RM, weeklyVolumeBuckets, adherenceInWindow } from '../utils.js';

const { isoDate } = helpers;

const WINDOWS = [{ key: '8', label: '8 WEEKS', weeks: 8 }, { key: '12', label: '12 WEEKS', weeks: 12 }, { key: 'all', label: 'ALL', weeks: null }];
const TOP_LIFT_NAMES = ['Deadlift', 'Back Squat', 'Barbell Bench Press', 'Overhead Press'];

let windowKey = '8';

export function render(container) {
  const s = getState();
  const win = WINDOWS.find((w) => w.key === windowKey);
  const buckets = weeklyVolumeBuckets(win.weeks);
  const totalVolume = buckets.reduce((a, b) => a + b.volume, 0);
  const maxVol = Math.max(1, ...buckets.map((b) => b.volume));
  const { done: sessionsDone, pct: adherencePct } = adherenceInWindow(win.weeks);

  const benchNow = bestEst1RM('Barbell Bench Press');
  const benchEarliest = earliestEst1RM('Barbell Bench Press');
  const benchDelta = benchEarliest != null ? benchNow - benchEarliest : null;

  const bwLog = [...s.bodyweightLog].sort((a, b) => a.date.localeCompare(b.date));
  const bwNow = bwLog.length ? bwLog[bwLog.length - 1].weight : null;
  const bwFirst = bwLog.length ? bwLog[0].weight : null;
  const bwDelta = bwNow != null && bwFirst != null ? bwNow - bwFirst : null;

  const lifts = TOP_LIFT_NAMES.map((name) => ({ name: shortName(name), val: bestEst1RM(name) }));
  const maxLift = Math.max(1, ...lifts.map((l) => l.val));

  container.innerHTML = `
    <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:20px;">
      <div class="page-title page-title-sm">PROGRESS DASHBOARD</div>
      <div class="flex gap-6">
        ${WINDOWS.map((w) => `<button class="pill ${w.key === windowKey ? '' : 'outline'}" data-action="set-window" data-key="${w.key}" style="cursor:pointer;border:none;">${w.label}</button>`).join('')}
      </div>
    </div>

    <div class="stat-strip">
      <div class="stat-box">
        <div class="stat-label">TOTAL VOLUME</div>
        <div style="font-family:'Oswald';font-weight:700;font-size:32px;color:var(--text-heading);">${formatK(totalVolume)}</div>
        <div style="color:var(--positive);font-size:12px;font-weight:600;">${buckets.length} wk${buckets.length === 1 ? '' : 's'} tracked</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">SESSIONS</div>
        <div style="font-family:'Oswald';font-weight:700;font-size:32px;color:var(--text-heading);">${sessionsDone}</div>
        <div style="color:var(--positive);font-size:12px;font-weight:600;">${adherencePct}% adherence</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">EST. 1RM · BENCH</div>
        <div style="font-family:'Oswald';font-weight:700;font-size:32px;color:var(--accent);">${benchNow || '—'}</div>
        <div style="color:${benchDelta == null ? 'var(--text-ghost)' : (benchDelta >= 0 ? 'var(--positive)' : '#e0704a')};font-size:12px;font-weight:600;">${benchDelta == null ? 'no data yet' : (benchDelta >= 0 ? '▲ ' : '▼ ') + Math.abs(benchDelta) + ' lbs'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">BODYWEIGHT</div>
        <div style="font-family:'Oswald';font-weight:700;font-size:32px;color:var(--text-heading);">${bwNow ?? '—'}</div>
        <div style="color:${bwDelta == null ? 'var(--text-ghost)' : (bwDelta <= 0 ? 'var(--positive)' : '#e0704a')};font-size:12px;font-weight:600;">${bwDelta == null ? 'no data yet' : (bwDelta <= 0 ? '▼ ' : '▲ ') + Math.abs(bwDelta).toFixed(1) + ' lbs'}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:14px;">
      <div class="stat-box">
        <div class="stat-label" style="margin-bottom:16px;">WEEKLY TRAINING VOLUME (LBS)</div>
        <div class="bar-chart" style="height:150px;">
          ${buckets.length ? buckets.map((b, i) => `
            <div class="bar-col">
              <div class="bar-track" style="height:100%;"><div class="bar-fill" style="height:${Math.max(4, Math.round((b.volume / maxVol) * 100))}%;background:color-mix(in srgb, var(--accent) ${30 + Math.round((i / Math.max(1, buckets.length - 1)) * 70)}%, var(--surface));"></div></div>
              <span class="bar-label">${b.label}</span>
            </div>
          `).join('') : `<div class="muted" style="width:100%;text-align:center;">Log a session to see volume history.</div>`}
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-label" style="margin-bottom:14px;">TOP LIFTS — EST. 1RM</div>
        ${lifts.map((l) => `
          <div style="margin-bottom:14px;">
            <div class="flex" style="justify-content:space-between;margin-bottom:6px;"><span style="color:var(--text-body2);font-size:13px;font-weight:600;">${escapeHtml(l.name)}</span><span class="mono" style="color:var(--accent);font-size:13px;">${l.val ? l.val + ' lb' : '—'}</span></div>
            <div style="height:7px;background:#1c212b;border-radius:4px;overflow:hidden;"><div style="height:100%;background:var(--accent);box-shadow:var(--glow);width:${Math.round((l.val / maxLift) * 100)}%;"></div></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  bindClicks(container, {
    'set-window': (el) => { windowKey = el.dataset.key; render(container); },
  });
}

function shortName(name) {
  return name.replace('Barbell ', '').replace('Back ', '');
}

function formatK(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
  return String(Math.round(n));
}
