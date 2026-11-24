// ---------- "Dia 2 sendo o Monkey D. Luffy": shot list, in voiceover seconds ----------
const SHOTS = [];
const P = (lt, t0, d = .25) => backOut(clamp((lt - t0) / d));          // pop-in scale 0 -> 1
const ON = (lt, t0, d = .15) => clamp((lt - t0) / d);                    // fade 0 -> 1
const screen = ctx => ctx.setTransform(1, 0, 0, 1, 0, 0);
const hitShake = (lt, t0, amp = 30, dec = 4) => lt > t0 ? Math.max(0, 1 - (lt - t0) * dec) * amp : 0;
// aim one arm of a stick figure at a world point, stretching it like rubber
function stretchTo(o, k, X, Y, bend = 1) {
  const side = k === 'L' ? -1 : 1, fl = o.flip || 1;
  const tx = (X - o.x) / (o.s * fl), ty = (Y - o.y) / (o.s * (o.squash || 1));
  const d = Math.hypot(tx - side * .1 * fl * fl, ty + .535);
  o.arms = Object.assign({}, o.arms || POSE.idle.arms); o.arms[k] = { ik: [tx, ty], bend };
  o['armLen' + k] = Math.max(1, d / .262); return o;
}
// the Marine courtyard: sky, tower, wall, dirt ground
function courtyardBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, o.skyTop || '#3a9de8', o.skyBot || '#fbe8bf', -400, o.wallTop || 620);
  if (o.sun) { applyCam(ctx, cam, .1); drawSun(ctx, o.sun[0], o.sun[1], o.sun[2] || 80, t, o.sunPow || 1.2); }
  applyCam(ctx, cam, .14); drawCloud(ctx, 120 + t * 5, 300, 90, 3); drawCloud(ctx, 900 + t * 4, 200, 70, 4, .9);
  applyCam(ctx, cam, .3); drawMarineBase(ctx, o.towerX || 820, (o.wallTop || 620) + 60, o.towerS || .62, t);
  applyCam(ctx, cam, 1);
  if (o.behindWall) o.behindWall(ctx);
  drawBaseWall(ctx, o.wallTop || 620, (o.back || 960) + 10);
  drawGround(ctx, o.back || 960);
}
function zoroTied(ctx, x, y, s, face, extra = {}) {
  drawPost(ctx, x, y + 10, s * 1.05, y - .535 * s, s * .86);
  drawStick(ctx, C(ZORO, Object.assign({ x, y, s, arms: { L: [1.56, 0], R: [1.56, 0] }, legs: { L: [.08, -.02], R: [.08, -.02] }, face }, extra)));
  const wy = y - .535 * s, wx = (.1 + .27) * s;
  for (const sd of [-1, 1]) ropeWraps(ctx, x + sd * wx * .92, wy - 18, s * .07, 2);
  ropeWraps(ctx, x, y - .5 * s, s * .27, 3);
}
// small banner with the chosen option, top of frame
function optionBanner(ctx, n, lt) {
  screen(ctx); const sc = P(lt, 0, .3) * .62;
  ctx.save(); ctx.translate(540, 300); ctx.scale(sc, sc);
  if (n === 1) choiceCard(ctx, 0, 0, 820, 170, 1, 'LUTAR', 'invadir a base', '#e0392f', .9);
  else choiceCard(ctx, 0, 0, 820, 170, 2, 'FUGIR', 'roubar um navio', '#2f63c9', .9);
  ctx.restore();
}
function thought(ctx, x, y, r, sc, fromX, fromY) {
  if (sc <= 0) return;
  for (let i = 0; i < 3; i++) { const k = (i + 1) / 4; circle(ctx, lerp(fromX, x, k), lerp(fromY, y + r * .8, k), (10 + i * 9) * sc); fillStroke(ctx, '#fff', 6); }
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); cloudShape(ctx, 0, 0, r * .75, 8); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); cloudShape(ctx, 0, 0, r * .75, 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
}
function onigiri(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -80); ctx.quadraticCurveTo(20, -80, 80, 30); ctx.quadraticCurveTo(90, 60, 50, 60); ctx.lineTo(-50, 60); ctx.quadraticCurveTo(-90, 60, -80, 30); ctx.quadraticCurveTo(-20, -80, 0, -80); fillStroke(ctx, '#fbfaf5', 7);
  rrect(ctx, -34, 10, 68, 50, 6); fillStroke(ctx, '#1f2b24', 6);
  ctx.restore();
}
function bigX(ctx, x, y, r, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; line(ctx, x - r, y - r, x + r, y + r, r * .32, INK); line(ctx, x + r, y - r, x - r, y + r, r * .32, INK); line(ctx, x - r, y - r, x + r, y + r, r * .2, '#e0392f'); line(ctx, x + r, y - r, x - r, y + r, r * .2, '#e0392f'); ctx.restore(); }
function check(ctx, x, y, r, col = '#2f9a4a') { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - r * .3, y + r * .7); ctx.lineTo(x + r, y - r * .8); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = r * .5; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = r * .3; ctx.strokeStyle = col; ctx.stroke(); }
function punchFX(ctx, x, y, k, word, seed, s = 1) {
  if (k <= 0 || k > .55) return; const sc = backOut(clamp(k / .12)) * (1 - clamp((k - .35) / .2)) * s;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-.12);
  burst(ctx, 0, 0, 260, 12, '#ffd23a', seed); burst(ctx, 0, 0, 140, 10, '#fff6c4', seed + 2);
  text(ctx, word, 0, 0, 104, '#e0392f', INK, 16, 'Poppins', 700); ctx.restore();
}
function tears(ctx, x, y, len, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(x + sd * len * .5 - 12, y); ctx.quadraticCurveTo(x + sd * len * .55, y + len * .6, x + sd * len * .5 + sd * 8 * Math.sin(t * 8), y + len); ctx.lineTo(x + sd * len * .5 + 14, y + len); ctx.quadraticCurveTo(x + sd * len * .55 + 16, y + len * .5, x + sd * len * .5 + 12, y); ctx.closePath();
    fillStroke(ctx, '#8fd8ff', 5);
  }
  ctx.restore();
}

// 0 — hook: rowing into Shells Town, title card
SHOTS.push({ start: 0, end: 2.1, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + lt * 12, y: 960 + hh[1] - lt * 12, z: 1.02 + lt * .05, r: Math.sin(t * .6) * .006 };
  portBG(ctx, t, cam, { horizon: 980, sun: [860, 240] });
  applyCam(ctx, cam, .3);
  ctx.fillStyle = '#e8cf95'; ctx.fillRect(-900, 930, 2900, 60); ctx.fillStyle = '#6dbb5a'; ctx.fillRect(-900, 905, 2900, 30);
  drawTown(ctx, 935, t, -180); drawMarineBase(ctx, 700, 935, .62, t);
  applyCam(ctx, cam, .5); drawSea(ctx, 985, t);
  applyCam(ctx, cam, 1);
  const bx = kf(lt, [[0, 150], [2.1, 470]], x => x);
  // wake
  for (let i = 0; i < 5; i++) { ctx.fillStyle = `rgba(255,255,255,${.5 - i * .09})`; ellipse(ctx, bx - 330 - i * 90, 1590 + i * 4, 70 - i * 8, 10); ctx.fill(); }
  drawRowboat(ctx, bx, 1560, 1.1, t);
  const row = Math.sin(t * 5);
  const ko = { x: bx - 170, y: 1478, s: 370, squash: .86, face: { eyes: 'normal', mouth: 'smile', look: [.6, 0] }, legs: { L: [1.3, -1.5], R: [1.2, -1.4] }, arms: { L: [1.2 + row * .3, -.6], R: [1.2 + row * .3, -.6] }, shadow: false };
  drawStick(ctx, C(KOBY, ko));
  for (const sd of [-1, 1]) line(ctx, bx - 170 + sd * 40 + row * 30, 1478 - .5 * 370 * .86, bx - 170 + sd * 160 - row * 60, 1640, 9, '#8a5530');
  drawStick(ctx, C(LUFFY, { x: bx + 140, y: 1468, s: 520, shadow: false, lean: -.04, bob: Math.sin(t * 2.2) * .004,
    arms: { L: [.5, -.3], R: [1.75 + Math.sin(t * 3) * .05, -.15] }, legs: { L: [.25, -.08], R: [-.05, -.02] },
    face: { eyes: 'normal', mouth: 'grin', look: [1, -.2], browAng: .25 } }));
  screen(ctx);
  const s1 = P(lt, 0, .22), s2 = P(lt, .3, .25);
  ctx.save(); ctx.translate(540, 330); ctx.scale(s1, s1); ctx.rotate(-.03); text(ctx, 'DIA 2', 0, 0, 170, '#ffe14d', INK, 22, 'Poppins', 700); ctx.restore();
  tag(ctx, 'SHELLS TOWN', 540, 490, 62, '#ffffff', INK, .03, s2);
} });
// 1 — "vocês escolheram o caminho original": the signpost
SHOTS.push({ start: 2.1, end: 4.05, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .06, r: 0 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#45a9ee', '#d6f0fb', -400, 1150);
  applyCam(ctx, cam, .15); drawCloud(ctx, 200 + t * 6, 330, 110, 5); drawCloud(ctx, 880 + t * 4, 220, 80, 6);
  applyCam(ctx, cam, .4); ctx.beginPath(); ctx.ellipse(300, 1200, 900, 160, 0, Math.PI, 0); fillStroke(ctx, '#7cc766', 6);
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#5fb24f'; ctx.fillRect(-600, 1150, 2300, 1500);
  path(ctx, [[480, 1150], [600, 1150], [1300, 2200], [-200, 2200]]); ctx.fillStyle = '#e7c48c'; ctx.fill();
  // post + planks
  rrect(ctx, 590, 600, 44, 980, 8); fillStroke(ctx, '#9a6232', 6);
  const tilt = Math.sin(t * 2) * .01;
  ctx.save(); ctx.translate(612, 720); ctx.rotate(-.04 + tilt);
  path(ctx, [[-180, -70], [250, -70], [320, 0], [250, 70], [-180, 70]]); fillStroke(ctx, '#d79a55', 7);
  text(ctx, 'ORIGINAL', 40, 4, 66, '#4a2614', null, 0, 'Poppins', 700); ctx.restore();
  ctx.save(); ctx.translate(612, 900); ctx.rotate(.05 - tilt);
  path(ctx, [[180, -60], [-250, -60], [-320, 0], [-250, 60], [180, 60]]); fillStroke(ctx, '#c08a50', 7);
  text(ctx, 'OUTRO', -40, 4, 58, '#4a2614', null, 0, 'Poppins', 700); ctx.restore();
  bigX(ctx, 560, 900, 70 * P(lt, 1.0, .2), ON(lt, 1.0, .05));
  const ck = P(lt, 1.42, .25); if (ck > 0) { ctx.save(); ctx.translate(900, 640); ctx.scale(ck, ck); circle(ctx, 0, 0, 80); fillStroke(ctx, '#fff', 8); check(ctx, 0, 0, 45); ctx.restore(); }
  // Luffy points the way
  const pt = lt > 1.4;
  drawStick(ctx, C(LUFFY, { x: 300, y: 1500, s: 500, arms: { L: [.4, -.2], R: pt ? [2.2, -.1] : [.9, -2.0] }, face: { eyes: pt ? 'happy' : 'normal', mouth: 'grin', look: [1, -.3] }, headTilt: pt ? -.08 : 0 }));
  // votes floating up
  for (let i = 0; i < 7; i++) { const k = lt - .3 - i * .2; if (k > 0) { const y = 1150 - k * 520, x = 960 + Math.sin(k * 4 + i) * 40 - i * 8; heart(ctx, x, y, 38, '#ff3b5c'); } }
} });
// 2 — "cheguei em Shells Town pra deixar o Koby na Marinha"
SHOTS.push({ start: 4.05, end: 6.85, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + lt * 10, y: 960 + hh[1], z: 1.0 + lt * .04, r: 0 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#3ea6ee', '#d9f1fb', -400, 1150);
  applyCam(ctx, cam, .14); drawCloud(ctx, 150 + t * 6, 260, 100, 7); drawCloud(ctx, 950 + t * 4, 330, 70, 8);
  applyCam(ctx, cam, .4); drawHouse(ctx, -40, 1160, 190, 260, '#f6c7a0', '#c0503a', 1); drawHouse(ctx, 160, 1160, 160, 200, '#bfe0f2', '#2f63c9', 2);
  drawHouse(ctx, 1180, 1160, 170, 230, '#f7e39a', '#d06a2c', 3);
  drawMarineBase(ctx, 700, 1160, .95, t);
  applyCam(ctx, cam, 1);
  drawGround(ctx, 1150, '#e9d3a6', '#d4b47e');
  // Koby walks to the base
  const kx = kf(lt, [[0, 470], [2.4, 720]], x => x), ky = kf(lt, [[0, 1500], [2.4, 1330]], x => x), ks = kf(lt, [[0, 420], [2.4, 330]], x => x);
  const turn = lt > 1.7;
  drawStick(ctx, C(KOBY, { x: kx, y: ky, s: ks, legs: turn ? POSE.idle.legs : walkLegs(t, 10, .45), arms: turn ? { L: [2.6 + Math.sin(t * 12) * .2, .2], R: [.3, -.1] } : walkArms(t, 10, .5), face: { eyes: 'happy', mouth: 'grin' }, flip: turn ? -1 : 1 }));
  drawStick(ctx, C(LUFFY, { x: 230, y: 1560, s: 580, arms: { L: [.4, -.2], R: [2.6 + Math.sin(t * 10) * .25, .25] }, face: { eyes: 'happy', mouth: 'grin' }, headTilt: Math.sin(t * 5) * .05 }));
  screen(ctx); tag(ctx, 'SHELLS TOWN', 330, 300, 56, '#ffffff', INK, -.04, P(lt, .8));
} });
// 3 — "e recrutar o meu primeiro tripulante"
SHOTS.push({ start: 6.85, end: 8.85, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .05, r: 0 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#4aaeea', '#fbe9c4', -400, 1300);
  applyCam(ctx, cam, .3); ctx.save(); ctx.filter = 'blur(6px)'; drawMarineBase(ctx, 820, 1350, 1.1, t); drawHouse(ctx, 120, 1350, 260, 330, '#f6c7a0', '#c0503a', 1); ctx.restore();
  applyCam(ctx, cam, 1);
  const think = lt < 1.1;
  drawStick(ctx, C(LUFFY, { x: 330, y: 1900, s: 1050, shadow: false,
    arms: think ? { L: [.4, -.2], R: { ik: [.02, -.68], bend: -1 } } : { L: [.4, -.2], R: [2.75, .1] },
    face: think ? { eyes: 'normal', mouth: 'flat', look: [.7, -.7], browOne: 1 } : { eyes: 'happy', mouth: 'grin' }, headTilt: think ? .08 : -.05 }));
  // thought bubble: an empty crew slot
  const bs = P(lt, .1, .3);
  thought(ctx, 760, 520, 300, bs, 520, 860);
  if (bs > 0) {
    ctx.save(); ctx.translate(760, 520); ctx.scale(bs, bs);
    drawStick(ctx, { x: -20, y: 150, s: 260, sil: '#c9c2d2', shadow: false });
    text(ctx, '?', 110, -40, 150, '#ffe14d', INK, 14, 'Poppins', 700);
    ctx.restore();
  }
  screen(ctx); tag(ctx, 'TRIPULANTE Nº 1', 700, 860, 52, '#ffe14d', INK, .04, P(lt, .95));
} });
// 4 — "só tem um problema"
SHOTS.push({ start: 8.85, end: 9.95, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx);
  const g = ctx.createRadialGradient(540, 860, 50, 540, 860, 1300); g.addColorStop(0, '#ffe08a'); g.addColorStop(1, '#f0702a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 860); ctx.rotate(t * .1); for (let i = 0; i < 14; i++) { ctx.rotate(TAU / 14); path(ctx, [[-70, 0], [70, 0], [0, -1700]]); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill(); } ctx.restore();
  const snap = kf(lt, [[0, 1.0], [.18, 1.22, easeOut]]);
  const hk = shake(t * 3, hitShake(lt, 0, 22, 5), 3);
  const cam = { x: 540 + hk[0], y: 880 + hk[1], z: snap, r: 0 };
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(LUFFY, { x: 540, y: 880 + .765 * 2100, s: 2100, shadow: false, face: { eyes: 'wide', mouth: 'flat', look: [0, 0], browUp: 1, pupil: .3 } }));
  sweat(ctx, 540 + 330, 700 + lt * 60, 60, ON(lt, .2));
  screen(ctx); const ex = P(lt, .15, .2); ctx.save(); ctx.translate(880, 360); ctx.scale(ex, ex); ctx.rotate(.15); text(ctx, '!', 0, 0, 220, '#ffe14d', INK, 20, 'Poppins', 700); ctx.restore();
} });
// 5 — "o cara que eu quero no meu bando, o temido caçador de piratas Roronoa Zoro"
SHOTS.push({ start: 9.95, end: 14.3, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const z = kf(lt, [[0, 1.0], [1.6, 1.04], [4.35, 1.38]]);
  const cam = { x: 540 + hh[0], y: kf(lt, [[0, 960], [4.35, 1060]]) + hh[1], z, r: 0 };
  courtyardBG(ctx, t, cam, { sun: [220, 230, 85], sunPow: 1.5, wallTop: 640, back: 980, towerX: 860,
    behindWall: c => { const up = kf(lt, [[0, 1], [.45, 0, backOut]]) * 160; drawStick(c, C(LUFFY, { x: 190, y: 980 + up, s: 440, shadow: false, arms: { L: { ik: [-.22, -.72], bend: -1 }, R: { ik: [.25, -.72], bend: 1 } }, face: { eyes: 'normal', mouth: 'grin', look: [1, .5] } })); } });
  applyCam(ctx, cam, 1);
  zoroTied(ctx, 560, 1580, 640, { eyes: lt > 3.4 ? 'normal' : 'half', mouth: 'flat', look: lt > 3.4 ? [0, 0] : [-.5, .2], browAng: .35, pupil: .35 }, { headTilt: lt > 3.4 ? 0 : .08 });
  caribbeanHeat(ctx, .4 + Math.sin(t * 5) * .04);
  screen(ctx);
  tag(ctx, 'CAÇADOR DE PIRATAS', 540, 300, 44, '#ffffff', INK, .03, P(lt, 2.5));
  tag(ctx, 'RORONOA ZORO', 540, 420, 80, '#3fae4f', '#ffffff', -.03, P(lt, 3.45, .2));
} });
// 6 — "tá amarrado num poste no pátio da Marinha, sem comer há dias"
SHOTS.push({ start: 14.3, end: 17.95, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [3.65, 1.08]]), r: 0 };
  courtyardBG(ctx, t, cam, { sun: [880, 210, 95], sunPow: 1.7, wallTop: 520, back: 900, towerX: 300 });
  applyCam(ctx, cam, 1);
  const tight = kf(lt, [[.3, 0], [.5, 1, backOut]]);
  const hungry = lt > 2.45;
  zoroTied(ctx, 540, 1880, 1050, hungry ? { eyes: 'half', mouth: 'frown', browAng: -.25, look: [0, .3] } : { eyes: 'normal', mouth: 'flat', browAng: .35, look: [.2, 0] }, { squash: 1 - tight * .03, headTilt: hungry ? Math.sin(t * 2) * .05 + .05 : 0 });
  caribbeanHeat(ctx, .55 + Math.sin(t * 6) * .05);
  sweat(ctx, 760, 900 + (lt % 1.2) * 80, 40, ON(lt, .6));
  sweat(ctx, 330, 960 + ((lt + .5) % 1.3) * 70, 30, ON(lt, 1.2));
  // hunger: thought bubble with a crossed-out rice ball, growling belly
  const bs = P(lt, 2.45, .3);
  thought(ctx, 270, 520, 230, bs, 420, 800);
  if (bs > 0) { ctx.save(); ctx.translate(270, 520); ctx.scale(bs, bs); onigiri(ctx, 0, 10, 1.2); bigX(ctx, 0, 10, 90, ON(lt, 2.9, .05)); ctx.restore(); }
  if (hungry) { const w = Math.sin(t * 30) * 6; ctx.save(); ctx.translate(820 + w, 700); ctx.rotate(.12); text(ctx, 'GRRR', 0, 0, 90 * P(lt, 2.6, .2), '#ffffff', INK, 14, 'Poppins', 700); ctx.restore(); }
} });
// 7 — "por causa de um acordo com o filho mimado do Capitão Morgan"
SHOTS.push({ start: 17.95, end: 20.88, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.06], [2.9, 1.0]]), r: 0 };
  courtyardBG(ctx, t, cam, { sun: [900, 200, 70], sunPow: 1.0, wallTop: 700, back: 1060, towerX: 200 });
  applyCam(ctx, cam, 1);
  // portrait of dad on the wall
  const pp = P(lt, 2.1, .25);
  if (pp > 0) { ctx.save(); ctx.translate(810, 470); ctx.scale(pp, pp); ctx.rotate(.04);
    rrect(ctx, -150, -170, 300, 330, 14); fillStroke(ctx, '#c9973a', 9); rrect(ctx, -122, -142, 244, 274, 6); fillStroke(ctx, '#8a1f2a', 6);
    ctx.save(); rrect(ctx, -122, -142, 244, 274, 6); ctx.clip(); drawStick(ctx, C(MORGAN, { x: 0, y: 330, s: 400, shadow: false, face: { eyes: 'normal', mouth: 'flat', browAng: .4 } })); ctx.restore();
    rrect(ctx, -110, 120, 220, 44, 8); fillStroke(ctx, '#e8c04a', 5); text(ctx, 'CAP. MORGAN', 0, 143, 30, INK, null, 0, 'Poppins', 700);
    ctx.restore(); }
  const laugh = lt > 1.3;
  drawStick(ctx, C(HELMEPPO, { x: 640, y: 1720, s: 820, headTilt: laugh ? Math.sin(t * 14) * .05 - .08 : 0, bob: laugh ? Math.abs(Math.sin(t * 14)) * -.01 : 0,
    arms: { L: [1.3, -.4], R: laugh ? [.9, -2.2] : [.4, -.2] },
    face: laugh ? { eyes: 'happy', mouth: 'grin', browAng: .2 } : { eyes: 'smug', mouth: 'smirk', look: [-1, 0], browOne: -1 } }));
  // the deal
  const sp = P(lt, .75, .3);
  if (sp > 0) { ctx.save(); ctx.translate(290, 760); ctx.scale(sp, sp); ctx.rotate(-.06);
    rrect(ctx, -170, -230, 340, 460, 10); fillStroke(ctx, '#f5ead2', 8);
    for (const yy of [-230, 230]) { rrect(ctx, -190, yy - 22, 380, 44, 22); fillStroke(ctx, '#d9c39a', 7); }
    text(ctx, 'ACORDO', 0, -140, 62, '#4a2614', null, 0, 'Lora', 700); line(ctx, -120, -95, 120, -95, 5, '#4a2614');
    text(ctx, '1 MÊS', 0, -10, 70, '#c0302a', null, 0, 'Poppins', 700); text(ctx, 'SEM COMER', 0, 70, 42, '#4a2614', null, 0, 'Poppins', 700);
    ctx.beginPath(); ctx.moveTo(-90, 160); ctx.bezierCurveTo(-40, 120, -20, 190, 30, 150); ctx.bezierCurveTo(60, 130, 80, 170, 100, 150); ctx.lineWidth = 5; ctx.strokeStyle = '#2a3f8f'; ctx.stroke();
    ctx.restore(); }
} });
// 8 — "eu pulo o muro e faço a proposta"
SHOTS.push({ start: 20.88, end: 22.75, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 4);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .04, r: 0 };
  const jt = lt / .95;
  const x = lerp(230, 720, clamp(jt)), y = jt < 1 ? lerp(1030, 1520, jt) - Math.sin(clamp(jt) * Math.PI) * 820 : 1520;
  const flying = jt < 1;
  const drawL = c => drawStick(c, C(LUFFY, { x, y, s: 440, squash: flying ? 1 : kf(lt, [[.95, .8], [1.2, 1, backOut]]), lean: flying ? .35 : 0, shadow: !flying,
    arms: flying ? POSE.handsUp.arms : (lt > 1.0 ? { L: [.4, -.2], R: [1.7, -.1] } : POSE.idle.arms), legs: flying ? { L: [.9, -1.3], R: [.5, -1.0] } : POSE.idle.legs,
    face: flying ? { eyes: 'wide', mouth: 'grin' } : { eyes: 'normal', mouth: 'grin', look: [1, 0], browAng: .3 } }));
  courtyardBG(ctx, t, cam, { sun: [880, 200, 70], wallTop: 760, back: 1150, towerX: 800, behindWall: c => { if (jt < .32) drawL(c); } });
  applyCam(ctx, cam, 1);
  if (jt >= .32) drawL(ctx);
  if (flying) speedLines(ctx, 540, 900, .5, t);
  if (!flying) { const pa = kf(lt, [[.95, 1], [1.5, 0]]); puff(ctx, x - 150, 1510, 60 + (lt - .95) * 80, t, '#efe3cf', 3, pa); puff(ctx, x + 150, 1510, 60 + (lt - .95) * 80, t, '#efe3cf', 4, pa); }
} });
// 9 — the offer: "solto ele e pego as três espadas dele de volta, se ele virar meu pirata"
function offerScene(ctx, lt, t, cam, zface, lface) {
  courtyardBG(ctx, t, cam, { sun: [180, 220, 70], wallTop: 680, back: 1020, towerX: 300 });
  applyCam(ctx, cam, 1);
  zoroTied(ctx, 770, 1560, 600, zface.face, zface.extra || {});
  drawStick(ctx, C(LUFFY, Object.assign({ x: 270, y: 1560, s: 560 }, lface)));
}
SHOTS.push({ start: 22.75, end: 26.65, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [3.9, 1.06]]), r: 0 };
  const skeptic = lt > 1.4 && lt < 2.9;
  offerScene(ctx, lt, t, cam, { face: { eyes: 'normal', mouth: skeptic ? 'flat' : 'smirk', look: [-.8, 0], browOne: skeptic ? -1 : 0, browAng: .2 } },
    { arms: { L: [.4, -.2], R: [1.45, -.1] }, face: { eyes: 'normal', mouth: 'grin', look: [1, 0], browAng: .25 } });
  screen(ctx);
  // 1. free him: rope snaps
  const r1 = P(lt, .05, .25) * (1 - ON(lt, 1.2, .15));
  if (r1 > 0) { ctx.save(); ctx.translate(540, 470); ctx.scale(r1, r1); const gap = kf(lt, [[.5, 0], [.7, 60, easeOut]]);
    for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * gap, 0); ctx.rotate(sd * gap * .004); rrect(ctx, sd > 0 ? 10 : -230, -22, 220, 44, 22); fillStroke(ctx, '#d9b77a', 8); for (let i = 0; i < 5; i++) line(ctx, (sd > 0 ? 30 : -210) + i * 40, -18, (sd > 0 ? 50 : -190) + i * 40, 18, 5, 'rgba(120,80,30,.6)'); ctx.restore(); }
    if (gap > 5) burst(ctx, 0, 0, 60 * (1 - gap / 120), 8, '#fff6c4', 4);
    ctx.restore(); }
  // 2. three swords
  const s2 = P(lt, 1.32, .3); const s2out = ON(lt, 2.9, .2);
  if (s2 > 0) { ctx.save(); ctx.translate(lerp(540, 250, s2out), lerp(560, 470, s2out)); const k = s2 * lerp(1, .55, s2out); ctx.scale(k, k); threeSwords(ctx, 0, 140, 1.15, 1); ctx.restore(); }
  // 3. join my crew
  const s3 = P(lt, 2.95, .3);
  if (s3 > 0) { ctx.save(); ctx.translate(620, 480); ctx.scale(s3, s3); strawFlag(ctx, 0, 0, 1.25, t); ctx.restore(); }
} });
// 10 — "ele até topa"
SHOTS.push({ start: 26.65, end: 27.55, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx);
  const g = ctx.createRadialGradient(540, 900, 80, 540, 900, 1300); g.addColorStop(0, '#d9f6c8'); g.addColorStop(1, '#2f8a4a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [.9, 1.08]]), r: 0 };
  applyCam(ctx, cam, 1);
  const nod = lt > .25 && lt < .6 ? Math.sin((lt - .25) / .35 * Math.PI) * .12 : 0;
  drawStick(ctx, C(ZORO, { x: 540, y: 2150, s: 1500, shadow: false, arms: { L: [1.56, 0], R: [1.56, 0] }, headTilt: nod, face: { eyes: 'half', mouth: 'smirk', look: [-.3, 0], browAng: .3 } }));
  const sa = kf(lt, [[.35, 0], [.5, 1], [.85, 0]]); sparkle(ctx, 760, 760, 80 * sa, sa);
} });
// 11 — "mas nessa exata hora": a huge shadow falls on them
SHOTS.push({ start: 27.55, end: 28.85, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.06], [1.3, 1.14]]), r: 0 };
  const look = lt > .75;
  offerScene(ctx, lt, t, cam, { face: look ? { eyes: 'wide', mouth: 'flat', look: [1, -.4], browUp: 1 } : { eyes: 'happy', mouth: 'smirk' } },
    { arms: look ? { L: [.6, -.3], R: [.6, -.3] } : { L: [.4, -.2], R: [2.6, .2] }, face: look ? { eyes: 'wide', mouth: 'o', look: [1, -.5], browUp: 1 } : { eyes: 'happy', mouth: 'grin' } });
  // shadow creeping in from the right
  screen(ctx); const sh = kf(lt, [[.2, 0], [1.1, 1]]);
  const gx = ctx.createLinearGradient(1080, 0, 1080 - 1500 * sh, 0); gx.addColorStop(0, 'rgba(10,5,20,.75)'); gx.addColorStop(1, 'rgba(10,5,20,0)'); ctx.fillStyle = gx; ctx.fillRect(0, 0, W, H);
  if (look) { const k = P(lt, .75, .15); ctx.save(); ctx.translate(270, 800); ctx.scale(k, k); text(ctx, '!', 0, 0, 140, '#ffe14d', INK, 14, 'Poppins', 700); ctx.restore(); ctx.save(); ctx.translate(780, 780); ctx.scale(k, k); text(ctx, '!', 0, 0, 140, '#ffe14d', INK, 14, 'Poppins', 700); ctx.restore(); }
} });
// 12 — "o Capitão Morgan aparece furioso"
SHOTS.push({ start: 28.85, end: 30.78, tr: 'whip', draw(ctx, lt, t) {
  screen(ctx);
  const g = ctx.createRadialGradient(540, 800, 80, 540, 900, 1400); g.addColorStop(0, '#ffb35a'); g.addColorStop(.5, '#d8312b'); g.addColorStop(1, '#5a0f1a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  speedLines(ctx, 540, 900, .7, t, 'rgba(255,220,180,');
  const hk = shake(t * 3, hitShake(lt, 0, 36, 3) + hitShake(lt, 1.3, 18, 4), 3);
  const cam = { x: 540 + hk[0], y: 980 + hk[1], z: kf(lt, [[0, 1.25], [.25, 1.0, easeOut], [1.93, 1.05]]), r: Math.sin(t * .8) * .01 };
  applyCam(ctx, cam, 1);
  const raise = kf(lt, [[0, 2.0], [.35, 2.75, backOut]]);
  drawStick(ctx, C(MORGAN, { x: 540, y: 2060, s: 1320, shadow: false, armLen: 1.05,
    arms: { L: [.7, -.5], R: [raise, .25] },
    prop: (c, k, h, a, side) => { if (k === 'R') axeHand(c, h[0], h[1], .0016, -side * a); },
    face: { eyes: 'normal', mouth: 'teeth', browAng: -.45, pupil: .3, look: [0, .2] }, headTilt: Math.sin(t * 9) * .015 }));
  // fury steam
  const fa = ON(lt, 1.25, .2);
  if (fa > 0) for (const sd of [-1, 1]) puff(ctx, 540 + sd * 300, 760 - (lt - 1.25) * 160, 70 + (lt - 1.25) * 60, t, '#f2e6dd', 11 + sd, fa * (1 - ON(lt, 1.8, .15)));
  screen(ctx);
  tag(ctx, 'CAPITÃO MORGAN', 540, 300, 76, '#e0392f', '#ffffff', -.04, P(lt, .12, .2));
  flashFrame(ctx, Math.max(0, 1 - lt * 5) * .7);
} });
// 13 — "com um pelotão inteiro apontando armas pra gente"
SHOTS.push({ start: 30.78, end: 33.5, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [2.7, 1.12]]), r: 0 };
  courtyardBG(ctx, t, cam, { sun: [900, 220, 60], sunPow: .8, wallTop: 660, back: 1000, towerX: 540 });
  applyCam(ctx, cam, 1);
  const aim = kf(lt, [[1.0, 0], [1.3, 1, backOut]]);
  const face = { eyes: 'normal', mouth: 'flat', browAng: -.4, pupil: .3 };
  const rows = [[[150, 1240], [345, 1240], [540, 1240], [735, 1240], [930, 1240]], [[250, 1480], [540, 1480], [830, 1480]]];
  rows.forEach((row, ri) => { const s = ri ? 520 : 380;
    row.forEach(([x, y], i) => {
      const k = P(lt, .05 + i * .07 + ri * .25, .25);
      drawStick(ctx, C(MARINE, { x, y: y + (1 - k) * 300, s, face, arms: aim > 0 ? { L: [.9, -1.6], R: [.9, -1.6] } : { L: [.3, -.1], R: [.3, -.1] } }));
      if (aim > 0) rifleAtCam(ctx, x, y + (1 - k) * 300 - .5 * s, 26 * (ri ? 1.4 : 1) * aim);
    }); });
  // glints
  if (lt > 1.3) for (let i = 0; i < 8; i++) { const R = rng(i + 3); const a = clamp(Math.sin((lt - 1.3) * 6 + i * 1.7)); sparkle(ctx, 120 + R() * 840, 950 + R() * 400, 30 * a, a); }
} });
// 14 — "o cerco fechou": top-down ring of rifles
SHOTS.push({ start: 33.5, end: 34.55, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); ctx.fillStyle = '#d9b47a'; ctx.fillRect(0, 0, W, H);
  const R0 = rng(5); ctx.fillStyle = 'rgba(140,90,40,.25)'; for (let i = 0; i < 80; i++) { ellipse(ctx, R0() * W, R0() * H, 10 + R0() * 26, 6 + R0() * 12); ctx.fill(); }
  const hk = shake(t * 3, hitShake(lt, .45, 20, 4), 3);
  ctx.translate(540 + hk[0], 900 + hk[1]); ctx.rotate(t * .25); const zz = kf(lt, [[0, .95], [1.05, 1.08]]); ctx.scale(zz, zz);
  const r = kf(lt, [[0, 820], [.45, 420, easeOut]]);
  const n = 12;
  for (let i = 0; i < n; i++) { const a = i / n * TAU; const x = Math.cos(a) * r, y = Math.sin(a) * r;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI);
    ctx.fillStyle = 'rgba(40,20,30,.2)'; ellipse(ctx, 14, 14, 70, 95); ctx.fill();
    drawRifle(ctx, 120, 30, 240, 0);
    ellipse(ctx, 0, 0, 58, 88); fillStroke(ctx, '#f4f1ea', 8); ctx.save(); ellipse(ctx, 0, 0, 58, 88); ctx.clip(); ctx.fillStyle = '#2f63c9'; ctx.fillRect(-70, -20, 140, 40); ctx.restore();
    circle(ctx, 0, 0, 52); fillStroke(ctx, '#f8f8f6', 8); circle(ctx, 0, 0, 30); ctx.lineWidth = 8; ctx.strokeStyle = '#2a4f9e'; ctx.stroke();
    ctx.restore(); }
  // the two in the middle, from above
  ctx.save(); ctx.translate(-80, 0); ellipse(ctx, 0, 0, 60, 92); fillStroke(ctx, '#d8312b', 8); ellipse(ctx, 0, 0, 120, 120); fillStroke(ctx, '#f2cf5b', 8); circle(ctx, 0, 0, 62); fillStroke(ctx, '#f6d66a', 8); circle(ctx, 0, 0, 62); ctx.lineWidth = 12; ctx.strokeStyle = '#d8312b'; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(95, 10); ellipse(ctx, 0, 0, 62, 95); fillStroke(ctx, '#f4f1ea', 8); const sp = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; const rr = i % 2 ? 50 : 64; sp.push([Math.cos(a) * rr, Math.sin(a) * rr]); } path(ctx, sp); fillStroke(ctx, '#3fae4f', 8); ctx.restore();
} });
// 15 — "o que eu faço agora?"
SHOTS.push({ start: 34.55, end: 35.62, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.1], [1.07, 1.0]]), r: 0 };
  ctx.save(); ctx.filter = 'blur(6px)'; courtyardBG(ctx, t, cam, { wallTop: 760, back: 1150, towerX: 800 });
  applyCam(ctx, cam, 1); for (const x of [-40, 180, 900, 1120]) drawStick(ctx, C(MARINE, { x, y: 1500, s: 560, face: { eyes: 'normal', mouth: 'flat', browAng: -.4 }, arms: { L: [.9, -1.6], R: [.9, -1.6] } })); ctx.restore();
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(LUFFY, { x: 540, y: 1950, s: 1200, shadow: false, arms: { L: [1.25, -1.9], R: [1.25, -1.9] }, face: { eyes: 'wide', mouth: lt > .5 ? 'flat' : 'o', look: [0, 0], browUp: 1, pupil: .35 }, headTilt: Math.sin(t * 3) * .04 }));
  sweat(ctx, 800, 820 + lt * 60, 46, ON(lt, .2));
  screen(ctx);
  [[200, 560, .1], [880, 520, .3], [760, 330, .5]].forEach(([x, y, t0], i) => { const k = P(lt, t0, .2); ctx.save(); ctx.translate(x, y + Math.sin(t * 4 + i) * 10); ctx.scale(k, k); ctx.rotate((i - 1) * .2); text(ctx, '?', 0, 0, 150, '#ffe14d', INK, 14, 'Poppins', 700); ctx.restore(); });
} });
// 16 — "você decide o Dia 3 nos comentários": freeze frame, rubber arm, two choices
SHOTS.push({ start: 35.62, end: 38.22, tr: 'whip', draw(ctx, lt, t) {
  const cam = { x: 540, y: 960, z: kf(lt, [[0, 1.08], [2.6, 1.0]]), r: 0 };
  const tf = 35.62;      // the world is frozen
  courtyardBG(ctx, tf, cam, { sun: [900, 220, 60], wallTop: 640, back: 980, towerX: 800 });
  applyCam(ctx, cam, 1);
  zoroTied(ctx, 820, 1420, 470, { eyes: 'wide', mouth: 'flat', look: [-1, -.3], browUp: 1 });
  for (const x of [80, 1000]) drawStick(ctx, C(MARINE, { x, y: 1720, s: 560, face: { eyes: 'normal', mouth: 'flat', browAng: -.4 }, arms: { L: [.9, -1.6], R: [.9, -1.6] } }));
  screen(ctx); ctx.fillStyle = 'rgba(30,40,80,.5)'; ctx.fillRect(0, 0, W, H);
  // spotlight behind Luffy
  const g = ctx.createRadialGradient(380, 1100, 50, 380, 1100, 700); g.addColorStop(0, 'rgba(255,240,180,.55)'); g.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  applyCam(ctx, cam, 1);
  const st = kf(lt, [[.15, 0], [.55, 1, elastic]]);
  const lo = { x: 380, y: 1640, s: 700, face: { eyes: 'normal', mouth: 'grin', look: [1, -1], browAng: .3 }, arms: { L: [.5, -.3], R: [1.4, -.4] }, lean: -.05 };
  if (st > 0) stretchTo(lo, 'R', lerp(520, 900, st), lerp(1160, 560, st), -1);
  drawStick(ctx, C(LUFFY, lo));
  // stretch marks
  if (st > .5) for (let i = 0; i < 3; i++) { const k = .3 + i * .2; const px = lerp(450, 900, k), py = lerp(1265, 560, k); line(ctx, px - 30, py - 20, px - 60, py - 45, 6, '#ffffff'); }
  screen(ctx);
  // pause badge
  const pb = ON(lt, 0, .1); ctx.save(); ctx.globalAlpha = pb; rrect(ctx, 110, 230, 130, 70, 18); fillStroke(ctx, 'rgba(20,10,30,.6)', 0); rrect(ctx, 140, 245, 18, 40, 4); ctx.fillStyle = '#fff'; ctx.fill(); rrect(ctx, 172, 245, 18, 40, 4); ctx.fill(); ctx.restore();
  const c1 = P(lt, .45, .3), c2 = P(lt, .75, .3);
  ctx.save(); ctx.translate(540, 470); ctx.scale(c1 * .92, c1 * .92); choiceCard(ctx, 0, 0, 820, 170, 1, 'LUTAR', 'invadir a base', '#e0392f', 0); ctx.restore();
  ctx.save(); ctx.translate(540, 680); ctx.scale(c2 * .92, c2 * .92); choiceCard(ctx, 0, 0, 820, 170, 2, 'FUGIR', 'roubar um navio', '#2f63c9', 0); ctx.restore();
  tag(ctx, 'VOCÊ DECIDE', 640, 300, 52, '#ffe14d', INK, .03, P(lt, .2));
} });
// 17 — Opção 1: kick the door in
SHOTS.push({ start: 38.22, end: 40.3, tr: 'whip', draw(ctx, lt, t) {
  const kick = 1.0;
  const hk = shake(t * 3, hitShake(lt, kick, 28, 3.5), 3);
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + hk[0], y: 960 + hh[1] + hk[1], z: kf(lt, [[0, 1.0], [2.1, 1.08]]), r: 0 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#3a9de8', '#fbe8bf', -400, 700);
  applyCam(ctx, cam, 1);
  // base front with big doors
  rrect(ctx, -500, 420, 2100, 900, 0); fillStroke(ctx, '#ece7db', 6);
  ctx.fillStyle = '#2f63c9'; ctx.fillRect(-500, 470, 2100, 34); text(ctx, 'MARINHA', 540, 560, 64, '#2f63c9', null, 0, 'Poppins', 700);
  drawGround(ctx, 1300);
  rrect(ctx, 300, 640, 480, 670, [40, 40, 0, 0]); fillStroke(ctx, '#140e12', 6);
  const open = kf(lt, [[kick, 0], [kick + .2, 1, easeOut]]);
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(540 + sd * 120 + sd * open * 260, 975 - open * 140); ctx.rotate(sd * open * .9); ctx.scale(1 - open * .3, 1 - open * .3);
    rrect(ctx, -120, -335, 240, 670, 12); fillStroke(ctx, '#9a5a2a', 6); for (let i = 1; i < 4; i++) line(ctx, -120 + i * 60, -330, -120 + i * 60, 330, 4, 'rgba(70,35,10,.5)');
    rrect(ctx, -120, -200, 240, 30, 4); fillStroke(ctx, '#5a606c', 4); rrect(ctx, -120, 170, 240, 30, 4); fillStroke(ctx, '#5a606c', 4); ctx.restore(); }
  const x = kf(lt, [[0, -150], [.85, 380]], x => x);
  const kicking = lt > .8 && lt < 1.35;
  drawStick(ctx, C(LUFFY, { x, y: 1600, s: 560, lean: kicking ? -.25 : .12,
    legs: kicking ? { L: [.15, -.1], R: [1.75, 0] } : (lt < .85 ? walkLegs(t, 18, .7) : POSE.idle.legs),
    arms: kicking ? { L: [1.4, -.5], R: [.9, -1.8] } : (lt < .85 ? walkArms(t, 18, .8) : { L: [.4, -.2], R: [.9, -2.0] }),
    face: { eyes: 'normal', mouth: 'grin', look: [1, 0], browAng: .4 } }));
  punchFX(ctx, 560, 900, lt - kick, 'BAM!', 31);
  if (lt > kick) { const pa = 1 - ON(lt, kick + .2, .5); puff(ctx, 300, 1260, 90 + (lt - kick) * 120, t, '#efe3cf', 6, pa); puff(ctx, 800, 1240, 90 + (lt - kick) * 120, t, '#efe3cf', 7, pa); }
  optionBanner(ctx, 1, lt);
} });
// 18 — "recupero as espadas do Zoro"
SHOTS.push({ start: 40.3, end: 41.4, tr: 'whip', draw(ctx, lt, t) {
  screen(ctx);
  const g = ctx.createRadialGradient(540, 900, 80, 540, 900, 1300); g.addColorStop(0, '#e7ffd9'); g.addColorStop(1, '#2c7a44'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  speedLines(ctx, 540, 900, .4, t);
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.12], [.4, 1.0, easeOut], [1.1, 1.03]]), r: 0 };
  applyCam(ctx, cam, 1);
  const caught = lt > .35;
  const hilts = ['#f4f1ea', '#c0302a', '#1e1a20'];
  const sw = (hilt, ang) => (c, k, h, a, side) => { if (k === 'R' && hilt[0]) katana(c, h[0], h[1], .55, ang[0], hilt[0]); if (k === 'L' && hilt[1]) katana(c, h[0], h[1], .55, ang[1], hilt[1]); };
  drawStick(ctx, C(ZORO, { x: 540, y: 1650, s: 760, arms: caught ? { L: [2.2, .2], R: [2.2, .2] } : { L: [2.6, .2], R: [2.6, .2] }, legs: { L: [.35, -.2], R: [.35, -.2] },
    prop: caught ? sw([hilts[1], hilts[2]], [-.95, -.95]) : null,
    face: { eyes: 'normal', mouth: caught ? 'flat' : 'o', browAng: .45, pupil: .3 } }));
  if (caught) katana(ctx, 330, 1132, 420, 0, hilts[0]); // one in the mouth
  else for (let i = 0; i < 3; i++) { const k = lt / .35; katana(ctx, lerp(300 + i * 240, 540, k * .3), lerp(-100, 900, k), 330, t * 14 + i * 2, hilts[i]); }
  const sa = kf(lt, [[.35, 0], [.5, 1], [.9, 0]]); sparkle(ctx, 880, 700, 90 * sa, sa); sparkle(ctx, 200, 820, 60 * sa, sa);
  flashFrame(ctx, Math.max(0, 1 - (lt - .35) * 6) * (caught ? .5 : 0));
  optionBanner(ctx, 1, 1);
} });
// 19 — "e a gente derruba o Capitão Morgan na porrada"
SHOTS.push({ start: 41.4, end: 44.48, tr: 'whip', draw(ctx, lt, t) {
  const h1 = 1.08, h2 = 2.6;
  const hk = shake(t * 3, hitShake(lt, h1, 30, 4) + hitShake(lt, h2, 44, 3), 3);
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + hk[0], y: 960 + hh[1] + hk[1], z: kf(lt, [[0, 1.0], [3.0, 1.06]]), r: (hitShake(lt, h2, 1, 3)) * .03 };
  courtyardBG(ctx, t, cam, { sun: [180, 220, 70], wallTop: 640, back: 990, towerX: 300 });
  applyCam(ctx, cam, 1);
  // Morgan: staggers on hit 1, launched on hit 2
  const fly = clamp((lt - h2) / .6);
  const mx = 800 + (lt > h1 ? 40 : 0) + fly * 700, my = 1700 - Math.sin(fly * Math.PI * .5) * 900;
  const ko = lt > h2 ? 'spiral' : lt > h1 ? 'x' : 'normal';
  drawStick(ctx, C(MORGAN, { x: mx, y: my, s: 900, lean: lt > h1 ? .25 + fly * 2 : 0, shadow: fly < .1,
    arms: lt > h1 ? { L: [2.4, .2], R: [2.4, .2] } : { L: [.7, -.4], R: [2.6, .25] },
    prop: lt < h2 ? (c, k, h, a, side) => { if (k === 'R') axeHand(c, h[0], h[1], .0016, -side * a); } : null,
    face: { eyes: ko, mouth: lt > h1 ? 'o' : 'teeth', browAng: -.45, t } }));
  if (lt > h2) axeHand(ctx, 800 + (lt - h2) * 300, 700 - (lt - h2) * 900, 1.2, t * 12);
  // Luffy: wind up, then rubber punches
  const lo = { x: 220, y: 1560, s: 520, face: { eyes: 'normal', mouth: 'teeth', browAng: .45, look: [1, 0] }, arms: { L: [.6, -.6], R: [.9, -2.0] }, lean: .05 };
  const punch = (t0) => clamp((lt - t0) / .12) * (1 - clamp((lt - t0 - .25) / .2));
  const p1 = punch(h1 - .12), p2 = punch(h2 - .12);
  if (lt < h1 - .12) lo.arms.R = [.4 - Math.sin(t * 10) * .2, -1.4];
  if (p1 > 0) stretchTo(lo, 'R', lerp(320, 790, p1), lerp(1270, 1010, p1));
  if (p2 > 0) stretchTo(lo, 'R', lerp(320, 800, p2), lerp(1270, 1000, p2));
  if (p1 > 0 || p2 > 0) { lo.lean = -.15; lo.face.mouth = 'grin'; }
  drawStick(ctx, C(LUFFY, lo));
  punchFX(ctx, 780, 1000, lt - h1, 'POW!', 41);
  punchFX(ctx, 800, 980, lt - h2, 'BOOM!', 47, 1.2);
  if (lt > h1 && lt < h2) for (let i = 0; i < 3; i++) { const a = t * 5 + i * TAU / 3; star5(ctx, mx + Math.cos(a) * 150, 980 - 330 + Math.sin(a) * 35, 28, t * 3); }
  flashFrame(ctx, Math.max(0, 1 - (lt - h2) * 6) * (lt > h2 ? .6 : 0));
  optionBanner(ctx, 1, 1);
} });
// 20 — Opção 2: "puxo o Zoro com o braço de borracha"
SHOTS.push({ start: 44.48, end: 47.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [2.5, 1.06]]), r: 0 };
  courtyardBG(ctx, t, cam, { sun: [880, 210, 70], wallTop: 660, back: 1000, towerX: 220 });
  applyCam(ctx, cam, 1);
  const grab = .9, snap = 1.4, yank = 1.55, arrive = 2.1;
  const zx = 790, zy = 1560;
  const yk = clamp((lt - yank) / (arrive - yank));
  const zp = [lerp(zx, 470, ease(yk)), lerp(zy, 1560, yk) - Math.sin(yk * Math.PI) * 380];
  drawPost(ctx, zx, zy + 10, 560 * 1.05, zy - .535 * 560, 560 * .86);
  const zface = lt < yank ? { eyes: 'normal', mouth: lt > grab ? 'o' : 'flat', look: [-1, 0], browAng: .3 } : { eyes: 'wide', mouth: 'teeth', browUp: 1 };
  drawStick(ctx, C(ZORO, { x: zp[0], y: zp[1], s: 560, shadow: yk === 0 || yk === 1, lean: yk > 0 && yk < 1 ? -.5 : 0,
    arms: lt < snap ? { L: [1.56, 0], R: [1.56, 0] } : { L: [2.5, .2], R: [2.5, .2] }, legs: yk > 0 && yk < 1 ? { L: [.9, -1.2], R: [.6, -1.0] } : POSE.idle.legs, face: zface }));
  if (lt < snap) { ropeWraps(ctx, zx, zy - .5 * 560, 560 * .27, 3); for (const sd of [-1, 1]) ropeWraps(ctx, zx + sd * .34 * 560, zy - .535 * 560 - 18, 40, 2); }
  else if (lt < snap + .6) { const k = (lt - snap) / .6; for (let i = 0; i < 6; i++) { const a = i * 1.1; const r = k * 260; ctx.save(); ctx.translate(zx + Math.cos(a) * r, zy - 300 + Math.sin(a) * r + k * k * 300); ctx.rotate(a + k * 6); rrect(ctx, -40, -9, 80, 18, 9); fillStroke(ctx, '#d9b77a', 5); ctx.restore(); } }
  // Luffy's arm shoots out, grabs, pulls back
  const lo = { x: 230, y: 1560, s: 540, face: { eyes: 'normal', mouth: 'grin', look: [1, 0], browAng: .35 }, arms: { L: [.5, -.4], R: [1.5, -.2] }, lean: -.05 };
  const out = clamp((lt - .55) / .3);
  if (lt > .55) { const hx = lt < yank ? lerp(380, zp[0] - 60, out) : zp[0] - 40, hy = lt < yank ? lerp(1260, zp[1] - .55 * 560, out) : zp[1] - .55 * 560; if (yk < 1) stretchTo(lo, 'R', hx, hy); else lo.arms = { L: [.5, -.4], R: [2.6, .2] }; }
  drawStick(ctx, C(LUFFY, lo));
  if (lt > snap && lt < snap + .4) { screen(ctx); const k = P(lt, snap, .12) * (1 - ON(lt, snap + .25, .15)); ctx.save(); ctx.translate(760, 820); ctx.scale(k, k); burst(ctx, 0, 0, 160, 10, '#fff6c4', 13); text(ctx, 'SNAP!', 0, 0, 80, '#e0392f', INK, 12, 'Poppins', 700); ctx.restore(); }
  optionBanner(ctx, 2, lt);
} });
// 21 — "fujo da base agora mesmo"
SHOTS.push({ start: 47.0, end: 48.72, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 5);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.02, r: Math.sin(t * 8) * .006 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#3a9de8', '#fbe8bf', -400, 700);
  applyCam(ctx, cam, .3); drawMarineBase(ctx, 900 - lt * 160, 760, .6, t);
  applyCam(ctx, cam, 1);
  ctx.save(); ctx.translate(-(lt * 1400) % 160, 0); drawBaseWall(ctx, 700, 1130, -600, 2400); ctx.restore();
  drawGround(ctx, 1120);
  ctx.save(); ctx.translate(-(lt * 1800) % 300, 0); ctx.fillStyle = 'rgba(140,90,40,.3)'; for (let x = -300; x < 1500; x += 300) { ellipse(ctx, x, 1700, 60, 14); ctx.fill(); } ctx.restore();
  // marines chasing from the left, firing
  for (const [x, s, ph] of [[60, 430, 0], [-120, 400, 1.3]]) {
    drawStick(ctx, C(MARINE, { x: x + Math.sin(t * 3 + ph) * 20, y: 1560, s, legs: walkLegs(t + ph, 20, .7), arms: { L: [1.5, -.2], R: [1.5, -.2] }, lean: .15, face: { eyes: 'normal', mouth: 'teeth', browAng: -.4 },
      prop: (c, k, h, a, side) => { if (k === 'R') { c.save(); c.translate(h[0], h[1]); c.rotate(-side * a + Math.PI / 2); c.restore(); } } }));
    drawRifle(ctx, x + Math.sin(t * 3 + ph) * 20 + .3 * s, 1560 - .55 * s, 200, -.05);
    const f = (lt * 2 + ph) % 1; if (f < .15) { puff(ctx, x + .3 * s + 220, 1560 - .55 * s, 40, t, '#f3efe6', 5, 1 - f / .15); }
  }
  // Luffy and Zoro sprint right
  drawStick(ctx, C(ZORO, { x: 560, y: 1560, s: 500, legs: walkLegs(t, 24, .8), arms: walkArms(t, 24, .9), lean: .25, face: { eyes: 'normal', mouth: 'teeth', browAng: .3, look: [1, 0] } }));
  drawStick(ctx, C(LUFFY, { x: 830, y: 1560, s: 520, legs: walkLegs(t + .3, 24, .8), arms: walkArms(t + .3, 24, .9), lean: .25, face: { eyes: 'normal', mouth: 'grin', look: [1, 0] } }));
  for (let i = 0; i < 4; i++) { const k = ((lt * 3 + i * .25) % 1); puff(ctx, 480 - k * 300, 1550, 30 + k * 40, t, '#efe3cf', 20 + i, (1 - k) * .9); }
  speedLines(ctx, 1400, 900, .35, t);
  optionBanner(ctx, 2, 1);
} });
// 22 — "e roubo um navio da Marinha no porto"
SHOTS.push({ start: 48.72, end: 50.52, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [1.8, 1.05]]), r: 0 };
  portBG(ctx, t, cam, { horizon: 900, sun: [200, 260] });
  applyCam(ctx, cam, .5); drawSea(ctx, 900, t);
  applyCam(ctx, cam, 1);
  drawDock(ctx, 1470, -400, 330);
  const sx = kf(lt, [[0, 600], [1.8, 760]], x => x), sy = 1330;
  drawShip(ctx, sx, sy, .95, t, { flag: '#2f63c9', hull: '#f0ece2', stripe: '#2f63c9', sail: '#ffffff', ph: 0, flip: -1 });
  // our two on deck, waving
  const by = sy + Math.sin(t * 1.6) * 4 * .95 - 95 * .95;
  drawStick(ctx, C(LUFFY, { x: sx - 80, y: by, s: 230, shadow: false, arms: { L: [2.6 + Math.sin(t * 12) * .25, .2], R: [.4, -.2] }, face: { eyes: 'happy', mouth: 'grin' } }));
  drawStick(ctx, C(ZORO, { x: sx + 60, y: by, s: 240, shadow: false, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'half', mouth: 'smirk' } }));
  // marines left behind on the dock
  for (const [x, ph] of [[60, 0], [220, 1.2]]) drawStick(ctx, C(MARINE, { x, y: 1440, s: 300, arms: { L: [2.6 + Math.sin(t * 14 + ph) * .3, .2], R: [2.4 - Math.sin(t * 14 + ph) * .3, .2] }, face: { eyes: 'normal', mouth: 'teeth', browAng: -.4 }, bob: Math.abs(Math.sin(t * 14 + ph)) * -.03 }));
  optionBanner(ctx, 2, 1);
} });
// 23 — "deixando o Koby pra se virar sozinho"
SHOTS.push({ start: 50.52, end: 52.5, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: kf(lt, [[0, 1060], [2.0, 1000]]) + hh[1], z: kf(lt, [[0, 1.25], [1.3, 1.22], [1.98, .96, easeOut]]), r: 0 };
  portBG(ctx, t, cam, { horizon: 960, sun: [860, 300], skyTop: '#5c8fd6', skyBot: '#f6c79a', sunPow: .7 });
  applyCam(ctx, cam, .5); drawSea(ctx, 960, t, 2600, ['#9ac7d8', '#3a8fb0', '#24607e']);
  drawShip(ctx, 820 + lt * 20, 975, .16, t, { flag: '#2f63c9', hull: '#f0ece2', stripe: '#2f63c9', sail: '#ffffff', flip: -1 });
  applyCam(ctx, cam, 1);
  drawDock(ctx, 1600, -500, 1600);
  const wave = Math.sin(t * 6) * .25;
  drawStick(ctx, C(KOBY, { x: 540, y: 1580, s: 600, arms: { L: [2.3 + wave, .3], R: [.25, -.05] }, face: { eyes: 'wide', mouth: 'frown', browAng: -.35, browUp: 1, look: [.6, -.2], pupil: .3 }, headTilt: .06 }));
  tears(ctx, 540, 1580 - .765 * 600 + 15, 86, t, ON(lt, .3, .3));
  gull(ctx, 300 + lt * 60, 700, 1, t);
} });
// 24 — CTA: "qual o Dia 3?"
SHOTS.push({ start: 52.5, end: 57.2, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx);
  const g = ctx.createRadialGradient(540, 800, 100, 540, 900, 1400); g.addColorStop(0, '#ffe58a'); g.addColorStop(1, '#f08a2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 900); ctx.rotate(t * .12); for (let i = 0; i < 16; i++) { ctx.rotate(TAU / 16); path(ctx, [[-70, 0], [70, 0], [0, -1700]]); ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill(); } ctx.restore();
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.06], [4.7, 1.0]]), r: 0 };
  applyCam(ctx, cam, 1);
  // title
  const ts = P(lt, 0, .3);
  ctx.save(); ctx.translate(540, 330); ctx.scale(ts, ts); ctx.rotate(-.03); text(ctx, 'QUAL O', 0, -70, 96, '#ffffff', INK, 18, 'Poppins', 700); text(ctx, 'DIA 3?', 0, 70, 190, '#ffe14d', INK, 24, 'Poppins', 700); ctx.restore();
  // most liked comment
  const cs = P(lt, .25, .3);
  if (cs > 0) { ctx.save(); ctx.translate(540, 730); ctx.scale(cs, cs);
    commentBubble(ctx, 0, 0, 820, 210);
    circle(ctx, -320, -10, 56); fillStroke(ctx, '#7a4bc4', 7); circle(ctx, -320, -22, 22); ctx.fillStyle = '#f6f2ea'; ctx.fill();
    rrect(ctx, -240, -50, 380, 30, 15); ctx.fillStyle = '#d9d2dc'; ctx.fill(); rrect(ctx, -240, 5, 280, 30, 15); ctx.fill();
    const hp = 1 + .18 * Math.max(0, Math.sin(t * 7));
    ctx.save(); ctx.translate(300, -10); ctx.scale(hp, hp); heart(ctx, 0, 0, 50); ctx.restore();
    ctx.restore(); }
  for (let i = 0; i < 9; i++) { const k = lt - .6 - i * .3; if (k > 0 && k < 1.0) { ctx.save(); ctx.globalAlpha = 1 - k; heart(ctx, 840 + Math.sin(k * 4 + i) * 50, 680 - k * 200, 30 - k * 10, '#ff3b5c'); ctx.restore(); } }
  // follow button
  const fb = P(lt, 2.6, .3), tap = lt > 3.35;
  if (fb > 0) { ctx.save(); ctx.translate(470, 1060); const press = lt > 3.25 && lt < 3.45 ? .92 : 1; ctx.scale(fb * press, fb * press);
    rrect(ctx, -230, -70, 460, 140, 70); fillStroke(ctx, tap ? '#3a3440' : '#e0392f', 9);
    text(ctx, tap ? 'SEGUINDO' : 'SEGUIR', tap ? 20 : 30, 6, 62, '#fff', null, 0, 'Poppins', 700);
    if (tap) check(ctx, -160, 0, 26, '#ffffff'); else { line(ctx, -170, 0, -110, 0, 14, '#fff'); line(ctx, -140, -30, -140, 30, 14, '#fff'); }
    ctx.restore();
    // hand cursor taps
    const hx = kf(lt, [[2.8, 760], [3.25, 520]]), hy = kf(lt, [[2.8, 1240], [3.25, 1090]]);
    if (lt > 2.8 && lt < 4.0) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.4); rrect(ctx, -22, -70, 44, 110, 22); fillStroke(ctx, '#f6f2ea', 7); rrect(ctx, -45, 10, 90, 90, 30); fillStroke(ctx, '#f6f2ea', 7); ctx.restore(); }
  }
  drawStick(ctx, C(LUFFY, { x: 880, y: 1560, s: 470, arms: { L: [.4, -.2], R: lt > 2.6 ? [2.2, -.9] : [2.6 + Math.sin(t * 10) * .25, .2] }, face: { eyes: 'happy', mouth: 'grin' }, headTilt: Math.sin(t * 4) * .05 }));
} });
