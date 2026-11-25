// ---------- MrBeast reel: shots in caption seconds ----------
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const point = { L: [.3, -.1], R: [1.75, -.05] };
const SHOTS = [];
const cam0 = (t, lt, z0 = 1, z1 = 1.06, dur = 3, x = 540, y = 960, a = 4) => { const h = handheld(t, a); return { x: x + h[0], y: y + h[1], z: lerp(z0, z1, clamp(lt / dur)), r: Math.sin(t * .6) * .004 }; };

// 0 — thrown out of the house (hook in action)
SHOTS.push({ start: 0, end: 3.65, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.08, 1.0, 3.6, 540, 980);
  const sh = lt > .55 && lt < .8 ? shake(t, 14) : [0, 0]; cam.x += sh[0]; cam.y += sh[1];
  houseFront(ctx, cam, t);
  applyCam(ctx, cam, .6);
  doorway(ctx, 540, 1195, kf(lt, [[0, .9], [2.2, .9], [2.45, 0, easeIn]]));
  // mom in the doorway, pointing out
  if (lt < 2.35) drawStick(ctx, P(MOM, { x: 560, y: 1190, s: 330, arms: lt > .3 ? point : { L: [.3, -.1], R: [.9, -2.1] }, face: { eyes: 'normal', mouth: 'teeth', browAng: -.4 }, shadow: false }));
  applyCam(ctx, cam, 1);
  // teen flies out with his camera, lands on the lawn
  const k = clamp(lt / .6), land = lt > .6;
  const x = lerp(540, 330, easeOut(k)), y = land ? 1250 : lerp(1180, 1250, k) - Math.sin(k * Math.PI) * 260;
  const sq = land ? kf(lt, [[.6, .75], [.85, 1, backOut]]) : 1;
  drawStick(ctx, P(JIMMY_KID, { x, y, s: 470, squash: sq, lean: land ? -.05 : -.5 + k * .4,
    arms: land ? { L: [.5, -.4], R: [2.3, .2] } : POSE.handsUp.arms, legs: land ? { L: [.25, -.1], R: [.25, -.1] } : { L: [.9, -1.1], R: [.5, -.8] },
    face: land ? { eyes: 'wide', mouth: 'o', look: [.7, -.3], browUp: 1 } : { eyes: 'x', mouth: 'teeth' } }));
  if (land) { const pa = kf(lt, [[.6, 1], [1.2, 0]]); puff(ctx, x - 160, 1230, 70 * (1 + lt - .6), t, '#efe3cf', 3, pa); puff(ctx, x + 160, 1230, 70 * (1 + lt - .6), t, '#efe3cf', 4, pa); }
  // suitcase + graduation cap thrown after him
  const sk = clamp((lt - 1.1) / .5); if (lt > 1.1) suitcase(ctx, lerp(560, 760, sk), lerp(1050, 1235, sk) - Math.sin(sk * Math.PI) * 200, .9, sk < 1 ? sk * 6 : .1);
  const ck = clamp((lt - 1.6) / .55); if (lt > 1.6) { ctx.save(); ctx.translate(lerp(600, 940, ck), lerp(1000, 1215, ck) - Math.sin(ck * Math.PI) * 300); ctx.rotate(ck * 9); path(ctx, [[-70, 0], [0, -30], [70, 0], [0, 30]]); fillStroke(ctx, '#2c2830', 6); ctx.restore(); }
  if (lt > 1.1 && lt < 2.3) label(ctx, 'FORA!', 760, 560, 110, '#ff4d4d', -.1, kf(lt, [[1.1, 0], [1.25, 1], [2.1, 1], [2.3, 0]]));
  if (lt > 2.45 && lt < 2.75) { burst(ctx, 540, 900, 130, 11, '#fff'); }
} });
// 1 — giant game set, money thrown in the air
SHOTS.push({ start: 3.65, end: 6.3, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.12, 1.0, 2.6, 540, 940);
  arenaBG(ctx, cam, t);
  applyCam(ctx, cam, .5);
  for (let i = 0; i < 7; i++) drawStick(ctx, P(PLAYER, { x: 110 + i * 145, y: 1110, s: 190, arms: POSE.handsUp.arms, bob: Math.abs(Math.sin(t * 9 + i)) * -.05, face: { eyes: 'wide', mouth: 'grin' } }));
  applyCam(ctx, cam, 1);
  drawStick(ctx, P(GUARD('o'), { x: 130, y: 1240, s: 430, arms: { L: [.2, -.1], R: [.2, -.1] } }));
  drawStick(ctx, P(GUARD('t'), { x: 950, y: 1240, s: 430, flip: -1, arms: { L: [.2, -.1], R: [.2, -.1] } }));
  const th = Math.abs(Math.sin(lt * 5));
  drawStick(ctx, P(JIMMY, { x: 540, y: 1260, s: 620, arms: { L: [2.2 + th * .6, .3], R: [2.2 + th * .6, .3] }, face: { eyes: 'happy', mouth: 'grin' }, bob: -th * .02 }));
  moneyRain(ctx, lt, 30, 4, -300, 1700);
} });
// 2 — title card
SHOTS.push({ start: 6.3, end: 8.05, tr: 'whip', draw(ctx, lt, t) {
  radial(ctx, 540, 820, t, '#3a8bf0', '#2a6fd6');
  const cam = cam0(t, lt, 1.0, 1.08, 1.8, 540, 960, 3); applyCam(ctx, cam, 1);
  const pop = backOut(clamp(lt / .35));
  ctx.save(); ctx.translate(540, 470); ctx.scale(pop, pop); ctx.rotate(-.05);
  label(ctx, 'MR', 0, -90, 170, '#fff'); label(ctx, 'BEAST', 0, 80, 210, '#ffd23a'); ctx.restore();
  drawStick(ctx, P(JIMMY, { x: 540, y: 1300, s: 640, arms: { L: [.9, -2.2], R: [2.6, .3] }, face: { eyes: 'normal', mouth: 'grin', browOne: 1 } }));
  for (let i = 0; i < 5; i++) sparkle(ctx, 200 + i * 170, 760 + Math.sin(i * 2) * 80, 40 * Math.abs(Math.sin(t * 3 + i)), 1);
} });
// 3 — 13 years old, gameplay in the bedroom, terrible mic
SHOTS.push({ start: 8.05, end: 12.55, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.0, 1.14, 4.5, 560, 960, 3);
  bedroom(ctx, cam, t);
  applyCam(ctx, cam, 1);
  desk(ctx, 600, 1060, 640);
  monitor(ctx, 700, 830, 380, 240, (c, w, h) => { blockGame(c, w, h, t); if (Math.floor(t * 2) % 2) { circle(c, 26, 24, 10); c.fillStyle = '#ff3b3b'; c.fill(); } text(c, 'REC', 64, 25, 22, '#fff', INK, 0, 'Poppins', 700); });
  cheapMic(ctx, 430, 1030, .8, t);
  drawStick(ctx, P(JIMMY_KID, { x: 330, y: 1300, s: 520, arms: { L: { ik: [.42, -.47] }, R: { ik: [.5, -.45] } }, face: { eyes: 'normal', look: [1, -.2], mouth: Math.floor(t * 6) % 2 ? 'o' : 'grin' } }));
  label(ctx, '13 anos', 220, 520, 80, '#fff', -.08, kf(lt, [[1.6, 0], [1.8, 1], [3.6, 1], [3.8, 0]]));
  // crackle bolts from the mic
  if (lt > 3.4 && Math.floor(t * 12) % 3 === 0) { burst(ctx, 470, 830, 46, 8, '#fff'); label(ctx, 'krrzz', 560, 700, 50, '#fff', .15); }
} });
// 4 — five years, nobody watching
SHOTS.push({ start: 12.55, end: 14.65, tr: 'whip', draw(ctx, lt, t) {
  ctx.fillStyle = '#1c1a22'; ctx.fillRect(0, 0, W, H);
  const cam = cam0(t, lt, 1.0, 1.06, 2.1, 540, 960, 3); applyCam(ctx, cam, 1);
  const year = Math.min(2017, 2012 + Math.floor(clamp(lt / 1.7) * 5.99));
  monitor(ctx, 540, 640, 820, 620, (c, w, h) => {
    c.fillStyle = '#f7f7f7'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) { const y = 30 + i * 145; c.fillStyle = ['#58b348', '#8a5a32', '#86c8ff', '#7d7d7d'][i]; c.fillRect(30, y, 250, 125); playButton(c, 155, y + 62, .45);
      rrect(c, 310, y + 18, 380, 26, 8); c.fillStyle = '#cfcfd6'; c.fill(); rrect(c, 310, y + 58, 260, 22, 8); c.fill();
      text(c, [3, 0, 7, 1][i] + ([3, 0, 7, 1][i] === 1 ? ' visualização' : ' visualizações'), 310, y + 105, 30, '#777', INK, 0, 'Poppins', 700, 'left'); }
  });
  counterPanel(ctx, 540, 1080, 420, 140, String(year), '#ffd23a');
  // tumbleweed
  const tx = kf(lt, [[0, -150], [2.1, 1250]], x => x); ctx.save(); ctx.translate(tx, 1220 - Math.abs(Math.sin(lt * 6)) * 60); ctx.rotate(lt * 8);
  for (let i = 0; i < 7; i++) { ctx.rotate(.9); ellipse(ctx, 0, 0, 60, 30); ctx.lineWidth = 6; ctx.strokeStyle = '#b98a4a'; ctx.stroke(); } ctx.restore();
} });
// 5 — obsessed with the algorithm
SHOTS.push({ start: 14.65, end: 19.1, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.0, 1.12, 4.4, 540, 940, 3);
  bedroom(ctx, cam, t, { night: true, wall: '#c99a4a' });
  applyCam(ctx, cam, .85);
  // conspiracy wall
  const R = rng(9); const notes = [];
  for (let i = 0; i < 9; i++) notes.push([140 + (i % 3) * 330 + R() * 60, 230 + Math.floor(i / 3) * 210 + R() * 40]);
  const nShow = Math.min(9, Math.floor(clamp(lt / 2.6) * 9) + 1);
  for (let i = 1; i < nShow; i++) line(ctx, notes[i - 1][0], notes[i - 1][1], notes[i][0], notes[i][1], 5, '#e0392f');
  notes.slice(0, nShow).forEach(([x, y], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate((i % 2 ? .06 : -.06)); rrect(ctx, -90, -70, 180, 140, 4); fillStroke(ctx, ['#fff6a8', '#bfe8ff', '#ffd0e0'][i % 3], 5);
    if (i % 3 === 0) { path(ctx, [[-60, 40], [-20, 0], [10, 20], [60, -40]], false); ctx.lineWidth = 7; ctx.strokeStyle = '#2f9a4a'; ctx.stroke(); }
    else if (i % 3 === 1) { text(ctx, ['CTR', 'RETENÇÃO', 'THUMB', 'TÍTULO'][i % 4], 0, 0, 30, INK, INK, 0, 'Poppins', 700); }
    else { playButton(ctx, 0, 0, .5); }
    circle(ctx, 0, -60, 10); ctx.fillStyle = '#e0392f'; ctx.fill(); ctx.restore(); });
  applyCam(ctx, cam, 1);
  drawStick(ctx, P(JIMMY_KID, { x: 540, y: 1330, s: 560, t, arms: { L: [.4, -.2], R: { ik: [.3, -.62 + Math.sin(t * 20) * .03] } }, face: { eyes: lt > 2.5 ? 'spiral' : 'wide', mouth: 'grin' },
    prop: (c, k, h) => { if (k === 'R') { c.save(); c.translate(h[0], h[1]); c.rotate(-.5); rrect(c, -.015, -.12, .03, .14, .008); fillStroke(c, '#e0392f', .012); c.restore(); } } }));
  // clock spinning days
  ctx.save(); ctx.translate(900, 1010); circle(ctx, 0, 0, 80); fillStroke(ctx, '#fff', 8); ctx.rotate(t * 12); line(ctx, 0, 0, 0, -60, 8); ctx.rotate(-t * 11); line(ctx, 0, 0, 40, 0, 8); ctx.restore();
  label(ctx, 'todo dia', 860, 1130, 54, '#ffd23a', .05, kf(lt, [[2.2, 0], [2.4, 1]]));
} });
// 6 — drops college, bets everything on the internet
SHOTS.push({ start: 19.1, end: 22.0, tr: 'whip', draw(ctx, lt, t) {
  radial(ctx, 540, 900, t, '#2fbf71', '#249a5b');
  const cam = cam0(t, lt, 1.0, 1.08, 2.9); applyCam(ctx, cam, 1);
  // college book flying into the bin
  rrect(ctx, 760, 1000, 220, 260, 18); fillStroke(ctx, '#8a929e', 9); line(ctx, 740, 1000, 1000, 1000, 14);
  const bk = clamp((lt - .3) / .6);
  if (bk < 1) { ctx.save(); ctx.translate(lerp(470, 870, bk), lerp(700, 980, bk) - Math.sin(bk * Math.PI) * 300); ctx.rotate(bk * 7); rrect(ctx, -90, -60, 180, 120, 8); fillStroke(ctx, '#c4453a', 7); text(ctx, 'FACULDADE', 0, 0, 26, '#fff', INK, 0, 'Poppins', 700); ctx.restore(); }
  // all-in: chips pushed toward a laptop
  const push = kf(lt, [[1.3, 0], [1.9, 1, backOut]]);
  rrect(ctx, 220, 860, 300, 200, 14); fillStroke(ctx, '#2c2830', 8); rrect(ctx, 240, 880, 260, 160, 6); fillStroke(ctx, '#3a8bf0', 5); playButton(ctx, 370, 960, .5);
  rrect(ctx, 170, 1060, 400, 30, 10); fillStroke(ctx, '#3b3540', 7);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { const x = lerp(720, 560, push) + (i % 3) * 70, y = 1170 - j * 22 - Math.floor(i / 3) * 0; ellipse(ctx, x + Math.floor(i / 3) * 35, y + Math.floor(i / 3) * 40, 32, 13); fillStroke(ctx, ['#e8343c', '#2f63c9', '#f2b52a'][i % 3], 5); }
  drawStick(ctx, P(JIMMY_KID, { x: 760, y: 1320, s: 520, flip: -1, arms: lt < 1.2 ? { L: [.3, -.1], R: [2.0 - bk, -.3] } : { L: { ik: [-.42 - push * .1, -.25] }, R: { ik: [-.4 - push * .12, -.3] } }, face: { eyes: 'normal', mouth: lt > 1.9 ? 'grin' : 'smirk', browAng: .3, look: [-1, .3] }, lean: -.12 * push }));
  label(ctx, 'ALL IN', 540, 520, 150, '#ffd23a', -.06, kf(lt, [[1.85, 0], [2.05, 1]]));
  if (lt > 1.85 && lt < 2.1) burst(ctx, 640, 1120, 150 * (lt - 1.85) * 6, 12, '#fff');
} });
// 7 — mom doesn't accept it: door slam, rain cloud
SHOTS.push({ start: 22.0, end: 24.65, tr: 'cut', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.15, 1.25, 2.6, 540, 1000);
  const slam = lt > 1.25 && lt < 1.6 ? shake(t, 18) : [0, 0]; cam.x += slam[0]; cam.y += slam[1];
  houseFront(ctx, cam, t, { rain: lt > 1.4 });
  applyCam(ctx, cam, .6);
  doorway(ctx, 540, 1195, kf(lt, [[0, .9], [1.1, .9], [1.3, 0, easeIn]]));
  if (lt < 1.2) drawStick(ctx, P(MOM, { x: 560, y: 1190, s: 330, arms: { L: [.9, -2.2], R: [.9, -2.2] }, face: { eyes: 'normal', mouth: 'frown', browAng: -.45 }, headTilt: Math.sin(t * 8) * .08, shadow: false }));
  applyCam(ctx, cam, 1);
  drawStick(ctx, P(JIMMY_KID, { x: 330, y: 1240, s: 420, arms: { L: [.15, -.05], R: [.15, -.05] }, face: lt > 1.3 ? { eyes: 'normal', look: [0, .6], mouth: 'frown', browAng: .35 } : { eyes: 'wide', mouth: 'o', look: [1, 0] } }));
  suitcase(ctx, 520, 1240, .7);
  if (lt > 1.3) rainCloud(ctx, 330, 520 + Math.sin(t * 2) * 10, 130, t);
  if (lt > 1.25 && lt < 1.55) burst(ctx, 540, 950, 150, 11, '#fff');
  label(ctx, 'SLAM!', 760, 640, 100, '#fff', .12, kf(lt, [[1.25, 0], [1.35, 1], [2.0, 1], [2.2, 0]]));
} });
// 8 — 2017: counting to 100,000 for 40+ hours
SHOTS.push({ start: 24.65, end: 31.0, tr: 'cut', draw(ctx, lt, t) {
  studioBG(ctx, { x: 540, y: 960, z: 1, r: 0 }, t, { top: '#1a1a2e', bot: '#2c2c4a', floor: '#1e1e30' });
  const cam = cam0(t, lt, 1.0, 1.15, 6.3, 540, 960, 3); applyCam(ctx, cam, 1);
  label(ctx, '2017', 540, 300, 120, '#ffd23a', 0, kf(lt, [[0, 0], [.2, 1], [1.9, 1], [2.2, 0]]));
  const cnt = lt < 2.3 ? 0 : Math.min(100000, Math.pow(clamp((lt - 2.3) / 3.8), 1.6) * 100000);
  const hrs = Math.min(40, Math.floor(clamp((lt - 2.3) / 3.8) * 40));
  counterPanel(ctx, 540, 520, 760, 210, fmt(cnt), '#ff3b3b', 130);
  if (lt > 2.3) { ctx.save(); ctx.translate(880, 760); circle(ctx, 0, 0, 70); fillStroke(ctx, '#fff', 7); ctx.rotate(lt * 20); line(ctx, 0, 0, 0, -52, 7); ctx.restore(); label(ctx, `${hrs}h`, 880, 880, 60, '#fff'); }
  // chair
  rrect(ctx, 330, 860, 220, 300, 30); fillStroke(ctx, '#3b3540', 8); rrect(ctx, 300, 1120, 280, 50, 16); fillStroke(ctx, '#4b4450', 8); line(ctx, 440, 1170, 440, 1290, 12);
  const tired = clamp((lt - 3.2) / 2.6);
  drawStick(ctx, P(JIMMY_KID, { x: 440, y: 1250, s: 520, lean: tired * .12, headTilt: tired * .25 + Math.sin(t * 2) * .03 * tired, legs: { L: [1.4, -1.5], R: [1.4, -1.5] }, arms: { L: [.5, -.6], R: [.8 + Math.abs(Math.sin(t * 7)) * .3, -1.2] },
    face: { eyes: tired > .6 ? 'half' : 'normal', mouth: Math.floor(t * 7) % 2 ? 'o' : 'flat', browAng: tired * .4 } }));
  if (tired > .3) { sweat(ctx, 560, 700, 30, tired); }
  camRig(ctx, 830, 1330, .9, true, t, -1);
  if (tired > .7) label(ctx, 'zzz', 600, 560 + Math.sin(t * 3) * 10, 50, '#9fdcff', .2, tired);
} });
// 9 — the video blows up
SHOTS.push({ start: 31.0, end: 32.0, tr: 'whip', draw(ctx, lt, t) {
  radial(ctx, 540, 800, t * 3, '#ff5a3c', '#e8343c');
  const cam = cam0(t, lt, 1.1, 1.0, 1, 540, 960, 10); applyCam(ctx, cam, 1);
  const k = easeOut(clamp(lt / .7));
  path(ctx, [[120, 1150], [320, 1050], [520, 1080], [960, lerp(1000, 300, k)]], false); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = '#fff'; ctx.stroke();
  burst(ctx, 960, lerp(1000, 300, k), 110 + Math.sin(t * 30) * 10, 12, '#ffd23a');
  label(ctx, fmt(k * 1000000), 540, 560, 120, '#fff', -.05, 1);
  label(ctx, 'VIRAL', 540, 760, 100, '#ffd23a', .05, kf(lt, [[.2, 0], [.35, 1]]));
  flash(ctx, kf(lt, [[0, .8], [.2, 0]]));
} });
// 10 — first $10k sponsorship
SHOTS.push({ start: 32.0, end: 34.55, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.0, 1.08, 2.5, 540, 960);
  bedroom(ctx, cam, t, { wall: '#9fd0f0' }); applyCam(ctx, cam, 1);
  const k = clamp(lt / .5);
  giantCheck(ctx, lerp(1500, 560, backOut(k)), 560, .95, -.06 + Math.sin(t * 2) * .02, 'US$ 10.000');
  drawStick(ctx, P(JIMMY_KID, { x: 360, y: 1300, s: 560, arms: lt > .6 ? { L: [2.4, .2], R: [2.4, .2] } : POSE.idle.arms, face: lt > .5 ? { eyes: 'wide', mouth: 'grin', browUp: 1 } : { eyes: 'normal', mouth: 'smile' }, bob: lt > .6 ? -Math.abs(Math.sin(t * 10)) * .03 : 0 }));
  for (let i = 0; i < 4; i++) sparkle(ctx, 300 + i * 200, 380 + (i % 2) * 380, 40 * Math.abs(Math.sin(t * 4 + i)), k);
} });
// 11 — gives all of it away on the street, and films it
SHOTS.push({ start: 34.55, end: 38.3, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.05, 1.15, 3.7, 560, 960);
  applyCam(ctx, cam, .1); drawSky(ctx, '#ffb36b', '#ffe1b0');
  applyCam(ctx, cam, .4);
  for (let i = 0; i < 6; i++) { const bx = -100 + i * 230, bh = 500 + (i * 137) % 300; rrect(ctx, bx, 1150 - bh, 200, bh, 6); fillStroke(ctx, ['#c98a6a', '#9a7ab4', '#d9a85a'][i % 3], 7); for (let j = 0; j < 4; j++) { rrect(ctx, bx + 40, 1150 - bh + 60 + j * 110, 50, 60, 4); fillStroke(ctx, '#fff2b0', 5); rrect(ctx, bx + 115, 1150 - bh + 60 + j * 110, 50, 60, 4); fillStroke(ctx, '#fff2b0', 5); } }
  applyCam(ctx, cam, 1);
  ctx.fillStyle = '#9a9aa6'; ctx.fillRect(-400, 1150, 1900, 900); line(ctx, -400, 1150, 1500, 1150, 8);
  // cardboard + man sitting
  rrect(ctx, 580, 1180, 360, 80, 6); fillStroke(ctx, '#c49a5a', 7);
  const given = lt > 1.4;
  drawStick(ctx, P(HOMELESS, { x: 760, y: 1250, s: 420, flip: -1, legs: { L: [1.5, -1.6], R: [1.4, -1.5] }, arms: given ? { L: [2.5, .3], R: [2.5, .3] } : { L: { ik: [.25, -.4] }, R: [.3, -.2] }, face: given ? { eyes: 'wide', mouth: 'grin', browUp: 1 } : { eyes: 'normal', mouth: 'flat', look: [-.6, .3] }, bob: given ? -Math.abs(Math.sin(t * 9)) * .02 : 0 }));
  // Jimmy hands over the cash stack
  const hk = clamp((lt - .5) / .8);
  drawStick(ctx, P(JIMMY_KID, { x: 360, y: 1290, s: 540, arms: { L: [.3, -.1], R: given ? [.3, -.1] : { ik: [lerp(.2, .55, ease(hk)), -.5] } }, face: { eyes: 'happy', mouth: 'grin' } }));
  if (!given) { const hx = 360 + lerp(.2, .55, ease(hk)) * 540, hy = 1290 - .5 * 540; for (let i = 0; i < 4; i++) bill(ctx, hx + 10, hy - i * 12, .8, -.1); }
  if (given) { for (let i = 0; i < 5; i++) { const a = clamp((lt - 1.4 - i * .15) * 2); heart(ctx, 760 + Math.sin(i * 2.4) * 160, 760 - (lt - 1.4 - i * .15) * 200, 1 + i * .1, a * (1 - clamp((lt - 3.2) * 2))); } for (let i = 0; i < 6; i++) { const p = clamp((lt - 1.4) * 1.5 - i * .1); bill(ctx, 760 + (i - 2.5) * 70, lerp(820, 1150, easeIn(p)) - Math.sin(p * 3) * 60, .8, i + lt * 3); } }
  camRig(ctx, 140, 1420, .85, true, t);
} });
// 12 — the formula is born
SHOTS.push({ start: 38.3, end: 40.0, tr: 'whip', draw(ctx, lt, t) {
  ctx.fillStyle = '#1c1a22'; ctx.fillRect(0, 0, W, H);
  const cam = cam0(t, lt, 1.0, 1.08, 1.7); applyCam(ctx, cam, 1);
  chalkboard(ctx, 540, 640, 900, 640);
  const steps = [[230, '$'], [430, '🎥'], [650, '👀'], [860, '$$']];
  steps.forEach(([x, s], i) => { const a = clamp((lt - i * .25) * 5); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    if (s === '🎥') { rrect(ctx, x - 55, 560, 110, 80, 12); fillStroke(ctx, null, 7, '#f4f1e6'); path(ctx, [[x + 55, 585], [x + 85, 565], [x + 85, 635], [x + 55, 615]]); fillStroke(ctx, null, 7, '#f4f1e6'); }
    else if (s === '👀') { for (const d of [-30, 30]) { ellipse(ctx, x + d, 600, 26, 34); fillStroke(ctx, null, 7, '#f4f1e6'); circle(ctx, x + d + 6, 606, 9); ctx.fillStyle = '#f4f1e6'; ctx.fill(); } }
    else text(ctx, s, x, 604, 110, '#f4f1e6', INK, 0, 'Poppins', 700);
    if (i < 3) text(ctx, '→', x + 105, 600, 70, '#ffd23a', INK, 0, 'Poppins', 700);
    ctx.restore(); });
  const loopA = clamp((lt - 1.0) * 3); if (loopA > 0) { ctx.save(); ctx.globalAlpha = loopA; ctx.beginPath(); ctx.moveTo(860, 700); ctx.quadraticCurveTo(540, 900, 230, 700); ctx.lineWidth = 8; ctx.strokeStyle = '#ffd23a'; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 80; ctx.stroke(); ctx.restore(); }
  drawStick(ctx, P(JIMMY_KID, { x: 540, y: 1400, s: 440, arms: { L: [.3, -.1], R: [2.3, -.3] }, face: { eyes: 'normal', mouth: 'grin', look: [0, -1], browOne: 1 } }));
  // light bulb
  const bA = kf(lt, [[.9, 0], [1.1, 1]]); if (bA > 0) { ctx.save(); ctx.globalAlpha = bA; circle(ctx, 680, 960, 46); fillStroke(ctx, '#fff27a', 7); rrect(ctx, 660, 1000, 40, 30, 5); fillStroke(ctx, '#bfc4cc', 6); ctx.restore(); }
} });
// 13 — reinvest every cent into the next video
SHOTS.push({ start: 40.0, end: 44.5, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.15, .95, 4.5, 540, 1000, 3);
  studioBG(ctx, cam, t); applyCam(ctx, cam, 1);
  // the next video keeps getting bigger
  const step = Math.max(0, Math.min(3, Math.floor((lt - .4) / .9))); const stT = .4 + step * .9;
  const sc = [.55, .8, 1.05, 1.35][step] * lerp(.85, 1, backOut(clamp((lt - stT) / .3)));
  const tcol = ['#58b348', '#3a8bf0', '#f2b52a', '#e8343c'][step];
  ctx.save(); ctx.translate(700, 800); ctx.scale(sc, sc); rrect(ctx, -170, -110, 340, 220, 18); fillStroke(ctx, tcol, 8); playButton(ctx, 0, -10, .8, '#fff'); path(ctx, [[-20, -38], [30, -10], [-20, 18]]); fillStroke(ctx, tcol, 4);
  text(ctx, 'vídeo ' + (step + 1), 0, 80, 34, '#fff', INK, 0, 'Poppins', 700); ctx.restore();
  for (let i = 0; i < 8; i++) { const p = ((lt * 1.3 + i / 8) % 1); coin(ctx, lerp(330, 700, p), lerp(800, 780, p) - Math.sin(p * Math.PI) * 330, 26, t + i); }
  drawStick(ctx, P(JIMMY, { x: 230, y: 1290, s: 560, arms: { L: [.3, -.1], R: [1.9 + Math.sin(t * 9) * .35, -.5] }, face: { eyes: 'normal', mouth: 'grin', browAng: .2, look: [1, -.3] } }));
  label(ctx, '100% reinvestido', 540, 330, 80, '#ffd23a', -.04, kf(lt, [[.9, 0], [1.1, 1]]));
  const big = kf(lt, [[3.1, 0], [3.4, 1, backOut]]); if (big > 0) { ctx.save(); ctx.translate(920, 520); ctx.scale(big, big); burst(ctx, 0, 0, 120, 12, '#fff'); text(ctx, '!!!', 0, 6, 90, '#e8343c', INK, 0, 'Poppins', 700); ctx.restore(); }
} });
// 14 — recreates the game show for real
SHOTS.push({ start: 44.5, end: 46.2, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.0, 1.1, 1.7, 540, 960);
  arenaBG(ctx, cam, t); applyCam(ctx, cam, .7);
  // red light / green light tower
  rrect(ctx, 460, 220, 160, 300, 30); fillStroke(ctx, '#2c2830', 8);
  const green = Math.floor(lt * 2.4) % 2 === 0;
  circle(ctx, 540, 300, 50); fillStroke(ctx, green ? '#3a3a3a' : '#ff3b3b', 6); circle(ctx, 540, 440, 50); fillStroke(ctx, green ? '#3fdc6a' : '#3a3a3a', 6);
  applyCam(ctx, cam, 1);
  for (let i = 0; i < 5; i++) { const x = 140 + i * 200, mv = green ? 1 : 0; drawStick(ctx, P(PLAYER, { x, y: 1240 + (i % 2) * 60, s: 380, legs: mv ? walkLegs(t + i, 12) : { L: [.1, -.04], R: [.1, -.04] }, arms: mv ? { L: [.8, -.6], R: [.2, -.6] } : POSE.handsUp.arms, face: { eyes: mv ? 'normal' : 'wide', mouth: mv ? 'teeth' : 'o', look: [0, -1] } })); }
  drawStick(ctx, P(GUARD('s'), { x: 980, y: 1300, s: 440, flip: -1, arms: { L: [.2, -.1], R: [.2, -.1] } }));
  label(ctx, 'ROUND 6', 540, 640, 110, '#fff', -.05, kf(lt, [[0, 0], [.15, 1]]));
} });
// 15 — gave away private islands
SHOTS.push({ start: 46.2, end: 47.25, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.05, 1.12, 1.1, 540, 960);
  applyCam(ctx, cam, .1); drawSky(ctx, '#33b5f0', '#c9f0ff'); applyCam(ctx, cam, .2); drawSun(ctx, 860, 260, 70, t, .8);
  applyCam(ctx, cam, .5); drawSea(ctx, 820, t);
  applyCam(ctx, cam, 1); island(ctx, 540, 1000, 1.0, t);
  giftBow(ctx, 440, 930, .7 * backOut(clamp(lt / .3)));
  drawStick(ctx, P(JIMMY, { x: 340, y: 975, s: 300, shadow: false, arms: { L: [.3, -.1], R: [2.4, .3] }, face: { eyes: 'happy', mouth: 'grin' } }));
  label(ctx, 'ILHA DE PRESENTE', 540, 520, 76, '#fff', -.04, kf(lt, [[.1, 0], [.25, 1]]));
} });
// 16 — his own chocolate brand
SHOTS.push({ start: 47.25, end: 49.05, tr: 'whip', draw(ctx, lt, t) {
  radial(ctx, 540, 760, t, '#7cc4ff', '#5aa8f0');
  const cam = cam0(t, lt, 1.0, 1.08, 1.8); applyCam(ctx, cam, 1);
  const k = backOut(clamp(lt / .4));
  chocoBar(ctx, 600, lerp(-300, 760, k), 1.0, .12 + Math.sin(t * 2) * .03, clamp((lt - 1.0) * 4));
  drawStick(ctx, P(JIMMY, { x: 260, y: 1300, s: 500, arms: { L: [.3, -.1], R: [1.9, -.4] }, face: { eyes: 'normal', mouth: lt > 1.0 ? 'grin' : 'smile', look: [1, -.4], browOne: 1 } }));
  if (lt > 1.0 && lt < 1.3) burst(ctx, 720, 420, 90, 9, '#fff');
} });
// 17 — hundreds of millions of subscribers
SHOTS.push({ start: 49.05, end: 51.1, tr: 'whip', draw(ctx, lt, t) {
  const cam = cam0(t, lt, 1.0, 1.08, 2.0, 540, 960);
  studioBG(ctx, cam, t, { top: '#2a0f12', bot: '#7a1a22', floor: '#3a1216' }); applyCam(ctx, cam, 1);
  const subs = 1e6 + Math.pow(clamp(lt / 1.7), 2.2) * 399e6;
  counterPanel(ctx, 540, 350, 920, 190, fmt(subs), '#fff', 96);
  text(ctx, 'inscritos', 540, 490, 50, '#ffd0d0', INK, 0, 'Poppins', 700);
  plaque(ctx, 540, 870, .85, t);
  if (subs > 3e8) { const a = clamp((lt - 1.3) * 4); burst(ctx, 860, 1060, 150 * a, 10, '#ffd23a'); text(ctx, '300M+', 860, 1064, 40 * a, INK, INK, 0, 'Poppins', 700); }
  moneyRain(ctx, lt, 6, 13, -200, 1600, .9);
} });
// 18 — internet billionaire
SHOTS.push({ start: 51.1, end: 53.05, tr: 'whip', draw(ctx, lt, t) {
  radial(ctx, 540, 600, t, '#ffd23a', '#f2b52a');
  const cam = cam0(t, lt, 1.12, 1.0, 1.9, 540, 960); applyCam(ctx, cam, 1);
  trophyPile(ctx, 540, 1350, 1.1, t);
  drawStick(ctx, P(JIMMY, { x: 540, y: 960, s: 400, arms: { L: [2.5, .3], R: [2.5, .3] }, face: { eyes: 'happy', mouth: 'grin' }, bob: -Math.abs(Math.sin(t * 6)) * .02 }));
  label(ctx, 'BILIONÁRIO', 540, 330, 110, '#fff', -.05, kf(lt, [[.3, 0], [.5, 1]]));
  for (let i = 0; i < 8; i++) { const p = (lt * .9 + i / 8) % 1; coin(ctx, 100 + i * 120, -60 + p * 1100, 30, t + i); }
} });
// 19 — from the kid nobody watched to the king
SHOTS.push({ start: 53.05, end: 55.4, tr: 'whip', draw(ctx, lt, t) {
  const sw = ease(clamp((lt - .9) / .5));
  const cam = cam0(t, lt, 1.0, 1.06, 2.3, 540, 960);
  if (sw < 1) { ctx.save(); ctx.globalAlpha = 1; bedroom(ctx, cam, t, { night: true }); applyCam(ctx, cam, 1); desk(ctx, 640, 1060, 520);
    monitor(ctx, 700, 840, 340, 220, (c, w, h) => { c.fillStyle = '#f7f7f7'; c.fillRect(0, 0, w, h); text(c, '0 views', w / 2, h / 2, 44, '#777', INK, 0, 'Poppins', 700); });
    drawStick(ctx, P(JIMMY_KID, { x: 340, y: 1300, s: 440, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'normal', mouth: 'frown', look: [1, 0] } })); ctx.restore(); }
  if (sw > 0) { ctx.save(); ctx.beginPath(); ctx.setTransform(1, 0, 0, 1, 0, 0); circle(ctx, 540, 760, sw * 1500); ctx.clip();
    studioBG(ctx, cam, t); applyCam(ctx, cam, 1);
    plaque(ctx, 180, 920, .45, t); plaque(ctx, 900, 920, .45, t + 1);
    drawStick(ctx, P(JIMMY, { x: 540, y: 1290, s: 640, hat: crownFn(), arms: { L: [.9, -2.2], R: [.9, -2.2] }, face: { eyes: 'happy', mouth: 'grin' } }));
    label(ctx, 'REI DO YOUTUBE', 540, 300, 84, '#ffd23a', -.04, clamp((lt - 1.3) * 4)); moneyRain(ctx, lt, 10, 17, -200, 1600, .8); ctx.restore(); }
} });
// 20 — the question: $1 million
SHOTS.push({ start: 55.4, end: 59.0, tr: 'whip', draw(ctx, lt, t) {
  radial(ctx, 540, 700, t, '#2fbf71', '#249a5b');
  const cam = cam0(t, lt, 1.0, 1.1, 3.6); applyCam(ctx, cam, 1);
  const op = clamp((lt - .5) / .4);
  briefcase(ctx, 540, 720, 1.0, easeOut(op), t);
  label(ctx, 'US$ 1 MILHÃO', 540, 260, 96, '#fff', -.04, kf(lt, [[.6, 0], [.8, 1]]));
  drawStick(ctx, P(FAN, { x: 540, y: 1340, s: 430, t, arms: { L: [.3, -.1], R: { ik: [.13, -.82] } }, face: { eyes: lt > 2.3 ? 'normal' : 'wide', look: [0, -1], mouth: lt > 2.3 ? 'smirk' : 'o', browOne: lt > 2.3 ? 1 : 0 }, headTilt: lt > 2.3 ? .12 : 0 }));
  for (let i = 0; i < 3; i++) qmark(ctx, 300 + i * 240, 980 - (i % 2) * 70 + Math.sin(t * 3 + i) * 15, 90, (i - 1) * .25, clamp((lt - 2.2 - i * .2) * 4));
} });
// 21 — comment below
SHOTS.push({ start: 59.0, end: 60.6, tr: 'cut', draw(ctx, lt, t) {
  radial(ctx, 540, 700, t, '#3a8bf0', '#2a6fd6');
  const cam = cam0(t, lt, 1.0, 1.04, 1.6); applyCam(ctx, cam, 1);
  commentIcon(ctx, 540, 560, backOut(clamp(lt / .35)) * 1.5);
  arrowDown(ctx, 540, 1020 + Math.abs(Math.sin(t * 7)) * 50, 1.1);
  drawStick(ctx, P(JIMMY, { x: 220, y: 1250, s: 380, arms: { L: [.3, -.1], R: [1.2, -.2] }, face: { eyes: 'happy', mouth: 'grin' } }));
  drawStick(ctx, P(FAN, { x: 870, y: 1250, s: 380, flip: -1, arms: { L: [.3, -.1], R: [2.4, .3] }, face: { eyes: 'happy', mouth: 'grin' } }));
} });
