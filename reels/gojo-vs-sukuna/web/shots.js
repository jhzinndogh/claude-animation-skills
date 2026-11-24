// ---------- Gojo vs Sukuna: shot list (seconds of the reference voice, audio/words_ref.json) ----------
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const camOf = (t, x, y, z, a = 4, r = 0) => { const h = handheld(t, a); return { x: x + h[0], y: y + h[1], z, r }; };
const hitShake = (lt, at, amp = 26, d = .3) => { const k = clamp(1 - (lt - at) / d); return lt >= at && k > 0 ? shake(lt * 3, amp * k, 3, 7) : [0, 0]; };
function flash(ctx, lt, at, d = .18, col = '255,255,255') { const a = lt >= at ? clamp(1 - (lt - at) / d) : 0; if (a <= 0) return; screen(ctx); ctx.fillStyle = `rgba(${col},${a * .85})`; ctx.fillRect(0, 0, W, H); }
function sepia(ctx, a = 1) { screen(ctx); ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = `rgba(150,110,70,${.75 * a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); ctx.fillStyle = `rgba(60,35,10,${.12 * a})`; ctx.fillRect(0, 0, W, H); }
function tag(ctx, str, x, y, col = '#ffd23a', lt = 1, at = 0) { const p = popIn(lt, at); if (p <= 0) return; screen(ctx); banner(ctx, str, x, y, 68, col, -.03, p); }
const fist = () => {};
const SHOTS = [];

// A — hook: split screen, Gojo pulls the blindfold, Heian Sukuna flexes, VS slams in
SHOTS.push({ start: 0, end: 3.84, tr: 'whip', draw(ctx, lt, t) {
  const hs = hitShake(lt, .25, 30, .4);
  const cam = camOf(t, 540 + hs[0], 960 + hs[1], 1.0 + lt * .03, 3);
  const split = (side) => { screen(ctx); ctx.beginPath(); if (side < 0) { ctx.moveTo(-10, -10); ctx.lineTo(660, -10); ctx.lineTo(420, H + 10); ctx.lineTo(-10, H + 10); } else { ctx.moveTo(660, -10); ctx.lineTo(W + 10, -10); ctx.lineTo(W + 10, H + 10); ctx.lineTo(420, H + 10); } ctx.closePath(); ctx.clip(); };
  // left: Gojo
  ctx.save(); split(-1); grad(ctx, '#0d2a6e', '#4fb6ff'); speedLines(ctx, 270, 900, t, 'rgba(255,255,255,.28)', 40, 300, 3);
  applyCam(ctx, cam, 1); aura(ctx, 280, 1560, 900, t, 'rgba(95,208,255,.45)', .9, 3);
  const pull = kf(lt, [[.55, 0], [1.25, 1]]); const blind = 1 - kf(lt, [[.95, 0], [1.35, 1]]);
  drawStick(ctx, C2(GOJO, { x: 280, y: 1560, s: 820, blind, bob: Math.sin(t * 3) * .004,
    arms: { L: [.3, -.15], R: pull > 0 && pull < 1 ? { ik: [.02, lerp(-.83, -.98, pull)], bend: -1 } : (pull >= 1 ? [2.6, .5] : [.3, -.15]) },
    face: { look: [.6, 0], mouth: lt > 1.4 ? 'smirk' : 'flat', browAng: .1 } }));
  const sp = kf(lt, [[1.35, 0], [1.5, 1], [2.1, 0]]); const ey = 1560 - .77 * 820;
  sparkle(ctx, 280 - 59, ey, 60 * sp, sp); sparkle(ctx, 280 + 59, ey, 60 * sp, sp);
  ctx.restore();
  // right: Heian Sukuna
  ctx.save(); split(1); grad(ctx, '#3a0206', '#e0352b'); speedLines(ctx, 810, 900, t, 'rgba(255,220,200,.22)', 40, 300, 8);
  applyCam(ctx, cam, 1); aura(ctx, 810, 1560, 900, t, 'rgba(255,60,50,.45)', .9, 8);
  const flex = kf(lt, [[.2, 0], [.7, 1, backOut]]);
  drawStick(ctx, C2(SUKUNA, { x: 810, y: 1560, s: 820, belly: .5 + .5 * Math.sin(t * 14), bob: Math.sin(t * 3 + 1) * .004,
    arms: { L: [lerp(.3, 2.3, flex), lerp(-.1, .9, flex)], R: [lerp(.3, 2.3, flex), lerp(-.1, .9, flex)] }, arms2: { L: [lerp(.5, 1.25, flex), lerp(-.3, -1.9, flex)], R: [lerp(.5, 1.25, flex), lerp(-.3, -1.9, flex)] },
    face: { look: [-.6, 0], mouth: 'grin' } }));
  ctx.restore();
  // divider + VS
  screen(ctx); ctx.beginPath(); ctx.moveTo(660, -10); ctx.lineTo(420, H + 10); ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#fff'; ctx.stroke();
  const vs = popIn(lt, .25, .35);
  if (vs > 0) { ctx.save(); ctx.translate(560, 520); ctx.scale(vs, vs); burst(ctx, 0, 0, 190, 12, '#ffd23a', 4); text(ctx, 'VS', 0, 8, 170, '#fff', INK, 26); text(ctx, 'VS', 0, 8, 170, '#e0352b', INK, 0); ctx.restore(); }
  flash(ctx, lt, .25, .2);
} });

// B1 — both at their peak in a ruined city, auras flaring
SHOTS.push({ start: 3.84, end: 6.5, tr: 'cut', draw(ctx, lt, t) {
  const cam = camOf(t, 540, 1000, 1.0 + lt * .05, 4);
  applyCam(ctx, cam, .3); cityBG(ctx, t, { top: '#1b1640', bot: '#c0505a' });
  applyCam(ctx, cam, 1);
  const peak = kf(lt, [[1.6, 0], [1.9, 1, backOut]]);
  aura(ctx, 290, 1520, 620 + peak * 300, t, 'rgba(95,208,255,.5)', .8 + peak * .2, 3);
  aura(ctx, 800, 1520, 640 + peak * 320, t, 'rgba(255,60,50,.5)', .8 + peak * .2, 8);
  drawStick(ctx, C2(GOJO, { x: 290, y: 1520, s: 560, arms: { L: [.4, -.2], R: [.9, -2.0] }, face: { look: [1, 0], mouth: 'smirk', browAng: .15 } }));
  drawStick(ctx, C2(SUKUNA, { x: 800, y: 1520, s: 600, belly: .3 + .3 * Math.sin(t * 10), arms: { L: [.9, -2.2], R: [.9, -2.2] }, arms2: { L: [1.5, -.7], R: [1.5, -.7] }, face: { look: [-1, 0] } }));
  screen(ctx); if (peak > 0) speedLines(ctx, 540, 760, t, `rgba(255,255,255,${.3 * peak})`, 50, 520, 5);
  tag(ctx, 'NO AUGE', 540, 360, '#ffd23a', lt, 1.75);
  flash(ctx, lt, 1.75, .15);
} });

// B2 — no Megumi body, no Mahoraga: who wins?
SHOTS.push({ start: 6.5, end: 9.68, tr: 'whip', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#2a1f55', '#7d5ac9'); speedLines(ctx, 540, 900, t, 'rgba(255,255,255,.08)', 30, 400, 2);
  const cam = camOf(t, 540, 960, 1.0 + lt * .02, 3); applyCam(ctx, cam, 1);
  const gone = kf(lt, [[2.2, 0], [2.5, 1]]);
  const m = popIn(lt, .06), w = popIn(lt, 1.42);
  if (m > 0) { ctx.save(); ctx.translate(-gone * 700, 0); drawStick(ctx, C2(MEGUMI, { x: 280, y: 1180, s: 520 * m, arms: { L: [.3, -.1], R: [.3, -.1] } })); redX(ctx, 280, 830, 200, (lt - .7) / .25); ctx.restore(); }
  if (w > 0) { ctx.save(); ctx.translate(gone * 700, 0); wheel(ctx, 800, 800, 170 * w, t * .6); redX(ctx, 800, 800, 200, (lt - 1.95) / .25); ctx.restore(); }
  const q = popIn(lt, 2.25, .35);
  if (q > 0) { ctx.save(); ctx.translate(540, 760); ctx.scale(q, q); ctx.rotate(Math.sin(t * 4) * .06); text(ctx, '?', 0, 0, 640, '#ffd23a', INK, 50); text(ctx, '?', 0, 0, 640, '#ffd23a', INK, 0); ctx.restore(); }
  screen(ctx); if (lt < 2.3) { text(ctx, 'SEM', 540, 360, 90, '#fff', INK, 18); }
} });

// C — Gojo at his limit: the Six Eyes
SHOTS.push({ start: 9.68, end: 12.4, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#071a4a', '#3a9bff'); speedLines(ctx, 540, 860, t, 'rgba(255,255,255,.25)', 50, 320, 9);
  const zoom = kf(lt, [[1.9, 0], [2.4, 1, easeOut]]);
  const cam = camOf(t, 540, lerp(1000, 880, zoom), lerp(1.0 + lt * .04, 2.1, zoom), 3);
  applyCam(ctx, cam, 1); aura(ctx, 540, 2050, 1700, t, 'rgba(95,208,255,.4)', .9, 3);
  drawStick(ctx, C2(GOJO, { x: 540, y: 2050, s: 1500, shadow: false, arms: { L: [.3, -.15], R: [.3, -.15] }, face: { look: [0, 0], mouth: zoom > .5 ? 'flat' : 'smirk', browAng: .12 } }));
  const ey = 2050 - .77 * 1500;
  for (const sd of [-1, 1]) { glowAt(ctx, 540 + sd * 108, ey, 190, 'rgba(95,208,255,A)', .5 + zoom * .5); }
  const sa = kf(lt, [[2.1, 0], [2.3, 1], [2.7, .3]]); sparkle(ctx, 540 - 140, ey - 60, 50 * sa, sa); sparkle(ctx, 540 + 150, ey - 40, 40 * sa, sa);
  tag(ctx, 'SEIS OLHOS', 540, 330, '#9fe6ff', lt, 2.1);
} });

// D — Infinity: the punch stops in mid-air
SHOTS.push({ start: 12.4, end: 13.8, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#0c1f58', '#5fbfff');
  const cam = camOf(t, 540, 1000, 1.05 + lt * .05, 3); applyCam(ctx, cam, 1);
  const lunge = kf(lt, [[0, 0], [.35, 1, easeOut]]);
  const sx = lerp(980, 800, lunge);
  // ripple rings at the edge of the Infinity
  for (let k = 0; k < 3; k++) { const p = ((lt - .35) * 1.6 + k / 3) % 1; if (lt > .35) { ellipse(ctx, 520, 1100, 40 + p * 220, 80 + p * 420); ctx.lineWidth = 10 * (1 - p); ctx.strokeStyle = `rgba(200,240,255,${1 - p})`; ctx.stroke(); } }
  drawStick(ctx, C2(GOJO, { x: 300, y: 1500, s: 640, arms: { L: [.4, -.2], R: [.9, -2.1] }, face: { look: [1, 0], mouth: 'smirk', browAng: .15 } }));
  drawStick(ctx, C2(SUKUNA, { x: sx, y: 1500, s: 640, lean: -.12 * lunge, belly: .2, arms: { L: { ik: [(560 - sx) / 640, -.6] }, R: [.5, -.4] }, arms2: { L: [1.5, -.7], R: [1.6, -1.2] },
    prop: (c, k, h) => fist(c, k, h), face: { look: [-1, 0], mouth: lt > .5 ? 'teeth' : 'grin', browAng: .4 } }));
  if (lt > .35) sweat(ctx, sx + 150, 1500 - 560, 30, clamp((lt - .5) * 3));
  tag(ctx, 'INFINITO', 540, 330, '#9fe6ff', lt, .1);
} });

// E — Unlimited Void opens
SHOTS.push({ start: 13.8, end: 14.88, tr: 'whip', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#0c1f58', '#5fbfff');
  const r = kf(lt, [[0, 0], [.55, 1600, easeOut]]);
  ctx.save(); circle(ctx, 640, 900, r); ctx.clip(); voidBG(ctx, t); ctx.restore();
  const cam = camOf(t, 540, 1000, 1.0 + lt * .08, 3); applyCam(ctx, cam, 1);
  drawStick(ctx, C2(GOJO, { x: 540, y: 1560, s: 760, arms: { L: [.4, -.2], R: { ik: [.16, -.92] } }, face: { look: [0, 0], mouth: 'smirk', browAng: .2 } }));
  glowAt(ctx, 540 + .16 * 760 * .9, 1560 - .92 * 760, 160, 'rgba(160,220,255,A)', .8);
  tag(ctx, 'VAZIO ILIMITADO', 540, 330, '#c9b8ff', lt, .05);
} });

// F — Heian Sukuna rises
SHOTS.push({ start: 14.88, end: 17.9, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#1d0204', '#c4231e'); glowAt(ctx, 540, 700, 900, 'rgba(255,120,60,A)', .5);
  const rise = kf(lt, [[0, 0], [1.3, 1, easeOut]]);
  const cam = camOf(t, 540, 1000, 1.0 + lt * .04, 3); applyCam(ctx, cam, 1);
  for (let i = 0; i < 5; i++) puff(ctx, 140 + i * 200, 1640 + Math.sin(i) * 40, 150, t, '#3a1012', 10 + i, .9);
  aura(ctx, 540, 1880, 1300 * rise, t, 'rgba(255,60,50,.45)', rise, 8);
  const open = lt > 1.3;
  drawStick(ctx, C2(SUKUNA, { x: 540, y: lerp(2500, 1880, rise), s: 1150, shadow: false, belly: open ? .2 + .2 * Math.sin(t * 6) : 0,
    arms: { L: [.5, -.3], R: [.5, -.3] }, arms2: { L: [1.4, -.6], R: [1.4, -.6] },
    face: { blink: open ? 0 : 1, mouth: open ? 'grin' : 'flat', look: [0, 0] } }));
  for (let i = 0; i < 6; i++) puff(ctx, 60 + i * 200, 1800 + (i % 2) * 60, 170, t, '#4a1416', 20 + i, .95);
  tag(ctx, 'ERA HEIAN', 540, 330, '#ffb3a8', lt, 2.55);
} });

// G — four arms, two mouths chanting
SHOTS.push({ start: 17.9, end: 21.2, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#2a0306', '#e0352b'); speedLines(ctx, 540, 900, t, 'rgba(255,210,190,.12)', 36, 380, 4);
  const mouths = kf(lt, [[.6, 0], [1.0, 1]]);
  const cam = camOf(t, 540, lerp(1000, 1150, mouths), lerp(1.0, 1.45, mouths), 3);
  applyCam(ctx, cam, 1);
  const a1 = popIn(lt, 0, .3), a2 = popIn(lt, .22, .3);
  const chant = lt > .7 ? .5 + .5 * Math.sin(t * 22) : 0, chant2 = lt > .7 ? .5 + .5 * Math.sin(t * 22 + 2) : 0;
  drawStick(ctx, C2(SUKUNA, { x: 540, y: 1650, s: 1000, belly: chant,
    arms: { L: [lerp(.3, 2.0, a1), lerp(-.1, .5, a1)], R: [lerp(.3, 2.0, a1), lerp(-.1, .5, a1)] }, arms2: { L: [lerp(.4, 1.4, a2), lerp(-.2, -1.6, a2)], R: [lerp(.4, 1.4, a2), lerp(-.2, -1.6, a2)] },
    face: { mouth: chant2 > .5 ? 'o' : 'grin', look: [0, 0] } }));
  // floating chant glyphs from both mouths
  if (lt > .7) { const R = rng(3); for (let i = 0; i < 9; i++) { const p = ((lt - .7) * .7 + i / 9) % 1; const ox = (R() < .5 ? -1 : 1) * (.4 + R() * .6); for (const my of [1650 - .765 * 1000 + 85, 1650 - .44 * 1000]) { const x = 540 + ox * 420 * p, y = my - p * 260 * (R() + .5); ctx.save(); ctx.globalAlpha = 1 - p; ctx.translate(x, y); ctx.rotate(p * 3 + i); rrect(ctx, -14, -26, 28, 52, 6); fillStroke(ctx, '#ffe7a8', 4); line(ctx, -8, -8, 8, -8, 4); line(ctx, -8, 6, 8, 6, 4); ctx.restore(); } } }
  tag(ctx, lt < .66 ? '4 BRAÇOS' : '2 BOCAS', 540, 330, '#ffd23a', lt, lt < .66 ? 0 : .66);
} });

// H — raw strength: the ground cracks, then a power comparison
SHOTS.push({ start: 21.2, end: 24.9, tr: 'whip', draw(ctx, lt, t) {
  const hs = hitShake(lt, .5, 40, .5);
  const cam = camOf(t, 540 + hs[0], 1050 + hs[1], 1.0 + lt * .03, 4);
  applyCam(ctx, cam, .3); cityBG(ctx, t, { top: '#2a0b18', bot: '#d0473a', seed: 23 });
  applyCam(ctx, cam, 1);
  const smash = kf(lt, [[.25, 0], [.5, 1, easeIn]]);
  crack(ctx, 640, 1560, 900, clamp((lt - .5) * 4));
  drawStick(ctx, C2(SUKUNA, { x: 540, y: 1560, s: 720, lean: .15 * smash, belly: .4,
    arms: { L: [.6, -.3], R: { ik: [lerp(.2, .26, smash), lerp(-.95, -.05, smash)], bend: 1 } }, arms2: { L: [1.0, -1.5], R: [1.0, -1.5] }, armLen: 1.25,
    prop: (c, k, h) => fist(c, k, h, 'R', .055), face: { mouth: 'teeth', browAng: .45 } }));
  if (lt > .5) { burst(ctx, 735, 1560, 140 * clamp((lt - .5) * 6) * (1 - clamp((lt - .9) * 3)), 12, '#ffd23a'); for (let i = 0; i < 4; i++) puff(ctx, 640 + (i - 1.5) * 220, 1540, 90 + (lt - .5) * 60, t, '#d9c6b8', 30 + i, clamp(1.4 - (lt - .5))); }
  flash(ctx, lt, .5, .15);
  // power bars
  const bars = popIn(lt, 2.15, .3);
  if (bars > 0) { screen(ctx); ctx.save(); ctx.translate(540, 360); ctx.scale(bars, bars);
    rrect(ctx, -440, -150, 880, 300, 36); fillStroke(ctx, 'rgba(255,255,255,.92)', 10);
    text(ctx, 'MEGUMI', -260, -70, 46, INK, INK, 0); rrect(ctx, -110, -100, 520, 60, 30); fillStroke(ctx, '#e7e2dc', 6); rrect(ctx, -110, -100, 520 * .38, 60, 30); fillStroke(ctx, '#8a8a95', 6);
    text(ctx, 'HEIAN', -260, 60, 46, INK, INK, 0); rrect(ctx, -110, 30, 520, 60, 30); fillStroke(ctx, '#e7e2dc', 6); rrect(ctx, -110, 30, 520 * clamp((lt - 2.2) * 1.5), 60, 30); fillStroke(ctx, '#e0352b', 6);
    ctx.restore(); }
} });

// I — the battle of domains
SHOTS.push({ start: 24.9, end: 27.8, tr: 'whip', draw(ctx, lt, t) {
  const push = Math.sin(lt * 3.2) * 60;
  const edge = y => 540 + push + Math.sin(y * .012 + t * 9) * 30;
  ctx.save(); screen(ctx); ctx.beginPath(); ctx.moveTo(-10, -10); for (let y = 0; y <= H; y += 40) ctx.lineTo(edge(y), y); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip(); voidBG(ctx, t); ctx.restore();
  ctx.save(); screen(ctx); ctx.beginPath(); ctx.moveTo(W + 10, -10); for (let y = 0; y <= H; y += 40) ctx.lineTo(edge(y), y); ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.clip(); ctx.translate(260, 0); shrineBG(ctx, t); ctx.restore();
  screen(ctx); ctx.beginPath(); for (let y = 0; y <= H; y += 40) y ? ctx.lineTo(edge(y), y) : ctx.moveTo(edge(y), y); ctx.lineWidth = 26; ctx.strokeStyle = '#fff'; ctx.stroke();
  const R = rng(Math.floor(t * 15)); for (let i = 0; i < 6; i++) { const y = R() * H; burst(ctx, edge(y), y, 30 + R() * 40, 8, '#fff6c4', i); }
  const cam = camOf(t, 540, 1000, 1.0 + lt * .04, 5); applyCam(ctx, cam, 1);
  drawStick(ctx, C2(GOJO, { x: 220, y: 1560, s: 560, arms: { L: [.4, -.2], R: { ik: [.12, -.9] } }, face: { look: [1, 0], mouth: 'teeth', browAng: .3 } }));
  drawStick(ctx, C2(SUKUNA, { x: 860, y: 1560, s: 580, belly: .5 + .5 * Math.sin(t * 18), arms: { L: { ik: [.05, -.62] }, R: { ik: [.05, -.62] } }, arms2: { L: [1.5, -.7], R: [1.5, -.7] }, face: { look: [-1, 0], mouth: 'grin', browAng: .4 } }));
  tag(ctx, 'BATALHA DE DOMÍNIOS', 540, 330, '#fff', lt, 1.66);
} });

// J1 — Shinjuku flashback: the domain clashes were a tie
SHOTS.push({ start: 27.8, end: 31.4, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#3b3357', '#9b8aa8');
  const cam = camOf(t, 540, 960, 1.0 + lt * .03, 3); applyCam(ctx, cam, 1);
  const push = Math.sin(lt * 4) * 40;
  voidSphere(ctx, 330 + push, 900, 300, t, 0, 1, 4);
  ctx.save(); circle(ctx, 750 + push, 900, 300); ctx.clip(); ctx.translate(750 + push - 540, 900 - 960); ctx.scale(1, 1); shrineBG(ctx, t); ctx.restore();
  applyCam(ctx, cam, 1); circle(ctx, 750 + push, 900, 300); ctx.lineWidth = 8; ctx.strokeStyle = '#ffb3a8'; ctx.stroke();
  burst(ctx, 540 + push, 900, 110 + Math.sin(t * 30) * 15, 12, '#fff6c4', Math.floor(t * 10));
  const eq = popIn(lt, 1.96, .3);
  sepia(ctx, .9);
  if (eq > 0) { ctx.save(); ctx.translate(540, 1600); ctx.scale(eq, eq); text(ctx, '=', 0, 0, 300, '#fff', INK, 30); text(ctx, '=', 0, 0, 300, '#fff', INK, 0); ctx.restore(); }
  tag(ctx, 'SHINJUKU', 540, 330, '#fff', lt, .05); tag(ctx, 'EMPATE', 540, 1150, '#ffd23a', lt, 1.96);
} });

// J2 — Gojo wins the fist fight inside three minutes
SHOTS.push({ start: 31.4, end: 34.9, tr: 'cut', draw(ctx, lt, t) {
  const hits = [.45, 1.0, 1.6, 2.2, 2.8]; let last = -1; hits.forEach(h => { if (lt >= h) last = h; });
  const hs = last >= 0 ? hitShake(lt, last, 26, .25) : [0, 0];
  applyCam(ctx, camOf(t, 540 + hs[0], 1050 + hs[1], 1.0, 3), .3); cityBG(ctx, t, { top: '#2b2350', bot: '#f08a4b', seed: 29 });
  const cam = camOf(t, 540 + hs[0], 1050 + hs[1], 1.05 + lt * .03, 4); applyCam(ctx, cam, 1);
  const k = last >= 0 ? clamp((lt - last) / .12) : 1; const ext = last >= 0 && lt - last < .25 ? 1 : 0;
  const hitL = hits.indexOf(last) % 2 === 0;
  drawStick(ctx, C2(GOJO, { x: 330, y: 1560, s: 620, lean: .1 * ext, arms: { L: hitL && ext ? { ik: [-.62, -.6] } : [.6, -1.6], R: !hitL && ext ? { ik: [-.62, -.62] } : [.7, -1.8] }, flip: -1,
    prop: (c, kk, h) => fist(c, kk, h, hitL ? 'L' : 'R'), face: { look: [-1, 0], mouth: 'teeth', browAng: .3 } }));
  const recoil = ext ? 40 * (1 - k) : 0;
  drawStick(ctx, C2(MEGUMI, { x: 820 + recoil, y: 1560, s: 620, lean: ext ? .18 : .02, headTilt: ext ? .2 : 0, arms: { L: [.8, -1.2], R: [.6, -.6] }, face: ext ? { eyes: 'x', mouth: 'teeth' } : { look: [-1, 0], mouth: 'frown', browAng: .4 } }));
  if (ext) burst(ctx, 735, 1560 - .62 * 620, 110 * (1 - k * .4), 11, '#fff6c4', Math.floor(last * 10));
  sepia(ctx, .9);
  screen(ctx); timerBox(ctx, 540, 380, 1, 179 - lt * 18, 0);
} });

// K — the Mahoraga problem: Domain Amplification switched off
SHOTS.push({ start: 34.9, end: 39.7, tr: 'whip', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#3b3357', '#9b8aa8');
  const cam = camOf(t, 540, 1000, 1.0 + lt * .03, 3); applyCam(ctx, cam, 1);
  const turn = kf(lt, [[3.7, 0], [4.0, 1, backOut]]);
  wheel(ctx, 540, 640, 115, turn * TAU / 8 + Math.sin(t * 2) * .02);
  if (lt > 3.7) { const p = clamp((lt - 3.7) / .5); ctx.save(); ctx.globalAlpha = 1 - p; circle(ctx, 540, 640, 160 + p * 120); ctx.lineWidth = 14; ctx.strokeStyle = '#fff6c4'; ctx.stroke(); ctx.restore(); }
  drawStick(ctx, C2(MEGUMI, { x: 540, y: 1670, s: 760, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { look: [0, -.4], mouth: lt > 1.6 ? 'frown' : 'smirk', browAng: .4 } }));
  const off = 1 - kf(lt, [[1.55, 0], [1.8, 1, backOut]]);
  sepia(ctx, .9);
  screen(ctx); toggle(ctx, 540, 330, .85, off, 'AMPLIFICAÇÃO');
} });

// L — True Form: that plan is gone (the wheel shatters)
SHOTS.push({ start: 39.7, end: 42.0, tr: 'whip', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#2a0306', '#e0352b'); speedLines(ctx, 540, 800, t, 'rgba(255,220,200,.15)', 40, 400, 6);
  const brk = 1.85;
  const hs = hitShake(lt, brk, 30, .3);
  const cam = camOf(t, 540 + hs[0], 1000 + hs[1], 1.0 + lt * .05, 3); applyCam(ctx, cam, 1);
  if (lt < brk) wheel(ctx, 780, kf(lt, [[0, -200], [.5, 560, easeOut]]), 110, t);
  shards(ctx, 780, 560, 110, clamp((lt - brk) / .7), '#e9d9a6', 3);
  drawStick(ctx, C2(SUKUNA, { x: 460, y: 1700, s: 950, belly: .3, arms: { L: [.5, -.3], R: lt > brk - .2 ? [2.4, .1] : [1.5, -.6] }, arms2: { L: [.9, -1.8], R: [.9, -1.8] },
    face: { look: [.8, -.4], mouth: lt > brk ? 'grin' : 'smirk', browAng: .4 } }));
  if (lt > brk) burst(ctx, 780, 560, 150 * (1 - clamp((lt - brk) * 3)), 12, '#fff6c4');
  flash(ctx, lt, brk, .15);
  tag(ctx, 'FORMA VERDADEIRA', 540, 300, '#ffd23a', lt, .1);
} });

// M1 — four arms and amplification always on
SHOTS.push({ start: 42.0, end: 45.6, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#2a0306', '#c4231e');
  const cam = camOf(t, 540, 1000, 1.0 + lt * .03, 3); applyCam(ctx, cam, 1);
  aura(ctx, 540, 1760, 1100, t, 'rgba(255,60,50,.4)', .9, 8);
  drawStick(ctx, C2(SUKUNA, { x: 540, y: 1760, s: 1000, belly: .4 + .3 * Math.sin(t * 8), arms: { L: [.9, -2.2], R: [.9, -2.2] }, arms2: { L: [1.6, -1.3], R: [1.6, -1.3] }, face: { mouth: 'grin', look: [0, 0] } }));
  screen(ctx); const on = kf(lt, [[1.1, 0], [1.35, 1, backOut]]); toggle(ctx, 540, 440, .9, on, 'AMPLIFICAÇÃO');
  const lock = popIn(lt, 2.5);
  if (lock > 0) { ctx.save(); ctx.translate(720, 380); ctx.scale(lock, lock); ctx.beginPath(); ctx.arc(0, -30, 34, Math.PI, 0); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#c9ced8'; ctx.stroke(); rrect(ctx, -50, -30, 100, 80, 14); fillStroke(ctx, '#ffd23a', 9); circle(ctx, 0, 5, 10); ctx.fillStyle = INK; ctx.fill(); ctx.restore(); }
} });

// M2 — Gojo cannot break him in time
SHOTS.push({ start: 45.6, end: 49.1, tr: 'whip', draw(ctx, lt, t) {
  applyCam(ctx, camOf(t, 540, 1050, 1.0, 3), .3); cityBG(ctx, t, { top: '#1b1640', bot: '#c0505a', seed: 41 });
  const hits = [.3, .65, 1.0, 1.35, 1.7, 2.05, 2.4]; let last = -1; hits.forEach(h => { if (lt >= h) last = h; });
  const hs = last >= 0 ? hitShake(lt, last, 18, .2) : [0, 0];
  const cam = camOf(t, 540 + hs[0], 1050 + hs[1], 1.05 + lt * .03, 4); applyCam(ctx, cam, 1);
  const ext = last >= 0 && lt - last < .2; const alt = hits.indexOf(last) % 2 === 0;
  drawStick(ctx, C2(GOJO, { x: 300, y: 1560, s: 600, flip: -1, lean: ext ? .1 : 0, arms: { L: ext && alt ? { ik: [-.6, -.62] } : [.6, -1.6], R: ext && !alt ? { ik: [-.6, -.62] } : [.7, -1.8] },
    prop: (c, k, h) => fist(c, k, h, alt ? 'L' : 'R'), face: { look: [-1, 0], mouth: lt > 2.6 ? 'frown' : 'teeth', browAng: lt > 2.6 ? -.3 : .3 } }));
  drawStick(ctx, C2(SUKUNA, { x: 800, y: 1560, s: 640, belly: .3, arms: { L: { ik: [-.32, -.62] }, R: [.6, -1.9] }, arms2: { L: { ik: [-.3, -.5] }, R: [.9, -1.4] }, face: { look: [-1, 0], mouth: 'smirk', browAng: .3 } }));
  if (ext) { burst(ctx, 590, 1560 - .62 * 600, 70, 10, '#fff', Math.floor(last * 10)); line(ctx, 600, 1560 - .74 * 600, 600, 1560 - .5 * 600, 10, '#fff'); }
  if (lt > 2.3) { sweat(ctx, 430, 1560 - .9 * 600, 30, clamp((lt - 2.3) * 3)); sweat(ctx, 180, 1560 - .8 * 600, 24, clamp((lt - 2.6) * 3)); }
  const left = Math.max(0, 30 - lt * 10.6);
  screen(ctx); timerBox(ctx, 540, 380, 1 + (left <= 0 ? .1 * Math.sin(t * 30) : 0), left, left < 10 ? 1 : 0);
  if (left <= 0) flash(ctx, lt, 3.05, .3, '255,60,60');
} });

// N — the Shrine cuts the Void from outside, again and again
SHOTS.push({ start: 49.1, end: 54.9, tr: 'whip', draw(ctx, lt, t) {
  shrineBG(ctx, t);
  const cam = camOf(t, 540, 960, 1.0 + lt * .02, 4); applyCam(ctx, cam, 1);
  const breaks = [2.9, 4.6]; const reform = [3.45, 5.2];
  let r = 330, crk = clamp((lt - .5) / 2.4), alive = true, shardP = -1;
  if (lt >= breaks[0] && lt < reform[0]) { alive = false; shardP = (lt - breaks[0]) / .6; }
  if (lt >= reform[0]) { r = 330 * backOut(clamp((lt - reform[0]) / .3)); crk = clamp((lt - reform[0] - .2) / 1.0); }
  if (lt >= breaks[1] && lt < reform[1]) { alive = false; shardP = (lt - breaks[1]) / .6; }
  if (lt >= reform[1]) { r = 330 * backOut(clamp((lt - reform[1]) / .3)); crk = clamp((lt - reform[1] - .1) / .6) * .5; }
  const sx = 540, sy = 800;
  if (alive) { voidSphere(ctx, sx, sy, r, t, crk, 1, 4); drawStick(ctx, C2(GOJO, { x: sx, y: sy + 140, s: 220, shadow: false, arms: { L: [.4, -.2], R: { ik: [.12, -.9] } }, face: { mouth: crk > .5 ? 'teeth' : 'flat', browAng: .3 } })); }
  shards(ctx, sx, sy, 330, shardP, '#a8e4ff', Math.floor(lt));
  slashStorm(ctx, lt, .3, 9, 46, [sx - 460, sy - 460, 920, 920], 11);
  flash(ctx, lt, breaks[0], .2); flash(ctx, lt, breaks[1], .2);
  tag(ctx, 'SANTUÁRIO MALEVOLENTE', 540, 300, '#fff', lt, .05);
  tag(ctx, 'SEM BARREIRA', 540, 1560, '#ffd23a', lt, 1.4);
} });

// O — Gojo's brain gives out, Infinity drops
SHOTS.push({ start: 54.9, end: 58.1, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#0b1636', '#3c5a9a');
  const cam = camOf(t, 540, 1000, 1.0 + lt * .05, 4); applyCam(ctx, cam, 1);
  const col = clamp((lt - .5) / 1.5); const drop = 2.6;
  if (lt < drop) { ellipse(ctx, 540, 1300, 470, 620); ctx.lineWidth = 16; ctx.strokeStyle = `rgba(160,230,255,${.7 + .3 * Math.sin(t * 20) * col})`; ctx.stroke(); }
  shards(ctx, 540, 1300, 500, (lt - drop) / .8, '#a8e4ff', 8);
  drawStick(ctx, C2(GOJO, { x: 540, y: 1820, s: 1050, headTilt: Math.sin(t * 7) * .05 * col, lean: lt > drop ? .05 : 0,
    arms: { L: [.3 + col * .3, -.2], R: [.3 + col * .3, -.2] }, face: col > .8 ? { eyes: 'spiral', mouth: 'teeth' } : { mouth: 'teeth', browAng: -.3, browUp: 1 } }));
  for (let i = 0; i < 3; i++) puff(ctx, 400 + i * 140, 1820 - 1.05 * 1000 - 90 - ((lt * 160 + i * 70) % 220), 50 + i * 10, t, '#e6e6ee', 50 + i, col * .9);
  screen(ctx); brain(ctx, 540, 340, .95, t, col);
  sweat(ctx, 770, 1820 - .82 * 1050, 36, col);
  tag(ctx, 'INFINITO CAI', 540, 1580, '#9fe6ff', lt, drop);
  flash(ctx, lt, drop, .15);
} });

// P — the finisher: Shrine cuts, then Fuga's flame arrow
SHOTS.push({ start: 58.1, end: 61.8, tr: 'cut', draw(ctx, lt, t) {
  shrineBG(ctx, t, 1);
  const fire = 2.85, hit = 3.2;
  const hs = hitShake(lt, hit, 46, .5);
  const cam = camOf(t, 540 + hs[0], 1000 + hs[1], 1.0 + lt * .03, 4); applyCam(ctx, cam, 1);
  slashStorm(ctx, lt, .9, 10, 10, [60, 800, 380, 500], 21);
  if (lt < hit) drawStick(ctx, C2(GOJO, { x: 200, y: 1560, s: 420, arms: { L: [.6, -1.2], R: [.6, -1.2] }, face: { look: [1, 0], mouth: 'teeth', browAng: -.3 } }));
  const draw = kf(lt, [[1.6, 0], [2.4, 1]]);
  drawStick(ctx, C2(SUKUNA, { x: 820, y: 1560, s: 640, belly: .6, arms: { L: { ik: [lerp(-.3, -.55, draw), -.62] }, R: { ik: [lerp(-.25, .05, draw), -.6] } }, arms2: { L: [1.3, -1.0], R: [1.3, -1.0] },
    face: { look: [-1, 0], mouth: 'grin', browAng: .45 } }));
  if (lt > 1.6 && lt < fire) { flame(ctx, 820 - .55 * 640, 1560 - .62 * 640, 60 + draw * 30, t, 3); }
  if (lt >= fire && lt < hit) { const p = (lt - fire) / (hit - fire); fireArrow(ctx, lerp(470, 230, p), lerp(1160, 1260, p), Math.PI + .1, 300, t); }
  if (lt >= hit) { const p = clamp((lt - hit) / .6); flame(ctx, 220, 1250, 200 + p * 520, t, 9, 1 - clamp((lt - hit - .3) / .4) * .6); }
  flash(ctx, lt, hit, .25, '255,200,120');
  tag(ctx, 'FUGA', 540, 300, '#ffb347', lt, fire - .1);
} });

// Q — result: Sukuna wins
SHOTS.push({ start: 61.8, end: 63.9, tr: 'whip', draw(ctx, lt, t) {
  screen(ctx); grad(ctx, '#3a0206', '#ff4a2a');
  ctx.save(); ctx.translate(540, 900); ctx.rotate(t * .2); for (let i = 0; i < 16; i++) { ctx.rotate(TAU / 16); path(ctx, [[0, 0], [-120, -1800], [120, -1800]]); ctx.fillStyle = i % 2 ? 'rgba(255,220,140,.18)' : 'rgba(255,255,255,.05)'; ctx.fill(); } ctx.restore();
  const cam = camOf(t, 540, 1000, 1.0 + lt * .04, 3); applyCam(ctx, cam, 1);
  drawStick(ctx, C2(GOJO, { x: 650, y: 1700, s: 300, lean: 1.45, shadowScale: 1.4, arms: { L: [.2, -.1], R: [.2, -.1] }, face: { eyes: 'x', mouth: 'o' } }));
  const up = popIn(lt, .1, .4);
  drawStick(ctx, C2(SUKUNA, { x: 400, y: 1700, s: 980, belly: .6 + .4 * Math.sin(t * 9), arms: { L: [lerp(.4, 2.6, up), .3], R: [lerp(.4, 2.6, up), .3] }, arms2: { L: [lerp(.4, 1.5, up), -.3], R: [lerp(.4, 1.5, up), -.3] }, face: { mouth: 'grin', eyes: 'normal' } }));
  const v = popIn(lt, 1.05, .35);
  if (v > 0) { screen(ctx); ctx.save(); ctx.translate(540, 330); ctx.scale(v, v); ctx.rotate(-.04); rrect(ctx, -470, -110, 940, 220, 30); fillStroke(ctx, '#ffd23a', 14); text(ctx, 'VITÓRIA: SUKUNA', 0, 8, 96, '#e0352b', INK, 14); text(ctx, 'VITÓRIA: SUKUNA', 0, 8, 96, '#e0352b', INK, 0); ctx.restore(); }
  flash(ctx, lt, 1.05, .15);
} });

// R — CTA: do you agree? comment below
SHOTS.push({ start: 63.9, end: 72.2, tr: 'cut', draw(ctx, lt, t) {
  screen(ctx);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 540, H); ctx.clip(); grad(ctx, '#0d2a6e', '#4fb6ff'); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(540, 0, 540, H); ctx.clip(); grad(ctx, '#3a0206', '#e0352b'); ctx.restore();
  const cam = camOf(t, 540, 1000, 1.0 + lt * .015, 3); applyCam(ctx, cam, 1);
  const think = lt > 1.0 && lt < 4.4;
  drawStick(ctx, C2(GOJO, { x: 270, y: 1560, s: 600, arms: { L: [.3, -.1], R: think ? { ik: [.09, -.64] } : [.3, -.1] }, face: { look: [.6, -.2], mouth: think ? 'flat' : 'smirk', browOne: 1 } }));
  drawStick(ctx, C2(SUKUNA, { x: 810, y: 1560, s: 600, belly: .3, arms: { L: [.9, -2.2], R: [.9, -2.2] }, arms2: { L: [1.5, -.7], R: [1.5, -.7] }, face: { look: [-.6, -.2], mouth: 'grin' } }));
  screen(ctx);
  const q = popIn(lt, .4, .35);
  if (q > 0 && lt < 4.4) { ctx.save(); ctx.translate(540, 470); ctx.scale(q, q); ctx.rotate(Math.sin(t * 4) * .08); text(ctx, '?', 0, 0, 380, '#ffd23a', INK, 34); text(ctx, '?', 0, 0, 380, '#ffd23a', INK, 0); ctx.restore(); }
  const c = popIn(lt, 4.4, .35);
  if (c > 0) { ctx.save(); ctx.translate(540, 420); ctx.scale(c, c); commentIcon(ctx, 0, 0, 1.2, t); ctx.restore(); banner(ctx, 'COMENTA!', 540, 680, 100, '#ffd23a', -.03, c); downArrow(ctx, 540, 1640, .9 * c, t); }
} });
