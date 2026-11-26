// ---------- magic school hall, the sorting hat, wizard kids ----------
const HOUSE = { red: '#b8262f', gold: '#e8b830', green: '#1f7a45', silver: '#c9ced6', blue: '#2b4fa8', bronze: '#c08a4a' };
const ROBE = '#2a2530';

// ---- hair, glasses, scar (drawn in head units: head radius hr at hx,hy) ----
function hairMessy(col = '#1d1a1f') {
  return (ctx, hx, hy, hr) => {
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.02, hy - hr * .1);
    const spikes = [[-1.05, -.55], [-.85, -.95], [-.55, -.8], [-.4, -1.18], [-.1, -.92], [.1, -1.2], [.35, -.9], [.6, -1.1], [.75, -.78], [1.05, -.85], [1.02, -.2]];
    spikes.forEach(([x, y], i) => ctx.lineTo(hx + x * hr, hy + y * hr));
    ctx.quadraticCurveTo(hx + hr * .7, hy - hr * .55, hx + hr * .2, hy - hr * .45);
    ctx.quadraticCurveTo(hx - hr * .3, hy - hr * .35, hx - hr * .55, hy - hr * .5);
    ctx.quadraticCurveTo(hx - hr * .85, hy - hr * .35, hx - hr * 1.02, hy - hr * .1);
    ctx.closePath(); fillStroke(ctx, col, .014);
  };
}
function glasses(ctx, hx, hy, hr) {
  const ey = hy - .005;
  for (const s of [-1, 1]) { circle(ctx, hx + s * .072, ey, .058); ctx.lineWidth = .013; ctx.strokeStyle = INK; ctx.stroke(); }
  line(ctx, hx - .016, ey - .01, hx + .016, ey - .01, .012);
  line(ctx, hx - .13, ey - .01, hx - hr * .98, ey - .03, .011); line(ctx, hx + .13, ey - .01, hx + hr * .98, ey - .03, .011);
}
function scar(ctx, hx, hy, hr, glow = 0) {
  const x = hx + .055, y = hy - hr * .62;
  const pts = [[x - .015, y - .045], [x + .018, y - .012], [x - .008, y - .004], [x + .02, y + .045]];
  if (glow > 0) { ctx.save(); ctx.globalAlpha = glow; circle(ctx, x, y, .06 + glow * .03); ctx.fillStyle = 'rgba(255,90,60,.45)'; ctx.fill(); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach(p => ctx.lineTo(...p));
  ctx.lineWidth = .013; ctx.strokeStyle = glow > .3 ? '#d8261c' : '#a8323a'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
function scarf(ctx, hx, hy, hr, c1, c2) {
  const y = hy + hr * .92;
  const sh = () => { ctx.beginPath(); ctx.roundRect(hx - hr * .75, y - .02, hr * 1.5, .055, .025); };
  sh(); ctx.fillStyle = c1; ctx.fill(); ctx.save(); sh(); ctx.clip(); ctx.fillStyle = c2; for (let i = -3; i < 4; i++) ctx.fillRect(hx + i * .05, y - .03, .02, .08); ctx.restore(); sh(); fillStroke(ctx, null, .012);
  ctx.beginPath(); ctx.roundRect(hx + hr * .25, y + .02, .05, .14, .015); fillStroke(ctx, c1, .012);
  ctx.save(); ctx.beginPath(); ctx.roundRect(hx + hr * .25, y + .02, .05, .14, .015); ctx.clip(); ctx.fillStyle = c2; for (let i = 0; i < 4; i++) ctx.fillRect(hx + hr * .2, y + .04 + i * .035, .1, .014); ctx.restore();
}
const HARRY = (extra = {}) => Object.assign({ cols: [ROBE, ROBE], belt: false, vest: '#3a3442', hat: 'none',
  headExtra: (ctx, hx, hy, hr) => { (hairMessy())(ctx, hx, hy, hr); scar(ctx, hx, hy, hr, extra.scarGlow || 0); glasses(ctx, hx, hy, hr); if (extra.scarf) scarf(ctx, hx, hy, hr, ...extra.scarf); } }, extra);
function hairRon(ctx, hx, hy, hr) {
  ctx.beginPath(); ctx.arc(hx, hy, hr * 1.06, Math.PI * 1.05, Math.PI * 1.95);
  ctx.quadraticCurveTo(hx + hr * .6, hy - hr * .5, hx + hr * .1, hy - hr * .55); ctx.quadraticCurveTo(hx - hr * .5, hy - hr * .5, hx - hr * 1.03, hy - hr * .15);
  ctx.closePath(); fillStroke(ctx, '#e06a24', .014);
  for (let i = 0; i < 5; i++) { circle(ctx, hx - .06 + i * .03, hy + .05 + (i % 2) * .015, .006); ctx.fillStyle = '#d99a6a'; ctx.fill(); }
}
function hairHerm(ctx, hx, hy, hr) {
  const R = rng(9); ctx.beginPath();
  for (let i = 0; i < 16; i++) { const a = Math.PI * .85 + i / 15 * Math.PI * 1.3; const r = hr * (1.28 + R() * .18); const x = hx + Math.cos(a) * r, y = hy + Math.sin(a) * r * 1.05 + .02; ctx.moveTo(x + hr * .35, y); ctx.arc(x, y, hr * .35, 0, TAU); }
  ctx.rect(hx - hr * 1.4, hy - hr * .2, hr * 2.8, hr * 1.3);
  ctx.fillStyle = '#7a4a26'; ctx.fill();
}
function hairHermFront(ctx, hx, hy, hr) {
  ctx.beginPath(); ctx.arc(hx, hy, hr * 1.03, Math.PI * 1.05, Math.PI * 1.95); ctx.quadraticCurveTo(hx + hr * .5, hy - hr * .6, hx, hy - hr * .45); ctx.quadraticCurveTo(hx - hr * .5, hy - hr * .6, hx - hr * 1, hy - hr * .2); ctx.closePath(); fillStroke(ctx, '#8a5530', .014);
}
function hairDraco(ctx, hx, hy, hr) {
  ctx.beginPath(); ctx.arc(hx, hy, hr * 1.05, Math.PI * 1.08, Math.PI * 1.92); ctx.quadraticCurveTo(hx + hr * .2, hy - hr * .75, hx - hr * .3, hy - hr * .5); ctx.quadraticCurveTo(hx - hr * .7, hy - hr * .4, hx - hr * 1.01, hy - hr * .2); ctx.closePath(); fillStroke(ctx, '#f4e3a0', .014);
  ctx.beginPath(); ctx.moveTo(hx - hr * .6, hy - hr * .85); ctx.quadraticCurveTo(hx, hy - hr * .95, hx + hr * .7, hy - hr * .75); ctx.lineWidth = .01; ctx.strokeStyle = '#c9b060'; ctx.stroke();
}
function turban(ctx, hx, hy, hr) {
  const shp = () => { ctx.beginPath(); ctx.ellipse(hx, hy - hr * .62, hr * 1.12, hr * .72, 0, Math.PI * .95, Math.PI * 2.05); ctx.closePath(); };
  shp(); fillStroke(ctx, '#7b3fa8', .014);
  ctx.save(); shp(); ctx.clip(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(hx - hr * 1.2, hy - hr * (.5 + i * .25)); ctx.quadraticCurveTo(hx, hy - hr * (.2 + i * .3), hx + hr * 1.2, hy - hr * (.7 + i * .2)); ctx.lineWidth = .01; ctx.strokeStyle = 'rgba(40,10,60,.45)'; ctx.stroke(); } ctx.restore();
  circle(ctx, hx, hy - hr * .72, .028); fillStroke(ctx, '#e8c04a', .01);
}
function hairSnape(ctx, hx, hy, hr) {
  ctx.beginPath(); ctx.moveTo(hx - hr * 1.1, hy + hr * .9); ctx.lineTo(hx - hr * 1.12, hy - hr * .2); ctx.arc(hx, hy - hr * .1, hr * 1.12, Math.PI, 0); ctx.lineTo(hx + hr * 1.1, hy + hr * .9); ctx.lineTo(hx + hr * .75, hy + hr * .9); ctx.lineTo(hx + hr * .7, hy - hr * .3); ctx.quadraticCurveTo(hx, hy - hr * .75, hx - hr * .7, hy - hr * .3); ctx.lineTo(hx - hr * .75, hy + hr * .9); ctx.closePath(); fillStroke(ctx, '#141216', .014);
}

// ---- the sorting hat ----
function drawSortHat(ctx, x, y, s, t, o = {}) {
  const talk = o.talk || 0, open = clamp((o.open || 0) + talk * (.5 + .5 * Math.sin(t * 22)) * .55);
  const bend = o.bend == null ? 1 : o.bend, glow = o.glow || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -120, 20, 0, -120, 420); g.addColorStop(0, o.glowCol || 'rgba(60,220,120,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = glow; ctx.fillStyle = g; ctx.fillRect(-450, -550, 900, 900); ctx.restore(); }
  // brim
  ellipse(ctx, 0, 0, 230, 52); fillStroke(ctx, '#7a5a3a', 7);
  ctx.save(); ellipse(ctx, 0, 0, 230, 52); ctx.clip(); ctx.fillStyle = 'rgba(40,20,10,.3)'; ctx.fillRect(-240, 5, 480, 60); ctx.restore();
  // cone with a bent tip
  const tipX = 60 + bend * 120 + Math.sin(t * 1.7) * 12, tipY = -330 + bend * 60;
  const cone = () => { ctx.beginPath(); ctx.moveTo(-140, -10); ctx.quadraticCurveTo(-120, -160, -50, -240); ctx.quadraticCurveTo(10, -330, tipX, tipY); ctx.quadraticCurveTo(20, -250, 60, -200); ctx.quadraticCurveTo(130, -110, 140, -10); ctx.quadraticCurveTo(0, 20, -140, -10); ctx.closePath(); };
  cone(); fillStroke(ctx, '#8b6640', 7);
  ctx.save(); cone(); ctx.clip();
  ctx.fillStyle = 'rgba(40,20,10,.25)'; ctx.fillRect(40, -400, 200, 420);
  // patches + creases
  ctx.fillStyle = '#6f4f30'; ctx.beginPath(); ctx.roundRect(-100, -170, 50, 40, 6); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  // face: brow creases (eyes) and a torn mouth
  const ey = -120;
  for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(sd * 25, ey - 5); ctx.quadraticCurveTo(sd * 60, ey - 28 - (o.browUp || 0) * 15, sd * 95, ey - 2); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(sd * 60, ey + 10, 22, 8 + (o.eyeOpen || 0) * 10, 0, 0, TAU); ctx.fillStyle = '#2b1a10'; ctx.fill();
    if (o.eyeGlow) { ctx.beginPath(); ctx.ellipse(sd * 60, ey + 10, 10, 4 + (o.eyeOpen || 0) * 5, 0, 0, TAU); ctx.fillStyle = o.eyeGlow; ctx.fill(); }
  }
  const my = -40, mw = 75;
  ctx.beginPath(); ctx.moveTo(-mw, my); ctx.quadraticCurveTo(-20, my - 12 - open * 10, 0, my - 4); ctx.quadraticCurveTo(25, my - 12 - open * 10, mw, my);
  ctx.quadraticCurveTo(10, my + 12 + open * 90, -mw, my); ctx.closePath(); ctx.fillStyle = '#1a0e08'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}

// ---- the great hall ----
function hallBG(ctx, t, cam, o = {}) {
  // enchanted night ceiling
  applyCam(ctx, cam, .1);
  const g = ctx.createLinearGradient(0, -600, 0, 1000); g.addColorStop(0, o.skyTop || '#0d1640'); g.addColorStop(1, o.skyBot || '#3b3f8f');
  ctx.fillStyle = g; ctx.fillRect(-2000, -2600, 5080, 4400);
  const R = rng(4); for (let i = 0; i < 90; i++) { const x = R() * 1500 - 210, y = R() * 1100 - 400, r = 1.5 + R() * 3.5; ctx.globalAlpha = .45 + .55 * Math.abs(Math.sin(t * 2 + i)); circle(ctx, x, y, r); ctx.fillStyle = '#fff7d6'; ctx.fill(); } ctx.globalAlpha = 1;
  // back wall with arched windows
  applyCam(ctx, cam, .35);
  const wall = o.wall || '#8a7a6e', base = o.base || 880;
  ctx.fillStyle = wall; ctx.fillRect(-800, base - 380, 2700, 1200);
  ctx.fillStyle = 'rgba(30,20,30,.18)'; for (let r = 0; r < 8; r++) for (let c = -6; c < 22; c++) { ctx.fillRect(c * 110 + (r % 2) * 55, base - 380 + r * 60, 106, 3); ctx.fillRect(c * 110 + (r % 2) * 55, base - 380 + r * 60, 3, 60); }
  for (let i = -2; i < 7; i++) {
    const x = 40 + i * 230, y = base - 330;
    ctx.beginPath(); ctx.moveTo(x, y + 260); ctx.lineTo(x, y + 60); ctx.arc(x + 55, y + 60, 55, Math.PI, 0); ctx.lineTo(x + 110, y + 260); ctx.closePath(); fillStroke(ctx, '#ffd98a', 6);
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,170,60,.5)'; ctx.fillRect(x + 55, y, 60, 270); line(ctx, x + 55, y, x + 55, y + 260, 4); line(ctx, x, y + 130, x + 110, y + 130, 4); ctx.restore();
  }
  // house banners
  const bans = o.banners || [HOUSE.red, HOUSE.green, HOUSE.blue, HOUSE.gold];
  bans.forEach((c, i) => { const x = 95 + i * 290 - 40; banner(ctx, x, base - 360, 120, 230, c, t + i); });
  // floor
  applyCam(ctx, cam, 1);
  const fg = ctx.createLinearGradient(0, base, 0, 2400); fg.addColorStop(0, '#6d5b52'); fg.addColorStop(1, '#3d302c');
  ctx.fillStyle = fg; ctx.fillRect(-800, base, 2700, 2000);
  ctx.strokeStyle = 'rgba(20,10,10,.25)'; ctx.lineWidth = 4;
  for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 40, base); ctx.lineTo(540 + i * 420, 2600); ctx.stroke(); }
  for (let k = 0; k < 9; k++) { const y = base + Math.pow(k / 8, 1.8) * 1500; ctx.beginPath(); ctx.moveTo(-800, y); ctx.lineTo(1900, y); ctx.stroke(); }
}
function banner(ctx, x, y, w, h, col, t) {
  const sw = Math.sin(t * 1.3) * 6;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w + sw, y + h); ctx.lineTo(x + w / 2 + sw, y + h - 40); ctx.lineTo(x + sw, y + h); ctx.closePath(); fillStroke(ctx, col, 6);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(x + w * .6, y, w, h); ctx.restore();
  line(ctx, x - 12, y, x + w + 12, y, 8, '#5a3a20');
  circle(ctx, x + w / 2 + sw * .5, y + h * .4, 26); fillStroke(ctx, '#f2d36b', 4);
}
function candle(ctx, x, y, s, t, ph = 0) {
  const by = y + Math.sin(t * 1.4 + ph) * 12 * s;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, by - 40 * s, 2, x, by - 40 * s, 90 * s); g.addColorStop(0, 'rgba(255,210,120,.55)'); g.addColorStop(1, 'rgba(255,160,60,0)');
  ctx.fillStyle = g; ctx.fillRect(x - 90 * s, by - 130 * s, 180 * s, 180 * s); ctx.restore();
  rrect(ctx, x - 12 * s, by - 20 * s, 24 * s, 80 * s, 5 * s); fillStroke(ctx, '#f8efd8', 4 * s);
  const fl = 1 + Math.sin(t * 17 + ph) * .12;
  ctx.beginPath(); ctx.moveTo(x, by - 52 * s * fl); ctx.quadraticCurveTo(x + 12 * s, by - 28 * s, x, by - 20 * s); ctx.quadraticCurveTo(x - 12 * s, by - 28 * s, x, by - 52 * s * fl); fillStroke(ctx, '#ffcc3a', 3 * s);
}
function candles(ctx, t, n = 14, seed = 2, y0 = 120, y1 = 560, x0 = -100, x1 = 1180, s0 = .6, s1 = 1.1) {
  const R = rng(seed); for (let i = 0; i < n; i++) { const s = lerp(s0, s1, R()); candle(ctx, lerp(x0, x1, R()), lerp(y0, y1, R()), s, t, i * 1.7); }
}
// long table seen from the side
function longTable(ctx, x0, x1, y, col, plates = true) {
  rrect(ctx, x0, y - 30, x1 - x0, 46, 8); fillStroke(ctx, '#8a5a32', 6);
  ctx.fillStyle = col; ctx.fillRect(x0 + 6, y + 16, x1 - x0 - 12, 18);
  for (let x = x0 + 40; x < x1 - 20; x += 300) { rrect(ctx, x, y + 14, 26, 190, 4); fillStroke(ctx, '#6e4426', 5); }
  if (plates) for (let x = x0 + 60; x < x1 - 40; x += 120) { ellipse(ctx, x, y - 34, 34, 9); fillStroke(ctx, '#e9e4d8', 4); rrect(ctx, x + 38, y - 72, 16, 38, 4); fillStroke(ctx, '#f2c230', 3); }
}
function stool(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const lx of [-70, 70]) { ctx.beginPath(); ctx.moveTo(lx * .7, -110); ctx.lineTo(lx, 0); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#8a5a32'; ctx.stroke(); }
  ellipse(ctx, 0, -115, 95, 22); fillStroke(ctx, '#9a6a3a', 6);
  ctx.restore();
}
function vignetteCol(ctx, col, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(540, 860, 300, 540, 900, 1200); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, col); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function bolt(ctx, x, y, s, rot = 0, col = '#ffe14d') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  path(ctx, [[-20, -100], [40, -100], [10, -20], [45, -20], [-30, 110], [-5, 10], [-40, 10]]); fillStroke(ctx, col, 7); ctx.restore();
}
// title card text with pop
function popText(ctx, str, x, y, size, k, fill = '#fff', stroke = INK, rot = 0) {
  if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.rotate(rot); const sc = backOut(clamp(k)); ctx.scale(sc, sc);
  text(ctx, str, 0, 0, size, fill, stroke, size * .22, 'Poppins', 700); ctx.restore();
}
function choiceCard(ctx, x, y, w, h, num, label, sub, col, k, hi) {
  if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(x + w / 2, y + h / 2); const sc = backOut(clamp(k)) * (1 + hi * .06); ctx.scale(sc, sc); ctx.rotate((1 - clamp(k)) * .2);
  ctx.globalAlpha = .55 + .45 * Math.max(hi, k >= 1 ? .6 : 1);
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  rrect(ctx, -w / 2, -h / 2, w, h, 30); ctx.fillStyle = '#fbf6ea'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 8 + hi * 6; ctx.strokeStyle = hi > .5 ? col : INK; ctx.stroke();
  rrect(ctx, -w / 2 + 22, -h / 2 + 22, h - 44, h - 44, 22); fillStroke(ctx, col, 6);
  text(ctx, String(num), -w / 2 + h / 2, 4, 84, '#fff', INK, 14);
  text(ctx, label, -w / 2 + h - 6, -26, 54, INK, INK, 0, 'Poppins', 700, 'left');
  text(ctx, sub, -w / 2 + h - 6, 36, 34, '#5a4a52', INK, 0, 'Poppins', 700, 'left');
  ctx.restore();
}
