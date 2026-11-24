// ---------- "Dia 1 de 10: fuga da prisão" shot list (times in voiceover seconds) ----------
const C = (base, extra) => Object.assign({}, base, extra);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const IDLE = { L: [.3, -.1], R: [.3, -.1] };
const hit = (lt, at, len = .25) => lt > at ? Math.max(0, 1 - (lt - at) / len) : 0;
function flash(ctx, a, col = '255,255,255') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(${col},${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function popText(ctx, str, x, y, size, lt, at, fill = '#ffe14d', rot = 0, out = 9) {
  const k = lt - at; if (k < 0 || k > out) return; const sc = backOut(clamp(k / .18)) * (1 - clamp((k - out + .2) / .2));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); text(ctx, str, 0, 0, size, fill, INK, size * .16); ctx.restore();
}
function impact(ctx, x, y, r, lt, at, word, seed = 7) {
  const k = lt - at; if (k < 0 || k > .55) return; const sc = backOut(clamp(k / .12)) * (1 - clamp((k - .35) / .2));
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); burst(ctx, 0, 0, r, 12, '#ffd23a', seed); burst(ctx, 0, 0, r * .55, 10, '#fff6c4', seed + 2);
  if (word) text(ctx, word, 0, 0, r * .42, RED, INK, r * .07); ctx.restore();
}
function exclaim(ctx, x, y, s, lt, at) {
  const k = lt - at; if (k < 0) return; const sc = backOut(clamp(k / .2)) * (1 + Math.sin(k * 9) * .04);
  ctx.save(); ctx.translate(x, y - Math.sin(k * 4) * 8); ctx.scale(sc * s, sc * s);
  circle(ctx, 0, 0, 62); fillStroke(ctx, RED, 8); text(ctx, '!', 0, 4, 90, '#fff', INK, 0); ctx.restore();
}
function cellCorridorBG(ctx, cam, t, o = {}) {
  applyCam(ctx, cam, .6); drawBlockWall(ctx, -400, 1500, o.wall || CONCRETE);
  applyCam(ctx, cam, 1); drawFloor(ctx, o.floorY || 1500, o.floor || '#5f6878');
}
const hud = (ctx, t, extra = {}) => drawHUD(ctx, Object.assign({ day: 1, alert: 0, t }, extra));

const SHOTS = [];
// 0 — POV: the cell gate slams shut ("Dia 1 de 10 tentando fugir...")
SHOTS.push({ start: 0, end: 2.1, tr: 'whip', draw(ctx, lt, t) {
  const slam = .32, sh = hit(lt, slam, .4);
  const k = shake(t * 3, 34 * sh, 3); const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + k[0], y: 960 + hh[1] + k[1], z: 1.02 + lt * .03, r: sh * .02 };
  cellCorridorBG(ctx, cam, t, { floorY: 1380 });
  applyCam(ctx, cam, .6);
  for (const dx of [120, 960]) { rrect(ctx, dx - 150, 560, 300, 820, 10); fillStroke(ctx, '#596273', 8); drawBars(ctx, dx - 120, dx + 120, 580, 1370, 60, { bw: 16, cross: [700] }); }
  drawCellPlate(ctx, 120, 470, '401', .7); drawCellPlate(ctx, 960, 470, '403', .7);
  drawBulb(ctx, 540, -200, 520, t, .05);
  applyCam(ctx, cam, 1);
  // guard walking away, twirling keys, smug look back
  const gx = kf(lt, [[0, 470], [2.1, 720]], x => x);
  drawStick(ctx, C(GUARD, { x: gx, y: 1450, s: 560, legs: walkLegs(lt, 7, .35), arms: { L: [.3 - Math.sin(lt * 7) * .3, -.2], R: [1.9 + Math.sin(lt * 14) * .2, -1.4] }, face: { eyes: lt > .5 ? 'half' : 'normal', mouth: 'smirk', look: [-.8, 0], turn: -.6 } }));
  // keys
  { const kx = gx + 110 + Math.cos(lt * 14) * 30, ky = 1450 - 560 * .78 + Math.sin(lt * 14) * 30; circle(ctx, kx, ky, 22); ctx.lineWidth = 7; ctx.strokeStyle = '#e8c04a'; ctx.stroke(); line(ctx, kx, ky + 20, kx + 10, ky + 70, 9, '#e8c04a'); }
  // POV darkness at edges (we are inside)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(10,10,20,.75)'); g.addColorStop(.25, 'rgba(10,10,20,0)'); g.addColorStop(.75, 'rgba(10,10,20,0)'); g.addColorStop(1, 'rgba(10,10,20,.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  // the gate slides in from the right and slams
  const gxo = kf(lt, [[0, 1150], [slam, 0, easeIn], [slam + .12, -30, easeOut], [slam + .3, 0]]);
  const fcam = { x: 540 + k[0] * 1.4 - gxo, y: 960 + k[1] * 1.4, z: 1, r: 0 };
  applyCam(ctx, fcam, 1);
  drawBars(ctx, 40, 1040, -200, 2200, 200, { bw: 58, cross: [260, 1640], col: '#5d6879', crossCol: '#434b5a', lock: [980, 1000] });
  applyCam(ctx, cam, 1);
  impact(ctx, 860, 760, 300, lt, slam, 'CLANG!', 3);
  flash(ctx, hit(lt, slam, .18) * .55);
  hud(ctx, t, { a: kf(lt, [[.45, 0], [.75, 1, backOut]]) });
} });
// 1 — exterior: maximum security prison at dusk
SHOTS.push({ start: 2.1, end: 3.72, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 980 + hh[1], z: 1.0 + lt * .07, r: 0 };
  applyCam(ctx, cam, .05); drawSky(ctx, '#232a66', '#f6a05a', -200, 1250);
  const R = rng(4); for (let i = 0; i < 40; i++) { circle(ctx, R() * 1300 - 100, R() * 600, 2 + R() * 3); ctx.fillStyle = `rgba(255,255,255,${.4 + .4 * Math.sin(t * 3 + i)})`; ctx.fill(); }
  applyCam(ctx, cam, .12); circle(ctx, 820, 340, 70); ctx.fillStyle = '#fff6d8'; ctx.fill();
  applyCam(ctx, cam, .3); ctx.fillStyle = '#3b3e6e'; path(ctx, [[-400, 1250], [100, 980], [420, 1120], [760, 940], [1500, 1250]]); ctx.fill();
  applyCam(ctx, cam, 1);
  drawPrisonBuilding(ctx, t, 1);
  ctx.fillStyle = '#2c2a3e'; ctx.fillRect(-600, 1360, 2400, 1400); line(ctx, -600, 1360, 1800, 1360, 8);
  // road to the gate
  path(ctx, [[470, 1360], [610, 1360], [900, 2400], [180, 2400]]); ctx.fillStyle = '#3a384e'; ctx.fill();
  for (let i = 0; i < 6; i++) { const y = 1400 + i * 160 + (lt * 200) % 160; rrect(ctx, 535, y, 10, 60, 4); ctx.fillStyle = '#e8c04a'; ctx.fill(); }
  hud(ctx, t);
} });
// 2 — the calendar: day 10 circled ("Se eu não escapar até o décimo dia")
SHOTS.push({ start: 3.72, end: 5.8, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + kf(lt, [[1.0, 0], [2.0, 160]]), y: 900 + hh[1] + kf(lt, [[1.0, 0], [2.0, 120]]), z: kf(lt, [[0, 1.0], [1.0, 1.04], [2.0, 1.28]]), r: Math.sin(t * .6) * .01 };
  applyCam(ctx, cam, 1); drawBlockWall(ctx, -800, 2600, '#a4adbd');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(540, 700, 50, 540, 700, 900); lg.addColorStop(0, 'rgba(255,230,170,.28)'); lg.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = lg; ctx.fillRect(-400, -200, 1900, 2000); ctx.restore();
  const sway = Math.sin(t * 2) * .01;
  ctx.save(); ctx.translate(540, 860); ctx.rotate(sway); ctx.translate(-540, -860);
  // day 1 highlighted as today, days 2..10 flash in a sweep
  drawCalendar(ctx, 540, 860, 760, 0, kf(lt, [[1.28, 0], [1.85, 1]]), t);
  const cw = 760 * .82 / 5, ch = 760 * .36;
  for (let i = 0; i < 10; i++) {
    const cx = 540 - 760 * .41 + (i % 5 + .5) * cw, cy = 860 - 760 * .12 + Math.floor(i / 5) * ch * 1.05 + ch * .3;
    const a = i === 0 ? .55 : Math.max(0, 1 - Math.abs(lt - (.15 + i * .11)) * 6) * .5;
    if (a > 0) { rrect(ctx, cx - cw * .44, cy - ch * .42, cw * .88, ch * .84, 10); ctx.fillStyle = `rgba(255,210,58,${a})`; ctx.fill(); }
    if (i === 0) text(ctx, 'HOJE', cx, cy + ch * .25, 26, INK, INK, 0);
  }
  // tape
  for (const sx of [-1, 1]) { ctx.save(); ctx.translate(540 + sx * 330, 860 - 470); ctx.rotate(sx * .5); rrect(ctx, -60, -18, 120, 36, 4); ctx.fillStyle = 'rgba(240,230,190,.85)'; ctx.fill(); ctx.restore(); }
  ctx.restore();
  // marker pen following the circle
  const ca = kf(lt, [[1.28, 0], [1.85, 1]]);
  if (ca > 0 && ca < 1) {
    const cx = 540 - 760 * .41 + 4.5 * cw, cy = 860 - 760 * .12 + ch * 1.05 + ch * .3; const a = -Math.PI / 2 + TAU * ca;
    const px = cx + Math.cos(a) * cw * .62, py = cy + Math.sin(a) * ch * .6;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-.7); rrect(ctx, -14, -230, 28, 220, 10); fillStroke(ctx, RED, 6); path(ctx, [[-14, -10], [14, -10], [0, 14]]); fillStroke(ctx, '#f6f2ea', 5); ctx.restore();
  }
  hud(ctx, t);
} });
// 3 — the solitary cell door slams ("vou pra solitária definitiva")
SHOTS.push({ start: 5.8, end: 7.62, tr: 'cut', draw(ctx, lt, t) {
  const shut = .62, sh = hit(lt, shut, .45);
  const k = shake(t * 3, 26 * sh, 3); const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + k[0], y: 1000 + hh[1] + k[1], z: kf(lt, [[0, 1.0], [1.8, 1.16]]), r: 0 };
  applyCam(ctx, cam, 1);
  drawBlockWall(ctx, -800, 1500, '#5b6274'); drawFloor(ctx, 1500, '#3e4350');
  // door in the back wall
  const open = kf(lt, [[0, 1], [shut, 0, easeIn]]);
  const dx0 = 640, dw = 300, dy0 = 760, dh = 740;
  rrect(ctx, dx0 - 20, dy0 - 20, dw + 40, dh + 20, 8); fillStroke(ctx, '#3a404e', 8);
  ctx.fillStyle = '#fff4c8'; ctx.fillRect(dx0, dy0, dw, dh);
  if (open > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; path(ctx, [[dx0, 1500], [dx0 + dw * open, 1500], [dx0 + dw * open + 400 * open, 2400], [dx0 - 300, 2400]]); ctx.fillStyle = `rgba(255,236,170,${.3 * open})`; ctx.fill(); ctx.restore(); }
  const pw = dw * (1 - open);
  rrect(ctx, dx0, dy0, Math.max(pw, 4), dh, 4); fillStroke(ctx, '#7c8596', 8);
  if (pw > 120) { rrect(ctx, dx0 + pw / 2 - 70, dy0 + 160, 140, 40, 6); fillStroke(ctx, '#1b1f2a', 6); for (let i = 0; i < 4; i++) { circle(ctx, dx0 + 30, dy0 + 60 + i * 200, 9); ctx.fillStyle = '#4a5262'; ctx.fill(); circle(ctx, dx0 + pw - 30, dy0 + 60 + i * 200, 9); ctx.fill(); } }
  const dark = kf(lt, [[shut, 0], [shut + .2, .45]]);
  drawBulb(ctx, 360, -200, 760, t + sh * 3, .08 + sh * .3, 1);
  // hero: turns to the door, then slumps
  const slump = kf(lt, [[shut + .3, 0], [shut + .9, 1]]);
  drawStick(ctx, C(HERO, { x: 330, y: 1620, s: 720, lean: slump * .06, headTilt: -.05 - slump * .12,
    arms: slump > 0 ? { L: [lerp(.3, .12, slump), -.1], R: [lerp(.3, .12, slump), -.1] } : (lt > shut ? POSE.handsUp.arms : { L: [.5, -.6], R: [.9, -1.2] }),
    face: lt < shut ? { eyes: 'wide', mouth: 'o', look: [1, 0], browUp: 1, turn: .5 } : lt < shut + .3 ? { eyes: 'wide', mouth: 'teeth', browAng: -.35, browUp: 1 } : { eyes: 'half', mouth: 'frown', browAng: -.3, look: [0, .6] } }));
  if (lt > shut + .4) { sweat(ctx, 330 + 170, 1620 - 720 * .86 + (lt - shut - .4) * 40, 36, clamp((lt - shut - .4) * 3)); }
  impact(ctx, 790, 1000, 260, lt, shut, 'BAM!', 9);
  darkness(ctx, dark, '#05060c');
  flash(ctx, hit(lt, shut, .15) * .4);
  hud(ctx, t);
} });
// 4 — cameras turning, armed guards ("O nível de alerta hoje...")
SHOTS.push({ start: 7.62, end: 9.2, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] - lt * 30, y: 1000 + hh[1], z: 1.05 + lt * .05, r: 0 };
  cellCorridorBG(ctx, cam, t, { wall: '#8d97a8', floorY: 1460 });
  applyCam(ctx, cam, .6);
  for (const dx of [-80, 320, 720, 1120]) { rrect(ctx, dx - 130, 700, 260, 700, 8); fillStroke(ctx, '#596273', 8); drawBars(ctx, dx - 100, dx + 100, 720, 1395, 50, { bw: 14, cross: [820] }); }
  // red stripe on the wall
  ctx.fillStyle = '#c4473a'; ctx.fillRect(-800, 640, 2700, 30);
  applyCam(ctx, cam, 1);
  drawCamera(ctx, 150, 560, 1.0, .55 + Math.sin(t * 1.6) * .45, t, { cone: 1, coneLen: 1000 });
  drawCamera(ctx, 930, 560, 1.0, Math.PI - .55 - Math.sin(t * 1.6 + 1.5) * .45, t, { cone: 1, coneLen: 1000 });
  // two guards marching in step with rifles
  for (const [x0, ph] of [[180, 0], [560, .5]]) {
    const x = x0 + lt * 160;
    drawStick(ctx, C(GUARD, { x, y: 1600, s: 560, legs: walkLegs(lt + ph * 0, 8, .4), arms: { L: [.3 - Math.sin(lt * 8) * .3, -.2], R: [.9, -1.6] }, prop: rifle, bob: -Math.abs(Math.sin(lt * 8)) * .01, face: { eyes: 'normal', mouth: 'flat', browAng: .35, look: [.7, 0] } }));
  }
  const fz = Math.max(0, 1 - Math.abs(lt - .9) * 2.2);
  hud(ctx, t);
  if (fz > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rrect(ctx, 510, 238, 490, 124, 62); ctx.lineWidth = 10; ctx.strokeStyle = `rgba(255,225,77,${fz})`; ctx.stroke(); ctx.restore(); }
} });
// 5 — explainer: the alert gauge ("...em zero, mas cada escolha errada faz esse alerta subir e trava ainda mais a prisão")
SHOTS.push({ start: 9.2, end: 14.0, tr: 'whip', draw(ctx, lt, t) {
  const X1 = 1.1, X2 = 2.0, UP = 2.88, LOCK = 3.36;
  const v = kf(lt, [[0, 0], [X1, 0], [X1 + .25, .25, backOut], [X2, .25], [X2 + .25, .48, backOut], [UP, .48], [UP + .45, .82, backOut]]) + (lt > UP + .45 ? Math.sin(t * 30) * .006 : 0);
  const siren = kf(lt, [[UP, 0], [UP + .3, 1]]);
  const sh = hit(lt, LOCK, .35) + hit(lt, LOCK + .45, .3) + hit(lt, LOCK + .9, .3);
  const k = shake(t * 3, 22 * sh, 3); const hh = handheld(t, 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(540, 900, 50, 540, 900, 1300); g.addColorStop(0, mix('#2b3f86', '#7a1d22', siren)); g.addColorStop(1, mix('#0d1330', '#2a0608', siren)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // rotating light rays
  ctx.save(); ctx.translate(540, 980); ctx.rotate(t * .25); for (let i = 0; i < 14; i++) { ctx.rotate(TAU / 14); path(ctx, [[-50, 300], [50, 300], [0, 1500]]); ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fill(); } ctx.restore();
  const cam = { x: 540 + hh[0] + k[0], y: 960 + hh[1] + k[1], z: kf(lt, [[0, 1.15], [.5, 1.0, easeOut], [4.8, 1.05]]), r: 0 };
  applyCam(ctx, cam, 1);
  const gin = kf(lt, [[0, .6], [.3, 1, backOut]]);
  ctx.save(); ctx.translate(540, 960); ctx.scale(gin, gin); ctx.translate(-540, -960);
  drawGauge(ctx, 540, 960, 330, clamp(v), t);
  text(ctx, 'NÍVEL DE ALERTA', 540, 1100, 58, '#fff', INK, 12);
  ctx.restore();
  // wrong choices pop as red X cards and push the needle
  for (const [at, x, rot] of [[X1 - .1, 300, -.12], [X2 - .1, 780, .1]]) {
    const kk = lt - at; if (kk < 0) continue; const sc = backOut(clamp(kk / .2));
    ctx.save(); ctx.translate(x, 430); ctx.rotate(rot); ctx.scale(sc, sc);
    rrect(ctx, -120, -100, 240, 200, 26); fillStroke(ctx, '#f6f2ea', 10);
    line(ctx, -55, -55, 55, 55, 30, RED); line(ctx, 55, -55, -55, 55, 30, RED);
    ctx.restore();
    if (kk < .5) { ctx.save(); ctx.globalAlpha = 1 - kk * 2; text(ctx, '+', x + 150, 300 - kk * 100, 110, RED, INK, 14); ctx.restore(); }
  }
  // siren lamps
  if (siren > 0) for (const sx of [130, 950]) { const on = Math.sin(t * 14 + sx) > 0; ctx.save(); ctx.translate(sx, 640); ctx.scale(siren, siren); rrect(ctx, -70, 0, 140, 40, 10); fillStroke(ctx, '#3a404e', 8); ctx.beginPath(); ctx.arc(0, 0, 60, Math.PI, 0); fillStroke(ctx, on ? '#ff4a3a' : '#9a1d18', 8); if (on) { ctx.globalCompositeOperation = 'lighter'; circle(ctx, 0, -20, 180); ctx.fillStyle = 'rgba(255,60,40,.25)'; ctx.fill(); } ctx.restore(); }
  // the prison locks down: bars drop in, padlocks slam
  const drop = kf(lt, [[LOCK - .15, -2300], [LOCK, 0, easeIn], [LOCK + .1, -40, easeOut], [LOCK + .25, 0]]);
  if (lt > LOCK - .15) { ctx.save(); ctx.translate(0, drop); drawBars(ctx, 40, 1040, -200, 2200, 250, { bw: 44, cross: [180, 1620], col: '#5d6879', crossCol: '#434b5a' }); ctx.restore(); }
  for (const [at, x, y] of [[LOCK + .05, 290, 1620], [LOCK + .5, 790, 1620], [LOCK + .95, 540, 180]]) {
    const kk = lt - at; if (kk < 0) continue; const yy = y - (1 - easeIn(clamp(kk / .14))) * 500;
    drawPadlock(ctx, x, yy, .9, clamp((kk - .14) / .1));
    if (kk > .14 && kk < .5) { ctx.save(); ctx.globalAlpha = 1 - (kk - .14) * 2.5; burst(ctx, x, yy - 20, 170, 10, '#ffd23a', 5 + x); ctx.restore(); drawPadlock(ctx, x, yy, .9, 1); }
  }
  sirenGlow(ctx, siren * .8, t);
  flash(ctx, hit(lt, LOCK, .15) * .35);
} });
// 6 — arriving at cell 402
SHOTS.push({ start: 14.0, end: 16.75, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const push = kf(lt, [[1.3, 0], [1.8, 1, easeOut], [2.75, 1.1]]);
  const cam = { x: 540 + hh[0], y: 1000 + hh[1] - push * 300, z: 1.0 + push * .32, r: 0 };
  applyCam(ctx, cam, 1);
  drawBlockWall(ctx, -800, 1560, '#9aa3b4'); drawFloor(ctx, 1560, '#626b7b');
  // cell front, the door slid open
  rrect(ctx, 210, 560, 660, 1000, 8); fillStroke(ctx, '#4c5363', 10);
  ctx.save(); rrect(ctx, 220, 570, 640, 990, 4); ctx.clip();
  drawBlockWall(ctx, 570, 1560, '#7c869a', 220, 860, 130, 70); ctx.fillStyle = '#4e5564'; ctx.fillRect(220, 1400, 640, 200);
  drawBarredWindow(ctx, 540, 720, 170, 110, t, 1); drawBunk(ctx, 680, 1430, .75); drawToilet(ctx, 330, 1430, .7);
  ctx.restore();
  drawBars(ctx, 230, 410, 580, 1550, 60, { bw: 20, cross: [700, 1450] });
  drawBars(ctx, 690, 850, 580, 1550, 53, { bw: 20, cross: [700, 1450] });
  const pb = 1 + .2 * Math.max(0, 1 - Math.abs(lt - 1.55) * 5);
  drawCellPlate(ctx, 540, 470, '402', pb);
  if (lt > 1.5) { const a = clamp((lt - 1.5) * 4) * clamp((2.4 - lt) * 3); sparkle(ctx, 680, 400, 60 * a, a); sparkle(ctx, 400, 520, 40 * a, a); }
  // hero walks in from the left, escorted by a guard
  const hx = kf(lt, [[0, -160], [1.2, 470]], x => x); const walking = lt < 1.2;
  drawStick(ctx, C(GUARD, { x: hx - 330, y: 1640, s: 600, legs: walking ? walkLegs(lt, 8, .4) : IDLE, arms: { L: [.3, -.1], R: [1.3, -.6] }, prop: baton, face: { eyes: 'half', mouth: 'flat', browAng: .3, look: [1, 0] } }));
  drawStick(ctx, C(HERO, { x: hx, y: 1650, s: 600, legs: walking ? walkLegs(lt, 8, .45) : IDLE, arms: walking ? walkArms(lt, 8, .4) : IDLE,
    face: lt < 1.3 ? { eyes: 'normal', mouth: 'flat', look: [1, -.2] } : { eyes: 'normal', mouth: 'o', look: [0, -1], browUp: 1 }, headTilt: lt > 1.3 ? -.1 : 0 }));
  hud(ctx, t);
} });
// 7 — only the uniform and a plastic spoon
SHOTS.push({ start: 16.75, end: 19.85, tr: 'cut', draw(ctx, lt, t) {
  const UNI = 1.05, SPOON = 1.85;
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [SPOON, 1.04], [SPOON + .3, 1.14, easeOut], [3.1, 1.18]]), r: 0 };
  applyCam(ctx, cam, .5); drawBlockWall(ctx, -800, 2600, '#8f99ab'); drawBarredWindow(ctx, 860, 520, 220, 150, t, .8);
  applyCam(ctx, cam, .8); drawBunk(ctx, 200, 1500, 1.1);
  applyCam(ctx, cam, 1);
  const shrug = kf(lt, [[0, 0], [.25, 1, backOut], [UNI - .1, 1], [UNI + .15, 0]]);
  const chest = kf(lt, [[UNI - .1, 0], [UNI + .15, 1], [SPOON - .2, 1], [SPOON, 0]]);
  const raise = kf(lt, [[SPOON - .15, 0], [SPOON + .2, 1, backOut]]);
  const s = 1300;
  let arms;
  if (raise > 0) arms = { L: [.35, -.15], R: { ik: [lerp(.3, .3, raise), lerp(-.4, -.8, raise)], bend: -1 } };
  else if (chest > 0) arms = { L: { ik: [lerp(-.35, -.05, chest), lerp(-.35, -.5, chest)], bend: 1 }, R: { ik: [lerp(.35, .05, chest), lerp(-.35, -.5, chest)], bend: -1 } };
  else arms = { L: [lerp(.3, 1.3, shrug), lerp(-.1, -1.4, shrug)], R: [lerp(.3, 1.3, shrug), lerp(-.1, -1.4, shrug)] };
  const spoon = raise > 0 ? (c, k, h, a, side) => { if (k === 'R') { c.save(); c.translate(h[0], h[1]); c.rotate(-.15); drawSpoon(c, 0, -.09, .0011, 0); c.restore(); } } : null;
  drawStick(ctx, C(HERO, { x: 540, y: 1960, s, arms, prop: spoon, shadow: false, headTilt: shrug * .06 - raise * .05,
    face: raise > 0 ? { eyes: 'half', mouth: 'flat', browOne: 1, look: [0, 0] } : chest > 0 ? { eyes: 'normal', mouth: 'smirk', look: [0, 1] } : { eyes: 'normal', mouth: 'flat', browUp: 1, browAng: -.2 } }));
  if (chest > .5) { const a = clamp((lt - UNI) * 4) * clamp((SPOON - .1 - lt) * 4); sparkle(ctx, 640, 1260, 50 * a, a); sparkle(ctx, 420, 1340, 36 * a, a); }
  if (raise > 0) { const a = clamp((lt - SPOON - .1) * 4) * clamp((3.0 - lt) * 4); sparkle(ctx, 540 + .3 * s + 30, 1960 - .9 * s - 220, 70 * a, a); }
  // cricket beat: a tiny "..." over the head
  if (lt > SPOON + .5) { const a = clamp((lt - SPOON - .5) * 4); ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 3; i++) { circle(ctx, 760 + i * 46, 560 - Math.max(0, Math.sin(t * 6 - i)) * 12, 14); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); } ctx.restore(); }
  hud(ctx, t);
} });
// 8 — the clock is running
SHOTS.push({ start: 19.85, end: 20.92, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 4);
  const cam = { x: 540 + hh[0], y: 900 + hh[1], z: 1.0 + lt * .16, r: Math.sin(t * 9) * .006 };
  applyCam(ctx, cam, 1); drawBlockWall(ctx, -800, 2600, '#a4adbd');
  ctx.save(); ctx.translate(540, 860); ctx.rotate(Math.sin(t * 40) * .02);
  drawWallClock(ctx, 0, 0, 330, lt * 2.2 + .2, 1); ctx.restore();
  speedLines(ctx, 540, 860, .5, t, 18);
  for (const [x, y, d] of [[170, 560, 0], [900, 700, .3]]) sweat(ctx, x, y + ((lt + d) % 1) * 60, 40, clamp((lt - d) * 4));
  text(ctx, 'TIC TAC', 540, 1120 + Math.sin(t * 20) * 4, 80, '#ffe14d', INK, 14);
  hud(ctx, t);
} });
// 9 — first yard time, two openings
SHOTS.push({ start: 20.92, end: 23.95, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + kf(lt, [[0, -60], [3, 40]]), y: 980 + hh[1], z: kf(lt, [[0, 1.08], [3, 1.0]]), r: 0 };
  drawYardBG(ctx, t, cam, { towerX: 540, ground: 1050 });
  applyCam(ctx, cam, 1);
  // fence on the left, shadowed corner on the right
  drawChainFence(ctx, -300, 420, 760, 1130, t);
  ctx.save(); path(ctx, [[760, 640], [1400, 640], [1400, 1400], [900, 1400]]); ctx.fillStyle = 'rgba(20,20,45,.55)'; ctx.fill(); ctx.restore();
  // other inmates working out
  drawStick(ctx, C(INMATE, { x: 590, y: 1180, s: 300, arms: { L: [2.7 + Math.sin(t * 5) * .2, .2], R: [2.7 + Math.sin(t * 5) * .2, .2] }, face: { eyes: 'squint', mouth: 'teeth' }, prop: (c, k, h) => { if (k === 'R') { line(c, -.25, h[1] - .01, .25, h[1] - .01, .02, '#3a404e'); for (const sx of [-.25, .25]) { circle(c, sx, h[1] - .01, .06); fillStroke(c, '#2c2f38', .01); } } } }));
  drawStick(ctx, C(GUARD, { x: 220, y: 1230, s: 340, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'normal', mouth: 'flat', look: [1, 0] }, blush: true }));
  drawStick(ctx, C(VET, { x: 940, y: 1240, s: 360, sil: '#2a2840', eyesGlow: true, face: { eyes: 'normal', look: [-1, 0] } }));
  // hero walks out into the sun and shields his eyes
  const hx = kf(lt, [[0, 300], [1.3, 520]]); const walking = lt < 1.3; const shade = kf(lt, [[1.0, 0], [1.3, 1]]);
  drawStick(ctx, C(HERO, { x: hx, y: 1550, s: 600, legs: walking ? walkLegs(lt, 8, .45) : IDLE,
    arms: shade > 0 ? { L: [.35, -.15], R: { ik: [lerp(.3, .03, shade), lerp(-.5, -.9, shade)], bend: -1 } } : walkArms(lt, 8, .4), armLen: 1.12,
    face: lt < 1.0 ? { eyes: 'normal', mouth: 'smile', look: [0, -.5] } : lt < 2.1 ? { eyes: 'squint', mouth: 'teeth', browAng: .3 } : { eyes: 'normal', mouth: 'o', look: [lt < 2.35 ? -1 : 1, 0], browUp: 1 }, headTilt: lt > 1.1 && lt < 2.1 ? -.1 : 0 }));
  caribbeanHeat(ctx, .35);
  exclaim(ctx, 220, 800, 1, lt, 2.2); exclaim(ctx, 940, 800, 1, lt, 2.44);
  hud(ctx, t);
} });
// 10 — the rookie guard drops his access card by the fence
SHOTS.push({ start: 23.95, end: 28.0, tr: 'whip', draw(ctx, lt, t) {
  const DROP = 1.3, LAND = 1.95, FOCUS = 2.2;
  const hh = handheld(t, 3);
  const cardX = kf(lt, [[DROP, 700], [LAND, 430]], x => x), cardY = lt < LAND ? kf(lt, [[DROP, 1290], [LAND, 1560, easeIn]]) : 1560 - Math.abs(Math.sin((lt - LAND) * 9)) * 60 * Math.exp(-(lt - LAND) * 6);
  const cardR = lt < LAND ? (lt - DROP) * 9 : .15 + Math.sin((lt - LAND) * 12) * .2 * Math.exp(-(lt - LAND) * 5);
  const focus = kf(lt, [[FOCUS - .1, 0], [FOCUS + .35, 1, easeOut]]);
  const cam = { x: lerp(540, 470, focus) + hh[0], y: lerp(1000, 1380, focus) + hh[1], z: lerp(1.0, 1.75, focus) + lt * .01, r: 0 };
  drawYardBG(ctx, t, cam, { towerX: 900, ground: 1050 });
  applyCam(ctx, cam, 1);
  drawChainFence(ctx, -300, 1400, 700, 1300, t);
  ctx.fillStyle = '#d9c49a'; ctx.fillRect(-800, 1300, 2700, 1400); line(ctx, -800, 1300, 1900, 1300, 6);
  // rookie: oversized cap, whistling, looking away
  const leave = kf(lt, [[2.6, 0], [4.0, 1]]);
  const gx = 760 + leave * 300;
  const card = lt < DROP ? (ctx) => { ctx.save(); ctx.translate(.12, -.33); ctx.rotate(.2 + Math.sin(t * 6) * .1); rrect(ctx, -.03, 0, .06, .085, .008); fillStroke(ctx, '#f6f8fb', .008); ctx.fillStyle = '#2f63c9'; ctx.fillRect(-.03, .0, .06, .025); ctx.restore(); badge(ctx); } : badge;
  drawStick(ctx, C(GUARD, { x: gx, y: 1620, s: 700, body: card, blush: true, legs: leave > 0 ? walkLegs(lt, 8, .35) : IDLE,
    arms: { L: [.3, -.1], R: [.95, -2.2] }, face: { eyes: 'happy', mouth: 'o', look: [1, -.5] }, headTilt: .08 + Math.sin(t * 3) * .04 }));
  // whistle notes
  if (lt < 2.5) for (let i = 0; i < 2; i++) { const p = ((lt * .8 + i * .5) % 1); ctx.save(); ctx.globalAlpha = 1 - p; text(ctx, '♪', gx + 100 + p * 120, 1620 - 700 * .85 - p * 160, 70, '#fff', INK, 10); ctx.restore(); }
  // the card
  if (lt >= DROP) {
    if (lt > LAND) { ellipse(ctx, cardX, 1580, 90, 16); ctx.fillStyle = 'rgba(60,40,20,.25)'; ctx.fill(); }
    drawKeycard(ctx, cardX, cardY, .9, cardR);
    if (focus > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cardX, cardY, 20, cardX, cardY, 260); g.addColorStop(0, `rgba(255,240,150,${.45 * focus})`); g.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = g; ctx.fillRect(cardX - 300, cardY - 300, 600, 600); ctx.restore();
      const a = focus * (.6 + .4 * Math.sin(t * 8)); sparkle(ctx, cardX + 100, cardY - 70, 40 * a, a); sparkle(ctx, cardX - 90, cardY - 40, 28 * a, a); }
  }
  if (lt > LAND && lt < LAND + .4) puff(ctx, cardX, 1570, 60 * (1 + (lt - LAND) * 2), t, '#efe3cf', 4, 1 - (lt - LAND) * 2.5);
  hud(ctx, t);
} });
// 11 — the veteran calls me to the cameras' blind spot
SHOTS.push({ start: 28.0, end: 32.75, tr: 'whip', draw(ctx, lt, t) {
  const VET_T = 1.85, CALL = 2.6, BLIND = 3.25;
  const hh = handheld(t, 3);
  const close = kf(lt, [[VET_T - .2, 0], [VET_T + .3, 1, easeOut], [BLIND - .15, 1], [BLIND + .3, 0, easeOut]]);
  const cam = { x: lerp(540, 780, close) + hh[0], y: lerp(980, 900, close) + hh[1], z: lerp(1.0, 1.55, close), r: 0 };
  applyCam(ctx, cam, .4); drawSky(ctx, '#3ea6ee', '#d4f0fb', -400, 1000);
  applyCam(ctx, cam, 1);
  drawBlockWall(ctx, 300, 1450, '#a8b0c0', -800, 1880, 200, 100);
  ctx.fillStyle = '#d9c49a'; ctx.fillRect(-800, 1450, 2700, 1400); line(ctx, -800, 1450, 1900, 1450, 8);
  // the corner pillar + its shade
  rrect(ctx, 940, 200, 220, 1400, 0); fillStroke(ctx, '#8a93a6', 8);
  path(ctx, [[640, 300], [940, 300], [940, 1700], [560, 1700]]); ctx.fillStyle = 'rgba(20,20,48,.6)'; ctx.fill();
  // camera sweeping, never reaching the corner
  const ang = 2.45 + Math.sin(t * 1.4) * .3;
  drawCamera(ctx, 930, 540, 1.1, ang, t, { cone: 1, coneLen: 1700, coneSpread: .22 });
  // veteran in the shade, steps forward and beckons
  const step = kf(lt, [[VET_T - .1, 0], [VET_T + .3, 1, backOut]]);
  const beck = lt > CALL ? Math.sin((lt - CALL) * 10) : 0;
  drawStick(ctx, C(VET, { x: lerp(840, 790, step), y: 1600, s: 720, flip: -1, sil: step < .5 ? '#1e1c30' : undefined, eyesGlow: step < .5,
    arms: lt > CALL ? { L: [.3, -.1], R: { ik: [.36, -.62 + beck * .03], bend: -1 } } : IDLE, prop: lt > CALL ? (c, k, h) => { if (k === 'R') { c.save(); c.translate(h[0], h[1]); c.rotate(-.6 + beck * .5); rrect(c, -.01, -.07, .02, .07, .01); c.fillStyle = INK; c.fill(); c.restore(); } } : null,
    face: { eyes: step < .5 ? 'normal' : 'half', mouth: lt > CALL ? 'smirk' : 'flat', look: [1, 0], browOne: lt > CALL ? 1 : 0 }, shadow: false }));
  if (lt > CALL) popText(ctx, 'psiu!', 650, 760, 90, lt, CALL, '#fff', -.12, BLIND - CALL);
  // blind spot outline
  const bl = kf(lt, [[BLIND, 0], [BLIND + .3, 1]]);
  if (bl > 0) { ctx.save(); ctx.globalAlpha = bl; ctx.setLineDash([34, 22]); ctx.lineDashOffset = -t * 60; path(ctx, [[660, 480], [930, 480], [930, 1660], [580, 1660]]); ctx.lineWidth = 12; ctx.strokeStyle = '#ffe14d'; ctx.stroke(); ctx.restore(); drawBoxedText(ctx, 'PONTO CEGO', 700, 590, 54 * bl, '#151821', '#ffe14d', 26, -.04); }
  // hero looks back over his shoulder
  if (close < .5) drawStick(ctx, C(HERO, { x: 250, y: 1560, s: 520, arms: IDLE, face: lt > VET_T ? { eyes: 'wide', mouth: 'o', look: [1, 0], browUp: 1, turn: .5 } : { eyes: 'normal', mouth: 'flat', look: [-1, 0] } }));
  hud(ctx, t);
} });
// 12 — freeze: which way? ("Qual é o meu primeiro passo? Você decide...")
SHOTS.push({ start: 32.75, end: 36.8, tr: 'whip', draw(ctx, lt, t) {
  const Q = 1.05, YOU = 1.65;
  const hh = handheld(t, 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#2f63c9'; ctx.fillRect(0, 0, 540, H); ctx.fillStyle = '#2a2840'; ctx.fillRect(540, 0, 540, H);
  ctx.save(); ctx.globalAlpha = .12; for (let i = 0; i < 14; i++) { ctx.fillStyle = '#fff'; path(ctx, [[540, 960], [540 + Math.cos(i / 14 * TAU + t * .2) * 2000, 960 + Math.sin(i / 14 * TAU + t * .2) * 2000], [540 + Math.cos((i + .5) / 14 * TAU + t * .2) * 2000, 960 + Math.sin((i + .5) / 14 * TAU + t * .2) * 2000]]); ctx.fill(); } ctx.restore();
  line(ctx, 540, 0, 540, H, 12);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [4, 1.06]]), r: 0 };
  applyCam(ctx, cam, 1);
  // left inset: keycard; right inset: veteran
  const look = kf(lt, [[0, [-1, 0]], [.45, [-1, 0]], [.65, [1, 0]], [1.0, [1, 0]], [1.15, [0, -.4]]]);
  const li = 1 + .1 * Math.max(0, look[0] < -.5 ? 1 : 0), ri = 1 + .1 * Math.max(0, look[0] > .5 ? 1 : 0);
  ctx.save(); ctx.translate(270, 520); ctx.scale(li, li); circle(ctx, 0, 0, 190); fillStroke(ctx, '#e8f1ff', 10); drawKeycard(ctx, 0, 0, 1.5, -.15 + Math.sin(t * 3) * .05); ctx.restore();
  ctx.save(); ctx.translate(810, 520); ctx.scale(ri, ri); circle(ctx, 0, 0, 190); fillStroke(ctx, '#3e3b5c', 10); ctx.save(); circle(ctx, 0, 0, 185); ctx.clip(); drawStick(ctx, C(VET, { x: 0, y: 470, s: 560, shadow: false, face: { eyes: 'half', mouth: 'smirk', browOne: 1, look: [-1, 0] } })); ctx.restore(); circle(ctx, 0, 0, 190); fillStroke(ctx, null, 10); ctx.restore();
  // hero in the middle
  const point = kf(lt, [[YOU - .1, 0], [YOU + .15, 1, backOut]]);
  drawStick(ctx, C(HERO, { x: 540, y: 1800, s: 1050, shadow: false,
    arms: point > 0 ? { L: [.3, -.1], R: { ik: [lerp(.3, .18, point), lerp(-.4, -.52, point)], bend: -1 } } : { L: { ik: [-.05, -.62], bend: 1 }, R: [.3, -.1] },
    face: point > 0 ? { eyes: 'normal', mouth: 'grin', browOne: 1, look: [0, 0] } : { eyes: 'normal', mouth: 'flat', look, browAng: -.2, browUp: .5 } }));
  if (point > 0) { ctx.save(); ctx.translate(540 + .18 * 1050 + 30, 1800 - .52 * 1050); const p = 1 + .08 * Math.sin(t * 10); ctx.scale(p, p); circle(ctx, 0, 0, 40); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); ctx.restore(); }
  popText(ctx, '?', 300, 900, 200, lt, Q, '#ffe14d', -.2); popText(ctx, '?', 790, 860, 150, lt, Q + .12, '#ffe14d', .2);
  // comment bubble for "você decide"
  if (lt > YOU + .3) { const sc = backOut(clamp((lt - YOU - .3) / .2)); ctx.save(); ctx.translate(540, 250); ctx.scale(sc, sc); drawBubble(ctx, 0, 0, 380, 140, '#fff'); for (let i = 0; i < 3; i++) { circle(ctx, -70 + i * 70, -Math.max(0, Math.sin(t * 7 - i)) * 14, 20); ctx.fillStyle = INK; ctx.fill(); } ctx.restore(); }
} });
// choice screen (two boxes), shared by shots 13 and 14
function choiceScreen(ctx, t, lt, sel, appear) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hh = handheld(t, 2);
  if (!window.CHOICE_BG) {
    // the frozen, blurred yard is static: draw it once
    const raw = document.createElement('canvas'); raw.width = W + 80; raw.height = H + 80; const rc = raw.getContext('2d');
    const cam = { x: 540, y: 980, z: 1.12, r: 0 };
    rc.translate(40, 40); const tr = rc.setTransform.bind(rc); rc.setTransform = (a, b, c, d, e, f) => tr(a, b, c, d, e + 40, f + 40);
    drawYardBG(rc, 0, cam, { towerX: 540, ground: 1050 }); applyCam(rc, cam, 1); drawChainFence(rc, -300, 420, 760, 1130, 0);
    const bl = document.createElement('canvas'); bl.width = W + 80; bl.height = H + 80; const bc = bl.getContext('2d');
    bc.filter = 'grayscale(.75) blur(6px) brightness(.55)'; bc.drawImage(raw, 0, 0); window.CHOICE_BG = bl;
  }
  ctx.drawImage(window.CHOICE_BG, -40 + hh[0], -40 + hh[1]);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(10,12,24,.35)'; ctx.fillRect(0, 0, W, H);
  // pause badge
  ctx.save(); ctx.translate(540, 300); rrect(ctx, -230, -55, 460, 110, 55); fillStroke(ctx, '#151821', 8, '#000'); rrect(ctx, -190, -24, 16, 48, 4); ctx.fillStyle = '#fff'; ctx.fill(); rrect(ctx, -162, -24, 16, 48, 4); ctx.fill(); text(ctx, 'VOCÊ DECIDE', 40, 2, 50, '#fff', INK, 0); ctx.restore();
  const boxes = [
    { y: 500, n: '1', l1: 'PEGAR O', l2: 'CARTÃO', risk: 'RISCO ALTO', rc: RED, col: '#2f63c9' },
    { y: 890, n: '2', l1: 'FALAR COM', l2: 'O VETERANO', risk: 'RISCO ?', rc: '#f2b52a', col: '#6c43c0' },
  ];
  boxes.forEach((b, i) => {
    const ap = appear[i]; if (ap <= 0) return;
    const on = sel === i ? 1 : 0, dim = sel >= 0 && sel !== i ? .5 : 1;
    const sc = backOut(clamp(ap)) * (1 + on * .04 + on * Math.sin(t * 5) * .008);
    ctx.save(); ctx.translate(540, b.y + 170); ctx.scale(sc, sc); ctx.globalAlpha = dim;
    rrect(ctx, -460, -170, 920, 340, 40); fillStroke(ctx, '#fbf8f0', 10);
    if (on) { rrect(ctx, -476, -186, 952, 372, 50); ctx.lineWidth = 14; ctx.strokeStyle = '#ffe14d'; ctx.stroke(); }
    // icon well
    rrect(ctx, -430, -140, 280, 280, 30); fillStroke(ctx, b.col, 8);
    ctx.save(); rrect(ctx, -430, -140, 280, 280, 30); ctx.clip();
    if (i === 0) {
      // sneaky hand reaching for the card
      const r = Math.sin(t * 3) * .5 + .5; drawKeycard(ctx, -290, 40, 1.1, -.1);
      { const hx = -360 + r * 40, hy = -20 + r * 30; ctx.beginPath(); ctx.moveTo(-470, -200); ctx.quadraticCurveTo(-430, -60, hx, hy); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); circle(ctx, hx, hy, 18); ctx.fillStyle = INK; ctx.fill(); }
    } else {
      ctx.save(); ctx.translate(-290, 0);
      drawStick(ctx, C(VET, { x: -55, y: 330, s: 420, shadow: false, face: { eyes: 'half', mouth: 'o', look: [1, 0] } }));
      drawStick(ctx, C(HERO, { x: 75, y: 340, s: 380, flip: -1, shadow: false, face: { eyes: 'wide', mouth: 'o', look: [1, 0], browUp: 1 } }));
      ctx.restore();
      for (let k = 0; k < 3; k++) { circle(ctx, -330 + k * 30, -100 - Math.max(0, Math.sin(t * 7 - k)) * 8, 9); ctx.fillStyle = '#fff'; ctx.fill(); }
    }
    ctx.restore();
    rrect(ctx, -430, -140, 280, 280, 30); fillStroke(ctx, null, 8);
    // number badge
    circle(ctx, -430, -140, 52); fillStroke(ctx, '#ffe14d', 8); text(ctx, b.n, -430, -136, 62, INK, INK, 0);
    text(ctx, b.l1, 150, -70, 64, INK, INK, 0, 'Poppins', 700); text(ctx, b.l2, 150, 10, 64, INK, INK, 0, 'Poppins', 700);
    ctx.save(); ctx.translate(150, 100); ctx.font = '700 38px Poppins'; const w = ctx.measureText(b.risk).width + 50; rrect(ctx, -w / 2, -30, w, 60, 30); fillStroke(ctx, b.rc, 6); text(ctx, b.risk, 0, 2, 38, '#fff', INK, 0); ctx.restore();
    ctx.restore();
  });
}
// 13 — option 1
SHOTS.push({ start: 36.8, end: 40.95, tr: 'cut', draw(ctx, lt, t) {
  choiceScreen(ctx, t, lt, lt > .45 ? 0 : -1, [clamp(lt / .3), clamp((lt - .2) / .3)]);
  // "antes que ele perceba": a guard eye opening in the corner
  const eye = kf(lt, [[3.0, 0], [3.3, 1, backOut]]);
  if (eye > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.save(); ctx.translate(920, 520); ctx.scale(eye, eye); ellipse(ctx, 0, 0, 70, 44); fillStroke(ctx, '#fff', 8); circle(ctx, Math.sin(t * 6) * 18, 0, 22); ctx.fillStyle = INK; ctx.fill(); ctx.restore(); exclaim(ctx, 1000, 440, .6, lt, 3.3); }
} });
// 14 — option 2
SHOTS.push({ start: 40.95, end: 46.0, tr: 'whip', draw(ctx, lt, t) {
  choiceScreen(ctx, t, lt, lt > .1 ? 1 : 0, [1, 1]);
  // "os podres da prisão": secrets spilling out
  if (lt > 3.9) { for (let i = 0; i < 4; i++) { const p = clamp((lt - 3.9 - i * .12) / .6); if (p <= 0) continue; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.save(); ctx.globalAlpha = 1 - clamp((p - .7) / .3); ctx.translate(250 + i * 40 + p * (i - 1.5) * 160, 1000 - p * 420); ctx.rotate((i - 1.5) * .3); rrect(ctx, -50, -36, 100, 72, 8); fillStroke(ctx, '#fbf8f0', 6); for (let l = 0; l < 3; l++) line(ctx, -32, -16 + l * 16, 32 - l * 10, -16 + l * 16, 5, '#9aa3b4'); ctx.restore(); } }
} });
// 15 — the most liked comment decides day 2
SHOTS.push({ start: 46.0, end: 48.9, tr: 'whip', draw(ctx, lt, t) {
  const WIN = .8, STAMP = 2.2;
  const hh = handheld(t, 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b3f86'); g.addColorStop(1, '#151a3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.08], [.4, 1.0, easeOut], [2.9, 1.04]]), r: 0 };
  applyCam(ctx, cam, 1);
  const cards = [{ y: 600, who: '#f2771f', l: 'PEGA O CARTÃO!!', n0: 140, n1: 2800 }, { y: 940, who: '#6c43c0', l: 'VAI NO VETERANO', n0: 90, n1: 1900 }];
  cards.forEach((c, i) => {
    const ap = backOut(clamp((lt - i * .15) / .3)); if (ap <= 0) return;
    const win = i === 0 ? kf(lt, [[WIN, 0], [WIN + .3, 1, backOut]]) : 0;
    ctx.save(); ctx.translate(540, c.y); ctx.scale(ap * (1 + win * .06), ap * (1 + win * .06));
    rrect(ctx, -440, -120, 880, 240, 36); fillStroke(ctx, '#fbf8f0', 10);
    if (win > 0) { rrect(ctx, -456, -136, 912, 272, 46); ctx.lineWidth = 12; ctx.strokeStyle = `rgba(255,225,77,${win})`; ctx.stroke(); }
    circle(ctx, -350, -20, 60); fillStroke(ctx, c.who, 7); circle(ctx, -350, -42, 22); ctx.fillStyle = HEAD; ctx.fill();
    ctx.textAlign = 'left'; ctx.font = '700 42px Poppins'; ctx.fillStyle = INK; ctx.fillText(c.l, -260, -40);
    rrect(ctx, -260, 10, 380, 22, 11); ctx.fillStyle = '#d8dde6'; ctx.fill(); rrect(ctx, -260, 50, 240, 22, 11); ctx.fill();
    const n = Math.round(lerp(c.n0, c.n1, easeOut(clamp((lt - .2) / 2.0))));
    const hp = 1 + .2 * Math.max(0, Math.sin(lt * 14 + i)) * (lt < 2.2 ? 1 : 0);
    drawHeart(ctx, 330, -30, hp * (i === 0 ? 1.15 : 1), RED);
    text(ctx, n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + ' mil' : String(n), 330, 50, 36, INK, INK, 0);
    ctx.restore();
    if (win > 0) { ctx.save(); ctx.translate(540 - 330, c.y - 140); ctx.rotate(-.2); ctx.scale(win, win); path(ctx, [[-60, 30], [-70, -40], [-30, -5], [0, -55], [30, -5], [70, -40], [60, 30]]); fillStroke(ctx, '#ffd23a', 8); ctx.restore(); }
  });
  // floating hearts
  for (let i = 0; i < 5; i++) { const p = ((lt * .7 + i / 5) % 1); const x = 870 + Math.sin(i * 3 + lt * 3) * 40; ctx.save(); ctx.globalAlpha = (1 - p) * clamp(lt * 3); drawHeart(ctx, x, 440 - p * 200, .45 + (i % 3) * .1, RED); ctx.restore(); }
  // stamp: DIA 2
  const sk = lt - STAMP; if (sk > 0) { const sc = lerp(2.2, 1, easeIn(clamp(sk / .14))); ctx.save(); ctx.translate(540, 1150); ctx.rotate(-.1); ctx.scale(sc, sc); ctx.globalAlpha = clamp(sk / .08); rrect(ctx, -230, -70, 460, 140, 20); ctx.lineWidth = 14; ctx.strokeStyle = RED; ctx.stroke(); text(ctx, 'DIA 2', 0, 4, 100, RED, INK, 0); ctx.restore(); }
  flash(ctx, hit(lt, STAMP + .14, .15) * .3);
} });
// 16 — CTA: ALERTA 0% -> ? + follow
SHOTS.push({ start: 48.9, end: 51.6, tr: 'cut', draw(ctx, lt, t) {
  const TAP = .45;
  const hh = handheld(t, 3);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#151821'; ctx.fillRect(0, 0, W, H);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .04, r: 0 };
  applyCam(ctx, cam, .6); drawBlockWall(ctx, -800, 2600, '#4e5668');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(540, 1000, 50, 540, 1000, 800); lg.addColorStop(0, 'rgba(255,220,150,.25)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = lg; ctx.fillRect(-300, 0, 1700, 2000); ctx.restore();
  applyCam(ctx, cam, 1);
  // hero peeking between the bars, grinning, fists on the bars
  const HS = 1500, HY = 1950;
  drawStick(ctx, C(HERO, { x: 540, y: HY, s: HS, shadow: false, arms: { L: { ik: [-.2, -.66], bend: 1 }, R: { ik: [.2, -.66], bend: -1 } }, face: { eyes: 'normal', mouth: 'grin', browOne: 1, look: [Math.sin(t * 2) * .5, 0] }, headTilt: Math.sin(t * 2) * .05 }));
  drawBars(ctx, -360, 1440, -200, 2300, 600, { bw: 56, cross: [1720], col: '#5d6879', crossCol: '#434b5a' });
  for (const sx of [-1, 1]) { rrect(ctx, 540 + sx * 300 - 50, HY - .66 * HS - 40, 100, 80, 34); fillStroke(ctx, HEAD, 8); }
  // big text
  const ta = backOut(clamp(lt / .25));
  ctx.save(); ctx.translate(540, 370); ctx.rotate(-.04); ctx.scale(ta, ta); rrect(ctx, -440, -110, 880, 220, 40); fillStroke(ctx, '#151821', 10, '#000');
  const q = Math.sin(t * 8) * .5 + .5;
  text(ctx, 'ALERTA: 0% → ?', 0, 4, 92, '#fff', INK, 0); ctx.restore();
  // follow button
  const tapped = lt > TAP + .12;
  const bs = kf(lt, [[.15, 0], [.4, 1, backOut]]) * (1 - .1 * hit(lt, TAP + .1, .2));
  ctx.save(); ctx.translate(540, 1185); ctx.scale(bs, bs); rrect(ctx, -250, -70, 500, 140, 70); fillStroke(ctx, tapped ? '#3a404e' : RED, 10, '#000'); text(ctx, tapped ? 'SEGUINDO ✓' : '+ SEGUIR', 0, 4, 64, '#fff', INK, 0); ctx.restore();
  // finger tap
  const fp = kf(lt, [[.2, 0], [TAP, 1, easeOut], [TAP + .2, .85], [TAP + .7, 0]]);
  if (fp > 0) { ctx.save(); ctx.translate(lerp(920, 650, fp), lerp(1600, 1225, fp)); ctx.rotate(-.5); rrect(ctx, -34, -20, 68, 220, 34); fillStroke(ctx, HEAD, 8); ctx.restore(); }
  if (tapped) { const a = clamp(1 - (lt - TAP - .12) * 2); ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 10; i++) { const ang = i / 10 * TAU; const r = 280 + (1 - a) * 180; star5(ctx, 540 + Math.cos(ang) * r, 1185 + Math.sin(ang) * r * .35, 22, t, '#ffe14d'); } ctx.restore(); }
} });
