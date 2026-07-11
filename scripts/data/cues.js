// Coaching cues for every exercise in the reference database.
// Keyed by exact exercise name; consumed at seed time and backfilled into
// existing localStorage libraries by store.js's reconcile pass.

export const CUES_BY_NAME = {
  // ---- CHEST ----
  'Push-Up': [
    'Hands under shoulders, slightly wider; body one straight line.',
    'Lower chest to the floor with elbows tracking ~45°.',
    'Squeeze glutes and brace — no sagging hips.',
  ],
  'Knee Push-Up': [
    'Knees down, but hips stay locked in line with the shoulders.',
    'Lower the chest between the hands, not the face.',
    'Press the floor away without letting the low back sag.',
  ],
  'Incline Push-Up (hands elevated)': [
    'Hands on a bench or bar, body rigid from head to heels.',
    'Lower the chest to the edge under control.',
    'The taller the incline, the easier — lower it as you get stronger.',
  ],
  'Decline Push-Up (feet elevated)': [
    'Feet elevated, hands under the shoulders.',
    'Keep the neck neutral — don’t dive head-first.',
    'Brace hard; hips sag faster in the decline position.',
  ],
  'Barbell Bench Press (flat)': [
    'Retract & depress the scapula — pin the shoulders into the bench.',
    'Lower the bar to the sternum, elbows tucked to ~45°.',
    'Drive the feet into the floor and press in a slight backward arc.',
    'Keep wrists stacked over the elbows through lockout.',
  ],
  'Barbell Incline Bench Press': [
    'Set the bench to 30–45°.',
    'Touch the bar just below the collarbones.',
    'Keep elbows under the bar — don’t flare at the bottom.',
  ],
  'Barbell Decline Bench Press': [
    'Slight decline (15–30°) is plenty.',
    'Bar path travels to the lower chest.',
    'Shorter stroke — control the touch, never bounce.',
  ],
  'Dumbbell Bench Press (flat)': [
    'Bells over the chest, palms turned slightly in.',
    'Take a deep stretch at the bottom without the shoulders rolling forward.',
    'Press up and slightly together at the top.',
  ],
  'Dumbbell Incline Press': [
    'Bench at ~30°; start with the bells at the outer chest.',
    'Drive up without banging the bells together.',
    'Lower to a full stretch under control.',
  ],
  'Dumbbell Decline Press': [
    'Press to the lower-chest line.',
    'Keep the feet hooked and anchored.',
    'Control the eccentric — the stretch position is heavily loaded.',
  ],
  'Dumbbell Flye (flat)': [
    'Hold a soft elbow bend and keep it constant.',
    'Open the arms until you feel a chest stretch, not shoulder pain.',
    'Hug the arc back up like wrapping your arms around a barrel.',
  ],
  'Incline Dumbbell Flye': [
    'Same fixed-elbow arc on a 30° bench.',
    'Feel the stretch across the upper chest.',
    'Don’t turn it into a press — the elbow angle never changes.',
  ],
  'Machine Chest Press': [
    'Set the seat so the handles sit mid-chest.',
    'Pin the shoulder blades to the pad.',
    'Press fully without the shoulders rolling forward at lockout.',
  ],
  'Incline Machine Press': [
    'Handles start just below the collarbone.',
    'Drive up and slightly in.',
    'Pause a beat in the stretch each rep.',
  ],
  'Pec Deck / Machine Flye': [
    'Elbows slightly below shoulder height.',
    'Squeeze the pads together and hold for a second.',
    'Open only to a comfortable stretch — no yanking.',
  ],
  'Cable Crossover (high to low)': [
    'Split stance, slight forward lean.',
    'Sweep the hands down and in to the hip line.',
    'Squeeze, then resist the return — don’t get pulled open.',
  ],
  'Cable Crossover (low to high)': [
    'Pulleys low; sweep up to eye line.',
    'Finish thumbs-up with the hands together.',
    'Upper-chest focus — keep the shoulders down.',
  ],
  'Cable Flye (mid)': [
    'Pulleys at chest height, slight forward lean.',
    'Hands meet at the sternum with soft elbows.',
    'Constant tension — control both directions.',
  ],
  'Chest Dip': [
    'Lean the torso forward ~30° with elbows slightly out.',
    'Lower to a stretch across the chest.',
    'Keep the neck long — don’t bury the chin.',
  ],
  'Weighted Chest Dip': [
    'Same forward lean with the belt weight hanging still.',
    'Control the descent — no bounce at the bottom.',
    'Keep depth honest: upper arm to about parallel.',
  ],
  'Svend Press': [
    'Squeeze the plates together hard — that squeeze IS the exercise.',
    'Press straight out at chest height.',
    'Return slowly without losing plate pressure.',
  ],
  'Landmine Press': [
    'Staggered stance, bar racked at the shoulder.',
    'Press up and forward along the bar’s natural arc.',
    'Brace the ribs down — don’t lean away from the bar.',
  ],
  'Smith Machine Bench Press': [
    'Set the safeties first.',
    'The bar path is fixed — position your body so elbows track ~45°.',
    'Treat it like paused reps; the machine hides momentum.',
  ],
  'Floor Press': [
    'Let the upper arms settle to the floor each rep — a dead pause.',
    'Press without bouncing the hips.',
    'Short range, big lockout focus.',
  ],

  // ---- BACK ----
  'Pull-Up': [
    'Start from a dead hang, avoid kipping.',
    'Drive the elbows down and back, chest to the bar.',
    'Control the eccentric — 2–3 seconds down.',
  ],
  'Chin-Up (supinated)': [
    'Supinated, shoulder-width grip.',
    'Lead with the chest to the bar.',
    'Ribs down — no wild swinging.',
  ],
  'Assisted Pull-Up (band/machine)': [
    'Same strict form as an unassisted pull-up.',
    'Pick assistance that allows 6–10 clean reps.',
    'Fight the negative — that’s where the strength builds.',
  ],
  'Lat Pulldown (wide)': [
    'Grip a little wider than the shoulders.',
    'Pull the bar to the upper chest, elbows driving to the hips.',
    'Don’t lean way back to cheat the weight down.',
  ],
  'Lat Pulldown (close/neutral)': [
    'Neutral close grip, elbows tight in front.',
    'Take a big stretch at the top of every rep.',
    'Pull to the collarbone, pause, control up.',
  ],
  'Straight-Arm Pulldown': [
    'Arms nearly straight, slight hip hinge.',
    'Sweep the bar to the thighs with the lats, not the triceps.',
    'Keep the shoulders away from the ears throughout.',
  ],
  'Barbell Bent-Over Row': [
    'Hinge to ~45° torso angle, flat back throughout.',
    'Pull to the lower ribcage, elbows close to the body.',
    'Avoid using momentum — control the negative.',
  ],
  'Pendlay Row': [
    'The bar starts dead on the floor every rep.',
    'Torso parallel to the floor, back set hard.',
    'Explode to the lower chest, then set it back down flat.',
  ],
  'T-Bar Row': [
    'Chest tall over the bar, hips back.',
    'Pull the handle to the sternum with elbows tight.',
    'No rebound out of the bottom.',
  ],
  'Dumbbell Single-Arm Row': [
    'Knee and hand braced on the bench, back flat.',
    'Pull to the hip pocket, not the armpit.',
    'Zero torso twist — the shoulders stay square.',
  ],
  'Chest-Supported Dumbbell Row': [
    'Chest glued to the pad — it never leaves.',
    'Row the elbows back and squeeze the blades.',
    'The pad kills momentum: embrace the strictness.',
  ],
  'Seated Cable Row (wide)': [
    'Pull to the upper chest with the elbows out.',
    'Hold the squeeze for a full second.',
    'Torso vertical — minimal rocking.',
  ],
  'Seated Cable Row (close)': [
    'Handle to the belly button, elbows tight.',
    'Stretch forward at the start while keeping the low back neutral.',
    'Drive the chest up to meet the handle.',
  ],
  'Machine Row (Hammer Strength)': [
    'Chest on the pad, feet planted.',
    'Let the blades protract for a full stretch.',
    'Row and pause at the pocket every rep.',
  ],
  'Inverted Row / Bodyweight Row': [
    'Rigid plank line from hips to heels.',
    'Pull the chest to the bar.',
    'Elevate the feet to make it harder.',
  ],
  'Meadows Row': [
    'Staggered stance beside the landmine.',
    'Wide grip on the bar sleeve, row to the hip.',
    'Take the big stretch at the bottom — that’s the magic.',
  ],
  'Deadlift (conventional)': [
    'Bar over mid-foot, shins close before the pull.',
    'Take the slack out of the bar, then drive the floor away.',
    'Keep the bar in contact with the legs on the way up.',
    'Lock out with glutes, not a lumbar hyperextension.',
  ],
  'Rack Pull': [
    'Set the pins just below the knee.',
    'Wedge the hips in exactly like a deadlift.',
    'Drag the bar up the thighs and finish with the glutes.',
  ],
  'Back Extension (hyperextension)': [
    'Hinge at the hips over the pad, not the spine.',
    'Rise to a straight line — no hyperextension at the top.',
    'Squeeze the glutes to finish.',
  ],
  'Weighted Back Extension': [
    'Hold the plate at the chest.',
    'Take three slow seconds down.',
    'Same straight-line finish — no whipping up.',
  ],
  'Face Pull': [
    'Set the rope at face height.',
    'Pull toward the eyes with the elbows high.',
    'Finish thumbs-back — the external rotation is the point.',
  ],
  'Shrug-to-Row Combo': [
    'Shrug straight up, then flow into a row with the elbows back.',
    'Keep the neck long and the chin level.',
    'Light weight, crisp tempo.',
  ],
  'Renegade Row': [
    'Push-up plank on the bells, feet wide.',
    'Row one bell without letting the hips twist.',
    'The anti-rotation is the exercise — slow it down.',
  ],

  // ---- SHOULDERS ----
  'Overhead Barbell Press (standing)': [
    'Brace the core and glutes to avoid a lumbar arch.',
    'Bar path travels straight up; move the head through at lockout.',
    'Finish with the bar stacked over mid-foot.',
  ],
  'Seated Barbell Press': [
    'Sit tall — don’t over-arch off the pad.',
    'Lower to chin height under control.',
    'Press to lockout directly over the ears.',
  ],
  'Dumbbell Shoulder Press': [
    'Bells at the shoulders, forearms vertical.',
    'Press up and slightly in.',
    'Lower to ear level under control.',
  ],
  'Arnold Press': [
    'Start palms facing you at chin height.',
    'Rotate outward as you press.',
    'Reverse the spiral on the way down.',
  ],
  'Machine Shoulder Press': [
    'Set the seat so the handles start at shoulder height.',
    'Drive up without shrugging into the ears.',
    'Stop just short of a harsh lockout.',
  ],
  'Dumbbell Lateral Raise': [
    'Lead with the elbows, slight fixed bend.',
    'Raise to shoulder height with the pinkie slightly up.',
    'No swinging — go lighter than your ego says.',
  ],
  'Cable Lateral Raise': [
    'Cable runs behind the body from the low pulley.',
    'Constant tension from bottom to top.',
    'Pause for a beat at parallel.',
  ],
  'Machine Lateral Raise': [
    'Pads at the elbows, seat adjusted so shoulders line up with the cam.',
    'Push out and up to parallel.',
    'Take the negative slow.',
  ],
  'Dumbbell Front Raise': [
    'Raise to eye line with the thumb slightly up.',
    'Don’t rock the torso for momentum.',
    'Alternate arms to stay strict.',
  ],
  'Plate Front Raise': [
    'Grip the plate at 3 and 9 o’clock.',
    'Raise to eye level with soft elbows.',
    'Lower under control — no dropping.',
  ],
  'Rear Delt Dumbbell Flye': [
    'Hinge flat, bells hanging under the chest.',
    'Open wide with the pinkies leading up.',
    'Stop at the shoulder line — no trap shrug.',
  ],
  'Reverse Pec Deck': [
    'Arms nearly straight, push the handles back.',
    'Lead with the rear delts, not a blade pinch.',
    'Pause one second at the back.',
  ],
  'Cable Rear Delt Flye': [
    'Cross the cables and pull out and back.',
    'Elbows soft, hands at shoulder height.',
    'Slow return — stay tensioned.',
  ],
  'Upright Row (barbell)': [
    'Grip just inside shoulder width.',
    'Pull the elbows — not the hands — to shoulder height.',
    'Stop the range if the wrists or shoulders pinch.',
  ],
  'Upright Row (cable)': [
    'Same elbow lead as the barbell version.',
    'Keep the bar close to the body.',
    'Constant tension — no jerking off the stack.',
  ],
  'Landmine Press (shoulder)': [
    'Half-kneeling or staggered stance.',
    'Press along the bar’s arc, not straight up.',
    'Ribs down — resist arching away from it.',
  ],
  'Pike Push-Up': [
    'Hips high, torso as vertical as possible.',
    'Lower the head between the hands toward the floor.',
    'Press back up to the pike — don’t drift forward.',
  ],
  'Handstand Push-Up': [
    'Kick to the wall with the body stacked.',
    'Lower the head to the mat with elbows ~45°.',
    'Press to full lockout — hollow body, no banana back.',
  ],
  'Behind-the-Neck Press': [
    'Only with proven shoulder mobility.',
    'Lower just to ear level, not all the way down.',
    'Strict tempo and moderate loads.',
  ],
  'Cable Y-Raise': [
    'Raise the arms up and out into a Y.',
    'Thumbs up, shoulders away from the ears.',
    'Go light and feel the lower traps do the work.',
  ],

  // ---- BICEPS ----
  'Barbell Curl': [
    'Pin the elbows at your sides.',
    'Curl without leaning back.',
    'Lower for 2–3 seconds to a fully straight arm.',
  ],
  'EZ-Bar Curl': [
    'Hands on the angled grips — easier on the wrists.',
    'Same pinned elbows as a straight bar.',
    'Squeeze hard at the top of every rep.',
  ],
  'Dumbbell Curl (alternating)': [
    'Supinate as you curl — pinkie turns up.',
    'One arm at a time, no rocking.',
    'Full stretch at the bottom of each rep.',
  ],
  'Hammer Curl': [
    'Neutral grip the whole way.',
    'Optionally curl slightly across the body.',
    'The slow lowering builds the forearms too.',
  ],
  'Incline Dumbbell Curl': [
    'Lie back 45–60° so the arms hang behind the body.',
    'That stretch is huge — start lighter than usual.',
    'Keep the shoulders pinned to the bench.',
  ],
  'Concentration Curl': [
    'Brace the elbow inside the thigh.',
    'Curl to the shoulder without the upper arm moving.',
    'Hold the peak squeeze for a second.',
  ],
  'Preacher Curl (barbell)': [
    'Armpits tight to the top of the pad.',
    'Never bounce out of the full stretch.',
    'Curl to the chin and lower slow.',
  ],
  'Preacher Curl (machine)': [
    'Adjust the seat so the armpits meet the pad.',
    'Use the full range in both directions.',
    'Let the machine keep you honest — no shortcuts.',
  ],
  'Cable Curl (straight bar)': [
    'Step back from the stack for tension at the bottom.',
    'Elbows stay at your sides.',
    'Constant tension — no resting at top or bottom.',
  ],
  'Cable Rope Hammer Curl': [
    'Neutral grip on the rope ends.',
    'Pull the rope slightly apart as you curl.',
    'Keep the wrists dead straight.',
  ],
  'Spider Curl': [
    'Chest down on an incline bench, arms hanging vertical.',
    'Strict curl — swinging is impossible here.',
    'Squeeze hard at the top.',
  ],
  'Zottman Curl': [
    'Curl up palms-up.',
    'Rotate palms-down at the top.',
    'Lower slowly pronated — the way down is the point.',
  ],
  'Chin-Up (biceps focus)': [
    'Shoulder-width supinated grip.',
    'Think “pull the hands to the shoulders.”',
    'Slow negatives grow arms.',
  ],
  '21s (barbell)': [
    'Seven bottom-half reps, seven top-half, seven full.',
    'No rest between the segments.',
    'Go lighter than your normal curl weight.',
  ],
  'Bayesian Cable Curl': [
    'Face away from the low pulley, arm trailing behind.',
    'Curl from that deep stretch position.',
    'Stay strict — the stretch does the work.',
  ],

  // ---- TRICEPS ----
  'Triceps Pushdown (rope)': [
    'Elbows pinned; split the rope at the bottom.',
    'Full lockout with the knuckles turning down.',
    'Don’t lean your bodyweight over the cable.',
  ],
  'Triceps Pushdown (bar)': [
    'Elbows at the sides the entire set.',
    'Wrists straight — push with the palms.',
    'Control back past 90° without the elbows drifting up.',
  ],
  'Overhead Cable Extension': [
    'Face away from the stack with arms overhead.',
    'Extend without flaring the elbows wide.',
    'Sink into a deep stretch behind the head each rep.',
  ],
  'Overhead Dumbbell Extension': [
    'Both palms under one bell.',
    'Lower behind the head to a full stretch.',
    'Elbows point forward, ribs stay down.',
  ],
  'Skull Crusher (EZ-bar)': [
    'Lower the bar to the hairline or just behind the head.',
    'Elbows fixed — no turning it into a press.',
    'End the set when the elbows complain, not after.',
  ],
  'Close-Grip Bench Press': [
    'Grip just inside shoulder width.',
    'Elbows tucked tight to the sides.',
    'Touch the low chest and press without flaring.',
  ],
  'Triceps Dip (bench)': [
    'Hands behind you on the bench, feet out front.',
    'Keep the hips close to the bench edge.',
    'Shoulders down — shrugging here is how they get hurt.',
  ],
  'Parallel Bar Dip': [
    'Upright torso keeps it on the triceps.',
    'Lock out completely at the top.',
    'Bend to ~90° — no deeper if the shoulders bark.',
  ],
  'Dumbbell Kickback': [
    'Torso parallel, upper arm frozen level with the back.',
    'Extend to dead straight and pause.',
    'Light weight, real lockout.',
  ],
  'Cable Kickback': [
    'Upper arm pinned to the side.',
    'Strict extension with constant cable tension.',
    'Pause at full lockout each rep.',
  ],
  'Diamond Push-Up': [
    'Hands form a triangle under the chest.',
    'Elbows track straight back.',
    'Same rigid plank rules as any push-up.',
  ],
  'Machine Triceps Extension': [
    'Elbows set on the pad at the right depth.',
    'Extend fully, return under control.',
    'Don’t let the shoulders creep up as you fatigue.',
  ],
  'JM Press': [
    'Hybrid path — the bar tracks to the chin/neck line.',
    'Elbows stay tucked and high.',
    'Moderate load; the groove matters more than weight.',
  ],
  'Tate Press': [
    'Bells over the chest; lower the plates inward to the sternum.',
    'Elbows stay out — it should look like a butterfly closing.',
    'Press back up along the same path, slow and controlled.',
  ],

  // ---- FOREARMS & GRIP ----
  'Wrist Curl (barbell)': [
    'Forearms on the thighs or bench, palms up.',
    'Curl the wrist through its full range.',
    'Let the bar roll to the fingertips for an extra stretch.',
  ],
  'Reverse Wrist Curl': [
    'Palms down, forearms braced.',
    'Lift the knuckles up slowly.',
    'Much lighter than regular wrist curls — respect that.',
  ],
  'Reverse Barbell Curl': [
    'Palms-down grip, elbows pinned.',
    'Wrists straight — no flicking at the top.',
    'Builds the brachioradialis; expect humbling weights.',
  ],
  "Farmer's Carry": [
    'Heavy handles, shoulders packed down and back.',
    'Walk tall with the ribs stacked over the hips.',
    'Grip to near-failure but never to a stagger.',
  ],
  'Dead Hang': [
    'Full grip on the bar, shoulders slightly engaged.',
    'Breathe and accumulate time — build toward 60s+.',
    'Finish a hang with a few active scap pulls.',
  ],
  'Plate Pinch': [
    'Pinch smooth plates between fingers and thumb.',
    'Stand tall; time the holds.',
    'Add seconds before you add weight.',
  ],
  'Wrist Roller': [
    'Arms out, roll the weight all the way up.',
    'Wind it both directions — flexors and extensors.',
    'A small plate is brutal; start there.',
  ],
  'Cable Wrist Curl': [
    'Low pulley, forearm braced on a bench.',
    'Move only the wrist.',
    'Constant cable tension beats free weights here.',
  ],

  // ---- QUADRICEPS ----
  'Bodyweight Squat': [
    'Feet shoulder-width, toes slightly out.',
    'Sit down between the hips with the chest tall.',
    'Full depth with the heels planted.',
  ],
  'Barbell Back Squat': [
    'Brace hard before the descent — 360° of air pressure.',
    'Break at the hips and knees together, track knees over toes.',
    'Hit depth (hip crease below knee) without losing the arch.',
    'Drive up through the whole foot, not just the heels.',
  ],
  'Barbell Front Squat': [
    'Bar rides on the front delts with elbows high.',
    'Torso stays vertical the whole rep.',
    'Drop the hips straight down between the heels.',
  ],
  'Goblet Squat': [
    'Hold the bell tight to the chest.',
    'Elbows track inside the knees at the bottom.',
    'The best depth teacher there is — pause down there.',
  ],
  'Hack Squat (machine)': [
    'Back flat on the pad, feet mid-platform.',
    'Lower to a deep knee bend.',
    'Drive through the whole foot; don’t slam the lockout.',
  ],
  'Leg Press': [
    'Feet shoulder width, mid-platform.',
    'Lower until the knees reach ~90° without the low back rounding off the pad.',
    'Drive through the full foot; avoid slamming the knees at lockout.',
  ],
  'Leg Extension': [
    'Pad just above the ankle.',
    'Extend to full lockout and squeeze for a second.',
    'Lower slow — never let the stack slam.',
  ],
  'Bulgarian Split Squat': [
    'Rear foot laced on the bench behind you.',
    'Drop the back knee straight down.',
    'Front heel drives; a slight forward lean shifts it to the glute.',
  ],
  'Walking Lunge': [
    'Long strides with the knee tracking over the toes.',
    'Back knee kisses the floor.',
    'Push off the front heel into the next step.',
  ],
  'Reverse Lunge': [
    'Step back and drop the knee under the hip.',
    'Front shin stays vertical.',
    'Easier on the knees than forward lunges.',
  ],
  'Step-Up': [
    'Whole foot on a knee-height box.',
    'Drive through the top leg only — no push off the floor.',
    'Control the way down; don’t drop.',
  ],
  'Smith Machine Squat': [
    'Set the feet slightly forward of the bar.',
    'Sit into the fixed path.',
    'Great for burnout work — not a back-squat replacement.',
  ],
  'Sissy Squat': [
    'Knees travel far forward while the hips stay extended.',
    'Body forms one line from knees to head.',
    'Hold support and keep the range short at first — the quad stretch is intense.',
  ],
  'Box Squat': [
    'Sit fully to the box and pause — no rocking.',
    'Shins vertical, hips pushed back.',
    'Explode up without leaning into momentum.',
  ],
  'Pause Squat': [
    'Two to three seconds dead in the hole.',
    'Stay braced — never relax down there.',
    'Drive up with zero bounce.',
  ],

  // ---- HAMSTRINGS ----
  'Romanian Deadlift (barbell)': [
    'Soft knee bend, hinge from the hips.',
    'Bar stays close; feel the hamstring stretch at mid-shin.',
    'Squeeze the glutes to reverse — don’t round the low back.',
  ],
  'Dumbbell RDL': [
    'Same hinge with the bells tracing the thighs.',
    'Bells stay against the legs, never drifting forward.',
    'Stretch to mid-shin at most.',
  ],
  'Stiff-Leg Deadlift': [
    'Knees nearly straight — just soft.',
    'More forward reach means more stretch.',
    'Lighter than RDLs, slower tempo.',
  ],
  'Lying Leg Curl': [
    'Hips pressed into the pad the whole set.',
    'Curl the heels to the glutes.',
    'Three seconds down — don’t let the hips pop up.',
  ],
  'Seated Leg Curl': [
    'Back tight to the pad, thighs clamped.',
    'Curl under and hold the squeeze.',
    'Better stretch than the lying version — use all of it.',
  ],
  'Nordic Hamstring Curl': [
    'Knees anchored; fall forward as slowly as possible.',
    'Catch with the hands and push back lightly.',
    'Fight for every degree of the descent.',
  ],
  'Good Morning': [
    'Bar high on the back; hinge to ~45° or deeper.',
    'Knees soft, hips shooting back.',
    'Return by driving the hips forward, not lifting the chest.',
  ],
  'Glute-Ham Raise': [
    'Toes pressed into the plate, knees on the pad.',
    'Curl the body up with the hamstrings.',
    'Hips stay extended — no jackknifing.',
  ],
  'Cable Pull-Through': [
    'Face away with the rope between the legs.',
    'Hinge — don’t squat.',
    'Snap the hips through and squeeze the glutes.',
  ],
  'Single-Leg RDL': [
    'Hinge on one leg with the rear leg reaching back.',
    'Keep the hips square to the floor.',
    'Touch the weight to mid-shin and drive through the heel.',
  ],
  'Kettlebell Swing': [
    'It’s a hinge — not a squat.',
    'Snap the hips; the arms are just ropes.',
    'The bell floats to chest height and rides back high between the legs.',
  ],

  // ---- GLUTES ----
  'Barbell Hip Thrust': [
    'Shoulder blades on the bench, drive through the heels.',
    'Chin tucked and ribs down at the top.',
    'Full lockout with a one-second glute squeeze.',
  ],
  'Glute Bridge (bodyweight)': [
    'Heels close to the hips.',
    'Push the floor away and squeeze at the top.',
    'Don’t arch the lower back to fake extra range.',
  ],
  'Machine Hip Thrust': [
    'Pad across the hips, back set on the bench.',
    'Reach full extension every rep.',
    'Slow negatives keep the tension on.',
  ],
  'Cable Kickback (glute)': [
    'Slight hinge, kick the leg back and up.',
    'Squeeze the glute — no lower-back arch.',
    'Small strict arc beats a big sloppy one.',
  ],
  'Hip Abduction Machine': [
    'Sit tall (lean forward slightly for upper glute).',
    'Push the knees apart and pause.',
    'Slow return — never let it slam shut.',
  ],
  'Banded Lateral Walk': [
    'Band at the knees or ankles, quarter-squat height.',
    'Step wide and keep band tension always.',
    'Don’t drag the trailing foot.',
  ],
  'Sumo Deadlift': [
    'Wide stance, toes out, shins vertical.',
    'Wedge the hips low with the chest tall.',
    'Push the floor apart and drive the hips through.',
  ],
  'Curtsy Lunge': [
    'Step behind and across the body.',
    'Front knee keeps tracking over the toes.',
    'Feel the outer glute — go light.',
  ],
  'Frog Pump': [
    'Soles of the feet together, knees flared out.',
    'Pump the hips up with a hard glute squeeze.',
    'High reps, constant tension.',
  ],
  'Single-Leg Hip Thrust': [
    'One foot planted, the other leg held up.',
    'Hips stay square — no dipping to one side.',
    'Full lockout every rep.',
  ],
  'Step-Up (glute focus)': [
    'Use a higher box with a slight forward lean.',
    'Drive through the heel.',
    'Squeeze the glute standing fully tall at the top.',
  ],

  // ---- CALVES ----
  'Standing Calf Raise (machine)': [
    'Pause in the full stretch at the bottom.',
    'Rise to tiptoe and hold for a second.',
    'Straight knees keep it on the gastrocnemius.',
  ],
  'Seated Calf Raise': [
    'The bent knee targets the soleus.',
    'Same rules: pause the stretch, pause the top.',
    'Slow beats heavy on calves.',
  ],
  'Standing Calf Raise (dumbbell)': [
    'One hand for support, the bell in the other.',
    'Single leg on a step for full range.',
    'Strict pauses at both ends.',
  ],
  'Leg Press Calf Raise': [
    'Balls of the feet low on the platform.',
    'Knees nearly straight throughout.',
    'Never let the heels crash downward.',
  ],
  'Single-Leg Calf Raise': [
    'Full bodyweight on one side.',
    'Use the wall for balance only, not assistance.',
    'Add a dumbbell once 15+ reps are clean.',
  ],
  'Smith Machine Calf Raise': [
    'Bar on the shoulders, toes on a block.',
    'Deep stretch to a tall finish.',
    'Keep the knee position consistent rep to rep.',
  ],
  'Donkey Calf Raise': [
    'Hinge over the pad with the hips back.',
    'The hip position adds stretch — use it.',
    'A classic for a reason: pause at the bottom.',
  ],
  'Tibialis Raise': [
    'Heels on the ground or a step edge; lift the toes.',
    'Slow reps until the shins burn.',
    'Balances out all the calf raise volume.',
  ],

  // ---- ABS & CORE ----
  'Plank': [
    'Stack the shoulders over the elbows; brace like taking a punch.',
    'Straight line from head to heels — squeeze glutes and quads.',
    'End the set when the hips sag, not the clock.',
  ],
  'Side Plank': [
    'Elbow under the shoulder, feet stacked.',
    'Lift the hips to one straight line.',
    'Top arm up or on the hip — don’t roll forward.',
  ],
  'Crunch': [
    'Curl the ribs toward the hips, not the neck to the chest.',
    'Exhale on the way up and hold the squeeze.',
    'Lower one vertebra at a time.',
  ],
  'Bicycle Crunch': [
    'Opposite elbow to knee, slowly.',
    'Fully extend the other leg each time.',
    'Rotate from the ribs — not flapping elbows.',
  ],
  'Hanging Leg Raise': [
    'Raise straight legs to parallel or higher.',
    'Kill the swing between reps.',
    'Curl the pelvis up at the top for the lower abs.',
  ],
  'Hanging Knee Raise': [
    'Knees to the chest with the pelvis curling.',
    'Lower slowly to a dead hang.',
    'The stepping stone to straight-leg raises.',
  ],
  'Cable Crunch': [
    'Kneel with the rope held behind the head.',
    'Crunch the ribs to the pelvis — the hips stay still.',
    'Flex the spine; don’t just sit back.',
  ],
  'Ab Wheel Rollout': [
    'Start from the knees with the hips pushed forward.',
    'Roll out only as far as the back stays flat.',
    'Pull back with the abs, not the arms.',
  ],
  'Russian Twist': [
    'Lean back 45° with a proud chest.',
    'Rotate the shoulders fully side to side.',
    'Feet down is easier; feet up is harder.',
  ],
  'Mountain Climber': [
    'The plank stays rigid throughout.',
    'Drive the knees fast without bouncing the hips.',
    'Shoulders stay stacked over the wrists.',
  ],
  'Dead Bug': [
    'Press the low back into the floor and keep it there.',
    'Opposite arm and leg reach out slowly.',
    'Exhale as the limbs extend.',
  ],
  'Leg Raise (lying)': [
    'Hands under the hips if needed.',
    'Legs to vertical, then lower slow.',
    'Stop the descent where the back starts to arch.',
  ],
  'Decline Sit-Up': [
    'Anchor the feet, arms crossed on the chest.',
    'Curl up smoothly — never yank the neck.',
    'Hold a plate at the chest to progress.',
  ],
  'Pallof Press': [
    'Cable at chest height; press straight out.',
    'Resist the rotation — that resistance is the rep.',
    'Hold three seconds pressed, controlled return.',
  ],
  'Toes-to-Bar': [
    'Hang with active shoulders, lats pulling down.',
    'Lift the toes all the way to the bar.',
    'Small kip or strict — but always controlled.',
  ],
  'Woodchopper (cable)': [
    'Rotate high-to-low across the body.',
    'Arms stay mostly straight; pivot the back foot.',
    'Power comes from the hips, not the arms.',
  ],
  'Hollow Body Hold': [
    'Weld the low back to the floor.',
    'Arms and legs long, ribs pulled down.',
    'Scale by tucking the knees in.',
  ],

  // ---- TRAPS & NECK ----
  'Barbell Shrug': [
    'Shoulders straight up toward the ears.',
    'Hold the top for a full second.',
    'No rolling — straight up, straight down.',
  ],
  'Dumbbell Shrug': [
    'Bells at the sides.',
    'Shrug up and slightly back.',
    'Long neck, level chin.',
  ],
  'Cable Shrug': [
    'Constant tension from the low pulley.',
    'Strict pause at the top.',
    'Stretch at the bottom without slouching forward.',
  ],
  'Trap Bar Shrug': [
    'Neutral handles put the load in a natural line.',
    'Big weights are fine — form stays strict.',
    'Hold the peak for one to two seconds.',
  ],
  "Farmer's Carry (trap)": [
    'Heavy carry — the traps load isometrically.',
    'Walk tall; no active shrugging needed.',
    'Work to time or distance targets.',
  ],
  'Neck Curl (plate)': [
    'Lie face-up with a towel-wrapped plate on the forehead.',
    'Nod the chin toward the chest slowly.',
    'Tiny range, tiny loads, maximum care.',
  ],
  'Neck Extension': [
    'Face-down with the plate on the back of the head.',
    'Lift the head slowly to neutral and slightly past.',
    'Never jerk — build this up gradually.',
  ],

  // ---- FULL-BODY & COMPOUND ----
  'Clean & Press': [
    'Clean the bar to the front rack and stand fully.',
    'Dip-drive into the press overhead.',
    'Reset each rep — no rushed cycling.',
  ],
  'Power Clean': [
    'Bar close; explode through the hips.',
    'Catch high on the shoulders with the elbows whipping through.',
    'Stand completely before dropping the bar.',
  ],
  'Snatch': [
    'Wide grip; the bar travels overhead in one motion.',
    'Punch under and catch in the squat.',
    'Mobility and coaching first — this is the most technical lift.',
  ],
  'Thruster': [
    'Front squat flowing straight into a press.',
    'The legs power the bar — arms finish it.',
    'Breathe at the top of every rep.',
  ],
  'Turkish Get-Up': [
    'Eyes on the bell the entire way up.',
    'Each position is a checkpoint — own it before moving.',
    'Slow is the point.',
  ],
  'Burpee': [
    'Chest to the floor, snap the hips back to the feet.',
    'Jump and open the hips fully at the top.',
    'A steady rhythm beats sprint-and-die.',
  ],
  'Kettlebell Clean': [
    'The bell spirals around the wrist — no banging.',
    'Elbow lands tight to the ribs in the rack.',
    'Hips power it; the arm just guides.',
  ],
  "Devil's Press": [
    'A dumbbell burpee into a double swing-snatch overhead.',
    'Brace before every lift-off the floor.',
    'Pick a pace you can actually sustain.',
  ],
  'Trap Bar Deadlift': [
    'Stand centered with a neutral grip.',
    'Push the floor away — hips and knees extend together.',
    'The friendliest deadlift to learn; still brace hard.',
  ],
  'Bear Crawl': [
    'Knees hover two inches off the floor.',
    'Opposite hand and foot move together.',
    'Hips stay level like a tabletop.',
  ],
  'Wall Ball': [
    'Squat to full depth with the ball at the chest.',
    'Drive up and throw to the target in one flow.',
    'Catch soft and sink straight into the next rep.',
  ],
};
