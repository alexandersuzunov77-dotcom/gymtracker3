// Demo images for the Exercise Library — illustrated silhouette figures.
// Every exercise maps to one of ~38 movement-pattern poses rendered as a
// weighted-limb silhouette (capsule limbs, filled torso/head, dimmed far side)
// with detailed equipment and a floor shadow. Self-contained inline SVG.

const BODY = '#cfd8e6';
const DIM = '#727c8c';
const METAL = '#8b95a5';
const IRON = '#454e5c';
const IRON_RIM = '#5a6473';

const W = { torso: 13, leg: 10, arm: 8 };

const pline = (pts, stroke, w) =>
  `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ln = (x1, y1, x2, y2, stroke = IRON, w = 4, dash = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const ci = (x, y, r, stroke = METAL, fill = 'none', w = 4) =>
  `<circle cx="${x}" cy="${y}" r="${r}" stroke="${stroke}" fill="${fill}" stroke-width="${w}"/>`;
const box = (x, y, w, h, fill = IRON, rx = 2.5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const shadow = (cx, rx) => `<ellipse cx="${cx}" cy="141" rx="${rx}" ry="4.5" fill="rgba(0,0,0,.45)"/>`;
const ground = () => ln(26, 142, 214, 142, '#20262f', 2.5);

// limb chain helpers — L = front (body color), B = far side (dim)
const L = (pts, w = W.leg) => pline(pts, BODY, w);
const A = (pts) => pline(pts, BODY, W.arm);
const Lb = (pts, w = W.leg) => pline(pts, DIM, w);
const Ab = (pts) => pline(pts, DIM, W.arm);
const T = (pts) => pline(pts, BODY, W.torso);
const head = (x, y) => `<circle cx="${x}" cy="${y}" r="7.5" fill="${BODY}"/>`;

// ---- equipment ----
function grip(eq, x, y, vertical = false) {
  if (eq === 'db') {
    return vertical
      ? ln(x, y - 5, x, y + 5, METAL, 3.5) + box(x - 4, y - 11, 8, 7, IRON) + box(x - 4, y + 4, 8, 7, IRON)
      : ln(x - 5, y, x + 5, y, METAL, 3.5) + box(x - 11, y - 4, 7, 8, IRON) + box(x + 4, y - 4, 7, 8, IRON);
  }
  if (eq === 'kb') return `<circle cx="${x}" cy="${y + 8}" r="7" fill="${IRON}" stroke="${IRON_RIM}" stroke-width="2"/>` + pline([[x - 4.5, y + 2], [x, y - 3], [x + 4.5, y + 2]], METAL, 3.5);
  if (eq === 'plate') return ci(x, y, 8.5, IRON_RIM, IRON, 3) + ci(x, y, 2.5, METAL, METAL, 2);
  if (eq === 'ball') return ci(x, y, 9.5, IRON_RIM, IRON, 3);
  return '';
}
// side-view loaded barbell (plate + hub + bar stub)
const barSide = (x, y) => ln(x - 12, y, x + 12, y, METAL, 3.5) + ci(x, y, 10.5, IRON_RIM, IRON, 3) + ci(x, y, 3, METAL, METAL, 2);
// front-view barbell with stacked plates
const barFront = (x1, x2, y) =>
  ln(x1 - 14, y, x2 + 14, y, METAL, 4) +
  box(x1 - 4, y - 11, 7, 22) + box(x1 - 12, y - 8, 6, 16) +
  box(x2 - 3, y - 11, 7, 22) + box(x2 + 6, y - 8, 6, 16);
const pulley = (x, y) => ci(x, y, 3.5, METAL, '#2a303c', 2.5);
const cable = (ax, ay, hx, hy) => ln(ax, ay, hx, hy, '#7b8494', 1.8) + pulley(ax, ay);
const benchPad = (x, y, w) => box(x, y, w, 8, IRON, 4) + ln(x + 3, y + 1.5, x + w - 3, y + 1.5, IRON_RIM, 2);

// standing figure base
const stand = (cx) => [
  shadow(cx, 30),
  Lb([[cx, 88], [cx - 6, 112], [cx - 8, 135], [cx - 14, 136]]),
  L([[cx, 88], [cx + 6, 112], [cx + 8, 135], [cx + 15, 136]]),
  T([[cx, 92], [cx, 52]]),
  head(cx, 42),
].join('');

// hinged/bent-over figure base
const hinged = () => [
  shadow(122, 38),
  Lb([[104, 88], [106, 114], [100, 136], [94, 137]]),
  L([[104, 88], [114, 112], [110, 136], [117, 137]]),
  T([[102, 92], [140, 62]]),
  head(150, 55),
].join('');

const POSES = {
  overheadPress(eq) {
    const p = [stand(120), Ab([[120, 58], [106, 44], [102, 28]]), A([[120, 58], [134, 44], [138, 28]])];
    if (eq === 'ball') p.push(ci(120, 19, 10.5, IRON_RIM, IRON, 3));
    else if (eq === 'db' || eq === 'kb') p.push(grip(eq, 102, 25), grip(eq, 138, 25));
    else p.push(barFront(94, 146, 25));
    return p.join('');
  },
  lateralRaise(eq) {
    const p = [stand(120), Ab([[120, 58], [94, 56], [72, 52]]), A([[120, 58], [146, 56], [168, 52]])];
    if (eq === 'cable') p.push(cable(36, 138, 168, 52));
    else if (eq === 'db') p.push(grip('db', 72, 52, true), grip('db', 168, 52, true));
    return p.join('');
  },
  frontRaise(eq) {
    return [stand(120), Ab([[120, 58], [112, 74], [110, 90]]), A([[120, 58], [142, 54], [164, 50]]),
      grip(eq === 'plate' ? 'plate' : eq, 167, 50, true)].join('');
  },
  curl(eq) {
    const p = [stand(120), Ab([[120, 58], [108, 76], [104, 58]]), A([[120, 58], [132, 76], [136, 58]])];
    if (eq === 'cable') p.push(cable(174, 138, 138, 58), ln(126, 57, 148, 57, METAL, 4));
    else if (eq === 'db' || eq === 'kb' || eq === 'plate') p.push(grip(eq, 104, 57), grip(eq, 136, 57));
    else p.push(ln(90, 57, 150, 57, METAL, 4), box(84, 48, 7, 18), box(149, 48, 7, 18));
    return p.join('');
  },
  pushdown() {
    return [stand(112), Ab([[112, 58], [126, 72], [128, 90]]), A([[112, 58], [130, 74], [134, 92]]),
      cable(152, 14, 134, 90), ln(120, 92, 150, 88, METAL, 4.5)].join('');
  },
  overheadTriExt(eq) {
    return [stand(120), Ab([[120, 58], [106, 54], [102, 70]]), A([[120, 58], [134, 40], [118, 28]]),
      eq === 'cable' ? cable(200, 126, 120, 30) : grip('db', 114, 24, true)].join('');
  },
  shrug(eq) {
    const p = [stand(120), Ab([[120, 58], [108, 76], [106, 94]]), A([[120, 58], [132, 76], [134, 94]])];
    if (eq === 'db' || eq === 'kb') p.push(grip(eq, 106, 98), grip(eq, 134, 98));
    else if (eq === 'cable') p.push(cable(60, 138, 106, 96), cable(180, 138, 134, 96));
    else p.push(barFront(98, 142, 97));
    return p.join('');
  },
  squat(eq) {
    const p = [
      shadow(126, 34),
      Lb([[110, 96], [128, 108], [122, 136], [130, 137]]),
      L([[110, 96], [136, 104], [132, 136], [140, 137]]),
      T([[108, 98], [118, 62]]),
      head(124, 49),
    ];
    if (eq === 'none') p.push(Ab([[118, 64], [140, 62], [158, 60]]));
    else if (eq === 'db' || eq === 'kb' || eq === 'plate' || eq === 'ball') {
      p.push(A([[118, 64], [132, 72], [136, 80]]), grip(eq === 'db' ? 'kb' : eq, 138, 84));
    } else p.push(A([[118, 64], [132, 68], [124, 58]]), barSide(111, 56));
    return p.join('');
  },
  hinge(eq) {
    const p = [hinged(), Ab([[136, 66], [140, 88], [142, 104]]), A([[138, 64], [144, 86], [146, 104]])];
    if (eq === 'db' || eq === 'kb') p.push(grip(eq, 146, 109));
    else p.push(barSide(146, 109));
    return p.join('');
  },
  kbSwing(eq) {
    return [hinged(), Ab([[136, 66], [154, 74], [172, 82]]), A([[138, 64], [158, 72], [176, 80]]),
      eq === 'cable' ? cable(32, 136, 176, 80) : '', grip('kb', 179, 84)].join('');
  },
  rowBent(eq) {
    const p = [hinged(), Ab([[134, 66], [136, 84], [130, 94]]), A([[138, 64], [142, 84], [136, 96]])];
    if (eq === 'cable') p.push(cable(210, 122, 136, 98), ln(126, 98, 148, 96, METAL, 4.5));
    else if (eq === 'db' || eq === 'kb') p.push(grip(eq, 136, 101));
    else p.push(barSide(136, 101));
    return p.join('');
  },
  benchPress(eq) {
    const p = [
      shadow(112, 52),
      benchPad(60, 96, 94), ln(72, 104, 72, 136, IRON, 5), ln(142, 104, 142, 136, IRON, 5),
      head(74, 87),
      T([[86, 92], [124, 94]]),
      L([[124, 94], [142, 106], [148, 134], [156, 135]]),
      Ab([[88, 92], [90, 72], [93, 55]]),
      A([[92, 92], [95, 72], [98, 54]]),
    ];
    p.push(eq === 'db' ? grip('db', 98, 50) : barSide(98, 49));
    return p.join('');
  },
  inclinePress(eq) {
    const p = [
      shadow(120, 48),
      ln(84, 72, 134, 104, IRON, 8), ln(110, 104, 110, 138, IRON, 5), ln(134, 104, 148, 104, IRON, 6),
      head(89, 59),
      T([[98, 68], [128, 96]]),
      L([[128, 96], [148, 102], [152, 134], [160, 135]]),
      Ab([[102, 70], [108, 52], [113, 38]]),
      A([[104, 70], [112, 52], [118, 36]]),
    ];
    p.push(eq === 'db' ? grip('db', 118, 32) : barSide(119, 31));
    return p.join('');
  },
  cableCross() {
    return [stand(104), Ab([[104, 58], [124, 64], [144, 68]]), A([[104, 58], [126, 60], [148, 62]]),
      cable(208, 18, 148, 62), cable(208, 116, 144, 68)].join('');
  },
  rearDelt(eq) {
    return [hinged(),
      Ab([[134, 66], [116, 74], [100, 80]]),
      A([[138, 64], [154, 74], [170, 80]]),
      eq === 'db' ? grip('db', 170, 83, true) + grip('db', 100, 83, true) : '',
      eq === 'cable' ? cable(208, 20, 170, 80) : ''].join('');
  },
  pushUp() {
    return [shadow(116, 52), head(64, 97),
      T([[76, 103], [114, 111]]),
      L([[114, 111], [136, 122], [156, 137]]),
      Ab([[78, 104], [70, 122], [78, 138]]),
      A([[80, 104], [74, 122], [84, 138]])].join('');
  },
  plank() {
    return [shadow(116, 52), head(66, 101),
      T([[80, 107], [118, 110]]),
      L([[118, 110], [140, 122], [160, 137]]),
      A([[80, 107], [70, 131], [92, 135]])].join('');
  },
  quadruped(eq) {
    return [shadow(112, 46), head(70, 89),
      T([[84, 95], [126, 94]]),
      A([[84, 95], [82, 116], [80, eq === 'wheel' ? 124 : 136]]),
      Lb([[126, 94], [134, 116], [142, 137]]),
      L([[126, 94], [140, 114], [150, 137]]),
      eq === 'wheel' ? ci(80, 132, 8, IRON_RIM, IRON, 3) + ln(74, 132, 86, 132, METAL, 3) : ''].join('');
  },
  dip() {
    return [shadow(120, 40),
      ln(88, 78, 88, 140, IRON, 6), ln(152, 78, 152, 140, IRON, 6),
      ln(74, 78, 102, 78, METAL, 5), ln(138, 78, 166, 78, METAL, 5),
      head(120, 41),
      T([[120, 50], [120, 90]]),
      Ab([[120, 54], [104, 66], [90, 77]]),
      A([[120, 54], [136, 66], [150, 77]]),
      Lb([[120, 90], [112, 112], [120, 126]]),
      L([[120, 90], [128, 112], [136, 126]])].join('');
  },
  pullUp() {
    return [shadow(120, 30),
      ln(60, 26, 180, 26, METAL, 5),
      head(120, 47),
      T([[120, 56], [120, 96]]),
      Ab([[120, 58], [104, 44], [98, 28]]),
      A([[120, 58], [136, 44], [142, 28]]),
      Lb([[120, 96], [112, 116], [108, 132]]),
      L([[120, 96], [128, 116], [124, 132]])].join('');
  },
  hangingLegRaise() {
    return [shadow(130, 30),
      ln(60, 26, 180, 26, METAL, 5),
      head(120, 47),
      T([[120, 56], [120, 94]]),
      Ab([[120, 58], [106, 44], [102, 28]]),
      A([[120, 58], [134, 44], [138, 28]]),
      Lb([[120, 94], [144, 86], [166, 84]]),
      L([[120, 94], [146, 92], [168, 90]])].join('');
  },
  pulldown() {
    return [shadow(120, 40),
      benchPad(92, 106, 38), ln(108, 114, 108, 138, IRON, 5),
      head(106, 45),
      T([[112, 100], [109, 58]]),
      L([[112, 98], [140, 96], [142, 134], [150, 135]]),
      Ab([[110, 60], [96, 46], [92, 32]]),
      A([[110, 60], [124, 44], [130, 30]]),
      ln(78, 30, 146, 26, METAL, 4.5),
      cable(126, 8, 112, 28)].join('');
  },
  seatedRow() {
    return [shadow(122, 44),
      benchPad(82, 104, 52),
      head(96, 49),
      T([[104, 102], [100, 62]]),
      L([[104, 100], [136, 92], [160, 102]]),
      box(160, 84, 9, 24),
      Ab([[100, 64], [118, 78], [132, 76]]),
      A([[100, 64], [122, 74], [136, 72]]),
      ln(210, 72, 140, 72, '#7b8494', 1.8), pulley(210, 72),
      ln(136, 65, 140, 81, METAL, 4.5)].join('');
  },
  legPress() {
    return [shadow(110, 46),
      ln(58, 74, 94, 108, IRON, 9),
      benchPad(84, 108, 40),
      head(61, 63),
      T([[72, 80], [96, 104]]),
      Lb([[96, 104], [120, 90], [142, 74]]),
      L([[96, 104], [124, 84], [146, 66]]),
      ln(142, 50, 166, 84, IRON, 8),
      Ab([[76, 84], [90, 96], [96, 92]])].join('');
  },
  legExt() {
    return [shadow(116, 42),
      benchPad(88, 94, 48), ln(88, 60, 92, 94, IRON, 7), ln(112, 102, 112, 138, IRON, 5),
      head(98, 45),
      T([[106, 94], [102, 58]]),
      Lb([[106, 92], [134, 94], [150, 100]]),
      L([[106, 92], [138, 92], [164, 80]]),
      ci(158, 84, 5.5, IRON_RIM, IRON, 3),
      Ab([[103, 62], [114, 78], [110, 92]])].join('');
  },
  legCurl() {
    return [shadow(118, 52),
      benchPad(64, 100, 108), ln(82, 108, 82, 136, IRON, 5), ln(152, 108, 152, 136, IRON, 5),
      head(62, 91),
      T([[74, 97], [126, 99]]),
      L([[126, 99], [150, 101], [144, 74]]),
      ci(147, 79, 5.5, IRON_RIM, IRON, 3),
      Ab([[78, 99], [84, 116], [92, 124]])].join('');
  },
  lunge(eq) {
    const p = [
      shadow(118, 44),
      Lb([[116, 90], [100, 118], [84, 135], [78, 133]]),
      L([[116, 90], [144, 104], [144, 136], [152, 137]]),
      T([[116, 92], [116, 54]]),
      head(116, 43),
      Ab([[116, 58], [104, 76], [102, 92]]),
      A([[116, 58], [128, 76], [130, 92]]),
    ];
    if (eq === 'bar') p.push(barSide(113, 51));
    else p.push(grip(eq, 102, 97), grip(eq, 130, 97));
    return p.join('');
  },
  calfRaise(eq) {
    const p = [
      shadow(120, 34),
      box(94, 130, 54, 11, IRON, 3),
      Lb([[120, 80], [114, 104], [110, 127]]),
      L([[120, 80], [122, 104], [118, 127]]),
      T([[120, 84], [120, 48]]),
      head(120, 37),
      Ab([[120, 50], [108, 68], [106, 84]]),
      A([[120, 50], [132, 68], [134, 84]]),
    ];
    if (eq === 'bar' || eq === 'machine') p.push(barSide(117, 44));
    else if (eq === 'db' || eq === 'kb') p.push(grip(eq, 134, 88), grip(eq, 106, 88));
    return p.join('');
  },
  crunch() {
    return [shadow(116, 44), head(84, 109),
      T([[92, 117], [112, 130]]),
      L([[112, 130], [134, 108], [148, 133], [156, 133]]),
      Ab([[94, 119], [110, 111], [120, 107]])].join('');
  },
  bridge(eq) {
    return [shadow(110, 48),
      benchPad(52, 88, 34), ln(58, 96, 58, 126, IRON, 5), ln(80, 96, 80, 126, IRON, 5),
      head(61, 83),
      T([[76, 90], [118, 84]]),
      Lb([[118, 84], [136, 100], [132, 137]]),
      L([[118, 84], [142, 98], [142, 137]]),
      eq === 'bar' || eq === 'machine' ? barSide(114, 76) : ''].join('');
  },
  backExt() {
    return [shadow(118, 44),
      benchPad(96, 94, 38), ln(112, 102, 112, 138, IRON, 6),
      Lb([[112, 96], [142, 100], [166, 108]]),
      T([[114, 96], [84, 78]]),
      head(74, 69),
      Ab([[88, 82], [96, 92]])].join('');
  },
  twist(eq) {
    return [shadow(120, 40), head(90, 79),
      T([[98, 91], [116, 124]]),
      L([[116, 124], [140, 106], [158, 112]]),
      A([[102, 96], [124, 96], [138, 100]]),
      grip(eq && eq !== 'none' && eq !== 'cable' ? eq : 'plate', 144, 100)].join('');
  },
  carry(eq) {
    const kind = eq && eq !== 'none' && eq !== 'machine' ? eq : 'kb';
    return [
      shadow(120, 36),
      Lb([[120, 88], [104, 112], [92, 136], [86, 134]]),
      L([[120, 88], [134, 112], [146, 135], [154, 136]]),
      T([[120, 92], [120, 52]]),
      head(120, 42),
      Ab([[120, 58], [108, 76], [106, 94]]),
      A([[120, 58], [132, 76], [134, 94]]),
      grip(kind, 106, 99), grip(kind, 134, 99)].join('');
  },
  olympic(eq) {
    const p = [
      shadow(124, 36),
      Lb([[112, 96], [128, 108], [122, 136], [130, 137]]),
      L([[112, 96], [136, 104], [132, 136], [140, 137]]),
      T([[110, 98], [118, 60]]),
      head(122, 48),
      Ab([[118, 62], [108, 42], [106, 24]]),
      A([[118, 62], [128, 42], [130, 24]]),
    ];
    if (eq === 'kb') p.push(grip('kb', 130, 20));
    else if (eq === 'db') p.push(grip('db', 106, 21), grip('db', 130, 21));
    else p.push(barFront(90, 148, 21));
    return p.join('');
  },
  wristCurl(eq) {
    return [shadow(116, 40),
      benchPad(86, 100, 48), ln(94, 108, 94, 136, IRON, 5), ln(124, 108, 124, 136, IRON, 5),
      head(96, 49),
      T([[104, 100], [100, 62]]),
      L([[106, 98], [136, 94], [138, 134], [146, 135]]),
      Ab([[101, 64], [118, 80]]),
      A([[118, 80], [142, 84]]),
      eq === 'cable' ? cable(206, 130, 144, 84) : grip('db', 147, 83, true)].join('');
  },
  abduction(eq) {
    return [
      shadow(126, 38),
      L([[120, 88], [118, 112], [116, 135], [123, 136]]),
      Lb([[120, 88], [146, 96], [164, 110], [171, 107]]),
      T([[120, 92], [120, 52]]),
      head(120, 42),
      Ab([[120, 58], [132, 70], [126, 82]]),
      eq === 'band' ? ln(118, 130, 164, 110, METAL, 3, '6 5') : '',
      eq === 'cable' ? cable(210, 132, 164, 110) : ''].join('');
  },
  neck() {
    return [shadow(116, 30),
      `<circle cx="116" cy="58" r="14" fill="${BODY}"/>`,
      T([[116, 72], [116, 96]]),
      pline([[92, 100], [140, 100]], DIM, 11),
      ln(132, 58, 152, 58, '#7b8494', 2),
      grip('plate', 161, 58)].join('');
  },
  kneelOverhead(eq) {
    return [
      shadow(116, 40),
      Lb([[112, 98], [104, 133], [84, 137]]),
      L([[112, 98], [138, 106], [138, 136], [146, 137]]),
      T([[112, 100], [118, 62]]),
      head(120, 50),
      Ab([[118, 64], [128, 82], [134, 96]]),
      A([[118, 62], [114, 42], [112, 26]]),
      grip(eq === 'db' ? 'db' : 'kb', 112, 20)].join('');
  },
};

// Ordered movement-pattern classifier — first matching rule wins.
const RULES = [
  [/push-up|burpee/, 'pushUp'],
  [/toes-to-bar|hanging (leg|knee)/, 'hangingLegRaise'],
  [/dead hang|pull-up|chin-up|inverted row/, 'pullUp'],
  [/behind-the-neck/, 'overheadPress'],
  [/neck/, 'neck'],
  [/leg curl|nordic|glute-ham/, 'legCurl'],
  [/wrist curl|wrist roller/, 'wristCurl'],
  [/plate pinch|farmer|carry/, 'carry'],
  [/leg extension/, 'legExt'],
  [/hack squat|leg press/, 'legPress'],
  [/calf|tibialis/, 'calfRaise'],
  [/rear delt|reverse pec/, 'rearDelt'],
  [/crossover|cable flye|pec deck|face pull|pallof|woodchopper/, 'cableCross'],
  [/svend|front raise/, 'frontRaise'],
  [/lateral raise|y-raise/, 'lateralRaise'],
  [/lateral walk|abduction|kickback \(glute\)/, 'abduction'],
  [/shrug/, 'shrug'],
  [/upright row/, 'curl'],
  [/overhead (cable|dumbbell) extension/, 'overheadTriExt'],
  [/straight-arm pulldown|pushdown|kickback|triceps extension/, 'pushdown'],
  [/pulldown/, 'pulldown'],
  [/seated cable row|machine row|chest-supported/, 'seatedRow'],
  [/renegade|mountain climber|bear crawl|ab wheel/, 'quadruped'],
  [/row/, 'rowBent'],
  [/get-up/, 'kneelOverhead'],
  [/clean & press|thruster|wall ball|shoulder press|arnold|seated barbell|overhead barbell|military|landmine|pike|handstand/, 'overheadPress'],
  [/clean|snatch|devil/, 'olympic'],
  [/swing|pull-through/, 'kbSwing'],
  [/deadlift|rdl|rack pull|good morning|stiff-leg/, 'hinge'],
  [/hip thrust|glute bridge|bridge|frog pump/, 'bridge'],
  [/back extension|hyperextension/, 'backExt'],
  [/bulgarian|split squat|lunge|step-up/, 'lunge'],
  [/squat/, 'squat'],
  [/dip/, 'dip'],
  [/incline.*(press|bench|flye)/, 'inclinePress'],
  [/bench press|floor press|chest press|decline press|jm press|tate|skull|close-grip/, 'benchPress'],
  [/flye/, 'benchPress'],
  [/curl|21s/, 'curl'],
  [/press/, 'overheadPress'],
  [/plank|hollow/, 'plank'],
  [/crunch|sit-up|dead bug/, 'crunch'],
  [/leg raise/, 'crunch'],
  [/twist/, 'twist'],
];

/** Returns the pose key for an exercise (or name string); null = no match. */
export function poseKeyFor(exOrName) {
  const n = (typeof exOrName === 'string' ? exOrName : exOrName.name).toLowerCase();
  for (const [re, key] of RULES) if (re.test(n)) return key;
  return null;
}

function eqKind(equipment) {
  const e = (equipment || '').toLowerCase();
  if (e.includes('barbell')) return 'bar';
  if (e.includes('dumbbell')) return 'db';
  if (e.includes('kettlebell')) return 'kb';
  if (e.includes('cable')) return 'cable';
  if (e.includes('machine')) return 'machine';
  if (e.includes('plate')) return 'plate';
  if (e.includes('band')) return 'band';
  if (e.includes('wheel')) return 'wheel';
  if (e.includes('ball')) return 'ball';
  return 'none';
}

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Full demo-image SVG for a library exercise. */
export function exerciseArtSvg(ex) {
  const key = poseKeyFor(ex) || 'carry';
  const body = POSES[key](eqKind(ex.equipment));
  return `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeAttr(ex.name)} demo" preserveAspectRatio="xMidYMid meet">${ground()}${body}</svg>`;
}
