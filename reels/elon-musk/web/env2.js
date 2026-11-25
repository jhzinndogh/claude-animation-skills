// ---------- props for the Elon Musk reel ----------
// hair / cap / helmet live in head units (head radius hr at hx,hy)
function drawHair(ctx, hx, hy, hr, col, lw) {
  ctx.beginPath();
  ctx.moveTo(hx - hr * 1.0, hy - hr * .05);
  ctx.quadraticCurveTo(hx - hr * 1.12, hy - hr * 1.05, hx - hr * .1, hy - hr * 1.12);
  ctx.quadraticCurveTo(hx + hr * .95, hy - hr * 1.15, hx + hr * 1.02, hy - hr * .2);
  ctx.quadraticCurveTo(hx + hr * .7, hy - hr * .55, hx + hr * .15, hy - hr * .62);
  ctx.quadraticCurveTo(hx - hr * .55, hy - hr * .65, hx - hr * .78, hy - hr * .3);
  ctx.closePath(); fillStroke(ctx, col, lw);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.18)'; ellipse(ctx, hx - hr * .3, hy - hr * .95, hr * .35, hr * .08, -.2); ctx.fill(); ctx.restore();
}
function drawCap(ctx, hx, hy, hr, col, lw) {
  ctx.beginPath(); ctx.arc(hx, hy - hr * .1, hr * 1.0, Math.PI + .15, -.15); ctx.closePath(); fillStroke(ctx, col, lw);
  ctx.beginPath(); ctx.moveTo(hx + hr * .4, hy - hr * .32); ctx.quadraticCurveTo(hx + hr * 1.5, hy - hr * .4, hx + hr * 1.55, hy - hr * .2); ctx.lineTo(hx + hr * .5, hy - hr * .18); ctx.closePath(); fillStroke(ctx, col, lw);
  circle(ctx, hx, hy - hr * 1.08, hr * .1); fillStroke(ctx, col, lw);
}
function drawHelmetGlass(ctx, hx, hy, hr, lw) {
  circle(ctx, hx, hy, hr * 1.35); ctx.fillStyle = 'rgba(190,230,255,.28)'; ctx.fill(); ctx.lineWidth = lw * 1.4; ctx.strokeStyle = INK; ctx.stroke();
  ellipse(ctx, hx - hr * .6, hy - hr * .7, hr * .3, hr * .14, -.6); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill();
}
function drawTie(ctx, tTop) {
  path(ctx, [[-.06, tTop + .005], [.06, tTop + .005], [0, tTop + .12]]); ctx.fillStyle = '#f6f2ea'; ctx.fill();
  path(ctx, [[-.016, tTop + .02], [.016, tTop + .02], [.022, tTop + .17], [0, tTop + .2], [-.022, tTop + .17]]); fillStroke(ctx, '#d8312b', .01);
}

// ---------- rocket ----------
function flame(ctx, x, y, s, t, power = 1) {
  if (power <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * power);
  const fl = 1 + Math.sin(t * 40) * .08 + Math.sin(t * 23) * .06;
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 60, 10, 0, 60, 260); g.addColorStop(0, 'rgba(255,200,90,.55)'); g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g; ctx.fillRect(-300, -100, 600, 500);
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath(); ctx.moveTo(-42, 0); ctx.quadraticCurveTo(-55, 120 * fl, 0, 260 * fl); ctx.quadraticCurveTo(55, 120 * fl, 42, 0); ctx.closePath(); fillStroke(ctx, '#ff8a2a', 6);
  ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(-30, 80 * fl, 0, 170 * fl); ctx.quadraticCurveTo(30, 80 * fl, 26, 0); ctx.closePath(); ctx.fillStyle = '#ffd84a'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-12, 40, 0, 90 * fl); ctx.quadraticCurveTo(12, 40, 12, 0); ctx.closePath(); ctx.fillStyle = '#fff8d6'; ctx.fill();
  ctx.restore();
}
// y = bottom of the engine bell
function drawRocket(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  if (o.flame) flame(ctx, 0, 0, 1, t, o.flame);
  const lw = 6;
  // engine bell
  path(ctx, [[-30, -40], [30, -40], [44, 0], [-44, 0]]); fillStroke(ctx, '#4a4f5a', lw);
  // fins
  ctx.beginPath(); ctx.moveTo(-70, -50); ctx.lineTo(-130, 10); ctx.lineTo(-120, 30); ctx.lineTo(-70, -10); ctx.closePath(); fillStroke(ctx, o.fin || '#e0392f', lw);
  ctx.beginPath(); ctx.moveTo(70, -50); ctx.lineTo(130, 10); ctx.lineTo(120, 30); ctx.lineTo(70, -10); ctx.closePath(); fillStroke(ctx, o.fin || '#e0392f', lw);
  // body
  const body = () => { ctx.beginPath(); ctx.moveTo(-72, -40); ctx.lineTo(-72, -560); ctx.quadraticCurveTo(-70, -700, 0, -800); ctx.quadraticCurveTo(70, -700, 72, -560); ctx.lineTo(72, -40); ctx.closePath(); };
  body(); ctx.fillStyle = '#f6f4ef'; ctx.fill();
  ctx.save(); body(); ctx.clip();
  ctx.fillStyle = '#2b2f3a'; ctx.fillRect(-80, -180, 160, 40); ctx.fillRect(-80, -620, 160, 26);
  ctx.fillStyle = 'rgba(40,40,70,.16)'; ctx.fillRect(20, -820, 80, 820);
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-55, -560, 14, 500);
  ctx.restore(); body(); fillStroke(ctx, null, lw);
  // window
  circle(ctx, 0, -470, 34); fillStroke(ctx, '#9fd8ff', lw);
  if (o.pilot) { ctx.save(); circle(ctx, 0, -470, 30); ctx.clip(); circle(ctx, 0, -462, 22); ctx.fillStyle = HEAD; ctx.fill(); circle(ctx, -8, -466, 4); circle(ctx, 8, -466, 4); ctx.fillStyle = INK; ctx.fill(); ctx.beginPath(); ctx.arc(0, -458, 8, .3, Math.PI - .3); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
  ellipse(ctx, -12, -482, 10, 6, -.6); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
  if (o.legs) { for (const sd of [-1, 1]) { line(ctx, sd * 60, -60, sd * (60 + 70 * o.legs), 10 * o.legs, 10, INK); line(ctx, sd * 60, -60, sd * (60 + 70 * o.legs), 10 * o.legs, 5, '#9aa0ab'); } }
  if (o.label) text(ctx, o.label, 0, -330, 48, '#2b2f3a', null, 0, 'Poppins', 700);
  ctx.restore();
}
function drawPad(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -260, 0, 520, 60, 10); fillStroke(ctx, '#8b919c', 6);
  ctx.fillStyle = '#ffd23a'; for (let i = -4; i <= 3; i++) { ctx.save(); rrect(ctx, -260, 0, 520, 60, 10); ctx.clip(); path(ctx, [[i * 70, 0], [i * 70 + 35, 0], [i * 70 + 5, 60], [i * 70 - 30, 60]]); ctx.fill(); ctx.restore(); }
  rrect(ctx, -260, 0, 520, 60, 10); fillStroke(ctx, null, 6);
  // tower
  rrect(ctx, 200, -900, 60, 900, 4); fillStroke(ctx, '#c9452f', 6);
  ctx.strokeStyle = INK; ctx.lineWidth = 4; for (let yy = -880; yy < 0; yy += 80) { ctx.beginPath(); ctx.moveTo(200, yy); ctx.lineTo(260, yy + 80); ctx.moveTo(260, yy); ctx.lineTo(200, yy + 80); ctx.stroke(); }
  ctx.restore();
}
function explosion(ctx, x, y, r, k, seed = 1) {
  // k 0..1 progress
  if (k <= 0 || k >= 1) return;
  const R = rng(seed);
  const grow = easeOut(clamp(k * 2.2));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 10, x, y, r * 2.5); g.addColorStop(0, `rgba(255,230,150,${.8 * (1 - k)})`); g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); ctx.restore();
  if (k < .45) burst(ctx, x, y, r * 1.2 * grow, 13, '#ffd23a', seed, .5);
  if (k < .35) burst(ctx, x, y, r * .7 * grow, 11, '#fff3b0', seed + 1, .55);
  for (let i = 0; i < 7; i++) { const a = R() * TAU, d = r * (.4 + R() * .9) * grow; puff(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - k * 80, r * (.35 + R() * .25) * (1 + k * .6), 0, k < .3 ? '#ff9a3a' : mix('#ff9a3a', '#6b6670', clamp((k - .3) * 2)), seed + i, clamp(1.4 - k * 1.4)); }
  // debris
  for (let i = 0; i < 9; i++) { const a = R() * TAU, sp = r * (1.2 + R() * 1.6); const px = x + Math.cos(a) * sp * k, py = y + Math.sin(a) * sp * k + k * k * 400; ctx.save(); ctx.translate(px, py); ctx.rotate(k * 12 * (R() - .5)); rrect(ctx, -14, -8, 28, 16, 3); fillStroke(ctx, R() > .5 ? '#f6f4ef' : '#e0392f', 4); ctx.restore(); }
}

// ---------- places ----------
function drawSchool(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -420, -700, 840, 700, 6); fillStroke(ctx, '#d4664a', 6);
  ctx.save(); rrect(ctx, -420, -700, 840, 700, 6); ctx.clip(); ctx.strokeStyle = 'rgba(120,40,30,.35)'; ctx.lineWidth = 3;
  for (let yy = -690; yy < 0; yy += 34) { line(ctx, -420, yy, 420, yy, 3, 'rgba(120,40,30,.35)'); for (let xx = -420 + ((yy / 34) % 2) * 35; xx < 420; xx += 70) line(ctx, xx, yy, xx, yy + 34, 3, 'rgba(120,40,30,.35)'); }
  ctx.fillStyle = 'rgba(60,10,10,.18)'; ctx.fillRect(150, -700, 300, 700); ctx.restore();
  path(ctx, [[-470, -700], [0, -900], [470, -700]]); fillStroke(ctx, '#7b3a2e', 6);
  for (const wx of [-300, -110, 110, 300]) { rrect(ctx, wx - 55, -580, 110, 120, 6); fillStroke(ctx, '#bfe6f8', 5); line(ctx, wx, -580, wx, -460, 4); }
  rrect(ctx, -80, -260, 160, 260, 8); fillStroke(ctx, '#6b3f2e', 6);
  // bell
  circle(ctx, 0, -760, 40); fillStroke(ctx, '#f2c230', 5);
  ctx.restore();
}
function drawStairs(ctx, x, y, n, sw, sh) {
  for (let i = 0; i < n; i++) { rrect(ctx, x + i * sw, y - (n - i) * sh, sw * (n - i) + 40, sh, 4); fillStroke(ctx, i % 2 ? '#c9c2b6' : '#d8d1c5', 5); }
}
function drawBed(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -380, -170, 760, 90, 20); fillStroke(ctx, '#f6f4ef', 6);
  rrect(ctx, -380, -120, 760, 40, 10); fillStroke(ctx, '#7fb6e8', 5);
  rrect(ctx, -400, -330, 40, 330, 10); fillStroke(ctx, '#9aa0ab', 5); rrect(ctx, 360, -260, 40, 260, 10); fillStroke(ctx, '#9aa0ab', 5);
  rrect(ctx, -360, -230, 200, 70, 30); fillStroke(ctx, '#fff', 5);
  ctx.restore();
}
function drawMonitor(ctx, x, y, s, t, flat = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -10, 0, 20, 300, 6); fillStroke(ctx, '#9aa0ab', 5);
  rrect(ctx, -140, -200, 280, 200, 20); fillStroke(ctx, '#3b3f4a', 6);
  rrect(ctx, -115, -175, 230, 150, 10); fillStroke(ctx, '#0d1d18', 4);
  ctx.save(); rrect(ctx, -115, -175, 230, 150, 10); ctx.clip();
  ctx.beginPath(); for (let i = 0; i <= 60; i++) { const xx = -115 + i * 230 / 60; const ph = ((i / 60) * 2 - t * 1.6) % 1; const pp = ph < 0 ? ph + 1 : ph; let yy = -100; if (!flat && pp > .45 && pp < .5) yy -= 60 * Math.sin((pp - .45) / .05 * Math.PI); if (!flat && pp > .5 && pp < .53) yy += 25; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
  ctx.lineWidth = 5; ctx.strokeStyle = '#4bff8a'; ctx.stroke(); ctx.restore();
  // red cross
  ctx.fillStyle = '#e0392f'; ctx.fillRect(-12, -260, 24, 60); ctx.fillRect(-30, -242, 60, 24);
  ctx.restore();
}
function drawAcacia(ctx, x, y, s, col = '#3d2a26', leaf = '#4f8f3a') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-18, 0); ctx.quadraticCurveTo(-10, -150, -60, -260); ctx.lineTo(-40, -270); ctx.quadraticCurveTo(0, -200, 10, -250); ctx.quadraticCurveTo(40, -230, 80, -280); ctx.lineTo(95, -270); ctx.quadraticCurveTo(20, -150, 18, 0); ctx.closePath(); fillStroke(ctx, col, 5);
  ctx.beginPath(); ctx.ellipse(0, -300, 230, 55, 0, 0, TAU); fillStroke(ctx, leaf, 6);
  ctx.beginPath(); ctx.ellipse(-30, -320, 150, 28, 0, 0, TAU); ctx.fillStyle = 'rgba(255,255,200,.18)'; ctx.fill();
  ctx.restore();
}
function drawBook(ctx, x, y, w, h, col, rot = 0, cover) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rrect(ctx, -w / 2, -h, w, h, 6); fillStroke(ctx, col, 5);
  rrect(ctx, -w / 2 + 8, -h + 10, w - 30, 8, 3); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
  ctx.fillStyle = '#f6f1e0'; ctx.fillRect(w / 2 - 16, -h + 6, 10, h - 12);
  ctx.restore();
}
function drawOpenBook(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-90, -30, -180, -10); ctx.lineTo(-180, -150); ctx.quadraticCurveTo(-90, -170, 0, -140); ctx.closePath(); fillStroke(ctx, '#fbf6e8', 5);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(90, -30, 180, -10); ctx.lineTo(180, -150); ctx.quadraticCurveTo(90, -170, 0, -140); ctx.closePath(); fillStroke(ctx, '#fbf6e8', 5);
  for (let i = 0; i < 5; i++) { line(ctx, -150, -120 + i * 22, -30, -115 + i * 22, 3, 'rgba(60,50,40,.4)'); line(ctx, 30, -115 + i * 22, 150, -120 + i * 22, 3, 'rgba(60,50,40,.4)'); }
  ctx.restore();
}
function drawCRT(ctx, x, y, s, t, typed = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // desk
  rrect(ctx, -420, 0, 840, 40, 8); fillStroke(ctx, '#9a5a2a', 6);
  // keyboard
  path(ctx, [[-230, -10], [230, -10], [250, 0], [-250, 0]]); fillStroke(ctx, '#d9cfb8', 5);
  rrect(ctx, -230, -40, 460, 32, 6); fillStroke(ctx, '#e8dfc8', 5);
  for (let i = 0; i < 12; i++) { rrect(ctx, -215 + i * 36, -34, 28, 20, 3); ctx.fillStyle = '#c9bea4'; ctx.fill(); }
  // monitor
  rrect(ctx, -220, -420, 440, 360, 30); fillStroke(ctx, '#e8dfc8', 6);
  ctx.save(); rrect(ctx, -220, -420, 440, 360, 30); ctx.clip(); ctx.fillStyle = 'rgba(80,60,30,.15)'; ctx.fillRect(120, -420, 200, 400); ctx.restore();
  rrect(ctx, -180, -385, 360, 270, 26); fillStroke(ctx, '#0c1a14', 5);
  ctx.save(); rrect(ctx, -180, -385, 360, 270, 26); ctx.clip();
  const g = ctx.createRadialGradient(0, -250, 20, 0, -250, 260); g.addColorStop(0, 'rgba(80,255,140,.2)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-200, -400, 400, 300);
  const R = rng(17); const nl = Math.floor(typed * 9);
  for (let i = 0; i < 9; i++) { if (i > nl) break; const ind = (R() * 3 | 0) * 22; const len = 60 + R() * 200; const ll = i === nl ? len * ((typed * 9) % 1) : len; ctx.fillStyle = '#4bff8a'; ctx.fillRect(-150 + ind, -360 + i * 27, ll, 12); }
  if ((t * 3 | 0) % 2) { ctx.fillStyle = '#4bff8a'; ctx.fillRect(-150, -360 + Math.min(nl + 1, 8) * 27, 16, 14); }
  ctx.restore();
  rrect(ctx, -60, -60, 120, 20, 6); fillStroke(ctx, '#cfc5ac', 4);
  ctx.restore();
}
function drawBill(ctx, x, y, s, rot = 0, label = '$') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -90, -45, 180, 90, 8); fillStroke(ctx, '#6fcf6a', 5);
  rrect(ctx, -76, -32, 152, 64, 6); ctx.lineWidth = 3; ctx.strokeStyle = '#2f8a3a'; ctx.stroke();
  circle(ctx, 0, 0, 24); fillStroke(ctx, '#9be08f', 3);
  text(ctx, label, 0, 2, label.length > 1 ? 22 : 34, '#1f6a2a', null, 0, 'Poppins', 700);
  ctx.restore();
}
function drawMoneyBag(ctx, x, y, s, label = '$') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-40, -200); ctx.quadraticCurveTo(-170, -120, -140, -40); ctx.quadraticCurveTo(-120, 0, 0, 0); ctx.quadraticCurveTo(120, 0, 140, -40); ctx.quadraticCurveTo(170, -120, 40, -200); ctx.closePath(); fillStroke(ctx, '#c9a45a', 6);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(80,50,10,.2)'; ctx.fillRect(40, -220, 200, 240); ctx.restore();
  path(ctx, [[-55, -200], [55, -200], [80, -250], [-80, -250]]); fillStroke(ctx, '#b08a44', 6);
  line(ctx, -50, -205, 50, -205, 10, '#7a4a2a');
  text(ctx, label, 0, -95, 90, '#6a4a1a', null, 0, 'Poppins', 700);
  ctx.restore();
}
function drawCoin(ctx, x, y, r, spin = 0) {
  const sx = Math.max(.12, Math.abs(Math.cos(spin)));
  ellipse(ctx, x, y, r * sx, r); fillStroke(ctx, '#ffd23a', r * .12);
  if (sx > .4) { ellipse(ctx, x, y, r * .7 * sx, r * .7); ctx.lineWidth = r * .06; ctx.strokeStyle = '#d9a42a'; ctx.stroke(); text(ctx, '$', x, y + 2, r * 1.0, '#c98a1a', null, 0, 'Poppins', 700); }
}
function drawSkyline(ctx, base, t, col = '#5b7bd6', win = '#ffe58a') {
  const R = rng(31);
  for (let i = 0; i < 12; i++) { const w = 90 + R() * 80, h = 250 + R() * 520, x = -300 + i * 150 + R() * 30;
    rrect(ctx, x, base - h, w, h, 4); fillStroke(ctx, mix(col, '#ffffff', R() * .25), 5);
    ctx.fillStyle = win; for (let yy = base - h + 30; yy < base - 40; yy += 50) for (let xx = x + 16; xx < x + w - 24; xx += 34) if (R() > .45) ctx.fillRect(xx, yy, 16, 24);
  }
}
function drawStarsStripes(ctx, x, y, w, h, t) {
  // waving generic stars-and-stripes banner on a pole
  line(ctx, x, y - 20, x, y + h * 2.6, 10, '#7a5a3a');
  const seg = 14;
  const wave = (i, j) => [x + i / seg * w, y + j * h + Math.sin(t * 5 + i * .6) * 14 * (i / seg)];
  for (let r = 0; r < 7; r++) {
    ctx.beginPath(); for (let i = 0; i <= seg; i++) { const [px, py] = wave(i, r / 7); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    for (let i = seg; i >= 0; i--) { const [px, py] = wave(i, (r + 1) / 7); ctx.lineTo(px, py); }
    ctx.closePath(); ctx.fillStyle = r % 2 ? '#f6f4ef' : '#e0392f'; ctx.fill();
  }
  ctx.beginPath(); for (let i = 0; i <= 6; i++) { const [px, py] = wave(i, 0); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } for (let i = 6; i >= 0; i--) { const [px, py] = wave(i, 4 / 7); ctx.lineTo(px, py); } ctx.closePath(); ctx.fillStyle = '#2f4fb0'; ctx.fill();
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const [px, py] = wave(1 + i * 2, (1 + j * 2) / 7 + .02); star5(ctx, px, py, 11, 0, '#fff'); }
  ctx.beginPath(); for (let i = 0; i <= seg; i++) { const [px, py] = wave(i, 0); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } for (let i = seg; i >= 0; i--) { const [px, py] = wave(i, 1); ctx.lineTo(px, py); } ctx.closePath(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
}
function drawBeachChair(ctx, x, y, s, broken = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(broken * .5);
  line(ctx, -120, 0, 80, -180, 10); line(ctx, 120, 0, -40, -90, 10);
  path(ctx, [[-110, -40], [90, -40], [60, -190], [-60, -170]]); ctx.save(); ctx.clip(); for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#fff' : '#2f9fd6'; ctx.fillRect(-120 + i * 40, -200, 40, 200); } ctx.restore();
  path(ctx, [[-110, -40], [90, -40], [60, -190], [-60, -170]]); fillStroke(ctx, null, 6);
  ctx.restore();
}
function drawUmbrella(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 30, -420, 9, '#7a5a3a');
  ctx.save(); ctx.translate(30, -420); ctx.rotate(.07);
  ctx.beginPath(); ctx.moveTo(-260, 40); ctx.quadraticCurveTo(0, -150, 260, 40); for (let i = 3; i >= -3; i--) ctx.quadraticCurveTo(i * 74 + 37, 20, i * 74 - 37 + 0, 40); ctx.closePath();
  ctx.save(); ctx.clip(); for (let i = -4; i < 4; i++) { ctx.fillStyle = i % 2 ? '#ffd23a' : '#e0392f'; path(ctx, [[0, -160], [i * 74, 60], [i * 74 + 74, 60]]); ctx.fill(); } ctx.restore();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  ctx.restore();
}
function drawPalm(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.quadraticCurveTo(30, -300, 90, -520); ctx.lineTo(115, -515); ctx.quadraticCurveTo(60, -300, 22, 0); ctx.closePath(); fillStroke(ctx, '#b98a52', 6);
  for (let i = 0; i < 6; i++) { const a = -2.6 + i * .55 + Math.sin(t * 1.5 + i) * .04; ctx.save(); ctx.translate(100, -520); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(110, -60, 230, 30); ctx.quadraticCurveTo(110, -10, 0, 0); fillStroke(ctx, '#3fa35b', 5); ctx.restore(); }
  circle(ctx, 95, -505, 22); fillStroke(ctx, '#6b4a2a', 5); circle(ctx, 125, -500, 20); fillStroke(ctx, '#6b4a2a', 5);
  ctx.restore();
}
function drawCar(ctx, x, y, s, t, col = '#e0392f', o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s);
  const lw = 6;
  // body
  ctx.beginPath(); ctx.moveTo(-300, -40); ctx.quadraticCurveTo(-310, -110, -250, -120); ctx.lineTo(-150, -130); ctx.quadraticCurveTo(-80, -220, 40, -215); ctx.quadraticCurveTo(160, -205, 230, -130); ctx.quadraticCurveTo(310, -120, 310, -60); ctx.lineTo(300, -30); ctx.lineTo(-290, -30); ctx.closePath(); fillStroke(ctx, col, lw);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-320, -125, 640, 18); ctx.fillStyle = 'rgba(30,10,30,.2)'; ctx.fillRect(-320, -70, 640, 50); ctx.restore();
  // windows
  ctx.beginPath(); ctx.moveTo(-120, -135); ctx.quadraticCurveTo(-60, -200, 30, -198); ctx.lineTo(30, -135); ctx.closePath(); fillStroke(ctx, '#9fd8ff', 5);
  ctx.beginPath(); ctx.moveTo(55, -135); ctx.lineTo(55, -197); ctx.quadraticCurveTo(140, -190, 195, -135); ctx.closePath(); fillStroke(ctx, '#9fd8ff', 5);
  // bolt
  path(ctx, [[-20, -110], [-55, -60], [-28, -60], [-45, -25], [5, -78], [-20, -78], [0, -110]]); fillStroke(ctx, '#ffd23a', 4);
  // lights
  ellipse(ctx, 290, -85, 16, 10); fillStroke(ctx, '#fff6c4', 4); ellipse(ctx, -295, -80, 10, 14); fillStroke(ctx, '#ff5a4a', 4);
  // wheels
  for (const wx of [-180, 190]) { ctx.save(); ctx.translate(wx, -30); circle(ctx, 0, 0, 58); fillStroke(ctx, '#2b2f3a', lw); circle(ctx, 0, 0, 30); fillStroke(ctx, '#c9ced8', 5); ctx.rotate((o.spin || 0)); line(ctx, -26, 0, 26, 0, 5); line(ctx, 0, -26, 0, 26, 5); ctx.restore(); }
  ctx.restore();
}
function speedLines(ctx, y0, y1, t, a = 1, dir = 1) {
  const R = rng(9); ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 18; i++) { const y = y0 + R() * (y1 - y0); const L = 120 + R() * 260; const x = ((R() * 1600 - t * 2600 * dir) % 1600 + 1600) % 1600 - 260; line(ctx, x, y, x + L, y, 6 + R() * 6, 'rgba(255,255,255,.8)'); }
  ctx.restore();
}
function drawEarth(ctx, x, y, r, t) {
  ctx.save();
  const g = ctx.createRadialGradient(x, y, r * .9, x, y, r * 1.25); g.addColorStop(0, 'rgba(120,200,255,.5)'); g.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 1.4, y - r * 1.4, r * 2.8, r * 2.8);
  circle(ctx, x, y, r); ctx.fillStyle = '#2f7fd6'; ctx.fill();
  ctx.save(); circle(ctx, x, y, r); ctx.clip();
  const R = rng(4); ctx.fillStyle = '#4fae5c';
  for (let i = 0; i < 7; i++) { const cx = x - r + ((R() * 2 * r + t * 30) % (2.4 * r)) - .2 * r, cy = y - r * .8 + R() * r * 1.6; ctx.beginPath(); ctx.ellipse(cx, cy, r * (.18 + R() * .2), r * (.12 + R() * .15), R(), 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 5; i++) { ellipse(ctx, x - r + ((R() * 2 * r + t * 50) % (2.4 * r)), y - r * .7 + R() * r * 1.4, r * .2, r * .04); ctx.fill(); }
  ctx.fillStyle = 'rgba(10,20,60,.35)'; ctx.beginPath(); ctx.arc(x + r * .5, y + r * .3, r * 1.1, 0, TAU); ctx.fill();
  ctx.restore();
  circle(ctx, x, y, r); fillStroke(ctx, null, 6);
  ctx.restore();
}
function drawSatellite(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (const sd of [-1, 1]) { rrect(ctx, sd > 0 ? 30 : -130, -26, 100, 52, 4); fillStroke(ctx, '#2f63c9', 4); line(ctx, sd * 30, 0, sd * 130, 0, 3, '#9fd8ff'); }
  rrect(ctx, -30, -34, 60, 68, 8); fillStroke(ctx, '#d8dde6', 4);
  ctx.restore();
}
function drawChip(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // brain
  ctx.beginPath(); ctx.moveTo(-150, 20); ctx.bezierCurveTo(-200, -60, -150, -160, -60, -160); ctx.bezierCurveTo(-30, -200, 40, -200, 70, -160); ctx.bezierCurveTo(170, -160, 200, -60, 150, 20); ctx.bezierCurveTo(130, 80, -130, 80, -150, 20); ctx.closePath(); fillStroke(ctx, '#f7a6b8', 6);
  ctx.lineWidth = 5; ctx.strokeStyle = '#d0647e'; ctx.beginPath(); ctx.moveTo(0, -170); ctx.quadraticCurveTo(-20, -60, 0, 50); ctx.moveTo(-120, -80); ctx.quadraticCurveTo(-80, -100, -60, -50); ctx.moveTo(110, -90); ctx.quadraticCurveTo(70, -60, 80, -20); ctx.moveTo(-100, 10); ctx.quadraticCurveTo(-60, -10, -40, 20); ctx.stroke();
  rrect(ctx, -45, -95, 90, 70, 8); fillStroke(ctx, '#2b2f3a', 5);
  for (let i = 0; i < 4; i++) { line(ctx, -30 + i * 20, -105, -30 + i * 20, -95, 4, '#e8c04a'); line(ctx, -30 + i * 20, -25, -30 + i * 20, -15, 4, '#e8c04a'); }
  const p = (Math.sin(t * 8) + 1) / 2; circle(ctx, 0, -60, 10 + p * 4); ctx.fillStyle = `rgba(90,220,255,${.6 + p * .4})`; ctx.fill();
  ctx.restore();
}
function drawXTile(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -110, -110, 220, 220, 40); fillStroke(ctx, '#111114', 7);
  line(ctx, -55, -60, 55, 60, 22, '#fff'); line(ctx, 55, -60, -55, 60, 22, '#fff');
  ctx.restore();
}
function drawMars(ctx, x, y, r, t) {
  ctx.save();
  const g = ctx.createRadialGradient(x, y, r * .9, x, y, r * 1.3); g.addColorStop(0, 'rgba(255,140,90,.45)'); g.addColorStop(1, 'rgba(255,140,90,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 1.5, y - r * 1.5, r * 3, r * 3);
  circle(ctx, x, y, r); ctx.fillStyle = '#d9643a'; ctx.fill();
  ctx.save(); circle(ctx, x, y, r); ctx.clip();
  const R = rng(8); for (let i = 0; i < 10; i++) { const cx = x - r + R() * 2 * r, cy = y - r + R() * 2 * r, cr = r * (.05 + R() * .12); circle(ctx, cx, cy, cr); ctx.fillStyle = '#b04a2a'; ctx.fill(); circle(ctx, cx - cr * .2, cy - cr * .2, cr * .7); ctx.fillStyle = '#c95634'; ctx.fill(); }
  ctx.fillStyle = 'rgba(255,200,150,.35)'; ellipse(ctx, x - r * .2, y - r * .3, r * .7, r * .12, -.2); ctx.fill();
  ctx.fillStyle = 'rgba(40,10,30,.35)'; ctx.beginPath(); ctx.arc(x + r * .45, y + r * .35, r * 1.05, 0, TAU); ctx.fill();
  ctx.restore(); circle(ctx, x, y, r); fillStroke(ctx, null, 6); ctx.restore();
}
function starfield(ctx, t, seed = 2, n = 120) {
  const R = rng(seed); for (let i = 0; i < n; i++) { const x = R() * 1400 - 160, y = R() * 2300 - 190, r = 1.5 + R() * 3.5; const tw = .5 + .5 * Math.sin(t * 3 + i); circle(ctx, x, y, r); ctx.fillStyle = `rgba(255,255,240,${.4 + tw * .6})`; ctx.fill(); }
}
function spaceBG(ctx, cam, t) {
  applyCam(ctx, cam, .05); const g = ctx.createLinearGradient(0, -200, 0, 2100); g.addColorStop(0, '#0d0a2e'); g.addColorStop(1, '#3a1d5c'); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 5080, 6000);
  applyCam(ctx, cam, .12); starfield(ctx, t);
}
function drawCrown(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  path(ctx, [[-90, 0], [-100, -110], [-50, -50], [0, -130], [50, -50], [100, -110], [90, 0]]); fillStroke(ctx, '#ffd23a', 6);
  for (const [cx, cy] of [[-100, -112], [0, -132], [100, -112]]) { circle(ctx, cx, cy, 14); fillStroke(ctx, '#e0392f', 4); }
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-80, -30, 160, 10);
  ctx.restore();
}
function drawBulb(ctx, x, y, s, on = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (on > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -40, 10, 0, -40, 260); g.addColorStop(0, `rgba(255,240,150,${.7 * on})`); g.addColorStop(1, 'rgba(255,220,100,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -320, 600, 600); ctx.restore();
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line(ctx, Math.cos(a) * 130, -40 + Math.sin(a) * 130, Math.cos(a) * (150 + 40 * on), -40 + Math.sin(a) * (150 + 40 * on), 10, '#ffd23a'); } }
  ctx.beginPath(); ctx.arc(0, -40, 90, Math.PI * .8, Math.PI * .2); ctx.lineTo(35, 60); ctx.lineTo(-35, 60); ctx.closePath(); fillStroke(ctx, on > 0 ? '#fff3a0' : '#f0f0f0', 7);
  rrect(ctx, -40, 60, 80, 50, 10); fillStroke(ctx, '#9aa0ab', 6); line(ctx, -40, 78, 40, 78, 4); line(ctx, -40, 94, 40, 94, 4);
  ctx.beginPath(); ctx.moveTo(-20, 55); ctx.lineTo(-10, -20); ctx.lineTo(0, 0); ctx.lineTo(10, -20); ctx.lineTo(20, 55); ctx.lineWidth = 5; ctx.strokeStyle = '#c98a1a'; ctx.stroke();
  ctx.restore();
}
function drawDie(ctx, x, y, s, rot, face) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -70, -70, 140, 140, 26); fillStroke(ctx, '#fff', 7);
  const P = { 1: [[0, 0]], 2: [[-35, -35], [35, 35]], 3: [[-35, -35], [0, 0], [35, 35]], 4: [[-35, -35], [35, -35], [-35, 35], [35, 35]], 5: [[-35, -35], [35, -35], [0, 0], [-35, 35], [35, 35]], 6: [[-35, -38], [35, -38], [-35, 0], [35, 0], [-35, 38], [35, 38]] };
  ctx.fillStyle = face === 6 ? '#e0392f' : INK; for (const [px, py] of P[face]) { circle(ctx, px, py, 13); ctx.fill(); }
  ctx.restore();
}
function drawCalendar(ctx, x, y, s, label, sub, flip = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -150, -170, 300, 340, 20); fillStroke(ctx, '#fff', 7);
  ctx.save(); rrect(ctx, -150, -170, 300, 340, 20); ctx.clip(); ctx.fillStyle = '#e0392f'; ctx.fillRect(-160, -180, 320, 95); ctx.restore();
  rrect(ctx, -150, -170, 300, 340, 20); fillStroke(ctx, null, 7);
  for (const rx of [-80, 80]) { rrect(ctx, rx - 12, -200, 24, 60, 10); fillStroke(ctx, '#9aa0ab', 5); }
  text(ctx, sub, 0, -125, 46, '#fff', null, 0, 'Poppins', 700);
  ctx.save(); ctx.translate(0, 40); ctx.scale(1, 1 - flip); text(ctx, label, 0, 0, 130, INK, null, 0, 'Poppins', 700); ctx.restore();
  ctx.restore();
}
function drawCommentBubble(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.roundRect(-200, -140, 400, 230, 60); ctx.moveTo(-90, 85); ctx.lineTo(-150, 170); ctx.lineTo(-20, 85); fillStroke(ctx, '#fff', 8);
  for (let i = -1; i <= 1; i++) { circle(ctx, i * 95, -25, 26); ctx.fillStyle = '#2f63c9'; ctx.fill(); }
  ctx.restore();
}
function drawThought(ctx, x, y, s, kind) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(ctx, -110, 150, 14); fillStroke(ctx, '#fff', 5); circle(ctx, -70, 100, 22); fillStroke(ctx, '#fff', 5);
  cloudShape(ctx, 0, 0, 110, 6); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); cloudShape(ctx, 0, 0, 110, 6); ctx.fillStyle = '#fff'; ctx.fill();
  if (kind) kind(ctx);
  ctx.restore();
}
function stormSky(ctx, cam, t, flash = 0) {
  applyCam(ctx, cam, .08); const g = ctx.createLinearGradient(0, -200, 0, 1600); g.addColorStop(0, mix('#2a2140', '#e8e2ff', flash)); g.addColorStop(1, mix('#5a3a4a', '#ffffff', flash * .6)); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 5080, 6000);
  applyCam(ctx, cam, .15);
  for (const [x, y, s, sd] of [[150, 300, 160, 1], [700, 220, 190, 2], [1000, 480, 130, 3], [400, 520, 120, 4]]) { ctx.save(); cloudShape(ctx, x + Math.sin(t * .5 + sd) * 20, y, s, sd); ctx.fillStyle = mix('#4a4058', '#b8b0d0', flash); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#1e1828'; ctx.stroke(); ctx.restore(); }
}
function bolt(ctx, x, y, s, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  path(ctx, [[0, 0], [-60, 220], [10, 210], [-50, 420], [90, 160], [20, 170], [70, 0]]); fillStroke(ctx, '#ffe14d', 7); ctx.restore();
}
function confetti(ctx, x, y, k, seed = 1, n = 40) {
  if (k <= 0 || k > 1.6) return; const R = rng(seed); const cols = ['#e0392f', '#ffd23a', '#2f63c9', '#3fa35b', '#ff7ac8', '#fff'];
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (R() - .5) * 2.4, sp = 900 + R() * 900; const px = x + Math.cos(a) * sp * k, py = y + Math.sin(a) * sp * k + 1300 * k * k;
    ctx.save(); ctx.translate(px, py); ctx.rotate(k * 20 * (R() - .5)); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-12, -6, 24, 12); ctx.restore(); }
}
function savannaBG(ctx, cam, t) {
  applyCam(ctx, cam, .08); drawSky(ctx, '#ff9a4a', '#ffe0a0', -300, 1000);
  applyCam(ctx, cam, .1); drawSun(ctx, 540, 820, 150, t, 1.1);
  applyCam(ctx, cam, .25);
  ctx.beginPath(); ctx.moveTo(-600, 900); for (let x = -600; x <= 1700; x += 100) ctx.lineTo(x, 880 - Math.sin(x * .004) * 60 - Math.sin(x * .011) * 25); ctx.lineTo(1700, 2400); ctx.lineTo(-600, 2400); ctx.closePath(); ctx.fillStyle = '#c96a3a'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#7a3a26'; ctx.stroke();
  drawAcacia(ctx, 900, 920, .9, '#5a2a22', '#6a7a3a'); drawAcacia(ctx, 120, 900, .6, '#5a2a22', '#6a7a3a');
  applyCam(ctx, cam, .5);
  ctx.beginPath(); ctx.moveTo(-600, 1050); for (let x = -600; x <= 1700; x += 80) ctx.lineTo(x, 1040 - Math.sin(x * .006 + 1) * 30); ctx.lineTo(1700, 2400); ctx.lineTo(-600, 2400); ctx.closePath(); ctx.fillStyle = '#e8a84a'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#9a5a26'; ctx.stroke();
}
function groundBG(ctx, cam, t, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, o.top || '#3ea6ee', o.bot || '#c9ecfb', -400, 1100);
  applyCam(ctx, cam, .14); drawCloud(ctx, 180 + t * 8, 280, 110, 1); drawCloud(ctx, 820 + t * 5, 180, 90, 2); drawCloud(ctx, 1000 + t * 6, 480, 70, 3, .9);
  applyCam(ctx, cam, .4);
  ctx.beginPath(); ctx.moveTo(-800, 1000); for (let x = -800; x <= 1900; x += 120) ctx.lineTo(x, 980 - Math.sin(x * .005) * 50); ctx.lineTo(1900, 2600); ctx.lineTo(-800, 2600); ctx.closePath(); ctx.fillStyle = o.hill || '#6cc35a'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#2f6a2a'; ctx.stroke();
}
