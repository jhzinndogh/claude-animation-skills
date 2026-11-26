// ---------- interrogation room props ----------
function roomBG(ctx, cam, o = {}) {
  const wall = o.wall || '#5f6f80', floor = o.floor || '#3b4049', back = o.back || 1180;
  applyCam(ctx, cam, .6);
  ctx.fillStyle = wall; ctx.fillRect(-800, -1200, 2700, back + 1200);
  // wall panels
  for (let i = -4; i < 9; i++) { rrect(ctx, i * 260 + 20, 180, 220, back - 330, 14); ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(20,20,40,.25)'; ctx.stroke(); }
  // one-way mirror
  if (o.mirror !== false) { rrect(ctx, 600, 320, 420, 300, 10); fillStroke(ctx, '#2a3340', 10, '#1c1e26'); ctx.save(); rrect(ctx, 600, 320, 420, 300, 10); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.moveTo(640, 620); ctx.lineTo(760, 320); ctx.lineTo(820, 320); ctx.lineTo(700, 620); ctx.fill(); ctx.restore(); }
  // sign
  if (o.sign !== false) { rrect(ctx, 70, 300, 420, 120, 12); fillStroke(ctx, '#f2c230', 7); ctx.save(); ctx.beginPath(); ctx.rect(70, 300, 420, 120); ctx.clip(); for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? '#f2c230' : '#221c22'; ctx.beginPath(); ctx.moveTo(40 + i * 45, 420); ctx.lineTo(70 + i * 45, 420); ctx.lineTo(100 + i * 45, 300); ctx.lineTo(70 + i * 45, 300); ctx.fill(); } ctx.restore(); rrect(ctx, 95, 322, 370, 76, 8); fillStroke(ctx, '#fff', 5); text(ctx, 'SEGURANÇA MÁXIMA', 280, 361, 31, INK); }
  ctx.fillStyle = floor; ctx.fillRect(-800, back, 2700, 2000);
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-800, back, 2700, 26);
  applyCam(ctx, cam, 1);
}
function drawLamp(ctx, x, y, s, t, swing = 0) {
  ctx.save(); ctx.translate(x, y); const a = Math.sin(t * 2) * .05 * swing; ctx.rotate(a);
  line(ctx, 0, -1500, 0, 0, 6, INK);
  ctx.beginPath(); ctx.moveTo(-90 * s, 90 * s); ctx.lineTo(90 * s, 90 * s); ctx.lineTo(35 * s, 0); ctx.lineTo(-35 * s, 0); ctx.closePath(); fillStroke(ctx, '#2f3a46', 6);
  ellipse(ctx, 0, 92 * s, 70 * s, 16 * s); ctx.fillStyle = '#fff6c8'; ctx.fill();
  ctx.restore();
  return a;
}
function lampCone(ctx, x, y, a, len = 1300, alpha = .22) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.globalCompositeOperation = 'screen';
  const g = ctx.createLinearGradient(0, 0, 0, len); g.addColorStop(0, `rgba(255,240,180,${alpha})`); g.addColorStop(1, 'rgba(255,240,180,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-70, 90); ctx.lineTo(70, 90); ctx.lineTo(560, len); ctx.lineTo(-560, len); ctx.fill(); ctx.restore();
}
function drawTable(ctx, x, y, w, d = 120, h = 700) {
  // y = front edge of top
  rrect(ctx, x - w / 2 + 40, y, w - 80, h, 0); ctx.fillStyle = '#4b535e'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 50, y - d); ctx.lineTo(x + w / 2 - 50, y - d); ctx.lineTo(x + w / 2, y); ctx.lineTo(x - w / 2, y); ctx.closePath(); fillStroke(ctx, '#aab4be', 7);
  rrect(ctx, x - w / 2, y, w, 34, 6); fillStroke(ctx, '#7d8893', 7);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x - w / 2 + 80, y - d + 20, w - 300, 8);
}
function drawPaperSheet(ctx, x, y, w, h, rot = 0, lines = 6, fill = '#fbf8f0') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rrect(ctx, -w / 2, -h / 2, w, h, 6); fillStroke(ctx, fill, 5);
  for (let i = 0; i < lines; i++) line(ctx, -w / 2 + 22, -h / 2 + 30 + i * (h - 50) / lines, w / 2 - 22 - (i % 3) * 30, -h / 2 + 30 + i * (h - 50) / lines, 5, '#b9b3a6');
  ctx.restore();
}
function drawPhoto(ctx, x, y, w, h, rot, seed = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rrect(ctx, -w / 2, -h / 2, w, h, 4); fillStroke(ctx, '#fff', 5);
  rrect(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 40, 2); ctx.fillStyle = ['#8aa0b4', '#b48a7a', '#7a9a80'][seed % 3]; ctx.fill();
  // little silhouette
  circle(ctx, 0, -h * .12, w * .12); ctx.fillStyle = '#2a2430'; ctx.fill(); rrect(ctx, -w * .18, -h * .02, w * .36, h * .3, 10); ctx.fill();
  ctx.restore();
}
function stamp(ctx, x, y, s, rot, k, word = 'CULPADO') {
  if (k <= 0) return; const sc = lerp(2.2, 1, easeOut(clamp(k * 1.4))); const a = clamp(k * 3);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc); ctx.globalAlpha = a * .92;
  rrect(ctx, -230, -62, 460, 124, 14); ctx.lineWidth = 14; ctx.strokeStyle = '#d42a2a'; ctx.stroke();
  rrect(ctx, -212, -46, 424, 92, 8); ctx.lineWidth = 5; ctx.stroke();
  ctx.font = '700 84px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#d42a2a'; ctx.fillText(word, 0, 6);
  ctx.restore();
}
function drawFolder(ctx, x, y, w, h, open = 1) {
  ctx.save(); ctx.translate(x, y);
  rrect(ctx, -w / 2, -h / 2 - 30, w * .35, 60, 14); fillStroke(ctx, '#d9a54a', 6);
  rrect(ctx, -w / 2, -h / 2, w, h, 14); fillStroke(ctx, '#e8b95a', 7);
  ctx.restore();
}
function drawCash(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -90, -45, 180, 90, 8); fillStroke(ctx, '#5fbf5a', 5);
  rrect(ctx, -72, -30, 144, 60, 6); ctx.lineWidth = 3; ctx.strokeStyle = '#2f7a34'; ctx.stroke();
  circle(ctx, 0, 0, 22); fillStroke(ctx, '#8ad883', 3, '#2f7a34');
  ctx.font = '700 30px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#2f7a34'; ctx.fillText('$', 0, 2);
  rrect(ctx, -16, -46, 32, 92, 3); ctx.fillStyle = '#f2e6b0'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}
function cashStack(ctx, x, y, s, n = 5) { for (let i = 0; i < n; i++) drawCash(ctx, x, y - i * 22 * s, s, 0); }
function drawBriefcase(ctx, x, y, s, open = 0, cash = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (open > 0) {
    ctx.save(); ctx.scale(1, -open); rrect(ctx, -200, 0, 400, 230, 18); fillStroke(ctx, '#2b2428', 7); rrect(ctx, -180, 20, 360, 190, 10); ctx.fillStyle = '#7a1e2a'; ctx.fill(); ctx.restore();
  }
  rrect(ctx, -200, 0, 400, 220, 18); fillStroke(ctx, '#3a3034', 7);
  if (open > .3 && cash) { for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) drawCash(ctx, -135 + c * 90, 60 + r * 80, .5, Math.PI / 2); }
  if (open < .3) { rrect(ctx, -60, -40, 120, 50, 14); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); rrect(ctx, -30, -10, 20, 26, 4); fillStroke(ctx, '#e8c04a', 4); rrect(ctx, 10, -10, 20, 26, 4); fillStroke(ctx, '#e8c04a', 4); }
  ctx.restore();
}
function drawCCTV(ctx, x, y, s, ang, t, rec = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -10, -60, 20, 70, 4); fillStroke(ctx, '#3a3f47', 5);
  ctx.rotate(ang); rrect(ctx, -30, 0, 170, 70, 14); fillStroke(ctx, '#e8e8e4', 6);
  rrect(ctx, 130, 8, 34, 54, 8); fillStroke(ctx, '#22262e', 5);
  if (rec && Math.sin(t * 6) > 0) { circle(ctx, 0, 35, 10); ctx.fillStyle = '#ff3030'; ctx.fill(); }
  ctx.restore();
}
function drawDoor(ctx, x, y, w, h) {
  rrect(ctx, x - w / 2 - 20, y - h - 20, w + 40, h + 20, 10); fillStroke(ctx, '#3a414b', 7);
  rrect(ctx, x - w / 2, y - h, w, h, 8); fillStroke(ctx, '#7c8794', 7);
  rrect(ctx, x - w * .3, y - h * .85, w * .6, h * .18, 6); fillStroke(ctx, '#1c2028', 6);
  for (let i = 0; i < 4; i++) line(ctx, x - w * .3 + (i + 1) * w * .12, y - h * .85, x - w * .3 + (i + 1) * w * .12, y - h * .67, 6, '#9aa3ad');
  rrect(ctx, x + w * .25, y - h * .5, 50, 90, 8); fillStroke(ctx, '#2a2e36', 5); circle(ctx, x + w * .25 + 25, y - h * .5 + 30, 10); ctx.fillStyle = '#ff3a3a'; ctx.fill();
  for (const yy of [.15, .4, .7, .92]) { circle(ctx, x - w * .42, y - h * yy, 9); fillStroke(ctx, '#aab4be', 4); }
}
function drawGavel(ctx, x, y, s, ang) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(ang);
  rrect(ctx, -14, -20, 28, 330, 12); fillStroke(ctx, '#8a4f24', 7);
  ctx.save(); ctx.translate(0, -60); rrect(ctx, -130, -60, 260, 120, 30); fillStroke(ctx, '#a9602c', 8); rrect(ctx, -150, -66, 40, 132, 14); fillStroke(ctx, '#e8c04a', 7); rrect(ctx, 110, -66, 40, 132, 14); fillStroke(ctx, '#e8c04a', 7); ctx.restore();
  ctx.restore();
}
function drawBlock(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 30, 190, 40); fillStroke(ctx, '#6a3a1c', 7); rrect(ctx, -190, -10, 380, 40, 0); ctx.fillStyle = '#6a3a1c'; ctx.fill(); ellipse(ctx, 0, -10, 190, 40); fillStroke(ctx, '#a9602c', 7); ctx.restore(); }
function drawScale(ctx, x, y, s, tilt) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -14, -420, 28, 420, 8); fillStroke(ctx, '#e8c04a', 6); ellipse(ctx, 0, 0, 130, 26); fillStroke(ctx, '#d9a84a', 6);
  ctx.translate(0, -420); ctx.rotate(tilt); rrect(ctx, -300, -12, 600, 24, 12); fillStroke(ctx, '#e8c04a', 6); circle(ctx, 0, 0, 26); fillStroke(ctx, '#f2c230', 6);
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 280, 0); ctx.rotate(-tilt); line(ctx, 0, 0, -90, 200, 4); line(ctx, 0, 0, 90, 200, 4); ctx.beginPath(); ctx.ellipse(0, 200, 120, 40, 0, 0, Math.PI); ctx.closePath(); fillStroke(ctx, '#e8c04a', 6); ctx.restore(); }
  ctx.restore();
}
function scalePan(x, y, s, tilt, sd) { return [x + Math.cos(tilt) * 280 * sd * s, y - 420 * s + Math.sin(tilt) * 280 * sd * s + 190 * s]; }
function heart(ctx, x, y, s, fill = '#ff3b5c') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -40, -60, 0, -30); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); fillStroke(ctx, fill, 5); ctx.restore();
}
function choiceBox(ctx, x, y, w, h, num, label, hi = 0, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); const sc = 1 + hi * .06; ctx.scale(sc, sc);
  rrect(ctx, -w / 2, -h / 2 + 10, w, h, 26); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, 26); fillStroke(ctx, hi > .5 ? '#ffe14d' : '#ffffff', 8);
  circle(ctx, -w / 2 + 70, 0, 46); fillStroke(ctx, ['#2f63c9', '#3fa35b', '#e0392f'][num - 1], 7);
  text(ctx, String(num), -w / 2 + 70, 3, 58, '#fff');
  text(ctx, label, -w / 2 + 140, 3, 44, INK, INK, 0, 'Poppins', 700, 'left');
  ctx.restore();
}
function bigTitle(ctx, str, x, y, size, k, fill = '#fff', rot = 0) {
  if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.rotate(rot); const sc = .6 + .4 * backOut(clamp(k)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 3);
  text(ctx, str, 0, 8, size, 'rgba(0,0,0,.45)', INK, 0); text(ctx, str, 0, 0, size, fill, INK, size * .16); text(ctx, str, 0, 0, size, fill);
  ctx.restore();
}
function waveform(ctx, x, y, w, h, t, col = '#5fe0a0') {
  ctx.beginPath(); for (let i = 0; i <= 60; i++) { const px = x - w / 2 + i * w / 60; const amp = h * (.2 + .8 * Math.abs(Math.sin(i * .7 + t * 9) * Math.sin(i * .23 + t * 3))); ctx.moveTo(px, y - amp / 2); ctx.lineTo(px, y + amp / 2); }
  ctx.lineWidth = 9; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke();
}
function screenFrame(ctx, x, y, w, h, fill = '#10161e') { rrect(ctx, x - w / 2 - 22, y - h / 2 - 22, w + 44, h + 44, 24); fillStroke(ctx, '#2c313a', 8); rrect(ctx, x - w / 2, y - h / 2, w, h, 10); fillStroke(ctx, fill, 5); }
function redTint(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(200,40,40,${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function speedLines(ctx, cx, cy, a, t, col = 'rgba(255,255,255,.8)') {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; const R = rng(9 + Math.floor(t * 12));
  for (let i = 0; i < 40; i++) { const an = R() * TAU, r0 = 600 + R() * 300; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); ctx.lineTo(cx + Math.cos(an + .02) * 1600, cy + Math.sin(an + .02) * 1600); ctx.lineTo(cx + Math.cos(an - .02) * 1600, cy + Math.sin(an - .02) * 1600); ctx.fillStyle = col; ctx.fill(); }
  ctx.restore();
}
function cuffs(col = '#c9ced6') {
  return (ctx, hp) => {
    const a = hp.L[2], b = hp.R[2];
    for (const p of [a, b]) { ellipse(ctx, p[0], p[1], .04, .028); ctx.lineWidth = .014; ctx.strokeStyle = INK; ctx.stroke(); ellipse(ctx, p[0], p[1], .04, .028); ctx.lineWidth = .007; ctx.strokeStyle = col; ctx.stroke(); }
    const n = 5; for (let i = 1; i < n; i++) { const k = i / n; circle(ctx, lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * Math.PI) * .02, .01); ctx.lineWidth = .006; ctx.strokeStyle = INK; ctx.stroke(); }
  };
}
function thoughtBubble(ctx, x, y, w, h, a, drawIn) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const sc = .5 + .5 * backOut(clamp(a));
  ctx.translate(x, y); ctx.scale(sc, sc);
  ellipse(ctx, 0, 0, w / 2, h / 2); fillStroke(ctx, '#fff', 8);
  ctx.save(); ellipse(ctx, 0, 0, w / 2 - 14, h / 2 - 14); ctx.clip(); drawIn(ctx); ctx.restore();
  ellipse(ctx, 0, 0, w / 2, h / 2); fillStroke(ctx, null, 8);
  ctx.restore();
}
