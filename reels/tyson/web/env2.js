// ---------- Tyson reel: hair, boxing ring, Brooklyn, bars, money and other props ----------
const HATS = {
  flattop(ctx, hx, hy, hr, lw, o) {
    ctx.beginPath(); ctx.moveTo(hx - hr * .97, hy - hr * .2); ctx.quadraticCurveTo(hx - hr * 1.0, hy - hr * .9, hx - hr * .8, hy - hr * 1.07); ctx.quadraticCurveTo(hx, hy - hr * 1.16, hx + hr * .8, hy - hr * 1.07); ctx.quadraticCurveTo(hx + hr * 1.0, hy - hr * .9, hx + hr * .97, hy - hr * .2);
    ctx.quadraticCurveTo(hx + hr * .7, hy - hr * .62, hx, hy - hr * .64); ctx.quadraticCurveTo(hx - hr * .7, hy - hr * .62, hx - hr * .97, hy - hr * .2);
    fillStroke(ctx, o.hairCol || '#231d22', lw);
    ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(hx - hr * .55, hy - hr * 1.04, hr * .45, hr * .07);
  },
  buzz(ctx, hx, hy, hr, lw, o) {
    ctx.beginPath(); ctx.arc(hx, hy, hr + .008, Math.PI + .3, -.3); ctx.quadraticCurveTo(hx + hr * .55, hy - hr * .58, hx, hy - hr * .6); ctx.quadraticCurveTo(hx - hr * .55, hy - hr * .58, hx - hr * .955, hy - hr * .29);
    fillStroke(ctx, o.hairCol || '#2a2226', lw);
  },
  bald(ctx, hx, hy, hr, lw, o) {
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(hx + s * hr * .93, hy - hr * .18, hr * .17, hr * .3, s * .3, 0, TAU); fillStroke(ctx, '#ecebe8', lw * .8); }
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ellipse(ctx, hx - hr * .35, hy - hr * .75, hr * .22, hr * .08, -.4); ctx.fill();
  },
  beanie(ctx, hx, hy, hr, lw, o) {
    ctx.beginPath(); ctx.arc(hx, hy - hr * .05, hr + .015, Math.PI + .15, -.15); ctx.closePath(); fillStroke(ctx, o.hatCol || '#3a9b5c', lw);
    rrect(ctx, hx - hr * 1.02, hy - hr * .35, hr * 2.04, hr * .3, .02); fillStroke(ctx, o.hatCol2 || '#2d7a48', lw);
    circle(ctx, hx, hy - hr * 1.2, hr * .2); fillStroke(ctx, '#f4f0e6', lw);
  },
  cop(ctx, hx, hy, hr, lw, o) {
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.0, hy - hr * .45); ctx.lineTo(hx - hr * 1.15, hy - hr * 1.15); ctx.quadraticCurveTo(hx, hy - hr * 1.45, hx + hr * 1.15, hy - hr * 1.15); ctx.lineTo(hx + hr * 1.0, hy - hr * .45); ctx.closePath(); fillStroke(ctx, '#23345e', lw);
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.05, hy - hr * .45); ctx.quadraticCurveTo(hx, hy - hr * .15, hx + hr * 1.05, hy - hr * .45); ctx.lineTo(hx + hr * .9, hy - hr * .6); ctx.lineTo(hx - hr * .9, hy - hr * .6); ctx.closePath(); fillStroke(ctx, '#151c33', lw);
    star5(ctx, hx, hy - hr * .9, hr * .17, 0, '#f2c230');
  },
  headphones(ctx, hx, hy, hr, lw, o) {
    HATS.flattop(ctx, hx, hy, hr, lw, o);
    ctx.beginPath(); ctx.arc(hx, hy, hr * 1.12, Math.PI * 1.08, -Math.PI * .08); ctx.lineWidth = .03; ctx.strokeStyle = INK; ctx.stroke();
    for (const s of [-1, 1]) { rrect(ctx, hx + s * hr * 1.0 - .045, hy - .07, .09, .14, .035); fillStroke(ctx, '#e0392f', lw); }
  },
};

// palette for the reel
const SKIN = '#f6f2ea';
const TY_KID = { cols: ['#2f63c9', '#f6f1e8'], hat: 'buzz', belt: false };
const TY_BOX = { cols: [SKIN, SKIN], hat: 'flattop', belt: false, trunks: '#17151a', band: '#f1f1f1', gloves: '#d22a2a' };
const TY_OLD = { cols: ['#2b2b33', '#2b2b33'], hat: 'flattop', hairCol: '#5b5458', belt: false, tattoo: true };
const CUS = { cols: ['#3d3f4a', '#3d3f4a'], hat: 'bald', belt: false, glasses: true, vest: '#f1efe8' };
const COACH = { cols: ['#e0392f', '#e0392f'], hat: 'buzz', hairCol: '#7a4a2a', belt: false };
const OPP = { cols: [SKIN, SKIN], hat: 'buzz', belt: false, trunks: '#c9c9d4', band: '#7a4bc4', gloves: '#2f63c9' };
const HOLY = { cols: [SKIN, SKIN], hat: 'buzz', belt: false, trunks: '#f4f4f4', band: '#7a4bc4', gloves: '#f4f4f4' };
const BULLY = { cols: ['#3fa35b', '#3fa35b'], hat: 'beanie', belt: false };
const BULLY2 = { cols: ['#f2b52a', '#f2b52a'], hat: 'buzz', hairCol: '#c47a2a', belt: false };
const GUARD = { cols: ['#2a3f8f', '#2a3f8f'], hat: 'cop', belt: true };

// ---------- boxing ring ----------
function drawArena(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .1);
  const g = ctx.createLinearGradient(0, -400, 0, 1300); g.addColorStop(0, o.top || '#1a1030'); g.addColorStop(1, o.bot || '#3b1f4f'); ctx.fillStyle = g; ctx.fillRect(-2000, -2400, 5080, 5000);
  // spotlights
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, a] of [[200, .25], [540, .0], [880, -.25]]) {
    const sw = Math.sin(t * .8 + x) * .08;
    ctx.save(); ctx.translate(x, -300); ctx.rotate(a + sw); const lg = ctx.createLinearGradient(0, 0, 0, 1600); lg.addColorStop(0, 'rgba(255,240,200,.32)'); lg.addColorStop(1, 'rgba(255,240,200,0)');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(260, 1600); ctx.lineTo(-260, 1600); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  // crowd silhouettes with flashes
  applyCam(ctx, cam, .35);
  const R = rng(9);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) {
    const x = -200 + i * 95 + row * 40 + R() * 30, y = 820 + row * 95, s = 120 + row * 20;
    const col = mix('#120a1f', '#2c1a3e', row / 3);
    const bob = Math.sin(t * (4 + R() * 3) + i) * (o.cheer || 0) * 10;
    ctx.fillStyle = col; circle(ctx, x, y - s * .55 + bob, s * .2); ctx.fill(); rrect(ctx, x - s * .22, y - s * .38 + bob, s * .44, s * .6, s * .15); ctx.fill();
    if (o.cheer) { line(ctx, x - s * .18, y - s * .3 + bob, x - s * .3, y - s * .7 + bob, s * .07, col); }
    const fl = Math.sin(t * 7.3 + i * 12.1 + row * 4) > .985 - (o.flash || .0);
    if (fl) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fg = ctx.createRadialGradient(x, y - s * .5, 0, x, y - s * .5, 70); fg.addColorStop(0, 'rgba(255,255,255,.95)'); fg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = fg; ctx.fillRect(x - 70, y - s * .5 - 70, 140, 140); ctx.restore(); }
  }
  if (o.banner) { applyCam(ctx, cam, .25); rrect(ctx, 290, 520, 500, 120, 14); fillStroke(ctx, '#d22a2a', 7); text(ctx, o.banner, 540, 582, 78, '#fff6c4', INK, 10, 'Poppins', 700); }
  applyCam(ctx, cam, 1);
  drawRing(ctx, o.floor || 1250);
}
function drawRing(ctx, y) {
  // apron + canvas (perspective trapezoid)
  path(ctx, [[-400, y + 950], [1480, y + 950], [1150, y - 120], [-70, y - 120]]); fillStroke(ctx, '#2f63c9', 8);
  ctx.save(); path(ctx, [[-400, y + 950], [1480, y + 950], [1150, y - 120], [-70, y - 120]]); ctx.clip();
  const g = ctx.createLinearGradient(0, y - 120, 0, y + 900); g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(0,0,30,.25)'); ctx.fillStyle = g; ctx.fillRect(-500, y - 200, 2100, 1300);
  circle(ctx, 540, y + 250, 260); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fill(); ctx.restore();
  // back posts + ropes
  for (const x of [-60, 1140]) { rrect(ctx, x - 18, y - 470, 36, 360, 10); fillStroke(ctx, '#c9c9d4', 6); }
  const cols = ['#d22a2a', '#f4f4f4', '#2f63c9'];
  for (let k = 0; k < 3; k++) { const yy = y - 430 + k * 105; line(ctx, -60, yy, 1140, yy, 22, INK); line(ctx, -60, yy, 1140, yy, 13, cols[k]); }
}
function frontRopes(ctx, y) {
  const cols = ['#d22a2a', '#f4f4f4', '#2f63c9'];
  for (let k = 0; k < 2; k++) { const yy = y + k * 120; line(ctx, -200, yy, 1280, yy, 30, INK); line(ctx, -200, yy, 1280, yy, 19, cols[k]); }
}
function drawBeltProp(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -260, -38, 520, 76, 30); fillStroke(ctx, '#1b1820', 7);
  for (const sx of [-1, 1]) { ellipse(ctx, sx * 165, 0, 52, 46); fillStroke(ctx, '#e8c04a', 6); }
  ellipse(ctx, 0, 0, 115, 92); fillStroke(ctx, '#f2c230', 7); ellipse(ctx, 0, 0, 82, 64); fillStroke(ctx, '#ffe27a', 5);
  star5(ctx, 0, 0, 38, 0, '#d22a2a');
  ctx.fillStyle = 'rgba(255,255,255,.5)'; ellipse(ctx, -40, -40, 36, 12, -.4); ctx.fill();
  ctx.restore();
}
// ---------- Brooklyn street ----------
function drawStreet(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, o.skyTop || '#f08a4b', o.skyBot || '#ffd27a', -400, 1000);
  applyCam(ctx, cam, .12); drawSun(ctx, 760, 620, 90, t, .6);
  // bridge silhouette
  applyCam(ctx, cam, .2);
  ctx.fillStyle = '#b5576a';
  for (const x of [250, 830]) { ctx.fillRect(x - 40, 380, 80, 520); ctx.fillRect(x - 55, 360, 110, 30); ctx.clearRect && 0; rrect(ctx, x - 25, 450, 50, 120, 25); ctx.fillStyle = '#e88a6a'; ctx.fill(); ctx.fillStyle = '#b5576a'; }
  ctx.fillRect(-400, 860, 1900, 30);
  ctx.strokeStyle = '#b5576a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-300, 860); ctx.quadraticCurveTo(-30, 470, 250, 390); ctx.quadraticCurveTo(540, 760, 830, 390); ctx.quadraticCurveTo(1110, 470, 1380, 860); ctx.stroke();
  for (let i = 0; i < 22; i++) { const x = -260 + i * 75; line(ctx, x, 860, x, 860 - Math.max(0, 470 - Math.abs(((x - 250 + 2000) % 580) - 290) * 1.4), 3, '#b5576a'); }
  // buildings
  applyCam(ctx, cam, .55);
  const B = [[-160, 360, '#a9412c'], [210, 260, '#c4613a'], [480, 420, '#8e3a2c'], [740, 300, '#b85033'], [1050, 380, '#9a4230']];
  for (const [x, top, col] of B) {
    rrect(ctx, x - 130, top, 290, 1300, 0); fillStroke(ctx, col, 7);
    for (let r = 0; r < 7; r++) for (let c = 0; c < 3; c++) { const wx = x - 95 + c * 85, wy = top + 50 + r * 120; rrect(ctx, wx, wy, 55, 75, 4); const lit = ((r * 3 + c + x) % 5) === 0; fillStroke(ctx, lit ? '#ffd86b' : '#3b2f45', 5); }
    // fire escape
    for (let r = 1; r < 6; r += 2) { line(ctx, x - 110, top + 150 + r * 120, x + 30, top + 150 + r * 120, 7, '#2a2226'); line(ctx, x - 110, top + 110 + r * 120, x + 30, top + 110 + r * 120, 4, '#2a2226'); }
    rrect(ctx, x - 130, top - 20, 290, 26, 4); fillStroke(ctx, '#e7d7b8', 5);
  }
  applyCam(ctx, cam, 1);
  // sidewalk + street
  rrect(ctx, -600, 1180, 2400, 200, 0); fillStroke(ctx, '#c9c1b4', 7);
  for (let i = 0; i < 12; i++) line(ctx, -400 + i * 180, 1184, -460 + i * 180, 1376, 5, '#a79e91');
  rrect(ctx, -600, 1376, 2400, 1000, 0); fillStroke(ctx, '#4a4550', 7);
  for (let i = 0; i < 8; i++) { rrect(ctx, -300 + i * 260, 1640, 140, 22, 8); ctx.fillStyle = '#f2c230'; ctx.fill(); }
}
function streetSign(ctx, x, y, label, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 0, 640, 18, INK); line(ctx, 0, 0, 0, 640, 10, '#3d6b4a');
  rrect(ctx, -10, -34, 380, 80, 10); fillStroke(ctx, '#2f8a55', 7); text(ctx, label, 180, 6, 46, '#fff', INK, 0, 'Poppins', 700);
  ctx.restore();
}
function sirenLight(ctx, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen';
  const red = Math.sin(t * 12) > 0;
  const g = ctx.createRadialGradient(red ? 0 : W, 600, 50, red ? 0 : W, 600, 1300); g.addColorStop(0, red ? `rgba(255,40,40,${.5 * a})` : `rgba(40,90,255,${.5 * a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// ---------- bars, rooms ----------
function drawBars(ctx, x0, x1, y0, y1, n = 7, col = '#8a8f9c') {
  const w = (x1 - x0) / n;
  for (let i = 0; i <= n; i++) { const x = x0 + i * w; rrect(ctx, x - 14, y0, 28, y1 - y0, 12); fillStroke(ctx, col, 6); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x - 8, y0 + 10, 5, y1 - y0 - 20); }
  for (const yy of [y0 + 30, y1 - 60]) { rrect(ctx, x0 - 30, yy, x1 - x0 + 60, 34, 8); fillStroke(ctx, col, 6); }
}
function drawCellRoom(ctx, cam, tint = '#6f7485') {
  applyCam(ctx, cam, .4); ctx.fillStyle = tint; ctx.fillRect(-1000, -1000, 3080, 3920);
  for (let r = 0; r < 16; r++) for (let c = 0; c < 8; c++) { rrect(ctx, -200 + c * 200 + (r % 2) * 100, -200 + r * 100, 190, 90, 6); ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fill(); }
  applyCam(ctx, cam, 1); rrect(ctx, -800, 1250, 2680, 1400, 0); fillStroke(ctx, '#4e5263', 7);
}
function drawGym(ctx, cam) {
  applyCam(ctx, cam, .4); ctx.fillStyle = '#b4583a'; ctx.fillRect(-1000, -1000, 3080, 3920);
  for (let r = 0; r < 24; r++) for (let c = 0; c < 10; c++) { rrect(ctx, -300 + c * 170 + (r % 2) * 85, -300 + r * 70, 160, 60, 6); ctx.fillStyle = r % 3 ? 'rgba(0,0,0,.08)' : 'rgba(255,200,150,.08)'; ctx.fill(); }
  ctx.fillStyle = 'rgba(255,240,200,.15)'; rrect(ctx, 640, 200, 260, 330, 10); ctx.fill(); drawBars(ctx, 650, 890, 200, 530, 4, '#5b5e6a');
  applyCam(ctx, cam, 1); rrect(ctx, -800, 1250, 2680, 1400, 0); fillStroke(ctx, '#c79a5a', 7);
  for (let i = 0; i < 14; i++) line(ctx, -600 + i * 160, 1254, -900 + i * 220, 2600, 5, '#a87b44');
}
function heavyBag(ctx, x, y, s, ang) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  line(ctx, 0, 0, 0, 160, 8, '#555'); line(ctx, 0, 160, -50, 220, 6, '#555'); line(ctx, 0, 160, 50, 220, 6, '#555');
  rrect(ctx, -95, 215, 190, 520, 70); fillStroke(ctx, '#c8262b', 8);
  ctx.save(); rrect(ctx, -95, 215, 190, 520, 70); ctx.clip(); ctx.fillStyle = 'rgba(40,0,20,.22)'; ctx.fillRect(30, 200, 100, 600); ctx.fillStyle = '#1b1820'; ctx.fillRect(-100, 300, 200, 26); ctx.fillRect(-100, 620, 200, 26); ctx.restore();
  ctx.restore();
}
// ---------- money, frame, rain ----------
function bill(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -80, -38, 160, 76, 8); fillStroke(ctx, '#7fcf7a', 5); rrect(ctx, -66, -26, 132, 52, 6); fillStroke(ctx, null, 3, '#3d8a4a');
  text(ctx, '$', 0, 3, 46, '#2f7a3d', INK, 0, 'Poppins', 700); ctx.restore();
}
function moneyStack(ctx, x, y, n, s = 1, fall = 0, t = 0) {
  for (let i = 0; i < n; i++) {
    const k = clamp(fall * 1.6 - i / n * .6); const R = rng(i + 3);
    const dx = k * (R() - .5) * 900, dy = k * k * (900 - i * 30), rot = k * (R() - .5) * 4;
    ctx.save(); ctx.translate(x + dx, y - i * 34 * s + dy); ctx.rotate(rot + Math.sin(i * 2.1) * .03); ctx.scale(s, s);
    rrect(ctx, -110, -17, 220, 34, 6); fillStroke(ctx, i % 2 ? '#7fcf7a' : '#6cc068', 5); rrect(ctx, -22, -17, 44, 34, 2); fillStroke(ctx, '#f0e6c8', 4);
    ctx.restore();
  }
}
function portrait(ctx, x, y, s, who, ribbon = 0, tilt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s);
  rrect(ctx, -170, -210, 340, 420, 14); fillStroke(ctx, '#9a6a2a', 8); rrect(ctx, -140, -180, 280, 360, 8); fillStroke(ctx, '#e9e0cc', 5);
  ctx.save(); rrect(ctx, -140, -180, 280, 360, 8); ctx.clip(); drawStick(ctx, C(who, { x: 0, y: 470, s: 520, shadow: false, face: { mouth: 'smile', eyes: 'normal' } })); ctx.restore();
  if (ribbon > 0) { ctx.globalAlpha = ribbon; path(ctx, [[60, -210], [170, -210], [170, -100]]); fillStroke(ctx, '#111', 6); path(ctx, [[100, -210], [170, -140], [170, -95], [55, -210]]); fillStroke(ctx, '#222', 4); }
  ctx.restore();
}
function rain(ctx, t, a = 1, n = 90) {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; const R = rng(21);
  for (let i = 0; i < n; i++) { const x = R() * 1300 - 100, sp = 1500 + R() * 600, y = ((R() * 2200 + t * sp) % 2200) - 150; line(ctx, x, y, x - 18, y + 60, 4, 'rgba(190,215,255,.7)'); }
  ctx.restore();
}
function confetti(ctx, t, t0, a = 1) {
  if (t < t0) return; const R = rng(77); const cols = ['#ffd23a', '#d22a2a', '#2f63c9', '#3fa35b', '#fff'];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  for (let i = 0; i < 120; i++) { const x = R() * 1080 + Math.sin((t - t0) * 3 + i) * 40, y = -100 + ((t - t0) * (300 + R() * 400) + R() * 300); if (y > 2000) continue; ctx.save(); ctx.translate(x, y); ctx.rotate((t - t0) * 5 + i); ctx.fillStyle = cols[i % 5]; ctx.fillRect(-12, -6, 24, 12); ctx.restore(); }
  ctx.restore();
}
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function bubble(ctx, x, y, w, h, tailX, tailY, s = 1) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 40); ctx.moveTo(tailX - x - 30, h / 2 - 4); ctx.lineTo(tailX - x, tailY - y); ctx.lineTo(tailX - x + 30, h / 2 - 4);
  fillStroke(ctx, '#fff', 7); ctx.restore();
}
function speedLines(ctx, cx, cy, t, a = 1, col = 'rgba(255,255,255,.75)') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const R = rng(5);
  for (let i = 0; i < 40; i++) { const ang = R() * TAU, r0 = 380 + R() * 200 + ((t * 900 + R() * 400) % 300); line(ctx, cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0, cx + Math.cos(ang) * (r0 + 220), cy + Math.sin(ang) * (r0 + 220), 8, col); }
  ctx.restore();
}
function globe(ctx, x, y, r, t) {
  circle(ctx, x, y, r); fillStroke(ctx, '#2f9fd8', 9);
  ctx.save(); circle(ctx, x, y, r); ctx.clip(); ctx.fillStyle = '#4fbf6a';
  const off = (t * 60) % (r * 4);
  for (const [bx, by, br] of [[-.5, -.3, .35], [.2, .1, .4], [.7, -.45, .25], [-.2, .55, .3], [1.1, .3, .35], [1.6, -.2, .3]]) { for (const k of [0, -4]) { ellipse(ctx, x + (bx + k * .5) * r + off * .5 - r * .5, y + by * r, br * r, br * r * .7, .4); ctx.fill(); } }
  ctx.fillStyle = 'rgba(0,20,60,.22)'; ctx.beginPath(); ctx.arc(x + r * .35, y + r * .25, r * 1.05, 0, TAU); ctx.arc(x - r * .1, y - r * .1, r * 1.0, 0, TAU, true); ctx.fill();
  ctx.restore(); circle(ctx, x, y, r); fillStroke(ctx, null, 9);
}
function micStand(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 0, 300, 14, INK); line(ctx, 0, 0, -140, -40, 12, INK);
  ctx.save(); ctx.translate(-150, -50); ctx.rotate(-.5); rrect(ctx, -40, -95, 80, 150, 40); fillStroke(ctx, '#3b3b45', 7);
  for (let i = 0; i < 4; i++) line(ctx, -28, -70 + i * 26, 28, -70 + i * 26, 4, '#77778a'); ctx.restore();
  ctx.restore();
}
function clapper(ctx, x, y, s, open) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -150, 0, 300, 190, 10); fillStroke(ctx, '#1d1b22', 7);
  for (let i = 0; i < 3; i++) line(ctx, -130, 55 + i * 45, 130, 55 + i * 45, 4, '#e9e0cc');
  ctx.save(); ctx.translate(-150, 0); ctx.rotate(-open * .6);
  ctx.beginPath(); ctx.rect(0, -50, 300, 50); fillStroke(ctx, '#1d1b22', 7);
  ctx.save(); ctx.beginPath(); ctx.rect(0, -50, 300, 50); ctx.clip(); for (let i = 0; i < 7; i++) { path(ctx, [[i * 55, -50], [i * 55 + 28, -50], [i * 55 + 0, 0], [i * 55 - 28, 0]]); ctx.fillStyle = '#f4f4f4'; ctx.fill(); } ctx.restore();
  ctx.restore(); ctx.restore();
}
function stamp(ctx, x, y, s, label, rot = -.15, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  rrect(ctx, -300, -80, 600, 160, 18); ctx.lineWidth = 16; ctx.strokeStyle = '#d22a2a'; ctx.stroke();
  text(ctx, label, 0, 6, 96, '#d22a2a', INK, 0, 'Poppins', 700); ctx.restore();
}
function tally(ctx, x, y, n, s = 1) {
  for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5; const gx = x + (g % 4) * 120 * s, gy = y + Math.floor(g / 4) * 120 * s;
    if (k < 4) line(ctx, gx + k * 22 * s, gy, gx + k * 22 * s + 4 * s, gy + 80 * s, 9 * s, '#f4f0e6');
    else line(ctx, gx - 12 * s, gy + 58 * s, gx + 82 * s, gy + 18 * s, 9 * s, '#f4f0e6'); }
}
function flameIcon(ctx, x, y, r, t) {
  const f = 1 + Math.sin(t * 20) * .05;
  ctx.beginPath(); ctx.moveTo(x, y - r * 1.3 * f); ctx.quadraticCurveTo(x + r * 1.1, y - r * .1, x + r * .7, y + r * .7); ctx.quadraticCurveTo(x, y + r * 1.1, x - r * .7, y + r * .7); ctx.quadraticCurveTo(x - r * 1.1, y - r * .1, x, y - r * 1.3 * f);
  fillStroke(ctx, '#ff6a2a', r * .1);
  ctx.beginPath(); ctx.moveTo(x, y - r * .5 * f); ctx.quadraticCurveTo(x + r * .55, y + r * .2, x + r * .3, y + r * .6); ctx.quadraticCurveTo(x, y + r * .8, x - r * .3, y + r * .6); ctx.quadraticCurveTo(x - r * .55, y + r * .2, x, y - r * .5 * f);
  ctx.fillStyle = '#ffd23a'; ctx.fill();
}
function targetIcon(ctx, x, y, r) {
  for (const [k, c] of [[1, '#f4f4f4'], [.72, '#2f63c9'], [.45, '#f4f4f4'], [.2, '#2f63c9']]) { circle(ctx, x, y, r * k); fillStroke(ctx, c, r * .08); }
  line(ctx, x - r * 1.2, y, x - r * .1, y, r * .06, INK); line(ctx, x + r * .1, y, x + r * 1.2, y, r * .06, INK); line(ctx, x, y - r * 1.2, x, y - r * .1, r * .06, INK); line(ctx, x, y + r * .1, x, y + r * 1.2, r * .06, INK);
}
function arrowR(ctx, x, y, len, a = 1, col = '#fff') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const L = len * a;
  path(ctx, [[x, y - 22], [x + L - 50, y - 22], [x + L - 50, y - 50], [x + L, y], [x + L - 50, y + 50], [x + L - 50, y + 22], [x, y + 22]]); fillStroke(ctx, col, 7); ctx.restore();
}
function dashedFigure(ctx, x, y, s, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([22, 18]); ctx.lineWidth = 9; ctx.strokeStyle = '#f4f0e6'; ctx.lineCap = 'round';
  circle(ctx, x, y - .765 * s, .19 * s); ctx.stroke(); rrect(ctx, x - .125 * s, y - .62 * s, .25 * s, .35 * s, .1 * s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - .055 * s, y - .3 * s); ctx.lineTo(x - .08 * s, y); ctx.moveTo(x + .055 * s, y - .3 * s); ctx.lineTo(x + .08 * s, y); ctx.stroke();
  ctx.setLineDash([]); text(ctx, '?', x, y - .765 * s, .22 * s, '#f4f0e6', INK, 10, 'Poppins', 700); ctx.restore();
}
function wellBG(ctx, cam, t, rise) {
  applyCam(ctx, cam, .5); ctx.fillStyle = '#2a2430'; ctx.fillRect(-1000, -1000, 3080, 3920);
  for (let r = 0; r < 26; r++) for (let c = 0; c < 9; c++) { rrect(ctx, -200 + c * 180 + (r % 2) * 90, -300 + r * 95, 170, 85, 14); ctx.fillStyle = mix('#3e3646', '#5a4f63', ((r * 7 + c * 3) % 5) / 5); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#1b1720'; ctx.stroke(); }
  // light from the top
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, -200, 50, 540, -200, 1400); g.addColorStop(0, `rgba(255,240,190,${.55 + rise * .3})`); g.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = g; ctx.fillRect(-500, -900, 2100, 2800); ctx.restore();
}
