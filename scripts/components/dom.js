export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function h(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

// Page modules call bindClicks/bindInputs on every render(), often reusing the
// same persistent container across re-renders. Track the previously attached
// delegate per root+kind so re-binding replaces it instead of stacking another
// listener (which would multi-fire actions after repeated in-place renders).
const attached = new WeakMap();

function rebind(root, kind, eventNames, listener) {
  let byKind = attached.get(root);
  if (!byKind) { byKind = {}; attached.set(root, byKind); }
  const prev = byKind[kind];
  if (prev) prev.events.forEach((evt) => root.removeEventListener(evt, prev.listener));
  eventNames.forEach((evt) => root.addEventListener(evt, listener));
  byKind[kind] = { events: eventNames, listener };
}

/** Delegate clicks within `root` for elements matching `[data-action]`.
 *  handlers: { actionName: (el, event) => void } */
export function bindClicks(root, handlers) {
  const listener = (e) => {
    const target = e.target.closest('[data-action]');
    if (!target || !root.contains(target)) return;
    const action = target.dataset.action;
    if (handlers[action]) handlers[action](target, e);
  };
  rebind(root, 'click', ['click'], listener);
}

/** Delegate input/change within `root` for elements matching `[data-field]`. */
export function bindInputs(root, handler, events = ['input', 'change']) {
  const listener = (e) => {
    const target = e.target.closest('[data-field]');
    if (!target || !root.contains(target)) return;
    handler(target, e);
  };
  rebind(root, 'input:' + events.join(','), events, listener);
}
