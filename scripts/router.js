const routes = [];
let notFound = null;
let container = null;
let currentPath = null;
const onNavigateListeners = new Set();

export function registerRoute(pattern, render) {
  const paramNames = [];
  const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, (m) => {
    paramNames.push(m.slice(1));
    return '([^/]+)';
  }) + '$');
  routes.push({ regex, paramNames, render });
}

export function setNotFound(render) {
  notFound = render;
}

export function onNavigate(fn) {
  onNavigateListeners.add(fn);
  return () => onNavigateListeners.delete(fn);
}

function currentHashPath() {
  const h = location.hash.replace(/^#/, '');
  return h || '/';
}

function matchRoute(path) {
  for (const r of routes) {
    const m = path.match(r.regex);
    if (m) {
      const params = {};
      r.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
      return { render: r.render, params };
    }
  }
  return null;
}

function handle() {
  const path = currentHashPath();
  currentPath = path;
  container.innerHTML = '';
  const match = matchRoute(path);
  onNavigateListeners.forEach((fn) => fn(path));
  if (match) {
    match.render(container, match.params);
  } else if (notFound) {
    notFound(container);
  }
}

export function initRouter(mountEl) {
  container = mountEl;
  window.addEventListener('hashchange', handle);
  handle();
}

export function navigate(path) {
  if (currentHashPath() === path) {
    handle();
  } else {
    location.hash = path;
  }
}

export function getCurrentPath() {
  return currentPath;
}

export function rerender() {
  handle();
}
