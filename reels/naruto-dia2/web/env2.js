// ---------- props for "Dia 2": night forest, flooded mindscape corridor, giant cage, fox, seal, choice cards ----------
const ORANGE = '#f07a1a', FOX = '#e8561c', FOX_D = '#b8380f', FOX_L = '#ff9a3c';
const CHAKRA_B = ['#bff4ff', '#56c8ff', '#1f7fe0'], CHAKRA_R = ['#ffe0a0', '#ff5a1f', '#b3100c'];

// ---- night forest ----
function pine(ctx, x, base, h, col, trunk) {
  const w = h * .42;
  ctx.fillStyle = trunk || col; ctx.fillRect(x - w * .07, base - h * .25, w * .14, h * .25);
  for (let i = 0; i < 4; i++) {
    const yb = base - h * .18 - i * h * .2, ww = w * (1 - i * .2);
    path(ctx, [[x - ww / 2, yb], [x, yb - h * .38], [x + ww / 2, yb]]); ctx.fillStyle = col; ctx.fill();
  }
}
function drawForest(ctx, cam, t, o = {}) {
  const night = o.night == null ? 1 : o.night;
  applyCam(ctx, cam, .05);
  drawSky(ctx, mix('#3ea6ee', '#0b1432', night), mix('#c9ecfb', '#2b4677', night), -400, 1300);
  // stars + moon
  const R = rng(4);
  for (let i = 0; i < 70; i++) { const x = R() * 1400 - 160, y = R() * 900 - 200, tw = .5 + .5 * Math.sin(t * 3 + i); circle(ctx, x, y, 2 + R() * 2.5); ctx.fillStyle = `rgba(255,255,230,${.5 * tw * night})`; ctx.fill(); }
  applyCam(ctx, cam, .08);
  const mx = o.moon ? o.moon[0] : 800, my = o.moon ? o.moon[1] : 330;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(mx, my, 40, mx, my, 330); g.addColorStop(0, 'rgba(200,220,255,.45)'); g.addColorStop(1, 'rgba(200,220,255,0)'); ctx.fillStyle = g; ctx.fillRect(mx - 340, my - 340, 680, 680); ctx.restore();
  circle(ctx, mx, my, 85); ctx.fillStyle = '#fbf4d8'; ctx.fill(); circle(ctx, mx + 22, my - 18, 18); ctx.fillStyle = '#ebe0bc'; ctx.fill(); circle(ctx, mx - 28, my + 24, 12); ctx.fill();
  const ground = o.ground || 1480;
  // far, mid tree layers
  applyCam(ctx, cam, .25);
  for (let i = 0; i < 12; i++) pine(ctx, -250 + i * 140 + (i % 3) * 30, ground - 260, 620 + (i % 4) * 90, '#18305a');
  applyCam(ctx, cam, .5);
  for (let i = 0; i < 9; i++) pine(ctx, -300 + i * 200 + (i % 2) * 60, ground - 120, 760 + (i % 3) * 120, '#12264a');
  applyCam(ctx, cam, 1);
  // ground
  ctx.beginPath(); ctx.moveTo(-1500, ground); for (let x = -1500; x <= 2600; x += 120) ctx.lineTo(x, ground - 18 * Math.sin(x * .01)); ctx.lineTo(2600, 4000); ctx.lineTo(-1500, 4000); ctx.closePath();
  ctx.fillStyle = '#1d3a2e'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  for (let i = 0; i < 26; i++) { const gx = -400 + i * 85, gy = ground + 30 + (i % 4) * 70; path(ctx, [[gx - 14, gy], [gx - 4, gy - 34], [gx + 2, gy], [gx + 10, gy - 28], [gx + 16, gy]]); ctx.fillStyle = '#2b5240'; ctx.fill(); }
  // fireflies
  for (let i = 0; i < 14; i++) { const fx = 80 + (i * 173) % 960 + Math.sin(t * .9 + i) * 40, fy = ground - 120 - (i * 97) % 500 + Math.cos(t * 1.3 + i * 2) * 30; const a = .4 + .6 * Math.max(0, Math.sin(t * 2.2 + i * 1.7)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; circle(ctx, fx, fy, 16); ctx.fillStyle = `rgba(230,255,140,${.18 * a})`; ctx.fill(); circle(ctx, fx, fy, 5); ctx.fillStyle = `rgba(250,255,190,${a})`; ctx.fill(); ctx.restore(); }
}
// big foreground trunks (call with depth > 1 cam)
function nearTrunk(ctx, x, w, col = '#0e1a30') {
  rrect(ctx, x - w / 2, -800, w, 3600, 20); fillStroke(ctx, col, 7);
  ctx.save(); rrect(ctx, x - w / 2, -800, w, 3600, 20); ctx.clip(); ctx.fillStyle = 'rgba(120,160,255,.10)'; ctx.fillRect(x - w / 2, -800, w * .3, 3600); ctx.restore();
}

// ---- flooded corridor (one-point perspective) ----
function drawSewer(ctx, cam, t, o = {}) {
  const vx = 540, bl = o.bl || 360, br = o.br || 720, bt = o.bt || 560, bb = o.bb || 1000;
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#071010'; ctx.fillRect(-2000, -2000, 5080, 6000);
  const X0 = -900, X1 = 1980, Y0 = -700, Y1 = 2700;
  const wall = (pts, c0, c1, gx0, gy0, gx1, gy1) => { path(ctx, pts); const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); };
  wall([[X0, Y0], [bl, bt], [bl, bb], [X0, Y1]], '#3d6764', '#0e1c1d', X0, 0, bl, 0);
  wall([[X1, Y0], [br, bt], [br, bb], [X1, Y1]], '#3a615f', '#0e1c1d', X1, 0, br, 0);
  wall([[X0, Y0], [X1, Y0], [br, bt], [bl, bt]], '#2c4d4c', '#0d1919', 0, Y0, 0, bt);
  // back opening (darkness)
  ctx.fillStyle = '#030707'; ctx.fillRect(bl, bt, br - bl, bb - bt);
  // brick seams on walls
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(10,20,20,.55)';
  for (let k = 1; k < 6; k++) { const f = k / 6; ctx.beginPath(); ctx.moveTo(X0, lerp(Y0, Y1, f)); ctx.lineTo(bl, lerp(bt, bb, f)); ctx.moveTo(X1, lerp(Y0, Y1, f)); ctx.lineTo(br, lerp(bt, bb, f)); ctx.stroke(); }
  // depth ribs (arches) moving toward the camera
  const sp = o.speed || 0;
  for (let i = 0; i < 6; i++) {
    let d = ((i / 6) + t * sp * .1) % 1; const z = Math.pow(d, 2.2);
    const l = lerp(bl, X0 + 300, z), r = lerp(br, X1 - 300, z), tp = lerp(bt, Y0 + 300, z), bt2 = lerp(bb, Y1 - 300, z);
    ctx.lineWidth = 4 + 22 * z; ctx.strokeStyle = `rgba(8,16,16,${.25 + .5 * z})`;
    ctx.beginPath(); ctx.moveTo(l, bt2); ctx.lineTo(l, tp); ctx.lineTo(r, tp); ctx.lineTo(r, bt2); ctx.stroke();
  }
  // pipes along both walls
  for (const [side, yy, c] of [[-1, .32, '#6d7f6a'], [-1, .42, '#566b5b'], [1, .28, '#6d7f6a']]) {
    const xa = side < 0 ? X0 : X1, xb = side < 0 ? bl : br;
    const ya = lerp(Y0, Y1, yy), yb = lerp(bt, bb, yy);
    ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.lineWidth = 70; ctx.strokeStyle = INK; ctx.lineCap = 'butt'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.lineWidth = 56; ctx.strokeStyle = c; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xa, ya - 14); ctx.lineTo(xb, yb - 4); ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.stroke(); ctx.lineCap = 'round';
  }
  // water
  const wl = o.waterY || 0; // raise water
  const wt = bb - 60 - wl * .2;
  path(ctx, [[bl - 40, wt], [br + 40, wt], [X1, Y1 - 900], [X1, Y1], [X0, Y1], [X0, Y1 - 900]]);
  const g = ctx.createLinearGradient(0, wt, 0, 2000); g.addColorStop(0, '#0e2b2e'); g.addColorStop(1, '#2f7c80'); ctx.fillStyle = g; ctx.fill();
  // reflections + ripples
  const amp = 1 + (o.tremble || 0) * 6;
  ctx.save(); path(ctx, [[bl - 40, wt], [br + 40, wt], [X1, Y1 - 900], [X1, Y1], [X0, Y1], [X0, Y1 - 900]]); ctx.clip();
  for (let i = 0; i < 18; i++) {
    const yy = wt + 30 + Math.pow(i / 18, 1.6) * 1500; const ww = 80 + (i % 5) * 60 + yy * .15; const xx = 540 + Math.sin(i * 2.3) * (100 + yy * .4) + Math.sin(t * 1.5 + i) * 20;
    ctx.beginPath(); ctx.ellipse(xx, yy + Math.sin(t * 9 + i) * amp * (o.tremble ? 3 : 0), ww, 5 + yy * .006 * amp, 0, 0, TAU); ctx.lineWidth = 3 + yy * .003; ctx.strokeStyle = `rgba(160,230,220,${.12 + (o.tremble || 0) * .2})`; ctx.stroke();
  }
  if (o.glow) { const gg = ctx.createRadialGradient(540, wt + 50, 20, 540, wt + 200, 900); gg.addColorStop(0, `rgba(255,70,30,${.35 * o.glow})`); gg.addColorStop(1, 'rgba(255,70,30,0)'); ctx.fillStyle = gg; ctx.fillRect(-500, wt, 2100, 2500); }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(bl - 40, wt); ctx.lineTo(br + 40, wt); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(160,230,220,.3)'; ctx.stroke();
  // drip
  for (let i = 0; i < 3; i++) { const ph = (t * .6 + i * .37) % 1; const dx = 200 + i * 330, dy = lerp(180, 1500, easeIn(ph)); sweat(ctx, dx, dy, 16, ph < .95 ? .8 : 0); }
}
function ripples(ctx, x, y, t0, t, n = 3, sc = 1, col = 'rgba(190,240,235,') {
  for (let i = 0; i < n; i++) { const k = (t - t0 - i * .18); if (k < 0 || k > 1.4) continue; const r = k * 320 * sc; ellipse(ctx, x, y, r, r * .22); ctx.lineWidth = 6 * (1 - k / 1.4) + 1; ctx.strokeStyle = col + (1 - k / 1.4) * .8 + ')'; ctx.stroke(); }
}
function splash(ctx, x, y, k, s = 1) {
  if (k <= 0 || k >= 1) return; const R = rng(9);
  for (let i = 0; i < 16; i++) { const a = -Math.PI * (.1 + R() * .8); const v = (300 + R() * 500) * s; const px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 900 * k * k * s; circle(ctx, px, py, (14 + R() * 14) * s * (1 - k * .5)); fillStroke(ctx, '#bdeff0', 4); }
  ctx.beginPath(); ctx.ellipse(x, y, 260 * s * (.4 + k), 40 * s, 0, 0, TAU); ctx.fillStyle = `rgba(200,245,240,${.6 * (1 - k)})`; ctx.fill();
}

// ---- cage + seal ----
function drawSeal(ctx, x, y, s, curl = 0, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 260); g.addColorStop(0, `rgba(255,90,40,${.5 * glow})`); g.addColorStop(1, 'rgba(255,90,40,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -300, 600, 600); ctx.restore(); }
  const w = 120, h = 300;
  const shape = () => { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2, h / 2 - 60 * curl); ctx.quadraticCurveTo(w / 2 - 10 * curl, h / 2 - 10 * curl, w / 2 - 70 * curl, h / 2 + 10 * curl); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); };
  shape(); fillStroke(ctx, '#f4ead2', 6);
  ctx.save(); shape(); ctx.clip(); ctx.fillStyle = 'rgba(140,90,40,.14)'; ctx.fillRect(10, -h, w, h * 2); ctx.restore();
  rrect(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24 - 40 * curl, 4); ctx.lineWidth = 5; ctx.strokeStyle = '#c8281e'; ctx.stroke();
  // a made-up sigil: ring, cross bars, dots
  circle(ctx, 0, -40, 28); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  line(ctx, -26, 20, 26, 20, 7); line(ctx, 0, 0, 0, 80, 7); line(ctx, -20, 55, 20, 55, 6);
  circle(ctx, 0, -40, 7); ctx.fillStyle = INK; ctx.fill();
  if (curl > 0) { // lifted corner (back of paper)
    ctx.beginPath(); ctx.moveTo(w / 2, h / 2 - 60 * curl); ctx.quadraticCurveTo(w / 2 + 30 * curl, h / 2 + 10 * curl, w / 2 - 70 * curl, h / 2 + 10 * curl); ctx.quadraticCurveTo(w / 2 - 10 * curl, h / 2 - 10 * curl, w / 2, h / 2 - 60 * curl); fillStroke(ctx, '#d8c9a4', 5);
  }
  ctx.restore();
}
function drawCage(ctx, cx, top, bottom, o = {}) {
  const n = o.n || 9, gap = o.gap || 150, bw = o.bw || 62;
  const x0 = cx - (n - 1) / 2 * gap;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * gap;
    rrect(ctx, x - bw / 2, top, bw, bottom - top, 10); fillStroke(ctx, '#3c4d52', 7);
    ctx.save(); rrect(ctx, x - bw / 2, top, bw, bottom - top, 10); ctx.clip(); ctx.fillStyle = 'rgba(200,240,240,.16)'; ctx.fillRect(x - bw / 2 + 8, top, 12, bottom - top); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x + bw / 4, top, bw, bottom - top); ctx.restore();
  }
  // cross beam at top
  rrect(ctx, x0 - gap, top - 40, (n + 1) * gap, 90, 10); fillStroke(ctx, '#33434a', 7);
  if (o.seal !== false) drawSeal(ctx, cx, o.sealY || lerp(top, bottom, .38), o.sealS || 1, o.curl || 0, o.sealGlow || 0);
}

// ---- the fox ----
function foxEye(ctx, x, y, s, open, side, glow = 1, look = [0, 0]) {
  if (open <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(side * -.32); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 260); g.addColorStop(0, `rgba(255,60,20,${.55 * glow * open})`); g.addColorStop(1, 'rgba(255,40,10,0)'); ctx.fillStyle = g; ctx.fillRect(-280, -280, 560, 560); ctx.restore(); }
  const shape = () => { ctx.beginPath(); ctx.moveTo(-100, 8); ctx.quadraticCurveTo(-10, -70 * open, 100, -14 * open); ctx.quadraticCurveTo(10, 60 * open, -100, 8); ctx.closePath(); };
  shape(); const g = ctx.createRadialGradient(0, 0, 5, 0, 0, 100); g.addColorStop(0, '#ffcf4a'); g.addColorStop(.55, '#ff4a1a'); g.addColorStop(1, '#a8100c'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); shape(); ctx.clip(); ellipse(ctx, look[0] * 30, look[1] * 10, 11, 52); ctx.fillStyle = '#120608'; ctx.fill(); ctx.restore();
  shape(); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}
function drawFoxEyes(ctx, x, y, s, open, glow = 1, look) { foxEye(ctx, x - 190 * s, y, s, open, -1, glow, look); foxEye(ctx, x + 190 * s, y, s, open, 1, glow, look); }
function drawTails(ctx, x, y, s, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 9; i++) {
    const base = (i - 4) * .33, sw = Math.sin(t * 1.8 + i * .9) * .18;
    const ang = base + sw - Math.PI / 2; const L = 900 * s;
    const ex = x + Math.cos(ang) * L, ey = y + Math.sin(ang) * L;
    const cx = x + Math.cos(ang - .5) * L * .6, cy = y + Math.sin(ang - .5) * L * .6;
    ctx.beginPath(); ctx.moveTo(x - 40 * s, y); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.quadraticCurveTo(cx + 160 * s, cy + 40 * s, x + 40 * s, y); ctx.closePath();
    fillStroke(ctx, i % 2 ? FOX_D : FOX, 7);
  }
  ctx.restore();
}
function drawFoxHead(ctx, x, y, s, o = {}) {
  const roar = o.roar || 0, t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // ears
  for (const sd of [-1, 1]) { path(ctx, [[sd * 330, -240], [sd * 520, -760], [sd * 120, -380]]); fillStroke(ctx, FOX, 12); path(ctx, [[sd * 310, -300], [sd * 470, -640], [sd * 170, -390]]); ctx.fillStyle = '#5a1408'; ctx.fill(); }
  // head + cheek tufts
  ctx.beginPath(); ctx.moveTo(-560, -60);
  ctx.quadraticCurveTo(-520, -420, 0, -440); ctx.quadraticCurveTo(520, -420, 560, -60);
  ctx.lineTo(640, 60); ctx.lineTo(520, 90); ctx.lineTo(600, 210); ctx.lineTo(430, 220); ctx.quadraticCurveTo(250, 420, 0, 460);
  ctx.quadraticCurveTo(-250, 420, -430, 220); ctx.lineTo(-600, 210); ctx.lineTo(-520, 90); ctx.lineTo(-640, 60); ctx.closePath();
  fillStroke(ctx, FOX, 12);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(120,20,0,.25)'; ctx.fillRect(120, -600, 800, 1200); ctx.fillStyle = 'rgba(255,200,120,.25)'; ellipse(ctx, -220, -260, 200, 80, -.3); ctx.fill(); ctx.restore();
  // eye markings
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 80, -90); ctx.quadraticCurveTo(sd * 220, -170, sd * 430, -250); ctx.quadraticCurveTo(sd * 260, -100, sd * 90, -40); ctx.closePath(); ctx.fillStyle = '#3a0c06'; ctx.fill(); }
  // snout + mouth
  const mo = roar;
  if (mo > .02) {
    ctx.beginPath(); ctx.moveTo(-300, 140); ctx.quadraticCurveTo(0, 120, 300, 140); ctx.quadraticCurveTo(220, 140 + 420 * mo, 0, 170 + 440 * mo); ctx.quadraticCurveTo(-220, 140 + 420 * mo, -300, 140); ctx.closePath(); fillStroke(ctx, '#5c0d12', 12);
    ctx.save(); ctx.clip();
    for (let i = -4; i <= 4; i++) { path(ctx, [[i * 70 - 30, 130], [i * 70, 200 + 30 * Math.abs(i % 2)], [i * 70 + 30, 130]]); fillStroke(ctx, '#fff7ea', 5); }
    for (let i = -3; i <= 3; i++) { const by = 170 + 420 * mo - Math.abs(i) * 30 * mo; path(ctx, [[i * 75 - 28, by + 20], [i * 75, by - 60 * mo], [i * 75 + 28, by + 20]]); fillStroke(ctx, '#fff7ea', 5); }
    ellipse(ctx, 0, 170 + 300 * mo, 120, 60 * mo); ctx.fillStyle = '#c0384a'; ctx.fill();
    ctx.restore();
  }
  ctx.beginPath(); ctx.moveTo(-300, 140 - 40 * mo); ctx.quadraticCurveTo(0, -60 - 40 * mo, 300, 140 - 40 * mo); ctx.quadraticCurveTo(0, 190 - 40 * mo, -300, 140 - 40 * mo); fillStroke(ctx, FOX_L, 10);
  ellipse(ctx, 0, 40 - 40 * mo, 70, 44); fillStroke(ctx, '#1a0c0c', 8);
  if (!(mo > .02)) { ctx.beginPath(); ctx.moveTo(-220, 200); ctx.quadraticCurveTo(0, 250 - (o.grin || 0) * -90, 220, 200 - (o.grin || 0) * 80); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); if (o.grin) { path(ctx, [[150, 210], [175, 270], [200, 195]]); fillStroke(ctx, '#fff7ea', 6); } }
  ctx.restore();
  drawFoxEyes(ctx, x, y - 150 * s, s * 1.15 * (o.eyeS || 1), o.open == null ? 1 : o.open, o.glow == null ? 1 : o.glow, o.look);
}
function drawClaw(ctx, x, y, s, ang, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(-100, -500, 0, -720); ctx.quadraticCurveTo(100, -500, 90, 0); ctx.closePath(); fillStroke(ctx, FOX, 10);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(120,20,0,.3)'; ctx.fillRect(20, -800, 200, 900); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-70 + i * 30, -100 - i * 90); ctx.lineTo(-40 + i * 30, -160 - i * 90); ctx.lineWidth = 6; ctx.strokeStyle = FOX_D; ctx.stroke(); } ctx.restore();
  ctx.beginPath(); ctx.moveTo(-34, -680); ctx.quadraticCurveTo(-20, -860, 30, -940); ctx.quadraticCurveTo(30, -820, 36, -680); ctx.closePath(); fillStroke(ctx, '#f6f0e0', 9);
  ctx.restore();
}

// ---- misc ----
function drawScroll(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -110, -46, 220, 92, 10); fillStroke(ctx, '#efe2c0', 6);
  ctx.fillStyle = '#c8281e'; ctx.fillRect(-20, -46, 40, 92); rrect(ctx, -20, -46, 40, 92, 2); fillStroke(ctx, null, 5);
  for (const sd of [-1, 1]) { rrect(ctx, sd * 110 - 18, -60, 36, 120, 14); fillStroke(ctx, '#7a4a2a', 6); }
  ctx.restore();
}
function drawBubble(ctx, x, y, w, h, tail, fill = '#fffaf0') {
  if (tail) { for (let i = 0; i < 3; i++) { const k = (i + 1) / 4; circle(ctx, lerp(tail[0], x, k * .8), lerp(tail[1], y + h / 2, k * .8), 14 + i * 9); fillStroke(ctx, fill, 6); } }
  ctx.beginPath(); const R = rng(12);
  const n = 14; for (let i = 0; i < n; i++) { const a = i / n * TAU; const bx = x + Math.cos(a) * w * .5, by = y + Math.sin(a) * h * .5; ctx.moveTo(bx + w * .14, by); ctx.arc(bx, by, w * (.12 + R() * .04), 0, TAU); }
  ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = fill; ctx.fill();
  ellipse(ctx, x, y, w * .5, h * .5); ctx.fill();
}
function aura(ctx, x, y, s, t, a, pal = CHAKRA_B) {
  // flame tongues around a standing/sitting figure, drawn behind it
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s);
  for (let layer = 0; layer < 3; layer++) {
    const sc = 1 - layer * .22; ctx.beginPath();
    const n = 16;
    for (let i = 0; i <= n; i++) {
      const u = i / n; const ang = Math.PI * (1 + u);
      const fl = .55 + .25 * Math.sin(t * 14 + i * 2.1 + layer) * Math.sin(t * 7 + i);
      const rx = .42 * sc, ry = (.9 + (i % 2 ? fl * .35 : 0)) * sc;
      const px = Math.cos(ang) * rx, py = Math.sin(ang) * ry - .1;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.quadraticCurveTo(.4 * sc, .05, 0, .05); ctx.quadraticCurveTo(-.4 * sc, .05, -.42 * sc, -.1); ctx.closePath();
    ctx.fillStyle = pal[layer]; ctx.globalAlpha = clamp(a) * (layer === 0 ? .35 : .55); ctx.fill();
  }
  ctx.restore();
}
function sparksUp(ctx, x, y, w, t, a, col) {
  if (a <= 0) return; const R = rng(21);
  for (let i = 0; i < 20; i++) { const ph = (t * (.6 + R() * .6) + R()) % 1; const px = x + (R() - .5) * w + Math.sin(t * 3 + i) * 20, py = y - ph * 700; circle(ctx, px, py, 9 * (1 - ph)); ctx.fillStyle = col; ctx.globalAlpha = a * (1 - ph); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function sticker(ctx, str, x, y, size, fill, col = '#fff', rot = -.06, k = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(str).width + size * .9, h = size * 1.35;
  rrect(ctx, -w / 2 + 10, -h / 2 + 14, w, h, h * .3); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, h * .3); fillStroke(ctx, fill, 10);
  text(ctx, str, 0, size * .05, size, col, INK, 0);
  ctx.restore();
}
function choiceCard(ctx, x, y, w, h, num, lines, col, hl, t, icon) {
  ctx.save(); ctx.translate(x, y); const sc = 1 + hl * .05 + hl * Math.sin(t * 6) * .01; ctx.scale(sc, sc);
  ctx.globalAlpha = .55 + .45 * Math.max(hl, .0) + (hl < 0 ? 0 : 0);
  rrect(ctx, -w / 2 + 12, -h / 2 + 16, w, h, 34); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, 34); fillStroke(ctx, '#fffaf0', 10);
  rrect(ctx, -w / 2, -h / 2, 190, h, [34, 0, 0, 34]); ctx.fillStyle = col; ctx.fill(); rrect(ctx, -w / 2, -h / 2, w, h, 34); fillStroke(ctx, null, 10);
  text(ctx, String(num), -w / 2 + 95, 0, 120, '#fff', INK, 14);
  lines.forEach((L, i) => text(ctx, L, -w / 2 + 225, (i - (lines.length - 1) / 2) * 66, 50, INK, INK, 0, 'Poppins', 700, 'left'));
  if (hl > .5) { rrect(ctx, -w / 2 - 14, -h / 2 - 14, w + 28, h + 28, 44); ctx.lineWidth = 10; ctx.strokeStyle = col; ctx.stroke(); }
  ctx.restore();
}
function rooftops(ctx, x, y, s, col = '#2b2440') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const R = rng(31);
  for (let i = 0; i < 7; i++) { const bx = -360 + i * 110, bw = 100, bh = 120 + R() * 140; rrect(ctx, bx, -bh, bw, bh, 4); fillStroke(ctx, col, 6); path(ctx, [[bx - 14, -bh], [bx + bw / 2, -bh - 50], [bx + bw + 14, -bh]]); fillStroke(ctx, '#c0483a', 6); ctx.fillStyle = '#ffd36a'; ctx.fillRect(bx + 30, -bh + 40, 36, 30); }
  ctx.restore();
}
