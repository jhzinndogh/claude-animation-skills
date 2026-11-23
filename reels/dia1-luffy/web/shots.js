// ---------- Dia 1 sendo o Luffy: shot list (seconds of the voiceover) ----------
const C = (base, extra) => Object.assign({}, base, extra);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const blinkAt = (lt, ...ts) => ts.some(b => lt > b && lt < b + .12) ? 1 : 0;
const pop = (lt, t0, d = .35) => backOut(clamp((lt - t0) / d));
const HIPS = { L: [.9, -2.2], R: [.9, -2.2] };
const SHRUG = { L: [1.5, 1.3], R: [1.5, 1.3] };

// open-sea deck of the cruise ship
function cruiseBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, o.skyTop || '#3ea6ee', o.skyBot || '#c9ecfb');
  if (o.sun) { applyCam(ctx, cam, .1); drawSun(ctx, o.sun[0], o.sun[1], o.sun[2], t, o.sunPow || 1); }
  applyCam(ctx, cam, .14);
  drawCloud(ctx, 160 + t * 6, 260, 120, 1); drawCloud(ctx, 760 + t * 4, 150, 90, 2); drawCloud(ctx, 1050 + t * 5, 420, 70, 3, .9);
  const hz = o.horizon || 760;
  applyCam(ctx, cam, .45); drawSea(ctx, hz, t);
  if (o.farShip) drawShip(ctx, o.farShip[0], hz + 40, o.farShip[1], t, { skull: true, heart: true, flag: '#1b1820', hull: '#4a2a3a', sail: '#f6c9dc', ph: 1 });
  applyCam(ctx, cam, 1);
  drawBulwark(ctx, o.back || 1000, o.wallH || 140, -600, 1680, o.wall || '#f1ede4');
  drawDeckFloor(ctx, o.back || 1000, o.vx || 540);
}
function seaBG(ctx, t, cam, hz = 900, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, o.skyTop || '#4aaeea', o.skyBot || '#fbe9c4', -300, hz + 50);
  applyCam(ctx, cam, .1); if (o.sun !== false) drawSun(ctx, o.sunX || 820, hz - 520, 85, t, 1.1);
  applyCam(ctx, cam, .15); drawCloud(ctx, 150 + t * 5, hz - 480, 110, 5); drawCloud(ctx, 1000 + t * 4, hz - 340, 80, 6);
  applyCam(ctx, cam, .55); drawSea(ctx, hz, t);
  applyCam(ctx, cam, 1);
}

const SHOTS = [];
// A — dark, waves, the barrel bursts and Luffy pops out stretching
SHOTS.push({ start: 0, end: 1.92, tr: 'whip', draw(ctx, lt, t) {
  const B = .35, hit = lt > B;
  const sh = hit ? shake(t, 26 * Math.exp(-(lt - B) * 5), 3) : [0, 0];
  const cam = { x: 540 + sh[0], y: 980 + sh[1], z: kf(lt, [[0, 1.12], [B, 1.12], [1.92, 1.0]]), r: 0 };
  cruiseBG(ctx, t, cam, { sun: [900, 200, 70], back: 1020 });
  applyCam(ctx, cam, 1);
  drawBarrel(ctx, 140, 1220, 1.2); drawCrate(ctx, 960, 1260, 200, 160, 0, 'RUM');
  if (!hit) { const wob = Math.sin(lt * 40) * .03 * inv(.1, B, lt); ctx.save(); ctx.translate(540, 1560); ctx.rotate(wob); drawBarrel(ctx, 0, 0, 2.6); ctx.restore(); }
  else {
    const k = lt - B; const up = kf(k, [[0, 0], [.35, 1, backOut]]);
    const stretch = kf(k, [[0, 1.25], [.3, .9], [.6, 1.05], [.9, 1]]);
    drawStick(ctx, C(LUFFY, { x: 540, y: 1560 - 120 * up, s: 640, squash: stretch, arms: { L: [2.25, .35], R: [2.25, .35] }, legs: { L: [.1, -.05], R: [.1, -.05] },
      face: k < 1.1 ? { eyes: 'happy', mouth: 'o' } : { eyes: 'normal', mouth: 'grin', look: [.3, 0] }, shadow: false }));
    // barrel stub in front of his legs
    ctx.save(); ctx.translate(540, 1560); ctx.scale(1, .45); drawBarrel(ctx, 0, 0, 2.6); ctx.restore();
    for (const [i, f] of [.05, .18, .3, .7, .82, .95].entries()) { const a = -Math.PI * f; const d = k * 1500; plank(ctx, 540 + Math.cos(a) * d, 1300 + Math.sin(a) * d + k * k * 1800, 140, k * 9 + i); }
    puff(ctx, 540, 1250, 200 * (1 + k), t, '#efe3cf', 4, kf(k, [[0, 1], [.6, 0]]));
    if (k < .25) burst(ctx, 540, 1250, 330 * (1 + k * 2), 13, '#ffd23a', 5);
  }
  darkness(ctx, hit ? kf(lt - B, [[0, .0], [.01, 0]]) : .93);
  flashScreen(ctx, hit ? kf(lt - B, [[0, .9], [.18, 0]]) : 0);
} });
// B — sitting in the broken barrel, rubbing his eyes, looking around
SHOTS.push({ start: 1.92, end: 5.36, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1050 + hh[1], z: 1.05 + lt * .03, r: 0 };
  cruiseBG(ctx, t, cam, { sun: [880, 180, 70], back: 1000 });
  applyCam(ctx, cam, 1);
  drawMast(ctx, 140, -900, 1000, 64);
  drawBarrel(ctx, 980, 1120, 1.05); drawCrate(ctx, 860, 1180, 160, 130, 0);
  const rub = lt < 1.5; const look = lt > 1.7 ? (lt < 2.5 ? [-1, 0] : [1, 0]) : [0, 0];
  const rubY = Math.sin(lt * 18) * .02;
  drawStick(ctx, C(LUFFY, { x: 540, y: 1560, s: 640, shadow: false,
    arms: rub ? { L: [.4, -.2], R: { ik: [.05, -.8 + rubY], bend: -1 } } : { L: [.3, -.1], R: [.3, -.1] },
    face: rub ? { eyes: 'squint', eyesL: 'normal', mouth: 'flat', look: [0, 0] } : { eyes: 'normal', mouth: lt > 2.7 ? 'o' : 'flat', look, blink: blinkAt(lt, 1.55) }, headTilt: rub ? .08 : look[0] * .06 }));
  if (rub) { circle(ctx, 540 + .07 * 640, 1560 - (.77 - rubY) * 640, 24); ctx.fillStyle = INK; ctx.fill(); }
  ctx.save(); ctx.translate(540, 1560); ctx.scale(1, .45); drawBarrel(ctx, 0, 0, 2.6); ctx.restore();
  plank(ctx, 220, 1640, 160, .3); plank(ctx, 860, 1680, 170, -.5);
  if (lt > 2.6) { const a = kf(lt, [[2.6, 0], [2.8, 1]]); text(ctx, '?', 760, 520 - (lt - 2.6) * 20, 170 * a, '#fff', INK, 14); text(ctx, '?', 760, 520 - (lt - 2.6) * 20, 170 * a, '#fff', INK, 0); }
} });
// C — wide: the cruise ship is being boarded by Alvida's pirates
SHOTS.push({ start: 5.36, end: 8.48, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + lt * 20, y: 860 + hh[1], z: 1.0 + lt * .05, r: 0 };
  seaBG(ctx, t, cam, 930);
  drawShip(ctx, 820, 1250, 1.0, t, { flag: '#2a63c8', hull: '#f4f1ea', stripe: '#2f63c9', sail: '#ffffff', ph: 2, flip: -1 });
  drawShip(ctx, 250, 1420, 1.1, t, { skull: true, heart: true, flag: '#1b1820', hull: '#4a2a3a', stripe: '#ff6fa8', sail: '#f6c9dc', ph: 0 });
  for (let i = 0; i < 3; i++) line(ctx, 420 + i * 60, 1300 - i * 6, 640 + i * 50, 1170 - i * 4, 4, '#4a3424');
  for (let j = 0; j < 2; j++) {
    const th = kf(lt - j * .7, [[0, -.7], [1.6, .55]]); const px = 480 + j * 140, py = 700 + j * 40, L = 360;
    const hx = px + Math.sin(th) * L, hy = py + Math.cos(th) * L;
    line(ctx, px, py, hx, hy, 3, '#4a3424');
    drawStick(ctx, C(ALVIDA_PIRATE, { x: hx, y: hy + 66, s: 75, shadow: false, arms: { L: [.3, -.2], R: { ik: [.02, -.95] } }, legs: { L: [.6, -.9], R: [.4, -.8] }, face: { eyes: 'wide', mouth: 'grin' } }));
  }
  if (lt > 1.7) { const k = lt - 1.7; puff(ctx, 520, 1330, 60 + k * 90, t, '#e6e1d6', 8, clamp(1 - k)); if (k < .15) burst(ctx, 520, 1330, 70, 9, '#ffb03a', 3); }
  caribbeanHeat(ctx, .25);
} });
function caribbeanHeat(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(900, 200, 50, 900, 200, 1500); g.addColorStop(0, `rgba(255,220,120,${.55 * a})`); g.addColorStop(1, `rgba(255,170,60,${.12 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
// D — only two things on his mind: eat, and become King of the Pirates
SHOTS.push({ start: 8.48, end: 12.24, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1], z: 1 + lt * .03, r: 0 };
  cruiseBG(ctx, t, cam, { sun: [900, 200, 60], back: 1150, horizon: 900 });
  applyCam(ctx, cam, 1);
  const meat = pop(lt, 1.85), crown = pop(lt, 2.75);
  drawStick(ctx, C(LUFFY, { x: 560, y: 1720, s: 780, shadow: false, headTilt: Math.sin(t * 2) * .03 - .05,
    arms: { L: [.35, -.15], R: { ik: [.14, -.72], bend: -1 } },
    face: { eyes: crown > .5 ? 'wide' : 'normal', look: [-.4, -.8], mouth: meat > .5 ? 'grin' : 'smile', browUp: .5 } }));
  if (meat > .3 && crown < .5) sweat(ctx, 600, 1240 + (lt - 1.85) * 40, 22, 1);
  const ba = kf(lt, [[.2, 0], [.5, 1]]);
  drawBubble(ctx, 470, 560, 470 * ba, [520, 1030], ba);
  if (meat > 0) drawMeat(ctx, 300, 560, .95 * meat, -.25 + Math.sin(t * 4) * .05);
  if (crown > 0) { drawCrown(ctx, 640, 500, .95 * crown); sparkle(ctx, 760, 400, 40 * crown, crown); }
} });
// E — flashback: he left his village this morning in a tiny boat
SHOTS.push({ start: 12.24, end: 15.12, tr: 'cut', draw(ctx, lt, t) {
  const z = kf(lt, [[0, 1.0], [1.9, 1.05], [2.6, 1.7]]);
  const bx = 380 + lt * 120;
  const cam = { x: lerp(540, bx, inv(1.9, 2.6, lt)), y: lerp(960, 1080, inv(1.9, 2.6, lt)), z, r: 0 };
  seaBG(ctx, t, cam, 960, { sunX: 300 });
  drawIsland(ctx, 260, 985, 1.15, t);
  drawRowboat(ctx, bx, 1110, .42, t);
  drawStick(ctx, C(LUFFY, { x: bx - 22, y: 1095, s: 95, shadow: false, arms: { L: [.3, -.1], R: [2.6 + Math.sin(t * 9) * .3, .2] }, face: { eyes: 'happy', mouth: 'grin' } }));
  sepia(ctx, .55);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = 'rgba(60,40,20,.25)'; ctx.lineWidth = 3; const R = rng(Math.floor(t * 12)); for (let i = 0; i < 3; i++) { const x = R() * W; line(ctx, x, 0, x + 6, H, 2, 'rgba(60,40,20,.18)'); } ctx.restore();
} });
// F — swallowed by a whirlpool, he dives into a barrel
SHOTS.push({ start: 15.12, end: 18.88, tr: 'whip', draw(ctx, lt, t) {
  const sh = shake(t, 6, 2);
  const cam = { x: 540 + sh[0], y: 980 + sh[1], z: 1 + lt * .06, r: Math.sin(t * 1.5) * .02 };
  seaBG(ctx, t, cam, 620, { skyTop: '#5d7f9e', skyBot: '#a9c3d4', sun: false });
  applyCam(ctx, cam, 1);
  drawWhirlpool(ctx, 540, 1150, 760, t);
  const J = 1.75; // jump into the barrel
  const ang = lt * 3.2, rad = lerp(520, 300, clamp(lt / J));
  const bx = 540 + Math.cos(ang) * rad, by = 1150 + Math.sin(ang) * rad * .42;
  const barrelAng = ang + .9, brad = lerp(450, 60, clamp((lt - J) / 1.9));
  const rx = 540 + Math.cos(barrelAng + Math.max(0, lt - J) * 2) * brad, ry = 1150 + Math.sin(barrelAng + Math.max(0, lt - J) * 2) * brad * .42;
  drawRowboat(ctx, bx, by, .55, t, Math.sin(lt * 5) * .25 + (lt > J ? (lt - J) * 2 : 0));
  ctx.save(); ctx.translate(rx, ry); ctx.rotate(Math.sin(t * 6) * .2 + Math.max(0, lt - J) * 4); drawBarrel(ctx, 0, 40, .8); ctx.restore();
  if (lt < J) drawStick(ctx, C(LUFFY, { x: bx - 20, y: by - 20, s: 150, shadow: false, arms: POSE.handsUp.arms, face: { eyes: 'wide', mouth: 'teeth' }, lean: Math.sin(lt * 6) * .2 }));
  else if (lt < J + .4) { const k = (lt - J) / .4; drawStick(ctx, C(LUFFY, { x: lerp(bx - 20, rx, k), y: lerp(by - 20, ry - 40, k) - Math.sin(k * Math.PI) * 220, s: 150, shadow: false, arms: POSE.handsUp.arms, legs: { L: [.6, -1], R: [.6, -1] }, lean: k * 1.5, face: { eyes: 'happy', mouth: 'grin' } })); }
  else if (lt < J + .7) puff(ctx, rx, ry - 100, 70, t, '#f3efe6', 6, 1 - (lt - J - .4) / .3);
  sepia(ctx, .45);
} });
// G — here and now: straw hat from Shanks, rubber body
SHOTS.push({ start: 18.88, end: 23.79, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1], z: 1.02 + lt * .025, r: 0 };
  cruiseBG(ctx, t, cam, { sun: [880, 200, 70], back: 1050 });
  applyCam(ctx, cam, 1);
  const X = 560, Y = 1720, S = 760;
  const hat = lt > 1.1 && lt < 2.6, pull = kf(lt, [[3.25, 0], [3.9, 1, backOut], [4.6, 1], [4.85, 0, easeIn]]);
  const hip = lt > .45 && !hat && pull <= 0;
  let arms = hip ? HIPS : { L: [.3, -.1], R: [.3, -.1] };
  if (hat) arms = { L: [.3, -.1], R: { ik: [.2, -1.02], bend: -1 } };
  const cheek = [X - .14 * S, Y - .72 * S];
  const pullTo = [cheek[0] - pull * 330, cheek[1] + pull * 60];
  if (pull > 0) arms = { L: { ik: [(pullTo[0] - X) / S, (pullTo[1] - Y) / S] }, R: HIPS.R };
  drawStick(ctx, C(LUFFY, { x: X, y: Y, s: S, shadow: false, arms, armLen: pull > 0 ? 1 + pull * 1.6 : 1,
    face: pull > .2 ? { eyes: 'happy', mouth: 'grin' } : { eyes: 'normal', mouth: hat ? 'smile' : 'grin', blink: blinkAt(lt, .9, 3.0) }, headTilt: hat ? -.06 : 0 }));
  if (pull > 0) {
    // stretched cheek: a band of rubber from the face to the hand
    ctx.beginPath(); ctx.moveTo(cheek[0] + 20, cheek[1] - 38); ctx.quadraticCurveTo(lerp(cheek[0], pullTo[0], .5), lerp(cheek[1], pullTo[1], .5) - 14, pullTo[0], pullTo[1] - 18);
    ctx.lineTo(pullTo[0], pullTo[1] + 18); ctx.quadraticCurveTo(lerp(cheek[0], pullTo[0], .5), lerp(cheek[1], pullTo[1], .5) + 14, cheek[0] + 20, cheek[1] + 38); ctx.closePath(); fillStroke(ctx, HEAD, 9);
    circle(ctx, pullTo[0], pullTo[1], 26); ctx.fillStyle = INK; ctx.fill();
    const bmx = (cheek[0] + pullTo[0]) / 2 + 40, bmy = cheek[1] - 190;
    burst(ctx, bmx, bmy, 110 * pull, 10, '#fff', 4);
    text(ctx, 'BOING', bmx, bmy, 50 * pull, INK, null, 0);
  }
  if (hat) { const sa = kf(lt, [[1.2, 0], [1.45, 1], [2.3, 0]]); sparkle(ctx, X + 180, Y - .97 * S, 70 * sa, sa); sparkle(ctx, X - 150, Y - 1.0 * S, 40 * sa, sa); }
  // memory bubble: the red-haired man who gave him the hat
  const mb = kf(lt, [[2.0, 0], [2.3, 1, backOut], [3.2, 1], [3.4, 0]]);
  if (mb > 0) {
    drawBubble(ctx, 300, 430, 300 * mb, [440, 900], mb);
    ctx.save(); ctx.globalAlpha = mb;
    drawStick(ctx, { x: 300, y: 600, s: 300 * mb, cols: ['#1d1a22', '#1d1a22'], belt: false, shadow: false, arms: { L: [.3, -.1], R: [1.9, -.5] },
      behind: (c, hx, hy, hr, lw) => { c.beginPath(); c.arc(hx, hy - hr * .05, hr * 1.12, Math.PI * .85, Math.PI * 2.15); c.closePath(); fillStroke(c, '#d8312b', lw); },
      hatFn: (c, hx, hy, hr, lw) => { c.beginPath(); c.arc(hx, hy, hr * 1.04, Math.PI * 1.1, Math.PI * 1.9); c.quadraticCurveTo(hx, hy - hr * .45, hx - hr * .99, hy - hr * .32); c.closePath(); fillStroke(c, '#d8312b', lw); line(c, hx - .07, hy - .06, hx - .04, hy + .04, .01); line(c, hx - .095, hy - .05, hx - .065, hy + .05, .01); },
      face: { eyes: 'happy', mouth: 'smile' } });
    ctx.restore();
  }
} });
// H — no ship, no money, no crew
SHOTS.push({ start: 23.79, end: 26.40, tr: 'whip', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffd66b'); g.addColorStop(1, '#ff9f5a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  speedLines(ctx, 540, 760, .25, t, 'rgba(255,255,255,.5)');
  const hh = handheld(t, 3); applyCam(ctx, { x: 540 + hh[0], y: 960 + hh[1], z: 1, r: 0 }, 1);
  const items = [[.18, iconShip, 230], [.88, iconMoney, 540], [1.76, iconPerson, 850]];
  for (const [t0, fn, x] of items) {
    const a = pop(lt, t0); if (a <= 0) continue;
    circle(ctx, x, 760, 135 * a); fillStroke(ctx, '#fff8e6', 8);
    fn(ctx, x, 770, 1.05 * a);
    const xa = kf(lt, [[t0 + .3, 0], [t0 + .45, 1.3], [t0 + .6, 1]]); bigX(ctx, x, 760, xa, xa > 0 ? 1 : 0);
  }
  drawStick(ctx, C(LUFFY, { x: 540, y: 1900, s: 500, arms: SHRUG, face: { eyes: 'normal', mouth: 'grin', browUp: 1, look: [0, -.5] }, shadow: false, headTilt: Math.sin(t * 3) * .05 }));
} });
// I — the hold: Koby scrubbing the floor
function holdBG(ctx, cam, t, tint = .25) {
  applyCam(ctx, cam, .6); drawBelowDeck(ctx, tint, 540, t);
  applyCam(ctx, cam, 1);
}
function scrubArms(t, sp = 10) { const k = Math.sin(t * sp); return { L: { ik: [.28 + k * .08, -.18], bend: 1 }, R: { ik: [.24 + k * .08, -.16], bend: 1 } }; }
const mopProp = (c, k, h, a, side) => { if (k === 'R') { c.save(); c.translate(h[0], h[1]); c.rotate(-side * a); drawMop(c, .32); c.restore(); } };
SHOTS.push({ start: 26.40, end: 30.88, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1], z: 1 + lt * .02, r: 0 };
  holdBG(ctx, cam, t);
  drawLantern(ctx, 540, 260, 1.3, 1, t);
  drawBarrel(ctx, 120, 1340, 1.1); drawCrate(ctx, 980, 1360, 180, 150, .2);
  const noticed = lt > 3.2;
  drawBucket(ctx, 930, 1700, 1.2);
  drawStick(ctx, C(KOBY, { x: 720, y: 1660, s: 600, flip: -1, lean: noticed ? 0 : -.35, prop: noticed ? null : mopProp,
    arms: noticed ? { L: [.6, -.9], R: [.6, -.9] } : scrubArms(t),
    face: noticed ? { eyes: 'wide', mouth: 'o', browUp: 1 } : { eyes: 'normal', mouth: 'frown', look: [0, 1], browAng: -.25 } }));
  if (!noticed) for (let i = 0; i < 4; i++) { const k = (t * 1.3 + i * .25) % 1; circle(ctx, 560 + i * 40, 1640 - k * 80, 10 + k * 14); ctx.globalAlpha = 1 - k; fillStroke(ctx, 'rgba(255,255,255,.8)', 3); ctx.globalAlpha = 1; }
  if (noticed) sweat(ctx, 640, 1110, 30, 1);
  const lx = kf(lt, [[0, -260], [1.6, 270]], x => x); const walking = lt < 1.6;
  drawStick(ctx, C(LUFFY, { x: lx, y: 1700, s: 620, legs: walking ? walkLegs(lt, 9) : undefined, arms: walking ? walkArms(lt, 9) : { L: [.3, -.1], R: [2.3, .4] }, face: { eyes: 'normal', mouth: 'grin', look: [1, 0] }, bob: walking ? -Math.abs(Math.sin(lt * 9)) * .02 : 0 }));
  darkness(ctx, .12);
} });
// J — Koby: Alvida's cabin boy who dreams of joining the Marines
SHOTS.push({ start: 30.88, end: 37.36, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1], z: 1.05 + lt * .02, r: 0 };
  holdBG(ctx, cam, t, .3);
  // Alvida's portrait on the wall
  const pa = kf(lt, [[2.1, 0], [2.4, 1]]); const ps = pa > 0 && lt < 3.2 ? shake(t, 6, 3) : [0, 0];
  ctx.save(); ctx.translate(820 + ps[0], 440 + ps[1]);
  rrect(ctx, -170, -210, 340, 420, 14); fillStroke(ctx, '#c79a3a', 9); rrect(ctx, -140, -180, 280, 360, 8); fillStroke(ctx, '#f2d8e6', 6);
  ctx.save(); rrect(ctx, -140, -180, 280, 360, 8); ctx.clip(); drawStick(ctx, C(ALVIDA, { x: 0, y: 330, s: 420, shadow: false, face: { eyes: 'smug', mouth: 'smirk', browAng: -.2 } })); ctx.restore();
  ctx.restore();
  if (pa > 0 && lt < 3.4) { ctx.save(); ctx.globalAlpha = pa; burst(ctx, 820, 160, 60, 8, '#ff6fa8', 2); ctx.restore(); }
  const dream = lt > 3.4;
  drawBucket(ctx, 860, 1760, 1.3);
  drawStick(ctx, C(KOBY, { x: 420, y: 1740, s: 760, lean: dream ? 0 : -.3, prop: dream ? null : mopProp,
    arms: dream ? { L: { ik: [-.12, -.62], bend: -1 }, R: { ik: [.12, -.62], bend: 1 } } : scrubArms(t),
    face: dream ? { eyes: 'normal', look: [.5, -.9], mouth: 'smile', blush: true, browUp: 1 } : { eyes: 'normal', look: [.3, .8], mouth: 'frown', browAng: -.3 }, blush: dream }));
  if (!dream) { sweat(ctx, 560, 1180 + (lt % 1) * 40, 26, 1); }
  // dream bubble: Koby the Marine
  const ba = kf(lt, [[4.6, 0], [4.95, 1, backOut]]);
  if (ba > 0) {
    drawBubble(ctx, 560, 600, 400 * ba, [460, 1000], 1);
    ctx.save(); ctx.globalAlpha = clamp(ba);
    drawMarineBase(ctx, 720, 760, .58 * ba);
    drawStick(ctx, C(KOBY_MARINE, { x: 410, y: 820, s: 330 * ba, shadow: false, arms: { L: [.3, -.1], R: { ik: [.17, -.86], bend: -1 } }, face: { eyes: 'happy', mouth: 'grin' } }));
    ctx.restore();
    for (let i = 0; i < 3; i++) sparkle(ctx, 300 + i * 260, 420 + (i % 2) * 120, 34 * ba * (.7 + .3 * Math.sin(t * 6 + i)), ba);
  }
  darkness(ctx, .1);
} });
// K — the door bursts: Alvida, furious, with a giant iron club
const clubProp = (rot, len = .8) => (c, k, h, a, side) => { if (k === 'R') { c.save(); c.translate(h[0], h[1]); c.rotate(rot != null ? rot : side * (Math.PI - a)); drawClub(c, len, .11); c.restore(); } };
SHOTS.push({ start: 37.36, end: 43.04, tr: 'cut', draw(ctx, lt, t) {
  const D = 2.08, CL = 4.32;
  const slam = lt > D ? Math.exp(-(lt - D) * 5) : 0, stomp = lt > CL ? Math.exp(-(lt - CL) * 6) : 0;
  const sh = shake(t, 30 * slam + 22 * stomp + 2, 3);
  const cam = { x: 540 + sh[0], y: 1000 + sh[1], z: kf(lt, [[0, 1.0], [D, 1.02], [D + .15, 1.1], [5.6, 1.16]]), r: 0 };
  holdBG(ctx, cam, t, .25);
  drawLantern(ctx, 300, 240, 1.2, 1, t);
  drawDoor(ctx, 860, 1330, 300, 560, lt > D ? 1 : 0, .1);
  const ax = kf(lt, [[D + .1, 860], [D + 1.2, 800]]);
  if (lt > D) {
    const raise = kf(lt, [[CL - .3, 0], [CL, 1, backOut]]);
    const armR = [lerp(.4, 2.9, raise), lerp(-.3, .15, raise)];
    drawStick(ctx, C(ALVIDA, { x: ax, y: 1700, s: 760, flip: -1, bob: Math.abs(Math.sin(lt * 4)) * -.01,
      arms: { L: HIPS.L, R: armR }, prop: clubProp(null),
      face: { eyes: 'normal', mouth: 'teeth', browAng: -.45, look: [1, 0] } }));
    for (let i = 0; i < 6; i++) { const k = lt - D; plank(ctx, 860 - k * (400 + i * 140), 1100 - i * 60 + k * k * 1200 - k * 500, 150, k * 8 + i); }
    if (lt - D < .25) burst(ctx, 860, 1050, 330, 12, '#ffd23a', 6);
    puff(ctx, 860, 1250, 200 * (1 + (lt - D)), t, '#d8cbb4', 7, kf(lt - D, [[0, 1], [.8, 0]]));
    if (stomp > .2) burst(ctx, 480, 720, 90, 9, '#ff6fa8', 4);
  }
  const scared = lt > D;
  drawStick(ctx, C(KOBY, { x: 470, y: 1560, s: 520, flip: scared ? -1 : 1, arms: scared ? POSE.handsUp.arms : { L: [.4, -.4], R: [.4, -.4] }, legs: scared ? { L: [.2 + Math.sin(t * 40) * .05, -.1], R: [.2 - Math.sin(t * 40) * .05, -.1] } : undefined,
    face: scared ? { eyes: 'wide', mouth: 'teeth', browUp: 1, look: [-1, 0] } : { eyes: 'normal', mouth: 'smile', look: [-1, 0] } }));
  if (scared) sweat(ctx, 610, 1080, 30, 1);
  drawStick(ctx, C(LUFFY, { x: 240, y: 1600, s: 560, arms: { L: [.3, -.1], R: [.3, -.1] }, face: scared ? { eyes: 'normal', mouth: 'flat', look: [1, 0] } : { eyes: 'happy', mouth: 'grin' } }));
  darkness(ctx, .08);
  flashScreen(ctx, lt > D ? kf(lt - D, [[0, .7], [.15, 0]]) : 0);
} });
// L — the club lands on his head... and bounces off: he's rubber
SHOTS.push({ start: 43.04, end: 47.28, tr: 'whip', draw(ctx, lt, t) {
  const HIT = .8; const k = lt - HIT;
  const sh = k > 0 ? shake(t, 30 * Math.exp(-k * 5), 3) : [0, 0];
  const cam = { x: 540 + sh[0], y: 1000 + sh[1], z: 1.05 + lt * .02, r: 0 };
  holdBG(ctx, cam, t, .2);
  const swing = kf(lt, [[0, 0], [HIT - .25, -.15], [HIT, 1, easeIn]]);
  const armR = [lerp(2.9, 2.3, swing), lerp(.15, 0, swing)];
  const sq = k < 0 ? 1 : 1 - .55 * Math.exp(-k * 3.2) * Math.cos(k * 16);
  const surprised = k > 1.6;
  drawStick(ctx, C(ALVIDA, { x: 860, y: 1720, s: 800, flip: -1, arms: { L: HIPS.L, R: armR }, prop: clubProp(lerp(.09, k > 0 ? 1.5 : 1.67, swing), .5),
    face: surprised ? { eyes: 'wide', mouth: 'o', browUp: 1, look: [1, 0] } : { eyes: 'normal', mouth: 'teeth', browAng: -.45, look: [1, 0] } }));
  drawStick(ctx, C(LUFFY, { x: 260, y: 1640, s: 640, squash: sq, arms: surprised ? { L: [.3, -.1], R: { ik: [.2, -1.02], bend: -1 } } : { L: [.3, -.1], R: [.3, -.1] },
    face: k < 0 ? { eyes: 'normal', mouth: 'flat', look: [1, -.5] } : k < .9 ? { eyes: 'spiral', mouth: 'grin' } : { eyes: 'happy', mouth: 'grin' } }));
  if (k > 0 && k < .3) { burst(ctx, 300, 900, 160, 10, '#fff', 3); text(ctx, 'BOING', 300, 900, 52, INK, null, 0); }
  if (k > 0 && k < 1.2) for (let i = 0; i < 3; i++) { const a = t * 6 + i * TAU / 3; star5(ctx, 260 + Math.cos(a) * 120, 1080 + Math.sin(a) * 30, 22, a); }
  if (surprised) { sweat(ctx, 640, 1080, 30, 1); }
  darkness(ctx, .06);
} });
// M — Gomu Gomu no Pistol
SHOTS.push({ start: 47.28, end: 49.28, tr: 'cut', draw(ctx, lt, t) {
  const WIND = [.3, 1.2], FIRE = 1.52, IMP = 1.67;
  const k = lt - IMP;
  const sh = k > 0 ? shake(t, 40 * Math.exp(-k * 4), 3) : shake(t, 3, 1);
  const cam = { x: 540 + sh[0], y: 1000 + sh[1], z: kf(lt, [[0, 1.0], [FIRE, 1.08], [IMP, 1.18]]), r: 0 };
  holdBG(ctx, cam, t, .2);
  speedLines(ctx, 540, 1000, kf(lt, [[.2, 0], [.5, .5], [FIRE, .7]]), t, 'rgba(255,240,200,.45)');
  applyCam(ctx, cam, 1);
  const X = 260, Y = 1660, S = 640;
  const sx = X + .1 * S, sy = Y - .535 * S;
  // fist position: wind back off-screen, then fire across to Alvida
  const back = kf(lt, [[WIND[0], 0], [WIND[1], 1]]);
  let fx = lerp(sx + 120, -380, back), fy = lerp(sy + 60, sy - 40, back);
  if (lt > FIRE) { const p = clamp((lt - FIRE) / (IMP - FIRE)); fx = lerp(-380, 800, easeIn(p)); fy = lerp(sy - 40, 1040, p); }
  if (k > .1) { const r = clamp((k - .1) / .2); fx = lerp(800, sx + 120, r); fy = lerp(1040, sy + 60, r); }
  const ax = k > 0 ? 820 + k * 2600 : 820, ay = k > 0 ? 1720 - k * 1700 : 1720;
  if (k < .3) drawStick(ctx, C(ALVIDA, { x: ax, y: ay, s: 800, flip: -1, lean: k > 0 ? -.8 - k * 6 : 0, arms: { L: HIPS.L, R: [2.9, .15] }, prop: clubProp(null),
    face: { eyes: k > 0 ? 'x' : 'wide', mouth: 'o', browUp: 1, look: [1, 0] } }));
  // rubber arm
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + fx) / 2, (sy + fy) / 2 - 30 * Math.sin(back * Math.PI), fx, fy);
  ctx.lineWidth = .03 * S; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
  drawStick(ctx, C(LUFFY, { x: X, y: Y, s: S, noArm: 'R', lean: lt > FIRE ? .12 : -.08, arms: { L: [.6, -1.2], R: [0, 0] }, legs: { L: [.5, -.2], R: [-.3, -.1] },
    face: { eyes: 'normal', mouth: 'teeth', browAng: -.4, look: [1, 0] } }));
  circle(ctx, fx, fy, 46); ctx.fillStyle = INK; ctx.fill(); circle(ctx, fx - 14, fy - 14, 12); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill();
  if (k > 0 && k < .3) { burst(ctx, 800, 1040, 300 * (1 + k * 2), 14, '#ffd23a', 9); burst(ctx, 800, 1040, 160 * (1 + k * 2), 10, '#fff', 4); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  titleText(ctx, 'GOMU GOMU NO...', 540, 330, 84, kf(lt, [[.55, 0], [.7, 1]]), .9 + .1 * pop(lt, .55), '#fff');
  if (lt > FIRE - .1) titleText(ctx, 'PISTOL!', 540, 470, 150, 1, pop(lt, FIRE - .1, .25), '#ffd23a');
  flashScreen(ctx, k > 0 ? kf(k, [[0, .8], [.15, 0]]) : 0);
} });
// N — Alvida flies over the sea and twinkles on the horizon
SHOTS.push({ start: 49.28, end: 51.04, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1, r: 0 };
  seaBG(ctx, t, cam, 1000, { sunX: 820 });
  drawShip(ctx, 300, 1420, 1.0, t, { flag: '#2a63c8', hull: '#f4f1ea', stripe: '#2f63c9', sail: '#ffffff', ph: 2 });
  const p = clamp(lt / 1.25); const x = lerp(1000, 300, easeOut(p)), y = lerp(1300, 560, easeOut(p)) - Math.sin(p * Math.PI) * 180; const s = lerp(380, 12, easeOut(p));
  for (let i = 1; i < 8; i++) { const q = clamp(p - i * .03); puff(ctx, lerp(1000, 300, easeOut(q)), lerp(1300, 560, easeOut(q)) - Math.sin(q * Math.PI) * 180, lerp(60, 6, q), t, '#fff', i, .5 * (1 - i / 8)); }
  if (p < 1) drawStick(ctx, C(ALVIDA, { x, y, s, flip: -1, shadow: false, lean: lt * 14, arms: POSE.handsUp.arms, legs: { L: [.7, -.6], R: [.4, -.4] }, face: { eyes: 'x', mouth: 'o' } }));
  const tw = kf(lt, [[1.2, 0], [1.35, 1, backOut], [1.7, 0]]);
  if (tw > 0) { star5(ctx, 300, 560, 55 * tw, t * 3); sparkle(ctx, 300, 560, 110 * tw, tw); }
} });
// O — the ship is free, the crew in shock, the whole sea ahead
SHOTS.push({ start: 51.04, end: 55.60, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const tilt = inv(2.8, 4.4, lt);
  const cam = { x: 540 + hh[0], y: lerp(1050, 900, ease(tilt)) + hh[1], z: lerp(1.08, .98, ease(tilt)), r: 0 };
  cruiseBG(ctx, t, cam, { sun: [820, 260, 80], sunPow: 1.2, back: 1100, horizon: 820 });
  applyCam(ctx, cam, 1);
  const shock = { eyes: 'wide', mouth: 'o', browUp: 1, look: [.3, 0] };
  drawStick(ctx, C(ALVIDA_PIRATE, { x: 140, y: 1420, s: 470, arms: POSE.handsUp.arms, face: shock }));
  drawStick(ctx, C(ALVIDA_PIRATE, { x: 940, y: 1440, s: 480, flip: -1, hatCol: '#3a7be0', arms: { L: [.4, -.2], R: [2.5, .4] }, face: shock }));
  drawStick(ctx, C(KOBY, { x: 760, y: 1510, s: 500, flip: -1, arms: { L: [.5, -.6], R: [.5, -.6] }, face: C(shock, { look: [1, 0] }) }));
  drawStick(ctx, C(LUFFY, { x: 430, y: 1600, s: 620, arms: HIPS, face: { eyes: 'normal', mouth: 'grin', look: [.2, -.6] }, headTilt: -.05 }));
  if (lt < 2.6) for (const [x, y] of [[250, 950], [840, 980], [660, 1060]]) sweat(ctx, x, y + (lt % 1) * 30, 24, 1);
} });
// P — freeze frame: you decide Day 2 (three options)
SHOTS.push({ start: 55.60, end: 59.20, tr: 'whip', draw(ctx, lt, t) {
  const T0 = 51.04 + 4.4; // the frozen moment
  const cam = { x: 540, y: 1050, z: 1.08 + lt * .02, r: 0 };
  cruiseBG(ctx, T0, cam, { sun: [820, 260, 80], back: 1100, horizon: 820 });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(KOBY, { x: 790, y: 1640, s: 560, flip: -1, arms: POSE.handsUp.arms, face: { eyes: 'wide', mouth: 'teeth', browUp: 1, look: [-1, 0] } }));
  sweat(ctx, 660, 1120, 30, 1);
  drawStick(ctx, C(LUFFY, { x: 380, y: 1720, s: 680, arms: { L: HIPS.L, R: [2.4, .3] }, face: { eyes: 'happy', mouth: 'grin' } }));
  // freeze look: dim + white frame
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const dim = kf(lt, [[.9, 0], [1.2, .45]]); darkness(ctx, dim, '#0b1020');
  flashScreen(ctx, kf(lt, [[0, .6], [.15, 0]]));
  ctx.lineWidth = 14; ctx.strokeStyle = '#fff'; rrect(ctx, 40, 140, 1000, 1440, 30); ctx.stroke();
  const cards = [[1.2, 1, 'Marinha + Zoro', '#3a7be0'], [1.45, 2, 'Koby no bando', '#e0392f'], [1.7, 3, 'Virar Marinha', '#3fa35b']];
  cards.forEach(([t0, n, lab, col], i) => choiceCard(ctx, 540, 380 + i * 210, 860, 170, n, lab, col, clamp((lt - t0) * 6), pop(lt, t0)));
  const ca = pop(lt, 2.85);
  if (ca > 0) { ctx.save(); ctx.translate(880, 1050); ctx.scale(ca, ca); ctx.beginPath(); ctx.roundRect(-110, -80, 220, 150, 40); ctx.moveTo(-40, 66); ctx.lineTo(-70, 120); ctx.lineTo(10, 68); fillStroke(ctx, '#fff', 9); for (let i = -1; i <= 1; i++) { circle(ctx, i * 55, -5, 16); ctx.fillStyle = INK; ctx.fill(); } ctx.restore(); }
} });
// Q1 — option 1: take Koby to the Marine base in Shells Town
function optionTag(ctx, n, label, col, lt) { ctx.setTransform(1, 0, 0, 1, 0, 0); choiceCard(ctx, 540, 250, 760, 140, n, label, col, 1, pop(lt, 0, .3)); }
SHOTS.push({ start: 59.20, end: 64.56, tr: 'whip', draw(ctx, lt, t) {
  const push = inv(2.9, 4.6, lt);
  const cam = { x: lerp(540, 680, ease(push)), y: lerp(960, 900, ease(push)), z: lerp(1, 1.25, ease(push)), r: 0 };
  seaBG(ctx, t, cam, 1000, { sunX: 300 });
  applyCam(ctx, cam, 1);
  drawIsland(ctx, 820, 1010, .9, t);
  drawMarineBase(ctx, 800, 880, .55);
  const sign = pop(lt, 3.9);
  if (sign > 0) { ctx.save(); ctx.translate(620, 960); ctx.scale(sign, sign); line(ctx, 0, 0, 0, -90, 8, '#7a4a2a'); rrect(ctx, -130, -160, 260, 70, 10); fillStroke(ctx, '#f2d58a', 6); text(ctx, 'SHELLS TOWN', 0, -124, 34, INK, null, 0); ctx.restore(); }
  const bx = lerp(180, 470, clamp(lt / 5)), by = 1260;
  drawRowboat(ctx, bx, by, .9, t);
  drawStick(ctx, C(KOBY, { x: bx + 40, y: by - 30, s: 210, shadow: false, arms: { L: [.3, -.1], R: [2.3, .4] }, face: { eyes: 'happy', mouth: 'grin' } }));
  drawStick(ctx, C(LUFFY, { x: bx - 70, y: by - 30, s: 220, shadow: false, arms: { L: [.3, -.1], R: [2.7, .2] }, face: { eyes: 'normal', mouth: 'grin', look: [1, 0] } }));
  optionTag(ctx, 1, 'Marinha + Zoro', '#3a7be0', lt);
} });
// Q2 — option 1: the pirate hunter Roronoa Zoro
SHOTS.push({ start: 64.56, end: 66.96, tr: 'whip', draw(ctx, lt, t) {
  const cam = { x: 540, y: 1000, z: 1.05 + lt * .05, r: 0 };
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b3a2e'); g.addColorStop(1, '#6f8f5c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  speedLines(ctx, 540, 900, .3, t, 'rgba(200,255,200,.25)');
  applyCam(ctx, cam, 1);
  const rev = lt > 1.7;
  const sil = rev ? undefined : '#141814';
  const flash = rev ? kf(lt - 1.7, [[0, .8], [.2, 0]]) : 0;
  // three swords at the hip
  drawSword(ctx, 640, 1460, 330, .5, rev ? '#2a2530' : '#141814'); drawSword(ctx, 660, 1470, 330, .65, rev ? '#e7e2d8' : '#141814'); drawSword(ctx, 420, 1470, 330, -.55, rev ? '#7a2630' : '#141814');
  drawStick(ctx, C(ZORO, { x: 540, y: 1780, s: 820, sil, eyesGlow: !rev, belt: true, arms: { L: { ik: [.12, -.42], bend: -1 }, R: { ik: [-.12, -.45], bend: 1 } }, face: { eyes: 'normal', mouth: 'smirk', browAng: -.35, look: [0, 0] } }));
  if (!rev) { ctx.setTransform(1, 0, 0, 1, 0, 0); text(ctx, '?', 540, 520, 220, '#fff', INK, 16); text(ctx, '?', 540, 520, 220, '#fff', INK, 0); }
  flashScreen(ctx, flash);
  optionTag(ctx, 1, 'Marinha + Zoro', '#3a7be0', 1);
} });
// R — option 2: forget the Marines, Koby joins the crew right now
SHOTS.push({ start: 66.96, end: 74.00, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1], z: 1.02 + lt * .015, r: 0 };
  cruiseBG(ctx, t, cam, { sun: [880, 200, 70], back: 1080 });
  applyCam(ctx, cam, 1);
  const flag = kf(lt, [[4.6, 0], [5.3, 1, backOut]]);
  if (flag > 0) { line(ctx, 540, 1080, 540, 1080 - 760 * flag, 14, '#7a4a2a'); drawJolly(ctx, 690, 1080 - 640 * flag, 300, t); }
  const hug = lt > 3.3;
  // marine dream bubble that gets crossed out
  const ba = kf(lt, [[.5, 0], [.8, 1, backOut], [3.4, 1], [3.6, 0]]);
  if (ba > 0) { drawBubble(ctx, 760, 520, 280 * ba, [760, 1000], ba); ctx.save(); ctx.globalAlpha = ba; ctx.translate(760, 560); ctx.scale(1.6 * ba, 1.6 * ba); marineCap(ctx, 0, 0, 100, 6); ctx.restore(); const xa = kf(lt, [[2.75, 0], [2.9, 1.2], [3.05, 1]]); bigX(ctx, 760, 540, xa * ba, xa > 0 ? ba : 0); }
  drawStick(ctx, C(KOBY, { x: hug ? 680 : 780, y: 1680, s: 580, flip: -1, lean: hug ? .08 : 0,
    arms: hug && lt > 4.8 ? { L: [.3, -.1], R: [2.6, .2] } : { L: [.4, -.5], R: [.4, -.5] },
    face: lt > 4.8 ? { eyes: 'happy', mouth: 'grin', blush: true } : hug ? { eyes: 'wide', mouth: 'o', browUp: 1, look: [-1, 0] } : { eyes: 'normal', mouth: 'flat', look: [-1, -.4] } }));
  drawStick(ctx, C(LUFFY, { x: hug ? 420 : 300, y: 1700, s: 640, arms: hug ? { L: [.3, -.1], R: { ik: [.5, -.5], bend: -1 } } : { L: [.3, -.1], R: [2.4, .4] }, armLen: hug ? 1.25 : 1,
    face: { eyes: lt > 4.8 ? 'happy' : 'normal', mouth: 'grin', look: [1, 0] } }));
  const rb = pop(lt, 4.9);
  if (rb > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 760); ctx.scale(rb, rb); ctx.rotate(-.04); rrect(ctx, -330, -60, 660, 120, 20); fillStroke(ctx, '#e0392f', 9); text(ctx, 'TRIPULANTE Nº 1', 0, 4, 56, '#fff', INK, 0); ctx.restore(); }
  optionTag(ctx, 2, 'Koby no bando', '#e0392f', lt);
} });
// S1 — option 3: throw it all away, quit being a pirate
SHOTS.push({ start: 74.00, end: 77.36, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1], z: 1.03, r: 0 };
  cruiseBG(ctx, t, cam, { sun: [880, 200, 70], back: 1080, skyTop: '#6f8fb8', skyBot: '#d9e4ee' });
  applyCam(ctx, cam, 1);
  const toss = .8, tk = lt - toss;
  const X = 540, Y = 1720, S = 700;
  drawStick(ctx, C(LUFFY, { x: X, y: Y, s: S, hatFn: tk > 0 ? (c, hx, hy, hr, lw) => { c.beginPath(); c.arc(hx, hy, hr * 1.04, Math.PI * 1.08, Math.PI * 1.92); c.lineTo(hx + hr * .7, hy - hr * .42); c.lineTo(hx + hr * .45, hy - hr * .3); c.lineTo(hx + hr * .2, hy - hr * .45); c.lineTo(hx - hr * .1, hy - hr * .3); c.lineTo(hx - hr * .4, hy - hr * .45); c.lineTo(hx - hr * .7, hy - hr * .3); c.closePath(); fillStroke(c, '#1d1a22', lw); } : LUFFY.hatFn,
    arms: tk < 0 ? { L: [.3, -.1], R: { ik: [.2, -1.02], bend: -1 } } : tk < .6 ? { L: [2.7, .1], R: [2.7, .1] } : { L: [.2, -.05], R: [.2, -.05] },
    face: tk < .6 ? { eyes: 'normal', mouth: 'grin' } : { eyes: 'half', mouth: 'flat', look: [0, .4] } }));
  if (tk > 0) {
    // the straw hat flies up and away
    const hx = X + 60 + tk * 260, hy = Y - 1.0 * S - tk * 900 + tk * tk * 220;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tk * 5); ctx.scale(S, S); strawHat(ctx, 0, .1, .19, .017, { hair: false }); ctx.restore();
  }
  if (lt > 2.0) { const a = clamp((lt - 2) * 4); ctx.save(); ctx.globalAlpha = a; drawJolly(ctx, 820, 520, 260, t); ctx.restore(); bigX(ctx, 820, 520, .8 * a, a); }
  optionTag(ctx, 3, 'Virar Marinha', '#3fa35b', lt);
} });
// S2 — option 3: enlist with Koby, train with grandpa Garp, become the next Admiral
SHOTS.push({ start: 77.36, end: 82.64, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const GA = 2.1, AD = 3.75;
  const gsh = lt > GA ? shake(t, 20 * Math.exp(-(lt - GA) * 5), 3) : [0, 0];
  const cam = { x: 540 + hh[0] + gsh[0], y: 1000 + hh[1] + gsh[1], z: 1.02 + lt * .02, r: 0 };
  seaBG(ctx, t, cam, 1000);
  applyCam(ctx, cam, 1);
  drawMarineBase(ctx, 820, 1020, .75);
  ctx.fillStyle = '#e9dcc0'; ctx.fillRect(-600, 1020, 2400, 1200); for (let i = 0; i < 12; i++) line(ctx, -600, 1060 + i * 90, 1700, 1060 + i * 90, 3, 'rgba(120,90,50,.3)');
  const g = pop(lt, GA, .45);
  if (g > 0) { drawStick(ctx, C(GARP, { x: 770, y: 1620 + (1 - g) * 600, s: 900, flip: -1, arms: { L: HIPS.L, R: [1.6, -.2] }, face: { eyes: 'normal', mouth: 'grin', browAng: -.3, look: [1, 0] } })); }
  const salute = { L: [.3, -.1], R: { ik: [.14, -.86], bend: -1 } };
  drawStick(ctx, C(KOBY_MARINE, { x: 560, y: 1660, s: 520, arms: salute, face: { eyes: 'normal', mouth: 'smile' } }));
  const adm = lt > AD;
  if (adm) { const X = 270, Y = 1700, S = 600, a = pop(lt, AD); ctx.beginPath(); ctx.moveTo(X - .17 * S, Y - .58 * S); ctx.quadraticCurveTo(X - .36 * S * a, Y - .25 * S, X - .34 * S * a, Y - .02 * S); ctx.lineTo(X + .34 * S * a, Y - .02 * S); ctx.quadraticCurveTo(X + .36 * S * a, Y - .25 * S, X + .17 * S, Y - .58 * S); ctx.closePath(); fillStroke(ctx, '#ffffff', 8); line(ctx, X - .3 * S * a, Y - .06 * S, X + .3 * S * a, Y - .06 * S, 6, '#e2b84a'); }
  drawStick(ctx, C(LUFFY_MARINE, { x: 270, y: 1700, s: 600, arms: salute, face: { eyes: adm ? 'happy' : 'normal', mouth: 'grin' },
  }));
  if (lt < .35) puff(ctx, 300, 1400, 260, t, '#fff', 8, 1 - lt / .35);
  if (adm) { const a = pop(lt, AD); ctx.setTransform(1, 0, 0, 1, 0, 0); titleText(ctx, 'ALMIRANTE?', 540, 470, 120, 1, a, '#fff'); for (let i = 0; i < 4; i++) sparkle(ctx, 150 + i * 260, 600 + (i % 2) * 60, 40 * a * (.8 + .2 * Math.sin(t * 7 + i)), a); }
  optionTag(ctx, 3, 'Virar Marinha', '#3fa35b', 1);
} });
// T — call to action: most liked comment decides Day 2, follow
SHOTS.push({ start: 82.64, end: 88.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .01, r: 0 };
  seaBG(ctx, t, cam, 1180, { sunX: 540 });
  applyCam(ctx, cam, 1);
  drawShip(ctx, 820, 1300, .45, t, { skull: true, flag: '#1b1820', hull: '#7d3a22', ph: 1 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  titleText(ctx, 'DIA 2?', 540, 330, 190, 1, pop(lt, 0, .4), '#ffd23a');
  const cards = [[1, '#3a7be0'], [2, '#e0392f'], [3, '#3fa35b']];
  cards.forEach(([n, col], i) => { const a = pop(lt, .25 + i * .12); if (a > 0) { ctx.save(); ctx.translate(250 + i * 290, 560); ctx.scale(a, a); badge(ctx, 0, 0, 90, n, col); ctx.restore(); } });
  const like = pop(lt, .88);
  if (like > 0) { ctx.save(); ctx.translate(800, 860); ctx.scale(like * (1 + .06 * Math.sin(t * 8)), like * (1 + .06 * Math.sin(t * 8))); heartPath(ctx, 0, 0, 90); fillStroke(ctx, '#ff4d6d', 9); ctx.restore(); }
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(LUFFY, { x: 330, y: 1220, s: 520, arms: { L: [.3, -.1], R: [2.5 + Math.sin(t * 8) * .3, .3] }, face: { eyes: 'happy', mouth: 'grin' } }));
  const fb = pop(lt, 3.4);
  if (fb > 0) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.save(); ctx.translate(780, 1120); const press = lt > 4.1 && lt < 4.3 ? .92 : 1; ctx.scale(fb * press, fb * press);
    rrect(ctx, -190, -62, 380, 124, 62); fillStroke(ctx, lt > 4.2 ? '#3fa35b' : '#e0392f', 9); text(ctx, lt > 4.2 ? 'SEGUINDO' : 'SEGUIR', 0, 4, 58, '#fff', INK, 0); ctx.restore();
    const px = kf(lt, [[3.6, 980], [4.1, 820]]), py = kf(lt, [[3.6, 1300], [4.1, 1150]]);
    ctx.save(); ctx.translate(px, py); ctx.rotate(-.3); ctx.beginPath(); ctx.roundRect(-26, -10, 52, 110, 20); fillStroke(ctx, HEAD, 8); ctx.beginPath(); ctx.roundRect(-14, -70, 28, 80, 14); fillStroke(ctx, HEAD, 8); ctx.restore();
  }
} });
