// Charles do Bronx — shot list. Times come from the voice (WORDS / LINES in words.js).
const SHOTS = [];
const C = (base, extra) => Object.assign({}, base, extra);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const norm = w => w.replace(/[^\wÀ-ÿ-]/g, '');
function wf(li, w, nth = 0) { const m = WORDS.filter(x => x.line === li && norm(x.w) === w); return (m[nth] || m[0] || { s: LINES[li] }).s; }
const L = i => i < LINES.length ? LINES[i] : WORDS[WORDS.length - 1].e + .7;
const END = WORDS[WORDS.length - 1].e + .7;
function S(start, end, tr, draw) { SHOTS.push({ start, end, tr, draw }); }
const hh = (t, a = 4) => handheld(t, a);
const blink = t => (t % 3.1) < .1 ? 1 : 0;
// tiny legs/arms helpers
const stand = { L: [.12, -.05], R: [.12, -.05] };
const guard = { L: { ik: [-.02, -.72], bend: -1 }, R: { ik: [.08, -.68], bend: -1 } };
const raise = { L: [2.75, .2], R: [2.75, .2] };

// 0 — hook: kid in a hospital bed, the doctor shakes his head, a wheelchair waits
S(0, L(1), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .05 };
  applyCam(ctx, cam, .3); drawRoomWall(ctx, '#bfe3d6', '#a7d2c4', 1260);
  drawWindow(ctx, 640, 330, 300, 280, 0, t);
  applyCam(ctx, cam, 1);
  drawMonitor(ctx, 300, 640, 1, t, 1.6);
  drawBed(ctx, 420, 1200, 1);
  drawStick(ctx, C(KID, { x: 560, y: 1112, s: 420, lean: -1.5, shadow: false, legs: { L: [0, 0], R: [0, 0] }, arms: { L: [.2, 0], R: [.2, 0] }, face: { eyes: 'normal', look: [.6, -.4], mouth: 'frown', browAng: -.3, blink: blink(t) } }));
  drawBlanket(ctx, 420, 1200, 1);
  const shakeH = Math.sin(lt * 9) * .12 * clamp((lt - .3) * 3) * (1 - clamp((lt - 2.2) * 2));
  drawStick(ctx, C(DOC, { x: 820, y: 1230, s: 560, flip: -1, headTilt: shakeH, arms: { L: [.3, -.1], R: { ik: [.18, -.45], bend: -1 } }, prop: (c, k, hd, a, sd) => { if (k === 'R') clipboard(c, hd, sd); }, face: { eyes: 'normal', mouth: 'frown', browAng: -.25, look: [.5, .3] } }));
  const wx = kf(lt, [[1.9, -300], [2.6, 150, easeOut]]);
  drawWheelchair(ctx, wx, 1720, .75);
});
// 1 — years later: the grown man lifts the belt in the cage
S(L(1), L(2), 'whip', (ctx, lt, t) => {
  const h = hh(t, 5); const cam = { x: 540 + h[0], y: 980 + h[1], z: 1.05 + lt * .05, r: Math.sin(t) * .01 };
  drawArena(ctx, t, cam, { cheer: 1, flashes: 1 });
  applyCam(ctx, cam, 1);
  const up = kf(lt, [[.4, 0], [1.0, 1, backOut]]);
  const bx = 540, by = lerp(1050, 330, up);
  drawStick(ctx, C(CHARLES, { x: 540, y: 1260, s: 820, arms: { L: { ik: [-.2, lerp(-.5, -1.12, up)], bend: 1 }, R: { ik: [.2, lerp(-.5, -1.12, up)], bend: -1 } }, armLen: 1.2, face: { eyes: up > .5 ? 'squint' : 'normal', mouth: 'grin', browAng: .2 }, headTilt: -.05 * up }));
  drawBelt(ctx, bx, by, .8, Math.sin(t * 3) * .04, up);
  confetti(ctx, lt, .9);
  if (lt > .9 && lt < 1.2) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,255,255,${.6 * (1 - (lt - .9) / .3)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
});
// 2 — name card: walking out into the spotlight
S(L(2), L(3), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .08 };
  drawArena(ctx, t, cam, { cheer: .6, flashes: .5 });
  applyCam(ctx, cam, 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, 900, 50, 540, 900, 520); g.addColorStop(0, 'rgba(255,240,200,.35)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(0, 300, 1080, 1200); ctx.restore();
  drawStick(ctx, C(CHARLES, { x: 540, y: 1240 + Math.abs(Math.sin(lt * 6)) * -10, s: lerp(560, 680, lt / 2.5), legs: walkLegs(lt, 6, .35), arms: walkArms(lt, 6, .35), face: { eyes: 'normal', mouth: 'smirk', browAng: .3 } }));
  const k = clamp((lt - .2) / .3);
  ctx.save(); ctx.translate(540, 330); ctx.scale(.8 + .2 * backOut(k), .8 + .2 * backOut(k)); ctx.globalAlpha = k;
  text(ctx, 'CHARLES', 0, 0, 120, '#ffe14d', INK, 20, 'Poppins', 700); text(ctx, 'CHARLES', 0, 0, 120, '#ffe14d', INK, 0, 'Poppins', 700);
  text(ctx, 'DO BRONX', 0, 120, 96, '#fff', INK, 18, 'Poppins', 700); text(ctx, 'DO BRONX', 0, 120, 96, '#fff', INK, 0, 'Poppins', 700);
  ctx.restore();
});
// 3 — 1989, Guarujá: sea, beach and the hill
S(L(3), wf(3, 'Charles'), 'cut', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 500 + h[0] + lt * 20, y: 960 + h[1], z: 1 + lt * .04 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#3ea6ee', '#c9ecfb');
  applyCam(ctx, cam, .1); drawSun(ctx, 860, 300, 80, t, 1);
  applyCam(ctx, cam, .15); drawCloud(ctx, 200 + t * 6, 330, 100, 1); drawCloud(ctx, 760 + t * 4, 520, 70, 2);
  applyCam(ctx, cam, .35); drawFavela(ctx, 1020, t, { rows: 4, seed: 3 });
  applyCam(ctx, cam, .6); drawSea(ctx, 1080, t);
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#f3dfa6'; ctx.beginPath(); ctx.moveTo(-600, 1560); ctx.quadraticCurveTo(540, 1440, 1700, 1560); ctx.lineTo(1700, 2600); ctx.lineTo(-600, 2600); ctx.closePath(); fillStroke(ctx, '#f3dfa6', 6);
  bigPop(ctx, '1989', 540, 470, 210, lt, .25);
  const sk = clamp((lt - 1.2) / .3); if (sk > 0) { ctx.save(); ctx.translate(540, 720); ctx.scale(backOut(sk), backOut(sk)); banner(ctx, 0, 0, 560, 110, 'GUARUJÁ · SP', '#16884a', 60); ctx.restore(); }
});
// 3b — growing up in the favela: kid running down the alley
S(wf(3, 'Charles'), L(4), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 1000 + h[1] - lt * 30, z: 1.05 + lt * .03 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#55b6f0', '#d8f0fb');
  applyCam(ctx, cam, .4); drawFavela(ctx, 1150, t, { rows: 7, seed: 8 });
  applyCam(ctx, cam, 1); drawStreet(ctx, 1240, '#d3c7b2');
  const x = kf(lt, [[0, 160], [3, 900]], x => x);
  drawStick(ctx, C(KID, { x, y: 1230, s: 420, legs: walkLegs(lt, 13, .6), arms: walkArms(lt, 13, .7), bob: -Math.abs(Math.sin(lt * 13)) * .02, face: { eyes: 'happy', mouth: 'grin' } }));
  // a football rolling with him
  circle(ctx, x + 120, 1205, 26); fillStroke(ctx, '#fff', 5); circle(ctx, x + 120, 1205, 9); ctx.fillStyle = INK; ctx.fill();
});
// 4 — humble family: selling cheese and salgados in the street
S(L(4), L(5), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .05 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#55b6f0', '#d8f0fb');
  applyCam(ctx, cam, .35); drawFavela(ctx, 1120, t, { rows: 3, seed: 21 });
  applyCam(ctx, cam, 1); drawStreet(ctx, 1240, '#d3c7b2');
  // the small family house
  rrect(ctx, 600, 760, 400, 480, 6); fillStroke(ctx, '#f6e7c8', 6); rrect(ctx, 640, 880, 110, 360, 4); fillStroke(ctx, '#7a4a2c', 5); rrect(ctx, 800, 860, 140, 120, 4); fillStroke(ctx, '#2c3550', 5);
  ctx.save(); rrect(ctx, 600, 760, 400, 480, 6); ctx.clip(); ctx.fillStyle = 'rgba(40,10,30,.14)'; ctx.fillRect(880, 700, 200, 600); ctx.restore();
  rrect(ctx, 580, 740, 440, 30, 4); fillStroke(ctx, '#b9b2a8', 5);
  const x = kf(lt, [[0, 120], [1.6, 380]]);
  const walking = lt < 1.6;
  drawStick(ctx, C(KID, { x, y: 1230, s: 460, legs: walking ? walkLegs(lt, 9, .45) : stand, arms: { L: { ik: [-.2, -.4], bend: -1 }, R: { ik: [.2, -.4], bend: 1 } }, face: { eyes: 'normal', mouth: lt > 1.6 ? 'o' : 'smile', look: [.6, 0] } }));
  drawTray(ctx, x, 1230 - .4 * 460 - 8, 1.05, Math.sin(lt * 6) * .04);
  if (lt > 1.8) { const k = clamp((lt - 1.8) / .2); ctx.save(); ctx.translate(250, 520); ctx.scale(backOut(k), backOut(k)); bubble(ctx, 0, 0, 300, 120, '', 0, [.8, 1]); path(ctx, [[-90, 20], [-40, -40], [-20, 20]]); fillStroke(ctx, '#ffd84a', 5); ctx.beginPath(); ctx.moveTo(50, -40); ctx.quadraticCurveTo(80, 10, 70, 20); ctx.lineTo(30, 20); ctx.quadraticCurveTo(20, 10, 50, -40); fillStroke(ctx, '#d9822b', 5); ctx.restore(); }
  // coins hopping home
  for (let i = 0; i < 3; i++) { const k = lt - 2.8 - i * .35; if (k > 0 && k < 1) { const cx = lerp(x + 60, 700, k), cy = lerp(900, 980, k) - Math.sin(k * Math.PI) * 220; circle(ctx, cx, cy, 26); fillStroke(ctx, '#f2c12e', 5); text(ctx, '$', cx, cy + 2, 30, INK, null, 0); } }
});
// 5 — the blow: the kid collapses, clutching his chest
S(L(5), wf(5, 'aos'), 'cut', (ctx, lt, t) => {
  const h = hh(t, 4); const sh = lt > .55 && lt < .9 ? shake(t, 18) : [0, 0];
  const cam = { x: 540 + h[0] + sh[0], y: 960 + h[1] + sh[1], z: 1.1 + lt * .06 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#55b6f0', '#d8f0fb');
  applyCam(ctx, cam, .35); drawFavela(ctx, 1120, t, { rows: 3, seed: 21 });
  applyCam(ctx, cam, 1); drawStreet(ctx, 1240, '#d3c7b2');
  const fall = kf(lt, [[.3, 0], [.6, 1, easeIn]]);
  drawStick(ctx, C(KID, { x: 540, y: 1230, s: 520, lean: fall * -1.3, squash: 1, legs: fall > .9 ? { L: [1.2, -.4], R: [1.0, -.3] } : stand, arms: { L: { ik: [-.02, -.55], bend: -1 }, R: { ik: [.04, -.52], bend: 1 } }, face: { eyes: fall > .5 ? 'x' : 'wide', mouth: 'teeth', browAng: -.4 } }));
  if (lt > .6) { const k = lt - .6; if (k < .5) { ctx.save(); ctx.translate(380, 900); ctx.scale(backOut(clamp(k / .12)) * (1 - clamp((k - .35) / .15)), backOut(clamp(k / .12)) * (1 - clamp((k - .35) / .15))); burst(ctx, 0, 0, 200, 12, '#ffd23a', 7); ctx.restore(); } }
  drawHeart(ctx, 540 + 120, 600 - Math.sin(lt * 18) * 8, 70 + Math.sin(lt * 18) * 6, '#e8514a');
  ctx.save(); ctx.translate(540 + 120, 600); ctx.rotate(.3); line(ctx, -70, -10, -20, 10, 8); line(ctx, -20, 10, 10, -20, 8); line(ctx, 10, -20, 60, 15, 8); ctx.restore();
});
// 5b — the diagnosis: rheumatic fever and a heart murmur
S(wf(5, 'aos'), L(6), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .04 };
  applyCam(ctx, cam, .3); drawRoomWall(ctx, '#d4ecf4', '#b8dbe8', 1260);
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(DOC, { x: 250, y: 1240, s: 600, arms: { L: [.3, -.1], R: { ik: [.42, -.78], bend: -1 } }, face: { eyes: 'normal', mouth: 'flat', look: [.8, -.2] } }));
  // chart with a beating heart
  rrect(ctx, 430, 430, 560, 600, 20); fillStroke(ctx, '#fff', 8);
  const beat = 1 + .1 * Math.max(0, Math.sin(lt * 9)) ** 6;
  drawHeart(ctx, 710, 640, 130 * beat, '#e8514a');
  // the murmur: wavy sound lines
  for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let k = 0; k <= 20; k++) { const x = 860 + k * 5, y = 560 + i * 60 + Math.sin(k * .9 - lt * 10) * 10; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(232,81,74,.8)'; ctx.stroke(); }
  const k1 = clamp((wf(5, 'febre') - wf(5, 'aos') - lt) * -3), k2 = clamp((wf(5, 'sopro') - wf(5, 'aos') - lt) * -3);
  if (k1 > 0) { ctx.save(); ctx.translate(710, 870); ctx.scale(backOut(k1), backOut(k1)); banner(ctx, 0, 0, 480, 80, 'FEBRE REUMÁTICA', '#e8514a', 42); ctx.restore(); }
  if (k2 > 0) { ctx.save(); ctx.translate(710, 965); ctx.scale(backOut(k2), backOut(k2)); banner(ctx, 0, 0, 480, 80, 'SOPRO NO CORAÇÃO', '#2f63c9', 42); ctx.restore(); }
});
// 6 — almost two years of treatment: days and nights pass by the window
S(L(6), L(7), 'cut', (ctx, lt, t) => {
  const h = hh(t, 2); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1.05 - lt * .03 };
  const night = (Math.sin(lt * 5) + 1) / 2;
  applyCam(ctx, cam, .3); drawRoomWall(ctx, mix('#bfe3d6', '#4a5a78', night * .6), mix('#a7d2c4', '#3a4a66', night * .6), 1260);
  drawWindow(ctx, 600, 300, 340, 300, night, t);
  applyCam(ctx, cam, 1);
  drawIV(ctx, 140, 1240, 1);
  drawBed(ctx, 560, 1240, 1);
  drawStick(ctx, C(KID, { x: 700, y: 1152, s: 420, lean: -1.5, shadow: false, legs: { L: [0, 0], R: [0, 0] }, arms: { L: [.2, 0], R: [.2, 0] }, face: { eyes: night > .6 ? 'happy' : 'half', mouth: 'flat' } }));
  drawBlanket(ctx, 560, 1240, 1);
  // calendar flipping + counter
  const flips = Math.floor(lt * 6);
  rrect(ctx, 170, 330, 300, 280, 16); fillStroke(ctx, '#fff', 7); rrect(ctx, 170, 330, 300, 70, [16, 16, 0, 0]); fillStroke(ctx, '#e8514a', 7);
  text(ctx, String(1 + flips % 30), 320, 510, 120, INK, null, 0);
  const fp = (lt * 6) % 1; ctx.save(); ctx.globalAlpha = 1 - fp; ctx.translate(320, 400); ctx.rotate(-fp * 1.2); ctx.translate(-150, 0); rrect(ctx, 0, 0, 300, 210, 10); fillStroke(ctx, '#fafafa', 5); ctx.restore();
  bigPop(ctx, '2 ANOS', 760, 760, 120, lt, .6, '#ffe14d', .05);
});
// 7 — the doctor's order: no sports
S(L(7), L(8), 'cut', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1.1 + lt * .06 };
  applyCam(ctx, cam, .3); drawRoomWall(ctx, '#d4ecf4', '#b8dbe8', 1260);
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(DOC, { x: 780, y: 1250, s: 620, flip: -1, arms: { L: { ik: [-.45, -.85], bend: 1 }, R: { ik: [.45, -.85], bend: -1 } }, face: { eyes: 'normal', mouth: 'flat', browAng: -.3 } }));
  // the sign he holds: ball + gi, crossed out
  const sx = 420, sy = 640;
  rrect(ctx, sx - 240, sy - 210, 480, 420, 24); fillStroke(ctx, '#fff', 8);
  circle(ctx, sx - 90, sy, 80); fillStroke(ctx, '#fff', 7); ctx.save(); circle(ctx, sx - 90, sy, 80); ctx.clip(); for (const [a, b] of [[0, 0], [-60, -50], [60, -40], [-50, 60], [55, 55]]) { circle(ctx, sx - 90 + a, sy + b, 26); ctx.fillStyle = INK; ctx.fill(); } ctx.restore();
  ctx.beginPath(); ctx.moveTo(sx + 30, sy - 80); ctx.lineTo(sx + 150, sy - 80); ctx.lineTo(sx + 170, sy + 90); ctx.lineTo(sx + 10, sy + 90); ctx.closePath(); fillStroke(ctx, '#fdfdfb', 7); ctx.fillStyle = INK; ctx.fillRect(sx + 15, sy + 10, 150, 22);
  const k = clamp((lt - (wf(7, 'nada') - L(7))) / .2);
  if (k > 0) { ctx.save(); ctx.translate(sx, sy); ctx.scale(lerp(1.6, 1, easeOut(k)), lerp(1.6, 1, easeOut(k))); ctx.globalAlpha = k; circle(ctx, 0, 0, 190); ctx.lineWidth = 30; ctx.strokeStyle = '#e0392f'; ctx.stroke(); line(ctx, -134, 134, 134, -134, 30, '#e0392f'); ctx.restore(); }
});
// 8 — but he ignored it: rips the paper in two
S(L(8), L(9), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 940 + h[1], z: 1.15 + lt * .05 };
  applyCam(ctx, cam, .3); drawRoomWall(ctx, '#d4ecf4', '#b8dbe8', 1260);
  applyCam(ctx, cam, 1);
  const rip = kf(lt, [[.5, 0], [.8, 1, backOut]]);
  drawStick(ctx, C(KID, { x: 540, y: 1240, s: 620, arms: { L: { ik: [-.12 - rip * .25, -.62 + rip * .05], bend: -1 }, R: { ik: [.12 + rip * .25, -.62 + rip * .05], bend: 1 } }, face: { eyes: rip > .5 ? 'normal' : 'smug', mouth: 'smirk', browAng: .35, browOne: 1 } }));
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(540 + sd * (40 + rip * 150), 1240 - .62 * 620 - 40); ctx.rotate(sd * rip * .5); rrect(ctx, sd > 0 ? 0 : -110, -80, 110, 160, 6); fillStroke(ctx, '#fff', 6); ctx.restore(); }
  if (rip > .3 && lt < 1.3) { for (let i = 0; i < 4; i++) sparkle(ctx, 540 + Math.cos(i * 1.6) * 120, 840 + Math.sin(i * 1.6) * 90, 30, 1 - clamp((lt - .8) * 2)); }
});
// 9 — 12 years old: free jiu-jitsu in a social project
S(L(9), wf(9, 'virou'), 'cut', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .03 };
  applyCam(ctx, cam, .3); drawDojo(ctx, 1220);
  banner(ctx, 540, 420, 620, 110, 'PROJETO SOCIAL', '#16884a', 58);
  applyCam(ctx, cam, 1);
  bigPop(ctx, '12 ANOS', 540, 620, 110, lt, .1);
  // the throw: partner flips over his hip
  const th = kf(lt, [[2.0, 0], [2.7, 1, ease]]);
  drawStick(ctx, C(KID, { x: 420, y: 1250, s: 560, cols: ['#fdfdfb', '#fdfdfb'], gi: '#fdfdfb', vest: '#e9e6de', lean: th * .3, arms: { L: { ik: [.3, -.62], bend: -1 }, R: { ik: [.45, -.55], bend: 1 } }, face: { eyes: 'normal', mouth: th > .8 ? 'grin' : 'flat', browAng: .3 } }));
  const ang = th * Math.PI * .95; const px = lerp(700, 620, th), py = lerp(1250, 1300, th);
  ctx.save(); ctx.translate(px, py - 250); ctx.rotate(ang); ctx.translate(-px, -(py - 250));
  drawStick(ctx, C(FAN, { x: px, y: py, s: 540, flip: -1, cols: ['#fdfdfb', '#fdfdfb'], gi: '#2f63c9', hat: 'bald', shadow: th < .2, arms: { L: { ik: [-.2, -.6] }, R: { ik: [.2, -.5] } }, face: { eyes: th > .5 ? 'spiral' : 'wide', mouth: 'o' }, t }));
  ctx.restore();
  if (lt > 2.7 && lt < 3.2) { const k = lt - 2.7; ctx.save(); ctx.translate(720, 1180); const sc = backOut(clamp(k / .12)) * (1 - clamp((k - .3) / .2)); ctx.scale(sc, sc); burst(ctx, 0, 0, 160, 11, '#ffd23a', 4); ctx.restore(); puff(ctx, 640, 1270, 80, t, '#e8eef8', 2, 1 - clamp((lt - 2.7) * 2)); }
});
// 9b — a phenomenon on the mats: medals rain down
S(wf(9, 'virou'), L(10), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1.05 + lt * .05 };
  applyCam(ctx, cam, .3); drawDojo(ctx, 1220);
  applyCam(ctx, cam, 1);
  rrect(ctx, 340, 1050, 400, 200, 10); fillStroke(ctx, '#f2c12e', 7); text(ctx, '1', 540, 1150, 120, INK, null, 0);
  drawStick(ctx, C(KID, { x: 540, y: 1050, s: 520, cols: ['#fdfdfb', '#fdfdfb'], gi: '#fdfdfb', vest: '#e9e6de', arms: raise, face: { eyes: 'happy', mouth: 'grin' } }));
  const R = rng(4);
  for (let i = 0; i < 9; i++) { const t0 = .2 + i * .2; const k = lt - t0; if (k < 0) continue; const x = 160 + R() * 760; const y = Math.min(-100 + k * k * 2600, 980 - (i % 3) * 30 + (x > 340 && x < 740 ? 0 : 260)); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(k * 6 + i) * .3); line(ctx, -30, -90, 0, 0, 10, i % 2 ? '#2f63c9' : '#e0392f'); line(ctx, 30, -90, 0, 0, 10, i % 2 ? '#e0392f' : '#2f63c9'); circle(ctx, 0, 20, 42); fillStroke(ctx, i % 3 ? '#f2c12e' : '#cfd5dc', 6); star5(ctx, 0, 20, 20, 0, '#fff6c4'); ctx.restore(); }
});
// 10 — UFC debut, 2010, only 20
S(L(10), wf(10, 'mas'), 'cut', (ctx, lt, t) => {
  const h = hh(t, 4); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .06 };
  drawArena(ctx, t, cam, { cheer: .5, flashes: .4 });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(CHARLES, { x: kf(lt, [[0, 300], [1.4, 540]]), y: 1250, s: 560, beard: false, legs: lt < 1.4 ? walkLegs(lt, 7, .4) : stand, arms: lt < 1.4 ? walkArms(lt, 7, .4) : guard, face: { eyes: 'wide', mouth: 'smile', look: [.3, -.2] } }));
  bigPop(ctx, '2010', 540, 380, 200, lt, wf(10, '2010') - L(10));
  bigPop(ctx, '20 ANOS', 540, 600, 110, lt, wf(10, '20') - L(10), '#fff');
});
// 10b — the start wasn't easy: a hard shove to the canvas
S(wf(10, 'mas'), L(11), 'whip', (ctx, lt, t) => {
  const h = hh(t, 4); const hit = lt > .5; const sh = hit && lt < .8 ? shake(t, 16) : [0, 0];
  const cam = { x: 540 + h[0] + sh[0], y: 960 + h[1] + sh[1], z: 1.1 };
  drawArena(ctx, t, cam, { cheer: 0 });
  applyCam(ctx, cam, 1);
  const f = kf(lt, [[.5, 0], [.8, 1, easeIn]]);
  drawStick(ctx, C(RIVAL, { x: 780, y: 1250, s: 640, flip: -1, arms: lt < .5 ? guard : { L: { ik: [.1, -.75], bend: 1 }, R: { ik: [.45, -.62], bend: -1 } }, face: { eyes: 'normal', mouth: 'teeth', browAng: .4 } }));
  drawStick(ctx, C(CHARLES, { x: lerp(420, 300, f), y: 1250, s: 560, beard: false, lean: -f * 1.2, arms: guard, legs: f > .8 ? { L: [1.1, -.3], R: [.9, -.6] } : stand, face: { eyes: f > .5 ? 'spiral' : 'wide', mouth: 'o' }, t }));
  if (lt > .5 && lt < 1.0) { const k = lt - .5; ctx.save(); ctx.translate(420, 820); const sc = backOut(clamp(k / .1)) * (1 - clamp((k - .35) / .15)); ctx.scale(sc, sc); burst(ctx, 0, 0, 170, 11, '#ffd23a', 3); ctx.restore(); }
});
// 11 — the weight cut: sweating on the scale
S(L(11), wf(11, 'acumulou'), 'cut', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1.05 + lt * .06 };
  applyCam(ctx, cam, .3); drawRoomWall(ctx, '#f2c7a0', '#e4a97c', 1260);
  applyCam(ctx, cam, 1);
  drawScale(ctx, 780, 1250, 1, 1.4 + Math.sin(lt * 7) * .5);
  drawStick(ctx, C(CHARLES, { x: 520, y: 1250, s: 640, beard: false, squash: 1 - Math.abs(Math.sin(lt * 3)) * .03, arms: { L: [.5, -.3], R: [.5, -.3] }, face: { eyes: 'squint', mouth: 'teeth', browAng: -.3 } }));
  for (let i = 0; i < 4; i++) { const k = (lt * 1.2 + i * .25) % 1; sweat(ctx, 520 + (i % 2 ? 150 : -150), 560 + k * 300, 30, 1 - k); }
  // heat waves
  for (let i = 0; i < 4; i++) { ctx.beginPath(); for (let k = 0; k <= 20; k++) { const y = 400 - k * 10 - (lt * 80) % 80, x = 200 + i * 230 + Math.sin(k * .6 + lt * 5) * 12; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,120,60,.5)'; ctx.stroke(); }
});
// 11b — hard losses pile up: red X marks
S(wf(11, 'acumulou'), wf(11, 'chegou'), 'cut', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1.1 - lt * .03 };
  drawArena(ctx, t, cam, { cheer: 0 });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(CHARLES, { x: 540, y: 1250, s: 620, beard: false, headTilt: .25, arms: { L: [.1, 0], R: [.1, 0] }, face: { eyes: 'half', mouth: 'frown', look: [0, .8], browAng: -.3 } }));
  for (let i = 0; i < 3; i++) redX(ctx, 250 + i * 290, 420, 110, (lt - .15 - i * .35) / .25);
});
// 11c — "amarelão!": the doubters
S(wf(11, 'chegou'), L(12), 'whip', (ctx, lt, t) => {
  const h = hh(t, 4); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1.05 + lt * .05 };
  drawArena(ctx, t, cam, { cheer: 0 });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(CHARLES, { x: 540, y: 1250, s: 560, beard: false, headTilt: Math.sin(lt * 2) * .05, arms: { L: [.2, -.1], R: [.2, -.1] }, face: { eyes: 'normal', mouth: 'flat', look: [Math.sin(lt * 3), -.3], browAng: -.2 } }));
  const tA = wf(11, 'amarelão') - wf(11, 'chegou');
  const bub = [[300, 450, -.5], [780, 330, .5], [260, 760, -.3], [820, 760, .3]];
  bub.forEach(([x, y, tl], i) => { const k = clamp((lt - tA - i * .25) / .2); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(backOut(k), backOut(k)); bubble(ctx, 0, 0, i < 2 ? 340 : 120, 100, i < 2 ? 'AMARELÃO!' : '?', 52, [tl, 1], i < 2 ? '#ffe14d' : '#fff'); ctx.restore(); });
  // thumbs down from the crowd
  for (let i = 0; i < 5; i++) { const k = clamp((lt - tA - .4 - i * .1) / .2); if (k <= 0) continue; const x = 120 + i * 210, y = 1150 - k * 40; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI); rrect(ctx, -26, -30, 52, 60, 14); fillStroke(ctx, '#f6f2ea', 5); rrect(ctx, -12, -78, 24, 54, 12); fillStroke(ctx, '#f6f2ea', 5); ctx.restore(); }
});
// 12 — the key turns: up to lightweight
S(L(12), L(13), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .05 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#2b1d4a', '#7a4bc4', -300, 1600);
  applyCam(ctx, cam, 1);
  const turn = kf(lt, [[.2, 0], [.8, Math.PI / 2, backOut]]);
  drawKey(ctx, 330, 420, .55, turn - .1);
  if (lt > .8 && lt < 1.2) sparkle(ctx, 380, 420, 90 * (1 - (lt - .8) / .4), 1);
  // steps: PENA -> LEVE
  rrect(ctx, 80, 1080, 420, 170, 10); fillStroke(ctx, '#cfd5dc', 7); text(ctx, 'PENA', 290, 1165, 64, INK, null, 0);
  rrect(ctx, 540, 900, 460, 350, 10); fillStroke(ctx, '#f2c12e', 7); text(ctx, 'LEVE', 770, 1000, 72, INK, null, 0);
  const up = kf(lt, [[1.0, 0], [1.6, 1, ease]]);
  const x = lerp(290, 770, up), y = lerp(1080, 900, up) - Math.sin(up * Math.PI) * 160;
  drawStick(ctx, C(CHARLES, { x, y, s: 520, legs: up > 0 && up < 1 ? { L: [.8, -1], R: [.3, -.6] } : stand, arms: up >= 1 ? raise : guard, face: { eyes: up >= 1 ? 'happy' : 'normal', mouth: 'grin', browAng: .3 } }));
  if (up >= 1) { const pa = clamp(1 - (lt - 1.6) * 2); puff(ctx, x - 140, 890, 60, t, '#efe3cf', 3, pa); puff(ctx, x + 140, 890, 60, t, '#efe3cf', 4, pa); }
});
// 13 — 11 straight wins: the counter ticks as rivals drop
S(L(13), L(14), 'whip', (ctx, lt, t) => {
  const h = hh(t, 4); const dur = L(14) - L(13);
  const n = Math.min(11, 1 + Math.floor(Math.max(0, lt - .3) / ((dur - .8) / 11)));
  const kick = ((lt - .3) / ((dur - .8) / 11)) % 1;
  const sh = kick < .15 ? shake(t, 10) : [0, 0];
  const cam = { x: 540 + h[0] + sh[0], y: 960 + h[1] + sh[1], z: 1.05 };
  drawArena(ctx, t, cam, { cheer: n / 11, flashes: n / 11 });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(CHARLES, { x: 380, y: 1250, s: 600, arms: kick < .3 ? { L: { ik: [-.02, -.72], bend: -1 }, R: { ik: [.5, -.72], bend: -1 } } : guard, face: { eyes: 'normal', mouth: 'teeth', browAng: .45 } }));
  const fall = clamp(kick * 2.5);
  ctx.save(); ctx.translate(720, 1250); ctx.rotate(fall * 1.3); ctx.translate(-720, -1250);
  drawStick(ctx, C(RIVAL, { x: 720, y: 1250, s: 600, flip: -1, sil: '#2a2238', arms: guard }));
  ctx.restore();
  ctx.save(); ctx.translate(540, 440); const pk = 1 + .25 * (1 - clamp(kick * 4)); ctx.scale(pk, pk);
  text(ctx, String(n), 0, 0, 260, '#ffe14d', INK, 36, 'Poppins', 700); text(ctx, String(n), 0, 0, 260, '#ffe14d', INK, 0, 'Poppins', 700); ctx.restore();
  text(ctx, 'VITÓRIAS SEGUIDAS', 540, 620, 60, '#fff', INK, 12, 'Poppins', 700); text(ctx, 'VITÓRIAS SEGUIDAS', 540, 620, 60, '#fff', INK, 0, 'Poppins', 700);
});
// 14 — 2021: the knockout of Michael Chandler
S(L(14), wf(14, 'pra'), 'cut', (ctx, lt, t) => {
  const tK = wf(14, 'nocauteou') - L(14) + .25;
  const h = hh(t, 4); const sh = lt > tK && lt < tK + .4 ? shake(t, 22) : [0, 0];
  const cam = { x: 540 + h[0] + sh[0], y: 960 + h[1] + sh[1], z: 1.05 + lt * .04 };
  drawArena(ctx, t, cam, { cheer: lt > tK ? 1 : .3, flashes: lt > tK ? 1 : .2 });
  applyCam(ctx, cam, 1);
  bigPop(ctx, '2021', 540, 400, 180, lt, wf(14, '2021') - L(14) - .1);
  const punch = kf(lt, [[tK - .15, 0], [tK, 1, easeOut], [tK + .4, 0]]);
  drawStick(ctx, C(CHARLES, { x: 380, y: 1250, s: 620, lean: punch * .15, arms: { L: { ik: [-.02, -.72], bend: -1 }, R: { ik: [lerp(.08, .58, punch), -.72], bend: -1 } }, armLen: 1.15, face: { eyes: 'normal', mouth: 'teeth', browAng: .45 } }));
  const f = kf(lt, [[tK, 0], [tK + .5, 1, easeIn]]);
  ctx.save(); ctx.translate(760, 1250); ctx.rotate(f * 1.45); ctx.translate(-760, -1250);
  drawStick(ctx, C(RIVAL, { x: 760, y: 1250, s: 620, flip: -1, shadow: f < .3, arms: f > 0 ? { L: [.6, -.2], R: [1.6, -.2] } : guard, face: { eyes: f > 0 ? 'x' : 'normal', mouth: f > 0 ? 'o' : 'flat' } }));
  ctx.restore();
  if (lt > tK && lt < tK + .55) { const k = lt - tK; ctx.save(); ctx.translate(700, 790); const sc = backOut(clamp(k / .1)) * (1 - clamp((k - .4) / .15)); ctx.scale(sc, sc); burst(ctx, 0, 0, 240, 12, '#ffd23a', 7); burst(ctx, 0, 0, 130, 10, '#fff6c4', 9); text(ctx, 'POW!', 0, 0, 96, '#e0392f', INK, 16, 'Poppins', 700); ctx.restore(); }
  if (lt > tK && lt < tK + .12) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
});
// 14b — the belt goes around his waist
S(wf(14, 'pra'), L(15), 'whip', (ctx, lt, t) => {
  const h = hh(t, 4); const cam = { x: 540 + h[0], y: 1000 + h[1], z: 1.1 + lt * .05 };
  drawArena(ctx, t, cam, { cheer: 1, flashes: 1 });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(CHARLES, { x: 540, y: 1290, s: 760, arms: raise, face: { eyes: 'squint', mouth: 'grin', browAng: .2 }, headTilt: -.06 }));
  const k = kf(lt, [[.3, 0], [.8, 1, backOut]]);
  drawBelt(ctx, 540, lerp(1700, 1290 - .33 * 760, k), .5, 0, k);
  confetti(ctx, lt, .5, 90, 3);
});
// 15 — defended the title, beat the division's giants
S(L(15), L(16), 'whip', (ctx, lt, t) => {
  const h = hh(t, 3); const dur = L(16) - L(15); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .03 };
  drawArena(ctx, t, cam, { cheer: .8, flashes: .6 });
  applyCam(ctx, cam, 1);
  const giants = [[260, 1.0], [540, 1.4], [820, 1.0]];
  giants.forEach(([x, sc], i) => {
    const tf = .5 + i * (dur - 1) / 3; const f = kf(lt, [[tf, 0], [tf + .45, 1, easeIn]]);
    ctx.save(); ctx.translate(x, 1230); ctx.rotate(f * (i === 0 ? -1.4 : 1.4)); ctx.translate(-x, -1230);
    drawStick(ctx, C(RIVAL, { x, y: 1230, s: 820 * sc, sil: '#2a2238', arms: guard, alpha: 1 - f * .3 }));
    ctx.restore();
    if (lt > tf && lt < tf + .4) { const k = lt - tf; ctx.save(); ctx.translate(x, 700); const s2 = backOut(clamp(k / .1)) * (1 - clamp((k - .28) / .12)); ctx.scale(s2, s2); burst(ctx, 0, 0, 130, 10, '#ffd23a', i + 3); ctx.restore(); }
  });
  drawStick(ctx, C(CHARLES, { x: 540, y: 1250, s: 430, arms: lt > dur - .6 ? raise : guard, face: { eyes: 'normal', mouth: 'teeth', browAng: .45 } }));
  drawBelt(ctx, 540, 1250 - .33 * 430, .3, 0, 0);
});
// 16 — his name carved into history
S(L(16), wf(16, 'mais'), 'cut', (ctx, lt, t) => {
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .05 };
  applyCam(ctx, cam, .08); drawSky(ctx, '#f6b36a', '#fde7c0');
  applyCam(ctx, cam, .2); drawSun(ctx, 860, 380, 90, t, .8);
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#c9b48a'; ctx.fillRect(-500, 1240, 2100, 1000); line(ctx, -500, 1240, 1600, 1240, 6);
  drawStone(ctx, 600, 1240, 640, 900);
  const letters = 'OLIVEIRA'; const n = Math.floor(clamp((lt - .3) / 1.4) * letters.length);
  text(ctx, letters.slice(0, n), 600, 620, 104, '#5d5a6a', null, 0, 'Lora', 700);
  text(ctx, 'NA HISTÓRIA', 600, 760, 56, '#5d5a6a', null, 0, 'Lora', 700);
  drawStick(ctx, C(CHARLES, { x: 200, y: 1250, s: 520, arms: { L: [.3, -.2], R: { ik: [.55, -.7], bend: -1 } }, armLen: 1.2, face: { eyes: 'normal', mouth: 'smile', look: [1, -.3] } }));
  if (n < letters.length && lt > .3) for (let i = 0; i < 3; i++) sparkle(ctx, 360 + (n * 60) % 500 + Math.sin(t * 40 + i) * 30, 620 + Math.cos(t * 37 + i) * 40, 22, 1);
});
// 16b — the records: most submissions, most finishes
S(wf(16, 'mais'), L(17), 'whip', (ctx, lt, t) => {
  const h = hh(t, 2); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .02 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#1e2a5a', '#3a4f9e', -300, 1700);
  applyCam(ctx, cam, 1);
  const tB = wf(16, 'mais', 1) - wf(16, 'mais');
  const rows = [['MAIS FINALIZAÇÕES', 0], ['MAIS VITÓRIAS POR VIA RÁPIDA', tB]];
  rows.forEach(([lab, t0], r) => {
    const y0 = 300 + r * 470; const k = clamp((lt - t0) / .9);
    text(ctx, lab, 540, y0, r ? 44 : 54, '#fff', INK, 10, 'Poppins', 700); text(ctx, lab, 540, y0, r ? 44 : 54, '#fff', INK, 0, 'Poppins', 700);
    const bars = [.55, .62, .7, 1];
    bars.forEach((v, i) => { const bw = 150, x = 150 + i * 200, hmax = 220, bh = hmax * v * easeOut(clamp(k * 1.3 - i * .1)); const yb = y0 + 370; rrect(ctx, x, yb - bh, bw, bh, 10); fillStroke(ctx, i === 3 ? '#f2c12e' : '#7d86a8', 6); });
    if (k > .9) { const x = 150 + 3 * 200 + 75, y = y0 + 370 - 220 - 50; ctx.save(); ctx.translate(x, y); const s2 = backOut(clamp((k - .9) * 10)); ctx.scale(s2, s2); text(ctx, '#1', 0, 0, 72, '#ffe14d', INK, 12, 'Poppins', 700); text(ctx, '#1', 0, 0, 72, '#ffe14d', INK, 0, 'Poppins', 700); ctx.restore(); }
  });
});
// 17 — from the favela to the top of the world
S(L(17), wf(17, 'com'), 'cut', (ctx, lt, t) => {
  const dur = wf(17, 'com') - L(17); const p = ease(clamp(lt / (dur * .85)));
  const h = hh(t, 3); const cam = { x: 540 + h[0], y: lerp(1900, 820, p) + h[1], z: 1 };
  applyCam(ctx, cam, 1); drawSky(ctx, '#3ea6ee', '#ffd9a0', -400, 2400);
  drawSun(ctx, 820, 380, 90, t, 1.1);
  drawMountain(ctx, 540, 640, 2300, 1700, '#7a6fb0');
  drawFavela(ctx, 2300, t, { rows: 4, seed: 5 });
  drawStick(ctx, C(CHARLES, { x: 540, y: 665, s: 380, arms: raise, face: { eyes: 'happy', mouth: 'grin' } }));
  drawBelt(ctx, 540, 665 - .33 * 380, .2, 0, p > .9 ? 1 : 0);
  // flag on the peak
  line(ctx, 640, 660, 640, 420, 8); path(ctx, [[640, 420], [800, 470], [640, 520]]); fillStroke(ctx, '#16884a', 6); circle(ctx, 690, 470, 26); fillStroke(ctx, '#f2c12e', 4);
});
// 17b — with the belt or without it: the champion has a name (the scream in the cage)
S(wf(17, 'com'), L(18), 'whip', (ctx, lt, t) => {
  const h = hh(t, 6); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1.1 + lt * .05, r: Math.sin(t * 1.3) * .01 };
  drawArena(ctx, t, cam, { cheer: 1, flashes: 1 });
  applyCam(ctx, cam, 1);
  const tS = wf(17, 'sem') - wf(17, 'com');
  const gone = clamp((lt - tS) / .4);
  drawStick(ctx, C(CHARLES, { x: 540, y: 1270, s: 800, arms: { L: [2.2, .9], R: [2.2, .9] }, face: { eyes: 'squint', mouth: 'grin', browAng: .5 }, headTilt: Math.sin(t * 8) * .03 }));
  drawBelt(ctx, 540, 1270 - .33 * 800 + gone * 900, .45, gone * 1.2, 0);
  const tN = wf(17, 'nome') - wf(17, 'com');
  if (lt > tN) { ctx.save(); ctx.translate(540, 360); const s2 = backOut(clamp((lt - tN) / .25)); ctx.scale(s2, s2); text(ctx, 'DO BRONX!', 0, 0, 130, '#ffe14d', INK, 22, 'Poppins', 700); text(ctx, 'DO BRONX!', 0, 0, 130, '#ffe14d', INK, 0, 'Poppins', 700); ctx.restore(); }
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t; line(ctx, 540 + Math.cos(a) * 300, 560 + Math.sin(a) * 200, 540 + Math.cos(a) * 380, 560 + Math.sin(a) * 250, 10, '#ffe14d'); }
});
// 18 — CTA: is he in the top 5?
S(L(18), L(19), 'whip', (ctx, lt, t) => {
  const h = hh(t, 2); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#16884a', '#0e5a30', -300, 1700);
  applyCam(ctx, cam, 1);
  text(ctx, 'TOP 5', 540, 300, 150, '#ffe14d', INK, 24, 'Poppins', 700); text(ctx, 'TOP 5', 540, 300, 150, '#ffe14d', INK, 0, 'Poppins', 700);
  text(ctx, 'BRASILEIROS NO MMA', 540, 420, 52, '#fff', INK, 10, 'Poppins', 700); text(ctx, 'BRASILEIROS NO MMA', 540, 420, 52, '#fff', INK, 0, 'Poppins', 700);
  for (let i = 0; i < 5; i++) { const k = clamp((lt - .2 - i * .15) / .2); const y = 520 + i * 135; ctx.save(); ctx.translate(lerp(1300, 0, easeOut(k)), 0); rrect(ctx, 110, y, 640, 110, 20); fillStroke(ctx, '#fdfdfb', 6); circle(ctx, 175, y + 55, 40); fillStroke(ctx, '#f2c12e', 5); text(ctx, String(i + 1), 175, y + 58, 50, INK, null, 0); text(ctx, '?', 450, y + 58, 70, '#9aa4b0', null, 0); ctx.restore(); }
  // Charles card bobbing next to the list
  const bob = Math.sin(t * 3) * 10;
  drawStick(ctx, C(CHARLES, { x: 880, y: 1180 + bob, s: 380, shadow: false, arms: { L: [.3, -.1], R: { ik: [.3, -.95], bend: -1 } }, face: { eyes: 'normal', mouth: 'smirk', browOne: 1, look: [-.6, -.4] } }));
});
// 19 — comment below
S(L(19), END, 'cut', (ctx, lt, t) => {
  const h = hh(t, 2); const cam = { x: 540 + h[0], y: 960 + h[1], z: 1 + lt * .03 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#16884a', '#0e5a30', -300, 1700);
  applyCam(ctx, cam, 1);
  const k = clamp(lt / .25); ctx.save(); ctx.translate(540, 560); ctx.scale(backOut(k), backOut(k)); bubble(ctx, 0, 0, 640, 260, 'COMENTA AÍ!', 76, [-.3, 1], '#fff'); ctx.restore();
  const bob = Math.abs(Math.sin(t * 5)) * 40;
  for (const x of [340, 740]) { ctx.save(); ctx.translate(x, 860 + bob); path(ctx, [[-50, 0], [50, 0], [50, 80], [100, 80], [0, 190], [-100, 80], [-50, 80]]); fillStroke(ctx, '#ffe14d', 7); ctx.restore(); }
  drawStick(ctx, C(CHARLES, { x: 540, y: 1250, s: 260, arms: { L: [.3, -.1], R: { ik: [.25, -.2], bend: 1 } }, face: { eyes: 'happy', mouth: 'grin' } }));
});
