import { getState, update, helpers } from '../store.js';
import { navigate } from '../router.js';
import { bindClicks, bindInputs, escapeHtml } from '../components/dom.js';
import {
  ensureSession, peekSession, exerciseDone, sessionVolume, sessionCompletionPct,
  isSessionFullyDone, weekDates, currentWeekIndex, uid,
} from '../utils.js';

const { isoDate, WEEKDAYS } = helpers;

function fmtWeekRange(dates) {
  const start = new Date(dates[0] + 'T00:00:00');
  const end = new Date(dates[6] + 'T00:00:00');
  const opts = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} → ${end.toLocaleDateString('en-US', opts)}`;
}

export function render(container) {
  const s = getState();
  const weekIdx = currentWeekIndex();
  const dates = weekDates(s.program.startDate, weekIdx);
  const todayIso = isoDate(new Date());
  const isToday = dates.includes(todayIso);
  const focusDate = isToday ? todayIso : dates[0];

  const trainingDays = s.program.days.filter((d) => !d.off).length;
  const weekSessions = dates.map((d) => peekSession(d));
  const sessionsDone = weekSessions.filter((sess) => sess.exercises.length && isSessionFullyDone(sess)).length;
  const weeklyVolume = weekSessions.reduce((a, sess) => a + sessionVolume(sess), 0);
  const completionPct = trainingDays ? Math.round((sessionsDone / trainingDays) * 100) : 0;

  const session = ensureSession(focusDate);
  const estMinutes = session.exercises.length ? session.exercises.length * 9 : 0;
  const rpeCap = session.exercises.reduce((max, ex) => {
    const n = parseFloat(ex.rpe);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);

  const bwLog = [...s.bodyweightLog].sort((a, b) => a.date.localeCompare(b.date));
  const current = bwLog.length ? bwLog[bwLog.length - 1].weight : null;
  const weekAgoIso = isoDate(new Date(Date.now() - 7 * 86400000));
  const weekAgoEntry = [...bwLog].reverse().find((e) => e.date <= weekAgoIso);
  const delta = current != null && weekAgoEntry ? (current - weekAgoEntry.weight) : null;

  const dayBars = dates.map((d, i) => {
    const sess = peekSession(d);
    const pct = sess.exercises.length ? Math.round(sessionCompletionPct(sess) * 100) : 0;
    return { label: WEEKDAYS[i], pct };
  });

  container.innerHTML = `
    <div class="page-head">
      <div>
        <div class="eyebrow">${escapeHtml(s.program.split)} — ${escapeHtml(s.program.mesocycleLabel)}</div>
        <div class="page-title page-title-lg">WEEK ${weekIdx + 1} <span class="muted" style="font-weight:400;font-size:22px;">/ ${s.program.totalWeeks}</span></div>
      </div>
      <div style="text-align:right;">
        <div class="stat-label">CLIENT · ${escapeHtml(s.client.name).toUpperCase()}</div>
        <div style="color:var(--text-heading);font-family:'Oswald';font-weight:500;font-size:16px;margin-top:2px;">${fmtWeekRange(dates)}</div>
      </div>
    </div>

    <div class="stat-strip">
      <div class="stat-box"><div class="stat-label">TRAINING DAYS</div><div class="stat-value">${trainingDays} <small>/ 7</small></div></div>
      <div class="stat-box"><div class="stat-label">SESSIONS DONE</div><div class="stat-value accent">${sessionsDone} <small>/ ${trainingDays}</small></div></div>
      <div class="stat-box"><div class="stat-label">WEEKLY VOLUME</div><div class="stat-value">${Math.round(weeklyVolume).toLocaleString()} <small>lbs</small></div></div>
      <div class="stat-box">
        <div class="stat-label">COMPLETION</div>
        <div class="flex" style="align-items:baseline;gap:8px;">
          <div class="stat-value">${completionPct}%</div>
          <div class="progress-track"><div class="progress-fill" style="width:${completionPct}%;"></div></div>
        </div>
      </div>
    </div>

    <div class="flex" style="align-items:center;justify-content:space-between;margin-bottom:10px;">
      <div class="flex gap-12" style="align-items:center;">
        <span class="section-label">${isToday ? 'TODAY' : escapeHtml(dates[0])} — ${escapeHtml(session.focus)}</span>
        ${session.off ? '' : `<span class="pill">${escapeHtml(session.tag)}</span>`}
      </div>
      ${session.off ? '' : `<span class="muted mono" style="font-size:12px;">Est. ${estMinutes} min · RPE cap ${rpeCap || '—'}</span>`}
    </div>

    ${session.off ? `
      <div class="grid-table" style="padding:40px 0;text-align:center;color:var(--text-ghost);font-family:'Oswald';letter-spacing:1px;">— REST DAY —</div>
    ` : `
    <div class="grid-table">
      <div class="grid-head" style="grid-template-columns:2.4fr .9fr .8fr .9fr .8fr .7fr;">
        <div>EXERCISE</div><div class="center">WEIGHT</div><div class="center">SETS</div><div class="center">REPS</div><div class="center">RPE</div><div class="center">✓</div>
      </div>
      ${session.exercises.map((ex, i) => `
        <div class="grid-row" style="grid-template-columns:2.4fr .9fr .8fr .9fr .8fr .7fr;cursor:pointer;" data-action="open-log" data-idx="${i}">
          <div class="flex-col"><span style="color:var(--text-body);font-weight:600;font-size:14px;">${escapeHtml(ex.name)}</span><span class="muted mono" style="font-size:11px;">${escapeHtml(ex.target)}</span></div>
          <div class="center mono" style="color:var(--text-body2);font-size:14px;font-weight:500;">${escapeHtml(ex.weight)}</div>
          <div class="center mono" style="color:var(--text-body2);font-size:14px;">${escapeHtml(ex.sets)}</div>
          <div class="center mono" style="color:var(--text-body2);font-size:14px;">${escapeHtml(ex.reps)}</div>
          <div class="center mono" style="color:var(--accent);font-size:14px;">${escapeHtml(ex.rpe)}</div>
          <div class="flex" style="justify-content:center;">
            <button class="${exerciseDone(ex) ? 'check-done' : 'check-pending'}" data-action="toggle-done" data-idx="${i}">${exerciseDone(ex) ? '✓' : ''}</button>
          </div>
        </div>
      `).join('')}
      <button class="add-row" data-action="add-exercise"><span class="plus">+</span>Add exercise</button>
    </div>
    `}

    <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:14px;margin-top:18px;">
      <div class="stat-box">
        <div class="stat-label" style="margin-bottom:12px;">BODYWEIGHT</div>
        <div class="flex" style="align-items:flex-end;gap:16px;">
          <div><div class="muted" style="font-size:11px;">Current</div><div style="font-family:'Oswald';font-weight:700;font-size:28px;color:var(--text-heading);line-height:1;">${current != null ? current : '—'}</div></div>
          <div><div class="muted" style="font-size:11px;">Target</div><div style="font-family:'Oswald';font-weight:700;font-size:28px;color:var(--accent);line-height:1;">
            <input type="number" data-field="bw-target" value="${s.bodyweightTarget}" style="width:70px;background:none;border:none;color:var(--accent);font-family:'Oswald';font-weight:700;font-size:28px;padding:0;">
          </div></div>
          <div style="margin-left:auto;text-align:right;">
            <div class="muted" style="font-size:11px;">7-day</div>
            <div style="font-family:'Oswald';font-weight:600;font-size:16px;color:${delta == null ? 'var(--text-ghost)' : (delta <= 0 ? 'var(--positive)' : '#e0704a')};line-height:1;">${delta == null ? '—' : (delta <= 0 ? '▼' : '▲') + ' ' + Math.abs(delta).toFixed(1)}</div>
          </div>
        </div>
        <div class="flex gap-8" style="margin-top:12px;">
          <input type="number" step="0.1" placeholder="Log today's weight" data-field="bw-log" style="flex:1;">
          <button class="btn primary" data-action="log-bodyweight">Log</button>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-label" style="margin-bottom:12px;">DAILY PROGRESS</div>
        <div class="bar-chart" style="height:74px;">
          ${dayBars.map((d) => `
            <div class="bar-col">
              <div class="bar-track" style="height:52px;"><div class="bar-fill" style="height:${Math.max(d.pct, 3)}%;"></div></div>
              <span class="bar-label">${d.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  bindClicks(container, {
    'open-log': (el) => {
      navigate(`/log/${focusDate}/${el.dataset.idx}`);
    },
    'toggle-done': (el, e) => {
      e.stopPropagation();
      const idx = parseInt(el.dataset.idx, 10);
      const sess = ensureSession(focusDate);
      const ex = sess.exercises[idx];
      const makeDone = !exerciseDone(ex);
      update((draft) => {
        draft.sessions[focusDate].exercises[idx].setLogs.forEach((sl) => { sl.done = makeDone; });
      });
      render(container);
    },
    'add-exercise': () => {
      const name = prompt('Exercise name?');
      if (!name) return;
      const sess = ensureSession(focusDate);
      update((draft) => {
        draft.sessions[focusDate].exercises.push({
          exerciseId: uid('ex'),
          name,
          target: '',
          weight: '0 lb',
          sets: '3',
          reps: '8',
          rpe: '',
          notes: '',
          setLogs: [1, 2, 3].map((n) => ({ set: String(n), weight: 0, reps: 8, rpe: '', done: false })),
        });
      });
      render(container);
    },
    'log-bodyweight': () => {
      const input = container.querySelector('[data-field="bw-log"]');
      const val = parseFloat(input.value);
      if (!Number.isFinite(val)) return;
      update((draft) => {
        const today = isoDate(new Date());
        const existing = draft.bodyweightLog.find((e) => e.date === today);
        if (existing) existing.weight = val; else draft.bodyweightLog.push({ date: today, weight: val });
      });
      render(container);
    },
  });

  bindInputs(container, (el) => {
    if (el.dataset.field === 'bw-target') {
      const val = parseFloat(el.value);
      if (Number.isFinite(val)) update((draft) => { draft.bodyweightTarget = val; });
    }
  }, ['change']);
}
