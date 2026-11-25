// ---------- props + people for the MrBeast reel ----------
// hair / beard / masks as head decorations (drawStick calls hat(ctx,hx,hy,hr,lw,o))
function hairFn(col = '#5a3720', beard = false, long = false) {
  return (ctx, hx, hy, hr, lw) => {
    if (long) { // side drapes behind the face edge
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + sd * hr * .7, hy - hr * .6); ctx.quadraticCurveTo(hx + sd * hr * 1.35, hy + hr * .3, hx + sd * hr * 1.05, hy + hr * 1.15); ctx.lineTo(hx + sd * hr * .82, hy + hr * .5); ctx.closePath(); fillStroke(ctx, col, lw); }
    }
    ctx.beginPath(); ctx.arc(hx, hy, hr + .012, Math.PI + .28, -.28);
    ctx.quadraticCurveTo(hx + hr * .55, hy - hr * .32, hx + hr * .2, hy - hr * .55);
    ctx.quadraticCurveTo(hx - hr * .1, hy - hr * .38, hx - hr * .35, hy - hr * .52);
    ctx.quadraticCurveTo(hx - hr * .7, hy - hr * .35, hx - hr * .93, hy - hr * .3); ctx.closePath();
    fillStroke(ctx, col, lw);
    ctx.save(); ctx.globalAlpha = .25; ellipse(ctx, hx - hr * .3, hy - hr * .82, hr * .3, hr * .07, -.25); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    if (beard) {
      ctx.beginPath(); ctx.arc(hx, hy, hr + .008, -.05, Math.PI + .05);
      ctx.quadraticCurveTo(hx - hr * .7, hy + hr * .25, hx - hr * .45, hy + hr * .35);
      ctx.quadraticCurveTo(hx, hy + hr * 1.12, hx + hr * .45, hy + hr * .35);
      ctx.quadraticCurveTo(hx + hr * .7, hy + hr * .25, hx + hr * 1.0, hy - .005); ctx.closePath();
      fillStroke(ctx, beard === true ? col : beard, lw);
    }
  };
}
function maskFn(shape) {
  return (ctx, hx, hy, hr, lw) => {
    circle(ctx, hx, hy + hr * .05, hr * .86); ctx.fillStyle = '#141216'; ctx.fill();
    ctx.lineWidth = .02; ctx.strokeStyle = '#fff';
    if (shape === 'o') { circle(ctx, hx, hy + .01, hr * .38); ctx.stroke(); }
    else if (shape === 't') { path(ctx, [[hx, hy - hr * .38], [hx + hr * .4, hy + hr * .32], [hx - hr * .4, hy + hr * .32]]); ctx.stroke(); }
    else { ctx.strokeRect(hx - hr * .33, hy - hr * .3, hr * .66, hr * .66); }
    // hood
    ctx.beginPath(); ctx.arc(hx, hy, hr + .02, Math.PI * .85, Math.PI * 2.15); ctx.lineWidth = .05; ctx.strokeStyle = '#e8407a'; ctx.stroke();
  };
}
function beanieFn(col = '#3a6b4a') {
  return (ctx, hx, hy, hr, lw) => {
    ctx.beginPath(); ctx.arc(hx, hy, hr + .015, Math.PI + .2, -.2); ctx.lineTo(hx + hr * .98, hy - hr * .32); ctx.lineTo(hx - hr * .98, hy - hr * .32); ctx.closePath(); fillStroke(ctx, col, lw);
    rrect(ctx, hx - hr * 1.02, hy - hr * .45, hr * 2.04, hr * .22, .02); fillStroke(ctx, mix(col, '#000000', .25), lw);
  };
}
function crownFn() {
  return (ctx, hx, hy, hr, lw) => {
    hairFn('#5a3720', true)(ctx, hx, hy, hr, lw);
    const b = hy - hr * .78, w = hr * .8;
    path(ctx, [[hx - w, b], [hx - w, b - .13], [hx - w * .5, b - .06], [hx, b - .17], [hx + w * .5, b - .06], [hx + w, b - .13], [hx + w, b]]); fillStroke(ctx, '#ffcf2e', lw);
    for (const [x, c] of [[-.5, '#e8343c'], [0, '#2f7be0'], [.5, '#3fbf6a']]) { circle(ctx, hx + x * w, b - .035, .018); fillStroke(ctx, c, lw * .6); }
  };
}
const JIMMY_KID = { cols: ['#2f86e0', '#2f86e0'], hat: hairFn('#6a4126'), belt: false };
const JIMMY = { cols: ['#2f86e0', '#2f86e0'], hat: hairFn('#5a3720', true), belt: false };
const MOM = { cols: ['#9b4fc4', '#9b4fc4'], hat: hairFn('#c77a2e', false, true), belt: false };
const GUARD = sh => ({ cols: ['#e8407a', '#e8407a'], hat: maskFn(sh), face: { hide: true }, belt: false });
const PLAYER = { cols: ['#2f9a7a', '#2f9a7a'], hat: hairFn('#2a2a2a'), belt: false };
const HOMELESS = { cols: ['#8a7356', '#8a7356'], hat: beanieFn('#3a6b4a'), belt: false };
const FAN = { cols: ['#f2b52a', '#f2b52a'], hat: hairFn('#222'), belt: false };
const P = (base, extra) => { const o = Object.assign({}, base, extra); if (base.face && extra.face) o.face = Object.assign({}, extra.face, base.face); return o; };

// ---------- places ----------
function bedroom(ctx, cam, t, o = {}) {
  applyCam(ctx, cam, .6);
  ctx.fillStyle = o.wall || '#f2c46a'; ctx.fillRect(-800, -800, 2700, 2400);
  ctx.fillStyle = 'rgba(0,0,0,.05)'; for (let x = -800; x < 1900; x += 90) ctx.fillRect(x, -800, 40, 2400);
  // window
  rrect(ctx, 640, 260, 330, 300, 14); fillStroke(ctx, o.night ? '#24305e' : '#9fdcff', 10);
  if (o.night) { circle(ctx, 880, 330, 34); ctx.fillStyle = '#fff6c4'; ctx.fill(); }
  else drawCloud(ctx, 760 + Math.sin(t * .2) * 20, 360, 50, 3);
  line(ctx, 805, 260, 805, 560, 10); line(ctx, 640, 410, 970, 410, 10);
  // poster
  ctx.save(); ctx.translate(250, 330); ctx.rotate(-.05); rrect(ctx, -110, -130, 220, 260, 8); fillStroke(ctx, '#e8343c', 8);
  path(ctx, [[-35, -55], [55, 0], [-35, 55]]); fillStroke(ctx, '#fff', 7); ctx.restore();
  applyCam(ctx, cam, .85);
  ctx.fillStyle = o.floor || '#b9764a'; ctx.fillRect(-800, 1050, 2700, 1500);
  ctx.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 1050; y < 2500; y += 70) ctx.fillRect(-800, y, 2700, 5);
  line(ctx, -800, 1050, 1900, 1050, 10);
}
function desk(ctx, x, y, w = 560) {
  rrect(ctx, x - w / 2, y - 30, w, 38, 8); fillStroke(ctx, '#8a5532', 8);
  for (const sx of [-1, 1]) { rrect(ctx, x + sx * (w / 2 - 50) - 15, y + 8, 30, 260, 6); fillStroke(ctx, '#6e4226', 7); }
}
function monitor(ctx, x, y, w, h, screen) {
  rrect(ctx, x - 20, y + h / 2 - 4, 40, 70, 6); fillStroke(ctx, '#3b3540', 6);
  rrect(ctx, x - 90, y + h / 2 + 60, 180, 22, 8); fillStroke(ctx, '#3b3540', 6);
  rrect(ctx, x - w / 2 - 18, y - h / 2 - 18, w + 36, h + 36, 18); fillStroke(ctx, '#2c2830', 8);
  ctx.save(); rrect(ctx, x - w / 2, y - h / 2, w, h, 6); ctx.clip(); ctx.translate(x - w / 2, y - h / 2); screen(ctx, w, h); ctx.restore();
  rrect(ctx, x - w / 2, y - h / 2, w, h, 6); fillStroke(ctx, null, 5);
}
function blockGame(ctx, w, h, t) { // blocky sandbox gameplay (generic)
  ctx.fillStyle = '#86c8ff'; ctx.fillRect(0, 0, w, h);
  const b = w / 10;
  for (let i = -1; i < 12; i++) {
    const col = i + Math.floor(t * 1.5) % 3; const hh = 3 + ((col * 7) % 3 === 0 ? 1 : 0);
    for (let j = 0; j < hh; j++) { ctx.fillStyle = j === hh - 1 ? '#58b348' : (j === hh - 2 ? '#8a5a32' : '#7d7d7d'); ctx.fillRect(i * b - (t * 1.5 * b) % b, h - (j + 1) * b, b + 1, b + 1); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 2; ctx.strokeRect(i * b - (t * 1.5 * b) % b, h - (j + 1) * b, b, b); }
  }
  ctx.fillStyle = '#2e7a2e'; ctx.fillRect(w * .7, h - b * 7, b * 1.6, b * 1.6); ctx.fillStyle = '#6b4424'; ctx.fillRect(w * .7 + b * .55, h - b * 5.4, b * .5, b * 1.4);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(w * .48, h * .5, 4, 22); ctx.fillRect(w * .48 - 9, h * .5 + 9, 22, 4);
}
function cheapMic(ctx, x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 0, -120, 10, '#3b3540'); rrect(ctx, -50, -6, 100, 18, 8); fillStroke(ctx, '#3b3540', 6);
  ctx.translate(0, -150); ctx.rotate(.2); rrect(ctx, -28, -45, 56, 90, 28); fillStroke(ctx, '#9aa1ab', 7);
  for (let i = -2; i <= 2; i++) line(ctx, -20, i * 14, 20, i * 14, 3, '#5b616a');
  rrect(ctx, -10, 40, 20, 20, 4); fillStroke(ctx, '#3b3540', 5);
  ctx.restore();
  // tape on it
  ctx.save(); ctx.translate(x + 10 * s, y - 150 * s); ctx.rotate(-.6); rrect(ctx, -40 * s, -9 * s, 80 * s, 18 * s, 3); fillStroke(ctx, '#e9e0c4', 4); ctx.restore();
}
function houseFront(ctx, cam, t, o = {}) {
  applyCam(ctx, cam, .1); drawSky(ctx, o.rain ? '#6d7f99' : '#43a9ee', o.rain ? '#b7c3d3' : '#cdeffc');
  applyCam(ctx, cam, .2); drawCloud(ctx, 200 + t * 8, 260, 110, 1, o.rain ? .7 : 1); drawCloud(ctx, 850 + t * 5, 180, 80, 2, o.rain ? .7 : 1);
  applyCam(ctx, cam, .6);
  ctx.fillStyle = '#6cc35a'; ctx.fillRect(-800, 1180, 2700, 1400); line(ctx, -800, 1180, 1900, 1180, 8);
  // house
  rrect(ctx, 80, 560, 920, 640, 6); fillStroke(ctx, '#f4e2c4', 9);
  ctx.save(); rrect(ctx, 80, 560, 920, 640, 6); ctx.clip(); ctx.fillStyle = 'rgba(80,40,20,.08)'; for (let y = 580; y < 1200; y += 46) ctx.fillRect(80, y, 920, 6); ctx.restore();
  path(ctx, [[30, 580], [540, 250], [1050, 580]]); fillStroke(ctx, '#c4453a', 9);
  for (const wx of [230, 850]) { rrect(ctx, wx - 85, 700, 170, 170, 8); fillStroke(ctx, '#9fdcff', 8); line(ctx, wx, 700, wx, 870, 7); line(ctx, wx - 85, 785, wx + 85, 785, 7); }
  // path to door
  path(ctx, [[460, 1200], [620, 1200], [760, 1700], [320, 1700]]); fillStroke(ctx, '#d9cbb0', 7);
}
function doorway(ctx, x, y, open, col = '#7a4a2a') { // y = threshold
  rrect(ctx, x - 125, y - 400, 250, 400, 6); fillStroke(ctx, '#2a1d1a', 8);
  ctx.save(); ctx.translate(x - 125, y - 400);
  const w = 250 * (1 - open * .85);
  rrect(ctx, 0, 0, w, 400, 4); fillStroke(ctx, col, 8);
  if (open < .9) { circle(ctx, w - 28, 210, 12); fillStroke(ctx, '#e8c04a', 5); }
  ctx.restore();
}
function suitcase(ctx, x, y, s = 1, rot = 0, col = '#d9473a') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -40, -120, 80, 40, 14); fillStroke(ctx, null, 9);
  rrect(ctx, -110, -95, 220, 150, 18); fillStroke(ctx, col, 8);
  line(ctx, -60, -95, -60, 55, 6, 'rgba(0,0,0,.35)'); line(ctx, 60, -95, 60, 55, 6, 'rgba(0,0,0,.35)');
  ctx.restore();
}
function rainCloud(ctx, x, y, s, t) {
  drawCloud(ctx, x, y, s, 9); ctx.save(); ctx.globalAlpha = .9;
  for (let i = 0; i < 14; i++) { const rx = x - s * 1.1 + (i * 37 % (s * 2.2)), ry = y + s * .4 + ((t * 900 + i * 97) % (s * 3)); line(ctx, rx, ry, rx - 6, ry + 34, 6, '#5fa8e8'); }
  ctx.restore();
}
function studioBG(ctx, cam, t, o = {}) {
  applyCam(ctx, cam, .2);
  const g = ctx.createLinearGradient(0, -300, 0, 1500); g.addColorStop(0, o.top || '#1b1240'); g.addColorStop(1, o.bot || '#4a2a8a'); ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4080, 4500);
  // LED wall tiles
  for (let i = -6; i < 14; i++) for (let j = 0; j < 6; j++) { const k = (Math.sin(i * 1.7 + j * 2.3 + t * 3) + 1) / 2; ctx.fillStyle = `rgba(${120 + k * 120},${60 + k * 40},255,${.12 + k * .12})`; ctx.fillRect(i * 120 + 6, 120 + j * 120, 108, 108); }
  applyCam(ctx, cam, .5);
  // spotlights
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) { const a = Math.sin(t * .9 + i * 1.6) * .35; const x0 = 100 + i * 290; ctx.save(); ctx.translate(x0, -100); ctx.rotate(a); const gg = ctx.createLinearGradient(0, 0, 0, 1600); gg.addColorStop(0, 'rgba(255,240,200,.35)'); gg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = gg; path(ctx, [[-30, 0], [30, 0], [260, 1600], [-260, 1600]]); ctx.fill(); ctx.restore(); }
  ctx.restore();
  applyCam(ctx, cam, .8);
  ctx.fillStyle = o.floor || '#241a3a'; ctx.fillRect(-1500, 1180, 4080, 2000);
  const fg = ctx.createRadialGradient(540, 1250, 40, 540, 1250, 700); fg.addColorStop(0, 'rgba(255,220,150,.35)'); fg.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = fg; ctx.fillRect(-300, 1100, 1700, 600);
  line(ctx, -1500, 1180, 2600, 1180, 8);
}
function arenaBG(ctx, cam, t) { // pastel stairs set + game shapes
  applyCam(ctx, cam, .25);
  ctx.fillStyle = '#f7d9e3'; ctx.fillRect(-1500, -1500, 4080, 4500);
  const cols = ['#f48fb1', '#9ad7f2', '#fce38a', '#b4e3a1', '#c9a7eb'];
  for (let k = 0; k < 9; k++) { const x0 = -400 + k * 230, h0 = 300 + (k % 3) * 120; for (let j = 0; j < 7; j++) { rrect(ctx, x0, h0 + j * 60, 200, 60, 2); fillStroke(ctx, cols[(k + j) % 5], 5); } }
  applyCam(ctx, cam, .5);
  ctx.fillStyle = '#e9d1a8'; ctx.fillRect(-1500, 1080, 4080, 2000); line(ctx, -1500, 1080, 2600, 1080, 8);
}
// ---------- objects ----------
function bill(ctx, x, y, s = 1, rot = 0, flip = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s * flip);
  rrect(ctx, -70, -32, 140, 64, 6); fillStroke(ctx, '#7ccf6a', 5); rrect(ctx, -58, -22, 116, 44, 4); fillStroke(ctx, null, 3, '#3d8a3a');
  circle(ctx, 0, 0, 17); fillStroke(ctx, '#a9e29a', 3, '#3d8a3a'); text(ctx, '$', 0, 2, 26, '#2f6e2c', INK, 0, 'Poppins', 700);
  ctx.restore();
}
function moneyRain(ctx, t, n = 26, seed = 4, y0 = -200, spread = 1300, sc = 1) {
  const R = rng(seed);
  for (let i = 0; i < n; i++) { const x = R() * 1180 - 50, sp = 300 + R() * 300, ph = R() * 5; const y = y0 + ((t * sp + ph * 400) % spread); bill(ctx, x + Math.sin(t * 3 + ph) * 40, y, (.7 + R() * .5) * sc, Math.sin(t * 4 + ph) * .8, Math.cos(t * 6 + ph)); }
}
function coin(ctx, x, y, r, t = 0) {
  const sq = Math.abs(Math.cos(t * 6)) * .7 + .3; ellipse(ctx, x, y, r * sq, r); fillStroke(ctx, '#ffcf2e', r * .14); ellipse(ctx, x, y, r * .62 * sq, r * .62); fillStroke(ctx, null, r * .08, '#c99412');
}
function camRig(ctx, x, y, s = 1, rec = true, t = 0, flip = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
  for (const a of [-.35, 0, .35]) line(ctx, 0, -230, Math.sin(a) * 260, 0, 9);
  rrect(ctx, -90, -320, 180, 110, 16); fillStroke(ctx, '#2c2830', 8);
  rrect(ctx, 85, -300, 70, 70, 10); fillStroke(ctx, '#3b3540', 7); circle(ctx, 155, -265, 30); fillStroke(ctx, '#5b6ec9', 7);
  if (rec && Math.floor(t * 2.5) % 2 === 0) { circle(ctx, -55, -290, 13); ctx.fillStyle = '#ff3b3b'; ctx.fill(); }
  ctx.restore();
}
function counterPanel(ctx, x, y, w, h, str, col = '#ff3b3b', size) {
  rrect(ctx, x - w / 2, y - h / 2, w, h, 22); fillStroke(ctx, '#151218', 9);
  text(ctx, str, x, y + 4, size || h * .55, col, INK, 0, 'Poppins', 700);
}
const fmt = n => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
function playButton(ctx, x, y, s = 1, col = '#e8343c') {
  rrect(ctx, x - 90 * s, y - 62 * s, 180 * s, 124 * s, 34 * s); fillStroke(ctx, col, 7 * s);
  path(ctx, [[x - 26 * s, y - 34 * s], [x + 38 * s, y], [x - 26 * s, y + 34 * s]]); fillStroke(ctx, '#fff', 5 * s);
}
function plaque(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -200, -260, 400, 520, 18); fillStroke(ctx, '#ffd84a', 10);
  ctx.save(); rrect(ctx, -200, -260, 400, 520, 18); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.translate(Math.sin(t * 1.5) * 200, 0); path(ctx, [[-120, -300], [-40, -300], [-200, 300], [-280, 300]]); ctx.fill(); ctx.restore();
  rrect(ctx, -160, -220, 320, 440, 10); fillStroke(ctx, null, 5, '#b8901a');
  playButton(ctx, 0, -40, 1.25, '#f2f2f2'); path(ctx, [[-32, -82], [48, -40], [-32, 2]]); fillStroke(ctx, '#e0b22a', 5);
  ctx.restore();
}
function giantCheck(ctx, x, y, s, rot, amount) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -380, -170, 760, 340, 14); fillStroke(ctx, '#f6f1e0', 9);
  ctx.fillStyle = '#7ccf6a'; ctx.fillRect(-372, -162, 744, 48);
  text(ctx, 'PATROCÍNIO', -170, -138, 34, '#1d4a1a', INK, 0, 'Poppins', 700);
  text(ctx, amount, 40, 10, 120, '#1d6e2c', INK, 0, 'Poppins', 700);
  line(ctx, -330, 120, 330, 120, 5, '#8a8a8a'); text(ctx, 'dez mil dólares', -140, 92, 30, '#555', INK, 0, 'Lora', 600);
  ctx.restore();
}
function car(ctx, x, y, s = 1, col = '#e8343c', crush = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 - crush * .55));
  rrect(ctx, -230, -150, 460, 110, 30); fillStroke(ctx, col, 9);
  path(ctx, [[-130, -150], [-80, -240], [100, -240], [160, -150]]); fillStroke(ctx, col, 9);
  path(ctx, [[-105, -155], [-70, -222], [10, -222], [10, -155]]); fillStroke(ctx, '#9fdcff', 6);
  path(ctx, [[30, -155], [30, -222], [90, -222], [130, -155]]); fillStroke(ctx, '#9fdcff', 6);
  ctx.restore();
  for (const wx of [-140, 140]) { circle(ctx, x + wx * s, y - 35 * s, 48 * s); fillStroke(ctx, '#2c2830', 8); circle(ctx, x + wx * s, y - 35 * s, 18 * s); fillStroke(ctx, '#bfc4cc', 5); }
}
function island(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 420, 90); fillStroke(ctx, '#f3d98a', 9);
  ctx.save(); ellipse(ctx, 0, 0, 420, 90); ctx.clip(); ctx.fillStyle = '#6cc35a'; ellipse(ctx, -40, -60, 300, 90); ctx.fill(); ctx.restore();
  // palm
  ctx.beginPath(); ctx.moveTo(60, -20); ctx.quadraticCurveTo(110, -250, 40, -420); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = '#a3683a'; ctx.stroke();
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .55 + Math.sin(t * 2 + i) * .05; ctx.save(); ctx.translate(40, -420); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(110, -60, 220, 30); ctx.quadraticCurveTo(110, -10, 0, 0); fillStroke(ctx, '#3fa35b', 7); ctx.restore(); }
  for (const cx of [20, 62]) { circle(ctx, cx, -400, 20); fillStroke(ctx, '#7a4a2a', 6); }
  ctx.restore();
}
function giftBow(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sd * 140, -120, sd * 150, 0); ctx.quadraticCurveTo(sd * 140, 90, 0, 0); fillStroke(ctx, '#e8343c', 8); path(ctx, [[0, 0], [sd * 70, 150], [sd * 30, 150]]); fillStroke(ctx, '#e8343c', 7); }
  circle(ctx, 0, 0, 34); fillStroke(ctx, '#ff5a5a', 8); ctx.restore();
}
function chocoBar(ctx, x, y, s, rot, bite = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // chocolate peeking out
  rrect(ctx, -150, -330, 300, 120, 10); fillStroke(ctx, '#6b3a20', 8);
  for (let i = 0; i < 3; i++) { rrect(ctx, -130 + i * 90, -315, 80, 90, 6); fillStroke(ctx, '#7c4628', 4); }
  if (bite > 0) { ctx.save(); ctx.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 3; i++) { circle(ctx, 80 + i * 30, -330 + i * 10, 46 * bite); ctx.fill(); } ctx.restore(); }
  rrect(ctx, -170, -230, 340, 500, 18); fillStroke(ctx, '#3a7be8', 9);
  ctx.fillStyle = '#ffd23a'; ctx.fillRect(-162, -40, 324, 110);
  text(ctx, 'FEASTABLES', 0, 15, 50, '#1b1820', INK, 0, 'Poppins', 700);
  text(ctx, 'chocolate', 0, 140, 44, '#fff', INK, 0, 'Lora', 600);
  ctx.restore();
}
function briefcase(ctx, x, y, s, open, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (open > 0) {
    rrect(ctx, -260, -170 - 300 * open, 520, 300 * open, 20); fillStroke(ctx, '#2c2830', 9);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) bill(ctx, -180 + c * 120, -170 - 260 * open + 50 + r * 70, .8, (c + r) % 2 ? .04 : -.04);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5 * open; const g = ctx.createRadialGradient(0, -100, 10, 0, -100, 420); g.addColorStop(0, 'rgba(255,240,140,.9)'); g.addColorStop(1, 'rgba(255,240,140,0)'); ctx.fillStyle = g; ctx.fillRect(-500, -600, 1000, 800); ctx.restore();
  }
  rrect(ctx, -270, -170, 540, 320, 24); fillStroke(ctx, '#3b3540', 9);
  rrect(ctx, -80, -210, 160, 50, 20); fillStroke(ctx, null, 10);
  for (const sx of [-150, 150]) { rrect(ctx, sx - 24, -184, 48, 34, 6); fillStroke(ctx, '#e8c04a', 5); }
  ctx.restore();
}
function commentIcon(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -170, -120, 340, 210, 50); fillStroke(ctx, '#fff', 10);
  path(ctx, [[-70, 80], [-110, 170], [10, 86]]); fillStroke(ctx, '#fff', 10);
  ctx.fillStyle = '#fff'; ctx.fillRect(-80, 70, 90, 22);
  for (let i = -1; i <= 1; i++) { circle(ctx, i * 75, -15, 20); ctx.fillStyle = INK; ctx.fill(); }
  ctx.restore();
}
function trophyPile(ctx, x, y, s, t) { // money mountain
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-460, 0); ctx.quadraticCurveTo(-200, -330, 0, -360); ctx.quadraticCurveTo(200, -330, 460, 0); ctx.closePath(); fillStroke(ctx, '#5fb455', 9);
  const R = rng(21); ctx.save(); ctx.beginPath(); ctx.moveTo(-460, 0); ctx.quadraticCurveTo(-200, -330, 0, -360); ctx.quadraticCurveTo(200, -330, 460, 0); ctx.closePath(); ctx.clip();
  for (let i = 0; i < 70; i++) bill(ctx, R() * 900 - 450, -R() * 360, .8, R() * 3);
  for (let i = 0; i < 25; i++) coin(ctx, R() * 900 - 450, -R() * 340, 22, t + i);
  ctx.restore(); ctx.restore();
}
function chalkboard(ctx, x, y, w, h) {
  rrect(ctx, x - w / 2 - 24, y - h / 2 - 24, w + 48, h + 48, 16); fillStroke(ctx, '#9a5a2a', 9);
  rrect(ctx, x - w / 2, y - h / 2, w, h, 8); fillStroke(ctx, '#2f4a3a', 6);
}
function arrowDown(ctx, x, y, s, col = '#ffd23a') {
  path(ctx, [[x - 40 * s, y - 120 * s], [x + 40 * s, y - 120 * s], [x + 40 * s, y - 20 * s], [x + 90 * s, y - 20 * s], [x, y + 80 * s], [x - 90 * s, y - 20 * s], [x - 40 * s, y - 20 * s]]); fillStroke(ctx, col, 9 * s);
}
function qmark(ctx, x, y, size, rot, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); text(ctx, '?', 0, 0, size, '#ffd23a', INK, size * .14, 'Poppins', 700); text(ctx, '?', 0, 0, size, '#ffd23a', INK, 0, 'Poppins', 700); ctx.restore();
}
function heart(ctx, x, y, s, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -40, -60, 0, -30); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); fillStroke(ctx, '#ff4d6d', 6); ctx.restore();
}
function label(ctx, str, x, y, size, fill = '#fff', rot = 0, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
  text(ctx, str, 0, 0, size, fill, INK, size * .2, 'Poppins', 700); text(ctx, str, 0, 0, size, fill, INK, 0, 'Poppins', 700); ctx.restore();
}
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function radial(ctx, x, y, t, c1 = '#ffd23a', c2 = '#ffb020', n = 16) { // comic sunburst backdrop
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = c2; ctx.fillRect(0, 0, W, H); ctx.translate(x, y); ctx.rotate(t * .3);
  for (let i = 0; i < n; i++) { ctx.rotate(TAU / n); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-180, 2400); ctx.lineTo(180, 2400); ctx.closePath(); ctx.fillStyle = c1; ctx.fill(); }
  ctx.restore();
}
