// ---------- Gojo vs Sukuna: characters, domains, props ----------
const BLUE = '#5fd0ff', RED = '#d81f2a';
// hair: spiky crown drawn over the top of the head (stick-rig units, head radius hr)
function spikyHair(ctx, hx, hy, hr, lw, col, shade, n = 7, len = 1.0, seed = 3) {
  const R = rng(seed); const pts = [];
  const a0 = Math.PI * 1.02, a1 = Math.PI * 1.98;
  pts.push([hx + Math.cos(a0) * hr * 1.02, hy + Math.sin(a0) * hr * 1.02 + .02]);
  for (let i = 0; i <= n; i++) {
    const a = lerp(a0, a1, i / n);
    const ar = hr * (1.05 + .02);
    if (i > 0) { const am = lerp(a0, a1, (i - .5) / n); const L = hr * (1.45 + R() * .35) * len; pts.push([hx + Math.cos(am) * L, hy + Math.sin(am) * L]); }
    pts.push([hx + Math.cos(a) * ar, hy + Math.sin(a) * ar]);
  }
  pts.push([hx + hr * .95, hy - hr * .05]);
  // fringe line across the forehead
  pts.push([hx + hr * .55, hy - hr * .42]); pts.push([hx + hr * .25, hy - hr * .28]); pts.push([hx, hy - hr * .45]);
  pts.push([hx - hr * .3, hy - hr * .3]); pts.push([hx - hr * .6, hy - hr * .45]); pts.push([hx - hr * .95, hy - hr * .05]);
  path(ctx, pts); ctx.fillStyle = col; ctx.fill();
  ctx.save(); path(ctx, pts); ctx.clip(); ctx.fillStyle = shade; ctx.fillRect(hx + hr * .25, hy - hr * 3, hr * 2, hr * 4); ctx.restore();
  path(ctx, pts); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
}
const gojoHair = (ctx, hx, hy, hr, lw) => spikyHair(ctx, hx, hy, hr, lw, '#f3f7ff', '#c8d6f2', 8, 1.05, 4);
const sukunaHair = (ctx, hx, hy, hr, lw) => spikyHair(ctx, hx, hy, hr, lw, '#f28c9e', '#c9607a', 7, .8, 9);
const megumiHair = (ctx, hx, hy, hr, lw) => spikyHair(ctx, hx, hy, hr, lw, '#22202c', '#111018', 9, 1.15, 12);
// Gojo's blindfold: o.blind 1 = over the eyes, 0 = pulled up into the hair
function gojoBlind(ctx, hx, hy, hr, o) {
  const b = o.blind == null ? 0 : o.blind; if (b <= .02) return;
  const y = hy - .005 - (1 - b) * .17;
  ctx.save(); circle(ctx, hx, hy, hr + .012); ctx.clip();
  ctx.beginPath(); ctx.moveTo(hx - hr * 1.2, y - .05); ctx.quadraticCurveTo(hx, y - .065, hx + hr * 1.2, y - .05); ctx.lineTo(hx + hr * 1.2, y + .045); ctx.quadraticCurveTo(hx, y + .03, hx - hr * 1.2, y + .045); ctx.closePath();
  ctx.fillStyle = '#16141c'; ctx.fill(); ctx.lineWidth = .01; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(hx - hr * 1.2, y - .045, hr * 2.4, .015);
  ctx.restore();
}
// Sukuna's face markings and the Heian extra eyes
function sukunaMarks(ctx, hx, hy, hr, o) {
  const turn = (o.face && o.face.turn) || 0;
  for (const side of [-1, 1]) {
    const x = hx + side * .072 + turn * .06;
    line(ctx, x - .03, hy + .045, x + .03, hy + .045, .011);
    line(ctx, x - .026, hy + .068, x + .026, hy + .068, .011);
  }
  ctx.beginPath(); ctx.moveTo(hx - .03, hy - .12); ctx.lineTo(hx, hy - .09); ctx.lineTo(hx + .03, hy - .12); ctx.lineWidth = .011; ctx.strokeStyle = INK; ctx.stroke();
  if (o.heian) {
    // second pair of eyes above the first, on the right half of the face
    const f = o.face || {}; const blink = f.blink || 0;
    for (const dx of [.05, .12]) {
      const x = hx + dx + turn * .06, y = hy - .085;
      ellipse(ctx, x, y, .022, .017 * (1 - blink * .9)); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = .008; ctx.strokeStyle = INK; ctx.stroke();
      circle(ctx, x + (f.look ? f.look[0] * .006 : 0), y, .009); ctx.fillStyle = RED; ctx.fill();
    }
    ctx.save(); circle(ctx, hx, hy, hr); ctx.clip(); ctx.fillStyle = 'rgba(60,20,30,.12)'; ctx.fillRect(hx + .02, hy - hr, hr, hr * 2); ctx.restore();
  }
}
// kimono + belly mouth for Heian Sukuna; o.belly = how open the belly mouth is (0..1)
function heianTorso(ctx, tw, tTop, tBot, o) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(-tw / 2, tTop, tw, tBot - tTop, [.1, .1, .12, .12]); ctx.clip();
  ctx.beginPath(); ctx.moveTo(-.07, tTop); ctx.lineTo(0, tTop + .12); ctx.lineTo(.07, tTop); ctx.lineWidth = .012; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#1b1820'; ctx.fillRect(-tw, -.345, tw * 2, .05);
  ctx.restore();
  const m = clamp(o.belly || 0); const my = -.44, mw = .075, mh = .012 + .04 * m;
  ctx.beginPath(); ctx.ellipse(0, my, mw, mh, 0, 0, TAU); ctx.fillStyle = '#6e1822'; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, my, mw, mh, 0, 0, TAU); ctx.clip();
  ctx.fillStyle = '#fff'; for (let i = -3; i <= 3; i++) { path(ctx, [[i * .022 - .01, my - mh], [i * .022 + .01, my - mh], [i * .022, my - mh + .02]]); ctx.fill(); path(ctx, [[i * .022 - .01 + .011, my + mh], [i * .022 + .01 + .011, my + mh], [i * .022 + .011, my + mh - .02]]); ctx.fill(); }
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(0, my, mw, mh, 0, 0, TAU); ctx.lineWidth = .011; ctx.strokeStyle = INK; ctx.stroke();
}
const GOJO = { cols: ['#1c2140', '#1c2140'], belt: false, hat: gojoHair, faceOver: gojoBlind, blind: 0, face: { iris: BLUE } };
const SUKUNA = { cols: ['#f3eee3', '#f3eee3'], belt: false, hat: sukunaHair, faceOver: sukunaMarks, torsoOver: heianTorso, heian: true,
  arms2: { L: [1.55, -.8], R: [1.55, -.8] }, face: { iris: RED, mouth: 'grin', browAng: .35 } };
const MEGUMI = { cols: ['#24232e', '#24232e'], belt: false, hat: megumiHair, faceOver: sukunaMarks, face: { iris: RED, mouth: 'smirk', browAng: .3 } };
const C2 = (base, extra) => { const r = Object.assign({}, base, extra); r.face = Object.assign({}, base.face || {}, (extra && extra.face) || {}); return r; };

// ---------- screen-space helpers ----------
function screen(ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); }
function grad(ctx, top, bot, y0 = 0, y1 = H) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-3000, -3000, W + 6000, H + 6000); }
// anime speed lines radiating from (cx, cy)
function speedLines(ctx, cx, cy, t, col = 'rgba(255,255,255,.5)', n = 46, r0 = 380, seed = 1) {
  const R = rng(seed); ctx.save(); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const a = R() * TAU + Math.floor(t * 12) * .37 * (R() - .5) * .1; const w = .006 + R() * .012; const rr = r0 + R() * 220 + Math.sin(t * 20 + i) * 30;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); ctx.lineTo(cx + Math.cos(a - w) * 2600, cy + Math.sin(a - w) * 2600); ctx.lineTo(cx + Math.cos(a + w) * 2600, cy + Math.sin(a + w) * 2600); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function glowAt(ctx, x, y, r, col, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, col.replace('A', (.75 * a).toFixed(3))); g.addColorStop(1, col.replace('A', '0')); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
// flame aura around a character (cursed energy)
function aura(ctx, x, y, h, t, col, a = 1, seed = 2) {
  if (a <= 0) return; const R = rng(seed); ctx.save(); ctx.globalAlpha = a;
  for (let layer = 0; layer < 2; layer++) {
    ctx.beginPath(); const n = 14; const w = h * (.42 - layer * .1);
    for (let i = 0; i <= n; i++) {
      const k = i / n; const ang = Math.PI + k * Math.PI; const fl = (1 + .35 * Math.sin(t * 9 + i * 1.7 + R() * 6)) * (i % 2 ? .75 : 1.15);
      const px = x + Math.cos(ang) * w, py = y - h * .45 + Math.sin(ang) * h * .7 * fl;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.lineTo(x + w * .9, y); ctx.lineTo(x - w * .9, y); ctx.closePath();
    ctx.fillStyle = layer ? 'rgba(255,255,255,.35)' : col; ctx.fill();
  }
  ctx.restore();
}
// bold banner text with a thick ink outline
function banner(ctx, str, x, y, size, fill = '#fff', rot = 0, sc = 1, sw) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  text(ctx, str, 0, 0, size, fill, INK, sw || size * .2); ctx.shadowColor = 'transparent';
  text(ctx, str, 0, 0, size, fill, INK, 0); ctx.restore();
}
function popIn(lt, t0, d = .28) { return lt < t0 ? 0 : backOut(clamp((lt - t0) / d)); }
function redX(ctx, x, y, r, p) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(.6 + .4 * backOut(clamp(p)), .6 + .4 * backOut(clamp(p))); ctx.rotate(-.08);
  for (const s of [1, -1]) { ctx.beginPath(); ctx.moveTo(-r * s, -r); ctx.lineTo(r * s, r); ctx.lineWidth = r * .34; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = r * .22; ctx.strokeStyle = '#ec2a2a'; ctx.stroke(); }
  ctx.restore();
}
// Mahoraga's eight-handled wheel
function wheel(ctx, x, y, r, rot = 0, col = '#e9d9a6') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * TAU / 8); rrect(ctx, -r * .07, -r * 1.3, r * .14, r * .4, r * .05); fillStroke(ctx, col, r * .05); circle(ctx, 0, -r * 1.33, r * .1); fillStroke(ctx, col, r * .05); ctx.restore(); }
  circle(ctx, 0, 0, r); fillStroke(ctx, col, r * .07); circle(ctx, 0, 0, r * .72); fillStroke(ctx, '#c9b47a', r * .05);
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * TAU / 8); line(ctx, 0, -r * .2, 0, -r * .72, r * .07); ctx.restore(); }
  circle(ctx, 0, 0, r * .22); fillStroke(ctx, col, r * .06);
  ctx.restore();
}
// timer box "m:ss"
function timerBox(ctx, x, y, s, secs, warn = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -170, -70, 340, 140, 30); fillStroke(ctx, mix('#ffffff', '#ffd2d2', warn), 10);
  circle(ctx, -120, -70, 22); fillStroke(ctx, '#ffd23a', 7);
  const m = Math.floor(Math.max(0, secs) / 60), ss = Math.floor(Math.max(0, secs) % 60);
  text(ctx, `${m}:${String(ss).padStart(2, '0')}`, 10, 6, 100, warn > .5 ? '#d81f2a' : INK, INK, 0);
  ctx.restore();
}
// on/off switch
function toggle(ctx, x, y, s, on, label) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -150, -70, 300, 140, 70); fillStroke(ctx, mix('#8a8a95', '#3fd16b', on), 10);
  circle(ctx, lerp(-80, 80, on), 0, 56); fillStroke(ctx, '#fff', 9);
  text(ctx, on > .5 ? 'ON' : 'OFF', lerp(55, -55, on), 4, 46, '#fff', INK, 9);
  if (label) text(ctx, label, 0, -125, 54, '#fff', INK, 12);
  ctx.restore();
}
// cartoon brain with cracks and steam
function brain(ctx, x, y, s, t, crack = 0) {
  ctx.save(); ctx.translate(x + (crack > .3 ? Math.sin(t * 60) * 6 * crack : 0), y); ctx.scale(s, s);
  const lobes = [[-60, -20, 70], [0, -45, 75], [60, -20, 70], [-35, 25, 62], [35, 25, 62]];
  ctx.beginPath(); lobes.forEach(([a, b, r]) => { ctx.moveTo(a + r, b); ctx.arc(a, b, r, 0, TAU); }); ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); lobes.forEach(([a, b, r]) => { ctx.moveTo(a + r, b); ctx.arc(a, b, r, 0, TAU); }); ctx.fillStyle = mix('#ff9fb4', '#c8505f', crack); ctx.fill();
  ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(120,30,60,.55)';
  for (const [a, b, r] of lobes) { ctx.beginPath(); ctx.arc(a - 10, b, r * .5, .3, 2.6); ctx.stroke(); }
  line(ctx, 0, -110, 0, 80, 7, 'rgba(120,30,60,.55)');
  if (crack > 0) { ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(-20, -115); ctx.lineTo(10 * crack, -60); ctx.lineTo(-25 * crack, -10); ctx.lineTo(15, 40 * crack); ctx.lineTo(-10, 85 * crack); ctx.stroke(); }
  ctx.restore();
}
// Gojo's domain from the outside: a dark sphere full of stars
function voidSphere(ctx, x, y, r, t, crack = 0, alpha = 1, seed = 4) {
  if (alpha <= 0 || r <= 1) return; ctx.save(); ctx.globalAlpha = alpha;
  const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#5a4ad6'); g.addColorStop(.6, '#1c1260'); g.addColorStop(1, '#090525');
  circle(ctx, x, y, r); ctx.fillStyle = g; ctx.fill();
  ctx.save(); circle(ctx, x, y, r); ctx.clip(); const R = rng(seed);
  for (let i = 0; i < 70; i++) { const a = R() * TAU, d = Math.sqrt(R()) * r; const tw = .5 + .5 * Math.sin(t * 5 + i); circle(ctx, x + Math.cos(a + t * .2) * d, y + Math.sin(a + t * .2) * d, 2 + R() * 4 * tw); ctx.fillStyle = `rgba(255,255,255,${.4 + .6 * tw})`; ctx.fill(); }
  ctx.globalCompositeOperation = 'lighter'; ellipse(ctx, x, y, r * .9, r * .25, t * .4); ctx.lineWidth = r * .04; ctx.strokeStyle = 'rgba(140,200,255,.35)'; ctx.stroke();
  ctx.restore();
  circle(ctx, x, y, r); ctx.lineWidth = Math.max(6, r * .025); ctx.strokeStyle = '#a8e4ff'; ctx.stroke();
  if (crack > 0) { const R2 = rng(seed + 9); ctx.lineWidth = Math.max(4, r * .018); ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
    const n = Math.ceil(crack * 9); for (let i = 0; i < n; i++) { const a = R2() * TAU; let px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; ctx.beginPath(); ctx.moveTo(px, py); for (let k = 0; k < 4; k++) { const aa = a + Math.PI + (R2() - .5) * 1.2; const st = r * .18 * crack; px += Math.cos(aa) * st; py += Math.sin(aa) * st; ctx.lineTo(px, py); } ctx.stroke(); } }
  ctx.restore();
}
// glass shards flying out from a broken sphere
function shards(ctx, x, y, r, p, col = '#a8e4ff', seed = 6) {
  if (p <= 0 || p >= 1) return; const R = rng(seed); ctx.save(); ctx.globalAlpha = 1 - p;
  for (let i = 0; i < 26; i++) { const a = R() * TAU; const d = r * (1 + p * (1 + R() * 1.5)); const sx = x + Math.cos(a) * d, sy = y + Math.sin(a) * d + p * p * 300; const sz = 18 + R() * 40;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(R() * 6 + p * 8); path(ctx, [[0, -sz], [sz * .6, sz * .4], [-sz * .5, sz * .5]]); fillStroke(ctx, col, 4); ctx.restore(); }
  ctx.restore();
}
// infinite void interior: stars, nebula, rings
function voidBG(ctx, t, a = 1) {
  if (a <= 0) return; ctx.save(); screen(ctx); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(540, 820, 50, 540, 900, 1400); g.addColorStop(0, '#6a5cff'); g.addColorStop(.35, '#24157a'); g.addColorStop(1, '#05031a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const R = rng(21);
  for (let i = 0; i < 160; i++) { const x = R() * W, y = R() * H, s = .8 + R() * 3.5; const tw = .5 + .5 * Math.sin(t * 4 + i * 1.3); circle(ctx, x + (x - 540) * t * .02, y + (y - 900) * t * .02, s); ctx.fillStyle = `rgba(255,255,255,${.3 + .7 * tw})`; ctx.fill(); }
  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 4; k++) { ellipse(ctx, 540, 860, 260 + k * 160 + t * 40, 60 + k * 40, -.35 + k * .08 + t * .1); ctx.lineWidth = 10 - k * 2; ctx.strokeStyle = `rgba(150,210,255,${.35 - k * .06})`; ctx.stroke(); }
  ctx.restore();
}
// Malevolent Shrine: blood sky, a shrine with curved eaves, a bone field
function shrineBG(ctx, t, a = 1) {
  if (a <= 0) return; ctx.save(); screen(ctx); ctx.globalAlpha = a;
  grad(ctx, '#1a0204', '#a3121b', 0, 1500);
  glowAt(ctx, 540, 520, 700, 'rgba(255,80,60,A)', .6);
  ctx.fillStyle = '#2a0306'; ctx.fillRect(0, 1300, W, 700);
  const R = rng(31); for (let i = 0; i < 40; i++) { const x = R() * W, y = 1320 + R() * 600; circle(ctx, x, y, 16 + R() * 26); fillStroke(ctx, '#efe2cf', 4); circle(ctx, x - 6, y - 2, 4); ctx.fillStyle = INK; ctx.fill(); circle(ctx, x + 7, y - 2, 4); ctx.fill(); }
  drawShrine(ctx, 540, 1320, 1);
  ctx.restore();
}
function drawShrine(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const roof = (w, yy, h) => { ctx.beginPath(); ctx.moveTo(-w, yy); ctx.quadraticCurveTo(-w * .55, yy - h * .25, -w * .35, yy - h); ctx.lineTo(w * .35, yy - h); ctx.quadraticCurveTo(w * .55, yy - h * .25, w, yy); ctx.quadraticCurveTo(0, yy - h * .2, -w, yy); fillStroke(ctx, '#1b0a0c', 8); };
  rrect(ctx, -300, -260, 600, 260, 4); fillStroke(ctx, '#3a0c10', 8);
  for (const px of [-250, -90, 90, 250]) { rrect(ctx, px - 18, -260, 36, 260, 4); fillStroke(ctx, '#7a1218', 6); }
  circle(ctx, 0, -150, 70); fillStroke(ctx, '#140608', 6); // the mouth-gate
  for (let i = -2; i <= 2; i++) { path(ctx, [[i * 26 - 10, -205], [i * 26 + 10, -205], [i * 26, -180]]); fillStroke(ctx, '#efe2cf', 3); }
  roof(420, -250, 120); rrect(ctx, -220, -420, 440, 80, 4); fillStroke(ctx, '#3a0c10', 7); roof(320, -400, 110);
  // horns
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 120, -500); ctx.quadraticCurveTo(sd * 200, -620, sd * 140, -700); ctx.quadraticCurveTo(sd * 160, -600, sd * 70, -505); fillStroke(ctx, '#efe2cf', 7); }
  ctx.restore();
}
// a cleave/slash mark: tapered white stroke with a red rim
function slash(ctx, x1, y1, x2, y2, p, w = 26) {
  if (p <= 0 || p >= 1.6) return; const k = clamp(p * 3), fade = 1 - clamp((p - .5) / 1.1);
  const ex = lerp(x1, x2, k), ey = lerp(y1, y2, k); const nx = -(y2 - y1), ny = x2 - x1, L = Math.hypot(nx, ny) || 1;
  const ox = nx / L * w, oy = ny / L * w;
  ctx.save(); ctx.globalAlpha = fade;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + ex) / 2 + ox, (y1 + ey) / 2 + oy, ex, ey); ctx.quadraticCurveTo((x1 + ex) / 2 + ox * .2, (y1 + ey) / 2 + oy * .2, x1, y1);
  ctx.fillStyle = '#ff3b3b'; ctx.lineWidth = 8; ctx.strokeStyle = '#ff3b3b'; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.restore();
}
function slashStorm(ctx, lt, t0, rate, n, box, seed = 7) {
  const R = rng(seed);
  for (let i = 0; i < n; i++) { const st = t0 + i / rate + R() * .05; const p = (lt - st) / .35; const cx = box[0] + R() * box[2], cy = box[1] + R() * box[3]; const a = R() * Math.PI; const L = 160 + R() * 260;
    slash(ctx, cx - Math.cos(a) * L, cy - Math.sin(a) * L, cx + Math.cos(a) * L, cy + Math.sin(a) * L, p, 14 + R() * 20); }
}
// Fuga: a flame arrow and a fire blast
function flame(ctx, x, y, r, t, seed = 1, a = 1) {
  if (a <= 0 || r <= 0) return; const R = rng(seed); ctx.save(); ctx.globalAlpha = a;
  const cols = ['#c21b12', '#ff6a1a', '#ffc23a', '#fff3b0'];
  cols.forEach((c, li) => { const rr = r * (1 - li * .22); ctx.beginPath(); const n = 12;
    for (let i = 0; i <= n; i++) { const ang = i / n * TAU; const f = 1 + .25 * Math.sin(t * 14 + i * 2.1 + li + R() * 3); const up = Math.sin(ang) < 0 ? 1.5 : 1; const px = x + Math.cos(ang) * rr * f, py = y + Math.sin(ang) * rr * f * up; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.fillStyle = c; ctx.fill(); if (li === 0) { ctx.lineWidth = r * .05; ctx.strokeStyle = INK; ctx.stroke(); } });
  ctx.restore();
}
function fireArrow(ctx, x, y, ang, len, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  for (let i = 0; i < 6; i++) flame(ctx, -len * .15 - i * len * .14, Math.sin(t * 20 + i) * 6, len * (.16 - i * .018), t, 40 + i);
  rrect(ctx, -len * .9, -9, len * .9, 18, 9); fillStroke(ctx, '#ffdf7a', 6);
  path(ctx, [[0, -38], [70, 0], [0, 38]]); fillStroke(ctx, '#fff3b0', 7);
  ctx.restore();
}
function cityBG(ctx, t, o = {}) {
  grad(ctx, o.top || '#2b2350', o.bot || '#f08a4b', -300, 1300);
  const R = rng(o.seed || 17);
  for (let layer = 0; layer < 2; layer++) {
    let x = -400; const base = 1250 + layer * 60;
    while (x < 1500) { const w = 90 + R() * 140, h = 300 + R() * (layer ? 500 : 800); const col = layer ? '#2b2236' : '#4a3a5e';
      rrect(ctx, x, base - h, w, h + 900, 0); fillStroke(ctx, col, 6);
      ctx.fillStyle = layer ? 'rgba(255,200,120,.55)' : 'rgba(255,210,140,.35)';
      for (let wy = base - h + 30; wy < base - 30; wy += 60) for (let wx = x + 18; wx < x + w - 20; wx += 38) if (R() > .45) ctx.fillRect(wx, wy, 16, 26);
      // broken top
      if (R() > .5) { path(ctx, [[x, base - h], [x + w * .4, base - h - 40], [x + w * .6, base - h + 20], [x + w, base - h - 25], [x + w, base - h + 5], [x, base - h + 5]]); fillStroke(ctx, col, 6); }
      x += w + 10 + R() * 30; }
  }
  ctx.fillStyle = o.ground || '#5b4a52'; ctx.fillRect(-2000, 1300, 5000, 2000);
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(-2000, 1300, 5000, 18);
  const R2 = rng(5); for (let i = 0; i < 14; i++) { const rx = -300 + R2() * 1700, ry = 1340 + R2() * 500, rs = 20 + R2() * 50; path(ctx, [[rx - rs, ry], [rx - rs * .3, ry - rs * .8], [rx + rs, ry - rs * .3], [rx + rs * .8, ry]]); fillStroke(ctx, '#7a6a70', 5); }
}
function crack(ctx, x, y, r, p, seed = 3) {
  if (p <= 0) return; const R = rng(seed); ctx.save(); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const a = Math.PI + R() * Math.PI * 1 - .1 + (R() > .5 ? Math.PI : 0) * .0; let px = x, py = y; ctx.beginPath(); ctx.moveTo(px, py);
    for (let k = 0; k < 4; k++) { const aa = (i / 9) * TAU + (R() - .5) * .6; px += Math.cos(aa) * r * .25 * p; py += Math.sin(aa) * r * .08 * p; ctx.lineTo(px, py); } ctx.stroke(); }
  ctx.restore();
}
function commentIcon(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -120, -90, 240, 160, 40); fillStroke(ctx, '#fff', 10);
  path(ctx, [[-40, 66], [-70, 120], [10, 68]]); fillStroke(ctx, '#fff', 10); rrect(ctx, -60, 55, 90, 22, 0); ctx.fillStyle = '#fff'; ctx.fill();
  for (let i = -1; i <= 1; i++) { circle(ctx, i * 55, -10 + Math.sin(t * 8 + i) * 6, 16); ctx.fillStyle = INK; ctx.fill(); }
  ctx.restore();
}
function downArrow(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y + Math.abs(Math.sin(t * 6)) * 30 * s); ctx.scale(s, s);
  path(ctx, [[-40, -120], [40, -120], [40, 0], [95, 0], [0, 100], [-95, 0], [-40, 0]]); fillStroke(ctx, '#ffd23a', 12);
  ctx.restore();
}
