// ---------- prison world: walls, bars, cameras, yard, HUD ----------
const ORANGE = ['#f2771f', '#f2771f'], ORANGE2 = ['#d9611a', '#d9611a'], NAVY = ['#2b3f86', '#2b3f86'];
const STEEL = '#6f7a8c', STEEL_D = '#4a5262', CONCRETE = '#9aa3b4', CONCRETE_D = '#7c869a';
const RED = '#e0392f', YEL = '#ffd23a', GREEN = '#3fbf5b';

// px-sized text inside a scaled stick (hooks run in stick units)
function tinyText(ctx, str, x, y, size, fill = '#fff', stroke = INK, sw = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(.001, .001); text(ctx, str, 0, 0, size, fill, stroke, sw); ctx.restore();
}
function drawGuardCap(ctx, hx, hy, hr, lw, col = '#22336e') {
  const top = hy - hr * .55;
  ctx.beginPath(); ctx.moveTo(hx - hr * 1.0, top + .01); ctx.lineTo(hx - hr * 1.15, top - .13); ctx.quadraticCurveTo(hx, top - .22, hx + hr * 1.15, top - .13); ctx.lineTo(hx + hr * 1.0, top + .01); ctx.closePath(); fillStroke(ctx, col, lw);
  rrect(ctx, hx - hr * 1.0, top - .035, hr * 2, .045, .01); fillStroke(ctx, '#111827', lw);
  ctx.beginPath(); ctx.moveTo(hx - hr * .2, top + .005); ctx.quadraticCurveTo(hx + hr * .7, top + .06, hx + hr * 1.25, top + .02); ctx.lineTo(hx + hr * 1.1, top - .01); ctx.closePath(); fillStroke(ctx, '#111827', lw * .8);
  star5(ctx, hx, top - .1, .032, 0, '#f2c230');
}
function drawBeanie(ctx, hx, hy, hr, lw, col = '#5d6577') {
  const sh = () => { ctx.beginPath(); ctx.arc(hx, hy - hr * .05, hr * 1.04, Math.PI * 1.08, Math.PI * 1.92); ctx.closePath(); };
  sh(); fillStroke(ctx, col, lw);
  ctx.save(); sh(); ctx.clip(); for (let i = -5; i <= 5; i++) line(ctx, hx + i * .035, hy - hr * 1.2, hx + i * .035, hy, .007, 'rgba(0,0,0,.18)'); ctx.restore();
  rrect(ctx, hx - hr * 1.02, hy - hr * .52, hr * 2.04, .07, .03); fillStroke(ctx, mix(col, '#000000', .15), lw);
}
const vetFace = (ctx, hx, hy, hr) => {
  // stubble beard + scar
  ctx.beginPath(); ctx.arc(hx, hy + .01, hr * .98, .25, Math.PI - .25); ctx.quadraticCurveTo(hx, hy + .05, hx + hr * .95, hy + hr * .25); ctx.closePath();
  ctx.fillStyle = 'rgba(70,60,60,.55)'; ctx.fill();
  line(ctx, hx + .12, hy + .02, hx + .08, hy + .1, .012, '#b0504a');
  for (let i = 0; i < 3; i++) line(ctx, hx + .118 - i * .014, hy + .035 + i * .025, hx + .085 - i * .014, hy + .04 + i * .025, .007, '#b0504a');
};
const numPatch = num => (ctx, o) => { rrect(ctx, -.075, -.575, .15, .06, .01); fillStroke(ctx, '#f6f2ea', .009); ctx.save(); if (o && o.flip < 0) ctx.scale(-1, 1); tinyText(ctx, num, 0, -.544, 40, INK); ctx.restore(); };
const badge = ctx => { star5(ctx, -.06, -.55, .03, 0, '#f2c230'); rrect(ctx, .02, -.57, .06, .02, .005); fillStroke(ctx, '#e8edf5', .006); };
const HERO = { cols: ORANGE, hat: 'none', belt: false, body: numPatch('402') };
const GUARD = { cols: NAVY, hat: 'guard', body: badge };
const VET = { cols: ORANGE2, hat: 'beanie', hatCol: '#5d6577', belt: false, headExtra: vetFace, body: numPatch('117') };
const INMATE = { cols: ORANGE, hat: 'none', belt: false };

// rifle held in the right hand (prop hook)
const rifle = (c, k, h, a, side) => { if (k !== 'R') return; c.save(); c.translate(h[0], h[1]); c.rotate(-side * 2.2); rrect(c, -.02, -.2, .04, .42, .01); fillStroke(c, '#2c2f38', .01); rrect(c, -.03, .12, .06, .12, .015); fillStroke(c, '#6b4a2a', .01); rrect(c, -.008, -.36, .016, .18, .005); fillStroke(c, '#2c2f38', .008); c.restore(); };
const baton = (c, k, h, a, side) => { if (k !== 'R') return; c.save(); c.translate(h[0], h[1]); c.rotate(-side * 2.5); rrect(c, -.014, -.26, .028, .28, .012); fillStroke(c, '#22242c', .01); c.restore(); };

// ---------- architecture ----------
function drawBlockWall(ctx, top, bottom, col = CONCRETE, x0 = -800, x1 = 1880, bw = 180, bh = 90) {
  ctx.fillStyle = col; ctx.fillRect(x0, top, x1 - x0, bottom - top);
  ctx.strokeStyle = 'rgba(30,30,50,.22)'; ctx.lineWidth = 4;
  for (let r = 0, y = top; y < bottom; r++, y += bh) {
    line(ctx, x0, y, x1, y, 4, 'rgba(30,30,50,.22)');
    for (let x = x0 + (r % 2) * bw / 2; x < x1; x += bw) line(ctx, x, y, x, Math.min(bottom, y + bh), 4, 'rgba(30,30,50,.18)');
  }
  const g = ctx.createLinearGradient(0, bottom - 260, 0, bottom); g.addColorStop(0, 'rgba(20,20,40,0)'); g.addColorStop(1, 'rgba(20,20,40,.28)');
  ctx.fillStyle = g; ctx.fillRect(x0, bottom - 260, x1 - x0, 260);
}
function drawFloor(ctx, y, col = '#5f6878', x0 = -800, x1 = 1880, bottom = 2600) {
  ctx.fillStyle = col; ctx.fillRect(x0, y, x1 - x0, bottom - y);
  line(ctx, x0, y, x1, y, 8);
  for (let i = -8; i <= 8; i++) line(ctx, 540 + i * 140, y, 540 + i * 520, bottom, 4, 'rgba(0,0,0,.14)');
  for (let k = 1; k < 6; k++) { const yy = y + (bottom - y) * Math.pow(k / 6, 1.8); line(ctx, x0, yy, x1, yy, 4, 'rgba(0,0,0,.12)'); }
}
function drawBars(ctx, x0, x1, top, bottom, gap = 110, o = {}) {
  const bw = o.bw || 30, col = o.col || STEEL;
  for (let x = x0; x <= x1 + 1; x += gap) {
    rrect(ctx, x - bw / 2, top, bw, bottom - top, bw / 2); fillStroke(ctx, col, 6);
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(x - bw / 2 + 6, top + 10, 6, bottom - top - 20);
  }
  for (const y of (o.cross || [top + 40, bottom - 60])) { rrect(ctx, x0 - 40, y - 18, x1 - x0 + 80, 36, 8); fillStroke(ctx, o.crossCol || STEEL_D, 6); for (let x = x0; x <= x1; x += gap) { circle(ctx, x, y, 7); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill(); } }
  if (o.lock) { rrect(ctx, o.lock[0] - 50, o.lock[1] - 60, 100, 120, 14); fillStroke(ctx, '#3a404e', 6); circle(ctx, o.lock[0], o.lock[1] - 8, 14); ctx.fillStyle = INK; ctx.fill(); rrect(ctx, o.lock[0] - 6, o.lock[1], 12, 30, 4); ctx.fill(); }
}
function drawBunk(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const lx of [-230, 230]) { rrect(ctx, lx - 12, -260, 24, 260, 6); fillStroke(ctx, STEEL_D, 5); }
  rrect(ctx, -250, -170, 500, 40, 10); fillStroke(ctx, STEEL, 5);
  rrect(ctx, -240, -215, 480, 55, 22); fillStroke(ctx, '#c9cfd9', 5);
  rrect(ctx, -225, -250, 130, 45, 20); fillStroke(ctx, '#f2f2ee', 5);
  ctx.restore();
}
function drawToilet(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -55, -170, 110, 90, 14); fillStroke(ctx, '#c8ced8', 5);
  ctx.beginPath(); ctx.moveTo(-80, -95); ctx.lineTo(80, -95); ctx.quadraticCurveTo(70, -10, 30, 0); ctx.lineTo(-30, 0); ctx.quadraticCurveTo(-70, -10, -80, -95); fillStroke(ctx, '#dde2ea', 5);
  ellipse(ctx, 0, -95, 80, 16); fillStroke(ctx, '#b4bcc8', 5);
  ctx.restore();
}
function drawBarredWindow(ctx, x, y, w, h, t, glow = 1) {
  rrect(ctx, x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, 10); fillStroke(ctx, CONCRETE_D, 6);
  const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, '#5cc2f5'); g.addColorStop(1, '#d9f3ff');
  rrect(ctx, x - w / 2, y - h / 2, w, h, 6); ctx.fillStyle = g; ctx.fill(); drawCloud(ctx, x - w * .15 + Math.sin(t * .3) * 10, y, w * .18, 3);
  ctx.save(); rrect(ctx, x - w / 2, y - h / 2, w, h, 6); ctx.clip();
  for (let i = 1; i < 4; i++) { const bx = x - w / 2 + i * w / 4; rrect(ctx, bx - 8, y - h / 2, 16, h, 6); fillStroke(ctx, STEEL, 4); }
  ctx.restore(); rrect(ctx, x - w / 2, y - h / 2, w, h, 6); fillStroke(ctx, null, 6);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; path(ctx, [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w * 1.6, y + 1400], [x - w * .1, y + 1400]]); const lg = ctx.createLinearGradient(0, y, 0, y + 1400); lg.addColorStop(0, `rgba(255,240,190,${.22 * glow})`); lg.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = lg; ctx.fill(); ctx.restore(); }
}
function drawCellPlate(ctx, x, y, num, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -120, -55, 240, 110, 14); fillStroke(ctx, '#f4efe2', 7);
  rrect(ctx, -105, -42, 210, 84, 8); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.stroke();
  text(ctx, num, 0, 4, 70, INK);
  for (const sx of [-95, 95]) { circle(ctx, sx, -30, 6); ctx.fillStyle = '#8a8f99'; ctx.fill(); }
  ctx.restore();
}
function drawBulb(ctx, x, y, len, t, sw = .2, on = 1) {
  const a = Math.sin(t * 2.2) * sw; const bx = x + Math.sin(a) * len, by = y + Math.cos(a) * len;
  line(ctx, x, y, bx, by, 5);
  if (on > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(bx, by + 30, 10, bx, by + 30, 700); g.addColorStop(0, `rgba(255,220,140,${.55 * on})`); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(bx - 800, by - 700, 1600, 1600); ctx.restore(); }
  rrect(ctx, bx - 16, by - 6, 32, 26, 5); fillStroke(ctx, '#6b6f78', 5);
  circle(ctx, bx, by + 44, 30); fillStroke(ctx, on > 0 ? '#fff1b8' : '#8c8a80', 6);
}

// ---------- security ----------
function drawCamera(ctx, x, y, s, ang, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.cone) {
    ctx.save(); ctx.rotate(ang); const L = o.coneLen || 1100, sp = o.coneSpread || .32;
    path(ctx, [[60, 0], [L, -L * sp], [L, L * sp]]);
    const g = ctx.createLinearGradient(60, 0, L, 0); g.addColorStop(0, `rgba(255,70,60,${.42 * o.cone})`); g.addColorStop(1, 'rgba(255,70,60,0)'); ctx.fillStyle = g; ctx.fill(); ctx.restore();
  }
  rrect(ctx, -26, -90, 52, 60, 8); fillStroke(ctx, '#c4cad4', 6);
  line(ctx, 0, -30, 0, 0, 14, INK); line(ctx, 0, -30, 0, 0, 6, '#c4cad4');
  ctx.rotate(ang);
  rrect(ctx, -70, -42, 190, 84, 18); fillStroke(ctx, '#eef1f5', 7);
  rrect(ctx, -84, -52, 160, 22, 10); fillStroke(ctx, '#cfd5de', 6);
  rrect(ctx, 110, -30, 34, 60, 8); fillStroke(ctx, '#3a404e', 6);
  circle(ctx, 140, 0, 20); fillStroke(ctx, '#151821', 5); circle(ctx, 134, -6, 6); ctx.fillStyle = '#7fb6ff'; ctx.fill();
  const on = Math.sin(t * 8) > 0 ? 1 : .25; circle(ctx, -30, 10, 11); ctx.fillStyle = `rgba(255,50,40,${on})`; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}
function drawPadlock(ctx, x, y, s, shut = 1, col = '#f2c230') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, -60 - (1 - shut) * 40, 55, Math.PI, 0); ctx.lineTo(55, -60 + (1 - shut) * 0); ctx.moveTo(-55, -60 - (1 - shut) * 40); ctx.lineTo(-55, -40 - (1 - shut) * 40);
  ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = '#b8bec9'; ctx.stroke();
  rrect(ctx, -90, -60, 180, 150, 24); fillStroke(ctx, col, 8);
  ctx.save(); rrect(ctx, -90, -60, 180, 150, 24); ctx.clip(); ctx.fillStyle = 'rgba(80,30,0,.18)'; ctx.fillRect(30, -70, 80, 180); ctx.restore();
  circle(ctx, 0, 0, 18); ctx.fillStyle = INK; ctx.fill(); rrect(ctx, -8, 5, 16, 40, 6); ctx.fill();
  ctx.restore();
}
function alertColor(v) { return v < .34 ? GREEN : v < .67 ? YEL : RED; }
// HUD: day counter + alert meter, top of frame (screen space)
function drawHUD(ctx, o) {
  const a = o.a == null ? 1 : o.a; if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  const y = o.y || 300, sl = (1 - a) * -60;
  ctx.translate(0, sl);
  // day pill
  rrect(ctx, 110, y - 52, 380, 104, 52); fillStroke(ctx, '#151821', 8, '#000');
  text(ctx, `DIA ${o.day || 1}/10`, 300, y + 2, 58, '#fff', INK, 0);
  // alert pill
  const v = o.alert || 0, col = alertColor(v), pulse = v > .6 ? .5 + .5 * Math.sin((o.t || 0) * 14) : 0;
  rrect(ctx, 520, y - 52, 450, 104, 52); fillStroke(ctx, mix('#151821', '#5a0e0e', pulse * .8), 8, '#000');
  text(ctx, `ALERTA: ${Math.round(v * 100)}%`, 745, y - 14, 44, '#fff', INK, 0);
  rrect(ctx, 575, y + 18, 340, 18, 9); ctx.fillStyle = '#2d3240'; ctx.fill();
  if (v > 0) { rrect(ctx, 575, y + 18, Math.max(18, 340 * v), 18, 9); ctx.fillStyle = col; ctx.fill(); }
  circle(ctx, 560, y - 14, 10); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}
// big alert gauge (explainer)
function drawGauge(ctx, cx, cy, r, v, t) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.beginPath(); ctx.arc(0, 0, r + 40, Math.PI, 0); ctx.lineTo(r + 40, 60); ctx.lineTo(-r - 40, 60); ctx.closePath(); fillStroke(ctx, '#1b1f2a', 10);
  const segs = 24;
  for (let i = 0; i < segs; i++) {
    const a0 = Math.PI + i / segs * Math.PI + .02, a1 = Math.PI + (i + 1) / segs * Math.PI - .02, k = (i + .5) / segs;
    ctx.beginPath(); ctx.arc(0, 0, r, a0, a1); ctx.arc(0, 0, r * .72, a1, a0, true); ctx.closePath();
    const lit = k <= v + .001;
    ctx.fillStyle = lit ? alertColor(k) : '#333949'; ctx.fill();
  }
  const na = Math.PI + v * Math.PI + Math.sin(t * 30) * .01 * (v > .5 ? 1 : 0);
  ctx.save(); ctx.rotate(na); path(ctx, [[0, -16], [r * .92, 0], [0, 16]]); fillStroke(ctx, '#f6f2ea', 6); ctx.restore();
  circle(ctx, 0, 0, 34); fillStroke(ctx, '#f6f2ea', 8);
  text(ctx, `${Math.round(v * 100)}%`, 0, -r * .36, 110, '#fff', INK, 16);
  ctx.restore();
}
function sirenGlow(ctx, a, t) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const k = .5 + .5 * Math.sin(t * 12); ctx.globalAlpha = a * (.25 + .3 * k); const g = ctx.createRadialGradient(540, 960, 300, 540, 960, 1300); g.addColorStop(0, 'rgba(255,0,0,0)'); g.addColorStop(1, 'rgba(255,20,20,1)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }

// ---------- props ----------
function drawKeycard(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -80, -52, 160, 104, 14); fillStroke(ctx, '#f6f8fb', 6);
  ctx.save(); rrect(ctx, -80, -52, 160, 104, 14); ctx.clip(); ctx.fillStyle = '#2f63c9'; ctx.fillRect(-80, -52, 160, 32); ctx.restore();
  rrect(ctx, -60, -8, 40, 32, 6); fillStroke(ctx, '#f2c230', 4); line(ctx, -60, 8, -20, 8, 3); line(ctx, -40, -8, -40, 24, 3);
  rrect(ctx, 0, -2, 60, 10, 4); ctx.fillStyle = '#9aa3b4'; ctx.fill(); rrect(ctx, 0, 16, 44, 10, 4); ctx.fill();
  text(ctx, 'ACESSO', 0, -36, 20, '#fff', INK, 0);
  ctx.restore();
}
function drawSpoon(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -11, 0, 22, 190, 11); fillStroke(ctx, '#f7f7f3', 6);
  ellipse(ctx, 0, -40, 44, 62); fillStroke(ctx, '#f7f7f3', 6);
  ellipse(ctx, -8, -50, 22, 36, -.2); ctx.fillStyle = 'rgba(150,170,200,.35)'; ctx.fill();
  ctx.restore();
}
function drawWallClock(ctx, x, y, r, t, speed = 1) {
  circle(ctx, x, y, r + 14); fillStroke(ctx, '#3a404e', 8); circle(ctx, x, y, r); fillStroke(ctx, '#fbf8f0', 6);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(ctx, x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78, x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9, i % 3 ? 5 : 9); }
  const m = t * speed * TAU, h = m / 12;
  line(ctx, x, y, x + Math.sin(h) * r * .45, y - Math.cos(h) * r * .45, 13);
  line(ctx, x, y, x + Math.sin(m) * r * .72, y - Math.cos(m) * r * .72, 8);
  const sa = t * speed * TAU * 6; line(ctx, x, y, x + Math.sin(sa) * r * .8, y - Math.cos(sa) * r * .8, 4, RED);
  circle(ctx, x, y, 11); ctx.fillStyle = INK; ctx.fill();
}
function drawCalendar(ctx, x, y, w, crossed, circleA, t) {
  rrect(ctx, x - w / 2, y - w * .62, w, w * 1.24, 26); fillStroke(ctx, '#fbf8f0', 10);
  ctx.save(); rrect(ctx, x - w / 2, y - w * .62, w, w * 1.24, 26); ctx.clip(); ctx.fillStyle = RED; ctx.fillRect(x - w / 2, y - w * .62, w, w * .22); ctx.restore();
  rrect(ctx, x - w / 2, y - w * .62, w, w * 1.24, 26); fillStroke(ctx, null, 10);
  text(ctx, 'FUGA', x, y - w * .51, w * .1, '#fff', INK, 0);
  for (const sx of [-.3, .3]) { rrect(ctx, x + sx * w - 12, y - w * .7, 24, 60, 10); fillStroke(ctx, '#9aa3b4', 6); }
  const cw = w * .82 / 5, ch = w * .36;
  for (let i = 0; i < 10; i++) {
    const cx = x - w * .41 + (i % 5 + .5) * cw, cy = y - w * .12 + Math.floor(i / 5) * ch * 1.05 + ch * .3;
    rrect(ctx, cx - cw * .44, cy - ch * .42, cw * .88, ch * .84, 10); fillStroke(ctx, i === 9 ? '#ffe0dc' : '#fff', 5);
    text(ctx, String(i + 1), cx, cy - ch * .08, w * .075, INK, INK, 0);
    const c = clamp(crossed - i);
    if (c > 0) { const k = c; ctx.save(); ctx.globalAlpha = .9; line(ctx, cx - 30, cy - 30, lerp(cx - 30, cx + 30, clamp(k * 2)), lerp(cy - 30, cy + 30, clamp(k * 2)), 12, RED); if (k > .5) line(ctx, cx + 30, cy - 30, lerp(cx + 30, cx - 30, clamp(k * 2 - 1)), lerp(cy - 30, cy + 30, clamp(k * 2 - 1)), 12, RED); ctx.restore(); }
    if (i === 9 && circleA > 0) { ctx.beginPath(); ctx.ellipse(cx, cy, cw * .62, ch * .6, -.1, -Math.PI / 2, -Math.PI / 2 + TAU * circleA); ctx.lineWidth = 12; ctx.strokeStyle = RED; ctx.lineCap = 'round'; ctx.stroke(); }
  }
}
function drawPrisonBuilding(ctx, t, lights = 1) {
  // main block
  const base = 1240;
  rrect(ctx, 120, 720, 840, base - 720, 10); fillStroke(ctx, '#8a93a6', 10);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const wx = 185 + c * 112, wy = 790 + r * 108; rrect(ctx, wx, wy, 46, 62, 6); fillStroke(ctx, (r * 7 + c) % 5 === 0 ? '#ffe9a0' : '#2d3445', 5); line(ctx, wx + 23, wy, wx + 23, wy + 62, 4); }
  rrect(ctx, 430, 1090, 220, 150, 8); fillStroke(ctx, '#3a404e', 8); drawBars(ctx, 455, 625, 1100, 1235, 34, { bw: 12, cross: [1160] });
  rrect(ctx, 330, 650, 420, 80, 8); fillStroke(ctx, '#2d3445', 8); text(ctx, 'PRISÃO', 540, 692, 58, '#f2c230', INK, 0);
  // towers
  for (const tx of [60, 1020]) {
    path(ctx, [[tx - 70, base], [tx - 50, 640], [tx + 50, 640], [tx + 70, base]]); fillStroke(ctx, '#9aa3b4', 10);
    rrect(ctx, tx - 95, 540, 190, 110, 10); fillStroke(ctx, '#6f7a8c', 10); rrect(ctx, tx - 70, 565, 140, 50, 6); fillStroke(ctx, '#ffe9a0', 6);
    path(ctx, [[tx - 115, 545], [tx, 470], [tx + 115, 545]]); fillStroke(ctx, '#c4473a', 10);
  }
  // searchlight beams
  if (lights > 0) for (const [tx, ph] of [[60, 0], [1020, 2]]) {
    const a = Math.PI / 2 + Math.sin(t * .9 + ph) * .65; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(tx, 590); ctx.rotate(a - Math.PI / 2);
    path(ctx, [[-14, 0], [14, 0], [260, 1400], [-260, 1400]]); const g = ctx.createLinearGradient(0, 0, 0, 1400); g.addColorStop(0, `rgba(255,250,210,${.5 * lights})`); g.addColorStop(1, 'rgba(255,250,210,0)'); ctx.fillStyle = g; ctx.fill(); ctx.restore();
  }
  // outer wall + razor wire
  rrect(ctx, -200, base - 120, 1480, 240, 0); fillStroke(ctx, '#a8b0c0', 10);
  for (let x = -200; x < 1300; x += 70) { ctx.beginPath(); ctx.arc(x, base - 140, 30, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = '#3a404e'; ctx.stroke(); }
}
function drawChainFence(ctx, x0, x1, top, bottom, t = 0) {
  ctx.save(); ctx.beginPath(); ctx.rect(x0, top, x1 - x0, bottom - top); ctx.clip();
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(60,70,90,.75)'; const g = 46;
  for (let k = -40; k < 60; k++) { line(ctx, x0 + k * g, top, x0 + k * g + (bottom - top), bottom, 4, 'rgba(60,70,90,.7)'); line(ctx, x0 + k * g, top, x0 + k * g - (bottom - top), bottom, 4, 'rgba(60,70,90,.7)'); }
  ctx.restore();
  for (let x = x0; x <= x1; x += 300) { rrect(ctx, x - 12, top - 30, 24, bottom - top + 30, 8); fillStroke(ctx, '#8a93a6', 6); }
  rrect(ctx, x0 - 20, top - 14, x1 - x0 + 40, 24, 10); fillStroke(ctx, '#8a93a6', 6);
  for (let x = x0; x < x1; x += 56) { ctx.beginPath(); ctx.arc(x, top - 48, 26, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = '#3a404e'; ctx.stroke(); for (let s = 0; s < 4; s++) { const a = s * 1.6 + x; line(ctx, x + Math.cos(a) * 26, top - 48 + Math.sin(a) * 26, x + Math.cos(a) * 38, top - 48 + Math.sin(a) * 38, 4, '#3a404e'); } }
}
function drawWatchtower(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  path(ctx, [[-80, 0], [-50, -520], [50, -520], [80, 0]]); fillStroke(ctx, '#9aa3b4', 8);
  for (let i = 1; i < 5; i++) line(ctx, -78 + i * 6, -i * 100, 78 - i * 6, -i * 100, 5, 'rgba(0,0,0,.2)');
  rrect(ctx, -120, -650, 240, 140, 10); fillStroke(ctx, '#6f7a8c', 8); rrect(ctx, -95, -625, 190, 70, 6); fillStroke(ctx, '#2d3445', 6);
  path(ctx, [[-145, -645], [0, -740], [145, -645]]); fillStroke(ctx, '#c4473a', 8);
  ctx.restore();
}
function drawYardBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, '#3ea6ee', '#d4f0fb', -400, 1000);
  applyCam(ctx, cam, .1); drawSun(ctx, o.sunX || 860, o.sunY || 260, 80, t, 1.1);
  applyCam(ctx, cam, .15); drawCloud(ctx, 180 + t * 6, 330, 110, 1); drawCloud(ctx, 820 + t * 4, 520, 80, 2);
  applyCam(ctx, cam, .35);
  drawWatchtower(ctx, o.towerX || 150, 1010, .95, t);
  drawBlockWall(ctx, 700, 1010, '#a8b0c0', -800, 1880, 200, 100);
  for (let x = -800; x < 1880; x += 60) { ctx.beginPath(); ctx.arc(x, 680, 26, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = '#3a404e'; ctx.stroke(); }
  applyCam(ctx, cam, 1);
  const gy = o.ground || 1000;
  ctx.fillStyle = '#d9c49a'; ctx.fillRect(-800, gy, 2680, 1800); line(ctx, -800, gy, 1880, gy, 8);
  ctx.fillStyle = 'rgba(120,90,50,.12)'; for (let i = 0; i < 40; i++) { const R = rng(i + 3); ellipse(ctx, R() * 1800 - 300, gy + 60 + R() * 1200, 30 + R() * 60, 8 + R() * 10); ctx.fill(); }
  // painted court lines
  ctx.save(); ctx.globalAlpha = .6; ctx.beginPath(); ctx.ellipse(540, gy + 520, 420, 120, 0, 0, TAU); ctx.lineWidth = 10; ctx.strokeStyle = '#fff8e8'; ctx.stroke(); ctx.restore();
}
function drawBoxedText(ctx, str, x, y, size, fill = '#fff', bg = '#151821', pad = 30, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(str).width + pad * 2;
  rrect(ctx, -w / 2, -size * .75, w, size * 1.5, size * .35); fillStroke(ctx, bg, 8);
  text(ctx, str, 0, 2, size, fill, INK, 0); ctx.restore();
}
function drawHeart(ctx, x, y, s, fill = RED) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -40, -60, 0, -30); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); ctx.closePath(); fillStroke(ctx, fill, 6 / s * .9); ctx.restore();
}
function drawBubble(ctx, x, y, w, h, fill = '#fff') {
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 40); ctx.moveTo(x - w * .25, y + h / 2 - 2); ctx.lineTo(x - w * .32, y + h / 2 + 60); ctx.lineTo(x - w * .1, y + h / 2 - 2); fillStroke(ctx, fill, 8);
}
function speedLines(ctx, cx, cy, a, t, n = 26) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const R = rng(Math.floor(t * 12) + 5);
  for (let i = 0; i < n; i++) { const ang = R() * TAU, r0 = 600 + R() * 200; line(ctx, cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0, cx + Math.cos(ang) * 1500, cy + Math.sin(ang) * 1500, 6 + R() * 10, 'rgba(255,255,255,.8)'); }
  ctx.restore();
}
function caribbeanHeat(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(900, 200, 50, 900, 200, 1500); g.addColorStop(0, `rgba(255,220,120,${.55 * a})`); g.addColorStop(1, `rgba(255,170,60,${.12 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
