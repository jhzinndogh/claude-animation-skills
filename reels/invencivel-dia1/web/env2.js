// ---------- props for "Dia 1 sendo o Mark" ----------
const MARK = { cols: ['#2f6fd6', '#2f6fd6'], hat: 'hair', hatCol: '#1d1a22', hairStyle: 'spiky', belt: false };
const WORKMARK = { cols: ['#e23a2f', '#f6f1e8'], hat: 'hair', hatCol: '#1d1a22', hairStyle: 'spiky', belt: false };
const NOLAN = { cols: ['#f4f1ec', '#f4f1ec'], hat: 'hair', hatCol: '#1d1a22', hairStyle: 'slick', belt: false, stache: true };
const NOLAN_HOME = { cols: ['#5b6b7c', '#5b6b7c'], hat: 'hair', hatCol: '#1d1a22', hairStyle: 'slick', belt: false, stache: true };
const MOM = { cols: ['#8a4fc2', '#8a4fc2'], hat: 'hair', hatCol: '#b5492f', hairStyle: 'long', belt: false };

function drawCape(ctx, x, y, s, t, dir = 1, len = 1, col = '#d42b2b') {
  // cape hanging from the shoulders of a stick at (x,y) size s; dir = wind direction
  const sx = x, sy = y - .55 * s; const w = Math.sin(t * 9) * .04;
  ctx.beginPath(); ctx.moveTo(sx - .12 * s, sy);
  ctx.quadraticCurveTo(sx - dir * (.3 + w) * s, sy + .25 * s * len, sx - dir * (.55 + w) * s * len, sy + .45 * s * len);
  ctx.lineTo(sx - dir * (.35 - w) * s * len, sy + .52 * s * len);
  ctx.quadraticCurveTo(sx - dir * .05 * s, sy + .3 * s, sx + .12 * s, sy);
  ctx.closePath(); fillStroke(ctx, col, s * .016);
}
function brickWall(ctx, x0, y0, x1, y1, col = '#b55a3c') {
  ctx.fillStyle = col; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = 'rgba(60,20,20,.35)'; ctx.lineWidth = 4;
  for (let r = 0, y = y0; y < y1; y += 60, r++) { line(ctx, x0, y, x1, y, 4, 'rgba(60,20,20,.35)'); for (let x = x0 + (r % 2) * 60; x < x1; x += 120) line(ctx, x, y, x, y + 60, 4, 'rgba(60,20,20,.35)'); }
}
function burgerSign(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -260, -80, 520, 160, 30); fillStroke(ctx, '#ffcf3a', 10);
  text(ctx, 'BURGER MART', 0, 4, 66, '#d8312b', INK, 10, 'Poppins', 700);
  // burger icon
  ctx.translate(0, -150); ctx.beginPath(); ctx.ellipse(0, 0, 80, 45, 0, Math.PI, 0); fillStroke(ctx, '#e8a33a', 8);
  rrect(ctx, -85, 0, 170, 20, 8); fillStroke(ctx, '#5a2e1a', 7); rrect(ctx, -80, 20, 160, 22, 10); fillStroke(ctx, '#e8a33a', 7);
  ctx.restore();
}
function dumpster(ctx, x, y, s, lid = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 230, 26); ctx.fillStyle = 'rgba(30,20,30,.25)'; ctx.fill();
  path(ctx, [[-200, 0], [-220, -230], [220, -230], [200, 0]]); fillStroke(ctx, '#2f8a4e', 8);
  ctx.save(); path(ctx, [[-200, 0], [-220, -230], [220, -230], [200, 0]]); ctx.clip(); ctx.fillStyle = 'rgba(0,30,10,.25)'; ctx.fillRect(60, -240, 200, 260); ctx.restore();
  for (const bx of [-120, 0, 120]) line(ctx, bx, -200, bx * .95, -20, 6, 'rgba(0,40,20,.4)');
  ctx.save(); ctx.translate(-225, -235); ctx.rotate(-lid); rrect(ctx, 0, -18, 450, 26, 8); fillStroke(ctx, '#246e3d', 8); ctx.restore();
  ctx.restore();
}
function trashBag(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-10, -70); ctx.bezierCurveTo(-90, -40, -95, 60, 0, 62); ctx.bezierCurveTo(95, 60, 90, -40, 10, -70); ctx.closePath(); fillStroke(ctx, '#2b2b33', 7);
  ctx.beginPath(); ctx.moveTo(-10, -70); ctx.lineTo(-30, -100); ctx.lineTo(0, -82); ctx.lineTo(30, -100); ctx.lineTo(10, -70); ctx.closePath(); fillStroke(ctx, '#2b2b33', 6);
  ellipse(ctx, -30, -10, 16, 30, .3); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill();
  ctx.restore();
}
function rocketTrail(ctx, x, y, len, t, ang = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  for (let i = 0; i < 8; i++) { const k = i / 8; puff(ctx, Math.sin(t * 20 + i) * 12, 60 + k * len, 40 + k * 50, t, i < 2 ? '#ffd23a' : '#f3efe6', i + 3, 1 - k * .6); }
  ctx.restore();
}
function stars(ctx, t, n = 90, seed = 9) { const R = rng(seed); for (let i = 0; i < n; i++) { const x = R() * 1400 - 160, y = R() * 2200 - 140, r = 1.5 + R() * 3.5; circle(ctx, x, y, r * (.7 + .3 * Math.sin(t * 3 + i))); ctx.fillStyle = '#fff'; ctx.fill(); } }
function space(ctx) { const g = ctx.createLinearGradient(0, -200, 0, 2100); g.addColorStop(0, '#0b0726'); g.addColorStop(1, '#271a5a'); ctx.fillStyle = g; ctx.fillRect(-1000, -1000, 3080, 3920); }
function earth(ctx, x, y, r, t, tint = 0) {
  ctx.save(); circle(ctx, x, y, r * 1.05); ctx.fillStyle = 'rgba(120,200,255,.25)'; ctx.fill();
  circle(ctx, x, y, r); ctx.fillStyle = mix('#2f8fe0', '#7a1010', tint); ctx.fill();
  ctx.save(); circle(ctx, x, y, r); ctx.clip();
  const R = rng(4); ctx.fillStyle = mix('#4bbf5a', '#3a0808', tint);
  for (let i = 0; i < 9; i++) { const a = R() * TAU, d = R() * r * .8; const cx = x + Math.cos(a) * d + ((t * 20) % 200), cy = y + Math.sin(a) * d; ellipse(ctx, cx, cy, r * (.15 + R() * .2), r * (.08 + R() * .12), R() * 3); ctx.fill(); }
  ctx.fillStyle = 'rgba(10,10,40,.3)'; circle(ctx, x + r * .45, y + r * .35, r); ctx.fill();
  ctx.restore(); circle(ctx, x, y, r); fillStroke(ctx, null, r * .02); ctx.restore();
}
function speedLines(ctx, cx, cy, t, n = 26, col = 'rgba(255,255,255,.8)', r0 = 380) {
  const R = rng(21); for (let i = 0; i < n; i++) { const a = R() * TAU, r = r0 + ((t * 2200 + R() * 900) % 900); line(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, cx + Math.cos(a) * (r + 160), cy + Math.sin(a) * (r + 160), 6 + R() * 6, col); }
}
function vLines(ctx, t, col = 'rgba(255,255,255,.7)') { const R = rng(33); for (let i = 0; i < 22; i++) { const x = R() * 1080, y = ((R() * 2400 + t * 3000) % 2400) - 300; line(ctx, x, y, x, y + 200 + R() * 200, 5 + R() * 5, col); } }
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function room(ctx) {
  ctx.fillStyle = '#f2d9a8'; ctx.fillRect(-600, -600, 2280, 2000);
  ctx.fillStyle = '#e8c890'; for (let x = -600; x < 1700; x += 90) ctx.fillRect(x, -600, 40, 2000);
  ctx.fillStyle = '#8a5a3a'; ctx.fillRect(-600, 1350, 2280, 1200);
  // window at night
  rrect(ctx, 640, 260, 300, 340, 14); fillStroke(ctx, '#1f2a5a', 10); line(ctx, 790, 260, 790, 600, 8); line(ctx, 640, 430, 940, 430, 8);
  circle(ctx, 880, 330, 30); ctx.fillStyle = '#fff3b0'; ctx.fill();
  // lamp
  line(ctx, 300, -200, 300, 300, 6); ctx.beginPath(); ctx.moveTo(220, 380); ctx.lineTo(380, 380); ctx.lineTo(340, 300); ctx.lineTo(260, 300); ctx.closePath(); fillStroke(ctx, '#ffcf5a', 7);
}
function table(ctx, y = 1150) {
  rrect(ctx, -80, y, 1240, 70, 12); fillStroke(ctx, '#f6f1e8', 8);
  ctx.fillStyle = '#e04a3a'; for (let x = -80; x < 1160; x += 80) ctx.fillRect(x, y + 6, 40, 58);
  rrect(ctx, -80, y, 1240, 70, 12); fillStroke(ctx, null, 8);
  for (const px of [220, 540, 860]) { ellipse(ctx, px, y - 6, 90, 20); fillStroke(ctx, '#fff', 6); }
}
function choiceBox(ctx, x, y, w, h, n, label, a, hi = 0, col = '#ffcf3a') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); const s = .7 + .3 * backOut(clamp(a)) + hi * .06; ctx.scale(s, s);
  rrect(ctx, -w / 2 + 10, -h / 2 + 14, w, h, 26); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, 26); fillStroke(ctx, hi ? col : '#fff', 10);
  circle(ctx, -w / 2 + 70, 0, 46); fillStroke(ctx, hi ? '#fff' : col, 8); text(ctx, String(n), -w / 2 + 70, 3, 58, INK);
  text(ctx, label, -w / 2 + 140, 2, 50, INK, INK, 0, 'Poppins', 700, 'left');
  ctx.restore();
}
function bloodSplat(ctx, x, y, r, p, seed = 3) {
  if (p <= 0) return; const R = rng(seed); ctx.save(); ctx.fillStyle = '#b0101a';
  circle(ctx, x, y, r * p); ctx.fill();
  for (let i = 0; i < 14; i++) { const a = R() * TAU, d = r * (.8 + R() * 1.4) * p; circle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, r * (.08 + R() * .2) * p); ctx.fill(); ctx.lineWidth = r * .12 * p; ctx.strokeStyle = '#b0101a'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * d * .9, y + Math.sin(a) * d * .9); ctx.stroke(); }
  for (let i = 0; i < 4; i++) { const dx = x - r * .6 + R() * r * 1.2; const dl = r * (.4 + R()) * p; ctx.fillRect(dx - 8, y, 16, dl); circle(ctx, dx, y + dl, 12); ctx.fill(); }
  ctx.restore();
}
