// ---------- sets & props for the Charles do Bronx reel ----------
const HOUSE_COLS = ['#f28a3a', '#3fb0d9', '#f2c12e', '#e8514a', '#7cc95a', '#c77ad8', '#f6e7c8', '#5a8ee0', '#ee7aa0'];
// a hillside of stacked, brightly painted brick houses
function drawFavela(ctx, baseY, t, o = {}) {
  const R = rng(o.seed || 11); const rows = o.rows || 6;
  // hill
  ctx.beginPath(); ctx.moveTo(-600, baseY + 200); ctx.quadraticCurveTo(200, baseY - rows * 150 - 260, 900, baseY - rows * 120); ctx.quadraticCurveTo(1300, baseY - rows * 90, 1700, baseY + 200); ctx.closePath(); fillStroke(ctx, '#5fae57', 6);
  for (let r = rows - 1; r >= 0; r--) {
    const y = baseY - r * 130; const n = 9 - Math.floor(r / 2);
    for (let i = 0; i < n; i++) {
      const w = 120 + R() * 70, h = 110 + R() * 50; const x = -380 + i * (1800 / n) + r * 40 + R() * 40;
      const col = R() < .35 ? '#c96b47' : HOUSE_COLS[Math.floor(R() * HOUSE_COLS.length)];
      rrect(ctx, x, y - h, w, h, 4); fillStroke(ctx, col, 5);
      ctx.save(); rrect(ctx, x, y - h, w, h, 4); ctx.clip(); ctx.fillStyle = 'rgba(40,10,30,.16)'; ctx.fillRect(x + w * .7, y - h, w, h); ctx.restore();
      // roof slab + water tank
      rrect(ctx, x - 6, y - h - 12, w + 12, 14, 3); fillStroke(ctx, '#b9b2a8', 4);
      if (R() < .4) { rrect(ctx, x + w * .55, y - h - 50, 42, 40, 6); fillStroke(ctx, '#2f7fd0', 4); }
      // windows / door
      const lit = o.night ? (Math.sin(i * 7 + r * 3 + t * .5) > 0 ? '#ffe08a' : '#3a3550') : '#2c3550';
      rrect(ctx, x + 18, y - h + 26, 30, 30, 3); fillStroke(ctx, lit, 4);
      if (w > 150) { rrect(ctx, x + 70, y - h + 26, 30, 30, 3); fillStroke(ctx, lit, 4); }
      if (R() < .5) { rrect(ctx, x + w - 46, y - 62, 30, 62, 3); fillStroke(ctx, '#7a4a2c', 4); }
    }
    // power lines
    ctx.beginPath(); ctx.moveTo(-600, y - 150); ctx.quadraticCurveTo(540, y - 100, 1700, y - 160); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(30,20,30,.6)'; ctx.stroke();
  }
}
function drawStreet(ctx, y, col = '#c9c2b4') {
  ctx.fillStyle = col; ctx.fillRect(-1000, y, 3200, 2000); line(ctx, -1000, y, 2200, y, 6);
  ctx.fillStyle = 'rgba(0,0,0,.06)'; for (let i = -10; i < 30; i++) ctx.fillRect(i * 140, y + 40, 70, 10);
}
function drawTray(ctx, x, y, s, ang = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  rrect(ctx, -110, -14, 220, 26, 8); fillStroke(ctx, '#c8ccd2', 5);
  // cheese wedges + coxinhas
  for (let i = 0; i < 3; i++) { path(ctx, [[-95 + i * 34, -14], [-70 + i * 34, -52], [-62 + i * 34, -14]]); fillStroke(ctx, '#ffd84a', 4); }
  for (let i = 0; i < 3; i++) { ctx.beginPath(); const cx = 15 + i * 32; ctx.moveTo(cx, -60); ctx.quadraticCurveTo(cx + 22, -20, cx + 14, -14); ctx.lineTo(cx - 14, -14); ctx.quadraticCurveTo(cx - 22, -20, cx, -60); fillStroke(ctx, '#d9822b', 4); }
  ctx.restore();
}
function drawRoomWall(ctx, top = '#bfe3d6', bot = '#a7d2c4', floorY = 1250, floor = '#e9e2d2') {
  ctx.fillStyle = top; ctx.fillRect(-1000, -1000, 3200, floorY + 1000);
  ctx.fillStyle = bot; ctx.fillRect(-1000, floorY - 260, 3200, 260); line(ctx, -1000, floorY - 260, 2200, floorY - 260, 5, 'rgba(30,20,30,.35)');
  ctx.fillStyle = floor; ctx.fillRect(-1000, floorY, 3200, 2000); line(ctx, -1000, floorY, 2200, floorY, 6);
}
function drawWindow(ctx, x, y, w, h, night = 0, t = 0) {
  rrect(ctx, x, y, w, h, 10); fillStroke(ctx, mix('#8fd3ff', '#1a1f4a', night), 8);
  ctx.save(); rrect(ctx, x, y, w, h, 10); ctx.clip();
  if (night < .5) { circle(ctx, x + w * .7, y + h * .3, 40); ctx.fillStyle = '#fff3b0'; ctx.fill(); drawCloud(ctx, x + w * .3 + t * 10 % w, y + h * .6, 50, 3); }
  else { circle(ctx, x + w * .3, y + h * .3, 34); ctx.fillStyle = '#f4f1dc'; ctx.fill(); circle(ctx, x + w * .3 + 14, y + h * .3 - 8, 30); ctx.fillStyle = mix('#8fd3ff', '#1a1f4a', night); ctx.fill(); for (let i = 0; i < 6; i++) sparkle(ctx, x + 40 + i * 47 % w, y + 30 + (i * 61) % (h - 40), 8, 1); }
  ctx.restore();
  line(ctx, x + w / 2, y, x + w / 2, y + h, 8); line(ctx, x, y + h / 2, x + w, y + h / 2, 8);
}
function drawBed(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const lx of [-300, 290]) { rrect(ctx, lx, -40, 16, 120, 6); fillStroke(ctx, '#9aa4b0', 5); }
  rrect(ctx, -330, -190, 26, 200, 8); fillStroke(ctx, '#c7cfd8', 5);
  rrect(ctx, -320, -80, 640, 60, 18); fillStroke(ctx, '#f8f8f4', 6);
  ctx.restore();
}
function drawBlanket(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-180, -60); ctx.quadraticCurveTo(0, -130, 320, -90); ctx.lineTo(320, -20); ctx.lineTo(-180, -20); ctx.closePath(); fillStroke(ctx, '#7fb6ea', 6); ctx.restore(); }
function drawIV(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 0, -520, 10, '#9aa4b0'); line(ctx, -50, 0, 50, 0, 10, '#9aa4b0'); line(ctx, -40, -520, 40, -520, 8, '#9aa4b0');
  rrect(ctx, -34, -510, 68, 100, 18); fillStroke(ctx, 'rgba(200,235,255,.9)', 5);
  ctx.beginPath(); ctx.moveTo(0, -410); ctx.quadraticCurveTo(60, -200, 160, -140); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(60,80,110,.6)'; ctx.stroke();
  ctx.restore();
}
function drawMonitor(ctx, x, y, s, t, bpm = 1.4) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -120, -90, 240, 180, 16); fillStroke(ctx, '#3a4250', 6); rrect(ctx, -100, -70, 200, 140, 8); fillStroke(ctx, '#0e1a18', 4);
  ctx.beginPath(); for (let i = 0; i <= 60; i++) { const px = -95 + i * 190 / 60; const ph = ((i / 60) * 2 - t * bpm) % 1; const p = ph < 0 ? ph + 1 : ph; let py = 10; if (p > .45 && p < .5) py = 10 - (p - .45) * 1400; else if (p >= .5 && p < .55) py = -60 + (p - .5) * 2000; else if (p >= .55 && p < .6) py = 40 - (p - .55) * 600; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.lineWidth = 5; ctx.strokeStyle = '#4dff9a'; ctx.stroke();
  ctx.restore();
}
function drawHeart(ctx, x, y, r, fill = '#e8514a', lw) {
  ctx.beginPath(); ctx.moveTo(x, y + r * .9); ctx.bezierCurveTo(x - r * 1.4, y - r * .1, x - r * .7, y - r * 1.1, x, y - r * .45); ctx.bezierCurveTo(x + r * .7, y - r * 1.1, x + r * 1.4, y - r * .1, x, y + r * .9); fillStroke(ctx, fill, lw || r * .09);
  ellipse(ctx, x - r * .45, y - r * .45, r * .18, r * .1, -.6); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill();
}
function drawWheelchair(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(ctx, 0, -110, 110); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); circle(ctx, 0, -110, 96); ctx.lineWidth = 5; ctx.strokeStyle = '#9aa4b0'; ctx.stroke();
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI; line(ctx, Math.cos(a) * -96, -110 + Math.sin(a) * -96, Math.cos(a) * 96, -110 + Math.sin(a) * 96, 3, '#9aa4b0'); }
  circle(ctx, 170, -25, 25); fillStroke(ctx, '#3a4250', 6);
  path(ctx, [[-40, -200], [150, -200], [170, -30]], false); ctx.lineWidth = 12; ctx.strokeStyle = '#3a6fc0'; ctx.stroke();
  path(ctx, [[-40, -200], [-80, -420], [-120, -430]], false); ctx.stroke();
  rrect(ctx, -40, -230, 180, 34, 10); fillStroke(ctx, '#2a4f9e', 5);
  ctx.restore();
}
function clipboard(ctx, h, side, ang = -.2) { ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(ang * side); rrect(ctx, -.06, -.17, .12, .16, .012); fillStroke(ctx, '#b9824a', .01); rrect(ctx, -.048, -.155, .096, .13, .006); fillStroke(ctx, '#fff', .006); for (let i = 0; i < 4; i++) line(ctx, -.035, -.13 + i * .027, .035, -.13 + i * .027, .006, '#9aa4b0'); ctx.restore(); }
// arena: dark bowl, spotlights, crowd, octagon fence + canvas floor
function drawArena(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .1); drawSky(ctx, '#0d0b1e', '#2b1d4a', -600, 1300);
  applyCam(ctx, cam, .25);
  // spotlight beams
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) { const sx = 100 + i * 290, sw = Math.sin(t * .7 + i * 1.7) * 160; const g = ctx.createLinearGradient(sx, -300, sx + sw, 1100); g.addColorStop(0, 'rgba(180,200,255,.32)'); g.addColorStop(1, 'rgba(180,200,255,0)'); ctx.fillStyle = g; path(ctx, [[sx - 20, -300], [sx + 20, -300], [sx + sw + 200, 1100], [sx + sw - 200, 1100]]); ctx.fill(); }
  ctx.restore();
  // crowd rows (silhouettes with flash bulbs)
  applyCam(ctx, cam, .4);
  const R = rng(5);
  for (let r = 0; r < 5; r++) for (let i = 0; i < 16; i++) {
    const x = -300 + i * 110 + (r % 2) * 55 + R() * 20, y = 520 + r * 85; const jump = (o.cheer || 0) * Math.abs(Math.sin(t * 9 + i * 1.3 + r)) * 26;
    ctx.fillStyle = mix('#3a2c5a', '#1a1430', r / 5); circle(ctx, x, y - 40 - jump, 30); ctx.fill(); rrect(ctx, x - 38, y - 12 - jump, 76, 90, 26); ctx.fill();
    if ((o.cheer || 0) > .5 && (i + r) % 3 === 0) { line(ctx, x - 25, y - jump, x - 45, y - 90 - jump, 14, mix('#3a2c5a', '#1a1430', r / 5)); }
    if (Math.sin(t * 23 + i * 17.3 + r * 7.7) > .985 - (o.flashes || 0) * .05) sparkle(ctx, x, y - 40, 34, 1);
  }
  applyCam(ctx, cam, 1);
  // octagon floor
  const fy = o.floorY || 1230;
  ctx.beginPath(); ctx.moveTo(-500, fy); ctx.lineTo(1580, fy); ctx.lineTo(1900, 2600); ctx.lineTo(-820, 2600); ctx.closePath(); fillStroke(ctx, '#e9e4da', 6);
  ctx.save(); ctx.clip(); ctx.globalAlpha = .5; ellipse(ctx, 540, fy + 420, 520, 160); ctx.lineWidth = 10; ctx.strokeStyle = '#c8302c'; ctx.stroke(); ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(540, fy + 300, 50, 540, fy + 300, 1100); g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(20,10,40,.35)'); ctx.fillStyle = g; ctx.fillRect(-900, fy, 2900, 2000); ctx.restore();
  // fence behind fighters
  ctx.fillStyle = '#16131f'; ctx.fillRect(-900, fy - 30, 2900, 34);
  ctx.save(); ctx.globalAlpha = .38; ctx.strokeStyle = '#9a96a8'; ctx.lineWidth = 2;
  for (let i = -30; i < 60; i++) { ctx.beginPath(); ctx.moveTo(-600 + i * 40, fy - 30); ctx.lineTo(-600 + i * 40 + 300, fy - 330); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-600 + i * 40, fy - 30); ctx.lineTo(-600 + i * 40 - 300, fy - 330); ctx.stroke(); }
  ctx.restore();
  for (const px of [-120, 420, 960]) { rrect(ctx, px, fy - 360, 30, 340, 8); fillStroke(ctx, '#2a2636', 5); rrect(ctx, px - 6, fy - 380, 42, 40, 10); fillStroke(ctx, '#c8302c', 5); }
  rrect(ctx, -900, fy - 370, 2900, 22, 8); fillStroke(ctx, '#2a2636', 5);
}
function drawBelt(ctx, x, y, s, rot = 0, shine = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -300, -38, 600, 76, 30); fillStroke(ctx, '#1d1a20', 7);
  for (const sx of [-1, 1]) { rrect(ctx, sx * 175 - 45, -48, 90, 96, 16); fillStroke(ctx, '#e8b830', 6); circle(ctx, sx * 175, 0, 22); fillStroke(ctx, '#c8302c', 5); }
  ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + Math.PI / 8; const px = Math.cos(a) * 120, py = Math.sin(a) * 105; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); fillStroke(ctx, '#f2c12e', 8);
  ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + Math.PI / 8; const px = Math.cos(a) * 82, py = Math.sin(a) * 70; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); fillStroke(ctx, '#ffe27a', 5);
  star5(ctx, 0, 0, 44, 0, '#c8302c');
  ctx.save(); ctx.globalAlpha = .55; ctx.beginPath(); ctx.ellipse(-40, -50, 60, 16, -.4, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  ctx.restore();
  if (shine > 0) { sparkle(ctx, x - 80 * s, y - 70 * s, 60 * s * shine, shine); sparkle(ctx, x + 120 * s, y + 40 * s, 40 * s * shine, shine); }
}
function confetti(ctx, t, t0, n = 70, seed = 9) {
  if (t < t0) return; const R = rng(seed); const k = t - t0;
  for (let i = 0; i < n; i++) {
    const x = R() * 1200 - 60 + Math.sin(k * 2 + i) * 40, y = -100 + (R() * 600 + k * (300 + R() * 300)) % 2100; const c = HOUSE_COLS[i % HOUSE_COLS.length];
    ctx.save(); ctx.translate(x, y); ctx.rotate(k * 4 + i); ctx.fillStyle = c; ctx.fillRect(-14, -7, 28, 14); ctx.restore();
  }
}
function drawDojo(ctx, floorY = 1250) {
  ctx.fillStyle = '#f3e3c3'; ctx.fillRect(-1000, -1000, 3200, floorY + 1000);
  for (let i = -6; i < 16; i++) { line(ctx, i * 160, -1000, i * 160, floorY, 5, 'rgba(120,70,30,.22)'); }
  ctx.fillStyle = '#7a4a2c'; ctx.fillRect(-1000, floorY - 180, 3200, 30);
  ctx.fillStyle = '#2f73c9'; ctx.fillRect(-1000, floorY, 3200, 2000);
  for (let i = -6; i < 16; i++) line(ctx, i * 220, floorY, i * 220 - 300, floorY + 900, 4, 'rgba(10,20,60,.25)');
  for (let j = 0; j < 4; j++) line(ctx, -1000, floorY + 120 + j * 220, 2200, floorY + 120 + j * 220, 4, 'rgba(10,20,60,.25)');
  line(ctx, -1000, floorY, 2200, floorY, 6);
}
function banner(ctx, x, y, w, h, str, col = '#c8302c', size = 54, tc = '#fff') { rrect(ctx, x - w / 2, y - h / 2, w, h, 14); fillStroke(ctx, col, 7); text(ctx, str, x, y + 3, size, tc, INK, 0, 'Poppins', 700); }
function bigPop(ctx, str, x, y, size, lt, t0, col = '#ffe14d', rot = -.05) {
  const k = lt - t0; if (k < 0) return; const sc = backOut(clamp(k / .25));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); text(ctx, str, 0, 0, size, col, INK, size * .16, 'Poppins', 700); text(ctx, str, 0, 0, size, col, INK, 0, 'Poppins', 700); ctx.restore();
}
function bubble(ctx, x, y, w, h, str, size = 46, tail = [0, 1], col = '#fff', tc = INK) {
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); fillStroke(ctx, col, 6);
  ctx.beginPath(); ctx.moveTo(x + tail[0] * 40 - 20, y + h / 2 - 4); ctx.lineTo(x + tail[0] * 90, y + h / 2 + 50); ctx.lineTo(x + tail[0] * 40 + 24, y + h / 2 - 4); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = col; ctx.fillRect(x + tail[0] * 40 - 17, y + h / 2 - 10, 38, 8);
  if (str) text(ctx, str, x, y + 2, size, tc, INK, 0, 'Poppins', 700);
}
function drawScale(ctx, x, y, s, needle) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -160, -60, 320, 60, 16); fillStroke(ctx, '#d9dde3', 6);
  rrect(ctx, -20, -560, 40, 500, 10); fillStroke(ctx, '#9aa4b0', 6);
  circle(ctx, 0, -600, 110); fillStroke(ctx, '#fff', 8);
  for (let i = 0; i < 9; i++) { const a = -2.2 + i * 4.4 / 8; line(ctx, Math.sin(a) * 85, -600 - Math.cos(a) * 85, Math.sin(a) * 100, -600 - Math.cos(a) * 100, 5); }
  ctx.beginPath(); ctx.arc(0, -600, 92, -Math.PI / 2 + 1.3, -Math.PI / 2 + 2.2); ctx.lineWidth = 16; ctx.strokeStyle = '#e8514a'; ctx.stroke();
  line(ctx, 0, -600, Math.sin(needle) * 80, -600 - Math.cos(needle) * 80, 9, '#c8302c'); circle(ctx, 0, -600, 12); ctx.fillStyle = INK; ctx.fill();
  ctx.restore();
}
function redX(ctx, x, y, r, k) { if (k <= 0) return; const e = backOut(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.rotate(.1); for (const a of [1, -1]) { ctx.save(); ctx.rotate(a * .785); rrect(ctx, -r, -r * .17, r * 2, r * .34, r * .12); fillStroke(ctx, '#e0392f', r * .09); ctx.restore(); } ctx.restore(); }
function drawKey(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  circle(ctx, 0, 0, 120); fillStroke(ctx, '#f2c12e', 10); circle(ctx, 0, 0, 50); fillStroke(ctx, '#2b1d4a', 8);
  rrect(ctx, 110, -30, 360, 60, 14); fillStroke(ctx, '#f2c12e', 10);
  rrect(ctx, 380, 20, 40, 70, 8); fillStroke(ctx, '#f2c12e', 8); rrect(ctx, 300, 20, 40, 50, 8); fillStroke(ctx, '#f2c12e', 8);
  ellipse(ctx, -40, -50, 40, 14, -.6); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
  ctx.restore();
}
function drawStone(ctx, x, y, w, h) {
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h + 120); ctx.quadraticCurveTo(x, y - h - 60, x + w / 2, y - h + 120); ctx.lineTo(x + w / 2, y); ctx.closePath(); fillStroke(ctx, '#a9a6b4', 8);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(30,20,50,.18)'; ctx.fillRect(x + w * .22, y - h - 100, w, h + 200); ctx.restore();
}
function drawMountain(ctx, x, top, base, w, col = '#7a6fb0', snow = true) {
  path(ctx, [[x - w / 2, base], [x - w * .12, top + 90], [x, top], [x + w * .1, top + 70], [x + w / 2, base]]); fillStroke(ctx, col, 8);
  if (snow) { path(ctx, [[x - w * .12, top + 90], [x, top], [x + w * .1, top + 70], [x + w * .05, top + 120], [x - .02 * w, top + 95], [x - w * .07, top + 140]]); fillStroke(ctx, '#ffffff', 6); }
}
