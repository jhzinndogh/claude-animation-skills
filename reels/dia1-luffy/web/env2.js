// ---------- Dia 1: characters (hats, hair, faces) and new props ----------
// head-space helpers: (hx, hy) head centre, hr head radius, all in figure units
function strawHat(ctx, hx, hy, hr, lw, o = {}) {
  const by = hy - hr * .5, tilt = o.tilt || -.08;
  ctx.save(); ctx.translate(hx, by); ctx.rotate(tilt); ctx.translate(-hx, -by);
  // black hair tufts poking out under the brim
  if (o.hair !== false) {
    ctx.beginPath();
    for (const side of [-1, 1]) {
      const x0 = hx + side * hr * .98;
      ctx.moveTo(x0, by + hr * .05); ctx.lineTo(x0 + side * hr * .22, by + hr * .32); ctx.lineTo(x0 - side * hr * .02, by + hr * .3);
      ctx.lineTo(x0 + side * hr * .12, by + hr * .58); ctx.lineTo(x0 - side * hr * .18, by + hr * .35); ctx.closePath();
    }
    for (let i = -2; i <= 2; i++) { const x = hx + i * hr * .3; ctx.moveTo(x - hr * .16, by + hr * .1); ctx.lineTo(x + hr * .02, by + hr * .42); ctx.lineTo(x + hr * .16, by + hr * .1); ctx.closePath(); }
    ctx.fillStyle = '#1d1a22'; ctx.fill();
  }
  // brim
  ellipse(ctx, hx, by, hr * 1.62, hr * .3); fillStroke(ctx, '#f0c54e', lw);
  ctx.save(); ellipse(ctx, hx, by, hr * 1.62, hr * .3); ctx.clip();
  ctx.strokeStyle = 'rgba(150,100,20,.45)'; ctx.lineWidth = lw * .45;
  for (let i = 0; i < 3; i++) { ellipse(ctx, hx, by, hr * (1.1 + i * .17), hr * (.18 + i * .04)); ctx.stroke(); }
  ctx.fillStyle = 'rgba(120,70,10,.18)'; ctx.fillRect(hx + hr * .4, by - hr, hr * 2, hr * 2);
  ctx.restore();
  // crown
  const crown = () => { ctx.beginPath(); ctx.moveTo(hx - hr * .9, by); ctx.bezierCurveTo(hx - hr * .95, by - hr * .95, hx + hr * .95, by - hr * .95, hx + hr * .9, by); ctx.quadraticCurveTo(hx, by + hr * .14, hx - hr * .9, by); ctx.closePath(); };
  crown(); ctx.fillStyle = '#f6d468'; ctx.fill();
  ctx.save(); crown(); ctx.clip();
  ctx.fillStyle = '#d8312b'; ctx.beginPath(); ctx.moveTo(hx - hr, by - hr * .26); ctx.quadraticCurveTo(hx, by - hr * .18, hx + hr, by - hr * .26); ctx.lineTo(hx + hr, by + .01); ctx.lineTo(hx - hr, by + .01); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(120,70,10,.2)'; ctx.fillRect(hx + hr * .35, by - hr, hr, hr * 1.2);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ellipse(ctx, hx - hr * .4, by - hr * .58, hr * .22, hr * .08, -.4); ctx.fill();
  ctx.restore();
  crown(); fillStroke(ctx, null, lw);
  ctx.restore();
}
// Luffy's scar under the left eye
function luffyScar(ctx, hx, hy, hr) {
  const x = hx - .072, y = hy + .045;
  line(ctx, x - .028, y, x + .028, y + .004, .009); line(ctx, x - .012, y - .012, x - .016, y + .014, .008); line(ctx, x + .01, y - .01, x + .006, y + .016, .008);
}
function marineCap(ctx, hx, hy, hr, lw, hair) {
  const top = hy - hr * .62;
  if (hair) { ctx.beginPath(); ctx.arc(hx, hy - hr * .1, hr * 1.04, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(hx + hr * .9, hy - hr * .15); ctx.lineTo(hx - hr * .9, hy - hr * .15); ctx.closePath(); fillStroke(ctx, hair, lw); }
  ctx.beginPath(); ctx.moveTo(hx - hr * .95, top + hr * .2); ctx.quadraticCurveTo(hx - hr * 1.05, top - hr * .55, hx, top - hr * .6); ctx.quadraticCurveTo(hx + hr * 1.05, top - hr * .55, hx + hr * .95, top + hr * .2); ctx.closePath(); fillStroke(ctx, '#f7f7f4', lw);
  rrect(ctx, hx - hr * .98, top + hr * .02, hr * 1.96, hr * .24, hr * .08); fillStroke(ctx, '#2a4f9e', lw);
  ctx.beginPath(); ctx.moveTo(hx - hr * .7, top + hr * .26); ctx.quadraticCurveTo(hx, top + hr * .62, hx + hr * .7, top + hr * .26); ctx.closePath(); fillStroke(ctx, '#1f2b52', lw);
  // gull emblem
  ctx.beginPath(); ctx.moveTo(hx - hr * .2, top - hr * .2); ctx.quadraticCurveTo(hx - hr * .1, top - hr * .32, hx, top - hr * .2); ctx.quadraticCurveTo(hx + hr * .1, top - hr * .32, hx + hr * .2, top - hr * .2); ctx.lineWidth = lw * .8; ctx.strokeStyle = '#2a4f9e'; ctx.stroke();
}
function kobyHair(ctx, hx, hy, hr, lw) {
  const shape = () => {
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.06, hy + hr * .1);
    ctx.bezierCurveTo(hx - hr * 1.2, hy - hr * 1.15, hx + hr * 1.2, hy - hr * 1.15, hx + hr * 1.06, hy + hr * .1);
    ctx.lineTo(hx + hr * .86, hy - hr * .2);
    for (let i = 0; i < 5; i++) { const x = hx + hr * (.7 - i * .35); ctx.lineTo(x - hr * .1, hy - hr * .5); ctx.lineTo(x - hr * .2, hy - hr * .3); }
    ctx.lineTo(hx - hr * .9, hy - hr * .2); ctx.closePath();
  };
  shape(); ctx.fillStyle = '#f48fbd'; ctx.fill();
  ctx.save(); shape(); ctx.clip(); ctx.fillStyle = 'rgba(150,30,80,.2)'; ctx.fillRect(hx + hr * .3, hy - hr * 2, hr * 2, hr * 3);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ellipse(ctx, hx - hr * .35, hy - hr * .78, hr * .3, hr * .09, -.3); ctx.fill(); ctx.restore();
  shape(); fillStroke(ctx, null, lw);
}
function kobyGlasses(ctx, hx, hy, hr, lw) {
  for (const side of [-1, 1]) { circle(ctx, hx + side * .072, hy - .005, .058); ctx.fillStyle = 'rgba(200,235,255,.25)'; ctx.fill(); ctx.lineWidth = .011; ctx.strokeStyle = INK; ctx.stroke(); }
  line(ctx, hx - .016, hy - .01, hx + .016, hy - .01, .01);
}
function alvidaHair(ctx, hx, hy, hr, lw) {
  const R = rng(21); ctx.beginPath();
  const b = [];
  for (let i = 0; i < 11; i++) { const a = Math.PI * (.85 + i * .13); b.push([hx + Math.cos(a) * hr * 1.05, hy + Math.sin(a) * hr * 1.0 - hr * .05, hr * (.32 + R() * .12)]); }
  for (const side of [-1, 1]) for (let j = 0; j < 3; j++) b.push([hx + side * hr * (1.05 + j * .08), hy + hr * (.2 + j * .32), hr * (.3 - j * .03)]);
  b.forEach(c => { ctx.moveTo(c[0] + c[2], c[1]); ctx.arc(c[0], c[1], c[2], 0, TAU); });
  ctx.lineWidth = lw * 1.2; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = '#26212c'; ctx.fill();
}
function alvidaFace(ctx, hx, hy, hr, lw) {
  ctx.fillStyle = '#c98a5a';
  for (const [x, y] of [[-.11, .04], [-.09, .065], [-.125, .07], [.11, .04], [.09, .065], [.125, .07]]) { circle(ctx, hx + x, hy + y, .008); ctx.fill(); }
}
function alvidaHat(ctx, hx, hy, hr, lw) {
  const by = hy - hr * .62;
  ctx.beginPath(); ctx.moveTo(hx - hr * 1.75, by + hr * .1); ctx.quadraticCurveTo(hx, by - hr * .35, hx + hr * 1.75, by + hr * .1); ctx.quadraticCurveTo(hx, by + hr * .25, hx - hr * 1.75, by + hr * .1); fillStroke(ctx, '#6a3f8f', lw);
  ctx.beginPath(); ctx.moveTo(hx - hr * .75, by - hr * .05); ctx.quadraticCurveTo(hx - hr * .8, by - hr * .95, hx - hr * .2, by - hr * .8); ctx.quadraticCurveTo(hx, by - hr * .6, hx + hr * .2, by - hr * .8); ctx.quadraticCurveTo(hx + hr * .8, by - hr * .95, hx + hr * .75, by - hr * .05); ctx.closePath(); fillStroke(ctx, '#7c4aa6', lw);
  rrect(ctx, hx - hr * .78, by - hr * .3, hr * 1.56, hr * .2, hr * .05); fillStroke(ctx, '#ff6fa8', lw * .8);
}
function zoroHair(ctx, hx, hy, hr, lw) {
  ctx.beginPath(); ctx.moveTo(hx - hr * 1.0, hy - hr * .15);
  for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.05 + i * .1125); const r = hr * (i % 2 ? 1.18 : 1.02); ctx.lineTo(hx + Math.cos(a) * r, hy + Math.sin(a) * r); }
  ctx.lineTo(hx + hr * 1.0, hy - hr * .15); ctx.quadraticCurveTo(hx, hy - hr * .55, hx - hr * 1.0, hy - hr * .15); ctx.closePath(); fillStroke(ctx, '#58b85a', lw);
}
function garpHair(ctx, hx, hy, hr, lw) {
  // grey beard + sideburns
  ctx.beginPath(); ctx.moveTo(hx - hr * .95, hy - hr * .1); ctx.quadraticCurveTo(hx - hr * 1.05, hy + hr * .8, hx, hy + hr * 1.05); ctx.quadraticCurveTo(hx + hr * 1.05, hy + hr * .8, hx + hr * .95, hy - hr * .1);
  ctx.quadraticCurveTo(hx + hr * .7, hy + hr * .5, hx + hr * .3, hy + hr * .38); ctx.quadraticCurveTo(hx, hy + hr * .62, hx - hr * .3, hy + hr * .38); ctx.quadraticCurveTo(hx - hr * .7, hy + hr * .5, hx - hr * .95, hy - hr * .1); ctx.closePath();
  fillStroke(ctx, '#d9d6d2', lw);
}
// characters (drawStick option sets)
const LUFFY = { cols: ['#f3dcc4', '#f3dcc4'], belt: false, vest: '#d8312b', hatFn: (c, hx, hy, hr, lw) => strawHat(c, hx, hy, hr, lw), after: (c, hx, hy, hr) => luffyScar(c, hx, hy, hr) };
const KOBY = { cols: ['#86c7ee', '#f6f1e8'], belt: false, hatFn: kobyHair, after: kobyGlasses };
const ALVIDA = { cols: ['#8b5bc8', '#8b5bc8'], tw: .42, behind: alvidaHair, after: alvidaFace, hatFn: alvidaHat, vest: '#ff6fa8' };
const ALVIDA_PIRATE = { cols: ['#3a3f4a', '#f6f1e8'], hat: 'bandana', hatCol: '#ff6fa8', dotCol: '#fff' };
const ZORO = { cols: ['#f6f6f2', '#f6f6f2'], belt: false, vest: '#2f8c48', hatFn: zoroHair };
const GARP = { cols: ['#f7f7f4', '#f7f7f4'], belt: false, vest: '#2a4f9e', tw: .34, behind: garpHair, hatFn: (c, hx, hy, hr, lw) => marineCap(c, hx, hy, hr, lw, '#d9d6d2') };
const LUFFY_MARINE = Object.assign({}, LUFFY, { cols: ['#f7f7f4', '#2a4f9e'], vest: null, hatFn: (c, hx, hy, hr, lw) => marineCap(c, hx, hy, hr, lw, '#1d1a22') });
const KOBY_MARINE = Object.assign({}, KOBY, { cols: ['#f7f7f4', '#2a4f9e'], hatFn: (c, hx, hy, hr, lw) => { kobyHair(c, hx, hy, hr, lw); marineCap(c, hx, hy - hr * .1, hr * .95, lw); } });

// ---------- props ----------
function heartPath(ctx, x, y, s) { ctx.beginPath(); ctx.moveTo(x, y + s * .9); ctx.bezierCurveTo(x - s * 1.6, y - s * .2, x - s * .8, y - s * 1.3, x, y - s * .55); ctx.bezierCurveTo(x + s * .8, y - s * 1.3, x + s * 1.6, y - s * .2, x, y + s * .9); ctx.closePath(); }
function drawMeat(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, 30, -14, 120, 28, 12); fillStroke(ctx, '#fbf6ea', 6);
  for (const dy of [-18, 18]) { circle(ctx, 150, dy, 22); fillStroke(ctx, '#fbf6ea', 6); }
  ctx.beginPath(); ctx.ellipse(-30, 0, 105, 82, 0, 0, TAU); fillStroke(ctx, '#b4502d', 7);
  ctx.save(); ctx.beginPath(); ctx.ellipse(-30, 0, 105, 82, 0, 0, TAU); ctx.clip();
  ctx.fillStyle = '#8f3a20'; ctx.fillRect(-30, 10, 160, 100); ctx.fillStyle = 'rgba(255,220,170,.35)'; ellipse(ctx, -60, -35, 40, 16, -.4); ctx.fill(); ctx.restore();
  ctx.restore();
}
function drawCrown(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  path(ctx, [[-110, 40], [-120, -60], [-60, -10], [0, -90], [60, -10], [120, -60], [110, 40]]); fillStroke(ctx, '#f6c531', 7);
  ctx.save(); path(ctx, [[-110, 40], [-120, -60], [-60, -10], [0, -90], [60, -10], [120, -60], [110, 40]]); ctx.clip(); ctx.fillStyle = 'rgba(160,90,0,.25)'; ctx.fillRect(20, -100, 120, 160); ctx.restore();
  rrect(ctx, -115, 18, 230, 34, 10); fillStroke(ctx, '#e6ab1f', 6);
  for (const [gx, col] of [[-60, '#e03b3b'], [0, '#3a7be0'], [60, '#3fa35b']]) { circle(ctx, gx, 35, 11); fillStroke(ctx, col, 4); }
  for (const [px, py] of [[-120, -60], [0, -90], [120, -60]]) { circle(ctx, px, py, 13); fillStroke(ctx, '#fff3b0', 5); }
  ctx.restore();
}
function drawJolly(ctx, x, y, w, t, straw = true) {
  // black flag with a skull wearing a straw hat
  ctx.save(); ctx.translate(x, y);
  const h = w * .66;
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2);
  for (let i = 0; i <= 8; i++) ctx.lineTo(-w / 2 + i * w / 8, -h / 2 + Math.sin(t * 5 + i * .8) * w * .02);
  for (let i = 8; i >= 0; i--) ctx.lineTo(-w / 2 + i * w / 8, h / 2 + Math.sin(t * 5 + i * .8) * w * .02);
  ctx.closePath(); fillStroke(ctx, '#1b1820', w * .02);
  const s = w / 300;
  line(ctx, -70 * s, 20 * s, 70 * s, 95 * s, 22 * s, '#f2efe6'); line(ctx, 70 * s, 20 * s, -70 * s, 95 * s, 22 * s, '#f2efe6');
  for (const [bx, by] of [[-70, 20], [70, 95], [70, 20], [-70, 95]]) { circle(ctx, bx * s, by * s, 14 * s); ctx.fillStyle = '#f2efe6'; ctx.fill(); }
  circle(ctx, 0, 0, 62 * s); ctx.fillStyle = '#f2efe6'; ctx.fill(); rrect(ctx, -34 * s, 30 * s, 68 * s, 40 * s, 10 * s); ctx.fill();
  for (const ex of [-24, 24]) { ellipse(ctx, ex * s, 2 * s, 15 * s, 18 * s); ctx.fillStyle = '#1b1820'; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(0, 22 * s); ctx.lineTo(-7 * s, 34 * s); ctx.lineTo(7 * s, 34 * s); ctx.closePath(); ctx.fill();
  if (straw) { ctx.save(); ctx.translate(0, -30 * s); ctx.scale(s * 300, s * 300); strawHat(ctx, 0, 0, .19, .012, { hair: false, tilt: 0 }); ctx.restore(); }
  ctx.restore();
}
function drawBubble(ctx, x, y, r, tail, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  if (tail) for (let i = 0; i < 3; i++) { const k = (i + 1) / 4; circle(ctx, lerp(tail[0], x, k * .7), lerp(tail[1], y, k * .7), r * (.05 + i * .04)); fillStroke(ctx, '#fff', 5); }
  cloudShape(ctx, x, y, r * .78, 9); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke();
  cloudShape(ctx, x, y, r * .78, 9); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.restore();
}
function drawRowboat(ctx, x, y, s, t, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot + Math.sin(t * 2.2) * .04); ctx.scale(s, s);
  rrect(ctx, -6, -230, 12, 230, 4); fillStroke(ctx, '#8a5530', 5);
  ctx.beginPath(); ctx.moveTo(4, -220); ctx.quadraticCurveTo(90, -150, 80, -40); ctx.lineTo(4, -40); ctx.closePath(); fillStroke(ctx, '#f4ead4', 5);
  ctx.beginPath(); ctx.moveTo(-150, -40); ctx.lineTo(150, -40); ctx.quadraticCurveTo(130, 20, 70, 26); ctx.lineTo(-80, 26); ctx.quadraticCurveTo(-140, 20, -150, -40); ctx.closePath(); fillStroke(ctx, '#a0602e', 6);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(-160, 0, 320, 40); ctx.fillStyle = '#d6a052'; ctx.fillRect(-160, -22, 320, 8); ctx.restore();
  ctx.restore();
}
function drawIsland(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-300, 0); ctx.quadraticCurveTo(-200, -170, 0, -180); ctx.quadraticCurveTo(220, -170, 300, 0); ctx.closePath(); fillStroke(ctx, '#58b65e', 6);
  ctx.fillStyle = '#f3d79b'; ctx.fillRect(-300, -12, 600, 16);
  for (const [hx, hc] of [[-140, '#e86a4a'], [-60, '#4a88d8'], [60, '#e8b84a']]) { rrect(ctx, hx - 28, -120, 56, 50, 4); fillStroke(ctx, '#fbf3e2', 4); path(ctx, [[hx - 36, -118], [hx, -150], [hx + 36, -118]]); fillStroke(ctx, hc, 4); }
  // windmill
  rrect(ctx, 150, -190, 40, 110, 6); fillStroke(ctx, '#f2ece0', 4);
  ctx.save(); ctx.translate(170, -190); ctx.rotate(t * 1.5);
  for (let i = 0; i < 4; i++) { ctx.rotate(TAU / 4); rrect(ctx, -9, 0, 18, 80, 4); fillStroke(ctx, '#c88b52', 4); }
  ctx.restore(); circle(ctx, 170, -190, 9); fillStroke(ctx, '#7a4a2a', 3);
  ctx.restore();
}
function drawWhirlpool(ctx, x, y, r, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(1, .42);
  const g = ctx.createRadialGradient(0, 0, 10, 0, 0, r); g.addColorStop(0, '#05223a'); g.addColorStop(.5, '#0d5f8a'); g.addColorStop(1, 'rgba(24,163,192,0)');
  ctx.fillStyle = g; circle(ctx, 0, 0, r); ctx.fill();
  ctx.lineCap = 'round';
  for (let k = 0; k < 5; k++) {
    ctx.beginPath();
    for (let a2 = 0; a2 < 9; a2 += .08) { const rr = r * (1 - a2 / 9) * .95; const ang = a2 * 1.6 + t * 3.2 + k * TAU / 5; const px = Math.cos(ang) * rr, py = Math.sin(ang) * rr; a2 ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(220,250,255,.65)'; ctx.stroke();
  }
  ctx.restore();
}
function bigX(ctx, x, y, s, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s);
  for (const r of [.78, -.78]) { ctx.save(); ctx.rotate(r); rrect(ctx, -120, -22, 240, 44, 18); fillStroke(ctx, '#e0392f', 9); ctx.restore(); }
  ctx.restore();
}
function iconShip(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); path(ctx, [[-100, 10], [100, 10], [70, 70], [-70, 70]]); fillStroke(ctx, '#9a5428', 7); rrect(ctx, -6, -110, 12, 120, 4); fillStroke(ctx, '#7a4a2a', 6); path(ctx, [[10, -100], [80, -10], [10, -10]]); fillStroke(ctx, '#f4ead4', 6); path(ctx, [[-10, -80], [-70, -10], [-10, -10]]); fillStroke(ctx, '#f4ead4', 6); ctx.restore(); }
function iconMoney(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-30, -70); ctx.quadraticCurveTo(-95, 0, -80, 50); ctx.quadraticCurveTo(-60, 85, 0, 85); ctx.quadraticCurveTo(60, 85, 80, 50); ctx.quadraticCurveTo(95, 0, 30, -70); ctx.closePath(); fillStroke(ctx, '#d9b25a', 7);
  rrect(ctx, -38, -88, 76, 24, 10); fillStroke(ctx, '#a07a32', 6);
  text(ctx, '$', 0, 18, 100, '#7a5a1a', null, 0, 'Poppins', 700); ctx.restore();
}
function iconPerson(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); circle(ctx, 0, -55, 40); fillStroke(ctx, HEAD, 7); rrect(ctx, -55, 0, 110, 85, 40); fillStroke(ctx, '#3fa35b', 7); ctx.restore(); }
function drawMop(ctx, len = .5) {
  // in figure units, hand at origin, pointing down-forward (rotate before)
  rrect(ctx, -.01, 0, .02, len, .01); fillStroke(ctx, '#b47a43', .01);
  ctx.beginPath(); for (let i = -4; i <= 4; i++) { ctx.moveTo(i * .012, len); ctx.quadraticCurveTo(i * .02, len + .06, i * .03, len + .1); }
  ctx.lineWidth = .018; ctx.strokeStyle = '#e9e4d6'; ctx.stroke();
}
function drawBucket(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); path(ctx, [[-55, -100], [55, -100], [42, 0], [-42, 0]]); fillStroke(ctx, '#8aa0b4', 6); ellipse(ctx, 0, -100, 55, 14); fillStroke(ctx, '#bfe6f8', 5); ctx.beginPath(); ctx.arc(0, -100, 55, Math.PI, 0); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
function drawClub(ctx, len = .75, w = .1) {
  // iron club in figure units: handle at origin, head pointing to -y
  rrect(ctx, -.018, -.18, .036, .22, .015); fillStroke(ctx, '#5a3a22', .012);
  const shape = () => { ctx.beginPath(); ctx.moveTo(-w * .45, -.17); ctx.lineTo(-w * .8, -len); ctx.quadraticCurveTo(0, -len - w * .9, w * .8, -len); ctx.lineTo(w * .45, -.17); ctx.closePath(); };
  // spikes
  for (let i = 0; i < 5; i++) { const yy = -.3 - i * (len - .32) / 4; const ww = lerp(w * .5, w * .8, (i + 1) / 5); for (const side of [-1, 1]) { path(ctx, [[side * ww, yy - .03], [side * (ww + .05), yy], [side * ww, yy + .03]]); fillStroke(ctx, '#9aa1ad', .008); } }
  shape(); fillStroke(ctx, '#4a4f5a', .014);
  ctx.save(); shape(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(-w * .6, -len - w, w * .3, len); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(w * .15, -len - w, w, len);
  ctx.fillStyle = '#6b717e'; for (let i = 0; i < 4; i++) { rrect(ctx, -w, -.28 - i * (len - .3) / 3.4, w * 2, .022, .01); ctx.fill(); }
  ctx.restore();
}
function drawDoor(ctx, x, y, w, h, open = 0, tint = 0) {
  rrect(ctx, x - w / 2 - 18, y - h - 18, w + 36, h + 18, 10); fillStroke(ctx, mix('#4e2c1a', '#060406', tint), 5);
  rrect(ctx, x - w / 2, y - h, w, h, 6); fillStroke(ctx, '#0b0709', 5);
  if (open < 1) {
    ctx.save(); ctx.translate(x - w / 2, 0); ctx.scale(1 - open, 1); ctx.translate(-(x - w / 2), 0);
    rrect(ctx, x - w / 2, y - h, w, h, 6); fillStroke(ctx, mix('#9a5a2a', '#08060a', tint), 5);
    for (let i = 1; i < 4; i++) line(ctx, x - w / 2 + i * w / 4, y - h + 8, x - w / 2 + i * w / 4, y - 8, 4, mix('#6a3a1a', '#000', tint));
    circle(ctx, x + w * .36, y - h * .48, 12); fillStroke(ctx, '#e8c04a', 4);
    ctx.restore();
  }
}
function plank(ctx, x, y, w, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rrect(ctx, -w / 2, -w * .12, w, w * .24, 6); fillStroke(ctx, '#b06e36', 5); line(ctx, -w * .4, 0, w * .4, 0, 3, '#7a4521'); ctx.restore(); }
function drawMarineBase(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -260, -200, 520, 200, 8); fillStroke(ctx, '#f2f0ea', 6);
  rrect(ctx, -90, -460, 180, 280, 8); fillStroke(ctx, '#f7f6f2', 6);
  ctx.save(); rrect(ctx, -90, -460, 180, 280, 8); ctx.clip(); ctx.fillStyle = 'rgba(40,60,110,.15)'; ctx.fillRect(20, -470, 100, 300); ctx.restore();
  rrect(ctx, -110, -480, 220, 40, 8); fillStroke(ctx, '#2a4f9e', 6);
  text(ctx, 'MARINE', 0, -380, 50, '#2a4f9e', null, 0, 'Poppins', 700);
  for (let i = 0; i < 5; i++) { rrect(ctx, -230 + i * 100, -150, 50, 60, 6); fillStroke(ctx, '#2a4f9e', 5); }
  line(ctx, 0, -480, 0, -600, 7); path(ctx, [[3, -600], [90, -575], [3, -550]]); fillStroke(ctx, '#3a7be0', 5);
  ctx.restore();
}
function drawSword(ctx, x, y, len, rot, col = '#2a2530') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rrect(ctx, -6, -len, 12, len, 5); fillStroke(ctx, col, 4); rrect(ctx, -16, -12, 32, 10, 4); fillStroke(ctx, '#e2b84a', 3); rrect(ctx, -5, 0, 10, len * .3, 4); fillStroke(ctx, '#f6f1e8', 3); ctx.restore(); }
function choiceCard(ctx, x, y, w, h, num, label, col, a = 1, sc = 1, hi = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  rrect(ctx, -w / 2, -h / 2, w, h, 28); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.shadowColor = 'transparent';
  rrect(ctx, -w / 2, -h / 2, w, h, 28); fillStroke(ctx, null, 8);
  if (hi > 0) { rrect(ctx, -w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 34); ctx.lineWidth = 10 * hi; ctx.strokeStyle = '#ffd23a'; ctx.stroke(); }
  circle(ctx, -w / 2 + h / 2, 0, h * .34); fillStroke(ctx, col, 7);
  text(ctx, String(num), -w / 2 + h / 2, 4, h * .42, '#fff', INK, 8, 'Poppins', 700);
  text(ctx, String(num), -w / 2 + h / 2, 4, h * .42, '#fff', INK, 0, 'Poppins', 700);
  text(ctx, label, -w / 2 + h * 1.0, 3, h * .27, INK, null, 0, 'Poppins', 700, 'left');
  ctx.restore();
}
function badge(ctx, x, y, r, num, col) { circle(ctx, x, y, r); fillStroke(ctx, col, r * .12); text(ctx, String(num), x, y + r * .06, r * 1.2, '#fff', INK, r * .18, 'Poppins', 700); text(ctx, String(num), x, y + r * .06, r * 1.2, '#fff', INK, 0, 'Poppins', 700); }
function speedLines(ctx, cx, cy, a, t, col = 'rgba(255,255,255,.7)') {
  if (a <= 0) return; const R = rng(77); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  for (let i = 0; i < 46; i++) { const ang = R() * TAU + t * .2; const r0 = 420 + R() * 300; ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0); ctx.lineTo(cx + Math.cos(ang + .02) * 1500, cy + Math.sin(ang + .02) * 1500); ctx.lineTo(cx + Math.cos(ang - .02) * 1500, cy + Math.sin(ang - .02) * 1500); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
  ctx.restore();
}
function flashScreen(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function sepia(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'color'; ctx.globalAlpha = a; ctx.fillStyle = '#c9a26a'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function titleText(ctx, str, x, y, size, a = 1, sc = 1, fill = '#ffd23a') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  text(ctx, str, 0, 0, size, fill, INK, size * .2, 'Poppins', 700); ctx.shadowColor = 'transparent'; text(ctx, str, 0, 0, size, fill, INK, 0, 'Poppins', 700);
  ctx.restore();
}
