import { getCurrentPath, navigate } from '../router.js';

const NAV_GROUPS = [
  { label: 'Workout', items: [
    { path: '/', label: 'Weekly Planner' },
    { path: '/log', label: 'Log Entry' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/dashboard', label: 'Dashboard' },
  ] },
  { label: 'Builder', items: [
    { path: '/builder', label: 'Program Builder' },
    { path: '/library', label: 'Exercise Library' },
  ] },
  { label: 'Client', items: [
    { path: '/measurements', label: 'Measurements' },
    { path: '/photos', label: 'Progress Photos' },
  ] },
];

function isActive(itemPath, current) {
  if (itemPath === '/') return current === '/';
  return current.startsWith(itemPath);
}

export function renderSidebar(container) {
  const aside = document.createElement('aside');
  aside.className = 'sidebar';

  const current = getCurrentPath() || '/';

  aside.innerHTML = `
    <div class="sidebar-brand">
      <div class="logo">IRON<span>LEDGER</span></div>
      <div class="tagline">TRAINING SYSTEM</div>
    </div>
    <nav class="sidebar-nav">
      ${NAV_GROUPS.map((g) => `
        <div class="group-label">${g.label}</div>
        ${g.items.map((it) => `
          <button class="nav-item ${isActive(it.path, current) ? 'active' : ''}" data-path="${it.path}">${it.label}</button>
        `).join('')}
      `).join('')}
    </nav>
    <div class="sidebar-footer" id="tweaks-mount"></div>
  `;

  aside.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.path));
  });

  container.appendChild(aside);
  return aside;
}
