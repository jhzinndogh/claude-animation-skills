// ---------- Mike Tyson reel: shot list (seconds) ----------
const C = (base, extra) => Object.assign({}, base, extra);
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const GUARD_L = [-.05, -.71], GUARD_R = [.08, -.69];
const guardArms = (bob = 0) => ({ L: { ik: [GUARD_L[0], GUARD_L[1] + bob], bend: -1 }, R: { ik: [GUARD_R[0], GUARD_R[1] + bob], bend: -1 } });
// punch: p 0..1..0, target local point
function punchArms(p, side, tgt, bob = 0) {
  const a = guardArms(bob); const g = side === 'R' ? GUARD_R : GUARD_L;
  a[side] = { ik: [lerp(g[0], tgt[0], p), lerp(g[1], tgt[1], p)], bend: -1 }; return a;
}
const hit = (lt, t0, up = .07, down = .16) => lt < t0 - up ? 0 : lt < t0 ? easeOut((lt - (t0 - up)) / up) : clamp(1 - (lt - t0) / down);
const stance = { L: [-.25, .1], R: [.3, -.2] };
function dizzyStars(ctx, x, y, r, t, a = 1) { for (let i = 0; i < 4; i++) { const an = t * 5 + i * TAU / 4; ctx.save(); ctx.globalAlpha = a; star5(ctx, x + Math.cos(an) * r, y + Math.sin(an) * r * .35, 26, t * 3, '#ffe14d'); ctx.restore(); } }
function hitFX(ctx, x, y, lt, t0, r = 150) { const k = lt - t0; if (k < 0 || k > .3) return; const s = easeOut(k / .3); ctx.save(); ctx.globalAlpha = 1 - k / .3; burst(ctx, x, y, r * (.5 + s), 12, '#ffd23a', 5 + Math.floor(t0 * 10)); burst(ctx, x, y, r * .5 * (.5 + s), 9, '#fff', 8); ctx.restore(); }
function camShake(lt, t0, amp = 30, dur = .4) { const k = lt - t0; if (k < 0 || k > dur) return [0, 0]; const d = (1 - k / dur) ** 2; return [Math.sin(k * 90) * amp * d, Math.cos(k * 77) * amp * d]; }
function title(ctx, str, y, a, size = 120, col = '#ffe27a') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, y); const s = .6 + .4 * backOut(clamp(a)); ctx.scale(s, s); ctx.globalAlpha = clamp(a * 2); text(ctx, str, 0, 0, size, col, INK, 18, 'Poppins', 700); ctx.restore(); }

const SHOTS = [];
// A 0-2.55 mugshot: arrested again and again, tally on the wall
SHOTS.push({ start: 0, end: 2.55, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const flashes = [0, .42, .84, 1.26, 1.68, 2.1];
  const fi = flashes.filter(f => lt >= f).length - 1; const fk = lt - flashes[Math.max(0, fi)];
  const sh = camShake(lt, flashes[Math.max(0, fi)], 10, .2);
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: 1.04 + lt * .03 };
  applyCam(ctx, cam, .6); ctx.fillStyle = '#4b4f63'; ctx.fillRect(-800, -800, 2680, 3520);
  for (let i = 0; i < 9; i++) { const y = 560 + i * 110; line(ctx, -400, y, 1480, y, 5, 'rgba(255,255,255,.35)'); text(ctx, String(6 - i * .5).replace('.5', "'6"), 90, y - 26, 34, 'rgba(255,255,255,.6)', INK, 0); }
  const n = Math.min(38, Math.round(lerp(1, 38, clamp(lt / 2.2))));
  tally(ctx, 220, 220, n, 1.05);
  rrect(ctx, 720, 230, 260, 150, 18); fillStroke(ctx, '#d22a2a', 7); text(ctx, String(n) + 'x', 850, 308, 96, '#fff', INK, 12);
  applyCam(ctx, cam, 1);
  const turn = fi % 2 ? .8 : 0;
  drawStick(ctx, C(TY_KID, { x: 540, y: 1560, s: 780, face: { eyes: fi % 3 === 2 ? 'half' : 'normal', mouth: 'frown', browAng: .35, turn, look: [turn, 0] },
    arms: { L: { ik: [-.14, -.42], bend: -1 }, R: { ik: [.14, -.42], bend: 1 } }, headTilt: Math.sin(t * 2) * .02 }));
  rrect(ctx, 540 - 170, 1560 - .5 * 780, 340, 120, 10); fillStroke(ctx, '#1b1820', 6); text(ctx, 'NYPD ' + (1000 + n * 37), 540, 1560 - .5 * 780 + 60, 44, '#fff', INK, 0);
  flash(ctx, fk < .12 ? 1 - fk / .12 : 0);
} });
// B 2.55-3.95 the gate rises and the kid sprints out toward the light
SHOTS.push({ start: 2.55, end: 3.95, tr: 'whip', draw(ctx, lt, t) {
  const cam = { x: 540, y: 960, z: 1 + lt * .08 };
  applyCam(ctx, cam, .2); const g = ctx.createRadialGradient(540, 760, 50, 540, 760, 1100); g.addColorStop(0, '#fff6c4'); g.addColorStop(.4, '#ffc94a'); g.addColorStop(1, '#e26a2a'); ctx.fillStyle = g; ctx.fillRect(-1000, -1000, 3080, 3920);
  speedLines(ctx, 540, 760, t, clamp((lt - .35) * 3), 'rgba(255,255,255,.8)');
  applyCam(ctx, cam, 1);
  const k = easeIn(clamp((lt - .35) / 1.0)); const s = lerp(160, 900, k);
  drawStick(ctx, C(TY_KID, { x: 540, y: lerp(1100, 2000, k), s, legs: walkLegs(lt, 26, .8), arms: walkArms(lt, 26, .9), lean: -.05, face: { eyes: 'wide', mouth: 'grin', browAng: .3 } }));
  const up = easeOut(clamp((lt - .05) / .4)) * 1500;
  applyCam(ctx, { x: 540, y: 960, z: 1 }, 1); ctx.fillStyle = '#3b3f4e'; ctx.fillRect(-100, -up - 200, 1300, 200);
  drawBars(ctx, 40, 1040, -up - 60, 1920 - up, 8, '#8a8f9c');
} });
// C 3.95-6.35 straight to the top: uppercut knockout in the ring
SHOTS.push({ start: 3.95, end: 6.35, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 4); const sh = camShake(lt, .95, 40, .5);
  const cam = { x: 540 + hh[0] + sh[0], y: 1000 + hh[1] + sh[1], z: kf(lt, [[0, 1.05], [.9, 1.12], [1.0, 1.2, easeOut], [2.4, 1.1]]) };
  drawArena(ctx, t, cam, { cheer: lt > 1 ? 1 : .3, flash: lt > 1 ? .05 : 0 });
  applyCam(ctx, cam, 1);
  const bob = Math.sin(t * 6) * .01;
  const up = kf(lt, [[.65, 0], [.95, 1, easeOut], [1.3, 1], [1.6, 0]]);
  const tyArms = up > 0 ? { L: { ik: GUARD_L, bend: -1 }, R: { ik: [lerp(GUARD_R[0], .3, up), lerp(GUARD_R[1], -1.02, up)], bend: -1 } } : guardArms(bob);
  drawStick(ctx, C(TY_BOX, { x: lerp(300, 380, clamp(lt / .9)), y: 1560, s: 640, arms: tyArms, legs: stance, lean: -up * .12, face: { eyes: 'half', mouth: up > .5 ? 'teeth' : 'flat', browAng: .45 } }));
  // opponent launched
  const f = lt - .95; let ox = 720, oy = 1540, lean = 0, eyes = 'normal', mouth = 'flat';
  if (f > 0) { const fl = Math.min(f, .7); ox = 720 + fl * 260; oy = 1540 - Math.sin(Math.min(1, fl / .7) * Math.PI) * 330 + (f > .7 ? 0 : 0); lean = -Math.min(1.45, f * 2.6); eyes = 'x'; mouth = 'o'; if (f > .7) { oy = 1560; } }
  drawStick(ctx, C(OPP, { x: ox, y: oy, s: 620, flip: -1, lean, arms: f > 0 ? POSE.handsUp.arms : guardArms(-bob), legs: f > 0 ? { L: [.6, -.6], R: [.3, -.2] } : stance, face: { eyes, mouth, browAng: -.2 } }));
  if (f > .7) dizzyStars(ctx, ox + 330, oy - 130, 90, t);
  hitFX(ctx, 680, 1000, lt, .95, 170);
  frontRopes(ctx, 1700);
  flash(ctx, kf(lt, [[.94, 0], [.97, .8], [1.15, 0]]));
} });
// D 6.35-8.0 belt overhead, name card
SHOTS.push({ start: 6.35, end: 8.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 980 + hh[1] - lt * 20, z: 1.0 + lt * .05 };
  drawArena(ctx, t, cam, { cheer: 1, flash: .06, floor: 1350 });
  applyCam(ctx, cam, 1);
  const lift = easeOut(clamp(lt / .5)); const s = 880;
  const by = lerp(-.62, -1.12, lift);
  drawStick(ctx, C(TY_BOX, { x: 540, y: 1720, s, arms: { L: { ik: [-.27, by], bend: 1 }, R: { ik: [.27, by], bend: -1 } }, gloves: null, face: { eyes: lt > .9 ? 'happy' : 'normal', mouth: 'grin', browAng: .1 } }));
  drawBeltProp(ctx, 540, 1720 + by * s - 20, .95 + Math.sin(t * 4) * .01);
  sparkle(ctx, 640, 1720 + by * s - 60, 60 * clamp((lt - .5) * 3), clamp(2 - lt));
  confetti(ctx, t, 6.4);
  title(ctx, 'MIKE TYSON', 300, (lt - .95) * 3, 130);
} });
// E 8.0-10.35 Brooklyn, New York
SHOTS.push({ start: 8.0, end: 10.35, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 500 + hh[0] + lt * 25, y: 960 + hh[1], z: 1.08 - lt * .02 };
  drawStreet(ctx, t, cam);
  applyCam(ctx, cam, 1);
  streetSign(ctx, 640, 480, 'BROOKLYN', 1);
  rrect(ctx, 160, 1120, 420, 70, 6); fillStroke(ctx, '#8e8478', 6); rrect(ctx, 120, 1180, 500, 70, 6); fillStroke(ctx, '#a79e91', 6);
  drawStick(ctx, C(TY_KID, { x: 380, y: 1185, s: 480, legs: { L: [1.4, -1.4], R: [1.4, -1.5] }, arms: { L: { ik: [-.12, -.32] }, R: { ik: [.13, -.3], bend: -1 } }, face: { eyes: 'normal', mouth: 'flat', look: [.6, -.2], blink: (lt > 1.3 && lt < 1.42) ? 1 : 0 }, headTilt: Math.sin(t) * .04 }));
  title(ctx, 'NOVA YORK', 260, (lt - 1.5) * 3, 92, '#fff');
} });
// F 10.35-12.6 violence on the street, sirens
SHOTS.push({ start: 10.35, end: 12.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.12 + lt * .04 };
  drawStreet(ctx, t, cam, { skyTop: '#3a1f4f', skyBot: '#c5504a' });
  applyCam(ctx, cam, 1); darkness(ctx, .25, '#1a0a26'); applyCam(ctx, cam, 1);
  const p = Math.sin(lt * 9);
  drawStick(ctx, { x: 330, y: 1230, s: 420, sil: '#1d1222', lean: .1 + p * .05, arms: { L: [.6, -.3], R: [1.6 + p * .3, -.1] }, legs: { L: [.3, -.1], R: [-.2, -.1] } });
  drawStick(ctx, { x: 560, y: 1230, s: 440, flip: -1, sil: '#1d1222', lean: -.15 - p * .08, arms: { L: [1.4 - p * .3, -.2], R: [2.4, .2] }, legs: { L: [.2, -.2], R: [-.1, -.1] } });
  if (p > .8) burst(ctx, 450, 900, 60, 9, '#ffd23a', 4);
  drawStick(ctx, C(TY_KID, { x: 800, y: 1700, s: 720, flip: -1, arms: { L: { ik: [-.12, -.5], bend: 1 }, R: { ik: [.12, -.5], bend: -1 } }, face: { eyes: 'wide', mouth: 'o', look: [1, 0], browAng: -.3, browUp: 1 }, lean: Math.sin(t * 20) * .01 }));
  sweat(ctx, 680, 1700 - .9 * 720, 30, 1);
  sirenLight(ctx, t, .9);
} });
// G 12.6-13.75 no father: dashed outline fades away
SHOTS.push({ start: 12.6, end: 13.75, tr: 'cut', draw(ctx, lt, t) {
  const cam = { x: 540, y: 960, z: 1 + lt * .05 };
  applyCam(ctx, cam, .3); const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2b2f5e'); g.addColorStop(1, '#5a4a7a'); ctx.fillStyle = g; ctx.fillRect(-1000, -1000, 3080, 3920);
  applyCam(ctx, cam, 1); rrect(ctx, -400, 1300, 1900, 900, 0); fillStroke(ctx, '#3d3566', 0);
  dashedFigure(ctx, 700, 1310, 760, kf(lt, [[0, .9], [.4, .9], [1.0, 0]]));
  drawStick(ctx, C(TY_KID, { x: 330, y: 1310, s: 470, arms: POSE.idle.arms, face: { eyes: 'normal', mouth: 'frown', look: [.8, -.7], browAng: -.25 }, headTilt: .12 }));
} });
// H 13.75-16.0 bullied for his high voice
SHOTS.push({ start: 13.75, end: 16.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.05 + lt * .04 };
  drawStreet(ctx, t, cam, { skyTop: '#5fb6e8', skyBot: '#d9f0ff' });
  applyCam(ctx, cam, 1);
  const laugh = lt > .95; const j = laugh ? Math.abs(Math.sin(t * 14)) * 18 : 0;
  drawStick(ctx, C(BULLY, { x: 170, y: 1560 - j, s: 680, arms: laugh ? { L: [.4, -.6], R: { ik: [.42, -.6] } } : POSE.hips.arms, face: { eyes: laugh ? 'happy' : 'normal', mouth: laugh ? 'grin' : 'smirk', look: [1, 0] }, lean: laugh ? -.08 : 0 }));
  drawStick(ctx, C(BULLY2, { x: 910, y: 1560 - j * .8, s: 660, flip: -1, arms: laugh ? { L: [.4, -.6], R: { ik: [.42, -.6] } } : POSE.hips.arms, face: { eyes: laugh ? 'happy' : 'normal', mouth: laugh ? 'grin' : 'smirk', look: [1, 0] }, lean: laugh ? -.08 : 0 }));
  drawStick(ctx, C(TY_KID, { x: 540, y: 1480, s: 470, arms: { L: [.2, -.1], R: [.2, -.1] }, face: { eyes: lt > .95 ? 'normal' : 'normal', mouth: lt > .95 ? 'frown' : 'o', browAng: -.3, look: [0, .4] } }));
  const bs = backOut(clamp((lt - .25) / .25)) * (lt < 1.0 ? 1 : 0);
  bubble(ctx, 600, 640, 240, 130, 560, 860, bs);
  if (bs > 0) { ctx.save(); ctx.translate(600, 640); ctx.scale(bs, bs); ctx.beginPath(); for (let i = 0; i <= 16; i++) { const x = -80 + i * 10, y = (i % 2 ? -1 : 1) * 14 + Math.sin(t * 40 + i) * 4; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineWidth = 6; ctx.strokeStyle = '#7a4bc4'; ctx.stroke(); ctx.restore(); }
  if (laugh) { const a = clamp((lt - .95) * 4); ctx.save(); ctx.globalAlpha = a; text(ctx, 'HA HA', 250, 520 - j, 86, '#ffe14d', INK, 14); text(ctx, 'HA HA', 830, 440 + j, 86, '#ffe14d', INK, 14); ctx.restore(); }
} });
// I 16.0-18.2 rage becomes his only defense: face heats up, fist to camera
SHOTS.push({ start: 16.0, end: 18.2, tr: 'cut', draw(ctx, lt, t) {
  const heat = clamp(lt / 1.2); const sh = shake(t, heat * 8, 2, 1);
  const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1 + lt * .06 };
  applyCam(ctx, cam, .2); ctx.fillStyle = mix('#3f4a7a', '#c22a2a', heat); ctx.fillRect(-1000, -1000, 3080, 3920);
  speedLines(ctx, 540, 900, t, heat * .7, 'rgba(255,200,120,.5)');
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(TY_KID, { x: 540, y: 2080, s: 1500, shadow: false, arms: { L: [.2, -.1], R: [.2, -.1] }, blush: heat > .4, face: { eyes: 'normal', mouth: heat > .5 ? 'teeth' : 'frown', browAng: lerp(-.25, .7, heat), pupil: lerp(.45, .22, heat) } }));
  if (heat > .6) { const k = (lt * 2) % 1; puff(ctx, 230 - k * 60, 650 - k * 160, 60 + k * 40, t, '#f4f0e6', 3, 1 - k); puff(ctx, 850 + k * 60, 650 - k * 160, 60 + k * 40, t, '#f4f0e6', 4, 1 - k); }
  // fist to camera
  const fk = easeIn(clamp((lt - 1.45) / .35));
  if (fk > 0) { applyCam(ctx, { x: 540, y: 960, z: 1 }, 1); const r = lerp(60, 900, fk); circle(ctx, lerp(700, 540, fk), lerp(1300, 900, fk), r); fillStroke(ctx, SKIN, 8 + r * .03); for (let i = -1; i <= 1; i++) line(ctx, lerp(700, 540, fk) + i * r * .3, lerp(1300, 900, fk) - r * .55, lerp(700, 540, fk) + i * r * .3, lerp(1300, 900, fk) - r * .2, 6 + r * .02); }
  if (lt > 1.8) { burst(ctx, 540, 900, 600, 14, '#ffd23a', 9); flash(ctx, 1 - (lt - 1.8) / .4); }
} });
// J 18.2-22.0 escorted in and locked up in the reformatory
SHOTS.push({ start: 18.2, end: 22.0, tr: 'whip', draw(ctx, lt, t) {
  const sh = camShake(lt, 1.85, 35, .5); const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: 1.02 + lt * .025 };
  drawCellRoom(ctx, cam);
  applyCam(ctx, cam, 1);
  const wk = clamp(lt / 1.5); const walking = lt < 1.5;
  const kx = lerp(-80, 520, wk);
  rrect(ctx, 380, 1300, 330, 60, 8); fillStroke(ctx, '#7b5a3a', 6);
  drawStick(ctx, C(TY_KID, { x: kx, y: 1540, s: 520, legs: walking ? walkLegs(lt, 10, .4) : { L: [.1, -.04], R: [.1, -.04] }, arms: POSE.idle.arms, face: { eyes: 'normal', mouth: 'frown', browAng: lt > 2 ? -.3 : .3, look: lt > 2 ? [0, .5] : [1, 0] }, headTilt: lt > 2 ? .15 : 0 }));
  const gx = lt < 1.5 ? kx - 230 : lerp(kx - 230, -400, clamp((lt - 1.5) / 1.2));
  drawStick(ctx, C(GUARD, { x: gx, y: 1580, s: 640, legs: (lt < 1.5 || lt < 2.7) ? walkLegs(lt, 10, .4) : POSE.idle.legs, arms: lt < 1.5 ? { L: [.3, -.1], R: { ik: [.42, -.55] } } : POSE.idle.arms, face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }));
  const bx = kf(lt, [[1.45, 1300], [1.85, 40, easeIn]]);
  drawBars(ctx, bx, bx + 1000, -100, 2100, 7);
  if (lt > 1.85 && lt < 2.1) burst(ctx, bx + 20, 900, 120, 10, '#fff', 3);
  rrect(ctx, 160, 220, 760, 130, 12); fillStroke(ctx, '#e9e0cc', 7); text(ctx, 'REFORMATÓRIO', 540, 288, 74, '#3b3f4e', INK, 0);
} });
// K 22.0-25.7 inside, a coach sees his punching power
SHOTS.push({ start: 22.0, end: 25.7, tr: 'whip', draw(ctx, lt, t) {
  const hits = [.45, .8, 1.15, 2.15]; const big = 2.15;
  const sh = camShake(lt, big, 30, .5); const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: 1.03 + lt * .03 };
  drawGym(ctx, cam); applyCam(ctx, cam, 1);
  let ang = 0; for (const h of hits) { const k = lt - h; if (k > 0) ang += (h === big ? 1.0 : .18) * Math.exp(-k * (h === big ? 1.2 : 3)) * Math.sin(k * 5 + .2); }
  heavyBag(ctx, 700, -40, 1.25, -ang * .9);
  let p = 0, side = 'R'; hits.forEach((h, i) => { const v = hit(lt, h, .08, .18); if (v > p) { p = v; side = i % 2 ? 'L' : 'R'; } });
  const tgt = side === 'R' ? [.52, -.62] : [.5, -.66];
  drawStick(ctx, C(TY_KID, { x: 330, y: 1560, s: 640, gloves: '#d22a2a', arms: punchArms(p, side, tgt, Math.sin(t * 6) * .01), legs: stance, lean: -p * .08, face: { eyes: 'half', mouth: 'flat', browAng: .45 } }));
  hits.forEach(h => hitFX(ctx, 620, 1040, lt, h, h === big ? 200 : 80));
  const wow = lt > 2.25;
  drawStick(ctx, C(COACH, { x: 930, y: 1640, s: 560, flip: -1, arms: wow ? { L: [2.4, .3], R: [2.6, .4] } : POSE.hips.arms, face: { eyes: wow ? 'wide' : 'normal', mouth: wow ? 'o' : 'smile', look: [1, 0], browUp: wow ? 1 : 0 }, squash: wow ? kf(lt, [[2.25, .85], [2.5, 1, backOut]]) : 1 }));
  if (wow) { text(ctx, '!', 960, 1640 - 560 * 1.15 - 30, 130, '#ffe14d', INK, 16); }
} });
// L 25.7-28.0 introduced to the legendary Cus D'Amato
SHOTS.push({ start: 25.7, end: 28.0, tr: 'whip', draw(ctx, lt, t) {
  const on = lt > 1.4; const hh = handheld(t, 2);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .06 };
  applyCam(ctx, cam, .2); ctx.fillStyle = '#1c1430'; ctx.fillRect(-1000, -1000, 3080, 3920);
  if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(0, -200, 0, 1800); lg.addColorStop(0, 'rgba(255,230,150,.55)'); lg.addColorStop(1, 'rgba(255,230,150,.08)'); ctx.fillStyle = lg; path(ctx, [[470, -200], [610, -200], [900, 1800], [180, 1800]]); ctx.fill(); ctx.restore(); }
  applyCam(ctx, cam, 1); ellipse(ctx, 560, 1700, 380, 70); ctx.fillStyle = on ? 'rgba(255,230,150,.35)' : 'rgba(0,0,0,.2)'; ctx.fill();
  drawStick(ctx, C(CUS, { x: 560, y: 1700, s: 900, sil: on ? undefined : '#0d0a16', arms: POSE.hips.arms, face: { eyes: 'normal', mouth: 'smirk', browOne: 1, look: [-.5, 0] } }));
  drawStick(ctx, C(COACH, { x: 130, y: 1760, s: 560, arms: { L: [.3, -.1], R: [1.7, -.1] }, face: { eyes: 'normal', mouth: 'grin', look: [1, -.2] } }));
  drawStick(ctx, C(TY_KID, { x: 330, y: 1800, s: 440, face: { eyes: 'wide', mouth: 'o', look: [1, -.6], browUp: 1 } }));
  if (on) { const a = clamp((lt - 1.4) * 3); for (let i = 0; i < 5; i++) sparkle(ctx, 360 + i * 110, 600 + Math.sin(i * 2.3 + t * 3) * 80, 40 * a, a * (.6 + .4 * Math.sin(t * 8 + i))); title(ctx, "CUS D'AMATO", 290, (lt - 1.4) * 3, 100); }
  flash(ctx, kf(lt, [[1.38, 0], [1.42, .7], [1.7, 0]]));
} });
// M 28.0-32.7 adoption, discipline, fury into pure technique
SHOTS.push({ start: 28.0, end: 32.7, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .03 };
  drawGym(ctx, cam); applyCam(ctx, cam, 1);
  const beat = .26; const n = Math.floor((lt - .3) / beat); const ph = ((lt - .3) % beat) / beat;
  const active = lt > .3; const p = active ? Math.sin(Math.min(1, ph * 1.6) * Math.PI) : 0; const side = n % 2 ? 'L' : 'R';
  const slip = Math.sin(t * 5) * .08;
  drawStick(ctx, C(TY_KID, { x: 360, y: 1580, s: 650, hat: 'flattop', gloves: '#d22a2a', arms: active ? punchArms(p, side, side === 'R' ? [.5, -.66] : [.48, -.7]) : guardArms(), legs: stance, lean: slip, face: { eyes: 'half', mouth: 'flat', browAng: .4 } }));
  const mitt = lerp(-.68, -.7, p);
  drawStick(ctx, C(CUS, { x: 830, y: 1620, s: 620, flip: -1, gloves: '#e9dcc0', arms: { L: { ik: [-.08 - p * .04 * (side === 'R'), mitt], bend: 1 }, R: { ik: [.12 - p * .04 * (side === 'L'), mitt + .03], bend: -1 } }, face: { eyes: 'normal', mouth: lt > 1.3 && lt < 2.6 ? 'o' : 'smile', look: [1, 0], browAng: .2 } }));
  if (active && ph < .25) burst(ctx, 640, 1580 - .68 * 650, 45, 8, '#fff', n);
  // icons: fury -> technique
  const fa = backOut(clamp((lt - 3.0) / .3)), aa = clamp((lt - 3.4) / .3), ta = backOut(clamp((lt - 3.7) / .3));
  if (fa > 0) { rrect(ctx, 120, 300, 840, 330, 40); ctx.globalAlpha = clamp(fa); fillStroke(ctx, 'rgba(20,10,30,.55)', 0); ctx.globalAlpha = 1; }
  if (fa > 0) { ctx.save(); ctx.translate(290, 465); ctx.scale(fa, fa); flameIcon(ctx, 0, 0, 110, t); ctx.restore(); }
  arrowR(ctx, 430, 465, 220, aa);
  if (ta > 0) { ctx.save(); ctx.translate(790, 465); ctx.scale(ta, ta); targetIcon(ctx, 0, 0, 110); ctx.restore(); }
  // discipline: whistle + clock tick marks while he says "disciplina"
  if (lt > 1.4 && lt < 2.9) { const a = clamp((lt - 1.4) * 4) * clamp((2.9 - lt) * 4); ctx.save(); ctx.globalAlpha = a; circle(ctx, 540, 440, 130); fillStroke(ctx, '#f4f0e6', 9); for (let i = 0; i < 12; i++) { const an = i / 12 * TAU; line(ctx, 540 + Math.cos(an) * 100, 440 + Math.sin(an) * 100, 540 + Math.cos(an) * 115, 440 + Math.sin(an) * 115, 7); } const an = (lt - 1.4) * 8; line(ctx, 540, 440, 540 + Math.sin(an) * 90, 440 - Math.cos(an) * 90, 9, '#d22a2a'); line(ctx, 540, 440, 540, 380, 11); ctx.restore(); }
} });
// N 32.7-35.5 at 20, back in the ring: the knockout
SHOTS.push({ start: 32.7, end: 35.5, tr: 'cut', draw(ctx, lt, t) {
  const hk = 1.75; const sh = camShake(lt, hk, 40, .5); const hh = handheld(t, 4);
  const cam = { x: 540 + hh[0] + sh[0], y: 1000 + hh[1] + sh[1], z: kf(lt, [[0, 1.0], [hk, 1.1], [hk + .1, 1.2, easeOut], [2.8, 1.12]]) };
  drawArena(ctx, t, cam, { banner: '1986', cheer: lt > hk ? 1 : .4, flash: lt > hk ? .05 : .01 });
  applyCam(ctx, cam, 1);
  const step = clamp(lt / 1.4); const bob = Math.sin(t * 6) * .012;
  const pp = hit(lt, hk, .1, .35); const jab1 = hit(lt, 1.0, .07, .15), jab2 = hit(lt, 1.3, .07, .15);
  let arms = guardArms(bob);
  if (jab1 > 0) arms = punchArms(jab1, 'L', [.5, -.66]); if (jab2 > 0) arms = punchArms(jab2, 'R', [.5, -.62]); if (pp > 0) arms = punchArms(pp, 'L', [.52, -.75]);
  drawStick(ctx, C(TY_BOX, { x: lerp(260, 380, step), y: 1580, s: 650, arms, legs: step < 1 ? walkLegs(lt, 8, .25) : stance, lean: slip(t) - pp * .1, face: { eyes: 'half', mouth: 'flat', browAng: .5 } }));
  const f = lt - hk; let lean = 0, oy = 1560, ox = 740;
  if (f > 0) { lean = -Math.min(1.5, f * f * 6); ox = 740 + Math.min(f, .5) * 120; }
  drawStick(ctx, C(OPP, { x: ox, y: oy, s: 630, flip: -1, lean, trunks: '#e0392f', band: '#fff', gloves: '#e9e9e9', arms: f > 0 ? POSE.handsUp.arms : guardArms(-bob), legs: f > 0 ? { L: [.3, -.1], R: [.1, 0] } : stance, face: { eyes: f > 0 ? 'spiral' : 'normal', mouth: f > 0 ? 'o' : 'flat' }, t }));
  if (f > .5) dizzyStars(ctx, ox + 420, oy - 120, 90, t);
  hitFX(ctx, 680, 1080, lt, hk, 180); hitFX(ctx, 660, 1150, lt, 1.0, 60); hitFX(ctx, 660, 1150, lt, 1.3, 60);
  frontRopes(ctx, 1700);
  title(ctx, '20 ANOS', 300, (lt - .3) * 3, 110, '#fff');
  flash(ctx, kf(lt, [[hk - .01, 0], [hk + .02, .8], [hk + .2, 0]]));
} });
function slip(t) { return Math.sin(t * 4.5) * .05; }
// O 35.5-38.0 youngest heavyweight champion ever
SHOTS.push({ start: 35.5, end: 38.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 1000 + hh[1] + lt * 10, z: 1.06 + lt * .04 };
  drawArena(ctx, t, cam, { cheer: 1, flash: .08, floor: 1380 });
  applyCam(ctx, cam, 1);
  const lift = easeOut(clamp(lt / .45)); const s = 820; const by = lerp(-.6, -1.1, lift);
  drawStick(ctx, C(TY_BOX, { x: 540, y: 1760, s, gloves: null, arms: { L: { ik: [-.26, by], bend: 1 }, R: { ik: [.26, by], bend: -1 } }, face: { eyes: 'happy', mouth: 'grin' }, bob: Math.sin(t * 8) * .005 }));
  drawBeltProp(ctx, 540, 1760 + by * s - 20, .9);
  confetti(ctx, t, 35.5);
  const ba = backOut(clamp((lt - .9) / .35));
  if (ba > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 330); ctx.scale(ba, ba); ctx.rotate(Math.sin(t * 3) * .04); burst(ctx, 0, 0, 230, 16, '#ffd23a', 4, .78); text(ctx, 'CAMPEÃO', 0, -28, 74, '#d22a2a', INK, 0); text(ctx, 'MAIS JOVEM', 0, 46, 52, INK, INK, 0); ctx.restore(); }
} });
// P 38.0-40.1 hundreds of millions of dollars
SHOTS.push({ start: 38.0, end: 40.1, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.04 + lt * .05 };
  applyCam(ctx, cam, .2); const g = ctx.createRadialGradient(540, 800, 100, 540, 800, 1300); g.addColorStop(0, '#ffe27a'); g.addColorStop(1, '#3fa35b'); ctx.fillStyle = g; ctx.fillRect(-1000, -1000, 3080, 3920);
  applyCam(ctx, cam, 1); rrect(ctx, -400, 1500, 1900, 900, 0); fillStroke(ctx, '#2d7a48', 7);
  const grow = clamp(lt / 1.6);
  moneyStack(ctx, 170, 1560, Math.round(4 + grow * 14), 1); moneyStack(ctx, 910, 1560, Math.round(3 + grow * 16), 1);
  drawStick(ctx, C(TY_BOX, { x: 540, y: 1600, s: 700, cols: ['#1b1820', '#1b1820'], vest: '#f1efe8', trunks: null, gloves: null, arms: { L: [2.3 + Math.sin(t * 8) * .2, .3], R: [2.3 - Math.sin(t * 8) * .2, .3] }, face: { eyes: 'happy', mouth: 'grin' }, bob: Math.abs(Math.sin(t * 8)) * -.02 }));
  const R = rng(31); applyCam(ctx, { x: 540, y: 960, z: 1 }, 1);
  for (let i = 0; i < 34; i++) { const x = R() * 1180 - 50, sp = 500 + R() * 400, y = -150 + ((R() * 2000 + lt * sp) % 2100); bill(ctx, x + Math.sin(t * 2 + i) * 40, y, .9 + R() * .5, Math.sin(t * 3 + i) * .6); }
  title(ctx, '$$$', 300, (lt - .4) * 3, 150, '#7fcf7a');
} });
// Q 40.1-42.65 his mentor dies and everything crumbles
SHOTS.push({ start: 40.1, end: 42.65, tr: 'cut', draw(ctx, lt, t) {
  const sh = lt > 1.7 ? shake(t, 10, 2) : [0, 0]; const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1.02 + lt * .04 };
  applyCam(ctx, cam, .3); ctx.fillStyle = '#26304f'; ctx.fillRect(-1000, -1000, 3080, 3920);
  rrect(ctx, 180, 160, 260, 360, 10); fillStroke(ctx, '#3b4a72', 7); drawBars(ctx, 190, 430, 170, 510, 2, '#26304f');
  applyCam(ctx, cam, 1); rrect(ctx, -400, 1500, 1900, 900, 0); fillStroke(ctx, '#1b2238', 7);
  portrait(ctx, 700, 560, 1.0, CUS, clamp((lt - .3) * 3), lt > 1.7 ? Math.sin(t * 9) * .04 : 0);
  moneyStack(ctx, 900, 1560, 18, 1, clamp((lt - 1.7) / .7));
  drawStick(ctx, C(TY_BOX, { x: 380, y: 1640, s: 700, cols: ['#1b1820', '#1b1820'], vest: '#f1efe8', trunks: null, gloves: null, arms: POSE.idle.arms, face: { eyes: 'half', mouth: 'frown', look: [0, .8], browAng: -.35 }, headTilt: .2 }));
  if (lt > 1.0) { const k = (lt - 1.0) * 300; ctx.save(); ctx.beginPath(); ctx.moveTo(300, 1640 - .77 * 700 + 20); ctx.lineTo(300, 1640 - .77 * 700 + 20 + Math.min(k, 120)); ctx.lineWidth = 10; ctx.strokeStyle = '#8fd8ff'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  rain(ctx, t, .8);
} });
// R 42.65-43.55 prison
SHOTS.push({ start: 42.65, end: 43.55, tr: 'cut', draw(ctx, lt, t) {
  const sh = camShake(lt, .15, 35, .4); const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1.08 - lt * .04 };
  drawCellRoom(ctx, cam, '#5a5e70'); applyCam(ctx, cam, 1);
  drawStick(ctx, C(TY_BOX, { x: 540, y: 1700, s: 820, cols: ['#f08a2a', '#f08a2a'], trunks: null, gloves: null, arms: { L: { ik: [-.25, -.62], bend: -1 }, R: { ik: [.25, -.62], bend: 1 } }, face: { eyes: 'half', mouth: 'flat', browAng: .2, look: [0, 0] } }));
  const bx = kf(lt, [[0, 1200], [.15, 30, easeIn]]); drawBars(ctx, bx, bx + 1020, -100, 2100, 6);
  text(ctx, 'PRISÃO', 540, 300, 110, '#ffe27a', INK, 16);
} });
// S 43.55-45.3 the famous bite on Holyfield's ear
SHOTS.push({ start: 43.55, end: 45.3, tr: 'whip', draw(ctx, lt, t) {
  const bt = .55; const sh = camShake(lt, bt, 35, .45); const hh = handheld(t, 4);
  const cam = { x: 600 + hh[0] + sh[0], y: 980 + hh[1] + sh[1], z: kf(lt, [[0, 1.15], [bt, 1.3, easeOut], [1.75, 1.22]]) };
  drawArena(ctx, t, cam, { cheer: lt > bt ? 1 : .3, flash: .04, banner: '1997' });
  applyCam(ctx, cam, 1);
  const lunge = kf(lt, [[.3, 0], [bt, 1, easeIn], [.8, 1], [1.0, .2]]);
  const jump = lt > bt ? Math.max(0, Math.sin(clamp((lt - bt) / .5) * Math.PI)) * 160 : 0;
  drawStick(ctx, C(HOLY, { x: 720 + (lt > bt ? (lt - bt) * 120 : 0), y: 1560 - jump, s: 640, flip: -1, arms: lt > bt ? { L: [.4, -.3], R: { ik: [-.19, -.78], bend: -1 } } : guardArms(), legs: lt > bt ? { L: [.6, -.9], R: [.3, -.5] } : stance, face: lt > bt ? { eyes: 'wide', mouth: 'o', browUp: 1, look: [-1, 0] } : { eyes: 'normal', mouth: 'flat' } }));
  drawStick(ctx, C(TY_BOX, { x: 400 + lunge * 60, y: 1580, s: 650, lean: lunge * .32, arms: { L: { ik: [.3, -.55], bend: -1 }, R: { ik: [.35, -.5], bend: -1 } }, legs: stance, face: { eyes: 'half', mouth: lunge > .6 ? 'teeth' : 'flat', browAng: .5 } }));
  const ba = lt - bt; if (ba > 0 && ba < .9) { const s = backOut(clamp(ba / .2)); ctx.save(); ctx.translate(690, 960); ctx.scale(s, s); ctx.rotate(-.12); burst(ctx, 0, 0, 200, 13, '#ffd23a', 6); text(ctx, 'NHAC!', 0, 6, 92, '#d22a2a', INK, 0); ctx.restore(); }
  frontRopes(ctx, 1700);
} });
// T 45.3-46.85 total bankruptcy in 2003
SHOTS.push({ start: 45.3, end: 46.85, tr: 'whip', draw(ctx, lt, t) {
  const st = 1.0; const sh = camShake(lt, st, 30, .4);
  const cam = { x: 540 + sh[0], y: 960 + sh[1], z: 1.02 + lt * .04 };
  applyCam(ctx, cam, .3); ctx.fillStyle = '#6b5a8a'; ctx.fillRect(-1000, -1000, 3080, 3920);
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(TY_BOX, { x: 540, y: 1650, s: 760, cols: ['#3d3f4a', '#3d3f4a'], trunks: null, gloves: null, arms: { L: { ik: [-.26, -.33] }, R: { ik: [.26, -.33], bend: -1 } }, face: { eyes: 'wide', mouth: 'frown', browAng: -.35, browUp: 1, look: [0, .6] } }));
  for (const s of [-1, 1]) { ctx.save(); ctx.translate(540 + s * .2 * 760, 1650 - .33 * 760); ellipse(ctx, 0, 30, 34, 50, s * .3); fillStroke(ctx, '#f4f0e6', 6); ctx.restore(); }
  // moth
  const mk = clamp(lt / 1.3); const mx = 540 + .2 * 760 + mk * 160 + Math.sin(t * 15) * 18, my = 1650 - .33 * 760 - mk * 420;
  if (lt > .1) { for (const s of [-1, 1]) { ellipse(ctx, mx + s * 22, my - 6, 24, 15, s * (.4 + Math.sin(t * 40) * .5)); fillStroke(ctx, '#d8cbb0', 4); } ellipse(ctx, mx, my, 9, 20); fillStroke(ctx, '#8a7a60', 4); }
  text(ctx, '2003', 540, 320, 150, '#fff', INK, 18);
  const sa = lt > st ? 1 : 0; const ss = lt > st ? lerp(2.2, 1, easeOut(clamp((lt - st) / .12))) : 0;
  if (sa) stamp(ctx, 540, 640, ss, 'FALÊNCIA', -.15, 1);
} });
// U 46.85-49.0 rock bottom, but he climbs out
SHOTS.push({ start: 46.85, end: 49.0, tr: 'whip', draw(ctx, lt, t) {
  const rise = clamp((lt - 1.3) / .8); const cam = { x: 540, y: 960 - easeIn(rise) * 220, z: 1.05 };
  wellBG(ctx, cam, t, rise); applyCam(ctx, cam, 1);
  line(ctx, 700, -1000, 700 + Math.sin(t * 2) * 6, 1500, 14, '#c79a5a');
  rrect(ctx, -400, 1580, 1900, 600, 0); fillStroke(ctx, '#1b1720', 7);
  const up = lt > 1.3; const cy = 1600 - easeIn(rise) * 700; const cl = Math.sin(lt * 14);
  if (!up) drawStick(ctx, C(TY_BOX, { x: 480, y: 1600, s: 640, cols: ['#3d3f4a', '#3d3f4a'], trunks: null, gloves: null, legs: { L: [1.4, -1.5], R: [1.3, -1.4] }, arms: { L: { ik: [-.1, -.3] }, R: { ik: [.12, -.32], bend: -1 } }, face: { eyes: lt > .9 ? 'normal' : 'half', mouth: lt > .9 ? 'flat' : 'frown', look: lt > .9 ? [.4, -1] : [0, .6], browAng: lt > .9 ? .3 : -.3 }, squash: 1 }));
  else drawStick(ctx, C(TY_BOX, { x: 640, y: cy, s: 640, cols: ['#3d3f4a', '#3d3f4a'], trunks: null, gloves: null, shadow: false, arms: { L: { ik: [.09, -1.0 + cl * .06], bend: -1 }, R: { ik: [.09, -.82 - cl * .06], bend: 1 } }, legs: { L: [.5 + cl * .3, -.8], R: [.5 - cl * .3, -.8] }, face: { eyes: 'half', mouth: 'teeth', look: [.3, -1], browAng: .45 } }));
  if (lt > .9 && lt < 1.3) text(ctx, '!', 620, 1600 - 640 * 1.2, 120, '#ffe14d', INK, 16);
} });
// V 49.0-50.9 reinvented: business, podcast, cinema
SHOTS.push({ start: 49.0, end: 50.9, tr: 'whip', draw(ctx, lt, t) {
  const cl = 1.35; const sh = camShake(lt, cl, 20, .3); const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: 1.02 + lt * .05 };
  applyCam(ctx, cam, .3); const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2b2f5e'); g.addColorStop(1, '#7a4bc4'); ctx.fillStyle = g; ctx.fillRect(-1000, -1000, 3080, 3920);
  for (let i = 0; i < 6; i++) { rrect(ctx, 80 + i * 160, 600, 120, 260, 14); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fill(); }
  rrect(ctx, 330, 250, 420, 120, 20); fillStroke(ctx, Math.sin(t * 6) > -.3 ? '#e0392f' : '#9a2620', 7); text(ctx, 'NO AR', 540, 312, 74, '#fff', INK, 0);
  applyCam(ctx, cam, 1); rrect(ctx, -200, 1450, 1500, 120, 14); fillStroke(ctx, '#5a3a24', 7);
  const talk = Math.sin(t * 16) > 0;
  drawStick(ctx, C(TY_OLD, { x: 420, y: 1700, s: 820, hat: 'headphones', arms: { L: { ik: [-.25, -.4] }, R: { ik: [.36, -.62 + Math.sin(t * 5) * .04], bend: -1 } }, face: { eyes: 'normal', mouth: talk ? 'o' : 'smile', look: [.8, 0] } }));
  micStand(ctx, 780, 1100, 1.0);
  const ca = backOut(clamp((lt - (cl - .35)) / .3));
  if (ca > 0) { ctx.save(); ctx.translate(820, 1580); ctx.scale(ca, ca); ctx.rotate(-.12); clapper(ctx, 0, 0, 1.1, lt < cl ? 1 : 0); ctx.restore(); }
  if (lt > cl && lt < cl + .2) burst(ctx, 700, 1520, 90, 9, '#fff', 2);
} });
// W 50.9-53.0 a legend respected around the world
SHOTS.push({ start: 50.9, end: 53.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 2); const cam = { x: 540 + hh[0], y: 960 + hh[1] - lt * 15, z: 1.0 + lt * .04 };
  applyCam(ctx, cam, .1); const g = ctx.createRadialGradient(540, 800, 80, 540, 800, 1300); g.addColorStop(0, '#3a3f8f'); g.addColorStop(1, '#120c2a'); ctx.fillStyle = g; ctx.fillRect(-1000, -1000, 3080, 3920);
  const R = rng(4); for (let i = 0; i < 60; i++) { const x = R() * 1200 - 60, y = R() * 1900; circle(ctx, x, y, 2 + R() * 4); ctx.fillStyle = `rgba(255,255,255,${.4 + .4 * Math.sin(t * 3 + i)})`; ctx.fill(); }
  applyCam(ctx, cam, 1);
  globe(ctx, 540, 1700, 560, t);
  drawStick(ctx, C(TY_OLD, { x: 540, y: 1150, s: 620, arms: { L: [2.5, .25], R: [2.6, .2] }, face: { eyes: 'happy', mouth: 'grin' }, bob: Math.sin(t * 4) * .006 }));
  for (let i = 0; i < 7; i++) { const a = clamp((lt - .2 - i * .12) * 3); const an = -Math.PI * .95 + i * Math.PI * .3 / 1; const x = 540 + Math.cos(-Math.PI + i * Math.PI / 6) * 470, y = 760 + Math.sin(-Math.PI + i * Math.PI / 6) * 380; if (a > 0) star5(ctx, x, y, 38 * backOut(a), t + i, '#ffe14d'); }
  title(ctx, 'LENDA', 290, (lt - .4) * 3, 130);
} });
// X 53.0-55.35 from no-future kid to the baddest man on the planet
SHOTS.push({ start: 53.0, end: 55.35, tr: 'whip', draw(ctx, lt, t) {
  const ex = easeOut(clamp((lt - 1.0) / .4)); const split = lerp(540, -20, ex);
  const cam = { x: 540, y: 960, z: 1 + lt * .03 };
  // left panel: the kid
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, split, H); ctx.clip();
  applyCam(ctx, cam, .2); ctx.fillStyle = '#5a5f70'; ctx.fillRect(-1000, -1000, 3080, 3920);
  applyCam(ctx, cam, 1); drawStick(ctx, C(TY_KID, { x: 270, y: 1500, s: 520, face: { eyes: 'normal', mouth: 'frown', look: [0, .6], browAng: -.3 }, headTilt: .1 })); ctx.restore();
  // right panel: the champion
  ctx.save(); ctx.beginPath(); ctx.rect(split, 0, W - split + 40, H); ctx.clip();
  applyCam(ctx, cam, .2); const g = ctx.createRadialGradient(810, 800, 50, 810, 800, 1200); g.addColorStop(0, '#ff9a3a'); g.addColorStop(1, '#8a1a1a'); ctx.fillStyle = g; ctx.fillRect(-1000, -1000, 3080, 3920);
  speedLines(ctx, lerp(810, 540, ex), 800, t, ex * .8);
  applyCam(ctx, cam, 1);
  const bx = lerp(810, 540, ex), by = lerp(1500, 1560, ex), bs = lerp(520, 760, ex);
  globe(ctx, bx, by + bs * .62, bs * .62, t);
  drawStick(ctx, C(TY_BOX, { x: bx, y: by, s: bs, shadow: false, arms: ex > .5 ? { L: [2.3, .5], R: [2.3, .5] } : guardArms(), face: { eyes: 'half', mouth: ex > .5 ? 'teeth' : 'flat', browAng: .5 } }));
  ctx.restore();
  if (ex < 1) { line(ctx, split, -10, split, H + 10, 16, INK); line(ctx, split, -10, split, H + 10, 8, '#fff'); }
  arrowR(ctx, 410, 520, 260, clamp((lt - .3) * 3) * (1 - ex));
  if (ex > .5) title(ctx, 'O MAIS MALVADO', 300, (lt - 1.25) * 3, 92, '#ffe27a');
} });
// Y 55.35-60.0 the cold stare: could anyone beat him in his prime?
SHOTS.push({ start: 55.35, end: 60.0, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.0 + lt * .045 };
  applyCam(ctx, cam, .2); ctx.fillStyle = '#120c1c'; ctx.fillRect(-1000, -1000, 3080, 3920);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(540, 700, 50, 540, 700, 1000); lg.addColorStop(0, 'rgba(255,220,160,.42)'); lg.addColorStop(1, 'rgba(255,220,160,0)'); ctx.fillStyle = lg; ctx.fillRect(-500, -500, 2100, 2900); ctx.restore();
  applyCam(ctx, cam, 1);
  const blink = (lt > 1.9 && lt < 2.0) ? 1 : 0;
  drawStick(ctx, C(TY_BOX, { x: 540, y: 2120, s: 1500, shadow: false, arms: { L: { ik: [-.21, -.66], bend: 1 }, R: { ik: [.21, -.66], bend: -1 } }, face: { eyes: 'half', mouth: 'flat', browAng: .5, blink, pupil: .4 }, bob: Math.sin(t * 2.5) * .004 }));
  const qa = backOut(clamp((lt - .8) / .3));
  if (qa > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 280); ctx.scale(qa, qa); text(ctx, 'NO AUGE?', 0, 0, 100, '#ffe27a', INK, 16); ctx.restore(); }
  const ca = backOut(clamp((lt - 3.35) / .3));
  if (ca > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 1560 + Math.sin(t * 8) * 10); ctx.scale(ca * .8, ca * .8);
    bubble(ctx, 0, -40, 360, 170, -60, 90, 1); for (let i = -1; i <= 1; i++) { circle(ctx, i * 80, -40, 22); ctx.fillStyle = INK; ctx.fill(); }
    ctx.restore(); }
} });
