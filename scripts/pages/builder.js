import { getState, update } from '../store.js';
import { bindClicks, escapeHtml } from '../components/dom.js';
import { uid } from '../utils.js';
import { openExercisePicker } from '../components/exercisePicker.js';

export function render(container) {
  const s = getState();
  const p = s.program;

  container.innerHTML = `
    <div class="flex" style="justify-content:space-between;align-items:flex-end;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
      <div>
        <div class="eyebrow">PROGRAM BUILDER</div>
        <div class="page-title page-title-sm">${escapeHtml(p.name).toUpperCase()}</div>
      </div>
      <div class="muted mono" style="font-size:13px;text-align:right;">${p.totalWeeks}-week mesocycle · ${escapeHtml(p.split)}</div>
    </div>

    <div style="display:grid;grid-template-columns:190px 1fr;gap:16px;">
      <div class="flex-col gap-8">
        <div class="stat-label" style="padding:2px 4px;">WEEKS</div>
        ${p.weekNotes.map((note, i) => `
          <button data-action="set-week" data-idx="${i}" style="border:none;text-align:left;cursor:pointer;border-radius:9px;padding:11px 13px;
            background:${i === p.activeWeek ? `color-mix(in srgb, var(--accent) 16%, var(--surface))` : 'var(--surface)'};
            border-left:2px solid ${i === p.activeWeek ? 'var(--accent)' : 'transparent'};
            border-top:1px solid ${i === p.activeWeek ? 'transparent' : 'var(--surface-border)'};
            border-right:1px solid ${i === p.activeWeek ? 'transparent' : 'var(--surface-border)'};
            border-bottom:1px solid ${i === p.activeWeek ? 'transparent' : 'var(--surface-border)'};">
            <div style="font-family:'Oswald';font-weight:600;font-size:15px;color:${i === p.activeWeek ? 'var(--accent)' : 'var(--text-body2)'};">Week ${i + 1}</div>
            <div class="mono" style="font-size:11px;margin-top:2px;color:${i === p.activeWeek ? 'var(--text-dim)' : 'var(--text-ghost)'};">${escapeHtml(note)}</div>
          </button>
        `).join('')}
      </div>

      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
        ${p.days.map((day, di) => `
          <div class="card" style="overflow:hidden;display:flex;flex-direction:column;">
            <div style="padding:10px;border-bottom:1px solid #1c212b;cursor:pointer;" data-action="edit-focus" data-day="${di}">
              <div style="font-family:'Oswald';font-weight:600;font-size:11px;letter-spacing:1.5px;color:var(--text-ghost);">${day.day}</div>
              <div style="font-family:'Oswald';font-weight:700;font-size:14px;color:var(--text-heading);">${escapeHtml(day.focus)}</div>
            </div>
            <div style="padding:8px;display:flex;flex-direction:column;gap:6px;flex:1;">
              ${day.exercises.map((it, ei) => `
                <div class="chip" style="cursor:pointer;position:relative;" data-action="edit-exercise" data-day="${di}" data-ex="${ei}">${escapeHtml(it.name)}</div>
              `).join('')}
              ${day.off ? `<div class="mono" style="color:var(--text-disabled);font-size:11px;text-align:center;padding:16px 0;">— rest —</div>` : ''}
              <button class="mono" style="color:var(--text-ghost);font-size:11px;padding:4px 2px;background:none;border:none;cursor:pointer;text-align:left;" data-action="add-exercise" data-day="${di}">+ add</button>
              <button class="mono" style="color:var(--text-ghost);font-size:10px;padding:4px 2px;background:none;border:none;cursor:pointer;text-align:left;text-decoration:underline;" data-action="toggle-off" data-day="${di}">${day.off ? 'make training day' : 'mark rest day'}</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  bindClicks(container, {
    'set-week': (el) => {
      const idx = parseInt(el.dataset.idx, 10);
      update((draft) => { draft.program.activeWeek = idx; });
      render(container);
    },
    'edit-focus': (el) => {
      const di = parseInt(el.dataset.day, 10);
      const val = prompt('Day focus label:', s.program.days[di].focus);
      if (val == null) return;
      update((draft) => { draft.program.days[di].focus = val; });
      render(container);
    },
    'edit-exercise': (el) => {
      const di = parseInt(el.dataset.day, 10);
      const ei = parseInt(el.dataset.ex, 10);
      const current = s.program.days[di].exercises[ei];
      const val = prompt('Exercise (blank to remove):', current.name);
      if (val === null) return;
      update((draft) => {
        if (val.trim() === '') draft.program.days[di].exercises.splice(ei, 1);
        else draft.program.days[di].exercises[ei].name = val.trim();
      });
      render(container);
    },
    'add-exercise': (el) => {
      const di = parseInt(el.dataset.day, 10);
      openExercisePicker({
        title: `Add exercise · ${s.program.days[di].day}`,
        onSelect: (ex) => {
          update((draft) => {
            draft.program.days[di].exercises.push({
              id: uid('ex'), name: ex.name, target: `${ex.muscle} · ${ex.equipment}`,
              weight: '0 lb', sets: '3', reps: '8', rpe: '',
            });
            draft.program.days[di].off = false;
          });
          render(container);
        },
      });
    },
    'toggle-off': (el) => {
      const di = parseInt(el.dataset.day, 10);
      update((draft) => { draft.program.days[di].off = !draft.program.days[di].off; });
      render(container);
    },
  });
}
