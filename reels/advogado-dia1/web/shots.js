// ---------- characters ----------
const LAWYER = { cols: ['#2a3f8f', '#2a3f8f'], hat: 'hair', hairCol: '#3a2a22', tie: '#d42a2a', belt: false };
const BOSS = { cols: ['#f07a1a', '#f07a1a'], hat: 'bald', belt: false, num: '0001' };
const COP = { cols: ['#2f63c9', '#2f63c9'], hat: 'police' };
const WIT = { cols: PAL.green, hat: 'hair', hairCol: '#8a5a2a', belt: false };
const C = (base, extra) => Object.assign({}, base, extra);
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
// word time: first word in line li that contains str (or k-th word)
const WL = li => WORDS.filter(w => w.line === li);
const WT = (li, str) => { const ws = WL(li); if (typeof str === 'number') return ws[str].s; const w = ws.find(w => w.w.toLowerCase().includes(str)); return w ? w.s : ws[0].s; };
const LS = li => WL(li)[0].s;
const LE = li => { const ws = WL(li); return ws[ws.length - 1].e; };
const pen = (ctx, k, p) => { if (k !== 'R') return; line(ctx, p[0] - .01, p[1] + .02, p[0] + .05, p[1] - .09, .016, '#e8e8e8'); line(ctx, p[0] + .04, p[1] - .07, p[0] + .05, p[1] - .09, .016, INK); };
const seatedLegs = { L: [1.4, -1.5], R: [1.4, -1.5] };
const SHOTS = [];

// 0 — hook: POV over a fat folder stamped CULPADO, cuffed boss smiling across the table
SHOTS.push({ start: 0, end: LS(1) - .05, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.04 + lt * .03, r: Math.sin(t * .6) * .004 };
  roomBG(ctx, cam, { back: 1050, mirror: true, sign: false });
  applyCam(ctx, cam, .9); const la = drawLamp(ctx, 540, 120, 1, t, 1);
  applyCam(ctx, cam, 1);
  const lean = kf(lt, [[0, 0], [2.2, .03]]);
  drawStick(ctx, C(BOSS, { x: 540, y: 1560, s: 1000, shadow: false, lean, legs: seatedLegs,
    arms: { L: { ik: [-.13, -.4], bend: 1 }, R: { ik: [.13, -.4], bend: 1 } }, after: cuffs(),
    face: { eyes: lt > 1.8 ? 'half' : 'normal', mouth: lt > .9 ? 'grin' : 'smirk', browAng: -.25, look: [0, .2] } }));
  lampCone(ctx, 540, 120, la, 1400, .18);
  drawTable(ctx, 540, 1700, 1500, 640);
  drawFolder(ctx, 540, 1230, 900, 520);
  drawPaperSheet(ctx, 300, 1230, 340, 440, -.06, 8);
  drawPhoto(ctx, 690, 1130, 230, 260, .08, 0); drawPhoto(ctx, 800, 1300, 220, 240, -.12, 1); drawPhoto(ctx, 520, 1330, 200, 220, .1, 2);
  const s1 = WT(0, 'criminoso'), s2 = WT(0, 'perigoso');
  stamp(ctx, 420, 1180, .95, -.16, (lt - s1) / .25);
  stamp(ctx, 700, 1040, .7, .12, (lt - s2) / .25);
  const sh = Math.max(0, 1 - Math.abs(lt - s1 - .12) * 6) + Math.max(0, 1 - Math.abs(lt - s2 - .12) * 6);
  if (sh > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); }
  bigTitle(ctx, 'DIA 1', 540, 300, 150, (lt - .05) / .3, '#ffe14d', -.04);
} });
// 1 — the rap sheet: 50+ crimes
SHOTS.push({ start: LS(1) - .05, end: LS(2) - .05, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1] + lt * 30, z: 1 + lt * .04, r: -.02 };
  applyCam(ctx, cam, .2); ctx.fillStyle = '#e8b95a'; ctx.fillRect(-500, -500, 2100, 2900);
  applyCam(ctx, cam, 1);
  ctx.save(); ctx.translate(540, 980); ctx.rotate(-.03);
  rrect(ctx, -400, -760, 800, 1560, 14); fillStroke(ctx, '#fbf8f0', 7);
  rrect(ctx, -360, -720, 280, 330, 8); fillStroke(ctx, '#c9d3dc', 6);
  ctx.save(); rrect(ctx, -360, -720, 280, 330, 8); ctx.clip(); for (let i = 0; i < 6; i++) line(ctx, -360, -700 + i * 55, -80, -700 + i * 55, 3, '#9aa5b0');
  drawStick(ctx, C(BOSS, { x: -220, y: -170, s: 420, shadow: false, face: { eyes: 'half', mouth: 'smirk', browAng: -.3 } })); ctx.restore();
  text(ctx, 'FICHA CRIMINAL', 140, -680, 50, INK, INK, 0, 'Poppins', 700);
  for (let i = 0; i < 3; i++) line(ctx, -40, -600 + i * 60, 350 - i * 50, -600 + i * 60, 8, '#b9b3a6');
  const n = Math.floor(clamp((lt - .1) / 1.6) * 14);
  for (let i = 0; i < n; i++) { const y = -330 + i * 56; circle(ctx, -330, y, 14); ctx.fillStyle = '#d42a2a'; ctx.fill(); line(ctx, -290, y, 260 - (i * 37 % 140), y, 9, '#8a8478'); }
  ctx.restore();
  const cnt = Math.min(50, Math.floor(clamp((lt - .1) / 1.6) * 50));
  const k = (lt - .1) / .25;
  if (k > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(800, 470); ctx.rotate(.12); burst(ctx, 0, 0, 200 * backOut(clamp(k)), 12, '#ffd23a', 4); ctx.restore(); bigTitle(ctx, cnt >= 50 ? '50+' : String(cnt), 800, 470, 130, k, '#d42a2a', .12); }
} });
// 2 — the offer: briefcase of cash slides across the table
SHOTS.push({ start: LS(2) - .05, end: LS(3) - .05, tr: 'whip', draw(ctx, lt, t) {
  const t10 = WT(2, '10') - LS(2) + .05;
  const hh = handheld(t, 4); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1], [t10, 1.04], [t10 + .4, 1.12, backOut], [4.4, 1.16]]), r: 0 };
  roomBG(ctx, cam, { back: 1000, sign: false });
  applyCam(ctx, cam, 1);
  const sh = t10 > 0 ? shake(lt, Math.max(0, 1 - (lt - t10) * 3) * 14 * (lt > t10 ? 1 : 0)) : [0, 0]; ctx.translate(sh[0], sh[1]);
  const shock = lt > t10;
  drawStick(ctx, C(LAWYER, { x: 210, y: 1380, s: 620, legs: seatedLegs, lean: shock ? -.12 : 0, arms: shock ? POSE.handsUp.arms : { L: [.5, -.4], R: [.6, -.9] },
    face: shock ? { eyes: 'wide', mouth: 'o', browUp: 1, look: [.5, .3] } : { eyes: 'normal', mouth: 'flat', look: [.6, 0] } }));
  drawStick(ctx, C(BOSS, { x: 880, y: 1380, s: 640, legs: seatedLegs, flip: -1, lean: -.05,
    arms: { L: { ik: [-.1, -.4] }, R: { ik: [kf(lt, [[0, .1], [1.6, .45]]), -.38] } }, after: cuffs(), face: { eyes: 'half', mouth: 'grin', look: [-.5, 0], browAng: -.25 } }));
  drawTable(ctx, 540, 1150, 1100, 150, 600);
  const bx = kf(lt, [[0, 1250], [1.4, 560, easeOut]]);
  const op = kf(lt, [[t10 - .1, 0], [t10 + .2, 1, backOut]]);
  drawBriefcase(ctx, bx, 900, .9, op);
  if (op > .5) for (let i = 0; i < 7; i++) { const a = lt - t10 - i * .12; if (a > 0) drawCash(ctx, 560 + Math.sin(i * 2.1) * 300 + a * 40 * (i % 2 ? 1 : -1), 760 - a * 500 + a * a * 420, .7, a * 4 + i); }
  bigTitle(ctx, '$10.000.000', 540, 360, 120, (lt - t10) / .3, '#7fe07a', -.03);
  if (shock) { sweat(ctx, 370, 700, 34, clamp((lt - t10 - .2) * 3)); }
} });
// 3 — wide: locked in a maximum security room, face to face with the boss
SHOTS.push({ start: LS(3) - .05, end: LS(4) - .05, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0] + lt * 6, y: 900 + hh[1], z: .9 + lt * .045, r: 0 };
  roomBG(ctx, cam, { back: 1080 });
  applyCam(ctx, cam, 1);
  drawDoor(ctx, -40, 1080, 300, 620);
  drawCCTV(ctx, 990, 130, 1, .5 + Math.sin(t * .8) * .2, t);
  const la = drawLamp(ctx, 540, 220, 1, t, .6);
  const cy = 1330;
  drawStick(ctx, C(LAWYER, { x: 300, y: cy, s: 520, legs: seatedLegs, arms: { L: [.6, -.9], R: { ik: [.3, -.45] } }, prop: pen, face: { eyes: lt > 3 ? 'wide' : 'normal', mouth: lt > 3 ? 'frown' : 'flat', look: [.7, 0] } }));
  drawStick(ctx, C(BOSS, { x: 790, y: cy, s: 560, legs: seatedLegs, flip: -1, arms: { L: { ik: [-.12, -.42] }, R: { ik: [.12, -.42] } }, after: cuffs(), face: { eyes: 'half', mouth: 'smirk', look: [-.6, 0] } }));
  lampCone(ctx, 540, 220, la, 1100, .2);
  drawTable(ctx, 545, 1150, 820, 110, 500);
  drawPaperSheet(ctx, 430, 1100, 160, 90, .1, 3);
  // crown over the boss on "império"
  const ki = (lt - (WT(3, 'império') - LS(3))) / .3;
  if (ki > 0) { ctx.save(); ctx.translate(790, 790 - Math.sin(t * 3) * 8); const sc = backOut(clamp(ki)); ctx.scale(sc, sc); path(ctx, [[-80, 0], [-90, -90], [-40, -40], [0, -110], [40, -40], [90, -90], [80, 0]]); fillStroke(ctx, '#f2c230', 7); ctx.restore(); }
  const kd = (lt - .05) / .2; if (kd > 0 && lt < 1) { const p = shake(lt, (1 - clamp(lt * 2)) * 10); ctx.setTransform(1, 0, 0, 1, p[0], p[1]); }
} });
// 4 — evidence montage: audio, video, witnesses
SHOTS.push({ start: LS(4) - .05, end: LS(5) - .05, tr: 'whip', draw(ctx, lt, t) {
  const tA = WT(4, 'áudios') - LS(4), tV = WT(4, 'vídeos') - LS(4), tW = WT(4, 'testemunhas') - LS(4);
  const hh = handheld(t, 4); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + (lt % 1) * .06, r: 0 };
  const seg = lt < tV - .05 ? 0 : lt < tW - .05 ? 1 : 2;
  applyCam(ctx, cam, .2); ctx.fillStyle = ['#2a3f8f', '#3a2a5a', '#5a2a2a'][seg]; ctx.fillRect(-500, -500, 2100, 2900);
  for (let i = 0; i < 12; i++) { ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(-500 + i * 200 + (t * 60 % 200), -500, 90, 2900); }
  applyCam(ctx, cam, 1);
  if (seg === 0) {
    screenFrame(ctx, 540, 760, 820, 480); waveform(ctx, 540, 760, 700, 300, t);
    text(ctx, '▶ ÁUDIO 07', 540, 1100, 64, '#fff', INK, 12);
    circle(ctx, 300, 1100, 0);
  } else if (seg === 1) {
    screenFrame(ctx, 540, 760, 820, 560, '#0d1a12');
    ctx.save(); rrect(ctx, 130, 480, 820, 560, 10); ctx.clip();
    drawStick(ctx, C(BOSS, { x: 420 + (lt - tV) * 120, y: 1000, s: 380, legs: walkLegs(lt, 9), sil: '#5fbf7a', shadow: false }));
    drawStick(ctx, { x: 750, y: 1000, s: 360, sil: '#4a9a62', arms: POSE.handsUp.arms, shadow: false });
    ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 40; i++) ctx.fillRect(130, 480 + i * 14 + (t * 40 % 14), 820, 5); ctx.restore();
    if (Math.sin(t * 7) > 0) { circle(ctx, 200, 540, 16); ctx.fillStyle = '#ff3030'; ctx.fill(); text(ctx, 'REC', 260, 541, 36, '#ff3030', INK, 0, 'Poppins', 700, 'left'); }
    text(ctx, 'CAM 03', 540, 1110, 64, '#fff', INK, 12);
  } else {
    const k = lt - tW;
    for (let i = 0; i < 3; i++) { const a = (k - i * .18) / .25; if (a <= 0) continue;
      const x = 250 + i * 290, y = 1180 + (1 - backOut(clamp(a))) * 300;
      drawStick(ctx, C(WIT, { x, y, s: 440, cols: [PAL.green, PAL.purple, PAL.yellow][i], arms: { L: [.3, -.1], R: [1.9, 0] }, face: { eyes: 'wide', mouth: 'o', browUp: 1 } }));
      bigTitle(ctx, '!', x + 50 + cam.x - 540, 620 - i * 20, 120, a, '#ffe14d');
    }
  }
  const cutK = [tA, tV, tW].map(c => Math.max(0, 1 - Math.abs(lt - c) * 10)); flash(ctx, Math.max(...cutK) * .5);
} });
// 5 — the law: the scale crashes down on "CULPADO"
SHOTS.push({ start: LS(5) - .05, end: LS(6) - .05, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .04, r: 0 };
  applyCam(ctx, cam, .2); drawSky(ctx, '#3b4a6a', '#7a8aa8', -400, 1900);
  applyCam(ctx, cam, .5); ctx.fillStyle = '#c9b48a'; for (let i = 0; i < 6; i++) { rrect(ctx, -80 + i * 230, 280, 110, 1400, 10); ctx.fill(); }
  applyCam(ctx, cam, 1);
  const tI = WT(5, 'impossível') - LS(5);
  const tilt = kf(lt, [[0, 0], [.5, .08], [.8, -.05], [tI, .02], [tI + .25, .42, backOut]]);
  drawScale(ctx, 540, 1180, 1.25, tilt);
  const L = scalePan(540, 1180, 1.25, tilt, -1), Rr = scalePan(540, 1180, 1.25, tilt, 1);
  // feather on the "innocent" pan, case files raining on the guilty one
  ctx.save(); ctx.translate(L[0], L[1] - 30); ctx.rotate(-.4); ellipse(ctx, 0, 0, 16, 60); fillStroke(ctx, '#fff', 5); ctx.restore();
  for (let i = 0; i < 6; i++) { const a = lt - .2 - i * .35; if (a < 0) continue; const fy = Math.min(Rr[1] - 40 - i * 34, -200 + a * a * 4000); drawPaperSheet(ctx, Rr[0] + ((i % 3) - 1) * 30, fy, 220, 40, (i % 2 ? .05 : -.05), 0, ['#e8b95a', '#fbf8f0', '#d9a54a'][i % 3]); }
  text(ctx, 'INOCENTE', L[0], L[1] + 110, 46, '#fff', INK, 10); text(ctx, 'CULPADO', Rr[0], Rr[1] + 110, 52, '#ff5a4a', INK, 10);
  if (lt > tI + .1) { const k = 1 - clamp((lt - tI - .1) * 3); const p = shake(lt, k * 16); ctx.setTransform(1, 0, 0, 1, p[0], p[1]); burst(ctx, Rr[0], Rr[1] + 10, 120 * (1 - k * .5), 10, '#ffd23a', 3); }
  bigTitle(ctx, '0% DE CHANCE', 540, 330, 96, (lt - tI - .1) / .3, '#ff5a4a', -.03);
} });
// 6 — lawyer opens his mouth, boss leans across the table
SHOTS.push({ start: LS(6) - .05, end: LS(7) - .05, tr: 'cut', draw(ctx, lt, t) {
  const tL = WT(6, 'inclina') - LS(6);
  const lean = ease(clamp((lt - tL) / .7));
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1] - lean * 40, z: 1 + lean * .18 + lt * .02, r: lean * -.02 };
  roomBG(ctx, cam, { back: 1000, sign: false, wall: mix('#5f6f80', '#2a2f3a', lean) });
  applyCam(ctx, cam, .9); const la = drawLamp(ctx, 560, 60, .9, t, 1 + lean * 2);
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(BOSS, { x: 640, y: lerp(1520, 1650, lean), s: lerp(820, 1350, lean), legs: seatedLegs, lean: lean * .12, shadow: false,
    arms: { L: { ik: [-.16, -.42] }, R: { ik: [.16, -.42] } }, after: cuffs(),
    face: { eyes: lean > .5 ? 'half' : 'normal', mouth: lean > .3 ? 'smirk' : 'flat', look: [-.3, .1], browAng: -.3 * lean } }));
  lampCone(ctx, 560, 60, la, 1500, .14 + lean * .1);
  drawTable(ctx, 540, 1720, 1500, 360, 400);
  // lawyer over-the-shoulder, front-left
  const talk = lt < tL ? Math.sin(lt * 18) > 0 : false;
  drawStick(ctx, C(LAWYER, { x: 150, y: 2100 + lean * 80, s: 1000, shadow: false, flip: 1, headTilt: -.1,
    arms: { L: [.3, -.2], R: { ik: [.42, -.55] } }, prop: pen,
    face: { eyes: lean > .4 ? 'wide' : 'normal', mouth: lt < .3 ? 'flat' : lean > .4 ? 'frown' : (talk ? 'o' : 'flat'), look: [.8, -.3], browUp: lean } }));
  if (lean > .4) sweat(ctx, 300, 1150, 40, clamp((lean - .4) * 3));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(540, 800, 300, 540, 900, 1200); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${.5 * lean})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
} });
// 7 — "Doutor, se eu sair livre, você aposenta hoje" + beach daydream
SHOTS.push({ start: LS(7) - .05, end: LS(8) - .05, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 2); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .03, r: 0 };
  applyCam(ctx, cam, .3); ctx.fillStyle = '#262b36'; ctx.fillRect(-500, -500, 2100, 2900);
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(BOSS, { x: 560, y: 2350, s: 1650, shadow: false, headTilt: .05, arms: { L: [.2, -.1], R: [.2, -.1] },
    face: { eyes: 'half', mouth: Math.sin(lt * 16) > .2 && lt < 2.3 ? 'grin' : 'smirk', look: [0, 0], browAng: -.2, browOne: 1 } }));
  const tA = WT(7, 'você') - LS(7);
  thoughtBubble(ctx, 540, 400, 820, 520, clamp((lt - tA + .3) / .3), c => {
    c.translate(-540, -400);
    drawSky(c, '#45b5f0', '#bfeafb', 140, 660); c.fillStyle = '#ffd86b'; circle(c, 820, 230, 60); c.fill();
    drawSea(c, 480, t); c.fillStyle = '#f2d59a'; c.beginPath(); c.moveTo(100, 700); c.quadraticCurveTo(540, 520, 1000, 700); c.fill();
    c.save(); c.translate(820, 610); line(c, 0, 0, -30, -200, 10, '#8a5a2a'); for (let i = 0; i < 5; i++) { c.save(); c.translate(-30, -200); c.rotate(-1.4 + i * .7); ellipse(c, 60, 0, 70, 18); fillStroke(c, '#3fa35b', 5); c.restore(); } c.restore();
    drawStick(c, C(LAWYER, { x: 470, y: 640, s: 300, tie: false, cols: ['#ff6aa0', '#fff'], arms: POSE.handsUp.arms, face: { eyes: 'happy', mouth: 'grin' }, bob: Math.sin(t * 8) * .01 }));
    for (let i = 0; i < 6; i++) { const yy = 200 + ((t * 120 + i * 90) % 450); drawCash(c, 220 + i * 120, yy, .4, t * 3 + i); }
  });
  for (let i = 0; i < 3; i++) circle(ctx, 640 + i * 40, 700 + i * 50, 22 - i * 6), fillStroke(ctx, '#fff', 6);
} });
// 8 — "...gente lá fora": henchmen silhouettes appear, red light
SHOTS.push({ start: LS(8) - .05, end: LS(9) - .05, tr: 'whip', draw(ctx, lt, t) {
  const tG = WT(8, 'gente') - LS(8);
  const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1.05 + lt * .03, r: 0 };
  applyCam(ctx, cam, .3); ctx.fillStyle = '#1a1418'; ctx.fillRect(-500, -500, 2100, 2900);
  const g = ctx.createRadialGradient(540, 700, 50, 540, 700, 900); g.addColorStop(0, '#5a1a1e'); g.addColorStop(1, '#14080a'); ctx.fillStyle = g; ctx.fillRect(-500, -500, 2100, 2900);
  applyCam(ctx, cam, .7);
  const pos = [[150, 1150, 560], [930, 1150, 560], [330, 1050, 480], [760, 1050, 480], [540, 980, 420]];
  pos.forEach(([x, y, s], i) => { const a = clamp((lt - tG - i * .22) / .3); if (a <= 0) return;
    drawStick(ctx, { x, y: y + (1 - a) * 60, s, sil: '#050304', eyesGlow: true, alpha: a, arms: i % 2 ? { L: [.9, -2.2], R: [.9, -2.2] } : POSE.idle.arms, face: { eyes: 'squint' } }); });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(BOSS, { x: 540, y: 1900, s: 1250, shadow: false, arms: { L: { ik: [-.14, -.4] }, R: { ik: [.14, -.4] } }, after: cuffs(),
    face: { eyes: lt > tG ? 'half' : 'normal', mouth: 'smirk', browAng: -.35, look: [0, .1] } }));
  redTint(ctx, .25 + clamp((lt - tG) / 1) * .25);
  const tI = WT(8, 'incompetente') - LS(8);
  bigTitle(ctx, 'INCOMPETENTE?', 540, 320, 100, (lt - tI) / .3, '#ff5a4a', .04);
} });
// 9 — cornered: lawyer sweating, pen in hand, freeze frame, "você decide"
SHOTS.push({ start: LS(9) - .05, end: LS(11) - .05, tr: 'whip', draw(ctx, lt, t) {
  const tF = WT(9, 'que') - LS(9); const fr = lt > tF;
  const tt = fr ? tF : lt; const tq = LS(10) - LS(9);
  const hh = handheld(fr ? tF + LS(9) : t, 4); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: fr ? 1.15 : 1 + lt * .1, r: fr ? -.03 : 0 };
  roomBG(ctx, cam, { back: 1100, sign: false, mirror: false });
  applyCam(ctx, cam, 1);
  drawStick(ctx, C(LAWYER, { x: 540, y: 2050, s: 1300, shadow: false, bob: Math.sin(tt * 20) * .003,
    arms: { L: [.3, -.2], R: { ik: [.3, -.62], bend: 1 } }, prop: pen,
    face: { eyes: 'wide', mouth: 'teeth', look: [Math.sin(tt * 7) * .7, 0], browUp: 1, browAng: -.2 } }));
  for (let i = 0; i < 4; i++) sweat(ctx, [300, 800, 760, 330][i], 520 + ((tt * 140 + i * 70) % 260), 36 - i * 4, 1);
  if (fr) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = 'rgba(128,128,128,.85)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    flash(ctx, 1 - clamp((lt - tF) * 5));
    for (let i = 0; i < 3; i++) bigTitle(ctx, '?', [250, 540, 830][i], [330, 250, 330][i] + Math.sin(t * 4 + i) * 12, 160, (lt - tF - i * .12) / .25, '#ffe14d', (i - 1) * .2);
    bigTitle(ctx, 'VOCÊ DECIDE', 540, 1560, 110, (lt - tq) / .3, '#fff', -.03);
    bigTitle(ctx, 'O DIA 2', 540, 1680, 90, (lt - tq - .2) / .3, '#ffe14d', -.03);
  }
} });
// option helper
function optionShot(num, label, line, drawScene) {
  SHOTS.push({ start: LS(line) - .05, end: LS(line + 1) - .05, tr: 'whip', draw(ctx, lt, t) {
    const hh = handheld(t, 3); const cam = { x: 540 + hh[0], y: 960 + hh[1], z: 1 + lt * .03, r: 0 };
    drawScene(ctx, lt, t, cam);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 1; i <= 3; i++) { const on = i === num; const a = clamp(lt / .25); if (!on) continue; choiceBox(ctx, 540, 300, 860, 150, i, label, 1, a); }
    text(ctx, `OPÇÃO ${num}`, 540, 190, 44, '#ffe14d', INK, 10);
  } });
}
// 10 — option 1: legal loophole
optionShot(1, 'brecha na lei', 11, (ctx, lt, t, cam) => {
  applyCam(ctx, cam, .2); drawSky(ctx, '#2f63c9', '#7fb3ef', -400, 1900);
  applyCam(ctx, cam, 1);
  ctx.save(); ctx.translate(560, 830); ctx.rotate(-.04); rrect(ctx, -280, -300, 560, 640, 12); fillStroke(ctx, '#fbf8f0', 7);
  text(ctx, 'LEI', 0, -240, 60, INK, INK, 0); for (let i = 0; i < 9; i++) line(ctx, -230, -170 + i * 52, 230 - (i % 3) * 40, -170 + i * 52, 8, '#b9b3a6');
  const crack = clamp((lt - 1.6) / .4); if (crack > 0) { ctx.beginPath(); ctx.moveTo(-40, -50); ctx.lineTo(10, 30); ctx.lineTo(-20, 80); ctx.lineTo(40, 180 * crack + 0); ctx.lineWidth = 12; ctx.strokeStyle = '#d42a2a'; ctx.stroke(); sparkle(ctx, 10, 30, 60 * crack, crack); }
  ctx.restore();
  // evidence flying away
  const tP = WT(11, 'provas') - LS(11);
  for (let i = 0; i < 5; i++) { const a = lt - tP - i * .08; if (a < 0) { drawPhoto(ctx, 250 + i * 140, 1150, 120, 140, (i - 2) * .1, i); continue; } drawPhoto(ctx, 250 + i * 140 + a * (i - 2) * 500, 1150 - a * 1400, 120, 140, (i - 2) * .1 + a * 6, i); }
  const mx = 560 + Math.sin(lt * 2) * 120, my = 780 + Math.cos(lt * 1.6) * 80;
  circle(ctx, mx, my, 120); ctx.fillStyle = 'rgba(200,240,255,.35)'; ctx.fill(); ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.stroke(); line(ctx, mx + 85, my + 85, mx + 230, my + 230, 34, '#8a4f24');
  drawStick(ctx, C(LAWYER, { x: 190, y: 1230, s: 460, arms: { L: [.3, -.1], R: { ik: [.4, -.7] } }, face: { eyes: 'squint', mouth: 'smirk', look: [.8, -.2] } }));
});
// 11 — option 2: secret deal with the police, then vanish
optionShot(2, 'acordo secreto', 12, (ctx, lt, t, cam) => {
  const tS = WT(12, 'sumo') - LS(12);
  applyCam(ctx, cam, .2); drawSky(ctx, '#1d2a4a', '#3a4f7a', -400, 1900);
  applyCam(ctx, cam, .5); for (let i = 0; i < 7; i++) { rrect(ctx, -100 + i * 190, 600 - (i * 97 % 300), 160, 1400, 6); ctx.fillStyle = '#141c30'; ctx.fill(); for (let j = 0; j < 8; j++) { ctx.fillStyle = (i + j) % 3 ? '#f2d36b' : '#2a3450'; ctx.fillRect(-70 + i * 190, 650 - (i * 97 % 300) + j * 90, 40, 40); } }
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#2a2f3a'; ctx.fillRect(-300, 1150, 1700, 1000);
  if (lt < tS) {
    const shake2 = Math.sin(lt * 14) * .08;
    drawStick(ctx, C(COP, { x: 760, y: 1220, s: 520, flip: -1, arms: { L: [.3, -.1], R: { ik: [.42, -.35 + shake2 * .2] } }, face: { eyes: 'normal', mouth: 'smirk', look: [-.6, 0] } }));
    drawStick(ctx, C(LAWYER, { x: 330, y: 1220, s: 500, lean: .08, arms: { L: { ik: [-.05, -.75], bend: -1 }, R: { ik: [.42, -.35 - shake2 * .2] } }, face: { eyes: 'normal', mouth: 'o', look: [.7, 0] } }));
    text(ctx, 'psiu...', 330, 560, 60, '#fff', INK, 10);
  } else {
    const k = lt - tS; const x = 330 + k * 1400;
    drawStick(ctx, C(COP, { x: 760, y: 1220, s: 520, flip: -1, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'wide', mouth: 'o', look: [.6, 0] } }));
    drawStick(ctx, C(LAWYER, { x, y: 1220 - Math.abs(Math.sin(k * 16)) * 30, s: 500, lean: .25, legs: walkLegs(k, 22, .8), arms: { L: [2.2, .2], R: [.6, -.3] }, face: { eyes: 'wide', mouth: 'grin' },
      prop: (c, kk, p) => { if (kk === 'R') { c.save(); c.translate(p[0], p[1] + .08); c.scale(.0006, .0006); drawBriefcase(c, 0, 0, 1, 0); c.restore(); } } }));
    for (let i = 0; i < 4; i++) puff(ctx, x - 200 - i * 140, 1200, 50 + i * 12, t, '#cfc6b4', 3 + i, clamp(1 - i * .2));
  }
});
// 12 — option 3: take the 10 million, silence the witnesses
optionShot(3, 'aceito os 10 mi', 13, (ctx, lt, t, cam) => {
  const tS = WT(13, 'silencio') - LS(13);
  applyCam(ctx, cam, .2); const g = ctx.createLinearGradient(0, 0, 0, 1900); g.addColorStop(0, '#3a1018'); g.addColorStop(1, '#14080a'); ctx.fillStyle = g; ctx.fillRect(-500, -500, 2100, 2900);
  applyCam(ctx, cam, 1);
  for (let i = 0; i < 10; i++) drawCash(ctx, 100 + (i * 137 % 900), (t * 300 + i * 190) % 1500 + 380, .8, t * 2 + i);
  drawStick(ctx, C(BOSS, { x: 790, y: 1250, s: 520, flip: -1, arms: { L: [.3, -.1], R: { ik: [.4, -.4] } }, face: { eyes: 'half', mouth: 'grin', look: [-.6, 0] } }));
  drawStick(ctx, C(LAWYER, { x: 300, y: 1250, s: 520, arms: { L: { ik: [-.25, -.5] }, R: { ik: [.4, -.4] } }, face: { eyes: lt > tS ? 'half' : 'happy', mouth: lt > tS ? 'smirk' : 'grin', look: [.6, 0] },
    prop: (c, kk, p) => { if (kk === 'L') { for (let i = 0; i < 3; i++) { c.save(); c.translate(p[0], p[1] - i * .02); c.scale(.0012, .0012); drawCash(c, 0, 0, 1, -.3); c.restore(); } } } }));
  if (lt > tS) {
    const k = lt - tS;
    for (let i = 0; i < 3; i++) { const a = clamp((k - i * .15) / .25); if (a <= 0) continue; const x = 230 + i * 310, y = 860;
      ctx.save(); ctx.globalAlpha = a; rrect(ctx, x - 120, y - 170, 240, 300, 10); fillStroke(ctx, '#fbf8f0', 6);
      drawStick(ctx, C(WIT, { x, y: y + 300, s: 340, shadow: false, cols: [PAL.green, PAL.purple, PAL.yellow][i], face: { eyes: 'wide', mouth: 'flat' } }));
      line(ctx, x - 50, y - 25, x + 50, y - 25, 22, INK); line(ctx, x - 50, y - 25, x + 50, y - 25, 10, '#d9d0c0'); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(x - 120, y - 170, 240, 300); ctx.restore(); }
    text(ctx, 'shhh', 540, 600, 80, '#fff', INK, 12);
  }
});
// 13 — CTA: gavel slam, most liked comment decides Day 2
SHOTS.push({ start: LS(14) - .05, end: LE(14) + 1.2, tr: 'cut', draw(ctx, lt, t) {
  const hit = .35;
  const sk = lt > hit ? shake(lt, Math.max(0, 1 - (lt - hit) * 3) * 26) : [0, 0];
  const cam = { x: 540 + sk[0], y: 960 + sk[1], z: 1 + lt * .02, r: 0 };
  applyCam(ctx, cam, .2); const g = ctx.createRadialGradient(540, 900, 50, 540, 900, 1300); g.addColorStop(0, '#7a3a1c'); g.addColorStop(1, '#2a120a'); ctx.fillStyle = g; ctx.fillRect(-500, -500, 2100, 2900);
  applyCam(ctx, cam, 1);
  speedLines(ctx, 540, 1000, lt > hit ? .7 * (1 - clamp((lt - hit) * 1.5)) : 0, t);
  drawBlock(ctx, 540, 1130, 1.3);
  const ang = kf(lt, [[0, -1.1], [hit, .2, easeIn], [hit + .15, .1], [hit + .5, .15]]);
  drawGavel(ctx, 640 + 200, 1050, 1.3, ang - Math.PI / 2 * .0 - .9);
  if (lt > hit) { const k = clamp((lt - hit) / .4); burst(ctx, 470, 1100, 160 + k * 120, 12, '#ffd23a', 6); flash(ctx, 1 - clamp((lt - hit) * 6)); }
  const tD = WT(14, 'define') - LS(14), tS = WT(14, 'segue') - LS(14);
  bigTitle(ctx, 'DIA 2', 540, 380, 180, (lt - tD) / .3, '#ffe14d', -.04);
  bigTitle(ctx, 'você decide', 540, 540, 70, (lt - tD - .2) / .3, '#fff', -.04);
  const ks = (lt - tS) / .3;
  if (ks > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 1620); const sc = backOut(clamp(ks)) * (1 + Math.sin(t * 6) * .03); ctx.scale(sc, sc);
    rrect(ctx, -260, -70, 520, 140, 70); fillStroke(ctx, '#ff3b5c', 9); heart(ctx, -170, 4, 1.1, '#fff'); text(ctx, 'SEGUE', 40, 4, 70, '#fff'); ctx.restore(); }
} });
