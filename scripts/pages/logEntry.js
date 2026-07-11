import { getState, update, helpers } from '../store.js';
import { navigate } from '../router.js';
import { bindClicks, bindInputs, escapeHtml } from '../components/dom.js';
import { ensureSession, exerciseDone, previousExerciseInstance, epley1RM } from '../utils.js';

const { isoDate } = helpers;

let timer = { seconds: 150, running: false, intervalId: null };

function resetTimerIfNeeded(key) {
  if (timer.key !== key) {
    clearInterval(timer.intervalId);
    timer = { seconds: 150, running: false, intervalId: null, key };
  }
}

function fmtClock(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function render(container, params = {}) {
  const s = getState();
  const date = params.date || isoDate(new Date());
  const session = ensureSession(date);
  let idx = params.idx != null ? parseInt(params.idx, 10) : session.exercises.findIndex((ex) => !exerciseDone(ex));
  if (idx < 0) idx = 0;
  if (idx >= session.exercises.length) idx = session.exercises.length - 1;

  resetTimerIfNeeded(`${date}:${idx}`);

  if (!session.exercises.length) {
    container.innerHTML = `<div class="card" style="padding:40px;text-align:center;color:var(--text-ghost);">No exercises logged for ${escapeHtml(date)}. Head back to the <a href="#/">Weekly Planner</a> to add one.</div>`;
    return;
  }

  const ex = session.exercises[idx];
  const prev = previousExerciseInstance(date, ex.name);
  const doneSets = ex.setLogs.filter((sl) => sl.done);
  const setVolume = doneSets.reduce((a, sl) => a + sl.weight * sl.reps, 0);
  const bestDoneSet = doneSets.reduce((best, sl) => (sl.weight > (best?.weight ?? -1) ? sl : best), null);
  const est1RM = bestDoneSet ? Math.round(epley1RM(bestDoneSet.weight, bestDoneSet.reps)) : 0;

  container.innerHTML = `
    <div class="page-head">
      <div>
        <div class="eyebrow">LOG ENTRY · ${escapeHtml(session.focus)} · EX ${idx + 1} / ${session.exercises.length}</div>
        <div class="page-title">${escapeHtml(ex.name).toUpperCase()}</div>
        <div class="muted mono" style="font-size:13px;margin-top:6px;">${escapeHtml(ex.target)} — target ${escapeHtml(ex.sets)} × ${escapeHtml(ex.reps)} @ RPE ${escapeHtml(ex.rpe)}</div>
      </div>
      <div class="flex gap-8">
        <button class="btn" data-action="prev" ${idx === 0 ? 'disabled style="opacity:.4;cursor:default;"' : ''}>◀ PREV</button>
        <button class="btn accent-outline" data-action="next" ${idx === session.exercises.length - 1 ? 'disabled style="opacity:.4;cursor:default;"' : ''}>NEXT ▶</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1.9fr 1fr;gap:14px;">
      <div class="grid-table">
        <div class="grid-head" style="grid-template-columns:.6fr 1fr 1fr .9fr .8fr .5fr .4fr;">
          <div>SET</div><div>PREV</div><div class="center">WEIGHT</div><div class="center">REPS</div><div class="center">RPE</div><div class="center">✓</div><div></div>
        </div>
        ${ex.setLogs.map((sl, i) => `
          <div class="grid-row" style="grid-template-columns:.6fr 1fr 1fr .9fr .8fr .5fr .4fr;">
            <div><span style="width:22px;height:22px;border-radius:6px;background:color-mix(in srgb, var(--accent) 16%, var(--surface));color:var(--accent);font-family:'Oswald';font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;">${i + 1}</span></div>
            <div class="mono muted" style="font-size:13px;">${prev && prev.setLogs[i] ? `${prev.setLogs[i].weight} × ${prev.setLogs[i].reps}` : '—'}</div>
            <div class="center"><input class="field" type="number" data-field="weight" data-idx="${i}" value="${sl.weight}"></div>
            <div class="center"><input class="field" type="number" data-field="reps" data-idx="${i}" value="${sl.reps}"></div>
            <div class="center"><input class="field mono" style="color:var(--accent);min-width:44px;" type="text" data-field="rpe" data-idx="${i}" value="${escapeHtml(sl.rpe)}"></div>
            <div class="flex" style="justify-content:center;"><button class="${sl.done ? 'check-done' : 'check-pending'}" data-action="toggle-set" data-idx="${i}">${sl.done ? '✓' : ''}</button></div>
            <div class="flex" style="justify-content:center;">${ex.setLogs.length > 1 ? `<button class="icon-btn" style="width:22px;height:22px;font-size:11px;" data-action="remove-set" data-idx="${i}">✕</button>` : ''}</div>
          </div>
        `).join('')}
        <button class="add-row" data-action="add-set"><span class="plus">+</span>Add set</button>
      </div>

      <div class="flex-col gap-14">
        <div class="stat-box" style="text-align:center;">
          <div class="stat-label">REST TIMER</div>
          <div id="timer-display" style="font-family:'Oswald';font-weight:700;font-size:54px;color:var(--accent);text-shadow:var(--glow);line-height:1.1;letter-spacing:1px;">${fmtClock(timer.seconds)}</div>
          <div class="flex gap-8" style="justify-content:center;margin-top:8px;">
            <button class="btn" data-action="timer-sub">−15s</button>
            <button class="btn primary" data-action="timer-toggle" id="timer-toggle-btn">${timer.running ? 'PAUSE' : 'START'}</button>
            <button class="btn" data-action="timer-add">+15s</button>
          </div>
        </div>
        <div class="stat-box grow">
          <div class="stat-label" style="margin-bottom:10px;">SESSION NOTES</div>
          <textarea data-field="notes" rows="4" style="width:100%;resize:vertical;line-height:1.6;">${escapeHtml(ex.notes)}</textarea>
        </div>
        <div style="background:color-mix(in srgb, var(--accent) 12%, var(--surface));border:1px solid color-mix(in srgb, var(--accent) 30%, var(--panel-border));border-radius:10px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;">
          <div><div class="stat-label">SET VOLUME</div><div style="font-family:'Oswald';font-weight:700;font-size:24px;color:var(--text-heading);line-height:1;">${Math.round(setVolume).toLocaleString()} lb</div></div>
          <div style="text-align:right;"><div class="stat-label">EST. 1RM</div><div style="font-family:'Oswald';font-weight:700;font-size:24px;color:var(--accent);line-height:1;">${est1RM || '—'}</div></div>
        </div>
      </div>
    </div>
  `;

  function mutateExercise(fn) {
    update((draft) => { fn(draft.sessions[date].exercises[idx]); });
  }

  bindClicks(container, {
    prev: () => { if (idx > 0) navigate(`/log/${date}/${idx - 1}`); },
    next: () => { if (idx < session.exercises.length - 1) navigate(`/log/${date}/${idx + 1}`); },
    'toggle-set': (el) => {
      const i = parseInt(el.dataset.idx, 10);
      mutateExercise((e) => { e.setLogs[i].done = !e.setLogs[i].done; });
      render(container, params);
    },
    'remove-set': (el) => {
      const i = parseInt(el.dataset.idx, 10);
      mutateExercise((e) => { e.setLogs.splice(i, 1); e.setLogs.forEach((sl, n) => { sl.set = String(n + 1); }); });
      render(container, params);
    },
    'add-set': () => {
      mutateExercise((e) => {
        const last = e.setLogs[e.setLogs.length - 1];
        e.setLogs.push({ set: String(e.setLogs.length + 1), weight: last?.weight ?? 0, reps: last?.reps ?? 8, rpe: '', done: false });
      });
      render(container, params);
    },
    'timer-toggle': () => {
      if (timer.running) {
        clearInterval(timer.intervalId);
        timer.running = false;
      } else {
        timer.running = true;
        timer.intervalId = setInterval(() => {
          timer.seconds = Math.max(0, timer.seconds - 1);
          const disp = document.getElementById('timer-display');
          if (disp) disp.textContent = fmtClock(timer.seconds);
          if (timer.seconds === 0) {
            clearInterval(timer.intervalId);
            timer.running = false;
            const btn = document.getElementById('timer-toggle-btn');
            if (btn) btn.textContent = 'START';
          }
        }, 1000);
      }
      const btn = document.getElementById('timer-toggle-btn');
      if (btn) btn.textContent = timer.running ? 'PAUSE' : 'START';
    },
    'timer-add': () => {
      timer.seconds += 15;
      const disp = document.getElementById('timer-display');
      if (disp) disp.textContent = fmtClock(timer.seconds);
    },
    'timer-sub': () => {
      timer.seconds = Math.max(0, timer.seconds - 15);
      const disp = document.getElementById('timer-display');
      if (disp) disp.textContent = fmtClock(timer.seconds);
    },
  });

  bindInputs(container, (el) => {
    const i = parseInt(el.dataset.idx, 10);
    if (el.dataset.field === 'weight') {
      const v = parseFloat(el.value); if (Number.isFinite(v)) mutateExercise((e) => { e.setLogs[i].weight = v; });
    } else if (el.dataset.field === 'reps') {
      const v = parseInt(el.value, 10); if (Number.isFinite(v)) mutateExercise((e) => { e.setLogs[i].reps = v; });
    } else if (el.dataset.field === 'rpe') {
      mutateExercise((e) => { e.setLogs[i].rpe = el.value; });
    } else if (el.dataset.field === 'notes') {
      mutateExercise((e) => { e.notes = el.value; });
    }
  }, ['change']);
}
