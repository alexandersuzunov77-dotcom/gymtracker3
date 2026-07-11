import { getState } from '../store.js';
import { bindClicks, bindInputs, escapeHtml } from './dom.js';
import { exerciseThumbHtml } from './exerciseMedia.js';

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms & Grip',
  'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Abs & Core', 'Traps & Neck',
  'Full-Body & Compound',
];

/**
 * Opens a searchable modal over the whole library for picking an exercise.
 * @param {object} opts
 * @param {(exercise: object) => void} opts.onSelect
 * @param {string} [opts.title]
 */
export function openExercisePicker({ onSelect, title = 'Add Exercise' }) {
  let query = '';
  let group = 'All';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);

  function close() {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }
  document.addEventListener('keydown', onKey);

  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });

  function paint(focusSearch) {
    const lib = getState().library;
    const filtered = lib.filter((ex) => {
      const groupOk = group === 'All' || ex.muscle === group;
      const q = query.trim().toLowerCase();
      const queryOk = !q || ex.name.toLowerCase().includes(q) || ex.equipment.toLowerCase().includes(q);
      return groupOk && queryOk;
    });

    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-head">
          <div class="section-label">${escapeHtml(title).toUpperCase()}</div>
          <button class="icon-btn" data-action="close">✕</button>
        </div>
        <div class="flex gap-10" style="align-items:center;background:var(--surface);border:1px solid var(--chip-border);border-radius:9px;padding:10px 14px;margin:14px 0 10px;">
          <span class="muted" style="font-size:15px;">⌕</span>
          <input type="text" data-field="picker-search" placeholder="Search ${lib.length} exercises…" value="${escapeHtml(query)}" class="mono" style="border:none;background:none;flex:1;color:var(--text-body);font-size:14px;padding:0;">
        </div>
        <div class="flex" style="flex-wrap:wrap;gap:6px;margin-bottom:12px;">
          <button class="pill ${group === 'All' ? '' : 'outline'}" style="cursor:pointer;border:none;" data-action="picker-group" data-group="All">All</button>
          ${MUSCLE_GROUPS.map((g) => `<button class="pill ${g === group ? '' : 'outline'}" style="cursor:pointer;border:none;" data-action="picker-group" data-group="${escapeHtml(g)}">${escapeHtml(g)}</button>`).join('')}
        </div>
        <div class="muted mono" style="font-size:11px;margin-bottom:6px;">${filtered.length} result${filtered.length === 1 ? '' : 's'}</div>
        <div class="modal-list">
          ${filtered.length ? filtered.map((ex) => `
            <div class="modal-list-row" data-action="pick" data-id="${ex.id}">
              <div class="flex gap-10" style="align-items:center;min-width:0;">
                <div class="art-thumb">${exerciseThumbHtml(ex)}</div>
                <div style="min-width:0;">
                  <div style="color:var(--text-body);font-weight:600;font-size:14px;">${escapeHtml(ex.name)}</div>
                  <div class="muted mono" style="font-size:11px;margin-top:1px;">${escapeHtml(ex.muscle)} · ${escapeHtml(ex.equipment)}</div>
                </div>
              </div>
              <span class="pill outline">${escapeHtml(ex.level)}</span>
            </div>
          `).join('') : `<div style="padding:24px;text-align:center;color:var(--text-ghost);">No exercises match.</div>`}
        </div>
      </div>
    `;

    bindClicks(overlay, {
      close: () => close(),
      'picker-group': (el) => { group = el.dataset.group; paint(false); },
      pick: (el) => {
        const ex = lib.find((x) => x.id === el.dataset.id);
        close();
        onSelect(ex);
      },
    });
    bindInputs(overlay, (el) => {
      if (el.dataset.field === 'picker-search') { query = el.value; paint(true); }
    }, ['input']);

    if (focusSearch) {
      const input = overlay.querySelector('[data-field="picker-search"]');
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  paint(true);
}
