// The edit: "Ramon Dino — do Acre ao topo do Mr. Olympia"
import * as THREE from 'three';
import { kf, lerp, smooth, easeOut, easeIn, easeInOut, range, clamp, V, cam, place, shake, ikArm } from './anim.js';
import { CAST, person, STAND, BIG, DBI, CHEER, SIT, pose, blend, walk, handsOnHips, grab, move, orbit, dofAt, SKY, park, stage, gym, stars, heart, popIn, P, glowSprite } from './story.js';
import { CAPS } from './captions.js';

export const CAPTIONS = CAPS;
export const DURATION = 123.98;
// dips to black on the two turns ("Só que ele não parou", "O resultado?")
export const FADES = [[29.74, 29.87, 29.93, 30.08], [88.33, 88.46, 88.53, 88.68]];

// ============ old-photo pull-ups (hook) / pull-ups in the park ============
function pullups({ makeStage }, D, { sepia = 0, who = 'cali', view = 0 } = {}) {
  const scene = makeStage({ shadowSize: 3, sunDir: [-3, 7, 3] });
  park(scene, { seed: 3, trees: 16, radius: [3, 12] });
  const bar = P.pullupBar(); scene.add(bar);
  const h = person(who); scene.add(h.root);
  const barY = bar.userData.barY;
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const ph = (t * 0.7 + 0.15) % 1, up = 0.5 - 0.5 * Math.cos(ph * Math.PI * 2);
      h.root.position.y = barY - 0.64 - 1.41 + up * 0.42;
      h.setPose({ lHip: [-0.3, 0, 0.05], rHip: [-0.3, 0, -0.05], lKn: [0.95, 0, 0], rKn: [0.95, 0, 0], lAn: [0.4, 0, 0], rAn: [0.4, 0, 0], neck: [-0.2 + up * 0.15, 0, 0], chest: [-0.06, 0, 0] });
      h.setMouth(0.15 + up * 0.25);
      grab(h, V(0.31, barY + 0.02, 0.0), V(-0.31, barY + 0.02, 0.0), { lPole: V(1.3, barY - 0.5, 0.5), rPole: V(-1.3, barY - 0.5, 0.5), hint: V(0, 0, -1) });
      const head = V(0, h.root.position.y + 1.7, 0);
      if (view === 0) move(c, t, D, [1.0, 1.1, 2.7], [0.55, 1.3, 2.2], [0, 1.85, 0], [0, 1.95, 0], { amp: 0.8, seed: 2 });
      else move(c, t, D, [-2.2, 1.0, 1.8], [-1.6, 1.2, 1.9], [0, 1.8, 0], [0, 1.85, 0], { amp: 0.5, seed: 5 });
      return { dof: dofAt(c, head, 0.002), sepia, bloom: 0.3 };
    },
  };
}

// ============ rice and eggs ============
function riceShot({ makeStage }, D, { sepia = 0 } = {}) {
  const scene = makeStage({ shadowSize: 1, sunDir: [-2, 6, 3], sky: SKY.indoor });
  const tb = P.table(1.0, 0.7); scene.add(tb);
  const pl = P.riceAndEggs(); pl.position.y = tb.userData.h; scene.add(pl);
  const c = cam(34);
  return {
    scene, camera: c,
    update(t) {
      const y = tb.userData.h;
      orbit(c, t, D, { center: [0, y + 0.02, 0], r0: 0.55, r1: 0.42, a0: -0.5, a1: 0.15, y0: y + 0.42, y1: y + 0.3, look: [0, y + 0.02, 0], amp: 0.2 });
      return { dof: dofAt(c, V(0, y + 0.03, 0), 0.02, 0.012), sepia };
    },
  };
}

// ============ trophy raise on stage ============
function trophyShot({ makeStage }, D, { wall = 0x3a1a6a, raiseAt = 0.25, conf = 0.7, label = null, crowdOn = false, view = 0 } = {}) {
  const st = stage(makeStage, { wall });
  const scene = st.scene;
  const h = person('pro'); scene.add(h.root);
  const tr = P.trophy(1.8); scene.add(tr);
  const cf = P.confetti(500, undefined, [4.5, 3, 3], 3.3); scene.add(cf);
  const fl = P.flag(1.4, 3.1); fl.position.set(-2.0, 0, -1.3); scene.add(fl);
  let cr = null;
  if (label) { const s = P.sign(label, 2.0, 0.7, { bg: null, fg: '#ffd36a', glow: true }); s.position.set(0, 4.05, -3.4); scene.add(s); }
  const flash = glowSprite(0xffd890, 1.2); scene.add(flash);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const k = easeInOut(range(t, raiseAt, raiseAt + 1.1));
      const tp = V(0, lerp(1.08, 1.9, k), lerp(0.38, 0.14, k));
      tr.position.copy(tp); tr.rotation.y = Math.sin(t * 0.8) * 0.2;
      pose(h, t, blend(BIG, CHEER, k), { neck: [-0.3 * k, 0, 0], head: [-0.1 * k, 0, 0] });
      h.setMouth(smooth(range(t, raiseAt + 0.7, raiseAt + 1.0)) * (0.8 + 0.1 * Math.sin(t * 7)));
      grab(h, V(0.17, tp.y + 0.07, tp.z), V(-0.17, tp.y + 0.07, tp.z), { lPole: V(1.0, tp.y - 0.6, 0.2), rPole: V(-1.0, tp.y - 0.6, 0.2) });
      flash.position.copy(tp).add(V(0, 0.55, 0.06)); flash.material.opacity = 0.2 + 0.4 * k;
      cf.update(t - conf); fl.update(t); cr?.update(t, smooth(range(t, raiseAt + 0.5, raiseAt + 1)));
      if (view === 0) orbit(c, t, D, { center: [0, 1.6, 0], r0: 4.0, r1: 3.6, a0: -0.3, a1: 0.22, y0: 1.4, y1: 1.45, look: [0, 1.75, 0] });
      else orbit(c, t, D, { center: [0, 1.6, 0], r0: 4.2, r1: 3.2, a0: 0.45, a1: -0.15, y0: 1.0, y1: 1.2, look: [0, 1.75, 0] });
      return { dof: dofAt(c, V(0, 1.7, 0), 0.0015), bloom: 0.7 };
    },
  };
}

// ============ double biceps on stage ============
function flexShot({ makeStage }, D, { who = 'pro', wall = 0x3a1a6a, label = null, crowdOn = false, flagOn = true, r0 = 3.3, r1 = 2.7 } = {}) {
  const st = stage(makeStage, { wall });
  const scene = st.scene;
  const h = person(who); scene.add(h.root);
  let fl = null; if (flagOn) { fl = P.flag(1.5, 3.2); fl.position.set(-0.6, 0, -1.6); scene.add(fl); }
  let cr = null; if (crowdOn) { cr = P.crowd(30, 7, 6.5, 2); cr.position.set(0, -0.6, 2.2); scene.add(cr); }
  if (label) { const s = P.sign(label.split(' '), 1.7, 1.2, { bg: null, fg: '#ffd36a', glow: true }); s.position.set(0, 3.5, -3.4); scene.add(s); }
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.05, 0.45));
      pose(h, t, blend(BIG, DBI, k), { neck: [-0.05, 0.1 * Math.sin(t), 0] });
      h.setMouth(0.05);
      fl?.update(t); cr?.update(t, 1);
      orbit(c, t, D, { center: [0, 1.45, 0], r0, r1, a0: 0.18, a1: -0.12, y0: 1.35, y1: 1.45, look: [0, 1.6, 0], amp: 0.6 });
      return { dof: dofAt(c, V(0, 1.6, 0.1), 0.003), bloom: 0.6 };
    },
  };
}

// ============ Rio Branco, 1995 ============
function townShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 9, sunDir: [-4, 8, 5] });
  park(scene, { seed: 5, ground: 'dirt', trees: 12, radius: [9, 18] });
  const M = P.mats();
  scene.add(P.box(40, 0.01, 2.0, M.path, [0, 0.006, -0.3]));
  const cols = [[0xf2c94c, 0xc0492f], [0x6fcf97, 0x8a3b2a], [0xf2994a, 0xb03a2e], [0x56ccf2, 0xa9442f], [0xeb5757, 0x7a2e22], [0xbb6bd9, 0xa33b2b]];
  cols.forEach(([w, r], i) => { const hs = P.house(w, r, i); hs.position.set(-6.25 + i * 2.5, 0, -2.6 - (i % 2) * 0.4); scene.add(hs); });
  const sg = P.postSign(['RIO BRANCO', 'ACRE • 1995'], 1.9, 0.8, { bg: '#1f6b3a', y: 1.7 }); sg.position.set(0.3, 0, 1.2); sg.rotation.y = -0.15; scene.add(sg);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      move(c, t, D, [-0.6, 5.0, 7.5], [0.6, 1.9, 4.6], [0, 1.2, -2.0], [0.2, 1.55, 1.0], { amp: 0.4 });
      return { dof: { aperture: 0 } };
    },
  };
}
function kidHome({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 4, sunDir: [-3, 7, 5] });
  park(scene, { seed: 6, ground: 'dirt', trees: 8, radius: [6, 14] });
  const hs = P.house(0xf2c94c, 0xc0492f); hs.position.set(0, 0, -1.9); scene.add(hs);
  const hs2 = P.house(0x6fcf97, 0x8a3b2a); hs2.position.set(-2.6, 0, -2.3); scene.add(hs2);
  const sg = P.postSign(['BAIRRO', 'XAVIER MAIA'], 0.95, 0.42, { bg: '#1d4fa8', y: 1.9 }); sg.position.set(1.1, 0, -0.3); sg.rotation.y = -0.35; scene.add(sg);
  const kid = person('kid', 0.62); kid.root.position.set(0, 0, 0.5); scene.add(kid.root);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      pose(kid, t, STAND, { rSh: [-0.1, 0, -2.5], rEl: [0, 0, -0.5 + 0.45 * Math.sin(t * 9)], neck: [0, -0.1, 0.05] });
      kid.setMouth(0.35);
      move(c, t, D, [0.5, 0.95, 3.0], [0.25, 0.9, 2.3], [0.2, 0.9, 0], [0.1, 0.85, 0.3], { amp: 0.4 });
      return { dof: dofAt(c, V(0, 1.0, 0.5), 0.003) };
    },
  };
}

// ============ football ============
function footballShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 5, sunDir: [-3, 7, 2] });
  park(scene, { seed: 11, ground: 'dirt', trees: 14, radius: [8, 16] });
  const M = P.mats();
  const goal = new THREE.Group();
  for (const x of [-1.1, 1.1]) goal.add(P.cyl(0.04, 0.04, 1.3, M.white, [x, 0.65, 0]));
  goal.add(P.mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.24, 12), M.white, [0, 1.3, 0], [0, 0, Math.PI / 2]));
  goal.position.set(0.2, 0, 6); scene.add(P.shadow(goal));
  const kid = person('kid', 0.62); scene.add(kid.root);
  const ball = P.soccerBall(0.1); scene.add(ball);
  const c = cam(40);
  const TK = 1.15;
  return {
    scene, camera: c,
    update(t) {
      const wind = smooth(range(t, 0.6, TK - 0.05)), strike = easeOut(range(t, TK - 0.05, TK + 0.12));
      const cheer = smooth(range(t, 2.3, 2.6));
      const kick = { rHip: [lerp(lerp(0, 0.6, wind), -1.15, strike), 0, -0.05], rKn: [lerp(lerp(0.1, 1.2, wind), 0.15, strike), 0, 0], spine: [-0.1 * strike, 0, 0], lSh: [-0.5 * strike, 0, 0.5], rSh: [0.4 * strike, 0, -0.5] };
      pose(kid, t, blend(blend(STAND, kick, 1 - cheer), CHEER, cheer));
      kid.root.position.y = cheer * Math.abs(Math.sin(t * 7)) * 0.08;
      kid.setMouth(cheer * 0.8);
      const a = t - TK;
      if (a < 0) ball.position.set(-0.06, 0.1, 0.24);
      else { const k = Math.min(1, a / 0.85); ball.position.set(lerp(-0.06, 0.4, k), 0.1 + Math.sin(k * Math.PI * 0.8) * 1.1 + k * 0.1, lerp(0.24, 6.1, k)); ball.rotation.x = a * 20; }
      const look = kf(t, [[0, [0, 0.45, 0.6]], [TK + 0.1, [0, 0.5, 1.2]], [TK + 0.9, [0.3, 0.8, 5.0]], [2.3, [0.3, 0.8, 5.0]], [2.9, [0, 0.6, 0.5]]]);
      const pos = kf(t, [[0, [-1.5, 0.85, -1.2]], [TK + 0.9, [-1.2, 1.1, -1.9]], [2.3, [-1.2, 1.1, -1.9]], [3.0, [-0.6, 0.85, 1.9]]]);
      const s = shake(t, 0.6);
      place(c, [pos[0] + s[0], pos[1] + s[1], pos[2]], look);
      return { dof: { aperture: 0 } };
    },
  };
}
function capoeiraShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 4, sunDir: [-3, 7, 3] });
  park(scene, { seed: 12, trees: 14, radius: [5, 13] });
  const kid = person('capoeira', 0.66); scene.add(kid.root);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const k = easeInOut(range(t, 0.2, 1.1));
      kid.root.rotation.y = lerp(0.5, -0.6, k);
      pose(kid, t, STAND, {
        rHip: [-1.3 * Math.sin(k * Math.PI), 0, lerp(-1.0, 0.3, k) * Math.sin(k * Math.PI)], rKn: [0.05, 0, 0],
        lKn: [0.25, 0, 0], lHip: [-0.15, 0, 0.1], lAn: [-0.1, 0, 0], drop: -0.05,
        spine: [-0.15 * Math.sin(k * Math.PI), 0, 0.3 * Math.sin(k * Math.PI)],
        lSh: [-0.9, 0, 0.35], lEl: [-1.3, 0, 0], rSh: [-0.6, 0, -0.5], rEl: [-1.2, 0, 0],
      });
      move(c, t, D, [0.8, 0.5, 2.6], [0.3, 0.55, 2.2], [0, 0.65, 0], [0, 0.7, 0], { amp: 0.6 });
      return { dof: dofAt(c, V(0, 0.7, 0), 0.003) };
    },
  };
}

// ============ 14 years old: gym, love, empty wallet ============
function curlShot({ makeStage }, D) {
  const scene = gym(makeStage);
  const h = person('teen', 0.95); scene.add(h.root);
  const db = P.dumbbell(0.75); h.j.rWr.add(db); db.position.set(0, -0.06, 0.01);
  const hs = [0, 1, 2, 3].map(() => { const s = heart(0.14); scene.add(s); return s; });
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const cur = 0.5 - 0.5 * Math.cos(t * Math.PI * 2 * 0.75);
      pose(h, t, STAND, { rSh: [0.05, 0, -0.12], rEl: [-0.3 - 1.9 * cur, 0, 0], neck: [0.12, -0.2, 0], head: [0.05, -0.15, 0] });
      h.setMouth(0.3);
      hs.forEach((s, i) => { const a = ((t + i * 0.7) % 2.8) / 2.8; s.position.set(0.35 + Math.sin(a * 6 + i) * 0.1 - (i % 2) * 0.6, 1.45 + a * 0.6, 0.3); s.material.opacity = Math.sin(a * Math.PI); s.scale.setScalar(0.1 + a * 0.08); });
      move(c, t, D, [0.6, 1.35, 2.5], [0.35, 1.4, 1.9], [0, 1.3, 0], [0, 1.35, 0], { amp: 0.5 });
      return { dof: dofAt(c, V(0, 1.4, 0), 0.003) };
    },
  };
}
function walletShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 4, sunDir: [-2, 7, 5] });
  const M = P.mats();
  scene.add(P.groundDisc(P.std(0x9a9a9e, { roughness: 0.95 }), 40));
  scene.add(P.box(6, 3.4, 0.3, P.std(0x4a4f5a, { roughness: 0.8 }), [0, 1.7, -1.2]));
  scene.add(P.box(1.2, 2.2, 0.05, M.glass, [-0.9, 1.1, -1.03]));
  const s1 = P.sign('ACADEMIA', 2.4, 0.5, { bg: '#d62b2b', fg: '#ffffff', radius: 18 }); s1.position.set(0, 2.75, -1.02); scene.add(s1);
  const s2 = P.sign(['MENSALIDADE', 'EM DIA?'], 0.8, 0.6, { bg: '#ffd84a', fg: '#1a1a1a', radius: 12 }); s2.position.set(1.1, 1.5, -1.02); scene.add(s2);
  const h = person('teen', 0.95); h.root.position.set(0, 0, 0.4); scene.add(h.root);
  const w = P.wallet(); scene.add(w);
  const moth = new THREE.Group(); const wm = P.std(0x8a8070, { side: THREE.DoubleSide });
  const wl = P.mesh(new THREE.CircleGeometry(0.025, 3), wm, [-0.02, 0, 0]); const wr = P.mesh(new THREE.CircleGeometry(0.025, 3), wm, [0.02, 0, 0]);
  moth.add(wl, wr, P.ball(0.007, P.std(0x5a5040), [0, 0, 0], [1, 1, 2.5])); scene.add(moth);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const lower = smooth(range(t, 2.2, 2.9));
      const wp = V(0, lerp(1.12, 0.95, lower), lerp(0.76, 0.66, lower));
      w.position.copy(wp); w.rotation.x = -0.5;
      pose(h, t, STAND, { neck: [lerp(0.45, 0.05, lower), 0, 0], head: [lerp(0.25, -0.05, lower), 0, 0], chest: [0.08, 0, 0] });
      grab(h, wp.clone().add(V(0.1, 0, 0)), wp.clone().add(V(-0.1, 0, 0)), { hint: V(0, 1, 0) });
      h.setMouth(0.08 + 0.15 * lower);
      const a = Math.max(0, t - 0.7);
      moth.visible = t > 0.7;
      moth.position.copy(wp).add(V(Math.sin(a * 3) * 0.08, a * 0.32, 0.05 + a * 0.12));
      wl.rotation.y = Math.sin(t * 40) * 0.9; wr.rotation.y = -Math.sin(t * 40) * 0.9;
      move(c, t, D, [0.45, 1.35, 2.3], [0.25, 1.35, 1.8], [0, 1.3, 0.5], [0, 1.35, 0.5], { amp: 0.4 });
      return { dof: dofAt(c, V(0, 1.4, 0.5), 0.003) };
    },
  };
}
function resolveShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 3, sunDir: [3, 5, -4], sun: 2.8 });
  park(scene, { seed: 7, trees: 18, radius: [3, 12] });
  const h = person('teen', 0.95); scene.add(h.root);
  const c = cam(32);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.1, 0.6));
      pose(h, t, STAND, { rSh: [lerp(0, -1.05, k), 0, lerp(-0.16, -0.25, k)], rEl: [lerp(-0.2, -1.7, k), 0, 0], neck: [-0.05, 0, 0] });
      move(c, t, D, [0.25, 1.62, 1.25], [0.12, 1.65, 0.85], [0, 1.58, 0], [0, 1.6, 0], { amp: 1.2, ease: easeOut });
      return { dof: dofAt(c, V(0, 1.62, 0.08), 0.006, 0.012) };
    },
  };
}
function hortoShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 7, sunDir: [-3, 8, 4] });
  park(scene, { seed: 7, trees: 26, radius: [3.5, 14] });
  const M = P.mats();
  scene.add(P.box(1.8, 0.01, 30, M.path, [0, 0.006, 0], [0, 1.2, 0]));
  const bar = P.pullupBar(); bar.position.set(1.4, 0, -1.4); scene.add(bar);
  const pb = P.parallelBars(); pb.position.set(2.4, 0, -0.6); pb.rotation.y = 0.4; scene.add(pb);
  const sg = P.postSign(['HORTO FLORESTAL', 'RIO BRANCO • AC'], 1.7, 0.65, { bg: '#1f6b3a', y: 1.75 }); sg.position.set(-0.55, 0, 0.5); sg.rotation.y = 0.25; scene.add(sg);
  const h = person('teen', 0.95); h.root.rotation.y = Math.PI / 2 - 0.25; scene.add(h.root);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      const d = t * 0.95;
      h.root.position.set(-1.8 + d * Math.cos(0.25), 0, -0.2 - d * Math.sin(0.25));
      pose(h, t, walk(t));
      move(c, t, D, [-0.8, 1.6, 5.4], [-0.3, 1.5, 4.6], [-0.7, 1.35, -0.3], [-0.2, 1.3, -0.4], { amp: 0.4 });
      return { dof: { aperture: 0 } };
    },
  };
}
function dipsShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 4, sunDir: [-3, 7, 4] });
  park(scene, { seed: 8, trees: 18, radius: [4, 13] });
  const pb = P.parallelBars(); scene.add(pb);
  const h = person('cali'); scene.add(h.root);
  const a = person('guyA'); a.root.position.set(0.8, 0, 1.0); scene.add(a.root);
  const b = person('guyB'); b.root.position.set(-0.8, 0, 1.2); scene.add(b.root);
  const c = cam(46);
  const hy = pb.userData.h, gap = pb.userData.gap;
  return {
    scene, camera: c,
    update(t) {
      const ph = (t * 0.8) % 1, down = 0.5 - 0.5 * Math.cos(ph * Math.PI * 2);
      h.root.position.y = hy + 0.68 - 1.41 - down * 0.3;
      h.setPose({ lHip: [-0.25, 0, 0.04], rHip: [-0.25, 0, -0.04], lKn: [1.3, 0, 0], rKn: [1.3, 0, 0], chest: [0.1 + down * 0.15, 0, 0], neck: [-0.1, 0, 0] });
      h.setMouth(0.1 + down * 0.3);
      grab(h, V(gap / 2, hy + 0.06, 0.05), V(-gap / 2, hy + 0.06, 0.05), { lPole: V(0.5, hy + 0.3, -1.2), rPole: V(-0.5, hy + 0.3, -1.2), hint: V(0, 0, 1) });
      const turn = smooth(range(t, 1.2, 2.0)), shock = smooth(range(t, 2.0, 2.4));
      for (const [g, side, t0] of [[a, -1, 0], [b, 1, 0.2]]) {
        const ww = 1 - smooth(range(t, 1.0 + t0, 1.6 + t0));
        const px = side * -0.62 - side * (1 - smooth(range(t, 0, 1.6 + t0))) * 1.0, pz = g.root.position.z;
        g.root.position.x = px;
        const walkYaw = side * Math.PI / 2, faceYaw = Math.atan2(-px, -pz);
        g.root.rotation.y = lerp(walkYaw, faceYaw, smooth(range(t, 1.1 + t0, 1.9 + t0)));
        pose(g, t, blend(walk(t + t0 * 3), STAND, 1 - ww), { neck: [-0.05 * shock, 0, 0] });
        g.setMouth(smooth(range(t, 2.1 + t0, 2.4 + t0)) * 0.95);
      }
      move(c, t, D, [0.3, 1.55, 5.4], [0.15, 1.6, 4.7], [0, 1.3, 0.4], [0, 1.35, 0.5], { amp: 0.5 });
      return { dof: dofAt(c, V(0, 1.6, 0), 0.0015) };
    },
  };
}

// ============ hustle: first stage, raffles, rice ============
function rafflesShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 3, sunDir: [-2, 6, 4], sky: SKY.indoor });
  scene.add(P.groundDisc(P.std(0xc9a27a, { roughness: 0.8 }), 30));
  scene.add(P.box(10, 4, 0.1, P.std(0xe8dcc6, { roughness: 0.9 }), [0, 2, -1.6]));
  const tb = P.table(1.3, 0.7); tb.position.set(-1.0, 0, 0.2); scene.add(tb);
  const tv = P.tv(); tv.position.set(-1.3, tb.userData.h, 0.1); scene.add(tv);
  const sn1 = P.sneaker(0xe0352b); sn1.position.set(-0.75, tb.userData.h, 0.25); sn1.rotation.y = 0.4; scene.add(sn1);
  const sn2 = P.sneaker(0xe0352b); sn2.position.set(-0.62, tb.userData.h, 0.2); sn2.rotation.y = 0.2; scene.add(sn2);
  for (const [x, z] of [[-1.3, 0.38], [-0.68, 0.46]]) { const s = P.sign('VENDE-SE', 0.3, 0.1, { bg: '#ffd84a', fg: '#c01a1a', radius: 10 }); s.position.set(x, tb.userData.h + 0.06, z); s.rotation.x = -0.6; scene.add(s); }
  const h = person('young'); h.root.position.set(0.35, 0, 0); scene.add(h.root);
  const sheet = P.raffleSheet(); scene.add(sheet);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const lift = easeOut(range(t, 1.6, 2.4));
      const sp = V(0.35, lerp(1.1, 1.26, lift), 0.45);
      sheet.position.copy(sp); sheet.rotation.set(-0.1, -0.15, Math.sin(t * 2) * 0.03);
      pose(h, t, STAND, { neck: [0.05, -0.15, 0] });
      grab(h, sp.clone().add(V(0.14, 0.12, -0.02)), sp.clone().add(V(-0.14, 0.12, -0.02)), { hint: V(0, 1, 0) });
      h.setMouth(0.3 + 0.2 * Math.sin(t * 8) * lift);
      move(c, t, D, [-1.0, 1.45, 2.4], [0.45, 1.5, 2.1], [-1.0, 0.95, 0.2], [0.35, 1.42, 0.2], { amp: 0.5 });
      return { dof: { aperture: 0 } };
    },
  };
}
function eatShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 2, sunDir: [-2, 6, 4], sky: SKY.indoor });
  scene.add(P.groundDisc(P.std(0xc9a27a, { roughness: 0.8 }), 30));
  scene.add(P.box(10, 4, 0.1, P.std(0xe8dcc6, { roughness: 0.9 }), [0, 2, -1.4]));
  const M = P.mats();
  const tb = P.table(1.0, 0.7); tb.position.set(0, 0, 0.62); scene.add(tb);
  const y = tb.userData.h;
  const pl = P.riceAndEggs(); pl.position.set(0, y, 0.48); scene.add(pl);
  for (const [x, z] of [[0.28, 0.45], [0.31, 0.52], [0.26, 0.56]]) scene.add(P.cyl(0.018, 0.018, 0.004, M.gold, [x, y + 0.003, z]));
  scene.add(P.box(0.4, 0.45, 0.4, M.black, [0, 0.225, -0.02]));
  const h = person('young'); scene.add(h.root);
  const fork = new THREE.Group(); fork.add(P.box(0.01, 0.004, 0.14, M.steel, [0, 0, 0.05])); h.j.rWr.add(fork); fork.position.set(0, -0.07, 0.03); fork.rotation.x = -0.6;
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      pose(h, t, SIT, { lHip: [-1.5, 0, 0.12], rHip: [-1.5, 0, -0.12], spine: [0.15, 0, 0], neck: [0.25, 0, 0] });
      const ph = 0.5 - 0.5 * Math.cos(t * Math.PI * 2 * 0.55);
      const T = V(-0.06, lerp(y + 0.07, 1.33, ph), lerp(0.44, 0.22, ph));
      grab(h, V(0.2, y + 0.03, 0.42), T, { hint: V(0, 0, 1) });
      h.setMouth(ph > 0.8 ? 0.5 : 0.1 + 0.15 * Math.abs(Math.sin(t * 9)));
      move(c, t, D, [0.25, y + 0.38, 1.05], [0.55, 1.4, 2.2], [0, y, 0.48], [0, 1.15, 0.3], { amp: 0.4 });
      return { dof: dofAt(c, V(0, y + 0.1, 0.45), 0.004) };
    },
  };
}

// ============ São Paulo, Pro Card, back home ============
function planeShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 12, sunDir: [-5, 9, 6] });
  scene.add(P.groundDisc(P.std(0x8e949c), 60));
  const sk = P.skyline(3, 28); sk.position.set(0, 0, -5); scene.add(sk);
  const sk2 = P.skyline(9, 22); sk2.position.set(3, 0, -11); sk2.scale.set(1, 1.3, 1); scene.add(sk2);
  const pl = P.airplane(); scene.add(pl);
  const c = cam(42);
  return {
    scene, camera: c,
    update(t) {
      const k = range(t, 0, D);
      pl.position.set(lerp(6, -7, k), lerp(9.5, 10.5, k), 0.5); pl.rotation.set(0.15, Math.PI - 0.15, -0.05);
      move(c, t, D, [0.8, 2.5, 13], [0.2, 2.8, 11.5], [1.5, 6.6, 0], [-1.5, 7.2, 0], { amp: 0.3 });
      return { dof: { aperture: 0 } };
    },
  };
}
function proCardShot({ makeStage }, D) {
  const st = stage(makeStage, { wall: 0x16367a });
  const scene = st.scene;
  const h = person('amateur'); scene.add(h.root);
  const card = new THREE.Group();
  card.add(P.box(0.34, 0.21, 0.012, P.mats().gold));
  const lab = P.sign('PRO CARD', 0.3, 0.12, { bg: null, fg: '#3a2200', emit: 0 }); lab.position.z = 0.007; card.add(lab);
  scene.add(card);
  const gl = glowSprite(0xffd060, 0.9); scene.add(gl);
  const cf = P.confetti(250, [0xffd36a, 0xffffff, 0x2a6fd6], [3.5, 2, 2.5], 3.0, 8); scene.add(cf);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const fall = easeOut(range(t, 0, 0.9)), up = easeInOut(range(t, 1.1, 1.8));
      const cp = up > 0 ? V(lerp(-0.12, -0.3, up), lerp(1.45, 2.12, up), lerp(0.42, 0.15, up)) : V(-0.12, lerp(3.0, 1.45, fall), 0.42);
      card.position.copy(cp); card.rotation.set(0, Math.sin(t * 2) * 0.25 * (1 - up), 0);
      gl.position.copy(cp).add(V(0, 0, -0.03)); gl.material.opacity = 0.6;
      const base = blend(BIG, { ...BIG, lSh: [-0.2, 0, 1.3], lEl: [0, 0, 1.9] }, up);
      pose(h, t, base, { neck: [-0.15 * up, 0, 0] });
      h.root.updateMatrixWorld(true);
      if (t > 0.8) grab(h, null, cp.clone().add(V(0, -0.09, -0.02)), { rPole: V(-1.2, 1.0, 0.3), hint: V(0, 0, 1) });
      h.setMouth(smooth(range(t, 1.5, 1.8)) * 0.85);
      cf.update(t - 1.6);
      orbit(c, t, D, { center: [0, 1.5, 0], r0: 2.9, r1: 2.3, a0: -0.25, a1: 0.1, y0: 1.2, y1: 1.4, look: [-0.05, 1.65, 0] });
      return { dof: dofAt(c, V(0, 1.6, 0.2), 0.002), bloom: 0.6 };
    },
  };
}
function benchShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 4, sunDir: [-6, 3, 2], sun: 2.4, sky: SKY.dusk, hemi: 0.5 });
  scene.userData.key.color.set(0xffb27a);
  park(scene, { seed: 13, trees: 16, radius: [3.5, 12] });
  const bn = P.bench(); scene.add(bn);
  const h = person('young'); h.root.position.set(0, 0, 0.08); scene.add(h.root);
  const env = P.envelope('CONVITE'); scene.add(env);
  const gl = glowSprite(0xffe0a0, 0.5); scene.add(gl);
  const c = cam(36);
  const TA = 3.85;
  return {
    scene, camera: c,
    update(t) {
      const got = smooth(range(t, TA, TA + 0.45));
      pose(h, t, SIT, { neck: [lerp(0.45, -0.05, got), 0, 0], head: [lerp(0.15, 0, got), 0, 0], spine: [lerp(0.3, 0.1, got), 0, 0] });
      const k = easeOut(range(t, TA - 1.0, TA));
      const ep = V(lerp(2.5, 0, k), lerp(2.2, 1.0, k) + Math.sin(k * Math.PI) * 0.3, lerp(0.6, 0.5, k));
      env.position.copy(ep); env.rotation.set(0, lerp(-1.5, 0, k), Math.sin(t * 6) * 0.15 * (1 - k));
      env.visible = t > TA - 1.0; gl.visible = env.visible; gl.position.copy(ep).add(V(0, 0, -0.02)); gl.material.opacity = 0.5;
      if (got > 0) grab(h, ep.clone().add(V(0.13, -0.05, -0.02)), ep.clone().add(V(-0.13, -0.05, -0.02)), { hint: V(0, 1, 0) });
      else grab(h, V(0.14, 0.58, 0.5), V(-0.14, 0.58, 0.5), { hint: V(0, 1, 0) });
      h.setMouth(got * 0.5);
      move(c, t, D, [0.9, 1.05, 2.8], [0.35, 1.05, 2.0], [0, 0.95, 0.2], [0, 1.0, 0.3], { amp: 0.4 });
      return { dof: dofAt(c, V(0, 1.1, 0.2), 0.003), exposure: 0.95 };
    },
  };
}
function mansionShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 10, sunDir: [-5, 9, 6] });
  park(scene, { seed: 14, trees: 14, radius: [9, 18] });
  const ms = P.mansion(); ms.position.set(0, 0, -7); scene.add(ms);
  const M = P.mats();
  scene.add(P.box(1.4, 0.01, 8, M.path, [0, 0.006, -1.5]));
  const wall = P.box(2.6, 1.0, 0.25, P.std(0x33363c), [-2.2, 0.5, -0.8]); scene.add(P.shadow(wall));
  const s = P.sign(['MANSÃO', 'MAROMBA'], 2.2, 0.8, { bg: '#111111', fg: '#ffd36a', radius: 12 }); s.position.set(-2.2, 1.45, -0.7); scene.add(s);
  const h = person('young'); h.root.rotation.y = Math.PI; scene.add(h.root);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      h.root.position.set(0, 0, 1.6 - t * 0.95);
      pose(h, t, walk(t));
      move(c, t, D, [0.6, 1.1, 4.0], [0.3, 3.6, 6.2], [0, 1.4, -1], [0, 2.0, -5], { amp: 0.4 });
      return { dof: { aperture: 0 } };
    },
  };
}

// ============ sponsors, dinosaur, rocket ============
function sponsorShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 3 });
  const h = person('casual'); scene.add(h.root);
  const labels = [['WHEY', 0xe0352b], ['CREATINA', 0x2a6fd6], ['PRÉ-TREINO', 0x1d1d22], ['WHEY', 0xf5a623], ['BCAA', 0x1d8a3e], ['CREATINA', 0x8a2be2], ['WHEY', 0x2a6fd6], ['WHEY', 0xe0352b], ['GLUTAMINA', 0x1d1d22]];
  const tubs = labels.map(([l, col], i) => {
    const tb = P.tub(col, l); tb.scale.setScalar(1.4); scene.add(tb);
    const a = -1.3 + i * 0.33, r = 0.75 + (i % 3) * 0.3;
    return { tb, x: Math.sin(a) * r, z: Math.cos(a) * r * 0.6 + 0.2, t0: 0.15 + i * 0.22, spin: (i % 2 ? 1 : -1) * (2 + i * 0.3), yaw: i * 0.7 };
  });
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const ch = smooth(range(t, 0.4, 0.8));
      pose(h, t, blend(BIG, CHEER, ch));
      h.root.position.y = ch * Math.max(0, Math.sin((t - 0.4) * 6)) * 0.06;
      h.setMouth(ch * 0.8);
      for (const o of tubs) {
        const a = t - o.t0, fallT = 0.75;
        if (a < 0) { o.tb.visible = false; continue; }
        o.tb.visible = true;
        if (a < fallT) { const k = a / fallT; o.tb.position.set(o.x, lerp(5, 0, k * k), o.z); o.tb.rotation.set(o.spin * (1 - k), o.yaw, o.spin * 0.5 * (1 - k)); }
        else { const b = a - fallT; o.tb.position.set(o.x, 0.25 * Math.exp(-5 * b) * Math.abs(Math.sin(b * 9)), o.z); o.tb.rotation.set(0, o.yaw, 0); }
      }
      move(c, t, D, [0.4, 1.3, 4.0], [0.2, 1.4, 3.3], [0, 1.0, 0], [0, 1.1, 0], { amp: 0.5 });
      return { dof: dofAt(c, V(0, 1.2, 0), 0.0015) };
    },
  };
}
function dinoShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 5, sunDir: [-3, 7, 4] });
  park(scene, { seed: 9, trees: 30, radius: [2.8, 12] });
  const dn = P.dino(); dn.scale.setScalar(1.25); dn.position.set(0.75, 0, -0.5); dn.rotation.y = -0.55; scene.add(dn);
  const h = person('pro'); h.root.position.set(-0.3, 0, 0.35); h.root.rotation.y = 0.25; scene.add(h.root);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      const roar = smooth(range(t, 0.4, 0.8)) * (1 - smooth(range(t, 1.8, 2.2))) + smooth(range(t, 2.8, 3.1)) * (1 - smooth(range(t, 3.9, 4.3)));
      dn.roar(roar + 0.05 * Math.sin(t * 20) * roar);
      dn.userData.body.rotation.x = -0.05 * roar;
      const k = easeOut(range(t, 0.8, 1.2));
      pose(h, t, blend(BIG, DBI, k), { neck: [-0.1 * k, -0.2, 0] });
      h.setMouth(k * smooth(range(t, 1.0, 1.3)) * (1 - smooth(range(t, 2.4, 2.7))) * 0.9);
      move(c, t, D, [0.4, 1.2, 5.4], [0.3, 1.25, 4.7], [0.25, 1.6, 0], [0.25, 1.65, 0], { amp: 0.6 + roar });
      return { dof: dofAt(c, V(0, 1.5, 0), 0.0015) };
    },
  };
}
function rocketShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 6, sunDir: [-3, 8, 5] });
  park(scene, { seed: 15, trees: 12, radius: [8, 16] });
  scene.add(P.cyl(1.6, 1.8, 0.2, P.std(0x9a9ea6), [0, 0.1, 0], [0, 0, 0], 40));
  const rk = P.rocket(); rk.scale.setScalar(1.3); scene.add(rk);
  const sm = P.smoke(40, 9); scene.add(sm);
  const gl = glowSprite(0xffa040, 3); scene.add(gl);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      const ig = range(t, 0.1, 0.4), a = Math.max(0, t - 0.5);
      const y = 0.2 + 0.5 * 5 * a * a + a * 0.6;
      rk.position.set(Math.sin(t * 30) * 0.01 * ig, y, 0);
      rk.flame.scale.set(1, (0.4 + 0.8 * ig) * (1 + 0.15 * Math.sin(t * 50)), 1);
      rk.flame.visible = ig > 0;
      gl.position.set(0, y - 0.2, 0.3); gl.material.opacity = ig * 0.9;
      sm.update(t - 0.2, V(0, 0.3, 0));
      const ly = Math.max(1.8, y + 1.6);
      const s = shake(t, 1 + 3 * ig * Math.exp(-a));
      place(c, [2.6 + s[0], 1.1 + s[1] + Math.max(0, y - 3) * 0.4, 6.5], [0, ly, 0]);
      return { dof: { aperture: 0 }, bloom: 0.8 };
    },
  };
}

// ============ podiums ============
function podiumShot({ makeStage }, D, { spot = 0, labels = ['2º', '1º', '3º'], wall = 0x3a1a6a, year = null, medal = 'silver', mlabel = '2º', twice = false, dim = false } = {}) {
  const st = stage(makeStage, { wall, sun: dim ? 1.0 : 2.2, spot: dim ? 1.3 : 3.5, beams: !dim });
  const scene = st.scene;
  const pd = P.podium(labels); scene.add(pd);
  const tops = pd.userData.tops;
  const order = [0, 1, 2];
  const people = order.map(i => {
    const isR = i === spot;
    const h = person(isR ? 'pro' : 'rival'); h.root.position.copy(tops[i]); scene.add(h.root);
    return { h, isR, i };
  });
  const R = people.find(p => p.isR).h;
  const md = P.medal(medal, mlabel); md.scale.setScalar(1.5); R.j.chest.add(md); md.position.set(0, 0.0, 0.25);
  if (year) { const s = P.sign(year, 1.8, 0.7, { bg: null, fg: '#ffd36a', glow: true }); s.position.set(tops[spot].x, 3.4, -3.4); scene.add(s); }
  const big = [];
  if (twice) for (const [x, t0] of [[-0.42, 0.6], [-0.08, 1.2]]) { const m = P.medal('silver', '2º'); m.scale.setScalar(3.2); scene.add(m); big.push({ m, x, t0 }); }
  const x2 = twice ? P.sign('2x', 0.5, 0.35, { bg: null, fg: '#ffffff', glow: true }) : null; if (x2) scene.add(x2);
  const c = cam(36);
  const rp = tops[spot];
  return {
    scene, camera: c,
    update(t) {
      for (const p of people) {
        if (p.isR) {
          const fist = dim ? 0 : smooth(range(t, 1.6, 2.0));
          pose(p.h, t, BIG, { neck: [dim ? 0.35 : -0.05, dim ? 0.1 : 0, 0], rSh: [lerp(0.05, -0.2, fist), 0, lerp(-0.42, -2.5, fist)], rEl: [0, 0, lerp(0, -0.6, fist)] });
          p.h.setMouth(dim ? 0 : fist * 0.3);
        } else pose(p.h, t + p.i, p.i === 1 ? CHEER : BIG);
      }
      for (const b of big) { const s = popIn(t, b.t0); b.m.position.set(rp.x + b.x + 0.9, rp.y + 2.05 + Math.sin(t * 2 + b.x) * 0.03, 0.6); b.m.scale.setScalar(1.8 * s); b.m.rotation.y = Math.sin(t * 1.5 + b.x) * 0.4; }
      if (x2) { x2.position.set(rp.x + 0.65, rp.y + 2.42, 0.6); x2.scale.setScalar(popIn(t, 1.6)); }
      orbit(c, t, D, { center: [rp.x, rp.y + 1.3, 0], r0: 3.1, r1: 2.5, a0: -0.12 + rp.x * 0.08, a1: 0.1 + rp.x * 0.08, y0: rp.y + 1.25, y1: rp.y + 1.4, look: [rp.x + (twice ? 0.3 : 0), rp.y + 1.55, 0] });
      return { dof: dofAt(c, V(rp.x, rp.y + 1.5, 0), 0.0015), exposure: dim ? 0.85 : 1.0, bloom: 0.5 };
    },
  };
}
function fourthShot({ makeStage }, D) {
  const st = stage(makeStage, { wall: 0x14233f, sun: 0.9, spot: 0.0, beams: false, rimColor: 0x6a8cff });
  const scene = st.scene;
  const pd = P.podium(['2º', '1º', '3º']); pd.position.x = -0.9; scene.add(pd);
  pd.userData.tops.forEach((p, i) => { const r = person('rival'); r.root.position.copy(p).add(V(-0.9, 0, 0)); r.root.userData.i = i; scene.add(r.root); r.root.userData.h = r; });
  const h = person('pro'); h.root.position.set(1.45, 0, 0.5); h.root.rotation.y = -0.15; scene.add(h.root);
  const mk = P.sign('4º', 0.45, 0.45, { bg: null, fg: '#9ab4ff', glow: true }); mk.position.set(0.95, 1.95, 0.7); scene.add(mk);
  const sp = new THREE.SpotLight(0x9ab4ff, 2.2, 0, 0.3, 0.8, 0); sp.position.set(1.6, 6, 2); sp.target.position.set(1.45, 0.5, 0.5); scene.add(sp, sp.target);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      scene.traverse(o => { if (o.userData.h) pose(o.userData.h, t + o.userData.i, o.userData.i === 1 ? CHEER : BIG); });
      pose(h, t, STAND, { neck: [0.4, 0, 0], head: [0.15, 0, 0], chest: [0.08, 0, 0] });
      move(c, t, D, [2.5, 1.55, 3.4], [2.1, 1.6, 2.6], [1.0, 1.25, 0], [1.3, 1.35, 0.3], { amp: 0.4 });
      return { dof: dofAt(c, V(1.45, 1.5, 0.5), 0.002), exposure: 0.9 };
    },
  };
}
function teamShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 3 });
  const h = person('casual'); scene.add(h.root);
  scene.add(P.shadow(P.box(0.8, 0.35, 0.6, P.mats().white, [0, 0.175, -1.5])));
  const team = [['team1', -0.62, 0.1, 0, -0.9], ['team2', 0.62, 0.35, 0, -0.9], ['team3', 0.0, 0.6, 0.35, -1.5]].map(([k, x, t0, y, z]) => { const p = person(k, 0.97); p.root.position.set(x, y, z); scene.add(p.root); return { p, t0 }; });
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      pose(h, t, BIG); handsOnHips(h, 0.25); h.setMouth(0.1);
      for (const { p, t0 } of team) { p.root.scale.setScalar(0.97 * popIn(t, t0, 0.4)); pose(p, t + t0, STAND, { neck: [0, 0, 0.05] }); handsOnHips(p, 0.22); p.setMouth(0.3); }
      move(c, t, D, [0.3, 1.6, 4.6], [0.15, 1.6, 4.0], [0, 1.45, -0.5], [0, 1.45, -0.5], { amp: 0.4 });
      return { dof: dofAt(c, V(0, 1.4, 0), 0.0012) };
    },
  };
}
function drumrollShot({ makeStage }, D) {
  const st = stage(makeStage, { wall: 0x1a1030, sun: 0.0, spot: 0 });
  const scene = st.scene;
  const h = person('pro'); scene.add(h.root);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      st.beams.forEach((b, i) => { b.material.uniforms.op.value = b.userData.op * smooth(range(t, 0.2 + i * 0.25, 0.35 + i * 0.25)); });
      st.spot.intensity = 4 * smooth(range(t, 0.85, 1.05));
      scene.userData.rim.intensity = 3.5;
      pose(h, t, BIG, { neck: [-0.05, 0, 0] });
      move(c, t, D, [0, 1.3, 4.3], [0, 1.45, 3.4], [0, 1.3, 0], [0, 1.4, 0], { amp: 0.3 });
      return { dof: { aperture: 0 }, exposure: 0.95 };
    },
  };
}

// ============ top of the world ============
function holdFlag(h, fl, side = 'r') {
  const s = side === 'r' ? -1 : 1;
  h.root.updateMatrixWorld(true);
  const hand = h.root.localToWorld(V(s * 0.42, 1.95, 0.12));
  grab(h, side === 'l' ? hand : null, side === 'r' ? hand : null, { lPole: h.root.localToWorld(V(1.2, 1.2, 0.2)), rPole: h.root.localToWorld(V(-1.2, 1.2, 0.2)) });
  fl.position.copy(hand).add(V(0, -1.5, 0));
}
function globeShot({ makeStage }, D) {
  const scene = makeStage({ sky: SKY.space, ground: [0, 0], hemi: 0.4, sun: 2.6, sunDir: [-4, 6, 6] });
  scene.add(stars());
  const gb = P.globe(); gb.scale.setScalar(1.8); gb.position.set(0, -1.8, 0); gb.receiveShadow = true; scene.add(gb);
  const h = person('pro'); scene.add(h.root);
  const fl = P.flag(1.2, 2.8); scene.add(fl);
  const gl = glowSprite(0x6aa0ff, 7); gl.position.set(0, -1.8, -1); gl.material.opacity = 0.35; scene.add(gl);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      gb.rotation.y = t * 0.25;
      pose(h, t, BIG, { lSh: [-0.1, 0, 2.6], lEl: [0, 0, 0.3], neck: [-0.15, 0, 0] });
      h.setMouth(0.7);
      holdFlag(h, fl, 'r'); fl.update(t, 1.2);
      orbit(c, t, D, { center: [0, 1.2, 0], r0: 6.0, r1: 5.4, a0: -0.45, a1: 0.35, y0: 0.6, y1: 1.4, look: [0.2, 1.5, 0] });
      return { dof: { aperture: 0 }, bloom: 0.6 };
    },
  };
}
function familyShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 4, sunDir: [-3, 7, 5] });
  park(scene, { seed: 17, trees: 14, radius: [4, 12] });
  const hs = P.house(0xf3f1ec, 0x5a5a62); hs.scale.setScalar(1.4); hs.position.set(0.5, 0, -3.5); scene.add(hs);
  const r = person('casual'); r.root.position.set(-0.15, 0, 0); scene.add(r.root);
  const w = person('wife', 0.93); w.root.position.set(0.45, 0, -0.05); w.root.rotation.y = -0.15; scene.add(w.root);
  const s = person('son', 0.52); s.root.position.set(-0.5, 0, 0.55); scene.add(s.root);
  const d = person('daughter', 0.46); d.root.position.set(0.15, 0, 0.6); scene.add(d.root);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      pose(r, t, BIG, { neck: [0.05, 0.1, 0] }); grab(r, null, V(-0.48, 1.06, 0.52), { rPole: V(-1.5, 1.3, 0.2), hint: V(0, 1, 0) });
      pose(w, t + 1, STAND, { rSh: [0.1, 0, -0.6], neck: [0, -0.2, 0.05] });
      pose(s, t + 2, STAND, { rSh: [-0.1, 0, -2.5], rEl: [0, 0, -0.5 + 0.4 * Math.sin(t * 8)] });
      pose(d, t + 3, STAND, { lSh: [-0.1, 0, 2.5], lEl: [0, 0, 0.5 + 0.4 * Math.sin(t * 7 + 1)] });
      for (const p of [r, w]) p.setMouth(0.25); s.setMouth(0.5); d.setMouth(0.5);
      move(c, t, D, [0.6, 1.3, 4.7], [0.1, 1.3, 3.9], [0, 1.05, 0], [0, 1.1, 0.1], { amp: 0.4 });
      return { dof: dofAt(c, V(0, 1.2, 0.2), 0.0015) };
    },
  };
}
function trainBeltShot({ makeStage }, D) {
  const scene = gym(makeStage, { sign: false });
  const h = person('gymPro'); h.root.position.set(-0.45, 0, 0.5); scene.add(h.root);
  const dl = P.dumbbell(1.0), dr = P.dumbbell(1.0); h.j.lWr.add(dl); h.j.rWr.add(dr); dl.position.set(0, -0.06, 0); dr.position.set(0, -0.06, 0);
  const ped = P.box(0.5, 1.0, 0.4, P.mats().gloss, [0.95, 0.5, -0.7]); scene.add(P.shadow(ped));
  const bl = P.belt(); bl.scale.setScalar(0.75); bl.position.set(0.95, 1.35, -0.65); bl.rotation.x = -0.15; scene.add(bl);
  const gl = glowSprite(0xffcc55, 1.4); gl.position.set(0.95, 1.35, -0.8); scene.add(gl);
  const c = cam(36);
  const TR = 2.6;
  return {
    scene, camera: c,
    update(t) {
      const l = 0.5 - 0.5 * Math.cos(t * Math.PI * 2 * 0.7), r = 0.5 - 0.5 * Math.cos(t * Math.PI * 2 * 0.7 + Math.PI);
      pose(h, t, BIG, { lSh: [0.05, 0, 0.35], rSh: [0.05, 0, -0.35], lEl: [-0.3 - 1.9 * l, 0, 0], rEl: [-0.3 - 1.9 * r, 0, 0], neck: [0.05, 0, 0] });
      h.setMouth(0.2 + 0.2 * Math.max(l, r));
      bl.rotation.y = Math.sin(t * 0.8) * 0.15; gl.material.opacity = 0.5 + 0.2 * Math.sin(t * 3);
      const k = easeInOut(range(t, TR, TR + 1.1));
      const look = [lerp(-0.45, 0.95, k), lerp(1.4, 1.35, k), lerp(0.5, -0.65, k)];
      const pos = [lerp(0.3, 1.2, k), 1.45, lerp(2.7, 1.3, k)];
      const s = shake(t, 0.5); place(c, [pos[0] + s[0], pos[1] + s[1], pos[2]], look);
      return { dof: dofAt(c, V(...look), 0.004, 0.012), bloom: 0.6 };
    },
  };
}
function flagStageShot({ makeStage }, D) {
  const st = stage(makeStage, { wall: 0x0f5a2e });
  const scene = st.scene;
  const h = person('pro'); scene.add(h.root);
  const fl = P.flag(1.3, 3.0); scene.add(fl);
  const cf = P.confetti(400, undefined, [4.5, 3, 3], 3.3, 11); scene.add(cf);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      pose(h, t, BIG, { lSh: [-0.15, 0, 1.45], lEl: [0, 0, 1.95], neck: [-0.12, 0, 0] });
      h.setMouth(0.1);
      holdFlag(h, fl, 'r'); fl.update(t, 1.3); cf.update(t);
      orbit(c, t, D, { center: [0, 1.5, 0], r0: 4.6, r1: 4.0, a0: 0.35, a1: -0.25, y0: 0.9, y1: 1.5, look: [0.1, 2.0, 0] });
      return { dof: dofAt(c, V(0, 1.6, 0), 0.0015), bloom: 0.6 };
    },
  };
}
function questionShot({ makeStage }, D) {
  const st = stage(makeStage, { wall: 0x3a1a6a });
  const scene = st.scene;
  const ped = P.box(0.5, 1.0, 0.5, P.mats().gloss, [0.5, 0.5, 0]); scene.add(P.shadow(ped));
  const tr = P.trophy(1.3); tr.position.set(0.5, 1.0, 0); scene.add(tr);
  const q = P.sign('?', 0.6, 0.8, { bg: null, fg: '#ffd36a', glow: true }); scene.add(q);
  const gl = glowSprite(0xffd060, 1.1); gl.position.set(0.5, 1.45, -0.1); scene.add(gl);
  const h = person('pro'); h.root.position.set(-0.35, 0, 0.2); h.root.rotation.y = 0.15; scene.add(h.root);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      q.position.set(0.5, 2.15 + Math.sin(t * 2) * 0.05, 0); q.rotation.y = Math.sin(t * 1.5) * 0.4; q.scale.setScalar(popIn(t, 0.2));
      tr.rotation.y = t * 0.6;
      const pt = smooth(range(t, 0.7, 1.1));
      pose(h, t, BIG, { rSh: [lerp(0.05, -1.45, pt), lerp(0, 0.25, pt), lerp(-0.42, -0.1, pt)], rEl: [lerp(-0.35, -0.05, pt), 0, 0], neck: [0, lerp(0.5, 0.0, pt), 0] });
      h.setMouth(0.25 + 0.25 * Math.abs(Math.sin(t * 8)));
      move(c, t, D, [0.3, 1.5, 4.3], [0.2, 1.5, 3.7], [0.1, 1.6, 0], [0.1, 1.6, 0], { amp: 0.4 });
      return { dof: dofAt(c, V(0, 1.6, 0.2), 0.0015), bloom: 0.6 };
    },
  };
}
function ctaShot({ makeStage }, D) {
  const scene = makeStage({ shadowSize: 3 });
  const h = person('casual'); scene.add(h.root);
  const bub = P.sign(['COMENTA', 'AQUI!'], 0.8, 0.45, { bg: '#ffffff', fg: '#1a1a1a', radius: 60 }); scene.add(bub);
  const tail = P.mesh(new THREE.ConeGeometry(0.08, 0.2, 3), P.std(0xffffff), [0, 0, 0], [0, 0, 0]); scene.add(tail);
  const btn = P.sign('+ SEGUIR', 0.62, 0.2, { bg: '#e0352b', fg: '#ffffff', radius: 120, emit: 0.5 }); scene.add(btn);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const pt = smooth(range(t, 0.1, 0.4));
      pose(h, t, BIG, { rSh: [lerp(0.05, -0.75, pt), 0, lerp(-0.42, -0.1, pt)], rEl: [lerp(-0.35, -0.1, pt), 0, 0], neck: [0.1 * pt, 0, 0] });
      h.setMouth(0.3 + 0.25 * Math.abs(Math.sin(t * 8)));
      const sb = popIn(t, 0.15); bub.position.set(-0.3, 2.35, 0.2); bub.scale.setScalar(sb); bub.rotation.z = Math.sin(t * 2) * 0.04;
      tail.position.set(-0.2, 2.08, 0.2); tail.rotation.z = Math.PI - 0.5; tail.scale.setScalar(sb);
      btn.position.set(0.42, 2.02, 0.3); btn.scale.setScalar(popIn(t, 1.2) * (1 + 0.04 * Math.sin(t * 6)));
      move(c, t, D, [0.2, 1.6, 4.4], [0.1, 1.65, 3.9], [0, 1.75, 0], [0, 1.8, 0], { amp: 0.4 });
      return { dof: dofAt(c, V(0, 1.6, 0), 0.001) };
    },
  };
}

// ============ the edit ============
const PLAN = [
  [0.0, a => pullups(a, 3.4, { sepia: 0.9 })],
  [3.4, a => riceShot(a, 1.6, { sepia: 0.9 })],
  [5.0, a => trophyShot(a, 4.8, { wall: 0x0f5a2e, label: null, crowdOn: true })],
  [9.8, a => flexShot(a, 1.9, {})],
  [11.7, a => townShot(a, 3.25)],
  [14.95, a => kidHome(a, 2.65)],
  [17.6, a => footballShot(a, 4.1)],
  [21.7, a => capoeiraShot(a, 1.4)],
  [23.1, a => curlShot(a, 3.1)],
  [26.2, a => walletShot(a, 3.7)],
  [29.9, a => resolveShot(a, 1.3)],
  [31.2, a => hortoShot(a, 2.1)],
  [33.3, a => pullups(a, 4.4, { who: 'cali', view: 1 })],
  [37.7, a => dipsShot(a, 4.4)],
  [42.1, a => flexShot(a, 2.2, { who: 'amateur', wall: 0x16367a, flagOn: false, crowdOn: true, r0: 3.8, r1: 3.2 })],
  [44.3, a => rafflesShot(a, 5.1)],
  [49.4, a => eatShot(a, 4.1)],
  [53.5, a => planeShot(a, 3.1)],
  [56.6, a => proCardShot(a, 2.95)],
  [59.55, a => benchShot(a, 4.95)],
  [64.5, a => mansionShot(a, 2.7)],
  [67.2, a => sponsorShot(a, 3.8)],
  [71.0, a => dinoShot(a, 4.45)],
  [75.45, a => rocketShot(a, 2.25)],
  [77.7, a => trophyShot(a, 2.9, { wall: 0x6a1a1a, label: 'OHIO 2023', raiseAt: 0.1, conf: 0.5, view: 1 })],
  [80.6, a => podiumShot(a, 2.7, { spot: 0, twice: true })],
  [83.3, a => fourthShot(a, 3.4)],
  [86.7, a => teamShot(a, 1.8)],
  [88.5, a => drumrollShot(a, 1.2)],
  [89.7, a => trophyShot(a, 5.3, { wall: 0x0f5a2e, label: '2025', crowdOn: true, raiseAt: 0.4, conf: 1.2 })],
  [95.0, a => globeShot(a, 1.9)],
  [96.9, a => familyShot(a, 3.4)],
  [100.3, a => flexShot(a, 2.9, { wall: 0x5a3a0a, label: 'RAMON DINO', crowdOn: true, flagOn: false, r0: 3.9, r1: 3.3 })],
  [103.2, a => podiumShot(a, 4.1, { spot: 2, wall: 0x3a1a6a, year: '2026', medal: 'bronze', mlabel: '3º' })],
  [107.3, a => trainBeltShot(a, 4.8)],
  [112.1, a => flagStageShot(a, 4.5)],
  [116.6, a => questionShot(a, 3.9)],
  [120.5, a => ctaShot(a, DURATION - 120.5)],
];
export const SHOTS = PLAN.map(([start, build], i) => ({ start, end: i + 1 < PLAN.length ? PLAN[i + 1][0] : DURATION + 1, build }));
