// ---------- characters ----------
const YOU = { cols: PAL.red, hat: 'bandana', hatCol: '#d8312b', dotCol: '#fff' };
const PATCH = { cols: PAL.yellow, hat: 'bandana', hatCol: '#6c43c0', dotCol: '#fff' };
const SAILOR = { cols: PAL.blue, hat: 'sailor', belt: false };
const C = (base, extra) => Object.assign({}, base, extra);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);

// deck background (sky, sea, pillars, bulwark, floor)
function deckBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .08); drawSky(ctx, o.skyTop, o.skyBot);
  if (o.sun) { applyCam(ctx, cam, .1); drawSun(ctx, o.sun[0], o.sun[1], o.sun[2], t, o.sunPow || 1); }
  applyCam(ctx, cam, .14);
  drawCloud(ctx, 160 + t * 6, 260, 120, 1); drawCloud(ctx, 760 + t * 4, 150, 90, 2); drawCloud(ctx, 1050 + t * 5, 420, 70, 3, .9); drawCloud(ctx, -100 + t * 5, 520, 80, 4, .9);
  applyCam(ctx, cam, .3); drawPillars(ctx, o.horizon || 760, o.set || 'A');
  applyCam(ctx, cam, .45); drawSea(ctx, o.horizon || 760, t);
  if (o.farShip) { drawShip(ctx, o.farShip[0], (o.horizon || 760) + 40, o.farShip[1], t, { skull: true, flag: '#1b1820', hull: '#3d2a2a', ph: 1 }); }
  applyCam(ctx, cam, 1);
  drawBulwark(ctx, o.back || 1000, o.wallH || 140);
  drawDeckFloor(ctx, o.back || 1000, o.vx || 540);
}
function caribbeanHeat(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(900, 200, 50, 900, 200, 1500); g.addColorStop(0, `rgba(255,220,120,${.55 * a})`); g.addColorStop(1, `rgba(255,170,60,${.12 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }

