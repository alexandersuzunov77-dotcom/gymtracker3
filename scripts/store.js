// Iron Ledger — localStorage-backed data store with pub/sub.

import { CUES_BY_NAME } from './data/cues.js';

const STORAGE_KEY = 'ironledger:v1';

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const dow = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - dow);
  d.setHours(0, 0, 0, 0);
  return d;
}

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function defaultProgramDays() {
  return [
    { day: 'MON', focus: 'PUSH A', tag: 'PUSH', off: false, exercises: [
      { id: uid('ex'), name: 'Barbell Bench Press', target: 'Chest', weight: '185 lb', sets: '4', reps: '8', rpe: '8' },
      { id: uid('ex'), name: 'Overhead Press', target: 'Shoulders', weight: '115 lb', sets: '3', reps: '8-10', rpe: '8' },
      { id: uid('ex'), name: 'Incline DB Press', target: 'Chest', weight: '65 lb', sets: '3', reps: '10-12', rpe: '8' },
      { id: uid('ex'), name: 'Lateral Raise', target: 'Delts', weight: '20 lb', sets: '3', reps: '12-15', rpe: '9' },
      { id: uid('ex'), name: 'Triceps Rope Pushdown', target: 'Triceps', weight: '50 lb', sets: '3', reps: '12-15', rpe: '9' },
    ] },
    { day: 'TUE', focus: 'PULL A', tag: 'PULL', off: false, exercises: [
      { id: uid('ex'), name: 'Deadlift', target: 'Posterior chain', weight: '315 lb', sets: '4', reps: '5', rpe: '8' },
      { id: uid('ex'), name: 'Weighted Pull-Up', target: 'Lats · +45 lb', weight: '+45 lb', sets: '4', reps: '6-8', rpe: '9' },
      { id: uid('ex'), name: 'Barbell Row', target: 'Mid-back', weight: '185 lb', sets: '3', reps: '8-10', rpe: '8' },
      { id: uid('ex'), name: 'Seated Cable Row', target: 'Rhomboids', weight: '160 lb', sets: '3', reps: '10-12', rpe: '7' },
      { id: uid('ex'), name: 'Face Pull', target: 'Rear delts', weight: '50 lb', sets: '3', reps: '15', rpe: '7' },
      { id: uid('ex'), name: 'Incline DB Curl', target: 'Biceps', weight: '35 lb', sets: '3', reps: '10-12', rpe: '8' },
      { id: uid('ex'), name: 'Hammer Curl', target: 'Brachialis', weight: '30 lb', sets: '3', reps: '12', rpe: '8' },
    ] },
    { day: 'WED', focus: 'LEGS A', tag: 'LEGS', off: false, exercises: [
      { id: uid('ex'), name: 'Back Squat', target: 'Quads', weight: '275 lb', sets: '4', reps: '6', rpe: '8' },
      { id: uid('ex'), name: 'Romanian Deadlift', target: 'Hamstrings', weight: '225 lb', sets: '3', reps: '8-10', rpe: '8' },
      { id: uid('ex'), name: 'Leg Press', target: 'Quads', weight: '450 lb', sets: '3', reps: '10-12', rpe: '8' },
      { id: uid('ex'), name: 'Leg Curl', target: 'Hamstrings', weight: '90 lb', sets: '3', reps: '12', rpe: '8' },
      { id: uid('ex'), name: 'Standing Calf Raise', target: 'Calves', weight: '180 lb', sets: '4', reps: '12-15', rpe: '9' },
    ] },
    { day: 'THU', focus: 'PUSH B', tag: 'PUSH', off: false, exercises: [
      { id: uid('ex'), name: 'Incline Barbell Bench', target: 'Upper chest', weight: '155 lb', sets: '4', reps: '8', rpe: '8' },
      { id: uid('ex'), name: 'Arnold Press', target: 'Shoulders', weight: '45 lb', sets: '3', reps: '10', rpe: '8' },
      { id: uid('ex'), name: 'Cable Fly', target: 'Chest', weight: '30 lb', sets: '3', reps: '12-15', rpe: '8' },
      { id: uid('ex'), name: 'Lateral Raise', target: 'Delts', weight: '20 lb', sets: '3', reps: '12-15', rpe: '9' },
      { id: uid('ex'), name: 'Skullcrusher', target: 'Triceps', weight: '60 lb', sets: '3', reps: '10-12', rpe: '8' },
    ] },
    { day: 'FRI', focus: 'PULL B', tag: 'PULL', off: false, exercises: [
      { id: uid('ex'), name: 'Rack Pull', target: 'Posterior chain', weight: '365 lb', sets: '3', reps: '5', rpe: '8' },
      { id: uid('ex'), name: 'Chin-Up', target: 'Lats', weight: 'BW', sets: '4', reps: '8-10', rpe: '9' },
      { id: uid('ex'), name: 'Chest-Supported Row', target: 'Mid-back', weight: '135 lb', sets: '3', reps: '10', rpe: '8' },
      { id: uid('ex'), name: 'Rear Delt Fly', target: 'Rear delts', weight: '15 lb', sets: '3', reps: '15', rpe: '8' },
      { id: uid('ex'), name: 'Hammer Curl', target: 'Brachialis', weight: '30 lb', sets: '3', reps: '12', rpe: '8' },
    ] },
    { day: 'SAT', focus: 'LEGS B', tag: 'LEGS', off: false, exercises: [
      { id: uid('ex'), name: 'Front Squat', target: 'Quads', weight: '205 lb', sets: '4', reps: '6', rpe: '8' },
      { id: uid('ex'), name: 'Hip Thrust', target: 'Glutes', weight: '275 lb', sets: '3', reps: '10', rpe: '8' },
      { id: uid('ex'), name: 'Walking Lunge', target: 'Quads/Glutes', weight: '40 lb', sets: '3', reps: '12/leg', rpe: '8' },
      { id: uid('ex'), name: 'Leg Extension', target: 'Quads', weight: '110 lb', sets: '3', reps: '12-15', rpe: '9' },
      { id: uid('ex'), name: 'Seated Calf Raise', target: 'Calves', weight: '90 lb', sets: '4', reps: '15', rpe: '9' },
    ] },
    { day: 'SUN', focus: 'REST', tag: 'REST', off: true, exercises: [] },
  ];
}

// Full reference catalog, sourced from the uploaded exercise_database.pdf
// (184 exercises across 13 muscle groups, each tagged with equipment + level).
const EXERCISE_DATABASE = [
  { muscle: 'Chest', items: [
    ['Push-Up', 'Bodyweight', 'Beginner'],
    ['Knee Push-Up', 'Bodyweight', 'Beginner'],
    ['Incline Push-Up (hands elevated)', 'Bodyweight', 'Beginner'],
    ['Decline Push-Up (feet elevated)', 'Bodyweight', 'Intermediate'],
    ['Barbell Bench Press (flat)', 'Barbell', 'Intermediate'],
    ['Barbell Incline Bench Press', 'Barbell', 'Intermediate'],
    ['Barbell Decline Bench Press', 'Barbell', 'Intermediate'],
    ['Dumbbell Bench Press (flat)', 'Dumbbell', 'Beginner'],
    ['Dumbbell Incline Press', 'Dumbbell', 'Beginner'],
    ['Dumbbell Decline Press', 'Dumbbell', 'Intermediate'],
    ['Dumbbell Flye (flat)', 'Dumbbell', 'Intermediate'],
    ['Incline Dumbbell Flye', 'Dumbbell', 'Intermediate'],
    ['Machine Chest Press', 'Machine', 'Beginner'],
    ['Incline Machine Press', 'Machine', 'Beginner'],
    ['Pec Deck / Machine Flye', 'Machine', 'Beginner'],
    ['Cable Crossover (high to low)', 'Cable', 'Intermediate'],
    ['Cable Crossover (low to high)', 'Cable', 'Intermediate'],
    ['Cable Flye (mid)', 'Cable', 'Intermediate'],
    ['Chest Dip', 'Bodyweight', 'Intermediate'],
    ['Weighted Chest Dip', 'Bodyweight+', 'Advanced'],
    ['Svend Press', 'Plate', 'Beginner'],
    ['Landmine Press', 'Barbell', 'Intermediate'],
    ['Smith Machine Bench Press', 'Machine', 'Beginner'],
    ['Floor Press', 'Barbell/DB', 'Intermediate'],
  ] },
  { muscle: 'Back', items: [
    ['Pull-Up', 'Bodyweight', 'Intermediate'],
    ['Chin-Up (supinated)', 'Bodyweight', 'Intermediate'],
    ['Assisted Pull-Up (band/machine)', 'Machine', 'Beginner'],
    ['Lat Pulldown (wide)', 'Cable', 'Beginner'],
    ['Lat Pulldown (close/neutral)', 'Cable', 'Beginner'],
    ['Straight-Arm Pulldown', 'Cable', 'Intermediate'],
    ['Barbell Bent-Over Row', 'Barbell', 'Intermediate'],
    ['Pendlay Row', 'Barbell', 'Advanced'],
    ['T-Bar Row', 'Barbell', 'Intermediate'],
    ['Dumbbell Single-Arm Row', 'Dumbbell', 'Beginner'],
    ['Chest-Supported Dumbbell Row', 'Dumbbell', 'Beginner'],
    ['Seated Cable Row (wide)', 'Cable', 'Beginner'],
    ['Seated Cable Row (close)', 'Cable', 'Beginner'],
    ['Machine Row (Hammer Strength)', 'Machine', 'Beginner'],
    ['Inverted Row / Bodyweight Row', 'Bodyweight', 'Beginner'],
    ['Meadows Row', 'Barbell', 'Advanced'],
    ['Deadlift (conventional)', 'Barbell', 'Intermediate'],
    ['Rack Pull', 'Barbell', 'Intermediate'],
    ['Back Extension (hyperextension)', 'Bodyweight', 'Beginner'],
    ['Weighted Back Extension', 'Bodyweight+', 'Intermediate'],
    ['Face Pull', 'Cable', 'Beginner'],
    ['Shrug-to-Row Combo', 'Dumbbell', 'Intermediate'],
    ['Renegade Row', 'Dumbbell', 'Advanced'],
  ] },
  { muscle: 'Shoulders', items: [
    ['Overhead Barbell Press (standing)', 'Barbell', 'Intermediate'],
    ['Seated Barbell Press', 'Barbell', 'Intermediate'],
    ['Dumbbell Shoulder Press', 'Dumbbell', 'Beginner'],
    ['Arnold Press', 'Dumbbell', 'Intermediate'],
    ['Machine Shoulder Press', 'Machine', 'Beginner'],
    ['Dumbbell Lateral Raise', 'Dumbbell', 'Beginner'],
    ['Cable Lateral Raise', 'Cable', 'Intermediate'],
    ['Machine Lateral Raise', 'Machine', 'Beginner'],
    ['Dumbbell Front Raise', 'Dumbbell', 'Beginner'],
    ['Plate Front Raise', 'Plate', 'Beginner'],
    ['Rear Delt Dumbbell Flye', 'Dumbbell', 'Beginner'],
    ['Reverse Pec Deck', 'Machine', 'Beginner'],
    ['Cable Rear Delt Flye', 'Cable', 'Intermediate'],
    ['Upright Row (barbell)', 'Barbell', 'Intermediate'],
    ['Upright Row (cable)', 'Cable', 'Intermediate'],
    ['Landmine Press (shoulder)', 'Barbell', 'Intermediate'],
    ['Pike Push-Up', 'Bodyweight', 'Intermediate'],
    ['Handstand Push-Up', 'Bodyweight', 'Advanced'],
    ['Behind-the-Neck Press', 'Barbell', 'Advanced'],
    ['Cable Y-Raise', 'Cable', 'Intermediate'],
  ] },
  { muscle: 'Biceps', items: [
    ['Barbell Curl', 'Barbell', 'Beginner'],
    ['EZ-Bar Curl', 'Barbell', 'Beginner'],
    ['Dumbbell Curl (alternating)', 'Dumbbell', 'Beginner'],
    ['Hammer Curl', 'Dumbbell', 'Beginner'],
    ['Incline Dumbbell Curl', 'Dumbbell', 'Intermediate'],
    ['Concentration Curl', 'Dumbbell', 'Beginner'],
    ['Preacher Curl (barbell)', 'Barbell', 'Intermediate'],
    ['Preacher Curl (machine)', 'Machine', 'Beginner'],
    ['Cable Curl (straight bar)', 'Cable', 'Beginner'],
    ['Cable Rope Hammer Curl', 'Cable', 'Beginner'],
    ['Spider Curl', 'Dumbbell', 'Intermediate'],
    ['Zottman Curl', 'Dumbbell', 'Intermediate'],
    ['Chin-Up (biceps focus)', 'Bodyweight', 'Intermediate'],
    ['21s (barbell)', 'Barbell', 'Intermediate'],
    ['Bayesian Cable Curl', 'Cable', 'Advanced'],
  ] },
  { muscle: 'Triceps', items: [
    ['Triceps Pushdown (rope)', 'Cable', 'Beginner'],
    ['Triceps Pushdown (bar)', 'Cable', 'Beginner'],
    ['Overhead Cable Extension', 'Cable', 'Intermediate'],
    ['Overhead Dumbbell Extension', 'Dumbbell', 'Beginner'],
    ['Skull Crusher (EZ-bar)', 'Barbell', 'Intermediate'],
    ['Close-Grip Bench Press', 'Barbell', 'Intermediate'],
    ['Triceps Dip (bench)', 'Bodyweight', 'Beginner'],
    ['Parallel Bar Dip', 'Bodyweight', 'Intermediate'],
    ['Dumbbell Kickback', 'Dumbbell', 'Beginner'],
    ['Cable Kickback', 'Cable', 'Beginner'],
    ['Diamond Push-Up', 'Bodyweight', 'Intermediate'],
    ['Machine Triceps Extension', 'Machine', 'Beginner'],
    ['JM Press', 'Barbell', 'Advanced'],
    ['Tate Press', 'Dumbbell', 'Intermediate'],
  ] },
  { muscle: 'Forearms & Grip', items: [
    ['Wrist Curl (barbell)', 'Barbell', 'Beginner'],
    ['Reverse Wrist Curl', 'Barbell', 'Beginner'],
    ['Reverse Barbell Curl', 'Barbell', 'Intermediate'],
    ["Farmer's Carry", 'Dumbbell', 'Beginner'],
    ['Dead Hang', 'Bodyweight', 'Beginner'],
    ['Plate Pinch', 'Plate', 'Intermediate'],
    ['Wrist Roller', 'Machine', 'Intermediate'],
    ['Cable Wrist Curl', 'Cable', 'Beginner'],
  ] },
  { muscle: 'Quadriceps', items: [
    ['Bodyweight Squat', 'Bodyweight', 'Beginner'],
    ['Barbell Back Squat', 'Barbell', 'Intermediate'],
    ['Barbell Front Squat', 'Barbell', 'Advanced'],
    ['Goblet Squat', 'Dumbbell', 'Beginner'],
    ['Hack Squat (machine)', 'Machine', 'Beginner'],
    ['Leg Press', 'Machine', 'Beginner'],
    ['Leg Extension', 'Machine', 'Beginner'],
    ['Bulgarian Split Squat', 'Dumbbell', 'Intermediate'],
    ['Walking Lunge', 'Dumbbell', 'Beginner'],
    ['Reverse Lunge', 'Dumbbell', 'Beginner'],
    ['Step-Up', 'Dumbbell', 'Beginner'],
    ['Smith Machine Squat', 'Machine', 'Beginner'],
    ['Sissy Squat', 'Bodyweight', 'Advanced'],
    ['Box Squat', 'Barbell', 'Intermediate'],
    ['Pause Squat', 'Barbell', 'Advanced'],
  ] },
  { muscle: 'Hamstrings', items: [
    ['Romanian Deadlift (barbell)', 'Barbell', 'Intermediate'],
    ['Dumbbell RDL', 'Dumbbell', 'Beginner'],
    ['Stiff-Leg Deadlift', 'Barbell', 'Intermediate'],
    ['Lying Leg Curl', 'Machine', 'Beginner'],
    ['Seated Leg Curl', 'Machine', 'Beginner'],
    ['Nordic Hamstring Curl', 'Bodyweight', 'Advanced'],
    ['Good Morning', 'Barbell', 'Intermediate'],
    ['Glute-Ham Raise', 'Machine', 'Advanced'],
    ['Cable Pull-Through', 'Cable', 'Beginner'],
    ['Single-Leg RDL', 'Dumbbell', 'Intermediate'],
    ['Kettlebell Swing', 'Kettlebell', 'Intermediate'],
  ] },
  { muscle: 'Glutes', items: [
    ['Barbell Hip Thrust', 'Barbell', 'Intermediate'],
    ['Glute Bridge (bodyweight)', 'Bodyweight', 'Beginner'],
    ['Machine Hip Thrust', 'Machine', 'Beginner'],
    ['Cable Kickback (glute)', 'Cable', 'Beginner'],
    ['Hip Abduction Machine', 'Machine', 'Beginner'],
    ['Banded Lateral Walk', 'Band', 'Beginner'],
    ['Sumo Deadlift', 'Barbell', 'Intermediate'],
    ['Curtsy Lunge', 'Dumbbell', 'Intermediate'],
    ['Frog Pump', 'Bodyweight', 'Beginner'],
    ['Single-Leg Hip Thrust', 'Bodyweight', 'Intermediate'],
    ['Step-Up (glute focus)', 'Dumbbell', 'Beginner'],
  ] },
  { muscle: 'Calves', items: [
    ['Standing Calf Raise (machine)', 'Machine', 'Beginner'],
    ['Seated Calf Raise', 'Machine', 'Beginner'],
    ['Standing Calf Raise (dumbbell)', 'Dumbbell', 'Beginner'],
    ['Leg Press Calf Raise', 'Machine', 'Beginner'],
    ['Single-Leg Calf Raise', 'Bodyweight', 'Beginner'],
    ['Smith Machine Calf Raise', 'Machine', 'Beginner'],
    ['Donkey Calf Raise', 'Machine', 'Intermediate'],
    ['Tibialis Raise', 'Bodyweight', 'Beginner'],
  ] },
  { muscle: 'Abs & Core', items: [
    ['Plank', 'Bodyweight', 'Beginner'],
    ['Side Plank', 'Bodyweight', 'Beginner'],
    ['Crunch', 'Bodyweight', 'Beginner'],
    ['Bicycle Crunch', 'Bodyweight', 'Beginner'],
    ['Hanging Leg Raise', 'Bodyweight', 'Intermediate'],
    ['Hanging Knee Raise', 'Bodyweight', 'Beginner'],
    ['Cable Crunch', 'Cable', 'Beginner'],
    ['Ab Wheel Rollout', 'Wheel', 'Advanced'],
    ['Russian Twist', 'Plate', 'Beginner'],
    ['Mountain Climber', 'Bodyweight', 'Beginner'],
    ['Dead Bug', 'Bodyweight', 'Beginner'],
    ['Leg Raise (lying)', 'Bodyweight', 'Beginner'],
    ['Decline Sit-Up', 'Bodyweight', 'Intermediate'],
    ['Pallof Press', 'Cable', 'Intermediate'],
    ['Toes-to-Bar', 'Bodyweight', 'Advanced'],
    ['Woodchopper (cable)', 'Cable', 'Intermediate'],
    ['Hollow Body Hold', 'Bodyweight', 'Intermediate'],
  ] },
  { muscle: 'Traps & Neck', items: [
    ['Barbell Shrug', 'Barbell', 'Beginner'],
    ['Dumbbell Shrug', 'Dumbbell', 'Beginner'],
    ['Cable Shrug', 'Cable', 'Beginner'],
    ['Trap Bar Shrug', 'Barbell', 'Intermediate'],
    ["Farmer's Carry (trap)", 'Dumbbell', 'Beginner'],
    ['Neck Curl (plate)', 'Plate', 'Intermediate'],
    ['Neck Extension', 'Plate', 'Intermediate'],
  ] },
  { muscle: 'Full-Body & Compound', items: [
    ['Clean & Press', 'Barbell', 'Advanced'],
    ['Power Clean', 'Barbell', 'Advanced'],
    ['Snatch', 'Barbell', 'Advanced'],
    ['Thruster', 'Barbell', 'Intermediate'],
    ['Turkish Get-Up', 'Kettlebell', 'Advanced'],
    ['Burpee', 'Bodyweight', 'Beginner'],
    ['Kettlebell Clean', 'Kettlebell', 'Intermediate'],
    ["Devil's Press", 'Dumbbell', 'Advanced'],
    ['Trap Bar Deadlift', 'Barbell', 'Beginner'],
    ['Bear Crawl', 'Bodyweight', 'Beginner'],
    ['Wall Ball', 'Med Ball', 'Intermediate'],
  ] },
];

function buildLibraryFromDatabase() {
  const entries = [];
  EXERCISE_DATABASE.forEach(({ muscle, items }) => {
    items.forEach(([name, equipment, level]) => {
      entries.push({
        id: uid('lib'),
        name,
        muscle,
        equipment,
        level,
        group: `${muscle} · ${equipment}`,
        cues: CUES_BY_NAME[name] ? [...CUES_BY_NAME[name]] : [],
        image: null,
      });
    });
  });
  return entries;
}

function parseNum(str) {
  const m = String(str).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function repsCount(str) {
  const m = String(str).match(/\d+(\.\d+)?/g);
  if (!m) return 8;
  const nums = m.map(Number);
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

/** Backfills ~4 weeks of plausible completed sessions before the program start
 *  so Dashboard/Measurements have real history on first load. */
function buildHistorySessions(days, programStart) {
  const sessions = {};
  for (let offset = -28; offset < 0; offset++) {
    const d = new Date(programStart);
    d.setDate(d.getDate() + offset);
    const wd = (d.getDay() + 6) % 7;
    const day = days[wd];
    if (day.off) continue;
    const dateIso = isoDate(d);
    const isRecent = offset >= -4;
    sessions[dateIso] = {
      date: dateIso,
      tag: day.tag,
      focus: day.focus,
      off: false,
      exercises: day.exercises.map((ex, idx) => {
        const baseWeight = parseNum(ex.weight);
        const repsTarget = repsCount(ex.reps);
        const setsCount = Math.max(1, parseInt(ex.sets, 10) || 3);
        const progressFactor = 1 - (Math.abs(offset) / 28) * 0.08;
        const weight = Math.round(baseWeight * progressFactor);
        const setLogs = Array.from({ length: setsCount }, (_, i) => ({
          set: String(i + 1),
          weight,
          reps: repsTarget,
          rpe: ex.rpe,
          done: !(isRecent && idx >= day.exercises.length - 2 && i === setsCount - 1),
        }));
        return {
          exerciseId: ex.id, name: ex.name, target: ex.target, weight: ex.weight,
          sets: ex.sets, reps: ex.reps, rpe: ex.rpe, notes: '', setLogs,
        };
      }),
    };
  }
  return sessions;
}

function seed() {
  const today = new Date();
  const programStart = startOfWeek(today);
  const days = defaultProgramDays();
  return {
    settings: { accent: '#b6f24a', density: 'Standard', energy: 'Charged' },
    client: { name: 'Marcus T.' },
    program: {
      name: 'Hypertrophy Block',
      mesocycleLabel: 'Mesocycle 2',
      split: 'Push · Pull · Legs',
      startDate: isoDate(programStart),
      totalWeeks: 6,
      activeWeek: 0,
      weekNotes: ['Accumulation', 'Accumulation', 'Intensification', 'Intensification', 'Peak', 'Deload'],
      days,
    },
    sessions: buildHistorySessions(days, programStart),
    bodyweightLog: [
      { date: isoDate(new Date(today - 42 * 86400000)), weight: 193.0 },
      { date: isoDate(new Date(today - 28 * 86400000)), weight: 189.4 },
      { date: isoDate(new Date(today - 14 * 86400000)), weight: 186.2 },
      { date: isoDate(new Date(today - 7 * 86400000)), weight: 184.7 },
      { date: isoDate(today), weight: 183.5 },
    ],
    bodyweightTarget: 170,
    measurements: [
      { date: isoDate(new Date(today - 49 * 86400000)), weight: 193.0, bodyFat: 17.3, waist: 34.0, chest: 43.2, arms: 15.6, thighs: 23.8 },
      { date: isoDate(new Date(today - 28 * 86400000)), weight: 189.4, bodyFat: 16.1, waist: 33.4, chest: 43.5, arms: 15.8, thighs: 24.0 },
      { date: isoDate(new Date(today - 14 * 86400000)), weight: 186.2, bodyFat: 15.0, waist: 33.0, chest: 43.8, arms: 16.0, thighs: 24.2 },
      { date: isoDate(today), weight: 183.5, bodyFat: 14.2, waist: 32.5, chest: 44.0, arms: 16.2, thighs: 24.5 },
    ],
    library: buildLibraryFromDatabase(),
    photos: [
      { id: uid('ph'), date: isoDate(new Date(today - 49 * 86400000)), image: null },
      { id: uid('ph'), date: isoDate(new Date(today - 35 * 86400000)), image: null },
      { id: uid('ph'), date: isoDate(new Date(today - 21 * 86400000)), image: null },
      { id: uid('ph'), date: isoDate(new Date(today - 7 * 86400000)), image: null },
      { id: uid('ph'), date: isoDate(today), image: null },
    ],
    calendarOverrides: {},
    ui: { activeExerciseGroup: 'All', logCursor: null },
  };
}

let state = load();

/** Merges any exercises added to EXERCISE_DATABASE since a browser's
 *  localStorage was first seeded into its existing library, and backfills
 *  coaching cues for entries that have none — without touching entries the
 *  user already customized (their own cues, uploaded images). */
function reconcileLibrary(existingLibrary) {
  const existing = Array.isArray(existingLibrary) ? existingLibrary : [];
  let changed = false;
  existing.forEach((ex) => {
    if ((!ex.cues || ex.cues.length === 0) && CUES_BY_NAME[ex.name]) {
      ex.cues = [...CUES_BY_NAME[ex.name]];
      changed = true;
    }
  });
  const known = new Set(existing.map((ex) => ex.name.trim().toLowerCase()));
  const missing = buildLibraryFromDatabase().filter((ex) => !known.has(ex.name.trim().toLowerCase()));
  return { list: [...existing, ...missing], changed: changed || missing.length > 0 };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    const merged = { ...seed(), ...parsed };
    const { list, changed } = reconcileLibrary(parsed.library);
    merged.library = list;
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch (e) {
    console.warn('Failed to load store, reseeding', e);
    return seed();
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to persist store', e);
  }
}

const listeners = new Set();

function notify() {
  persist();
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return state;
}

/** Mutate state via a producer function `(draft) => void`, then persist + notify. */
export function update(mutator) {
  mutator(state);
  notify();
}

export function resetAll() {
  state = seed();
  notify();
}

export const helpers = { uid, isoDate, startOfWeek, WEEKDAYS };
