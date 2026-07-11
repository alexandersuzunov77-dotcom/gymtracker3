import { getState, update, helpers } from './store.js';

const { uid, isoDate } = helpers;

export function parseWeight(str) {
  if (str == null) return null;
  const m = String(str).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

export function repsToCount(str) {
  if (str == null) return 0;
  const m = String(str).match(/\d+(\.\d+)?/g);
  if (!m) return 0;
  const nums = m.map(Number);
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function epley1RM(weight, reps) {
  if (!weight || !reps) return 0;
  if (reps <= 1) return weight;
  return weight * (1 + reps / 30);
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function weekDates(startIso, weekIndex) {
  const base = addDays(startIso, weekIndex * 7);
  return Array.from({ length: 7 }, (_, i) => isoDate(addDays(base, i)));
}

export function dateLabel(dateIso) {
  const d = new Date(dateIso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function weekdayIndexOf(dateIso) {
  const d = new Date(dateIso + 'T00:00:00');
  return (d.getDay() + 6) % 7; // Mon=0
}

export function programDayFor(dateIso) {
  const s = getState();
  return s.program.days[weekdayIndexOf(dateIso)];
}

function buildSetLogsFromTemplate(ex) {
  const count = Math.max(1, parseInt(ex.sets, 10) || 1);
  const targetWeight = parseWeight(ex.weight) ?? 0;
  const targetReps = repsToCount(ex.reps) || 8;
  return Array.from({ length: count }, (_, i) => ({
    set: String(i + 1),
    weight: targetWeight,
    reps: targetReps,
    rpe: '',
    done: false,
  }));
}

/** Returns the persisted session for a date, materializing it from the program
 *  template on first access (writes through to the store). */
export function ensureSession(dateIso) {
  const s = getState();
  if (s.sessions[dateIso]) return s.sessions[dateIso];
  const day = programDayFor(dateIso);
  const override = s.calendarOverrides[dateIso];
  const tag = override ?? day.tag;
  const focus = override ? overrideFocus(override) : day.focus;
  const off = tag === 'REST';
  const session = {
    date: dateIso,
    tag,
    focus,
    off,
    exercises: off ? [] : day.exercises.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      target: ex.target,
      weight: ex.weight,
      sets: ex.sets,
      reps: ex.reps,
      rpe: ex.rpe,
      notes: '',
      setLogs: buildSetLogsFromTemplate(ex),
    })),
  };
  update((draft) => { draft.sessions[dateIso] = session; });
  return getState().sessions[dateIso];
}

/** Read-only peek at a session without persisting a materialized copy. */
export function peekSession(dateIso) {
  const s = getState();
  if (s.sessions[dateIso]) return s.sessions[dateIso];
  const day = programDayFor(dateIso);
  const override = s.calendarOverrides[dateIso];
  const tag = override ?? day.tag;
  return { date: dateIso, tag, focus: override ? overrideFocus(override) : day.focus, off: tag === 'REST', exercises: [], virtual: true };
}

function overrideFocus(tag) {
  return { PUSH: 'PUSH', PULL: 'PULL', LEGS: 'LEGS', CARDIO: 'CARDIO', REST: 'REST' }[tag] ?? tag;
}

export function exerciseDone(ex) {
  return ex.setLogs.length > 0 && ex.setLogs.every((s) => s.done);
}

export function setVolume(setLog) {
  return (setLog.done ? (setLog.weight || 0) * (setLog.reps || 0) : 0);
}

export function sessionVolume(session) {
  return session.exercises.reduce((sum, ex) => sum + ex.setLogs.reduce((a, s) => a + setVolume(s), 0), 0);
}

export function sessionCompletionPct(session) {
  const total = session.exercises.reduce((a, ex) => a + ex.setLogs.length, 0);
  if (!total) return 0;
  const done = session.exercises.reduce((a, ex) => a + ex.setLogs.filter((s) => s.done).length, 0);
  return done / total;
}

export function isSessionFullyDone(session) {
  return session.exercises.length > 0 && session.exercises.every(exerciseDone);
}

/** All persisted (materialized) sessions between two ISO dates inclusive. */
export function sessionsInRange(startIso, endIso) {
  const s = getState();
  return Object.values(s.sessions).filter((sess) => sess.date >= startIso && sess.date <= endIso);
}

export function currentWeekIndex() {
  const s = getState();
  const start = new Date(s.program.startDate + 'T00:00:00');
  const diffDays = Math.floor((Date.now() - start.getTime()) / 86400000);
  const idx = Math.floor(diffDays / 7);
  return Math.max(0, Math.min(s.program.totalWeeks - 1, idx));
}

export function bestEst1RM(exerciseName) {
  const s = getState();
  let best = 0;
  Object.values(s.sessions).forEach((sess) => {
    sess.exercises.forEach((ex) => {
      if (ex.name !== exerciseName) return;
      ex.setLogs.forEach((set) => {
        if (!set.done) return;
        const est = epley1RM(set.weight, set.reps);
        if (est > best) best = est;
      });
    });
  });
  return Math.round(best);
}

export function bestSetFor(exerciseName) {
  const s = getState();
  let best = null;
  let bestEst = 0;
  Object.values(s.sessions).forEach((sess) => {
    sess.exercises.forEach((ex) => {
      if (ex.name !== exerciseName) return;
      ex.setLogs.forEach((set) => {
        if (!set.done) return;
        const est = epley1RM(set.weight, set.reps);
        if (est > bestEst) { bestEst = est; best = set; }
      });
    });
  });
  return best;
}

export function lastDoneFor(exerciseName) {
  const s = getState();
  const dates = Object.values(s.sessions)
    .filter((sess) => sess.exercises.some((ex) => ex.name === exerciseName && ex.setLogs.some((set) => set.done)))
    .map((sess) => sess.date)
    .sort();
  return dates.length ? dates[dates.length - 1] : null;
}

export function relativeDateLabel(dateIso) {
  const today = new Date(isoDate(new Date()) + 'T00:00:00');
  const d = new Date(dateIso + 'T00:00:00');
  const days = Math.round((today - d) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days > 1) return `${days} days ago`;
  return dateLabel(dateIso);
}

export function previousExerciseInstance(beforeDateIso, exerciseName) {
  const s = getState();
  const dates = Object.keys(s.sessions).filter((d) => d < beforeDateIso).sort().reverse();
  for (const d of dates) {
    const found = s.sessions[d].exercises.find((ex) => ex.name === exerciseName);
    if (found) return found;
  }
  return null;
}

export function earliestEst1RM(exerciseName) {
  const s = getState();
  let earliest = null;
  Object.values(s.sessions)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((sess) => {
      if (earliest != null) return;
      sess.exercises.forEach((ex) => {
        if (ex.name !== exerciseName || earliest != null) return;
        const doneSet = ex.setLogs.find((set) => set.done);
        if (doneSet) earliest = epley1RM(doneSet.weight, doneSet.reps);
      });
    });
  return earliest ? Math.round(earliest) : null;
}

/** Weekly-bucketed training volume for the last `windowWeeks` weeks (or all history). */
export function weeklyVolumeBuckets(windowWeeks) {
  const s = getState();
  const buckets = new Map();
  Object.values(s.sessions).forEach((sess) => {
    const weekStart = isoDate(helpers.startOfWeek(sess.date + 'T00:00:00'));
    buckets.set(weekStart, (buckets.get(weekStart) || 0) + sessionVolume(sess));
  });
  const sorted = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const sliced = windowWeeks ? sorted.slice(-windowWeeks) : sorted;
  return sliced.map(([weekStart, volume]) => ({
    label: new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume,
  }));
}

export function adherenceInWindow(windowWeeks) {
  const s = getState();
  const today = new Date();
  const daysBack = windowWeeks ? windowWeeks * 7 : 365;
  const windowStart = addDays(today, -daysBack);
  let expected = 0;
  let done = 0;
  for (let d = new Date(windowStart); d <= today; d = addDays(d, 1)) {
    const wd = (d.getDay() + 6) % 7;
    const day = s.program.days[wd];
    if (day.off) continue;
    const dIso = isoDate(d);
    if (dIso > isoDate(today)) continue;
    expected += 1;
    const sess = s.sessions[dIso];
    if (sess && isSessionFullyDone(sess)) done += 1;
  }
  return { done, expected, pct: expected ? Math.round((done / expected) * 100) : 0 };
}

export function bodyweightNear(dateIso) {
  const s = getState();
  const sorted = [...s.bodyweightLog].sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return null;
  const onOrBefore = [...sorted].reverse().find((e) => e.date <= dateIso);
  return (onOrBefore ?? sorted[0]).weight;
}

export { uid, isoDate };
