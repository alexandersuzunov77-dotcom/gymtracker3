import { getState, update } from '../store.js';
import { ACCENT_OPTIONS, DENSITY_OPTIONS, ENERGY_OPTIONS, applyTheme } from '../theme.js';

let panelOpen = false;

export function renderTweaks(mount) {
  const settings = getState().settings;

  mount.innerHTML = `
    <button class="tweaks-toggle" data-action="toggle-tweaks">⚙ Feel</button>
  `;

  mount.querySelector('[data-action="toggle-tweaks"]').addEventListener('click', () => {
    panelOpen = !panelOpen;
    renderPanel();
  });

  renderPanel();

  function renderPanel() {
    let panel = document.getElementById('tweaks-panel');
    if (panel) panel.remove();
    if (!panelOpen) return;

    const s = getState().settings;
    panel = document.createElement('div');
    panel.id = 'tweaks-panel';
    panel.className = 'tweaks-panel';
    panel.innerHTML = `
      <h4>Feel</h4>
      <div class="tweaks-field">
        <label>Accent</label>
        <div class="swatch-row">
          ${ACCENT_OPTIONS.map((c) => `
            <button class="swatch ${c === s.accent ? 'active' : ''}" style="background:${c}" data-action="set-accent" data-value="${c}" title="${c}"></button>
          `).join('')}
        </div>
      </div>
      <div class="tweaks-field">
        <label>Log density</label>
        <div class="seg-row">
          ${DENSITY_OPTIONS.map((d) => `
            <button class="seg-btn ${d === s.density ? 'active' : ''}" data-action="set-density" data-value="${d}">${d}</button>
          `).join('')}
        </div>
      </div>
      <div class="tweaks-field">
        <label>Energy</label>
        <div class="seg-row">
          ${ENERGY_OPTIONS.map((en) => `
            <button class="seg-btn ${en === s.energy ? 'active' : ''}" data-action="set-energy" data-value="${en}">${en}</button>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelectorAll('[data-action="set-accent"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        update((d) => { d.settings.accent = btn.dataset.value; });
        applyTheme(getState().settings);
        renderPanel();
      });
    });
    panel.querySelectorAll('[data-action="set-density"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        update((d) => { d.settings.density = btn.dataset.value; });
        applyTheme(getState().settings);
        renderPanel();
      });
    });
    panel.querySelectorAll('[data-action="set-energy"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        update((d) => { d.settings.energy = btn.dataset.value; });
        applyTheme(getState().settings);
        renderPanel();
      });
    });
  }
}
