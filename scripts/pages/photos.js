import { getState, update, helpers } from '../store.js';
import { bindClicks, escapeHtml } from '../components/dom.js';
import { uid, bodyweightNear } from '../utils.js';
import { createImageSlot } from '../components/imageSlot.js';

const { isoDate } = helpers;

let viewMode = 'compare';

function fmtDate(dateIso) {
  return new Date(dateIso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function render(container) {
  const s = getState();
  const timeline = [...s.photos].sort((a, b) => a.date.localeCompare(b.date));
  const withImages = timeline.filter((p) => p.image);
  const before = withImages[0] || null;
  const after = withImages.length > 1 ? withImages[withImages.length - 1] : null;

  container.innerHTML = `
    <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:18px;">
      <div class="page-title page-title-sm">PROGRESS PHOTOS</div>
      <div class="flex gap-6">
        <button class="pill ${viewMode === 'compare' ? '' : 'outline'}" style="cursor:pointer;border:none;" data-action="set-view" data-mode="compare">COMPARE</button>
        <button class="pill ${viewMode === 'grid' ? '' : 'outline'}" style="cursor:pointer;border:none;" data-action="set-view" data-mode="grid">GRID</button>
      </div>
    </div>

    ${viewMode === 'compare' ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">
        <div>
          <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="stat-label">BEFORE</span>
            <span class="muted mono" style="font-size:12px;">${before ? `${fmtDate(before.date)} · ${bodyweightNear(before.date) ?? '—'} lb` : 'No photo yet'}</span>
          </div>
          <div style="width:100%;height:340px;border-radius:11px;overflow:hidden;border:1px solid var(--surface-border);" id="before-mount"></div>
        </div>
        <div>
          <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="mono" style="color:var(--accent);font-family:'Oswald';font-weight:600;font-size:12px;letter-spacing:1.5px;">AFTER</span>
            <span class="muted mono" style="font-size:12px;">${after ? `${fmtDate(after.date)} · ${bodyweightNear(after.date) ?? '—'} lb` : 'Add a second photo'}</span>
          </div>
          <div style="width:100%;height:340px;border-radius:11px;overflow:hidden;border:1px solid color-mix(in srgb, var(--accent) 40%, var(--panel-border));" id="after-mount"></div>
        </div>
      </div>
    ` : ''}

    <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div class="stat-label">TIMELINE</div>
      <button class="btn primary" data-action="add-photo">+ Add photo</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));gap:10px;">
      ${timeline.map((p) => `
        <div>
          <div style="width:100%;height:150px;border-radius:9px;overflow:hidden;border:1px solid var(--surface-border);" data-photo-mount="${p.id}"></div>
          <div class="flex" style="justify-content:space-between;align-items:center;margin-top:6px;">
            <span class="muted" style="font-size:11px;font-family:'Oswald';letter-spacing:1px;">${fmtDate(p.date)}</span>
            <button data-action="remove-photo" data-id="${p.id}" style="background:none;border:none;color:var(--text-ghost);cursor:pointer;font-size:11px;">✕</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  if (viewMode === 'compare') {
    container.querySelector('#before-mount').appendChild(createImageSlot({
      image: before?.image ?? null,
      placeholder: 'No before photo — add one below',
      removable: false,
      onChange: () => {},
    }));
    container.querySelector('#after-mount').appendChild(createImageSlot({
      image: after?.image ?? null,
      placeholder: 'No after photo — add one below',
      removable: false,
      onChange: () => {},
    }));
  }

  timeline.forEach((p) => {
    const mount = container.querySelector(`[data-photo-mount="${p.id}"]`);
    mount.appendChild(createImageSlot({
      image: p.image,
      placeholder: 'Add',
      onChange: (dataUrl) => {
        update((draft) => { draft.photos.find((x) => x.id === p.id).image = dataUrl; });
        render(container);
      },
    }));
  });

  bindClicks(container, {
    'set-view': (el) => { viewMode = el.dataset.mode; render(container); },
    'add-photo': () => {
      const id = uid('ph');
      update((draft) => { draft.photos.push({ id, date: isoDate(new Date()), image: null }); });
      render(container);
    },
    'remove-photo': (el) => {
      update((draft) => { draft.photos = draft.photos.filter((p) => p.id !== el.dataset.id); });
      render(container);
    },
  });
}
