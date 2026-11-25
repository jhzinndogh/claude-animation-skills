// ---------- "Dia 2 sendo o Naruto": shot list (seconds follow the script's 0:00-1:00 timing) ----------
const C = (base, extra) => Object.assign({}, base, extra);
const NZ = (t, o) => C(NARUTO, Object.assign({ t }, o));
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const LOTUS = { L: [1.35, -2.9], R: [1.35, -2.9] };
const LOTUS_ARMS = { L: { ik: [-.2, -.3] }, R: { ik: [.2, -.3] } };
function sitShadow(ctx, x, y, s) { ellipse(ctx, x, y, s * .32, s * .05); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill(); }
function lotus(ctx, t, x, ground, s, face, extra) {
  sitShadow(ctx, x, ground + s * .02, s);
  drawStick(ctx, NZ(t, Object.assign({ x, y: ground + .27 * s, s, shadow: false, legs: LOTUS, arms: LOTUS_ARMS, face }, extra)));
}
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function redTint(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = clamp(a); ctx.fillStyle = '#ff6a50'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function speedLines(ctx, a, t, col = 'rgba(255,255,255,') {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const R = rng(Math.floor(t * 15) + 3);
  for (let i = 0; i < 26; i++) { const ang = R() * TAU, r0 = 520 + R() * 200, r1 = r0 + 300 + R() * 500; line(ctx, 540 + Math.cos(ang) * r0, 960 + Math.sin(ang) * r0 * 1.5, 540 + Math.cos(ang) * r1, 960 + Math.sin(ang) * r1 * 1.5, 6 + R() * 8, col + (.5 * a) + ')'); }
  ctx.restore();
}
function cageScene(ctx, t, cam, o = {}) {
  drawSewer(ctx, cam, t, { bl: -200, br: 1280, bt: 60, bb: 1560, tremble: o.tremble || 0, glow: o.glow || 0 });
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#020404'; ctx.fillRect(-200, 60, 1480, 1440);
  if (o.behind) o.behind(ctx);
  drawCage(ctx, 540, 40, 1520, Object.assign({ n: 9, gap: 150, bw: 64, sealY: 620, sealS: .9 }, o.cage || {}));
}

const SHOTS = [];
// A: "Dia 2 sendo o Naruto Uzumaki" : lotus in the night forest
SHOTS.push({ start: 0, end: 1.75, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.08 - lt * .03, r: 0 };
  drawForest(ctx, cam, t, { ground: 1400 });
  applyCam(ctx, cam, 1);
  aura(ctx, 540, 1400, 760, t, .35 + .1 * Math.sin(t * 4));
  lotus(ctx, t, 540, 1400, 600, { blink: 1, mouth: 'flat' }, { bob: Math.sin(t * 2) * .004 });
  sticker(ctx, 'DIA 2', 540, 430, 140, '#e0392f', '#fff', -.06, backOut(clamp(lt / .3)));
} });
// B: "Vocês escolheram a Opção 3: ignorei o pergaminho do Mizuki"
SHOTS.push({ start: 1.75, end: 4.35, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 4);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .03, r: 0 };
  drawForest(ctx, cam, t, { ground: 1600, moon: [860, 260] });
  applyCam(ctx, cam, 1);
  const toss = 1.3; // "ignorei"
  const thrown = lt > toss;
  const sx = kf(lt, [[toss, 600], [toss + .7, 1150]]), sy = kf(lt, [[toss, 1050], [toss + .35, 700, easeOut], [toss + .7, 900, easeIn]]);
  drawStick(ctx, NZ(t, { x: 430, y: 1600, s: 680,
    arms: thrown ? { L: [.9, -2.2], R: [2.2, .2] } : { L: [.9, -2.2], R: { ik: [.22, -.58] } },
    face: thrown ? { eyes: 'smug', mouth: 'smirk', browOne: 1 } : { eyes: 'normal', look: [.8, 0], mouth: 'flat', browAng: -.2 },
    headTilt: thrown ? .08 : 0 }));
  if (!thrown) drawScroll(ctx, 430 + .22 * 680 + 20, 1600 - .58 * 680, .9, -.3);
  else { drawScroll(ctx, sx, sy, .9, (lt - toss) * 14); const xa = clamp((lt - toss - .45) / .2); if (xa > 0) { ctx.save(); ctx.globalAlpha = xa; line(ctx, sx - 90, sy - 90, sx + 90, sy + 90, 26, '#e0392f'); line(ctx, sx + 90, sy - 90, sx - 90, sy + 90, 26, '#e0392f'); ctx.restore(); } }
  sticker(ctx, 'OPÇÃO 3', 540, 380, 120, '#2f63c9', '#fff', .05, backOut(clamp((lt - .7) / .3)));
  const ck = clamp((lt - 1.0) / .25); if (ck > 0) { ctx.save(); ctx.translate(850, 300); ctx.scale(ck, ck); circle(ctx, 0, 0, 62); fillStroke(ctx, '#3fa35b', 9); ctx.beginPath(); ctx.moveTo(-28, 2); ctx.lineTo(-6, 26); ctx.lineTo(32, -22); ctx.lineWidth = 16; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore(); }
} });
// C: "fui pra floresta" : running through the trees
SHOTS.push({ start: 4.35, end: 5.9, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 5);
  const cam = { x: 540 + lt * 520 + hh[0], y: 960 + hh[1], z: 1, r: -.02 };
  drawForest(ctx, cam, t, { ground: 1600 });
  applyCam(ctx, cam, 1);
  const x = 420 + lt * 520;
  drawStick(ctx, NZ(t, { x, y: 1600 - Math.abs(Math.sin(t * 13)) * 40, s: 620, lean: .32, legs: walkLegs(t, 13, .9),
    arms: { L: [-1.2, .2], R: [-1.25, .1] }, face: { eyes: 'normal', look: [1, 0], mouth: 'grin', browAng: .3 } }));
  for (let i = 0; i < 6; i++) line(ctx, x - 420 - i * 30, 1080 + i * 70, x - 250 - i * 30, 1080 + i * 70, 10, 'rgba(255,255,255,.5)');
  applyCam(ctx, cam, 1.6);
  nearTrunk(ctx, 900 + Math.floor(lt) * 0, 220); nearTrunk(ctx, 1900, 260);
} });
// D: "decidi encarar a Kurama dentro da minha própria mente" : close-up, fox eyes in the dark
SHOTS.push({ start: 5.9, end: 8.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .05, r: 0 };
  ctx.save(); ctx.filter = 'blur(6px)'; drawForest(ctx, { x: 540, y: 960, z: 1.2 }, t, { ground: 1500 }); ctx.restore();
  darkness(ctx, clamp(lt / 1.4) * .55);
  applyCam(ctx, cam, 1);
  const ea = kf(lt, [[.3, 0], [1.1, 1]]);
  drawFoxEyes(ctx, 540, 330, .8, ea, ea);
  drawStick(ctx, NZ(t, { x: 540, y: 2130, s: 1700, shadow: false, arms: { L: [.2, -.1], R: [.2, -.1] },
    face: { eyes: 'normal', look: [0, -.2], mouth: lt > 1.1 ? 'grin' : 'flat', browAng: .35 } }));
} });
// E: "Sentei no meio das árvores, fechei os olhos e forcei meu chakra"
SHOTS.push({ start: 8.0, end: 11.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const push = kf(lt, [[0, 1], [3.6, 1.18]]);
  const pw = clamp((lt - 2.7) / .8);
  const sh = pw > 0 ? shake(t, 10 * pw, 3) : [0, 0];
  const cam = { x: 540 + hh[0] + sh[0], y: 1050 + hh[1] + sh[1], z: push, r: 0 };
  drawForest(ctx, cam, t, { ground: 1420 });
  applyCam(ctx, cam, 1);
  const closed = lt > 1.7;
  aura(ctx, 540, 1420, 700 + pw * 500, t, pw * .95);
  sparksUp(ctx, 540, 1420, 600, t, pw, '#bff4ff');
  const sq = kf(lt, [[0, 1], [.12, .85], [.4, 1, backOut]]);
  lotus(ctx, t, 540, 1420, 560, closed ? { blink: 1, mouth: pw > .3 ? 'teeth' : 'flat', browAng: pw * .4 } : { eyes: 'normal', look: [-.6, -.2], mouth: 'flat' }, { squash: sq });
  applyCam(ctx, cam, 1.5); nearTrunk(ctx, -60, 260); nearTrunk(ctx, 1150, 240);
  flash(ctx, kf(lt, [[3.35, 0], [3.6, .9]]), '#cdf3ff');
} });
// F: "até cair" : falling through the mind
SHOTS.push({ start: 11.6, end: 12.7, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(540, 960, 50, 540, 960, 1200); g.addColorStop(0, '#0b2a2e'); g.addColorStop(1, '#040a0c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 960);
  for (let i = 0; i < 9; i++) { ctx.rotate(t * 1.6 + i * .7); ctx.beginPath(); ctx.arc(0, 0, 160 + i * 110, 0, 2.2); ctx.lineWidth = 26; ctx.strokeStyle = i % 2 ? 'rgba(70,200,255,.25)' : 'rgba(40,140,150,.35)'; ctx.stroke(); }
  ctx.restore();
  speedLines(ctx, 1, t, 'rgba(160,240,255,');
  ctx.save(); ctx.translate(540, 960); ctx.rotate(lt * 4); ctx.translate(-540, -960);
  drawStick(ctx, NZ(t, { x: 540, y: 1180, s: kf(lt, [[0, 300], [1.1, 620]]), shadow: false, arms: POSE.handsUp.arms, legs: { L: [.7, -1.2], R: [.5, -.9] }, face: { eyes: 'wide', mouth: 'o', browUp: 1 } }));
  ctx.restore();
  flash(ctx, kf(lt, [[0, .9], [.2, 0]]), '#cdf3ff');
} });
// G: "naquele esgoto gigante do meu subconsciente" : splash down in the flooded corridor
SHOTS.push({ start: 12.7, end: 15.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const land = .25;
  const ks = clamp((lt - land) / .7);
  const sh = lt > land && lt < land + .4 ? shake(t, 14, 3) : [0, 0];
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: kf(lt, [[0, 1.12], [2.3, 1.0]]), r: 0 };
  drawSewer(ctx, cam, t, { speed: .5 });
  applyCam(ctx, cam, 1);
  const fy = lt < land ? lerp(200, 1520, easeIn(lt / land)) : 1520;
  ripples(ctx, 540, 1530, land, lt, 3, 1.1);
  const sq = lt < land ? 1.15 : kf(lt, [[land, .7], [land + .3, 1, backOut]]);
  drawStick(ctx, NZ(t, { x: 540, y: fy, s: 480, squash: sq, shadow: false,
    arms: lt < land ? POSE.handsUp.arms : { L: [.5, -.3], R: [.5, -.3] },
    legs: lt < land ? { L: [.3, -.5], R: [.3, -.5] } : { L: [.2, -.1], R: [.2, -.1] },
    face: lt < land + .8 ? { eyes: 'wide', mouth: 'o', browUp: 1 } : { eyes: 'normal', look: [Math.sin(lt * 2.5), -.3], mouth: 'frown', browAng: -.2 } }));
  splash(ctx, 540, 1530, ks, 1);
  if (lt > 1.1) { sweat(ctx, 540 + 150, 1520 - 420 + (lt - 1.1) * 70, 22, clamp((lt - 1.1) * 3)); sweat(ctx, 540 - 140, 1520 - 380 + (lt - 1.3) * 60, 18, clamp((lt - 1.3) * 3)); }
} });
// H: "Na minha frente, atrás de uma grade imensa"
SHOTS.push({ start: 15.0, end: 17.55, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: kf(lt, [[0, 1250], [2.5, 900]]) + hh[1], z: kf(lt, [[0, .78], [2.5, .9]]), r: 0 };
  cageScene(ctx, t, cam);
  applyCam(ctx, cam, 1);
  drawStick(ctx, NZ(t, { x: 540, y: 1980, s: 380, back: true, arms: POSE.idle.arms }));
} });
// I: "dois olhos vermelhos se abrem no escuro"
SHOTS.push({ start: 17.55, end: 20.2, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const cam = { x: 540 + hh[0], y: 700 + hh[1], z: kf(lt, [[0, 1.15], [2.6, 1.32]]), r: 0 };
  const open = kf(lt, [[.1, 0], [.9, .18], [1.25, .18], [1.5, 1, backOut]]);
  cageScene(ctx, t, cam, { behind: c => drawFoxEyes(c, 540, 540, 1.05, open, open, [0, .3]), cage: { seal: true } });
  flash(ctx, kf(lt, [[1.4, 0], [1.5, .35], [1.8, 0]]), '#ff5030');
} });
// J: "A Raposa de Nove Caudas tá furiosa. Só o rugido dela faz a água inteira tremer"
SHOTS.push({ start: 20.2, end: 25.0, tr: 'cut', draw(ctx, lt, t) {
  const roarT = 2.3;
  const rk = lt > roarT ? kf(lt, [[roarT, 0], [roarT + .2, 1, backOut], [4.4, .9]]) : 0;
  const tremble = lt > roarT ? 1 - clamp((lt - roarT - 1.8) / .7) : 0;
  const hh = handheld(t, 3); const sh = shake(t, 22 * tremble, 3.5);
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: kf(lt, [[0, .82], [roarT, .9], [roarT + .15, .98]]), r: tremble * Math.sin(t * 30) * .01 };
  cageScene(ctx, t, cam, { tremble, glow: .6 + tremble * .4, behind: c => {
    drawTails(c, 540, 820, .9, t, kf(lt, [[0, 0], [1, 1]]) * .95);
    drawFoxHead(c, 540, 760 + (lt > roarT ? -20 : 0), .72, { roar: rk, t, open: kf(lt, [[0, .6], [.6, 1]]), look: [0, .5] });
  } });
  applyCam(ctx, cam, 1);
  if (tremble > 0) { const k = (lt - roarT) % .45; for (let i = 0; i < 3; i++) { const r = ((lt - roarT) * 900 + i * 300) % 1200; ellipse(ctx, 540, 900, r, r * .7); ctx.lineWidth = 16 * tremble; ctx.strokeStyle = `rgba(255,200,160,${.4 * (1 - r / 1200) * tremble})`; ctx.stroke(); } }
  ripples(ctx, 540, 1800, roarT, lt, 4, 1.6);
  drawStick(ctx, NZ(t, { x: 540 - tremble * 30, y: 1960, s: 440, back: true, lean: -.12 * tremble, arms: tremble > 0 ? { L: [2.2, .8], R: [2.2, .8] } : POSE.idle.arms }));
  speedLines(ctx, tremble * .8, t);
} });
// K: "Eu tento conversar na moral, mas ela sente toda a minha raiva"
SHOTS.push({ start: 25.0, end: 28.65, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .03, r: 0 };
  const rage = clamp((lt - 2.4) / .6);
  const narrow = kf(lt, [[0, .55], [2.5, .55], [2.9, .3]]);
  cageScene(ctx, t, { x: 540, y: 800, z: 1.25 }, { glow: .4 + rage * .5, behind: c => drawFoxEyes(c, 540, 470, .95, narrow, 1, [0, .7]), cage: { seal: false } });
  applyCam(ctx, cam, 1);
  aura(ctx, 540, 1560, 900, t, rage * .9, CHAKRA_R);
  const wave = Math.sin(t * 7) * .25;
  drawStick(ctx, NZ(t, { x: 540, y: 1560, s: 620, shadow: false,
    arms: rage > .5 ? { L: [.6, -1.2], R: [.6, -1.2] } : { L: [1.9 + wave, .9], R: [1.9 - wave, .9] },
    face: rage > .5 ? { eyes: 'normal', pupilCol: '#ff3a1a', mouth: 'teeth', browAng: .45, look: [0, -.4] } : { eyes: 'normal', look: [0, -.6], mouth: 'grin', browAng: -.3, browUp: 1 } }));
  if (rage < .5) sweat(ctx, 540 + 140, 1560 - 560, 26, clamp(lt * 2));
  redTint(ctx, rage * .25);
} });
// L: "da vila" : thought bubble, villagers glaring
SHOTS.push({ start: 28.65, end: 30.3, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.02 + lt * .03, r: 0 };
  applyCam(ctx, cam, .2); ctx.fillStyle = '#2a0a0a'; ctx.fillRect(-500, -500, 2100, 3000);
  applyCam(ctx, cam, 1);
  const k = backOut(clamp(lt / .3));
  ctx.save(); ctx.translate(540, 680); ctx.scale(k, k); ctx.translate(-540, -680);
  drawBubble(ctx, 540, 680, 860, 760, [300, 1300], '#f6e9dc');
  ctx.save(); ellipse(ctx, 540, 680, 420, 360); ctx.clip();
  rooftops(ctx, 560, 640, 1.1);
  for (const [x, c] of [[360, PAL.blue], [540, PAL.green], [720, PAL.purple]]) drawStick(ctx, { x, y: 1000, s: 330, cols: c, hat: 'none', belt: false, arms: { L: { ik: [.08, -.45] }, R: { ik: [-.08, -.42] } }, face: { eyes: 'half', mouth: 'frown', browAng: .4, look: [0, .3] } });
  ctx.restore(); ctx.restore();
  drawStick(ctx, NZ(t, { x: 230, y: 1900, s: 600, shadow: false, arms: { L: [.3, -.2], R: [.3, -.2] }, face: { eyes: 'half', mouth: 'frown', browAng: .4, look: [.6, -.6] } }));
} });
// M: "e me faz uma proposta tentadora" : the fox grins
SHOTS.push({ start: 30.3, end: 32.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const cam = { x: 540 + hh[0], y: 900 + hh[1], z: kf(lt, [[0, 1.05], [1.7, 1.18]]), r: 0 };
  cageScene(ctx, t, cam, { glow: .6, behind: c => drawFoxHead(c, 540, 820, .85, { grin: kf(lt, [[.1, 0], [.5, 1]]), t, open: .62, look: [0, .4] }), cage: { seal: false, n: 7, gap: 190, bw: 54 } });
} });
// N: "ela me empresta o chakra dela ... pra eu humilhar todo mundo na Academia"
SHOTS.push({ start: 32.0, end: 37.65, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const pw = clamp((lt - .6) / 1.6);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .02, r: 0 };
  cageScene(ctx, t, { x: 540, y: 900, z: 1.0 }, { glow: .5 + pw * .5, behind: c => drawFoxEyes(c, 540, 420, .9, .7, 1, [0, .8]), cage: { seal: false } });
  applyCam(ctx, cam, 1);
  // stream of red chakra pouring through the bars into Naruto
  if (pw > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); for (let k = 0; k <= 20; k++) { const u = k / 20 * pw; const x = 540 + Math.sin(u * 7 + t * 5 + i * 1.3) * (60 + i * 20) * (1 - u * .3); const y = lerp(560, 1350, u); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineWidth = 40 - i * 6; ctx.strokeStyle = `rgba(255,${60 + i * 30},20,.35)`; ctx.stroke(); }
    ctx.restore();
  }
  aura(ctx, 540, 1700, 1000, t, pw, CHAKRA_R);
  sparksUp(ctx, 540, 1700, 700, t, pw, '#ffb36a');
  drawStick(ctx, NZ(t, { x: 540, y: 1700, s: 640, shadow: false, arms: pw > .6 ? { L: [.8, -2.0], R: [.8, -2.0] } : POSE.idle.arms,
    face: { eyes: 'normal', pupilCol: pw > .5 ? '#ff3a1a' : null, slit: pw > .5, mouth: pw > .5 ? 'grin' : 'o', browAng: pw * .45, look: [0, -.3] } }));
  // "humilhar todo mundo na Academia": daydream bubble
  const bk = backOut(clamp((lt - 3.1) / .3));
  if (bk > 0) {
    ctx.save(); ctx.translate(540, 560); ctx.scale(bk, bk); ctx.translate(-540, -560);
    drawBubble(ctx, 540, 560, 900, 620, [700, 1050], '#fff3e6');
    ctx.save(); ellipse(ctx, 540, 560, 440, 300); ctx.clip();
    rrect(ctx, 120, 700, 840, 300, 0); ctx.fillStyle = '#d9c29a'; ctx.fill();
    aura(ctx, 380, 820, 500, t, .9, CHAKRA_R);
    drawStick(ctx, NZ(t, { x: 380, y: 820, s: 380, arms: { L: [.9, -2.1], R: [2.6, .1] }, face: { eyes: 'smug', pupilCol: '#ff3a1a', mouth: 'grin', browAng: .4 } }));
    const fall = clamp((lt - 3.6) / .3);
    for (const [x, c, d] of [[620, PAL.blue, 0], [760, PAL.green, .1], [880, PAL.purple, .2]]) { const f = clamp(fall - d); drawStick(ctx, { x, y: 800, s: 250, cols: c, hat: 'none', belt: false, lean: f * 1.3, arms: POSE.handsUp.arms, face: f > .5 ? { eyes: 'spiral', mouth: 'o' } : { eyes: 'wide', mouth: 'teeth' }, t }); if (f > .6) star5(ctx, x + 60, 560, 26, t * 3); }
    ctx.restore(); ctx.restore();
  }
} });
// O: "mas, em troca, eu tenho que arrancar só uma pontinha do selo"
SHOTS.push({ start: 37.65, end: 42.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const zoom = kf(lt, [[0, .95], [1.8, 1.0], [2.4, 1.5], [4.3, 1.6]]);
  const cam = { x: 540 + hh[0] + (zoom - 1) * 60, y: kf(lt, [[1.8, 960], [2.4, 720]]) + hh[1], z: zoom, r: 0 };
  const curl = kf(lt, [[2.9, 0], [3.4, 1, backOut]]);
  cageScene(ctx, t, cam, { glow: .5 + curl * .4, behind: c => drawFoxEyes(c, 540, 300, .8, .8, 1, [0, .6]), cage: { sealY: 720, sealS: 1.1, curl, sealGlow: curl } });
  applyCam(ctx, cam, 1);
  const reach = kf(lt, [[.2, 0], [1.2, 1]]);
  drawClaw(ctx, lerp(1300, 840, reach), lerp(1500, 980, reach), .75, -.75, t);
  if (curl > .5) { for (let i = 0; i < 4; i++) sparkle(ctx, 640 + Math.cos(t * 3 + i * 1.6) * 90, 880 + Math.sin(t * 3 + i * 1.6) * 60, 18, .8); }
} });
// P: "O que eu faço? Você decide o Dia 3 nos comentários"
SHOTS.push({ start: 42.0, end: 44.5, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .02, r: 0 };
  ctx.save(); ctx.filter = 'blur(8px) saturate(.6)'; cageScene(ctx, t, { x: 540, y: 760, z: 1.3 }, { glow: .4, cage: { sealY: 620, sealS: 1 } }); ctx.restore();
  applyCam(ctx, cam, 1);
  drawStick(ctx, NZ(t, { x: 540, y: 2130, s: 1700, shadow: false, arms: { L: [.2, -.1], R: [.2, -.1] }, headTilt: Math.sin(t * 2) * .05,
    face: { eyes: 'normal', look: [Math.sin(t * 3) * .7, -.5], mouth: 'flat', browAng: -.25, browOne: 1 } }));
  for (let i = 0; i < 3; i++) { const k = backOut(clamp((lt - .1 - i * .15) / .25)); if (k > 0) { ctx.save(); ctx.translate([250, 830, 860][i], [520, 470, 700][i]); ctx.scale(k, k); ctx.rotate([-.25, .2, .3][i]); text(ctx, '?', 0, 0, 170, '#ffe14d', INK, 18); ctx.restore(); } }
  sticker(ctx, 'VOCÊ DECIDE', 540, 300, 96, '#e0392f', '#fff', -.04, backOut(clamp((lt - .6) / .3)));
} });
// Q: the two choices
SHOTS.push({ start: 44.5, end: 55.0, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .006, r: 0 };
  const h1 = t < 49.55 ? clamp((t - 44.55) / .25) : clamp(1 - (t - 49.55) / .25);
  const h2 = clamp((t - 49.65) / .25);
  ctx.save(); ctx.filter = 'blur(5px)'; cageScene(ctx, t, { x: 540, y: 900, z: 1.1 }, { glow: .3 + h1 * .6, cage: { sealY: 420, sealS: .9, curl: h1 * .7, sealGlow: h1 } }); ctx.restore();
  darkness(ctx, .35);
  applyCam(ctx, cam, 1);
  aura(ctx, 540, 2150, 1300, t, h1 * .9, CHAKRA_R); aura(ctx, 540, 2150, 1300, t, h2 * .8, CHAKRA_B);
  drawStick(ctx, NZ(t, { x: 540, y: 2150, s: 720, back: true, shadow: false, arms: h2 > .5 ? { L: [.3, -.2], R: [2.6, .2] } : POSE.idle.arms }));
  const in1 = backOut(clamp((lt - .05) / .3)), in2 = backOut(clamp((lt - .2) / .3));
  ctx.save(); ctx.translate(540, 0); ctx.scale(in1, 1); ctx.translate(-540, 0);
  choiceCard(ctx, 540, 640, 900, 250, 1, ['ACEITO O ACORDO', 'manto vermelho já'], '#e0392f', h1, t); ctx.restore();
  ctx.save(); ctx.translate(540, 0); ctx.scale(in2, 1); ctx.translate(-540, 0);
  choiceCard(ctx, 540, 960, 900, 250, 2, ['RECUSO O ACORDO', 'respeito na raça'], '#2f63c9', h2, t); ctx.restore();
  sticker(ctx, 'COMENTA 1 OU 2', 540, 300, 74, '#f2b52a', INK, .03, 1);
} });
// R: CTA : eyes flash red, follow
SHOTS.push({ start: 55.0, end: 60.0, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const red = lt > .35 && lt < 1.4;
  const sh = red ? shake(t, 8, 3) : [0, 0];
  const cam = { x: 540 + hh[0] + sh[0], y: 960 + hh[1] + sh[1], z: kf(lt, [[0, 1], [.35, 1.12, easeOut], [1.4, 1.12], [1.8, 1.0]]), r: 0 };
  ctx.save(); ctx.filter = 'blur(6px)'; drawForest(ctx, { x: 540, y: 960, z: 1.2 }, t, { ground: 1500 }); ctx.restore();
  applyCam(ctx, cam, 1);
  if (red) aura(ctx, 540, 2130, 2500, t, .8, CHAKRA_R);
  drawStick(ctx, NZ(t, { x: 540, y: 2130, s: 1700, shadow: false, arms: { L: [.2, -.1], R: [.2, -.1] }, face: red ? { eyes: 'normal', pupilCol: '#ff2a12', slit: true, mouth: 'grin', browAng: .5, look: [0, 0] } : { eyes: 'normal', look: [0, 0], mouth: lt > 2 ? 'grin' : 'smirk', browAng: .2 } }));
  redTint(ctx, red ? .3 : 0);
  sticker(ctx, 'DIA 3', 540, 300, 120, '#e0392f', '#fff', -.05, backOut(clamp((lt - 1.6) / .3)));
  const fk = backOut(clamp((lt - 2.75) / .3));
  if (fk > 0) {
    sticker(ctx, '+ SEGUIR', 540, 1580, 96, '#2f63c9', '#fff', 0, fk * (lt > 3.4 && lt < 3.6 ? .92 : 1));
    // tapping hand cursor
    const hx = kf(lt, [[2.9, 900], [3.35, 640]]), hy = kf(lt, [[2.9, 1800], [3.35, 1640]]);
    circle(ctx, hx, hy, 34); fillStroke(ctx, '#fff', 8);
    if (lt > 3.4) { const k = clamp((lt - 3.4) / .4); circle(ctx, hx, hy, 34 + k * 90); ctx.lineWidth = 8; ctx.strokeStyle = `rgba(255,255,255,${1 - k})`; ctx.stroke(); }
  }
  flash(ctx, kf(lt, [[.3, 0], [.38, .5], [.6, 0]]), '#ff5030');
} });
