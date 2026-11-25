// ---------- characters ----------
const ELON = { cols: ['#2c3442', '#2c3442'], hat: 'hair', hairCol: '#4a3022', tie: true, belt: false };
const KID = { cols: ['#3fa35b', '#f6f1e8'], hat: 'hair', hairCol: '#9a6a3a', belt: false };
const BULLY1 = { cols: PAL.red, hat: 'cap', hatCol: '#7a4bc4', belt: false };
const BULLY2 = { cols: PAL.purple, hat: 'cap', hatCol: '#e0392f', belt: false };
const SUIT = { cols: ['#6a707c', '#6a707c'], hat: 'none', tie: true, belt: false };
const ASTRO = { cols: ['#f3f1ec', '#f3f1ec'], hat: 'none', helmet: true, belt: false };
const C = (base, extra) => Object.assign({}, base, extra);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const cheer = t => ({ L: [2.7 + Math.sin(t * 14) * .15, .2], R: [2.7 - Math.sin(t * 14) * .15, .2] });
const LAUGH = { eyes: 'happy', mouth: 'grin', browUp: 1 };
function cam0(t, lt, x, y, z0, z1, dur, hhA = 4) { const hh = handheld(t, hhA); return { x: x + hh[0], y: y + hh[1], z: lerp(z0, z1, ease(clamp(lt / dur))), r: Math.sin(t * .5) * .005 }; }
function hit(lt, at, amp = 26, len = .35) { const k = (lt - at) / len; if (k < 0 || k > 1) return [0, 0]; const s = shake(lt * 6, amp * (1 - k), 2, 5); return s; }
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function plainBG(ctx, cam, c1, c2) { applyCam(ctx, cam, .05); const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 5080, 6000); }
function rays(ctx, x, y, t, col = 'rgba(255,255,255,.12)', n = 14) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * .2); ctx.fillStyle = col; for (let i = 0; i < n; i++) { ctx.rotate(TAU / n); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-120, 1800); ctx.lineTo(120, 1800); ctx.closePath(); ctx.fill(); } ctx.restore(); }
function floor(ctx, y, col = '#d8c9a8', line2 = '#b8a888') { ctx.fillStyle = col; ctx.fillRect(-2000, y, 5080, 3000); ctx.fillStyle = line2; ctx.fillRect(-2000, y, 5080, 10); }
function pop(lt, at, d = .25) { return backOut(clamp((lt - at) / d)); }

const SHOTS = [];
// 0 — schoolyard: the shove and the fall
SHOTS.push({ start: 0, end: 1.85, tr: 'cut', draw(ctx, lt, t) {
  const hs = hit(lt, 1.05, 30);
  const cam = cam0(t, lt, 540 + hs[0], 980 + hs[1], 1.08, 1.18, 1.8);
  groundBG(ctx, cam, t, { hill: '#7ccf62' });
  applyCam(ctx, cam, 1);
  floor(ctx, 1520, '#cfc6b4', '#a89f8c');
  drawSchool(ctx, 540, 1180, .95);
  drawStairs(ctx, 200, 1520, 4, 70, 85);
  const push = lt > .5;
  // bully on the top step
  drawStick(ctx, C(BULLY1, { x: 270, y: 1180, s: 430, flip: 1, face: { eyes: 'normal', mouth: push ? 'teeth' : 'smirk', browAng: .4, look: [1, 0] }, arms: push ? { L: [.4, -.2], R: [1.55, -.1] } : { L: [.3, -.1], R: [1.0, -1.2] }, lean: push ? .12 : 0 }));
  // kid tumbles down the stairs
  const k = clamp((lt - .5) / .55);
  const kx = lerp(420, 760, easeOut(k)), ky = lt < .5 ? 1180 : lerp(1180, 1520, easeIn(k)) - Math.sin(k * Math.PI) * 120;
  const rot = lt < .5 ? 0 : (lt < 1.05 ? k * 4.2 : 1.57);
  const down = lt >= 1.05;
  drawStick(ctx, C(KID, { x: down ? 840 : kx, y: down ? 1500 : ky, s: 420, lean: rot, shadow: !push || down, arms: push ? POSE.handsUp.arms : POSE.idle.arms, legs: push && !down ? { L: [.8, -1], R: [.5, -.6] } : POSE.idle.legs,
    face: down ? { eyes: 'spiral', mouth: 'o' } : push ? { eyes: 'wide', mouth: 'o', browUp: 1 } : { eyes: 'normal', mouth: 'flat', look: [-1, 0] }, t }));
  if (lt > 1.05 && lt < 1.45) burst(ctx, 820, 1420, 190 * pop(lt, 1.05, .12), 12, '#ffd23a', 3);
  if (down) for (let i = 0; i < 3; i++) { const a = t * 6 + i * TAU / 3; star5(ctx, 600 + Math.cos(a) * 90, 1430 + Math.sin(a) * 25, 22, t * 4, '#ffe14d'); }
  flash(ctx, kf(lt, [[1.05, .6], [1.25, 0]]) * (lt > 1.05 ? 1 : 0));
} });
// 1 — hospital bed, heart monitor
SHOTS.push({ start: 1.85, end: 2.8, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 960, 1.0, 1.12, .95, 3);
  plainBG(ctx, cam, '#cfeaf2', '#eef7f5');
  applyCam(ctx, cam, 1);
  floor(ctx, 1450, '#b9d6d2', '#98b8b4');
  rrect(ctx, 120, 300, 300, 260, 12); fillStroke(ctx, '#bfe6f8', 6); line(ctx, 270, 300, 270, 560, 5); line(ctx, 120, 430, 420, 430, 5);
  drawMonitor(ctx, 850, 1040, 1.3, t);
  drawBed(ctx, 480, 1450, 1.05);
  drawStick(ctx, C(KID, { x: 650, y: 1210, s: 470, lean: -1.57, shadow: false, bandage: true, arms: { L: [.2, -.1], R: [.2, -.1] }, legs: { L: [.05, 0], R: [.05, 0] }, face: { eyes: 'x', mouth: 'frown' } }));
  // blanket over the body
  rrect(ctx, 330, 1225, 520, 90, 30); fillStroke(ctx, '#7fb6e8', 6);
} });
// 2 — the bet: a rocket that blows up
SHOTS.push({ start: 2.8, end: 4.9, tr: 'cut', draw(ctx, lt, t) {
  const ex = 1.68; const hs = hit(lt, ex, 40, .6);
  const rise = lt < .35 ? 0 : (lt - .35) * (lt - .35) * 420;
  const cam = cam0(t, lt, 540 + hs[0], 900 + hs[1] - Math.min(rise, 500) * .5, 1.0, 1.1, 2);
  groundBG(ctx, cam, t, { top: '#4aaeea', bot: '#d8f0fb', hill: '#d8c08a' });
  applyCam(ctx, cam, 1);
  drawPad(ctx, 540, 1500, 1);
  ctx.save(); ctx.fillStyle = '#c9b07a'; ctx.fillRect(-2000, 1560, 5080, 3000); ctx.restore();
  if (lt < ex) drawRocket(ctx, 540, 1500 - rise, .95, t, { flame: lt > .2 ? 1.1 : .2, fin: '#e0392f' });
  if (lt > .3) { const k = clamp((lt - .3) / 1.5); for (let i = 0; i < 4; i++) puff(ctx, 540 + (i - 1.5) * 160 * (1 + k), 1540, 110 * (.6 + k), t, '#f3efe6', 20 + i, .9); }
  const ek = (lt - ex) / .9; if (ek > 0) explosion(ctx, 540, 1500 - rise - 400, 300, ek, 7);
  if (lt > ex + .1) { for (let i = 0; i < 2; i++) puff(ctx, 400 + i * 280, 1500 - rise - 350, 170, t, '#6b6670', 40 + i, clamp((lt - ex) * 2)); }
  flash(ctx, kf(lt, [[ex, .9], [ex + .25, 0]]) * (lt > ex ? 1 : 0), '#fff4d0');
} });
// 3 — billions counter
SHOTS.push({ start: 4.9, end: 6.4, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 960, 1.05, 1.15, 1.5, 3);
  plainBG(ctx, cam, '#1f7a4a', '#7fd36a');
  applyCam(ctx, cam, .2); rays(ctx, 540, 900, t, 'rgba(255,255,200,.12)');
  applyCam(ctx, cam, 1);
  // bills raining
  const R = rng(55); for (let i = 0; i < 26; i++) { const x = R() * 1200 - 60, sp = 500 + R() * 500, y = ((R() * 2200 + lt * sp) % 2200) - 200; drawBill(ctx, x + Math.sin(t * 3 + i) * 30, y, .75 + R() * .5, Math.sin(t * 2 + i) * .8); }
  drawStick(ctx, C(ELON, { x: 540, y: 1720, s: 820, face: { eyes: 'happy', mouth: 'grin', browUp: 1 }, arms: cheer(t), shadow: false }));
  // counter
  const v = Math.round(Math.pow(10, lerp(3, 11.6, easeOut(clamp(lt / 1.2)))));
  const str = 'US$ ' + v.toLocaleString('pt-BR');
  rrect(ctx, 90, 250, 900, 170, 30); fillStroke(ctx, '#111a14', 8);
  text(ctx, str, 540, 338, str.length > 18 ? 74 : 86, '#7dff9a', '#000', 0, 'Poppins', 700);
} });
// 4 — this is Elon Musk
SHOTS.push({ start: 6.4, end: 8.05, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 940, 1.0, 1.2, 1.65, 2);
  plainBG(ctx, cam, '#1a1430', '#3a2a5a');
  applyCam(ctx, cam, .1); starfield(ctx, t, 5, 70);
  applyCam(ctx, cam, .3); drawRocket(ctx, 860, 1500, .9, t, { flame: 0 }); drawRocket(ctx, 200, 1550, .7, t, { flame: 0, fin: '#2f63c9' });
  applyCam(ctx, cam, 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, 1150, 50, 540, 1150, 700); g.addColorStop(0, 'rgba(255,240,200,.45)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(-400, 0, 1900, 2200); ctx.restore();
  path(ctx, [[460, -200], [620, -200], [900, 1700], [180, 1700]]); ctx.fillStyle = 'rgba(255,245,210,.12)'; ctx.fill();
  ellipse(ctx, 540, 1700, 300, 50); ctx.fillStyle = 'rgba(255,245,210,.3)'; ctx.fill();
  drawStick(ctx, C(ELON, { x: 540, y: 1700, s: 880, face: { eyes: 'smug', mouth: 'smirk', browOne: 1 }, arms: POSE.hips.arms, headTilt: -.05 }));
  const sa = kf(lt, [[.9, 0], [1.05, 1], [1.4, 0]]); sparkle(ctx, 640, 1000, 60 * sa, sa);
} });
// 5 — born 1971, South Africa
SHOTS.push({ start: 8.05, end: 10.05, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540 - lt * 20, 980, 1.0, 1.1, 2);
  savannaBG(ctx, cam, t);
  applyCam(ctx, cam, 1);
  // sign post
  const sp = pop(lt, .55, .35);
  ctx.save(); ctx.translate(300, 1500); ctx.scale(1, sp);
  line(ctx, 0, 0, 0, -520, 14, '#6b4a2a');
  rrect(ctx, -190, -650, 380, 180, 16); fillStroke(ctx, '#f6e8c8', 7);
  text(ctx, '1971', 0, -590, 92, '#c9452f', null, 0, 'Poppins', 700);
  text(ctx, 'ÁFRICA DO SUL', 0, -515, 38, INK, null, 0, 'Poppins', 700);
  ctx.restore();
  drawStick(ctx, C(KID, { x: lerp(620, 760, lt / 2), y: 1560, s: 500, legs: walkLegs(t, 8, .4), arms: walkArms(t, 8, .4), face: { eyes: 'normal', mouth: 'smile', look: [1, 0] }, bob: -Math.abs(Math.sin(t * 8)) * .02 }));
} });
// 6 — introvert, bullied
SHOTS.push({ start: 10.05, end: 13.45, tr: 'cut', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 1000, 1.0, 1.14, 3.4);
  groundBG(ctx, cam, t, { top: '#7a8fb8', bot: '#c9d6ea', hill: '#7aa860' });
  applyCam(ctx, cam, .6); drawSchool(ctx, 540, 1180, .7);
  applyCam(ctx, cam, 1);
  floor(ctx, 1500, '#cfc6b4', '#a89f8c');
  // bench
  rrect(ctx, 330, 1350, 420, 40, 10); fillStroke(ctx, '#9a5a2a', 6); line(ctx, 360, 1390, 360, 1500, 10); line(ctx, 720, 1390, 720, 1500, 10);
  const bul = lt > 2.0;
  drawStick(ctx, C(KID, { x: 540, y: 1440, s: 480, legs: { L: [1.4, -1.4], R: [1.4, -1.4] }, arms: { L: [.3, -.6], R: [.3, -.6] }, shadow: false,
    face: bul ? { eyes: 'wide', mouth: 'frown', browAng: -.35, look: [0, 0] } : { eyes: 'half', mouth: 'flat', look: [0, .6] }, headTilt: bul ? 0 : .15 }));
  if (bul) sweat(ctx, 680, 1000, 34, clamp((lt - 2.2) * 4));
  const bx = kf(lt, [[1.9, -260], [2.4, 150]]), bx2 = kf(lt, [[2.0, 1340], [2.5, 930]]);
  for (const [x, ch, fl] of [[bx, BULLY1, 1], [bx2, BULLY2, -1]]) drawStick(ctx, C(ch, { x, y: 1660, s: 600, flip: fl, face: LAUGH, arms: { L: [.5, -.4], R: [1.5 + Math.sin(t * 20) * .08, 0] }, bob: Math.abs(Math.sin(t * 16)) * -.02 }));
  if (lt > 2.5) { text(ctx, 'HA', 170 + Math.sin(t * 20) * 5, 700, 80, '#ffd23a', INK, 12, 'Poppins', 700); text(ctx, 'HA', 900 + Math.sin(t * 19) * 5, 760, 80, '#ffd23a', INK, 12, 'Poppins', 700); }
} });
// 7 — refuge in science fiction books
SHOTS.push({ start: 13.45, end: 15.65, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 980, 1.05, 1.16, 2.2, 3);
  plainBG(ctx, cam, '#2a2458', '#5a3a7a');
  applyCam(ctx, cam, .12); starfield(ctx, t, 9, 80);
  applyCam(ctx, cam, 1);
  floor(ctx, 1520, '#6a4a6a', '#4a3050');
  // stacks of books
  const cols = ['#e0392f', '#2f63c9', '#f2b52a', '#3fa35b', '#7a4bc4', '#ff7a5a'];
  for (let i = 0; i < 6; i++) drawBook(ctx, 200 + (i % 2) * 10, 1520 - i * 62, 230, 60, cols[i], (i % 2 ? .04 : -.03));
  for (let i = 0; i < 4; i++) drawBook(ctx, 890 - (i % 2) * 8, 1520 - i * 62, 210, 60, cols[(i + 3) % 6], (i % 2 ? -.04 : .03));
  drawStick(ctx, C(KID, { x: 560, y: 1520, s: 520, legs: { L: [1.4, -1.5], R: [1.4, -1.5] }, arms: { L: { ik: [-.16, -.47] }, R: { ik: [.16, -.47] } }, shadow: false, face: { eyes: 'wide', mouth: 'smile', look: [0, 1] } }));
  drawOpenBook(ctx, 560, 1300, 1.0, t);
  // dreams flying out
  const k = clamp((lt - .2) / 1.6);
  const fx = (i) => 560 + Math.sin(i * 2.1 + t) * 200 * k;
  drawRocket(ctx, fx(1), 1150 - k * 520, .28, t, { flame: 1, rot: .2 });
  drawMars(ctx, 560 - 260 * k, 1150 - k * 640, 60 * k + 1, t);
  drawSatellite(ctx, 560 + 280 * k, 1150 - k * 450, .7 * k + .01, t);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t; sparkle(ctx, 560 + Math.cos(a) * 300 * k, 1150 - k * 300 + Math.sin(a) * 120 * k, 20, k); }
} });
// 8 — the mind ahead: coding at 12
SHOTS.push({ start: 15.65, end: 19.4, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 1000, 1.0, 1.15, 3.7, 3);
  plainBG(ctx, cam, '#f2d6a8', '#e8b87a');
  applyCam(ctx, cam, 1);
  rrect(ctx, 650, 350, 300, 240, 12); fillStroke(ctx, '#bfe6f8', 6); line(ctx, 800, 350, 800, 590, 5);
  // poster
  rrect(ctx, 110, 380, 200, 270, 8); fillStroke(ctx, '#2a2458', 6); drawRocket(ctx, 210, 610, .25, t, { flame: .6 });
  floor(ctx, 1560, '#b8865a', '#8a5a3a');
  drawCRT(ctx, 700, 1330, .95, t, clamp((lt - 3.0) / .7));
  const typing = lt > 3.0;
  drawStick(ctx, C(KID, { x: 330, y: 1560, s: 560, legs: { L: [1.3, -1.4], R: [1.3, -1.4] },
    arms: typing ? { L: { ik: [.55 + Math.sin(t * 30) * .02, -.52] }, R: { ik: [.7 + Math.cos(t * 28) * .02, -.5] } } : { L: [.3, -.1], R: { ik: [.18, -.75], bend: -1 } },
    face: typing ? { eyes: 'normal', mouth: 'grin', look: [1, .2], browAng: .3 } : { eyes: 'normal', mouth: 'smile', look: [.6, -.8] } }));
  // stool
  rrect(ctx, 220, 1385, 220, 30, 8); fillStroke(ctx, '#7a4a2a', 5);
  const b = pop(lt, .5, .3); if (lt > .5) drawBulb(ctx, 330, 690 - Math.sin(t * 3) * 10, .85 * b, 1);
  // age badge
  const ab = pop(lt, 2.5, .3); if (lt > 2.5) { ctx.save(); ctx.translate(820, 300); ctx.scale(ab, ab); ctx.rotate(.12); burst(ctx, 0, 0, 120, 14, '#e0392f', 8, .78); text(ctx, '12', 0, -8, 82, '#fff', INK, 0, 'Poppins', 700); text(ctx, 'ANOS', 0, 52, 30, '#fff', null, 0, 'Poppins', 700); ctx.restore(); }
} });
// 9 — sold his first game for $500
SHOTS.push({ start: 19.4, end: 22.05, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 1000, 1.0, 1.12, 2.6, 3);
  plainBG(ctx, cam, '#8fd0f0', '#e7f6ff');
  applyCam(ctx, cam, 1);
  floor(ctx, 1600, '#6cc35a', '#4a9a3a');
  const give = kf(lt, [[.2, 0], [.8, 1]]);
  const got = lt > 1.7;
  // floppy disk
  const fxp = lerp(390, 600, give), fyp = 1020;
  if (!got || lt < 1.9) { ctx.save(); ctx.translate(fxp, fyp); ctx.rotate(-.1); rrect(ctx, -70, -70, 140, 140, 8); fillStroke(ctx, '#2b2f3a', 6); rrect(ctx, -40, -70, 80, 50, 4); fillStroke(ctx, '#c9ced8', 4); rrect(ctx, -50, 0, 100, 60, 4); fillStroke(ctx, '#fff', 4); path(ctx, [[0, 10], [22, 50], [-22, 50]]); fillStroke(ctx, '#e0392f', 3); ctx.restore(); }
  drawStick(ctx, C(KID, { x: 260, y: 1600, s: 560, arms: { L: [.3, -.1], R: { ik: [(fxp - 260) / 560, (fyp - 1600) / 560] } }, face: got ? { eyes: 'wide', mouth: 'grin', browUp: 1 } : { eyes: 'normal', mouth: 'smile', look: [1, 0] } }));
  drawStick(ctx, C(SUIT, { x: 830, y: 1640, s: 660, flip: -1, arms: { L: [.3, -.1], R: { ik: [(830 - lerp(650, 470, clamp((lt - 1.3) / .4))) / 660, -.62] } }, face: { eyes: 'normal', mouth: 'smile', look: [1, 0] } }));
  if (lt > 1.3) { const bx = lerp(650, 470, clamp((lt - 1.3) / .4)); drawBill(ctx, bx, 1180, 1.25, -.08, '500'); }
  if (got) { for (let i = 0; i < 6; i++) { const k = clamp((lt - 1.75 - i * .05) / .6); if (k > 0) drawCoin(ctx, 470 + (i - 2.5) * 70 * k * 2, 1180 - Math.sin(k * Math.PI) * 300 - k * 50, 34, t * 10 + i); } text(ctx, 'US$ 500', 540, 520, 110, '#3fa35b', INK, 14, 'Poppins', 700); }
} });
// 10 — USA, sold PayPal, millionaire
SHOTS.push({ start: 22.05, end: 25.35, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 980, 1.0, 1.12, 3.3);
  groundBG(ctx, cam, t, { top: '#3ea6ee', bot: '#d4f0ff', hill: '#8a9ab8' });
  applyCam(ctx, cam, .35); drawSkyline(ctx, 1200, t);
  applyCam(ctx, cam, 1);
  floor(ctx, 1600, '#9aa0ab', '#7a808b');
  drawStarsStripes(ctx, 120, 420, 300, 190, t);
  const hand = kf(lt, [[.9, 0], [1.4, 1]]);
  const bx = lerp(430, 640, hand);
  drawStick(ctx, C(ELON, { x: 290, y: 1600, s: 640, arms: { L: [.3, -.1], R: { ik: [(bx - 290) / 640, -.6] } }, face: lt > 1.6 ? LAUGH : { eyes: 'normal', mouth: 'smile', look: [1, 0] } }));
  drawStick(ctx, C(SUIT, { x: 850, y: 1620, s: 640, flip: -1, arms: { L: [.3, -.1], R: { ik: [(850 - bx) / 640, -.6] } }, face: { eyes: 'wide', mouth: 'grin', look: [1, 0] } }));
  // the company box
  rrect(ctx, bx - 120, 1170, 240, 170, 14); fillStroke(ctx, '#2f63c9', 7);
  text(ctx, 'PayPal', bx, 1250, 54, '#fff', null, 0, 'Poppins', 700);
  // money bags drop on "milionário"
  for (const [x, at, s] of [[200, 1.6, .9], [380, 1.75, .7], [130, 2.6, .6]]) { const k = clamp((lt - at) / .3); if (lt > at) { const y = lerp(-200, 1600, easeIn(k)); drawMoneyBag(ctx, x, y, s, '$'); if (k >= 1) { const pk = clamp((lt - at - .3) / .4); if (pk < 1) puff(ctx, x, 1600, 80, t, '#efe3cf', 3, 1 - pk); } } }
} });
// 11 — no retirement: all in
SHOTS.push({ start: 25.35, end: 29.5, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540 + kf(lt, [[1.9, 0], [2.6, 120]]), 980, 1.0, 1.1, 4.1);
  applyCam(ctx, cam, .08); drawSky(ctx, '#3ec0f0', '#fff0c0', -300, 900);
  applyCam(ctx, cam, .1); drawSun(ctx, 840, 300, 80, t, .9);
  applyCam(ctx, cam, .4); drawSea(ctx, 820, t);
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#f2d28a'; ctx.fillRect(-2000, 1150, 5080, 3000); ctx.fillStyle = '#e0b86a'; ctx.fillRect(-2000, 1150, 5080, 12);
  drawPalm(ctx, 90, 1300, 1.0, t);
  drawUmbrella(ctx, 300, 1450, .9);
  // the chair gets kicked away
  const kick = clamp((lt - 1.5) / .5);
  drawBeachChair(ctx, 380 - easeOut(kick) * 900, 1480 - Math.sin(kick * Math.PI) * 400, 1.1, kick * 3);
  const kicking = lt > 1.4 && lt < 1.8;
  const ax = 640, push = clamp((lt - 2.1) / 1.3);
  drawStick(ctx, C(ELON, { x: ax + push * 160, y: 1560, s: 640, lean: push > 0 && push < 1 ? .18 : 0,
    legs: kicking ? { L: [.1, -.05], R: [-1.3, -.2] } : (push > 0 && push < 1 ? walkLegs(t, 10, .35) : POSE.idle.legs),
    arms: lt > 2.0 ? { L: { ik: [.42, -.55] }, R: { ik: [.5, -.4] } } : (lt > .5 && lt < 1.4 ? { L: [.3, -.1], R: [1.0, -2.0] } : POSE.idle.arms),
    face: lt < 1.4 ? { eyes: 'half', mouth: 'flat', look: [-1, 0], browOne: -1 } : { eyes: 'normal', mouth: 'teeth', browAng: .35, look: [1, 0] }, headTilt: lt > .5 && lt < 1.4 ? Math.sin(t * 9) * .12 : 0 }));
  // pile of bags shoved forward
  for (let i = 0; i < 5; i++) drawMoneyBag(ctx, 990 + push * 320 + (i % 3) * 120 - 60, 1600 - Math.floor(i / 3) * 150, .75, '$');
  if (lt > .5 && lt < 1.4) { ctx.save(); ctx.translate(380, 780); ctx.scale(pop(lt, .5), pop(lt, .5)); circle(ctx, 0, 0, 120); fillStroke(ctx, '#fff', 8); text(ctx, 'NÃO', 0, 4, 64, '#e0392f', null, 0, 'Poppins', 700); ctx.restore(); }
} });
// 12 — the market called it crazy
SHOTS.push({ start: 29.5, end: 31.7, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 1000, 1.05, 1.18, 2.2, 5);
  plainBG(ctx, cam, '#3a4a6a', '#7a8aaa');
  applyCam(ctx, cam, .4); drawSkyline(ctx, 1300, t, '#4a5a7a', '#c9d6ea');
  applyCam(ctx, cam, 1);
  floor(ctx, 1640, '#5a6070', '#454a58');
  // chart crashing in the back
  ctx.save(); ctx.beginPath(); ctx.moveTo(140, 420); ctx.lineTo(330, 520); ctx.lineTo(480, 470); ctx.lineTo(650, 650); ctx.lineTo(780, 610); ctx.lineTo(940, 820); ctx.lineWidth = 16; ctx.strokeStyle = '#ff4a3a'; ctx.lineJoin = 'round'; ctx.stroke(); path(ctx, [[940, 820], [880, 760], [960, 740]]); ctx.fillStyle = '#ff4a3a'; ctx.fill(); ctx.restore();
  const xs = [[220, 620, 1], [540, 700, -1], [860, 640, -1]];
  const crazy = lt > 1.75;
  for (const [x, s, fl] of xs) drawStick(ctx, C(SUIT, { x, y: 1660, s, flip: fl, face: crazy ? { eyes: 'spiral', mouth: 'grin' } : LAUGH, t, arms: { L: [.6 + Math.sin(t * 18 + x) * .15, -1.6], R: [1.6, 0] }, bob: -Math.abs(Math.sin(t * 15 + x)) * .02, lean: Math.sin(t * 15 + x) * .04 }));
  if (crazy) { const k = pop(lt, 1.75); ctx.save(); ctx.translate(540, 350); ctx.scale(k, k); ctx.rotate(-.06); burst(ctx, 0, 0, 200, 16, '#ffd23a', 4, .7); text(ctx, '?!', 0, 0, 140, '#e0392f', INK, 10, 'Poppins', 700); ctx.restore(); }
} });
// 13 — electric cars
SHOTS.push({ start: 31.7, end: 33.4, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 1000, 1.0, 1.08, 1.7, 5);
  groundBG(ctx, cam, t, { hill: '#6cc35a' });
  applyCam(ctx, cam, .5); drawSkyline(ctx, 1150, t);
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#3b3f4a'; ctx.fillRect(-2000, 1250, 5080, 600); for (let i = 0; i < 12; i++) { const x = ((i * 260 - lt * 1400) % 3120 + 3120) % 3120 - 500; ctx.fillStyle = '#fff'; ctx.fillRect(x, 1480, 140, 18); }
  ctx.fillStyle = '#6cc35a'; ctx.fillRect(-2000, 1850, 5080, 800);
  const cx = kf(lt, [[0, -400], [.6, 540, easeOut], [1.7, 640]]);
  speedLines(ctx, 950, 1420, t, clamp(lt * 3));
  drawCar(ctx, cx, 1620 + Math.sin(t * 30) * 3, 1.25, t, '#e0392f', { spin: t * 20 });
  // charge sparks
  for (let i = 0; i < 6; i++) { const a = t * 8 + i; sparkle(ctx, cx - 40 + Math.cos(a) * 200, 1360 + Math.sin(a * 1.3) * 90, 26, clamp((lt - .5) * 3)); }
  bolt(ctx, 820, 330, 1.1, pop(lt, .7)); bolt(ctx, 180, 420, .8, pop(lt, .85));
} });
// 14 — rockets: SpaceX
SHOTS.push({ start: 33.4, end: 34.75, tr: 'cut', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 920, 1.0, 1.1, 1.35, 3);
  groundBG(ctx, cam, t, { top: '#4aaeea', bot: '#d8f0fb', hill: '#d8c08a' });
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#c9b07a'; ctx.fillRect(-2000, 1560, 5080, 3000);
  drawPad(ctx, 640, 1500, 1);
  drawRocket(ctx, 640, 1500, .95, t, { flame: 0, label: '' });
  drawStick(ctx, C(ELON, { x: 270, y: 1640, s: 620, arms: { L: [.3, -.1], R: [2.4, -.9] }, face: { eyes: 'normal', mouth: 'grin', browAng: .3, look: [1, -.4] } }));
} });
// 15 — 2008: three rockets explode
SHOTS.push({ start: 34.75, end: 37.9, tr: 'cut', draw(ctx, lt, t) {
  const exs = [1.7, 2.2, 2.7]; let hs = [0, 0]; for (const e of exs) { const h = hit(lt, e, 34, .4); hs = [hs[0] + h[0], hs[1] + h[1]]; }
  const bl = lt > 1.2 && lt < 1.35 ? 1 : 0;
  const cam = cam0(t, lt, 540 + hs[0], 980 + hs[1], 1.0, 1.12, 3.1, 4);
  stormSky(ctx, cam, t, bl * .8);
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#4a3a3a'; ctx.fillRect(-2000, 1500, 5080, 3000); ctx.fillStyle = '#2a2020'; ctx.fillRect(-2000, 1500, 5080, 10);
  bolt(ctx, 700, 120, 1.4, bl);
  const xs = [200, 540, 880];
  for (let i = 0; i < 3; i++) { const e = exs[i]; ctx.save(); ctx.translate(xs[i], 1500); ctx.scale(.55, .55); drawPad(ctx, 0, 0, 1); ctx.restore(); if (lt < e) drawRocket(ctx, xs[i], 1500, .55, t, { flame: .6, fin: ['#e0392f', '#2f63c9', '#f2b52a'][i] }); const k = (lt - e) / .9; if (k > 0) explosion(ctx, xs[i], 1270, 230, k, 11 + i); if (lt > e + .3) puff(ctx, xs[i], 1180 - (lt - e) * 60, 150, t, '#3a3440', 60 + i, .85); }
  // calendar
  const cb = pop(lt, .05, .3);
  ctx.save(); ctx.translate(540, 470); ctx.scale(cb, cb); drawCalendar(ctx, 0, 0, 1, '2008', 'ANO'); ctx.restore();
  for (const e of exs) flash(ctx, kf(lt, [[e, .55], [e + .18, 0]]) * (lt > e ? 1 : 0), '#ffe8c0');
} });
// 16 — days from bankruptcy
SHOTS.push({ start: 37.9, end: 40.05, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 960, 1.05, 1.2, 2.15, 6);
  plainBG(ctx, cam, '#3a0f18', '#7a1f2a');
  applyCam(ctx, cam, .2); rays(ctx, 540, 1000, -t, 'rgba(255,60,60,.12)');
  applyCam(ctx, cam, 1);
  floor(ctx, 1640, '#4a1a22', '#2a0a12');
  drawStick(ctx, C(ELON, { x: 540, y: 1660, s: 760, arms: { L: [.75, -.4], R: [.75, -.4] }, face: { eyes: 'wide', mouth: 'teeth', browAng: -.4, browUp: 1, look: [0, 0] }, lean: Math.sin(t * 30) * .01 }));
  // pockets turned out
  for (const sd of [-1, 1]) { ellipse(ctx, 540 + sd * 105, 1440, 34, 46); fillStroke(ctx, '#f6f2ea', 6); }
  sweat(ctx, 690, 980, 40, 1); sweat(ctx, 380, 1040, 30, clamp((lt - .5) * 3));
  // countdown calendar
  const d = lt < .9 ? '3' : lt < 1.5 ? '2' : '1';
  const fl = ((lt < .9 ? lt : lt < 1.5 ? lt - .9 : lt - 1.5) < .12) ? 1 - ((lt < .9 ? lt : lt < 1.5 ? lt - .9 : lt - 1.5) / .12) : 0;
  drawCalendar(ctx, 540, 430, 1.05, d, 'DIAS', fl * .8);
  // empty wallet moth
  const mk = clamp((lt - .3) / 1.6); ctx.save(); ctx.translate(820 + Math.sin(t * 7) * 30, 1200 - mk * 300); ctx.globalAlpha = clamp(mk * 4); for (const sd of [-1, 1]) { ellipse(ctx, sd * 30, 0, 32, 20 + Math.sin(t * 30) * 8, sd * .4); fillStroke(ctx, '#d8d0c0', 4); } ellipse(ctx, 0, 0, 10, 24); fillStroke(ctx, '#6a5a4a', 4); ctx.restore();
} });
// 17 — the fourth launch works
SHOTS.push({ start: 40.05, end: 43.25, tr: 'whip', draw(ctx, lt, t) {
  const L0 = .6; const climb = lt < L0 ? 0 : Math.pow(lt - L0, 2) * 380;
  const alt = clamp(climb / 1800);
  const cam = cam0(t, lt, 540, 960 - Math.min(climb, 2600) * .0, 1.0, 1.08, 3.2, 4);
  // sky darkens to space as the rocket climbs
  applyCam(ctx, cam, .05); const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, mix('#3ea6ee', '#0d0a2e', alt)); g.addColorStop(1, mix('#c9ecfb', '#3a1d5c', alt)); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 5080, 6000);
  applyCam(ctx, cam, .12); ctx.save(); ctx.globalAlpha = alt; starfield(ctx, t, 3); ctx.restore();
  applyCam(ctx, cam, 1);
  // world scrolls down while the rocket stays mid-frame
  const ry = 1500 - Math.min(climb, 450), scroll = Math.max(0, climb - 450);
  ctx.save(); ctx.translate(0, scroll);
  ctx.fillStyle = '#c9b07a'; ctx.fillRect(-2000, 1560, 5080, 3000);
  drawCloud(ctx, 200, 400, 140, 2, 1 - alt); drawCloud(ctx, 860, -200, 120, 3, 1 - alt); drawCloud(ctx, 300, -900, 160, 4, 1 - alt);
  drawPad(ctx, 540, 1500, 1);
  if (lt > .3) for (let i = 0; i < 4; i++) puff(ctx, 540 + (i - 1.5) * 170, 1540, 120, t, '#f3efe6', 30 + i, .9);
  ctx.restore();
  drawRocket(ctx, 540, ry, .95, t, { flame: lt > .3 ? 1.2 : .2, fin: '#3fa35b', label: '4' });
  if (lt > 2.6) { const k = (lt - 2.6) / 1.2; confetti(ctx, 540, 900, k, 3, 60); const b = pop(lt, 2.6); ctx.save(); ctx.translate(540, 420); ctx.scale(b, b); circle(ctx, 0, 0, 120); fillStroke(ctx, '#3fa35b', 9); ctx.beginPath(); ctx.moveTo(-55, 0); ctx.lineTo(-15, 45); ctx.lineTo(60, -45); ctx.lineWidth = 26; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
} });
// 18 — NASA contract
SHOTS.push({ start: 43.25, end: 44.55, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 980, 1.05, 1.14, 1.3, 3);
  plainBG(ctx, cam, '#1a2a5a', '#3a5aa0');
  applyCam(ctx, cam, .12); starfield(ctx, t, 12, 70);
  applyCam(ctx, cam, 1);
  floor(ctx, 1640, '#2a3a6a', '#1a2a50');
  const shake2 = Math.sin(t * 18) * .05;
  drawStick(ctx, C(ELON, { x: 300, y: 1660, s: 640, arms: { L: [.3, -.1], R: { ik: [.42, -.5 + shake2] } }, face: { eyes: 'happy', mouth: 'grin' } }));
  drawStick(ctx, C(ASTRO, { x: 780, y: 1660, s: 640, flip: -1, arms: { L: [.3, -.1], R: { ik: [.33, -.5 + shake2] } }, face: { eyes: 'normal', mouth: 'smile', look: [1, 0] } }));
  // contract
  const ck = pop(lt, .1, .3);
  ctx.save(); ctx.translate(540, 520); ctx.scale(ck, ck); ctx.rotate(-.05);
  rrect(ctx, -200, -230, 400, 460, 14); fillStroke(ctx, '#fbf6e8', 7);
  text(ctx, 'NASA', 0, -160, 64, '#2f4fb0', null, 0, 'Poppins', 700);
  text(ctx, 'CONTRATO', 0, -95, 40, INK, null, 0, 'Poppins', 700);
  for (let i = 0; i < 4; i++) line(ctx, -140, -30 + i * 40, 140 - (i % 2) * 60, -30 + i * 40, 6, 'rgba(60,50,40,.35)');
  const st = pop(lt, .7, .18); if (lt > .7) { ctx.save(); ctx.translate(70, 150); ctx.rotate(-.25); ctx.scale(1 + (1 - st) * 1.5, 1 + (1 - st) * 1.5); ctx.globalAlpha = st; rrect(ctx, -120, -50, 240, 100, 14); ctx.lineWidth = 9; ctx.strokeStyle = '#3fa35b'; ctx.stroke(); text(ctx, 'FECHADO', 0, 4, 44, '#3fa35b', null, 0, 'Poppins', 700); ctx.restore(); }
  ctx.restore();
} });
// 19 — Tesla dominates
SHOTS.push({ start: 44.55, end: 46.7, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 960, 1.0, 1.1, 2.15, 4);
  groundBG(ctx, cam, t, { hill: '#6cc35a' });
  applyCam(ctx, cam, 1);
  // podium of rising bars
  const bars = [[230, '#9aa0ab', .35], [540, '#e0392f', 1], [850, '#9aa0ab', .5]];
  const gk = easeOut(clamp((lt - .2) / 1.0));
  for (const [x, col, h] of bars) { const hh = 820 * h * gk; rrect(ctx, x - 120, 1600 - hh, 240, hh + 10, 12); fillStroke(ctx, col, 7); }
  ctx.fillStyle = '#4a9a3a'; ctx.fillRect(-2000, 1600, 5080, 3000);
  drawCar(ctx, 540, 1600 - 820 * gk + 4, .62, t, '#e0392f');
  drawCar(ctx, 230, 1600 - 820 * .35 * gk + 4, .5, t, '#6a707c', { flip: -1 });
  drawCar(ctx, 850, 1600 - 820 * .5 * gk + 4, .5, t, '#6a707c');
  if (lt > 1.2) { const c = pop(lt, 1.2, .3); drawCrown(ctx, 560, 1600 - 820 * gk - 160 - (1 - c) * 200, .9, .1); for (let i = 0; i < 6; i++) sparkle(ctx, 540 + Math.cos(i + t * 3) * 260, 700 + Math.sin(i * 2 + t * 3) * 120, 24, c); }
} });
// 20 — the rocket lands backwards
SHOTS.push({ start: 46.7, end: 48.1, tr: 'whip', draw(ctx, lt, t) {
  const land = 1.05; const k = clamp(lt / land);
  const ry = lerp(300, 1500, 1 - Math.pow(1 - k, 2.2));
  const hs = hit(lt, land, 18, .3);
  const cam = cam0(t, lt, 540 + hs[0], 960 + hs[1], 1.12, 1.0, 1.4, 3);
  groundBG(ctx, cam, t, { top: '#ff9a6a', bot: '#ffe0b0', hill: '#d8b07a' });
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#7a8a9a'; ctx.fillRect(-2000, 1560, 5080, 3000);
  ellipse(ctx, 540, 1530, 300, 50); fillStroke(ctx, '#3b3f4a', 6); text(ctx, 'X', 540, 1532, 60, '#fff', null, 0, 'Poppins', 700);
  drawRocket(ctx, 540, ry, .85, t, { flame: lt < land ? 1.0 - k * .3 : 0, fin: '#2b2f3a', legs: clamp((lt - .5) / .4) });
  if (lt > land) { const pk = clamp((lt - land) / .6); puff(ctx, 300, 1520, 130 * (1 + pk), t, '#f3efe6', 2, 1 - pk); puff(ctx, 780, 1520, 130 * (1 + pk), t, '#f3efe6', 5, 1 - pk); }
} });
// 21 — Starlink, Neuralink, X
SHOTS.push({ start: 48.1, end: 50.15, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 960, 1.0, 1.08, 2.05, 3);
  spaceBG(ctx, cam, t);
  applyCam(ctx, cam, 1);
  drawEarth(ctx, 540, 1700, 520, t);
  // orbit of satellites
  const sk = pop(lt, .05, .3);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI - Math.PI + t * .4; drawSatellite(ctx, 540 + Math.cos(a) * 640, 1700 + Math.sin(a) * 640, .95 * sk, a + Math.PI / 2); }
  ctx.save(); ctx.setLineDash([14, 16]); ctx.beginPath(); ctx.arc(540, 1700, 640, Math.PI, TAU); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.stroke(); ctx.restore();
  const nk = pop(lt, .48, .3); if (lt > .48) { ctx.save(); ctx.translate(270, 540); ctx.scale(nk, nk); drawChip(ctx, 0, 0, .95, t); ctx.restore(); }
  const xk = pop(lt, 1.78, .3); if (lt > 1.78) { ctx.save(); ctx.translate(800, 520); ctx.scale(xk, xk); drawXTile(ctx, 0, 0, 1.05, -.08); ctx.restore(); }
} });
// 22 — richest man on the planet
SHOTS.push({ start: 50.15, end: 53.05, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 1000, 1.0, 1.12, 2.9, 3);
  spaceBG(ctx, cam, t);
  applyCam(ctx, cam, .2); rays(ctx, 540, 800, t, 'rgba(255,230,120,.08)');
  applyCam(ctx, cam, 1);
  drawEarth(ctx, 540, 2150, 640, t * .5);
  const R = rng(71); for (let i = 0; i < 18; i++) { const x = R() * 1200 - 60, sp = 400 + R() * 400, y = ((R() * 2200 + lt * sp) % 2200) - 200; drawCoin(ctx, x, y, 30 + R() * 16, t * 6 + i); }
  drawStick(ctx, C(ELON, { x: 540, y: 1520, s: 760, arms: lt > 1.5 ? cheer(t) : POSE.hips.arms, face: lt > 1.5 ? { eyes: 'happy', mouth: 'grin' } : { eyes: 'smug', mouth: 'smirk' } }));
  const ck = clamp((lt - 1.15) / .4); if (lt > 1.15) drawCrown(ctx, 540, lerp(200, 1520 - .765 * 760 - .14 * 760, easeIn(ck)), .85);
  if (ck >= 1) { const s2 = kf(lt, [[1.55, 0], [1.7, 1], [2.2, 0]]); sparkle(ctx, 680, 820, 70 * s2, s2); sparkle(ctx, 400, 860, 50 * s2, s2); }
  if (lt > 1.6) { const b = pop(lt, 1.6); ctx.save(); ctx.translate(820, 330); ctx.scale(b, b); ctx.rotate(.12); burst(ctx, 0, 0, 130, 14, '#ffd23a', 6, .78); text(ctx, '#1', 0, 4, 100, '#e0392f', null, 0, 'Poppins', 700); ctx.restore(); }
} });
// 23 — genius or madman, who doesn't risk
SHOTS.push({ start: 53.05, end: 55.75, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 980, 1.1, 1.18, 2.7, 3);
  const mad = lt > .4 && lt < .75;
  plainBG(ctx, cam, mad ? '#7a4bc4' : '#2f9fd6', mad ? '#c97ae8' : '#a8e4f8');
  applyCam(ctx, cam, .2); rays(ctx, 540, 900, t);
  applyCam(ctx, cam, 1);
  floor(ctx, 1620, '#f2e2c0', '#d8c49a');
  const roll = lt > 1.5;
  drawStick(ctx, C(ELON, { x: 380, y: 1640, s: 720, t, arms: roll ? { L: [.3, -.1], R: [lt < 1.7 ? 2.0 : 1.4, -.3] } : (mad ? { L: [2.5, .6], R: [2.5, .6] } : { L: [.3, -.1], R: { ik: [.14, -.88], bend: -1 } }),
    face: mad ? { eyes: 'spiral', mouth: 'grin' } : roll ? { eyes: 'normal', mouth: 'grin', look: [1, .5], browAng: .3 } : { eyes: 'normal', mouth: 'smirk', look: [0, -1], browOne: 1 } }));
  if (lt < .4) { const b = pop(lt, 0, .25); drawBulb(ctx, 380, 600, .9 * b, 1); }
  if (mad) { for (let i = 0; i < 5; i++) star5(ctx, 380 + Math.cos(t * 8 + i) * 200, 760 + Math.sin(t * 8 + i) * 50, 28, t * 5, '#ffe14d'); }
  // the die: thrown on "arrisca", lands on 6
  if (roll) { const k = clamp((lt - 1.6) / .7); const dx = lerp(560, 820, k), dy = lerp(1100, 1520, k) - Math.abs(Math.sin(k * Math.PI * 2.2)) * 260 * (1 - k); drawDie(ctx, dx, dy, 1.1, (1 - k) * 9, k < 1 ? 1 + ((lt * 14) | 0) % 6 : 6); if (k >= 1) { const sk = kf(lt, [[2.3, 0], [2.42, 1], [2.7, 0]]); burst(ctx, dx, dy, 150 * sk, 12, '#ffd23a', 9); drawDie(ctx, dx, dy, 1.1, 0, 6); } }
} });
// 24 — Mars
SHOTS.push({ start: 55.75, end: 58.5, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 960, 1.0, 1.15, 2.75, 3);
  spaceBG(ctx, cam, t);
  applyCam(ctx, cam, .4); drawMars(ctx, 650, 620, 380, t);
  applyCam(ctx, cam, 1);
  const k = clamp(lt / 2.75);
  drawRocket(ctx, lerp(260, 470, k), lerp(1650, 1250, k), .6, t, { flame: 1, rot: .45, pilot: true, fin: '#e0392f' });
  if (lt > 1.2) { const q = pop(lt, 1.2); ctx.save(); ctx.translate(820, 1100); ctx.scale(q, q); circle(ctx, 0, 0, 110); fillStroke(ctx, '#fff', 8); text(ctx, '?', 0, 6, 140, '#e0392f', null, 0, 'Poppins', 700); ctx.restore(); }
} });
// 25 — comment below
SHOTS.push({ start: 58.5, end: 60.0, tr: 'cut', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 540, 960, 1.0, 1.06, 1.5, 2);
  plainBG(ctx, cam, '#ffd23a', '#ff9a3a');
  applyCam(ctx, cam, .2); rays(ctx, 540, 700, t, 'rgba(255,255,255,.18)');
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(ELON, { x: 330, y: 1240, s: 640, shadow: false, arms: { L: [.3, -.1], R: [.55, .1] }, face: { eyes: 'normal', mouth: 'grin', look: [.5, 1], browAng: .3 } }));
  const b = pop(lt, .1); ctx.save(); ctx.translate(760, 560); ctx.scale(b, b); drawCommentBubble(ctx, 0, 0, 1.1); ctx.restore();
  // bouncing arrow down
  const ay = 1520 + Math.abs(Math.sin(t * 7)) * 50;
  ctx.save(); ctx.translate(540, ay); path(ctx, [[-50, 0], [50, 0], [50, 90], [110, 90], [0, 210], [-110, 90], [-50, 90]]); fillStroke(ctx, '#e0392f', 8); ctx.restore();
} });
