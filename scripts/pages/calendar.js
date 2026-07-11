import { getState, update, helpers } from '../store.js';
import { navigate } from '../router.js';
import { bindClicks } from '../components/dom.js';

const { isoDate } = helpers;

const TAG_CYCLE = [null, 'PUSH', 'PULL', 'LEGS', 'CARDIO', 'REST'];
const TAG_MIX = { PUSH: 52, PULL: 84, LEGS: 38, CARDIO: 65, REST: 0 };
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function tagFor(dateIso) {
  const s = getState();
  const wd = (new Date(dateIso + 'T00:00:00').getDay() + 6) % 7;
  const override = s.calendarOverrides[dateIso];
  if (override !== undefined) return override;
  return s.program.days[wd].tag;
}

export function render(container, params = {}) {
  const today = new Date();
  const year = params.year ? parseInt(params.year, 10) : today.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : today.getMonth();
  const todayIso = isoDate(today);

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // days before month start (Mon-first)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    const cellDate = new Date(year, month, dayNum);
    const dateIso = isoDate(cellDate);
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
    cells.push({
      dateIso,
      label: cellDate.getDate(),
      inMonth,
      isToday: dateIso === todayIso,
      tag: inMonth ? tagFor(dateIso) : null,
    });
  }

  container.innerHTML = `
    <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:20px;">
      <div class="flex gap-14" style="align-items:baseline;">
        <div class="page-title page-title-sm">${MONTH_NAMES[month].toUpperCase()} ${year}</div>
        <div class="flex gap-6">
          <button class="icon-btn" data-action="prev-month">◀</button>
          <button class="icon-btn" data-action="next-month">▶</button>
          <button class="btn" data-action="today">TODAY</button>
        </div>
      </div>
      <div class="flex gap-14" style="align-items:center;">
        ${Object.entries(TAG_MIX).map(([tag, mix]) => `
          <div class="flex gap-6" style="align-items:center;">
            <span style="width:12px;height:12px;border-radius:3px;background:${mix === 0 ? '#141821' : `color-mix(in srgb, var(--accent) ${mix}%, var(--surface))`};"></span>
            <span class="muted" style="font-size:12px;font-family:'Oswald';letter-spacing:1px;">${tag}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px;">
      ${['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((w) => `<div class="center muted" style="font-family:'Oswald';font-weight:600;font-size:11px;letter-spacing:2px;">${w}</div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
      ${cells.map((c) => {
        if (!c.inMonth) {
          return `<div style="height:84px;border-radius:9px;padding:8px 10px;color:var(--text-disabled);"><span style="font-family:'Oswald';font-weight:600;font-size:14px;">${c.label}</span></div>`;
        }
        const mix = TAG_MIX[c.tag] ?? 0;
        const bg = mix === 0 ? '#141821' : `color-mix(in srgb, var(--accent) ${mix}%, var(--surface))`;
        const fg = mix === 0 ? 'var(--text-ghost)' : (mix >= 70 ? '#0c0e13' : 'var(--text-body2)');
        const border = c.isToday ? 'var(--accent)' : 'var(--row-border)';
        const ring = c.isToday ? 'inset 0 0 0 2px var(--accent)' : 'none';
        return `
          <button data-action="cycle-tag" data-date="${c.dateIso}" style="height:84px;border-radius:9px;padding:8px 10px;display:flex;flex-direction:column;justify-content:space-between;background:${bg};border:1px solid ${border};box-shadow:${ring};cursor:pointer;text-align:left;">
            <span style="font-family:'Oswald';font-weight:600;font-size:14px;color:${fg};">${c.label}</span>
            <span style="font-family:'Oswald';font-weight:600;font-size:11px;letter-spacing:1px;color:${fg};">${c.tag || ''}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  bindClicks(container, {
    'prev-month': () => { const d = new Date(year, month - 1, 1); navigate(`/calendar/${d.getFullYear()}/${d.getMonth()}`); },
    'next-month': () => { const d = new Date(year, month + 1, 1); navigate(`/calendar/${d.getFullYear()}/${d.getMonth()}`); },
    today: () => navigate('/calendar'),
    'cycle-tag': (el) => {
      const dateIso = el.dataset.date;
      const current = tagFor(dateIso);
      const idx = TAG_CYCLE.indexOf(current);
      const next = TAG_CYCLE[(idx + 1) % TAG_CYCLE.length];
      update((draft) => {
        if (next === null) delete draft.calendarOverrides[dateIso];
        else draft.calendarOverrides[dateIso] = next;
      });
      render(container, params);
    },
  });
}
