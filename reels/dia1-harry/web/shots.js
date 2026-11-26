// ---------- Dia 1 sendo o Harry: shot list (times come from the voice: LINES / WORDS) ----------
const SHOTS = [];
const B = i => i === 0 ? 0 : LINES[i][0] - .08;            // cut point just before line i
const END = VO_END + .9;
const wt = (sub, li) => { const w = WORDS.find(w => w.line === li && w.w.toLowerCase().includes(sub)); return w ? w.s : LINES[li][0]; };
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const sitLegs = { L: [1.45, -1.5], R: [1.4, -1.45] };
const KID = (cols, extra) => Object.assign({ cols, belt: false, hat: 'none', vest: '#3a3442' }, extra);
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function shot(start, end, tr, draw) { SHOTS.push({ start, end, tr, draw }); }

// 0 — "Dia um sendo o Harry Potter." walking into the hall
shot(B(0), B(1), 'whip', (ctx, lt, t) => {
  const hh = handheld(t, 4);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.05 + lt * .05, r: Math.sin(t * .6) * .006 };
  hallBG(ctx, t, cam);
  applyCam(ctx, cam, .5); candles(ctx, t, 12, 3, 160, 620);
  applyCam(ctx, cam, .8); longTable(ctx, -300, 300, 1050, HOUSE.red); longTable(ctx, 780, 1400, 1050, HOUSE.green);
  applyCam(ctx, cam, 1);
  drawStick(ctx, HARRY({ x: 540 + Math.sin(t * 4.5) * 6, y: 1720, s: 820, legs: walkLegs(t, 9, .45), arms: walkArms(t, 9, .45), bob: Math.abs(Math.sin(t * 9)) * -.012, face: { eyes: 'wide', look: [0, -.4], mouth: 'o', browUp: 1 }, headTilt: -.06 }));
  applyCam(ctx, cam, .6); candles(ctx, t, 3, 9, 60, 300, 0, 1080, 1.4, 1.8);
  popText(ctx, 'DIA 1', 540, 420, 190, inv(.05, .35, lt), '#ffd23a', INK, -.05);
});
// 1 — POV walk to the stool
shot(B(1), B(2), 'whip', (ctx, lt, t) => {
  const step = Math.abs(Math.sin(t * 6)) * 14;
  const cam = { x: 540 + Math.sin(t * 3) * 10, y: 930 - step, z: 1 + lt * .16, r: Math.sin(t * 3) * .01 };
  hallBG(ctx, t, cam);
  applyCam(ctx, cam, .55); candles(ctx, t, 16, 5, 120, 700);
  applyCam(ctx, cam, 1);
  // teachers' table far back, students at the side tables
  longTable(ctx, 260, 820, 960, '#6a4a8a', false);
  for (let i = 0; i < 5; i++) drawStick(ctx, KID([ROBE, ROBE], { x: 330 + i * 105, y: 960, s: 170, shadow: false, face: { look: [0, .3] }, headExtra: i === 2 ? hairSnape : null }));
  stool(ctx, 540, 1150, 1.1); drawSortHat(ctx, 540, 1015, .42, t, { bend: 1 });
  for (const [x0, col, flip] of [[-40, HOUSE.red, 1], [1120, HOUSE.green, -1]]) {
    for (let i = 0; i < 4; i++) drawStick(ctx, KID([ROBE, ROBE], { x: x0 + flip * (60 + i * 70), y: 1300 + i * 70, s: 300 + i * 40, face: { look: [flip * .8, -.2], eyes: 'normal', mouth: i % 2 ? 'o' : 'smile' }, flip, vest: col }));
    longTable(ctx, flip > 0 ? -400 : 940, flip > 0 ? 140 : 1500, 1500, col);
  }
});
// 2 — hat drops over the eyes, wants Slytherin
shot(B(2), B(3), 'whip', (ctx, lt, t) => {
  const tS = wt('sonserina', 2) - B(2);
  const hh = handheld(t, 3); const hit = inv(tS, tS + .1, lt) * (1 - inv(tS + .1, tS + .6, lt));
  const sh = shake(t, 22 * hit);
  const cam = { x: 540 + hh[0] + sh[0], y: 900 + hh[1] + sh[1], z: 1.05 + lt * .04 + hit * .05, r: 0 };
  hallBG(ctx, t, cam, { banners: [HOUSE.green, HOUSE.green, HOUSE.green, HOUSE.green] });
  applyCam(ctx, cam, .55); candles(ctx, t, 10, 7, 120, 500);
  applyCam(ctx, cam, 1);
  stool(ctx, 540, 1490, 2.6);
  const drop = kf(lt, [[0, -700], [.45, 0, x => x * x], [.6, -25, easeOut], [.75, 0, easeIn]]);
  const g = inv(tS - .1, tS + .2, lt);
  drawStick(ctx, HARRY({ x: 540, y: 1460, s: 900, legs: sitLegs, arms: { L: [.5, -1.9], R: [.5, -1.9] }, squash: lt > .45 && lt < .7 ? .94 : 1, face: { eyes: g > .5 ? 'wide' : 'normal', look: [0, -.6], mouth: g > .5 ? 'teeth' : 'o', browUp: 1 } }));
  if (g > .5) sweat(ctx, 700, 700, 40, 1);
  drawSortHat(ctx, 540, 1460 - .765 * 900 - 70 + drop, .95, t, { talk: lt > .9 ? 1 : 0, glow: g, eyeGlow: g > .3 ? '#5dff9a' : null, browUp: g, rot: Math.sin(t * 3) * .03 });
  vignetteCol(ctx, 'rgba(20,140,70,.9)', g * .6);
  flash(ctx, (1 - inv(tS, tS + .35, lt)) * (lt > tS ? .6 : 0), '#7dffb0');
  popText(ctx, 'SONSERINA?!', 540, 330, 120, inv(tS, tS + .3, lt), '#5dff9a', INK, .04);
});
// 3 — 11 years old, lightning scar
shot(B(3), B(4), 'whip', (ctx, lt, t) => {
  const tO = wt('onze', 3) - B(3), tC = wt('cicatriz', 3) - B(3);
  const hh = handheld(t, 3); const zap = inv(tC, tC + .15, lt);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1], [tC, 1.05], [tC + .3, 1.5]]), r: 0 };
  // tight close on the face, cam pushes to the scar
  applyCam(ctx, cam, .2); const g = ctx.createRadialGradient(540, 800, 100, 540, 900, 1100); g.addColorStop(0, '#5b4a8a'); g.addColorStop(1, '#1a1438'); ctx.fillStyle = g; ctx.fillRect(-500, -500, 2100, 2900);
  candles(ctx, t, 8, 11, 100, 1500, -100, 1180, 1.2, 1.8);
  applyCam(ctx, { ...cam, x: lerp(540, 600, zap), y: lerp(960, 620, zap) }, 1);
  drawStick(ctx, HARRY({ x: 540, y: 3000, s: 2600, scarGlow: zap * (0.7 + .3 * Math.sin(t * 20)), shadow: false, face: { eyes: zap > .5 ? 'squint' : 'normal', look: [0, -.3], mouth: zap > .5 ? 'teeth' : 'flat', browUp: .3 } }));
  if (zap > 0) { ctx.save(); ctx.globalAlpha = zap; bolt(ctx, 880, 520, 1.3, .3); bolt(ctx, 230, 560, 1, -.3); ctx.restore(); }
  popText(ctx, '11 ANOS', 540, 330, 130, inv(tO, tO + .3, lt) * (1 - inv(tC, tC + .2, lt)), '#fff', INK, -.04);
  flash(ctx, (1 - inv(tC, tC + .3, lt)) * (lt > tC ? .7 : 0), '#ffe9a0');
});
// 4 — knows everything that is coming
shot(B(4), B(5), 'whip', (ctx, lt, t) => {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .05, r: 0 };
  hallBG(ctx, t, cam, { skyTop: '#140f2e', skyBot: '#2c2660' });
  applyCam(ctx, cam, 1);
  drawStick(ctx, HARRY({ x: 380, y: 1820, s: 1000, arms: { L: [.3, -.1], R: { ik: [-.02, -.68], bend: -1 } }, face: { eyes: 'smug', look: [.6, -.5], mouth: 'smirk', browOne: 1 }, headTilt: .05 }));
  // thought bubble: the years ahead
  const k = inv(.1, .45, lt);
  for (const [x, y, r, d] of [[560, 820, 22, 0], [620, 720, 34, .08]]) { circle(ctx, x, y, r * backOut(clamp(k * 1.5 - d))); fillStroke(ctx, '#fff', 6); }
  ctx.save(); ctx.translate(720, 460); ctx.scale(backOut(clamp(k)), backOut(clamp(k)));
  cloudShape(ctx, 0, 0, 260, 5); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); cloudShape(ctx, 0, 0, 260, 5); ctx.fillStyle = '#fff'; ctx.fill();
  const icons = [[-170, -40, 'bolt'], [-40, -90, 'cup'], [90, -60, 'egg'], [190, 10, 'skull']];
  icons.forEach(([x, y, ic], i) => { const a = inv(.4 + i * .35, .7 + i * .35, lt); if (a <= 0) return; ctx.save(); ctx.translate(x, y + Math.sin(t * 3 + i) * 6); ctx.scale(backOut(a) * .9, backOut(a) * .9);
    if (ic === 'bolt') bolt(ctx, 0, 0, .55, .2);
    if (ic === 'cup') { path(ctx, [[-40, -50], [40, -50], [25, 10], [-25, 10]]); fillStroke(ctx, '#f2c230', 6); rrect(ctx, -10, 10, 20, 30, 4); fillStroke(ctx, '#f2c230', 5); rrect(ctx, -32, 38, 64, 16, 4); fillStroke(ctx, '#c9961e', 5); }
    if (ic === 'egg') { ellipse(ctx, 0, 0, 38, 50); fillStroke(ctx, '#4aa85a', 6); for (let j = 0; j < 4; j++) { circle(ctx, -14 + j * 10, -20 + (j % 2) * 25, 6); ctx.fillStyle = '#2d6a38'; ctx.fill(); } }
    if (ic === 'skull') { circle(ctx, 0, -8, 42); fillStroke(ctx, '#f6f2ea', 6); circle(ctx, -15, -12, 10); circle(ctx, 15, -12, 10); ctx.fillStyle = INK; ctx.fill(); rrect(ctx, -20, 28, 40, 18, 4); fillStroke(ctx, '#f6f2ea', 5); }
    ctx.restore(); });
  ctx.restore();
});
// 5 — Quirrell: the face on the back of his head
shot(B(5), B(6), 'whip', (ctx, lt, t) => {
  const tN = wt('nuca', 5) - B(5);
  const turn = inv(tN - .2, tN + .05, lt);
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .04 + turn * .25, r: 0 };
  hallBG(ctx, t, cam, { skyTop: '#07060f', skyBot: '#1d1430', wall: '#4a3e46' });
  applyCam(ctx, cam, 1);
  const vold = (ctx, hx, hy, hr) => {
    if (turn < .5) return turban(ctx, hx, hy, hr);
    // back of the turban, with the pale face
    circle(ctx, hx, hy, hr); fillStroke(ctx, '#7b3fa8', .014);
    ctx.save(); circle(ctx, hx, hy, hr); ctx.clip(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(hx, hy + hr * 1.2, hr * (.6 + i * .3), Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = .01; ctx.strokeStyle = 'rgba(30,5,50,.5)'; ctx.stroke(); } ctx.restore();
    ellipse(ctx, hx, hy + .01, hr * .72, hr * .82); fillStroke(ctx, '#d4dccb', .012);
    for (const s of [-1, 1]) { ellipse(ctx, hx + s * .05, hy - .01, .03, .012, s * .35); ctx.fillStyle = '#e0201a'; ctx.fill(); ctx.lineWidth = .008; ctx.strokeStyle = INK; ctx.stroke(); }
    line(ctx, hx - .01, hy + .04, hx - .004, hy + .06, .008); line(ctx, hx + .01, hy + .04, hx + .004, hy + .06, .008);
    ctx.beginPath(); ctx.arc(hx, hy + .14, .05, Math.PI + .7, -.7); ctx.lineWidth = .012; ctx.strokeStyle = INK; ctx.stroke();
  };
  ctx.save(); if (turn > .5) { ctx.shadowColor = 'rgba(255,20,20,.6)'; ctx.shadowBlur = 60; }
  drawStick(ctx, KID(['#5a4a3a', '#5a4a3a'], { x: 540, y: 1900, s: 1250, headExtra: vold, flip: turn > .5 ? -1 : 1,
    arms: turn > .5 ? { L: [.15, -.05], R: [.15, -.05] } : { L: [.9, -2.1], R: [.9, -2.1] }, face: { eyes: 'normal', look: [-.5, .2], mouth: 'frown', browAng: -.3, blink: (lt > .8 && lt < .9) ? 1 : 0 } }));
  ctx.restore();
  if (turn < .5) sweat(ctx, 760, 760, 40, 1);
  vignetteCol(ctx, 'rgba(160,0,0,.95)', turn * .7);
  flash(ctx, (1 - inv(tN, tN + .3, lt)) * (lt > tN ? .5 : 0), '#ff3a2a');
  popText(ctx, 'VOLDEMORT', 540, 330, 120, inv(.1, .4, lt) * (lt < tN ? 1 : 0), '#e0201a', INK);
});
// 6 — chaos unless he gets strong fast
shot(B(6), B(7), 'whip', (ctx, lt, t) => {
  const tF = wt('forte', 6) - B(6), tC = wt('caos', 6) - B(6);
  const chaos = inv(tC - .3, tC, lt) * (1 - inv(tF - .1, tF + .2, lt) * .8);
  const sh = shake(t, 18 * chaos, 1.6);
  const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1.02 + lt * .03, r: Math.sin(t * 2) * .02 * chaos };
  hallBG(ctx, t, cam, { skyTop: '#1a0a14', skyBot: '#5a1a2a', wall: '#5a4a4a' });
  applyCam(ctx, cam, .5);
  const R = rng(21); for (let i = 0; i < 7; i++) { const x = R() * 1080, y = 200 + R() * 800, a = (t * 2 + i) % TAU; ctx.save(); ctx.globalAlpha = chaos; ctx.translate(x + Math.cos(a) * 60, y + Math.sin(a) * 40); ctx.rotate(a); if (i % 3 === 0) bolt(ctx, 0, 0, .7, .3, '#9ef0ff'); else if (i % 3 === 1) { rrect(ctx, -50, -35, 100, 70, 6); fillStroke(ctx, ['#b8262f', '#2b4fa8'][i % 2], 6); line(ctx, 0, -35, 0, 35, 5); } else puff(ctx, 0, 0, 70, t, '#4a4050', i); ctx.restore(); }
  applyCam(ctx, cam, 1);
  const strong = inv(tF - .1, tF + .25, lt);
  drawStick(ctx, HARRY({ x: 540, y: 1780, s: 1000, lean: Math.sin(t * 7) * .04 * chaos,
    arms: strong > .5 ? { L: [2.2, -2.2], R: [2.2, -2.2] } : { L: [2.6, .3], R: [2.6, .3] },
    face: strong > .5 ? { eyes: 'normal', look: [0, 0], mouth: 'grin', browAng: .35 } : { eyes: 'spiral', mouth: 'teeth' }, t }));
  if (strong > .5) { burst(ctx, 540, 1780 - .765 * 1000, 330 * backOut(strong), 14, 'rgba(255,210,58,.0)', 3); for (let i = 0; i < 6; i++) sparkle(ctx, 540 + Math.cos(i + t) * 380, 900 + Math.sin(i * 2 + t) * 260, 40, strong); }
  popText(ctx, 'CAOS', 540, 330, 150, inv(tC, tC + .3, lt) * (1 - strong), '#ff4a3a', INK, Math.sin(t * 20) * .05);
  popText(ctx, 'FICAR FORTE', 540, 330, 110, strong, '#ffd23a', INK, -.04);
});
// 7 — the hat whispers: thirst for greatness
shot(B(7), B(8), 'whip', (ctx, lt, t) => {
  const tG = wt('grandeza', 7) - B(7);
  const hh = handheld(t, 2);
  const cam = { x: 540 + hh[0], y: 900 + hh[1], z: 1.15 + lt * .06, r: 0 };
  applyCam(ctx, cam, .2); const g = ctx.createRadialGradient(540, 700, 50, 540, 800, 1100); g.addColorStop(0, '#2c7a4a'); g.addColorStop(1, '#081a12'); ctx.fillStyle = g; ctx.fillRect(-500, -500, 2100, 2900);
  // whisper swirl
  ctx.save(); ctx.globalAlpha = .7; for (let i = 0; i < 30; i++) { const a = i * .5 + t * 1.5, r = 120 + i * 18; sparkle(ctx, 540 + Math.cos(a) * r, 760 + Math.sin(a) * r * .6, 10 + (i % 4) * 4, .8); } ctx.restore();
  applyCam(ctx, cam, 1);
  drawStick(ctx, HARRY({ x: 540, y: 2100, s: 1300, shadow: false, face: { eyes: 'half', look: [0, .2], mouth: 'smirk' } }));
  drawSortHat(ctx, 540, 2100 - .765 * 1300 - 110, 1.15, t, { talk: .6, glow: .8, eyeGlow: '#5dff9a', bend: 1.1 });
  const k = inv(tG, tG + .35, lt);
  if (k > 0) { ctx.save(); ctx.translate(540, 360); ctx.scale(backOut(k), backOut(k)); path(ctx, [[-150, 60], [-170, -60], [-80, 0], [0, -90], [80, 0], [170, -60], [150, 60]]); fillStroke(ctx, '#f2c230', 10); for (const x of [-170, 0, 170]) { circle(ctx, x, x ? -60 : -90, 18); fillStroke(ctx, '#5dff9a', 6); } ctx.restore(); }
});
// 8 — Gryffindor: Ron and Hermione watch, worried
shot(B(8), B(9), 'whip', (ctx, lt, t) => {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + lt * 10, y: 960 + hh[1], z: 1.08 + lt * .04, r: 0 };
  hallBG(ctx, t, cam, { banners: [HOUSE.red, HOUSE.gold, HOUSE.red, HOUSE.gold], wall: '#94786a' });
  applyCam(ctx, cam, .5); candles(ctx, t, 10, 13, 120, 560);
  applyCam(ctx, cam, 1);
  drawStick(ctx, KID([ROBE, ROBE], { x: 330, y: 1500, s: 900, vest: HOUSE.red, headExtra: hairRon, face: { eyes: 'wide', look: [.7, -.3], mouth: 'frown', browAng: -.35, browUp: .6 }, arms: { L: [.4, -.4], R: [1.1, -1.6] } }));
  drawStick(ctx, KID([ROBE, ROBE], { x: 760, y: 1500, s: 860, vest: HOUSE.red, headBack: hairHerm, headExtra: hairHermFront, flip: -1, face: { eyes: 'normal', look: [.7, -.3], mouth: 'flat', browAng: -.3 }, arms: { L: [.5, -.3], R: { ik: [.02, -.66], bend: -1 } } }));
  longTable(ctx, -200, 1300, 1220, HOUSE.red);
  // the book of the original story
  const k = inv(.3, .65, lt); if (k > 0) { ctx.save(); ctx.translate(540, 1120); ctx.scale(backOut(k), backOut(k)); ctx.rotate(-.05); rrect(ctx, -150, -100, 300, 140, 12); fillStroke(ctx, '#b8262f', 8); rrect(ctx, -140, -90, 280, 50, 6); fillStroke(ctx, '#f6f2ea', 5); text(ctx, 'ORIGINAL', 0, -65, 36, INK); star5(ctx, 0, 0, 30, t * .5); ctx.restore(); }
});
// 9 — but change house now and fate changes: Draco grins
shot(B(9), B(10), 'whip', (ctx, lt, t) => {
  const tD = wt('destino', 9) - B(9);
  const q = inv(tD, tD + .4, lt); const sh = shake(t, 14 * q, 1.3);
  const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1.05 + lt * .05, r: q * .05 * Math.sin(t * 3) };
  hallBG(ctx, t, cam, { banners: [HOUSE.green, HOUSE.silver, HOUSE.green, HOUSE.silver], skyTop: '#06140d', skyBot: '#1f4a35', wall: '#5e6a62' });
  applyCam(ctx, cam, .5); candles(ctx, t, 10, 17, 120, 560);
  applyCam(ctx, cam, 1);
  drawStick(ctx, KID([ROBE, ROBE], { x: 540, y: 1560, s: 950, vest: HOUSE.green, headExtra: hairDraco, face: { eyes: 'smug', look: [-.5, 0], mouth: 'smirk', browOne: -1, browAng: .3 }, arms: { L: [.9, -2.1], R: [.9, -2.1] } }));
  longTable(ctx, -200, 1300, 1260, HOUSE.green);
  // a spinning globe of the wizard world
  if (q > 0) { ctx.save(); ctx.translate(540, 360); ctx.scale(backOut(q) * .9, backOut(q) * .9); ctx.rotate(t * 2); circle(ctx, 0, 0, 120); fillStroke(ctx, '#3a7ad0', 10); ctx.clip(); for (let i = 0; i < 4; i++) { ellipse(ctx, -60 + i * 50 + (t * 80 % 100), -30 + (i % 2) * 60, 40, 28); ctx.fillStyle = '#4aa85a'; ctx.fill(); } ctx.restore(); circle(ctx, 540, 360, 108 * backOut(q) * .9); ctx.lineWidth = 0; }
  flash(ctx, (1 - inv(tD, tD + .3, lt)) * (lt > tD ? .45 : 0), '#d8ffe8');
});
// 10 — freeze: what do I ask the hat? you decide
shot(B(10), B(11), 'cut', (ctx, lt, t) => {
  const tV = wt('você', 10) - B(10);
  const fz = lt > tV - .1;
  const tt = fz ? B(10) + tV : t;
  const cam = { x: 540, y: 900, z: 1.1 + (fz ? .15 * easeOut(inv(tV - .1, tV + .3, lt)) : lt * .05), r: 0 };
  hallBG(ctx, tt, cam);
  applyCam(ctx, cam, .55); candles(ctx, tt, 10, 7, 120, 500);
  applyCam(ctx, cam, 1);
  stool(ctx, 540, 1490, 2.6);
  drawStick(ctx, HARRY({ x: 540, y: 1460, s: 900, legs: sitLegs, arms: { L: [.5, -1.9], R: [.5, -1.9] }, face: { eyes: 'wide', look: [0, -.6], mouth: 'o', browUp: 1 } }));
  drawSortHat(ctx, 540, 1460 - .765 * 900 - 70, .95, tt, { talk: fz ? 0 : .6, bend: 1 });
  if (fz) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = 'rgba(128,128,128,.6)'; ctx.fillRect(0, 0, W, H); ctx.restore(); flash(ctx, (1 - inv(tV - .1, tV + .2, lt)) * .8); }
  popText(ctx, 'VOCÊ DECIDE', 540, 330, 120, inv(tV, tV + .3, lt), '#ffd23a', INK, -.04);
  popText(ctx, '?', 870, 620, 200, inv(.1, .4, lt) * (fz ? 1 : 0) + (fz ? 0 : inv(.1, .4, lt)), '#fff', INK, .2 + Math.sin(t * 3) * .1);
});
// 11 — the three choices, each lights up as it's read
shot(B(11), B(14), 'whip', (ctx, lt, t) => {
  const t0 = B(11);
  const cam = { x: 540, y: 900, z: 1.25, r: 0 };
  hallBG(ctx, t, cam); applyCam(ctx, cam, .55); candles(ctx, t, 10, 7, 120, 500); darkness(ctx, .5, '#0a0814');
  // small frozen Harry + hat under the cards
  applyCam(ctx, { x: 540, y: 960, z: 1, r: 0 }, 1);
  popText(ctx, 'DIA 2 = ?', 540, 300, 100, inv(0, .3, lt), '#fff', INK);
  const opts = [['GRIFINÓRIA', 'história original', HOUSE.red, 11], ['SONSERINA', 'poder sem limites', HOUSE.green, 12], ['CORVINAL', 'magia em segredo', HOUSE.blue, 13]];
  opts.forEach(([lab, sub, col, li], i) => {
    const a = LINES[li][0] - t0, e = LINES[li][1] - t0;
    const k = inv(a - .25, a + .1, lt) + (i === 0 ? inv(0, .3, lt) : 0) * 0;
    const hi = inv(a, a + .2, lt) * (1 - inv(e + .1, e + .3, lt));
    choiceCard(ctx, 90, 420 + i * 260, 900, 220, i + 1, lab, sub, col, k, hi);
  });
});
// 12 — CTA: the hat opens up to shout the house
shot(B(14), END, 'cut', (ctx, lt, t) => {
  const tS = wt('segue', 14) - B(14);
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 980 + hh[1], z: 1.1 + lt * .07, r: 0 };
  hallBG(ctx, t, cam);
  applyCam(ctx, cam, .55); candles(ctx, t, 14, 23, 120, 520);
  applyCam(ctx, cam, 1);
  drawSortHat(ctx, 540, 960, 1.5, t, { open: kf(lt, [[0, .1], [3, 1]]), browUp: inv(0, 3, lt), eyeOpen: inv(1, 3, lt), bend: 1.1, glow: .4 + .3 * Math.sin(t * 4), glowCol: 'rgba(255,210,80,.6)' });
  popText(ctx, 'DIA 2', 540, 330, 150, inv(.2, .5, lt), '#ffd23a', INK, -.05);
  const k = inv(tS - .1, tS + .25, lt);
  if (k > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 1140); ctx.scale(backOut(k) * (1 + .04 * Math.sin(t * 8)), backOut(k) * (1 + .04 * Math.sin(t * 8))); rrect(ctx, -230, -70, 460, 140, 70); fillStroke(ctx, '#e0392f', 10); text(ctx, 'SEGUIR', 0, 4, 76, '#fff', INK, 0); ctx.restore(); }
});
