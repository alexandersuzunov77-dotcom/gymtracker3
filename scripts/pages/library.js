import { getState, update } from '../store.js';
import { navigate } from '../router.js';
import { bindClicks, bindInputs, escapeHtml } from '../components/dom.js';
import { uid, bestEst1RM, bestSetFor, lastDoneFor, relativeDateLabel } from '../utils.js';
import { createImageSlot } from '../components/imageSlot.js';
import { MUSCLE_GROUPS } from '../components/exercisePicker.js';
import { exerciseMediaHtml, exerciseThumbHtml } from '../components/exerciseMedia.js';

const GROUPS = ['All', ...MUSCLE_GROUPS];

let searchQuery = '';
let activeGroup = 'All';

export function render(container, params = {}) {
  const s = getState();
  const lib = s.library;

  const filtered = lib.filter((ex) => {
    const matchesGroup = activeGroup === 'All' || ex.muscle === activeGroup;
    const matchesSearch = !searchQuery || ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const selectedId = params.id || filtered[0]?.id || lib[0]?.id;
  const selected = lib.find((ex) => ex.id === selectedId);

  container.innerHTML = `
    <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:18px;">
      <div class="page-title page-title-sm">EXERCISE LIBRARY</div>
      <button class="btn primary" data-action="add-exercise">+ New exercise</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1.15fr;gap:16px;">
      <div>
        <div class="flex gap-10" style="align-items:center;background:var(--surface);border:1px solid var(--chip-border);border-radius:9px;padding:10px 14px;margin-bottom:12px;">
          <span class="muted" style="font-size:15px;">⌕</span>
          <input type="text" data-field="search" placeholder="Search exercises…" value="${escapeHtml(searchQuery)}" class="mono" style="border:none;background:none;flex:1;color:var(--text-body);font-size:14px;padding:0;">
        </div>
        <div class="flex" style="flex-wrap:wrap;gap:6px;margin-bottom:14px;">
          ${GROUPS.map((g) => `<button class="pill ${g === activeGroup ? '' : 'outline'}" style="cursor:pointer;border:none;" data-action="set-group" data-group="${g}">${g}</button>`).join('')}
        </div>
        <div class="grid-table">
          ${filtered.length ? filtered.map((ex) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 15px 9px 11px;border-bottom:1px solid var(--row-border);border-left:2px solid ${ex.id === selectedId ? 'var(--accent)' : 'transparent'};background:${ex.id === selectedId ? `color-mix(in srgb, var(--accent) 14%, var(--surface))` : 'transparent'};cursor:pointer;" data-action="select" data-id="${ex.id}">
              <div class="flex gap-10" style="align-items:center;min-width:0;">
                <div class="art-thumb">${exerciseThumbHtml(ex)}</div>
                <div style="min-width:0;">
                  <div style="color:var(--text-body);font-weight:600;font-size:14px;">${escapeHtml(ex.name)}</div>
                  <div class="muted mono" style="font-size:11px;margin-top:1px;">${escapeHtml(ex.group)}</div>
                </div>
              </div>
              <span class="muted" style="font-size:16px;">›</span>
            </div>
          `).join('') : `<div style="padding:20px;text-align:center;color:var(--text-ghost);">No exercises match.</div>`}
        </div>
      </div>
      <div class="stat-box" id="detail-panel"></div>
    </div>
  `;

  const detail = container.querySelector('#detail-panel');
  renderDetail(detail, selected);

  bindClicks(container, {
    'set-group': (el) => { activeGroup = el.dataset.group; render(container, params); },
    select: (el) => navigate(`/library/${el.dataset.id}`),
    'add-exercise': () => {
      const name = prompt('Exercise name?');
      if (!name) return;
      const id = uid('lib');
      update((draft) => {
        draft.library.push({
          id, name, muscle: 'Full-Body & Compound', equipment: 'Custom', level: 'Beginner',
          group: 'Full-Body & Compound · Custom', cues: [], image: null,
        });
      });
      navigate(`/library/${id}`);
    },
  });

  bindInputs(container, (el) => {
    if (el.dataset.field === 'search') { searchQuery = el.value; render(container, params); }
  }, ['input']);
}

function renderDetail(mount, ex) {
  if (!ex) {
    mount.innerHTML = `<div class="muted" style="padding:20px;text-align:center;">Select an exercise.</div>`;
    return;
  }
  const est1RM = bestEst1RM(ex.name);
  const best = bestSetFor(ex.name);
  const lastDone = lastDoneFor(ex.name);
  const stats = {
    EQUIPMENT: ex.equipment,
    LEVEL: ex.level,
    'EST. 1RM': est1RM ? `${est1RM} lb` : '—',
    'LAST DONE': lastDone ? relativeDateLabel(lastDone) : '—',
  };

  mount.innerHTML = `
    <div style="font-family:'Oswald';font-weight:700;font-size:22px;color:var(--text-heading);line-height:1;">${escapeHtml(ex.name)}</div>
    <div class="mono" style="color:var(--accent);font-size:12px;margin-top:4px;">${escapeHtml(ex.muscle).toUpperCase()}</div>
    <div id="lib-image-mount" style="width:100%;height:190px;border-radius:9px;overflow:hidden;margin:14px 0;border:1px solid var(--surface-border);"></div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px;">
      ${Object.entries(stats).map(([k, v]) => `
        <div class="card" style="padding:10px 12px;"><div class="stat-label" style="font-size:10px;">${k}</div><div style="font-family:'Oswald';font-weight:700;font-size:18px;color:var(--text-heading);line-height:1.2;">${escapeHtml(String(v))}</div></div>
      `).join('')}
    </div>
    ${best ? `<div class="muted mono" style="font-size:11px;margin:-10px 0 16px;">Best set: ${best.weight} × ${best.reps}</div>` : ''}
    <div class="stat-label" style="margin-bottom:8px;">COACHING CUES</div>
    <div class="flex-col gap-8" id="cues-list">
      ${ex.cues.map((cue, i) => `
        <div class="flex gap-8" style="align-items:flex-start;">
          <span style="width:6px;height:6px;border-radius:2px;background:var(--accent);margin-top:6px;flex-shrink:0;"></span>
          <span style="color:var(--text-muted);font-size:13px;line-height:1.45;flex:1;">${escapeHtml(cue)}</span>
          <button data-action="remove-cue" data-idx="${i}" style="background:none;border:none;color:var(--text-ghost);cursor:pointer;font-size:11px;">✕</button>
        </div>
      `).join('')}
      <button data-action="add-cue" style="background:none;border:none;color:var(--text-ghost);cursor:pointer;font-size:12px;text-align:left;padding:2px 0;">+ add coaching cue</button>
    </div>
  `;

  const imgMount = mount.querySelector('#lib-image-mount');
  imgMount.appendChild(createImageSlot({
    image: ex.image,
    placeholder: 'Click or drop a photo to replace the demo',
    placeholderSvg: exerciseMediaHtml(ex),
    onChange: (dataUrl) => update((draft) => { draft.library.find((l) => l.id === ex.id).image = dataUrl; }),
  }));

  bindClicks(mount, {
    'add-cue': () => {
      const cue = prompt('New coaching cue:');
      if (!cue) return;
      update((draft) => { draft.library.find((l) => l.id === ex.id).cues.push(cue); });
      renderDetail(mount, { ...ex, cues: [...ex.cues, cue] });
    },
    'remove-cue': (el) => {
      const i = parseInt(el.dataset.idx, 10);
      update((draft) => { draft.library.find((l) => l.id === ex.id).cues.splice(i, 1); });
      const next = { ...ex, cues: ex.cues.filter((_, n) => n !== i) };
      renderDetail(mount, next);
    },
  });
}
