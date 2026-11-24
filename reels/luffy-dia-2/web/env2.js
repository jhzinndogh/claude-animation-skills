// ---------- Shells Town: characters, props and sets for "Dia 2" ----------
// hair and hats are drawn on top of the face (HATS_FRONT), in head units (hr = .19)
const HATS = {};
const HATS_FRONT = {
  straw(ctx, hx, hy, hr, lw, o) {
    const by = hy - hr * .5;
    // crown
    const crown = () => { ctx.beginPath(); ctx.moveTo(hx - hr * .92, by); ctx.bezierCurveTo(hx - hr * .95, by - hr * 1.05, hx + hr * .95, by - hr * 1.05, hx + hr * .92, by); ctx.closePath(); };
    // brim (back half first so the crown sits inside it)
    ellipse(ctx, hx, by + .004, hr * 1.55, hr * .32); fillStroke(ctx, '#f2cf5b', lw);
    ctx.save(); ellipse(ctx, hx, by + .004, hr * 1.55, hr * .32); ctx.clip(); ctx.fillStyle = 'rgba(150,90,20,.25)'; ctx.fillRect(hx + hr * .4, by - hr, hr * 2, hr * 2);
    ctx.strokeStyle = 'rgba(160,110,30,.5)'; ctx.lineWidth = .006; for (let i = 1; i < 3; i++) { ellipse(ctx, hx, by + .004, hr * (1.55 - i * .2), hr * (.32 - i * .04)); ctx.stroke(); } ctx.restore();
    crown(); fillStroke(ctx, '#f6d66a', lw);
    ctx.save(); crown(); ctx.clip();
    ctx.fillStyle = '#d8312b'; ctx.fillRect(hx - hr, by - hr * .3, hr * 2, hr * .3);
    ctx.fillStyle = 'rgba(150,90,20,.22)'; ctx.fillRect(hx + hr * .35, by - hr * 1.2, hr, hr * 1.2);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ellipse(ctx, hx - hr * .4, by - hr * .62, hr * .22, hr * .09, -.3); ctx.fill();
    ctx.restore(); crown(); fillStroke(ctx, null, lw);
    line(ctx, hx - hr * .9, by - hr * .3, hx + hr * .9, by - hr * .3, lw * .8);
  },
  zoro(ctx, hx, hy, hr, lw) {
    // short spiky green hair
    ctx.beginPath(); ctx.moveTo(hx - hr * .98, hy - hr * .2);
    const n = 9;
    for (let i = 0; i <= n; i++) { const a = Math.PI + .25 + (Math.PI - .5) * i / n; const r1 = hr * 1.18, r2 = hr * .98; ctx.lineTo(hx + Math.cos(a - .09) * r1, hy + Math.sin(a - .09) * r1 * .95); ctx.lineTo(hx + Math.cos(a + .08) * r2, hy + Math.sin(a + .08) * r2); }
    ctx.lineTo(hx + hr * .98, hy - hr * .2); ctx.lineTo(hx + hr * .55, hy - hr * .5); ctx.lineTo(hx + hr * .3, hy - hr * .36); ctx.lineTo(hx, hy - hr * .52); ctx.lineTo(hx - hr * .3, hy - hr * .36); ctx.lineTo(hx - hr * .55, hy - hr * .5); ctx.lineTo(hx - hr * .98, hy - hr * .2); ctx.closePath();
    fillStroke(ctx, '#3fae4f', lw);
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(10,60,20,.25)'; ctx.fillRect(hx + hr * .3, hy - hr * 1.4, hr, hr * 1.4); ctx.restore();
    // three gold earrings, left ear
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(hx - hr * 1.01, hy + hr * (.05 + i * .17), .012, .018, 0, 0, TAU); ctx.lineWidth = .008; ctx.strokeStyle = '#e8b830'; ctx.stroke(); }
  },
  koby(ctx, hx, hy, hr, lw) {
    // pink hair parted in the middle
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.02, hy + hr * .05); ctx.bezierCurveTo(hx - hr * 1.15, hy - hr * 1.2, hx + hr * 1.15, hy - hr * 1.2, hx + hr * 1.02, hy + hr * .05);
    ctx.quadraticCurveTo(hx + hr * .85, hy - hr * .45, hx + hr * .1, hy - hr * .55); ctx.lineTo(hx, hy - hr * .7); ctx.lineTo(hx - hr * .1, hy - hr * .55); ctx.quadraticCurveTo(hx - hr * .85, hy - hr * .45, hx - hr * 1.02, hy + hr * .05); ctx.closePath();
    fillStroke(ctx, '#f28cc0', lw);
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(120,20,70,.2)'; ctx.fillRect(hx + hr * .3, hy - hr * 1.4, hr, hr * 1.6); ctx.restore();
  },
  helmeppo(ctx, hx, hy, hr, lw) {
    // blond bowl cut
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.08, hy + hr * .15); ctx.bezierCurveTo(hx - hr * 1.2, hy - hr * 1.3, hx + hr * 1.2, hy - hr * 1.3, hx + hr * 1.08, hy + hr * .15);
    ctx.lineTo(hx + hr * .9, hy - hr * .42); ctx.lineTo(hx - hr * .9, hy - hr * .42); ctx.closePath(); fillStroke(ctx, '#f5d24a', lw);
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(150,100,0,.22)'; ctx.fillRect(hx + hr * .3, hy - hr * 1.4, hr, hr * 1.6); ctx.restore();
  },
  morgan(ctx, hx, hy, hr, lw) {
    // flat blond top
    rrect(ctx, hx - hr * .9, hy - hr * 1.22, hr * 1.8, hr * .55, .02); fillStroke(ctx, '#e8c84a', lw);
  },
};
// extras drawn after the face
const LUFFY_FACE = (ctx, hx, hy, hr, o) => { // scar under the left eye
  const x = hx - .072 + ((o.face && o.face.turn) || 0) * .06, y = hy + .05;
  ctx.beginPath(); ctx.moveTo(x - .03, y); ctx.quadraticCurveTo(x, y + .012, x + .03, y); ctx.lineWidth = .009; ctx.strokeStyle = '#8a3a30'; ctx.stroke();
  for (const k of [-.016, 0, .016]) line(ctx, x + k, y - .006, x + k, y + .014, .006, '#8a3a30');
};
const KOBY_FACE = (ctx, hx, hy, hr, o) => { // round glasses
  for (const side of [-1, 1]) { circle(ctx, hx + side * .072, hy - .005, .055); ctx.lineWidth = .011; ctx.strokeStyle = INK; ctx.stroke(); }
  line(ctx, hx - .018, hy - .01, hx + .018, hy - .01, .01);
};
const MORGAN_FACE = (ctx, hx, hy, hr, o) => { // steel jaw
  rrect(ctx, hx - hr * .75, hy + hr * .32, hr * 1.5, hr * .5, .03); fillStroke(ctx, '#aab2bf', .014);
  ctx.save(); rrect(ctx, hx - hr * .75, hy + hr * .32, hr * 1.5, hr * .5, .03); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(hx - hr * .7, hy + hr * .36, hr * 1.4, .012);
  for (let i = -2; i <= 2; i++) line(ctx, hx + i * .045, hy + hr * .5, hx + i * .045, hy + hr * .82, .008, '#5b6270');
  ctx.restore();
  for (const sx of [-1, 1]) { circle(ctx, hx + sx * hr * .62, hy + hr * .45, .01); ctx.fillStyle = '#5b6270'; ctx.fill(); }
};
const SASH = (col) => (ctx, tw, tTop, tBot) => { ctx.fillStyle = col; ctx.fillRect(-tw, -.37, tw * 2, .06); };
const LUFFY = { cols: ['#d8312b', '#d8312b'], hat: 'straw', belt: false, torsoExtra: (ctx, tw, tTop) => { ctx.fillStyle = '#f2c14a'; ctx.fillRect(-tw, -.37, tw * 2, .055); ctx.fillStyle = '#f6e2c8'; ctx.beginPath(); ctx.moveTo(-.03, tTop); ctx.lineTo(.03, tTop); ctx.lineTo(.012, -.45); ctx.lineTo(-.012, -.45); ctx.closePath(); ctx.fill(); }, headExtra: LUFFY_FACE };
const ZORO = { cols: ['#f4f1ea', '#f4f1ea'], hat: 'zoro', beltCol: '#3c8f45' };
const KOBY = { cols: ['#6b9be0', '#6b9be0'], hat: 'koby', belt: false, headExtra: KOBY_FACE };
const HELMEPPO = { cols: ['#8a55c9', '#8a55c9'], hat: 'helmeppo', belt: false };
const MORGAN = { cols: ['#f4f1ea', '#f4f1ea'], hat: 'morgan', beltCol: '#2a3f8f', headExtra: MORGAN_FACE };
const MARINE = { cols: ['#f4f1ea', '#2f63c9'], hat: 'sailor', belt: false };

// ---------- props ----------
function katana(ctx, x, y, len, ang, hilt = '#1e1a20', s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  rrect(ctx, -len * .28, -len * .03, len * .28, len * .06, len * .02); fillStroke(ctx, hilt, len * .018);
  for (let i = 1; i < 4; i++) line(ctx, -len * .28 + i * len * .07, -len * .03, -len * .28 + i * len * .07 + len * .02, len * .03, len * .008, 'rgba(255,255,255,.35)');
  ellipse(ctx, 0, 0, len * .025, len * .07); fillStroke(ctx, '#e2b84a', len * .014);
  ctx.beginPath(); ctx.moveTo(len * .02, -len * .022); ctx.lineTo(len * .92, -len * .03); ctx.quadraticCurveTo(len, -len * .02, len * .98, len * .02); ctx.lineTo(len * .02, len * .022); ctx.closePath(); fillStroke(ctx, '#dfe5ee', len * .014);
  line(ctx, len * .06, -len * .006, len * .9, -len * .012, len * .008, 'rgba(255,255,255,.9)');
  ctx.restore();
}
function threeSwords(ctx, x, y, s, spread = 1) {
  const hilts = ['#f4f1ea', '#c0302a', '#1e1a20'];
  [-1, 0, 1].forEach((k, i) => katana(ctx, x, y, 320 * s, -Math.PI / 2 + k * .38 * spread, hilts[i]));
}
function rifleProp(ctx, h, a, side) { // held along the forearm, in stick units
  ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(-side * a + Math.PI / 2 * 0);
  ctx.restore();
}
function drawRifle(ctx, x, y, len, ang) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  path(ctx, [[-len * .45, -len * .02], [-len * .1, -len * .035], [-len * .05, len * .04], [-len * .45, len * .09]]); fillStroke(ctx, '#8a5530', len * .02);
  rrect(ctx, -len * .12, -len * .03, len * .66, len * .055, len * .01); fillStroke(ctx, '#9a6232', len * .018);
  rrect(ctx, -len * .05, -len * .05, len * .6, len * .03, len * .01); fillStroke(ctx, '#4a4f5a', len * .016);
  ctx.restore();
}
// rifle pointed straight at the camera (foreshortened)
function rifleAtCam(ctx, x, y, r) {
  circle(ctx, x, y + r * 1.6, r * .9); fillStroke(ctx, '#8a5530', r * .18);
  circle(ctx, x, y, r); fillStroke(ctx, '#5a606c', r * .18);
  circle(ctx, x, y, r * .55); ctx.fillStyle = '#0a090c'; ctx.fill();
  ellipse(ctx, x - r * .35, y - r * .45, r * .25, r * .14, -.5); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill();
}
function axeHand(ctx, x, y, s, ang) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  rrect(ctx, -12, -20, 24, 70, 6); fillStroke(ctx, '#7a808c', 5);
  ctx.beginPath(); ctx.moveTo(-6, 40); ctx.quadraticCurveTo(-110, 60, -120, 150); ctx.quadraticCurveTo(-30, 175, 60, 150); ctx.quadraticCurveTo(70, 80, 6, 40); ctx.closePath(); fillStroke(ctx, '#c9d0da', 6);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(40,50,70,.25)'; ctx.fillRect(0, 30, 100, 160); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-120, 140, 200, 10); ctx.restore();
  ctx.restore();
}
function drawPost(ctx, x, base, h, barY, barW) {
  rrect(ctx, x - 26, base - h, 52, h, 8); fillStroke(ctx, '#9a6232', 6);
  rrect(ctx, x - barW / 2, barY - 24, barW, 48, 8); fillStroke(ctx, '#a96e3a', 6);
  ctx.save(); rrect(ctx, x - 26, base - h, 52, h, 8); ctx.clip(); ctx.fillStyle = 'rgba(60,20,0,.25)'; ctx.fillRect(x + 4, base - h, 30, h); ctx.restore();
  ellipse(ctx, x, base, 90, 16); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
}
function ropeWraps(ctx, x, y, w, n, col = '#d9b77a') {
  for (let i = 0; i < n; i++) { const yy = y + i * 22; ctx.beginPath(); ctx.ellipse(x, yy, w / 2, 12, 0, 0, Math.PI); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = col; ctx.stroke(); }
}
function drawGround(ctx, back, col = '#e7c48c', col2 = '#d6a96a', bottom = 2600) {
  const g = ctx.createLinearGradient(0, back, 0, bottom); g.addColorStop(0, col2); g.addColorStop(1, col);
  ctx.fillStyle = g; ctx.fillRect(-1500, back, 4080, bottom - back);
  const R = rng(17); ctx.fillStyle = 'rgba(140,90,40,.25)';
  for (let i = 0; i < 70; i++) { const d = R(); const y = back + 20 + d * d * (bottom - back); ellipse(ctx, -400 + R() * 1900, y, 8 + d * 26, 3 + d * 8); ctx.fill(); }
  ctx.fillStyle = 'rgba(60,30,10,.2)'; ctx.fillRect(-1500, back, 4080, 12);
}
function drawBaseWall(ctx, top, base, x0 = -1500, x1 = 2600, spikes = false) {
  rrect(ctx, x0, top, x1 - x0, base - top, 0); fillStroke(ctx, '#e9e4d8', 6);
  ctx.save(); rrect(ctx, x0, top, x1 - x0, base - top, 0); ctx.clip();
  ctx.strokeStyle = 'rgba(120,110,100,.35)'; ctx.lineWidth = 4;
  for (let y = top + 70, r = 0; y < base; y += 70, r++) { line(ctx, x0, y, x1, y, 4, 'rgba(120,110,100,.35)'); for (let x = x0 + (r % 2) * 80; x < x1; x += 160) line(ctx, x, y - 70, x, y, 4, 'rgba(120,110,100,.3)'); }
  ctx.fillStyle = '#2f63c9'; ctx.fillRect(x0, top + 20, x1 - x0, 26);
  ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x0, base - 40, x1 - x0, 40);
  ctx.restore();
  rrect(ctx, x0, top - 18, x1 - x0, 26, 6); fillStroke(ctx, '#cfc8b8', 5);
  if (spikes) for (let x = x0 + 30; x < x1; x += 70) { path(ctx, [[x - 14, top - 16], [x, top - 60], [x + 14, top - 16]]); fillStroke(ctx, '#5a606c', 4); }
}
function gull(ctx, x, y, s, t) {
  const f = Math.sin(t * 9) * .4;
  ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 10 * s * (1 + f)); ctx.quadraticCurveTo(x - 12 * s, y - 16 * s, x, y); ctx.quadraticCurveTo(x + 12 * s, y - 16 * s, x + 30 * s, y - 10 * s * (1 + f));
  ctx.lineWidth = 4 * s; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
}
function drawHouse(ctx, x, base, w, h, wall, roof, seed) {
  rrect(ctx, x - w / 2, base - h, w, h, 4); fillStroke(ctx, wall, 5);
  ctx.save(); rrect(ctx, x - w / 2, base - h, w, h, 4); ctx.clip(); ctx.fillStyle = 'rgba(60,30,40,.15)'; ctx.fillRect(x + w * .15, base - h, w, h); ctx.restore();
  path(ctx, [[x - w / 2 - 18, base - h + 6], [x, base - h - w * .42], [x + w / 2 + 18, base - h + 6]]); fillStroke(ctx, roof, 5);
  const R = rng(seed);
  for (let i = 0; i < 2; i++) { rrect(ctx, x - w * .32 + i * w * .38, base - h * .72, w * .24, h * .26, 4); fillStroke(ctx, R() > .5 ? '#ffe7a0' : '#7fc6e8', 4); }
  rrect(ctx, x - w * .12, base - h * .36, w * .24, h * .36, 4); fillStroke(ctx, '#8a5530', 4);
}
// Marine base: fortress with a tall tower
function drawMarineBase(ctx, x, base, s, t) {
  ctx.save(); ctx.translate(x, base); ctx.scale(s, s);
  // walls
  rrect(ctx, -330, -230, 660, 230, 6); fillStroke(ctx, '#e9e4d8', 6);
  for (let i = -330; i < 330; i += 60) { rrect(ctx, i + 6, -262, 40, 36, 4); fillStroke(ctx, '#e9e4d8', 5); }
  ctx.fillStyle = '#2f63c9'; ctx.fillRect(-327, -210, 654, 18);
  // tower
  rrect(ctx, -110, -720, 220, 500, 8); fillStroke(ctx, '#f2eee4', 6);
  ctx.save(); rrect(ctx, -110, -720, 220, 500, 8); ctx.clip(); ctx.fillStyle = 'rgba(60,50,80,.16)'; ctx.fillRect(30, -720, 120, 520); ctx.restore();
  rrect(ctx, -140, -790, 280, 80, 10); fillStroke(ctx, '#2f63c9', 6);
  text(ctx, 'MARINHA', 0, -750, 50, '#fff', INK, 0, 'Poppins', 700);
  for (let i = 0; i < 3; i++) { rrect(ctx, -30, -660 + i * 140, 60, 80, 30); fillStroke(ctx, '#1d2a4a', 5); }
  // flag
  line(ctx, 0, -790, 0, -930, 7);
  ctx.beginPath(); ctx.moveTo(4, -930); for (let i = 0; i <= 5; i++) ctx.lineTo(4 + i * 22, -930 + Math.sin(t * 5 + i) * 6); ctx.lineTo(114, -870); for (let i = 5; i >= 0; i--) ctx.lineTo(4 + i * 22, -870 + Math.sin(t * 5 + i) * 6); ctx.closePath(); fillStroke(ctx, '#2f63c9', 5);
  gull(ctx, 58, -895, .9, 0);
  // gate
  rrect(ctx, -80, -170, 160, 170, [70, 70, 0, 0]); fillStroke(ctx, '#3b2a2c', 6);
  ctx.restore();
}
function drawTown(ctx, base, t, x0 = -200) {
  const H = [[x0, 170, 190, '#f6c7a0', '#c0503a', 1], [x0 + 190, 150, 240, '#bfe0f2', '#2f63c9', 2], [x0 + 360, 160, 170, '#f7e39a', '#d06a2c', 3], [x0 + 1010, 170, 200, '#f6c7a0', '#8a4f9e', 4], [x0 + 1190, 150, 160, '#d2f0c6', '#c0503a', 5], [x0 + 1350, 170, 230, '#f2d6e6', '#2f63c9', 6]];
  for (const [x, w, h, wc, rc, sd] of H) drawHouse(ctx, x, base, w, h, wc, rc, sd);
}
function drawRowboat(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2.2) * 6 * s); ctx.rotate(Math.sin(t * 1.7) * .03); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-300, -70); ctx.lineTo(320, -80); ctx.quadraticCurveTo(300, 30, 200, 45); ctx.lineTo(-220, 45); ctx.quadraticCurveTo(-300, 20, -300, -70); ctx.closePath(); fillStroke(ctx, '#b66a34', 6);
  ctx.save(); ctx.clip(); ctx.fillStyle = '#e2b04a'; ctx.fillRect(-320, -40, 660, 14); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(-320, 10, 660, 50); ctx.restore();
  line(ctx, -300, -70, 320, -80, 12, '#8a4f24');
  ctx.fillStyle = 'rgba(255,255,255,.8)'; ellipse(ctx, 0, 48, 330, 12); ctx.fill();
  ctx.restore();
}
function drawDock(ctx, y, x0, x1) {
  for (let x = x0 + 40; x < x1; x += 180) { rrect(ctx, x - 16, y - 10, 32, 240, 6); fillStroke(ctx, '#7a4a2a', 5); }
  rrect(ctx, x0, y - 40, x1 - x0, 50, 4); fillStroke(ctx, '#b8804a', 5);
  for (let x = x0; x < x1; x += 60) line(ctx, x, y - 40, x, y + 10, 3, 'rgba(70,35,10,.5)');
}
function strawFlag(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-160, -110); for (let i = 0; i <= 8; i++) ctx.lineTo(-160 + i * 40, -110 + Math.sin(t * 5 + i * .8) * 8); ctx.lineTo(160, 110); for (let i = 8; i >= 0; i--) ctx.lineTo(-160 + i * 40, 110 + Math.sin(t * 5 + i * .8) * 8); ctx.closePath(); fillStroke(ctx, '#1b1820', 8);
  line(ctx, -70, 50, 70, 90, 22, '#f2efe6'); line(ctx, -70, 90, 70, 50, 22, '#f2efe6');
  circle(ctx, 0, 0, 56); ctx.fillStyle = '#f2efe6'; ctx.fill();
  circle(ctx, -20, 4, 13); circle(ctx, 20, 4, 13); ctx.fillStyle = '#1b1820'; ctx.fill();
  ellipse(ctx, 0, -38, 92, 18); fillStroke(ctx, '#f2cf5b', 5); ctx.beginPath(); ctx.moveTo(-50, -38); ctx.bezierCurveTo(-52, -90, 52, -90, 50, -38); ctx.closePath(); fillStroke(ctx, '#f6d66a', 5);
  ctx.fillStyle = '#d8312b'; ctx.fillRect(-49, -52, 98, 12);
  ctx.restore();
}
function heart(ctx, x, y, s, col = '#ff3b5c') {
  ctx.beginPath(); ctx.moveTo(x, y + s * .9); ctx.bezierCurveTo(x - s * 1.4, y, x - s * .7, y - s * 1.1, x, y - s * .35); ctx.bezierCurveTo(x + s * .7, y - s * 1.1, x + s * 1.4, y, x, y + s * .9); fillStroke(ctx, col, s * .14);
}
function commentBubble(ctx, x, y, w, h, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -w / 2, -h / 2, w, h, 40); fillStroke(ctx, '#ffffff', 8);
  path(ctx, [[-w * .25, h / 2 - 4], [-w * .32, h / 2 + 50], [-w * .1, h / 2 - 4]]); fillStroke(ctx, '#ffffff', 8);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-w * .3, h / 2 - 14, w * .24, 12);
  ctx.restore();
}
// option card for the cliffhanger
function choiceCard(ctx, x, y, w, h, num, l1, l2, col, hi = 0, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); const sc = 1 + hi * .06; ctx.scale(sc, sc);
  ctx.fillStyle = 'rgba(20,10,20,.35)'; rrect(ctx, -w / 2 + 10, -h / 2 + 14, w, h, 30); ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, 30); fillStroke(ctx, '#fffaf0', 9);
  if (hi > 0) { rrect(ctx, -w / 2 - 14, -h / 2 - 14, w + 28, h + 28, 40); ctx.lineWidth = 10; ctx.strokeStyle = `rgba(255,225,77,${hi})`; ctx.stroke(); }
  circle(ctx, -w / 2 + 80, 0, 56); fillStroke(ctx, col, 8);
  text(ctx, String(num), -w / 2 + 80, 4, 74, '#fff', INK, 0, 'Poppins', 700);
  text(ctx, l1, -w / 2 + 160, l2 ? -26 : 2, 58, INK, null, 0, 'Poppins', 700, 'left');
  if (l2) text(ctx, l2, -w / 2 + 160, 34, 40, '#6a5a60', null, 0, 'Poppins', 700, 'left');
  ctx.restore();
}
function tag(ctx, str, x, y, size, bg = '#ffe14d', fg = INK, rot = -.04, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(str).width + size * .9, h = size * 1.45;
  ctx.fillStyle = 'rgba(20,10,20,.35)'; rrect(ctx, -w / 2 + 8, -h / 2 + 10, w, h, h * .25); ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, h * .25); fillStroke(ctx, bg, size * .12);
  text(ctx, str, 0, size * .05, size, fg, null, 0, 'Poppins', 700);
  ctx.restore();
}
function heatHaze(ctx, a) { caribbeanHeat(ctx, a); }
function flashFrame(ctx, a, col = '255,245,220') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(${col},${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function speedLines(ctx, cx, cy, a, t, col = 'rgba(255,255,255,') {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const R = rng(Math.floor(t * 12) + 3);
  for (let i = 0; i < 46; i++) { const ang = R() * TAU, r0 = 420 + R() * 260, r1 = 1500; ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang - .012) * r0, cy + Math.sin(ang - .012) * r0); ctx.lineTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1); ctx.lineTo(cx + Math.cos(ang + .012) * r0, cy + Math.sin(ang + .012) * r0); ctx.fillStyle = col + (a * (.35 + R() * .4)) + ')'; ctx.fill(); }
  ctx.restore();
}
// town sky + sea backdrop used by the port shots
function portBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, o.skyTop || '#3ea6ee', o.skyBot || '#d9f1fb', -400, o.horizon || 900);
  applyCam(ctx, cam, .1); drawSun(ctx, o.sun ? o.sun[0] : 880, o.sun ? o.sun[1] : 220, 70, t, o.sunPow || .9);
  applyCam(ctx, cam, .14); drawCloud(ctx, 160 + t * 6, 300, 110, 1); drawCloud(ctx, 820 + t * 4, 170, 80, 2);
  gull(ctx, 300 + t * 30, 520, 1, t); gull(ctx, 380 + t * 30, 560, .7, t + 1);
}
