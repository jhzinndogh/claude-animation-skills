// ---------- "Dia 1 sendo o Mark Grayson" ----------
const C = (base, extra) => Object.assign({}, base, extra);
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const FLY = { arms: { L: [2.9, 0], R: [.5, -.4] }, legs: { L: [.25, -.3], R: [-.05, -.1] } };
const SHOTS = [];

function alley(ctx, cam, t) {
  applyCam(ctx, cam, .1); drawSky(ctx, '#ff9a5a', '#ffd9a0', -400, 900);
  applyCam(ctx, cam, .15); drawCloud(ctx, 200 + t * 8, 200, 110, 1); drawCloud(ctx, 850 + t * 5, 380, 80, 2);
  applyCam(ctx, cam, 1);
  brickWall(ctx, -300, 560, 1400, 1420);
  rrect(ctx, 80, 860, 220, 520, 8); fillStroke(ctx, '#6a4a3a', 8); circle(ctx, 270, 1130, 12); fillStroke(ctx, '#e8c04a', 4);
  burgerSign(ctx, 640, 760, .85, t);
  ctx.fillStyle = '#6d6a72'; ctx.fillRect(-300, 1380, 1700, 900); line(ctx, -300, 1380, 1400, 1380, 8);
}

// 0 — hook: throw the bag, it launches like a rocket
SHOTS.push({ start: 0, end: 2.6, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1] - lt * 30, z: 1.05 + lt * .04 };
  alley(ctx, cam, t); applyCam(ctx, cam, 1);
  dumpster(ctx, 830, 1420, .9, kf(lt, [[.9, 0], [1.1, .5], [1.6, 0]]));
  const wind = kf(lt, [[0, 0], [.85, 1], [1.05, -1, easeOut]]);
  const throwT = 1.0, fly = clamp((lt - throwT) / 1.2);
  drawStick(ctx, C(WORKMARK, { x: 380, y: 1450, s: 560, lean: -wind * .08,
    arms: { L: [.4, -.2], R: [lerp(.6, 3.0, (wind + 1) / 2) * (wind < 0 ? 1 : .6) + (wind < 0 ? .2 : 0), -.2] },
    face: lt < throwT ? { eyes: 'normal', mouth: 'flat', look: [.5, -.3] } : { eyes: 'wide', mouth: 'o', look: [.6, -1], browUp: 1 } }));
  if (lt < throwT) { const a = lerp(.6, 3, (wind + 1) / 2) * .6; trashBag(ctx, 380 + 100 * .56 * 0 + Math.sin(a) * 160 + 60, 1450 - .535 * 560 + Math.cos(a) * 160, .9, a); }
  else {
    const bx = lerp(560, 700, fly), by = lerp(1060, -500, easeIn(fly));
    rocketTrail(ctx, bx, by + 40, 600 * fly + 100, t); trashBag(ctx, bx, by, .9, Math.sin(t * 30) * .1);
    const k = kf(lt, [[throwT, 0], [throwT + .08, 1], [throwT + .3, 0]]); burst(ctx, 560, 1080, 160 * k + 1, 11, '#ffd23a', 5); flash(ctx, k * .5);
  }
} });
// 1 — looking up, bag vanishes into the sky
SHOTS.push({ start: 2.6, end: 5.4, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 5);
  const cam = { x: 540 + hh[0], y: 900 + hh[1] + lt * 20, z: 1 + lt * .05 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#3a8ee8', '#ffc98a', -400, 1500);
  applyCam(ctx, cam, .4); drawCloud(ctx, 220, 500 + lt * 120, 130, 3); drawCloud(ctx, 860, 300 + lt * 160, 100, 4); drawCloud(ctx, 540, 900 + lt * 90, 90, 6, .9);
  const p = clamp(lt / 2.4); const by = lerp(900, 120, easeOut(p)), bs = lerp(.7, .08, p);
  applyCam(ctx, cam, 1);
  rocketTrail(ctx, 560, by + 30 * bs, 700 * bs + 80, t); trashBag(ctx, 560, by, bs);
  if (lt > 2.2) { const k = clamp((lt - 2.2) / .2); sparkle(ctx, 560, by, 60 * k * (1 - clamp((lt - 2.5) / .3)), 1); }
  drawStick(ctx, C(WORKMARK, { x: 540, y: 2350, s: 1300, headTilt: -.1, shadow: false, arms: { L: [.3, -.1], R: [.3, -.1] },
    face: { eyes: 'wide', mouth: 'o', look: [0, -1], browUp: 1.2 } }));
} });
// 2 — orbit
SHOTS.push({ start: 5.4, end: 8.3, tr: 'whip', draw(ctx, lt, t) {
  const cam = { x: 540, y: 960, z: 1 + lt * .05, r: Math.sin(t * .4) * .02 };
  applyCam(ctx, { x: 540, y: 960, z: 1 }, 0); space(ctx); stars(ctx, t);
  applyCam(ctx, cam, 1); earth(ctx, 540, 1900, 1050, t);
  const a = -2.4 + lt * .55; const ox = 540 + Math.cos(a) * 560, oy = 1000 + Math.sin(a) * 260;
  ctx.save(); ctx.globalAlpha = .4; ctx.setLineDash([16, 20]); ctx.beginPath(); ctx.ellipse(540, 1000, 560, 260, 0, Math.PI, TAU); ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
  trashBag(ctx, ox, oy, .7, t * 1.5);
  const ar = kf(lt, [[1.2, 0], [1.5, 1, backOut]]);
  if (ar > 0) { ctx.save(); ctx.translate(ox, oy - 150); ctx.scale(ar, ar); text(ctx, 'em órbita', 0, 0, 64, '#ffd23a', INK, 12); ctx.restore(); }
} });
// 3 — hands, shock
SHOTS.push({ start: 8.3, end: 11.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 4); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .06 };
  applyCam(ctx, cam, 1); ctx.fillStyle = '#ffcf3a'; ctx.fillRect(-500, -500, 2080, 2920);
  for (let i = 0; i < 24; i++) { ctx.save(); ctx.translate(540, 700); ctx.rotate(i / 24 * TAU + t * .3); path(ctx, [[0, 0], [-90, 1800], [90, 1800]]); ctx.fillStyle = i % 2 ? '#ffb02a' : '#ffcf3a'; ctx.fill(); ctx.restore(); }
  const glow = .5 + .5 * Math.sin(t * 8);
  drawStick(ctx, C(MARK, { x: 540, y: 1950, s: 1500, shadow: false, armLen: 1.2,
    arms: { L: { ik: [-.13, -.62], bend: -1 }, R: { ik: [.13, -.62], bend: -1 } },
    prop: (c, k, p) => { circle(c, p[0], p[1], .05); c.fillStyle = `rgba(255,255,255,${.5 * glow})`; c.fill(); },
    face: { eyes: 'wide', mouth: 'o', look: [0, 1], browUp: 1.3 } }));
  sweat(ctx, 760, 520, 50); sparkle(ctx, 300, 900, 50 * glow, 1); sparkle(ctx, 800, 950, 40 * (1 - glow), 1);
} });
// 4 — powers: flying through the clouds
SHOTS.push({ start: 11.2, end: 14.8, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 6); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.05 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#2f8fe8', '#bfe6ff', -400, 2000);
  applyCam(ctx, cam, .5); for (let i = 0; i < 5; i++) drawCloud(ctx, (i * 300 + 100) % 1200, ((i * 520 + lt * 1400) % 2400) - 300, 120, i + 1);
  applyCam(ctx, cam, 1); vLines(ctx, t);
  const y = 1050 + Math.sin(t * 3) * 25;
  drawStick(ctx, C(MARK, { x: 540, y, s: 620, lean: 0, shadow: false, ...FLY, face: { eyes: 'normal', mouth: 'grin', look: [0, -.6], browAng: -.15 } }));
  const pops = [['superforça', 11.5], ['voo', 12.7], ['resistência', 13.5]];
  pops.forEach(([w, at], i) => { const k = kf(lt + 11.2, [[at, 0], [at + .25, 1, backOut]]); if (k > 0) { ctx.save(); ctx.translate([270, 810, 540][i], [420, 520, 330][i]); ctx.rotate([-.12, .1, -.04][i]); ctx.scale(k, k); rrect(ctx, -170, -50, 340, 100, 24); fillStroke(ctx, ['#ff5a4a', '#ffcf3a', '#5ad0ff'][i], 8); text(ctx, w, 0, 4, 46, INK); ctx.restore(); } });
} });
// 5 — the father flying, serious
SHOTS.push({ start: 14.8, end: 18.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .07 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#1d4f9e', '#7fb8f0', -400, 2000);
  applyCam(ctx, cam, .4); drawCloud(ctx, 200, 1500 - lt * 80, 160, 2); drawCloud(ctx, 900, 1700 - lt * 60, 140, 4);
  applyCam(ctx, cam, 1);
  const x = 540, y = 1350 + Math.sin(t * 2) * 15, s = 900;
  drawCape(ctx, x, y, s, t, -1, 1.3);
  drawStick(ctx, C(NOLAN, { x, y, s, shadow: false, arms: { L: [.9, -2.2], R: [.9, -2.2] }, legs: { L: [.08, -.02], R: [.04, -.02] },
    face: { eyes: 'half', mouth: 'flat', browAng: .35, look: [0, .3] } }));
  // red emblem
  circle(ctx, x, y - .45 * s, .045 * s); fillStroke(ctx, '#d42b2b', 6);
  const q = kf(lt, [[.2, 0], [.5, 1, backOut]]); if (q > 0) { ctx.save(); ctx.translate(840, 330); ctx.scale(q, q); text(ctx, '?', 0, 0, 220, '#ffd23a', INK, 16); ctx.restore(); }
} });
// 6 — the massacre to come
SHOTS.push({ start: 18.6, end: 22.4, tr: 'whip', draw(ctx, lt, t) {
  const sh = lt > .9 && lt < 1.4 ? shake(t, 18) : [0, 0]; const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1.02 + lt * .05 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#3a0610', '#d2332a', -400, 1600);
  applyCam(ctx, cam, 1); ctx.fillStyle = '#2a0a10'; ctx.fillRect(-300, 1300, 1700, 900);
  const heroes = [[160, '#3fa35b'], [330, '#f2b52a'], [720, '#2f63c9'], [900, '#7a4bc4']];
  heroes.forEach(([x, c], i) => drawStick(ctx, { x, y: 1320, s: 330, sil: '#140408', flip: i < 2 ? 1 : -1, arms: POSE.handsUp.arms, lean: i < 2 ? .1 : -.1, face: {} }));
  const y = kf(lt, [[0, 300], [.9, 1000, easeIn]]);
  drawCape(ctx, 540, y, 520, t, 1, 1.2, '#5a0a10');
  drawStick(ctx, { x: 540, y, s: 520, sil: '#0b0204', eyesGlow: true, shadow: false, face: { eyes: 'squint' }, arms: { L: [2.6, .2], R: [2.6, .2] }, legs: { L: [.1, -.05], R: [.1, -.05] } });
  const k = kf(lt, [[.85, 0], [.95, 1], [1.5, 0]]); burst(ctx, 540, 1250, 400 * k + 1, 14, '#ffcf3a', 8); flash(ctx, k * .7, '#fff');
  if (lt > 1.2) { const p = kf(lt, [[1.2, 0], [1.6, 1, backOut]]); ctx.save(); ctx.translate(540, 420); ctx.scale(p, p); text(ctx, 'GUARDIÕES GLOBAIS', 0, 0, 72, '#fff', '#140408', 14); ctx.restore(); }
} });
// 7 — dinner
SHOTS.push({ start: 22.4, end: 28.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: kf(lt, [[0, 960], [5.8, 1000]]) + hh[1], z: kf(lt, [[0, 1], [5.8, 1.18]]) };
  applyCam(ctx, cam, 1); room(ctx);
  const serve = kf(lt, [[.8, 0], [1.8, 1], [3, 0]]);
  drawStick(ctx, C(MOM, { x: 540, y: 1200, s: 520, arms: { L: { ik: [-.25, -.5 + serve * .1] }, R: { ik: [.3, -.42 - serve * .15] } }, face: { eyes: 'happy', mouth: 'smile', blush: true } }));
  drawStick(ctx, C(NOLAN_HOME, { x: 860, y: 1290, s: 560, flip: -1, arms: { L: [.5, -1], R: [.5, -1] }, face: { eyes: lt > 2.5 ? 'half' : 'normal', look: [1, 0], mouth: 'flat', browAng: lt > 2.5 ? .3 : 0 } }));
  drawStick(ctx, C(MARK, { x: 220, y: 1290, s: 560, arms: { L: [.5, -1], R: [.5, -1] }, face: { eyes: 'wide', look: [lt > 2.5 ? 1 : 0, 0], mouth: lt > 2.5 ? 'teeth' : 'smile' } }));
  table(ctx, 1150);
  // food steam
  for (const px of [220, 540, 860]) { ellipse(ctx, px, 1135, 60, 22); fillStroke(ctx, '#e8a33a', 5); puff(ctx, px + Math.sin(t * 2 + px) * 10, 1060 - (t * 40 + px) % 80, 22, t, '#fff', px, .6); }
  if (lt > 3) sweat(ctx, 320, 640, 40, clamp((lt - 3) * 3));
} });
// 8 — dad suspicious close-up
SHOTS.push({ start: 28.2, end: 31.6, tr: 'whip', draw(ctx, lt, t) {
  const cam = { x: 540, y: 960, z: 1 + lt * .08 };
  applyCam(ctx, cam, 1); room(ctx); ctx.fillStyle = 'rgba(30,10,30,.35)'; ctx.fillRect(-500, -500, 2080, 2920);
  drawStick(ctx, C(NOLAN_HOME, { x: 540, y: 2250, s: 1700, shadow: false, headTilt: Math.sin(t) * .02, face: { eyes: 'half', mouth: 'flat', browAng: .4, look: [kf(lt, [[0, -.6], [1.5, .2]]), 0] } }));
  const k = kf(lt, [[1.6, 0], [1.9, 1, backOut]]); if (k > 0) { ctx.save(); ctx.translate(540, 300); ctx.scale(k, k); text(ctx, 'treinamento amanhã', 0, 0, 62, '#ffd23a', INK, 12); ctx.restore(); }
} });
// 9 — countdown to destruction
SHOTS.push({ start: 31.6, end: 35.4, tr: 'whip', draw(ctx, lt, t) {
  const sh = shake(t, 4 + lt * 3); const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1 + lt * .05 };
  applyCam(ctx, cam, 0); space(ctx); stars(ctx, t);
  applyCam(ctx, cam, 1); earth(ctx, 540, 820, 380, t, clamp(lt / 3.5) * .8);
  const n = Math.max(1, 3 - Math.floor(lt / 1.2)); const ph = (lt % 1.2) / 1.2;
  ctx.save(); ctx.translate(540, 820); ctx.scale(1.3 - ph * .3, 1.3 - ph * .3); ctx.globalAlpha = 1 - ph * .4; text(ctx, String(n), 0, 0, 380, '#ff3a3a', INK, 22); ctx.restore();
  ctx.fillStyle = `rgba(255,0,0,${.12 + .1 * Math.sin(t * 10)})`; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillRect(0, 0, W, H);
} });
// 10-13 — the choices
const OPTS = [['conto pro pai', '#5ad0ff'], ['aviso os guardiões', '#7fe07a'], ['conquisto a terra', '#ff5a4a']];
function choiceScene(hi) {
  return function (ctx, lt, t) {
    const cam = { x: 540, y: 960, z: 1 + lt * .02 };
    applyCam(ctx, cam, 1); ctx.fillStyle = '#1b1530'; ctx.fillRect(-500, -500, 2080, 2920);
    for (let i = 0; i < 24; i++) { ctx.save(); ctx.translate(540, 440); ctx.rotate(i / 24 * TAU + t * .15); path(ctx, [[0, 0], [-80, 1800], [80, 1800]]); ctx.fillStyle = i % 2 ? '#2a2148' : '#1b1530'; ctx.fill(); ctx.restore(); }
    // frozen face of Mark
    ctx.save(); ctx.beginPath(); ctx.arc(540, 440, 220, 0, TAU); ctx.clip(); ctx.fillStyle = '#ffcf3a'; ctx.fillRect(300, 200, 500, 500);
    drawStick(ctx, C(MARK, { x: 540, y: 440 + .765 * 1100, s: 1100, shadow: false, face: hi === 2 ? { eyes: 'squint', mouth: 'grin' } : hi === 1 ? { eyes: 'normal', mouth: 'flat', look: [-1, 0], browAng: -.2 } : hi === 0 ? { eyes: 'wide', mouth: 'smile' } : { eyes: 'wide', mouth: 'o', browUp: 1 } }));
    ctx.restore(); circle(ctx, 540, 440, 220); fillStroke(ctx, null, 12, '#fff');
    OPTS.forEach(([lab, col], i) => {
      const a = hi < 0 ? kf(lt, [[.9 + i * .35, 0], [1.2 + i * .35, 1]]) : 1;
      const dim = hi >= 0 && hi !== i ? .45 : 1;
      choiceBox(ctx, 540, 790 + i * 160, 860, 130, i + 1, lab, a * dim, hi === i ? 1 + .3 * Math.sin(t * 8) * 0 : 0, col);
    });
    if (hi >= 0) { // pick tick
      const k = kf(lt, [[.15, 0], [.4, 1, backOut]]); ctx.save(); ctx.translate(930, 790 + hi * 160); ctx.scale(k, k); burst(ctx, 0, 0, 60, 9, OPTS[hi][1], hi + 2); ctx.restore();
    }
  };
}
SHOTS.push({ start: 35.4, end: 39.4, tr: 'cut', draw: choiceScene(-1) });
SHOTS.push({ start: 39.4, end: 42.8, tr: 'cut', draw: choiceScene(0) });
SHOTS.push({ start: 42.8, end: 47.8, tr: 'cut', draw: choiceScene(1) });
SHOTS.push({ start: 47.8, end: 51.9, tr: 'whip', draw: choiceScene(2) });
// 14 — logo with blood splash
SHOTS.push({ start: 51.9, end: 56.8, tr: 'cut', draw(ctx, lt, t) {
  const sh = lt < .4 ? shake(t, 20) : [0, 0]; const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1 + lt * .03 };
  applyCam(ctx, cam, 1); ctx.fillStyle = '#ffd400'; ctx.fillRect(-500, -500, 2080, 2920);
  const blink = (Math.floor(lt * 4) % 2 === 0 || lt > 2) ? 1 : .25;
  bloodSplat(ctx, 700, 560, 200, kf(lt, [[.05, 0], [.25, 1, easeOut]]), 7);
  ctx.save(); ctx.translate(540, 640); ctx.rotate(-.05); const s = kf(lt, [[0, 1.6], [.2, 1, easeOut]]); ctx.scale(s, s); ctx.globalAlpha = blink;
  text(ctx, 'INVENCÍVEL', 0, 0, 150, '#2f6fd6', INK, 22); ctx.restore();
  const k = kf(lt, [[1.5, 0], [1.8, 1, backOut]]); if (k > 0) { ctx.save(); ctx.translate(540, 950); ctx.scale(k, k); rrect(ctx, -300, -70, 600, 140, 70); fillStroke(ctx, '#e23a2f', 10); text(ctx, 'dia 2 →', 0, 4, 72, '#fff', INK, 10); ctx.restore(); }
  flash(ctx, kf(lt, [[0, .8], [.25, 0]]));
} });
