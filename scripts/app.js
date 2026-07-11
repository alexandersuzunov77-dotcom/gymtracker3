import { getState, subscribe } from './store.js';
import { applyTheme } from './theme.js';
import { registerRoute, initRouter, onNavigate, getCurrentPath } from './router.js';
import { renderSidebar } from './components/sidebar.js';
import { renderTweaks } from './components/tweaks.js';

import * as planner from './pages/planner.js';
import * as dashboard from './pages/dashboard.js';
import * as logEntry from './pages/logEntry.js';
import * as calendar from './pages/calendar.js';
import * as builder from './pages/builder.js';
import * as library from './pages/library.js';
import * as measurements from './pages/measurements.js';
import * as photos from './pages/photos.js';

function isActive(itemPath, current) {
  if (itemPath === '/') return current === '/';
  return current.startsWith(itemPath);
}

function boot() {
  applyTheme(getState().settings);
  subscribe((s) => applyTheme(s.settings));

  const shell = document.getElementById('app-shell');
  const aside = renderSidebar(shell);
  renderTweaks(aside.querySelector('#tweaks-mount'));

  const main = document.createElement('main');
  main.id = 'main-content';
  shell.appendChild(main);

  registerRoute('/', planner.render);
  registerRoute('/dashboard', dashboard.render);
  registerRoute('/log', logEntry.render);
  registerRoute('/log/:date/:idx', logEntry.render);
  registerRoute('/calendar', calendar.render);
  registerRoute('/calendar/:year/:month', calendar.render);
  registerRoute('/builder', builder.render);
  registerRoute('/library', library.render);
  registerRoute('/library/:id', library.render);
  registerRoute('/measurements', measurements.render);
  registerRoute('/photos', photos.render);

  onNavigate((path) => {
    aside.querySelectorAll('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', isActive(btn.dataset.path, path));
    });
  });

  initRouter(main);
}

document.addEventListener('DOMContentLoaded', boot);
